(async()=>{
const s=await cargaJSON("semana"),a=document.getElementById("app");
const l=await cargaJSON("liga").catch(()=>({partidos:[],ranking:[],comentarios:{}}));
const N={dug:"Dug",hrk:"HRK",koi:"Koi"};
const liga=l.partidos.length?l.partidos.slice().reverse().map(p=>{const pr=(p.pronosticos||[]).map(x=>{let ico="🔮",cls="";if(p.resultado){const m=(p.resultado.match(/(\d+)-(\d+)/)||[]),q=(x.texto.match(/(\d+)-(\d+)/)||[]);if(m[1]===q[1]&&m[2]===q[2]){ico="🎯";cls="ok";}else if(Math.sign(m[1]-m[2])===Math.sign(q[1]-q[2])){ico="👍";cls="ok";}else{ico="💩";cls="ko";}}return `<li class="${cls}">${ico} <b>${N[x.jugador]||x.jugador}</b>: ${x.texto} ${l.comentarios&&l.comentarios[x.jugador]?`<br><i>${l.comentarios[x.jugador]}</i>`:""}</li>`}).join("");
  return `<h3>⚽ Alavés vs ${p.rival} <span class="pill">${p.fecha||""}</span></h3><p>${p.resultado?"Resultado: <b>"+p.resultado+"</b>":"Aún sin jugar"}</p><ul>${pr||"<li>Nadie ha pronosticado todavía. Cobardes.</li>"}</ul>`;}).join(""):"<p>Aún no hay pronósticos. ¡Pronostica con Hermek en el grupo!</p>";
const rk=(l.ranking||[]).map((r,i)=>`<tr><td>${["🥇","🥈","🥉"][i]||""}</td><td>${N[r.jugador]||r.jugador}</td><td><b>${r.puntos}</b> pts</td><td>${r.exactos} exactos</td></tr>`).join("");
a.innerHTML=`<h2 class="escribe">${s.titulo}</h2><span class="pill">Actualizado: ${s.actualizado}</span><p>${s.resumen}</p>
${s.radio?`<div class="panel"><h3>📻 Radio Hermek: el resumen de la semana</h3><p>${s.radio}</p></div>`:""}
<ul>${s.novedades.map(n=>`<li>${n}</li>`).join("")}</ul>
<div class="panel"><h2>🔮 Los pronósticos del Alavés</h2>${liga}${rk?`<table>${rk}</table>`:""}</div>
<h3>📖 Fábulas</h3>`+(s.fabulas&&s.fabulas.length?"<ul>"+s.fabulas.map(f=>`<li><a href="${f.url}" target="_blank" rel="noopener">${f.titulo}</a></li>`).join("")+"</ul>":"<p>Todavía no hay fábulas publicadas.</p>");
if(l.partidos.some(p=>(p.pronosticos||[]).some(x=>{const m=(p.resultado||"").match(/(\d+)-(\d+)/),q=x.texto.match(/(\d+)-(\d+)/);return m&&q&&m[1]===q[1]&&m[2]===q[2];})))confeti();
})().catch(e=>{document.getElementById("app").textContent="No he podido cargar las novedades.";console.error(e)});
