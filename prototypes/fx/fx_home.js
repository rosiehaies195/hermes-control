/* focus-ui п.4 (решение 21) — Пульт вокруг вопроса «что мне сделать?».
   Слой поверх g4_home.js (подключается после него, переопределяет глобальный home()):
   1) НУЖНО ТЕБЕ · N — S.need (бэкенд tv_need.py): одна фраза + кнопки; вопросы/разрешения агентов — их родные карточки qAlert
      (все варианты, «Свой ответ», быстрые фразы — как было); пусто — «Ничего не ждёт тебя».
   2) ИДЁТ САМО · N — S.going: что работает без тебя.
   3) ПРОЕКТЫ — поиск + категории «Работа / Свои / Обвязка», «Тесты» свёрнуты (S.prj_hid); «Разложить» — перекладывать по категориям.
   fx6-quiet (слово владельца 28.11 «только там, где я должен включиться»): на Пульте ТОЛЬКО «Нужно тебе» + одна тихая строка
   «Остальное идёт само · N ›» (→ вкладка «Проекты»). «Идёт само» списком, поиск и категории с Пульта убраны (функции остались).
   Действия: базовые data-a (po86, fix, resume, sys) + свои fx21* (чат, мост, категория, поиск). Классы — с приставкой fx21. */
(function(){
 var W=window,D=document;
 function E(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
 var OAI='M13.7958 23.893C13.003 23.893 12.2498 23.7423 11.5362 23.441C10.8226 23.1398 10.1883 22.7195 9.6333 22.1804C9.03072 22.3865 8.40436 22.4896 7.75421 22.4896C6.69177 22.4896 5.70862 22.228 4.80476 21.7047C3.90089 21.1814 3.17146 20.4678 2.61645 19.5639C2.0773 18.6601 1.80773 17.6531 1.80773 16.5431C1.80773 16.0833 1.87116 15.5838 1.99802 15.0446C1.36373 14.4579 0.872151 13.784 0.52329 13.0228C0.17443 12.2458 0 11.4371 0 10.5966C0 9.74035 0.182359 8.91578 0.547076 8.12291C0.911794 7.33005 1.41923 6.64818 2.06938 6.07732C2.73538 5.4906 3.50446 5.08624 4.37661 4.86424C4.55104 3.96038 4.91576 3.15165 5.47076 2.43808C6.04162 1.70864 6.73935 1.13778 7.56392 0.725489C8.3885 0.3132 9.26858 0.107056 10.2042 0.107056C10.997 0.107056 11.7502 0.2577 12.4638 0.558988C13.1774 0.860277 13.8117 1.28049 14.3667 1.81964C14.9693 1.6135 15.5956 1.51042 16.2458 1.51042C17.3082 1.51042 18.2914 1.77207 19.1952 2.29536C20.0991 2.81865 20.8206 3.53223 21.3598 4.43609C21.9148 5.33996 22.1923 6.3469 22.1923 7.45691C22.1923 7.91677 22.1288 8.41627 22.002 8.95542C22.6363 9.54214 23.1278 10.224 23.4767 11.001C23.8256 11.7622 24 12.563 24 13.4034C24 14.2597 23.8176 15.0843 23.4529 15.8771C23.0882 16.67 22.5728 17.3598 21.9068 17.9465C21.2567 18.5174 20.4955 18.9138 19.6234 19.1358C19.449 20.0397 19.0763 20.8484 18.5055 21.562C17.9504 22.2914 17.2607 22.8623 16.4361 23.2745C15.6115 23.6868 14.7314 23.893 13.7958 23.893ZM7.96829 20.6581C8.71358 20.6581 9.37166 20.4916 9.94252 20.1586L14.2478 17.6849C14.4222 17.5739 14.5094 17.4232 14.5094 17.2329V15.5679L9.20515 18.6125C8.71358 18.8979 8.222 18.8979 7.73043 18.6125L3.63925 16.2577C3.63925 16.2736 3.63925 16.2973 3.63925 16.3291C3.63925 16.3608 3.63925 16.4004 3.63925 16.448C3.63925 17.225 3.82161 17.9386 4.18632 18.5887C4.5669 19.223 5.09019 19.7225 5.75619 20.0872C6.4222 20.4678 7.15956 20.6581 7.96829 20.6581ZM8.18236 16.781C8.2775 16.8444 8.36472 16.8761 8.444 16.8761C8.52329 16.8603 8.61051 16.8286 8.70565 16.781L10.1566 15.9723L4.87612 12.8801C4.38454 12.6105 4.13875 12.1824 4.13875 11.5957V6.90983C3.44103 7.27455 2.88603 7.78991 2.47374 8.45591C2.0773 9.10606 1.87909 9.82757 1.87909 10.6204C1.87909 11.3657 2.06145 12.0793 2.42616 12.7612C2.80674 13.4272 3.29832 13.9346 3.90089 14.2835L8.18236 16.781ZM13.7721 22.0377C14.5808 22.0377 15.3102 21.8553 15.9604 21.4906C16.6105 21.1259 17.1179 20.6264 17.4827 19.9921C17.8632 19.3578 18.0535 18.6521 18.0535 17.8751V12.9277C18.0535 12.7215 17.9663 12.5709 17.7919 12.4757L16.3409 11.5957V17.7324C16.3409 18.3191 16.0951 18.7473 15.6036 19.0169L11.5362 21.3717C12.2339 21.8157 12.9792 22.0377 13.7721 22.0377ZM14.5094 13.4985V10.5015L12.0119 9.07435L9.49058 10.5015V13.4985L12.0119 14.9257L14.5094 13.4985ZM7.65907 6.26761C7.65907 5.68089 7.90486 5.25274 8.39643 4.98317L12.4638 2.62836C11.7661 2.18436 11.0208 1.96236 10.2279 1.96236C9.43508 1.96236 8.71358 2.14472 8.06343 2.50943C7.41328 2.87415 6.89792 3.37365 6.51734 4.00795C6.15263 4.64224 5.97027 5.34789 5.97027 6.12489V11.0486C5.97027 11.2389 6.05748 11.3974 6.23191 11.5243L7.65907 12.4044V6.26761ZM19.885 17.0902C20.5669 16.7413 21.106 16.2339 21.5025 15.5679C21.9148 14.9019 22.1209 14.1725 22.1209 13.3796C22.1209 12.6343 21.9306 11.9287 21.55 11.2627C21.1853 10.5808 20.7017 10.0654 20.0991 9.71657L15.8176 7.24283C15.7225 7.1794 15.6353 7.15562 15.556 7.17147C15.4767 7.17147 15.3895 7.19526 15.2943 7.24283L13.8434 8.02777L19.1477 11.1437C19.4014 11.2864 19.5837 11.4609 19.6947 11.667C19.8216 11.8573 19.885 12.1031 19.885 12.4044V17.0902ZM14.7948 5.33996C15.2864 5.03867 15.778 5.03867 16.2696 5.33996L20.3608 7.74234C20.3608 7.69476 20.3608 7.64719 20.3608 7.59962C20.3608 6.87019 20.1784 6.1804 19.8137 5.53025C19.4648 4.86424 18.9574 4.33302 18.2914 3.93659C17.6412 3.54016 16.888 3.34194 16.0317 3.34194C15.2864 3.34194 14.6283 3.50844 14.0575 3.84145L9.75223 6.31518C9.5778 6.42618 9.49058 6.57683 9.49058 6.76711V8.43213L14.7948 5.33996Z';
 function ai(k){if(k=='hermes')return '<i class="g4ai g4ai-h"></i>';
  if(k=='claude'){var v=W.CLV&&CLV.spark;return v?'<svg class="g4ai g4ai-c" viewBox="0 0 '+v[0]+' '+v[1]+'" aria-hidden="true"><path d="'+v[2]+'"/></svg>':'<i class="g4ai"></i>'}
  if(k=='codex')return '<svg class="g4ai g4ai-x" viewBox="0 0 24 24" aria-hidden="true"><path d="'+OAI+'"/></svg>';
  return '<span class="g4ai g4ai-s">'+(W.IC?IC('activity'):'')+'</span>'}
 function srcIc(r){if(r.src=='ob'||r.src=='cj')return ai('hermes');
  if(r.src=='health'||r.src=='stop')return ai('');return ai(r.ag||'hermes')}
 function sec(t,n,r){return '<div class="g4sh fx21sh">'+t+(n!=null?'<span>'+n+'</span>':'')+(r||'')+'</div>'}
 function pl(a,t,ds,cls){var h='';for(var k in ds||{})if(ds[k]!=null)h+=' data-'+k+'="'+E(ds[k])+'"';
  return '<div class="g4pl'+(cls?' '+cls:'')+'" data-a="'+a+'"'+h+'>'+E(t)+'</div>'}
 var FS={q:'',edit:0,open:{},qo:{}};
 function hit(s){var q=FS.q.trim().toLowerCase();return !q||String(s||'').toLowerCase().indexOf(q)>=0}
 /* ---------- кнопка строки «Нужно тебе» -> базовое действие ---------- */
 function btn(r,b,i){var main=i==0?' w':'';
  switch(b.a){
   case 'prj':return pl('po86',b.l,{x:b.pid},main);
   case 'fix':return pl('fix',b.l,{x:b.k},main);
   case 'startall':return pl('resume',b.l,{},main);
   case 'sys':return pl('sys',b.l,{},main);
   case 'chat':return pl('fx21chat',b.l,{k:b.k,id:b.id},main);
   case 'ob':return pl('fx21ob',b.l,{id:b.id,k:b.k},b.k=='y'?' w':b.k=='n'?' fx21no':'');
   case 'q':return pl('fx21q',b.l,{qid:b.qid},main);
   default:return ''}}
 function needRow(r){return '<div class="g4r fx21r '+(r.lvl=='red'?'fx21red':'fx21yel')+'" data-fxid="'+E(r.id)+'"><i class="fx21lv"></i>'+srcIc(r)+
  '<div class="g4rt"><b>'+E(r.t)+'</b>'+(r.sub?'<span>'+E(r.sub)+'</span>':'')+
  '<div class="fx21bt">'+(r.act||[]).map(function(b,i){return btn(r,b,i)}).join('')+'</div></div></div>'}
 /* вопрос/разрешение агента: свёрнуто — строка «одна фраза + кнопки» (разрешение — сразу «Разрешить/Отклонить» базовым quick);
    «Ответить» раскрывает на месте родную карточку вопроса (все варианты, «Свой ответ», быстрые фразы, автоответ) */
 function qRow(r){var q=(S.pend||[]).filter(function(x){return 'q:'+x.id==r.id})[0];if(!q)return needRow(r);
  if(FS.qo[q.id])return {card:qAlert(q)};
  var b=[];if(q.perm){var o=q.o||[],ka=0,kd=1;o.forEach(function(x,i){if(/^(allow|разреш)/i.test(x))ka=i;if(/^(deny|запрет|отклон)/i.test(x))kd=i});
   b.push(pl('quick','Разрешить',{q:q.id,x:ka},'w'),pl('quick','Отклонить',{q:q.id,x:kd},'fx21no'))}
  else b.push(pl('fx21qx','Ответить',{x:q.id},'w'));
  return '<div class="g4r fx21r fx21red" data-fxid="'+E(r.id)+'"><i class="fx21lv"></i>'+srcIc(r)+'<div class="g4rt"><b data-a="fx21qx" data-x="'+E(q.id)+'">'+E(r.t)+'</b>'+(r.sub?'<span>'+E(r.sub)+'</span>':'')+
   '<div class="fx21bt">'+b.join('')+'</div></div></div>'}
 /* вопросы и разрешения — по S.pend на клиенте (ответил — строка уходит сразу, новый вопрос — сразу появляется, не ждём опроса) */
 function needAll(){var P=S.pend||[],hid={},have={},q=[],ag={claude:'Claude',codex:'Codex',hermes:'Hermes'};(S.prj_hid||[]).forEach(function(p){hid[p.id]=1});
  (S.need||[]).forEach(function(r){if(r.src=='q'||r.src=='perm')have[r.id]=r});
  P.forEach(function(x){if(!x||!x.id||hid[x.pid])return;var id='q:'+x.id;if(have[id]){q.push(have[id]);return}
   var pn=((S.prj||[]).filter(function(p){return p.id==x.pid})[0]||{}).n||String(x.s||'').split(' · ')[0],a=x.ag||'claude',tx=String(x.q||'').slice(0,120);
   q.push({id:id,lvl:'red',src:x.perm?'perm':'q',t:(x.perm?'Разреши или запрети: ':'Ответь на вопрос: «')+tx+(x.perm?'':'»'),pid:x.pid,ag:a,sub:[pn,ag[a]||a].filter(Boolean).join(' · '),act:[]})});
  /* упавшие cron-задачи (раньше «Сбой задачи» в блоке «Сбои»): бэкенд tv_need их не отдаёт — строка на клиенте */
  var jb=(S.cj||[]).filter(function(j){return j.on&&!j.ok}),jr=[];
  if(jb.length){var jn=function(j){try{return W.cronName86?cronName86(j):(j.n||j.name||'задача')}catch(e){return j.n||'задача'}};
   jr.push({id:'cj',lvl:'red',src:'cj',ag:'hermes',t:'Посмотри сбой задачи: '+jn(jb[0])+(jb.length>1?' и ещё '+(jb.length-1):''),sub:'По расписанию',act:[{l:'Открыть «Систему»',a:'sys'}]})}
  return q.concat((S.need||[]).filter(function(r){return r.src!='q'&&r.src!='perm'}),jr)}
 function need(flt,title,lim){var L=needAll().filter(function(r){return hit(r.t+' '+r.sub)&&(!flt||flt(r))}),n=L.length;if(!n&&flt)return '';
  var more=lim&&!FS.needAll&&!FS.q&&n>lim+1?n-lim:0;if(more)L=L.slice(0,lim);
  if(!n)return FS.q?'':sec('Нужно тебе')+'<div class="g4calm fx21calm">'+(W.G4V&&G4V.cc_done?'<svg class="g4v" width="'+G4V.cc_done[0]+'" height="'+G4V.cc_done[1]+'" viewBox="0 0 '+G4V.cc_done[0]+' '+G4V.cc_done[1]+'"><path d="'+G4V.cc_done[2]+'"/></svg>':'')+
   '<div><b>Ничего не ждёт тебя</b><span>Агенты работают сами. Позову, когда понадобится твоё решение.</span></div></div>';
  var h='',run=[];function flush(){if(run.length)h+='<div class="g4card fx21need">'+run.join('')+'</div>';run=[]}
  L.forEach(function(r){var x=(r.src=='q'||r.src=='perm')?qRow(r):needRow(r);if(x&&x.card){flush();h+='<div class="g4qs fx21qs">'+x.card+'</div>'}else run.push(x)});
  if(more)run.push('<div class="g4r tap fx21more" data-a="fx21more"><div class="g4rt"><b>Ещё '+more+'</b><span>менее срочное ниже по списку</span></div><i class="g4ch">›</i></div>');flush();
  return sec(title||'Нужно тебе',n)+h}
 function going(flt){var L=(S.going||[]).filter(function(g){return hit(g.n+' '+g.t)&&(!flt||flt(g))});if(!L.length)return '';
  return sec('Идёт само',L.length)+'<div class="g4card">'+L.map(function(g){return '<div class="g4r tap" data-a="po86" data-x="'+E(g.pid)+'">'+
   ai(g.ag||(g.apps||[])[0]||'claude')+'<div class="g4rt"><b>'+E(g.n)+'</b><span>'+E(g.t)+'</span></div><i class="g4dot work"></i></div>'}).join('')+'</div>'}
 /* ---------- проекты по категориям ---------- */
 var CATS=[['work','Работа'],['own','Свои'],['rig','Обвязка'],['test','Тесты']];
 function catN(k){for(var i=0;i<CATS.length;i++)if(CATS[i][0]==k)return CATS[i][1];return 'Свои'}
 function stLine(p){var w=p.wait||{};if(w.k&&w.k!='idle')return w.t||'';return (p.sub?p.sub:'свободен')+(p.last&&W.ago?' · '+ago(p.last):'')}
 function dot(p){var k=(p.wait||{}).k;return k=='bad'?'bad':k=='perm'||k=='q'||k=='card'||k=='end'?'wait':p.st=='work'||k=='auto'||k=='work'?'work':''}
 function prow(p,hid){var apps=(p.apps||[]).map(ai).join('');
  return '<div class="g4r tap fx21p" data-a="po86" data-x="'+E(p.id)+'">'+(dot(p)?'<i class="g4dot '+dot(p)+' fx21pd"></i>':'<i class="fx21pd0"></i>')+
   '<div class="g4rt"><b>'+E(p.n)+'</b><span>'+E(hid?'тестовая папка':stLine(p))+'</span></div>'+
   (FS.edit&&!hid?pl('fx21cat',catN(p.cat)+' ▾',{x:p.id,c:p.cat||'own'},'fx21cp'):'<i class="fx21ap">'+apps+'</i>')+'</div>'}
 function srchBox(ph){return '<div class="fx21s"><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg></i><input data-fx21="q" type="search" enterkeyhint="search" placeholder="'+(ph||'Поиск: проект, PR, слово')+'" value="'+E(FS.q)+'" autocomplete="off">'+
   (FS.q?'<b data-a="fx21clr" aria-label="Очистить">×</b>':'')+'</div>'}
 function projects(){var L=(S.prj||[]),H=S.prj_hid||[],h='',vis=0,srch=srchBox();
  CATS.forEach(function(c){var P=c[0]=='test'?[]:L.filter(function(p){return (p.cat||'own')==c[0]&&hit(p.n+' '+stLine(p))});
   if(c[0]=='test'){var T=H.filter(function(p){return hit(p.n)});if(!T.length)return;var op=FS.open.test||!!FS.q;
    h+='<div class="fx21cg"><div class="fx21ch tap" data-a="fx21tg" data-x="test"><b>Тесты</b><span>'+T.length+' · скрыты</span><i class="g4ch'+(op?' fx21up':'')+'">›</i></div>'+
     (op?'<div class="g4card">'+T.map(function(p){return prow(p,1)}).join('')+'</div>':'')+'</div>';return}
   if(!P.length)return;vis+=P.length;
   h+='<div class="fx21cg"><div class="fx21ch"><b>'+c[1]+'</b><span>'+P.length+'</span></div><div class="g4card">'+P.map(function(p){return prow(p)}).join('')+'</div></div>'});
  var more=FS.q.trim().length>1?'<div class="g4card"><div class="g4r tap" data-a="fx21grep">'+ai('')+'<div class="g4rt"><b>Искать «'+E(FS.q.trim())+'» везде</b><span>мозг, журнал, чаты Hermes</span></div><i class="g4ch">›</i></div></div>':'';
  if(FS.q&&!vis&&!h)h='<div class="fx21none">В проектах «'+E(FS.q)+'» нет</div>';
  return sec('Проекты',L.length,'<em class="fx21ed" data-a="fx21edit">'+(FS.edit?'Готово':'Разложить')+'</em>')+srch+h+more}
 var home0=W.home;
 home=function(){var b='';try{b=(W.G4&&G4.banners)?G4.banners():''}catch(e){}
  return '<div class="g4home fx21home fx6q">'+banners21()+need()+rest()+'</div>'};
 /* fx6-quiet: одна тихая строка вместо списков — сколько работает без тебя; тап — вкладка «Проекты» */
 function rest(){var n=(S.going||[]).length,all=(S.prj||[]).length;
  var t=n?'Остальное идёт само · '+n:'Проекты · '+all;
  return '<div class="fx6rest tap" data-a="tab" data-x="prj" role="button"><span>'+E(t)+'</span><i class="g4ch">›</i></div>'}
 /* плашки g4 (остановлено / новая версия / нет связи) — их функция внутри замыкания g4, повторяем по её коду */
 function promo(t,d,btn){return '<div class="g4card g4promo"><div><b>'+t+'</b><span>'+d+'</span></div>'+(btn||'')+'</div>'}
 function banners21(){var h='';
  if(S.pv&&S.pv>VER)h+=promo('Новая версия','Telegram держит старую страницу в кэше',pl('upd','Обновить',{},'w'));
  if(U.cached&&!API)h+=promo('ПК недоступен','Показаны данные '+(S.ts&&W.ago?ago(S.ts):'')+' из кэша. Действия не дойдут');
  else if(U.offline&&API)h+=promo('Нет связи с ПК','Данные '+(S.ts&&W.ago?ago(S.ts):'')+'. Повторяю каждые 15 с');
  return h}
 /* ---------- свои действия ---------- */
 function toast21(t){if(W.toast)toast(t)}
 D.addEventListener('click',function(ev){var t=ev.target.closest&&ev.target.closest('[data-a]');if(!t||!/^fx21/.test(t.dataset.a))return;
  ev.stopPropagation();ev.preventDefault();var a=t.dataset.a,ds=t.dataset;if(W.haptic)haptic('sel');
  if(a=='fx21chat'){if(W.SD3&&SD3.openChat)SD3.openChat(ds.k,ds.id);return}
  if(a=='fx21q'){var c=D.querySelector('[data-q="'+ds.qid+'"]')||D.querySelector('.g4qs');if(c&&c.scrollIntoView)c.scrollIntoView({block:'center',behavior:'smooth'});return}
  if(a=='fx21ob'){send({a:'ob',id:ds.id,k:ds.k});toast21(ds.k=='y'?'Принято, сливаю…':ds.k=='n'?'Принято: не сливаю':'Вопрос ревьюеру — напиши его в боте ответом на карточку');
   if(ds.k!='q'){S.need=(S.need||[]).filter(function(r){return r.id!='ob:'+ds.id});render(true)}return}
  if(a=='fx21qx'){FS.qo[ds.x]=!FS.qo[ds.x];render(true);var c=D.querySelector('[data-g4q="'+ds.x+'"]');if(c&&c.scrollIntoView)c.scrollIntoView({block:'nearest'});return}
  if(a=='fx21tg'){FS.open[ds.x]=!FS.open[ds.x];render(true);return}
  if(a=='fx21edit'){FS.edit=!FS.edit;render(true);return}
  if(a=='fx21cat'){var o=['work','own','rig','test'],i=(o.indexOf(ds.c)+1)%o.length,nc=o[i];send({a:'pcat',pid:ds.x,cat:nc},true);
   (S.prj||[]).forEach(function(p){if(p.id==ds.x)p.cat=nc});if(nc=='test'){S.prj=S.prj.filter(function(p){if(p.id==ds.x){(S.prj_hid=S.prj_hid||[]).push(p);return false}return true})}
   toast21('«'+catN(nc)+'»');render(true);return}
  if(a=='fx21more'){FS.needAll=1;render(true);return}
  if(a=='fx21prj'){U.tab='prj';U.page=null;render();return}
  if(a=='fx21clr'){FS.q='';render(true);return}
  if(a=='fx21grep'){U.tab='br';U.page=null;U.bq=FS.q.trim();U.bfull=1;if(W.grep)grep();render();return}
 },true);
 /* поиск: перерисовка без потери фокуса и места курсора */
 D.addEventListener('input',function(ev){var t=ev.target;if(!t.dataset||t.dataset.fx21!='q')return;FS.q=t.value;var pos=t.selectionStart;render(true);
  var n=D.querySelector('[data-fx21=q]');if(n){n.focus();try{n.setSelectionRange(pos,pos)}catch(e){}}},true);
 W.FX21={rest:rest,st:FS,needAll:needAll,E:E,ai:ai,sec:sec,pl:pl,hit:hit,need:need,going:going,projects:projects,prow:prow,srchBox:srchBox,CATS:CATS,catN:catN,dot:dot,stLine:stLine,banners:banners21};
})();
