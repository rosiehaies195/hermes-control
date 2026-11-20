/* Вариант А2 «Входящие + список», спокойная версия. Правила:
   1) статус говорит ТОЛЬКО группа (заголовок) + цветная точка; нет плашек, полос слева и дублей;
   2) строка проекта: значок приложения, имя, одна строка подписи, справа «5/9» (или красный счётчик вопросов);
   3) «Входящие» одной карточкой со списком, вопрос = текст в 2 строки + компактные кнопки;
   4) фильтр = сегмент из 4 кнопок, без точек; сводка уехала в заголовок;
   5) всё общее (токены, автоматика, лента) в ОДНОМ свёрнутом блоке «Ещё». */
function inboxA2(){var L=proj8(),R=[];L.forEach(function(p){p.q.forEach(function(q){R.push({p:p,q:q})})});R.sort(function(a,b){return b.q.ts-a.q.ts});
 if(!R.length)return '';var lim=U.ibAll?99:2,sh=R.slice(0,lim);
 return '<div class="sec"><div class="sh"><span>Нужен ты</span><span class="sum">'+R.length+' '+(R.length==1?'вопрос':R.length<5?'вопроса':'вопросов')+'</span></div><div class="grp ib2">'+
  sh.map(function(it){var q=it.q,p=it.p;return '<div class="qi2"><div class="qh2">'+AB8(p,'s8')+'<b>'+esc(p.n)+'</b><span class="tm2">'+ago(q.ts).replace(' назад','')+'</span></div><div class="qt2">'+esc(q.q)+'</div>'+qChips8(p,q)+'</div>'}).join('')+
  (R.length>lim?'<div class="mo2" data-a="ibmore">Показать ещё '+(R.length-lim)+'</div>':'')+'</div></div>'}
function filtA2(){var L=proj8(),all=['all'].concat(APPS8);
 return '<div class="seg2">'+all.map(function(a){var n=L.filter(function(p){return a=='all'||inProj8(p,a)}).length;
  return '<span data-a="pf" data-x="'+a+'" class="'+((U.pf||'all')==a?'on':'')+'">'+(a=='all'?'Все':AB1(a,'xs8')+ANM8[a])+'<i>'+n+'</i></span>'}).join('')+'</div>'}
function rowA2(p){var open=U.pe==p.id,dot=p.st=='wait'?'wait':p.st=='bad'?'bad':p.st=='work'?'ok':'';
 var right=p.q.length?'<span class="qb8">'+p.q.length+'</span>':p.st=='bad'?'<span class="bd2">сбой</span>':p.total?'<span class="fr2">'+p.done+'/'+p.total+'</span>':'';
 return '<div class="row2 '+(open?'open':'')+'" data-a="pe" data-x="'+p.id+'">'+AB8(p,'m8')+'<div class="t2"><div class="n2"><span class="dot '+dot+'"></span><span class="nm2">'+esc(p.n)+'</span>'+(p.real?'':'<span class="demo8">демо</span>')+'</div><div class="d2">'+(p.q.length&&!open?esc(p.q[0].q):esc(p.sub))+'</div></div>'+right+'</div>'+
  (open?detA2(p):'')}
function detA2(p){var q=p.q.map(function(z){return '<div class="dq2"><div class="dl2">Вопрос агента · '+ago(z.ts).replace(' назад','')+'</div><div class="qt2 full">'+esc(z.q)+'</div>'+qChips8(p,z)+'</div>'}).join('');
 var meta=[p.ms?'веха '+esc(p.ms):'',p.total?p.done+' из '+p.total+' задач':'',p.tok.toFixed(1)+' млн ток.',ago(p.last).replace(' назад','')+' назад',p.apps.map(function(a){return ANM8[a]}).join(' + ')].filter(Boolean).join(' · ');
 return '<div class="pd2">'+q+'<div class="mt2">'+meta+'</div>'+(p.total?'<div class="prog" style="margin-top:8px"><i style="width:'+Math.round(p.done/p.total*100)+'%"></i></div>':'')+'<div class="ac2"><div data-a="d8" data-x="start">'+IC('play')+'Start</div><div data-a="d8" data-x="say">'+IC('pencil')+'Написать</div><div data-a="d8" data-x="pause">'+IC('pause')+'Пауза</div><div class="pri" data-a="d8" data-x="open">Открыть</div></div></div>'}
function listA2(){var L=proj8(),f=U.pf||'all',V=L.filter(function(p){return f=='all'||inProj8(p,f)});if(!U.pg)U.pg={};if(!('idle' in U.pg))U.pg.idle=true;
 var need=V.filter(waiting8),work=V.filter(function(p){return p.st=='work'}),idle=V.filter(function(p){return p.st=='idle'});
 function grp(t,arr,k,sm){if(!arr.length)return '';var shut=U.pg[k];return '<div class="sec g2"><div class="sh col'+(shut?' shut':'')+'" data-a="pg" data-x="'+k+'"><span>'+t+' · '+arr.length+'</span>'+(shut&&sm?'<span class="sum">'+sm+'</span>':'')+'</div>'+(shut?'':'<div class="grp">'+arr.map(rowA2).join('')+'</div>')+'</div>'}
 return grp('Требуют тебя',need,'need','')+grp('Работают',work,'work','')+grp('Свободны',idle,'idle',idle.map(function(p){return p.n}).join(', '))||'<div class="empty">В этом приложении пока нет проектов</div>'}
function moreA2(){if(U.col.more8===undefined)U.col.more8=true;var shut=U.col.more8;
 return '<div class="sec g2" style="margin-top:6px"><div class="sh col'+(shut?' shut':'')+'" data-a="col" data-x="more8"><span>Ещё</span><span class="sum">токены, автоматика, лента</span></div>'+(shut?'':'<div class="more2">'+tokens().replace(/ shut/,'')+(S.tok14&&S.tok14.sum?colSec('tok14','Токены · 14 дней',tok14(),''):'')+autoGrp()+feed()+'</div>')+'</div>'}
function homeA2(){['tok','tok14','auto','feed','strip','path'].forEach(function(k){if(U.col[k]===undefined)U.col[k]=true});
 return hd()+updBanner()+netBanner()+'<div class="demo2">Демо: настоящий только tv-miniapp</div>'+inboxA2()+
  '<div class="ph2"><h2>Проекты</h2><span class="cnt2">'+proj8().length+'</span><span class="add2" data-a="d8" data-x="add">'+IC('plus')+'Добавить</span></div>'+filtA2()+listA2()+moreA2()}
var _h2=home;home=function(){return homeA2()};
