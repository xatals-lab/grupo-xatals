(async()=>{
const s=await cargaJSON("semana"),a=document.getElementById("app");
a.innerHTML=`<h2>${s.titulo}</h2><span class="pill">Actualizado: ${s.actualizado}</span><p>${s.resumen}</p><ul>${s.novedades.map(n=>`<li>${n}</li>`).join("")}</ul><h3>📖 Fábulas</h3>`+(s.fabulas&&s.fabulas.length?"<ul>"+s.fabulas.map(f=>`<li><a href="${f.url}" target="_blank" rel="noopener">${f.titulo}</a></li>`).join("")+"</ul>":"<p>Todavía no hay fábulas publicadas.</p>");
})().catch(e=>{document.getElementById("app").textContent="No he podido cargar las novedades.";console.error(e)});
