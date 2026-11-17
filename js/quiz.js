(async()=>{
const [f,p]=await Promise.all([cargaJSON("frases"),cargaJSON("personajes")]);
const nombres={};[...p.cuadrilla,...p.invitados].forEach(x=>nombres[x.id]=x.nombre);
const app=document.getElementById("app");let q=baraja(f),i=0,pts=0;
function pinta(){
  if(i>=q.length){app.innerHTML=`<h2>Fin</h2><p>${pts} de ${q.length}.</p><p>${pts>q.length*.8?"Eres el cuarto de la cuadrilla.":pts>q.length*.5?"Bien, pero te falta bar.":"Necesitas más cañas con ellos."}</p><button onclick="location.reload()">Otra vez</button><div id="rec"></div>`;panelRecord(document.getElementById("rec"),"frases",pts*100,"Puntos de ¿Quién lo dijo?");return;}
  const x=q[i];
  app.innerHTML=`<p>Pregunta ${i+1}/${q.length} · Puntos: ${pts}</p><h2>“${x.frase}”</h2>`+baraja(x.opciones).map(o=>`<button data-o="${o}">${nombres[o]||o}</button>`).join("")+`<div id="r"></div>`;
  app.querySelectorAll("button").forEach(b=>b.onclick=()=>{
    const ok=b.dataset.o===x.autor;if(ok)pts++;
    app.querySelectorAll("button[data-o]").forEach(z=>z.disabled=true);
    document.getElementById("r").innerHTML=`<p class="${ok?"ok":"ko"}">${ok?"¡Exacto!":"Nooo. Era "+(nombres[x.autor]||x.autor)}</p><button id="n">Siguiente</button>`;
    document.getElementById("n").onclick=()=>{i++;pinta();};
  });
}
pinta();
})().catch(e=>{document.getElementById("app").textContent="No he podido cargar el quiz.";console.error(e)});
