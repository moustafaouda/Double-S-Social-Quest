/* ---------- Unit 1: tap-to-explore spots, sort pictures, match pictures ---------- */
const HOTWH={};
const HOT={
 houseTop:[[125,70,'الطَّائِرَةُ الصَّغِيرَةُ تَرَى الْمَنْزِلَ مِنَ الْأَعْلَى.'],[120,230,'الْمَنْزِلُ كَمَا نَرَاهُ مِنَ الْأَمَامِ.'],[465,190,'الْمُخَطَّطُ: الْمَنْزِلُ كَمَا نَرَاهُ مِنَ الْأَعْلَى.'],[605,64,'سَهْمُ الشَّمَالِ.']],
 schoolPlan:[[230,44,'الْفُصُولُ: نَتَعَلَّمُ فِيهَا.'],[150,136,'الْمَكْتَبَةُ: نَقْرَأُ فِيهَا الْكُتُبَ.'],[580,190,'الْمَعْمَلُ: نُجْرِي فِيهِ التَّجَارِبَ.'],[320,200,'الْفِنَاءُ: نَقِفُ فِيهِ لِتَحِيَّةِ الْعَلَمِ.'],[130,240,'الْحَدِيقَةُ: أَشْجَارٌ نُحَافِظُ عَلَيْهَا.']],
 engineerDraw:[[372,240,'الْمُهَنْدِسُ يُصَمِّمُ الْمَبَانِيَ.'],[190,190,'الْمُخَطَّطُ: نُقَسِّمُ الْمَبْنَى وَنُضِيفُ الْأَبْوَابَ وَالنَّوَافِذَ.'],[308,122,'نَرْسُمُ الشَّمْسَ خَارِجَ الْمَنْزِلِ.'],[500,230,'ثُمَّ يَبْنِي الْمَبْنَى.']],
 threeRoutes:[[300,200,'الطَّرِيقُ الْمُنْحَنِي: يَخْتَارُهُ مَنْ يُحِبُّ التَّسَوُّقَ.'],[440,140,'الطَّرِيقُ الْمُبَاشِرُ: أَقْصَرُ وَأَسْرَعُ.'],[60,170,'الطَّرِيقُ الطَّوِيلُ: لِمَنْ يُحِبُّ رِيَاضَةَ الْمَشْيِ.'],[540,92,'الْحَدِيقَةُ: هِيَ الْهَدَفُ.']],
 sunrise:[[320,120,'الشَّمْسُ تُشْرِقُ مِنَ الشَّرْقِ.'],[200,250,'الشَّمَالُ عَلَى يَسَارِكَ.'],[440,250,'الْجَنُوبُ عَلَى يَمِينِكَ.'],[360,330,'الْغَرْبُ خَلْفَكَ.']],
 rose:[[220,70,'الشَّمَالُ: اتِّجَاهٌ أَصْلِيٌّ.'],[262,140,'الشَّمَالُ الشَّرْقِيُّ: اتِّجَاهٌ فَرْعِيٌّ.'],[614,76,'الِاتِّجَاهَاتُ الْأَصْلِيَّةُ أَرْبَعَةٌ.'],[614,212,'الِاتِّجَاهَاتُ الْفَرْعِيَّةُ أَرْبَعَةٌ.']],
 northStar:[[346,46,'النَّجْمُ الْقُطْبِيُّ: نَجْمٌ لَامِعٌ.'],[200,140,'نُجُومٌ تُرْشِدُنَا إِلَى النَّجْمِ الْقُطْبِيِّ.'],[180,250,'الْمِصْرِيُّونَ الْقُدَمَاءُ بَرَعُوا فِي عِلْمِ الْفَلَكِ.'],[500,230,'الْأَهْرَامَاتُ.']],
 compasses:[[180,150,'الْإِبْرَةُ الْمِغْنَاطِيسِيَّةُ تُشِيرُ إِلَى الشَّمَالِ.'],[485,170,'الْبُوصْلَةُ الرَّقْمِيَّةُ فِي الْهَاتِفِ الذَّكِيِّ.'],[320,135,'الرَّقْمِيَّةُ أَسْرَعُ وَأَدَقُّ.']],
 planToMap:[[145,160,'الْمُخَطَّطُ: لِمَكَانٍ صَغِيرٍ.'],[490,90,'الْخَرِيطَةُ: لِسَطْحِ الْأَرْضِ أَوْ جُزْءٍ مِنْهُ.'],[425,110,'رَمْزُ الْعَاصِمَةِ.'],[590,245,'وَرْدَةُ الْبُوصْلَةِ.']],
 mapElements:[[456,37,'الْعُنْوَانُ: يُوَضِّحُ مَوْضُوعَ الْخَرِيطَةِ.'],[604,58,'وَرْدَةُ الْبُوصْلَةِ: تُحَدِّدُ الِاتِّجَاهَاتِ.'],[612,300,'مِقْيَاسُ الرَّسْمِ: يُسَاعِدُ فِي حِسَابِ الْمَسَافَاتِ.'],[28,232,'الْمِفْتَاحُ: يَشْرَحُ الْأَلْوَانَ وَالرُّمُوزَ.']],
 keyColors:[[250,240,'الْبُنِّيُّ: جِبَالٌ وَهِضَابٌ.'],[200,46,'الْأَخْضَرُ: سُهُولٌ.'],[100,30,'الْأَزْرَقُ: مُسَطَّحَاتٌ مَائِيَّةٌ.'],[240,92,'الْأَحْمَرُ: الْقَاهِرَةُ الْعَاصِمَةُ.']],
 scaleCard:[[160,140,'الْمَسَافَةُ عَلَى الْخَرِيطَةِ.'],[606,70,'سَنْتِيمِتْرٌ وَاحِدٌ يُسَاوِي مِائَةَ كِيلُومِتْرٍ.'],[606,190,'خَمْسَةُ سَنْتِيمِتْرَاتٍ تُسَاوِي خَمْسَمِائَةِ كِيلُومِتْرٍ.']],
 metroMap:[[320,200,'مَحَطَّةٌ تَلْتَقِي فِيهَا الْخُطُوطُ.'],[95,70,'مِفْتَاحُ الْخَرِيطَةِ.'],[530,90,'قِطَارُ الْمِتْرُو يَسِيرُ عَلَى الْخَطِّ.']],
 mapUsers:[[70,250,'السَّائِحُ: يَصِلُ إِلَى الْأَمَاكِنِ السِّيَاحِيَّةِ.'],[190,250,'الْمُزَارِعُ: يُحَدِّدُ مَوْقِعَ أَرْضِهِ.'],[310,250,'الْجُنْدِيُّ: يُحَدِّدُ الْمَوَاقِعَ الْعَسْكَرِيَّةَ.'],[430,250,'قَائِدُ الطَّائِرَةِ: يُحَدِّدُ مَسَارَ الرِّحْلَةِ.'],[560,250,'الْمُهَنْدِسُ: يُخَطِّطُ لِلْمَبَانِي وَالطُّرُقِ.']],
 papyrusMap:[[320,170,'نَهْرُ النِّيلِ عَلَى الْخَرِيطَةِ.'],[210,130,'مَوَاقِعُ الْمَنَاجِمِ.'],[540,250,'كَاتِبٌ مِصْرِيٌّ قَدِيمٌ.'],[80,200,'نُقُوشٌ عَلَى جُدْرَانِ الْمَعَابِدِ.']],
 idrisiDigital:[[160,170,'خَرِيطَةُ الْعَالَمِ لِلْإِدْرِيسِيِّ.'],[60,290,'الْإِدْرِيسِيُّ: عَالِمٌ عَرَبِيٌّ.'],[460,170,'الْخَرِيطَةُ الرَّقْمِيَّةُ فِي الْهَاتِفِ.'],[560,150,'قَمَرٌ صِنَاعِيٌّ.']],
 astrolabe:[[220,120,'الْإِسْطَرْلَابُ: يُحَدِّدُ الْمَوَاقِعَ مِنْ خِلَالِ النُّجُومِ.'],[500,110,'النُّجُومُ فِي السَّمَاءِ.'],[600,214,'اسْتِخْدَامَاتُ الْإِسْطَرْلَابِ.']],
 mariam:[[200,200,'مَرْيَمُ الْإِسْطَرْلَابِيُّ: عَالِمَةٌ مُسْلِمَةٌ.'],[272,190,'طَوَّرَتِ الْإِسْطَرْلَابَ بِحِسَابَاتٍ دَقِيقَةٍ.'],[470,220,'سُمِّيَ أَحَدُ الْكُوَيْكِبَاتِ بِاسْمِهَا.']],
 gpsSat:[[150,80,'قَمَرٌ صِنَاعِيٌّ يُرْسِلُ إِشَارَاتٍ.'],[320,250,'مَوْقِعُكَ عَلَى الْأَرْضِ.'],[480,240,'كَوْكَبُ الْأَرْضِ.']],
 airSpace:[[150,100,'الطَّائِرَةُ تَلْتَقِطُ صُورَةً جَوِّيَّةً.'],[155,310,'الصُّورَةُ الْجَوِّيَّةُ: مِسَاحَةٌ مَحْدُودَةٌ.'],[480,80,'الْقَمَرُ الصِّنَاعِيُّ يَلْتَقِطُ صُورَةً فَضَائِيَّةً.'],[480,300,'الصُّورَةُ الْفَضَائِيَّةُ: مِسَاحَاتٌ أَوْسَعُ.']],
 sourcesTree:[[100,140,'الْآثَارُ: مَصْدَرٌ أَوَّلِيٌّ.'],[210,140,'الْبَرْدِيَّاتُ: مَصْدَرٌ أَوَّلِيٌّ.'],[420,140,'الْمَقَالَاتُ: مَصْدَرٌ ثَانَوِيٌّ.'],[560,140,'الْأَفْلَامُ التَّارِيخِيَّةُ: مَصْدَرٌ ثَانَوِيٌّ.']],
 primary1:[[200,200,'مَعْبَدٌ قَدِيمٌ: مِنَ الْآثَارِ.'],[110,230,'نُقُوشٌ مَحْفُورَةٌ عَلَى الْحَجَرِ.'],[470,220,'تِمْثَالٌ تَرَكَهُ الْقُدَمَاءُ.'],[590,260,'عَالِمُ آثَارٍ يَدْرُسُ الْمَاضِيَ.']],
 primary2:[[230,120,'بَرْدِيَّةٌ: مَصْنُوعَةٌ مِنْ نَبَاتِ الْبَرْدِيِّ.'],[40,280,'نَبَاتُ الْبَرْدِيِّ يَنْمُو عَلَى ضِفَافِ النِّيلِ.'],[480,200,'مُؤَرِّخٌ يَكْتُبُ مَا يَحْدُثُ فِي زَمَنِهِ.']],
 secondary:[[120,200,'مَقَالٌ فِي جَرِيدَةٍ.'],[320,230,'الْمَوْسُوعَاتُ وَالْكُتُبُ.'],[520,200,'فِيلْمٌ تَارِيخِيٌّ.']],
 manySources:[[100,90,'الْكُتُبُ.'],[540,90,'الْإِنْتَرْنِتْ.'],[100,260,'الْمَتَاحِفُ.'],[540,260,'نَسْأَلُ الْمُعَلِّمَ.'],[320,140,'نُقَارِنُ الْمَعْلُومَاتِ وَنَتَأَكَّدُ مِنْهَا.']],
 factOpinion:[[530,190,'الْحَقِيقَةُ: يُمْكِنُ إِثْبَاتُهَا.'],[320,190,'الرَّأْيُ: وُجْهَةُ نَظَرٍ شَخْصِيَّةٌ.'],[110,190,'الشَّائِعَةُ: خَبَرٌ غَيْرُ صَحِيحٍ.']],
 thinkFirst:[[262,272,'خَبَرٌ عَلَى الْهَاتِفِ.'],[226,70,'نُفَكِّرُ: هَلْ هُوَ صَحِيحٌ؟'],[400,210,'فَكِّرْ قَبْلَ أَنْ تَنْشُرَ.'],[580,250,'نَسْأَلُ الْكِبَارَ.']]};
