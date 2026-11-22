import re, time
VER = time.strftime("%Y%m%d%H%M")
"""Generates the static HTML pages (run: python make_pages.py). Code only: Hermek never needs to touch this."""
HEAD = ('<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,viewport-fit=cover"><meta name="theme-color" content="#07070a"><meta name="robots" content="noindex,nofollow">'
        '<title>{t} · Grupo Xatals</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
        '<link href="https://fonts.googleapis.com/css2?family=Bangers&family=Permanent+Marker&family=Press+Start+2P&family=Sora:wght@400;600;800&display=swap" rel="stylesheet">'
        '<link rel="stylesheet" href="css/style.css"><link rel="stylesheet" href="css/premium.css"><script src="js/common.js"></script><script src="js/xp.js"></script></head><body><main>\n')

def card(href, em, title, text, nuevo=False):
    n = '<span class="nuevo">NUEVO</span>' if nuevo else ""
    return f'<a class="card rev" href="{href}">{n}<span class="em">{em}</span><h3>{title}</h3><p>{text}</p></a>'

GAMES = [
    ("recreo.html", "🥊", "Buxai en el recreo", "3D: esquiva, contraataca y no bajes la guardia: cuando le ganas, te la devuelve.", True),
    ("futbol.html", "⚽", "Tejedor al fútbol", "3D: penaltis en el patio de cemento. Cuando le ganas, te patea.", True),
    ("examen.html", "🧪", "Copiar al Bacterio", "3D: copia a Koi mientras el Bacterio no mira.", True),
    ("examen-maketo.html", "📖", "El examen del Maketo", "3D: filosofía imposible. Suspendes siempre... hasta que se jubila.", True),
    ("mus.html", "🃏", "Mus en el Bar Kupula", "2º Bachillerato: Dug y HRK contra el Rizos y Wilhelm. Con Koi de camarero.", True),
    ("apuestas.html", "🎰", "Apuestas del Alavés", "Cuotas absurdas y fichas ficticias.", False),
]
games_cards = "\n".join(card(*g) for g in GAMES)

