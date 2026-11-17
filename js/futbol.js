/* Tejedor al fútbol: penalty shootout, 5 each. He reads you (hard on purpose). Press the button to stop the aim bar, then you keep goal. */
(()=>{
const $=id=>document.getElementById(id);
const LADOS=["izquierda","centro","derecha"];
let ronda,yo,el,fase="",medidor=0,dir=1,raf=0,lado=1,esperaPara=null,puntos;
function marc(){$("marc").textContent=`TÚ ${yo} - ${el} TEJEDOR`;$("ronda").textContent=`Ronda ${Math.min(ronda+1,5)}/5`;}
function msg(t){$("msg").textContent=t;}
function mueveMedidor(){medidor+=dir*(1.6+ronda*.35);if(medidor>=100){medidor=100;dir=-1}if(medidor<=0){medidor=0;dir=1}$("medidor").style.width=medidor+"%";raf=requestAnimationFrame(mueveMedidor);}
function setLado(i){lado=i;[0,1,2].forEach(k=>{$("b"+k).className=k===i?"":"sec";});}
async function chuta(){
  if(fase!=="chuta")return;fase="";cancelAnimationFrame(raf);
  const calidad=Math.abs(medidor-50);                   // 0 = perfect, 50 = awful
  const tejedorAdivina=Math.random()<.68;               // he guesses your side 68% of the time
  const fuera=calidad>40, parada=tejedorAdivina&&calidad>10;
  const esquina=lado!==1;
  let res;
  if(fuera){res="🚀 ¡Al segundo anfiteatro! Fuera.";}
  else if(tejedorAdivina&&(calidad>10||!esquina)){res="🧤 Tejedor la para y te mira con cara de 20 años.";}
  else{res="⚽ ¡GOOOL! Tejedor no se lo cree.";yo++;puntos+=150+Math.round((40-calidad)*2);}
  msg(res);marc();await esperar(1300);
  // his turn
  msg("Ahora paras tú: elige lado y pulsa LÁNZATE");fase="para";setLado(1);$("para").textContent="🧤 LÁNZATE";
  esperaPara=await new Promise(r=>{$("para").onclick=()=>r(lado);});
  fase="";
  const chut=Math.floor(Math.random()*3);               // he shoots anywhere
  if(chut===esperaPara){msg("🧤 ¡Paradón! +100");puntos+=100;}
  else{msg("💥 Tejedor te la mete por "+LADOS[chut]+" y celebra a patadas.");el++;}
  marc();await esperar(1400);
  ronda++;
  if(ronda>=5||yo-el>2||el-yo>(5-ronda))return fin();
  siguiente();
}
function siguiente(){medidor=0;dir=1;fase="chuta";msg("Para la barra en el centro: ¡CHUTA!");$("para").textContent="⚽ CHUTA";$("para").onclick=chuta;setLado(1);cancelAnimationFrame(raf);mueveMedidor();}
function fin(){
  fase="";cancelAnimationFrame(raf);
  const r=yo>el?"🏆 ¡HAS GANADO A TEJEDOR! Eres leyenda en Marianistas.":yo===el?"🤝 Empate. Tejedor acaba la tanda a patadas igualmente.":"😭 Pierdes. Tejedor se va a calentar, claro.";
  puntos+=(yo>el?500:yo===el?150:0);msg(r);$("start").disabled=false;
  panelRecord($("rec"),"futbol",puntos,"Puntos del partido");
}
function empieza(){ronda=0;yo=0;el=0;puntos=0;$("rec").innerHTML="";$("start").disabled=true;marc();siguiente();}
$("start").onclick=empieza;[0,1,2].forEach(k=>$("b"+k).onclick=()=>setLado(k));
document.addEventListener("keydown",e=>{if(e.key===" "){e.preventDefault();if(fase==="chuta")chuta();else if(fase==="para")$("para").click();}else if(e.key==="ArrowLeft")setLado(0);else if(e.key==="ArrowUp")setLado(1);else if(e.key==="ArrowRight")setLado(2);});
})();
