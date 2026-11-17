/* XP, niveles, racha, retos diarios, insignias, bromitas y tarjeta para compartir. Todo en localStorage (por dispositivo).
   Mecánicas de retención usadas (de la investigación de diseño de juegos): progreso visible con barra y niveles (efecto progreso dotado),
   racha diaria con bonus (aversión a la pérdida, suave), retos diarios cortos, recompensas variables (cofre sorpresa), coleccionables (insignias),
   comparación social (Hall of Fame + tarjeta para enseñar a los amigos). Sin trampas: aquí se viene a reír 5 minutos. */
const NIVELES=["Pringao de barra","Aprendiz de caña","Delegado de clase","Aprobado raspadillo","Habitual de la Blanca","Quinto hombre","Experto en servicios mínimos","Superviviente del Maketo","Leyenda del Kupula","Xatal supremo"];
const xpNivel=n=>Math.round(120*Math.pow(n,1.55)); // XP acumulada para llegar al nivel n+1
const hoy=()=>new Date().toISOString().slice(0,10);
const RETOS=[["jugar2","Juega 2 juegos distintos"],["quiz","Haz el quiz de la semana"],["paneles","Mira los Paneles"],["record","Manda un récord a Hermek"],["suspende","Suspende con el Maketo (o con el Bacterio)"],["lab","Toca el Laboratorio"],["chiste","Ríete con 3 chistes"]];
function perfil(){let p;try{p=JSON.parse(localStorage.getItem("xatals_perfil")||"null");}catch(e){}p=p||{xp:0,visitas:{},racha:0,ultimo:"",insignias:{},juegos:{},retos:{dia:"",hechos:[],lista:[]},chistes:0};return p;}
function guarda(p){localStorage.setItem("xatals_perfil",JSON.stringify(p));pintaChip();}
function nivelDe(xp){let n=1;while(xp>=xpNivel(n))n++;return n;}
function infoNivel(xp){const n=nivelDe(xp),base=n>1?xpNivel(n-1):0,top=xpNivel(n);return {n,nombre:NIVELES[Math.min(n-1,NIVELES.length-1)],base,top,pct:Math.round((xp-base)/(top-base)*100)};}
function toast(html,ms=3200,cls=""){let c=document.getElementById("toasts");if(!c){c=document.createElement("div");c.id="toasts";document.body.append(c);}
  const t=document.createElement("div");t.className="toast "+cls;t.innerHTML=html;c.append(t);requestAnimationFrame(()=>t.classList.add("in"));setTimeout(()=>{t.classList.remove("in");setTimeout(()=>t.remove(),400);},ms);}
function ganaXP(n,motivo){const p=perfil(),antes=nivelDe(p.xp);p.xp+=n;const despues=nivelDe(p.xp);guarda(p);
  toast(`⭐ <b>+${n} XP</b> ${motivo||""}`,2600);
  if(despues>antes){sonido(880,.15);setTimeout(()=>sonido(1180,.2),160);confeti();setTimeout(()=>toast(`🎉 <b>¡Nivel ${despues}!</b> Ahora eres: <b>${NIVELES[Math.min(despues-1,NIVELES.length-1)]}</b>`,5200,"nivel"),700);insignia("nivel"+despues,"Nivel "+despues+": "+NIVELES[Math.min(despues-1,NIVELES.length-1)],true);}}
