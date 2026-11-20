/* 3D versions of the mini-game templates (golpea = pulsa, torre = apila, busca, ritmo, simon, timing, aguanta). Procedural, mobile first:
   tap/swipe anywhere, big overlay buttons inside the view. Each export: (contenedor, config, {hud, say, fin}). */
import { THREE, TX, mat } from "./escena.js";
import { particulas, popup, flash, vibra } from "./juice.js";

const pick = a => a[Math.floor(Math.random() * a.length)];
const EMO = new Map();
const emojiMat = e => { if (!EMO.has(e)) { const c = document.createElement("canvas"); c.width = c.height = 128; const x = c.getContext("2d"); x.font = '100px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(e, 64, 70);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; EMO.set(e, new THREE.SpriteMaterial({ map: t, transparent: true })); } return EMO.get(e); };
const sprite = (e, s = 1.6) => { const p = new THREE.Sprite(emojiMat(e)); p.scale.set(s, s, 1); return p; };

function mundo(cont, o = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5)); renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.outputColorSpace = THREE.SRGBColorSpace; cont.appendChild(renderer.domElement); renderer.domElement.style.touchAction = "none";
  const scene = new THREE.Scene(); scene.fog = new THREE.Fog(o.fog ?? 0xcfdbe8, 22, 70);
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(120, 12, 8), new THREE.MeshBasicMaterial({ map: TX.cielo(), side: THREE.BackSide, fog: false })));
  const cam = new THREE.PerspectiveCamera(58, 1, .1, 200); scene.add(cam);
  scene.add(new THREE.HemisphereLight(0xdfeeff, 0x80755f, 1.1)); const sol = new THREE.DirectionalLight(0xfff0d0, 2.2); sol.position.set(-6, 12, 8); scene.add(sol);
  const suelo = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshStandardMaterial({ color: o.suelo ?? 0x8e8e88, roughness: 1 })); suelo.rotation.x = -Math.PI / 2; scene.add(suelo);
  const M = { fx: particulas(scene), shk: 0, punch: 0, renderer, scene, cam, suelo, vivo: true, tick: () => {}, taps: [], raycaster: new THREE.Raycaster(), t: 0 };
  M.cont = cont; const _v = new THREE.Vector3();
  const pantalla = p => { _v.copy(p).project(cam); return [(_v.x * .5 + .5) * 100, (-_v.y * .5 + .5) * 100]; };
  M.pum = (p, color = 0xffe500, txt = "", col = "#ffe500") => { M.fx.burst(p, color, 18); if (txt) { const [x, y] = pantalla(p); popup(cont, txt, col, x, y); } vibra(15); M.punch = 1; };
  M.mal = (p, txt = "", color = 0xff3b30) => { M.fx.burst(p, color, 12, 4); flash(cont, "#ff1e1e", 300); M.shk = .6; vibra(70); if (txt) { const [x, y] = pantalla(p); popup(cont, txt, "#ff6b5b", x, y); } };
  function redar() { const w = cont.clientWidth, h = cont.clientHeight; renderer.setSize(w, h); cam.aspect = w / h; cam.fov = cam.aspect < .8 ? 74 : 58; cam.updateProjectionMatrix(); }
  new ResizeObserver(redar).observe(cont); redar();
  let down = null; const cv = renderer.domElement;
  cv.addEventListener("pointerdown", e => down = [e.clientX, e.clientY]);
  cv.addEventListener("pointerup", e => { if (!down) return; const moved = Math.hypot(e.clientX - down[0], e.clientY - down[1]); down = null; const r = cv.getBoundingClientRect(); M.raycaster.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), cam); M.taps.forEach(f => f(moved, e)); });
  M.pick = objs => M.raycaster.intersectObjects(objs, false)[0];
  M.ui = html => { const d = document.createElement("div"); d.className = "c3d-ui"; d.innerHTML = html; cont.append(d); return d; };
  const clock = new THREE.Clock();
  (function bucle() { if (!M.vivo) return; requestAnimationFrame(bucle); const real = Math.min(.35, clock.getDelta()); M.t += real; for (let r = real; r > 1e-4 && M.vivo; r -= .04) M.tick(Math.min(.04, r), M.t); M.fx.update(real); const sh = M.shk > 0 ? M.shk : 0; if (M.shk > 0) M.shk -= real * 2.5; if (M.punch > 0) M.punch -= real * 4; cam.zoom = 1 + Math.max(0, M.punch) * .05; cam.updateProjectionMatrix();
    const ox = (Math.random() - .5) * .35 * sh, oy = (Math.random() - .5) * .25 * sh; cam.position.x += ox; cam.position.y += oy; renderer.render(scene, cam); cam.position.x -= ox; cam.position.y -= oy; })();
  M.destruir = () => { M.vivo = false; renderer.dispose(); renderer.domElement.remove(); cont.querySelectorAll(".c3d-ui").forEach(x => x.remove()); };
  return M;
}
const cierra = (M, cb, p, t) => { cb.fin(p, t); setTimeout(() => M.destruir(), 500); };
const beep = (f, d) => { if (window.sonido) sonido(f, d); };

