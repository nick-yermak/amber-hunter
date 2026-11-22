import { spawn } from 'node:child_process';
import { watch } from 'node:fs';
import { generateAcademy, contentRoot, publicRoot } from './academy-content.mjs';

generateAcademy();
const args = process.argv.slice(process.argv[2] === '--' ? 3 : 2);
const server = spawn(process.execPath, ['node_modules/@angular/cli/bin/ng.js', 'serve', ...args], {
  stdio: 'inherit',
});
let timer;
function schedule() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    try {
      generateAcademy();
    } catch (error) {
      console.error(error);
      process.exitCode = 1;
      server.kill();
    }
  }, 75);
}
const watchers = [
  watch(contentRoot, { recursive: true }, schedule),
  watch(publicRoot, { recursive: true }, (_event, path) => {
    if (!path || path.startsWith('academy-images')) schedule();
  }),
];
server.on('close', (code, signal) => {
  clearTimeout(timer);
  for (const watcher of watchers) watcher.close();
  process.exitCode ||= code ?? (signal === 'SIGTERM' || signal === 'SIGINT' ? 0 : 1);
});
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.kill(signal));
