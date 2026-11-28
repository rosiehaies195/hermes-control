/* s5-bio (этап 5, п.7): Face ID перед «Разрешать всегда» в карточке разрешения внутри чата (Claude «Разрешать всегда»,
   Codex «Всегда», Hermes «На сессию»): это снимает вопросы до конца чата — самое широкое разрешение в панели.
   Тап → системный Face ID (тот же bioAuth, что у «Разрешить» на Пульте и «Сам разрешает команды»); без Face ID / отказ доступа —
   базовый лист «Подтверди удержанием». Отмена — ничего не отправляется, карточка остаётся. «Разрешить один раз» и «Отклонить» —
   как были, в одно касание. Своего облика нет: Face ID — системный, запасной лист — уже принятый лист панели. */
(function(){var W=window,D=document;if(W.S5B)return;var S={pass:0,n:0};W.S5B=S;
 function st(){return W.HC&&HC.st}
 function cmdOf(i){var s=st(),p=s&&s.pend&&s.pend[+i];if(!p)return '';var t=(p.text||p.desc||p.tool||'').replace(/\s+/g,' ').trim();return t.length>90?t.slice(0,89)+'…':t}
 var NM={claude:'Claude',codex:'Codex',hermes:'Hermes'};
 D.addEventListener('click',function(ev){var el=ev.target.closest&&ev.target.closest('[data-hc=appr][data-c=session]');if(!el||S.pass)return;
  if(typeof W.bioAuth!='function')return;          /* нет базового Face ID — как было */
  ev.stopPropagation();ev.preventDefault();var s=st(),sid=s&&s.sid,k=s&&s.kind,i=el.dataset.i,c=cmdOf(i),pid=(s.pend[+i]||{}).id;S.n++;
  bioAuth('Разрешать '+(NM[k]||'агенту')+' без вопросов до конца этого чата'+(c?': '+c:''),function(){var s2=st();
   /* за время Face ID карточка могла перерисоваться или смениться — жмём ту же самую, только в том же чате */
   if(!s2||s2.sid!=sid||!s2.pend||!s2.pend.some(function(x){return x.id==pid})){try{toast('Запрос уже закрыт — ничего не сделал')}catch(e){}return}
   var j=s2.pend.map(function(x){return x.id}).indexOf(pid),b=[].filter.call(D.querySelectorAll('[data-hc=appr][data-c=session][data-i="'+j+'"]'),function(x){return x.getClientRects().length})[0];
   if(!b){try{toast('Карточка закрыта — ничего не сделал')}catch(e){}return}
   S.pass=1;try{b.click()}finally{S.pass=0}})},true);
})();
