/* v9.1 «Codex полностью» (план v8.6 п.4, runbook miniapp-panel). Слой поверх prj.js: Codex в проекте подключён.
   Данные: p.cxs из tv_multi → tv_cxa (st work|queued|idle|none, t, tid, prompt, used, rule, run, k, sub).
   Действия → POST /api (tv_panel.codex_act): cxnext (новая сессия по промпту из конца прошлой), cxnew {t} (своим текстом),
   cxrule (правило «Следующая сессия» в AGENTS.md проекта). Новую сессию выполняет сам Codex Desktop (очередь + wake). */
AGENTS8.codex.wired=true;AGENTS8.codex.caps=['status','chats','autopilot','next'];
AGENTS8.codex.nextD='Возьмёт промпт из конца прошлой сессии и откроет новую сессию в Codex Desktop в папке проекта.';
function cxs91(p){return p&&p.cxs||{}}
function cxq91(s){return (s.prompt||'').replace(/\s+/g,' ').trim()}
(function(){
 var st0=stOf86,mn0=main86,ac0=acts86;
 stOf86=function(p,app){if(app!='codex')return st0(p,app);var s=cxs91(p);
  if(s.err)return ['bad','статус не прочитан: '+s.err];
  if(s.k=='bad')return ['bad',(s.sub||'').replace(/^Codex:\s*/,'')];
  if(s.st=='work')return ['ok','работает: '+(s.t||'сессия идёт')];
  if(s.st=='queued')return ['wait','сообщение в очереди Codex Desktop'];
  if(s.prompt&&!s.used)return ['','готов промпт следующей сессии'];
  return ['',s.t?'последняя сессия: '+s.t:'сессий ещё нет']};
 main86=function(p,app){if(app!='codex')return mn0(p,app);var s=cxs91(p),q=cxq91(s);
  if(s.st=='work'||s.st=='queued')return {a:'cxopen',x:s.tid||'',t:'Открыть сессию, которая идёт',d:s.t||'Сессия Codex в этом проекте.',ic:'message-square-text'};
  if(q&&!s.used)return {a:'cxnext',x:'codex',t:'Начать следующую сессию',d:'«'+(q.length>90?q.slice(0,90)+'…':q)+'» — промпт из конца прошлой сессии.',ic:'play',dis:S.stopped};
  return {a:'cxsheet',x:'codex',t:'Новая сессия Codex',d:'Напишешь задачу — Codex Desktop начнёт новую сессию в папке проекта.',ic:'plus',dis:S.stopped}};
 acts86=function(p,app){if(app!='codex')return ac0(p,app);var s=cxs91(p),M=main86(p,app),L=[];
  if(M.a!='cxsheet')L.push(['cxsheet','codex','pencil','Новая сессия со своим текстом','Напишешь задачу — Codex Desktop откроет новую сессию в папке «'+p.n+'».']);
  if(s.tid&&M.a!='cxopen')L.push(['cxopen',s.tid,'message-square-text','Открыть последнюю сессию','«'+(s.t||'без названия')+'» во вкладке «Чат».']);
  L.push(['pchat8','codex','message-square-text','Все чаты Codex','Чаты Codex Desktop и панели во вкладке «Чат».']);
  if(!s.rule)L.push(['cxrule','codex','info','Правило в AGENTS.md','Чтобы Codex заканчивал каждую сессию промптом для следующей: заголовок «Следующая сессия» и блок text.']);
  return L};
})();

function cxNextSheet91(pid){var p=prjById8(pid),s=cxs91(p);if(!p)return;U.pid91=pid;
 sheet('<h3>Следующая сессия · Codex</h3><p>Проект «'+esc(p.n)+'». Промпт из конца сессии «'+esc(s.t||'')+'». Codex Desktop откроет новую сессию в папке проекта, права — как у Codex на ПК. Ход будет виден в Codex на ПК и во вкладке «Чат».</p>'+
  '<pre class="pr91">'+esc(s.prompt||'')+'</pre>'+
  '<div class="btn pri" data-a="cxgo" data-pid="'+esc(pid)+'">'+IC('play')+' Запустить в Codex Desktop</div><div class="btn" data-a="unsheet">Отмена</div>')}
