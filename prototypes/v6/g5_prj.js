/* g5 «Проекты» — доводка по форме (runbook panel-gpt, gpt18-g5). Эталон: Claude iOS «Code» (список сессий:
   серые заголовки групп, строки с подписью в одну линию, фильтр по статусу) + ChatGPT Settings (карточки r26).
   Подключается ПОСЛЕ g4_home.js. Функции те же: фильтр по агенту = agf86, строка = po86, «добавить» = padd8. */
(function(){
var N5=5;
function cnt5(k){return proj8().filter(function(p){return p.apps.indexOf(k)>=0}).length}
/* «Агенты»: плитки → строка фильтр-пилюль (Все N · Claude · Codex · Hermes), точка = ждёт/сбой; число проектов агента — в заголовке группы после выбора */
window.agStrip86=function(){var f=U.pf||'all',L=proj8();
 var ch=[['all','Все',L.length,'']].concat(agKeys86().map(function(k){var s=agSt86(k);return [k,AGENTS8[k].n,cnt5(k),s[0]]}));
 return '<div class="chp5">'+ch.map(function(c){return '<div class="'+(f==c[0]?'on':'')+'" data-a="agf86" data-x="'+c[0]+'">'+'<b>'+c[1]+'</b>'+(c[0]=='all'?'<small>'+c[2]+'</small>':'')+(c[3]=='wait'||c[3]=='bad'?'<span class="dot '+c[3]+'"></span>':'')+'</div>'}).join('')+'</div>'};
/* список: группы — серые заголовки + карточка; «Свободны» больше не прячутся целиком: первые 5, остальное по «Показать ещё» */
window.listA2=function(){var L=proj8(),f=U.pf||'all',V=L.filter(function(p){return f=='all'||p.apps.indexOf(f)>=0});if(!U.pg)U.pg={};if(!('idle' in U.pg))U.pg.idle=true;
 V=V.slice().sort(function(a,b){return (b.last||0)-(a.last||0)});
 var need=V.filter(waiting8),work=V.filter(function(p){return p.st=='work'}),idle=V.filter(function(p){return p.st=='idle'});
 function sec(t,n,arr,tail){return arr.length?'<div class="sec pl5"><div class="sh"><span>'+t+' · '+n+'</span></div><div class="grp">'+arr.map(rowA2).join('')+(tail||'')+'</div></div>':''}
 var long=f=='all'&&idle.length>N5+1,shut=long&&U.pg.idle,show=shut?idle.slice(0,N5):idle;
 var tail=long?'<div class="rw86 tap mo5" data-a="pg5"><div class="t2"><div class="n2">'+(shut?'Показать ещё '+(idle.length-N5):'Свернуть')+'</div></div></div>':'';
 var h=sec('Требуют тебя',need.length,need)+sec('Работают',work.length,work)+sec(need.length||work.length?'Свободны':'Все проекты',idle.length,show,tail);
 return h||'<div class="empty">В этом приложении пока нет проектов</div>'};
window.prjTab86=function(){return hd()+agStrip86()+listA2()+'<div class="sec"><div class="grp"><div class="rw86 tap ad5" data-a="padd8"><span class="ri86">'+IC('plus')+'</span><div class="t2"><div class="n2">Добавить проект</div></div></div></div></div>'};
/* экран проекта: без второго крупного имени (оно уже в шапке) — карточка состояния: агенты + статус, веха с полосой, активность */
var _pp5=window.prjPage86;
window.prjPage86=function(){var h=_pp5.apply(this,arguments),p=prjById8(U.pid86);if(!p||U.page!='prj8')return h;
 var re=/<div class="ph ph86">[\s\S]*?<span class="ds86">[\s\S]*?<\/span><\/div><\/div><\/div>(<div class="mt86">[^<]*<\/div>)?(<div class="sec"><div class="prog"><i style="width:\d+%"><\/i><\/div><\/div>)?/;
 if(!re.test(h))return h;
 var dot=p.st=='wait'?'wait':p.st=='bad'?'bad':p.st=='work'?'ok':'',stt=(ST8[p.st]||ST8.idle)[0],busy=p.st!='idle'&&p.sub;
 var r='<div class="rw86 hd5">'+TLS(p,'m')+'<div class="t2"><div class="n2"><span class="dot '+dot+'"></span>'+(busy?esc(p.sub):stt)+'</div><div class="d2">'+esc(p.apps.map(function(a){return (AGENTS8[a]||{n:a}).n}).join(' · '))+(busy||!p.sub?'':' · '+esc(p.sub))+'</div></div></div>';
 if(p.ms||p.total)r+='<div class="rw86 ms5"><div class="t2"><div class="n2">'+(p.ms?'Веха '+esc(p.ms):'Задачи')+'</div>'+(p.total?'<div class="pg5"><i style="width:'+Math.round(p.done/p.total*100)+'%"></i></div>':'')+'</div>'+(p.total?'<span class="vl5">'+p.done+' из '+p.total+'</span>':'')+'</div>';
 var act=[p.last?ago(p.last):'',p.tok?p.tok.toFixed(1).replace('.',',')+' млн ток.':''].filter(Boolean).join(' · ');
 if(act)r+='<div class="rw86"><div class="t2"><div class="n2">Активность</div></div><span class="vl5">'+act+'</span></div>';
 return h.replace(re,'<div class="sec pcs5"><div class="grp pc5">'+r+'</div></div>')};
/* «Показать ещё / Свернуть» */
document.addEventListener('click',function(ev){var el=ev.target.closest&&ev.target.closest('[data-a]');if(!el||el.dataset.a!='pg5')return;
 ev.stopPropagation();ev.preventDefault();U.pg=U.pg||{};U.pg.idle=!U.pg.idle;render(true)},true);
})();
