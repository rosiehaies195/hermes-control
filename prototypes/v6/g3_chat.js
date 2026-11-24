/* gpt3 — экран чата ChatGPT iOS с нуля (решение (15), runbook panel-gpt gpt15-plan).
   НЕ слой поверх старой разметки: свой экран #g3 (шапка, лента, поле, диктовка, меню) рисуется сам из HC.st базы.
   От базы берутся только данные и действия: st.msgs/pend/imgs/busy, обработчик [data-hc] (send, stop, copy, appr,
   clarify, model, effort, rename, del, fwd, older…), textarea #hcin (на нём висят ввод, Enter, голос voice.js),
   input #hcfile (фото до 20) и #hcsend (состояние «Стоп»). Старая разметка чата остаётся скрытой.
   Hermes и Codex — ChatGPT iOS один к одному (эталон — запись экрана iPhone IMG_3214, 3 px = 1 pt).
   Claude пока остаётся прежним (потом тем же способом). */
(function(){
 var D=document,B=D.body,W=window;
 function $i(id){return D.getElementById(id)}
 function st(){return W.HC&&HC.st}
 function E(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
 function root(){return $i('hcroot')}
 function on(){var s=st();return !!(s&&W.U&&U.tab=='hc'&&s.view=='chat'&&root()&&s.kind!='claude'&&!D.documentElement.hasAttribute('data-g3off'))}
 function haptic(t){try{t=='ok'?tg.HapticFeedback.notificationOccurred('success'):tg.HapticFeedback.impactOccurred('light')}catch(e){}}
 function T(m){try{toast(m)}catch(e){}}
 var NM={hermes:'Hermes',codex:'Codex'},EFF={'':'Авто',low:'Низкая',medium:'Средняя',high:'Высокая'};
 /* ---------- значки 24×24, заливка (обводка по кадрам видео — g3icons) ---------- */
 var I={
  side:'<rect x="3.2" y="6.6" width="17.6" height="2" rx="1"/><rect x="3.2" y="14.6" width="11.4" height="2" rx="1"/>',
  pen:'<path d="M11.2 3.1a1 1 0 0 1 0 2H7.6c-1.4 0-2.4 1-2.4 2.4v8.9c0 1.4 1 2.4 2.4 2.4h8.9c1.4 0 2.4-1 2.4-2.4v-3.6a1 1 0 0 1 2 0v3.6c0 2.5-1.9 4.4-4.4 4.4H7.6c-2.5 0-4.4-1.9-4.4-4.4V7.5c0-2.5 1.9-4.4 4.4-4.4Z"/><path d="M18.3 2.6a2.6 2.6 0 0 1 3.7 3.7l-8.2 8.2a2 2 0 0 1-.9.5l-3.1.8a1 1 0 0 1-1.2-1.2l.8-3.1c.1-.3.3-.7.5-.9Zm2.2 1.4a.6.6 0 0 0-.8 0l-8.1 8.1-.4 1.3 1.3-.4 8.1-8.1a.6.6 0 0 0 0-.9Z"/>',
  dots:'<circle cx="5" cy="12" r="1.75"/><circle cx="12" cy="12" r="1.75"/><circle cx="19" cy="12" r="1.75"/>',
  plus:'<rect x="11" y="3.3" width="2" height="17.4" rx="1"/><rect x="3.3" y="11" width="17.4" height="2" rx="1"/>',
  mic:'<path d="M12 2.4a4 4 0 0 1 4 4v5.4a4 4 0 0 1-8 0V6.4a4 4 0 0 1 4-4Zm0 2a2 2 0 0 0-2 2v5.4a2 2 0 0 0 4 0V6.4a2 2 0 0 0-2-2Z"/><path d="M5.6 10.7a1 1 0 0 1 1 1 5.4 5.4 0 0 0 10.8 0 1 1 0 0 1 2 0 7.4 7.4 0 0 1-6.4 7.3v2.2a1 1 0 0 1-2 0V19a7.4 7.4 0 0 1-6.4-7.3 1 1 0 0 1 1-1Z"/>',
  voice:'<rect x="4.3" y="9.6" width="2.3" height="4.8" rx="1.15"/><rect x="8.6" y="6" width="2.3" height="12" rx="1.15"/><rect x="12.9" y="3.8" width="2.3" height="16.4" rx="1.15"/><rect x="17.2" y="8.2" width="2.3" height="7.6" rx="1.15"/>',
  up:'<path d="M11.3 4.3a1 1 0 0 1 1.4 0l6 6a1 1 0 1 1-1.4 1.4L13 7.4V19a1 1 0 1 1-2 0V7.4l-4.3 4.3a1 1 0 0 1-1.4-1.4Z"/>',
  down:'<path d="M12.7 19.7a1 1 0 0 1-1.4 0l-6-6a1 1 0 1 1 1.4-1.4l4.3 4.3V5a1 1 0 1 1 2 0v11.6l4.3-4.3a1 1 0 1 1 1.4 1.4Z"/>',
  stop:'<rect x="6.25" y="6.25" width="11.5" height="11.5" rx="2"/>',
  x:'<path d="M5.6 5.6a1 1 0 0 1 1.4 0l5 5 5-5a1 1 0 1 1 1.4 1.4l-5 5 5 5a1 1 0 0 1-1.4 1.4l-5-5-5 5a1 1 0 0 1-1.4-1.4l5-5-5-5a1 1 0 0 1 0-1.4Z"/>',
  copy:'<path d="M9.5 3h7A4.5 4.5 0 0 1 21 7.5v7a2.5 2.5 0 0 1-2.5 2.5H17v1.5A2.5 2.5 0 0 1 14.5 21h-9A2.5 2.5 0 0 1 3 18.5v-9A2.5 2.5 0 0 1 5.5 7H7V5.5A2.5 2.5 0 0 1 9.5 3ZM9 7h5.5A2.5 2.5 0 0 1 17 9.5V15h1.5a.5.5 0 0 0 .5-.5v-7A2.5 2.5 0 0 0 16.5 5h-7a.5.5 0 0 0-.5.5Zm-3.5 2a.5.5 0 0 0-.5.5v9c0 .3.2.5.5.5h9c.3 0 .5-.2.5-.5v-9a.5.5 0 0 0-.5-.5Z"/>',
  like:'<path d="M12.1 2.6a2.9 2.9 0 0 1 2.7 3.7l-.7 2.6h3.7a3.1 3.1 0 0 1 3 3.8l-1.4 6.1A3.9 3.9 0 0 1 15.6 22H8.3a2 2 0 0 1-1.6.8H4.5A1.9 1.9 0 0 1 2.6 21v-9.4c0-1 .9-1.9 1.9-1.9h3.2Zm-.3 2-3.4 6.5V20h7.2a1.9 1.9 0 0 0 1.9-1.5l1.4-6.1a1.1 1.1 0 0 0-1.1-1.4h-5a1 1 0 0 1-1-1.3l1-3.8a.9.9 0 0 0-1-1.2ZM6.4 11.7H4.6v9h1.8Z"/>',
  dislike:'<path d="M11.9 21.4a2.9 2.9 0 0 1-2.7-3.7l.7-2.6H6.2a3.1 3.1 0 0 1-3-3.8l1.4-6.1A3.9 3.9 0 0 1 8.4 2h7.3a2 2 0 0 1 1.6-.8h2.2c1 0 1.9.8 1.9 1.8v9.4c0 1-.9 1.9-1.9 1.9h-3.2Zm.3-2 3.4-6.5V4H8.4a1.9 1.9 0 0 0-1.9 1.5L5.1 11.6a1.1 1.1 0 0 0 1.1 1.4h5a1 1 0 0 1 1 1.3l-1 3.8a.9.9 0 0 0 1 1.3Zm5.4-7.1h1.8v-9h-1.8Z"/>',
  speak:'<path d="M10.6 4.2c1.2-.9 2.9 0 2.9 1.5v12.6c0 1.5-1.7 2.4-2.9 1.5L6.7 17H5.2a2.6 2.6 0 0 1-2.6-2.6V9.6A2.6 2.6 0 0 1 5.2 7h1.5Zm.9 1.9L7.8 8.8a1 1 0 0 1-.6.2h-2a.6.6 0 0 0-.6.6v4.8c0 .3.3.6.6.6h2a1 1 0 0 1 .6.2l3.7 2.7Z"/><path d="M16.2 8.4a1 1 0 0 1 1.4.2 5.7 5.7 0 0 1 0 6.8 1 1 0 1 1-1.6-1.2 3.7 3.7 0 0 0 0-4.4 1 1 0 0 1 .2-1.4Z"/><path d="M19.1 5.8a1 1 0 0 1 1.4.1 9.6 9.6 0 0 1 0 12.2 1 1 0 1 1-1.5-1.3 7.6 7.6 0 0 0 0-9.6 1 1 0 0 1 .1-1.4Z"/>',
  share:'<path d="M11.3 2.8a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1-1.4 1.4L13 5.9V15a1 1 0 1 1-2 0V5.9L8.7 8.2a1 1 0 0 1-1.4-1.4Z"/><path d="M5 12a1 1 0 0 1 1 1v4.5c0 1 .7 1.7 1.7 1.7h8.6c1 0 1.7-.7 1.7-1.7V13a1 1 0 1 1 2 0v4.5a3.7 3.7 0 0 1-3.7 3.7H7.7A3.7 3.7 0 0 1 4 17.5V13a1 1 0 0 1 1-1Z"/>',
  chev:'<path d="M9.3 5.3a1 1 0 0 1 1.4 0l6 6a1 1 0 0 1 0 1.4l-6 6a1 1 0 0 1-1.4-1.4l5.3-5.3-5.3-5.3a1 1 0 0 1 0-1.4Z"/>',
  check:'<path d="M19.7 6.3a1 1 0 0 1 0 1.4l-10 10a1 1 0 0 1-1.4 0l-5-5a1 1 0 1 1 1.4-1.4l4.3 4.3 9.3-9.3a1 1 0 0 1 1.4 0Z"/>',
  photo:'<path d="M6.5 3.5h11a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3h-11a3 3 0 0 1-3-3v-11a3 3 0 0 1 3-3Zm0 2a1 1 0 0 0-1 1v8.6l3.3-3.3a1.6 1.6 0 0 1 2.3 0l5.6 5.7h1.8a1 1 0 0 0 1-1v-11a1 1 0 0 0-1-1Zm8.8 2.2a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6Z"/>',
  model:'<path d="M12 2.5a1 1 0 0 1 .95.68l1.6 4.77 4.77 1.6a1 1 0 0 1 0 1.9l-4.77 1.6-1.6 4.77a1 1 0 0 1-1.9 0l-1.6-4.77-4.77-1.6a1 1 0 0 1 0-1.9l4.77-1.6 1.6-4.77A1 1 0 0 1 12 2.5Z"/>',
  bulb:'<path d="M12 2.5a7 7 0 0 1 4 12.7V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-1.8A7 7 0 0 1 12 2.5Zm0 2a5 5 0 0 0-2.7 9.2 1 1 0 0 1 .7.9V17h4v-2.4a1 1 0 0 1 .5-.9A5 5 0 0 0 12 4.5Z"/><rect x="9" y="20" width="6" height="2" rx="1"/>',
  pin:'<path d="M15.3 2.9a1 1 0 0 1 1.4 0l4.4 4.4a1 1 0 0 1 0 1.4 3 3 0 0 1-3 .8l-2.6 2.6.4 3.3a1 1 0 0 1-.3.8l-1.2 1.2a1 1 0 0 1-1.4 0l-3-3-4.2 4.2a1 1 0 0 1-1.4-1.4l4.2-4.2-3-3a1 1 0 0 1 0-1.4L6.8 7.4a1 1 0 0 1 .8-.3l3.3.4 2.6-2.6a3 3 0 0 1 .8-3Z"/>',
  edit:'<path d="M16.6 3.4a2.7 2.7 0 0 1 3.9 3.9L8.9 18.9a2 2 0 0 1-.9.5l-4 1a1 1 0 0 1-1.2-1.2l1-4a2 2 0 0 1 .5-.9Zm2.5 1.4a.7.7 0 0 0-1 0L6.5 16.4l-.6 2.2 2.2-.6L19.1 5.8a.7.7 0 0 0 0-1Z"/>',
  arch:'<path d="M4.5 3.5h15a2 2 0 0 1 2 2v2a2 2 0 0 1-1 1.7v8.8a3 3 0 0 1-3 3h-11a3 3 0 0 1-3-3V9.2a2 2 0 0 1-1-1.7v-2a2 2 0 0 1 2-2Zm1 6V18a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V9.5Zm-1-4v2h15v-2ZM10 12h4a1 1 0 1 1 0 2h-4a1 1 0 1 1 0-2Z"/>',
  trash:'<path d="M10 2.5h4a2 2 0 0 1 2 2V5h4a1 1 0 1 1 0 2h-1v12a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V7H4a1 1 0 0 1 0-2h4v-.5a2 2 0 0 1 2-2ZM7 7v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7Zm3-2.5V5h4v-.5ZM10 10a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1Zm4 0a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1Z"/>',
  retry:'<path d="M12 4a8 8 0 0 1 7.4 4.9 1 1 0 1 1-1.8.8A6 6 0 1 0 18 12a1 1 0 1 1 2 0 8 8 0 1 1-8-8Z"/><path d="M19 3.5a1 1 0 0 1 1 1V9a1 1 0 0 1-1 1h-4.5a1 1 0 1 1 0-2H18V4.5a1 1 0 0 1 1-1Z"/>',
  sel:'<path d="M4 5a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2h-6v13a1 1 0 1 1-2 0V6H5a1 1 0 0 1-1-1Z"/>',
  more:'<path d="M5 6h14a1 1 0 1 1 0 2H5a1 1 0 0 1 0-2Zm0 5h14a1 1 0 1 1 0 2H5a1 1 0 0 1 0-2Zm0 5h9a1 1 0 1 1 0 2H5a1 1 0 0 1 0-2Z"/>',
  shield:'<path d="M12 2.3a1 1 0 0 1 .4.1l7 3a1 1 0 0 1 .6.9v4.8c0 5-3.2 8.7-7.6 10.5a1 1 0 0 1-.8 0C7.2 19.8 4 16.1 4 11.1V6.3a1 1 0 0 1 .6-.9l7-3a1 1 0 0 1 .4-.1Zm0 2.1L6 7v4.1c0 3.9 2.4 6.9 6 8.4 3.6-1.5 6-4.5 6-8.4V7Z"/>',
  camera:'<path d="M9.2 3.5h5.6a2 2 0 0 1 1.7 1L17.5 6H19a3 3 0 0 1 3 3v8.5a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3h1.5l1-1.5a2 2 0 0 1 1.7-1Zm0 2L7.9 7.4a1 1 0 0 1-.8.6H5a1 1 0 0 0-1 1v8.5a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-2.1a1 1 0 0 1-.8-.6l-1.3-1.9ZM12 9a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/>',
  ask:'<path d="M12 2.5a9.5 9.5 0 1 1-4.6 17.8l-3.5.9a1 1 0 0 1-1.2-1.2l.9-3.5A9.5 9.5 0 0 1 12 2.5Zm0 2a7.5 7.5 0 0 0-6.4 11.4 1 1 0 0 1 .1.8l-.5 2.1 2.1-.5a1 1 0 0 1 .8.1A7.5 7.5 0 1 0 12 4.5Z"/>'};
 /* значки из кадров видео (icons.js, размер в pt как в кадре) важнее нарисованных */
 function ic(n,c){var v=W.G3V&&G3V[n];if(v)return '<svg class="g3v g3v-'+n+(c?' '+c:'')+'" width="'+v[0]+'" height="'+v[1]+'" viewBox="0 0 '+v[0]+' '+v[1]+'" aria-hidden="true"><path d="'+v[2]+'"/></svg>';
  return '<svg class="g3i'+(c?' '+c:'')+'" viewBox="0 0 24 24" aria-hidden="true">'+(I[n]||'')+'</svg>'}
 var G={voice:false,sendAfter:false,hold:false,show:true,fb:{},spk:-1,sent:[],ed:null,open:{}};
 try{G.fb=JSON.parse(localStorage.getItem('g3fb')||'{}')}catch(e){}
 /* ---------- каркас экрана ---------- */
 function frame(){var r=root(),g=$i('g3');
  if(g&&g.parentNode===r)return g;
  if(g)g.remove();
  g=D.createElement('div');g.id='g3';g.className='g3';
  g.innerHTML='<div class="g3f" id="g3f"><div class="g3l" id="g3l"></div></div>'+
   '<div class="g3top"></div><div class="g3hd" id="g3hd"><div class="g3gl g3b44" data-g3="side" role="button" aria-label="Все чаты">'+ic('side')+'</div><div class="g3sp"></div>'+
   '<div class="g3gl g3cap"><i data-g3="new" role="button" aria-label="Новый чат">'+ic('pen')+'</i><i data-g3="menu" role="button" aria-label="Меню чата">'+ic('dots')+'</i></div></div>'+
   '<div class="g3dn g3gl" id="g3dn" data-g3="down" role="button" aria-label="Вниз">'+ic('down')+'</div>'+
   '<div class="g3sg" id="g3sg"></div><div class="g3tr" id="g3tr" data-g3="trtap"></div><div class="g3hold" id="g3hold">Отпусти, чтобы отправить</div>'+
   '<div class="g3c g3gl" id="g3c"><div class="g3th" id="g3th"></div><div class="g3row"><div class="g3plus" data-g3="plus" role="button" aria-label="Добавить">'+ic('plus')+'</div>'+
   '<div class="g3ta" id="g3ta"></div><div class="g3mic" data-g3="mic" role="button" aria-label="Диктовка">'+ic('mic')+'</div><div class="g3go" id="g3go" data-g3="go" role="button"></div></div>'+
   '<div class="g3exp" data-g3="expand" role="button" aria-label="Развернуть поле">'+ic('expand')+'</div><div class="g3dict" id="g3dict"></div><div class="g3hide" id="g3hide"><input id="g3cam" type="file" accept="image/*" capture="environment"></div></div>';
  r.appendChild(g);
  $i('g3f').addEventListener('scroll',dnUpd,{passive:true});
  /* поле едет вместе с клавиатурой (переход 0.33 с) — пересчитать отступы ленты, «вниз» и подсказки по его концу */
  $i('g3c').addEventListener('transitionend',function(e){if(e.target.id=='g3c')pad()});
  return g}
 /* узлы базы, без которых не работают ввод/голос/фото/стоп: переносим в свой экран */
 function adopt(){var ta=$i('hcin'),slot=$i('g3ta'),hide=$i('g3hide'),fl=$i('hcfile'),sb=$i('hcsend'),th=$i('hcthumbs'),ch=$i('hcchips');
  if(ta&&slot&&ta.parentNode!==slot){slot.appendChild(ta);ta.setAttribute('rows','1')}
  [fl,sb,ch].forEach(function(n){if(n&&hide&&n.parentNode!==hide)hide.appendChild(n)});
  if(th&&th.parentNode!==$i('g3th'))$i('g3th').appendChild(th);
  if(ta){var ph='Спросить '+(NM[st().kind]||'');if(ta.placeholder!=ph)ta.placeholder=ph}
  /* s2-5: сессия только для чтения (cron, Telegram) — поля нет: вместо пустой пилюли кнопка копии, подсказки пустого чата не показываем */
  var g=$i('g3'),rb=slot&&slot.querySelector('.g3rob');if(g&&g.classList.contains('g3ro')!=!ta)g.classList.toggle('g3ro',!ta);
  if(!ta&&slot&&!rb)slot.innerHTML='<div class="g3rob" data-hc="fork" role="button">Продолжить здесь (копия)</div>';else if(ta&&rb)rb.remove()}
 /* ---------- лента ---------- */
 /* cb5: разметка одного и того же текста не пересчитывается на каждом токене стрима */
 var MDC=Object.create(null),MDN=0;function md(t){var k=String(t==null?'':t),v=MDC[k];if(v!==undefined)return v;try{v=HC.md(k)}catch(e){v=E(k)}
  if(k.length<30000){if(++MDN>300){MDC=Object.create(null);MDN=1}MDC[k]=v}return v}
 function txt(b){if(!b)return '';if(b.k=='u')return b.t||'';return (b.parts||[]).filter(function(p){return p.p=='t'}).map(function(p){return p.t}).join('\n\n')}
 function dur(s){s=Math.max(1,Math.round(s));return s<60?s+' с':Math.floor(s/60)+' мин'+(s%60?' '+s%60+' с':'')}
 function toolName(p){var a={};try{a=JSON.parse(p.a||'{}')}catch(e){}var x=a.command||a.cmd||a.path||a.file_path||a.query||a.url||a.pattern||'';
  return '<b>'+E(p.n||'действие')+'</b>'+(x?' <span>'+E(String(x).replace(/\s+/g,' ').slice(0,90))+'</span>':'')}
 /* ход = сообщение пользователя + все ответы агента до следующего сообщения пользователя */
 function turns(){var s=st(),L=[],from=Math.max(0,s.msgs.length-s.lim),cur=null,lastU=null;
  for(var i=from;i<s.msgs.length;i++){var b=s.msgs[i];
   if(b.k=='u'){cur=null;lastU=b;L.push({u:b,i:i});continue}
   if(!cur){cur={a:[],ai:[],ts0:lastU?lastU.ts:b.ts};L.push(cur)}
   cur.a.push(b);cur.ai.push(i)}
  return {L:L,from:from}}
 function thinking(t){var lab='',last=null;(t.a||[]).forEach(function(b){(b.parts||[]).forEach(function(p){if(p.p=='tool')last=p})});
  if(last){var n=last.n||'';lab=last.st!='run'?'Думаю':n=='terminal'?'Выполняю команду':/search|grep/.test(n)?'Ищу':/read|file/.test(n)?'Читаю файлы':/browser/.test(n)?'Смотрю страницу':'Работаю'}
  /* ожидание первого ответа — пульсирующая точка (кадры 0039.83, 0091.24), дальше — статус с бегущей тенью (0057–0061) */
  if(!lab)return '<div class="g3dot"><i></i></div>';
  return '<div class="g3think"><span>'+E(lab)+'</span></div>'}
 function turnA(t,lv,lastTurn){var s=st(),h='',tools=[],tx=[],ti=-1;
  t.a.forEach(function(b,k){(b.parts||[]).forEach(function(p){if(p.p=='tool')tools.push(p);else if(p.p=='t'&&p.t&&p.t.trim()){tx.push(p.t);ti=t.ai[k]}})});
  /* li — последнее сообщение хода (раскрытие «Работал»), ti — последнее с текстом (копировать, переслать, вслух, меню) */
  var lastA=t.a[t.a.length-1],li=t.ai[t.ai.length-1],sec=(lastA.ts||0)-(t.ts0||lastA.ts||0);
  if(tools.length&&!(lv&&!tx.length)){var op=!!G.open[li];
   h+='<div class="g3wk'+(op?' on':'')+'" data-g3="worked" data-i="'+li+'">'+(sec>=1?'Работал '+dur(sec):'Действий: '+tools.length)+ic('chev')+'</div>';
   /* раскрытый список действий; тап по действию — его вывод (как раньше в старом экране) */
   if(op)h+='<div class="g3tl">'+tools.map(function(p,j){var k=li+':'+j,o=!!G.open[k],res=String(p.res||'');try{var J=JSON.parse(res);res=J.output!=null?String(J.output)+(J.error?'\n'+J.error:''):res}catch(e){}
    return '<div class="g3to'+(p.st=='err'?' bad':'')+'" data-g3="tres" data-k="'+k+'">'+toolName(p)+'</div>'+(o?'<pre class="g3pre">'+E(res.slice(0,4000)||'(пусто)')+'</pre>':'')}).join('')+'</div>'}
  tx.forEach(function(x){h+='<div class="g3a">'+md(x)+'</div>'});
  var lp=lastA.parts||[];
  if(lv&&(!tx.length||lp.length&&lp[lp.length-1].p=='tool'))h+=thinking(t);
  if(!lv&&tx.length){var fb=G.fb[s.sid+':'+ti]||'';li=ti;
   h+='<div class="g3act"><i data-hc="copy" data-b="'+li+'" data-g3c="1" role="button" aria-label="Копировать">'+ic('copy')+'</i>'+
    '<i data-g3="fb" data-v="up" data-i="'+li+'" class="'+(fb=='up'?'on':'')+'" role="button" aria-label="Хороший ответ">'+ic('like')+'</i>'+
    '<i data-g3="fb" data-v="dn" data-i="'+li+'" class="'+(fb=='dn'?'on':'')+'" role="button" aria-label="Плохой ответ">'+ic('dislike')+'</i>'+
    '<i data-g3="speak" data-i="'+li+'" class="'+(G.spk==li?'on':'')+'" role="button" aria-label="Прочитать вслух">'+ic('speak')+'</i>'+
    '<i data-hc="fwd" data-b="'+li+'" role="button" aria-label="Переслать">'+ic('share')+'</i>'+
    '<i data-g3="amenu" data-i="'+li+'" role="button" aria-label="Ещё">'+ic('adots')+'</i></div>'}
  return '<div class="g3ta2'+(lastTurn?' g3last':'')+'" data-mi="'+li+'" data-t="'+t.ai[0]+'">'+h+'</div>'}
 function imgsOf(b){if(!b.im)return '';var m=G.sent.filter(function(x){return Math.abs(x.ts-b.ts)<60&&x.n==b.im})[0];
  if(m)return '<div class="g3uim">'+m.u.map(function(u){return '<img src="'+u+'">'}).join('')+'</div>';
  return '<div class="g3uim0">'+ic('photo')+' '+b.im+' фото</div>'}
 function pendHtml(p,i){var s=st(),who=NM[s.kind]||'Агент';
  if(p.kind=='clarify'){var ops=(p.opts||[]).map(function(o){return '<div class="g3pb" data-hc="clarop" data-i="'+i+'" data-v="'+E(o)+'">'+E(o)+'</div>'}).join('');
   return '<div class="g3card"><div class="g3ck">'+ic('ask')+E(who)+' спрашивает</div><div class="g3cq">'+E(p.text)+'</div>'+(ops?'<div class="g3ops">'+ops+'</div>':'')+
    '<div class="g3cin"><input id="hcclar" placeholder="'+(ops?'Свой ответ':'Ответ')+'"></div><div class="g3cbt">'+(s.kind!='hermes'?'<div class="g3pb" data-hc="clarskip" data-i="'+i+'">Пропустить</div>':'')+'<div class="g3pb pri" data-hc="clarify" data-i="'+i+'">Ответить</div></div></div>'}
  return '<div class="g3card"><div class="g3ck">'+ic('shield')+'Нужно разрешение'+(p.tool&&s.kind!='hermes'?' · '+E(p.tool):'')+'</div>'+(p.desc?'<div class="g3cq">'+E(p.desc)+'</div>':'')+(p.text?'<pre class="g3pre">'+E(p.text)+'</pre>':'')+
   '<div class="g3cbt"><div class="g3pb" data-hc="appr" data-c="deny" data-i="'+i+'">Отклонить</div><div class="g3pb" data-hc="appr" data-c="session" data-i="'+i+'">'+(s.kind=='hermes'?'На сессию':'Всегда')+'</div><div class="g3pb pri" data-hc="appr" data-c="once" data-i="'+i+'">Разрешить</div></div></div>'}
 function live(){var s=st(),sb=$i('hcsend');return !!(s.busy||s.cclive||(s.cur&&s.cur.live)||(sb&&sb.classList.contains('stop')))}
 function feedHtml(){var s=st(),R=turns(),h='',lv=live();
  if(R.from>0)h+='<div class="g3older" data-hc="older">Показать более ранние ('+R.from+')</div>';
  /* последний ход (последнее сообщение пользователя и всё после него) — в обёртке высотой с экран:
     после отправки пузырь встаёт под шапку (кадры 13–14: верх 132.7 pt), ответ растёт ниже, лента за ним не едет */
  var lu=-1;R.L.forEach(function(t,k){if(t.u)lu=k});var opened=false;
  R.L.forEach(function(t,k){var last=k==R.L.length-1;
   if(k==lu){h+='<div class="g3lt" id="g3lt"'+(G.ltH?' style="min-height:'+G.ltH+'px"':'')+'>';opened=true}
   if(t.u){h+='<div class="g3um" data-mi="'+t.i+'">'+imgsOf(t.u)+(t.u.t?'<div class="g3ub">'+md(t.u.t)+'</div>':'')+'</div>';
    if(last&&lv)h+='<div class="g3ta2 g3last">'+thinking({a:[]})+'</div>';return}
   h+=turnA(t,last&&lv,last)});
  (s.pend||[]).forEach(function(p,i){h+=pendHtml(p,i)});
  if(s.err)h+='<div class="g3err">'+E(s.err)+'</div>';
  if(opened)h+='</div>';
  if(s.loadingMsgs&&!s.msgs.length)h+='<div class="g3think g3load"><span>Загружаю</span></div>';
  return h}
 /* cb5: список обновляем по верхним узлам: неизменившиеся остаются как есть (без пересоздания и перекладки), меняется только последний обмен */
 function setList(l,nh,first){
  if(!first&&l.__ok){var t=D.createElement('template');t.innerHTML=nh;var nk=t.content;
   if(nk.childNodes.length===nk.children.length){var arr=Array.prototype.slice.call(nk.children),ok=l.children,ch=[];
    for(var i=0;i<arr.length;i++){var nn=arr[i],oh=nn.outerHTML,on=ok[i];nn.__oh=oh;if(on&&on.__oh===oh)continue;if(on)l.replaceChild(nn,on);else l.appendChild(nn);ch.push(nn)}
    while(l.children.length>arr.length)l.removeChild(l.lastElementChild);return ch}}
  l.innerHTML=nh;l.__ok=1;for(var j=0;j<l.children.length;j++)l.children[j].__oh=l.children[j].outerHTML;return null}
 function feed(){var f=$i('g3f'),l=$i('g3l');if(!f||!l)return;var _t0=performance.now(),nh=feedHtml();if(l.__h===nh)return;
  var sl=W.getSelection&&W.getSelection(),selin=sl&&!sl.isCollapsed&&sl.rangeCount&&l.contains(sl.anchorNode);if(selin&&!G.stick)return;
  var s=st(),key=s.kind+':'+s.sid,first=l.__sid!==key,prevN=l.querySelectorAll('.g3um').length;
  var ae=D.activeElement,clar=ae&&ae.id=='hcclar'?ae.value:null;
  /* «nh» строится до innerHTML: прокрутку держим сами, иначе браузер на миг обрезает её по укороченной ленте */
  var sc0=f.scrollTop;l.__h=nh;l.__sid=key;setList(l,nh,first);if(!first&&f.scrollTop!=sc0)f.scrollTop=sc0;if(clar!=null){var c=$i('hcclar');if(c){c.value=clar;c.focus()}}
  var nowN=l.querySelectorAll('.g3um').length;fadeTail(l,first);ltFit();
  /* как ChatGPT: вниз только при открытии чата и после отправки; за стримингом ответа лента сама не едет */
  if(first||G.stick||(nowN>prevN&&G.fly))f.scrollTop=f.scrollHeight;
  if(G.fly&&nowN>prevN)flyIn(l.querySelectorAll('.g3um')[nowN-1]);else flyKeep(l);if(nowN>prevN)G.fly=null;G.stick=false;
  var _d=performance.now()-_t0;if(_d>45&&W.cbDiag)cbDiag('feed_slow',{ms:Math.round(_d),kids:l.children.length,nodes:l.getElementsByTagName('*').length});dnUpd()}
 /* затухание хвоста при стриминге (стоп-кадры 0063.44, 0105.80): каждое новое слово проявляется из прозрачности
   за 440 мс cubic-bezier(.3,.6,.5,1) (замер по реальным pts кадров 61.5–66.5 с: 0.11 на первом кадре, 0.53 через 100 мс,
   0.9 через 250 мс), слова одной порции — лесенкой 15 мс слева направо. База перерисовывает ответ целиком, поэтому
   время рождения слова помним по его номеру в последнем ходе, а анимацию продолжаем отрицательной задержкой. */
var FD=440,FST=30,FSH=25,FADE={key:'',b:[]};
function words(el){var L=[],w=D.createTreeWalker(el,NodeFilter.SHOW_TEXT,null),n;while((n=w.nextNode())){var re=/\S+/g,m;while((m=re.exec(n.data)))L.push({n:n,i:m.index,l:m[0].length})}return L}
function fadeTail(l,first){var s=st(),t=l.querySelector('.g3ta2.g3last');if(!t){FADE.key='';return}
 var key=s.kind+':'+s.sid+':'+(t.dataset.t||''),W2=[];t.querySelectorAll('.g3a').forEach(function(a){W2=W2.concat(words(a))});
 var now=performance.now(),lv=live(),b=FADE.key==key?FADE.b:null;
 if(!b){b=[];var fresh=lv&&!first&&W2.length<=40;for(var j=0;j<W2.length;j++)b.push(fresh?now+j*FST:-1e9);FADE.key=key;FADE.b=b}
 /* порция слов от базы раскладывается ровным темпом (видео 105.0–106.1 с: слово каждые 17–80 мс), не раньше конца прошлой
    порции и с отставанием не больше 0.8 с */
 else if(W2.length>b.length){var m0=b.length,n2=W2.length-m0,prev=m0?b[m0-1]:-1e9,s0=Math.max(now,prev+FST),stp=Math.max(0,Math.min(FST,(now+800-s0)/n2));
  for(var k=0;k<n2;k++)b.push(s0+k*stp)}
 else if(W2.length<b.length)b.length=W2.length;
 if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 /* оборачиваем только молодые слова (с конца, чтобы смещения в узлах не съезжали) */
 for(var q=W2.length-1;q>=0;q--){var age=now-b[q];if(age>=FD-FSH)continue;var x=W2[q],n=x.n;
  var r=n.splitText(x.i);r.splitText(x.l);var sp=D.createElement('span');sp.className='g3fw';sp.style.animationDelay=(-(age+FSH)).toFixed(0)+'ms';r.parentNode.replaceChild(sp,r);sp.appendChild(r)}}
function ltFit(){var lt=$i('g3lt'),f=$i('g3f'),l=$i('g3l');if(!lt||!f)return;var cs=getComputedStyle(l),
  h=Math.max(0,f.clientHeight-parseFloat(cs.paddingTop)-8-parseFloat(cs.paddingBottom));G.ltH=h;if(lt.style.minHeight!=h+'px')lt.style.minHeight=h+'px'}
 /* отправка: новый пузырь появляется на месте текста поля и уезжает вверх (видео: 383 мс, spring(0.29,1.0)) */
 function flyIn(el){var fy=G.flyY;if(!el||fy==null||!el.animate||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var r=el.getBoundingClientRect(),dy=fy-r.top;if(dy<=4)return;
  /* покадрово по pts (54.63–55.08 с): 460 мс cubic-bezier(.1,.4,0,1.05), отклонение 1.3 pt на 140 pt пути */
  el.animate([{transform:'translateY('+dy+'px)'},{transform:'none'}],{duration:460,easing:'cubic-bezier(.1,.4,0,1.05)'});G.flyA={t:performance.now(),dy:dy}}
 /* база перерисовывает ленту, когда сервер ответил на отправку (обычно < 100 мс): полёт продолжаем на новом узле с того же места */
 function flyKeep(l){var a=G.flyA;if(!a)return;var el2=performance.now()-a.t;if(el2>=460){G.flyA=null;return}var L=l.querySelectorAll('.g3um'),el=L[L.length-1];
  if(el&&el.animate)el.animate([{transform:'translateY('+a.dy+'px)'},{transform:'none'}],{duration:460,delay:-el2,easing:'cubic-bezier(.1,.4,0,1.05)'})}
 /* ---------- «вниз» ---------- */
 function dnUpd(){var f=$i('g3f'),b=$i('g3dn');if(!f||!b)return;b.classList.toggle('on',f.scrollHeight-f.scrollTop-f.clientHeight>200)}
 /* ---------- подсказки пустого чата (кадр 01) ---------- */
 var SG=[['photo','Что сделано и что осталось?'],['edit','Продолжи по плану проекта'],['shield','Проверь, всё ли работает']];
 function suggest(){var s=st(),g=$i('g3sg');if(!g)return;var empty=!s.msgs.length&&!s.loadingMsgs&&!(s.pend||[]).length&&!s.busy&&!!$i('hcin');
  g.classList.toggle('on',empty);if(empty&&!g.firstChild)g.innerHTML=SG.map(function(x,i){return '<div data-g3="sg" data-i="'+i+'">'+ic(x[0])+'<span>'+E(x[1])+'</span></div>'}).join('')}
 /* ---------- поле ввода ---------- */
 function rec(){return !!(W.VC&&(VC.rec||VC.busy))}
 function has(){var s=st(),ta=$i('hcin');return !!((ta&&ta.value.trim())||(s.imgs&&s.imgs.length))}
 var MC=null;
 function oneLine(ta){if(!ta.value)return true;if(/\n/.test(ta.value))return false;MC=MC||D.createElement('canvas').getContext('2d');var cs=getComputedStyle(ta);
  MC.font=cs.fontWeight+' '+cs.fontSize+' '+cs.fontFamily;return MC.measureText(ta.value).width<=ta.clientWidth-2}
 function comp(){var c=$i('g3c'),ta=$i('hcin'),s=st(),go=$i('g3go');if(!c||!ta||!go)return;
  var r=rec(),hs=has(),stopS=!hs&&!r&&live(),card=!r&&!oneLine(ta);   /* фото не делают карточку: полоса фото над обычной строкой (кадр 23) */
  var k=(r?'r':'')+(card?'c':'')+(B.classList.contains('hckb')?'k':''),h0=c.__h||c.offsetHeight;
  c.classList.toggle('rec',r);c.classList.toggle('card',card);c.classList.toggle('has',hs);
  var gi=stopS?'stop':hs?'up':'voice';if(go.dataset.i!=gi){go.dataset.i=gi;go.innerHTML=ic(gi);go.setAttribute('aria-label',gi=='stop'?'Остановить':gi=='up'?'Отправить':'Сказать и отправить')}
  grow(ta);var h1=c.offsetHeight;c.__h=h1;
  if(c.__k!==undefined&&c.__k!==k&&Math.abs(h1-h0)>2&&c.animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches)
   c.animate([{height:h0+'px'},{height:h1+'px'}],{duration:350,easing:'cubic-bezier(.25,.35,.15,1.05)'});
  c.__k=k;dict();pad()}
 /* рост до 248 pt (кадр 16): 1 строка 48, дальше прокрутка внутри */
 function grow(ta){var c=$i('g3c'),cs=getComputedStyle(ta),lh=parseFloat(cs.lineHeight)||24,full=c&&c.classList.contains('full');
  if(full){var av=c.clientHeight-(c.offsetHeight-ta.offsetHeight);ta.style.height='auto';ta.style.height=Math.max(lh,c.getBoundingClientRect().height-60)+'px';return}
  ta.style.height='auto';var sh=ta.scrollHeight,h=Math.min(8*lh+12,Math.max(lh,sh));if(ta.style.height!=h+'px')ta.style.height=h+'px';if(c)c.classList.toggle('tall',sh>8*lh+14)}
 function pad(){var c=$i('g3c'),l=$i('g3l'),f=$i('g3f');if(!c||!l)return;var top=c.getBoundingClientRect().top,tr=$i('g3tr'),h=Math.round(innerHeight-top+(tr&&tr.classList.contains('on')?tr.offsetHeight+8:0)+63);
  if(l.style.paddingBottom!=h+'px'){var near=f.scrollHeight-f.scrollTop-f.clientHeight<60;l.style.paddingBottom=h+'px';ltFit();if(near)f.scrollTop=f.scrollHeight}
  var dn=$i('g3dn');if(dn)dn.style.bottom=(innerHeight-top+15)+'px';
  var sg=$i('g3sg');if(sg)sg.style.bottom=(innerHeight-top+13.6)+'px'}
 /* ---------- диктовка (кадры 26–29): та же пилюля «× · волна · ■ · ↑», живой текст — карточка над полем ---------- */
 function dict(){var d=$i('g3dict'),r=rec();if(!d)return;
  if(!r){if(d.dataset.k){d.dataset.k='';d.innerHTML=''}stopWave();trCard(false);holdLbl(false);return}
  var busy=!!VC.busy,key=(busy?'b':'r')+(G.sendAfter?'s':'');
  if(d.dataset.k!==key){var first=!d.dataset.k;d.dataset.k=key;
   d.innerHTML='<div class="g3dx" data-g3="dcancel" role="button" aria-label="Отменить диктовку">'+ic('x')+'</div>'+
    '<div class="g3wv" data-g3="wave">'+(busy?'<span>Распознаю…</span>':'<canvas id="g3cv"></canvas>')+'</div>'+
    '<div class="g3ds" data-g3="dstop" role="button" aria-label="Остановить диктовку">'+(busy&&!G.sendAfter?'<i class="g3spin"></i>':ic('dstop'))+'</div>'+
    '<div class="g3go" data-g3="dsend" role="button" aria-label="Распознать и отправить">'+(busy&&G.sendAfter?'<i class="g3spin"></i>':ic('up'))+'</div>';
   /* видео: плейсхолдер гаснет 80 мс, затем ×/волна/■ проявляются 100 мс */
   if(first&&d.animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches){d.animate([{opacity:0},{opacity:1}],{duration:100,delay:80,easing:'ease-out',fill:'backwards'});
    /* прежний ряд «+ · Спросить · 🎤» не исчезает сразу, а гаснет 80 мс (видео 180.06–180.14 с): копия поверх, без id */
    var row=d.parentNode.querySelector('.g3row:not(.g3ghost)');if(row){var gh=row.cloneNode(true);gh.classList.add('g3ghost');gh.querySelectorAll('[id]').forEach(function(e){e.removeAttribute('id')});
     gh.removeAttribute('id');d.parentNode.appendChild(gh);var an=gh.animate([{opacity:1},{opacity:0}],{duration:55,easing:'ease-out',fill:'forwards'});an.onfinish=function(){gh.remove()}}}}
  trCard(G.show);holdLbl(G.hold);if(!busy)startWave();else stopWave()}
 function trCard(on){var t=$i('g3tr'),ta=$i('hcin');if(!t)return;var v=on&&ta&&rec()?ta.value.trim():'';t.classList.toggle('on',!!v);if(v&&t.textContent!==ta.value){t.textContent=ta.value;t.scrollTop=t.scrollHeight}
  var c=$i('g3c');if(c)t.style.bottom=(innerHeight-c.getBoundingClientRect().top+8)+'px'}
 function holdLbl(on){var l=$i('g3hold'),c=$i('g3c');if(!l)return;l.classList.toggle('on',!!on);var cn=!!(on&&G.cancel);l.classList.toggle('cancel',cn);if(c)c.classList.toggle('cancel',cn);var tx=cn?'Отпусти, чтобы отменить':'Отпусти, чтобы отправить';if(l.textContent!=tx)l.textContent=tx;B.classList.toggle('g3dim',!!on);if(on&&c){var tp=c.getBoundingClientRect().top;l.style.bottom=(innerHeight-tp+27.6)+'px';B.style.setProperty('--g3sh',(innerHeight-tp+190)+'px')}}
 /* волна по видео: бары 2.3 pt, шаг 5 pt, 4…24 pt, #a6a6a6, затухание у краёв, едет влево 30 pt/с; уровень RMS раз в 100 мс, min(1,8·rms) */
 var WV=null;
 function startWave(){if(WV&&WV.on)return;WV={on:true,hist:[],lvl:0,env:0,ph:0,t0:0,raf:0,an:null,buf:null,last:0,ac:null};
  try{var AC=W.AudioContext||W.webkitAudioContext;if(AC&&VC.stream&&typeof MediaStream!='undefined'&&VC.stream instanceof MediaStream){WV.ac=new AC();var src=WV.ac.createMediaStreamSource(VC.stream);WV.an=WV.ac.createAnalyser();WV.an.fftSize=2048;src.connect(WV.an);WV.buf=new Float32Array(WV.an.fftSize)}}catch(e){WV.an=null}
  for(var i=0;i<60;i++)WV.hist.push(0);WV.raf=requestAnimationFrame(wframe)}
 function stopWave(){if(!WV)return;WV.on=false;cancelAnimationFrame(WV.raf);try{WV.ac&&WV.ac.close()}catch(e){}WV=null}
 function wframe(now){if(!WV||!WV.on)return;
  if(now-WV.last>=100){WV.last=now;var r=0;if(W.__g3lvl!=null)r=W.__g3lvl;else if(WV.an){WV.an.getFloatTimeDomainData(WV.buf);var q=0;for(var i=0;i<WV.buf.length;i++)q+=WV.buf[i]*WV.buf[i];r=Math.sqrt(q/WV.buf.length)}WV.lvl=r<.0025?0:Math.min(1,8*r)}
  var dt=WV.t0?Math.min(100,now-WV.t0):0;WV.t0=now;WV.env+=(WV.lvl-WV.env)*(1-Math.exp(-dt/(WV.lvl>WV.env?35:90)));
  WV.ph+=30*dt/1000;while(WV.ph>=5){WV.hist.push(WV.env);WV.hist.shift();WV.ph-=5}
  var cv=$i('g3cv');if(cv){var a=cv.clientWidth,o=cv.clientHeight,dpr=W.devicePixelRatio||1;if(a&&o){if(cv.width!=Math.round(a*dpr)){cv.width=Math.round(a*dpr);cv.height=Math.round(o*dpr)}
   var x=cv.getContext('2d');x.setTransform(dpr,0,0,dpr,0,0);x.clearRect(0,0,a,o);x.fillStyle=getComputedStyle(cv).color;var need=Math.ceil(a/5)+2;while(WV.hist.length<need)WV.hist.unshift(0);
   for(var e=0;e<WV.hist.length;e++){var n=a-2.3-5*e-WV.ph;if(n<-2.3)break;var l=WV.hist[WV.hist.length-1-e],m=4+l*20,dd=Math.min(1,Math.max(0,Math.min(n,a-n-2.3))/20);
    x.globalAlpha=.25+.75*dd*dd*(3-2*dd);x.beginPath();if(x.roundRect)x.roundRect(n,(o-m)/2,2.3,m,1.15);else x.rect(n,(o-m)/2,2.3,m);x.fill()}x.globalAlpha=1}}
  WV.raf=requestAnimationFrame(wframe)}
 function abortRec(){G.sendAfter=false;G.voice=false;/* cb3: × работает и пока идёт «Распознаю…» */if(W.VC&&VC.busy&&!VC.rec){vcCancelBusy();draw();return}if(!W.VC||!VC.rec)return;var r=VC.rec;r.ondataavailable=null;
  r.onstop=function(){try{VC.stream.getTracks().forEach(function(t){t.stop()})}catch(e){}clearInterval(VC.tick);clearTimeout(VC.timer);VC.rec=null;VC.seq++;VC.busy=false;vcSet('');vcUi()};try{r.stop()}catch(e){r.onstop()}}
 function sendAfter(){var sid0=st().sid,g0=W.VC?VC.gen:0;G.sendAfter=true;draw();if(VC.rec)vcStop();var n=0;(function w(){if(W.VC&&(VC.rec||VC.busy)&&n++<3000)return setTimeout(w,100);
    /* cb3: отправляем только в тот чат, где диктовали, и только если не отменили; ждать можно сколько нужно (раньше сдавались на 60 с) */
    var ok=G.sendAfter&&(!W.VC||VC.gen==g0)&&st().sid==sid0;G.sendAfter=false;G.voice=false;
    if(ok&&has()){doSend();T('Отправлено голосом')}draw()})()}
 function doSend(){var ta=$i('hcin'),s=st();if(G.ed){editSend();return}
  if(ta){G.flyY=ta.getBoundingClientRect().top-12}G.fly=1;G.stick=true;
  if(s.imgs&&s.imgs.length)G.sent.push({ts:Date.now()/1000,n:s.imgs.length,u:s.imgs.slice()});
  var sb=$i('hcsend');if(sb)sb.click()}
 /* ---------- всплывающие меню (Liquid Glass: шапка «…» 7.1, «+» 7.2): морф из кнопки 400 мс с отскоком ~4% ---------- */
 var SPR='linear(0,.06,.198,.365,.53,.675,.793,.883,.947,.99,1.015,1.027,1.031,1.03,1.026,1.021,1.016,1.011,1.007,1.004,1.002,1)';
 function closePop(){var p=$i('g3pop'),v=$i('g3veil');if(v)v.remove();if(p){p.id='';p.classList.add('out');setTimeout(function(){p.remove()},180)}}
 /* from = {w,h} исходной кнопки: меню «…» растёт из капсулы 104×44, «+» — из всего поля (видео 269.71 и 253.33 с) */
 function pop(html,pos,origin,cls,from){closePop();var v=D.createElement('div');v.id='g3veil';B.appendChild(v);var p=D.createElement('div');p.id='g3pop';p.className='g3pop '+(cls||'');p.innerHTML=html;
   for(var k in pos)p.style[k]=pos[k];p.style.transformOrigin=origin;B.appendChild(p);
   var sx=.18,sy=.1;if(from&&p.offsetWidth&&p.offsetHeight){sx=Math.min(1.2,from.w/p.offsetWidth);sy=Math.min(1,from.h/p.offsetHeight)}
   if(p.animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches)p.animate([{transform:'scale('+sx.toFixed(3)+','+sy.toFixed(3)+')',opacity:.4},{transform:'none',opacity:1}],{duration:400,easing:SPR});return p}
 function mi(g,icn,t,cls,ex){var a=g.indexOf('hc:')==0?'data-hc="'+g.slice(3)+'"':'data-g3="'+g+'"';return '<div class="g3mi'+(cls?' '+cls:'')+'" '+a+(ex?' '+ex:'')+'>'+ic(icn)+'<span>'+t+'</span></div>'}
 function hDesk(){var s=st();return s.kind=='hermes'&&!s.rw&&/^(local|gui|cli|desktop)$/.test(s.src||'')}
 function hApi(){var s=st();return s.kind=='hermes'&&!!s.rw&&/^api_/.test(s.sid||'')}
 function canRw(){return hDesk()||hApi()}
 function headMenu(){var s=st(),cap=D.querySelector('#g3hd .g3cap');if(!cap)return;var r=cap.getBoundingClientRect();
  var x='<div class="g3mh">'+E(s.title||'Новый чат')+'</div>'+
   (s.kind=='hermes'?mi('hc:pinmenu','pin',s.pin?'Открепить':'Закрепить'):'')+
   (s.rw?mi('hc:rename','edit','Переименовать'):'')+mi('fwdlast','share','Переслать')+mi('hc:menu','more','Другие действия')+
   (hDesk()?mi('arch','arch','В архив'):'')+(s.rw?mi('hc:del','trash','Удалить','bad'):'');
  pop(x,{top:(r.top-3)+'px',right:(innerWidth-r.right-2)+'px',width:'254px'},'top right','g3pm',{w:r.width,h:r.height})}
 function chipsOk(){var c=$i('hcchips');return !!(c&&c.children.length)}
 function cRect(){return $i('g3c').getBoundingClientRect()}
 function plusMenu(){var s=st(),r=cRect(),ml=s.msel&&s.msel.m?HC.pretty(s.msel.m):(s.models&&s.models.cur?HC.pretty(s.models.cur.model):'По умолчанию'),ef=EFF[(s.msel&&s.msel.e)||'']||'Авто';
  var x='<label class="g3pi" for="g3cam" data-g3="pphoto"><i>'+ic('camera')+'</i><span>Камера</span></label><label class="g3pi" for="hcfile" data-g3="pphoto"><i>'+ic('photo')+'</i><span>Фото</span><em>до 20</em></label>'+
   (chipsOk()?'<div class="g3pi" data-g3="models"><i>'+ic('model')+'</i><span>Модель</span><em>'+E(ml)+'</em></div><div class="g3pi" data-g3="efforts"><i>'+ic('bulb')+'</i><span>Сила работы</span><em>'+E(ef)+'</em></div>':'');
  /* кадр 0255.99: меню растёт из «+» и накрывает поле: левый край 25.3, низ на 8 ниже поля */
  pop(x,{left:(r.left-8.7)+'px',bottom:(innerHeight-r.bottom-8)+'px',width:'280.7px'},'bottom left','g3pp',{w:r.width,h:r.height})}
 function loadModels(cb){var s=st();if(s.models){cb&&cb();return}var bs=s.kind=='codex'?'/cx':'';
  fetch(API.replace(/\/$/,'')+'/api/hc'+bs+'/models',{headers:{'X-Init-Data':W.tg?tg.initData:''}}).then(function(r){return r.json()}).then(function(d){if(d&&d.p){s.models=s.models||d;cb&&cb()}}).catch(function(){})}
 function modelMenu(){var s=st(),r=cRect(),M=s.models,cur=s.msel&&s.msel.m,x='<div class="g3mh">Модель</div>';
  if(!M){x+='<div class="g3mh">Загружаю…</div>';loadModels(function(){if($i('g3pop'))modelMenu()})}
  else{var pv=M.p.filter(function(p){return p.slug==((s.msel&&s.msel.p)||M.cur.provider)})[0]||M.p[0];
   x+='<div class="g3mi" data-hc="mdef">'+(cur?'<i class="g3ck"></i>':ic('check'))+'<span>По умолчанию · '+E(HC.pretty(M.cur.model))+'</span></div>';
   (pv?pv.m:[]).slice(0,8).forEach(function(m){x+='<div class="g3mi" data-hc="mpick" data-m="'+E(m)+'" data-p="'+E(pv.slug)+'">'+(cur==m?ic('check'):'<i class="g3ck"></i>')+'<span>'+E(HC.pretty(m))+'</span></div>'});
   x+='<div class="g3mi" data-hc="model"><i class="g3ck"></i><span>Все модели…</span></div>'}
  pop(x,{left:(r.left-8)+'px',bottom:(innerHeight-r.top+12)+'px',width:'281px'},'bottom left','g3pm')}
 function effortMenu(){var s=st(),r=cRect(),e=(s.msel&&s.msel.e)||'',x='<div class="g3mh">Сила работы</div>';
  ['','low','medium','high'].forEach(function(k){x+='<div class="g3mi" data-hc="epick" data-e="'+k+'">'+(k==e?ic('check'):'<i class="g3ck"></i>')+'<span>'+EFF[k]+'</span></div>'});
  pop(x,{left:(r.left-8)+'px',bottom:(innerHeight-r.top+12)+'px',width:'281px'},'bottom left','g3pm')}
 function lastIdx(u){var s=st();for(var i=s.msgs.length-1;i>=0;i--){if((s.msgs[i].k=='u')==u)return i}return -1}
 function msgMenu(i,el){var s=st(),b=s.msgs[i];if(!b)return;var r=el.getBoundingClientRect(),u=b.k=='u',lv=live(),x='';
  /* время сообщения — здесь (у ChatGPT времени под сообщениями нет, у нас оно было) */
  if(b.ts){var d=new Date(b.ts*1000),td=new Date();x+='<div class="g3mh">'+(d.toDateString()==td.toDateString()?'Сегодня':d.toLocaleDateString('ru-RU',{day:'numeric',month:'long'}))+', '+d.toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})+'</div>'}
  x+=mi('hc:copy','copy','Копировать','','data-b="'+i+'"')+mi('hc:seltx','sel','Выделить текст','','data-b="'+i+'"')+mi('hc:fwd','share','Переслать','','data-b="'+i+'"');
  if(canRw()&&!lv&&i==lastIdx(u))x+=mi('retry','retry','Повторить');
  if(canRw()&&!lv&&u&&i==lastIdx(true)&&b.t)x+=mi('edit','edit','Изменить','','data-i="'+i+'"');
  var top=Math.min(r.bottom+8,innerHeight-260);pop(x,{top:Math.max(60,top)+'px',left:u?'auto':'16px',right:u?'16px':'auto',width:'230px'},u?'top right':'top left','g3pm')}
 /* ---------- Повторить / Изменить (Hermes, бэкенд scripts/tv_gptx.py) ---------- */
 function gx(p,body){return fetch(API.replace(/\/$/,'')+'/api/hc/gx'+p,{method:'POST',headers:{'X-Init-Data':W.tg?tg.initData:'','Content-Type':'application/json'},body:JSON.stringify(body)})
  .then(function(r){return r.json().catch(function(){return{}}).then(function(j){if(!r.ok)throw new Error(j.text||j.error||('HTTP '+r.status));return j})})}
 function cutLocal(){var s=st(),u=lastIdx(true);if(u>=0){s.msgs.splice(u);HC.paint()}}
 function resend(t){var s=st(),ta=$i('hcin');if(!ta)return;ta.value=t;s.draft=t;ta.dispatchEvent(new Event('input',{bubbles:true}));doSend()}
 function retry(){var s=st();if(!canRw())return;T('Повторяю последний ход…');haptic();
  if(hApi()){gx('/rewind',{sid:s.sid}).then(function(d){cutLocal();if(d.text)resend(d.text);haptic('ok')}).catch(function(e){T(E(e.message))});return}
  gx('/retry',{sid:s.sid,src:s.src}).then(function(d){T(d.status=='queued'?'В очереди: Hermes повторит после текущего ответа':'Hermes отвечает заново');haptic('ok')}).catch(function(e){T(E(e.message))})}
 function editStart(i){var s=st(),b=s.msgs[i];if(!b||!canRw())return;G.ed={i:i};var ta=$i('hcin');if(ta){ta.value=b.t||'';s.draft=ta.value;ta.dispatchEvent(new Event('input',{bubbles:true}));ta.focus()}draw()}
 function editSend(){var s=st(),ta=$i('hcin'),t=ta?ta.value.trim():'';if(!t){T('Пустое сообщение');return}var keep=G.ed;G.ed=null;draw();
  if(hApi()){gx('/rewind',{sid:s.sid}).then(function(){cutLocal();resend(t);haptic('ok')}).catch(function(e){G.ed=keep;draw();T(E(e.message))});return}
  gx('/edit',{sid:s.sid,src:s.src,t:t}).then(function(){ta.value='';s.draft='';ta.dispatchEvent(new Event('input',{bubbles:true}));T('Сообщение изменено, Hermes отвечает заново');haptic('ok')}).catch(function(e){G.ed=keep;draw();T(E(e.message))})}
 function edBar(){var c=$i('g3c'),e=$i('g3ed');if(!G.ed||!c){if(e)e.remove();return}
  if(!e){e=D.createElement('div');e.id='g3ed';e.className='g3ed';e.innerHTML=ic('edit')+'<b>Изменение сообщения</b><i data-g3="edx">Отмена</i>';c.insertBefore(e,c.firstChild)}}
 /* ---------- прочитать вслух ---------- */
 function speak(i){var s=st();try{var ss=W.speechSynthesis;if(!ss){T('Чтение вслух недоступно');return}
  if(G.spk==i){ss.cancel();G.spk=-1;feed();return}ss.cancel();var u=new SpeechSynthesisUtterance(txt(s.msgs[i]).replace(/[#*`>_|]/g,'').slice(0,4000));u.lang='ru-RU';
  u.onend=u.onerror=function(){if(G.spk==i){G.spk=-1;feed()}};G.spk=i;ss.speak(u);feed()}catch(e){T('Чтение вслух недоступно')}}
 /* ---------- главная перерисовка ---------- */
 var busyDraw=false;
 function draw(){if(busyDraw)return;busyDraw=true;try{
  /* классы body — только при реальной смене: classList.add/remove без изменения всё равно рождает мутацию, и соседний модуль (claude.js) с таким же наблюдателем будил бы этот бесконечно */var g=$i('g3');if(!on()){if(g)g.remove();['g3on','g3dim'].forEach(function(c){if(B.classList.contains(c))B.classList.remove(c)});stopWave();busyDraw=false;MO.takeRecords();return}
  if(!B.classList.contains('g3on'))B.classList.add('g3on');frame();adopt();feed();comp();edBar();suggest();dnUpd();
  var s=st(),em=!s.msgs.length&&!s.busy;$i('g3hd').classList.toggle('g3empty',em);
  }catch(e){console.error(e)}busyDraw=false;MO.takeRecords()}
 var qd=0;function sched(){if(qd)return;qd=requestAnimationFrame(function(){qd=0;draw()})}
 /* перерисовки базы (paintChat меняет #hcroot целиком, paint — #hcmsgs, sendBtn — класс #hcsend) → сразу, без мигания */
 var MO=new MutationObserver(function(L){for(var i=0;i<L.length;i++){var t=L[i].target;if(t.id!='hcsend'&&t.closest&&t.closest('#g3l,#g3dict,#g3pop,#g3tr,#g3sg,#g3hd,.g3pop'))continue;draw();return}});
 MO.observe(B,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
 D.addEventListener('input',function(e){if(e.target&&e.target.id=='hcin'&&on())comp()},false);
 D.addEventListener('focusin',function(e){if(e.target&&e.target.id=='hcin'&&on())setTimeout(comp,0)},true);
 D.addEventListener('focusout',function(e){if(e.target&&e.target.id=='hcin')setTimeout(function(){on()&&comp()},120)},true);
 W.addEventListener('resize',function(){if(on()){pad();dnUpd()}});
 if(W.visualViewport)visualViewport.addEventListener('resize',function(){on()&&pad()});
 if(typeof W.vcUi=='function'){var _ui=W.vcUi;W.vcUi=function(){var r=_ui.apply(this,arguments);if(on())comp();return r}}
 if(typeof W.vcSet=='function'){var _set=W.vcSet;W.vcSet=function(){var r=_set.apply(this,arguments);if(on()){comp();trCard(G.show)}return r}}
 /* ---------- удержание 🎤 = запись, отпустил = отправить («Release to send», кадр 29) ---------- */
 var HOLD={t:0,on:false,sw:false};
 D.addEventListener('pointerdown',function(e){var m=e.target.closest&&e.target.closest('#g3 [data-g3=mic]');if(!m||rec())return;
  HOLD.x=e.clientX;HOLD.y=e.clientY;G.cancel=false;HOLD.on=false;clearTimeout(HOLD.t);HOLD.t=setTimeout(function(){if(W.vcStart&&!VC.rec){HOLD.on=true;HOLD.sw=true;G.hold=true;haptic();vcStart();comp()}},320)},true);
 function holdEnd(){clearTimeout(HOLD.t);if(HOLD.on){HOLD.on=false;G.hold=false;var cn=G.cancel;G.cancel=false;holdLbl(false);setTimeout(function(){if(W.VC&&VC.rec){if(cn)abortRec();else sendAfter()}comp()},150);setTimeout(function(){HOLD.sw=false},400)}}
 /* увёл палец от поля (вверх или в сторону) — «Отпусти, чтобы отменить» */
 D.addEventListener('pointermove',function(e){if(!HOLD.on)return;var c=$i('g3c'),r=c&&c.getBoundingClientRect(),away=r&&(e.clientY<r.top-60||Math.abs(e.clientX-HOLD.x)>110);if(!!away!=!!G.cancel){G.cancel=!!away;haptic();holdLbl(true)}},true);
 D.addEventListener('pointerup',holdEnd,true);D.addEventListener('pointercancel',holdEnd,true);
 W.addEventListener('contextmenu',function(e){if(e.target.closest&&e.target.closest('#g3 [data-g3=mic],#g3dict,#g3 .g3um,#g3 .g3ta2'))e.preventDefault()},true);
 /* долгое нажатие на сообщение — меню (Копировать, Выделить, Переслать, Повторить/Изменить у Hermes) */
 var LP={t:0,x:0,y:0,fired:false};
 D.addEventListener('pointerdown',function(e){LP.fired=0;var m=e.target.closest&&e.target.closest('#g3l .g3ub,#g3l .g3a');if(!m)return;var row=m.closest('[data-mi]');if(!row)return;
  LP.x=e.clientX;LP.y=e.clientY;clearTimeout(LP.t);LP.t=setTimeout(function(){LP.t=0;LP.fired=Date.now();haptic();var b=row.classList.contains('g3um')?row.querySelector('.g3ub'):m;
   if(b.animate)b.animate([{transform:'scale(1)'},{transform:'scale(1.03)'},{transform:'scale(1)'}],{duration:300,easing:'cubic-bezier(.3,1.4,.5,1)'});msgMenu(+row.dataset.mi,b)},480)},true);
 D.addEventListener('pointermove',function(e){if(LP.t&&Math.hypot(e.clientX-LP.x,e.clientY-LP.y)>8){clearTimeout(LP.t);LP.t=0}},true);
 D.addEventListener('pointerup',function(){clearTimeout(LP.t);LP.t=0},true);
 function hcDo(a,ds){var d=D.createElement('i');d.dataset.hc=a;for(var k in (ds||{}))d.dataset[k]=ds[k];d.style.display='none';(root()||B).appendChild(d);d.click();if(d.parentNode)d.remove()}
 /* ---------- клики ---------- */
 W.addEventListener('click',function(e){
  /* клик сразу после долгого нажатия (тот же палец) глотаем, но не дольше 700 мс — иначе пропадёт следующий настоящий тап */
  if(LP.fired){var fr=Date.now()-LP.fired<700;LP.fired=0;if(fr&&e.target.closest&&e.target.closest('#g3l')){e.stopImmediatePropagation();e.preventDefault();return}}
  if(HOLD.sw&&e.target.closest&&e.target.closest('[data-g3=mic]')){HOLD.sw=false;e.stopImmediatePropagation();e.preventDefault();return}
  var cp=e.target.closest&&e.target.closest('#g3 [data-g3c]');
  if(cp){setTimeout(function(){var o=cp.innerHTML;cp.innerHTML=ic('check');cp.classList.add('ok');setTimeout(function(){cp.innerHTML=o;cp.classList.remove('ok')},1600)},20)}
  if(e.target.closest&&e.target.closest('.g3pop [data-hc]')){setTimeout(closePop,0);return}
  if(e.target.id=='g3veil'){closePop();e.stopPropagation();e.preventDefault();return}
  var el=e.target.closest&&e.target.closest('[data-g3]');if(!el||!(el.closest('#g3')||el.closest('.g3pop')))return;
  var g=el.dataset.g3,s=st();if(!s)return;
  if(g=='pphoto'){setTimeout(closePop,0);return}   // label for=hcfile открывает выбор фото сам
  e.stopPropagation();e.preventDefault();
  if(el.closest('.g3pop'))closePop();
  switch(g){
   case 'side':if(W.SD3)SD3.open();else hcDo('back');break;   // gpt17: ☰ = боковое меню (side.js)
   case 'new':hcDo('new');break;
   case 'menu':headMenu();break;
   case 'plus':plusMenu();break;
   case 'models':setTimeout(modelMenu,60);break;
   case 'efforts':setTimeout(effortMenu,60);break;
   case 'down':{var f=$i('g3f');f.scrollTo({top:f.scrollHeight,behavior:'smooth'});break}
   case 'mic':if(W.vcStart&&!rec()){G.voice=false;vcStart();comp()}break;
   case 'go':{if(rec())break;var sb=$i('hcsend');
    if(has()){doSend();break}
    if(live()){if(sb)sb.click();break}
    if(W.vcStart){G.voice=true;vcStart();comp()}break}
   case 'expand':{var c3=$i('g3c');c3.classList.toggle('full');if(!c3.classList.contains('full')){c3.classList.remove('full')}comp();var t3=$i('hcin');t3&&t3.focus();break}
   case 'dcancel':abortRec();break;
   case 'dstop':if(G.voice)sendAfter();else if(VC.rec)vcStop();break;
   case 'dsend':sendAfter();break;
   case 'wave':case 'trtap':G.show=!G.show;trCard(G.show);pad();break;
   case 'worked':{var i=+el.dataset.i;G.open[i]=!G.open[i];feed();break}
   case 'tres':{var k2=el.dataset.k;G.open[k2]=!G.open[k2];feed();break}
   case 'fb':{var k=s.sid+':'+el.dataset.i;G.fb[k]=G.fb[k]==el.dataset.v?'':el.dataset.v;try{localStorage.setItem('g3fb',JSON.stringify(G.fb))}catch(x){}haptic();feed();break}
   case 'speak':speak(+el.dataset.i);break;
   case 'amenu':msgMenu(+el.dataset.i,el);break;
   case 'sg':{var ta=$i('hcin'),q=SG[+el.dataset.i];if(ta&&q){ta.value=q[1];s.draft=q[1];ta.dispatchEvent(new Event('input',{bubbles:true}));ta.focus()}break}
   case 'fwdlast':{var li=lastIdx(false);if(li<0)li=lastIdx(true);if(li>=0)HC.fwdStart(li);else T('Пока нечего пересылать');break}
   case 'arch':gx('/archive',{sid:s.sid,src:s.src}).then(function(){T('Чат в архиве');haptic('ok');hcDo('back')}).catch(function(x){T(E(x.message))});break;
   case 'retry':retry();break;
   case 'edit':editStart(+el.dataset.i);break;
   case 'edx':{G.ed=null;var t2=$i('hcin');if(t2){t2.value='';s.draft='';t2.dispatchEvent(new Event('input',{bubbles:true}))}draw();break}
  }},true);
 /* «Камера»: снимок отдаём обычному полю фото базы (#hcfile) — её обработчик сжимает и считает лимит 20 */
 D.addEventListener('change',function(e){if(e.target.id!='g3cam'||!e.target.files||!e.target.files.length)return;var f=$i('hcfile');if(!f)return;
  try{var dt=new DataTransfer();for(var i=0;i<e.target.files.length;i++)dt.items.add(e.target.files[i]);f.files=dt.files;f.dispatchEvent(new Event('change',{bubbles:true}))}catch(x){T('Камера недоступна, выбери фото')}e.target.value=''},true);
 /* Ctrl/Cmd+Enter: отправка своим путём (анимация, изменение сообщения) */
 D.addEventListener('keydown',function(e){if(e.target.id=='hcin'&&on()&&e.key=='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();e.stopImmediatePropagation();if(has())doSend()}},true);
 W.G3={draw:draw,G:G,fade:FADE,
 /* для сверки со стоп-кадром: возраст слов последнего ответа в мс (по видео) → перерисовать хвост */
 fadeAt:function(ages){var l=$i('g3l');if(!l)return;var n=performance.now();FADE.b=ages.map(function(a){return n-a});l.__h=null;var s=st();FADE.key=s.kind+':'+s.sid+':'+((l.querySelector('.g3ta2.g3last')||{dataset:{}}).dataset.t||'');feed()},abort:abortRec,sendAfter:sendAfter,wave:function(){return WV},plusMenu:plusMenu,headMenu:headMenu,modelMenu:modelMenu,msgMenu:msgMenu,closePop:closePop,ic:ic,I:I};
 sched();
})();
