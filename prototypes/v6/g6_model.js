/* s4-e (chat-bugs-s4, область E): выбор модели 1:1 с родными приложениями.
   Claude — лист «Выбор модели» как «Select model» Claude iOS (видео Б 08-25-22, s4/ref/B1-claude-spec.md §4):
   плавающая карточка (поля 8, верх половины 405.4 pt из 852), ✕ Ø44, заголовок по центру, карточка моделей с подписями
   (строки 71.5, синяя ✓ #5F92D7), pill «Сила работы [Рекомендуется] Авто ›» → push-страница уровней (строки 51.3, сноска).
   Протяжка вверх = полный экран (58.6 pt), вниз = половина/закрыть. Анимации по csv B1/motion: открытие — критическая
   пружина response 0.341 (RMS 0.0006 доли пути), push — 0.291, pop кнопкой — уход 110 мс + нижняя с перелётом +10 pt, ✕ — 130 мс вниз.
   Codex/Hermes (облик ChatGPT) — стеклянное меню модели (ПО КОДУ Codex Desktop composer.modelPicker: «Select model»,
   «Default — Recommended set of models», «Older models», «Select effort» — на видео iPhone выбора модели у ChatGPT/Codex НЕТ):
   модели с ✓ слева, «Другие модели…» (лист базы с поиском и провайдерами), строка «Сила рассуждений ›» раскрывает уровни в том же меню.
   Списки — те же, что раньше: Claude /api/hc/cc/models (p[0].m), Codex /api/hc/cx/models, Hermes /api/hc/models (провайдер выбора, первые 8 + все);
   сила — '' (Авто) / low / medium / high. Действия — прежние [data-hc] базы: mpick, mdef, epick, model. */
