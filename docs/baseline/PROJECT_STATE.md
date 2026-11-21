# Amber Hunter — Project State

**Version:** 1.4

**Updated:** 2026-11-21

**Status:** Foundation and Harness work through AH-012 is merged. The next product objective is Explore Map UI.

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

## Verified state on 2026-11-21

- The [repository](https://github.com/nick-yermak/amber-hunter) is public and its default branch is `main`. The verified remote `main` tip on 2026-11-21 was `81ba741b0d4a2edab07fba70cf9af0f6faace86e` (AH-012 squash merge).
- [AH-001](https://github.com/nick-yermak/amber-hunter/issues/1) completed the Issue-to-PR workflow dry run.
- [AH-002](https://github.com/nick-yermak/amber-hunter/issues/3) completed the Reviewer verification for MVP. The owner approved the [Restricted Local Reviewer](../harness/REVIEWER.md) for read-only local review. Remote-write isolation remains unproven. Authenticated GitHub operations are outside the Reviewer workflow.
- [AH-003](https://github.com/nick-yermak/amber-hunter/issues/6) is closed and Done. [PR #7](https://github.com/nick-yermak/amber-hunter/pull/7) was squash-merged as `8fe731e4969a2a8a1d79494fce2508a202633741`. The minimal workspace pins Node.js 24.22.3 and pnpm 10.34.9. The [Workspace install check](https://github.com/nick-yermak/amber-hunter/actions/runs/43157400197) passed on that PR. See the [CI bootstrap guide](../harness/CI_CD.md).
- [Protect main](https://github.com/nick-yermak/amber-hunter/rules/27092966) (ruleset 27092966) was observed active on `main` in the 2026-11-14 audit. It requires a PR, resolution of review discussions, squash merge, and the **Workspace install** check from GitHub Actions. The configured approving review count is zero. It blocks branch deletion and force-pushes, with no bypass actors, including for administrators. Merge queue and required deployments are disabled. The GitHub API audit passed all nine checks. PR #7 merged before the ruleset was created, and enforcement against a prohibited operation has yet to be observed.
- [AH-006](https://github.com/nick-yermak/amber-hunter/issues/14) merged through [PR #15](https://github.com/nick-yermak/amber-hunter/pull/15) as `90235e26cf5927b3df446d6cc0750e292938cd1f`. It adds the Angular 22 workspace and five route patterns. Angular CLI MCP stdio calls passed on the feature branch. Codex Desktop activation remains unverified. See the [web development guide](../../apps/web/README.md).
- [AH-007](https://github.com/nick-yermak/amber-hunter/issues/17) closed after [PR #18](https://github.com/nick-yermak/amber-hunter/pull/18) merged Tailwind CSS v4, Baltic Explorer light-theme tokens, and self-hosted Inter Variable. See the [design system](DESIGN_SYSTEM.md).
- [AH-008](https://github.com/nick-yermak/amber-hunter/issues/19) closed after [PR #20](https://github.com/nick-yermak/amber-hunter/pull/20) merged the [Angular frontend conventions](../engineering/FRONTEND_CONVENTIONS.md).
- [AH-009](https://github.com/nick-yermak/amber-hunter/issues/21) closed after [PR #22](https://github.com/nick-yermak/amber-hunter/pull/22) merged the [Controlled Autonomy v1 workflow](../harness/OPERATING_MODEL.md#issue-workflow).
- [AH-010](https://github.com/nick-yermak/amber-hunter/issues/23) closed after [PR #24](https://github.com/nick-yermak/amber-hunter/pull/24) merged the responsive app shell and navigation.
- [AH-011](https://github.com/nick-yermak/amber-hunter/issues/25) closed after [PR #26](https://github.com/nick-yermak/amber-hunter/pull/26) merged the Home / Forecast UI foundation with sample data.
- [AH-012](https://github.com/nick-yermak/amber-hunter/issues/27) is closed and verified Done in Project #3. [PR #28](https://github.com/nick-yermak/amber-hunter/pull/28) merged the documented [post-merge cleanup procedure](../harness/OPERATING_MODEL.md#post-merge-cleanup). The primary checkout still uses `codex/ah-012-harness-maintenance`. Cleanup was deferred because active local processes were detected and live GitHub checks were unavailable during the attempt.
- Forecast research is at specification v0.1 and awaits scientific validation. The Baltic Explorer reference images are conceptual design guides.

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

## Next product objective

Explore Map UI follows the responsive app shell and Home / Forecast UI. Start from verified remote `main` in a clean checkout. See [Current Operational State](../harness/CURRENT_STATE.md) for the task handoff.

## Documentation rules

Update this snapshot when verified project state changes. Repository implementation and approved ADRs govern technical decisions. Record architectural changes through the ADR process.
