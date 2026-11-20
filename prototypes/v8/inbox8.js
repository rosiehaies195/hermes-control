/* А2 + вкладка «Входящие»: полный список вопросов всех проектов. Ответ в любом месте закрывает вопрос везде (демо).
   Свой ответ, пропуск, Allow/Deny с подтверждением (демо-тост), история. Главная ссылается сюда через «Все вопросы». */
var HIST8=[['Ответил','master','kivi-gateway','2 ч'],['Автоответ','Recommended','docs-site','5 ч'],['Пропустил','','research-bot','вчера']];
function allQ8(){var R=[];proj8().forEach(function(p){p.q.forEach(function(q){R.push({p:p,q:q})})});R.sort(function(a,b){return b.q.ts-a.q.ts});return R}
function qfilt8(){var R=allQ8(),all=['all'].concat(APPS8);
 return '<div class="seg2">'+all.map(function(a){var n=R.filter(function(x){return a=='all'||inProj8(x.p,a)}).length;
  return '<span data-a="qf8" data-x="'+a+'" class="'+((U.qf||'all')==a?'on':'')+'">'+(a=='all'?'Все':AB1(a,'xs8')+ANM8[a])+'<i>'+n+'</i></span>'}).join('')+'</div>'}
function qcard8(it){var q=it.q,p=it.p,open=U.qo&&U.qo[q.id];
 return '<div class="qc8"><div class="qh2">'+AB8(p,'s8')+'<b>'+esc(p.n)+'</b>'+(p.ms?'<span class="pm8">'+esc(p.ms)+'</span>':'')+'<span class="tm2">'+ago(q.ts).replace(' назад','')+'</span></div>'+
  '<div class="qt2 full">'+esc(q.q)+'</div>'+qChips8(p,q)+
  '<div class="qx8"><span data-a="qo8" data-x="'+q.id+'">'+(open?'Скрыть':'Свой ответ')+'</span>'+(q.perm?'':'<span data-a="qs8" data-x="'+q.id+'" data-p="'+p.id+'">Пропустить</span>')+'</div>'+
  (open?'<div class="oa8"><textarea class="in" data-in="qo8:'+q.id+'" rows="2" placeholder="Напиши ответ агенту…"></textarea><div class="btn pri" data-a="qsend8" data-x="'+q.id+'" data-p="'+p.id+'">Отправить</div></div>':'')+'</div>'}
function questions(){var f=U.qf||'all',R=allQ8().filter(function(x){return f=='all'||inProj8(x.p,f)});
 var h='<div class="hd"><div class="logo" data-st="ok"></div><div><h1>HERMES</h1><div class="st">Входящие</div></div></div>'+qfilt8();
 h+=R.length?'<div class="sec" style="margin-top:10px"><div class="sh"><span>Ждут ответа</span><span class="sum">'+R.length+'</span></div></div>'+R.map(qcard8).join(''):'<div class="empty">Нет вопросов. Все агенты работают сами.</div>';
 var hs=U.hist8;
 h+='<div class="sec g2"><div class="sh col'+(hs?'':' shut')+'" data-a="hist8"><span>История</span><span class="sum">последние 3</span></div>'+(hs?'<div class="grp">'+HIST8.map(function(x){return '<div class="row2" style="cursor:default;min-height:48px"><div class="t2"><div class="n2" style="font-weight:500;font-size:14px">'+x[0]+(x[1]?': '+esc(x[1]):'')+'</div><div class="d2">'+esc(x[2])+' · '+x[3]+' назад</div></div></div>'}).join('')+'</div>':'')+'</div>';
 return h}
function closeQ8(pid,qid,msg){var p=proj8().filter(function(z){return z.id==pid})[0];p.q=p.q.filter(function(z){return z.id!=qid});if(!p.q.length&&p.st=='wait'){p.st='work';p.sub='шаг продолжен'}toast('<b>'+IC('check')+'</b> '+esc(msg))}
document.addEventListener('click',function(ev){var el=ev.target.closest('[data-a=qf8],[data-a=qo8],[data-a=qs8],[data-a=qsend8],[data-a=hist8]');if(!el)return;ev.stopPropagation();ev.preventDefault();haptic('sel');var a=el.dataset.a,x=el.dataset.x;U.qo=U.qo||{};
 if(a=='qf8')U.qf=x;else if(a=='qo8')U.qo[x]=!U.qo[x];else if(a=='hist8')U.hist8=!U.hist8;
 else if(a=='qs8')closeQ8(el.dataset.p,x,'Демо: вопрос пропущен');
 else if(a=='qsend8'){var t=document.querySelector('[data-in="qo8:'+x+'"]');if(!t||!t.value.trim()){toast('Напиши текст ответа');return}closeQ8(el.dataset.p,x,'Демо: ответ «'+t.value.trim().slice(0,40)+'» ушёл бы агенту')}
 render(true)},true);
document.addEventListener('input',function(ev){var k=ev.target.dataset&&ev.target.dataset.in;if(k&&k.indexOf('qo8:')==0)ev.stopPropagation()},true);
/* бейдж на вкладке «Вопросы» из демо-данных */
var _r8=render;render=function(k){_r8(k);var n=allQ8().length,b=document.querySelector('#nav [data-x=q]');if(b){var e=b.querySelector('.badge');if(n){if(!e){e=document.createElement('span');e.className='badge';b.appendChild(e)}e.textContent=n}else if(e)e.remove()}};
/* на главной ссылка ведёт сюда */
var _ib=inboxA2;inboxA2=function(){return _ib().replace(/<div class="mo2"[^>]*>[^<]*<\/div>/,'')+(allQ8().length?'<div class="mo2 all8" data-a="tab" data-x="q">Все вопросы · '+allQ8().length+' ›</div>':'')}
