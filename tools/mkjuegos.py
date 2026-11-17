"""Initial minigame set built from the group's anecdotes (run from the repo root: python tools/mkjuegos.py). After that Hermek adds games through site_update minijuegos_add."""
import json


def pulsa(id, t, e, res, intro, b, m, ok, ko, dur=30, dif=2):
    return {"id": id, "plantilla": "pulsa", "titulo": t, "emoji": e, "resumen": res, "intro": intro, "dificultad": dif, "nuevo": True, "duracion": dur,
            "buenos": [{"e": x} for x in b], "malos": [{"e": x} for x in m], "msg_ok": ok, "msg_ko": ko, "consigna": "Pulsa los buenos y no toques los malos"}


def op(t, r, animo=0, cartera=0):
    return {"t": t, "r": r, "animo": animo, "cartera": cartera}


J = []
J.append(pulsa("servicios-minimos", "Koi y los servicios mínimos", "🧑‍💼", "Caña y pintxo para ti; papeleo para Koi.",
               "Cuando salen pintxos y cañas, pulsa. Cuando sale papeleo (anexos, libro de reclamaciones), NO: Koi pide servicios mínimos y se te cae la puntuación.",
               ["🍺", "🥘", "🍻"], ["📎", "📋", "📑"], ["¡Pintxo a salvo!", "Caña cobrada.", "Servicios máximos."], ["Koi: esto no entra en mi horario.", "Servicios mínimos activados.", "Anexo firmado, ánimo hundido."]))
J.append(pulsa("calimocho-pica", "Calimocho contra pica", "🍷", "Calimocho sí. Pica es bebida de flojos.",
               "Pulsa los calimochos. Si tocas una pica (cerveza con limón), te cae la fama de flojo del grupo.",
               ["🍷", "🥤"], ["🍺🍋"], ["¡Calimocho, como Dios manda!", "Eso es un hombre.", "Otro al bote."], ["Pica: bebida de flojos.", "Hoy te toca invitar por flojo.", "Koi aplaude (pide pica)."]))
J.append(pulsa("querejeta-destituye", "Querejeta destituye", "👔", "Echa entrenadores antes de que se enfríe el palco.",
               "Salen entrenadores del Alavés: pulsa para destituir, que Josean Querejeta no perdona. A Bordalás (el hombre de hierro, ya en el Getafe) no se le toca.",
               ["🧑‍🏫", "🧢", "📋"], ["🦾"], ["¡Destituido!", "Rueda de prensa de despedida.", "Otro al paro."], ["Bordalás ni se inmuta.", "El hombre de hierro te mira mal.", "Eso se paga con pica."], dur=28, dif=3))
J.append(pulsa("patadas-tejedor", "Recreo con Tejedor", "⚽", "Pasa los balones y esquiva las patadas.",
               "En el recreo, Tejedor acaba todos los partidos a patadas. Pulsa los balones para pasarlos y evita las espinillas.",
               ["⚽"], ["🦵", "🥾"], ["Pase a la red.", "¡Qué control!", "Tejedor se emociona."], ["¡Patada en la espinilla!", "Tejedor: 'ha sido fútbol'.", "Falta, penalti y bronca."], dur=28, dif=3))
J.append(pulsa("irabi-rodamientos", "Irabi S.A.: turno de rodamientos", "⚙️", "Rodamientos para Héctor, correos con cariño no.",
               "En la fábrica de Héctor en Bergara las condiciones son las más duras y los emails, directos. Pulsa los rodamientos. Los correos con cariño no existen: no los toques.",
               ["⚙️", "🔩", "🛠️"], ["💌", "🌸"], ["Rodamiento bien rodado.", "HRK asiente sin decir nada.", "Producción al máximo."], ["Aquí no se manda cariño.", "HRK pone cara de tierra embarrada.", "Insulto de bienvenida."], dif=3))
