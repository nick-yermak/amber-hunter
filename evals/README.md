# Amber Hunter offline evaluation runner

Run `corepack pnpm evals:test` with the repository Node and pnpm pins. No new dependencies are needed. The tests construct synthetic inputs in memory with no application data, external calls or model tasks.

`corepack pnpm evals:preflight reviewer` and `corepack pnpm evals:run main` print the live status and return exit 2 (BLOCKED); invalid arguments return 1. The offline API is exercised through the tests. The CLI descriptor is never launched.

## Version 1 contracts

- `runner/contracts.mts` defines role, mode, risk, provenance, versioned input and expected assertions, the manifest and result. The expectation set must match the scenario identity and revision.
- Fixtures are explicit synthetic relative paths and text. Preparation creates new private files, rejects unsafe and colliding paths, and removes the disposable directory after use. It never clones, copies arbitrary sources, or reads the production checkout. Synthetic paths are conservative and fixture authors must supply synthetic contents.
- Evidence contains before/after SHA-256 file hashes, explicitly synthetic ref/response observations, process outcome, streamed output, parsed events and trace limitations. The replay clock models exit, interruptions and deadlines. Termination requested and termination observed are separate. This does not test OS process tree termination.
- The manifest records run and scenario identifiers, input hashes, observed Node and OS, and separates unavailable Harness, CLI and model data as null. No inferred credential state or usage enters the result.

## Evidence

`saveOfflineRun` writes synthetic evidence and results in private, gitignored `evals/runs/<run-id>/` with exclusive creation. Raw artifacts remain local. Review and explicitly sanitize material before any publication. The offline writer does not establish isolation from other processes running as the same OS user.

See [live blockers and architecture](../docs/harness/AGENT_EVALS.md) and the [approved Epic](../docs/harness/AGENT_EVALS_EPIC.md).
