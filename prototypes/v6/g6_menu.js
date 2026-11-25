/* s4-e: стеклянные меню, вырастающие из кнопки (s4/ref/B1-claude-spec.md §8 «меню •••», B2 §2.5/§4.4 «меню ⓘ», §6 анимации).
   Claude «•••» (103.53–104.63 с): меню закрывает капсулу [✎|•••] (она исчезает на время меню) и растёт из неё «каплей»:
   ≈230 мс с лёгким перелётом, текст из размытия; стекло #303030, ширина 251, шаг строк 42.5, значок слева, разделитель перед
   последней группой, без заголовка. Закрытие — капля сжимается обратно в кнопку ≈200 мс (ChatGPT ⓘ: 170 мс).
   ChatGPT «•••»/«+» (g3_chat): открытие уже по видео ChatGPT (400 мс, перелёт ~3 %), здесь — только закрытие в кнопку.
   Пункты меню не меняются: Claude — Переслать, Переименовать, Открыть на ПК, Другие действия (там права, ветка, удаление);
   ChatGPT — Закрепить, Переименовать, Переслать, Другие действия, В архив, Удалить. */
(function(){
 var D=document,B=D.body,W=window;
 function $i(id){return D.getElementById(id)}
 function RM(){return matchMedia('(prefers-reduced-motion: reduce)').matches}
 /* недодемпфированная пружина SwiftUI → linear(): response r (с), damping z, длительность d (мс) */
 function spr(r,z,d){var w=2*Math.PI/r,o=[],n=24;for(var i=0;i<=n;i++){var t=d/1000*i/n,v;
   if(z<1){var wd=w*Math.sqrt(1-z*z);v=1-Math.exp(-z*w*t)*(Math.cos(wd*t)+z*w/wd*Math.sin(wd*t))}else v=1-(1+w*t)*Math.exp(-w*t);o.push(v)}
  var l=o[n];return 'linear('+o.map(function(v){return (v/l).toFixed(3)}).join(',')+')'}
 /* Claude «•••»: ≈230 мс до чёткого текста, перелёт ≈2 % (recents_menu_open: верх 57.2 → 59.2) */
 var CLM='linear(0,.121,.270,.435,.594,.734,.849,.936,.997,1.037,1.058,1.067,1.066,1.060,1.050,1.040,1.030,1.021,1.014,1.008,1.004,1.002,1,1,1)';var CLMD=240;
 function morphIn(p,src,origin){if(!p.animate||RM())return;p.getAnimations().forEach(function(a){a.cancel()});
  var r=p.getBoundingClientRect(),sx=Math.min(1,src.width/r.width),sy=Math.min(1,src.height/r.height);
  p.animate([{transform:'scale('+sx.toFixed(3)+','+sy.toFixed(3)+')',opacity:.5,borderRadius:'22px'},{transform:'none',opacity:1}],{duration:CLMD,easing:CLM});
  for(var i=0;i<p.children.length;i++)p.children[i].animate([{filter:'blur(5px)',opacity:0},{filter:'blur(0)',opacity:1}],{duration:200,delay:30,easing:'ease-out',fill:'backwards'})}
 /* закрытие: капля в кнопку-источник; база снимает меню через 180 мс (closePop: класс out + remove) */
 function morphOut(p){var src=p.__g6src;if(!src||!p.animate||RM())return;var r=p.getBoundingClientRect();if(!r.width)return;
  p.style.transition='none';p.getAnimations().forEach(function(a){a.cancel()});var sx=Math.min(1,src.w/r.width),sy=Math.min(1,src.h/r.height);
  p.animate([{transform:'none',opacity:1},{transform:'scale('+sx.toFixed(3)+','+sy.toFixed(3)+')',opacity:0}],{duration:p.__g6ms||170,easing:'cubic-bezier(.4,0,.6,1)',fill:'forwards'});
  for(var i=0;i<p.children.length;i++)p.children[i].animate([{filter:'blur(0)',opacity:1},{filter:'blur(4px)',opacity:0}],{duration:110,easing:'ease-in',fill:'forwards'})}
 function rectOf(el){var r=el.getBoundingClientRect();return {x:r.left,y:r.top,w:r.width,h:r.height,el:el}}
 /* следим за закрытием меню g3/Claude: класс out → капля обратно + вернуть кнопку */
 var MO=new MutationObserver(function(L){L.forEach(function(m){var p=m.target;if(!p.classList||!p.classList.contains('out')||p.__g6out)return;
  if(!(p.classList.contains('clpop')||p.classList.contains('g3pop')))return;p.__g6out=1;morphOut(p);if(p.__g6cap){var c=p.__g6cap;setTimeout(function(){c.classList.remove('g6hid')},120)}})});
 MO.observe(B,{attributes:true,attributeFilter:['class'],subtree:true});
 function clHead(){var orig=W.CL3.headMenu0;orig();var p=$i('clpop');if(!p)return;
  var hd=$i('clhd'),em=hd&&hd.classList.contains('clempty'),cap=D.querySelector(em?'#clhd .clone':'#clhd .clpill');if(!cap)return;
  p.classList.add('g6clm');var h=p.querySelector('.clmh');if(h)h.remove();
  /* группы как у Claude (Share/Rename/Archive | Send feedback): разделитель перед «Открыть на ПК» */
  var pc=p.querySelector('[data-hc=openpc]');if(pc&&pc.previousElementSibling){var s=D.createElement('div');s.className='g6sep';p.insertBefore(s,pc)}
  var r=cap.getBoundingClientRect();p.style.top=(r.top)+'px';p.style.right=Math.max(8,innerWidth-r.right)+'px';p.style.width='251px';p.style.transformOrigin='top right';
  p.__g6src={w:r.width,h:r.height};p.__g6ms=200;p.__g6cap=cap;cap.classList.add('g6hid');morphIn(p,r,'top right')}
 function g3Src(name){var f=W.G3[name+'0'];return function(){f.apply(this,arguments);var p=$i('g3pop');if(!p)return;
  var el=name=='headMenu'?D.querySelector('#g3hd .g3cap'):D.querySelector('#g3c .g3plus');if(!el)return;var r=el.getBoundingClientRect();p.__g6src={w:r.width,h:r.height};p.__g6ms=170}}
 function hook(){var n=0;
  if(W.CL3&&!CL3.__g6h){CL3.__g6h=1;CL3.headMenu0=CL3.headMenu;CL3.headMenu=clHead;n++}
  if(W.G3&&!G3.__g6h){G3.__g6h=1;['headMenu','plusMenu'].forEach(function(k){G3[k+'0']=G3[k];G3[k]=g3Src(k)});n++}return n}
 hook();var ht=setInterval(function(){if(W.CL3&&CL3.__g6h&&W.G3&&G3.__g6h)clearInterval(ht);else hook()},300);
 /* лист «Другие действия» в чате (настройки чата: права, на ПК, имя, ветка, удаление) — облик настроек приложения (B2 §2/§4):
    карточки-группы, строки 52 pt (Claude) / 54 pt (ChatGPT), подписи сноской. Класс только пока на листе это меню. */
 function sheetMark(){var s=$i('sheet');if(!s)return;var b=B.classList.contains('cl3on')?'cl':B.classList.contains('g3on')?'gp':'';
  var is=!!(b&&s.querySelector('[data-hc=fork],[data-hc=openpc],[data-hc=perm],[data-hc=pinmenu]')&&s.querySelector('.hcsh'));
  var want=is?(b=='cl'?'g6set g6setc':'g6set'):'';['g6set','g6setc'].forEach(function(c){var on=want.indexOf(c)>=0;if(s.classList.contains(c)!=on)s.classList.toggle(c,on)})}
 var SMO=new MutationObserver(sheetMark);setInterval(function(){var s=$i('sheet');if(s&&!s.__g6s){s.__g6s=1;SMO.observe(s,{childList:true,subtree:false});sheetMark()}},300);
 W.G6MENU={spr:spr,clHead:function(){W.CL3.headMenu()},morphOut:morphOut,sheetMark:sheetMark};
})();
