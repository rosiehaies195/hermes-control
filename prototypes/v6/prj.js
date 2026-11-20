/* v8.7 «Вкладка Проекты + glass» (вид проекта — вариант B, выбран 20.11) (план: runbook miniapp-panel, «v8.6»; решение 2026-11-20 (4)).
   Слой поверх prototypes/v6/multi.js (v8.5, не выложена). Стиль Hermes не меняется: КАПС-заголовки .sh, .grp, qAlert, палитра.
   Новое: нижняя навигация Пульт · Проекты · Чат · Мозг · Ещё (glass, плавающая), Пульт = входящие (стоп, сбои, вопросы, сводка),
   вкладка «Проекты» (агенты-фильтр + список), отдельный экран проекта U.page='prj8',
   реестр агентов AGENTS8, «Ещё» = Журнал, Настройки, Система. Автопилот на проект × агент — пока только вид (бэкенд — следующий этап). */
Object.assign(ICP,{
 'folder-kanban':'<path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/><path d="M8 10v4"/><path d="M12 10v2"/><path d="M16 10v6"/>',
 'circle-ellipsis':'<circle cx="12" cy="12" r="10"/><path d="M17 12h.01"/><path d="M12 12h.01"/><path d="M7 12h.01"/>',
 'ellipsis':'<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
 'power':'<path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.77.04"/>',
 'chevron-left':'<path d="m15 18-6-6 6-6"/>'});

/* ---------- реестр агентов: новый агент = одна запись ---------- */
var AGENTS8={
 claude:{n:'Claude',app:'Claude Desktop',logo:'claude.svg',caps:['status','chats','questions','autopilot','next'],modes:['off','ask','full','pause'],
  next:'Начать следующий шаг',nextD:'Нажмёт Start в чате проекта в Claude Desktop: Claude возьмёт следующий шаг плана.'},
 codex:{n:'Codex',app:'Codex Desktop',logo:'codex.svg',caps:['chats','autopilot','next'],modes:['off','ask','full','pause'],wired:false,
  md:{full:'Когда сессия закончилась, сам берёт промпт из её конца, открывает новую сессию и запускает. Зовёт тебя по вопросам и сбоям.'},
  next:'Начать следующую сессию',nextD:'Возьмёт промпт из конца прошлой сессии, откроет новую в папке проекта и запустит.'},
 hermes:{n:'Hermes',app:'Hermes на ПК',logo:'logo-portrait.png',caps:['status','chats','cron','autopilot'],modes:['off','full','pause'],
  md:{off:'Задачи проекта по расписанию не запускаются.',full:'Задачи проекта идут по расписанию сами: кликер, сторож, уведомления.',pause:'Задачи проекта стоят до выбранного времени, потом пойдут снова.'}},
 higgsfield:{n:'Higgsfield',app:'Higgsfield',soon:true,ic:'sparkles',caps:[],modes:[]}
};
function agKeys86(all){return Object.keys(AGENTS8).filter(function(k){return all||!AGENTS8[k].soon})}
APPS8=agKeys86();agKeys86(true).forEach(function(k){ANM8[k]=AGENTS8[k].n});
function can86(app,c){var A=AGENTS8[app];return !!(A&&A.caps.indexOf(c)>=0)}

/* ---------- значки: одинаковые плитки, логотип одного размера, без наложений; Hermes — портрет целиком ---------- */
function TL(app,sz){var A=AGENTS8[app]||{n:app};return '<span class="tl86 '+(sz||'m')+' t-'+app+(A.soon?' soon':'')+'" title="'+esc(A.n)+'">'+(A.logo?'<img src="'+A.logo+'" alt="">':IC(A.ic||'bot'))+'</span>'}
function TLS(p,sz){return '<span class="tls86">'+p.apps.map(function(a){return TL(a,sz)}).join('')+'</span>'}
AB1=function(app,c){return TL(app,c=='m8'?'m':'xs')};
AB8=function(p,c){return TLS(p,c=='m8'?'m':'xs')};

