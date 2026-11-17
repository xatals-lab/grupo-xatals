(async()=>{
const [pr,pe]=await Promise.all([cargaJSON("profesores"),cargaJSON("personajes")]);const app=document.getElementById("app");
app.innerHTML=`<h2>🎓 El claustro de Santa María</h2><div class="bento" id="cl">${pr.profesores.map(p=>`<div class="bloque"><div class="card"><span class="em">${p.emoji}</span><h3>${p.nombre}</h3><p class="medal">${p.rol}</p><p>${p.aspecto}</p><p><i class="am" data-id="${p.id}">«${p.amenazas[0]}»</i></p><button class="sec prov" data-id="${p.id}">😡 Provocar</button></div></div>`).join("")}</div>
<h2>🧑‍🎓 La orla de la cuadrilla</h2><div class="bento">${pe.invitados.map(p=>`<div class="bloque"><div class="card"><span class="em">${p.emoji}</span><h3>${p.nombre}</h3><p class="medal">${p.rol}</p><p><i>${p.pulla||""}</i></p></div></div>`).join("")}</div>`;
app.querySelectorAll(".prov").forEach(b=>b.onclick=()=>{const p=pr.profesores.find(x=>x.id===b.dataset.id);app.querySelector(`.am[data-id="${p.id}"]`).textContent="«"+azar(p.amenazas)+"»";sonido(170,.2);});
document.querySelectorAll(".card").forEach(c=>c.addEventListener("pointermove",e=>{const r=c.getBoundingClientRect();c.style.setProperty("--mx",(e.clientX-r.left)+"px");c.style.setProperty("--my",(e.clientY-r.top)+"px");}));
})().catch(e=>{document.getElementById("app").textContent="No he podido cargar el claustro.";console.error(e)});
