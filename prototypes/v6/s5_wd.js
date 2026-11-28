/* s5-wd (этап 5, п.6): «Что делаешь?» — вопрос к идущей сессии в одно касание, не трогая историю чата.
   Касание → сразу сводка БЕЗ модели (/api/hc/wd: задача, сколько идёт, шаг сейчас, последние шаги, последние слова),
   «Спросить подробнее» → ответ модели в сторону (/api/hc/wd/ask: Claude — haiku без инструментов, Codex — exec read-only,
   Hermes — prompt.btw + сводка; ни одного нового чата). Только родные элементы:
   ChatGPT (Codex, Hermes) — экран временного чата как «Вопрос в сторону» (.s5tmp): пузырь .g3um/.g3ub, строка «Работает N ›»
     .g3wk без значка с раскрытием .g3tl/.g3to, ответ .g3a, подсказка-строка как в пустом чате (.g3sg), поле .g3c.
   Claude — лист Claude (#clsh) как «Project Files»: группа .clgrp/.clsr, последние слова шрифтом ответа .cla,
     белая капсула «Спросить подробнее» как «Add Files».
   Входы: первый пункт «⋯» в шапке чата (всех трёх); строка проекта во вкладке «Проекты» и карточка проекта — только пока
   идёт ход (p.wd от tv_multi): кнопка «Что делаешь?» открывает этот чат и сразу экран ответа. */