/* ---------------- golpea (pulsa): tap what pops out of the holes ---------------- */
export function pulsa(cont, g, cb) {
  const M = mundo(cont, { suelo: 0x5a4a3a, fog: 0xd8c9a8 }); M.cam.position.set(0, 7.5, 8.5); M.cam.lookAt(0, 0, .4);
  const mesa = new THREE.Mesh(new THREE.BoxGeometry(9, .6, 8), mat({ color: 0x7a5535, roughness: .7 })); mesa.position.y = -.3; scene_add(M, mesa);
  const hoyos = []; let n = 0;
  for (const z of [-2.2, .6, 3.4]) for (const x of [-2.8, 0, 2.8]) {
    const d = new THREE.Mesh(new THREE.CircleGeometry(1.05, 24), new THREE.MeshBasicMaterial({ color: 0x050403 })); d.rotation.x = -Math.PI / 2; d.position.set(x, .02, z); scene_add(M, d);
    const r = new THREE.Mesh(new THREE.TorusGeometry(1.05, .12, 8, 24), mat({ color: 0xffe500, roughness: .4 })); r.rotation.x = Math.PI / 2; r.position.set(x, .06, z); scene_add(M, r);
    const s = sprite("❓", 2); s.position.set(x, -2, z); s.visible = false; scene_add(M, s); hoyos.push({ x, z, s, activo: false, k: "", y: -2, objetivo: -2, vis: 0 }); }
  let t = g.duracion || 30, pts = 0, hits = 0, fallos = 0, cd = .5; const T = t;
  M.taps.push(() => { const h = M.pick(hoyos.filter(x => x.activo).map(x => x.s)); if (!h) return; const ho = hoyos.find(x => x.s === h.object); ho.activo = false; ho.objetivo = -2;
    if (ho.k === "b") { M.pum(new THREE.Vector3(ho.x, 1.3, ho.z), 0xffe500, "+" + (g.pts_bueno || 10)); pts += g.pts_bueno || 10; hits++; beep(660, .08); if (g.msg_ok) cb.say(pick(g.msg_ok)); } else { M.mal(new THREE.Vector3(ho.x, 1.3, ho.z), "-" + (g.pts_malo || 15)); pts = Math.max(0, pts - (g.pts_malo || 15)); fallos++; beep(150, .15); if (g.msg_ko) cb.say(pick(g.msg_ko)); } });
  M.tick = dt => { t -= dt; cd -= dt; const prog = T - t;
    if (cd <= 0) { const libres = hoyos.filter(h => !h.activo); if (libres.length) { const h = pick(libres), bueno = Math.random() < .62, it = pick(bueno ? g.buenos : g.malos); h.s.material = emojiMat(it.e); h.k = bueno ? "b" : "m"; h.activo = true; h.objetivo = 1.3; h.vis = Math.max(.45, 1.1 - prog * .008); h.s.visible = true; } cd = Math.max(.32, .65 - prog * .006); }
    for (const h of hoyos) { if (h.activo) { h.vis -= dt; if (h.vis <= 0) { h.activo = false; h.objetivo = -2; } } h.y += (h.objetivo - h.y) * Math.min(1, dt * 14); h.s.position.y = h.y; if (h.y < -1.9 && !h.activo) h.s.visible = false; }
    cb.hud(`<span>⏱ ${Math.ceil(t)}s</span><span>${Math.round(pts)} PTS</span>`); if (t <= 0 && M.vivo) { M.vivo = true; cierra(M, cb, pts, `Se acabó. ${hits} aciertos, ${fallos} fallos.`); M.tick = () => {}; } };
  cb.say(g.consigna || "Toca los buenos, no toques los malos");
}
const scene_add = (M, o) => M.scene.add(o);

