/* s5-side (этап 5, п.4б): side-чаты.
   Codex: «⋯» в шапке → «Side-чаты»: лист со списком side-чатов этого чата и «Новый side-чат». Side-чат — отдельный разговор
     поверх основного: Codex видит его историю, но основную задачу не продолжает и ничего не меняет без просьбы (граница как
     в Codex Desktop). Ходы ведёт панель (tv_cc), основной чат и Codex Desktop не трогаются. Side-чаты прячутся из общих
     списков (метка side у строки), открываются из этого листа; в самом side-чате «⋯» → «К основному чату».
     Side-чаты, созданные в Codex Desktop (dside), — только чтение: вместо поля ввода подпись.
   Hermes: «⋯» → «Спросить в сторону»: вопрос по снимку разговора (prompt.btw), ответ в листе, в историю чата не попадает,
     текущий ход Hermes не прерывается. Вопросы и ответы хранятся на телефоне (последние 10 на чат).
   Claude: пункта нет (у Claude нет side-чатов). */
(function(){var W=window,D=document,B=D.body;
 var S={keep:{codex:{}},list:{},lt:{},q:{}};W.S5D=S;
 function st(){return W.HC&&HC.st}
 function E(t){var d=D.createElement('div');d.textContent=t==null?'':t;return d.innerHTML}
 function T(m){try{toast(m)}catch(e){}}
 function ago(ts){var d=Math.max(0,Date.now()/1000-ts);return d<60?'только что':d<3600?Math.round(d/60)+' мин назад':d<86400?Math.round(d/3600)+' ч назад':Math.round(d/86400)+' дн назад'}
 function md(t){try{return W.md?W.md(t):E(t)}catch(e){return E(t)}}
 var SVG={side:'<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h7A2.5 2.5 0 0 1 16 5.5v4A2.5 2.5 0 0 1 13.5 12H9l-3.2 2.6V12h0A2.5 2.5 0 0 1 4 9.5Z"/><path d="M19 9.2a2.5 2.5 0 0 1 1 2v4a2.5 2.5 0 0 1-2.5 2.5h-.3V21L14 18h-3.5a2.5 2.5 0 0 1-2-1"/>',
  up:'<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>'};
 function ic(n){return '<svg class="s5di" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+SVG[n]+'</svg>'}
 /* строки side-чатов из общего списка: в списке их нет, но openChat должен их знать */
 S.hide=function(k,x){if(!x||!x.side)return false;(S.keep[k]=S.keep[k]||{})[x.id]=x;return true};
 S.extra=function(k,id){var x=(S.keep[k]||{})[id];return x?[x]:[]};
 function cur(){var s=st();if(!s||s.view!='chat'||!s.sid)return null;return (S.keep[s.kind]||{})[s.sid]||null}
 /* ---------- «⋯» шапки ---------- */
 function item(a,icn,t){return '<div class="g3mi" data-s5d="'+a+'">'+ic(icn)+'<span>'+t+'</span></div>'}
 function addItems(){var p=D.getElementById('g3pop'),s=st();if(!p||!s||!p.classList.contains('g3pm')||p.querySelector('[data-s5d]'))return;
  var x='',c=cur();
  if(s.kind=='codex'&&c)x=item('parent','up','К основному чату');
  else if(s.kind=='codex'&&s.sid)x=item('list','side','Side-чаты');
  else if(s.kind=='hermes'&&s.sid)x=item('ask','side','Спросить в сторону');
  if(!x)return;var ref=p.querySelector('[data-hc=menu]');var t=D.createElement('div');t.innerHTML=x;
  if(ref)p.insertBefore(t.firstChild,ref);else p.appendChild(t.firstChild)}
 function wrap(){if(!W.G3||!G3.headMenu||G3.headMenu.__s5d)return;var o=G3.headMenu;G3.headMenu=function(){var r=o.apply(this,arguments);addItems();setTimeout(addItems,0);return r};G3.headMenu.__s5d=1}
 setInterval(wrap,500);wrap();
 D.addEventListener('click',function(ev){var el=ev.target.closest&&ev.target.closest('[data-s5d]');if(!el)return;ev.stopPropagation();ev.preventDefault();var a=el.dataset.s5d,s=st();
  if(el.closest('.g3pop')&&W.G3&&G3.closePop)G3.closePop();
  if(a=='list')listOpen();
  else if(a=='new')newSide(el);
  else if(a=='open'){W.unsheet&&unsheet();openSide(el.dataset.id)}
  else if(a=='parent'){var c=cur();if(c)SD3.openChat('codex',c.side)}
  else if(a=='ask')askOpen();
  else if(a=='send')askSend(el);
  else if(a=='close'){W.unsheet&&unsheet()}},true);
 /* ---------- Codex: лист «Side-чаты» ---------- */
 var HINT='Отдельный разговор поверх этого чата: Codex видит всю его историю, но основную задачу не продолжает и ничего не меняет без твоей просьбы. Основной чат не прерывается.';
 function lrow(x){return '<div class="s5dr" data-s5d="open" data-id="'+E(x.id)+'" role="button"><div class="s5dt"><b>'+E(x.t)+'</b><span>'+(x.dside?'из Codex Desktop · ':'')+(x.new?'ещё без сообщений':E(ago(x.ts)))+'</span></div></div>'}
 function listPaint(){var s=st(),L=S.list[s.sid];
  var h='<i hidden data-hc="openpc"></i><div class="hcsh"><b>Side-чаты</b></div><div class="s5dh">'+HINT+'</div>'+
   '<div class="s5dl">'+(L==null?'<div class="s5de">Загружаю…</div>':L.length?L.map(lrow).join(''):'<div class="s5de">Пока нет ни одного</div>')+'</div>'+
   '<div class="btn pri" data-s5d="new">'+ic('side')+'Новый side-чат</div><div class="btn" data-s5d="close">Закрыть</div>';
  var sh=D.getElementById('sheet');if(sh&&sh.classList.contains('on')&&sh.querySelector('.s5dl'))sh.innerHTML='<div class="gr"></div>'+h;else sheet(h)}
 function listOpen(){var s=st(),sid=s.sid;listPaint();
  SD3.api('/side?k=codex&sid='+encodeURIComponent(sid)).then(function(d){S.list[sid]=d.s||[];(d.s||[]).forEach(function(x){x.side=sid;if(!x.dside){x.src='панель';x.rw=true}else x.rw=false;x.cc=true;(S.keep.codex=S.keep.codex||{})[x.id]=Object.assign({},S.keep.codex[x.id]||{},x)});if(st().sid==sid)listPaint()})
   .catch(function(e){S.list[sid]=S.list[sid]||[];T('Не загрузил side-чаты: '+E(e.message));listPaint()})}
 function openSide(id){var x=S.keep.codex[id];if(!x)return;SD3.openChat('codex',id)}
 function newSide(el){var s=st(),sid=s.sid;if(el.dataset.busy)return;el.dataset.busy=1;el.lastChild.textContent='Создаю…';
  SD3.api('/side/new',{method:'POST',body:{k:'codex',sid:sid}}).then(function(r){var x=r.s;x.side=sid;x.new=true;S.keep.codex[x.id]=x;(S.list[sid]=S.list[sid]||[]).unshift(x);
    W.unsheet&&unsheet();SD3.openChat('codex',x.id);setTimeout(function(){var ta=D.getElementById('hcin');if(ta)ta.focus()},400)})
   .catch(function(e){delete el.dataset.busy;el.lastChild.textContent='Новый side-чат';T(E(e.message))})}
 /* пустой side-чат: вместо общих подсказок — что это за чат (шапка Codex показывает модель, а не название) */
 var SGW='';
 setInterval(function(){var g=D.getElementById('g3sg'),c=cur();if(!g)return;
  if(c&&!c.dside){var par=(SD3.SD.L.codex||[]).filter(function(y){return y.id==c.side})[0],w='s5:'+c.id;
   if(SGW!=w||!g.querySelector('.s5dsg')){SGW=w;g.innerHTML='<div class="s5dsg">'+ic('side')+'<span>Side-чат от «'+E(par?par.t:'основного чата')+'». Основной чат не прервётся, Codex ничего не изменит без твоей просьбы.</span></div>'}}
  else if(SGW){SGW='';if(g.querySelector('.s5dsg'))g.innerHTML=''}},300);
 /* side-чат из Codex Desktop: только чтение */
 var NOTE=null;
 setInterval(function(){var c=cur(),on=!!(c&&c.dside&&W.U&&U.tab=='hc');B.classList.toggle('s5dro',on);
  if(on&&!NOTE){NOTE=D.createElement('div');NOTE.id='s5dnote';NOTE.textContent='Side-чат из Codex Desktop — продолжить можно в Codex на ПК. Здесь только чтение.';B.appendChild(NOTE)}
  if(NOTE)NOTE.style.display=on?'':'none'},400);
 /* ---------- Hermes: «Спросить в сторону» ---------- */
 function key(sid){return 's5btw_'+sid}
 function hist(sid){try{return JSON.parse(localStorage.getItem(key(sid))||'[]')}catch(e){return []}}
 function save(sid,L){try{localStorage.setItem(key(sid),JSON.stringify(L.slice(-10)))}catch(e){}}
 function arow(x){return '<div class="s5dq"><div class="s5dqq">'+E(x.t)+'</div><div class="s5dqa'+(x.st=='fail'?' bad':'')+'">'+(x.st=='run'?'<span class="s5dw">Hermes думает…</span>':x.st=='fail'?E(x.a):md(x.a))+'</div></div>'}
 function askPaint(keep){var s=st(),L=hist(s.sid),ta=D.getElementById('s5dta'),v=ta?ta.value:'';
  var h='<i hidden data-hc="openpc"></i><div class="hcsh"><b>Спросить в сторону</b></div><div class="s5dh">Hermes ответит по этому разговору, не прерывая свою работу. В историю чата вопрос и ответ не попадут.</div>'+
   (L.length?'<div class="s5da">'+L.map(arow).join('')+'</div>':'')+
   '<textarea id="s5dta" class="hcinp s5dtx" rows="2" maxlength="4000" placeholder="Например: что ты сейчас делаешь и сколько осталось?"></textarea>'+
   '<div class="btn pri" data-s5d="send">'+ic('side')+'Спросить</div><div class="btn" data-s5d="close">Закрыть</div>';
  var sh=D.getElementById('sheet');if(sh&&sh.classList.contains('on')&&sh.querySelector('#s5dta')){sh.innerHTML='<div class="gr"></div>'+h}else sheet(h);
  var t2=D.getElementById('s5dta');if(t2&&keep){t2.value=v}var a=D.querySelector('#sheet .s5da');if(a)a.scrollTop=a.scrollHeight}
 function askOpen(){askPaint();var s=st();hist(s.sid).forEach(function(x){if(x.st=='run')poll(s.sid,x.q)})}
 function askSend(el){var s=st(),ta=D.getElementById('s5dta'),t=(ta&&ta.value||'').trim(),sid=s.sid;if(!t||el.dataset.busy)return;el.dataset.busy=1;
  SD3.api('/side/ask',{method:'POST',body:{k:'hermes',sid:sid,text:t}}).then(function(r){var L=hist(sid);L.push({q:r.q,t:t,st:'run',a:'',ts:Date.now()/1000|0});save(sid,L);if(ta)ta.value='';askPaint();poll(sid,r.q)})
   .catch(function(e){delete el.dataset.busy;T('Не отправил: '+E(e.message))})}
 function poll(sid,q){if(S.q[q])return;S.q[q]=1;var n=0;
  (function go(){SD3.api('/side/ask?q='+encodeURIComponent(q)).then(function(d){if(d.st=='run'&&n++<150){setTimeout(go,2000);return}
     var L=hist(sid);L.forEach(function(x){if(x.q==q){x.st=d.st=='run'?'fail':d.st;x.a=d.st=='run'?'Ответа нет больше 5 минут.':d.a}});save(sid,L);delete S.q[q];
     var sh=D.getElementById('sheet');if(st().sid==sid&&sh&&sh.classList.contains('on')&&sh.querySelector('#s5dta'))askPaint(true)})
    .catch(function(e){if(n++<150&&!/404|не найден/i.test(e.message)){setTimeout(go,3000);return}var L=hist(sid);L.forEach(function(x){if(x.q==q&&x.st=='run'){x.st='fail';x.a='Ответ потерян: '+e.message}});save(sid,L);delete S.q[q];
     var sh=D.getElementById('sheet');if(st().sid==sid&&sh&&sh.classList.contains('on')&&sh.querySelector('#s5dta'))askPaint(true)})})()}
})();
