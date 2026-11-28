/* s5-2 (chat-1to1): экраны «как в родных приложениях» поверх ☰ g3_side (решения пользователя 25.11, «давай» по ★ и развилкам):
   1) ☰: сверху пункты родного агента (Claude: Проекты / Код / По расписанию; облик ChatGPT: Картинки / По расписанию / Настроить / Проекты),
      ниже наши разделы группой «Панель» (Пульт, Мозг, Журнал); Настройки — лист из аватара.
   2) Лист «Настройки» в облике текущего агента: аккаунт, разделы агента, ниже наши общие (Telegram, автопилот, Face ID, Система).
      Push-страницы как в листе модели (g6). Переключатели — те же действия базы ([data-a=nt:*|qon|hap] + save), свои — localStorage g7pf.
   3) Кольцо заполнения контекста в шапке Claude и Codex, тап — half-лист «Контекст».
   4) Экраны: «По расписанию», «Картинки», «Настроить».
   Данные — только чтение: GET /api/hc/s5/{acct,usage,ctx,sched,images,img,custom,vers} (staged-scripts/tv_s5.py).
   Подписи по-русски (развилка 3). */
(function(){
 var D=document,B=D.body,W=window;
 function $i(id){return D.getElementById(id)}
 function st(){return W.HC&&HC.st}
 function E(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
 function ic(n,c){return W.SD3&&SD3.ic?SD3.ic(n,c):''}
 function T(m){try{toast(m)}catch(e){}}
 function RM(){return matchMedia('(prefers-reduced-motion: reduce)').matches}
 function lsg(k,d){try{return W.LS?LS.get(k,d):d}catch(e){return d}}
 function lss(k,v){try{W.LS&&LS.set(k,v)}catch(e){}}
 var KN={hermes:'Hermes',claude:'Claude',codex:'Codex'};
 function kind(){var s=st();return (s&&s.kind)||'hermes'}
 /* ---------- данные ---------- */
 var C={},TTL={acct:3600e3,usage:60e3,sched:60e3,images:120e3,custom:300e3,vers:3600e3,ctx:20e3};
 function url(p){return String(W.API||'').replace(/\/$/,'')+'/api/hc/s5/'+p}
 /* cb зовётся только когда пришёл ответ сети (никогда синхронно) — иначе перерисовка ↔ get по кэшу ошибки уходила в бесконечную рекурсию */
 var CP=lsg('g7c',null)||{};for(var cpk in CP)if(!C[cpk])C[cpk]={t:0,d:CP[cpk]};/*vb5b-1: последний ответ с ПК — сразу, свежий догружается*/
 var CPW=0;function cpPut(p,d){var w=p.split('?')[0];if(!/^(acct|usage|custom|sched|images|vers)$/.test(w)||!d||d.error)return;CP[p]=d;if(!CPW)CPW=setTimeout(function(){CPW=0;lss('g7c',CP)},800)}
 function get(p,cb){var w=p.split('?')[0],c=C[p];if(c&&!c.p&&Date.now()-c.t<(TTL[w]||60e3))return c.d
  if(c&&c.p){c.p.then(function(d){cb&&cb(d)});return c&&c.d}
  var pr=fetch(url(p),{headers:{'X-Init-Data':W.tg?tg.initData:''}}).then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.json()})
   .then(function(d){C[p]={t:Date.now(),d:d};cpPut(p,d);return d}).catch(function(e){C[p]={t:Date.now()-((TTL[w]||60e3)-5e3),d:{error:e.message}};return C[p].d});
  C[p]={t:0,d:c&&c.d,p:pr};pr.then(function(d){cb&&cb(d)});return c&&c.d}
 function have(p){var c=C[p];return c&&c.d&&!c.d.error?c.d:null}
 /* данные или {error} (свежая ошибка) или null (грузится; cb — когда придёт) */
 function need(p,cb){var d=have(p);if(d){var c0=C[p],w0=p.split('?')[0];if(c0&&!c0.p&&Date.now()-c0.t>=(TTL[w0]||60e3))get(p,cb);return d}var c=C[p],w=p.split('?')[0];if(c&&!c.p&&c.d&&c.d.error&&Date.now()-c.t<(TTL[w]||60e3))return {error:c.d.error};get(p,cb);return null}
 function errH(d){return '<div class="sd3none"><b>Не удалось загрузить</b><span>'+E(d.error)+'</span></div>'}
 /* картинки — с подписью initData, поэтому через blob */
 /*vb5b-g5: миниатюры (сервер ужимает до w px), не больше 3 загрузок сразу, одна загрузка на картинку (раньше каждая перерисовка начинала заново)*/
 var IB={},IW={},IQ=[],IN=0;function imgSrc(p,el,w){var key=p+'|'+(w||0);el.dataset.ik=key;if(IB[key]){el.src=IB[key];return}if(IW[key])return;IW[key]=1;IQ.push({p:p,w:w,key:key});imgRun()}
 function imgRun(){while(IN<3&&IQ.length){(function(j){IN++;fetch(url('img?p='+encodeURIComponent(j.p)+(j.w?'&w='+j.w:'')),{headers:{'X-Init-Data':W.tg?tg.initData:''}}).then(function(r){if(!r.ok)throw 0;return r.blob()})
  .then(function(b){IB[j.key]=URL.createObjectURL(b)}).catch(function(){IB[j.key]=''}).then(function(){IN--;delete IW[j.key];[].forEach.call(D.querySelectorAll('img[data-ik]'),function(im){if(im.dataset.ik==j.key){if(IB[j.key])im.src=IB[j.key];else im.classList.add('bad')}});imgRun()})})(IQ.shift())}}
 /* ---------- свои настройки (облик / поведение) ---------- */
 var PF=lsg('g7pf',null)||{};var PD={theme:'system',links:'tg',kbhide:false,ring:true,busy:'steer',fs:17,wrap:true};
 function pf(k){if(k=='theme')return 'system';/*vb5b-2: только как в Telegram*/return PF[k]!=null?PF[k]:PD[k]}
 function pfs(k,v){PF[k]=v;lss('g7pf',PF);applyPF()}
 function applyPF(){var r=D.documentElement;r.style.setProperty('--g7fs',pf('fs')+'px');B.classList.toggle('g7nowrap',!pf('wrap'));B.classList.toggle('g7noring',!pf('ring'));
  var t=pf('theme');if(t!='system')r.dataset.theme=t;else if(W.theme)try{W.theme()}catch(e){}}
 if(typeof W.theme=='function'&&!W.theme.g7){var th0=W.theme;W.theme=function(){var r=th0.apply(this,arguments),t=pf('theme');if(t!='system')D.documentElement.dataset.theme=t;return r};W.theme.g7=1}
 /* ссылки: в Telegram (Instant View) или во внешнем браузере */
 D.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href^="http"]');if(!a||!W.tg||!tg.openLink)return;e.preventDefault();
  try{tg.openLink(a.href,pf('links')=='tg'?{try_instant_view:true}:{})}catch(x){W.open(a.href,'_blank')}},true);
 /* клавиатура после ↑ */
 D.addEventListener('click',function(e){if(!pf('kbhide'))return;var g=e.target.closest&&e.target.closest('[data-g3=go],[data-cl=go],#hcsend');if(!g)return;setTimeout(function(){var a=D.activeElement;if(a&&a.blur&&a.tagName=='TEXTAREA')a.blur()},60)},true);
 /* ---------- действия базы ---------- */
 function baseA(a,x){var d=D.createElement('i');d.dataset.a=a;if(x!=null)d.dataset.x=x;d.style.display='none';B.appendChild(d);d.click();d.remove()}
 var SVT=0;function baseSave(){clearTimeout(SVT);SVT=setTimeout(function(){try{if(W.dirty&&!W.dirty())return}catch(e){}baseA('save')},500)}
 function Ev(){return W.E||{}}
 /* ---------- 1. меню ☰ ---------- */
 function nav(sty){var our=sty=='g'?[['-','','Панель'],['home','g_remote','Пульт'],['br','g_library','Мозг'],['j','g_bubble','Журнал']]
   :[['-','','Панель'],['home','s_remote','Пульт'],['br','c_artifacts','Мозг'],['j','c_clock','Журнал']];
  var nat=sty=='g'?[['g7:img','g_images','Картинки'],['g7:sched','g_sched','По расписанию'],['g7:cust','g_custom','Настроить'],['prj','g_projects','Проекты']]
   :[['prj','c_projects','Проекты'],['g7:code','c_code','Код'],['g7:sched','c_sched','По расписанию']];
  return nat.concat(our)}
 /* ---------- 4. полноэкранные страницы (облик «Недавних» g3_side) ---------- */
 var PG={k:'',el:null};
 function pgEl(){var r=$i('g7pg');if(!r){r=D.createElement('div');r.id='g7pg';B.appendChild(r)}return r}
 function pgHead(t,right){return '<div class="sd3rh"><div class="sd3hb" data-sd="g7pgx" role="button" aria-label="Назад">'+backIc()+'</div><div class="sd3rt">'+E(t)+'</div>'+(right||'')+'</div>'}
 function backIc(){return '<svg width="11" height="18" viewBox="0 0 11 18" aria-hidden="true"><path d="M9 1.6 1.9 9 9 16.4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'}
 function pgOpen(k,o){o=o||{};PG.k=k;var r=pgEl(),sty=W.SD3?SD3.sty():'g';r.className='sd3rc on g7pg '+sty;pgPaint();
  if(W.SD3)SD3.close({instant:true});
  if(r.animate&&!RM()&&!o.instant)r.animate([{transform:'translateX(100%)'},{transform:'none'}],{duration:380,easing:'cubic-bezier(.32,.72,0,1)'})}
 function pgClose(instant){var r=$i('g7pg');if(!r||!/\bon\b/.test(r.className))return;PG.k='';var off=function(){r.className='sd3rc g7pg';r.innerHTML=''};if(instant||RM()||!r.animate){off();return}
  var a=r.animate([{transform:'none'},{transform:'translateX(100%)'}],{duration:260,easing:'cubic-bezier(.4,0,1,1)'});a.onfinish=function(){if(!PG.k)off()}}
 function pgPaint(){var r=$i('g7pg');if(!r||!PG.k)return;var sc=r.querySelector('.sd3sc'),top=sc?sc.scrollTop:0;r.innerHTML=PAGES[PG.k]();var s2=r.querySelector('.sd3sc');if(s2)s2.scrollTop=top;
  [].forEach.call(r.querySelectorAll('img[data-p]'),function(im){imgSrc(im.dataset.p,im,360)})}
 function ago(ts){if(!ts)return '';var m=Math.round((Date.now()/1000-ts)/60),f=m<0;m=Math.abs(m);var s=m<1?'сейчас':m<60?m+' мин':m<1440?Math.floor(m/60)+' ч':Math.floor(m/1440)+' дн';return m<1?s:(f?'через '+s:s+' назад')}
 function schedRow(x){var dot=x.on?(x.st&&x.st!='ok'&&x.st!='active'?'warn':'ok'):'off';
  return '<div class="g7task"><div class="g7th"><i class="g7dot '+dot+'"></i><b>'+E(x.t)+'</b><em>'+(x.on?'Активна':'На паузе')+'</em></div>'+
   (x.d?'<p>'+E(x.d)+'</p>':'')+'<small>'+E(x.sch||'')+(x.next?' · следующий '+E(ago(x.next)):'')+(x.last?' · последний '+E(ago(x.last)):'')+(x.runs?' · прогонов '+x.runs:'')+'</small></div>'}
 var PAGES={
  sched:function(){var d=need('sched',pgPaint),k=kind(),h='<div class="sd3sc g7sc">';
   if(!d)h+='<div class="sd3none"><b>Загружаю…</b></div>';else if(d.error)h+=errH(d);
   else{var L=d.s||[],mine=L.filter(function(x){return x.k==k}),oth=L.filter(function(x){return x.k!=k});
    h+='<div class="g7lead">Задачи, которые '+E(KN[k])+' выполняет сам по расписанию.'+(k=='hermes'?' Пауза и запуск — в «Журнале».':' Создать и изменить — в приложении на ПК.')+'</div>';
    h+=(mine.length?mine.map(schedRow).join(''):'<div class="g7empty">У '+E(KN[k])+' задач нет</div>');
    /*vb7b-5: только задачи своего агента*/}
   return h+'</div>'+pgHead('По расписанию',k=='hermes'?'<div class="sd3hb dots" data-sd="g7tab" data-x="j" role="button" aria-label="Журнал">'+ic('g_sched')+'</div>':'')},
  img:function(){var d=need('images?n=60',pgPaint),h='<div class="sd3sc g7sc">';
   if(!d)h+='<div class="sd3none"><b>Загружаю…</b></div>';else if(d.error)h+=errH(d);
   else if(!(d.i||[]).length)h+='<div class="sd3none"><b>Картинок пока нет</b><span>Попроси Codex нарисовать что-нибудь.</span></div>';
   else h+='<div class="g7grid">'+d.i.map(function(x,i){return '<div class="g7cell" data-sd="g7img" data-i="'+i+'"><img alt="" data-p="'+E(x.p)+'"></div>'}).join('')+'</div>';
   return h+'</div>'+pgHead('Картинки')+'<div class="sd3sb g7desc"><input id="g7dq" placeholder="Опиши картинку" enterkeyhint="send" autocomplete="off"><i class="g7go" data-sd="g7draw" role="button" aria-label="Нарисовать">↑</i></div>'},
  cust:function(){var k=kind(),p='custom?k='+k,d=need(p,pgPaint),h='<div class="sd3sc g7sc">';
   if(!d)h+='<div class="sd3none"><b>Загружаю…</b></div>';else if(d.error)h+=errH(d);
   else{h+='<div class="sd3sh first">Инструкции</div><div class="sd3card g7txt"><small>'+E(d.inst.t)+'</small><pre>'+E(d.inst.v||'— пусто —')+'</pre></div>'+
    '<div class="sd3sh">Память</div><div class="sd3card g7txt"><small>'+E(d.mem.t)+'</small><pre>'+E(d.mem.v||'— пусто —')+'</pre></div>'+
    (d.mcp.length?'<div class="sd3sh">Подключения (MCP)</div><div class="sd3card">'+d.mcp.map(function(x){return '<div class="g7li"><i class="g7dot ok"></i>'+E(x)+'</div>'}).join('')+'</div>':'')+
    (d.plug.length?'<div class="sd3sh">'+(k=='hermes'?'Навыки':'Плагины')+' · '+d.plug.length+'</div><div class="sd3card">'+d.plug.map(function(x){return '<div class="g7li">'+E(x)+'</div>'}).join('')+'</div>':'')+
    '<div class="g7foot">Только просмотр. Править — в файлах на ПК или попроси агента в чате.</div>'}
   return h+'</div>'+pgHead('Настроить')}
 };
 function imgView(i){var d=have('images?n=60'),x=d&&d.i[i];if(!x)return;var v=D.createElement('div');v.id='g7iv';v.innerHTML='<img alt="" data-p="'+E(x.p)+'"><div class="g7ivb">'+
   (x.tid?'<i data-sd="g7ichat" data-id="'+E(x.tid)+'">Открыть чат</i>':'')+'<i data-sd="g7ivx">Закрыть</i></div><small>'+E(x.n)+' · '+E(ago(x.ts))+'</small>';B.appendChild(v);imgSrc(x.p,v.querySelector('img'));
  v.addEventListener('click',function(e){var a=e.target.closest('[data-sd]');if(a&&a.dataset.sd=='g7ichat'){v.remove();pgClose(true);if(W.SD3)SD3.openChat('codex',a.dataset.id)}else if(!a||a.dataset.sd=='g7ivx')v.remove()})}
 function draw(){var q=$i('g7dq'),t=q&&q.value.trim();if(!t)return;pgClose(true);if(W.SD3)SD3.newChat('codex');
  var s=st();if(s)s.draft='Нарисуй картинку: '+t;setTimeout(function(){var ta=$i('hcin');if(ta){ta.value='Нарисуй картинку: '+t;ta.dispatchEvent(new Event('input',{bubbles:true}));ta.focus()}},350)}
 /* ---------- 2. лист «Настройки» (s5-3: облик 1:1 по кадрам B1/B2 — спеки s4/ref/B1 §7, B2 §2 и §4) ----------
    Claude: лист #141414, карточки #1D1D1D r26, строки 51.9 pt, значки — шрифт Anthropicons #CCCAC2, текст 17 белый, значение #9998A1,
    шеврон #898982, заголовки секций 15.5 #969693, сноски 13 #C3C3C0, тумблер 62×28 #4A8BE0 с ручкой-пилюлей 36×23, выход розовым #FFB1BB.
    ChatGPT (Codex/Hermes): лист #000, карточки #1E1E1E r25.8, строки 54.2 pt, значки ChatGPT (SDV) белые, шеврон #575754,
    промо-карточка с белой пилюлей, «Аккаунт» с розовым аватаром, тумблер 63×28 #2AC94E, выход красным #FF453A. */
 var SS={stack:[]};
 function isCl(){return kind()=='claude'}
 /* значки Claude — глифы шрифта Anthropicons (из Claude Desktop); у ChatGPT — свои SVG из кадров */
 var AI={user:'E104',bill:'E05F',usage:'E130',bell:'E0B4',clock:'E0B2',shield:'E0A3',link:'E099',caps:'F079',code:'E049',plug:'E055',voice:'E108',
  ext:'E082',hap:'E087',out:'E0EB',plus:'E001',x:'E10F',info:'E08E',chev:'E02A',back:'E029',ud:'E02C',check:'E03B',refresh:'E11D',gear:'E0D6',
  brain:'E0A8',q:'E088',auto:'E098',arch:'E008',folder:'E072',lock:'E0A1',img:'E08C',down:'E027'};
 function ai(n,c){return '<i class="g7ai'+(c?' '+c:'')+'" aria-hidden="true">&#x'+(AI[n]||'E001')+';</i>'}
 var GI={user:'@av',bill:'s_data',usage:'s_data',bell:'s_bell',clock:'s_gear',shield:'s_shield',lock:'s_lock',voice:'s_voice',gear:'s_gear',remote:'s_remote',
  data:'s_data',storage:'s_storage',cust:'s_custom',out:'s_logout',plus:'s_plus',q:'@q',brain:'s_storage',auto:'@auto'};/*vb7b: свои значки у «Вопросов» и «Автопилота»*/
