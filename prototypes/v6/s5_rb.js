/* s5-rb (этап 5, п.5): откат файлов к моменту до сообщения — только родными элементами приложения.
   Под ходом, в котором агент менял файлы, строка как «Работал N с ›» (ChatGPT: .g3wk) / «◷ N шагов ›» (Claude: .clwk)
   со значком ↺: «Изменено 2 файла · +14 −3 ›». Тап — раскрытие на месте списком файлов (.g3tl/.g3to, .cltl/.clto)
   и строкой «Вернуть как было до этого сообщения».
   Подтверждение: ChatGPT (Hermes) — меню-подтверждение как «Удалить чат?» (.g3pop: .g3mh вопрос, .g3mi.bad действие, Отмена);
   Claude — лист Claude (#clsh, как «Добавить в сессию»): файлы группой .clgrp/.clsr, действие красной строкой, ✕ = отмена.
   Переписку откат не трогает. Codex — не рисуем (хранимых снимков нет). Источник /api/hc/rb (tv_rb.py). */
(function(){var W=window,D=document,B=D.body;
 var S={k:'',sid:'',P:[],on:false,t:0,busy:0,open:{},j:''};W.S5R=S;
 function st(){return W.HC&&HC.st}
 function E(t){var d=D.createElement('div');d.textContent=t==null?'':t;return d.innerHTML}
 function T(m){try{toast(m)}catch(e){}}
 function $i(id){return D.getElementById(id)}
 function gi(n){try{return G3.ic(n)}catch(e){return ''}}
 function ci(n){try{return CL3.ic(n)}catch(e){return ''}}
 function on(){var s=st();return !!(s&&W.U&&U.tab=='hc'&&s.view=='chat'&&s.sid&&/^(claude|hermes)$/.test(s.kind)&&!(W.S5D&&S5D.ro&&S5D.ro()))}
 function files(n){var m=n%10,c=n%100;return n+' '+(m==1&&c!=11?'файл':m>=2&&m<=4&&(c<12||c>14)?'файла':'файлов')}
 function changed(n){var m=n%10,c=n%100;return (m==1&&c!=11?'Изменён ':'Изменено ')+files(n)}
 function pm(a,d){return '<span class="s5ra">+'+a+'</span> <span class="s5rd">−'+d+'</span>'}
 function base(p){var x=String(p||'').split('/');return x[x.length-1]||p}
 /* точка относится к ходу, если её время между сообщением пользователя и последним ответом хода */
 function pointOf(t){if(!t||!t.a||!t.a.length)return null;var a=t.ts0||0,z=(t.a[t.a.length-1].ts||a)+5;
  for(var i=S.P.length-1;i>=0;i--){var p=S.P[i];if(p.ts>=a-5&&p.ts<=z)return p}return null}
 S.html=function(s,t,lv){if(lv||!on()||S.sid!=s.sid||S.k!=s.kind||!S.P.length)return '';var p=pointOf(t);if(!p)return '';
  var cl=s.kind=='claude',A=0,Dd=0;p.files.forEach(function(f){A+=f.a;Dd+=f.d});var o=!!S.open[p.id];
  var tl='<span class="s5rt">'+changed(p.files.length)+' · '+pm(A,Dd)+'</span>';
  var row=cl?'<div class="clwk s5rr'+(o?' on':'')+'" data-s5r="tog" data-id="'+E(p.id)+'">'+ci('retry')+tl+ci('chev')+'</div>'
            :'<div class="g3wk s5rr'+(o?' on':'')+'" data-s5r="tog" data-id="'+E(p.id)+'">'+tl+gi('chev')+'</div>';
  if(!o)return row;var to=cl?'clto':'g3to';
  var L=p.files.slice(0,12).map(function(f){return '<div class="'+to+' s5rf"><b>'+E(base(f.p))+'</b> <span>'+E(f.p!=base(f.p)?f.p:'')+'</span><i>'+pm(f.a,f.d)+'</i></div>'}).join('')+
   (p.files.length>12?'<div class="'+to+'">и ещё '+(p.files.length-12)+'</div>':'')+
   '<div class="'+to+' s5a bad" data-s5r="ask" data-id="'+E(p.id)+'">Вернуть как было до этого сообщения</div>';
  return row+'<div class="'+(cl?'cltl':'g3tl')+' s5rl">'+L+'</div>'};
 function paint(){try{HC.paint()}catch(e){}var k=(st()||{}).kind;try{if(k=='claude'&&W.CL3&&CL3.draw)CL3.draw();else if(W.G3&&G3.draw)G3.draw()}catch(e){}}
 function load(force){var s=st();if(!on()){S.sid='';return}
  var key=s.kind+':'+s.sid;if(key!=S.k+':'+S.sid){S.k=s.kind;S.sid=s.sid;S.P=[];S.open={};S.j='';S.t=0}
  var busyChat=!!(s.busy||s.cclive||(s.cur&&s.cur.live));
  var per=S.k=='hermes'?30000:15000;if(!force&&Date.now()-S.t<per&&!(S.wasBusy&&!busyChat))return;S.wasBusy=busyChat;
  if(S.busy||!W.API)return;S.busy=1;S.t=Date.now();
  try{SD3.api('/rb?k='+S.k+'&sid='+encodeURIComponent(S.sid)).then(function(d){S.busy=0;if(st().sid!=S.sid)return;S.P=(d.p||[]);S.on=!!d.on;var j=JSON.stringify(S.P);if(j!=S.j){S.j=j;paint()}})
   .catch(function(){S.busy=0})}catch(e){S.busy=0}}
 setInterval(function(){try{load()}catch(e){S.busy=0}},2000);
 function find(id){return S.P.filter(function(p){return p.id==id})[0]}
 /* ---------- подтверждение ---------- */
 function sum(F){var a=0,d=0;F.forEach(function(f){a+=f.a;d+=f.d});return {a:a,d:d}}
 function later(p,F){return F.length>p.files.length||F.some(function(f){return !p.files.some(function(x){return x.p==f.p})})}
 function gConfirm(p,d){try{G3.closePop()}catch(e){}var F=d.files||[];
  var v=D.createElement('div');v.id='g3veil';B.appendChild(v);var x=D.createElement('div');x.id='g3pop';x.className='g3pop s5rpop';
  x.innerHTML='<div class="g3mh s5rq">'+(F.length?'Вернуть '+files(F.length)+' как было до этого сообщения?'+(later(p,F)?' Изменения следующих ходов тоже отменятся.':'')+' Переписка не изменится.':'Файлы уже такие, как до этого сообщения.')+'</div>'+
   (F.length?'<div class="g3mi bad" data-s5r="go" data-id="'+E(p.id)+'">'+gi('retry')+'<span>Вернуть файлы</span></div>':'')+
   '<div class="g3mi" data-s5r="x">'+gi('x')+'<span>Отмена</span></div>';
  B.appendChild(x);if(x.animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches)x.animate([{transform:'scale(.6,.5)',opacity:.4},{transform:'none',opacity:1}],{duration:400,easing:'cubic-bezier(.32,.72,0,1)'});
  v.addEventListener('click',function(){try{G3.closePop()}catch(e){}})}
 function cConfirm(p,d){try{CL3.sheetClose()}catch(e){}var F=d.files||[];
  var v=D.createElement('div');v.id='clsv';B.appendChild(v);var sh=D.createElement('div');sh.id='clsh';sh.className='clsh s5csh s5rsh';
  var rows=F.slice(0,20).map(function(f){return '<div class="clsr s5rf"><span>'+E(base(f.p))+'</span><em>'+(f.st=='del'?'удалится':f.st=='new'?'появится':pm(f.a,f.d))+'</em></div>'}).join('');
  sh.innerHTML='<div class="clgrab"></div><div class="clshh"><div class="clqx" data-cl="shx" role="button" aria-label="Закрыть">'+ci('x')+'</div><b>Вернуть файлы</b><label></label></div><div class="s5cb">'+
   '<div class="s5cap">'+(F.length?'Файлы вернутся к тому, какими были до этого сообщения'+(later(p,F)?', вместе с изменениями следующих ходов':'')+'. Переписка не изменится.':'Файлы уже такие, как до этого сообщения.')+'</div>'+
   (F.length?'<div class="clgrp">'+rows+(F.length>20?'<div class="clsr"><span>и ещё '+(F.length-20)+'</span></div>':'')+'</div>'+
   '<div class="s5rgo" data-s5r="go" data-id="'+E(p.id)+'" role="button">'+ci('retry')+'<span>Вернуть '+files(F.length)+'</span></div>':'')+'</div>';
  B.appendChild(sh);if(sh.animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches)sh.animate([{transform:'translateY(105%)'},{transform:'none'}],{duration:500,easing:'cubic-bezier(.32,.72,0,1)'});
  v.addEventListener('click',function(){try{CL3.sheetClose()}catch(e){}})}
 function ask(el){var p=find(el.dataset.id),s=st();if(!p||el.dataset.busy)return;el.dataset.busy=1;var t0=el.textContent;el.textContent='Проверяю…';
  SD3.api('/rb/diff?k='+S.k+'&sid='+encodeURIComponent(S.sid)+'&id='+encodeURIComponent(p.id)).then(function(d){delete el.dataset.busy;el.textContent=t0;
    if(st().sid!=S.sid)return;(s.kind=='claude'?cConfirm:gConfirm)(p,d)})
   .catch(function(e){delete el.dataset.busy;el.textContent=t0;T('Не проверил файлы: '+E(e.message))})}
 function go(el){var p=find(el.dataset.id);if(!p||el.dataset.busy)return;el.dataset.busy=1;var sp=el.querySelector('span');if(sp)sp.textContent='Возвращаю…';
  SD3.api('/rb/restore',{method:'POST',body:{k:S.k,sid:S.sid,id:p.id}}).then(function(r){try{G3.closePop()}catch(e){}try{CL3.sheetClose()}catch(e){}
    T(r.ok?'Файлы возвращены · '+files(r.n||0):'Вернул '+files(r.n||0)+', не вышло: '+(r.bad||[]).length);S.open={};load(true)})
   .catch(function(e){delete el.dataset.busy;if(sp)sp.textContent='Вернуть файлы';T(E(e.message))})}
 D.addEventListener('click',function(ev){var el=ev.target.closest&&ev.target.closest('[data-s5r]');if(!el)return;ev.stopPropagation();ev.preventDefault();var a=el.dataset.s5r;
  if(a=='tog'){S.open[el.dataset.id]=!S.open[el.dataset.id];paint()}
  else if(a=='ask')ask(el);
  else if(a=='go')go(el);
  else if(a=='x'){try{G3.closePop()}catch(e){}}},true);
})();
