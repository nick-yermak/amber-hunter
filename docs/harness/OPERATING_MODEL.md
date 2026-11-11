# Balanced Harness Operating Model

## Roles
- **Owner:** approves epics, architectural shifts, production credentials, protected settings and merge. Controls publication.
- **Main agent:** prepares Issues from approved epics; works on Ready Issue only; plans, implements, tests, proposes PR; can update allowed statuses after permissions verified.
- **Independent reviewer:** separate context, reads actual diff + relevant requirements and test evidence; read-only code and credentials; produces findings by severity; does not self-merge.

## Issue workflow
Backlog -> Ready (owner-approved scope) -> In Progress -> In Review -> Done (after human merge / Issue closure). Blocked is a label. Main agent does not approve its own architecture changes. Limit automated fix/review loops to two; then escalate.

## Required PR fields
Linked Issue; scope summary; Acceptance Criteria checklist; actual test commands and pass/fail; screenshots for UI; design/safety/data risks; architecture/ADR impact; independent review findings; limitations.

## Reviewer rubric
1. Scope and requirements fidelity.
2. Security, secrets, access and validation.
3. TypeScript, module boundaries, API contracts, state correctness.
4. Forecast determinism, provenance, replay and safety invariants where relevant.
5. Tests, accessibility, responsive PL/EN/RU UI.
6. Dependency/pricing/licensing impacts.
Severity: Blocker, Major, Minor, Suggestion. Cite file/line when possible. If not tested, mark unverified.

## Context policy
L0 AGENTS.md; L1 current docs/accepted ADRs; L2 one scoped Issue, diff and relevant code; L3 skills and versioned documentation on demand. Never ingest full chat history or bulk skills into every task. Summarize each task as: files, decisions, tests, open risks, next action.

## MVP safety invariant
Known unsafe/restricted areas and official hazard warnings cannot receive 'go now' CTA regardless of index. Missing safety data != safe.
