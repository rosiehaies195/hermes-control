/* Вариант А «Входящие + список»: сверху общий блок вопросов из всех проектов, ниже плоский список проектов с фильтром по приложению. */
function inboxA(){var L=proj8(),R=[];L.forEach(function(p){p.q.forEach(function(q){R.push({p:p,q:q})})});R.sort(function(a,b){return b.q.ts-a.q.ts});
 if(!R.length)return '';var more=!U.ibAll&&R.length>3,sh=more?R.slice(0,3):R;
 return '<div class="sec" style="margin-top:6px"><div class="sh"><span>Входящие · '+R.length+'</span><span class="sum">из '+new Set(R.map(function(x){return x.p.id})).size+' проектов</span></div></div>'+
  sh.map(function(it){var q=it.q,p=it.p;return '<div class="alert '+(p.apps[0]=='codex'?'codex':'')+'" style="margin:8px 16px 0"><div class="k">'+AB8(p,'s8')+' <b class="pn8">'+esc(p.n)+'</b>'+(p.ms?' <span class="pm8">'+esc(p.ms)+'</span>':'')+'<span class="tm">'+ago(q.ts)+'</span></div><div class="q">'+esc(q.q)+'</div>'+qChips8(p,q)+'</div>'}).join('')+
  (more?'<div class="more8" data-a="ibmore">Ещё '+(R.length-3)+' ›</div>':'')}
function filtA(){var L=proj8(),all=['all'].concat(APPS8);
 return '<div class="chips g f8">'+all.map(function(a){var V=L.filter(function(p){return a=='all'||inProj8(p,a)}),w=V.filter(waiting8).length;
  return '<span data-a="pf" data-x="'+a+'" class="'+((U.pf||'all')==a?'on':'')+'">'+(a=='all'?'':AB1(a,'xs8'))+(a=='all'?'Все':ANM8[a])+' <i>'+V.length+'</i>'+(w?'<u></u>':'')+'</span>'}).join('')+'</div>'}
function rowA(p){var open=U.pe==p.id;
 return '<div class="row tap p8 '+p.st+(open?' open':'')+'" data-a="pe" data-x="'+p.id+'"><div style="display:flex;align-items:center;gap:11px;width:100%">'+AB8(p,'m8')+'<div class="t"><div class="n" style="font-size:14.5px">'+nm8(p)+'</div><div class="d">'+esc(p.sub)+'</div></div>'+qb8(p)+pill8(p)+'</div>'+prog8(p)+'</div>'+(open?'<div class="pd8">'+pdetail8(p)+'</div>':'')}
function listA(){var L=proj8(),f=U.pf||'all',V=L.filter(function(p){return f=='all'||inProj8(p,f)});U.pg=U.pg||{idle:true};
 var need=V.filter(waiting8),work=V.filter(function(p){return p.st=='work'}),idle=V.filter(function(p){return p.st=='idle'});
 function grp(t,arr,k,sm){if(!arr.length)return '';var shut=U.pg[k];return '<div class="sec"><div class="sh col'+(shut?' shut':'')+'" data-a="pg" data-x="'+k+'"><span>'+t+' · '+arr.length+'</span>'+(sm?'<span class="sum">'+sm+'</span>':'')+'</div>'+(shut?'':'<div class="grp">'+arr.map(rowA).join('')+'</div>')+'</div>'}
 return grp('Требуют тебя',need,'need','')+grp('Работают',work,'work','')+grp('Свободны',idle,'idle',idle.map(function(p){return p.n}).join(', '))||'<div class="empty">В этом приложении пока нет проектов</div>'}
function homeA(){return hd()+updBanner()+netBanner()+demobar8()+sum8()+inboxA()+'<div class="sec" style="margin-top:14px"><div class="sh"><span>Проекты</span><a data-a="d8" data-x="add">+ добавить</a></div></div>'+filtA()+listA()+common8()}
var _h0=home;home=function(){return homeA()};
