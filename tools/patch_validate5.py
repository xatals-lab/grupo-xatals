p = 'tools/validate.py'
v = open(p, encoding='utf-8').read()
# quiz: int or list answers, at least 2 multi-answer questions, correct answers not stacked on one position
old = '''if qs:
    if len(qs.get("preguntas", [])) < 5: err.append("quiz_semana: minimo 5 preguntas")
    for x in qs.get("preguntas", []):
        if len(x.get("opciones", [])) != 4 or not isinstance(x.get("correcta"), int) or not 0 <= x["correcta"] < 4: err.append("quiz_semana: pregunta mal formada: " + str(x.get("pregunta"))[:40])'''
assert v.count(old) == 1
new = '''if qs:
    if len(qs.get("preguntas", [])) < 5: err.append("quiz_semana: minimo 5 preguntas")
    multi, simples = 0, []
    for x in qs.get("preguntas", []):
        c = x.get("correcta")
        ok = isinstance(c, int) and 0 <= c < 4 or (isinstance(c, list) and 2 <= len(c) <= 3 and len(set(c)) == len(c) and all(isinstance(i, int) and 0 <= i < 4 for i in c))
        if len(x.get("opciones", [])) != 4 or not ok: err.append("quiz_semana: pregunta mal formada: " + str(x.get("pregunta"))[:40]); continue
        if isinstance(c, list): multi += 1
        else: simples.append(c)
    if multi < 2: err.append("quiz_semana: debe haber al menos 2 preguntas con varias respuestas correctas (correcta: lista de 2 o 3 indices)")
    if simples and (len(set(simples)) < 3 or max(simples.count(i) for i in set(simples)) > max(2, len(simples) // 2)):
        err.append("quiz_semana: la respuesta correcta esta casi siempre en la misma posicion; reparte las correctas entre las posiciones 0, 1, 2 y 3")'''
v = v.replace(old, new)
v = v.replace('PLANT = {"pulsa": ("buenos", "malos"), "timing": (), "decide": ("escenas",), "memoria": ("pares",), "aguanta": (), "busca": ("objetivo", "senuelos"), "simon": ("botones",)}',
              'PLANT = {"pulsa": ("buenos", "malos"), "timing": (), "decide": ("escenas",), "memoria": ("pares",), "aguanta": (), "busca": ("objetivo", "senuelos"), "simon": ("botones",), "ritmo": ("notas",), "runner": ("buenos", "malos"), "apila": ("bloque",)}')
old = '    if len(mj.get("juegos", [])) < 3: err.append("minimo 3 minijuegos")'
assert v.count(old) == 1
v = v.replace(old, old + '''
    vds = sorted([g for g in mj.get("juegos", []) if g.get("vds")], key=lambda g: g.get("semana", ""))
    for k, g in enumerate(vds):
        if not re.fullmatch(r"\\d{4}-W\\d{2}", str(g.get("semana", ""))): err.append(f"videojuego de la semana {g['id']}: falta semana ISO")
        previos = [h["plantilla"] for h in vds[max(0, k - (len(PLANT) - 1)):k]]
        if g["plantilla"] in previos: err.append(f"videojuego de la semana {g['id']}: el estilo {g['plantilla']} ya se uso hace poco; cada semana debe ser un estilo distinto")''')
v = v.replace('if g["plantilla"] == "simon" and len(g.get("botones", [])) != 4:', 'if g["plantilla"] == "ritmo" and not g.get("notas"): err.append(f"minijuego {gid}: ritmo necesita notas")\n        if g["plantilla"] == "simon" and len(g.get("botones", [])) != 4:')
open(p, 'w', encoding='utf-8').write(v)
print('validate patched')
