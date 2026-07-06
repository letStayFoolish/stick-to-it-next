---
id: 5
title: "ShoppingListService with persisted checked state"
type: AFK
status: ready
blocked_by: [1, 3]
blocks: [6, 7, 8]
parent: null
tags: [shopping-list, core]
---

## What to build

This is the core deepening of the review. Today, every shopping-list mutation (clearing the list, toggling a like, updating notes, updating an item's quantity) is a separate hand-rolled action that independently loads the user's document, mutates an array field on it, saves, and revalidates. The duplication has already shipped a live bug: one action's return value references a field name that doesn't exist on the actual data model. It's also the reason a known, wanted fix — persisting whether an item is checked off — has stalled: there's no single place that owns "a shopping list item," so that change touches four disagreeing files instead of one.

Introduce one service module owning every shopping-list mutation:
- add an item to the list
- set an item's quantity
- set an item's checked state (new — the list item's stored shape gains a checked field; today it stores only a product reference and quantity)
- clear the entire list
- toggle a liked/favorite product

Every existing server action that currently reimplements this logic becomes a thin wrapper: parse the incoming form data, call the appropriate service method, revalidate the shopping-list page. The service's own return type is what each action returns — a mismatched field name becomes a compile-time type error, not a silent runtime bug.

Checking an item off is now a write through this service, not local component state — it must survive a page refresh and be visible from a different device viewing the same list.

## Acceptance criteria