J.append({"id": "quien-era-quien", "plantilla": "memoria", "titulo": "¿Quién era quién en Marianistas?", "emoji": "🧠", "resumen": "Une cada personaje con lo que le define.",
          "intro": "Encuentra las parejas: el personaje del cole y lo que le definía.", "dificultad": 2, "nuevo": True, "consigna": "Une cada personaje con lo que le define",
          "pares": [{"a": "Tejedor", "b": "⚽ patadas"}, {"a": "Buxai", "b": "✈️ Ryanair"}, {"a": "Abascal", "b": "👕 camisetas"}, {"a": "El Bacterio", "b": "🧪 «vaya examen»"},
                    {"a": "El Maketo", "b": "📖 filosofía"}, {"a": "Aiksmann", "b": "🖥️ informático"}, {"a": "El Rizos", "b": "🌀 academia de física"}, {"a": "Arrilucea", "b": "🚬 el pionero"}]})
J.append({"id": "diiios", "plantilla": "aguanta", "titulo": "El grito de PheDiox", "emoji": "🗣️", "resumen": "Estira el Diiiios hasta la zona verde.",
          "intro": "Mantén pulsado para estirar el DIIIIOOOS y suelta cuando la aguja esté en la zona verde. Aquí sí se estira: en el audio de Hermek no.", "dificultad": 3, "nuevo": True,
          "palabra": "Dios", "rondas": 5, "consigna": "Estira el Dios hasta la zona verde",
          "msg_ok": ["¡Ese Dios sí que sí!", "PheDiox se quita el sombrero.", "Voz de estadio."], "msg_ko": ["Dios se quedó corto.", "Se te cortó la voz.", "Eso no era ni un Dios de pueblo."]})
J.append({"id": "busca-edortha", "plantilla": "busca", "titulo": "¿Dónde está Edortha Mari?", "emoji": "🎸", "resumen": "El desaparecido de las dos hijas, escondido entre carritos.",
          "intro": "Edortha Mari desapareció del mapa al tener dos hijas. Encuéntralo entre carritos, peluches y biberones antes de que se esfume.", "dificultad": 3, "nuevo": True,
          "objetivo": {"e": "🎸", "t": "Edortha Mari (el de la guitarra punk)"}, "senuelos": [{"e": "👶"}, {"e": "🍼"}, {"e": "🛒"}, {"e": "🧸"}, {"e": "🚼"}, {"e": "🌳"}], "rondas": 5, "tiempo": 14,
          "msg_ko": ["Se ha esfumado otra vez.", "Dicen que lo vieron en un parque con un carrito."]})
J.append({"id": "camiseta-abascal", "plantilla": "busca", "titulo": "La camiseta del Alavés del 98", "emoji": "🎽", "resumen": "Encuentra la camiseta entre las 40 de Abascal.",
          "intro": "Daniel Abascal tiene todas las camisetas de fútbol posibles. Encuentra la del Alavés del 98 antes de que la guarde en la mochila.", "dificultad": 4, "nuevo": True,
          "objetivo": {"e": "🎽", "t": "la camiseta del Alavés del 98"}, "senuelos": [{"e": "👕"}], "rondas": 4, "tiempo": 16, "msg_ko": ["Abascal ya la ha guardado en la mochila."]})
J.append({"id": "aiksmann-tele", "plantilla": "simon", "titulo": "Aiksmann arregla la tele", "emoji": "🖥️", "resumen": "Repite la secuencia de cables como el último informático de 2003.",
          "intro": "El informático de Marianistas reinicia el sistema con una secuencia de cables. Repítela sin equivocarte.", "dificultad": 3, "nuevo": True, "rondas": 8,
          "botones": [{"e": "🔌", "c": "#ff2e93"}, {"e": "📺", "c": "#00e5ff"}, {"e": "🖥️", "c": "#39ff14"}, {"e": "💾", "c": "#ffe500"}],
          "msg_ok": ["Reiniciado.", "Funciona con un clip.", "Windows 98 aprueba."], "msg_ko": ["Pantalla azul.", "Eso era el cable de la impresora."], "consigna": "¡Ahora repite la secuencia!"})
J.append({"id": "bihl-gimnasio", "plantilla": "timing", "titulo": "Bihl en el gimnasio", "emoji": "🏋️", "resumen": "Levanta pesas en el punto exacto, con humildad.",
          "intro": "Bihl, el quinto hombre de la industria guipuzcoana, levanta todo con humildad. Para la aguja en la zona verde para levantar el peso. La zona se hace más pequeña.", "dificultad": 3, "nuevo": True,
          "rondas": 5, "zona": 36, "consigna": "Para la aguja en la zona verde",
          "msg_ok": ["Levantado, y encima dice que no es para tanto.", "Bihl se sonroja.", "Peso muerto, pero vivo."], "msg_ko": ["Se te cae la barra.", "Eso pesaba más que el examen del Bacterio."]})
