---
id: 22
title: "Localize seeded product names with committed seed data"
type: AFK
status: blocked
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

- [ ] Seeded items display translated names in each locale; missing locale keys fall back to en (tested)
- [ ] User-created items display exactly as typed regardless of UI language (tested)
- [ ] Components receive one resolved display name from the DTO layer — no per-component locale conditionals
- [ ] Seed script + data file are committed and can rebuild the catalog from scratch
- [ ] Migration leaves existing user list/like references intact; full test suite passes

## Agent notes

<!-- Leave blank initially. Agents append findings, decisions, and blockers here as they work. -->
