/* s5-bio (этап 5, п.7): Face ID перед «Разрешать всегда» в карточке разрешения внутри чата (Claude «Разрешать всегда»,
   Codex «Всегда», Hermes «На сессию»): это снимает вопросы до конца чата — самое широкое разрешение в панели.
   Тап → системный Face ID (базовый bioAuth, как у «Разрешить» на Пульте). Если Face ID нет / доступ не дан / не ответил —
   вместо базового листа «Подтверди удержанием» подтверждение родными элементами приложения (стандарт s5-y, образец — откат v10.25):
   Claude — лист Claude (#clsh: ✕, заголовок, подпись, команда, светлая кнопка-«пилюля»); ChatGPT (Codex/Hermes) — меню-подтверждение
   как «Удалить чат?» (.g3pop: .g3mh вопрос, строка-действие, Отмена). Действие — удержание 1,2 с с заливкой; отпустил раньше — ничего.
   Отмена (✕, Отмена, тап мимо) — ничего не отправляется, карточка остаётся. «Разрешить один раз» и «Отклонить» — как были. */
(function(){var W=window,D=document,B=D.body;if(W.S5B)return;var S={pass:0,n:0,act:0};W.S5B=S;
 function st(){return W.HC&&HC.st}
 function E(t){var d=D.createElement('div');d.textContent=t==null?'':t;return d.innerHTML}
 function T(m){try{toast(m)}catch(e){}}
 function gi(n){try{return G3.ic(n)}catch(e){return ''}}
 function ci(n){try{return CL3.ic(n)}catch(e){return ''}}
 function hap(k){try{haptic(k)}catch(e){}}
 var NM={claude:'Claude',codex:'Codex',hermes:'Hermes'};
 function cmdOf(p){var t=(p.text||p.desc||p.tool||'').replace(/\s+/g,' ').trim();return t.length>140?t.slice(0,139)+'…':t}
 function anim(){return !matchMedia('(prefers-reduced-motion: reduce)').matches}
 /* удержание: 1,2 с с заливкой; раньше отпустил — подсказка, ничего не сделано */
 function holdify(el,fn){var t=0;
  function down(e){e.preventDefault();if(t)return;el.classList.add('go');hap('sel');t=setTimeout(function(){t=0;el.classList.remove('go');hap('warning');fn()},1200)}
  function up(){if(!t)return;clearTimeout(t);t=0;el.classList.remove('go');T('Держи кнопку 1 секунду')}
  el.addEventListener('pointerdown',down);['pointerup','pointercancel','pointerleave'].forEach(function(n){el.addEventListener(n,up)});
  el.addEventListener('contextmenu',function(e){e.preventDefault()})}
 function closeAll(){try{CL3.sheetClose()}catch(e){}try{G3.closePop()}catch(e){}}
 /* подтверждение удержанием в облике приложения (заменяет базовый holdThen только для этого шага) */
 function nativeHold(k,p,fn){closeAll();var nm=NM[k]||'агенту',c=cmdOf(p);
  if(k=='claude'){var v=D.createElement('div');v.id='clsv';B.appendChild(v);var sh=D.createElement('div');sh.id='clsh';sh.className='clsh s5csh s5rsh s5bsh';
   sh.innerHTML='<div class="clgrab"></div><div class="clshh"><div class="clqx" data-cl="shx" role="button" aria-label="Закрыть">'+ci('x')+'</div><b>Разрешать всегда?</b><label></label></div><div class="s5cb">'+
    '<div class="s5cap">Claude больше не будет спрашивать разрешения до конца этого чата.</div>'+
    (c?'<pre class="clqpre s5bpre">'+E(c)+'</pre>':'')+
    '<div class="s5rgo s5bgo" role="button"><span>Удерживай, чтобы разрешить</span></div></div>';
   B.appendChild(sh);if(sh.animate&&anim())sh.animate([{transform:'translateY(105%)'},{transform:'none'}],{duration:500,easing:'cubic-bezier(.32,.72,0,1)'});
   holdify(sh.querySelector('.s5bgo'),function(){try{CL3.sheetClose()}catch(e){}fn()})}
  else{var v2=D.createElement('div');v2.id='g3veil';B.appendChild(v2);var x=D.createElement('div');x.id='g3pop';x.className='g3pop s5rpop s5bpop';
   x.innerHTML='<div class="g3mh s5rq"><b>Разрешать '+E(nm)+' всегда?</b><br>Больше не будет спрашивать до конца этого чата.'+(c?'<code class="s5bcode">'+E(c)+'</code>':'')+'</div>'+
    '<div class="g3mi s5bgo" role="button">'+gi('shield')+'<span>Удерживай, чтобы разрешить</span></div>'+
    '<div class="g3mi" data-s5b="x" role="button">'+gi('x')+'<span>Отмена</span></div>';
   B.appendChild(x);if(x.animate&&anim())x.animate([{transform:'scale(.6,.5)',opacity:.4},{transform:'none',opacity:1}],{duration:400,easing:'cubic-bezier(.32,.72,0,1)'});
   v2.addEventListener('click',function(){try{G3.closePop()}catch(e){}});
   x.querySelector('[data-s5b=x]').addEventListener('click',function(){try{G3.closePop()}catch(e){}});
   holdify(x.querySelector('.s5bgo'),function(){try{G3.closePop()}catch(e){}fn()})}}
 /* базовый bioAuth зовёт глобальный holdThen как запасной путь — на время нашего шага подменяем облик */
 var H0=W.holdThen;
 if(typeof H0=='function')W.holdThen=function(reason,fn){if(S.act){var a=S.act;S.act=0;nativeHold(a.k,a.p,fn);return}return H0.apply(this,arguments)};
 D.addEventListener('click',function(ev){var el=ev.target.closest&&ev.target.closest('[data-hc=appr][data-c=session]');if(!el||S.pass)return;
  if(typeof W.bioAuth!='function')return;          /* нет базового Face ID — как было */
  ev.stopPropagation();ev.preventDefault();var s=st(),sid=s&&s.sid,k=s&&s.kind,p=(s&&s.pend&&s.pend[+el.dataset.i])||{},pid=p.id;S.n++;
  function go(){var s2=st();
   /* за время подтверждения карточка могла перерисоваться или смениться — жмём ту же самую, только в том же чате */
   if(!s2||s2.sid!=sid||!s2.pend||!s2.pend.some(function(x){return x.id==pid})){T('Запрос уже закрыт — ничего не сделал');return}
   var j=s2.pend.map(function(x){return x.id}).indexOf(pid),b=[].filter.call(D.querySelectorAll('[data-hc=appr][data-c=session][data-i="'+j+'"]'),function(x){return x.getClientRects().length})[0];
   if(!b){T('Карточка закрыта — ничего не сделал');return}
   S.pass=1;try{b.click()}finally{S.pass=0}}
  S.act={k:k,p:p};clearTimeout(S.tm);S.tm=setTimeout(function(){S.act=0},65000);
  var c=cmdOf(p);bioAuth('Разрешать '+(NM[k]||'агенту')+' без вопросов до конца этого чата'+(c?': '+c:''),function(){S.act=0;go()})},true);
})();
