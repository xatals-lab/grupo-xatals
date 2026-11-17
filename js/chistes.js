(async()=>{
const c=await cargaJSON("chistes");let tema="todos";
const temas=["todos",...new Set(c.map(x=>x.tema))];
const t=document.getElementById("temas");
function pintaTemas(){t.innerHTML=temas.map(x=>`<button class="${x===tema?"":"sec"}" data-t="${x}">${x}</button>`).join("");t.querySelectorAll("button").forEach(b=>b.onclick=()=>{tema=b.dataset.t;pintaTemas();otro();});}
function otro(){const l=tema==="todos"?c:c.filter(x=>x.tema===tema);document.getElementById("chiste").textContent=azar(l).texto;}
document.getElementById("otro").onclick=otro;pintaTemas();otro();
})().catch(e=>{document.getElementById("chiste").textContent="No he podido cargar los chistes.";console.error(e)});
