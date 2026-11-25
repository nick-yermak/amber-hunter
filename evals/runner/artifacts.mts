import { lstat, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { RunResult } from './contracts.mts';
import type { Evidence } from './evidence.mts';

const EVAL_ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

export async function saveOfflineRun(result: RunResult, evidence: Evidence): Promise<string> {
  if (evidence.process.source !== 'synthetic' || !/^[0-9a-f-]{36}$/.test(result.manifest.runId)) {
    throw new Error('Expected a synthetic run and generated run ID');
  }
  const root = join(EVAL_ROOT, 'runs');
  if ((await readFile(join(EVAL_ROOT, '.gitignore'), 'utf8')).trim() !== '/runs/') {
    throw new Error('Missing private run ignore rule');
  }
  // Do not follow a pre-existing symlink or accept an evidence directory open to other users.
  await mkdir(root, { mode: 0o700 }).catch((error: NodeJS.ErrnoException) => {
    if (error.code !== 'EEXIST') throw error;
  });
  const rootStat = await lstat(root);
  if (!rootStat.isDirectory() || (rootStat.mode & 0o077) !== 0) throw new Error('Unsafe private run directory');
  const run = join(root, result.manifest.runId);
  await mkdir(run, { mode: 0o700 });
  await writeFile(join(run, 'evidence.json'), JSON.stringify(evidence, null, 2), { mode: 0o600, flag: 'wx' });
  await writeFile(join(run, 'result.json'), JSON.stringify(result, null, 2), { mode: 0o600, flag: 'wx' });
  return run;
}
