# Amber Hunter — Codex Instructions

## Communication & Language Policy
All agents must communicate with the owner in Russian, including plans, questions, progress updates, review feedback, and final summaries.
Keep code, commit messages, GitHub Issues, pull requests, and technical documentation in English.

## Model & Reasoning Effort Policy
Recommend the lowest sufficient reasoning effort for each task.

- **Low** for routine changes, Git operations, documentation, and simple UI fixes.
- **Medium** for standard implementation, Angular components, tests, and refactoring.
- **High** for complex architecture, Forecast Engine work, security, difficult debugging, and critical reviews.

Recommend effort independently for Codex and ChatGPT when relevant. Proactively suggest raising or lowering effort as task complexity changes. Never recommend higher effort solely because a task is long. Minimize unnecessary tool calls, repeated research, and context consumption. Recommendations are advisory. Never claim to change model settings automatically.

## Mission
Build a polished public Angular/Cloudflare portfolio and learning app for Baltic amber hunting. Optimize for a fast, secure, low-cost MVP with high engineering quality, not commercial growth or complicated orchestration.

## Mandatory context
Read `docs/baseline/PROJECT_STATE.md` before starting a new issue. Open only task-relevant sections of `docs/baseline/PRD.md`, `ARCHITECTURE.md`, `DESIGN_SYSTEM.md` and accepted ADRs. Read the related GitHub Issue and its Acceptance Criteria. Source-of-truth hierarchy: approved ADRs + current repository implementation, then approved baseline docs, then Issue scope, then agent proposals; stop if these materially conflict.

For Angular work, follow the [Frontend Conventions](docs/engineering/FRONTEND_CONVENTIONS.md).

## Stack constraints
Angular, TypeScript strict, standalone components, Signals; Tailwind, Angular CDK, Lucide, MapLibre; Cloudflare Workers + D1 + Static Assets; pnpm workspaces without Nx; responsive PWA first, Capacitor later. No heavyweight state layer or dependency without issue justification.

## Product and data invariants
Amber Index 0–100 is experimental **not the probability of finding amber**. Keep data confidence separate from score. Independent safety restrictions override actionable beach recommendations. Never treat mock or AI-generated forecast/geography as real information. Prior 72 hours and 3-hour checks are requirements; factor weights, segment widths and thresholds remain open to research and validation. Preserve original source provenance and versioned forecasts.

## Agent workflow
Follow the [Operating Model](docs/harness/OPERATING_MODEL.md#issue-workflow) and [Permission Matrix](docs/harness/PERMISSIONS.md). Verify owner-approved scope and Project status `Ready` before implementation. Run required checks, record observed outcomes, and arrange separate read-only review of the exact PR diff using the [Reviewer runbook](docs/harness/REVIEWER.md#review-handoff).

Only the Human Owner performs the final PR merge. Main must never merge or enable auto-merge. Preserve protected settings, production secrets and data, and effective sandbox and approval controls.

## Visual standards
Use `docs/baseline/DESIGN_SYSTEM.md` and `docs/design/references/` as references. Maintain calm Baltic Explorer hierarchy. AI images are conceptual, not pixel-accurate or data-grounded. Validate accessibility, content states, responsiveness, i18n PL/EN/RU.

## Permissions
Local file changes only within approved issue scope and allowed workspace. Ask approval for installations, privileged network actions, GitHub writes outside intended Issue/PR, architectural changes, migrations of remote databases, secret changes, public repository settings, production deployment and merge. No blanket bypass of sandbox approvals.

## Documentation
Keep docs concise and link to detailed context. For architecture changes propose ADR; owner accepts. Final answer / PR: summary, files, checks, risks, open questions and next steps. Don't claim tools are installed until tested.
