(async()=>{
const a=await cargaJSON("apuestas"),app=document.getElementById("app");
let fichas=+localStorage.getItem("xatals_fichas")||a.fichas_iniciales;
function pinta(){
  app.innerHTML=`<h2>${a.partido}</h2><p>${a.jornada} · ${a.fecha}</p><p>Tienes <b>${fichas}</b> fichas. Apuesta lo que quieras en cada mercado (fichas ficticias, claro).</p>
  <table><tr><th>Mercado</th><th>Cuota</th><th>Fichas</th></tr>`+a.mercados.map(m=>`<tr><td>${m.texto}</td><td>x${m.cuota}</td><td><input type="number" min="0" value="0" data-id="${m.id}"></td></tr>`).join("")+`</table>
  <button id="jugar">⚽ Jugar el partido</button><button class="sec" id="reset">Reiniciar fichas</button><div id="res"></div>`;
  document.getElementById("reset").onclick=()=>{fichas=a.fichas_iniciales;localStorage.setItem("xatals_fichas",fichas);pinta();};
  document.getElementById("jugar").onclick=jugar;
}
function jugar(){
  const ap={};let total=0;
  app.querySelectorAll("input[type=number]").forEach(i=>{const v=Math.max(0,Math.floor(+i.value||0));if(v){ap[i.dataset.id]=v;total+=v;}});
  const res=document.getElementById("res");
  if(!total)return res.innerHTML="<p class='ko'>Apuesta algo, cobarde.</p>";
  if(total>fichas)return res.innerHTML=`<p class='ko'>Solo tienes ${fichas} fichas y apuestas ${total}.</p>`;
  const gana={};
  const grupos={};a.mercados.filter(m=>m.grupo).forEach(m=>(grupos[m.grupo]=grupos[m.grupo]||[]).push(m));
  for(const g in grupos){let r=Math.random()*grupos[g].reduce((s,m)=>s+m.prob,0);for(const m of grupos[g]){r-=m.prob;if(r<=0){gana[m.id]=true;break;}}}
  a.mercados.filter(m=>!m.grupo).forEach(m=>gana[m.id]=Math.random()<m.prob);
  let neto=0,filas="";
  a.mercados.forEach(m=>{if(!ap[m.id])return;const g=gana[m.id]?Math.round(ap[m.id]*m.cuota):0;neto+=g-ap[m.id];filas+=`<tr><td>${m.texto}</td><td>${ap[m.id]}</td><td class="${gana[m.id]?"ok":"ko"}">${gana[m.id]?"¡Acertaste! +"+g:"Perdida"}</td></tr>`;});
  fichas=Math.max(0,fichas+neto);localStorage.setItem("xatals_fichas",fichas);
  const veredicto=neto>0?"🎉 Ganas "+neto+" fichas. Te invitamos a una pica.":neto<0?"💸 Pierdes "+(-neto)+" fichas. Koi pide servicios mínimos para consolarte.":"😐 Tablas.";
  res.innerHTML=`<h3>Resultado</h3><div class="pill">${a.mercados.filter(m=>gana[m.id]).map(m=>m.texto).join(" · ")}</div><table>${filas}</table><p>${veredicto} Ahora tienes <b>${fichas}</b> fichas.</p><button id="otra">Otra jornada</button>`;
  document.getElementById("otra").onclick=pinta;
}
pinta();
})().catch(e=>{document.getElementById("app").textContent="No he podido cargar las apuestas.";console.error(e)});