(function(){var W=window,D=document,B=D.body;
 var S={open:null,d:null,t:0,busy:0,q:{},want:null};W.S5W=S;
 var NM={claude:'Claude',codex:'Codex',hermes:'Hermes'},DQ='Что ты сейчас делаешь и сколько примерно осталось?';
 function st(){return W.HC&&HC.st}
 function E(t){var d=D.createElement('div');d.textContent=t==null?'':t;return d.innerHTML}
 function T(m){try{toast(m)}catch(e){}}
 function $i(id){return D.getElementById(id)}
 function gi(n){try{return G3.ic(n)}catch(e){return ''}}
 function ci(n){try{return CL3.ic(n)}catch(e){return ''}}
 function md(t){try{return W.md?W.md(t):E(t)}catch(e){return E(t)}}
 function inChat(){var s=st();return !!(s&&W.U&&U.tab=='hc'&&s.view=='chat'&&s.sid&&NM[s.kind])}
 function ro(){return !!(W.S5D&&S5D.ro&&S5D.ro())}
 function side(){var c=W.S5D&&S5D.cur&&S5D.cur();return !!(c&&c.side)}
 function dur(s){s=Math.max(0,s|0);return s<60?s+' с':s<3600?Math.round(s/60)+' мин':Math.floor(s/3600)+' ч '+Math.round(s%3600/60)+' мин'}
 function ago(ts){var d=Math.max(0,Date.now()/1000-ts);return d<60?'только что':d<3600?Math.round(d/60)+' мин назад':d<86400?Math.round(d/3600)+' ч назад':Math.round(d/86400)+' дн назад'}
 function steps(n){var m=n%10,c=n%100;return n+' '+(m==1&&c!=11?'шаг':m>=2&&m<=4&&(c<12||c>14)?'шага':'шагов')}
 /* одна строка для строки проекта: «Команда · npm test · 3 мин» */
 S.line=function(w){return [w.now||(w.task?'«'+w.task+'»':''),w.dur?dur(w.dur):''].filter(Boolean).join(' · ')};
 /* ---------- история вопросов (на телефоне, как «Вопрос в сторону») ---------- */
 function key(sid){return 's5wd_'+sid}
 function hist(sid){try{return JSON.parse(localStorage.getItem(key(sid))||'[]')}catch(e){return []}}
 function save(sid,L){try{localStorage.setItem(key(sid),JSON.stringify(L.slice(-8)))}catch(e){}}
 /* ---------- сводка ---------- */
 function load(){var o=S.open;if(!o||S.busy||!W.API)return;S.busy=1;
  try{SD3.api('/wd?k='+o.k+'&sid='+encodeURIComponent(o.sid)).then(function(d){S.busy=0;S.fails=0;if(!S.open||S.open.sid!=o.sid)return;S.d=d;S.t=Date.now();paint()})
   .catch(function(e){S.busy=0;S.t=Date.now();S.fails=(S.fails||0)+1;/* связь с ПК мигнула — пробуем ещё, ошибку показываем с третьей неудачи подряд */
    if(S.open&&S.fails>=3&&(!S.d||S.d.err)){S.d={err:e.message};paint()}})}catch(e){S.busy=0}}
 setInterval(function(){if(S.open&&(!S.d||S.d.run||S.d.err)&&Date.now()-S.t>3000)load()},1000);
 /* текст ответа без модели — обычный ответ агента, как будто он сказал это сам */
 function plain(d){if(!d)return '';if(d.err)return 'Не получилось прочитать чат: '+d.err;
  var L=[];
  if(d.run){L.push(d.now?'Сейчас: **'+d.now+'**.':'Сейчас думаю над ответом.');if(d.task)L.push('Задача: «'+d.task+'».');}
  else{L.push('Сейчас ничего не делаю — '+(d.ts?'закончил '+ago(d.ts):'жду сообщения')+'.');if(d.task)L.push('Последняя задача: «'+d.task+'».')}
  if(d.say)L.push((d.run?'Последнее, что написал: «':'Ответил: «')+d.say+'»');
  return L.join('\n\n')}
 function wkTitle(d){return d.run?'Работает '+dur(d.dur):d.dur?'Работал '+dur(d.dur):'Ход закончен'}
 /* ---------- ChatGPT: экран временного чата ---------- */
 function gHtml(){var d=S.d,o=S.open,L=hist(o.sid),h='<div class="g3um"><div class="g3ub">Что делаешь?</div></div>';
  if(!d)h+='<div class="g3dot"><i></i></div>';
  else{if(!d.err&&(d.n||d.now)){var on=!!S.wk;h+='<div class="g3wk s5wk'+(on?' on':'')+'" data-s5w="wk"><span>'+E(wkTitle(d))+(d.n?' · '+steps(d.n):'')+'</span>'+gi('chev')+'</div>';
    if(on)h+='<div class="g3tl s5wl">'+(d.now?'<div class="g3to"><b>Сейчас</b> '+E(d.now)+'</div>':'')+(d.steps||[]).map(function(x){return '<div class="g3to">'+E(x)+'</div>'}).join('')+'</div>'}
   h+='<div class="g3a">'+md(plain(d))+'</div>';
   if(!d.err)h+='<div class="s5wsg"><div data-s5w="more">'+gi('bulb')+'<span>Спросить подробнее</span></div></div>'}
  L.forEach(function(x){h+='<div class="g3um"><div class="g3ub">'+E(x.t)+'</div></div>'+(x.st=='run'?'<div class="g3dot"><i></i></div>':'<div class="g3a'+(x.st=='fail'?' s5bad':'')+'">'+(x.st=='fail'?E(x.a):md(x.a))+'</div>')});
  return h}
 function gOpen(){var g=$i('g3'),o=S.open;if(!g)return;var x=D.createElement('div');x.id='s5wd';x.className='s5tmp s5wd';
  x.innerHTML='<div class="g3f"><div class="g3l"></div></div><div class="g3top"></div>'+
   '<div class="g3hd"><div class="g3gl g3b44" data-s5w="x" role="button" aria-label="Закрыть">'+gi('x')+'</div><div class="g3sp"></div><div class="s5tt">Что делаешь?</div><div class="g3sp"></div><div class="g3b44 s5ph"></div></div>'+
   '<div class="g3c g3gl s5tc"><div class="g3row"><div class="g3ta"><textarea rows="1" maxlength="1000" placeholder="Спросить в сторону"></textarea></div><div class="g3go s5go" data-s5w="go" role="button" aria-label="Отправить">'+gi('up')+'</div></div></div>';
  g.appendChild(x);S.el=x;var ta=x.querySelector('textarea');
  ta.addEventListener('input',function(){ta.style.height='auto';ta.style.height=Math.min(ta.scrollHeight,140)+'px';x.querySelector('.s5go').classList.toggle('on',!!ta.value.trim())});
  ta.addEventListener('keydown',function(e){if(e.key=='Enter'&&!e.shiftKey&&!('ontouchstart' in W)){e.preventDefault();ask(ta.value)}});
  if(x.animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches)x.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{duration:280,easing:'cubic-bezier(.25,1,.3,1)'});
  back(true)}
 /* ---------- Claude: лист = маленький экран Claude (элементы его чата, не таблица) ----------
    сверху как идущий ход в чате Claude: оранжевые точки + переливающийся текст шага (.clth, «Checking open issues…»),
    «◷ 3 мин · 12 шагов ›» (.clwk) с раскрытием шагов (.cltl/.clto), задача — карточка «Question» (.clqa),
    последние слова — ответ Claude с засечками (.cla); вопрос — пузырь (.clum/.club), ожидание — «Думаю…» (.clth),
    внизу белая капсула «Спросить подробнее» (как «Add Files»), после первого ответа — поле Claude «Спросить ещё…» с ↑. */
 function cHtml(){var d=S.d,o=S.open,L=hist(o.sid),h='';
  if(!d)return '<div class="clth s5wnow"><div class="cldots"><i></i><i></i><i></i></div><span>Смотрю, что происходит…</span></div>';
  if(d.err)return '<div class="cla s5wsay s5bad">Не получилось прочитать чат: '+E(d.err)+'</div>';
  if(d.run)h+='<div class="clth s5wnow"><div class="cldots"><i></i><i></i><i></i></div><span>'+E(d.now||'Думаю над ответом')+'</span></div>';
  else h+='<div class="s5widle">'+ci('spark')+'<span>Ничего не делаю'+(d.ts?' · закончил '+ago(d.ts):'')+'</span></div>';
  if(d.n||(d.steps&&d.steps.length)){var on=!!S.wk;
   h+='<div class="clwk s5wk'+(on?' on':'')+'" data-s5w="wk">'+ci('clock')+'<span>'+(d.run?'Работаю ':'Работал ')+dur(d.dur)+(d.n?' · '+steps(d.n):'')+'</span>'+ci('chev')+'</div>';
   if(on)h+='<div class="cltl s5wl">'+(d.now?'<div class="clto"><b>Сейчас</b> '+E(d.now)+'</div>':'')+(d.steps||[]).map(function(x){return '<div class="clto">'+E(x)+'</div>'}).join('')+'</div>'}
  if(d.task)h+='<div class="clqa s5wtask"><b>'+(d.run?'Задача':'Последняя задача')+'</b>'+E(d.task)+'</div>';
  if(d.say)h+='<div class="cla s5wsay">'+md(d.say)+'</div>';
  L.forEach(function(x){h+='<div class="clum s5wum"><div class="club">'+E(x.t)+'</div></div>'+(x.st=='run'?'<div class="clth s5wth"><div class="cldots"><i></i><i></i><i></i></div><span>Думаю…</span></div>':'<div class="cla s5wa'+(x.st=='fail'?' s5bad':'')+'">'+(x.st=='fail'?E(x.a):md(x.a))+'</div>')});
  return h}
 function cFoot(){var x=S.el,o=S.open;if(!x||!o)return;var L=hist(o.sid),run=L.some(function(y){return y.st=='run'}),f=x.querySelector('.s5wft');if(!f)return;
  var mode=L.length?'in':'go';if(f.dataset.m!=mode){f.dataset.m=mode;f.innerHTML=mode=='go'?'<div class="s5rgo s5wgo" data-s5w="more" role="button">'+ci('spark')+'<span>Спросить подробнее</span></div>':
   '<div class="s5wcmp"><textarea rows="1" maxlength="1000" placeholder="Спросить ещё…"></textarea><div class="clgo s5wup" data-i="up" data-s5w="go" role="button" aria-label="Отправить">'+ci('up')+'</div></div>';
   var ta=f.querySelector('textarea');if(ta){ta.addEventListener('input',function(){ta.style.height='auto';ta.style.height=Math.min(ta.scrollHeight,110)+'px';f.querySelector('.s5wup').classList.toggle('on',!!ta.value.trim())});
    ta.addEventListener('keydown',function(e){if(e.key=='Enter'&&!e.shiftKey&&!('ontouchstart' in W)){e.preventDefault();ask(ta.value)}})}}
  f.classList.toggle('s5dim',run)}
 function cOpen(){try{CL3.sheetClose()}catch(e){}
  var v=D.createElement('div');v.id='clsv';B.appendChild(v);var sh=D.createElement('div');sh.id='clsh';sh.className='clsh s5csh s5rsh s5wsh';
  sh.innerHTML='<div class="clgrab"></div><div class="clshh"><div class="clqx" data-cl="shx" role="button" aria-label="Закрыть">'+ci('x')+'</div><b>Что делает Claude</b><label></label></div><div class="s5cb"></div><div class="s5wft"></div>';
  B.appendChild(sh);S.el=sh;if(sh.animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches)sh.animate([{transform:'translateY(105%)'},{transform:'none'}],{duration:500,easing:'cubic-bezier(.32,.72,0,1)'});
  v.addEventListener('click',function(){try{CL3.sheetClose()}catch(e){}})}
 /* ---------- общее ---------- */
 function paint(){var o=S.open,x=S.el;if(!o||!x||!x.isConnected)return;
  if(o.k=='claude'){var b=x.querySelector('.s5cb'),h=cHtml();if(b&&b.__h!=h){var end=b.scrollHeight-b.scrollTop-b.clientHeight<40;b.innerHTML=h;b.__h=h;if(end&&b.__h0)b.scrollTop=b.scrollHeight;b.__h0=1}cFoot();return}
  var l=x.querySelector('.g3l'),f=x.querySelector('.g3f'),h2=gHtml();if(l.__h!=h2){var end=f.scrollHeight-f.scrollTop-f.clientHeight<40;l.innerHTML=h2;l.__h=h2;if(end)f.scrollTop=f.scrollHeight}}
 function open(){var s=st();if(!inChat())return;close(true);S.open={k:s.kind,sid:s.sid};S.d=null;S.t=0;S.wk=false;S.fails=0;
  if(s.kind=='claude')cOpen();else gOpen();paint();load();hist(s.sid).forEach(function(x){if(x.st=='run')poll(s.sid,x.q)})}
 S.openNow=open;
 function close(quiet){var o=S.open;S.open=null;S.d=null;var x=S.el;S.el=null;
  if(o&&o.k=='claude'){if(x&&x.isConnected)try{CL3.sheetClose()}catch(e){if(x)x.remove()}}else if(x)x.remove();
  if(o&&o.k!='claude')back(false)}
 S.close=close;
 function tgBack(){close()}
 function back(on){try{if(!W.tg||!tg.BackButton||!W.SD3||!SD3.tgBack)return;if(on){tg.BackButton.offClick(SD3.tgBack);tg.BackButton.onClick(tgBack);tg.BackButton.show()}else{tg.BackButton.offClick(tgBack);tg.BackButton.onClick(SD3.tgBack)}}catch(e){}}
 /* лист Claude закрыт базой (✕, подложка) — забыть; ушли из чата — закрыть */
 setInterval(function(){if(!S.open)return;var s=st();if(!inChat()||s.sid!=S.open.sid){close();return}if(S.open.k=='claude'&&S.el&&!S.el.isConnected){S.open=null;S.el=null;return}
  /* база пересобрала экран чата (#g3) — вернуть экран ответа на место, с тем же содержимым */
  if(S.open.k!='claude'&&S.el&&!S.el.isConnected){var g=$i('g3');if(g){g.appendChild(S.el);var f=S.el.querySelector('.g3f');if(f)f.scrollTop=f.scrollHeight}}},150);
 function ask(t){var o=S.open;if(!o)return;t=(t||'').trim()||DQ;var L=hist(o.sid);if(L.some(function(x){return x.st=='run'}))return;
  if(S.asking)return;S.asking=1;
  SD3.api('/wd/ask',{method:'POST',body:{k:o.k,sid:o.sid,t:t}}).then(function(r){S.asking=0;var L=hist(o.sid);L.push({q:r.q,t:t,st:'run',a:'',ts:Date.now()/1000|0});save(o.sid,L);
    var ta=S.el&&S.el.querySelector('textarea');if(ta){ta.value='';ta.style.height='';var g=S.el.querySelector('.s5go,.s5wup');if(g)g.classList.remove('on')}
    paint();var f=S.el&&S.el.querySelector('.g3f,.s5cb');if(f)f.scrollTop=f.scrollHeight;poll(o.sid,r.q)})
   .catch(function(e){S.asking=0;T('Не отправил: '+E(e.message))})}
 function poll(sid,q){if(S.q[q])return;S.q[q]=1;var n=0;
  function fin(stt,a){var L=hist(sid);L.forEach(function(x){if(x.q==q){x.st=stt;x.a=a}});save(sid,L);delete S.q[q];if(S.open&&S.open.sid==sid){paint();var f=S.el&&S.el.querySelector('.g3f,.s5cb');if(f)f.scrollTop=f.scrollHeight}}
  (function go(){SD3.api('/wd/ask?q='+encodeURIComponent(q)).then(function(d){if(d.st=='run'&&n++<120){setTimeout(go,2000);return}fin(d.st=='run'?'fail':d.st,d.st=='run'?'Ответа нет больше 4 минут.':d.a)})
    .catch(function(e){if(n++<120&&!/404/.test(e.message)){setTimeout(go,3000);return}fin('fail','Ответ потерян: '+e.message)})})()}
 /* ---------- «⋯» шапки: первый пункт ---------- */
 function gAdd(){var p=$i('g3pop'),s=st();if(!p||!s||!p.classList.contains('g3pm')||p.querySelector('[data-s5w]')||!inChat()||ro()||side()||s.kind=='claude')return;
  var t=D.createElement('div');t.innerHTML='<div class="g3mi" data-s5w="open">'+gi('bulb')+'<span>Что делаешь?</span></div>';
  var first=p.querySelector('.g3mi');if(first)p.insertBefore(t.firstChild,first);else p.appendChild(t.firstChild)}
 function cAdd(){var p=$i('clpop'),s=st();if(!p||!s||s.kind!='claude'||p.querySelector('[data-s5w]')||!p.querySelector('[data-hc=menu]')||ro()||side())return;
  var t=D.createElement('div');t.innerHTML='<div class="clmi" data-s5w="open">'+ci('clock')+'<span>Что делаешь?</span></div>';
  var first=p.querySelector('.clmi');if(first)p.insertBefore(t.firstChild,first);else p.appendChild(t.firstChild)}
 function wrap(){if(W.G3&&G3.headMenu&&!G3.headMenu.__s5w){var o=G3.headMenu;G3.headMenu=function(){var r=o.apply(this,arguments);gAdd();setTimeout(gAdd,0);return r};G3.headMenu.__s5w=1;G3.headMenu.__s5d=o.__s5d}
  if(W.CL3&&CL3.headMenu&&!CL3.headMenu.__s5w){var o2=CL3.headMenu;CL3.headMenu=function(){var r=o2.apply(this,arguments);cAdd();setTimeout(cAdd,0);return r};CL3.headMenu.__s5w=1;CL3.headMenu.__s5d=o2.__s5d}}
 setInterval(wrap,500);wrap();
 /* ---------- строка проекта и карточка проекта (p.wd) ---------- */
 function btn(w){return '<div class="btn sm pri ab8 s5wb" data-s5w="row" data-k="'+E(w.k)+'" data-s="'+E(w.sid)+'" data-t="'+E(w.task||'')+'">Что делаешь?</div>'}
 function wrapRows(){
  if(typeof W.rowA2=='function'&&!W.rowA2.__s5w){var r0=W.rowA2;W.rowA2=function(p){var h=r0.apply(this,arguments);if(!p||!p.wd||p.q&&p.q.length)return h;
    var w=p.wd,d=(NM[w.k]||w.k)+' · '+S.line(w);
    h=h.replace(/<div class="d2">[\s\S]*?<\/div><\/div>/,'<div class="d2">'+E(d)+'</div></div>');
    h=h.replace(/<span class="fr2">[^<]*<\/span>/,'');
    return h.indexOf('<span class="cv86">')>0?h.replace('<span class="cv86">',btn(w)+'<span class="cv86">'):h.replace(/<\/div>$/,btn(w)+'</div>')};W.rowA2.__s5w=1}
  if(typeof W.prjPage86=='function'&&!W.prjPage86.__s5w){var p0=W.prjPage86;W.prjPage86=function(){var h=p0.apply(this,arguments),p=W.prjById8&&prjById8(U.pid86);if(!p||!p.wd||U.page!='prj8')return h;
    var w=p.wd,row='<div class="sec s5wps"><div class="grp"><div class="row2 ag8 nf86">'+TL(w.k,'m')+'<div class="t2"><div class="n2"><span class="dot ok"></span><span class="nm2">'+E(w.now?'Сейчас: '+w.now:NM[w.k]+' работает')+'</span></div><div class="d2">'+E([w.dur?'идёт '+dur(w.dur):'',w.n?steps(w.n):''].filter(Boolean).join(' · ')||w.task||'')+'</div></div>'+btn(w)+'</div></div></div>';
    var i=h.indexOf('<div class="sec pcs5">');if(i<0)return h+row;
    /* конец секции карточки — по глубине вложенности div (внутри строк свои div) */
    var re=/<div\b|<\/div>/g,dep=0,m;re.lastIndex=i;while((m=re.exec(h))){dep+=m[0]=='</div>'?-1:1;if(!dep){var j=m.index+6;return h.slice(0,j)+row+h.slice(j)}}return h+row};W.prjPage86.__s5w=1}}
 wrapRows();setInterval(wrapRows,1000);
 /* открыть чат строки и сразу экран ответа */
 function fromRow(el){var k=el.dataset.k,id=el.dataset.s;if(!NM[k]||!id)return;S.want={k:k,id:id,t0:Date.now()};
  var L=(SD3.SD.L[k]||[]);if(!L.some(function(x){return x.id==id})){L=L.slice();L.unshift({id:id,k:k,t:el.dataset.t||NM[k],ts:Date.now()/1000|0,src:k=='hermes'?'local':k,rw:false,dw:true,cc:k!='hermes'});SD3.SD.L[k]=L}
  SD3.openChat(k,id)}
 setInterval(function(){var w=S.want,s=st();if(!w)return;if(Date.now()-w.t0>12000){S.want=null;return}
  if(s&&s.view=='chat'&&s.kind==w.k&&s.sid==w.id&&W.U&&U.tab=='hc'&&!s.loadingMsgs){S.want=null;setTimeout(open,250)}},150);
 D.addEventListener('click',function(ev){var el=ev.target.closest&&ev.target.closest('[data-s5w]');if(!el)return;ev.stopPropagation();ev.preventDefault();var a=el.dataset.s5w;
  if(a=='open'){try{G3.closePop()}catch(e){}try{CL3.closePop()}catch(e){}setTimeout(open,0)}
  else if(a=='row')fromRow(el);
  else if(a=='x')close();
  else if(a=='wk'){S.wk=!S.wk;paint()}
  else if(a=='more')ask('');
  else if(a=='go'){var ta=S.el&&S.el.querySelector('textarea');if(ta&&ta.value.trim())ask(ta.value)}},true);
})();
