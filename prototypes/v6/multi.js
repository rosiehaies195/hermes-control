/* v8.5 «Проекты» по модели проект × агент (решение 20.11); основа — v8.3 (прототип H на реальных данных).
   Стиль Hermes не меняется: КАПС-заголовки .sh, боевые карточки вопросов qAlert/qChips, шапка hd().
   Новое: список проектов (S.prj от tv_multi.py), фильтр Claude/Codex/Hermes на главной и во «Вопросах»,
   вопросы с pid (ответ в любом месте закрывает вопрос везде — это одна запись S.pend), закругления (multi.css). */
var ST8={wait:['Ждёт тебя','wait'],bad:['Сбой','bad'],work:['Работает','ok'],idle:['Свободен','']};
var APPS8=['claude','codex','hermes'],ANM8={claude:'Claude',codex:'Codex',hermes:'Hermes'};
function AB1(app,c){return app=='hermes'?'<span class="ag hermes '+(c||'')+'"></span>':'<span class="ag '+app+' '+(c||'')+'">'+LG(app)+'</span>'}
function AB8(p,c){return '<span class="abs8">'+p.apps.map(function(a){return AB1(a,c)}).join('')+'</span>'}
function waiting8(p){return p.st=='wait'||p.st=='bad'}
/* проекты: S.prj с бэкенда; вопросы проекта = S.pend с тем же pid. Без S.prj (старый бэкенд) — один проект из S.proj */
function proj8(){var L=S.prj&&S.prj.length?S.prj:[{id:'main',n:(S.proj&&S.proj.n)||'Проект',apps:['claude'],st:S.pend.length?'wait':'idle',ms:(S.proj&&S.proj.ms)||'',done:(S.proj&&S.proj.done)||0,total:(S.proj&&S.proj.total)||0,sub:S.session||'',tok:0,last:0,auto:true}];
 var auto=(L.filter(function(p){return p.auto})[0]||L[0]).id;
 return L.map(function(p){var o=Object.assign({},p);o.apps=(p.apps&&p.apps.length)?p.apps:['claude'];o.tok=+p.tok||0;
  o.q=S.pend.filter(function(q){return (q.pid||auto)==p.id});if(o.q.length&&o.st!='bad')o.st='wait';return o})}
function prjById8(id){return proj8().filter(function(p){return p.id==id})[0]}
function appsOfQ8(q){var L=proj8(),p=L.filter(function(z){return z.id==q.pid})[0]||L.filter(function(z){return z.auto})[0];return p?p.apps:[q.ag||'claude']}

/* фильтр по приложению: общий компонент (главная — U.pf, «Вопросы» — U.qf8) */
function appFilt8(key,list,getApps){return '<div class="seg2">'+['all'].concat(APPS8).map(function(a){
  return '<span data-a="af8" data-k="'+key+'" data-x="'+a+'" class="'+((U[key]||'all')==a?'on':'')+'">'+(a=='all'?'Все':AB1(a,'xs8')+ANM8[a])+'</span>'}).join('')+'</div>'}
function filtA2(){return appFilt8('pf',proj8(),function(p){return p.apps})}

/* строка проекта: значок приложения, имя + точка статуса, одна строка подписи, справа счётчик вопросов / сбой / n из m */
function ago8(t){var m=Math.max(1,Math.round((nowS()-t)/60));return m<60?m+' мин':m<1440?Math.round(m/60)+' ч':Math.round(m/1440)+' дн'}
function rowA2(p){var open=U.pe==p.id,dot=p.st=='wait'?'wait':p.st=='bad'?'bad':p.st=='work'?'ok':'';
 var right=p.q.length?'<span class="qb8">'+p.q.length+'</span>':p.st=='bad'?'<span class="bd2">сбой</span>':p.last?'<span class="fr2">'+ago8(p.last)+'</span>':'';
 return '<div class="row2 '+(open?'open':'')+'" data-a="pe" data-x="'+esc(p.id)+'">'+AB8(p,'m8')+'<div class="t2"><div class="n2"><span class="dot '+dot+'"></span><span class="nm2">'+esc(p.n)+'</span></div><div class="d2">'+(p.q.length&&!open?esc(p.q[0].q):esc(p.sub||''))+'</div></div>'+right+'</div>'+
  (open?detA2(p):'')}