/* ---------- автопилот: режимы и текущее состояние ---------- */
var MODES86={off:['Выкл','power','Сам ничего не делает. Шаги запускаешь ты, вопросы приходят тебе.'],
 ask:['Только вопросы','message-circle-question','Шаги сам не начинает. На вопросы отвечает по твоим правилам, остальные присылает тебе.'],
 full:['Полный','play','Сам начинает следующий шаг, когда прошлый готов, и ведёт вопросы. Зовёт тебя только по вопросам и сбоям.'],
 pause:['Пауза','pause','Ничего не делает до выбранного времени, потом вернётся в прежний режим.']};
function modeOf86(p,app){if(app=='claude'){if(!p.auto)return 'off';if(paused())return 'pause';return S.clicker.on?'full':'off'}
 if(app=='hermes'){var J=cronOf8(p);return J.filter(function(j){return j.on}).length?'full':'off'}return 'off'}
function mdx86(app,m){var A=AGENTS8[app];return A&&A.md&&A.md[m]||MODES86[m][2]}
function wired86(app){return AGENTS8[app]&&AGENTS8[app].wired!==false}
function modeLbl86(p,app,m){return m=='pause'&&app=='claude'&&paused()?'Пауза до '+hm(S.pause):MODES86[m][0]}
function setMode86(pid,app,m){var p=prjById8(pid);if(!p)return;var cur=modeOf86(p,app);
 if(S.stopped){toast('Сейчас всё остановлено. Сначала «Запустить всё» сверху Пульта.');return}
 if(!wired86(app)){toast(AGENTS8[app].n+' ещё не подключён: автопилот появится после подключения (следующий этап).');return}
 if(m==cur&&m!='pause'){toast('Уже включено: '+MODES86[m][0]);return}
 if(app=='claude'&&p.auto){if(m=='pause'){U.pid8=pid;pauseSheet();return}
  if(m=='full'){if(paused())send({a:'resume',pid:pid});else send(Object.assign(SET(S),{clicker:true}));return}}
 if(app=='hermes'&&m=='pause'){toast('Пауза задач Hermes этого проекта — в списке «Задачи по расписанию» (тап по задаче).');return}
 toast('Режим «'+MODES86[m][0]+'» для '+AGENTS8[app].n+' в «'+esc(p.n)+'» появится на следующем этапе (автопилот на несколько проектов).')}

/* ---------- состояние агента в проекте ---------- */
function stOf86(p,app){
 if(app=='claude'){if(!p.auto)return p.q.length?['wait','ждёт твоего ответа']:['',p.sub?'чат: '+p.sub:'автопилот выключен'];
  if(S.stopped)return ['wait','всё остановлено'];if(S.fails)return ['bad','сбой ×'+S.fails+' · Start не прошёл'];if(paused())return ['wait','пауза до '+hm(S.pause)];
  if(p.q.length)return ['wait','ждёт твоего ответа'];if(p.st=='work')return ['ok','работает над шагом'];return ['','ждёт следующего шага']}
 if(app=='hermes'){var J=cronOf8(p),on=J.filter(function(j){return j.on}),bad=on.filter(function(j){return !j.ok});
  if(!J.length)return ['','нет задач по расписанию'];if(bad.length)return ['bad','сбой задачи: '+cronName86(bad[0],p)];
  return on.length?['ok',pl8(on.length,'задача работает','задачи работают','задач работают')+' по расписанию']:['','задачи на паузе']}
 if(app=='codex')return ['','не подключён · видны только чаты'];
 return ['','скоро']}
/* одна главная кнопка с полным глаголом + остальное в «⋯» */
function main86(p,app){var A=AGENTS8[app];
 if(app=='claude'&&p.auto)return {a:'startsheet',x:'claude',t:A.next,d:A.nextD,ic:'play',dis:S.stopped};
 if(app=='codex')return {a:'pchat8',x:'codex',t:'Открыть чаты Codex',d:'Чаты Codex этого ПК во вкладке «Чат».',ic:'message-square-text'};
 if(app=='hermes')return {a:'pchat8',x:'hermes',t:'Написать Hermes',d:'Чат с Hermes во вкладке «Чат».',ic:'message-square-text'};
 return {a:'pchat8',x:app,t:'Открыть чаты '+A.n,d:'Чаты '+A.n+' во вкладке «Чат».',ic:'message-square-text'}}
