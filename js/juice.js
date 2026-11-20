/* "Game feel" layer shared by every 3D game: 3D particle bursts, floating score pop-ups, screen flash, camera punch, phone vibration. */
import { THREE } from "./escena.js";

export function vibra(ms = 20) { try { if (navigator.vibrate && localStorage.getItem("xatals_mute") !== "1") navigator.vibrate(ms); } catch (e) {} }

export function popup(cont, texto, color = "#ffe500", x = 50, y = 38) {
  const d = document.createElement("div"); d.className = "juice-pop"; d.textContent = texto; d.style.cssText = `left:${x}%;top:${y}%;color:${color}`; cont.append(d); setTimeout(() => d.remove(), 900);
}
export function flash(cont, color = "#ff1e1e", ms = 260) {
  const d = document.createElement("div"); d.className = "juice-flash"; d.style.background = `radial-gradient(circle,#0000 35%,${color}aa)`; d.style.animationDuration = ms + "ms"; cont.append(d); setTimeout(() => d.remove(), ms + 40);
}

export function particulas(scene) {
  const geo = new THREE.BoxGeometry(.14, .14, .14), lista = [];
  function burst(pos, color = 0xffe500, n = 16, fuerza = 6) {
    for (let i = 0; i < n; i++) {
      const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color, transparent: true })); m.position.copy(pos);
      const a = Math.random() * Math.PI * 2, b = Math.random() * Math.PI - Math.PI / 2, f = fuerza * (.4 + Math.random() * .8);
      lista.push({ m, v: new THREE.Vector3(Math.cos(a) * Math.cos(b) * f, Math.abs(Math.sin(b)) * f + 2, Math.sin(a) * Math.cos(b) * f), vida: .7 + Math.random() * .4, r: new THREE.Vector3(Math.random() * 9, Math.random() * 9, Math.random() * 9) });
      scene.add(m);
    }
  }
  function update(dt) {
    for (let i = lista.length - 1; i >= 0; i--) {
      const p = lista[i]; p.vida -= dt; p.v.y -= 14 * dt; p.m.position.addScaledVector(p.v, dt); p.m.rotation.x += p.r.x * dt; p.m.rotation.y += p.r.y * dt; p.m.material.opacity = Math.max(0, p.vida * 1.6);
      if (p.vida <= 0) { scene.remove(p.m); p.m.material.dispose(); lista.splice(i, 1); }
    }
  }
  return { burst, update };
}
