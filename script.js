import{initializeApp,deleteApp}from"https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import{getAuth,onAuthStateChanged,signInWithEmailAndPassword,createUserWithEmailAndPassword,signOut,sendPasswordResetEmail}from"https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import{getFirestore,collection,doc,onSnapshot,setDoc,updateDoc,deleteDoc,getDoc,serverTimestamp}from"https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
const FB={apiKey:"AIzaSyD2mYFtPnRS5U3Eh0wQpw3FGRKIh56axlg",authDomain:"clemantech.firebaseapp.com",projectId:"clemantech",storageBucket:"clemantech.firebasestorage.app",messagingSenderId:"42083771386",appId:"1:42083771386:web:597881c3dbd88d242efa43"};
const app=initializeApp(FB),au=getAuth(app),db=getFirestore(app);
const CFG={CC:'233'}; // default country code for numbers starting with 0
const DEF=[['🎨','Graphic Design','Logos, branding, flyers and social visuals','--pink'],['🎬','Video Editing','Reels, ads, events and documentaries','--sun'],['✍️','Content Creation','Captions, blogs, photos and brand stories','--mint'],['💻','Website Development','Fast, good-looking sites and web apps','--blue'],['📊','Data Analysis','Dashboards, reports and clear insights','--sun'],['🧭','Project Management','Plans, teams and deadlines that hold','--mint'],['🎉','Event Planning & Resin Art','Memorable events and handmade resin pieces','--pink'],['🏗️','Site Planning','Plan and structure spaces before you build','--sun']];
let S=[]; // live list of expertise areas, loaded from Firestore (config/skills), falls back to DEF
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let U=[],me=null,F='All',Q='',LOGO='',SHOWN=true,JOIN=true,dirty=1,hi=0,hStop=0,hHold=0;
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
function count(el,v){const from=+el.textContent||0;if(from===v||RM){el.textContent=v;return}const t0=performance.now();(function f(t){const k=Math.min(1,(t-t0)/700);el.textContent=Math.round(from+(v-from)*k);if(k<1)requestAnimationFrame(f)})(t0)}
const cur=()=>U.find(u=>u.id===me);
const wa=n=>{n=String(n).replace(/\D/g,'');return n.startsWith('0')?CFG.CC+n.slice(1):n};
const tel=n=>String(n).replace(/[^\d+]/g,'');
const hue=s=>{let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))%360;return h};
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),3400)}
function modal(h){$('#box').innerHTML='<button class="b s x" onclick="closeM()" aria-label="Close">✕</button>'+h;$('#ov').classList.add('on');$('#box').scrollTop=0}
function closeM(){$('#ov').classList.remove('on')}
document.addEventListener('keydown',e=>e.key==='Escape'&&closeM());

const PH={'Graphic Design':'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1000&q=80','Video Editing':'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1000&q=80','Content Creation':'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1000&q=80','Website Development':'https://images.unsplash.com/photo-1547659637-5f6b1e9f1f4b?auto=format&fit=crop&w=1000&q=80','Data Analysis':'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80','Project Management':'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=80','Event Planning & Resin Art':'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=80','Site Planning':'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80'};
let heroName='';
const hs=()=>S.filter(s=>PH[s[1]]);
function put(el,h){if(el._h!==h){el._h=h;el.innerHTML=h}}

