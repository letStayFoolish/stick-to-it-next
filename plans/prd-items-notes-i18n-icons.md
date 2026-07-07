# PRD: Custom Items, Trip Memo, Multi-Language, Category Icons

Status: ready-for-agent
Aligned with owner: 2026-07-06 · Implementation slices: `.issues/014` – `.issues/023`

## Problem Statement

I use this shopping-list app almost exclusively on my phone's browser, and while the core logic works, several parts still feel like a proof of concept rather than an app I'd open for fun:

- I can only put things on my list that exist in the app's fixed catalog. When I need batteries or a specific spice that isn't seeded, the app has no answer.
- The notes feature is a clunky dialog that renders my text as awkward dash-lines, and a failed save looks exactly like a successful one — I can't trust it.
- The whole interface is English-only. My household and friends think in Serbian, Russian, Spanish, or German; an English-only grocery app creates friction every single trip.
- Categories are represented by PNG images that clash with the app's new minimal visual design and don't adapt to dark mode or future design changes.

## Solution

Make the list personal, trustworthy, and native-feeling:

- **Add your own groceries** right where the need arises — a quick-add on the shopping list: type the name, tap a category, and it's on your list. Your items are saved as yours, so next week they're one tap away again, findable in search and their category page, likeable like any catalog item. A "My items" section in your profile lets you fix typos, recategorize, or delete.
- **A trip memo you can trust** — one always-visible note card on the shopping list. Tap, type, done. No dialog, and a failed save keeps your text on screen with a clear error instead of silently pretending it worked.
- **The app speaks your language** — pick English, Russian, Serbian (Latin), Spanish, or German in your profile. The whole interface and the seeded catalog appear in your language; items you created yourself stay exactly as you typed them. First-time visitors get their browser's language automatically.
- **Icons instead of images** — every category gets a crisp icon in a softly tinted badge that matches the new design in both light and dark mode, replacing all category photos app-wide.

## User Stories

1. As a mobile shopper, I want to add an item that isn't in the catalog directly from my shopping list, so that I can capture a need the moment I notice it in the store.
2. As a mobile shopper, I want the quick-add to require only a name (with a sensible default category), so that adding an item takes seconds with one thumb.
3. As a mobile shopper, I want to assign my new item to one of the existing categories via a chip picker, so that it groups correctly on my list and category pages.
4. As a returning user, I want an item I created last week to appear in search and its category page, so that I can re-add it without retyping it.
5. As a user, I want my created items to be likeable/favoritable exactly like catalog items, so that my staples live in my favorites regardless of who authored them.
6. As a user, I want the app to reuse an existing item when I type a name that already exists in that category (ignoring case), so that my catalog doesn't fill with duplicates.
7. As a user, I want a "My items" section in my profile listing everything I've created, so that I can see and manage my personal additions in one place.
8. As a user, I want to rename or recategorize one of my items, so that a typo or wrong category isn't permanent.
9. As a user, I want deleting one of my items to also remove it from my list and favorites, so that nothing broken or orphaned lingers behind.
10. As a user, I want my custom items to be visible only to me, so that my additions don't pollute anyone else's catalog.
11. As a user, I want clear feedback when my item name is invalid (empty, too long) or its category is unknown, so that I'm never left wondering why nothing happened.
12. As a mobile shopper, I want a trip memo visible directly on my shopping list, so that trip-level reminders ("budget 50€", "return bottles") live next to the list they belong to.
13. As a mobile shopper, I want to edit the memo in place with a tap, so that I don't have to go through a dialog to jot two words.
14. As a user, I want a failed memo save to keep my draft visible and show a clear error with a way to retry, so that I never lose a note or falsely believe it was saved.
15. As a user, I want the memo to clear together with my list, so that last trip's reminders don't leak into the next trip.
16. As a user, I want a friendly "add a note for this trip" affordance when the memo is empty, so that the feature invites use instead of showing a blank box.
17. As a Serbian-speaking user, I want to switch the app to Serbian in my profile, so that every screen reads naturally to me.
18. As a Serbian-speaking user, I want Serbian rendered in Latin script, so that it matches how I actually read and type day to day.
19. As a Russian-, Spanish-, or German-speaking user, I want my language among the options, so that the app works for my whole household.
20. As a first-time visitor, I want the app to default to my browser's language when it's supported (and English otherwise), so that my first impression is already localized.
21. As a user, I want my language choice to persist across sessions and devices, so that I choose once and the app remembers everywhere I log in.
22. As a user, I want seeded catalog items and category names translated into my language, so that browsing and searching feel native, not half-translated.
23. As a user, I want items I created myself to display exactly as I typed them in every language, so that the app never mangles my own words with machine translation.
24. As a user, I want validation and error messages localized too, so that failures are as understandable as successes.
25. As a user, I want anything missing a translation to fall back to English rather than showing a raw key or blank, so that the app never looks broken.
26. As a mobile shopper, I want every category represented by a clear icon in a tinted badge, so that I can recognize categories at a glance while scanning fast in a store.
27. As a dark-mode user, I want category icons to follow the theme tokens, so that nothing glares or vanishes at night.
28. As a mobile user on a shaky connection, I want icon-based visuals instead of image downloads, so that pages render fast and never show broken images.
29. As a user, I want my created items to look native next to seeded ones — same icon treatment, no missing artwork — so that my list looks coherent, not patched together.
30. As a mobile user, I want all new controls (quick-add, chips, memo, picker) to have thumb-sized targets and visible pressed states, so that the app feels made for a phone, not shrunk from a desktop.
31. As a motion-sensitive user, I want any new animation to respect my reduced-motion preference, so that the app stays comfortable to use.
32. As the app owner, I want to review the Serbian and Russian translations before they ship, so that quality reflects languages I actually read.

