m = open('make_pages.py', encoding='utf-8').read()

def rep(old, new):
    global m
    assert m.count(old) == 1, old[:60]
    m = m.replace(old, new)

# futbol: controls inside the 3D view
rep('<div id="lienzo3d" class="lienzo3d"></div><div class="msg" id="msg">Cargando el patio…</div><p id="modo" style="text-align:center;margin:.2rem"></p></div>\n<p><button class="rosa" id="tirar" style="display:none">⚽ TIRAR</button><span id="botonesP" style="display:none"><button class="sec" id="b0">⬅ Izq.</button><button class="sec" id="b1">⬆ Centro</button><button class="sec" id="b2">Der. ➡</button></span><button class="cian" id="start">▶ EMPEZAR</button></p>',
    '<div id="lienzo3d" class="lienzo3d"><div class="ctl3d"><button class="rosa" id="tirar" style="display:none">⚽ TIRAR</button><span id="botonesP" style="display:none"><button class="sec" id="b0">⬅</button><button class="sec" id="b1">⬆</button><button class="sec" id="b2">➡</button></span></div></div><div class="msg" id="msg">Cargando el patio…</div><p id="modo" style="text-align:center;margin:.2rem"></p></div>\n<p><button class="cian" id="start">▶ EMPEZAR</button></p>')
# recreo
rep('<div id="lienzo3d" class="lienzo3d"></div><div class="msg" id="msg">Cargando el patio…</div></div>\n<p><button id="izq">⬅ Esquiva izq.</button><button id="der">Esquiva der. ➡</button><button class="rosa" id="pega">👊 PEGA</button><button class="cian" id="start">▶ EMPEZAR</button></p>',
    '<div id="lienzo3d" class="lienzo3d"><div class="ctl3d"><button id="izq">⬅</button><button class="rosa" id="pega">👊</button><button id="der">➡</button></div></div><div class="msg" id="msg">Cargando el patio…</div></div>\n<p><button class="cian" id="start">▶ EMPEZAR</button></p>')
# examen
rep('<div id="lienzo3d" class="lienzo3d"></div><div class="msg" id="msg">Cargando el aula…</div></div>\n<p><button class="rosa" id="copia">👀 COPIAR (mantén)</button><button class="cian" id="start">▶ EMPEZAR</button></p>',
    '<div id="lienzo3d" class="lienzo3d"><div class="ctl3d"><button class="rosa" id="copia">👀 COPIAR (mantén)</button></div></div><div class="msg" id="msg">Cargando el aula…</div></div>\n<p><button class="cian" id="start">▶ EMPEZAR</button></p>')
open('make_pages.py', 'w', encoding='utf-8').write(m)

css = open('css/premium.css', encoding='utf-8').read()
css += '''
.ctl3d{position:absolute;left:.5rem;right:.5rem;bottom:.5rem;display:flex;gap:.5rem;justify-content:center;align-items:center;z-index:6;pointer-events:none}
.ctl3d button{pointer-events:auto;margin:0;min-width:64px;min-height:58px;font-size:1.5rem;opacity:.85;flex:1;max-width:30%}
.ctl3d #copia{max-width:none;flex:1;font-size:1.1rem}.ctl3d #botonesP{display:flex;gap:.5rem;flex:1;pointer-events:none}.ctl3d #botonesP button{max-width:none}
@media(max-width:700px){body.jugando main>h1,body.jugando main>p:not(#modo):not(.medal),body.jugando #intro,body.jugando #estrellas{display:none}body.jugando main{padding-top:.3rem}}
'''
open('css/premium.css', 'w', encoding='utf-8').write(css)

c = open('js/common.js', encoding='utf-8').read()
if 'jugando' not in c:
    c = c.replace('document.addEventListener("DOMContentLoaded",()=>{pintaCabecera();', 'document.addEventListener("DOMContentLoaded",()=>{pintaCabecera();const sb=document.getElementById("start");if(sb)sb.addEventListener("click",()=>{document.body.classList.add("jugando");const a=document.querySelector(".arena");if(a)setTimeout(()=>a.scrollIntoView({block:"start",behavior:"smooth"}),50);},true);', 1)
open('js/common.js', 'w', encoding='utf-8').write(c)
print('mobile2 done', 'jugando' in c)
