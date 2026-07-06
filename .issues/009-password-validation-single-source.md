---
id: 9
title: "Single source of truth for password validation"
type: AFK
status: ready
blocked_by: [1]
blocks: []
parent: null
tags: [auth, validation]
---

## What to build

The "does this password satisfy the rules" check exists twice: a client-side hook that validates while typing (and disables submit until satisfied), and the server-side schema that actually enforces the rule. They already disagree on what counts as a "special character," to the point that a password the server would accept is permanently rejected by the client hook, blocking submission entirely.

Derive the client-side, while-typing validation from the same schema the server enforces, rather than a separately hand-written regular expression. There should be exactly one place the password rule is written down.

## Acceptance criteria

- [ ] The client-side password validation while typing uses the same schema/rule the server enforces — no separate hand-written regex
- [ ] A password that the server schema accepts is never permanently rejected by the client-side check
- [ ] Existing valid/invalid password test cases (common passwords, missing character classes, etc.) continue to behave the same from the user's perspective
- [ ] Tests cover the shared validation directly (not duplicated between a "client test" and a "server test" of two different implementations)

## Agent notes

<!-- Leave blank initially. Agents append findings, decisions, and blockers here as they work. -->
