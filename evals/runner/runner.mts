import { randomUUID } from 'node:crypto';
import { release, platform, arch } from 'node:os';
import { evaluate, score } from './assertions.mts';
import { validateInputs } from './contracts.mts';
import type { Expectations, Manifest, Observation, RunResult, Scenario } from './contracts.mts';
import { parseJsonl, replayProcess } from './evidence.mts';
import type { Evidence, TraceStep } from './evidence.mts';
import { sha256, snapshot, withFixture } from './fixture.mts';
import { describeCliRequest } from './preflight.mts';
import type { CliRequest } from './preflight.mts';

export interface SyntheticReplay {
  steps: TraceStep[];
  timeoutMs: number;
  beforeRefs?: Record<string, string>;
  afterRefs?: Record<string, string>;
  responseValid?: boolean;
  applyFixtureChanges?: (cwd: string) => Promise<void>;
}

function syntheticRefs(value: Record<string, string> | undefined): Observation<Record<string, string>> {
  return value === undefined ? { state: 'unverified', reason: 'No synthetic ref observation supplied' }
    : { state: 'observed', value };
}

export async function runOffline(
  scenario: Scenario,
  expectations: Expectations,
  replay: SyntheticReplay,
): Promise<{ result: RunResult; evidence: Evidence; request: CliRequest }> {
  validateInputs(scenario, expectations);
  const manifest: Manifest = {
    version: 1,
    runId: randomUUID(),
    startedAt: new Date().toISOString(),
    scenarioId: scenario.id,
    scenarioRevision: scenario.revision,
    role: scenario.role,
    mode: scenario.mode,
    inputHashes: {
      scenario: sha256(JSON.stringify(scenario)),
      prompt: sha256(scenario.prompt),
      fixture: sha256(JSON.stringify(scenario.fixture)),
      expectations: sha256(JSON.stringify(expectations)),
    },
    node: process.version,
    os: `${platform()} ${release()} ${arch()}`,
    harnessCommit: null,
    instructionHashes: null,
    cliVersion: null,
    model: null,
    reasoningEffort: null,
  };
  return withFixture(scenario.fixture, async (cwd) => {
    const request = describeCliRequest(scenario.role, cwd, scenario.prompt);
    const before = await snapshot(cwd, syntheticRefs(replay.beforeRefs));
    await replay.applyFixtureChanges?.(cwd);
    const process = replayProcess(replay.steps, replay.timeoutMs);
    const evidence: Evidence = {
      version: 1,
      process,
      jsonl: parseJsonl(process.stdout),
      before,
      after: await snapshot(cwd, syntheticRefs(replay.afterRefs)),
      responseValid: replay.responseValid === undefined
        ? { state: 'unverified', reason: 'No synthetic response validation supplied' }
        : { state: 'observed', value: replay.responseValid },
    };
    const assertions = expectations.mandatory.map((assertion) => evaluate(assertion, evidence));
    return {
      request, evidence,
      result: {
        version: 1,
        manifest,
        status: score(evidence, assertions, expectations.humanReview),
        assertions,
        limitations: [
          'Synthetic process, response and ref observations. No model execution.',
          'Offline fixture file hashes were collected locally. Runtime isolation remains unverified.',
        ],
      },
    };
  });
}