function acts86(p,app){var L=[];
 if(app=='claude'&&p.auto){L.push(['saysheet','claude','pencil','Написать в чат проекта','Текст уйдёт в чат «'+p.n+'» в Claude Desktop, как будто ты набрал его на ПК.']);
  L.push(['proj','','target','Вехи и задачи','План проекта, прогресс вехи, последние коммиты.']);L.push(['pchat8','claude','message-square-text','Все чаты Claude','Чаты Claude Desktop и панели во вкладке «Чат».'])}
 else if(app=='claude')L.push(['pchat8','claude','message-square-text','Чаты Claude','Чаты Claude Desktop и панели во вкладке «Чат».']);
 if(app=='hermes'){L.push(['sys','','activity','Все задачи в «Системе»','Расписание, последние запуски и сбои всех задач Hermes.'])}
 if(app=='codex')L.push(['pcx8','','info','Что значит «не подключён»','Панель видит чаты Codex, но не следит за статусом и вопросами. Полное подключение — следующий этап.']);
 return L}

/* ---------- задачи Hermes: человеческие описания ---------- */
var CRON86=[[/кликер/i,'Нажимает Start в Claude, когда шаг готов'],[/watchdog|сторож/i,'Следит, что автоматика жива, и чинит сбои'],[/уведомлен/i,'Присылает вопросы и тревоги в Telegram'],
 [/токен/i,'Считает расход токенов за день'],[/синк|sync/i,'Сохраняет мозг на GitHub'],[/куратор/i,'Вечером переносит итоги дня в мозг'],[/монитор/i,'Старый монитор Start (заменён кликером)']];
function cronName86(j,p){var nm=(p&&p.n||'').length,t=(j.n||'');if(nm&&t.toLowerCase().indexOf(p.n.toLowerCase())==0)t=t.slice(nm).replace(/^[\s·:\-—]+/,'');
 for(var i=0;i<CRON86.length;i++)if(CRON86[i][0].test(j.n||''))return CRON86[i][1];return t||j.n}
function every86(j){if(!j.nx||!j.last||j.nx<=j.last)return '';var m=Math.round((j.nx-j.last)/60);return m<60?'каждые '+m+' мин':m<1440?'каждые '+Math.round(m/60)+' ч':'раз в день'}
function cronSub86(j){return !j.on?'на паузе':(j.ok?'':'сбой · ')+[every86(j),j.nx&&j.nx>nowS()?'следующий '+hm(j.nx):''].filter(Boolean).join(' · ')}
function cronBlk86(p){var J=cronOf8(p);if(!J.length)return '';U.cx86=U.cx86||{};var open=U.cx86[p.id],on=J.filter(function(j){return j.on}).length,bad=J.filter(function(j){return j.on&&!j.ok}).length;
 var head='<div class="rw86 tap" data-a="cx86" data-x="'+esc(p.id)+'"><span class="ri86">'+IC('clock')+'</span><div class="t2"><div class="n2">Задачи по расписанию</div><div class="d2">'+on+' из '+J.length+' работают'+(bad?' · сбой':'')+'</div></div><span class="cv86'+(open?' up':'')+'">'+IC('chevron-right')+'</span></div>';
 if(!open)return head;
 return head+J.slice().sort(function(a,b){return (b.on-a.on)||(b.last||0)-(a.last||0)}).map(function(j){return '<div class="rw86 sub tap" data-a="cj86" data-x="'+esc(j.id)+'" data-pid="'+esc(p.id)+'"><span class="dot '+(!j.on?'':j.ok?'ok':'bad')+'"></span><div class="t2"><div class="n2 w">'+esc(cronName86(j,p))+'</div><div class="d2">'+esc(cronSub86(j))+'</div></div><span class="cv86">'+IC('chevron-right')+'</span></div>'}).join('')}
