import { geoMercator, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
// Resolve JSON against the module directory in both branch mode (/src)
// and the Vite build (/assets), so either deployment source works.
async function readJson(path) {
  const response = await fetch(new URL(path, import.meta.url));
  if (!response.ok) throw new Error('Failed to load ' + path + ': HTTP ' + response.status);
  return response.json();
}

const [presidential, parties, topology] = await Promise.all([
  readJson('../data/pilpres-2024.json'),
  readJson('../data/dpr-ri-2024.json'),
  readJson('../data/indonesia-38-provinces.topo.json')
]);

const $ = id => document.getElementById(id);
const fmt = new Intl.NumberFormat('id-ID');
const provinceData = new Map(presidential.provinces.map(p => [p.name,p]));
const geometries = feature(topology,topology.objects['indonesia-38-prov-topo']).features;
const mapProjection = geoMercator().fitExtent([[12,24],[1028,476]],{type:'FeatureCollection',features:geometries});
const path = geoPath(mapProjection);
const state = {mode:'pilpres', metric:'winner', selected:null, hovered:null};
const svg = $('map');
const elements = new Map();
const provinceSelect = $('province-select');
for (const name of [...provinceData.keys()].sort((a,b) => a.localeCompare(b,'id'))) {
  const option = document.createElement('option');
  option.value = name;
  option.textContent = name;
  provinceSelect.append(option);
}
function centerProvinceInView(name) {
  const area = elements.get(name);
  const scroller = $('map-scroll');
  if (!area || scroller.scrollWidth <= scroller.clientWidth) return;
  const b = area.getBBox();
  const x = (b.x + b.width / 2) * scroller.scrollWidth / 1040;
  scroller.scrollTo({
    left: Math.max(0, x - scroller.clientWidth / 2),
    behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
  });
}
const sum = data => data.reduce((a,b)=>a+b,0);
const pct = (n,d) => d ? (100*n/d).toLocaleString('id-ID',{minimumFractionDigits:1,maximumFractionDigits:1})+'%' : '0%';
function element(tag,cls,text) { const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node; }
function mix(hex,factor) {
  const raw=hex.slice(1);
  return '#'+[0,2,4].map(i=>Math.round(246*(1-factor)+parseInt(raw.slice(i,i+2),16)*factor).toString(16).padStart(2,'0')).join('');
}
function areaColor(name) {
  if(state.mode==='dpr')return '#e0e5df';
  const values=provinceData.get(name)?.votes;
  if(!values)return '#d0d8d2';
  if(state.metric==='winner')return presidential.candidates[values.indexOf(Math.max(...values))].color;
  const candidate=Number(state.metric);
  return mix(presidential.candidates[candidate].color,.16+.84*values[candidate]/sum(values));
}
function clearProvinceSelection() {
  if(state.mode!=='pilpres'||!state.selected)return;
  state.selected=null;
  state.hovered=null;
  render();
}
function selectProvince(name) {
  if(state.mode==='dpr')return;
  if(state.selected===name){clearProvinceSelection();return;}
  state.selected=name;state.hovered=null;render();
}
for(const geometry of geometries) {
  const name=geometry.properties.PROVINSI;
  const area=document.createElementNS('http://www.w3.org/2000/svg','path');
  area.setAttribute('d',path(geometry)||'');
  area.setAttribute('class','province');
  area.setAttribute('role','button');area.setAttribute('tabindex','0');
  area.setAttribute('aria-label','Tampilkan hasil '+name);
  const tip=document.createElementNS('http://www.w3.org/2000/svg','title');
  tip.textContent=name;area.append(tip);
  area.addEventListener('pointerenter',()=>{if(state.mode==='pilpres'){state.hovered=name;renderStats();updateMap();}});
  area.addEventListener('pointerleave',()=>{state.hovered=null;renderStats();updateMap();});
  area.addEventListener('click',()=>selectProvince(name));
  area.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();selectProvince(name);}});
  svg.append(area);elements.set(name,area);
}
function updateMap() {
  for(const [name,area] of elements) {
    area.style.fill=areaColor(name);
    area.classList.toggle('picked',state.mode==='pilpres'&&(state.hovered||state.selected)===name);
    area.setAttribute('aria-pressed',String(state.mode==='pilpres'&&state.selected===name));
    area.setAttribute('aria-disabled',String(state.mode==='dpr'));
    area.tabIndex=state.mode==='dpr'?-1:0;
  }
}
function resultLine(name,votes,totalVotes,color,number) {
  const root=element('div','result-line');
  const top=element('div','result-top');
  const label=element('span','result-label');
  const mark=element('span','mark');mark.style.backgroundColor=color;
  label.append(mark,element('span','number',String(number).padStart(2,'0')),element('span','party-name',name));
  top.append(label,element('strong','percent',pct(votes,totalVotes)));
  const bar=element('div','bar');const fill=element('div','bar-fill');
  fill.style.width=(totalVotes?100*votes/totalVotes:0)+'%';fill.style.backgroundColor=color;bar.append(fill);
  root.append(top,bar,element('span','count',fmt.format(votes)+' suara'));
  return root;
}
function renderStats(){
  if(state.mode==='dpr'){
    $('results-kicker').textContent='HASIL DPR RI 2024';
    $('region-name').textContent='Suara partai nasional';
    $('results-help').textContent='18 partai · seluruh Indonesia';
    $('total-label').textContent='TOTAL SUARA SAH DPR RI';
    $('total-count').textContent=fmt.format(parties.totalValidVotes);
    $('vote-results').replaceChildren(...[...parties.parties].sort((a,b)=>b.votes-a.votes).map(p=>resultLine(p.name,p.votes,parties.totalValidVotes,'#9781d8',p.number)));
    $('data-note').textContent='Data suara partai per provinsi belum tersedia di PetaSuara. Peta tidak diberi warna hasil partai.';
    return;
  }
  const row=provinceData.get(state.hovered||state.selected);
  const votes=row?row.votes:presidential.national;
  const all=sum(votes);
  $('results-kicker').textContent='HASIL PILPRES 2024';
  $('region-name').textContent=row?row.name:'Seluruh Indonesia';
  $('results-help').textContent=row?'Rincian perolehan suara sah provinsi':'Ringkasan suara sah nasional';
  $('total-label').textContent='TOTAL SUARA SAH';
  $('total-count').textContent=fmt.format(all);
  $('vote-results').replaceChildren(...presidential.candidates.map((p,i)=>resultLine(p.name,votes[i],all,p.color,p.number)));
  $('data-note').textContent=row?'Klik lagi provinsi yang sama untuk kembali ke data nasional.':'Jumlah nasional termasuk suara luar negeri.';
}
function renderLegend(){
  const container=$('legend');container.replaceChildren();
  const entries=state.mode==='dpr'?[['Peta netral (data wilayah belum ada)','#e0e5df']]:presidential.candidates.map(p=>[p.name,p.color]);
  entries.forEach(([name,color])=>{const label=element('span','legend-label');const mark=element('i','legend-dot');mark.style.backgroundColor=color;label.append(mark,element('span','',name));container.append(label);});
}
function render(){
  document.querySelectorAll('[data-mode]').forEach(tab=>{
    const active=tab.dataset.mode===state.mode;
    tab.classList.toggle('active',active);tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;
  });
  $('metric').disabled=state.mode==='dpr';
  provinceSelect.disabled=state.mode==='dpr';
  provinceSelect.value=state.selected||'';
  $('clear-selection').hidden=state.mode!=='pilpres'||!state.selected;
  $('map-title').textContent=state.mode==='pilpres'?'Persebaran suara Pilpres':'Hasil suara DPR RI nasional';
  $('map-hint').textContent=state.mode==='pilpres'?'Pilih provinsi atau geser peta pada layar kecil untuk menjelajahi wilayah.':'Perolehan suara partai per provinsi belum dimuat. Peta ditampilkan netral.';
  $('source-tag').textContent=state.mode==='pilpres'?'KPU · 360/2024':'KPU · 1204/2024';
  $('kpu-link').href=state.mode==='pilpres'?'https://jdih.kpu.go.id/':parties.source.url;
  updateMap();renderLegend();renderStats();
}
provinceSelect.addEventListener('change', (event) => {
  if (!event.target.value) clearProvinceSelection();
  else { selectProvince(event.target.value); centerProvinceInView(event.target.value); }
});
document.querySelectorAll('[data-mode]').forEach(button=>{
  button.addEventListener('click',()=>{state.mode=button.dataset.mode;state.selected=null;state.hovered=null;render();});
  button.addEventListener('keydown',event=>{
    if(event.key==='ArrowLeft'||event.key==='ArrowRight'){
      event.preventDefault();
      const other=document.querySelector('[data-mode="'+(button.dataset.mode==='pilpres'?'dpr':'pilpres')+'"]');
      other.click();other.focus();
    }
  });
});
$('metric').addEventListener('change',event=>{state.metric=event.target.value;render();});
$('clear-selection').addEventListener('click',clearProvinceSelection);
document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&state.mode==='pilpres'&&state.selected){
    clearProvinceSelection();
  }
});
render();
