p = 'js/carril3d.js'
t = open(p, encoding='utf-8').read()

# 1) cache emoji textures / materials
t = t.replace('const pick = a => a[Math.floor(Math.random() * a.length)];',
 'const pick = a => a[Math.floor(Math.random() * a.length)];\nconst EMO = new Map(); const emojiMat = e => { if (!EMO.has(e)) EMO.set(e, new THREE.SpriteMaterial({ map: emoji(e), transparent: true })); return EMO.get(e); };')
t = t.replace('const sprite = (e, tam = 1.9) => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: emoji(e), transparent: true })); s.scale.set(tam, tam, 1); return s; };',
              'const sprite = (e, tam = 1.9) => { const s = new THREE.Sprite(emojiMat(e)); s.scale.set(tam, tam, 1); return s; };')

# 2) shared geometries and materials for scenery, fewer props
i = t.index('  const fach = fachada();')
j = t.index('  // player')
nuevo = '''  const fach = fachada(); const props = [];
  const M = { pole: mat({ color: 0x6b5a48 }), cones: [0x3f7a3a, 0x4d8a45, 0x2f6a38].map(c => mat({ color: c, roughness: 1 })), trunk: mat({ color: 0x5b4636 }), edif: mat({ map: fach, roughness: .9 }), tejado: mat({ color: 0x9a4a38 }) };
  const G = { pole: new THREE.CylinderGeometry(.1, .14, 6, 6), arm: new THREE.BoxGeometry(2, .12, .12), cone: new THREE.ConeGeometry(2, 5, 6), trunk: new THREE.CylinderGeometry(.2, .25, 1, 5), edif: new THREE.BoxGeometry(6, 10, 8), tejado: new THREE.BoxGeometry(6.5, .5, 8.5) };
  for (let i = 0; i < 12; i++) for (const lado of [-1, 1]) {
    const g = new THREE.Group();
    if (tema === "tren") { if (Math.random() < .5) { const pole = new THREE.Mesh(G.pole, M.pole); pole.position.y = 3; g.add(pole); const br = new THREE.Mesh(G.arm, M.pole); br.position.y = 5.6; g.add(br); }
      else { const c = new THREE.Mesh(G.cone, M.cones[i % 3]); c.position.y = 2.5; c.scale.set(.8 + Math.random() * .6, .8 + Math.random() * .6, .8 + Math.random() * .6); g.add(c); const tk = new THREE.Mesh(G.trunk, M.trunk); tk.position.y = .5; g.add(tk); } }
    else { const h = .6 + Math.random() * .9, b = new THREE.Mesh(G.edif, M.edif); b.scale.y = h; b.position.y = 5 * h; g.add(b); const r = new THREE.Mesh(G.tejado, M.tejado); r.position.y = 10 * h + .1; g.add(r); }
    g.position.set(lado * (7 + Math.random() * 6 + (tema === "tren" ? 0 : 3)), 0, -i * 14 - Math.random() * 8); escena.add(g); props.push(g);
  }
'''
t = t[:i] + nuevo + t[j:]
t = t.replace('if (p.position.z > 12) p.position.z -= 22 * 8;', 'if (p.position.z > 12) p.position.z -= 12 * 14;')
# 3) lighter renderer, tolerant time step
t = t.replace('renderer.setPixelRatio(Math.min(devicePixelRatio, 2));', 'renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));')
t = t.replace('const dt = Math.min(.05, reloj.getDelta())', 'const dt = Math.min(.1, reloj.getDelta())')
t = t.replace('new THREE.Mesh(new THREE.SphereGeometry(160, 20, 12)', 'new THREE.Mesh(new THREE.SphereGeometry(160, 12, 8)')
open(p, 'w', encoding='utf-8').write(t)
print('perf patched')
