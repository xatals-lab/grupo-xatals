def sub(t, old, new, count=1):
    assert t.count(old) >= 1, 'anchor not found: ' + old[:70]
    return t.replace(old, new, count)

# ---------------- juegos3d.js ----------------
p = 'js/juegos3d.js'
t = open(p, encoding='utf-8').read()
t = sub(t, 'import { THREE, TX, mat } from "./escena.js";', 'import { THREE, TX, mat } from "./escena.js";\nimport { particulas, popup, flash, vibra } from "./juice.js";')
t = sub(t, 'const M = { renderer, scene, cam, suelo,', 'const M = { fx: particulas(scene), shk: 0, punch: 0, renderer, scene, cam, suelo,')
t = sub(t, '  function redar() {', '''  M.cont = cont; const _v = new THREE.Vector3();
  const pantalla = p => { _v.copy(p).project(cam); return [(_v.x * .5 + .5) * 100, (-_v.y * .5 + .5) * 100]; };
  M.pum = (p, color = 0xffe500, txt = "", col = "#ffe500") => { M.fx.burst(p, color, 18); if (txt) { const [x, y] = pantalla(p); popup(cont, txt, col, x, y); } vibra(15); M.punch = 1; };
  M.mal = (p, txt = "", color = 0xff3b30) => { M.fx.burst(p, color, 12, 4); flash(cont, "#ff1e1e", 300); M.shk = .6; vibra(70); if (txt) { const [x, y] = pantalla(p); popup(cont, txt, "#ff6b5b", x, y); } };
  function redar() {''')
t = sub(t, 'renderer.render(scene, cam); })();', '''M.fx.update(real); const sh = M.shk > 0 ? M.shk : 0; if (M.shk > 0) M.shk -= real * 2.5; if (M.punch > 0) M.punch -= real * 4; cam.zoom = 1 + Math.max(0, M.punch) * .05; cam.updateProjectionMatrix();
    const ox = (Math.random() - .5) * .35 * sh, oy = (Math.random() - .5) * .25 * sh; cam.position.x += ox; cam.position.y += oy; renderer.render(scene, cam); cam.position.x -= ox; cam.position.y -= oy; })();''')
# pulsa
t = sub(t, 'if (ho.k === "b") { pts += g.pts_bueno || 10; hits++;', 'if (ho.k === "b") { M.pum(new THREE.Vector3(ho.x, 1.3, ho.z), 0xffe500, "+" + (g.pts_bueno || 10)); pts += g.pts_bueno || 10; hits++;')
t = sub(t, '} else { pts = Math.max(0, pts - (g.pts_malo || 15)); fallos++;', '} else { M.mal(new THREE.Vector3(ho.x, 1.3, ho.z), "-" + (g.pts_malo || 15)); pts = Math.max(0, pts - (g.pts_malo || 15)); fallos++;')
# busca
t = sub(t, 'if (s.userData.objetivo) { const seg', 'if (s.userData.objetivo) { M.pum(s.position.clone(), 0x39ff14, "¡ENCONTRADO!", "#39ff14"); const seg')
t = sub(t, '} else { pts = Math.max(0, pts - 25);', '} else { M.mal(s.position.clone(), "-25"); pts = Math.max(0, pts - 25);')
# ritmo
t = sub(t, 'M.scene.remove(n.s); notas = notas.filter(x => x !== n); combo++;', 'M.pum(n.s.position.clone(), 0x00e5ff, combo + 1 >= 5 ? "COMBO x" + (combo + 1) : "", "#00e5ff"); M.scene.remove(n.s); notas = notas.filter(x => x !== n); combo++;')
t = sub(t, 'else { combo = 0; pts = Math.max(0, pts - 20); beep(120, .08);', 'else { M.mal(new THREE.Vector3(X[i], 1, 3), "MISS"); combo = 0; pts = Math.max(0, pts - 20); beep(120, .08);')
# simon
t = sub(t, 'p.material.emissiveIntensity = 1.6; p.position.y = .25;', 'p.material.emissiveIntensity = 1.6; p.position.y = .25; M.pum(p.position.clone().setY(1.3), new THREE.Color(p.userData.c).getHex(), "");')
# apila
t = sub(t, 'if (perfecto) { perf++; pts += 50;', 'if (perfecto) { M.pum(mov.position.clone(), 0xffe500, "¡PERFECTO!"); perf++; pts += 50;')
t = sub(t, 'if (sol <= .05) { fin = true;', 'if (sol <= .05) { M.mal(mov.position.clone(), "¡CAE!"); fin = true;')
# timing
t = sub(t, 'if (dentro) confetiSafe(); else bola.userData.cae = true;', 'if (dentro) { confetiSafe(); M.pum(bola.position.clone(), 0x39ff14, "+" + p, "#39ff14"); } else { bola.userData.cae = true; M.mal(bola.position.clone(), "¡FUERA!"); }')
# aguanta
t = sub(t, 'if (ok) confetiSafe(); r++;', 'if (ok) { confetiSafe(); M.pum(globo.position.clone(), 0x39ff14, "+" + p, "#39ff14"); } else M.mal(globo.position.clone(), "¡SE CORTÓ!"); r++;')
open(p, 'w', encoding='utf-8').write(t)

