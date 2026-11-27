/* vb7-d: служебный текст и мелочи (видео 10.16, FINDINGS2 группы З, И).
   - аудио MEDIA:…mp3 — плеер (файл с ПК по подписи, только cache/audio);
   - имя пользователя одно везде: из аккаунта агента (как в Настройках), иначе Telegram;
   - заголовок меню ••• — название чата, а не «Новый чат»;
   - шаги «ToolSearch select:mcp__…» — словами;
   - «Инструкции» (CLAUDE.md / AGENTS.md / SOUL.md) — свёрнуто, markdown, не сырой моноширинный файл;
   - тосты в чате — над полем ввода, а не на первой строке пузыря;
   - одинаковые названия чатов в списках — с различием (папка · время). */
(function(){var W=window,D=document;
 function E(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
 function st(){return W.HC&&HC.st||{}}
 /* ---------- имя пользователя: аккаунт агента (кэш Настроек g7c), Hermes — аккаунт Claude (работает на подписке Claude) ---------- */
 var AQ={};
 function acctName(k){k=k=='codex'?'codex':'claude';try{var c=(W.LS&&LS.get('g7c',null))||{},a=c['acct?k='+k];if(a&&a.name)return String(a.name)}catch(e){}
  if(!AQ[k]&&W.API&&W.fetch){AQ[k]=1;fetch(String(API).replace(/\/$/,'')+'/api/hc/s5/acct?k='+k,{headers:{'X-Init-Data':W.tg?tg.initData:''}}).then(function(r){return r.ok?r.json():null}).then(function(d){
   if(!d||!d.name||d.error)return;try{var c=LS.get('g7c',null)||{};c['acct?k='+k]=d;LS.set('g7c',c)}catch(e){}}).catch(function(){})}
  return ''}
 function tgName(){try{var u=tg.initDataUnsafe&&tg.initDataUnsafe.user;return u?((u.first_name||'')+' '+(u.last_name||'')).trim()||u.username||'':''}catch(e){return ''}}
 W.vb7dUser=function(k){return acctName(k||st().kind)||tgName()};
 W.vb7dFirst=function(k){return (W.vb7dUser(k).split(/\s+/)[0])||''};
 /* ---------- заголовок меню •••: название чата; у нового — из списка или по первому сообщению ---------- */
 W.vb7dTitle=function(s){s=s||st();var t=String(s.title||'').trim();if(t&&!/^Новый чат$/i.test(t))return t;
  try{var L=(W.SD3&&SD3.SD&&SD3.SD.L&&SD3.SD.L[s.kind])||[],x=L.filter(function(y){return y.id==s.sid})[0]||(s.sessions||[]).filter(function(y){return y.id==s.sid})[0];if(x&&x.t&&!/^Новый чат$/i.test(x.t))return x.t}catch(e){}
  var u=(s.msgs||[]).filter(function(b){return b&&b.k=='u'&&(b.t||'').trim()})[0];if(u){var q=String(u.t).replace(/\s+/g,' ').trim();return q.length>40?q.slice(0,39).replace(/\s+\S*$/,'')+'…':q}
  return t||'Новый чат'};
 /* ---------- аргумент шага: «select:mcp__ccd_session_mgmt__get_session,…» → «get session, …» ---------- */
 function mcpWord(n){n=String(n||'').trim();var m=n.match(/^mcp__(.+?)__(.+)$/);return (m?m[2]:n).replace(/_/g,' ')}
 W.vb7dArg=function(x){x=String(x==null?'':x);var m=x.match(/^\s*select:(.+)$/i);if(m)return m[1].split(',').map(mcpWord).join(', ');
  return x.replace(/\bmcp__[A-Za-z0-9-]+?__([A-Za-z0-9_-]+)/g,function(_,t){return t.replace(/_/g,' ')})};
 /* ---------- аудио MEDIA: ---------- */
 var AC=Object.create(null);
 function aload(){var L=D.querySelectorAll('.vb7aud[data-fa]:not([data-ld])');for(var i=0;i<L.length;i++)(function(el){var p=el.getAttribute('data-fa');el.setAttribute('data-ld','1');
   var put=function(u){if(el.querySelector('audio'))return;var a=D.createElement('audio');a.controls=true;a.preload='metadata';a.src=u;el.appendChild(a);el.classList.add('ok')};
   if(AC[p]&&AC[p]!==1){put(AC[p]);return}if(!W.API||!W.fetch){el.classList.add('miss');return}
   fetch(String(API).replace(/\/$/,'')+'/api/hc/file?p='+encodeURIComponent(p),{headers:{'X-Init-Data':W.tg?tg.initData:''}}).then(function(r){if(!r.ok)throw r.status;return r.blob()})
    .then(function(b){AC[p]=URL.createObjectURL(b);put(AC[p])}).catch(function(){el.classList.add('miss');var l=el.querySelector('.vb7audl');if(l)l.textContent='🔊 Голосовой ответ — файл на ПК'})})(L[i])}
 /* ---------- «Инструкции»: служебный файл свёрнут и в markdown ---------- */
 function inst(){var L=D.querySelectorAll('.g7txt pre:not([data-vb7])');for(var i=0;i<L.length;i++){var pre=L[i],tx=pre.textContent||'';pre.setAttribute('data-vb7','1');
   if(!tx.trim()||/^— пусто —$/.test(tx.trim()))continue;var md=W.HC&&HC.md;var box=D.createElement('div');box.className='vb7inst';
   box.innerHTML='<div class="vb7instn">Служебные правила для агента</div><div class="vb7md">'+(md?md(tx):E(tx))+'</div><div class="vb7more" role="button">Показать полностью</div>';
   pre.style.display='none';pre.parentNode.insertBefore(box,pre.nextSibling)}}
 D.addEventListener('click',function(e){var m=e.target&&e.target.closest&&e.target.closest('.vb7more');if(!m)return;var b=m.closest('.vb7inst');if(!b)return;e.stopPropagation();
  var on=b.classList.toggle('open');m.textContent=on?'Свернуть':'Показать полностью'},true);
 /* ---------- одинаковые названия в списках чатов: различие «папка · время» ---------- */
 function hm(ts){if(!ts)return '';var d=new Date(ts*1000),n=new Date(),p=function(x){return (x<10?'0':'')+x};
  return d.toDateString()==n.toDateString()?p(d.getHours())+':'+p(d.getMinutes()):p(d.getDate())+'.'+p(d.getMonth()+1)+' '+p(d.getHours())+':'+p(d.getMinutes())}
 function find(k,id){var L=[];try{L=L.concat((W.SD3&&SD3.SD&&SD3.SD.L&&SD3.SD.L[k])||[])}catch(e){}L=L.concat(st().sessions||[]);try{if(st().fwdL&&st().fwdL[k])L=L.concat(st().fwdL[k])}catch(e){}
  return L.filter(function(x){return x&&x.id==id})[0]}
 function dups(){var R=D.querySelectorAll('#sd3 .sd3r[data-id], .hcfwdl .hcmi[data-id], #sd3 [data-sd=open][data-id]');if(!R.length)return;var by={};
  for(var i=0;i<R.length;i++){var b=R[i].querySelector('b');if(!b)continue;var t=(b.getAttribute('data-vb7t')||b.textContent).trim();(by[t]=by[t]||[]).push(R[i])}
  for(var t in by){if(by[t].length<2)continue;by[t].forEach(function(r){if(r.querySelector('.vb7dup'))return;var b=r.querySelector('b'),k=r.getAttribute('data-k')||r.getAttribute('data-v')||st().kind,x=find(k,r.getAttribute('data-id'))||{};
   var dir=String(x.cwd||x.dir||x.p||x.prj||'').split(/[\\\/]/).filter(Boolean).pop()||'',lab=[dir,hm(x.ts)].filter(Boolean).join(' · ');if(!lab)return;
   b.setAttribute('data-vb7t',t);var s=D.createElement('small');s.className='vb7dup';s.textContent=lab;b.appendChild(s)})}}
 /* ---------- тосты в чате — над полем ввода (не на первой строке пузыря) ---------- */
 function toastPos(){var t=D.getElementById('toast');if(!t)return;var B=D.body;if(!(B.classList.contains('g3on')||B.classList.contains('cl3on'))||!t.classList.contains('on')){if(t.classList.contains('vb7tb'))t.classList.remove('vb7tb');return}/*vb8-a7: remove() без класса всё равно пишет атрибут → мутация → наш же наблюдатель → вечный цикл каждый кадр (чат перерисовывался 60 раз/с и тянул ленту вниз под пальцем)*/
  var c=D.querySelector('#g3c,#clc');if(!c)return;var r=c.getBoundingClientRect();if(!r.height)return;var h=t.offsetHeight||36,top=Math.max(60,Math.round(r.top-h-12));
  if(!t.classList.contains('vb7tb'))t.classList.add('vb7tb');if(t.style.getPropertyValue('top')!=top+'px')t.style.setProperty('top',top+'px','important')}
 var MO=0;function tick(){MO=0;try{aload()}catch(e){}try{inst()}catch(e){}try{dups()}catch(e){}try{toastPos()}catch(e){}}
 try{new MutationObserver(function(){if(!MO)MO=requestAnimationFrame(tick)}).observe(D.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']})}catch(e){}
 W.VB7D={tick:tick,acctName:acctName}})();
