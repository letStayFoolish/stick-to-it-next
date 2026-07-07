---
id: 15
title: "Remove product/category image fields and delete PNG assets"
type: AFK
status: blocked
blocked_by: [14]
blocks: [17]
parent: null
tags: [schema, cleanup, icons]
---

## What to build

With all rendering switched to icons (#14), remove the now-dead image plumbing end-to-end: the required `product_image` field on the Product schema, the `product_image`/`category_image` members of the shared Product types and DTO layer, and the category PNG files themselves.

This unblocks user-created products (#17), which must be creatable without any image. Keep the DB change additive/non-destructive: stop requiring and reading the field; do not run a destructive migration that drops data.

Source: `plans/prd-items-notes-i18n-icons.md`, Phase 1.

## Acceptance criteria

- [ ] Product schema no longer requires (or validates) an image field; creating a product without one succeeds
- [ ] No type, DTO, or component references `product_image` / `category_image`
- [ ] Category PNG assets are deleted from the repo; build contains no references to them
- [ ] Type-check, lint, and full test suite pass

## Agent notes

<!-- Leave blank initially. Agents append findings, decisions, and blockers here as they work. -->
