# Independent Reviewer CLI

[AH-002](https://github.com/nick-yermak/amber-hunter/issues/3) recorded five passing local checks on 2026-11-12. The owner approved this Restricted Local Reviewer for MVP local-diff review. Authenticated GitHub access is outside this workflow. Security-sensitive changes require human review before merge. Complete isolation, including isolation from remote writes, remains unverified.

## Invocation status

The manual Terminal workflow was verified locally with Codex CLI 0.167.2. A separate Restricted Local Reviewer reviewed a historical diff and returned exact base/head SHAs, findings and a verdict. That result covers the historical diff only. The installed CLI supports non-interactive `exec`, JSONL and explicit sandbox and approval settings.

Nested invocation from Main is **BLOCKED**. The CLI exited with code 1 at app-server client initialization (`Operation not permitted (os error 1)`) and emitted no JSONL events. The precise cause is **UNKNOWN**. Independent review uses the owner-launched Terminal fallback. Keep the effective sandbox and approval policy in place.

## Launch

The Owner runs the command supplied by Main in Terminal to start a separate Codex CLI session. Main uses this pattern and substitutes the absolute path to the checkout containing the diff.

```sh
env -u SSH_AUTH_SOCK \
  GIT_CONFIG_NOSYSTEM=1 \
  GIT_CONFIG_GLOBAL=/dev/null \
  CODEX_HOME="$HOME/.codex-reviewer" \
  codex -s read-only -a never --no-daemon -C "/absolute/path/to/amber-hunter"
```

In the CLI session, confirm the effective sandbox and approval policy before reviewing. Check the environment and Git configuration using read-only metadata and report only presence or absence. Proceed only after all five local checks pass. For the credential helper check, suppress values and report only whether matching entries or errors were found. Inspect the local diff, relevant requirements, and supplied test evidence. Return findings in the session. Leave GitHub operations to Main or the owner.

## Review handoff

For every initial review and re-review, Main provides the Owner with three ready-to-use artifacts for the exact PR base/head pair:

1. The absolute path to the self-contained `REVIEW-HANDOFF.md`.
2. A complete, copy-paste-ready Terminal command based on [Launch](#launch), with the actual checkout path and the restricted Reviewer profile and flags.
3. A complete, copy-paste-ready Reviewer prompt with the actual handoff path and full base/head SHAs. State all [five mandatory local control checks](#verified-local-controls) and require them to pass before review. Include the review constraints, the exact-diff task and the verdict format described below.

The Owner runs the command manually and pastes the supplied prompt as written. Main fills in all paths, SHAs and instructions before delivery.

Store the handoff outside tracked files, in an allowed local location readable from the separate Reviewer session. Refresh it when the diff or evidence changes. Include:

- Issue and PR identifiers and links, exact acceptance criteria, scope and constraints.
- Absolute checkout path, full PR diff base and head SHAs, previous findings and resolutions, and Owner decisions or exceptions.
- Local check commands and observed results, required CI check name, run ID, link, tested head and observed result. Include absolute screenshot and browser-log paths where applicable.
- Limitations and missing or inapplicable evidence. Keep credentials out of the handoff.

After verifying the launch controls, the Reviewer resolves both supplied SHAs locally as commits, confirms the resolved IDs match and inspects `git diff <base> <head>` in the named checkout. Missing or mismatched commits prevent exact-diff review. Read the applicable evidence locally and distinguish supplied test and CI results from independently verified evidence. Record unavailable evidence as a gap. Use only local inputs and avoid authenticated GitHub operations.

Return the full reviewed base/head SHAs, findings with severity (Blocker, Major, Minor, Suggestion), file and line where applicable, supporting evidence and a verdict (Pass, Changes requested, or Blocked). Explicitly report when there are no findings. The Owner returns the result to Main.

Before accepting the result, Main compares both reviewed SHAs with the current PR diff. A changed pair requires a refreshed handoff and fresh review. A failed launch, timeout or missing result leaves review pending. Follow the [Issue workflow](OPERATING_MODEL.md#issue-workflow) for fixes and the [Owner Exception Protocol](OPERATING_MODEL.md#owner-exception-protocol) for any additional cycle.

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
