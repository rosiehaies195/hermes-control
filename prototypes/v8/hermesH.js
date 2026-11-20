/* v8-H: многопроектность В СТИЛЕ HERMES (правки пользователя 2026-11-20).
   Берём из боевой версии: шапку, КАПС-заголовки с сеткой, карточки вопросов в стиле каждого приложения, журнал, настройки, систему.
   Из нового: фильтр Claude/Codex/Hermes (на главной и во «Входящих»), список проектов, закругления (round8.css). */

/* демо-вопросы проектов -> S.pend в боевом формате (тогда карточки рисует боевой код) */
function pendFromDemo8(){var R=[];proj8().forEach(function(p){p.q.forEach(function(q){R.push({id:q.id,pid:p.id,s:p.n+(p.ms?' · '+p.ms:''),q:q.q,o:q.o,od:q.od,ag:p.apps[0]=='hermes'?'claude':p.apps[0],app:p.apps[0],ts:q.ts,rec:q.rec,perm:q.perm})})});
 R.sort(function(a,b){return b.ts-a.ts});return R}
var _rH=render;render=function(k){S.pend=pendFromDemo8();_rH(k)};

/* ответ на демо-вопрос из любой карточки закрывает его везде */
function closeDemo8(qid,label){var q=pendFromDemo8().filter(function(z){return z.id==qid})[0];if(!q)return false;
 var p=proj8().filter(function(z){return z.id==q.pid})[0];p.q=p.q.filter(function(z){return z.id!=qid});if(!p.q.length&&p.st=='wait'){p.st='work';p.sub='шаг продолжен'}
 if(U.qsel)delete U.qsel[qid];haptic('success');toast('<b>'+IC('check')+'</b> Демо: '+esc(label)+' → '+esc(p.n));render(true);return true}
document.addEventListener('click',function(ev){var el=ev.target.closest('[data-a=quick],[data-a=qskip],[data-a=qsub]');if(!el||el.dataset.p8)return;var qid=el.dataset.q,a=el.dataset.a;
 var q=pendFromDemo8().filter(function(z){return z.id==qid})[0];if(!q)return;ev.stopPropagation();ev.preventDefault();
 if(a=='qskip'){closeDemo8(qid,'вопрос пропущен');return}
 if(a=='quick'){closeDemo8(qid,'ответ «'+(q.o[+el.dataset.x]||'')+'»');return}
 var c=U.qsel&&U.qsel[qid];if(!c||c.k===undefined||(c.k==='o'&&!(c.t||'').trim()))return;closeDemo8(qid,'ответ «'+(c.k==='o'?c.t:q.o[c.k])+'»')},true);

/* фильтр по приложению: общий компонент */
function appFilt8(key,list,getApps){return '<div class="seg2">'+['all'].concat(APPS8).map(function(a){var n=list.filter(function(x){return a=='all'||getApps(x).indexOf(a)>=0}).length;
  return '<span data-a="af8" data-k="'+key+'" data-x="'+a+'" class="'+((U[key]||'all')==a?'on':'')+'">'+(a=='all'?'Все':AB1(a,'xs8')+ANM8[a])+'</span>'}).join('')+'</div>'}
document.addEventListener('click',function(ev){var el=ev.target.closest('[data-a=af8]');if(!el)return;ev.stopPropagation();ev.preventDefault();haptic('sel');U[el.dataset.k]=el.dataset.x;U.pe=null;render(true)},true);
function appsOfQ8(q){var p=proj8().filter(function(z){return z.id==q.pid})[0];return p?p.apps:[q.ag]}

/* «Вопросы»: боевые карточки + фильтр сверху */
var _qH=questions;questions=function(){var all=S.pend,f=U.qf8||'all',_hd=hd;
 S.pend=all.filter(function(q){return f=='all'||appsOfQ8(q).indexOf(f)>=0});
 hd=function(){return _hd()+'<div style="margin-top:8px">'+appFilt8('qf8',all,appsOfQ8)+'</div>'};
 var h;try{h=_qH()}finally{hd=_hd;S.pend=all}return h};

/* главная: вопросы боевыми карточками (стиль каждого приложения) + проекты в стиле Hermes */
function inboxH(){var P=S.pend;if(!P.length)return '';var sh=P.slice(0,2);
 return '<div class="sec" style="margin-top:6px"><div class="sh"><span>Нужен ты · '+P.length+'</span><a data-a="tab" data-x="q">все вопросы ›</a></div></div>'+sh.map(qAlert).join('')+
  (P.length>2?'<div class="moreH" data-a="tab" data-x="q">Ещё '+(P.length-2)+' '+(P.length-2==1?'вопрос':P.length-2<5?'вопроса':'вопросов')+' во «Входящих» ›</div>':'')}
filtA2=function(){var f=U.pf;U.pf8=f;var h=appFilt8('pf',proj8(),function(p){return p.apps});return h};
home=function(){['tok','tok14','auto','feed','strip','path'].forEach(function(k){if(U.col[k]===undefined)U.col[k]=true});
 return hd()+updBanner()+netBanner()+inboxH()+
  '<div class="sec"><div class="sh"><span>Проекты · '+proj8().length+'</span><a data-a="d8" data-x="add">+ добавить</a></div></div>'+filtA2()+listA2()+moreA2()+hermesCard()};
