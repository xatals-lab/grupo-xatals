/* carril3d: a console-style 3D lane game. You drive a train (or run down a street) towards the camera-facing horizon,
   switch lanes by swiping/tapping, grab good things, dodge bad ones, and pass through "gates" (3 lanes = 3 answers) that speed you up or crash you.
   Config comes from data/minijuegos.json (template "carril3d"). Everything is procedural: no downloads. */
import { THREE, TX, mat } from "./escena.js";
import { humanoide, animar } from "./figuras.js";

const LANES = [-2.4, 0, 2.4];
const lienzo = (w, h, f) => { const c = document.createElement("canvas"); c.width = w; c.height = h; f(c.getContext("2d"), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
const emoji = (e, size = 128) => lienzo(size, size, (g, w, h) => { g.font = `${size * .78}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(e, w / 2, h / 2 + 6); });
const pick = a => a[Math.floor(Math.random() * a.length)];
const EMO = new Map(); const emojiMat = e => { if (!EMO.has(e)) EMO.set(e, new THREE.SpriteMaterial({ map: emoji(e), transparent: true })); return EMO.get(e); };

function suelo(tema) {
  return lienzo(256, 256, (g, w, h) => {
    if (tema === "tren") { g.fillStyle = "#7c7a74"; g.fillRect(0, 0, w, h); for (let i = 0; i < 3000; i++) { const v = 90 + Math.random() * 90; g.fillStyle = `rgb(${v},${v - 4},${v - 10})`; g.fillRect(Math.random() * w, Math.random() * h, 2, 2); }
      g.fillStyle = "#4a3426"; for (let y = 0; y < h; y += 64) g.fillRect(0, y, w, 16); }
    else { g.fillStyle = "#34353a"; g.fillRect(0, 0, w, h); for (let i = 0; i < 2500; i++) { const v = 40 + Math.random() * 40; g.fillStyle = `rgb(${v},${v},${v + 4})`; g.fillRect(Math.random() * w, Math.random() * h, 2, 2); }
      g.fillStyle = "#e8e8e0"; for (const x of [w / 3, 2 * w / 3]) for (let y = 0; y < h; y += 64) g.fillRect(x - 3, y, 6, 36); }
  });
}
function fachada() { return lienzo(128, 256, (g, w, h) => { g.fillStyle = "#c9b48e"; g.fillRect(0, 0, w, h); for (let y = 16; y < h - 20; y += 44) for (let x = 16; x < w - 20; x += 40) { g.fillStyle = "#5a4a38"; g.fillRect(x - 2, y - 2, 28, 34); g.fillStyle = "#bfdcf0"; g.fillRect(x, y, 24, 30); } }); }
function cartel(texto, ok) { return lienzo(512, 256, (g, w, h) => { g.fillStyle = "#0b0b12"; g.fillRect(0, 0, w, h); g.strokeStyle = "#ffe500"; g.lineWidth = 14; g.strokeRect(7, 7, w - 14, h - 14); g.fillStyle = "#fff"; g.textAlign = "center"; g.textBaseline = "middle";
  let s = 54; g.font = `bold ${s}px Sora, Arial, sans-serif`; const palabras = texto.split(" "); let l1 = "", l2 = ""; for (const p of palabras) { if ((l1 + " " + p).length <= 15 || !l1) l1 = (l1 + " " + p).trim(); else l2 = (l2 + " " + p).trim(); }
  if (l2.length > 18) { g.font = "bold 42px Sora, Arial, sans-serif"; } g.fillText(l1, w / 2, l2 ? 100 : 128); if (l2) g.fillText(l2, w / 2, 170); }); }

export function iniciar(cont, cfg, cb) {
  const tema = cfg.tema || "tren";
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5)); renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.outputColorSpace = THREE.SRGBColorSpace; cont.appendChild(renderer.domElement); renderer.domElement.style.touchAction = "none";
  const escena = new THREE.Scene(); escena.fog = new THREE.Fog(tema === "tren" ? 0xcfe3f2 : 0xe8dcc0, 25, 110);
  escena.add(new THREE.Mesh(new THREE.SphereGeometry(160, 12, 8), new THREE.MeshBasicMaterial({ map: TX.cielo(), side: THREE.BackSide, fog: false })));
  const cam = new THREE.PerspectiveCamera(66, 1, .1, 220); escena.add(cam);
  escena.add(new THREE.HemisphereLight(0xdfeeff, 0x7a7a60, 1.05)); const sol = new THREE.DirectionalLight(0xfff0d0, 2); sol.position.set(-8, 14, 6); escena.add(sol);
  const tex = suelo(tema); tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(1.4, 40);
  const via = new THREE.Mesh(new THREE.PlaneGeometry(8.6, 300), new THREE.MeshStandardMaterial({ map: tex, roughness: 1 })); via.rotation.x = -Math.PI / 2; via.position.set(0, 0, -100); escena.add(via);
  const verde = new THREE.Mesh(new THREE.PlaneGeometry(220, 320), new THREE.MeshStandardMaterial({ color: tema === "tren" ? 0x5a8a4a : 0x8d8d86, roughness: 1 })); verde.rotation.x = -Math.PI / 2; verde.position.set(0, -.02, -100); escena.add(verde);
  if (tema === "tren") for (const x of LANES) for (const dx of [-.55, .55]) { const r = new THREE.Mesh(new THREE.BoxGeometry(.1, .12, 300), new THREE.MeshStandardMaterial({ color: 0xb8bcc4, metalness: .8, roughness: .3 })); r.position.set(x + dx, .07, -100); escena.add(r); }
  // scenery that streams past
  const fach = fachada(); const props = [];
  const M = { pole: mat({ color: 0x6b5a48 }), cones: [0x3f7a3a, 0x4d8a45, 0x2f6a38].map(c => mat({ color: c, roughness: 1 })), trunk: mat({ color: 0x5b4636 }), edif: mat({ map: fach, roughness: .9 }), tejado: mat({ color: 0x9a4a38 }) };
  const G = { pole: new THREE.CylinderGeometry(.1, .14, 6, 6), arm: new THREE.BoxGeometry(2, .12, .12), cone: new THREE.ConeGeometry(2, 5, 6), trunk: new THREE.CylinderGeometry(.2, .25, 1, 5), edif: new THREE.BoxGeometry(6, 10, 8), tejado: new THREE.BoxGeometry(6.5, .5, 8.5) };
  for (let i = 0; i < 12; i++) for (const lado of [-1, 1]) {
    const g = new THREE.Group();
    if (tema === "tren") { if (Math.random() < .5) { const pole = new THREE.Mesh(G.pole, M.pole); pole.position.y = 3; g.add(pole); const br = new THREE.Mesh(G.arm, M.pole); br.position.y = 5.6; g.add(br); }
      else { const c = new THREE.Mesh(G.cone, M.cones[i % 3]); c.position.y = 2.5; c.scale.set(.8 + Math.random() * .6, .8 + Math.random() * .6, .8 + Math.random() * .6); g.add(c); const tk = new THREE.Mesh(G.trunk, M.trunk); tk.position.y = .5; g.add(tk); } }
    else { const h = .6 + Math.random() * .9, b = new THREE.Mesh(G.edif, M.edif); b.scale.y = h; b.position.y = 5 * h; g.add(b); const r = new THREE.Mesh(G.tejado, M.tejado); r.position.y = 10 * h + .1; g.add(r); }
    g.position.set(lado * (7 + Math.random() * 6 + (tema === "tren" ? 0 : 3)), 0, -i * 14 - Math.random() * 8); escena.add(g); props.push(g);
  }
  // player
  const jug = new THREE.Group(); escena.add(jug); let corredor = null;
  if (tema === "tren") {
    const cuerpo = new THREE.Mesh(new THREE.BoxGeometry(1.9, 1.7, 4.6), mat({ color: 0x6a2d7a, roughness: .4, metalness: .3 })); cuerpo.position.y = 1.25; jug.add(cuerpo);
    const franja = new THREE.Mesh(new THREE.BoxGeometry(1.95, .35, 4.65), mat({ color: 0xf4f4f4 })); franja.position.y = 1.0; jug.add(franja);
    const cab = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.0, 1.6), mat({ color: 0x4a1f58, roughness: .4, metalness: .3 })); cab.position.set(0, 2.55, -1.3); jug.add(cab);
    const cris = new THREE.Mesh(new THREE.PlaneGeometry(1.5, .7), new THREE.MeshStandardMaterial({ color: 0x9fd2ff, emissive: 0x2a6ab0, roughness: .1 })); cris.position.set(0, 2.55, -2.11); cris.rotation.y = Math.PI; jug.add(cris);
    for (const x of [-.6, .6]) { const f = new THREE.Mesh(new THREE.SphereGeometry(.18, 12, 8), new THREE.MeshBasicMaterial({ color: 0xfff2a0 })); f.position.set(x, 1.0, -2.32); jug.add(f); }
    const mor = new THREE.Mesh(new THREE.ConeGeometry(.55, 1.2, 4), mat({ color: 0x6a2d7a })); mor.rotation.x = -Math.PI / 2; mor.position.set(0, 1.0, -2.9); jug.add(mor);
    for (let i = 0; i < 6; i++) { const rueda = new THREE.Mesh(new THREE.CylinderGeometry(.35, .35, .2, 12), mat({ color: 0x222 })); rueda.rotation.z = Math.PI / 2; rueda.position.set(i % 2 ? .85 : -.85, .4, -1.8 + Math.floor(i / 2) * 1.6); jug.add(rueda); }
    jug.position.set(0, 0, 0); jug.scale.setScalar(.9);
  } else { corredor = humanoide(escena, { jersey: "#e63946", pantalon: 0x222233, pelo: 0x2a1d12, bota: 0x111111 }); corredor.g.rotation.y = Math.PI; jug.add(corredor.g); escena.remove(corredor.g); jug.add(corredor.g); }
  // state
  const E = { carril: 1, x: 0, items: [], puertas: [], vidas: cfg.vidas || 3, t: cfg.duracion || 45, pts: 0, v: 16, boost: 0, lento: 0, cd: 1, cdPuerta: 6, shake: 0, activo: true, qi: 0 };
  const pregs = (cfg.puertas || []).slice().sort(() => Math.random() - .5);
  const ui = document.createElement("div"); ui.className = "c3d-ui"; ui.innerHTML = `<div class="c3d-preg"></div><div class="c3d-flechas"><button class="c3d-b" data-d="-1">⬅</button><button class="c3d-b" data-d="1">➡</button></div>`; cont.append(ui);
  const pregEl = ui.querySelector(".c3d-preg");
  const mover = d => { if (!E.activo) return; E.carril = Math.max(0, Math.min(2, E.carril + d)); if (window.sonido) sonido(420 + E.carril * 80, .05); };
  ui.querySelectorAll(".c3d-b").forEach(b => b.addEventListener("pointerdown", e => { e.preventDefault(); e.stopPropagation(); mover(+b.dataset.d); }));
  let sx = null; const cv = renderer.domElement;
  cv.addEventListener("pointerdown", e => sx = e.clientX); cv.addEventListener("pointerup", e => { if (sx == null) return; const dx = e.clientX - sx; if (Math.abs(dx) > 22) mover(dx < 0 ? -1 : 1); else { const r = cv.getBoundingClientRect(); mover(e.clientX - r.left < r.width / 2 ? -1 : 1); } sx = null; });
  const kd = e => { if (!E.activo) return document.removeEventListener("keydown", kd); if (e.key === "ArrowLeft" || e.key === "a") mover(-1); if (e.key === "ArrowRight" || e.key === "d") mover(1); }; document.addEventListener("keydown", kd);
  const sprite = (e, tam = 1.9) => { const s = new THREE.Sprite(emojiMat(e)); s.scale.set(tam, tam, 1); return s; };
  function spawn() { const bueno = Math.random() < .45, it = pick(bueno ? cfg.buenos : cfg.malos), lane = Math.floor(Math.random() * 3), s = sprite(it.e); s.position.set(LANES[lane], 1.2, -90); escena.add(s); E.items.push({ s, lane, z: -90, bueno }); }
  function puerta() {
    const q = pregs[E.qi++ % pregs.length]; const g = new THREE.Group(); const ops = q.opciones.slice(0, 3);
    ops.forEach((t, i) => { const b = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.1), new THREE.MeshBasicMaterial({ map: cartel(t), transparent: true })); b.position.set(LANES[i], 3.1, 0); g.add(b); for (const dx of [-1.05, 1.05]) { const p = new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, 3.1, 6), mat({ color: 0x888 })); p.position.set(LANES[i] + dx, 1.55, 0); g.add(p); } });
    g.position.z = -100; escena.add(g); E.puertas.push({ g, z: -100, q, hecho: false }); pregEl.innerHTML = (cfg.sujeto ? `<small style="color:#ffe500">PREGUNTAS SOBRE ${cfg.sujeto.toUpperCase()}</small><br>` : "") + "🚦 " + q.pregunta; pregEl.classList.add("on");
  }
  function fin(texto) { if (!E.activo) return; E.activo = false; document.removeEventListener("keydown", kd); cb.fin(E.pts, texto); setTimeout(destruir, 400); }
  function destruir() { E.vivo = false; ui.remove(); renderer.dispose(); renderer.domElement.remove(); }
  E.vivo = true;
  function redar() { const w = cont.clientWidth, h = cont.clientHeight; renderer.setSize(w, h); cam.aspect = w / h; cam.fov = cam.aspect < .8 ? 84 : 66; cam.updateProjectionMatrix(); }
  new ResizeObserver(redar).observe(cont); redar();
  const reloj = new THREE.Clock(); let hudT = 0;
  function paso(dt) {
    const tt = reloj.elapsedTime;
    if (E.activo) { E.t -= dt; E.cd -= dt; E.cdPuerta -= dt; E.boost = Math.max(0, E.boost - dt); E.lento = Math.max(0, E.lento - dt); const cerca = E.puertas.some(p => !p.hecho && p.z > -75); E.v = (11 + (cfg.duracion - E.t) * .1) * (E.boost > 0 ? 1.35 : 1) * (E.lento > 0 ? .6 : 1) * (cerca ? .6 : 1);   // slower, and slower still while reading a gate
      if (E.cd <= 0 && !E.puertas.some(p => p.z < -35)) { spawn(); E.cd = Math.max(.55, 1.15 - (cfg.duracion - E.t) * .012); }
      if (pregs.length && E.cdPuerta <= 0 && E.t > 6) { puerta(); E.cdPuerta = 11; } }
    const mov = E.v * dt; tex.offset.y -= mov / 7.5;
    E.x += (LANES[E.carril] - E.x) * Math.min(1, dt * 11); jug.position.x = E.x; jug.rotation.z = (LANES[E.carril] - E.x) * -.05;
    if (corredor) animar(corredor, "correr", tt, 1.5); else jug.position.y = Math.sin(tt * 30) * .012;
    props.forEach(p => { p.position.z += mov; if (p.position.z > 12) p.position.z -= 12 * 14; });
    for (const it of E.items) { it.z += mov; it.s.position.z = it.z; it.s.position.y = 1.2 + Math.sin(tt * 4 + it.lane) * .12; }
    for (const p of E.puertas) { p.z += mov; p.g.position.z = p.z; }
    if (E.activo) {
      for (const it of E.items) if (!it.hit && it.z > -.9 && it.z < 1.4 && it.lane === E.carril) { it.hit = true; it.s.visible = false;
        if (it.bueno) { E.pts += 60; if (window.sonido) sonido(760, .08); if (cfg.msg_ok) cb.say(pick(cfg.msg_ok)); }
        else { E.vidas--; E.lento = 1.5; E.shake = .6; E.pts = Math.max(0, E.pts - 30); if (window.sonido) sonido(110, .25); if (cfg.msg_ko) cb.say(pick(cfg.msg_ko)); if (E.vidas <= 0) fin("Te has estrellado. Fin del viaje."); } }
      for (const p of E.puertas) if (!p.hecho && p.z > -.6) { p.hecho = true; const ok = E.carril === p.q.correcta;
        if (ok) { E.pts += 250; E.boost = 3; if (window.sonido) { sonido(660, .1); setTimeout(() => sonido(990, .15), 110); } cb.say("✅ ¡Vía correcta! Acelerón."); if (window.confeti) confeti(); }
        else { E.vidas--; E.lento = 2; E.shake = .8; if (window.sonido) sonido(100, .3); cb.say("❌ Vía equivocada. Era: " + p.q.opciones[p.q.correcta]); if (E.vidas <= 0) fin("Te has estrellado. Fin del viaje."); }
        pregEl.classList.remove("on"); }
      if (E.t <= 0) fin("Llegas a la estación. ¡Viaje completado!"); }
    E.items = E.items.filter(it => { if (it.z > 8 || it.hit) { escena.remove(it.s); return false; } return true; });
    E.puertas = E.puertas.filter(p => { if (p.z > 14) { escena.remove(p.g); return false; } return true; });
    if (E.shake > 0) E.shake -= dt * 1.6;
  }
  (function bucle() {
    if (!E.vivo) return; requestAnimationFrame(bucle); const real = Math.min(.35, reloj.getDelta());
    for (let rest = real; rest > 1e-4 && E.vivo; rest -= .04) paso(Math.min(.04, rest));
    const dt = real;
    cam.position.set(E.x * .55 + (E.shake > 0 ? (Math.random() - .5) * .25 * E.shake : 0), 2.9 + (E.shake > 0 ? (Math.random() - .5) * .15 * E.shake : 0), 6.2); cam.lookAt(E.x * .3, 1.4, -14);
    cam.fov += ((E.boost > 0 ? 88 : (cam.aspect < .8 ? 84 : 66)) - cam.fov) * Math.min(1, dt * 4); cam.updateProjectionMatrix();
    hudT -= dt; if (hudT <= 0) { hudT = .2; cb.hud(`<span>${"❤".repeat(Math.max(0, E.vidas))}</span><span>⏱ ${Math.max(0, Math.ceil(E.t))}s</span><span>${Math.round(E.pts)} PTS</span>`); }
    renderer.render(escena, cam);
  })();
  return { destruir };
}
