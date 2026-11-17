/* Copiar al Bacterio: hold to copy Koi's paper while the Bacterio has his back turned. Release when he turns. */
(()=>{
const $=id=>document.getElementById(id);
let vivo=false,copia=false,cop=0,sos=0,t=60,estado="espalda",resto=0,ultimo=0;
const CARAS={espalda:"🧪",aviso:"🤨",mirando:"👀"};
function hud(){$("cop").style.width=cop+"%";$("sos").style.width=sos+"%";$("tiempo").textContent=Math.ceil(t)+"s";}
function cambia(){
  const dif=Math.min(1,(60-t)/60);
  if(estado==="espalda"){estado="aviso";resto=.75-.3*dif;$("msg").textContent="🤨 ¡Se huele algo!";}
  else if(estado==="aviso"){estado="mirando";resto=1+Math.random()*.9;$("msg").textContent="👀 ¡TE MIRA! SUELTA";}
  else{estado="espalda";resto=1.2+Math.random()*(2.4-dif);$("msg").textContent="Se gira... copia, copia";}
  $("bac").textContent=CARAS[estado];
}
function tick(now){
  if(!vivo)return;
  const dt=Math.min(.1,(now-ultimo)/1000);ultimo=now;
  t-=dt;resto-=dt;if(resto<=0)cambia();
  if(copia){
    if(estado==="mirando")sos+=95*dt;else if(estado==="aviso")sos+=28*dt;else{cop+=(100/9)*dt;sos=Math.max(0,sos-8*dt);}
  }else sos=Math.max(0,sos-18*dt);
  cop=Math.min(100,cop);sos=Math.min(100,sos);hud();
  if(cop>=100)return fin(true);if(sos>=100)return fin(false);if(t<=0)return fin(false,true);
  setTimeout(()=>tick(performance.now()),33);
}
function fin(gana,tiempo){
  vivo=false;copia=false;$("start").disabled=false;
  const pts=gana?500+Math.round(t*10)+Math.round((100-sos)*2):Math.round(cop*3);
  $("msg").textContent=gana?"🏆 Copiado entero. El Bacterio no se entera. Aprobado... con un cinco.":tiempo?"⏰ Se acaba el tiempo. Examen en blanco.":"🚨 ¡Pillado! «Vaya examen, señor Urrutia, vaya examen.»";
  $("bac").textContent=gana?"😴":"😠";
  panelRecord($("rec"),"examen",pts,"Puntos del examen");
}
function empieza(){cop=0;sos=0;t=60;estado="espalda";resto=1.5;copia=false;vivo=true;$("rec").innerHTML="";$("start").disabled=true;$("bac").textContent="🧪";$("msg").textContent="Mantén COPIAR cuando no mire";ultimo=performance.now();setTimeout(()=>tick(performance.now()),33);}
const b=$("copia");
["mousedown","touchstart"].forEach(ev=>b.addEventListener(ev,e=>{e.preventDefault();copia=true;}));
["mouseup","mouseleave","touchend","touchcancel"].forEach(ev=>b.addEventListener(ev,()=>{copia=false;}));
document.addEventListener("keydown",e=>{if(e.key===" "){e.preventDefault();copia=true;}});
document.addEventListener("keyup",e=>{if(e.key===" ")copia=false;});
$("start").onclick=empieza;
})();
