---
id: 17
title: "Quick-add a custom grocery item from the shopping list"
type: AFK
status: done
blocked_by: [15, 16]
blocks: [18, 21]
parent: null
tags: [shopping-list, custom-items, ux, mobile]
---

## What to build

A quick-add affordance on the shopping-list page: the user types an item name, picks a category from a horizontally scrollable chip row (preselected to the "else" category), and in one action the item is created as their own product (owner set, #16) and added to their shopping list via the existing list service. This matches the real moment of need — "I need batteries and they're not in the catalog" — on a phone, in a store.

Behavior decisions locked during PRD alignment:
- Categories are the existing closed set only — no custom categories.
- Dedup on create: a case-insensitive name match within the same category against items the user can see (seeded + own) reuses that product instead of creating a duplicate.
- Validation: name required, trimmed, max ~60 chars; category must be a valid member of the closed category set.
- Created items need no image (#15) and thereafter behave like catalog items: likeable, searchable, browsable in their category, re-addable next week.

Mobile-first: thumb-sized targets, visible active states, optimistic add consistent with the list's existing optimistic behavior, motion within the redesign's five-touchpoint restraint.

Source: `plans/prd-items-notes-i18n-icons.md`, Phase 2, decisions 1–3.

## Acceptance criteria

- [x] From the shopping list, typing a name and confirming creates the item and shows it on the list in one motion
- [x] Category chip row defaults to "else"; chosen category is persisted on the item
- [x] Duplicate name (case-insensitive, same category) reuses the existing product — verified for both a seeded and an own item
- [x] Validation rejects empty/whitespace names and out-of-set categories with a visible, non-silent error
- [x] Created item later appears in its category page and search for its owner only
- [x] Service-level tests cover create, dedup, validation; flow screenshot-verified at ~390px light and dark

## Agent notes

- **Spec conflict resolved with the owner up front**: the issue says default to "else", but the PRD locks the category set to "the existing 20 categories" and `else` was never in `CategoriesType` (it's leftover seed-data cruft, already treated as dead by #15/#14). Owner decided: add `else` as a legitimate 21st category rather than picking a different default. Implemented by turning `CategoriesType` into a derived type off a new runtime `CATEGORIES` const array in `src/lib/types.ts` (single source of truth for both the type and validation), with `else` appended and mapped to a dedicated `Boxes` lucide icon in `CategoryIcon.tsx` (not the `Package` fallback, so "recognized misc category" stays visually distinct from "unrecognized slug — likely a bug").
- **Service layer** (`src/lib/services/productService.ts`): new `quickAddProduct(userId, rawName, category)` returns a `QuickAddResult` discriminated union (`{ ok: true, productId }` / `{ ok: false, error }`) — validates trimmed-non-empty name, max 60 chars, category must be in `CATEGORIES`, then dedups via a case-insensitive exact-match regex scoped through the existing `visibilityFilter` (seeded OR owned-by-requester) before creating. 9 new tests in `productService.test.ts`, built one TDD cycle at a time (create → empty-name → too-long → bad-category → seeded-dedup → own-dedup → cross-user-no-dedup).
- **Bug found and fixed along the way**: `getVisibleProducts`/`getVisibleProductsByCategory`/`getVisibleProductsByIds` (from #16) were leaking the raw `owner` `ObjectId` into `ProductPlain` objects passed to client components, tripping Next's "Only plain objects can be passed to Client Components" warning as soon as an owned product actually reached `ShoppingList.tsx` (a client component) — #16's tests never exercised a full page render, so this was latent. Fixed by adding `.select("-owner")` to all three read paths; nothing downstream ever reads `product.owner`, so it's dropped entirely rather than serialized. Covered by a new test asserting `visible[0].owner` is `undefined` for an owned product.
- **Server action**: `src/lib/actions/quickAddItem.ts` — thin glue (auth check, `quickAddProduct`, then `shoppingListService.addItem`, then `revalidatePath`), no dedicated test, consistent with how `updateQuantity.ts`/`updateNotes.ts` are untested glue over already-tested services.
- **UI**: `src/app/(private)/shopping-list/components/QuickAddItem.tsx`, wired into `ListDynamicData.tsx` so it renders both on an empty list and a populated one. Follows the codebase's existing `useActionState` + form + `isPending` convention (`AddToCartSection.tsx`, `Notes.tsx`) rather than true client-side optimistic state — a new product's id isn't known until the server responds (create-or-dedup), so there's nothing meaningful to optimistically render beyond the pending spinner already shown. 4 RTL tests in `QuickAddItem.test.tsx` (default chip selection, chip switching, validation error surfaced via `FormError`, input clears on success).
- **Real layout bug found and fixed, outside this issue's own files but required to ship it**: the horizontally-scrollable chip row blew out the *entire page's* width (390px viewport rendering at 1280px, clipping "Browse Products" and 3 of 4 bottom-nav icons off-screen) even with `min-w-0`/`overflow-x-auto` correctly applied on the row itself. Root-caused via Playwright to `src/components/MainThemeLayout.tsx`'s root `<div className="grid ... md:grid-cols-[220px_1fr] ...">` having no base (mobile) `grid-cols`, so its single mobile column auto-sized to the *max-content* width of its subtree — CSS Grid's auto-track sizing pulls max-content through descendants in a way flexbox's `overflow:auto` min-width carve-out doesn't prevent. Fixed by adding an explicit `grid-cols-1` base class so the mobile column is `1fr` (viewport-relative) instead of `auto` (content-based). One-line, does not change any existing page's rendered layout (the effective behavior below `md` was always meant to be single-column full-width) — verified via `docScrollWidth`/`innerWidth` parity before/after across a bisection (removed the chip row entirely → overflow vanished; confirmed it wasn't pre-existing).
- **Manual verification**: registered a throwaway account via Playwright at 390×844, confirmed quick-add creates+lists an item under a non-default chosen category ("bakery"), toast fires, list updates via `revalidatePath`; re-checked in dark mode; confirmed no console errors/warnings on a clean dev-server restart. All throwaway test users/products deleted from the (real, personal) Atlas database afterward — this app has no seed/staging DB, so verification ran against the owner's actual data store; cleanup is complete but worth knowing for future slices needing manual verification.
- New strings introduced (for the future i18n sweep, #21): "Add an item not in the catalog...", "Add" (button), "Added to your list!" (toast), "Item name" (aria-label), "Name is required", "Name must be 60 characters or fewer", "Unknown category", plus the 21 category chip labels (already sourced from `handleProductName`, shared with existing category displays).
- Full suite (54 tests), `tsc --noEmit`, `next lint` all green.
