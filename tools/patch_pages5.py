m = open('make_pages.py', encoding='utf-8').read()
# 1) recursos page
if '"recursos"' not in m:
    m = m.replace('"records": ("Hall of Fame"', '"recursos": ("Recursos", \'<h1 id="tit">Recursos</h1><div id="app">Cargando…</div>\', \'<script src="js/recursos.js"></script>\'),\n"records": ("Hall of Fame"', 1)
# 2) home: game of the week + Basque greeting + link to recursos
old = '<div class="bento">\n<div class="bloque s4"><a class="card destacado" href="futbol.html">'
assert m.count(old) == 1
m = m.replace(old, '<div id="vds"></div>\n' + old)
m = m.replace('<div class="bloque s3"><a class="card" href="chistes.html">', '<div class="bloque s3"><a class="card" href="recursos.html"><span class="em">📰</span><h3>Recursos para los tres Xatals</h3><p>El Correo, Noticias de Álava, Marca, AS y compañía. Informazio-iturriak.</p></a></div>\n<div class="bloque s3"><a class="card" href="chistes.html">', 1)
m = m.replace('<p>Dug · HRK · Koi · y media cuadrilla del cole armando lío</p>', '<p>Kaixo, lagunak! Dug · HRK · Koi · y media cuadrilla del cole armando lío</p>')
m = m.replace('<p>Dug, HRK y Koi en el bar', '<p>Dug, HRK y Koi en el bar')
# 3) home script: show the game of the week
old = 'cargaJSON("chistes").then(c=>{'
assert m.count(old) == 1
m = m.replace(old, 'cargaJSON("minijuegos").then(d=>{const v=d.juegos.filter(g=>g.vds).sort((a,b)=>(b.semana||"").localeCompare(a.semana||""))[0];if(!v)return;document.getElementById("vds").innerHTML=`<div class=\'bloque\' style=\'margin-bottom:1.1rem\'><a class=\'card destacado\' href=\'mj.html?g=${v.id}\' style=\'border-color:#ff2e93\'><span class=\'nuevo\'>VIDEOJUEGO DE LA SEMANA</span><span class=\'vista\'>${v.emoji}</span><span class=\'em\'>${v.emoji}</span><p class=\'medal\'>🎮 Videojuego de la semana · ${v.semana||""} · estilo: ${v.plantilla}</p><h3>${v.titulo}</h3><p>${v.resumen||v.intro}</p></a></div>`;}).catch(()=>{});' + old, 1)
# 4) juegos page: archive of games of the week
old = '<h2>🔥 Más juegos de la cuadrilla</h2>'
assert m.count(old) == 1
m = m.replace(old, '<h2>🎮 Videojuegos de la semana</h2><p>Cada viernes, uno nuevo y de un estilo distinto.</p><div class="grid" id="vdss"></div>' + old)
open('make_pages.py', 'w', encoding='utf-8').write(m)

print('pages patched')
