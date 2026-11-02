
async function loadPhones(){const r=await fetch('phones.json');return r.json()}
function pkr(n){return 'Rs '+n.toLocaleString('en-PK')}
function doSearch(q){q=(q||'').toLowerCase();document.querySelectorAll('.card').forEach(c=>{c.style.display=c.dataset.name.includes(q)?'':'none'})}
async function initCompare(){
 const selA=document.getElementById('selA'),selB=document.getElementById('selB');if(!selA)return;
 const brandA=document.getElementById('brandA'),brandB=document.getElementById('brandB');
 const phones=await loadPhones();
 const brands=[...new Set(phones.map(p=>p.brand))].sort();
 const fillBrands=s=>{brands.forEach(b=>{const o=document.createElement('option');o.value=b;o.textContent=b;s.appendChild(o)})};
 const fillModels=(s,brand,val)=>{s.innerHTML='';phones.filter(p=>p.brand===brand).forEach(p=>{const o=document.createElement('option');o.value=p.slug;o.textContent=p.name+' ('+p.cat+')';s.appendChild(o)});if(val)s.value=val};
 fillBrands(brandA);fillBrands(brandB);
 const qs=new URLSearchParams(location.search);
 const pa=phones.find(p=>p.slug===qs.get('a'))||phones[0];
 const pb=phones.find(p=>p.slug===qs.get('b'))||phones.find(p=>p.brand!==pa.brand)||phones[1]||phones[0];
 brandA.value=pa.brand;brandB.value=pb.brand;
 fillModels(selA,pa.brand,pa.slug);fillModels(selB,pb.brand,pb.slug);
 brandA.onchange=()=>{fillModels(selA,brandA.value);render()};
 brandB.onchange=()=>{fillModels(selB,brandB.value);render()};
 function render(){const a=phones.find(p=>p.slug===selA.value),b=phones.find(p=>p.slug===selB.value);if(!a||!b)return;
  const keys=['Price in Pakistan','Brand','Category'];
  [a,b].forEach(p=>Object.keys(p.specs).forEach(k=>{if(!keys.includes(k))keys.push(k)}));
  const val=(p,k)=>k==='Price in Pakistan'?pkr(p.price):k==='Brand'?p.brand:k==='Category'?p.cat:(p.specs[k]||'-');
  document.getElementById('cmp').innerHTML=keys.map(k=>{const va=val(a,k),vb=val(b,k);return `<tr class="${va!==vb?'diff':''}"><th>${k}</th><td>${va}</td><td>${vb}</td></tr>`}).join('');
  document.getElementById('cmpHead').innerHTML=`<tr><th></th><th>${a.name}</th><th>${b.name}</th></tr>`;}
 selA.onchange=render;selB.onchange=render;render();}
document.addEventListener('DOMContentLoaded',initCompare);