function svgI(p){return '<svg class="vb7ic" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>'}
var VI={'@q':svgI('<path d="M4.2 4.5h11.6a1.7 1.7 0 0 1 1.7 1.7v6.9a1.7 1.7 0 0 1-1.7 1.7H9.4l-3.9 3v-3H4.2a1.7 1.7 0 0 1-1.7-1.7V6.2a1.7 1.7 0 0 1 1.7-1.7z"/><path d="M8.4 8.1a1.7 1.7 0 1 1 2.3 1.6c-.5.2-.7.6-.7 1.1"/><circle cx="10" cy="12.7" r=".25"/>'),'@auto':svgI('<path d="M10 2.8l1.7 4.6 4.6 1.7-4.6 1.7L10 15.4l-1.7-4.6-4.6-1.7 4.6-1.7z"/><path d="M15.8 13.6v3.6M14 15.4h3.6"/>')};
 function rowIcon(n){if(!n)return '';if(isCl())return ai(n);var g=GI[n]||n;if(VI[g])return VI[g];return g=='@av'?'':ic(g)}
 function tg2(on,a,x){return '<i class="g7sw'+(on?' on':'')+'" data-sd="g7sw" data-a="'+a+'"'+(x!=null?' data-x="'+E(x)+'"':'')+' role="switch" aria-checked="'+!!on+'"></i>'}
 /* строка: o.ic — значок, o.go — push-страница, o.act/o.x — действие, o.em — значение справа, o.dd — выпадающий (⌃⌄), o.sw — тумблер, o.sub — подпись */
 /* vb7b-1: SF chevron.up.chevron.down одной фигурой (9×14 pt), толщина линии как у значков шапки агента */
