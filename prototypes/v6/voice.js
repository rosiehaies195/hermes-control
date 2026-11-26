/* v10.5: см. vcChunk — досылка кусков и черновик по хвосту. v6.9: голосовой ввод в чате с живым текстом. Пока идёт запись, каждые ~1,5 с на ПК уходит вся запись целиком
   (быстрая модель base, ~0,7 с) и черновик показывается в поле ввода; после стопа финальный проход моделью small
   заменяет черновик. Текст НЕ отправляется сам. Если WebView не даёт микрофон — подсказка про диктовку клавиатуры. */
function VJ(path,body){return fetch(API.replace(/\/$/,'')+'/api/hc'+path,{method:'POST',headers:{'X-Init-Data':tg?tg.initData:'','Content-Type':'application/json'},body:JSON.stringify(body)}).then(function(r){if(!r.ok)return r.json().catch(function(){return{}}).then(function(j){throw new Error(r.status==401?'подпись устарела, открой панель заново':j.detail||j.error||('HTTP '+r.status))});return r.json()})}
var VC={rec:null,chunks:[],stream:null,t0:0,timer:0,tick:0,busy:false,seq:0,fly:false,base:'',mime:'',gen:0,sid:'',tb:0,btk:0,warmT:0};
/* cb6: диагностика с телефона (panel_diag.jsonl): не чаще 40 событий за 10 минут, редкие события — не чаще раза в 15 с */
var CBD={n:0,t:0,k:{}};
function cbDiag(ev,o){try{if(!API||!tg||!tg.initData)return;var now=Date.now();if(now-CBD.t>600000){CBD.t=now;CBD.n=0}if(++CBD.n>40)return;
 if(/^(sd_|feed_)/.test(ev)){if(now-(CBD.k[ev]||0)<15000)return;CBD.k[ev]=now}
 o=o||{};o.ev=ev;o.ver=typeof VER!='undefined'?VER:0;o.pl=tg.platform;o.ua=String(navigator.userAgent).slice(-60);
 fetch(API.replace(/\/$/,'')+'/api/hc/diag',{method:'POST',headers:{'X-Init-Data':tg.initData,'Content-Type':'application/json'},body:JSON.stringify(o)}).catch(function(){})}catch(e){}}
window.cbDiag=cbDiag;
/* cb3: поколение записи (отмена при «Распознаю…» и игнор позднего ответа), чат записи, прогрев воркера, сигнал о долгом ожидании */
function vcWarm(){if(!API||Date.now()-VC.warmT<600000)return;VC.warmT=Date.now();try{fetch(API.replace(/\/$/,'')+'/api/hc/stt/warm',{headers:{'X-Init-Data':tg?tg.initData:''}}).catch(function(){})}catch(e){}}
function vcBusyTick(){var s=Math.max(0,Math.floor((Date.now()-VC.tb)/1000)),e=document.querySelector('#g3dict .g3wv span,#cldict .clwv span');if(!e)return;var t='Распознаю…'+(s>=3?' '+s+' с':'')+(s>=12?' · ПК запускает распознавание':'');if(e.textContent!==t)e.textContent=t}
function vcBusyStart(){clearInterval(VC.btk);VC.btk=setInterval(vcBusyTick,500)}
function vcBusyStop(){clearInterval(VC.btk);VC.btk=0}
function vcCancelBusy(){cbDiag('voice_cancel',{busy:Date.now()-VC.tb});VC.gen++;VC.busy=false;VC.rec=null;vcBusyStop();vcSet('');vcUi()}
function vcStash(sid,t){try{localStorage.setItem('vcstash',JSON.stringify({sid:sid,t:t,ts:Date.now()}))}catch(e){}toast('Диктовка осталась в чате, где ты её начал: откроешь его — текст вернётся в поле')}
setInterval(function(){var o=null;try{o=JSON.parse(localStorage.getItem('vcstash')||'null')}catch(e){}if(!o)return;if(Date.now()-o.ts>86400000){localStorage.removeItem('vcstash');return}
 var ta=document.getElementById('hcin');if(!ta||VC.rec||VC.busy||!window.HC||HC.st.sid!=o.sid||ta.value)return;localStorage.removeItem('vcstash');ta.value=o.t;ta.dispatchEvent(new Event('input',{bubbles:true}));toast('Текст диктовки вернулся в поле')},1000);
