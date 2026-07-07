---
id: 19
title: "Replace notes dialog with an inline trip memo with reliable save"
type: AFK
status: done
blocked_by: []
blocks: [21]
parent: null
tags: [shopping-list, notes, ux]
---

## What to build

Replace the current proof-of-concept notes UX (dialog + textarea + dash-line rendering) with an inline trip memo: one always-visible card on the shopping-list page holding a single free-form memo ("budget 50€", "return bottles"). Tap to edit in place — the card becomes an editor, no dialog — and save on blur or an explicit done affordance.

Reliability is the core requirement and this issue supersedes issue #13 (mark #13 done-by-supersession when this lands): a failed save must never be indistinguishable from a success. Keep the draft content visible, surface the failure through the existing toast mechanism, and allow retry; the editing state resolves only after the server confirms.

Scope guards decided during PRD alignment: exactly one memo (no multiple notes), no per-item notes, no new storage shape — the existing single notes string on the user document stays. The memo is cleared together with the list (existing clear-list behavior), and the empty state is a quiet "Add a note for this trip…" affordance rather than a blank card.

Source: `plans/prd-items-notes-i18n-icons.md`, Phase 3, decision 9.

## Acceptance criteria

- [x] No dialog remains in the notes flow; memo is viewed and edited in place on the shopping-list page
- [x] Successful save persists and exits editing; failed save keeps the draft visible with a clearly surfaced error and retry (both covered by tests)
- [x] Clearing the list clears the memo, and the UI communicates this
- [x] Empty state shows an inviting add affordance
- [x] Screenshot-verified at ~390px light and dark; issue #13's acceptance criteria are all satisfied

## Agent notes

- **Supersedes #13** (mark #13 done-by-supersession) — its exact bug (dialog closes on click regardless of save outcome, via `onClick={() => setDialogOpen(false)}` on the submit button, independent of the async result) no longer exists since there's no dialog at all.
- **Service layer**: added `setNotes(userId, notes)` to `shoppingListService.ts` (2 new tests). `clearList` already reset `notes` alongside `listItems` from earlier work, so "memo clears with the list" needed no service change — just needed the memo UI to actually reflect fresh `initialNotes` after a clear, which it does via a `useEffect` syncing `savedNotes` to the `initialNotes` prop on every server re-render.
- **Reliability fix (the actual point of this issue)**: `TripMemo.tsx` keeps a `draft` string in **controlled** React state (not an uncontrolled `defaultValue` textarea). `isEditing` only flips to `false` inside a `useEffect` gated on `state.success` from `useActionState` — never on click/blur directly. On failure, `isEditing` stays `true`, the controlled `draft` state keeps the user's exact text (independent of any native form-reset behavior), and `FormError` surfaces `state.message`. Retry is just editing more and submitting again (Done button or blur).
- **Bug found while writing tests (not present in shipped code, only in an earlier draft)**: originally read the submitted value back out via `new FormData(formRef.current)` inside the success effect instead of tracking `draft` in state. This intermittently returned an empty string in tests because it's timing-fragile — nothing guarantees the form's fields still hold the submitted value by the time the effect runs (and controlled inputs make the whole question moot). Switched to reading from the `draft` state variable directly; no DOM inspection needed.
- **Test-writing gotcha worth remembering**: `await screen.findByText("return bottles")` gave a false positive in an early draft of the test — it matched inside the *still-open, controlled* `<textarea>`'s own text content (textareas render their value as a child text node) before the async save had actually resolved, so the assertion passed for the wrong reason. Fixed by waiting on a state transition that can't be satisfied by the pre-save DOM (`await waitFor(() => expect(screen.queryByRole("textbox")).not.toBeInTheDocument())`) before asserting on the post-save text.
- **Save trigger**: submits on blur (if focus moves outside the form) **and** via an explicit "Done" button, per the issue's "blur or an explicit done affordance." Guarded with `!event.currentTarget.contains(event.relatedTarget)` so clicking Done doesn't double-submit via both the blur handler and the button's native submit.
- **Regression caught during manual verification, fixed before commit**: deleting the old `Notes.tsx` also deleted `ClearAllBtn`, which had been nested inside it — the "Clear List" button silently disappeared from the shopping-list page entirely. Re-added `<ClearAllBtn />` to `ListDynamicData.tsx`'s non-empty-list branch (unlike the memo/quick-add, it has nothing to do when the list is already empty, matching its original placement).
- Replaced `src/app/(private)/shopping-list/components/Notes.tsx` (dialog + textarea + `- ` dash-line rendering + separate add/update/remove actions) entirely with `TripMemo.tsx`, rendered in **both** the empty and non-empty list branches of `ListDynamicData.tsx` (the memo is "always visible" per the PRD, unlike the old version which only appeared once the list had items). Rewrote `src/lib/actions/updateNotes.ts` down to a single action with a `{ success, message }` shape, consistent with the rest of the app's action conventions.
- 5 new component tests (`TripMemo.test.tsx`): empty-state affordance, existing-memo display, tap-to-edit pre-fill, success exits edit mode, failure keeps draft + shows error.
- Manual verification at 390×844: empty state → edit → save → reload (persistence survives a full page load) → re-edit existing memo → dark mode → Clear List (memo reverts to empty-state affordance) — all clean, zero console warnings, using a throwaway account cleaned up afterward.
- New strings for the future i18n sweep (#21): "Add a note for this trip…", "Done".
- Full suite (73 tests), `tsc --noEmit`, `next lint` all green.
