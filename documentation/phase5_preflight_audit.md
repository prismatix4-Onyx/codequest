# Phase 5 Preflight Audit — Deployment & Security Verification

**Timestamp:** 2026-11-10T08:40:00+05:30  
**Repository Branch:** `main`  
**Latest Git Commit:** `ffc8d02` (`fix(deploy): resolve Render NestJS CJS/ESM compatibility, fix Vercel auth layout clipping and API route fallback`)  
**Working Tree:** Clean (verified zero uncommitted changes)

---

## 1. Git & Monorepo State

- **Branch:** `main`
- **Commit History:**
  - `ffc8d02` — Resolved Render NestJS CJS/ESM compatibility, fixed Vercel auth layout clipping and API route fallback.
  - `30a737a` — Completed Phase 2 asset pipeline & first vertical slice with ARIA, ORPHEUS, reactor, and cinematic sequence.
  - `62ff211` — Completed Phase 1 Blender MCP connection test, renders, and integration guide.
- **Upstream Sync:** Local `main` is strictly up to date with `origin/main`. No force-pushes or resets performed.

---

## 2. Deployment Configuration Inspection

| Target / Component | Configuration File | Verified Settings |
| :--- | :--- | :--- |
| **Monorepo Root** | `package.json` | Workspaces: `apps/*`, `packages/*`. Added `overrides` for `@nestjs/common: 10.4.15`, `@nestjs/core: 10.4.15`, `@nestjs/platform-express: 10.4.15` to prevent accidental resolution to ESM NestJS 12. |
| **Web Frontend** | `apps/web/package.json`<br>`apps/web/next.config.mjs` | `next@14.2.35`, `react@18.3.1`, `three@0.168.0`, `@react-three/fiber@8.17.8`, `@react-three/drei@9.114.0`. Three.js deduplication alias configured via `config.resolve.alias.three = path.resolve(...)`. |
| **Backend API** | `apps/api/package.json` | `startCommand: node dist/main.js`. NestJS 10.4.15 CJS runtime verified with local execution. |
| **Render Cloud** | `infrastructure/deployment/render.yaml` | Service `codequest-api`: Node runtime, port 10000, build command compiles shared packages and API, start command executes `node apps/api/dist/main.js`. |
| **Vercel** | Next.js standard App Router | Automatic deployment on push to `main`. Public URL: `https://codequest-beta-one.vercel.app`. |

---

## 3. Production Deployment Status

- **Vercel Frontend (`https://codequest-beta-one.vercel.app`):**
  - **Status:** **200 OK** (Verified via automated HTTP probe).
  - Serving Next.js 14 production bundle.
- **Render Backend (`https://codequest-api-s7gg.onrender.com`):**
  - **Status:** **404 Not Found** (from Render routing layer).
  - **Cause Analysis:** The previous deployment from commit `a31e6c2` failed during launch (`ERR_REQUIRE_ESM`). On free-tier Render instances, failed deployments leave the route in an unassigned/inactive 404 state until a succeeding build completes or manual trigger finishes. The push for commit `ffc8d02` is currently in the deployment queue.
  - **Resilience:** The frontend client has been engineered with dual-resilience:
    1. Pre-pend `/api/v1` prefix if missing.
    2. API route rewrite middleware in NestJS (`/auth/*` $\to$ `/api/v1/auth/*`).
    3. Graceful offline/spin-down fallback that prevents any blocker or infinite loading spinner for players.

---

## 4. Authentication & Critical Guest Security Audit

### 4.1 Guest Session Isolation
- **Explicit Guest Marking:** Guest accounts are strictly identified by `id: "guest-..."` and `isGuest: true`.
- **No Privileged Permissions:** Guest role is limited to standard `PLAYER` with 0 initial XP and 0 elevated rights.
- **Zero Token Issuance for Offline Fallback:** When operating in offline/standalone mode, `localStorage.removeItem('codequest_token')` is executed so that offline guests cannot forge a valid JWT bearer token.
- **Impersonation Prevention:** Guest IDs are pseudo-randomly generated (`guest-<random_hash>`) and cannot collide with or impersonate registered users (which use `usr-...`).
- **Protected Route Guards:** Backend APIs use `JwtAuthGuard` requiring signed JWTs for sensitive operations (saving permanent user profiles, admin endpoints). Guest requests without valid tokens receive `401 Unauthorized`.
- **No Silent Upgrade:** Reconnecting to the backend will never automatically upgrade an unauthenticated guest session into a registered account without an explicit registration or login action.

### 4.2 Viewport & Layout Verification
- The login and registration card in [`apps/web/src/components/auth/AuthPortal.tsx`](file:///d:/PRISMATIX4/Projects/CODEQUEST/apps/web/src/components/auth/AuthPortal.tsx) has been refined to eliminate previous clipping:
  - Container padding updated with responsive `pb-16 sm:pb-12`.
  - Main modal card padding adjusted to `p-5 sm:p-6` with compact spacing.
  - Form submit button and guest option remain fully visible and clickable across desktop, laptop (1366x768), and mobile viewports.