setInterval(function(){if(document.getElementById('hcin')&&!document.hidden)vcWarm()},5000);
function vcMime(){var L=['audio/webm;codecs=opus','audio/webm','audio/mp4','audio/ogg;codecs=opus'];if(!window.MediaRecorder)return '';for(var i=0;i<L.length;i++){try{if(MediaRecorder.isTypeSupported(L[i]))return L[i]}catch(e){}}return ''}
function vcBtn(){return document.querySelector('[data-hc=mic]')}
function vcFmt(){var s=Math.floor((Date.now()-VC.t0)/1000);return Math.floor(s/60)+':'+('0'+s%60).slice(-2)}
function vcUi(){var b=vcBtn();if(!b)return;var rec=!!VC.rec,bz=VC.busy;b.classList.toggle('rec',rec);b.innerHTML=bz?'<span style="font:600 11px JetBrains Mono,monospace">…</span>':rec?IC('square')+'<span class="vct">'+vcFmt()+'</span>':IC('mic');
 var ta=document.getElementById('hcin');if(ta)ta.classList.toggle('vclive',rec||bz)}
function vcSet(t){var ta=document.getElementById('hcin');if(!ta)return;ta.value=VC.base+t;ta.dispatchEvent(new Event('input',{bubbles:true}));ta.scrollTop=ta.scrollHeight}
function vcFail(m){VC.busy=false;VC.rec=null;clearInterval(VC.tick);vcUi();toast(m)}
function vcBlob(){return new Blob(VC.chunks,{type:VC.mime.split(';')[0]})}
function vcSend(blob,partial,cb){var fr=new FileReader();fr.onload=function(){VJ('/transcribe',{audio:fr.result,lang:'ru',partial:!!partial}).then(cb,function(e){cb(null,e)})};fr.onerror=function(){cb(null,new Error('не удалось прочитать запись'))};fr.readAsDataURL(blob)}
/* v9.9: таймер 4 раза в секунду (раньше раз в 1,5 с и прыгал 40→42→44), черновик не чаще раза в 1,2 с, лимит записи 5 мин */
function vcTime(){var b=vcBtn(),t=b&&b.querySelector('.vct');if(t&&VC.rec){var f=vcFmt();if(t.textContent!=f)t.textContent=f}else vcUi()}
/* v10.5 быстрая диктовка: у записи id (rid), на ПК уходят только НОВЫЕ байты (off = сколько уже лежит на сервере),
   сервер склеивает файл и распознаёт черновик только по хвосту ~18 с поверх готового текста; финал — вся запись (точно).
   Черновик сразу, как пришёл прошлый ответ и есть новые данные (не чаще 300 мс), MediaRecorder режет по 500 мс. */
