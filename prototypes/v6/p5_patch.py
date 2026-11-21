"""Stage 5 p.2+p.3 front-end patch: hc.js -> hc_p5.js (run from anywhere; hc.js itself is not touched).
 p.2  Claude/Codex PC chats: long poll (server holds GET messages until the transcript grows; no 3 s timer);
      Hermes PC chats: live SSE /sessions/<id>/watch (deltas, tools, turn end) instead of 3 s re-reads.
 p.3  'New chat' creates the chat INSIDE the native program (POST /new) and opens it as 'chat on PC'.
"""
from pathlib import Path
D = Path("C:/Users/Peter/hermes-control/prototypes/v6")
t = (D / "hc.js").read_text(encoding="utf-8")
n = 0

def rep(old, new):
    global t, n
    assert t.count(old) == 1, (t.count(old), old[:90])
    t = t.replace(old, new)
    n += 1

# ---- p.3: new chat in the native program
rep("""function doNew(cwd,pname){unsheet();LS.set('hcproj',cwd||'');
 J(base()+'/sessions',{method:'POST',body:cwd?{cwd:cwd,pname:pname}:{}}).then(function(d){st.sessions=null;st.msgs=[];openSess(d.s.id,true);st.sessions=[d.s];st.title='Новый чат';paint();if(cwd)toast('Проект: '+E(pname));setTimeout(function(){var t=document.getElementById('hcin');if(t)t.focus()},120)}).catch(function(e){toast(E(e.message))})}""",
"""function doNew(cwd,pname){unsheet();LS.set('hcproj',cwd||'');var k=st.kind;toast('Создаю чат в '+DESK[k]+'…');
 J('/new',{method:'POST',body:{agent:k,cwd:cwd||'',pname:pname||''}}).then(function(d){if(st.kind!=k)return;
  if(k=='hermes'&&!st.all){st.all=true;LS.set('hcall',true)}
  st.msgs=[];st.sessions=[d.s];if(k=='hermes'){openSess(d.s.id,true)}else openAgent(d.s.id,true);st.title=d.s.t||'Новый чат';st.rw=false;st.src=d.s.src;paint();toast('Чат создан в '+DESK[k]+(cwd?' · '+E(pname):''));setTimeout(function(){var t=document.getElementById('hcin');if(t)t.focus()},120)}).catch(function(e){toast(E(e.message))})}""")

# ---- p.2: long poll for Claude/Codex transcripts
rep("var KN={hermes:'Hermes',claude:'Claude',codex:'Codex'},ccTimer=0;", "var KN={hermes:'Hermes',claude:'Claude',codex:'Codex'},ccTimer=0,ccFly=false,ccTok=0,hwTok=0,hwOn=false,hwAc=null;")
rep("function ccStop(){if(ccTimer){clearTimeout(ccTimer);ccTimer=0}}", "function ccStop(){if(ccTimer){clearTimeout(ccTimer);ccTimer=0}ccTok++;ccFly=false}")
rep("""function ccPoll(first){ccStop();var id=st.sid;if(st.kind=='hermes'||st.rw||st.view!='chat'||!id)return;var k=st.kind;
J(base()+'/sessions/'+encodeURIComponent(id)+'/messages'+(first||st.ccoff==null?'':'?from='+st.ccoff)).then(function(d){if(st.sid!=id||st.kind!=k)return;
  if(first||st.ccoff==null)st.msgs=fromHistory(d.m);else if(d.m.length)st.msgs=fromHistory(d.m,st.msgs);
  st.ccoff=d.off;st.cclive=!!d.live;st.loadingMsgs=false;st.err='';if(first)st.stick=true;paint()
 }).catch(function(e){st.loadingMsgs=false;st.err=e.message||'Нет связи';paint()}).then(function(){if(st.sid==id&&st.kind==k&&!st.rw&&st.view=='chat'&&!ccTimer)ccTimer=setTimeout(function(){ccTimer=0;if(U.tab=='hc'&&mounted())ccPoll(false)},3000)})}""".replace("\nJ(", "\n J("),
"""function ccPoll(first){ccStop();var id=st.sid;if(st.kind=='hermes'||st.rw||st.view!='chat'||!id)return;var k=st.kind,tok=ccTok,t0=Date.now(),lp=!(first||st.ccoff==null);ccFly=true;
 J(base()+'/sessions/'+encodeURIComponent(id)+'/messages'+(lp?'?from='+st.ccoff+'&sz='+(st.ccsz||st.ccoff)+'&wait=20':'')).then(function(d){if(tok!=ccTok||st.sid!=id||st.kind!=k)return;
  if(!lp)st.msgs=fromHistory(d.m);else if(d.m.length)st.msgs=fromHistory(d.m,st.msgs);
  st.ccoff=d.off;st.ccsz=d.size;st.cclive=!!d.live;st.loadingMsgs=false;st.err='';if(first)st.stick=true;paint();return d.m.length
 }).catch(function(e){if(tok!=ccTok)return;st.loadingMsgs=false;st.err=e.message||'Нет связи';paint();return -1}).then(function(g){if(tok!=ccTok)return;ccFly=false;
  if(st.sid==id&&st.kind==k&&!st.rw&&st.view=='chat'&&!ccTimer)ccTimer=setTimeout(function(){ccTimer=0;if(U.tab=='hc'&&mounted())ccPoll(false)},g>0?40:(g===-1||Date.now()-t0<1500?2500:40))})}""")
