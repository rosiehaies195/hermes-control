/* v8: общее для трёх прототипов «Проекты»: демо-данные, значки приложений, ответы на вопросы, раскрытие проекта.
   Проект первичен, у него один или несколько приложений (apps). Настоящий проект один (tv-miniapp), остальные демо. */
var P8=null;
function demo8(){var n=Math.floor(Date.now()/1000);function Q(id,t,o,od,rec,perm,ago){return {id:id,q:t,o:o,od:od,rec:rec,perm:!!perm,ts:n-ago}}
 return [
 {id:'p2',n:'kivi-gateway',apps:['claude','hermes'],st:'wait',ms:'GW-M3',done:4,total:8,sub:'шаг GW3b · ждёт ответа',tok:2.1,last:n-300,q:[Q('d1','Какую ветку брать за основу для следующего шага?',['master','kivi (Recommended)','Новая ветка от master'],['стабильная','форк','чистый старт'],1,0,420),Q('d2','Разрешить запуск npm install?',['Allow','Deny'],['',''],-1,1,90)]},
 {id:'p5',n:'mobile-app',apps:['codex'],st:'wait',ms:'MB-M1',done:2,total:6,sub:'шаг MB2 · ждёт разрешения',tok:0.9,last:n-200,q:[Q('d3','Применить миграцию к тестовой базе?',['Allow','Deny'],['',''],-1,1,200)]},
 {id:'p6',n:'data-pipeline',apps:['codex'],st:'bad',ms:'DP-M2',done:7,total:9,sub:'сбой: не отвечает окно Codex',tok:0.4,last:n-5400,q:[]},
 {id:'p1',n:'tv-miniapp',apps:['claude'],st:'work',ms:'PC-M2',done:5,total:9,sub:'шаг PC2b идёт 38 мин',tok:1.6,last:n-60,q:[],real:1},
 {id:'p4',n:'api-refactor',apps:['codex'],st:'work',ms:'AR-M1',done:3,total:7,sub:'шаг AR3a идёт 12 мин',tok:1.1,last:n-90,q:[]},
 {id:'p7',n:'hermes-brain',apps:['hermes'],st:'work',ms:'',done:0,total:0,sub:'куратор: перенос итогов дня',tok:0.3,last:n-30,q:[]},
 {id:'p8',n:'research-bot',apps:['hermes'],st:'work',ms:'RB-M1',done:6,total:10,sub:'шаг RB6 идёт 5 мин',tok:0.8,last:n-45,q:[]},
 {id:'p3',n:'docs-site',apps:['claude'],st:'idle',ms:'DS-M1',done:8,total:8,sub:'веха закрыта · ждёт плана',tok:0,last:n-86400,q:[]},
 {id:'p9',n:'newsletter',apps:['hermes'],st:'idle',ms:'',done:0,total:0,sub:'пауза до 09:00',tok:0,last:n-40000,q:[]}]}
function proj8(){if(P8)return P8;var L=demo8(),r=S.proj;
 if(r&&r.total){var me=L.filter(function(x){return x.real})[0];me.ms=r.ms;me.done=r.done;me.total=r.total}
 P8=L;return L}
var ST8={wait:['Ждёт тебя','wait'],bad:['Сбой','bad'],work:['Работает','ok'],idle:['Свободен','']};
var APPS8=['claude','codex','hermes'],ANM8={claude:'Claude',codex:'Codex',hermes:'Hermes'};
function AB1(app,c){return app=='hermes'?'<span class="ag hermes '+(c||'')+'"></span>':'<span class="ag '+app+' '+(c||'')+'">'+LG(app)+'</span>'}
function AB8(p,c){return '<span class="abs8">'+p.apps.map(function(a){return AB1(a,c)}).join('')+'</span>'}
function inProj8(p,app){return p.apps.indexOf(app)>=0}
function waiting8(p){return p.st=='wait'||p.st=='bad'}
function qChips8(p,q){var perm=q.perm;
 return perm?'<div class="chips"><span data-a="quick" data-q="'+q.id+'" data-x="0" data-p8="'+p.id+'" style="border-color:var(--ok)">'+IC('check')+' '+esc(q.o[0])+'</span><span data-a="quick" data-q="'+q.id+'" data-x="1" data-p8="'+p.id+'" style="border-color:var(--bad)">'+IC('x')+' '+esc(q.o[1])+'</span></div>':
  '<div class="chips">'+q.o.map(function(o,i){return '<span class="'+(i===q.rec?'rec':'')+'" data-a="quick" data-q="'+q.id+'" data-x="'+i+'" data-p8="'+p.id+'">'+esc(o)+'</span>'}).join('')+'</div>'}
function sum8(){var L=proj8(),w=L.filter(function(p){return p.st=='work'}).length,n=L.filter(function(p){return p.st=='wait'}).length,b=L.filter(function(p){return p.st=='bad'}).length;
 return '<div class="sum8"><b>'+L.length+'</b> проектов · <span class="ok8">'+w+' работают</span> · <span class="wait8">'+n+' ждут тебя</span>'+(b?' · <span class="bad8">'+b+' сбой</span>':'')+'</div>'}
