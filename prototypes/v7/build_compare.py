"""Build compare-focus.html (repo root): «Было / Стало» for every screen changed by the «Фокус» prototype.
Both phones are live iframes of the real pages (index.html = current, focus-proto.html = prototype), fed with the same
snapshot state through #z= (no API, no Telegram needed), so the page works from GitHub Pages in any browser.
Run (venv python): python prototypes/v7/build_compare.py"""
import base64, copy, json, sys, time, zlib
from pathlib import Path

R = Path("C:/Users/Peter/hermes-control")
sys.path.insert(0, "C:/Users/Peter/AppData/Local/hermes/scripts")
import tv_panel as P  # noqa: E402

now = int(time.time())
base = P.state(full=True)
base.update(stopped=False, fails=0, pause=0, pend=[], cancel=[])
base["clicker"] = dict(base["clicker"], on=True)
for h in base.get("health", []):
    h["ok"] = 1
    h["d"] = "в норме"   # real details contain host names
base.pop("dig", None)
base["away"] = None
# the page is public (GitHub Pages): never ship live content, only the numbers the layout needs
for k in ("wa", "api_url"):
    base.pop(k, None)
base.update(hs=[], cj=[], log=[], hist=[], sess=[], projects=[{"name": "demo", "desc": ""}],
            brain={"sec": [], "now": [], "log": [], "nowp": []},
            session="PC-M2: пример шага (#100): Working", action="start: PC-M2: пример шага (#100)",
            steps=[{"c": "PC2a", "x": "PC2a: пример (#98)", "t": now - 7200}, {"c": "PC2b", "x": "PC2b: пример (#99)", "t": now - 3600}])
if base.get("proj"):
    base["proj"] = dict(base["proj"], n="demo", t="PC-M2 «Пример вехи»", ms="PC-M2", cur="PC2b", done=5, total=9, tasks=[])


def q(i, text, opts, desc, ag="claude", rec=-1, perm=False, ago=300, sess="tv-miniapp · PC-M2"):
    return {"id": i, "s": sess, "q": text, "o": opts, "od": desc, "ag": ag, "ts": now - ago, "rec": rec, "perm": perm}


Q1 = q("a1", "Какую ветку брать за основу для следующей вехи?", ["master", "kivi (Recommended)", "Новая ветка от master"],
       ["стабильная", "форк", "чистый старт"], rec=1, ago=420)
Q2 = q("a2", "Разрешить запуск npm install?", ["Allow", "Deny"], ["", ""], perm=True, ago=90, sess="tv-miniapp")
Q3 = q("a3", "Показать план перед стартом?", ["Да", "Нет (Recommended)"], ["", ""], ag="codex", rec=1, ago=30, sess="tv-miniapp")


def sc(**kw):
    s = copy.deepcopy(base)
    s.update(kw)
    return s


broken = copy.deepcopy(base)
if broken.get("health"):
    broken["health"][0].update(ok=0, d="не отвечает", fix=1, fl="Перезапустить")

SCEN = [
    {"id": "idle", "t": "1. Всё спокойно", "state": sc(),
     "old": "Карточка «Всё идёт», под ней проект, очередь, лента и другие блоки, многое развёрнуто. Длина экрана около 1600 px.",
     "new": "Карточка «Всё идёт» (с быстрыми кнопками Start, Написать, Claude, Пауза) остаётся единственным блоком действия. Под ней 4 плитки-сводки, остальное свёрнуто в «Подробности». Экран короче примерно на 40% (около 990 px).",
     "tap": "Нажми на плитки: «Токены» раскроет график, «Очередь» откроет добавление."},
    {"id": "one", "t": "2. Один вопрос агента", "state": sc(pend=[Q1]),
     "old": "Карточка с вопросом и маленькими чипами-вариантами, описания вариантов не видны. Под карточкой быстрые кнопки и блок проекта.",
     "new": "Каждый вариант отдельной крупной строкой с пояснением, рекомендованный подсвечен и подписан «рекомендует». Тап по строке = ответ. Пока висит вопрос, быстрых кнопок и картинки-хранителя в карточке нет: внимание только на решении.",
     "tap": "Нажми на значок «?» у карточки: покажет пояснение."},
    {"id": "perm", "t": "3. Запрос разрешения", "state": sc(pend=[Q2]),
     "old": "Allow и Deny как небольшие чипы рядом, легко промахнуться.",
     "new": "Две крупные кнопки: зелёная Allow и красная Deny. Allow по-прежнему требует подтверждения (Face ID или удержание).",
     "tap": ""},
    {"id": "three", "t": "4. Несколько решений сразу", "state": sc(pend=[Q1, Q2, Q3]),
     "old": "Первое решение в большой карточке, остальные ниже отдельными блоками. Экран растёт с каждым вопросом (около 2000 px при трёх).",
     "new": "Всегда одна карточка, сверху счётчик «1 из 3» и стрелки. Решаешь по одному, длина экрана не растёт (около 1200 px при трёх).",
     "tap": "Нажми на стрелки сверху, чтобы листать решения."},
    {"id": "broken", "t": "5. Что-то сломалось", "state": sc(**{"health": broken.get("health", [])}),
     "old": "Красная карточка «Сломалось» и кнопка починки, ниже всё остальное как обычно.",
     "new": "Сбой всегда первое решение в очереди (приоритет выше вопросов). Плитка «Система» краснеет и показывает, что именно сломано.",
     "tap": ""},
]
out = []
for s in SCEN:
    raw = json.dumps(s["state"], ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    co = zlib.compressobj(9, zlib.DEFLATED, -15)
    z = base64.urlsafe_b64encode(co.compress(raw) + co.flush()).decode().rstrip("=")
    out.append({k: v for k, v in s.items() if k != "state"} | {"z": z})

html = (R / "prototypes/v7/compare.tpl.html").read_text(encoding="utf-8").replace("/*DATA*/[]", json.dumps(out, ensure_ascii=False))
(R / "compare-focus.html").write_text(html, encoding="utf-8")
print("built", len(html), "bytes;", len(out), "scenarios")
