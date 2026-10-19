import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const js = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const start = js.indexOf('function clearProvinceSelection()');
const end = js.indexOf('for(const geometry of geometries)', start);
assert.ok(start>=0 && end>start, 'selection handlers exist');

function harness() {
  const state={mode:'pilpres',metric:'winner',selected:null,hovered:null};
  let renders=0;
  const context=vm.createContext({state,render(){renders++}});
  const handlers=vm.runInContext(js.slice(start,end)+'\n({clearProvinceSelection,selectProvince})',context);
  return {state,handlers,get renders(){return renders}};
}
test('province selection can be cleared without changing the mode or metric',()=>{
  const h=harness();
  h.handlers.selectProvince('Jawa Tengah');
  assert.equal(h.state.selected,'Jawa Tengah');
  h.state.hovered='Jawa Timur';
  h.handlers.clearProvinceSelection();
  assert.equal(h.state.selected,null);
  assert.equal(h.state.hovered,null);
  assert.equal(h.state.mode,'pilpres');
  assert.equal(h.renders,2);
});
test('selecting the same province again resets to national totals',()=>{
  const h=harness();
  h.handlers.selectProvince('Bali');
  h.handlers.selectProvince('Bali');
  assert.equal(h.state.selected,null);
});
test('national reset does not change DPR mode',()=>{
  const h=harness();
  h.state.mode='dpr';
  h.handlers.selectProvince('Bali');
  h.handlers.clearProvinceSelection();
  assert.equal(h.state.selected,null);
  assert.equal(h.renders,0);
});
test('reset control exists, is initially hidden and has a keyboard handler',()=>{
  assert.match(html,/id="clear-selection"[^>]*hidden>/);
  assert.match(js,/\$\('clear-selection'\)\.hidden=state\.mode/);
  assert.match(js,/event\.key==='Escape'/);
  assert.match(js,/addEventListener\('click',clearProvinceSelection\)/);
});