J.append({"id": "celedon", "plantilla": "timing", "titulo": "Bajar a Celedón", "emoji": "🎈", "resumen": "Frena la bajada en la zona buena, que es la Blanca.",
          "intro": "Es la fiesta de la Blanca: Celedón baja de la torre. Para la aguja en la zona verde para frenar la bajada. Si te pasas, aterrizas en el pote equivocado.", "dificultad": 2, "nuevo": True,
          "rondas": 5, "zona": 38, "consigna": "Frena a Celedón en la zona verde",
          "msg_ok": ["Aterrizaje perfecto en la plaza.", "El pueblo aplaude con txapela.", "Pote servido."], "msg_ko": ["Aterrizas en la fuente.", "Celedón pide otra caña mientras cuelga."]})
J.append({"id": "camino-primitivo", "plantilla": "decide", "titulo": "Camino Primitivo: ¿príncipes o peregrinos?", "emoji": "🥾", "resumen": "El albergue de la anécdota del PheDiox, versión juego.",
          "intro": "Llegáis a un albergue precario del Camino Primitivo y el dueño pregunta: ¿príncipes o peregrinos? Decide bien.", "dificultad": 2, "nuevo": True,
          "final": {"ruina": "Os quedáis sin un euro y con ampollas.", "bien": "Salís del Camino como príncipes y peregrinos a la vez.", "normal": "Dormís en litera, pero con anécdota.", "mal": "El dueño cuenta vuestra historia en el próximo albergue."},
          "escenas": [
              {"e": "🏚️", "titulo": "El albergue", "t": "El dueño os mira: ¿príncipes o peregrinos?", "o": [op("Príncipes", "Os cobra el triple por la manta real.", 10, -20), op("Peregrinos", "Os da una litera y una sopa con fideos tristes.", 5, -5), op("Las dos cosas", "Os mira, suspira y os pone en la litera de arriba con corona de cartón.", 15, -10)]},
              {"e": "🛏️", "titulo": "La litera", "t": "El PheDiox pide categoría y baño privado en un sitio sin agua caliente.", "o": [op("Apoyarle en la reclamación", "Reclamáis a un monte. Os escucha un burro.", 10, 0), op("Taparte con la manta", "Dormís mejor que el resto y sin pelea.", 5, 0), op("Ofrecerle una caña de consuelo", "El dueño os la cobra. Vaya gastos.", 5, -10)]},
              {"e": "🍷", "titulo": "La cena", "t": "Menú del peregrino: lentejas, pan duro y vino de garrafa.", "o": [op("Pedir calimocho", "El dueño os mira con respeto.", 15, -5), op("Pedir pica", "Silencio total. Os llaman flojos tres veces.", -10, -5), op("Mojar pan y callar", "Cena legendaria, calorías de oro.", 10, 0)]},
              {"e": "🌄", "titulo": "La subida", "t": "Mañana, cuesta de 900 metros con mochila.", "o": [op("Subir cantando Diiiios", "Os oyen desde Oviedo.", 15, 0), op("Coger un taxi", "Cuenta de 80 euros y vergüenza peregrina.", -10, -30), op("Subir a paso de vitoriano", "Tranquilo, cortés, con paraguas.", 10, 0)]},
              {"e": "📜", "titulo": "El sellado", "t": "El credencial pide un sello gracioso.", "o": [op("Pedir un sello de príncipe", "Os ponen una corona de tinta.", 10, 0), op("Falsificar un sello", "El dueño os guiña un ojo y os cobra la tinta.", 5, -10), op("Contarle la fábula del cole", "Os invita a una pica (que no queréis).", 10, -5)]}]})
