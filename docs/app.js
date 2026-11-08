
const _pfx='../'.repeat(Math.max(0,location.pathname.split('/').filter(Boolean).length-1));
let _phonesCache=null;
async function loadPhones(){if(_phonesCache)return _phonesCache;const r=await fetch(_pfx+'phones.json');_phonesCache=await r.json();return _phonesCache}
fetch(_pfx+'rates.json').then(r=>r.ok?r.json():null).then(j=>{if(j&&j.rates){Object.assign(RATES,j.rates);applyCur()}}).catch(()=>{});
const RATES={"PKR": 1, "INR": 0.342947, "BDT": 0.450215, "AED": 0.013281, "SAR": 0.013561, "QAR": 0.013163, "KWD": 0.001125, "OMR": 0.00139, "BHD": 0.00136, "USD": 0.003616, "GBP": 0.002696, "EUR": 0.003231, "TRY": 0.180968, "CNY": 0.024171, "JPY": 0.572815, "KRW": 4.860022, "RUB": 0.294422, "CAD": 0.005061, "AUD": 0.005186, "SGD": 0.004633, "MYR": 0.014743, "IDR": 65.600092, "THB": 0.122076, "PHP": 0.229705, "ZAR": 0.060092, "NGN": 4.867756, "KES": 0.470028, "EGP": 0.200235, "LKR": 1.202212, "NPR": 0.548701, "AFN": 0.235373, "ILS": 0.011442, "CHF": 0.002965, "VND": 93.187981, "MMK": 7.593517, "KHR": 14.851749, "UZS": 43.072069, "KZT": 1.637089, "TZS": 9.547681, "GHS": 0.042234, "MAD": 0.035522, "IQD": 5.487476, "JOD": 0.002564, "AZN": 0.006151, "GEL": 0.009386};
const SYM={PKR:'Rs ',INR:'₹',BDT:'৳',AED:'AED ',SAR:'SAR ',QAR:'QAR ',KWD:'KWD ',OMR:'OMR ',BHD:'BHD ',USD:'$',GBP:'£',EUR:'€',TRY:'₺',CNY:'¥',JPY:'¥',KRW:'₩',RUB:'₽',CAD:'CA$',AUD:'A$',SGD:'S$',MYR:'RM ',IDR:'Rp ',THB:'฿',PHP:'₱',ZAR:'R ',NGN:'₦',KES:'KSh ',EGP:'E£ ',LKR:'Rs ',NPR:'Rs ',AFN:'؋',ILS:'₪',CHF:'CHF ',VND:'₫',MMK:'Ks ',KHR:'៛',UZS:'UZS ',KZT:'₸',TZS:'TSh ',GHS:'GH₵',MAD:'MAD ',IQD:'IQD ',JOD:'JOD ',AZN:'₼',GEL:'₾'};
function fmtCur(pkrAmt,cur){const v=pkrAmt*RATES[cur];const dec=v>=100?0:(v>=1?2:3);return SYM[cur]+v.toLocaleString('en-US',{minimumFractionDigits:dec,maximumFractionDigits:dec})}
function curSel(){return localStorage.getItem('cur')||'PKR'}
function applyCur(){const cur=curSel();const sel=document.getElementById('cursel');if(sel)sel.value=cur;if(cur==='PKR')return;document.querySelectorAll('[data-pkr]').forEach(el=>{const amt=parseFloat(el.getAttribute('data-pkr'));if(isNaN(amt))return;el.innerHTML='<b class="pkrv">'+fmtCur(amt,cur)+'</b> <span class="usdv">Rs '+amt.toLocaleString('en-US')+'</span>'})}
document.addEventListener('DOMContentLoaded',()=>{applyCur();const sel=document.getElementById('cursel');if(sel)sel.addEventListener('change',()=>{localStorage.setItem('cur',sel.value);if(document.getElementById('cmp')){location.reload()}else{applyCur()}})});
function pkr(p){if(p.price_pkr==null)return p.unv?'Price not verified':'Price not announced';const cur=curSel();const ex=p.exp?' (Expected)':'';const lb=p.pl?' · '+p.pl:'';if(cur!=='PKR'&&RATES[cur])return fmtCur(p.price_pkr,cur)+' · Rs '+p.price_pkr.toLocaleString('en-PK')+ex+lb;return 'Rs '+p.price_pkr.toLocaleString('en-PK')+ex+' · $'+p.price.toLocaleString('en-US')+lb}
function doSearch(q){q=(q||'').toLowerCase();document.querySelectorAll('.card').forEach(c=>{c.style.display=c.dataset.name.includes(q)?'':'none'});heroLive(q)}
async function heroLive(q){const box=document.getElementById('hresults');if(!box)return;q=(q||'').trim().toLowerCase();if(q.length<2){box.innerHTML='';box.style.display='none';return}
 let phones;try{phones=await loadPhones()}catch(e){return}
 const hits=phones.filter(p=>(p.name+' '+p.brand+' '+p.cat).toLowerCase().includes(q)).slice(0,10);
 box.innerHTML='';
 if(!hits.length){const d=document.createElement('div');d.className='hrow hnone';d.textContent='No models found — try a brand or model name.';box.appendChild(d);box.style.display='block';return}
 hits.forEach(p=>{const a=document.createElement('a');a.className='hrow';a.href=_pfx+p.path;a.setAttribute('role','option');
  const l=document.createElement('span');const nm=document.createElement('b');nm.textContent=p.name;const br=document.createElement('span');br.className='hb';br.textContent=' '+p.brand+' · '+p.cat;l.appendChild(nm);l.appendChild(br);
  const pr=document.createElement('span');pr.className='hp';pr.textContent=(p.price_pkr==null)?(p.unv?'Price not verified':'Price not announced'):('Rs '+p.price_pkr.toLocaleString('en-PK')+(p.exp?' (Expected)':'')+(p.pl?' · '+p.pl:''));
  a.appendChild(l);a.appendChild(pr);box.appendChild(a)});
 box.style.display='block'}
