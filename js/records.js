/* Hall of Fame: reads data/ranking.json (Hermek records the signed score codes). Competition is asynchronous on purpose. */
(async()=>{
const [r,mjs]=await Promise.all([cargaJSON("ranking"),cargaJSON("minijuegos")]),app=document.getElementById("app");
const JUEGOS={recreo:["🥊","Buxai en el recreo"],futbol:["⚽","Tejedor al fútbol"],examen:["🧪","Copiar al Bacterio"],bar:["🍺","El Bar"],apuestas:["🎰","Apuestas"],frases:["🎤","¿Quién lo dijo?"]};
mjs.juegos.forEach(g=>JUEGOS["mj-"+g.id]=[g.emoji,g.titulo]);
const nom=j=>JUGADORES[j]||j;
const medalla=["🥇","🥈","🥉"];
const wins={};
let html="";
for(const [id,[em,tit]] of Object.entries(JUEGOS)){
  const rows=r.records.filter(x=>x.juego===id).sort((a,b)=>b.puntos-a.puntos);
  if(rows.length)wins[rows[0].jugador]=(wins[rows[0].jugador]||0)+1;
  html+=`<div class="panel rev"><h3>${em} ${tit}</h3>`+(rows.length?`<table>${rows.map((x,i)=>`<tr><td class="medal">${medalla[i]||""}</td><td>${nom(x.jugador)}</td><td><b>${x.puntos}</b></td><td style="color:#888">${x.fecha}</td></tr>`).join("")}</table>`:"<p>Nadie ha jugado todavía. Quien mueva ficha primero será rey por defecto.</p>")+`</div>`;
}
const semanas={};r.quiz.forEach(x=>{(semanas[x.semana]=semanas[x.semana]||[]).push(x);});
const sems=Object.keys(semanas).sort().reverse();
let qh=`<div class="panel rev"><h3>🧠 Quiz de la semana · campeones</h3>`;
if(!sems.length)qh+="<p>Todavía no hay campeones.</p>";
sems.forEach((s,idx)=>{const l=semanas[s].sort((a,b)=>b.puntos-a.puntos);if(idx===0){}else wins[l[0].jugador]=(wins[l[0].jugador]||0)+1;
  qh+=`<p><span class="pill">${s}</span> ${l.map((x,i)=>`${medalla[i]||""} ${nom(x.jugador)} <b>${x.puntos}</b>`).join(" · ")}</p>`;});
qh+="</div>";
const rey=Object.entries(wins).sort((a,b)=>b[1]-a[1]);
const cab=rey.length?`<div class="panel rev" style="text-align:center"><div class="corona">👑</div><h2>Rey o reina de la cuadrilla: ${nom(rey[0][0])}</h2><p>${rey[0][1]} primeros puestos. Para destronarlo, juega y manda tu código a Hermek.</p></div>`:`<div class="panel"><h2>👑 El trono está vacío</h2><p>Juega, copia el código de récord y mándaselo a Hermek por el grupo.</p></div>`;
app.innerHTML=cab+qh+html;
document.querySelectorAll(".rev").forEach(e=>e.classList.add("in"));
})().catch(e=>{document.getElementById("app").textContent="No he podido cargar el Hall of Fame.";console.error(e)});
