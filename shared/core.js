/* ---------- Double-S Social Quest: Arabic-only engine (RTL) ---------- */
const K='socialQuest_v1';
let S=null;try{S=JSON.parse(localStorage.getItem(K))}catch(e){}
if(!S||!S.players)S={players:{},cur:null,voice:true};
if(S.rateAr==null)S.rateAr=.9;if(S.sfx==null)S.sfx=true;if(S.voice==null)S.voice=true;
function save(){try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}}
const P=()=>S.players[S.cur];
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const NM=()=>P()?esc(P().name):'صَدِيقِي';
/* spoken name: the twins' names are read in Arabic */
const SPN=()=>{if(!P())return '';const x=P().name.trim().toLowerCase();if(/^(selim|salim|سليم|سَلِيم)/.test(x))return 'سَلِيمُ';if(/^(sajid|sajed|ساجد|سَاجِد)/.test(x))return 'سَاجِدُ';return P().name};
const YA=()=>SPN()?'يَا '+SPN():'';
const PN=SPN;
const calm=()=>!P()||P().mode!=='challenge';
const ad=n=>String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
const noTash=s=>String(s).replace(/[ً-ْٰ]/g,'');
const PAGE=window.SQ_PAGE||'hub',HUB=window.SQ_HUB||'./';
let WORLD=null,ORDER=[],ACT={},GAMES=[],ROUNDS=[];
function initWorld(W){WORLD=W;ORDER=W.lessons.flatMap(l=>l.acts);ACT=Object.fromEntries([...ORDER,...W.free].map(a=>[a[0],a]));GAMES=W.games||[];ROUNDS=W.rounds||[];breakBag=[];ACT.grand=['grand','grand',W.grandTitle||'التَّحَدِّي الْكَبِيرُ','🏆']}
const wprog=wid=>{const p=(P()&&P().prog)||{};const v=p[wid];return v&&typeof v==='object'?v:{}};
const prog=id=>wprog(WORLD.id)[id]||0;
function unlocked(id){if(ACT[id][1]==='flash'||P().unlockAll)return true;const i=ORDER.findIndex(a=>a[0]===id);if(i<=0||prog(id)>0)return true;let j=i-1;while(j>0&&ORDER[j][1]==='words')j--;return prog(ORDER[j][0])>0}
const worldStars=wid=>Object.values(wprog(wid)).reduce((a,b)=>a+(+b||0),0);
const allStars=()=>Object.keys((P()&&P().prog)||{}).reduce((a,x)=>a+worldStars(x),0);
const totalStars=()=>WORLD?worldStars(WORLD.id):allStars();
function award(id,st){const p=P();p.prog=p.prog||{};if(typeof p.prog[WORLD.id]!=='object'||!p.prog[WORLD.id])p.prog[WORLD.id]={};const w=p.prog[WORLD.id];w[id]=Math.max(w[id]||0,st);save()}
const starStr=n=>'★'.repeat(n)+'☆'.repeat(3-n);
function goHub(){if(PAGE==='hub')go('map');else{hush();try{sessionStorage.setItem('sqBack','1')}catch(e){}location.href=HUB}}
function goHome(){if(PAGE==='hub')go('map');else go('world')}

/* ---------- game sounds: rendered to WAV and played with <audio> ---------- */
const SR=22050,TAU=Math.PI*2,SND={};
function wavURL(d){const n=d.length,b=new ArrayBuffer(44+n*2),v=new DataView(b),W=(o,s)=>{for(let i=0;i<s.length;i++)v.setUint8(o+i,s.charCodeAt(i))};W(0,'RIFF');v.setUint32(4,36+n*2,true);W(8,'WAVE');W(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,SR,true);v.setUint32(28,SR*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);W(36,'data');v.setUint32(40,n*2,true);for(let i=0;i<n;i++)v.setInt16(44+i*2,Math.max(-1,Math.min(1,d[i]))*32767,true);return URL.createObjectURL(new Blob([b],{type:'audio/wav'}))}
function mk(name,dur,fn){try{const n=Math.floor(SR*dur),d=new Float32Array(n);let mx=0;for(let i=0;i<n;i++){d[i]=fn(i/SR);mx=Math.max(mx,Math.abs(d[i]))}if(mx>0)for(let i=0;i<n;i++)d[i]=d[i]/mx*.92;const fade=Math.min(n,400);for(let i=0;i<fade;i++)d[n-1-i]*=i/fade;SND[name]=wavURL(d)}catch(e){}}
function buildSounds(){
 mk('click',.07,t=>Math.sin(TAU*900*t)*Math.exp(-t*60));
 mk('good',.45,t=>{const s=t<.13?0:1,f=s?988:659,tt=s?t-.13:t;return (Math.sin(TAU*f*t)+.3*Math.sin(TAU*2*f*t))*Math.exp(-tt*9)});
 mk('bad',.4,t=>Math.sign(Math.sin(TAU*(190-80*t)*t))*.5*Math.exp(-t*5));
 mk('star',.8,t=>{const k=Math.min(3,Math.floor(t/.11)),f=[523,659,784,1047][k],tt=t-k*.11;return (Math.sin(TAU*f*t)+.4*Math.sin(TAU*2*f*t))*Math.exp(-tt*5)});
 mk('drum',.9,t=>{const ph=55*t+95/18*(1-Math.exp(-18*t));return Math.sin(TAU*ph)*Math.exp(-t*4.5)+(Math.random()*2-1)*.35*Math.exp(-t*45)});
 mk('tri',2.4,t=>(Math.sin(TAU*1250*t)+.55*Math.sin(TAU*2710*t)+.3*Math.sin(TAU*4180*t))*Math.exp(-t*1.5)*(1-Math.exp(-t*400)));
 let ph=0;mk('siren',1.3,t=>{ph+=TAU*(620+180*Math.sin(TAU*2.5*t))/SR;return Math.sign(Math.sin(ph))*.6+Math.sin(ph*2)*.3});
 let y=0;mk('boom',.7,t=>{y+=((Math.random()*2-1)-y)*.08;return y*2.5*Math.exp(-t*7)+Math.sin(TAU*58*t)*Math.exp(-t*5)});
 mk('zap',.5,t=>Math.sin(TAU*(900+2600*t)*t)*Math.exp(-t*5)*.6);
 mk('ruler',3.2,t=>(Math.sin(TAU*82*t)+.6*Math.sin(TAU*164*t)+.25*Math.sign(Math.sin(TAU*82*t)))*Math.exp(-t*1.3)*(1-Math.exp(-t*300)));
 mk('band',2.6,t=>(Math.sin(TAU*118*t)+.5*Math.sin(TAU*236*t)+.25*Math.sin(TAU*354*t))*Math.exp(-t*1.7)*(1-Math.exp(-t*300)));
 [147,196,247,294].forEach((f,i)=>{const N=Math.round(SR/f);let buf=new Float32Array(N).map(()=>Math.random()*2-1);for(let r=0;r<3;r++)for(let j=1;j<N;j++)buf[j]=(buf[j]+buf[j-1])/2;let k=0;mk('oud'+i,3,()=>{const x=buf[k%N],y=buf[(k+1)%N];buf[k%N]=(x+y)/2*.997;k++;return x})});
 let ph2=0;mk('whoosh',.9,t=>{ph2+=TAU*(300+500*t)/SR;return Math.sin(ph2)*Math.sin(Math.PI*t/.9)*.5});
}
buildSounds();
function play(name,vol=1){if(!S.sfx||!SND[name])return null;try{const a=new Audio(SND[name]);a.volume=Math.max(0,Math.min(1,vol));const p=a.play();if(p&&p.catch)p.catch(()=>{});return a}catch(e){return null}}
const SFX={good:()=>play('good',.55),bad:()=>play('bad',.3),star:()=>play('star',.6),click:()=>play('click',.25)};

