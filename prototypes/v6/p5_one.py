"""Stage 5 p.4 front-end patch (decision 12: phone and PC = ONE chat): applied to hc_p5.js after p5_patch.py.
 - PC-owned chats (Claude/Codex/Hermes Desktop) get the SAME full composer as panel chats: photo, model + effort
   (Claude, Hermes; not Codex - it cannot be set from outside), voice, stop (button turns into a square while the PC
   answers and nothing is typed).
 - No texts about where the chat lives / where the message goes ("чат на ПК", "уйдёт в …", "Передаю в …",
   "Чат создан в …", the menu hint, "в чат на ПК · / продолжу в копии ·" in Forward, "ИЗ ПАНЕЛИ · МОИ КОПИИ").
Run: python p5_patch.py && python p5_one.py
"""
from pathlib import Path
D = Path("C:/Users/Peter/hermes-control/prototypes/v6")
F = D / "hc_p5.js"
t = F.read_text(encoding="utf-8")
if "/*p5one*/" in t:
    raise SystemExit("already patched (re-run p5_patch.py first)")
n = 0


def rep(old, new):
    global t, n
    assert t.count(old) == 1, (t.count(old), old[:100])
    t = t.replace(old, new)
    n += 1


# subtitle under the chat name: model / agent name, "отвечает…" while the PC answers
rep("""function subTxt(){if(st.kind!='hermes'&&!st.rw)return st.cclive?'идёт сейчас · чат на ПК':'чат на ПК';return st.rw?(st.models||st.msel?chipTxt():agentName()):(deskOK()?'чат на ПК':'только чтение')}""",
    """function subTxt(){/*p5one*/if(!st.rw&&deskOK())return deskRun()?'отвечает…':(st.kind!='codex'&&st.msel&&st.msel.m?chipTxt():agentName());return st.rw?(st.models||st.msel?chipTxt():agentName()):'только чтение'}
function deskRun(){return st.kind=='hermes'?!!(st.cur&&st.cur.live):!!st.cclive}
function sendBtn(){var s=document.getElementById('hcsend');if(!s)return;var dk=!st.rw&&deskOK(),idle=!(st.draft||'').trim()&&!st.imgs.length,stp=dk?(deskRun()&&idle):st.busy;
 s.className='hcsendb'+(stp?' stop':'')+(dk&&st.dsending?' wait':'');s.innerHTML=stp?IC('square'):IC('arrow-up')}""")
# model chips: not for Codex PC chats (model cannot be set from outside)
rep("""function chipsHtml(){return '""", """function chipsHtml(){if(!st.rw&&st.kind=='codex')return '';return '""")
rep("""var s=document.getElementById('hcsend');if(s){s.className='hcsendb'+(st.busy?' stop':'');s.innerHTML=st.busy?IC('square'):IC('arrow-up')}""",
    """sendBtn();""")
# one full composer for panel chats AND PC chats
rep("""<div id="hcsend" class="hcsendb" data-hc="send"></div></div></div>':deskOK()?ccComp():'<div class="hcro">""",
    """<div id="hcsend" class="hcsendb" data-hc="send"></div></div></div>':'<div class="hcro">""")
rep("""(st.rw?'<div class="hccomp"><div id="hcthumbs\"""", """(st.rw||deskOK()?'<div class="hccomp"><div id="hcthumbs\"""")
# send / stop for PC chats
rep("""function send(){if(st.kind!='hermes'&&!st.rw){ccSend();return}if(st.busy){stop();return}""",
    """function send(){if(!st.rw&&deskOK()){if(deskRun()&&!(st.draft||'').trim()&&!st.imgs.length){deskStop();return}ccSend();return}if(st.busy){stop();return}""")
rep("""function ccSend(){var t=(st.draft||'').trim();if(!t||!live()||st.dsending)return;
 if(!st.rw&&st.sid&&deskOK()){var o=st.sid,k=st.kind;st.dsending=true;paint();toast('Передаю в '+DESK[k]+'…');
  J(base()+'/sessions/'+encodeURIComponent(o)+'/desk',{method:'POST',body:{t:t}}).then(function(d){st.dsending=false;if(st.sid!=o)return;st.draft='';var ta=document.getElementById('hcin');if(ta){ta.value='';grow(ta)}st.stick=true;toast(E(d.text||'Отправлено'));haptic('success');paint();""",
    """function deskStop(){var o=st.sid;if(!o||!live())return;toast('Останавливаю…');
 J(base()+'/sessions/'+encodeURIComponent(o)+'/deskstop',{method:'POST',body:{}}).then(function(){haptic('success');if(st.sid==o&&st.kind!='hermes')ccPoll(false)}).catch(function(e){toast(E(e.message));haptic('error')})}
function ccSend(){var t=(st.draft||'').trim();if((!t&&!st.imgs.length)||!live()||st.dsending)return;
 if(!st.rw&&st.sid&&deskOK()){var o=st.sid,k=st.kind,imgs=st.imgs.slice(),m=st.msel||{},b={t:t};if(imgs.length)b.images=imgs;if(k!='codex'){if(m.m){b.model=m.m;b.provider=m.p}if(m.e)b.effort=m.e}
  st.dsending=true;st.draft='';st.imgs=[];var ta0=document.getElementById('hcin');if(ta0){ta0.value='';grow(ta0)}paint();
  J(base()+'/sessions/'+encodeURIComponent(o)+'/desk',{method:'POST',body:b}).then(function(d){st.dsending=false;if(st.sid!=o)return;st.stick=true;if(d&&d.queued)toast('В очереди: уйдёт после текущего ответа');haptic('success');paint();""")
rep("""   .catch(function(e){st.dsending=false;paint();toast(E(e.message));haptic('error')});return}""",
    """   .catch(function(e){st.dsending=false;if(st.sid==o&&!st.draft){st.draft=t;st.imgs=imgs;var ta=document.getElementById('hcin');if(ta){ta.value=t;grow(ta)}}paint();toast(E(e.message));haptic('error')});return}""")
# typing switches the button between stop and send
rep("""document.addEventListener('input',function(e){if(e.target.id=='hcin'){st.draft=e.target.value;grow(e.target)}""",
    """document.addEventListener('input',function(e){if(e.target.id=='hcin'){st.draft=e.target.value;grow(e.target);sendBtn()}""")
# new chat: no "в Claude Desktop" toasts (creation is instant now)
rep("""var k=st.kind;toast('Создаю чат в '+DESK[k]+'…');""", """var k=st.kind;""")
rep("""paint();toast('Чат создан в '+DESK[k]+(cwd?' · '+E(pname):''));""", """paint();if(cwd)toast('Проект: '+E(pname));""")
# menu: no explanation of where the chat lives
rep("""else h+='<div class="hint2">'+(st.kind=='claude'?""", """else if(deskOK())h+='<div class="btn" data-hc="fork">'+IC('git-branch')+' Ветка: продолжить с копией</div>';else h+='<div class="hint2">'+(st.kind=='claude'?""")
# Forward: no "в чат на ПК · / продолжу в копии ·"
rep("""<span>'+(x.rw?'':(x.dw||k=='codex')?'в чат на ПК · ':'продолжу в копии · ')+E(ago(x.ts))+'</span>""", """<span>'+E(ago(x.ts))+'</span>""")
# list: old panel chats are just "other chats"
rep("""secHtml('ИЗ ПАНЕЛИ · МОИ КОПИИ',""", """secHtml('ДРУГИЕ ЧАТЫ',""")
F.write_text(t, encoding="utf-8")
print("p5_one: %d replacements" % n)
