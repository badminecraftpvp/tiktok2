'use strict';
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const G=['linear-gradient(135deg,#7c5cff,#ff5c8a)','linear-gradient(135deg,#00c6ff,#0072ff)','linear-gradient(135deg,#f9d423,#ff4e50)','linear-gradient(135deg,#11998e,#38ef7d)','linear-gradient(135deg,#232526,#5b5b66)','linear-gradient(135deg,#ff9a9e,#f6a6c1)'];
const U={me:{n:'You',h:'you',e:'😎',g:0},ava:{n:'Ava Chen',h:'avachen',e:'🌸',g:5},leo:{n:'Leo Park',h:'leopark',e:'🏔️',g:1},mia:{n:'Mia Torres',h:'miat',e:'🎧',g:0},noah:{n:'Noah Reed',h:'noahr',e:'🍜',g:2},zoe:{n:'Zoe Adams',h:'zoeadams',e:'🎨',g:3},kai:{n:'Kai Mori',h:'kaimori',e:'🏄',g:4}};
const ST={ava:[['🌸','Golden hour at the park'],['🍵','Matcha o\'clock']],leo:[['🏔️','Summit by sunrise'],['🥾','Trail was worth it']],mia:[['🎧','New playlist is live'],['🎤','Soundcheck']],noah:[['🍜','Ramen research, day 4']],zoe:[['🎨','Work in progress'],['🖌️','Palette for tomorrow']],kai:[['🏄','Dawn patrol']]};
const I={home:'<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',heart:'<path d="M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/>',msg:'<path d="M21 12a8 8 0 0 1-11.7 7L3 21l2-5.6A8 8 0 1 1 21 12z"/>',share:'<path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/>',bm:'<path d="M19 21l-7-5-7 5V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1z"/>',plus:'<path d="M12 5v14M5 12h14"/>',x:'<path d="M18 6L6 18M6 6l12 12"/>',trash:'<path d="M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15"/>',img:'<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5L5 21"/>'};
const ic=(n,f)=>`<svg viewBox="0 0 24 24" fill="${f?'currentColor':'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${I[n]}</svg>`;
const KEY='pulse-v1',min=6e4;
const seed=()=>{const n=Date.now();return{name:'You',bio:'Building things. Sharing moments ✨',following:['ava','leo','mia','noah'],viewed:[],unread:1,notifs:[{u:'ava',x:'liked your post',t:n-50*min}],posts:[
{id:1,u:'ava',t:n-12*min,e:'🌸',g:5,txt:'Cherry blossoms are out early this year',likes:128,c:[{u:'leo',x:'Gorgeous!',t:n-8*min}]},
{id:2,u:'leo',t:n-95*min,e:'🏔️',g:1,txt:'Sunrise from the ridge. Worth every step of the climb.',likes:342,c:[]},
{id:3,u:'mia',t:n-240*min,g:0,txt:'Hot take: the best songs are the ones you discover by accident.',likes:76,c:[]},
{id:4,u:'noah',t:n-420*min,e:'🍜',g:2,txt:'Found the perfect bowl of ramen.',likes:211,c:[]},
{id:5,u:'zoe',t:n-1200*min,e:'🎨',g:3,txt:'New series dropping soon.',likes:95,c:[]},
{id:6,u:'kai',t:n-1800*min,g:4,txt:'Waves today were unreal.',likes:54,c:[]},
{id:7,u:'me',t:n-2880*min,g:0,txt:'Hello Pulse! First post on my new favorite app.',likes:12,c:[{u:'ava',x:'Welcome!',t:n-2820*min}]}]}};
let S;try{S=JSON.parse(localStorage.getItem(KEY))}catch(e){}
S=S||seed();
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){toast('Storage full, photo not saved')}};
const P=id=>S.posts.find(p=>p.id===id);
const nm=u=>u==='me'?S.name:U[u].n;
const av=(u,s)=>`<span class="av" style="background:${G[U[u].g]};width:${s}px;height:${s}px;font-size:${s*.5}px">${U[u].e}</span>`;
const ago=t=>{const s=(Date.now()-t)/1e3|0;return s<60?'now':s<3600?(s/60|0)+'m':s<86400?(s/3600|0)+'h':(s/86400|0)+'d'};
const fmt=n=>n>=1e3?(n/1e3).toFixed(1)+'k':n;
const vib=()=>navigator.vibrate&&navigator.vibrate(8);
let tab='home',query='',layer=null,sv=null,draft={},lt=0,lid=0,deferred=null,tt;
const pos={},view=$('#view'),sheet=$('#sheet'),story=$('#story');
const titles={home:'Pulse',explore:'Explore',activity:'Activity',me:'Profile'};

