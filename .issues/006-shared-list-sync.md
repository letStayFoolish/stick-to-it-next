---
id: 6
title: "Shared-list sync via revalidate-on-focus + short poll interval"
type: AFK
status: blocked
blocked_by: [5]
blocks: []
parent: null
tags: [shopping-list, ux]
---

## What to build

Two people share one list, but today a change made on one device (adding an item, checking one off) isn't visible on the other device until it happens to navigate or manually refresh. There's no polling, no websocket, no subscription of any kind — the page only reflects fresh data when the viewing device itself triggers a server round trip.

Add lightweight sync to the shopping-list page: revalidate when the window/tab regains focus, and on a short interval (a few seconds) while the page is open and visible. This is a deliberate choice over real-time infrastructure (websockets/SSE/change streams) — polling is sufficient for a two-person household list and doesn't introduce a persistent-connection failure mode. Real-time sync is out of scope for this issue and this PRD.

## Acceptance criteria

- [ ] Reopening/refocusing the shopping-list tab reflects changes made from another device without a manual refresh
- [ ] The page also refreshes on a short interval while left open and visible, without requiring focus changes
- [ ] Polling stops or backs off when the tab is hidden/backgrounded (don't poll a tab nobody's looking at)
- [ ] No new persistent-connection infrastructure (websockets/SSE) is introduced
- [ ] Tests cover the revalidation trigger logic itself (e.g. that focus/interval events call the expected data-refresh path), not a full real-browser round trip

## Agent notes

<!-- Leave blank initially. Agents append findings, decisions, and blockers here as they work. -->
