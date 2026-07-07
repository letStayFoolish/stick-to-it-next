---
id: 19
title: "Replace notes dialog with an inline trip memo with reliable save"
type: AFK
status: ready
blocked_by: []
blocks: [21]
parent: null
tags: [shopping-list, notes, ux]
---

## What to build

Replace the current proof-of-concept notes UX (dialog + textarea + dash-line rendering) with an inline trip memo: one always-visible card on the shopping-list page holding a single free-form memo ("budget 50€", "return bottles"). Tap to edit in place — the card becomes an editor, no dialog — and save on blur or an explicit done affordance.

Reliability is the core requirement and this issue supersedes issue #13 (mark #13 done-by-supersession when this lands): a failed save must never be indistinguishable from a success. Keep the draft content visible, surface the failure through the existing toast mechanism, and allow retry; the editing state resolves only after the server confirms.

Scope guards decided during PRD alignment: exactly one memo (no multiple notes), no per-item notes, no new storage shape — the existing single notes string on the user document stays. The memo is cleared together with the list (existing clear-list behavior), and the empty state is a quiet "Add a note for this trip…" affordance rather than a blank card.

Source: `plans/prd-items-notes-i18n-icons.md`, Phase 3, decision 9.

## Acceptance criteria

- [ ] No dialog remains in the notes flow; memo is viewed and edited in place on the shopping-list page
- [ ] Successful save persists and exits editing; failed save keeps the draft visible with a clearly surfaced error and retry (both covered by tests)
- [ ] Clearing the list clears the memo, and the UI communicates this
- [ ] Empty state shows an inviting add affordance
- [ ] Screenshot-verified at ~390px light and dark; issue #13's acceptance criteria are all satisfied

## Agent notes

<!-- Leave blank initially. Agents append findings, decisions, and blockers here as they work. -->
