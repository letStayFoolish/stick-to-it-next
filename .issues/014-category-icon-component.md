---
id: 14
title: "Render all category imagery as icons via a CategoryIcon component"
type: AFK
status: done
blocked_by: []
blocks: [15]
parent: null
tags: [ui, icons, shopping-list, product]
---

## What to build

The app currently renders category PNG images (from the public images folder) as the visual for product cards, shopping-list category group headers, and the product detail page. Replace all of that rendering with a single `CategoryIcon` component backed by a static map from the closed `CategoriesType` union (20 categories) to lucide icons, with a generic package-style fallback for unknown slugs.

The icon renders inside a soft tinted container using the design tokens from the committed visual redesign (mint/sage palette), in two size variants: small (list rows, chips, group headers) and large (product-card visual, category page header). Both light and dark mode must resolve correctly via the token system — no hardcoded colors.

This slice changes rendering only; schema and asset cleanup is the follow-up slice (#15). Source: `plans/prd-items-notes-i18n-icons.md`, Phase 1.

## Acceptance criteria

- [x] Every one of the 20 categories maps to a distinct, sensible lucide icon; a test asserts every `CategoriesType` member resolves to an icon
- [x] No rendered surface loads category PNGs anymore (product cards, shopping-list headers, product detail page)
- [x] Small and large variants render correctly at ~390px viewport in both light and dark (screenshot-verified)
- [x] Icon containers use theme tokens, respect the redesign's restraint (no new ambient motion)

## Agent notes

- New component: `src/components/CategoryIcon.tsx`. Static `Record<CategoriesType, LucideIcon>` map (20 entries) + `Package` fallback for unmapped/unknown slugs (e.g. the `else` category used by seeded "misc" products isn't in `CategoriesType` and correctly renders the fallback — verified in the real `/products` screenshot). `size: "sm" | "lg"` prop; tinted container is `bg-primary` + `text-accent-ink` (existing redesign tokens), `rounded-2xl`, no added motion.
- Mapping used: bakery→Croissant, vegetables→Carrot, fruits→Apple, meat→Beef, milk-eggs-cheese→Milk, water-juice→CupSoda, fish→Fish, drinks→Wine, chips-snacks→Popcorn, sweets→Candy, frozen→Snowflake, pasta-cereals-flour→Wheat, oil-sauces-spices→Droplet, tea-coffee-cocoa→Coffee, cleaning→SprayCan, house-kitchen→UtensilsCrossed, canned-food→Soup, health-beauty→HeartPulse, kids-parents→Baby, animals→PawPrint.
- Test: `src/components/CategoryIcon.test.tsx` — asserts all 20 `CategoriesType` members render distinct (non-fallback) icons, and an unmapped slug renders `Package`.
- Replaced `next/image` PNG renders in `src/components/Product/ProductCard.tsx` (large), `src/app/(private)/shopping-list/components/ShoppingList.tsx` category group headers (small), `src/app/products/[slug]/page.tsx` header (large, keyed off `slug` directly instead of the first product's `category_image` — simpler and correct even when a category page has zero products).
- `npm test` / `npx tsc --noEmit` / `npm run lint` all green. Verified with Playwright screenshots at 390×844, light + dark: `/products`, `/products/bakery`, and an authenticated `/shopping-list` (test account, pre-existing items).
- Did not touch `product_image`/`category_image` schema or type fields, or delete the PNG assets — that's issue #15 per the phasing.
- No new user-facing strings introduced in this slice (icons only), so nothing to add to the future i18n sweep list for this issue.
