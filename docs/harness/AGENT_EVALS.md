# Agent evaluation architecture and controls

See the [approved Epic and decisions](AGENT_EVALS_EPIC.md) and the [offline runner guide](../../evals/README.md).

## Execution modes

- **Offline** uses a synthetic process trace, explicit synthetic observations and file snapshots from disposable fixtures. It requires Node.js only. No subprocess or external service participates in an offline evaluation.
- **Controlled** calls for a fresh role-specific session with a disposable fixture and independently verified access boundaries. Both Decision and Execution modes remain blocked for model-backed runs.
- **Operational** examines already-authorized work evidence passively. CLI behavior does not establish equivalent Desktop behavior.

The offline flow validates explicitly versioned scenarios and expectations, hashes the inputs, builds a disposable fixture, constructs a CLI request descriptor, replays simulated process events, compares state, and evaluates mandatory assertions. It keeps expectations and grader logic in the host runner. The descriptor exposes the fixture working directory and the prompt only. It is evidence of argument construction. Live protection of host grader files and private artifacts remains unverified.

A blocking gate or missing evidence cannot be compensated by other assertions. The runner reports a demonstrated mandatory violation as FAIL and incomplete evidence as INVALID. Successful deterministic checks may be PENDING REVIEW. Scenario human rubrics use 0–2 scores in the approved design. Assessment and acceptance of the baseline are deferred.

## Live gate

The CLI intentionally ships no real launch adapter. Both roles receive BLOCKED and exit 2 from the live entry points. It accepts no flags, environment override or user-entered evidence to open the gate. The Reviewer descriptor requests read-only and never. Effective sandbox, approval, session separation, fixture access, auth, external service and network controls all remain unverified.

Before any future launch, require independently verified filesystem and network boundaries, access to HOME and Keychain, removal of SSH and Git credential paths, a verified tool inventory and denial of unintended services, and a way to use only model authentication. The grader, expectations and private artifacts need enforced access boundaries. A fresh directory and a separate CODEX_HOME by themselves do not provide that evidence. Stop if any control cannot be demonstrated. Keep the current [Reviewer runbook](REVIEWER.md) and [permissions](PERMISSIONS.md) in force.

## CLI capability evidence

The read-only audit observed Codex CLI 0.171.0 and the local options `exec`, `--json`, `--output-schema`, `--ephemeral`, role sandbox and approval choices, `--profile`, and configuration options. The offline parser exercises a subset of the documented JSONL event envelopes. Format compatibility, completeness, model and reasoning values, usage, subscription limits, authentication, and process termination on the live host remain unknown. The historical manual Reviewer check applies to that session only.

[Official non-interactive documentation](https://learn.chatgpt.com/docs/non-interactive-mode)
