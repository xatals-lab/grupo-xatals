import json, re

# ---- mj.js: carril3d template + "Cómo se juega" overlay ----
p = 'js/mj.js'
t = open(p, encoding='utf-8').read()
marker = '\n};\n})().catch(e=>{document.getElementById("mj")'
assert t.count(marker) == 1
t = t.replace(marker, ''',
/* ---- carril3d: console-style 3D lane game (see js/carril3d.js) ---- */
carril3d(g){
  arena.innerHTML=`<div id="c3d" class="lienzo3d"></div>`;
  import("./carril3d.js").then(m=>m.iniciar($("c3d"),g,{hud:setHud,say,fin})).catch(e=>{console.error(e);say("Tu navegador no puede abrir el 3D. Prueba con Chrome o Safari actualizados.");fin(0,"3D no disponible");});
}''' + marker)

old = '$("start").onclick=()=>{rec.innerHTML="";arena.innerHTML="";$("start").disabled=true;activo=true;pts=0;TPL[G.plantilla](G);};'
assert t.count(old) == 1
new = '''const AYUDA={
 pulsa:["👆","Toca los BUENOS y no toques los MALOS","Cada acierto suma puntos. Cada fallo resta. Se acelera según pasa el tiempo."],
 timing:["⏹","Toca PARA cuando la aguja esté en la zona VERDE","La zona se hace más pequeña en cada ronda."],
 aguanta:["🗣","MANTÉN pulsado el botón y SUELTA en la zona verde","Mientras mantienes, la palabra se estira. Suelta justo en la zona."],
 busca:["🔍","Encuentra el objetivo entre todos y TÓCALO","Si fallas, pierdes puntos. El tiempo corre."],
 simon:["🧠","MIRA la secuencia y REPÍTELA tocando los botones","Cada ronda es más larga."],
 ritmo:["🎸","Toca la columna cuando la nota cruce la LÍNEA AMARILLA","Encadena notas seguidas para subir el combo."],
 runner:["↔️","DESLIZA a izquierda o derecha para cambiar de carril","Coge lo bueno, esquiva lo malo. Tienes 3 vidas."],
 apila:["⬇️","Toca SUELTA para colocar el bloque justo encima del anterior","Lo que sobresale se pierde. ¡Llega al piso 12!"],
 carril3d:["🚆","DESLIZA a izquierda o derecha (o toca los lados) para cambiar de vía","Coge lo bueno, esquiva lo malo y, cuando veas los carteles, ELIGE la vía con la respuesta correcta para acelerar."]};
function ayuda(cb,forzar){const k="xatals_ayuda_"+G.plantilla;if(!forzar&&localStorage.getItem(k)){cb();return;}const a=G.ayuda||AYUDA[G.plantilla]||["🎮","Sigue las instrucciones","¡Suerte!"];
  const m=document.createElement("div");m.className="modal";m.innerHTML=`<div class="modal-in" style="text-align:center"><div style="font-size:4rem">${a[0]}</div><h2>Cómo se juega</h2><p style="font-size:1.2rem"><b>${a[1]}</b></p><p>${a[2]}</p><button class="rosa" id="entendido">¡Entendido, a jugar!</button></div>`;document.body.append(m);
  m.querySelector("#entendido").onclick=()=>{localStorage.setItem(k,"1");m.remove();cb();};}
const ab=document.createElement("button");ab.className="sec";ab.textContent="❓ Cómo se juega";ab.onclick=()=>ayuda(()=>{},true);$("start").after(ab);
$("start").onclick=()=>ayuda(()=>{rec.innerHTML="";arena.innerHTML="";$("start").disabled=true;activo=true;pts=0;TPL[G.plantilla](G);});'''
t = t.replace(old, new)
open(p, 'w', encoding='utf-8').write(t)

