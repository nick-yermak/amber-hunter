# Skills Registry — Proposed / Audit Before Installation

External candidates (exact versions, SHA and scripts **not yet verified**):
1. Official Angular developer guidance — source: https://github.com/angular/skills ; verify current catalog ID and compatibility with installed Angular.
2. Official Angular new-app / bootstrap skill — same source; use once if available; avoid unnecessary global changes.
3. Anthropic `frontend-design` — https://github.com/anthropics/skills ; visually relevant but platform-independent; use only after review.
4. Vercel `web-design-guidelines` — https://github.com/vercel-labs/agent-skills ; reviewer helper; check network access and fetched external guidelines.

Custom project skills bundled in `.agents/skills/`:
- `issue-to-pr`: development loop and PR evidence.
- `design-review`: screenshot & design token review.
- `forecast-validation`: scoring fixtures, replay, safety review.

## Admission test
Verify exact source repo and file, license, maintainer, pinned commit/version, dependencies/scripts, network calls, permissions, conflicts with AGENTS.md, a representative dry-run and value vs duplication. Record verdict: approved/deferred/rejected. Do not mass-install skills.sh entries by popularity.

## Rule
Skills are process instructions; MCP exposes tools. Neither is a substitute for scoped Issue acceptance criteria or approved architecture.
