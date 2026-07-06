---
id: 8
title: "Read-side product+quantity+liked join on ShoppingListService"
type: AFK
status: blocked
blocked_by: [5]
blocks: []
parent: null
tags: [shopping-list, performance]
---

## What to build

Several places in the UI need "a product, enriched with this user's current quantity-in-list and liked state" — a category product list, a favorites list. Today each place reimplements this join independently: one fetches the whole shopping list and does a client-side lookup per row; another fetches every product in the database and filters in JavaScript for liked ones, instead of querying only the relevant ones the way a sibling function correctly does.

Add a read method to `ShoppingListService` (issue 5) that returns products already enriched with the current user's quantity and liked state for a given set of product ids (or all products, for the category-browsing case). Replace the per-component reimplementations with calls to this one method, including fixing the favorites fetch to query only the relevant products instead of fetching everything and filtering client-side.

## Acceptance criteria

- [ ] One method on `ShoppingListService` is the sole place this join is implemented
- [ ] The favorites list no longer fetches every product and filters in-memory — it queries only the products it needs
- [ ] Category product browsing and the favorites list both consume the same enrichment method
- [ ] Tests cover: a product with a quantity in the list is enriched correctly; a liked product is enriched correctly; a product with neither returns correctly-shaped defaults
- [ ] No change in what's visually displayed — this is a correctness/performance change to how the data is assembled, not what's shown

## Agent notes

<!-- Leave blank initially. Agents append findings, decisions, and blockers here as they work. -->
