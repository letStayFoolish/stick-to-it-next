---
id: 11
title: "Checkbox tap target fix + touch-reachable tooltip"
type: AFK
status: ready
blocked_by: [1]
blocks: []
parent: null
tags: [ux, accessibility]
---

## What to build

Two related "can't reach it with a thumb" problems on the shopping-list item row:

1. The checkbox used to mark an item as picked up is small, and only the checkbox itself responds to a tap — the row around it (including the product name) is not part of the tap target. The accessible label for the checkbox also doesn't correctly reference the product name, so a screen reader gets no useful label either.
2. A long product name is truncated, and the only way to see the full name is a tooltip that only responds to hover — which has no equivalent on a touchscreen, so the full name is simply unreachable on a phone.

Fix both: make the entire item row (not just the small checkbox) a single tap target for checking an item off, with an accessible label that references the actual product name. Make the long-name tooltip reachable by tap, not hover-only.

## Acceptance criteria

- [ ] Tapping anywhere on a shopping-list item's row (not just the checkbox itself) toggles its checked state
- [ ] The accessible label for the row/checkbox correctly names the product, verifiable via accessibility tooling/testing-library queries
- [ ] A long product name's full text is reachable via tap on a touch device, not hover-only
- [ ] Tests cover: clicking/tapping anywhere in the row toggles checked state; the accessible name matches the product; the full name becomes visible on tap

## Agent notes

<!-- Leave blank initially. Agents append findings, decisions, and blockers here as they work. -->
