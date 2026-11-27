/* s5-sub v2 (этап 5, п.4): субагенты чата в облике самого приложения.
   ChatGPT-облик (Codex, Hermes): строки как «Работал 7 с ›» (.g3wk), раскрытие — список шагов как у «Работал» (.g3tl/.g3to).
   Claude-облик: идущий субагент — как «Думаю…» (.clth с тремя точками), закончивший — как «◷ N шагов ›» (.clwk), раскрытие — .cltl/.clto.
   «Открыть переписку» — переписка субагента открывается ОБЫЧНЫМ экраном чата этого агента, только для чтения
   (Codex — тред субагента, Hermes — его сессия, Claude — sub.<сессия>.<agentId>); «Остановить» — только у Hermes.
   Источник /api/hc/sub (tv_sub.py). Опрос: Claude/Codex 5/20 с, Hermes 10/30 с, только пока чат открыт. */
(function(){var W=window,D=document,B=D.body;
 var S={k:'',sid:'',L:[],t:0,busy:0,j:'',stop:false,open:{},TL:{},tt:{}};W.S5S=S;
 function st(){return W.HC&&HC.st}
 function E(t){var d=D.createElement('div');d.textContent=t==null?'':t;return d.innerHTML}
 function on(){var s=st();return !!(s&&W.U&&U.tab=='hc'&&s.view=='chat'&&s.sid&&/^(claude|codex|hermes)$/.test(s.kind)&&!(W.S5D&&S5D.ro&&S5D.ro()))}
 function ago(ts){var d=Math.max(0,Date.now()/1000-ts);return d<60?'только что':d<3600?Math.round(d/60)+' мин назад':Math.round(d/3600)+' ч назад'}
 function steps(n){var m=n%10,c=n%100;return n+' '+(m==1&&c!=11?'шаг':m>=2&&m<=4&&(c<12||c>14)?'шага':'шагов')}
 function ic(cl,n){try{return cl?CL3.ic(n):G3.ic(n)}catch(e){return ''}}
 function goal(x){return x.goal||x.name||'Субагент'}
 function stat(x){return x.st=='run'?(x.n?steps(x.n):'запускается'):x.st=='done'?'готово':'остановлен'}
 function row(x,cl){var o=!!S.open[x.id],g=E(goal(x)),tl='<span class="s5t"><span class="s5g">'+g+'</span><span class="s5n"> · '+E(stat(x))+'</span></span>';
  if(cl)return x.st=='run'
   ?'<div class="clth s5r'+(o?' on':'')+'" data-s5s="tog" data-id="'+E(x.id)+'"><div class="cldots"><i></i><i></i><i></i></div>'+tl+ic(1,'chev')+'</div>'
   :'<div class="clwk s5r'+(o?' on':'')+'" data-s5s="tog" data-id="'+E(x.id)+'">'+ic(1,'clock')+tl+ic(1,'chev')+'</div>';
  return '<div class="g3wk s5r'+(o?' on':'')+(x.st=='run'?' s5run':'')+'" data-s5s="tog" data-id="'+E(x.id)+'">'+(x.st=='run'?'<i class="s5pd"></i>':'')+tl+ic(0,'chev')+'</div>'}
 function list(x,cl){var L=S.TL[x.id],k=st().kind,to=cl?'clto':'g3to',h='';
  h+=L==null?'<div class="'+to+'">Загружаю шаги…</div>':L.length?L.slice(-8).map(function(l){return '<div class="'+to+'">'+E(l)+'</div>'}).join(''):'<div class="'+to+'">Шагов пока нет</div>';
  if(x.st!='run')h+='<div class="'+to+'">'+E((x.st=='done'?'Закончил ':'Остановлен ')+ago(x.ts))+'</div>';
  h+='<div class="'+to+' s5a" data-s5s="log" data-id="'+E(x.id)+'">Открыть переписку</div>';
  if(S.stop&&x.st=='run'&&k=='hermes')h+='<div class="'+to+' s5a bad" data-s5s="stop" data-id="'+E(x.id)+'">Остановить субагента</div>';
  return '<div class="'+(cl?'cltl':'g3tl')+' s5l">'+h+'</div>'}
 S.html=function(s){if(!on()||S.sid!=s.sid||S.k!=s.kind||!S.L.length)return '';var cl=s.kind=='claude';
  return '<div class="s5s'+(cl?' s5cl':' s5gp')+'">'+S.L.map(function(x){return row(x,cl)+(S.open[x.id]?list(x,cl):'')}).join('')+'</div>'};
 function paint(){try{HC.paint()}catch(e){}var k=(st()||{}).kind;try{if(k=='claude'&&W.CL3&&CL3.draw)CL3.draw();else if(W.G3&&G3.draw)G3.draw()}catch(e){}}
 function load(){var s=st();if(!on()||S.busy||!W.SD3||!W.API)return;var k=s.kind,sid=s.sid;S.busy=1;
  SD3.api('/sub?k='+k+'&sid='+encodeURIComponent(sid)).then(function(d){S.busy=0;S.t=Date.now();var c=st();if(c.sid!=sid||c.kind!=k)return;var L=d.s||[],j=JSON.stringify(L);
   if(S.sid!=sid||S.k!=k||S.j!=j){S.sid=sid;S.k=k;S.L=L;S.j=j;S.stop=!!d.stop;paint()}}).catch(function(){S.busy=0;S.t=Date.now()})}
 function tail(id){var s=st();if(!s)return;S.tt[id]=Date.now();SD3.api('/sub/tail?k='+s.kind+'&sid='+encodeURIComponent(s.sid)+'&id='+encodeURIComponent(id)).then(function(d){var j=JSON.stringify(d.lines||[]);if(JSON.stringify(S.TL[id])!=j){S.TL[id]=d.lines||[];paint()}}).catch(function(e){S.TL[id]=['Не удалось прочитать: '+e.message];paint()})}
 function tick(){if(!on())return;var s=st();if(S.sid!=s.sid||S.k!=s.kind){S.L=[];S.j='';S.t=0;S.sid=s.sid;S.k=s.kind;S.open={};S.TL={}}
  var hot=S.L.some(function(x){return x.st=='run'})||!!s.cclive||!!(s.cur&&s.cur.live),hm=s.kind=='hermes';
  if(Date.now()-S.t>(hot?(hm?10000:5000):(hm?30000:20000)))load();
  for(var id in S.open)if(S.open[id]&&Date.now()-(S.tt[id]||0)>4000&&S.L.some(function(x){return x.id==id&&x.st=='run'}))tail(id)}
 setInterval(tick,1000);
 /* переписка = обычный экран чата агента, только чтение */
 function openLog(x){var s=st(),k=s.kind,id=k=='codex'?x.id:k=='hermes'?x.cs:'sub.'+s.sid+'.'+x.id;
  if(!id){W.toast&&toast('Переписку этого субагента Hermes не отдал');return}
  if(W.S5D)S5D.openRO(k,id,{t:'Субагент · '+goal(x),parent:s.sid,sub:1});else SD3.openChat(k,id)}
 function stop(id,el){var s=st();if(el)el.textContent='Останавливаю…';
  SD3.api('/sub/stop',{method:'POST',body:{sid:s.sid,id:id}}).then(function(r){W.toast&&toast(r.found?'Субагент остановлен':'Субагент уже закончил');S.t=0;load()})
   .catch(function(e){W.toast&&toast('Не остановил: '+E(e.message));if(el)el.textContent='Остановить субагента'})}
 D.addEventListener('click',function(ev){var el=ev.target.closest&&ev.target.closest('[data-s5s]');if(!el)return;ev.stopPropagation();ev.preventDefault();var a=el.dataset.s5s,id=el.dataset.id,x=S.L.filter(function(y){return y.id==id})[0];
  if(a=='tog'){S.open[id]=!S.open[id];if(S.open[id]&&S.TL[id]==null)S.TL[id]=null;paint();if(S.open[id])tail(id)}
  else if(a=='log'&&x)openLog(x);
  else if(a=='stop')stop(id,el)},true);
})();
