def sub(t, old, new):
    assert t.count(old) >= 1, 'anchor not found: ' + old[:70]
    return t.replace(old, new, 1)

# ---- common.js: who am I + school surname ----
c = open('js/common.js', encoding='utf-8').read()
if 'function quienSoy' not in c:
    c += '''
/* ---- who is playing: each friend chooses once; teachers call each one by his school surname ---- */
const APELLIDOS={dug:"Urrutia",hrk:"Roca",koi:"Fernández de Trocóniz"};
function jugadorActual(){const j=localStorage.getItem("xatals_jugador");return JUGADORES[j]?j:null;}
function apellido(){return APELLIDOS[jugadorActual()]||"Urrutia";}
function quienSoy(cb,forzar){const j=jugadorActual();if(j&&!forzar){cb(j);return;}
  const m=document.createElement("div");m.className="modal";m.innerHTML=`<div class="modal-in" style="text-align:center"><h2>¿Quién eres?</h2><p>Los profes te llamarán por tu apellido del cole. Lo eliges una vez y se guarda en este móvil.</p>${Object.entries(JUGADORES).map(([k,v])=>`<button class="${k==="dug"?"":"rosa"}" data-k="${k}" style="display:block;width:100%">${v} · señor ${APELLIDOS[k]}</button>`).join("")}</div>`;
  document.body.append(m);m.querySelectorAll("button").forEach(b=>b.onclick=()=>{localStorage.setItem("xatals_jugador",b.dataset.k);m.remove();document.querySelectorAll(".sr").forEach(e=>e.textContent=apellido());cb(b.dataset.k);});}
document.addEventListener("DOMContentLoaded",()=>document.querySelectorAll(".sr").forEach(e=>e.textContent=apellido()));
'''
open('js/common.js', 'w', encoding='utf-8').write(c)

# ---- examen3d.js: ask who you are before starting, use your surname ----
e = open('js/examen3d.js', encoding='utf-8').read()
e = sub(e, '["¿Qué es la verdad, señor Urrutia?",', '[`¿Qué es la verdad, señor ${apellido()}?`,')
i = e.index('"🚨 ¡Pillado!'); j = e.index('"', i + 3)
seg = e[i:j + 1]
e = e.replace(seg, '`🚨 ¡Pillado! «Vaya examen, señor ${apellido()}, vaya examen.»`', 1)
e = sub(e, '¡TE HA PILLADO EL BACTERIO! «VAYA EXAMEN, SEÑOR URRUTIA, VAYA EXAMEN»', '¡TE HA PILLADO EL BACTERIO! «VAYA EXAMEN, SEÑOR ${apellido().toUpperCase()}, VAYA EXAMEN»')
e = e.replace('golpe("¡TE HA PILLADO EL BACTERIO! «VAYA EXAMEN, SEÑOR ${apellido().toUpperCase()}, VAYA EXAMEN»")', 'golpe(`¡TE HA PILLADO EL BACTERIO! «VAYA EXAMEN, SEÑOR ${apellido().toUpperCase()}, VAYA EXAMEN»`)')
old = '$("start").onclick = () => { $("rec").innerHTML = ""; $("start").disabled = true;'
assert e.count(old) == 1
e = e.replace(old, '$("start").onclick = () => quienSoy(() => { $("rec").innerHTML = ""; $("start").disabled = true;')
# close the extra parenthesis: the handler ends with "pintaPregunta(); } };" -> add ")"
k = e.index('$("start").onclick = () => quienSoy')
fin = e.index('\nif (MODO === "bacterio") { const b = $("copia");', k)
bloque = e[k:fin].rstrip()
assert bloque.endswith('};'), bloque[-60:]
e = e[:k] + bloque[:-2] + '});' + e[fin:]
open('js/examen3d.js', 'w', encoding='utf-8').write(e)

# ---- page text ----
m = open('make_pages.py', encoding='utf-8').read()
m = m.replace('«vaya examen, señor Urrutia»', '«vaya examen, señor <span class="sr">Urrutia</span>»')
open('make_pages.py', 'w', encoding='utf-8').write(m)

# ---- profile: change player ----
x = open('js/xp.js', encoding='utf-8').read()
if 'cambiaJ' not in x:
    x = sub(x, '<p><button id="compartir" class="rosa">', '<p>Juegas como: <b>${(typeof jugadorActual==="function"&&jugadorActual())?JUGADORES[jugadorActual()]:"sin elegir"}</b> <button class="sec" id="cambiaJ" style="min-height:36px;padding:.2rem .7rem">Cambiar</button></p><p><button id="compartir" class="rosa">')
    x = sub(x, 'm.querySelector("#compartir").onclick=()=>tarjeta(p,i);', 'm.querySelector("#compartir").onclick=()=>tarjeta(p,i);m.querySelector("#cambiaJ").onclick=()=>{m.remove();quienSoy(()=>{},true);};')
    open('js/xp.js', 'w', encoding='utf-8').write(x)
print('who-am-I wired')