function cxNewSheet91(pid){var p=prjById8(pid);if(!p)return;U.pid91=pid;
 sheet('<h3>Новая сессия · Codex</h3><p>Проект «'+esc(p.n)+'». Текст станет первым сообщением новой сессии в Codex Desktop (папка проекта, права как на ПК).</p>'+
  '<textarea class="in" id="cxin91" rows="5" placeholder="Например: возьми задачу #63 и подготовь PR">'+esc(U.cxt91||'')+'</textarea>'+
  '<div class="btn pri" data-a="cxgo2" data-pid="'+esc(pid)+'">'+IC('play')+' Начать сессию</div><div class="btn" data-a="unsheet">Отмена</div>');
 setTimeout(function(){var t=document.getElementById('cxin91');if(t)t.focus()},250)}
function cxRuleSheet91(pid){var p=prjById8(pid);if(!p)return;U.pid91=pid;
 sheet('<h3>Правило в AGENTS.md</h3><p>В конец AGENTS.md проекта «'+esc(p.n)+'» добавится раздел. Файл не коммитится: проверь и закоммить сам.</p>'+
  '<pre class="pr91">## Следующая сессия (панель Hermes)\n- Если работа продолжается в новой сессии, закончи финальный отчёт заголовком `### Следующая сессия` и ОДНИМ блоком ```text со стартовым сообщением целиком.\n- Панель Hermes берёт этот блок и сама открывает новую сессию Codex в папке проекта, поэтому в блоке — всё, что нужно новой сессии.\n- Следующей сессии нет — блок не пиши.</pre>'+
  '<div class="btn pri" data-a="cxrulego" data-pid="'+esc(pid)+'">Добавить в AGENTS.md</div><div class="btn" data-a="unsheet">Отмена</div>')}
function cxOpen91(tid){U.tab='hc';U.page=null;render();var n=0;
 (function go(){n++;if(window.HC&&HC.st.kind!='codex'){var b=document.querySelector('[data-hc=kind][data-v="codex"]');if(b)b.click()}
  var r=tid&&document.querySelector('[data-hc=open][data-id="'+tid+'"]');if(r){r.click();return}if(n<20)setTimeout(go,250);else if(tid)toast('Сессия ещё не в списке чатов Codex — обнови список.')})()}
function cxAfter91(){setTimeout(function(){send({a:'refresh'},true)},6000);setTimeout(function(){send({a:'refresh'},true)},16000)}

document.addEventListener('input',function(ev){if(ev.target&&ev.target.id=='cxin91')U.cxt91=ev.target.value},true);
document.addEventListener('click',function(ev){var el=ev.target.closest('[data-a]');if(!el)return;var a=el.dataset.a;
 if(!/^(cxnext|cxsheet|cxopen|cxrule|cxgo|cxgo2|cxrulego)$/.test(a))return;ev.stopPropagation();ev.preventDefault();haptic('sel');
 var pid=el.dataset.pid||U.pid91||U.pid86,inSheet=!!el.closest('#sheet');
 if(el.classList.contains('dis')){toast('Сейчас всё остановлено. Сначала «Запустить всё» сверху Пульта.');return}
 if(a=='cxnext'){cxNextSheet91(pid);return}
 if(a=='cxsheet'){cxNewSheet91(pid);return}
 if(a=='cxrule'){cxRuleSheet91(pid);return}
 if(a=='cxopen'){if(inSheet)unsheet();cxOpen91(el.dataset.x);return}
 if(a=='cxgo'){unsheet();send({a:'cxnext',pid:pid});cxAfter91();return}
 if(a=='cxgo2'){var t=(document.getElementById('cxin91')||{}).value||'';if(!t.trim()){toast('Напиши, что сделать в новой сессии.');return}
  unsheet();U.cxt91='';send({a:'cxnew',pid:pid,t:t.trim()});cxAfter91();return}
 if(a=='cxrulego'){unsheet();send({a:'cxrule',pid:pid});return}},true);
