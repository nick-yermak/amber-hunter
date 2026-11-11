# CI/CD and Cloudflare Preview Plan — No Executable Workflows Yet

## Foundations: PR checks
Formatting, lint, strict TypeScript typecheck, unit tests and production builds on every relevant PR. Fail closed, no skipping failures. Scope jobs using changed paths only after verification, so critical modules are not skipped.

## Before public MVP
Playwright smoke tests for core paths; axe accessibility checks; responsive screenshots at 375/768/1440; i18n smoke PL/EN/RU; forecast replay; dependency audit; D1 migration tests; safety-state tests.

## Environments
- Local: fixture API, local D1 (when needed), synthetic scores labeled clearly.
- Preview per PR: unique URL, fixed mock/fixture data for UI PRs; isolated nonproduction D1 for integration deployments. Confirm actual Cloudflare preview mechanism & limitations before CI implementation.
- Production: owner-controlled merge; Actions release using restricted credentials and protected environments where available.

Never allow PR workflows to access production D1, secrets or write-enabled deploy credentials. Wrangler deploy can publish live code: use safe validation/dry-run processes until a release path has been explicitly approved.

## Operational checks
Errors and uptime (low-cost service chosen later), minimal API latency / failure-rate monitoring, quota alerts, source freshness. Verify Cloudflare Workers Free and D1 limits at bootstrap. GitHub private repository Actions minutes vary with plan: check usage and billing before adding expensive browser matrix.

## Required deployment tests
Check preview binding IDs are non-production; migration target; environment variables; source data attribution; rollback procedure; access restrictions.

Docs: https://developers.cloudflare.com/workers/static-assets/ and https://developers.cloudflare.com/workers/versions-and-deployments/
