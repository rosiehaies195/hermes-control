/* Этап 2 «автопилот на несколько проектов» (runbook panel-next, план v2). Слой поверх prj.js и cx.js.
   Данные из tv_multi: p.am = {claude|codex: {m: off|ask|full|pause, u, why}} — режим агента в проекте (кроме Claude
   у проекта кликера: тот по-прежнему на Start/Паузе); p.aps = счётчики сторожа {n24, np, fails, last, end};
   p.cls = статус Claude в папке (tv_cla), пока у Claude включён автопилот.
   Действия → POST /api: {a:'ap',pid,ag,mode,until} (tv_panel.ap_set); Claude: clnext, clnew {t}, clrule (tv_panel.claude_act).
   Сторож tv_autopilot.py (cron раз в 3 мин) сам открывает новую сессию, когда прошлая закончилась промптом «Следующая сессия». */
AGENTS8.codex.modes=['off','full','pause'];
var MDX9={
 claude:{off:'Сам ничего не начинает: новые сессии запускаешь ты.',
  ask:'Новые сессии сам не начинает. На вопросы Claude отвечает по твоим правилам автоответа, остальные присылает тебе.',
  full:'Когда сессия закончилась промптом «Следующая сессия», сам открывает новую сессию в Claude Desktop и отправляет его. Встаёт на паузу, если 3 сессии подряд ничего не изменили.',
  pause:'Ничего не запускает до выбранного времени, потом вернётся в прежний режим.'},
 codex:{off:'Сам ничего не начинает: новые сессии запускаешь ты.',
  full:'Когда сессия закончилась промптом «Следующая сессия», сам открывает новую сессию в Codex Desktop. Встаёт на паузу, если 3 сессии подряд ничего не изменили.',
  pause:'Ничего не запускает до выбранного времени, потом вернётся в прежний режим.'}};