function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('show'),2200)}

/* ---------- views ---------- */
const burst=`<i class="burst">${ic('heart',1)}</i>`;
function media(p){const d='data-a="dbl"';
 if(p.img)return`<div class="media" ${d}><img src="${p.img}" alt="">${burst}</div>`;
 if(p.e)return`<div class="media" ${d} style="background:${G[p.g]}"><span class="big">${p.e}</span>${burst}</div>`;
 return`<div class="media txt" ${d} style="background:${G[p.g]}"><p>${esc(p.txt)}</p>${burst}</div>`}
function post(p){const n=p.likes+(p.liked?1:0),cap=p.txt&&(p.img||p.e);
 return`<article class="post" data-id="${p.id}"><div class="ph">${av(p.u,38)}<div class="pm"><b>${esc(nm(p.u))}</b><small>@${U[p.u].h} · ${ago(p.t)}</small></div>${p.u==='me'?`<button class="ib" data-a="del" aria-label="Delete post">${ic('trash')}</button>`:''}</div>${media(p)}
<div class="pa"><button class="ib ${p.liked?'on':''}" data-a="like" aria-label="Like">${ic('heart',p.liked)}</button><button class="ib" data-a="cmt" aria-label="Comments">${ic('msg')}</button><button class="ib" data-a="share" aria-label="Share">${ic('share')}</button><button class="ib r ${p.saved?'sv':''}" data-a="save" aria-label="Save">${ic('bm',p.saved)}</button></div>
<p class="pl"><b>${fmt(n)}</b> likes</p>${cap?`<p class="cap"><b>${esc(nm(p.u))}</b> ${esc(p.txt)}</p>`:''}
<button class="vc" data-a="cmt">${p.c.length?`View all ${p.c.length} comment${p.c.length>1?'s':''}`:'Add a comment'}</button></article>`}
const feed=()=>S.posts.filter(p=>p.u==='me'||S.following.includes(p.u)).sort((a,b)=>b.t-a.t);
function vHome(){const us=S.following.filter(u=>ST[u]);
 return`<div class="stories"><button class="st" data-a="new"><span class="ring seen">${av('me',58)}</span><span>Your story</span></button>${us.map(u=>`<button class="st" data-a="story" data-u="${u}"><span class="ring ${S.viewed.includes(u)?'seen':''}">${av(u,58)}</span><span>${U[u].n.split(' ')[0]}</span></button>`).join('')}</div>`+
 (feed().map(post).join('')||'<p class="empty">Your feed is empty.<br>Follow people in Explore.</p>')}
const gp=p=>`<button class="gi" data-a="gp" data-id="${p.id}" style="background:${G[p.g]}">${p.img?`<img src="${p.img}" alt="">`:p.e||`<span>${esc((p.txt||'').slice(0,40))}</span>`}</button>`;
function exBody(){const q=query.trim().toLowerCase(),us=Object.keys(U).filter(k=>k!=='me'&&(U[k].n+k).toLowerCase().includes(q)),ps=S.posts.filter(p=>(p.txt||'').toLowerCase().includes(q)||nm(p.u).toLowerCase().includes(q));
 return(us.length?`<h3>People</h3>`+us.map(u=>{const f=S.following.includes(u);return`<div class="ur">${av(u,44)}<div class="pm"><b>${U[u].n}</b><small>@${U[u].h}</small></div><button class="fb ${f?'on':''}" data-a="fol" data-u="${u}">${f?'Following':'Follow'}</button></div>`}).join(''):'')+`<h3>Posts</h3>`+(ps.length?`<div class="grid">${ps.map(gp).join('')}</div>`:'<p class="empty">No results</p>')}
