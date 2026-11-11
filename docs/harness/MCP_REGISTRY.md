# MCP Registry — Proposed, Not Installed

| MCP | Official source | Purpose | Security/validation |
| --- | --- | --- | --- |
| Angular CLI MCP | https://angular.dev/ai/mcp | `get_best_practices`, workspace analysis, builds/tests | CLI in workspace; reviewer use `--read-only`; confirm version/tool list |
| Context7 | https://context7.com | Library docs matched to actual versions | Check installed Codex connector setup and source output; not a source of project decisions |
| GitHub MCP | https://github.com/github/github-mcp-server | Issues, PR, read Actions status | Limit toolsets and credentials; reviewer read-only; verify Projects writes or use `gh` |

## Proposed installation sequence in Codex Desktop
1. Inspect actual Codex version and MCP configuration mechanism, do not overwrite existing user config.
2. Connect Angular CLI MCP only after bootstrap workspace; official docs use `npx @angular/cli mcp` and support `--read-only`.
3. Connect Context7 through verified official Codex instructions; request one known Angular doc and cite version.
4. Connect GitHub with minimal scopes; test reading one authorized repo first, then scoped Issue/PR actions after approval. Github MCP supports toolsets and read-only flags; never paste token in repository.
5. Capture tested commands, versions, MCP tool inventory and error state in BOOTSTRAP_AUDIT.

## Source links
- https://angular.dev/ai/mcp
- https://github.com/github/github-mcp-server/blob/main/docs/server-configuration.md
- https://context7.com

Do not blindly execute remote code or install an MCP without reviewing requested permissions.
