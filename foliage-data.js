// Shared 2026 foliage model, used by the route map's "Color by" and the mountains chapter.
// Columns are weeks starting Monday Sep 28 … Nov 30, 2026.
// Stages: 0 green · 1 early · 2 near peak · 3 peak · 4 past peak · 5 mostly bare.
// "y2026" follows the dated 2026 reports cited in the mountains chapter sources; "typical" follows the usual elevation rule
// (about one week earlier per 1,000 ft). Both are planning estimates, not observations.
window.FieldNotesFoliage={
 weeks:['Sep 28','Oct 5','Oct 12','Oct 19','Oct 26','Nov 2','Nov 9','Nov 16','Nov 23','Nov 30'],
 TRIP:6,
 stages:['Green','Early color','Near peak','Peak','Past peak','Mostly bare'],
 // Route-map towns → elevation band.
 townBand:{Charleston:'lowcountry',Greenville:'upstate',Brevard:'ashevalley',Asheville:'ashevalley',Linville:'highcountry','Blowing Rock':'highcountry',Boone:'highcountry',Floyd:'vaplateau',Roanoke:'roanoke'},
 bands:[
 {id:'peaks',state:'NC',name:'High Parkway & peaks',elev:'5,000–6,684 ft',typical:'2345555555',y2026:'1234555555',days:'Seen from overlooks only',
  places:'Graveyard Fields, Craggy Gardens, Mount Pisgah, Mount Mitchell',
  trip:'Bare by your visit. Heat delayed this band by about a week in 2026 and it still peaked in mid-October. Expect gray branches, dark spruce-fir crowns and very long views, with rime ice possible on cold mornings.'},
 {id:'highcountry',state:'NC',name:'High Country',elev:'3,000–4,500 ft',typical:'1234555555',y2026:'0123455555',days:'Tue Nov 10 · Wed Nov 11 morning',
  places:'Linville, Beacon Heights, Linn Cove Viaduct, Blowing Rock, Boone',
  trip:'Mostly past. Reports put peak “locked in” across the High Country around October 23. Look for the last russet oaks and tan beech leaves on lower slopes, plus green Fraser fir farms and rhododendron.'},
 {id:'vaplateau',state:'VA',name:'Virginia Blue Ridge plateau',elev:'2,500–3,500 ft',typical:'0123445555',y2026:'0012344555',days:'Wed Nov 11',
  places:'Fancy Gap, Mabry Mill, Rocky Knob, Floyd',
  trip:'Past peak, with some lingering color. Virginia State Parks reported southwest parks at or near peak on October 29 and higher Grayson Highlands already past. Oaks and roadside maples may still glow around Mabry Mill’s pond.'},
 {id:'ashevalley',state:'NC',name:'Asheville & Brevard valleys',elev:'2,000–2,500 ft',typical:'0012344555',y2026:'0011234455',days:'Mon Nov 9 · Tue Nov 10 morning',
  places:'Asheville, Brevard, Looking Glass Falls, Black Mountain',
  trip:'Just past peak and still colorful. On October 27 the Asheville report said the city had “about a week before it peaks,” which puts its peak around November 2. Expect plenty of orange and bronze in town and along US-276.'},
 {id:'ncfoothills',state:'NC',name:'NC foothills & I-40 / US-221',elev:'1,000–2,000 ft',typical:'0011233445',y2026:'0001123445',days:'Tue Nov 10 (highway connection)',
  places:'Old Fort, Marion, lower Linville Gorge, Chimney Rock',
  trip:'Possibly the best color of the trip. Spots below 2,000 ft were not expected to peak until early November. The highway bypass around the closed Parkway section runs straight through this band.'},
 {id:'upstate',state:'SC',name:'Upstate SC & the escarpment',elev:'1,000–3,200 ft',typical:'0012334455',y2026:'0001233445',days:'Sun Nov 8 evening · Mon Nov 9 morning',
  places:'Greenville, Falls Park, Caesars Head, Table Rock',
  trip:'Near peak. South Carolina’s foothills usually peak from late October to early November, and the warm 2026 autumn pushes that later. The climb up the Blue Ridge Escarpment toward Brevard should look good on Monday morning.'},
 {id:'roanoke',state:'VA',name:'Roanoke Valley',elev:'900–1,200 ft',typical:'0012334455',y2026:'0001233445',days:'Wed Nov 11 evening · Thu Nov 12',
  places:'Roanoke, Mill Mountain Star, Roanoke River',
  trip:'At or near peak. Lower southwest Virginia parks were already showing “excellent displays” on October 29, and the valley floor turns last. The view from the Mill Mountain Star should be at its best.'},
 {id:'lowcountry',state:'SC',name:'Lowcountry',elev:'Sea level',typical:'0000011233',y2026:'0000011233',days:'Sun Nov 8',
  places:'Charleston',
  trip:'Mostly green. Live oaks, palmettos and pines stay green all year, and sweetgum, red maple and bald cypress turn late in November and into December. Mountain color starts as you climb past Columbia.'}
 ]
};
