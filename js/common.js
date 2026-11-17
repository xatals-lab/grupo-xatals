document.documentElement.classList.add("js");
const SITE_URL="https://educadug.github.io/grupo-xatals/";
const SALT="xatals-2026";
const JUGADORES={dug:"Dug",hrk:"HRK (Héctor)",koi:"Koi (Íñigo)"};
const NAV=[["index.html","Inicio"],["juegos.html","Juegos"],["paneles.html","Paneles"],["quizsemana.html","Quiz semanal"],["records.html","Hall of Fame"],["chistes.html","Chistes"],["semana.html","Esta semana"]];
const AGRUPA={"bar.html":"juegos.html","recreo.html":"juegos.html","futbol.html":"juegos.html","examen.html":"juegos.html","apuestas.html":"juegos.html","quiz.html":"juegos.html","mj.html":"juegos.html"};
function pintaCabecera(){
  let actual=location.pathname.split("/").pop()||"index.html";actual=AGRUPA[actual]||actual;
  const h=document.createElement("header");h.className="top";
  h.innerHTML='<a class="logo" href="index.html">XATALS</a><nav>'+NAV.map(([u,t])=>`<a href="${u}" class="${u===actual?"on":""}">${t}</a>`).join("")+"</nav>";
  document.body.prepend(h);
  const f=document.createElement("footer");f.textContent="Grupo Xatals · todo exagerado e inventado con cariño · lo actualiza Hermek cada viernes";document.body.append(f);
  document.querySelectorAll(".card").forEach(c=>{
    c.addEventListener("mousemove",e=>{const r=c.getBoundingClientRect();c.style.setProperty("--ry",((e.clientX-r.left)/r.width-.5)*14+"deg");c.style.setProperty("--rx",(-((e.clientY-r.top)/r.height-.5))*14+"deg");});
    c.addEventListener("mouseleave",()=>{c.style.setProperty("--rx","0deg");c.style.setProperty("--ry","0deg");});
  });
  const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add("in");io.unobserve(x.target);}}),{threshold:.1});
  document.querySelectorAll(".rev").forEach((e,i)=>{e.style.transitionDelay=(i%6)*70+"ms";io.observe(e);});
}
async function cargaJSON(nombre){const r=await fetch("data/"+nombre+".json?v="+Date.now());if(!r.ok)throw new Error(nombre);return r.json();}
const azar=a=>a[Math.floor(Math.random()*a.length)];
function baraja(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const acota=(n,a=0,b=100)=>Math.max(a,Math.min(b,n));
const esperar=ms=>new Promise(r=>setTimeout(r,ms));
/* ---- scores: no server. A game ends with a signed code the player sends to Hermek, who records it. ---- */
function hash(s){let h=5381;for(let i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))>>>0;return h.toString(16);}
function semanaISO(d=new Date()){const t=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));const n=t.getUTCDay()||7;t.setUTCDate(t.getUTCDate()+4-n);const y=new Date(Date.UTC(t.getUTCFullYear(),0,1));return t.getUTCFullYear()+"-W"+String(Math.ceil(((t-y)/864e5+1)/7)).padStart(2,"0");}
function codigoRecord(juego,jug,puntos){const sem=semanaISO();return `XT:${juego}:${jug}:${puntos}:${sem}:${hash(`${juego}|${jug}|${puntos}|${sem}|${SALT}`)}`;}
function panelRecord(el,juego,puntos,etiqueta){
  puntos=Math.max(0,Math.round(puntos));
  const guardado=localStorage.getItem("xatals_jugador");
  el.innerHTML=`<div class="panel"><h3>🏆 ${etiqueta||"Tu puntuación"}: ${puntos}</h3><p>¿Quién eres? <select id="selJ">${Object.entries(JUGADORES).map(([k,v])=>`<option value="${k}" ${k===guardado?"selected":""}>${v}</option>`).join("")}</select></p>
  <div class="codebox" id="cod"></div><p><button id="cp">📋 Copiar código</button><a class="btn rosa" id="tg" target="_blank" rel="noopener">✈️ Enviar a Hermek por Telegram</a></p>
  <p style="font-size:.85rem;color:#aaa">Pega el código en el grupo y Hermek lo apunta en el Hall of Fame. Lo apunta aunque no estés a la vez que los demás: aquí se compite en diferido.</p></div>`;
  const sel=el.querySelector("#selJ");
  function act(){const c=codigoRecord(juego,sel.value,puntos);localStorage.setItem("xatals_jugador",sel.value);el.querySelector("#cod").textContent=c;
    el.querySelector("#tg").href="https://t.me/share/url?url="+encodeURIComponent(SITE_URL)+"&text="+encodeURIComponent("Hermek, apunta mi récord en el Hall of Fame: "+c);
    el.querySelector("#cp").onclick=()=>{navigator.clipboard&&navigator.clipboard.writeText(c);el.querySelector("#cp").textContent="✅ Copiado";};}
  sel.onchange=act;act();
}
/* ---- arcade feel: retro beeps (mutable) and confetti ---- */
let _ac=null;function sonido(f,d=.1){if(localStorage.getItem("xatals_mute")==="1")return;try{_ac=_ac||new (window.AudioContext||window.webkitAudioContext)();const o=_ac.createOscillator(),g=_ac.createGain();o.type="square";o.frequency.value=f;g.gain.value=.05;o.connect(g);g.connect(_ac.destination);o.start();o.stop(_ac.currentTime+d);}catch(e){}}
function confeti(){if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;const c=document.createElement("canvas");c.style.cssText="position:fixed;inset:0;pointer-events:none;z-index:120";c.width=innerWidth;c.height=innerHeight;document.body.append(c);const x=c.getContext("2d"),cols=["#ffe500","#ff2e93","#00e5ff","#39ff14","#fff"];const p=Array.from({length:120},()=>({x:innerWidth/2,y:innerHeight*.6,vx:(Math.random()-.5)*14,vy:-Math.random()*16-4,s:4+Math.random()*6,c:azar(cols),r:Math.random()*6}));let n=0;(function f(){x.clearRect(0,0,c.width,c.height);p.forEach(q=>{q.x+=q.vx;q.y+=q.vy;q.vy+=.45;q.r+=.2;x.fillStyle=q.c;x.save();x.translate(q.x,q.y);x.rotate(q.r);x.fillRect(-q.s/2,-q.s/2,q.s,q.s*.6);x.restore();});if(++n<110)requestAnimationFrame(f);else c.remove();})();}
document.addEventListener("DOMContentLoaded",()=>{pintaCabecera();const m=document.createElement("button");m.className="sec mute";m.title="Sonido";const u=()=>m.textContent=localStorage.getItem("xatals_mute")==="1"?"🔇":"🔊";u();m.onclick=()=>{localStorage.setItem("xatals_mute",localStorage.getItem("xatals_mute")==="1"?"0":"1");u();};document.querySelector("header.top").append(m);});
