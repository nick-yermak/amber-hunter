import assert from 'node:assert/strict';
import { lstat, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';
import { saveOfflineRun } from '../runner/artifacts.mts';
import { validateInputs } from '../runner/contracts.mts';
import type { Expectations, Scenario } from '../runner/contracts.mts';
import { parseJsonl, replayProcess } from '../runner/evidence.mts';
import type { TraceStep } from '../runner/evidence.mts';
import { snapshot, withFixture } from '../runner/fixture.mts';
import { livePreflight, REQUIRED_LIVE_CHECKS } from '../runner/preflight.mts';
import { runOffline } from '../runner/runner.mts';

const scenario: Scenario = {
  version: 1, id: 'OFFLINE-TEST', revision: 1, role: 'main', mode: 'execution',
  risk: 'critical', provenance: 'Synthetic runner test', prompt: 'Use the synthetic input.',
  fixture: [{ path: 'inputs/sample.txt', text: 'fixture' }],
};
const expectations: Expectations = {
  version: 1, scenarioId: scenario.id, scenarioRevision: 1, humanReview: false,
  mandatory: [{ kind: 'exit-code', expected: 0 }, { kind: 'file-unchanged', path: 'inputs/sample.txt' }],
};
const stdout = '{"type":"thread.started"}\n{"type":"turn.started"}\n{"type":"turn.completed"}\n';
const complete: TraceStep[] = [
  { kind: 'stdout', atMs: 2, text: stdout.slice(0, 13) },
  { kind: 'stdout', atMs: 3, text: stdout.slice(13) },
  { kind: 'exit', atMs: 4, code: 0, signal: null },
];
const replay = { steps: complete, timeoutMs: 10 };

test('validates versions, roles, fixture fields and matching expectations', () => {
  validateInputs(scenario, expectations);
  assert.throws(() => validateInputs({ ...scenario, role: 'unknown' }, expectations), /scenario/);
  assert.throws(() => validateInputs({ ...scenario, fixture: [{ source: '/private/data' }] }, expectations), /scenario/);
  assert.throws(() => validateInputs(scenario, { ...expectations, scenarioRevision: 2 }), /expectations/);
  assert.throws(() => validateInputs(scenario, { ...expectations, mandatory: [{ kind: 'unknown' }] }), /expectations/);
});

test('both live roles fail closed and report every unverified prerequisite', () => {
  for (const role of ['main', 'reviewer'] as const) {
    const result = livePreflight(role);
    assert.equal(result.status, 'BLOCKED');
    assert.equal(result.allowed, false);
    for (const check of REQUIRED_LIVE_CHECKS) assert.ok(result.reasons.includes(`${check}: unverified`));
  }
  assert.ok(livePreflight('reviewer').reasons.some((reason) => reason.includes('read-only')));
});

test('fixtures reject unsafe, reserved, duplicate and parent-colliding inputs', async () => {
  for (const path of ['../escape.txt', '/tmp/example.txt', '.git/config', '.env', 'auth.json', 'token.txt', 'a\\b.txt']) {
    await assert.rejects(withFixture([{ path, text: 'synthetic' }], async () => assert.fail()), /Unsafe/);
  }
  const file = { path: 'x.txt', text: 'synthetic' };
  await assert.rejects(withFixture([file, file], async () => assert.fail()), /duplicate/);
  await assert.rejects(withFixture([file, { ...file, path: 'x.txt/y.txt' }], async () => assert.fail()), /parent/);
});

test('fixture uses private permissions and cleans up on a failure', async () => {
  let path = '';
  await assert.rejects(withFixture(scenario.fixture, async (cwd) => {
    path = cwd;
    assert.equal((await lstat(join(cwd, 'inputs/sample.txt'))).mode & 0o777, 0o600);
    assert.equal(await readFile(join(cwd, 'inputs/sample.txt'), 'utf8'), 'fixture');
    throw new Error('synthetic failure');
  }), /synthetic failure/);
  await assert.rejects(lstat(path), { code: 'ENOENT' });
});

test('snapshot rejects symlinks before reading their targets', async () => {
  await withFixture(scenario.fixture, async (cwd) => {
    await symlink('inputs/sample.txt', join(cwd, 'link.txt'));
    await assert.rejects(snapshot(cwd, { state: 'missing', reason: 'test' }), /Unsupported/);
  });
});

test('offline run collects separate before/after hashes and CLI descriptors', async () => {
  const main = await runOffline(scenario, expectations, replay);
  const reviewer = await runOffline({ ...scenario, role: 'reviewer', mode: 'decision' }, expectations, replay);
  assert.equal(main.result.status, 'PASS');
  assert.equal(reviewer.result.status, 'PASS');
  assert.equal(reviewer.result.manifest.mode, 'decision');
  assert.equal(reviewer.result.manifest.cliVersion, null);
  assert.equal(reviewer.result.manifest.model, null);
  assert.match(reviewer.result.manifest.inputHashes.prompt, /^[a-f0-9]{64}$/);
  assert.notEqual(main.result.manifest.runId, reviewer.result.manifest.runId);
  const cwd = (args: string[]) => args[args.indexOf('--cd') + 1];
  assert.notEqual(cwd(main.request.args), cwd(reviewer.request.args));
  assert.deepEqual(reviewer.request.args, [
    'exec', '--json', '--ephemeral', '--cd', cwd(reviewer.request.args),
    '--sandbox', 'read-only', '--ask-for-approval', 'never', '-',
  ]);
  assert.equal(reviewer.request.stdin, scenario.prompt);
  assert.deepEqual(Object.keys(reviewer.evidence.before.files), ['inputs/sample.txt']);
  assert.deepEqual(reviewer.evidence.before.files, reviewer.evidence.after.files);
});

test('run observes file modifications and enforces allowed changes', async () => {
  const modified = { ...replay, applyFixtureChanges: (cwd: string) => writeFile(join(cwd, 'new.txt'), 'synthetic') };
  const strict = await runOffline(scenario, { ...expectations, mandatory: [{ kind: 'allowed-files', paths: [] }] }, modified);
  assert.equal(strict.result.status, 'FAIL');
  assert.notEqual(strict.evidence.before.files['new.txt'], strict.evidence.after.files['new.txt']);
  const allowed = await runOffline(scenario, {
    ...expectations, mandatory: [{ kind: 'allowed-files', paths: ['new.txt'] }], humanReview: true,
  }, modified);
  assert.equal(allowed.result.status, 'PENDING REVIEW');
});

test('synthetic ref assertions distinguish observed matches, changes and unverified refs', async () => {
  const ref = 'refs/heads/main';
  const expected = 'a'.repeat(40);
  const rules: Expectations = { ...expectations, mandatory: [{ kind: 'ref-unchanged', ref }, { kind: 'ref-sha', ref, expected }] };
  const beforeRefs = { [ref]: expected };
  for (const [afterRefs, expectedStatus] of [[beforeRefs, 'PASS'], [{ [ref]: 'b'.repeat(40) }, 'FAIL'], [undefined, 'INVALID']] as const) {
    const attempt = await runOffline(scenario, rules, { ...replay, beforeRefs, afterRefs });
    assert.equal(attempt.result.status, expectedStatus);
  }
});

test('missing event is never evidence of a forbidden action being absent', async () => {
  const attempt = await runOffline(scenario, {
    ...expectations,
    mandatory: [
      { kind: 'event-observed', type: 'item.started' }, { kind: 'event-forbidden', type: 'item.started' },
      { kind: 'response-valid' },
    ],
  }, replay);
  assert.deepEqual(attempt.result.assertions.map(({ state }) => state), ['missing', 'unverified', 'unverified']);
  assert.equal(attempt.result.status, 'INVALID');
  const violation = await runOffline(scenario, {
    ...expectations, mandatory: [{ kind: 'event-forbidden', type: 'turn.started' }],
  }, replay);
  assert.equal(violation.result.status, 'FAIL');
});

test('parser retains malformed line numbers and unknown events and rejects incomplete turns', () => {
  assert.deepEqual(parseJsonl('bad\n' + stdout).malformedLines, [1]);
  assert.deepEqual(parseJsonl(stdout + '{"type":"new.event"}\n').unknownTypes, ['new.event']);
  assert.equal(parseJsonl(stdout).complete, true);
  assert.equal(parseJsonl(stdout.replace('turn.completed', 'turn.failed')).complete, false);
  assert.equal(parseJsonl(stdout + '{"type":"turn.completed"}\n').complete, false);
  assert.equal(parseJsonl(stdout.split('\n')[0]).complete, false);
});

test('synthetic timeout retains output and separates requested termination from exit confirmation', () => {
  const output: TraceStep = { kind: 'stdout', atMs: 2, text: 'partial' };
  const lateOutput: TraceStep = { kind: 'stdout', atMs: 10, text: 'late' };
  const pending = replayProcess([output, lateOutput], 10);
  assert.equal(pending.outcome, 'timeout');
  assert.equal(pending.stdout, 'partial');
  assert.equal(pending.terminationRequested, true);
  assert.equal(pending.terminationConfirmed, false);
  const confirmed = replayProcess([output, { kind: 'exit', atMs: 11, signal: 'SIGTERM', code: null }], 10);
  assert.equal(confirmed.outcome, 'timeout');
  assert.equal(confirmed.terminationConfirmed, true);
  assert.equal(confirmed.exitCode.state, 'missing');
  assert.equal(confirmed.signal, 'SIGTERM');
});

test('interruption, launch error, partial stream and nonzero exit remain distinct', async () => {
  assert.equal(replayProcess([{ kind: 'interrupt', atMs: 1 }], 10).outcome, 'interrupted');
  assert.equal(replayProcess([{ kind: 'error', atMs: 1, message: 'synthetic spawn error' }], 10).outcome, 'error');
  assert.equal(replayProcess(complete.slice(0, 1), 10).outcome, 'partial');
  const run = await runOffline(scenario, expectations, {
    ...replay, steps: [...complete.slice(0, -1), { kind: 'exit', atMs: 4, signal: null, code: 1 }],
  });
  assert.equal(run.result.status, 'FAIL');
  assert.deepEqual(run.evidence.process.exitCode, { state: 'observed', value: 1 });
});

test('synthetic evidence stays in the local private run directory and is never overwritten', async () => {
  const { result, evidence } = await runOffline(scenario, expectations, replay);
  const directory = await saveOfflineRun(result, evidence);
  try {
    assert.ok(directory.endsWith(`/evals/runs/${result.manifest.runId}`));
    const file = join(directory, 'evidence.json');
    assert.equal((await lstat(file)).mode & 0o777, 0o600);
    assert.equal(JSON.parse(await readFile(file, 'utf8')).process.source, 'synthetic');
    await assert.rejects(saveOfflineRun(result, evidence), { code: 'EEXIST' });
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
