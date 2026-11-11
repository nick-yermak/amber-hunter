---
name: issue-to-pr
description: Execute an approved Amber Hunter GitHub Issue from scoped plan through tests, independent review, and a human-mergeable PR.
---
# Issue to PR
1. Confirm GitHub issue is real and `Ready`; gather title, objective, scope, AC, relevant ADRs. If not connected, stop with blocker.
2. Check permission boundaries, branch/worktree isolation, no undocumented scope creep.
3. Write a concise plan and required verification. Request owner decision for material architecture/dependency change.
4. Implement only approved scope; record source references for uncertain APIs using official docs/Context7.
5. Run existing checks; never conceal failures; do not fabricate checks when dependencies unavailable.
6. Request independent read-only review of actual diff, resolve high-priority findings or report blockers.
7. Prepare PR with Issue link, evidence, tradeoffs, screenshots when UI, review summary. Create external PR only if permission verified.
8. Update permissible GitHub Project states; never merge or deploy to production.