J.append({"id": "juicio-maketo", "plantilla": "decide", "titulo": "El examen oral del Maketo", "emoji": "📖", "resumen": "Sobrevive a filosofía hasta que se jubile en Navidades.",
          "intro": "Miguel Valladolid, el Maketo, suspendió a casi todos en filosofía. Aguanta su examen oral hasta que se jubile.", "dificultad": 3, "nuevo": True,
          "final": {"ruina": "Te quedas sin nada, pero con un 4.", "bien": "Aprobado raspadillo. Se jubila y te salva.", "normal": "Un cinco pelado.", "mal": "Suspendido. Hasta Navidades."},
          "escenas": [
              {"e": "❓", "titulo": "Pregunta 1", "t": "¿Qué es la verdad?", "o": [op("Contestar con una cita de Platón", "Le gusta, pero no lo muestra.", 10), op("Responder: depende de la cuadrilla", "Lo apunta como respuesta valiente.", 5), op("Quedarte callado", "Calla, observa y baja la nota.", -10)]},
              {"e": "🧠", "titulo": "Pregunta 2", "t": "¿Existe la libertad?", "o": [op("Citar a Sartre", "El Maketo asiente: 'bien, pero con matices'.", 10), op("Hablar de las cañas", "Se ríe sin querer.", 15), op("Pedir permiso para ir al baño", "Te lo concede y te apunta cinco minutos.", -5)]},
              {"e": "🕰️", "titulo": "Casi Navidades", "t": "Faltan 3 días para las vacaciones.", "o": [op("Rezar por su jubilación", "Se ve que la oración funciona.", 15), op("Hacerle la pelota", "Pone tu nombre en la lista de salvados.", 10, -5), op("Reclamar nota", "Te baja medio punto por insistir.", -10)]},
              {"e": "🎄", "titulo": "La jubilación", "t": "El Maketo anuncia que se retira en Navidades.", "o": [op("Aplaudir", "Te mira con serenidad filosófica.", 15), op("Hacerle una tarta", "Cuesta 12 euros y funciona.", 10, -12), op("Salir corriendo", "Tu carrera se oye en tres plantas.", 10)]}]})
J.append({"id": "noche-electoral", "plantilla": "decide", "titulo": "Noche electoral de la cuadrilla", "emoji": "🗳️", "resumen": "Campaña, promesas y servicios mínimos de Koi.",
          "intro": "Dug, HRK y Koi se presentan a unas elecciones imaginarias. Decide la campaña con humor (todo inventado, sin odio).", "dificultad": 2, "nuevo": True,
          "final": {"ruina": "Te has gastado todo en carteles.", "bien": "Mayoría absoluta de la barra.", "normal": "Pactáis con el camarero.", "mal": "Koi pide recuento y servicios mínimos."},
          "escenas": [
              {"e": "📢", "titulo": "El mitin", "t": "Toca soltar la primera promesa.", "o": [op("Caña gratis los viernes", "Aplauso, y Koi pide la letra pequeña.", 15, -20), op("Prometer mucho y cumplir lo que te dé la gana", "Estilo político clásico. Funciona.", 10), op("Prometer el fin de las picas", "Los flojos se ofenden.", -5)]},
              {"e": "🧑‍💼", "titulo": "Koi pide", "t": "Koi quiere ser portavoz pero solo en su horario.", "o": [op("Aceptar sus servicios mínimos", "Habla 4 minutos y se va.", 5), op("Ficharlo para calimocho", "Acepta con tres condiciones.", 10, -10), op("Ignorarlo", "Pone un anexo.", -10)]},
              {"e": "🏭", "titulo": "HRK y la industria", "t": "HRK dice que la política es como Irabi: directo y sin cariño.", "o": [op("Adoptar su lema", "El electorado respeta el estilo.", 10), op("Pedir que suavice", "Os insulta con cariño.", 5), op("Poner a HRK de ministro", "Primera medida: más rodamientos.", 10, -5)]},
              {"e": "📺", "titulo": "El debate", "t": "Salís en un debate con tres sillas y una pica.", "o": [op("Beber pica a escondidas", "Te pillan: flojo oficial.", -15), op("Brindar con calimocho", "El público se emociona.", 15, -5), op("Hablar del Alavés", "Ganas por unanimidad.", 15)]}]})
json.dump({"juegos": J}, open("data/minijuegos.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(len(J), "games")
