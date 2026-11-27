/* vb8 А7 (жалоба 27.11: «при открытой клавиатуре тяну чат вверх — поле/экран прыгает вверх-вниз»). Три причины, все чинятся здесь
   и в pad() чатов (g3_chat.js / g3_claude.js):
   1) Страница Mini App на iOS — это UIScrollView: жест, который не забрал ни один прокручиваемый блок (лента у самого низа,
      шапка, поле), двигает ВСЮ страницу (с клавиатурой — на её высоту, без неё — резиновой оттяжкой), а S4VV тут же
      возвращает её scrollTo(0,0): экран дёргается вверх-вниз на каждом кадре жеста. Решение — как у нативного чата:
      если в начале вертикального жеста ни один блок под пальцем не может ехать в эту сторону, отменяем touchmove
      (страница не сдвигается). Только в чатах и когда открыта клавиатура; горизонтальные жесты (☰, код) не трогаем.
   2) Пока палец на ленте (и пока она докатывается по инерции), pad() не тянет её к низу: раньше любая перерисовка чата
      (а их было 60 в секунду из-за вечного цикла наблюдателей, см. g9_vb7d toastPos) возвращала ленту вниз под пальцем.
   3) Вечный цикл наблюдателей убран в g9_vb7d.js (toastPos) и g7_s5.js (ringTick). */
(function(){var W=window,D=document,R=D.documentElement;
 function chat(){var b=D.body;return !!b&&(b.classList.contains('g3on')||b.classList.contains('cl3on'))}
 function kb(){return R.classList.contains('vb7kb')||R.classList.contains('s4kbv')}
 var T={on:false,x:0,y:0,dec:0,feed:null,end:0,sc:0};
 function canY(n,d){var s=getComputedStyle(n);if(!/(auto|scroll)/.test(s.overflowY)||n.scrollHeight<=n.clientHeight+1)return false;return d>0?n.scrollTop>0:n.scrollTop+n.clientHeight<n.scrollHeight-1}
 /* d — сдвиг пальца: > 0 палец вниз (содержимое к началу) */
 function taker(t,d){for(var n=t;n&&n.nodeType==1&&n!==D.body&&n!==R;n=n.parentElement)if(canY(n,d))return n;return null}
 D.addEventListener('touchstart',function(e){var t=e.touches&&e.touches[0];if(!t||e.touches.length>1){T.on=false;return}
  T.on=true;T.x=t.clientX;T.y=t.clientY;T.dec=0;T.feed=e.target&&e.target.closest?e.target.closest('#g3f,#clf'):null},{capture:true,passive:true});
 D.addEventListener('touchmove',function(e){if(!T.on)return;var t=e.touches&&e.touches[0];if(!t)return;
  if(!T.dec){var dx=t.clientX-T.x,dy=t.clientY-T.y;if(Math.abs(dy)<1&&Math.abs(dx)<1)return;
   if(Math.abs(dx)>Math.abs(dy)){T.dec=1;return}
   T.dec=(chat()||kb())&&!taker(e.target,dy)?2:1}
  if(T.dec==2&&e.cancelable)e.preventDefault()},{capture:true,passive:false});
 function fin(){if(!T.on)return;T.on=false;T.end=Date.now()}
 D.addEventListener('touchend',fin,true);D.addEventListener('touchcancel',fin,true);
 D.addEventListener('scroll',function(e){var t=e.target;if(t&&(t.id=='g3f'||t.id=='clf'))T.sc=Date.now()},true);
 /* hold(): палец на ленте или лента ещё катится по инерции (scroll был < 250 мс назад, не дольше 3 с после отпускания) */
 W.VB8={hold:function(){if(!T.feed)return false;if(T.on)return true;var n=Date.now();return n-T.end<3000&&n-Math.max(T.end,T.sc)<250},_T:T};
})();
