/* 3D exams in the Santa María classroom. modo "bacterio": stealth, hold to copy Koi's paper while the Bacterio has his back turned.
   modo "maketo": the philosophy exam of Miguel Valladolid: impossible, you always fail; then Christmas arrives and he retires. */
import { THREE } from "./escena.js";
import { crearAula } from "./aula.js";
import { humanoide, animar, reposo, golpe, etiqueta } from "./figuras.js";

const $ = id => document.getElementById(id);
const MODO = window.MODO_EXAMEN || "bacterio";
const pick = a => a[Math.floor(Math.random() * a.length)];
const tween = (ms, f) => new Promise(res => { const t0 = performance.now(); (function s(n) { const p = Math.min(1, (n - t0) / ms); f(p); p < 1 ? requestAnimationFrame(s) : res(); })(t0); });
const msg = t => $("msg").textContent = t;
let A;
try { A = crearAula($("lienzo3d"), MODO === "bacterio" ? ["FÍSICA Y QUÍMICA", "v = e / t", "F = m · a", "Vaya examen..."] : ["FILOSOFÍA", "¿Quién soy yo?", "Examen oral", "Suspenso para todos"]); }
catch (e) { $("lienzo3d").innerHTML = "<p style='padding:2rem'>Tu navegador no puede abrir el 3D. Prueba con Chrome, Safari o Edge.</p>"; throw e; }
const { renderer, escena, cam, papel } = A;
const koi = humanoide(escena, { jersey: "#c47a2c", pantalon: 0x30303a, nombre: "KOI", colorNombre: "#00e5ff", pelo: 0x1a1a1a });
koi.g.position.set(1.6, -.5, 3.25); koi.g.rotation.y = Math.PI; koi.pi.rotation.x = -1.5; koi.pd.rotation.x = -1.5; koi.ri.rotation.x = 1.5; koi.rd.rotation.x = 1.5; koi.bi.rotation.x = -.6; koi.bd.rotation.x = -.6; koi.ci.rotation.x = -.9; koi.cd.rotation.x = -.9;
papel.position.set(1.5, .78, 2.55);
const prof = MODO === "bacterio"
  ? humanoide(escena, { jersey: "#e8e8e8", pantalon: 0x2c2c34, bata: true, gafas: "normal", pelo: 0x888888, cuello: true, alto: 1.06, nombre: "EL BACTERIO", colorNombre: "#ff2e93", bota: 0x3a2a1e })
  : humanoide(escena, { jersey: "#3a3a52", pantalon: 0x2b2b33, gafas: "normal", pelo: 0x9a9a9a, cuello: true, nombre: "MIGUEL VALLADOLID", colorNombre: "#ff2e93", bota: 0x3a2a1e });
prof.g.position.set(0, 0, -4.2); prof.g.rotation.y = Math.PI;
const bolis = new THREE.Mesh(new THREE.CylinderGeometry(.012, .012, .16, 8), new THREE.MeshStandardMaterial({ color: 0xcc1111 })); bolis.position.set(0, -.3, 0); prof.cd.add(bolis);
let estado = "espalda", yaw = 0, mirar = 0, copia = false, vivo = false, ultimo = 0, cop = 0, sos = 0, t = 60, resto = 1.5, rot = Math.PI, px = 0, dirx = 1;
const camBase = new THREE.Vector3(-.4, 1.15, 3.25);
function camara() { const k = mirar; cam.position.set(camBase.x + k * .5, camBase.y - k * .22, camBase.z); const look = new THREE.Vector3(-.4 + (1.5 - -.4) * k, 1.45 - 1.0 * k, -5 + (2.55 - -5) * k); cam.lookAt(look); }

/* --------------- bacterio --------------- */
function hud() { $("cop").style.width = cop + "%"; $("sos").style.width = sos + "%"; $("tiempo").textContent = Math.ceil(t) + "s"; }
function cambia() { const dif = Math.min(1, (60 - t) / 60);
  if (estado === "espalda") { estado = "aviso"; resto = .75 - .3 * dif; msg("🤨 ¡Se huele algo!"); }
  else if (estado === "aviso") { estado = "mirando"; resto = 1 + Math.random() * .9; msg("👀 ¡TE MIRA! SUELTA"); }
  else { estado = "espalda"; resto = 1.2 + Math.random() * (2.4 - dif); msg("Se gira hacia la pizarra... copia, copia"); } }
