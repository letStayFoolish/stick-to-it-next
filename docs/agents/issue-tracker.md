# Issue tracker: Local Markdown (`.issues/`)

Issues for this repo live as markdown files in `.issues/`, one file per issue. PRDs and phase plans live separately in `plans/`.

## Conventions

- Issues are flat files: `.issues/<NNN>-<slug>.md`, numbered from `001` (zero-padded to 3 digits), incrementing across the whole repo — not per-feature.
- Each file opens with YAML frontmatter:
  ```yaml
  ---
  id: 14
  title: "Render all category imagery as icons via a CategoryIcon component"
  type: AFK
  status: ready
  blocked_by: []
  blocks: [15]
  parent: null
  tags: [ui, icons, shopping-list, product]
  ---
  ```
  - `type`: `AFK` (fully specified, no human context needed to pick up) or `HITL` (requires human-in-the-loop implementation).
  - `status`: see `triage-labels.md` for the canonical values and how they map onto `type`.
  - `blocked_by` / `blocks`: arrays of other issue `id`s, for dependency ordering.
  - `parent`: `id` of a parent issue/epic, or `null`.
- Body sections, in order:
  - `## What to build` — the spec. Usually references the source PRD under `plans/`.
  - `## Acceptance criteria` — a checklist.
  - `## Agent notes` — starts blank (`<!-- Leave blank initially... -->`); agents append findings, decisions, and blockers here as they work.
- PRDs and multi-phase plans live in `plans/<slug>.md` (e.g. `plans/prd-items-notes-i18n-icons.md`), not inside `.issues/`. An issue's `## What to build` typically cites the PRD and phase it came from.

## When a skill says "publish to the issue tracker"

Create a new file at `.issues/<next-NNN>-<slug>.md` (next number = highest existing `id` + 1), following the frontmatter and section structure above. Wire up `blocked_by` / `blocks` / `parent` against existing issue `id`s where relevant.

## When a skill says "fetch the relevant ticket"

Read the file at `.issues/<NNN>-*.md` for the referenced id. Grep `^id: <N>$` across `.issues/*.md` if only the number is given.

## External PRs as a triage surface

Not applicable — this is a local, non-GitHub-Issues tracker. `/triage` only processes files under `.issues/`.
