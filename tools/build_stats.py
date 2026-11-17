"""Builds data/dashboards.json from the group chat archive (aggregates only: counts, hours, weeks, top words; never raw messages).
Usage: python3 tools/build_stats.py <group_chat.jsonl> <out.json>. Runs on the NUC inside Hermek's site_update, so every Friday the panels are fresh."""
import json, re, sys
from collections import Counter
from datetime import datetime
from zoneinfo import ZoneInfo

MAD = ZoneInfo("Europe/Madrid")
PEOPLE = {"685047065": "dug", "867643773": "hrk", "865429428": "koi"}
STOP = set("""para pero como esto esta este esos esas porque cuando donde sobre entre desde hasta muy más mas tambien también todo todos toda todas algo nada solo sólo
tiene tienen tengo tenemos hacer hace puede pueden estoy estamos estan están estaba hemos habia había sido ser son eres soy fue ahora aqui aquí asi así bien pues ya
que qué los las una uno unos unas del con por sin sus mis tus nos les lo la el en de y o a se me te mi tu su si sí no al un es ha he hay quien quién cual cuál
vale gracias hola jaja jajaja entonces luego file saved image hermes hermek audio voice document message photo sticker http https www com""".split())
NOTICE = re.compile(r"shutting down|interrupted|Cronjob|is back online|pick up where|restarted|Session |paused", re.I)
ENG = set("the is are was were will your you and with this that have has not for when back online send any message try task current it's i'll".split())
SWEAR = re.compile(r"\b(joder|hostia|hostias|mierda|co[ñn]o|cabr[oó]n|gilipollas|puta|puto|cojones|co[jñ]one?s|capullo|imb[eé]cil|idiota|subnormal|co[ñn]azo|tarado)\b", re.I)


def main(src, out):
    msgs = []
    for line in open(src, encoding="utf-8"):
        try:
            m = json.loads(line)
        except Exception:
            continue
        pid = PEOPLE.get(str(m.get("uid")))
        if m.get("text"):
            m["text"] = re.sub(r"https?://\S+|\[[^\]]{0,200}\]", " ", m["text"])
        if m.get("text") and (NOTICE.search(m["text"]) or sum(1 for w_ in re.findall(r"[a-z']+", m["text"].lower()) if w_ in ENG) >= 3):
            continue                                       # Hermes system notices and English noise are not the friends' words
        if pid and m.get("role") == "user" and m.get("text"):
            msgs.append((datetime.fromtimestamp(m["ts"], MAD), pid, m["text"]))
    msgs.sort(key=lambda x: x[0])
    now = datetime.now(MAD)
    ids = ["dug", "hrk", "koi"]
    per = {i: {"mensajes": 0, "palabras": 0, "insultos": 0, "preguntas": 0, "exclamaciones": 0, "largos": 0} for i in ids}
    horas = {i: [0] * 24 for i in ids}
    dias = {i: [0] * 7 for i in ids}
    semanas = {}
    palabras = {i: Counter() for i in ids}
    ult = {}
    huecos = {i: [] for i in ids}
    for ts, pid, text in msgs:
        p = per[pid]
        w = [re.sub(r"(.)\1{2,}", r"\1\1", x) for x in re.findall(r"[a-záéíóúüñ]+", text.lower())]
        p["mensajes"] += 1; p["palabras"] += len(w); p["insultos"] += len(SWEAR.findall(text))
        p["preguntas"] += text.count("?"); p["exclamaciones"] += text.count("!"); p["largos"] += 1 if len(text) > 200 else 0
        horas[pid][ts.hour] += 1; dias[pid][ts.weekday()] += 1
        y, wk, _ = ts.isocalendar(); semanas.setdefault(f"{y}-W{wk:02d}", Counter())[pid] += 1
        for x in w:
            if 4 <= len(x) <= 14 and x not in STOP and x not in ENG and not x.startswith("jaj"):
                palabras[pid][x] += 1
        if pid in ult:
            huecos[pid].append((ts - ult[pid]).total_seconds() / 86400)
        ult[pid] = ts
    ks = sorted(semanas)[-12:]
    data = {
        "generado": now.strftime("%Y-%m-%d"),
        "desde": msgs[0][0].strftime("%Y-%m-%d") if msgs else "",
        "total": len(msgs),
        "personas": [{"id": i, **per[i], "dias_sin_hablar": round((now - ult[i]).total_seconds() / 86400, 1) if i in ult else None,
                      "mayor_silencio_dias": round(max(huecos[i]), 1) if huecos[i] else 0} for i in ids],
        "horas": horas, "dias": dias,
        "semanas": [{"semana": k, **{i: semanas[k].get(i, 0) for i in ids}} for k in ks],
        "palabras": {i: [[w, n] for w, n in palabras[i].most_common(14)] for i in ids},
    }
    json.dump(data, open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("stats ok:", len(msgs), "messages")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
