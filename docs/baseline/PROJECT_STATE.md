# Amber Hunter — Project State

**Version:** 1.6

**Updated:** 2026-11-24

**Status:** Implementation through AH-019 is merged. AH-020 weather and marine feasibility research is complete. [Issue #47](https://github.com/nick-yermak/amber-hunter/issues/47) tracks the repository documentation closeout.

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
| Harness | [Controlled Autonomy v1.1](../harness/OPERATING_MODEL.md#issue-workflow), with a Main agent, an independent Restricted Local Reviewer, and exclusive Human Owner merge authority |
| Budget | Target approximately 0 PLN/month (verify current free tiers/limits) |
| Design | Baltic Explorer; approved reference images in `docs/design/references/` |
| Authentication | Anonymous MVP; authentication/community later |
| Language | PL / EN / RU, browser detection and manual switching |
| Forecast | Experimental Amber Index 0–100; Open-Meteo primary, Copernicus research; 72h conditions; three-hour refresh checks; independent safety checks |
| Content | Amber Academy static articles for MVP; CMS later |

## Verified remote baseline

At the start of [Issue #45](https://github.com/nick-yermak/amber-hunter/issues/45) on 2026-11-24, GitHub reported `8cfa7ebad92b3023c341e3c3748a3b788c701040` as the tip of remote `main`. GitHub confirmed that each Issue below was closed as Completed and each PR was merged into `main`.

| Task | Closed Issue | Merged PR | Delivered |
|---|---|---|---|
| AH-015 | [#35](https://github.com/nick-yermak/amber-hunter/issues/35) | [#36](https://github.com/nick-yermak/amber-hunter/pull/36) | Controlled Autonomy v1.1, including exact-diff Reviewer handoff and safeguarded post-merge synchronization |
| AH-016 | [#37](https://github.com/nick-yermak/amber-hunter/issues/37) | [#38](https://github.com/nick-yermak/amber-hunter/pull/38) | Disabled automatic query-parameter input binding and documented the Angular routing convention |
| AH-017 | [#39](https://github.com/nick-yermak/amber-hunter/issues/39) | [#40](https://github.com/nick-yermak/amber-hunter/pull/40) | Amber Academy static content and article reader foundation |
| AH-018 | [#41](https://github.com/nick-yermak/amber-hunter/issues/41) | [#42](https://github.com/nick-yermak/amber-hunter/pull/42) | Runtime localization foundation for PL, EN, and RU |
| AH-019 | [#43](https://github.com/nick-yermak/amber-hunter/issues/43) | [#44](https://github.com/nick-yermak/amber-hunter/pull/44) | Shared frontend forecast contracts and demo fixtures for Home, Explore Map, and Beach Details |

The initial local inspection found a clean primary checkout and matching local `main` and cached `origin/main`. Those are observations of this checkout. Any owner-reported state from another checkout is local context and requires its own verification.

GitHub reported the remote head refs for PRs #36, #38, #40, #42, and #44 absent on 2026-11-24.

## Verified state on 2026-11-22

- The [repository](https://github.com/nick-yermak/amber-hunter) is public and its default branch is `main`. The AH-015 baseline audit verified local `main`, cached `origin/main` and live remote `main` at `5cce4053cca64a9720515ba82d17a6c3dd7970c5`. The primary checkout was clean and was the only registered worktree. No synchronization was needed.
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
- [AH-012](https://github.com/nick-yermak/amber-hunter/issues/27) is closed and verified Done in Project #3. [PR #28](https://github.com/nick-yermak/amber-hunter/pull/28) merged the documented [post-merge cleanup procedure](../harness/OPERATING_MODEL.md#post-merge-cleanup). The local AH-012 branch was retained at the AH-015 baseline audit.
- [AH-013](https://github.com/nick-yermak/amber-hunter/pull/32) delivered Explore Map UI. [AH-014](https://github.com/nick-yermak/amber-hunter/issues/33) closed as Completed after [PR #34](https://github.com/nick-yermak/amber-hunter/pull/34) merged Beach Details. The final reviewed head was `c8a59eb85a4f4a41a38676df4008b43c59eb72aa`. The AH-014 branch remained locally and on GitHub at the baseline audit.
- GitHub automatic head branch deletion was enabled and verified before AH-015.
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

AH-020 weather and marine feasibility research is complete. The [feasibility assessment](../forecast/AH-020_FEASIBILITY_ASSESSMENT.md) records a Conditional GO for the Owner-approved [Forecast Data Foundation Epic](../forecast/FORECAST_DATA_FOUNDATION_EPIC.md). Source and runtime acceptance remain pending. See [Current Operational State](../harness/CURRENT_STATE.md) for the next task handoff.

## Documentation rules

Update this snapshot when verified project state changes. Repository implementation and approved ADRs govern technical decisions. Record architectural changes through the ADR process.