function listA2(){var L=proj8(),f=U.pf||'all',V=L.filter(function(p){return f=='all'||p.apps.indexOf(f)>=0});if(!U.pg)U.pg={};if(!('idle' in U.pg))U.pg.idle=true;
 V=V.slice().sort(function(a,b){return (b.last||0)-(a.last||0)});var need=V.filter(waiting8),work=V.filter(function(p){return p.st=='work'}),idle=V.filter(function(p){return p.st=='idle'});
 function grp(t,arr,k,sm){if(!arr.length)return '';var shut=U.pg[k];return '<div class="sec g2"><div class="sh col'+(shut?' shut':'')+'" data-a="pg" data-x="'+k+'"><span>'+t+' · '+arr.length+'</span>'+(shut&&sm?'<span class="sum">'+esc(sm)+'</span>':'')+'</div>'+(shut?'':'<div class="grp">'+arr.map(rowA2).join('')+'</div>')+'</div>'}
 return grp('Требуют тебя',need,'need','')+grp('Работают',work,'work','')+grp('Свободны',idle,'idle',idle.map(function(p){return p.n}).join(', '))||'<div class="empty">В этом приложении пока нет проектов</div>'}
function moreA2(){if(U.col.more8===undefined)U.col.more8=true;var shut=U.col.more8;
 return '<div class="sec g2" style="margin-top:6px"><div class="sh col'+(shut?' shut':'')+'" data-a="col" data-x="more8"><span>Ещё</span><span class="sum">токены, автоматика, лента</span></div>'+(shut?'':'<div class="more2">'+(S.queue&&S.queue.length?queueCard():'')+tokens().replace(/ shut/,'')+(S.tok14&&S.tok14.sum?colSec('tok14','Токены · 14 дней',tok14(),''):'')+autoGrp()+feed()+'</div>')+'</div>'}
/* «Нужен ты»: боевые карточки вопросов (стиль каждого приложения), максимум 2, остальное во «Входящих» */
function inboxH(){var P=S.pend;if(!P.length)return '';var sh=P.slice(0,2);
 return '<div class="sec" style="margin-top:6px"><div class="sh"><span>Нужен ты · '+P.length+'</span><a data-a="tab" data-x="q">все вопросы ›</a></div></div>'+sh.map(qAlertP8).join('')+
  (P.length>2?'<div class="moreH" data-a="tab" data-x="q">Ещё '+(P.length-2)+' '+(P.length-2==1?'вопрос':P.length-2<5?'вопроса':'вопросов')+' во «Входящих» ›</div>':'')}
/* карточка вопроса с подписью проекта (если проектов больше одного) */
function qAlertP8(q){var h=qAlert(q),p=prjById8(q.pid);if(!p||proj8().length<2)return h;
 return h.replace('<div class="q">','<div class="pj8">'+AB8(p,'xs8')+esc(p.n)+'</div><div class="q">')}
/* v8.5: раскрытый проект = блок по каждому его агенту (модель «проект × агент», решение 20.11).
   Claude: автопилот проекта (Start/Написать/Пауза/Открыть) или «автопилот не включён»; Hermes: cron-задачи проекта
   (имя задачи начинается с имени проекта) с Прогон/Пауза; Codex: «не подключён». Кнопки уходят с data-pid. */