- [x] One service module is the sole owner of shopping-list mutation logic; no server action independently mutates the user's list/like data
- [x] The list item's persisted shape includes a checked state; checking an item off writes through the service and survives a full page reload
- [x] The `cartItems`/`listItems` field-name mismatch bug is gone (the service's typed return makes this class of bug impossible to reintroduce silently)
- [x] Tests (against a real in-memory MongoDB, per issue 1) cover: adding an item, changing quantity, checking/unchecking an item, clearing the list, toggling a like — each verified by what's actually persisted, not by inspecting internal service state
- [x] Existing UI (quantity controls, clear button, like button, notes) continues to work unchanged from a user's perspective — this issue changes the underlying implementation, not the visible behavior, except for checked-state now surviving a refresh (see "not fully verified" note below on the last point)

## Agent notes

**Worktree state mismatch found before starting.** This worktree (`worktree-agent-aa45b73a949c99a81`, branched from `d7d040f`) did not actually contain issue #1's or #3's work — that work exists only as *uncommitted* changes in the main repo working tree (`/Users/chili/projects-solo/stick-to-it-next`), and git worktrees don't share uncommitted state. Confirmed via `git diff` in the main worktree and `git grep requireUser $(git rev-list --all)` (no hits — never committed). Copied over exactly the files needed to reproduce that groundwork here: `package.json`/`package-lock.json` (vitest + RTL + mongodb-memory-server deps), `vitest.config.ts`/`vitest.setup.ts`/`vitest.server-only-stub.ts`, `src/lib/session.ts` (adds `requireUser`), `src/lib/dal.ts` (now calls `requireUser` instead of the removed `verifySession`), `src/components/Product/LikeButtonsSet.tsx` + `ProductItem.tsx` + `src/components/Sidebar/SidebarMobile.tsx` + `SidebarWeb.tsx` (updated to call `requireUser` instead of the removed `verifySession`, otherwise `tsc` would fail), plus the reference/baseline test files (`Product.test.ts`, `session.test.ts`, `utils.test.ts`, `PageHeading.test.tsx`, `ProductItem.test.tsx`). Ran `npm install` in this worktree afterward. Confirmed baseline was 7/7 tests, clean `tsc`, clean lint before touching anything, matching what was promised. **Deliberately did not copy** `src/middleware.ts`'s diff or `src/middleware.test.ts`/`LoginForm.test.tsx` — those are the human's in-progress issue #4 (session-expiry UX) work, sitting uncommitted in the main worktree; copying them would have imported half-finished, currently-red work into this branch. `src/middleware.ts`, `src/app/(auth)/login/page.tsx`, `src/app/(auth)/components/LoginForm.tsx` were not touched at all in this worktree (verified with `git diff --stat` at the end — no output).

**Service module**: `src/lib/services/shoppingListService.ts`. Pure Mongoose service — takes `userId: string` as its first argument and does its own `User.findById`; it does *not* call `connectDB()` itself (tests manage their own `mongoose.connect()` against `mongodb-memory-server`, same as `src/lib/models/Product.test.ts`'s established pattern, and `connectDB()` requires `MONGODB_URI` which isn't set in the vitest env). Callers (the server actions) are responsible for `await connectDB()` before invoking the service, same as `getUser()` always did internally.

Exports:
- `addItem(userId, productId): Promise<ShoppingListItemDto[]>` — upserts the product onto the list at quantity 1; idempotent no-op if already present (does not reset/overwrite an existing quantity).
- `setQuantity(userId, productId, quantity): Promise<ShoppingListItemDto[]>` — sets an absolute quantity, clamped to [0, 100]; quantity 0 removes the item; throws if the product isn't on the user's list (mirrors the old "Cannot decrease quantity for an item not in the cart" guard).
- `setChecked(userId, productId, checked): Promise<ShoppingListItemDto[]>` — new. Sets the checked flag on an existing list item; throws if not present.
- `clearList(userId): Promise<{ listItems: []; notes: "" }>` — empties `listItems` and resets `notes` in one atomic save, preserving the existing (if slightly odd) coupling between "clear list" and "clear notes" that `clearProducts.ts` already had.
- `toggleLiked(userId, productId): Promise<string[]>` — toggles `productId` in/out of `likedItems`, returns the updated array.

`ShoppingListItemDto = { productId: string; quantity: number; checked: boolean }` — this typed return is what `updateQuantity.ts` now returns as `updatedShoppingList`, so the old `userData.cartItems` (always `undefined`, since that field never existed on the schema) is gone; the field is now `updatedShoppingList: ShoppingListItemDto[]` and any future rename would be a compile error at every call site.

**Schema change**: `src/lib/models/User.ts` — `listItems` subdocument gained `checked: { type: Boolean, default: false }` alongside the existing `productId`/`quantity`.

**Actions rewritten as thin wrappers** (all now: derive `userId` via `requireUser()`, `await connectDB()`, delegate to the service, `revalidatePath`):
- `src/lib/actions/updateQuantity.ts` — `add-to-list` → `addItem`; `remove-from-list` → `setQuantity(..., 0)`; `increase`/`decrease` still need the *current* quantity to compute the next absolute value, so this action reads it via the existing `getUser()` (a plain read, not a mutation) before calling `setQuantity` with the computed target. This is the one place where an action still reads shopping-list state directly, but it never mutates or saves — all writes go through the service.
- `src/lib/actions/clearProducts.ts` — delegates to `clearList`. Dropped the old `if (!userData.listItems) return "No products to clear"` guard — `listItems` always defaults to `[]` on the schema, so that branch was dead code (never reachable); clearing an already-empty list is now just an idempotent no-op success, no behavior change from a user's perspective.
- `src/lib/actions/toggleLike.ts` — delegates to `toggleLiked`. As a side effect this fixes the latent bug noted in the brief (unauthenticated `userData.likedItems.includes(...)` throwing and being silently swallowed) since the auth check now happens before any list access; not separately tested here since it's a straightforward consequence of checking `auth.authenticated` first, and issue #3's client-side auth gate already makes it unreachable through the UI.
- `src/lib/actions/updateNotes.ts` — **left out of scope, untouched.** It mutates `notes`, a field that doesn't overlap with the 5 listed service methods (add/set-quantity/set-checked/clear/toggle-like), and doesn't share any logic with them beyond both eventually calling `.save()` on a `User` doc. `clearList` still resets `notes` as part of "clear the list" (that coupling already existed in `clearProducts.ts` and is preserved), but that's the *service* owning the clear operation's full effect, not `updateNotes.ts` needing to move.

**New behavior — persisted checked state**: `src/lib/actions/setItemChecked.ts` (new, thin, same shape as `toggleLike.ts`) calls `shoppingListService.setChecked`. `src/lib/actions/fetchShoppingListItems.ts` now enriches each product with `checked: matchingItem?.checked ?? false` (mirrors the existing `quantity` enrichment). `src/lib/types.ts`'s `ProductPlain` gained `checked?: boolean`. `src/app/(private)/shopping-list/components/ShoppingListItem.tsx` now initializes local state from `product.checked ?? false` instead of hardcoded `false`, and `onCheckedChange` fires-and-forgets `setItemCheckedAction(product._id, nextChecked)` (same optimistic pattern `useHandleLike.tsx` already uses for likes) alongside the local `setIsChecked` update, so the checkbox still feels instant.

**Tests**: `src/lib/services/shoppingListService.test.ts`, 10 tests, real `mongodb-memory-server` per issue #1's pattern (`beforeAll`/`afterAll` connect/disconnect, `afterEach` clears the `User` collection). Every assertion re-fetches via `User.findById(...)` after calling the service — none inspect the service's return value as the sole check — matching the acceptance criterion about verifying "what's actually persisted." Covers: add-new-item, add-idempotent-when-present, set-quantity-absolute, set-quantity-clamped-at-100, set-quantity-to-0-removes-item, set-quantity-throws-when-absent, set-checked-survives-refetch (the literal acceptance criterion), clear-list (both `listItems` and `notes`), toggle-liked-add, toggle-liked-remove. Full suite: 17/17 passing (7 pre-existing + 10 new). `npx tsc --noEmit` clean. `npm run lint` clean (0 warnings/errors).

**Manual verification — partial, documented limitation**: Ran `npm run dev` against the real dev database (`.env.local`'s `MONGODB_URI` points at a shared MongoDB Atlas cluster — `stick-to-it.oiewvws.mongodb.net/appdb` — not a local/disposable instance). Confirmed: home page 200, login page 200, `MongoDB connected` logged with no errors, and `/shopping-list` correctly 307-redirects to `/login` for an unauthenticated request (proving the route/middleware/auth path doesn't crash). Deliberately did **not** create a test user or exercise the authenticated checkbox-persists-across-reload flow against that shared database, since I have no throwaway credentials and didn't want to write test data into what looks like the developer's real dev DB. The actual "survives a full page reload" behavior is verified at the service layer (the `setChecked` test explicitly re-fetches via `User.findById` to simulate a reload) but not click-tested through the browser. If real login credentials are available, the remaining manual check is: log in, check an item off on `/shopping-list`, refresh, confirm it's still checked, and confirm it also carries the same edited via a second session/device.

**AskUserQuestion unavailable**: this ran as a background subagent without the `AskUserQuestion` tool (confirmed via tool search — not present). Per the `/tdd` skill's "confirm plan with user before coding" step, I stated the full design plan (service location, method signatures, schema change, which actions become wrappers, updateNotes scope decision) as narration instead of blocking on an interactive confirmation, then proceeded — the task brief already pre-answered most of the open design questions explicitly enough that guessing was clearly lower-risk than a blocking round-trip.
