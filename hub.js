/* ---------- Social Quest hub: the units map ---------- */
const WORLDS=[
 {id:'u1',url:'u1/',em:'🧭',ch:'الْوَحْدَةُ الْأُولَى',title:'اتِّجَاهَاتُنَا تَرْسُمُ خُطُوَاتِنَا',color:'#0ea5e9',ready:false},
 {id:'u2',url:'u2/',em:'🏙️',ch:'الْوَحْدَةُ الثَّانِيَةُ',title:'مَدِينَتُنَا وَحَيَاتُنَا الْيَوْمِيَّةُ',color:'#8b5cf6',ready:true},
 {id:'u3',url:'u3/',em:'🇪🇬',ch:'الْوَحْدَةُ الثَّالِثَةُ',title:'مِصْرُ وَطَنُنَا',color:'#e11d48',ready:false},
 {id:'atlas',url:'atlas/',em:'🗺️',ch:'تَدْرِيبٌ عَلَى الْخَرَائِطِ',title:'أَطْلَسُ الْخَرَائِطِ',color:'#16a34a',ready:false}];
function worldBadges(id){const p=wprog(id),g=((P().grand||{})[id])||{};const won=Object.keys(g).length;return `${p.boss?'🏆':''}${won>=6?'👑':''}`}
function mapScreen(){const last=WORLDS.find(w=>w.id===S.lastWorld&&w.ready);
 return sayMe(`مَرْحَبًا ${NM()}! اخْتَرْ وَحْدَةً لِتَسْتَكْشِفَهَا.`,'wave')
 +(last?`<div class="center" style="margin:-4px 0 16px"><a class="btn big y" href="${last.url}" style="text-decoration:none;display:inline-block" onclick="hush();SFX.click()">▶ تَابِعْ: ${last.em} ${last.title}</a></div>`:'')
 +`<div class="card" style="margin-bottom:16px;display:flex;align-items:center;gap:14px;flex-wrap:wrap"><div style="font-size:54px">🏅</div><div style="flex:1"><h2>رَفُّ جَوَائِزِكَ</h2></div><div class="center"><div class="pts" style="color:#f5a500">⭐ ${ad(allStars())}</div><div style="font-weight:800">نَجْمَةً فِي كُلِّ الْوَحَدَاتِ</div></div></div>`
 +`<div class="worlds">${WORLDS.map(w=>{const body=`<div class="em ${w.ready?'bounce':''}">${w.em}</div><div><div style="font-size:19px;opacity:.95">${w.ch}</div><h2 style="color:#fff">${w.title}</h2><div style="margin-top:6px;font-weight:800">${w.ready?'⭐ '+ad(worldStars(w.id))+' نَجْمَةً '+worldBadges(w.id):'🔒 قَرِيبًا'}</div></div>`;
   return w.ready?`<a class="world" href="${w.url}" style="background:${w.color};text-decoration:none" onclick="hush();SFX.click()">${body}</a>`:`<div class="world lock" style="background:${w.color}">${body}</div>`}).join('')}</div>`}
