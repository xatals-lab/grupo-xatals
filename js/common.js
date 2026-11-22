document.documentElement.classList.add("js");
const SITE_URL="https://xatals-lab.github.io/grupo-xatals/";
const SALT="xatals-2026";
const JUGADORES={dug:"Dug",hrk:"HRK (Héctor)",koi:"Koi (Íñigo)"};
const NAV=[["index.html","Inicio"],["juegos.html","Juegos"],["laboratorio.html","Laboratorio"],["paneles.html","Paneles"],["quizsemana.html","Quiz semanal"],["records.html","Hall of Fame"],["chistes.html","Chistes"],["semana.html","Esta semana"],["claustro.html","Claustro"],["recursos.html","Recursos"]];
const AGRUPA={"bar.html":"juegos.html","recreo.html":"juegos.html","futbol.html":"juegos.html","examen.html":"juegos.html","apuestas.html":"juegos.html","quiz.html":"juegos.html","mj.html":"juegos.html","mus.html":"juegos.html","examen-maketo.html":"juegos.html"};
function pintaCabecera(){
  let actual=location.pathname.split("/").pop()||"index.html";actual=AGRUPA[actual]||actual;
  const h=document.createElement("header");h.className="top";
  h.innerHTML='<a class="logo" href="index.html">XATALS</a><nav>'+NAV.map(([u,t])=>`<a href="${u}" class="${u===actual?"on":""}">${t}</a>`).join("")+"</nav>";
  document.body.prepend(h);
  const f=document.createElement("footer");f.innerHTML="Grupo Xatals · todo exagerado e inventado con cariño · lo actualiza Hermek cada viernes · <a href='creditos.html' style='color:#c9b27a'>📸 créditos</a>";document.body.append(f);
  fetch("data/euskera.json?v="+Date.now()).then(r=>r.json()).then(d=>{const w=azar(d.palabras);const p=document.createElement("p");p.className="euskera";p.innerHTML=`🗣️ <b>Gaurko hitza</b> (palabra del día): <b>${w.eu}</b> = ${w.es}. <i>${w.chiste||""}</i>`;f.prepend(p);}).catch(()=>{});
  document.querySelectorAll(".card").forEach(c=>{
    c.addEventListener("mousemove",e=>{const r=c.getBoundingClientRect();c.style.setProperty("--ry",((e.clientX-r.left)/r.width-.5)*14+"deg");c.style.setProperty("--rx",(-((e.clientY-r.top)/r.height-.5))*14+"deg");});
    c.addEventListener("mouseleave",()=>{c.style.setProperty("--rx","0deg");c.style.setProperty("--ry","0deg");});
  });
  const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add("in");io.unobserve(x.target);}}),{threshold:.1});
  const bl=[...document.querySelectorAll(".bloque")];
  if(bl.length&&!matchMedia("(prefers-reduced-motion: reduce)").matches){
    bl.forEach((e,i)=>{e.dataset.dx=[-110,110,0,-70,70][i%5];e.dataset.dy=[90,120,160][i%3];e.dataset.r=[-7,7,0,-4,4][i%5];});
    const upd=()=>{const vh=innerHeight;bl.forEach(e=>{const r=e.getBoundingClientRect();const p=Math.max(0,Math.min(1,(vh*.96-r.top)/(vh*.5)));const q=1-(1-p)*(1-p);e.style.opacity=(.1+.9*q).toFixed(3);e.style.transform=`translate3d(${(e.dataset.dx*(1-q)).toFixed(1)}px,${(e.dataset.dy*(1-q)).toFixed(1)}px,0) rotate(${(e.dataset.r*(1-q)).toFixed(2)}deg) scale(${(.9+.1*q).toFixed(3)})`;});};
    addEventListener("scroll",()=>requestAnimationFrame(upd),{passive:true});addEventListener("resize",upd);upd();
  }
  document.querySelectorAll(".card").forEach(c=>c.addEventListener("pointermove",e=>{const r=c.getBoundingClientRect();c.style.setProperty("--mx",(e.clientX-r.left)+"px");c.style.setProperty("--my",(e.clientY-r.top)+"px");}));
  document.querySelectorAll(".rev").forEach((e,i)=>{e.style.transitionDelay=(i%6)*70+"ms";io.observe(e);});
}
async function cargaJSON(nombre){const r=await fetch("data/"+nombre+".json?v="+Date.now());if(!r.ok)throw new Error(nombre);return r.json();}
const azar=a=>a[Math.floor(Math.random()*a.length)];
function baraja(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const acota=(n,a=0,b=100)=>Math.max(a,Math.min(b,n));
const esperar=ms=>new Promise(r=>setTimeout(r,ms));
const EU_OK=["Ederra!","Aupa!","Bikain!","Zorionak!","Gora zu!","Ene ba!"],EU_KO=["Ai ama!","Gaizki...","Ez da posible!","Ostras, bai ba!","Aizu!"];
const euOk=()=>Math.random()<.45?azar(EU_OK)+" ":"";const euKo=()=>Math.random()<.45?azar(EU_KO)+" ":"";
/* ---- scores: no server. A game ends with a signed code the player sends to Hermek, who records it. ---- */
function hash(s){let h=5381;for(let i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))>>>0;return h.toString(16);}
function semanaISO(d=new Date()){const t=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));const n=t.getUTCDay()||7;t.setUTCDate(t.getUTCDate()+4-n);const y=new Date(Date.UTC(t.getUTCFullYear(),0,1));return t.getUTCFullYear()+"-W"+String(Math.ceil(((t-y)/864e5+1)/7)).padStart(2,"0");}
function codigoRecord(juego,jug,puntos){const sem=semanaISO();return `XT:${juego}:${jug}:${puntos}:${sem}:${hash(`${juego}|${jug}|${puntos}|${sem}|${SALT}`)}`;}
function panelRecord(el,juego,puntos,etiqueta){
  puntos=Math.max(0,Math.round(puntos));
  if(window.xpJuego)xpJuego(juego,puntos);
  const guardado=localStorage.getItem("xatals_jugador");
  el.innerHTML=`<div class="panel"><h3>🏆 ${etiqueta||"Tu puntuación"}: ${puntos}</h3><p>¿Quién eres? <select id="selJ">${Object.entries(JUGADORES).map(([k,v])=>`<option value="${k}" ${k===guardado?"selected":""}>${v}</option>`).join("")}</select></p>
  <div class="codebox" id="cod"></div><p><button id="cp">📋 Copiar código</button><a class="btn rosa" id="tg" target="_blank" rel="noopener">✈️ Enviar a Hermek por Telegram</a></p>
  <p style="font-size:.85rem;color:#aaa">Pega el código en el grupo y Hermek lo apunta en el Hall of Fame. Lo apunta aunque no estés a la vez que los demás: aquí se compite en diferido.</p></div>`;
  const sel=el.querySelector("#selJ");
  function act(){const c=codigoRecord(juego,sel.value,puntos);localStorage.setItem("xatals_jugador",sel.value);el.querySelector("#cod").textContent=c;
    el.querySelector("#tg").href="https://t.me/share/url?url="+encodeURIComponent(SITE_URL)+"&text="+encodeURIComponent("Hermek, apunta mi récord en el Hall of Fame: "+c);
    el.querySelector("#cp").onclick=()=>{navigator.clipboard&&navigator.clipboard.writeText(c);el.querySelector("#cp").textContent="✅ Copiado";if(window.reto)reto("record");};el.querySelector("#tg").onclick=()=>{if(window.reto)reto("record");};}
  sel.onchange=act;act();
}
/* ---- arcade feel: retro beeps (mutable) and confetti ---- */
let _ac=null;function sonido(f,d=.1){if(localStorage.getItem("xatals_mute")==="1")return;try{_ac=_ac||new (window.AudioContext||window.webkitAudioContext)();const o=_ac.createOscillator(),g=_ac.createGain();o.type="square";o.frequency.value=f;g.gain.value=.05;o.connect(g);g.connect(_ac.destination);o.start();o.stop(_ac.currentTime+d);}catch(e){}}
function confeti(){if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;const c=document.createElement("canvas");c.style.cssText="position:fixed;inset:0;pointer-events:none;z-index:120";c.width=innerWidth;c.height=innerHeight;document.body.append(c);const x=c.getContext("2d"),cols=["#ffe500","#ff2e93","#00e5ff","#39ff14","#fff"];const p=Array.from({length:120},()=>({x:innerWidth/2,y:innerHeight*.6,vx:(Math.random()-.5)*14,vy:-Math.random()*16-4,s:4+Math.random()*6,c:azar(cols),r:Math.random()*6}));let n=0;(function f(){x.clearRect(0,0,c.width,c.height);p.forEach(q=>{q.x+=q.vx;q.y+=q.vy;q.vy+=.45;q.r+=.2;x.fillStyle=q.c;x.save();x.translate(q.x,q.y);x.rotate(q.r);x.fillRect(-q.s/2,-q.s/2,q.s,q.s*.6);x.restore();});if(++n<110)requestAnimationFrame(f);else c.remove();})();}
document.addEventListener("DOMContentLoaded",()=>{pintaCabecera();const sb=document.getElementById("start");if(sb)sb.addEventListener("click",()=>{document.body.classList.add("jugando");const a=document.querySelector(".arena");if(a)setTimeout(()=>a.scrollIntoView({block:"start",behavior:"smooth"}),50);},true);const m=document.createElement("button");m.className="sec mute";m.title="Sonido";const u=()=>m.textContent=localStorage.getItem("xatals_mute")==="1"?"🔇":"🔊";u();m.onclick=()=>{localStorage.setItem("xatals_mute",localStorage.getItem("xatals_mute")==="1"?"0":"1");u();};document.querySelector("header.top").append(m);});

