# Triage Labels

Issues in `.issues/*.md` don't use GitHub-style labels — the triage state lives in the frontmatter `status:` field (see `issue-tracker.md`). The five canonical roles map onto that field using the skill's default names, unchanged:

| Canonical role      | `status:` value in this repo | Meaning                                   |
| ------------------- | ----------------------------- | ------------------------------------------ |
| `needs-triage`       | `needs-triage`                | Maintainer needs to evaluate this issue    |
| `needs-info`         | `needs-info`                  | Waiting on reporter for more information   |
| `ready-for-agent`    | `ready-for-agent`              | Fully specified, ready for an AFK agent    |
| `ready-for-human`    | `ready-for-human`              | Requires human implementation              |
| `wontfix`            | `wontfix`                     | Will not be actioned                       |

When a skill mentions a role (e.g. "apply the AFK-ready triage label"), write that exact string into the `status:` field of the issue's frontmatter.

## `type:` still matters

`status:` records triage state; `type:` (`AFK` or `HITL`) records who is expected to execute the work once it's ready. A `ready-for-agent` issue should have `type: AFK`; a `ready-for-human` issue should have `type: HITL`. Keep both fields consistent when triaging.

## Existing issues predate this convention

The 23 issues already in `.issues/` (as of this setup) use an older, coarser vocabulary: `status: ready`, `status: blocked`, `status: done`. These were not retroactively migrated. Leave them as-is unless you're actively re-triaging one — at that point, update it to the canonical vocabulary above rather than leaving it in the old scheme.
