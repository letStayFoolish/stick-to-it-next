---
id: 13
title: "Reliable notes-save dialog"
type: AFK
status: ready
blocked_by: [1]
blocks: []
parent: null
tags: [shopping-list, ux]
---

## What to build

The dialog for saving a note on the shopping list closes immediately when the save button is tapped, regardless of whether the save actually succeeds. If it fails, the error message is rendered inside a dialog that has already closed — so a failed save looks identical to a successful one, and the user has no way to know their note wasn't stored.

Fix the dialog to only close once the save has been confirmed successful. On failure, keep the dialog open (or otherwise surface the error somewhere the user will actually see it, e.g. the app's existing toast mechanism) so a failed save is never silently indistinguishable from a successful one.

## Acceptance criteria

- [ ] The notes dialog remains open (or the failure is otherwise clearly surfaced) when a save fails
- [ ] The notes dialog closes only after a save is confirmed successful
- [ ] A failed save shows an actionable error the user will actually see
- [ ] Tests cover: successful save → dialog closes, note persisted; failed save → dialog stays open or error is visibly surfaced, note not falsely presented as saved

## Agent notes

<!-- Leave blank initially. Agents append findings, decisions, and blockers here as they work. -->
