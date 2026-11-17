/* Articulated 3D people (hips, knees, shoulders, elbows) + animation modes + wandering teachers with FIFA-style name arrows. */
import { THREE, mat } from "./escena.js";

const cap = (r, len, m) => { const x = new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 4, 10), m); x.castShadow = true; return x; };
const esf = (r, m, sx = 1, sy = 1, sz = 1) => { const x = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12), m); x.scale.set(sx, sy, sz); x.castShadow = true; return x; };

export function etiqueta(texto, color = "#ffe500") {      // FIFA-like name plate with an arrow
  const c = document.createElement("canvas"); c.width = 512; c.height = 128; const x = c.getContext("2d");
  x.font = "bold 44px Sora, Arial, sans-serif"; const w = Math.min(500, x.measureText(texto).width + 40);
  x.fillStyle = "#0a0a10dd"; x.beginPath(); x.roundRect(256 - w / 2, 8, w, 66, 18); x.fill(); x.strokeStyle = color; x.lineWidth = 4; x.stroke();
  x.fillStyle = "#fff"; x.textAlign = "center"; x.fillText(texto, 256, 56);
  x.fillStyle = color; x.beginPath(); x.moveTo(236, 84); x.lineTo(276, 84); x.lineTo(256, 118); x.fill();
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthTest: false })); s.scale.set(2, .5, 1); s.renderOrder = 20; return s;
}

export function humanoide(escena, o = {}) {
  const piel = new THREE.Color(o.piel ?? 0xe0b090), g = new THREE.Group();
  const camisa = mat({ map: o.camisa || null, color: o.camisa ? 0xffffff : (o.jersey ? new THREE.Color(o.jersey) : 0x3366aa), roughness: .85 });
  const pantM = mat({ color: new THREE.Color(o.pantalon ?? 0xffffff), roughness: .85 }), calM = mat({ color: new THREE.Color(o.calcetin ?? o.pantalon ?? 0xffffff), roughness: .85 });
  const pielM = mat({ color: piel, roughness: .8 });
  const torso = cap(.24, .3, camisa); torso.position.y = 1.25; g.add(torso);
  if (o.cuello) { const cu = new THREE.Mesh(new THREE.BoxGeometry(.3, .08, .2), mat({ color: 0xf2f2f2 })); cu.position.set(0, 1.62, .02); g.add(cu); }
  if (o.bata) { const ba = cap(.27, .42, mat({ color: 0xf6f6f6, roughness: .9 })); ba.position.y = 1.15; g.add(ba); }
  const cab = esf(.17, pielM, 1, 1.08, 1); cab.position.y = 1.82; g.add(cab);
  const ojo = (x) => { const e = esf(.022, mat({ color: 0x111111 })); e.position.set(x, 1.85, .155); g.add(e); };
  ojo(-.06); ojo(.06); const nariz = esf(.03, pielM); nariz.position.set(0, 1.81, .17); g.add(nariz);
  const pelo = o.pelo === null || o.pelo === undefined && o.calvo ? null : (o.pelo ?? 0x2a1d12);
  if (pelo !== null) { const h = new THREE.Mesh(new THREE.SphereGeometry(.18, 20, 12, 0, Math.PI * 2, 0, Math.PI * .55), mat({ color: new THREE.Color(pelo), roughness: 1 })); h.position.y = 1.85; h.rotation.x = -.15; g.add(h); }
  else { for (const s of [-1, 1]) { const lado = esf(.06, mat({ color: 0x555555 }), 1, 1.2, 1); lado.position.set(s * .16, 1.84, -.01); g.add(lado); } }
  if (o.barba) { const b = esf(.13, mat({ color: 0x2a2018 }), 1.05, .7, .85); b.position.set(0, 1.74, .06); g.add(b); }
  if (o.bigote) { const b = new THREE.Mesh(new THREE.BoxGeometry(.13, .025, .03), mat({ color: 0x1a1410 })); b.position.set(0, 1.77, .17); g.add(b); }
  if (o.perilla) { const b = new THREE.Mesh(new THREE.ConeGeometry(.03, .09, 8), mat({ color: 0x1a1410 })); b.rotation.x = Math.PI; b.position.set(0, 1.69, .15); g.add(b); }
  if (o.gafas) { const col = o.gafas === "sol" ? 0x0a0a0a : 0x222222, lm = mat({ color: col, roughness: .3, metalness: .3 });
    for (const x of [-.065, .065]) { const l = new THREE.Mesh(new THREE.BoxGeometry(.085, o.gafas === "sol" ? .05 : .06, .02), lm); l.position.set(x, 1.855, .165); g.add(l); }
    const pu = new THREE.Mesh(new THREE.BoxGeometry(.04, .01, .01), lm); pu.position.set(0, 1.86, .17); g.add(pu); }
  function pierna(x) { const hip = new THREE.Group(); hip.position.set(x, 1.0, 0); const mu = cap(.095, .27, pantM); mu.position.y = -.23; hip.add(mu);
    const rod = new THREE.Group(); rod.position.y = -.46; hip.add(rod); const ca = cap(.075, .3, calM); ca.position.y = -.225; rod.add(ca);
    const bota = new THREE.Mesh(new THREE.BoxGeometry(.13, .09, .3), mat({ color: o.bota ?? 0x181818, roughness: .6 })); bota.position.set(0, -.47, .07); bota.castShadow = true; rod.add(bota); g.add(hip); return [hip, rod]; }
  function brazo(x) { const sh = new THREE.Group(); sh.position.set(x, 1.55, 0); const ar = cap(.06, .22, o.manga ? mat({ color: new THREE.Color(o.manga) }) : camisa); ar.position.y = -.17; sh.add(ar);
    const co = new THREE.Group(); co.position.y = -.34; sh.add(co); const fa = cap(.052, .2, o.manga ? mat({ color: new THREE.Color(o.manga) }) : pielM); fa.position.y = -.155; co.add(fa);
    const mano = esf(o.guantes ? .085 : .06, o.guantes ? mat({ color: 0xffe500 }) : pielM); mano.position.y = -.32; co.add(mano); g.add(sh); return [sh, co]; }
  const [pi, ri] = pierna(-.12), [pd, rd] = pierna(.12), [bi, ci] = brazo(-.34), [bd, cd] = brazo(.34);
  g.scale.set(o.ancho ?? 1, o.alto ?? 1, o.ancho ?? 1); escena.add(g);
  const h = { g, torso, cab, pi, pd, ri, rd, bi, bd, ci, cd, y0: 0 };
  if (o.nombre) { const s = etiqueta(o.nombre, o.colorNombre); s.position.y = 2.55; g.add(s); h.nombre = s; }
  return h;
}

