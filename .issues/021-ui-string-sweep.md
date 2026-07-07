---
id: 21
title: "Sweep all UI strings into the five locale catalogs"
type: AFK
status: blocked
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

- [ ] A page-by-page pass in each locale shows no untranslated user-facing strings (spot-check every route, light on legalese, strict on visible UI)
- [ ] Category labels render translated everywhere categories appear (chips, headers, pages)
- [ ] Validation and error messages (including server-action failures and toasts) are localized
- [ ] en catalog is the complete reference; a test guards that all locales contain the same key set
- [ ] Type-check, lint, and full test suite pass

## Agent notes

<!-- Leave blank initially. Agents append findings, decisions, and blockers here as they work. -->
