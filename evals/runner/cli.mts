import { ROLES } from './contracts.mts';
import { livePreflight } from './preflight.mts';

const [command, requestedRole, ...extra] = process.argv.slice(2);
const role = ROLES.find((candidate) => candidate === (requestedRole ?? 'main'));

if ((command !== 'preflight' && command !== 'run') || !role || extra.length) {
  console.error('Usage: node evals/runner/cli.mts <preflight|run> [main|reviewer]');
  process.exitCode = 1;
} else {
  // Both entry points share the live gate. AE-1 exposes no subprocess launch path.
  console.log(JSON.stringify(livePreflight(role), null, 2));
  process.exitCode = 2;
}
