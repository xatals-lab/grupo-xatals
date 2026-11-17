"""Generates the static HTML pages (run: python make_pages.py). Code only: Hermek never needs to touch this."""
HEAD = ('<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow">'
        '<title>{t} · Grupo Xatals</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
        '<link href="https://fonts.googleapis.com/css2?family=Bangers&family=Permanent+Marker&family=Press+Start+2P&display=swap" rel="stylesheet">'
        '<link rel="stylesheet" href="css/style.css"><script src="js/common.js"></script></head><body><main>\n')

def card(href, em, title, text, nuevo=False):
    n = '<span class="nuevo">NUEVO</span>' if nuevo else ""
    return f'<a class="card rev" href="{href}">{n}<span class="em">{em}</span><h3>{title}</h3><p>{text}</p></a>'

GAMES = [
    ("recreo.html", "🥊", "Buxai en el recreo", "Esquiva, contraataca y no acabes en la arboleda con una caja de bombones.", True),
    ("futbol.html", "⚽", "Tejedor al fútbol", "Penaltis contra el futbolista nato. Es muy difícil. Casi imposible.", True),
    ("examen.html", "🧪", "Copiar al Bacterio", "Mira el examen de Koi mientras el Bacterio no mira. Si te pilla, vaya examen.", True),
    ("bar.html", "🍺", "El Bar", "La cuadrilla en la barra y los del cole entrando uno a uno.", False),
    ("apuestas.html", "🎰", "Apuestas del Alavés", "Cuotas absurdas y fichas ficticias.", False),
    ("quiz.html", "🎤", "¿Quién lo dijo?", "Adivina quién soltó cada frase.", False),
]
games_cards = "\n".join(card(*g) for g in GAMES)

