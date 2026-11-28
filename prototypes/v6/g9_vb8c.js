/* vb8c: правки ленты по видео v10.22 (27.11), группа Б.
   Б4 — чат из ☰ открывается не на конце: картинки (MEDIA было/стало, фото) догружаются ПОСЛЕ того, как лента встала вниз,
   лента растёт, а прокрутка остаётся старой — на экране середина/начало переписки (видео 108, 238: feed_jump d=8987).
   Пока чат только что открыт (до 15 с) и пользователь ленту не трогал (касание, колесо, клик), любое изменение высоты ленты
   держит её у низа. После своей отправки (полёт пузыря) окно закрыто — там свой порядок (пузырь под шапку). */
(function(){var W=window,D=document;if(W.VB8C)return;
 var OPEN=15000,cur=null,ro=null,lastH=0;
 function feedOf(l){return l&&l.parentElement&&(l.parentElement.id=='g3f'||l.parentElement.id=='clf')?l.parentElement:D.querySelector('#g3f,#clf')}
 function pinned(l){return !!(l&&l.__op&&!l.__usr&&Date.now()-l.__op<OPEN)}
 function hold(){return !!(W.VB8&&VB8.hold&&VB8.hold())}
 function onSize(){var l=cur;if(!l||!l.isConnected)return;var f=feedOf(l);if(!f)return;var h=l.scrollHeight;if(h===lastH)return;lastH=h;
  if(!pinned(l)||hold())return;var s=W.HC&&HC.st;if(s&&((s.cur&&s.cur.live)||s.cclive))return;/*идёт ответ — лента за ним не едет (как ChatGPT)*/if(f.scrollHeight-f.scrollTop-f.clientHeight>1)f.scrollTop=f.scrollHeight}
 function attach(){var l=D.querySelector('#g3l,#cll');if(l===cur)return;if(ro){try{ro.disconnect()}catch(e){}}cur=l;lastH=0;if(!l||!W.ResizeObserver)return;
  ro=new ResizeObserver(onSize);ro.observe(l)}
 setInterval(attach,250);
 /* картинка догрузилась — ResizeObserver на ленте увидит, но img load приходит раньше раскладки в некоторых WebKit: перепроверим */
 D.addEventListener('load',function(e){var t=e.target;if(t&&t.tagName=='IMG'&&cur&&cur.contains(t))requestAnimationFrame(onSize)},true);
 /* пользователь сам взялся за ленту — больше не держим (касание уже ставит __usr в g9_vb7a; добавляем клик мышью — Telegram Desktop) */
 function usr(e){var t=e.target;if(!t||!t.closest)return;var f=t.closest('#g3f,#clf');if(!f)return;var l=f.querySelector('#g3l,#cll');if(l)l.__usr=1}
 D.addEventListener('mousedown',usr,true);D.addEventListener('keydown',function(e){if(/^(PageUp|PageDown|Home|End|ArrowUp|ArrowDown)$/.test(e.key)){var l=D.querySelector('#g3l,#cll');if(l&&D.activeElement&&D.activeElement.id!='hcin')l.__usr=1}},true);
 /* Б5: «лента скачет сама» (видео 962–965, side-чат Codex) на стенде не воспроизводится ни в одном сценарии — пишем подробности
    с iPhone отдельным счётчиком (у feed_jump из g8_vb5 общий лимит 40 событий, к 962 с он уже кончился) */
 var FJ={n:0,t:0,y:{},tp:0};D.addEventListener('touchstart',function(){FJ.tp=Date.now()},{capture:true,passive:true});D.addEventListener('wheel',function(){FJ.tp=Date.now()},{capture:true,passive:true});
 D.addEventListener('scroll',function(e){var f=e.target;if(!f||(f.id!='g3f'&&f.id!='clf'))return;var y=f.scrollTop,p=FJ.y[f.id];FJ.y[f.id]=y;if(p==null||FJ.n>=25||!W.cbDiag)return;
  var d=y-p,s=W.HC&&HC.st;if(Math.abs(d)<150||Date.now()-FJ.tp<900||Date.now()-FJ.t<300||!s||s.view!='chat')return;FJ.t=Date.now();FJ.n++;
  var vv=W.visualViewport;try{cbDiag('feed_jump2',{k:s.kind,side:!!(W.S5D&&S5D.cur&&S5D.cur()),d:Math.round(d),y:Math.round(y),h:f.scrollHeight,ch:f.clientHeight,n:(s.msgs||[]).length,
   busy:s.busy?1:0,live:(s.cclive||(s.cur&&s.cur.live))?1:0,ld:s.loadingMsgs?1:0,kb:D.body.classList.contains('hckb')?1:0,ih:innerHeight,vvh:vv?Math.round(vv.height):0,op:cur&&cur.__op?Date.now()-cur.__op:-1})}catch(x){}},true);
 W.VB8C={pinned:function(){return pinned(cur)},attach:attach};
})();
