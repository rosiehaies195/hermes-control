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
    ['claude','codex','hermes'].filter(function(a){return a!=k}).forEach(function(a){var M=oth.filter(function(x){return x.k==a});if(M.length)h+='<div class="sd3sh">'+KN[a]+'</div>'+M.map(schedRow).join('')})}
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
  data:'s_data',storage:'s_storage',cust:'s_custom',out:'s_logout',plus:'s_plus',q:'s_bell',brain:'s_storage',auto:'s_custom'};
 function rowIcon(n){if(!n)return '';if(isCl())return ai(n);var g=GI[n]||n;return g=='@av'?'':ic(g)}
 function tg2(on,a,x){return '<i class="g7sw'+(on?' on':'')+'" data-sd="g7sw" data-a="'+a+'"'+(x!=null?' data-x="'+E(x)+'"':'')+' role="switch" aria-checked="'+!!on+'"></i>'}
 /* строка: o.ic — значок, o.go — push-страница, o.act/o.x — действие, o.em — значение справа, o.dd — выпадающий (⌃⌄), o.sw — тумблер, o.sub — подпись */
 function row(t,o){o=o||{};var cl=isCl(),chev=o.go||o.chev,tail='';
  if(o.dd)tail='<em class="dd">'+E(o.em||'')+(cl?ai('ud','ud'):'<i class="g7ud">⌃⌄</i>')+'</em>';else if(o.em!=null&&o.em!=='')tail='<em>'+E(o.em)+'</em>';
  if(o.sw)tail+=o.sw;if(chev&&!o.dd)tail+=cl?ai('chev','chv'):ic('s_chev','sd3chv');
  return '<div class="g7r'+(o.ic?'':' noic')+(o.sub?' two':'')+(o.red?' red':'')+(o.blue?' blue':'')+'"'+(o.go?' data-sd="g7set" data-x="'+o.go+'"':o.act?' data-sd="'+o.act+'"'+(o.x?' data-x="'+E(o.x)+'"':''):'')+'>'+
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
   sec('Аккаунт')+card([row('Профиль',{ic:'user',go:'prof'}),row('Тариф',{ic:'bill',go:'acct',em:a.plan?a.plan:''}),row('Расход',{ic:'usage',go:'usage'}),
    row('Уведомления',{ic:'bell',go:'notif'}),row('Время и фокус',{ic:'clock',go:'focus'})])+
   sec('Приложение')+card([row('Возможности',{ic:'caps',go:'perm'}),row('Claude Code',{ic:'code',go:'code'}),row('Подключения',{ic:'plug',go:'conn'}),
    row('Голос и диктовка',{ic:'voice',go:'voice'}),row('Открывать ссылки',{ic:'ext',act:'g7menu',x:'links',em:linksName(),dd:1}),
    row('Вибро',{ic:'hap',sw:tg2(W.U&&U.haptics!==false,'hap')})])+foot('Ссылки из ответов агента открываются так же.')+/*vb5b-2: Оформление убрано*/
   sec('Панель')+card([row('Автопилот и агенты',{ic:'auto',act:'g7tab',x:'set',chev:1}),row('Система',{ic:'gear',act:'g7tab',x:'sys',chev:1}),row('Вопросы',{ic:'q',act:'g7tab',x:'q',chev:1})])+
   card([row('Остановить всё',{ic:'out',act:'stopall',red:1})],'g7out')+'<div class="sd3ver">Hermes Control · v'+E(verS())+'</div>'}
 /* ChatGPT Settings: промо-карточка, «Аккаунт» + «Добавить аккаунт», «Настроить», разделы, «Панель», выход */
 function gpMain(){var k=kind(),a=need('acct?k='+k,setRepaint)||{},nm=a.name||'';/*vb5b-1: без «Codex» вместо имени*/
  return '<div class="g7card g7promo"><div><b>Всё под контролем</b><span>Агенты, службы и связь с ПК — в «Системе».</span></div><i data-sd="g7tab" data-x="sys">Система</i></div>'+
   card(['<div class="g7r" data-sd="g7set" data-x="acct"><span class="g7ri"><i class="g7gav">'+E(ini(nm||KN[k]))+'</i></span><div class="g7rt"><b>Аккаунт</b></div><em>'+E((a.mail||'').split('@')[0]||nm)+'</em>'+ic('s_chev','sd3chv')+'</div>'])+/*vb5b-10*/
   card([row('Настроить '+KN[k],{ic:'cust',sub:k=='hermes'?'Инструкции, память, навыки':'Инструкции, память, плагины',act:'g7tab',x:'g7:cust',chev:1})])+
   card([row('Общие',{ic:'gear',go:'gen'}),row('Уведомления',{ic:'bell',go:'notif'}),row('Голос',{ic:'voice',go:'voice'}),row('Безопасность и вход',{ic:'lock',go:'sec'}),
    row('Удалённое управление',{ic:'remote',go:'rc'}),row('Расход',{ic:'storage',go:'usage'}),row('Данные',{ic:'data',go:'data'})])+
   card([row('Автопилот и агенты',{ic:'auto',act:'g7tab',x:'set',chev:1}),row('Вопросы',{ic:'q',act:'g7tab',x:'q',chev:1})])+
   card([row('Остановить всё',{ic:'out',act:'stopall',red:1})],'g7out')+'<div class="sd3ver">Hermes Control · v'+E(verS())+'</div>'}
 function mainBody(){return isCl()?clMain():gpMain()}
 /* «Оформление» Claude: 3 плитки-миниатюры (светлая / тёмная / системная по диагонали), оранжевая точка, выбранная — синяя рамка */
 function tiles(){var t=pf('theme');function tl(v){return '<div class="g7tile'+(t==v?' on':'')+'" data-sd="g7pf" data-a="theme" data-x="'+v+'"><i class="g7mini '+v+'"><s></s><s></s><u></u></i><b>'+themeName(v)+'</b></div>'}
  return '<div class="g7card g7tiles">'+tl('light')+tl('dark')+tl('system')+'</div>'}
 /* Расход (Usage Claude: «Текущая сессия 6 % занято», полоса 9 pt #2568C7 на #031C3C, сноска под полосой) */
 function bar(t,p,sub){p=Math.max(0,Math.min(100,+p||0));return '<div class="g7use"><div><b>'+E(t)+'</b><em>'+Math.round(p)+' % занято</em></div><i><s style="width:'+Math.max(p,1.6)+'%"></s></i>'+(sub?'<small>'+E(sub)+'</small>':'')+'</div>'}
 function track(u){var c=u&&u.claude,m=c?Math.max(+c.five||0,+c.week||0):0;return m>=90?'Лимит почти исчерпан.':m>=70?'Расход высокий — следи за лимитом.':'Всё в порядке: лимитов хватает с запасом.'}
 function usageBody(){var u=need('usage',setRepaint);if(!u)return '<div class="g7ld">Загружаю…</div>';if(u.error)return errH(u);var k=kind(),c=u.claude,x=u.codex,hm=u.hermes,L=[];
  function win(w){return !w?'':w.min>=10080?'Неделя':'Окно '+Math.round(w.min/60)+' ч'}
  if(c)L.push(['claude',(k=='claude'?'':sec('Claude'))+card([bar('Текущая сессия',c.five,'Окно 5 ч · обновлено '+ago(c.t))])+sec('Недельные лимиты')+card([bar('Все модели',c.week,'По данным Claude Desktop')])]);
  if(x)L.push(['codex',sec('Codex')+card([x.primary?bar(win(x.primary),x.primary.pct,x.primary.reset?'Сброс '+ago(x.primary.reset):''):'',x.secondary?bar(win(x.secondary),x.secondary.pct,x.secondary.reset?'Сброс '+ago(x.secondary.reset):''):''])]);
  if(hm)L.push(['hermes',sec('Hermes')+card([row('Токены за сутки',{em:(hm.day/1e6).toFixed(1)+' млн'})])]);
  L.sort(function(a,b){return (a[0]==k?0:1)-(b[0]==k?0:1)});
  return '<div class="g7lead">'+E(track(u))+'</div>'+L.map(function(z){return z[1]}).join('')+foot('Лимиты обновляются, когда агент работает. Hermes — токены cron и чатов за 24 ч.')}
 function notifBody(){var e=Ev(),cl=isCl(),N=[['question','Вопросы агентов','Когда агент ждёт твоего ответа или разрешения.'],['start','Начат новый шаг','Когда автопилот нажал Start.'],
   ['hang','Агент завис','Когда в чате ничего не меняется дольше порога.'],['fail','Что-то сломалось','Агент не отвечает, клик не прошёл.']];
  return card(N.slice(0,2).map(function(n){return row(n[1],{sub:cl?n[2]:'',sw:tg2(e.notify&&e.notify[n[0]],'nt:'+n[0])})}))+card(N.slice(2).map(function(n){return row(n[1],{sub:cl?n[2]:'',sw:tg2(e.notify&&e.notify[n[0]],'nt:'+n[0])})}))+foot('Уведомления приходят в Telegram от бота Hermes.')}
 function focusBody(){var e=Ev(),q=e.quiet||{},s=e.sched||{};
  return sec('Тихие часы')+card([row('Ночью копить, утром сводка',{sw:tg2(q.on,'qon')}),q.on?row('С',{em:q.from,act:'g7menu',x:'qfrom',dd:1}):'',q.on?row('До',{em:q.to,act:'g7menu',x:'qto',dd:1}):'',q.on?row('Вопросы всё равно присылать',{sw:tg2(q.q,'qq')}):''])+
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
 var SP={usage:['Расход',usageBody],notif:['Уведомления',notifBody],focus:['Время и фокус',focusBody],look:['Оформление',lookBody],code:['Claude Code',codeBody],rc:['Удалённое управление',rcBody],
  voice:['Голос и диктовка',voiceBody],sec:['Безопасность и вход',secBody],gen:['Общие',genBody],data:['Данные',dataBody],conn:['Подключения',connBody],prof:['Профиль',profBody],perm:['Возможности',permBody],acct:['Аккаунт',acctBody]};
 function hb(sd,lbl,inner,cls){return '<div class="g7hb'+(cls?' '+cls:'')+'" data-sd="'+sd+'" role="button" aria-label="'+lbl+'">'+inner+'</div>'}
 function setHead(){var back=SS.stack.length>0,cl=isCl(),top=SS.stack[SS.stack.length-1],t=back?SP[top][0]:'Настройки';
  if(!cl&&top=='voice')t='Голос';if(!cl&&top=='code')t='Текст и код';/*vb5b-3*/
  return '<div class="g7sh">'+(back?hb('g7setb','Назад',cl?ai('back'):backIc()):hb('setx','Закрыть',cl?ai('x'):ic('s_x')))+'<div class="g7st">'+E(t)+'</div>'+
   (back?(top=='usage'?cap2(cl):''):hb('info','О панели',cl?ai('info'):ic('s_info'),'r'))+'</div>'}
 /* капсула [⟳ | i] как у Usage Claude */
 function cap2(cl){return '<div class="g7cap r"><i data-sd="g7usr" role="button" aria-label="Обновить">'+(cl?ai('refresh'):'<svg width="19" height="19" viewBox="0 0 20 20" aria-hidden="true"><path d="M16.2 10.4a6.2 6.2 0 1 1-1.9-4.6M16.4 3.6v3.6h-3.6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>')+'</i><i data-sd="g7tip" data-x="Лимиты: Claude — из Claude Desktop, Codex — из последнего ответа, Hermes — токены за 24 ч" role="button" aria-label="Что это">'+(cl?ai('info'):'i')+'</i></div>'}
 function setBody(){var top=SS.stack[SS.stack.length-1];return '<div class="sd3sc g7ssc" id="sd3ssc">'+(top?SP[top][1]():mainBody())+'</div>'}
 function setHtml(sty){SS.stack=[];get('acct?k='+kind());get('usage');get('vers');return setBody()+setHead()}
 function setEl(){var r=$i('sd3set');return r&&/\bon\b/.test(r.className)?r:null}
 function setCls(r){r.classList.add('g7s');r.classList.toggle('cl',isCl());r.classList.toggle('gp',!isCl())}
 function setRepaint(){var r=setEl();if(!r)return;var sc=r.querySelector('.sd3sc'),y=sc?sc.scrollTop:0;r.innerHTML=setBody()+setHead();var s2=r.querySelector('.sd3sc');if(s2)s2.scrollTop=y;setCls(r)}
 function setOpened(r){setCls(r)}
 function setPush(k){var r=setEl();if(!r||!SP[k])return;SS.stack.push(k);r.innerHTML=setBody()+setHead();var nw=r.querySelector('.sd3sc');
  if(!RM()&&nw.animate){var w=r.clientWidth;nw.animate([{transform:'translateX('+w+'px)'},{transform:'none'}],{duration:385,easing:'linear(0,.051,.163,.294,.423,.538,.637,.718,.784,.835,.876,.907,.931,.949,.963,.973,.980,.986,.990,.993,.996,.997,.998,.999,1)'})}}
 function setPop(){var r=setEl();if(!r)return;SS.stack.pop();r.innerHTML=setBody()+setHead();var nw=r.querySelector('.sd3sc');if(!RM()&&nw.animate)nw.animate([{transform:'translateX(-101px)',opacity:.6},{transform:'none',opacity:1}],{duration:333,easing:'linear(0,.287 10%,.845 20%,1.054 30%,1.101 40%,1.095 50%,1.06 60%,1.034 70%,1.02 80%,1.007 90%,1)'})}
 /* выбор из списка — меню с ✓, растёт от строки (как выпадающие списки ChatGPT Settings) */
 var MENUS={busy:[['steer','Вмешаться'],['queue','В очередь']],theme:[['system','Системное'],['light','Светлое'],['dark','Тёмное']],links:[['tg','В Telegram'],['ext','Во внешнем браузере']],qfrom:[['22:00'],['23:00'],['00:00'],['01:00']],qto:[['07:00'],['08:00'],['09:00'],['10:00']]};
 function menu(k,el){var L=MENUS[k];if(!L||!W.SD3)return;var e=Ev(),cur=k=='links'||k=='busy'||k=='theme'?pf(k):k=='qfrom'?(e.quiet||{}).from:(e.quiet||{}).to,r=el.getBoundingClientRect();
  var h=L.map(function(o){return '<div class="sd3mi" data-sd="g7pick" data-m="'+k+'" data-v="'+E(o[0])+'">'+(o[0]==cur?'<i class="sd3ckm">'+(isCl()?ai('check'):ic('c_check'))+'</i>':'')+'<span>'+E(o[1]||o[0])+'</span></div>'}).join('');
  var up=r.top>innerHeight/2,p=SD3.pop(h,up?{right:'24px',bottom:(innerHeight-r.top+4)+'px',minWidth:'200px'}:{right:'24px',top:(r.bottom+4)+'px',minWidth:'200px'},{origin:up?'bottom right':'top right'});p.classList.add('g7m');p.classList.add(isCl()?'g7mc':'g7mg')}
 function pick(k,v){SD3.closePop();if(k=='links'||k=='busy'||k=='theme')pfs(k,v);else{var e=Ev();if(e.quiet){e.quiet[k=='qfrom'?'from':'to']=v;baseSave()}}setRepaint()}
 /* ⓘ — версии */
 function info(el){var v=have('vers'),r=el.getBoundingClientRect();if(!v){get('vers',function(d){if(d&&!d.error&&el.isConnected)info(el)});v={}}
  var h='<div class="sd3mh">Hermes Control v'+E(verS())+'</div>'+['claude','codex','hermes'].map(function(k){return v[k]?'<div class="sd3mi" data-sd="g7copy" data-v="'+E(KN[k]+' '+v[k])+'"><span>'+KN[k]+' '+E(v[k])+'</span></div>':''}).join('')+
   SD3.mi('reload','','Обновить панель')+SD3.mi('g7tab','','Система: проверка',0,{x:'sys'});
  SD3.pop(h,{top:(r.bottom+8)+'px',right:(innerWidth-r.right)+'px'},{origin:'top right'})}
 /* ---------- 3. кольцо контекста (Claude iOS, кадр B1 94.5: в капсуле [32 | •••] вместо ✎, Ø≈22 pt, серый трек, дуга #5698D4, число внутри) ---------- */
 var RG={sig:'',d:null,t:0};var RGC=lsg('g7rgc',null)||{};/*vb5a-4: последнее кольцо по чату — сразу при открытии*/
 function rgPut(sig,d){if(!d||d.error||!d.win)return;RGC[sig]={pct:d.pct,win:d.win,used:d.used,ts:Date.now()};var ks=Object.keys(RGC);if(ks.length>40){ks.sort(function(a,b){return RGC[a].ts-RGC[b].ts});delete RGC[ks[0]]}try{localStorage.setItem('g7rgc',JSON.stringify(RGC))}catch(e){}}
 function ringHtml(p){p=Math.max(0,Math.min(100,+p||0));var R=13.6,L=2*Math.PI*R,w=p>=90?' crit':p>=70?' warn':'';
  return '<svg width="31" height="31" viewBox="0 0 31 31" aria-hidden="true"><circle cx="15.5" cy="15.5" r="'+R+'" fill="none" class="trk" stroke-width="2.6"/><circle class="arc'+w+'" cx="15.5" cy="15.5" r="'+R+'" fill="none" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="'+(L*Math.max(p,1.5)/100).toFixed(2)+' '+L.toFixed(2)+'" transform="rotate(-90 15.5 15.5)"/></svg><b>'+Math.round(p)+'</b>'}
 function ringTick(){var s=st();if(!s||s.view!='chat'||!s.sid||(s.kind!='claude'&&s.kind!='codex')||!pf('ring')){D.querySelectorAll('.g7ring').forEach(function(x){x.remove()});B.classList.remove('g7rg');return}
  var cl=s.kind=='claude',hd=cl?$i('clhd'):$i('g3hd');if(!hd)return;var cap=cl?hd.querySelector('.clpill'):hd.querySelector('.g3cap');if(!cap)return;
  var sig=s.kind+':'+s.sid,busy=!!(s.busy||(s.cur&&s.cur.live)),p='ctx?k='+s.kind+'&id='+encodeURIComponent(s.sid);
  if(sig!=RG.sig){RG.sig=sig;RG.d=RGC[sig]||null;RG.ph=!RG.d;RG.t=0}if((!RG.t||Date.now()-RG.t>(busy?20e3:60e3))){RG.t=Date.now();delete C[p];get(p,function(d){if(RG.sig==sig){RG.d=d;RG.ph=false;rgPut(sig,d);ringTick()}})}
  var d=RG.d,el=hd.querySelector('.g7ring');if(!d&&RG.ph)d={pct:0,win:1,ph:1};/*vb5a-4: пока нет данных — пустое кольцо на своём месте*/if(!d||d.error||!d.win){if(el)el.remove();B.classList.remove('g7rg');return}
  if(!el){el=D.createElement(cl?'i':'div');el.className='g7ring'+(cl?' in':' g3gl');el.dataset.g7='ctx';el.setAttribute('role','button');el.setAttribute('aria-label','Контекст');
   if(cl)cap.insertBefore(el,cap.firstChild);else cap.parentNode.insertBefore(el,cap)}
  B.classList.toggle('g7rg',cl);if(!have('usage'))need('usage',function(){});var hh=d.ph?ringHtml(0).replace(/<circle class="arc[^>]*>/,'').replace(/<b>[^<]*<\/b>/,'<b></b>'):ringHtml(d.pct);if(el.__h!=hh){el.innerHTML=hh;el.__h=hh}}
 setInterval(function(){try{ringTick()}catch(e){}},400);/*vb5a-4: было 1500 — кольцо появлялось через 0,6–1,5 с после открытия*/
 function fmtK(n){n=+n||0;var f=function(x){return String(x).replace('.',',')};return n>=1e6?f((n/1e6).toFixed(n%1e6?1:0))+' млн':n>=1e3?f((n/1e3).toFixed(1))+' тыс.':String(n)}/*vb5b-14*/
 function verS(){var v=+(W.VER||0);return v>=100?'10.'+(v-100):v?(v/10).toFixed(1):''}
 /* лист «Расход» из кольца (B1 101.5): плавающий, ✕ | Расход | [⟳ | i]; «Контекст» → «Окно контекста 8 % занято», полоса, «83.1K из 1M токенов»; ниже лимит тарифа */
 function ctxSheet(){var d=RG.d,s=st();if(!d||!s)return;var cl=s.kind=='claude',u=have('usage'),v=D.createElement('div');v.id='g7cv';var sh=D.createElement('div');sh.id='g7cs';sh.className='g7s '+(cl?'cl':'gp');
  function body(){var u=have('usage'),lim='';if(u){if(cl&&u.claude)lim=sec('Лимиты тарифа')+card([bar('Текущая сессия',u.claude.five,'Окно 5 ч · обновлено '+ago(u.claude.t))]);else if(!cl&&u.codex&&u.codex.primary)lim=sec('Лимиты тарифа')+card([bar(u.codex.primary.min>=10080?'Неделя':'Окно',u.codex.primary.pct,u.codex.primary.reset?'Сброс '+ago(u.codex.primary.reset):'')])}
   return '<div class="g7grab"></div><div class="g7sh">'+hb('g7csx','Закрыть',cl?ai('x'):ic('s_x'))+'<div class="g7st">Расход</div>'+cap2(cl)+'</div><div class="g7csb">'+sec('Контекст')+
    card([bar('Окно контекста',d.pct,fmtK(d.used)+' из '+fmtK(d.win)+' токенов')])+
    '<div class="g7lead">'+(d.pct>=80?'Окно почти заполнено: скоро '+(cl?'Claude Code':'Codex')+' сожмёт старую часть разговора.':'Места в окне достаточно. Когда оно заполнится, '+(cl?'Claude Code':'Codex')+' сам сожмёт старую часть разговора.')+'</div>'+lim+'</div>'}
  sh.innerHTML=body();if(!have('usage'))get('usage',function(){if(sh.isConnected)sh.innerHTML=body()});
  B.appendChild(v);B.appendChild(sh);function cls(){v.remove();if(!RM()&&sh.animate){var a=sh.animate([{transform:'none'},{transform:'translateY(110%)'}],{duration:220,easing:'cubic-bezier(.4,0,1,1)',fill:'forwards'});a.onfinish=function(){sh.remove()}}else sh.remove()}
  v.onclick=cls;sh.onclick=function(e){var a=e.target.closest('[data-sd]');if(!a)return;if(a.dataset.sd=='g7csx')cls();else if(a.dataset.sd=='g7usr'){delete C['usage'];get('usage',function(){if(sh.isConnected)sh.innerHTML=body()})}else if(a.dataset.sd=='g7toast')T(a.dataset.x)};if(!RM()&&sh.animate)sh.animate([{transform:'translateY(110%)'},{transform:'none'}],{duration:440,easing:'linear(0,.042,.137,.253,.370,.480,.577,.661,.731,.788,.835,.872,.901,.925,.943,.957,.968,.977,.983,.988,.992,.995,.997,.999,1)'})}
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
 var PGF='';function tabGo(x){PGF=setEl()&&x.indexOf('g7:')==0?'set':'';/*vb5b-6*/pgClose(true);if(W.SD3){SD3.setClose(true);if(x.indexOf('g7:')==0){go(x.slice(3));return}if(x=='glos'){SD3.closeAll();baseA('glos');return}SD3.goTab(x)}}
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
 applyPF();
 W.G7={nav:nav,setHtml:setHtml,setOpened:setOpened,setPush:setPush,setPop:setPop,info:info,act:act,go:go,pgOpen:pgOpen,pgClose:pgClose,pf:pf,pfs:pfs,C:C,get:get,ring:ringTick,RG:RG,ctxSheet:ctxSheet,SS:SS,PG:PG};
})();