function tickBacterio(dt) {
  t -= dt; resto -= dt; if (resto <= 0) cambia();
  if (copia) { if (estado === "mirando") sos += 95 * dt; else if (estado === "aviso") sos += 28 * dt; else { cop += (100 / 9) * dt; sos = Math.max(0, sos - 8 * dt); } } else sos = Math.max(0, sos - 18 * dt);
  cop = Math.min(100, cop); sos = Math.min(100, sos); hud();
  if (cop >= 100) return finBacterio(true); if (sos >= 100) return finBacterio(false); if (t <= 0) return finBacterio(false, true);
  const objetivo = estado === "mirando" ? 0 : estado === "aviso" ? Math.PI * .5 : Math.PI; rot += (objetivo - rot) * Math.min(1, dt * 6);
  prof.g.rotation.y = rot; px += dirx * dt * .5 * (estado === "espalda" ? 1 : 0); if (px > 2.3) dirx = -1; if (px < -2.3) dirx = 1; prof.g.position.x = px; animar(prof, estado === "espalda" ? "caminar" : "reposo", ultimo, .5);
}
function finBacterio(gana, tiempo) {
  vivo = false; copia = false; $("start").disabled = false; const pts = gana ? 500 + Math.round(t * 10) + Math.round((100 - sos) * 2) : Math.round(cop * 3);
  msg(gana ? "🏆 Copiado entero. El Bacterio no se entera. Aprobado... con un cinco." : tiempo ? "⏰ Se acaba el tiempo. Examen en blanco." : "🚨 ¡Pillado! «Vaya examen, señor Urrutia, vaya examen.»");
  if (!gana && !tiempo) { golpe("¡TE HA PILLADO EL BACTERIO! «VAYA EXAMEN, SEÑOR URRUTIA, VAYA EXAMEN»"); if (window.reto) reto("suspende"); } if (gana && window.insignia) insignia("copia-bacterio", "Copiaste al Bacterio y vives para contarlo");
  panelRecord($("rec"), "examen", pts, "Puntos del examen");
}
/* --------------- maketo --------------- */
const PREGUNTAS = [
  ["¿Qué es la verdad, señor Urrutia?", ["Lo que dice Platón", "Lo que dice la cuadrilla", "Lo que no entra en el examen", "Una caña bien tirada"], ["Platón habría suspendido a más gente aún.", "La cuadrilla no es fuente académica. Fuera.", "Tampoco. Pero casi: suspenso.", "Bien dicho, y mal respondido. Suspenso."]],
  ["Si cae un árbol en el patio de Marianistas (que no tiene árboles), ¿hace ruido?", ["Sí, el de la queja de Tejedor", "No, porque no hay árboles", "Depende de si lo oye el Bacterio", "Solo si Koi está de servicios mínimos"], ["Suspenso por listillo.", "Correcto... y suspenso por obvio.", "El Bacterio no entra en filosofía. Suspenso.", "Koi no entra en nada. Suspenso."]],
  ["¿Existe el balón si Tejedor no lo está pateando?", ["No, solo existe patada", "Sí, como idea platónica", "Solo en el recreo", "Existe, pero en la cara de Buxai"], ["Suspenso por materialista.", "Platón vuelve y te suspende también.", "El recreo no es una categoría metafísica.", "Eso es violencia. Y suspenso."]],
  ["La caña, ¿es un derecho natural o un contrato social?", ["Natural, como el agua", "Contrato, con la barra", "Es la pica: no cuenta", "Ni lo uno ni lo otro: es del Alavés"], ["Hobbes se levanta de la tumba. Suspenso.", "Rousseau se ríe. Y yo no. Suspenso.", "La pica es de flojos. Suspenso doble.", "El Alavés no figura en el temario. Suspenso."]],
  ["Defina el Ser y el Tiempo en 3 líneas, con la letra de Koi", ["Ser: el que sirve. Tiempo: servicios mínimos", "No lo sé, joder", "Heidegger lo hacía mejor", "Pregunto a Hermek"], ["Aprecio la creatividad. Suspenso.", "Eso es la verdad, pero no es filosofía. Suspenso.", "Heidegger también suspendía. Suspenso.", "No hay IA en filosofía del siglo XX. Suspenso."]],
  ["Última pregunta: ¿aprobarás alguna vez filosofía?", ["Sí", "No", "Cuando te jubiles", "Hostia, no sé"], ["Falso. Suspenso.", "Correcto... y suspenso por derrotista.", "Eso sí que podría pasar. Pero hoy, suspenso.", "Esa es la actitud. Suspenso, igualmente."]]
];
let qi = 0, notaTotal = 0;
function pintaPregunta() {
  if (qi >= PREGUNTAS.length) return finMaketo(); const [q, ops, resp] = PREGUNTAS[qi];
  $("preg").innerHTML = `<p class="medal">PREGUNTA ${qi + 1}/${PREGUNTAS.length} · NOTA ACUMULADA: ${notaTotal.toFixed(1)}/10</p><h3>${q}</h3>` + ops.map((o, k) => `<button class="sec" data-k="${k}">${o}</button>`).join("<br>");
  $("preg").querySelectorAll("button").forEach(b => b.onclick = async () => { $("preg").querySelectorAll("button").forEach(z => z.disabled = true); const k = +b.dataset.k; notaTotal += Math.random() * .3; sonido(130, .3);
    msg("✍ " + resp[k]); const sello = document.createElement("div"); sello.className = "sello"; sello.textContent = "SUSPENSO"; $("lienzo3d").append(sello); await tween(900, p => { prof.cd.rotation.x = -1.2 + Math.sin(p * 18) * .4; prof.bd.rotation.x = -.9; });
    setTimeout(() => sello.remove(), 800); await new Promise(r => setTimeout(r, 900)); qi++; pintaPregunta(); });
}
async function finMaketo() {
  const nota = Math.min(2.4, notaTotal); const pts = 150 * PREGUNTAS.length;
  $("preg").innerHTML = `<h3>Resultado: ${nota.toFixed(1)} / 10</h3><p><b>SUSPENSO.</b> Como el 95% de la clase, como siempre.</p><button class="rosa" id="navidad">🎄 Pasar a Navidades</button>`;
  if (window.reto) reto("suspende"); if (window.insignia) insignia("suspende-maketo", "Suspendiste filosofía con el Maketo (como todos)");
  $("navidad").onclick = async () => { $("navidad").disabled = true; msg("🎄 Pasan las semanas... llegan las Navidades."); await new Promise(r => setTimeout(r, 1400));
    await tween(2200, p => { prof.g.position.x = p * 4; prof.g.rotation.y = Math.PI * .5; animar(prof, "caminar", p * 10, .8); }); prof.g.visible = false; confeti(); sonido(880, .3);
    $("preg").innerHTML = `<h3>🎉 Han llegado las Navidades</h3><p>Se ha jubilado Miguel Valladolid. A partir de ahora, tendréis posibilidades de aprobar filosofía.</p><p style="color:#aaa"><i>(Spoiler: seguiréis suspendiendo, pero con otro profesor.)</i></p>`;
    msg("🏆 Superviviente del Maketo. Aprobado raspadillo en la vida."); $("start").disabled = false; if (window.insignia) insignia("jubila-maketo", "Viste jubilarse al Maketo");
    panelRecord($("rec"), "examen-maketo", pts + 300, "Puntos del examen del Maketo"); };
}

