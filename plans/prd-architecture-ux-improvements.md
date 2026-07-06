# PRD: Architecture Deepening & Daily-Use UX Fixes

## Problem Statement

Stick To It is used every day by two people, in a store, on their phones, to replace a paper shopping list. Several things about how it behaves today get in the way of that:

- Checking off an item while shopping sometimes un-checks itself moments later — a checked "milk" turns back into an unchecked "milk" for no visible reason, whenever the list happens to re-render.
- The two of you don't see each other's changes to the list without manually refreshing, even though the whole point of the app is a shared list.
- A single misplaced tap can wipe the entire list with no warning and no way to undo it.
- The checkbox next to each item is small and only the tiny box itself responds to a tap — not the row around it.
- Adding an item, bumping a quantity, or removing something all feel laggy on store wifi, because each tap waits for a full round trip before anything visibly changes.
- The bottom navigation never shows which section you're currently on.
- If your login session expires while you're mid-aisle, the app silently kicks you to the login page with no explanation, and after logging back in again drops you on your profile instead of back on your list.
- Saving a note on the list sometimes silently fails — the "save" dialog closes immediately, whether or not the save actually worked.

Underneath these, the codebase that grew to support this app — originally built as a way to practice Next.js/React/TypeScript — has accumulated duplicated, hand-rolled logic in a few places. That duplication isn't just untidy: it already shipped one live bug (a quantity-update action returns a field name that doesn't exist on the data model), and it's the direct reason the "un-checking" bug above has stayed unfixed — there's no single place in the code that owns "a shopping list item," so fixing it properly means touching four different files that don't agree with each other.

## Solution

Consolidate the app's shopping-list logic and its auth logic into two clear seams — one service that owns everything about "a user's shopping list" (add, adjust quantity, check off, clear, like/favorite), and one function that owns "is this request from a logged-in user." Build the daily-use fixes (persisted checked state, shared-list sync, confirmations, bigger tap targets, optimistic feedback, nav state, session-expiry handling, reliable note saving) on top of those two seams rather than around them, so each fix lands once and doesn't need to be redone when the underlying service is finally introduced.

## User Stories

**Core shopping-list reliability**

1. As a shopper, I want an item I check off to stay checked off no matter what else happens on the list, so that I don't lose track of what I've already picked up.
2. As one of two people sharing a list, I want to see items my partner added or checked off without having to manually refresh the page, so that we're never both buying the same thing or missing something the other added.
3. As a shopper, I want to be asked to confirm before the entire list is cleared, so that one accidental tap doesn't erase everything I still need to buy.
4. As a shopper, I want to tap anywhere on an item's row (not just a tiny checkbox) to check it off, so that I can do it one-handed while pushing a cart.
5. As a shopper, I want quantity changes, removals, and clearing the list to feel instant, so that flaky store wifi doesn't make the app feel broken.
6. As a shopper, I want the bottom navigation to show which section I'm currently viewing, so that I always know where I am in the app.
7. As a shopper whose session expires mid-errand, I want to be told why I was logged out and to land back on the page I was using after logging back in, so that I don't lose my place or wonder what happened.
8. As a shopper, I want to know for certain whether my saved note was actually saved, so that I don't lose notes I thought were stored.
9. As a shopper, I want to read a product's full name even when it's long, so that I'm not guessing what's actually on the list.

**Data integrity / correctness (surfaces as reliability to the user, sourced from the codebase review)**