function cronOf8(p){var n=(p.n||'').toLowerCase();return (S.cj||[]).filter(function(j){return n&&(j.n||'').toLowerCase().indexOf(n)==0})}
function pb8(act,ic,t,cls,x,pid){return '<div class="'+(cls||'')+'" data-a="'+act+'"'+(x?' data-x="'+esc(x)+'"':'')+(pid?' data-pid="'+esc(pid)+'"':'')+'>'+(ic?IC(ic):'')+t+'</div>'}
function blk8(app,st,dot,body){return '<div class="ab85"><div class="ah85">'+AB1(app,'xs8')+'<b>'+ANM8[app]+'</b><span class="dot '+(dot||'')+'"></span><span class="as85">'+st+'</span></div>'+(body||'')+'</div>'}
function claudeBlk8(p){if(!p.auto)return blk8('claude','автопилот не включён','','<div class="ac2">'+pb8('pchat8','','Чаты Claude','','claude')+'</div>');
 var off=S.stopped,P=paused(),st,dot='';
 if(off){st='всё остановлено';dot='wait'}else if(S.fails){st='сбой ×'+S.fails;dot='bad'}else if(P){st='пауза до '+hm(S.pause);dot='wait'}
 else if(!S.clicker.on){st='кликер выключен'}else if(p.st=='work'){st='автопилот · работает';dot='ok'}else if(p.q.length){st='автопилот · ждёт тебя';dot='wait'}else st='автопилот · ждёт шага';
 var b=pb8('startsheet','play','Start',off?'dis':'','claude',p.id)+pb8('saysheet','pencil','Написать',off?'dis':'','claude',p.id)+
  (S.clicker.on||off?pb8(P?'resume':'pausesheet',P?'play':'pause',P?'Снять паузу':'Пауза',off?'dis':'','claude',p.id):pb8('clickon','play','Кликер','','claude',p.id))+pb8('proj','','Открыть','pri');
 return blk8('claude',st,dot,'<div class="ac2">'+b+'</div>')}
function hermesBlk8(p){var J=cronOf8(p),on=J.filter(function(j){return j.on}),bad=on.filter(function(j){return !j.ok});
 if(!J.length)return blk8('hermes','нет задач по расписанию','','<div class="ac2">'+pb8('pchat8','','Чаты Hermes','','hermes')+'</div>');
 var nm=(p.n||'').length,show=J.slice().sort(function(a,b){return (b.on-a.on)||(b.last||0)-(a.last||0)}),more=show.length>4?show.length-4:0;
 var rows=show.slice(0,4).map(function(j){var t=(j.n||'').slice(nm).replace(/^[\s·:\-—]+/,'')||j.n;
  return '<div class="cj85'+(j.on?'':' off')+'"><span class="dot '+(!j.on?'':j.ok?'ok':'bad')+'"></span><div class="cn85"><div>'+esc(t)+'</div><small>'+(!j.on?'на паузе':(j.ok?'':'сбой · ')+(j.last?hm(j.last):'не запускалась')+(j.nx?' → '+hm(j.nx):''))+'</small></div>'+
   '<span class="cb85" data-a="cronrun" data-x="'+esc(j.id)+'">Прогон</span><span class="cb85" data-a="cronpr" data-x="'+esc(j.id)+'">'+(j.on?'Пауза':'Включить')+'</span></div>'}).join('');
 return blk8('hermes',on.length+' из '+J.length+' по расписанию'+(bad.length?' · сбой':''),bad.length?'bad':on.length?'ok':'',rows+(more?'<div class="cm85" data-a="sys">ещё '+more+' · все задачи в «Системе» ›</div>':''))}
function codexBlk8(p){return blk8('codex','не подключён','','<div class="ac2">'+pb8('pchat8','','Чаты Codex','','codex')+pb8('pcx8','','Что это значит','off8')+'</div>')}
function detA2(p){var q=p.q.map(function(z){return '<div class="dq2"><div class="dl2">'+AN(z.ag||'claude')+(z.perm?' просит разрешение':' спрашивает')+' · '+ago(z.ts).replace(' назад','')+'</div><div class="qt2 full">'+esc(z.q)+'</div>'+qChips(z)+'</div>'}).join('');
 var meta=[p.ms?'веха '+esc(p.ms):'',p.total?p.done+' из '+p.total+' задач':'',p.tok?p.tok.toFixed(1)+' млн ток.':'',p.last?ago(p.last):''].filter(Boolean).join(' · ');
 var A=APPS8.filter(function(a){return p.apps.indexOf(a)>=0}).map(function(a){return a=='claude'?claudeBlk8(p):a=='hermes'?hermesBlk8(p):codexBlk8(p)}).join('');
 return '<div class="pd2">'+q+(meta||p.path?'<div class="mt2">'+meta+(p.path&&!PL()?'<br><span class="mono" style="font-size:11px">'+esc(p.path)+'</span>':'')+'</div>':'')+(p.total?'<div class="prog" style="margin-top:8px"><i style="width:'+Math.round(p.done/p.total*100)+'%"></i></div>':'')+A+'</div>'}

