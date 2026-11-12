# MCP Registry — Proposed, Not Installed

| MCP | Official source | Purpose | Security/validation |
| --- | --- | --- | --- |
| Angular CLI MCP | https://angular.dev/ai/mcp | `get_best_practices`, workspace analysis, builds/tests | CLI in workspace; confirm version/tool list |
| Context7 | https://context7.com | Library docs matched to actual versions | Check installed Codex connector setup and source output; not a source of project decisions |
| GitHub MCP | https://github.com/github/github-mcp-server | Issues, PR, read Actions status | Deferred. Main continues to use `gh`. |

## Proposed installation sequence in Codex Desktop
1. Inspect actual Codex version and MCP configuration mechanism, do not overwrite existing user config.
2. Connect Context7 through verified official Codex instructions. Request one known Angular document and record its version.
3. Connect Angular CLI MCP using its documented read-only setup. Verify workspace-dependent tools after Angular initialization.
4. Capture tested commands, versions, MCP tool inventory, and errors in BOOTSTRAP_AUDIT.

## Source links
- https://angular.dev/ai/mcp
- https://github.com/github/github-mcp-server/blob/main/docs/server-configuration.md
- https://context7.com

Do not blindly execute remote code or install an MCP without reviewing requested permissions.