function art(k,o={}){const f=ART[k];if(!f)return '';const h=o.nohot?null:HOT[k];const [W,H]=HOTWH[k]||[640,360];return `<div class="artbox" data-k="${k}">${f()}${h?h.map((p,i)=>`<button class="hot" data-i="${i}" style="left:${p[0]/W*100}%;top:${p[1]/H*100}%" aria-label="${noTash(p[2])}"><span>✨</span></button>`).join(''):''}</div>`}
/* tapping a spot: its name is spoken */
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('.hot');if(!b)return;const box=b.closest('.artbox'),k=box.dataset.k,p=HOT[k][+b.dataset.i];box.querySelectorAll('.hotlbl').forEach(x=>x.remove());const l=document.createElement('div');l.className='hotlbl pop';l.style.left=b.style.left;l.style.top=b.style.top;l.textContent=p[2];box.appendChild(l);b.classList.add('seen');SFX.click();speak(p[2]);const n=box.querySelectorAll('.hot').length,s=box.querySelectorAll('.hot.seen').length;const c=document.getElementById('hotc');if(c)c.textContent=`🔍 ${ad(s)} / ${ad(n)}`});

/* drawings for the sorting games (200x150) */
const spaceBg=`<rect width="200" height="150" fill="#020617"/>${[...Array(14)].map((_,i)=>`<circle cx="${(i*47)%200}" cy="${(i*31)%150}" r="1" fill="#fff"/>`).join('')}`;
const planeTag=`<g transform="translate(170,22)"><circle r="17" fill="#0ea5e9" stroke="#fff" stroke-width="2"/>${kPlane(0,0,.22)}</g>`;
const satTag=`<g transform="translate(172,20)"><circle r="16" fill="#1e293b"/>${sat(.32)}</g>`;
const topPyr=(x,y,w)=>`<g transform="translate(${x},${y})"><path d="M${-w/2} ${-w/2} H${w/2} L0 0Z" fill="#f0cd86"/><path d="M${w/2} ${-w/2} V${w/2} L0 0Z" fill="#d9b06a"/><path d="M${w/2} ${w/2} H${-w/2} L0 0Z" fill="#c99a52"/><path d="M${-w/2} ${w/2} V${-w/2} L0 0Z" fill="#e2b46a"/></g>`;
const sinai=()=>`<g transform="translate(${100-430*.7},${80-150*.7}) scale(.7)">${egyRelief()}</g>`;
const SICON={
 aPyr:()=>sv(`<rect width="200" height="150" fill="url(#kSand)"/>${topPyr(70,80,70)}${topPyr(140,60,50)}${topPyr(160,120,30)}<path d="M0 140 Q60 120 120 145" stroke="#cbd5e1" stroke-width="6" fill="none"/>${planeTag}`),
 aNile:()=>sv(`<rect width="200" height="150" fill="#9ca3af"/>${aRiver('M80 -10 Q100 75 90 160',60)}<rect x="0" y="62" width="200" height="22" fill="#e5e7eb" stroke="#64748b"/><path d="M0 73 H200" stroke="#facc15" stroke-width="2" stroke-dasharray="8 6"/>${aCar(68,'#ef4444',5,0,1,.35)}${[20,40,150,175].map((x,i)=>`<rect x="${x-9}" y="${i%2?100:20}" width="18" height="18" fill="#fde7c5" stroke="#94a3b8"/>`).join('')}${planeTag}`),
 aCity:()=>sv(`<rect width="200" height="150" fill="#86c66b"/><path d="M0 75 H200 M100 0 V150" stroke="#d1d5db" stroke-width="14"/>${[[50,35,'#ef4444'],[150,35,'#3b82f6'],[50,115,'#f59e0b'],[150,115,'#a855f7']].map(([x,y,c])=>tHouse(x,y,34,c)).join('')}${tTree(20,20,8)}${tTree(180,130,8)}${planeTag}`),
 sEgypt:()=>sv(`${spaceBg}<g transform="translate(36,12) scale(.22)"><path d="${EGM.out}" fill="#e9c97a" stroke="#fff" stroke-width="4"/><path d="${EGM.nile}" stroke="#22c55e" stroke-width="8" fill="none"/></g>${satTag}`),
 sEarth:()=>sv(`${spaceBg}${globe(100,78,58)}${satTag}`),
 sSea:()=>sv(`${spaceBg}<clipPath id="sinC"><rect x="20" y="10" width="160" height="130" rx="8"/></clipPath><g clip-path="url(#sinC)">${sinai()}</g><rect x="20" y="10" width="160" height="130" rx="8" fill="none" stroke="#475569" stroke-width="3"/>${satTag}`),
 pTemple:()=>sv(`<rect width="200" height="150" fill="url(#kSkyEve)"/><rect y="120" width="200" height="30" fill="url(#kSand)"/>${temple(100,135,.62)}`),
 pStatue:()=>sv(`<rect width="200" height="150" fill="#fef3c7"/>${statue(100,140,1.1)}`),
 pCarve:()=>sv(`<rect width="200" height="150" fill="url(#kStone)"/>${[30,62,94,126,158].map(x=>glyphs(x+6,22,6)).join('')}`),
 pPapy:()=>sv(`<rect width="200" height="150" fill="#fff7ed"/>${scroll(34,24,130,100,glyphs(30,16,5)+glyphs(65,16,5)+glyphs(100,16,5))}`),
 pHist:()=>sv(`<rect width="200" height="150" fill="#fef3c7"/>${scholar(70,150,1.6,'#9a3412')}<rect x="100" y="96" width="90" height="10" fill="#92400e"/><rect x="110" y="84" width="60" height="12" fill="#f3e2b3" stroke="#a16207"/><path d="M128 84 L140 60" stroke="#1e293b" stroke-width="2"/><path d="M138 62 q8 -16 18 -20 q-4 12 -14 22Z" fill="#fff" stroke="#94a3b8"/>`),
 sNews:()=>sv(`<rect width="200" height="150" fill="#eff6ff"/>${paperNews(100,75,1.4,-6)}`),
 sBook:()=>sv(`<rect width="200" height="150" fill="#f0fdf4"/>${encyclo(100,130,1.3)}${books(100,62,.7)}`),
 sFilm:()=>sv(`<rect width="200" height="150" fill="#fef2f2"/>${tvFilm(100,80,1.3)}`)};
