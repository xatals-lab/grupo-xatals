import json
mj = json.load(open('data/minijuegos.json', encoding='utf-8'))
ids = {g['id'] for g in mj['juegos']}
nuevos = [
 {"id": "edortha-punk", "plantilla": "ritmo", "titulo": "Edortha al punk", "emoji": "🎸", "resumen": "Toca el punk de Edortha Mari antes de que desaparezca otra vez.",
  "intro": "Edortha Mari era tranquilísimo hasta que cogía la guitarra. Pulsa cada nota cuando cruce la línea amarilla: flechas, A S D F o toca los botones.", "dificultad": 3, "nuevo": True,
  "duracion": 30, "notas": ["🎸", "🤘", "🔥", "🥁"], "consigna": "Pulsa cada nota en la línea amarilla",
  "msg_ok": ["Ederra! Esto es punk de verdad.", "El público pide otra... y que Edortha no desaparezca.", "Dicen que lo vieron tocando con un carrito."], "msg_ko": ["Eso no era punk, era Koi tocando servicios mínimos.", "Ai ama! Se te cae la púa.", "Edortha te mira y desaparece."]},
 {"id": "koi-huye", "plantilla": "runner", "titulo": "Koi huye de la reunión", "emoji": "🏃", "resumen": "Corre por los pasillos esquivando papeleo y coge cañas.", "intro": "Son las 17:01 y Koi ya está fuera de horario. Cambia de carril (flechas, deslizar o botones): coge cañas y pintxos, esquiva anexos y llamadas.", "dificultad": 3, "nuevo": True,
  "duracion": 35, "jugador": {"e": "🏃"}, "buenos": [{"e": "🍺"}, {"e": "🥘"}], "malos": [{"e": "📎"}, {"e": "📋"}, {"e": "📞"}], "consigna": "Coge lo bueno, esquiva el papeleo",
  "msg_ok": ["¡Caña a la mano!", "Pintxo en vuelo.", "Eso sí que es servicio máximo."], "msg_ko": ["Un anexo te placa por la espalda.", "Llamada del jefe: ¡a las 17:02!", "Ai ama! Reunión sorpresa."]},
 {"id": "torre-pintxos", "plantilla": "apila", "titulo": "La torre de pintxos", "emoji": "🥘", "resumen": "Apila pintxos en la barra sin que se caiga la torre.", "intro": "En el bote de la cuadrilla se apilan pintxos en una torre imposible. Suelta cada pintxo justo encima del anterior: lo que sobresale se pierde.", "dificultad": 3, "nuevo": True,
  "bloque": {"e": "🥘"}, "niveles": ["Base: la barra", "Piso 2: tortilla", "Piso 3: gilda", "Piso 4: txistorra", "Piso 5: croquetas", "Piso 6: bacalao", "Piso 7: txuleta", "Piso 8: morcilla", "Piso 9: anchoas", "Piso 10: Celedón", "Piso 11: Bordalás", "Piso 12: el Bacterio"],
  "msg_ok": ["Clavado, ni una miga.", "Qué pulso: Koi lo pediría por servicios mínimos.", "Pintxo perfecto."], "msg_ko": ["Se cae la torre: Tejedor lo celebra a patadas.", "Ai ama! Adiós pintxos."]},
]
for g in nuevos:
    if g['id'] not in ids: mj['juegos'].append(g)
json.dump(mj, open('data/minijuegos.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('games now', len(mj['juegos']))
