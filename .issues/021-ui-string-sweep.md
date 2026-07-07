---
id: 21
title: "Sweep all UI strings into the five locale catalogs"
type: AFK
status: done
blocked_by: [17, 18, 19, 20]
blocks: [23]
parent: null
tags: [i18n, ux]
---

## What to build

Move every user-facing hardcoded string in the app into the next-intl message catalogs and provide translations for all five locales: auth forms and their zod validation messages, navigation/sidebar/footer labels, home, shopping list (including quick-add from #17), profile (including My items from #18), the trip memo (#19), toasts, tooltips, empty states, and confirmation dialogs.

Category labels are part of this sweep: they live in the message catalogs keyed by the closed category slug (locked decision — they are UI strings, not DB content). Translations are LLM-generated; sr uses Latin script; the owner reviews sr/ru in #23.

Blocked by #17/#18/#19 so their copy exists before the sweep — this issue owns making the app contain no hardcoded user-facing English afterward.

Source: `plans/prd-items-notes-i18n-icons.md`, Phase 4, decisions 6–7.

## Acceptance criteria

- [x] A page-by-page pass in each locale shows no untranslated user-facing strings (spot-check every route, light on legalese, strict on visible UI)
- [x] Category labels render translated everywhere categories appear (chips, headers, pages)
- [x] Validation and error messages (including server-action failures and toasts) are localized
- [x] en catalog is the complete reference; a test guards that all locales contain the same key set
- [x] Type-check, lint, and full test suite pass

## Agent notes

- **Scope**: swept every hardcoded user-facing string found via a full-codebase inventory (research pass, then implementation) — auth forms + Zod validation + `usePasswordValidation`, home, products listing/category pages, the shopping-list remainder left over from the #20 tracer bullet, profile (favorites + My Items + language picker), category labels everywhere they render, all toasts (like/dislike, session-expired), the root error boundary, and every server-action error/success message that reaches the UI. New namespaces: `Categories` (21 keys — the 20 closed categories + `else`), `Auth`, `Validation`, `Home`, `Products`, `Favorites`, `Errors`, `ErrorPage`, plus new keys added to `Nav`→`Brand` (renamed/expanded), `ShoppingListPage`, and `Profile`.
- **Category labels are UI strings, not DB content** (locked decision) — added a `Categories` namespace keyed by the closed category slug (matching `CATEGORIES`/`CategoriesType` from `src/lib/types.ts`, including `else`). All 7 call sites that previously ran category slugs through `handleProductName()` (a cosmetic hyphen→comma formatter, not a translator) now call `t(category)` from the `Categories` namespace instead: `products/[slug]/page.tsx`, `ShoppingList.tsx`, `QuickAddItem.tsx`, `MyItemRow.tsx` (×2 — display + chip picker), `FavoritesList.tsx`, `ProductCard.tsx`. `handleProductName` itself is untouched and still used for **product names** (including user-typed custom item names), which the PRD requires to display exactly as entered in every locale — that's an intentionally different code path from category translation.
- **Zod schemas can't be translated at module-load time** (they're module-level constants instantiated once at import). Refactored `SignupFormSchema`/`SigninFormSchema` in `src/lib/types.ts` into `createSignupFormSchema(t)`/`createSigninFormSchema(t)` factories, called inside `signupAction`/`signinAction` (`src/lib/actions.ts`) with a `getTranslations("Validation")` instance resolved per-request. No other callers existed, so this was a safe, contained refactor.
- **Server-side error messages kept the service layer i18n-agnostic.** `productService.ts`'s validation/mutation results used to return literal English strings (`"Name is required"`, etc.) baked in from #17/#18. Refactored to stable `ProductErrorCode` string-union codes (`NAME_REQUIRED`, `NAME_TOO_LONG`, `UNKNOWN_CATEGORY`, `ITEM_NOT_FOUND`) plus an exported `PRODUCT_ERROR_MESSAGE_KEYS` map; `quickAddItem.ts`/`myItems.ts` (the only two consumers) translate the code via `getTranslations("Errors")` at the point they build the client-facing state. This is also just better design independent of i18n — tests now assert on stable codes rather than presentation strings (none of the existing tests happened to assert on the old string values, so this required no test changes, only the production code).
- **Toasts with interpolation**: `useHandleLike`/`useDislike` (like/dislike) previously built description strings with inline ternaries for "Added/Removed" and "to/from". Rather than ICU `select` syntax (correct but harder to review/translate accurately across 5 languages), used **separate keys per branch** (`Favorites.added` / `Favorites.removed`, `Favorites.errorLike` / `Favorites.errorDislike`) with a single `{name}` placeholder each — simpler to get right in every locale, same UX. Same pattern for `ShoppingListItem.tsx`'s dynamic checkbox aria-label (`markPickedUp`/`markNotPickedUp`).
- **Rich-text interpolation**: the home page's "Hello, {name}!" greeting needed the name wrapped in an accent-colored `<span>`. Used next-intl's `t.rich()` with a `<name>{name}</name>` tag in the message (all 5 catalogs) rather than trying to post-process a plain interpolated string — verified working via `t.rich("greeting", { name: (chunks) => <span className="text-accent-ink">{chunks}</span> })` in `HomePageHeading.tsx`.
- **Made several previously-sync components async** to call `getTranslations` server-side: `ProductCard.tsx`, `LogoComponent.tsx`, `LoadingDots.tsx`, `Categories.tsx` (products). Confirmed each is only ever used inside a Server Component tree (no client-side callers) before doing this.
- **Deliberately left untranslated** (all confirmed unused/dead code, not worth translating): `src/app/(home)/components/CarouselContainer.tsx` (a literal placeholder string, not wired into any route), `src/app/(private)/shopping-list/components/ShoppingListLoading.tsx` and `src/app/(private)/shopping-list/formAction.ts` (superseded by earlier slices, zero remaining imports), `src/components/ui/sidebar.tsx` (shadcn boilerplate never wired up — the app uses its own `Sidebar/SidebarWeb.tsx` + `SidebarMobile.tsx`). Also left page `<title>`/`<meta>` metadata (layout.tsx, page-level `metadata` exports) untranslated — browser-tab/SEO text, not in-page visible UI, and out of scope per the acceptance criteria's own "strict on visible UI" framing; flagging as a known gap if the owner wants it addressed later.
- **Found and noted, not fixed (pre-existing, out of scope for this issue)**: `src/app/error.tsx` uses the Pages Router `getInitialProps` convention inside an App Router `error.tsx` file, which Next.js does not invoke that way in App Router — the `statusCode` prop is always `undefined` in practice, so the "An error {statusCode} occurred on server" branch is dead code. Translated the two branches that **are** reachable (`heading`, `clientMessage`, `backToHome`) and left the dead branch as literal English since fixing the underlying bug is unrelated to i18n.
- **Test infra**: two more test files needed `renderWithIntl` (from #20) added — `LoginForm.test.tsx` and `MyItemRow.test.tsx` — both broke with "context from NextIntlClientProvider was not found" once their components started calling `useTranslations`. Also fixed a test assertion in `QuickAddItem.test.tsx` that matched the untranslated category slug text `"else"`; now that it renders as "Other" (its `Categories` translation), updated the regex to match.
- **Manual verification**: full page-by-page pass in German (chosen as a stress test — longer compound words, string expansion) covering home (logged-out and logged-in greeting), all-products listing (all 21 category cards), a category detail page (confirmed product names correctly stay in English — that's #22's job, not this one), register, shopping-list (empty state, quick-add, memo, list-with-item, toast, category header, Clear List), and profile (language picker, both tables, edit dialog) — zero untranslated strings found, zero console errors. Spot-checked Russian on the login page too (non-Latin script rendering). All verification data cleaned from the (real, personal) database afterward.
- Full suite (88 tests, no new ones needed beyond the pre-existing key-parity guard from #20 which now also covers ~90 new keys across `Categories`/`Auth`/`Validation`/`Home`/`Products`/`Favorites`/`Errors`/`ErrorPage`), `tsc --noEmit`, `next lint` all green.
