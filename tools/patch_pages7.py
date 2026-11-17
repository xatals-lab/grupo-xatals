m = open('make_pages.py', encoding='utf-8').read()
# replace the old 2D exam page with the 3D one and add the Maketo exam
i = m.index('"examen": ("Copiar al Bacterio"')
j = m.index('"quizsemana"', i)
IMP = '<script type="importmap">{"imports":{"three":"https://unpkg.com/three@0.160.0/build/three.module.js"}}</script>'
nuevo = '''"examen": ("Copiar al Bacterio", """<h1>🧪 Copiar al Bacterio</h1>
<p>Estás en tu pupitre de Santa María. Mantén <b>COPIAR</b> (o la tecla Espacio) para mirar el examen de Koi. Cuando el Bacterio se gira, <b>suelta</b>. Si te pilla: «vaya examen, señor Urrutia».</p>
<div class="arena"><div class="hud"><span>COPIADO <div class="bar" style="width:150px"><i id="cop"></i></div></span><span id="tiempo">60s</span><span>SOSPECHA <div class="bar mal" style="width:130px"><i id="sos"></i></div></span></div>
<div id="lienzo3d" class="lienzo3d"></div><div class="msg" id="msg">Cargando el aula…</div></div>
<p><button class="rosa" id="copia">👀 COPIAR (mantén)</button><button class="cian" id="start">▶ EMPEZAR</button></p><div id="rec"></div>""", \'''' + IMP + '''<script>window.MODO_EXAMEN="bacterio"</script><script type="module" src="js/examen3d.js"></script>\'),
"examen-maketo": ("Examen de filosofía", """<h1>📖 Examen de filosofía de Miguel Valladolid</h1>
<p>El Maketo suspendió a casi todos. Aquí también: es imposible aprobar. Aguanta las seis preguntas orales... hasta que lleguen las Navidades.</p>
<div class="arena"><div class="hud"><span>EXAMEN ORAL</span><span>FILOSOFÍA · 2º BACHILLERATO</span></div>
<div id="lienzo3d" class="lienzo3d"></div><div class="msg" id="msg">Cargando el aula…</div><div id="preg" style="padding:.6rem 1rem 1rem"></div></div>
<p><button class="cian" id="start">▶ EMPEZAR EL EXAMEN</button></p><div id="rec"></div>""", \'''' + IMP + '''<script>window.MODO_EXAMEN="maketo"</script><script type="module" src="js/examen3d.js"></script>\'),
'''
m = m[:i] + nuevo + m[j:]
open('make_pages.py', 'w', encoding='utf-8').write(m)
css = open('css/premium.css', encoding='utf-8').read()
css += '''
.sello{position:absolute;left:50%;top:40%;transform:translate(-50%,-50%) rotate(-12deg);font-family:Bangers,Impact,sans-serif;font-size:clamp(2.4rem,9vw,5rem);color:#ff2b2b;border:6px solid #ff2b2b;border-radius:12px;padding:.1em .4em;background:#fff1;text-shadow:0 0 20px #000;z-index:5;animation:sello .8s ease-out forwards;pointer-events:none}
@keyframes sello{0%{transform:translate(-50%,-50%) rotate(-12deg) scale(3);opacity:0}30%{opacity:1}100%{transform:translate(-50%,-50%) rotate(-12deg) scale(1);opacity:.95}}
.lienzo3d{position:relative}
'''
open('css/premium.css', 'w', encoding='utf-8').write(css)
print('exam pages patched')
