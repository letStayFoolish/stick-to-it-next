---
id: 17
title: "Quick-add a custom grocery item from the shopping list"
type: AFK
status: blocked
blocked_by: [15, 16]
blocks: [18, 21]
parent: null
tags: [shopping-list, custom-items, ux, mobile]
---

## What to build

A quick-add affordance on the shopping-list page: the user types an item name, picks a category from a horizontally scrollable chip row (preselected to the "else" category), and in one action the item is created as their own product (owner set, #16) and added to their shopping list via the existing list service. This matches the real moment of need — "I need batteries and they're not in the catalog" — on a phone, in a store.

Behavior decisions locked during PRD alignment:
- Categories are the existing closed set only — no custom categories.
- Dedup on create: a case-insensitive name match within the same category against items the user can see (seeded + own) reuses that product instead of creating a duplicate.
- Validation: name required, trimmed, max ~60 chars; category must be a valid member of the closed category set.
- Created items need no image (#15) and thereafter behave like catalog items: likeable, searchable, browsable in their category, re-addable next week.

Mobile-first: thumb-sized targets, visible active states, optimistic add consistent with the list's existing optimistic behavior, motion within the redesign's five-touchpoint restraint.

Source: `plans/prd-items-notes-i18n-icons.md`, Phase 2, decisions 1–3.

## Acceptance criteria

- [ ] From the shopping list, typing a name and confirming creates the item and shows it on the list in one motion
- [ ] Category chip row defaults to "else"; chosen category is persisted on the item
- [ ] Duplicate name (case-insensitive, same category) reuses the existing product — verified for both a seeded and an own item
- [ ] Validation rejects empty/whitespace names and out-of-set categories with a visible, non-silent error
- [ ] Created item later appears in its category page and search for its owner only
- [ ] Service-level tests cover create, dedup, validation; flow screenshot-verified at ~390px light and dark

## Agent notes

<!-- Leave blank initially. Agents append findings, decisions, and blockers here as they work. -->
