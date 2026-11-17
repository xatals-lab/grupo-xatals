m = open('make_pages.py', encoding='utf-8').read()
i = m.index('"recreo": ("Buxai en el recreo"')
j = m.index('"futbol"', i)
IMP = '<script type="importmap">{"imports":{"three":"https://unpkg.com/three@0.160.0/build/three.module.js"}}</script>'
nuevo = '''"recreo": ("Buxai en el recreo", """<h1>🥊 Buxai en el recreo</h1>
<p>Buxai se pelea con todos. Cuando se prepara, <b>esquiva</b> (deslizando, ← → o botones). Cuando se queda abierto, <b>pega</b> (toca, Espacio o botón). Cuidado: cuando le ganas, te la devuelve por la espalda. Y los profes vigilan el patio.</p>
<div class="arena" id="arena3d"><div class="hud"><span>TÚ <div class="bar" style="width:120px"><i id="hpTu"></i></div></span><span id="pts">0 PTS</span><span>BUXAI <div class="bar mal" style="width:120px"><i id="hpBx"></i></div></span></div>
<div id="lienzo3d" class="lienzo3d"></div><div class="msg" id="msg">Cargando el patio…</div></div>
<p><button id="izq">⬅ Esquiva izq.</button><button id="der">Esquiva der. ➡</button><button class="rosa" id="pega">👊 PEGA</button><button class="cian" id="start">▶ EMPEZAR</button></p><div id="rec"></div>""", \'''' + IMP + '''<script type="module" src="js/recreo3d.js"></script>\'),
'''
m = m[:i] + nuevo + m[j:]
open('make_pages.py', 'w', encoding='utf-8').write(m)
print('recreo page patched')
