(async()=>{
const r=await cargaJSON("recursos"),app=document.getElementById("app");
document.getElementById("tit").textContent=r.titulo;
app.innerHTML=`<p>${r.intro}</p><p class="medal">${r.eu||""}</p>`+r.grupos.map(g=>`<h2>${g.emoji} ${g.nombre} <span class="pill">${g.eu||""}</span></h2><div class="bento">${g.enlaces.map(l=>`<div class="bloque s3"><a class="card" href="${l.url}" target="_blank" rel="noopener noreferrer"><h3>${l.titulo}</h3><p>${l.nota||""}</p><p class="medal" style="word-break:break-all">${l.url.replace(/^https?:\/\//,"")}</p></a></div>`).join("")}</div>`).join("");
document.querySelectorAll(".card").forEach(c=>c.addEventListener("pointermove",e=>{const b=c.getBoundingClientRect();c.style.setProperty("--mx",(e.clientX-b.left)+"px");c.style.setProperty("--my",(e.clientY-b.top)+"px");}));
})().catch(e=>{document.getElementById("app").textContent="No he podido cargar los recursos.";console.error(e)});
