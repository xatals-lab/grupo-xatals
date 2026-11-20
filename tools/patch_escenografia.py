p = 'js/juegos3d.js'
t = open(p, encoding='utf-8').read()

def sub(t, old, new):
    assert t.count(old) >= 1, 'anchor not found: ' + old[:70]
    return t.replace(old, new, 1)

t = sub(t, 'import { particulas, popup, flash, vibra } from "./juice.js";', 'import { particulas, popup, flash, vibra } from "./juice.js";\nimport { humanoide, animar } from "./figuras.js";')

fn = '''
/* ---- living stage for every game: cheering crowd that reacts, neon floor ring, pulsing coloured lights, drifting stars ---- */
function escenografia(M) {
  const { scene } = M, col = [0xff2e93, 0x00e5ff, 0xffe500, 0x39ff14, 0xff8800, 0xb066ff], gente = [];
  for (let i = 0; i < 7; i++) {
    const a = -1.05 + i * .35, h = humanoide(scene, { jersey: "#" + col[i % 6].toString(16).padStart(6, "0"), pantalon: 0x22223a, pelo: [0x2a1d12, 0x111111, 0xb8860b][i % 3], alto: .9 + Math.random() * .2 });
    h.g.position.set(Math.sin(a) * 11, 0, -8 - Math.cos(a) * 3); h.g.rotation.y = -a * .5; h.fase = Math.random() * 6; gente.push(h);
  }
  const aro = new THREE.Mesh(new THREE.RingGeometry(5.2, 5.55, 48), new THREE.MeshBasicMaterial({ color: 0xff2e93, side: THREE.DoubleSide })); aro.rotation.x = -Math.PI / 2; aro.position.y = .03; scene.add(aro);
  const l1 = new THREE.PointLight(0xff2e93, 28, 26), l2 = new THREE.PointLight(0x00e5ff, 28, 26); l1.position.set(-6, 5, 2); l2.position.set(6, 5, 2); scene.add(l1, l2);
  const n = 110, pos = new Float32Array(n * 3); for (let i = 0; i < n; i++) { pos[i * 3] = (Math.random() - .5) * 30; pos[i * 3 + 1] = Math.random() * 10; pos[i * 3 + 2] = -20 + Math.random() * 24; }
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos, 3)); const estrellas = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xfff2a0, size: .14, transparent: true, opacity: .8 })); scene.add(estrellas);
  M.celeb = 0; M.triste = 0;
  M.deco = (dt, t) => {
    gente.forEach(h => { if (M.celeb > 0) animar(h, "festejo", t + h.fase, 1.3); else if (M.triste > 0) animar(h, "derrota", t); else { animar(h, "reposo", t + h.fase); h.g.position.y = Math.abs(Math.sin(t * 3 + h.fase)) * .08; } });
    M.celeb = Math.max(0, M.celeb - dt); M.triste = Math.max(0, M.triste - dt);
    l1.intensity = 22 + 10 * Math.sin(t * 4); l2.intensity = 22 + 10 * Math.cos(t * 4); aro.material.color.setHSL((t * .08) % 1, 1, .55);
    const a = g.attributes.position; for (let i = 0; i < n; i++) { let y = a.getY(i) + dt * .5; if (y > 10) y = 0; a.setY(i, y); } a.needsUpdate = true;
  };
}
'''
t = sub(t, 'const cierra = (M, cb, p, t)', fn + 'const cierra = (M, cb, p, t)')
t = sub(t, '  M.cont = cont; const _v = new THREE.Vector3();', '  M.cont = cont; escenografia(M); const _v = new THREE.Vector3();')
t = sub(t, 'M.fx.update(real); const sh', 'M.fx.update(real); if (M.deco) M.deco(real, M.t); const sh')
t = sub(t, 'vibra(15); M.punch = 1; };', 'vibra(15); M.punch = 1; M.celeb = 1.2; };')
t = sub(t, 'M.shk = .6; vibra(70);', 'M.shk = .6; M.triste = 1; vibra(70);')
open(p, 'w', encoding='utf-8').write(t)
print('living stage added')
