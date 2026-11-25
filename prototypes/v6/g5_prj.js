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

/* s2-6 (видео 0:06–0:13): при входе Face ID спрашивался ДВАЖДЫ — «Открыть по Face ID» на экране блокировки, затем ещё раз
   из boot(), когда пришёл свежий /api/state; между ними на секунду был виден старый Пульт v5 из кэша (кэш рисуется базой
   до загрузки модулей). Теперь: после успешного входа повторная проверка 2 мин не нужна; кэш сразу перерисован новыми модулями.
   Последний модуль в кортеже make_app — поэтому здесь. */
(function(){var W=window;if(typeof W.lockCheck!='function'||typeof W.lockHide!='function')return;
 var _lc=W.lockCheck,_lh=W.lockHide,okAt=0;
 W.lockHide=function(){var r=_lh.apply(this,arguments);try{if(!LOCK.on){var first=!okAt;okAt=Date.now();if(first)render(true)}}catch(e){}return r};
 W.lockCheck=function(){try{if(okAt&&Date.now()-okAt<120000&&!LOCK.on){W.bioDiag&&bioDiag('lock_skip');return}}catch(e){}return _lc.apply(this,arguments)};
 try{if(typeof S!='undefined'&&S&&typeof LOADING!='undefined'&&!LOADING)render(true)}catch(e){}
})();
/* ================= s4-d: вкладки вне чата — баги видео iPhone v10.12 (Мозг, Система, старт) ================= */
(function(){var W=window,D=document;if(W.__s4d)return;W.__s4d=1;
 /* 1) Мозг (видео 383–395 с): «Простыми словами» — только ПЕРВЫЙ блок после заголовка (список или абзац до пустой строки).
    Раньше брался весь текст до следующего «## », и технические пункты без своего заголовка уходили в простой слой,
    а под «Технический текст ⌄» оставался один заголовок файла (claude-desktop, gateway-restart, telegram-bot, decisions…) */
 W.splitPlain=function(src){src=String(src||'');var m=src.match(/\r?\n## Простыми словами[ \t]*\r?\n/);if(!m)return {b:null,rest:src};
  var st=m.index,i=st+m[0].length,L=src.slice(i).split('\n'),b=[],used=0,seen=false,li=false;
  for(var k=0;k<L.length;k++){var l=L[k].replace(/\r$/,'');
   if(/^#{1,6}\s|^\s*\|/.test(l))break;
   if(/^\s*[-*]\s/.test(l)){b.push(l.replace(/^\s*[-*]\s+/,''));seen=li=true}
   else if(!l.trim()){if(seen)break}
   else if(!seen){b.push(l.trim());seen=true}
   else if(li&&/^\s{2,}\S/.test(l)||!li)b[b.length-1]+=' '+l.trim();
   else break;
   used+=L[k].length+1}
  return {b:b,rest:src.slice(0,st)+'\n'+src.slice(i+used)}};
 /* 2) Мозг (видео 397–403 с): таблицы markdown — настоящей таблицей в обёртке с горизонтальной прокруткой, а не сырыми «| … |» */
 function cells(l){l=l.trim().replace(/^\|/,'').replace(/\|$/,'');var o=[],c='',code=false;
  for(var i=0;i<l.length;i++){var ch=l[i];if(ch=='`')code=!code;if(ch=='\\'&&l[i+1]=='|'){c+='|';i++;continue}if(ch=='|'&&!code){o.push(c.trim());c='';continue}c+=ch}
  o.push(c.trim());return o}
 function inl4(t){t=esc(t).replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*\*(.+?)\*\*/g,'<b>$1</b>');var q=U.bq;
  if(q)t=t.replace(new RegExp('('+q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','gi'),'<mark>$1</mark>');return t}
 function table4(rows){var h=cells(rows[0]),al=cells(rows[1]).map(function(a){return /^:-+:$/.test(a)?'center':/-:$/.test(a)?'right':''});
  function td(tag,c,j){return '<'+tag+(al[j]?' style="text-align:'+al[j]+'"':'')+'>'+inl4(c)+'</'+tag+'>'}
  return '<div class="s4tw"><table class="s4tb"><thead><tr>'+h.map(function(c,j){return td('th',c,j)}).join('')+'</tr></thead><tbody>'+
   rows.slice(2).map(function(r){var c=cells(r);while(c.length<h.length)c.push('');return '<tr>'+c.map(function(x,j){return td('td',x,j)}).join('')+'</tr>'}).join('')+'</tbody></table></div>'}
 if(typeof W.md=='function'&&!W.md.__s4d){var md0=W.md;
  W.md=function(src){src=String(src==null?'':src);var L=src.split(/\r?\n/),out=[],T=[],fence=false;
   for(var i=0;i<L.length;i++){var l=L[i];if(/^```/.test(l))fence=!fence;
    if(!fence&&/^\s*\|/.test(l)&&i+1<L.length&&/^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?\s*$/.test(L[i+1])){var r=[l,L[i+1]];i+=2;
     while(i<L.length&&/^\s*\|/.test(L[i]))r.push(L[i++]);i--;T.push(table4(r));out.push('\u0001T'+(T.length-1)+'\u0001');continue}
    out.push(l)}
   var h=md0.call(this,out.join('\n'));
   return T.length?h.replace(/<p>\u0001T(\d+)\u0001<\/p>|\u0001T(\d+)\u0001/g,function(_,a,b){return T[+(a||b)]}):h};
  W.md.__s4d=1}
 /* 4) Система (видео 406–411 с): одна формулировка на «Ещё», «просто» и «тех» — что выключено, названо по имени */
 function offs4(tech){var G={},o=[];(S.health||[]).filter(function(h){return h.ok&&hWarn(h)}).forEach(function(h){
  var n=h.k=='clicker'?(tech?'кликер':'автопилот (кликер)'):tech?h.n:((W.HPL&&HPL[h.k]&&HPL[h.k][0])||h.n),w={'выключен':'выключено','остановлен':'остановлено'}[hWord(h)]||hWord(h);
  (G[w]=G[w]||[]).push(n.charAt(0).toLowerCase()+n.slice(1))});
  for(var w in G)o.push(w+': '+G[w].join(', '));return o}
 function line4(tech){var bad=hBad(),o=offs4(tech);
  if(bad.length)return {c:'bad',t:bad.length+' '+(tech?'требуют внимания':'сломалось')+': '+bad.map(function(h){return h.n}).join(', ')};
  if(S.stopped)return {c:'warn',t:'Всё остановлено тобой'};
  if(o.length)return {c:'warn',t:(tech?'Все '+S.health.length+' исправны':'Всё исправно')+' · '+o.join(', ')};
  return {c:'ok',t:tech?'Все '+S.health.length+' компонентов в норме':'Всё работает'}}
 W.sysLine4=line4;
 W.sysSum=function(){return line4(false).t};
 if(typeof W.sysPageT=='function'){var spt=W.sysPageT;W.sysPageT=function(){var h=spt.apply(this,arguments),l=line4(true);
  return h.replace(/<div class="d">(Все \d+ компонентов в норме|\d+ из \d+ требуют внимания)<\/div>/,'<div class="d">'+esc(l.t)+'</div>')}}
 if(typeof W.moreTab86=='function'){var mt=W.moreTab86;W.moreTab86=function(){var h=mt.apply(this,arguments),l=line4(false),hb=hBad().length;
  var t=hb?l.t:l.c=='warn'?l.t.replace(/^Всё исправно · /,'исправно · ').replace(/^Всё остановлено тобой$/,'всё остановлено'):'все компоненты в норме';
  return h.replace(/(<div class="d2">)<span class="dot (?:ok|bad)"><\/span>(?:все компоненты в норме|\d+ требуют внимания)/,'$1<span class="dot '+(hb?'bad':l.c)+'"></span>'+esc(t))}}
 /* самопроверка старше суток — «давно»: результаты серые, кнопка «Проверить» первой строкой блока */
 if(typeof W.stBlock=='function'){var sb=W.stBlock;W.stBlock=function(){var h=sb.apply(this,arguments),T=S.st||{};
  if(!T.ts||T.run||!(T.items||[]).length||nowS()-T.ts<86400)return h;
  return h.replace(/<span class="sum">([^<]*)<\/span>/,'<span class="sum s4old">давно</span>')
   .replace('<div class="grp">','<div class="grp s4stold"><div class="row s4strow"><div class="t"><div class="n">Проверял давно</div><div class="d">'+esc(ago(T.ts))+' — результат мог устареть</div></div><div class="btn sm pri" data-a="selftest">Проверить</div></div>')
   .replace(/<span class="dot ok"><\/span>/g,'<span class="dot"></span>')}}
 /* 5) «Обновить» (видео 8.5–10.7 с): без тоста «Обновлено» — он отрывается от листа при закрытии Mini App и висит поверх Telegram.
    Видимая обратная связь — крутится значок в шапке, по окончании лёгкая отдача */
 var rf=W.refresh;W.refresh=function(){if(!API||typeof poll!='function')return rf.apply(this,arguments);
  var i=D.querySelector('.g4cap [data-a=refresh]');if(i)i.classList.add('spin');try{haptic('sel')}catch(e){}
  return poll(true).then(function(){var j=D.querySelector('.g4cap [data-a=refresh]');if(j)j.classList.remove('spin');try{haptic('success')}catch(e){}})};
 try{if(typeof S!='undefined'&&S&&typeof LOADING!='undefined'&&!LOADING&&U.tab!='hc')render(true)}catch(e){}
})();
