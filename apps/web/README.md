# Amber Hunter web

Run from the repository root with the Node.js version in `.nvmrc` and Corepack. The root manifest pins pnpm.

```sh
corepack pnpm install --frozen-lockfile
corepack pnpm web:start
corepack pnpm web:build
corepack pnpm web:test
```

Use `corepack pnpm` directly when pnpm is missing from PATH. If the Corepack cache is unwritable, set `COREPACK_HOME` to a writable development cache. To expose `pnpm` to Angular CLI diagnostics, run `corepack enable pnpm` against a writable Node installation. The workspace scripts and CI do not require this shim.

Angular runs client-side with standalone components, Angular Router and the Angular 22 zoneless default. The five routes render placeholder headings for verification.

| Path | Heading |
| --- | --- |
| `/` | Home |
| `/map` | Explore Map |
| `/beaches/:slug` | Beach Details |
| `/academy` | Amber Academy |
| `/academy/:slug` | Article Reader |

## Cloudflare Static Assets

Serve `apps/web/dist/web/browser` as the assets directory. Set `assets.not_found_handling = "single-page-application"` so browser navigations to client routes receive the SPA entry point. The router uses a root base href. Deployment and Worker configuration are outside this bootstrap. See [Cloudflare SPA routing](https://developers.cloudflare.com/workers/static-assets/routing/single-page-application/).

## Angular CLI MCP

The workspace script starts the installed CLI over stdio with read-only and local-only tooling and scopes discovery to `apps/web`.

```sh
corepack pnpm --filter web --silent mcp
```

For the Main agent's local Codex configuration, use the following example. Replace the checkout path and, if Desktop cannot resolve it, use an absolute Corepack command and provide the appropriate Node PATH and Corepack cache. Start a new session after configuration and check the effective tool list. Keep this server out of the independent Reviewer profile.

```toml
[mcp_servers.angular-cli]
command = "corepack"
args = ["pnpm", "--filter", "web", "--silent", "mcp"]
cwd = "/absolute/path/to/amber-hunter"
enabled_tools = ["list_projects", "get_best_practices"]
```

The installed CLI advertised `ai_tutor`, `devserver_wait_for_build` (read-only build logs), `get_best_practices`, `list_projects`, and `onpush_zoneless_migration`. Target execution, dev-server start/stop, and online documentation search were absent. A local stdio client discovered `web` through `list_projects` and retrieved guidance from `get_best_practices` with the workspace path. Codex Desktop registration and calls in a Desktop session remain unverified.

## Bootstrap verification

- Node.js 24.22.3, pnpm 10.34.9, Angular 22.2.6, Angular CLI 22.2.7, TypeScript 6.0.3.
- Clean frozen install passed in a temporary copy of the workspace manifests using the populated package store. pnpm left optional dependency build scripts disabled.
- Production build passed. All five router unit tests passed.
- The local dev server returned the SPA entry point for all five direct URLs. Headless Chrome rendered the expected heading on each URL, using `example` for both slug routes.
