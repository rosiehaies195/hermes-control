/* v8: дизайн-система — журнал плотными строками, режим «просто|тех» в Настройках */
var _modeBar=modeBar;modeBar=function(){return document.body.classList.contains('showmode')?_modeBar():''};
var _set8=settings;settings=function(){document.body.classList.add('showmode');var h;try{h=_set8()}finally{}return h};
var _rd8=render;render=function(k){document.body.classList.toggle('showmode',U.tab=='set'&&!U.page);_rd8(k)};
function sessRows8(){var L=realSess().slice().reverse();if(!L.length)return '<div class="empty">Сессий пока нет</div>';var day='',h='',open=false;
 L.forEach(function(s){var d=dayName(s.b);if(d!=day){if(open)h+='</div>';h+='<div class="jday">'+d+'<span>'+L.filter(function(z){return dayName(z.b)==d}).length+' шагов</span></div><div class="grp">';day=d;open=true}
  var min=((s.e||nowS())-s.b)/60,run=!s.e,err=s.f>0;
  h+='<div class="jr '+(run?'run':err?'err':'')+'" data-a="sess" data-x="'+s.id+'"><span class="jd"></span><div class="jt"><div class="jn">'+esc(s.n)+'</div><div class="js">'+hm(s.b)+'–'+(run?'сейчас':hm(s.e))+' · '+dur(min)+'</div></div>'+
   '<div class="jv'+(err?' bad':'')+'">'+(err?s.f+' сбой':s.q?s.q+' вопр.':'')+(s.tok?'<small>'+(s.tok/1000).toFixed(1)+' млн</small>':'')+'</div></div>'});
 return h+(open?'</div>':'')}
function evRows8(){loadLog();var LOG=U.flog||S.log,f=JF.filter(function(x){return x[0]==U.jf})[0],q=(U.jq||'').toLowerCase(),L=LOG.filter(function(e){return (!f[2]||f[2].indexOf(e.k)>=0)&&(!q||e.x.toLowerCase().indexOf(q)>=0)});
 return '<div class="seg2" style="margin-top:10px">'+JF.map(function(x){return '<span data-a="jf" data-x="'+x[0]+'" class="'+(U.jf==x[0]?'on':'')+'">'+x[1]+'</span>'}).join('')+'</div>'+
  '<div class="jsearch"><input class="in" data-in="jq" placeholder="Поиск по журналу" value="'+esc(U.jq||'')+'"></div>'+
  '<div class="sec"><div class="grp feed">'+(L.length?L.slice(0,60).map(function(e){return evRow(e,q)}).join(''):'<div class="row" style="color:var(--mut)">Ничего не найдено</div>')+'</div></div>'}
journal=function(){return hd()+'<div class="ph2"><h2>Журнал</h2></div><div class="seg2 two">'+[['sess','Шаги'],['ev','События']].map(function(t){return '<span data-a="jt" data-x="'+t[0]+'" class="'+(U.jt==t[0]?'on':'')+'">'+t[1]+'</span>'}).join('')+'</div>'+(U.jt=='sess'?sessRows8():evRows8())};
