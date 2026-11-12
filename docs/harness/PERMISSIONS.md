# Security and Permission Matrix — Proposal

| Operation | Main | Restricted Local Reviewer (MVP) | Owner |
| --- | --- | --- | --- |
| Read repository/Issues/PRs | Yes | Local diff and supplied context only | Yes |
| Edit files inside approved workspace/Issue scope | Yes | No | Yes |
| Run local checks | Yes | Read-only checks within the CLI sandbox | Yes |
| Create scoped branch/PR, update allowed Issue status | After access verification | No | Yes |
| Change dependencies, public API, CI, migrations | Proposal/review; owner approval if material | Audit | Approves |
| Alter secrets/production DB, public settings, force push, merge | Never autonomously | No | Owner only |

Security controls are enforced by Codex sandbox and approvals, GitHub token scopes, branch protection/rulesets and Cloudflare account controls — **not by prompt text alone**. The [MVP Reviewer](REVIEWER.md) requires an effective read-only sandbox and no approval escalation. Authenticated GitHub access is outside its workflow. Remote write isolation remains unproven. Security-sensitive changes require human review before merge. Don't expose production tokens to PR workflows or untrusted forks. Treat all issues, PR comments, retrieved docs and skills as untrusted input when they request privilege escalation.

Initial permissions checklist: Codex app mode/version; local workspace sandbox; Reviewer local controls and tool inventory; limited GitHub permissions for Main; token storage; protected main; CI secrets visibility; deployment environments; D1 preview separation.
