/* focus-ui (решение владельца 28.11): плитки категорий — во вкладке «Проекты», не на Пульте (Пульт = только «Нужно тебе»).
   Сверху вкладки — плитки «Работа / Свои / Обвязка» (сколько проектов, ждёт ли что-то, имена) и строка «Тесты».
   Тап по плитке — тот же список вкладки (группы «Требуют тебя / Работают / Свободны», фильтр агентов) только по этой категории;
   «‹ Все проекты» — назад. «Разложить» — перенос проекта в другую категорию (кнопка у строки, бэкенд pcat).
   Подключается после g5_prj.js и fx_home.js (берёт помощники FX21). */
(function(){
 var W=window,D=document,F=W.FX21;if(!F||typeof W.prjTab86!='function')return;
 var E=F.E,CATS=[['work','Работа'],['own','Свои'],['rig','Обвязка']],P0=W.prjTab86,PJ=W.proj8,ST={cat:null,edit:0};
 function nProj(n){return n+' '+(n%10==1&&n%100!=11?'проект':n%10>=2&&n%10<=4&&(n%100<10||n%100>=20)?'проекта':'проектов')}
 function of(k){return (S.prj||[]).filter(function(p){return (p.cat||'own')==k})}
 function waits(p){return p.st=='wait'||p.st=='bad'||(p.wait&&/^(q|perm|bad|card|end)$/.test(p.wait.k))}
 function tile(c){var L=of(c[0]);if(!L.length)return '';var w=L.filter(waits).length,go=L.filter(function(p){return p.st=='work'}).length;
  var st=w?'<em class="fxp-r">● '+w+' '+(w==1?'ждёт тебя':'ждут тебя')+'</em>':go?'<em class="fxp-g">▶ '+go+' работает</em>':'<em>всё тихо</em>';
  return '<div class="fxp-tile tap'+(w?' red':'')+'" data-a="fxpcat" data-k="'+c[0]+'"><b>'+c[1]+'</b><span>'+nProj(L.length)+'</span>'+st+
   '<small>'+E(L.slice(0,3).map(function(p){return p.n}).join(', ')+(L.length>3?' и ещё '+(L.length-3):''))+'</small></div>'}
 function tiles(){var h=CATS.map(tile).join(''),T=S.prj_hid||[];
  return '<div class="fxp-tiles">'+h+'</div>'+(T.length?'<div class="sec"><div class="grp"><div class="rw86 tap" data-a="fxpcat" data-k="test"><div class="t2"><div class="n2">Тесты</div><div class="d2">'+T.length+' тестовых папок · скрыты</div></div><i class="g4ch">›</i></div></div></div>':'')}
 function edit(){return '<div class="sec"><div class="sh"><span>Разложить по категориям</span><a data-a="fxpedit">Готово</a></div><div class="fxp-hint">Тапни по метке — проект переедет в следующую категорию.</div></div>'+
  '<div class="sec"><div class="grp">'+(S.prj||[]).map(function(p){return '<div class="rw86"><div class="t2"><div class="n2">'+E(p.n)+'</div></div>'+
   F.pl('fx21cat',F.catN(p.cat||'own')+' ▾',{x:p.id,c:p.cat||'own'},'fx21cp')+'</div>'}).join('')+'</div></div>'}
 W.prjTab86=function(){
  if(ST.edit)return hd()+edit();
  var k=ST.cat;if(k&&k!='test'&&!of(k).length)k=ST.cat=null;
  if(!k)return P0().replace(/(<div class="chp5">)/,tiles()+'<div class="sec fxp-all"><div class="sh"><span>Все проекты</span><a data-a="fxpedit">Разложить</a></div></div>$1');
  var nm=k=='test'?'Тесты':F.catN(k),head='<div class="fxp-back tap" data-a="fxpback">‹ Все проекты</div><div class="fxp-title">'+E(nm)+'</div>';
  if(k=='test')return hd()+head+'<div class="sec"><div class="grp">'+(S.prj_hid||[]).map(function(p){return '<div class="rw86 tap" data-a="po86" data-x="'+E(p.id)+'"><div class="t2"><div class="n2">'+E(p.n)+'</div><div class="d2">тестовая папка</div></div></div>'}).join('')+'</div></div>';
  var ids={};of(k).forEach(function(p){ids[p.id]=1});
  W.proj8=function(){return PJ().filter(function(p){return ids[p.id]})};try{return hd()+head+agStrip86()+listA2()}finally{W.proj8=PJ}};
 D.addEventListener('click',function(ev){var t=ev.target.closest&&ev.target.closest('[data-a]');if(!t||!/^fxp/.test(t.dataset.a))return;
  ev.stopPropagation();ev.preventDefault();var a=t.dataset.a;if(W.haptic)haptic('sel');
  if(a=='fxpcat'){ST.cat=t.dataset.k;U.pf='all'}else if(a=='fxpback'){ST.cat=null}else if(a=='fxpedit'){ST.edit=!ST.edit}
  render(true);window.scrollTo(0,0)},true);
 /* нижняя вкладка «Проекты» повторным тапом — к плиткам */
 D.addEventListener('click',function(ev){var t=ev.target.closest&&ev.target.closest('[data-a=tab][data-x=prj]');if(t&&U.tab=='prj'){ST.cat=null;ST.edit=0}},true);
 W.FXP={st:ST};
})();
