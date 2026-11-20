/* Buxai en el recreo: a real fighting game. Side view, best of 3 rounds. Move, punch, kick, block, charge a special.
   Buxai taunts with absurd praise of Aznar, the PP and Vox; he sucker-punches you when you are winning. Teachers patrol and break up the fight between rounds. */
import { THREE, crearEscena } from "./escena.js";
import { humanoide, animar, reposo, patada, crearProfes, golpe } from "./figuras.js";
import { particulas, popup, flash, vibra } from "./juice.js";

const $ = id => document.getElementById(id), pick = a => a[Math.floor(Math.random() * a.length)];
const cont = $("lienzo3d"), msg = t => $("msg").textContent = t;
let S; try { S = crearEscena(cont); } catch (e) { cont.innerHTML = "<p style='padding:2rem'>Tu navegador no puede abrir el 3D.</p>"; throw e; }
const { renderer, escena, cam } = S, fx = particulas(escena);

const CHARLA = ["¡Con Aznar en el 96 sí que se vivía!", "Aznar es el mejor presidente de la historia. No admito debate.", "El PP lo arregla todo. Vox lo arregla con más ganas.", "Mi voto no se discute: se vota y se pega.", "¡Viva el bigote de Aznar, joder!",
  "Votad PP, votad Vox, votad a quien sea de derechas, pero votad.", "Abascal tiene barba y razón. En ese orden.", "Ayuso en la Moncloa y yo en la barra.", "España se rompe y yo te rompo a ti.", "¡Esto lo arregla un buen Consejo de Ministros y un derechazo!", "Con Aznar teníamos más de todo, hasta puñetazos."];
const AL_GOLPEAR = ["¡Esto es por España!", "¡Toma derechazo!", "¡Por Aznar!", "¡Y esto por el PP!"], AL_RECIBIR = ["¡Aznar nunca se queja!", "¡Eso es de rojos!", "¡Pega como un socialista!", "¡Ni Vox pega tan flojo!"];
const BOMBON = ["Eh... mira, te he traído bombones. Tregua.", "¿Un bombón? Mi padre siempre traía.", "Venga, un bombón y lo dejamos."];

const fig = (x, dir, o) => { const h = humanoide(escena, o); h.g.position.set(x, 0, 0); h.g.rotation.y = dir > 0 ? Math.PI / 2 : -Math.PI / 2; return { h, x, dir, hp: 100, esp: 0, st: "idle", ts: 0, dur: 0, hecho: false, tipo: "", bloq: 0, kd: 0 }; };
const yo = fig(-2, 1, { nombre: "TÚ (DUG)", colorNombre: "#00e5ff", jersey: "#e63946", pantalon: 0x222233, pelo: 0x1a1a1a, bota: 0x111111 });
const bx = fig(2, -1, { nombre: "BUXAI", colorNombre: "#ff2e93", jersey: "#10284f", pantalon: 0x10284f, calcetin: 0x10284f, ancho: 1.12, alto: 1.03, pelo: 0x2a1d12, bota: 0x111111 });
const caja = new THREE.Mesh(new THREE.BoxGeometry(.3, .12, .2), new THREE.MeshStandardMaterial({ color: 0x5b2a14 })); caja.position.set(0, -.34, .18); caja.visible = false; bx.h.cd.add(caja);
let profes = null; fetch("data/profesores.json").then(r => r.json()).then(d => { profes = crearProfes(escena, d.profesores, cont); }).catch(() => {});

const ui = document.createElement("div"); ui.className = "c3d-ui"; ui.innerHTML = `<div class="pelea-hud"><div><b>TÚ</b><div class="bar"><i id="phTu"></i></div><div class="bar esp"><i id="peTu"></i></div></div><div class="ronda" id="pRonda">ROUND 1</div><div><b>BUXAI</b><div class="bar mal"><i id="phBx"></i></div><div class="bar esp"><i id="peBx"></i></div></div></div><div class="globo3d" id="globo"></div>`; cont.append(ui);
const globo = $("globo"); let globoT = 0;
const dice = (t, s = 2.6) => { globo.textContent = t; globo.classList.add("on"); globoT = s; };

