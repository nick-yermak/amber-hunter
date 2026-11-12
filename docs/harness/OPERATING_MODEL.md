# Balanced Harness Operating Model

## Roles
- **Owner:** approves epics, architectural shifts, production credentials, protected settings and merge. Controls publication.
- **Main agent:** prepares Issues from approved epics; works on Ready Issue only; plans, implements, tests, proposes PR; can update allowed statuses after permissions verified.
- **Restricted Local Reviewer (MVP)** uses a separate CLI session with an effective `read-only` sandbox and `never` approval policy. Reviews local diffs, supplied requirements, and test evidence, then returns findings by severity in the session. Authenticated GitHub access is outside this workflow. See the [Reviewer runbook](REVIEWER.md).
- **Human review** is required before merging security-sensitive changes. The local Reviewer can supply findings. The owner retains merge authority.

## Issue workflow
Backlog -> Ready (owner-approved scope) -> In Progress -> In Review -> Done (after human merge / Issue closure). Blocked is a label. Main agent does not approve its own architecture changes. Limit automated fix/review loops to two; then escalate.

## Post-Merge Cleanup

1. Confirm the PR is merged into `main` with `gh pr view <pr> --json state,baseRefName,headRefName,headRefOid,mergeCommit`. Run `git fetch origin` and verify the recorded merge commit with `git merge-base --is-ancestor <merge-commit> origin/main`. For squash merges, the original feature commits can be absent from the history of `main`.
2. Use `git worktree list --porcelain` to identify the feature branch checkout and any associated temporary or detached worktrees. Check each checkout with `git -C <path> status --short --untracked-files=all`. Verify local and remote branch tips against the merged PR head and investigate any differences. Confirm the worktrees contain no unfinished tasks or files that need preservation.
3. Confirm with the owner that no active Codex session or other process uses the worktrees. Show the exact paths and refs and get human confirmation before removal or deletion. Leave active, dirty, locked, or uncertain worktrees in place.
4. From another checkout, remove each confirmed obsolete temporary worktree with `git worktree remove <path>` without force. If Git refuses, report the reason and leave the worktree in place.
5. Delete only the confirmed merged feature branch. Use `git branch -d <branch>` locally and, if the remote branch still exists, delete it only if the server still has the verified PR head SHA. Run `git push --force-with-lease=refs/heads/<branch>:<verified-head-oid> origin :refs/heads/<branch>`. Stop if the lease fails. Recheck the exact local branch tip immediately before local deletion. A local safe delete can refuse after a squash merge. Leave the branch for an explicit owner decision after verifying the exact tip and merged PR evidence. Preserve protected branches and any unmerged work.
6. Run `git fetch --prune origin`. From the clean primary checkout, switch to `main` and run `git pull --ff-only`. Verify an empty `git status --porcelain`, matching `git rev-parse HEAD origin/main` hashes, and the expected worktree and branch lists. Report the verified merge commit, removed worktrees and refs, anything retained, and the final `main` status.

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
