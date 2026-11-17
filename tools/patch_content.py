"""Spicier jokes (cheeky-aggressive, never serious accusations), Don Héctor Viribay game of the week, pullas in the bar. Run once from the repo root."""
import json

mj = json.load(open('data/minijuegos.json', encoding='utf-8'))
G = {g['id']: g for g in mj['juegos']}


def mas(id, ok=None, ko=None):
    g = G[id]
    if ok: g['msg_ok'] = g.get('msg_ok', []) + ok
    if ko: g['msg_ko'] = g.get('msg_ko', []) + ko


mas('servicios-minimos', ["Pintxo salvado. Koi ni se ha enterado: estaba en horario de comer.", "Reflejos de alguien que nunca ha currado a destajo."],
    ["Koi saca el libro de reclamaciones. Y tú sin bolígrafo.", "Koi: 'esto lo veo el lunes'. Es viernes, pringado.", "Ese anexo lo firma tu padre, blando."])
mas('calimocho-pica', ["Calimocho cobrado. Koi lo mira con envidia: él pide pica."], ["Pica... eres flojo de nacimiento, como Koi.", "Eso lo pide el más flojo del grupo: tú.", "HRK te mira como a un email con cariño."])
mas('querejeta-destituye', ["Otro entrenador a la calle: Querejeta, hazme socio.", "Destituido más rápido que Dug un domingo."], ["Bordalás te mira y te quita las ganas de vivir.", "Josean ya te ha despedido a ti.", "Eso es tocar al hombre de hierro, valiente."])
mas('patadas-tejedor', ["Pase al pie, como cuando aún había colegio y rodillas."], ["Tejedor te rompe la espinilla y dice 'ha sido fútbol'.", "Con 41 años y cara de 20: así te pega, con vitalidad.", "Falta, roja y Tejedor sigue jugando."])
mas('irabi-rodamientos', ["HRK asiente. Es el mayor elogio que dará en su vida."], ["Aquí no hay cariño, hay rodamientos, blando.", "HRK te llama algo que no se puede escribir.", "Con ese email del cariño te echan de la nave."])
mas('busca-edortha', None, ["Edortha lleva años desaparecido y tú no lo encuentras ni con linterna.", "Ni sus amigos íntimos lo ven; tú menos."])
mas('camiseta-abascal', None, ["Abascal ya te ha rechazado el cambio de camiseta con desprecio."])
mas('aiksmann-tele', None, ["Pantalla azul, como la cara de Aiksmann cuando ve tu PC.", "Hasta Windows 98 lo hacía mejor."])
mas('bihl-gimnasio', ["Bihl: 'no es para tanto'. Y ha levantado un coche."], ["Bihl te levanta a ti de un brazo y te devuelve a la cinta."])
mas('celedon', None, ["Celedón te mira desde el aire con cara de 'qué vergüenza'."])
mas('diiios', None, ["PheDiox ha cambiado de obsesión mientras gritabas."])

