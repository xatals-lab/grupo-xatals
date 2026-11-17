/* Tejedor al fútbol 3D: penalty shootout in the concrete schoolyard of Santa María. You shoot 5, then you keep goal 5.
   Tejedor reads your shot 68% of the time and, when you are winning, comes and kicks you (red screen). Teachers patrol and scold. */
import { THREE, crearEscena, porteria, balon, TX } from "./escena.js";
import { humanoide, animar, reposo, patada, patadaFrontal, crearProfes, golpe } from "./figuras.js";

const $ = id => document.getElementById(id);
const msg = t => $("msg").textContent = t;
const tween = (ms, f) => new Promise(res => { const t0 = performance.now(); (function s(n) { const p = Math.min(1, (n - t0) / ms); f(p); p < 1 ? requestAnimationFrame(s) : res(); })(t0); });
const ease = p => p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / .75;
const pick = a => a[Math.floor(Math.random() * a.length)];

let S;
try { S = crearEscena($("lienzo3d")); } catch (e) { $("lienzo3d").innerHTML = "<p style='padding:2rem'>Tu navegador no puede abrir el 3D. Prueba con Chrome, Safari o Edge actualizados.</p>"; throw e; }
const { renderer, escena, cam } = S;
porteria(escena, -10, 1); porteria(escena, 10, -1);
const tej = humanoide(escena, { nombre: "TEJEDOR", camisa: TX.rayas("#0a4da2", "#ffffff"), pantalon: 0xffffff, calcetin: 0x0a4da2, guantes: true, pelo: 0x3a2a1c, bota: 0x111111, colorNombre: "#00e5ff" });
const bola = balon(escena);
const retic = new THREE.Mesh(new THREE.RingGeometry(.12, .17, 32), new THREE.MeshBasicMaterial({ color: 0xff2e93, transparent: true, opacity: .95, side: THREE.DoubleSide, depthTest: false }));
retic.renderOrder = 10; escena.add(retic); retic.visible = false;
const guantes = new THREE.Group(); cam.add(guantes);
for (const s of [-1, 1]) { const gl = new THREE.Mesh(new THREE.SphereGeometry(.09, 16, 12), new THREE.MeshStandardMaterial({ color: 0xffe500, roughness: .5 })); gl.position.set(s * .5, -.52, -1.0); guantes.add(gl); }
guantes.visible = false;
let profes = null;
fetch("data/profesores.json").then(r => r.json()).then(d => { profes = crearProfes(escena, d.profesores, $("arena3d")); }).catch(() => {});

const ST = { fase: "", ronda: 0, yo: 0, el: 0, pts: 0, aim: new THREE.Vector2(0, 1), apuntando: false, eleccion: null, modo: "guardar", hostias: 0, mareo: 0, shake: 0 };
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
function vistaTiro() { cam.position.set(0, 1.45, -.2); cam.lookAt(0, 1.0, -10); cam.rotation.z = 0; guantes.visible = false; bola.position.set(0, .11, -3); bola.rotation.set(0, 0, 0); tej.g.position.set(0, 0, -9.55); tej.g.rotation.set(0, 0, 0); reposo(tej); ST.modo = "guardar"; }
function vistaParada() { cam.position.set(0, 1.3, 10.55); cam.lookAt(0, 1.0, 3); cam.rotation.z = 0; guantes.visible = true; guantes.position.set(0, 0, 0); tej.g.position.set(0, 0, .6); tej.g.rotation.set(0, 0, 0); reposo(tej); ST.modo = "reposo"; bola.position.set(0, .11, 3); }
function enGol(e) { const r = renderer.domElement.getBoundingClientRect(); ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(ndc, cam); const t = new THREE.Vector3(); ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 0, 1), 10), t); return t; }

