/* gpt17 — боковое меню ☰ 1:1 с записями экрана iPhone (runbook panel-gpt, gpt17-side-plan).
   Вид ChatGPT для чатов Hermes/Codex (IMG_3214), вид Claude для чатов Claude (IMG_3212/3213).
   Меню лежит ПОД экраном чата (#g3 / #cl3), экран отъезжает вправо (310 / 320.3 pt), затемняется, левые углы скругляются.
   В меню: разделы панели (Пульт, Проекты, Мозг, Журнал, Настройки — нижние вкладки в чате скрыты), закреплённые и недавние
   чаты ВСЕХ агентов, «все чаты» (экран «Недавние» с поиском, фильтром и выбором), долгое нажатие на чат (закрепить,
   переименовать, в архив, удалить), «новый чат», аватар → Настройки. Данные и действия — те же маршруты, что у базы:
   /api/hc/sessions, /cc/sessions, /cx/sessions, PATCH/DELETE sessions/<id>, /gx/archive; переход в чат — действия базы
   [data-hc=kind|open|new], переход в разделы — [data-a=tab|sys|stopsheet]. База, VER и make_app.py не тронуты. */
(function(){
 var D=document,B=D.body,W=window;
 function $i(id){return D.getElementById(id)}
 function st(){return W.HC&&HC.st}
 function E(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
 function T(m){try{toast(m)}catch(e){}}
 function haptic(t){try{t=='ok'?tg.HapticFeedback.notificationOccurred('success'):t=='sel'?tg.HapticFeedback.selectionChanged():tg.HapticFeedback.impactOccurred('light')}catch(e){}}
 function lsg(k,d){try{return W.LS?LS.get(k,d):d}catch(e){return d}}
 function lss(k,v){try{W.LS&&LS.set(k,v)}catch(e){}}
 var KN={hermes:'Hermes',claude:'Claude',codex:'Codex'};
 /* значки из кадров (sd_icons.js), размер в pt как в кадре */
 function ic(n,c){var v=W.SDV&&SDV[n];if(!v)return '';return '<svg class="sd3v sd3v-'+n+(c?' '+c:'')+'" width="'+v[0]+'" height="'+v[1]+'" viewBox="0 0 '+v[0]+' '+v[1]+'" aria-hidden="true"><path d="'+v[2]+'"/></svg>'}
 /* ---------- данные: списки чатов трёх агентов ---------- */
 var SD={on:false,sty:'g',X:310,L:{hermes:null,claude:null,codex:null},err:{},flt:'all',ag:'',q:'',fx:null,sel:null,rc:false,anim:null,loadT:0};
 var PINS=lsg('sd3pin',{});
 function api(p,o){o=o||{};var h={'X-Init-Data':W.tg?tg.initData:''};if(o.body!==undefined)h['Content-Type']='application/json';
  return fetch(String(W.API||'').replace(/\/$/,'')+'/api/hc'+p,{method:o.method||'GET',headers:h,body:o.body!==undefined?JSON.stringify(o.body):undefined})
   .then(function(r){if(r.ok)return r.json();return r.json().catch(function(){return{}}).then(function(j){throw new Error(j.text||j.error||('HTTP '+r.status))})})}
 function base(k){return k=='claude'?'/cc':k=='codex'?'/cx':''}
 /* s4c-5a: списки чатов кэшируются (localStorage sd3L_<агент>) и рисуются сразу при запуске — «Недавние» и «твой ход» без мигания и без
    «Загружаю чаты X…»; свежий ответ перерисовывает меню, только если что-то изменилось */
 var LPATH={hermes:function(){return '/sessions?limit=100'+(lsg('hcall',false)||lsg('sd3all',false)?'&all=1':'')},claude:function(){return '/cc/sessions?limit=60'+(lsg('sd3all',false)?'&all=1':'')},codex:function(){return '/cx/sessions?limit=60'}};
 ['hermes','claude','codex'].forEach(function(k){var c=lsg('sd3L_'+k,null);if(c&&c.length!=null)SD.L[k]=c});SD.ldT={};
 function loadK(k){if(SD.fx)return;SD.ldT[k]=Date.now();
  return api(LPATH[k]()).then(function(d){var L=(d.s||[]).filter(function(x){return !(x.new&&W.HC&&HC.phantom&&HC.phantom(k,x))&&!(W.S5D&&S5D.hide(k,x))/*s5-side*/})/*s4a-ph*/.map(function(x){var y={};for(var q in x)y[q]=x[q];y.k=k;return y}),j=JSON.stringify(L),same=SD.L[k]&&SD.lj&&SD.lj[k]==j;
   SD.lj=SD.lj||{};SD.lj[k]=j;SD.L[k]=L;SD.err[k]='';if(!same)lss('sd3L_'+k,L);tsync(k);toastOff(k);if(!same)paint()})
   .catch(function(e){SD.err[k]=e.message;if(!SD.L[k])SD.L[k]=[];paint()})}
 function load(force){if(SD.fx)return;if(!force&&Date.now()-SD.loadT<4000)return;SD.loadT=Date.now();['hermes','claude','codex'].forEach(loadK)}
 function toastOff(k){var t=$i('toast');if(t&&t.classList.contains('on')&&t.textContent.indexOf('Загружаю чаты '+KN[k])>=0)t.classList.remove('on')}
 /* s4c-4: название открытого чата берём из свежего списка (автоназвание Hermes после первого ответа) — шапка и меню сразу одинаковые */
 function tsync(k){var s=st();if(!s||s.kind!=k||!s.sid||s.view!='chat')return;var x=(SD.L[k]||[]).filter(function(y){return y.id==s.sid})[0];
  if(x&&x.t&&x.t!=s.title){s.title=x.t;try{HC.paint()}catch(e){}}}
 function pinned(x){return x.k=='hermes'?!!x.pin:!!PINS[x.k+':'+x.id]}
 function all(){var r=[];['hermes','claude','codex'].forEach(function(k){(SD.L[k]||[]).forEach(function(x){r.push(x)})});
  /* текущий чат — всегда в списке (новый ещё не пришёл с сервера) */
  var s=st();if(s&&s.sid&&!r.some(function(x){return x.k==s.kind&&x.id==s.sid}))r.push({k:s.kind,id:s.sid,t:s.title||'Новый чат',ts:Date.now()/1000,rw:s.rw,pin:s.pin});
  return r.sort(function(a,b){return (b.ts||0)-(a.ts||0)})}
 function isCur(x){var s=st();return !!(s&&s.view=='chat'&&s.kind==x.k&&s.sid==x.id)}
 function ago(ts){if(!ts)return '';var m=Math.max(0,Math.round((Date.now()/1000-ts)/60));if(m<1)return 'только что';if(m<60)return m+' мин назад';var h=Math.floor(m/60);if(h<24)return h+' ч назад';
  var d=Math.floor(h/24);return d==1?'Вчера':d<7?d+' дн назад':d<14?'На прошлой неделе':new Date(ts*1000).toLocaleDateString('ru',{day:'numeric',month:'long'})}
 function waits(x){return !!(x.wait||x.stc=='blocked')}
 /* ---------- главный экран (тот, что отъезжает) ---------- */
 function main(){return $i('cl3')||$i('g3')||$i('g4')}/* gpt18: на Пульте отъезжает #g4 */
 function sty(){var s=st();/*s4c-3: облик меню следует агенту и вне чата (Проекты, Пульт…)*/return s&&s.kind=='claude'?'c':'g'}
 /* кривые по реальным pts кадров (fit_spring.py): ChatGPT 316.93–317.23 с записи 3214 — 309 мс cubic-bezier(.25,1,.3,1) RMS 0.004;
    Claude 10.19–10.51 с записи 3213 — пружина response 0.19, damping 1.0 (256 мс до 1 px) RMS 0.003 */
 var EZ={g:{d:309,e:'cubic-bezier(.25,1,.3,1)'},c:{d:256,e:'linear(0, 0.049, 0.158, 0.286, 0.412, 0.526, 0.625, 0.706, 0.773, 0.825, 0.867, 0.899, 0.924, 0.943, 0.957, 0.968, 0.976, 0.983, 0.987, 0.991, 0.993, 0.995, 0.996, 0.997, 1)'}};
 var RAD={g:'55px',c:'55px'};
 function setPos(m,x){if(!m)return;var k=x/SD.X;m.classList.add('sd3main');m.style.transform=x?'translateX('+x+'px)':'';m.style.borderTopLeftRadius=m.style.borderBottomLeftRadius=x>0.5?Math.min(55,x*0.6).toFixed(1)+'px':'';
  var dm=m.__dm;if(!dm||dm.parentNode!==m){dm=m.__dm=D.createElement('i');dm.className='sd3dm';m.appendChild(dm)}dm.style.opacity=Math.max(0,Math.min(1,k)).toFixed(3);var p=$i('sd3');if(p){/* меню видно только слева от края чата: по стеку базы оно оказывается ПОВЕРХ экрана чата и просвечивало при закрытии */
   p.style.clipPath='inset(0 '+Math.max(0,SD.X-x).toFixed(2)+'px 0 0)';p.style.opacity=(0.6+0.4*Math.min(1,k)).toFixed(3);if(SD.sty=='g'){var pl=p.querySelector('.sd3pl');if(pl)pl.style.transform='translateX('+(-47.3*(1-Math.min(1,k))).toFixed(2)+'px)'}}}
 function animTo(x,cb,dur,ease){var m=main(),jk={l:performance.now(),mx:0,n:0},from=SD.pos||0,ez=ease?{d:dur,e:ease}:EZ[SD.sty],t0=performance.now(),d=dur||ez.d;if(SD.anim)cancelAnimationFrame(SD.anim);
  /* одна кривая на все свойства: считаем прогресс по той же функции времени, что и CSS (WAAPI-анимация-носитель) */
  var probe=D.createElement('i');probe.style.cssText='position:fixed;left:0;top:0;width:0;height:0;pointer-events:none';B.appendChild(probe);
  var a=probe.animate?probe.animate([{left:'0px'},{left:'1000px'}],{duration:d,easing:ez.e,fill:'forwards'}):null;
  function step(){var nw=performance.now();if(jk.n++){jk.mx=Math.max(jk.mx,nw-jk.l)}jk.l=nw;if(!SD.on&&x>0){/*s4c-1c*/probe.remove();SD.anim=null;SD.pos=0;setPos(main(),0);cover();return}var p=a?parseFloat(getComputedStyle(probe).left)/1000:Math.min(1,(performance.now()-t0)/d);var v=from+(x-from)*p;SD.pos=v;setPos(main(),v);cover();
   if((a&&a.playState=='finished')||(!a&&p>=1)){if(jk.mx>60&&W.cbDiag)cbDiag('sd_jank',{max:Math.round(jk.mx),n:jk.n,x:Math.round(x),nodes:D.getElementsByTagName('*').length});probe.remove();SD.anim=null;SD.pos=x;setPos(main(),x);cover();cb&&cb();return}SD.anim=requestAnimationFrame(step)}
  SD.anim=requestAnimationFrame(step);SD.cur={probe:probe,a:a}}
 function cover(){var c=$i('sd3cv');if(!c)return;var on=SD.on&&(SD.pos||0)>0;c.classList.toggle('on',on);if(on)c.style.left=Math.round(SD.pos)+'px'}
 /* ---------- разметка меню ---------- */
 function navRows(){if(SD.fx&&SD.fx.nav)return SD.fx.nav;
  /* s5-2: сверху пункты родного приложения, ниже наши разделы группой «Панель»; Настройки — лист из аватара (развилки 1–2) */
  if(W.G7&&G7.nav)return G7.nav(SD.sty);
  return SD.sty=='g'?[['home','g_remote','Пульт'],['prj','g_projects','Проекты'],['br','g_library','Мозг'],['j','g_sched','Журнал'],['set','g_custom','Настройки']]
   :[['home','c_code','Пульт'],['prj','c_projects','Проекты'],['br','c_artifacts','Мозг'],['j','c_sched','Журнал'],['set','s_gear','Настройки']]}
 function rowIc(x){if(x.ic)return x.ic;if(SD.sty=='g')return 'g_bubble';if(x.src=='cron'||x.sched)return 'c_clock';/*s5-2: значок типа как Recents Claude iOS*/return x.k=='codex'||x.k=='claude'?'c_code2':'c_bubble'}
 function agLbl(x){var s=st();return KN[x.k]&&s&&x.k!=s.kind?'<span class="sd3ag">'+KN[x.k]+'</span>':''}
 function chatRow(x,kind){/* kind: ch (с ○), rc (недавние ChatGPT без значка) */
  var on=x.on!=null?x.on:isCur(x),noic=SD.sty=='g'&&kind=='rc';
  return '<div class="sd3r '+kind+(on?' on':'')+'" data-sd="open" data-k="'+E(x.k||'')+'" data-id="'+E(x.id||'')+'">'+(noic?'':ic(rowIc(x)))+'<b>'+E(x.t||'Без названия')+'</b>'+agLbl(x)+(x.dot||waits(x)?'<i class="sd3dot"></i>':'')+'</div>'}
 /* ---------- агенты сверху меню (gpt17-agents): значок, состояние, тап = последний чат агента, долгое = новый ---------- */
 var OAI='M13.7958 23.893C13.003 23.893 12.2498 23.7423 11.5362 23.441C10.8226 23.1398 10.1883 22.7195 9.6333 22.1804C9.03072 22.3865 8.40436 22.4896 7.75421 22.4896C6.69177 22.4896 5.70862 22.228 4.80476 21.7047C3.90089 21.1814 3.17146 20.4678 2.61645 19.5639C2.0773 18.6601 1.80773 17.6531 1.80773 16.5431C1.80773 16.0833 1.87116 15.5838 1.99802 15.0446C1.36373 14.4579 0.872151 13.784 0.52329 13.0228C0.17443 12.2458 0 11.4371 0 10.5966C0 9.74035 0.182359 8.91578 0.547076 8.12291C0.911794 7.33005 1.41923 6.64818 2.06938 6.07732C2.73538 5.4906 3.50446 5.08624 4.37661 4.86424C4.55104 3.96038 4.91576 3.15165 5.47076 2.43808C6.04162 1.70864 6.73935 1.13778 7.56392 0.725489C8.3885 0.3132 9.26858 0.107056 10.2042 0.107056C10.997 0.107056 11.7502 0.2577 12.4638 0.558988C13.1774 0.860277 13.8117 1.28049 14.3667 1.81964C14.9693 1.6135 15.5956 1.51042 16.2458 1.51042C17.3082 1.51042 18.2914 1.77207 19.1952 2.29536C20.0991 2.81865 20.8206 3.53223 21.3598 4.43609C21.9148 5.33996 22.1923 6.3469 22.1923 7.45691C22.1923 7.91677 22.1288 8.41627 22.002 8.95542C22.6363 9.54214 23.1278 10.224 23.4767 11.001C23.8256 11.7622 24 12.563 24 13.4034C24 14.2597 23.8176 15.0843 23.4529 15.8771C23.0882 16.67 22.5728 17.3598 21.9068 17.9465C21.2567 18.5174 20.4955 18.9138 19.6234 19.1358C19.449 20.0397 19.0763 20.8484 18.5055 21.562C17.9504 22.2914 17.2607 22.8623 16.4361 23.2745C15.6115 23.6868 14.7314 23.893 13.7958 23.893ZM7.96829 20.6581C8.71358 20.6581 9.37166 20.4916 9.94252 20.1586L14.2478 17.6849C14.4222 17.5739 14.5094 17.4232 14.5094 17.2329V15.5679L9.20515 18.6125C8.71358 18.8979 8.222 18.8979 7.73043 18.6125L3.63925 16.2577C3.63925 16.2736 3.63925 16.2973 3.63925 16.3291C3.63925 16.3608 3.63925 16.4004 3.63925 16.448C3.63925 17.225 3.82161 17.9386 4.18632 18.5887C4.5669 19.223 5.09019 19.7225 5.75619 20.0872C6.4222 20.4678 7.15956 20.6581 7.96829 20.6581ZM8.18236 16.781C8.2775 16.8444 8.36472 16.8761 8.444 16.8761C8.52329 16.8603 8.61051 16.8286 8.70565 16.781L10.1566 15.9723L4.87612 12.8801C4.38454 12.6105 4.13875 12.1824 4.13875 11.5957V6.90983C3.44103 7.27455 2.88603 7.78991 2.47374 8.45591C2.0773 9.10606 1.87909 9.82757 1.87909 10.6204C1.87909 11.3657 2.06145 12.0793 2.42616 12.7612C2.80674 13.4272 3.29832 13.9346 3.90089 14.2835L8.18236 16.781ZM13.7721 22.0377C14.5808 22.0377 15.3102 21.8553 15.9604 21.4906C16.6105 21.1259 17.1179 20.6264 17.4827 19.9921C17.8632 19.3578 18.0535 18.6521 18.0535 17.8751V12.9277C18.0535 12.7215 17.9663 12.5709 17.7919 12.4757L16.3409 11.5957V17.7324C16.3409 18.3191 16.0951 18.7473 15.6036 19.0169L11.5362 21.3717C12.2339 21.8157 12.9792 22.0377 13.7721 22.0377ZM14.5094 13.4985V10.5015L12.0119 9.07435L9.49058 10.5015V13.4985L12.0119 14.9257L14.5094 13.4985ZM7.65907 6.26761C7.65907 5.68089 7.90486 5.25274 8.39643 4.98317L12.4638 2.62836C11.7661 2.18436 11.0208 1.96236 10.2279 1.96236C9.43508 1.96236 8.71358 2.14472 8.06343 2.50943C7.41328 2.87415 6.89792 3.37365 6.51734 4.00795C6.15263 4.64224 5.97027 5.34789 5.97027 6.12489V11.0486C5.97027 11.2389 6.05748 11.3974 6.23191 11.5243L7.65907 12.4044V6.26761ZM19.885 17.0902C20.5669 16.7413 21.106 16.2339 21.5025 15.5679C21.9148 14.9019 22.1209 14.1725 22.1209 13.3796C22.1209 12.6343 21.9306 11.9287 21.55 11.2627C21.1853 10.5808 20.7017 10.0654 20.0991 9.71657L15.8176 7.24283C15.7225 7.1794 15.6353 7.15562 15.556 7.17147C15.4767 7.17147 15.3895 7.19526 15.2943 7.24283L13.8434 8.02777L19.1477 11.1437C19.4014 11.2864 19.5837 11.4609 19.6947 11.667C19.8216 11.8573 19.885 12.1031 19.885 12.4044V17.0902ZM14.7948 5.33996C15.2864 5.03867 15.778 5.03867 16.2696 5.33996L20.3608 7.74234C20.3608 7.69476 20.3608 7.64719 20.3608 7.59962C20.3608 6.87019 20.1784 6.1804 19.8137 5.53025C19.4648 4.86424 18.9574 4.33302 18.2914 3.93659C17.6412 3.54016 16.888 3.34194 16.0317 3.34194C15.2864 3.34194 14.6283 3.50844 14.0575 3.84145L9.75223 6.31518C9.5778 6.42618 9.49058 6.57683 9.49058 6.76711V8.43213L14.7948 5.33996Z';
 function agIc(k){if(k=='hermes')return '<i class="sd3ai sd3ai-h"></i>';
  if(k=='claude'){var v=W.CLV&&CLV.spark;return v?'<svg class="sd3ai sd3ai-c" viewBox="0 0 '+v[0]+' '+v[1]+'" aria-hidden="true"><path d="'+v[2]+'"/></svg>':'<i class="sd3ai"></i>'}
  return '<svg class="sd3ai sd3ai-x" viewBox="0 0 24 24" aria-hidden="true"><path d="'+OAI+'"/></svg>'}
 function agState(k){var L=SD.L[k]||[],w=L.filter(waits).length,lv=L.filter(function(x){return x.live&&!waits(x)}).length;
  /* fx1: «ждёт ответа · 12» путали с вопросами (на Пульте «вопросов нет»): это чаты, где агент закончил и ход за тобой */
  return w?{t:'твой ход'+(w>1?' · '+w:''),dot:1}:lv?{t:'идёт'+(lv>1?' · '+lv:'')+' сейчас'}:{t:''}}
 function agRows(){var s=st(),cur=s&&s.kind;return ['hermes','claude','codex'].map(function(k){var a=agState(k);
  return '<div class="sd3r sd3ag8'+(k==cur?' on':'')+'" data-sd="agent" data-k="'+k+'">'+agIc(k)+'<b>'+KN[k]+'</b>'+(a.t?'<span class="sd3as">'+E(a.t)+'</span>':'')+(a.dot?'<i class="sd3dot"></i>':'')+'</div>'}).join('')+'<div class="sd3r sd3ag8 sd3fold" data-sd="all">'+ic('c_fall')/*vb7d: не тот же значок, что «Проекты»*/+'<b>Все сессии</b><span class="sd3as">по папкам</span></div><div class="sd3gap"></div>'}
 function lastOf(k){var M=lsg('sd3lastk',{})||{},L=(SD.L[k]||[]).filter(function(x){return x.src!='cron'}),id=M[k];if(id&&L.some(function(x){return x.id==id}))return id;
  var a=L.slice().sort(function(x,y){return (y.ts||0)-(x.ts||0)})[0];return a&&a.id}
 function goAgent(k,n){var s=st();if(s&&s.kind==k&&s.view=='chat'){close();return}var id=lastOf(k);
  if(SD.L[k]==null){n=n||0;if(!n){T('Загружаю чаты '+KN[k]+'…');load(true)}if(n<40)setTimeout(function(){goAgent(k,n+1)},150);return}
  if(id)openChat(k,id);else newChat(k)}
 function sideHtml(){var g=SD.sty=='g',fx=SD.fx,s=st(),h='<div class="sd3sc" id="sd3sc"><div class="sd3pl"><div class="sd3ls">';
  if(!fx)h+=agRows();
 h+=navRows().map(function(n){if(n[0]=='-')return '<div class="g7nh">'+E(n[2])+'</div>';var on=fx&&fx.navOn==n[2];return '<div class="sd3r sd3nv'+(on?' on':'')+'" data-sd="tab" data-x="'+n[0]+'">'+ic(n[1]||'')+'<b>'+E(n[2])+'</b></div>'}).join('');
  /* меню показывает чаты ТОЛЬКО выбранного агента (решение пользователя); все агенты вместе — экран «Все сессии» */
  var ck=s&&s.kind,A=fx?null:all().filter(function(x){return x.k==ck}),P=fx?fx.pins:A.filter(pinned),R=fx?fx.rec:A.filter(function(x){return !pinned(x)&&!(x.src=='cron'&&!isCur(x))});
  /* «Идёт сейчас» — только когда что-то идёт (как раньше в списке базы) */
  var LV=fx?[]:A.filter(function(x){return x.live&&!isCur(x)});if(LV.length){h+='<div class="sd3sh first">Идёт сейчас</div>'+LV.map(function(x){return chatRow(x,'ch')}).join('');P=P.filter(function(x){return LV.indexOf(x)<0});R=R.filter(function(x){return LV.indexOf(x)<0})}
  if(P.length){h+='<div class="sd3sh'+(LV.length?'':' first')+'">'+(fx&&fx.lp||'Закреплённые')+'</div>'+P.map(function(x){return chatRow(x,'ch')}).join('')}
  h+='<div class="sd3sh'+(P.length||LV.length?'':' first')+'">'+(fx&&fx.lr||'Недавние')+'</div>';
  var lim=g?(P.length?5:8):10,RR=fx?R:R.slice(0,lim);
  /* открытый чат виден в меню всегда (выделен), даже если он старше первых строк */
  if(!fx&&!P.some(isCur)&&!RR.some(isCur)){var cu=R.filter(isCur)[0];if(cu)RR=RR.concat([cu]).sort(function(a,b){return (b.ts||0)-(a.ts||0)})}
  if(!RR.length&&!fx){var ld=SD.L.hermes==null||SD.L.claude==null;h+='<div class="sd3emp">'+(ld?'Загружаю…':'Чатов пока нет')+'</div>'}
  h+=RR.map(function(x){return chatRow(x,g?'rc':'ch')}).join('');
  if(fx?fx.more:R.length>lim||!fx)h+='<div class="sd3r '+(g?'rc':'ch')+' see" data-sd="allag">'+(g?'':'')+'<b>'+E(fx&&fx.more||(g?'Все чаты '+(KN[ck]||'')+'…':'Все чаты '+(KN[ck]||'')+' ›'))+'</b></div>';
  h+='</div></div></div>';
  var u=user();
  h+='<div class="sd3hd"><div class="sd3tt">'+(g?E(fx&&fx.title||KN[s&&s.kind]||'Hermes'):ic('c_word'))+'</div>'+
   (g?'':'<div class="sd3hb gift" data-sd="tab" data-x="home" role="button" aria-label="Вопросы и Пульт">'+ic(fx&&fx.gift||'s_bell')+'</div>')+
   '<div class="sd3hb srch" data-sd="search" role="button" aria-label="Поиск">'+ic(g?'g_search':'c_search')+'</div></div>';
  h+='<div class="sd3ft">'+(g?'<div class="sd3new" data-sd="new" role="button">'+ic('g_pen')+'<span>'+E(fx&&fx.newl||'Чат')+'</span></div><div class="sd3av" data-sd="settings" role="button" aria-label="Настройки"><i>'+E(fx&&fx.user||u.ini)+'</i></div>'
   :'<div class="sd3av" data-sd="settings" role="button" aria-label="Настройки"><i>'+E(fx&&fx.user||u.ini1)+'</i></div><div class="sd3new" data-sd="new" role="button">'+ic('c_plus')+'<span>'+E(fx&&fx.newl||'Новый чат')+'</span></div>')+'</div>';
  return h}
 function user(){var u={};try{u=(tg.initDataUnsafe&&tg.initDataUnsafe.user)||{}}catch(e){}
  var n=(window.vb7dUser&&vb7dUser())/*vb7d: одно имя везде — из аккаунта агента*/||((u.first_name||'')+' '+(u.last_name||'')).trim()||u.username||'Я',p=n.split(/\s+/),ini=((p[0]||'')[0]||'')+((p[1]||'')[0]||'');
  return {name:n,nick:u.username?'@'+u.username:n,ini:(ini||n.slice(0,2)).toUpperCase(),ini1:(n[0]||'Я').toUpperCase()}}
 function pane(){var p=$i('sd3');if(!p){p=D.createElement('div');p.id='sd3';p.className='sd3';B.appendChild(p);
   var c=D.createElement('div');c.id='sd3cv';c.className='sd3cv';B.appendChild(c)}return p}
 function paint(){if(!SD.on)return;if(SW&&SW.go){SD.dirty=1;return}/* cb1: не трогаем узлы под пальцем */var p=pane(),sc=$i('sd3sc'),top=sc?sc.scrollTop:0;p.className='sd3 on '+SD.sty;p.innerHTML=sideHtml();var s2=$i('sd3sc');if(s2)s2.scrollTop=top;if(SD.rc)rcPaint()}
 /* ---------- открыть / закрыть ---------- */
 function open(o){o=o||{};var m=main();if(!m&&!o.fx)return;closePop();
  SD.fx=o.fx||null;SD.sty=o.sty||(SD.fx&&SD.fx.sty)||sty();SD.X=SD.sty=='c'?320.3:310;SD.on=true;
  try{var a=D.activeElement;if(a&&a.blur)a.blur()}catch(e){}
  paint();load();haptic();setTimeout(function(){if(SD.on)mcWarm()},700);/*vb5a3*/if(o.instant){SD.pos=SD.X;setPos(main(),SD.X);cover();return}
  if(SD.pos==null)SD.pos=0;animTo(SD.X)}
 function close(o,cb){o=o||{};if(!SD.on){cb&&cb();return}
  var fin=function(){SD.on=false;SD.pos=0;var m=main();var pp=$i('sd3');if(pp){pp.style.opacity='';pp.style.clipPath=''}if(m){m.classList.remove('sd3main');m.style.transform='';m.style.borderTopLeftRadius=m.style.borderBottomLeftRadius='';if(m.__dm)m.__dm.style.opacity='0'}
   var p=$i('sd3');if(p)p.className='sd3';cover();cb&&cb()};
  if(o.instant){if(SD.anim)cancelAnimationFrame(SD.anim);fin();return}
  /* закрытие: мягкий старт без рывка первого кадра (кривая открытия стартует резко — на закрытии это выглядело скачком);
     после быстрого свайпа — продолжаем со скоростью пальца */
  var x0=SD.pos||0,d=Math.round(220+80*Math.min(1,x0/SD.X));
  if(o.flick)animTo(0,fin,Math.max(180,Math.min(320,x0/o.flick)),'cubic-bezier(.2,.55,.25,1)');else animTo(0,fin,d,'cubic-bezier(.4,0,.2,1)')}
 function goTab(x){closeAll();var d=D.createElement('i');if(x=='sys'){if(W.U&&U.tab=='hc'){U.tab='more';U.page=null}/*vb5b7: Система в облике g4 (вкладка «Ещё»), не старый экран v5*/d.dataset.a='sys'}else{d.dataset.a='tab';d.dataset.x=x}d.style.display='none';B.appendChild(d);d.click();d.remove();
  if(x=='sys'){/* «Система» — страница из Настроек */}}
 function closeAll(){rcClose(true);setClose(true);closePop();close({instant:true})}
 function hcDo(a,ds){var d=D.createElement('i');d.dataset.hc=a;for(var k in (ds||{}))d.dataset[k]=ds[k];d.style.display='none';($i('hcroot')||B).appendChild(d);d.click();if(d.parentNode)d.remove()}
 /* переход в чат: экран чата меняется под меню, потом отъезжает обратно (как в видео: тап по чату → экран едет влево) */
 function openChat(k,id){var s=st();if(!s||!k||!id)return;mcPut();rcClose(true);setClose(true);closePop();
  if(s.view=='chat'&&s.kind==k&&s.sid==id){close();return}
  var L=(SD.L[k]||[]).concat(W.S5D?S5D.extra(k,id):[])/*s5-side*/.map(function(x){var y={};for(var q in x)y[q]=x[q];if(k!='hermes')y.cc=true;return y});
  if(!(W.U&&U.tab=='hc')){U.tab='hc';U.page=null;render()}/*s3-4a: чат из меню на другой вкладке — сначала вкладка «Чат»*/
  if(s.kind!=k)hcDo('kind',{v:k});
  if(L.length)HC.st.sessions=L;hcDo('open',{id:id});
  var X=SD.pos||SD.X;mcFill(k,id);requestAnimationFrame(function(){var m=main();if(!m){close({instant:true});return}if(!SD.on){/*s4c-1e*/SD.pos=0;setPos(m,0);cover();return}SD.sty=sty();SD.X=SD.sty=='c'?320.3:310;SD.pos=Math.min(X,SD.X);setPos(m,SD.pos);paint();close()})}
 function newChat(k){var s=st();closeAll();if(W.HC&&HC.newChat&&s&&s.view=='chat'){HC.newChat(k||s.kind);return}if(k&&s&&s.kind!=k)hcDo('kind',{v:k});hcDo('new')}
 /* ---------- экран «Недавние»: все чаты, поиск, фильтр, выбор (кадры 3213_0182.39, 0199.47, 0208.37, 0212.40) ---------- */
 /* ---------- «Все сессии»: все агенты, сгруппированы по папкам проектов. У Hermes папки нет — группа по источнику ---------- */
 var HSRC={local:'ПК',gui:'ПК',cli:'ПК',desktop:'ПК',api_server:'панель',telegram:'Telegram',cron:'расписание'};
 function folder(x){if(x.k=='hermes')return 'Hermes · '+(HSRC[x.src]||x.src||'другое');return x.src||'Без папки'}
 function rcGroups(L){var G={},O=[];L.forEach(function(x){var f=folder(x);if(!G[f]){G[f]=[];O.push(f)}G[f].push(x)});
  O.sort(function(a,b){return (G[b][0].ts||0)-(G[a][0].ts||0)});return O.map(function(f){return [f,G[f]]})}
 function grpHtml(L){var op=lsg('sd3fo',{})||{};return rcGroups(L).map(function(g,i){var f=g[0],on=op[f]!=null?op[f]:i<2,
   w=g[1].filter(waits).length;
   return '<div class="sd3fh'+(on?' on':'')+'" data-sd="fold" data-f="'+E(f)+'">'+ic(SD.sty=='g'?'g_projects':'c_projects')+'<b>'+E(f)+'</b>'+(w?'<i class="sd3dot"></i>':'')+'<span>'+g[1].length+'</span><i class="sd3fch">›</i></div>'+(on?g[1].map(rcRow).join(''):'')}).join('')}
 function rcList(){if(SD.fx&&SD.fx.rows)return SD.fx.rows;var q=SD.q.trim().toLowerCase();
  return all().filter(function(x){return (SD.flt!='arch'||x.arch)&&(SD.flt!='pin'||pinned(x))&&(!SD.ag||x.k==SD.ag)&&(!q||String(x.t||'').toLowerCase().indexOf(q)>=0)})}
 function rcRow(x){var sel=SD.sel,pk=sel&&sel[x.k+':'+x.id],ag=KN[x.k]&&x.k!=(st()||{}).kind;
  var sub=x.sub!=null?x.sub:((waits(x)?'Ждёт ответа · ':x.live?'Идёт · ':'')+(ag||SD.ag&&KN[x.k]?KN[x.k]+' · ':'')+ago(x.ts));
  return '<div class="sd3rr'+(sel?' sel':'')+(pk?' pick':'')+'" data-sd="'+(sel?'pick':'open')+'" data-k="'+E(x.k||'')+'" data-id="'+E(x.id||'')+'">'+(SD.grp&&!x.ic&&KN[x.k]?agIc(x.k):ic(x.ic||(SD.sty=='g'?'g_bubble':x.k=='codex'?'c_code2':'c_bubble')))+
   (sel?'<i class="sd3ck"></i>':'')+'<div><b>'+E(x.t||'Без названия')+'</b><small>'+E(sub)+'</small></div>'+(x.dot||waits(x)?'<i class="sd3dot"></i>':'')+'</div>'}
 function rcHtml(){var L=rcList(),g=SD.sty=='g',fx=SD.fx,n=SD.sel?Object.keys(SD.sel).filter(function(k){return SD.sel[k]}).length:0;
  var title=fx&&fx.rtitle||(SD.sel?(n?'Выбрано: '+n:'Выберите чаты'):SD.flt=='pin'?'Закреплённые':SD.ag&&!SD.grp?KN[SD.ag]:SD.grp?'Все сессии':'Недавние');
  var grp=SD.grp&&!SD.q.trim()&&!SD.sel&&!fx;
  var h='<div class="sd3sc" id="sd3rsc">';
  if(!L.length)h+=SD.flt=='pin'&&!SD.q?'<div class="sd3none"><b>Ничего не закреплено</b><span>Закреплённые чаты появятся здесь.</span></div>':'<div class="sd3none"><b>'+(SD.q?'Ничего не нашлось':'Чатов нет')+'</b><span>'+(SD.q?'Попробуй другое слово.':'')+'</span></div>';
  h+=(grp?grpHtml(L):L.map(rcRow).join(''))+'</div>';
  h+='<div class="sd3rh"><div class="sd3hb" data-sd="rcback" role="button" aria-label="Меню">'+(W.G3V&&!SD.fx?'':'')+sideIc()+'</div><div class="sd3rt">'+E(title)+'</div>'+
   '<div class="sd3hb dots" data-sd="'+(SD.sel?'selx':'filter')+'" role="button" aria-label="Фильтр">'+(SD.sel?ic(g?'s_x':'s_x'):dotsIc())+'</div></div>';
  h+='<div class="sd3rnew" data-sd="new" role="button">'+ic('c_plus')+'<span>'+E(fx&&fx.newl||'Новый чат')+'</span></div>';
  h+='<div class="sd3sb'+(SD.q?' has':'')+'">'+ic('c_rsearch')+'<input id="sd3q" type="search" enterkeyhint="search" autocomplete="off" placeholder="'+E(fx&&fx.ph||'Поиск')+'" value="'+E(SD.q)+'"><i class="sd3sx" data-sd="qx">'+ic('s_x')+'</i></div>';
  h+='<div class="sd3selbar"><div data-sd="selpin">Закрепить</div><div class="del" data-sd="seldel">Удалить'+(n?' ('+n+')':'')+'</div></div>';
  return h}
 function sideIc(){var v=W.CLV&&CLV.side;if(SD.sty=='c'&&v)return '<svg width="'+v[0]+'" height="'+v[1]+'" viewBox="0 0 '+v[0]+' '+v[1]+'"><path d="'+v[2]+'"/></svg>';
  v=W.G3V&&G3V.side;if(v)return '<svg width="'+v[0]+'" height="'+v[1]+'" viewBox="0 0 '+v[0]+' '+v[1]+'"><path d="'+v[2]+'"/></svg>';
  return '<svg width="24" height="24" viewBox="0 0 24 24"><rect x="3.2" y="6.6" width="17.6" height="2" rx="1"/><rect x="3.2" y="14.6" width="11.4" height="2" rx="1"/></svg>'}
 function dotsIc(){var v=W.CLV&&CLV.dots;if(SD.sty=='c'&&v)return '<svg width="'+v[0]+'" height="'+v[1]+'" viewBox="0 0 '+v[0]+' '+v[1]+'"><path d="'+v[2]+'"/></svg>';
  v=W.G3V&&G3V.dots;if(v)return '<svg width="'+v[0]+'" height="'+v[1]+'" viewBox="0 0 '+v[0]+' '+v[1]+'"><path d="'+v[2]+'"/></svg>';
  return '<svg width="24" height="24" viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.75"/><circle cx="12" cy="12" r="1.75"/><circle cx="19" cy="12" r="1.75"/></svg>'}
 function rcEl(){var r=$i('sd3rc');if(!r){r=D.createElement('div');r.id='sd3rc';r.className='sd3rc';B.appendChild(r)}return r}
 function rcPaint(){var r=rcEl(),sc=$i('sd3rsc'),top=sc?sc.scrollTop:0,q=$i('sd3q'),foc=q&&D.activeElement===q,pos=foc?q.selectionStart:0;
  r.className='sd3rc on '+SD.sty+(SD.sel?' selm':'')+(SD.kb?' kb':'');r.innerHTML=rcHtml();var s2=$i('sd3rsc');if(s2)s2.scrollTop=top;
  if(foc){var q2=$i('sd3q');q2.focus();try{q2.setSelectionRange(pos,pos)}catch(e){}}kbPos()}
 function rcOpen(o){o=o||{};SD.rc=true;if(!o.keep){SD.q='';SD.sel=null;SD.flt='all';SD.grp=!o.ag;SD.ag=o.ag||''}if(!SD.on){SD.sty=sty();SD.X=SD.sty=='c'?320.3:310}load();rcPaint();
  var r=rcEl();if(r.animate&&!o.instant)r.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:220,easing:'cubic-bezier(.2,.8,.2,1)'});
  if(o.search)setTimeout(function(){var q=$i('sd3q');if(q)q.focus()},o.instant?0:60)}
 function rcClose(instant){SD.rc=false;SD.sel=null;var r=$i('sd3rc');if(!r||!r.classList.contains('on'))return;var q=$i('sd3q');if(q)q.blur();
  if(instant||!r.animate){r.className='sd3rc';return}var a=r.animate([{opacity:1},{opacity:0}],{duration:160,easing:'ease-out'});a.onfinish=function(){if(!SD.rc)r.className='sd3rc'}}
 /* поиск над клавиатурой (0214.05): поле едет вместе с visualViewport */
 function kbPos(){var r=$i('sd3rc');if(!r||!SD.rc)return;var vv=W.visualViewport,kb=vv?Math.max(0,innerHeight-vv.height-vv.offsetTop):0;if(W.VB7KB&&VB7KB.on())kb=Math.max(kb,VB7KB.off());/*vb7a: iOS — по viewportChanged сразу*/var q=$i('sd3q'),f=q&&D.activeElement===q;
  SD.kb=f;r.classList.toggle('kb',f);var sb=r.querySelector('.sd3sb');if(sb)sb.style.transform=kb>40?'translateY('+(-kb+Math.max(0,parseFloat(getComputedStyle(D.documentElement).getPropertyValue('--sd3b'))||0)-8)+'px)':''}
 if(W.visualViewport)visualViewport.addEventListener('resize',kbPos);W.addEventListener('vb7kb',kbPos);
 D.addEventListener('focusin',function(e){if(e.target.id=='sd3q')setTimeout(kbPos,30)});D.addEventListener('focusout',function(e){if(e.target.id=='sd3q')setTimeout(kbPos,30)});
 D.addEventListener('input',function(e){if(e.target.id!='sd3q')return;SD.q=e.target.value;var sb=e.target.closest('.sd3sb');if(sb)sb.classList.toggle('has',!!SD.q);
  var sc=$i('sd3rsc');if(sc){var L=rcList();sc.innerHTML=L.length?(SD.grp&&!SD.q.trim()&&!SD.sel?grpHtml(L):L.map(rcRow).join('')):'<div class="sd3none"><b>Ничего не нашлось</b><span>Попробуй другое слово.</span></div>'}},true);
 /* ---------- поповеры: фильтр, долгое нажатие, переименование, удаление ---------- */
 function closePop(){var v=$i('sd3veil'),p=D.querySelectorAll('.sd3pop,.sd3pv');if(v)v.remove();p.forEach(function(x){if(x.__out)return;/*vb7b-1: меню Настроек сворачивается к строке так же, как выросло*/if(x.classList.contains('g7m')&&x.animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches){x.__out=1;x.style.pointerEvents='none';x.animate([{transform:'none',opacity:1},{transform:'scale(.88)',opacity:0}],{duration:300,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'}).onfinish=function(){x.remove()};return}x.remove()});SD.lp=null}/*vb7b-p1*/
 function pop(html,pos,o){o=o||{};closePop();var v=D.createElement('div');v.id='sd3veil';if(o.dim)v.className='dim';B.appendChild(v);
  var p=D.createElement('div');p.className='sd3pop '+(o.sty||SD.sty);p.innerHTML=html;B.appendChild(p);for(var k in pos)p.style[k]=pos[k];
  /* меню «вытекает» из точки привязки: 400 мс с отскоком ~4 % (как «…» шапки ChatGPT, spec §12) / пружина 0.30/0.8 у Claude (spec §8) */
  if(p.animate)p.animate([{transform:'scale(.88)',opacity:0},{transform:'scale(1.02)',opacity:1,offset:.6},{transform:'none',opacity:1}],{duration:o.sty=='c'||SD.sty=='c'?390:400,easing:'cubic-bezier(.3,1,.4,1)',transformOrigin:o.origin||'top right'});
  p.style.transformOrigin=o.origin||'top right';return p}
 function mi(a,icn,t,red,ds){var x='';for(var k in (ds||{}))x+=' data-'+k+'="'+E(ds[k])+'"';return '<div class="sd3mi'+(red?' red':'')+'" data-sd="'+a+'"'+x+'>'+(icn?ic(icn):'')+'<span>'+E(t)+'</span></div>'}
 function filterMenu(el){var r=el.getBoundingClientRect(),c=SD.sty=='c',ck='<i class="sd3ckm">'+ic('c_check')+'</i>';
  function fi(a,v,icn,t){var on=a=='flt'?SD.flt==v&&!(v=='all'&&SD.ag):SD.ag==v;return '<div class="sd3mi" data-sd="'+a+'" data-v="'+v+'">'+(on?ck:'')+ic(icn)+'<span>'+t+'</span></div>'}
  function fa(k){var on=SD.ag==k;return '<div class="sd3mi" data-sd="ag" data-v="'+k+'">'+(on?ck:'')+agIc(k)+'<span>'+KN[k]+'</span></div>'}
  var F=SD.fx&&SD.fx.fltm;
  var h=mi('select','c_fsel',F?F[0]:'Выбрать чаты')+'<div class="sd3sep"></div>'+fi('flt','all','c_fall',F?F[1]:'Все')+fi('flt','pin','c_fpin',F?F[2]:'Закреплённые')+(F?'':fi('flt','arch','c_farch','Архив'))+
   (F?mi('popx','c_farch',F[3]):'<div class="sd3sep"></div>'+fa('hermes')+fa('claude')+fa('codex')+
   /* бывшие «Все сессии» (Hermes) и «С архивом» (Claude) из списка базы */
   '<div class="sd3sep"></div><div class="sd3mi" data-sd="allsw">'+(lsg('sd3all',false)?'<i class="sd3ckm">'+ic('c_check')+'</i>':'')+ic('c_fsel')+'<span>Старые и архив</span></div>');
  /* меню 248 pt, верх = верх кнопки «…», правый край = её правый край (кадр 3213_0199.47) */
  var p=pop(h,{top:r.top+'px',right:(innerWidth-r.right)+'px',minWidth:'248px',maxWidth:(innerWidth-32)+'px'},{origin:'top right'});p.classList.add('flt')}
 function rowOf(k,id){var fx=SD.fx,L=fx?[].concat(fx.rows||[],fx.pins||[],fx.rec||[]):all();return L.filter(function(x){return x.k==k&&x.id==id})[0]||{k:k,id:id,t:'Чат'}}
 function canEdit(x){return x.k=='hermes'||!!x.rw||x.k=='x'}
 function rowMenu(row){var k=row.dataset.k,id=row.dataset.id,x=rowOf(k,id),c=SD.sty=='c',r=row.getBoundingClientRect(),pn=pinned(x);
  var L=SD.fx&&SD.fx.lpm||{};
  var h=mi('pin','c_mpin',L.pin||(pn?'Открепить':'Закрепить'),0,{k:k,id:id})+(c?'<div class="sd3sep"></div>':'')+(canEdit(x)?mi('ren','c_mren',L.ren||'Переименовать',0,{k:k,id:id}):'')+
   (k=='hermes'||L.proj?mi(L.proj?'popx':'arch',L.proj?'c_mproj':'c_farch',L.proj||'В архив',0,{k:k,id:id}):'')+(x.rw||k=='hermes'||k=='x'?(c?'<div class="sd3sep"></div>':'')+mi('del','c_mdel',L.del||'Удалить',1,{k:k,id:id}):'');
  if(c){/* Claude: размытый фон, сверху карточка-превью чата, под ней меню (кадр 3213_0191.99) */
   /* превью 340×429 pt в x 26.7, y = верх+65; меню 247 pt в x 73, на 20 pt ниже превью (кадр 3213_0191.99) */
   var p=pop(h,{left:'73px',width:'247px'},{dim:true,sty:'c',origin:'top left'});var pv=D.createElement('div');pv.className='sd3pv';
   pv.innerHTML='<b>'+E(x.t||'Чат')+'</b><div>…</div><small>'+E(SD.fx&&SD.fx.pvfoot||((KN[k]||'')+' · '+ago(x.ts)))+'</small>';B.appendChild(pv);
   var t0=parseFloat(getComputedStyle(D.documentElement).getPropertyValue('--g3t'))||20,top=t0+65,mh=p.offsetHeight||227,ph=Math.max(160,Math.min(429,innerHeight-top-mh-20-28));
   pv.style.top=top+'px';pv.style.height=ph+'px';p.style.top=(top+ph+20)+'px';
   if(pv.animate)pv.animate([{transform:'scale(.94)',opacity:0},{transform:'none',opacity:1}],{duration:300,easing:'cubic-bezier(.3,1,.4,1)'});
   preview(k,id,pv)}
  else{var top2=Math.min(r.bottom+6,innerHeight-260);pop(h,{left:Math.max(12,r.left+8)+'px',top:top2+'px'},{origin:'top left'})}
  SD.lp={k:k,id:id}}
 function preview(k,id,pv){if(SD.fx&&SD.fx.pv){pv.querySelector('div').textContent=SD.fx.pv;return}
  var u=base(k)+'/sessions/'+encodeURIComponent(id)+'/messages';
  /* Claude/Codex отдают хвост по смещению: пусто и есть size — дочитать последние ~200 КБ */
  api(u).then(function(d){if((d.m||[]).length||!d.size)return d;return api(u+'?from='+Math.max(0,d.size-200000)+'&sz='+d.size)}).then(function(d){var M=d.m||[],t='';for(var i=M.length-1;i>=0&&!t;i--){var m=M[i];
    if(m.r=='assistant'||m.role=='assistant'||m.k=='a'){t=(typeof m.c=='string'?m.c:'')||m.content||m.text||(m.parts||[]).map(function(p){return p.t||''}).join('')||''}}
   var el=pv.querySelector('div');if(el)el.textContent=String(t||'').slice(0,700)}).catch(function(){var el=pv.querySelector('div');if(el)el.textContent=''})}
 function upd(k,id,fn){(SD.L[k]||[]).forEach(function(x){if(x.id==id)fn(x)});paint();if(SD.rc)rcPaint()}
 function doPin(k,id){var x=rowOf(k,id),v=!pinned(x);haptic('sel');
  if(k=='hermes'){upd(k,id,function(y){y.pin=v});var s=st();if(s&&s.sid==id&&s.kind==k)s.pin=v;
   api('/sessions/'+encodeURIComponent(id),{method:'PATCH',body:{pinned:v}}).then(function(){T(v?'Закреплено':'Откреплено')}).catch(function(e){upd(k,id,function(y){y.pin=!v});T(E(e.message))})}
  else{/* у Claude/Codex закрепа на сервере нет — помним в панели */if(v)PINS[k+':'+id]=1;else delete PINS[k+':'+id];lss('sd3pin',PINS);paint();if(SD.rc)rcPaint();T(v?'Закреплено':'Откреплено')}}
 function renUI(k,id){var x=rowOf(k,id);var p=pop('<div class="sd3mh">Новое название</div><div style="padding:4px 18px 8px"><input id="sd3ren" value="'+E(x.t||'')+'" style="width:100%;box-sizing:border-box;height:44px;border-radius:14px;border:0;outline:0;padding:0 14px;background:rgba(255,255,255,.1);color:inherit;font:17px var(--sd3f)"></div>'+
   mi('rensave','c_mren','Сохранить',0,{k:k,id:id}),{left:'20px',right:'20px',top:'30%'},{dim:true,origin:'center'});setTimeout(function(){var i=$i('sd3ren');if(i){i.focus();i.select()}},50)}
 function renSave(k,id){var i=$i('sd3ren'),v=(i&&i.value||'').trim();if(!v)return;closePop();
  api(base(k)+'/sessions/'+encodeURIComponent(id),{method:'PATCH',body:{title:v}}).then(function(){upd(k,id,function(y){y.t=v});var s=st();if(s&&s.sid==id&&s.kind==k){s.title=v;try{HC.paint()}catch(e){}}T('Переименовано')}).catch(function(e){T(E(e.message))})}
 function delUI(k,id){var x=rowOf(k,id);pop('<div class="sd3mh">Удалить «'+E(String(x.t||'чат').slice(0,40))+'»? Это нельзя отменить.</div>'+mi('delyes','c_mdel','Удалить',1,{k:k,id:id})+mi('popx','','Отмена'),{left:'20px',right:'20px',top:'34%'},{dim:true,origin:'center'})}
 function delDo(k,id){closePop();var s=st(),curr=s&&s.sid==id&&s.kind==k;
  api(base(k)+'/sessions/'+encodeURIComponent(id),{method:'DELETE'}).then(function(){SD.L[k]=(SD.L[k]||[]).filter(function(y){return y.id!=id});delete PINS[k+':'+id];lss('sd3pin',PINS);paint();if(SD.rc)rcPaint();T('Удалено');haptic('ok');
   if(curr){closeAll();hcDo('back')}}).catch(function(e){T(E(e.message))})}
 function archDo(k,id){closePop();var x=rowOf(k,id),s=st(),curr=s&&s.sid==id&&s.kind==k;
  fetch(String(W.API||'').replace(/\/$/,'')+'/api/hc/gx/archive',{method:'POST',headers:{'X-Init-Data':W.tg?tg.initData:'','Content-Type':'application/json'},body:JSON.stringify({sid:id,src:x.src||''})})
   .then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);SD.L[k]=(SD.L[k]||[]).filter(function(y){return y.id!=id});paint();if(SD.rc)rcPaint();T('Чат в архиве');haptic('ok');if(curr){closeAll();hcDo('back')}}).catch(function(e){T(E(e.message))})}
 /* выбор нескольких: закрепить / удалить (удаляются только чаты, которые можно удалить из панели) */
 function selKeys(){return Object.keys(SD.sel||{}).filter(function(k){return SD.sel[k]})}
 function selDel(){var K=selKeys();if(!K.length)return;var ok=K.filter(function(q){var i=q.indexOf(':'),x=rowOf(q.slice(0,i),q.slice(i+1));return x.rw||x.k=='hermes'});
  pop('<div class="sd3mh">Удалить чатов: '+ok.length+(ok.length<K.length?' (остальные созданы не в панели — их удалять в родной программе)':'')+'? Это нельзя отменить.</div>'+mi('seldelyes','c_mdel','Удалить',1)+mi('popx','','Отмена'),{left:'20px',right:'20px',top:'34%'},{dim:true,origin:'center'});SD.delK=ok}
 function selDelDo(){closePop();var K=SD.delK||[];Promise.all(K.map(function(q){var i=q.indexOf(':'),k=q.slice(0,i),id=q.slice(i+1);return api(base(k)+'/sessions/'+encodeURIComponent(id),{method:'DELETE'}).then(function(){SD.L[k]=(SD.L[k]||[]).filter(function(y){return y.id!=id});return 1}).catch(function(){return 0})}))
  .then(function(r){var n=r.filter(Boolean).length;SD.sel=null;paint();rcPaint();T('Удалено: '+n)})}
 /* ---------- Настройки (лист, кадры 3214_0405.63 / 0410.21) ---------- */
 function setEl(){var r=$i('sd3set');if(!r){r=D.createElement('div');r.id='sd3set';r.className='sd3set';B.appendChild(r)}return r}
 function sr(a,icn,t,sub,em,red,ds){var x='';for(var k in (ds||{}))x+=' data-'+k+'="'+E(ds[k])+'"';
  return '<div class="sd3sr'+(red?' red':'')+(sub?' two':'')+'" data-sd="'+a+'"'+x+'>'+(icn=='@av'?'<i class="sd3sav">'+E(user().ini)+'</i>':ic(icn))+'<div><b>'+E(t)+'</b>'+(sub?'<span>'+E(sub)+'</span>':'')+'</div>'+(em?'<em>'+E(em)+'</em>':'')+(red?'':ic('s_chev','sd3chv'))+'</div>'}
 function setHtml(){var u=user(),fx=SD.fx||{};
  return '<div class="sd3sc" id="sd3ssc">'+
   '<div class="sd3card pr"><div class="sd3promo"><div><b>'+E(fx.promo||'Всё под контролем')+'</b><span>'+E(fx.promo2||'Проверка агентов, службы и связь — в «Системе».')+'</span></div><i data-sd="go" data-x="sys">'+E(fx.promob||'Система')+'</i></div></div>'+
   '<div class="sd3card">'+sr('go','@av',fx.acc||'Аккаунт','',fx.nick||u.nick,0,{x:'set'})+(fx.acc2?sr('go','s_plus',fx.acc2,'','',0,{x:'set'}).replace(/<svg class="sd3v sd3v-s_chev[^]*?<\/svg>/,''):'')+'</div>'+
   '<div class="sd3card">'+sr('go','s_custom',fx.cust||'Настройки панели',fx.cust2||'Автопилот, уведомления, агенты и тема',0,0,{x:'set'})+'</div>'+
   '<div class="sd3card">'+(fx.grp||[['home','s_remote','Пульт'],['prj','g_projects','Проекты'],['br','s_storage','Мозг'],['j','s_data','Журнал'],['sys','s_gear','Система'],['q','s_bell','Вопросы']]).map(function(r){return sr('go',r[1],r[2],'','',0,{x:r[0]})}).join('')+'</div>'+
   '<div class="sd3card">'+sr('stopall','s_logout',fx.out||'Остановить всё','','',1)+'</div>'+
   '<div class="sd3ver">Hermes Control · v'+E(W.VER||'')+'</div></div>'+
   '<div class="sd3sth"><div class="sd3hb" data-sd="setx" role="button" aria-label="Закрыть">'+ic('s_x')+'</div><div class="sd3rt">'+E(fx.stitle||'Настройки')+'</div><div class="sd3hb inf" data-sd="info" role="button" aria-label="О панели">'+ic('s_info')+'</div></div>'}
 function setOpen(o){o=o||{};var r=setEl();r.className='sd3set on '+SD.sty;r.innerHTML=W.G7&&G7.setHtml&&!SD.fx?G7.setHtml(SD.sty):setHtml();if(W.G7&&G7.setOpened)G7.setOpened(r);
  /* лист iOS поднимается снизу (кривая листа spec §8 Claude: cubic-bezier(.32,.72,0,1) ~ 500 мс) */
  if(r.animate&&!o.instant)r.animate([{transform:'translateY(100%)'},{transform:'none'}],{duration:500,easing:'cubic-bezier(.32,.72,0,1)'})}
 function setClose(instant){var r=$i('sd3set');if(!r||!r.classList.contains('on'))return;if(instant||!r.animate){r.className='sd3set';return}
  var a=r.animate([{transform:'none'},{transform:'translateY(100%)'}],{duration:300,easing:'cubic-bezier(.4,0,1,1)'});a.onfinish=function(){r.className='sd3set'}}
 function infoMenu(el){if(W.G7&&G7.info&&!SD.fx){G7.info(el);return}var r=el.getBoundingClientRect();pop('<div class="sd3mh">Hermes Control v'+E(W.VER||'')+'</div>'+mi('reload','','Обновить панель')+mi('go','','Система: проверка',0,{x:'sys'}),{top:(r.bottom+8)+'px',right:(innerWidth-r.right)+'px'},{origin:'top right'})}
 /* ---------- клики ---------- */
 W.addEventListener('click',function(e){
  if(SD.lpFired&&Date.now()-SD.lpFired<700){SD.lpFired=0;if(e.target.closest&&e.target.closest('.sd3,.sd3rc')){e.stopImmediatePropagation();e.preventDefault();return}}SD.lpFired=0;
  if(e.target.id=='sd3veil'){closePop();e.stopPropagation();e.preventDefault();return}
  if(e.target.id=='sd3cv'){e.stopPropagation();e.preventDefault();if(!SD.drag)close();return}
  var el=e.target.closest&&e.target.closest('[data-sd]');if(!el||!el.closest('.sd3,.sd3rc,.sd3set,.sd3pop'))return;
  if(el.tagName=='INPUT')return;e.stopPropagation();e.preventDefault();var a=el.dataset.sd,ds=el.dataset;
  switch(a){
   case 'agent':goAgent(ds.k);break;
   case 'tab':if(W.G7&&/^g7:/.test(ds.x||'')){G7.go(ds.x.slice(3),el);break}goTab(ds.x);break;
   case 'go':goTab(ds.x=='sys'?'sys':ds.x);break;
   case 'open':openChat(ds.k,ds.id);break;
   case 'all':rcOpen();break;
   case 'allag':rcOpen({ag:(st()||{}).kind||'hermes'});break;
   case 'fold':{var op=lsg('sd3fo',{})||{},f=ds.f,was=el.classList.contains('on');op[f]=!was;lss('sd3fo',op);haptic('sel');rcPaint();break}
   case 'search':rcOpen({search:true});break;
   case 'rcback':rcClose();if(!SD.on)open();break;
   case 'filter':filterMenu(el);break;
   case 'flt':SD.flt=ds.v;if(ds.v=='all'){SD.ag='';SD.grp=true}closePop();rcPaint();haptic('sel');break;
   case 'ag':SD.ag=SD.ag==ds.v?'':ds.v;SD.flt='all';SD.grp=!SD.ag;closePop();rcPaint();haptic('sel');break;
   case 'select':closePop();SD.sel={};rcPaint();break;
   case 'allsw':lss('sd3all',!lsg('sd3all',false));closePop();load(true);haptic('sel');T(lsg('sd3all',false)?'Показываю все сессии и архив':'Только недавние');break;
   case 'selx':SD.sel=null;rcPaint();break;
   case 'pick':{var q=ds.k+':'+ds.id;SD.sel[q]=!SD.sel[q];haptic('sel');rcPaint();break}
   case 'selpin':selKeys().forEach(function(q){var i=q.indexOf(':'),x=rowOf(q.slice(0,i),q.slice(i+1));if(!pinned(x))doPin(x.k,x.id)});SD.sel=null;rcPaint();break;
   case 'seldel':selDel();break;
   case 'seldelyes':selDelDo();break;
   case 'qx':{SD.q='';var qi=$i('sd3q');if(qi){qi.value='';qi.dispatchEvent(new Event('input',{bubbles:true}));qi.focus()}break}
   case 'new':newChat(SD.rc&&SD.ag?SD.ag:'');break;
   case 'newag':closePop();newChat(ds.v);break;
   case 'settings':setOpen();break;
   case 'setx':setClose();break;
   case 'info':infoMenu(el);break;
   case 'reload':location.reload();break;
   case 'stopall':closeAll();var d=D.createElement('i');d.dataset.a='stopsheet';d.style.display='none';B.appendChild(d);d.click();d.remove();break;
   case 'pin':closePop();doPin(ds.k,ds.id);break;
   case 'ren':closePop();setTimeout(function(){renUI(ds.k,ds.id)},60);break;
   case 'rensave':renSave(ds.k,ds.id);break;
   case 'del':closePop();setTimeout(function(){delUI(ds.k,ds.id)},60);break;
   case 'delyes':delDo(ds.k,ds.id);break;
   case 'arch':archDo(ds.k,ds.id);break;
   case 'popx':closePop();break;
   default:if(W.G7&&G7.act)G7.act(a,ds,el);
  }},true);
 D.addEventListener('keydown',function(e){if(e.key=='Escape'){if($i('sd3veil'))closePop();else if($i('sd3set')&&$i('sd3set').classList.contains('on'))setClose();else if(SD.rc){rcClose();}else if(SD.on)close()}
  if(e.key=='Enter'&&e.target.id=='sd3ren'){e.preventDefault();var b=D.querySelector('.sd3pop [data-sd=rensave]');if(b)b.click()}});
 /* ---------- долгое нажатие: строка чата → меню; «новый чат» → выбор агента ---------- */
 var LP={t:0};
 D.addEventListener('pointerdown',function(e){var row=e.target.closest&&e.target.closest('.sd3 [data-sd=open],.sd3rc [data-sd=open],.sd3 [data-sd=new],.sd3rc [data-sd=new],.sd3 [data-sd=agent]');if(!row)return;
  LP.x=e.clientX;LP.y=e.clientY;clearTimeout(LP.t);LP.t=setTimeout(function(){LP.t=0;SD.lpFired=Date.now();haptic();
   if(row.dataset.sd=='agent'){newChat(row.dataset.k);return}
   if(row.dataset.sd=='new'){var r=row.getBoundingClientRect();pop('<div class="sd3mh">Новый чат</div>'+mi('newag','c_bubble','Hermes',0,{v:'hermes'})+mi('newag','c_bubble','Claude',0,{v:'claude'})+mi('newag','c_code2','Codex',0,{v:'codex'}),{left:r.left+'px',bottom:(innerHeight-r.top+8)+'px'},{origin:'bottom left'});return}
   if(row.animate)row.animate([{transform:'scale(1)'},{transform:'scale(.97)'},{transform:'scale(1)'}],{duration:260,easing:'ease-out'});rowMenu(row)},480)},true);
 D.addEventListener('pointermove',function(e){if(LP.t&&Math.hypot(e.clientX-LP.x,e.clientY-LP.y)>8){clearTimeout(LP.t);LP.t=0}},true);
 D.addEventListener('pointerup',function(){clearTimeout(LP.t);LP.t=0},true);
 D.addEventListener('pointercancel',function(){clearTimeout(LP.t);LP.t=0},true);
 W.addEventListener('contextmenu',function(e){if(e.target.closest&&e.target.closest('.sd3,.sd3rc'))e.preventDefault()},true);
 /* ---------- свайп: вправо по экрану чата — открыть, влево по меню/краю — закрыть (палец ведёт экран) ---------- */
 var SW=null;
 function swOk(t){return !(t.closest&&t.closest('textarea,input,pre,code,table,.g3th,.clth,.g3pop,.clpop,.g3dict,.cldict,[data-g3=mic],[data-cl=mic],.g3c,.clc,.clsheet'))}
 D.addEventListener('touchstart',function(e){if(e.touches.length!=1){swFin();return}var t=e.touches[0],tg2=e.target,m=main();
  var inMain=m&&m.contains(tg2)&&!SD.on,inSide=SD.on&&(tg2.closest&&tg2.closest('#sd3,#sd3cv'));
  if(!(inMain&&swOk(tg2))&&!inSide){swFin();return}if($i('sd3veil')||SD.rc){swFin();return}swFin();
  SW={x:t.clientX,y:t.clientY,t:performance.now(),p0:SD.on?(SD.pos||SD.X):0,go:false,open:inMain,lx:t.clientX,lt:performance.now(),v:0,tg:tg2,ev:performance.now()};
  /* cb1: если узел под пальцем удалят (перерисовка), события придут на него, а не на document */
  try{tg2.addEventListener('touchmove',swMove,{passive:false});tg2.addEventListener('touchend',swEnd);tg2.addEventListener('touchcancel',swEnd)}catch(x){}},{passive:true,capture:true});
 function swMove(e){if(!SW||e.__sw)return;e.__sw=1;SW.ev=performance.now();var t=e.touches[0],dx=t.clientX-SW.x,dy=t.clientY-SW.y;
  if(!SW.go){if(Math.abs(dx)<10&&Math.abs(dy)<10)return;
   /* s4c-1a: палец лёг на ЗАКРЫВАЮЩЕЕСЯ меню (на затемнённый край чата), а закрытие кончилось раньше, чем палец двинулся (видео 345–353):
      меню уже закрыто, значит это жест открытия. Раньше экран ехал за пальцем при SD.on=false — чат сдвинут на 310/320, меню пустое (sd_blank) */
   if(!SW.open&&!SD.on){if(dx<=0||SD.fx){swDrop();return}SW.open=true;SW.p0=SD.pos||0}
   if(Math.abs(dx)<Math.abs(dy)*1.2||(SW.open&&dx<0)||(!SW.open&&dx>0&&SW.p0>=SD.X)){SW=null;return}
   /* s4c-2: меню рисуется ДО захвата жеста (paint() при SW.go откладывается до отпускания) — с первого кадра свайпа пункты на месте, а не чёрная пустота */
   if(SW.open){SD.fx=null;SD.sty=sty();SD.X=SD.sty=='c'?320.3:310;SD.on=true;SD.dirty=0;paint();load();setTimeout(function(){if(SD.on)mcWarm()},700);/*vb5a3*/try{D.activeElement&&D.activeElement.blur&&D.activeElement.blur()}catch(x){}}
   SW.go=true;SD.drag=true;
   if(SD.anim){cancelAnimationFrame(SD.anim);SD.anim=null}}
  e.preventDefault();var now=performance.now();SW.v=(t.clientX-SW.lx)/Math.max(1,now-SW.lt);SW.lx=t.clientX;SW.lt=now;
  var x=Math.max(0,Math.min(SD.X,SW.p0+dx));SD.pos=x;setPos(main(),x);cover()}
 D.addEventListener('touchmove',swMove,{passive:false,capture:true});
 function swFin(){if(SW&&SW.go)swEnd();else swDrop()}
 function swDrop(){if(SW&&SW.tg){try{SW.tg.removeEventListener('touchmove',swMove);SW.tg.removeEventListener('touchend',swEnd);SW.tg.removeEventListener('touchcancel',swEnd)}catch(x){}}SW=null}
 function swEnd(e){if(e){if(e.__swe)return;e.__swe=1;if(e.target&&e.target.isConnected===false)W.cbDiag&&cbDiag('sd_detached',{pos:Math.round(SD.pos||0)})}if(!SW)return;var s=SW;swDrop();if(!s.go)return;if(!SD.on&&main()&&!SD.fx){SD.on=true;paint()}/*s4c-1b: сдвиг экрана без меню не оставляем*/setTimeout(function(){SD.drag=false;if(SD.dirty){SD.dirty=0;paint()}},50);
  var x=SD.pos||0,openIt=s.v>0.35?true:s.v<-0.35?false:x>SD.X*0.5;if(openIt){haptic();animTo(SD.X)}else close(s.v<-0.35?{flick:Math.abs(s.v)}:{})}
 D.addEventListener('touchend',swEnd,{capture:true});D.addEventListener('touchcancel',swEnd,{capture:true});
 /* cb1: сторож — палец потерян (событий нет >1.2 с) или меню осталось на полпути без жеста и анимации: довести до края */
 setInterval(function(){if(SW&&SW.go&&performance.now()-SW.ev>1200){W.cbDiag&&cbDiag('sd_stuck',{why:'lost-touch',pos:Math.round(SD.pos||0)});swEnd()}
  if(!SW&&SD.drag&&!SD.anim){W.cbDiag&&cbDiag('sd_stuck',{why:'drag-flag',pos:Math.round(SD.pos||0)});SD.drag=false}
  if(SD.on&&!SD.anim&&!SD.drag&&!SW&&!SD.fx&&SD.pos>2&&SD.pos<SD.X-2){W.cbDiag&&cbDiag('sd_stuck',{why:'half-open',pos:Math.round(SD.pos)});if(SD.pos>SD.X*0.5)animTo(SD.X);else close()}},500);
 /* экран чата пропал (ушли в другую вкладку, база перерисовала список) — меню закрыть */
 var MO=new MutationObserver(function(){if(SD.on&&!main()&&!SD.fx){if(SD.anim){cancelAnimationFrame(SD.anim);SD.anim=null}if(SW)swDrop();SD.drag=false;/*s4c-1d*/SD.on=false;SD.pos=0;var p=$i('sd3');if(p)p.className='sd3';cover()}});
 MO.observe(B,{childList:true,subtree:false});
 /* ---------- вход во вкладку «Чат» = сразу последний чат (как ChatGPT/Claude), список агента больше не показывается ----------
    Последний открытый чат помним сами (sd3last: {k,id}) — у базы hcsid только для Hermes. Пока ищем чат, старый список скрыт
    (body.sd3ent); не нашли за 8 с, чатов нет или чат ещё ни разу не открывали — показываем список базы как запасной путь. HC.leave() из кода/тестов
    по-прежнему даёт список: вход срабатывает только по нажатию вкладки «Чат» и при запуске панели на ней. */
 var ENT={on:0,t0:0,tm:0};
 /* s4c-5c: кэш последних сообщений чатов (до 6 чатов × 40 сообщений, localStorage sd3mc): чат из меню сразу показывает то, что было,
    история с ПК заменяет его, когда придёт (раньше 0,5–1 с пустой экран «Загружаю», у Codex дольше) */
 var MC=lsg('sd3mc',{})||{},MCo=lsg('sd3mco',[])||[],MCt=0,MCw=0;
 function mcSave(){MCt=Date.now();MCw=0;lss('sd3mc',MC);lss('sd3mco',MCo)}
 function mcPut(){var s=st();if(!s||s.view!='chat'||!s.sid||s.loadingMsgs||s.busy||!s.msgs||!s.msgs.length)return;var key=s.kind+':'+s.sid,M=s.msgs.filter(function(b){return b&&!b.lp&&!b.live}).slice(-40),j;
  try{j=JSON.stringify(M);while(j.length>40000&&M.length>1){M=M.slice(Math.ceil(M.length/4));j=JSON.stringify(M)}}catch(e){return}if(!M.length||j.length>40000||MC[key]===j)return;
  MC[key]=j;MCo=MCo.filter(function(x){return x!=key});MCo.push(key);while(MCo.length>16)delete MC[MCo.shift()];/*vb5a-3: было 6*/
  if(Date.now()-MCt>3000)mcSave();else if(!MCw)MCw=setTimeout(mcSave,3000)}
 /*vb5a3: прогрев кэша — по одному запросу подряд, не чаще раза в 3 мин на чат, только когда меню открыто*/
 var MW={q:[],busy:0,t:{}};
 function mcWarm(){var s=st();if(!s)return;var k=s.kind,bs=k=='codex'?'/cx':k=='claude'?'/cc':'';
  var R=(SD.L[k]||[]).filter(function(x){return x.src!='cron'&&!x.new&&x.id!=s.sid}).sort(function(a,b){return (b.ts||0)-(a.ts||0)}).slice(0,4);
  R.forEach(function(x){var key=k+':'+x.id;if(MC[key]||Date.now()-(MW.t[key]||0)<180e3||MW.q.some(function(q){return q.key==key}))return;MW.q.push({key:key,u:bs+'/sessions/'+encodeURIComponent(x.id)+'/messages'})});
  mcStep()}
 function mcStep(){if(MW.busy||!MW.q.length)return;var j=MW.q.shift();MW.t[j.key]=Date.now();MW.busy=1;
  api(j.u).then(function(d){var M=(W.HC&&HC.fromHistory&&d&&d.m)?HC.fromHistory(d.m,null,1).filter(function(b){return b&&!b.live}).slice(-40):[];if(!M.length||MC[j.key])return;var js=JSON.stringify(M);
   while(js.length>40000&&M.length>1){M=M.slice(Math.ceil(M.length/4));js=JSON.stringify(M)}if(js.length>40000)return;
   MC[j.key]=js;MCo=MCo.filter(function(x){return x!=j.key});MCo.push(j.key);while(MCo.length>16)delete MC[MCo.shift()];if(!MCw)MCw=setTimeout(mcSave,1500)})
   .catch(function(){}).then(function(){MW.busy=0;if(SD.on)setTimeout(mcStep,150);else MW.q.length=0})}
 function mcFill(k,id){var s=st();if(!s||s.sid!=id||s.kind!=k||s.msgs.length||!s.loadingMsgs)return;var j=MC[k+':'+id];if(!j)return;try{s.msgs=JSON.parse(j);s.stick=true;HC.paint()}catch(e){}}
 /* s4c-4b: ход закончился — через 1,5 и 7 с перечитываем список агента: Hermes даёт чату название после первого ответа */
 var TW={sig:''};
 function turnWatch(){var s=st();if(!s||s.view!='chat'||!s.sid||!main()){TW.sig='';return}var n=(s.msgs||[]).filter(function(b){return !b.lp}).length,busy=!!(s.busy||s.hpoll||s.dsending||(s.cur&&s.cur.live)),ld=!!s.loadingMsgs,sig=s.kind+':'+s.sid;
  if(TW.sig!=sig||ld||TW.ld){TW.sig=sig;TW.n=n;TW.b=busy;TW.ld=ld;return}
  if((n!=TW.n||TW.b)&&!busy){var k=s.kind;clearTimeout(TW.t1);clearTimeout(TW.t2);TW.t1=setTimeout(function(){loadK(k)},1500);TW.t2=setTimeout(function(){loadK(k)},7000)}
  TW.n=n;TW.b=busy}
 setInterval(function(){try{mcPut();turnWatch()}catch(e){}},1200);
 /* s4c-5a: списки — заранее, при запуске панели (бейджи агентов и «Недавние» готовы к первому открытию меню) */
 setTimeout(function(){load(true)},1500);
 function remember(){var s=st();if(s&&s.view=='chat'&&s.sid&&main()){var v={k:s.kind,id:s.sid},o=lsg('sd3last',null);if(!o||o.k!=v.k||o.id!=v.id){lss('sd3last',v);var M=lsg('sd3lastk',{})||{};M[v.k]=v.id;lss('sd3lastk',M)}}}
 setInterval(remember,1200);
 /* s3-4b: U.page='hcchat' вне вкладки «Чат» — база v5 рисовала бы старый экран агента (agentPage('hcchat')) */
 if(typeof W.render=='function'&&!W.render.s34){var r34=W.render;W.render=function(){if(W.U&&U.page=='hcchat'&&U.tab!='hc')U.page=null;return r34.apply(this,arguments)};W.render.s34=1}
 /* s3-3a: «потянуть вниз = обновить» базы v5 — только вне чата, без открытого меню и когда прокрутка под пальцем у верха */
 D.addEventListener('touchstart',function(e){if(W.PY==null)return;var t=e.target,blk=W.U&&U.tab=='hc'||SD.on||!!(t&&t.closest&&t.closest('#sd3,#sd3cv,#sheet.on'));
  for(var n=t;!blk&&n&&n.nodeType==1&&n!==B;n=n.parentNode){if(n.scrollTop>0&&n.scrollHeight>n.clientHeight+2)blk=true}
  if(blk)W.PY=null},{passive:true});
 /* s3-3b: чат сдвинут вправо, а меню закрыто или пустое (видео 4:20–4:28) — диагностика и возврат в согласованное состояние */
 var BL=0;setInterval(function(){if(SW||SD.anim||SD.drag||SD.fx){BL=0;return}var m=main(),p=$i('sd3');if(!m){BL=0;return}
  var x=0;try{x=m.getBoundingClientRect().left}catch(e){}var on=!!(p&&/\bon\b/.test(p.className)),rows=p?p.querySelectorAll('[data-sd]').length:0;
  var bad=SD.on?(!on||rows<1||(SD.pos>SD.X-2&&x<2)):x>2;
  if(!bad){BL=0;return}if(++BL<3)return;BL=0;
  W.cbDiag&&cbDiag('sd_blank',{on:SD.on?1:0,pon:on?1:0,rows:rows,x:Math.round(x),pos:Math.round(SD.pos||0),tab:W.U?U.tab:''});
  if(SD.on){if(!on||rows<1)paint();if(x<2)setPos(m,SD.pos=SD.X);cover()}else{m.classList.remove('sd3main');m.style.transform='';m.style.borderTopLeftRadius=m.style.borderBottomLeftRadius='';if(m.__dm)m.__dm.style.opacity='0';cover()}},500);/*s3-3*/
 function entEnd(){ENT.on=0;clearTimeout(ENT.tm);B.classList.remove('sd3ent')}
 function entStart(k0){var s=st();if(!s||s.view=='chat')return;
  /* ни разу не открывали чат (первый запуск) — показываем список базы: из чего выбирать */
  if(!k0&&!lsg('sd3last',null))return;ENT.on=1;ENT.t0=Date.now();B.classList.add('sd3ent');clearTimeout(ENT.tm);ENT.tm=setTimeout(entEnd,8000);
  var L=lsg('sd3last',null),k=KN[k0]?k0:(L&&KN[L.k]?L.k:s.kind);if(s.kind!=k)hcDo('kind',{v:k});entTick()}
 function entTick(){if(!ENT.on)return;var s=st();if(!s||!(W.U&&U.tab=='hc')){entEnd();return}if(s.view=='chat'){entEnd();return}
  if(s.lerr){entEnd();return}
  if(!s.sessions){/*vb5a-1: список ещё грузится — последний чат берём из кэша списка (sd3L_<агент>), экран чата сразу, сообщения из кэша sd3mc*/
   var C0=SD.L[s.kind],L0=lsg('sd3last',null),c0=L0&&L0.k==s.kind&&C0&&C0.some(function(x){return x.id==L0.id})?L0.id:null;
   if(c0){var k0=s.kind;HC.st.sessions=C0.map(function(x){var y={};for(var q in x)y[q]=x[q];if(k0!='hermes')y.cc=true;return y});hcDo('open',{id:c0});mcFill(k0,c0);entEnd();return}
   setTimeout(entTick,120);return}
  var L=lsg('sd3last',null),id=L&&L.k==s.kind&&s.sessions.some(function(x){return x.id==L.id})?L.id:null;
  if(!id){var a=s.sessions.filter(function(x){return x.src!='cron'}).sort(function(x,y){return (y.ts||0)-(x.ts||0)})[0];id=a&&a.id}
  if(!id){entEnd();return}
  hcDo('open',{id:id});mcFill(s.kind,id);/*s4c-5d*/setTimeout(function(){entEnd()},400)}
 /* нажатие вкладки «Чат» (нижняя панель или пункт меню) → вход */
 W.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-a=tab][data-x=hc]');if(!t)return;setTimeout(function(){var s=st();if(s&&s.view=='list'&&W.U&&U.tab=='hc')entStart()},0)},false);
 /* панель открылась сразу на вкладке «Чат» */
 setTimeout(function(){var s=st();if(s&&s.view=='list'&&W.U&&U.tab=='hc'&&!W.LOADING)entStart()},1500);
 /* «Назад» Telegram в чате = боковое меню (как ☰), а не старый список; второе нажатие — закрыть */
 function tgBack(){if(SD.rc){rcClose();return}if($i('sd3set')&&$i('sd3set').classList.contains('on')){setClose();return}
  if(W.U&&U.page=='hcchat'&&main()){SD.on?close():open();return}if(typeof W.back=='function')W.back()}
 try{if(W.tg&&tg.BackButton&&tg.BackButton.offClick&&typeof W.back=='function'){tg.BackButton.offClick(W.back);if(W._back86)tg.BackButton.offClick(W._back86);/*vb7b-3: база подписала исходный back, prj.js его обернул — снимать оба*/tg.BackButton.onClick(tgBack)}}catch(e){}
 W.SD3={goTab:goTab,newChat:newChat,pop:pop,mi:mi,user:user,ic:ic,agIc:agIc,api:api,sty:sty,folder:folder,goAgent:goAgent,lastOf:lastOf,entry:entStart,tgBack:tgBack,open:open,close:close,closeAll:closeAll,rcOpen:rcOpen,rcClose:rcClose,setOpen:setOpen,setClose:setClose,filterMenu:filterMenu,rowMenu:rowMenu,closePop:closePop,
  paint:paint,load:load,SD:SD,all:all,pinned:pinned,openChat:openChat,
  /* для сверки со стоп-кадром: позиция экрана в pt и мгновенная отрисовка */
  at:function(x){SD.pos=x;setPos(main(),x);cover()}};
})();