# ---------------- carril3d.js ----------------
p = 'js/carril3d.js'
c = open(p, encoding='utf-8').read()
c = sub(c, 'import { humanoide, animar } from "./figuras.js";', 'import { humanoide, animar } from "./figuras.js";\nimport { particulas, popup, flash, vibra } from "./juice.js";')
c = sub(c, '  const tex = suelo(tema);', '  const fx = particulas(escena);\n  const tex = suelo(tema);')
c = sub(c, 'if (it.bueno) { E.pts += 60;', 'if (it.bueno) { fx.burst(new THREE.Vector3(E.x, 1.4, 0), 0xffe500, 14, 5); popup(cont, "+60", "#ffe500", 50, 62); vibra(12); E.pts += 60;')
c = sub(c, 'else { E.vidas--; E.lento = 1.5;', 'else { fx.burst(new THREE.Vector3(E.x, 1.2, 0), 0xff3b30, 18, 6); flash(cont, "#ff1e1e", 320); vibra(80); E.vidas--; E.lento = 1.5;')
c = sub(c, 'if (ok) { E.pts += 250; E.boost = 3;', 'if (ok) { fx.burst(new THREE.Vector3(E.x, 2, 0), 0x39ff14, 34, 9); popup(cont, "¡VÍA CORRECTA! +250", "#39ff14", 50, 40); vibra(40); E.pts += 250; E.boost = 3;')
c = sub(c, 'else { E.vidas--; E.lento = 2;', 'else { flash(cont, "#ff1e1e", 360); vibra(100); E.vidas--; E.lento = 2;')
c = sub(c, '    const dt = real;', '    fx.update(real);\n    const dt = real;')
open(p, 'w', encoding='utf-8').write(c)

css = open('css/premium.css', encoding='utf-8').read()
css += '''
/* ---- game feel ---- */
.lienzo3d{overflow:hidden}
.juice-pop{position:absolute;z-index:8;transform:translate(-50%,-50%);font-family:Bangers,Impact,sans-serif;font-size:clamp(1.5rem,6vw,2.4rem);letter-spacing:.05em;text-shadow:0 0 14px #000,3px 3px 0 #000;pointer-events:none;animation:subepop .9s ease-out forwards;white-space:nowrap}
@keyframes subepop{0%{opacity:0;transform:translate(-50%,-20%) scale(.4)}20%{opacity:1;transform:translate(-50%,-70%) scale(1.25)}100%{opacity:0;transform:translate(-50%,-190%) scale(1)}}
.juice-flash{position:absolute;inset:0;z-index:7;pointer-events:none;animation:flashj .3s ease-out forwards}
@keyframes flashj{0%{opacity:0}25%{opacity:1}100%{opacity:0}}
'''
open('css/premium.css', 'w', encoding='utf-8').write(css)
print('juice layer wired')