const vExplore=()=>`<label class="sb">${ic('search')}<input id="q" type="search" placeholder="Search people and posts" value="${esc(query)}" autocomplete="off"></label><div id="ex">${exBody()}</div>`;
const vAct=()=>S.notifs.length?S.notifs.slice(0,50).map(n=>`<div class="nt">${av(n.u,44)}<div><b>${U[n.u].n}</b> ${esc(n.x)} <small>${ago(n.t)}</small></div></div>`).join(''):'<p class="empty">No activity yet</p>';
function vMe(){const m=S.posts.filter(p=>p.u==='me');
 return`<div class="pf">${av('me',84)}<h2>${esc(S.name)}</h2><small>@you</small><p>${esc(S.bio)}</p><div class="stats"><div><b>${m.length}</b>Posts</div><div><b>1,204</b>Followers</div><div><b>${S.following.length}</b>Following</div></div><div class="btns"><button class="btn pri" data-a="edit">Edit profile</button><button class="btn" data-a="reset">Reset demo</button></div></div>${m.length?`<div class="grid">${m.map(gp).join('')}</div>`:'<p class="empty">Share your first post</p>'}`}
function render(keep){const y=keep?view.scrollTop:pos[tab]||0;
 view.innerHTML=`<section class="pg">${{home:vHome,explore:vExplore,activity:vAct,me:vMe}[tab]()}</section>`;view.scrollTop=y;
 $('#top h1').textContent=titles[tab];
 document.querySelectorAll('#tabs [data-t]').forEach(b=>b.classList.toggle('on',b.dataset.t===tab));badge()}
function go(t){if(t===tab){view.scrollTo({top:0,behavior:'smooth'});return}pos[tab]=view.scrollTop;tab=t;if(t==='activity'){S.unread=0;save()}render()}
function badge(){$('#bdg').hidden=!S.unread}
function upd(id){document.querySelectorAll(`.post[data-id="${id}"]`).forEach(el=>{el.outerHTML=post(P(id))})}

/* ---------- layers: sheet + story, wired to the back button ---------- */
function openLayer(k){layer=k;history.pushState({l:k},'')}
function closeLayer(){if(layer)history.back()}
addEventListener('popstate',()=>{if(layer==='sheet')hideSheet();if(layer==='story')hideStory();layer=null});
function openSheet(html){clearTimeout(sheet._t);sheet.innerHTML=`<div class="scrim" data-a="close"></div><div class="panel" role="dialog">${html}</div>`;sheet.hidden=false;void sheet.offsetWidth;sheet.classList.add('in');if(!layer)openLayer('sheet')}
function hideSheet(){sheet.classList.remove('in');sheet._t=setTimeout(()=>{sheet.hidden=true;sheet.innerHTML=''},300)}

/* comments */
const cm=c=>`<div class="cm">${av(c.u,32)}<div><span><b>${esc(nm(c.u))}</b> ${esc(c.x)}</span><small>${ago(c.t)}</small></div></div>`;
function openComments(id){const p=P(id);
 openSheet(`<div class="sh"><span>Comments</span><button class="ib" data-a="close" aria-label="Close">${ic('x')}</button></div><div class="cl" id="cl">${p.c.length?p.c.map(cm).join(''):'<p class="empty">No comments yet.<br>Start the conversation.</p>'}</div><div class="ci">${av('me',32)}<input id="cin" placeholder="Add a comment…" enterkeyhint="send" autocomplete="off" maxlength="200"><button class="send" data-a="send" data-id="${id}">Post</button></div>`)}
function sendComment(id){const i=$('#cin'),x=i.value.trim();if(!x)return;const p=P(id);p.c.push({u:'me',x,t:Date.now()});save();$('#cl').innerHTML=p.c.map(cm).join('');$('#cl').scrollTop=1e5;i.value='';upd(id);vib()}

