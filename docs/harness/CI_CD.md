# CI/CD and Cloudflare Preview Plan

## Workspace bootstrap

Use Node.js 24.22.3 from `.nvmrc` and pnpm 10.34.9 from `package.json`. From the repository root, verify the toolchain and install:

```sh
node --version
corepack --version
corepack pnpm --version
corepack pnpm install --frozen-lockfile
git diff --exit-code -- pnpm-lock.yaml
```

Corepack reads the pnpm pin directly from `package.json`. If the Node.js distribution omits Corepack, install Corepack 0.36.0 with npm. This version supports Node.js 24.22.3. CI checks for Corepack and installs the same fallback into the runner's temporary directory only when needed.

The **Workspace install** job runs on pull requests targeting `main` with read-only repository contents access. It requires a lockfile, fails on frozen installation errors, and checks that installation leaves the lockfile unchanged. The explicit presence check is needed because pnpm can accept a missing lockfile in a workspace without dependencies. The empty workspace uses no dependency cache. Validate the job on a pull request before configuring any required status check.

## Future PR checks

Add formatting, lint, strict TypeScript typecheck, unit tests and production builds when application code and its tooling exist. Fail closed. Scope jobs using changed paths only after verification, so critical modules are not skipped.

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
