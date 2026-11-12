# MCP Registry

## Context7

Context7 is configured at the Codex user level and authenticated through OAuth. Keep authentication in the user's Codex setup. Never commit tokens, credentials, or authentication logs.

[AH-004](https://github.com/nick-yermak/amber-hunter/issues/9) records a successful read-only Angular documentation lookup using `resolve_library_id` followed by `query_docs`. Use Context7 for library API and framework documentation. Match the lookup to the project's dependency version when available and follow approved ADRs for project decisions. See the [Bootstrap Audit](BOOTSTRAP_AUDIT.md).

## Angular CLI MCP

The Angular workspace provides a project-local read-only and local-only server. See the [web development guide](../../apps/web/README.md#angular-cli-mcp) for the verified stdio calls, exposed tools, and Codex configuration example. Codex Desktop activation remains unverified. The restricted Reviewer profile does not use this server.

## GitHub

Use `gh` for Issues, Projects, PRs, and Actions checks. Revisit GitHub MCP when a concrete capability gap in this workflow has been identified.