$("start").onclick = () => { $("rec").innerHTML = ""; $("start").disabled = true;
  if (MODO === "bacterio") { cop = 0; sos = 0; t = 60; estado = "espalda"; resto = 1.5; vivo = true; copia = false; msg("Mantén COPIAR cuando no mire"); $("copia").disabled = false; }
  else { qi = 0; notaTotal = 0; prof.g.visible = true; prof.g.position.set(0, 0, -4.2); vivo = false; msg("Examen oral de filosofía. Que Dios te pille confesado."); pintaPregunta(); } };
if (MODO === "bacterio") { const b = $("copia"); ["mousedown", "touchstart", "pointerdown"].forEach(ev => b.addEventListener(ev, e => { e.preventDefault(); copia = true; })); ["mouseup", "mouseleave", "touchend", "touchcancel", "pointerup"].forEach(ev => b.addEventListener(ev, () => { copia = false; }));
  document.addEventListener("keydown", e => { if (e.key === " ") { e.preventDefault(); copia = true; } }); document.addEventListener("keyup", e => { if (e.key === " ") copia = false; }); }
const reloj = new THREE.Clock(); let tp = 0;
(function bucle() { requestAnimationFrame(bucle); const tt = reloj.getElapsedTime(), dt = Math.min(.05, tt - tp); tp = tt; ultimo = tt;
  mirar += ((copia && vivo ? 1 : 0) - mirar) * Math.min(1, dt * 9); camara(); koi.g.position.y = -.5 + Math.sin(tt * 2) * .01;
  if (MODO === "bacterio" && vivo) tickBacterio(dt); else if (MODO === "maketo") animar(prof, "reposo", tt);
  renderer.render(escena, cam); })();
msg("Pulsa EMPEZAR.");
window.__xatals = { reto: () => window.reto };
