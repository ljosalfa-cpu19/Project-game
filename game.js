'use strict';
/* ================= CONFIG (edit personal text here) ================= */
const CFG={petName:'Biscuit',favDrink:'Iced coffee',myFav:'Whatever you\'re having, but bigger',favFood:'Leftover pasta',speed:118,
// Your own audio: put the files in this same folder. Set a name to '' to use the built-in generated sound instead.
audio:{music:'song.mp3',ambience:'',footsteps:'',interaction:''},
flowers:['Things I want to experience with you.','Places I want to take you.','Things I want to learn with you.','Things I still want to become.'],
stars:['A trip we haven\'t taken.','A restaurant we haven\'t discovered.','A stupid inside joke we haven\'t made yet.','A photograph that hasn\'t been taken.','A place we haven\'t called home.'],
trips:[['A CITY WE\'VE NEVER SEEN','07:15','We\'d get lost on purpose.'],['A BEACH WITH NO SIGNAL','10:40','Just us and a dying battery.'],['SOMEWHERE COLD','13:05','So I have an excuse to share a blanket.'],['HOME','23:59','The last train. Always the best one.']],
stall:[['LANTERN','₱0','Light one. Make a wish. No refunds.'],['SOMETHING ON A STICK','₱0','We\'ll order two.'],['FORTUNE','₱0','"You will be asked what\'s for dinner. Soon. Often."'],['SMALL TREASURE','₱0','It\'ll be worth more than it cost.']],
tickets:['🎫 TICKET 1/4\n\nONE TRIP\nDestination: your choice.\nValid whenever we both say yes.','🎫 TICKET 2/4\n\nONE DINNER\nYou pick the place.\nI will not complain. (Much.)','🎫 TICKET 3/4\n\nONE LAZY DAY\nNo plans. No alarms.\nJust the couch.','🎫 TICKET 4/4\n\nONE "YES"\nTo a random idea.\nNo questions asked.'],
letters:['To someone who just started exploring:\nYou\'re already better at this than I am.\nKeep going.','I keep thinking how ordinary this would feel if it were real.\nA Tuesday, but with you in it.','Every place on this map is a maybe.\nI\'d like to turn them into memories, one at a time.','You found everything.\nOf course you did.\nSome things are better delivered in person.']};
const C={mid:'#101525',lav:'#403A5C',rose:'#B86F7C',cream:'#F6EBDD',gold:'#E7C98B',sage:'#7F967B',ocean:'#587A8C',wood:'#806452'};
const WL='#6D5662',CW='#3A2E2C';
/* ================= STATE / SAVE SYSTEM ================= */
const KEY='wwhly_save_v1';let noSave=0;
if(/reset/.test(location.search)){localStorage.removeItem(KEY);history.replaceState(0,'',location.pathname)}
const S={ms:0,tk:[],coin:0,wish:'',bottle:'',fl:[],keys:[],gate:0,door:0,stars:[],vis:[],c:{},time:0,done:0,build:'',tv:0,x:1200,y:1380};
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
const Z=[['forest',700,420,1000,480,'#3B5240','FOREST',.35],['future',1000,-1500,400,1920,'#F6EBDD','THE FUTURE',0],
['cafe',300,900,600,500,'#59463F','CAFÉ',0],['city',900,900,600,500,'#202334','CITY',0],['beach',1500,900,700,500,'#D8C3A5','BEACH',.5],
['garden',300,1400,600,800,'#7F967B','GARDEN',.3],['home',900,1400,600,800,'#302A3D','OUR HOME',0],['pet',1500,1400,600,800,'#7F967B','PET AREA',.32],['bedroom',900,1800,600,400,'#302A3D','BEDROOM',0],
['station',-300,1500,600,500,'#3A3A4A','STATION',.15],['lighthouse',2200,900,600,500,'#2C3A50','LIGHTHOUSE',.35],['orchard',300,2200,1800,500,'#42604A','ORCHARD',.28],['market',2100,1400,700,800,'#3B3148','NIGHT MARKET',.1],
['cinema',0,3000,400,300,'#2a1f2e','CINEMA',.35],['books',500,3000,400,300,'#5a4636','BOOKSHOP',.1],['arcade',1000,3000,400,300,'#1c1f3a','ARCADE',.2],['noodle',1500,3000,400,300,'#6b4a3a','NOODLE SHOP',0],['roof',2000,3000,400,300,'#7a4e63','ROOFTOP',0],['treehouse',2500,3000,400,300,'#5b4632','TREEHOUSE',.2],['cave',3000,3000,400,300,'#1d2436','CAVE',.55]];
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
{const cl=(x,y)=>[[1200,2470],[700,2510],[1950,2640],[1000,2600],[1500,2450]].some(c=>Math.hypot(x-c[0],y-c[1])<70);for(let i=0;i<36;i++){const x=340+hf(i*5+2)*1720,y=2250+hf(i*9+3)*430;if(!cl(x,y))tree(x,y)}}
TR.sort((a,b)=>a.y-b.y);
const LP=[[960,1100],[1440,1100],[1200,1385],[1000,1560],[1400,1560],[1040,1990],[580,1130],[400,1000],[800,1040],[1200,1230],[1130,1660]];
const BLD=[[915,'🎬'],[1010,'📚'],[1310,'🕹️'],[1405,'🍜']];
const pet={id:'pet',x:1800,y:1700,tx:1800,ty:1700,wt:0,e:'🐕',z:20,a:'pet',l:['This creature has decided you\'re its favorite.','Understandable.']};
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
{x:1380,y:1480,w:50,h:30,c:'#59463F',s:1,e:'🍳',a:'cook'},
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
{x:865,y:1480,e:'📮',a:'mail'},
{x:450,y:1480,e:'🪑',l:['Perfect for doing absolutely nothing.']},
{x:600,y:1800,w:34,h:34,s:1,e:'⛲',z:28,a:'fountain'},
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
{x:960,y:1058,a:'enter',b:0,l:['One day we\'ll argue about what movie to watch.']},{x:1055,y:1058,a:'enter',b:1,l:['I\'ll pretend I came here for you.']},
{x:1355,y:1058,a:'enter',b:2,l:['Prepare to lose.']},{x:1450,y:1058,a:'enter',b:3,l:['Our future argument about where to eat.']},
{x:1200,y:1230,w:34,h:46,c:C.rose,s:1,e:'📸',g:1,a:'booth'},
{x:1000,y:1300,e:'🗑️',l:['Something in here is watching me.']},{x:1400,y:1300,e:'🪑',l:['Reserved for whoever\'s late.']},
// beach
{x:1700,y:1100,e:'🐚',l:['Shhh. It\'s listening.']},{x:2050,y:1150,e:'🍶',a:'bottle'},{x:1640,y:1030,e:'⛱️',z:24,l:['Two chairs. We\'d fight over the good one.']},
// forest
{id:'k1',x:1640,y:700,w:30,h:20,e:'🌲',z:54,g:1,a:'key1'},
{x:1200,y:648,e:'🪧',l:['The sign says: "Not yet."']},{x:900,y:680,e:'🦉',a:'owl'},{x:800,y:800,e:'🍄',l:['Not edible. Probably.']},
{x:1200,y:606,w:140,h:16,a:'gate'},{x:1200,y:414,w:140,h:20,a:'door'}
];
R(2200,1262,600,138);
OB.push(
{x:60,y:1560,e:'🪧',g:1,a:'board'},{x:-160,y:1700,w:120,h:56,c:'#3a3d55',s:1,e:'🚂',z:44,l:['The train won\'t leave until we\'re both on it.','It has been very clear about this.']},
{x:100,y:1830,e:'🪑',l:['Where we\'ll wait for a train that\'s twenty minutes late. Together.']},{x:-40,y:1900,e:'🧳',l:['Two suitcases. One is definitely overpacked.','You know which.']},{x:-200,y:1540,e:'🕰️',l:['It\'s always exactly the right time to leave.']},{x:-240,y:1950,e:'🎫',g:1,a:'ticket',tk:0},
{x:2560,y:1040,w:40,h:70,c:'#E8DCC8',s:1,e:'🗼',z:60,a:'light'},{x:2320,y:1180,e:'🪨',l:['Very good at holding still. You could learn something.']},{x:2450,y:1220,e:'🦀',l:['It has pinched better people than you.','No hard feelings. Mostly.']},{x:2700,y:1200,e:'🎫',g:1,a:'ticket',tk:1},
{x:1200,y:2470,e:'🧺',z:24,l:['Snacks we\'ll say we\'ll share.','You\'d eat most of them.']},{x:700,y:2500,e:'⛺',z:34,a:'camp'},{x:770,y:2520,e:'🔥',g:1,l:['Warm. Nobody has to say anything.']},{x:1000,y:2600,e:'🍎',l:['Someone will say "one bite" and eat the whole thing.']},{x:1950,y:2640,e:'🎫',g:1,a:'ticket',tk:2},
{x:2250,y:1560,w:70,h:34,c:C.wood,s:1,e:'🏮',z:26,a:'stall'},{x:2450,y:1560,w:70,h:34,c:C.rose,s:1,e:'🍡',z:26,l:['Something on a stick. It\'s always something on a stick.','We\'ll order two and pretend one is for someone else.']},{x:2260,y:1850,w:50,h:40,s:1,e:'🎠',z:46,l:['We\'d both say we\'re too old for this.','We wouldn\'t be.']},{x:2560,y:1900,w:50,h:30,s:1,e:'🎡',z:74,a:'wheel'},{x:2700,y:1560,e:'🎈',z:24,l:['One string. Somehow you already have it.']},{x:2700,y:2100,e:'🎫',g:1,a:'ticket',tk:3});
OB.push(
{x:200,y:3288,e:'🚪',z:26,a:'exit'},{x:340,y:3062,e:'🎞️',g:1,a:'showing'},{x:50,y:3110,e:'🍿',l:['Shared. Somehow you have most of it.']},{x:120,y:3170,w:76,h:26,c:C.rose,s:1,l:['Your seat. Obviously.']},{x:280,y:3170,w:76,h:26,c:C.lav,s:1,l:['Mine. Close enough to whisper the bad jokes.']},{x:200,y:3225,e:'🎟️',l:['Two stubs. Nobody remembers who paid.']},
{x:700,y:3288,e:'🚪',z:26,a:'exit'},{x:610,y:3050,w:90,h:32,c:C.wood,s:1,e:'📚',z:22,a:'books'},{x:730,y:3050,w:90,h:32,c:C.wood,s:1,e:'📖',z:22,l:['A book with our names in the margins.','Not written yet.']},{x:850,y:3050,w:60,h:32,c:C.wood,s:1,e:'📚',z:22,a:'secret'},{x:560,y:3220,e:'🛋️',l:['We\'d both fall asleep in ten minutes.']},{x:800,y:3200,e:'🐈',l:['It has decided you\'re staff.']},{x:640,y:3130,e:'☕',l:['Still warm. Nobody\'s here. Weird.']},
{x:1200,y:3288,e:'🚪',z:26,a:'exit'},{x:1065,y:3045,w:36,h:44,c:'#2b2f55',s:1,e:'🕹️',z:20,a:'arcade'},{x:1125,y:3045,w:36,h:44,c:'#2b2f55',s:1,e:'👾',z:20,l:['Prepare to lose.']},{x:1185,y:3045,w:36,h:44,c:'#2b2f55',s:1,e:'🏓',z:20,l:['You\'d win. I\'d call it a tie.']},{x:1340,y:3055,w:44,h:50,c:C.rose,s:1,e:'🧸',z:24,l:['₱200 to win a ₱50 plush.','Worth it. Every time.']},{x:1100,y:3200,e:'🪙',l:['A token. Save it for the last try.']},
{x:1700,y:3288,e:'🚪',z:26,a:'exit'},{x:1700,y:3055,w:260,h:34,c:C.wood,s:1,e:'🍜',z:24,a:'order'},{x:1700,y:3018,e:'🧑‍🍳',z:20,a:'npc',k:'chef'},{x:1590,y:3140,e:'🪑',l:['Your stool. Closer to the good broth.']},{x:1810,y:3140,e:'🪑',l:['Mine. Facing you, on purpose.']},{x:1560,y:3230,e:'🏮',g:1,l:['It flickers whenever someone says "just a bite".']});
const YR=[[330,1,'📦',['Unpacked. Mostly.','Some boxes will stay boxes forever.']],[80,3,'🦴',[CFG.petName+' is older now.','Still convinced the house belongs to '+CFG.petName+'.']],[-170,7,'🗺️',['A map covered in pins.','Every star in the sky is a real place now.']],[-420,15,'🍝',['Dinner at 11 PM. Still.','Same table. Better arguments.']],[-670,25,'🏡',['Our address. Nicer than the doghouse\'s.','Finally.']],[-920,40,'📸',['A wall of photographs.','Every one of them was "not yet developed" once.']],[-1170,50,'🪑',['Two chairs, side by side.','One of them has always been yours.']]];
OB.push(...YR.map((r,i)=>({x:i%2?1290:1110,y:r[0],e:r[2],z:24,l:r[3],a:r[1]==25?'cap':0})));
OB.push(
{x:200,y:1640,e:'🧑‍✈️',z:22,a:'npc',k:'master'},{x:2400,y:1110,e:'🧓',z:22,a:'npc',k:'keeper'},{x:2380,y:1700,e:'🔮',g:1,z:24,a:'npc',k:'fort'},
{x:-150,y:1580,e:'📌',a:'clue',k:0},{x:2340,y:1650,e:'📌',a:'clue',k:1},{x:900,y:2450,e:'📌',a:'clue',k:2},
{x:1200,y:1110,e:'📋',a:'quests'},{x:420,y:1020,e:'🎹',z:26,a:'piano'},{x:1750,y:1235,e:'🎣',a:'fishing'},{x:420,y:2100,e:'📦',a:'capsule'},
{x:1500,y:2450,e:'✖️',need:()=>S.tmf.length>=3&&!S.tr,a:'dig'},
{x:2200,y:3288,e:'🪜',z:26,a:'exit'},{x:2200,y:3150,e:'🪑',a:'roofsky'},{x:2100,y:3110,e:'🔭',l:['Pointed at a star with no name yet.','Yours to pick.']},{x:2310,y:3130,e:'📝',l:['"If you\'re reading this, you found the secret room."','"Nobody else knows about it."']});
OB.push(
{x:2450,y:2050,e:'🏺',z:26,a:'pottery'},{x:1440,y:1830,e:'🪞',g:1,a:'mirror'},{x:1560,y:1470,e:'🦴',a:'hide'},
{x:760,y:540,e:'🛖',z:34,a:'enter',b:5,l:['A rope ladder, half hidden in the leaves.','Someone has been keeping this place secret.']},
{x:2680,y:1130,e:'🕳️',a:'enter',b:6,l:['A dark hole under the lighthouse rocks.','It smells like adventure and damp.']},
{x:2700,y:3288,e:'🪜',z:26,a:'exit'},{x:2700,y:3150,e:'🪑',a:'tsky'},{x:2600,y:3080,e:'📖',l:['A guestbook. One entry so far:','"We were here."']},{x:2800,y:3080,e:'🕯️',g:1,l:['Somebody keeps it lit. Nobody admits to it.']},
{x:3200,y:3288,e:'🪜',z:26,a:'exit'},{x:3100,y:3080,e:'💎',g:1,l:['It hums when you\'re near.']},{x:3300,y:3090,e:'💎',g:1,l:['A different note. Slightly flat.']},{x:3200,y:3180,e:'🗣️',l:['"Hello?"','"...hello? ...hello?"','It\'s only you. Enjoy it.']});
OB.push(
{x:1600,y:1180,e:'🪁',a:'kite'},{x:2300,y:1235,e:'⛵',a:'boats'},{x:2500,y:1130,e:'🔦',a:'lpuz'},{x:2640,y:1500,e:'🎇',g:1,a:'fest'},
{x:1350,y:2520,e:'🥄',a:'lf',k:'chef',need:()=>!S.lf.includes('chef')},{x:1900,y:1150,e:'👓',a:'lf',k:'keeper',need:()=>!S.lf.includes('keeper')},{x:1400,y:520,e:'📯',a:'lf',k:'master',need:()=>!S.lf.includes('master')},
{x:1000,y:1830,e:'🪶',a:'dream'},{x:1440,y:2110,e:'👗',a:'wardrobe'});
OB.forEach((o,i)=>{o.id=o.id||'o'+i;o.w=o.w||28;o.h=o.h||28});
const vis=o=>!((o.f!=null&&S.fl.includes(o.f))||(o.tk!=null&&S.tk.includes(o.tk))||(o.need&&!o.need()));
function pick(id,l){const n=S.c[id]||0;S.c[id]=n+1;say(l[Math.min(n,l.length-1)]);save()}
function getKey(n){if(S.keys.includes(n))return;S.keys.push(n);const k=S.keys.length;AU.chime();toast(k==1?'KEY ACQUIRED':k+'/3');if(k==3){S.door=1;setTimeout(()=>toast('🔓 A NEW AREA HAS BEEN UNLOCKED'),2600)}hud();save()}
const ACT={
tv(){S.tv=1;say('CURRENT PROGRAM\n\nYou & Me Being Old and Still Arguing About What to Watch.\n\nEPISODE 47,291')},
fridge(){fro=1;say(['I\'d probably ask what you want to eat even though I already know what you\'re going to say.',`[HER FAVORITE DRINK]\n${CFG.favDrink}\n\nLOW STOCK\nSomeone keeps drinking these.`,`[LEFTOVERS]\n${CFG.favFood}\n\nLabeled "DO NOT EAT."\nNobody has ever obeyed the label.`,'A sticky note on the door:\n"Your seat. Your side. Your spot."\n\nBelow it, smaller: "Then check where you sleep."','One expired yogurt.\nIt has been here longer than the house.'],()=>fro=0)},
bed(){if(!S.keys.includes(3)&&S.c.couch1&&S.c.pillow&&S.c.chair)say('Something is taped under the bed frame.',()=>getKey(3));else pick('bed',['I already know you\'re stealing most of the blanket.'])},
window(){toSky(1)},
flower(o){S.fl.push(o.f);const n=S.fl.length;AU.chime();say(CFG.flowers[o.f],()=>{if(n==4){S.gate=1;toast('4/4 FLOWERS COLLECTED\nSomewhere, a gate opens.');[880,1109,1318,1760].forEach((f,i)=>setTimeout(()=>AU.tone(f,1,.05),i*160))}else toast(n+'/4');hud();save()})},
key1(){S.keys.includes(1)?pick('k1b',['Just a tree now. A very good one.']):say('There\'s something behind the tree.',()=>getKey(1))},
key2(){S.keys.includes(2)?pick('k2b',['Just loose change now.']):say('A jar of loose change.\nAnd a small key, taped to the bottom.',()=>{S.coin=1;getKey(2);setTimeout(()=>toast('🪙 A COIN'),3200)})},
gate(){say(S.gate?'Open.':'Shut tight. It looks like it\'s waiting for something to bloom.')},
door(){say(S.door?'It\'s open.':'🔒\nREQUIRES 3 KEYS')},
menu,booth,cook:cookGame,kite,boats,fest,dream,lpuz,wardrobe,lf:o=>{S.lf.push(o.k);say(['You found '+LF[o.k].item+'!','Better return it to its owner.'])},
pottery:()=>S.mug?say('Your mug "'+S.mug+'" is drying on the shelf. It leans a little.'):ask('SHAPE YOUR MUG','Name your mug…',v=>{S.mug=v;say(['You shape it on the wheel. It leans a little.','It\'s perfect. It\'s yours.'],()=>toast('☕ MUG MADE'))}),
mirror:()=>{const m=S.alt=((S.alt||0)+1)%4;S.mir=(S.mir||0)+1;say(['The mirror ripples.',['The world as it was.','The world that could have been: midnight.','The world that could have been: rain, always.','The world that could have been: slower, and older.'][m]])},
hide:()=>{if(S.hide){const d=Math.hypot(p.x-pet.x,p.y-pet.y);return say(d<120?'🔥 Very warm.':d<300?'Warm.':'Cold.')}S.hide=1;pet.fol=0;pet.wt=1e9;pet.tx=1560+Math.random()*480;pet.ty=1500+Math.random()*620;say(['Ready or not.',CFG.petName+' ran off to hide.','Find him, then press E on him.\n(Press E on the bone for hints.)'])},
tsky:()=>look(['Leaves, then stars.','Nobody can find you up here.']),npc:o=>say(NPC[o.k](),()=>{if(S.sv.length&&!S.gv[o.k]&&(S.c.g=(S.c.g||0)+1)%2)setTimeout(()=>giftMenu(o.k),200)}),clue:o=>say('A pinned note:\n"'+CFG.clues[o.k]+'"'),
secret:()=>S.sr?goIn(4):ask('A LOOSE BOOK','3 digits (notes are pinned around the map)…',v=>{if(v==='314'){S.sr=1;say(['Click.','The shelf swings open.'],()=>goIn(4))}else say('Nothing happens. The shelf looks unimpressed.')}),
quests:questBoard,piano:piano,fishing:fishing,roofsky:()=>look(['The whole sky, and only you know how to get here.']),
capsule:()=>S.cap?say('The soil is freshly turned. It will keep.'):ask('BURY A NOTE','Dear future me…',v=>{S.cap=v;say('You bury it. Someone will dig it up in twenty-five years.')}),
cap:o=>S.cap?say(['You dig up the capsule from long ago.','"'+S.cap+'"','Past you was very sure of everything.']):say(o.l),
dig:()=>pet.fol&&Math.hypot(pet.x-1500,pet.y-2450)<90?(S.tr=1,say(['Biscuit digs. Furiously.',CFG.treasure],()=>toast('💎 TREASURE FOUND'))):say('Something is buried here.\nBiscuit would know. Bring him.'),enter:o=>{const n=S.c[o.id]||0;S.c[o.id]=n+1;n?goIn(o.b):say(o.l,()=>goIn(o.b))},exit:goOut,
showing:()=>lst('NOW SHOWING',[['THE ONE YOU PICK','19:00','I\'ll say I don\'t like it. Then watch it twice.'],['THE ONE I PICK','21:30','You\'ll pretend to be asleep. You won\'t be.'],['WHAT WE ACTUALLY WATCH','23:45','Something neither of us chose. We\'ll talk through half of it.']]),
books:()=>lst('THE SHELF',CFG.flowers.map(f=>[f,'','Not written yet. We\'ll write it together.'])),arcade:arcadeGame,
order:()=>lst('ORDER',[['SPICY NOODLES','₱0','You\'ll say "just a bite" and finish half.'],['MILD NOODLES','₱0','Mine. I have no dignity.'],['ONE BOWL, TWO SPOONS','₱0','Our actual order.'],[CFG.favDrink.toUpperCase(),'₱0','On the house. Obviously.']]),pet:aPet,owl:aOwl,mail:aMail,fountain:aFount,bottle:aBottle,ticket:aTicket,light:aLight,board:()=>lst('DEPARTURES',CFG.trips),stall:()=>lst('NIGHT MARKET',CFG.stall),camp:()=>look(['You lie back on the grass.','The sky is very interested in you.']),wheel:()=>look(['At the top, the whole map lies below you.','Every bit of it is somewhere we haven\'t been yet.'])};
function near(){let b=null,bd=30;for(const o of OB){if(!vis(o))continue;const dx=Math.max(o.x-o.w/2-p.x,0,p.x-o.x-o.w/2),dy=Math.max(o.y-o.h/2-p.y+4,0,p.y-4-o.y-o.h/2),d=Math.hypot(dx,dy)+(o===pet&&pet.fol?20:0);if(d<bd){bd=d;b=o}}return b}
function interact(o){AU.chime();if(o.a)ACT[o.a](o);else pick(o.id,o.l)}
/* ================= COLLISIONS ================= */
const walk=(x,y)=>{const z=zoneAt(x,y);return z&&(z[0]!=='future'||S.door)};
function hit(x,y){if(!walk(x-6,y)||!walk(x+6,y))return 1;const a=x-6,b=y-4,t=r=>a<r.x+r.w&&a+12>r.x&&b<r.y+r.h&&b+8>r.y;
return SO.some(t)||(!S.gate&&t(GATE))||(!S.door&&t(DOOR))||OB.some(o=>o.s&&t({x:o.x-o.w/2,y:o.y-o.h/2,w:o.w,h:o.h}))}
/* ================= INPUT ================= */
const K={};let jx=0,jy=0;
addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'){if(e.code==='Enter'&&window.bsub)bsub();return}K[e.code]=1;if(e.code.startsWith('Arrow')||e.code==='Space')e.preventDefault();if((e.code==='KeyE'||e.code==='Space')&&!e.repeat)press();if(!e.repeat&&e.code==='KeyM')mi?closeMap():openMap();if(!e.repeat&&e.code==='KeyJ')openJournal();if(!e.repeat&&e.code==='KeyQ')openSide();if(!e.repeat&&e.code==='KeyP')snap();if(!e.repeat&&e.code==='KeyG')gallery();if(!e.repeat&&e.code==='KeyO')settings();if(e.code==='Escape'&&mi)closeMap()});
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
function hud(){$('hud').innerHTML=`🔑 ${S.keys.length}/3 &nbsp; 🌹 ${S.fl.length}/4 &nbsp; ⭐ ${S.stars.length}/5 &nbsp; 🎫 ${S.tk.length}/4<b id="mb" title="Map (M)">🗺</b><b id="jb" title="Missions (J)">📜</b><b id="rst" title="Reset progress">↺</b><div id="mq">${mline()}</div>`;$('mb').onclick=openMap;$('jb').onclick=openJournal;$('rst').onclick=()=>{if(confirm('Reset all progress?')){noSave=1;localStorage.removeItem(KEY);location.reload()}}}
function menu(){const it=[['YOUR FAVORITE','₱0',CFG.favDrink+'. Obviously.'],['MY FAVORITE','₱0',CFG.myFav+'.'],['OUR ORDER','₱0','Whatever we end up ordering.'],['ONE MORE CONVERSATION','₱∞','Always in stock.']];
pan('<h2>MENU</h2>'+it.map((r,i)=>`<div class="row" data-i="${i}">${r[0]}<i></i>${r[1]}</div>`).join('')+'<p id="mr">&nbsp;</p><button id="px">CLOSE</button>');
document.querySelectorAll('.row').forEach(e=>e.onclick=()=>{$('mr').textContent='"'+it[e.dataset.i][2]+'"';AU.chime()});$('px').onclick=unpan}
function booth(){pan('<h2>TAKE PHOTO?</h2><div><button id="y">YES</button> &nbsp; <button id="n">NO</button></div>');$('n').onclick=unpan;
$('y').onclick=async()=>{for(const t of['3...','2...','1...']){pan(`<h1>${t}</h1>`);AU.tone(520,.15,.05);await sleep(900)}pan('<h1>FLASH.</h1>');$('flash').classList.add('on');AU.tone(1500,.3,.06);await sleep(180);$('flash').classList.remove('on');await sleep(600);
pan('<canvas id="ph" width="180" height="230"></canvas><button id="k">KEEP</button>');photo();$('k').onclick=unpan}}
function photo(){const o=cx;cx=$('ph').getContext('2d');cx.fillStyle=C.cream;cx.fillRect(0,0,180,230);cx.fillStyle='#25243F';cx.fillRect(12,12,156,170);cx.fillStyle=C.gold;for(let i=0;i<14;i++)cx.fillRect(16+hf(i)*148,16+hf(i+9)*70,1.5,1.5);
cx.save();cx.translate(90,160);cx.scale(4,4);ch(-8,0,C.rose,C.lav,0,1);ch(8,0,C.ocean,'#2b2438',0,-1);cx.restore();cx.fillStyle=C.wood;cx.font='11px Georgia';cx.textAlign='center';cx.fillText('PHOTO 01 · NOT YET DEVELOPED',90,208);cx=o}
/* ================= AUDIO (procedural, no files needed) ================= */
const MIX={forest:[.03,.03,900],future:[0,0],cafe:[.04,.02,3500],city:[.04,.015,1500],beach:[.03,.07,600],garden:[.04,.01,1200],home:[.05,0,1200],pet:[.04,.01,1200],bedroom:[.012,0,1200],station:[.04,.02,900],lighthouse:[.03,.07,600],orchard:[.04,.03,1400],market:[.05,.02,2000],cinema:[.05,0,900],books:[.04,0,1200],arcade:[.05,.01,3000],noodle:[.05,.01,1500],roof:[.03,.03,900],treehouse:[.05,.02,1400],cave:[.03,.06,500]};
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
async function ending(){S.fin=1;mode='cine';nohud(1);AU.mix(0,0);await sleep(1600);await fade(1,2600);p.x=1200;p.y=1150;p.w=0;cam.x=1200;cam.y=1150;rb={a:{},t:[],p:0,tp:0};mode='void';await fade(0,1800);await sleep(5500);
mode='rebuild';const st=[['A house appears.',['home','bedroom']],['A garden appears.',['garden','pet']],['A road appears.',['city']],['A café appears.',['cafe']],['A beach appears.',['beach']],['The city appears.',['bld','forest']]];
for(let i=0;i<st.length;i++){rb.t.push(...st[i][1]);rb.tp=(i+1)/7;if(i==0)AU.tone(392,3,.03);await line(st[i][0],1900)}
await sleep(1500);AU.mix(.05,0,1200);await line('None of this exists.',2800);await line('Not yet.',2400);await line('But that\'s the point.',3400);gobtn('BUILD',buildFlow)}
function buildFlow(){hideGo();pan('<h2>What should we build next?</h2><input id="bi" maxlength="120" autocomplete="off"><button id="bs">ENTER</button>');setTimeout(()=>$('bi').focus(),100);
window.bsub=async()=>{window.bsub=0;const v=$('bi').value.trim()||'Something we haven\'t thought of yet.';S.build=v;S.done=1;try{localStorage.setItem('wwhly_build',JSON.stringify({answer:v,time:Math.floor(S.time),date:new Date().toISOString()}))}catch(e){}unpan();
await line('SAVING...',2000);rb.tp=1;await line('Then let\'s start there.',3200);await sleep(1500);await fade(1,2600);mode='end';AU.mix(0,0);$('fade').style.opacity=0;await sleep(1500);
await line('Thank you for exploring the world I imagined.',4200);await line('Now let\'s go make the real one.',3800);await line('♡',4200);results()};$('bs').onclick=bsub}
function results(){const q=['forest','cafe','city','beach','garden','home','pet','bedroom','station','lighthouse','orchard','market'].filter(n=>S.vis.includes(n)).length,pc=Math.min(100,Math.round((S.fl.length+S.keys.length+S.stars.length+S.tk.length+q)/28*100)),t=Math.floor(S.time),f=n=>String(n).padStart(2,'0');
pan(`<h2>WORLD COMPLETE</h2><p>${pc}% EXPLORED</p><p>TOTAL TIME:<br>${f(Math.floor(t/3600))}:${f(Math.floor(t/60)%60)}:${f(t%60)}</p>${S.wish?'<p>YOUR WISH:<br><i>'+esc(S.wish)+'</i></p>':''}${S.bottle?'<p>YOUR BOTTLE:<br><i>'+esc(S.bottle)+'</i></p>':''}<p>📌 ${SQ.filter(q=>q[1]()).length}/${SQ.length} SIDE QUESTS</p>${SQ.every(q=>q[1]())?'<p>✨ TRUE ENDING ✨<br><i>'+CFG.trueEnd+'</i></p>':''}<p>FINAL REWARD:<br>LOCKED</p><button id="cl">CLAIM REWARD</button>`);
$('cl').onclick=async()=>{if(SQ.every(q=>q[1]()))await trueScene();pan('<h1 style="letter-spacing:.14em">This reward cannot be delivered digitally.</h1>');await sleep(4200);pan('<h1 style="letter-spacing:.14em">Look beside you.</h1>');await sleep(4500);finalPhoto()}}
/* ================= PLAYER / UPDATE ================= */
function upd(dt){T+=dt;AU.tick(dt);if(mode!=='title'&&mode!=='end'&&!S.done)S.time+=dt;
for(const k in rb.a)rb.a[k]=Math.min(1,rb.a[k]+dt*.8);for(const k of rb.t)if(rb.a[k]==null)rb.a[k]=0;rb.p+=(rb.tp-rb.p)*dt*.5;
if(mode==='sky'){sky.t=Math.min(1,sky.t+dt/7);if(sky.win&&sky.t>.55&&!sky.say){sky.say=1;say('Imagine coming home after a long day and knowing there\'s someone waiting for you.')}}
if(mode!=='play')return;
pet.wt-=dt;if(pet.fol){pet.tx=p.x-16*p.dir;pet.ty=p.y+2}else if(pet.wt<=0){pet.tx=1540+Math.random()*500;pet.ty=1460+Math.random()*680;pet.wt=2+Math.random()*4}
const pdx=pet.tx-pet.x,pdy=pet.ty-pet.y,pd=Math.hypot(pdx,pdy);if(pd>3){const ps=pet.fol?Math.min(150,pd*3+20):34;pet.x+=pdx/pd*ps*dt;pet.y+=pdy/pd*ps*dt;pet.fl=pdx>0}
const z=zoneAt(p.x,p.y);if(z&&z[0]!==curZ){curZ=z[0];AU.mix(...MIX[curZ]);const l=$('loc');l.textContent=z[6];l.classList.add('on');setTimeout(()=>l.classList.remove('on'),2400);if(!S.vis.includes(curZ)){S.vis.push(curZ);save()}}
let ix=(K.KeyD||K.ArrowRight?1:0)-(K.KeyA||K.ArrowLeft?1:0)+jx,iy=(K.KeyS||K.ArrowDown?1:0)-(K.KeyW||K.ArrowUp?1:0)+jy;const m=Math.hypot(ix,iy);
if(sit&&m>.5&&!dOpen){sit=0;hideGo()}
if(!dOpen&&!pOpen&&!sit&&m>.12){if(m>1){ix/=m;iy/=m}const sp=CFG.speed*(curZ==='bedroom'?.75:1)*dt;if(!hit(p.x+ix*sp,p.y))p.x+=ix*sp;if(!hit(p.x,p.y+iy*sp))p.y+=iy*sp;if(Math.abs(ix)>.1)p.dir=ix>0?1:-1;p.w=1;p.st+=dt;if(p.st>.32){p.st=0;AU.step()}}else p.w=0;
const inn=p.x>1830&&p.x<1885&&p.y>1218&&p.y<1250;if(inn&&!wasIn&&!sit&&!dOpen){sit=1;p.w=0;say('Somewhere we\'d probably sit for hours without realizing how late it got.',()=>{if(sit)gobtn('LOOK UP',()=>toSky(0))})}wasIn=inn;
if(S.door&&p.y<-1330&&!dOpen){const n=need();if(!n.length)ending();else{say(['The timeline ends here. For now.','Still unwritten:\n'+n.join('\n')+'\n\nCome back when the world is ready.']);p.y=-1290}}
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
/* ================= EXPANSION: new zones, map, extras ================= */
document.head.appendChild(Object.assign(document.createElement('style'),{textContent:'#panel #mp{width:auto;height:auto;max-width:90vw;max-height:62vh;image-rendering:auto;margin-bottom:14px}#hud b#mb{opacity:.9;font-size:16px;margin-left:12px}body.touch #hud b{padding:6px 8px}'}));
Object.assign(DECO,{
station(x,y,w,h){cx.fillStyle='#2b2b3a';cx.fillRect(x,1680,w,50);cx.fillStyle='#6b6478';for(let i=0;i<w;i+=20)cx.fillRect(x+i,1690,8,30);cx.fillStyle='#9a92a8';cx.fillRect(x,1688,w,3);cx.fillRect(x,1718,w,3)},
lighthouse(x,y,w,h){cx.fillStyle='#344F63';cx.fillRect(x,1250,w,150);const a=T*.5,g=ZA('lighthouse');cx.globalAlpha=.13*g;cx.fillStyle=C.gold;cx.beginPath();cx.moveTo(2560,1010);for(const d of[-.2,.2])cx.lineTo(2560+Math.cos(a+d)*420,1010+Math.sin(a+d)*420);cx.fill();cx.globalAlpha=g;if(S.wish)glow(2560,990,50,.5)},
orchard(x,y,w,h){patch(x,y,w,h,'#3d5a45',90);cx.fillStyle=C.gold;for(let i=0;i<26;i++){cx.globalAlpha=(.4+.6*Math.sin(T*1.7+i*3))*ZA('orchard');cx.fillRect(x+hf(i+5)*w+Math.sin(T*.6+i)*8,y+hf(i+50)*h+Math.cos(T*.5+i)*8,2,2)}},
market(x,y,w,h){for(let i=0;i<=14;i++){cx.fillStyle=i%3?C.gold:C.rose;cx.globalAlpha=(.55+.45*Math.sin(T*3+i))*ZA('market');cx.beginPath();cx.arc(x+i*50,1440+(i%2)*14,3,0,7);cx.fill()}}});
const esc=s=>s.replace(/[&<>"]/g,c=>'&#'+c.charCodeAt(0)+';');
const look=t=>{sit=1;p.w=0;say(t,()=>{if(sit)gobtn('LOOK UP',()=>toSky(0))})};
function ask(h,ph,cb){pan(`<h2>${h}</h2><input id="bi" maxlength="100" autocomplete="off" placeholder="${ph}"><div><button id="bs">ENTER</button> &nbsp; <button id="bx">NOT YET</button></div>`);setTimeout(()=>$('bi').focus(),100);
window.bsub=()=>{const v=$('bi').value.trim();if(!v)return;window.bsub=0;unpan();cb(v)};$('bs').onclick=()=>window.bsub&&window.bsub();$('bx').onclick=()=>{window.bsub=0;unpan()}}
function lst(h,it){pan('<h2>'+h+'</h2>'+it.map((r,i)=>`<div class="row" data-i="${i}">${r[0]}<i></i>${r[1]}</div>`).join('')+'<p id="mr">&nbsp;</p><button id="px">CLOSE</button>');
document.querySelectorAll('.row').forEach(e=>e.onclick=()=>{$('mr').textContent='"'+it[e.dataset.i][2]+'"';AU.chime()});$('px').onclick=unpan}
function aPet(){if(S.hide){S.hide=0;S.hs=(S.hs||0)+1;pet.wt=0;return say(['Found you!',CFG.petName+' is extremely proud of himself.'],()=>toast('🐕 HIDE & SEEK WON: '+S.hs))}const f=pet.fol=!pet.fol,n=S.c.pet=(S.c.pet||0)+1;say(f?(n==1?pet.l.concat(CFG.petName+' will follow you now.\n(Press E on them again to make them stay.)'):CFG.petName+' is following you again.'):CFG.petName+' stays. Dramatically.')}
function aOwl(){const k=S.keys,h=!S.gate?'Hoo. Flowers first. Four of them, somewhere in the garden. The gate ignores everything else.':!k.includes(1)?'Hoo. One key is behind a tree in this forest. The tree glows if you look right.':!k.includes(2)?'Hoo. A jar of loose change in the café has something taped to it.':!k.includes(3)?'Hoo. Your last key is under the bed. But the bed keeps secrets from strangers: sit on the couch, hug the pillow, take your chair first.':S.door?'Hoo. It\'s open. Go north. Don\'t look back.':'...';say((S.c.owl=(S.c.owl||0)+1)==1?['It has watched you walk into that tree twice.',h]:h)}
function aMail(){const n=S.keys.length+S.fl.length+S.stars.length+S.tk.length,L=CFG.letters.filter((_,i)=>n>=[2,6,11,16][i]);say((SD?['✉️\n\n'+CFG.specialLetter]:[]).concat(L.length?L.map(t=>'✉️\n\n'+t):['Empty. Waiting for something worth delivering.','(Come back after you\'ve found a few things.)']))}
function aFount(){if(S.wish)return say('Your wish is still floating there.\n"'+S.wish+'"');if(!S.coin)return say(['Currently out of wishes.','Maybe there\'s some loose change around town.']);ask('MAKE A WISH','I wish…',v=>{S.wish=v;S.coin=0;AU.tone(1318,1.2,.05);say('The coin sinks.\nSomewhere, a lantern lights.',()=>toast('✨ WISH MADE'))})}
function aBottle(){if(S.bottle)return say('Gone. Somewhere out there it\'s floating toward us.');ask('WRITE A MESSAGE','Dear future us…',v=>{S.bottle=v;AU.tone(660,1.5,.04);say('You seal it and let the tide take it.',()=>toast('🍾 MESSAGE SENT'))})}
function aTicket(o){S.tk.push(o.tk);AU.chime();say(CFG.tickets[o.tk],()=>{toast('🎫 '+S.tk.length+'/4');hud()})}
function aLight(){look(['You climb every step.'+(S.wish?'\n\nA lantern is lit up here.\nIt says: "'+S.wish+'"':''),'Everything you can see is a place we haven\'t been yet.'])}
let mi=0;
function openMap(){if(mode!=='play'||pOpen||dOpen)return;pan('<h2>MAP</h2><canvas id="mp" width="560" height="490"></canvas><button id="px">CLOSE</button>');$('px').onclick=closeMap;mi=setInterval(mapDraw,60);mapDraw()}
function closeMap(){clearInterval(mi);mi=0;unpan()}
function mapDraw(){const c=$('mp');if(!c||!mi)return;const g=c.getContext('2d'),k=560/3100,X=x=>(x+300)*k,Y=y=>y*k;g.fillStyle='#0b0f1c';g.fillRect(0,0,560,490);g.font='10px Georgia';g.textAlign='center';g.textBaseline='middle';g.lineJoin='round';
const tx=(t,x,y,f)=>{g.lineWidth=3;g.strokeStyle='#101525';g.strokeText(t,x,y);g.fillStyle=f||C.cream;g.fillText(t,x,y)};
for(const z of Z){const v=S.vis.includes(z[0]),x=X(z[1]),zy=Math.max(0,z[2]),y=Y(zy),w=z[3]*k,h=(z[2]+z[4]-zy)*k;g.globalAlpha=v?.9:.55;g.fillStyle=v?z[5]:'#252a42';g.fillRect(x,y,w,h);g.globalAlpha=1;g.lineWidth=1;g.strokeStyle='rgba(231,201,139,.4)';g.strokeRect(x,y,w,h);tx(v?z[6]:'?',x+w/2,y+h/2)}
if(S.tmf.length>=3&&!S.tr)g.fillText('✖️',X(1500),Y(2450));if(S.vis.includes('city'))BLD.forEach(([bx,em])=>g.fillText(em,X(bx+45),Y(975)));const q=ins||p,px=X(q.x),py=Y(Math.max(0,q.y)),r=3.5+Math.sin(T*6);g.fillStyle=C.gold;g.beginPath();g.arc(px,py,r,0,7);g.fill();g.strokeStyle=C.gold;g.lineWidth=1.5;g.beginPath();g.arc(px,py,r+5+Math.sin(T*3)*2,0,7);g.stroke();
tx(ins?'INSIDE':'YOU ARE HERE',Math.max(45,Math.min(515,px)),Math.max(10,py-16),C.gold);g.font='9px serif';g.fillText('🐕',X(pet.x),Y(pet.y))}
let ins=null;
async function goIn(b){if(ins)return;mode='cine';await fade(1,450);ins={b,x:p.x,y:p.y};p.x=b*500+200;p.y=3240;p.dir=1;cam.x=p.x;cam.y=p.y;if(pet.fol){pet.x=p.x;pet.y=p.y}await sleep(150);mode='play';await fade(0,550)}
async function goOut(){if(!ins)return;mode='cine';await fade(1,450);p.x=ins.x;p.y=ins.y+16;ins=null;cam.x=p.x;cam.y=p.y;if(pet.fol){pet.x=p.x;pet.y=p.y}await sleep(150);mode='play';await fade(0,550)}
function arcadeGame(){pan('<h2>REACTION</h2><p id="ar">Wait for it…</p><button id="ab">…</button>');const b=$('ab');let st=0;
const to=setTimeout(()=>{if(!$('ar'))return;st=performance.now();$('ar').textContent='GO!';b.textContent='PRESS'},1200+Math.random()*2500);
b.onclick=()=>{if(!st){clearTimeout(to);$('ar').textContent='Too early. Very you.'}else{const ms=Math.round(performance.now()-st);AU.chime();$('ar').textContent=ms+' ms. '+(ms<320?'You win. The machine calls it a tie.':'The machine wins. It calls it a tie.')}b.textContent='CLOSE';b.onclick=unpan}}
Object.assign(DECO,{
cinema(x,y,w,h){const a=ZA('cinema');cx.fillStyle=Math.sin(T*2)>0?C.lav:C.rose;cx.globalAlpha=.9*a;cx.fillRect(x+60,y+14,280,64);cx.globalAlpha=a;glow(x+200,y+140,120,.12,'246,235,221')},
books(x,y,w,h){cx.fillStyle='rgba(184,111,124,.3)';cx.beginPath();cx.ellipse(x+200,y+170,110,50,0,0,7);cx.fill()},
arcade(x,y,w,h){for(let i=0;i<8;i++){cx.fillStyle=i%2?'#2d3560':'#3d2f5c';cx.fillRect(x+i*50,y+150,50,150)}glow(x+110,y+60,90,.25+.08*Math.sin(T*4),'120,150,255')},
noodle(x,y,w,h){cx.fillStyle='rgba(246,235,221,.25)';for(let i=0;i<5;i++)cx.fillRect(x+170+i*14+Math.sin(T*2+i)*3,y+40-((T*20+i*9)%30),2,6)}});
const need=()=>[[4-S.fl.length,'🌹 flower'],[5-S.stars.length,'⭐ star'],[4-S.tk.length,'🎫 ticket']].filter(a=>a[0]>0).map(a=>a[0]+' '+a[1]+(a[0]>1?'s':'')).concat(S.wish?[]:['🪙 a wish at the fountain'],S.bottle?[]:['🍾 a message in a bottle'],S.cook?[]:['🍳 a dinner you tried to cook']);
Object.assign(DECO,{future(x,y,w,h){const g=cx.createLinearGradient(0,y,0,y+h);g.addColorStop(0,'#6b5b83');g.addColorStop(.5,'#D99A86');g.addColorStop(1,C.cream);cx.fillStyle=g;cx.fillRect(x,y,w,h);
cx.strokeStyle='rgba(16,21,37,.25)';cx.lineWidth=2;cx.setLineDash([6,8]);cx.beginPath();cx.moveTo(1200,400);cx.lineTo(1200,-1300);cx.stroke();cx.setLineDash([]);
cx.fillStyle='rgba(16,21,37,.4)';cx.font='16px Georgia';cx.textAlign='center';cx.textBaseline='middle';for(const r of YR)cx.fillText('YEAR '+r[1],1200,r[0]+34);
rr(1165,-1490,70,44,4,'#22304a');cx.fillStyle=Math.sin(T*3)>0?C.lav:C.rose;cx.fillRect(1172,-1484,56,32);glow(1200,-1440,90,.25,'246,235,221');rr(1150,-1400,100,24,4,C.rose);ch(1178,-1392,C.rose,'#d8d6e0',0,1,1);ch(1222,-1392,C.ocean,'#d8d6e0',0,-1,1);cx.font='16px serif';cx.globalAlpha=.7*ZA('future');cx.fillText(S.sv.map(z=>ZS[z][0]).join(' '),1200,-1340);if(S.mug)cx.fillText('☕ "'+S.mug+'"',1200,-1318)}});
function cookGame(){if(!S.c.cook){S.c.cook=1;return say(['I have absolutely no idea what I\'m doing.','Send help. Or takeout.','...Try anyway?'],cookGame)}
if(S.cook)return say(['The stove is fine now. Suspiciously.','You order takeout anyway.']);
let r=0,h=0,x=0,d=1,z=0,iv=0;const W=.2,Q=s=>$('ck').textContent=s,Zn=()=>{z=.1+Math.random()*.6;$('cz').style.cssText=`left:${z*100}%;width:${W*100}%`};
pan('<h2>COOKING</h2><p id="ck"></p><div id="cb" style="position:relative;width:min(340px,80vw);height:18px;border:1px solid var(--gold);margin:14px 0 22px"><i id="cz" style="position:absolute;top:0;height:100%;background:rgba(127,150,123,.7)"></i><i id="cm" style="position:absolute;top:-4px;width:4px;height:26px;background:var(--gold)"></i></div><button id="cs">STIR</button>');
Zn();Q('Round 1/5. Stir when the marker is in the green.');
iv=setInterval(()=>{const m=$('cm');if(!m||!iv)return;x+=d*.022*(1+r*.25);if(x>1||x<0){d=-d;x=Math.max(0,Math.min(1,x))}m.style.left=`calc(${x*100}% - 2px)`},30);
$('cs').onclick=()=>{if(r>=5){unpan();return say(['Dinner tonight: takeout.','Again.'],()=>toast('🍳 MEAL "COOKED"'))}
const ok=x>z&&x<z+W;ok?(h++,AU.chime()):AU.tone(150,.25,.05,'sawtooth');r++;
if(r<5){Zn();Q('Round '+(r+1)+'/5. '+(ok?'Nice.':'Smoke.'))}else{clearInterval(iv);iv=0;S.cook=1;Q(h>=4?'Actually edible. You order takeout anyway.':h>=2?'Some smoke. Some flavour. You order takeout.':'It\'s on fire. You order takeout. Quickly.');$('cs').textContent='CLOSE'}}}
AU.sb=0;AU.th=0;
AU.song=function(){if(!this.c||mode!=='play'||(this.f.music&&this.f.music.ok))return;const lv=S.fl.length+S.keys.length+S.stars.length+S.tk.length;if(!lv)return;
const th=[1,4,8,12,16].filter(q=>lv>=q).length;if(th>this.th){this.th=th;setTimeout(()=>toast('🎵 THE SONG GROWS'),2400)}
const b=this.sb++,r=[0,-2,-4,-2][(b>>3)&3],v=curZ==='bedroom'?.5:1,n=m=>220*Math.pow(2,(r+m)/12);
this.tone(n([0,4,7,9,7,4,2,-3][b&7]),1.1,.016*v,'triangle');
if(lv>=4&&!(b&1))this.tone(n(-12),2,.03*v);
if(lv>=8&&b%4==2)this.tone(n([12,16,19,21][(b>>2)&3]),1.6,.012*v);
if(lv>=12)this.tone(n([7,9,11,14,12,9,7,4][b&7]),1,.008*v);
if(lv>=16&&(b&7)==0)[0,4,7].forEach(m=>this.tone(n(m-12),4,.012*v))};
setInterval(()=>AU.song(),1200);
/* ================= MISSIONS (completed in order) ================= */
document.head.appendChild(Object.assign(document.createElement('style'),{textContent:'#hud #mq{margin-top:6px;font-size:11px;letter-spacing:.06em;color:var(--cream);opacity:.8;max-width:min(70vw,420px);line-height:1.4}#mt{position:fixed;z-index:37;top:14px;right:16px;max-width:min(60vw,340px);text-align:right;white-space:pre-line;font-size:12px;letter-spacing:.1em;line-height:1.6;color:var(--gold);background:rgba(16,21,37,.85);border:1px solid rgba(231,201,139,.5);padding:10px 14px;border-radius:8px;opacity:0;pointer-events:none;transition:opacity .6s}#mt.on{opacity:1}body.nohud #mt{display:none}'}));
const mtEl=document.body.appendChild(Object.assign(document.createElement('div'),{id:'mt'}));let mtt=0;
const MS=[
['Step into the café',()=>S.vis.includes('cafe'),'It\'s the warm light west of the city.'],
['Find the key hiding in the café',()=>S.keys.includes(2),'Something small is taped to the bottom of a jar.'],
['Go home. Check where you sleep.',()=>S.keys.includes(3),'Sit on the couch, the pillow and your chair first. Then the bed.'],
['Pick the four flowers in the garden',()=>S.gate,'Four roses, scattered around the garden.'],
['Find the key behind the glowing tree',()=>S.keys.includes(1),'The forest is north of the city. Follow the glow.'],
['Reach the edges of the map. Find 4 tickets',()=>S.tk.length>=4,'West, east, south, southeast: a station, a lighthouse, an orchard, a market.'],
['Make a wish at the fountain',()=>!!S.wish,'You need a coin. The café jar held more than a key.'],
['Send a message in a bottle',()=>!!S.bottle,'Somewhere by the sea.'],
['Look up. Find all five stars',()=>S.stars.length>=5,'A bedroom window, a quiet seat on the beach, the lighthouse, the wheel, the tent. Then tap each star.'],
['Try to cook dinner',()=>!!S.cook,'The stove at home. Bring low expectations.'],
['Walk the timeline to the end',()=>!!S.fin,'North, through the forest door. All the way.']];
function mline(){return (S.ms<MS.length?'◇ '+(S.ms+1)+'/'+MS.length+'  '+MS[S.ms][0]:'✔ ALL MISSIONS COMPLETE')+'  ·  📌 '+SQ.filter(q=>q[1]()).length+'/'+SQ.length}
function msCheck(){if(mode!=='play')return;let n=0;while(S.ms<MS.length&&MS[S.ms][1]()){S.ms++;n++}if(!n)return;hud();
mtEl.textContent=(n>1?'✔ '+n+' MISSIONS COMPLETE':'✔ MISSION COMPLETE\n'+MS[S.ms-1][0])+(S.ms<MS.length?'\n\n◇ NEW: '+MS[S.ms][0]:'\n\nAll missions complete.');mtEl.classList.add('on');clearTimeout(mtt);mtt=setTimeout(()=>mtEl.classList.remove('on'),5000);AU.tone(1046,.6,.04);if(n>1)setTimeout(()=>{if(!dOpen&&!pOpen&&mode==='play')say(['Interesting. You did those in your own order.','That\'s allowed. This is your world.'])},1800)}
function openJournal(){if(mode!=='play'||pOpen||dOpen)return;lst('MISSIONS',MS.map((m,i)=>[i<S.ms?'✔ '+m[0]:i==S.ms?'◇ '+m[0]:'🔒 ???',i==S.ms?'NOW':'',i<=S.ms?m[2]:'Not yet.']).concat([['📌 SIDE QUESTS '+SQ.filter(q=>q[1]()).length+'/'+SQ.length,'','Optional. Tap to open the list.'],['🎁 Souvenirs '+S.sv.length+'/'+Object.keys(ZS).length,'',S.sv.map(z=>ZS[z][0]).join(' ')||'None yet.'],['👥 Possible futures '+S.gh.length+'/'+G.length,'','Faint figures around the map. Walk into them.'],['🏅 '+S.ach.length+'/'+ACH.length+' achievements','',S.ach.join(' · ')||'None yet.'],['🔑 RESUME CODE','','Tap to see your code.']]));const rs=document.querySelectorAll('.row');rs[rs.length-1].onclick=showCode;rs[MS.length].onclick=()=>{unpan();openSide()}}
setInterval(msCheck,500);
/* ================= EXPANSION 2: NPCs, ghosts, weather, secrets, keepsakes ================= */
Object.assign(S,{tmf:[],gh:[],sv:[],ach:[],rq:[],mel:[],fish:0});
Object.assign(CFG,{specialDate:'',specialLetter:'Happy today. I planned a whole world for it.',
clues:['Digit 1 of 3: THREE.','Digit 2 of 3: ONE.','Digit 3 of 3: FOUR.\n(Somebody really likes pi.)'],
postcards:[['A CITY WE\'VE NEVER SEEN','₱0','Wish you were here. Actually, you are. Even better.'],['A BEACH WITH NO SIGNAL','₱0','Having a great time. Nobody can reach us.'],['SOMEWHERE COLD','₱0','Share the blanket. That\'s the whole plan.']],
fortunes:['You will be asked "what do you want for dinner?" seven times today.','Beware the person who steals your fries. They love you.','A nap is in your future. Do not resist it.','Someone is thinking about you. Suspiciously often.'],
catches:['🐟 A fish. A regular one.','🥾 A boot. Just the one.','📜 A soggy note: "You\'re doing great."','🦀 A crab who wants a word.','🔑 An old key. It opens nothing. Yet.'],
quests:['Send me a voice note of what you\'re eating.','Text me a photo of the sky right now.','Tell me one thing you\'re looking forward to.'],
treasure:'A tin box. Inside: a folded note and a tiny key.\n"For something we haven\'t planned yet."'});
MS.splice(10,0,['Do one thing outside the game',()=>S.rq.some(Boolean),'Find the quest board in the city. Then do one for real.']);
const _d=new Date(),SD=!!CFG.specialDate&&CFG.specialDate===String(_d.getMonth()+1).padStart(2,'0')+'-'+String(_d.getDate()).padStart(2,'0');
const mn=()=>S.ms<MS.length?'\n(They\'ve noticed you\'re busy: "'+MS[S.ms][0]+'".)':'';
const frag=k=>{if(!S.tmf.includes(k)){S.tmf.push(k);toast('🗺️ MAP FRAGMENT '+S.tmf.length+'/3')}};
const NPC={chef:()=>['"Two bowls again?"','He already knows.'+mn()],
keeper:()=>{frag('kp');return S.bottle?['A bottle washed up this morning.','It says: "'+S.bottle+'"','I put it back. It wasn\'t mine to keep.']:['Ships used to pass here.','Bring me a message in a bottle sometime.'+mn()]},
master:()=>{frag('st');setTimeout(()=>lst('POSTCARDS',CFG.postcards),0);return ['Postcards. Free for you.'+mn()]},
fort:()=>{frag('ft');return ['🔮 '+CFG.fortunes[(S.c.fort=(S.c.fort||0)+1)%CFG.fortunes.length],'The stars also say: '+(S.ms<MS.length?MS[S.ms][0].toLowerCase()+'.':'nothing left to say.')]}};
const ZS={cafe:['☕','a sugar packet'],city:['🚌','a bus token'],forest:['🍂','a leaf'],garden:['🌸','a pressed petal'],beach:['🐚','a shell'],pet:['🦴','a chewed toy'],station:['🎟️','a ticket stub'],lighthouse:['🧭','a tiny compass'],orchard:['🍎','an apple'],market:['🏮','a paper lantern'],noodle:['🥢','chopsticks'],cinema:['🎬','a film strip'],arcade:['🪙','a token'],books:['🔖','a bookmark'],roof:['🌇','a sunset']};
const G=[['cafe',600,1180,['Two chairs pulled close. Two cups.','A slow dance, nobody counting the steps.']],['beach',1750,1100,['Shoes in the sand.','You\'re both pretending not to race the tide.']],['market',2400,1950,['Two people arguing over the last dumpling.','Nobody wins. Nobody minds.']],['station',-30,1780,['Two suitcases, one of them overpacked.','A hand held a little too tightly at the platform edge.']],['orchard',1300,2620,['A blanket. Half an apple.','Somebody says "five more minutes." Twice.']]];
for(const z of new Set(G.map(g=>g[0]))){const o=DECO[z];DECO[z]=function(...a){o.apply(this,a);G.forEach((g,i)=>{if(g[0]!==z)return;cx.globalAlpha=(S.gh.includes(i)?.1:.28+.1*Math.sin(T*2))*ZA(z);ch(g[1],g[2],C.rose,C.lav,0,1);ch(g[1]+18,g[2],C.ocean,'#2b2438',0,-1);cx.globalAlpha=ZA(z)})}}
Object.assign(DECO,{roof(x,y,w,h){const g=cx.createLinearGradient(0,y,0,y+h);g.addColorStop(0,'#3b2f5c');g.addColorStop(.55,'#c9707a');g.addColorStop(1,'#e7c98b');cx.fillStyle=g;cx.fillRect(x,y,w,h);cx.fillStyle='#f6ebdd';cx.beginPath();cx.arc(x+200,y+95,26,0,7);cx.fill()}});
const ACH=[['Biscuit\'s human',()=>(S.c.pet||0)>=6],['Owl whisperer',()=>(S.c.owl||0)>=4],['Ordered takeout again',()=>!!S.cook],['Saw every possible future',()=>S.gh.length>=G.length],['Souvenir hoarder',()=>S.sv.length>=10],['Composer',()=>S.mel.length>=8],['Reeled in something',()=>S.fish>=3],['Found the secret room',()=>!!S.sr],['Treasure hunter',()=>!!S.tr],['Did it in real life',()=>S.rq.some(Boolean)]];
const RN={t:150,on:0,rb:0};let tk=0;
function rainFx(w,h){if(mode!=='play')return;const al=S.alt||0;lifeFx(w,h);
if(al==1){cx.fillStyle='rgba(10,15,70,.4)';cx.fillRect(0,0,w,h);cx.fillStyle='#f6ebdd';for(let i=0;i<40;i++)cx.fillRect(hf(i*3)*w,hf(i*5+1)*h*.6,1.5,1.5)}
if(al==3){cx.fillStyle='rgba(120,80,40,.28)';cx.fillRect(0,0,w,h);cx.fillStyle='rgba(0,0,0,.08)';for(let y=0;y<h;y+=4)cx.fillRect(0,y,w,1)}const out=!['home','bedroom','cafe','future','cinema','books','arcade','noodle','roof','treehouse','cave'].includes(curZ);
if(out&&(RN.on>0||al==2)){cx.strokeStyle='rgba(180,200,235,.4)';cx.lineWidth=1;cx.beginPath();for(let i=0;i<70;i++){const x=(hf(i*3)*w+T*40)%w,y=(hf(i*7+1)*h+T*420)%h;cx.moveTo(x,y);cx.lineTo(x-3,y+12)}cx.stroke()}
if(out&&RN.rb>0){['#B86F7C','#E7C98B','#7F967B','#587A8C','#806452'].forEach((c,i)=>{cx.strokeStyle=c;cx.globalAlpha=.35*Math.min(1,RN.rb/3);cx.lineWidth=6;cx.beginPath();cx.arc(w/2,h*.75,h*.5-i*7,Math.PI,0);cx.stroke()});cx.globalAlpha=1}
if(SD){for(let i=0;i<14;i++){cx.fillStyle='rgba(231,201,139,.55)';cx.beginPath();cx.arc((hf(i*5)*w+Math.sin(T+i)*20)%w,h-((T*18+hf(i)*h)%h),4,0,7);cx.fill()}}}
setInterval(()=>{tk++;if(mode!=='play')return;
if((RN.t-=.25)<0&&!SET.noWx){RN.t=200+Math.random()*100;RN.on=40;toast('🌧 RAIN\nEveryone runs for the café.')}
if(RN.on>0){if((RN.on-=.25)<=0){RN.rb=14;toast('🌈 THE RAIN STOPPED')}}else if(RN.rb>0)RN.rb-=.25;
for(const z of S.vis)if(ZS[z]&&!S.sv.includes(z)){S.sv.push(z);toast('🎁 SOUVENIR\n'+ZS[z][0]+' '+ZS[z][1])}
if(!dOpen&&!pOpen)G.forEach((g,i)=>{if(!S.gh.includes(i)&&curZ===g[0]&&Math.hypot(p.x-g[1],p.y-g[2])<34){S.gh.push(i);say(g[3],()=>toast('👥 POSSIBLE FUTURE '+S.gh.length+'/'+G.length))}});
if(tk%4==0)ACH.forEach(a=>{if(!S.ach.includes(a[0])&&a[1]()){S.ach.push(a[0]);toast('🏅 '+a[0])}});
if(pet.fol&&tk%8==0){const o=OB.find(o=>(o.f!=null||o.tk!=null)&&vis(o)&&!o.bk&&Math.hypot(o.x-p.x,o.y-p.y)<160);if(o){o.bk=1;toast('🐕 '+CFG.petName+' found something nearby!')}}
if(curZ==='future'&&S.mel.length&&tk%24==0)S.mel.forEach((f,i)=>setTimeout(()=>AU.tone(f,1,.04,'triangle'),i*450))},250);
function questBoard(){const R=()=>{pan('<h2>SIDE QUESTS</h2>'+CFG.quests.map((q,i)=>`<div class="row" data-i="${i}">${S.rq[i]?'✔ ':'◇ '}${q}<i></i></div>`).join('')+'<p id="mr">Tap one once you\'ve done it in real life.</p><button id="px">CLOSE</button>');document.querySelectorAll('.row').forEach(e=>e.onclick=()=>{S.rq[e.dataset.i]=!S.rq[e.dataset.i];AU.chime();R()});$('px').onclick=unpan};R()}
function piano(){const F=[262,294,330,392,440,524,588,660],N=['C','D','E','G','A','C','D','E'];pan('<h2>PIANO</h2><div>'+F.map((f,i)=>`<button class="pk" data-f="${f}" style="padding:22px 10px;letter-spacing:0">${N[i]}</button>`).join('')+'</div><p id="pm">Play a melody. The last 8 notes are kept.</p><button id="px">DONE</button>');
document.querySelectorAll('.pk').forEach(b=>b.onclick=()=>{const f=+b.dataset.f;AU.tone(f,.9,.06,'triangle');S.mel.push(f);S.mel=S.mel.slice(-8);$('pm').textContent='♪ '+S.mel.length+'/8'});$('px').onclick=unpan}
function fishing(){pan('<h2>FISHING</h2><p id="fs">Waiting…</p><button id="fb">…</button>');const b=$('fb');let st=0;const to=setTimeout(()=>{if(!$('fs'))return;st=performance.now();$('fs').textContent='BITE!';b.textContent='REEL'},1500+Math.random()*3000);
b.onclick=()=>{clearTimeout(to);const ms=st?performance.now()-st:9e9;S.fish++;AU.chime();$('fs').textContent=ms<800?CFG.catches[Math.floor(Math.random()*CFG.catches.length)]:st?'It got away.':'Too early. The fish saw you.';b.textContent='CLOSE';b.onclick=unpan}}
const SV=['ms','tk','coin','wish','bottle','fl','keys','gate','door','stars','cook','c','vis','tmf','gh','sv','ach','rq','mel','fish','sr','tr','cap'];
function showCode(){const o={};SV.forEach(k=>o[k]=S[k]);const c=btoa(unescape(encodeURIComponent(JSON.stringify(o))));unpan();pan('<h2>RESUME CODE</h2><input id="rc" readonly value="'+c+'"><p>Copy this. Paste it under RESUME on the title screen.</p><div><button id="cc">COPY</button> &nbsp; <button id="px">CLOSE</button></div>');$('cc').onclick=()=>{$('rc').select();try{navigator.clipboard.writeText(c)}catch(e){}toast('Copied.')};$('px').onclick=unpan}
{const b=document.createElement('button');b.textContent='RESUME';b.style.cssText='position:fixed;z-index:31;left:50%;bottom:4vh;transform:translateX(-50%);padding:8px 22px;font-size:12px';
b.onclick=()=>ask('PASTE YOUR CODE','code…',v=>{try{const o=JSON.parse(decodeURIComponent(escape(atob(v))));SV.forEach(k=>{if(k in o)S[k]=o[k]});hud();toast('Progress restored.\nPress START.')}catch(e){toast('That code doesn\'t work.')}});
document.body.appendChild(b);$('start').addEventListener('click',()=>b.remove())}
/* ================= SIDE QUESTS (optional) ================= */
const SQ=[
['Meet the locals',()=>S.tmf.length>=3,'Talk to the station master (west), the lighthouse keeper (east) and the market fortune-teller (southeast).',()=>S.tmf.length+'/3'],
['Follow the pinned notes',()=>!!S.sr,'Three notes are pinned around the map: station, market, orchard. Enter the 3-digit code on the loose book in the bookshop.'],
['Dig up the treasure',()=>!!S.tr,'Meet the locals first, then follow the ✖️ on your map to the orchard. Press E on Biscuit so he follows you there.'],
['Make some music',()=>S.mel.length>=8,'Play the piano in the café until it keeps 8 notes.',()=>S.mel.length+'/8'],
['Catch something',()=>S.fish>=3,'Fish at the beach three times.',()=>S.fish+'/3'],
['Meet your possible futures',()=>S.gh.length>=5,'Walk into the faint figures: café, beach, market, station, orchard.',()=>S.gh.length+'/5'],
['Collect 10 souvenirs',()=>S.sv.length>=10,'Every new place gives a keepsake. Visit them all.',()=>S.sv.length+'/10'],
['Bury a time capsule',()=>!!S.cap,'The box in the garden, bottom-left. Dig it up at Year 25 in the Future hall.']];
function openSide(){if(mode!=='play'||pOpen||dOpen)return;lst('SIDE QUESTS',SQ.map(q=>[(q[1]()?'✔ ':'◇ ')+q[0],q[1]()?'DONE':q[3]?q[3]():'',q[2]]))}
const sqd=new Set();let sqi=0;
setInterval(()=>{if(mode!=='play')return;SQ.forEach((q,i)=>{if(!sqd.has(i)&&q[1]()){sqd.add(i);if(sqi){toast('📌 SIDE QUEST DONE\n'+q[0]);AU.tone(1174,.6,.04)}hud()}});sqi=1},1000);
/* ================= EXPANSION 3: hidden places, mirror, pottery, hide-and-seek ================= */
Object.assign(ZS,{treehouse:['🪵','a wooden plank'],cave:['💎','a glowing pebble']});
Object.assign(DECO,{treehouse(x,y,w,h){cx.fillStyle=C.gold;for(let i=0;i<9;i++){cx.globalAlpha=(.5+.5*Math.sin(T*2+i))*ZA('treehouse');cx.fillRect(x+30+i*42,y+16+(i%2)*8,3,3)}},
cave(x,y,w,h){glow(x+100,y+80,60,.25,'120,200,255');glow(x+300,y+90,60,.25,'200,120,255')}});
SQ.push(['Find the hidden places',()=>['treehouse','cave','roof'].every(z=>S.vis.includes(z)),'A rope ladder in the forest, a dark hole by the lighthouse, and the rooftop behind the bookshop.'],
['Win hide-and-seek',()=>(S.hs||0)>=1,'The bone at the entrance of Biscuit\'s area. He runs off to hide. Press E on him when you find him.'],
['Make a mug',()=>!!S.mug,'The pottery wheel at the night market.']);
ACH.push(['Mug maker',()=>!!S.mug],['Hide-and-seek champion',()=>(S.hs||0)>=3],['Through the looking glass',()=>(S.mir||0)>=3]);
SV.push('mug','hs','alt','mir');
/* ================= EXPANSION 4: more side quests ================= */
Object.assign(S,{lf:[],lr:[],gv:{},sp:[],dr:0,pb:0,boat:0});
SV.push('kite','boat','fest','pb','lf','lr','gv','sp','dr','lp','fit');
Object.assign(CFG,{trueEnd:'You did all of it. Every corner, every side quest.<br>Some worlds are worth finishing.'});
Object.assign(ZS,{dream:['🌙','a dream you kept']});
const SET={},PHS=[],OUT=[['Rose',C.rose,C.lav],['Ocean',C.ocean,'#2b2438'],['Sage',C.sage,'#5a3a2e'],['Gold',C.gold,'#403A5C']];
const LF={chef:{item:'the chef\'s ladle',lost:'I lost my ladle somewhere near the picnic.',thanks:'My ladle! You\'re a lifesaver.',gift:'a bowl of soup 🍲'},keeper:{item:'the keeper\'s glasses',lost:'I lost my glasses somewhere on the beach.',thanks:'My glasses! Now I can see the sea again.',gift:'a shiny shell 🐚'},master:{item:'the station master\'s whistle',lost:'My whistle vanished somewhere in the forest.',thanks:'My whistle! The trains can leave on time again.',gift:'a golden ticket 🎫'}};
const PHR={chef:[0,4,7],keeper:[7,9,12],master:[12,9,7],fort:[4,2,0]};
['chef','keeper','master','fort'].forEach(k=>{const f=NPC[k];NPC[k]=()=>{if(!S.sp.includes(k)){S.sp.push(k);setTimeout(()=>toast('🎼 PHRASE LEARNED '+S.sp.length+'/4'),1500)}const it=LF[k];if(it&&S.lf.includes(k)&&!S.lr.includes(k)){S.lr.push(k);return[it.thanks,'They give you '+it.gift+'.']}return(it&&!S.lf.includes(k)?[it.lost]:[]).concat(f())}});
setInterval(()=>{if(mode==='play'&&curZ==='future')S.sp.forEach((k,j)=>PHR[k].forEach((n,i)=>setTimeout(()=>AU.tone(220*Math.pow(2,n/12),1.2,.03,'triangle'),j*1400+i*350)))},14000);
function giftMenu(k){pan('<h2>GIVE A SOUVENIR?</h2>'+S.sv.map(z=>`<div class="row" data-z="${z}">${ZS[z][0]} ${ZS[z][1]}<i></i></div>`).join('')+'<button id="px">NOT NOW</button>');document.querySelectorAll('.row').forEach(e=>e.onclick=()=>{S.gv[k]=e.dataset.z;unpan();say(['They turn it over in their hands.','"Oh. I\'ll keep this forever."'],()=>toast('🎁 GIFT GIVEN'))});$('px').onclick=unpan}
function kite(){pan('<h2>KITE</h2><p id="kt">Keep it in the green for 8 seconds. Tap LIFT!</p><div style="position:relative;width:34px;height:220px;border:1px solid var(--gold);margin:10px"><i style="position:absolute;left:0;right:0;top:70px;height:70px;background:rgba(127,150,123,.6)"></i><i id="kk" style="position:absolute;left:8px;width:18px;height:14px;background:var(--gold)"></i></div><div><button id="kl">LIFT</button> &nbsp; <button id="kx">GIVE UP</button></div>');
let y=100,v=0,ok=0;const iv=setInterval(()=>{const e=$('kk');if(!e)return clearInterval(iv);v+=.5;y=Math.max(0,Math.min(206,y+v));if(y>=206)v=0;e.style.top=y+'px';ok=y>70&&y<126?ok+.05:Math.max(0,ok-.03);$('kt').textContent='Hold it in the green… '+Math.floor(ok)+'/8';
if(ok>=8){clearInterval(iv);S.kite=1;$('kt').textContent='It soars. You did it.';$('kl').textContent='CLOSE';$('kl').onclick=unpan;AU.chime()}},50);$('kl').onclick=()=>{v=-5.5};$('kx').onclick=()=>{clearInterval(iv);unpan()}}
function boats(){pan('<h2>PAPER BOAT RACE</h2><p id="bt">Pick your boat.</p><div>'+['⛵','🛶','🚤'].map((b,i)=>`<button class="bb" data-i="${i}" style="font-size:28px">${b}</button>`).join(' ')+'</div><p><button id="px">CLOSE</button></p>');
document.querySelectorAll('.bb').forEach(b=>b.onclick=()=>{const w=Math.floor(Math.random()*3);AU.chime();$('bt').textContent=w==+b.dataset.i?'Yours wins! By a nose.':'Boat '+(w+1)+' wins. Yours took the scenic route.';if(w==+b.dataset.i)S.boat++});$('px').onclick=unpan}
function fest(){if(!S.wish||!S.bottle)return say('Lanterns are sold out until you\'ve made a wish at the fountain and sent a bottle message.');S.fest=1;look(['The lanterns rise together.','"'+S.wish+'"','"'+S.bottle+'"','For a moment, the whole sky is listening.'])}
async function dream(){mode='cine';await fade(1,900);const D=['A staircase made of stars. You climb without getting tired.','A floating kitchen. Nothing burns. Everything smells like toast.','A train through the sea. The conductor is Biscuit.','A house with too many doors. Every one opens on us.'],c=$('cine');c.textContent=D[S.dr%D.length];c.classList.add('on');await sleep(3800);c.classList.remove('on');S.dr++;await sleep(700);await fade(0,900);mode='play';toast('🌙 DREAM '+S.dr+'/3');if(S.dr==3&&!S.sv.includes('dream'))S.sv.push('dream')}
function lpuz(){if(S.lp)return say('The beam sweeps in a perfect pattern now.');const m=[0,0,0],A=['↑','→','↓','←'],K=[1,2,3];pan('<h2>LIGHTHOUSE MIRRORS</h2><p id="lm">Rotate the mirrors so the beam reaches the coast. Each one turns a bit more than the last.</p><div>'+m.map((_,i)=>`<button class="lb" data-i="${i}" style="font-size:26px">↑</button>`).join(' ')+'</div><p><button id="lc">CHECK</button> &nbsp; <button id="px">CLOSE</button></p>');
document.querySelectorAll('.lb').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;m[i]=(m[i]+1)%4;b.textContent=A[m[i]]});
$('lc').onclick=()=>{const n=m.filter((v,i)=>v==K[i]).length;if(n==3){S.lp=1;AU.chime();$('lm').textContent='The beam lands. Far away, something lights up.'}else $('lm').textContent=n+' of 3 mirrors aligned.'};$('px').onclick=unpan}
function wardrobe(){pan('<h2>WARDROBE</h2>'+OUT.map((o,i)=>`<div class="row" data-i="${i}">${(S.fit||0)==i?'◇ ':''}${o[0]}<i></i></div>`).join('')+'<button id="px">CLOSE</button>');document.querySelectorAll('.row').forEach(e=>e.onclick=()=>{S.fit=+e.dataset.i;unpan();say('Looking good.')});$('px').onclick=unpan}
function snap(){if(mode!=='play'||pOpen||dOpen)return;const c=$('c'),t=document.createElement('canvas');t.width=240;t.height=Math.round(240*c.height/c.width)||150;t.getContext('2d').drawImage(c,0,0,t.width,t.height);PHS.push(t.toDataURL('image/jpeg',.7));if(PHS.length>9)PHS.shift();
const b=pet.fol&&Math.hypot(pet.x-p.x,pet.y-p.y)<120;if(b)S.pb++;const f=$('flash');f.classList.add('on');setTimeout(()=>f.classList.remove('on'),150);AU.tone(1500,.05,.05);toast('📷 '+PHS.length+(b?' · with '+CFG.petName:''))}
function gallery(){if(mode!=='play'||pOpen||dOpen)return;pan('<h2>GALLERY</h2>'+(PHS.length?'<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;max-width:min(760px,92vw)">'+PHS.map(u=>`<img src="${u}" style="width:180px;box-shadow:0 0 20px rgba(231,201,139,.2)">`).join('')+'</div>':'<p>No photos yet. Press P anywhere.</p>')+'<p><button id="px">CLOSE</button></p>');$('px').onclick=unpan}
function settings(){if(mode!=='play'||pOpen||dOpen)return;const R=()=>{pan('<h2>SETTINGS</h2>'+[['Sound',!SET.mute],['Weather effects',!SET.noWx],['Big text',!!SET.big]].map((r,i)=>`<div class="row" data-i="${i}">${r[0]}<i></i>${r[1]?'ON':'OFF'}</div>`).join('')+'<button id="px">CLOSE</button>');
document.querySelectorAll('.row').forEach(e=>e.onclick=()=>{const i=+e.dataset.i;if(i==0){SET.mute=!SET.mute;try{SET.mute?AU.c.suspend():AU.c.resume()}catch(x){}}if(i==1){SET.noWx=!SET.noWx;RN.on=RN.rb=0}if(i==2){SET.big=!SET.big;$('dlg').style.fontSize=SET.big?'21px':''}R()});$('px').onclick=unpan};R()}
function lifeFx(w,h){if(SET.noWx)return;const O=['garden','forest','orchard','pet','city','beach','market','station','lighthouse'].includes(curZ);if(!O)return;
cx.strokeStyle='rgba(16,21,37,.5)';cx.lineWidth=1.5;cx.beginPath();for(let i=0;i<3;i++){const x=(T*30+i*300)%(w+40)-20,y=h*.15+i*26+Math.sin(T+i)*12,f=Math.sin(T*8+i)*3;cx.moveTo(x-6,y-3+f);cx.lineTo(x,y);cx.lineTo(x+6,y-3+f)}cx.stroke();
if(['garden','forest','orchard','pet','beach'].includes(curZ))for(let i=0;i<5;i++){cx.fillStyle=i%2?'#E7C98B':'#B86F7C';cx.beginPath();cx.arc(w*(.2+.15*i)+Math.sin(T*1.3+i)*40,h*.7+Math.cos(T*1.7+i)*30,3,0,7);cx.fill()}}
SQ.push(['Fly a kite',()=>!!S.kite,'The kite on the beach. Tap LIFT to keep it in the green for 8 seconds.'],
['Win a paper boat race',()=>S.boat>=1,'The paper boats at the lighthouse shore. Pick one and hope.'],
['Release the lanterns',()=>!!S.fest,'Make your wish and send your bottle message first. Then the fireworks 🎇 at the night market.'],
['Take 3 photos with Biscuit',()=>S.pb>=3,'Press E on Biscuit so he follows you, then press P (or tap 📷). G opens the gallery.',()=>S.pb+'/3'],
['Help three neighbours',()=>S.lr.length>=3,'The chef, keeper and station master each lost something. Find it, then return it.',()=>S.lr.length+'/3'],
['Give three gifts',()=>Object.keys(S.gv).length>=3,'Talk to the locals. They\'ll sometimes let you give them a souvenir.',()=>Object.keys(S.gv).length+'/3'],
['Learn the song',()=>S.sp.length>=4,'Talk to all four locals. Each teaches a phrase. Listen in the Future hall.',()=>S.sp.length+'/4'],
['Dream three times',()=>S.dr>=3,'The dream catcher 🪶 in the bedroom.',()=>S.dr+'/3'],
['Align the lighthouse mirrors',()=>!!S.lp,'The 🔦 by the lighthouse. Each mirror turns a bit more than the last.'],
['Change your outfit',()=>(S.fit||0)>0,'The wardrobe 👗 in the bedroom.']);
ACH.push(['Best friends',()=>S.pb>=3],['Neighbourhood hero',()=>S.lr.length>=3]);
document.head.appendChild(Object.assign(document.createElement('style'),{textContent:'#tl{display:none;position:fixed;z-index:25;right:26px;bottom:124px;flex-direction:column;gap:8px}body.touch #tl{display:flex}body.nohud #tl{display:none!important}#tl button{padding:8px 12px;letter-spacing:0;font-size:16px}'}));
{const d=document.createElement('div');d.id='tl';d.innerHTML='<button>📷</button><button>🖼</button><button>⚙</button>';document.body.appendChild(d);const b=d.children;b[0].onclick=snap;b[1].onclick=gallery;b[2].onclick=settings}
/* ================= TRUE ENDING SCENE + FINAL PHOTO ================= */
Object.assign(CFG,{trueLetter:'Put The Letter Here',finalPhoto:'photo1.png'});
new Image().src=CFG.finalPhoto;
document.head.appendChild(Object.assign(document.createElement('style'),{textContent:'@keyframes rise{0%{transform:translateY(0);opacity:0}12%{opacity:1}100%{transform:translateY(-120vh);opacity:.85}}#ts{position:fixed;inset:0;z-index:75;background:radial-gradient(#1a2038,#101525);display:flex;align-items:center;justify-content:center;text-align:center;padding:24px;opacity:0;transition:opacity 1.5s;overflow:hidden}#ts.on{opacity:1}#ts .lt{position:absolute;bottom:-60px;font-size:30px;animation:rise linear infinite}#tt{position:relative;z-index:2;white-space:pre-line;line-height:1.9;letter-spacing:.12em;font-size:clamp(16px,2.8vw,26px);color:var(--cream);max-width:min(680px,90vw);transition:opacity 1s}#tt.letter{font-size:clamp(15px,2.2vw,20px);letter-spacing:.04em;max-height:62vh;overflow-y:auto;text-align:left;user-select:text}#tt img{width:110px;margin:4px;border-radius:4px}'}));
function trueSong(){if(!AU.c)return;const seq=[...PHR.chef,...PHR.keeper,...PHR.master,...PHR.fort,...S.mel.map(f=>12*Math.log2(f/220))];
[0,-2,-4,-2].forEach((r,b)=>{seq.forEach((n,i)=>setTimeout(()=>AU.tone(220*Math.pow(2,(n+r)/12),1.6,.035,'triangle'),(b*seq.length+i)*380));[0,4,7].forEach(m=>setTimeout(()=>AU.tone(110*Math.pow(2,(r+m)/12),4,.02),b*seq.length*380))})}
async function trueScene(){unpan();const o=document.createElement('div');o.id='ts';o.innerHTML=Array.from({length:16},(_,i)=>`<span class="lt" style="left:${(i*6.5+3)%96}%;animation-duration:${9+i%5*2}s;animation-delay:${-i*1.3}s">🏮</span>`).join('')+'<div id="tt"></div>';document.body.appendChild(o);
const tt=$('tt'),show=async(h,ms,html)=>{tt.classList.remove('letter');tt.style.opacity=0;await sleep(700);html?tt.innerHTML=h:tt.textContent=h;tt.style.opacity=1;await sleep(ms)};
o.classList.add('on');trueSong();await sleep(1500);
await show('You did all of it.',3000);
if(S.wish)await show('A wish, floating up:\n"'+S.wish+'"',4200);
if(S.bottle)await show('A message the sea kept:\n"'+S.bottle+'"',4200);
if(S.sv.length)await show('Everything you kept:\n'+S.sv.map(z=>ZS[z][0]).join(' '),3800);
if(S.mug)await show('☕ "'+S.mug+'"\nStill leaning a little.',3600);
if(S.cap)await show('A note you buried:\n"'+S.cap+'"',4200);
if(PHS.length)await show('Moments you stopped to keep:<br>'+PHS.map(u=>`<img src="${u}">`).join(''),4500,1);
await show('And one more thing.',2600);
tt.style.opacity=0;await sleep(700);tt.classList.add('letter');tt.textContent=CFG.trueLetter;tt.style.opacity=1;
await new Promise(r=>{const b=document.createElement('button');b.textContent='CONTINUE';b.style.cssText='position:absolute;bottom:7vh;left:50%;transform:translateX(-50%);z-index:3';b.onclick=r;o.appendChild(b)});
o.classList.remove('on');await sleep(1600);o.remove()}
async function finalPhoto(){pan('<img id="fp" src="'+CFG.finalPhoto+'" alt="" style="max-width:min(88vw,720px);max-height:72vh;border-radius:6px;box-shadow:0 0 60px rgba(231,201,139,.4);opacity:0;transition:opacity 3s"><p style="opacity:.7;letter-spacing:.25em;margin-top:18px">Look beside you.</p>');await sleep(100);const e=$('fp');e.onerror=()=>e.remove();e.style.opacity=1}
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
for(const o of L){if(o.tr){cx.globalAlpha=ZA(zn(o.x,o.y));drawTree(o);cx.globalAlpha=1}else if(o===p)ch(p.x,p.y,OUT[S.fit||0][1],curZ==='future'?lc(OUT[S.fit||0][2],'#d8d6e0',Math.max(0,Math.min(1,(200-p.y)/1400))):OUT[S.fit||0][2],p.w,p.dir,sit);else obj(o)}
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
rainFx(w,h);if(mode==='play'&&!['home','bedroom','cafe','future','cinema','books','arcade','noodle','roof','treehouse','cave'].includes(curZ)){cx.fillStyle=`rgba(20,24,80,${.26*(1+Math.sin(T/40))/2})`;cx.fillRect(0,0,w,h)}
if(curZ!=='future'&&mode!=='rebuild'&&mode!=='void'){const v=cx.createRadialGradient(w/2,h/2,Math.min(w,h)*.3,w/2,h/2,Math.max(w,h)*.75);v.addColorStop(0,'rgba(16,21,37,0)');v.addColorStop(1,'rgba(16,21,37,.55)');cx.fillStyle=v;cx.fillRect(0,0,w,h)}}
let last=0;function frame(ts){const dt=Math.min(.1,(ts-last)/1000||0);last=ts;upd(dt);render();requestAnimationFrame(frame)}
setInterval(save,4000);addEventListener('beforeunload',save);
/* ================= BOOT ================= */
hud();
$('start').onclick=async()=>{AU.init();$('title').classList.add('off');await sleep(1300);const hp=$('help');hp.textContent=TOUCH?'JOYSTICK — MOVE\nBUTTON — INTERACT\n🗺 (TOP LEFT) — MAP\n📜 — MISSIONS + SIDE QUESTS':'WASD / ARROW KEYS — MOVE\nE — INTERACT\nM — MAP\nJ — MISSIONS\nQ — SIDE QUESTS\nP — PHOTO · G — GALLERY · O — SETTINGS';hp.classList.add('on');await sleep(3400);hp.classList.remove('on');await sleep(900);
if(S.done){mode='end';results();return}
await fade(1,700);mode='play';nohud(0);await fade(0,1800)};
requestAnimationFrame(frame);
