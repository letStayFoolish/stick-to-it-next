---
id: 4
title: "Session-expiry mid-shopping fix"
type: AFK
status: done
blocked_by: [3]
blocks: []
parent: null
tags: [auth, ux]
---

## What to build

If a session expires while someone is actively using the app — e.g. mid-aisle, adjusting a quantity — today's behavior is a silent redirect to the login page with no explanation, and after logging back in, a hardcoded redirect to the profile page rather than back to wherever they were.

Using the `requireUser()` seam from issue 3:

- When a request fails auth mid-action, surface an explicit, user-visible explanation (e.g. a toast: "Your session expired — please log back in") rather than a bare silent redirect.
- Carry the path the user was on through to the login flow, and redirect back to that same path after a successful login, instead of a fixed destination.

## Acceptance criteria

- [x] A session expiring during an in-progress action shows the user a clear, actionable message before/while redirecting to login
- [x] After logging back in, the user lands back on the page they were using (e.g. the shopping list), not a hardcoded page
- [x] Existing login flow for a fresh (non-expired) login is unaffected
- [x] Tests cover: action attempted with expired session → user sees explanation and is routed to login with the original path preserved; successful re-login → redirect targets the preserved path

## Agent notes

- Key discovery that shaped scope: Next.js middleware already runs on Server Action POST requests (they hit the same route as the page they're submitted from, which matches the middleware matcher). So an expired session mid-action (e.g. adjusting quantity on `/shopping-list`) was already being redirected to `/login` before this fix — just silently, with no explanation, and always landing on a hardcoded `/profile` after re-login. This meant the entire fix could live in `middleware.ts` + the login page/form, with **zero changes to any shopping-list action file** — deliberately kept clear of issue #5's territory (`ShoppingListService`), which was being built in parallel in a separate worktree.
- `src/middleware.ts`: the redirect-to-login URL now carries `?from=<original pathname>` always, and additionally `&reason=expired` only when `req.cookies.has("session")` is true (i.e. a session cookie was present but `requireUser()` still said unauthenticated — distinguishes "your session just expired" from "you were never logged in," which shouldn't show an expiry message). This existence check is a boundary the seam already exposes via `NextRequest.cookies`, not independent decoding — no conflict with issue #3's "one seam" requirement.
- `src/app/(auth)/components/LoginForm.tsx`: reads `useSearchParams()`. On mount, if `reason === "expired"`, shows a toast ("Session expired" / "Your session expired — please log back in."). On successful login, redirects to `searchParams.get("from")` if present, else the existing default `/profile` — so a fresh, unprompted visit to `/login` is unaffected.
- `src/app/(auth)/login/page.tsx`: wrapped `<LoginForm />` in `<Suspense>` — required by Next.js whenever a component calls `useSearchParams()`, otherwise the page opts out of static rendering with a build-time warning.
- Testing notes:
  - `src/middleware.test.ts`: constructs a real `NextRequest` (not a hand-rolled fake) so `req.cookies` behaves genuinely; mocks `next/headers`'s `cookies()` (used internally by `requireUser()`) the same way `session.test.ts` does. Needs `// @vitest-environment node` for the same jose/jsdom `Uint8Array` realm reason documented in `session.test.ts`.
  - `src/app/(auth)/components/LoginForm.test.tsx`: initially tried rendering the real `Toaster` alongside `LoginForm` and asserting on rendered toast text — hit a real cross-component effect-ordering hazard (the toast store's `useToast()` subscribes via its own `useEffect`; if the consumer's `useEffect` dispatches a toast before `Toaster`'s effect has subscribed, the dispatch is silently dropped). Switched to mocking `@/hooks/use-toast` directly and asserting on the call args instead — more robust and actually closer to what this behavior is: "does LoginForm ask for the right toast," not "does the toast system render."
  - Discovered and fixed unrelated test-infra bug while writing `middleware.test.ts`: `vitest.config.ts` had no `exclude` for `.claude/worktrees/**`, so when a background agent works in a nested git worktree (as issue #5's agent did, concurrently, in this exact session), `npm test` run from the main worktree silently picks up and runs that agent's in-progress test files too. Added `exclude: ["**/node_modules/**", "**/.claude/worktrees/**"]`.
- Verified against the real dev server (not just unit tests): `GET /shopping-list` with no cookie → `307` to `/login?from=%2Fshopping-list` (no `reason`); same request with a garbage/invalid `session` cookie present → `307` to `/login?from=%2Fshopping-list&reason=expired`; both `/login` and `/login?reason=expired&from=/shopping-list` render `200`.
