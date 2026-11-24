/* gpt18 — панель вне чата в стиле ChatGPT iOS (runbook panel-gpt, gpt18-home-plan / gpt18-g4b).
   v1 (Пульт) пользователь принял словами «задумка неплохая» и попросил: так же нижнюю навигацию, «Проекты», «Мозг», «Ещё»,
   а вопросы Claude/Codex/Hermes — плашками в стиле своего агента.
   Каркас #g4 на ВСЕХ вкладках, кроме «Чата»: шапка как ChatGPT Scheduled (3214_0353.23: ☰ 44 pt, заголовок по центру, капсула справа),
   на вложенных страницах вместо ☰ — круг «‹»; содержимое базы переносится в ленту #g4f (узлы переносятся, не копируются — обработчики
   базы остаются), базовые компоненты перекрашены в карточки ChatGPT Settings (0405.63) стилями g4_home.css (.g4sk).
   Пульт рисуется свой (плашки, сбои, вопросы, «ждёт тебя», проекты). Вопросы и разрешения (qAlert — Пульт и экран проекта):
   Claude — карточка вопроса Claude iOS (3212_0059.41, как в экране чата Claude), Codex/Hermes — карточка ChatGPT (как в экране чата gpt3).
   Нижняя навигация (glass.js) — монохром ChatGPT и значки бокового меню. Данные и действия — базы (data-a, send). */