PAGES = {
"index": ("Inicio", f"""<div class="hero"><span class="sun"></span><span class="floor"></span>
<span class="tag t1">Vitoria 4ever</span><span class="tag t2">Dios!!!</span><span class="tag t3">servicios mínimos</span><span class="tag t4">cañas &amp; pica</span>
<h1>GRUPO XATALS</h1><p>Dug · HRK · Koi · y media cuadrilla del cole armando lío</p><a class="btn rosa" href="juegos.html">▶ Jugar</a><a class="btn cian" href="quizsemana.html">Quiz de la semana</a></div>
<div class="ticker"><span id="tk">Cargando bulos de la cuadrilla…</span></div>
<div id="semana" class="panel rev">Cargando novedades…</div>
<div class="grid">{card("recreo.html","🥊","Buxai en el recreo","Puñetazos, esquivas y bombones.",True)}{card("quizsemana.html","🧠","Quiz de la semana","¿Quién se acuerda de todo lo que hemos dicho?",True)}{card("records.html","🏆","Hall of Fame","Quién manda en la cuadrilla, con corona incluida.")}</div>""",
 '<script>cargaJSON("semana").then(s=>{document.getElementById("semana").innerHTML="<h3>📰 "+s.titulo+" <span class=\'pill\'>"+s.actualizado+"</span></h3>"+s.resumen+" <a href=\'semana.html\'>Ver más</a>";}).catch(()=>{document.getElementById("semana").remove()});cargaJSON("chistes").then(c=>{const t=baraja(c).slice(0,8).map(x=>x.texto).join("  ★  ");document.getElementById("tk").textContent=t+"  ★  "+t;}).catch(()=>{});</script>'),
"juegos": ("Juegos", f'<h1>Juegos</h1><div class="grid">{games_cards}</div><h2>🔥 Más juegos de la cuadrilla</h2><p>Hermek se inventa más cada semana con vuestras anécdotas.</p><div class="grid" id="mjs"></div>', '<script src="js/juegos.js"></script>'),
"bar": ("El Bar", """<h1>🍺 El Bar</h1>
<div class="panel"><div class="seats" id="seats"></div></div>
<div class="panel meters"><div class="meter">😄 ÁNIMO<div class="bar"><i id="mAnimo"></i></div></div><div class="meter">💶 <b id="mCartera"></b> €</div><div class="meter">🍻 RONDA <b id="mRonda"></b>/<span id="mTotal"></span></div></div>
<div class="panel" id="escena"></div><div id="rec"></div><div class="panel log" id="log"></div>""", '<script src="js/bar.js"></script>'),
"apuestas": ("Apuestas del Alavés", '<h1>🎰 Apuestas del Alavés</h1><div id="app" class="panel">Cargando…</div>', '<script src="js/apuestas.js"></script>'),
"quiz": ("¿Quién lo dijo?", '<h1>🎤 ¿Quién lo dijo?</h1><div id="app" class="panel">Cargando…</div>', '<script src="js/quiz.js"></script>'),
"chistes": ("Chistes", '<h1>😂 Chistes</h1><div class="panel"><div id="temas"></div><div id="chiste" style="font-size:1.4rem;margin:1rem 0;font-family:var(--f-tag)">Pulsa el botón…</div><button id="otro">Otro chiste</button></div>', '<script src="js/chistes.js"></script>'),
"semana": ("Esta semana", '<h1>📰 Esta semana</h1><div id="app" class="panel">Cargando…</div>', '<script src="js/semana.js"></script>'),
"recreo": ("Buxai en el recreo", """<h1>🥊 Buxai en el recreo</h1>
<p>Buxai se pelea con todos. Cuando se prepara, <b>esquiva</b> (← → o botones). Cuando se queda abierto, <b>pega</b> (Espacio o botón). Sin bombones, ¿eh?</p>
<div class="arena" id="arena"><div class="hud"><span>TÚ <div class="bar" style="width:140px"><i id="hpTu"></i></div></span><span id="pts">0 PTS</span><span>BUXAI <div class="bar mal" style="width:140px"><i id="hpBx"></i></div></span></div>
<div class="fighters"><div class="big" id="tu">🧔</div><div class="big" id="bx">😤</div></div><div class="msg" id="msg">Pulsa EMPEZAR</div></div>
<p><button id="izq">⬅ Esquiva izq.</button><button id="der">Esquiva der. ➡</button><button class="rosa" id="pega">👊 PEGA</button><button class="cian" id="start">▶ EMPEZAR</button></p><div id="rec"></div>""", '<script src="js/recreo.js"></script>'),
"futbol": ("Tejedor al fútbol", """<h1>⚽ Tejedor al fútbol</h1>
<p>Tanda de penaltis contra Tejedor, que con 41 años tiene cuerpo de 20 y acaba todo a patadas. Para la barra de potencia y puntería con <b>Espacio</b> o el botón. Después paras tú. Va a ser difícil.</p>
<div class="arena" id="arena"><div class="hud"><span id="marc">TÚ 0 - 0 TEJEDOR</span><span id="ronda">Ronda 1/5</span></div>
<div class="fighters"><div class="big" id="porter">🧤</div><div class="big">⚽</div></div>
<div style="padding:0 1rem 1rem"><div class="bar"><i id="medidor" style="width:0"></i></div><div class="msg" id="msg">Pulsa EMPEZAR</div></div></div>
<p><button class="sec" id="b0">⬅ Izq.</button><button class="sec" id="b1">⬆ Centro</button><button class="sec" id="b2">Der. ➡</button><button class="rosa" id="para">⚽ CHUTA</button><button class="cian" id="start">▶ EMPEZAR</button></p><div id="rec"></div>""", '<script src="js/futbol.js"></script>'),
"examen": ("Copiar al Bacterio", """<h1>🧪 Copiar al Bacterio</h1>
<p>Mantén <b>COPIAR</b> (o la tecla Espacio) para ver el examen de Koi. Cuando el Bacterio se gira, <b>suelta</b>. Si te pilla copiando: <i>vaya examen, señor Urrutia</i>.</p>
<div class="arena" id="arena"><div class="hud"><span>COPIADO <div class="bar" style="width:160px"><i id="cop"></i></div></span><span id="tiempo">60</span><span>SOSPECHA <div class="bar mal" style="width:140px"><i id="sos"></i></div></span></div>
<div class="fighters"><div class="big">🧑‍🎓</div><div class="big" id="bac">🧪</div><div class="big">🧑‍💼</div></div><div class="msg" id="msg">Pulsa EMPEZAR</div></div>
<p><button class="rosa" id="copia">👀 COPIAR (mantén)</button><button class="cian" id="start">▶ EMPEZAR</button></p><div id="rec"></div>""", '<script src="js/examen.js"></script>'),
"quizsemana": ("Quiz de la semana", '<h1>🧠 Quiz de la semana</h1><div id="app" class="panel">Cargando…</div><div id="rec"></div>', '<script src="js/quizsemana.js"></script>'),
"mj": ("Minijuego", """<h1 id="titulo"></h1><span class="pill" id="estrellas"></span><p id="intro"></p>
<div id="mj"><div class="arena"><div class="hud" id="hud"></div><div id="arena" style="padding:.6rem"></div><div class="msg" id="msg">Pulsa EMPEZAR</div></div><p><button class="cian" id="start">▶ EMPEZAR</button></p><div id="rec"></div></div>""", '<script src="js/mj.js"></script>'),
"paneles": ("Paneles", '<h1>📊 Paneles de la cuadrilla</h1><p>Datos reales del chat, recalculados por Hermek cada viernes. Todo medido, nada inventado (salvo los chistes).</p><div id="app">Cargando…</div>', '<script src="js/paneles.js"></script>'),
"records": ("Hall of Fame", '<h1>🏆 Hall of Fame</h1><div id="app">Cargando…</div>', '<script src="js/records.js"></script>'),
}
for name, (title, body, script) in PAGES.items():
    with open(name + ".html", "w", encoding="utf-8") as fh:
        fh.write(HEAD.format(t=title) + body + "\n</main>" + script + "</body></html>\n")
    print("wrote", name + ".html")
