
async function loadPhones(){const r=await fetch('phones.json');return r.json()}
function pkr(n){return 'Rs '+n.toLocaleString('en-PK')}
function doSearch(q){q=(q||'').toLowerCase();document.querySelectorAll('.card').forEach(c=>{c.style.display=c.dataset.name.includes(q)?'':'none'})}
async function initCompare(){
 const selA=document.getElementById('selA'),selB=document.getElementById('selB');if(!selA)return;
 const phones=await loadPhones();
 const fill=(s,v)=>{phones.forEach(p=>{const o=document.createElement('option');o.value=p.slug;o.textContent=p.name+' ('+p.cat+')';s.appendChild(o)});if(v)s.value=v};
 const qs=new URLSearchParams(location.search);fill(selA,qs.get('a'));fill(selB,qs.get('b'));
 function render(){const a=phones.find(p=>p.slug===selA.value),b=phones.find(p=>p.slug===selB.value);if(!a||!b)return;
  const keys=['Price in Pakistan','Brand','Category'];
  [a,b].forEach(p=>Object.keys(p.specs).forEach(k=>{if(!keys.includes(k))keys.push(k)}));
  const val=(p,k)=>k==='Price in Pakistan'?pkr(p.price):k==='Brand'?p.brand:k==='Category'?p.cat:(p.specs[k]||'-');
  document.getElementById('cmp').innerHTML=keys.map(k=>{const va=val(a,k),vb=val(b,k);return `<tr class="${va!==vb?'diff':''}"><th>${k}</th><td>${va}</td><td>${vb}</td></tr>`}).join('');
  document.getElementById('cmpHead').innerHTML=`<tr><th></th><th>${a.name}</th><th>${b.name}</th></tr>`;}
 selA.onchange=render;selB.onchange=render;if(selA.value&&selB.value)render();}
document.addEventListener('DOMContentLoaded',initCompare);