function ap9(p,app){return p&&p.am&&p.am[app]}
function cls9(p){return p&&p.cls||{}}
function apWhy9(a){return a.why?'пауза: '+a.why:(a.u?'пауза до '+hm(a.u):'пауза')}
(function(){
 var mo0=modeOf86,ml0=modeLbl86,md0=mdx86,sm0=setMode86,st0=stOf86,mn0=main86,ac0=acts86;
 modeOf86=function(p,app){var a=ap9(p,app);return a?a.m:mo0(p,app)};
 modeLbl86=function(p,app,m){var a=ap9(p,app);if(a&&m=='pause'&&a.m=='pause')return a.u?'Пауза до '+hm(a.u):'Пауза';return ml0(p,app,m)};
 mdx86=function(app,m){return MDX9[app]&&MDX9[app][m]||md0(app,m)};
 setMode86=function(pid,app,m){var p=prjById8(pid),a=ap9(p,app);if(!a)return sm0(pid,app,m);
  if(S.stopped&&(m=='full'||m=='ask')){toast('Сейчас всё остановлено. Сначала «Запустить всё» сверху Пульта.');return}
  if(m==a.m&&m!='pause'){toast('Уже включено: '+MODES86[m][0]);return}
  if(m=='pause'){apPause9(pid,app);return}
  send({a:'ap',pid:pid,ag:app,mode:m})};
 stOf86=function(p,app){var a=ap9(p,app);if(!a||(app!='claude'&&app!='codex'))return st0(p,app);
  if(S.stopped&&a.m!='off')return ['wait','всё остановлено'];
  if(a.m=='pause')return ['wait',apWhy9(a)];
  var R=(p.aps||{})[app]||{};
  if(app=='codex'){var x=st0(p,app),s=cxs91(p);
   if(a.m=='full'&&x[0]==''&&s.prompt&&!s.used)return ['','готов промпт · новая сессия начнётся сама'];
   if(a.m=='full'&&x[0]==''&&R.end)return ['','цепочка закончена: в конце сессии нет «Следующей сессии»'];
   return x}
  var s=cls9(p);
  if(s.k=='bad')return ['bad',(s.sub||'').replace(/^Claude:\s*/,'')];
  if(s.st=='work')return ['ok','работает: '+(s.t||'сессия идёт')];
  if(p.q&&p.q.length)return ['wait','ждёт твоего ответа'];
  if(a.m=='full'&&s.prompt&&!s.used)return ['','готов промпт · новая сессия начнётся сама'];
  if(a.m=='full'&&R.end)return ['','цепочка закончена: в конце сессии нет «Следующей сессии»'];
  if(a.m!='off')return ['',s.t?'последняя сессия: '+s.t:'сессий ещё нет'];
  return st0(p,app)};
 main86=function(p,app){if(app!='claude'||p.auto)return mn0(p,app);var s=cls9(p),q=(s.prompt||'').replace(/\s+/g,' ').trim();
  if(s.st=='work'&&s.sid)return {a:'clopen9',x:s.sid,t:'Открыть сессию, которая идёт',d:s.t||'Сессия Claude в этом проекте.',ic:'message-square-text'};
  if(q&&!s.used)return {a:'clnext',x:'claude',t:'Начать следующую сессию',d:'«'+(q.length>90?q.slice(0,90)+'…':q)+'» — промпт из конца прошлой сессии.',ic:'play',dis:S.stopped};
  return {a:'clsheet',x:'claude',t:'Новая сессия Claude',d:'Напишешь задачу — Claude Desktop начнёт новую сессию в папке проекта.',ic:'plus',dis:S.stopped}};
 acts86=function(p,app){if(app!='claude'||p.auto)return ac0(p,app);var s=cls9(p),M=main86(p,app),L=[];
  if(M.a!='clsheet')L.push(['clsheet','claude','pencil','Новая сессия со своим текстом','Напишешь задачу — Claude Desktop откроет новую сессию в папке «'+p.n+'».']);
  L.push(['pchat8','claude','message-square-text','Чаты Claude','Чаты Claude Desktop и панели во вкладке «Чат».']);
  if(!s.rule)L.push(['clrule','claude','info','Правило в CLAUDE.md','Чтобы Claude заканчивал каждую сессию промптом для следующей: заголовок «Следующая сессия» и блок text. Без него автопилот не знает, что запускать.']);
  return L};
})();

function apPause9(pid,app){var p=prjById8(pid);if(!p)return;var n=Math.round(nowS()),d=new Date();d.setHours(9,0,0,0);if(d.getTime()/1000<=n+60)d.setDate(d.getDate()+1);
 var O=[['1 час',n+3600],['3 часа',n+10800],['до '+(d.getDate()==new Date().getDate()?'':'завтра ')+'09:00',Math.round(d.getTime()/1000)],['Без срока — пока не включу',0]];
 sheet('<h3>Пауза · '+AGENTS8[app].n+'</h3><p>Проект «'+esc(p.n)+'». Новые сессии не запускаются; идущая сессия доработает.</p>'+
  O.map(function(o){return '<div class="ma86" data-a="app9" data-x="'+o[1]+'" data-k="'+app+'" data-pid="'+esc(pid)+'">'+IC('pause')+'<div><b>'+o[0]+'</b><small>'+(o[1]?'Потом вернётся в прежний режим.':'Включишь сам: Автопилот → Полный.')+'</small></div></div>'}).join(''))}
function clNextSheet9(pid){var p=prjById8(pid),s=cls9(p);if(!p)return;U.pid9=pid;
 sheet('<h3>Следующая сессия · Claude</h3><p>Проект «'+esc(p.n)+'». Промпт из конца сессии «'+esc(s.t||'')+'». Claude Desktop откроет новую сессию в папке проекта и отправит его, затем вернёт окно на прежний чат.</p>'+
  '<pre class="pr91">'+esc(s.prompt||'')+'</pre>'+
  '<div class="btn pri" data-a="clgo" data-pid="'+esc(pid)+'">'+IC('play')+' Запустить в Claude Desktop</div><div class="btn" data-a="unsheet">Отмена</div>')}
