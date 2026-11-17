import json
p = 'js/carril3d.js'
t = open(p, encoding='utf-8').read()
old = 'E.v = (16 + (cfg.duracion - E.t) * .22) * (E.boost > 0 ? 1.45 : 1) * (E.lento > 0 ? .55 : 1);'
assert t.count(old) == 1
t = t.replace(old, 'const cerca = E.puertas.some(p => !p.hecho && p.z > -75); E.v = (11 + (cfg.duracion - E.t) * .1) * (E.boost > 0 ? 1.35 : 1) * (E.lento > 0 ? .6 : 1) * (cerca ? .6 : 1);   // slower, and slower still while reading a gate')
old = 'pregEl.textContent = "🚦 " + q.pregunta;'
assert t.count(old) == 1
t = t.replace(old, 'pregEl.innerHTML = (cfg.sujeto ? `<small style="color:#ffe500">PREGUNTAS SOBRE ${cfg.sujeto.toUpperCase()}</small><br>` : "") + "🚦 " + q.pregunta;')
open(p, 'w', encoding='utf-8').write(t)

mj = json.load(open('data/minijuegos.json', encoding='utf-8'))
for g in mj['juegos']:
    if g['id'] == 'don-hector':
        g['sujeto'] = 'Héctor Viribay (Don Héctor)'
        g['intro'] = ("Las preguntas de este tren son todas sobre Héctor Viribay, también llamado Don Héctor o Viribaytxo: el compañero del cole que hablaba como un señor mayor, fue delegado, abogado y acabó de maquinista de Renfe. "
                      "Desliza a izquierda o derecha (o toca los lados) para cambiar de vía, coge los carteles de campaña y, cuando aparezcan tres carteles, elige la vía con la respuesta correcta. El tren va más despacio al acercarse a los carteles para que te dé tiempo a leer.")
        g['puertas'] = [
          {"pregunta": "Viribay se presentó a delegado: ¿cuál fue su lema de campaña?", "opciones": ["El futuro es hoy", "Votando a Viribay, ganamos todos", "Yo también soy Viribay"], "correcta": 1},
          {"pregunta": "Don Héctor terminó Derecho: ¿qué hizo después?", "opciones": ["Piloto de Ryanair", "Informático del cole", "Montó un bufete solo, de la nada"], "correcta": 2},
          {"pregunta": "De niño, Viribaytxo ya hablaba...", "opciones": ["Como un señor mayor", "Solo en euskera", "Con la voz de Koi"], "correcta": 0},
          {"pregunta": "Héctor Viribay acabó trabajando de...", "opciones": ["Camarero del Kupula", "Maquinista de Renfe", "Árbitro del Alavés"], "correcta": 1},
          {"pregunta": "Cuando era pequeño, Don Héctor se alistó en las juventudes de...", "opciones": ["Un club de ajedrez", "El Alavés", "Las del Partido Popular"], "correcta": 2}]
json.dump(mj, open('data/minijuegos.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('train slower, questions clarified')
