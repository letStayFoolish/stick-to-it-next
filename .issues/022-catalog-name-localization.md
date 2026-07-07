---
id: 22
title: "Localize seeded product names with committed seed data"
type: AFK
status: done
blocked_by: [20]
blocks: [23]
parent: null
tags: [i18n, schema, custom-items, data]
---

## What to build

Migrate seeded product names from a single English string to locale-keyed names ({ en, ru, sr, es, de }), with display resolving the active locale and falling back to en. The seeded catalog currently lives only in the database — as part of this, commit a proper seed script plus data file to the repo so the catalog is reproducible and its translations reviewable in git.

Locked decisions:
- User-created items (owner set) keep a single plain name and display as typed in every UI language — never machine-translated. The DTO layer resolves both shapes to one display name so components stay shape-agnostic.
- Migration is additive/non-destructive: en is seeded from the current value, and a compatibility read path handles not-yet-migrated documents.
- Translations LLM-generated (grocery vocabulary); sr in Latin script; owner reviews in #23.

Source: `plans/prd-items-notes-i18n-icons.md`, Phase 4, decisions 7–8.

## Acceptance criteria

- [x] Seeded items display translated names in each locale; missing locale keys fall back to en (tested)
- [x] User-created items display exactly as typed regardless of UI language (tested)
- [x] Components receive one resolved display name from the DTO layer — no per-component locale conditionals
- [x] Seed script + data file are committed and can rebuild the catalog from scratch
- [x] Migration leaves existing user list/like references intact; full test suite passes

## Agent notes

- **Schema**: `Product.product_name` changed from `String` to `Schema.Types.Mixed` (`src/lib/models/Product.ts`) — additive, no data loss. It now legitimately holds either a plain string (user-created items, forever; not-yet-migrated seeded items) or a locale-keyed object `{ en, ru, sr, es, de }` (migrated seeded items).
- **DTO resolution, one place**: `resolveProductName(rawName, locale)` in `src/lib/services/productService.ts` — a pure function (string passthrough, or `rawName[locale] ?? rawName.en ?? Object.values(rawName)[0]`), unit-tested directly (4 tests). Wired into all four product-read functions via a new `toDto(docs, locale)` helper (replacing the old `withStringId`), which now also resolves `product_name` before the DTO reaches any component. Every read action (`fetchProducts`, `fetchProductsFromCategory`, `fetchShoppingListItems`, `fetchOwnedProducts`) resolves the current locale via `getLocale()` from `next-intl/server` and passes it through — components never see the raw shape or branch on locale themselves.
- **Dedup fix required by the shape change**: `quickAddProduct`'s case-insensitive name-match query only matched a plain-string `product_name` field; once a seeded product is migrated to a locale-keyed object, a plain regex match against `product_name` silently stops matching it (Mongo regex doesn't reach into object sub-fields implicitly). Fixed with an explicit `$or` across the plain-string shape and every locale's sub-field (`product_name.en`, `product_name.ru`, etc.), so quick-add still correctly dedups against a migrated seeded product typed in any of its translated forms — verified with a new test (typing "milch" reuses a seeded product whose `de` name is "Milch").
- **Real bug found and fixed during manual verification, not previously covered by any test**: `handleProductName()` (`src/lib/utils.ts`) — used for the OLD flat "category-slug-with-hyphens" display style (`"milk-eggs-cheese"` → `"milk, eggs, cheese"`) — was still being called on **product names**, not just categories, in `ProductName.tsx` and `ShoppingListItem.tsx`. This was silently a no-op for the entire lifetime of the app because no English seeded product name ever contained a hyphen. The moment German translations were added (which naturally use hyphens in compounds — "Hot-Cross-Bun-Brot", "Mini-Baguette"), this call started mangling them into `"Hot, Cross, Bun, Brot"` / `"Mini, Baguette"`, silently corrupting correct translations. Root cause: after #21's sweep, `handleProductName` had zero remaining legitimate call sites (all 7 category-rendering call sites were already migrated to `t(category)` from the `Categories` namespace) — it was dead for its original purpose and actively harmful for its accidental one. Deleted the function and its test entirely; `ProductName.tsx`/`ShoppingListItem.tsx` now render `product_name` verbatim, which is correct for both shapes (translated seeded name or as-typed custom name).
- **Seed data** (`data/products.seed.json`): exported the full live catalog (263 seeded products across 21 categories, matching the DB exactly, including one accidental pre-existing duplicate — "Turkey Breasts" appears twice under `meat`, seed data preserves this to match production) and translated every name into ru/sr/es/de. Structure: flat array of `{ category, en, ru, sr, es, de }`.
- **Seed/migration script** (`scripts/seed-products.js`, run via `npm run seed:products`): plain Node (no ts-node/tsx dependency added), loads `.env.local` manually, connects with mongoose, and for each seed entry does an idempotent `findOneAndUpdate` matched on `category` + (`product_name` equals the English name as a plain string, OR `product_name.en` equals it) with `owner: { $exists: false }` — so it only ever touches seeded products, never a user's own item — `$set`ting the full locale-keyed name, `upsert: true`. Additive and idempotent: verified via `mongodb-memory-server` dry runs before touching production, including running it twice back-to-back with no duplication.
- **Migration ran against production** (this app's real personal database — there is no staging/seed-only DB): 262 of 263 seeded products migrated in one run; the 263rd (the duplicate "Turkey Breasts" row) collides on the same match key as its twin, so only one of the pair gets the locale-keyed name — the other keeps displaying its original plain-string English name via `resolveProductName`'s string-passthrough path (not broken, just not translated). This is a pre-existing data-quality artifact in the original seed (an accidental duplicate), not something introduced here, and out of scope to deduplicate as part of a localization migration. All other 262 products, and every user's `listItems`/`likedItems` references (which point to unchanged `_id`s), are intact — the migration only ever updates `product_name` in place via `$set`, never touches `_id` or deletes/recreates documents.
- **Manual verification**: confirmed translated seeded names render correctly on category pages in German (`Bäckerei`/bakery — including correctly-hyphenated `Hot-Cross-Bun-Brot`, `Mini-Baguette` after the bugfix) and Russian (`Фрукты`/fruits, alphabetically sorted in Cyrillic), confirmed the English baseline still renders the original names unchanged, and confirmed a genuinely custom item name (`MojCustomName123`) displays byte-for-byte as typed inside a fully Russian-language UI. All verification data cleaned up afterward.
- Full suite (96 tests — added resolver + locale-resolution + dedup-across-locales tests, removed the now-obsolete `handleProductName` test), `tsc --noEmit`, `next lint` all green.
