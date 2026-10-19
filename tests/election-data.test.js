import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const votes = read('../data/pilpres-2024.json');
const topology = read('../data/indonesia-38-provinces.topo.json');

test('38 provinsi unik dan cocok dengan geometri', () => {
  assert.equal(votes.provinces.length, 38);
  const names = votes.provinces.map(p => p.name);
  assert.equal(new Set(names).size, 38);
  const geoNames = topology.objects['indonesia-38-prov-topo'].geometries.map(g => g.properties.PROVINSI);
  assert.equal(geoNames.length, 38);
  assert.deepEqual([...names].sort(), [...geoNames].sort());
});

test('nasional sama dengan 38 provinsi dan luar negeri', () => {
  for (let i = 0; i < 3; i++) {
    const domestic = votes.provinces.reduce((total, p) => total + p.votes[i], 0);
    assert.equal(domestic + votes.overseas[i], votes.national[i]);
    assert.ok(votes.provinces.every(p => Number.isInteger(p.votes[i]) && p.votes[i] >= 0));
  }
  assert.equal(votes.national.reduce((a,b) => a+b, 0), 164227475);
});

test('ringkasan wilayah konsisten dengan hasil resmi', () => {
  const wins = [0, 0, 0];
  for (const province of votes.provinces) wins[province.votes.indexOf(Math.max(...province.votes))]++;
  assert.deepEqual(wins, [2,36,0]);
  assert.equal(votes.overseas.reduce((a,b) => a+b,0),671366);
});

test('sumber dan nomor keputusan tercatat', () => {
  assert.match(votes.source.decision,/360/);
  assert.match(votes.source.transcription,/^https:\/\//);
});
