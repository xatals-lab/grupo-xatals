"""Validates every data file so a bad weekly update never reaches the live site. Exit 1 on any error (message names the file and the problem)."""
import json, sys, os, re

D = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data")
err = []


def load(n):
    try:
        return json.load(open(os.path.join(D, n + ".json"), encoding="utf-8"))
    except Exception as e:
        err.append(f"{n}.json: {e}")
        return None


p, a, f, c, s, rk, qs, mj, eu, rc, pf, lg = (load(n) for n in ("personajes", "apuestas", "frases", "chistes", "semana", "ranking", "quiz_semana", "minijuegos", "euskera", "recursos", "profesores", "liga"))
ids = set()
if p:
    for x in p.get("cuadrilla", []) + p.get("invitados", []):
        if x["id"] in ids: err.append("id repetido: " + x["id"])
        ids.add(x["id"])
    for x in p.get("invitados", []):
        for k in ("nombre", "emoji", "rol", "entrada"):
            if not x.get(k): err.append(f"personajes {x['id']}: falta {k}")
        if len(x.get("opciones", [])) != 3: err.append(f"personajes {x['id']}: deben ser 3 opciones")
        for o in x.get("opciones", []):
            for k in ("texto", "resultado"):
                if not o.get(k): err.append(f"personajes {x['id']}: opcion sin {k}")
            if not isinstance(o.get("animo"), int) or not isinstance(o.get("cartera"), int): err.append(f"personajes {x['id']}: animo/cartera deben ser enteros")
    if len(p.get("invitados", [])) < 8: err.append("personajes: minimo 8 invitados")
if a:
    gr = {}
    for m in a.get("mercados", []):
        if not 0 < m["prob"] <= 1 or m["cuota"] <= 1: err.append("apuestas: mercado " + m["id"] + " con prob/cuota fuera de rango")
        if m.get("grupo"): gr[m["grupo"]] = gr.get(m["grupo"], 0) + m["prob"]
    for g, t in gr.items():
        if abs(t - 1) > 0.02: err.append(f"apuestas: grupo {g}: las prob suman {t:.2f}, deben sumar 1")
    if len(a.get("mercados", [])) < 3: err.append("apuestas: minimo 3 mercados")
if f:
    for x in f:
        if x["autor"] not in x["opciones"]: err.append("frases: autor no esta en opciones: " + x["frase"][:30])
        for o in x["opciones"]:
            if o not in ids: err.append(f"frases: id desconocido {o}")
if c and len(c) < 10: err.append("chistes: minimo 10 chistes")
if s:
    for k in ("actualizado", "titulo", "resumen", "novedades", "fabulas"):
        if k not in s: err.append("semana.json: falta " + k)
if rk:
    for k in ("records", "quiz"):
        if k not in rk: err.append("ranking.json: falta " + k)
    for x in rk.get("records", []) + rk.get("quiz", []):
        if x.get("jugador") not in ("dug", "hrk", "koi") or not isinstance(x.get("puntos"), int): err.append("ranking: entrada invalida " + str(x)[:60])
