/* s4-e: живой черновик диктовки (s4/ref/C-dictation-spec.md). Черновик по-прежнему приходит из voice.js (vcSet → #hcin.value);
   здесь — только показ: приращение черновика к прошлому показу = один «кусок» (span), старые куски не перерисовываются.
   ChatGPT (Codex, Hermes): кусок проявляется прозрачностью .4→1 за 215 мс линейно (по кадрам «сейчас»: первый кадр 43 %, +10 %/кадр) синим #2F5BEF и через 360 мс за 950 мс плавно
   уходит в серый #B4B4B4 (§2); синяя каретка 2 px в конце, без мигания; текст ВНУТРИ пилюли поля (отдельной карточки .g3tr над
   полем больше нет), пилюля растёт вверх плавно 233 мс (кривая прямо по кадрам видео) (+24.2 pt на строку, низ с кнопками неподвижен).
   Claude: в его блоке #cltr кусок проявляется 0→1 за 280 мс без смены цвета (на видео Claude нет — предложение спеки §5).
   Переписанный распознаванием хвост: изменённые куски убираются без анимации, новый хвост — новый кусок (§4). Курсив vclive убран.
   Отправка/отмена/таймер/«Распознаю…» не трогаются: обёртка только читает #hcin.value после vcSet. */
(function(){
 var D=document,B=D.body,W=window;
 function $i(id){return D.getElementById(id)}
 function st(){return W.HC&&HC.st}
 function rec(){return !!(W.VC&&(VC.rec||VC.busy))}
 function RM(){return matchMedia('(prefers-reduced-motion: reduce)').matches}
 var LIFE={g:1400,c:320};
 /* рост пилюли на строку — прямо по кадрам видео C (верх поля 631→595 px, 6.77–7.0 с): медленный первый кадр, затем ease-out */
 var GROW='linear(0,.08 14.3%,.47 28.6%,.69 42.9%,.83 57.1%,.92 71.4%,.97 85.7%,1)';
 var Z={gen:-1,prev:'',ch:[]};
 function kind(){return B.classList.contains('cl3on')?'c':B.classList.contains('g3on')?'g':''}
 function reset(){Z.gen=W.VC?VC.gen:-1;Z.prev=(W.VC&&VC.base)||'';Z.ch=[]}
 function model(T){var now=performance.now();if(!W.VC||Z.gen!==VC.gen)reset();var P=Z.prev,n=Math.min(P.length,T.length),p=0;while(p<n&&P.charCodeAt(p)===T.charCodeAt(p))p++;
  if(p<P.length){/* распознавание переписало хвост: откат к началу слова */var b=Math.max(T.lastIndexOf(' ',p-1),T.lastIndexOf('\n',p-1))+1;p=Math.min(p,b);
   Z.ch=Z.ch.filter(function(c){return c.s<p});Z.ch.forEach(function(c){if(c.e>p)c.e=p})}
  if(T.length>p)Z.ch.push({s:p,e:T.length,t:now});
  var k=kind(),life=k=='c'?LIFE.c:LIFE.g;Z.ch=Z.ch.filter(function(c){return c.e>c.s&&now-c.t<life+200});Z.prev=T}
 function paint(el,T,k){var now=performance.now(),f=D.createDocumentFragment(),i=0;
  Z.ch.slice().sort(function(a,b){return a.s-b.s}).forEach(function(c){if(c.s<i)return;if(c.s>i)f.appendChild(D.createTextNode(T.slice(i,c.s)));
   var s=D.createElement('span');s.className=k=='c'?'g6kc':'g6k';s.textContent=T.slice(c.s,c.e);s.style.animationDelay=k=='c'?(-(now-c.t))+'ms':(-(now-c.t))+'ms,'+(360-(now-c.t))+'ms';f.appendChild(s);i=c.e});
  if(i<T.length)f.appendChild(D.createTextNode(T.slice(i)));
  if(k=='g'){var car=D.createElement('i');car.className='g6car';f.appendChild(car)}
  el.textContent='';el.appendChild(f)}
 function gEl(){var c=$i('g3c');if(!c)return null;var z=$i('g6dz');if(z&&z.parentNode===c)return z;if(z)z.remove();
  z=D.createElement('div');z.id='g6dz';z.className='g6dz';z.setAttribute('data-g3','trtap');var row=c.querySelector('.g3row');c.insertBefore(z,row||c.firstChild);return z}
 function upd(){var k=kind(),ta=$i('hcin');if(!k||!ta)return;var r=rec();if(!r){if(Z.ch.length||Z.gen!==-1)reset();Z.gen=-1;var z0=$i('g6dz');if(z0&&z0.classList.contains('on')){z0.classList.remove('on');z0.textContent=''}return}
  var T=ta.value;model(T);
  if(k=='g'){var c=$i('g3c'),z=gEl();if(!c||!z)return;var show=!!(T.trim()&&W.G3&&G3.G.show!==false),h0=c.offsetHeight;
   z.classList.toggle('on',show);if(show)paint(z,T,'g');else z.textContent='';z.scrollTop=z.scrollHeight;
   var h1=c.offsetHeight;if(Math.abs(h1-h0)>2&&c.animate&&!RM())c.animate([{height:h0+'px'},{height:h1+'px'}],{duration:233,easing:GROW})}
  else{var t=$i('cltr');if(!t||!T.trim())return;var c2=$i('clc'),h2=c2?c2.offsetHeight:0;paint(t,T,'c');t.scrollTop=t.scrollHeight;
   var h3=c2?c2.offsetHeight:0;if(c2&&Math.abs(h3-h2)>2&&c2.animate&&!RM())c2.animate([{height:h2+'px'},{height:h3+'px'}],{duration:233,easing:GROW})}}
 function wrap(){if(typeof W.vcSet!='function'||W.vcSet.__g6)return false;var f=W.vcSet;W.vcSet=function(){var r=f.apply(this,arguments);try{upd()}catch(e){console.error(e)}return r};W.vcSet.__g6=1;return true}
 /* модули g3 оборачивают vcSet при загрузке — g6 подключён после них и будет внешней обёрткой */
 wrap();var t0=setInterval(function(){if(wrap())clearInterval(t0)},300);
 /* старт/стоп записи без нового черновика (смена экрана, отмена) — сбросить показ */
 setInterval(function(){if(!rec()&&Z.gen!==-1)upd();var z=$i('g6dz');if(z&&z.classList.contains('on')&&W.G3&&G3.G.show===false){z.classList.remove('on');z.textContent=''}},250);
 /* vb7a П9: экран чата пересоздан во время записи (новый чат создан, перерисовка) — живой текст не пропадает до следующего черновика */
 setInterval(function(){if(!rec())return;var k=kind(),ta=$i('hcin');if(!k||!ta||!ta.value.trim())return;
  var z=k=='g'?$i('g6dz'):$i('cltr'),gone=k=='g'?(!z||!z.classList.contains('on'))&&!(W.G3&&G3.G.show===false):(!!z&&!z.textContent.trim());if(!gone)return;
  try{if(W.VC&&Z.dh!==VC.rid){Z.dh=VC.rid;W.cbDiag&&cbDiag('dict_hide',{why:z?'off':'nodz',k:k,len:ta.value.length})}}catch(e){}upd()},120);
 W.G6D={upd:upd,Z:Z,reset:reset};
})();
