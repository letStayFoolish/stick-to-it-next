---
id: 20
title: "i18n foundation: next-intl without routing, locale resolution, language picker"
type: AFK
status: done
blocked_by: []
blocks: [21, 22]
parent: null
tags: [i18n, profile, infra]
---

## What to build

Introduce next-intl in "without i18n routing" mode as a tracer bullet: full locale plumbing plus a thin slice of actually-translated UI (navigation plus one page) in all five locales, proving the pipeline end-to-end before the big sweep (#21).

Locked decisions:
- Locales: en (default), ru, sr (Serbian in **Latin** script), es, de.
- Resolution order: locale cookie → browser Accept-Language → en. No locale in URLs; routes and auth middleware unchanged.
- The preference is per-user: stored on the user document and mirrored in the cookie so SSR renders the right language immediately and the choice follows the user across devices.
- Profile page gets a language picker showing native names (English, Русский, Srpski, Español, Deutsch).

Source: `plans/prd-items-notes-i18n-icons.md`, Phase 4, decisions 5–6.

## Acceptance criteria

- [x] Message catalog files exist for all five locales; nav + one chosen page render fully translated in each
- [x] Switching language in profile re-renders the app in that language with no URL change, persists across sessions, and follows the account to a fresh device (DB-backed)
- [x] First visit with a Russian Accept-Language header renders ru; unknown languages fall back to en (tested)
- [x] Missing-key/locale fallback to en proven by test
- [x] Auth middleware and all existing routes behave exactly as before

## Agent notes

- **next-intl in "without i18n routing" mode**: `next.config.ts` wrapped with `createNextIntlPlugin("./src/i18n/request.ts")`; root `layout.tsx` wraps children in `NextIntlClientProvider` fed by `getLocale()`/`getMessages()`. No route changes, no `[locale]` segment, `src/middleware.ts` untouched — verified via a Playwright check that unauthenticated access to `/shopping-list` still redirects to `/login?from=...` exactly as before.
- **Locale resolution** (`src/i18n/request.ts`, pure logic in `src/lib/locale.ts`): cookie (`locale`) → `Accept-Language` (parsed by primary subtag with q-value ranking, `src/lib/locale.ts`'s `resolveLocaleFromAcceptLanguage`) → `en`. `locale.ts` has zero Next.js imports so it's fully unit-testable (8 tests covering q-value ordering, region-qualified tags like `ru-RU`, unsupported-language fallback).
- **DB-backed, follows to a fresh device**: added an optional `language` field to the `User` model. `src/lib/localeCookie.ts`'s `syncLocaleCookieForUser` runs at both login and signup (wired into `src/lib/actions.ts`) — it reads the stored `language`, and if unset (first-ever signup, or a pre-existing account predating this feature), detects it from the request's `Accept-Language` header and persists it, then sets the `locale` cookie to match. This is why a fresh, cookie-less device immediately renders in the account's language after login rather than falling through to that device's own browser language.
- **Language picker**: `src/app/(private)/profile/components/LanguagePicker.tsx`, a `<select>` of native language names (English/Русский/Srpski/Español/Deutsch — intentionally not translated, matching how language pickers conventionally work) that self-submits on change via `src/lib/actions/updateLanguage.ts` (validates against `isSupportedLocale`, requires auth, writes DB + cookie, `revalidatePath("/", "layout")`).
- **Bug found and fixed during manual verification**: the picker's `<select defaultValue={currentLocale}>` didn't visually update after a successful language change — confirmed by screenshot (the label text re-rendered in the new language, proving the server round-trip worked, but the dropdown still showed the old selection). Root cause: `defaultValue` only applies on mount; React doesn't re-apply it on a prop change for an already-mounted uncontrolled element. Fixed with `key={currentLocale}` on the `<select>` to force a remount whenever the resolved locale changes.
- **Message catalogs** (`messages/{en,ru,sr,es,de}.json`): `Nav` (4 keys) + `ShoppingListPage` (10 keys) + `Profile` (1 key) as the tracer-bullet slice — nav labels plus the shopping-list page's own copy (heading, Go Home/Browse Products, empty state, Clear List, quick-add placeholder/button/toast, memo placeholder/Done). Deliberately did **not** translate category names/labels (e.g. "bakery") — that's catalog name localization, #22's job; `handleProductName(category)` stays as-is for now. Translations are LLM-generated per the PRD's own decision; ru/sr need the owner's review in #23.
- **Fallback-to-en guards, both proven by test**: (1) `src/lib/messages.test.ts` asserts all 5 catalogs share an identical key set (structural guard against drift — a missing key literally cannot exist while this passes). (2) `src/lib/messageFallback.ts`'s `resolveMessageFallback`, wired into `getRequestConfig`'s `getMessageFallback`, looks up any missing key in the English catalog at runtime as a second line of defense (e.g. if a future non-English catalog briefly drifts before the parity test catches it in CI) — 2 tests directly exercise this function, including the last-resort case where even English lacks the key.
- **`routes.ts`** (shared between the mobile bottom nav in `Footer.tsx` and the desktop sidebar's `NavLinks.tsx`) changed from a hardcoded English `pageName` string to a `labelKey` resolved via `useTranslations("Nav")` in each consumer, since translation requires a hook/component context that the plain routes array itself can't have.
- **Test infra**: added `src/test-utils/renderWithIntl.tsx` (wraps RTL's `render` in a `NextIntlClientProvider` with English messages) since `QuickAddItem.tsx`/`TripMemo.tsx` now call `useTranslations` and threw "context not found" in their existing tests without it — both test files updated to use it.
- **Manual verification** (throwaway account, 390×844): signed up with a Russian `Accept-Language` header → shopping list rendered fully in Russian; switched to Spanish via the profile picker → re-rendered immediately, no URL change; logged in from a brand-new browser context (no cookie) with the same account → still Spanish, proving the DB-backed fresh-device behavior; confirmed the anonymous-user redirect to `/login` is byte-for-byte the same as before. All test data cleaned up afterward.
- Full suite (88 tests), `tsc --noEmit`, `next lint` all green.
