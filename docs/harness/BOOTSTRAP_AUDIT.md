# Bootstrap Audit — Partial Results

Last updated: 2026-11-12

| Check | Observed result | Evidence | Follow-up |
| --- | --- | --- | --- |
| Codex Desktop version | Unknown | Not checked | Inspect locally |
| Git repository and origin | Verified | Public repository with default branch `main` | See [Project State](../baseline/PROJECT_STATE.md) |
| GitHub auth/Project rights | Unknown | Not checked | Verify minimal permissions |
| Node and pnpm | Verified for AH-003 | Node.js 24.22.3 and pnpm 10.34.9 pinned and exercised | See [CI bootstrap](CI_CD.md#workspace-bootstrap) |
| Angular CLI MCP | Pending | Angular initialization pending | Verify read-only setup after Context7 |
| Context7 MCP | Unknown | Not checked | Confirm docs retrieval |
| GitHub CLI | Verified for repository workflow | `gh` used for the Issue, PR, and ruleset audit | Continue using `gh` |
| GitHub MCP | Deferred | `gh` is primary | Revisit if needed |
| Reviewer local restrictions | Pass | Five local checks passed on 2026-11-12 | See [Reviewer CLI](REVIEWER.md#verified-local-controls) |
| Reviewer remote write isolation | Unknown | Sites write-credential capability exposed; backend authorization unverified | See [remote write capability](REVIEWER.md#remote-write-capability) |
| CI | Verified for AH-003 | Workspace install passed on [PR #7](https://github.com/nick-yermak/amber-hunter/pull/7) | See [CI bootstrap](CI_CD.md#workspace-bootstrap) |
| Preview and D1 bindings | Unknown | Awaiting environment setup | Defer until environment approval |
