# Phase 6: The Reactor Protocol — Gameplay & Execution Audit

**Audit Date:** 2026-11-10T15:20:00+05:30  
**Target:** CODEQUEST Chapter 1 — The Awakening ("The Silent Vessel")  
**Focus:** Connection between Code Submission, Python Execution, Deterministic Evaluation, Reactor State, and Player Progression.

---

## 1. System Architecture Map

```mermaid
flowchart TD
    subgraph BrowserClient ["Frontend Client (apps/web)"]
        Monaco["Monaco Editor (CodeStudio.tsx)"]
        Store["Zustand Store (useStore.ts)"]
        WorldCanvas["WorldCanvas & ReactorCore.tsx"]
        Aria["AriaCharacter.tsx"]
    end

    subgraph BackendAPI ["NestJS Core API (apps/api)"]
        SubmissionsController["SubmissionsController (/api/v1/submissions)"]
        SubmissionsService["SubmissionsService"]
        StoriesService["StoriesService (Progress)"]
        AuthService["AuthService (XP & Profiles)"]
    end

    subgraph Sandbox ["Execution Sandbox (apps/execution-worker)"]
        FastAPIWorker["FastAPI Worker (:8002/execute)"]
        SubprocessRunner["Isolated Python Subprocess (python -s -S -u -c)"]
    end

    Monaco -->|1. Player edits code| Store
    Store -->|2. POST /submissions| SubmissionsController
    SubmissionsController --> SubmissionsService
    SubmissionsService -->|3. Delegate execution & test suite| FastAPIWorker
    FastAPIWorker --> SubprocessRunner
    SubprocessRunner -->|4. stdout/stderr/testResults| FastAPIWorker
    FastAPIWorker -->|5. ExecutionResult| SubmissionsService
    SubmissionsService -->|6. Award XP & Save Progress (Idempotent)| AuthService
    SubmissionsService --> StoriesService
    SubmissionsService -->|7. Verified Result| Store
    Store -->|8. Visual State: critical -> recovering -> operational| WorldCanvas
    Store -->|9. Emotion: concerned -> thinking -> happy/mission_success| Aria
```

---

## 2. Component Audits

### 2.1 Code Editor (`CodeStudio.tsx`)
- **Technology:** `@monaco-editor/react` (v4.6.0) using VS Dark theme with Python language mode.
- **Controls:** Starter code reset, maximization toggle, progressive hint unlock, standard output terminal, and deterministic test suite drawer.
- **Identified Deficiency:** Currently features a single "Run Program" button that immediately attempts full submission. In game design and pedagogical practice, players benefit from a separation between:
  1. **Run Program:** Executes user code against Python interpreter to view standard output and syntax/runtime errors without submitting or triggering mission completion.
  2. **Submit Protocol:** Submits code to the trusted evaluation suite (evaluating public and hidden test cases), triggering the reactor recovery sequence only on complete verification.

### 2.2 Python Execution Worker (`apps/execution-worker/main.py`)
- **Engine:** Python 3.12 subprocess sandbox executed with restricted flags (`-s` no user site directory, `-S` no site module, `-u` unbuffered standard streams).
- **Security:** Static AST/keyword inspection blocks forbidden calls (`os.system`, `subprocess`, `socket`, `shutil.rmtree`, `ctypes`).
- **Timeout Protection:** Capped at 4.0s (maximum 8.0s) via `asyncio.wait_for`.
- **Test Case Evaluation:** Runs test cases in isolated subprocesses with `io.StringIO` input redirection. Compares normalized string stdout against expected output.
- **Hidden Tests:** Correctly masked (`actualOutput: "[HIDDEN TEST]"`, `expectedOutput: "[HIDDEN TEST]"`).
- **Audit Finding:** Fully secure, functioning, and independent. Verified locally via `tests/test_execution_worker.py` (Passed in 63ms).

### 2.3 NestJS Submissions Service (`apps/api/src/submissions/submissions.service.ts`)
- **Flow:** Receives `userId`, `missionId`, `code`, and `hintsUsed`. Loads mission definition from `content/python/last-protocol/missions.json`.
- **Worker Communication:** Dispatches HTTP POST to `EXECUTION_WORKER_URL` (`http://localhost:8002/execute`).
- **Resilience Fallback:** If the execution worker is unreachable, falls back to a deterministic string evaluator so users in offline/isolated environments are not blocked.
- **Idempotency Defect:** Currently, every successful submission invokes `authService.addXp(userId, 100)`. If a user re-submits the same code, duplicate XP could be awarded. Must enforce idempotency using `completedMissionIds`.

### 2.4 Reactor State Controller (`ReactorCore.tsx` & `WorldCanvas.tsx`)
- **Supported States:**
  - `offline`: Dim emissive shader, zero pulse.
  - `critical`: Pulsing crimson/red alarm shader (`#ff1133`), pulsing point light.
  - `recovering`: Smooth cyan-amber oscillation transition (`#00e5ff` $\leftrightarrow$ `#ffaa00`), stabilizing frequency.
  - `operational`: Stable cyan glow (`#00e5ff`), breathing energy pulse.
- **Audit Finding:** The reactor component is fully implemented with real-time shader modulation, but in `/play`, it was toggled solely by a boolean `powerState === 'online'` rather than the full 4-state gameplay sequence (`critical` $\to$ `recovering` $\to$ `operational`).

### 2.5 Authentication & Guest Session Persistence
- **Guest Isolation:** Verified in Phase 0 preflight. Guest users cannot impersonate registered users.
- **Client Persistence:** Guest and user sessions stored in `localStorage` under `codequest_user`. Mission progress must similarly be stored in `localStorage` (`cq_completed_missions`) to ensure page refreshes do not revert reactor stability.

---

## 3. Minimal Safe Corrective Actions
1. **Update Mission Content** (`content/python/last-protocol/missions.json`): Set Chapter 1 Challenge 1 to "Reactor Initialization" with objective `REACTOR INITIALIZED\nPOWER: STABLE`.
2. **Update Submissions Service** (`submissions.service.ts`): Align deterministic evaluation test cases and enforce idempotent XP granting.
3. **Enhance Client Store & CodeStudio** (`useStore.ts`, `CodeStudio.tsx`):
   - Add resilient API endpoint builder `getApiEndpoint('/submissions')`.
   - Separate "Run Code" (local output) from "Submit Protocol" (trusted evaluation).
   - Wire reactor state machine: `critical` $\to$ `recovering` $\to$ `operational`.
   - Wire ARIA emotional dialogue reactions to execution outcomes.
   - Persist completed mission state across page refreshes.
