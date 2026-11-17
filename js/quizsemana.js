/* Quiz de la semana: questions written by Hermek from what the group talked about this week (data/quiz_semana.json). */
(async()=>{
const q=await cargaJSON("quiz_semana"),app=document.getElementById("app");
let i=0,pts=0,aciertos=0,t0=0;const preg=q.preguntas;
function intro(){app.innerHTML=`<h2>${q.titulo||"Quiz de la semana"}</h2><span class="pill">Semana ${q.semana}</span><p>${preg.length} preguntas con todo lo que hemos hablado esta semana. Cada acierto vale 100 puntos más hasta 50 de bonus por ir rápido. Compites en diferido: todos juegan cuando quieren y el Hall of Fame decide.</p><button id="go">▶ ¡Vamos!</button>`;document.getElementById("go").onclick=pinta;}
function pinta(){
  if(i>=preg.length)return fin();
  const x=preg[i];t0=performance.now();
  app.innerHTML=`<p class="medal">PREGUNTA ${i+1}/${preg.length} · ${pts} PTS</p><h2>${x.pregunta}</h2>`+x.opciones.map((o,k)=>`<button data-k="${k}">${o}</button>`).join("<br>")+`<div id="r"></div>`;
  app.querySelectorAll("button").forEach(b=>b.onclick=()=>{
    const ok=+b.dataset.k===x.correcta,seg=(performance.now()-t0)/1000;
    app.querySelectorAll("button[data-k]").forEach(z=>z.disabled=true);
    if(ok){aciertos++;pts+=100+Math.max(0,Math.round(50-seg*5));}
    document.getElementById("r").innerHTML=`<p class="${ok?"ok":"ko"}"><b>${ok?"¡Clavado!":"Nooo. Era: "+x.opciones[x.correcta]}</b></p>${x.dato?`<p>💡 ${x.dato}</p>`:""}<button id="n">Siguiente ➡</button>`;
    document.getElementById("n").onclick=()=>{i++;pinta();};
  });
}
function fin(){
  app.innerHTML=`<h2>Fin del quiz</h2><p>${aciertos} de ${preg.length} aciertos · <b>${pts}</b> puntos.</p><p>${aciertos===preg.length?"Memoria de elefante vitoriano.":aciertos>=preg.length*.6?"Bien, pero no sois el Bacterio.":"Habéis estado en la barra y se nota."}</p>`;
  panelRecord(document.getElementById("rec"),"quiz",pts,"Puntos del quiz de la semana "+q.semana);
}
intro();
})().catch(e=>{document.getElementById("app").textContent="No he podido cargar el quiz de la semana.";console.error(e)});