# ---- futbol3d: keeper reacts to where you touch ----
p = 'js/futbol3d.js'
f = open(p, encoding='utf-8').read()
old = 'cv.addEventListener("pointerdown", e => { if (ST.fase === "apunta") { ST.apuntando = true; mueve(e); sonido(480, .05); } else if (ST.fase === "para") ST.x0 = e.clientX; });'
assert f.count(old) == 1
f = f.replace(old, 'cv.addEventListener("pointerdown", e => { if (ST.fase === "apunta") { ST.apuntando = true; mueve(e); sonido(480, .05); } else if (ST.fase === "para") { const r = cv.getBoundingClientRect(), fx = (e.clientX - r.left) / r.width; ST.eleccion = fx < .38 ? 0 : fx > .62 ? 2 : 1; } });')
f = f.replace('$("modo").textContent = "🧤 ¡Eres el portero! Desliza o pulsa ⬅ ⬆ ➡ antes de que chute"', '$("modo").textContent = "🧤 ¡Eres el portero! Toca la IZQUIERDA, el CENTRO o la DERECHA de la pantalla antes de que chute"')
open(p, 'w', encoding='utf-8').write(f)

# ---- data: only real videogames. Remove quiz-like games, add the 3D train ----
mj = json.load(open('data/minijuegos.json', encoding='utf-8'))
mj['juegos'] = [g for g in mj['juegos'] if g['plantilla'] not in ('decide', 'memoria')]
for g in mj['juegos']:
    if g['id'] == 'koi-huye':
        g.update({"plantilla": "carril3d", "tema": "calle", "resumen": "3D: corre por la calle de Vitoria esquivando papeleo y cogiendo cañas.", "intro": "Son las 17:01 y Koi ya está fuera de horario. Corre por la calle: desliza a izquierda o derecha para cambiar de carril, coge cañas y pintxos y esquiva anexos y llamadas.", "duracion": 40})
mj['juegos'].append({"id": "don-hector", "plantilla": "carril3d", "tema": "tren", "titulo": "Don Héctor Viribay: maquinista de Renfe", "emoji": "🚆", "vds": True, "semana": "2026-W47", "nuevo": True, "dificultad": 2,
  "resumen": "3D: conduce el tren de Don Héctor y elige vía en cada cartel.",
  "intro": "Don Héctor Viribay pasó de delegado de clase a abogado y de abogado a maquinista de Renfe. Conduce su tren: desliza a izquierda o derecha para cambiar de vía, coge los carteles de campaña y, cuando aparezcan tres carteles, elige la vía con la respuesta correcta para acelerar.",
  "duracion": 50, "vidas": 3,
  "buenos": [{"e": "🪧"}, {"e": "📢"}, {"e": "🎩"}], "malos": [{"e": "🐄"}, {"e": "⏰"}, {"e": "🚧"}],
  "puertas": [
   {"pregunta": "¿Cuál fue su lema de campaña a delegado?", "opciones": ["Viribay, el futuro es hoy", "Votando a Viribay, ganamos todos", "Yo también soy Viribay"], "correcta": 1},
   {"pregunta": "¿A qué se dedicó al terminar Derecho?", "opciones": ["Piloto de Ryanair", "Informático del cole", "Bufete propio, de la nada"], "correcta": 2},
   {"pregunta": "¿Cómo hablaba de niño?", "opciones": ["Como un señor mayor", "Solo en euskera", "Con la voz de Koi"], "correcta": 0},
   {"pregunta": "¿Y de qué acabó trabajando?", "opciones": ["Camarero del Kupula", "Maquinista de Renfe", "Árbitro del Alavés"], "correcta": 1}],
  "msg_ok": ["¡Carteles pegados! Aznar estaría orgulloso.", "Don Héctor sonríe sin mover la cara.", "Ederra! Otro mitin ganado."],
  "msg_ko": ["Una vaca en la vía: Renfe de toda la vida.", "Retraso de Renfe: normal.", "Ai ama! Obras en la vía, hijo de puta."]})
