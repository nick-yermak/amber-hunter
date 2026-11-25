export const VERSION = 1;
export const ROLES = ['main', 'reviewer'] as const;
export const MODES = ['decision', 'execution'] as const;
export const STATUSES = ['PASS', 'FAIL', 'BLOCKED', 'INVALID', 'PENDING REVIEW'] as const;

export type Role = typeof ROLES[number];
export type Mode = typeof MODES[number];
export type Status = typeof STATUSES[number];
export type Observation<T> =
  | { state: 'observed'; value: T }
  | { state: 'missing' | 'unverified'; reason: string };

export interface FixtureFile {
  path: string;
  text: string;
}

export interface Scenario {
  version: 1;
  id: string;
  revision: number;
  role: Role;
  mode: Mode;
  risk: 'critical' | 'standard';
  provenance: string;
  prompt: string;
  fixture: FixtureFile[];
}

export interface Snapshot {
  files: Record<string, string>;
  refs: Observation<Record<string, string>>;
}

export type Assertion =
  | { kind: 'exit-code'; expected: number }
  | { kind: 'allowed-files'; paths: string[] }
  | { kind: 'file-unchanged'; path: string }
  | { kind: 'ref-unchanged'; ref: string }
  | { kind: 'ref-sha'; ref: string; expected: string }
  | { kind: 'event-observed' | 'event-forbidden'; type: string }
  | { kind: 'response-valid' };

export interface Expectations {
  version: 1;
  scenarioId: string;
  scenarioRevision: number;
  mandatory: Assertion[];
  humanReview: boolean;
}

export type AssertionState = 'pass' | 'fail' | 'missing' | 'unverified';

export interface AssertionResult {
  assertion: Assertion;
  state: AssertionState;
  detail: string;
}

export interface Manifest {
  version: 1;
  runId: string;
  startedAt: string;
  scenarioId: string;
  scenarioRevision: number;
  role: Role;
  mode: Mode;
  inputHashes: Record<'scenario' | 'prompt' | 'fixture' | 'expectations', string>;
  node: string;
  os: string;
  harnessCommit: string | null;
  instructionHashes: Record<string, string> | null;
  cliVersion: string | null;
  model: string | null;
  reasoningEffort: string | null;
}

export interface RunResult {
  version: 1;
  manifest: Manifest;
  status: Status;
  assertions: AssertionResult[];
  limitations: string[];
}

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasKeys(value: Record<string, unknown>, keys: string[]): boolean {
  return Object.keys(value).length === keys.length && keys.every((key) => Object.hasOwn(value, key));
}

function isAssertion(value: unknown): value is Assertion {
  if (!record(value)) return false;
  switch (value.kind) {
    case 'exit-code':
      return hasKeys(value, ['kind', 'expected']) && Number.isSafeInteger(value.expected);
    case 'allowed-files':
      return hasKeys(value, ['kind', 'paths']) && Array.isArray(value.paths) && value.paths.every((path) => typeof path === 'string');
    case 'file-unchanged':
      return hasKeys(value, ['kind', 'path']) && typeof value.path === 'string';
    case 'ref-unchanged':
      return hasKeys(value, ['kind', 'ref']) && typeof value.ref === 'string';
    case 'ref-sha':
      return hasKeys(value, ['kind', 'ref', 'expected']) && typeof value.ref === 'string' &&
        typeof value.expected === 'string' && /^(?:[0-9a-f]{40}|[0-9a-f]{64})$/.test(value.expected);
    case 'event-observed':
    case 'event-forbidden':
      return hasKeys(value, ['kind', 'type']) && typeof value.type === 'string';
    case 'response-valid':
      return hasKeys(value, ['kind']);
    default:
      return false;
  }
}

export function validateInputs(scenario: unknown, expectations: unknown): asserts scenario is Scenario {
  if (!record(scenario) || !hasKeys(scenario, ['version', 'id', 'revision', 'role', 'mode', 'risk', 'provenance', 'prompt', 'fixture']) ||
      scenario.version !== VERSION || typeof scenario.id !== 'string' || !/^[A-Z0-9-]{1,40}$/.test(scenario.id) ||
      typeof scenario.revision !== 'number' || !Number.isSafeInteger(scenario.revision) || scenario.revision < 1 ||
      !ROLES.some((role) => role === scenario.role) || !MODES.some((mode) => mode === scenario.mode) ||
      (scenario.risk !== 'critical' && scenario.risk !== 'standard') ||
      typeof scenario.provenance !== 'string' || !scenario.provenance.trim() ||
      typeof scenario.prompt !== 'string' || !scenario.prompt.trim() || !Array.isArray(scenario.fixture) ||
      !scenario.fixture.every((file) => record(file) && hasKeys(file, ['path', 'text']) &&
        typeof file.path === 'string' && typeof file.text === 'string')) {
    throw new Error('Invalid v1 scenario');
  }
  if (!record(expectations) || !hasKeys(expectations, ['version', 'scenarioId', 'scenarioRevision', 'mandatory', 'humanReview']) ||
      expectations.version !== VERSION || expectations.scenarioId !== scenario.id ||
      expectations.scenarioRevision !== scenario.revision || typeof expectations.humanReview !== 'boolean' ||
      !Array.isArray(expectations.mandatory) || !expectations.mandatory.length ||
      !expectations.mandatory.every(isAssertion)) {
    throw new Error('Invalid v1 expectations for scenario revision');
  }
}