const K = { izq: false, der: false, bloq: false }; const P = { combo: 0, tCombo: 0, pts: 0, hits: 0, dmg: 0 };
const R = { shk: 0, n: 1, v: [0, 0], t: 60, activo: false, ko: 0, fin: false, hit: 0, slow: 1, bombon: false, traicion: false, tTaunt: 4 };
function ataca(f, tipo) { if (f.st !== "idle" && f.st !== "walk") return false; const d = { punch: .34, kick: .5, spec: .7 }[tipo]; f.st = "atk"; f.tipo = tipo; f.ts = 0; f.dur = d; f.hecho = false; return true; }
function daño(att, def, base, tipo) {
  if (def.st === "ko") return; const bloqueado = def.bloq > 0 && tipo !== "traicion"; const d = bloqueado ? Math.round(base * .2) : base; def.hp = Math.max(0, def.hp - d);
  att.esp = Math.min(100, att.esp + d * .9); def.esp = Math.min(100, def.esp + d * .5); R.hit = .07; fx.burst(new THREE.Vector3((att.x + def.x) / 2, 1.5, 0), bloqueado ? 0x00e5ff : 0xffe500, bloqueado ? 8 : 18, 6);
  if (!bloqueado) { def.st = "hit"; def.ts = 0; def.dur = tipo === "spec" ? .6 : .32; def.x += att.dir * (tipo === "kick" || tipo === "spec" ? .9 : .5); vibra(def === yo ? 70 : 20); }
  if (def === bx) { P.pts += d * 10; P.dmg += d; P.hits++; if (P.tCombo > 0) P.combo++; else P.combo = 1; P.tCombo = 1.2; popup(cont, P.combo >= 2 ? `COMBO x${P.combo}!` : (bloqueado ? "BLOQUEADO" : "¡PUM!"), P.combo >= 3 ? "#ff2e93" : "#ffe500", 62, 30); if (P.combo >= 2) P.pts += P.combo * 25; if (!bloqueado && Math.random() < .5) dice(pick(AL_RECIBIR)); }
  else { flash(cont, "#ff1e1e", 260); R.shk = .6; if (Math.random() < .55) dice(pick(AL_GOLPEAR)); }
  if (def.hp <= 0) kO(def);
}
function kO(def) { def.st = "ko"; def.ts = 0; R.activo = false; R.ko = 2.4; R.slow = .3; const gana = def === bx; R.v[gana ? 0 : 1]++; popup(cont, "¡K.O.!", "#ff3b30", 50, 40); sonido(90, .5); if (gana && window.confeti) confeti(); }
function nuevaRonda() {
  yo.hp = bx.hp = 100; yo.x = -2; bx.x = 2; yo.st = bx.st = "idle"; yo.esp *= .5; bx.esp *= .5; R.t = 60; R.slow = 1; R.traicion = false; R.ko = 0; R.tTaunt = 3; reposo(yo.h); reposo(bx.h); yo.h.g.rotation.z = bx.h.g.rotation.z = 0;
  popup(cont, `ROUND ${R.n}`, "#ffe500", 50, 35); setTimeout(() => { popup(cont, "¡FIGHT!", "#ff2e93", 50, 40); R.activo = true; sonido(520, .15); }, 900); $("pRonda").textContent = `ROUND ${R.n}  ${R.v[0]}-${R.v[1]}`;
}
function finPartida() {
  R.fin = true; $("start").disabled = false; $("start").textContent = "↻ Otra pelea"; const g = R.v[0] > R.v[1]; P.pts += g ? 800 + yo.hp * 6 : 0;
  msg(g ? "🏆 ¡HAS GANADO A BUXAI! Le dices que Aznar era un señor muy normal." : "💀 Buxai gana: «¡Votad PP!» y se va silbando."); if (g) { confeti(); if (window.insignia) insignia("gana-buxai", "Tumbaste a Buxai"); }
  panelRecord($("rec"), "recreo", P.pts, "Puntos de la pelea");
}

/* ---------- AI ---------- */
function ia(dt) {
  const d = Math.abs(bx.x - yo.x), dir = yo.x < bx.x ? -1 : 1; bx.dir = dir; bx.h.g.rotation.y = dir > 0 ? Math.PI / 2 : -Math.PI / 2;
  if (bx.st === "bombones") { bx.ts += dt; if (bx.ts > 2.4) { bx.st = "idle"; caja.visible = false; P.pts += 80; popup(cont, "Abrazo de reconciliación +80", "#39ff14", 50, 45); } return; }
  if (bx.st !== "idle" && bx.st !== "walk") return;
  bx.cdIA = (bx.cdIA || 0) - dt; const agr = .5 + R.n * .12;
  if (d > 1.55) { bx.x += dir * (1.8 + R.n * .35) * dt; bx.st = "walk"; if (bx.x > 5.2) bx.x = 5.2; return; } bx.st = "idle";
  if (bx.cdIA > 0) return; bx.cdIA = Math.max(.35, .9 - R.n * .12) / agr; const r = Math.random();
  if (!R.bombon && R.t < 45 && Math.random() < .004) { R.bombon = true; bx.st = "bombones"; bx.ts = 0; caja.visible = true; dice(pick(BOMBON), 2.4); return; }
  if (!R.traicion && yo.hp - bx.hp > 25 && Math.random() < .35) { R.traicion = true; dice("Perdona, un momento..."); ataca(bx, "kick"); bx.tipo = "traicion"; return; }
  if (bx.esp >= 100 && d < 2.2) { bx.esp = 0; dice("¡MITIN DE AZNAR!", 1.8); ataca(bx, "spec"); return; }
  if (r < .4) ataca(bx, "punch"); else if (r < .65) ataca(bx, "kick"); else if (r < .8) bx.bloq = .8; else if (r < .9) dice(pick(CHARLA));
}