const cv = renderer.domElement; cv.style.touchAction = "none";
cv.addEventListener("pointerdown", e => { if (ST.fase === "apunta") { ST.apuntando = true; mueve(e); sonido(480, .05); } else if (ST.fase === "para") ST.x0 = e.clientX; });
cv.addEventListener("pointermove", e => { if (ST.fase === "apunta" && (ST.apuntando || e.pointerType === "mouse")) mueve(e); });
cv.addEventListener("pointerup", e => { if (ST.fase === "apunta" && ST.apuntando) { ST.apuntando = false; chuta(); } else if (ST.fase === "para" && ST.x0 != null) { const dx = e.clientX - ST.x0; ST.eleccion = dx < -30 ? 0 : dx > 30 ? 2 : 1; ST.x0 = null; } });
function mueve(e) { const p = enGol(e); ST.aim.set(Math.max(-2.1, Math.min(2.1, p.x)), Math.max(.05, Math.min(2.5, p.y))); }
[["b0", 0], ["b1", 1], ["b2", 2]].forEach(([id, k]) => $(id).onclick = () => { if (ST.fase === "para") ST.eleccion = k; });
document.addEventListener("keydown", e => { if (ST.fase === "para") { if (e.key === "ArrowLeft") ST.eleccion = 0; else if (e.key === "ArrowUp" || e.key === " ") ST.eleccion = 1; else if (e.key === "ArrowRight") ST.eleccion = 2; } else if (ST.fase === "apunta" && e.key === " ") { e.preventDefault(); chuta(); } });
$("tirar").onclick = () => { if (ST.fase === "apunta") chuta(); };

