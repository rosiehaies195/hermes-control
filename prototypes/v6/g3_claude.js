/* Экран чата Claude iOS с нуля (как gpt3 для ChatGPT, runbook panel-gpt gpt16). Свой экран #cl3 рисуется сам из HC.st базы;
   от базы — только данные и действия: [data-hc] (send, copy, appr, clarop, clarskip, clarify, mpick, mdef, epick, perm, openpc,
   rename, menu, fwd, seltx, older, back, new), textarea #hcin (ввод, Enter, голос voice.js), #hcfile (фото до 20), #hcsend (Стоп),
   #hcthumbs. Эталон — стоп-кадры записей IMG_3212/3213 (cache/scratch/vid/claude/still), значки вырезаны из них (cl_icons.js).
   Повторить/Изменить у Claude не рисуются (умеет только Hermes). */
(function(){
 var D=document,B=D.body,W=window;
 function $i(id){return D.getElementById(id)}
 function st(){return W.HC&&HC.st}
 function E(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
 function root(){return $i('hcroot')}
 function on(){var s=st();return !!(s&&W.U&&U.tab=='hc'&&s.view=='chat'&&root()&&s.kind=='claude'&&!D.documentElement.hasAttribute('data-g3off'))}
 function haptic(t){try{t=='ok'?tg.HapticFeedback.notificationOccurred('success'):tg.HapticFeedback.impactOccurred('light')}catch(e){}}
 function T(m){try{toast(m)}catch(e){}}
 var EFF={'':'Авто',low:'Низкая',medium:'Средняя',high:'Высокая',xhigh:'Очень высокая',max:'Максимальная'},EFS={'':'',low:'Low',medium:'Medium',high:'High',xhigh:'Extra',max:'Max'};/*s5-1*/
 var PERM={pc:'Как на ПК',full:'Сам, кроме опасных',ask:'Спрашивать всё'};
 function ic(n,c){var v=W.CLV&&CLV[n];if(!v)return '';return '<svg class="clv clv-'+n+(c?' '+c:'')+'" width="'+v[0]+'" height="'+v[1]+'" viewBox="0 0 '+v[0]+' '+v[1]+'" aria-hidden="true"><path d="'+v[2]+'"/></svg>'}
 var G={voice:false,sendAfter:false,hold:false,fb:{},spk:-1,sent:[],open:{},qmin:{},qsel:{}};
 try{G.fb=JSON.parse(localStorage.getItem('clfb')||'{}')}catch(e){}
 /* ---------- шрифт ответа: подгон размера по длине строки кадра (New York Medium 17.03 pt даёт 339.7 pt) ---------- */
 var SF=null;function serifFit(){if(SF)return;SF=1;var t='Это тест форматирования: вы попросили',fam=(getComputedStyle(D.documentElement).getPropertyValue('--clserif')||'serif').trim();
  function m(){try{var c=D.createElement('canvas').getContext('2d');c.font='100px '+fam;var w=c.measureText(t).width;if(w>0){var s=Math.max(15.5,Math.min(18.5,100*339.7/w));SF=s;D.documentElement.style.setProperty('--clss',s.toFixed(2)+'px');var l=$i('cll');if(l){l.__h=null;feed()}}}catch(e){}}
  /* шрифт грузится лениво: мерить после загрузки, иначе замер по запасному Georgia */
  try{D.fonts.load('100px '+fam,t).then(m,m)}catch(e){m()}}
 /* ---------- каркас ---------- */
 function frame(){var r=root(),g=$i('cl3');if(g&&g.parentNode===r)return g;if(g)g.remove();
  g=D.createElement('div');g.id='cl3';g.className='cl3';
  g.innerHTML='<div class="clf" id="clf"><div class="cll" id="cll"></div></div><div class="cltop"></div><div class="clbf" id="clbf"></div>'+
   '<div class="clhi" id="clhi">'+ic('spark')+'<b id="clhib"></b></div>'+
   '<div class="clhd" id="clhd"><div class="cl44 clgl" data-cl="side" role="button" aria-label="Все чаты">'+ic('side')+'</div><div class="clsp"></div>'+
   '<div class="cl44 clgl" data-cl="pc" role="button" aria-label="Открыть на ПК">'+ic('laptop')+'</div>'+
   '<div class="clpill clgl"><i data-cl="new" role="button" aria-label="Новый чат">'+ic('pen')+'</i><i data-cl="menu" role="button" aria-label="Меню чата">'+ic('dots')+'</i></div>'+
   '<div class="cl44 clgl clone" data-cl="menu" role="button" aria-label="Меню чата">'+ic('dots')+'</div></div>'+
   '<div class="cldn" id="cldn" data-cl="down" role="button" aria-label="Вниз">'+ic('down')+'</div>'+
   '<div class="clc" id="clc"><div class="clth2" id="clth2"></div><div class="cltr" id="cltr" data-cl="trtap"></div><div class="clrow"><div class="clplus" data-cl="plus" role="button" aria-label="Добавить">'+ic('plus')+'</div>'+
   '<div class="clta2" id="clta2"></div><div class="clchip" id="clchip" data-cl="chip" role="button"></div><div class="clmic" data-cl="mic" role="button" aria-label="Диктовка">'+ic('mic')+'</div><div class="clgo" id="clgo" data-cl="go" role="button"></div></div>'+
   '<div class="cldict" id="cldict"></div><div class="clhide" id="clhide"><input id="clcam" type="file" accept="image/*" capture="environment"></div></div><div id="clqw"></div>';
  r.appendChild(g);
  $i('clf').addEventListener('scroll',function(){dnUpd();atBUpd()},{passive:true});/*s4b-4a*/
  $i('clc').addEventListener('transitionend',function(e){if(e.target.id=='clc')pad()});
  serifFit();return g}
 function adopt(){var ta=$i('hcin'),slot=$i('clta2'),hide=$i('clhide'),fl=$i('hcfile'),sb=$i('hcsend'),th=$i('hcthumbs'),ch=$i('hcchips');
  if(ta&&slot&&ta.parentNode!==slot){slot.appendChild(ta);ta.setAttribute('rows','1')}
  [fl,sb,ch].forEach(function(n){if(n&&hide&&n.parentNode!==hide)hide.appendChild(n)});
  if(th&&th.parentNode!==$i('clth2'))$i('clth2').appendChild(th);
  if(ta){var s=st(),kb=B.classList.contains('hckb'),em=!s.msgs.length;
   /* «Type or hold to talk» / «Reply or hold to talk» / в фокусе «Chat with Claude» / «Reply to Claude» */
   var ph=kb?(em?'Написать Claude':'Ответить Claude'):(s.imgs&&s.imgs.length?'Написать или удерживать':'Пиши или удерживай');if(ta.placeholder!=ph)ta.placeholder=ph}}
 /* ---------- лента ---------- */
 /* cb5: разметка одного и того же текста не пересчитывается на каждом токене стрима */
 var MDC=Object.create(null),MDN=0;function md(t){var k=String(t==null?'':t),v=MDC[k];if(v!==undefined)return v;try{v=HC.md(k)}catch(e){v=E(k)}
  if(k.length<30000){if(++MDN>300){MDC=Object.create(null);MDN=1}MDC[k]=v}return v}
 function txt(b){if(!b)return '';if(b.k=='u')return b.t||'';return (b.parts||[]).filter(function(p){return p.p=='t'}).map(function(p){return p.t}).join('\n\n')}
 var TN6={exec:'Команда',exec_command:'Команда',shell:'Команда',shell_command:'Команда',bash:'Команда',terminal:'Команда',local_shell:'Команда',apply_patch:'Правка файлов',edit:'Правка файла',multiedit:'Правка файла',write:'Запись файла',write_file:'Запись файла',patch:'Правка файлов',read:'Чтение файла',read_file:'Чтение файла',view:'Просмотр файла',view_image:'Просмотр картинки',grep:'Поиск в файлах',glob:'Поиск файлов',search_files:'Поиск в файлах',list_dir:'Список файлов',ls:'Список файлов',web_search:'Поиск в сети',websearch:'Поиск в сети',web_fetch:'Страница из сети',webfetch:'Страница из сети',web_extract:'Страница из сети',task:'Помощник',agent:'Помощник',spawn_agent:'Помощник',delegate_task:'Помощник',update_plan:'План',todowrite:'План',todo:'План'};
 function tn6(n){var k=String(n||'').toLowerCase().replace(/^mcp__[^_]+__/,'');return TN6[k]||(/^mcp__/.test(String(n||''))?String(n).replace(/^mcp__([^_]+)__/,'$1 · ').replace(/_/g,' '):n)}/*vb5g6*/
 function toolName(p){var a={};try{a=JSON.parse(p.a||'{}')}catch(e){}var x=a.command||a.cmd||a.path||a.file_path||a.query||a.url||a.pattern||a.description||'';
  return '<b>'+E(tn6(p.n)||'действие')+'</b>'+(x?' <span>'+E(String(x).replace(/\s+/g,' ').slice(0,90))+'</span>':'')}
 function stepsWord(n){var m=n%10,c=n%100;return n+' '+(m==1&&c!=11?'шаг':m>=2&&m<=4&&(c<10||c>=20)?'шага':'шагов')}
 function turns(){var s=st(),L=[],from=Math.max(0,s.msgs.length-s.lim),cur=null,lastU=null;
  for(var i=from;i<s.msgs.length;i++){var b=s.msgs[i];
   if(b.k=='u'){cur=null;lastU=b;L.push({u:b,i:i});continue}
   if(!cur){cur={a:[],ai:[],ts0:lastU?lastU.ts:b.ts};L.push(cur)}
   cur.a.push(b);cur.ai.push(i)}
  return {L:L,from:from}}
 function label(p){var n=(p&&p.n)||'';return !p?'Думаю…':/AskUser|question/i.test(n)?'Задаю вопрос':/Bash|terminal|command/i.test(n)?'Выполняю команду':/Grep|Glob|search/i.test(n)?'Ищу':/Read|file/i.test(n)?'Читаю файлы':/Edit|Write/i.test(n)?'Правлю файлы':/Web|browser|fetch/i.test(n)?'Смотрю в сети':/Task|agent/i.test(n)?'Работает помощник':'Работаю'}
 function thinking(last,k){var q=last&&/AskUser|question/i.test(last.n||'');return '<div class="clth" data-cl="worked" data-i="'+k+'"><div class="cldots"><i></i><i></i><i></i></div><span>'+E(label(last))+'</span>'+(q?ic('clock'):'')+(last?ic('chev'):'')+'</div>'}
 function turnA(t,lv,lastTurn){var s=st(),h='',tools=[],tx=[],ti=-1,lastTool=null;
  t.a.forEach(function(b,k){(b.parts||[]).forEach(function(p){if(p.p=='tool'){tools.push(p);lastTool=p}else if(p.p=='t'&&p.t&&p.t.trim()){tx.push(p.t);ti=t.ai[k]}})});
  var lastA=t.a[t.a.length-1],li=t.ai[t.ai.length-1];
  if(tools.length&&!(lv&&!tx.length)){var op=!!G.open[li];
   h+='<div class="clwk'+(op?' on':'')+'" data-cl="worked" data-i="'+li+'">'+ic('clock')+'<span>'+stepsWord(tools.length)+'</span>'+ic('chev')+'</div>';/* ◷ текст › (3213_0053.62: ◷ x 20, текст x 37) */
   if(op)h+='<div class="cltl">'+tools.map(function(p,j){var k=li+':'+j,o=!!G.open[k],res=String(p.res||'');try{var J=JSON.parse(res);res=J.output!=null?String(J.output)+(J.error?'\n'+J.error:''):res}catch(e){}
    return '<div class="clto'+(p.st=='err'?' bad':'')+'" data-cl="tres" data-k="'+k+'">'+toolName(p)+'</div>'+(o?'<pre class="clpre">'+E(res.slice(0,4000)||'(пусто)')+'</pre>':'')}).join('')+'</div>'}
  tx.forEach(function(x){h+='<div class="cla">'+md(x)+'</div>'});
  var lp=lastA.parts||[];
  if(lv&&(!tx.length||lp.length&&lp[lp.length-1].p=='tool'))h+=thinking(lp.length&&lp[lp.length-1].p=='tool'?lp[lp.length-1]:null,li);
  if(!lv&&tx.length){var fb=G.fb[s.sid+':'+ti]||'';li=ti;
   /* Copy · Share(Переслать) · Play(Вслух) · 👍 · 👎 (кадр 3213_0131.50; «Повторить» — только у Hermes) */
   h+='<div class="clact"><i data-hc="copy" data-b="'+li+'" data-clc="1" role="button" aria-label="Копировать">'+ic('copy')+'</i>'+
    '<i data-hc="fwd" data-b="'+li+'" role="button" aria-label="Переслать">'+ic('share')+'</i>'+
    '<i data-cl="speak" data-i="'+li+'" class="'+(G.spk==li?'on':'')+'" role="button" aria-label="Прочитать вслух">'+ic('play')+'</i>'+
    '<i data-cl="fb" data-v="up" data-i="'+li+'" class="'+(fb=='up'?'on':'')+'" role="button" aria-label="Хороший ответ">'+ic('like')+'</i>'+
    '<i data-cl="fb" data-v="dn" data-i="'+li+'" class="'+(fb=='dn'?'on':'')+'" role="button" aria-label="Плохой ответ">'+ic('dislike')+'</i></div>'+
    (lastTurn?'<div class="cldis">Claude — ИИ и может ошибаться.</div>':'')}
  return '<div class="clta'+(lastTurn?' cllast':'')+'" data-mi="'+li+'" data-t="'+t.ai[0]+'">'+h+'</div>'}
 function imgsOf(b){if(!b.im)return '';var m=G.sent.filter(function(x){return Math.abs(x.ts-b.ts)<60&&x.n==b.im})[0];
  if(m)return '<div class="cluim">'+m.u.map(function(u){return '<img src="'+u+'">'}).join('')+'</div>';
  return '<div class="cluim0">'+b.im+' фото</div>'}
 function live(){var s=st(),sb=$i('hcsend');return !!((s.dsq&&s.sid&&s.dsq[s.sid])/*s4a-live*/||s.busy||s.cclive||(s.cur&&s.cur.live)||(sb&&sb.classList.contains('stop')))}
 function feedHtml(){var s=st(),R=turns(),h='',lv=live();
  if(R.from>0)h+='<div class="clolder" data-hc="older">Показать более ранние ('+R.from+')</div>';
  var lu=-1;R.L.forEach(function(t,k){if(t.u)lu=k});var opened=false;
  R.L.forEach(function(t,k){var last=k==R.L.length-1;
   if(k==lu){h+='<div class="cllt" id="cllt"'+(G.ltH?' style="min-height:'+G.ltH+'px"':'')+'>';opened=true}
   if(t.u){h+='<div class="clum" data-mi="'+t.i+'">'+imgsOf(t.u)+(t.u.t?'<div class="club">'+md(t.u.t)+'</div>':'')+(t.u.fail!=null&&HC.failHtml?HC.failHtml(t.u):'')/*s4a-fl*/+(t.u.dl&&HC.dlHtml?HC.dlHtml(t.u):'')/*s5-dlv*/+'</div>';
    if(last&&lv)h+='<div class="clta cllast">'+thinking(null,-1)+'</div>';return}
   h+=turnA(t,last&&lv,last)});
  /* свёрнутая карточка вопроса/разрешения — строкой статуса (✕ на карточке) */
  (s.pend||[]).forEach(function(p,i){if(G.qmin[p.id||i])h+='<div class="clth" data-cl="qopen" data-i="'+i+'"><div class="cldots"><i></i><i></i><i></i></div><span>'+(p.kind=='clarify'?'Задаю вопрос':'Жду разрешения')+'</span>'+ic('clock')+ic('chev')+'</div>'});
  if(W.S5S)h+=S5S.html(s);/*s5-sub: субагенты*/
  if(s.err)h+='<div class="clerr"><i>i</i><div>'+E(s.err)+'</div></div>';
  if(opened)h+='</div>';
  if(s.loadingMsgs&&!s.msgs.length&&!(s.creating&&s.creating==s.sid)/*vb5a6*/)h+='<div class="clth clload"><div class="cldots"><i></i><i></i><i></i></div><span>Загружаю</span></div>';
  return h}
 /* cb5: список обновляем по верхним узлам: неизменившиеся остаются как есть (без пересоздания и перекладки), меняется только последний обмен */
 function setList(l,nh,first){
  if(!first&&l.__ok){var t=D.createElement('template');t.innerHTML=nh;var nk=t.content;
   if(nk.childNodes.length===nk.children.length){var arr=Array.prototype.slice.call(nk.children),ok=l.children,ch=[];
    for(var i=0;i<arr.length;i++){var nn=arr[i],oh=nn.outerHTML,on=ok[i];nn.__oh=oh;if(on&&on.__oh===oh)continue;if(on)l.replaceChild(nn,on);else l.appendChild(nn);ch.push(nn)}
    while(l.children.length>arr.length)l.removeChild(l.lastElementChild);return ch}}
  l.innerHTML=nh;l.__ok=1;for(var j=0;j<l.children.length;j++)l.children[j].__oh=l.children[j].outerHTML;return null}
 function feed(){var f=$i('clf'),l=$i('cll');if(!f||!l)return;var _t0=performance.now(),nh=feedHtml();if(l.__h===nh)return;
  var sl=W.getSelection&&W.getSelection(),selin=sl&&!sl.isCollapsed&&sl.rangeCount&&l.contains(sl.anchorNode);if(selin&&!G.stick)return;
  var s=st(),key=s.kind+':'+s.sid,first=l.__sid!==key,prevN=l.querySelectorAll('.clum').length;
  var sc0=f.scrollTop;l.__h=nh;l.__sid=key;var ch=setList(l,nh,first);if(!first&&f.scrollTop!=sc0)f.scrollTop=sc0;
  if(ch)ch.forEach(shrink);else shrink(l);var nowN=l.querySelectorAll('.clum').length;fadeTail(l,first);ltFit();
  /* s4b-2: после отправки верх своего сообщения — под шапкой и не срезан; s4b-4b: первое заполнение ленты — вниз */
  var full=s.msgs.length>0&&l.__full!==key;if(full)l.__full=key;
  if(nowN>prevN&&G.fly){f.scrollTop=f.scrollHeight;ltTop(f,l)}else if(first||full||G.stick)f.scrollTop=f.scrollHeight;
  if(G.fly&&nowN>prevN)flyIn(l.querySelectorAll('.clum')[nowN-1]);else flyKeep(l);if(nowN>prevN)G.fly=null;G.stick=false;
  var _d=performance.now()-_t0;if(_d>45&&W.cbDiag)cbDiag('feed_slow',{ms:Math.round(_d),kids:l.children.length,nodes:l.getElementsByTagName('*').length});dnUpd();atBUpd()}
 /* пузырь обтягивает самую длинную строку (у Claude 2-строчный пузырь 310.6 pt при максимуме 318) */
 function shrink(l){l.querySelectorAll('.club').forEach(function(b){if(b.offsetHeight<60)return;var mx=0,mn=1e9,w=D.createTreeWalker(b,NodeFilter.SHOW_TEXT,null),n;
  /* только строки текста: прямоугольники блоков разметки (div абзаца) всегда во всю ширину */
  while((n=w.nextNode())){if(!n.data.trim())continue;var r=D.createRange();r.selectNodeContents(n);var R=r.getClientRects();for(var i=0;i<R.length;i++){if(R[i].width<1)continue;mn=Math.min(mn,R[i].left);mx=Math.max(mx,R[i].right)}}
  if(mx>mn){var ww=Math.ceil(mx-mn+32.5);if(ww<b.offsetWidth-1)b.style.width=ww+'px'}})}
 /* хвост при стриминге: слово проявляется 440 мс (как gpt3; у Claude в 3213_0130.19 нижние строки тоже в проявлении) */
 var FD=440,FST=30,FSH=25,FADE={key:'',b:[]};
 function words(el){var L=[],w=D.createTreeWalker(el,NodeFilter.SHOW_TEXT,null),n;while((n=w.nextNode())){var re=/\S+/g,m;while((m=re.exec(n.data)))L.push({n:n,i:m.index,l:m[0].length})}return L}
 function fadeTail(l,first){var s=st(),t=l.querySelector('.clta.cllast');if(!t){FADE.key='';return}
  var key=s.kind+':'+s.sid+':'+(t.dataset.t||''),W2=[];t.querySelectorAll('.cla').forEach(function(a){W2=W2.concat(words(a))});
  var now=performance.now(),lv=live(),b=FADE.key==key?FADE.b:null;
  if(!b){b=[];var fresh=lv&&!first&&W2.length<=40;for(var j=0;j<W2.length;j++)b.push(fresh?now+j*FST:-1e9);FADE.key=key;FADE.b=b}
  else if(W2.length>b.length){var m0=b.length,n2=W2.length-m0,prev=m0?b[m0-1]:-1e9,s0=Math.max(now,prev+FST),stp=Math.max(0,Math.min(FST,(now+800-s0)/n2));for(var k=0;k<n2;k++)b.push(s0+k*stp)}
  else if(W2.length<b.length)b.length=W2.length;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  for(var q=W2.length-1;q>=0;q--){var age=now-b[q];if(age>=FD-FSH)continue;var x=W2[q],n=x.n;
   var r=n.splitText(x.i);r.splitText(x.l);var sp=D.createElement('span');sp.className='clfw';sp.style.animationDelay=(-(age+FSH)).toFixed(0)+'ms';r.parentNode.replaceChild(sp,r);sp.appendChild(r)}}
 function ltFit(){var lt=$i('cllt'),f=$i('clf'),l=$i('cll');if(!lt||!f)return;var cs=getComputedStyle(l),
  h=Math.max(0,f.clientHeight-parseFloat(cs.paddingTop)-8-parseFloat(cs.paddingBottom));G.ltH=h;if(lt.style.minHeight!=h+'px')lt.style.minHeight=h+'px'}
 /* отправка (§8, 3212 35.77): пузырь из поля в ленту, по кадрам: см. SEND ниже */
 /* полёт пузыря (3212 35.91–36.20, anim_cl send): пружина response .23, damping .98 — 292 мс (fit_spring.py) */
 var SEND='linear(0,.045,.145,.266,.388,.501,.6,.684,.753,.809,.853,.888,.915,.936,.953,.965,.974,.981,.986,.99,.993,.995,.996,.997,1)',SENDD=292;
 function flyIn(el){var fy=G.flyY;if(!el||fy==null||!el.animate||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var r=el.getBoundingClientRect(),dy=fy-r.top;if(dy<=4)return;
  el.animate([{transform:'translateY('+dy+'px)'},{transform:'none'}],{duration:SENDD,easing:SEND});G.flyA={t:performance.now(),dy:dy}}
 function flyKeep(l){var a=G.flyA;if(!a)return;var e2=performance.now()-a.t;if(e2>=SENDD){G.flyA=null;return}var L=l.querySelectorAll('.clum'),el=L[L.length-1];
  if(el&&el.animate)el.animate([{transform:'translateY('+a.dy+'px)'},{transform:'none'}],{duration:SENDD,delay:-e2,easing:SEND})}
 function dnUpd(){var f=$i('clf'),b=$i('cldn');if(!f||!b)return;b.classList.toggle('on',f.scrollHeight-f.scrollTop-f.clientHeight>200)}
 /* s4b-4: «был внизу» — по прокрутке и после перерисовки; rb — низ экрана чата (с клавиатурой iOS выше низа окна) */
 function atBUpd(){var f=$i('clf');if(f)G.atB=f.scrollHeight-f.scrollTop-f.clientHeight<60}
 function rb(){var g=$i('cl3');return g?g.getBoundingClientRect().bottom:innerHeight}
 function ltTop(f,l){var lt=$i('cllt');if(!lt)return;var pt=parseFloat(getComputedStyle(l).paddingTop)||0,d=lt.getBoundingClientRect().top-f.getBoundingClientRect().top-pt-8;if(d<0)f.scrollTop=Math.max(0,f.scrollTop+d)}
 function cTop(c){var R=c.getBoundingClientRect(),an=c.getAnimations&&c.getAnimations().some(function(a){return a.playState=='running'&&!a.transitionProperty});return an&&c.__h?R.bottom-c.__h:R.top}
 /* ---------- пустой чат: искра + «Добрый день, имя» по центру над полем ---------- */
 function hello(){var s=st(),g=$i('clhi');if(!g)return;var em=!s.msgs.length&&(!s.loadingMsgs||(s.creating&&s.creating==s.sid))/*vb5a6*/&&!(s.pend||[]).length&&!s.busy;g.classList.toggle('on',em);if(!em)return;
  var h=new Date().getHours(),w=h<5?'Доброй ночи':h<12?'Доброе утро':h<18?'Добрый день':'Добрый вечер',nm='';try{nm=(tg.initDataUnsafe&&tg.initDataUnsafe.user&&tg.initDataUnsafe.user.first_name)||''}catch(e){}
  var t=w+(nm?', '+nm:''),b=$i('clhib');if(b.textContent!=t)b.textContent=t;
  /* кадр 3212_0009.79: искра 396–431, строка ~470 при поле на 766; с клавиатурой (0014.24) — по центру свободного места */
  var c=$i('clc'),g0=$i('cl3'),rt=g0?g0.getBoundingClientRect().top:0,top=(c?c.getBoundingClientRect().top:rb()-86)-rt,hd=(parseFloat(getComputedStyle(D.documentElement).getPropertyValue('--g3t'))||0)+44;
  var mid=(hd+top)/2;g.style.top=Math.round(mid-39)+'px'}
 /* ---------- поле ---------- */
 function rec(){return !!(W.VC&&(VC.rec||VC.busy))}
 function has(){var s=st(),ta=$i('hcin');return !!((ta&&ta.value.trim())||(s.imgs&&s.imgs.length))}
 function chipHtml(){var s=st(),m=s.msel&&s.msel.m?s.msel.m:(s.models&&s.models.cur&&s.models.cur.model!='default'?s.models.cur.model:''),e=(s.msel&&s.msel.e)||'';
  var dx=s.models&&s.models.x&&s.models.x.def,mn=m?HC.pretty(m):(dx&&dx.n||'Claude');/*s5-1: «Opus 5.5» по умолчанию, как чип Claude iOS*//* чип как у Claude: «Opus 5.5 Medium» (3213_0135.68) — имя модели без «Claude», сила второй строкой серым */
  mn=mn.replace(/^Claude\s+/i,'');return E(mn)+(e?'<em>'+E(EFS[e])+'</em>':'<em>Авто</em>')}
 function comp(){var c=$i('clc'),ta=$i('hcin'),go=$i('clgo');if(!c||!ta||!go)return;
  var r=rec(),hs=has(),kb=B.classList.contains('hckb'),stopS=!hs&&!r&&live(),card=!r&&(hs||kb||(ta.value&&ta.value.length>0));
  var k=(r?'r':'')+(card?'c':'')+(kb?'k':''),h0=c.__h||c.offsetHeight;
  c.classList.toggle('clrec',r);c.classList.toggle('clcard',card);c.classList.toggle('clhas',hs);
  var gi=stopS?'stop':hs?'up':'voice';if(go.dataset.i!=gi){var old=go.dataset.i;go.dataset.i=gi;go.innerHTML=ic(gi);go.setAttribute('aria-label',gi=='stop'?'Остановить':gi=='up'?'Отправить':'Сказать и отправить');
   /* §8 voice → send 280 мс: белая уходит, оранжевая выпрыгивает */
   if(old&&go.animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches)go.animate([{transform:'scale(.6)',opacity:.4},{transform:'scale(1.06)',opacity:1,offset:.7},{transform:'none'}],{duration:280,easing:'ease-out'})}
  var ch=$i('clchip');if(ch){var x=chipHtml();if(ch.__h!==x){ch.__h=x;ch.innerHTML=x}}
  grow(ta);adopt();var h1=c.offsetHeight;c.__h=h1;
  /* §8: клавиатура — перестройка 52 → 98.7 за ~100 мс; вставка длинного текста — без анимации (1 кадр); диктовка — 140 мс */
  if(c.__k!==undefined&&c.__k!==k&&Math.abs(h1-h0)>2&&c.animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches)
   c.animate([{height:h0+'px'},{height:h1+'px'}],{duration:r?140:card?100:150,easing:r?'cubic-bezier(.2,.05,.3,1)':'cubic-bezier(.25,.2,.15,1)'}).onfinish=function(){pad()};/*s4b-2b*/
  c.__k=k;dict();pad();hello()}
 /* рост до 231 pt (3212_0130.78): дальше прокрутка внутри */
 function grow(ta){var c=$i('clc'),cs=getComputedStyle(ta),lh=parseFloat(cs.lineHeight)||23.7,card=c&&c.classList.contains('clcard');
  ta.style.height='auto';var sh=ta.scrollHeight,mx=card?231-36-8-(($i('hcthumbs')&&$i('hcthumbs').children.length)?87:0):52,h=Math.min(mx,Math.max(card?lh+31:52,sh));
  /* поле на максимуме: видна последняя строка, в 31 pt над чипом (3212_0130.78) — прокрутка вниз, когда не в фокусе (в фокусе — каретка) */
  if(ta.style.height!=h+'px')ta.style.height=h+'px';if(card&&sh>mx&&D.activeElement!=ta)ta.scrollTop=ta.scrollHeight}
 function pad(){var c=$i('clc'),l=$i('cll'),f=$i('clf');if(!c||!l)return;var top=cTop(c),bot=rb(),keep=G.atB!==false,/* низ ленты: без клавиатуры дисклеймер в 5 pt над полем (3213_0131.50), с клавиатурой в 39 pt (3213_0135.68) */h=Math.round(bot-top+0.4+(B.classList.contains('hckb')?30.7:c.classList.contains('clrec')?34.3:0));/* при диктовке без клавиатуры — 39 pt (3213_0053.62) */
  var near=keep||f.scrollHeight-f.scrollTop-f.clientHeight<60;if(l.style.paddingBottom!=h+'px')l.style.paddingBottom=h+'px';ltFit();/*s4b-4: ltFit при любой смене высоты*/
  if(near&&f.scrollHeight-f.scrollTop-f.clientHeight>1)f.scrollTop=f.scrollHeight;
  var dn=$i('cldn');if(dn)dn.style.bottom=(bot-top+20)+'px';
  var bf=$i('clbf');if(bf)bf.style.height=Math.max(0,Math.round(bot-top+30))+'px';/*s4b-1*/dnUpd()}
 /* ---------- диктовка (§3.4): «× · волна 33 бара · ■ · ↑», живой текст — сверху в той же карточке, хвост гаснет ---------- */
 function dict(){var d=$i('cldict'),r=rec(),c=$i('clc');if(!d)return;
  if(!r){if(d.dataset.k){d.dataset.k='';d.innerHTML=''}stopWave();trUpd(false);if(c)c.classList.remove('clhold');return}
  var busy=!!VC.busy,key=(busy?'b':'r')+(G.sendAfter?'s':'');
  if(d.dataset.k!==key){var first=!d.dataset.k;d.dataset.k=key;
   d.innerHTML='<div class="cldx" data-cl="dcancel" role="button" aria-label="Отменить диктовку">'+ic('x')+'</div><i class="clhq"></i><div class="clhl">Отпусти, чтобы отправить</div>'+
    '<div class="clwv" data-cl="wave">'+(busy?'<span>Распознаю…</span>':'<canvas id="clcv"></canvas>')+'</div>'+
    '<div class="clds" data-cl="dstop" role="button" aria-label="Остановить диктовку">'+(busy&&!G.sendAfter?'<i class="clspin"></i>':'<i class="sq"></i>')+'</div>'+
    '<div class="clgo" data-i="up" data-cl="dsend" role="button" aria-label="Распознать и отправить">'+(busy&&G.sendAfter?'<i class="clspin"></i>':ic('up'))+'</div>';
   if(first&&d.animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches)d.animate([{opacity:0},{opacity:1}],{duration:120,easing:'ease-out'})}
  if(c)c.classList.toggle('clhold',!!G.hold);trUpd(G.show!==false);if(!busy)startWave();else stopWave()}
 function trUpd(on){var t=$i('cltr'),ta=$i('hcin');if(!t)return;var v=on&&ta&&rec()?ta.value.trim():'';var was=t.classList.contains('on');t.classList.toggle('on',!!v);if(v&&t.textContent!==ta.value)t.textContent=ta.value;
  if(!!v!=was){var c=$i('clc');if(c&&c.animate){var h1=c.offsetHeight;c.animate([{height:(c.__h||h1)+'px'},{height:h1+'px'}],{duration:140,easing:'cubic-bezier(.2,.05,.3,1)'});c.__h=h1}pad()}}
 /* волна (§3.4): 33 бара шириной 3 pt, шаг 6, высота 2.7 (тишина — точки) … 25 pt, белые, едут влево */
 var WV=null;
 function startWave(){if(WV&&WV.on)return;WV={on:true,hist:[],lvl:0,env:0,ph:0,t0:0,raf:0,an:null,buf:null,last:0,ac:null};
  try{var AC=W.AudioContext||W.webkitAudioContext;if(AC&&VC.stream&&typeof MediaStream!='undefined'&&VC.stream instanceof MediaStream){WV.ac=new AC();var src=WV.ac.createMediaStreamSource(VC.stream);WV.an=WV.ac.createAnalyser();WV.an.fftSize=2048;src.connect(WV.an);WV.buf=new Float32Array(WV.an.fftSize)}}catch(e){WV.an=null}
  WV.raf=requestAnimationFrame(wframe)}
 function stopWave(){if(!WV)return;WV.on=false;cancelAnimationFrame(WV.raf);try{WV.ac&&WV.ac.close()}catch(e){}WV=null}
 function wframe(now){if(!WV||!WV.on)return;
  if(now-WV.last>=100){WV.last=now;var r=0;if(W.__cllvl!=null)r=W.__cllvl;else if(W.__g3lvl!=null)r=W.__g3lvl;else if(WV.an){WV.an.getFloatTimeDomainData(WV.buf);var q=0;for(var i=0;i<WV.buf.length;i++)q+=WV.buf[i]*WV.buf[i];r=Math.sqrt(q/WV.buf.length)}WV.lvl=r<.0025?0:Math.min(1,8*r)}
  var dt=WV.t0?Math.min(100,now-WV.t0):0;WV.t0=now;WV.env+=(WV.lvl-WV.env)*(1-Math.exp(-dt/(WV.lvl>WV.env?35:90)));
  WV.ph+=30*dt/1000;while(WV.ph>=6){WV.hist.push(WV.env);WV.hist.shift();WV.ph-=6}
  var cv=$i('clcv');if(cv){var a=cv.clientWidth,o=cv.clientHeight,dpr=W.devicePixelRatio||1;if(a&&o){if(cv.width!=Math.round(a*dpr)){cv.width=Math.round(a*dpr);cv.height=Math.round(o*dpr)}
   var x=cv.getContext('2d');x.setTransform(dpr,0,0,dpr,0,0);x.clearRect(0,0,a,o);x.fillStyle=getComputedStyle(cv).color;var need=Math.ceil(a/6)+2;while(WV.hist.length>need)WV.hist.shift();
   for(var e=0;e<WV.hist.length;e++){var n=a-3-6*e-WV.ph;if(n<-3)break;var l=WV.hist[WV.hist.length-1-e],m=2.7+l*22.3;
    x.beginPath();if(x.roundRect)x.roundRect(n,(o-m)/2,3,m,1.5);else x.rect(n,(o-m)/2,3,m);x.fill()}}}
  WV.raf=requestAnimationFrame(wframe)}
 function abortRec(){G.sendAfter=false;G.voice=false;/* cb3: × работает и пока идёт «Распознаю…» */if(W.VC&&VC.busy&&!VC.rec){vcCancelBusy();draw();return}if(!W.VC||!VC.rec)return;var r=VC.rec;r.ondataavailable=null;
  r.onstop=function(){try{VC.stream.getTracks().forEach(function(t){t.stop()})}catch(e){}clearInterval(VC.tick);clearTimeout(VC.timer);VC.rec=null;VC.seq++;VC.busy=false;vcSet('');vcUi()};try{r.stop()}catch(e){r.onstop()}}
 function sendAfter(){var sid0=st().sid,g0=W.VC?VC.gen:0;G.sendAfter=true;draw();if(VC.rec)vcStop();var n=0;(function w(){if(W.VC&&(VC.rec||VC.busy)&&n++<3000)return setTimeout(w,100);
    /* cb3: отправляем только в тот чат, где диктовали, и только если не отменили; ждать можно сколько нужно (раньше сдавались на 60 с) */
    var ok=G.sendAfter&&(!W.VC||VC.gen==g0)&&st().sid==sid0;G.sendAfter=false;G.voice=false;
    if(ok&&has()){doSend();if(!has())T('Отправлено голосом')/*s4a-va: чип — только если правда ушло*/}draw()})()}
 function doSend(){var ta=$i('hcin'),s=st();if(ta){G.flyY=ta.getBoundingClientRect().top+2}G.fly=1;G.stick=true;
  if(s.imgs&&s.imgs.length)G.sent.push({ts:Date.now()/1000,n:s.imgs.length,u:s.imgs.slice()});
  var sb=$i('hcsend');if(sb)sb.click()}
 /* ---------- карточка вопроса / разрешения вместо поля (3212_0059.41) ---------- */
 function optOf(o){if(o&&typeof o=='object')return {t:o.label||o.t||'',d:o.description||o.d||''};var s=String(o),m=s.split(/\s+[—–-]\s+/);return m.length>1?{t:m[0],d:m.slice(1).join(' — ')}:{t:s,d:''}}
 function qcard(){var w=$i('clqw'),s=st(),c=$i('clc');if(!w)return;var P=(s.pend||[]),i=-1;P.some(function(p,k){if(!G.qmin[p.id||k]){i=k;return true}});
  var p=i>=0?P[i]:null,key=p?(p.id||i)+':'+p.kind+':'+(G.qsel[p.id||i]||''):'';
  if(c)c.style.visibility=p?'hidden':'';
  if(w.dataset.k===key)return;var keep=$i('hcclar')?$i('hcclar').value:'';w.dataset.k=key;
  if(!p){w.innerHTML='';return}
  var h='',sel=G.qsel[p.id||i];
  if(p.kind=='clarify'){var ops=p.opts||[];
   h='<div class="clqh"><b>'+E(p.text||'Вопрос')+'</b><div class="clqx" data-cl="qmin" data-i="'+i+'" role="button" aria-label="Свернуть">'+ic('x')+'</div></div><div class="clqb">'+
    ops.map(function(o,j){var x=optOf(o);return '<div class="clqo'+(sel===String(j)?' on':'')+'" data-cl="qpick" data-i="'+i+'" data-j="'+j+'"><b>'+E(x.t)+'</b>'+(x.d?'<span>'+E(x.d)+'</span>':'')+'</div>'}).join('')+
    '<div class="clqi"><input id="hcclar" placeholder="Свой ответ…"><div class="clmic" data-cl="qmic" role="button" aria-label="Диктовка">'+ic('mic')+'</div></div></div>'+
    '<div class="clqbt"><div class="clsk" data-hc="clarskip" data-i="'+i+'">Пропустить</div><div class="clsb'+(sel!=null?' on':'')+'" data-cl="qsend" data-i="'+i+'">Ответить</div></div>'}
  else{/* разрешение — как список вариантов Claude Code: Да / Да, всегда / Нет */
   h='<div class="clqh"><b>Разрешить'+(p.tool?' · '+E(p.tool):'')+'?</b><div class="clqx" data-cl="qmin" data-i="'+i+'" role="button" aria-label="Свернуть">'+ic('x')+'</div></div><div class="clqb">'+
    (p.desc?'<div class="clqd">'+E(p.desc)+'</div>':'')+(p.text?'<pre class="clqpre">'+E(p.text)+'</pre>':'')+
    '<div class="clqo" data-hc="appr" data-c="once" data-i="'+i+'"><b>Разрешить</b><span>Один раз</span></div>'+
    '<div class="clqo" data-hc="appr" data-c="session" data-i="'+i+'"><b>Разрешать всегда</b><span>Больше не спрашивать в этом чате</span></div>'+
    '<div class="clqo bad" data-hc="appr" data-c="deny" data-i="'+i+'"><b>Отклонить</b></div></div>'}
  w.innerHTML='<div class="clq" id="clq">'+h+'</div>';var inp=$i('hcclar');if(inp&&keep)inp.value=keep;
  var q=$i('clq');if(q&&q.animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&!w.__shown)q.animate([{transform:'translateY(40px)',opacity:0},{transform:'none',opacity:1}],{duration:380,easing:'cubic-bezier(.32,.72,0,1)'});w.__shown=1}
 /* ---------- меню (§6): стекло r33, морф из точки касания: scale .88 → 1 с отскоком 1.6–2 %, 390 мс ---------- */
 /* меню долгого нажатия (3213 167.50–167.83, anim_cl lp_width): с первого кадра (масштаб .88) быстро до 1.13 пути к 100 мс и плавно назад к 1 к 300 мс — кривая снята прямо с видео */
 var SPR='linear(0, .55 7.5%, .8 12.6%, .96 17.4%, 1.06 22.5%, 1.13 30%, 1.13 40%, 1.1 50%, 1.07 57%, 1.04 70%, 1.02 80%, 1.005 90%, 1)';
 function closePop(){/* меню закрыто — «съесть» следующий клик после долгого нажатия больше не нужно */if(LP)LP.fired=0;var p=$i('clpop'),v=$i('clveil');if(v)v.remove();D.querySelectorAll('.cllift').forEach(function(e){e.classList.remove('cllift')});D.querySelectorAll('.clliftc').forEach(function(e){e.remove()});if(p){p.id='';p.classList.add('out');setTimeout(function(){p.remove()},180)}}
 function pop(html,pos,origin,dim){closePop();var v=D.createElement('div');v.id='clveil';B.appendChild(v);if(dim)requestAnimationFrame(function(){v.classList.add('dim')});
  var p=D.createElement('div');p.id='clpop';p.className='clpop';p.innerHTML=html;for(var k in pos)p.style[k]=pos[k];p.style.transformOrigin=origin;B.appendChild(p);
  if(p.animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches)p.animate([{transform:'scale(.88)',opacity:0},{transform:'none',opacity:1}],{duration:333,easing:SPR});return p}
 function mi(g,icn,t,cls,ex){var a=g.indexOf('hc:')==0?'data-hc="'+g.slice(3)+'"':'data-cl="'+g+'"';return '<div class="clmi'+(cls?' '+cls:'')+'" '+a+(ex?' '+ex:'')+'>'+(icn?ic(icn):'<i class="clck"></i>')+'<span>'+t+'</span></div>'}
 function headMenu(){var s=st(),cap=D.querySelector('#clhd .clpill'),em=$i('clhd').classList.contains('clempty');if(em)cap=D.querySelector('#clhd .clone');if(!cap)return;var r=cap.getBoundingClientRect();
  var x='<div class="clmh">'+E(s.title||'Новый чат')+'</div>'+(s.msgs.length?mi('fwdlast','msend','Переслать'):'')+(s.rw?mi('hc:rename','medit','Переименовать'):'')+
   mi('hc:openpc','devices','Открыть на ПК')+mi('hc:menu','skills','Другие действия','','data-skip="openpc'+(s.rw?',ren':'')+'"')/*s4c-8*/;
  pop(x,{top:(r.bottom+8)+'px',right:(innerWidth-r.right)+'px',width:'250.3px'},'top right')}
 function lastIdx(u){var s=st();for(var i=s.msgs.length-1;i>=0;i--){if((s.msgs[i].k=='u')==u)return i}return -1}
 /* долгое нажатие (3213_0169.13): Copy / Send to / Select text (/ Edit — только Hermes) — меню над пузырём, фон темнеет */
 function msgMenu(i,el){var s=st(),b=s.msgs[i];if(!b)return;var r=el.getBoundingClientRect(),u=b.k=='u',x='';
  if(b.ts){var d=new Date(b.ts*1000),td=new Date();x+='<div class="clmh">'+(d.toDateString()==td.toDateString()?'Сегодня':d.toLocaleDateString('ru-RU',{day:'numeric',month:'long'}))+', '+d.toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})+'</div>'}
  x+=mi('hc:copy','mcopy','Копировать','','data-b="'+i+'"')+mi('hc:fwd','msend','Переслать','','data-b="'+i+'"')+mi('hc:seltx','msel','Выделить текст','','data-b="'+i+'"');
  /* 3213_0169.13: пузырь поднят над размытым фоном и переложен шире — 27.3–376.3 pt (обычный максимум 318); меню над ним, зазор 18 */
  var row=el.closest('[data-mi]');if(row)row.classList.add('cllift');
  var c=null;if(u&&el.classList.contains('club')){c=el.cloneNode(true);c.classList.add('clliftc');c.style.width='';c.style.top=r.top+'px';c.style.right=(innerWidth-r.right)+'px';B.appendChild(c);r=c.getBoundingClientRect();
   c.style.top=Math.max(70,Math.min(r.top,innerHeight-r.height-90))+'px';r=c.getBoundingClientRect()}
  var hgt=42*3+18+(b.ts?30:0),top=r.top-hgt-18;if(top<70)top=Math.min(r.bottom+18,innerHeight-hgt-20);
  pop(x,{top:top+'px',left:u?'auto':'16px',right:u?'16px':'auto',width:'250.3px'},u?'bottom right':'bottom left',true);
  /* pop() начинает с closePop() — подъём вернуть после него */if(row)row.classList.add('cllift');if(c)B.appendChild(c)}
 function loadModels(cb){var s=st();if(s.models){cb&&cb();return}
  fetch(API.replace(/\/$/,'')+'/api/hc/cc/models',{headers:{'X-Init-Data':W.tg?tg.initData:''}}).then(function(r){return r.json()}).then(function(d){if(d&&d.p){s.models=s.models||d;cb&&cb()}}).catch(function(){})}
 /* чип «модель сила» (3212_0014.24: «Opus 5.5 Medium») → меню того же стекла: модели и сила */
 function chipMenu(){var s=st(),ch=$i('clchip'),r=(ch||$i('clc')).getBoundingClientRect(),M=s.models,cur=s.msel&&s.msel.m,e=(s.msel&&s.msel.e)||'',x='<div class="clmh">Модель</div>';
  if(!M){x+='<div class="clmh">Загружаю…</div>';loadModels(function(){if($i('clpop'))chipMenu()})}
  else{var pv=M.p[0];x+='<div class="clmi" data-hc="mdef"><i class="clck"></i><span>'+(cur?'':'✓ ')+'По умолчанию</span></div>';
   (pv?pv.m:[]).forEach(function(m){x+='<div class="clmi" data-hc="mpick" data-m="'+E(m)+'" data-p="'+E(pv.slug)+'"><i class="clck"></i><span>'+(cur==m?'✓ ':'')+E(HC.pretty(m))+'</span></div>'})}
  x+='<div class="clmh">Сила работы</div>';['','low','medium','high'].forEach(function(k){x+='<div class="clmi" data-hc="epick" data-e="'+k+'"><i class="clck"></i><span>'+(k==e?'✓ ':'')+EFF[k]+'</span></div>'});
  pop(x,{left:Math.max(8,r.left-8)+'px',bottom:(innerHeight-r.top+10)+'px',width:'250.3px'},'bottom left')}
 /* ---------- лист «+» (§5): плавающий, «Добавить в сессию», группы строк ---------- */
 function sheetClose(){var v=$i('clsv'),s=$i('clsh');if(v)v.remove();if(s){s.id='';s.classList.add('out');setTimeout(function(){s.remove()},160)}}
 /* s4b-3c: «+» при открытой клавиатуре — сначала клавиатура уходит, потом лист (видео 243.0) */
 function plusSheet(){var ta=$i('hcin');if(B.classList.contains('hckb')&&ta&&D.activeElement===ta){var t0=Date.now(),h0=rb();ta.blur();
   (function w(){if($i('clsh'))return;var moved=Math.abs(rb()-h0)>40;if(!moved&&Date.now()-t0<450)return requestAnimationFrame(w);setTimeout(function(){if(!$i('clsh')&&on())plusSheet1()},moved?80:0)})();return}
  plusSheet1()}
 function plusSheet1(){sheetClose();var s=st(),ml=s.msel&&s.msel.m?HC.pretty(s.msel.m):'По умолчанию',ef=EFF[(s.msel&&s.msel.e)||'']||'Авто',pm=PERM[s.perm||'pc']||PERM.pc;
  var v=D.createElement('div');v.id='clsv';B.appendChild(v);var sh=D.createElement('div');sh.id='clsh';sh.className='clsh';
  sh.innerHTML='<div class="clgrab"></div><div class="clshh"><div class="clqx" data-cl="shx" role="button" aria-label="Закрыть">'+ic('x')+'</div><b>Добавить в сессию</b><label for="hcfile" data-cl="sphoto">Фото</label></div>'+
   '<div class="clstrip"><label for="hcfile" data-cl="sphoto">'+ic('files')+'<span>Фото</span></label>'+(s.imgs||[]).map(function(u){return '<img src="'+E(u)+'">'}).join('')+'</div>'+
   '<div class="clgrp"><label class="clsr" for="clcam" data-cl="sphoto">'+ic('camera')+'<span>Камера</span></label><label class="clsr" for="hcfile" data-cl="sphoto">'+ic('files')+'<span>Фото</span><em>до 20</em></label></div>'+
   '<div class="clgrp"><div class="clsr" data-cl="smodel">'+ic('skills')+'<span>Модель</span><em>'+E(ml)+'</em>'+ic('chev')+'</div><div class="clsr" data-cl="seff">'+ic('research')+'<span>Сила работы</span><em>'+E(ef)+'</em>'+ic('chev')+'</div></div>'+
   (s.rw?'':'<div class="clgrp"><div class="clsr" data-cl="sperm">'+ic('perm')+'<span>Права</span><em>'+E(pm)+'</em>'+ic('chev')+'</div></div>');
  B.appendChild(sh);
  /* §8: лист появляется ≈ 500 мс без отскока, затемнение за 230 мс */
  if(sh.animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches)sh.animate([{transform:'translateY(105%)'},{transform:'none'}],{duration:500,easing:'cubic-bezier(.32,.72,0,1)'})}
 function permMenu(){var s=st(),r=$i('clc').getBoundingClientRect(),x='<div class="clmh">Права в этом чате</div>';
  ['pc','full','ask'].forEach(function(k){x+='<div class="clmi" data-hc="perm" data-v="'+k+'"><i class="clck"></i><span>'+((s.perm||'pc')==k?'✓ ':'')+PERM[k]+'</span></div>'});
  pop(x,{left:'16px',bottom:(innerHeight-r.top+10)+'px',width:'250.3px'},'bottom left')}
 /* ---------- вслух ---------- */
 function speak(i){var s=st();try{var ss=W.speechSynthesis;if(!ss){T('Чтение вслух недоступно');return}
  if(G.spk==i){ss.cancel();G.spk=-1;feed();return}ss.cancel();var u=new SpeechSynthesisUtterance(txt(s.msgs[i]).replace(/[#*`>_|]/g,'').slice(0,4000));u.lang='ru-RU';
  u.onend=u.onerror=function(){if(G.spk==i){G.spk=-1;feed()}};G.spk=i;ss.speak(u);feed()}catch(e){T('Чтение вслух недоступно')}}
 /* ---------- главная перерисовка ---------- */
 var busyDraw=false;
 function draw(){if(busyDraw)return;busyDraw=true;try{
  /* классы body — только при реальной смене (иначе мутация будит наблюдатель chat.js, и модули будят друг друга без конца) */
  var g=$i('cl3');if(!on()){if(g)g.remove();if(B.classList.contains('cl3on'))B.classList.remove('cl3on');stopWave();busyDraw=false;MO.takeRecords();return}
  if(!B.classList.contains('cl3on'))B.classList.add('cl3on');frame();adopt();feed();comp();qcard();dnUpd();
  var s=st(),em=!s.msgs.length&&!s.busy;$i('clhd').classList.toggle('clempty',em);
  }catch(e){console.error(e)}busyDraw=false;MO.takeRecords()}
 var qd=0;function sched(){if(qd)return;qd=requestAnimationFrame(function(){qd=0;draw()})}
 var MO=new MutationObserver(function(L){for(var i=0;i<L.length;i++){var t=L[i].target;if(t.id!='hcsend'&&t.closest&&t.closest('#cll,#cldict,#clpop,#cltr,#clhd,#clqw,#clsh,.clpop,#clhi,#clchip'))continue;draw();return}});
 MO.observe(B,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
 D.addEventListener('input',function(e){if(e.target&&e.target.id=='hcin'&&on())comp()},false);
 D.addEventListener('focusin',function(e){if(e.target&&e.target.id=='hcin'&&on())setTimeout(comp,0)},true);
 D.addEventListener('focusout',function(e){if(e.target&&e.target.id=='hcin')setTimeout(function(){on()&&comp()},120)},true);
 W.addEventListener('resize',function(){if(on()){pad();dnUpd();hello()}});
 if(W.visualViewport)visualViewport.addEventListener('resize',function(){on()&&pad()});
 if(typeof W.vcUi=='function'){var _ui=W.vcUi;W.vcUi=function(){var r=_ui.apply(this,arguments);if(on())comp();return r}}
 if(typeof W.vcSet=='function'){var _set=W.vcSet;W.vcSet=function(){var r=_set.apply(this,arguments);if(on()){comp();trUpd(G.show!==false)}return r}}
 /* удержание 🎤 = запись, отпустил = отправить («Release to send», 3213_0083.14) */
 var HOLD={t:0,on:false,sw:false};
 D.addEventListener('pointerdown',function(e){var m=e.target.closest&&e.target.closest('#cl3 [data-cl=mic]');if(!m||rec())return;
  HOLD.on=false;clearTimeout(HOLD.t);HOLD.t=setTimeout(function(){if(W.vcStart&&!VC.rec){HOLD.on=true;HOLD.sw=true;G.hold=true;haptic();vcStart();comp()}},320)},true);
 function holdEnd(){clearTimeout(HOLD.t);if(HOLD.on){HOLD.on=false;G.hold=false;setTimeout(function(){if(W.VC&&VC.rec)sendAfter();comp()},150);setTimeout(function(){HOLD.sw=false},400)}}
 D.addEventListener('pointerup',holdEnd,true);D.addEventListener('pointercancel',holdEnd,true);
 W.addEventListener('contextmenu',function(e){if(e.target.closest&&e.target.closest('#cl3 [data-cl=mic],#cldict,#cl3 .clum,#cl3 .clta'))e.preventDefault()},true);
 var LP={t:0,x:0,y:0,fired:0};
 D.addEventListener('pointerdown',function(e){LP.fired=0;var m=e.target.closest&&e.target.closest('#cll .club,#cll .cla');if(!m)return;var row=m.closest('[data-mi]');if(!row)return;
  LP.x=e.clientX;LP.y=e.clientY;clearTimeout(LP.t);LP.t=setTimeout(function(){LP.t=0;LP.fired=Date.now();haptic();var b=row.classList.contains('clum')?row.querySelector('.club'):m;
   /* «нажатие» перед меню (3212 125.97): ≈1.004 и обратно за 200 мс */
   if(b.animate)b.animate([{transform:'scale(1)'},{transform:'scale(1.03)'},{transform:'scale(1)'}],{duration:260,easing:'cubic-bezier(.3,1.4,.5,1)'});msgMenu(+row.dataset.mi,b)},480)},true);
 D.addEventListener('pointermove',function(e){if(LP.t&&Math.hypot(e.clientX-LP.x,e.clientY-LP.y)>8){clearTimeout(LP.t);LP.t=0}},true);
 D.addEventListener('pointerup',function(){clearTimeout(LP.t);LP.t=0},true);
 function hcDo(a,ds){var d=D.createElement('i');d.dataset.hc=a;for(var k in (ds||{}))d.dataset[k]=ds[k];d.style.display='none';(root()||B).appendChild(d);d.click();if(d.parentNode)d.remove()}
 /* ---------- клики ---------- */
 W.addEventListener('click',function(e){
  if(LP.fired){var fr=Date.now()-LP.fired<700;LP.fired=0;if(fr&&e.target.closest&&e.target.closest('#cll')){e.stopImmediatePropagation();e.preventDefault();return}}
  if(HOLD.sw&&e.target.closest&&e.target.closest('[data-cl=mic]')){HOLD.sw=false;e.stopImmediatePropagation();e.preventDefault();return}
  var cp=e.target.closest&&e.target.closest('#cl3 [data-clc]');
  if(cp){setTimeout(function(){var o=cp.innerHTML;cp.innerHTML=W.G3?G3.ic('check'):'✓';cp.classList.add('ok');setTimeout(function(){cp.innerHTML=o;cp.classList.remove('ok')},1600)},20)}
  if(e.target.closest&&e.target.closest('.clpop [data-hc],.clsh [data-hc]')){setTimeout(function(){closePop();sheetClose()},0);return}
  if(e.target.id=='clveil'){closePop();e.stopPropagation();e.preventDefault();return}
  if(e.target.id=='clsv'){sheetClose();e.stopPropagation();e.preventDefault();return}
  var el=e.target.closest&&e.target.closest('[data-cl]');if(!el||!(el.closest('#cl3')||el.closest('.clpop')||el.closest('.clsh')))return;
  var g=el.dataset.cl,s=st();if(!s)return;
  if(g=='sphoto'){setTimeout(sheetClose,0);return}
  e.stopPropagation();e.preventDefault();
  if(el.closest('.clpop'))closePop();
  switch(g){
   case 'side':if(W.SD3)SD3.open();else hcDo('back');break;   // gpt17: ☰ = боковое меню (side.js)
   case 'new':hcDo('new');break;
   case 'pc':hcDo('openpc');break;
   case 'menu':W.CL3.headMenu();break;
   case 'plus':plusSheet();break;
   case 'shx':sheetClose();break;
   case 'smodel':case 'chip':sheetClose();setTimeout(function(){W.CL3.chipMenu()},g=='chip'?0:170);break;
   case 'seff':sheetClose();setTimeout(function(){(W.CL3.effMenu||W.CL3.chipMenu)()},170);break;
   case 'sperm':sheetClose();setTimeout(permMenu,170);break;
   case 'down':{var f=$i('clf');f.scrollTo({top:f.scrollHeight,behavior:'smooth'});break}
   case 'mic':if(W.vcStart&&!rec()){G.voice=false;vcStart();comp()}break;
   case 'go':{if(rec())break;var sb=$i('hcsend');if(has()){doSend();break}if(live()){if(sb)sb.click();break}if(W.vcStart){G.voice=true;vcStart();comp()}break}
   case 'dcancel':abortRec();break;
   case 'dstop':if(G.voice)sendAfter();else if(VC.rec)vcStop();break;
   case 'dsend':sendAfter();break;
   case 'wave':case 'trtap':G.show=G.show===false;trUpd(G.show!==false);break;
   case 'worked':{var i=+el.dataset.i;if(i<0)break;G.open[i]=!G.open[i];feed();break}
   case 'tres':{var k2=el.dataset.k;G.open[k2]=!G.open[k2];feed();break}
   case 'fb':{var k=s.sid+':'+el.dataset.i;G.fb[k]=G.fb[k]==el.dataset.v?'':el.dataset.v;try{localStorage.setItem('clfb',JSON.stringify(G.fb))}catch(x){}haptic();feed();break}
   case 'speak':speak(+el.dataset.i);break;
   case 'fwdlast':{var li=lastIdx(false);if(li<0)li=lastIdx(true);if(li>=0)HC.fwdStart(li);else T('Пока нечего пересылать');break}
   case 'qmin':{var p=s.pend[+el.dataset.i];if(p){G.qmin[p.id||+el.dataset.i]=1;draw()}break}
   case 'qopen':{var p2=s.pend[+el.dataset.i];if(p2){delete G.qmin[p2.id||+el.dataset.i];draw()}break}
   case 'qpick':{var p3=s.pend[+el.dataset.i],kk=p3&&(p3.id||+el.dataset.i);if(p3){G.qsel[kk]=G.qsel[kk]===el.dataset.j?undefined:el.dataset.j;draw()}break}
   case 'qsend':{var i4=+el.dataset.i,p4=s.pend[i4],k4=p4&&(p4.id||i4),inp=$i('hcclar'),own=inp&&inp.value.trim();if(!p4)break;
    if(own){hcDo('clarify',{i:i4})}else if(G.qsel[k4]!=null){var o=optOf((p4.opts||[])[+G.qsel[k4]]);hcDo('clarop',{i:i4,v:(p4.opts||[])[+G.qsel[k4]]&&typeof p4.opts[+G.qsel[k4]]=='string'?p4.opts[+G.qsel[k4]]:o.t})}else{T('Выбери вариант или напиши ответ');break}
    delete G.qsel[k4];break}
   case 'qmic':{var inp2=$i('hcclar');if(inp2)inp2.focus();T('Для голоса — микрофон в поле ответа телефона');break}
  }},true);
 D.addEventListener('change',function(e){if(e.target.id!='clcam'||!e.target.files||!e.target.files.length)return;var f=$i('hcfile');if(!f)return;
  try{var dt=new DataTransfer();for(var i=0;i<e.target.files.length;i++)dt.items.add(e.target.files[i]);f.files=dt.files;f.dispatchEvent(new Event('change',{bubbles:true}))}catch(x){T('Камера недоступна, выбери фото')}e.target.value=''},true);
 D.addEventListener('keydown',function(e){if(e.target.id=='hcin'&&on()&&e.key=='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();e.stopImmediatePropagation();if(has())doSend()}},true);
 W.CL3={draw:draw,G:G,fade:FADE,relayout:function(){if(on()){pad();dnUpd();hello()}},abort:abortRec,sendAfter:sendAfter,wave:function(){return WV},plusSheet:plusSheet,sheetClose:sheetClose,headMenu:headMenu,chipMenu:chipMenu,msgMenu:msgMenu,closePop:closePop,ic:ic,
  fadeAt:function(ages){var l=$i('cll');if(!l)return;var n=performance.now();FADE.b=ages.map(function(a){return n-a});l.__h=null;var s=st();FADE.key=s.kind+':'+s.sid+':'+((l.querySelector('.clta.cllast')||{dataset:{}}).dataset.t||'');feed()}};
 sched();
})();