/* «Агенты» — только состояние. Тап по строке = фильтр проектов (U.pf), повторный тап снимает.
   Кнопка справа только при сбое самого агента: Claude — S.fails / окно Claude (health claude); Hermes — сбой cron / gateway. */
function pl8(n,a,b,c){return n+' '+(n%10==1&&n%100!=11?a:n%10>=2&&n%10<=4&&(n%100<10||n%100>=20)?b:c)}
function agRow8(app,name,dot,sub,btn){var on=(U.pf||'all')==app;return '<div class="row2 ag8'+(on?' on':'')+'" data-a="agf8" data-x="'+app+'">'+AB1(app,'m8')+'<div class="t2"><div class="n2"><span class="dot '+dot+'"></span><span class="nm2">'+name+'</span>'+(on?'<span class="fl85">фильтр</span>':'')+'</div><div class="d2">'+sub+'</div></div>'+(btn||'')+'</div>'}
function agBtn8(a,t,x){return '<div class="btn sm pri ab8" data-a="'+a+'"'+(x?' data-x="'+x+'"':'')+'>'+t+'</div>'}
function agents8(){var L=proj8(),bad=hBad(),hk=function(k){return bad.filter(function(h){return h.k==k})[0]},f=S.log.filter(function(e){return e.k=='fail'})[0],sum='';
 var of=function(a){return L.filter(function(p){return p.apps.indexOf(a)>=0})},R=[];
 /* Claude */
 var C=of('claude'),cw=C.filter(waiting8).length,cwork=C.filter(function(p){return p.st=='work'}).length,win=hk('claude'),cd,cs,cb='';
 cs='ведёт '+pl8(C.length,'проект','проекта','проектов')+' · '+(cw?cw+' '+(cw==1?'ждёт':'ждут'):'никто не ждёт');
 if(S.fails||win){cd='bad';cs=(win?'окно Claude: '+esc(win.d||'не отвечает'):'сбой ×'+S.fails+(f?': '+esc(f.x):''))+' · '+pl8(C.length,'проект','проекта','проектов');cb=win&&win.fix?agBtn8('fix',esc(win.fl||'Перезапустить'),win.k):agBtn8('heal','Проверить');sum='сбой Claude'}
 else if(S.stopped){cd='wait';cs='остановлен · '+cs}
 else{var np=paused()?C.filter(function(p){return p.auto}).length:0;cd=cw||np?'wait':cwork?'ok':'';if(np)cs+=' · '+np+' на паузе'}
 R.push(agRow8('claude','Claude',cd,cs,cb));
 /* Hermes */
 var Hm=of('hermes'),J=S.cj||[],on=J.filter(function(j){return j.on}),jb=on.filter(function(j){return !j.ok}),gw=hk('gateway'),hb='',hs=pl8(Hm.length,'проект','проекта','проектов')+' · '+pl8(on.length,'задача','задачи','задач')+' по расписанию';
 if(gw){hs='gateway: '+esc(gw.d||'не отвечает');hb=gw.fix?agBtn8('fix',esc(gw.fl||'Перезапустить'),gw.k):agBtn8('sys','Система');sum=sum||'сбой Hermes'}
 else if(jb.length){hs='сбой: '+esc(jb[0].n)+(jb.length>1?' и ещё '+(jb.length-1):'');hb=agBtn8('sys','Система');sum=sum||'сбой Hermes'}
 R.push(agRow8('hermes','Hermes',gw||jb.length?'bad':on.length?'ok':'',hs,hb));
 /* Codex */
 var X=of('codex');R.push(agRow8('codex','Codex','','не подключён'+(X.length?' · чаты в '+pl8(X.length,'проекте','проектах','проектах'):''),''));
 /* прочие сбои системы (не окно Claude и не gateway — они уже в строках агентов) */
 var rest=bad.filter(function(h){return h.k!='claude'&&h.k!='gateway'});
 if(rest.length){var fx=rest.filter(function(x){return x.fix})[0];R.push('<div class="row2 ag8 sys85"><span class="ag m8 sys8">'+IC('activity')+'</span><div class="t2"><div class="n2"><span class="dot bad"></span><span class="nm2">Система</span></div><div class="d2">'+esc(rest.map(function(x){return x.n}).join(', '))+(rest[0].d?' · '+esc(rest[0].d):'')+'</div></div>'+(fx?agBtn8('fix',esc(fx.fl||'Перезапустить'),fx.k):agBtn8('sys','Открыть'))+'</div>');sum=sum||'сбой системы'}
 return '<div class="sec"><div class="sh"><span>Агенты</span>'+(sum?'<span class="sum">'+sum+'</span>':'')+'</div><div class="grp">'+R.join('')+'</div></div>'}

