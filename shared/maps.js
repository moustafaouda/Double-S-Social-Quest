/* ---------- Egypt map renderer (data in egymap.js) ---------- */
const GROUP_C={b:'#a3d977',q:'#f7b9a6',h:'#fbe27a'};
const GROUP_N={b:'مُحَافَظَاتُ الْوَجْهِ الْبَحْرِيِّ',q:'مُحَافَظَاتُ الْوَجْهِ الْقِبْلِيِّ',h:'مُحَافَظَاتُ الْحُدُودِ الصَّحْرَاوِيَّةِ'};
const DELTA_VB='240 20 160 125';
/* label spots fixed by hand where the centre of the shape is not a good place */
const GOV_LBL={};
function egyMap(o={}){const vb=o.vb||`0 0 ${EGM.W} ${EGM.H}`,z=o.vb?(EGM.W/ +o.vb.split(' ')[2]):1,fs=(o.fs||15)/Math.sqrt(z);
 let s=`<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block;border-radius:16px;direction:ltr;background:#a9d8f5" class="${o.cls||''}">`;
 s+=`<rect x="-50" y="-50" width="${EGM.W+100}" height="${EGM.H+100}" fill="#a9d8f5"/>`;
 for(const k in EGM.nb)s+=`<path d="${EGM.nb[k].d}" fill="#efe6d6" stroke="#c8b8a0" stroke-width="${1/z}"/>`;
 for(const k in EGM.gov){const g=EGM.gov[k];const f=o.fill?o.fill(k,g):(o.groups?GROUP_C[g.g]:'#f4e7c8');s+=`<path d="${g.d}" fill="${f}" stroke="${o.stroke||'#8a7a66'}" stroke-width="${(o.sw||.7)/z}" data-g="${k}" class="gv"/>`}
 s+=`<path d="${EGM.out}" fill="none" stroke="#c2185b" stroke-width="${1.6/z}" stroke-dasharray="${6/z} ${3/z}" pointer-events="none"/>`;
 if(o.nile!==false)s+=`<g pointer-events="none"><path d="${EGM.nile}" fill="none" stroke="#1d72c9" stroke-width="${1.8/z}"/><path d="${EGM.canal}" fill="none" stroke="#1d72c9" stroke-width="${1.3/z}"/><path d="${EGM.nasser}" fill="#4fa3e3"/><path d="${EGM.bitter}" fill="#4fa3e3"/>${Object.values(EGM.small).map(([x,y,rx,ry,r])=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" transform="rotate(${r} ${x} ${y})" fill="#4fa3e3"/>`).join('')}</g>`;
 if(o.seas!==false&&!o.vb)s+=`<g pointer-events="none" font-weight="800" style="font-family:'Baloo Bhaijaan 2',sans-serif"><text x="160" y="24" font-size="15" fill="#1d4ed8" text-anchor="middle">الْبَحْرُ الْمُتَوَسِّطُ</text><text x="530" y="390" font-size="15" fill="#1d4ed8" text-anchor="middle" transform="rotate(58 530 390)">الْبَحْرُ الْأَحْمَرُ</text><text x="40" y="330" font-size="16" fill="#7c6a55" text-anchor="middle">لِيبْيَا</text><text x="300" y="540" font-size="16" fill="#7c6a55" text-anchor="middle">السُّودَانُ</text><text x="585" y="130" font-size="13" fill="#7c6a55" text-anchor="middle" transform="rotate(-70 585 130)">فِلَسْطِينُ</text></g>`;
 if(o.labels){s+=`<g pointer-events="none" style="font-family:'Baloo Bhaijaan 2',sans-serif" font-weight="800">`;for(const k in EGM.gov){if(o.labels==='big'?['ALX','BH','KFS','GH','MNF','KB','DK','DT','SHR','PTS','IS'].includes(k):(o.labels!==true&&!o.labels.includes(k)))continue;const [x,y]=GOV_LBL[k]||EGM.gov[k].c;s+=`<text x="${x}" y="${y}" font-size="${fs}" text-anchor="middle" fill="#1e293b" stroke="#fff" stroke-width="${3/z}" paint-order="stroke">${noTash(EGM.gov[k].n)}</text>`}s+='</g>'}
 if(o.extra)s+=o.extra;
 return s+'</svg>'}
const govName=k=>EGM.gov[k].n;
const govIn=g=>Object.keys(EGM.gov).filter(k=>EGM.gov[k].g===g);
/* convert lon/lat to map units */
function egyXY(lon,lat){const K=50,C=Math.cos(27*Math.PI/180);return [(lon-24)*K*C,(32.2-lat)*K]}