export function reposo(h) { for (const k of ["pi", "pd", "ri", "rd", "bi", "bd", "ci", "cd"]) h[k].rotation.set(0, 0, 0); h.torso.rotation.set(0, 0, 0); h.g.rotation.x = 0; h.g.rotation.z = 0; h.g.position.y = h.y0; }

export function animar(h, modo, t, v = 1) {
  const s = Math.sin(t * 6 * v), c = Math.cos(t * 6 * v);
  if (modo === "reposo") { reposo(h); h.bi.rotation.z = -.06 + Math.sin(t * 1.6) * .02; h.bd.rotation.z = .06 - Math.sin(t * 1.6) * .02; h.torso.rotation.x = Math.sin(t * 1.6) * .01; return; }
  if (modo === "caminar" || modo === "correr") { const a = modo === "correr" ? 1.0 : .55, rod = modo === "correr" ? 1.1 : .5;
    h.pi.rotation.x = s * a; h.pd.rotation.x = -s * a; h.ri.rotation.x = Math.max(0, -c * rod) + .05; h.rd.rotation.x = Math.max(0, c * rod) + .05;
    h.bi.rotation.x = -s * a * .8; h.bd.rotation.x = s * a * .8; h.ci.rotation.x = -.3 - (modo === "correr" ? .7 : 0); h.cd.rotation.x = -.3 - (modo === "correr" ? .7 : 0);
    h.torso.rotation.x = modo === "correr" ? .18 : .04; h.g.position.y = h.y0 + Math.abs(Math.sin(t * 6 * v)) * (modo === "correr" ? .06 : .025); return; }
  if (modo === "guardar") { reposo(h); h.bi.rotation.z = -1.15; h.bd.rotation.z = 1.15; h.ci.rotation.z = -.2; h.cd.rotation.z = .2; h.pi.rotation.z = -.14; h.pd.rotation.z = .14; h.ri.rotation.x = .35; h.rd.rotation.x = .35; h.pi.rotation.x = -.25; h.pd.rotation.x = -.25; h.torso.rotation.x = .2 + Math.sin(t * 5) * .03; h.g.position.y = h.y0 - .08; return; }
  if (modo === "festejo") { reposo(h); h.bi.rotation.z = -2.7; h.bd.rotation.z = 2.7; h.g.position.y = h.y0 + Math.abs(Math.sin(t * 8)) * .35; h.pi.rotation.x = -.3; h.pd.rotation.x = .3; return; }
  if (modo === "derrota") { reposo(h); h.cab.rotation.x = .5; h.torso.rotation.x = .45; h.bi.rotation.x = .3; h.bd.rotation.x = .3; return; }
}

/* kick: p 0..1 on the right leg (pd). 0-.4 wind-up, .4-.6 strike, then follow-through */
export function patada(h, p) {
  reposo(h); const w = Math.min(1, p / .4), st = Math.max(0, Math.min(1, (p - .4) / .2)), f = Math.max(0, (p - .6) / .4);
  if (p < .4) { h.pd.rotation.x = .9 * w; h.rd.rotation.x = 1.3 * w; h.bi.rotation.x = -.6 * w; h.bd.rotation.x = .5 * w; h.torso.rotation.x = -.05 * w; }
  else { h.pd.rotation.x = .9 - 2.5 * st; h.rd.rotation.x = 1.3 - 1.2 * st; h.bi.rotation.x = -.6 + 1.1 * st; h.bd.rotation.x = .5 - 1.0 * st; h.torso.rotation.x = .12 * st; if (f > 0) h.pd.rotation.x = -1.6 + f * .6; }
}

