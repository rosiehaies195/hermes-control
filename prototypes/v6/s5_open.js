/* s5-open (этап 5, п.1): «Открыть панель» из бота сразу на нужном чате.
   Бот кладёт в хэш c=<агент>:<id чата> (агент = claude|codex|hermes), панель открывается на вкладке «Чат» в этом чате.
   Пока чат ищется в списке, экран «Чат» прикрыт (body.sd3ent, как при обычном входе), Пульт не мелькает.
   Не нашли за 6 с — открываем по id (Claude/Codex читают историю по id; Hermes-чаты из бота живут на ПК → src local). */
(function(){var W=window,D=document;
 var c=(W.HP&&HP.get('c'))||'',i=c.indexOf(':'),k=i>0?c.slice(0,i):'',id=i>0?c.slice(i+1):'';
 if(!id||['claude','codex','hermes'].indexOf(k)<0)return;
 var NM={claude:'Claude',codex:'Codex',hermes:'Hermes'},t0=Date.now(),asked=0,opened=0;
 W.S5O={k:k,id:id,st:'wait'};
 try{LS.set('sd3last',{k:k,id:id})}catch(e){}/* обычный вход (entStart) тоже выберет этот чат */
 try{U.tab='hc';U.page=null}catch(e){}
 try{if(W.HC&&HC.st.kind!=k){HC.st.kind=k;LS.set('hckind',k);HC.st.sessions=null;HC.st.models=null}}catch(e){}
 function cover(on){if(D.body)D.body.classList.toggle('sd3ent',on)}
 cover(true);
 function done(ok,why){W.S5O.st=ok?'ok':'fail';W.S5O.why=why||'';W.S5O.ms=Date.now()-t0;cover(false)}
 function inL(){var L=W.SD3&&SD3.SD.L[k];return !!(L&&L.some(function(x){return x.id==id}))}
 function put(row){var L=(SD3.SD.L[k]||[]).filter(function(x){return x.id!=id});row.k=k;L.unshift(row);SD3.SD.L[k]=L}
 function at(){var s=W.HC&&HC.st;return !!(s&&s.view=='chat'&&s.kind==k&&s.sid==id)}
 function go(){
  if(at()){done(true,opened?'':'entry');return}
  if(Date.now()-t0>15000){done(false,'timeout');return}
  if(W.LOADING||!W.SD3||!W.HC||!W.U||!SD3.SD){setTimeout(go,100);return}
  if(opened){setTimeout(go,150);return}
  if(inL()){opened=1;SD3.openChat(k,id);setTimeout(go,150);return}
  /* в кэше списка нет (чат новее кэша) — открываем сразу по id: Claude/Codex читают историю по id, чаты Hermes из бота
     живут на ПК (src local → пишем через владельца). Название подтянется, когда придёт свежий список (tsync). */
  put({id:id,t:NM[k],ts:Date.now()/1000|0,src:k=='hermes'?'local':k,rw:false,dw:true,cc:k!='hermes'});W.S5O.fb=1;opened=1;SD3.openChat(k,id);
  if(k=='hermes')/* чаты Hermes с ПК есть только в полном списке (?all=1), меню по умолчанию грузит «Панель» */
   SD3.api('/sessions?all=1&limit=100').then(function(d){var x=(d.s||[]).filter(function(y){return y.id==id})[0],s=HC.st;
    if(x&&s.sid==id&&s.kind==k){if(x.t&&x.t!=s.title){s.title=x.t;try{HC.paint()}catch(e){}}if(x.src)s.src=x.src}}).catch(function(){});
  else SD3.load(true);
  setTimeout(go,150)}
 setTimeout(go,0);
})();