/* ===== Drawing the page ===== */
function draw(){
  const a=cur(),t=!LOGO||SHOWN;
  put($('#auth'),a?`<button class="b s p" onclick="openDash()">${a.role==='admin'?'Admin panel':'My account'}</button><button class="b s" onclick="logout()">Log out</button>`:`<button class="b s" onclick="openLogin()">Log in</button>${JOIN?`<button class="b s p" onclick="openForm('reg')">Join our team ↗</button>`:''}`);
  put($('#tick'),[...S,...S,...S,...S].map(s=>`<span>${esc(s[0])} ${esc(s[1])}</span>`).join(''));
  const all=U.filter(u=>u.active!==false&&vsk(u).length),cnt=n=>all.filter(u=>vsk(u).includes(n)).length;
  put($('#svc'),S.length?S.map((s,i)=>{const c=cnt(s[1]);return`<a class="service-card" href="#experts" onclick="pickI(${i},1)"><div class="service-photo" style="--c:var(${esc(s[3])})">${PH[s[1]]?`<img src="${PH[s[1]].replace('w=1000','w=600')}" alt="${esc(s[1])}" loading="lazy" onerror="this.remove()">`:`<b class="svc-ic">${esc(s[0])}</b>`}<span class="photo-number">${String(i+1).padStart(2,'0')}</span><span class="photo-arrow">↗</span></div><div class="service-info"><span>${c} EXPERT${c===1?'':'S'} READY</span><h3>${esc(s[1])}</h3><p>${esc(s[2])}</p></div></a>`}).join(''):'<p class="empty">Services coming soon</p>');
  put($('#chips'),['All',...S.map(s=>s[1])].map((n,i)=>`<button class="chip ${n===F?'on':''}" onclick="pickI(${i-1},1)">${esc(n)}</button>`).join(''));
  count($('#n1'),all.length);count($('#n2'),S.length);$('#online').textContent=all.length+' expert'+(all.length===1?'':'s')+' online';
  if(dirty){dirty=0;const b=(LOGO?`<img class="lg" src="${LOGO}" alt="CLEMANTECH">`:'<span class="brand-mark">C<span>.</span></span>')+(t?'<span>CLEMANTECH<small>CONSULT</small></span>':'');$('#lg').innerHTML=b;$('#flg').innerHTML=b;$('#fav').href=LOGO||'data:,'}
  document.querySelectorAll('[data-join]').forEach(b=>b.style.display=JOIN?'':'none');
  const hl=hs();if(hl.length&&!hl.some(s=>s[1]===heroName))heroSet(hl[0]);
  const q=Q.toLowerCase(),L=all.filter(u=>(F==='All'||u.skills.includes(F))&&(!q||(u.name+vsk(u).join(' ')+(u.bio||'')).toLowerCase().includes(q)));
  put($('#expert-grid'),L.length?L.map((u,n)=>`<article class="expert-card"><div class="expert-visual" style="--h:${hue(u.name)}"><span class="availability"><i></i> AVAILABLE</span>${u.photo?`<img class="portrait-img" src="${esc(u.photo)}" alt="${esc(u.name)}" loading="lazy">`:`<div class="portrait-placeholder">${esc(u.name[0].toUpperCase())}<span>.</span></div>`}<span class="expert-index">EXPERT ${String(n+1).padStart(2,'0')}</span></div><div class="expert-details"><div class="expert-name"><div><h3>${esc(u.name)}</h3><span>${esc(vsk(u)[0])}</span></div><span class="verified">✦</span></div><p>${esc(u.bio||'')}</p><div class="skill-tags">${vsk(u).map(s=>`<span>${esc(s)}</span>`).join('')}</div><div class="expert-actions"><a class="whatsapp-link" href="https://wa.me/${wa(u.whatsapp)}?text=${encodeURIComponent('Hi '+u.name.split(' ')[0]+', I found you on Clemantech Consult and would like to talk about a project.')}" target="_blank" rel="noopener">Message on WhatsApp <span>↗</span></a><a class="mini" href="tel:${tel(u.phone)}">Call</a><a class="mini" href="mailto:${esc(u.email)}">Email</a></div></div></article>`).join(''):`<div class="empty"><h3>${all.length?'No one matches that yet':'Our experts are joining soon'}</h3><p>${all.length?'Try another service or clear the search.':JOIN?'Be the first to list your skills.':'Check back soon.'}</p>${all.length||JOIN?`<button class="b p" style="margin-top:14px" onclick="${all.length?"pick('All',1);setQ('');document.getElementById('expert-search').value=''":"openForm('reg')"}">${all.length?'Show everyone':'Join as an expert'}</button>`:''}</div>`);
}

