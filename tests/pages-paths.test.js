import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

function read(path) { return readFileSync(new URL(path, import.meta.url), 'utf8'); }

test('root HTML exposes styles and JavaScript with relative URLs', () => {
  const html = read('../index.html');
  assert.match(html, /href="\.\/src\/styles\.css"/);
  assert.match(html, /src="\.\/src\/main\.js"/);
  assert.doesNotMatch(html, /src="\/src\/main\.js"/);
  assert.match(html, /type="importmap"/);
  assert.match(html, /d3-geo/);
  assert.match(html, /topojson-client/);
});

test('built site ships JSON to the same parent-relative URL layout', () => {
  const config = read('../vite.config.js');
  const main = read('../src/main.js');
  assert.match(config, /base: '\/petasuara\/'/);
  assert.match(config, /target: 'es2022'/);
  for (const file of ['pilpres-2024.json','dpr-ri-2024.json','indonesia-38-provinces.topo.json']) {
    assert.ok(config.includes(file), 'dist/data missing '+file);
    assert.ok(main.includes(file), 'src missing '+file);
  }
  assert.match(main, /fetch\(new URL\(path, import\.meta\.url\)\)/);
});
