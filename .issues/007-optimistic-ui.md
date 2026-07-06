---
id: 7
title: "Optimistic UI for quantity/remove/clear"
type: AFK
status: blocked
blocked_by: [5]
blocks: []
parent: null
tags: [shopping-list, ux]
---

## What to build

The like/favorite toggle already updates its visible state immediately and reconciles with the server in the background — the app's own notes.md even claims this pattern is done everywhere, but it isn't. Quantity changes, item removal, and clearing the list all wait for a full server round trip before the UI shows anything different, which feels laggy on flaky store wifi and blocks rapid repeat taps (e.g. tapping "+" quickly to bump a quantity).

Apply the same optimistic pattern already proven for likes to: quantity increment/decrement, removing a single item, and clearing the whole list. Each of these should update the visible UI immediately on tap, fire the mutation through `ShoppingListService` (issue 5) in the background, and revert the optimistic change with a clear, actionable error if the mutation fails.

## Acceptance criteria

- [ ] Tapping quantity +/- updates the displayed quantity immediately, without waiting for the server response
- [ ] Removing an item removes it from view immediately
- [ ] Clearing the list empties the view immediately (after the confirmation step from issue 10)
- [ ] A failed mutation reverts the optimistic change and shows an actionable error (not a silent failure)
- [ ] Rapid repeated taps (e.g. quickly bumping quantity several times) are not blocked by a disabled/pending state the way they are today
- [ ] Tests cover both the optimistic-success path and the revert-on-failure path for each of the three interactions

## Agent notes

<!-- Leave blank initially. Agents append findings, decisions, and blockers here as they work. -->
