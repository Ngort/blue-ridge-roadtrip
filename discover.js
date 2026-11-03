(async()=>{
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const list=document.querySelector('#discovery-list'),count=document.querySelector('#place-count');
try{
 const points=await fetch('discovery-points.json').then(r=>{if(!r.ok)throw Error('data');return r.json()});
 const names={town:'Route town',extra:'Optional alternative',nature:'Nature & overlooks',culture:'Art & culture',stay:'Place to stay',event:'Music & events',food:'Place to eat'};
 const symbols={town:'●',extra:'◆',nature:'▲',culture:'■',stay:'▣',event:'♫',food:'●'};let map,layer;const markers=new Map();
 if(window.L){map=L.map('discovery-map',{scrollWheelZoom:false}).setView([35.9,-81.4],7);L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);layer=(L.markerClusterGroup?L.markerClusterGroup({maxClusterRadius:32,showCoverageOnHover:false,iconCreateFunction:c=>L.divIcon({html:`<span aria-label="${c.getChildCount()} places; select to zoom">${c.getChildCount()}</span>`,className:"place-cluster",iconSize:[38,38]})}):L.layerGroup()).addTo(map)}
 else document.querySelector('#discovery-map').innerHTML='<p>Map library could not load. Every place is still linked below.</p>';
 let shown=[];
 const bounds=()=>{if(map&&shown.length)map.fitBounds(shown.map(p=>[p.lat,p.lon]),{padding:[35,35],maxZoom:11})};
 function render(){
 const q=document.querySelector('#place-search').value.toLowerCase().trim(),kind=document.querySelector('#place-kind').value;
 shown=points.filter(p=>(kind==='all'||kind===p.kind)&&`${p.name} ${p.description} ${p.town} ${p.searchAliases||""}`.toLowerCase().includes(q));
 if(layer)layer.clearLayers();markers.clear();
 for(const p of shown){if(!map)continue;
  const marker=L.marker([p.lat,p.lon],{icon:L.divIcon({html:symbols[p.kind],className:'place-pin kind-'+p.kind,iconSize:[32,32],iconAnchor:[16,16]}),title:p.name,alt:p.name,keyboard:true}).addTo(layer);
  marker.on('add',()=>marker.getElement()?.setAttribute('aria-label',p.name));marker.getElement()?.setAttribute('aria-label',p.name);
  marker.bindTooltip(p.name,{direction:'top',offset:[0,-12]});
  marker.bindPopup(`${p.photo?`<img src="${esc(p.photo.src)}" alt="${esc(p.photo.alt)}">`:''}<span>${esc(names[p.kind])}</span><strong>${esc(p.name)}</strong><p>${esc(p.description)}</p>${/approx|interpol/i.test(p.coordinatePrecision||"")?`<p class="pin-precision">Approximate street-address location; check the venue address for arrival.</p>`:""}<a href="${esc(p.url)}">Open ${esc(points.find(x=>x.id===p.town)?.name||p.town.replaceAll('-',' '))} guide →</a>`,{maxWidth:270});markers.set(p.id,marker);
 }
 list.innerHTML=shown.map(p=>`<article class="discovery-item"><span class="eyebrow">${symbols[p.kind]} ${names[p.kind]}</span><h2><a href="${esc(p.url)}">${esc(p.name)} →</a></h2><p>${esc(p.description)}</p>${map?`<button type="button" class="pin-zoom" data-place="${esc(p.id)}">Find on map</button>`:''}</article>`).join('');
 count.textContent=shown.length?`${shown.length} ${shown.length === 1 ? "place" : "places"} to explore`:'No matching places. Try another name or category.';
 list.querySelectorAll('[data-place]').forEach(b=>b.onclick=()=>{const p=shown.find(x=>x.id===b.dataset.place);map.setView([p.lat,p.lon],12);if(layer.zoomToShowLayer)layer.zoomToShowLayer(markers.get(p.id),()=>markers.get(p.id).openPopup());else markers.get(p.id).openPopup();document.querySelector('#discovery-map').scrollIntoView({behavior:'smooth',block:'center'})});
 }
 document.querySelector('#point-sources').innerHTML=points.map(p=>`<a href="${esc(p.coordinateSource)}" target="_blank" rel="noopener">${esc(p.name)}</a>`).join('');
 document.querySelector('#place-search').addEventListener('input',render);document.querySelector('#place-kind').addEventListener('change',()=>{render();bounds()});document.querySelector('#fit-map').onclick=bounds;
 render();bounds();
}catch(e){count.textContent='The place list could not load. Browse the town guides using the navigation above.';}
})();