function vcPost(body){var ac=window.AbortController?new AbortController():null,tm=ac?setTimeout(function(){ac.abort()},170000):0;return fetch(API.replace(/\/$/,'')+'/api/hc/transcribe',{method:'POST',headers:{'X-Init-Data':tg?tg.initData:'','Content-Type':'application/json'},body:JSON.stringify(body),signal:ac?ac.signal:undefined}).then(function(r){return r.json().catch(function(){return{}}).then(function(j){clearTimeout(tm);return{s:r.status,j:j}})},function(e){clearTimeout(tm);throw e})}
function vcPiece(blob,cb){var fr=new FileReader();fr.onload=function(){var u=String(fr.result);if(!/^data:audio\//.test(u))u='data:'+VC.mime.split(';')[0]+';base64,'+u.split(',')[1];cb(u)};fr.onerror=function(){cb(null)};fr.readAsDataURL(blob)}
function vcChunk(final,cb){var blob=vcBlob(),from=VC.off,piece=blob.slice(from);var my=++VC.seq;
 vcPiece(piece.size?piece:new Blob([],{type:VC.mime.split(';')[0]}),function(u){if(u==null)return cb(null,new Error('не удалось прочитать запись'));
  if(!piece.size)u='data:'+VC.mime.split(';')[0]+';base64,';
  vcPost({rid:VC.rid,off:from,chunk:u,lang:'ru',partial:!final,final:!!final}).then(function(x){
   if(x.s==200){VC.off=from+piece.size;return cb(x.j,null,my)}
   if(x.s==409&&x.j&&typeof x.j.size=='number'){VC.off=x.j.size<=blob.size?x.j.size:0;return cb(null,{retry:true},my)}
   cb(null,new Error(x.s==401?'подпись устарела, открой панель заново':(x.j&&(x.j.detail||x.j.error))||('HTTP '+x.s)),my)},function(e){cb(null,e,my)})})}
function vcPartial(){if(!VC.rec||VC.fly||!VC.chunks.length||Date.now()-VC.t0<800||Date.now()-(VC.lp||0)<300)return;
 if(vcBlob().size<=VC.off)return;VC.lp=Date.now();VC.fly=true;
 vcChunk(false,function(d,err,my){VC.fly=false;if(d&&d.text&&VC.rec&&my==VC.seq)vcSet(d.text)})}
function vcFinal(blob,done){var n=0;(function go(){if(VC.fly&&n++<200)return setTimeout(go,50);
  vcChunk(true,function(d,err){if(d)return done(d,null);if(err&&err.retry&&n++<210)return go();
   vcSend(blob,false,done)})})()}
function vcStop(){clearTimeout(VC.timer);if(VC.rec&&VC.rec.state!='inactive'){try{VC.rec.requestData();VC.rec.stop()}catch(e){}}}
function vcStart(){
 if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia||!window.MediaRecorder||!vcMime()){toast('Микрофон недоступен в этом Telegram. Используй значок микрофона на клавиатуре iOS: он вставит текст в то же поле');return}
 navigator.mediaDevices.getUserMedia({audio:true}).then(function(stream){
  var ta=document.getElementById('hcin');VC.base=ta&&ta.value?(/\s$/.test(ta.value)?ta.value:ta.value+' '):'';
  VC.stream=stream;VC.gen++;VC.sid=(window.HC&&HC.st&&HC.st.sid)||'';vcWarm();VC.chunks=[];VC.mime=vcMime();VC.seq=0;VC.fly=false;VC.off=0;VC.rid='r'+Date.now().toString(36)+Math.random().toString(36).slice(2,8);var r=new MediaRecorder(stream,{mimeType:VC.mime});VC.rec=r;VC.t0=Date.now();
  r.ondataavailable=function(e){if(e.data&&e.data.size)VC.chunks.push(e.data)};
  r.onstop=function(){stream.getTracks().forEach(function(t){t.stop()});clearInterval(VC.tick);var blob=vcBlob(),ms=Date.now()-VC.t0,gen=VC.gen;VC.rec=null;VC.seq++;
   if(ms<700||blob.size<800){vcSet('');vcFail('Слишком коротко: держи запись, пока говоришь');return}
   VC.busy=true;VC.tb=Date.now();vcBusyStart();vcUi();
   vcFinal(blob,function(d,err){if(gen!=VC.gen)return;VC.busy=false;vcBusyStop();vcUi();
    cbDiag('voice',{rec:ms,stt:Date.now()-VC.tb,ok:err?0:1,err:err?String(err.message||err).slice(0,50):'',ch:d&&d.text?d.text.length:0,sw:(VC.sid&&window.HC&&HC.st&&HC.st.sid&&HC.st.sid!=VC.sid)?1:0});
    if(err){toast('Не удалось распознать: '+esc(String(err.message||err).slice(0,80)));return}
    var t=((d&&d.text)||'').trim();if(!t){vcSet('');toast('Речь не распознана');return}
    if(VC.sid&&window.HC&&HC.st&&HC.st.sid&&HC.st.sid!=VC.sid&&!/^s4new-/.test(VC.sid)){vcStash(VC.sid,t);return}vcSet(t);var ta2=document.getElementById('hcin');/*vb7a П1-в: на телефоне без программного фокуса — клавиатура не мигает, лента не прыгает*/if(ta2&&!(window.matchMedia&&matchMedia('(pointer:coarse)').matches)&&!(window.G3&&G3.G&&G3.G.sendAfter)&&!(window.CL3&&CL3.G&&CL3.G.sendAfter))ta2.focus();toast('<b>'+IC('check')+'</b> Текст готов, проверь и отправь')})};
  r.start(500);vcUi();VC.lp=0;VC.tick=setInterval(function(){vcTime();vcPartial()},100);VC.timer=setTimeout(vcStop,600000);
 }).catch(function(e){var n=e&&e.name||'';toast(n=='NotAllowedError'||n=='SecurityError'?'Нет доступа к микрофону. Разреши его в настройках iOS для Telegram или диктуй с клавиатуры':'Микрофон недоступен: '+esc(n||'ошибка'))})}
document.addEventListener('click',function(ev){var el=ev.target.closest('[data-hc=mic]');if(!el)return;ev.stopPropagation();if(VC.busy)return;if(VC.rec)vcStop();else vcStart()},true);