/* ---- every card gets a thumbnail: real royalty-free photo when we have one (credits page), else generated gradient + emoji ---- */
const FOTOS = [[/cele[dn]|virgen blanca/, "celedon"], [/dónde está|encuentra|camiseta|multitud/, "multitud"], [/\bmus\b|carta|kupula/, "cartas"], [/tren|renfe|viribay|maquinista|v[ií]a\b/, "tren"],
  [/examen|quiz|pregunta|bacterio/, "examen"], [/claustro|orla|profes|aula|cole\b|santa mar|marianistas/, "aula"], [/futbol|fútbol|penalti|tejedor/, "futbol"], [/alav[eé]s|apuestas|querejeta|bordal|mendizorroza|liga/, "estadio"],
  [/pintxo|torre|gilda/, "pintxos"], [/caña|calimocho|pica\b|txakoli|ronda|\bbar\b/, "cerveza"], [/punk|guitarra|edortha|ritmo|heavy|bogus|concierto/, "guitarra"], [/buxai|recreo|puñet|pelea|bomb/, "boxeo"],
  [/koi|servicios|reuni|papeleo|catálogo|irabi/, "oficina"], [/camino|albergue|peregrin|pr[ií]ncipe/, "camino"], [/chiste|risa|humor/, "risa"], [/panel|datos|dashboard|estad[ií]st/, "datos"], [/laboratorio/, "laboratorio"],
  [/recurso|prensa|noticia|semana|novedad/, "periodico"], [/hall|fame|ranking|r[eé]cord|trofeo/, "trofeo"], [/euskera|vasco|txapela|gaurko/, "txapela"], [/lluvia|euria|paraguas/, "lluvia"], [/vaca/, "vaca"],
  [/\bpc\b|ordenador|phediox|aiksmann|inform[aá]tico|tele\b/, "ordenador"], [/bihl|gimnasio|pesas/, "gimnasio"], [/diiios|globo|grito/, "globo"], [/vitoria|gasteiz|plaza/, "vitoria"]];
