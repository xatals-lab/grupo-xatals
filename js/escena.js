/* Shared 3D scene: the concrete schoolyard of Colegio Santa María (Marianistas, Vitoria), modelled from the reference photos Diego shared:
   beige stone facade with pediment and columns, red hip roof, curved metal-roof pavilion, brick building with cross tower, green fence, worn painted court lines.
   Procedural textures only (no image files, no copyrighted photos). Used by the 3D games. */
import * as THREE from "three";
export { THREE };

const lienzo = (w, h, f) => { const c = document.createElement("canvas"); c.width = w; c.height = h; f(c.getContext("2d"), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
const ruido = (g, w, h, n, a) => { for (let i = 0; i < n; i++) { const v = 120 + Math.random() * 90; g.fillStyle = `rgba(${v},${v},${v},${a})`; g.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 2, 1 + Math.random() * 2); } };

export const TX = {
  patio() {
    const t = lienzo(1024, 1024, (g, w, h) => {
      g.fillStyle = "#8d8d88"; g.fillRect(0, 0, w, h); ruido(g, w, h, 16000, .35);
      g.strokeStyle = "rgba(40,40,40,.35)"; g.lineWidth = 1.2;                     // cracks
      for (let i = 0; i < 26; i++) { let x = Math.random() * w, y = Math.random() * h; g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 7; k++) { x += (Math.random() - .5) * 90; y += (Math.random() - .5) * 90; g.lineTo(x, y); } g.stroke(); }
      g.strokeStyle = "rgba(240,240,235,.82)"; g.lineWidth = 7; g.strokeRect(70, 40, w - 140, h - 80);   // court lines (worn)
      g.beginPath(); g.moveTo(70, h / 2); g.lineTo(w - 70, h / 2); g.stroke(); g.beginPath(); g.arc(w / 2, h / 2, 110, 0, 7); g.stroke();
      for (const s of [1, -1]) { const y0 = s > 0 ? 40 : h - 40; g.beginPath(); g.arc(w / 2, y0, 230, s > 0 ? 0 : Math.PI, s > 0 ? Math.PI : Math.PI * 2); g.stroke(); g.fillStyle = "rgba(240,240,235,.9)"; g.beginPath(); g.arc(w / 2, s > 0 ? 40 + 290 : h - 40 - 290, 8, 0, 7); g.fill(); }
      g.globalCompositeOperation = "destination-out"; for (let i = 0; i < 1400; i++) { g.fillStyle = "rgba(0,0,0,.35)"; g.fillRect(Math.random() * w, Math.random() * h, 3 + Math.random() * 12, 2 + Math.random() * 4); } g.globalCompositeOperation = "source-over";
    });
    return t;
  },
  fachada() {   // photo 1: beige stone, pediment, columns, frieze text
    return lienzo(1024, 512, (g, w, h) => {
      g.fillStyle = "#c9b48e"; g.fillRect(0, 0, w, h); ruido(g, w, h, 9000, .22);
      for (let y = 0; y < h; y += 16) { g.fillStyle = "rgba(120,100,70,.18)"; g.fillRect(0, y, w, 1.4); }
      const vent = (x, y, ww, hh) => { g.fillStyle = "#6e5d44"; g.fillRect(x - 3, y - 3, ww + 6, hh + 6); g.fillStyle = "#cfe0ee"; g.fillRect(x, y, ww, hh); g.fillStyle = "rgba(255,255,255,.55)"; g.fillRect(x, y, ww, hh * .45); g.fillStyle = "#6e5d44"; g.fillRect(x + ww / 2 - 1.5, y, 3, hh); g.fillRect(x, y + hh * .4, ww, 3); };
      for (let r = 0; r < 4; r++) for (let c = 0; c < 17; c++) if (c < 6 || c > 10) vent(30 + c * 58, 60 + r * 105, 34, 62);
      g.fillStyle = "#d8c7a3"; g.beginPath(); g.moveTo(w * .35, 175); g.lineTo(w * .5, 70); g.lineTo(w * .65, 175); g.fill();      // pediment
      g.strokeStyle = "#8a7752"; g.lineWidth = 4; g.stroke(); g.fillStyle = "#e4d6b6"; g.fillRect(w * .35, 175, w * .3, 34);
      g.fillStyle = "#4a3f2a"; g.font = "bold 22px Georgia, serif"; g.textAlign = "center"; g.fillText("COLEGIO DE SANTA MARÍA", w / 2, 198);
      for (let i = 0; i < 6; i++) { const x = w * .37 + i * (w * .26 / 5); g.fillStyle = "#e8dcc0"; g.fillRect(x - 11, 210, 22, 230); g.fillStyle = "rgba(0,0,0,.2)"; g.fillRect(x + 4, 210, 7, 230); }
      g.fillStyle = "#3a2f20"; g.fillRect(w * .46, 360, w * .08, 80);
    });
  },
  ladrillo() {
    return lienzo(512, 512, (g, w, h) => {
      g.fillStyle = "#b7694f"; g.fillRect(0, 0, w, h);
      for (let y = 0; y < h; y += 14) for (let x = (y / 14) % 2 ? 0 : -16; x < w; x += 32) { const v = 150 + Math.random() * 50; g.fillStyle = `rgb(${v + 30},${v * .52},${v * .38})`; g.fillRect(x + 1, y + 1, 30, 12); }
      g.fillStyle = "#f2efe6"; for (let c = 0; c < 6; c++) { g.fillRect(24 + c * 82, 40, 44, 90); g.fillRect(24 + c * 82, 220, 44, 90); g.fillStyle = "#9bb4c8"; g.fillRect(28 + c * 82, 44, 36, 82); g.fillRect(28 + c * 82, 224, 36, 82); g.fillStyle = "#f2efe6"; }
    });
  },
  teja() { return lienzo(256, 256, (g, w, h) => { g.fillStyle = "#a8402e"; g.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 16) { g.fillStyle = `rgba(0,0,0,${.14 + (y / 16 % 2) * .08})`; g.fillRect(0, y, w, 3); } ruido(g, w, h, 1500, .25); }); },
  chapa() { return lienzo(256, 256, (g, w, h) => { g.fillStyle = "#b9bec2"; g.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 12) { g.fillStyle = "rgba(0,0,0,.14)"; g.fillRect(x, 0, 3, h); g.fillStyle = "rgba(255,255,255,.25)"; g.fillRect(x + 4, 0, 2, h); } }); },
  rejilla() { return lienzo(128, 128, (g, w, h) => { g.clearRect(0, 0, w, h); g.strokeStyle = "rgba(40,110,60,.9)"; g.lineWidth = 1.6; for (let i = -h; i < w + h; i += 16) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + h, h); g.stroke(); g.beginPath(); g.moveTo(i + h, 0); g.lineTo(i, h); g.stroke(); } }); },
  red() { return lienzo(128, 128, (g, w, h) => { g.clearRect(0, 0, w, h); g.strokeStyle = "rgba(255,255,255,.8)"; g.lineWidth = 2; for (let i = 0; i <= w; i += 14) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, h); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(w, i); g.stroke(); } }); },
  balon() { return lienzo(256, 128, (g, w, h) => { g.fillStyle = "#f6f6f6"; g.fillRect(0, 0, w, h); g.fillStyle = "#1a1a1a"; for (let i = 0; i < 12; i++) { const x = (i % 6) * 44 + (Math.floor(i / 6) ? 22 : 0) + 20, y = 22 + Math.floor(i / 6) * 62; g.beginPath(); for (let k = 0; k < 5; k++) { const a = k * 1.2566 - 1.57; g.lineTo(x + Math.cos(a) * 13, y + Math.sin(a) * 13); } g.fill(); } }); },
  rayas(c1, c2) { return lienzo(128, 128, (g, w, h) => { g.fillStyle = c1; g.fillRect(0, 0, w, h); g.fillStyle = c2; for (let x = 0; x < w; x += 32) g.fillRect(x, 0, 16, h); }); },
  cielo() { return lienzo(16, 512, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#3d7fd0"); gr.addColorStop(.55, "#a9cdf0"); gr.addColorStop(1, "#f5e7c8"); g.fillStyle = gr; g.fillRect(0, 0, w, h); }); },
};

const mat = (o) => new THREE.MeshStandardMaterial(o);
const caja = (w, h, d, m) => { const x = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); x.castShadow = x.receiveShadow = true; return x; };

