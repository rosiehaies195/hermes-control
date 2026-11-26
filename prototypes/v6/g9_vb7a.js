/* vb7a (видео iPhone v10.16, К1–К3): клавиатура Telegram iOS.
   Telegram iOS снимает с WKWebView наблюдателей клавиатуры и меняет высоту окна Mini App только через 0,4 с
   (WebAppController.swift `after(0.4)`), а `viewport_changed` с конечной высотой (окно минус клавиатура) шлёт СРАЗУ,
   в начале анимации клавиатуры. Поэтому на iOS по `viewportChanged` сразу и плавно поднимаем экран чата (.g3/.cl3),
   открытый лист (#sheet.on) и поиск в ☰: раскладка «сверху с явной высотой» (top:0; height:H0−kb), и когда окно через
   0,4 с уменьшится до той же высоты, ничего не сдвигается, а scrollToActiveElement Telegram не срабатывает (поле видно).
   Закрытие — опускаем сразу по событию (или по уходу фокуса). Нет события (старый Telegram, внешняя клавиатура,
   Android, Telegram Desktop) — ничего не делаем, работает прежняя схема (S4VV по visualViewport/resize).
   Плюс: пилюля Claude не раскрывается до прихода клавиатуры (класс body.vb7kbw = «ждём клавиатуру»), diag kb_t
   (мс от касания до viewportChanged / resize / vv.resize, раз на тап), diag kb_lost (поле потеряло фокус само). */
