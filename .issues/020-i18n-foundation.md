---
id: 20
title: "i18n foundation: next-intl without routing, locale resolution, language picker"
type: AFK
status: ready
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

- [ ] Message catalog files exist for all five locales; nav + one chosen page render fully translated in each
- [ ] Switching language in profile re-renders the app in that language with no URL change, persists across sessions, and follows the account to a fresh device (DB-backed)
- [ ] First visit with a Russian Accept-Language header renders ru; unknown languages fall back to en (tested)
- [ ] Missing-key/locale fallback to en proven by test
- [ ] Auth middleware and all existing routes behave exactly as before

## Agent notes

<!-- Leave blank initially. Agents append findings, decisions, and blockers here as they work. -->
