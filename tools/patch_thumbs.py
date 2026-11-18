import re
# ---------- CSS ----------
css = open('css/premium.css', encoding='utf-8').read()
css += '''
/* ---- thumbnails on every card + button-first home ---- */
.thumb{--h:200;position:relative;aspect-ratio:16/9;border-radius:14px;margin:0 0 .7rem;overflow:hidden;display:grid;place-items:center;background:linear-gradient(135deg,hsl(var(--h) 85% 48%),hsl(calc(var(--h) + 55) 80% 20%));box-shadow:inset 0 -30px 50px #0006,0 6px 18px #0007;transform:translateZ(20px)}
.thumb::before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(135deg,#ffffff14 0 10px,#0000 10px 22px);mix-blend-mode:overlay}
.thumb::after{content:"";position:absolute;left:-20%;top:-60%;width:70%;height:200%;background:linear-gradient(90deg,#fff0,#ffffff30,#fff0);transform:rotate(20deg);transition:transform .6s}
.card:hover .thumb::after{transform:translateX(260%) rotate(20deg)}
.thumb .te{position:relative;z-index:1;font-size:clamp(2.6rem,9vw,3.8rem);filter:drop-shadow(0 8px 10px #000b);transition:transform .25s}
.card:hover .thumb .te{transform:scale(1.15) rotate(-4deg)}
.thumb img{position:absolute;z-index:2;width:34%;max-width:84px;aspect-ratio:1;object-fit:contain;right:.6rem;bottom:.5rem;border-radius:14px;background:#fff;padding:6px;box-shadow:0 6px 14px #000a}
.thumb .tt{position:absolute;z-index:2;left:.5rem;top:.4rem;font-family:Bangers,Impact,sans-serif;font-size:.85rem;background:#000a;color:#ffe500;padding:.05rem .5rem;border-radius:99px;letter-spacing:.06em}
.card .nuevo{z-index:5}
.botonera{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:.7rem;margin:1.2rem 0}
.botonera a{display:flex;flex-direction:column;align-items:center;gap:.3rem;text-decoration:none;color:var(--blanco);background:linear-gradient(150deg,#1d1d28,#0c0c12);border:1px solid #ffffff2a;border-radius:20px;padding:.9rem .4rem;font-family:Bangers,Impact,sans-serif;letter-spacing:.05em;font-size:1.15rem;box-shadow:0 10px 0 #000a,0 14px 24px #0008;transition:transform .12s,border-color .2s;min-height:96px;justify-content:center}
.botonera a:active{transform:translateY(6px);box-shadow:0 3px 0 #000a}
.botonera a:hover{border-color:var(--amarillo)}
.botonera .ic{font-size:2.3rem;filter:drop-shadow(0 6px 6px #000)}
.hero .acciones{position:relative;z-index:3;display:flex;gap:.6rem;justify-content:center;flex-wrap:wrap}
.home .card p:not(.medal){display:none}
.home .card h3{font-size:1.25rem;margin:.1rem 0}
.home .card.destacado p:not(.medal){display:block}
.home #retos ul{display:flex;gap:.5rem;flex-wrap:wrap;list-style:none;padding:0;margin:.4rem 0}.home #retos li{background:#0006;border-radius:99px;padding:.2rem .7rem;font-size:.85rem}
.home #retos h2{font-size:1.1rem;margin:0 0 .3rem}.home #retos p{margin:.2rem 0}.home #retos p:last-child{display:none}
@media(max-width:600px){.botonera{grid-template-columns:repeat(3,1fr)}.botonera a{font-size:1rem;min-height:84px}}
'''
open('css/premium.css', 'w', encoding='utf-8').write(css)

# ---------- JS: automatic thumbnails ----------
c = open('js/common.js', encoding='utf-8').read()
if 'function miniaturas' not in c:
    c += '''
/* ---- every card gets a thumbnail: generated gradient + big emoji (+ site logo for external links) ---- */
function _hue(s){let h=7;for(const ch of s)h=(h*31+ch.charCodeAt(0))%360;return h;}
function miniaturas(root=document){root.querySelectorAll(".card").forEach(c=>{if(c.querySelector(".thumb"))return;const em=c.querySelector(".em"),h3=c.querySelector("h3");const e=c.dataset.thumb||(em?em.textContent.trim():"");if(!e)return;
  const t=document.createElement("div");t.className="thumb";t.style.setProperty("--h",_hue((h3?h3.textContent:"")+e));t.innerHTML=`<span class="te">${e}</span>`;
  if(c.dataset.tag)t.insertAdjacentHTML("beforeend",`<span class="tt">${c.dataset.tag}</span>`);
  if(c.dataset.img){const im=document.createElement("img");im.alt="";im.loading="lazy";im.src=c.dataset.img;im.onerror=()=>im.remove();t.append(im);}
  if(em)em.remove();c.prepend(t);});}
document.addEventListener("DOMContentLoaded",()=>{miniaturas();let tm=null;new MutationObserver(()=>{clearTimeout(tm);tm=setTimeout(()=>miniaturas(),60);}).observe(document.body,{childList:true,subtree:true});});
'''
open('js/common.js', 'w', encoding='utf-8').write(c)

# ---------- recursos: site logos ----------
r = open('js/recursos.js', encoding='utf-8').read()
r = r.replace('<a class="card" href="${l.url}" target="_blank" rel="noopener noreferrer">', '<a class="card" data-thumb="📰" data-tag="${g.eu||""}" data-img="https://www.google.com/s2/favicons?domain=${new URL(l.url).hostname}&sz=128" href="${l.url}" target="_blank" rel="noopener noreferrer"><span class="em">📰</span>')
open('js/recursos.js', 'w', encoding='utf-8').write(r)

# ---------- home: buttons first, almost no text ----------
m = open('make_pages.py', encoding='utf-8').read()
i = m.index('"index": ("Inicio"'); j = m.index('"juegos":', i)
nuevo = '''"index": ("Inicio", """<div class="hero"><span class="sun"></span><span class="floor"></span>
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
'''
m = m[:i] + nuevo + m[j:]
open('make_pages.py', 'w', encoding='utf-8').write(m)

# ---------- home.js: no more long text; the news summary lives in Esta semana ----------
h = open('js/home.js', encoding='utf-8').read()
h = re.sub(r'cargaJSON\("semana"\)\.then.*?\n', '', h, count=1)
h = re.sub(r'cargaJSON\("chistes"\)\.then.*?\n', '', h, count=1)
h = 'document.body.classList.add("home");\n' + h
h = h.replace('<p class="medal">🎮 Videojuego de la semana · ${v.semana||""} · estilo: ${v.plantilla}</p><h3>${v.titulo}</h3><p>${v.resumen||v.intro}</p>', '<p class="medal">🎮 Videojuego de la semana</p><h3>${v.titulo}</h3>')
h = h.replace('<span class="vista">${v.emoji}</span><span class="em">${v.emoji}</span>', '<span class="em">${v.emoji}</span>')
h = h.replace('<span class="em">${h[1]}</span><h3>${h[2]}</h3><p>${h[3]}</p>', '<span class="em">${h[1]}</span><h3>${h[2]}</h3>')
h = h.replace('<h2>🎲 Hoy toca</h2>', '<h2>🎲 Hoy toca</h2>')
h = h.replace('<p style="color:#aaa;font-size:.85rem">Cumple los tres y se abre un cofre sorpresa. Toca el chip de arriba para ver tu perfil y presumir.</p>', '')
open('js/home.js', 'w', encoding='utf-8').write(h)
print('thumbnails + button-first home done')
