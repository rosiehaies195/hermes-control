"""Build the three «Проекты» prototype pages (multi-a/b/c.html) and the comparison page multi-compare.html (repo root).
The pages are public (GitHub Pages): the snapshot state is sanitised, no real hosts/chats/paths.
Run (venv python): python prototypes/v8/build_multi.py"""
import base64, json, subprocess, sys, time, zlib
from pathlib import Path

R = Path("C:/Users/Peter/hermes-control")
PY = sys.executable
for v in "ABC":
    subprocess.run([PY, str(R / "prototypes/v6/make_app.py"), str(R / ("multi-%s.html" % v.lower())),
                    "prototypes/v8/data8.js", "prototypes/v8/home%s.js" % v, "prototypes/v8/home8.css"],
                   check=True, cwd=str(R), stdout=subprocess.DEVNULL)

sys.path.insert(0, "C:/Users/Peter/AppData/Local/hermes/scripts")
import tv_panel as P  # noqa: E402

now = int(time.time())
b = P.state(full=True)
b.update(stopped=False, fails=0, pause=0, pend=[], cancel=[], away=None, hs=[], cj=[], log=[], hist=[], sess=[],
         projects=[{"name": "demo", "desc": ""}], brain={"sec": [], "now": [], "log": [], "nowp": []},
         session="PC-M2: пример шага (#100): Working", action="start: PC-M2: пример шага (#100)",
         steps=[{"c": "PC2a", "x": "PC2a: пример (#98)", "t": now - 7200}, {"c": "PC2b", "x": "PC2b: пример (#99)", "t": now - 3600}])
for k in ("wa", "api_url", "dig"):
    b.pop(k, None)
b["clicker"] = dict(b["clicker"], on=True)
for h in b.get("health", []):
    h.update(ok=1, d="в норме")
if b.get("proj"):
    b["proj"] = dict(b["proj"], n="demo", t="PC-M2 «Пример вехи»", ms="PC-M2", cur="PC2b", done=5, total=9, tasks=[])
raw = json.dumps(b, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
co = zlib.compressobj(9, zlib.DEFLATED, -15)
z = base64.urlsafe_b64encode(co.compress(raw) + co.flush()).decode().rstrip("=")
leak = [w for w in ("ts.net", "tail7097", "rosiehaies", "desktop-", "khcs", "Peter", "C:/", "SmartTube", "Kivi") if w in raw.decode()]
assert not leak, leak

VAR = [
    {"id": "a", "t": "А · Входящие + список", "pitch": "Сверху общий блок «Входящие»: вопросы из всех проектов, как почта. Ниже плоский список проектов с фильтром Все / Claude / Codex / Hermes и группами «Требуют тебя / Работают / Свободны».",
     "good": "Все решения в одном месте, не надо искать, где что ждёт. Масштабируется: 30 проектов = длинный, но упорядоченный список, свободные свёрнуты.",
     "bad": "Вопросы оторваны от проекта (видно только имя и веху). Экран длинный, пока вопросов много (показываю 3 + «Ещё N»)."},
    {"id": "b", "t": "Б · Вкладки по приложениям", "pitch": "Claude, Codex и Hermes как три рабочих пространства. На вкладках красные счётчики, под ними подсказка, что ждёт в соседних приложениях. Вопрос отвечается прямо в строке проекта.",
     "good": "Привычная модель «открыл приложение, увидел его проекты». Вопрос рядом с контекстом проекта. Проект в двух приложениях помечен «+ Hermes».",
     "bad": "Чтобы увидеть всё, нужно обойти три вкладки (помогает подсказка про соседей). Проект из нескольких приложений живёт в нескольких вкладках."},
    {"id": "c", "t": "В · Сетка карточек", "pitch": "Один проект = одна карточка. Ждущие тебя карточки на всю ширину с вопросом и кнопками, работающие по две в ряд (статус и прогресс), свободные одной строкой чипов. Тап по карточке открывает шторку с деталями.",
     "good": "Самый наглядный обзор: видно сразу всё, что требует тебя, и весь «парк» проектов. Вопрос внутри карточки проекта.",
     "bad": "При 20+ проектах сетка работающих становится длинной. Каждая ждущая карточка высокая, при многих вопросах экран растёт быстрее, чем в А."},
]
tpl = (R / "prototypes/v8/compare.tpl.html").read_text(encoding="utf-8")
html = tpl.replace("/*VAR*/[]", json.dumps(VAR, ensure_ascii=False)).replace("/*Z*/''", json.dumps(z))
(R / "multi-compare.html").write_text(html, encoding="utf-8")
print("built", len(html), "bytes")