function cronSheet86(id,pid){var j=(S.cj||[]).filter(function(x){return x.id==id})[0],p=prjById8(pid);if(!j)return;
 sheet('<h3>'+esc(cronName86(j,p))+'</h3><p>'+esc(j.n)+' · '+esc(cronSub86(j)||'')+(j.last?' · последний запуск '+hm(j.last):'')+'</p>'+
  '<div class="ma86" data-a="cronrun" data-x="'+esc(j.id)+'">'+IC('play')+'<div><b>Запустить сейчас</b><small>Один внеочередной прогон, расписание не меняется.</small></div></div>'+
  '<div class="ma86" data-a="cronpr" data-x="'+esc(j.id)+'">'+IC(j.on?'pause':'play')+'<div><b>'+(j.on?'Приостановить':'Включить')+'</b><small>'+(j.on?'Задача перестанет запускаться по расписанию, пока не включишь.':'Задача снова пойдёт по расписанию.')+'</small></div></div>')}

/* ---------- шторки: режим автопилота и «⋯» ---------- */
function modeSheet86(pid,app){var p=prjById8(pid),A=AGENTS8[app],cur=modeOf86(p,app);
 sheet('<h3>Автопилот · '+A.n+'</h3><p>Проект «'+esc(p.n)+'». Что '+A.n+' делает сам, пока тебя нет.</p>'+A.modes.map(function(m){var M=MODES86[m];
  return '<div class="ma86 rd86'+(m==cur?' on':'')+'" data-a="md86" data-x="'+m+'" data-k="'+app+'" data-pid="'+esc(pid)+'"><span class="rb86"></span><div><b>'+(m==cur?modeLbl86(p,app,m):M[0])+'</b><small>'+mdx86(app,m)+'</small></div></div>'}).join('')+
  (wired86(app)?'':'<p class="nt86">'+A.n+' ещё не подключён — выбор заработает после подключения.</p>'))}
function moreSheet86(pid,app){var p=prjById8(pid),A=AGENTS8[app];
 sheet('<h3>'+A.n+' · '+esc(p.n)+'</h3><p>Другие действия</p>'+acts86(p,app).map(function(r){return '<div class="ma86" data-a="'+r[0]+'"'+(r[1]?' data-x="'+r[1]+'"':'')+' data-pid="'+esc(p.id)+'">'+IC(r[2])+'<div><b>'+r[3]+'</b><small>'+esc(r[4])+'</small></div></div>'}).join(''))}

/* ---------- блок агента в проекте: три варианта вида ---------- */
function head86(p,app){var s=stOf86(p,app),A=AGENTS8[app];return '<div class="ah86">'+TL(app,'m')+'<div class="t2"><div class="n2">'+A.n+'</div><div class="d2"><span class="dot '+s[0]+'"></span>'+esc(s[1])+'</div></div></div>'}
/* блок агента (вариант B, выбран 20.11): строки как в Настройках iOS — значение режима справа, выбор в шторке с пояснениями;
   строка автопилота подсвечивается цветом состояния (пауза, сбой, всё остановлено) */
