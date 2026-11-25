/* vb5: правки по видео iPhone v10.14 (16-16-20). В — вход в выбор модели у Codex/Hermes как в ChatGPT iOS:
   название модели по центру шапки «GPT-6.2-Sol ⌄», тап = то же стеклянное меню модели (g6_model mmOpen), растущее вниз.
   Codex: в новом чате (ни одного хода) модель первого хода выбирается; в начатом — только видна (Codex Desktop держит её сам). */
(function(){var W=window,D=document;
 function st(){return W.HC&&HC.st}
 var CXM={},INF={};
 function api(){return (typeof API=='string'?API:'').replace(/\/$/,'')}
 function cxm(s){var id=s.sid;if(!id||INF[id])return CXM[id];var c=CXM[id];if(c&&!(c.fresh&&!HC.cxFresh()))return c;INF[id]=1;
  fetch(api()+'/api/hc/cx/sessions/'+encodeURIComponent(id)+'/model',{headers:{'X-Init-Data':W.tg?tg.initData:''}}).then(function(r){return r.json()}).then(function(d){INF[id]=0;if(d&&typeof d.model=='string'){CXM[id]=d;hd()}}).catch(function(){INF[id]=0;CXM[id]={model:'',effort:'',fresh:false,err:1}});return c}
 function nm(m){return W.G6M&&G6M.name?G6M.name(m):HC.pretty(m)}
 function info(){var s=st();if(!s||!s.sid&&s.kind!='hermes')return null;if(s.kind!='codex'&&s.kind!='hermes')return null;
  if(s.kind=='hermes')return {t:HC.chipTxt?HC.chipTxt():'Hermes',can:true};
  if(s.rw)return {t:HC.chipTxt?HC.chipTxt():'Codex',can:true};          /* чат панели (app-server): модель меняется всегда */
  var fr=HC.cxFresh&&HC.cxFresh(),sel=s.msel&&s.msel.m,c=cxm(s);
  if(fr)return {t:sel?nm(sel):(c&&c.model?nm(c.model):(s.models&&s.models.cur?nm(s.models.cur.model):'Codex')),can:true};
  return {t:c&&c.model?nm(c.model):'Codex',can:false}}
 var CHV='<svg class="g8chv" width="11" height="7" viewBox="0 0 11 7" aria-hidden="true"><path d="M1.2 1.3 5.5 5.6 9.8 1.3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
 function hd(){var sp=D.querySelector('#g3hd .g3sp');if(!sp)return;var i=info(),el=sp.querySelector('.g8mt');
  if(!i){if(el)el.remove();return}
  var key=i.t+'|'+i.can;if(el&&el.__k===key)return;
  if(!el){el=D.createElement('div');el.className='g8mt';el.setAttribute('role','button');el.dataset.g8='mt';sp.appendChild(el)}
  el.__k=key;el.classList.toggle('g8ro',!i.can);el.setAttribute('aria-label','Модель: '+i.t);el.innerHTML='<b>'+String(i.t).replace(/[&<>"]/g,function(c){return '&#'+c.charCodeAt(0)+';'})+'</b>'+(i.can?CHV:'')}
 D.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-g8=mt]');if(!t)return;e.stopPropagation();e.preventDefault();
  var i=info();if(!i||!i.can)return;if(W.haptic)try{haptic('light')}catch(_){}
  if(W.G6M&&G6M.mm)G6M.mm('m',t);else if(W.G3)G3.modelMenu()},true);
 /*vb5b11: шаг последней проверки Face ID в Настройках (база показывала код «lock_skip») — словами*/
 var BIO={lock_ok:'вход подтверждён',ok:'подтверждено',lock_skip:'не спрашивал: вход был меньше 2 мин назад',lock_denied:'отказано',denied:'отказано',lock_timeout:'нет ответа',init_timeout:'нет ответа',
  lock_unavailable:'недоступно на этом телефоне',unavailable:'недоступно на этом телефоне',test_unavailable:'недоступно на этом телефоне',lock_access_no:'нет доступа к Face ID',lock_throw:'ошибка',auth_throw:'ошибка',init_throw:'ошибка',req_throw:'ошибка'};
 function bioTx(h){return typeof h!='string'?h:h.replace(/(последняя попытка: |<div class="d">)([a-z_]+)(<\/div>)/g,function(m,a,k,b){return BIO[k]?a+BIO[k]+b:m})}
 ['settings','settingsT'].forEach(function(n){var f=W[n];if(typeof f!='function'||f.__vb5)return;W[n]=function(){return bioTx(f.apply(this,arguments))};W[n].__vb5=1});
 /*vb5d: диагностика с iPhone (видео 478–482, 505–507, 637–639 с): на стенде не воспроизводится, причину ищем по panel_diag*/
 var DG={t:0,y:{},n:0,kb:0};function dg(ev,o){if(DG.n>=40||!W.cbDiag)return;DG.n++;try{cbDiag(ev,o)}catch(e){}}
 ['touchstart','touchmove','wheel','pointerdown'].forEach(function(e){D.addEventListener(e,function(){DG.t=Date.now()},{capture:true,passive:true})});
 D.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('[data-g3=down],[data-cl=down],#g3dn,#cldn'))DG.t=Date.now()},true);
 D.addEventListener('scroll',function(e){var f=e.target;if(!f||!f.id||(f.id!='g3f'&&f.id!='clf'))return;var y=f.scrollTop,p=DG.y[f.id];DG.y[f.id]=y;if(p==null)return;
  var d=y-p,s=st();if(Math.abs(d)>220&&Date.now()-DG.t>900&&s&&s.view=='chat')dg('feed_jump',{k:s.kind,d:Math.round(d),y:Math.round(y),h:f.scrollHeight,ch:f.clientHeight,n:s.msgs.length,busy:s.busy?1:0,ld:s.loadingMsgs?1:0,kb:D.body.classList.contains('hckb')?1:0})},true);
 setInterval(function(){var ta=D.getElementById('hcin'),vv=W.visualViewport,s=st();if(!ta||!vv||D.activeElement!==ta||!s||s.view!='chat'){DG.kb=0;return}
  var r=ta.getBoundingClientRect(),hid=r.bottom>vv.offsetTop+vv.height+4;if(!hid){DG.kb=0;return}if(!DG.kb){DG.kb=Date.now();return}
  if(DG.kb>0&&Date.now()-DG.kb>250){dg('kb_hidden',{k:s.kind,bot:Math.round(r.bottom),vvh:Math.round(vv.height),vvt:Math.round(vv.offsetTop),ih:innerHeight,ms:Date.now()-DG.kb});DG.kb=-1}},100);
 W.G8={hd:hd,info:info,cxm:CXM,bio:BIO};
})();
