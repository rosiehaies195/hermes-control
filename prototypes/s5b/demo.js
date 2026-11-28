/* только прототип s5b (в боевую сборку не входит): ?demo=1 — в открытом чате учебная карточка разрешения;
   ответ на неё перехватывается и НЕ уходит агенту, вместо этого — подсказка, что ушло бы. */
(function(){var W=window,D=document;if(!/[?&]demo=1/.test(location.search))return;
 var DID='demo1',off=0;
 var of=W.fetch;W.fetch=function(u,o){if(typeof u=='string'&&/\/approval/.test(u)&&((o&&o.body)||'').indexOf('"request_id":"demo')>=0){
   var c=JSON.parse(o.body).choice;off=1;DID='demo'+Date.now();
   setTimeout(function(){try{toast(c=='session'?'Тест: ушло бы «Разрешать всегда» — агенту ничего не отправлено':c=='once'?'Тест: ушло бы «Разрешить один раз»':'Тест: ушло бы «'+c+'»')}catch(e){}
    HC.st.pend=[];paint();setTimeout(function(){off=0;paint()},3000)},50);
   return Promise.resolve(new Response('{"ok":true}',{status:200,headers:{'Content-Type':'application/json'}}))}return of.apply(this,arguments)};
 function inj(){var s=W.HC&&HC.st;if(off||!s||s.view!='chat'||s.loadingMsgs)return;if(s.pend&&s.pend.some(function(x){return x.id==DID}))return;
  s.run=s.run||'demo_run';s.pend=(s.pend||[]).concat([{id:DID,kind:'approval',tool:'Bash',text:'rm -rf build && npm run build',desc:'Учебная карточка — агенту ничего не уйдёт'}])}
 function paint(){try{HC.paint()}catch(e){}try{var s=HC.st;(s.kind=='claude'?CL3:G3).draw()}catch(e){}}
 var t=setInterval(function(){if(!W.HC||!HC.paint)return;clearInterval(t);var op=HC.paint;HC.paint=function(){inj();return op.apply(this,arguments)};
  setInterval(function(){var s=HC.st;if(!off&&s.view=='chat'&&!s.loadingMsgs&&!(s.pend||[]).some(function(x){return x.id==DID})){inj();paint()}},1000)},200);
})();
