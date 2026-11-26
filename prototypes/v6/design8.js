/* v8 design prototype: immersive chat (no bottom nav), view classes, Telegram header colour follows the agent,
   consecutive tool calls collapse into one "N actions" row like the official apps */
(function(){var last='',OPEN={};
 function plural(n,a,b,c){var m=n%10,h=n%100;return n+' '+(m==1&&h!=11?a:m>=2&&m<=4&&(h<12||h>14)?b:c)}
 function groupTools(){var m=document.getElementById('hcmsgs');if(!m)return;
  m.querySelectorAll('.hcb.a').forEach(function(b){var kids=[].slice.call(b.children),run=[];
   function flush(){if(run.length>=2){var row=b.closest('.hcrow'),key=(row&&row.dataset.mi)+':'+kids.indexOf(run[0]),
     nr=run.filter(function(t){return t.classList.contains('run')}).length,ne=run.filter(function(t){return t.classList.contains('err')}).length,
     names=[];run.forEach(function(t){var n=(t.querySelector('.hct b')||{}).textContent||'';if(n&&names.indexOf(n)<0)names.push(n)});
     var anyOpen=run.some(function(t){return t.classList.contains('open')});
     var g=document.createElement('div');g.className='hctg'+(OPEN[key]||anyOpen?' open':'')+(nr?' run':'')+(ne?' err':'');g.dataset.k=key;
     g.innerHTML='<div class="hctgh"><i>'+(nr?'<span class="hcspin"></span>':'')+'</i><b>'+(nr?'Работаю: ':'Выполнено ')+plural(run.length,'действие','действия','действий')+(ne?' · '+plural(ne,'ошибка','ошибки','ошибок'):'')+'</b><span>'+names.slice(0,4).join(', ').replace(/[<>&]/g,'')+'</span><em></em></div>';
     var body=document.createElement('div');body.className='hctgb';b.insertBefore(g,run[0]);run.forEach(function(t){body.appendChild(t)});g.appendChild(body)}run=[]}
   kids.forEach(function(k){if(k.classList&&k.classList.contains('hctool'))run.push(k);else flush()});flush()})}
 document.addEventListener('click',function(e){var h=e.target.closest&&e.target.closest('.hctgh');if(!h)return;var g=h.parentNode,o=!g.classList.contains('open');g.classList.toggle('open',o);OPEN[g.dataset.k]=o},true);
 function upd(){var b=document.body;if(!b)return;var m=b.classList.contains('hcm'),c=m&&!!document.getElementById('hcmsgs'),cq=c&&document.querySelector('.g3,.cl3'),key=(m?1:0)+''+(c?1:0)+(cq?cq.className.indexOf('cl3'):'n')+b.className.indexOf('hk-claude')+b.className.indexOf('hk-codex');
  if(c)groupTools();
  if(b.classList.contains('hcv-chat')!=c)b.classList.toggle('hcv-chat',c);
  if(b.classList.contains('hcv-list')!=(m&&!c))b.classList.toggle('hcv-list',m&&!c);
  if(key==last)return;last=key;
  try{var T=window.Telegram&&Telegram.WebApp;if(!T||!T.setHeaderColor)return;var r=document.getElementById('hcroot'),col=null;
   /*vb7a К1/К2: в чате фон контейнера Telegram (виден в кадрах перерисовки при клавиатуре) = фон чата, а не #hcroot*/
   if(m&&r){var bg=getComputedStyle(cq||r).backgroundColor;if(cq&&/rgba\(.*,\s*0\)|transparent/.test(bg))bg=getComputedStyle(r).backgroundColor;mm=bg.match(/\d+/g);if(mm)col='#'+mm.slice(0,3).map(function(x){return ('0'+(+x).toString(16)).slice(-2)}).join('')}
   if(!col)col=document.documentElement.dataset.theme=='light'?'#f6f4ee':'#07070d';
   T.setHeaderColor(col);T.setBackgroundColor(col);if(T.setBottomBarColor)T.setBottomBarColor(col)}catch(e){}}
 var mo=new MutationObserver(function(){upd()});
 function start(){mo.observe(document.body,{childList:true,subtree:true});upd()}
 if(document.body)start();else document.addEventListener('DOMContentLoaded',start);
 setInterval(upd,700);
 window.D8={groupTools:groupTools,OPEN:OPEN};
})();