document.addEventListener('DOMContentLoaded',()=>{const h=document.getElementById('hq');if(!h)return;h.addEventListener('focus',()=>{loadPhones().catch(()=>{})});
 document.addEventListener('click',e=>{const box=document.getElementById('hresults');if(box&&e.target!==h&&!box.contains(e.target)){box.style.display='none'}});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){const box=document.getElementById('hresults');if(box)box.style.display='none'}})});
document.addEventListener('click',e=>{const b=e.target.closest('.tabbtn');if(!b)return;document.querySelectorAll('.tabbtn').forEach(x=>x.classList.toggle('active',x===b));document.querySelectorAll('.tpanel').forEach(p=>p.classList.toggle('on',p.id===b.dataset.t))});
function heroSearch(e){e.preventDefault();const q=document.getElementById('hq').value;doSearch(q);const t=document.getElementById('allmodels');if(t)t.scrollIntoView({behavior:'smooth'});return false}
document.addEventListener('DOMContentLoaded',()=>{const q=new URLSearchParams(location.search).get('q');const h=document.getElementById('hq');if(q&&h){h.value=q;doSearch(q)}});
async function initCompare(){
 const selA=document.getElementById('selA'),selB=document.getElementById('selB');if(!selA)return;
 const brandA=document.getElementById('brandA'),brandB=document.getElementById('brandB');
 const phones=await loadPhones();
 let SP=null;async function specsOf(p){if(!SP){const r=await fetch(_pfx+'specs.json');SP=await r.json()}return SP[p.slug]||{}}
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
 async function render(){const a=phones.find(p=>p.slug===selA.value),b=phones.find(p=>p.slug===selB.value);if(!a||!b)return;
  const sa=await specsOf(a),sb=await specsOf(b);
  const keys=['Price','Brand','Category'];
  [sa,sb].forEach(s=>Object.keys(s).forEach(k=>{if(!keys.includes(k))keys.push(k)}));
  const val=(p,s,k)=>k==='Price'?pkr(p):k==='Brand'?p.brand:k==='Category'?p.cat:(s[k]||'-');
  document.getElementById('cmp').innerHTML=keys.map(k=>{const va=val(a,sa,k),vb=val(b,sb,k);return `<tr class="${va!==vb?'diff':''}"><th>${k}</th><td>${va}</td><td>${vb}</td></tr>`}).join('');
  document.getElementById('cmpHead').innerHTML=`<tr><th></th><th>${a.name}</th><th>${b.name}</th></tr>`;}
 selA.onchange=render;selB.onchange=render;render();}
document.addEventListener('DOMContentLoaded',initCompare);
function initFilters(){const grid=document.getElementById('catgrid');if(!grid)return;const fb=document.getElementById('fbrand'),fs=document.getElementById('fsort'),fc=document.getElementById('fcount');const cards=[...grid.children];
 function apply(){const b=fb.value;let vis=cards.filter(c=>!b||c.dataset.brand===b);const s=fs.value;const pv=c=>parseFloat(c.dataset.price)||Infinity;const arr=[...grid.children];
  arr.forEach(c=>c.style.display=vis.includes(c)?'':'none');
  const sorted=[...vis].sort((x,y)=>s==='plo'?pv(x)-pv(y):s==='phi'?pv(y)-pv(x):s==='az'?x.dataset.name.localeCompare(y.dataset.name):(parseInt(y.dataset.year)||0)-(parseInt(x.dataset.year)||0));
  sorted.forEach(c=>grid.appendChild(c));if(fc)fc.textContent=vis.length+' models';}
 fb.addEventListener('change',apply);fs.addEventListener('change',apply);apply();}
document.addEventListener('DOMContentLoaded',initFilters);