function tone86(p,app){if(S.stopped)return 'warn';var s=stOf86(p,app)[0];if(s=='bad')return 'bad';return modeOf86(p,app)=='pause'?'wait':''}
function blkB86(p,app){var A=AGENTS8[app],cur=modeOf86(p,app),M=main86(p,app),L=acts86(p,app);
 var rows=head86(p,app).replace('class="ah86"','class="ah86 rw86"');
 if(can86(app,'autopilot')){var tn=wired86(app)?tone86(p,app):'';rows+='<div class="rw86 tap ap86'+(tn?' tn-'+tn:'')+'" data-a="msh86" data-x="'+app+'" data-pid="'+esc(p.id)+'"><span class="ri86">'+IC(tn=='bad'?'triangle-alert':tn=='warn'?'square':cur=='pause'?'pause':'zap')+'</span><div class="t2"><div class="n2">Автопилот</div><div class="d2">'+(!wired86(app)?'появится после подключения':tn=='warn'?'Всё остановлено: автопилот не работает, пока не нажмёшь «Запустить всё».':tn=='bad'?esc(stOf86(p,app)[1])+' · '+esc(mdx86(app,cur)):esc(mdx86(app,cur)))+'</div></div><span class="vl86'+(cur=='off'?'':' on')+'">'+(!wired86(app)?'—':tn=='warn'?'Остановлен':modeLbl86(p,app,cur))+'</span><span class="cv86">'+IC('chevron-right')+'</span></div>'}
 if(app=='hermes')rows+=cronBlk86(p);
 rows+='<div class="rw86 tap act'+(M.dis?' dis':'')+'" data-a="'+M.a+'" data-x="'+M.x+'" data-pid="'+esc(p.id)+'"><span class="ri86 g">'+IC(M.ic)+'</span><div class="t2"><div class="n2 g">'+M.t+'</div><div class="d2">'+esc(M.d)+'</div></div></div>';
 if(L.length)rows+='<div class="rw86 tap" data-a="ms86" data-x="'+app+'" data-pid="'+esc(p.id)+'"><span class="ri86">'+IC('ellipsis')+'</span><div class="t2"><div class="n2">Другие действия</div><div class="d2">'+esc(L.map(function(r){return r[3]}).join(', '))+'</div></div><span class="cv86">'+IC('chevron-right')+'</span></div>';
 return '<div class="sec"><div class="sh"><span>'+A.n+'</span></div><div class="grp">'+rows+'</div></div>'}
/* ---------- экран проекта ---------- */
function prjPage86(){var p=prjById8(U.pid86);if(!p){U.page=null;return prjTab86()}
 var dot=p.st=='wait'?'wait':p.st=='bad'?'bad':p.st=='work'?'ok':'',stt=(ST8[p.st]||ST8.idle)[0];
 var meta=[p.ms?'веха '+esc(p.ms):'',p.total?p.done+' из '+p.total+' задач':'',p.tok?p.tok.toFixed(1)+' млн ток.':'',p.last?ago(p.last):''].filter(Boolean).join(' · ');
 var h='<div class="back" data-a="back">'+IC('chevron-left')+'Проекты</div><div class="ph ph86">'+TLS(p,'l')+'<div style="min-width:0"><h2>'+esc(p.n)+'</h2><div class="d"><span class="dot '+dot+'"></span><span class="ds86">'+(p.st!='idle'&&p.sub?esc(p.sub):stt)+'</span></div></div></div>'+
  (meta?'<div class="mt86">'+meta+'</div>':'')+(p.total?'<div class="sec"><div class="prog"><i style="width:'+Math.round(p.done/p.total*100)+'%"></i></div></div>':'')+stopBar8();
 if(p.q.length)h+='<div class="sec"><div class="sh"><span>Вопросы · '+p.q.length+'</span></div></div>'+p.q.map(qAlert).join('');
 var L=APPS8.filter(function(a){return p.apps.indexOf(a)>=0});
 h+=L.map(function(a){return blkB86(p,a)}).join('');
 return h}

/* ---------- вкладка «Проекты» ---------- */
function agSt86(app){var L=proj8().filter(function(p){return p.apps.indexOf(app)>=0}),A=AGENTS8[app],w=L.filter(function(p){return p.st=='wait'}).length,bad=hBad();
 if(A.soon)return ['','скоро'];
 if(app=='claude'&&(S.fails||bad.some(function(h){return h.k=='claude'})))return ['bad','сбой · '+pl8(L.length,'проект','проекта','проектов')];
 if(app=='hermes'&&(bad.some(function(h){return h.k=='gateway'})||(S.cj||[]).some(function(j){return j.on&&!j.ok})))return ['bad','сбой задачи'];
 if(!wired86(app))return ['',pl8(L.length,'проект','проекта','проектов')+' · не подключён'];
 if(S.stopped)return ['wait','остановлен'];
 return [w?'wait':L.some(function(p){return p.st=='work'})?'ok':'',pl8(L.length,'проект','проекта','проектов')+(w?' · '+w+' '+(w==1?'ждёт':'ждут'):'')]}
