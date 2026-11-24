# Amber Hunter — Current Operational State

## Baseline through AH-019

At the start of [Issue #45](https://github.com/nick-yermak/amber-hunter/issues/45) on 2026-11-24, GitHub reported remote `main` at `8cfa7ebad92b3023c341e3c3748a3b788c701040`. See [Project State](../baseline/PROJECT_STATE.md#verified-remote-baseline) for closed Issues, merged PRs, and the separately observed local checkout. Treat owner-reported local state as handoff context and verify the target checkout before synchronization or cleanup.

## Controlled Autonomy v1.1

Apply the [Issue workflow](OPERATING_MODEL.md#issue-workflow) and [Permission Matrix](PERMISSIONS.md). Owner scope approval and verified Project membership, `Ready` status, Priority, Area, and milestone precede implementation. Main runs the required checks and prepares a linked PR. The Human Owner launches the separate read-only Reviewer and returns the verdict for the exact PR base and head. Main may address in-scope findings within the two fix-and-review cycles. Further review cycles require the [Owner Exception Protocol](OPERATING_MODEL.md#owner-exception-protocol).

Only the Human Owner merges. Record post-merge [synchronization](OPERATING_MODEL.md#post-merge-synchronization) and remote head verification separately. Optional [housekeeping](OPERATING_MODEL.md#post-merge-cleanup) can be deferred. Reviewer remote-write isolation and Codex Desktop activation of Angular CLI MCP remain unverified.

## Next work

- **Product:** [Issue #47](https://github.com/nick-yermak/amber-hunter/issues/47) tracks the AH-020 documentation closeout. The [feasibility assessment](../forecast/AH-020_FEASIBILITY_ASSESSMENT.md) records a Conditional GO for the approved [Forecast Data Foundation Epic](../forecast/FORECAST_DATA_FOUNDATION_EPIC.md). Source Data Contracts & Validation Fixtures is the next product task after closeout, subject to separate Issue approval and verified Ready status.
- **Harness:** Agent Evals is planned as a separate improvement. Design and implementation require separately scoped Owner approval.

Start the next task in a fresh, focused conversation with the verified remote `main` SHA, relevant approved decisions, remaining risks, and the next objective.