/* ---------------- torre (apila): stack blocks in 3D ---------------- */
export function apila(cont, g, cb) {
  const M = mundo(cont, { suelo: 0x6e7a6a, fog: 0xc9d9e6 }); const NIV = g.niveles || []; const H = .7;
  const base = new THREE.Mesh(new THREE.BoxGeometry(5, .6, 5), mat({ color: 0x555a60 })); base.position.y = -.3; scene_add(M, base);
  let nivel = 0, ancho = 3.4, izq = 0, x = -4, dir = 1, pts = 0, perf = 0, mov = null, cayendo = [], camY = 3, fin = false; const colores = [0xffe500, 0xff2e93, 0x00e5ff, 0x39ff14, 0xffb800];
  const bloque = (w, y, c) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, H, 3.2), mat({ color: c, roughness: .4, metalness: .2 })); b.position.y = y; return b; };
  function nuevo() { mov = bloque(ancho, nivel * H + H / 2, colores[nivel % colores.length]); mov.position.x = -4.5; x = -4.5; dir = 1; scene_add(M, mov); const e = sprite(g.bloque ? g.bloque.e : "🧱", 1.1); e.position.set(0, .9, 0); mov.add(e); cb.say(NIV[nivel] || `Piso ${nivel + 1}`); }
  function suelta() { if (fin || !mov) return; const mi = Math.max(x - ancho / 2, izq - ancho / 2 + (nivel ? 0 : 0)), a = nivel === 0 ? { c: 0, w: 3.4 } : { c: izq, w: ancho };
    const ini = Math.max(x - ancho / 2, a.c - a.w / 2), fin2 = Math.min(x + ancho / 2, a.c + a.w / 2), sol = fin2 - ini;
    if (sol <= .05) { M.mal(mov.position.clone(), "¡CAE!"); fin = true; mov.userData.cae = 1; cayendo.push(mov); beep(110, .3); cierra(M, cb, pts, g.msg_ko ? pick(g.msg_ko) : "Se cae la torre."); return; }
    const perfecto = Math.abs(x - a.c) < .12; if (perfecto) { M.pum(mov.position.clone(), 0xffe500, "¡PERFECTO!"); perf++; pts += 50; beep(900, .1); cb.say(g.msg_ok ? pick(g.msg_ok) : "¡Perfecto!"); } else beep(520, .08);
    const sobra = ancho - sol; if (!perfecto && sobra > .02) { const lado = x > a.c ? 1 : -1, trozo = bloque(sobra, mov.position.y, 0xaaaaaa); trozo.position.x = lado > 0 ? fin2 + sobra / 2 : ini - sobra / 2; scene_add(M, trozo); cayendo.push(trozo); }
    const nw = perfecto ? ancho : sol, nc = perfecto ? a.c : (ini + fin2) / 2; scene_add(M, mov); mov.geometry.dispose(); mov.geometry = new THREE.BoxGeometry(nw, H, 3.2); mov.position.x = nc; mov.children.forEach(c => c.visible = false);
    ancho = nw; izq = nc; pts += 100; nivel++; mov = null; if (nivel >= 12) { fin = true; confetiSafe(); cierra(M, cb, pts + 300, "¡Torre completa! Hasta Celedón tiene vértigo."); return; } nuevo(); }
  M.taps.push(suelta); document.addEventListener("keydown", function k(e) { if (!M.vivo) return document.removeEventListener("keydown", k); if (e.key === " ") { e.preventDefault(); suelta(); } });
  const ui = M.ui('<div class="c3d-flechas"><button class="c3d-b" style="width:100%;font-size:1.2rem">⬇ SUELTA</button></div>'); ui.querySelector("button").addEventListener("pointerdown", e => { e.preventDefault(); e.stopPropagation(); suelta(); });
  nuevo();
  M.tick = (dt, t) => { if (mov) { x += dir * (3 + nivel * .7) * dt; if (x > 4.5) dir = -1; if (x < -4.5) dir = 1; mov.position.x = x; }
    for (const c of cayendo) { c.position.y -= 9 * dt; c.rotation.z += dt * 2; } cayendo = cayendo.filter(c => { if (c.position.y < -6) { M.scene.remove(c); return false; } return true; });
    camY += ((nivel * H + 3.2) - camY) * Math.min(1, dt * 3); M.cam.position.set(7.5, camY + 3, 9); M.cam.lookAt(0, camY - .5, 0);
    cb.hud(`<span>Piso ${Math.min(12, nivel + 1)}/12</span><span>${Math.round(pts)} PTS</span>`); };
}
const confetiSafe = () => { if (window.confeti) confeti(); };

