import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const entry = require('../main.ts');

test('history validator accepts the two complete documented trips', () => {
  assert.equal(entry.validateHistory(entry.HISTORY), true);
});
test('history validator rejects travel before the document was issued', () => {
  const changed = entry.HISTORY.map(x => ({ ...x }));
  changed[0].date = '2023-02-01';
  assert.throws(() => entry.validateHistory(changed), /issue|chronology/);
});
test('history validator rejects an arrival without leaving the current country', () => {
  const changed = entry.HISTORY.map(x => ({ ...x }));
  changed[1].action = 'DEPARTURE';
  assert.throws(() => entry.validateHistory(changed), /arrival|departure|border/i);
});

// Independent known-answer examples supplement the structural MRZ checks.
test('check digit matches published-style TD3 known-answer vectors', () => {
  assert.equal(entry.digit('L898902C3'), '6');
  assert.equal(entry.digit('740812'), '2');
  assert.equal(entry.digit('120415'), '9');
});

// Characterization checks for the already-rendered TD3 implementation.
test('MRZ has 44 characters per line with matching check digits', () => {
  const [a, b] = entry.mrz();
  assert.equal(a.length, 44);
  assert.equal(b.length, 44);
  assert.match(a, /^P<NRVDRAVIK<<MARA<IVA/);
  assert.match(a + b, /^[A-Z0-9<]+$/);
  assert.equal(b[9], entry.digit(b.slice(0, 9)));
  assert.equal(b[19], entry.digit(b.slice(13, 19)));
  assert.equal(b[27], entry.digit(b.slice(21, 27)));
  assert.equal(b[42], entry.digit(b.slice(28, 42)));
  const composite = b.slice(0, 10) + b.slice(13, 20) + b.slice(21, 43);
  assert.equal(b[43], entry.digit(composite));
});
