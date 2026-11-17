"""Generates the static HTML pages (run once: python make_pages.py). Hermek never needs to touch these."""
HEAD = '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>{t} · Grupo Xatals</title><link rel="stylesheet" href="css/style.css"><script src="js/common.js"></script></head><body><main>\n'
PAGES = {
"index": ("Inicio", """<div class="hero"><h1>🍻 Grupo Xatals</h1><p>Dug, HRK y Koi en el bar. Entra, siéntate y que no se te acabe la caña.</p></div>
<div id="semana" class="panel">Cargando novedades…</div>
<div class="grid">
<a class="card" href="bar.html"><div class="em">🍺</div><h3>El Bar</h3><p>Siéntate con la cuadrilla y recibe a los del cole uno a uno.</p></a>
<a class="card" href="apuestas.html"><div class="em">⚽</div><h3>Apuestas del Alavés</h3><p>Cuotas absurdas, fichas ficticias y ruina asegurada.</p></a>
<a class="card" href="quiz.html"><div class="em">🎤</div><h3>¿Quién lo dijo?</h3><p>Adivina quién soltó cada frase.</p></a>
<a class="card" href="chistes.html"><div class="em">😂</div><h3>Chistes</h3><p>La máquina de chistes de la cuadrilla, por temas.</p></a>
<a class="card" href="semana.html"><div class="em">📰</div><h3>Esta semana</h3><p>Novedades y fábulas de los viernes.</p></a>
</div>""", '<script>cargaJSON("semana").then(s=>{document.getElementById("semana").innerHTML="<b>📰 "+s.titulo+"</b> <span class=\'pill\'>"+s.actualizado+"</span><br>"+s.resumen+" <a href=\'semana.html\'>Ver más</a>";}).catch(()=>{document.getElementById("semana").remove()});</script>'),
"bar": ("El Bar", """<h1>🍺 El Bar</h1>
<div class="panel"><div class="seats" id="seats"></div></div>
<div class="panel meters"><div class="meter">😄 Ánimo<div class="bar"><i id="mAnimo"></i></div></div><div class="meter">💶 Cartera: <b id="mCartera"></b> €</div><div class="meter">🍻 Ronda: <b id="mRonda"></b>/<span id="mTotal"></span></div></div>
<div class="panel" id="escena"></div><div class="panel log" id="log"></div>""", '<script src="js/bar.js"></script>'),
"apuestas": ("Apuestas del Alavés", '<h1>⚽ Apuestas del Alavés</h1><div id="app" class="panel">Cargando…</div>', '<script src="js/apuestas.js"></script>'),
"quiz": ("¿Quién lo dijo?", '<h1>🎤 ¿Quién lo dijo?</h1><div id="app" class="panel">Cargando…</div>', '<script src="js/quiz.js"></script>'),
"chistes": ("Chistes", '<h1>😂 Chistes</h1><div class="panel"><div id="temas"></div><div id="chiste" style="font-size:1.3rem;margin:1rem 0">Pulsa el botón…</div><button id="otro">Otro chiste</button></div>', '<script src="js/chistes.js"></script>'),
"semana": ("Esta semana", '<h1>📰 Esta semana</h1><div id="app" class="panel">Cargando…</div>', '<script src="js/semana.js"></script>'),
}
for name, (title, body, script) in PAGES.items():
    with open(name + ".html", "w", encoding="utf-8") as fh:
        fh.write(HEAD.format(t=title) + body + "\n</main>" + script + "</body></html>\n")
    print("wrote", name + ".html")
