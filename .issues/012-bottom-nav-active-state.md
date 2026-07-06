---
id: 12
title: "Bottom nav active-state + accessible labels"
type: AFK
status: ready
blocked_by: [1]
blocks: []
parent: null
tags: [ux, accessibility, navigation]
---

## What to build

The bottom navigation bar — the thumb-reachable nav, meant for one-handed use while shopping — never visually indicates which section is currently active. The underlying logic reads the current path from a mechanism that's never actually populated, so the "active" styling never applies regardless of which page is open. Its icons also have no accessible labels at all (a separate, more complete desktop nav does have labels, but it's not the one that's thumb-reachable).

Fix the active-section detection to use the current route directly (rather than the unpopulated mechanism it reads today), so the currently active section is visually indicated. Add an accessible label to every navigation icon.

## Acceptance criteria

- [ ] The bottom nav visually indicates the currently active section on every route it covers
- [ ] Every icon in the bottom nav has an accessible label naming its destination
- [ ] Navigating between sections updates which icon is shown as active
- [ ] Tests cover: rendering the nav on each of its routes shows the correct icon as active; each icon exposes its accessible name

## Agent notes

<!-- Leave blank initially. Agents append findings, decisions, and blockers here as they work. -->