(function(){var W=window,D=document,R=D.documentElement;
 function T(){return W.Telegram&&Telegram.WebApp}
 function ios(){try{var t=T();return !!t&&t.platform=='ios'}catch(e){return false}}
 function edit(el){if(!el||!el.tagName)return false;var n=el.tagName;return n=='TEXTAREA'||(n=='INPUT'&&!/^(checkbox|radio|button|submit|file|range|color|hidden)$/i.test(el.type||''))||!!el.isContentEditable}
 function RM(){try{return matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return false}}
 /* кривая клавиатуры iOS (приближение пружины UIKit к кубической Безье) */
 function bez(x1,y1,x2,y2){function a(p1,p2){return 1-3*p2+3*p1}function b(p1,p2){return 3*p2-6*p1}function c(p1){return 3*p1}
  function cv(t,p1,p2){return ((a(p1,p2)*t+b(p1,p2))*t+c(p1))*t}function sl(t,p1,p2){return 3*a(p1,p2)*t*t+2*b(p1,p2)*t+c(p1)}
  return function(x){if(x<=0)return 0;if(x>=1)return 1;var t=x;for(var i=0;i<8;i++){var s=sl(t,x1,x2);if(Math.abs(s)<1e-6)break;t-=(cv(t,x1,x2)-x)/s}return cv(t,y1,y2)}}
 var EASE=bez(.38,.7,.125,1),OPEN_MS=330,CLOSE_MS=260;
 var K={on:false,H0:0,kb:0,cur:0,to:0,raf:0,offT:0,closing:0,ev:0};
 function bodyCls(c,v){var b=D.body;if(b&&b.classList.contains(c)!=!!v){b.classList.toggle(c,!!v);if(c=='vb7kbw'&&!v)try{W.dispatchEvent(new Event('vb7kbw'))}catch(e){}}}
 function relayout(){try{W.G3&&G3.relayout&&G3.relayout()}catch(e){}try{W.CL3&&CL3.relayout&&CL3.relayout()}catch(e){}
  try{W.dispatchEvent(new Event('vb7kb'))}catch(e){}}
 function set(v){K.cur=v;R.style.setProperty('--vb7k',Math.round(v*10)/10+'px');relayout()}
 function anim(to,ms,fin){cancelAnimationFrame(K.raf);K.to=to;var from=K.cur;if(Math.abs(to-from)<1||RM()){set(to);fin&&fin();return}
  var t0=performance.now();
  /* первый кадр — уже следующий rAF: поле начинает подниматься вместе с клавиатурой */
  (function fr(){var x=Math.min(1,(performance.now()-t0)/ms);set(from+(to-from)*EASE(x));if(x<1)K.raf=requestAnimationFrame(fr);else{K.raf=0;fin&&fin()}})()}
 function begin(){if(K.on)return;K.on=true;K.H0=innerHeight;K.cur=0;R.style.setProperty('--vb7H',K.H0+'px');R.style.setProperty('--vb7k','0px');var s=D.querySelector('#sheet.on');R.style.setProperty('--vb7sb',(s&&!R.classList.contains('s4kbv')?Math.max(0,parseFloat(getComputedStyle(s).bottom)||0):0)+'px');R.classList.add('vb7kb')}
 function end(){clearTimeout(K.offT);K.offT=0;if(!K.on)return;K.on=false;K.closing=0;cancelAnimationFrame(K.raf);K.raf=0;K.cur=0;K.kb=0;
  R.classList.remove('vb7kb');R.style.removeProperty('--vb7H');R.style.removeProperty('--vb7k');R.style.removeProperty('--vb7sb');relayout()}
 /* закрыто: держим явную высоту, пока окно не вырастет обратно (resize приходит позже события), потом обычная раскладка */
 function settle(){clearTimeout(K.offT);var t0=Date.now();(function w(){if(!K.on||K.to>0)return;if(innerHeight>=K.H0-2||Date.now()-t0>900){end();return}K.offT=setTimeout(w,40)})()}
 function open(kb){begin();K.kb=kb;K.closing=0;bodyCls('vb7kbw',false);bodyCls('vb7kbup',true);anim(kb,OPEN_MS)}
 function close(){if(!K.on||K.closing)return;K.closing=1;K.kb=0;bodyCls('vb7kbup',false);anim(0,CLOSE_MS,settle)}
 function onVC(){var t=T();if(!t||!ios())return;var vh=+t.viewportHeight||0;if(!vh)return;K.ev=Date.now();kbT('vc',{vh:Math.round(vh)});
  var a=D.activeElement,H0=K.on?K.H0:innerHeight,kb=Math.round(H0-vh);
  clearTimeout(PR.t);
  if(kb>44&&edit(a)){try{localStorage.setItem('vb7kbh',String(kb))}catch(e){}if(!K.on||Math.abs(kb-K.to)>1||K.closing)open(kb);return}
  if(K.on&&kb<=44)close()}
 function sub(){var t=T();if(!t||!t.onEvent)return false;try{t.onEvent('viewportChanged',onVC)}catch(e){return false}return true}
 /* ---------- ждём клавиатуру: пилюля Claude раскрывается не по фокусу, а когда клавиатура пошла ---------- */
 var WT=0,IH=0;
 D.addEventListener('focusin',function(e){if(!edit(e.target))return;IH=innerHeight;
  if(e.target.id=='hcin'&&ios()&&!K.on){bodyCls('vb7kbw',true);clearTimeout(WT);WT=setTimeout(function(){bodyCls('vb7kbw',false)},650)}},true);
 W.addEventListener('resize',function(){if(D.body&&D.body.classList.contains('vb7kbw')&&innerHeight<IH-40){clearTimeout(WT);bodyCls('vb7kbw',false)}});
 if(W.visualViewport)visualViewport.addEventListener('resize',function(){var v=visualViewport;if(D.body&&D.body.classList.contains('vb7kbw')&&innerHeight-v.height>40){clearTimeout(WT);bodyCls('vb7kbw',false)}});
 /* ушёл фокус и не вернулся в поле — клавиатура закрывается: опускаем сразу, не дожидаясь события */
 D.addEventListener('focusout',function(e){if(!edit(e.target))return;clearTimeout(WT);bodyCls('vb7kbw',false);
  setTimeout(function(){if(!edit(D.activeElement))close()},30)},true);
 /* ---------- diag kb_t: мс от касания/фокуса до viewportChanged, window.resize, vv.resize — один раз на тап ---------- */
 var KT=null;
 function kbT(k,x){if(!KT||KT.sent)return;var ms=Math.round(performance.now()-KT.t0);if(KT[k]==null){KT[k]=ms;if(x)for(var q in x)KT[q]=x[q]}}
 function kbStart(src){if(KT&&!KT.sent&&performance.now()-KT.t0<800){if(KT[src]==null)KT[src]=Math.round(performance.now()-KT.t0);return}
  KT={t0:performance.now(),ih0:innerHeight,vv0:W.visualViewport?Math.round(visualViewport.height):0,sent:0};KT[src]=0;var me=KT;
  setTimeout(function(){if(me.sent)return;me.sent=1;var t=T(),o={pd:me.pd,fi:me.fi,vc:me.vc,wr:me.wr,vr:me.vr,vh:me.vh,tvh:t?Math.round(+t.viewportHeight||0):0,
   ih0:me.ih0,ih1:innerHeight,vv0:me.vv0,vv1:W.visualViewport?Math.round(visualViewport.height):0,pl:t&&t.platform,on:K.on?1:0,kb:K.kb};
   if(me.fi==null&&me.vc==null)return;try{W.cbDiag&&cbDiag('kb_t',o)}catch(e){}},1500)}
 D.addEventListener('pointerdown',function(e){var el=e.target&&e.target.closest&&e.target.closest('textarea,input,[contenteditable]');if(el&&edit(el)&&D.activeElement!==el)kbStart('pd')},true);
 D.addEventListener('focusin',function(e){if(edit(e.target))kbStart('fi')},true);
 W.addEventListener('resize',function(){kbT('wr',{ihr:innerHeight})});
 if(W.visualViewport)visualViewport.addEventListener('resize',function(){kbT('vr')});
 /* ---------- diag kb_lost (А-2): после ↑ поле потеряло фокус без касания вне поля — кто снял (стек, узел удалён) ---------- */
 var LO={t:0,pd:0};
 D.addEventListener('click',function(e){var g=e.target&&e.target.closest&&e.target.closest('[data-g3=go],[data-cl=go]');if(g&&D.activeElement&&D.activeElement.id=='hcin')LO.t=Date.now()},true);
 D.addEventListener('pointerdown',function(e){var g=e.target&&e.target.closest&&e.target.closest('[data-g3=go],[data-cl=go],#hcin');if(!g)LO.pd=Date.now()},true);
 D.addEventListener('focusout',function(e){if(!e.target||e.target.id!='hcin'||!LO.t||Date.now()-LO.t>2500||LO.pd>LO.t)return;var ta=e.target,t0=LO.t;LO.t=0;
  var st0=String(new Error().stack||'').split('\n').slice(1,6).join(' < ').slice(0,300);
  setTimeout(function(){var kbh=false;try{kbh=!!(W.G7&&G7.pf&&G7.pf('kbhide'))}catch(x){}
   try{W.cbDiag&&cbDiag('kb_lost',{ms:Date.now()-t0,gone:ta.isConnected?0:1,ae:(D.activeElement&&(D.activeElement.id||D.activeElement.tagName))||'',kbh:kbh?1:0,st:st0,k:W.HC&&HC.st&&HC.st.kind})}catch(x){}},0)},true);
 /* ---------- (а) запомненная высота: по касанию поля сразу едем на прошлую высоту клавиатуры; нет viewportChanged за 150 мс — откат ---------- */
 var PR={pd:0,t:0};
 D.addEventListener('pointerdown',function(e){var el=e.target&&e.target.closest&&e.target.closest('textarea,input');PR.pd=el&&edit(el)&&D.activeElement!==el?Date.now():0},true);
 D.addEventListener('focusin',function(e){if(!ios()||K.on||!edit(e.target)||!PR.pd||Date.now()-PR.pd>800)return;PR.pd=0;var h=0;try{h=+localStorage.getItem('vb7kbh')||0}catch(x){}
  if(h<120||h>innerHeight*.7)return;var ev0=K.ev;open(h);clearTimeout(PR.t);PR.t=setTimeout(function(){if(K.ev==ev0&&K.on)close()},150)},true);
 var ok=sub();if(!ok){var n=0,iv=setInterval(function(){if(sub()||++n>20)clearInterval(iv)},250)}
 W.VB7KB={on:function(){return K.on},kb:function(){return K.on?K.cur:0},
  /* сколько px поднять то, что прибито к низу ОКНА (поиск ☰): до уменьшения окна = текущая высота клавиатуры, после — 0 */
  off:function(){return K.on?Math.max(0,K.cur+innerHeight-K.H0):0},H0:function(){return K.H0},_vc:onVC,_K:K};
})();
/* vb7a А-2: клавиатура не уходит сама после ↑ (видео 94, 467, 484 с). Общий render() переписывает #scr целиком, и #hcin
   с фокусом удаляется — iOS прячет клавиатуру (новый чат создан, пока поле в фокусе / ↑ во время создания). Если открыт
   тот же экран чата и поле в фокусе — перерисовываем только чат (HC.after → paintChat бережёт поле). */
(function(){var W=window,D=document;if(typeof W.render!='function')return;var r0=W.render;
 W.render=function(){try{var a=D.activeElement,r=D.getElementById('hcroot');
  if(!arguments.length&&a&&a.id=='hcin'&&r&&r.contains(a)&&W.U&&U.tab=='hc'&&(!U.page||U.page=='hcchat')&&W.HC&&HC.st&&HC.st.view=='chat'&&HC.after&&(D.getElementById('g3')||D.getElementById('cl3'))){HC.after();return}}catch(e){}
  return r0.apply(this,arguments)};for(var k in r0)W.render[k]=r0[k]})();
/* vb7a П10: пользователь сам листает ленту — больше не тянем её вниз после прихода истории */
(function(){var D=document;function u(e){var t=e.target;if(!t||!t.closest)return;var f=t.closest('#g3f,#clf');if(!f)return;var l=f.querySelector('#g3l,#cll');if(l)l.__usr=1}
 D.addEventListener('touchstart',u,{capture:true,passive:true});D.addEventListener('wheel',u,{capture:true,passive:true})})();
