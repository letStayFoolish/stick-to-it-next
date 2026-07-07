---
id: 16
title: "Product owner field with per-user catalog visibility"
type: AFK
status: done
blocked_by: []
blocks: [17]
parent: null
tags: [schema, service, custom-items]
---

## What to build

Add an optional, indexed `owner` (user id) to the Product schema. Seeded catalog documents remain untouched (no owner). Every catalog read path — product listings, category browsing, sorted/limited selections, favorites enrichment, shopping-list enrichment, and any search — must filter to "seeded OR owned by the requesting user", so one user's custom items are never visible to another user.

This is the data foundation for user-created grocery items; it ships with no new UI. Decision from PRD alignment: custom items live in the same collection so they behave identically to seeded items everywhere downstream (likes, list, browsing) with no changes to the list/likes services.

Source: `plans/prd-items-notes-i18n-icons.md`, Phase 2, decisions 1–2.

## Acceptance criteria

- [x] Product schema has an optional indexed owner reference; existing seeded documents are unmodified
- [x] All catalog read paths exclude other users' owned products (integration test with two users proves isolation both ways)
- [x] Seeded items remain visible to everyone; owned items appear in their owner's category pages, favorites, and shopping list exactly like seeded ones
- [x] Full test suite passes

## Agent notes

- `src/lib/models/Product.ts`: added `owner: { type: Schema.Types.ObjectId, ref: "User", required: false, index: true }`. Seeded docs simply omit the key (no migration needed).
- New `src/lib/services/productService.ts` centralizes the visibility rule as `owner: { $in: [null, userId] }` (matches the PRD's own wording) via three functions: `getVisibleProducts`, `getVisibleProductsByCategory`, `getVisibleProductsByIds`. MongoDB's `$in: [null, ...]` matches both `null` and a missing field, so seeded docs (no `owner` key at all) are covered without special-casing.
- Tested at the service level with real Mongo (mongodb-memory-server), following the existing `shoppingListService.test.ts` pattern — two real user ids, proving isolation both ways, plus anonymous (`null` userId) exclusion of owned items. 5 tests in `src/lib/services/productService.test.ts`.
- Wired into the three read paths named in the issue:
  - `fetchProducts.ts` — now resolves `userId` via `requireUser()` and calls `getVisibleProducts`.
  - `fetchProductsFromCategory.ts` — resolves `userId` from the existing `getUser()` call (was already fetching the full user doc for `likedItems`; dropped the redundant second `User.findOne` by email since `likedItems` is already on that doc).
  - `fetchShoppingListItems.ts` — calls `getVisibleProductsByIds` scoped to the user's own `listItems` ids, guarding against a stale list item pointing at a since-privatized product.
- `fetchFavoritesProducts.ts`, `getSortedProducts.ts`, and `getLimitedNumberOfProducts` (in `utils.ts`) needed no changes — they all call `fetchProducts` internally, so the fix applies transitively.
- `fetchAllCategories.ts` (`distinct("category")`) intentionally left unscoped — it only returns the fixed 20 `CategoriesType` slugs, which are not user-specific data, so there's nothing to leak.
- `types.ts`: `Product.owner?: ObjectId | string | null` added.
- Full suite (33 tests), `tsc --noEmit`, and `next lint` all pass.