(function(){
 var D=document,B=D.body,W=window;
 function $i(id){return D.getElementById(id)}
 function st(){return W.HC&&HC.st}
 function E(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
 function RM(){return matchMedia('(prefers-reduced-motion: reduce)').matches}
 /* s5-1: уровни — из списка самой программы (Claude Code: low…xhigh/max, Codex: …max/ultra), имена/подписи моделей — из M.x */
 var EFF={'':'Авто',low:'Низкая',medium:'Средняя',high:'Высокая',xhigh:'Очень высокая',max:'Максимальная',ultra:'Ультра'},EK=['','low','medium','high'];
 var DSC={'For your toughest challenges':'Для самых сложных задач','For complex work and everyday tasks':'Для сложной и повседневной работы',
  'Most efficient for simpler tasks':'Эффективнее для простых задач','Fastest for quick answers':'Самая быстрая для коротких ответов'};
 function X(){var M=st().models;return M&&M.x||null}
 function all(){var x=X();return x?(x.main||[]).concat(x.more||[]):[]}
 function rowOf(id){return all().filter(function(r){return r.id==id})[0]||null}
 function effs(){var c=cur(),x=X(),r=c.m?rowOf(c.m):null;if(!r&&x){r=x.def&&x.def.e&&x.def.e.length?x.def:null;
   if(!r&&st().models&&st().models.cur)r=rowOf(st().models.cur.model);if(!r)r=(x.main||[])[0]}
  var e=(r&&r.e&&r.e.length?r.e:EK.slice(1)).filter(function(k){return EFF[k]});return [''].concat(e)}
 function dsc(r){return r?(DSC[r.d]||(st().kind=='claude'?sub(r.id+' '+r.n):'')||''):''}
 /* кривые из csv видео (s4/e/fit.py): критическая пружина, нормированная к 1 в конце */
 var OPEN='linear(0,.042,.137,.253,.370,.480,.577,.661,.731,.788,.835,.872,.901,.925,.943,.957,.968,.977,.983,.988,.992,.995,.997,.999,1)';
 var PUSH='linear(0,.051,.163,.294,.423,.538,.637,.718,.784,.835,.876,.907,.931,.949,.963,.973,.980,.986,.990,.993,.996,.997,.998,.999,1)';
 /* pop кнопкой ‹ (16.40–16.73): нижняя страница −101 → +10.2 → 0 */
 var POPU='linear(0,.287 10%,.845 20%,1.054 30%,1.101 40%,1.095 50%,1.06 60%,1.034 70%,1.02 80%,1.007 90%,1)';
 /* half ↔ full: протяжка с перелётом ≈4.7 pt (9.2–9.7 с) */
 var DET='linear(0,.18 8%,.45 17%,.7 26%,.86 35%,.95 44%,1.012 52%,1.022 58%,1.016 68%,1.006 80%,1)';
 var CK='<svg class="g6ck" width="16" height="15" viewBox="0 0 16 15" aria-hidden="true"><path d="M1.6 8.1 5.9 12.6 14.4 1.9" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/></svg>';
 var CH='<svg class="g6ch" width="8" height="13" viewBox="0 0 8 13" aria-hidden="true"><path d="M1.5 1.4 6.4 6.5 1.5 11.6" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>';
 var XI='<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 2 14 14M14 2 2 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
 var BK='<svg width="11" height="18" viewBox="0 0 11 18" aria-hidden="true"><path d="M9 1.6 1.9 9 9 16.4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
 var WARN='<svg width="13" height="12" viewBox="0 0 13 12" aria-hidden="true"><path d="M6.5 1 12 11H1Z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M6.5 4.6v3M6.5 9.2v.1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';
 function cur(){var s=st();return {m:(s.msel&&s.msel.m)||'',p:(s.msel&&s.msel.p)||'',e:(s.msel&&s.msel.e)||''}}
 function load(cb){var s=st();if(s.models){cb();return}var bs=s.kind=='codex'?'/cx':s.kind=='claude'?'/cc':'';
  fetch(API.replace(/\/$/,'')+'/api/hc'+bs+'/models',{headers:{'X-Init-Data':W.tg?tg.initData:''}}).then(function(r){return r.json()}).then(function(d){if(d&&d.p){s.models=s.models||d;cb()}}).catch(function(){})}
 /* подписи моделей — перевод подписей «Select model» Claude iOS по семейству */
 function sub(m){m=String(m).toLowerCase();return /fable/.test(m)?'Для самых сложных задач':/opus/.test(m)?'Для сложной и повседневной работы':/sonnet/.test(m)?'Эффективнее для простых задач':/haiku/.test(m)?'Самая быстрая для коротких ответов':''}
 function nm(m){var r=rowOf(m);return r?r.n:HC.pretty(m).replace(/^Claude\s+/i,'')}

 /* =================== Claude: лист «Выбор модели» =================== */
 var SH={el:null,full:false,stack:[],focus:false};
 function mRow(m,sb,c){return '<div class="g6r2" data-hc="mpick" data-m="'+E(m)+'" data-p="claude"><div><b>'+E(nm(m))+'</b>'+(sb?'<span>'+E(sb)+'</span>':'')+'</div>'+(c.m==m?CK:'')+'</div>'}
 function clMain(){var s=st(),M=s.models,c=cur(),x='<div class="g6pt">Выбор модели</div>';
  if(!M){x+='<div class="g6ld">Загружаю…</div>';return x}
  var X1=X(),pv=M.p[0],dn=X1&&X1.def&&X1.def.n;
  x+='<div class="g6card g6mods"><div class="g6r2" data-hc="mdef"><div><b>По умолчанию</b><span>'+(dn?E(dn)+' · как в Claude на ПК':'Как в Claude на ПК')+'</span></div>'+(c.m?'':CK)+'</div>';
  if(X1){x+=(X1.main||[]).map(function(r){return mRow(r.id,dsc(r),c)}).join('');
   /* выбранная «другая» модель видна в основном списке с ✓ (как в Claude iOS выбор живёт в основном списке) */
   if(c.m&&!(X1.main||[]).some(function(r){return r.id==c.m}))x+=mRow(c.m,'Другая модель',c)}
  else x+=(pv?pv.m:[]).map(function(m){return mRow(m,sub(m),c)}).join('');
  x+='</div><div class="g6card g6pill" data-g6="eff"><b>Сила работы</b>'+(c.e==''?'<i class="g6bd">Рекомендуется</i>':'')+'<em>'+E(EFF[c.e]||c.e)+'</em>'+CH+'</div>';
  if(X1&&(X1.more||[]).length)x+='<div class="g6card g6pill" data-g6="more"><b>Другие модели</b><em></em>'+CH+'</div>';
  return x}
 function clMore(){var c=cur(),X1=X()||{};return '<div class="g6pt">Другие модели</div><div class="g6card g6effs g6more">'+(X1.more||[]).map(function(r){
   return '<div class="g6r1" data-hc="mpick" data-m="'+E(r.id)+'" data-p="claude"><b>'+E(r.n)+'</b>'+(c.m==r.id?CK:'')+'</div>'}).join('')+'</div>'+
  '<div class="g6ft">Старые модели Claude Code на этом ПК. Новые — в основном списке.</div>'}
 function clEff(){var c=cur();return '<div class="g6pt">Сила работы</div><div class="g6card g6effs">'+effs().map(function(k){return '<div class="g6r1" data-hc="epick" data-e="'+k+'"><b>'+EFF[k]+'</b>'+(k==''?'<i class="g6bd">Рекомендуется</i>':'')+(k=='max'?'<i class="g6bd g6warn">'+WARN+' в 4+ раза больше лимитов</i>':'')+(c.e==k?CK:'')+'</div>'}).join('')+
  '</div><div class="g6ft">Чем выше сила, тем тщательнее ответ, но он дольше и быстрее тратит лимиты. «Авто» — как в Claude на ПК.</div>'}
 function half(){return Math.round(innerHeight*405.4/852)}
 function geo(full){var sh=SH.el;if(!sh)return;sh.classList.toggle('g6full',!!full);sh.style.top=(full?Math.round(innerHeight*58.6/852):half())+'px'}
 function btn(){var b=SH.el&&SH.el.querySelector('.g6x');if(!b)return;var back=SH.stack.length>1;if(b.dataset.k==(back?'b':'x'))return;b.dataset.k=back?'b':'x';
  b.setAttribute('aria-label',back?'Назад':'Закрыть');b.innerHTML=back?BK:XI;if(b.animate&&!RM())b.animate([{opacity:0},{opacity:1}],{duration:100})}
 function page(html,cls){var p=D.createElement('div');p.className='g6pg '+(cls||'');p.innerHTML=html;return p}
 function clOpen(at){if(st().kind!='claude')return;clClose(true);var ta=$i('hcin');SH.focus=!!(ta&&D.activeElement===ta);if(SH.focus)ta.blur();
  var v=D.createElement('div');v.id='g6sv';B.appendChild(v);
  var sh=D.createElement('div');sh.id='g6sh';sh.className='g6sh';sh.innerHTML='<div class="g6grab"></div><div class="g6x" data-g6="x" role="button"></div><div class="g6pgs"></div>';
  B.appendChild(sh);SH.el=sh;SH.full=false;SH.stack=[];geo(false);
  var p=page(clMain(),'g6main');sh.querySelector('.g6pgs').appendChild(p);SH.stack.push(p);
  if(at=='eff'){var q=page(clEff(),'g6effp');sh.querySelector('.g6pgs').appendChild(q);SH.stack.push(q);p.style.transform='translateX(-101px)';p.style.visibility='hidden'}
  btn();
  if(!st().models)load(function(){if(SH.el===sh){var m=sh.querySelector('.g6main');if(m)m.innerHTML=clMain()}});
  if(!RM()){var dy=innerHeight-sh.getBoundingClientRect().top;sh.animate([{transform:'translateY('+dy+'px)'},{transform:'none'}],{duration:440,easing:OPEN});
   v.animate([{opacity:0},{opacity:1}],{duration:170,easing:'linear'})}
  drag(sh)}
 function clClose(now,refocus){var sh=SH.el,v=$i('g6sv');SH.el=null;SH.stack=[];if(v){if(now||RM())v.remove();else{var a=v.animate([{opacity:1},{opacity:0}],{duration:150,fill:'forwards'});a.onfinish=function(){v.remove()}}}
  if(!sh)return;sh.id='';if(now||RM()){sh.remove()}else{
   /* ✕ (23.93–24.07): 405 → 414 → 437 → исчез, ≈130 мс с разгоном */
   var a2=sh.animate([{transform:'none',opacity:1},{transform:'translateY(8px)',opacity:1,offset:.25},{transform:'translateY(32px)',opacity:.9,offset:.5},{transform:'translateY(140px)',opacity:0}],{duration:130,easing:'linear',fill:'forwards'});a2.onfinish=function(){sh.remove()}}
  if(refocus!==false&&SH.focus){var ta=$i('hcin');if(ta)ta.focus()}SH.focus=false}
 function push(html,cls){var sh=SH.el;if(!sh)return;var box=sh.querySelector('.g6pgs'),old=SH.stack[SH.stack.length-1],p=page(html,cls);box.appendChild(p);SH.stack.push(p);btn();
  if(RM()){old.style.visibility='hidden';return}var w=box.clientWidth;
  p.animate([{transform:'translateX('+w+'px)'},{transform:'none'}],{duration:400,easing:PUSH});
  var a=old.animate([{transform:'none'},{transform:'translateX(-101px)'}],{duration:400,easing:PUSH,fill:'forwards'});a.onfinish=function(){old.style.transform='translateX(-101px)';old.style.visibility='hidden';try{a.cancel()}catch(e){}}}
 function pop(fromX){var sh=SH.el;if(!sh||SH.stack.length<2)return;var top=SH.stack.pop(),und=SH.stack[SH.stack.length-1],w=sh.querySelector('.g6pgs').clientWidth;btn();
  und.style.visibility='';und.style.transform='';var m=und.classList.contains('g6main')?und:null;if(m)m.innerHTML=clMain();
  if(RM()){top.remove();return}var x0=fromX||0,k=1-x0/w;
  var a=top.animate([{transform:'translateX('+x0+'px)'},{transform:'translateX('+w+'px)'}],{duration:Math.max(60,110*k),easing:'cubic-bezier(.4,0,1,1)',fill:'forwards'});a.onfinish=function(){top.remove()};
  und.animate([{transform:'translateX('+(-101*k)+'px)'},{transform:'none'}],{duration:333,easing:POPU})}
 /* протяжка листа (половина ↔ полный, вниз = закрыть) и свайп от левого края = назад */
 function drag(sh){var g=null;
  sh.addEventListener('pointerdown',function(e){if(e.button>0)return;var r=sh.getBoundingClientRect(),y=e.clientY-r.top,x=e.clientX-r.left;
   var edge=SH.stack.length>1&&x<24,hdr=y<70&&!e.target.closest('[data-g6=x]');if(!edge&&!hdr)return;
   g={edge:edge,x0:e.clientX,y0:e.clientY,t0:performance.now(),top:r.top,id:e.pointerId,mv:false};try{sh.setPointerCapture(e.pointerId)}catch(x2){}});
  sh.addEventListener('pointermove',function(e){if(!g||e.pointerId!==g.id)return;var dx=e.clientX-g.x0,dy=e.clientY-g.y0;if(!g.mv&&Math.hypot(dx,dy)<6)return;g.mv=true;
   if(g.edge){var t=SH.stack[SH.stack.length-1],u=SH.stack[SH.stack.length-2],w=sh.clientWidth,x=Math.max(0,Math.min(w,dx));u.style.visibility='';u.style.transform='translateX('+(-101+101*x/w)+'px)';t.style.transform='translateX('+x+'px)';g.x=x}
   else{var y=g.top+dy,lo=Math.round(innerHeight*58.6/852);if(y<lo)y=lo-Math.pow(lo-y,.7);sh.style.transition='none';sh.style.top=y+'px';g.dy=dy}});
  function end(e){if(!g||e.pointerId!==g.id)return;var G=g;g=null;if(!G.mv)return;var dt=Math.max(16,performance.now()-G.t0);
   if(G.edge){var w=sh.clientWidth,v=(G.x||0)/dt;if((G.x||0)>w/3||v>.5){SH.stack[SH.stack.length-1].style.transform='';pop(G.x||0)}
    else{var t=SH.stack[SH.stack.length-1],u=SH.stack[SH.stack.length-2];t.animate([{transform:t.style.transform},{transform:'none'}],{duration:250,easing:PUSH});t.style.transform='';u.style.transform='translateX(-101px)';u.style.visibility='hidden'}return}
   var dy=G.dy||0,vv=dy/dt,to;if(dy<-40||vv<-.4)to='full';else if(dy>90||vv>.5)to=SH.full&&dy<260?'half':'close';else to=SH.full?'full':'half';
   if(to=='close'){sh.style.transition='';var y0=parseFloat(sh.style.top);sh.animate([{transform:'none'},{transform:'translateY('+(innerHeight-y0)+'px)'}],{duration:260,easing:'cubic-bezier(.4,0,1,1)',fill:'forwards'});clClose(false);return}
   SH.full=to=='full';var y1=parseFloat(sh.style.top);geo(SH.full);var y2=parseFloat(sh.style.top);sh.style.transition='none';
   if(!RM())sh.animate([{transform:'translateY('+(y1-y2)+'px)'},{transform:'none'}],{duration:500,easing:DET});sh.style.transition=''}
  sh.addEventListener('pointerup',end);sh.addEventListener('pointercancel',end)}
 /* клики листа: data-hc отрабатывает база (выбор модели / силы), лист сам закрывается / возвращается */
 D.addEventListener('click',function(e){var sh=SH.el;if(!sh)return;
  if(e.target.id=='g6sv'){e.stopPropagation();e.preventDefault();clClose(false);return}
  if(!sh.contains(e.target))return;var a=e.target.closest('[data-g6]'),h=e.target.closest('[data-hc]');
  if(a){e.stopPropagation();e.preventDefault();var g=a.dataset.g6;if(g=='x'){if(SH.stack.length>1)pop();else clClose(false)}else if(g=='eff')push(clEff(),'g6effp');else if(g=='more')push(clMore(),'g6morep');return}
  if(h){var k=h.dataset.hc;setTimeout(function(){if(SH.el!==sh)return;
   if(k=='epick'){var p=SH.stack[SH.stack.length-1];if(p&&p.classList.contains('g6effp')){p.innerHTML=clEff();setTimeout(function(){if(SH.el===sh)pop()},160)}}
   else if(k=='mpick'||k=='mdef'){var m=sh.querySelector('.g6main');if(m)m.innerHTML=clMain();setTimeout(function(){if(SH.el===sh)clClose(false)},180)}},0)}},false);

 /* =================== Codex / Hermes: стеклянное меню модели (облик ChatGPT) =================== */
 var MM={lvl:'m'};
 function gIc(n){return W.G3&&G3.ic?G3.ic(n):''}
 function mmHtml(){var s=st(),M=s.models,c=cur(),x='';
  if(MM.lvl=='e'){x='<div class="g3mi g6back" data-g6m="back">'+BK+'<span>Модель</span></div><div class="g3mh">Сила рассуждений</div>'+
    effs().map(function(k){return '<div class="g3mi" data-hc="epick" data-e="'+k+'">'+(c.e==k?gIc('check'):'<i class="g3ck"></i>')+'<span>'+EFF[k]+'</span>'+(k==''?'<em class="g6rec">как на ПК</em>':'')+'</div>'}).join('');return x}
  x='<div class="g3mh">Модель</div>';
  if(!M)return x+'<div class="g3mh">Загружаю…</div>';
  var pv=M.p.filter(function(p){return p.slug==(c.p||M.cur.provider)})[0]||M.p[0];
  x+='<div class="g3mi g6two" data-hc="mdef">'+(c.m?'<i class="g3ck"></i>':gIc('check'))+'<span><b>По умолчанию</b><small>'+E(nm(M.cur.model))+' · как на ПК</small></span></div>';
  (pv?pv.m:[]).slice(0,8).forEach(function(m){x+='<div class="g3mi" data-hc="mpick" data-m="'+E(m)+'" data-p="'+E(pv.slug)+'">'+(c.m==m?gIc('check'):'<i class="g3ck"></i>')+'<span>'+E(nm(m))+'</span></div>'});
  x+='<div class="g3mi" data-hc="model"><i class="g3ck"></i><span>Другие модели…</span></div><div class="g6sep"></div>'+
   '<div class="g3mi g6effr" data-g6m="eff">'+gIc('bulb')+'<span>Рассуждения</span><em>'+E(EFF[c.e])+'</em>'+CH+'</div>';
  return x}
 /* id как у меню g3 (#g3pop/#g3veil): закрытие, тап мимо и выбор [data-hc] обрабатывает сам g3_chat (closePop) */
 function mmEl(){var p=$i('g3pop');return p&&p.classList.contains('g6mm')?p:null}
 function mmClose(){if(W.G3&&G3.closePop){G3.closePop();return}var p=$i('g3pop'),v=$i('g3veil');if(v)v.remove();if(p){p.id='';p.classList.add('out');setTimeout(function(){p.remove()},180)}}
 function mmOpen(lvl){var s=st();if(!s||(s.kind!='codex'&&s.kind!='hermes'))return;MM.lvl=lvl||'m';mmClose();if(W.G3)G3.closePop();
  var c=$i('g3c'),r=c?c.getBoundingClientRect():{left:34,top:innerHeight-90,width:325,height:48};
  var v=D.createElement('div');v.id='g3veil';B.appendChild(v);var p=D.createElement('div');p.id='g3pop';p.className='g3pop g3pm g6mm';p.innerHTML=mmHtml();
  p.style.left=Math.max(8,r.left-8)+'px';p.style.bottom=(innerHeight-r.top+12)+'px';p.style.width='281px';p.style.maxHeight=Math.max(160,r.top-12-(parseFloat(getComputedStyle(D.documentElement).getPropertyValue('--g3t'))||0)-8)+'px';p.style.transformOrigin='bottom left';
  B.appendChild(p);p.__g6src={x:r.left,y:r.top,w:44,h:44};
  if(p.animate&&!RM()){var sx=Math.min(1,44/p.offsetWidth),sy=Math.min(1,44/p.offsetHeight);
   p.animate([{transform:'scale('+sx.toFixed(3)+','+sy.toFixed(3)+')',opacity:.4},{transform:'none',opacity:1}],{duration:400,easing:'linear(0,.06,.198,.365,.53,.675,.793,.883,.947,.99,1.015,1.027,1.031,1.03,1.026,1.021,1.016,1.011,1.007,1.004,1.002,1)'});
   var inn=p.children;for(var i=0;i<inn.length;i++)inn[i].animate([{filter:'blur(4px)',opacity:0},{filter:'none',opacity:1}],{duration:220,delay:40,easing:'ease-out',fill:'backwards'})}
  if(!s.models)load(function(){if(mmEl()===p)p.innerHTML=mmHtml()});return p}
 function mmLevel(l){var p=mmEl();if(!p)return;MM.lvl=l;var h0=p.offsetHeight;p.innerHTML=mmHtml();var h1=p.offsetHeight;
  if(p.animate&&!RM()){p.animate([{height:h0+'px'},{height:h1+'px'}],{duration:330,easing:'linear(0,.2,.5,.75,.9,.98,1.02,1.025,1.015,1.005,1)'});
   var inn=p.children;for(var i=0;i<inn.length;i++)inn[i].animate([{opacity:0,transform:'translateX('+(l=='e'?18:-18)+'px)'},{opacity:1,transform:'none'}],{duration:220,easing:'ease-out'})}}
 D.addEventListener('click',function(e){var p=mmEl();if(!p||!p.contains(e.target))return;var a=e.target.closest('[data-g6m]');
  if(a){e.stopPropagation();e.preventDefault();mmLevel(a.dataset.g6m=='eff'?'e':'m')}},true);

 /* =================== подключение к экранам g3 (через экспорт, крючки p_g6_hooks.py) =================== */
 function hook(){var ok=0;
  if(W.CL3&&!CL3.__g6m){CL3.__g6m=1;CL3.chipMenu0=CL3.chipMenu;CL3.chipMenu=function(){clOpen('main')};CL3.effMenu=function(){clOpen('eff')};ok++}
  if(W.G3&&!G3.__g6m){G3.__g6m=1;G3.modelMenu0=G3.modelMenu;G3.modelMenu=function(){mmOpen('m')};G3.effortMenu=function(){mmOpen('e')};ok++}
  return ok}
 hook();var ht=setInterval(function(){if(W.CL3&&CL3.__g6m&&W.G3&&G3.__g6m)clearInterval(ht);else hook()},300);
 /* уход из чата / смена экрана — лист и меню не должны висеть */
 setInterval(function(){var s=st();if(SH.el&&!(s&&s.view=='chat'&&s.kind=='claude'&&W.U&&U.tab=='hc'))clClose(true,false);if(mmEl()&&!(s&&s.view=='chat'&&W.U&&U.tab=='hc'))mmClose()},500);
 W.G6M={open:clOpen,close:clClose,push:push,pop:pop,full:function(f){SH.full=f!==false;geo(SH.full)},sh:SH,mm:mmOpen,mmClose:mmClose,mmLevel:mmLevel,curves:{OPEN:OPEN,PUSH:PUSH,POPU:POPU,DET:DET},effs:effs,name:nm};
 /* =================== s5-1: список моделей принадлежит агенту ===================
    Ответ /models помечается агентом по адресу (/cc = claude, /cx = codex, иначе hermes); HC.st.models отдаёт и принимает
    список только своего агента. Причина: ответ, пришедший после смены агента, раньше ложился в чужой чат (s.models=s.models||d)
    — так в меню Codex мог оказаться список Claude. */
 function kindOf(u){u=String(u||'');var m=u.match(/\/api\/hc(\/cc|\/cx)?\/models(?:[?#]|$)/);return m?(m[1]=='/cc'?'claude':m[1]=='/cx'?'codex':'hermes'):''}
 if(!W.__s5f){W.__s5f=1;var f0=W.fetch;W.fetch=function(u,o){var k=kindOf(typeof u=='string'?u:u&&u.url),pr=f0.apply(this,arguments);if(!k)return pr;
  return pr.then(function(r){if(!r.ok)return r;return r.clone().json().then(function(d){if(d&&typeof d=='object'&&!Array.isArray(d))d.k=k;
   return new Response(JSON.stringify(d),{status:r.status,headers:{'Content-Type':'application/json'}})}).catch(function(){return r})})}}
 function guard(){var s=st();if(!s||s.__s5m)return !!s;s.__s5m=1;var m=s.models;
  Object.defineProperty(s,'models',{configurable:true,enumerable:true,get:function(){return m&&m.k&&m.k!=s.kind?null:m},
   set:function(v){if(v&&v.k&&v.k!=s.kind)return;m=v}});return true}
 if(!guard()){var gt=setInterval(function(){if(guard())clearInterval(gt)},200)}
 /* имена моделей как в родных приложениях (Fable 5.2, GPT-6.2-Sol) там, где база зовёт HC.pretty */
 var pr0=null;function hp(){if(!W.HC||!HC.pretty||HC.pretty.__s5)return;pr0=HC.pretty;HC.pretty=function(m){var r=st()&&st().models?rowOf(m):null;return r?r.n:pr0(m)};HC.pretty.__s5=1}
 hp();setInterval(hp,1000);
 /* чип Claude «Opus 5.5 Medium»: имя модели по умолчанию нужно сразу при входе в чат — список грузим заранее */
 setInterval(function(){var s=st();if(s&&s.view=='chat'&&s.kind=='claude'&&!s.models&&!load.__on){load.__on=1;load(function(){load.__on=0;if(W.CL3&&CL3.draw)CL3.draw()});setTimeout(function(){load.__on=0},8000)}},700);
})();
