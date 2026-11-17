/* 3D classroom of Colegio Santa María: parquet floor, blackboard with chalk, windows, crucifix, desks. Procedural textures only. */
import * as THREE from "three";
import { mat } from "./escena.js";

const lienzo = (w, h, f) => { const c = document.createElement("canvas"); c.width = w; c.height = h; f(c.getContext("2d"), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };

export function pizarra(lineas, color = "#f4f4f0") {
  return lienzo(1024, 400, (g, w, h) => { g.fillStyle = "#1f3b2c"; g.fillRect(0, 0, w, h); g.fillStyle = "#ffffff08"; for (let i = 0; i < 40; i++) g.fillRect(Math.random() * w, Math.random() * h, 140, 3);
    g.strokeStyle = "#7a5a3a"; g.lineWidth = 16; g.strokeRect(0, 0, w, h); g.fillStyle = color; g.font = "56px 'Permanent Marker', Georgia, cursive"; g.textAlign = "left";
    lineas.forEach((l, i) => g.fillText(l, 50, 100 + i * 80)); });
}
export function hoja(lineas) {
  return lienzo(512, 640, (g, w, h) => { g.fillStyle = "#fbfaf2"; g.fillRect(0, 0, w, h); g.strokeStyle = "#9bb4d8"; g.lineWidth = 2; for (let y = 60; y < h; y += 36) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
    g.strokeStyle = "#e07070"; g.beginPath(); g.moveTo(60, 0); g.lineTo(60, h); g.stroke(); g.fillStyle = "#223"; g.font = "26px 'Permanent Marker', Georgia, cursive"; (lineas || []).forEach((l, i) => g.fillText(l, 74, 52 + i * 36)); });
}

export function crearAula(contenedor, textoPizarra = ["EXAMEN", "Sin copiar, ¿eh?"]) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.outputColorSpace = THREE.SRGBColorSpace; contenedor.appendChild(renderer.domElement);
  const escena = new THREE.Scene(); escena.background = new THREE.Color(0x20232a); escena.fog = new THREE.Fog(0x20232a, 12, 30);
  const cam = new THREE.PerspectiveCamera(62, 1, .05, 60); escena.add(cam);
  escena.add(new THREE.HemisphereLight(0xfff4dd, 0x6a5f50, .9));
  const sol = new THREE.DirectionalLight(0xfff0cf, 2.2); sol.position.set(-6, 5, 2); sol.castShadow = true; sol.shadow.mapSize.set(2048, 2048); Object.assign(sol.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 1, far: 25 }); escena.add(sol);
  for (const x of [-2.5, 2.5]) { const l = new THREE.PointLight(0xfff2cc, 18, 9); l.position.set(x, 3.2, -.5); escena.add(l); const tub = new THREE.Mesh(new THREE.BoxGeometry(1.6, .06, .2), new THREE.MeshBasicMaterial({ color: 0xfffbe0 })); tub.position.set(x, 3.5, -.5); escena.add(tub); }
  const W = 10, D = 11, H = 3.6;
  const par = lienzo(512, 512, (g, w, h) => { g.fillStyle = "#a9794c"; g.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 64) for (let x = (y / 64) % 2 ? 0 : -64; x < w; x += 128) { const v = 150 + Math.random() * 40; g.fillStyle = `rgb(${v + 20},${v * .68},${v * .42})`; g.fillRect(x + 2, y + 2, 124, 60); } });
  par.wrapS = par.wrapT = THREE.RepeatWrapping; par.repeat.set(3, 3);
  const suelo = new THREE.Mesh(new THREE.PlaneGeometry(W, D), mat({ map: par, roughness: .6 })); suelo.rotation.x = -Math.PI / 2; suelo.receiveShadow = true; escena.add(suelo);
  const pared = mat({ color: 0xe9dfc8, roughness: .95 });
  const fondo = new THREE.Mesh(new THREE.PlaneGeometry(W, H), pared); fondo.position.set(0, H / 2, -D / 2); escena.add(fondo);
  const atras = new THREE.Mesh(new THREE.PlaneGeometry(W, H), pared); atras.position.set(0, H / 2, D / 2); atras.rotation.y = Math.PI; escena.add(atras);
  const izq = new THREE.Mesh(new THREE.PlaneGeometry(D, H), pared); izq.position.set(-W / 2, H / 2, 0); izq.rotation.y = Math.PI / 2; escena.add(izq);
  const der = new THREE.Mesh(new THREE.PlaneGeometry(D, H), pared); der.position.set(W / 2, H / 2, 0); der.rotation.y = -Math.PI / 2; escena.add(der);
  const techo = new THREE.Mesh(new THREE.PlaneGeometry(W, D), mat({ color: 0xf4efe4 })); techo.position.y = H; techo.rotation.x = Math.PI / 2; escena.add(techo);
  const rodapie = new THREE.Mesh(new THREE.BoxGeometry(W, .18, .05), mat({ color: 0x6b4a2e })); rodapie.position.set(0, .09, -D / 2 + .03); escena.add(rodapie);
  for (let i = 0; i < 3; i++) { const v = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 1.7), new THREE.MeshBasicMaterial({ color: 0xcfe6ff })); v.position.set(-W / 2 + .02, 2.0, -3 + i * 3.2); v.rotation.y = Math.PI / 2; escena.add(v);
    const marco = new THREE.Mesh(new THREE.BoxGeometry(.06, 1.8, 2.2), mat({ color: 0x5a4a3a })); marco.position.set(-W / 2 + .05, 2.0, -3 + i * 3.2); escena.add(marco); }
  const piz = new THREE.Mesh(new THREE.PlaneGeometry(5.4, 1.7), new THREE.MeshStandardMaterial({ map: pizarra(textoPizarra), roughness: .9 })); piz.position.set(0, 1.9, -D / 2 + .03); escena.add(piz);
  const cruz = new THREE.Group(); cruz.add(new THREE.Mesh(new THREE.BoxGeometry(.07, .5, .04), mat({ color: 0x4a3322 }))); const br = new THREE.Mesh(new THREE.BoxGeometry(.3, .07, .04), mat({ color: 0x4a3322 })); br.position.y = .1; cruz.add(br); cruz.position.set(0, 3.0, -D / 2 + .05); escena.add(cruz);
  const mesa = (x, z, ry = 0) => { const g = new THREE.Group(); const t = new THREE.Mesh(new THREE.BoxGeometry(.9, .05, .6), mat({ color: 0xcaa26a, roughness: .6 })); t.position.y = .74; t.castShadow = t.receiveShadow = true; g.add(t);
    for (const [px, pz] of [[-.4, -.25], [.4, -.25], [-.4, .25], [.4, .25]]) { const p = new THREE.Mesh(new THREE.BoxGeometry(.04, .74, .04), mat({ color: 0x555a60, metalness: .5 })); p.position.set(px, .37, pz); g.add(p); }
    const s = new THREE.Mesh(new THREE.BoxGeometry(.42, .04, .4), mat({ color: 0x3b6e8f })); s.position.set(0, .45, .62); g.add(s); const resp = new THREE.Mesh(new THREE.BoxGeometry(.42, .4, .04), mat({ color: 0x3b6e8f })); resp.position.set(0, .68, .83); g.add(resp);
    g.position.set(x, 0, z); g.rotation.y = ry; escena.add(g); return g; };
  const mesas = []; for (let r = 0; r < 3; r++) for (const c of [-2.4, -.4, 1.6, 3.4]) if (!(r === 2 && c === -.4)) mesas.push(mesa(c, -1.2 + r * 1.9));
  const prof = new THREE.Mesh(new THREE.BoxGeometry(1.5, .08, .8), mat({ color: 0x7a5535 })); prof.position.set(-3, .8, -4.2); prof.castShadow = true; escena.add(prof);
  const papel = new THREE.Mesh(new THREE.PlaneGeometry(.3, .38), new THREE.MeshStandardMaterial({ map: hoja(["1) Nombre: KOI", "2) Fuerza = m·a", "3) b", "4) Hostia puta,", "no lo sé", "5) c"]), roughness: .9 })); papel.rotation.x = -Math.PI / 2 + .35; papel.position.set(1.2, .78, 1.15); escena.add(papel);
  function redar() { const w = contenedor.clientWidth, h = contenedor.clientHeight; renderer.setSize(w, h); cam.aspect = w / h; cam.fov = cam.aspect < .9 ? 78 : 62; cam.updateProjectionMatrix(); }
  new ResizeObserver(redar).observe(contenedor); redar();
  return { renderer, escena, cam, papel, mesas, pizarraMesh: piz };
}
