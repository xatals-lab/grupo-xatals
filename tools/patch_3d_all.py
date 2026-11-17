p = 'js/mj.js'
t = open(p, encoding='utf-8').read()
old = 'const AYUDA={'
assert t.count(old) == 1
new = '''/* every template now runs in 3D (js/juegos3d.js, js/carril3d.js); the old 2D version stays only as a fallback if WebGL is unavailable */
for(const k of ["pulsa","apila","busca","ritmo","simon","timing","aguanta"]){const viejo=TPL[k];TPL[k]=(g)=>{arena.innerHTML='<div id="c3d" class="lienzo3d"></div>';
  import("./juegos3d.js").then(m=>m[k]($("c3d"),g,{hud:setHud,say,fin})).catch(e=>{console.error(e);arena.innerHTML="";viejo(g);});};}
{const viejoRunner=TPL.runner;TPL.runner=(g)=>{TPL.carril3d({...g,tema:g.tema||"calle"});};}
const AYUDA={'''
t = t.replace(old, new)
# help texts in plain words for the 3D versions
t = t.replace('pulsa:["👆","Toca los BUENOS y no toques los MALOS","Cada acierto suma puntos. Cada fallo resta. Se acelera según pasa el tiempo."]', 'pulsa:["👆","TOCA lo bueno que sale de los agujeros y NO toques lo malo","Cada acierto suma puntos. Cada fallo resta. Se acelera con el tiempo."]')
t = t.replace('busca:["🔍","Encuentra el objetivo entre todos y TÓCALO","Si fallas, pierdes puntos. El tiempo corre."]', 'busca:["🔍","Encuentra el objetivo entre toda la multitud y TÓCALO","La cámara se mueve sola. Si fallas, pierdes puntos y el tiempo corre."]')
t = t.replace('simon:["🧠","MIRA la secuencia y REPÍTELA tocando los botones","Cada ronda es más larga."]', 'simon:["🧠","MIRA qué plataformas se iluminan y REPÍTELO tocándolas","Cada ronda es más larga."]')
t = t.replace('ritmo:["🎸","Toca la columna cuando la nota cruce la LÍNEA AMARILLA","Encadena notas seguidas para subir el combo."]', 'ritmo:["🎸","Las notas vienen hacia ti: pulsa su carril cuando crucen la LÍNEA AMARILLA","Encadena notas seguidas para subir el combo."]')
t = t.replace('apila:["⬇️","Toca SUELTA para colocar el bloque justo encima del anterior","Lo que sobresale se pierde. ¡Llega al piso 12!"]', 'apila:["⬇️","TOCA la pantalla para soltar el bloque justo encima del anterior","Lo que sobresale se cae. ¡Llega al piso 12!"]')
t = t.replace('timing:["⏹","Toca PARA cuando la aguja esté en la zona VERDE","La zona se hace más pequeña en cada ronda."]', 'timing:["⏹","TOCA la pantalla para parar la bola sobre la zona VERDE","La zona se hace más pequeña en cada ronda."]')
t = t.replace('aguanta:["🗣","MANTÉN pulsado el botón y SUELTA en la zona verde","Mientras mantienes, la palabra se estira. Suelta justo en la zona."]', 'aguanta:["🗣","MANTÉN pulsado para hinchar el globo y SUELTA cuando toque el anillo verde","Mientras mantienes, la palabra se estira. Suelta justo en el anillo."]')
open(p, 'w', encoding='utf-8').write(t)

m = open('make_pages.py', encoding='utf-8').read()
m = m.replace('    ("bar.html", "🍺", "El Bar", "La cuadrilla en la barra y los del cole entrando uno a uno.", False),\n', '')
open('make_pages.py', 'w', encoding='utf-8').write(m)

h = open('js/home.js', encoding='utf-8').read()
h = h.replace('["bar.html","🍺","El Bar","Los del cole entran uno a uno."],', '')
open('js/home.js', 'w', encoding='utf-8').write(h)

v = open('tools/validate.py', encoding='utf-8').read()
open('tools/validate.py', 'w', encoding='utf-8').write(v)
print('3D wiring done; bar removed from hub:', 'El Bar' not in m.split('GAMES')[1].split('games_cards')[0])
