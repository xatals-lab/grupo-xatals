/* Quiz de la semana. Options are shuffled on every play, so the correct answer is never always the first one.
   "correcta" is a number (single answer) or an array of numbers (several correct answers: tick them all, then confirm). */
(async()=>{
const q=await cargaJSON("quiz_semana"),app=document.getElementById("app");
let i=0,pts=0,aciertos=0,t0=0;
const preg=q.preguntas.map(x=>{const ok=new Set([].concat(x.correcta));const o=baraja(x.opciones.map((t,k)=>({t,ok:ok.has(k)})));return {...x,o,multi:Array.isArray(x.correcta)&&x.correcta.length>1};});
function intro(){app.innerHTML=`<h2>${q.titulo||"Quiz de la semana"}</h2><span class="pill">Semana ${q.semana}</span><p>${preg.length} preguntas con lo que hemos hablado esta semana. Algunas tienen <b>varias respuestas correctas</b>: márcalas todas. Cada acierto vale 100 puntos y hay hasta 50 extra por ir rápido. Competís en diferido: el Hall of Fame decide.</p><button id="go">▶ ¡Vamos! Hasta luego, Koi</button>`;document.getElementById("go").onclick=pinta;}
function pinta(){
  if(i>=preg.length)return fin();
  const x=preg[i];t0=performance.now();
  app.innerHTML=`<p class="medal">PREGUNTA ${i+1}/${preg.length} · ${pts} PTS ${x.multi?"· VARIAS RESPUESTAS":""}</p><h2>${x.pregunta}</h2>${x.multi?"<p><i>Marca todas las correctas y pulsa Confirmar.</i></p>":""}`+x.o.map((o,k)=>`<button class="opt sec" data-k="${k}">${x.multi?"☐ ":""}${o.t}</button>`).join("<br>")+(x.multi?`<br><button id="conf" class="cian">✔ Confirmar</button>`:"")+`<div id="r"></div>`;
  const bt=[...app.querySelectorAll(".opt")];
  function resolver(sel){
    const seg=(performance.now()-t0)/1000;bt.forEach(b=>b.disabled=true);if(document.getElementById("conf"))document.getElementById("conf").disabled=true;
    const total=x.o.filter(o=>o.ok).length,bien=sel.filter(k=>x.o[k].ok).length,mal=sel.filter(k=>!x.o[k].ok).length;
    const perfecto=bien===total&&mal===0;
    const ganado=Math.max(0,Math.round((100*(bien-mal*.5)/total)+(perfecto?Math.max(0,50-seg*5):0)));pts+=ganado;if(perfecto)aciertos++;
    bt.forEach((b,k)=>{b.classList.remove("sec");b.style.background=x.o[k].ok?"#39ff14":(sel.includes(k)?"#ff3b30":"#333");b.style.color=x.o[k].ok||sel.includes(k)?"#000":"#aaa";});
    sonido(perfecto?760:150,.15);
    document.getElementById("r").innerHTML=`<p class="${perfecto?"ok":"ko"}"><b>${perfecto?euOk()+"¡Clavado!":bien?euKo()+"A medias: "+bien+" de "+total+" correctas":euKo()+"Nooo."}</b> +${ganado}</p>${x.dato?`<p>💡 ${x.dato}</p>`:""}<button id="n">Siguiente ➡</button>`;
    document.getElementById("n").onclick=()=>{i++;pinta();};
  }
  if(x.multi){bt.forEach(b=>b.onclick=()=>{b.dataset.s=b.dataset.s==="1"?"0":"1";b.textContent=(b.dataset.s==="1"?"☑ ":"☐ ")+x.o[+b.dataset.k].t;b.style.outline=b.dataset.s==="1"?"3px solid var(--cian)":"";});
    document.getElementById("conf").onclick=()=>resolver(bt.filter(b=>b.dataset.s==="1").map(b=>+b.dataset.k));}
  else bt.forEach(b=>b.onclick=()=>resolver([+b.dataset.k]));
}
function fin(){
  app.innerHTML=`<h2>Fin del quiz</h2><p>${aciertos} de ${preg.length} perfectas · <b>${pts}</b> puntos.</p><p>${aciertos===preg.length?"Memoria de elefante vitoriano.":aciertos>=preg.length*.6?"Bien, pero no sois el Bacterio.":"Habéis estado en la barra y se nota."}</p>`;
  panelRecord(document.getElementById("rec"),"quiz",pts,"Puntos del quiz de la semana "+q.semana);
}
intro();
})().catch(e=>{document.getElementById("app").textContent="No he podido cargar el quiz de la semana.";console.error(e)});
