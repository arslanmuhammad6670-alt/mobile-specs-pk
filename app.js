
async function loadPhones(){const r=await fetch('phones.json');return r.json()}
function pkr(n){return 'Rs '+n.toLocaleString('en-PK')}
function doSearch(q){q=(q||'').toLowerCase();document.querySelectorAll('.card').forEach(c=>{c.style.display=c.dataset.name.includes(q)?'':'none'})}
async function initCompare(){
 const selA=document.getElementById('selA'),selB=document.getElementById('selB');if(!selA)return;
 const phones=await loadPhones();
 const fill=(s,v)=>{phones.forEach(p=>{const o=document.createElement('option');o.value=p.slug;o.textContent=p.name;s.appendChild(o)});if(v)s.value=v};
 const qs=new URLSearchParams(location.search);fill(selA,qs.get('a'));fill(selB,qs.get('b'));
 const rows=[['Price in Pakistan',p=>pkr(p.price)],['Brand',p=>p.brand],['Launch Year',p=>p.year],['Network',p=>p.network],['Display',p=>p.display],['Chipset',p=>p.chipset],['RAM',p=>p.ram],['Storage',p=>p.storage],['Main Camera',p=>p.maincam],['Selfie Camera',p=>p.selfie],['Battery',p=>p.battery+' mAh'],['Charging',p=>p.charging],['OS',p=>p.os],['Weight',p=>p.weight+' g'],['Colors',p=>p.colors]];
 function render(){const a=phones.find(p=>p.slug===selA.value),b=phones.find(p=>p.slug===selB.value);if(!a||!b)return;
  document.getElementById('cmp').innerHTML=rows.map(r=>{const va=r[1](a),vb=r[1](b);return `<tr class="${va!==vb?'diff':''}"><th>${r[0]}</th><td>${va}</td><td>${vb}</td></tr>`}).join('');
  document.getElementById('cmpHead').innerHTML=`<tr><th></th><th>${a.name}</th><th>${b.name}</th></tr>`;}
 selA.onchange=render;selB.onchange=render;if(selA.value&&selB.value)render();}
document.addEventListener('DOMContentLoaded',initCompare);
