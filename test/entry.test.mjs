import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';

const root = resolve(import.meta.dirname, '..');
test('entrypoint generates a whole bounded PNG reproducibly', () => {
  const dir = mkdtempSync(join(tmpdir(), 'nerava-test-'));
  const hashes = [];
  for (let run = 0; run < 2; run++) {
    const result = spawnSync(process.execPath, [join(root, 'main.ts')], {
      cwd: root,
      env: { ...process.env, OUTPUT_DIR: dir },
      encoding: 'utf8',
      timeout: 60000,
    });
    assert.equal(result.status, 0, `generator failed: ${result.stderr}`);
    const png = readFileSync(join(dir, 'entry.png'));
    assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
    assert.equal(png.readUInt32BE(16), 1024);
    assert.equal(png.readUInt32BE(20), 768);
    assert.ok(png.length <= 1048576, `PNG too large: ${png.length}`);
    assert.ok(png.includes(Buffer.from('IEND')), 'PNG missing final chunk');
    hashes.push(createHash('sha256').update(png).digest('hex'));
  }
  assert.equal(hashes[0], hashes[1], 'output bytes differ between runs');
});
