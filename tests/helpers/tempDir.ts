import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export function tempDir(prefix = 'testlog-') {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  const cleanup = () => rmSync(dir, { recursive: true, force: true });
  return { dir, cleanup };
}
