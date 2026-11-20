import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, symlinkSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const dependencies = join(root, 'node_modules');
const astro = join(dependencies, 'astro', 'bin', 'astro.mjs');

function build(cwd) {
  const result = spawnSync(process.execPath, [astro, 'build', '--root', root], { cwd, stdio: 'inherit' });
  if (result.error) throw result.error;
  return result.status ?? 1;
}

// Sync clients can lock Astro's intermediate files on Windows while it removes them.
if (process.platform === 'win32') {
  const staging = mkdtempSync(join(tmpdir(), 'custmeet-astro-'));
  const junction = join(staging, 'node_modules');
  let linked = false;
  try {
    symlinkSync(dependencies, junction, 'junction');
    linked = true;
    process.exitCode = build(staging);
  } finally {
    if (linked) unlinkSync(junction);
    rmSync(staging, { recursive: true, force: true, maxRetries: 3 });
  }
} else {
  process.exitCode = build(root);
}