function demobar8(){return '<div class="demo8bar">Демо: настоящий здесь только tv-miniapp, остальные проекты придуманы, чтобы показать экран с девятью проектами</div>'}
function common8(){return '<div class="sec" style="margin-top:18px"><div class="sh"><span>Общее</span></div></div>'+tokens()+(S.tok14&&S.tok14.sum?colSec('tok14','Токены · 14 дней',tok14(),(S.tok14.sum/1000).toFixed(1)+' млн'):'')+autoGrp()+feed()+hermesCard()}
function pdetail8(p){return '<div class="stats"><div><b>'+(p.total?p.done+'/'+p.total:'—')+'</b>'+(p.ms?esc(p.ms):'задач')+'</div><div><b>'+p.tok.toFixed(1)+'</b>млн ток.</div><div><b>'+ago(p.last).replace(' назад','')+'</b>активность</div><div><b>'+p.apps.map(function(a){return ANM8[a]}).join(' + ')+'</b>'+(p.apps.length>1?'приложения':'приложение')+'</div></div>'+
  '<div class="acts8"><div class="btn sm" data-a="d8" data-x="start">'+IC('play')+' Start</div><div class="btn sm" data-a="d8" data-x="say">'+IC('pencil')+' Написать</div><div class="btn sm" data-a="d8" data-x="pause">'+IC('pause')+' Пауза</div><div class="btn sm pri" data-a="d8" data-x="open">Открыть ›</div></div>'}
function prog8(p,m){return p.total&&p.st!='idle'?'<div class="prog" style="margin-top:'+(m||9)+'px"><i style="width:'+Math.max(2,Math.round(p.done/p.total*100))+'%"></i></div>':''}
function pill8(p){var s=ST8[p.st];return '<span class="pill '+s[1]+'">'+s[0]+'</span>'}
function qb8(p){return p.q.length?'<span class="qb8">'+p.q.length+'</span>':''}
function demoTag8(p){return p.real?'':'<span class="demo8">демо</span>'}
function nm8(p){return '<span class="nm8">'+esc(p.n)+'</span>'+demoTag8(p)}

var DM8={start:'Start нажат бы в выбранном проекте',say:'Откроется шторка «Написать» для этого проекта',pause:'Пауза только этого проекта, остальные продолжают',open:'Откроется страница проекта: веха, шаги, коммиты, чат',add:'Здесь будет мастер: выбрать приложение, папку или сессию и веху'};
document.addEventListener('click',function(ev){var el=ev.target.closest('[data-a=pf],[data-a=pe],[data-a=pg],[data-a=ibmore],[data-a=d8],[data-a=tab8],[data-a=pc],[data-p8]');if(!el)return;
 var a=el.dataset.a,x=el.dataset.x;
 if(a=='quick'&&el.dataset.p8){ev.stopPropagation();ev.preventDefault();haptic('success');
  var p=proj8().filter(function(z){return z.id==el.dataset.p8})[0],qi=-1;p.q.forEach(function(q,i){if(q.id==el.dataset.q)qi=i});
  if(qi>=0){var q=p.q[qi];p.q.splice(qi,1);if(!p.q.length&&p.st=='wait'){p.st='work';p.sub='шаг продолжен'}toast('<b>'+IC('check')+'</b> Демо: ответ «'+esc(q.o[+el.dataset.x]||'')+'» ушёл бы в '+ANM8[p.apps[0]]+' ('+esc(p.n)+')')}
  if(window.sheetOpen8){unsheet();window.sheetOpen8=null}
  render(true);return}
 if(a=='quick')return;
 ev.stopPropagation();ev.preventDefault();haptic('sel');
 if(a=='pf'){U.pf=x;U.pe=null}
 else if(a=='tab8'){U.t8=x;U.pe=null}
 else if(a=='pe'){U.pe=U.pe==x?null:x}
 else if(a=='pg'){U.pg=U.pg||{};U.pg[x]=!U.pg[x]}
 else if(a=='ibmore'){U.ibAll=true}
 else if(a=='pc'){var pp=proj8().filter(function(z){return z.id==x})[0];window.sheetOpen8=1;sheet('<h3>'+esc(pp.n)+'</h3><p>'+esc(pp.sub)+'</p>'+(pp.q.length?pp.q.map(function(q){return '<div style="margin:10px 0 6px;font-size:14px">'+esc(q.q)+'</div>'+qChips8(pp,q)}).join(''):'')+pdetail8(pp)+'<div class="btn" data-a="unsheet" style="margin-top:12px">Закрыть</div>');return}
 else if(a=='d8'){toast(DM8[x]||'Демо');return}
 render(true)},true);
/* демо: не показывать «всё остановлено» из боевого состояния, чтобы экран выглядел живым */
var _norm8=norm;norm=function(){_norm8();S.stopped=false;S.clicker.on=true;S.fails=0;S.pause=0;S.health.forEach(function(h){h.ok=1})};
dirty=function(){return false};