/* плашка «Стоп всего»: пока S.stopped — сверху Пульта; сама кнопка «Остановить всё» — в Настройках */
function stopBar8(){return S.stopped?'<div class="stop85"><span class="si85">'+IC('square')+'</span><div class="st85"><b>Всё остановлено</b><small>автопилот и уведомления выключены</small></div><div class="btn sm pri" data-a="resume">Запустить всё</div></div>':''}
home=function(){['tok','tok14','auto','feed','strip','path'].forEach(function(k){if(U.col[k]===undefined)U.col[k]=true});
 return hd()+stopBar8()+updBanner()+netBanner()+agents8()+digestCard()+inboxH()+
  '<div class="sec"><div class="sh"><span>Проекты · '+proj8().length+'</span><a data-a="padd8">+ добавить</a></div></div>'+filtA2()+listA2()+moreA2()+hermesCard()};
/* Настройки: пока всё остановлено, вместо «Остановить всё» — «Запустить всё» (обе ветки: просто/тех) */
['settings','settingsT'].forEach(function(n){var f=window[n];if(typeof f!='function')return;window[n]=function(){var h=f.apply(this,arguments);
 return S.stopped?h.replace(/<div class="btn danger" data-a="stopsheet">[\s\S]*?<\/div>/,'<div class="hint85">Сейчас всё остановлено.</div><div class="btn pri" data-a="resume">'+IC('play')+' Запустить всё</div>'):h}});

/* «Вопросы»: боевые карточки + фильтр по приложению сверху + подпись проекта */
var _qH8=questions;questions=function(){var all=S.pend,f=U.qf8||'all',_hd=hd,_qa=qAlert;
 S.pend=all.filter(function(q){return f=='all'||appsOfQ8(q).indexOf(f)>=0});
 hd=function(){return _hd()+'<div style="margin-top:8px">'+appFilt8('qf8',all,appsOfQ8)+'</div>'};
 var h;try{h=_qH8()}finally{hd=_hd;S.pend=all}return h};

/* Start / Написать / Пауза уходят с pid проекта (бэкенд проверяет, что у проекта есть автопилот) */
var _send8=send;send=function(o,quiet){if(o&&U.pid8&&/^(start|say|pause)$/.test(o.a))o=Object.assign({pid:U.pid8},o);return _send8(o,quiet)};
document.addEventListener('click',function(ev){var el=ev.target.closest('[data-pid]');if(el)U.pid8=el.dataset.pid},true);
document.addEventListener('click',function(ev){var el=ev.target.closest('[data-a]');if(!el||!/^(pe|pg|af8|agf8|pchat8|pcx8|padd8)$/.test(el.dataset.a))return;
 var a=el.dataset.a,x=el.dataset.x;ev.stopPropagation();ev.preventDefault();haptic('sel');
 if(a=='pe'){U.pe=U.pe==x?null:x}
 else if(a=='pg'){U.pg=U.pg||{};U.pg[x]=!U.pg[x]}
 else if(a=='af8'){U[el.dataset.k]=x;U.pe=null}
 else if(a=='agf8'){U.pf=(U.pf||'all')==x?'all':x;U.pe=null}
 else if(a=='pcx8'){toast('Codex пока не подключён: статус и вопросы не отслеживаются. Чаты Codex открываются во вкладке «Чат».');return}
 else if(a=='padd8'){toast('Проекты появляются сами: папка, где за 14 дней был чат Claude или Codex, или cron Hermes с именем проекта. Автопилот Claude пока у одного проекта (tv-miniapp); для остальных — следующий этап.');return}
 else if(a=='pchat8'){U.tab='hc';U.page=null;render();setTimeout(function(){if(window.HC&&HC.st.kind!=x){var b=document.querySelector('[data-hc=kind][data-v="'+x+'"]');if(b)b.click()}},0);return}
 render(true)},true);