function clNewSheet9(pid){var p=prjById8(pid);if(!p)return;U.pid9=pid;
 sheet('<h3>Новая сессия · Claude</h3><p>Проект «'+esc(p.n)+'». Текст станет первым сообщением новой сессии в Claude Desktop (папка проекта, права как на ПК). Папка должна быть в списке недавних Claude Desktop.</p>'+
  '<textarea class="in" id="clin9" rows="5" placeholder="Например: продолжай по плану из docs/plan.md">'+esc(U.clt9||'')+'</textarea>'+
  '<div class="btn pri" data-a="clgo2" data-pid="'+esc(pid)+'">'+IC('play')+' Начать сессию</div><div class="btn" data-a="unsheet">Отмена</div>');
 setTimeout(function(){var t=document.getElementById('clin9');if(t)t.focus()},250)}
function clRuleSheet9(pid){var p=prjById8(pid);if(!p)return;U.pid9=pid;
 sheet('<h3>Правило в CLAUDE.md</h3><p>В конец CLAUDE.md проекта «'+esc(p.n)+'» добавится раздел. Файл не коммитится: проверь и закоммить сам.</p>'+
  '<pre class="pr91">## Следующая сессия (панель Hermes)\n- Если работа продолжается в новой сессии, закончи финальный отчёт заголовком `### Следующая сессия` и ОДНИМ блоком ```text со стартовым сообщением целиком.\n- Панель Hermes сама открывает новую сессию Claude в папке проекта, поэтому в блоке — всё, что нужно новой сессии.\n- Следующей сессии нет (план закончен) — блок не пиши.</pre>'+
  '<div class="btn pri" data-a="clrulego" data-pid="'+esc(pid)+'">Добавить в CLAUDE.md</div><div class="btn" data-a="unsheet">Отмена</div>')}
function clAfter9(){setTimeout(function(){send({a:'refresh'},true)},15000);setTimeout(function(){send({a:'refresh'},true)},35000)}
function clOpen9(sid){U.tab='hc';U.page=null;render();var n=0;
 (function go(){n++;if(window.HC&&HC.st.kind!='claude'){var b=document.querySelector('[data-hc=kind][data-v="claude"]');if(b)b.click()}
  var r=sid&&document.querySelector('[data-hc=open][data-id="'+sid+'"]');if(r){r.click();return}if(n<20)setTimeout(go,250);else toast('Сессия ещё не в списке чатов Claude — обнови список.')})()}

document.addEventListener('input',function(ev){if(ev.target&&ev.target.id=='clin9')U.clt9=ev.target.value},true);
document.addEventListener('click',function(ev){var el=ev.target.closest('[data-a]');if(!el)return;var a=el.dataset.a;
 if(!/^(clnext|clsheet|clrule|clgo|clgo2|clrulego|clopen9|app9)$/.test(a))return;ev.stopPropagation();ev.preventDefault();haptic('sel');
 var pid=el.dataset.pid||U.pid9||U.pid86,inSheet=!!el.closest('#sheet');
 if(el.classList.contains('dis')){toast('Сейчас всё остановлено. Сначала «Запустить всё» сверху Пульта.');return}
 if(a=='app9'){unsheet();send({a:'ap',pid:pid,ag:el.dataset.k,mode:'pause',until:+el.dataset.x||0});return}
 if(a=='clnext'){clNextSheet9(pid);return}
 if(a=='clsheet'){clNewSheet9(pid);return}
 if(a=='clrule'){clRuleSheet9(pid);return}
 if(a=='clopen9'){if(inSheet)unsheet();clOpen9(el.dataset.x);return}
 if(a=='clgo'){unsheet();send({a:'clnext',pid:pid});clAfter9();return}
 if(a=='clgo2'){var t=(document.getElementById('clin9')||{}).value||'';if(!t.trim()){toast('Напиши, что сделать в новой сессии.');return}
  unsheet();U.clt9='';send({a:'clnew',pid:pid,t:t.trim()});clAfter9();return}
 if(a=='clrulego'){unsheet();send({a:'clrule',pid:pid});return}},true);
