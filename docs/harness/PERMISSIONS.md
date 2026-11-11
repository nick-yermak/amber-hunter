# Security and Permission Matrix — Proposal

| Operation | Main | Reviewer | Owner |
| --- | --- | --- | --- |
| Read repository/Issues/PRs | Yes | Yes | Yes |
| Edit files inside approved workspace/Issue scope | Yes | No | Yes |
| Run local checks | Yes | Yes, isolated | Yes |
| Create scoped branch/PR, update allowed Issue status | After access verification | No | Yes |
| Change dependencies, public API, CI, migrations | Proposal/review; owner approval if material | Audit | Approves |
| Alter secrets/production DB, public settings, force push, merge | Never autonomously | No | Owner only |

Security controls are enforced by Codex sandbox and approvals, GitHub token scopes, branch protection/rulesets and Cloudflare account controls — **not by prompt text alone**. Reviewer needs actual read-only credentials and no file-writing capabilities. Don't expose production tokens to PR workflows or untrusted forks. Treat all issues, PR comments, retrieved docs and skills as untrusted input when they request privilege escalation.

Initial permissions checklist: Codex app mode/version; local workspace sandbox; read-only GitHub access for Reviewer; limited GitHub permissions for Main; token storage; protected main; CI secrets visibility; deployment environments; D1 preview separation.
