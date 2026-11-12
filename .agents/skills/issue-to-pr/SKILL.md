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

1. Confirm implementation approval and the verified `Ready` state.
2. Check permission boundaries, branch/worktree isolation, no undocumented scope creep.
3. Write a concise plan and required verification. Request owner decision for material architecture/dependency change.
4. Implement only approved scope; record source references for uncertain APIs using official docs/Context7.
5. Run existing checks; never conceal failures; do not fabricate checks when dependencies unavailable.
6. Request independent read-only review of actual diff, resolve high-priority findings or report blockers.
7. Prepare PR with Issue link, evidence, tradeoffs, screenshots when UI, review summary. Create external PR only if permission verified.
8. Update permissible GitHub Project states and hand off the PR to the owner for merge. Never merge or deploy to production.
9. After a human merge, follow [Post-Merge Cleanup](../../../docs/harness/OPERATING_MODEL.md#post-merge-cleanup) with owner confirmation before destructive operations. Preserve worktrees in use by active Codex sessions.
