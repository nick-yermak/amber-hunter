# Balanced Harness Operating Model

Controlled Autonomy v1.1 applies to owner-approved, verified Ready Issues within the [permission matrix](PERMISSIONS.md).

## Roles
- **Owner:** approves epics, architectural shifts, production credentials, protected settings and merge. Controls publication.
- **Main agent:** prepares Issues from approved epics; works on Ready Issue only; plans, implements, tests, proposes PR; can update allowed statuses after permissions verified.
- **Restricted Local Reviewer (MVP)** uses a separate CLI session with an effective `read-only` sandbox and `never` approval policy. Reviews local diffs, supplied requirements, and test evidence, then returns findings by severity in the session. Authenticated GitHub access is outside this workflow. See the [Reviewer runbook](REVIEWER.md).
- **Human review** is required before merging security-sensitive changes. The local Reviewer can supply findings. The owner retains merge authority.

## Issue workflow
1. Read the Issue and relevant baseline. Verify owner-approved scope, Project membership and Ready status, Priority, Area and milestone using the [Issue Fields runbook](GITHUB_ISSUE_FIELDS.md). Ready and scope approval authorize routine scoped work within effective permissions. Reuse existing approvals while scope, relevant baseline, permissions, prerequisites, and risks still match. A material change requires a new decision before affected work resumes.
2. Record a scoped plan, risks and checks. Implement on an issue-specific branch or worktree. Run the existing checks and record actual outcomes.
3. Open a linked PR when GitHub access is verified. Keep it draft while required evidence is pending. Move the Issue through In Progress and In Review where authorized and verify Project writes with separate reads.
4. Hand off the exact PR diff via the [Reviewer protocol](REVIEWER.md#review-handoff). The owner launches the separate Reviewer from Terminal and returns its result.
5. Main may address in-scope findings without a new owner decision. After each fix, rerun relevant checks and request review of the updated base/head pair. Allow at most two fix-and-review cycles after the initial review. Then follow the [Owner Exception Protocol](#owner-exception-protocol) if blocking findings remain.
6. Stop and escalate on unresolved Blocker/Major findings after the permitted cycles, out-of-scope work, uncertain credentials or required permission escalation. If a check or review fails or times out, retain its evidence and report the blockage. Retry only a recoverable failure within the same scope, after verifying the current state and avoiding duplicate writes. A timeout or stale review leaves the review pending.
7. Hand off the evidence and PR to the owner for merge after required checks and current independent review pass. Mark Done only after human merge and Issue closure. Use the Blocked label for unresolved blockers where authorized.

## Owner Exception Protocol

After two autonomous fix-and-review cycles, stop if Blocker or Major findings remain. Obtain a direct, explicit Owner decision naming the Issue and PR, current full base/head SHAs, outstanding findings, exact authorized fix scope, and one additional fix-and-review cycle. Record the decision in the PR before resuming. Apply only the authorized fixes, rerun required checks, and obtain independent review of the resulting exact diff. Stop and escalate if that cycle fails, evidence is missing, or the authorized scope or baseline changes unexpectedly. The exception grants no further cycles or waiver of safeguards.

## Post-merge synchronization

Main may synchronize local `main` without separate procedural approval once these checks pass and effective permissions allow the Git operations. Optional housekeeping may be deferred.

1. Verify the intended repository and `origin` URL. Read the PR state, base, merge commit and merge actor with `gh pr view <pr> --json state,baseRefName,headRefName,headRefOid,mergeCommit,mergedBy`. Require `MERGED` into `main` by the Human Owner, with a verified non-bot identity. Stop if any of these facts is uncertain.
2. Inspect the target checkout with `git worktree list --porcelain` and `git --no-optional-locks status --porcelain=v1 --untracked-files=all`. Require a clean, unlocked checkout with no in-progress Git operation, relevant Git lock, or conflicting work. An idle IDE, background process, or the current authorized agent alone is insufficient evidence of a conflict. Look for actual edits, ref or index writes, concurrent checkout operations, or other activity affecting the target. Record the limits of inspection and stop if material uncertainty remains.
3. Before fetching, require `refs/remotes/origin/main` to be a direct commit ref or confirmed absent. Run `git symbolic-ref -q --no-recurse refs/remotes/origin/main`. Exit 0 means symbolic, exit 1 means non-symbolic or absent, and any other status is an error. Continue only on exit 1 without diagnostics. Then run `git show-ref --exists refs/remotes/origin/main`. Exit 2 confirms absence. On exit 0 require `git rev-parse --verify 'refs/remotes/origin/main^{commit}'` to succeed. Stop before fetch on a symbolic ref, unexpected status, or lookup error. Also require `refs/heads/main` to be a direct, existing commit ref using the same checks.
4. Fetch with `git fetch --no-prune --no-prune-tags --no-tags --refmap= origin refs/heads/main:refs/remotes/origin/main`. The explicit refspec and empty refmap constrain the update to the verified destination. Resolve the full `refs/remotes/origin/main` to a commit SHA and compare it to the live `refs/heads/main` from the intended remote. Check ancestry with `git merge-base --is-ancestor <merge-commit-sha> refs/remotes/origin/main` and `git merge-base --is-ancestor refs/heads/main refs/remotes/origin/main`. For squash merges use the merge commit. Stop if a check fails or the tips change.
5. Immediately before mutation, recheck the checkout, direct ref types and exact tips, including the live remote tip. Use `git switch --no-overwrite-ignore main` only if the checkout remains clean and the branch is available there. Verify that `HEAD` points directly to `refs/heads/main` and that the checked tips and preconditions still hold. If the local and verified remote tips differ, use `git merge --ff-only --no-overwrite-ignore <verified-remote-main-sha>` with the full SHA just verified against the live remote. Stop on an ignored-file collision. Preserve user changes. Do not reset, force checkout, stash, or delete anything as part of synchronization.
6. Verify clean status. Compare the full local refs `refs/heads/main` and `refs/remotes/origin/main` and the live remote `refs/heads/main` with the verified SHA. Report the recorded merge commit and all three tips. Stop on unexpected changes, failures, or effective permission denial.

## Post-merge cleanup

Housekeeping is optional and may remain pending while subsequent work proceeds from a verified clean checkout. Verify automatic remote head deletion separately after the human merge. Query the exact live branch ref on the intended remote. Confirmed absence completes the remote check. Failed queries leave absence unverified. A retained ref may be left in place or considered for the approved fallback below.

1. Verify the human merge and merge commit ancestry as in [synchronization](#post-merge-synchronization). Inventory all relevant worktrees, including detached and temporary checkouts. Check each candidate for its HEAD, cleanliness including untracked files, lock status, unfinished work and concurrent use. Compare feature branch tips with the verified merged PR head. Preserve dirty, active, locked, uncertain, unverified and protected resources.
2. Obtain explicit Owner approval of one exact destructive plan. Include worktree paths and HEADs, branch refs and local and live remote tips or confirmed absence, PR head and merge commit, commands and safeguards, retained resources and blockers. Obtain confirmation that affected worktrees are inactive.
3. Reverify each target and its preconditions immediately before acting. Remove only approved clean, inactive, unlocked worktrees from another checkout using `git worktree remove <path>` without force. If state, SHAs, permissions, prerequisites or risks change, stop and obtain approval of the revised plan. Stop on Git refusal or uncertainty.
4. Before local branch deletion, reverify the merged PR, merge commit ancestry and exact approved tip matching the merged PR head. Require a direct ref and confirm the branch is unused in every worktree. Recheck for activity, locks, dirty files and unfinished work. Run `git update-ref --no-deref -d refs/heads/<branch> <approved-sha>`. Git checks the expected SHA under lock. The low-level command bypasses porcelain worktree safeguards and could remove a symbolic ref itself, so verify both worktree safety and ref type separately. Report any retained branch configuration.
5. For manual remote deletion, reverify the exact approved live tip matching the merged PR head, and use `git push --force-with-lease=refs/heads/<branch>:<verified-head-oid> origin :refs/heads/<branch>`. Stop if the lease fails. If GitHub has already removed the ref, verify its absence and skip deletion. Blanket force operations and remote history rewriting are prohibited.
6. Recheck the worktree inventory and affected local and live remote refs. Report actual outcomes and retained resources.

## Scenario walkthroughs

These walkthroughs exercise the decision rules on representative inputs.

| Scenario | Evidence and expected action |
| --- | --- |
| Idle processes | An IDE is open and an authorized agent is inspecting the repo. The checkout is clean, there are no relevant Git locks or concurrent mutations, and the human merge and fast-forward checks pass. Synchronize under effective permissions. |
| Conflicting activity | Another session is writing the index or switching the target checkout. Stop and recheck after the conflict is resolved. A lock of uncertain origin affecting the target also blocks the operation. |
| Dirty checkout | Status shows an untracked file or local edit. Preserve it and defer synchronization in that checkout. If status is clean but the target tracks a path occupied by an ignored user file, the switch or fast-forward must refuse to overwrite it. Stop and preserve the file. |
| Deferred deletion | GitHub confirms the remote feature ref is absent, but the local branch or worktree is retained. Report the inventory and proceed with the next approved Issue from verified clean `main`. If GitHub still shows the remote branch, retain it unless the Owner approves the exact lease-protected fallback. |
| Additional fetch mappings or pruning configured | The remote config also maps branches into `refs/heads/*` or maps tags, and pruning is enabled. The explicit main refspec and empty refmap ignore those mappings. Tag fetching and pruning are disabled. Only `origin/main` is updated. Local branches, tags and other remote-tracking refs are preserved. |
| Symbolic fetch destination | The exact local `refs/remotes/origin/main` is symbolic, even if its target is missing. Stop before fetch and preserve its target. Continue only with a direct commit ref or confirmed absence. |
| Ambiguous short ref | A tag or local branch named `origin/main` points at a different commit. The ancestry checks use full ref names and the fast-forward uses the SHA verified against live `main`. Preserve the tag or branch. |
| Changed SHA | The remote main tip changes before synchronization. Refresh and revalidate the merge and fast-forward checks. If a deletion target tip differs from the approved SHA, stop that plan and obtain a new decision. If a reviewed PR base or head changes, refresh the handoff and request review of the new pair. |
| Missing handoff evidence | The CI run does not identify the requested head, or an applicable evidence file cannot be read. Record the gap and keep the affected verification pending until the evidence is supplied and read. |
| Exhausted review cycles | Major findings remain after cycle two. Stop. A documented Owner exception permits one scoped cycle with fresh checks and review. If it fails, escalate. |
| Sandbox denial | The platform denies a Git write or Reviewer access. Preserve state and report the denied action. Resume only via a policy-permitted route and recheck preconditions. |

## GitHub protection and CI baseline

An external audit on 2026-11-14 observed [Protect main](https://github.com/nick-yermak/amber-hunter/rules/27092966) (ruleset #27092966) as active. It requires a pull request, squash merge, resolution of review threads, and the `Workspace install` check. It has no bypass actors and requires zero approving reviews. These observations describe the configuration on the audit date. The link shows the live ruleset, which can change.

The [CI workflow](../../.github/workflows/ci.yml) installs dependencies with a frozen lockfile, builds the frontend for production, and runs unit tests. Only the Human Owner performs the final merge. This is an operational requirement, independent of the ruleset's approving review count.

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
