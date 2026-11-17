"""Chistes nuevos (humor vitoriano, alavés, negro), El Bogus, pages (mus, laboratorio, claustro) and apuestas cap. Run once."""
import json

J = [
 ("alaves", "El Alavés es el único equipo que te enseña a sufrir antes de aprender a leer, y a seguir sufriendo cuando ya sabes."),
 ("alaves", "Ser del Alavés es como tener una novia guapa que te engaña cada domingo, pero a la que perdonas porque te dice 'aúpa'."),
 ("alaves", "Querejeta no despide entrenadores: los jubila antes de que se instalen."),
 ("alaves", "Bordalás convirtió el fútbol en una reunión de comunidad de vecinos con patadas."),
 ("alaves", "Mendizorroza no es un estadio: es un grupo de apoyo con grada."),
 ("alaves", "En Vitoria hay dos religiones: el Alavés y la lluvia. Y las dos te dejan empapado."),
 ("alaves", "Cuando el Alavés mete un gol, Vitoria se emociona con la intensidad de un jubilado viendo el telediario."),
 ("alaves", "La UEFA de 2001: el último recuerdo feliz de Vitoria y el primero que te cuentan los abuelos... otra vez."),
 ("alaves", "El Alavés tiene la mejor afición de España: la única que pide perdón al equipo cuando pierde."),
 ("alaves", "La esperanza es lo último que se pierde, salvo en Mendizorroza, donde se pierde en el minuto 5."),
 ("vitoria", "En Vitoria no hay atascos: hay una cola educada de gente esperando para decirse 'buenos días'."),
 ("vitoria", "Un vitoriano no dice que algo le gusta: dice que 'no está mal'. Si dice 'no está nada mal', está a punto de llorar."),
 ("vitoria", "En Vitoria 'luego te llamo' significa 'nunca'. En Bilbao, 'te llamo ahora' significa 'te llamo luego, si me acuerdo'."),
 ("vitoria", "El vitoriano de toda la vida lleva el paraguas desde junio, por si el cielo se pone chulo."),
 ("vitoria", "Si en Vitoria sale el sol, la gente lo mira con sospecha, como a un ministro."),
 ("vitoria", "Vitoria es la ciudad más verde de Europa y la que menos sale de casa para disfrutarlo."),
 ("vitoria", "En la Blanca todo el mundo grita 'Gora Celedón' y al día siguiente nadie recuerda quién era Celedón."),
 ("vitoria", "Vitoria: capital del País Vasco, de la tranquilidad y de los que se jubilan emocionalmente a los 35."),
 ("vascos", "Los bilbaínos creen que el mundo gira alrededor de Bilbao. Los vitorianos sabemos que gira alrededor de la tortilla."),
 ("vascos", "En Euskadi 'una cañita' son seis cañas, tres pintxos y un debate sobre el Athletic."),
 ("vascos", "El vasco no tiene prisa: tiene 'ya llegaré'. Y llega tarde con tanta dignidad que parece puntual."),
 ("vascos", "Un guipuzcoano cuenta una anécdota y te cobra el pintxo. Con IVA."),
 ("vascos", "A un bilbaíno nunca le caen mal los vitorianos: le caen bien desde lejos."),
 ("vascos", "El euskera es la única lengua en la que 'agur' significa adiós y suena a amenaza."),
 ("koi", "Koi tiene más servicios mínimos que Txagorritxu y menos horas trabajadas que el aparcacoches."),
 ("koi", "Koi lleva 20 años en SMC y aún no sabe si trabaja en marketing o en recursos humanos. SMC tampoco."),
 ("koi", "Koi se escaquea de Mendizorroza con tanta técnica que merecería ser presidente del club."),
 ("koi", "Koi pide una pica y se hace un silencio. El camarero llama a Dios y a su madre."),
 ("hrk", "HRK en Irabi trata a los empleados con tanto cariño como una trituradora a una lata."),
 ("hrk", "En Irabi no existe el lenguaje woke: existen los insultos sinceros y las nóminas con 'aguanta'."),
 ("hrk", "HRK dijo 'llego en cinco minutos' y todavía lo estamos esperando. Ya le han puesto calle."),
 ("hrk", "Pedir una pica es de flojos. Pedirla delante de HRK es suicidio social."),
 ("bar", "El calimocho es para la cuadrilla lo que el vino para Jesucristo: sacramento y excusa."),
 ("bar", "El que dice 'una y nos vamos' es el último en irse y el primero en pedir otra."),
 ("bar", "Mi cuadrilla no tiene problemas con el alcohol: tiene problemas con las cantidades, que es distinto."),
 ("bar", "Un amigo de verdad te ayuda a mudarte. Un amigo de cuadrilla te ayuda a mudarte de bar."),
 ("cole", "Marianistas nos preparó para trabajar en el siglo 20. Llegamos tarde veinticinco años y con la camisa mal planchada."),
 ("cole", "El Bacterio aprobaba tan poco que la gente rezaba antes de entrar. En un colegio de curas, con motivo."),
 ("cole", "El Maketo suspendió a media clase y se jubiló en Navidades. Dios existe y tiene sentido del humor."),
 ("cole", "Tejedor tiene 41 años y cara de 20: o ha pactado con el diablo o con una crema de farmacia."),
 ("cole", "Buxai se peleó con todo el curso y ahora te dice por megafonía que te abroches el cinturón. La vida es irónica, joder."),
 ("cole", "Abascal tiene más camisetas que el Corte Inglés y menos vida social que Edortha Mari."),
 ("cole", "Edortha Mari desapareció del mapa al tener dos hijas. La Interpol lo busca. Su mujer no."),
 ("cole", "El Chino daba leña como si cobrara a comisión."),
 ("cole", "Don Héctor Viribay nació jubilado y con el carnet del partido en el pañal."),
 ("cole", "PheDiox cambia de obsesión más que el Alavés de entrenador, y con menos resultados."),
 ("cole", "El Bogus toca el bajo tan fuerte que PheDiox ya no oye cómo pierde en el PC Fútbol."),
 ("cole", "El Rizos tiene una academia de física a la vieja escuela: o apruebas, o él se ríe, o las dos."),
 ("cole", "Wilhelm tira un dado para decidir si sale de casa. Casi siempre sale un 1 crítico."),
 ("cole", "Eugenio Gaviria era tutor y profesor de religión: te suspendía en ambas y encima te perdonaba los pecados."),
 ("politica", "Pedro Sánchez promete mucho y cumple lo que le da la gana, como un delegado de clase de Marianistas."),
 ("politica", "Trump y Bordalás tienen algo en común: los dos creen que el árbitro ha cobrado en su contra."),
 ("politica", "La política española es como el Alavés: mucha ilusión, malos entrenadores y un presidente que no suelta el cargo."),
 ("negro", "Cuando me muera, que me entierren en Mendizorroza: así por fin vendrá gente a verme."),
 ("negro", "En la cuadrilla no hay secretos: hay cosas que todos sabemos y a nadie le sale de los cojones contar."),
 ("negro", "Mi médico me dijo que dejara el calimocho. Yo cambié de médico, que es más fácil."),
 ("negro", "El Alavés es como mis ahorros: lo miro cada semana y me da una pena enorme."),
]
json.dump([{"tema": t, "texto": x} for t, x in J], open('data/chistes.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

per = json.load(open('data/personajes.json', encoding='utf-8'))
if not any(x['id'] == 'bogus' for x in per['invitados']):
    per['invitados'].append({"id": "bogus", "nombre": "El Bogus", "emoji": "🎸", "rol": "El vecino de PheDiox y bajista de heavy metal",
      "entrada": "Entra El Bogus con el pelo largo, el bajo a la espalda y cara de haber dormido mal: PheDiox ha vuelto a perder en el PC Fútbol.",
      "pulla": "Le revienta la pared a PheDiox cada vez que pierde al PC Fútbol: el único vecino que escucha derrotas en directo.",
      "opciones": [{"texto": "Invitarle a una caña de consuelo", "resultado": "Acepta, pero pide que PheDiox no gane nunca.", "animo": 15, "cartera": -5},
                   {"texto": "Preguntarle por el grupo de heavy de Vitoria", "resultado": "Os toca 40 minutos de bajo sin parar. Hasta el Bacterio entra a pedir silencio.", "animo": 10, "cartera": 0},
                   {"texto": "Decirle que PheDiox ha ganado por fin", "resultado": "Se le cae el bajo del susto. Era mentira, y te pega un manotazo.", "animo": -5, "cartera": 0}]})
json.dump(per, open('data/personajes.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
fr = json.load(open('data/frases.json', encoding='utf-8'))
if not any(f['autor'] == 'bogus' for f in fr):
    fr.append({"frase": "¡Otra vez perdiendo al PC Fútbol! ¡Voy a tirar esta pared!", "autor": "bogus", "opciones": ["bogus", "phediox", "buxai", "wilhelm"]})
json.dump(fr, open('data/frases.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)

# apuestas: hard cap on the total tokens staked
a = open('js/apuestas.js', encoding='utf-8').read()
old = 'document.getElementById("jugar").onclick=jugar;'
assert a.count(old) == 1
a = a.replace(old, '''const ins=[...app.querySelectorAll("input[type=number]")];
  const resto=()=>fichas-ins.reduce((s,i)=>s+(+i.value||0),0);
  const aviso=document.createElement("p");aviso.id="restoF";aviso.className="medal";app.querySelector("table").after(aviso);
  function topa(){ins.forEach(i=>{const otros=ins.reduce((s,j)=>s+(j===i?0:(+j.value||0)),0);const max=Math.max(0,fichas-otros);i.max=max;if(+i.value>max)i.value=max;});const r=resto();aviso.textContent=r>0?`Te quedan ${r} fichas por apostar (de ${fichas}).`:"Has apostado todas tus fichas: tope alcanzado.";ins.forEach(i=>{i.disabled=r===0&&!(+i.value>0);});}
  ins.forEach(i=>i.oninput=topa);topa();
  document.getElementById("jugar").onclick=jugar;''')
open('js/apuestas.js', 'w', encoding='utf-8').write(a)

m = open('make_pages.py', encoding='utf-8').read()
GAMES_NEW = '''GAMES = [
    ("recreo.html", "🥊", "Buxai en el recreo", "3D: esquiva, contraataca y no bajes la guardia: cuando le ganas, te la devuelve.", True),
    ("futbol.html", "⚽", "Tejedor al fútbol", "3D: penaltis en el patio de cemento. Cuando le ganas, te patea.", True),
    ("examen.html", "🧪", "Copiar al Bacterio", "3D: copia a Koi mientras el Bacterio no mira.", True),
    ("examen-maketo.html", "📖", "El examen del Maketo", "3D: filosofía imposible. Suspendes siempre... hasta que se jubila.", True),
    ("mus.html", "🃏", "Mus en el Bar Kupula", "2º Bachillerato: Dug y HRK contra el Rizos y Wilhelm. Con Koi de camarero.", True),
    ("bar.html", "🍺", "El Bar", "La cuadrilla en la barra y los del cole entrando uno a uno.", False),
    ("apuestas.html", "🎰", "Apuestas del Alavés", "Cuotas absurdas y fichas ficticias.", False),
    ("quiz.html", "🎤", "¿Quién lo dijo?", "Adivina quién soltó cada frase.", False),
]'''
i = m.index('GAMES = ['); j = m.index(']\ngames_cards', i) + 1
m = m[:i] + GAMES_NEW + m[j:]
IMP = ''
nuevas = '''"mus": ("Mus en el Bar Kupula", """<h1>🃏 Mus en el Bar Kupula</h1><span class="pill">2º DE BACHILLERATO</span>
<p>La mesa del fondo del Bar Kupula: tú y HRK contra El Rizos y Wilhelm, con Koi de camarero (servicios mínimos). Descarta (mus), apuesta en Grande, Chica, Pares y Juego, y a 30 piedras. ¡Órdago si tienes huevos!</p>
<div class="kupula"><div id="mesa" class="mesa"></div><div id="botones" class="botones"></div></div>
<p><button class="rosa" id="empezar">▶ Sentarse a la mesa</button></p><div class="panel log" id="log"><i>Aquí irá lo que dicen en la mesa.</i></div><div id="rec"></div>""", '<script src="js/mus.js"></script>'),
"laboratorio": ("Laboratorio", '<h1>🧪 Laboratorio de la cuadrilla</h1><p class="escribe">Sliders, botones y cosas que pasan. Tócalo todo.</p><div id="app">Cargando…</div>', '<script src="js/laboratorio.js"></script>'),
"claustro": ("Claustro y orla", '<h1>🎓 El claustro y la orla</h1><p>Los profes de Santa María y los compañeros de la cuadrilla, todos juntos.</p><div id="app">Cargando…</div>', '<script src="js/claustro.js"></script>'),
'''
m = m.replace('"records": ("Hall of Fame"', nuevas + '"records": ("Hall of Fame"', 1)
open('make_pages.py', 'w', encoding='utf-8').write(m)

css = open('css/premium.css', encoding='utf-8').read()
css += '''
.kupula{background:radial-gradient(90% 80% at 50% 0,#4a2a14,#1b0d06);border:1px solid #ffffff22;border-radius:22px;padding:1rem;box-shadow:0 30px 70px #000c;position:relative}
.kupula::before{content:"BAR KUPULA";position:absolute;right:1rem;top:.6rem;font-family:Bangers,Impact,sans-serif;color:#ff2e93;text-shadow:0 0 14px #ff2e93;letter-spacing:.1em}
.mesa{display:grid;grid-template-columns:1fr 1.2fr 1fr;grid-template-areas:". arriba ." "izq centro der" ". abajo .";gap:.6rem;align-items:center;text-align:center;min-height:380px;background:radial-gradient(circle,#0f5a2e,#073a1d);border-radius:60px;padding:1rem;box-shadow:inset 0 0 40px #000}
.asiento.arriba{grid-area:arriba}.asiento.izq{grid-area:izq}.asiento.der{grid-area:der}.asiento.abajo{grid-area:abajo}.centro{grid-area:centro}
.asiento b{font-size:.9rem}.naipe{display:inline-grid;place-items:center;width:52px;height:78px;margin:2px;background:#fffdf4;color:#111;border-radius:8px;box-shadow:0 6px 10px #0008;font-size:.8rem;line-height:1.1;cursor:default;user-select:none;transition:transform .15s}
.naipe b{font-size:.8rem}.naipe i{font-style:normal;font-size:1.2rem}.naipe.dorso{background:repeating-linear-gradient(45deg,#8a1c1c 0 6px,#5e1010 6px 12px);color:#fff;font-size:1.6rem}
#mias .naipe{cursor:pointer}#mias .naipe:hover{transform:translateY(-8px) rotate(-3deg)}.naipe.sel{transform:translateY(-14px);outline:3px solid var(--amarillo)}
.marcador{font-weight:800;font-size:.95rem;background:#0006;border-radius:99px;padding:.3rem .8rem;display:inline-block}.lance{font-family:Bangers,Impact,sans-serif;font-size:2rem;color:var(--amarillo);margin:.4rem 0}
.botones{text-align:center;margin-top:.8rem}.nota{color:#ccc;font-size:.9rem}
@media(max-width:600px){.naipe{width:40px;height:62px}.mesa{border-radius:30px;padding:.5rem}}
'''
open('css/premium.css', 'w', encoding='utf-8').write(css)

x = open('js/xp.js', encoding='utf-8').read()
old = 'let _chistes=null;async function bromita(){try{'
assert x.count(old) == 1
x = x.replace(old, 'let _chistes=null,_ultimaBroma=0;async function bromita(){if(Date.now()-_ultimaBroma<30000||document.querySelectorAll(".toast").length>=2)return;_ultimaBroma=Date.now();try{')
open('js/xp.js', 'w', encoding='utf-8').write(x)
print('content2 patched')
