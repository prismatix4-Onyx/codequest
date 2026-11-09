import asyncio
import io
import json
import os
import sys
import time
import traceback
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="CODEQUEST Execution Worker",
    version="2.0.0",
    description="Isolated Python Execution and Deterministic Test Case Runner",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MAX_OUTPUT_CHARS = 50000
DEFAULT_TIMEOUT_SECONDS = 4.0

# Forbidden symbols/modules to prevent host compromise
RESTRICTED_KEYWORDS = [
    "__import__('os').system",
    "import subprocess",
    "from subprocess",
    "import socket",
    "from socket",
    "import shutil",
    "shutil.rmtree",
    "ctypes",
]


class TestCase(BaseModel):
  id: str
  description: str
  input: str = ""
  expectedOutput: str
  isHidden: bool = False


class ExecutionRequest(BaseModel):
  code: str
  language: str = "python"
  testCases: List[TestCase] = []
  timeoutSeconds: Optional[float] = DEFAULT_TIMEOUT_SECONDS


class TestCaseResult(BaseModel):
  testId: str
  description: str
  passed: bool = False
  actualOutput: str
  expectedOutput: str
  error: Optional[str] = None
  isHidden: bool = False


class ExecutionResponse(BaseModel):
  status: str  # 'passed' | 'failed' | 'syntax_error' | 'runtime_error' | 'timeout' | 'security_violation'
  stdout: str
  stderr: str
  executionTimeMs: float
  allPassed: bool
  testResults: List[TestCaseResult]
  error: Optional[str] = None
  feedback: Optional[str] = None


@app.get("/health")
def health_check():
  return {
      "status": "ok",
      "service": "codequest-execution-worker",
      "version": "2.0",
      "python_version": sys.version,
  }


@app.post("/execute", response_model=ExecutionResponse)
async def execute_code(req: ExecutionRequest):
  # 1. Pre-execution static security audit
  for keyword in RESTRICTED_KEYWORDS:
    if keyword in req.code:
      return ExecutionResponse(
          status="security_violation",
          stdout="",
          stderr="Security Exception: Restricted module or system call detected.",
          executionTimeMs=0,
          allPassed=False,
          testResults=[],
          error="Sandbox violation",
          feedback="Your program contains restricted operating system or network calls.",
      )

  # 2. Syntax validation
  try:
    compile(req.code, "<learner_script>", "exec")
  except SyntaxError as se:
    error_msg = f"SyntaxError: {se.msg} (line {se.lineno})"
    return ExecutionResponse(
        status="syntax_error",
        stdout="",
        stderr=error_msg,
        executionTimeMs=0,
        allPassed=False,
        testResults=[],
        error=error_msg,
        feedback="Verify code indentation, matching parentheses, and colons.",
    )

  timeout = min(req.timeoutSeconds or DEFAULT_TIMEOUT_SECONDS, 8.0)
  test_results: List[TestCaseResult] = []
  first_run_stdout = ""
  first_run_stderr = ""
  overall_start_time = time.perf_counter()

  # If no test cases are passed, run code once to test execution
  cases_to_run = req.testCases if req.testCases else [
      TestCase(id="default-run", description="Standard Run", expectedOutput="")
  ]

  for tc in cases_to_run:
    start_time = time.perf_counter()

    # Wrap code with input redirection and safe sandbox
    runner_code = f"""
import sys, io

test_input = {repr(tc.input)}
sys.stdin = io.StringIO(test_input)

{req.code}
"""

    try:
      proc = await asyncio.create_subprocess_exec(
          sys.executable,
          "-s",
          "-S",
          "-u",
          "-c",
          runner_code,
          stdout=asyncio.subprocess.PIPE,
          stderr=asyncio.subprocess.PIPE,
      )

      try:
        raw_stdout, raw_stderr = await asyncio.wait_for(
            proc.communicate(), timeout=timeout
        )
        duration_ms = (time.perf_counter() - start_time) * 1000

        stdout_str = raw_stdout.decode("utf-8", errors="replace")[
            :MAX_OUTPUT_CHARS
        ]
        stderr_str = raw_stderr.decode("utf-8", errors="replace")[
            :MAX_OUTPUT_CHARS
        ]

        if not first_run_stdout:
          first_run_stdout = stdout_str
        if not first_run_stderr:
          first_run_stderr = stderr_str

        # Evaluate against expected output
        norm_actual = stdout_str.strip().replace("\r\n", "\n")
        norm_expected = tc.expectedOutput.strip().replace("\r\n", "\n")

        # Either exact match or if expected is contained
        passed = (
            (proc.returncode == 0)
            and (
                norm_expected in norm_actual
                if norm_expected
                else proc.returncode == 0
            )
        )

        test_results.append(
            TestCaseResult(
                testId=tc.id,
                description=tc.description,
                passed=passed,
                actualOutput=norm_actual if not tc.isHidden else "[HIDDEN TEST]",
                expectedOutput=(
                    norm_expected if not tc.isHidden else "[HIDDEN TEST]"
                ),
                error=stderr_str if proc.returncode != 0 else None,
                isHidden=tc.isHidden,
            )
        )

        if proc.returncode != 0 and not tc.isHidden:
          return ExecutionResponse(
              status="runtime_error",
              stdout=first_run_stdout,
              stderr=stderr_str,
              executionTimeMs=duration_ms,
              allPassed=False,
              testResults=test_results,
              error=stderr_str,
              feedback=f"Runtime error encountered: {stderr_str.splitlines()[-1] if stderr_str.splitlines() else 'Execution failed'}",
          )

      except asyncio.TimeoutError:
        try:
          proc.kill()
        except Exception:
          pass
        return ExecutionResponse(
            status="timeout",
            stdout=first_run_stdout,
            stderr="Execution timed out (exceeded limit).",
            executionTimeMs=timeout * 1000,
            allPassed=False,
            testResults=test_results,
            error=f"Timeout: Execution exceeded {timeout}s limit.",
            feedback="Your program appears to have an infinite loop or blocking call.",
        )

    except Exception as ex:
      return ExecutionResponse(
          status="system_error",
          stdout=first_run_stdout,
          stderr=str(ex),
          executionTimeMs=0,
          allPassed=False,
          testResults=test_results,
          error=str(ex),
          feedback="System error executing script in sandbox worker.",
      )

  total_duration_ms = (time.perf_counter() - overall_start_time) * 1000
  all_passed = all(t.passed for t in test_results)

  return ExecutionResponse(
      status="passed" if all_passed else "failed",
      stdout=first_run_stdout,
      stderr=first_run_stderr,
      executionTimeMs=total_duration_ms,
      allPassed=all_passed,
      testResults=test_results,
      feedback=(
          "Mission telemetry verified! Subroutines synchronized."
          if all_passed
          else "Output did not match expected telemetry criteria."
      ),
  )


if __name__ == "__main__":
  import uvicorn

  uvicorn.run(app, host="0.0.0.0", port=8002)
