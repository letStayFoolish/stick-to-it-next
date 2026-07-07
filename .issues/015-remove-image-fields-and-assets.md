---
id: 15
title: "Remove product/category image fields and delete PNG assets"
type: AFK
status: done
blocked_by: [14]
blocks: [17]
parent: null
tags: [schema, cleanup, icons]
---

## What to build

With all rendering switched to icons (#14), remove the now-dead image plumbing end-to-end: the required `product_image` field on the Product schema, the `product_image`/`category_image` members of the shared Product types and DTO layer, and the category PNG files themselves.

This unblocks user-created products (#17), which must be creatable without any image. Keep the DB change additive/non-destructive: stop requiring and reading the field; do not run a destructive migration that drops data.

Source: `plans/prd-items-notes-i18n-icons.md`, Phase 1.

## Acceptance criteria

- [x] Product schema no longer requires (or validates) an image field; creating a product without one succeeds
- [x] No type, DTO, or component references `product_image` / `category_image`
- [x] Category PNG assets are deleted from the repo; build contains no references to them
- [x] Type-check, lint, and full test suite pass

## Agent notes

- `src/lib/models/Product.ts`: removed the `product_image` field from `ProductSchema` entirely (not just made optional). Since Mongoose is strict by default, any leftover `product_image` key on pre-existing documents is simply ignored on read/write going forward — additive/non-destructive, no migration needed.
- `src/lib/types.ts`: removed `product_image` and `category_image` from the `Product` interface.
- Tracer-bullet TDD cycle: added a failing test in `src/lib/models/Product.test.ts` ("persists a document with no image field") that hit `ValidationError: product_image: Product image is required`, then removed the schema field to turn it green.
- Cleaned up now-obsolete `product_image`/`category_image` fixture data from `Product.test.ts`, `productService.test.ts`, and `ProductItem.test.tsx` (all previously passed these fields even though nothing asserted on them).
- Deleted `public/images/categories/` (22 PNGs, including `else.png` and `musli.png` which weren't even in the `CategoriesType` union) after confirming no remaining source reference to `images/categories` anywhere in `src/` or `public/`.
- `npm test` (42 tests), `tsc --noEmit`, and `next lint` all pass.
- No new user-facing strings introduced.
