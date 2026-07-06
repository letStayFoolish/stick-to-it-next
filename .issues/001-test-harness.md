---
id: 1
title: "Set up test harness (Vitest + React Testing Library + mongodb-memory-server)"
type: AFK
status: done
blocked_by: []
blocks: [2, 3, 5, 9, 10, 11, 12, 13]
parent: null
tags: [testing, infra]
---

## What to build

This project has no test runner at all today — no Vitest/Jest, no test script in `package.json`, no component-testing library. Every other issue in this backlog is meant to be implemented test-first in a fresh session, so the harness needs to exist before any of that work starts.

Introduce:
- A fast, ESM-native test runner (Vitest) wired into `package.json` (`test` script) and picked up by the existing TypeScript config.
- A component-testing library (React Testing Library) for testing components through their rendered interface — what a user can see/click/read — not internal state.
- `mongodb-memory-server` (or equivalent) so tests that exercise data-layer logic run against a real in-memory MongoDB instance rather than mocked Mongoose models. This matters: a mocked model would have happily agreed with the `cartItems`/`listItems` field-name bug found in this codebase; a real in-memory database would not.

Prove the harness works end-to-end with a small number of smoke tests — one pure-logic test, one component-render test, one test that spins up `mongodb-memory-server` and reads/writes a document through an existing Mongoose model. These smoke tests are not meant to cover real behavior; they exist to prove each layer of the harness is wired correctly for the issues that follow.

## Acceptance criteria

- [x] `npm test` (or equivalent) runs the test suite and exits non-zero on failure
- [x] A pure-function/unit test passes under the new runner
- [x] A component is rendered and asserted on via React Testing Library
- [x] A test spins up an in-memory MongoDB instance, performs a read/write through an existing Mongoose model, and tears the instance down cleanly
- [x] Test run is fast enough to use in a tight red-green-refactor loop (no multi-second cold starts per test file)

## Agent notes

- Runner: Vitest (`vitest.config.ts`), `npm test` → `vitest run`. Uses `resolve.tsconfigPaths: true` (native Vite option) to resolve the `@/*` alias — no `vite-tsconfig-paths` plugin needed.
- Component testing: `@testing-library/react` + `@testing-library/jest-dom/vitest` (loaded via `vitest.setup.ts`), `@vitejs/plugin-react` for JSX, `environment: "jsdom"`.
- DB testing: `mongodb-memory-server`, connected directly via `mongoose.connect(mongoServer.getUri())` in the test's `beforeAll`/`afterAll` — bypasses `src/lib/database.ts#connectDB` since that reads `MONGODB_URI` from env and isn't needed for this.
- Smoke tests added (not covering real behavior, per issue scope):
  - `src/lib/utils.test.ts` — pure function `handleProductName`
  - `src/components/PageHeading.test.tsx` — RTL render/query
  - `src/lib/models/Product.test.ts` — create + findById through the real `Product` Mongoose model against an in-memory Mongo instance
- Verified: full suite runs in ~1.2s on warm runs (~3.2s on the very first run, likely first-touch cost); confirmed `npm test` exits 1 on a failing assertion.
