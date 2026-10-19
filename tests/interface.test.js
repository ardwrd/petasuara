import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = p => readFileSync(new URL(p,import.meta.url),'utf8');

test('antarmuka data-first tanpa ornamen yang mengalahkan peta',()=>{
  const html=read('../index.html');
  const css=read('../src/styles.css');
  assert.match(html,/id="map-scroll"/);
  assert.match(html,/id="province-select"/);
  assert.match(html,/id="map"/);
  assert.doesNotMatch(html,/hero-side|logo-icon|watermark|year-mark/);
  assert.doesNotMatch(css,/box-shadow:|linear-gradient\(/);
});

test('peta mobile bisa digeser, ada pilihan provinsi, dan data resmi tetap terhubung',()=>{
  const css=read('../src/styles.css');
  const js=read('../src/main.js');
  assert.match(css,/@media \(max-width: 600px\)/);
  assert.match(css,/overflow-x: auto/);
  assert.match(css,/#map \{ width: 700px; min-width: 700px;/);
  assert.match(js,/provinceSelect.addEventListener\('change'/);
  assert.match(js,/centerProvinceInView/);
  assert.match(js,/provinceSelect.disabled=state.mode==='dpr'/);
  assert.match(js,/readJson\('\.\.\/data\/pilpres-2024\.json'\)/);
});
