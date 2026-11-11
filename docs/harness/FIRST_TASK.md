# FIRST TASK — Documentation-only Harness Smoke Test

**Title:** `AH-001: Verify Codex harness on a documentation-only Issue`
**Status:** Draft / not created in GitHub

## Objective
Validate on the owner's Mac that Codex can read scoped project context, plan a small safe documentation change, execute verification, produce independent review, and open a PR on GitHub after owner approval. No application source code, package installs, deployments, secrets or production DB operations.

## Context
Read `AGENTS.md`, `docs/baseline/PROJECT_STATE.md`, `docs/harness/OPERATING_MODEL.md`, `docs/harness/PERMISSIONS.md`, `docs/harness/MCP_REGISTRY.md`.

## Scope
1. Inspect whether an actual Git repository / origin / GitHub Project exists; do not assume.
2. Inventory Codex Desktop, installed tools, git, gh, Node and pnpm *without installing or changing them*.
3. Check for configured MCP servers and GitHub auth, recording pass/fail/unknown, without printing secrets.
4. Create or update only `docs/harness/BOOTSTRAP_AUDIT.md` after working branch is approved; document observed states and gaps.
5. Run suitable non-applicable-independent doc checks (file existence, relative link checks, image asset presence); state what could not be run.
6. Have the reviewer inspect only the proposed document diff and evidence.
7. With repository + credentials + owner permission, open a linked PR; otherwise produce exact blockers and next safe commands for user to perform.

## Acceptance Criteria
- No invented tool installations, test results, connections or GitHub references.
- Audit records observed tool versions, access boundaries, Git status and pending decisions.
- No application code or unnecessary dependencies added.
- Reviewer reports concrete findings without writing to repo.
- PR created if authorized and possible; otherwise blockers documented with no false success.
- `main`, secrets, production and remote database left untouched.

## Constraints
No `npm install`, `pnpm install`, global installs, `git push`, repository creation, tool connections, or any network writes unless the owner explicitly approves in the active Codex session. Do not create GitHub issue automatically without owner's authorization. No auto-merge.

## Expected deliverables
`BOOTSTRAP_AUDIT.md`, verification report, reviewer findings, optional PR link after approval, specific next actions.

## First Codex prompt
"You are the Amber Hunter Main Agent. Read AGENTS.md and docs/harness/FIRST_TASK.md, then assess readiness without changing application code or installing anything. Inventory what is truly accessible and produce a short plan and a list of actions that need my approval. Do not create external resources or push code yet."
