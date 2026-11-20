m = open('make_pages.py', encoding='utf-8').read()
i = m.index('"recreo": ("Buxai en el recreo"'); j = m.index('"futbol"', i)
IMP = '<script type="importmap">{"imports":{"three":"https://unpkg.com/three@0.160.0/build/three.module.js"}}</script>'
nuevo = '''"recreo": ("Buxai en el recreo", """<h1>🥊 Buxai en el recreo</h1>
<p>Juego de peleas, mejor de 3 rounds. Mueve, pega 👊, patea 🦵, bloquea 🛡 y carga el especial ⚡ (patada de Tejedor). Buxai no para de hablar de Aznar y, cuando vas ganando, juega sucio. Los profes vigilan.</p>
<div class="arena" id="arena3d"><div class="hud"><span>PELEA</span><span id="pts">0 PTS</span><span></span></div>
<div id="lienzo3d" class="lienzo3d"><div class="ctl3d pelea"><button id="bIzq">⬅</button><button id="bDer">➡</button><button id="bBloq" class="sec">🛡</button><button id="bPuno" class="rosa">👊</button><button id="bPatada" class="rosa">🦵</button><button id="bEsp" class="cian">⚡</button></div></div><div class="msg" id="msg">Cargando el patio…</div></div>
<p><button class="cian" id="start">▶ EMPEZAR</button></p><div id="rec"></div>""", \'''' + IMP + '''<script type="module" src="js/recreo3d.js"></script>\'),
'''
m = m[:i] + nuevo + m[j:]
open('make_pages.py', 'w', encoding='utf-8').write(m)
css = open('css/premium.css', encoding='utf-8').read()
css += '''
.pelea-hud{position:absolute;left:.4rem;right:.4rem;top:.4rem;display:grid;grid-template-columns:1fr auto 1fr;gap:.5rem;align-items:start;pointer-events:none;font-family:Bangers,Impact,sans-serif;letter-spacing:.06em}
.pelea-hud b{font-size:1rem;color:#fff;text-shadow:0 2px 0 #000}.pelea-hud .bar{height:14px;margin:2px 0}.pelea-hud .bar.esp{height:7px}.pelea-hud .bar.esp i{background:linear-gradient(90deg,#00e5ff,#b066ff)}
.pelea-hud>div:last-child{text-align:right}.pelea-hud .ronda{font-size:1.1rem;color:#ffe500;text-shadow:0 2px 0 #000;padding-top:.2rem}
.globo3d{position:absolute;transform:translate(-50%,-100%);background:#fff;color:#111;border:3px solid #111;border-radius:16px;padding:.35rem .7rem;font-weight:800;font-size:.85rem;max-width:62%;text-align:center;opacity:0;transition:opacity .2s;pointer-events:none;box-shadow:0 6px 14px #0008;z-index:6}
.globo3d.on{opacity:1}.globo3d::after{content:"";position:absolute;left:50%;bottom:-12px;border:8px solid transparent;border-top-color:#111;transform:translateX(-50%)}
.ctl3d.pelea{flex-wrap:nowrap;gap:.3rem}.ctl3d.pelea button{min-width:0;max-width:none;flex:1;font-size:1.3rem;min-height:54px}
'''
open('css/premium.css', 'w', encoding='utf-8').write(css)
print('fighting game wired')