function agStrip86(){return '<div class="sec"><div class="sh"><span>Агенты</span>'+((U.pf||'all')!='all'?'<a data-a="agf86" data-x="all">показать все</a>':'')+'</div><div class="ags86">'+agKeys86(true).map(function(k){var s=agSt86(k),on=(U.pf||'all')==k;
 return '<div class="'+(on?'on':'')+(AGENTS8[k].soon?' soon':'')+'" data-a="agf86" data-x="'+k+'">'+TL(k,'m')+'<b>'+AGENTS8[k].n+'</b><small><span class="dot '+s[0]+'"></span>'+esc(s[1])+'</small></div>'}).join('')+'</div></div>'}
rowA2=function(p){var dot=p.st=='wait'?'wait':p.st=='bad'?'bad':p.st=='work'?'ok':'';
 var right=p.q.length?'<span class="qb8">'+p.q.length+'</span>':p.st=='bad'?'<span class="bd2">сбой</span>':p.last?'<span class="fr2">'+ago8(p.last)+'</span>':'';
 var au=p.apps.some(function(a){return modeOf86(p,a)!='off'});
 return '<div class="row2" data-a="po86" data-x="'+esc(p.id)+'">'+TLS(p,'s')+'<div class="t2"><div class="n2"><span class="dot '+dot+'"></span><span class="nm2">'+esc(p.n)+'</span>'+(au?'<span class="au86">авто</span>':'')+'</div><div class="d2">'+(p.q.length?esc(p.q[0].q):esc(p.sub||''))+'</div></div>'+right+'<span class="cv86">'+IC('chevron-right')+'</span></div>'};
function prjTab86(){return hd()+agStrip86()+'<div class="sec"><div class="sh"><span>Проекты · '+proj8().length+'</span><a data-a="padd8">+ добавить</a></div></div>'+listA2()}

/* ---------- Пульт: стоп, сбои, вопросы, сводка ---------- */
function fRow86(app,t,d,btn){return '<div class="row2 ag8 nf86">'+(app=='sys'?'<span class="tl86 m t-sys">'+IC('activity')+'</span>':TL(app,'m'))+'<div class="t2"><div class="n2"><span class="dot bad"></span><span class="nm2">'+t+'</span></div><div class="d2">'+d+'</div></div>'+(btn||'')+'</div>'}
function faults86(){var bad=hBad(),hk=function(k){return bad.filter(function(h){return h.k==k})[0]},f=S.log.filter(function(e){return e.k=='fail'})[0],R=[];
 var win=hk('claude');if(S.fails||win)R.push(fRow86('claude',win?'Окно Claude не отвечает':'Claude: сбой ×'+S.fails,esc(win?(win.d||''):(f?f.x:'Start не прошёл')),win&&win.fix?agBtn8('fix',esc(win.fl||'Перезапустить'),win.k):agBtn8('heal','Проверить')));
 var gw=hk('gateway'),jb=(S.cj||[]).filter(function(j){return j.on&&!j.ok});
 if(gw)R.push(fRow86('hermes','Hermes: бот не отвечает',esc(gw.d||'gateway'),gw.fix?agBtn8('fix',esc(gw.fl||'Перезапустить'),gw.k):agBtn8('sys','Система')));
 else if(jb.length)R.push(fRow86('hermes','Hermes: сбой задачи',esc(cronName86(jb[0]))+(jb.length>1?' и ещё '+(jb.length-1):''),agBtn8('sys','Система')));
 var rest=bad.filter(function(h){return h.k!='claude'&&h.k!='gateway'});
 if(rest.length){var fx=rest.filter(function(x){return x.fix})[0];R.push(fRow86('sys','Система',esc(rest.map(function(x){return x.n}).join(', ')),fx?agBtn8('fix',esc(fx.fl||'Перезапустить'),fx.k):agBtn8('sys','Открыть')))}
 return R.length?'<div class="sec"><div class="sh"><span>Сбои · '+R.length+'</span></div><div class="grp">'+R.join('')+'</div></div>':''}
