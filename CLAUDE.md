## Agent skills

### Issue tracker

Local markdown — issues live as `.issues/<NNN>-<slug>.md` (flat, repo-wide numbering, YAML frontmatter), PRDs live in `plans/`. No external PRs to triage (not GitHub Issues). See `docs/agents/issue-tracker.md`.

### Triage labels

Canonical role names used as-is in the `status:` frontmatter field; existing 23 issues predate this and still use `ready` / `blocked` / `done` until re-triaged. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context — one `CONTEXT.md` + `docs/adr/` at the repo root (neither exists yet; created lazily). See `docs/agents/domain.md`.