/* ---------------- busca: find the target in a 3D crowd ---------------- */
export function busca(cont, g, cb) {
  const M = mundo(cont, { suelo: 0x8d8d86 }); M.cam.position.set(0, 3, 8); let r = 0, pts = 0, t0 = performance.now(), crowd = [], objetivo = null; const R = g.rondas || 5;
  function ronda() { crowd.forEach(s => M.scene.remove(s)); crowd = []; if (r >= R) return cierra(M, cb, pts, "Has encontrado a todos... o eso creen.");
    const n = 14 + r * 7, tiempo = Math.max(6, (g.tiempo || 14) - r); t0 = performance.now(); M.tiempo = tiempo;
    for (let i = 0; i < n; i++) { const s = sprite(pick(g.senuelos).e, 1.7); s.position.set((Math.random() - .5) * 13, .9 + Math.random() * 3.6, -1 - Math.random() * 10); s.userData = { base: s.position.clone(), fase: Math.random() * 6, objetivo: false }; M.scene.add(s); crowd.push(s); }
    objetivo = sprite(g.objetivo.e, 1.7); objetivo.position.set((Math.random() - .5) * 11, 1 + Math.random() * 3.4, -2 - Math.random() * 8); objetivo.userData = { base: objetivo.position.clone(), fase: 1, objetivo: true }; M.scene.add(objetivo); crowd.push(objetivo); cb.say(`Encuentra a ${g.objetivo.t} (${r + 1}/${R})`); }
  M.taps.push(moved => { if (moved > 12) return; const h = M.pick(crowd); if (!h) return; const s = h.object;
    if (s.userData.objetivo) { M.pum(s.position.clone(), 0x39ff14, "¡ENCONTRADO!", "#39ff14"); const seg = (performance.now() - t0) / 1000; pts += Math.max(30, Math.round(300 - seg * (300 / M.tiempo))); beep(760, .12); r++; ronda(); } else { M.mal(s.position.clone(), "-25"); pts = Math.max(0, pts - 25); beep(130, .08); s.visible = false; } });
  M.tick = (dt, t) => { M.cam.position.x = Math.sin(t * .35) * 1.6; M.cam.lookAt(0, 2.3, -6); crowd.forEach(s => { const u = s.userData; s.position.x = u.base.x + Math.sin(t * .8 + u.fase) * .35; s.position.y = u.base.y + Math.sin(t * 1.3 + u.fase) * .2; });
    const l = M.tiempo - (performance.now() - t0) / 1000; cb.hud(`<span>⏱ ${Math.max(0, l).toFixed(1)}s</span><span>${Math.round(pts)} PTS</span>`); if (l <= 0) { cb.say(g.msg_ko ? pick(g.msg_ko) : "Se ha esfumado..."); r++; ronda(); } };
  ronda();
}