let _cred = null; fetch("data/creditos.json").then(r => r.json()).then(d => { _cred = d; miniaturas(); mejoraFotos(); }).catch(() => { _cred = {}; });
function fotoPara(txt) { if (!_cred) return null; for (const [re, k] of FOTOS) if (re.test(txt) && _cred[k]) return k; return null; }
function mejoraFotos(){document.querySelectorAll(".card").forEach(c=>{const th=c.querySelector(".thumb");if(!th||th.classList.contains("conFoto")||c.dataset.img)return;const h3=c.querySelector("h3");const k=fotoPara(((h3?h3.textContent:"")+" "+(c.getAttribute("href")||"")+" "+(c.dataset.tag||"")).toLowerCase());if(!k)return;th.classList.add("conFoto");th.insertAdjacentHTML("afterbegin",`<img class="foto" src="img/${k}.jpg" alt="" loading="lazy" onerror="this.remove()">`);});}
function _hue(s){let h=7;for(const ch of s)h=(h*31+ch.charCodeAt(0))%360;return h;}
function miniaturas(root=document){root.querySelectorAll(".card").forEach(c=>{if(c.querySelector(".thumb"))return;const em=c.querySelector(".em"),h3=c.querySelector("h3");const e=c.dataset.thumb||(em?em.textContent.trim():"");if(!e)return;
  const titulo=h3?h3.textContent:"";const t=document.createElement("div");t.className="thumb";t.style.setProperty("--h",_hue(titulo+e));
  const k=c.dataset.img?null:fotoPara((titulo+" "+(c.getAttribute("href")||"")+" "+(c.dataset.tag||"")).toLowerCase());
  if(k){t.classList.add("conFoto");t.innerHTML=`<img class="foto" src="img/${k}.jpg" alt="" loading="lazy" onerror="this.remove()"><span class="te">${e}</span>`;}else t.innerHTML=`<span class="te">${e}</span>`;
  if(c.dataset.tag)t.insertAdjacentHTML("beforeend",`<span class="tt">${c.dataset.tag}</span>`);
  if(c.dataset.img){const im=document.createElement("img");im.alt="";im.loading="lazy";im.src=c.dataset.img;im.onerror=()=>im.remove();t.append(im);}
  if(em)em.remove();c.prepend(t);});}
