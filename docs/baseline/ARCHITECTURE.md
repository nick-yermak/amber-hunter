# Amber Hunter — Technical Architecture Baseline

**Version:** 1.0  
**Status:** Approved high-level stack; implementation detail requires ADRs and verification.

## Architecture overview
Angular PWA communicates via typed HTTP contracts with Cloudflare Workers API. Workers ingest meteorological/marine inputs, run deterministic forecast logic, evaluate independent safety policies and persist necessary normalized forecasts/results in Cloudflare D1. Cloudflare Workers Static Assets serves frontend. MapLibre GL JS renders a geospatial coastline layer and forecast segments. GitHub Actions provides checks and deployments.

## Approved stack
- Angular + TypeScript (strict), standalone components, Signals, appropriate RxJS usage.
- Tailwind CSS, Angular CDK, Lucide, in-house small design-system primitives.
- MapLibre GL JS.
- pnpm workspaces monorepo; **exclude Nx**.
- Workers + D1 + Static Assets; PR previews; local development on macOS via Codex Desktop.
- GitHub Issues, Projects, milestones, Pull Requests, Actions.
- PWA first; Capacitor future.

## Proposed repo shape (not yet created)
```
apps/web                  Angular UI
apps/api                  Cloudflare Workers HTTP endpoints / orchestration
packages/forecast-engine  Pure deterministic scoring and replay
packages/shared           Domain models and typed transport contracts
docs/                     Product, architecture, ADR, design, forecast, harness
.agents/skills/           Custom skills
.github/                  Workflows, issue and PR templates
AGENTS.md                 Short invariant agent instructions
```
Avoid splitting packages until there is an actual reuse or dependency boundary.

## Forecast pipeline
1. Scheduled trigger checks for source updates approximately every 3h.
2. Open-Meteo ingestion for weather/marine variables; Copernicus Marine used initially for research and comparison.
3. Normalize units, direction conventions, timestamps, source issue time and missing values.
4. Map source grid cells to validated coastline segments (do not mistake segment length for source spatial resolution).
5. Compute explainable score from candidate factors and previous 72h conditions.
6. Calculate data-confidence category separately from score.
7. Apply safety policy independently and suppress unsafe visit recommendations.
8. Persist results and provenance, serve latest published forecast from the API.

### Forecast status
- Deterministic rule-based scoring is **experimental**.
- Candidate factors: storm history, wave direction relative to shore geometry, present wave state, wind history. Their numerical weights, scales and interactions are **not approved**.
- NE wind/post-storm effect at Sobieszewo/Mikoszewo is hypothesis H-NE-01.
- Version algorithm, factor configuration, source run, coastline geometry and safety rules.
- Preserve genuinely issued historical forecasts and replay fixtures; distinguish them from reconstructed past conditions.

## Conceptual data model
- `beaches`: public beach identity, region, geometry, status.
- `coastal_segments`: associated geometry, shore normal and version.
- `forecast_cells`: provider, grid location and resolution.
- `source_runs`: provider, model/run identifiers, issued/fetched timestamps.
- `marine_observations`: normalized source variables by cell and valid time.
- `model_versions`: scoring configuration and release metadata.
- `forecast_runs`: execution time, model and source provenance.
- `segment_forecasts`: time, score, confidence, explanation codes.
- `safety_restrictions`: sourced area, category, severity, validity and review metadata.

This is a domain inventory, **not a final SQL schema**. Review retention, D1 limits and geospatial indexing during implementation.

## Safety behavior
Independent safety states: AVAILABLE, CAUTION, UNSAFE, RESTRICTED, UNKNOWN (proposed naming). Official warnings, protected areas and known unsafe access must override favorable conditions. Missing safety information cannot be interpreted as positive proof of safety.

## Environments and data isolation
- Local: local frontend and API, mock/fixture data and local D1 as appropriate.
- PR Preview: isolated deployment and explicit non-production data bindings; use fixtures for UI PRs.
- Production: protected credentials and owner-controlled release path.
- Never bind preview to production D1 by accident; validate deployment configuration.

## AI engineering harness
- Main agent: plan/implement/test/create PR, maintain Issue status within approved scope.
- Independent reviewer: inspect diff, tests, architecture, accessibility/security; read-only on code.
- Human: approve epics, major architecture and sensitive changes, merge and production secrets.
- Planned MCP: Context7, Angular CLI, GitHub MCP or `gh`; confirm actual access before use.
- Planned external skills: Angular development, frontend design, web design review, Angular bootstrap; review provenance, versions and scripts first.
- Custom skills: `issue-to-pr`, `design-review`, `forecast-validation`.
- CI progressively: format/lint/typecheck/unit/build; then E2E, accessibility, screenshots, security and forecast replay.

## Engineering and operational standards
- Typed API contracts and clean domain boundaries.
- No heavy global state/store by default; use Signals and focused services.
- No unapproved architecture changes or hidden dependencies.
- Do not bypass tests for green CI.
- Monitoring goal: errors, uptime and API performance, using low-cost options.
- Review current limits, pricing, API licensing and versions before implementation.
- Source credits/attribution: Open-Meteo, Copernicus and OSM must be assessed and displayed appropriately.

## Decisions needing ADR or investigation
- Final provider-specific variable selection, scoring/normalization and confidence thresholds.
- Map tile provider/license and OSM coastline import validation.
- UI font licenses, design-token finalization and accessibility contrast.
- Project preview deployment method and exact DB binding strategy.
- Secret access and GitHub branch protection configuration for private repository.
