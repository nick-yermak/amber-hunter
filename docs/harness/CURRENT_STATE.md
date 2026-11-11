# Amber Hunter — Current Operational State

Verified on 2026-11-12 during [AH-001 — Validate Issue-to-PR Workflow](https://github.com/nick-yermak/amber-hunter/issues/1).

## Completed setup

- The [Amber Hunter repository](https://github.com/nick-yermak/amber-hunter) is initialized and contains the documentation handoff. Before work on AH-001 began, the local working tree was clean and `main` matched the remote `main` at `17687e1`.
- GitHub CLI read access was verified for AH-001. The issue was open and in **Ready** in **Amber Hunter — Development**, with [M1 — Foundation & Harness](https://github.com/nick-yermak/amber-hunter/milestone/1) assigned.

## Pending Harness Bootstrap tasks

- Record the installed Codex Desktop, Node.js and pnpm versions. Check Angular tooling and Angular MCP when the Angular workspace exists.
- Verify GitHub write permissions for the intended workflow and check GitHub MCP and Context7 access.
- Verify the independent reviewer's read-only access and complete the AH-001 review and linked PR workflow, with final merge by the owner.
- Verify CI, preview and non-production D1 bindings once the environments are approved.

Use the [Bootstrap Audit](BOOTSTRAP_AUDIT.md) to record evidence for the remaining checks. The [approved project baseline](../baseline/PROJECT_STATE.md) records the discovery decisions.