function marc() { $("marc").textContent = `TÚ ${ST.yo} - ${ST.el} TEJEDOR`; $("ronda").textContent = `Ronda ${Math.min(ST.ronda + 1, 5)}/5`; }
const HOSTIAS = ["TEJEDOR TE ACABA DE DAR UNA BUENA HOSTIA", "¡HOSTIA PUTA! TEJEDOR TE HA PEGADO UNA PATADA", "JODER, QUÉ PATADA: TEJEDOR TE HA REVENTADO LA ESPINILLA", "TEJEDOR TE HA PEGADO, CABRÓN. COMO SIEMPRE, AL FINAL"];
async function hostiaDeTejedor() {
  ST.hostias++; vistaTiro(); ST.fase = ""; retic.visible = false; $("tirar").style.display = "none"; msg("Tejedor ve que le estás ganando... y se acerca despacio.");
  await esperar(900); ST.modo = "correr"; await tween(1000, p => { tej.g.position.z = -9.55 + ease(p) * 8.4; });
  ST.modo = "patada"; await tween(420, p => { patadaFrontal(tej, p); });
  golpe(pick(HOSTIAS)); ST.shake = 1; ST.pts = Math.max(0, ST.pts - 60); ST.mareo = 2; cam.rotation.z = .12; sonido(70, .4);
  if (window.insignia) insignia("tejedor-pega", "Te pegó Tejedor (como siempre)");
  await esperar(1800); msg(pick(["Te has caído al suelo. Tejedor se va silbando. Cuarenta y uno y sin remordimientos.", "Quedas mareado: la puntería te tiembla dos rondas. Gracias, Tejedor.", "Tejedor: 'ha sido fútbol'. No, hijo de puta, ha sido una agresión."]));
  await esperar(1500); cam.rotation.z = 0; tej.g.position.z = -9.55; ST.modo = "guardar"; reposo(tej);
}
async function ronda() {
  marc(); if (profes) await profes.regano(cam);
  const ganando = ST.yo > ST.el;
  if (ST.ronda > 0 && ((ganando && Math.random() < .8) || (!ganando && Math.random() < .12) || (ST.yo >= 2 && ST.hostias === 0))) await hostiaDeTejedor();
  vistaTiro(); ST.fase = "apunta"; retic.visible = true; $("modo").textContent = "🎯 Arrastra para apuntar y suelta (o pulsa TIRAR)"; $("botonesP").style.display = "none"; $("tirar").style.display = ""; msg(ST.mareo ? "Estás mareado de la patada: la mira tiembla más." : "Apunta a las esquinas: ahí no llega. Pero se te puede ir fuera.");
}
async function chuta() {
  if (ST.fase !== "apunta") return; ST.fase = ""; retic.visible = false; $("tirar").style.display = "none";
  const sd = (.1 + ST.ronda * .055) * (ST.mareo ? 1.6 : 1), tx = ST.aim.x + gauss() * sd, ty = ST.aim.y + gauss() * sd; if (ST.mareo) ST.mareo--;
  const fuera = Math.abs(tx) > 1.55 || ty > 2.05 || ty < 0, poste = fuera && ((Math.abs(Math.abs(tx) - 1.5) < .12 && ty < 2) || (Math.abs(ty - 2) < .1 && Math.abs(tx) < 1.55));
  const tercio = tx < -.5 ? 0 : tx > .5 ? 2 : 1, lee = Math.random() < .68, kt = lee ? tercio : [0, 1, 2].filter(k => k !== tercio)[Math.floor(Math.random() * 2)];
  const parada = !fuera && kt === tercio && (ty < 1.5 || Math.random() < .3);
  sonido(260, .12);
  const p0 = bola.position.clone(), meta = new THREE.Vector3(tx, Math.max(.1, ty), -10 + (fuera ? -.2 : -.15)), dir = (kt - 1) * 1.0;
  ST.modo = "buceo";
  const portero = tween(420, p => { const q = ease(p); reposo(tej); tej.g.position.x = dir * q; tej.g.position.y = Math.sin(p * Math.PI) * (kt === 1 ? .35 : .25); tej.g.rotation.z = (kt === 1 ? 0 : -(kt - 1) * 1.25) * q;
    tej.bi.rotation.z = -1.2 * q - (kt - 1) * .3 * q; tej.bd.rotation.z = 1.2 * q - (kt - 1) * .3 * q; tej.bi.rotation.x = tej.bd.rotation.x = -.5 * q; tej.pi.rotation.x = -.4 * q; tej.pd.rotation.x = .3 * q; });
  await tween(520, p => { bola.position.lerpVectors(p0, meta, p); bola.position.y = p0.y + (meta.y - p0.y) * p + Math.sin(p * Math.PI) * .45; bola.rotation.x -= .4; });
  await portero;
  if (parada) { sonido(140, .2); msg(pick(["🧤 Tejedor la para y te mira con cara de 20 años. Hijo de puta.", "🧤 Paradón. 'Eso es fútbol', dice el cabrón.", "🧤 Parada. Se oye 'Diiiios' desde el fondo."])); await tween(500, p => { bola.position.z = -10 + p * 3; bola.position.y = .11 + Math.sin(p * Math.PI) * .5; }); }
  else if (fuera) { sonido(120, .25); msg(poste ? "💥 ¡AL POSTE! Se oye hasta en Mendizorroza." : pick(["🚀 Fuera. Joder, al segundo patio, junto al Bacterio, que ya se ríe.", "🚀 Fuera, manco. Ai ama!"])); await tween(450, p => { bola.position.z = -10 - p * 4; bola.position.y = meta.y + p * 1.5; }); }
  else { sonido(820, .25); confeti(); ST.yo++; ST.pts += 200 + (ty > 1.5 && Math.abs(tx) > 1 ? 100 : 0); ST.modo = "derrota"; msg(pick(["⚽ ¡GOOOL! Tejedor no se lo cree, el muy cabrón.", "⚽ ¡Gol! Tejedor acaba pateando la valla. Cuarenta y uno y sin paciencia.", "⚽ ¡Golazo! Hasta la torre con la cruz se emociona."])); await tween(450, p => { bola.position.z = -10 - p * .6; bola.position.y = Math.max(.11, meta.y * (1 - p)); }); }
  marc(); await esperar(1100); await turnoParada();
}
async function turnoParada() {
  if (profes) await profes.regano(cam);
  vistaParada(); ST.fase = "para"; ST.eleccion = null; $("modo").textContent = "🧤 ¡Eres el portero! Desliza o pulsa ⬅ ⬆ ➡ antes de que chute"; $("botonesP").style.display = ""; msg("Tejedor se coloca el balón... elige lado");
  const t0 = performance.now(); while (ST.eleccion == null && performance.now() - t0 < 2800) await esperar(30);
  const el = ST.eleccion ?? 1; ST.fase = ""; $("botonesP").style.display = "none";
  const tercio = [0, 0, 1, 2, 2, 0, 2, 1][Math.floor(Math.random() * 8)], alto = Math.random() < .3;
  const meta = new THREE.Vector3((tercio - 1) * 1.15, alto ? 1.75 : .6 + Math.random() * .6, 10), p0 = bola.position.clone();
  ST.modo = "correr"; await tween(650, p => { tej.g.position.z = .6 + ease(p) * 1.9; });
  ST.modo = "patada"; const kick = tween(480, p => { patada(tej, p); });
  await esperar(230); sonido(260, .1);
  const dive = tween(420, p => { const q = ease(p), dx = (el - 1) * 1.0; cam.position.x = dx * q; guantes.position.set(0, .1 * Math.sin(p * Math.PI), 0); cam.rotation.z = -(el - 1) * .22 * q; });
  await tween(480, p => { bola.position.lerpVectors(p0, meta, p); bola.position.y = p0.y + (meta.y - p0.y) * p + Math.sin(p * Math.PI) * .3; bola.rotation.x += .35; });
  await Promise.all([dive, kick]);
  const para = el === tercio && (!alto || Math.random() < .7);
  if (para) { ST.pts += 150; sonido(700, .2); confeti(); ST.modo = "derrota"; msg(pick(["🧤 ¡PARADÓN! Tejedor se agarra la cabeza.", "🧤 ¡Paradón! 'Ha sido suerte', dice el cabrón.", "🧤 ¡Parada! Ya eres leyenda de Marianistas."])); await tween(400, p => { bola.position.z = 10 - p * 1.8; bola.position.y = .5 + Math.sin(p * Math.PI) * .6; }); }
  else { ST.el++; sonido(150, .25); ST.modo = "festejo"; msg(pick(["💥 Tejedor te la mete y celebra a patadas, hijo de puta.", "💥 Gol de Tejedor. Se queja del cemento, el muy quejica.", "💥 Gol. Y encima dice 'ha sido fútbol'."])); await tween(400, p => { bola.position.z = 10 + p * .7; }); }
  cam.position.x = 0; cam.rotation.z = 0; marc(); await esperar(1300); ST.modo = "reposo";
  ST.ronda++; const quedan = 5 - ST.ronda;
  if (ST.ronda >= 5 || ST.yo - ST.el > quedan || ST.el - ST.yo > quedan) return fin();
  ronda();
}
function fin() {
  ST.fase = ""; vistaTiro(); $("botonesP").style.display = "none"; $("tirar").style.display = "none"; $("start").disabled = false; $("start").textContent = "↻ Otra tanda";
  const g = ST.yo > ST.el; ST.pts += g ? 500 : ST.yo === ST.el ? 150 : 0; if (g) { confeti(); if (window.insignia) insignia("gana-tejedor", "Has ganado a Tejedor (y has sobrevivido)"); }
  msg(g ? "🏆 ¡HAS GANADO A TEJEDOR! Eres leyenda en Marianistas." : ST.yo === ST.el ? "🤝 Empate. Tejedor acaba la tanda a patadas igualmente." : "😭 Pierdes. Tejedor se va a calentar, claro.");
  $("modo").textContent = ""; panelRecord($("rec"), "futbol", ST.pts, "Puntos del partido");
}
$("start").onclick = () => { ST.ronda = 0; ST.yo = 0; ST.el = 0; ST.pts = 0; ST.hostias = 0; ST.mareo = 0; $("rec").innerHTML = ""; $("start").disabled = true; ronda(); };