function udIc(){return '<svg class="vb7ud" width="10" height="15" viewBox="0 0 10 15" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="'+(isCl()?1.7:2)+'" stroke-linecap="round" stroke-linejoin="round"><path d="M1.9 5.4 5 2.2l3.1 3.2M1.9 9.6 5 12.8l3.1-3.2"/></svg>'}
function row(t,o){o=o||{};var cl=isCl(),chev=o.go||o.chev,tail='';
  if(o.tm)tail='<em class="vb7tm">'+E(o.em||'')+'</em>';else if(o.dd)tail='<em class="dd">'+E(o.em||'')+udIc()+'</em>';else if(o.em!=null&&o.em!=='')tail='<em>'+E(o.em)+'</em>';
  if(o.sw)tail+=o.sw;if(chev&&!o.dd)tail+=cl?ai('chev','chv'):ic('s_chev','sd3chv');
  return '<div class="g7r'+(o.ic?'':' noic')+(o.sub?' two':'')+(o.red?' red':'')+(o.blue?' blue':'')+(!o.go&&!o.act&&!o.sw&&!chev?' vb7ro':'')+'"'+(o.go?' data-sd="g7set" data-x="'+o.go+'"':o.act?' data-sd="'+o.act+'"'+(o.x?' data-x="'+E(o.x)+'"':''):'')+'>'+
   (o.ic?'<span class="g7ri">'+rowIcon(o.ic)+'</span>':'')+'<div class="g7rt"><b>'+E(t)+'</b>'+(o.sub?'<span>'+E(o.sub)+'</span>':'')+'</div>'+tail+'</div>'}
 function card(rows,cls){return '<div class="g7card'+(cls?' '+cls:'')+'">'+rows.filter(Boolean).join('')+'</div>'}
 function sec(t){return '<div class="g7sec">'+E(t)+'</div>'}
 function foot(t){return '<div class="g7foot">'+E(t)+'</div>'}
 function plan(a,k){return a.plan?(k=='claude'&&!/claude/i.test(a.plan)?a.plan:a.plan):''}
 function ini(n){var p=String(n||'Я').trim().split(/\s+/);return ((p[0]||'')[0]||'Я').toUpperCase()+(isCl()?'':((p[1]||'')[0]||'').toUpperCase())}
 function themeName(t){return {system:'Системное',dark:'Тёмное',light:'Светлое'}[t]}
 function linksName(){return pf('links')=='tg'?'В Telegram':'В браузере'}
 /* Claude Settings: аккаунт, «Аккаунт», «Приложение», «Оформление» (плитки прямо в листе), «Панель», выход */
 function clMain(){var a=need('acct?k=claude',setRepaint)||{},e=Ev(),nOn=e.notify?Object.keys(e.notify).filter(function(x){return e.notify[x]}).length:0;
  return '<div class="g7card g7acc"><div class="g7accr" data-sd="g7set" data-x="acct"><i class="g7av">'+E(ini(a.name))+'</i><div><b>Личный</b><span>'+E([a.mail,plan(a,'claude')].filter(Boolean).join(' · ')||'Claude')+'</span></div></div>'+'</div>'+/*vb5b-10*/
   sec('Аккаунт')+card([row('Профиль',{ic:'user',go:'prof'}),row('Тариф',{ic:'bill',em:a.plan?a.plan:'—'})/*vb7b-6: без перехода в «Аккаунт»*/,row('Расход',{ic:'usage',go:'usage'}),
    row('Уведомления',{ic:'bell',go:'notif'}),row('Время и фокус',{ic:'clock',go:'focus'})])+
   sec('Приложение')+card([row('Возможности',{ic:'caps',go:'perm'}),row('Claude Code',{ic:'code',go:'code'}),row('Подключения',{ic:'plug',go:'conn'}),
    row('Голос и диктовка',{ic:'voice',go:'voice'}),row('Открывать ссылки',{ic:'ext',act:'g7menu',x:'links',em:linksName(),dd:1}),
    row('Вибро',{ic:'hap',sw:tg2(W.U&&U.haptics!==false,'hap')})])+foot('Ссылки из ответов агента открываются так же.')+/*vb5b-2: Оформление убрано*/
   sec('Панель')+card([row('Автопилот и агенты',{ic:'auto',act:'g7tab',x:'set',chev:1}),row('Система',{ic:'gear',act:'g7tab',x:'sys',chev:1}),row('Вопросы',{ic:'q',go:'q',em:qN()})])+
   card([row('Остановить всё',{ic:'out',act:'stopall',red:1})],'g7out')+'<div class="sd3ver">Hermes Control · v'+E(verS())+'</div>'}
 /* ChatGPT Settings: промо-карточка, «Аккаунт» + «Добавить аккаунт», «Настроить», разделы, «Панель», выход */
 function gpMain(){var k=kind(),a=need('acct?k='+k,setRepaint)||{},nm=a.name||'';/*vb5b-1: без «Codex» вместо имени*/
  return '<div class="g7card g7promo"><div><b>Всё под контролем</b><span>Агенты, службы и связь с ПК — в «Системе».</span></div><i data-sd="g7tab" data-x="sys">Система</i></div>'+
   card(['<div class="g7r" data-sd="g7set" data-x="acct"><span class="g7ri"><i class="g7gav">'+E(ini(nm||KN[k]))+'</i></span><div class="g7rt"><b>Аккаунт</b></div><em>'+E((a.mail||'').split('@')[0]||nm)+'</em>'+ic('s_chev','sd3chv')+'</div>'])+/*vb5b-10*/
   card([row('Настроить '+KN[k],{ic:'cust',sub:k=='hermes'?'Инструкции, память, навыки':'Инструкции, память, плагины',go:'cust'})])+
   card([row('Общие',{ic:'gear',go:'gen'}),row('Уведомления',{ic:'bell',go:'notif'}),row('Голос',{ic:'voice',go:'voice'}),row('Безопасность и вход',{ic:'lock',go:'sec'}),
    row('Удалённое управление',{ic:'remote',go:'rc'}),row('Расход',{ic:'storage',go:'usage'}),row('Данные',{ic:'data',go:'data'})])+
   card([row('Автопилот и агенты',{ic:'auto',act:'g7tab',x:'set',chev:1}),row('Вопросы',{ic:'q',go:'q',em:qN()})])+
   card([row('Остановить всё',{ic:'out',act:'stopall',red:1})],'g7out')+'<div class="sd3ver">Hermes Control · v'+E(verS())+'</div>'}
 function mainBody(){return isCl()?clMain():gpMain()}
 /* «Оформление» Claude: 3 плитки-миниатюры (светлая / тёмная / системная по диагонали), оранжевая точка, выбранная — синяя рамка */
 function tiles(){var t=pf('theme');function tl(v){return '<div class="g7tile'+(t==v?' on':'')+'" data-sd="g7pf" data-a="theme" data-x="'+v+'"><i class="g7mini '+v+'"><s></s><s></s><u></u></i><b>'+themeName(v)+'</b></div>'}
  return '<div class="g7card g7tiles">'+tl('light')+tl('dark')+tl('system')+'</div>'}
 /* Расход (Usage Claude: «Текущая сессия 6 % занято», полоса 9 pt #2568C7 на #031C3C, сноска под полосой) */
 function bar(t,p,sub,old){p=Math.max(0,Math.min(100,+p||0));return '<div class="g7use'+(old?' vb7cst':'')+'"><div><b>'+E(t)+'</b><em>'+Math.round(p)+'% занято</em></div><i><s style="width:'+Math.max(p,1.6)+'%"></s></i>'+(sub?'<small>'+E(sub)+'</small>':'')+'</div>'}
 /* vb7c-1 (Л1, Ц2–Ц4): «Расход» агента — только его лимиты; время сброса; снимок Claude старше 5 ч — серым «устарело» (вариант (а), Anthropic не спрашиваем) */
 function inT(ts){var s=(+ts||0)-Date.now()/1000,m=Math.round(s/60),h=Math.floor(m%1440/60);return m<1?'меньше минуты':m<60?m+' мин':m<1440?Math.floor(m/60)+' ч'+(m%60?' '+m%60+' мин':''):Math.floor(m/1440)+' дн'+(h?' '+h+' ч':'')}
 function rst(ts){return !ts?'':ts*1000<=Date.now()?'Окно уже сброшено':'Сброс через '+inT(ts)}
 function clOld(c){return !c||!c.t||Date.now()/1000-c.t>5*3600}
 function clSrc(c){return c&&c.src=='desktop'?'Claude Desktop':'Claude Code'}
 function clLim(c){var o=clOld(c),up=c.t?'обновлено '+ago(c.t):'',ol='Устарело'+(up?' ('+up+')':'')+' · обновится, когда Claude ответит';
  return card([bar('Текущая сессия',c.five,o?ol:[rst(c.five_reset),up].filter(Boolean).join(' · '),o),bar('Неделя · все модели',c.week,o?ol:rst(c.week_reset),o)])}
 var PLN={free:'Free',go:'Go',plus:'Plus',pro:'Pro',prolite:'Pro Lite',team:'Team',business:'Business',enterprise:'Enterprise',edu:'Edu'};
 function cxPlan(x){var p=String(x&&x.plan||'');return PLN[p.toLowerCase()]||(p?p.charAt(0).toUpperCase()+p.slice(1):'')}
 function cxWin(w){return !w?'':w.min>=10080?'Неделя':'Окно '+Math.round(w.min/60)+' ч'}
 function cxT(x){return !x||!x.t?0:typeof x.t=='number'?x.t:(Date.parse(x.t)||0)/1000}
 function cxLim(x){var t=cxT(x),up=t?'обновлено '+ago(t):'';return card([x.primary?bar(cxWin(x.primary),x.primary.pct,[rst(x.primary.reset),up].filter(Boolean).join(' · ')):'',x.secondary?bar(cxWin(x.secondary),x.secondary.pct,rst(x.secondary.reset)):''])}
 function cx5(x){return [x.primary,x.secondary].some(function(w){return w&&w.min<10080})}
 function fmtM(n){n=+n||0;return n>=1e5?(n/1e6).toFixed(1).replace('.',',')+' млн':n>=1e3?Math.round(n/1e3)+' тыс.':String(n)}
 function track(u,k){var c=u&&u.claude,x=u&&u.codex,h=u&&u.hermes,m=-1,old=false;k=k||kind();
  if(k=='codex'||k=='hermes'&&h&&h.sub=='codex'){if(x)m=Math.max(x.primary?+x.primary.pct||0:0,x.secondary?+x.secondary.pct||0:0)}
  else if(k=='claude'||k=='hermes'&&h&&h.sub=='claude'){if(c){m=Math.max(+c.five||0,+c.week||0);old=clOld(c)}}
  if(m<0)return '';var s=m>=90?'Лимит почти исчерпан.':m>=70?'Расход высокий — следи за лимитом.':'Всё в порядке: лимитов хватает с запасом.';
  return old?'Данные о лимите устарели. По последнему снимку: '+s.charAt(0).toLowerCase()+s.slice(1):s}
 /* лимиты агента (у Hermes — подписки, на которой он работает) */
 function limBlk(k,u){var c=u.claude,x=u.codex,hm=u.hermes,sub=hm&&hm.sub;
  if(k=='claude')return c?sec('Лимиты тарифа')+clLim(c):'';
  if(k=='codex')return x?sec('Codex'+(cxPlan(x)?' · '+cxPlan(x):''))+cxLim(x)+(cx5(x)?'':foot('Окна 5 ч у тарифа нет — только недельный лимит.')):'';
  if(sub=='claude'&&c)return sec('Подписка Claude · общая с Claude')+clLim(c);
  if(sub=='codex'&&x)return sec('Подписка Codex · общая с Codex')+cxLim(x);return ''}
 /* vb7c-5 (Л4): токены Hermes — один расчёт tv_s5._htok: расписание (кликер тем же фильтром, что «Ещё») + чаты из state.db */
 function hTok(hm){if(!hm)return '';if(hm.v!=2)return sec('Hermes')+card([row('Токены расписания за сутки',{em:fmtM(hm.day)})]);
  var o=hm.chat_other&&hm.other_prov&&hm.other_prov.length?'из них '+fmtM(hm.chat_other)+' — через провайдера '+hm.other_prov.join(', '):'';
  return sec('Токены Hermes за сутки')+card([row('Всего',{em:fmtM(hm.day)}),row('По расписанию',{em:fmtM(hm.cron),sub:'из них кликер '+fmtM(hm.clk)+' — как в «Ещё»'}),row('Чаты',{em:fmtM(hm.chat),sub:o})])+
   foot('Токены за последние 24 ч: промпт каждого ответа модели (с кэшем) плюс сам ответ.')}
 function usageBody(){var u=need('usage',setRepaint);if(!u)return '<div class="g7ld">Загружаю…</div>';if(u.error)return errH(u);var k=kind(),c=u.claude,x=u.codex,hm=u.hermes,sub=hm&&hm.sub,tr=track(u,k);
  var lead=(k=='hermes'&&sub?'Hermes работает на подписке '+(sub=='claude'?'Claude':'Codex')+'. ':'')+tr,lim=limBlk(k,u),
   src=(k=='claude'||sub=='claude')&&c?'Лимиты — по данным '+clSrc(c)+': снимок обновляется, когда Claude работает.':(k=='codex'||sub=='codex')&&x?'Лимиты приходят с каждым ответом Codex.':'';
  if(!lim&&k!='hermes')lim=foot('Нет данных о лимитах '+KN[k]+': они появятся после ответа агента.');
  return (lead?'<div class="g7lead">'+E(lead)+'</div>':'')+lim+(src?foot(src):'')+(k=='hermes'?hTok(hm):'')+card([row('Расход всех агентов',{go:'usall'})])}
 function usallBody(){var u=need('usage',setRepaint);if(!u)return '<div class="g7ld">Загружаю…</div>';if(u.error)return errH(u);var c=u.claude,x=u.codex,hm=u.hermes;
  return (c?sec('Claude')+clLim(c)+foot('По данным '+clSrc(c)+'.'):'')+(x?sec('Codex'+(cxPlan(x)?' · '+cxPlan(x):''))+cxLim(x)+(cx5(x)?'':foot('Окна 5 ч у тарифа нет — только недельный лимит.')):'')+
   (hm&&hm.sub?foot('Hermes работает на подписке '+(hm.sub=='claude'?'Claude':'Codex')+': его расход входит в эти лимиты.'):'')+hTok(hm)}
 function notifBody(){var e=Ev(),cl=isCl(),N=[['question','Вопросы агентов','Когда агент ждёт твоего ответа или разрешения.'],['start','Начат новый шаг','Когда автопилот нажал Start.'],
   ['hang','Агент завис','Когда в чате ничего не меняется дольше порога.'],['fail','Что-то сломалось','Агент не отвечает, клик не прошёл.']];
  return card(N.slice(0,2).map(function(n){return row(n[1],{sub:cl?n[2]:'',sw:tg2(e.notify&&e.notify[n[0]],'nt:'+n[0])})}))+card(N.slice(2).map(function(n){return row(n[1],{sub:cl?n[2]:'',sw:tg2(e.notify&&e.notify[n[0]],'nt:'+n[0])})}))+foot('Уведомления приходят в Telegram от бота Hermes.')}
 function focusBody(){var e=Ev(),q=e.quiet||{},s=e.sched||{};
  return sec('Тихие часы')+card([row('Ночью копить, утром сводка',{sw:tg2(q.on,'qon')}),q.on?'<div class="vb7qx">'+row('С',{em:q.from,act:'g7menu',x:'qfrom',tm:1})+row('До',{em:q.to,act:'g7menu',x:'qto',tm:1})+row('Вопросы всё равно присылать',{sw:tg2(q.q,'qq')})+'</div>':''])+
   sec('Когда работать')+card([row('Автопилот',{em:s.on?(s.from+'–'+s.to):'круглосуточно',act:'g7tab',x:'set',chev:1})])+foot('Окно работы и правила автопилота — в «Автопилот и агенты».')}
 function lookBody(){return tiles()+foot('«Системное» — как в Telegram.')}
 function codeBody(){return sec('Оформление')+card(['<div class="g7slide"><small>A</small><input type="range" min="14" max="21" step="1" value="'+pf('fs')+'" data-g7r="fs"><big>A</big></div>',row('Размер текста ленты',{em:pf('fs')+' pt'})])+
   sec('Код')+card([row('Переносить длинные строки',{sw:tg2(pf('wrap'),'pf','wrap')})])}
 function rcBody(){return sec('Поле ввода')+card([row('Скрывать клавиатуру после ↑',{sw:tg2(pf('kbhide'),'pf','kbhide')}),row('Заполнение контекста',{sw:tg2(pf('ring'),'pf','ring')}),
   row('Если агент занят',{em:pf('busy')=='steer'?'Вмешаться':'В очередь',act:'g7menu',x:'busy',dd:1})])+foot('«Вмешаться» — сообщение уходит сразу, агент читает его по ходу. «В очередь» — после конца хода.')+
   sec('Поведение')+card([row('Переносить строки кода',{sw:tg2(pf('wrap'),'pf','wrap')})])}
 function voiceBody(){return sec('Диктовка')+card([row('Язык распознавания',{em:'Авто'})])/*vb5b-5*/+foot('Голосового режима с ответом голосом в панели нет: агенты отвечают текстом.')}
 function secBody(){return sec('Панель')+card([row('Face ID',{sub:'Вход в панель и опасные действия',sw:tg2(W.U&&U.biolock,'bio')})])+foot('Вход в аккаунт '+KN[kind()]+' — в приложении на ПК.')}
 function genBody(){var t=pf('theme');return card([row('Открывать ссылки',{em:linksName(),act:'g7menu',x:'links',dd:1})])+
   card([row('Вибро',{sw:tg2(W.U&&U.haptics!==false,'hap')}),row('Размер текста ленты',{go:'code',em:pf('fs')+' pt'})])}
 function dataBody(){return sec('История чатов')+card([row('Все сессии по папкам',{act:'g7all',chev:1})])/*vb5b-4*/+foot('«Удалить все чаты» нет намеренно: это необратимо.')}
 function connBody(){var d=need('custom?k=claude',setRepaint);if(!d)return '<div class="g7ld">Загружаю…</div>';if(d.error)return errH(d);
  return (d.mcp.length?card(d.mcp.map(function(x){return row(x,{ic:'plug',em:'подключено'})})):foot('Подключений нет'))+foot('Список из ~/.claude.json. Подключать — в Claude на ПК.')}
 function profBody(){var d=need('custom?k=claude',setRepaint),a=have('acct?k=claude')||{};if(!d)return '<div class="g7ld">Загружаю…</div>';if(d.error)return errH(d);
  return '<div class="g7bigav"><i>'+E(ini(a.name))+'</i></div>'+card([row('Полное имя',{em:a.name||'—'}),row('Почта',{em:a.mail||'—'})])+
   sec('Инструкции')+'<div class="g7card g7txt"><pre>'+E(d.inst.v||'— пусто —')+'</pre></div>'+foot('Файл '+d.inst.t+'. Только просмотр.')}
 function permBody(){return sec('Доступ к инструментам')+card([row('Как на ПК',{sub:'Режим разрешений из настроек Claude Code',sw:'<i class="g7ck">'+ai('check')+'</i>'}),row('Спрашивать в панели',{sub:'Разрешить / Отклонить карточкой'})])+foot('Права для одного чата — в меню ••• чата.')}
 function acctBody(){var k=kind(),a=need('acct?k='+k,setRepaint);if(!a)return '<div class="g7ld">Загружаю…</div>';if(a.error)return errH(a);/*vb5b-10*/
  var L=[a.name?row('Имя',{em:a.name}):'',a.mail?row('Почта',{em:a.mail}):'',a.plan?row('Тариф',{em:a.plan}):''].filter(Boolean);if(!L.length)L=[row(KN[k],{em:'вход на ПК'})];return card(L)+foot('Только чтение. Сменить аккаунт или тариф — в '+KN[k]+' на ПК.')}
 /* vb7b-3: «Настроить» Codex/Hermes и «Вопросы» — подстраницы листа (не страница поверх чата / не Пульт) */