function sumRow86(){var L=proj8(),bd=L.filter(function(p){return p.st=='bad'}).length,w=L.filter(function(p){return p.st=='wait'}).length,wk=L.filter(function(p){return p.st=='work'}).length,id=L.length-w-wk-bd;
 var parts=[bd?'<b class="sbad86">'+bd+' '+(bd==1?'со сбоем':'со сбоем')+'</b>':'',w?'<b class="wt86">'+w+' '+(w==1?'ждёт':'ждут')+'</b>':'',wk?wk+' '+(wk==1?'работает':'работают'):'',id?id+' '+(id==1?'свободен':'свободны'):''].filter(Boolean).join(' · ');
 return '<div class="sec"><div class="sh"><span>Проекты · '+L.length+'</span></div><div class="grp"><div class="rw86 tap" data-a="tab" data-x="prj"><span class="tls86">'+agKeys86().map(function(k){return TL(k,'s')}).join('')+'</span><div class="t2"><div class="n2 w">'+parts+'</div><div class="d2">'+(w||bd?esc(L.filter(waiting8).map(function(p){return p.n}).join(', ')):'все проекты и их агенты — во вкладке «Проекты»')+'</div></div><span class="cv86">'+IC('chevron-right')+'</span></div></div></div>'}
home=function(){var P=S.pend,fl=faults86();
 var q=P.length?'<div class="sec"><div class="sh"><span>Вопросы · '+P.length+'</span></div></div>'+P.map(qAlertP8).join(''):'';
 var calm=!P.length&&!fl&&!S.stopped?'<div class="calm86">'+IC('check')+'<div><b>Всё спокойно</b><small>Вопросов и сбоев нет. Когда агенту что-то понадобится, оно появится здесь.</small></div></div>':'';
 return hd()+stopBar8()+updBanner()+netBanner()+fl+q+calm+sumRow86()};

/* ---------- «Ещё»: Журнал, Настройки, Система + сводка ---------- */
function moreTab86(){var hb=hBad().length;['tok','tok14','auto','feed'].forEach(function(k){if(U.col[k]===undefined)U.col[k]=true});
 var R=[['tab','j','scroll-text','Журнал','сессии, события, «пока ты спал»',''],['tab','set','settings','Настройки','уведомления, автоответ, Face ID, «Остановить всё»',''],['sys','','activity','Система',hb?hb+' требуют внимания':'все компоненты в норме',hb?'bad':'ok']];
 return hd()+'<div class="sec"><div class="grp">'+R.map(function(r){return '<div class="rw86 tap" data-a="'+r[0]+'"'+(r[1]?' data-x="'+r[1]+'"':'')+'><span class="ri86">'+IC(r[2])+'</span><div class="t2"><div class="n2">'+r[3]+'</div><div class="d2">'+(r[5]?'<span class="dot '+r[5]+'"></span>':'')+r[4]+'</div></div><span class="cv86">'+IC('chevron-right')+'</span></div>'}).join('')+'</div></div>'+
  '<div class="mr86">'+(S.queue&&S.queue.length?queueCard():'')+tokens()+(S.tok14&&S.tok14.sum?colSec('tok14','Токены · 14 дней',tok14(),''):'')+autoGrp()+feed()+'</div>'}
/* «Пока ты спал» уехал с Пульта в Журнал */
['journal'].forEach(function(n){var f=window[n];window[n]=function(){var h=f.apply(this,arguments),d=digestCard(),H=hd(),i=h.indexOf(H);return d&&i>=0?h.slice(0,i+H.length)+d+h.slice(i+H.length):h}});

