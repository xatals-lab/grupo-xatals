"""Validates the data files so a bad weekly update never reaches the live site. Exit 1 on any error."""
import json, sys, os, re
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data")
err = []
def load(n):
    try:
        return json.load(open(os.path.join(D, n + ".json"), encoding="utf-8"))
    except Exception as e:
        err.append(f"{n}.json: {e}"); return None
p, a, f, c, s, rk, qs, mj = (load(n) for n in ("personajes", "apuestas", "frases", "chistes", "semana", "ranking", "quiz_semana", "minijuegos"))
ids = set()
if p:
    for x in p.get("cuadrilla", []) + p.get("invitados", []):
        if x["id"] in ids: err.append("id repetido: " + x["id"])
        ids.add(x["id"])
    for x in p.get("invitados", []):
        for k in ("nombre", "emoji", "rol", "entrada"):
            if not x.get(k): err.append(f"{x['id']}: falta {k}")
        if len(x.get("opciones", [])) != 3: err.append(f"{x['id']}: deben ser 3 opciones")
        for o in x.get("opciones", []):
            for k in ("texto", "resultado"):
                if not o.get(k): err.append(f"{x['id']}: opcion sin {k}")
            if not isinstance(o.get("animo"), int) or not isinstance(o.get("cartera"), int): err.append(f"{x['id']}: animo/cartera deben ser enteros")
    if len(p.get("invitados", [])) < 8: err.append("minimo 8 invitados")
if a:
    gr = {}
    for m in a.get("mercados", []):
        if not 0 < m["prob"] <= 1 or m["cuota"] <= 1: err.append("mercado " + m["id"] + ": prob/cuota fuera de rango")
        if m.get("grupo"): gr[m["grupo"]] = gr.get(m["grupo"], 0) + m["prob"]
    for g, t in gr.items():
        if abs(t - 1) > 0.02: err.append(f"grupo {g}: las prob suman {t:.2f}, deben sumar 1")
    if len(a.get("mercados", [])) < 3: err.append("minimo 3 mercados")
if f:
    for x in f:
        if x["autor"] not in x["opciones"]: err.append("frase: autor no esta en opciones: " + x["frase"][:30])
        for o in x["opciones"]:
            if o not in ids: err.append(f"frase: id desconocido {o}")
if c and len(c) < 10: err.append("minimo 10 chistes")
if s:
    for k in ("actualizado", "titulo", "resumen", "novedades", "fabulas"):
        if k not in s: err.append("semana.json: falta " + k)
print("\n".join(err) if err else "VALIDATION OK")
sys.exit(1 if err else 0)
