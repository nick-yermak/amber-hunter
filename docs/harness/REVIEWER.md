# Independent Reviewer CLI

[AH-002](https://github.com/nick-yermak/amber-hunter/issues/3) recorded five passing local checks on 2026-11-12. The owner approved this Restricted Local Reviewer for MVP local-diff review. Authenticated GitHub access is outside this workflow. Security-sensitive changes require human review before merge. Complete isolation, including isolation from remote writes, remains unverified.

## Launch

From Terminal, start a new Codex CLI session using the separate Reviewer profile. Substitute the absolute path to the checkout containing the diff.

```sh
env -u SSH_AUTH_SOCK \
  GIT_CONFIG_NOSYSTEM=1 \
  GIT_CONFIG_GLOBAL=/dev/null \
  CODEX_HOME="$HOME/.codex-reviewer" \
  codex -s read-only -a never --no-daemon -C "/absolute/path/to/amber-hunter"
```

In the CLI session, confirm the effective sandbox and approval policy before reviewing. Check the environment and Git configuration using read-only metadata and report only presence or absence. Proceed only after all five local checks pass. For the credential helper check, suppress values and report only whether matching entries or errors were found. Inspect the local diff, relevant requirements, and supplied test evidence. Return findings in the session. Leave GitHub operations to Main or the owner.

## Verified local controls

| Check | Result | Evidence from the hardened session |
| --- | --- | --- |
| Filesystem sandbox | PASS | Effective sandbox reported `read-only`. The shell also reported that it could not create a temporary file for a here-document. |
| Approval policy | PASS | Effective policy reported `never`. |
| SSH agent environment | PASS | `SSH_AUTH_SOCK` was absent from the Reviewer process. |
| Global and system Git configuration | PASS | `GIT_CONFIG_GLOBAL=/dev/null` and `GIT_CONFIG_NOSYSTEM=1` were present. `GIT_CONFIG_SYSTEM` was absent. |
| Effective Git credential helpers | PASS | `git config --show-origin --show-scope --get-regexp '^credential(\..*)?\.helper$'` returned exit status 1 with no entries or errors, including checks for repository-local and URL-specific helpers. |

The results apply to the inspected session. Git can still load repository-local configuration, and the Reviewer runs under the same OS user. The checks do not establish isolation from other credential sources or inherited services. Reviewer GitHub identity, repository and Project grants, and authenticated read access remain UNKNOWN.

## Remote write capability

**UNKNOWN.** The hardened session exposed no direct GitHub tools, but its tool inventory included the built-in Sites API operation `create_source_repository_write_credential`, described as granting push access to a Sites source repository. It was never invoked. Its backend authorization and applicability to this GitHub repository remain unverified. The filesystem sandbox and separate Codex home do not establish equivalent restrictions for built-in services. No GitHub write tests or credential retrieval were performed.

## Observed tool categories

This inventory combines the 2026-11-12 Reviewer CLI tool listings and the hardened session report. Presence reflects the reported session inventory. Service authentication and effective write grants were not exercised.

| Category | Observed interface or evidence | Potential side effects |
| --- | --- | --- |
| Shell, Git, GitHub CLI | Shell and Git used for local metadata. `gh` was available in a preliminary Reviewer session. | Remote Git and GitHub CLI operations depend on network and credentials. Local checks do not establish remote denial. |
| Codex TUI and Node REPL | Session control and scripting interfaces were listed. | Effective restrictions on tool-specific writes and network access were not separately verified. |
| Computer and browser control | Listed in the initial read-only CLI inventory. Availability in the hardened session was not confirmed. | Authenticated browser sessions could submit forms or modify remote resources if reachable. |
| Built-in app services | Sites, Document Control, Pets, Plugin Management, and Safety Settings were listed. | These categories expose state-changing operations. Sites exposed the potential Git push path described above. Effective grants remain unknown. |
| Search and Hotline | Listed as lookup services. | No write capability identified in the observed lookup categories. |
| Direct GitHub integration | No dedicated GitHub tool appeared in the hardened session inventory. | Other routes remain possible. |

Use local files, local diffs, and supplied evidence for review. Leave remote operations to Main or the owner. Record new tool categories and any changes to local controls when rechecking the profile.

## Proposed AH-002 acceptance criteria

- [ ] Document the Restricted Local Reviewer launch procedure and scope. Confirm the five local controls in the Reviewer session and record the evidence.
- [ ] Inventory observed tool categories, flag potential external writes, and distinguish tool exposure from verified authorization.
- [ ] Document that authenticated GitHub access is outside the MVP Reviewer workflow. Record remote write isolation, including Sites applicability and grants, as UNKNOWN unless supported by evidence.
- [ ] Record the [ADR-006 clarification](../adr/ADR-006.md#proposed-clarification--restricted-local-reviewer-for-mvp), the owner-approved MVP scope, and the human review requirement for security-sensitive changes.
- [ ] Verify Markdown formatting, internal links, and consistency across the Harness documents. Keep the verification evidence free of credentials and avoid remote write tests.

These criteria are proposed for [Issue #3](https://github.com/nick-yermak/amber-hunter/issues/3).
