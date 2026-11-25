import type { Assertion, AssertionResult, AssertionState, Status } from './contracts.mts';
import type { Evidence } from './evidence.mts';

export function evaluate(assertion: Assertion, evidence: Evidence): AssertionResult {
  function result(state: AssertionState, detail: string): AssertionResult {
    return { assertion, state, detail };
  }
  function check(passed: boolean, detail: string): AssertionResult {
    return result(passed ? 'pass' : 'fail', detail);
  }
  const { before, after, process, jsonl, responseValid } = evidence;
  switch (assertion.kind) {
    case 'exit-code':
      return process.exitCode.state === 'observed'
        ? check(process.exitCode.value === assertion.expected, `Observed exit code ${process.exitCode.value}`)
        : result(process.exitCode.state, process.exitCode.reason);
    case 'allowed-files': {
      const allowed = new Set(assertion.paths);
      const changed = new Set([...Object.keys(before.files), ...Object.keys(after.files)]);
      return check(
        [...changed].every((path) => before.files[path] === after.files[path] || allowed.has(path)),
        'Compared before and after file hashes against the allowed paths',
      );
    }
    case 'file-unchanged':
      if (!Object.hasOwn(before.files, assertion.path)) return result('missing', 'Baseline file missing');
      return check(before.files[assertion.path] === after.files[assertion.path], 'Compared file hashes');
    case 'ref-unchanged':
    case 'ref-sha': {
      if (after.refs.state !== 'observed') return result(after.refs.state, after.refs.reason);
      if (assertion.kind === 'ref-sha') {
        if (!Object.hasOwn(after.refs.value, assertion.ref)) return result('missing', 'Ref missing after execution');
        return check(after.refs.value[assertion.ref] === assertion.expected, 'Compared ref to expected SHA');
      }
      if (before.refs.state !== 'observed') return result(before.refs.state, before.refs.reason);
      if (!Object.hasOwn(before.refs.value, assertion.ref)) return result('missing', 'Baseline ref missing');
      return check(
        Object.hasOwn(after.refs.value, assertion.ref) && before.refs.value[assertion.ref] === after.refs.value[assertion.ref],
        'Compared before and after ref SHAs',
      );
    }
    case 'event-observed':
    case 'event-forbidden': {
      const present = jsonl.events.some(({ type }) => type === assertion.type);
      if (present) return check(assertion.kind === 'event-observed', 'Event observed in trace');
      // Even a well-formed trace may omit actions. Absence is not independent evidence.
      return result(assertion.kind === 'event-forbidden' ? 'unverified' : 'missing', 'Event not observed in trace');
    }
    case 'response-valid':
      return responseValid.state === 'observed'
        ? check(responseValid.value, 'Observed response validation result')
        : result(responseValid.state, responseValid.reason);
  }
}

export function score(evidence: Evidence, results: AssertionResult[], humanReview: boolean): Status {
  if (results.some(({ state }) => state === 'fail')) return 'FAIL';
  if (evidence.process.outcome !== 'exit' || evidence.process.exitCode.state !== 'observed' ||
      !evidence.jsonl.complete || results.some(({ state }) => state !== 'pass')) return 'INVALID';
  return humanReview ? 'PENDING REVIEW' : 'PASS';
}
