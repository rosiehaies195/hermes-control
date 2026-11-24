/* fx4: самовосстановление связи. Если первый /api/state при открытии не ответил за 10 с (ПК только проснулся, Funnel
   поднимается), база делает API=null навсегда: «ПК недоступен», опроса нет, «Обновить» шлёт sendData (из кнопки меню
   Telegram это ничего не делает) — живой экран возвращал только «Reload Page». Теперь: адрес API помним, каждые 15 с
   (и по «Обновить») пробуем снова; при успехе — живой режим и обычный опрос, как после нормального старта. */
(function(){if(window.MOCK||window.__rc)return;window.__rc=1;
 var A0=HP.get('api');if(!A0)return;var busy=0,live=0;
 function startPoll(){if(live)return;live=1;setInterval(poll,15000);document.addEventListener('visibilitychange',function(){poll()});
  setInterval(function(){if(S.pend&&S.pend.length)loadSnap()},5000)}
 function retry(manual){if(API||busy||(window.__panelStale&&__panelStale()))return Promise.resolve();busy=1;API=A0;
  return api('/api/state').then(function(r){return r.json()}).then(function(d){S=d;norm();U.cached=0;U.offline=0;DIAG='';busy=0;
   try{LS.set('last',S)}catch(e){}if(window.LOADING)boot();else{startPoll();render(true)}if(manual)toast('<b>'+IC('check')+'</b> Связь с ПК восстановлена')},
  function(){API=null;busy=0;if(manual)toast('ПК пока не отвечает — пробую снова каждые 15 с')})}
 /* нормальный старт тоже запускает опрос в boot(): отмечаем, чтобы не завести второй */
 var b0=boot;boot=function(){if(API)live=1;return b0.apply(this,arguments)};
 var r0=refresh;refresh=function(){if(!API)return retry(1);return r0.apply(this,arguments)};
 setInterval(function(){if(!API&&!document.hidden)retry(0)},15000);
 document.addEventListener('visibilitychange',function(){if(!API&&!document.hidden)retry(0)});
 window.__rcRetry=retry})();