# Don Héctor Viribay: game of the week (style: decide) + poster-sticking mini-game
def op(t, r, animo=0, cartera=0): return {"t": t, "r": r, "animo": animo, "cartera": cartera}
mj['juegos'] += [
 {"id": "don-hector", "plantilla": "decide", "titulo": "Don Héctor Viribay: de delegado a maquinista", "emoji": "🎩", "vds": True, "semana": "2026-W47",
  "resumen": "El niño que parecía un viejo, de la campaña tipo Aznar al volante de Renfe.", "intro": "Héctor Viribay, Don Héctor, hablaba como un señor mayor desde los 12 años. Guíale por su carrera: delegado de clase, abogado de la nada y maquinista de Renfe.",
  "dificultad": 2, "nuevo": True,
  "final": {"ruina": "Te quedas sin un euro, pero con la dignidad de un señor de 70.", "bien": "Mayoría absoluta en la vida: delegado, abogado y maquinista a la vez.", "normal": "Un currículum rarísimo pero respetable.", "mal": "Los compañeros te siguen riendo los discursos de hace 25 años."},
  "escenas": [
   {"e": "🧒", "titulo": "El niño con voz de señor mayor", "t": "En clase sueltas un discurso sobre la reforma fiscal. Tienes 12 años.", "o": [op("Citar a Aznar", "El profe te mira, la clase se parte: 'tiene 12 y suena a 60'.", 15), op("Hablar de fútbol como un niño", "Nadie te cree y pides un ábaco.", -5), op("Pedir la palabra con corbata", "Os lo tomáis con cachondeo y te aplauden.", 10)]},
   {"e": "🪧", "titulo": "La campaña", "t": "Te presentas a delegado de clase y el colegio amanece lleno de carteles.", "o": [op("«Votando a Viribay, ganamos todos»", "Parece la campaña de Aznar, pero con rotulador. Ganas por incomparecencia del rival.", 20, -10), op("Prometer recreos más largos", "Lo cumples lo que te da la gana. Política clásica.", 10), op("Un cartel gigante con tu cara", "Te lo arrancan en 7 minutos. Imprimes 40 más.", 5, -25)]},
   {"e": "🎤", "titulo": "El debate", "t": "Tu rival habla de fútbol y de golosinas. Tú de pensiones.", "o": [op("Hablar de pensiones con voz grave", "Tres alumnos se duermen, el resto te vota por respeto.", 10), op("Ofrecer bocadillos a los electores", "Compra de votos de bocata. Eficaz.", 15, -10), op("Dar la mano a todos como un candidato", "Hasta la conserje se emociona.", 15)]},
   {"e": "⚖️", "titulo": "El bufete de la nada", "t": "Terminas Derecho y abres un bufete tú solo, sin experiencia, de la noche a la mañana.", "o": [op("Un cartel: «Más de 20 años de experiencia»", "Tienes 24, pero convences a la vecina del quinto.", 10, 15), op("Llevar toga en las reuniones", "Los clientes creen que es disfraz.", 5, -5), op("Hablar como un señor mayor", "Aquí sí te sale natural. Fichas a tres clientes.", 15, 10)]},
   {"e": "🚆", "titulo": "El giro de 180 grados", "t": "Dejas la abogacía para ser maquinista de Renfe. Todos flipan.", "o": [op("Anunciar por megafonía: «Hoy les habla un abogado»", "Los pasajeros no entienden nada, pero llegan puntuales.", 15), op("Llegar siempre puntual, por deformación profesional", "Renfe se estremece: nunca había visto algo así.", 10, 10), op("Alegar contra tu propio retraso", "Te das la razón y pierdes el caso.", -5)]},
   {"e": "🏛️", "titulo": "El carnet de joven político", "t": "De niño te alistaste en las juventudes del PP, cuando hacía falta valor para eso en el País Vasco, y soñabas con ser político.", "o": [op("Presumir con orgullo discreto", "El valor de verdad no necesita carteles... aunque tú los pongas.", 15), op("Ir con traje a medida a la sede", "Eres el único afiliado juvenil con sastre.", 10, -10), op("Ensayar un discurso ante el espejo", "Te aplaudes tú solo, y se lo cree.", 10)]}]},
 {"id": "carteles-viribay", "plantilla": "pulsa", "titulo": "Pega los carteles de Viribay", "emoji": "🪧", "resumen": "Campaña electoral escolar: pega carteles y esquiva al conserje.", "intro": "Es la campaña de delegado más seria del colegio. Pulsa los carteles «Votando a Viribay, ganamos todos» y no toques al profe ni al conserje que los arrancan.",
  "dificultad": 2, "nuevo": True, "duracion": 30, "buenos": [{"e": "🪧"}, {"e": "📢"}], "malos": [{"e": "🧹"}, {"e": "🧑‍🏫"}],
  "msg_ok": ["¡Votando a Viribay, ganamos todos!", "Cartel pegado: Aznar estaría orgulloso.", "Ederra! Otro mitin ganado."], "msg_ko": ["El profe te arranca el cartel: oposición dura.", "El conserje se ríe de tu programa.", "Ai ama! Te han pillado pegando."], "consigna": "Pega carteles, no toques al profe"}]

