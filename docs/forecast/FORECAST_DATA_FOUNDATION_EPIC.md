# Epic — Forecast Data Foundation

The Owner approved the Epic and its delivery sequence on 2026-11-24. [Issue #47](https://github.com/nick-yermak/amber-hunter/issues/47) tracks the documentation closeout in [M3 — Forecast Data Foundation](https://github.com/nick-yermak/amber-hunter/milestone/3). FDF-1 through FDF-4 are provisional task identifiers.

## Objective

Provide reliable, typed, reproducible weather and marine source data for the three existing pilot beaches, using Open-Meteo Free API and Cloudflare Workers + D1, independently of the UI and future scoring engine.

## In scope

- AH-020 feasibility report adoption and reproducible evidence.
- Versioned source configuration, typed source-data contracts and validation fixtures.
- Minimal Workers and D1 local/isolated environment, JSON snapshot persistence and ingestion logs.
- Open-Meteo Weather Best Match / land and provisional Marine ECMWF WAM / sea adapters.
- Three-hour scheduled ingestion, explicit missingness, bounded failures, freshness and retention.
- Geographic source mapping review, repeated model update checks, runtime/cost/attribution acceptance.

## Out of scope

Amber Index calculation, numerical weights, calibrated confidence, new coastline segments, live frontend integration, regional scoring, production Copernicus integration or fallback, Python backend, authentication, paid services, extra Cloudflare products, independent safety source implementation, and Agent Evals implementation. Preserve safety constraints and do not surface live actionable forecasts before separate safety/forecast work.

## Approved delivery sequence

### AH-020 — Weather & Marine Data Feasibility (documentation closeout)

Area: Forecast; priority P0; Codex effort Low.

Objective: adopt the approved feasibility report, preserve the evidence, and record the approved decisions without code changes.

Acceptance criteria:
- Preserve and verify original evidence outside the repository; manifest, actual byte sizes, request/retrieval metadata and sensitivity/attribution review. If missing, record the gap and obtain Owner decision before reconstructing evidence; do not silently rerun the original experiment.
- Add the [feasibility assessment](AH-020_FEASIBILITY_ASSESSMENT.md), reviewed against actual evidence and official sources.
- Record D-01–D-11, S-01–S-10, deferred Copernicus candidates, limitations, and the Conditional GO conclusion.
- Update only directly affected project-state cross-references as explicitly approved; no ADR status changes, no application code or infrastructure changes.
- Verify Markdown, source links, scope, required CI and independent review.

### FDF-1 — Source Data Contracts & Validation Fixtures

Area: Forecast; priority P0; Codex effort Medium.

Depends on AH-020. Define minimal strict TypeScript contracts at the backend boundary, separate from frontend demo contracts. Use a small set of synthetic or attributed, reviewed experiment fixtures. Tests cover required/optional missing values, units, direction conventions, UTC ordering and DST presentation boundary, horizon, equal returned coordinates, provenance uncertainty and schema changes. No runtime network calls in routine CI. No speculative multi-provider framework or shared package unless real reuse justifies it.

### FDF-2 — Cloudflare Workers & D1 Foundation

Area: Infrastructure / Backend (select existing Project field); priority P0; Codex effort Medium.

Depends on FDF-1. Minimal Worker workspace and D1 migrations, local dev workflow, non-production bindings, typed snapshot persistence and indexed selection by source config/time. Verify immutable snapshots, independent source failures, bounded retention and database metrics with fixtures. CI builds/tests local foundation. No production secrets or deployment. Confirm wrangler version and dependency approval before installation.

### FDF-3 — Open-Meteo Source Ingestion & Scheduling

Area: Backend; priority P0; Codex effort Medium.

Depends on FDF-1/2. Implement only six required variables; versioned configuration; bounded timeouts/retries; explicit status for partial/unavailable data; idempotent scheduled ingestion every three hours; independent Weather/Marine snapshots; logs and retention. Unit and integration tests use fake provider responses (200+null, short coverage, 400/429/5xx, network error, malformed schema, coordinate changes, duplicated slot, interrupted run). Validate stale/expired behavior and ensure bad snapshots do not replace eligible data. No user-triggered provider fetch or scoring. Verify that retention cannot remove necessary replay evidence silently.

### FDF-4 — Pilot Source & Runtime Acceptance

Area: Forecast / Infrastructure (select existing field); priority P0; Codex effort High if complex troubleshooting is needed, otherwise Medium.

Depends on FDF-3. With Owner-authorized isolated deployment, collect results across multiple distinct observed model updates; verify the six required variables and target temporal coverage, returned-coordinate stability and marine mask suitability, attribution and public-use eligibility, real CPU and D1 quotas, payload sizes, error recovery, and 30-day storage projection. Proposed minimum is three verified distinct marine updates; repeated fetches alone do not satisfy this. Document unresolved physical accuracy separately. Benchmark three beaches; ten-beach growth is a capacity estimate until tested. Record measured limits, exact config and reproducible evidence. If primary model or free-tier constraints fail, stop and request scoped architecture decision. No production release or auto-switching models.

## Epic acceptance criteria

- Three pilot beaches have an eligible Weather and Marine source-data path, with 72 h history and 168 h forecast target and documented handling of missing periods.
- Provenance, source mapping, retrieval freshness, model uncertainty, coverage and validation outcome remain distinct; shared marine series are supported without invented differentiation.
- Snapshots are immutable, versioned, replayable and retained under the approved operational policy.
- Scheduled and failure paths are deterministic in tests; previous eligible data is not silently overwritten by failed fetches.
- Isolated deployed runtime measurements and observed model updates support the approved free-tier target; any unresolved blockers are recorded, not waived.
- Attribution and usage terms are checked before release. No scientifically validated score or safe-access claims.
- All PRs follow Controlled Autonomy v1.1, with current CI, independent exact-diff review and Owner-only merge.

## Dependencies and next tracks

AH-020 → FDF-1 → FDF-2 → FDF-3 → FDF-4 → separate Forecast Engine design and implementation → separate live frontend integration and release safety gates.

Agent Evals remains an independent Harness Quality & Agent Evaluation track. Recommend a small first baseline before complex backend work if it can be achieved without blocking straightforward data foundation tasks. Use a separate task-focused conversation, explicit scope and controlled permissions. Agent Evals cannot substitute for software tests or forecast validation.

## Owner approval boundary

Scope subsequent implementation Issues individually with exact acceptance criteria and verify the current baseline and all required Project metadata before implementation. The Human Owner retains exclusive merge authority under [Controlled Autonomy v1.1](../harness/OPERATING_MODEL.md#issue-workflow).
