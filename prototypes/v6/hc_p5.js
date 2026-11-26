/* Вкладка «Чат»: свой чат с Hermes через tv_server (/api/hc/*) -> API-сервер Hermes. v6.
   Состояние живёт в HC.st; отрисовка идёт мимо общего render(): стрим не должен стирать поле ввода. */
var HC=(function(){
var st={kind:LS.get('hckind','hermes'),call:LS.get('hccall',false),ccoff:null,cclive:false,view:'list',sessions:null,all:LS.get('hcall',false),sid:null,title:'',rw:true,src:'',msgs:[],lim:120,busy:false,run:null,pend:[],draft:'',imgs:[],err:'',lerr:'',loadingMsgs:false,cur:null,watch:0,ac:null,models:null,merr:'',msel:null,mprov:'',mq:'',rt:null,perm:''};
var rafId=0;
function base(){return st.kind=='claude'?'/cc':st.kind=='codex'?'/cx':''}
function agentName(){return st.kind=='claude'?'Claude':st.kind=='codex'?'Codex':'Hermes'}
function AL(){return st.kind=='claude'?st.call:st.all}
var STC={completed:'готово',blocked:'ждёт',review_ready:'на проверке'};
function root(){return document.getElementById('hcroot')}
function mounted(){return !!root()}
function live(){return !!API&&API!='mock'}
function hq(path,o){o=o||{};var h={'X-Init-Data':tg?tg.initData:''};if(o.body!==undefined)h['Content-Type']='application/json';
 return fetch(API.replace(/\/$/,'')+'/api/hc'+path,{method:o.method||'GET',headers:h,body:o.body!==undefined?JSON.stringify(o.body):undefined,signal:o.signal})}
function J(path,o){return hq(path,o).then(function(r){if(!r.ok)return r.json().catch(function(){return{}}).then(function(j){var e=new Error(j.text||(r.status==401?'Подпись устарела: закрой и снова открой панель из меню бота.':j.error||('HTTP '+r.status)));e.status=r.status;throw e});return r.json()})}
function E(s){return esc(s)}
function ago(ts){if(!ts)return '';var d=new Date(ts*1000),n=new Date(),p=function(x){return (x<10?'0':'')+x},t=p(d.getHours())+':'+p(d.getMinutes());
 var dd=Math.floor((new Date(n.getFullYear(),n.getMonth(),n.getDate())-new Date(d.getFullYear(),d.getMonth(),d.getDate()))/864e5);
 return dd<=0?t:dd==1?'вчера '+t:dd<7?['вс','пн','вт','ср','чт','пт','сб'][d.getDay()]+' '+t:p(d.getDate())+'.'+p(d.getMonth()+1)}
var SRC={api_server:'Панель',telegram:'Telegram',gui:'Desktop',local:'Desktop',cli:'Терминал',cron:'Cron'};
var EFF={low:'Низк',medium:'Сред',high:'Выс',xhigh:'Оч. выс',max:'Макс',ultra:'Ультра'};/*s5-1*/
/* ---------- модель ---------- */
function pretty(m){if(/^gpt-/i.test(String(m||'')))return String(m).replace(/^gpt-/i,'GPT-').replace(/-([a-z])/g,function(x,c){return '-'+c.toUpperCase()});m=String(m||'').replace(/^[^/]*\//,'').replace(/\[[^\]]*\]/g,'').replace(/^claude-/,'').replace(/-(\d{8})$/,'').replace(/-(\d)-(\d)(?!\d)/g,' $1.$2').replace(/-(\d)(?=$|-)/g,' $1').replace(/-/g,' ').trim();return m.charAt(0).toUpperCase()+m.slice(1)}
function loadSel(id){try{var v=LS.get('hcmodel:'+id,null);return v&&v.m?v:null}catch(e){return null}}
function saveSel(id,v,nl){try{LS.set('hcmodel:'+id,v);if(!nl&&st.kind)LS.set('hcmlast_'+st.kind,v||{})}catch(e){}}
/* s4a-sel: новый чат берёт последний выбор модели этого агента (как у родных), а не «Авто» */
function lastSel(k){try{var v=LS.get('hcmlast_'+(k||st.kind),null);return v&&(v.m||v.e)?v:null}catch(e){return null}}
function loadModels(force){if(!live())return Promise.resolve();if(st.models&&!force)return Promise.resolve(st.models);st.merr='';
 return J(base()+'/models').then(function(d){st.models=d;paint();return d}).catch(function(e){st.merr=e.message||'Ошибка';paint()})}
function chipTxt(){var sel=st.msel;if(sel&&sel.m)return pretty(sel.m);var c=st.models&&st.models.cur&&st.models.cur.model;return c?pretty(c):'Модель'}
function effTxt(){var e=st.msel&&st.msel.e;return e?EFF[e]:'Авто'}
function subTxt(){/*p5one*/if(!st.rw&&deskOK())return deskRun()?'отвечает…':(st.kind!='codex'&&st.msel&&st.msel.m?chipTxt():agentName());return st.rw?(st.models||st.msel?chipTxt():agentName()):'только чтение'}
function deskRun(){if(st.sid&&st.dsq&&st.dsq[st.sid])return true;/*s4a-run: сообщение ещё уходит на ПК — уже «работает»*/return st.kind=='hermes'?!!(st.cur&&st.cur.live||st.hpoll&&st.hpoll==st.sid):!!st.cclive}/*s3-1c-run*/
function sendBtn(){var s=document.getElementById('hcsend');if(!s)return;var dk=!st.rw&&deskOK(),idle=!(st.draft||'').trim()&&!st.imgs.length,stp=dk?(deskRun()&&idle):st.busy;
 s.className='hcsendb'+(stp?' stop':'')+(dk&&st.dsq&&st.dsq[st.sid]?' wait':'')/*s4a-wait*/;s.innerHTML=stp?IC('square'):IC('arrow-up')}
function cxFresh(){return st.kind=='codex'&&!st.rw&&!!st.sid&&!st.loadingMsgs&&!st.msgs.length&&!(st.dsq&&st.dsq[st.sid])}/*vb5m: у нового чата Codex модель первого хода выбирается (config.toml на время подхвата)*/
function chipsHtml(){if(!st.rw&&st.kind=='codex'&&!cxFresh())return '';return '<div class="hcchip" data-hc="model">'+E(chipTxt())+(st.msel&&st.msel.m?'<i class="on"></i>':'')+IC('chevron-down')+'</div><div class="hcchip" data-hc="effort">'+E(effTxt())+IC('chevron-down')+'</div>'}
function modelSheet(){var M=st.models;
 if(!M){sheet('<div class="hcsh"><b>Модель</b></div><div class="hint2">'+(st.merr?E(st.merr):'Загружаю список…')+'</div><div class="btn" data-hc="close">Закрыть</div>');if(!st.models)loadModels().then(function(){if(st.models)modelSheet()});return}
 if(!st.mprov){var cp=st.msel&&st.msel.p||M.cur.provider;st.mprov=M.p.some(function(p){return p.slug==cp})?cp:(M.p[0]&&M.p[0].slug)||''}
 var h='<div class="hcsh"><b>Модель</b></div><div class="hcmprov">'+M.p.map(function(p){return '<span class="'+(p.slug==st.mprov?'on':'')+'" data-hc="mprov" data-v="'+E(p.slug)+'">'+E(p.name)+'</span>'}).join('')+'</div>'+
 '<input id="hcmq" class="hcinp" placeholder="Поиск модели" value="'+E(st.mq).replace(/"/g,'&quot;')+'"><div id="hcml" class="hcml"></div><div class="btn" data-hc="close">Закрыть</div>';
 sheet(h);mlist()}
function mlist(){var el=document.getElementById('hcml');if(!el||!st.models)return;var p=st.models.p.filter(function(x){return x.slug==st.mprov})[0];if(!p){el.innerHTML='';return}
 var q=st.mq.toLowerCase(),cur=st.msel&&st.msel.m,curp=st.msel&&st.msel.p;
 var def=(!cur?'<div class="hcmi on" data-hc="mdef">'+IC('check')+'<b>По умолчанию</b><span>'+E(pretty(st.models.cur.model))+'</span></div>':'<div class="hcmi" data-hc="mdef"><i></i><b>По умолчанию</b><span>'+E(pretty(st.models.cur.model))+'</span></div>');
 var items=p.m.filter(function(m){return !q||m.toLowerCase().indexOf(q)>=0||pretty(m).toLowerCase().indexOf(q)>=0});
 el.innerHTML=def+items.map(function(m){var on=cur==m&&curp==p.slug;return '<div class="hcmi'+(on?' on':'')+'" data-hc="mpick" data-m="'+E(m)+'" data-p="'+E(p.slug)+'">'+(on?IC('check'):'<i></i>')+'<b>'+E(pretty(m))+'</b><span>'+E(m)+'</span></div>'}).join('')+(items.length?'':'<div class="hint2">Ничего не найдено</div>')}
function pickModel(m,p){var e=st.msel&&st.msel.e;st.msel=m?{m:m,p:p,e:e||''}:(e?{m:'',p:'',e:e}:null);if(st.msel&&!st.msel.m&&!st.msel.e)st.msel=null;saveSel(st.sid,st.msel||{});unsheet();paintChat();if(m)toast('Модель: '+pretty(m))}
function effortSheet(){sheet('<div class="hcsh"><b>Глубина размышления</b></div><div class="hint2">Сколько Hermes думает перед ответом. «Авто» — как настроено на ПК.</div>'+
 [['','Авто'],['low','Низкая'],['medium','Средняя'],['high','Высокая']].map(function(x){var on=((st.msel&&st.msel.e)||'')==x[0];return '<div class="hcmi'+(on?' on':'')+'" data-hc="epick" data-e="'+x[0]+'">'+(on?IC('check'):'<i></i>')+'<b>'+x[1]+'</b></div>'}).join('')+'<div class="btn" data-hc="close">Закрыть</div>')}
function pickEffort(e){var m=st.msel&&st.msel.m,p=st.msel&&st.msel.p;st.msel=(m||e)?{m:m||'',p:p||'',e:e}:null;saveSel(st.sid,st.msel||{});unsheet();paintChat()}

/* ---------- markdown (минимальный, всё экранируется) ---------- */
function inl(t){return t.replace(/`([^`\n]+)`/g,'<code>$1</code>').replace(/\*\*([^*\n]+)\*\*/g,'<b>$1</b>')
 .replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g,function(m,a,u){return '<a data-hc="link" data-u="'+u.replace(/"/g,'%22')+'">'+a+'</a>'})}
function blocks(t){var lines=E(t).split('\n'),out=[],ul=null,tbl=[];
 function flush(){if(ul){out.push('<'+ul.t+'>'+ul.i.join('')+'</'+ul.t+'>');ul=null}if(tbl.length){out.push('<pre class="hcpre">'+tbl.join('\n')+'</pre>');tbl=[]}}
 lines.forEach(function(l){var m;
  if(/^\s*\|/.test(l)){if(ul){flush()}tbl.push(l);return}else if(tbl.length)flush();
  if((m=/^\s*[-*•]\s+(.*)$/.exec(l))){if(!ul||ul.t!='ul'){flush();ul={t:'ul',i:[]}}ul.i.push('<li>'+inl(m[1])+'</li>');return}
  if((m=/^\s*\d+[.)]\s+(.*)$/.exec(l))){if(!ul||ul.t!='ol'){flush();ul={t:'ol',i:[]}}ul.i.push('<li>'+inl(m[1])+'</li>');return}
  flush();
  if((m=/^#{1,4}\s+(.*)$/.exec(l))){out.push('<div class="hch">'+inl(m[1])+'</div>');return}
  if(!l.trim()){out.push('<div class="hcsp"></div>');return}
  out.push('<div>'+inl(l)+'</div>')});
 flush();return out.join('')}
/* s3-5b: строка «MEDIA:<путь к картинке>» в ответе Hermes — картинка (грузится с ПК), а не голый путь */
function md(src){src=String(src||'');var MED=[];src=src.replace(/^[ \t]*MEDIA:[ \t]*([^\n]+?\.(?:jpe?g|png|webp|gif))[ \t]*$/gim,function(_,p){MED.push(p);return '\u0001M'+(MED.length-1)+'\u0001'});
 var out=md0(src);if(MED.length)out=out.replace(/\u0001M(\d+)\u0001/g,function(_,i){return '<img class="hcmedia" data-fp="'+E(MED[+i])+'" alt="фото">'});return out}
function md0(src){src=String(src||'');var parts=[],re=/(?:^|\n)[ \t]{0,3}```([\w+.-]*)[ \t]*\n([\s\S]*?)(?:\n[ \t]{0,3}```[ \t]*(?=\n|$)|$(?![\s\S]))/g,last=0,m;
 while((m=re.exec(src))){if(m[0]===''){re.lastIndex++;continue}parts.push(blocks(src.slice(last,m.index)));parts.push('<pre class="hcpre"><code>'+E(m[2].replace(/\n$/,''))+'</code></pre>');last=re.lastIndex}
 var rest=src.slice(last),o=-1;
 if(o>=0){parts.push(blocks(rest.slice(0,o)));parts.push('<pre class="hcpre"><code>'+E(rest.slice(o+3).replace(/^[\w+.-]*\n?/,''))+'</code></pre>')}else parts.push(blocks(rest));
 return parts.join('')}

/* ---------- история -> блоки ---------- */
function argPreview(a){if(!a)return '';try{var j=typeof a=='string'?JSON.parse(a):a;var k=['command','cmd','path','file_path','query','url','pattern','prompt','text'];for(var i=0;i<k.length;i++)if(j[k[i]])return String(j[k[i]]);var v=Object.keys(j)[0];if(!v)return '';var x=j[v];return typeof x=='string'?x:(x&&typeof x=='object'?JSON.stringify(x):String(x))}catch(e){return String(a)}}
function resErr(s){try{var j=JSON.parse(s);if(j&&typeof j=='object'){if(j.error)return true;if(j.exit_code!=null&&j.exit_code!==0)return true}}catch(e){}return false}
/*vb5g4: ходы автоматизаций Codex приходят XML-ом <heartbeat>…</heartbeat> — показываем словами*/
function hbTx(c,r){var g=function(k){var mm=String(c).match(new RegExp('<'+k+'>([\\s\\S]*?)</'+k+'>'));return mm?mm[1].trim():''};
 if(r=='user'){var id=g('automation_id'),ins=g('instructions');return 'Автоматизация'+(id?' «'+id+'»':'')+' — проверка по расписанию'+(ins?'\n\n'+ins:'')}
 var msg=g('message'),dec=g('decision');return (msg||String(c).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim())+(dec=='NOTIFY'?'\n\n(уведомить)':'')}
function fromHistory(m,out0){var out=(out0||[]).filter(function(b){return !b.lp}),a=out.length&&out[out.length-1].k=='a'?out[out.length-1]:null;
 m.forEach(function(x){if(x&&(x.r=='user'||x.r=='assistant')&&/^\s*<heartbeat>/.test(x.c||'')){var y={};for(var q in x)y[q]=x[q];y.c=hbTx(x.c,x.r);x=y}
  if(x.r=='user'){a=null;var c=x.c||'',im=0,ip=[];/*s3-5a*/c=c.replace(/\n*\[Image attached at:([^\]]*)\]/g,function(_,pp){im++;pp=String(pp||'').trim();if(pp)ip.push(pp);return ''}).replace(/\n*\[screenshot\]/g,'').trim();if(im&&/^Посмотри на изображени[ея]\.?$/.test(c))c='';/*s4a-cap: подпись, которую подставил ПК к фото без текста, не показываем*/if(c||im)out.push({k:'u',t:c,im:im,ip:ip,ts:x.ts||0});return}/*s3-5a-push*/
  if(x.r=='assistant'){if(!a){a={k:'a',parts:[]};out.push(a)}if(x.ts)a.ts=x.ts;if((x.c||'').trim())a.parts.push({p:'t',t:x.c});(x.tc||[]).forEach(function(c){a.parts.push({p:'tool',id:c.id,n:c.n||'tool',a:c.a||'',st:'nr',res:''})});return}
  if(x.r=='tool'){for(var i=out.length-1;i>=0;i--){if(out[i].k!='a')continue;var f=out[i].parts.filter(function(p){return p.p=='tool'&&p.id==x.tid})[0];if(f){f.res=x.c||'';f.st=resErr(x.c)?'err':'ok';break}}}
 });
 return withLocal(out.filter(function(b){return b.k!='a'||b.parts.length}))}
/* s2-1: своё сообщение в чате ПК видно сразу после ↑, пока история с ПК его не вернула (Codex ждёт до 25 с, Hermes — до ответа шлюза).
   Локальный пузырь снимается, как только в истории появилось новое сообщение пользователя (или тот же текст). */
function nrm(t){return String(t||'').replace(/\s+/g,' ').trim().slice(0,60)}
function withLocal(out){out=withFail(out);var L=st.lp;if(!L||!L.length)return out;var now=Date.now()/1000,nu=out.filter(function(b){return b.k=='u'&&!b.lp}).length;
 st.lp=L.filter(function(p){if(now-p.ts>dlvLife(p))return false;if(p.sid!=st.sid)return true;
  var got=nu>p.nu||out.some(function(b){return b.k=='u'&&!b.lp&&nrm(b.t)==nrm(p.t)&&nrm(p.t)});
  if(got){window.cbDiag&&cbDiag('desk_feed',{ag:p.k,ms:Date.now()-p.t0,via:st.hwSeen>p.t0?'watch':'poll'});return false}
  out.push({k:'u',t:p.t,im:p.im,ts:p.ts,lp:1,dl:p.st||'',dt0:p.t0});return true});dlvSave();return out}
/* s4a-wf: неотправленные сообщения этого чата — в конец ленты; ушли иначе (история вернула тот же текст позже) — убираем */
function withFail(out){var F=failLoad().filter(function(f){return f.sid==st.sid});if(!F.length)return out;var ch=0;
 F.forEach(function(f){if(out.some(function(b){return b.k=='u'&&!b.lp&&b.ts>=f.ts-5&&nrm(b.t)==nrm(f.t)&&nrm(f.t)})){st.fl=st.fl.filter(function(x){return x!==f});ch=1;return}
  out.push({k:'u',t:f.t,im:f.im,ts:f.ts,lp:1,fail:f.err||'',ft:f.t0,unc:f.unc?1:0})});if(ch)failSave();return out}

/* ---------- отрисовка ---------- */
function shell(){return '<div id="hcroot"></div>'}
function toolHtml(t,bi,pi){var s0=t.st=='nr'?(st.cclive&&!st.rw&&bi==st.msgs.length-1?'run':'ok'):t.st;/*s4tool*/
 var cls=s0=='run'?'run':s0=='err'?'err':'ok',ic=s0=='run'?'<span class="hcspin"></span>':s0=='err'?IC('x'):IC('check');
 var line=argPreview(t.a);if(line.length>90)line=line.slice(0,90)+'…';
 return '<div class="hctool '+cls+(t.open?' open':'')+'"><div class="hct" data-hc="tool" data-b="'+bi+'" data-p="'+pi+'"><i>'+ic+'</i><b>'+E(t.n)+'</b><span>'+E(line)+'</span></div>'+
  (t.open?'<div class="hctb">'+(t.a?'<div class="hcl">запрос</div><pre class="hcpre">'+E(typeof t.a=='string'?t.a:JSON.stringify(t.a)).slice(0,3000)+'</pre>':'')+(t.res?'<div class="hcl">результат</div><pre class="hcpre">'+E(String(t.res).slice(0,3000))+'</pre>':'')+'</div>':'')+'</div>'}
function msgTime(ts){if(!ts)return '';var d=new Date(ts*1000),n=new Date(),p=function(x){return (x<10?'0':'')+x},t=p(d.getHours())+':'+p(d.getMinutes());
 if(d.toDateString()==n.toDateString())return t;var y=d.getFullYear()!=n.getFullYear()?'.'+String(d.getFullYear()).slice(2):'';return p(d.getDate())+'.'+p(d.getMonth()+1)+y+' '+t}
function msgText(b){if(!b)return '';if(b.k=='u')return b.t||'';return (b.parts||[]).filter(function(p){return p.p=='t'}).map(function(p){return p.t}).join('\n\n')}
function metaHtml(b,i){var t=msgTime(b.ts),has=!!msgText(b).trim();if(!t&&!has)return '';if(b.live&&!has)return '';
 return '<div class=\"hcmeta\">'+(t?'<span class=\"hctm\">'+E(t)+'</span>':'')+(has?'<span class=\"hccp\" data-hc=\"copy\" data-b=\"'+i+'\" title=\"Копировать\">'+IC('copy')+'</span>':'')+(has?'<span class=\"hccp\" data-hc=\"seltx\" data-b=\"'+i+'\" title=\"Выделить\">'+IC('type')+'</span>':'')+'</div>'}
function diag(ev,o){try{o=o||{};o.ev=ev;o.ua=String(navigator.userAgent).slice(0,180);o.pl=tg&&tg.platform;o.tv=tg&&tg.version;o.sc=!!window.isSecureContext;o.ver=typeof VER!='undefined'?VER:0;hq('/diag',{method:'POST',body:o}).catch(function(){})}catch(e){}}
function copyText(tx,done){var r={n:tx.length,ex:0,cb:'-'},ok=false,sh=document.getElementById('sheet'),host=sh&&sh.classList.contains('on')?sh:document.body,sel=window.getSelection&&window.getSelection(),keep=[];
 try{for(var q=0;sel&&q<sel.rangeCount;q++)keep.push(sel.getRangeAt(q))}catch(e){}
 try{var a=document.createElement('textarea');a.value=tx;a.setAttribute('inputmode','none');a.style.cssText='position:fixed;top:0;left:0;width:1px;height:1px;padding:0;border:0;margin:0;opacity:0.01;font-size:16px;z-index:-1';host.appendChild(a);
  a.contentEditable='true';a.readOnly=false;var rg=document.createRange();rg.selectNodeContents(a);if(sel){sel.removeAllRanges();sel.addRange(rg)}
  try{a.focus({preventScroll:true})}catch(e){a.focus()}a.select();try{a.setSelectionRange(0,tx.length+1)}catch(e){}
  ok=!!document.execCommand('copy');r.ex=ok?1:0;a.blur();host.removeChild(a)}catch(e){r.exe=String(e).slice(0,80)}
 try{if(sel){sel.removeAllRanges();keep.forEach(function(k){sel.addRange(k)})}}catch(e){}
 if(ok){done(true);diag('copy',r);return}
 if(navigator.clipboard&&navigator.clipboard.writeText){r.cb='try';try{navigator.clipboard.writeText(tx).then(function(){r.cb='ok';done(true);diag('copy',r)},function(e){r.cb='err:'+(e&&e.name);done(false);diag('copy',r)})}catch(e){r.cb='throw';done(false);diag('copy',r)}}else{done(false);diag('copy',r)}}
/* ---------- свайп вниз: базовый ptr (rotate+translate) в чате дёргался — глушим, в списке свой ---------- */
(function(){var y0=null,dy=0,lst=null;function pt(){return document.getElementById('ptr')}
 document.addEventListener('touchstart',function(e){var r=root();if(!r||!r.contains(e.target))return;e.stopPropagation();window.PY=null;
  lst=e.target.closest&&e.target.closest('.hclist');y0=(lst&&lst.scrollTop<=0&&st.view=='list')?e.touches[0].clientY:null;dy=0},{capture:true,passive:true});
 document.addEventListener('touchmove',function(e){var r=root();if(!r||!r.contains(e.target))return;e.stopPropagation();
  if(y0==null)return;dy=Math.max(0,e.touches[0].clientY-y0);var p=pt();if(p){p.style.transition='none';p.style.transform='translateY('+(Math.min(dy*.6,60)-50)+'px)';p.style.opacity=Math.min(1,dy/70)}},{capture:true,passive:true});
 document.addEventListener('touchend',function(e){var r=root();if(!r||!r.contains(e.target))return;e.stopPropagation();
  var p=pt();if(p){p.style.transition='';p.style.transform='';p.style.opacity=''}
  if(y0!=null&&dy>70){var b=document.querySelector('[data-hc=refresh]');if(b)b.click();haptic('sel')}y0=null;dy=0},{capture:true});
 try{var T=window.Telegram&&Telegram.WebApp;if(T&&T.disableVerticalSwipes)T.disableVerticalSwipes()}catch(e){}
})();
function msgsHtml(){var h='',from=Math.max(0,st.msgs.length-st.lim);
 if(from>0)h+='<div class="hcmore" data-hc="older">Показать более ранние ('+from+')</div>';
 for(var i=from;i<st.msgs.length;i++){var b=st.msgs[i];
  if(b.k=='u'){h+='<div class="hcrow u" data-mi="'+i+'"><div class="hcwrap"><div class="hcb u">'+(b.im?'<div class="hcim">'+IC('image')+' '+b.im+' фото</div>':'')+(b.t?md(b.t):'')+'</div>'+metaHtml(b,i)+'</div></div>';continue}
  var inner='';b.parts.forEach(function(p,pi){inner+=p.p=='t'?'<div class="hct2">'+md(p.t)+'</div>':toolHtml(p,i,pi)});
  if(b.live&&!b.parts.length)inner='<div class="hcdots"><i></i><i></i><i></i></div>';
  else if(b.live&&b.parts[b.parts.length-1].p=='tool'&&b.parts[b.parts.length-1].st!='run')inner+='<div class="hcdots"><i></i><i></i><i></i></div>';
  h+='<div class="hcrow a" data-mi="'+i+'"><div class="hcwrap a"><div class="hcb a">'+inner+'</div>'+metaHtml(b,i)+'</div></div>'}
 st.pend.forEach(function(p,i){h+=pendHtml(p,i)});
 if(st.err)h+='<div class="hcerr">'+E(st.err)+'</div>';
 return h}
function pendHtml(p,i){var who=agentName();
 if(p.kind=='clarify'){var ops=(p.opts||[]).map(function(o){return '<div class="btn" data-hc="clarop" data-i="'+i+'" data-v="'+E(o).replace(/"/g,'&quot;')+'">'+E(o)+'</div>'}).join('');
  return '<div class="hcpend"><div class="hcpk">'+IC('message-circle-question')+' '+E(who)+' спрашивает</div><div class="hcpq">'+E(p.text)+'</div>'+(ops?'<div class="hcpa hcops">'+ops+'</div>':'')+'<div class="hcpa"><input id="hcclar" placeholder="'+(ops?'Свой ответ':'Ответ')+'"><div class="btn pri" data-hc="clarify" data-i="'+i+'">Ответить</div>'+(st.kind!='hermes'?'<div class="btn" data-hc="clarskip" data-i="'+i+'">Пропустить</div>':'')+'</div></div>'}
 return '<div class="hcpend"><div class="hcpk">'+IC('shield-check')+' Нужно разрешение'+(p.tool&&st.kind!='hermes'?' · '+E(p.tool):'')+'</div>'+(p.desc?'<div class="hcpq">'+E(p.desc)+'</div>':'')+(p.text?'<pre class="hcpre">'+E(p.text)+'</pre>':'')+
  '<div class="hcpa"><div class="btn pri" data-hc="appr" data-c="once" data-i="'+i+'">Разрешить</div><div class="btn" data-hc="appr" data-c="session" data-i="'+i+'">'+(st.kind=='hermes'?'На сессию':'Всегда в чате')+'</div><div class="btn bad" data-hc="appr" data-c="deny" data-i="'+i+'">Отклонить</div></div></div>'}
function paint(){if(!mounted())return;if(st.view=='list'){paintList();return}
 var m=document.getElementById('hcmsgs');if(!m){paintChat();return}
 var near=m.scrollHeight-m.scrollTop-m.clientHeight<140,nh=msgsHtml(),sl=window.getSelection&&window.getSelection(),selin=sl&&!sl.isCollapsed&&sl.rangeCount&&m.contains(sl.anchorNode);
 if(m.__h===nh||(selin&&!st.stick)){if(selin&&m.__h!==nh)selWait=1}else{m.__h=nh;selWait=0;m.innerHTML=nh;if(near||st.stick)m.scrollTop=m.scrollHeight}st.stick=false;
 sendBtn();
 var th=document.getElementById('hcthumbs');if(th)th.innerHTML=thumbsHtml();var ch=document.getElementById('hcchips');if(ch)ch.innerHTML=chipsHtml();var sb=document.getElementById('hcsub');if(sb)sb.textContent=subTxt()}
var selWait=0;document.addEventListener('selectionchange',function(){if(!selWait)return;var s=window.getSelection();if(s&&s.isCollapsed){selWait=0;setTimeout(function(){if(mounted()&&st.view=='chat')paint()},250)}});
function schedule(){if(rafId)return;rafId=requestAnimationFrame(function(){rafId=0;paint()})}
function thumbsHtml(){return st.imgs.map(function(u,i){return '<div class="hcth"><img src="'+u+'"><span data-hc="rmimg" data-i="'+i+'">'+IC('x')+'</span></div>'}).join('')}
/* ---------- группы сессий как в Desktop: PINNED, даты, потом по источнику (API, TELEGRAM …) ---------- */
var DATEG=['TODAY','YESTERDAY','EARLIER THIS WEEK','LAST WEEK','EARLIER'];
function dgroup(ts){var n=new Date(),d=new Date(ts*1000),sod=function(x){return new Date(x.getFullYear(),x.getMonth(),x.getDate()).getTime()},day=864e5,t0=sod(n),dd=Math.round((t0-sod(d))/day);
 if(dd<=0)return 0;if(dd==1)return 1;var wd=(n.getDay()+6)%7,mon=t0-wd*day;if(sod(d)>=mon)return 2;if(sod(d)>=mon-7*day)return 3;return 4}
function srcName(x){return x=='api_server'?'API':(SRC[x]||x||'OTHER').toUpperCase()}
function rowHtml(s){return '<div class="hcsess'+(s.cc?' cc':'')+'" data-hc="open" data-id="'+E(s.id)+'"><i class="hcbul'+(s.pin?' pin':'')+'"></i><div class="hcsb"><b>'+E(s.t||'Без названия')+'</b><div class="hcsm">'+(s.rw||s.cc?'':IC('eye')+' ')+E(s.cc?s.src:srcName(s.src))+(s.n!=null?' · '+s.n+(s.cc?' ходов':' сообщ.'):'')+(s.model?' · '+E(pretty(s.model)):'')+(s.stc&&STC[s.stc]?' · <em class="hcst '+s.stc+'">'+STC[s.stc]+'</em>':'')+(s.wait?' · <em class="hcst blocked">ждёт ответа</em>':s.live?' · <em class="hclv">идёт</em>':'')+'</div></div><span>'+E(ago(s.ts))+'</span><div class="hcpin'+(s.pin?' on':'')+'" data-hc="pin" data-id="'+E(s.id)+'" title="'+(s.pin?'Открепить':'Закрепить')+'">'+IC('pin')+'</div></div>'}
var SLM={'PINNED':'Закреплённые','TODAY':'Сегодня','YESTERDAY':'Вчера','EARLIER THIS WEEK':'Раньше на неделе','LAST WEEK':'Прошлая неделя','EARLIER':'Ранее','ИДЁТ СЕЙЧАС':'Идёт сейчас'};
function secHtml(label,n,key,open){label=(st.kind!='hermes'&&SLM[label])||label;return '<div class="hcsec'+(key?' tap':'')+'"'+(key?' data-hc="fold" data-k="'+E(key)+'"':'')+'><span>'+E(label)+'</span>'+(n!=null?'<em>'+n+'</em>':'')+(key?IC(open?'chevron-down':'chevron-right'):'')+'</div>'}
function groupsHtml(){var L=(st.sessions||[]).slice().sort(function(a,b){return b.ts-a.ts}),h='',fold=LS.get('hcfold',{}),lv=st.kind!='hermes'?L.filter(function(x){return x.live}):[],pins=L.filter(function(x){return x.pin&&lv.indexOf(x)<0}),rest=L.filter(function(x){return !x.pin&&lv.indexOf(x)<0});
 if(lv.length)h+=secHtml('ИДЁТ СЕЙЧАС',lv.length)+lv.map(rowHtml).join('');
 var pn=st.kind!='hermes'?L.filter(function(x){return x.rw&&lv.indexOf(x)<0}):[];if(pn.length){h+=secHtml('ДРУГИЕ ЧАТЫ',pn.length)+pn.map(rowHtml).join('');rest=rest.filter(function(x){return pn.indexOf(x)<0});pins=pins.filter(function(x){return pn.indexOf(x)<0})}
 if(pins.length)h+=secHtml('PINNED',pins.length)+pins.map(rowHtml).join('');
 var dated=[],bysrc={};
 rest.forEach(function(x){if(st.kind!='hermes'||!st.all||x.src=='gui'||x.src=='local'||x.src=='cli'||!x.src)dated.push(x);else(bysrc[x.src]=bysrc[x.src]||[]).push(x)});
 var g=[[],[],[],[],[]];dated.forEach(function(x){g[dgroup(x.ts)].push(x)});
 g.forEach(function(a,i){if(a.length)h+=secHtml(DATEG[i],a.length)+a.map(rowHtml).join('')});
 Object.keys(bysrc).sort(function(a,b){return (a=='api_server'?0:1)-(b=='api_server'?0:1)||(bysrc[b][0].ts-bysrc[a][0].ts)}).forEach(function(k){var a=bysrc[k],open=fold[k]===undefined?k=='api_server':!!fold[k];h+=secHtml(srcName(k),a.length,k,open)+(open?a.map(rowHtml).join(''):'')});
 return h}
function togglePin(id){var s=(st.sessions||[]).filter(function(x){return x.id==id})[0],v=s?!s.pin:!st.pin;if(s)s.pin=v;if(st.sid==id)st.pin=v;paint();
 J('/sessions/'+encodeURIComponent(id),{method:'PATCH',body:{pinned:v}}).then(function(){toast(v?'Закреплено':'Откреплено')}).catch(function(e){if(s)s.pin=!v;if(st.sid==id)st.pin=!v;paint();toast(E(e.message))})}
function paintList(){var r=root();if(!r)return;r.className='k-'+st.kind;
 var h='<div class="hd hchd"><div class="logo" data-st="ok"></div><div class="hcmid"><h1>'+KN[st.kind]+'</h1><div class="st"><span class="dot ok"></span>чат'+(st.sessions?' · '+st.sessions.length+' сесс.':'')+'</div></div><div class="r"><div class="ib" data-hc="refresh" title="Обновить">'+IC('refresh-cw')+'</div></div></div>';
 h+=kindBar();h+='<div class="hcnew" data-hc="new">'+IC('plus')+'<b>'+(st.kind=='claude'?'Новый чат Claude':st.kind=='codex'?'Новый чат Codex':'Новая сессия')+'</b></div>';
 h+=(st.kind=='codex'?'':'<div class="hcfil sub"><span class="'+(!AL()?'on':'')+'" data-hc="all" data-v="0">'+(st.kind=='claude'?'Недавние':'Панель')+'</span><span class="'+(AL()?'on':'')+'" data-hc="all" data-v="1">'+(st.kind=='claude'?'С архивом':'Все сессии')+'</span></div>')+'<div class="hclist">';
 if(!live())h+='<div class="hcempty">Чат работает в live-режиме.<br>Открой панель кнопкой меню «Hermes» рядом с полем ввода.</div>';
 else if(st.lerr)h+='<div class="hcerr">'+E(st.lerr)+'</div>';
 else if(!st.sessions)h+='<div class="hcempty">Загружаю…</div>';
 else if(!st.sessions.length)h+='<div class="hcempty">'+(st.kind=='claude'?'Сессий Claude не найдено.':'Сессий пока нет.<br>Нажми «Новая сессия» и напиши Hermes.')+'</div>';
 else h+=groupsHtml();
 r.innerHTML=h+'</div>'}
function paintChat(){var r=root();if(!r)return;r.className='k-'+st.kind;
 var ta0=document.getElementById('hcin');if(ta0)st.draft=ta0.value;
 r.innerHTML='<div class="hd hchd"><div class="ib" data-hc="back" title="Назад">'+IC('chevron-left')+'</div><div class="hcmid tap" data-hc="menu"><h1>'+E(st.title||'Новая сессия')+'</h1><div class="st"><span class="dot ok"></span><span id="hcsub">'+E(subTxt())+'</span></div></div><div class="r"><div class="ib" data-hc="menu" title="Меню">'+IC('ellipsis')+'</div></div></div>'+
 '<div id="hcmsgs" class="hcmsgs"></div>'+
 (st.rw||deskOK()?'<div class="hccomp"><div id="hcthumbs" class="hcthumbs"></div><textarea id="hcin" rows="1" placeholder="Сообщение '+agentName()+'…"></textarea><div class="hctb2"><label class="hcbtn ghost" for="hcfile">'+IC('paperclip')+'</label><div class=\"hcbtn ghost\" data-hc=\"mic\" title=\"Голосом\">'+IC('mic')+'</div><input id="hcfile" type="file" accept="image/*" multiple hidden><div id="hcchips" class="hcchips"></div><div id="hcsend" class="hcsendb" data-hc="send"></div></div></div>':'<div class="hcro"><div>'+IC('eye')+' Сессия из «'+E(SRC[st.src]||st.src||'другого места')+'» — оригинал здесь только читается. Можно продолжить в копии: вся история сохранится, оригинал не изменится.</div><div class="btn pri" data-hc="fork">'+IC('git-branch')+' Продолжить здесь</div></div>');
 var ta=document.getElementById('hcin');if(ta){ta.value=st.draft;grow(ta)}
 if(st.fwdDraft&&ta){st.draft=st.fwdDraft;st.fwdDraft=null;ta.value=st.draft;grow(ta);setTimeout(function(){toast(IC('forward')+' Текст вставлен: допиши и отправь')},60)}
 st.stick=true;paint()}
function grow(t){t.style.height='auto';t.style.height=Math.min(140,t.scrollHeight)+'px'}
function after(){document.body.classList.toggle('hcm',U.tab=='hc');['claude','codex'].forEach(function(k){document.body.classList.toggle('hk-'+k,U.tab=='hc'&&st.kind==k)});if(U.tab!='hc'){document.body.classList.remove('hckb');return}
 if(!mounted())return;if(st.view=='chat')U.page='hcchat';
 try{if(inTG())st.view=='chat'?tg.BackButton.show():tg.BackButton.hide()}catch(e){}
 st.view=='chat'?paintChat():paintList();if(st.kind!='hermes'&&!st.rw&&st.view=='chat'&&!ccTimer&&!ccFly)ccPoll(false);if(st.kind=='hermes'&&!st.rw&&st.view=='chat'&&st.sid&&st.creating!=st.sid/*s4a-aw*/&&DWS[st.src]&&(!hwOn||hwSid!=st.sid))hWatch(st.sid)/*s3-1a-after*/;if(st.view=='list'&&live()&&!st.sessions&&!st.lerr)loadList()}

/* ---------- данные ---------- */
function loadList(){var k=st.kind;st.lerr='';return J(k=='claude'?'/cc/sessions?limit=60'+(st.call?'&all=1':''):k=='codex'?'/cx/sessions?limit=60':'/sessions?limit=100'+(st.all?'&all=1':'')).then(function(d){if(st.kind!=k)return;st.sessions=d.s;if(k!='hermes')st.sessions.forEach(function(x){x.cc=true});paint()}).catch(function(e){if(st.kind!=k)return;st.lerr=e.message||'Ошибка';paint()}).then(function(){if(k!='hermes'&&st.kind==k&&st.view=='list'){ccStop();ccTimer=setTimeout(function(){ccTimer=0;if(st.kind!='hermes'&&st.view=='list'&&U.tab=='hc'&&mounted())loadList()},8000)}})}
function openSess(id,fresh){if(st.kind!='hermes')return openAgent(id,fresh);var s=(st.sessions||[]).filter(function(x){return x.id==id})[0]||{id:id,t:'',rw:true,src:'api_server'};
 if(st.sid!=id){st.msgs=[];st.pend=[];st.busy=false;st.run=null;st.err='';st.draft='';st.imgs=[];st.lim=120;st.msel=loadSel(id)||(fresh?lastSel():null)/*s4a-os*/;st.rt=null}
 loadModels();
 st.pin=!!s.pin;st.sid=id;st.title=s.t;st.rw=s.rw;st.src=s.src;st.view='chat';U.page='hcchat';LS.set('hcsid',id);st.stick=true;
 render();
 if(fresh)return;st.loadingMsgs=true;
 return J(base()+'/sessions/'+encodeURIComponent(id)+'/messages').then(function(d){if(st.sid!=id||st.busy)return;st.msgs=fromHistory(d.m);st.loadingMsgs=false;st.stick=true;paint()}).catch(function(e){st.loadingMsgs=false;st.err=e.message;paint()})}
function reload(){if(!st.sid)return Promise.resolve();var id=st.sid;return J(base()+'/sessions/'+encodeURIComponent(id)+'/messages').then(function(d){if(st.sid!=id)return;st.msgs=fromHistory(d.m);paint()})}
function leave(){ccStop();st.view='list';U.page=null;st.sessions=null;render();loadList()}
function newChat(kk){if(!live()){toast('Чат — в live-режиме');return}
 if(st.newBusy&&Date.now()-st.newBusy<20000){toast('Чат уже создаётся…');return}
 st.newK=KN[kk]?kk:st.kind;projSheet()}
/* cb2: окно «Проект» ещё на экране? Поздний ответ списка не должен открывать его заново поверх уже созданного чата */
function psOn(){return !!document.querySelector('#sheet.on .hcps')}
/* s3-8d: Claude работает в любой папке проекта (незнакомую панель открывает диплинком + Trust), у Claude нет «Без проекта» —
   вместо него «Новый проект…» (папка по названию). Папки, где Claude уже работал, у Claude идут первыми. */
function projSheet(){var ps=st.projs,kk=st.newK||st.kind,cl=kk=='claude';
 if(!ps){var pc=LS.get('hcprojs',null);if(pc&&pc.length){st.projs=ps=pc;st.projsT=0}}/*vb5a6b: сразу из кэша*/
 if(ps&&Date.now()-(st.projsT||0)>30000){st.projsT=Date.now();J('/projects').then(function(d){var n=d.p||[];LS.set('hcprojs',n);if(JSON.stringify(n)!=JSON.stringify(st.projs)){st.projs=n;if(psOn())projSheet()}}).catch(function(){})}
 if(ps){ps=ps.map(function(p,i){var y={};for(var q in p)y[q]=p[q];y._i=i;return y});if(cl)ps.sort(function(a,b){return (b.cl?1:0)-(a.cl?1:0)||a._i-b._i})}
 var np='<div class="hcmi" data-hc="npnew">'+IC('plus')+'<b>Новый проект…</b><span>'+(cl?'Claude нужна папка — дай проекту название':'создать папку по названию')+'</span></div>';
 if(!ps){sheet('<div class="hcsh hcps"><b>Проект</b></div><div class="hint2">'+(st.perr?E(st.perr):'Загружаю список…')+'</div><div class="hcml">'+np+'</div>'+(cl?'':'<div class="btn" data-hc="newnone">Без проекта</div>')+'<div class="btn" data-hc="close">Отмена</div>');
  J('/projects').then(function(d){st.projs=d.p||[];st.projsT=Date.now();LS.set('hcprojs',st.projs);st.perr='';if(psOn())projSheet();else window.cbDiag&&cbDiag('newchat_late_list',{})}).catch(function(e){st.perr='Не удалось: '+E(e.message);st.projs=null;if(psOn()){if(cl)projSheet();else doNew('','')}});return}
 if(!ps.length&&!cl){doNew('','');return}
 var last=LS.get('hcproj_'+kk,LS.get('hcproj',''));if(cl&&!ps.some(function(p){return p.path==last}))last=ps.length?ps[0].path:'';/*s3-8h-last: у Claude отмечен последний его проект или первая папка, где он работал*/
 var h='<div class="hcsh hcps"><b>Проект для нового чата</b></div><div class="hcml">'+/*s3-8h-order: у Hermes/Codex сначала «Без проекта»*/
  (cl?np:'<div class="hcmi'+(last?'':' on')+'" data-hc="newnone">'+(last?'<i></i>':IC('check'))+'<b>Без проекта</b><span>папка по умолчанию</span></div>'+np)+
  ps.map(function(p){var on=last==p.path;return '<div class="hcmi'+(on?' on':'')+'" data-hc="newproj" data-i="'+p._i+'">'+(on?IC('check'):'<i></i>')+'<b>'+E(p.name)+'</b><span>'+E(p.path)+'</span></div>'}).join('')+
  '</div><div class="btn" data-hc="close">Отмена</div>';
 sheet(h)}
/* s3-8e: «Новый проект» — название = имя папки на ПК; чат открывается в ней */
function npSheet(){var kk=st.newK||st.kind;
 sheet('<div class="hcsh hcnps"><b>Новый проект</b></div><div class="hint2">Папка с этим названием появится на ПК, '+E(KN[kk]||kk)+' начнёт чат в ней.</div>'+
  '<input id="hcnp" class="hcnpin" type="text" maxlength="60" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Название проекта" enterkeyhint="go">'+
  '<div class="btn pri" data-hc="npgo">Создать и открыть чат</div><div class="btn" data-hc="close">Отмена</div>');
 var i=document.getElementById('hcnp');if(i&&!matchMedia('(pointer:coarse)').matches)i.focus()}
function npGo(){var i=document.getElementById('hcnp'),n=(i&&i.value||'').trim();if(!n){toast('Напиши название проекта');i&&i.focus();return}if(/[\\\/:*?"<>|]/.test(n)){toast('В названии нельзя \\ / : * ? " < > |');return}doNew('',n,n)}
document.addEventListener('keydown',function(e){if(e.key=='Enter'&&e.target&&e.target.id=='hcnp'){e.preventDefault();npGo()}},true);/*s3-8 enter*/
/* s2-2: ошибка создания — остаёмся в текущем чате (раньше: старый экран списка, откуда не выйти); пересылка — снова лист «Переслать в…» */
function newFail(k,e){toast(E(e&&e.message||'Чат не создан'));haptic('error');var f=st.fwdPend;st.fwdPend=null;st.newK=null;if(f){st.fwdSrc=f;fwdSheet(k)}}
/* s4a-new: «Новый чат» сразу открывает пустой новый чат с «Создаю чат…» (как у родных), а не держит старый чат на экране 1–9 с
   (Codex создаёт тред ~8 с). Написанное за это время уходит в новый чат сразу после создания; ошибка — назад в прежний чат, текст в поле. */
function s4ph(k,ph){ccStop();if(st.kind!=k){st.kind=k;LS.set('hckind',k);st.models=null;st.mprov='';st.sessions=null}
 st.sid=ph;st.creating=ph;st.msgs=[];st.pend=[];st.busy=false;st.run=null;st.err='';st.draft='';st.imgs=[];st.lim=120;st.msel=lastSel(k);st.ccoff=null;st.rt=null;st.cur=null;
 st.pin=false;st.title='Новый чат';st.rw=false;st.src=k=='hermes'?'gui':'';st.cclive=false;st.view='chat';U.page='hcchat';st.stick=true;st.loadingMsgs=true;loadModels();render()}
function doNew(cwd,pname,newp){/*s3-8f*/unsheet();if(st.newBusy&&Date.now()-st.newBusy<20000){window.cbDiag&&cbDiag('newchat_dup',{});return}st.newBusy=Date.now();var t0n=Date.now();var k=st.newK||st.kind;st.newK=null;LS.set('hcproj',cwd||'');LS.set('hcproj_'+k,cwd||'');
 var prev={kind:st.kind,sid:st.sid,view:st.view,ss:st.sessions,title:st.title,rw:st.rw,src:st.src},ph='s4new-'+t0n;s4ph(k,ph);var from=st.kind+':'+st.sid+':'+st.view;
 function remap(id){(st.lp||[]).forEach(function(q){if(q.sid==ph){q.sid=id;q.nu=0}});if(st.dsq)delete st.dsq[ph];var q=st.qd&&st.qd.o==ph?st.qd:null;st.qd=null;return q}
 J('/new',{method:'POST',body:newp?{agent:k,newproj:newp}:{agent:k,cwd:cwd||'',pname:pname||''}}).then(function(d){st.newBusy=0;if(st.creating==ph)st.creating=0;if(d&&d.proj&&d.proj.path){cwd=d.proj.path;pname=d.proj.name;LS.set('hcproj',cwd);LS.set('hcproj_'+k,cwd);st.projs=null}/*s3-8f-body*/var moved=(st.kind+':'+st.sid+':'+st.view)!=from;window.cbDiag&&cbDiag('newchat',{ag:k,ms:Date.now()-t0n,ok:1,late:moved?1:0});
  var id=d.s.id,q=remap(id),ms=st.sid==ph?st.msel:null;if(ms)saveSel(id,ms,1);
  if(moved){st.fwdPend=null;if(q)deskPost(id,q.k,q.t,q.imgs,q.b,q.T0);toast('Чат создан — он в списке '+(KN[k]||k));return}
  if(st.fwdPend){st.fwdDraft=st.fwdPend.q;st.fwdPend=null}
  if(k=='hermes'&&!st.all){st.all=true;LS.set('hcall',true)}
  var dr=st.draft,im=st.imgs,ta=document.getElementById('hcin'),tv=ta?ta.value:'';
  st.msgs=[];st.sessions=[d.s];if(k=='hermes'){openSess(id,true)}else openAgent(id,true);st.title=d.s.t||'Новый чат';st.rw=false;st.src=d.s.src;if(ms)st.msel=ms;st.loadingMsgs=false;
  if(dr||tv||im.length){st.draft=dr||tv;st.imgs=im;var t2=document.getElementById('hcin');if(t2){t2.value=st.draft;grow(t2)}}
  st.msgs=withLocal([]);paint();if(cwd)toast('Проект: '+E(pname));if(q)deskPost(id,q.k,q.t,q.imgs,q.b,q.T0);
  /* s2-3: на телефоне не открываем клавиатуру сами — iOS показывала её и через ~1,5 с убирала (видео 1:45); как в ChatGPT — подсказки, клавиатура по тапу */
  setTimeout(function(){var t=document.getElementById('hcin');if(t&&!(window.matchMedia&&matchMedia('(pointer:coarse)').matches))t.focus()},120)}).catch(function(e){st.newBusy=0;window.cbDiag&&cbDiag('newchat',{ag:k,ms:Date.now()-t0n,ok:0,err:String(e&&e.message).slice(0,50)});
  var here=st.sid==ph,q=remap('');st.lp=(st.lp||[]).filter(function(x){return x.sid!=''});if(st.creating==ph)st.creating=0;
  if(here){var dr=q?q.t:(st.draft||''),im=q?q.imgs:st.imgs;st.loadingMsgs=false;
   if(prev.sid&&prev.view=='chat'){if(st.kind!=prev.kind){st.kind=prev.kind;LS.set('hckind',prev.kind);st.models=null;st.mprov=''}st.sessions=prev.ss;st.sid=null;if(prev.kind=='hermes')openSess(prev.sid);else openAgent(prev.sid);st.title=prev.title;st.rw=prev.rw;st.src=prev.src}
   else{st.sid=null;st.msgs=[];paint()}
   if(dr||(im&&im.length)){st.draft=dr;st.imgs=im||[];var t3=document.getElementById('hcin');if(t3){t3.value=dr;grow(t3)}paint()}}
  newFail(k,e)})}

/* ---------- ход со стримом ---------- */
function ctl(d,n){var id=d.request_id||d.prompt_id||d.id;if(!id)return null;
 var kind=/clarify/.test(n||'')||d.kind=='clarify'||d.type=='clarify'||d.question?'clarify':'approval';
 var cmd=d.command||d.preview||(d.args&&argPreview(d.args))||'';
 return {id:String(id),gen:d.execution_generation,kind:kind,opts:d.options||null,tool:d.tool_name||'',text:kind=='clarify'?(d.question||d.prompt||d.text||d.message||''):cmd,desc:kind=='approval'?(d.description||d.reason||d.message||(d.tool_name||d.tool||'')):''}}
function addPend(p){if(!p)return;if(!st.pend.some(function(x){return x.id==p.id}))st.pend.push(p)}
function lastA(){return st.cur}
function onEv(n,d){var a=lastA();if(!a)return;
 if(d&&d.run_id&&!st.run){st.run=d.run_id}
 switch(n){
 case 'assistant.delta':{var l=a.parts[a.parts.length-1];if(l&&l.p=='t')l.t+=d.delta||'';else a.parts.push({p:'t',t:d.delta||''});break}
 case 'assistant.commentary':if(d.text&&!d.already_streamed){var l2=a.parts[a.parts.length-1];if(l2&&l2.p=='t')l2.t+=(l2.t?'\n\n':'')+d.text;else a.parts.push({p:'t',t:d.text})}break;
 case 'tool.started':a.parts.push({p:'tool',id:'',n:d.tool_name||d.tool||'tool',a:d.args||d.preview||'',st:'run',res:''});break;
 case 'tool.completed':case 'tool.failed':{var t=null;for(var i=a.parts.length-1;i>=0;i--){if(a.parts[i].p=='tool'&&a.parts[i].st=='run'&&a.parts[i].n==(d.tool_name||d.tool||a.parts[i].n)){t=a.parts[i];break}}
  if(!t){t={p:'tool',id:'',n:d.tool_name||'tool',a:'',st:'run',res:''};a.parts.push(t)}
  t.st=(n=='tool.failed'||d.error)?'err':'ok';if(d.preview)t.res=d.preview;break}
 case 'run.started':{if(d.perm)st.perm=d.perm;var rq=d.runtime&&d.runtime.requested;st.rt=d.runtime||null;if(st.msel&&st.msel.m&&rq&&rq.model&&rq.model!=st.msel.m)st.err='Hermes применил не ту модель: '+rq.model;break}
 case 'run.failed':st.err=(d.error&&(d.error.message||d.error))||d.message||'Ход завершился ошибкой';break;
 case 'run.cancelled':st.err='Остановлено';break;
 case 'approval.resolved':st.pend=st.pend.filter(function(x){return x.id!=String(d.request_id)});break;
 default:if(/approval|clarify/.test(n)&&/request|required|pending/.test(n))addPend(ctl(d,n))}
 schedule()}
function sse(resp,cb){if(!resp.body||!resp.body.getReader)return resp.text().then(function(t){var ev='';t.split('\n').forEach(function(l){l=l.replace(/\r$/,'');if(l.indexOf('event:')==0)ev=l.slice(6).trim();else if(l.indexOf('data:')==0){try{cb(ev,JSON.parse(l.slice(5)))}catch(e){}}})});
 var rd=resp.body.getReader(),dec=new TextDecoder(),buf='',ev='';
 function pump(){return rd.read().then(function(r){if(r.done)return;buf+=dec.decode(r.value,{stream:true});var lines=buf.split('\n');buf=lines.pop();
  lines.forEach(function(l){l=l.replace(/\r$/,'');if(l.indexOf('event:')==0)ev=l.slice(6).trim();else if(l.indexOf('data:')==0){var d;try{d=JSON.parse(l.slice(5))}catch(e){return}cb(ev,d)}else if(l==='')ev=''});return pump()})}
 return pump()}
function chatBody(t,imgs){var b={input:t,images:imgs},m=st.msel;if(m){if(m.m){b.model=m.m;b.provider=m.p}if(m.e)b.effort=m.e}return b}
function send(){if(!st.rw&&deskOK()){if(deskRun()&&!(st.draft||'').trim()&&!st.imgs.length){deskStop();return}ccSend();return}if(st.busy){stop();return}
 var t=(st.draft||'').trim();if(!t&&!st.imgs.length)return;if(!st.sid||!st.rw||!live())return;
 var imgs=st.imgs.slice(),sid=st.sid;st.msgs.push({k:'u',t:t,im:imgs.length,ts:Date.now()/1000});var a={k:'a',parts:[],live:true,ts:Date.now()/1000};st.msgs.push(a);st.cur=a;
 st.busy=true;st.run=null;st.err='';st.draft='';st.imgs=[];st.stick=true;var ta=document.getElementById('hcin');if(ta){ta.value='';grow(ta)}paint();
 var done=false,term=false;st.ac=window.AbortController?new AbortController():null;
 function fin(){if(done)return;done=true;a.live=false;st.busy=false;st.cur=null;st.ac=null;paint()}
 hq(base()+'/sessions/'+encodeURIComponent(sid)+'/chat',{method:'POST',body:chatBody(t,imgs),signal:st.ac?st.ac.signal:undefined}).then(function(r){
   if(!r.ok)return r.json().catch(function(){return{}}).then(function(j){throw new Error(j.text||(r.status==401?'Подпись устарела: закрой и снова открой панель из меню бота.':j.error||('HTTP '+r.status)))});
   return sse(r,function(n,d){if(n=='run.completed'||n=='run.failed'||n=='run.cancelled'||n=='done')term=true;onEv(n,d)})
 }).then(function(){if(term||!st.run){fin();if(!term&&!st.err&&!a.parts.length)st.err='Пустой ответ';paint();return}watchRun(st.run,a,fin)}).catch(function(e){
   if(e&&e.name=='AbortError'){fin();return}
   if(st.run){watchRun(st.run,a,fin)}else{st.err=e.message||'Нет связи';fin()}})}
function watchRun(rid,a,fin){var t0=Date.now(),n=0;st.watch=1;st.err=st.err||'';
 (function tick(){if(st.run!=rid){return}J(base()+'/runs/'+rid).then(function(d){
   st.pend=(d.pending_controls||[]).map(function(c){return ctl(c,c.kind||c.type||'')}).filter(Boolean);
   var s=d.status;if(s=='running'||s=='waiting_for_approval'||s=='stopping'||s=='started'||s=='queued'){schedule();if(Date.now()-t0<3600e3)return setTimeout(tick,2500);}
   st.pend=[];st.watch=0;return reload().then(function(){fin();st.run=null})
  }).catch(function(e){if(e.status==404||++n>5){st.watch=0;reload().then(function(){fin();st.run=null},function(){fin();st.run=null})}else setTimeout(tick,3000)})})()}
function resumeRun(rid){if(st.busy)return;var a={k:'a',parts:[],live:true,ts:Date.now()/1000},done=false;st.msgs.push(a);st.cur=a;st.busy=true;st.run=rid;st.err='';
 function fin(){if(done)return;done=true;a.live=false;st.busy=false;st.cur=null;paint()}
 paint();watchRun(rid,a,fin)}
function stop(){if(!st.run){if(st.ac)st.ac.abort();return}J(base()+'/runs/'+st.run+'/stop',{method:'POST',body:{}}).then(function(){toast('Останавливаю…')}).catch(function(e){toast(E(e.message))})}
function respond(i,choice,answer){var p=st.pend[i];if(!p||!st.run)return;
 var path=base()+'/runs/'+st.run+(p.kind=='clarify'?'/clarify':'/approval'),body={request_id:p.id};if(p.gen!=null)body.execution_generation=p.gen;if(p.kind=='clarify')body.answer=answer||'';else body.choice=choice;
 J(path,{method:'POST',body:body}).then(function(){st.pend.splice(i,1);paint();haptic('success')}).catch(function(e){if(e.status==409){st.pend.splice(i,1);paint();toast('Запрос уже неактуален')}else toast(E(e.message))})}

/* ---------- Claude / Codex: транскрипты с ПК; Claude из панели — через встроенный `claude -p` ---------- */
var KN={hermes:'Hermes',claude:'Claude',codex:'Codex'},ccTimer=0,ccFly=false,ccTok=0,hwTok=0,hwOn=false,hwAc=null,hwSid='';/*s3-1a*/
function kindBar(){return '<div class="hcfil hckind">'+['hermes','claude','codex'].map(function(k){return '<span class="'+(st.kind==k?'on':'')+'" data-hc="kind" data-v="'+k+'">'+KN[k]+'</span>'}).join('')+'</div>'}
function setKind(k){if(st.kind==k||!KN[k])return;ccStop();st.kind=k;LS.set('hckind',k);st.sessions=null;st.lerr='';st.sid=null;st.msgs=[];st.models=null;st.msel=null;st.mprov='';st.view='list';U.page=null;render();loadList()}
function ccStop(){if(ccTimer){clearTimeout(ccTimer);ccTimer=0}ccTok++;ccFly=false}
var DWS={local:1,gui:1,cli:1,desktop:1},DESK={claude:'Claude Desktop',codex:'Codex Desktop',hermes:'Hermes на ПК'};
function deskOK(){return st.kind=='claude'||st.kind=='codex'||(st.kind=='hermes'&&!!DWS[st.src])}
function ccComp(){return '<div class="hccomp"><textarea id="hcin" rows="1" placeholder="Сообщение в этот чат (уйдёт в '+DESK[st.kind]+')…"></textarea><div class="hctb2"><div class="hcbtn ghost" data-hc="mic" title="Голосом">'+IC('mic')+'</div><div class="hcchips"></div><div id="hcsend" class="hcsendb" data-hc="ccsend"></div></div></div>'}
function openAgent(id,fresh){var s=(st.sessions||[]).filter(function(x){return x.id==id})[0]||{id:id,t:agentName(),src:st.kind,ts:0,rw:!!fresh};
 ccStop();if(st.sid!=id){st.msgs=[];st.pend=[];st.busy=false;st.run=null;st.err='';st.draft='';st.imgs=[];st.lim=120;st.msel=loadSel(id)||(fresh||s.new?lastSel():null)/*s4a-oa*/;st.ccoff=null;st.rt=null}
 st.pin=false;st.sid=id;st.title=s.t;st.rw=!!s.rw;st.src=s.src;st.cclive=!!s.live;st.view='chat';U.page='hcchat';st.stick=true;
 loadModels();
 render();if(fresh)return;st.loadingMsgs=true;
 if(st.rw)return J(base()+'/sessions/'+encodeURIComponent(id)+'/messages').then(function(d){if(st.sid!=id||st.busy)return;st.msgs=fromHistory(d.m);st.loadingMsgs=false;st.stick=true;st.perm=d.perm||'';if(d.run)resumeRun(d.run);else paint()}).catch(function(e){st.loadingMsgs=false;st.err=e.message;paint()});
 ccPoll(true)}
function ccPoll(first){ccStop();var id=st.sid;if(st.creating&&st.creating==id)return;/*s4a-poll: чат ещё создаётся*/if(st.kind=='hermes'||st.rw||st.view!='chat'||!id)return;var k=st.kind,tok=ccTok,t0=Date.now(),lp=!(first||st.ccoff==null);ccFly=true;
 J(base()+'/sessions/'+encodeURIComponent(id)+'/messages'+(lp?'?from='+st.ccoff+'&sz='+(st.ccsz||st.ccoff)+'&wait=20':'')).then(function(d){if(tok!=ccTok||st.sid!=id||st.kind!=k)return;
  if(!lp)st.msgs=fromHistory(d.m);else if(d.m.length)st.msgs=fromHistory(d.m,st.msgs);
  st.ccoff=d.off;st.ccsz=d.size;st.cclive=!!d.live;st.loadingMsgs=false;st.err='';if(first)st.stick=true;paint();return d.m.length
 }).catch(function(e){if(tok!=ccTok)return;st.loadingMsgs=false;st.err=e.message||'Нет связи';paint();return -1}).then(function(g){if(tok!=ccTok)return;ccFly=false;
  if(st.sid==id&&st.kind==k&&!st.rw&&st.view=='chat'&&!ccTimer)ccTimer=setTimeout(function(){ccTimer=0;if(U.tab=='hc'&&mounted())ccPoll(false)},g>0?40:(g===-1||Date.now()-t0<1500?2500:40))})}
function deskStop(){var o=st.sid;if(!o||!live())return;if(st.dsq&&st.dsq[o]){st.dstop=o;toast('Остановлю, как только сообщение дойдёт до ПК');return}/*s4a-stop: Стоп, пока сообщение ещё уходит*/deskStopId(o,st.kind)}
function deskStopId(o,k){toast('Останавливаю…');
 J(KB(k)+'/sessions/'+encodeURIComponent(o)+'/deskstop',{method:'POST',body:{}}).then(function(){haptic('success');if(st.sid==o&&st.kind!='hermes')ccPoll(false)}).catch(function(e){toast(E(e.message));haptic('error')})}
/* s4a-send: замок отправки — на ЧАТ (st.dsq[sid]), а не на всю панель (видео 451: голос во втором чате не уходил, пока висел первый);
   пока сообщение уходит на ПК — «думает»/Стоп сразу после ↑ (Claude первый ход 15–30 с, Codex ~4 с); второй ↑ в тот же чат — тост, текст в поле;
   сбой — пузырь «Не отправлено · Повторить» в ЭТОМ чате (и после переоткрытия), без тоста поверх чужого экрана; текст в поле не возвращаем. */
function KB(k){return k=='claude'?'/cc':k=='codex'?'/cx':''}
function ccSend(){var t=(st.draft||'').trim();if((!t&&!st.imgs.length)||!live())return;st.dsq=st.dsq||{};
 if(st.sid&&st.dsq[st.sid]){toast(st.creating==st.sid?'Чат ещё создаётся — сообщение уйдёт сразу после него':'Дождись: предыдущее сообщение ещё уходит на ПК');haptic('error');return}
 if(!st.rw&&st.sid&&deskOK()){var o=st.sid,k=st.kind,imgs=st.imgs.slice(),m=st.msel||{},b={t:t};if(imgs.length)b.images=imgs;if(k!='codex'||cxFresh()){if(m.m){b.model=m.m;b.provider=m.p}if(m.e)b.effort=m.e}/*vb5m*/
  st.draft='';st.imgs=[];var ta0=document.getElementById('hcin');if(ta0){ta0.value='';grow(ta0)}
  var T0=Date.now(),nu0=st.msgs.filter(function(b){return b.k=='u'&&!b.lp}).length;st.lp=(st.lp||[]).concat([{sid:o,k:k,t:t||'',im:imgs.length,ts:T0/1000,t0:T0,nu:nu0}]);
  st.msgs=withLocal(st.msgs.filter(function(b){return !b.lp}));st.stick=true;
  if(st.creating==o){st.qd={o:o,k:k,t:t,imgs:imgs,b:b,T0:T0};st.dsq[o]=1;paint();return}/*s4a-q: чат ещё создаётся — уйдёт сразу после создания*/
  deskPost(o,k,t,imgs,b,T0);return}
 ccSay()}
function deskPost(o,k,t,imgs,b,T0){st.dsq=st.dsq||{};st.dsq[o]=1;paint();
 J(KB(k)+'/sessions/'+encodeURIComponent(o)+'/desk',{method:'POST',body:b}).then(function(d){delete st.dsq[o];dlvSet(T0,d);
   var ns=d&&d.sid&&d.sid!=o?d.sid:'';if(ns){var ms=loadSel(o);if(ms)saveSel(ns,ms,1)}/*s4a-model: выбор модели переезжает в настоящий чат*/
   if(st.dstop==o){st.dstop=0;deskStopId(ns||o,k)}
   if(st.sid!=o){paint();return}st.stick=true;st.msgs=withLocal(st.msgs.filter(function(b){return !b.lp}));/*s5-dlv: «В очереди» подписью под сообщением, не тостом*/haptic('success');paint();if(ns&&st.kind==k){(st.lp||[]).forEach(function(q){if(q.sid==o){q.sid=ns;q.nu=0}});st.sid=ns;st.ccoff=null;st.ccsz=0;st.msgs=withLocal([]);st.sessions=null;paint()}
   /* s2-1: живой канал (watch) на iPhone молчал — ответ появлялся только после повторного открытия чата. Если за 3,5 с от него нет событий хода, опрашиваем историю. */
   if(k=='hermes'){if(DWS[st.src]&&(!hwOn||hwSid!=o))hWatch(o);/*s3-1a-send*/hPoll(o,0);/*s3-1d: опрос сразу, он сам уступает живому каналу*/setTimeout(function(){if(st.sid==o&&hwOn&&hwSid==o&&!(st.hwSeen>T0))window.cbDiag&&cbDiag('watch_silent',{})},3500)}else ccPoll(false)})
   .catch(function(e){delete st.dsq[o];if(st.dstop==o)st.dstop=0;var raw=String(e&&e.message||''),msg=humanErr(raw,k);st.lp=(st.lp||[]).filter(function(p){return p.t0!=T0});
    failAdd({sid:o,k:k,t:t||'',im:imgs.length,ts:T0/1000,t0:T0,err:msg},imgs);window.cbDiag&&cbDiag('desk_fail',{ag:k,ms:Date.now()-T0,err:raw.slice(0,60),here:st.sid==o?1:0});
    if(st.sid==o){st.msgs=withLocal(st.msgs.filter(function(b){return !b.lp}));st.stick=true;haptic('error')}paint()})}
/* s4a-err: сырые ответы ПК (исключения PowerShell и т. п.) — человеческим текстом */
function humanErr(m,k){m=String(m||'').trim();var who=DESK[k]||'ПК';
 if(/Failed to fetch|Load failed|NetworkError|Нет связи/i.test(m))return 'нет связи с ПК';
 if(/Exception|Invoke|failed:|Traceback|\bat line\b/i.test(m)){var c=m.split('(')[0].trim().replace(/[.:,\s]+$/,'');return (c.length>8?c:who+' не принял сообщение')+'.'}
 return m.length>220?m.slice(0,200)+'…':(m||who+' не принял сообщение.')}
/* s4a-fail: неотправленные сообщения хранятся по чатам (LS hcfail4, без фото; фото — до перезагрузки), видны в ленте своего чата */
var FLIMG={};
function failLoad(){if(!st.fl){var a=LS.get('hcfail4',[]);st.fl=Array.isArray(a)?a.filter(function(f){return f&&f.sid&&Date.now()/1000-f.ts<7*864e2}):[]}return st.fl}
function failSave(){try{LS.set('hcfail4',(st.fl||[]).slice(-30))}catch(e){}}
function failAdd(f,imgs){failLoad();st.fl=st.fl.filter(function(x){return x.t0!=f.t0});st.fl.push(f);if(imgs&&imgs.length)FLIMG[f.t0]=imgs;failSave()}
function failDel(t0){failLoad();st.fl=st.fl.filter(function(x){return String(x.t0)!=String(t0)});failSave()}
/* s5-dlv (этап 5, п.2): статус отправленного в чат ПК — по тем же признакам, что бот (tv_dlv.py: мод Claude, task_started Codex,
   user-строка Hermes). 202 → подпись под сообщением «В очереди» / «Отправлено · ждём подтверждения» вместо тоста; опрос /dlv раз в 5 с →
   «Доставлено» или «Не подтверждено · Повторить / Изменить» (сами не повторяем). Ждущие переживают закрытие панели (LS hclp5, до 3 ч). */
function dlvLife(p){return p.st=='queued'?3*3600+120:p.st=='wait'?720:p.st=='ok'?600:180}
function dlvSet(T0,d){(st.lp||[]).forEach(function(p){if(p.t0==T0)p.st=d&&(d.queued||d.now)?(/не подтвердил/i.test(d.text||'')?'wait':'queued'):'sent'});dlvSave()}
function dlvSave(){try{var a=(st.lp||[]).filter(function(p){return p.st=='queued'||p.st=='wait'||p.st=='ok'}).map(function(p){return {sid:p.sid,k:p.k,t:p.t,im:p.im,ts:p.ts,t0:p.t0,st:p.st}}),j=JSON.stringify(a);if(j!=st.dlj){st.dlj=j;LS.set('hclp5',a)}}catch(e){}}
function dlvLoad(){try{var a=LS.get('hclp5',[]),now=Date.now()/1000;if(!Array.isArray(a))return;st.lp=(st.lp||[]).concat(a.filter(function(p){return p&&p.sid&&p.t0&&now-p.ts<dlvLife(p)&&!(st.lp||[]).some(function(q){return q.t0==p.t0})}).map(function(p){p.nu=1e9;return p}))}catch(e){}}
var DLV={busy:0};
function dlvTick(){if(DLV.busy||document.hidden||!API)return;/*s5-dlvfix: связи нет — не спрашиваем (hq бросал бы, busy залипал навсегда)*/var now=Date.now(),L=(st.lp||[]).filter(function(p){return (p.st=='queued'||p.st=='wait')&&now-p.t0>4000});if(!L.length)return;DLV.busy=1;
 var PR;try{PR=L.map(function(p){return J('/dlv?k='+p.k+'&sid='+encodeURIComponent(p.sid)+'&t='+(p.t0/1000)+'&now='+(Date.now()/1000)).then(function(r){return [p,r]}).catch(function(){return [p,null]})})}catch(e){DLV.busy=0;return}Promise.all(PR).then(function(R){DLV.busy=0;var ch=0;
  R.forEach(function(x){var p=x[0],r=x[1];if(!r||!r.st)return;
   if(r.st=='ok'&&p.st!='ok'){p.st='ok';ch=1}
   else if(r.st=='queued'&&p.st=='wait'){p.st='queued';ch=1}
   else if(r.st=='bad'){st.lp=st.lp.filter(function(q){return q!==p});failAdd({sid:p.sid,k:p.k,t:p.t||'',im:p.im,ts:p.ts,t0:p.t0,unc:1,err:r.why=='timeout'?'агент не начал этот ход за '+Math.max(1,Math.round((r.age||0)/60))+' мин':'агент не взял сообщение'});ch=1}});
  if(ch){dlvSave();if(st.view=='chat'){st.msgs=withLocal(st.msgs.filter(function(b){return !b.lp}));paint()}}}).catch(function(){DLV.busy=0})}
dlvLoad();setInterval(dlvTick,5000);
function dlHtml(b){var t=b.dl=='queued'?'В очереди · уйдёт после текущего ответа':b.dl=='wait'?'Отправлено · ждём подтверждения':b.dl=='ok'?'Доставлено':'';return t?'<div class="s5dl'+(b.dl=='ok'?' ok':'')+'">'+t+'</div>':''}
function failHtml(b){return '<div class="s4fl"><div class="s4flt">'+IC('info')+'<span>'+(b.unc?'Не подтверждено':'Не отправлено')+(b.fail?': '+E(b.fail):'')+'</span></div><div class="s4fla"><i data-s4f="retry" data-t0="'+E(b.ft)+'" role="button">Повторить</i><i data-s4f="edit" data-t0="'+E(b.ft)+'" role="button">Изменить</i></div></div>'}
function phantom(k,x){return !!(x&&x.new&&!(st.sid==x.id&&st.kind==k)&&!failLoad().some(function(f){return f.sid==x.id})&&!(st.dsq&&st.dsq[x.id]))}/*s4a-ph: пустой «Новый чат», не созданный на ПК, в списках не показываем (как у родных)*/
function s4retry(t0,edit){var f=failLoad().filter(function(x){return String(x.t0)==String(t0)})[0];if(!f)return;var ta=document.getElementById('hcin');
 if(edit){failDel(t0);var v=(ta&&ta.value||'').trim();st.draft=v?v+' '+f.t:f.t;if(FLIMG[t0])st.imgs=(st.imgs||[]).concat(FLIMG[t0]);if(ta){ta.value=st.draft;grow(ta);ta.dispatchEvent(new Event('input',{bubbles:true}))}st.msgs=withLocal(st.msgs.filter(function(b){return !b.lp}));paint();return}
 if(st.dsq&&st.dsq[st.sid]){toast('Дождись: предыдущее сообщение ещё уходит на ПК');return}
 failDel(t0);var d0=st.draft,i0=st.imgs,v0=ta?ta.value:'';st.draft=f.t;st.imgs=FLIMG[t0]||[];delete FLIMG[t0];ccSend();st.draft=d0||'';st.imgs=i0||[];if(ta){ta.value=v0||'';grow(ta)}paint()}
document.addEventListener('click',function(ev){var el=ev.target.closest&&ev.target.closest('[data-s4f]');if(!el)return;ev.preventDefault();ev.stopPropagation();s4retry(el.dataset.t0,el.dataset.s4f=='edit')},true);
(function(){var s=document.createElement('style');s.textContent='.s4fl{margin:6px 0 2px auto;max-width:86%;text-align:right;font-size:13px;line-height:1.35;color:#d4483b}.s4flt{display:inline-flex;gap:5px;align-items:flex-start;justify-content:flex-end}.s4flt svg{width:15px;height:15px;flex:none;margin-top:1px}.s4fla{display:flex;gap:16px;justify-content:flex-end;margin-top:4px}.s4fla i{font-style:normal;font-weight:600;cursor:pointer;color:inherit;padding:4px 0}';document.head.appendChild(s)})();
function hLive(){var a=st.cur;if(!a||!a.live){a={k:'a',parts:[],live:true,ts:Date.now()/1000};st.cur=a;st.msgs.push(a)}return a}
function hWatch(id){hwOn=true;hwSid=id;/*s3-1a-hw*/var tok=++hwTok;if(hwAc){try{hwAc.abort()}catch(e){}}hwAc=window.AbortController?new AbortController():null;
 function again(){if(tok!=hwTok)return;/*s3-1b*/hwOn=false;if(tok==hwTok&&st.sid==id&&st.kind=='hermes'&&!st.rw&&st.view=='chat'&&U.tab=='hc'&&mounted())setTimeout(function(){if(tok==hwTok&&!hwOn)hWatch(id)},400)}
 function ok(){return tok==hwTok&&st.sid==id}
 function fin(a){if(a){a.live=false}st.cur=null;setTimeout(function(){if(!ok())return;reload()},350)}
 hq(base()+'/sessions/'+encodeURIComponent(id)+'/watch',{signal:hwAc?hwAc.signal:undefined}).then(function(r){if(!r.ok)throw new Error('watch '+r.status);
  return sse(r,function(n,d){if(!ok())return;if(n!='ping'&&n!='watch.ready')st.hwSeen=Date.now();
   if(n=='watch.ready'){if(d.running){hLive();st.stick=true;paint()}}
   else if(n=='turn.start'){hLive();st.stick=true;reload().then(function(){if(ok()&&st.cur&&st.msgs.indexOf(st.cur)<0){st.msgs.push(st.cur);paint()}})}
   else if(n=='assistant.delta'||n=='tool.started'||n=='tool.completed'){var a=hLive();onEv(n,d);st.stick=true}
   else if(n=='turn.complete'){fin(st.cur);paint()}
  })}).then(again,again)}
/* s3-1c: запасной опрос истории, пока живой канал молчит. Раньше он останавливался на первом сообщении ассистента — а у Hermes это
   вызов инструмента без текста, финальный ответ приходил через 10–20 с и до повторного открытия чата не показывался. Теперь ждём
   настоящий конец хода: наше сообщение уже в истории и последний пузырь — ассистент с текстом (или 2 мин без изменений). */
function hDone(id){var l=st.msgs[st.msgs.length-1],pp=l&&l.parts||[],q=pp[pp.length-1];return !!(l&&l.k=='a'&&q&&q.p=='t'&&(q.t||'').trim()&&!(st.lp||[]).some(function(p){return p.sid==id}))}
function hPoll(id,n,sg,same){if(st.sid!=id||st.kind!='hermes'||st.view!='chat'||n>240){if(st.hpoll==id){st.hpoll=false;paint()}return}if(st.hpoll!=id){st.hpoll=id;paint()}
 setTimeout(function(){if(st.sid!=id){return}if(st.cur&&st.cur.live&&Date.now()-(st.hwSeen||0)<6000){st.hpoll=false;return hPoll(id,n+1)}
  reload().then(function(){if(st.sid!=id)return;var l=st.msgs[st.msgs.length-1],g=st.msgs.length+':'+(l&&l.parts?l.parts.length+':'+JSON.stringify(l.parts[l.parts.length-1]||'').length:'');
   same=g==sg?(same||0)+1:0;if(hDone(id)||same>=40){st.hpoll=false;paint();return}paint();hPoll(id,n+1,g,same)}).catch(function(){hPoll(id,n+1,sg,same)})},3000)}
function ccSay(){var t=(st.draft||'').trim();if(!t||!live())return;
 J('/cc/say',{method:'POST',body:{t:t}}).then(function(d){st.draft='';var ta=document.getElementById('hcin');if(ta){ta.value='';grow(ta)}toast(d.text||'В очереди');haptic('success')}).catch(function(e){toast(E(e.message))})}

/* ---------- меню сессии ---------- */
function menu(sk){if(!st.sid)return;sk=','+(sk||'')+',';/*s4c-8: sk — пункты, которые уже есть в меню ⋯ шапки*/var h='<div class="hcsh"><b>'+E(st.title||'Новый чат')+'</b></div>'+(st.kind=='hermes'&&sk.indexOf(',pin,')<0?'<div class="btn" data-hc="pinmenu">'+IC('pin')+' '+(st.pin?'Открепить':'Закрепить')+'</div>':'');
 if(st.rw&&st.kind!='hermes'){var PM={pc:'Как на ПК',ask:'Спрашивать всё',full:'Сам, кроме опасных'},PD={pc:'те же права, что у '+E(agentName())+' на этом ПК'+(st.kind=='claude'?' (режим Auto: безопасное — само, рискованное — спросит)':' (Codex на ПК работает без вопросов)'),ask:'карточка Разрешить/Отклонить перед каждой командой и правкой',full:'безопасное разрешаю сам, опасное (rm -rf, push --force, .env, sudo… — стоп-список) — карточка тебе; каждое авто-разрешение в Журнале'},cur=PM[st.perm]?st.perm:'pc';
  h+='<div class="hint2">Разрешения: <b>'+PM[cur]+'</b> — '+PD[cur]+'.</div>'+['pc','ask','full'].filter(function(k){return k!=cur}).map(function(k){return '<div class="btn" data-hc="perm" data-v="'+k+'">'+IC('shield-check')+' '+PM[k]+'</div>'}).join('')}
 if(st.rw&&st.kind!='hermes'&&sk.indexOf(',openpc,')<0)h+='<div class="btn" data-hc="openpc">'+IC('monitor')+' Открыть на ПК</div><div class="hint2">Чат откроется в '+DESK[st.kind]+'. Дальше пиши где удобно: история одна, с телефона сообщения пойдут через ПК.</div>';
 if(st.rw)h+=(sk.indexOf(',ren,')<0?'<div class="btn" data-hc="rename">'+IC('pencil')+' Переименовать</div>':'')+'<div class="btn" data-hc="fork">'+IC('git-branch')+' Ветка: продолжить с копией</div>'+(sk.indexOf(',del,')<0?'<div class="btn bad" data-hc="del">'+IC('trash-2')+' Удалить</div>':'');
 else if(deskOK())h+='<div class="btn" data-hc="fork">'+IC('git-branch')+' Ветка: продолжить с копией</div>';else h+='<div class="hint2">'+(st.kind=='claude'?'Это чат Claude Desktop. Поле ввода отправляет сообщение прямо в него: Claude Desktop на ПК откроет чат и выполнит ход, ответ появится здесь. Можно, даже когда ты за ПК: текст вставится разом, окно вернётся тебе. Копия — отдельный чат в панели, оригинал не меняется.':deskOK()?'Это чат '+DESK[st.kind]+'. Поле ввода отправляет сообщение прямо в него: ход выполнит '+DESK[st.kind]+', история одна на ПК и в панели. Копия — отдельный чат в панели.':'Эта сессия из «'+E(SRC[st.src]||st.src)+'»: оригинал только читается.')+'</div><div class="btn'+(deskOK()?'':' pri')+'" data-hc="fork">'+IC('git-branch')+' Продолжить здесь (копия)</div>';
 sheet(h+'<div class="btn" data-hc="close">Закрыть</div>')}
function renameUI(){sheet('<div class="hcsh"><b>Название чата</b></div><input id="hcren" class="hcinp" maxlength="120" value="'+E(st.title).replace(/"/g,'&quot;')+'"><div class="btn pri" data-hc="rensave">Сохранить</div><div class="btn" data-hc="close">Отмена</div>');setTimeout(function(){var i=document.getElementById('hcren');if(i){i.focus();i.select()}},150)}
function delUI(){sheet('<div class="hcsh"><b>Удалить чат?</b></div><div class="hint2">'+(st.kind=='codex'?'«'+E(st.title)+'» уберётся из панели. Файлы истории Codex останутся на ПК.':'«'+E(st.title)+'» и вся его история будут удалены с ПК. Это нельзя отменить.')+'</div><div class="btn bad" data-hc="delyes">Удалить</div><div class="btn" data-hc="close">Отмена</div>')}

/* ---------- события ---------- */
document.addEventListener('click',function(ev){var el=ev.target.closest('[data-hc]');if(!el)return;var a=el.dataset.hc;
 switch(a){
 case 'open':openSess(el.dataset.id);break;
 case 'kind':setKind(el.dataset.v);break;
 case 'ccsend':ccSend();break;
 case 'ccsay':ccSay();break;
 case 'new':newChat();break;
 case 'newnone':doNew('','');break;
 case 'npnew':npSheet();break;
 case 'npgo':npGo();break;/*s3-8 cases*/
 case 'newproj':{var pp=(st.projs||[])[+el.dataset.i];if(pp)doNew(pp.path,pp.name)}break;
 case 'refresh':st.sessions=null;paint();loadList();break;
 case 'all':if(st.kind=='claude'){st.call=el.dataset.v=='1';LS.set('hccall',st.call)}else{st.all=el.dataset.v=='1';LS.set('hcall',st.all)}st.sessions=null;paint();loadList();break;
 case 'back':leave();break;
 case 'menu':menu(el.dataset.skip);/*s4c-8*/break;
 case 'close':st.fwdDraft=null;st.fwdPend=null;st.newK=null;unsheet();break;
 case 'pin':togglePin(el.dataset.id);break;
 case 'fold':{var f=LS.get('hcfold',{}),k=el.dataset.k,cur=f[k]===undefined?k=='api_server':!!f[k];f[k]=!cur;LS.set('hcfold',f);paint();break}
 case 'pinmenu':unsheet();togglePin(st.sid);break;
 case 'model':st.mq='';modelSheet();break;
 case 'mprov':st.mprov=el.dataset.v;st.mq='';modelSheet();break;
 case 'mpick':pickModel(el.dataset.m,el.dataset.p);break;
 case 'mdef':pickModel('','');break;
 case 'effort':effortSheet();break;
 case 'epick':pickEffort(el.dataset.e);break;
 case 'send':send();break;
 case 'tool':{var t=st.msgs[+el.dataset.b];t=t&&t.parts[+el.dataset.p];if(t){t.open=!t.open;var m=document.getElementById('hcmsgs'),y=m.scrollTop;paint();m.scrollTop=y}break}
 case 'older':st.lim+=200;paint();break;
 case 'seltx':{var sb=st.msgs[+el.dataset.b],stx=msgText(sb);if(stx){sheet('<h3>Выделить текст</h3><textarea id="hcsel" class="hcsel" inputmode="none" autocomplete="off" autocorrect="off" spellcheck="false">'+E(stx)+'</textarea><div class="btn pri" data-hc="copyall" data-b="'+el.dataset.b+'">Копировать всё</div><div class="btn" data-hc="close">Закрыть</div>');setTimeout(function(){var t=document.getElementById('hcsel');if(t){t.style.height=Math.min(Math.max(t.scrollHeight,80),window.innerHeight*.5)+'px'}},30)}}break;
 case 'copycode':{var cc=codeBlocks(msgText(st.msgs[+el.dataset.b]))[+el.dataset.k];if(cc)copyText(cc,function(ok){toast(ok?'<b>'+IC('check')+'</b> Код скопирован':'Не удалось скопировать');if(ok){haptic('success');unsheet()}})}break;
 case 'msgmenu':msgMenu(+el.dataset.b);break;
 case 'fwd':fwdStart(+el.dataset.b);break;
 case 'fwdk':fwdSheet(el.dataset.v);break;
 case 'fwdto':fwdGo(el.dataset.v,el.dataset.id,false);break;
 case 'fwdnew':fwdGo(el.dataset.v,'',true);break;
 case 'copyall':{var cb2=st.msgs[+el.dataset.b],ct2=msgText(cb2);if(ct2)copyText(ct2,function(ok){toast(ok?'<b>'+IC('check')+'</b> Скопировано':'Не удалось скопировать');if(ok){haptic('success');unsheet()}})}break;
 case 'copy':{var cb=st.msgs[+el.dataset.b],ct=msgText(cb);if(ct)copyText(ct,function(ok){toast(ok?'<b>'+IC('check')+'</b> Скопировано':'Не удалось скопировать');if(ok)haptic('success')})}break;
 case 'rmimg':st.imgs.splice(+el.dataset.i,1);paint();break;
 case 'appr':respond(+el.dataset.i,el.dataset.c);break;
 case 'clarop':respond(+el.dataset.i,'',el.dataset.v);break;
 case 'clarskip':respond(+el.dataset.i,'deny','');break;
 case 'perm':{var nv=el.dataset.v||'pc';J(base()+'/sessions/'+encodeURIComponent(st.sid),{method:'PATCH',body:{perm:nv}}).then(function(){st.perm=nv;unsheet();toast(nv=='full'?'Сам разрешаю, кроме опасных — те карточкой тебе':nv=='ask'?'Будет спрашивать перед каждым действием':'Права как на ПК');haptic('success')}).catch(function(e){toast(E(e.message))});break}
 case 'clarify':{var inp=document.getElementById('hcclar');respond(+el.dataset.i,'',inp?inp.value:'')}break;
 case 'link':try{tg.openLink(el.dataset.u)}catch(e){window.open(el.dataset.u,'_blank')}break;
 case 'rename':unsheet();setTimeout(renameUI,260);break;
 case 'openpc':unsheet();J(base()+'/sessions/'+encodeURIComponent(st.sid)+'/pc',{method:'POST',body:{}}).then(function(d){toast(E(d.text||'Открыто на ПК'));haptic('success')}).catch(function(e){toast(E(e.message))});break;
 case 'rensave':{var v=(document.getElementById('hcren').value||'').trim();if(!v)return;J(base()+'/sessions/'+encodeURIComponent(st.sid),{method:'PATCH',body:{title:v}}).then(function(){st.title=v;unsheet();paintChat();toast('Переименовано')}).catch(function(e){toast(E(e.message))});break}
 case 'fork':unsheet();J(base()+'/sessions/'+encodeURIComponent(st.sid)+'/fork',{method:'POST',body:{}}).then(function(d){st.sessions=[d.s];st.msgs=[];openSess(d.s.id);toast('Копия создана — пиши')}).catch(function(e){toast(E(e.message))});break;
 case 'del':unsheet();setTimeout(delUI,260);break;
 case 'delyes':{var id=st.sid;J(base()+'/sessions/'+encodeURIComponent(id),{method:'DELETE'}).then(function(){unsheet();st.sid=null;st.msgs=[];leave();toast('Удалено')}).catch(function(e){toast(E(e.message))});break}
 }});
document.addEventListener('input',function(e){if(e.target.id=='hcin'){st.draft=e.target.value;grow(e.target);sendBtn()}if(e.target.id=='hcmq'){st.mq=e.target.value;mlist()}});
document.addEventListener('focusin',function(e){if(e.target.id=='hcin')document.body.classList.add('hckb')});
document.addEventListener('focusout',function(e){if(e.target.id=='hcin')setTimeout(function(){if(document.activeElement&&document.activeElement.id=='hcin')return;document.body.classList.remove('hckb')},250)});
document.addEventListener('keydown',function(e){if(e.target.id=='hcin'&&e.key=='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();send()}if(e.target.id=='hcren'&&e.key=='Enter'){e.preventDefault();var b=document.querySelector('[data-hc=rensave]');if(b)b.click()}});
document.addEventListener('change',function(e){if(e.target.id!='hcfile')return;var fs=[].slice.call(e.target.files||[]).slice(0,Math.max(0,20-st.imgs.length));if((e.target.files||[]).length+st.imgs.length>20)toast('Не больше 20 фото за раз');e.target.value='';
 fs.reduce(function(p,f){return p.then(function(){return readImg(f).then(function(u){st.imgs.push(u)})})},Promise.resolve()).then(paint).catch(function(){toast('Не удалось прочитать фото')})});
function readImg(file){return new Promise(function(res,rej){var fr=new FileReader();fr.onload=function(){var im=new Image();im.onload=function(){var M=1280,s=Math.min(1,M/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.max(1,Math.round(im.width*s));c.height=Math.max(1,Math.round(im.height*s));c.getContext('2d').drawImage(im,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',.82))};im.onerror=rej;im.src=fr.result};fr.onerror=rej;fr.readAsDataURL(file)})}
function codeBlocks(t){var out=[],re=/```[\w+.-]*[ \t]*\n([\s\S]*?)```/g,m;while((m=re.exec(String(t||'')))&&out.length<4)out.push(m[1].replace(/\n$/,''));return out}
function msgMenu(i){var b=st.msgs[i],t=msgText(b);if(!t||!t.trim())return;var cb=codeBlocks(t),pv=t.replace(/\s+/g,' ').trim();if(pv.length>140)pv=pv.slice(0,140)+'…';
 var h='<h3>Сообщение</h3><div class="hcmpv">'+E(pv)+'</div><div class="btn pri" data-hc="copyall" data-b="'+i+'">'+IC('copy')+' Копировать</div><div class="btn" data-hc="seltx" data-b="'+i+'">'+IC('type')+' Выделить текст</div><div class="btn" data-hc="fwd" data-b="'+i+'">'+IC('forward')+' Переслать в другой чат</div>';
 cb.forEach(function(c,k){h+='<div class="btn" data-hc="copycode" data-b="'+i+'" data-k="'+k+'">'+IC('code')+' Копировать код'+(cb.length>1?' '+(k+1):'')+'</div>'});
 sheet(h+'<div class="btn" data-hc="close">Закрыть</div>')}
(function(){var T=0,T2=0,x0=0,y0=0,row=null,armed=0,fired=0;
 function off(){clearTimeout(T);T=0;if(row&&!armed)row.classList.remove('lp')}
 document.addEventListener('pointerdown',function(e){if(!mounted()||st.view!='chat')return;if(e.pointerType=='mouse'&&!window.__lpMouse)return;
  var r=e.target.closest&&e.target.closest('#hcmsgs .hcrow[data-mi]');if(!r||e.target.closest('[data-hc],a,input,textarea'))return;
  off();row=r;armed=0;x0=e.clientX;y0=e.clientY;
  T=setTimeout(function(){T=0;armed=1;r.classList.add('lp');haptic('sel');
   T2=setTimeout(function(){r.classList.remove('lp');var sl=window.getSelection&&window.getSelection(),nat=!!(sl&&!sl.isCollapsed&&sl.rangeCount&&r.contains(sl.anchorNode));
    diag('lp',{nat:nat?1:0});if(nat)return;fired=Date.now();msgMenu(+r.dataset.mi)},230)},450)},true);
 document.addEventListener('pointermove',function(e){if(T&&(Math.abs(e.clientX-x0)>10||Math.abs(e.clientY-y0)>10))off()},true);
 ['pointerup','pointercancel'].forEach(function(n){document.addEventListener(n,function(){if(T)off()},true)});
 document.addEventListener('scroll',function(){if(T)off()},true);
 document.addEventListener('click',function(e){if(fired&&Date.now()-fired<900){fired=0;e.preventDefault();e.stopPropagation()}},true);
 document.addEventListener('contextmenu',function(e){if(e.target.closest&&e.target.closest('#hcmsgs .hcrow[data-mi]')&&armed){e.preventDefault()}},true);
})();
function fwdQuote(b){var t=msgText(b).trim();/*vb5g3: без служебной разметки [· ·]*/
 return 'Переслано из '+agentName()+' «'+(st.title||'чат')+'»'+(b.k=='u'?' (моё сообщение)':'')+':\n'+t.split('\n').map(function(l){return '> '+l}).join('\n')+'\n\n'}
function fwdStart(i){var b=st.msgs[i];if(!b||!msgText(b).trim())return;st.fwdSrc={q:fwdQuote(b),kind:st.kind,sid:st.sid};st.fwdL=st.fwdL||{};fwdSheet(st.kind)}
function fwdPath(k){return k=='claude'?'/cc/sessions?limit=40':k=='codex'?'/cx/sessions?limit=40':'/sessions?limit=40'}
function fwdSheet(k){if(!st.fwdSrc)return;var L=st.fwdL[k],nm={hermes:'Hermes',claude:'Claude',codex:'Codex'};
 var h='<div class="hcsh"><b>Переслать в…</b></div><div class="hcfil hckind hcfwdk">'+['hermes','claude','codex'].map(function(x){return '<span class="'+(x==k?'on':'')+'" data-hc="fwdk" data-v="'+x+'">'+nm[x]+'</span>'}).join('')+'</div>'+
  '<div class="hcml hcfwdl"><div class="hcmi" data-hc="fwdnew" data-v="'+k+'">'+IC('plus')+'<b>Новый чат '+nm[k]+'</b><span>создать и вставить текст</span></div>';
 /* s4c-7: список агента сразу из кэша бокового меню (список Codex грузится 1–3 с, на видео так и не появился), свежий заменит его */
 if(!st.fwdF)st.fwdF={};if(!st.fwdL[k]&&!st.fwdF[k]){st.fwdF[k]=1;J(fwdPath(k)).then(function(d){st.fwdL[k]=d.s||[];if(document.querySelector('.hcfwdk span.on[data-v="'+k+'"]'))fwdSheet(k)}).catch(function(e){st.fwdF[k]=0;if(!st.fwdL[k]&&!(window.SD3&&SD3.SD.L[k]))st.fwdL[k]=[];toast(E(e.message))})}
 if(!L&&window.SD3&&SD3.SD&&SD3.SD.L&&SD3.SD.L[k])L=SD3.SD.L[k].map(function(x){var y={};for(var q in x)y[q]=x[q];return y});
 if(!L){h+='<div class="hint2">Загружаю…</div>'}
 else{var ok=L.filter(function(x){return (x.rw||k=='claude'||k=='codex'||x.dw)&&x.src!='cron'/*s3-7*/&&!phantom(k,x)/*s4a-fwd*/&&!(k==st.fwdSrc.kind&&x.id==st.fwdSrc.sid)}).sort(function(a,b){return (b.rw?1:0)-(a.rw?1:0)||b.ts-a.ts}).slice(0,25);
  if(!ok.length)h+='<div class="hint2">Чатов, куда можно писать, нет. Создай новый.</div>';
  ok.forEach(function(x){h+='<div class="hcmi" data-hc="fwdto" data-v="'+k+'" data-id="'+E(x.id)+'"><i></i><b>'+E(x.t||'Без названия')+'</b><span>'+E(ago(x.ts))+'</span></div>'})}
 sheet(h+'</div><div class="btn" data-hc="close">Отмена</div>')}
function fwdGo(k,id,isNew){var f=st.fwdSrc;if(!f)return;unsheet();st.fwdSrc=null;
 if(isNew){st.fwdPend=f;newChat(k);return}
 if(st.kind!=k){ccStop();st.kind=k;LS.set('hckind',k);st.models=null;st.msel=null;st.mprov=''}
 st.sessions=(st.fwdL[k]||[]).map(function(x){if(k!='hermes')x.cc=true;return x});st.fwdDraft=f.q;
 openSess(id)}
return {newChat:newChat,msgMenu:msgMenu,fwdStart:fwdStart,copyText:copyText,open:function(id){if(st.kind!='hermes'){st.kind='hermes';LS.set('hckind','hermes')}return openSess(id)},pretty:pretty,cxFresh:cxFresh,chipTxt:chipTxt,st:st,/*vb5m*/shell:shell,after:after,mounted:mounted,leave:leave,md:md,fromHistory:fromHistory,onEv:onEv,paint:paint,failHtml:failHtml,dlHtml:dlHtml,phantom:phantom/*s4a-exp*/}
})();