/* ---------- нижняя навигация glass ---------- */
function navCur86(){var p=U.page||'';if(p=='sys'||p.indexOf('sess:')==0)return 'more';if(p=='prj8'||p=='proj')return 'prj';if(p.indexOf('doc:')==0||p=='nowedit'||p=='glos')return 'br';if(p=='hcchat')return 'hc';
 return {j:'more',set:'more',q:'home'}[U.tab]||U.tab}
function nav86(){var c=navCur86(),hb=hBad().length;
 $('nav').innerHTML=[['home','house','Пульт'],['prj','folder-kanban','Проекты'],['hc','message-square-text','Чат'],['br','brain','Мозг'],['more','circle-ellipsis','Ещё']].map(function(t){
  var b=t[0]=='home'&&S.pend.length?'<span class="badge">'+S.pend.length+'</span>':t[0]=='more'&&hb?'<span class="badge" style="background:var(--bad)">!</span>':'';
  return '<div class="'+(c==t[0]?'on':'')+'" data-a="tab" data-x="'+t[0]+'"><i>'+IC(t[1])+'</i>'+t[2]+b+'</div>'}).join('');
 document.body.classList.add('g86')}
var _render86=render;render=function(keep){if(U.tab=='q')U.tab='home';
 var mine=!LOADING&&(U.page=='prj8'||!U.page&&(U.tab=='prj'||U.tab=='more'));
 if(!mine){_render86(keep);if(!LOADING&&!U.page&&(U.tab=='j'||U.tab=='set')){var sc=$('scr');if(sc&&!sc.querySelector('.bm86'))sc.insertAdjacentHTML('afterbegin','<div class="back bm86" data-a="tab" data-x="more">'+IC('chevron-left')+'Ещё</div>')}}
 else{var top=window.scrollY;$('scr').innerHTML=U.page=='prj8'?prjPage86():U.tab=='prj'?prjTab86():moreTab86();window.scrollTo(0,keep?top:0);try{if(inTG())U.page?tg.BackButton.show():tg.BackButton.hide()}catch(e){}}
 if(!LOADING)nav86()};
var _back86=back;back=function(){if(U.page=='proj'&&U.ret86){U.page='prj8';U.ret86=null;render();return}_back86()};

/* ---------- клики прототипа (capture: раньше общих обработчиков) ---------- */
document.addEventListener('click',function(ev){var sh=ev.target.closest('#sheet .ma86');if(sh&&!/^(md86)$/.test(sh.dataset.a))unsheet();
 var el=ev.target.closest('[data-a]');if(!el)return;var a=el.dataset.a,x=el.dataset.x,pid=el.dataset.pid;
 if(a=='tab'&&x=='q'){ev.stopPropagation();ev.preventDefault();U.tab='home';U.page=null;render();return}
 if(a=='proj'&&U.page=='prj8'){U.ret86=1;return}
 if(a=='startsheet'||a=='saysheet'){if(pid)U.pid8=pid;return}
 if(!/^(po86|agf86|md86|msh86|ms86|cx86|cj86)$/.test(a))return;ev.stopPropagation();ev.preventDefault();haptic('sel');
 if(a=='po86'){U.page='prj8';U.pid86=x;render();return}
 if(a=='agf86'){if(x!='all'&&AGENTS8[x]&&AGENTS8[x].soon){toast(AGENTS8[x].n+' — следующий агент. Подключается одной записью в реестре агентов: имя, логотип и что он умеет (статус, чаты, вопросы, автопилот).');return}U.pf=x=='all'||(U.pf||'all')==x?'all':x;U.pg=U.pg||{};U.pg.idle=U.pf=='all'}
 else if(a=='md86'){if(el.closest('#sheet'))unsheet();setMode86(pid,el.dataset.k,x);return}
 else if(a=='msh86'){modeSheet86(pid,x);return}
 else if(a=='ms86'){moreSheet86(pid,x);return}
 else if(a=='cx86'){U.cx86=U.cx86||{};U.cx86[x]=!U.cx86[x]}
 else if(a=='cj86'){cronSheet86(x,pid);return}
 render(true)},true);