function custBody(){var k=kind(),d=need('custom?k='+k,setRepaint);if(!d)return '<div class="g7ld">Загружаю…</div>';if(d.error)return errH(d);
 return sec('Инструкции')+'<div class="g7card g7txt"><small>'+E(d.inst.t)+'</small><pre>'+E(d.inst.v||'— пусто —')+'</pre></div>'+sec('Память')+'<div class="g7card g7txt"><small>'+E(d.mem.t)+'</small><pre>'+E(d.mem.v||'— пусто —')+'</pre></div>'+
  (d.mcp.length?sec('Подключения (MCP)')+card(d.mcp.map(function(x){return row(x,{em:'подключено'})})):'')+(d.plug.length?sec((k=='hermes'?'Навыки':'Плагины')+' · '+d.plug.length)+card(d.plug.map(function(x){return row(x)})):'')+
  foot('Только просмотр. Править — в файлах на ПК или попроси агента в чате.')}
function qList(){return (W.S&&W.S.pend)||[]}
function qN(){var n=qList().length;return n?String(n):''}
function qBody(){var P=qList();if(!P.length)return '<div class="sd3none"><b>Вопросов нет</b><span>Когда агент спросит, карточка придёт в Telegram и появится в чате.</span></div>';
 return card(P.map(function(q){return row(String(q.q||q.text||q.t||'Вопрос').slice(0,90),{sub:KN[q.ag||'claude']+(q.perm?' · разрешение':'')})}))+card([row('Ответить на Пульте',{act:'g7tab',x:'q',chev:1})])+foot('Ответ уходит агенту сразу.')}
