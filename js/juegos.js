(async()=>{
const [m,r]=await Promise.all([cargaJSON("minijuegos"),cargaJSON("ranking").catch(()=>({records:[]}))]);
const lider=id=>{const l=r.records.filter(x=>x.juego==="mj-"+id).sort((a,b)=>b.puntos-a.puntos)[0];return l?`<br><span class="pill">👑 ${JUGADORES[l.jugador]||l.jugador}: ${l.puntos}</span>`:"";};
const tarj=g=>`<a class="card rev in" href="mj.html?g=${g.id}">${g.vds?'<span class="nuevo">SEMANA</span>':g.nuevo?'<span class="nuevo">NUEVO</span>':""}<span class="em">${g.emoji}</span><h3>${g.titulo}</h3><p>${g.resumen||g.intro}</p><p class="medal">${g.vds?g.semana+" · ":""}${"★".repeat(g.dificultad||2)}${"☆".repeat(5-(g.dificultad||2))} · ${g.plantilla}</p>${lider(g.id)}</a>`;
const porSemana=(a,b)=>(b.semana||"").localeCompare(a.semana||"");
document.getElementById("vdss").innerHTML=m.juegos.filter(g=>g.vds).sort(porSemana).map(tarj).join("")||"<p>Pronto, el primero.</p>";
document.getElementById("mjs").innerHTML=m.juegos.filter(g=>!g.vds).map(tarj).join("");
document.querySelectorAll("#vdss .card,#mjs .card").forEach(c=>{c.addEventListener("mousemove",e=>{const b=c.getBoundingClientRect();c.style.setProperty("--ry",((e.clientX-b.left)/b.width-.5)*14+"deg");c.style.setProperty("--rx",(-((e.clientY-b.top)/b.height-.5))*14+"deg");c.style.setProperty("--mx",(e.clientX-b.left)+"px");c.style.setProperty("--my",(e.clientY-b.top)+"px");});c.addEventListener("mouseleave",()=>{c.style.setProperty("--rx","0deg");c.style.setProperty("--ry","0deg");});});
})();
