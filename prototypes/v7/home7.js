/* ПРОТОТИП v7 «Фокус»: главный экран по принципу «одна карточка = одно решение».
   1) вверху ОДНА карточка (очередь решений со счётчиком «1 из N»), 2) полоса плиток-сводок, 3) всё остальное свёрнуто,
   4) у блоков «?» с пояснением, 5) отклик на действия: хаптик + тосты «отправляю → готово / ошибка». Данные те же (S), бэкенд не меняется. */
var HINT7={
 hero:'Здесь всегда одна карточка — то, что требует тебя прямо сейчас: вопрос агента, сбой или пауза. Если решений несколько, листай стрелками. Когда всё в порядке, карточка просто показывает, что идёт работа.',
 proj:'Веха — этап проекта из репозитория. Плитка показывает, сколько задач вехи закрыто. Тап — подробности, коммиты и все прошлые вехи.',
 tokens:'Токены — расход модели за последние 24 часа относительно твоего суточного бюджета (меняется в Настройках). Тап — график и прогноз.',
 queue:'Очередь задач — сообщения для Claude, которые я отправлю по очереди сами, когда он освободится. Тап — добавить или посмотреть очередь.',
 health:'Система — все компоненты автоматики: бот, сервер панели, туннель, кликер, окно Claude. Если что-то сломалось, здесь будет число проблем и кнопка «Починить».',
 strip:'Лента состояний Claude за 12 часов: когда он работал, ждал тебя или простаивал.',
 path:'Шаги вехи по порядку: какие закончены и какой идёт сейчас, со временем и токенами.',
 tok:'Расход токенов по часам за сутки. Красная пунктирная линия — часовая доля твоего бюджета; «прогноз» — сколько выйдет к концу суток при текущем темпе.',
 tok14:'Расход токенов за 14 дней, по задачам: кликер, монитор, куратор мозга. Помогает увидеть, что именно съедает бюджет.',
 auto:'Автоматика: включение кликера (он нажимает Start и исполняет ответы) и уведомлений. Подробные правила — в Настройках.',
 feed:'Последние события автоматики: что нажато, что спросил Claude, что починено. Полная история — в «Журнале».',
 hermes:'Открывает Hermes в браузере. Если gateway не отвечает, здесь будет кнопка «Перезапустить».'
};
U.hint=U.hint||{};U.fi=0;
/* свои настройки сворачивания (col7): прототип не должен менять боевую версию, у которой другие умолчания */
var _LSset=LS.set;LS.set=function(k,v){return _LSset(k=='col4'?'col7':k,v)};
U.col=LS.get('col7',{strip:true,path:true,tok:true,tok14:true,auto:true,queue:true,feed:true,hermes:true});
function hq7(k){return '<span class="hq" data-a="hint" data-x="'+k+'" aria-label="Что это?">?</span>'}
function hintBox7(k){return U.hint[k]&&HINT7[k]?'<div class="hint7">'+esc(HINT7[k])+'</div>':''}
function H7(html,k){if(!html)return html;return html.replace(/^(<div class="sec"><div class="sh[^>]*>.*?)(<\/div>)/,function(m,a,b){return a+hq7(k)+b+hintBox7(k)})}
/* colSec со значком «?» */
function colSec(k,t,body,sum){return '<div class="sec"><div class="sh col'+(U.col[k]?' shut':'')+'" data-a="col" data-x="'+k+'"><span>'+t+'</span>'+(sum?'<span class="sum">'+esc(sum)+'</span>':'')+(HINT7[k]?hq7(k):'')+'</div>'+hintBox7(k)+(U.col[k]?'':'<div class="grp">'+body+'</div>')+'</div>'}

/* ---- очередь решений ---- */
function heroKind7(){var bad=hBad();if(S.stopped)return 'stop';if(S.fails||bad.length)return 'bad';if(paused())return 'pause';if(!S.clicker.on)return 'off';return 'ok'}
function dec7(){var L=[],k=heroKind7(),urgent=k=='stop'||k=='bad';
 if(urgent)L.push({t:'hero'});
 S.pend.forEach(function(q){L.push({t:'q',q:q})});
 if(!urgent&&(k!='ok'||!S.pend.length))L.push({t:'hero'});
 return L}
function heroPlain7(){var p=S.pend;S.pend=[];var h;try{h=hero()}finally{S.pend=p}return h}
function qCard7(q,n,i){var ag=q.ag||'claude',rec=q.rec;
 var opts=q.perm?'<div class="pr7"><div class="btn ok7" data-a="quick" data-q="'+q.id+'" data-x="0">'+IC('check')+' '+esc(q.o[0])+'</div><div class="btn no7" data-a="quick" data-q="'+q.id+'" data-x="1">'+IC('x')+' '+esc(q.o[1])+'</div></div>':
  '<div class="opts7">'+q.o.map(function(o,j){var d=(q.od||[])[j];return '<div class="o7'+(j===rec?' rec':'')+'" data-a="quick" data-q="'+q.id+'" data-x="'+j+'"><div><b>'+esc(o)+'</b>'+(d?'<small>'+esc(d)+'</small>':'')+'</div>'+(j===rec?'<span class="rb">рекомендует</span>':'')+'</div>'}).join('')+'</div>';
 return '<div class="hero" data-c="wait"><div class="hk"><span class="ag '+ag+'">'+LG(ag)+'</span>Нужен ты'+(q.ts?'<span class="tm">'+ago(q.ts)+'</span>':'')+hq7('hero')+'</div>'+hintBox7('hero')+'<div class="ht">'+esc(q.q)+'</div><div class="hs">'+AN(ag)+(q.perm?' просит разрешение':' спрашивает')+(q.s?' · '+esc(q.s):'')+'</div>'+opts+autoLine(q)+
  (q.perm?'':'<div class="lnk7" data-a="openq" data-q="'+q.id+'">Свой ответ или пропустить ›</div>')+'</div>'}
function focus7(){var L=dec7(),n=L.length;if(U.fi>=n)U.fi=0;if(U.fi<0)U.fi=n-1;var it=L[U.fi],h;
 h=it.t=='q'?qCard7(it.q,n,U.fi):(function(){var x=heroPlain7();return x.replace(/(<div class="hk">.*?)(<\/div>)/,function(m,a,b){return a+hq7('hero')+b+hintBox7('hero')})})();
 var pg=n>1?'<div class="pg7"><span data-a="fi" data-x="-1">'+IC('chevron-left')+'</span><b>'+(U.fi+1)+' из '+n+'</b><span class="dots">'+L.map(function(z,i){return '<i class="'+(i==U.fi?'on':'')+(z.t=='q'?' q':'')+'"></i>'}).join('')+'</span><span data-a="fi" data-x="1">'+IC('chevron-right')+'</span></div>':'';
 return pg+h}

/* ---- плитки-сводки ---- */
function tile7(a,x,lab,big,sub,pct,cls){return '<div class="tile7 '+(cls||'')+'" data-a="'+a+'"'+(x?' data-x="'+x+'"':'')+'><div class="tl">'+lab+'</div><div class="tb">'+big+'</div><div class="ts">'+sub+'</div>'+(pct!=null?'<div class="prog"><i style="width:'+Math.max(2,Math.min(100,pct))+'%"></i></div>':'')+'</div>'}
function tiles7(){var P=S.proj,T=[],F=S.tok&&S.tok.h?forecast():null,bad=hBad(),H=S.health||[],Q=(S.queue||[]).filter(function(x){return x.st!='sent'});
 if(P&&P.total)T.push(tile7('proj','','Проект',esc(P.ms),P.done+' из '+P.total+' задач',P.done/P.total*100));
 if(F)T.push(tile7('goto7','tok','Токены за сутки',(F.sum/1000).toFixed(1)+' <small>млн</small>','из '+S.budget+(F.over?' · прогноз выше':''),F.sum/(S.budget*10),F.over?'warn':''));
 T.push(tile7(Q.length?'goto7':'qaddsheet',Q.length?'queue':'','Очередь',Q.length||'пуста',Q.length?'задач ждут':'тап — добавить',null));
 T.push(tile7('sys','','Система',bad.length?bad.length+' <small>проблем</small>':(H.length-bad.length)+'/'+H.length,bad.length?esc(bad[0].n):'всё в норме',null,bad.length?'bad':'okk'));
 return '<div class="tiles7">'+T.join('')+'</div>'}

/* ---- главный экран ---- */
function home7(){
 var Q=S.queue||[],inner=Q.length?H7(queueCard(),'queue'):'';
 return hd()+updBanner()+netBanner()+focus7()+tiles7()+digestCard()+
  '<div class="sec more7"><div class="sh"><span>Подробности</span><span class="sum">свёрнуто</span></div></div>'+
  inner+colSec('strip','Сессия · 12 ч',strip(),stripSum())+colSec('path','Дорожка шагов',pathView(),pathSum())+H7(tokens(),'tok')+
  (S.tok14&&S.tok14.sum?colSec('tok14','Токены · 14 дней',tok14(),(S.tok14.sum/1000).toFixed(1)+' млн'):'')+autoGrp()+
  colSec('feed','Лента',(S.log.length?S.log.slice(0,5).map(function(e){return evRow(e)}).join(''):'<div class="row" style="color:var(--mut)">Записей пока нет</div>')+'<div class="row tap" data-a="journal" data-x="ev"><div class="t"><div class="d">Весь журнал</div></div><span class="chev">›</span></div>','')+
  hermesCard()}
var _home0=home;home=function(){return home7()};

/* действия: «?», пейджер, переход к блоку */
document.addEventListener('click',function(ev){var el=ev.target.closest('[data-a=hint],[data-a=fi],[data-a=goto7]');if(!el)return;ev.stopPropagation();ev.preventDefault();var a=el.dataset.a,x=el.dataset.x;haptic('sel');
 if(a=='hint'){U.hint[x]=!U.hint[x];render(true);return}
 if(a=='fi'){U.fi+=+x;render(true);return}
 if(a=='goto7'){U.col[x]=false;LS.set('col4',U.col);render(true);setTimeout(function(){var h=document.querySelector('[data-a=col][data-x="'+x+'"]');if(h)h.scrollIntoView({block:'start',behavior:'smooth'})},60)}
},true);

/* ---- отклик: хаптик + тосты ---- */
function haptic(k){if(!U.haptics)return;try{var H=tg.HapticFeedback;if(k=='sel')H.selectionChanged();else if(k=='tap')H.impactOccurred('light');else if(k=='press')H.impactOccurred('medium');else H.notificationOccurred(k)}catch(e){}}
function toastK(h,k,undo){toast(h,undo);var t=$('toast');t.classList.remove('k-ok','k-err','k-wait');t.classList.add('k-'+k);if(k=='wait'){clearTimeout(tt);tt=setTimeout(function(){t.classList.remove('on')},9000)}}
document.addEventListener('click',function(ev){var el=ev.target.closest('.o7,.ok7,.no7');if(el)haptic('press')},true);
function send(o,quiet){o=Object.assign({v:1},o);haptic('tap');var undo=UNDO[o.a]||null;
 if(API){var p=MOCK?MOCK.post(o):fetch(API.replace(/\/$/,'')+'/api',{method:'POST',headers:{'Content-Type':'application/json','X-Init-Data':tg?tg.initData:''},body:JSON.stringify(o)}).then(function(r){if(!r.ok)throw r;return r.json()});
  if(MOCK)MOCK.log(o,'POST /api');
  if(!quiet)toastK('<b>'+IC('rotate-cw')+'</b> Отправляю…','wait');
  p.then(function(r){haptic('success');if(!quiet)toastK('<b>'+IC('check')+'</b> '+esc(r.text||'Готово'),'ok',undo);if(r.state){var keepE=dirty()?E:null;S=r.state;norm();if(keepE)E=keepE;if(o.a=='ans')U.qsel={};render(true)}})
  .catch(function(){haptic('error');if(MENU&&!HP.get('z'))toastK('<b>'+IC('triangle-alert')+'</b> Сервер на ПК недоступен. Открой панель кнопкой «Панель» внизу чата','err');else{toastK('<b>'+IC('triangle-alert')+'</b> Сервер недоступен — отправляю через бота','err');sd(o)}});return}
 sd(o)}
