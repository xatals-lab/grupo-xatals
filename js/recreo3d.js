/* Buxai en el recreo 3D: dodge the punch he telegraphs, hit him while he is open, ignore the chocolates. When you are winning he sucker-punches you. */
import { THREE, crearEscena, TX } from "./escena.js";
import { humanoide, animar, reposo, golpe, crearProfes } from "./figuras.js";

const $ = id => document.getElementById(id);
const pick = a => a[Math.floor(Math.random() * a.length)];
const tween = (ms, f) => new Promise(res => { const t0 = performance.now(); (function s(n) { const p = Math.min(1, (n - t0) / ms); f(p); p < 1 ? requestAnimationFrame(s) : res(); })(t0); });
const msg = t => $("msg").textContent = t;
let S;
try { S = crearEscena($("lienzo3d")); } catch (e) { $("lienzo3d").innerHTML = "<p style='padding:2rem'>Tu navegador no puede abrir el 3D.</p>"; throw e; }
const { renderer, escena, cam } = S;
const bx = humanoide(escena, { camisa: null, jersey: "#10284f", pantalon: 0x10284f, calcetin: 0x10284f, ancho: 1.12, alto: 1.03, nombre: "BUXAI", colorNombre: "#ff2e93", pelo: 0x2a1d12, bota: 0x111111 });
bx.g.position.set(0, 0, -2.2);
const caja = new THREE.Group(); const cb = new THREE.Mesh(new THREE.BoxGeometry(.3, .12, .2), new THREE.MeshStandardMaterial({ color: 0x5b2a14 })); caja.add(cb); const lazo = new THREE.Mesh(new THREE.BoxGeometry(.04, .13, .21), new THREE.MeshStandardMaterial({ color: 0xff2e93 })); caja.add(lazo); caja.position.set(0, -.34, .18); caja.visible = false; bx.cd.add(caja);
const manos = new THREE.Group(); cam.add(manos); const guantes = [];
for (const s of [-1, 1]) { const f = new THREE.Mesh(new THREE.SphereGeometry(.12, 16, 12), new THREE.MeshStandardMaterial({ color: 0xd62828, roughness: .5 })); f.position.set(s * .42, -.4, -.8); manos.add(f); guantes.push(f); }
let profes = null; fetch("data/profesores.json").then(r => r.json()).then(d => { profes = crearProfes(escena, d.profesores, $("arena3d")); }).catch(() => {});
let hpTu = 100, hpBx = 100, pts = 0, vivo = false, esquiva = null, abierto = false, golpeado = false, fase = "", camX = 0, shake = 0, modo = "guardia";
const pinta = () => { $("hpTu").style.width = hpTu + "%"; $("hpBx").style.width = hpBx + "%"; $("pts").textContent = pts + " PTS"; };
function entrada(dir) { if (!vivo) return; if (fase === "aviso") esquiva = dir; else if (fase === "bombon") esquiva = "mal"; }
async function pega() {
  if (!vivo) return; if (fase === "bombon") { esquiva = "mal"; return; }
  if (abierto && !golpeado) { golpeado = true; hpBx = Math.max(0, hpBx - 14); pts += 100; sonido(220, .1); msg(pick(["💥 ¡TOMA, HIJO DE PUTA!", "💥 ¡Dale que es de Ryanair!", "💥 ¡Ostia, qué hostia!"])); shake = .5;
    guantes[1].position.z = -1.5; setTimeout(() => guantes[1].position.z = -.8, 160); modo = "golpeado"; setTimeout(() => modo = "guardia", 600); pinta(); }
  else if (!abierto) { hpTu = Math.max(0, hpTu - 4); pts = Math.max(0, pts - 20); msg("Has pegado al aire, gilipollas."); guantes[0].position.z = -1.4; setTimeout(() => guantes[0].position.z = -.8, 160); pinta(); }
}
const HOSTIAS = ["BUXAI TE ACABA DE PARTIR LA CARA", "¡HOSTIA PUTA! BUXAI TE HA ZURRADO COMO A TODA LA CLASE", "JODER, BUXAI TE HA PEGADO UN PUÑETAZO AL FINAL, COMO SIEMPRE"];
async function ronda(n) {
  if (profes && fase === "") await profes.regano(cam);
  const dif = Math.max(380, 900 - n * 40); reposo(bx); modo = "guardia"; abierto = false;
  const ganando = hpBx < hpTu - 15;
  if (n > 2 && ((ganando && Math.random() < .35) || Math.random() < .05)) {            // sucker punch: the more you win, the more he hits
    fase = "traicion"; msg("Buxai ve que va perdiendo... y te mira muy raro."); await tween(900, p => { bx.g.position.z = -2.2 + p * 1.2; animar(bx, "correr", p * 10, 1.2); });
    await tween(300, p => { bx.bd.rotation.x = -1.7 * p; bx.cd.rotation.x = -.4; });
    hpTu = Math.max(0, hpTu - 22); pts = Math.max(0, pts - 60); golpe(pick(HOSTIAS)); shake = 1; if (window.insignia) insignia("buxai-pega", "Te pegó Buxai (como a toda la clase)"); pinta();
    await new Promise(r => setTimeout(r, 1700)); bx.g.position.z = -2.2; reposo(bx); fase = ""; return; }
  if (Math.random() < .15) {
    fase = "bombon"; esquiva = null; caja.visible = true; msg("🍫 ¡Buxai saca bombones! NO TOQUES NADA"); await new Promise(r => setTimeout(r, 1300)); caja.visible = false;
    if (esquiva === "mal") { hpTu = Math.max(0, hpTu - 12); msg("Era un truco, cabrón. ¡Pum!"); shake = .6; } else { pts += 80; msg("Te emocionas y os abrazáis. +80"); }
    fase = ""; pinta(); await new Promise(r => setTimeout(r, 700)); return; }
  const dir = Math.random() < .5 ? "izq" : "der"; esquiva = null; fase = "aviso";
  msg("¡VIENE! Esquiva " + (dir === "izq" ? "⬅ IZQUIERDA" : "DERECHA ➡")); const lado = dir === "izq" ? -1 : 1;
  await tween(dif + 250, p => { bx.torso.rotation.y = -lado * .5 * p; (lado < 0 ? bx.bi : bx.bd).rotation.x = .9 * p; (lado < 0 ? bx.ci : bx.cd).rotation.x = -1.1 * p; });
  fase = "golpe"; await tween(160, p => { (lado < 0 ? bx.bi : bx.bd).rotation.x = .9 - 2.6 * p; });
  if (esquiva === dir) { pts += 50; msg("Esquivado. ¡Ahora PEGA!"); abierto = true; golpeado = false; modo = "abierto"; pinta(); await new Promise(r => setTimeout(r, Math.max(500, 900 - n * 25))); abierto = false; modo = "guardia"; }
  else { hpTu = Math.max(0, hpTu - 16); msg(pick(["¡Te ha dado! Qué mano tiene el hijo de puta.", "¡Zas! En toda la cara.", "¡Ay! Te ha dado, blando."])); shake = .6; pinta(); await new Promise(r => setTimeout(r, 600)); }
  reposo(bx); fase = "";
}
async function juego() {
  hpTu = 100; hpBx = 100; pts = 0; vivo = true; pinta(); $("rec").innerHTML = ""; $("start").disabled = true; let n = 0;
  while (vivo && hpTu > 0 && hpBx > 0 && n < 30) await ronda(n++);
  vivo = false; fase = ""; $("start").disabled = false; const gana = hpBx <= 0; if (gana) pts += hpTu * 5; pinta();
  msg(gana ? "🏆 ¡Has tumbado a Buxai! Te pide que no cuentes nada en Ryanair." : hpTu <= 0 ? "💀 Buxai te deja en la arboleda... que ni existe. Con bombones." : "Se acaba el recreo. Empate sudoroso."); if (gana) { confeti(); if (window.insignia) insignia("gana-buxai", "Tumbaste a Buxai"); }
  panelRecord($("rec"), "recreo", pts, "Puntos del recreo");
}
$("start").onclick = juego; $("izq").onclick = () => entrada("izq"); $("der").onclick = () => entrada("der"); $("pega").onclick = pega;
document.addEventListener("keydown", e => { if (e.key === "ArrowLeft") entrada("izq"); else if (e.key === "ArrowRight") entrada("der"); else if (e.key === " ") { e.preventDefault(); pega(); } });
let sx = null; renderer.domElement.style.touchAction = "none"; renderer.domElement.addEventListener("pointerdown", e => sx = e.clientX); renderer.domElement.addEventListener("pointerup", e => { if (sx == null) return; const dx = e.clientX - sx; if (Math.abs(dx) > 30) entrada(dx < 0 ? "izq" : "der"); else pega(); sx = null; });
const reloj = new THREE.Clock(); let tp = 0;
(function bucle() { requestAnimationFrame(bucle); const t = reloj.getElapsedTime(), dt = Math.min(.05, t - tp); tp = t;
  const objX = (fase === "golpe" && esquiva) ? (esquiva === "izq" ? .8 : -.8) : 0; camX += (objX - camX) * Math.min(1, dt * 10);
  cam.position.set(camX + (shake > 0 ? (Math.random() - .5) * .2 * shake : 0), 1.55 + (shake > 0 ? (Math.random() - .5) * .12 * shake : 0), 1.6); cam.lookAt(0, 1.45, -2.2); if (shake > 0) shake -= dt * 1.8;
  if (modo === "guardia" && fase !== "aviso" && fase !== "golpe" && fase !== "traicion") animar(bx, "reposo", t); else if (modo === "abierto") { reposo(bx); bx.torso.rotation.x = -.35; bx.cab.rotation.x = -.3; } else if (modo === "golpeado") { bx.g.rotation.x = -.15; }
  if (profes) profes.update(dt, t); renderer.render(escena, cam); })();
msg("Pulsa EMPEZAR. Los profes vigilan: si montáis bronca, os la echan.");
