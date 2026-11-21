/* Этап 3 «Claude на несколько проектов» (runbook panel-next). Слой поверх auto.js.
   Данные tv_multi: p.cls.card = {title, ts, st (чат с карточкой), prompt} — открытая карточка Start (start_session)
   в сессиях папки проекта; p.cls.ncards; p.aps.claude.err — последний сбой сторожа; p.am.claude.t — когда включён режим.
   У проекта кликера (p.auto) режимы Claude те же, что у остальных. Пока режим не выбран (am.claude.legacy),
   показывается прежнее состояние кликера, и первый выбор пишет режим в бэкенд.
   Действия: clnext {pid} — карточка Start, иначе промпт «Следующая сессия» (tv_cla.launch); say {pid,t} — текст в
   последний чат Claude проекта (tv_cla.say → tv_cc.desk_say); ap — режим, как в этапе 2. */
MDX9.claude.full='Когда сессия закончилась карточкой Start или промптом «Следующая сессия», сам начинает следующую сессию в Claude Desktop. Встаёт на паузу, если 3 сессии подряд ничего не изменили.';
MDX9.claude.ask='Новые сессии сам не начинает и Start не нажимает. На вопросы Claude отвечает по твоим правилам автоответа, остальные присылает тебе.';
MDX9.claude.off='Сам ничего не начинает и Start не нажимает: следующий шаг запускаешь ты.';
function card3(p){var s=cls9(p);return s.card&&s.st!='work'?s.card:null}
(function(){
 var ap0=ap9;ap9=function(p,app){var a=ap0(p,app);return a&&a.legacy?null:a};
 var sm0=setMode86;setMode86=function(pid,app,m){var p=prjById8(pid),a=p&&p.am&&p.am[app];
  if(a&&a.legacy&&app=='claude'){
   if(S.stopped&&(m=='full'||m=='ask')){toast('Сейчас всё остановлено. Сначала «Запустить всё» сверху Пульта.');return}
   if(m=='pause'){apPause9(pid,app);return}
   send({a:'ap',pid:pid,ag:app,mode:m});return}
  return sm0(pid,app,m)};
 var st0=stOf86;stOf86=function(p,app){var a=ap9(p,app),R=(p.aps||{})[app]||{},c=card3(p);
  if(app=='claude'&&a&&!S.stopped&&a.m!='pause'){
   if(R.fails&&R.err)return ['bad','не смог: '+R.err.replace(/^Не удалось[^:]*:\s*/,'')];
   if(c&&!(p.q&&p.q.length)){var old=a.t&&c.ts<a.t-60;
    return ['',a.m=='full'&&!old?'карточка Start «'+c.title+'» · нажму сам':'ждёт Start: «'+c.title+'»'+(a.m=='full'?' (появилась до включения автопилота — нажми сам)':'')]}}
  return st0(p,app)};
 var mn0=main86;main86=function(p,app){var c=app=='claude'&&card3(p);
  if(c)return {a:'clnext',x:'claude',t:'Начать следующий шаг',d:'Нажмёт Start на карточке «'+c.title+'» в Claude Desktop.',ic:'play',dis:S.stopped};
  return mn0(p,app)};
 var ac0=acts86;acts86=function(p,app){var L=ac0(p,app);
  if(app=='claude'&&!p.auto&&cls9(p).n!==0)L.unshift(['saysheet','claude','pencil','Написать в чат проекта','Текст уйдёт в последний чат «'+p.n+'» в Claude Desktop — его введёт сам Claude Desktop.']);
  return L};
 var cn0=clNextSheet9;clNextSheet9=function(pid){var p=prjById8(pid),c=p&&card3(p);if(!c)return cn0(pid);U.pid9=pid;
  sheet('<h3>Следующий шаг · Claude</h3><p>Проект «'+esc(p.n)+'». В чате «'+esc(c.st||'')+'» ждёт карточка Start. Claude Desktop откроет этот чат, нажмёт Start карточки «'+esc(c.title)+'» и вернёт окно на прежний чат.</p>'+
   (c.prompt?'<pre class="pr91">'+esc(c.prompt)+'</pre>':'')+
   '<div class="btn pri" data-a="clgo" data-pid="'+esc(pid)+'">'+IC('play')+' Нажать Start</div><div class="btn" data-a="unsheet">Отмена</div>')};
})();