export function crearEscena(contenedor) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05; renderer.outputColorSpace = THREE.SRGBColorSpace;
  contenedor.appendChild(renderer.domElement);
  const escena = new THREE.Scene(); escena.fog = new THREE.Fog(0xe8dcc0, 28, 95);
  const sky = new THREE.Mesh(new THREE.SphereGeometry(120, 24, 16), new THREE.MeshBasicMaterial({ map: TX.cielo(), side: THREE.BackSide, fog: false })); escena.add(sky);
  const cam = new THREE.PerspectiveCamera(58, 1, .1, 200); escena.add(cam);
  escena.add(new THREE.HemisphereLight(0xcfe3ff, 0x8a7d66, .85));
  const sol = new THREE.DirectionalLight(0xfff0cf, 2.4); sol.position.set(-14, 22, 10); sol.castShadow = true; sol.shadow.mapSize.set(2048, 2048);
  Object.assign(sol.shadow.camera, { left: -26, right: 26, top: 26, bottom: -26, near: 1, far: 70 }); sol.shadow.bias = -.0004; escena.add(sol);
  // ground
  const tp = TX.patio(); const suelo = new THREE.Mesh(new THREE.PlaneGeometry(30, 28), mat({ map: tp, roughness: .95 })); suelo.rotation.x = -Math.PI / 2; suelo.receiveShadow = true; escena.add(suelo);
  const calle = new THREE.Mesh(new THREE.PlaneGeometry(220, 220), mat({ color: 0x6d6a63, roughness: 1 })); calle.rotation.x = -Math.PI / 2; calle.position.y = -.02; calle.receiveShadow = true; escena.add(calle);
  // facade (behind goal A, z<0): stone, pediment, red hip roof
  const fach = new THREE.Mesh(new THREE.BoxGeometry(46, 15, 6), [mat({ color: 0xc9b48e }), mat({ color: 0xc9b48e }), mat({ color: 0xb04a35 }), mat({ color: 0x555 }), mat({ map: TX.fachada(), roughness: .9 }), mat({ color: 0xc9b48e })]);
  fach.position.set(0, 7.5, -22); fach.castShadow = fach.receiveShadow = true; escena.add(fach);
  const teja = TX.teja(); teja.wrapS = teja.wrapT = THREE.RepeatWrapping; teja.repeat.set(10, 2);
  const roof = new THREE.Mesh(new THREE.ConeGeometry(28, 4.5, 4, 1), mat({ map: teja, roughness: .8 })); roof.rotation.y = Math.PI / 4; roof.scale.set(1.15, 1, .26); roof.position.set(0, 17.3, -22); roof.castShadow = true; escena.add(roof);
  // back building behind goal B (z>0): brick
  const lad = TX.ladrillo(); lad.wrapS = lad.wrapT = THREE.RepeatWrapping; lad.repeat.set(4, 1);
  const ladM = mat({ map: lad, roughness: .95 }); const bk = caja(42, 12, 5, ladM); bk.position.set(0, 6, 24); escena.add(bk);
  const roofB = caja(43, 1, 6, mat({ color: 0x8e3d2c })); roofB.position.set(0, 12.5, 24); escena.add(roofB);
  // curved metal pavilion at left (photo 2/3)
  const chapa = TX.chapa(); chapa.wrapS = chapa.wrapT = THREE.RepeatWrapping; chapa.repeat.set(8, 3);
  const pab = new THREE.Mesh(new THREE.CylinderGeometry(9, 9, 34, 28, 1, true, Math.PI / 2, Math.PI), mat({ map: chapa, metalness: .45, roughness: .45, side: THREE.DoubleSide })); pab.rotation.x = Math.PI / 2; pab.position.set(-26, 0, 0); pab.scale.set(1, 1, .8); pab.castShadow = true; escena.add(pab);
  // brick building + cross tower at right (photo 4)
  const rb = caja(10, 11, 32, mat({ map: lad, roughness: .95 })); rb.position.set(26, 5.5, -2); escena.add(rb);
  const tw = caja(5, 20, 5, mat({ map: lad, roughness: .95 })); tw.position.set(25, 10, -16); escena.add(tw);
  const twr = new THREE.Mesh(new THREE.ConeGeometry(4, 3.2, 4), mat({ map: teja, roughness: .8 })); twr.rotation.y = Math.PI / 4; twr.position.set(25, 21.6, -16); twr.castShadow = true; escena.add(twr);
  const cruz = new THREE.Group(); cruz.add(caja(.22, 2.4, .22, mat({ color: 0x2b2b2b }))); const br = caja(1.4, .22, .22, mat({ color: 0x2b2b2b })); br.position.y = .5; cruz.add(br); cruz.position.set(25, 24.9, -16); escena.add(cruz);
  // green fence (diamond mesh) around the court + posts
  const rej = TX.rejilla(); rej.wrapS = rej.wrapT = THREE.RepeatWrapping; rej.repeat.set(9, 1.4);
  const rejM = new THREE.MeshBasicMaterial({ map: rej, transparent: true, opacity: .75, side: THREE.DoubleSide, depthWrite: false });
  const valla = (x, z, w, ry, alto = 4.2) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(w, alto), rejM); p.position.set(x, alto / 2, z); p.rotation.y = ry; escena.add(p); for (let i = 0; i <= Math.round(w / 3); i++) { const post = new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, alto, 8), mat({ color: 0x2f7a4a })); const u = -w / 2 + i * (w / Math.round(w / 3)); post.position.set(x + Math.cos(ry) * u, alto / 2, z - Math.sin(ry) * u); post.castShadow = true; escena.add(post); } };
  valla(0, -14, 30, 0, 6); valla(0, 14, 30, 0, 6); valla(-15, 0, 28, Math.PI / 2); valla(15, 0, 28, Math.PI / 2);
  // bare winter trees
  for (const [x, z] of [[-17, -12], [18, 12], [-18, 14], [17, -14]]) { const tr = new THREE.Group(); const tk = new THREE.Mesh(new THREE.CylinderGeometry(.18, .26, 4, 8), mat({ color: 0x5b4636 })); tk.position.y = 2; tk.castShadow = true; tr.add(tk); for (let i = 0; i < 4; i++) { const b = new THREE.Mesh(new THREE.SphereGeometry(1.3 + Math.random(), 10, 8), mat({ color: [0x7a8f4a, 0x8a9a56, 0x6f8442][i % 3], roughness: 1 })); b.position.set((Math.random() - .5) * 2, 4.6 + Math.random() * 1.6, (Math.random() - .5) * 2); b.castShadow = true; tr.add(b); } tr.position.set(x, 0, z); escena.add(tr); }
  function redar() { const w = contenedor.clientWidth, h = contenedor.clientHeight; renderer.setSize(w, h); cam.aspect = w / h; cam.fov = cam.aspect < .9 ? 74 : 58; cam.updateProjectionMatrix(); }
  new ResizeObserver(redar).observe(contenedor); redar();
  return { renderer, escena, cam, mat, caja };
}

