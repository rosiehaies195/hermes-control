/* v8.9: включает стеклянные элементы управления (glassui.css) и приводит «‹ Назад» к виду капсулы со стрелкой */
(function(){document.body.classList.add('gu88');
 function fixBack(){[].forEach.call(document.querySelectorAll('.back'),function(b){if(b.__g88)return;b.__g88=1;var f=b.firstChild;
  if(f&&f.nodeType==3&&/^\s*‹\s*/.test(f.nodeValue)){f.nodeValue=f.nodeValue.replace(/^\s*‹\s*/,'');b.insertAdjacentHTML('afterbegin',IC('chevron-left'))}})}
 /* Журнал и Настройки (вход из «Ещё»): «‹ Ещё» встаёт в шапку вместо логотипа, заголовок — название раздела (как в iOS),
    а не отдельной кнопкой над шапкой, где она теснилась в углу экрана */
 function subHead(){var bm=document.querySelector('#scr .bm86'),hd=document.querySelector('#scr .hd');if(!bm||!hd||hd.querySelector('.bm86'))return;
  var lg=hd.querySelector('.logo'),h1=hd.querySelector('h1');bm.classList.add('inhd88');if(lg)lg.replaceWith(bm);else hd.insertBefore(bm,hd.firstChild);
  if(h1)h1.textContent=U.tab=='j'?'Журнал':U.tab=='set'?'Настройки':h1.textContent;hd.classList.add('sub88')}
 var _r=render;render=function(){var x=_r.apply(this,arguments);try{subHead();fixBack()}catch(e){}return x};
 new MutationObserver(function(){fixBack()}).observe(document.getElementById('scr')||document.body,{childList:true,subtree:true});
 /* переключатели (Hermes/Claude/Codex в чате, просто/тех, Сессии/События): серая подложка выбранного пункта плавно переезжает,
    как на нижней панели. Экран перерисовывается целиком, поэтому прошлое положение подложки помним по ключу переключателя */
 window.GU88={anims:0};
 var SEGS='.hckind,.pmbar .seg,.seg.full',LAST={},RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
 function segKey(el){if(el.classList.contains('hckind'))return 'hckind';var all=[].slice.call(document.querySelectorAll(SEGS));return el.className+':'+all.indexOf(el)+':'+U.tab+':'+(U.page||'')}
 function setup(el){var kids=[].filter.call(el.children,function(c){return c.tagName=='SPAN'}),on=kids.filter(function(c){return c.classList.contains('on')})[0];if(!on||!el.offsetWidth)return;
  var sl=el.querySelector(':scope>i.sl88');if(!sl){sl=document.createElement('i');sl.className='sl88';el.insertBefore(sl,el.firstChild);el.classList.add('hs88')}
  var x=on.offsetLeft,w=on.offsetWidth,k=segKey(el);if(sl.__x===x&&sl.__w===w)return;
  var from=sl.__x!=null?{x:sl.__x,w:sl.__w}:LAST[k];
  sl.style.top=on.offsetTop+'px';sl.style.height=on.offsetHeight+'px';sl.style.width=w+'px';sl.style.transform='translateX('+x+'px)';
  if(from&&Math.abs(from.x-x)>1&&sl.animate&&!RM&&++GU88.anims)sl.animate([{transform:'translateX('+from.x+'px)',width:from.w+'px'},{transform:'translateX('+x+'px)',width:w+'px'}],{duration:340,easing:'cubic-bezier(.32,1.18,.5,1)'});
  sl.__x=x;sl.__w=w;LAST[k]={x:x,w:w}}
 var qd=0;function scan(){qd=0;try{[].forEach.call(document.querySelectorAll(SEGS),setup)}catch(e){}}
 function queue(){if(!qd){qd=1;requestAnimationFrame(scan)}}
 new MutationObserver(queue).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
 window.addEventListener('resize',function(){[].forEach.call(document.querySelectorAll('i.sl88'),function(s){s.__x=null});LAST={};queue()});
 queue();
})();