/* ---------------- ritmo: notes rush down a 3D highway ---------------- */
export function ritmo(cont, g, cb) {
  const M = mundo(cont, { suelo: 0x15101f, fog: 0x1a0b3a }); const X = [-3, -1, 1, 3], N = g.notas || ["🎸"], T = g.duracion || 30, L = g.carriles || ["⬅", "⬇", "⬆", "➡"];
  M.cam.position.set(0, 6.5, 10); M.cam.lookAt(0, 0, -4); M.scene.background = new THREE.Color(0x120a26);
  const via = new THREE.Mesh(new THREE.PlaneGeometry(8.4, 120), new THREE.MeshStandardMaterial({ color: 0x1b1530, roughness: .5, metalness: .4 })); via.rotation.x = -Math.PI / 2; via.position.set(0, .01, -40); M.scene.add(via);
  X.forEach(x => { const l = new THREE.Mesh(new THREE.BoxGeometry(.06, .05, 120), new THREE.MeshBasicMaterial({ color: 0x00e5ff })); l.position.set(x + 1, .05, -40); M.scene.add(l); });
  const linea = new THREE.Mesh(new THREE.BoxGeometry(8.4, .1, .35), new THREE.MeshBasicMaterial({ color: 0xffe500 })); linea.position.set(0, .08, 3); M.scene.add(linea);
  let t = T, combo = 0, pts = 0, notas = [], cd = .4;
  function golpe(i) { if (!M.vivo) return; const n = notas.filter(x => x.i === i && x.s.position.z > 1 && x.s.position.z < 5).sort((a, b) => b.s.position.z - a.s.position.z)[0];
    if (n) { M.pum(n.s.position.clone(), 0x00e5ff, combo + 1 >= 5 ? "COMBO x" + (combo + 1) : "", "#00e5ff"); M.scene.remove(n.s); notas = notas.filter(x => x !== n); combo++; pts += 100 + Math.min(combo, 10) * 10; beep(500 + i * 120, .07); if (combo % 8 === 0 && g.msg_ok) cb.say(pick(g.msg_ok)); } else { M.mal(new THREE.Vector3(X[i], 1, 3), "MISS"); combo = 0; pts = Math.max(0, pts - 20); beep(120, .08); if (g.msg_ko) cb.say(pick(g.msg_ko)); } }
  const ui = M.ui(`<div class="c3d-flechas" style="gap:.3rem">${L.map((l, i) => `<button class="c3d-b" data-i="${i}" style="width:24%">${l}</button>`).join("")}</div>`);
  ui.querySelectorAll(".c3d-b").forEach(b => b.addEventListener("pointerdown", e => { e.preventDefault(); e.stopPropagation(); golpe(+b.dataset.i); }));
  const teclas = { ArrowLeft: 0, ArrowDown: 1, ArrowUp: 2, ArrowRight: 3, a: 0, s: 1, d: 2, f: 3 }; document.addEventListener("keydown", function k(e) { if (!M.vivo) return document.removeEventListener("keydown", k); if (e.key in teclas) { e.preventDefault(); golpe(teclas[e.key]); } });
  M.tick = dt => { t -= dt; cd -= dt; const v = 14 + (T - t) * .35;
    if (cd <= 0 && t > 1.5) { const i = Math.floor(Math.random() * 4), s = sprite(pick(N), 1.5); s.position.set(X[i], 1, -50); M.scene.add(s); notas.push({ i, s }); cd = Math.max(.32, .62 - (T - t) * .006); }
    notas.forEach(n => n.s.position.z += v * dt); const fuera = notas.filter(n => n.s.position.z > 6); if (fuera.length) { fuera.forEach(n => M.scene.remove(n.s)); notas = notas.filter(n => n.s.position.z <= 6); combo = 0; }
    cb.hud(`<span>⏱ ${Math.ceil(t)}s</span><span>Combo x${combo}</span><span>${Math.round(pts)} PTS</span>`); if (t <= 0) { M.tick = () => {}; cierra(M, cb, pts, "Se acabó el concierto."); } };
  cb.say(g.consigna || "Pulsa el carril cuando la nota cruce la línea amarilla");
}