if qs:
    if len(qs.get("preguntas", [])) < 5: err.append("quiz_semana: minimo 5 preguntas")
    multi, simples = 0, []
    for x in qs.get("preguntas", []):
        cc = x.get("correcta")
        ok = (isinstance(cc, int) and not isinstance(cc, bool) and 0 <= cc < 4) or (isinstance(cc, list) and 2 <= len(cc) <= 3 and len(set(cc)) == len(cc) and all(isinstance(i, int) and 0 <= i < 4 for i in cc))
        if len(x.get("opciones", [])) != 4 or not ok:
            err.append("quiz_semana: pregunta mal formada: " + str(x.get("pregunta"))[:40]); continue
        if isinstance(cc, list): multi += 1
        else: simples.append(cc)
    if multi < 2: err.append("quiz_semana: debe haber al menos 2 preguntas con varias respuestas correctas (correcta: lista de 2 o 3 indices)")
    if simples and (len(set(simples)) < 3 or max(simples.count(i) for i in set(simples)) > (len(simples) + 1) // 2):
        err.append("quiz_semana: la respuesta correcta esta casi siempre en la misma posicion; reparte las correctas entre las posiciones 0, 1, 2 y 3")
PLANT = {"pulsa": ("buenos", "malos"), "timing": (), "aguanta": (), "busca": ("objetivo", "senuelos"),
         "simon": ("botones",), "ritmo": ("notas",), "runner": ("buenos", "malos"), "apila": ("bloque",), "carril3d": ("buenos", "malos")}
PROHIBIDAS = ("decide", "memoria")   # quiz-like games are not videogames: quizzes live in the Quiz section
if mj:
    seen = set()
    for g in mj.get("juegos", []):
        gid = g.get("id", "?")
        if gid in seen or not re.fullmatch(r"[a-z0-9-]{3,40}", str(gid)): err.append("minijuego: id invalido o repetido " + str(gid))
        seen.add(gid)
        if g.get("plantilla") in PROHIBIDAS:
            err.append(f"minijuego {gid}: la plantilla {g['plantilla']} ya no esta permitida: los juegos deben ser videojuegos de accion, los quizzes van en el Quiz semanal"); continue
        if g.get("plantilla") not in PLANT:
            err.append(f"minijuego {gid}: plantilla desconocida"); continue
        for k in ("titulo", "emoji", "intro", "resumen"):
            if not g.get(k): err.append(f"minijuego {gid}: falta {k}")
        for k in PLANT[g["plantilla"]]:
            if not g.get(k): err.append(f"minijuego {gid}: falta {k}")
        pl = g["plantilla"]
        if pl == "carril3d":
            if g.get("tema", "tren") not in ("tren", "calle"): err.append(f"minijuego {gid}: tema debe ser tren o calle")
            for pu in g.get("puertas", []):
                if len(pu.get("opciones", [])) != 3 or pu.get("correcta") not in (0, 1, 2) or not pu.get("pregunta"): err.append(f"minijuego {gid}: puerta mal formada (3 opciones, correcta 0-2)"); break
        if pl in ("pulsa", "runner") and (len(g.get("buenos", [])) < 1 or len(g.get("malos", [])) < 1): err.append(f"minijuego {gid}: {pl} necesita buenos y malos")
        if pl == "memoria" and not 4 <= len(g.get("pares", [])) <= 8: err.append(f"minijuego {gid}: memoria de 4 a 8 pares")
        if pl == "simon" and len(g.get("botones", [])) != 4: err.append(f"minijuego {gid}: simon necesita 4 botones")
        if pl == "busca" and (not g["objetivo"].get("e") or len(g.get("senuelos", [])) < 1): err.append(f"minijuego {gid}: busca mal formado")
        if pl == "decide":
            if len(g["escenas"]) < 4: err.append(f"minijuego {gid}: decide necesita 4 escenas o mas")
            for e in g["escenas"]:
                if len(e.get("o", [])) != 3 or not e.get("t"):
                    err.append(f"minijuego {gid}: escena mal formada"); break
                for o in e["o"]:
                    if not o.get("t") or not o.get("r") or not isinstance(o.get("animo", 0), int) or not isinstance(o.get("cartera", 0), int):
                        err.append(f"minijuego {gid}: opcion mal formada"); break
    if len(mj.get("juegos", [])) < 3: err.append("minijuegos: minimo 3")
    vds = sorted([g for g in mj.get("juegos", []) if g.get("vds")], key=lambda g: g.get("semana", ""))
    for k, g in enumerate(vds):
        if not re.fullmatch(r"\d{4}-W\d{2}", str(g.get("semana", ""))): err.append(f"videojuego de la semana {g['id']}: falta semana ISO")
        previos = [h["plantilla"] for h in vds[max(0, k - (len(PLANT) - 1)):k]]
        if g["plantilla"] in previos:
            err.append(f"videojuego de la semana {g['id']}: el estilo {g['plantilla']} ya se uso hace poco; cada semana debe ser un estilo distinto (estilos: {', '.join(PLANT)})")
if eu:
    if len(eu.get("palabras", [])) < 10: err.append("euskera: minimo 10 palabras")
    for w in eu.get("palabras", []):
        if not w.get("eu") or not w.get("es"): err.append("euskera: palabra sin eu o es: " + str(w)[:50])
if rc and not rc.get("grupos"): err.append("recursos: faltan grupos")
if pf:
    seen_p = set()
    for x in pf.get("profesores", []):
        pid = x.get("id", "?")
        if pid in seen_p or not x.get("nombre") or not x.get("rol") or not x.get("aspecto") or not isinstance(x.get("look"), dict): err.append(f"profesores {pid}: faltan datos o id repetido")
        seen_p.add(pid)
        if not (isinstance(x.get("amenazas"), list) and len(x["amenazas"]) >= 3 and all(isinstance(z, str) and z for z in x["amenazas"])): err.append(f"profesores {pid}: necesita 3 amenazas de texto")
if lg is not None and not all(k in lg for k in ("partidos", "ranking", "comentarios")): err.append("liga: faltan campos")
if c:
    for x in c:
        if not isinstance(x, dict) or not x.get("texto") or not x.get("tema"): err.append("chistes: entrada sin tema o texto"); break
print("\n".join(err) if err else "VALIDATION OK")
sys.exit(1 if err else 0)
