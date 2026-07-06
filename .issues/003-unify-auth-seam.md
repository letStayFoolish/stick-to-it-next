---
id: 3
title: "Unify session verification into one requireUser() seam"
type: AFK
status: done
blocked_by: [1]
blocks: [4, 5]
parent: null
tags: [auth]
---

## What to build

Today, "is this request authenticated" is answered independently in at least three places, and they disagree: request-level middleware decrypts the session cookie itself and only guards two routes; a data-access-layer helper independently re-verifies the session for use in actions; and a client component that gates the like/favorite button has had its auth check commented out entirely, so anonymous requests can trigger a like-toggle that the server then silently no-ops.

Introduce one function — the single seam that answers "is this request from an authenticated user, and if so, who." It returns either the authenticated user or a typed "not authenticated" result; callers branch on that result rather than each re-deriving it.

- Middleware calls this same function instead of independently decrypting the cookie.
- Every mutating server action calls this function instead of any ad-hoc "get the current user" helper.
- Every server component that conditionally renders based on auth state (including the like/favorite button) calls this function — restoring the auth gate that was removed, so anonymous users see the button in its logged-out state rather than a fully interactive one that silently fails server-side.

## Acceptance criteria

- [x] One function is the sole place session/auth state is derived from the request
- [x] Middleware, actions, and auth-gated components all call it — no independent cookie/session decoding remains anywhere else
- [x] The like/favorite button no longer renders as interactive for an unauthenticated request
- [x] Tests cover: valid session → authenticated user returned; expired session → not-authenticated result; missing session cookie → not-authenticated result
- [x] Existing authenticated flows (viewing profile, shopping list, toggling likes) continue to work exactly as before for logged-in users

## Agent notes

- `requireUser(): Promise<{authenticated: true; userId: string} | {authenticated: false}>` added to `src/lib/session.ts`, alongside the existing `encrypt`/`decrypt`/cookie logic it composes on. No `redirect()` side effect — callers branch on the typed result themselves.
- Removed `verifySession()` from `src/lib/dal.ts` entirely (it duplicated cookie decoding and also had a `redirect("/login")` side effect baked into a data-layer helper — one of the three disagreeing places named in this issue). `getUser()` now derives `userId` via `requireUser()` instead, then does its existing DB lookup — so every one of `getUser()`'s ~7 existing callers (actions + components) is fixed for free without touching them.
- Direct call-site updates: `src/middleware.ts` (was calling `decrypt()` directly), `src/components/Sidebar/SidebarMobile.tsx` and `SidebarWeb.tsx` (were calling `verifySession()` just for the boolean), `src/components/Product/ProductItem.tsx` (restored the like-button auth gate — it was commented out, with an unconditional render left in place directly below it, which is the exact "silently no-ops" bug from the issue description).
- `grep -rn "decrypt(\|verifySession" src` confirms `decrypt()` now only appears inside `session.ts`.
- Added `aria-label` ("Add to favorites" / "Remove from favorites") to the like button in `LikeButtonsSet.tsx` — it was a real accessibility gap (icon-only button, no accessible name) and was needed to assert the gate behavior in tests without relying on DOM structure.
- Test-infra fallout from writing these tests (all in `vitest.config.ts` / `vitest.setup.ts`, not app code):
  - `server-only` was imported by app code but was never an actual npm dependency — Next resolves the bare specifier via its own internal bundler alias, which doesn't exist outside Next's build. Installed it as a real dependency, and added a Vitest `resolve.alias` pointing it at an empty stub module (mirrors what Next's server compiler does).
  - `session.test.ts` needs `// @vitest-environment node`: running it under the shared `jsdom` environment broke `jose`'s internal `instanceof Uint8Array` checks because jsdom's `TextEncoder` produces `Uint8Array`s from a different realm.
  - `vitest.setup.ts` now calls `afterEach(() => cleanup())` from RTL — it wasn't wired up, so `react-tooltip`'s `MutationObserver` (used by `ProductName`) was firing after test teardown and printing a stray `window is not defined` error across files.
- Manually verified against the dev server (not just unit tests): unauthenticated `GET /profile` → 307 redirect to `/login` (middleware); `GET /products/fruits` unauthenticated has zero occurrences of "favorites" anywhere in the response (real slug page, real products, not just the smoke-test fixture).
- Out of scope, left as-is: `toggleLike.ts` still assumes `getUser()` returns non-null and would throw (silently caught) if called by an unauthenticated request — no longer reachable through the UI now that the gate is restored, but not hardened server-side. Flagging in case a future issue wants defense-in-depth here.