rep("if(st.kind!='hermes'&&!st.rw&&st.view=='chat'&&!ccTimer)ccPoll(false);if(st.view=='list'",
    "if(st.kind!='hermes'&&!st.rw&&st.view=='chat'&&!ccTimer&&!ccFly)ccPoll(false);if(st.kind=='hermes'&&!st.rw&&st.view=='chat'&&st.sid&&DWS[st.src]&&!hwOn)hWatch(st.sid);if(st.view=='list'")

# first message of a phone-created Claude chat: the card/transcript appear with it -> follow the real session id
rep("if(k=='hermes')hPoll(o,0);else ccPoll(false)})",
    "if(d&&d.sid&&d.sid!=o&&st.kind==k){st.sid=d.sid;st.ccoff=null;st.ccsz=0;st.msgs=[];st.sessions=null}if(k=='hermes'){if(!hwOn)hPoll(o,0)}else ccPoll(false)})")

# ---- p.2: live watch of a Hermes PC chat
rep("function hPoll(id,n){", """function hLive(){var a=st.cur;if(!a||!a.live){a={k:'a',parts:[],live:true,ts:Date.now()/1000};st.cur=a;st.msgs.push(a)}return a}
function hWatch(id){hwOn=true;var tok=++hwTok;if(hwAc){try{hwAc.abort()}catch(e){}}hwAc=window.AbortController?new AbortController():null;
 function again(){hwOn=false;if(tok==hwTok&&st.sid==id&&st.kind=='hermes'&&!st.rw&&st.view=='chat'&&U.tab=='hc'&&mounted())setTimeout(function(){if(tok==hwTok&&!hwOn)hWatch(id)},400)}
 function ok(){return tok==hwTok&&st.sid==id}
 function fin(a){if(a){a.live=false}st.cur=null;setTimeout(function(){if(!ok())return;reload()},350)}
 hq(base()+'/sessions/'+encodeURIComponent(id)+'/watch',{signal:hwAc?hwAc.signal:undefined}).then(function(r){if(!r.ok)throw new Error('watch '+r.status);
  return sse(r,function(n,d){if(!ok())return;
   if(n=='watch.ready'){if(d.running){hLive();st.stick=true;paint()}}
   else if(n=='turn.start'){hLive();st.stick=true;reload().then(function(){if(ok()&&st.cur&&st.msgs.indexOf(st.cur)<0){st.msgs.push(st.cur);paint()}})}
   else if(n=='assistant.delta'||n=='tool.started'||n=='tool.completed'){var a=hLive();onEv(n,d);st.stick=true}
   else if(n=='turn.complete'){fin(st.cur);paint()}
  })}).then(again,again)}
function hPoll(id,n){""")

out = D / "hc_p5.js"
out.write_text(t, encoding="utf-8")
print("hc_p5.js written, %d replacements" % n)