/* ===== Hero: cycles through the services ===== */
function heroSet(s){heroName=s[1];const im=$('#hero-img');im.style.opacity=0;setTimeout(()=>{im.src=PH[s[1]];im.alt=s[1];$('#hero-tag').textContent=String(S.indexOf(s)+1).padStart(2,'0')+' / '+s[1].toUpperCase();$('#hero-title').textContent=s[2];im.style.opacity=1},260)}
function heroGo(){if(heroName)pick(heroName)}
$('.hero-image').addEventListener('pointerenter',()=>hHold=1);$('.hero-image').addEventListener('pointerleave',()=>hHold=0);
if(!RM)setInterval(()=>{const l=hs();if(l.length>1&&!document.hidden&&!hHold){hi=(hi+1)%l.length;heroSet(l[hi])}},3800);

/* ===== Profile photo ===== */
function cropPhoto(f){return new Promise((ok,no)=>{const u=URL.createObjectURL(f),im=new Image();im.onload=()=>{URL.revokeObjectURL(u);const W=im.naturalWidth,H=im.naturalHeight,r=3/4;let sw=W,sh=W/r;if(sh>H){sh=H;sw=H*r}const c=document.createElement('canvas');c.width=300;c.height=400;c.getContext('2d').drawImage(im,(W-sw)/2,(H-sh)/4,sw,sh,0,0,300,400);ok(c.toDataURL('image/jpeg',.8))};im.onerror=()=>no();im.src=u})}
async function pickPhoto(i){const f=i.files[0];i.value='';if(!f)return;if(!f.type.startsWith('image/'))return toast('Please choose an image file');try{const d=await cropPhoto(f);$('#ph-val').value=d;$('#ph-prev').innerHTML=`<img src="${d}" alt="">`}catch(x){toast('Could not use that image. Try a JPG or PNG')}}
function clearPhoto(){$('#ph-val').value='';$('#ph-prev').textContent='👤'}

