# Independent Reviewer CLI

[AH-002](https://github.com/nick-yermak/amber-hunter/issues/3) recorded five passing local checks on 2026-11-12. This setup provides a practical restricted Reviewer for local review. Complete isolation, including isolation from remote writes, remains unverified.

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

## Proposed ADR-006 clarification

Owner decision required. Retain the [ADR-006](../adr/ADR-006.md) independent read-only review requirement. A follow-up ADR should decide whether to permit this CLI profile for local-diff review during MVP bootstrap while remote write isolation remains UNKNOWN. Document the exception, its allowed use, and what evidence would retire it. If enforced remote isolation is required, verify that the Reviewer runtime cannot reach write-capable services or owner credentials before relying on it as a security boundary.