/* ---------- voice (Arabic only) ---------- */
const VO={ar:null};
function voicesFor(L){try{return speechSynthesis.getVoices().filter(v=>v.lang&&v.lang.toLowerCase().startsWith(L))}catch(e){return[]}}
function vScore(v){return(/natural|neural/i.test(v.name)?20:0)+(/online/i.test(v.name)?8:0)+(/google/i.test(v.name)?6:0)+(/salma|shakir|zariyah|hamed|fatima|amany/i.test(v.name)?4:0)+(/eg/i.test(v.lang)?3:0)+(v.localService?0:2)}
function pickVoices(){const c=voicesFor('ar');VO.ar=c.find(v=>v.name===S.v_ar)||c.sort((a,b)=>vScore(b)-vScore(a))[0]||null}
const isNat=v=>!!v&&/natural|neural|online|google/i.test(v.name);
function voiceNote(){if(VLOAD.done&&Object.keys(AUD).length>50)return `<div class="vnote ok">🎙️ الْأَصْوَاتُ الْمُسَجَّلَةُ تَعْمَلُ. ✅</div>`;if(!window.speechSynthesis)return '';if(isNat(VO.ar))return `<div class="vnote ok">🗣️ صَوْتٌ طَبِيعِيٌّ يَعْمَلُ. ✅</div>`;return `<div class="vnote">🗣️ <b>قَدْ يَبْدُو الصَّوْتُ مِثْلَ الرُّوبُوتِ فِي هَذَا الْمُتَصَفِّحِ.</b> لِصَوْتٍ طَبِيعِيٍّ، افْتَحِ الرَّابِطَ فِي مُتَصَفِّحِ مَايْكْرُوسُوفْت إِيدْج.</div>`}
if(window.speechSynthesis){pickVoices();speechSynthesis.onvoiceschanged=()=>{pickVoices();if(route&&route[0]==='welcome')render()}}
function clean(t){t=String(t).replace(/<br\s*\/?>/gi,'، ').replace(/<[^>]+>/g,'').replace(/&[a-z#0-9]+;/gi,' ');t=t.replace(/\s*[→←]\s*/g,'، ثُمَّ ');t=t.replace(/_{2,}|\.{4,}|…{2,}/g,' ... ');t=t.replace(/[\p{Extended_Pictographic}←-⇿☀-➿️‍⭐⬜]/gu,'');t=t.replace(/["“”«»]/g,'').replace(/\s+/g,' ').trim();return t}
function utter(t,o={}){const u=new SpeechSynthesisUtterance(clean(t));u.lang=VO.ar?VO.ar.lang:'ar-EG';if(VO.ar)u.voice=VO.ar;u.rate=o.rate||S.rateAr;u.pitch=1;u.volume=o.vol==null?1:o.vol;return u}
const AUD={};let curA=null;
let VLOAD={n:0,of:0,done:false},VREADY_res;const VREADY=new Promise(r=>VREADY_res=r);
const vProg=()=>{const el=document.getElementById('vload');if(!el)return;if(VLOAD.done){el.remove();return}el.innerHTML=`🎙️ جَارٍ تَحْمِيلُ الْأَصْوَاتِ… ${ad(VLOAD.of?Math.round(VLOAD.n/VLOAD.of*100):0)}٪`};
const vDone=()=>{VLOAD.done=true;vProg();VREADY_res()};
const loadVoices=async()=>{const emb=document.querySelectorAll('script[type="application/x-voice"]');if(emb.length){for(const el of emb){await new Promise(r=>setTimeout(r,0));try{Object.assign(AUD,JSON.parse(el.textContent))}catch(e){}}vDone();return}
 const base=window.SQ_VOICE||'audio/';try{const idx=await(await fetch(base+'v_index.json',{cache:'no-cache'})).json();VLOAD.of=idx.length;
  if(!document.getElementById('vload')){const d=document.createElement('div');d.id='vload';document.body.appendChild(d)}vProg();
  let cache=null;try{cache=await caches.open('ssq-voices')}catch(e){}
  const urls=idx.map(f=>new URL(base+f,location.href).href);
  await Promise.all(urls.map(async url=>{try{let r=cache&&await cache.match(url);if(!r){r=await fetch(url);if(r.ok&&cache){try{await cache.put(url,r.clone())}catch(e){}}}if(r&&r.ok)Object.assign(AUD,await r.json())}catch(e){}VLOAD.n++;vProg()}));
  if(cache){try{const root=new URL(base,location.href).href;for(const k of await cache.keys()){if(k.url.startsWith(root)&&!urls.includes(k.url))cache.delete(k)}}catch(e){}}}catch(e){}vDone()};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loadVoices);else loadVoices();
const VSTAT={rec:0,live:0,miss:[]};
function stripName(t,n){t=String(t);if(!n)return t;const e=n.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');return t.replace(new RegExp('(،\\s*)?(يَا\\s+)?'+e+'(\\s*،)?','g'),(m,a,y,b)=>a&&b?'،':'').replace(/\s+([!؟.،])/g,'$1').replace(/^\s*،\s*/,'').replace(/\s{2,}/g,' ').trim()}
function recFor(t){let r=AUD['ar|'+clean(t)];if(!r&&P())r=AUD['ar|'+clean(stripName(t,SPN()))];return r}
function stopA(){if(curA){try{curA.pause()}catch(e){}curA=null}}
const UQ=[];let spTok=0,warmed=false;
let VB=0;const lockOn=()=>{VB++;document.body.classList.add('talking')},lockOff=()=>{VB=Math.max(0,VB-1);if(!VB)document.body.classList.remove('talking')};
function speakP(t,o={}){const tok=actTok;return new Promise(res0=>{let settled=false,locked=false;const res=()=>{if(settled)return;settled=true;if(locked)lockOff();if(tok===actTok)res0()};
 if(!S.voice||(onBreak&&!o.brk)||!String(t).trim()){res();return}
 let rec=o.live?null:recFor(t);
 if(!rec&&!o.live&&!VLOAD.done){Promise.race([VREADY,new Promise(r=>setTimeout(r,6000))]).then(()=>{if(tok!==actTok){res();return}speakP(t,o).then(res)});return}
 if(rec)VSTAT.rec++;else if(!o.live){VSTAT.live++;VSTAT.miss.push(clean(t).slice(0,60));if(VSTAT.miss.length>8)VSTAT.miss.shift()}
 const lk=inActivity&&!o.nolock&&!o.brk;if(lk){locked=true;lockOn()}
 keepAlive();
 if(rec){const my=++spTok;stopA();try{if(window.speechSynthesis&&(speechSynthesis.speaking||speechSynthesis.pending))speechSynthesis.cancel()}catch(e){}const a=new Audio('data:audio/ogg;base64,'+rec);a.volume=o.vol==null?1:Math.max(.1,Math.min(1,o.vol));curA=a;let safety=setTimeout(()=>fin(),20000);const fin=()=>{clearTimeout(safety);if(curA===a)curA=null;res()};a.onloadedmetadata=()=>{if(isFinite(a.duration)){clearTimeout(safety);safety=setTimeout(fin,a.duration*1000+2500)}};a.onended=fin;a.onerror=fin;a.onpause=()=>{if(!a.ended)fin()};const p=a.play();if(p&&p.catch)p.catch(fin);return}
 if(!window.speechSynthesis){res();return}stopA();
 const my=++spTok;
 const go=()=>{if(my!==spTok){res();return}let u;try{u=utter(t,o)}catch(e){res();return}UQ.push(u);if(UQ.length>30)UQ.shift();const est=Math.min(12000,1500+clean(t).length*95/(u.rate||1));const to=setTimeout(()=>fin(),est+1500);const fin=()=>{clearTimeout(to);res()};u.onend=fin;u.onerror=fin;try{speechSynthesis.resume();speechSynthesis.speak(u)}catch(e){fin()}};
 try{if(speechSynthesis.speaking||speechSynthesis.pending){speechSynthesis.cancel();setTimeout(go,150)}else go()}catch(e){res()}})}
let KA=null;function keepAlive(){try{if(!KA){const C=window.AudioContext||window.webkitAudioContext;if(!C)return;KA=new C();const o=KA.createOscillator(),g=KA.createGain();g.gain.value=0.0006;o.frequency.value=40;o.connect(g).connect(KA.destination);o.start()}if(KA.state==='suspended')KA.resume()}catch(e){}}
document.addEventListener('pointerdown',keepAlive,{capture:true,passive:true});
/* while talking, block new taps/drags inside the activity (sound buttons, Exit and Back stay free) */
const FREE='.btn.sm.w,#pv,.snd,[data-free],#vload';let lastNudge=0;
const blockTalk=e=>{if(!VB||!document.body.classList.contains('talking'))return;const t=e.target;if(!t.closest||!t.closest('#act')||t.closest(FREE))return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();if(e.type==='pointerdown'&&performance.now()-lastNudge>700){lastNudge=performance.now();let b=$('listen');if(!b){b=document.createElement('div');b.id='listen';document.body.appendChild(b)}b.innerHTML='👂 اسْتَمِعْ أَوَّلًا…';b.classList.remove('show');void b.offsetWidth;b.classList.add('show')}};
['pointerdown','mousedown','touchstart','click','dblclick'].forEach(ev=>document.addEventListener(ev,blockTalk,{capture:true,passive:false}));
function speak(t,o={}){speakP(t,o);return null}
/* mission narration: one clip */
const ORD=['الْأُولَى','الثَّانِيَةُ','الثَّالِثَةُ','الرَّابِعَةُ','الْخَامِسَةُ','السَّادِسَةُ','السَّابِعَةُ','الثَّامِنَةُ','التَّاسِعَةُ','الْعَاشِرَةُ'];
function sayMission(i,t){return speakP(clean(t))}
function speakNext(t,o={}){const tk=actTok,t0=performance.now();const go=()=>{if(tk!==actTok)return;if(VB&&performance.now()-t0<25000)return setTimeout(go,150);speak(t,o)};go()}
function hush(){spTok++;stopA();try{speechSynthesis.cancel()}catch(e){}}
function warmVoice(){if(warmed||!window.speechSynthesis)return;warmed=true;try{const v=new SpeechSynthesisUtterance(' .');v.volume=0;if(VO.ar){v.voice=VO.ar;v.lang=VO.ar.lang}UQ.push(v);speechSynthesis.speak(v)}catch(e){}}
document.addEventListener('pointerdown',warmVoice,{capture:true,once:true});
setInterval(()=>{try{if(window.speechSynthesis&&speechSynthesis.paused&&speechSynthesis.speaking)speechSynthesis.resume()}catch(e){}},2000);
/* any text marked .tt is read aloud when tapped */
document.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('.tt');if(a&&!a.closest('button,a,.gate,.flip')){a.classList.remove('arplay');void a.offsetWidth;a.classList.add('arplay');speak(a.dataset.say||a.textContent)}},true);
const sayAr=t=>speak(t);const sayArP=t=>speakP(t);

/* ---------- confetti ---------- */
function confetti(n=140){const cv=$('fx'),x=cv.getContext('2d');cv.width=innerWidth;cv.height=innerHeight;const cols=['#ff7a45','#ffc531','#22b46e','#4a8cff','#8c5cff','#ff63ad'];const ps=Array.from({length:n},()=>({x:innerWidth/2+(Math.random()-.5)*200,y:innerHeight*.45,vx:(Math.random()-.5)*16,vy:-Math.random()*16-6,r:Math.random()*7+4,c:cols[Math.random()*6|0],a:Math.random()*6}));let f=0;(function loop(){x.clearRect(0,0,cv.width,cv.height);ps.forEach(p=>{p.vy+=.45;p.x+=p.vx;p.y+=p.vy;p.a+=.2;x.save();x.translate(p.x,p.y);x.rotate(p.a);x.fillStyle=p.c;x.fillRect(-p.r,-p.r/2,p.r*2,p.r);x.restore()});if(++f<150)requestAnimationFrame(loop);else x.clearRect(0,0,cv.width,cv.height)})()}

/* ---------- backgrounds ---------- */
const BGS={sky:['☁️','⭐','🧭','🗺️','☁️'],map:['☁️','🧭','🌍','☀️','☁️'],city:['🏙️','🚌','🌳','🏘️','🚲','🏥','🏫','🕌'],egypt:['🇪🇬','🏛️','🐪','🌴','⛵','☀️','🗺️','🏜️'],compass:['🧭','🗺️','⭐','🛰️','📍','🧭','☀️','🌙']};
let curBg='';
function setBg(k){if(k===curBg)return;curBg=k;const b=$('bg');b.className='bg-'+k;b.innerHTML=(BGS[k]||BGS.sky).map((e,i)=>`<span class="float" style="left:${(i*97+13)%95}%;animation-duration:${14+(i*7)%12}s;animation-delay:-${(i*5)%14}s">${e}</span>`).join('')}

/* ---------- avatar ---------- */
function shade(hex,p){const n=parseInt(hex.slice(1),16),r=n>>16,g=n>>8&255,b=n&255;const f=v=>Math.max(0,Math.min(255,Math.round(v+p*2.55)));return '#'+((1<<24)+(f(r)<<16)+(f(g)<<8)+f(b)).toString(16).slice(1)}
const PRESETS={
 selim:{skin:'#DCA683',hair:'swept',hairColor:'#1c1715',shirt:'#F6705F',over:true,face:'oval',glasses:false},
 sajid:{skin:'#D49C76',hair:'curly',hairColor:'#1c1715',shirt:'#FF8A2B',over:false,face:'round',glasses:false},
 def:{skin:'#E8B892',hair:'short',hairColor:'#3b2a20',shirt:'#4a8cff',over:false,face:'oval',glasses:false}};
function presetFor(n){const x=n.trim().toLowerCase();if(/^(selim|salim|سليم)/.test(x))return{a:{...PRESETS.selim},mode:'calm'};if(/^(sajid|sajed|ساجد)/.test(x))return{a:{...PRESETS.sajid},mode:'challenge'};return{a:{...PRESETS.def},mode:'calm'}}
function avatar(a,pose='idle',cls='av'){
 const s=a.skin,h=a.hairColor,sh=a.shirt,rx=a.face==='round'?50:45,ry=a.face==='round'?50:54,cy=95,top=cy-ry,L=100-rx,R=100+rx,dk=shade(s,-14);
 const leftDown=`<path d="M52 178 Q40 205 44 232" stroke="${sh}" stroke-width="24" stroke-linecap="round" fill="none"/>`;
 let arms;
 if(pose==='cheer')arms=`<path d="M52 178 Q26 140 30 100" stroke="${sh}" stroke-width="24" stroke-linecap="round" fill="none"/><circle cx="30" cy="94" r="13" fill="${s}"/><path d="M148 178 Q174 140 170 100" stroke="${sh}" stroke-width="24" stroke-linecap="round" fill="none"/><circle cx="170" cy="94" r="13" fill="${s}"/>`;
 else if(pose==='wave')arms=leftDown+`<path d="M148 178 Q178 150 172 108" stroke="${sh}" stroke-width="24" stroke-linecap="round" fill="none"/><circle cx="172" cy="100" r="13" fill="${s}"><animateTransform attributeName="transform" type="rotate" values="-12 160 140;12 160 140;-12 160 140" dur="1s" repeatCount="indefinite"/></circle>`;
 else if(pose==='left')arms=leftDown;
 else arms=leftDown+`<path d="M148 178 Q160 205 156 232" stroke="${sh}" stroke-width="24" stroke-linecap="round" fill="none"/>`;
 let hair='';
 if(a.hair==='short')hair=`<path d="M${L-3} 96 Q${L-4} ${top-6} 100 ${top-8} Q${R+4} ${top-6} ${R+3} 96 Q${R-4} ${top+20} 100 ${top+18} Q${L+4} ${top+20} ${L-3} 96Z" fill="${h}"/>`;
 else if(a.hair==='buzz')hair=`<path d="M${L} 92 Q${L-1} ${top-2} 100 ${top-3} Q${R+1} ${top-2} ${R} 92 Q${R-6} ${top+16} 100 ${top+14} Q${L+6} ${top+16} ${L} 92Z" fill="${shade(h,22)}" opacity=".9"/>`;
 else if(a.hair==='swept')hair=`<path d="M${L} 98 Q${L-2} ${top+4} 100 ${top+2} Q${R+2} ${top+4} ${R} 98 Q${R-4} ${top+22} 100 ${top+20} Q${L+4} ${top+22} ${L} 98Z" fill="${shade(h,18)}"/><path d="M${L+4} ${top+22} Q${L+2} ${top-22} 112 ${top-26} Q${R+12} ${top-20} ${R+2} ${top+20} Q${R-10} ${top+2} 104 ${top+6} Q${L+18} ${top+10} ${L+4} ${top+22}Z" fill="${h}"/>`;
 else if(a.hair==='curly'){let c='';for(let i=0;i<=10;i++){const ang=Math.PI*(1.03+i*.094),x=100+Math.cos(ang)*(rx+2),y=cy-6+Math.sin(ang)*(ry+2);c+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="15" fill="${h}"/>`}for(let i=0;i<5;i++)c+=`<circle cx="${70+i*15}" cy="${top+6}" r="14" fill="${h}"/>`;hair=c}
 let back='';const hj=a.hair==='hijab';
 if(a.hair==='long'){back=`<path d="M${L-8} 104 Q${L-12} ${top-10} 100 ${top-12} Q${R+12} ${top-10} ${R+8} 104 L${R+10} 176 Q${R-6} 186 ${R-14} 170 L${L+14} 170 Q${L+6} 186 ${L-10} 176Z" fill="${h}"/>`;hair=`<path d="M${L-4} 98 Q${L-6} ${top-8} 100 ${top-10} Q${R+6} ${top-8} ${R+4} 98 Q${R-6} ${top+18} 112 ${top+20} Q100 ${top+8} 88 ${top+22} Q${L+6} ${top+20} ${L-4} 98Z" fill="${h}"/>`}
 else if(a.hair==='ponytail'){back=`<ellipse cx="${R+16}" cy="${cy-4}" rx="15" ry="34" fill="${h}" transform="rotate(14 ${R+16} ${cy-4})"/><circle cx="${R+4}" cy="${cy-34}" r="7" fill="#ff63ad"/>`;hair=`<path d="M${L-3} 98 Q${L-4} ${top-6} 100 ${top-8} Q${R+4} ${top-6} ${R+3} 98 Q${R-4} ${top+18} 100 ${top+16} Q${L+4} ${top+18} ${L-3} 98Z" fill="${h}"/>`}
 else if(hj){back=`<path d="M${L-14} 112 Q${L-16} ${top-18} 100 ${top-20} Q${R+16} ${top-18} ${R+14} 112 L${R+24} 182 Q100 206 ${L-24} 182Z" fill="${h}"/>`;hair=`<path d="M${L-6} 104 Q${L-8} ${top-10} 100 ${top-12} Q${R+8} ${top-10} ${R+6} 104 Q${R-4} ${top+14} 100 ${top+12} Q${L+4} ${top+14} ${L-6} 104Z" fill="${h}"/><path d="M${L-6} 104 Q${L-8} ${top-10} 100 ${top-12} Q${R+8} ${top-10} ${R+6} 104" stroke="${shade(h,-18)}" stroke-width="3" fill="none"/>`}
 const over=a.over?`<path d="M70 168 L78 168 L82 240 L72 240Z" fill="#2d3442"/><path d="M130 168 L122 168 L118 240 L128 240Z" fill="#2d3442"/><rect x="66" y="210" width="68" height="32" rx="8" fill="#2d3442"/><circle cx="78" cy="214" r="4" fill="#c7ccd6"/><circle cx="122" cy="214" r="4" fill="#c7ccd6"/>`:'';
 const gl=a.glasses?`<g fill="none" stroke="#2a2a2a" stroke-width="3.5"><circle cx="82" cy="98" r="13"/><circle cx="118" cy="98" r="13"/><path d="M95 97 L105 97"/></g>`:'';
 return `<svg viewBox="0 0 200 240" class="${cls}" aria-hidden="true"><path d="M38 240 Q38 166 100 160 Q162 166 162 240Z" fill="${sh}"/>${arms}<path d="M80 162 L100 186 L120 162 L112 157 L100 172 L88 157Z" fill="${shade(sh,-28)}"/>${over}${back}<rect x="88" y="136" width="24" height="28" rx="9" fill="${dk}"/>${hj?'':`<circle cx="${L+1}" cy="100" r="11" fill="${dk}"/><circle cx="${R-1}" cy="100" r="11" fill="${dk}"/>`}<ellipse cx="100" cy="${cy}" rx="${rx}" ry="${ry}" fill="${s}"/>${hair}<path d="M72 84 Q82 78 92 84" stroke="${h}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M108 84 Q118 78 128 84" stroke="${h}" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="82" cy="98" rx="5.5" ry="7" fill="#2a1a12"/><ellipse cx="118" cy="98" rx="5.5" ry="7" fill="#2a1a12"/><circle cx="84" cy="95" r="2" fill="#fff"/><circle cx="120" cy="95" r="2" fill="#fff"/>${gl}<path d="M100 104 Q96 114 101 115" stroke="${shade(s,-25)}" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="72" cy="114" r="8" fill="#ff8a8a" opacity=".35"/><circle cx="128" cy="114" r="8" fill="#ff8a8a" opacity=".35"/><path d="M80 121 Q100 144 120 121 Q100 129 80 121Z" fill="#7a2b2b"/><path d="M84 122 Q100 128 116 122 L114 126 Q100 131 86 126Z" fill="#fff"/></svg>`;
}
/* the guide: a smiling globe with an explorer hat */
function buzzy(cls='av'){return `<svg viewBox="0 0 200 240" class="${cls}" aria-hidden="true"><defs><radialGradient id="glbG" cx=".38" cy=".35" r=".75"><stop offset="0" stop-color="#7cc8ff"/><stop offset="1" stop-color="#1f6fd1"/></radialGradient></defs><ellipse cx="100" cy="228" rx="56" ry="9" fill="#000" opacity=".18"/><path d="M78 196 L72 226 L94 226 L96 200Z M122 196 L128 226 L106 226 L104 200Z" fill="#c2410c"/><circle cx="100" cy="132" r="70" fill="url(#glbG)"/><path d="M58 92 Q70 80 86 88 Q94 100 84 110 Q70 114 66 128 Q56 120 58 92Z M110 76 Q132 72 146 90 Q140 104 124 102 Q114 96 110 76Z M122 150 Q142 140 158 152 Q150 176 130 184 Q120 170 122 150Z M50 150 Q64 156 70 172 Q60 180 52 168Z" fill="#4ade80" opacity=".95"/><circle cx="76" cy="132" r="14" fill="#fff"/><circle cx="124" cy="132" r="14" fill="#fff"/><circle cx="78" cy="134" r="7" fill="#1e293b"/><circle cx="126" cy="134" r="7" fill="#1e293b"/><circle cx="80" cy="131" r="2.4" fill="#fff"/><circle cx="128" cy="131" r="2.4" fill="#fff"/><path d="M82 160 Q100 176 118 160" stroke="#1e293b" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="64" cy="154" r="7" fill="#fb7185" opacity=".45"/><circle cx="136" cy="154" r="7" fill="#fb7185" opacity=".45"/><path d="M42 78 Q100 58 158 78 Q150 86 100 80 Q50 86 42 78Z" fill="#a16207"/><path d="M62 74 Q64 36 100 34 Q136 36 138 74 Q100 66 62 74Z" fill="#ca8a04"/><path d="M63 66 Q100 58 137 66 L138 74 Q100 66 62 74Z" fill="#7c2d12"/><path d="M36 150 Q22 134 30 116" stroke="#1f6fd1" stroke-width="12" stroke-linecap="round" fill="none"/><path d="M164 150 Q182 126 172 104" stroke="#1f6fd1" stroke-width="12" stroke-linecap="round" fill="none"/><circle cx="172" cy="100" r="10" fill="#1f6fd1"/></svg>`}
const me=(pose='idle')=>avatar(P().avatar,pose);
const nest=(s,a)=>s.replace('<svg ','<svg '+a+' ');
const sayMe=(t,pose='idle',id='')=>`<div class="say">${me(pose)}<div class="bubble pop" ${id?`id="${id}"`:''}>${t}</div></div>`;
const sayBuzzy=(t,id='')=>`<div class="say">${buzzy()}<div class="bubble pop" ${id?`id="${id}"`:''}>${t}</div></div>`;

/* ---------- activity timers (cancelled when the activity changes) ---------- */
let actTok=0,focusSec=0,onBreak=false,inActivity=false,breakBag=[];
function later(fn,ms){const t=actTok;const run=()=>{if(t!==actTok)return;if(onBreak)return setTimeout(run,500);fn()};return setTimeout(run,ms)}
function every(fn,ms){const t=actTok;const iv=setInterval(()=>{if(t!==actTok)return clearInterval(iv);if(onBreak)return;fn()},ms);return iv}

/* ---------- focus timer and move breaks ---------- */
setInterval(()=>{if(!P()||!inActivity||onBreak||document.hidden||P().timerOff)return;focusSec++;const lim=calm()?600:1200;const c=$('tchip');if(c){const r=Math.max(0,lim-focusSec);c.textContent='⏱ '+ad((r/60|0)+':'+String(r%60).padStart(2,'0'))}if(focusSec>=lim)takeBreak()},1000);
const BREAKS=[
 ['b-jump','اقْفِزْ عَشْرَ مَرَّاتٍ مِثْلَ الْكَنْغَرِ!','🦘'],
 ['b-jump','اقْفِزْ مِثْلَ الضِّفْدَعِ خَمْسَ مَرَّاتٍ!','🐸'],
 ['b-stretch','تَمَدَّدْ لِلْأَعْلَى مِثْلَ نَخْلَةٍ طَوِيلَةٍ!','🌴'],
 ['b-stretch','الْمِسْ أَصَابِعَ قَدَمَيْكَ، ثُمَّ ارْفَعْ يَدَيْكَ إِلَى السَّمَاءِ، خَمْسَ مَرَّاتٍ!','🙆'],
 ['b-spin','دُرْ حَوْلَ نَفْسِكَ بِبُطْءٍ ثَلَاثَ مَرَّاتٍ!','🌀'],
 ['b-march','امْشِ فِي مَكَانِكَ مِثْلَ الْجُنْدِيِّ، وَعُدَّ حَتَّى عِشْرِينَ!','💂'],
 ['b-shake','صَفِّقْ خَمْسَ مَرَّاتٍ بِقُوَّةٍ، ثُمَّ خَمْسَ مَرَّاتٍ بِرِفْقٍ.','👏'],
 ['breathe','تَنَفَّسْ مِثْلَ الْبَالُونِ: شَهِيقٌ بِبُطْءٍ، ثُمَّ زَفِيرٌ بِبُطْءٍ، ثَلَاثَ مَرَّاتٍ.','🎈'],
 ['breathe','شُمَّ الْوَرْدَةَ، ثُمَّ انْفُخِ الشَّمْعَةَ، ثَلَاثَ مَرَّاتٍ.','🌸'],
 ['bounce','ابْحَثْ عَنْ شَيْءٍ أَزْرَقَ فِي الْغُرْفَةِ وَالْمِسْهُ!','🔵'],
 ['bounce','قِفْ وَأَشِرْ إِلَى جِهَةِ الشَّمَالِ، ثُمَّ إِلَى الْجَنُوبِ!','🧭'],
 ['bounce','اذْهَبْ إِلَى النَّافِذَةِ، وَسَمِّ ثَلَاثَةَ أَشْيَاءَ تَرَاهَا!','🪟'],
 ['bounce','اصْنَعْ أَضْحَكَ وَجْهٍ لِمُدَّةِ خَمْسِ ثَوَانٍ!','🤪'],
 ['b-march','امْشِ مِثْلَ الْبِطْرِيقِ إِلَى الْبَابِ، ثُمَّ ارْجِعْ!','🐧'],
 ['statue','كُنْ تِمْثَالًا! لَا تَتَحَرَّكْ حَتَّى تَعُدَّ إِلَى عَشَرَةٍ.','🗿'],
 ['b-spin','حَرِّكْ ذِرَاعَيْكَ فِي دَوَائِرَ كَبِيرَةٍ عَشْرَ مَرَّاتٍ، مِثْلَ طَاحُونَةِ الْهَوَاءِ!','🌬️'],
 ['b-jump','طِرْ مِثْلَ الْعُصْفُورِ: رَفْرِفْ بِذِرَاعَيْكَ عَشْرَ مَرَّاتٍ!','🐦'],
 ['bounce','اشْرَبْ قَلِيلًا مِنَ الْمَاءِ، ثُمَّ ارْجِعْ!','💧'],
 ['b-shake','هُزَّ يَدَيْكَ، ثُمَّ قَدَمَيْكَ، ثُمَّ جِسْمَكَ كُلَّهُ!','🫨'],
 ['b-march','امْشِ كَأَنَّكَ تَعْبُرُ الشَّارِعَ: انْظُرْ يَمِينًا، ثُمَّ يَسَارًا، ثُمَّ امْشِ!','🚦']];
function takeBreak(){hush();onBreak=true;if(!breakBag.length)breakBag=shuffle(BREAKS.map((_,i)=>i));const m=BREAKS[breakBag.pop()];let t=calm()?60:45;const o=document.createElement('div');o.className='overlay';
 const body=m[0]==='breathe'?`<div class="balloon" id="bl"></div><h2 id="bt2">شَهِيقٌ...</h2>`:`<div class="${m[0]==='statue'?'':m[0]}" style="width:170px;margin:auto">${avatar(P().avatar,m[0]==='statue'?'idle':'cheer','" style="width:170px;height:204px')}</div>`;
 o.innerHTML=`<div class="card center pop"><h2>وَقْتُ الِاسْتِرَاحَةِ ${NM()}! أَنْتَ تَسْتَحِقُّهَا! ${m[2]}</h2><p style="margin:4px 0;color:#667">اللُّعْبَةُ مُتَوَقِّفَةٌ. فِي اسْتِرَاحَتِكَ يُمْكِنُكَ أَنْ:</p>${body}<h3>${m[1]}</h3><button class="btn sm w" id="bar">🔊 اسْتَمِعْ</button><h1 id="bt">${ad(t)}</h1><button class="btn g big" id="bk" style="display:none">لَقَدْ عُدْتُ! 🚀</button></div>`;document.body.appendChild(o);
 const line='الْآنَ وَقْتُ الِاسْتِرَاحَةِ، أَنْتَ تَسْتَحِقُّهَا! اللُّعْبَةُ سَتَنْتَظِرُكَ. فِي اسْتِرَاحَتِكَ يُمْكِنُكَ أَنْ تَفْعَلَ هَذَا: '+m[1];speak(line,{brk:1});o.querySelector('#bar').onclick=()=>speak(line,{brk:1});
 let br=0;const iv=setInterval(()=>{if(!$('bt'))return clearInterval(iv);t--;$('bt').textContent=ad(t);if($('bl')&&t%4===0){br=!br;$('bl').style.transform=br?'scale(1.9)':'scale(1)';$('bt2').textContent=br?'زَفِيرٌ...':'شَهِيقٌ...'}if(t<=0){clearInterval(iv);$('bt').textContent='✅';$('bk').style.display='inline-block';SFX.star()}},1000);
 if($('bl'))setTimeout(()=>{$('bl').style.transform='scale(1.9)'},50);
 o.querySelector('#bk').onclick=()=>{clearInterval(iv);o.remove();onBreak=false;focusSec=0;SFX.good();speak('أَهْلًا بِعَوْدَتِكَ! هَيَّا نُكْمِلْ.')}}

/* ---------- shell ---------- */
function topBar(){const p=P();return `<div class="top"><div class="who">${avatar(p.avatar,'idle','')}<span>${esc(p.name)}</span></div><span class="chip">⭐ ${ad(totalStars())}</span>${p.timerOff?'':`<span class="chip" id="tchip">⏱</span>`}<span class="chip">${calm()?'🌿 هَادِئٌ':'🔥 تَحَدٍّ'}</span><span class="sp"></span><button class="btn sm w" onclick="goHub()">${PAGE==='hub'?'🗺️ الْخَرِيطَةُ':'🏠 الْوَحَدَاتُ'}</button><button class="btn sm w" onclick="toggleVoice()" title="الصَّوْتُ">${S.voice?'🗣️':'🤐'}</button><button class="btn sm w" onclick="toggleSfx()" title="أَصْوَاتُ اللُّعْبَةِ">${S.sfx?'🔊':'🔇'}</button><button class="btn sm w" onclick="settings()">⚙️</button></div>`}
function refreshTop(){const t=document.querySelector('.top');if(t&&P())t.outerHTML=topBar();else render()}
function toggleVoice(){S.voice=!S.voice;save();if(!S.voice)hush();refreshTop()}
function toggleSfx(){S.sfx=!S.sfx;save();refreshTop();SFX.click()}
let route=['welcome'];
function go(...r){actTok++;SFX.click();hush();route=r;render();scrollTo(0,0)}
function render(){const [s,a]=route;inActivity=!['welcome','avatar','map'].includes(s);const A=$('app');
 if(s==='welcome'){setBg('sky');A.innerHTML=welcome()}
 else if(s==='avatar'){setBg('sky');A.innerHTML=avatarScreen()}
 else if(s==='map'){if(PAGE!=='hub'){goHub();return}setBg('map');A.innerHTML=topBar()+mapScreen()}
 else if(s==='world'){setBg(WORLD.bg);A.innerHTML=topBar()+worldScreen()}
 else if(s==='act'){setBg(WORLD.bg);A.innerHTML=topBar()+`<div id="act"></div>`;startAct(a)}}

/* ---------- welcome / players ---------- */
function welcome(){const ps=Object.values(S.players);return `<div class="center" style="padding-top:20px"><h1>🧭 رِحْلَةُ الدِّرَاسَاتِ الِاجْتِمَاعِيَّةِ</h1><div style="font-size:22px;font-weight:700;color:#5b21b6">مِصْرُ فِي قَلْبِ الْعَالَمِ</div><div class="row" style="margin:14px 0">${buzzy('bounce" style="width:130px;height:156px')}</div>
${ps.length?`<div class="card" style="margin-bottom:18px"><h2>مَنْ سَيَلْعَبُ؟</h2><div class="row" style="margin-top:10px">${ps.map(p=>`<button class="btn w" style="display:flex;flex-direction:column;align-items:center;padding:12px 18px" onclick="pick('${encodeURIComponent(p.name).replace(/'/g,'%27')}')">${avatar(p.avatar,'wave','" style="width:110px;height:132px')}<span style="font-size:26px">${esc(p.name)}</span></button>`).join('')}</div></div>`:''}
<div class="card"><h2>${ps.length?'لَاعِبٌ جَدِيدٌ':'مَا اسْمُكَ؟'}</h2><p style="margin:0;color:#667">يُمْكِنُ لِأَصْدِقَائِكَ اللَّعِبُ أَيْضًا! اكْتُبِ اسْمَكَ وَاصْنَعْ شَخْصِيَّتَكَ. 🎨</p><form onsubmit="event.preventDefault();newPlayer()" style="margin-top:10px"><input class="name" id="nm" maxlength="16" placeholder="اكْتُبِ اسْمَكَ" oninput="$('nerr').textContent=''" autocomplete="off"><div class="err" id="nerr"></div><button class="btn big g" type="submit">التَّالِي ⬅</button></form></div>
<div style="margin-top:16px"><button class="btn sm w" onclick="testSound()">🔈 جَرِّبِ الصَّوْتَ</button></div>${voiceNote()}</div>`}
function testSound(){play('drum',1);setTimeout(()=>play('star',.6),500);setTimeout(()=>speak('مَرْحَبًا! هَلْ تَسْمَعُنِي؟'),1300)}
function pick(n){S.cur=decodeURIComponent(n);save();go('map');speak('أَهْلًا بِعَوْدَتِكَ!')}
function newPlayer(){const n=$('nm').value.trim();if(!n){$('nerr').textContent='اكْتُبِ اسْمَكَ أَوَّلًا ✍️';return}if(S.players[n]){$('nerr').textContent='هَذَا الِاسْمُ مَوْجُودٌ. اضْغَطْ عَلَيْهِ فِي الْأَعْلَى!';return}const pr=presetFor(n);S.players[n]={name:n,avatar:pr.a,mode:pr.mode,prog:{}};S.cur=n;save();go('avatar');speak('مَرْحَبًا! هَيَّا نَصْنَعْ شَخْصِيَّتَكَ.')}
const OPTS={skin:['#F6D2B0','#F3CBA5','#E8B892','#DCA683','#D49C76','#C48A62','#B9805A','#8D5A3B','#6B4128'],
 hair:[['swept','مَرْفُوعٌ'],['curly','مُجَعَّدٌ'],['short','قَصِيرٌ'],['buzz','قَصِيرٌ جِدًّا'],['long','طَوِيلٌ'],['ponytail','ذَيْلُ حِصَانٍ'],['hijab','حِجَابٌ']],
 hairColor:['#1c1715','#3b2a20','#6b4428','#8a5a2b','#b07a3c','#d9a05b','#c0392b'],
 hijabColor:['#ff63ad','#8c5cff','#1f3a93','#22b46e','#e8d5b5','#ffffff','#2b2b2b','#c0392b'],
 shirt:['#F6705F','#FF8A2B','#ffc531','#22b46e','#1aa3a3','#4a8cff','#8c5cff','#ff63ad','#ffffff','#2d3442'],
 face:[['oval','وَجْهٌ بَيْضَاوِيٌّ'],['round','وَجْهٌ مُسْتَدِيرٌ']]};
const LOOKS=[['شَكْلُ سَلِيمٍ',PRESETS.selim],['شَكْلُ سَاجِدٍ',PRESETS.sajid],['الْمُسْتَكْشِفُ',{skin:'#E8B892',hair:'short',hairColor:'#3b2a20',shirt:'#4a8cff',over:false,face:'oval',glasses:true}],['النَّجْمَةُ',{skin:'#DCA683',hair:'ponytail',hairColor:'#1c1715',shirt:'#ff63ad',over:false,face:'round',glasses:false}],['السَّمَاءُ',{skin:'#C48A62',hair:'hijab',hairColor:'#8c5cff',shirt:'#1aa3a3',over:false,face:'oval',glasses:false}],['الصَّارُوخُ',{skin:'#8D5A3B',hair:'buzz',hairColor:'#1c1715',shirt:'#ffc531',over:true,face:'round',glasses:false}]];
const AVTABS=[['looks','⭐','أَشْكَالٌ جَاهِزَةٌ'],['skin','🎨','الْبَشَرَةُ'],['hair','💇','الشَّعْرُ'],['hairColor','🖌️','اللَّوْنُ'],['face','😊','الْوَجْهُ'],['shirt','👕','الْقَمِيصُ'],['extras','✨','إِضَافَاتٌ']];
let avTab='looks';
function avTile(cfg,label,on,act){return `<button class="avt ${on?'on':''}" onclick="${act}">${avatar(cfg,'idle','')}<span>${label}</span>${on?'<b class="tick">✓</b>':''}</button>`}
function avatarScreen(){const a=P().avatar,t=avTab,hj=a.hair==='hijab';let tiles='';
 if(t==='looks')tiles=LOOKS.map(([n,c],i)=>avTile(c,n,JSON.stringify(c)===JSON.stringify({...a}),`useLook(${i})`)).join('');
 else if(t==='skin')tiles=OPTS.skin.map(c=>avTile({...a,skin:c},'',a.skin===c,`setAv('skin','${c}')`)).join('');
 else if(t==='hair')tiles=OPTS.hair.map(([v,l])=>avTile({...a,hair:v,hairColor:v==='hijab'&&!hj?OPTS.hijabColor[0]:(v!=='hijab'&&hj?OPTS.hairColor[0]:a.hairColor)},l,a.hair===v,`setHair('${v}')`)).join('');
 else if(t==='hairColor')tiles=(hj?OPTS.hijabColor:OPTS.hairColor).map(c=>avTile({...a,hairColor:c},'',a.hairColor===c,`setAv('hairColor','${c}')`)).join('');
 else if(t==='face')tiles=OPTS.face.map(([v,l])=>avTile({...a,face:v},l,a.face===v,`setAv('face','${v}')`)).join('');
 else if(t==='shirt')tiles=OPTS.shirt.map(c=>avTile({...a,shirt:c},'',a.shirt===c,`setAv('shirt','${c}')`)).join('');
 else tiles=[['glasses','نَظَّارَةٌ 👓'],['over','حَمَّالَاتٌ 👖']].map(([k,l])=>avTile({...a,[k]:!a[k]},(a[k]?'إِزَالَةُ ':'إِضَافَةُ ')+l,false,`setAv('${k}',${!a[k]})`)).join('');
 return `<div class="center"><h2>اصْنَعْ شَخْصِيَّتَكَ ${NM()}! 😎</h2></div>
 <div class="card avb"><div class="avprev center"><div class="avstage">${avatar(a,'wave','bounce" style="width:100%;max-width:240px;height:auto;margin:auto')}</div><h2 style="margin-top:6px">${NM()}</h2><div class="row"><button class="btn sm y" onclick="surprise()">🎲 فَاجِئْنِي!</button><button class="btn sm w" onclick="resetLook()">↩ ابْدَأْ مِنْ جَدِيدٍ</button></div></div>
 <div><div class="avtabs">${AVTABS.map(([k,e,l])=>`<button class="avtab ${t===k?'on':''}" onclick="avTab='${k}';SFX.click();render()"><span class="e">${e}</span>${k==='hairColor'&&hj?'لَوْنُ الْحِجَابِ':l}</button>`).join('')}</div>
 <div class="avgrid">${tiles}</div></div></div>
 <div class="center" style="margin-top:18px"><button class="btn big g" onclick="goHome();speak('رَائِعٌ! هَيَّا بِنَا!')">هَيَّا بِنَا! 🚀</button></div>`}
function setAv(k,v){P().avatar[k]=v;save();SFX.click();render()}
function setHair(v){const a=P().avatar,was=a.hair==='hijab';a.hair=v;if(v==='hijab'&&!was)a.hairColor=OPTS.hijabColor[0];if(v!=='hijab'&&was)a.hairColor=OPTS.hairColor[0];save();SFX.click();render()}
function useLook(i){P().avatar={...LOOKS[i][1]};save();SFX.good();render()}
function surprise(){const r=x=>x[Math.random()*x.length|0],h=r(OPTS.hair)[0];P().avatar={skin:r(OPTS.skin),hair:h,hairColor:h==='hijab'?r(OPTS.hijabColor):r(OPTS.hairColor),shirt:r(OPTS.shirt),over:Math.random()<.3,face:r(OPTS.face)[0],glasses:Math.random()<.25};save();SFX.star();render()}
function resetLook(){P().avatar={...presetFor(P().name).a};save();SFX.click();render()}

/* ---------- settings ---------- */
function settings(){const p=P(),o=document.createElement('div');o.className='overlay';o.id='set';const row=(l,on,fn)=>`<div class="toggle"><span>${l}</span><button class="btn sm ${on?'g':'w'}" onclick="${fn}">${on?'يَعْمَلُ':'مُتَوَقِّفٌ'}</button></div>`;
 const vs=voicesFor('ar'),vsel=vs.length?`<select onchange="S.v_ar=this.value;save();pickVoices()">${vs.map(v=>`<option ${VO.ar&&VO.ar.name===v.name?'selected':''}>${esc(v.name)}</option>`).join('')}</select>`:'<i>لَا يُوجَدُ صَوْتٌ عَرَبِيٌّ عَلَى هَذَا الْجِهَازِ</i>';
 o.innerHTML=`<div class="card pop"><h2>⚙️ الْإِعْدَادَاتُ: ${NM()}</h2><div class="toggle"><span>الْوَضْعُ</span><span><button class="btn sm ${calm()?'g':'w'}" onclick="setP('mode','calm')">🌿 هَادِئٌ</button> <button class="btn sm ${!calm()?'g':'w'}" onclick="setP('mode','challenge')">🔥 تَحَدٍّ</button></span></div>
 <p style="font-size:17px;margin:4px 0;color:#667">الْوَضْعُ الْهَادِئُ: جَوْلَاتٌ أَقْصَرُ، وَقُلُوبٌ أَكْثَرُ، وَلَا مُؤَقِّتَ لِلسُّرْعَةِ، وَاسْتِرَاحَةُ حَرَكَةٍ كُلَّ عَشْرِ دَقَائِقَ. وَضْعُ التَّحَدِّي: جَوْلَاتٌ أَطْوَلُ، وَمُؤَقِّتٌ لِلسُّرْعَةِ، وَاسْتِرَاحَةٌ كُلَّ عِشْرِينَ دَقِيقَةً.</p>
 ${row('مُؤَقِّتُ التَّرْكِيزِ وَاسْتِرَاحَةُ الْحَرَكَةِ',!p.timerOff,"setP('timerOff',"+!p.timerOff+")")}
 ${row('فَتْحُ كُلِّ الْأَنْشِطَةِ (لِوَلِيِّ الْأَمْرِ)',!!p.unlockAll,"setP('unlockAll',"+!p.unlockAll+")")}
 <h3 style="margin-top:12px">🗣️ الصَّوْتُ (لِكُلِّ اللَّاعِبِينَ عَلَى هَذَا الْجِهَازِ)</h3>
 <div class="toggle"><span>الصَّوْتُ الْعَرَبِيُّ</span>${vsel}<button class="btn sm b" onclick="speak('مَرْحَبًا! هَيَّا نَتَعَلَّمْ مَعًا.',{live:1})">▶ تَجْرِبَةٌ</button></div>
 <div class="toggle"><span>سُرْعَةُ الصَّوْتِ <b id="ra">${S.rateAr}</b></span><input type="range" min=".6" max="1.1" step=".05" value="${S.rateAr}" oninput="S.rateAr=+this.value;$('ra').textContent=this.value;save()"></div>
 ${voiceNote()}<div style="font-size:15px;color:#667;margin-top:6px">فَحْصُ الصَّوْتِ: 🎙️ ${ad(Object.keys(AUD).length)} تَسْجِيلًا · ${ad(VSTAT.rec)} مُسَجَّلٌ، ${ad(VSTAT.live)} آلِيٌّ${VSTAT.miss.length?'<br>'+VSTAT.miss.map(esc).join(' | '):''}</div>
 <div class="row" style="margin-top:14px"><button class="btn sm y" onclick="testSound()">🔈 جَرِّبِ الصَّوْتَ</button><button class="btn sm b" onclick="closeSet();go('avatar')">🎨 عَدِّلْ شَخْصِيَّتَكَ</button><button class="btn sm p" onclick="closeSet();if(PAGE==='hub')go('welcome');else location.href=HUB">👥 غَيِّرِ اللَّاعِبَ</button><button class="btn sm r" onclick="askReset()">🔄 امْسَحِ التَّقَدُّمَ</button></div><div id="rs"></div>
 <div class="center" style="margin-top:14px"><button class="btn g" onclick="closeSet()">تَمَّ ✓</button></div></div>`;document.body.appendChild(o)}
function closeSet(){const o=$('set');if(o)o.remove();route[0]==='act'?refreshTop():render()}
function setP(k,v){P()[k]=v;save();const o=$('set');if(o)o.remove();settings()}
function askReset(){$('rs').innerHTML=`<div class="card" style="background:#fff3f3;margin-top:10px;box-shadow:none;border:3px solid #ef5b5b"><b>هَلْ تُرِيدُ مَسْحَ كُلِّ النُّجُومِ لِـ ${NM()}؟</b><div class="row" style="margin-top:8px"><button class="btn sm r" onclick="P().prog={};save();closeSet()">نَعَمْ، امْسَحْ</button><button class="btn sm w" onclick="$('rs').innerHTML=''">لَا</button></div></div>`}

/* ---------- world screen ---------- */
function worldScreen(){const nxt=ORDER.find(a=>unlocked(a[0])&&!prog(a[0]));const tile=a=>{const u=unlocked(a[0]),s=prog(a[0]);return `<button class="tile ${u?'':'lock'} ${nxt&&nxt[0]===a[0]?'next':''}" ${u?`onclick="go('act','${a[0]}')"`:''}><span class="e">${u?a[3]:'🔒'}</span><span>${a[2]}</span><span class="st">${u?starStr(s):''}</span></button>`};
 return `<div class="card" style="margin-bottom:16px"><div class="row" style="justify-content:space-between"><div><div style="font-weight:800;color:#7c3aed">${WORLD.unit}</div><h1>${WORLD.em} ${WORLD.title}</h1></div>${nxt?`<button class="btn big y" onclick="go('act','${nxt[0]}')">▶ الْعَبِ التَّالِيَ</button>`:'<h2>🏆 أَنْهَيْتَ الْوَحْدَةَ!</h2>'}</div>${sayBuzzy(nxt?`${NM()}، مُهِمَّتُكَ التَّالِيَةُ: <b>${nxt[2]}</b>`:`رَائِعٌ ${NM()}! لَقَدْ أَنْهَيْتَ وَحْدَةَ ${WORLD.title}! 🏆`)}</div>
 ${arenaGate()}<div class="lessons">${WORLD.lessons.map(l=>`<div class="card"><h3>${l.t}</h3>${l.acts.map(tile).join('')}</div>`).join('')}<div class="card"><h3>تَدَرَّبْ فِي أَيِّ وَقْتٍ</h3>${WORLD.free.map(tile).join('')}</div></div>`}

/* ---------- parent log: each finished activity is sent to the parent's Google Sheet (queued while offline) ---------- */
const SYNC_URL='https://script.google.com/macros/s/AKfycbzKQRUIOLfSS_WkOeClwo1mjmxThc_t5adPUHGoZQBobhj8DxtSByGynm5fGEB6rEKRJg/exec';const SYNC_KEY='sq-66b5e786fffb';let actStart=0,actMissed=[];
const SQ_Q='ssqSyncQ';const syncQ=()=>{try{return JSON.parse(localStorage.getItem(SQ_Q)||'[]')}catch(e){return []}},syncSet=q=>{try{localStorage.setItem(SQ_Q,JSON.stringify(q.slice(-500)))}catch(e){}};
function logEv(type,o={}){try{const p=P();if(!p)return;const q=syncQ();q.push({t:Date.now(),child:p.name,world:'دراسات · '+noTash((typeof WORLD!=='undefined'&&WORLD&&WORLD.title)||PAGE),act:noTash(o.act||''),type,stars:o.stars==null?'':o.stars,detail:noTash(o.detail||''),min:actStart?Math.max(0,Math.round((performance.now()-actStart)/6000)/10):''});syncSet(q);flushSync()}catch(e){}}
let syncBusy=false;function flushSync(){if(!SYNC_URL||syncBusy||!navigator.onLine)return;const q=syncQ();if(!q.length)return;const part=q.slice(0,40);syncBusy=true;fetch(SYNC_URL,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({key:SYNC_KEY,rows:part})}).then(()=>{const now=syncQ();syncSet(now.slice(part.length))}).catch(()=>{}).finally(()=>{syncBusy=false;if(syncQ().length&&navigator.onLine)setTimeout(flushSync,3000)})}
window.addEventListener('online',flushSync);setInterval(flushSync,90000);setTimeout(flushSync,4000);
const actName=id=>{try{return ACT[id][2]}catch(e){return id}};
const STW=['','نَجْمَةٍ وَاحِدَةٍ','نَجْمَتَيْنِ','ثَلَاثِ نُجُومٍ'];
function finish(id,st,msg=''){award(id,st);logEv('activity',{act:actName(id),stars:st,detail:actMissed.length?'أخطاء: '+[...new Set(actMissed)].slice(0,6).join(' | '):''});refreshTop();SFX.star();confetti();const i=ORDER.findIndex(a=>a[0]===id),nx=ORDER[i+1];const praise=st===3?'أَنْتَ نَجْمٌ':st===2?'عَمَلٌ رَائِعٌ':'مُحَاوَلَةٌ جَيِّدَةٌ';speak(`${praise}! حَصَلْتَ عَلَى ${STW[st]}!`);
 $('act').innerHTML=`<div class="card center pop"><h1>${praise} ${NM()}! 🎉</h1><div style="font-size:70px;color:#f5a500;letter-spacing:6px">${starStr(st)}</div>${avatar(P().avatar,'cheer','bounce" style="width:170px;height:204px;margin:auto')}${msg?`<p style="font-size:24px;margin-bottom:0">${msg}</p>`:''}<div class="row" style="margin-top:14px"><button class="btn w" onclick="go('act','${id}')">🔁 الْعَبْ مَرَّةً أُخْرَى</button>${nx&&ACT[id][1]!=='flash'?`<button class="btn g big" onclick="go('act','${nx[0]}')">التَّالِي: ${nx[3]} ${nx[2]} ⬅</button>`:''}<button class="btn b" onclick="go('world')">🏠 الْوَحْدَةُ</button></div></div>`}
const ratio=r=>r>=.9?3:r>=.6?2:1;
function head(id,sub){return `<div class="row" style="justify-content:space-between;margin-bottom:8px"><h2 style="color:#fff">${ACT[id][3]} ${ACT[id][2]}</h2><button class="btn sm w" onclick="go('world')">✖ خُرُوجٌ</button></div>${sub?`<div style="color:#fff;margin-top:-6px;margin-bottom:8px;font-weight:700">${sub}</div>`:''}`}
function startAct(id){actTok++;actStart=performance.now();actMissed=[];const t=ACT[id][1];ACTS[t](id)}

/* ---------- learn ---------- */
function learn(id){const cards=LEARN[id];let i=0;const draw=()=>{const c=cards[i];$('act').innerHTML=head(id)+`<div class="card pop"><div style="max-width:980px;margin:0 auto">${art(c.art)}</div>${typeof HOT!=='undefined'&&HOT[c.art]?`<div class="hothint">✨ 👆 <span id="hotc">🔍 ٠ / ${ad(HOT[c.art].length)}</span></div>`:''}<p class="lt">${c.t}</p><div class="row" style="margin-top:10px"><button class="btn sm w" id="sar">🔊 اسْتَمِعْ</button></div><div class="row" style="margin-top:16px;justify-content:space-between"><button class="btn w" ${i?'':'style="visibility:hidden"'} id="pv">➡ السَّابِقُ</button><span style="font-weight:800;font-size:22px">${'🟣'.repeat(i+1)}${'⚪'.repeat(cards.length-i-1)}</span><button class="btn g big" id="nx">${i<cards.length-1?'التَّالِي ⬅':'تَمَّ ✓'}</button></div></div>`;
 speak(c.t);$('sar').onclick=()=>speak(c.t);$('pv').onclick=()=>{if(i<=0)return;SFX.click();i--;draw()};$('nx').onclick=()=>{SFX.click();if(++i<cards.length)draw();else finish(id,3,'لَقَدْ تَعَلَّمْتَ! هَيَّا نَلْعَبِ الْآنَ. 🎮')}};draw()}

/* ---------- quiz engine (the book's question styles) ---------- */
const QK={mcq:'اخْتَرِ الْإِجَابَةَ الصَّحِيحَةَ:',fill:'أَكْمِلْ:',tf:'صَوَابٌ أَمْ خَطَأٌ؟',why:'بِمَ تُفَسِّرُ؟',fix:'صَوِّبْ مَا تَحْتَهُ خَطٌّ:',mean:'مَا الْمَقْصُودُ بِـ:',rel:'مَا الْعَلَاقَةُ بَيْنَ:',res:'مَا النَّتَائِجُ الْمُتَرَتِّبَةُ عَلَى:',odd:'اسْتَخْرِجِ الْكَلِمَةَ الشَّاذَّةَ:',who:'اكْتُبْ مَا تُشِيرُ إِلَيْهِ الْعِبَارَةُ:',dl:'دَلِّلْ عَلَى صِحَّةِ الْعِبَارَةِ:',sort:'صَنِّفْ:',map:'مِنَ الْخَرِيطَةِ:'};
const qOpts=q=>q.k==='tf'?(q.a?['صَوَابٌ ✅','خَطَأٌ ❌']:['خَطَأٌ ❌','صَوَابٌ ✅']):q.o;
const qSay=q=>`${QK[q.k||'mcq']} ${clean(q.q)}`;
const PRAISE=['أَحْسَنْتَ!','إِجَابَةٌ صَحِيحَةٌ!','رَائِعٌ!','مُمْتَازٌ!','أَنْتَ بَطَلٌ!'];
function runQuiz(id,qs,opt){let i=0,score=0,retry=[],firstPass=true,lives=opt.lives,hp=qs.length;
 const draw=()=>{if(i>=qs.length){if(retry.length&&!opt.boss){qs=retry;retry=[];i=0;firstPass=false;$('act').innerHTML=head(id)+`<div class="card center pop">${sayBuzzy('هَيَّا نُحَاوِلِ الْأَسْئِلَةَ الصَّعْبَةَ مَرَّةً أُخْرَى! 💪')}<button class="btn g big" id="gq">هَيَّا ⬅</button></div>`;speak('هَيَّا نُحَاوِلِ الْأَسْئِلَةَ الصَّعْبَةَ مَرَّةً أُخْرَى!');$('gq').onclick=draw;return}return opt.done(score)}
  const q=qs[i],os=qOpts(q),ord=q.k==='tf'?os.map((t,k)=>({t,k})).sort((a,b)=>a.t.startsWith('صَوَاب')?-1:1):shuffle(os.map((t,k)=>({t,k})));
  $('act').innerHTML=head(id)+(opt.boss?bossBar(hp,qs.length,lives):'')+`<div class="card pop"><div style="font-weight:700;color:#8c5cff">${firstPass?`السُّؤَالُ ${ad(i+1)} مِنْ ${ad(qs.length)}`:'حَاوِلْ مَرَّةً أُخْرَى'}</div><div class="qk">${QK[q.k||'mcq']}</div>${q.art?`<div style="max-width:520px;margin:0 auto">${art(q.art)}</div>`:''}<p class="qq">${q.q}</p><div class="row" style="justify-content:flex-start"><button class="btn sm w" id="qar">🔊 اسْتَمِعْ</button></div>${opt.timer?'<div class="timebar"><div id="tb" style="width:100%"></div></div>':''}<div id="opts" class="${q.k==='tf'?'tfrow':''}">${ord.map(o=>`<button class="btn opt" data-k="${o.k}">${o.t}</button>`).join('')}</div><div id="fb"></div></div>`;
  speak(qSay(q));$('qar').onclick=()=>speak(qSay(q));
  let done=false,tmr;const answer=(k,el)=>{if(done)return;done=true;clearInterval(tmr);const ok=k===0;document.querySelectorAll('.opt').forEach(b=>{b.disabled=true;if(+b.dataset.k===0)b.classList.add('right')});
   if(ok){if(firstPass)score++;hp--;el&&el.classList.add('right');SFX.good();if(opt.boss){play('boom',.7);hitBoss()}const qi=i;speakP(shuffle(PRAISE)[0]).then(()=>{if(i===qi&&$('fb'))speakP(q.why)})}
   else{el&&el.classList.add('wrong','shake');SFX.bad();try{actMissed.push(noTash(clean(q.q)).slice(0,70))}catch(e){}if(firstPass&&!opt.boss)retry.push(q);if(opt.boss){lives--;bossAttack();play('boom',.4)}later(()=>speak(q.why),350)}
   $('fb').innerHTML=`<div class="say" style="margin-top:12px">${ok?me('cheer'):buzzy()}<div class="bubble pop">${ok?'✅ ':'💡 '}${q.why}</div></div><div class="center"><button class="btn g big" id="nq">التَّالِي ⬅</button></div>`;
   $('nq').onclick=()=>{SFX.click();i++;if(opt.boss&&lives<=0)return opt.lose(score);draw()}};
  document.querySelectorAll('.opt').forEach(b=>b.onclick=()=>answer(+b.dataset.k,b));
  if(opt.timer){let t=0;tmr=every(()=>{if(VB)return;t+=.1;const w=Math.max(0,100-t/opt.timer*100);if($('tb'))$('tb').style.width=w+'%';if(w<=0)answer(-1,null)},100)}};draw()}
function quiz(id){const n=calm()?6:9;const qs=shuffle(QB[id]).slice(0,n);runQuiz(id,qs,{done:s=>finish(id,ratio(s/qs.length),`أَجَبْتَ ${ad(s)} مِنْ ${ad(qs.length)} إِجَابَاتٍ صَحِيحَةٍ مِنَ الْمُحَاوَلَةِ الْأُولَى!`)})}

/* ---------- boss ---------- */
function monsterSVG(B){const c=B.col,d=shade(c,-28),l=shade(c,25),eye=B.eye||'#fff';return `<g class="mon-body"><ellipse cx="120" cy="244" rx="92" ry="12" fill="#000" opacity=".25"/><path d="M70 200 L60 240 L95 240 L98 205Z M170 200 L180 240 L145 240 L142 205Z" fill="${d}"/><path d="M50 238 h50 v8 h-50Z M140 238 h50 v8 h-50Z" fill="#1f1b2e"/><g class="mon-armL"><path d="M38 120 Q4 150 14 196 Q22 204 30 196 Q30 160 54 140Z" fill="${c}"/><path d="M10 196 l-6 12 M18 200 l-2 13 M26 198 l4 12" stroke="#fff" stroke-width="4" stroke-linecap="round"/></g><g class="mon-armR"><path d="M202 120 Q236 150 226 196 Q218 204 210 196 Q210 160 186 140Z" fill="${c}"/><path d="M230 196 l6 12 M222 200 l2 13 M214 198 l-4 12" stroke="#fff" stroke-width="4" stroke-linecap="round"/></g><path d="M120 40 C40 40 30 120 36 168 C42 214 80 222 120 222 C160 222 198 214 204 168 C210 120 200 40 120 40Z" fill="${c}"/><path d="M120 40 C60 44 46 100 46 140 C60 90 90 60 120 56Z" fill="${l}" opacity=".5"/><path d="M74 46 L56 6 L92 38Z M166 46 L184 6 L148 38Z" fill="${d}"/><ellipse cx="120" cy="170" rx="50" ry="40" fill="${l}" opacity=".55"/><text x="120" y="186" text-anchor="middle" font-size="40">${B.em}</text><circle cx="90" cy="98" r="22" fill="${eye}"/><circle cx="150" cy="98" r="22" fill="${eye}"/><circle class="pupil" cx="84" cy="100" r="10" fill="#111"/><circle class="pupil" cx="144" cy="100" r="10" fill="#111"/><path d="M64 70 L110 84 M176 70 L130 84" stroke="#111" stroke-width="7" stroke-linecap="round"/><path d="M76 132 Q120 158 164 132 Q120 146 76 132Z" fill="#3b0d0d"/><path d="M86 136 l6 10 l6 -8 l6 10 l6 -9 l6 10 l6 -9 l6 10 l6 -8 l6 9" stroke="#fff" stroke-width="3" fill="none"/></g>`}
function bossBar(hp,max,lives){const B=BS();return `<div class="card" style="margin-bottom:12px;padding:12px"><div class="row" style="justify-content:space-between;align-items:center"><div><b>${esc(P().name)}</b></div><div style="font-size:26px">${'❤️'.repeat(Math.max(0,lives))}${'🤍'.repeat(Math.max(0,(calm()?5:3)-lives))}</div><div style="flex:1;min-width:200px"><b>${B.name}</b><div class="hp"><div style="width:${hp/max*100}%"></div></div></div></div><svg viewBox="0 0 700 270" id="arena" style="display:block;max-height:320px;margin:0 auto;direction:ltr"><defs><linearGradient id="gArena" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(B.col,55)}"/><stop offset="1" stop-color="${shade(B.col,15)}"/></linearGradient></defs><rect width="700" height="270" rx="18" fill="url(#gArena)"/><ellipse cx="350" cy="262" rx="330" ry="26" fill="#000" opacity=".15"/><g transform="translate(60,40)"><g id="hero" style="transition:transform .18s ease-out"><g id="heroS">${nest(avatar(P().avatar,'cheer'),'width="170" height="204"')}<text id="fist" x="160" y="120" font-size="54" opacity="0">👊</text></g></g></g><g transform="translate(430,10)"><g id="boss" style="transition:transform .2s ease-out"><g id="bossS">${monsterSVG(B)}</g></g></g><g id="pow" opacity="0" style="transition:opacity .15s"><path d="M470 60 l18 30 l34 -14 l-12 32 l34 12 l-34 12 l12 32 l-34 -14 l-18 30 l-18 -30 l-34 14 l12 -32 l-34 -12 l34 -12 l-12 -32 l34 14Z" fill="#ffd23f" stroke="#e85d04" stroke-width="4"/><text x="470" y="132" text-anchor="middle" font-size="30" font-weight="900" fill="#b91c1c">بُوم!</text></g></svg></div>`}
function hitBoss(){const h=$('hero'),b=$('boss'),bs=$('bossS'),f=$('fist'),pw=$('pow');if(!h||!b)return;h.style.transform='translate(210px,-10px)';if(f)f.setAttribute('opacity',1);setTimeout(()=>{if(pw)pw.setAttribute('opacity',1);b.style.transform='translate(40px,-4px) rotate(8deg)';if(bs){bs.classList.remove('shake');void bs.getBBox();bs.classList.add('shake')}},170);setTimeout(()=>{h.style.transform='';if(f)f.setAttribute('opacity',0)},420);setTimeout(()=>{if(pw)pw.setAttribute('opacity',0);b.style.transform=''},700)}
function bossAttack(){const h=$('hero'),hs=$('heroS'),b=$('boss');if(!h||!b)return;b.style.transform='translate(-130px,0)';setTimeout(()=>{if(hs){hs.classList.remove('shake');void hs.getBBox();hs.classList.add('shake')}h.style.transform='translate(-40px,6px)'},200);setTimeout(()=>{b.style.transform='';h.style.transform=''},650)}
function boss(id){const B=BS(),all=shuffle(B.qs.flatMap(k=>QB[k])).slice(0,calm()?8:12),lv=calm()?5:3;$('act').innerHTML=head(id,'التَّحَدِّي النِّهَائِيُّ')+`<div class="card center pop">${sayBuzzy(`احْذَرْ ${NM()}! لَقَدْ جَاءَ <b>${B.name}</b>! أَجِبْ إِجَابَاتٍ صَحِيحَةً لِتَهْزِمَهُ. مَعَكَ ${ad(lv)} قُلُوبٍ.`)}<button class="btn big" id="gb">⚔️ هَيَّا نُقَاتِلْ!</button></div>`;play(B.snd,.35);speak(`احْذَرْ! لَقَدْ جَاءَ ${B.name}! أَجِبْ إِجَابَاتٍ صَحِيحَةً لِتَهْزِمَهُ.`);
 $('gb').onclick=()=>runQuiz(id,all,{boss:1,lives:lv,timer:calm()?0:25,done:s=>finish(id,ratio(s/all.length),`هَزَمْتَ ${B.acc}! 👾💥 وَفُتِحَ الْعَرْضُ الْإِضَافِيُّ!`),lose:s=>{SFX.bad();logEv('boss lost',{act:BS().name,detail:s+' صحيحة'});$('act').innerHTML=head(id)+`<div class="card center pop">${sayBuzzy(`هَرَبَ الْوَحْشُ هَذِهِ الْمَرَّةَ. أَجَبْتَ ${ad(s)} إِجَابَاتٍ صَحِيحَةً. هَيَّا نُحَاوِلْ مَرَّةً أُخْرَى! 💪`)}<div class="row"><button class="btn big g" onclick="go('act','boss')">🔁 حَاوِلْ مَرَّةً أُخْرَى</button><button class="btn b" onclick="go('world')">الْعَوْدَةُ إِلَى الْوَحْدَةِ</button></div></div>`;speak('هَرَبَ الْوَحْشُ هَذِهِ الْمَرَّةَ. هَيَّا نُحَاوِلْ مَرَّةً أُخْرَى!')}})}

/* ---------- journey (ordering) ---------- */
function journey(id){let r=0,mist=0;const draw=()=>{const R=ROUNDS[r];let pos=0;const tiles=shuffle(R.s.map((t,k)=>({t,k})));
 $('act').innerHTML=head(id)+`<div class="card pop">${sayMe('اضْغَطْ عَلَى الْخُطُوَاتِ بِالتَّرْتِيبِ الصَّحِيحِ!')}<h3>${R.t}</h3><div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px;margin-top:8px"><div>${R.s.map((_,k)=>`<div class="slot" id="sl${k}">${ad(k+1)}.</div>`).join('')}</div><div id="tl">${tiles.map(o=>`<button class="btn opt" data-k="${o.k}">${o.t}</button>`).join('')}</div></div><div id="fb"></div></div>`;
 speak(`${clean(R.t)} اضْغَطْ عَلَى الْخُطُوَاتِ بِالتَّرْتِيبِ الصَّحِيحِ.`);
 document.querySelectorAll('#tl .opt').forEach(b=>b.onclick=()=>{if(+b.dataset.k===pos){SFX.good();const s=$('sl'+pos);s.innerHTML=ad(pos+1)+'. '+b.innerHTML;s.classList.add('full','pop');b.style.visibility='hidden';pos++;if(pos===R.s.length){speak('مُمْتَازٌ! تَرْتِيبٌ صَحِيحٌ.');$('fb').innerHTML=`<div class="say pop" style="margin-top:8px">${me('cheer')}<div class="bubble">✅ مُمْتَازٌ! تَرْتِيبٌ صَحِيحٌ.</div></div><div class="center" style="margin-top:10px"><button class="btn g big" id="nr">${r<ROUNDS.length-1?'الْجَوْلَةُ التَّالِيَةُ ⬅':'إِنْهَاءٌ ✓'}</button></div>`;$('nr').onclick=()=>{SFX.click();if(++r<ROUNDS.length)draw();else finish(id,mist<=1?3:mist<=4?2:1,'رَتَّبْتَ كُلَّ الْخُطُوَاتِ تَرْتِيبًا صَحِيحًا!')}}}else{mist++;SFX.bad();b.classList.remove('shake');void b.offsetWidth;b.classList.add('shake');speak('فَكِّرْ مَرَّةً أُخْرَى: مَاذَا يَأْتِي أَوَّلًا؟');$('fb').innerHTML=`<div class="say pop" style="margin-top:8px">${buzzy()}<div class="bubble">💡 فَكِّرْ مَرَّةً أُخْرَى: مَاذَا يَأْتِي أَوَّلًا؟</div></div>`}})};draw()}

/* ---------- word game: the lesson's key words (hear the meaning, choose the word) ---------- */
function words(id){const list=VOCAB[id]||[],n=Math.min(list.length,calm()?5:7),deck=shuffle(list).slice(0,n);let i=0,pts=0;
 const hd=()=>head(id,'مَعَانِي الْكَلِمَاتِ');
 const meaning=()=>{if(i>=n)return finish(id,ratio(pts/n),`عَرَفْتَ مَعَانِيَ ${ad(n)} كَلِمَاتٍ! 🔤`);const w=deck[i];const others=shuffle(list.filter(x=>x[0]!==w[0])).slice(0,2);let first=true;
  $('act').innerHTML=hd()+`<div class="card center pop"><div style="font-weight:700;color:#8c5cff">الْكَلِمَةُ ${ad(i+1)} مِنْ ${ad(n)}</div><div class="mean">${w[1]}</div><button class="btn sm w" id="wsay">🔊 اسْتَمِعْ</button><h3 style="margin-top:10px">أَيُّ كَلِمَةٍ لَهَا هَذَا الْمَعْنَى؟</h3><div>${shuffle([w,...others].map(x=>({x,ok:x===w}))).map(o=>`<button class="btn opt" data-ok="${o.ok?1:0}" style="text-align:center;font-size:30px">${o.x[0]}</button>`).join('')}</div><div id="fb" style="min-height:60px"></div></div>`;
  const line=`${clean(w[1])}. أَيُّ كَلِمَةٍ لَهَا هَذَا الْمَعْنَى؟`;$('wsay').onclick=()=>speak(line);speakP(line);
  document.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{if(+b.dataset.ok){b.classList.add('right');document.querySelectorAll('.opt').forEach(x=>x.disabled=true);SFX.good();if(first)pts++;hush();$('fb').innerHTML=`<div class="say pop" style="margin-top:8px">${me('cheer')}<div class="bubble">✅ <b>${w[0]}</b>: ${w[1]}</div></div>`;speakP(w[0]).then(()=>later(()=>{i++;meaning()},700))}else{first=false;b.classList.add('wrong','shake');b.disabled=true;SFX.bad();speak('لَيْسَتْ هَذِهِ. حَاوِلْ مَرَّةً أُخْرَى!')}})};
 $('act').innerHTML=hd()+`<div class="card center pop">${sayMe('هَذِهِ هِيَ الْكَلِمَاتُ الْمُهِمَّةُ فِي هَذَا الدَّرْسِ! اسْتَمِعْ إِلَى الْمَعْنَى، ثُمَّ اخْتَرِ الْكَلِمَةَ الصَّحِيحَةَ.')}<button class="btn g big" id="wgo">🔤 هَيَّا نَبْدَأْ</button></div>`;
 speak('هَذِهِ هِيَ الْكَلِمَاتُ الْمُهِمَّةُ فِي هَذَا الدَّرْسِ! اسْتَمِعْ إِلَى الْمَعْنَى، ثُمَّ اخْتَرِ الْكَلِمَةَ الصَّحِيحَةَ.');$('wgo').onclick=()=>{SFX.click();meaning()}}

/* ---------- word cards ---------- */
function flash(id){let deck=shuffle(WORDS),known=0;const tot=deck.length;const draw=()=>{if(!deck.length)return finish(id,3,`أَنْتَ تَعْرِفُ كُلَّ الْكَلِمَاتِ! 🧠`);const w=deck[0];const mf=!!S.flashM,front=mf?`<div style="font-size:60px">${w[0]}</div><h2>${w[2]}</h2><span style="color:#889">مَا الْكَلِمَةُ؟ اضْغَطْ لِلْقَلْبِ 🔄</span>`:`<div style="font-size:80px">${w[0]}</div><h1>${w[1]}</h1><span style="color:#889">مَا مَعْنَاهَا؟ اضْغَطْ لِلْقَلْبِ 🔄</span>`,back=mf?`<div style="font-size:50px">${w[0]}</div><h1>${w[1]}</h1>`:`<div style="font-size:50px">${w[0]}</div><h2>${w[2]}</h2>`;
 $('act').innerHTML=head(id,'بِطَاقَاتُ الْكَلِمَاتِ')+`<div class="card center pop"><div style="font-weight:700;color:#8c5cff">✅ ${ad(known)} مِنْ ${ad(tot)}</div><div class="row"><button class="optbtn ${mf?'':'on'}" id="mW">الْكَلِمَةُ أَوَّلًا</button><button class="optbtn ${mf?'on':''}" id="mM">الْمَعْنَى أَوَّلًا</button></div><div class="flip" id="fc"><div class="in"><div class="f">${front}</div><div class="bk">${back}</div></div></div><div class="row"><button class="btn sm w" id="fsay">🔊 اسْتَمِعْ</button></div><div class="row" style="margin-top:14px"><button class="btn" id="ag">🔁 مَرَّةً أُخْرَى</button><button class="btn g" id="kn">✅ أَعْرِفُهَا!</button></div></div>`;speak(mf?w[2]:w[1]);$('mW').onclick=()=>{S.flashM=false;save();SFX.click();draw()};$('mM').onclick=()=>{S.flashM=true;save();SFX.click();draw()};
 $('fsay').onclick=()=>speakP(w[1]).then(()=>speakP(w[2]));$('fc').onclick=()=>{$('fc').classList.toggle('on');SFX.click()};$('kn').onclick=()=>{SFX.good();known++;deck.shift();draw()};$('ag').onclick=()=>{SFX.click();deck.push(deck.shift());draw()}};draw()}

/* ---------- the Grand Challenge (Educaplay series) ---------- */
const RANKS=[['🌱','مُبْتَدِئٌ'],['🔍','مُسْتَكْشِفٌ'],['🥉','بُرُونْزِيٌّ'],['🥈','فِضِّيٌّ'],['🥇','ذَهَبِيٌّ'],['💎','مَاسِيٌّ']];
const BS=()=>Object.assign({name:'وَحْشُ الزِّحَامِ',acc:'وَحْشَ الزِّحَامِ',em:'🚗',col:'#5b3cff',snd:'siren',qs:['q1']},WORLD&&WORLD.boss||{});
const CH=()=>Object.assign({champ:'بَطَلُ الْوَحْدَةِ',title:'التَّحَدِّي الْكَبِيرُ'},WORLD&&WORLD.grand||{});
const NG=()=>GAMES.length;
const NGW=()=>['','لُعْبَةٍ وَاحِدَةٍ','لُعْبَتَيْنِ','ثَلَاثِ أَلْعَابٍ','أَرْبَعِ أَلْعَابٍ','خَمْسِ أَلْعَابٍ','سِتِّ أَلْعَابٍ','سَبْعِ أَلْعَابٍ'][NG()];
const rank=d=>d===NG()?['👑',CH().champ]:RANKS[Math.min(d,RANKS.length-1)];
const G=()=>{const p=P();p.grand=p.grand||{};if(typeof p.grand[WORLD.id]!=='object'||!p.grand[WORLD.id])p.grand[WORLD.id]={};return p.grand[WORLD.id]};
const gDone=()=>GAMES.filter(g=>G()[g.id]!=null).length;
const gTotal=()=>GAMES.reduce((a,g)=>a+(G()[g.id]||0),0);
const gOpen=()=>P().unlockAll||prog('boss')>0;
const gStageOpen=i=>gOpen()&&(i===0||G()[GAMES[i-1].id]!=null);
function arenaGate(){if(!NG())return '';const open=gOpen(),d=gDone();return `<div class="gate ${open?'':'locked'}" onclick="${open?"go('act','grand')":"gateLocked()"}" id="gate"><div class="rays"></div><div class="gate-in"><div class="trophy">🏆</div><div style="flex:1;min-width:240px"><div class="gate-kicker">${open?(d===NG()?'بَطَلٌ!':'السَّاحَةُ مَفْتُوحَةٌ!'):'🔒 مُغْلَقَةٌ'}</div><h1 class="gate-title">${CH().title}</h1><div style="font-weight:700;margin:4px 0 8px">${open?`${ad(NG())} أَلْعَابٍ · كُلُّ لُعْبَةٍ تَشْمَلُ الْوَحْدَةَ كُلَّهَا · اجْمَعِ النِّقَاطَ وَكُنْ <b>${CH().champ}</b> 👑`:`اهْزِمْ 👾 ${BS().acc} لِتَفْتَحَ الْبَوَّابَةَ!`}</div><div class="medals">${GAMES.map((g,i)=>`<span class="medal ${G()[g.id]!=null?'won':''}" title="${g.name}">${G()[g.id]!=null?g.em:(gStageOpen(i)?g.em:'🔒')}</span>`).join('<span class="dash"></span>')}</div></div><div class="center">${open?`<div class="pts">${ad(gTotal())}</div><div style="font-weight:800">نُقْطَةً</div><button class="btn big y" style="margin-top:8px">⚔️ ادْخُلْ!</button>`:''}</div></div></div>`}
function gateLocked(){const g=$('gate');g.classList.remove('shake');void g.offsetWidth;g.classList.add('shake');SFX.bad();speak(`الْبَوَّابَةُ مُغْلَقَةٌ! اهْزِمْ ${BS().acc} أَوَّلًا.`)}
function grand(id){let sel=Math.min(gDone(),NG()-1);
 const draw=()=>{const d=gDone(),tot=gTotal(),rk=rank(d);
  $('act').innerHTML=head(id)+`<div class="arena"><div class="rays"></div><div style="position:relative">
  <div class="row" style="justify-content:space-between;align-items:center"><div class="row" style="justify-content:flex-start">${avatar(P().avatar,d===NG()?'cheer':'wave','bounce" style="width:110px;height:132px')}<div><div class="gate-kicker">${rk[0]} ${rk[1]}</div><div style="font-weight:700">فُزْتَ فِي ${ad(d)} مِنْ ${ad(NG())} أَلْعَابٍ</div></div></div><div class="center"><div class="pts" id="ptot">${ad(tot)}</div><div style="font-weight:800">مَجْمُوعُ النِّقَاطِ</div></div></div>
  <div class="gbar"><div style="width:${d/NG()*100}%"></div></div>
  <div class="stages" style="--ng:${NG()}">${GAMES.map((g,i)=>{const op=gStageOpen(i),sc=G()[g.id];return `<button class="stage ${sel===i?'sel':''} ${op?'':'lock'} ${sc!=null?'won':''}" data-i="${i}" style="--c:${g.col}"><div class="snum">${ad(i+1)}</div><div class="sem">${op?g.em:'🔒'}</div><div class="sname">${g.name}</div><div class="sscore">${sc!=null?'⭐ '+ad(sc):op?'▶ جَاهِزَةٌ!':'مُغْلَقَةٌ'}</div>${d===i&&op?`<div class="here">${avatar(P().avatar,'idle','" style="width:46px;height:55px')}</div>`:''}</button>`}).join('')}</div></div></div>
  <div class="card pop" id="gpanel" style="margin-top:16px"></div>`;
  document.querySelectorAll('.stage').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;if(!gStageOpen(i)){b.classList.remove('shake');void b.offsetWidth;b.classList.add('shake');SFX.bad();speak('فُزْ فِي اللُّعْبَةِ الَّتِي قَبْلَهَا أَوَّلًا!');return}SFX.click();sel=i;draw()});
  panel()};
 const panel=()=>{const g=GAMES[sel],sc=G()[g.id],box=$('gpanel');
  box.innerHTML=`<div class="row" style="justify-content:flex-start;align-items:center"><div style="font-size:80px" class="bounce">${g.em}</div><div style="flex:1"><div style="color:${g.col};font-weight:800">اللُّعْبَةُ ${ad(sel+1)} مِنْ ${ad(NG())} · ${g.kind}</div><h2>${g.name}</h2><p style="margin:4px 0">${g.how}</p></div></div>
  ${g.url?`<div class="center" style="margin:12px 0"><a class="btn big g" href="${g.url}" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer" id="gplay" style="text-decoration:none;display:inline-block">▶ الْعَبْ: ${g.name}</a><div style="margin-top:8px"><button class="btn sm w" id="gcopy">📋 انْسَخْ رَابِطَ اللُّعْبَةِ</button> <span id="gcopied" style="font-weight:700;color:#22b46e"></span></div><div style="color:#667;font-size:17px;margin-top:6px">تُفْتَحُ اللُّعْبَةُ فِي صَفْحَةٍ جَدِيدَةٍ. عِنْدَمَا تَنْتَهِي، ارْجِعْ إِلَى هُنَا!</div></div>
  <div class="card" style="background:#fff8e1;box-shadow:none;border:3px solid #ffd76a"><b>🏁 انْتَهَيْتَ؟ اكْتُبِ النَّتِيجَةَ الَّتِي حَصَلْتَ عَلَيْهَا:</b><form id="gform" class="row" style="justify-content:flex-start;margin-top:8px"><input class="name" id="gsc" type="number" min="0" max="100000" inputmode="numeric" placeholder="النَّتِيجَةُ" style="width:180px;font-size:26px"><button class="btn g" type="submit">احْفَظْ نِقَاطِي ⭐</button></form><div class="err" id="gerr"></div>${sc!=null?`<div style="font-weight:700">أَفْضَلُ نَتِيجَةٍ لَكَ: ⭐ ${ad(sc)}. الْعَبْ مَرَّةً أُخْرَى لِتَتَفَوَّقَ عَلَيْهَا!</div>`:''}</div>`
  :`<div class="center" style="margin:14px 0"><div style="font-size:50px">🛠️</div><h3>هَذِهِ اللُّعْبَةُ قَيْدَ الْبِنَاءِ، قَرِيبًا!</h3></div>`}`;
  if(g.url){$('gcopy').onclick=async()=>{try{await navigator.clipboard.writeText(g.url);$('gcopied').textContent='تَمَّ النَّسْخُ! الْصِقْهُ فِي شَرِيطِ الْعُنْوَانِ.'}catch(e){$('gcopied').textContent=g.url}};$('gplay').onclick=e=>{if(!navigator.onLine){e.preventDefault();SFX.bad();const ar='هَذِهِ اللُّعْبَةُ عَلَى مَوْقِعِ إِيدُوكَابْلَايْ، لِذَلِكَ تَحْتَاجُ إِلَى الْإِنْتَرْنِتْ.';$('gcopied').innerHTML='📶 '+ar;speak(ar);return}SFX.click();speak('بِالتَّوْفِيقِ! ارْجِعْ إِلَى هُنَا وَاكْتُبْ نَتِيجَتَكَ عِنْدَمَا تَنْتَهِي.')};$('gsc').oninput=()=>$('gerr').textContent='';
   $('gform').onsubmit=e=>{e.preventDefault();const v=$('gsc').value.trim(),n=Math.round(+v);if(v===''||!isFinite(n)||n<0){$('gerr').textContent='اكْتُبْ نَتِيجَتَكَ أَوَّلًا ✍️';return}const first=G()[g.id]==null,best=Math.max(G()[g.id]||0,n);G()[g.id]=best;save();logEv('game',{act:g.name+' ('+g.kind+')',stars:'',detail:n+' نقطة'});SFX.star();confetti();
    const d=gDone();if(d===NG()&&first){speak(`مُذْهِلٌ! فُزْتَ فِي كُلِّ الْأَلْعَابِ! أَنْتَ ${CH().champ}!`);sel=NG()-1}else{speak(`رَائِعٌ! حَصَلْتَ عَلَى ${n} نُقْطَةً. مَجْمُوعُ نِقَاطِكَ ${gTotal()}.${first&&d<NG()?' اللُّعْبَةُ التَّالِيَةُ مَفْتُوحَةٌ!':''}`);if(first&&d<NG())sel=d}draw()}}};
 draw();speak(gDone()===NG()?'أَهْلًا بِعَوْدَتِكَ أَيُّهَا الْبَطَلُ!':`مَرْحَبًا بِكَ فِي سَاحَةِ التَّحَدِّي! فُزْ فِي ${NGW()} لِتُصْبِحَ ${CH().champAcc||CH().champ}!`)}

const ACTS={learn,quiz,journey,boss,flash,grand,words};

/* offline mode: after one visit with internet, the whole site and its voices work without internet */
try{if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost')){const me=document.currentScript&&document.currentScript.src;if(me){const sw=new URL('../sw.js',me).href,sc=new URL('../',me).href;window.addEventListener('load',()=>navigator.serviceWorker.register(sw,{scope:sc}).catch(()=>{}))}}}catch(e){}