var SP={usage:['Расход',usageBody],usall:['Расход всех агентов',usallBody],notif:['Уведомления',notifBody],focus:['Время и фокус',focusBody],look:['Оформление',lookBody],code:['Claude Code',codeBody],rc:['Удалённое управление',rcBody],
  voice:['Голос и диктовка',voiceBody],sec:['Безопасность и вход',secBody],gen:['Общие',genBody],data:['Данные',dataBody],conn:['Подключения',connBody],prof:['Профиль',profBody],perm:['Возможности',permBody],acct:['Аккаунт',acctBody],cust:['Настроить',custBody],q:['Вопросы',qBody]};
 function hb(sd,lbl,inner,cls){return '<div class="g7hb'+(cls?' '+cls:'')+'" data-sd="'+sd+'" role="button" aria-label="'+lbl+'">'+inner+'</div>'}
 function setHead(){var back=SS.stack.length>0,cl=isCl(),top=SS.stack[SS.stack.length-1],t=back?SP[top][0]:'Настройки';
  if(!cl&&top=='voice')t='Голос';if(!cl&&top=='code')t='Текст и код';/*vb5b-3*/
  return '<div class="g7sh">'+(back?hb('g7setb','Назад',cl?ai('back'):backIc()):hb('setx','Закрыть',hic('x',cl)))+'<div class="g7st">'+E(t)+'</div>'+
   (back?(top=='usage'||top=='usall'?cap2(cl):''):hb('info','О панели',hic('info',cl),'r'))+'</div>'}
 /* vb6h: значки шапок листов — одна сетка 20×20, одна толщина линии (Claude 1.7, ChatGPT 2); раньше ✕/⟳/ⓘ были глифами
    разных шрифтов (Anthropicons / OpenAI Sans) разного размера и веса, а «i» у ChatGPT — просто буквой: выглядело криво. */
 function hic(n,cl){var P={x:'M5 5l10 10M15 5L5 15',refresh:'M16.2 10.4a6.2 6.2 0 1 1-1.9-4.6M16.4 3.6v3.6h-3.6'};
  var d=n=='info'?'<circle cx="10" cy="10" r="7.6"/><path d="M10 9.2v4.8"/><circle cx="10" cy="6.5" r=".35" stroke-width="1.6"/>':'<path d="'+P[n]+'"/>';
  return '<svg class="g7hi" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="'+(cl?1.7:2)+'" stroke-linecap="round" stroke-linejoin="round">'+d+'</svg>'}
 /* капсула [⟳ | i] как у Usage Claude */
 function cap2(cl){return '<div class="g7cap r"><i data-sd="g7usr" role="button" aria-label="Обновить">'+hic('refresh',cl)+'</i><i data-sd="g7tip" data-x="Лимиты: Claude — снимок Claude Code (обновляется, когда Claude работает), Codex — из последнего ответа Codex, Hermes — подписка, на которой он работает, и его токены за 24 ч" role="button" aria-label="Что это">'+hic('info',cl)+'</i></div>'}
 function setBody(){var top=SS.stack[SS.stack.length-1];return '<div class="sd3sc g7ssc" id="sd3ssc">'+(top?SP[top][1]():mainBody())+'</div>'}
 function setHtml(sty){SS.stack=[];SS.y=[];QP=null;get('acct?k='+kind());get('usage');get('vers');return '<div class="vb7pg">'+setBody()+setHead()+'</div>'}
 function setEl(){var r=$i('sd3set');return r&&/\bon\b/.test(r.className)?r:null}
 function setCls(r){r.classList.add('g7s');r.classList.toggle('cl',isCl());r.classList.toggle('gp',!isCl())}
 function setRepaint(){var r=setEl();if(!r)return;var pg=curPg(r);if(!pg){r.innerHTML='<div class="vb7pg">'+setBody()+setHead()+'</div>';setCls(r);return}var sc=pg.querySelector('.sd3sc'),y=sc?sc.scrollTop:0;pg.innerHTML=setBody()+setHead();var s2=pg.querySelector('.sd3sc');if(s2)s2.scrollTop=y;setCls(r);qxAnim(pg)}
 function setOpened(r){setCls(r)}
 /* vb7b-2: страница листа = заголовок + тело в одной обёртке .vb7pg; переход двигает страницу целиком, старая уезжает под новую (iOS push 385 мс), назад — так же, место прокрутки помнится */
function curPg(r){var L=r.querySelectorAll('.vb7pg:not(.vb7old)');return L[L.length-1]||null}
var QP=null;function qxAnim(pg){if(SS.stack[SS.stack.length-1]!='focus'){QP=null;return}var x=pg&&pg.querySelector('.vb7qx'),on=!!x;
 if(on&&QP===false&&x.animate&&!RM()){var h=x.offsetHeight;x.animate([{height:'0px',opacity:0},{height:h+'px',opacity:1}],{duration:320,easing:'cubic-bezier(.32,.72,0,1)'})}QP=on}
var EZP='linear(0,.051,.163,.294,.423,.538,.637,.718,.784,.835,.876,.907,.931,.949,.963,.973,.980,.986,.990,.993,.996,.997,.998,.999,1)';
function setPush(k){var r=setEl();if(!r||!SP[k])return;var old=curPg(r),sc=old&&old.querySelector('.sd3sc');SS.y=SS.y||[];SS.y.push(sc?sc.scrollTop:0);SS.stack.push(k);
 var nw=D.createElement('div');nw.className='vb7pg';nw.innerHTML=setBody()+setHead();r.appendChild(nw);setCls(r);QP=null;qxAnim(nw);
 if(!old)return;if(RM()||!nw.animate){old.remove();return}old.classList.add('vb7old');var w=r.clientWidth;
 nw.animate([{transform:'translateX('+w+'px)'},{transform:'none'}],{duration:385,easing:EZP});
 var a=old.animate([{transform:'none',opacity:1},{transform:'translateX('+Math.round(-w*.3)+'px)',opacity:.5}],{duration:385,easing:EZP,fill:'forwards'});a.onfinish=function(){old.remove()}}
