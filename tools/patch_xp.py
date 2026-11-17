c = open('js/common.js', encoding='utf-8').read()
old = '  puntos=Math.max(0,Math.round(puntos));\n'
assert c.count(old) == 1
c = c.replace(old, old + '  if(window.xpJuego)xpJuego(juego,puntos);\n')
old = 'el.querySelector("#cp").onclick=()=>{navigator.clipboard&&navigator.clipboard.writeText(c);el.querySelector("#cp").textContent="✅ Copiado";};}'
assert c.count(old) == 1
c = c.replace(old, 'el.querySelector("#cp").onclick=()=>{navigator.clipboard&&navigator.clipboard.writeText(c);el.querySelector("#cp").textContent="✅ Copiado";if(window.reto)reto("record");};el.querySelector("#tg").onclick=()=>{if(window.reto)reto("record");};}')
c = c.replace('["juegos.html","Juegos"],["paneles.html","Paneles"],', '["juegos.html","Juegos"],["laboratorio.html","Laboratorio"],["paneles.html","Paneles"],')
c = c.replace('["recursos.html","Recursos"]]', '["claustro.html","Claustro"],["recursos.html","Recursos"]]')
c = c.replace('"quiz.html":"juegos.html","mj.html":"juegos.html"}', '"quiz.html":"juegos.html","mj.html":"juegos.html","mus.html":"juegos.html","examen-maketo.html":"juegos.html"}')
open('js/common.js', 'w', encoding='utf-8').write(c)

m = open('make_pages.py', encoding='utf-8').read()
m = m.replace('<script src="js/common.js"></script></head>', '<script src="js/common.js"></script><script src="js/xp.js"></script></head>')
open('make_pages.py', 'w', encoding='utf-8').write(m)

css = open('css/premium.css', encoding='utf-8').read()
css += '''
/* ---- XP chip, toasts, profile modal, typewriter ---- */
#xpchip{margin:0 0 0 .4rem;padding:.25rem .7rem;display:flex;gap:.5rem;align-items:center;font-family:Sora,sans-serif;font-size:.8rem;font-weight:800;min-height:38px;box-shadow:none;border-radius:99px}
#xpchip .xpb{width:70px;height:8px;background:#000;border-radius:99px;overflow:hidden;display:inline-block}#xpchip .xpb i{display:block;height:100%;background:linear-gradient(90deg,#39ff14,#ffe500)}
#toasts{position:fixed;left:50%;bottom:14px;transform:translateX(-50%);z-index:200;display:flex;flex-direction:column;gap:.5rem;align-items:center;width:min(92vw,520px);pointer-events:none}
.toast{background:#101018f2;border:1px solid #ffffff33;border-left:5px solid var(--amarillo);border-radius:14px;padding:.65rem .9rem;box-shadow:0 14px 40px #000c;opacity:0;transform:translateY(20px) scale(.96);transition:.35s;font-size:.95rem;backdrop-filter:blur(10px)}
.toast.in{opacity:1;transform:none}.toast.nivel{border-left-color:var(--verde);background:linear-gradient(90deg,#0f2a10,#101018)}.toast.insig{border-left-color:var(--rosa)}.toast.broma{border-left-color:var(--cian)}
.modal{position:fixed;inset:0;background:#000b;z-index:150;display:grid;place-items:center;padding:1rem;backdrop-filter:blur(6px)}
.modal-in{background:linear-gradient(160deg,#1a1a26,#0b0b11);border:1px solid #ffffff33;border-radius:24px;padding:1.2rem 1.4rem;max-width:620px;width:100%;max-height:90vh;overflow:auto;position:relative;box-shadow:0 30px 90px #000}
.modal-in .cerrar{position:absolute;right:.8rem;top:.8rem;padding:.2rem .7rem;margin:0;min-height:36px}
.escribiendo::after{content:"▍";color:var(--amarillo);animation:parpadeo .7s steps(2) infinite}@keyframes parpadeo{50%{opacity:0}}
.euskera{font-size:.85rem;color:#c9b27a;max-width:640px;margin:0 auto .8rem}
/* ---- games feel premium: clean glass, modern type, no pixel font ---- */
.arena .hud,.meter{font-family:Sora,system-ui,sans-serif;font-size:.8rem;font-weight:800;letter-spacing:.04em;text-transform:uppercase}
.arena{background:radial-gradient(90% 70% at 50% 0,#17202f,#07090f);border:1px solid #ffffff22;box-shadow:0 30px 80px #000d,inset 0 0 80px #00e5ff10}
.msg{font-family:Sora,system-ui,sans-serif;font-weight:800;font-size:1.25rem;text-shadow:0 2px 14px #000}
.panel h2,.panel h3{font-family:Sora,system-ui,sans-serif;font-weight:800;letter-spacing:0}
.panel h2{font-size:1.5rem}.panel h3{font-size:1.15rem}
@keyframes pegada{0%{opacity:0}12%{opacity:1}100%{opacity:0}}
#golpe{position:fixed;inset:0;z-index:180;pointer-events:none;background:radial-gradient(circle at 50% 50%,#ff1e1e00 0,#ff1e1ee6 55%,#7a0000f2 100%);animation:pegada 1.6s ease-out forwards;display:grid;place-items:center;text-align:center;padding:1rem}
#golpe b{font-family:Bangers,Impact,sans-serif;font-size:clamp(2rem,7vw,4.4rem);color:#fff;text-shadow:0 0 30px #000,4px 4px 0 #000;letter-spacing:.04em;transform:rotate(-3deg)}
.shakeAll{animation:shakeAll .6s}@keyframes shakeAll{10%,50%,90%{transform:translate(-12px,6px)}30%,70%{transform:translate(12px,-6px)}}
.regano{position:absolute;inset:0;z-index:20;display:grid;place-items:center;background:#000a;backdrop-filter:blur(3px);text-align:center;padding:1rem}
.regano .caja{background:#15151fee;border:2px solid var(--amarillo);border-radius:20px;padding:1rem 1.3rem;max-width:420px;box-shadow:0 20px 60px #000}
.regano .nom{font-family:Bangers,Impact,sans-serif;font-size:1.8rem;color:var(--amarillo)}
'''
open('css/premium.css', 'w', encoding='utf-8').write(css)
print('xp patched')
