# MCP Registry

## Context7

Context7 is configured at the Codex user level and authenticated through OAuth. Keep authentication in the user's Codex setup. Never commit tokens, credentials, or authentication logs.

[AH-004](https://github.com/nick-yermak/amber-hunter/issues/9) records a successful read-only Angular documentation lookup using `resolve_library_id` followed by `query_docs`. Use Context7 for library API and framework documentation. Match the lookup to the project's dependency version when available and follow approved ADRs for project decisions. See the [Bootstrap Audit](BOOTSTRAP_AUDIT.md).

## Angular CLI MCP

Deferred until the Angular scaffold exists. The proposed setup is project-local and read-only. Before activation, verify the installed CLI version, supported commands and flags, exposed tool inventory, and effective read-only behavior against the [Angular CLI MCP documentation](https://angular.dev/ai/mcp).

## GitHub

Use `gh` for Issues, Projects, PRs, and Actions checks. Revisit GitHub MCP when a concrete capability gap in this workflow has been identified.
