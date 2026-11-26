/* s5-sub (этап 5, п.4): субагенты чата — кто работает и что делает сейчас; Hermes — «Остановить».
   Источник /api/hc/sub (Claude: subagents/*.jsonl сессии, Codex: треды-дети, Hermes: владелец subagent.list/tail/interrupt).
   Блок в конце ленты только когда есть идущие или закончившие за 15 мин; тап по строке — лист с последними шагами.
   Опрос: Claude/Codex 5 с, пока кто-то работает (иначе 20 с); Hermes 10/30 с (каждый опрос — запрос к владельцу). */
(function(){var W=window,D=document;
 try{if(W.ICP&&!ICP['message-square'])ICP['message-square']='<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'}catch(e){}
 var S={k:'',sid:'',L:[],t:0,busy:0,j:'',stop:false,open:'',ot:0};W.S5S=S;
 function st(){return W.HC&&HC.st}
 function E(t){var d=D.createElement('div');d.textContent=t==null?'':t;return d.innerHTML}
 function on(){var s=st();return !!(s&&W.U&&U.tab=='hc'&&s.view=='chat'&&s.sid&&/^(claude|codex|hermes)$/.test(s.kind))}
 function ago(ts){var d=Math.max(0,Date.now()/1000-ts);return d<60?'только что':d<3600?Math.round(d/60)+' мин назад':Math.round(d/3600)+' ч назад'}
 function steps(n){var m=n%10,c=n%100;return n+' '+(m==1&&c!=11?'шаг':m>=2&&m<=4&&(c<12||c>14)?'шага':'шагов')}
 function sub(x){if(x.st=='run')return (x.n?steps(x.n):'запускается')+(x.last?' · '+x.last:'');return x.st=='done'?'готово · '+ago(x.ts):'остановлен · '+ago(x.ts)}
 S.html=function(s){if(!on()||S.sid!=s.sid||S.k!=s.kind||!S.L.length)return '';var run=S.L.filter(function(x){return x.st=='run'}).length;
  return '<div class="s5s"><div class="s5sh">'+(run?'Субагенты · '+run+' '+(run==1?'работает':'работают'):'Субагенты · готово')+'</div>'+S.L.map(function(x){
   return '<div class="s5sr" data-s5s="open" data-id="'+E(x.id)+'" role="button"><i class="s5sd '+E(x.st)+'"></i><div class="s5st"><b>'+E(x.goal||x.name)+'</b><span>'+E(sub(x))+'</span></div></div>'}).join('')+'</div>'};
 function paint(){try{HC.paint()}catch(e){}}
 function load(){var s=st();if(!on()||S.busy||!W.SD3||!W.API)return;var k=s.kind,sid=s.sid;S.busy=1;
  SD3.api('/sub?k='+k+'&sid='+encodeURIComponent(sid)).then(function(d){S.busy=0;S.t=Date.now();var c=st();if(c.sid!=sid||c.kind!=k)return;var L=d.s||[],j=JSON.stringify(L);
   if(S.sid!=sid||S.k!=k||S.j!=j){S.sid=sid;S.k=k;S.L=L;S.j=j;S.stop=!!d.stop;paint();if(S.open)sheetPaint()}}).catch(function(){S.busy=0;S.t=Date.now()})}
 function tick(){if(!on())return;var s=st();if(S.sid!=s.sid||S.k!=s.kind){S.L=[];S.j='';S.t=0;S.sid=s.sid;S.k=s.kind}
  var hot=S.L.some(function(x){return x.st=='run'})||!!s.cclive||!!(s.cur&&s.cur.live),hm=s.kind=='hermes';
  if(Date.now()-S.t>(hot?(hm?10000:5000):(hm?30000:20000)))load();
  if(S.open&&Date.now()-S.ot>4000&&S.L.some(function(x){return x.id==S.open&&x.st=='run'}))tail(S.open)}
 setInterval(tick,1000);
 var TL={};
 function tail(id){var s=st();if(!s)return;S.ot=Date.now();SD3.api('/sub/tail?k='+s.kind+'&sid='+encodeURIComponent(s.sid)+'&id='+encodeURIComponent(id)).then(function(d){TL[id]=d.lines||[];if(S.open==id)sheetPaint()}).catch(function(e){TL[id]=['Не удалось прочитать: '+e.message];if(S.open==id)sheetPaint()})}
 function sheetPaint(){var x=S.L.filter(function(y){return y.id==S.open})[0];if(!x||!W.sheet)return;var L=TL[x.id];
  /* скрытый маркер data-hc=openpc: G6MENU.sheetMark даёт листу облик агента (g6set: Claude/ChatGPT), как у меню чата */
  var h='<i hidden data-hc="openpc"></i><div class="hcsh"><b>Субагент</b></div><div class="s5sg">'+E(x.goal||x.name)+'</div><div class="s5sm">'+E(sub(x))+(x.model?' · '+E(x.model):'')+'</div>'+
   '<div class="s5sl">'+(L==null?'<div>Загружаю…</div>':L.length?L.map(function(l){return '<div>'+E(l)+'</div>'}).join(''):'<div>Шагов пока нет</div>')+'</div>'+
   (S.stop&&x.st=='run'?'<div class="btn bad danger" data-s5s="stop" data-id="'+E(x.id)+'">'+(W.IC?IC('square'):'')+'Остановить субагента</div>':'')+'<div class="btn" data-s5s="log" data-id="'+E(x.id)+'">'+(W.IC?IC('message-square'):'')+'Открыть переписку</div><div class="btn" data-s5s="close">'+(W.IC?IC('x'):'')+'Закрыть</div>';
  var sh=D.getElementById('sheet');if(sh&&sh.classList.contains('on')&&sh.querySelector('.s5sl')){sh.innerHTML='<div class="gr"></div>'+h}else sheet(h)}
 function stop(id,el){var s=st();if(el)el.textContent='Останавливаю…';
  SD3.api('/sub/stop',{method:'POST',body:{sid:s.sid,id:id}}).then(function(r){W.toast&&toast(r.found?'Субагент остановлен':'Субагент уже закончил');S.t=0;load()})
   .catch(function(e){W.toast&&toast('Не остановил: '+E(e.message));if(el)el.textContent='Остановить субагента'})}
 D.addEventListener('click',function(ev){var el=ev.target.closest&&ev.target.closest('[data-s5s]');if(!el)return;ev.stopPropagation();ev.preventDefault();var a=el.dataset.s5s;
  if(a=='open'){S.open=el.dataset.id;TL[S.open]=TL[S.open]||null;sheetPaint();tail(S.open)}
  else if(a=='close'){S.open='';W.unsheet&&unsheet()}
  else if(a=='stop')stop(el.dataset.id,el)
  else if(a=='log'){S.open='';W.unsheet&&unsheet();logOpen(el.dataset.id)}
  else if(a=='lback')logClose()
  else if(a=='tog')el.classList.toggle('on')},true);
 /* «Открыть переписку»: весь разговор субагента на отдельном экране, только чтение (поля ввода нет) */
 var V={id:'',t:0,j:'',busy:0};S.V=V;
 function md(t){try{return W.md?W.md(t):E(t)}catch(e){return E(t)}}
 function row(m){if(m.r=='u')return '<div class="s5vu"><div>'+E(m.t)+'</div></div>';
  if(m.r=='a')return '<div class="s5va">'+md(m.t)+'</div>';
  if(m.r=='t')return '<div class="s5vt" data-s5s="tog"><span>'+E(m.t)+'</span></div>';
  return '<div class="s5vo">'+E(m.t)+'</div>'}
 function vpaint(L){var x=S.L.filter(function(y){return y.id==V.id})[0]||{},el=D.getElementById('s5sv');if(!el)return;
  var b=el.querySelector('.s5vb'),near=b.scrollHeight-b.scrollTop-b.clientHeight<80;
  el.querySelector('.s5vh b').textContent=x.goal||x.name||'Субагент';el.querySelector('.s5vh span').textContent=x.st?sub(x):'';
  b.innerHTML=L==null?'<div class="s5ve">Загружаю…</div>':L.length?L.map(row).join('')+(x.st=='run'?'<div class="s5ve">работает…</div>':''):'<div class="s5ve">Переписки пока нет</div>';
  b.parentNode.querySelector('.s5vn').textContent='Только просмотр · пишет субагенту главный агент';if(near||V.first){b.scrollTop=b.scrollHeight;V.first=0}}
 function vload(){var s=st(),x=S.L.filter(function(y){return y.id==V.id})[0]||{};if(!V.id||V.busy)return;V.busy=1;V.t=Date.now();
  SD3.api('/sub/log?k='+s.kind+'&sid='+encodeURIComponent(s.sid)+'&id='+encodeURIComponent(V.id)+(x.cs?'&cs='+encodeURIComponent(x.cs):'')).then(function(d){V.busy=0;var j=JSON.stringify(d.m||[]);if(j!=V.j){V.j=j;vpaint(d.m||[])}})
   .catch(function(e){V.busy=0;var el=D.getElementById('s5sv');if(el&&!V.j)el.querySelector('.s5vb').innerHTML='<div class="s5ve">Не удалось прочитать: '+E(e.message)+'</div>'})}
 function back(){logClose()}
 function logOpen(id){V.id=id;V.j='';V.first=1;var el=D.getElementById('s5sv');if(!el){el=D.createElement('div');el.id='s5sv';D.body.appendChild(el)}
  el.className='on '+(st().kind||'');el.innerHTML='<div class="s5vh"><div class="s5vx" data-s5s="lback" role="button">'+(W.IC?IC('chevron-left'):'‹')+'</div><div class="s5vht"><b></b><span></span></div></div><div class="s5vb"></div><div class="s5vn"></div>';
  vpaint(null);vload();
  try{if(W.tg&&tg.BackButton&&W.SD3&&SD3.tgBack){tg.BackButton.offClick(SD3.tgBack);tg.BackButton.onClick(back);tg.BackButton.show()}}catch(e){}}
 function logClose(){var el=D.getElementById('s5sv');if(el)el.className='';V.id='';
  try{if(W.tg&&tg.BackButton&&W.SD3&&SD3.tgBack){tg.BackButton.offClick(back);tg.BackButton.onClick(SD3.tgBack)}}catch(e){}}
 S.logOpen=logOpen;S.logClose=logClose;
 setInterval(function(){if(!V.id)return;var x=S.L.filter(function(y){return y.id==V.id})[0];if(x&&x.st=='run'&&Date.now()-V.t>5000)vload();if(!on())logClose()},1000);
 /* закрыли лист свайпом/вуалью — перестать обновлять хвост */
 setInterval(function(){var sh=D.getElementById('sheet');if(S.open&&!(sh&&sh.classList.contains('on')&&sh.querySelector('.s5sl')))S.open=''},700);
})();
