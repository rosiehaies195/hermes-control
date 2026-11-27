/* s5-side v2 (этап 5, п.4б): side-чаты в облике самого приложения.
   Codex (облик ChatGPT): «⋯» → «Side-чаты ›» раскрывается прямо в меню, как «Add to project» у ChatGPT (кадр 3214_0276.21):
     «Новый side-чат» и side-чаты этого чата. Пустой side-чат — заставка как у временного чата ChatGPT (0032.53).
   Claude (облик Claude): «⋯» → «Side-чаты» → лист Claude как «Добавить в сессию» (3213_0013.21): группа «Новый side-чат»,
     группа side-чатов. Пустой side-чат — вместо приветствия «Side-чат» тем же шрифтом с засечками.
   Hermes (облик ChatGPT): «⋯» → «Спросить в сторону» — экран как временный чат ChatGPT: ответ по снимку разговора (prompt.btw),
     в историю не попадает. Вопросы/ответы на телефоне (10 на чат).
   Side-чаты не попадают в общие списки (S5D.hide), openChat их знает (S5D.extra). Чаты только для чтения (переписка
   субагента, side-чат из Codex Desktop) — без поля ввода, вместо него подпись мелким текстом приложения; «⋯» → «К основному чату». */
(function(){var W=window,D=document,B=D.body;
 var S={keep:{},list:{},q:{},TMP:null};W.S5D=S;
 function st(){return W.HC&&HC.st}
 function E(t){var d=D.createElement('div');d.textContent=t==null?'':t;return d.innerHTML}
 function T(m){try{toast(m)}catch(e){}}
 function $i(id){return D.getElementById(id)}
 function ago(ts){var d=Math.max(0,Date.now()/1000-ts);return d<60?'только что':d<3600?Math.round(d/60)+' мин назад':d<86400?Math.round(d/3600)+' ч назад':Math.round(d/86400)+' дн назад'}
 function md(t){try{return W.md?W.md(t):E(t)}catch(e){return E(t)}}
 function gi(n){try{return G3.ic(n)}catch(e){return ''}}
 function ci(n){try{return CL3.ic(n)}catch(e){return ''}}
 /* ---------- строки, которых нет в общих списках ---------- */
 S.hide=function(k,x){if(!x||!x.side)return false;(S.keep[k]=S.keep[k]||{})[x.id]=Object.assign({},(S.keep[k]||{})[x.id]||{},x);return true};
 S.extra=function(k,id){var x=(S.keep[k]||{})[id];return x?[x]:[]};
 function cur(){var s=st();if(!s||s.view!='chat'||!s.sid)return null;return (S.keep[s.kind]||{})[s.sid]||null}
 S.cur=cur;
 S.ro=function(){var c=cur();return !!(c&&(c.ro||c.dside))};
 S.openRO=function(k,id,m){(S.keep[k]=S.keep[k]||{})[id]=Object.assign({id:id,t:m.t,ts:Date.now()/1000|0,src:k=='hermes'?'subagent':k,rw:false,cc:k!='hermes',ro:true,side:m.parent,sub:m.sub},S.keep[k][id]||{},{ro:true,side:m.parent});SD3.openChat(k,id)};
 function parentOf(c){return c&&c.side}
 /* ---------- «⋯» шапки ---------- */
 function gItem(a,icn,t,ex){return '<div class="g3mi'+(ex||'')+'" data-s5d="'+a+'">'+gi(icn)+'<span>'+t+'</span></div>'}
 function cItem(a,icn,t){return '<div class="clmi" data-s5d="'+a+'">'+ci(icn)+'<span>'+t+'</span></div>'}
 function gAdd(){var p=$i('g3pop'),s=st();if(!p||!s||!p.classList.contains('g3pm')||p.querySelector('[data-s5d]'))return;
  var c=cur(),x='';
  if(c&&parentOf(c))x=gItem('parent','retry','К основному чату');
  else if(s.kind=='codex'&&s.sid)x=gItem('gside','ask','Side-чаты',' s5more')+'';
  else if(s.kind=='hermes'&&s.sid)x=gItem('ask','ask','Спросить в сторону');
  if(!x)return;var ref=p.querySelector('[data-hc=menu]'),t=D.createElement('div');t.innerHTML=x;var el=t.firstChild;
  if(el.classList.contains('s5more'))el.insertAdjacentHTML('beforeend',gi('chev'));
  if(ref)p.insertBefore(el,ref);else p.appendChild(el)}
 function cAdd(){var p=$i('clpop'),s=st();if(!p||!s||s.kind!='claude'||p.querySelector('[data-s5d]')||!p.querySelector('[data-hc=menu]'))return;
  var c=cur(),x=c&&parentOf(c)?cItem('parent','retry','К основному чату'):cItem('cside','ghost','Side-чаты');
  var ref=p.querySelector('[data-hc=menu]'),t=D.createElement('div');t.innerHTML=x;p.insertBefore(t.firstChild,ref)}
 function wrap(){if(W.G3&&G3.headMenu&&!G3.headMenu.__s5d){var o=G3.headMenu;G3.headMenu=function(){var r=o.apply(this,arguments);gAdd();setTimeout(gAdd,0);return r};G3.headMenu.__s5d=1}
  if(W.CL3&&CL3.headMenu&&!CL3.headMenu.__s5d){var o2=CL3.headMenu;CL3.headMenu=function(){var r=o2.apply(this,arguments);cAdd();setTimeout(cAdd,0);return r};CL3.headMenu.__s5d=1}}
 setInterval(wrap,500);wrap();
 function closeAll(){try{G3.closePop()}catch(e){}try{CL3.closePop()}catch(e){}}
 D.addEventListener('click',function(ev){var el=ev.target.closest&&ev.target.closest('[data-s5d]');if(!el)return;ev.stopPropagation();ev.preventDefault();var a=el.dataset.s5d,s=st();
  if(a=='gside'){gExpand(el);return}
  if(el.closest('.g3pop,.clpop'))closeAll();
  if(a=='new')newSide(el);
  else if(a=='open'){try{CL3.sheetClose()}catch(e){}SD3.openChat(s.kind,el.dataset.id)}
  else if(a=='parent'){var c=cur();if(c)SD3.openChat(s.kind,c.side)}
  else if(a=='cside')cSheet();
  else if(a=='ask')tmpOpen();
  else if(a=='tmpx')tmpClose();
  else if(a=='tmpgo')askSend()},true);
 /* ---------- Codex: подменю «Side-чаты» в «⋯» (как Add to project) ---------- */
 function fetchList(k,sid){return SD3.api('/side?k='+k+'&sid='+encodeURIComponent(sid)).then(function(d){var L=d.s||[];L.forEach(function(x){x.side=sid;x.cc=true;if(x.dside){x.rw=false;x.src=k}else{x.rw=true;x.src='панель'}(S.keep[k]=S.keep[k]||{})[x.id]=Object.assign({},S.keep[k][x.id]||{},x)});S.list[k+':'+sid]=L;return L})}
 function gSubRows(L){return gItem('new','pen','Новый side-чат',' s5sub')+(L==null?'<div class="g3mi s5sub s5dim"><span>Загружаю…</span></div>':L.map(function(x){return '<div class="g3mi s5sub" data-s5d="open" data-id="'+E(x.id)+'">'+gi('ask')+'<span>'+E(x.t)+'</span></div>'}).join(''))}
 function gExpand(el){var p=el.closest('.g3pop'),s=st(),key='codex:'+s.sid;if(!p)return;var openNow=!p.classList.contains('s5exp');
  p.querySelectorAll('.s5sub').forEach(function(e){e.remove()});p.classList.toggle('s5exp',openNow);el.classList.toggle('s5hl',openNow);
  if(!openNow)return;el.insertAdjacentHTML('afterend',gSubRows(S.list[key]));
  fetchList('codex',s.sid).then(function(L){if(!p.isConnected||!p.classList.contains('s5exp'))return;p.querySelectorAll('.s5sub').forEach(function(e){e.remove()});el.insertAdjacentHTML('afterend',gSubRows(L))}).catch(function(e){T('Не загрузил side-чаты: '+E(e.message))})}
 /* ---------- Claude: лист «Side-чаты» (как «Добавить в сессию») ---------- */
 function cRows(L){return '<div class="clgrp"><div class="clsr" data-s5d="new">'+ci('pen')+'<span>Новый side-чат</span></div></div>'+
   '<div class="s5cap">Отдельный разговор поверх этого чата: Claude видит всю историю, но основную задачу не продолжает и ничего не меняет без твоей просьбы. Основной чат не прерывается.</div>'+
   (L==null?'<div class="clgrp"><div class="clsr"><span>Загружаю…</span></div></div>':L.length?'<div class="clgrp">'+L.map(function(x){return '<div class="clsr" data-s5d="open" data-id="'+E(x.id)+'">'+ci('ghost')+'<span>'+E(x.t)+'</span><em>'+E(x.new?'новый':ago(x.ts))+'</em>'+ci('chev')+'</div>'}).join('')+'</div>':'')}
 function cSheet(){var s=st(),key='claude:'+s.sid;try{CL3.sheetClose()}catch(e){}
  var v=D.createElement('div');v.id='clsv';B.appendChild(v);var sh=D.createElement('div');sh.id='clsh';sh.className='clsh s5csh';
  sh.innerHTML='<div class="clgrab"></div><div class="clshh"><div class="clqx" data-cl="shx" role="button" aria-label="Закрыть">'+ci('x')+'</div><b>Side-чаты</b><label></label></div><div class="s5cb">'+cRows(S.list[key])+'</div>';
  B.appendChild(sh);if(sh.animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches)sh.animate([{transform:'translateY(105%)'},{transform:'none'}],{duration:500,easing:'cubic-bezier(.32,.72,0,1)'});
  v.addEventListener('click',function(){try{CL3.sheetClose()}catch(e){}});
  fetchList('claude',s.sid).then(function(L){var b=sh.querySelector('.s5cb');if(b&&sh.isConnected)b.innerHTML=cRows(L)}).catch(function(e){T('Не загрузил side-чаты: '+E(e.message))})}
 function newSide(el){var s=st(),sid=s.sid,k=s.kind;if(el.dataset.busy)return;el.dataset.busy=1;var sp=el.querySelector('span');if(sp)sp.textContent='Создаю…';
  SD3.api('/side/new',{method:'POST',body:{k:k,sid:sid}}).then(function(r){var x=r.s;x.side=sid;x.new=true;(S.keep[k]=S.keep[k]||{})[x.id]=x;(S.list[k+':'+sid]=S.list[k+':'+sid]||[]).unshift(x);
    try{CL3.sheetClose()}catch(e){}closeAll();SD3.openChat(k,x.id);setTimeout(function(){var ta=$i('hcin');if(ta)ta.focus()},400)})
   .catch(function(e){delete el.dataset.busy;if(sp)sp.textContent='Новый side-чат';T(E(e.message))})}
 /* ---------- пустой side-чат и «только чтение» ---------- */
 var EMP=null,NOTE=null,HELLO='';
 function tick(){var s=st(),c=cur(),inChat=!!(s&&W.U&&U.tab=='hc'&&s.view=='chat'),empty=inChat&&c&&!c.ro&&!c.dside&&!(s.msgs||[]).length&&!s.loadingMsgs&&!(s.pend||[]).length&&!s.busy;
  var ro=inChat&&S.ro(),cl=!!(s&&s.kind=='claude');
  if(B.classList.contains('s5ro')!=ro)B.classList.toggle('s5ro',ro);

  var g=$i(cl?'cl3':'g3');
  if(ro&&g){if(!NOTE||NOTE.parentNode!==g){if(NOTE)NOTE.remove();NOTE=D.createElement('div');NOTE.id='s5ron';g.appendChild(NOTE)}
   NOTE.className=cl?'s5ron cl':'s5ron gp';var tx=c&&c.dside?'Side-чат из Codex Desktop — продолжить можно в Codex на ПК':'Только просмотр — субагентом управляет основной чат';if(NOTE.textContent!=tx)NOTE.textContent=tx}
  else if(NOTE){NOTE.remove();NOTE=null}
  /* ChatGPT: заставка как у временного чата */
  var gp=!cl&&empty&&$i('g3');if(B.classList.contains('s5emp')!=!!gp)B.classList.toggle('s5emp',!!gp);
  if(gp){if(!EMP||EMP.parentNode!==$i('g3')){if(EMP)EMP.remove();EMP=D.createElement('div');EMP.id='s5emp';$i('g3').appendChild(EMP)}
   var par=(SD3.SD.L.codex||[]).filter(function(y){return y.id==c.side})[0],h='<b>Side-чат</b><span>Отдельно от «'+E(par?par.t:'основного чата')+'». Основной чат не прервётся, Codex ничего не изменит без твоей просьбы.</span>';if(EMP.__h!=h){EMP.innerHTML=h;EMP.__h=h}}
  else if(EMP){EMP.remove();EMP=null}
  /* Claude: приветствие → «Side-чат» тем же шрифтом */
  var hb=$i('clhib'),hi=$i('clhi');if(cl&&hb){var want=empty?'Side-чат':'';var sub=hi&&hi.querySelector('.s5hs');
   if(want&&hb.textContent!=want){HELLO=hb.textContent;hb.textContent=want}
   if(want&&!sub&&hi){sub=D.createElement('span');sub.className='s5hs';sub.textContent='Основной чат не прервётся, Claude ничего не изменит без твоей просьбы';hi.appendChild(sub)}
   if(!want&&sub)sub.remove()}}
 setInterval(tick,250);
 /* приветствие Claude перерисовывается базой — сразу вернуть «Side-чат», без мигания */
 var HMO=new MutationObserver(function(){var hb=$i('clhib'),c=cur(),s=st();if(hb&&c&&!c.ro&&!c.dside&&s&&s.kind=='claude'&&!(s.msgs||[]).length&&hb.textContent!='Side-чат')hb.textContent='Side-чат'});
 setInterval(function(){var hb=$i('clhib');if(hb&&!hb.__s5){hb.__s5=1;HMO.observe(hb,{characterData:true,childList:true,subtree:true})}},500);
 /* ---------- Hermes: «Спросить в сторону» — экран как временный чат ChatGPT ---------- */
 function key(sid){return 's5btw_'+sid}
 function hist(sid){try{return JSON.parse(localStorage.getItem(key(sid))||'[]')}catch(e){return []}}
 function save(sid,L){try{localStorage.setItem(key(sid),JSON.stringify(L.slice(-10)))}catch(e){}}
 function tmpPaint(keepInput){var s=st(),L=hist(s.sid),o=S.TMP;if(!o)return;var l=o.querySelector('.g3l'),f=o.querySelector('.g3f');
  var h=L.map(function(x){return '<div class="g3um"><div class="g3ub">'+md(x.t)+'</div></div>'+(x.st=='run'?'<div class="g3dot"><i></i></div>':'<div class="g3a'+(x.st=='fail'?' s5bad':'')+'">'+(x.st=='fail'?E(x.a):md(x.a))+'</div>')}).join('');
  if(l.__h!=h){l.innerHTML=h;l.__h=h;f.scrollTop=f.scrollHeight}
  o.classList.toggle('s5e',!L.length);
  var go=o.querySelector('.s5go'),ta=o.querySelector('textarea');go.classList.toggle('on',!!(ta&&ta.value.trim()))}
 function tmpOpen(){var g=$i('g3'),s=st();if(!g||!s)return;tmpClose(true);var o=D.createElement('div');o.id='s5tmp';o.className='s5tmp';
  o.innerHTML='<div class="g3f"><div class="g3l"></div></div><div class="g3top"></div>'+
   '<div class="g3hd"><div class="g3gl g3b44" data-s5d="tmpx" role="button" aria-label="Закрыть">'+gi('x')+'</div><div class="g3sp"></div><div class="s5tt">Вопрос в сторону</div><div class="g3sp"></div><div class="g3b44 s5ph"></div></div>'+
   '<div class="s5te"><b>Вопрос в сторону</b><span>Не попадёт в историю чата. Hermes ответит по разговору и не прервёт работу.</span></div>'+
   '<div class="g3c g3gl s5tc"><div class="g3row"><div class="g3ta"><textarea rows="1" maxlength="4000" placeholder="Вопрос в сторону"></textarea></div><div class="g3go s5go" data-s5d="tmpgo" role="button" aria-label="Отправить">'+gi('up')+'</div></div></div>';
  g.appendChild(o);S.TMP=o;var ta=o.querySelector('textarea');
  ta.addEventListener('input',function(){ta.style.height='auto';ta.style.height=Math.min(ta.scrollHeight,140)+'px';tmpPaint()});
  ta.addEventListener('keydown',function(e){if(e.key=='Enter'&&!e.shiftKey&&!('ontouchstart' in W)){e.preventDefault();askSend()}});
  if(o.animate)o.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{duration:280,easing:'cubic-bezier(.25,1,.3,1)'});
  tmpPaint();hist(s.sid).forEach(function(x){if(x.st=='run')poll(s.sid,x.q)});setTimeout(function(){ta.focus()},300);
  try{if(W.tg&&tg.BackButton&&W.SD3&&SD3.tgBack){tg.BackButton.offClick(SD3.tgBack);tg.BackButton.onClick(tmpBack);tg.BackButton.show()}}catch(e){}}
 function tmpBack(){tmpClose()}
 function tmpClose(quiet){var o=S.TMP;S.TMP=null;if(o)o.remove();if(!quiet||o)try{if(W.tg&&tg.BackButton&&W.SD3&&SD3.tgBack){tg.BackButton.offClick(tmpBack);tg.BackButton.onClick(SD3.tgBack)}}catch(e){}}
 S.tmpClose=tmpClose;
 setInterval(function(){var s=st();if(S.TMP&&!(s&&s.view=='chat'&&s.kind=='hermes'&&W.U&&U.tab=='hc'))tmpClose()},500);
 function askSend(){var s=st(),o=S.TMP,ta=o&&o.querySelector('textarea'),t=(ta&&ta.value||'').trim(),sid=s.sid;if(!t||o.__busy)return;o.__busy=1;
  SD3.api('/side/ask',{method:'POST',body:{k:'hermes',sid:sid,text:t}}).then(function(r){o.__busy=0;var L=hist(sid);L.push({q:r.q,t:t,st:'run',a:'',ts:Date.now()/1000|0});save(sid,L);ta.value='';ta.style.height='';tmpPaint();poll(sid,r.q)})
   .catch(function(e){o.__busy=0;T('Не отправил: '+E(e.message))})}
 function poll(sid,q){if(S.q[q])return;S.q[q]=1;var n=0;
  function fin(stt,a){var L=hist(sid);L.forEach(function(x){if(x.q==q){x.st=stt;x.a=a}});save(sid,L);delete S.q[q];if(S.TMP&&st().sid==sid)tmpPaint()}
  (function go(){SD3.api('/side/ask?q='+encodeURIComponent(q)).then(function(d){if(d.st=='run'&&n++<150){setTimeout(go,2000);return}fin(d.st=='run'?'fail':d.st,d.st=='run'?'Ответа нет больше 5 минут.':d.a)})
    .catch(function(e){if(n++<150&&!/404|не найден/i.test(e.message)){setTimeout(go,3000);return}fin('fail','Ответ потерян: '+e.message)})})()}
})();
