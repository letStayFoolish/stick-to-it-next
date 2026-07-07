---
id: 23
title: "Owner translation review (sr/ru) and on-phone verification sign-off"
type: HITL
status: blocked
blocked_by: [21, 22]
blocks: []
parent: null
tags: [i18n, review, mobile]
---

## What to build

Human sign-off gate for the whole initiative. The owner reviews the LLM-generated Serbian (Latin) and Russian translations — both UI catalogs (#21) and seeded product names (#22) — and walks the real app on their phone in each language, light and dark. es/de get a plausibility skim; en is the reference.

Agents: when the blocking issues are done, prepare a review package (how to switch languages, a checklist of routes to walk, and a diff-friendly view of sr/ru catalog files), then stop and surface it to the owner. Apply the owner's corrections, then close.

Source: `plans/prd-items-notes-i18n-icons.md`, Phase 4 acceptance + cross-cutting requirements.

## Acceptance criteria

- [ ] Owner has reviewed and corrected sr and ru translations (catalogs and product names)
- [ ] Owner has verified the app on a real phone in every locale, both color schemes
- [ ] All correction feedback is applied and committed
- [ ] Owner explicitly signs off that the initiative is done

## Agent notes

<!-- Leave blank initially. Agents append findings, decisions, and blockers here as they work. -->
