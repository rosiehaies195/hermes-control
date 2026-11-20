/* v8.8 «стеклянная» нижняя навигация как в Instagram нижней навигации (как Instagram / iOS 26), поверх prj.js (v8.7).
   - DOM панели строится один раз и больше не перерисовывается: render() базы пишет старые вкладки в $('nav') —
     эта запись уходит в скрытый «пустой» узел, а настоящая панель только меняет классы → анимации не обрываются.
   - Как в Instagram: одна стеклянная панель, под выбранной вкладкой — плоская серая подложка, она плавно переезжает.
   - Зажал выбранную вкладку и повёл — подложка едет за пальцем, отпустил — вкладка выбрана.
   - Нажатие слегка утапливает значок, счётчик вопросов выскакивает, при прокрутке вниз панель сжимается (подписи прячутся). */
(function(){
 var REAL=document.getElementById('nav'),SINK=document.createElement('div');
 var _$=$;$=function(i){return i=='nav'?SINK:_$(i)};
 var TABS=[['home','house','Пульт'],['prj','folder-kanban','Проекты'],['hc','message-square-text','Чат'],['br','brain','Мозг'],['more','circle-ellipsis','Ещё']];
 var cur=null,RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
 window.GL87={min:true};
 function L(){return REAL.querySelector('.ln87')}
 function tab(x){return REAL.querySelector('[data-x="'+x+'"]')}
 function build(){REAL.innerHTML='<span class="gb87"></span><span class="ln87"><span></span></span>'+TABS.map(function(t){
   return '<div data-a="tab" data-x="'+t[0]+'"><i>'+IC(t[1])+'</i><span class="lb87">'+t[2]+'</span><span class="bg87"></span></div>'}).join('');cur=null}
 function geo(x){var el=tab(x);return el?{x:el.offsetLeft+2,w:el.offsetWidth-4}:null}
 function place(x,anim,from){var l=L(),g=geo(x);if(!l||!g||!REAL.offsetWidth)return;l.style.width=g.w+'px';var x0=from!=null?from:l.__x;
  /* как в Instagram: подложка просто плавно переезжает (лёгкая пружина), без растяжения и «линзы» */
  if(anim&&x0!=null&&Math.abs(x0-g.x)>1&&!RM&&l.animate)l.animate([{transform:'translateX('+x0+'px)'},{transform:'translateX('+g.x+'px)'}],{duration:340,easing:'cubic-bezier(.32,1.18,.5,1)'});
  l.style.transform='translateX('+g.x+'px)';l.__x=g.x}
 function boing(x){var el=tab(x);if(!el||RM||!el.animate)return;el.querySelector('i').animate([{transform:'scale(.9)'},{transform:'scale(1)'}],{duration:220,easing:'ease-out'})}
 nav86=function(){if(!REAL.querySelector('.ln87'))build();
  var c=navCur86(),hb=hBad().length;
  TABS.forEach(function(t){var el=tab(t[0]),b=el.querySelector('.bg87'),txt=t[0]=='home'&&S.pend.length?String(S.pend.length):t[0]=='more'&&hb?'!':'';
   el.classList.toggle('on',t[0]==c);
   if(b.textContent!=txt){var was=!!b.textContent;b.textContent=txt;b.className='bg87'+(txt?' vis':'')+(t[0]=='more'?' bad':'');
    if(txt&&!RM&&b.animate)b.animate(was?[{transform:'scale(1)'},{transform:'scale(1.3)'},{transform:'scale(1)'}]:[{transform:'scale(0)',opacity:0},{transform:'scale(1.3)',opacity:1,offset:.6},{transform:'scale(1)'}],{duration:420,easing:'cubic-bezier(.3,1.5,.5,1)'})}});
  if(c!=cur){var first=cur==null;cur=c;if(first)requestAnimationFrame(function(){place(c,false)});else{place(c,true);boing(c)}}
  document.body.classList.add('g86','gl87')};
 try{nav86()}catch(e){}
 window.addEventListener('resize',function(){if(cur)place(cur,false)});
 /* панель была скрыта (открытый чат) или сменила размер — линзу ставим заново, без анимации */
 if(window.ResizeObserver)new ResizeObserver(function(){if(cur&&REAL.offsetWidth)place(cur,false)}).observe(REAL);

 /* палец: нажал — линза раздулась; повёл — едет за пальцем; отпустил — выбрал вкладку под пальцем */
 var drag=null;
 REAL.addEventListener('pointerdown',function(e){var t=e.target.closest('[data-x]');if(!t||t.dataset.x!=cur)return;drag={x0:e.clientX,moved:false,id:e.pointerId}});
 REAL.addEventListener('pointermove',function(e){if(!drag)return;var l=L();if(!drag.moved&&Math.abs(e.clientX-drag.x0)<8)return;
  if(!drag.moved){drag.moved=true;l.classList.add('drag');try{REAL.setPointerCapture(drag.id)}catch(_){}}
  var r=REAL.getBoundingClientRect(),w=l.offsetWidth,x=Math.max(2,Math.min(r.width-w-2,e.clientX-r.left-w/2));l.getAnimations&&l.getAnimations().forEach(function(a){a.cancel()});
  l.style.transform='translateX('+x+'px)';l.__x=x;
  var over=null;TABS.forEach(function(t){var g=geo(t[0]);if(e.clientX-r.left>=g.x&&e.clientX-r.left<g.x+g.w)over=t[0]});
  [].forEach.call(REAL.querySelectorAll('[data-x]'),function(el){el.classList.toggle('hov',el.dataset.x==over)});drag.over=over});
 function end(e,cancel){if(!drag)return;var l=L(),d=drag;drag=null;l.classList.remove('drag');[].forEach.call(REAL.querySelectorAll('.hov'),function(el){el.classList.remove('hov')});
  if(d.moved){if(!cancel&&d.over&&d.over!=cur){var el=tab(d.over);el.click()}else place(cur,true)}}
 REAL.addEventListener('pointerup',function(e){end(e,false)});REAL.addEventListener('pointercancel',function(e){end(e,true)});
 /* после перетаскивания браузер шлёт click по самой панели — гасим, чтобы не было двойного выбора */
 REAL.addEventListener('click',function(e){if(e.target==REAL||e.target.classList.contains('gb87'))e.stopPropagation()},true);

 /* прокрутка вниз — панель сжимается (подписи прячутся), вверх — возвращается */
 var ly=window.scrollY;
 window.addEventListener('scroll',function(){var y=window.scrollY,b=document.body;if(!GL87.min){b.classList.remove('nm87');ly=y;return}
  if(y>ly+6&&y>80)b.classList.add('nm87');else if(y<ly-6||y<30)b.classList.remove('nm87');ly=y},{passive:true});
 REAL.addEventListener('transitionend',function(e){if(e.target==REAL&&cur)place(cur,false)});
})();