function insignia(id,titulo,silencio){const p=perfil();if(p.insignias[id])return;p.insignias[id]={t:titulo,f:hoy()};guarda(p);if(!silencio)toast(`🏅 <b>Insignia:</b> ${titulo}`,4200,"insig");}
function reto(id){const p=perfil();asegurarRetos(p);if(!p.retos.lista.includes(id)||p.retos.hechos.includes(id))return;p.retos.hechos.push(id);guarda(p);ganaXP(40,"reto cumplido");if(p.retos.hechos.length===p.retos.lista.length)setTimeout(cofre,1200);}
function asegurarRetos(p){if(p.retos.dia!==hoy()){const sem=hoy().split("-").join("")*1;p.retos={dia:hoy(),hechos:[],lista:baraja(RETOS.map(r=>r[0])).slice(0,3)};}}
function cofre(){const premios=[[60,"un cofre de cañas"],[100,"el voto de Don Héctor"],[150,"un pintxo de oro"],[250,"la camiseta del Alavés del 98"]];const r=azar(premios);ganaXP(r[0],"🎁 cofre sorpresa: "+r[1]);}
function entraHoy(){const p=perfil();asegurarRetos(p);const h=hoy();
  if(p.ultimo!==h){const ayer=new Date(Date.now()-864e5).toISOString().slice(0,10);p.racha=p.ultimo===ayer?p.racha+1:1;p.ultimo=h;guarda(p);const bonus=Math.min(50,10*p.racha);setTimeout(()=>{ganaXP(bonus,`racha de ${p.racha} día${p.racha>1?"s":""} 🔥`);if(p.racha===3)insignia("racha3","3 días seguidos: ya eres de la cuadrilla");if(p.racha===7)insignia("racha7","Una semana entera: adicto a los chistes");},1500);}
  const pag=location.pathname.split("/").pop()||"index.html";if(p.visitas[pag]!==h){p.visitas[pag]=h;guarda(p);if(pag!=="index.html")setTimeout(()=>ganaXP(10,"por visitar "+(document.title.split(" · ")[0]||pag)),2200);}
  if(pag==="paneles.html")reto("paneles");if(pag==="laboratorio.html")reto("lab");if(pag==="quizsemana.html"){}}
function xpJuego(juego,puntos){const p=perfil();const mejor=p.juegos[juego]||0;const primera=!(juego in p.juegos);p.juegos[juego]=Math.max(mejor,puntos);guarda(p);
  const n=Object.keys(p.juegos).length;ganaXP(20+Math.round(puntos/12)+(puntos>mejor?25:0),puntos>mejor?"y récord personal":"por jugar");
  if(primera&&n===1)insignia("primero","Primera partida: bienvenido al bar");if(n===5)insignia("cinco","5 juegos distintos probados");if(n===10)insignia("diez","10 juegos: no tienes vida social");
  const hoyJ=p.retos.jugados&&p.retos.jugados.dia===hoy()?p.retos.jugados:{dia:hoy(),ids:[]};if(!hoyJ.ids.includes(juego))hoyJ.ids.push(juego);p.retos.jugados=hoyJ;guarda(p);if(hoyJ.ids.length>=2)reto("jugar2");if(juego==="quiz")reto("quiz");}
function pintaChip(){const p=perfil(),i=infoNivel(p.xp);let c=document.getElementById("xpchip");if(!c){const h=document.querySelector("header.top");if(!h)return;c=document.createElement("button");c.id="xpchip";c.className="sec";c.onclick=abrePerfil;h.append(c);}
  c.innerHTML=`<span class="xpn">Nv ${i.n}</span><span class="xpb"><i style="width:${i.pct}%"></i></span><span class="xpt">${p.racha>0?"🔥"+p.racha:""}</span>`;c.title=`${i.nombre}: ${p.xp} XP`;}
function abrePerfil(){const p=perfil();asegurarRetos(p);const i=infoNivel(p.xp);let m=document.getElementById("modalPerfil");if(m)m.remove();m=document.createElement("div");m.id="modalPerfil";m.className="modal";
  const ins=Object.values(p.insignias).map(x=>`<span class="pill">🏅 ${x.t}</span>`).join(" ")||"<i>Aún sin insignias: juega y se llenará.</i>";
  const rt=p.retos.lista.map(id=>{const r=RETOS.find(x=>x[0]===id);const h=p.retos.hechos.includes(id);return `<li>${h?"✅":"⬜"} ${r[1]}</li>`}).join("");
  m.innerHTML=`<div class="modal-in"><button class="sec cerrar">✕</button><h2>Tu perfil Xatal</h2><p class="medal">NIVEL ${i.n} · ${i.nombre.toUpperCase()}</p><div class="bar"><i style="width:${i.pct}%"></i></div><p>${p.xp} XP · te faltan ${i.top-p.xp} para el nivel ${i.n+1} · racha: 🔥 ${p.racha} día(s)</p><h3>Retos de hoy</h3><ul>${rt}</ul><p style="color:#aaa;font-size:.85rem">Cumple los 3 y se abre un cofre sorpresa.</p><h3>Insignias</h3><p>${ins}</p><p><button id="compartir" class="rosa">📸 Tarjeta para presumir</button></p><canvas id="tarjeta" width="900" height="500" style="width:100%;border-radius:14px;display:none"></canvas></div>`;
  document.body.append(m);m.querySelector(".cerrar").onclick=()=>m.remove();m.onclick=e=>{if(e.target===m)m.remove();};
  m.querySelector("#compartir").onclick=()=>tarjeta(p,i);}