json.dump(mj, open('data/minijuegos.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

# bar: pullas for everyone + Don Héctor as a new guest
per = json.load(open('data/personajes.json', encoding='utf-8'))
PULLA = {
 'tejedor': "Con 41 años y cara de 20: o ha pactado con el diablo o con una crema de farmacia.",
 'arrilucea': "Fue el primero en todo lo prohibido y el último en pagar una ronda.",
 'besga': "Viste de traje para ir a por el pan y opina como si tuviera columna en un periódico.",
 'buxai': "Se pegó con todo el curso y ahora te pide por megafonía que te abroches el cinturón. La ironía vuela alto.",
 'abascal': "Tiene 40 camisetas y ni una cita. Alguien tendría que decirle que ya vale.",
 'bacterio': "Aprobar con él era más difícil que entender a Koi cuando tiene el móvil apagado.",
 'monte': "Serio, comprometido y con cara de que te va a poner deberes en el bar.",
 'chino': "Daba leña como quien reparte pintxos: a todo el mundo y sin pedir permiso.",
 'maketo': "Suspendió a media clase y se jubiló en Navidades: el único que se escaqueó mejor que Koi.",
 'rizos': "Su academia de física a la vieja escuela: o aprobabas o te daba un abrazo de compasión.",
 'wilhelm': "Tira un dado para decidir si sale de casa. Casi siempre sale un 1.",
 'phediox': "Cambia de obsesión cada semana. Esta es el anarcocapitalismo; la que viene, sabe Dios.",
 'bihl': "Humilde, dice. Con esos brazos hasta la humildad intimida.",
 'aiksmann': "El último informático del siglo 20, arreglando impresoras con fe de misionero.",
 'edortha': "Desaparecido en acción desde que tuvo hijas. Se acepta recompensa.",
}
for x in per['invitados']:
    if x['id'] in PULLA: x['pulla'] = PULLA[x['id']]
if not any(x['id'] == 'viribay' for x in per['invitados']):
    per['invitados'].append({"id": "viribay", "nombre": "Héctor Viribay (Don Héctor)", "emoji": "🎩", "rol": "El niño que parecía un señor mayor",
     "entrada": "Entra Don Héctor Viribay con traje, maletín y un discurso de 40 minutos que nadie le había pedido.",
     "pulla": "Hablaba como un señor mayor a los 12 años: nació jubilado y quería ser político.",
     "opciones": [op("Votarle de delegado, por respeto", "Aparecen carteles con tu cara: «Votando a Viribay, ganamos todos». Tú no tenías cartel.", 10, -10),
                  op("Preguntarle por su bufete", "Te cuenta que lleva 'más de veinte años de experiencia'. Tiene 41.", 15, 0),
                  op("Pedirle que conduzca el tren a casa", "Puntual, sereno y con megafonía en latín jurídico.", 15, -5)]})
json.dump(per, open('data/personajes.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)

fr = json.load(open('data/frases.json', encoding='utf-8'))
if not any(f['autor'] == 'viribay' for f in fr):
    fr.append({"frase": "Votando a Viribay, ganamos todos.", "autor": "viribay", "opciones": ["viribay", "besga", "monte", "hrk"]})
json.dump(fr, open('data/frases.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)

b = open('js/bar.js', encoding='utf-8').read()
old = '<p>${inv.entrada}</p></div>`'
if old in b:
    b = b.replace(old, '<p>${inv.entrada}</p>${inv.pulla?`<p style="color:#ff8bc2"><i>${inv.pulla}</i></p>`:""}</div>`')
    open('js/bar.js', 'w', encoding='utf-8').write(b)
print('content patched; games:', len(mj['juegos']), 'bar guests:', len(per['invitados']))
