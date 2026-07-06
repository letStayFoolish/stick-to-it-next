---
id: 2
title: "Delete dead/fake modules"
type: AFK
status: ready
blocked_by: [1]
blocks: []
parent: null
tags: [cleanup]
---

## What to build

Remove code with zero real call sites, found during the architecture review, before any of the surrounding modules get touched by later phases:

- A notes-save handler that calls `localStorage` from code that runs server-side — it cannot function where it's placed and nothing imports it (the real notes-save path is a separate, working server action).
- A duplicate-email-check helper that nothing calls — the signup flow already re-implements the same lookup inline.
- A base-URL helper that is exported but has no call sites anywhere in the codebase.
- A boolean "liked" field on the product data model that is never read or written by any code path — the real per-user "liked" relationship is correctly modeled elsewhere, on the user's own liked-items list. This field misrepresents a per-user relationship as a global one and could mislead a future change into using it.
- A non-functional pre-App-Router error-boundary pattern (relies on a lifecycle API that doesn't exist in the App Router) that is effectively dead in production.

This is pure deletion — no behavior visible to users should change. If any of the above turns out to have a real call site once double-checked, do not delete it; flag it in Agent notes instead and leave it in place.

## Acceptance criteria

- [ ] All five dead code paths above are removed
- [ ] Full build passes with no new type errors
- [ ] No behavior change in any user-facing flow (verified by exercising signup, notes-saving, and the like/favorite toggle manually or via existing smoke tests)
- [ ] A grep/search for each removed symbol confirms zero remaining references

## Agent notes

<!-- Leave blank initially. Agents append findings, decisions, and blockers here as they work. -->
