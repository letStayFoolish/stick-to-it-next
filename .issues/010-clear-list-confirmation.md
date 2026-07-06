---
id: 10
title: "'Clear list' confirmation"
type: AFK
status: ready
blocked_by: [1]
blocks: []
parent: null
tags: [shopping-list, ux]
---

## What to build

Clearing the entire shopping list today happens on a single tap with no confirmation and no undo. In a crowded store aisle, one misplaced tap wipes the whole list.

Add an explicit confirmation step (a dialog) before the clear action actually executes. The list is only cleared after the user confirms.

## Acceptance criteria

- [ ] Tapping "clear list" shows a confirmation step before anything is removed
- [ ] Confirming proceeds to actually clear the list
- [ ] Dismissing/cancelling the confirmation leaves the list untouched
- [ ] The confirmation is itself reachable and dismissible via keyboard, not just touch/mouse
- [ ] Tests cover: confirm → list cleared; cancel/dismiss → list unchanged

## Agent notes

<!-- Leave blank initially. Agents append findings, decisions, and blockers here as they work. -->