export function porteria(escena, z, dir) {   // dir=+1 opens toward +z (goal at back z<0), -1 opens toward -z
  const g = new THREE.Group(), w = 3, h = 2, p = .06, m = mat({ color: 0xf5f5f5, roughness: .4, metalness: .1 });
  const palo = (x, y, a, b, c) => { const m2 = new THREE.Mesh(new THREE.BoxGeometry(a, b, c), m); m2.position.set(x, y, 0); m2.castShadow = true; g.add(m2); };
  palo(-w / 2, h / 2, p, h, p); palo(w / 2, h / 2, p, h, p); palo(0, h, w + p, p, p);
  const red = TX.red(); red.wrapS = red.wrapT = THREE.RepeatWrapping; const rm = new THREE.MeshBasicMaterial({ map: red, transparent: true, side: THREE.DoubleSide, depthWrite: false, opacity: .8 });
  red.repeat.set(10, 7); const back = new THREE.Mesh(new THREE.PlaneGeometry(w, h), rm); back.position.set(0, h / 2, -dir * .9); g.add(back);
  const r2 = red.clone(); r2.repeat.set(4, 7); r2.needsUpdate = true; const rm2 = rm.clone(); rm2.map = r2;
  for (const s of [-1, 1]) { const side = new THREE.Mesh(new THREE.PlaneGeometry(.9, h), rm2); side.rotation.y = Math.PI / 2; side.position.set(s * w / 2, h / 2, -dir * .45); g.add(side); }
  const top = new THREE.Mesh(new THREE.PlaneGeometry(w, .9), rm); top.rotation.x = Math.PI / 2; top.position.set(0, h, -dir * .45); g.add(top);
  g.position.z = z; escena.add(g); return g;
}

