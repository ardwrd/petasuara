import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const data = JSON.parse(readFileSync(new URL('../data/dpr-ri-2024.json', import.meta.url),'utf8'));
test('rekap DPR RI meliputi 18 partai yang unik',()=>{
 assert.equal(data.parties.length,18);
 assert.equal(new Set(data.parties.map(p=>p.number)).size,18);
 assert.ok(data.parties.every(p=>Number.isInteger(p.votes)&&p.votes>=0));
});
test('total suara sesuai Lampiran KPU 1204/2024',()=>{
 assert.equal(data.parties.reduce((n,p)=>n+p.votes,0),151793293);
 assert.equal(data.totalValidVotes,151793293);
 assert.equal(data.coverage,'nasional');
});