/* ---------------- simon: four 3D pads ---------------- */
export function simon(cont, g, cb) {
  const M = mundo(cont, { suelo: 0x20232a, fog: 0x20232a }); M.cam.position.set(0, 7.5, 7.5); M.cam.lookAt(0, 0, 0); M.scene.background = new THREE.Color(0x20232a);
  const B = g.botones, R = g.rondas || 8, pads = []; B.forEach((b, i) => { const m = new THREE.MeshStandardMaterial({ color: new THREE.Color(b.c).multiplyScalar(.35), emissive: new THREE.Color(b.c), emissiveIntensity: 0, roughness: .35 });
    const p = new THREE.Mesh(new THREE.BoxGeometry(3, .9, 3), m); p.position.set((i % 2 ? 1 : -1) * 1.8, .45, (i < 2 ? -1 : 1) * 1.8); M.scene.add(p); const e = sprite(b.e, 1.3); e.position.set(0, 1.1, 0); p.add(e); p.userData = { i, c: b.c }; pads.push(p); });
  let seq = [], pos = 0, acepta = false, pts = 0; const luz = async i => { const p = pads[i]; p.material.emissiveIntensity = 1.6; p.position.y = .25; M.pum(p.position.clone().setY(1.3), new THREE.Color(p.userData.c).getHex(), ""); beep(300 + i * 140, .22); await new Promise(r => setTimeout(r, 380)); p.material.emissiveIntensity = 0; p.position.y = .45; await new Promise(r => setTimeout(r, 160)); };
  async function ronda() { if (!M.vivo) return; if (seq.length >= R) return cierra(M, cb, pts + 300, "¡Memoria de elefante vitoriano!"); seq.push(Math.floor(Math.random() * B.length)); acepta = false; pos = 0; cb.hud(`<span>Ronda ${seq.length}/${R}</span><span>${pts} PTS</span>`); cb.say(g.consigna_ver || "Mira la secuencia..."); await new Promise(r => setTimeout(r, 500)); for (const i of seq) await luz(i); cb.say(g.consigna || "¡Ahora tú!"); acepta = true; }
  M.taps.push(async moved => { if (!acepta || moved > 12) return; const h = M.pick(pads); if (!h) return; const i = h.object.userData.i; acepta = false; await luz(i); if (i !== seq[pos]) return cierra(M, cb, pts, g.msg_ko ? pick(g.msg_ko) : "Te has equivocado"); pos++; if (pos === seq.length) { pts += 100 * seq.length; cb.say(g.msg_ok ? pick(g.msg_ok) : "¡Bien!"); await new Promise(r => setTimeout(r, 700)); ronda(); } else acepta = true; });
  M.tick = (dt, t) => { M.cam.position.x = Math.sin(t * .3) * .8; M.cam.lookAt(0, 0, 0); }; ronda();
}

/* ---------------- timing: stop the sliding ball on the green zone ---------------- */
export function timing(cont, g, cb) {
  const M = mundo(cont, { suelo: 0x6b7a6a }); M.cam.position.set(0, 6, 8.5); M.cam.lookAt(0, 0, 0);
  const plat = new THREE.Mesh(new THREE.BoxGeometry(12, .5, 2.6), mat({ color: 0x555a66, roughness: .5 })); plat.position.y = -.25; M.scene.add(plat);
  const bola = new THREE.Mesh(new THREE.SphereGeometry(.55, 20, 14), mat({ color: 0xff2e93, roughness: .25, metalness: .2 })); bola.position.set(-5.5, .55, 0); M.scene.add(bola); const e = sprite(g.emoji || "🎯", 1.1); e.position.y = 1.2; bola.add(e);
  const zon = new THREE.Mesh(new THREE.BoxGeometry(1, .06, 2.4), new THREE.MeshBasicMaterial({ color: 0x39ff14 })); zon.position.y = .03; M.scene.add(zon);
  let r = 0, zona = g.zona || 34, ini = 0, x = -5.5, dir = 1, pts = 0, lock = false, vel = 5; const R = g.rondas || 5, W = 12;
  function ronda() { if (r >= R) return cierra(M, cb, pts, "Se acabó la serie."); const zw = Math.max(.9, zona / 100 * W); ini = -W / 2 + .6 + Math.random() * (W - zw - 1.2); zon.scale.x = zw; zon.position.x = ini + zw / 2; zon.userData.w = zw; x = -5.5; dir = 1; lock = false; bola.position.set(x, .55, 0); bola.visible = true; cb.say((g.consigna || "Para la bola en la zona verde") + ` (${r + 1}/${R})`); }
  function para() { if (lock || !M.vivo) return; lock = true; const c = zon.position.x, w = zon.userData.w, d = Math.abs(x - c), dentro = d <= w / 2, p = dentro ? Math.round(200 - d / (w / 2) * 100) : 0; pts += p; beep(dentro ? 700 : 140, .12);
    cb.say(dentro ? pick(g.msg_ok || ["¡Clavado!"]) : pick(g.msg_ko || ["Fuera..."])); if (dentro) { confetiSafe(); M.pum(bola.position.clone(), 0x39ff14, "+" + p, "#39ff14"); } else { bola.userData.cae = true; M.mal(bola.position.clone(), "¡FUERA!"); } r++; zona = Math.max(8, zona - 5); setTimeout(() => { bola.userData.cae = false; ronda(); }, 1000); }
  M.taps.push(para); const ui = M.ui('<div class="c3d-flechas"><button class="c3d-b" style="width:100%;font-size:1.2rem">⏹ PARA</button></div>'); ui.querySelector("button").addEventListener("pointerdown", e2 => { e2.preventDefault(); e2.stopPropagation(); para(); });
  document.addEventListener("keydown", function k(ev) { if (!M.vivo) return document.removeEventListener("keydown", k); if (ev.key === " ") { ev.preventDefault(); para(); } });
  M.tick = dt => { if (!lock) { x += dir * (vel + r * 1.4) * dt; if (x > 5.5) dir = -1; if (x < -5.5) dir = 1; bola.position.x = x; bola.rotation.z -= dir * dt * 5; } else if (bola.userData.cae) { bola.position.y -= 7 * dt; }
    cb.hud(`<span>Ronda ${Math.min(R, r + 1)}/${R}</span><span>${Math.round(pts)} PTS</span>`); }; ronda();
}

