---
id: 18
title: "My items management on the profile page"
type: AFK
status: blocked
blocked_by: [17]
blocks: [21]
parent: null
tags: [profile, custom-items, ux]
---

## What to build

A "My items" section on the profile page listing the user's own created items (name + category icon), with the ability to edit an item's name, change its category, and delete it. This prevents the junk-drawer problem — a typo'd item living forever in search results. Follow the pattern already established by the profile's favorites list.

Deleting a custom item must cascade: it is removed from the user's shopping list entries and liked items as well, never leaving dangling references. Editing keeps the same product identity (existing list/like references stay valid).

Mobile-first; use the redesign's tokens and interaction rules.

Source: `plans/prd-items-notes-i18n-icons.md`, Phase 2, decision 4.

## Acceptance criteria

- [ ] Profile shows all of the user's created items and none of the seeded ones
- [ ] Renaming and recategorizing an item is reflected everywhere it appears (list, category page, favorites)
- [ ] Deleting an item removes it from the catalog, the shopping list, and likes in one action (integration test proves no dangling references)
- [ ] Other users' views are unaffected by these operations
- [ ] Screenshot-verified at ~390px light and dark

## Agent notes

<!-- Leave blank initially. Agents append findings, decisions, and blockers here as they work. -->
