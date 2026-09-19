'use strict';
/* ================= CONFIG (edit personal text here) ================= */
const CFG={petName:'Biscuit',favDrink:'Iced coffee',myFav:'Whatever you\'re having, but bigger',favFood:'Leftover pasta',speed:118,
// Your own audio: put the files in this same folder. Set a name to '' to use the built-in generated sound instead.
audio:{music:'song.mp3',ambience:'',footsteps:'',interaction:''},
flowers:['Things I want to experience with you.','Places I want to take you.','Things I want to learn with you.','Things I still want to become.'],
stars:['A trip we haven\'t taken.','A restaurant we haven\'t discovered.','A stupid inside joke we haven\'t made yet.','A photograph that hasn\'t been taken.','A place we haven\'t called home.']};
const C={mid:'#101525',lav:'#403A5C',rose:'#B86F7C',cream:'#F6EBDD',gold:'#E7C98B',sage:'#7F967B',ocean:'#587A8C',wood:'#806452'};
const WL='#6D5662',CW='#3A2E2C';
/* ================= STATE / SAVE SYSTEM ================= */
const KEY='wwhly_save_v1';let noSave=0;
if(/reset/.test(location.search)){localStorage.removeItem(KEY);history.replaceState(0,'',location.pathname)}
const S={fl:[],keys:[],gate:0,door:0,stars:[],vis:[],c:{},time:0,done:0,build:'',tv:0,x:1200,y:1380};
try{localStorage.removeItem(KEY)}catch(e){} // progress is never restored: every visit starts fresh
const save=()=>{}; // intentionally empty: flowers, keys, stars etc. are NOT saved
const $=i=>document.getElementById(i),cv=$('c');let cx=cv.getContext('2d');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const hf=s=>{const v=Math.sin(s*12.9898)*43758.5453;return v-Math.floor(v)};
let mode='title',dOpen=0,pOpen=0,dq=[],dcb=null,SC=2,VW=0,VH=0,DPR=1,sit=0,fro=0,T=0,curZ='',wasIn=0,sky={t:0,win:0,say:0},rb={a:{},t:[],p:0,tp:0};
const p={x:S.x,y:S.y,dir:1,w:0,st:0},cam={x:S.x,y:S.y};
const TOUCH=matchMedia('(pointer:coarse)').matches||'ontouchstart' in window;if(TOUCH)document.body.classList.add('touch');
function rs(){DPR=devicePixelRatio||1;cv.width=innerWidth*DPR;cv.height=innerHeight*DPR;SC=Math.max(1.4,Math.min(innerWidth,innerHeight)/330);VW=innerWidth/SC;VH=innerHeight/SC}
addEventListener('resize',rs);rs();
/* ================= WORLD / LOCATIONS ================= */
// [name,x,y,w,h,floor,label,darkness]
const Z=[['forest',700,420,1000,480,'#3B5240','FOREST',.35],['future',1000,0,400,420,'#F6EBDD','THE FUTURE',0],
['cafe',300,900,600,500,'#59463F','CAFÉ',0],['city',900,900,600,500,'#202334','CITY',0],['beach',1500,900,700,500,'#D8C3A5','BEACH',.5],
['garden',300,1400,600,800,'#7F967B','GARDEN',.3],['home',900,1400,600,800,'#302A3D','OUR HOME',0],['pet',1500,1400,600,800,'#7F967B','PET AREA',.32],['bedroom',900,1800,600,400,'#302A3D','BEDROOM',0]];
const zoneAt=(x,y)=>{for(let i=Z.length-1;i>=0;i--){const z=Z[i];if(x>=z[1]&&x<z[1]+z[3]&&y>=z[2]&&y<z[2]+z[4])return z}return null};
const zn=(x,y)=>{const z=zoneAt(x,y);return z?z[0]:''};
const SO=[],R=(x,y,w,h,c)=>SO.push({x,y,w,h,c});
R(900,1440,250,14,WL);R(1250,1440,250,14,WL);R(900,2146,600,14,WL);R(900,1440,14,120,WL);R(900,1640,14,520,WL);R(1486,1440,14,120,WL);R(1486,1640,14,520,WL);R(900,1800,230,14,WL);R(1230,1800,270,14,WL);
R(300,900,600,14,CW);R(300,1386,600,14,CW);R(300,900,14,500,CW);R(886,900,14,220,CW);R(886,1200,14,200,CW);
[915,1010,1310,1405].forEach(x=>R(x,900,90,140));
R(1500,1262,700,138);R(700,420,430,200);R(1270,420,430,200);
const GATE={x:1130,y:596,w:140,h:16},DOOR={x:1130,y:400,w:140,h:20};
const TR=[],tree=(x,y)=>{TR.push({x,y,tr:1});SO.push({x:x-5,y:y-6,w:10,h:6})};
for(let x=712;x<1126;x+=30)for(let y=438;y<616;y+=26){tree(x+hf(x+y)*10,y+hf(x*y)*8);tree(1290+(x-712)+hf(y)*10,y+hf(x)*8)}
for(let i=0;i<46;i++){const x=720+hf(i*3)*960,y=650+hf(i*7+1)*230;if((x>1090&&x<1310)||(x>1600&&y>640&&y<760))continue;tree(x,y)}
TR.sort((a,b)=>a.y-b.y);
const LP=[[960,1100],[1440,1100],[1200,1385],[1000,1560],[1400,1560],[1040,1990],[580,1130],[400,1000],[800,1040],[1200,1230],[1130,1660]];
const BLD=[[915,'🎬'],[1010,'📚'],[1310,'🕹️'],[1405,'🍜']];
const pet={id:'pet',x:1800,y:1700,tx:1800,ty:1700,wt:0,e:'🐕',z:20,l:['This creature has decided you\'re its favorite.','Understandable.']};
/* ================= OBJECTS / INTERACTIONS ================= */
const OB=[
// living room + kitchen
{id:'couch1',x:960,y:1740,w:84,h:34,c:C.rose,s:1,e:'🛋️',l:['Reserved.','You always take this spot anyway.']},
{id:'couch2',x:1075,y:1740,w:84,h:34,c:C.rose,s:1,e:'🛋️',l:['This one is "for guests."','Nobody believes that.']},
{id:'tv',x:1000,y:1476,w:70,h:16,c:C.mid,s:1,a:'tv'},
{x:1100,y:1470,e:'🖼️',l:['A painting of somewhere we haven\'t been.','The frame is real. The place isn\'t. Yet.']},
{x:930,y:1485,e:'🪴',l:['It\'s fake. Please don\'t tell it.']},
{x:1120,y:1620,e:'🧦',l:['One sock. The other has been missing since before we met.','Mysterious.']},
{x:1170,y:1485,e:'🕯️',l:['Nobody lit this. It just does that.']},
{id:'fridge',x:1462,y:1484,w:40,h:56,c:'#D9C6B3',s:1,a:'fridge'},
{x:1380,y:1480,w:50,h:30,c:'#59463F',s:1,e:'🍳',l:['I have absolutely no idea what I\'m doing.','Send help. Or takeout.']},
{x:1300,y:1590,e:'☕',l:['The mug you\'d probably claim as yours.']},
{x:1350,y:1660,w:80,h:44,c:C.wood,s:1,l:['Where we\'ll eat dinner at 11 PM, again.']},
{id:'chair',x:1425,y:1660,e:'🪑',l:['Your seat.']},
// bedroom
{id:'bed',x:1010,y:1990,w:110,h:84,c:C.rose,s:1,e:'🛏️',z:34,a:'bed'},
{id:'pillow',x:960,y:1970,w:34,h:20,c:C.cream,k:2040,l:['Your side.']},
{x:1446,y:1905,w:56,h:96,c:C.wood,s:1,e:'👔',l:['Eventually, your clothes will somehow take over this entire thing.']},
{x:1250,y:2153,w:80,h:12,c:'#22304a',g:1,a:'window'},
{x:935,y:2110,e:'⏰',l:['Set for 6:30. Nobody has ever obeyed it.']},
// garden
{f:0,x:450,y:1620,e:'🌹',g:1,a:'flower'},{f:1,x:760,y:1900,e:'🌹',g:1,a:'flower'},{f:2,x:520,y:2090,e:'🌹',g:1,a:'flower'},{f:3,x:820,y:1700,e:'🌹',g:1,a:'flower'},
{x:865,y:1480,e:'📮',l:['Empty. Waiting for something worth delivering.']},
{x:450,y:1480,e:'🪑',l:['Perfect for doing absolutely nothing.']},
{x:600,y:1800,w:34,h:34,s:1,e:'⛲',z:28,l:['Currently out of wishes.']},
// pet area
pet,
{x:1650,y:1680,e:'🥣',l:['Never full for long.']},
{x:1990,y:1560,w:44,h:36,s:1,e:'🏠',z:30,l:['It has its own address. Nicer than ours.']},
{x:1700,y:1950,e:'🎾',l:['Do not throw this unless you want to be here all night.']},
// cafe
{x:500,y:1170,w:46,h:34,c:C.rose,t:'YOU',l:['YOU','(I picked this one on purpose.)']},
{x:660,y:1170,w:46,h:34,c:C.lav,t:'ME',l:['ME','(Close enough to hear you laugh.)']},
{x:580,y:1170,w:40,h:30,c:C.wood,s:1,e:'🕯️'},
{x:400,y:935,e:'📜',g:1,a:'menu'},
{id:'k2',x:430,y:1350,e:'🫙',a:'key2'},
{x:350,y:1000,e:'🎵',l:['It plays one song. You know which one.']},
{x:780,y:1000,w:140,h:36,c:C.wood,s:1,e:'☕',l:['Nobody\'s working. Help yourself. (Please don\'t.)']},
// city
{x:960,y:1058,l:['One day we\'ll argue about what movie to watch.']},{x:1055,y:1058,l:['I\'ll pretend I came here for you.']},
{x:1355,y:1058,l:['Prepare to lose.']},{x:1450,y:1058,l:['Our future argument about where to eat.']},
{x:1200,y:1230,w:34,h:46,c:C.rose,s:1,e:'📸',g:1,a:'booth'},
{x:1000,y:1300,e:'🗑️',l:['Something in here is watching me.']},{x:1400,y:1300,e:'🪑',l:['Reserved for whoever\'s late.']},
// beach
{x:1700,y:1100,e:'🐚',l:['Shhh. It\'s listening.']},{x:2050,y:1150,e:'🍶',l:['An empty bottle. Waiting for the right message.']},{x:1640,y:1030,e:'⛱️',z:24,l:['Two chairs. We\'d fight over the good one.']},
// forest
{id:'k1',x:1640,y:700,w:30,h:20,e:'🌲',z:54,g:1,a:'key1'},
{x:1200,y:648,e:'🪧',l:['The sign says: "Not yet."']},{x:900,y:680,e:'🦉',l:['It has watched you walk into that tree twice.']},{x:800,y:800,e:'🍄',l:['Not edible. Probably.']},
{x:1200,y:606,w:140,h:16,a:'gate'},{x:1200,y:414,w:140,h:20,a:'door'}
];
OB.forEach((o,i)=>{o.id=o.id||'o'+i;o.w=o.w||28;o.h=o.h||28});
const vis=o=>!(o.f!=null&&S.fl.includes(o.f));
function pick(id,l){const n=S.c[id]||0;S.c[id]=n+1;say(l[Math.min(n,l.length-1)]);save()}
function getKey(n){if(S.keys.includes(n))return;S.keys.push(n);const k=S.keys.length;AU.chime();toast(k==1?'KEY ACQUIRED':k+'/3');if(k==3){S.door=1;setTimeout(()=>toast('🔓 A NEW AREA HAS BEEN UNLOCKED'),2600)}hud();save()}
const ACT={
tv(){S.tv=1;say('CURRENT PROGRAM\n\nYou & Me Being Old and Still Arguing About What to Watch.\n\nEPISODE 47,291')},
fridge(){fro=1;say(['I\'d probably ask what you want to eat even though I already know what you\'re going to say.',`[HER FAVORITE DRINK]\n${CFG.favDrink}\n\nLOW STOCK\nSomeone keeps drinking these.`,`[LEFTOVERS]\n${CFG.favFood}\n\nLabeled "DO NOT EAT."\nNobody has ever obeyed the label.`,'A sticky note on the door:\n"Your seat. Your side. Your spot."\n\nBelow it, smaller: "Then check where you sleep."','One expired yogurt.\nIt has been here longer than the house.'],()=>fro=0)},
bed(){if(!S.keys.includes(3)&&S.c.couch1&&S.c.pillow&&S.c.chair)say('Something is taped under the bed frame.',()=>getKey(3));else pick('bed',['I already know you\'re stealing most of the blanket.'])},
window(){toSky(1)},
flower(o){S.fl.push(o.f);const n=S.fl.length;AU.chime();say(CFG.flowers[o.f],()=>{if(n==4){S.gate=1;toast('4/4 FLOWERS COLLECTED\nSomewhere, a gate opens.');[880,1109,1318,1760].forEach((f,i)=>setTimeout(()=>AU.tone(f,1,.05),i*160))}else toast(n+'/4');hud();save()})},
key1(){S.keys.includes(1)?pick('k1b',['Just a tree now. A very good one.']):say('There\'s something behind the tree.',()=>getKey(1))},
key2(){S.keys.includes(2)?pick('k2b',['Just loose change now.']):say('A jar of loose change.\nAnd a small key, taped to the bottom.',()=>getKey(2))},
gate(){say(S.gate?'Open.':'Shut tight. It looks like it\'s waiting for something to bloom.')},
door(){say(S.door?'It\'s open.':'🔒\nREQUIRES 3 KEYS')},
menu,booth};
function near(){let b=null,bd=30;for(const o of OB){if(!vis(o))continue;const dx=Math.max(o.x-o.w/2-p.x,0,p.x-o.x-o.w/2),dy=Math.max(o.y-o.h/2-p.y+4,0,p.y-4-o.y-o.h/2),d=Math.hypot(dx,dy);if(d<bd){bd=d;b=o}}return b}
function interact(o){AU.chime();if(o.a)ACT[o.a](o);else pick(o.id,o.l)}
/* ================= COLLISIONS ================= */
const walk=(x,y)=>{const z=zoneAt(x,y);return z&&(z[0]!=='future'||S.door)};
function hit(x,y){if(!walk(x-6,y)||!walk(x+6,y))return 1;const a=x-6,b=y-4,t=r=>a<r.x+r.w&&a+12>r.x&&b<r.y+r.h&&b+8>r.y;
return SO.some(t)||(!S.gate&&t(GATE))||(!S.door&&t(DOOR))||OB.some(o=>o.s&&t({x:o.x-o.w/2,y:o.y-o.h/2,w:o.w,h:o.h}))}
/* ================= INPUT ================= */
const K={};let jx=0,jy=0;
addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'){if(e.code==='Enter'&&window.bsub)bsub();return}K[e.code]=1;if(e.code.startsWith('Arrow')||e.code==='Space')e.preventDefault();if((e.code==='KeyE'||e.code==='Space')&&!e.repeat)press()});
addEventListener('keyup',e=>K[e.code]=0);addEventListener('blur',()=>{for(const k in K)K[k]=0});
function press(){if(dOpen){showD();return}if(mode!=='play'||pOpen||sit)return;const o=near();if(o)interact(o)}
$('act').onpointerdown=e=>{e.preventDefault();press()};$('dlg').onclick=press;
const joy=$('joy'),kn=joy.firstElementChild;let jid=null;
const jm=e=>{const r=joy.getBoundingClientRect();let dx=e.clientX-r.left-59,dy=e.clientY-r.top-59;const m=Math.hypot(dx,dy),c=Math.min(m,46);if(m>0){dx*=c/m;dy*=c/m}kn.style.transform=`translate(${dx}px,${dy}px)`;jx=dx/46;jy=dy/46};
joy.onpointerdown=e=>{jid=e.pointerId;joy.setPointerCapture(jid);jm(e)};joy.onpointermove=e=>{if(e.pointerId===jid)jm(e)};
joy.onpointerup=joy.onpointercancel=()=>{jid=null;jx=jy=0;kn.style.transform=''};
cv.addEventListener('pointerdown',e=>{if(mode!=='sky'||sky.win||dOpen||sky.t<.6)return;const w=innerWidth,h=innerHeight,off=(1-sky.t)*h*.8;
SP.forEach((s,i)=>{if(Math.hypot(e.clientX-s[0]*w,e.clientY-(s[1]*h-off))<34){if(!S.stars.includes(i)){S.stars.push(i);hud();save()}AU.chime();say('⭐ STAR 0'+(i+1)+'\n\n'+CFG.stars[i])}})});
/* ================= DIALOGUE / UI ================= */
function say(t,cb){dq=[].concat(t);dcb=cb||null;dOpen=1;showD()}
function showD(){const d=$('dlg');if(!dq.length){d.classList.remove('on');dOpen=0;const c=dcb;dcb=null;c&&c();return}d.textContent=dq.shift();d.classList.add('on');AU.tone(620,.12,.02)}
let tt;function toast(t){const e=$('toast');e.textContent=t;e.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>e.classList.remove('on'),2800)}
const pan=h=>{$('panel').innerHTML=h;$('panel').classList.add('on');pOpen=1},unpan=()=>{$('panel').classList.remove('on');pOpen=0};
const gobtn=(t,f)=>{const g=$('go');g.textContent=t;g.onclick=f;g.classList.add('on')},hideGo=()=>$('go').classList.remove('on');
const fade=(o,ms)=>{const f=$('fade');f.style.transition=`opacity ${ms}ms`;f.style.opacity=o;return sleep(ms)};
const line=async(t,ms)=>{const e=$('cine');e.textContent=t;e.classList.add('on');await sleep(ms);e.classList.remove('on');await sleep(800)};
const nohud=b=>document.body.classList.toggle('nohud',b);
function hud(){$('hud').innerHTML=`🔑 ${S.keys.length}/3 &nbsp; 🌹 ${S.fl.length}/4 &nbsp; ⭐ ${S.stars.length}/5<b id="rst" title="Reset progress">↺</b>`;$('rst').onclick=()=>{if(confirm('Reset all progress?')){noSave=1;localStorage.removeItem(KEY);location.reload()}}}
function menu(){const it=[['YOUR FAVORITE','₱0',CFG.favDrink+'. Obviously.'],['MY FAVORITE','₱0',CFG.myFav+'.'],['OUR ORDER','₱0','Whatever we end up ordering.'],['ONE MORE CONVERSATION','₱∞','Always in stock.']];
pan('<h2>MENU</h2>'+it.map((r,i)=>`<div class="row" data-i="${i}">${r[0]}<i></i>${r[1]}</div>`).join('')+'<p id="mr">&nbsp;</p><button id="px">CLOSE</button>');
document.querySelectorAll('.row').forEach(e=>e.onclick=()=>{$('mr').textContent='"'+it[e.dataset.i][2]+'"';AU.chime()});$('px').onclick=unpan}
function booth(){pan('<h2>TAKE PHOTO?</h2><div><button id="y">YES</button> &nbsp; <button id="n">NO</button></div>');$('n').onclick=unpan;
$('y').onclick=async()=>{for(const t of['3...','2...','1...']){pan(`<h1>${t}</h1>`);AU.tone(520,.15,.05);await sleep(900)}pan('<h1>FLASH.</h1>');$('flash').classList.add('on');AU.tone(1500,.3,.06);await sleep(180);$('flash').classList.remove('on');await sleep(600);
pan('<canvas id="ph" width="180" height="230"></canvas><button id="k">KEEP</button>');photo();$('k').onclick=unpan}}
function photo(){const o=cx;cx=$('ph').getContext('2d');cx.fillStyle=C.cream;cx.fillRect(0,0,180,230);cx.fillStyle='#25243F';cx.fillRect(12,12,156,170);cx.fillStyle=C.gold;for(let i=0;i<14;i++)cx.fillRect(16+hf(i)*148,16+hf(i+9)*70,1.5,1.5);
cx.save();cx.translate(90,160);cx.scale(4,4);ch(-8,0,C.rose,C.lav,0,1);ch(8,0,C.ocean,'#2b2438',0,-1);cx.restore();cx.fillStyle=C.wood;cx.font='11px Georgia';cx.textAlign='center';cx.fillText('PHOTO 01 · NOT YET DEVELOPED',90,208);cx=o}
/* ================= AUDIO (procedural, no files needed) ================= */
const MIX={forest:[.03,.03,900],future:[0,0],cafe:[.04,.02,3500],city:[.04,.015,1500],beach:[.03,.07,600],garden:[.04,.01,1200],home:[.05,0,1200],pet:[.04,.01,1200],bedroom:[.012,0,1200]};
const AU={c:null,f:{},tm:0,ta:0,tf:0,mv:0,av:0,ld:0,
load(){if(this.ld)return;this.ld=1;for(const k in CFG.audio){const n=CFG.audio[k];if(!n)continue;const a=new Audio(n);a.preload='auto';a.loop=k==='music'||k==='ambience';a.volume=0;a.addEventListener('canplaythrough',()=>{a.ok=1;this.mix(this.tm,this.ta,this.tf)},{once:true});this.f[k]=a;if(a.loop)a.play().catch(()=>{})}},
tick(dt){for(const [k,v] of [['music',this.mv],['ambience',this.av]]){const a=this.f[k];if(a&&a.ok)a.volume=Math.max(0,Math.min(1,a.volume+(v-a.volume)*Math.min(1,dt*1.5)))}},
init(){this.load();if(this.c)return;try{const c=this.c=new(window.AudioContext||window.webkitAudioContext)();this.m=c.createGain();this.m.connect(c.destination);
this.pg=c.createGain();this.pg.gain.value=0;const lp=c.createBiquadFilter();lp.frequency.value=700;this.pg.connect(lp);lp.connect(this.m);
this.os=[110,165,220].map((f,i)=>{const o=c.createOscillator();o.type=i?'sine':'triangle';o.frequency.value=f;o.detune.value=i*4;o.connect(this.pg);o.start();return o});
const b=c.createBuffer(1,c.sampleRate*2,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
const n=c.createBufferSource();n.buffer=b;n.loop=true;this.nf=c.createBiquadFilter();this.nf.frequency.value=800;this.ng=c.createGain();this.ng.gain.value=0;n.connect(this.nf);this.nf.connect(this.ng);this.ng.connect(this.m);n.start();
const l=c.createOscillator(),lg=c.createGain();l.frequency.value=.13;lg.gain.value=.02;l.connect(lg);lg.connect(this.ng.gain);l.start();
const ch=[[110,165,220],[98,147,196],[87,131,175],[98,147,196]];let k=0;setInterval(()=>{k=(k+1)%4;this.os.forEach((o,i)=>o.frequency.setTargetAtTime(ch[k][i],c.currentTime,2))},7000)}catch(e){this.c=null}},
mix(m,a,f){this.tm=m;this.ta=a;this.tf=f;const mo=this.f.music&&this.f.music.ok,ao=this.f.ambience&&this.f.ambience.ok;this.mv=mo?Math.min(1,m*12):0;this.av=ao?Math.min(1,a*8):0;if(!this.c)return;const t=this.c.currentTime;this.pg.gain.setTargetAtTime(mo?0:m,t,1.2);this.ng.gain.setTargetAtTime(ao?0:a,t,1.2);f&&this.nf.frequency.setTargetAtTime(f,t,1)},
tone(f,d,v,ty){if(!this.c)return;const c=this.c,o=c.createOscillator(),g=c.createGain();o.type=ty||'sine';o.frequency.value=f;g.gain.setValueAtTime(v,c.currentTime);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+d);o.connect(g);g.connect(this.m);o.start();o.stop(c.currentTime+d)},
step(){const s=this.f.footsteps;if(s&&s.ok){s.currentTime=0;s.volume=curZ==='bedroom'?.2:.5;s.play().catch(()=>{});return}this.tone(60+Math.random()*25,.07,curZ==='bedroom'?.015:.04,'triangle')},
chime(){const s=this.f.interaction;if(s&&s.ok){s.currentTime=0;s.volume=.6;s.play().catch(()=>{});return}this.tone(880,.5,.05);setTimeout(()=>this.tone(1318,.7,.04),90)}};
/* ================= SKY (stars) / CINEMATIC EVENTS ================= */
const SP=[[.22,.32],[.42,.16],[.63,.3],[.8,.15],[.52,.44]];
async function toSky(win){hideGo();mode='cine';await fade(1,900);sky={t:0,win,say:0};mode='sky';nohud(1);AU.mix(.02,.03,700);await fade(0,1600);
setTimeout(()=>gobtn('COME DOWN',down),win?7000:5000)}
async function down(){hideGo();await fade(1,900);sit=0;mode='play';nohud(0);AU.mix(...MIX[curZ]);await fade(0,1200)}
async function ending(){mode='cine';nohud(1);AU.mix(0,0);await sleep(1600);await fade(1,2600);p.x=1200;p.y=1150;p.w=0;cam.x=1200;cam.y=1150;rb={a:{},t:[],p:0,tp:0};mode='void';await fade(0,1800);await sleep(5500);
mode='rebuild';const st=[['A house appears.',['home','bedroom']],['A garden appears.',['garden','pet']],['A road appears.',['city']],['A café appears.',['cafe']],['A beach appears.',['beach']],['The city appears.',['bld','forest']]];
for(let i=0;i<st.length;i++){rb.t.push(...st[i][1]);rb.tp=(i+1)/7;if(i==0)AU.tone(392,3,.03);await line(st[i][0],1900)}
await sleep(1500);AU.mix(.05,0,1200);await line('None of this exists.',2800);await line('Not yet.',2400);await line('But that\'s the point.',3400);gobtn('BUILD',buildFlow)}
function buildFlow(){hideGo();pan('<h2>What should we build next?</h2><input id="bi" maxlength="120" autocomplete="off"><button id="bs">ENTER</button>');setTimeout(()=>$('bi').focus(),100);
window.bsub=async()=>{window.bsub=0;const v=$('bi').value.trim()||'Something we haven\'t thought of yet.';S.build=v;S.done=1;try{localStorage.setItem('wwhly_build',JSON.stringify({answer:v,time:Math.floor(S.time),date:new Date().toISOString()}))}catch(e){}unpan();
await line('SAVING...',2000);rb.tp=1;await line('Then let\'s start there.',3200);await sleep(1500);await fade(1,2600);mode='end';AU.mix(0,0);$('fade').style.opacity=0;await sleep(1500);
await line('Thank you for exploring the world I imagined.',4200);await line('Now let\'s go make the real one.',3800);await line('♡',4200);results()};$('bs').onclick=bsub}
function results(){const q=['forest','cafe','city','beach','garden','home','pet','bedroom'].filter(n=>S.vis.includes(n)).length,pc=Math.min(100,Math.round((S.fl.length+S.keys.length+S.stars.length+q)/20*100)),t=Math.floor(S.time),f=n=>String(n).padStart(2,'0');
pan(`<h2>WORLD COMPLETE</h2><p>${pc}% EXPLORED</p><p>TOTAL TIME:<br>${f(Math.floor(t/3600))}:${f(Math.floor(t/60)%60)}:${f(t%60)}</p><p>FINAL REWARD:<br>LOCKED</p><button id="cl">CLAIM REWARD</button>`);
$('cl').onclick=async()=>{pan('<h1 style="letter-spacing:.14em">This reward cannot be delivered digitally.</h1>');await sleep(4200);pan('<h1 style="letter-spacing:.14em">Look beside you.</h1>')}}
/* ================= PLAYER / UPDATE ================= */
function upd(dt){T+=dt;AU.tick(dt);if(mode!=='title'&&mode!=='end'&&!S.done)S.time+=dt;
for(const k in rb.a)rb.a[k]=Math.min(1,rb.a[k]+dt*.8);for(const k of rb.t)if(rb.a[k]==null)rb.a[k]=0;rb.p+=(rb.tp-rb.p)*dt*.5;
if(mode==='sky'){sky.t=Math.min(1,sky.t+dt/7);if(sky.win&&sky.t>.55&&!sky.say){sky.say=1;say('Imagine coming home after a long day and knowing there\'s someone waiting for you.')}}
if(mode!=='play')return;
pet.wt-=dt;if(pet.wt<=0){pet.tx=1540+Math.random()*500;pet.ty=1460+Math.random()*680;pet.wt=2+Math.random()*4}
const pdx=pet.tx-pet.x,pdy=pet.ty-pet.y,pd=Math.hypot(pdx,pdy);if(pd>3){pet.x+=pdx/pd*34*dt;pet.y+=pdy/pd*34*dt;pet.fl=pdx>0}
const z=zoneAt(p.x,p.y);if(z&&z[0]!==curZ){curZ=z[0];AU.mix(...MIX[curZ]);const l=$('loc');l.textContent=z[6];l.classList.add('on');setTimeout(()=>l.classList.remove('on'),2400);if(!S.vis.includes(curZ)){S.vis.push(curZ);save()}}
let ix=(K.KeyD||K.ArrowRight?1:0)-(K.KeyA||K.ArrowLeft?1:0)+jx,iy=(K.KeyS||K.ArrowDown?1:0)-(K.KeyW||K.ArrowUp?1:0)+jy;const m=Math.hypot(ix,iy);
if(sit&&m>.5&&!dOpen){sit=0;hideGo()}
if(!dOpen&&!pOpen&&!sit&&m>.12){if(m>1){ix/=m;iy/=m}const sp=CFG.speed*(curZ==='bedroom'?.75:1)*dt;if(!hit(p.x+ix*sp,p.y))p.x+=ix*sp;if(!hit(p.x,p.y+iy*sp))p.y+=iy*sp;if(Math.abs(ix)>.1)p.dir=ix>0?1:-1;p.w=1;p.st+=dt;if(p.st>.32){p.st=0;AU.step()}}else p.w=0;
const inn=p.x>1830&&p.x<1885&&p.y>1218&&p.y<1250;if(inn&&!wasIn&&!sit&&!dOpen){sit=1;p.w=0;say('Somewhere we\'d probably sit for hours without realizing how late it got.',()=>{if(sit)gobtn('LOOK UP',()=>toSky(0))})}wasIn=inn;
if(S.door&&p.y<80&&!dOpen)ending();
cam.x+=(p.x-cam.x)*Math.min(1,dt*5);cam.y+=(p.y-cam.y)*Math.min(1,dt*5)}
/* ================= RENDERING ================= */
const rr=(x,y,w,h,r,c)=>{cx.beginPath();cx.roundRect?cx.roundRect(x,y,w,h,r):cx.rect(x,y,w,h);cx.fillStyle=c;cx.fill()};
const ZA=n=>mode==='rebuild'?(rb.a[n]||0):1;
const inv=(x,y)=>mode==='rebuild'||(Math.abs(x-cam.x)<VW/2+60&&Math.abs(y-cam.y)<VH/2+60);
const DAWN=['#101525','#403A5C','#B86F7C','#D99A86','#E7C98B','#F6EBDD'];
const lc=(a,b,t)=>{const A=parseInt(a.slice(1),16),B=parseInt(b.slice(1),16),f=k=>Math.round(((A>>k)&255)*(1-t)+((B>>k)&255)*t);return`rgb(${f(16)},${f(8)},${f(0)})`};
function bg(){if(mode==='void'||mode==='rebuild'){const q=Math.min(.999,rb.p)*5,i=Math.floor(q);return lc(DAWN[i],DAWN[i+1],q-i)}return mode==='end'?'#000':C.mid}
function ch(x,y,a,b,w,d,sp){const bob=w?Math.sin(T*14):0,l=w?Math.sin(T*14)*2:0;cx.fillStyle='rgba(0,0,0,.28)';cx.beginPath();cx.ellipse(x,y,7,2.5,0,0,7);cx.fill();
if(sp)rr(x-5,y-9,10,9,3,a);else{cx.fillStyle='#2b2438';cx.fillRect(x-4+l,y-5,3,5);cx.fillRect(x+1-l,y-5,3,5);rr(x-5,y-14+bob,10,10,3,a);cx.fillStyle=C.gold;cx.fillRect(x-5,y-14+bob,10,2)}
const hy=y+(sp?-14:-19)+bob;cx.fillStyle=C.cream;cx.beginPath();cx.arc(x,hy,5,0,7);cx.fill();cx.fillStyle=b;cx.beginPath();cx.arc(x,hy-1,5,3.3,6.1);cx.fill();cx.fillStyle=C.mid;cx.fillRect(x+d*2-.5,hy,1.2,1.5)}
function patch(x,y,w,h,col,n){cx.fillStyle=col;for(let i=0;i<n;i++){const a=hf(i*2+x),b=hf(i*2+1+y);cx.fillRect(x+a*w,y+b*h,10+a*20,4+b*8)}}
const DECO={
forest(x,y,w,h){cx.fillStyle='#4a4451';cx.fillRect(1130,620,140,280);patch(x,y,w,h,'#2F4638',50)},
future(x,y,w,h){const g=cx.createLinearGradient(0,y,0,y+h);g.addColorStop(0,C.cream);g.addColorStop(1,'#E7C98B');cx.fillStyle=g;cx.fillRect(x,y,w,h);cx.fillStyle='#D9C6B3';cx.font='20px Georgia';cx.textAlign='center';cx.textBaseline='middle';cx.fillText('T H E   F U T U R E',1200,200)},
cafe(x,y,w,h){cx.fillStyle='#4f3d36';for(let j=0;j<h/20;j++)cx.fillRect(x,y+j*20,w,2);cx.fillStyle='rgba(184,111,124,.35)';cx.beginPath();cx.ellipse(580,1170,110,60,0,0,7);cx.fill();
cx.fillStyle='#1c2438';cx.fillRect(x+140,y+14,220,34);cx.fillStyle=C.ocean;for(let i=0;i<14;i++)cx.fillRect(x+140+((i*17+T*60)%220),y+14+((i*11+T*140)%34),1,5)},
city(x,y,w,h){cx.fillStyle='#2c2b3d';cx.fillRect(x,1040,w,36);cx.fillStyle='#3a3d55';for(let i=0;i<10;i++)cx.fillRect(x+i*60,1250,30,3);cx.strokeStyle='#2a2e45';cx.lineWidth=3;cx.beginPath();cx.arc(1200,1230,60,0,7);cx.stroke()},
beach(x,y,w,h){cx.fillStyle='#344F63';cx.fillRect(x,1250,w,150);cx.strokeStyle=C.ocean;cx.lineWidth=1;for(let k=0;k<7;k++){cx.globalAlpha=.55*ZA('beach');cx.beginPath();for(let xx=x;xx<=x+w;xx+=12){const yy=1266+k*18+Math.sin(xx*.03+T*1.4+k)*3;xx==x?cx.moveTo(xx,yy):cx.lineTo(xx,yy)}cx.stroke()}
cx.globalAlpha=.5*ZA('beach');cx.strokeStyle=C.cream;cx.beginPath();for(let xx=x;xx<=x+w;xx+=10){const yy=1250+Math.sin(xx*.05+T*1.1)*3;xx==x?cx.moveTo(xx,yy):cx.lineTo(xx,yy)}cx.stroke();cx.globalAlpha=ZA('beach')},
garden(x,y,w,h){patch(x,y,w,h,'#536957',60);for(let i=0;i<60;i++){const a=x+hf(i)*w,b=y+hf(i+40)*h;cx.fillStyle=i%2?'#E7AEB7':C.rose;cx.fillRect(a+Math.sin(T*1.5+i),b,2,2)}},
pet(x,y,w,h){patch(x,y,w,h,'#536957',60);cx.fillStyle='rgba(128,100,82,.3)';cx.beginPath();cx.ellipse(1800,1800,240,300,0,0,7);cx.fill()},
home(x,y,w,h){cx.fillStyle=WL;cx.fillRect(900,1440,600,720);cx.fillStyle='#8B6856';cx.fillRect(914,1454,572,692);cx.fillStyle='#7d5d4c';for(let j=0;j<30;j++)cx.fillRect(914,1454+j*24,572,1);
cx.fillStyle='#D9C6B3';cx.fillRect(1200,1454,286,346);cx.fillStyle='#c8b3a0';for(let i=0;i<12;i++)for(let j=0;j<14;j++)if((i+j)%2)cx.fillRect(1200+i*24,1454+j*24,24,24);
cx.fillStyle='rgba(184,111,124,.5)';cx.beginPath();cx.ellipse(1040,1640,110,60,0,0,7);cx.fill();cx.fillStyle=C.gold;[960,1010,1300,1400].forEach(a=>cx.fillRect(a,1442,30,10))},
bedroom(x,y,w,h){cx.fillStyle='#302A3D';cx.fillRect(900,1800,600,400);cx.fillStyle=WL;cx.fillRect(900,1800,600,360);cx.fillStyle='#5a4a5c';cx.fillRect(914,1814,572,332);cx.fillStyle=C.lav;cx.beginPath();cx.ellipse(1100,2020,150,80,0,0,7);cx.fill()}};
function drawTree(t){const s=Math.sin(T*1.2+t.x)*1.3;cx.fillStyle='#5b4438';cx.fillRect(t.x-2,t.y-8,4,8);cx.fillStyle='#3f5a47';cx.beginPath();cx.arc(t.x+s,t.y-20,15,0,7);cx.fill();cx.fillStyle='#4c6b52';cx.beginPath();cx.arc(t.x+s-4,t.y-24,10,0,7);cx.fill()}
function glow(x,y,r,a,col){const g=cx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${col||'231,201,139'},${a})`);g.addColorStop(1,'rgba(231,201,139,0)');cx.fillStyle=g;cx.fillRect(x-r,y-r,r*2,r*2)}
function obj(o){cx.globalAlpha=ZA(zn(o.x,o.y));const sw=o.f!=null?Math.sin(T*1.6+o.f)*1.2:0;
if(o.c)rr(o.x-o.w/2,o.y-o.h/2,o.w,o.h,4,o.c);
if(o.id==='tv'&&S.tv){cx.fillStyle=Math.sin(T*3)>0?C.lav:C.rose;cx.fillRect(o.x-30,o.y-5,60,10);glow(o.x,o.y+20,60,.25,'246,235,221')}
if(o.id==='fridge'){cx.fillStyle=fro?C.gold:'#b9a692';cx.fillRect(o.x-16,o.y-24,32,fro?46:2);cx.fillStyle='#8a7867';cx.fillRect(o.x-16,o.y-2,32,1);if(fro)glow(o.x,o.y+8,40,.4)}
if(o.g&&(o.a!=='window')&&vis(o))glow(o.x,o.y,26+Math.sin(T*3)*3,.4);if(o.a==='window')glow(o.x,o.y-20,44,.3+Math.sin(T*2)*.05);
if(o.e){cx.font=(o.z||18)+'px serif';cx.textAlign='center';cx.textBaseline='middle';if(o===pet&&pet.fl){cx.save();cx.translate(o.x,0);cx.scale(-1,1);cx.fillText(o.e,0,o.y);cx.restore()}else cx.fillText(o.e,o.x+sw,o.y)}
if(o===pet){cx.font='6px Georgia';cx.fillStyle=C.gold;cx.textAlign='center';cx.fillText(CFG.petName,o.x,o.y-14)}
if(o.t){cx.font='bold 9px Georgia';cx.fillStyle=C.cream;cx.textAlign='center';cx.textBaseline='middle';cx.fillText(o.t,o.x,o.y)}
cx.globalAlpha=1}
function world(){
for(const z of Z){if(z[0]==='future'&&!S.door&&mode==='play')continue;cx.globalAlpha=ZA(z[0]);cx.fillStyle=z[5];cx.fillRect(z[1],z[2],z[3],z[4]);if(z[7]){cx.fillStyle=`rgba(16,21,37,${z[7]})`;cx.fillRect(z[1],z[2],z[3],z[4])}DECO[z[0]]&&DECO[z[0]](z[1],z[2],z[3],z[4])}
cx.globalAlpha=1;
for(const r of SO)if(r.c){cx.globalAlpha=ZA(zn(r.x,r.y));cx.fillStyle=r.c;cx.fillRect(r.x,r.y,r.w,r.h);cx.fillStyle='rgba(246,235,221,.15)';cx.fillRect(r.x,r.y,r.w,3)}
cx.globalAlpha=ZA('bld');BLD.forEach(([x,e],i)=>{cx.fillStyle='#29283A';cx.fillRect(x,900,90,140);cx.fillStyle='#1d1c2b';cx.fillRect(x,900,90,8);for(let a=0;a<3;a++)for(let b=0;b<3;b++){cx.fillStyle=Math.sin(T*.3+i*7+a*3+b*5)>-.6?C.gold:'#3a3550';cx.fillRect(x+12+a*26,920+b*24,14,16)}cx.fillStyle='#171D32';cx.fillRect(x+35,1005,20,35);rr(x+20,985,50,14,3,C.rose);cx.font='11px serif';cx.textAlign='center';cx.textBaseline='middle';cx.fillText(e,x+45,992)});
cx.globalAlpha=1;
if(!S.gate){rr(1130,598,140,12,2,C.wood);for(let x=1140;x<1270;x+=16)rr(x,588,5,28,1,'#9b7a63')}else{rr(1126,588,6,28,1,C.wood);rr(1268,588,6,28,1,C.wood)}
rr(1130,402,140,20,3,S.door?C.gold:'#D9C6B3');if(S.door)glow(1200,412,90,.5);else{cx.font='14px serif';cx.textAlign='center';cx.textBaseline='middle';cx.fillText('🔒',1200,412)}
const L=[];for(const t of TR)if(inv(t.x,t.y))L.push(t);for(const o of OB)if(vis(o)&&inv(o.x,o.y)&&!(o.a==='gate'||o.a==='door'))L.push(o);L.push(p);
const ky=o=>o.k||(o===p||o.tr?o.y:o.y+(o.c?o.h/2:8));L.sort((a,b)=>ky(a)-ky(b));
for(const o of L){if(o.tr){cx.globalAlpha=ZA("forest");drawTree(o);cx.globalAlpha=1}else if(o===p)ch(p.x,p.y,C.rose,C.lav,p.w,p.dir,sit);else obj(o)}
for(const [x,y] of LP){cx.globalAlpha=ZA(zn(x,y));if(inv(x,y))glow(x,y,70,.22+Math.sin(T*7+x)*.04)}cx.globalAlpha=1;
if(mode==='rebuild')return;
cx.fillStyle=C.gold;for(let i=0;i<40;i++){cx.globalAlpha=.3+.3*Math.sin(T*2+i);cx.fillRect(cam.x-VW/2+((hf(i)*VW+T*(3+i%4)+Math.sin(T*.3+i)*20)%VW),cam.y-VH/2+(((hf(i+77)*VH-T*(4+i%3))%VH)+VH)%VH,1.4,1.4)}cx.globalAlpha=1;
const n=near();if(n&&mode==='play'&&!dOpen&&!pOpen&&!sit){const bx=n.x,by=n.y-n.h/2-12+Math.sin(T*4)*1.5;glow(bx,by,16,.6);rr(bx-6,by-6,12,12,3,C.gold);cx.fillStyle=C.mid;cx.font='bold 8px Georgia';cx.textAlign='center';cx.textBaseline='middle';cx.fillText('E',bx,by+.5)}}
function stars(){const w=innerWidth,h=innerHeight;for(let i=0;i<100;i++){cx.globalAlpha=.3+.5*Math.abs(Math.sin(T*.8+i));cx.fillStyle=i%3?C.cream:C.gold;cx.fillRect((hf(i)*w+T*(3+i%5))%w,hf(i+300)*h,1+i%2,1+i%2)}cx.globalAlpha=1}
function drawSky(){const w=innerWidth,h=innerHeight,e=1-Math.pow(1-sky.t,3),off=(1-e)*h*.8,g=cx.createLinearGradient(0,0,0,h);g.addColorStop(0,'#101525');g.addColorStop(.6,'#171D32');g.addColorStop(1,'#25243F');cx.fillStyle=g;cx.fillRect(0,0,w,h);
for(let i=0;i<170;i++){cx.globalAlpha=.25+.6*Math.abs(Math.sin(T*.9+i));cx.fillStyle=i%3?C.cream:C.gold;const r=1+hf(i+9)*1.4;cx.fillRect(hf(i)*w,hf(i+500)*h*.85-off,r,r)}cx.globalAlpha=1;
if(!sky.win)SP.forEach((s,i)=>{const x=s[0]*w,y=s[1]*h-off,f=S.stars.includes(i);glow(x,y,f?34:24,f?.7:.5+.2*Math.sin(T*3+i));cx.fillStyle=C.gold;cx.fillRect(x-1.5,y-1.5,3,3);cx.fillRect(x-7,y-.5,14,1);cx.fillRect(x-.5,y-7,1,14)});
const hz=h*(.62+.5*e);if(hz<h){const o=cx.createLinearGradient(0,hz,0,h);o.addColorStop(0,'#344F63');o.addColorStop(1,'#101525');cx.fillStyle=o;cx.fillRect(0,hz,w,h-hz)}}
function render(){cx.setTransform(DPR,0,0,DPR,0,0);const w=innerWidth,h=innerHeight;if(mode==='sky'){drawSky();return}
cx.fillStyle=bg();cx.fillRect(0,0,w,h);if(mode==='end')return;if(mode==='title'||mode==='void'||mode==='rebuild')stars();
if(mode==='title'){cx.save();cx.translate(w/2,h/2);cx.scale(3,3);ch(0,0,C.rose,C.lav,0,1);cx.restore();return}
const s=mode==='rebuild'?Math.min(w/1900,h/1750):SC,ox=mode==='rebuild'?1200:cam.x,oy=mode==='rebuild'?1130:cam.y;
cx.save();cx.translate(w/2,h/2);cx.scale(s,s);cx.translate(-ox,-oy);if(mode==='void')ch(p.x,p.y,C.rose,C.lav,0,1);else world();cx.restore();
if(curZ!=='future'&&mode!=='rebuild'&&mode!=='void'){const v=cx.createRadialGradient(w/2,h/2,Math.min(w,h)*.3,w/2,h/2,Math.max(w,h)*.75);v.addColorStop(0,'rgba(16,21,37,0)');v.addColorStop(1,'rgba(16,21,37,.55)');cx.fillStyle=v;cx.fillRect(0,0,w,h)}}
let last=0;function frame(ts){const dt=Math.min(.1,(ts-last)/1000||0);last=ts;upd(dt);render();requestAnimationFrame(frame)}
setInterval(save,4000);addEventListener('beforeunload',save);
/* ================= BOOT ================= */
hud();
$('start').onclick=async()=>{AU.init();$('title').classList.add('off');await sleep(1300);const hp=$('help');hp.textContent=TOUCH?'JOYSTICK — MOVE\nBUTTON — INTERACT':'WASD / ARROW KEYS — MOVE\nE — INTERACT';hp.classList.add('on');await sleep(3400);hp.classList.remove('on');await sleep(900);
if(S.done){mode='end';results();return}
await fade(1,700);mode='play';nohud(0);await fade(0,1800)};
requestAnimationFrame(frame);