/* ---------------- aguanta: inflate the balloon, release inside the ring ---------------- */
export function aguanta(cont, g, cb) {
  const M = mundo(cont, { suelo: 0x7a7f88 }); M.cam.position.set(0, 3.2, 9); M.cam.lookAt(0, 2.4, 0);
  const globo = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 18), mat({ color: 0xff2e93, roughness: .2, metalness: .1 })); globo.position.y = 2; M.scene.add(globo);
  const anillo = new THREE.Mesh(new THREE.TorusGeometry(1, .06, 10, 40), new THREE.MeshBasicMaterial({ color: 0x39ff14 })); anillo.position.y = 2; M.scene.add(anillo);
  const R = g.rondas || 5; let r = 0, v = 0, sube = false, zl = 0, zw = 16, pts = 0, lock = false; const pal = document.createElement("div"); pal.className = "c3d-preg on"; pal.style.top = ".5rem"; pal.style.fontFamily = "Bangers,Impact,sans-serif"; pal.style.fontSize = "2rem"; const ui = M.ui('<div class="c3d-flechas"><button class="c3d-b" style="width:100%;font-size:1.1rem">🗣 MANTÉN Y SUELTA</button></div>'); ui.append(pal);
  const palabra = () => { const n = Math.floor(v / 5), P = (g.palabra || "Dios").toUpperCase(), V = "AEIOUÁÉÍÓÚ"; pal.textContent = [...P].map((c, k) => c.repeat(1 + Math.floor(n * (V.includes(c) ? .55 : k === P.length - 1 ? .2 : 0)))).join(""); };
  const esc = x => .8 + x / 100 * 2.6;
  function ronda() { if (r >= R) return cierra(M, cb, pts, "Voz de estadio."); v = 0; lock = false; zw = Math.max(8, 16 - r); zl = 25 + Math.random() * (70 - zw); anillo.scale.setScalar(esc(zl + zw / 2)); cb.say((g.consigna || "Estira hasta el anillo verde") + ` (${r + 1}/${R})`); palabra(); }
  const on = e => { e && e.preventDefault(); if (!M.vivo || lock) return; sube = true; };
  const off = () => { if (!sube || lock) return; sube = false; lock = true; const ok = v >= zl && v <= zl + zw, p = ok ? Math.round(250 - Math.abs(v - (zl + zw / 2)) / (zw / 2) * 120) : 0; pts += p; beep(ok ? 720 : 140, .15); cb.say(ok ? pick(g.msg_ok || ["¡Ese Dios sí que sí!"]) : pick(g.msg_ko || ["Se te cortó la voz"])); if (ok) { confetiSafe(); M.pum(globo.position.clone(), 0x39ff14, "+" + p, "#39ff14"); } else M.mal(globo.position.clone(), "¡SE CORTÓ!"); r++; setTimeout(ronda, 1000); };
  const b = ui.querySelector("button"); ["pointerdown"].forEach(ev => b.addEventListener(ev, e => { e.stopPropagation(); on(e); })); ["pointerup", "pointerleave", "pointercancel"].forEach(ev => b.addEventListener(ev, off));
  M.renderer.domElement.addEventListener("pointerdown", on); M.renderer.domElement.addEventListener("pointerup", off);
  M.tick = (dt, t) => { if (sube && !lock) { v = Math.min(100, v + 60 * dt * (1 + r * .12)); palabra(); } const s = esc(v); globo.scale.setScalar(s); globo.position.y = 1.2 + s * .8 + Math.sin(t * 6) * (sube ? .03 : 0); anillo.position.y = globo.position.y; cb.hud(`<span>Ronda ${Math.min(R, r + 1)}/${R}</span><span>${Math.round(pts)} PTS</span>`); }; ronda();
}
