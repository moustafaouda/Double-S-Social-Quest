/* ---------- shared activity helpers: questions, feedback, dragging, sorting, matching ---------- */
const wait=ms=>new Promise(r=>later(r,ms));
const WRONG_TRY='لَيْسَتْ هَذِهِ. حَاوِلْ مَرَّةً أُخْرَى!';
function askBtns(box,q,opts,cb){let first=true;$(box).innerHTML=`<div class="card pop" style="box-shadow:none;border:3px solid #86efac;background:#f0fdf4"><b style="font-size:26px;line-height:1.8">${q}</b><div class="row" style="justify-content:flex-start;margin-top:6px"><button class="btn sm w" id="${box}s">🔊 اسْتَمِعْ</button></div><div>${shuffle(opts.map((o,k)=>({o,k}))).map(x=>`<button class="btn opt" data-k="${x.k}">${x.o}</button>`).join('')}</div></div>`;
 speakNext(clean(q));$(box+'s').onclick=()=>speak(clean(q));
 document.querySelectorAll(`#${box} .opt`).forEach(b=>b.onclick=()=>{const k=+b.dataset.k;if(k===0){b.classList.add('right');SFX.good();document.querySelectorAll(`#${box} .opt`).forEach(x=>x.disabled=true);cb(first)}else{first=false;b.classList.add('wrong','shake');b.disabled=true;SFX.bad();speak(WRONG_TRY)}})}
function factLine(box,t,say=true){$(box).innerHTML=`<div class="say pop" style="margin-top:8px">${me('cheer')}<div class="bubble">✅ ${t}</div></div>`;if(say)return speakP(t);return Promise.resolve()}
function oops(box,t){$(box).innerHTML=`<div class="say pop" style="margin-top:8px">${buzzy()}<div class="bubble">💡 ${t}</div></div>`;speak(t)}
function msnBox(i,n,t){return `<div class="msn">🎯 الْمُهِمَّةُ ${ad(i+1)} مِنْ ${ad(n)}: ${t}</div>`}
function nextBtn(box,label,fn){$(box).insertAdjacentHTML('beforeend',`<div class="center" style="margin-top:10px"><button class="btn g big" id="${box}nx">${label||'التَّالِي ⬅'}</button></div>`);$(box+'nx').onclick=()=>{SFX.click();fn()}}
/* pointer position in SVG viewBox units */
function svgPt(svg,e){const p=svg.createSVGPoint();const t=e.touches?e.touches[0]:e;p.x=t.clientX;p.y=t.clientY;return p.matrixTransform(svg.getScreenCTM().inverse())}
/* make <g data-drag="id" data-x data-y> elements draggable inside an svg; onDrop(id,x,y,g) returns true to keep, false to send back */
function dragKit(svg,cbs={}){svg._cb=cbs;
 const pos=(g,x,y)=>{g.dataset.cx=x;g.dataset.cy=y;g.setAttribute('transform',`translate(${x},${y})`)};
 svg.querySelectorAll('[data-drag]').forEach(g=>{if(g.dataset.cx==null){pos(g,+g.dataset.x,+g.dataset.y);g.classList.add('drag')}});
 if(!svg._dk){svg._dk=1;let cur=null,off=null;
  svg.addEventListener('pointerdown',e=>{const g=e.target.closest&&e.target.closest('[data-drag]');if(!g||g.dataset.lock)return;e.preventDefault();if(g.dataset.cx==null){pos(g,+g.dataset.x,+g.dataset.y)}cur=g;const p=svgPt(svg,e);off=[p.x-(+g.dataset.cx),p.y-(+g.dataset.cy)];svg.setPointerCapture&&svg.setPointerCapture(e.pointerId);g.parentNode.appendChild(g);svg._cb.onStart&&svg._cb.onStart(g.dataset.drag,g)});
  svg.addEventListener('pointermove',e=>{if(!cur)return;e.preventDefault();const p=svgPt(svg,e);pos(cur,p.x-off[0],p.y-off[1]);svg._cb.onMove&&svg._cb.onMove(cur.dataset.drag,p.x-off[0],p.y-off[1],cur)});
  const up=e=>{if(!cur)return;const g=cur;cur=null;const x=+g.dataset.cx,y=+g.dataset.cy;const keep=svg._cb.onDrop?svg._cb.onDrop(g.dataset.drag,x,y,g):true;if(!keep){g.style.transition='transform .35s';pos(g,+g.dataset.x,+g.dataset.y);setTimeout(()=>g.style.transition='',380)}};
  svg.addEventListener('pointerup',up);svg.addEventListener('pointercancel',up)}
 return {place:(g,x,y)=>{pos(g,x,y);g.dataset.lock=1;g.classList.remove('drag')},pos}}
function tween(g,x0,y0,x1,y1,ms=1500){const t0=performance.now();const f=t=>{const k=Math.min(1,(t-t0)/ms),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;g.setAttribute('transform',`translate(${x0+(x1-x0)*e},${y0+(y1-y0)*e})`);if(k<1&&g.isConnected)requestAnimationFrame(f)};requestAnimationFrame(f)}
const near=(x,y,tx,ty,r=60)=>Math.hypot(x-tx,y-ty)<=r;
const glowRing=(x,y,r=34,c='#f59e0b')=>`<g class="glow" pointer-events="none"><circle cx="${x}" cy="${y}" r="${r}" fill="${c}" opacity=".25"/><circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${c}" stroke-width="5" stroke-dasharray="10 7"><animateTransform attributeName="transform" type="rotate" from="0 ${x} ${y}" to="360 ${x} ${y}" dur="6s" repeatCount="indefinite"/></circle></g>`;