json.dump(mj, open('data/minijuegos.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('games now:', len(mj['juegos']), [g['id'] for g in mj['juegos'] if g.get('vds')])

# ---- pages: importmap for the 3D template, mobile viewport, quiz out of the games hub ----
m = open('make_pages.py', encoding='utf-8').read()
m = m.replace('<meta name="viewport" content="width=device-width,initial-scale=1">', '<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,viewport-fit=cover"><meta name="theme-color" content="#07070a">')
m = m.replace("'<script src=\"js/mj.js\"></script>'", "'<script type=\"importmap\">{\"imports\":{\"three\":\"https://unpkg.com/three@0.160.0/build/three.module.js\"}}</script><script src=\"js/mj.js\"></script>'")
m = m.replace('    ("quiz.html", "🎤", "¿Quién lo dijo?", "Adivina quién soltó cada frase.", False),\n', '')
open('make_pages.py', 'w', encoding='utf-8').write(m)

q = open('js/quizsemana.js', encoding='utf-8').read()
if '¿Quién lo dijo?' not in q:
    q = q.replace('intro();\n})()', 'intro();\n})()')
open('js/quizsemana.js', 'w', encoding='utf-8').write(q)

css = open('css/premium.css', encoding='utf-8').read()
css += '''
/* ---- mobile first: everything must fit on a phone screen ---- */
html{-webkit-text-size-adjust:100%}body{overscroll-behavior-y:contain;padding-bottom:env(safe-area-inset-bottom)}
.lienzo3d{height:min(56dvh,540px);min-height:280px}
.arena{touch-action:manipulation}
.c3d-ui{position:absolute;inset:0;pointer-events:none}
.c3d-preg{position:absolute;left:.5rem;right:.5rem;top:.5rem;background:#000c;border:2px solid var(--amarillo);border-radius:14px;padding:.5rem .8rem;font-weight:800;text-align:center;opacity:0;transform:translateY(-10px);transition:.3s}
.c3d-preg.on{opacity:1;transform:none}
.c3d-flechas{position:absolute;left:.5rem;right:.5rem;bottom:.5rem;display:flex;justify-content:space-between}
.c3d-b{pointer-events:auto;margin:0;width:30%;min-height:56px;font-size:1.8rem;opacity:.75;box-shadow:0 5px 0 #0008}
@media(max-width:600px){.hud{flex-wrap:wrap}.msg{font-size:1.05rem;min-height:2.6rem}h1{font-size:clamp(1.7rem,8vw,2.4rem)}.panel{padding:.7rem .8rem}main{padding-left:.6rem;padding-right:.6rem}button,.btn{min-height:48px}}
@media(max-height:700px){.lienzo3d{height:50dvh}}
'''
open('css/premium.css', 'w', encoding='utf-8').write(css)

v = open('tools/validate.py', encoding='utf-8').read()
v = v.replace('PLANT = {"pulsa": ("buenos", "malos"), "timing": (), "decide": ("escenas",), "memoria": ("pares",), "aguanta": (), "busca": ("objetivo", "senuelos"),\n         "simon": ("botones",), "ritmo": ("notas",), "runner": ("buenos", "malos"), "apila": ("bloque",)}',
              'PLANT = {"pulsa": ("buenos", "malos"), "timing": (), "aguanta": (), "busca": ("objetivo", "senuelos"),\n         "simon": ("botones",), "ritmo": ("notas",), "runner": ("buenos", "malos"), "apila": ("bloque",), "carril3d": ("buenos", "malos")}\nPROHIBIDAS = ("decide", "memoria")   # quiz-like games are not videogames: quizzes live in the Quiz section')
v = v.replace('        if g.get("plantilla") not in PLANT:\n            err.append(f"minijuego {gid}: plantilla desconocida"); continue',
              '        if g.get("plantilla") in PROHIBIDAS:\n            err.append(f"minijuego {gid}: la plantilla {g[\'plantilla\']} ya no esta permitida: los juegos deben ser videojuegos de accion, los quizzes van en el Quiz semanal"); continue\n        if g.get("plantilla") not in PLANT:\n            err.append(f"minijuego {gid}: plantilla desconocida"); continue')
v = v.replace('        pl = g["plantilla"]\n', '        pl = g["plantilla"]\n        if pl == "carril3d":\n            if g.get("tema", "tren") not in ("tren", "calle"): err.append(f"minijuego {gid}: tema debe ser tren o calle")\n            for pu in g.get("puertas", []):\n                if len(pu.get("opciones", [])) != 3 or pu.get("correcta") not in (0, 1, 2) or not pu.get("pregunta"): err.append(f"minijuego {gid}: puerta mal formada (3 opciones, correcta 0-2)"); break\n', 1)
open('tools/validate.py', 'w', encoding='utf-8').write(v)
print('mobile patch done')