/* ---------- loop ---------- */
function anim(f, t) {
  const h = f.h; reposo(h); h.g.position.x = f.x; const p = f.dur ? Math.min(1, f.ts / f.dur) : 0;
  if (f.st === "ko") { h.g.rotation.z = (f.dir > 0 ? 1 : -1) * -1.45 * Math.min(1, f.ts * 3); h.g.position.y = .15; return; }
  if (f.st === "hit") { h.torso.rotation.x = -.45; h.cab.rotation.x = -.5; h.bi.rotation.x = .5; h.bd.rotation.x = .5; return; }
  if (f.st === "atk") {
    if (f.tipo === "kick" || f.tipo === "traicion") patada(h, p); else if (f.tipo === "spec") { h.bd.rotation.x = -1.55; h.bi.rotation.x = -1.55; h.torso.rotation.x = .2 * Math.sin(p * Math.PI); h.g.position.y = Math.sin(p * Math.PI) * .25; }
    else { h.bd.rotation.x = -1.6 * Math.sin(p * Math.PI); h.ci.rotation.x = -.6; h.torso.rotation.y = .4 * Math.sin(p * Math.PI); h.bi.rotation.x = -.5; }
    return; }
  if (f.bloq > 0) { h.bi.rotation.x = h.bd.rotation.x = -1.3; h.ci.rotation.x = h.cd.rotation.x = -1.4; return; }
  if (f.st === "walk") { animar(h, "caminar", t, .9); h.bi.rotation.x = -.5; h.bd.rotation.x = -.5; return; }
  h.bi.rotation.x = -.6; h.bd.rotation.x = -.6; h.ci.rotation.x = -1.1; h.cd.rotation.x = -1.1; h.pi.rotation.x = -.15; h.pd.rotation.x = .2; h.ri.rotation.x = .3; h.rd.rotation.x = .3; h.torso.rotation.x = .08 + Math.sin(t * 5) * .02;
}
function actualiza(dtReal, t) {
  if (R.hit > 0) { R.hit -= dtReal; return; }
  const dt = dtReal * R.slow;
  for (const f of [yo, bx]) { f.ts += dt; f.bloq = Math.max(0, f.bloq - dt);
    if (f.st === "atk") { if (!f.hecho && f.ts >= f.dur * .45) { f.hecho = true; const rg = { punch: 1.7, kick: 2.1, spec: 2.6, traicion: 2.1 }[f.tipo] || 1.8; const rival = f === yo ? bx : yo; if (Math.abs(f.x - rival.x) <= rg && rival.st !== "ko") daño(f, rival, { punch: 8, kick: 13, spec: 28, traicion: 20 }[f.tipo] || 8, f.tipo === "traicion" ? "traicion" : f.tipo); } if (f.ts >= f.dur) f.st = "idle"; }
    if (f.st === "hit" && f.ts >= f.dur) f.st = "idle";
    if (f.st === "bombones" && f === yo) f.st = "idle"; }
  if (R.activo) {
    R.t -= dt; P.tCombo = Math.max(0, P.tCombo - dt); if (P.tCombo <= 0) P.combo = 0;
    if (yo.st === "idle" || yo.st === "walk") { yo.bloq = K.bloq ? .2 : yo.bloq; let m = (K.der ? 1 : 0) - (K.izq ? 1 : 0); if (m && !K.bloq) { yo.x = Math.max(-5.2, Math.min(bx.x - 1.05, yo.x + m * 3.4 * dt)); yo.st = "walk"; } else yo.st = "idle"; }
    ia(dt); yo.x = Math.max(-5.4, Math.min(5.4, yo.x)); bx.x = Math.max(yo.x + 1.05, Math.min(5.4, bx.x)); if (yo.x > bx.x - 1.05) yo.x = bx.x - 1.05;
    R.tTaunt -= dt; if (R.tTaunt <= 0 && bx.st === "idle") { R.tTaunt = 5 + Math.random() * 4; dice(pick(CHARLA)); }
    if (bx.hp > 0 && yo.hp > 0 && R.t <= 0) { const w = yo.hp >= bx.hp ? bx : yo; w.hp = 0; kO(w); }
  } else if (R.ko > 0) { R.ko -= dtReal; if (R.ko < 1.2) R.slow = 1; if (R.ko <= 0) { if (R.v[0] >= 2 || R.v[1] >= 2) finPartida(); else { R.n++; (async () => { if (profes) await profes.regano(cam); nuevaRonda(); })(); } R.ko = -1; } }
  globoT -= dtReal; if (globoT <= 0) globo.classList.remove("on");
}
const reloj = new THREE.Clock(); let shk = 0;
(function bucle() {
  requestAnimationFrame(bucle); const dt = Math.min(.1, reloj.getDelta()), t = reloj.elapsedTime; actualiza(dt, t); anim(yo, t); anim(bx, t + 1); fx.update(dt);
  if (profes) profes.update(dt, t); if (R.shk > 0) { shk = R.shk; R.shk -= dt * 2; } else shk = 0;
  const mx = (yo.x + bx.x) / 2; cam.position.set(mx * .6 + (Math.random() - .5) * .25 * shk, 2.1 + (Math.random() - .5) * .15 * shk, 7.4); cam.lookAt(mx * .6, 1.1, 0);
  $("phTu").style.width = yo.hp + "%"; $("phBx").style.width = bx.hp + "%"; $("peTu").style.width = yo.esp + "%"; $("peBx").style.width = bx.esp + "%"; $("pts").textContent = Math.round(P.pts) + " PTS";
  const v = new THREE.Vector3(bx.x, 2.9, 0).project(cam); globo.style.left = Math.max(18, Math.min(82, (v.x * .5 + .5) * 100)) + "%"; globo.style.top = Math.max(8, (-v.y * .5 + .5) * 100) + "%";
  renderer.render(escena, cam);
})();