function setPop(){var r=setEl();if(!r)return;var old=curPg(r);SS.stack.pop();var y=(SS.y||[]).pop()||0;var nw=D.createElement('div');nw.className='vb7pg';nw.innerHTML=setBody()+setHead();
 if(old)r.insertBefore(nw,old);else r.appendChild(nw);var s2=nw.querySelector('.sd3sc');if(s2)s2.scrollTop=y;setCls(r);QP=null;qxAnim(nw);
 if(!old)return;if(RM()||!old.animate){old.remove();return}old.classList.add('vb7old');var w=r.clientWidth,ez='cubic-bezier(.32,.72,0,1)';
 nw.animate([{transform:'translateX('+Math.round(-w*.3)+'px)',opacity:.5},{transform:'none',opacity:1}],{duration:360,easing:ez});
 var a=old.animate([{transform:'none'},{transform:'translateX('+w+'px)'}],{duration:360,easing:ez,fill:'forwards'});a.onfinish=function(){old.remove()}}
/* выбор из списка — меню с ✓, растёт от строки (как выпадающие списки ChatGPT Settings) */
 var MENUS={busy:[['steer','Вмешаться'],['queue','В очередь']],theme:[['system','Системное'],['light','Светлое'],['dark','Тёмное']],links:[['tg','В Telegram'],['ext','Во внешнем браузере']],qfrom:[['22:00'],['23:00'],['00:00'],['01:00']],qto:[['07:00'],['08:00'],['09:00'],['10:00']]};
 function menu(k,el){var L=MENUS[k];if(!L||!W.SD3)return;var e=Ev(),cur=k=='links'||k=='busy'||k=='theme'?pf(k):k=='qfrom'?(e.quiet||{}).from:(e.quiet||{}).to,r=el.getBoundingClientRect(),em0=el.querySelector('em')||el,rx=Math.max(16,Math.round(innerWidth-em0.getBoundingClientRect().right));
  var h=L.map(function(o){return '<div class="sd3mi" data-sd="g7pick" data-m="'+k+'" data-v="'+E(o[0])+'">'+(o[0]==cur?'<i class="sd3ckm">'+(isCl()?ai('check'):ic('c_check'))+'</i>':'')+'<span>'+E(o[1]||o[0])+'</span></div>'}).join('');
  var up=r.top>innerHeight/2,p=SD3.pop(h,up?{right:rx+'px',bottom:(innerHeight-r.top+4)+'px',minWidth:'200px'}:{right:rx+'px',top:(r.bottom+4)+'px',minWidth:'200px'},{origin:up?'bottom right':'top right'});p.classList.add('g7m');p.classList.add(isCl()?'g7mc':'g7mg')}
 function pick(k,v){SD3.closePop();if(k=='links'||k=='busy'||k=='theme')pfs(k,v);else{var e=Ev();if(e.quiet){e.quiet[k=='qfrom'?'from':'to']=v;baseSave()}}setRepaint()}
 /* ⓘ — версии */
 function info(el){var v=have('vers'),r=el.getBoundingClientRect();if(!v){get('vers',function(d){if(d&&!d.error&&el.isConnected)info(el)});v={}}
  var h='<div class="sd3mh">Hermes Control v'+E(verS())+'</div>'+['claude','codex','hermes'].map(function(k){return v[k]?'<div class="sd3mi" data-sd="g7copy" data-v="'+E(KN[k]+' '+v[k])+'"><span>'+KN[k]+' '+E(v[k])+'</span></div>':''}).join('')+
   SD3.mi('reload','','Обновить панель')+SD3.mi('g7tab','','Система: проверка',0,{x:'sys'});
  SD3.pop(h,{top:(r.bottom+8)+'px',right:(innerWidth-r.right)+'px'},{origin:'top right'})}
 /* ---------- 3. кольцо контекста (Claude iOS, кадр B1 94.5: в капсуле [32 | •••] вместо ✎, Ø≈22 pt, серый трек, дуга #5698D4, число внутри) ---------- */
 var RG={sig:'',d:null,t:0};var RGC=lsg('g7rgc',null)||{};/*vb5a-4: последнее кольцо по чату — сразу при открытии*/
 function rgPut(sig,d){if(!d||d.error||!d.win||d.pend)return;RGC[sig]={pct:d.pct,win:d.win,used:d.used,ts:Date.now()};var ks=Object.keys(RGC);if(ks.length>40){ks.sort(function(a,b){return RGC[a].ts-RGC[b].ts});delete RGC[ks[0]]}lss('g7rgc',RGC)/*vb8c-b8: читаем через LS (hc_g7rgc) — и пишем туда же*/}
 function ringHtml(p){p=Math.max(0,Math.min(100,+p||0));var R=13.6,L=2*Math.PI*R,w=p>=90?' crit':p>=70?' warn':'';
  return '<svg width="31" height="31" viewBox="0 0 31 31" aria-hidden="true"><circle cx="15.5" cy="15.5" r="'+R+'" fill="none" class="trk" stroke-width="2.6"/><circle class="arc'+w+'" cx="15.5" cy="15.5" r="'+R+'" fill="none" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="'+(L*Math.max(p,1.5)/100).toFixed(2)+' '+L.toFixed(2)+'" transform="rotate(-90 15.5 15.5)"/></svg><b>'+Math.round(p)+'</b>'}
 /* vb7c-2 (Ц1, Ц5): кольцо и у Hermes (state.db _usage_anchor); «ещё нет ответа» ({pend} / no-file у нового чата) — пустое кольцо и опрос каждые 4–8 с,
   а не снятие и 60 с; ход чата ПК (cclive) = «идёт ход»; конец хода — сразу новый запрос; процент — один раз из used/win */
function rgBusy(s){return !!(s.busy||s.cclive||(s.cur&&s.cur.live)||(s.hpoll&&s.hpoll==s.sid)||(s.dsq&&s.sid&&s.dsq[s.sid]))}
function rgPh(d){return !!(d&&(d.pend||d.error=='no-file'))}
function rgPct(d){return d&&d.win>0&&d.used!=null?100*d.used/d.win:+(d&&d.pct)||0}
function rgFetch(s,cb){var sig=s.kind+':'+s.sid,p='ctx?k='+s.kind+'&id='+encodeURIComponent(s.sid);RG.t=Date.now();delete C[p];
 get(p,function(d){if(RG.sig!=sig)return;if(d&&d.error&&!rgPh(d)&&d.error!='unsupported'&&d.error!='no-window'&&RG.d&&RG.d.win&&!RG.d.ph){}else RG.d=d;RG.ph=false;rgPut(sig,d);ringTick();cb&&cb()})}