/* compose */
function prev(){const p=$('#prev');if(!p)return;p.style.background=draft.img?`url(${draft.img}) center/cover`:G[draft.g];p.innerHTML=draft.img?'':`<p>${esc($('#ctx').value||'Your post preview')}</p>`}
function openCompose(){draft={g:0,img:null};
 openSheet(`<div class="sh"><button data-a="close">Cancel</button><span>New post</span><button class="send" data-a="publish">Share</button></div><div class="cf"><textarea id="ctx" rows="3" maxlength="280" placeholder="What's happening?"></textarea><div id="prev"></div><div class="sw">${G.map((g,i)=>`<button class="swb ${i?'':'on'}" style="background:${g}" data-a="sw" data-i="${i}" aria-label="Color ${i+1}"></button>`).join('')}<label class="ib" aria-label="Add photo">${ic('img')}<input type="file" id="file" accept="image/*" hidden></label></div></div>`);
 prev();setTimeout(()=>$('#ctx')&&$('#ctx').focus(),350)}
function pick(f){const r=new FileReader();r.onload=()=>{const i=new Image();i.onload=()=>{const k=Math.min(1,900/Math.max(i.width,i.height)),c=document.createElement('canvas');c.width=i.width*k;c.height=i.height*k;c.getContext('2d').drawImage(i,0,0,c.width,c.height);draft.img=c.toDataURL('image/jpeg',.8);prev()};i.src=r.result};r.readAsDataURL(f)}
function publish(){const txt=$('#ctx').value.trim();if(!txt&&!draft.img)return toast('Write something first');
 S.posts.unshift({id:Date.now(),u:'me',t:Date.now(),txt,g:draft.g,img:draft.img,likes:0,c:[]});save();closeLayer();
 setTimeout(()=>{pos.home=0;if(tab!=='home')tab='home';render();view.scrollTop=0;toast('Posted ✨')},320)}

/* profile edit */
function openEdit(){openSheet(`<div class="sh"><button data-a="close">Cancel</button><span>Edit profile</span><button class="send" data-a="saveprof">Save</button></div><div class="cf"><input id="en" value="${esc(S.name)}" maxlength="24" placeholder="Name"><input id="eb" value="${esc(S.bio)}" maxlength="80" placeholder="Bio"></div>`)}

/* stories */
function openStory(u){S.viewed.includes(u)||S.viewed.push(u);save();sv={u,i:0};story.hidden=false;if(!layer)openLayer('story');showStory()}
function showStory(){const{u,i}=sv,l=ST[u],[e,t]=l[i];clearTimeout(sv.t);
 story.innerHTML=`<div class="sv" style="background:${G[U[u].g]}"><div class="sbars">${l.map((_,k)=>`<i class="${k<i?'d':k===i?'r':''}"><b></b></i>`).join('')}</div><div class="shd">${av(u,34)}<b>${U[u].n}</b><button class="ib" data-a="close" aria-label="Close">${ic('x')}</button></div><span class="big">${e}</span><p>${esc(t)}</p><div class="tap l" data-a="sprev"></div><div class="tap r" data-a="snext"></div></div>`;
 sv.t=setTimeout(()=>stepStory(1),4000)}
function stepStory(d){if(!sv)return;sv.i+=d;if(sv.i<0)sv.i=0;
 if(sv.i>=ST[sv.u].length){const o=S.following.filter(u=>ST[u]),n=o[o.indexOf(sv.u)+1];if(n){S.viewed.includes(n)||S.viewed.push(n);save();sv={u:n,i:0}}else return closeLayer()}
 showStory()}
function hideStory(){if(sv)clearTimeout(sv.t);sv=null;story.hidden=true;story.innerHTML='';if(tab==='home')render(true)}