const BINART={
 s3:[()=>sv(`<rect width="200" height="150" fill="url(#kSky)"/><rect y="110" width="200" height="40" fill="#86c66b"/><path d="M100 50 L60 125 H140Z" fill="#fde047" opacity=".35"/>${kPlane(100,44,.7)}<rect x="60" y="112" width="80" height="26" fill="none" stroke="#ca8a04" stroke-width="3" stroke-dasharray="6 4"/>`),()=>sv(`${spaceBg}<path d="M0 150 Q100 90 200 150Z" fill="#2563eb"/><path d="M100 44 L10 140 H190Z" fill="#22d3ee" opacity=".2"/><g transform="translate(100,34)">${sat(.9)}</g>`)],
 s4:[()=>sv(`<rect width="200" height="150" fill="url(#kSkyEve)"/><rect y="120" width="200" height="30" fill="url(#kSand)"/>${temple(70,135,.42)}<g transform="translate(130,40)">${scroll(0,0,56,70,glyphs(16,12,3)+glyphs(38,12,3))}</g>`),()=>sv(`<rect width="200" height="150" fill="#eff6ff"/>${paperNews(62,70,.9,-8)}${books(140,120,.8)}`)]};
/* drawings for the matching game (120x110) */
const pinM=(x,y)=>`<g transform="translate(${x},${y})"><animateTransform attributeName="transform" type="translate" values="${x} ${y};${x} ${y-5};${x} ${y}" dur="1.2s" repeatCount="indefinite"/><path d="M0 0 Q-9 -10 -9 -16 A9 9 0 0 1 9 -16 Q9 -10 0 0Z" fill="#ef4444" stroke="#fff" stroke-width="1.5"/><circle cy="-16" r="3.5" fill="#fff"/></g>`;
const MPIC={
 uTour:()=>dv(`<rect width="120" height="110" fill="#fdf2f8"/>${tourist(60,104,1.1)}`),
 uFarm:()=>dv(`<rect width="120" height="110" fill="#f0fdf4"/>${farmer(60,104,1.1)}`),
 uSold:()=>dv(`<rect width="120" height="110" fill="#f7fee7"/>${soldierM(60,104,1.1)}`),
 uPilot:()=>dv(`<rect width="120" height="110" fill="#eff6ff"/>${pilot(60,104,1.1)}`),
 uEng:()=>dv(`<rect width="120" height="110" fill="#fff7ed"/>${engineer(60,104,1.1)}`),
 gTour:()=>dv(`<rect width="120" height="110" fill="url(#kSkyEve)"/><rect y="80" width="120" height="30" fill="url(#kSand)"/>${pyramids(56,86,.32)}${pinM(86,46)}`),
 gFarm:()=>dv(`<rect width="120" height="110" fill="#bbf7d0"/>${[0,1,2,3].map(i=>`<rect x="${8+(i%2)*56}" y="${8+Math.floor(i/2)*50}" width="48" height="42" fill="${['#65a30d','#ca8a04','#84cc16','#16a34a'][i]}"/>`).join('')}<rect x="64" y="8" width="48" height="42" fill="none" stroke="#ef4444" stroke-width="3" stroke-dasharray="5 3"/>${pinM(88,36)}`),
 gSold:()=>dv(`<rect width="120" height="110" fill="#ecfccb"/><path d="M0 80 Q60 60 120 80 V110 H0Z" fill="#a3a36b"/><path d="M30 80 L50 46 L70 80Z" fill="#4d5d2a"/><path d="M80 30 V80" stroke="#64748b" stroke-width="3"/><g transform="translate(80,30)">${band(0,26,6,FR,2)}${band(6,26,6,'#fff',2)}${band(12,26,6,FK,2)}</g>${pinM(50,40)}`),
 gPilot:()=>dv(`<rect width="120" height="110" fill="#e0f2fe"/><path d="M14 90 Q60 10 106 60" stroke="#2563eb" stroke-width="3" stroke-dasharray="6 5" fill="none"><animate attributeName="stroke-dashoffset" values="22;0" dur="1s" repeatCount="indefinite"/></path><circle cx="14" cy="90" r="5" fill="#2563eb"/>${pinM(106,62)}<g><animateMotion dur="4s" repeatCount="indefinite" path="M14 90 Q60 10 106 60" rotate="auto"/>${kPlane(0,0,.22)}</g>`),
 gEng:()=>dv(`<rect width="120" height="110" fill="#1e40af"/>${[...Array(6)].map((_,i)=>`<path d="M${i*22} 0 V110 M0 ${i*22} H120" stroke="#3b82f6"/>`).join('')}<rect x="14" y="20" width="40" height="50" fill="none" stroke="#fff" stroke-width="3"/><path d="M14 44 H54 M34 20 V44" stroke="#fff" stroke-width="2"/><path d="M66 90 L110 30" stroke="#fff" stroke-width="8"/><path d="M66 90 L110 30" stroke="#1e40af" stroke-width="2" stroke-dasharray="5 4"/>`)};
MATCH.m2.pics=MPIC;
