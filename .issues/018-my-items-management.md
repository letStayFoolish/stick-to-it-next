---
id: 18
title: "My items management on the profile page"
type: AFK
status: done
blocked_by: [17]
blocks: [21]
parent: null
tags: [profile, custom-items, ux]
---

## What to build

A "My items" section on the profile page listing the user's own created items (name + category icon), with the ability to edit an item's name, change its category, and delete it. This prevents the junk-drawer problem — a typo'd item living forever in search results. Follow the pattern already established by the profile's favorites list.

Deleting a custom item must cascade: it is removed from the user's shopping list entries and liked items as well, never leaving dangling references. Editing keeps the same product identity (existing list/like references stay valid).

Mobile-first; use the redesign's tokens and interaction rules.

Source: `plans/prd-items-notes-i18n-icons.md`, Phase 2, decision 4.

## Acceptance criteria

- [x] Profile shows all of the user's created items and none of the seeded ones
- [x] Renaming and recategorizing an item is reflected everywhere it appears (list, category page, favorites)
- [x] Deleting an item removes it from the catalog, the shopping list, and likes in one action (integration test proves no dangling references)
- [x] Other users' views are unaffected by these operations
- [x] Screenshot-verified at ~390px light and dark

## Agent notes

- **Service layer** (`src/lib/services/productService.ts`): added `getOwnedProducts(userId)`, `updateOwnedProduct(userId, productId, { name?, category? })`, and `deleteOwnedProduct(userId, productId)`. Ownership is enforced by scoping every query to `{ _id: productId, owner: userId }` — attempting to edit/delete another user's item simply finds nothing and returns `{ ok: false, error: "Item not found" }`, verified by two "refuses to edit/delete another user's item" tests. Editing mutates the same document in place (no delete+recreate), so existing list/like references stay valid automatically — no extra "reflect everywhere" work needed since every read path already resolves by id.
- **Cascade delete**: `deleteOwnedProduct` does `findOneAndDelete` then a single `User.updateOne` with `$pull: { listItems: { productId }, likedItems: productId }` on the owner's own document. Cascade is scoped to the owner only (not all users) because the visibility filter from #16 makes it structurally impossible for anyone but the owner (or nobody, for seeded items) to have a custom item in their list/likes in the first place — verified with a real list+likes entry in the cascade test.
- **Bug found and fixed (2nd instance of the pattern from #17)**: none of the four `productService` read functions actually stringified `_id` before returning, despite `ProductPlain`'s type already declaring `_id: string` — `.lean()` returns a raw Mongoose `ObjectId`. This was invisible until `getOwnedProducts`' result reached `MyItemRow.tsx` (a client component), tripping the same "Only plain objects can be passed to Client Components" warning as the `owner` leak in #17. Fixed at the source with a shared `withStringId()` helper applied to all four read functions (`getVisibleProducts`, `getVisibleProductsByCategory`, `getVisibleProductsByIds`, `getOwnedProducts`) rather than patching only the new one, so the type's promise is actually true everywhere now. Also corrected `getVisibleProductsByCategory`'s return type from `ProductType` (`_id: ObjectId`) to `ProductPlain` (`_id: string`), which is what it was actually returning all along.
- **Another instance of the same root-cause bug as #17's page-overflow fix**: the edit dialog's category chip row (copied from `QuickAddItem`) overflowed its own `DialogContent` box at 390px, because `src/components/ui/dialog.tsx`'s `DialogContent` is `display:grid` with no base `grid-cols`, letting the auto-sized single column size to the chip row's max-content width instead of the dialog's own width. Fixed with the same one-line `grid-cols-1` addition used in `MainThemeLayout.tsx` for #17 — this is a shared UI primitive, so this fix also protects every other dialog in the app from the same class of bug in the future (e.g. if `Notes.tsx`'s edit dialog ever gained wide unwrapped content).
- **UI**: `src/app/(private)/profile/components/MyItemsList.tsx` (server component, mirrors `FavoritesList.tsx`) + `MyItemRow.tsx` (client component) added as a new "My Items" table section on the profile page, below Favorites. Edit opens a `Dialog` with a name `Input` + the same category-chip-row pattern as quick-add (accepted minor duplication — this is only the 2nd occurrence; not extracting a shared component yet per the project's DRY guidance of waiting for a third). Delete is a plain form + `useActionState`, consistent with `RemoveFromListBtn`/`ClearAllBtn` (not the fire-and-forget `useDislike` hook pattern), so Next's automatic post-action route refresh reliably re-renders the list.
- New server actions: `src/lib/actions/fetchOwnedProducts.ts`, `src/lib/actions/myItems.ts` (`updateOwnedItem`, `deleteOwnedItem`) — both call `revalidatePath("/profile")` and `revalidatePath("/shopping-list")` since a rename/recategorize/delete can affect how the item displays on the shopping list too.
- 22 new/updated service tests, 3 new component tests (`MyItemRow.test.tsx`: dialog opens pre-filled with current name/category, validation error surfaces non-silently, delete submits the correct `product_id`).
- Manual verification: registered a throwaway account, quick-added an item, renamed + recategorized it via the profile dialog, confirmed the change everywhere, deleted it, confirmed cascade (empty state), all at 390×844 in light and dark, zero console warnings on a clean dev-server restart. All throwaway data cleaned from the (real, personal) database afterward.
- New strings for the future i18n sweep (#21): "My Items", "Groceries you've added yourself — edit or remove them here", "Edit item", "Save changes", plus the existing favorites-table header labels reused as-is (Name/Category/Actions/ID).
- Full suite (66 tests), `tsc --noEmit`, `next lint` all green.
