/* Этап 3.5 (решение (10), runbook panel-next): простые переключатели вместо режимов автопилота. Слой поверх prj.js/auto.js/s3.js.
   Данные tv_multi: p.am[ag] = {m (совместимость: off|full|pause), next, pu (пауза до | -1 без срока), why, t, ans {on,min,rule,rules,deny}
   (у Claude; без своих настроек = общий «Автоответ» из Настроек), own, allow {on, deny|null (= стандартный), ta}, legacy/clk (проект
   кликера, пока «Сам начинает» не выбран)}; p.wait = {k: stop|pause|perm|q|bad|card|end|auto|work|idle, t, ag} — «что ждёт тебя»;
   S.gdeny — стандартный стоп-список. Действия → {a:'ap2', pid, ag, k: next|ans|allow|pause, on, until, min, rule, deny, bio}. */
function am35(p,ag){return p&&p.am&&p.am[ag]||null}
function pz35(a){return !!a&&!a.legacy&&(a.pu==-1||a.pu>nowS())}
function pzTxt35(a){return a.pu==-1?'без срока':'до '+hm(a.pu)}
function den35(a){return a&&a.allow&&a.allow.deny?a.allow.deny:(S.gdeny||[])}
function swr35(p,ag,k,on,ic,title,desc,tap,tone){
 return '<div class="rw86 sw35'+(tap?' tap':'')+(tone?' tn-'+tone:'')+'"'+(tap?' data-a="'+tap+'" data-x="'+ag+'" data-pid="'+esc(p.id)+'"':'')+'><span class="ri86">'+IC(ic)+'</span>'+
  '<div class="t2"><div class="n2">'+title+'</div><div class="d2">'+desc+'</div></div>'+
  '<div class="sw'+(on?' on':'')+'" data-a="sw35" data-k="'+k+'" data-x="'+ag+'" data-pid="'+esc(p.id)+'" role="switch" aria-checked="'+!!on+'"></div></div>'}
function ansTxt35(a){var A=a.ans||S.auto||{};if(!A.on)return 'Вопросы — тебе';
 return 'Через '+A.min+' мин — '+(A.rule=='first'?'рекоменд. или первый':'рекомендованный')+((A.deny||[]).length?' · стоп-слова':'')}
function allowTxt35(a){return a.allow&&a.allow.on?'Кроме опасных ('+den35(a).length+' правил) · в Журнале':'Разрешения — тебе · через Face ID'}
function nextTxt35(p,ag,a){if(ag=='codex')return 'Открывает следующую сессию';
 if(a.legacy)return a.clk?'Сейчас Start жмёт кликер':'Кликер выключен: Start никто не жмёт';
 return 'Жмёт Start за тебя'}
