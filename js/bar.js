(async()=>{
const d=await cargaJSON("personajes");
const TOTAL=Math.min(8,d.invitados.length);
let s={animo:50,cartera:40,ronda:0,cola:baraja(d.invitados).slice(0,TOTAL)};
document.getElementById("mTotal").textContent=TOTAL;
function asientos(){
  document.getElementById("seats").innerHTML=d.cuadrilla.map(p=>`<div class="seat"><div class="em">${p.emoji}</div><b>${p.nombre}</b><div class="bubble">“${azar(p.frases_barra)}”</div></div>`).join("");
}
function meters(){
  document.getElementById("mAnimo").style.width=s.animo+"%";
  document.getElementById("mCartera").textContent=s.cartera;
  document.getElementById("mRonda").textContent=Math.min(s.ronda,TOTAL);
}
function esc(inv){
  const e=document.getElementById("escena");
  e.innerHTML=`<div class="guest"><h2>${inv.emoji} ${inv.nombre}</h2><div class="pill">${inv.rol}</div><p>${inv.entrada}</p>${inv.pulla?`<p style="color:#ff8bc2"><i>${inv.pulla}</i></p>`:""}</div>`+inv.opciones.map((o,i)=>`<button data-i="${i}">${o.texto}</button>`).join("");
  e.querySelectorAll("button").forEach(b=>b.onclick=()=>elige(inv,inv.opciones[+b.dataset.i]));
}
function elige(inv,o){
  s.animo=acota(s.animo+o.animo);s.cartera=Math.max(0,s.cartera+o.cartera);
  const l=document.getElementById("log");
  l.innerHTML=`<div><b>${inv.nombre}:</b> ${o.resultado} <span class="${o.animo>=0?"ok":"ko"}">(${o.animo>=0?"+":""}${o.animo} ánimo, ${o.cartera>=0?"+":""}${o.cartera} €)</span></div>`+l.innerHTML;
  s.ronda++;meters();asientos();
  if(s.cartera<=0||s.ronda>=TOTAL)return fin();
  document.getElementById("escena").innerHTML=`<button id="sig">🍻 Siguiente invitado</button>`;
  document.getElementById("sig").onclick=()=>esc(s.cola[s.ronda]);
}
function fin(){
  const t=s.cartera<=0?"💸 Te has quedado sin un euro: tiras de crédito del Bacterio.":s.animo>=75?"🏆 Leyenda del bar: HRK y Koi te dan el título de oficial Xatal.":s.animo>=45?"👍 Buena noche. Sales por tu pie y sin llamar a Querejeta.":"😵 Noche regular. Mañana tienes un examen del Bacterio.";
  document.getElementById("escena").innerHTML=`<h2>Cierra el bar</h2><p>${t}</p><p>Ánimo final: <b>${s.animo}</b> · Cartera: <b>${s.cartera} €</b></p><button id="otra">Otra noche</button>`;
  document.getElementById("otra").onclick=()=>location.reload();
  panelRecord(document.getElementById("rec"),"bar",s.animo*10+s.cartera*5,"Puntos del bar");
}
asientos();meters();esc(s.cola[0]);
})().catch(e=>{document.getElementById("escena").textContent="No he podido cargar los datos del bar.";console.error(e)});