/* ===== Page extras ===== */
function contactUs(){const ad=U.find(u=>u.role==='admin'&&u.whatsapp);if(ad)open('https://wa.me/'+wa(ad.whatsapp)+'?text='+encodeURIComponent("Hi Clemantech! I'd like to discuss a project."),'_blank','noopener');else{$('#experts').scrollIntoView();toast('Pick an expert below to message them directly')}}
function joinNow(){me?openDash():openForm('reg')}
function confetti(){if(RM)return;const c=document.createElement('canvas');c.style.cssText='position:fixed;inset:0;z-index:99;pointer-events:none';c.width=innerWidth;c.height=innerHeight;document.body.append(c);const g=c.getContext('2d'),P=Array.from({length:120},()=>({x:innerWidth/2,y:innerHeight*.6,vx:(Math.random()-.5)*15,vy:-Math.random()*16-4,s:5+Math.random()*7,r:Math.random()*6,h:['#c7f36b','#fff','#ffd23f','#ff7aa8','#7ef0c8'][Math.random()*5|0]}));let f=0;(function a(){g.clearRect(0,0,c.width,c.height);P.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.45;p.r+=.2;g.fillStyle=p.h;g.save();g.translate(p.x,p.y);g.rotate(p.r);g.fillRect(-p.s/2,-p.s/2,p.s,p.s*.6);g.restore()});if(++f<120)requestAnimationFrame(a);else c.remove()})()}
$('#year').textContent=new Date().getFullYear();
const mb=$('.menu-toggle'),nv=$('.nav');
mb.onclick=()=>{const o=nv.classList.toggle('open');mb.setAttribute('aria-expanded',o)};
nv.addEventListener('click',e=>{if(e.target.closest('a,button'))nv.classList.remove('open')});
const pg=$('#prog');addEventListener('scroll',()=>{pg.style.transform=`scaleX(${scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)})`},{passive:true});
if(!RM&&matchMedia('(hover:hover) and (pointer:fine)').matches){
  document.querySelectorAll('.tilt-card').forEach(c=>{c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform=`perspective(900px) rotateY(${x*7}deg) rotateX(${-y*7}deg) translateY(-2px)`});c.addEventListener('pointerleave',()=>c.style.transform='')});
  addEventListener('pointermove',e=>{document.body.style.setProperty('--mx',e.clientX+'px');document.body.style.setProperty('--my',e.clientY+'px')},{passive:true});
}
if('IntersectionObserver'in window&&!RM){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');io.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('.step,.join-panel,.section-heading').forEach(el=>{el.classList.add('reveal');io.observe(el)})}
function pick(n,stay){F=n;draw();if(!stay)document.getElementById('experts').scrollIntoView()}
function pickI(i,stay){pick(i<0?'All':S[i][1],stay)}

/* ===== Live data & auth ===== */
let busy=0,ready=0;
const er=x=>({'auth/email-already-in-use':'That email is already registered','auth/invalid-credential':'Wrong email or password','auth/weak-password':'Password needs 6+ characters','auth/invalid-email':'That email looks wrong','auth/too-many-requests':'Too many tries. Please wait a moment','permission-denied':'You do not have permission to do that'}[x.code]||'Something went wrong ('+(x.code||x.message)+')');
onSnapshot(collection(db,'users'),s=>{U=s.docs.map(d=>({...d.data(),id:d.id,skills:d.data().skills||[]}));ready=1;draw()},x=>toast('Could not load experts: '+(x.code||x.message)));
function vsk(u){return u.skills.filter(k=>S.some(s=>s[1]===k))}
onSnapshot(doc(db,'config','settings'),s=>{JOIN=!(s.exists()&&s.data().joinOpen===false);draw()},()=>{});
onSnapshot(doc(db,'config','brand'),s=>{const d=s.exists()?s.data():{};LOGO=d.logo||'';SHOWN=d.showName!==false;dirty=1;draw()},()=>{});
onSnapshot(doc(db,'config','skills'),s=>{const l=s.exists()&&s.data().list;S=Array.isArray(l)?l.map(x=>[x.i,x.n,x.d,x.c]):DEF;if(F!=='All'&&!S.some(x=>x[1]===F))F='All';draw()},()=>{S=DEF;draw()});
onAuthStateChanged(au,async u=>{me=u?u.uid:null;if(u&&!busy){const d=await getDoc(doc(db,'users',u.uid)).catch(()=>null);if(d&&!d.exists()){await signOut(au);me=null;toast('This account was removed. Please contact the admin.')}}draw()});
function acct(){me?openDash():openLogin()}
function setQ(v){Q=v;draw()}
function openLogin(){modal(`<h2>Welcome back</h2><form onsubmit="return login(event)"><label>Email<input name="email" type="email" required autocomplete="username"></label><label>Password<input name="pw" type="password" required autocomplete="current-password"></label><button class="b p">Log in</button></form><p class="m" style="margin-top:14px"><a href="#" onclick="forgot();return false">Forgot your password?</a>${JOIN?` &nbsp;|&nbsp; <a href="#" onclick="openForm('reg');return false">Create an account</a>`:''}</p>`)}
async function login(e){e.preventDefault();const f=new FormData(e.target);try{await signInWithEmailAndPassword(au,f.get('email').trim(),f.get('pw'));closeM();toast('Welcome back!')}catch(x){toast(er(x))}return false}
function logout(){signOut(au);toast('Logged out')}
function forgot(){const ad=U.find(u=>u.role==='admin'&&u.whatsapp);modal(`<h2>Reset your password</h2><p style="margin:12px 0">Enter your email and we will send you a reset link.</p><form onsubmit="return sendReset(event)"><label>Email<input name="email" type="email" required></label><button class="b p">Send reset link</button></form>${ad?`<p class="m" style="margin-top:14px">No access to that email? <a href="https://wa.me/${wa(ad.whatsapp)}" target="_blank" rel="noopener">Message the admin</a></p>`:''}`)}
async function sendReset(e){e.preventDefault();try{await sendPasswordResetEmail(au,new FormData(e.target).get('email').trim())}catch(x){if(x.code!=='auth/user-not-found')return toast(er(x)),false}toast('If that email is registered, a reset link is on its way');closeM();return false}

/* ===== Forms: register / add / edit / my profile ===== */
function openForm(mode,id){
  if(mode==='reg'&&!JOIN)return toast('New sign-ups are closed right now. Please check back later.');
  const u=(id?U.find(x=>x.id===id):mode==='me'?cur():null)||{skills:[]},a=cur()?.role==='admin';
  const T={reg:'Join as an expert',add:'Add an account',edit:'Edit account',me:'My profile'}[mode];
  modal(`<h2>${T}</h2><form onsubmit="return save(event,'${mode}','${u.id||''}')">
  <div class="photo-pick"><div class="ph-prev" id="ph-prev">${u.photo?`<img src="${esc(u.photo)}" alt="">`:'👤'}</div><div><b style="font-size:.9rem">Passport-style photo</b><p class="m">Face the camera, plain background. Clients see this on your card.</p><div class="acts" style="margin-top:8px"><label class="b s p" style="cursor:pointer">Upload photo<input type="file" accept="image/*" hidden onchange="pickPhoto(this)"></label><button type="button" class="b s" onclick="clearPhoto()">Remove</button></div><input type="hidden" name="photo" id="ph-val" value="${esc(u.photo||'')}"></div></div>
  <label>Full name<input name="name" required value="${esc(u.name)}"></label>
  <div class="row"><label>Active email<input name="email" type="email" required value="${esc(u.email)}" ${u.id?'readonly':''}></label>
  <label>WhatsApp number<input name="wa" type="tel" placeholder="e.g. 0244123456" value="${esc(u.whatsapp)}"></label></div>
  <label>Active call line<input name="ph" type="tel" placeholder="e.g. 0201234567" value="${esc(u.phone)}"></label>
  <div><b style="font-size:.9rem">My expertise (pick all that apply)</b><div class="sk" style="margin-top:6px">${S.map(s=>`<label class="chip"><input type="checkbox" name="sk" value="${s[1]}" ${u.skills.includes(s[1])?'checked':''}>${s[0]} ${s[1]}</label>`).join('')}</div></div>
  <label>Short bio<textarea name="bio" rows="2" maxlength="160" placeholder="One line about your work">${esc(u.bio)}</textarea></label>
  ${mode==='reg'||mode==='add'?`<label>${mode==='add'?'Starting password (they can reset it later)':'Password'}<input name="pw" type="password" minlength="6" required autocomplete="new-password"></label>`:''}
  ${a&&(mode==='add'||(mode==='edit'&&u.id!==me))?`<label>Role<select name="role"><option value="expert" ${u.role!=='admin'?'selected':''}>Expert</option><option value="admin" ${u.role==='admin'?'selected':''}>Admin</option></select></label>`:''}
  ${mode==='me'||mode==='edit'?`<label class="chip" style="justify-self:start"><input type="checkbox" name="act" ${u.active!==false?'checked':''}>Show on the website</label>`:''}
  <button class="b p">${mode==='reg'?'Create my account':'Save'}</button></form>`)}
async function save(e,mode,id){e.preventDefault();const f=new FormData(e.target),g=k=>(f.get(k)||'').trim(),sk=f.getAll('sk'),email=g('email').toLowerCase(),pw=f.get('pw')||'';
  if(sk.length&&(!g('wa')||!g('ph')))return toast('Experts need a WhatsApp number and a call line'),false;
  const d={name:g('name'),email,whatsapp:g('wa'),phone:g('ph'),bio:g('bio'),skills:sk,photo:f.get('photo')||''};busy=1;
  try{
    if(mode==='reg'){const c=await createUserWithEmailAndPassword(au,email,pw);await setDoc(doc(db,'users',c.user.uid),{...d,role:'expert',active:true,createdAt:serverTimestamp()});toast('Welcome aboard, '+d.name.split(' ')[0]+'!');closeM();confetti()}
    else if(mode==='add'){const a2=initializeApp(FB,'t'+Date.now()),a2a=getAuth(a2),c=await createUserWithEmailAndPassword(a2a,email,pw);await signOut(a2a);await deleteApp(a2);await setDoc(doc(db,'users',c.user.uid),{...d,role:f.get('role')||'expert',active:true,createdAt:serverTimestamp()});toast('Account added');openDash()}
    else{const up={...d};delete up.email;up.active=!!f.get('act');if(f.get('role')&&id!==me)up.role=f.get('role');await updateDoc(doc(db,'users',id),up);toast('Saved');mode==='edit'?openDash():closeM()}
  }catch(x){toast(er(x))}
  busy=0;return false}

/* ===== Dashboard & admin tools ===== */
function openDash(){const a=cur();if(!a)return openLogin();
  let h=`<h2>Hi, ${esc(a.name.split(' ')[0])} 👋</h2><div class="acts" style="margin-top:14px"><button class="b p" onclick="openForm('me')">Edit my profile & expertise</button><button class="b" onclick="resetPw('${a.id}')">Change password</button></div>`;
  if(a.role==='admin')h+=joinAdmin();
  if(a.role==='admin')h+=logoAdmin();
  if(a.role==='admin')h+=skillAdmin();
  if(a.role==='admin')h+=`<h2 style="font-size:1.4rem;margin-top:26px">Team (${U.length})</h2><div class="acts" style="margin-top:10px"><button class="b s p" onclick="openForm('add')">+ Add account</button></div>`+U.map(u=>`<div class="u"><div><b>${esc(u.name)}</b> ${u.role==='admin'?'🛡️':''}${u.active===false?' (hidden)':''}<small>${esc(u.email)}</small><small>${esc(u.skills.join(', ')||'No expertise yet')}</small></div><div class="acts"><button class="b s" onclick="openForm('edit','${u.id}')">Edit</button><button class="b s" onclick="resetPw('${u.id}')">Send reset email</button>${u.id!==me?`<button class="b s d" onclick="del('${u.id}')">Remove</button>`:''}</div></div>`).join('');
  modal(h)}
function joinAdmin(){
  return `<h2 style="font-size:1.4rem;margin-top:26px">Expert sign-ups</h2><div class="u"><div><b>${JOIN?'Open':'Closed'}</b><small>${JOIN?'Anyone can join as an expert from the website.':'The Join buttons are hidden and new sign-ups are blocked.'}</small></div><div class="acts"><button class="b s ${JOIN?'d':'p'}" onclick="setJoin(${!JOIN})">${JOIN?'Turn off sign-ups':'Turn on sign-ups'}</button></div></div>`}
async function setJoin(v){try{await setDoc(doc(db,'config','settings'),{joinOpen:!!v,updatedAt:serverTimestamp()},{merge:true});toast(v?'Sign-ups are open':'Sign-ups are closed');openDash()}catch(x){toast(er(x))}}
function logoAdmin(){
  return `<h2 style="font-size:1.4rem;margin-top:26px">Site logo</h2><p class="m" style="margin-top:4px">Shown in the top bar, footer and browser tab. A PNG with a transparent background looks best.</p><div class="u"><div>${LOGO?`<img class="lg" src="${LOGO}" alt="Current logo" style="height:56px;max-width:180px;object-fit:contain">`:'<small>No logo yet. The default mark is showing.</small>'}</div><div class="acts"><label class="b s p" style="cursor:pointer">${LOGO?'Replace logo':'Upload logo'}<input type="file" accept="image/*" hidden onchange="upLogo(this)"></label>${LOGO?'<button class="b s d" onclick="rmLogo()">Remove</button>':''}</div></div>${LOGO?`<label class="chip" style="margin-top:10px"><input type="checkbox" ${SHOWN?'checked':''} onchange="setShowName(this.checked)">Show the name next to the logo</label>`:''}`}
function shrink(f){return new Promise((ok,no)=>{const u=URL.createObjectURL(f),im=new Image();
  im.onload=()=>{URL.revokeObjectURL(u);const W=im.naturalWidth||400,H=im.naturalHeight||400;for(const m of[480,320,200]){const k=Math.min(1,m/Math.max(W,H)),c=document.createElement('canvas');c.width=Math.max(1,Math.round(W*k));c.height=Math.max(1,Math.round(H*k));c.getContext('2d').drawImage(im,0,0,c.width,c.height);const d=c.toDataURL('image/png');if(d.length<700000)return ok(d)}no(new Error('big'))};
  im.onerror=()=>no(new Error('bad'));im.src=u})}
async function upLogo(inp){const f=inp.files[0];inp.value='';if(!f)return;if(!f.type.startsWith('image/'))return toast('Please choose an image file');
  try{const url=await shrink(f);await setDoc(doc(db,'config','brand'),{logo:url,showName:SHOWN,updatedAt:serverTimestamp()},{merge:true});toast('Logo updated');openDash()}catch(x){toast(x.code?er(x):'Could not use that image. Try a smaller PNG or JPG')}}
async function rmLogo(){if(!confirm('Remove the logo and go back to the default mark?'))return;try{await setDoc(doc(db,'config','brand'),{logo:'',updatedAt:serverTimestamp()},{merge:true});toast('Logo removed');openDash()}catch(x){toast(er(x))}}
async function setShowName(v){try{await setDoc(doc(db,'config','brand'),{showName:!!v,updatedAt:serverTimestamp()},{merge:true})}catch(x){toast(er(x))}}
function skillAdmin(){
  const opt=[['--pink','Pink'],['--sun','Yellow'],['--mint','Mint'],['--blue','Blue']].map(o=>`<option value="${o[0]}">${o[1]}</option>`).join('');
  return `<h2 style="font-size:1.4rem;margin-top:26px">Areas of expertise (${S.length})</h2><p class="m" style="margin-top:4px">These appear as services on the site and as choices when experts set up their profile.</p>`
  +S.map((s,k)=>{const c=U.filter(u=>u.active!==false&&u.skills.includes(s[1])).length;return `<div class="u"><div><b>${esc(s[0])} ${esc(s[1])}</b><small>${c} expert${c===1?'':'s'}</small></div><div class="acts"><button class="b s d" onclick="delSkill(${k})">Remove</button></div></div>`}).join('')
  +`<form class="u" style="display:grid" onsubmit="return addSkill(event)"><b>Add an area of expertise</b><div class="row"><label>Emoji<input name="i" maxlength="4" placeholder="✨"></label><label>Name<input name="n" required maxlength="40" placeholder="e.g. Photography"></label></div><label>Short description<input name="d" maxlength="80" placeholder="What this covers"></label><label>Card colour<select name="c">${opt}</select></label><button class="b p">+ Add area</button></form>`}
async function saveSkills(l){await setDoc(doc(db,'config','skills'),{list:l.map(x=>({i:x[0],n:x[1],d:x[2],c:x[3]})),updatedAt:serverTimestamp()})}
async function addSkill(e){e.preventDefault();const f=new FormData(e.target),n=(f.get('n')||'').trim(),i=(f.get('i')||'').trim()||'✨',d=(f.get('d')||'').trim()||'Ask our experts for details';
  if(!n)return false;if(S.some(s=>s[1].toLowerCase()===n.toLowerCase()))return toast('That area already exists'),false;
  try{await saveSkills([...S,[i,n,d,f.get('c')]]);toast('Added '+n);openDash()}catch(x){toast(er(x))}return false}
async function delSkill(k){const s=S[k];if(!s)return;const c=U.filter(u=>u.skills.includes(s[1])).length;
  if(!confirm('Remove "'+s[1]+'"?'+(c?' '+c+' expert'+(c>1?'s':'')+' currently list it. It will disappear from the site and their profiles.':'')))return;
  try{await saveSkills(S.filter((_,j)=>j!==k));toast('Removed '+s[1]);openDash()}catch(x){toast(er(x))}}
async function resetPw(id){const u=U.find(x=>x.id===id);try{await sendPasswordResetEmail(au,u.email);toast('Reset link sent to '+u.email)}catch(x){toast(er(x))}}
async function del(id){const u=U.find(x=>x.id===id);if(u.role==='admin'&&U.filter(x=>x.role==='admin').length<2)return toast('You need at least one admin');
  if(!confirm('Remove '+u.name+' from the site? This cannot be undone.'))return;try{await deleteDoc(doc(db,'users',id));toast('Account removed');openDash()}catch(x){toast(er(x))}}
Object.assign(window,{acct,setQ,openLogin,login,logout,forgot,sendReset,openForm,save,openDash,resetPw,del,pick,pickI,setJoin,addSkill,delSkill,upLogo,rmLogo,setShowName,pickPhoto,clearPhoto,closeM,draw,joinNow,contactUs,heroGo});
draw();
