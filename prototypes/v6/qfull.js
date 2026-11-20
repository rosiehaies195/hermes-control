/* v9.3: полная карточка вопроса прямо на Пульте / в проекте.
   С v8.7 вкладки «Вопросы» нет (prj.js переводит U.tab=='q' на Пульт), а короткая карточка qAlert давала только готовые варианты:
   «Свой ответ», «Пропустить» и подробности разрешения стали недоступны. Здесь: чип «Другое…» (у разрешения с командой — «Подробнее…»)
   раскрывает боевую qcard() на месте короткой карточки; «Свернуть» возвращает короткую. Ответ уходит теми же qsel/qsub/qskip. */
(function(){
 var _chips=qChips;
 qChips=function(q){var h=_chips(q);if(q.perm&&!q.cmd)return h;
  var more='<span class="more" data-a="openq" data-q="'+q.id+'">'+(q.perm?'Подробнее…':'Другое…')+'</span>';
  return h.replace(/<\/div>$/,more+'</div>')};
 var _qa=qAlert;
 qAlert=function(q){if(U.qopen93!=q.id)return _qa(q);
  return '<div class="qf93">'+qcard(q)+'<div class="qx93" data-a="qclose93" data-q="'+q.id+'">Свернуть</div></div>'};
 var _send=send;send=function(o,q){if(o&&o.a=='ans'&&o.q==U.qopen93)U.qopen93=null;return _send.apply(this,arguments)};
 document.addEventListener('click',function(ev){var el=ev.target.closest('[data-a]');if(!el)return;var a=el.dataset.a,qid=el.dataset.q;
  if(a!='openq'&&a!='qclose93')return;ev.stopPropagation();ev.preventDefault();haptic('sel');
  if(a=='qclose93'){U.qopen93=null;render(true);return}
  var q=S.pend.filter(function(z){return z.id==qid})[0];if(!q)return;
  U.qopen93=qid;U.qsel=U.qsel||{};U.qsel[qid]=q.perm?{}:{k:'o'};render(true);
  setTimeout(function(){var c=document.getElementById('q-'+qid);if(c)c.scrollIntoView({block:'center',behavior:'smooth'});
   var i=document.querySelector('[data-in=other][data-q="'+qid+'"]');if(i)i.focus({preventScroll:true})},60)},true);
})();