PAGES = {
"index": ("Inicio", """<div class="hero"><span class="sun"></span><span class="floor"></span>
<span class="tag t1">Vitoria 4ever</span><span class="tag t2">Dios!!!</span><span class="tag t3">servicios mínimos</span><span class="tag t4">cañas &amp; pica</span>
<h1>GRUPO XATALS</h1><p id="lema">Kaixo, lagunak!</p><div class="acciones"><a class="btn rosa" href="juegos.html">▶ Jugar</a><a class="btn cian" href="quizsemana.html">🧠 Quiz</a></div></div>
<nav class="botonera">
<a href="juegos.html"><span class="ic">🎮</span>Juegos</a><a href="quizsemana.html"><span class="ic">🧠</span>Quiz</a><a href="records.html"><span class="ic">🏆</span>Hall of Fame</a>
<a href="paneles.html"><span class="ic">📊</span>Paneles</a><a href="laboratorio.html"><span class="ic">🧪</span>Laboratorio</a><a href="claustro.html"><span class="ic">🎓</span>Claustro</a>
<a href="chistes.html"><span class="ic">😂</span>Chistes</a><a href="semana.html"><span class="ic">📰</span>Esta semana</a><a href="recursos.html"><span class="ic">🔗</span>Recursos</a></nav>
<div id="vds"></div>
<div class="panel" id="retos"></div>
<div id="hoy"></div>
<div class="bento">
<div class="bloque s4"><a class="card destacado" href="futbol.html" data-tag="3D"><span class="nuevo">3D</span><span class="em">⚽</span><h3>Tejedor al fútbol</h3><p>Penaltis en el patio del cole.</p></a></div>
<div class="bloque"><a class="card" href="recreo.html" data-tag="3D"><span class="em">🥊</span><h3>Buxai en el recreo</h3></a></div>
<div class="bloque"><a class="card" href="examen.html" data-tag="3D"><span class="em">🧪</span><h3>Copiar al Bacterio</h3></a></div>
<div class="bloque"><a class="card" href="examen-maketo.html" data-tag="3D"><span class="em">📖</span><h3>Examen del Maketo</h3></a></div>
<div class="bloque"><a class="card" href="mus.html"><span class="em">🃏</span><h3>Mus en el Kupula</h3></a></div>
<div class="bloque"><a class="card" href="paneles.html"><span class="em">📊</span><h3>Paneles</h3></a></div>
<div class="bloque"><a class="card" href="laboratorio.html"><span class="em">🧪</span><h3>Laboratorio</h3></a></div>
<div class="bloque"><a class="card" href="claustro.html"><span class="em">🎓</span><h3>Claustro y orla</h3></a></div>
<div class="bloque"><a class="card" href="recursos.html"><span class="em">📰</span><h3>Recursos</h3></a></div>
</div>""", '<script src="js/home.js"></script>'),
"juegos": ("Juegos", f'<h1>Juegos</h1><div class="grid">{games_cards}</div><h2>🎮 Videojuegos de la semana</h2><p>Cada viernes, uno nuevo y de un estilo distinto.</p><div class="grid" id="vdss"></div><h2>🔥 Más juegos de la cuadrilla</h2><p>Hermek se inventa más cada semana con vuestras anécdotas.</p><div class="grid" id="mjs"></div>', '<script src="js/juegos.js"></script>'),
"bar": ("El Bar", """<h1>🍺 El Bar</h1>
<div class="panel"><div class="seats" id="seats"></div></div>
<div class="panel meters"><div class="meter">😄 ÁNIMO<div class="bar"><i id="mAnimo"></i></div></div><div class="meter">💶 <b id="mCartera"></b> €</div><div class="meter">🍻 RONDA <b id="mRonda"></b>/<span id="mTotal"></span></div></div>
<div class="panel" id="escena"></div><div id="rec"></div><div class="panel log" id="log"></div>""", '<script src="js/bar.js"></script>'),
"apuestas": ("Apuestas del Alavés", '<h1>🎰 Apuestas del Alavés</h1><div id="app" class="panel">Cargando…</div>', '<script src="js/apuestas.js"></script>'),
"quiz": ("¿Quién lo dijo?", '<h1>🎤 ¿Quién lo dijo?</h1><div id="app" class="panel">Cargando…</div>', '<script src="js/quiz.js"></script>'),
"chistes": ("Chistes", '<h1>😂 Chistes</h1><div class="panel"><div id="temas"></div><div id="chiste" style="font-size:1.4rem;margin:1rem 0;font-family:var(--f-tag)">Pulsa el botón…</div><button id="otro">Otro chiste</button></div>', '<script src="js/chistes.js"></script>'),
"semana": ("Esta semana", '<h1>📰 Esta semana</h1><div id="app" class="panel">Cargando…</div>', '<script src="js/semana.js"></script>'),
"recreo": ("Buxai en el recreo", """<h1>🥊 Buxai en el recreo</h1>
<p>Juego de peleas, mejor de 3 rounds. Mueve, pega 👊, patea 🦵, bloquea 🛡 y carga el especial ⚡ (patada de Tejedor). Buxai no para de hablar de Aznar y, cuando vas ganando, juega sucio. Los profes vigilan.</p>
<div class="arena" id="arena3d"><div class="hud"><span>PELEA</span><span id="pts">0 PTS</span><span></span></div>
<div id="lienzo3d" class="lienzo3d"><div class="ctl3d pelea"><button id="bIzq">⬅</button><button id="bDer">➡</button><button id="bBloq" class="sec">🛡</button><button id="bPuno" class="rosa">👊</button><button id="bPatada" class="rosa">🦵</button><button id="bEsp" class="cian">⚡</button></div></div><div class="msg" id="msg">Cargando el patio…</div></div>
<p><button class="cian" id="start">▶ EMPEZAR</button></p><div id="rec"></div>""", '<script type="importmap">{"imports":{"three":"https://unpkg.com/three@0.160.0/build/three.module.js"}}</script><script type="module" src="js/recreo3d.js"></script>'),
"futbol": ("Tejedor al fútbol", """<h1>⚽ Tejedor al fútbol</h1>
<p>Penaltis en el patio de cemento del cole contra Tejedor: cinco tiras tú y cinco paras tú. Él lee tu disparo casi siempre. Las escuadras no las llega a parar, pero se te pueden ir.</p>
<div class="arena" id="arena3d"><div class="hud"><span id="marc">TÚ 0 - 0 TEJEDOR</span><span id="ronda">Ronda 1/5</span></div>
<div id="lienzo3d" class="lienzo3d"><div class="ctl3d"><button class="rosa" id="tirar" style="display:none">⚽ TIRAR</button><span id="botonesP" style="display:none"><button class="sec" id="b0">⬅</button><button class="sec" id="b1">⬆</button><button class="sec" id="b2">➡</button></span></div></div><div class="msg" id="msg">Cargando el patio…</div><p id="modo" style="text-align:center;margin:.2rem"></p></div>
<p><button class="cian" id="start">▶ EMPEZAR</button></p><div id="rec"></div>""", '<script type="importmap">{"imports":{"three":"https://unpkg.com/three@0.160.0/build/three.module.js"}}</script><script type="module" src="js/futbol3d.js"></script>'),
"examen": ("Copiar al Bacterio", """<h1>🧪 Copiar al Bacterio</h1>
<p>Estás en tu pupitre de Santa María. Mantén <b>COPIAR</b> (o la tecla Espacio) para mirar el examen de Koi. Cuando el Bacterio se gira, <b>suelta</b>. Si te pilla: «vaya examen, señor <span class="sr">Urrutia</span>».</p>
<div class="arena"><div class="hud"><span>COPIADO <div class="bar" style="width:150px"><i id="cop"></i></div></span><span id="tiempo">60s</span><span>SOSPECHA <div class="bar mal" style="width:130px"><i id="sos"></i></div></span></div>
<div id="lienzo3d" class="lienzo3d"><div class="ctl3d"><button class="rosa" id="copia">👀 COPIAR (mantén)</button></div></div><div class="msg" id="msg">Cargando el aula…</div></div>
<p><button class="cian" id="start">▶ EMPEZAR</button></p><div id="rec"></div>""", '<script type="importmap">{"imports":{"three":"https://unpkg.com/three@0.160.0/build/three.module.js"}}</script><script>window.MODO_EXAMEN="bacterio"</script><script type="module" src="js/examen3d.js"></script>'),
"examen-maketo": ("Examen de filosofía", """<h1>📖 Examen de filosofía de Miguel Valladolid</h1>
<p>El Maketo suspendió a casi todos. Aquí también: es imposible aprobar. Aguanta las seis preguntas orales... hasta que lleguen las Navidades.</p>
<div class="arena"><div class="hud"><span>EXAMEN ORAL</span><span>FILOSOFÍA · 2º BACHILLERATO</span></div>
<div id="lienzo3d" class="lienzo3d"></div><div class="msg" id="msg">Cargando el aula…</div><div id="preg" style="padding:.6rem 1rem 1rem"></div></div>
<p><button class="cian" id="start">▶ EMPEZAR EL EXAMEN</button></p><div id="rec"></div>""", '<script type="importmap">{"imports":{"three":"https://unpkg.com/three@0.160.0/build/three.module.js"}}</script><script>window.MODO_EXAMEN="maketo"</script><script type="module" src="js/examen3d.js"></script>'),
"quizsemana": ("Quiz de la semana", '<h1>🧠 Quiz de la semana</h1><div id="app" class="panel">Cargando…</div><div id="rec"></div><p><a class="btn sec" href="quiz.html">🎤 Otro quiz: ¿Quién lo dijo?</a></p>', '<script src="js/quizsemana.js"></script>'),
"mj": ("Minijuego", """<h1 id="titulo"></h1><span class="pill" id="estrellas"></span><p id="intro"></p>
<div id="mj"><div class="arena"><div class="hud" id="hud"></div><div id="arena" style="padding:.6rem"></div><div class="msg" id="msg">Pulsa EMPEZAR</div></div><p><button class="cian" id="start">▶ EMPEZAR</button></p><div id="rec"></div></div>""", '<script type="importmap">{"imports":{"three":"https://unpkg.com/three@0.160.0/build/three.module.js"}}</script><script src="js/mj.js"></script>'),
"paneles": ("Paneles", '<h1>📊 Paneles de la cuadrilla</h1><p>Datos reales del chat, recalculados por Hermek cada viernes. Todo medido, nada inventado (salvo los chistes).</p><div id="app">Cargando…</div>', '<script src="js/paneles.js"></script>'),
"recursos": ("Recursos", '<h1 id="tit">Recursos</h1><div id="app">Cargando…</div>', '<script src="js/recursos.js"></script>'),
"mus": ("Mus en el Bar Kupula", """<h1>🃏 Mus en el Bar Kupula</h1><span class="pill">2º DE BACHILLERATO</span>
<p>La mesa del fondo del Bar Kupula: tú y HRK contra El Rizos y Wilhelm, con Koi de camarero (servicios mínimos). Descarta (mus), apuesta en Grande, Chica, Pares y Juego, y a 30 piedras. ¡Órdago si tienes huevos!</p>
<div class="kupula"><div id="mesa" class="mesa"></div><div id="botones" class="botones"></div></div>
<p><button class="rosa" id="empezar">▶ Sentarse a la mesa</button></p><div class="panel log" id="log"><i>Aquí irá lo que dicen en la mesa.</i></div><div id="rec"></div>""", '<script src="js/mus.js"></script>'),
"laboratorio": ("Laboratorio", '<h1>🧪 Laboratorio de la cuadrilla</h1><p class="escribe">Sliders, botones y cosas que pasan. Tócalo todo.</p><div id="app">Cargando…</div>', '<script src="js/laboratorio.js"></script>'),
"claustro": ("Claustro y orla", '<h1>🎓 El claustro y la orla</h1><p>Los profes de Santa María y los compañeros de la cuadrilla, todos juntos.</p><div id="app">Cargando…</div>', '<script src="js/claustro.js"></script>'),
"creditos": ("Créditos", '<h1>📸 Créditos de las fotos</h1><div id="app">Cargando…</div>', '<script src="js/creditos.js"></script>'),
"records": ("Hall of Fame", '<h1>🏆 Hall of Fame</h1><div id="app">Cargando…</div>', '<script src="js/records.js"></script>'),
}
for name, (title, body, script) in PAGES.items():
    with open(name + ".html", "w", encoding="utf-8") as fh:
        html = HEAD.format(t=title) + body + "\n</main>" + script + "</body></html>\n"
        html = re.sub(r'((?:src|href)="(?:js|css)/[^"?]+)"', r'\1?v=' + VER + '"', html)      # cache-busting for phones
        fh.write(html)
    print("wrote", name + ".html")
