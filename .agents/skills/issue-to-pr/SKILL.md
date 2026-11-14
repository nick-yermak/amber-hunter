---
name: issue-to-pr
description: Execute an approved Amber Hunter GitHub Issue from scoped plan through tests, independent review, and a human-mergeable PR.
---
# Issue to PR
## Prepare the Issue

1. Search open and closed GitHub Issues for the approved identifier and title before creating an Issue. Reuse a matching Issue and search again before retrying an uncertain creation. Read its title, objective, scope, and acceptance criteria against the relevant baseline and ADRs. If GitHub is inaccessible, report the blocker.
2. Resolve the existing Priority and Area field and option IDs from `repository.issueFields`, including when Project V2 metadata lists empty `options` arrays. Assign the approved values with `setIssueFieldValue`. See the [GitHub Issue Fields runbook](../../../docs/harness/GITHUB_ISSUE_FIELDS.md).
3. Confirm membership in Amber Hunter — Development (#3). Add the Issue through Project V2 if it is missing.
4. Set the Project Status to `Ready` once the owner has approved the scope.
5. Assign the approved repository milestone.
6. Read back the Project, Status, Priority, Area, and milestone in a separate request. Compare them with the intended values and resolve any mismatch before implementation.

## Deliver the change

1. Verify owner-approved scope and Project status Ready. Together they authorize routine scoped work within effective permissions.
2. Record the scoped plan, checks and base SHA. Implement on an issue-specific branch or worktree and run the existing checks.
3. Prepare a linked PR with the required evidence. Open it when authorized and keep it draft while evidence is pending. Verify permitted Project writes with separate reads.
4. Use the [Reviewer handoff](../../../docs/harness/REVIEWER.md#review-handoff) for the exact base/head. The owner launches the separate Terminal Reviewer. Nested invocation is blocked.
5. Follow the [Controlled Autonomy workflow](../../../docs/harness/OPERATING_MODEL.md#issue-workflow) for failure recovery and stop conditions. Allow at most two scoped fix-and-review cycles after initial review. Rerun checks and verify review of the latest diff each time.
6. Record actual local checks, CI status, reviewed SHAs, findings, verdict, evidence and blockers. Hand off the PR to the owner for merge.
7. After a human merge, follow [Post-Merge Cleanup](../../../docs/harness/OPERATING_MODEL.md#post-merge-cleanup) with owner confirmation before destructive operations. Preserve worktrees in use by active Codex sessions.
