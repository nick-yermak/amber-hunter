# Amber Hunter — Project State

**Version:** 1.0  
**Updated:** 2026-11-11  
**Status:** Discovery baseline approved; preparing Codex handoff. No application implementation has started.

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
| Design | Baltic Explorer; approved reference images in `design/references/` |
| Authentication | Anonymous MVP; authentication/community later |
| Language | PL / EN / RU, browser detection and manual switching |
| Forecast | Experimental Amber Index 0–100; Open-Meteo primary, Copernicus research; 72h conditions; three-hour refresh checks; independent safety checks |
| Content | Amber Academy static articles for MVP; CMS later |

## Current stage
- Product discovery: complete enough for MVP planning.
- Forecast engine: research/specification v0.1, **not scientifically validated**.
- Visual direction: approved; generated images are references, not pixel-perfect specifications.
- Harness: architecture proposed and largely agreed; tooling/installations and permissions **not verified**.
- Repository: not known to be created; do not assume GitHub, MCP, or deployments are connected.
- No application code has been requested or written in this phase.

## Important constraints
- A high Amber Index is **not** a probability of finding amber.
- Display data confidence separately from the index.
- Safety restrictions and hazardous weather override positive calls to action.
- The observation that NE winds and post-storm periods favor Sobieszewo/Mikoszewo is an **unvalidated hypothesis**, not an algorithmic fact.
- Do not mix historical forecasts with hindsight-derived historical weather.
- Do not write implementation code until explicitly requested.

## Outstanding decisions and research
1. Confirm actual tool versions/availability on owner's Mac and repo permissions.
2. Verify licensing, API limits, map tile terms, attribution and current pricing.
3. Approve exact UI tokens after implementation contrast/accessibility review.
4. Validate coastline geometries and segment length (250–500 m is a proposed starting range, not an approved scientific resolution).
5. Research scoring functions, factor weights and thresholds; avoid treating example weights as approved.
6. Design safety source freshness/failure behavior and protected area coverage.
7. Decide hosting details for per-PR preview and test data bindings.
8. Amber Quest remains a future separate discovery track, non-blocking for MVP.

## Next actions
1. Place this package and three image references in ChatGPT Project Files and later the GitHub repo.
2. Prepare Codex handoff: AGENTS.md, ADRs, skills/MCP registry, risk policy, CI definitions, issue/PR templates and first backlog.
3. Validate the harness on a small Issue-to-PR task before implementing features.
4. Start foundation, app shell, map and weather data research in prioritized epics.

## Documentation rules
These documents reflect decisions through 2026-11-11. If new approved decisions differ, update these files and record an ADR when architectural. Code and approved ADRs in GitHub become the authoritative implementation state once the repository exists.