10. As a shopper, I want quantity updates to always reflect correctly in the list I see, so that a typo in the underlying code (an update that referenced a field the data model doesn't have) can never silently corrupt what's shown.
11. As a shopper, I want the "like/favorite" heart to only work when I'm actually logged in, so that anonymous visitors can't create a false "saved" state that quietly does nothing.
12. As a signup user, I want the password rules shown to me while typing to exactly match the rules the server actually enforces, so that I'm never blocked from submitting a password the server would accept.

**Maintainability (developer-facing, in service of the above)**

13. As the developer, I want one interface for every shopping-list mutation (add, set quantity, check off, clear, toggle like) and one interface for every read (a product enriched with this user's quantity/like state), so that a fix or a new field (like a persisted checked state) is written once, not four times.
14. As the developer, I want a single function that answers "is this request authenticated," used identically by middleware, server components, and every mutating action, so that auth checks can't silently disagree with each other again.
15. As the developer, I want dead code (an unreachable notes-save handler, an unused duplicate-email check, an unused URL helper, a schema field nothing reads or writes, a non-functional pre-App-Router error boundary) removed, so that nobody mistakes it for the real implementation.
16. As the developer, I want every new or changed behavior covered by a test written against the new service/auth interfaces, so that regressions in daily use are caught before they reach production.

## Implementation Decisions

**Phase 0 — cleanup (no dependencies)**

- Delete: the unreachable notes-save handler that calls `localStorage` from server-side code, the unused duplicate-email-check helper (the signup action already re-implements the same query inline), the unused base-URL helper, the unused `isLiked` boolean on the `Product` model (the real per-user "liked" relationship already lives correctly on the user's `likedItems`), and the non-functional pre-App-Router error boundary pattern.
- No behavior change; a passing build is the acceptance bar.

**Phase 1 — the auth seam**

- Introduce a single `requireUser()`-style function that is the one place "is this request authenticated" gets answered. It returns either the authenticated user or a typed "not authenticated" result — callers don't each re-derive this.
- Middleware, every server component that conditionally renders based on auth, and every mutating action all call this same function. No component re-implements cookie decryption or session verification independently.
- The like/favorite button only renders its interactive state for an authenticated user — no more silently-optimistic UI for anonymous requests that the server then rejects.
- `requireUser()` carries the path the user was on when their session expired, and login redirects back to that path afterward, instead of a hardcoded destination. A session expiring mid-action surfaces an explicit, user-visible explanation (not a silent redirect).

**Phase 2 — the shopping-list service (the core deep module)**

- Introduce one service module owning every shopping-list mutation: add an item, set quantity, set checked state, clear the list, toggle like. Every existing server action that currently hand-rolls "load the user document, mutate an array field, save, revalidate" becomes a thin wrapper: parse the incoming form data, call the service, revalidate.
- Extend the shopping-list item's data shape to include a persisted checked state (currently only quantity and product reference are stored) — checking an item off is a write through the service, not local component state, so it survives a page refresh or another device's update.
- The return shape each mutation produces comes from the service's own type, not hand-written per action — the class of bug where an action returns a field name the data model doesn't actually have becomes a compile-time error instead of a silent runtime one.

**Phase 3 — built on top of the service**

- Shared-list sync: the shopping-list page revalidates on window focus and on a short interval while open, so a change made on one device becomes visible on the other within seconds, without introducing a persistent-connection/real-time layer.
- Optimistic UI: quantity changes, item removal, and clearing the list update the visible UI immediately and reconcile with the server in the background, following the same pattern already used successfully for the like/favorite toggle. On failure, the UI reverts and shows an actionable error.
- Read-side join: the service gains a method that returns products already enriched with this user's quantity-in-list and liked state, replacing per-component re-implementations of the same join (including one that currently fetches every product and filters client-side instead of querying only the relevant ones).

**Standalone — no ordering dependency on the phases above**

- Password validation: the client-side "is this password valid" check while typing is derived from the same schema the server enforces, rather than a hand-written regular expression that has already drifted from the server's rule.
- "Clear list" requires an explicit confirmation step before it takes effect.
- The checkbox next to each list item, and the row around it, are both part of one tap target; the accessible label refers to the actual product name. The tooltip used for long product names is reachable by tap, not hover-only.
- The bottom navigation visually indicates which section is currently active, and every navigation icon has an accessible label.
- The notes-save dialog only closes once the save has been confirmed successful; a failed save is shown as an actionable error, not a silently-closed dialog.

## Testing Decisions

- Good tests here exercise externally observable behavior through the seams above — call the shopping-list service's methods and assert on what they return/persist, call `requireUser()` with valid/expired/missing sessions and assert on its result — not internal implementation details of either module.
- `ShoppingListService` is tested against a real (in-memory) MongoDB instance rather than mocked Mongoose models, so tests catch real query/schema mistakes (the same class of bug as the `cartItems`/`listItems` mismatch found in this review) instead of passing against a mock that agreed with the bug.
- `requireUser()` is tested directly with constructed valid, expired, and missing session states.
- Component-level fixes (confirmation dialog, tap target, nav active state, notes dialog, tooltip) are tested through the rendered component's interface (what a user can see/click/read), not through internal state.
- There is no existing test suite or test runner in this project; introducing one (a fast, ESM-friendly runner plus a component-testing library) is part of this work, done once, at the start of Phase 0, rather than repeated per phase.
- Tests are written per vertical-slice issue as each is implemented, not as a separate up-front testing effort — including for the Phase 1/Phase 2 refactors, where the first tests written should capture today's actual behavior before the refactor changes its shape, so the refactor can be verified not to have silently changed what currently works.

## Out of Scope

- Real-time sync (websockets, Server-Sent Events, database change streams) for the shared list — polling/revalidate-on-focus is the deliberate choice for a two-person household list; real-time infrastructure is a future decision if polling proves insufficient in practice.
- Internationalization (English/Serbian/Russian) — an existing open item in the project's own notes, not part of this PRD.
- Sharing a list via a URL — an existing open item in the project's own notes, not part of this PRD.
- Any new product-browsing or account features beyond what's described above.
- A full test pyramid or retroactive test coverage of parts of the codebase this PRD doesn't touch.
- Migrating away from MongoDB/Mongoose, or any other wholesale technology swap.
- Visual/theme redesign beyond what's needed for the specific fixes listed (tap targets, active-nav indication, confirmation dialog, tooltip reachability).

## Further Notes

- Phase ordering matters and should be preserved by whatever breaks this PRD into issues: Phase 0 (cleanup) → Phase 1 (auth seam, plus the session-expiry fix that depends on it) → Phase 2 (the shopping-list service, plus the persisted checked-state fix that depends on it) → Phase 3 (shared-list sync, optimistic UI, and the read-side join, all of which depend on Phase 2's service existing). The standalone items have no ordering dependency and can be picked up any time, including in parallel with the phased work.
- Phase 2 and the "checked-off items un-check themselves" user story are, functionally, the same piece of work — building the service without the persisted checked field, or the checked field without the service, both leave the fix incomplete.
- This PRD originated from a paired architecture-friction review and UI/UX review of the existing production app, not from a net-new feature request — several "implementation decisions" above are corrections to bugs found during that review (the `cartItems`/`listItems` field mismatch, the unauthenticated like-button gate, the diverged password regex, the dead code) rather than new behavior.