## Implementation Decisions

- **Custom items live in the existing product collection** with an optional, indexed owner reference; seeded documents remain untouched (no owner). Every catalog read filters to "seeded OR owned by the requesting user". This makes custom items behave identically to seeded items across likes, list membership, browsing, and search with no changes to the list or likes services.
- **The category set stays a closed enum** (the existing 20 categories). No user-created categories in this phase; the schema must not preclude adding an owner to categories later, but nothing is built for it.
- **Quick-add is the single creation entry point**: name input plus a horizontally scrollable category chip row (preselected to the default/"else" category) on the shopping-list page; one action both creates the product and adds it to the list through the existing list service.
- **Dedup on create**: case-insensitive name match within the same category against products the user can see reuses the existing product instead of creating a duplicate.
- **Item management** (edit name, edit category, delete) lives in a "My items" profile section following the profile's existing favorites-list pattern. Deletes cascade out of list entries and likes.
- **Notes remain a single string on the user document**; the redesign is purely UX — an inline, always-visible memo card replacing the dialog. Save resolves only on server confirmation; failure keeps the draft and surfaces through the existing toast mechanism. Supersedes backlog issue #13. The memo continues to clear with the list (existing clear-list behavior).
- **i18n uses next-intl in "without i18n routing" mode**: no locale URL prefixes, no changes to routes or the auth middleware. Locale resolution order: cookie → browser Accept-Language → English. The preference is stored on the user document and mirrored in a cookie for immediate SSR; the profile page hosts the picker (native language names).
- **Locales**: `en` (default and fallback), `ru`, `sr` (Latin script), `es`, `de`.
- **Hybrid translation storage**: UI strings and category labels (keyed by category slug) live in per-locale message catalogs in the repo; seeded product names become locale-keyed fields on the document (`{ en, ru, sr, es, de }`) resolved server-side with English fallback. User-created items keep a single plain name displayed as-typed in every locale. The DTO layer resolves both shapes to one display name so components stay shape-agnostic.
- **A seed script and data file get committed to the repo** as part of the catalog migration — the seeded catalog currently exists only in the database and must become reproducible and git-reviewable.
- **Translations are LLM-generated** (short UI copy and grocery vocabulary); the owner reviews Serbian and Russian before sign-off.
- **Icons replace all category imagery**: a single icon component maps the closed category enum to lucide icons (with a generic fallback for unknown slugs), rendered in tinted containers driven by the committed redesign's theme tokens, in small (rows, chips) and large (card visual) variants. The required product-image field, both image-related type members, and all category PNG assets are removed.
- **All database changes are additive and non-destructive**; the product-name migration keeps a compatibility read path for unmigrated documents, and existing list/like references remain valid throughout.
- **All new UI conforms to the committed visual redesign**: its tokens, radii, and five-touchpoint motion restraint; no new ambient animation.
- **Phasing**: icons → custom items → trip memo → i18n last, so the string sweep happens once after all new copy has settled.

## Testing Decisions

- Good tests here assert **external behavior at a seam**, never implementation details: "a second user cannot see my item", not "the query contains an owner filter"; "a failed save keeps the draft visible", not "state X is set".
- **Primary seam — the service layer against an in-memory MongoDB** (the established pattern from the shopping-list service tests). This covers: owner visibility isolation (two-user tests in both directions), quick-add create/dedup/validation, cascading delete of custom items, memo save success and failure semantics, and localized-name resolution including English fallback and the as-typed rule for user items.
- **Secondary seam — component tests with React Testing Library** (prior art: the login form, product item, and page-heading tests): icon-map completeness (every category member resolves to an icon), quick-add validation states, memo edit/error/retry states, wrapped in an intl provider once i18n lands.
- **Pure unit tests** (prior art: the utils tests): locale resolution order and a key-parity guard asserting all five message catalogs share the same key set.
- **No new automated seams.** Playwright remains what it is today: manual screenshot verification at ~390px mobile viewport in light and dark, required before any slice is called done.
- Type-check, lint, and the full test suite must pass at the end of every slice.

## Out of Scope

- User-created categories (data model may allow it later; no UI or behavior now).
- Per-item notes, multiple notes, or any notes structure beyond the single trip memo.
- Machine-translating user-generated content.
- URL-based locale routing, SEO, or shareable per-language links.
- Shared-list sync between users and URL-snapshot sharing — separate initiatives (see backlog issue #6).
- Tailwind v4 migration.
- Reopening the committed visual redesign; new UI conforms to it, nothing more.
- Automated end-to-end (Playwright) test infrastructure.

## Further Notes

- Implementation is broken into ten vertical slices, `.issues/014` through `.issues/023`, continuing the existing backlog numbering. Four slices are unblocked and parallelizable immediately (icon rendering, owner/visibility foundation, trip memo, i18n foundation). The only human-in-the-loop slice is the final one: owner review of sr/ru translations plus an on-phone walkthrough of every locale in both color schemes.
- The trip-memo slice supersedes backlog issue #13 (notes save reliability); its acceptance criteria are folded in and #13 should be marked done-by-supersession when the memo lands.
- Strings hardcoded in the pre-i18n slices are acceptable but must be listed in each slice's notes so the final sweep is mechanical.
- Background for the visual constraints this PRD inherits (palette tokens, motion restraint, mobile-first verification workflow) lives in the redesign handoff document in this same directory.