/* ---------- sorting game: drag the drawn card into the right drawn basket; every comment is spoken ---------- */
function sortGame(id){const D=SORTS[id];const items=shuffle(D.items).slice(0,calm()?7:D.items.length);let i=0,mist=0,done=0;const cnt=D.bins.map(()=>0);
 $('act').innerHTML=head(id)+`<div class="card pop"><div class="msn">🧺 ${D.t}</div><div class="row" style="justify-content:space-between"><b id="sleft" style="font-size:20px"></b></div><div id="sstage" class="sstage"></div><div class="sbins" style="--n:${D.bins.length}">${D.bins.map((b,k)=>`<div class="sbin" data-k="${k}"><div class="sbinart">${BINART[id][k]()}</div><div class="sbinname">${b}</div><div class="sbincnt" id="bc${k}"></div></div>`).join('')}</div><div id="fb"></div></div>`;
 speak(D.t);
 const draw=()=>{if(i>=items.length)return finish(id,mist<=1?3:mist<=4?2:1,'صَنَّفْتَ كُلَّ الصُّوَرِ تَصْنِيفًا صَحِيحًا!');const it=items[i];let first=true,missHere=0;$('sleft').textContent=`🃏 ${ad(i+1)} / ${ad(items.length)}`;
  $('sstage').innerHTML=`<div class="scard pop" id="sc">${SICON[it[0]]()}<div class="scardt">${it[1]}</div></div>`;$('fb').innerHTML='';
  speakNext(it[1]);
  const card=$('sc');let drag=null;
  const tryBin=k=>{if(k==null)return false;const binEl=document.querySelector(`.sbin[data-k="${k}"]`);if(k===it[2]){SFX.good();cnt[k]++;$('bc'+k).textContent='✓'.repeat(cnt[k]);binEl.classList.add('ok');setTimeout(()=>binEl.classList.remove('ok'),700);card.remove();const t='أَحْسَنْتَ! '+it[3];factLine('fb',t).then(()=>{i++;later(draw,300)});return true}
   if(first){mist++;try{actMissed.push(noTash(it[1]))}catch(e){}}first=false;missHere++;SFX.bad();binEl.classList.remove('shake');void binEl.offsetWidth;binEl.classList.add('shake');if(missHere>=2){oops('fb',it[3])}else{oops('fb',WRONG_TRY)}return false};
  card.onpointerdown=e=>{e.preventDefault();const r=card.getBoundingClientRect();drag={dx:e.clientX-r.left,dy:e.clientY-r.top};card.setPointerCapture(e.pointerId);card.classList.add('dragging');card.style.left=r.left+'px';card.style.top=r.top+'px';card.style.width=r.width+'px'};
  card.onpointermove=e=>{if(!drag)return;card.style.left=(e.clientX-drag.dx)+'px';card.style.top=(e.clientY-drag.dy)+'px';document.querySelectorAll('.sbin').forEach(b=>{const r=b.getBoundingClientRect();b.classList.toggle('hover',e.clientX>r.left&&e.clientX<r.right&&e.clientY>r.top&&e.clientY<r.bottom)})};
  card.onpointerup=e=>{if(!drag)return;drag=null;let hit=null;document.querySelectorAll('.sbin').forEach(b=>{const r=b.getBoundingClientRect();b.classList.remove('hover');if(e.clientX>r.left&&e.clientX<r.right&&e.clientY>r.top&&e.clientY<r.bottom)hit=+b.dataset.k});if(!tryBin(hit)){card.classList.remove('dragging');card.style.left=card.style.top=card.style.width=''}};
  document.querySelectorAll('.sbin').forEach(b=>b.onclick=()=>{if(card.isConnected)tryBin(+b.dataset.k)})};
 draw()}

/* ---------- matching game: tap an item on the right, then its partner on the left ---------- */
function matchGame(id){const D=MATCH[id];const pairs=D.pairs;let sel=null,done=0,mist=0;const L=shuffle(pairs.map((p,k)=>k)),R=shuffle(pairs.map((p,k)=>k));
 $('act').innerHTML=head(id)+`<div class="card pop">${sayBuzzy(D.t)}<div class="mgrid"><div>${L.map(k=>`<button class="mcard" data-s="a" data-k="${k}">${(D.pics||DEVS)[pairs[k][0]]()}<b>${pairs[k][1]}</b></button>`).join('')}</div><div>${R.map(k=>`<button class="mcard" data-s="b" data-k="${k}">${(D.pics||DEVS)[pairs[k][2]]()}<b>${pairs[k][3]}</b></button>`).join('')}</div></div><div id="fb"></div></div>`;
 speak(D.t);
 document.querySelectorAll('.mcard').forEach(b=>b.onclick=()=>{if(b.classList.contains('done'))return;const s=b.dataset.s,k=+b.dataset.k;
  if(!sel||sel.dataset.s===s){document.querySelectorAll('.mcard').forEach(x=>x.classList.remove('sel'));sel=b;b.classList.add('sel');SFX.click();speak(s==='a'?pairs[k][1]:pairs[k][3]);return}
  if(+sel.dataset.k===k){[sel,b].forEach(x=>{x.classList.remove('sel');x.classList.add('done')});SFX.good();done++;const t=D.say?D.say(pairs[k]):`قَدِيمًا: ${pairs[k][1]}، وَحَدِيثًا: ${pairs[k][3]}.`;factLine('fb',t);sel=null;if(done===pairs.length)later(()=>finish(id,mist<=1?3:mist<=3?2:1,D.end||'وَصَلْتَ كُلَّ أَدَاةٍ قَدِيمَةٍ بِالْجِهَازِ الْحَدِيثِ!'),2600)}
  else{mist++;SFX.bad();b.classList.add('shake');setTimeout(()=>b.classList.remove('shake'),500);speak(WRONG_TRY)}})}
Object.assign(ACTS,{sort:sortGame,match:matchGame});