function ringTick(){var s=st();if(!s||s.view!='chat'||!s.sid||(s.kind!='claude'&&s.kind!='codex'&&s.kind!='hermes')||!pf('ring')){D.querySelectorAll('.g7ring').forEach(function(x){x.remove()});if(B.classList.contains('g7rg'))B.classList.remove('g7rg');/*vb8-a7: без лишней мутации body — она будит перерисовку чата*/return}
  var cl=s.kind=='claude',hd=cl?$i('clhd'):$i('g3hd');if(!hd)return;var cap=cl?hd.querySelector('.clpill'):hd.querySelector('.g3cap');if(!cap)return;
  var sig=s.kind+':'+s.sid,busy=rgBusy(s);
  if(sig!=RG.sig){RG.sig=sig;RG.d=RGC[sig]||null;RG.ph=!RG.d;RG.t=0;RG.b=busy}if(RG.b&&!busy)RG.t=0;RG.b=busy;
  var wait=RG.ph||rgPh(RG.d),iv=wait?(busy?4e3:8e3):busy?10e3:60e3;if(!RG.t||Date.now()-RG.t>iv)rgFetch(s);
  var d=RG.d,el=hd.querySelector('.g7ring');if(!d&&RG.ph||rgPh(d))d={pct:0,win:1,ph:1};/*vb5a-4: пока нет данных — пустое кольцо на своём месте*/if(!d||d.error||!d.win){if(el)el.remove();B.classList.remove('g7rg');return}
  if(!el){el=D.createElement(cl?'i':'div');el.className='g7ring'+(cl?' in':' g3gl');el.dataset.g7='ctx';el.setAttribute('role','button');el.setAttribute('aria-label','Контекст');
   if(cl)cap.insertBefore(el,cap.firstChild);else cap.parentNode.insertBefore(el,cap)}
  B.classList.toggle('g7rg',cl);need('usage',function(){});/*vb7c-3: сохранённый на телефоне (t:0) — сразу свежий*/var nw=d.ph&&!(s.msgs||[]).some(function(b){return b&&b.k=='a'})&&!s.loadingMsgs;/*vb8c-b8: новый чат — «0», а не пустой круг*/var hh=d.ph&&!nw?ringHtml(0).replace(/<circle class="arc[^>]*>/,'').replace(/<b>[^<]*<\/b>/,'<b></b>'):ringHtml(d.ph?0:rgPct(d));if(el.__h!=hh){el.innerHTML=hh;el.__h=hh}}
 setInterval(function(){try{ringTick()}catch(e){}},400);
 /*vb8c-b8: шапку перерисовали (возврат в чат, лист закрыт) — кольцо в том же кадре, а не через тик*/var RGF=0;try{new MutationObserver(function(){if(RGF||!pf('ring'))return;var hd=$i('g3hd')||$i('clhd');if(!hd||hd.querySelector('.g7ring'))return;RGF=requestAnimationFrame(function(){RGF=0;try{ringTick()}catch(e){}});try{ringTick()}catch(e){}}).observe(B,{childList:true,subtree:true})}catch(e){}/*vb5a-4: было 1500 — кольцо появлялось через 0,6–1,5 с после открытия*/
 function fmtK(n){n=+n||0;var f=function(x){return String(x).replace(/\.0$/,'').replace('.',',')};/*vb6h: «475 тыс.», не «475,0 тыс.»*/return n>=1e6?f((n/1e6).toFixed(n%1e6?1:0))+' млн':n>=1e3?f((n/1e3).toFixed(1))+' тыс.':String(n)}/*vb5b-14*/
 function verS(){var v=+(W.VER||0);return v>=100?'10.'+(v-100):v?(v/10).toFixed(1):''}
 /* лист «Расход» из кольца (B1 101.5): плавающий, ✕ | Расход | [⟳ | i]; «Контекст» → «Окно контекста 8 % занято», полоса, «83.1K из 1M токенов»; ниже лимит тарифа */
 function ctxSheet(){var s=st();if(!RG.d&&!RG.ph||!s)return;var cl=s.kind=='claude',K=s.kind,who=cl?'Claude Code':KN[K]||'Агент',v=D.createElement('div');v.id='g7cv';var sh=D.createElement('div');sh.id='g7cs';sh.className='g7s '+(cl?'cl':'gp');
  function body(){var u=have('usage'),d=RG.d,ph=!d||RG.ph||rgPh(d),pc=ph?0:rgPct(d),lim=u?limBlk(K,u):'';if(lim&&K=='hermes'&&u.hermes&&u.hermes.sub)lim+=foot('Hermes работает на подписке '+(u.hermes.sub=='claude'?'Claude':'Codex')+'.');
   return '<div class="g7grab"></div><div class="g7sh">'+hb('g7csx','Закрыть',hic('x',cl))+'<div class="g7st">Расход</div>'+cap2(cl)+'</div><div class="g7csb">'+sec('Контекст')+
    (ph?card([row('Окно контекста',{sub:'Заполнение появится после первого ответа'})]):d.error?card([row('Окно контекста',{sub:'Нет данных'})]):card([bar('Окно контекста',pc,fmtK(d.used)+' из '+fmtK(d.win)+' токенов')])+
    '<div class="g7lead">'+(pc>=80?'Окно почти заполнено: скоро '+who+' сожмёт старую часть разговора.':'Места в окне достаточно. Когда оно заполнится, '+who+' сам сожмёт старую часть разговора.')+'</div>')+lim+'</div>'}
  function rp(){if(sh.isConnected)sh.innerHTML=body()}sh.innerHTML=body();need('usage',rp);/*vb7c-3: кэш телефона (t:0) не свежий — сразу запрос*/
  B.appendChild(v);B.appendChild(sh);function cls(){v.remove();if(!RM()&&sh.animate){var a=sh.animate([{transform:'none'},{transform:'translateY(110%)'}],{duration:220,easing:'cubic-bezier(.4,0,1,1)',fill:'forwards'});a.onfinish=function(){sh.remove()}}else sh.remove()}
  v.onclick=cls;sh.onclick=function(e){var a=e.target.closest('[data-sd]');if(!a)return;if(a.dataset.sd=='g7csx')cls();else if(a.dataset.sd=='g7usr'){delete C['usage'];get('usage',rp);var s2=st();if(s2&&s2.sid&&RG.sig==s2.kind+':'+s2.sid)rgFetch(s2,rp)/*vb7c-2: ⟳ обновляет и контекст*/}else if(a.dataset.sd=='g7toast')T(a.dataset.x)};if(!RM()&&sh.animate)sh.animate([{transform:'translateY(110%)'},{transform:'none'}],{duration:440,easing:'linear(0,.042,.137,.253,.370,.480,.577,.661,.731,.788,.835,.872,.901,.925,.943,.957,.968,.977,.983,.988,.992,.995,.997,.999,1)'})}
 D.addEventListener('click',function(e){var r=e.target.closest&&e.target.closest('[data-g7=ctx]');if(!r)return;e.stopPropagation();e.preventDefault();ctxSheet()},true);
 /* ---------- шрифты 1:1: Anthropic Sans/Serif + Anthropicons (Claude Desktop), OpenAI Sans (Codex Desktop) — с ПК (/api/hc/s5/font), НЕ с Pages.
    В них нет кириллицы: русский текст рисуется системным SF Pro, как в самих приложениях на русском. Не на Apple (ПК) вместо SF — Inter. */
 var FONTS=[['Anthropic Sans','ant','300 800'],['Anthropic Serif','antserif','300 800'],['Anthropicons','anticons','400 700'],['OpenAI Sans','oai400','400'],['OpenAI Sans','oai500','500'],['OpenAI Sans','oai600','600'],['Inter','inter','100 900']];
 /* есть ли системный SF (-apple-system): ширина кириллицы в «-apple-system, monospace» отличается от чистого monospace */
 function hasSF(){try{var c=D.createElement('canvas').getContext('2d'),t='Настройки панели Wwi';c.font='17px monospace';var a=c.measureText(t).width;c.font='17px -apple-system, monospace';return Math.abs(c.measureText(t).width-a)>0.5}catch(e){return /iPhone|iPad|Macintosh/.test(navigator.userAgent)}}
 function loadFonts(){if(!W.FontFace||!D.fonts)return;var apple=hasSF();
  FONTS.forEach(function(f){if(f[1]=='inter'&&apple)return;var u=url('font?n='+f[1]),key='https://g7font/'+f[1];
   var hit=W.caches?caches.open('g7f').then(function(c){return c.match(key).then(function(r){return r||fetch(u,{headers:{'X-Init-Data':W.tg?tg.initData:''}}).then(function(r2){if(!r2.ok)throw 0;return c.put(key,r2.clone()).then(function(){return r2})})})}).catch(function(){return fetch(u,{headers:{'X-Init-Data':W.tg?tg.initData:''}})})
    :fetch(u,{headers:{'X-Init-Data':W.tg?tg.initData:''}});
   hit.then(function(r){if(!r||!r.ok)throw 0;return r.arrayBuffer()}).then(function(b){var ff=new FontFace(f[0],b,{weight:f[2],display:'swap'});return ff.load().then(function(){D.fonts.add(ff);B.classList.add('g7f-'+f[1])})}).catch(function(){})})}
 setTimeout(loadFonts,0);
 /* ---------- клики (вызываются из switch g3_side: default → G7.act) ---------- */
 function go(x,el){if(x=='code'){if(W.SD3)SD3.rcOpen({ag:'claude'});return}if(PAGES[x])pgOpen(x)}
 var PGF='';function tabGo(x){var RET=(x=='set'&&setEl()&&W.U&&U.tab=='hc')?{page:U.page}:null;PGF=setEl()&&x.indexOf('g7:')==0?'set':'';/*vb5b-6*/pgClose(true);if(W.SD3){SD3.setClose(true);if(x.indexOf('g7:')==0){go(x.slice(3));return}if(x=='glos'){SD3.closeAll();baseA('glos');return}SD3.goTab(x);VB7R=RET;if(RET)setTimeout(setFix,0)}}
 function act(a,ds,el){switch(a){
  case 'g7pgx':{var f0=PGF;PGF='';pgClose();if(W.SD3){if(f0=='set'){SD3.open({instant:true});setTimeout(function(){SD3.setOpen()},30)}else SD3.open()}break}/*vb5b-6*/
  case 'g7tab':SD3.closePop();tabGo(ds.x);break;
  case 'g7img':imgView(+ds.i);break;
  case 'g7draw':draw();break;
  case 'g7set':setPush(ds.x);break;
  case 'g7setb':setPop();break;
  case 'g7menu':menu(ds.x,el);break;
  case 'g7pick':pick(ds.m,ds.v);break;
  case 'g7toast':T(ds.x||'');break;
  case 'g7tip':{if(!W.SD3)break;var rr=el.getBoundingClientRect(),pp=SD3.pop('<div class="g7tipb">'+E(ds.x||'')+'</div>',{right:'16px',top:(rr.bottom+6)+'px',maxWidth:'270px'},{origin:'top right'});pp.classList.add('g7m');pp.classList.add(isCl()?'g7mc':'g7mg');break}/*vb5b-9*/
  case 'g7usr':delete C['usage'];get('usage',setRepaint);break;
  case 'g7copy':try{navigator.clipboard.writeText(ds.v);T('Скопировано')}catch(e){}SD3.closePop();break;
  case 'g7arch':{SD3.setClose(true);var Q=SD3.SD;Q.q='';Q.sel=null;Q.flt='arch';Q.grp=false;Q.ag='';SD3.rcOpen({keep:true});break}
  case 'g7all':SD3.setClose(true);SD3.rcOpen();break;
  case 'g7pf':if(ds.a=='theme')pfs('theme',ds.x);else pfs('busy',ds.x);setRepaint();break;
  case 'g7sw':{var k=ds.a;if(k=='pf'){pfs(ds.x,!pf(ds.x))}else if(k=='hap'){baseA('hap')}else if(k=='bio'){baseA('biolock')}else{baseA(k);baseSave()}
   try{tg.HapticFeedback.selectionChanged()}catch(x){}setTimeout(setRepaint,30);break}
 }}
 D.addEventListener('input',function(e){var r=e.target.dataset&&e.target.dataset.g7r;if(!r)return;pfs(r,+e.target.value);var cd=e.target.closest('.g7card'),em=cd&&cd.querySelector('.g7r em');if(em)em.textContent=e.target.value+' pt'},true);/*vb5b-3: подпись в соседней строке*/
 D.addEventListener('keydown',function(e){if(e.target.id=='g7dq'&&e.key=='Enter'){e.preventDefault();draw()}if(e.key=='Escape'&&PG.k)pgClose()});
 /* страница открыта, а экран сменился (уход из вкладки) — закрыть */
 setInterval(function(){if(PG.k&&!(W.U&&U.tab=='hc'))pgClose(true)},700);
 
/* ---------- vb7b-4: «Автопилот и агенты» из листа агента (быстрый вариант) ----------
   старая страница Настроек панели: подписи без «Claude», уведомления — ссылкой на лист агента (одна копия), «‹» — обратно в лист. */
var VB7R=null;
function setFix(){if(!(W.U&&U.tab=='set'&&!U.page))return;var sc=$i('scr');if(!sc)return;
 var R=[[/Вопросы Claude/g,'Вопросы агентов'],[/Claude завис/g,'Агент завис'],[/Claude упал/g,'Агент упал'],[/→ Claude\b/g,'→ агент']];if(VB7R)R.push([/\bClaude\b/g,'агент']);
 var tw=D.createTreeWalker(sc,4),n,L=[];while((n=tw.nextNode()))if(/Claude/.test(n.nodeValue))L.push(n);
 L.forEach(function(t){var v=t.nodeValue;R.forEach(function(z){v=v.replace(z[0],z[1])});if(v!=t.nodeValue)t.nodeValue=v});
 if(!VB7R)return;[].forEach.call(sc.querySelectorAll('.sh span,.sh,.g4sh,h3'),function(h){if(!/^(О чём сообщать в Telegram|Присылать в Telegram)$/.test(h.textContent.trim()))return;var s=h.closest('.sec')||h.parentNode;if(!s||s.classList.contains('vb7nl')||!s.parentNode)return;
  var e=Ev(),on=e.notify?Object.keys(e.notify).filter(function(x){return e.notify[x]}).length:0,d=D.createElement('div');d.className='sec vb7nl';
  d.innerHTML='<div class="grp"><div class="row tap" data-a="vb7notif"><div class="t"><div class="n">Уведомления</div><div class="d">'+on+' из 4 · в Настройках агента</div></div><span class="chev">›</span></div></div>';s.parentNode.replaceChild(d,s)})}
function setBack(push){var r=VB7R;VB7R=null;U.tab='hc';U.page=(r&&r.page)||'hcchat';try{render()}catch(e){}if(W.SD3){SD3.setOpen();if(push)setTimeout(function(){setPush(push)},60)}}
W.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-a],[data-g4]');if(!t)return;
 if(VB7R&&W.U&&U.tab=='set'&&(t.dataset.a=='vb7notif'||t.dataset.g4=='back'||t.classList.contains('bm86'))){e.stopPropagation();e.preventDefault();setBack(t.dataset.a=='vb7notif'?'notif':'');return}
 if(t.dataset.a=='tab'&&t.style.display!='none')VB7R=null},true);
