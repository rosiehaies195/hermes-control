"""Build index.html for v6 from the deployed v5.1 page (index.v5.1.html.bak) + v6/hc.css + v6/hc.js.
Usage: python prototypes/v6/make_app.py [out]   (default: prototypes/v6-app.html)"""
import sys
from pathlib import Path
R = Path("C:/Users/Peter/hermes-control")
src = (R / "index.v5.1.html.bak").read_text(encoding="utf-8")
css = "\n".join((R / ("prototypes/v6/" + n)).read_text(encoding="utf-8") for n in ("hc.css", "multi.css", "prj.css", "glass.css", "glassui.css", "cx.css", "qfull.css", "voicefix.css", "sw35.css", "g3_chat.css", "g3_claude.css", "g3_side.css", "g4_home.css", "g5_prj.css"))
js = "\n".join((R / ("prototypes/v6/" + n)).read_text(encoding="utf-8") for n in ("hc_p5.js", "search.js", "ms.js", "voice.js", "design8.js", "stale.js", "rc.js", "multi.js", "prj.js", "glass.js", "glassui.js", "cx.js", "qfull.js", "auto.js", "s3.js", "sw35.js", "g3_icons.js", "g3_chat.js", "g3_cl_icons.js", "g3_claude.js", "g3_sd_icons.js", "g3_side.js", "g4_icons.js", "g4_home.js", "g5_prj.js"))
VER = 110
# extra files for prototypes: python make_app.py <out> [file.js|file.css ...] (paths relative to hermes-control)
for _x in sys.argv[2:]:
    _t = (R / _x).read_text(encoding="utf-8")
    if _x.endswith(".css"):
        css += "\n" + _t
    else:
        js += "\n" + _t

def rep(old, new, cnt=1):
    global src
    assert src.count(old) == cnt, (src.count(old), old[:80])
    src = src.replace(old, new)

# icons used by the chat (Lucide paths)
ICONS = {
 "forward": '<polyline points="15 17 20 12 15 7"/><path d="M4 18v-2a4 4 0 0 1 4-4h12"/>',
 "code": '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
 "type": '<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" x2="15" y1="20" y2="20"/><line x1="12" x2="12" y1="4" y2="20"/>',
 "copy": '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
 "mic": '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>',
 "refresh-cw": '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
 "plus": '<path d="M5 12h14"/><path d="M12 5v14"/>',
 "paperclip": '<path d="m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551"/>',
 "trash-2": '<path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
 "monitor": '<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>',
 "git-branch": '<path d="M15 6a9 9 0 0 0-9 9V3"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>',
 "chevron-left": '<path d="m15 18-6-6 6-6"/>',
 "ellipsis": '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
 "eye": '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
 "pin": '<path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/>',
 "chevron-right": '<path d="m9 18 6-6-6-6"/>',
 "chevron-down": '<path d="m6 9 6 6 6-6"/>',
 "image": '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
}
import json
add = "".join("ICP[%s]=%s;" % (json.dumps(k), json.dumps(v)) for k, v in ICONS.items())
rep("function IC(n,c){", add + "\nfunction IC(n,c){")

# version
rep("var VER=51;", "var VER=%d;" % VER)
rep("Версия страницы: v5 ('+VER+')", "Версия страницы: v6 ('+VER+')")

# render(): chat tab shell; polls (keep=true) must not rebuild the page while the chat is on screen
rep("function render(keep){var top=window.scrollY,h;\n if(LOADING)h=skeleton();",
    "function render(keep){var top=window.scrollY,h;\n if(keep&&!LOADING&&window.HC&&HC.mounted()&&(U.tab=='hc'&&!U.page||U.page=='hcchat'))return;\n if(LOADING)h=skeleton();\n else if(window.HC&&U.tab=='hc'&&(!U.page||U.page=='hcchat'))h=HC.shell();")
