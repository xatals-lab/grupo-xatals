/* Tejedor al fútbol 3D: penalty shootout in the concrete schoolyard. You shoot 5 (aim with finger/mouse, release to kick), then you keep goal 5.
   Tejedor reads your shot 68% of the time. Top corners beat him but are easy to miss. */
import { THREE, crearEscena, porteria, humanoide, balon, TX } from "./escena.js";

const $ = id => document.getElementById(id);
const msg = t => $("msg").textContent = t;
const tween = (ms, f) => new Promise(res => { const t0 = performance.now(); (function s(n) { const p = Math.min(1, (n - t0) / ms); f(p); p < 1 ? requestAnimationFrame(s) : res(); })(t0); });
const ease = p => p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / .75;

let S;
try { S = crearEscena($("lienzo3d")); } catch (e) { $("lienzo3d").innerHTML = "<p style='padding:2rem'>Tu navegador no puede abrir el 3D. Prueba con Chrome, Safari o Edge actualizados.</p>"; throw e; }
const { renderer, escena, cam } = S;
const pA = porteria(escena, -10, 1), pB = porteria(escena, 10, -1);
const tejedor = humanoide(escena, { nombre: "TEJEDOR", camisa: TX.rayas("#0a4da2", "#ffffff"), guantes: true, pelo: 0x3a2a1c });
const yo = humanoide(escena, { nombre: "TÚ", camisa: TX.rayas("#e63946", "#e63946"), pelo: 0x1a1a1a });
const bola = balon(escena);
const retic = new THREE.Mesh(new THREE.RingGeometry(.12, .17, 32), new THREE.MeshBasicMaterial({ color: 0xff2e93, transparent: true, opacity: .95, side: THREE.DoubleSide, depthTest: false }));
retic.renderOrder = 10; escena.add(retic); retic.visible = false;
const guantes = new THREE.Group(); cam.add(guantes);
for (const s of [-1, 1]) { const gl = new THREE.Mesh(new THREE.SphereGeometry(.09, 16, 12), new THREE.MeshStandardMaterial({ color: 0xffe500, roughness: .5 })); gl.position.set(s * .5, -.52, -1.0); guantes.add(gl); }
guantes.visible = false;

const ST = { fase: "", ronda: 0, yo: 0, el: 0, pts: 0, aim: new THREE.Vector2(0, 1), apuntando: false, t: 0, eleccion: null };
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
function vistaTiro() { cam.position.set(0, 1.45, -.2); cam.lookAt(0, 1.0, -10); cam.rotation.z = 0; guantes.visible = false; yo.g.visible = false; bola.position.set(0, .11, -3); bola.rotation.set(0, 0, 0); tejedor.g.visible = true; tejedor.g.position.set(0, 0, -9.55); tejedor.g.rotation.set(0, 0, 0); tejedor.g.rotation.y = 0; tejedor.bi.rotation.set(0, 0, 0); tejedor.bd.rotation.set(0, 0, 0); tejedor.g.scale.set(1, 1, 1); }
function vistaParada() { cam.position.set(0, 1.3, 10.55); cam.lookAt(0, 1.0, 3); cam.rotation.z = 0; guantes.visible = true; guantes.position.set(0, 0, 0); tejedor.g.visible = true; tejedor.g.position.set(0, 0, 1.2); tejedor.g.rotation.set(0, 0, 0); tejedor.g.scale.set(1, 1, 1); tejedor.bi.rotation.set(0, 0, 0); tejedor.bd.rotation.set(0, 0, 0); tejedor.pi.rotation.set(0, 0, 0); tejedor.pd.rotation.set(0, 0, 0); bola.position.set(0, .11, 3); }
function enGol(e) { const r = renderer.domElement.getBoundingClientRect(); ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(ndc, cam); const t = new THREE.Vector3(); ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 0, 1), 10), t); return t; }

/* ---------- input ---------- */
const cv = renderer.domElement; cv.style.touchAction = "none";
cv.addEventListener("pointerdown", e => { if (ST.fase === "apunta") { ST.apuntando = true; mueve(e); sonido(480, .05); } else if (ST.fase === "para") ST.x0 = e.clientX; });
cv.addEventListener("pointermove", e => { if (ST.fase === "apunta" && (ST.apuntando || e.pointerType === "mouse")) mueve(e); });
cv.addEventListener("pointerup", e => { if (ST.fase === "apunta" && ST.apuntando) { ST.apuntando = false; chuta(); } else if (ST.fase === "para" && ST.x0 != null) { const dx = e.clientX - ST.x0; ST.eleccion = dx < -30 ? 0 : dx > 30 ? 2 : 1; ST.x0 = null; } });
function mueve(e) { const p = enGol(e); ST.aim.set(Math.max(-2.1, Math.min(2.1, p.x)), Math.max(.05, Math.min(2.5, p.y))); }
[["b0", 0], ["b1", 1], ["b2", 2]].forEach(([id, k]) => $(id).onclick = () => { if (ST.fase === "para") ST.eleccion = k; });
document.addEventListener("keydown", e => { if (ST.fase === "para") { if (e.key === "ArrowLeft") ST.eleccion = 0; else if (e.key === "ArrowUp" || e.key === " ") ST.eleccion = 1; else if (e.key === "ArrowRight") ST.eleccion = 2; } else if (ST.fase === "apunta" && e.key === " ") { e.preventDefault(); chuta(); } });
$("tirar").onclick = () => { if (ST.fase === "apunta") chuta(); };