export function humanoide(escena, o = {}) {
  const piel = o.piel || 0xe0b090, camisa = o.camisa || TX.rayas("#0a4da2", "#ffffff"), short = o.short || 0xffffff, g = new THREE.Group();
  const cuerpo = new THREE.Mesh(new THREE.CapsuleGeometry(.24, .5, 6, 14), mat({ map: camisa, roughness: .7 })); cuerpo.position.y = 1.2; cuerpo.castShadow = true; g.add(cuerpo);
  const cab = new THREE.Mesh(new THREE.SphereGeometry(.17, 20, 16), mat({ color: piel, roughness: .8 })); cab.position.y = 1.82; cab.castShadow = true; g.add(cab);
  const pelo = new THREE.Mesh(new THREE.SphereGeometry(.18, 20, 12, 0, Math.PI * 2, 0, Math.PI * .55), mat({ color: o.pelo ?? 0x2a1d12, roughness: 1 })); pelo.position.y = 1.85; pelo.rotation.x = -.2; g.add(pelo);
  const miembro = (x, y, largo, color, r) => { const pv = new THREE.Group(); pv.position.set(x, y, 0); const l = new THREE.Mesh(new THREE.CapsuleGeometry(r, largo, 4, 10), mat({ color, roughness: .8 })); l.position.y = -largo / 2 - r; l.castShadow = true; pv.add(l); g.add(pv); return pv; };
  const bi = miembro(-.34, 1.55, .5, o.manga ?? piel, .07), bd = miembro(.34, 1.55, .5, o.manga ?? piel, .07);
  const pi = miembro(-.12, .95, .62, short, .1), pd = miembro(.12, .95, .62, short, .1);
  for (const [pv, s] of [[pi, -1], [pd, 1]]) { const bota = new THREE.Mesh(new THREE.BoxGeometry(.13, .1, .3), mat({ color: o.bota ?? 0x161616 })); bota.position.set(0, -.8, .08); bota.castShadow = true; pv.add(bota); }
  if (o.guantes) for (const b of [bi, bd]) { const gl = new THREE.Mesh(new THREE.SphereGeometry(.11, 12, 10), mat({ color: 0xffe500 })); gl.position.y = -.68; b.add(gl); }
  if (o.nombre) { const c = document.createElement("canvas"); c.width = 256; c.height = 64; const x = c.getContext("2d"); x.font = "bold 40px Bangers, Impact, sans-serif"; x.textAlign = "center"; x.fillStyle = "#000a"; x.fillRect(0, 8, 256, 48); x.fillStyle = "#ffe500"; x.fillText(o.nombre, 128, 46); const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthTest: false })); sp.scale.set(1.5, .38, 1); sp.position.y = 2.35; g.add(sp); }
  escena.add(g); return { g, bi, bd, pi, pd, cab };
}

export function balon(escena) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(.11, 24, 18), mat({ map: TX.balon(), roughness: .5 })); m.castShadow = true; escena.add(m); return m;
}