rep("$('scr').innerHTML=h;window.scrollTo(0,keep?top:0);", "$('scr').innerHTML=h;window.scrollTo(0,keep?top:0);if(window.HC)HC.after();")
# nav: new tab after «Вопросы»
rep("['q',IC('message-circle-question'),'Вопросы'],", "['q',IC('message-circle-question'),'Вопросы'],['hc',IC('message-square-text'),'Чат'],")
# карточка «Hermes в браузере» (Webapp :8443) убрана: её заменил чат во вкладке
rep("function hermesCard(){if(!S.wa)return '';", "function hermesCard(){return '';")
# быстрая кнопка на Пульте «Чат» = чат с Claude -> «Claude» (вкладка «Чат» теперь у Hermes)
rep("['chat',''+IC('message-square-text')+'','Чат',0]", "['chat',''+IC('message-square-text')+'','Claude',0]")
# Back button: inside chat -> list
rep("function back(){var p=U.page||'';", "function back(){if(U.page=='hcchat'&&window.HC){HC.leave();return}var p=U.page||'';")
# tab switch must leave chat page state
rep("case 'tab':U.tab=x;U.page=null;U.seg=-1;render();return;", "case 'tab':if(window.HC&&U.tab=='hc'&&x=='hc'&&HC.st.view=='chat'){HC.leave();return}U.tab=x;U.page=(window.HC&&x=='hc'&&HC.st.view=='chat')?'hcchat':null;U.seg=-1;render();return;")
# 14-day token chart (v6.4)
rep("function tokens(){", '\nfunction tok14(){var T=S.tok14;if(!T||!T.v||!T.sum)return \'\';var COL=[\'var(--gold)\',\'var(--codex)\',\'var(--claude)\',\'var(--ok)\',\'var(--dim)\'],mx=1,i,j,tot=T.v.map(function(r){var a=r.reduce(function(x,y){return x+y},0);mx=Math.max(mx,a);return a});\n var bars=T.v.map(function(r,k){var a=tot[k];return \'<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;min-width:0"><div style="height:80px;width:100%;display:flex;flex-direction:column-reverse" title="\'+T.d[k]+\': \'+(a/1000).toFixed(1)+\' млн">\'+r.map(function(x,j){return x?\'<i style="display:block;width:100%;height:\'+Math.max(1,Math.round(x/mx*80))+\'px;background:\'+COL[j]+\'"></i>\':\'\'}).join(\'\')+\'</div><span style="font:9px \\\'JetBrains Mono\\\',monospace;color:var(--dim)">\'+(k%2==(T.v.length-1)%2?T.d[k].slice(0,2):\'\')+\'</span></div>\'}).join(\'\');\n var leg=T.j.map(function(x,j){return \'<div class="trow"><span><i style="display:inline-block;width:9px;height:9px;border-radius:2px;margin-right:8px;background:\'+COL[j]+\'"></i>\'+esc(x.n)+\'</span><b class="mono">\'+(x.k/1000).toFixed(1)+\' млн</b></div>\'}).join(\'\');\n var avg=T.v.slice(-7).reduce(function(a,r,k){return a+tot[T.v.length-7+k]},0)/7;\n return \'<div class="tok"><div class="top"><b>\'+(T.sum/1000).toFixed(1)+\' млн</b><span class="w okk">за 14 дней</span></div><div style="display:flex;gap:3px;align-items:flex-end;margin-top:10px">\'+bars+\'</div><div style="margin-top:10px">\'+leg+\'</div><div style="font-size:12.5px;color:var(--mut);margin-top:8px">в среднем \'+(avg/1000).toFixed(1)+\' млн в сутки за последние 7 дней</div></div>\'}\n' + "function tokens(){")
rep("+tokens()+autoGrp()", "+tokens()+colSec('tok14','Токены · 14 дней',tok14(),S.tok14&&S.tok14.sum?(S.tok14.sum/1000).toFixed(1)+' млн':'')+autoGrp()")
# search everywhere (v6.6)
rep(">в тексте файлов</span>", ">везде: файлы, журнал, чаты</span>")
# css + js
rep("</style>\n</head>", css + "\n</style>\n</head>")
rep("</script>\n</body>", "</script>\n<script>\n" + js + "\n</script>\n</body>")
out = Path(sys.argv[1]) if len(sys.argv) > 1 else R / "prototypes/v6-app.html"
out.write_text(src, encoding="utf-8")
print("built", out, len(src))
