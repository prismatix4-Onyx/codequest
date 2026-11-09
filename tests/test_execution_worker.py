import asyncio
import os
import sys

sys.path.insert(0, os.path.abspath('.'))
# import with relative path
import importlib.util

spec = importlib.util.spec_from_file_location(
    'execution_worker', 'apps/execution-worker/main.py'
)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)


async def main():
  req = mod.ExecutionRequest(
      code=(
          'print("STATION: AETHELGARD")\nprint("REACTOR_LEVEL:'
          ' 100")\nprint("PROTOCOL_STATUS: ONLINE")'
      ),
      language='python',
      testCases=[
          mod.TestCase(
              id='tc-1',
              description='Check station output',
              expectedOutput='STATION: AETHELGARD',
              isHidden=False,
          ),
          mod.TestCase(
              id='tc-2',
              description='Check reactor level',
              expectedOutput='REACTOR_LEVEL: 100',
              isHidden=False,
          ),
          mod.TestCase(
              id='tc-3',
              description='Check online protocol (hidden)',
              expectedOutput='PROTOCOL_STATUS: ONLINE',
              isHidden=True,
          ),
      ],
  )
  res = await mod.execute_code(req)
  print("Worker test status:", res.status)
  print("Worker stderr:", res.stderr)
  print("Worker error:", res.error)
  print("Worker test allPassed:", res.allPassed)
  print('Execution time ms:', res.executionTimeMs)
  for t in res.testResults:
    print(
        f'TestCase {t.testId}: passed={t.passed}, isHidden={t.isHidden},'
        f' output={t.actualOutput}'
    )
  assert res.allPassed is True, 'Expected all tests to pass'


asyncio.run(main())
