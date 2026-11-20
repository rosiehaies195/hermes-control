/* v8.6: a panel left open too long has an old Telegram signature (initData is fixed per launch).
   On the first 401 {error:"expired"} stop calling the API (it only fills the server log) and tell the user
   to reopen the panel. Wraps window.fetch, so every module (state, chat, Claude/Codex lists) is covered. */
(function(){if(window.__staleHook)return;window.__staleHook=1;
 var of=window.fetch.bind(window),stale=false,MSG='Панель открыта слишком давно, данные не обновляются. Закрой её и открой заново из меню бота.';
 function banner(){if(!document.body||document.getElementById('stalebar'))return;var d=document.createElement('div');d.id='stalebar';
  d.style.cssText='position:fixed;left:10px;right:10px;top:calc(env(safe-area-inset-top,0px) + 8px);z-index:9999;background:#b3261e;color:#fff;border-radius:12px;padding:10px 14px;font:600 14px/1.35 -apple-system,system-ui,sans-serif;box-shadow:0 4px 16px rgba(0,0,0,.3)';
  d.textContent=MSG;document.body.appendChild(d);try{window.Telegram&&Telegram.WebApp&&Telegram.WebApp.HapticFeedback&&Telegram.WebApp.HapticFeedback.notificationOccurred('warning')}catch(e){}}
 window.__panelStale=function(){return stale};
 window.fetch=function(u,o){var s=String(u&&u.url||u),isApi=/\/api\//.test(s);
  if(stale&&isApi)return Promise.resolve(new Response(JSON.stringify({error:'expired',text:MSG}),{status:401,headers:{'Content-Type':'application/json'}}));
  return of(u,o).then(function(r){if(isApi&&r.status==401){r.clone().json().then(function(j){if(j&&j.error=='expired'){stale=true;banner()}}).catch(function(){})}return r})}})();
