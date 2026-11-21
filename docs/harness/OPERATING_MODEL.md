# Balanced Harness Operating Model

Controlled Autonomy v1 applies to owner-approved, verified Ready Issues within the [permission matrix](PERMISSIONS.md).

## Roles
- **Owner:** approves epics, architectural shifts, production credentials, protected settings and merge. Controls publication.
- **Main agent:** prepares Issues from approved epics; works on Ready Issue only; plans, implements, tests, proposes PR; can update allowed statuses after permissions verified.
- **Restricted Local Reviewer (MVP)** uses a separate CLI session with an effective `read-only` sandbox and `never` approval policy. Reviews local diffs, supplied requirements, and test evidence, then returns findings by severity in the session. Authenticated GitHub access is outside this workflow. See the [Reviewer runbook](REVIEWER.md).
- **Human review** is required before merging security-sensitive changes. The local Reviewer can supply findings. The owner retains merge authority.

## Issue workflow
1. Read the Issue and relevant baseline. Verify owner-approved scope, Project membership and Ready status, Priority, Area and milestone using the [Issue Fields runbook](GITHUB_ISSUE_FIELDS.md). Ready and scope approval authorize routine scoped work.
2. Record a scoped plan, risks and checks. Implement on an issue-specific branch or worktree. Run the existing checks and record actual outcomes.
3. Open a linked PR when GitHub access is verified. Keep it draft while required evidence is pending. Move the Issue through In Progress and In Review where authorized and verify Project writes with separate reads.
4. Hand off the exact PR diff via the [Reviewer protocol](REVIEWER.md#review-handoff). The owner launches the separate Reviewer from Terminal and returns its result.
5. Main may address in-scope findings without a new owner decision. After each fix, rerun relevant checks and request review of the updated base/head pair. Allow at most two fix-and-review cycles after the initial review.
6. Stop and escalate on unresolved Blocker/Major findings after the permitted cycles, out-of-scope work, uncertain credentials or required permission escalation. If a check or review fails or times out, retain its evidence and report the blockage. Retry only a recoverable failure within the same scope, after verifying the current state and avoiding duplicate writes. A timeout or stale review leaves the review pending.
7. Hand off the evidence and PR to the owner for merge after required checks and current independent review pass. Mark Done only after human merge and Issue closure. Use the Blocked label for unresolved blockers where authorized.

## AH-010 pilot

Run Responsive App Shell & Navigation as the first Controlled Autonomy pilot once the owner approves its scope and Project status is Ready. Record each result as pass, fail or blocked with evidence.

1. Verify Issue scope, Ready status and metadata with separate reads after any writes.
2. Record the scoped plan and branch/base SHA. Count routine owner approvals during scoped implementation. The target is zero when platform permissions allow. Record the manual Reviewer launch separately.
3. Verify the diff against the Issue criteria and scope. Record any scope or permission decision that required escalation.
4. Record local build and unit test results, required CI status, and applicable UI screenshots, responsive behavior and accessibility checks.
5. Record independent review of the exact PR base/head and the Reviewer verdict, findings and evidence.
6. Record each fix, rerun and latest-diff review, with at most two cycles and any remaining blockers.
7. Deliver a linked, evidence-backed PR to the owner and record the human merge decision.

## Post-Merge Cleanup

One verified cleanup plan, one explicit owner approval, autonomous execution, and final verification. Main prepares, executes, and reports the cleanup within the [permission matrix](PERMISSIONS.md).

1. Confirm the Human Owner merged the PR into `main` with `gh pr view <pr> --json state,baseRefName,headRefName,headRefOid,mergeCommit,mergedBy`. Verify the PR is `MERGED`, the base is `main`, and `mergedBy.login` identifies the Human Owner and `mergedBy.is_bot` is false. Stop if the actor is missing or uncertain. Run `git fetch origin` and verify the recorded merge commit with `git merge-base --is-ancestor <merge-commit> origin/main`. Check the local and remote feature branch tips against the merged PR head and verify whether the clean primary checkout can safely fast-forward to `origin/main`. For squash merges, verify the recorded merge commit because the original feature commits may be absent from `main`.
2. Inventory checkouts with `git worktree list --porcelain`, including associated temporary and detached worktrees. Check each candidate with `git -C <path> status --short --untracked-files=all`. Check lock status and whether an active Codex session or another process uses the checkout. Preserve dirty, active, locked, uncertain, unverified, and protected resources, including any checkout with unfinished work.
3. Present one exact plan before any removal or deletion. List worktree paths and HEAD SHAs, branch refs and their local and remote tips or verified absence, the PR head and merge commit, the commands and safeguards, and retained resources and blockers. Ask the owner for one explicit approval of those targets and confirmation that the candidate worktrees are inactive.
4. After approval, execute the plan without routine per-command reapproval. Recheck each target and relevant preconditions immediately before acting. Remove only approved, clean, inactive, unlocked, verified worktrees from another checkout using `git worktree remove <path>` without force. If Git refuses or state, SHAs, permissions, or risks change, stop and escalate. A changed plan requires explicit owner approval. Effective sandbox and tool approval gates still apply.
5. Immediately before local deletion, reverify the merged PR and recorded merge commit, its ancestry in `origin/main`, and the exact approved branch ref and tip SHA matching the merged PR head. Verify the ref is direct and stop if it is symbolic or its type is uncertain. Recheck every relevant worktree and checkout. Confirm the branch is unused and there are no active or uncertain sessions, locks, dirty files, unfinished work, or concurrent checkout activity affecting it. Confirm effective permissions and that approval conditions still hold. Run `git update-ref --no-deref -d refs/heads/<branch> <approved-sha>` directly. Git checks the expected SHA under the ref lock. `--no-deref` protects the referent, but can remove the symbolic ref itself. The direct-ref check is still required. Stop and escalate on any mismatch, command failure, or uncertainty.
   - Low-level ref deletion bypasses porcelain branch and worktree safeguards. Verify worktree safety separately. Preserve and report any retained branch configuration.
   - For an approved remote deletion, use `git push --force-with-lease=refs/heads/<branch>:<verified-head-oid> origin :refs/heads/<branch>`. Stop if the lease fails. Blanket force operations and remote history rewriting remain prohibited.
6. Run `git fetch --prune origin`. From the primary checkout, switch to local `main` when safe and verify it is clean. Verify `origin/main` points to the fetched `refs/heads/main` from the intended remote and local `main` can fast-forward to it. Run `git merge --ff-only origin/main`. Verify an empty `git status --porcelain` and compare the final local `main` and `origin/main` SHAs with the live remote `refs/heads/main`. Stop and escalate any unexpected state or failure. Verify the final local and remote feature refs and worktree inventory. Report the merge commit, final `main` state, deletion outcomes, retained resources, and any blockers.

## GitHub protection and CI baseline

An external audit on 2026-11-14 observed [Protect main](https://github.com/nick-yermak/amber-hunter/rules/27092966) (ruleset #27092966) as active. It requires a pull request, squash merge, resolution of review threads, and the `Workspace install` check. It has no bypass actors and requires zero approving reviews. These observations describe the configuration on the audit date. The link shows the live ruleset, which can change.

The [CI workflow](../../.github/workflows/ci.yml) installs dependencies with a frozen lockfile, builds the frontend for production, and runs unit tests. AH-009 PR CI execution is pending. Only the Human Owner performs the final merge. This is an operational requirement, independent of the ruleset's approving review count.

## Required PR fields
Include the linked Issue, scope and acceptance criteria, full diff base/head SHAs, local check commands and observed results, required CI status and links, and screenshots and accessibility evidence for applicable UI work. Include the independent Reviewer result and reviewed SHAs, fix cycles, risks, architecture impact, unresolved blockers and owner handoff.

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
