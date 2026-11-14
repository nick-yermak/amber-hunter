# Proposed GitHub Epics / Milestones — Not Created

## M0 — Harness Ready
EPIC AH-E01 Foundation & Harness
- AH-001 Documentation-only harness dry run (see FIRST_TASK.md) — FIRST.
- [AH-002 Verify Independent Reviewer Isolation](https://github.com/nick-yermak/amber-hunter/issues/3).
- Verify local macOS toolchain and record versions/licenses (unassigned planning item).
- [AH-003 Bootstrap pnpm workspace and minimal GitHub Actions CI](https://github.com/nick-yermak/amber-hunter/issues/6).
- [AH-004 Document MCP Integration and Post-Merge Cleanup](https://github.com/nick-yermak/amber-hunter/issues/9).
- AH-005 Add application quality checks once application code exists.
- AH-006 Demonstrate independent reviewer and PR handoff without automatic merge.
- [AH-009 — Harness Autonomy v1](https://github.com/nick-yermak/amber-hunter/issues/21).
Acceptance: a real documentation-only Issue passes the Issue-to-PR loop; actions outside the approved scope require explicit owner approval. If the sandbox or platform blocks an operation, stop and report the evidence. Owner approval alone does not remove a technical restriction.

## M1 — App Shell
EPIC AH-E02 Angular PWA & Baltic Explorer UI
- AH-101 Bootstrap pnpm workspaces + Angular + Worker *after owner approval*.
- AH-102 Define accessible semantic design tokens / font fallback.
- AH-010 — Responsive App Shell & Navigation, the first [Controlled Autonomy pilot](OPERATING_MODEL.md#ah-010-pilot). Preserve the planned PL/EN/RU localization work.
- AH-104 Hero/Home UI with synthetic demo data visibly marked.

## M2 — Data & Map
EPIC AH-E03 Coastal Data
- AH-201 OSM coastline provenance/license and extraction research.
- AH-202 Validate 5–10 pilot sites and access restrictions.
- AH-203 Research MapLibre tile provider, attribution, free-tier limits.
EPIC AH-E04 Forecast & Experience
- AH-301 Open-Meteo variables, terms, availability and normalization spike.
- AH-302 Cloudflare D1/API baseline, explicit source provenance.
- AH-303 Versioned pure forecast scoring / confidence / replay tests.
- AH-304 MapLibre colored segments, selection, detail panel.
- AH-305 Independent safety policy including restricted/unsafe/unknown.

## M3 — Public MVP
EPIC AH-E05 Academy, QA & Release
- AH-401 Static Amber Academy and Article Reader.
- AH-402 Seven-day/hourly forecasts, explainability, freshness.
- AH-403 End-to-end checks, accessibility and performance review.
- AH-404 Production readiness, legal attributions, docs, manual release approval.

Every issue needs objective, context links, scope, AC, risks, checks, expected deliverables. IDs above are *planning labels*, not live GitHub issue numbers.