document.addEventListener("DOMContentLoaded",()=>{miniaturas();let tm=null;new MutationObserver(()=>{clearTimeout(tm);tm=setTimeout(()=>{miniaturas();mejoraFotos();},60);}).observe(document.body,{childList:true,subtree:true});});

/* ---- who is playing: each friend chooses once; teachers call each one by his school surname ---- */
const APELLIDOS={dug:"Urrutia",hrk:"Roca",koi:"Fernández de Trocóniz"};
function jugadorActual(){const j=localStorage.getItem("xatals_jugador");return JUGADORES[j]?j:null;}
function apellido(){return APELLIDOS[jugadorActual()]||"Urrutia";}
function quienSoy(cb,forzar){const j=jugadorActual();if(j&&!forzar){cb(j);return;}
  const m=document.createElement("div");m.className="modal";m.innerHTML=`<div class="modal-in" style="text-align:center"><h2>¿Quién eres?</h2><p>Los profes te llamarán por tu apellido del cole. Lo eliges una vez y se guarda en este móvil.</p>${Object.entries(JUGADORES).map(([k,v])=>`<button class="${k==="dug"?"":"rosa"}" data-k="${k}" style="display:block;width:100%">${v} · señor ${APELLIDOS[k]}</button>`).join("")}</div>`;
  document.body.append(m);m.querySelectorAll("button").forEach(b=>b.onclick=()=>{localStorage.setItem("xatals_jugador",b.dataset.k);m.remove();document.querySelectorAll(".sr").forEach(e=>e.textContent=apellido());cb(b.dataset.k);});}
document.addEventListener("DOMContentLoaded",()=>document.querySelectorAll(".sr").forEach(e=>e.textContent=apellido()));