(function(){
 var W=window,D=document;
 function $i(id){return D.getElementById(id)}
 function E(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
 var OAI='M13.7958 23.893C13.003 23.893 12.2498 23.7423 11.5362 23.441C10.8226 23.1398 10.1883 22.7195 9.6333 22.1804C9.03072 22.3865 8.40436 22.4896 7.75421 22.4896C6.69177 22.4896 5.70862 22.228 4.80476 21.7047C3.90089 21.1814 3.17146 20.4678 2.61645 19.5639C2.0773 18.6601 1.80773 17.6531 1.80773 16.5431C1.80773 16.0833 1.87116 15.5838 1.99802 15.0446C1.36373 14.4579 0.872151 13.784 0.52329 13.0228C0.17443 12.2458 0 11.4371 0 10.5966C0 9.74035 0.182359 8.91578 0.547076 8.12291C0.911794 7.33005 1.41923 6.64818 2.06938 6.07732C2.73538 5.4906 3.50446 5.08624 4.37661 4.86424C4.55104 3.96038 4.91576 3.15165 5.47076 2.43808C6.04162 1.70864 6.73935 1.13778 7.56392 0.725489C8.3885 0.3132 9.26858 0.107056 10.2042 0.107056C10.997 0.107056 11.7502 0.2577 12.4638 0.558988C13.1774 0.860277 13.8117 1.28049 14.3667 1.81964C14.9693 1.6135 15.5956 1.51042 16.2458 1.51042C17.3082 1.51042 18.2914 1.77207 19.1952 2.29536C20.0991 2.81865 20.8206 3.53223 21.3598 4.43609C21.9148 5.33996 22.1923 6.3469 22.1923 7.45691C22.1923 7.91677 22.1288 8.41627 22.002 8.95542C22.6363 9.54214 23.1278 10.224 23.4767 11.001C23.8256 11.7622 24 12.563 24 13.4034C24 14.2597 23.8176 15.0843 23.4529 15.8771C23.0882 16.67 22.5728 17.3598 21.9068 17.9465C21.2567 18.5174 20.4955 18.9138 19.6234 19.1358C19.449 20.0397 19.0763 20.8484 18.5055 21.562C17.9504 22.2914 17.2607 22.8623 16.4361 23.2745C15.6115 23.6868 14.7314 23.893 13.7958 23.893ZM7.96829 20.6581C8.71358 20.6581 9.37166 20.4916 9.94252 20.1586L14.2478 17.6849C14.4222 17.5739 14.5094 17.4232 14.5094 17.2329V15.5679L9.20515 18.6125C8.71358 18.8979 8.222 18.8979 7.73043 18.6125L3.63925 16.2577C3.63925 16.2736 3.63925 16.2973 3.63925 16.3291C3.63925 16.3608 3.63925 16.4004 3.63925 16.448C3.63925 17.225 3.82161 17.9386 4.18632 18.5887C4.5669 19.223 5.09019 19.7225 5.75619 20.0872C6.4222 20.4678 7.15956 20.6581 7.96829 20.6581ZM8.18236 16.781C8.2775 16.8444 8.36472 16.8761 8.444 16.8761C8.52329 16.8603 8.61051 16.8286 8.70565 16.781L10.1566 15.9723L4.87612 12.8801C4.38454 12.6105 4.13875 12.1824 4.13875 11.5957V6.90983C3.44103 7.27455 2.88603 7.78991 2.47374 8.45591C2.0773 9.10606 1.87909 9.82757 1.87909 10.6204C1.87909 11.3657 2.06145 12.0793 2.42616 12.7612C2.80674 13.4272 3.29832 13.9346 3.90089 14.2835L8.18236 16.781ZM13.7721 22.0377C14.5808 22.0377 15.3102 21.8553 15.9604 21.4906C16.6105 21.1259 17.1179 20.6264 17.4827 19.9921C17.8632 19.3578 18.0535 18.6521 18.0535 17.8751V12.9277C18.0535 12.7215 17.9663 12.5709 17.7919 12.4757L16.3409 11.5957V17.7324C16.3409 18.3191 16.0951 18.7473 15.6036 19.0169L11.5362 21.3717C12.2339 21.8157 12.9792 22.0377 13.7721 22.0377ZM14.5094 13.4985V10.5015L12.0119 9.07435L9.49058 10.5015V13.4985L12.0119 14.9257L14.5094 13.4985ZM7.65907 6.26761C7.65907 5.68089 7.90486 5.25274 8.39643 4.98317L12.4638 2.62836C11.7661 2.18436 11.0208 1.96236 10.2279 1.96236C9.43508 1.96236 8.71358 2.14472 8.06343 2.50943C7.41328 2.87415 6.89792 3.37365 6.51734 4.00795C6.15263 4.64224 5.97027 5.34789 5.97027 6.12489V11.0486C5.97027 11.2389 6.05748 11.3974 6.23191 11.5243L7.65907 12.4044V6.26761ZM19.885 17.0902C20.5669 16.7413 21.106 16.2339 21.5025 15.5679C21.9148 14.9019 22.1209 14.1725 22.1209 13.3796C22.1209 12.6343 21.9306 11.9287 21.55 11.2627C21.1853 10.5808 20.7017 10.0654 20.0991 9.71657L15.8176 7.24283C15.7225 7.1794 15.6353 7.15562 15.556 7.17147C15.4767 7.17147 15.3895 7.19526 15.2943 7.24283L13.8434 8.02777L19.1477 11.1437C19.4014 11.2864 19.5837 11.4609 19.6947 11.667C19.8216 11.8573 19.885 12.1031 19.885 12.4044V17.0902ZM14.7948 5.33996C15.2864 5.03867 15.778 5.03867 16.2696 5.33996L20.3608 7.74234C20.3608 7.69476 20.3608 7.64719 20.3608 7.59962C20.3608 6.87019 20.1784 6.1804 19.8137 5.53025C19.4648 4.86424 18.9574 4.33302 18.2914 3.93659C17.6412 3.54016 16.888 3.34194 16.0317 3.34194C15.2864 3.34194 14.6283 3.50844 14.0575 3.84145L9.75223 6.31518C9.5778 6.42618 9.49058 6.57683 9.49058 6.76711V8.43213L14.7948 5.33996Z';
 /* значки: G4V — экран Code (vectorize_g4.py), SDV — боковое меню, G3V — чат ChatGPT, CLV — чат Claude */
 function sv(set,n,c){var v=W[set]&&W[set][n];if(!v)return '';return '<svg class="g4v'+(c?' '+c:'')+'" width="'+v[0]+'" height="'+v[1]+'" viewBox="0 0 '+v[0]+' '+v[1]+'" aria-hidden="true"><path d="'+v[2]+'"/></svg>'}
 function gv(n,c){return sv('G4V',n,c)||sv('SDV',n,c)}
 function ai(k){if(k=='hermes')return '<i class="g4ai g4ai-h"></i>';
  if(k=='claude'){var v=W.CLV&&CLV.spark;return v?'<svg class="g4ai g4ai-c" viewBox="0 0 '+v[0]+' '+v[1]+'" aria-hidden="true"><path d="'+v[2]+'"/></svg>':'<i class="g4ai"></i>'}
  if(k=='codex')return '<svg class="g4ai g4ai-x" viewBox="0 0 24 24" aria-hidden="true"><path d="'+OAI+'"/></svg>';
  return '<span class="g4ai g4ai-s">'+IC('activity')+'</span>'}
 function pill(a,t,x,pid,cls){return '<div class="g4pl'+(cls?' '+cls:'')+'" data-a="'+a+'"'+(x!=null?' data-x="'+E(x)+'"':'')+(pid?' data-pid="'+E(pid)+'"':'')+'>'+t+'</div>'}
 function sec(t,n){return '<div class="g4sh">'+t+(n!=null?'<span>'+n+'</span>':'')+'</div>'}
 function row(o){return '<div class="g4r'+(o.tap?' tap':'')+'"'+(o.a?' data-a="'+o.a+'"':'')+(o.x!=null?' data-x="'+E(o.x)+'"':'')+'>'+(o.ic||'')+
  '<div class="g4rt"><b>'+o.t+'</b>'+(o.d?'<span>'+o.d+'</span>':'')+'</div>'+(o.dot?'<i class="g4dot '+o.dot+'"></i>':'')+(o.r||'')+(o.chev?'<i class="g4ch">'+gv('s_chev')+'</i>':'')+'</div>'}

 /* ---------- шапка: заголовок по вкладке/странице, ☰ или «‹» ---------- */
 var TT={home:'Пульт',prj:'Проекты',br:'Мозг',more:'Ещё',j:'Журнал',set:'Настройки',q:'Пульт'};
 function title(){var p=U.page||'';
  if(p=='prj8'||p=='proj'){var x=W.prjById8&&prjById8(U.pid86||U.pid8||U.pid);return x?x.n:'Проект'}
  if(p=='sys')return 'Система';if(p=='glos')return 'Словарь';if(p=='nowedit')return 'Сейчас';if(p.indexOf('sess:')==0)return 'Сессия';
  if(p.indexOf('doc:')==0){var f=p.slice(4).split('/').pop().replace(/\.md$/,'');return f=='now'?'Сейчас':f||'Мозг'}
  return TT[U.tab]||'Hermes'}
 function sub(){var st=status(),s='';
  if(DIAG)s=DIAG;else if(U.cached)s='кэш · '+ago(S.ts);else if(API&&U.offline)s='нет связи с ПК';else if(!API&&S.ts)s='данные '+ago(S.ts);
  else if(st.c!='ok'&&!S.stopped&&!S.pend.length&&!S.fails)s=st.t.toLowerCase();return s}
 function isSub(){return !!U.page||U.tab=='j'||U.tab=='set'}
 function hdr(){var hb=hBad().length,s=sub();
  return '<div class="g4top"></div><div class="g4hd">'+(isSub()?'<div class="g3gl g4b44 g4bk" data-g4="back" role="button" aria-label="Назад">'+IC('chevron-left')+'</div>'
   :'<div class="g3gl g4b44" data-g4="side" role="button" aria-label="Меню">'+sv('G3V','side')+'</div>')+
   '<div class="g4tt"><b>'+E(title())+'</b>'+(s?'<small>'+E(s)+'</small>':'')+'</div>'+
   '<div class="g3gl g4cap">'+(S.health&&S.health.length?'<i data-a="sys" role="button" aria-label="Система">'+IC('activity')+(hb?'<em class="g4hdot"></em>':'')+'</i>':'')+
   '<i data-a="refresh" role="button" aria-label="Обновить">'+IC('refresh-cw')+'</i></div></div>'}

 /* ---------- плашки сверху: карточка «Do more with ChatGPT» ---------- */
 function promo(t,d,btn,a){return '<div class="g4card g4promo"'+(a?' data-a="'+a+'"':'')+'><div><b>'+t+'</b><span>'+d+'</span></div>'+(btn||'')+'</div>'}
 function banners(){var h='';
  if(S.stopped)h+=promo('Всё остановлено','Автопилот и уведомления выключены',pill('resume','Запустить всё',null,null,'w'));
  if(S.pv&&S.pv>VER)h+=promo('Новая версия','Telegram держит старую страницу в кэше',pill('upd','Обновить',null,null,'w'));
  if(U.cached&&!API)h+=promo('ПК недоступен','Показаны данные '+(S.ts?ago(S.ts):'')+' из кэша. Действия не дойдут');
  else if(U.offline&&API)h+=promo('Нет связи с ПК','Данные '+(S.ts?ago(S.ts):'')+'. Повторяю каждые 15 с');
  else if(stale())h+=promo('Данные '+ago(S.ts),'Снимок кнопки «Панель». Live — кнопка меню «Hermes»',pill('refresh','Обновить',null,null,'w'));
  return h}
 /* ---------- сбои ---------- */
 function faults(){var bad=hBad(),hk=function(k){return bad.filter(function(h){return h.k==k})[0]},f=S.log.filter(function(e){return e.k=='fail'})[0],R=[];
  var win=hk('claude');if(S.fails||win)R.push(row({ic:ai('claude'),t:win?'Окно не отвечает':'Start не прошёл ×'+S.fails,d:E(win?(win.d||''):(f?f.x:'кликер не смог нажать')),
   r:win&&win.fix?pill('fix',E(win.fl||'Перезапустить'),win.k):pill('heal','Проверить')}));
  var gw=hk('gateway'),jb=(S.cj||[]).filter(function(j){return j.on&&!j.ok});
  if(gw)R.push(row({ic:ai('hermes'),t:'Бот не отвечает',d:E(gw.d||'gateway'),r:gw.fix?pill('fix',E(gw.fl||'Перезапустить'),gw.k):pill('sys','Система')}));
  else if(jb.length)R.push(row({ic:ai('hermes'),t:'Сбой задачи',d:E(cronName86(jb[0]))+(jb.length>1?' и ещё '+(jb.length-1):''),r:pill('sys','Система')}));
  var rest=bad.filter(function(h){return h.k!='claude'&&h.k!='gateway'});
  if(rest.length){var fx=rest.filter(function(x){return x.fix})[0];R.push(row({ic:ai('sys'),t:'Система',d:E(rest.map(function(x){return x.n}).join(', ')),r:fx?pill('fix',E(fx.fl||'Перезапустить'),fx.k):pill('sys','Открыть')}))}
  return R.length?sec('Сбои',R.length)+'<div class="g4card">'+R.join('')+'</div>':''}

 /* ---------- вопросы и разрешения в стиле агента ---------- */
 U.g4qt=U.g4qt||{};
 function when(q){return q.ts?ago(q.ts).replace(/ назад$/,''):''}
 function prjOf(q){var p=W.prjById8&&prjById8(q.pid);return p&&proj8().length>1&&!(U.page=='prj8'||U.page=='proj')?p.n:''}
 function optOf(o,d){var s=String(o),m=s.match(/^(.*?)\s*\((Recommended|рекомендуется)\)\s*$/i);return {t:m?m[1]:s,rec:!!m,d:d||''}}
 /* быстрые фразы (Настройки → «Быстрые фразы»): видны, пока поле «Свой ответ» в фокусе; тап подставляет фразу */
 function tpls(q){var L=(S.tpl||[]).slice(0,8);return L.length?'<div class="g4tpl">'+L.map(function(x,i){return '<i data-g4="tpl" data-q="'+E(q.id)+'" data-x="'+i+'">'+E(x)+'</i>'}).join('')+'</div>':''}
 /* Claude iOS (3212_0059.41): тёплая карточка r23, вопрос 20 pt, варианты списком с линиями (заголовок + пояснение), «Свой ответ…», Пропустить / Ответить */
 function qClaude(q){var pj=prjOf(q),t=U.g4qt[q.id]||'';
  var h='<div class="g4cq" data-g4q="'+E(q.id)+'"><div class="g4cqm">'+ai('claude')+'<span>'+(q.perm?'Claude просит разрешение':'Claude спрашивает')+(pj?' · '+E(pj):'')+'</span><em>'+when(q)+'</em></div>';
  if(q.perm){
   h+='<div class="g4cqh">Разрешить?</div>'+(q.cmd?'<pre class="g4cqpre">'+E(q.cmd)+'</pre>':'<div class="g4cqd">'+E(q.q)+'</div>')+
    '<div class="g4cqo" data-a="quick" data-q="'+E(q.id)+'" data-x="0"><b>'+E(q.o[0]=='Allow'?'Разрешить':q.o[0])+'</b><span>Один раз · подтверждение удержанием</span></div>'+
    '<div class="g4cqo bad" data-a="quick" data-q="'+E(q.id)+'" data-x="1"><b>'+E(q.o[1]=='Deny'?'Отклонить':q.o[1])+'</b></div>'+autoLine(q)+'</div>';
   return h}
  h+='<div class="g4cqh">'+E(q.q)+'</div>'+q.o.map(function(o,i){var x=optOf(o,q.od&&q.od[i]),rec=x.rec||i===q.rec;
   return '<div class="g4cqo'+(rec?' rec':'')+'" data-a="quick" data-q="'+E(q.id)+'" data-x="'+i+'"><b>'+E(x.t)+'</b>'+(x.d||rec?'<span>'+(rec?'Рекомендует Claude'+(x.d?' · ':''):'')+E(x.d)+'</span>':'')+'</div>'}).join('')+
   '<div class="g4cqi"><input class="g4qin" data-q="'+E(q.id)+'" placeholder="Свой ответ…" value="'+E(t)+'" autocomplete="off"></div>'+tpls(q)+
   '<div class="g4cqb"><div class="g4cqsk" data-a="qskip" data-q="'+E(q.id)+'">Пропустить</div><div class="g4cqsb'+(t.trim()?' on':'')+'" data-g4="qsend" data-q="'+E(q.id)+'">Ответить</div></div>'+autoLine(q)+'</div>';
  return h}
 /* ChatGPT (экран чата gpt3): карточка #1e1e1e r20, «Codex спрашивает», варианты пилюлями, поле «Свой ответ», Пропустить / Ответить (белая) */
 function qGpt(q){var ag=q.ag=='hermes'?'hermes':'codex',nm=ag=='hermes'?'Hermes':'Codex',pj=prjOf(q),t=U.g4qt[q.id]||'';
  var h='<div class="g4gq" data-g4q="'+E(q.id)+'"><div class="g4gqk">'+ai(ag)+'<b>'+(q.perm?'Нужно разрешение':nm+' спрашивает')+'</b><em>'+when(q)+'</em></div>'+(pj?'<div class="g4gqp">'+E(pj)+'</div>':'');
  if(q.perm){
   h+=(q.cmd?'<div class="g4gqq">'+E(q.q.replace(q.cmd,'').replace(/[:\s]+$/,'')||nm+' хочет выполнить')+'</div><pre class="g4gqpre">'+E(q.cmd)+'</pre>':'<div class="g4gqq">'+E(q.q)+'</div>')+
    '<div class="g4gqb"><div class="g4gpb" data-a="quick" data-q="'+E(q.id)+'" data-x="1">'+E(q.o[1]=='Deny'?'Отклонить':q.o[1])+'</div><div class="g4gpb pri" data-a="quick" data-q="'+E(q.id)+'" data-x="0">'+E(q.o[0]=='Allow'?'Разрешить':q.o[0])+'</div></div>'+autoLine(q)+'</div>';
   return h}
  h+='<div class="g4gqq">'+E(q.q)+'</div><div class="g4gqo">'+q.o.map(function(o,i){var x=optOf(o),rec=x.rec||i===q.rec;
   return '<div class="g4gpb'+(rec?' rec':'')+'" data-a="quick" data-q="'+E(q.id)+'" data-x="'+i+'">'+E(x.t)+'</div>'}).join('')+'</div>'+
   '<div class="g4gqi"><input class="g4qin" data-q="'+E(q.id)+'" placeholder="Свой ответ" value="'+E(t)+'" autocomplete="off"></div>'+tpls(q)+
   '<div class="g4gqb">'+(ag!='hermes'?'<div class="g4gpb" data-a="qskip" data-q="'+E(q.id)+'">Пропустить</div>':'')+'<div class="g4gpb pri'+(t.trim()?'':' dis')+'" data-g4="qsend" data-q="'+E(q.id)+'">Ответить</div></div>'+autoLine(q)+'</div>';
  return h}
 var qa0=qAlert;
 qAlert=function(q){if(U.qopen93==q.id)return qa0(q);return (q.ag||'claude')=='claude'?qClaude(q):qGpt(q)};
 function questions(){var P=S.pend;return P.length?sec('Вопросы',P.length)+'<div class="g4qs">'+P.map(qAlert).join('')+'</div>':''}

 /* ---------- «Ждёт тебя» ---------- */
 function waits(){if(S.stopped||typeof wsub35!='function')return {h:'',urgent:false};
  var L=proj8().filter(function(p){return wsub35(p)});if(!L.length)return {h:'',urgent:false};
  var rank={bad:0,card:1,end:2,pause:3};L.sort(function(a,b){return rank[a.wait.k]-rank[b.wait.k]});
  var R=L.map(function(p){var w=p.wait,k=w.k,ag=w.ag||'claude';
   var btn=k=='card'?pill('clnext','Нажать',null,p.id):k=='pause'?pill('unp35','Снять',ag,p.id):'';
   var sb=k=='card'&&p.cls&&p.cls.card?'«'+E(p.cls.card.title)+'» — нажать?':E(w.t);
   return '<div class="g4r tap" data-a="po86" data-x="'+E(p.id)+'">'+ai(ag)+'<div class="g4rt"><b>'+E(p.n)+'</b><span>'+sb+'</span></div>'+
    (btn?btn:'<i class="g4dot '+(k=='bad'?'bad':'wait')+'"></i>')+'</div>'});
  return {h:sec('Ждёт тебя',L.length)+'<div class="g4card">'+R.join('')+'</div>',urgent:L.some(function(p){return p.wait.k!='pause'})}}
 function projects(){var L=proj8(),bd=L.filter(function(p){return p.st=='bad'}).length,w=L.filter(function(p){return p.st=='wait'}).length,wk=L.filter(function(p){return p.st=='work'}).length,id=L.length-w-wk-bd;
  var parts=[bd?'<em class="bad">'+bd+' '+(bd==1?'сбой':bd<5?'сбоя':'сбоев')+'</em>':'',w?'<em class="wait">'+w+' '+(w==1?'ждёт':'ждут')+'</em>':'',wk?wk+' '+(wk==1?'работает':'работают'):'',id?id+' '+(id==1?'свободен':'свободны'):''].filter(Boolean).join(' · ')||'нет проектов';
  return sec('Проекты',L.length)+'<div class="g4card">'+row({tap:1,a:'tab',x:'prj',ic:'<i class="g4pi">'+gv('g_projects')+'</i>',t:parts,
   d:w||bd?E(L.filter(waiting8).map(function(p){return p.n}).join(', ')):'Все проекты и их агенты',chev:1})+'</div>'}
 function calm(){return '<div class="g4calm">'+gv('cc_done')+'<div><b>Всё спокойно</b><span>Вопросов и сбоев нет</span></div></div>'}
 home=function(){var fl=faults(),q=questions(),wt=waits();
  var c=!S.pend.length&&!fl&&!S.stopped&&!wt.urgent?calm():'';
  return '<div class="g4home">'+banners()+fl+q+c+wt.h+projects()+'</div>'};

 /* ---------- каркас: всё, что нарисовала база на #scr, переезжает в ленту #g4f ---------- */
 var last={k:'',y:0};
 function chatTab(){return U.tab=='hc'||U.page=='hcchat'}
 function wrap(keep,y0){var sc=$i('scr');if(!sc||W.LOADING||chatTab()){D.body.classList.remove('g4on');return}
  var k=U.tab+'/'+(U.page||''),y=last.k==k&&keep?(y0!=null?y0:last.y):0;
  var g=D.createElement('div');g.className='g4';g.id='g4';
  g.innerHTML='<div class="g4f" id="g4f"><div class="g4l g4sk" id="g4l"></div></div>'+hdr();
  var l=g.querySelector('#g4l');while(sc.firstChild)l.appendChild(sc.firstChild);
  colGroups(l);sc.appendChild(g);D.body.classList.add('g4on');
  var f=$i('g4f');f.scrollTop=y;last.k=k;last.y=y;
  f.addEventListener('scroll',function(){last.y=f.scrollTop},{passive:true});
  if(W.SD3&&SD3.SD&&SD3.SD.on&&SD3.at)SD3.at(SD3.SD.pos||0)}
 /* сворачиваемые секции базы (colSec: «Ночью не беспокоить», «Токены»…) идут подряд голыми заголовками — собираем каждую серию в одну
    карточку со строками, как группа ChatGPT Settings; раскрытое тело остаётся внутри той же карточки */
 function colGroups(l){var runs=[],cur=null;
  [].forEach.call(l.querySelectorAll('.sec'),function(s){var h=s.firstElementChild;if(!h||!h.classList.contains('col'))return;
   if(cur&&cur[cur.length-1].nextElementSibling===s)cur.push(s);else{cur=[s];runs.push(cur)}});
  runs.forEach(function(r){var c=D.createElement('div');c.className='g4colg';r[0].parentNode.insertBefore(c,r[0]);r.forEach(function(s){c.appendChild(s)})});
  ftn(l)}
 /* Настройки: «Отвечать за меня · по умолчанию» в строке не влезал рядом с «выкл», а подсказка sw35 живёт в теле раздела —
    в g4 строка короткая, а «это умолчания для новых проектов» — подпись под карточкой (сноска группы iOS), видна и в свёрнутом виде */
 function ftn(l){if(U.tab!='set')return;
  /* «+ разово» внутри «Когда работать»: пустая строка с ссылкой у самого края → строка-действие «+ Разовое действие» под переключателем */
  [].forEach.call(l.querySelectorAll('.g4colg .grp>.sh>a[data-a=atsheet]'),function(a){var sh=a.parentNode;sh.classList.add('g4add');a.textContent='+ Разовое действие';sh.parentNode.appendChild(sh)});
  [].forEach.call(l.querySelectorAll('.g4colg .sh.col>span:first-child'),function(sp){
   if(!/^(Автоответ|Отвечать за меня)( · по умолчанию)?$/.test(sp.textContent.trim()))return;sp.textContent=sp.textContent.replace(' · по умолчанию','');
   var g=sp.closest('.g4colg');if(!g||(g.nextElementSibling&&g.nextElementSibling.classList.contains('g4ftn')))return;
   var f=D.createElement('div');f.className='g4ftn';f.textContent='«'+sp.textContent.trim()+'» — значения по умолчанию для новых проектов. У каждого проекта свои: Проекты → проект → Claude.';g.parentNode.insertBefore(f,g.nextSibling)})}
 /* пока печатаешь свой ответ в карточке вопроса — опрос не перерисовывает экран (иначе поле теряет фокус) */
 var hold=0;
 function typing(){var a=D.activeElement;return a&&a.classList&&a.classList.contains('g4qin')}
 var _r=render;render=function(keep){if(keep&&typing()){hold=1;return}hold=0;var f0=$i('g4f'),y0=f0?f0.scrollTop:null;_r.apply(this,arguments);wrap(keep,y0)};
 D.addEventListener('focusout',function(e){if(e.target.classList&&e.target.classList.contains('g4qin')&&hold)setTimeout(function(){if(!typing()&&hold){hold=0;render(true)}},250)});
 D.addEventListener('input',function(e){var t=e.target;if(!t.classList||!t.classList.contains('g4qin'))return;U.g4qt[t.dataset.q]=t.value;
  var b=t.closest('[data-g4q]');b=b&&b.querySelector('[data-g4=qsend]');if(b){b.classList.toggle('on',!!t.value.trim());b.classList.toggle('dis',!t.value.trim())}},true);
 D.addEventListener('keydown',function(e){var t=e.target;if(e.key=='Enter'&&t.classList&&t.classList.contains('g4qin')){e.preventDefault();sendOwn(t.dataset.q)}},true);
 function sendOwn(id){var t=(U.g4qt[id]||'').trim();if(!t){try{toast('Напиши ответ')}catch(e){}return}
  delete U.g4qt[id];try{D.activeElement&&D.activeElement.blur()}catch(e){}send({a:'ans',q:id,k:'o',t:t})}
 /* клики каркаса */
 D.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-g4]');if(!b)return;var a=b.dataset.g4;
  if(a=='side'){e.preventDefault();e.stopPropagation();if(W.SD3)SD3.open();return}
  if(a=='back'){e.preventDefault();e.stopPropagation();try{haptic('sel')}catch(x){}if(U.page){back()}else{U.tab='more';U.page=null;render()}return}
  if(a=='qsend'){e.preventDefault();e.stopPropagation();sendOwn(b.dataset.q);return}
  if(a=='tpl'){e.preventDefault();e.stopPropagation();var id=b.dataset.q,v=(S.tpl||[])[+b.dataset.x]||'',c=b.closest('[data-g4q]'),inp=c&&c.querySelector('.g4qin');
   U.g4qt[id]=v;if(inp){inp.value=v;inp.focus();inp.dispatchEvent(new Event('input',{bubbles:true}))}}},true);
 /* фразы видны, пока поле в фокусе (без перерисовки: класс на карточке); тап по фразе не уводит фокус */
 D.addEventListener('focusin',function(e){var t=e.target;if(t.classList&&t.classList.contains('g4qin')){var c=t.closest('[data-g4q]');if(c)c.classList.add('g4typ')}});
 D.addEventListener('focusout',function(e){var t=e.target;if(t.classList&&t.classList.contains('g4qin')){var c=t.closest('[data-g4q]');setTimeout(function(){if(c&&!(D.activeElement&&c.contains(D.activeElement)&&D.activeElement.classList.contains('g4qin')))c.classList.remove('g4typ')},200)}});
 D.addEventListener('pointerdown',function(e){if(e.target.closest&&e.target.closest('[data-g4=tpl]'))e.preventDefault()},true);
 /* «потянуть вниз = обновить» базы смотрит на прокрутку окна — у каркаса своя: только от верха ленты */
 D.addEventListener('touchstart',function(e){var f=$i('g4f');if(f&&f.contains(e.target)&&f.scrollTop>0)W.PY=null},{passive:true});
 /* нижняя панель едет вместе с экраном, когда открыто боковое меню */
 var MO=new MutationObserver(function(){var g=$i('g4'),n=$i('nav');if(!n)return;var t=g&&g.style.transform||'';n.style.transform=t;n.style.transition=t?'none':''});
 setInterval(function(){var g=$i('g4');if(g&&!g.__g4w){g.__g4w=1;MO.observe(g,{attributes:true,attributeFilter:['style']})}},300);
 /* ---------- нижняя навигация: один набор чистых линейных значков 24×24, штрих 1.8 (как SF Symbols / значки ChatGPT).
    Значки «Пульт»/«Мозг», вырезанные из кадров (Remote / Library), на 21 pt выходили кривыми — пользователь 23.11 ---------- */
 var NP={home:'<path d="M3.34 19a10 10 0 1 1 17.32 0"/><path d="m12 14 4-4"/><circle cx="12" cy="14" r="1.2" fill="currentColor" stroke="none"/>',
  prj:'<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
  hc:'<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
  br:'<rect width="8" height="18" x="3" y="3" rx="1"/><path d="M7 3v18"/><path d="M20.4 18.9c.2.5-.1 1.1-.6 1.3l-1.9.7c-.5.2-1.1-.1-1.3-.6L11.1 5.1c-.2-.5.1-1.1.6-1.3l1.9-.7c.5-.2 1.1.1 1.3.6Z"/>',
  more:'<circle cx="5" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.6" fill="currentColor" stroke="none"/>'};
 function nic(k,c){return NP[k]?'<svg class="g4ni'+(c?' '+c:'')+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+NP[k]+'</svg>':''}
 function navIc(){var n=$i('nav');if(!n)return;[].forEach.call(n.querySelectorAll('[data-x]'),function(el){var i=el.querySelector('i');if(!i||i.__g4)return;
  var h=nic(el.dataset.x);if(h){i.innerHTML=h;i.__g4=1}})}
 /* боковое меню: те же значки у «Пульт» и «Мозг»; на экранах вне чата в шапке меню нет кружка поиска
    (пользователь: выглядел обрезанным; поиск есть в «Все сессии» / «Все чаты») */
 function sideFix(){var m=$i('sd3');if(!m)return;var on=m.classList.contains('on')&&!!$i('g4');if(m.classList.contains('g4side')!=on)m.classList.toggle('g4side',on);
  ['home','br'].forEach(function(k){[].forEach.call(m.querySelectorAll('[data-sd=tab][data-x='+k+']'),function(r){var v=r.querySelector('svg');if(v&&!v.classList.contains('g4ni'))v.outerHTML=nic(k,'g4sdi')})});
  /* fx1: меню, открытое вне чата, — меню панели: заголовок «Hermes», выделен текущий раздел, а не агент последнего чата */
  if(!on)return;var tt=m.querySelector('.sd3tt');if(tt&&tt.textContent!='Hermes'&&!tt.querySelector('svg'))tt.textContent='Hermes';
  var cur=U.page?'':({home:'home',q:'home',prj:'prj',br:'br',j:'j',set:'set'})[U.tab]||'';
  [].forEach.call(m.querySelectorAll('.sd3ag8.on'),function(r){r.classList.remove('on')});
  [].forEach.call(m.querySelectorAll('[data-sd=tab].sd3nv'),function(r){var o=r.dataset.x==cur;if(r.classList.contains('on')!=o)r.classList.toggle('on',o)})}
 /* fx1: в «Чате» фон страницы под нижней панелью = фон экрана чата (был холодно-синий --bg базы под тёплым Claude) */
 function bgSync(){var r=$i('hcroot'),de=D.documentElement,c='';if(!$i('g4')&&r&&r.getClientRects().length){c=getComputedStyle(r).backgroundColor;if(c=='rgba(0, 0, 0, 0)'||c=='transparent')c=''}
  if(de.style.backgroundColor!=c){de.style.backgroundColor=c;D.body.style.backgroundColor=c}}
 new MutationObserver(bgSync).observe(D.body,{attributes:true,attributeFilter:['class']});setInterval(bgSync,1000);
 var SMO=new MutationObserver(sideFix);
 setInterval(function(){var m=$i('sd3');if(m&&!m.__g4o){m.__g4o=1;SMO.observe(m,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});sideFix()}},300);
 if(typeof nav86=='function'){var n0=nav86;nav86=function(){n0.apply(this,arguments);navIc();D.body.classList.add('g4nav')}}
 setTimeout(function(){navIc();D.body.classList.add('g4nav')},0);
 W.G4={wrap:wrap,title:title,qClaude:qClaude,qGpt:qGpt,main:function(){return $i('g4')}};
})();
