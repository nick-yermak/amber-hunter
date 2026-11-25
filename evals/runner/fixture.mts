import { createHash } from 'node:crypto';
import { lstat, mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import type { FixtureFile, Observation, Snapshot } from './contracts.mts';

export function sha256(bytes: string | Uint8Array): string {
  return createHash('sha256').update(bytes).digest('hex');
}

function fixturePaths(files: FixtureFile[]): string[] {
  const seen = new Set<string>();
  for (const { path, text } of files) {
    const parts = path.split('/');
    // A deliberately narrow synthetic format. No filesystem import or symlink input.
    if (parts.some((part) => !/^[a-z0-9][a-z0-9_-]*(?:\.(?:txt|md|json|ts))?$/.test(part) ||
        /^(?:auth|credential[s]?|secret[s]?|token[s]?)(?:\.|$)/.test(part)) ||
        Buffer.byteLength(text) > 256 * 1024 || seen.has(path)) {
      throw new Error('Unsafe or duplicate synthetic fixture input');
    }
    seen.add(path);
  }
  for (const path of seen) {
    const parts = path.split('/');
    for (let index = 1; index < parts.length; index++) {
      if (seen.has(parts.slice(0, index).join('/'))) {
        throw new Error('Synthetic fixture path collides with a parent file');
      }
    }
  }
  return [...seen];
}

export async function withFixture<T>(files: FixtureFile[], use: (cwd: string) => Promise<T>): Promise<T> {
  const inputs = files.map(({ path, text }) => ({ path, text }));
  fixturePaths(inputs);
  const temporary = await mkdtemp(join(tmpdir(), 'amber-eval-'));
  try {
    const cwd = join(temporary, 'fixture');
    await mkdir(cwd, { mode: 0o700 });
    for (const file of inputs) {
      const destination = join(cwd, file.path);
      await mkdir(dirname(destination), { recursive: true, mode: 0o700 });
      await writeFile(destination, file.text, { flag: 'wx', mode: 0o600 });
    }
    return await use(cwd);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
}

export async function snapshot(cwd: string, refs: Observation<Record<string, string>>): Promise<Snapshot> {
  const files: Record<string, string> = Object.create(null);
  async function visit(relative: string): Promise<void> {
    const dir = join(cwd, relative);
    for (const name of (await readdir(dir)).sort()) {
      const path = relative ? `${relative}/${name}` : name;
      const absolute = join(cwd, path);
      const stat = await lstat(absolute);
      if (stat.isDirectory()) await visit(path);
      else if (stat.isFile() && stat.nlink === 1) files[path] = sha256(await readFile(absolute));
      else throw new Error('Unsupported entry in offline fixture snapshot');
    }
  }
  await visit('');
  return { files, refs: structuredClone(refs) };
}
