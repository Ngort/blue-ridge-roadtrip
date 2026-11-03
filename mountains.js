// Chapter six · The mountains: foliage calendar, route elevation profile, Parkway milepost strip, nature cards.
(() => {
const $=s=>document.querySelector(s);const $$=s=>[...document.querySelectorAll(s)];
const ext=(u,t)=>`<a href="${u}" target="_blank" rel="noopener">${t} ↗</a>`;

/* ---------- Foliage calendar (data in foliage-data.js) ---------- */
const {weeks,TRIP,stages,bands}=window.FieldNotesFoliage;
let season='y2026',stateFilter='all',activeBand='ashevalley';
function renderFoliage(){
 const rows=bands.filter(b=>stateFilter==='all'||b.state===stateFilter);
 if(!rows.some(b=>b.id===activeBand))activeBand=rows[0].id;
 $('#foliage-grid').innerHTML=`<div class="fg-row fg-head"><span></span>${weeks.map((w,i)=>`<span class="${i===TRIP?'trip':''}">${i===TRIP?'<b>Your trip</b>':''}${w}</span>`).join('')}</div>`+rows.map(b=>`<button type="button" class="fg-row${b.id===activeBand?' active':''}" data-band="${b.id}" aria-pressed="${b.id===activeBand}"><span class="fg-label"><b>${b.name}</b><small>${b.state} · ${b.elev}</small></span>${[...b[season]].map((s,i)=>`<span class="fg-cell s${s}${i===TRIP?' trip':''}" title="${b.name}, week of ${weeks[i]}: ${stages[s]}"></span>`).join('')}</button>`).join('');
 const grid=$('#foliage-grid'),keep=grid.dataset.scrolled?grid.scrollLeft:grid.scrollWidth;grid.scrollLeft=keep;if(grid.clientWidth)grid.dataset.scrolled=1;
 $$('#foliage-grid [data-band]').forEach(r=>r.onclick=()=>{activeBand=r.dataset.band;renderFoliage()});
 const b=bands.find(x=>x.id===activeBand),s=+b[season][TRIP];
 $('#foliage-detail').innerHTML=`<span class="stage-chip s${s}">${stages[s]} · week of Nov 9</span><h3>${b.name}</h3><p class="meta">${b.elev} · ${b.days}</p><p>${b.trip}</p><p class="fd-places"><strong>On or near the route:</strong> ${b.places}</p>`;
}
$$('[data-season]').forEach(x=>x.onclick=()=>{season=x.dataset.season;$$('[data-season]').forEach(y=>y.classList.toggle('selected',y===x));renderFoliage()});
$$('[data-fstate]').forEach(x=>x.onclick=()=>{stateFilter=x.dataset.fstate;$$('[data-fstate]').forEach(y=>y.classList.toggle('selected',y===x));renderFoliage()});
$('#foliage-legend').innerHTML=stages.map((s,i)=>`<span><i class="s${i}"></i>${s}</span>`).join('');
renderFoliage();

/* ---------- Route elevation profile (expected route) ----------
   Miles are approximate cumulative road miles; elevations are approximate town / site elevations. */
const stops=[
 {name:'Charleston',mi:0,ft:20,band:'lowcountry',days:['SUN'],key:1,label:'a',note:'Pick up the car and head inland. The Lowcountry is still green.'},
 {name:'Greenville',mi:210,ft:1000,band:'upstate',days:['SUN','MON'],key:1,label:'a',night:'Sun',note:'Foothill color near peak, with Falls Park in the morning.'},
 {name:'Brevard',mi:255,ft:2230,band:'ashevalley',days:['MON'],key:1,label:'b',note:'You climb about 1,200 ft up the Blue Ridge Escarpment to reach the valley.'},
 {name:'Looking Glass Falls',mi:262,ft:2300,band:'ashevalley',days:['MON'],note:'A 60-ft roadside waterfall on US-276 in Pisgah National Forest.'},
 {name:'Asheville',mi:300,ft:2134,band:'ashevalley',days:['MON','TUE'],key:1,label:'a',night:'Mon',note:'Valley color, just past peak around your visit.'},
 {name:'Marion (I-40 / US-221)',mi:335,ft:1400,band:'ncfoothills',days:['TUE'],key:1,label:'b',short:'Foothills',note:'The lowest point of the mountain days, and probably the brightest color. US-221 then climbs about 2,000 ft toward Linville.'},
 {name:'Linville',mi:370,ft:3670,band:'highcountry',days:['TUE'],key:1,label:'a',anchor:'end',note:'Gateway to Grandfather Mountain and the Linn Cove Viaduct.'},
 {name:'Beacon Heights',mi:375,ft:4205,band:'highcountry',days:['TUE'],note:'The trip’s high point: a short, rocky climb to bare granite with a 360° view.'},
 {name:'Blowing Rock',mi:392,ft:3566,band:'highcountry',days:['TUE'],key:1,label:'a',anchor:'start',night:'Tue',note:'Bass Lake loop and the town stroll. The High Country is mostly past peak.'},
 {name:'Boone',mi:400,ft:3333,band:'highcountry',days:['TUE','WED'],note:'Evening concert, and the High Country overnight option.'},
 {name:'Fancy Gap',mi:485,ft:2925,band:'vaplateau',days:['WED'],key:1,label:'b',note:'Join open Parkway sections in Virginia if conditions allow.'},
 {name:'Mabry Mill',mi:510,ft:2855,band:'vaplateau',days:['WED'],note:'Parkway milepost 176, with the mill and an easy ½-mile walk.'},
 {name:'Floyd',mi:518,ft:2500,band:'vaplateau',days:['WED'],key:1,label:'a',note:'Day stop on the expected route.'},
 {name:'Roanoke',mi:558,ft:940,band:'roanoke',days:['WED','THU'],key:1,label:'a',anchor:'end',night:'Wed',note:'The valley floor, at or near peak.'}
];
const stageColor=s=>`var(--stage-${s})`;
const bandStage=id=>+bands.find(b=>b.id===id).y2026[TRIP];
let profileDay='ALL',profileFocus=null;
function drawProfile(){
 const box=$('#route-profile');if(!box||box.clientWidth<1)return;
 const w=box.clientWidth,narrow=w<560,h=narrow?260:320,m={t:34,r:narrow?14:28,b:34,l:narrow?40:52};
 const x=d3.scaleLinear([0,560],[m.l,w-m.r]),y=d3.scaleLinear([0,4500],[h-m.b,m.t]);
 const svg=d3.select(box).selectAll('svg').data([0]).join('svg').attr('viewBox',`0 0 ${w} ${h}`).attr('height',h).attr('role','img').attr('aria-label','Elevation profile of the expected route from Charleston to Roanoke');svg.selectAll('*').remove();
 y.ticks(narrow?3:4).forEach(t=>{svg.append('line').attr('class','grid').attr('x1',m.l).attr('x2',w-m.r).attr('y1',y(t)).attr('y2',y(t));svg.append('text').attr('class','axis').attr('x',m.l-8).attr('y',y(t)+4).attr('text-anchor','end').text(t?d3.format(',')(t)+(narrow?'':' ft'):'0')});
 x.ticks(narrow?4:7).forEach(t=>svg.append('text').attr('class','axis').attr('x',x(t)).attr('y',h-m.b+20).attr('text-anchor','middle').text(t+' mi'));
 svg.append('path').attr('class','profile-area').attr('d',d3.area().x(d=>x(d.mi)).y0(y(0)).y1(d=>y(d.ft)).curve(d3.curveMonotoneX)(stops));
 const inDay=d=>profileDay==='ALL'||d.days.includes(profileDay);
 for(let i=1;i<stops.length;i++){const a=stops[i-1],b=stops[i],on=inDay(a)&&inDay(b);
  svg.append('path').attr('d',d3.line().x(d=>x(d.mi)).y(d=>y(d.ft)).curve(d3.curveMonotoneX)([a,b])).attr('fill','none').attr('stroke',stageColor(bandStage(b.band))).attr('stroke-width',on?5:2.5).attr('stroke-linecap','round').attr('opacity',on?1:.3)}
 stops.forEach(d=>{const on=inDay(d),g=svg.append('g').attr('class','profile-stop'+(d===profileFocus?' focus':'')).attr('transform',`translate(${x(d.mi)},${y(d.ft)})`).attr('tabindex',0).attr('role','button').attr('aria-label',`${d.name}, about ${d3.format(',')(d.ft)} feet`).attr('opacity',on?1:.35);
  g.append('circle').attr('r',d.night?7:d.key?5.5:4).attr('fill',d.night?'var(--forest)':stageColor(bandStage(d.band))).attr('stroke','var(--paper)').attr('stroke-width',2);
  if(d.key&&(!narrow||d.night||['Charleston','Roanoke','Marion (I-40 / US-221)'].includes(d.name))){const up=d.label!=='b';g.append('text').attr('class','profile-label').attr('y',up?-13:22).attr('text-anchor',d.anchor||'middle').text(narrow&&d.short?d.short:(d.short||d.name))}
  const pick=()=>{profileFocus=d;profileDetail(d);drawProfile()};g.on('click',pick).on('mouseenter',()=>profileDetail(d)).on('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pick()}})});
}
function profileDetail(d){const s=bandStage(d.band);$('#profile-detail').innerHTML=`<span class="stage-chip s${s}">${stages[s]}</span><h3>${d.name}</h3><p class="meta">≈ ${d3.format(',')(d.ft)} ft · mile ≈ ${d.mi} · ${d.days.join(' / ')}${d.night?` · ${d.night} night`:''}</p><p>${d.note}</p>`}
$$('[data-pday]').forEach(b=>b.onclick=()=>{profileDay=b.dataset.pday;$$('[data-pday]').forEach(x=>x.classList.toggle('selected',x===b));const first=stops.find(s=>profileDay==='ALL'||s.days.includes(profileDay));profileFocus=first;profileDetail(first);drawProfile()});
profileDetail(stops[5]);

/* ---------- Blue Ridge Parkway milepost strip ----------
   Elevations are approximate for each named point (summits noted separately); not a surveyed road profile. */
const mp=[
 {mp:0,ft:1909,name:'Rockfish Gap',state:'VA',kind:'end',note:'Northern end, where the Parkway meets Shenandoah National Park’s Skyline Drive.'},
 {mp:63.7,ft:649,name:'James River',state:'VA',kind:'ext',note:'The Parkway’s lowest point, at 649 ft.'},
 {mp:86,ft:2550,name:'Peaks of Otter',state:'VA',kind:'poi',note:'A lake and lodge beneath Sharp Top. Too far north for this trip.'},
 {mp:120.4,ft:2190,name:'Roanoke Mountain',state:'VA',kind:'poi',note:'A loop road above Roanoke, near the Mill Mountain spur and the Roanoke Star.'},
 {mp:169,ft:3100,name:'Rocky Knob',state:'VA',kind:'poi',note:'Open meadows and Rock Castle Gorge, just north of Mabry Mill.'},
 {mp:176.2,ft:2855,name:'Mabry Mill',state:'VA',kind:'you',day:'Wed',note:'An early-1900s gristmill and the most photographed place on the Parkway. Grounds walk about ½ mile. Bring food: restaurant and retail reopen in 2027.'},
 {mp:199.4,ft:2925,name:'Fancy Gap · US-52',state:'VA',kind:'you',day:'Wed',note:'A convenient place to join the Parkway on Wednesday. From here north to Mabry Mill is ungated as of November 2.'},
 {mp:216.9,ft:2600,name:'Virginia / North Carolina line',state:'NC',kind:'line',note:'217 miles in Virginia, 252 in North Carolina.'},
 {mp:217.5,ft:2885,name:'Cumberland Knob',state:'NC',kind:'poi',note:'Construction began near here on September 11, 1935.'},
 {mp:241,ft:3700,name:'Doughton Park',state:'NC',kind:'poi',note:'Long grassy ridges and a deer-and-hawk landscape.'},
 {mp:291.9,ft:3600,name:'Blowing Rock · US-321',state:'NC',kind:'you',day:'Tue',note:'Town access. There are sporadic single-lane work zones between MP 291.8 and 305.1.'},
 {mp:294,ft:3560,name:'Moses Cone Manor',state:'NC',kind:'poi',note:'A carriage-road estate with Bass Lake below it.'},
 {mp:297,ft:3400,name:'Price Lake',state:'NC',kind:'you',day:'Tue',note:'A 2.7-mile loop if you have spare daylight. Pick one lake walk.'},
 {mp:304.4,ft:4100,name:'Linn Cove Viaduct',state:'NC',kind:'you',day:'Tue',note:'A 1,243-ft concrete S-curve built around Grandfather Mountain so the boulder field beneath stayed intact. Its 1987 completion finished the Parkway. The visitor center is temporarily closed.'},
 {mp:305.2,ft:4205,name:'Beacon Heights',state:'NC',kind:'you',day:'Tue',note:'A short, rocky trail to granite slabs looking over Grandfather Mountain and the Linville Gorge country.'},
 {mp:316.4,ft:3250,name:'Linville Falls',state:'NC',kind:'poi',note:'The spur road is open, but the campground and picnic area are closed after Helene.'},
 {mp:344.2,ft:3300,name:'Closed · MP 344.2–355.3',state:'NC',kind:'closed',note:'Closed for Hurricane Helene repairs, with all recreation prohibited. Bypass it via I-40 / US-221.'},
 {mp:355.4,ft:5160,name:'Mount Mitchell (NC 128)',state:'NC',kind:'poi',note:'The 6,684-ft summit is the highest east of the Mississippi, reached by a 5-mile spur road.'},
 {mp:364.6,ft:5500,name:'Craggy Gardens',state:'NC',kind:'option',day:'Slow route',note:'A heath bald and a clear-weather option on the slower route. Check the road status first.'},
 {mp:382,ft:2200,name:'Folk Art Center · Asheville',state:'NC',kind:'you',day:'Mon',note:'Appalachian crafts on the edge of Asheville, and a good poor-weather stop.'},
 {mp:408.6,ft:4980,name:'Mount Pisgah',state:'NC',kind:'poi',note:'The 5,721-ft summit stands above the Pisgah Inn.'},
 {mp:418.8,ft:5120,name:'Graveyard Fields',state:'NC',kind:'poi',note:'A famous early-October color bowl, long past peak by November.'},
 {mp:431.4,ft:6053,name:'Richland Balsam',state:'NC',kind:'ext',note:'The Parkway’s highest point, at 6,053 ft, in spruce-fir forest.'},
 {mp:451.2,ft:5718,name:'Waterrock Knob',state:'NC',kind:'poi',note:'A sunset favorite above Maggie Valley.'},
 {mp:469,ft:2020,name:'Cherokee',state:'NC',kind:'end',note:'Southern end, at Great Smoky Mountains National Park.'}
];
const drives=[{from:176.2,to:199.4,label:'Wed'},{from:291.9,to:305.2,label:'Tue'}];
const views={all:[0,469],va:[0,217],nc:[216.9,469],wed:[166,206],tue:[287,320]};
let pwView='all',pwFocus=mp.find(d=>d.name==='Linn Cove Viaduct');
function drawParkway(){
 const box=$('#parkway-strip');if(!box||box.clientWidth<1)return;
 const w=box.clientWidth,narrow=w<560,h=narrow?270:310,m={t:46,r:narrow?12:24,b:58,l:narrow?40:52};
 const [d0,d1]=views[pwView],x=d3.scaleLinear([d0,d1],[m.l,w-m.r]).clamp(false),y=d3.scaleLinear([0,6500],[h-m.b,m.t]);
 const svg=d3.select(box).selectAll('svg').data([0]).join('svg').attr('viewBox',`0 0 ${w} ${h}`).attr('height',h).attr('role','img').attr('aria-label','Blue Ridge Parkway mileposts 0 to 469 with approximate elevations, your segments and the current closure');svg.selectAll('*').remove();
 const clip='pw-clip';svg.append('clipPath').attr('id',clip).append('rect').attr('x',m.l).attr('y',0).attr('width',w-m.l-m.r).attr('height',h);
 const body=svg.append('g').attr('clip-path',`url(#${clip})`);
 [['VIRGINIA',0,216.9,'va'],['NORTH CAROLINA',216.9,469,'nc']].forEach(([n,a,b,c])=>{body.append('rect').attr('class','pw-state '+c).attr('x',x(a)).attr('width',x(b)-x(a)).attr('y',m.t-30).attr('height',h-m.b-m.t+30);const cx=(Math.max(x(a),m.l)+Math.min(x(b),w-m.r))/2;if(Math.min(x(b),w-m.r)-Math.max(x(a),m.l)>90)body.append('text').attr('class','pw-state-label').attr('x',cx).attr('y',m.t-14).attr('text-anchor','middle').text(n)});
 body.append('rect').attr('class','pw-closed').attr('x',x(344.2)).attr('width',Math.max(3,x(355.3)-x(344.2))).attr('y',m.t-30).attr('height',h-m.b-m.t+30);
 y.ticks(3).forEach(t=>{svg.append('line').attr('class','grid').attr('x1',m.l).attr('x2',w-m.r).attr('y1',y(t)).attr('y2',y(t));svg.append('text').attr('class','axis').attr('x',m.l-8).attr('y',y(t)+4).attr('text-anchor','end').text(t?d3.format(',')(t)+(narrow?'':' ft'):'0')});
 const line=mp.filter(d=>d.kind!=='closed');
 body.append('path').attr('class','profile-area pw').attr('d',d3.area().x(d=>x(d.mp)).y0(y(0)).y1(d=>y(d.ft)).curve(d3.curveMonotoneX)(line));
 body.append('path').attr('class','pw-line').attr('d',d3.line().x(d=>x(d.mp)).y(d=>y(d.ft)).curve(d3.curveMonotoneX)(line));
 const base=h-m.b+12;
 body.append('line').attr('class','pw-axis').attr('x1',x(0)).attr('x2',x(469)).attr('y1',base).attr('y2',base);
 drives.forEach(s=>{body.append('line').attr('class','pw-drive').attr('x1',x(s.from)).attr('x2',x(s.to)).attr('y1',base).attr('y2',base);body.append('text').attr('class','pw-drive-label').attr('x',(x(s.from)+x(s.to))/2).attr('y',base+17).attr('text-anchor','middle').text(s.label)});
 x.ticks(narrow?4:8).forEach(t=>svg.append('text').attr('class','axis').attr('x',x(t)).attr('y',h-6).attr('text-anchor','middle').text('MP '+t));
 const placed=[[],[]],prio={you:0,ext:1,closed:1,line:2,option:2,end:3,poi:4};
 [...mp].sort((a,b)=>prio[a.kind]-prio[b.kind]).forEach(d=>{const px=x(d.mp);if(px<m.l-2||px>w-m.r+2)return;
  const g=body.append('g').attr('class','pw-mark '+d.kind+(d===pwFocus?' focus':'')).attr('transform',`translate(${px},${d.kind==='closed'?m.t+8:y(d.ft)})`).attr('tabindex',0).attr('role','button').attr('aria-label',`${d.name}, milepost ${d.mp}`);
  if(d.kind==='line')g.append('line').attr('y1',-8).attr('y2',8);
  else if(d.kind==='closed')g.append('path').attr('d',d3.symbol(d3.symbolCross,90)());
  else if(d.kind==='ext')g.append('path').attr('d',d3.symbol(d3.symbolTriangle,90)()).attr('transform',d.ft<1000?'rotate(180)':null);
  else g.append('circle').attr('r',d.kind==='you'?6:4.5);
  const label=d.kind==='closed'?'Closed':d.name.split(' · ')[0],tw=label.length*6.4+10;
  for(const row of [0,1]){const lx=Math.min(Math.max(px,m.l+tw/2),w-m.r-tw/2);if(placed[row].every(([a,b])=>lx+tw/2<a||lx-tw/2>b)){placed[row].push([lx-tw/2,lx+tw/2]);if(d.kind==='you'||d.kind==='ext'||d.kind==='closed'||!narrow||pwView!=='all')g.append('text').attr('class','pw-label').attr('x',lx-px).attr('y',row?20:-12).attr('text-anchor','middle').text(label);break}}
  const pick=()=>{pwFocus=d;parkwayDetail();drawParkway()};g.on('click',pick).on('mouseenter',()=>parkwayDetail(d)).on('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pick()}})});
}
function parkwayDetail(d=pwFocus){const tag={you:`On your route · ${d.day}`,option:d.day,closed:'Closed as of Nov 2',ext:'Parkway extreme',end:'Parkway terminus',line:'State line',poi:'Off your route'}[d.kind];$('#parkway-detail').innerHTML=`<span class="place-type">${tag} · MP ${d.mp}</span><h3>${d.name}</h3><p class="meta">≈ ${d3.format(',')(d.ft)} ft · ${d.state}</p><p>${d.note}</p>`}
$$('[data-pwview]').forEach(b=>b.onclick=()=>{pwView=b.dataset.pwview;$$('[data-pwview]').forEach(x=>x.classList.toggle('selected',x===b));drawParkway()});
parkwayDetail();

/* ---------- Nature along the route ---------- */
const nature=[
 ['rock','Mon · Brevard','The Blue Ridge Escarpment','Between Greenville and Brevard the land rises about 2,000 ft in a few miles. Moist air pushed up this wall makes it one of the rainiest places in the East, which is why Transylvania County calls itself the Land of Waterfalls.','On US-276 or US-25 north of Greenville; Caesars Head overlooks it.',null],
 ['rock','Mon · Pisgah','Looking Glass Rock','A granite dome that cooled underground about 390 million years ago and was laid bare by erosion. Water and ice on its face catch the sun like a mirror, which gave it its name.','Visible from US-276 and Parkway overlooks above Looking Glass Falls.','br-looking-glass'],
 ['forest','Mon–Thu · everywhere','Oaks hold on','Oaks are the last trees to turn, so mid-November slopes go russet, bronze and leather-brown rather than scarlet. American beech keeps its papery tan leaves well into winter.','Every mid-elevation slope; strongest around Asheville, Floyd and Roanoke.',null],
 ['november','Mon–Tue · streamsides','Witch hazel in flower','A November surprise: spidery yellow flowers open as the leaves fall, often on bare twigs. It is one of the last native shrubs to bloom.','Trail edges near Looking Glass Falls, Bass Lake and Mabry Mill.','br-witch-hazel'],
 ['forest','Mon–Tue · creeks & coves','Rhododendron thickets','Evergreen rhododendron and mountain laurel keep the understory green all winter. On freezing mornings rhododendron leaves curl tight and droop, so they work as a rough thermometer.','Looking Glass Falls, Linville area, Bass Lake.',null],
 ['november','Tue · I-40 / US-221','Helene’s mark','Hurricane Helene struck in September 2024. You will still see landslide scars, rebuilt roads and closed sites, including Parkway MP 344.2–355.3 and Crabtree Falls.','Asheville to Linville, especially the US-221 climb.',null],
 ['rock','Tue · Linville','Linville Gorge','The Linville River drops over Linville Falls into a gorge nearly 2,000 ft deep, often called the Grand Canyon of the East. It was among the first areas protected under the 1964 Wilderness Act.','Linville Falls spur, MP 316.4. The spur is open; the campground and picnic area are closed.','br-linville-gorge'],
 ['rock','Tue · Grandfather','Grandfather Mountain','Its 5,946-ft profile looks like an old man’s face. Geologically it is a “window”: erosion wore through a thrust sheet of billion-year-old rock and exposed younger rock beneath. It is also an international biosphere reserve.','Beacon Heights and the Linn Cove Viaduct wrap around its flank.','br-grandfather'],
 ['forest','Tue · high ridges','Spruce-fir islands','Above about 5,500 ft, red spruce and Fraser fir form a forest more like Canada’s. Fraser fir grows wild only in the southern Appalachians, and gray snags show where an invasive insect killed mature trees.','Grandfather Mountain’s upper slopes and the high peaks you’ll see from overlooks.',null],
 ['november','Tue–Wed · High Country','Christmas tree country','North Carolina is one of the top two Christmas-tree states, and Fraser fir from Avery, Watauga and Ashe counties dominates. Harvest usually starts in early November, so expect neat green rows and loaded trucks.','Linville, Banner Elk, Boone and US-221 toward Virginia.',null],
 ['wildlife','Tue–Wed · ridges','Ravens & winter birds','Common ravens tumble on the updrafts at cliffs like Beacon Heights. Dark-eyed juncos, which nest on the high peaks, drift lower in winter and flash white tail feathers along road edges.','Beacon Heights, Linn Cove, Parkway pull-offs.',null],
 ['wildlife','Every evening','Deer at dusk','November is the peak of the white-tailed deer rut, when deer move more and cross roads at dawn and dusk. Slow down on rural roads after 5pm, especially Sunday’s drive and the Floyd plateau.','Every leg after dark.',null],
 ['wildlife','Pisgah & the Parkway','Black bears','Bears are still feeding heavily before denning. Never leave food in sight in the car, and keep a respectful distance at overlooks.','Pisgah National Forest, the High Country, Rocky Knob.',null],
 ['wildlife','Streamsides','Salamander capital','The southern Appalachians hold more salamander species than anywhere else on Earth. Most stay hidden under logs and stones in the cold; leave rocks where they are.','Any mountain creek, including at Looking Glass Falls.',null],
 ['rock','Wed · Boone → Virginia','The New River','Often called one of the oldest rivers in North America, it is unusual for flowing north. Its forks start near Blowing Rock and Boone, and you cross the watershed on Wednesday.','US-221 / US-421 between Boone and the Virginia line.',null],
 ['november','Mon–Thu','Leaf-off views','Bare branches open views that summer foliage hides. Cold, dry November air also thins the famous blue haze, which comes from compounds the trees give off, so distant ridges look sharper.','Every overlook, especially Beacon Heights, the Star and Fancy Gap.',null]
];
const credits={};
fetch('assets/photo-credits.json').then(r=>r.ok?r.json():[]).then(all=>{(all.find(g=>g.slug==='blue-ridge')?.photos||[]).forEach(p=>credits[p.src]=p);renderNature()}).catch(()=>{});
const catName={rock:'Rocks & water',forest:'Forests & plants',wildlife:'Wildlife',november:'Only in November'};
function credit(p){if(!p)return'';const lic=p.licenseUrl?`<a href="${p.licenseUrl}" target="_blank" rel="noopener">${p.license}</a>`:p.license;return`<span class="photo-credit">Photo: ${p.author} · ${lic} · <a href="${p.sourceUrl}" target="_blank" rel="noopener">Original &amp; credit</a></span>`}
let natureFilter='all';
function renderNature(){$('#nature-list').innerHTML=nature.filter(n=>natureFilter==='all'||n[0]===natureFilter).map(n=>{const src=n[5]?`assets/photos/${n[5]}.jpg`:null,p=src&&credits[src];return`<article class="place-card nature-card${src?' has-photo':''}">${src?`<figure><img src="${src}" alt="${p?p.alt:n[2]}" loading="lazy" decoding="async"><figcaption>${credit(p)}</figcaption></figure>`:''}<span class="place-type">${catName[n[0]]} · ${n[1]}</span><h3>${n[2]}</h3><p>${n[3]}</p><p class="meta">Where: ${n[4]}</p></article>`}).join('')}
$$('[data-nature]').forEach(b=>b.onclick=()=>{natureFilter=b.dataset.nature;$$('[data-nature]').forEach(x=>x.classList.toggle('selected',x===b));renderNature()});
renderNature();

const draw=()=>{drawProfile();drawParkway();const g=$('#foliage-grid');if(g.clientWidth&&!g.dataset.scrolled){g.scrollLeft=g.scrollWidth;g.dataset.scrolled=1}};
new ResizeObserver(draw).observe($('#mountains'));draw();
})();