(function(){
 var b0=blkB86;blkB86=function(p,app){var a=am35(p,app),A=AGENTS8[app];
  if(app=='hermes'){var J=cronOf8(p);if(!J.length)return b0(p,app);var on=J.filter(function(j){return j.on}).length,M=main86(p,app),L=acts86(p,app);
   var rows=head86(p,app).replace('class="ah86"','class="ah86 rw86"')+swr35(p,'hermes','next',on>0,'clock','Задачи по расписанию',on?on+' из '+J.length+' идут сами по расписанию':'Все '+J.length+' на паузе: по расписанию ничего не запускается.','')+cronBlk86(p).replace('<div class="n2">Задачи по расписанию</div>','<div class="n2">Список задач</div>');
   rows+=act35(p,app,M,L);return '<div class="sec"><div class="sh"><span>'+A.n+'</span></div><div class="grp">'+rows+'</div></div>'}
  if(!a||(app!='claude'&&app!='codex'))return b0(p,app);
  var M=main86(p,app),L=acts86(p,app),pz=pz35(a);
  var rows=head86(p,app).replace('class="ah86"','class="ah86 rw86"');
  if(pz)rows+='<div class="rw86 pz35 tn-wait"><span class="ri86">'+IC('pause')+'</span><div class="t2"><div class="n2">На паузе '+pzTxt35(a)+'</div><div class="d2">'+(a.why?esc(a.why):'Ничего сам не начинает и не отвечает; идущая сессия доработает.')+'</div></div><div class="btn sm pri ab8" data-a="unp35" data-x="'+app+'" data-pid="'+esc(p.id)+'">Снять</div></div>';
  rows+=swr35(p,app,'next',a.next,'play','Сам начинает следующий шаг',nextTxt35(p,app,a),'',a.legacy&&a.clk?'':'');
  if(app=='claude'){rows+=swr35(p,app,'ans',!!(a.ans&&a.ans.on),'message-circle-question','Сам отвечает на вопросы',ansTxt35(a),'ans35');
   rows+=swr35(p,app,'allow',!!(a.allow&&a.allow.on),'shield-check','Сам разрешает команды',allowTxt35(a),'alw35')}
  if(!pz)rows+='<div class="rw86 tap" data-a="psh35" data-x="'+app+'" data-pid="'+esc(p.id)+'"><span class="ri86">'+IC('pause')+'</span><div class="t2"><div class="n2">Пауза на…</div><div class="d2">1 ч · 3 ч · до утра · без срока</div></div><span class="cv86">'+IC('chevron-right')+'</span></div>';
  rows+=act35(p,app,M,L);
  return '<div class="sec"><div class="sh"><span>'+A.n+'</span></div><div class="grp">'+rows+'</div></div>'};
 function act35(p,app,M,L){var r='';if(M)r+='<div class="rw86 tap act'+(M.dis?' dis':'')+'" data-a="'+M.a+'" data-x="'+M.x+'" data-pid="'+esc(p.id)+'"><span class="ri86 g">'+IC(M.ic)+'</span><div class="t2"><div class="n2 g">'+M.t+'</div><div class="d2">'+esc(M.d)+'</div></div></div>';
  if(L&&L.length)r+='<div class="rw86 tap" data-a="ms86" data-x="'+app+'" data-pid="'+esc(p.id)+'"><span class="ri86">'+IC('ellipsis')+'</span><div class="t2"><div class="n2">Другие действия</div><div class="d2">'+esc(L.map(function(x){return x[3]}).join(', '))+'</div></div><span class="cv86">'+IC('chevron-right')+'</span></div>';return r}
 window.act35=act35;
 /* «что ждёт тебя» на экране проекта: только то, что требует действия и больше нигде не видно (карточка Start, план закончен).
    Вопросы/разрешения — карточки ниже, пауза — плашка в блоке агента, «всё остановлено» — плашка сверху, работа/свободен — строка под именем. */
 var pg0=prjPage86;prjPage86=function(){var h=pg0(),p=prjById8(U.pid86);if(!p||S.stopped||!p.wait||!/^(card|end)$/.test(p.wait.k))return h;
  var row='<div class="sec wt35"><div class="sh"><span>Ждёт тебя</span></div><div class="grp">'+wrow35(p,1)+'</div></div>';
  var i=h.indexOf('<div class="sec"><div class="sh">');return i<0?h+row:h.slice(0,i)+row+h.slice(i)};
 /* автоответ на карточке вопроса — по настройкам проекта вопроса */
 var al0=autoLine;autoLine=function(q){var p=q&&q.pid&&prjById8(q.pid),a=p&&am35(p,'claude');if(!a||!a.ans)return al0(q);if(pz35(a))return '';
  var keep=S.auto;S.auto=a.ans;try{return al0(q)}finally{S.auto=keep}};
 /* Настройки: общий «Автоответ» = умолчания для новых проектов */
 ['settings','settingsT'].forEach(function(n){var f=window[n];if(!f)return;window[n]=function(){var h=f.apply(this,arguments),note='<div class="row nt35"><div class="t"><div class="d">Это значения по умолчанию для новых проектов. У каждого проекта свои: Проекты → проект → Claude → «Сам отвечает на вопросы».</div></div></div>';
  /* только в тело СВОЕГО раздела: у свёрнутого тела нет — раньше подсказка уезжала в соседний раскрытый блок */
  return h.replace(/(<span>(?:Автоответ|Отвечать за меня)<\/span>(?:(?!<div class="sec)[\s\S])*?<div class="grp">)/,function(m){return m.replace(/<span>(Автоответ|Отвечать за меня)<\/span>/,'<span>$1 · по умолчанию</span>')+note})}});
})();

function pauseSheet35(pid,app){var p=prjById8(pid);if(!p)return;var n=Math.round(nowS()),d=new Date();d.setHours(9,0,0,0);if(d.getTime()/1000<=n+60)d.setDate(d.getDate()+1);
 var O=[['1 час',n+3600],['3 часа',n+10800],['До утра ('+(d.getDate()==new Date().getDate()?'':'завтра ')+'09:00)',Math.round(d.getTime()/1000)],['Без срока — пока не сниму',-1]];
 sheet('<h3>Пауза · '+AGENTS8[app].n+'</h3><p>Проект «'+esc(p.n)+'». На паузе '+AGENTS8[app].n+' сам ничего не начинает'+(app=='claude'?', не отвечает и не разрешает':'')+'; идущая сессия доработает. Переключатели остаются как есть.</p>'+
  O.map(function(o){return '<div class="ma86" data-a="pgo35" data-u="'+o[1]+'" data-x="'+app+'" data-pid="'+esc(pid)+'">'+IC('pause')+'<div><b>'+o[0]+'</b><small>'+(o[1]>0?'Потом всё пойдёт само, как было.':'Снимешь сам: «Снять» на плашке.')+'</small></div></div>'}).join(''))}
function ansSheet35(pid){var p=prjById8(pid),a=p&&am35(p,'claude');if(!a)return;var A=a.ans||S.auto;U.ans35={pid:pid,min:A.min||15,rule:A.rule||'rec',deny:(A.deny||[]).join(', ')};paintAns35()}
function paintAns35(){var D=U.ans35,p=prjById8(D.pid);
 sheet('<h3>Сам отвечает на вопросы · Claude</h3><p>Проект «'+esc(p.n)+'». Вопросы всегда приходят тебе в Telegram и панель. Если ты не ответил за выбранное время, выберу вариант, рекомендованный Claude (или по твоему правилу). Разрешения так не отвечаются.</p>'+
  '<div class="d2 lb35">Ждать ответа</div>'+seg([5,10,15,30,60],D.min,'amin35',' мин')+
  '<div class="d2 lb35">Что выбирать</div>'+seg(['rec','first'],D.rule,'arule35','',['Рекомендованный','Рекоменд. или первый'])+
  '<div class="d2 lb35">Стоп-слова — такие вопросы всегда тебе (через запятую)</div><input class="in" id="adeny35" value="'+esc(D.deny)+'" placeholder="удалить, оплата, push">'+
  '<div class="btn pri" data-a="asave35">Сохранить</div><div class="btn" data-a="unsheet">Отмена</div>')}
function allowSheet35(pid){var p=prjById8(pid),a=p&&am35(p,'claude');if(!a)return;U.alw35={pid:pid,t:den35(a).join('\n')};
 sheet('<h3>Стоп-список · разрешения</h3><p>Проект «'+esc(p.n)+'». Эти команды и файлы всегда идут тебе картой Allow/Deny, даже когда «Сам разрешает» включён. Одно правило на строку; * — что угодно; правки файлов вне папки проекта тоже всегда тебе.</p>'+
  '<textarea class="in" id="alw35" rows="9">'+esc(U.alw35.t)+'</textarea>'+
  '<div class="btn pri" data-a="lsave35">Сохранить стоп-список</div><div class="btn" data-a="ldef35">Вернуть стандартный ('+(S.gdeny||[]).length+')</div><div class="btn" data-a="unsheet">Отмена</div>')}
function cardSheet35(pid){var p=prjById8(pid),c=p&&card3(p);if(!c)return;
 sheet('<h3>Есть карточка Start</h3><p>В проекте «'+esc(p.n)+'» уже ждёт карточка «'+esc(c.title)+'». Она появилась до включения, поэтому сам я её не нажму. Нажать сейчас?</p>'+
  '<div class="btn pri" data-a="clgo" data-pid="'+esc(pid)+'">'+IC('play')+' Нажать сейчас</div><div class="btn" data-a="unsheet">Нет, подожду следующую</div>')}
function ap35(o){send(Object.assign({a:'ap2'},o))}
document.addEventListener('input',function(ev){var t=ev.target;if(!t)return;if(t.id=='adeny35'&&U.ans35)U.ans35.deny=t.value;if(t.id=='alw35'&&U.alw35)U.alw35.t=t.value},true);
document.addEventListener('click',function(ev){var el=ev.target.closest('[data-a]');if(!el)return;var a=el.dataset.a;
 if(!/^(sw35|psh35|pgo35|unp35|ans35|alw35|amin35|arule35|asave35|lsave35|ldef35)$/.test(a))return;ev.stopPropagation();ev.preventDefault();haptic('sel');
 var pid=el.dataset.pid||(U.ans35||{}).pid||(U.alw35||{}).pid||U.pid86,ag=el.dataset.x,p=prjById8(pid);
 if(a=='sw35'){var k=el.dataset.k,on=!el.classList.contains('on'),am=p&&am35(p,ag);
  if(on&&S.stopped){toast('Сейчас всё остановлено. Сначала «Запустить всё» сверху Пульта.');return}
  if(ag=='hermes'){ap35({pid:pid,ag:'hermes',k:'next',on:on});return}
  if(k=='allow'&&on){bioAuth('Включить «Сам разрешает команды» в проекте «'+(p?p.n:'')+'»: команды без опасных будут разрешаться без тебя',function(){ap35({pid:pid,ag:ag,k:'allow',on:true,bio:1})});return}
  el.classList.toggle('on',on);ap35({pid:pid,ag:ag,k:k,on:on});
  if(k=='next'&&on&&ag=='claude'&&p&&card3(p))setTimeout(function(){cardSheet35(pid)},350);
  return}
 if(a=='psh35'){pauseSheet35(pid,ag);return}
 if(a=='pgo35'){unsheet();ap35({pid:pid,ag:ag,k:'pause',until:+el.dataset.u});return}
 if(a=='unp35'){ap35({pid:pid,ag:ag||'claude',k:'pause',until:0});return}
 if(a=='ans35'){if(ev.target.closest('.sw'))return;ansSheet35(pid);return}
 if(a=='alw35'){if(ev.target.closest('.sw'))return;allowSheet35(pid);return}
 if(a=='amin35'){U.ans35.min=+el.dataset.x;paintAns35();return}
 if(a=='arule35'){U.ans35.rule=el.dataset.x;paintAns35();return}
 if(a=='asave35'){var D=U.ans35;unsheet();ap35({pid:D.pid,ag:'claude',k:'ans',min:D.min,rule:D.rule,deny:D.deny.split(',').map(function(s){return s.trim()}).filter(Boolean)});return}
 if(a=='lsave35'){var L=U.alw35;unsheet();ap35({pid:L.pid,ag:'claude',k:'allow',deny:L.t.split('\n').map(function(s){return s.trim()}).filter(Boolean)});return}
 if(a=='ldef35'){var L2=U.alw35;unsheet();ap35({pid:L2.pid,ag:'claude',k:'allow',deny:(S.gdeny||[]).slice()});return}},true);
/* Пульт и список проектов по переключателям (иначе «Стало» на главных вкладках выглядело как «Было»):
   плашка у строки проекта считается по переключателям, а не по старым режимам; в подписи строки — «что ждёт тебя»;
   на Пульте блок «Ждёт тебя» (карточка Start, план закончен, пауза, сбой), вопросы и разрешения остаются карточками. */
function chip35(p){var pz=0,on=0,clk=0;(p.apps||[]).forEach(function(ag){var a=am35(p,ag);if(!a)return;
  if(pz35(a))pz=1;if(a.next||(a.ans&&a.ans.on)||(a.allow&&a.allow.on))on=1;if(a.legacy&&a.clk)clk=1});
 return pz?'<span class="au86 pz35c">пауза</span>':on?'<span class="au86">сам</span>':clk?'<span class="au86 ck35c">кликер</span>':''}
var WK35={card:1,end:1,pause:1,bad:1};
function wsub35(p){var w=p.wait;return w&&w.t&&WK35[w.k]&&!S.stopped?w.t:''}
rowA2=function(p){var dot=p.st=='wait'?'wait':p.st=='bad'?'bad':p.st=='work'?'ok':'',ws=wsub35(p);
 if(!dot&&ws&&p.wait.k!='end')dot='wait';
 var right=p.q.length?'<span class="qb8">'+p.q.length+'</span>':p.st=='bad'?'<span class="bd2">сбой</span>':p.last?'<span class="fr2">'+ago8(p.last)+'</span>':'';
 return '<div class="row2" data-a="po86" data-x="'+esc(p.id)+'">'+TLS(p,'s')+'<div class="t2"><div class="n2"><span class="dot '+dot+'"></span><span class="nm2">'+esc(p.n)+'</span>'+chip35(p)+'</div><div class="d2">'+(p.q.length?esc(p.q[0].q):esc(ws||p.sub||''))+'</div></div>'+right+'<span class="cv86">'+IC('chevron-right')+'</span></div>'};
function wrow35(p,inPage){var w=p.wait,k=w.k,ag=w.ag||'claude';
 var dot={card:'wait',pause:'wait',bad:'bad'}[k]||'';
 var btn=k=='card'?'<div class="btn sm pri ab8" data-a="clnext" data-pid="'+esc(p.id)+'">Нажать</div>':k=='pause'?'<div class="btn sm pri ab8" data-a="unp35" data-x="'+ag+'" data-pid="'+esc(p.id)+'">Снять</div>':'';
 var title=inPage?(k=='card'?'Карточка Start ждёт':'План закончен'):esc(p.n);
 var sub=k=='card'&&p.cls&&p.cls.card?'«'+esc(p.cls.card.title)+'» — нажать?':esc(w.t);
 if(inPage&&k=='end')sub='Последняя сессия без следующего шага. Дальше — за тобой.';
 return '<div class="row2 ag8 wr35"'+(inPage?'':' data-a="po86" data-x="'+esc(p.id)+'"')+'>'+TL(ag,'m')+'<div class="t2"><div class="n2">'+(dot?'<span class="dot '+dot+'"></span>':'')+'<span class="nm2">'+title+'</span></div><div class="d2">'+sub+'</div></div>'+btn+'</div>'}
(function(){var h0=home;home=function(){var h=h0();if(S.stopped)return h;
 var L=proj8().filter(function(p){return wsub35(p)});if(!L.length)return h;
 var rank={bad:0,card:1,end:2,pause:3};L.sort(function(a,b){return rank[a.wait.k]-rank[b.wait.k]});
 var urgent=L.some(function(p){return p.wait.k!='pause'});
 var sec='<div class="sec wt35"><div class="sh"><span>Ждёт тебя · '+L.length+'</span></div><div class="grp">'+L.map(function(p){return wrow35(p,0)}).join('')+'</div></div>';
 if(urgent)h=h.replace(/<div class="calm86">[\s\S]*?<\/small><\/div><\/div>/,'');
 var i=h.indexOf('<div class="sec"><div class="sh"><span>Проекты · ');return i<0?h+sec:h.slice(0,i)+sec+h.slice(i)}})();