/* kicks YOU: a flying kick toward the camera */
export function patadaFrontal(h, p) { reposo(h); h.pd.rotation.x = -1.9 * Math.min(1, p * 1.6); h.rd.rotation.x = .2; h.torso.rotation.x = -.25 * p; h.bi.rotation.z = -.9; h.bd.rotation.z = .9; }

/* ---------- teachers walking the yard ---------- */
const AIRE = [[-7, -12.2], [7, -12.2], [-3, -12.6], [3, -12.6], [-8.5, -6], [8.5, -6], [-8.5, -9], [8.5, -9], [-5, -12], [5, -12], [-9, -4], [9, -4]];
export function crearProfes(escena, lista, contenedor, opciones = {}) {
  const sel = [], activos = [], limites = opciones.limites || 12;
  const ultimoTipo = { v: null };
  function nuevo(excluir) {
    const cand = lista.filter(p => !excluir.includes(p.id)); const q = cand[Math.floor(Math.random() * cand.length)];
    const l = q.look || {}; const h = humanoide(escena, { jersey: l.jersey, pantalon: l.pantalon, pelo: l.pelo, calvo: l.pelo === null, barba: l.barba, bigote: l.bigote, perilla: l.perilla, gafas: l.gafas, bata: l.bata, cuello: true,
      alto: l.alto, ancho: l.ancho, nombre: q.nombre, colorNombre: "#ffb800", bota: 0x3a2a1e, piel: 0xe3b595 });
    const p0 = AIRE[Math.floor(Math.random() * AIRE.length)]; h.g.position.set(p0[0], 0, p0[1]); h.dato = q; h.destino = null; h.espera = Math.random() * 2; h.vel = .8 + Math.random() * .3; return h;
  }
  const A = { profes: activos, proxRegano: performance.now() + 25000 + Math.random() * 20000, rotar: performance.now() + 40000 };
  const ids = () => activos.map(a => a.dato.id);
  activos.push(nuevo([])); activos.push(nuevo(ids()));
  A.update = (dt, t) => {
    const now = performance.now();
    if (now > A.rotar) { const i = Math.floor(Math.random() * activos.length); escena.remove(activos[i].g); activos[i] = nuevo(ids()); A.rotar = now + 40000 + Math.random() * 20000; }
    for (const h of activos) {
      if (h.hablando) { animar(h, "reposo", t); continue; }
      if (h.espera > 0) { h.espera -= dt; animar(h, "reposo", t); continue; }
      if (!h.destino) { const d = AIRE[Math.floor(Math.random() * AIRE.length)]; h.destino = new THREE.Vector3(d[0], 0, d[1]); }
      const dir = h.destino.clone().sub(h.g.position); dir.y = 0; const dist = dir.length();
      if (dist < .4) { h.destino = null; h.espera = 1.5 + Math.random() * 3; continue; }
      dir.normalize(); h.g.position.addScaledVector(dir, h.vel * dt); h.g.rotation.y = Math.atan2(dir.x, dir.z); animar(h, "caminar", t, .8);
    }
  };
  /* returns a promise: resolves when the player has been told off (only at safe moments chosen by the game) */
  A.regano = (cam) => new Promise(res => {
    if (performance.now() < A.proxRegano) return res(false);
    const h = activos[Math.floor(Math.random() * activos.length)], q = h.dato; h.hablando = true;
    if (cam) h.g.lookAt(cam.position.x, 0, cam.position.z);
    const ov = document.createElement("div"); ov.className = "regano"; ov.innerHTML = `<div class="caja"><div class="nom">${q.emoji || ""} ${q.nombre}</div><p>«${q.amenazas[Math.floor(Math.random() * q.amenazas.length)]}»</p><button class="rosa">Vale, vale, perdón...</button></div>`;
    contenedor.style.position = "relative"; contenedor.append(ov); if (window.sonido) sonido(180, .3);
    ov.querySelector("button").onclick = () => { ov.remove(); h.hablando = false; A.proxRegano = performance.now() + 30000 + Math.random() * 25000; res(true); };
  });
  return A;
}

/* red screen explosion + loud text, used when Tejedor / Buxai hit you */
export function golpe(texto) {
  document.getElementById("golpe")?.remove(); const g = document.createElement("div"); g.id = "golpe"; g.innerHTML = `<b>${texto}</b>`; document.body.append(g);
  document.body.classList.remove("shakeAll"); void document.body.offsetWidth; document.body.classList.add("shakeAll"); if (window.sonido) { sonido(90, .35); setTimeout(() => sonido(60, .4), 120); }
  setTimeout(() => { g.remove(); document.body.classList.remove("shakeAll"); }, 1700);
}
