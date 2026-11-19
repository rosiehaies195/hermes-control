/* Вариант В «Сетка карточек»: один проект = одна карточка. Ждущие тебя карточки на всю ширину с вопросом и кнопками,
   работающие по две в ряд (статус + прогресс), свободные одной строкой чипов. Тап по карточке открывает шторку с деталями. */
function cardWait8(p){var q=p.q[0];
 return '<div class="card8 wide '+p.st+'"><div class="ch8" data-a="pc" data-x="'+p.id+'">'+AB8(p,'s8')+'<b class="pn8">'+esc(p.n)+'</b>'+demoTag8(p)+'<span class="sp8"></span>'+pill8(p)+'</div>'+
  (q?'<div class="q">'+esc(q.q)+'</div>'+qChips8(p,q)+(p.q.length>1?'<div class="d" style="margin-top:6px">ещё вопросов в проекте: '+(p.q.length-1)+'</div>':''):'<div class="q">'+esc(p.sub)+'</div><div class="chips" style="margin-top:8px"><span data-a="d8" data-x="open">Открыть ›</span></div>')+
  (p.total?'<div class="ms8"><span>'+esc(p.ms)+'</span><span>'+p.done+' из '+p.total+'</span></div>'+prog8(p,4):'')+'</div>'}
function cardWork8(p){return '<div class="card8 sq" data-a="pc" data-x="'+p.id+'"><div class="ch8">'+AB8(p,'s8')+'<span class="sp8"></span><span class="dot ok"></span></div><div class="cn8">'+esc(p.n)+demoTag8(p)+'</div><div class="cs8">'+esc(p.sub)+'</div>'+(p.total?'<div class="ms8"><span>'+esc(p.ms)+'</span><span>'+p.done+'/'+p.total+'</span></div>'+prog8(p,4):'<div class="ms8"><span>без вехи</span></div>')+'</div>'}
function homeC(){var V=proj8(),need=V.filter(waiting8),work=V.filter(function(p){return p.st=='work'}),idle=V.filter(function(p){return p.st=='idle'});
 return hd()+updBanner()+netBanner()+demobar8()+sum8()+
  (need.length?'<div class="sec" style="margin-top:6px"><div class="sh"><span>Требуют тебя · '+need.length+'</span></div></div>'+need.map(cardWait8).join(''):'')+
  (work.length?'<div class="sec" style="margin-top:12px"><div class="sh"><span>Работают · '+work.length+'</span><a data-a="d8" data-x="add">+ добавить</a></div></div><div class="grid8">'+work.map(cardWork8).join('')+'</div>':'')+
  (idle.length?'<div class="sec" style="margin-top:12px"><div class="sh"><span>Свободны · '+idle.length+'</span></div></div><div class="chips g idle8">'+idle.map(function(p){return '<span data-a="pc" data-x="'+p.id+'">'+AB8(p,'xs8')+esc(p.n)+'</span>'}).join('')+'</div>':'')+common8()}
var _h0=home;home=function(){return homeC()};