/* ---------- game ---------- */
function marc() { $("marc").textContent = `TÚ ${ST.yo} - ${ST.el} TEJEDOR`; $("ronda").textContent = `Ronda ${Math.min(ST.ronda + 1, 5)}/5`; }
async function ronda() {
  marc(); vistaTiro(); ST.fase = "apunta"; retic.visible = true; $("modo").textContent = "🎯 Arrastra para apuntar y suelta (o pulsa TIRAR)"; $("botonesP").style.display = "none"; $("tirar").style.display = ""; msg("Apunta a las esquinas: ahí no llega. Pero se te puede ir fuera.");
}
async function chuta() {
  if (ST.fase !== "apunta") return; ST.fase = ""; retic.visible = false; $("tirar").style.display = "none";
  const sd = .1 + ST.ronda * .055, tx = ST.aim.x + gauss() * sd, ty = ST.aim.y + gauss() * sd;
  const fuera = Math.abs(tx) > 1.55 || ty > 2.05 || ty < 0, poste = !fuera ? false : (Math.abs(Math.abs(tx) - 1.5) < .12 && ty < 2) || (Math.abs(ty - 2) < .1 && Math.abs(tx) < 1.55);
  const tercio = tx < -.5 ? 0 : tx > .5 ? 2 : 1, lee = Math.random() < .68, kt = lee ? tercio : [0, 1, 2].filter(k => k !== tercio)[Math.floor(Math.random() * 2)];
  const parada = !fuera && kt === tercio && (ty < 1.5 || Math.random() < .3);
  // run-up and kick
  await tween(320, p => { tejedor.pi.rotation.x = 0; yo.g.visible = false; bola.rotation.x += .1; });
  sonido(260, .12);
  const dir = (kt - 1) * 1.0, p0 = bola.position.clone(), fin = new THREE.Vector3(tx, Math.max(.1, ty), -10 + (fuera ? -.2 : -.15));
  const keeper = tween(380, p => { const q = ease(p); tejedor.g.position.x = dir * q; tejedor.g.position.y = kt === 1 ? Math.sin(p * Math.PI) * .35 : Math.sin(p * Math.PI) * .25; tejedor.g.rotation.z = (kt === 1 ? 0 : -(kt - 1) * 1.25) * q; tejedor.bi.rotation.z = tejedor.bd.rotation.z = (kt - 1) * -.2 * q; tejedor.bi.rotation.x = tejedor.bd.rotation.x = Math.PI * .9 * q; });
  await tween(520, p => { bola.position.lerpVectors(p0, fin, p); bola.position.y = p0.y + (fin.y - p0.y) * p + Math.sin(p * Math.PI) * .45; bola.rotation.x -= .4; });
  await keeper;
  if (parada) { sonido(140, .2); msg(["🧤 Tejedor la para y te mira con cara de 20 años.", "🧤 Paradón. 'Eso es fútbol', dice.", "🧤 Parada. Se oye 'Diiiios' desde el fondo."][Math.floor(Math.random() * 3)]); await tween(500, p => { bola.position.z = -10 + p * 3; bola.position.y = .11 + Math.sin(p * Math.PI) * .5; }); }
  else if (fuera) { sonido(120, .25); msg(poste ? "💥 ¡AL POSTE! Se oye hasta en Mendizorroza." : "🚀 Fuera. Al segundo patio, junto al Bacterio."); await tween(450, p => { bola.position.z = -10 - p * 4; bola.position.y = fin.y + p * 1.5; }); }
  else { sonido(820, .25); confeti(); ST.yo++; ST.pts += 200 + (ty > 1.5 && Math.abs(tx) > 1 ? 100 : 0); msg(["⚽ ¡GOOOL! Tejedor no se lo cree.", "⚽ ¡Gol! Tejedor acaba pateando la valla.", "⚽ ¡Golazo! Hasta la torre con la cruz se emociona."][Math.floor(Math.random() * 3)]); await tween(450, p => { bola.position.z = -10 - p * .6; bola.position.y = Math.max(.11, fin.y * (1 - p)); }); }
  marc(); await esperar(1100); await turnoParada();
}
async function turnoParada() {
  vistaParada(); ST.fase = "para"; ST.eleccion = null; $("modo").textContent = "🧤 ¡Eres el portero! Desliza o pulsa ⬅ ⬆ ➡ antes de que chute"; $("botonesP").style.display = ""; msg("Tejedor se coloca el balón... elige lado");
  const t0 = performance.now(); while (ST.eleccion == null && performance.now() - t0 < 2800) await esperar(30);
  const el = ST.eleccion ?? 1; ST.fase = ""; $("botonesP").style.display = "none";
  const tercio = [0, 0, 1, 2, 2, 0, 2, 1][Math.floor(Math.random() * 8)], alto = Math.random() < .3;
  const fin = new THREE.Vector3((tercio - 1) * 1.15, alto ? 1.75 : .6 + Math.random() * .6, 10);
  const p0 = bola.position.clone();
  await tween(500, p => { tejedor.g.position.z = 1.2 + p * 1.5; tejedor.pi.rotation.x = Math.sin(p * Math.PI * 2) * .9; tejedor.pd.rotation.x = -Math.sin(p * Math.PI * 2) * .9; });
  tejedor.pd.rotation.x = -1.2; sonido(260, .1);
  const dive = tween(420, p => { const q = ease(p), dx = (el - 1) * 1.0; cam.position.x = dx * q; guantes.position.set(0, .1 * Math.sin(p * Math.PI), 0); cam.rotation.z = -(el - 1) * .22 * q; if (el !== 1) cam.rotation.z += 0; });
  await tween(480, p => { bola.position.lerpVectors(p0, fin, p); bola.position.y = p0.y + (fin.y - p0.y) * p + Math.sin(p * Math.PI) * .3; bola.rotation.x += .35; });
  await dive;
  const para = el === tercio && (!alto || Math.random() < .7);
  if (para) { ST.pts += 150; sonido(700, .2); confeti(); msg(["🧤 ¡PARADÓN! Tejedor se agarra la cabeza.", "🧤 ¡Paradón! 'Ha sido un golpe de suerte', dice.", "🧤 ¡Parada! Ya eres leyenda de Marianistas."][Math.floor(Math.random() * 3)]); await tween(400, p => { bola.position.z = 10 - p * 1.8; bola.position.y = .5 + Math.sin(p * Math.PI) * .6; }); }
  else { ST.el++; sonido(150, .25); msg(["💥 Tejedor te la mete y celebra a patadas.", "💥 Gol de Tejedor. Se queja del césped de cemento.", "💥 Gol. Y encima dice 'ha sido fútbol'."][Math.floor(Math.random() * 3)]); await tween(400, p => { bola.position.z = 10 + p * .7; }); }
  cam.position.x = 0; cam.rotation.z = 0; marc(); await esperar(1200);
  ST.ronda++; const quedan = 5 - ST.ronda;
  if (ST.ronda >= 5 || ST.yo - ST.el > quedan || ST.el - ST.yo > quedan) return fin();
  ronda();
}
function fin() {
  ST.fase = ""; vistaTiro(); $("botonesP").style.display = "none"; $("tirar").style.display = "none"; $("start").disabled = false; $("start").textContent = "↻ Otra tanda";
  const g = ST.yo > ST.el; ST.pts += g ? 500 : ST.yo === ST.el ? 150 : 0; if (g) confeti();
  msg(g ? "🏆 ¡HAS GANADO A TEJEDOR! Eres leyenda en Marianistas." : ST.yo === ST.el ? "🤝 Empate. Tejedor acaba la tanda a patadas igualmente." : "😭 Pierdes. Tejedor se va a calentar, claro.");
  $("modo").textContent = ""; panelRecord($("rec"), "futbol", ST.pts, "Puntos del partido");
}
$("start").onclick = () => { ST.ronda = 0; ST.yo = 0; ST.el = 0; ST.pts = 0; $("rec").innerHTML = ""; $("start").disabled = true; ronda(); };

/* ---------- render loop ---------- */
const reloj = new THREE.Clock();
(function bucle() {
  requestAnimationFrame(bucle); const t = reloj.getElapsedTime();
  if (retic.visible) { const w = .08 + ST.ronda * .025; retic.position.set(ST.aim.x + Math.sin(t * 2.3) * w, ST.aim.y + Math.cos(t * 1.9) * w, -9.9); retic.scale.setScalar(1 + Math.sin(t * 6) * .06); }
  if (ST.fase === "apunta" || ST.fase === "") { tejedor.g.position.y = tejedor.g.position.y; }
  if (ST.fase === "apunta") { tejedor.bi.rotation.z = Math.sin(t * 6) * .5 + .6; tejedor.bd.rotation.z = -Math.sin(t * 6) * .5 - .6; tejedor.g.position.x = Math.sin(t * 1.4) * .25; }
  renderer.render(escena, cam);
})();
vistaTiro(); msg("Pulsa EMPEZAR. Tejedor te espera en el patio.");