const reloj = new THREE.Clock(); let tPrev = 0;
(function bucle() {
  requestAnimationFrame(bucle); const t = reloj.getElapsedTime(), dt = Math.min(.05, t - tPrev); tPrev = t;
  if (retic.visible) { const w = (.08 + ST.ronda * .025) * (ST.mareo ? 2 : 1); retic.position.set(ST.aim.x + Math.sin(t * 2.3) * w, ST.aim.y + Math.cos(t * 1.9) * w, -9.9); retic.scale.setScalar(1 + Math.sin(t * 6) * .06); }
  if (ST.modo === "guardar") { animar(tej, "guardar", t); tej.g.position.x = Math.sin(t * 1.4) * .25; }
  else if (ST.modo === "reposo") animar(tej, "reposo", t); else if (ST.modo === "correr") animar(tej, "correr", t, 1.3); else if (ST.modo === "festejo") animar(tej, "festejo", t); else if (ST.modo === "derrota") animar(tej, "derrota", t);
  if (ST.shake > 0) { cam.position.x += (Math.random() - .5) * .25 * ST.shake; cam.position.y = 1.45 + (Math.random() - .5) * .2 * ST.shake; ST.shake -= dt * 1.6; if (ST.shake <= 0) { ST.shake = 0; cam.position.set(0, 1.45, -.2); } }
  if (profes) profes.update(dt, t);
  renderer.render(escena, cam);
})();
vistaTiro(); msg("Pulsa EMPEZAR. Tejedor te espera en el patio. Y los profes vigilan.");
window.__xatals = { ST, hostiaDeTejedor, turnoParada, ronda, get profes() { return profes; } };