try{new MutationObserver(function(){if(W.U&&U.tab=='set')try{setFix()}catch(e){}}).observe($i('scr')||B,{childList:true,subtree:true})}catch(e){}
/* ---------- vb7b-6: П4 гонка сохранения — ответ первого save не затирает нажатие, сделанное, пока он летел ---------- */
var SQ=0,_send7=W.send;
if(typeof _send7=='function'&&!_send7.vb7)W.send=function(o,quiet){if(!o||o.a||!o.quiet||!W.API||W.MOCK||typeof W.SET!='function')return _send7.apply(this,arguments);
 o=Object.assign({v:1},o);try{haptic('success')}catch(x){}var my=++SQ,snap=JSON.stringify(SET(W.E)),q=quiet||!!setEl();
 fetch(String(W.API).replace(/\/$/,'')+'/api',{method:'POST',headers:{'Content-Type':'application/json','X-Init-Data':W.tg?tg.initData:''},body:JSON.stringify(o)}).then(function(r){if(!r.ok)throw r;return r.json()})
 .then(function(r){if(!q)try{toast('<b>'+IC('check')+'</b> '+esc(r.text||'Готово'))}catch(x){}
   if(r.state){var later=JSON.stringify(SET(W.E))!=snap||my<SQ,keep=(dirty()||later)?W.E:null;W.S=r.state;norm();if(keep)W.E=keep;render(true);setRepaint();if(later&&my==SQ&&dirty())baseA('save')}})
 .catch(function(){try{if(W.MENU&&!(W.HP&&HP.get('z')))toast('Сервер на ПК недоступен. Открой панель кнопкой «Панель» внизу чата — она работает через бота.');else{toast('Сервер недоступен — отправляю через бота');sd(o)}}catch(x){}})};
if(W.send)W.send.vb7=1;
/* ---------- vb7b-1: при движении пальца подсветка строк снимается (не «прилипает» при прокрутке) ---------- */
var TY=null;D.addEventListener('touchstart',function(e){TY=e.target.closest&&e.target.closest('#sd3set,#g7pg')&&e.touches[0]?e.touches[0].clientY:null},{passive:true,capture:true});
D.addEventListener('touchmove',function(e){if(TY!=null&&e.touches[0]&&Math.abs(e.touches[0].clientY-TY)>6)B.classList.add('vb7scr')},{passive:true,capture:true});
['touchend','touchcancel'].forEach(function(n){D.addEventListener(n,function(){TY=null;setTimeout(function(){B.classList.remove('vb7scr')},0)},{passive:true,capture:true})});
/*vb7b-p1*/
 applyPF();
 /* vb7c-6 (П11): время кликера/уведомлений («был 13:39»), событий и ответов — по часам телефона. Сервер (staged tv_panel VB7C_P)
   шлёт эпоху: clicker.last_ts / nx, у строк ev/hist/at — ts; «HH:MM» ПК (last_run_at[11:16] = UTC) заменяем местным временем. */
function hmL(ts){var d=new Date(ts*1000);return ('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2)}
function tzArr(a,dp){for(var i=0;i<a.length;i++){var x=a[i];if(!x||typeof x!='object')continue;if(+x.ts>1e9&&typeof x.t=='string'&&/^\d\d:\d\d$/.test(x.t))x.t=hmL(+x.ts);
  if(dp)for(var k in x)if(Array.isArray(x[k]))tzArr(x[k],0)}}
function tzFix(){var S=W.S;if(!S||typeof S!='object')return;['clicker','notifier'].forEach(function(k){var j=S[k];if(!j||typeof j!='object')return;if(+j.last_ts>1e9)j.last=hmL(+j.last_ts);if(+j.nx>1e9)j.next=hmL(+j.nx)});
 for(var k in S)if(Array.isArray(S[k]))tzArr(S[k],1)}
['norm','render'].forEach(function(n){var f=W[n];if(typeof f!='function'||f.__vb7c)return;var g=function(){if(n=='render')try{tzFix()}catch(e){}var r=f.apply(this,arguments);if(n=='norm')try{tzFix()}catch(e){}return r};g.__vb7c=1;W[n]=g});
try{tzFix()}catch(e){}
/* vb7c-5 (Л4): «Ещё» → «Токены · 24 ч» — это только кликер: подпись честная, сумма точная (= «кликер» в «Расходе» Hermes, один фильтр) */
if(typeof W.forecast=='function'){var fc0=W.forecast;W.forecast=function(){var f=fc0.apply(this,arguments),S=W.S;if(S&&S.tok&&S.tok.sum!=null){f.sum=S.tok.sum/1000;f.pct=Math.min(100,f.sum/(S.budget*1000)*100)}return f}}
if(typeof W.tokens=='function'){var tk0=W.tokens;W.tokens=function(){var h=tk0.apply(this,arguments);return h.replace('<span>Токены · 24 ч</span>','<span>Токены кликера · 24 ч</span>').replace(/(\d)\.(\d)(?= млн| \/)/g,'$1,$2')}}
/* vb7c-1: общий свод «Расход агентов» — в «Ещё» (в листе агента — только его лимиты) */
function allSec(){var u=need('usage',function(d){if(d&&!d.error&&W.U&&U.tab=='more'&&!U.page&&typeof W.render=='function')W.render(true)});if(!u||u.error)return '';var c=u.claude,x=u.codex,hm=u.hermes,R=[];
 function r(n,d,old){return '<div class="row"><div class="t"><div class="n">'+E(n)+'</div><div class="d'+(old?' vb7cst':'')+'">'+E(d)+'</div></div></div>'}
 if(c){var o=clOld(c);R.push(r('Claude','сессия '+Math.round(+c.five||0)+'% · неделя '+Math.round(+c.week||0)+'% · '+(o?'устарело, ':'')+'обновлено '+ago(c.t),o))}
 if(x)R.push(r('Codex'+(cxPlan(x)?' · '+cxPlan(x):''),[x.primary,x.secondary].filter(Boolean).map(function(w){return cxWin(w).toLowerCase()+' '+Math.round(+w.pct||0)+'%'}).join(' · ')));
 if(hm)R.push(r('Hermes',(hm.v==2?'токены за сутки '+fmtM(hm.day)+' (расписание '+fmtM(hm.cron)+', чаты '+fmtM(hm.chat)+')':'токены расписания за сутки '+fmtM(hm.day))+(hm.sub?' · на подписке '+(hm.sub=='claude'?'Claude':'Codex'):'')));
 return R.length?'<div class="sec vb7cus"><div class="sh"><span>Расход агентов</span></div><div class="grp">'+R.join('')+'</div></div>':''}
if(typeof W.moreTab86=='function'){var mt0=W.moreTab86;W.moreTab86=function(){var h=mt0.apply(this,arguments),a='';try{a=allSec()}catch(e){}return a&&h.indexOf('<div class="mr86">')>=0?h.replace('<div class="mr86">','<div class="mr86">'+a):h+a}}
W.G7={nav:nav,setHtml:setHtml,setOpened:setOpened,setPush:setPush,setPop:setPop,info:info,act:act,go:go,pgOpen:pgOpen,pgClose:pgClose,pf:pf,pfs:pfs,C:C,get:get,ring:ringTick,RG:RG,ctxSheet:ctxSheet,SS:SS,PG:PG};
})();