/* ---------- actions ---------- */
const A={
 tab:el=>go(el.dataset.t),new:openCompose,close:closeLayer,publish,edit:openEdit,
 sw(el){draft.g=+el.dataset.i;document.querySelectorAll('.swb').forEach(b=>b.classList.toggle('on',b===el));prev()},
 saveprof(){S.name=($('#en').value.trim()||'You').slice(0,24);S.bio=$('#eb').value.trim().slice(0,80);save();closeLayer();setTimeout(()=>render(true),320);toast('Profile updated')},
 like(el,id){const p=P(id);p.liked=!p.liked;save();vib();upd(id)},
 dbl(el,id){const t=Date.now(),p=P(id);if(t-lt<320&&lid===id){if(!p.liked){p.liked=true;save();upd(id)}const b=$(`.post[data-id="${id}"] .burst`);b.classList.remove('go');void b.offsetWidth;b.classList.add('go');vib()}lt=t;lid=id},
 save(el,id){const p=P(id);p.saved=!p.saved;save();upd(id);toast(p.saved?'Saved to bookmarks':'Removed from bookmarks')},
 cmt:(el,id)=>openComments(id),gp:(el,id)=>openComments(id),send:(el,id)=>sendComment(id),
 async share(el,id){const p=P(id),d={title:'Pulse',text:`${nm(p.u)}: ${p.txt||'Check out this post'}`,url:location.origin+location.pathname};
  try{if(navigator.share)await navigator.share(d);else{await navigator.clipboard.writeText(d.url);toast('Link copied')}}catch(e){}},
 del(el,id){if(confirm('Delete this post?')){S.posts=S.posts.filter(p=>p.id!==id);save();render(true);toast('Post deleted')}},
 fol(el){const u=el.dataset.u,f=S.following.includes(u);S.following=f?S.following.filter(x=>x!==u):[...S.following,u];save();$('#ex').innerHTML=exBody();vib()},
 story:el=>openStory(el.dataset.u),snext:()=>stepStory(1),sprev:()=>stepStory(-1),
 reset(){if(confirm('Reset all demo data?')){localStorage.removeItem(KEY);location.reload()}},
 hideios(){$('#ios').hidden=true;try{localStorage.setItem('pulse-ios','1')}catch(e){}}
};
document.addEventListener('click',e=>{const el=e.target.closest('[data-a]');if(!el)return;const id=+(el.dataset.id||el.closest('.post')?.dataset.id);A[el.dataset.a]?.(el,id)});
document.addEventListener('input',e=>{if(e.target.id==='q'){query=e.target.value;$('#ex').innerHTML=exBody()}if(e.target.id==='ctx')prev()});
document.addEventListener('change',e=>{if(e.target.id==='file'&&e.target.files[0])pick(e.target.files[0])});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.id==='cin')$('[data-a=send]').click();if(e.key==='Escape')closeLayer()});

/* ---------- simulated live activity ---------- */
function sim(){if(document.hidden)return;const us=Object.keys(U).filter(k=>k!=='me'),u=us[Math.random()*us.length|0],m=S.posts.filter(p=>p.u==='me'),r=Math.random();let x;
 if(r<.5&&m.length){m[0].likes++;x='liked your post'}else if(r<.8&&m.length){m[0].c.push({u,x:'Love this! 🔥',t:Date.now()});x='commented: "Love this! 🔥"'}else x='started following you';
 S.notifs.unshift({u,x,t:Date.now()});S.unread++;if(tab==='activity')S.unread=0;save();toast(`${U[u].n} ${x}`);
 if(tab==='activity')render(true);else if(tab==='home'&&m.length)upd(m[0].id);badge()}
setInterval(sim,22000);

/* ---------- PWA: tabs, install, offline, service worker ---------- */
$('#tabs').innerHTML=[['home','Home','home'],['explore','Explore','search'],['new','New post','plus'],['activity','Activity','bell'],['me','Profile','user']].map(([k,l,i])=>k==='new'?`<button class="nw" data-a="new" aria-label="${l}">${ic(i)}</button>`:`<button data-a="tab" data-t="${k}" aria-label="${l}">${ic(i)}${k==='activity'?'<i class="bdg" id="bdg" hidden></i>':''}</button>`).join('');
const standalone=matchMedia('(display-mode: standalone)').matches||navigator.standalone;
addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;if(!standalone)$('#install').hidden=false});
$('#install').onclick=async()=>{if(!deferred)return;deferred.prompt();await deferred.userChoice;deferred=null;$('#install').hidden=true};
addEventListener('appinstalled',()=>{$('#install').hidden=true;toast('Pulse installed 🎉')});
if(/iphone|ipad|ipod/i.test(navigator.userAgent)&&!standalone&&!localStorage.getItem('pulse-ios'))$('#ios').hidden=false;
const net=()=>{$('#offline').hidden=navigator.onLine};addEventListener('online',net);addEventListener('offline',net);net();
if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(e=>console.warn('SW failed',e)));
render();
if(/action=new/.test(location.search))setTimeout(openCompose,400);