function tarjeta(p,i){const c=document.getElementById("tarjeta");c.style.display="block";const g=c.getContext("2d");
  const gr=g.createLinearGradient(0,0,900,500);gr.addColorStop(0,"#1a0a2e");gr.addColorStop(1,"#0a0a12");g.fillStyle=gr;g.fillRect(0,0,900,500);
  g.strokeStyle="#ffe500";g.lineWidth=6;g.strokeRect(20,20,860,460);g.fillStyle="#ff2e93";g.fillRect(20,20,860,10);
  g.fillStyle="#ffe500";g.font="bold 70px Bangers, Impact, sans-serif";g.fillText("GRUPO XATALS",50,110);
  g.fillStyle="#fff";g.font="bold 44px Sora, sans-serif";g.fillText("Nivel "+i.n+" · "+i.nombre,50,190);
  g.fillStyle="#00e5ff";g.font="32px Sora, sans-serif";g.fillText(p.xp+" XP   🔥 racha "+p.racha+"   🏅 "+Object.keys(p.insignias).length+" insignias",50,245);
  g.fillStyle="#333";g.fillRect(50,280,800,34);g.fillStyle="#39ff14";g.fillRect(50,280,800*i.pct/100,34);
  g.fillStyle="#ddd";g.font="26px Sora, sans-serif";const mj=Object.entries(p.juegos).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([k,v])=>k.replace("mj-","")+": "+v).join("   ·   ");g.fillText(mj||"Todavía sin récords: ¿a qué esperas?",50,370);
  g.fillStyle="#ffe500";g.font="24px Permanent Marker, cursive";g.fillText("¿A que no me superas? educadug.github.io/grupo-xatals",50,440);
  c.toBlob(b=>{const f=new File([b],"mi-nivel-xatal.png",{type:"image/png"});if(navigator.canShare&&navigator.canShare({files:[f]}))navigator.share({files:[f],text:"Mi nivel en Grupo Xatals"}).catch(()=>{});else{const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="mi-nivel-xatal.png";a.click();}});}
/* bromitas: a joke now and then, after something you did */
let _chistes=null,_ultimaBroma=0;async function bromita(){if(Date.now()-_ultimaBroma<30000||document.querySelectorAll(".toast").length>=2)return;_ultimaBroma=Date.now();try{_chistes=_chistes||await (await fetch("data/chistes.json")).json();}catch(e){return;}
  const c=azar(_chistes);toast(`😂 ${c.texto}`,5200,"broma");const p=perfil();p.chistes=(p.chistes||0)+1;guarda(p);if(p.chistes>=3)reto("chiste");}
function maquina(el,vel=22){if(!el||matchMedia("(prefers-reduced-motion: reduce)").matches)return;const t=el.textContent;if(!t)return;el.textContent="";el.classList.add("escribiendo");let i=0;const iv=setInterval(()=>{el.textContent=t.slice(0,++i);if(i>=t.length){clearInterval(iv);el.classList.remove("escribiendo");}},vel);}
document.addEventListener("DOMContentLoaded",()=>{pintaChip();entraHoy();maquina(document.querySelector("main h1"),28);document.querySelectorAll(".escribe").forEach(e=>maquina(e,12));
  let n=0;document.addEventListener("click",e=>{if(e.target.closest("button,a.card")){n++;if(n%9===0&&Math.random()<.7)bromita();}});
  setTimeout(()=>{if(Math.random()<.5)bromita();},14000);});
