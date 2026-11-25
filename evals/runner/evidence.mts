import type { Observation, Snapshot } from './contracts.mts';

export type TraceStep =
  | { atMs: number; kind: 'stdout' | 'stderr'; text: string }
  | { atMs: number; kind: 'exit'; code: number | null; signal: string | null }
  | { atMs: number; kind: 'interrupt' }
  | { atMs: number; kind: 'error'; message: string };

export interface ProcessEvidence {
  source: 'synthetic';
  durationMs: number;
  outcome: 'exit' | 'timeout' | 'interrupted' | 'error' | 'partial';
  exitCode: Observation<number>;
  signal: string | null;
  terminationRequested: boolean;
  terminationConfirmed: boolean;
  stdout: string;
  stderr: string;
}

export interface JsonlEvidence {
  events: Record<string, unknown>[];
  malformedLines: number[];
  unknownTypes: string[];
  complete: boolean;
}

export interface Evidence {
  version: 1;
  process: ProcessEvidence;
  jsonl: JsonlEvidence;
  before: Snapshot;
  after: Snapshot;
  responseValid: Observation<boolean>;
}

const SUPPORTED_TYPES = new Set([
  'thread.started', 'turn.started', 'turn.completed', 'turn.failed',
  'item.started', 'item.updated', 'item.completed', 'error',
]);

export function parseJsonl(stdout: string): JsonlEvidence {
  const events: Record<string, unknown>[] = [];
  const malformedLines: number[] = [];
  const unknownTypes = new Set<string>();
  for (const [index, line] of stdout.split(/\r?\n/).entries()) {
    if (!line.trim()) continue;
    try {
      const event: unknown = JSON.parse(line);
      if (typeof event !== 'object' || event === null || !('type' in event) || typeof event.type !== 'string') {
        throw new Error('Invalid event envelope');
      }
      if (!SUPPORTED_TYPES.has(event.type)) unknownTypes.add(event.type);
      events.push({ ...event });
    } catch {
      malformedLines.push(index + 1);
    }
  }
  const terminalEvents = events.filter(({ type }) => type === 'turn.completed' || type === 'turn.failed');
  return {
    events,
    malformedLines,
    unknownTypes: [...unknownTypes],
    complete: malformedLines.length === 0 && unknownTypes.size === 0 &&
      events[0]?.type === 'thread.started' && events[1]?.type === 'turn.started' &&
      events.at(-1)?.type === 'turn.completed' && terminalEvents.length === 1 &&
      !events.some(({ type }) => type === 'error'),
  };
}

export function replayProcess(steps: TraceStep[], timeoutMs: number): ProcessEvidence {
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs <= 0) throw new Error('Invalid offline timeout');
  let previous = 0;
  const evidence: ProcessEvidence = {
    source: 'synthetic',
    durationMs: 0,
    outcome: 'partial',
    exitCode: { state: 'missing', reason: 'No exit code observed' },
    signal: null,
    terminationRequested: false,
    terminationConfirmed: false,
    stdout: '',
    stderr: '',
  };
  for (const step of steps) {
    if (!Number.isSafeInteger(step.atMs) || step.atMs < previous) throw new Error('Invalid synthetic trace time');
    previous = step.atMs;
    if (evidence.outcome === 'partial' && step.atMs >= timeoutMs) {
      evidence.outcome = 'timeout';
      evidence.terminationRequested = true;
      evidence.durationMs = timeoutMs;
    }
    if (evidence.terminationRequested) {
      if (step.kind === 'exit') {
        evidence.terminationConfirmed = true;
        evidence.signal = step.signal;
        break;
      }
      continue;
    }
    evidence.durationMs = step.atMs;
    switch (step.kind) {
      case 'stdout':
      case 'stderr':
        evidence[step.kind] += step.text;
        break;
      case 'interrupt':
        evidence.outcome = 'interrupted';
        evidence.terminationRequested = true;
        break;
      case 'error':
        evidence.outcome = 'error';
        evidence.stderr += step.message;
        return evidence;
      case 'exit':
        evidence.outcome = 'exit';
        evidence.signal = step.signal;
        if (step.code !== null) evidence.exitCode = { state: 'observed', value: step.code };
        return evidence;
    }
  }
  return evidence;
}
