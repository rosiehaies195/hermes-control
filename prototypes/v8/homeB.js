/* Вариант Б «Вкладки по приложениям»: Claude / Codex / Hermes как три рабочих пространства. Общего списка нет:
   внутри вкладки её проекты, вопросы отвечаются прямо в строке проекта. На вкладках красные счётчики того, что ждёт тебя. */
function tabsB(){var cur=U.t8||'claude';
 return '<div class="tabs8">'+APPS8.map(function(a){var V=proj8().filter(function(p){return inProj8(p,a)}),w=V.reduce(function(s,p){return s+p.q.length+(p.st=='bad'?1:0)},0);
  return '<div data-a="tab8" data-x="'+a+'" class="'+(cur==a?'on':'')+'">'+AB1(a,'xs8')+'<span>'+ANM8[a]+'</span><small>'+V.length+(V.length==1?' проект':V.length<5?' проекта':' проектов')+'</small>'+(w?'<b class="tb8">'+w+'</b>':'')+'</div>'}).join('')+'</div>'}
function elsewhereB(){var cur=U.t8||'claude',R=[];APPS8.forEach(function(a){if(a==cur)return;var n=proj8().filter(function(p){return inProj8(p,a)&&!inProj8(p,cur)}).reduce(function(s,p){return s+p.q.length+(p.st=='bad'?1:0)},0);if(n)R.push('<span data-a="tab8" data-x="'+a+'">'+AB1(a,'xs8')+ANM8[a]+': <b>'+n+'</b> ждут тебя ›</span>')});
 return R.length?'<div class="else8">'+R.join('')+'</div>':''}
function rowB(p){var open=U.pe==p.id,q=p.q[0];
 var r='<div class="row tap p8 '+p.st+(open?' open':'')+'" data-a="pe" data-x="'+p.id+'"><div style="display:flex;align-items:center;gap:11px;width:100%"><div class="t"><div class="n" style="font-size:14.5px">'+nm8(p)+(p.apps.length>1?'<span class="multi8">+ '+p.apps.filter(function(a){return a!=(U.t8||'claude')}).map(function(a){return ANM8[a]}).join(', ')+'</span>':'')+'</div><div class="d">'+esc(p.sub)+'</div></div>'+qb8(p)+pill8(p)+'</div>'+prog8(p)+'</div>';
 if(q&&!open)r+='<div class="inl8"><div class="q">'+esc(q.q)+'</div>'+qChips8(p,q)+(p.q.length>1?'<div class="d" style="margin-top:6px">ещё вопросов в проекте: '+(p.q.length-1)+'</div>':'')+'</div>';
 if(open)r+='<div class="pd8">'+p.q.map(function(z){return '<div class="q" style="margin:8px 0 6px;font-size:14px">'+esc(z.q)+'</div>'+qChips8(p,z)}).join('')+pdetail8(p)+'</div>';
 return r}
function listB(){var cur=U.t8||'claude',V=proj8().filter(function(p){return inProj8(p,cur)}),h='';
 var need=V.filter(waiting8),work=V.filter(function(p){return p.st=='work'}),idle=V.filter(function(p){return p.st=='idle'});U.pg=U.pg||{idle:true};
 function grp(t,arr,k,sm){if(!arr.length)return '';var shut=U.pg[k];return '<div class="sec"><div class="sh col'+(shut?' shut':'')+'" data-a="pg" data-x="'+k+'"><span>'+t+' · '+arr.length+'</span>'+(sm?'<span class="sum">'+sm+'</span>':'')+'</div>'+(shut?'':'<div class="grp">'+arr.map(rowB).join('')+'</div>')+'</div>'}
 return grp('Требуют тебя',need,'need','')+grp('Работают',work,'work','')+grp('Свободны',idle,'idle',idle.map(function(p){return p.n}).join(', '))}
function homeB(){var cur=U.t8||'claude';
 return hd()+updBanner()+netBanner()+demobar8()+tabsB()+elsewhereB()+'<div class="sec" style="margin-top:10px"><div class="sh"><span>Проекты в '+ANM8[cur]+'</span><a data-a="d8" data-x="add">+ добавить</a></div></div>'+listB()+common8()}
var _h0=home;home=function(){return homeB()};
