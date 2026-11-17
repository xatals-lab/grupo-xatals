(async()=>{
const [m,r]=await Promise.all([cargaJSON("minijuegos"),cargaJSON("ranking").catch(()=>({records:[]}))]);
const lider=id=>{const l=r.records.filter(x=>x.juego==="mj-"+id).sort((a,b)=>b.puntos-a.puntos)[0];return l?`<br><span class="pill">👑 ${JUGADORES[l.jugador]||l.jugador}: ${l.puntos}</span>`:"";};
document.getElementById("mjs").innerHTML=m.juegos.map(g=>`<a class="card rev in" href="mj.html?g=${g.id}">${g.nuevo?'<span class="nuevo">NUEVO</span>':""}<span class="em">${g.emoji}</span><h3>${g.titulo}</h3><p>${g.resumen||g.intro}</p><p class="medal">${"★".repeat(g.dificultad||2)}${"☆".repeat(5-(g.dificultad||2))} · ${g.plantilla}</p>${lider(g.id)}</a>`).join("");
document.querySelectorAll("#mjs .card").forEach(c=>{c.addEventListener("mousemove",e=>{const b=c.getBoundingClientRect();c.style.setProperty("--ry",((e.clientX-b.left)/b.width-.5)*14+"deg");c.style.setProperty("--rx",(-((e.clientY-b.top)/b.height-.5))*14+"deg");});c.addEventListener("mouseleave",()=>{c.style.setProperty("--rx","0deg");c.style.setProperty("--ry","0deg");});});
})();
