/* s5-cxq (этап 5, п.3): очередь Codex Desktop в чате панели — видно, что ждёт, и можно убрать.
   Источник — /api/hc/cxq (queue_1.sqlite Codex), удаление — POST /api/hc/cxq/delete (thread/queue/delete).
   Своё ждущее сообщение (отправлено из панели, подпись «В очереди») получает «Убрать» прямо в подписи;
   поставленные на ПК — блоком «В очереди Codex» в конце ленты. Опрос раз в 4 с, пока что-то ждёт или идёт ход, иначе раз в 20 с. */
(function(){var W=window,D=document;
 var Q={tid:'',L:[],t:0,busy:0,j:''};W.S5Q=Q;
 function st(){return W.HC&&HC.st}
 function E(t){var d=D.createElement('div');d.textContent=t==null?'':t;return d.innerHTML}
 function nrm(t){return String(t||'').replace(/\s+/g,' ').trim()}
 function on(){var s=st();return !!(s&&W.U&&U.tab=='hc'&&s.view=='chat'&&s.kind=='codex'&&!s.rw&&s.sid)}
 function mineL(s){return (s.lp||[]).filter(function(p){return p.sid==s.sid})}
 function match(t){var n=nrm(t);if(!n)return null;return Q.L.filter(function(x){return nrm(x.t)==n})[0]||null}
 Q.html=function(s){if(!on()||Q.tid!=s.sid)return '';var M=mineL(s).map(function(p){return nrm(p.t)});
  /*vb8-b6: своё сообщение уже стоит пузырём в ленте (новый чат: Codex ещё 2–4 с держит его в очереди) — не дублировать блоком «В очереди»*/
  (s.msgs||[]).slice(-6).forEach(function(b){if(b&&b.k=='u'&&b.t)M.push(nrm(b.t))});
  var L=Q.L.filter(function(x){return M.indexOf(nrm(x.t))<0});if(!L.length)return '';
  return '<div class="s5q"><div class="s5qh">В очереди Codex · '+L.length+'</div>'+L.map(function(x){
   return '<div class="s5qr"><span>'+E(x.t||(x.im?'Фото':'Сообщение'))+'</span><i data-s5q="del" data-id="'+E(x.id)+'" role="button">Убрать</i></div>'}).join('')+'</div>'};
 function wrap(){if(!W.HC||!HC.dlHtml||HC.dlHtml.__s5q)return;var f=HC.dlHtml;
  HC.dlHtml=function(b){var h=f(b);if(b&&b.dl=='queued'&&on()){var x=match(b.t);if(x)h='<div class="s5dl">В очереди Codex · <i class="s5qx" data-s5q="del" data-id="'+E(x.id)+'" role="button">Убрать</i></div>'}return h};HC.dlHtml.__s5q=1}
 function paint(){try{HC.paint()}catch(e){}}
 function load(){var s=st();if(!on()||Q.busy||!W.SD3)return;var tid=s.sid;Q.busy=1;
  SD3.api('/cxq?tid='+encodeURIComponent(tid)).then(function(d){Q.busy=0;Q.t=Date.now();if(st().sid!=tid)return;var L=d.q||[],j=JSON.stringify(L);
   if(Q.tid!=tid||Q.j!=j){Q.tid=tid;Q.L=L;Q.j=j;paint()}}).catch(function(){Q.busy=0;Q.t=Date.now()})}
 function tick(){wrap();if(!on())return;var s=st();if(Q.tid!=s.sid){Q.L=[];Q.j='';Q.t=0}
  var hot=Q.L.length||mineL(s).some(function(p){return p.st=='queued'||p.st=='wait'})||!!s.cclive||!!(s.dsq&&s.dsq[s.sid]);
  if(Date.now()-Q.t>(hot?4000:20000))load()}
 setInterval(tick,1000);
 function del(id,el){var s=st(),tid=s&&s.sid;if(!tid||!id)return;var x=Q.L.filter(function(y){return y.id==id})[0];if(el)el.textContent='Убираю…';
  SD3.api('/cxq/delete',{method:'POST',body:{tid:tid,id:id}}).then(function(r){Q.L=Q.L.filter(function(y){return y.id!=id});Q.j=JSON.stringify(Q.L);
   if(x){var n=nrm(x.t);s.lp=(s.lp||[]).filter(function(p){return !(p.sid==tid&&nrm(p.t)==n)});try{s.msgs=HC.fromHistory([],s.msgs)}catch(e){}}
   W.toast&&toast(r&&r.deleted===false?'Codex уже взял сообщение в работу':'Убрано из очереди Codex');paint();Q.t=0})
  .catch(function(e){W.toast&&toast(/уже взял/.test(e.message)?'Codex уже взял сообщение в работу':'Не убрал: '+E(e.message));Q.t=0;paint()})}
 D.addEventListener('click',function(ev){var el=ev.target.closest&&ev.target.closest('[data-s5q]');if(!el)return;ev.stopPropagation();ev.preventDefault();
  if(el.dataset.s5q=='del')del(el.dataset.id,el)},true);
})();
