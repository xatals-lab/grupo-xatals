m = open('make_pages.py', encoding='utf-8').read()
m = m.replace('<p>Kaixo, lagunak! Dug · HRK · Koi · y media cuadrilla del cole armando lío</p>', '<p id="lema">Kaixo, lagunak! Dug · HRK · Koi · y media cuadrilla del cole armando lío</p>')
old = '<div id="vds"></div>'
assert m.count(old) == 1
m = m.replace(old, '<div id="vds"></div>\n<div class="panel" id="retos"></div>\n<div id="hoy"></div>')
m = m.replace('<div class="bloque s3"><a class="card" href="recursos.html">', '<div class="bloque"><a class="card" href="mus.html"><span class="em">🃏</span><h3>Mus en el Kupula</h3><p>2º de Bachillerato, con el Rizos, Wilhelm y Koi de camarero.</p></a></div>\n<div class="bloque"><a class="card" href="laboratorio.html"><span class="em">🧪</span><h3>Laboratorio</h3><p>Sliders: sube el calimocho y mira qué pasa.</p></a></div>\n<div class="bloque"><a class="card" href="claustro.html"><span class="em">🎓</span><h3>Claustro y orla</h3><p>Todos los profes y los compañeros.</p></a></div>\n<div class="bloque s3"><a class="card" href="recursos.html">', 1)
open('make_pages.py', 'w', encoding='utf-8').write(m)
print('home patched')
