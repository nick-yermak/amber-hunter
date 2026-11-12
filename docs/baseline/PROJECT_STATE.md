# Amber Hunter — Project State

**Version:** 1.1

**Updated:** 2026-11-12

**Status:** Discovery baseline approved. Workspace and CI bootstrap complete. Angular initialization is pending.

## Project mission
Build a polished, public, free-to-use portfolio and learning application for finding favorable amber-hunting conditions on Poland's Baltic coast. Demonstrate Angular, geospatial engineering, data processing, explainable forecasts, quality engineering, and a pragmatic Codex-based AI development harness. Commercial competition and monetization are not primary objectives.

## Approved decisions

| Area | Decision |
|---|---|
| Product | Amber Hunter; beginners, enthusiasts, and tourists |
| Launch | Pilot of 5–10 coastal beaches near Gdańsk, including Sobieszewo and Mikoszewo; future expansion along Polish Baltic coast |
| Frontend | Angular + TypeScript + Signals, Tailwind CSS, Angular CDK, Lucide |
| Maps | MapLibre GL JS |
| Mobile | Responsive PWA first; Capacitor for iOS/Android later |
| Backend | Cloudflare Workers + D1 |
| Hosting | Cloudflare Workers Static Assets; local, PR preview, production |
| Repo | pnpm workspaces monorepo; **no Nx** |
| Development | Codex Desktop on macOS, local-first |
| Delivery | GitHub Projects/Issues/milestones/PR, GitHub Actions, owner-controlled merge |
| Harness | Balanced: main implementation agent + independent read-only reviewer, curated skills and MCP; risk-based permissions |
| Budget | Target approximately 0 PLN/month (verify current free tiers/limits) |
| Design | Baltic Explorer; approved reference images in `docs/design/references/` |
| Authentication | Anonymous MVP; authentication/community later |
| Language | PL / EN / RU, browser detection and manual switching |
| Forecast | Experimental Amber Index 0–100; Open-Meteo primary, Copernicus research; 72h conditions; three-hour refresh checks; independent safety checks |
| Content | Amber Academy static articles for MVP; CMS later |

## Verified state on 2026-11-12

- The [repository](https://github.com/nick-yermak/amber-hunter) is public and its default branch is `main`.
- [AH-001](https://github.com/nick-yermak/amber-hunter/issues/1) completed the Issue-to-PR workflow dry run.
- [AH-002](https://github.com/nick-yermak/amber-hunter/issues/3) completed the Reviewer verification for MVP. The owner approved the [Restricted Local Reviewer](../harness/REVIEWER.md) for read-only local review. Remote-write isolation remains unproven. Authenticated GitHub operations are outside the Reviewer workflow.
- [AH-003](https://github.com/nick-yermak/amber-hunter/issues/6) is closed and Done. [PR #7](https://github.com/nick-yermak/amber-hunter/pull/7) was squash-merged as `8fe731e4969a2a8a1d79494fce2508a202633741`. The minimal workspace pins Node.js 24.22.3 and pnpm 10.34.9. The [Workspace install check](https://github.com/nick-yermak/amber-hunter/actions/runs/43157400197) passed on that PR. See the [CI bootstrap guide](../harness/CI_CD.md).
- [Protect main](https://github.com/nick-yermak/amber-hunter/rules/27092966) (ruleset 27092966) is active on `main`. It requires a PR, resolution of review discussions, squash merge, and the **Workspace install** check from GitHub Actions. The configured approving review count is zero. It blocks branch deletion and force-pushes, with no bypass actors, including for administrators. Merge queue and required deployments are disabled. The GitHub API audit passed all nine checks. PR #7 merged before the ruleset was created, and enforcement against a prohibited operation has yet to be observed.
- Angular initialization is pending. Forecast research is at specification v0.1 and awaits scientific validation. The Baltic Explorer reference images are conceptual design guides.

## Important constraints
- A high Amber Index is **not** a probability of finding amber.
- Display data confidence separately from the index.
- Safety restrictions and hazardous weather override positive calls to action.
- The observation that NE winds and post-storm periods favor Sobieszewo/Mikoszewo is an **unvalidated hypothesis**, not an algorithmic fact.
- Do not mix historical forecasts with hindsight-derived historical weather.
- Do not write implementation code until explicitly requested.

## Outstanding decisions and research
1. Verify the Codex Desktop version and the effective permissions of each MCP integration before use.
2. Verify licensing, API limits, map tile terms, attribution and current pricing.
3. Approve exact UI tokens after implementation contrast/accessibility review.
4. Validate coastline geometries and segment length (250–500 m is a proposed starting range, not an approved scientific resolution).
5. Research scoring functions, factor weights and thresholds; avoid treating example weights as approved.
6. Design safety source freshness/failure behavior and protected area coverage.
7. Decide hosting details for per-PR preview and test data bindings.
8. Amber Quest remains a future separate discovery track, non-blocking for MVP.

## Next phase

1. Use the verified Context7 integration for read-only documentation lookup.
2. Defer Angular CLI MCP until the Angular scaffold exists. Verify supported commands and effective read-only behavior before activation.
3. Use `gh` for GitHub work. Revisit GitHub MCP if a concrete capability gap emerges. See the [MCP registry](../harness/MCP_REGISTRY.md).

## Documentation rules

Update this snapshot when verified project state changes. Repository implementation and approved ADRs govern technical decisions. Record architectural changes through the ADR process.