/* ---------- input ---------- */
const mant = (id, k) => { const b = $(id); ["pointerdown"].forEach(e => b.addEventListener(e, ev => { ev.preventDefault(); K[k] = true; })); ["pointerup", "pointerleave", "pointercancel"].forEach(e => b.addEventListener(e, () => K[k] = false)); };
mant("bIzq", "izq"); mant("bDer", "der"); mant("bBloq", "bloq");
const accion = tipo => { if (!R.activo) return; if (tipo === "spec") { if (yo.esp >= 100 && ataca(yo, "spec")) { yo.esp = 0; popup(cont, "¡PATADA DE TEJEDOR!", "#ff2e93", 40, 35); } } else if (ataca(yo, tipo)) sonido(tipo === "kick" ? 200 : 300, .06); };
$("bPuno").addEventListener("pointerdown", e => { e.preventDefault(); accion("punch"); }); $("bPatada").addEventListener("pointerdown", e => { e.preventDefault(); accion("kick"); }); $("bEsp").addEventListener("pointerdown", e => { e.preventDefault(); accion("spec"); });
document.addEventListener("keydown", e => { if (e.repeat) return; const k = e.key.toLowerCase(); if (k === "arrowleft" || k === "a") K.izq = true; else if (k === "arrowright" || k === "d") K.der = true; else if (k === "l" || k === "shift") K.bloq = true; else if (k === "j" || k === " ") { e.preventDefault(); accion("punch"); } else if (k === "k") accion("kick"); else if (k === "e" || k === "enter") accion("spec"); });
document.addEventListener("keyup", e => { const k = e.key.toLowerCase(); if (k === "arrowleft" || k === "a") K.izq = false; else if (k === "arrowright" || k === "d") K.der = false; else if (k === "l" || k === "shift") K.bloq = false; });
$("start").onclick = () => { R.n = 1; R.v = [0, 0]; R.fin = false; R.bombon = false; P.pts = 0; P.dmg = 0; P.hits = 0; P.combo = 0; yo.esp = bx.esp = 0; $("rec").innerHTML = ""; $("start").disabled = true; msg("¡Pelea! Mueve, pega, patea, bloquea y carga tu especial."); nuevaRonda(); };
msg("Pulsa EMPEZAR. Mejor de 3 rounds contra Buxai.");
window.__pelea = { R, yo, bx, K, P, paso: dt => actualiza(dt, 0), accion };
