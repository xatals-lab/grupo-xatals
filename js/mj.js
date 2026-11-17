/* Mini-game engine. A game is only DATA in data/minijuegos.json (id, plantilla, texts). Templates: pulsa, timing, decide, memoria, aguanta, busca, simon.
   Claude owns this code; Hermek only adds/edits game data (validated by tools/validate.py). */
(async()=>{
const $=id=>document.getElementById(id);
const id=new URLSearchParams(location.search).get("g");
const all=await cargaJSON("minijuegos");
const G=all.juegos.find(x=>x.id===id);
const root=$("mj");
if(!G){root.innerHTML="<p>No encuentro ese juego. <a href='juegos.html'>Ver todos</a></p>";return;}
document.title=G.titulo+" · Grupo Xatals";
$("titulo").textContent=G.emoji+" "+G.titulo;if(window.maquina)maquina($("titulo"),24);
$("intro").textContent=G.intro;
$("estrellas").textContent="Dificultad "+"★".repeat(G.dificultad||2)+"☆".repeat(5-(G.dificultad||2));
const arena=$("arena"),hud=$("hud"),msg=$("msg"),rec=$("rec");
let pts=0,activo=false;
const setHud=t=>hud.innerHTML=t;
const say=t=>msg.textContent=t;
function fin(p,texto){activo=false;pts=Math.max(0,Math.round(p));say((pts>0?euOk():euKo())+(texto||"Fin"));$("start").disabled=false;$("start").textContent="↻ Otra vez";if(pts>0)confeti();panelRecord(rec,"mj-"+G.id,pts,"Puntos de "+G.titulo);}
const AYUDA={
 pulsa:["👆","Toca los BUENOS y no toques los MALOS","Cada acierto suma puntos. Cada fallo resta. Se acelera según pasa el tiempo."],
 timing:["⏹","Toca PARA cuando la aguja esté en la zona VERDE","La zona se hace más pequeña en cada ronda."],
 aguanta:["🗣","MANTÉN pulsado el botón y SUELTA en la zona verde","Mientras mantienes, la palabra se estira. Suelta justo en la zona."],
 busca:["🔍","Encuentra el objetivo entre todos y TÓCALO","Si fallas, pierdes puntos. El tiempo corre."],
 simon:["🧠","MIRA la secuencia y REPÍTELA tocando los botones","Cada ronda es más larga."],
 ritmo:["🎸","Toca la columna cuando la nota cruce la LÍNEA AMARILLA","Encadena notas seguidas para subir el combo."],
 runner:["↔️","DESLIZA a izquierda o derecha para cambiar de carril","Coge lo bueno, esquiva lo malo. Tienes 3 vidas."],
 apila:["⬇️","Toca SUELTA para colocar el bloque justo encima del anterior","Lo que sobresale se pierde. ¡Llega al piso 12!"],
 carril3d:["🚆","DESLIZA a izquierda o derecha (o toca los lados) para cambiar de vía","Coge lo bueno, esquiva lo malo y, cuando veas los carteles, ELIGE la vía con la respuesta correcta para acelerar."]};
function ayuda(cb,forzar){const k="xatals_ayuda_"+G.plantilla;if(!forzar&&localStorage.getItem(k)){cb();return;}const a=G.ayuda||AYUDA[G.plantilla]||["🎮","Sigue las instrucciones","¡Suerte!"];
  const m=document.createElement("div");m.className="modal";m.innerHTML=`<div class="modal-in" style="text-align:center"><div style="font-size:4rem">${a[0]}</div><h2>Cómo se juega</h2><p style="font-size:1.2rem"><b>${a[1]}</b></p><p>${a[2]}</p><button class="rosa" id="entendido">¡Entendido, a jugar!</button></div>`;document.body.append(m);
  m.querySelector("#entendido").onclick=()=>{localStorage.setItem(k,"1");m.remove();cb();};}
const ab=document.createElement("button");ab.className="sec";ab.textContent="❓ Cómo se juega";ab.onclick=()=>ayuda(()=>{},true);$("start").after(ab);
$("start").onclick=()=>ayuda(()=>{rec.innerHTML="";arena.innerHTML="";$("start").disabled=true;activo=true;pts=0;TPL[G.plantilla](G);});
const TPL={
/* ---- pulsa: tap the good ones, avoid the bad ones ---- */
pulsa(g){
  const N=9;let t=g.duracion||30,hits=0,fallos=0;
  arena.innerHTML=`<div class="holes">${Array.from({length:N},(_,i)=>`<button class="hole" data-i="${i}"></button>`).join("")}</div>`;
  const holes=[...arena.querySelectorAll(".hole")];
  holes.forEach(h=>h.onclick=()=>{if(!activo||!h.dataset.k)return;const bueno=h.dataset.k==="b";pts+=bueno?(g.pts_bueno||10):-(g.pts_malo||15);pts=Math.max(0,pts);bueno?hits++:fallos++;sonido(bueno?660:150,.08);h.textContent=bueno?"💥":"😵";h.dataset.k="";if(bueno&&g.msg_ok)say(azar(g.msg_ok));if(!bueno&&g.msg_ko)say(azar(g.msg_ko));pintaHud();});
  function pintaHud(){setHud(`<span>⏱ ${Math.ceil(t)}s</span><span>${pts} PTS</span>`);}
  async function spawn(){while(activo&&t>0){const h=azar(holes.filter(x=>!x.dataset.k));if(h){const bueno=Math.random()<.62;const it=azar(bueno?g.buenos:g.malos);h.textContent=it.e;h.dataset.k=bueno?"b":"m";const vis=Math.max(450,(g.visible||1100)-(g.duracion-t)*8);setTimeout(()=>{h.textContent="";h.dataset.k="";},vis);}await esperar(Math.max(320,650-(g.duracion-t)*6));}}
  const iv=setInterval(()=>{t-=.25;pintaHud();if(t<=0){clearInterval(iv);fin(pts,`Se acabó. ${hits} aciertos, ${fallos} fallos.`);}},250);
  pintaHud();say(g.consigna||"¡Dale a los buenos, no toques a los malos!");spawn();
},
/* ---- timing: stop the moving bar inside the shrinking green zone ---- */
timing(g){
  let r=0,x=0,dir=1,zona=g.zona||34,ini=0,vel=1.5,lock=false;const R=g.rondas||5;
  arena.innerHTML=`<div class="big" id="tg" style="text-align:center">${g.emoji}</div><div class="medidor"><div class="zona" id="zona"></div><div class="aguja" id="aguja"></div></div><p style="text-align:center"><button class="rosa" id="para">⏹ PARA</button></p>`;
  function ronda(){if(!activo)return;if(r>=R)return fin(pts,"Se acabó la serie.");ini=10+Math.random()*(90-zona);$("zona").style.left=ini+"%";$("zona").style.width=zona+"%";lock=false;x=0;dir=1;say((g.consigna||"Para la aguja en la zona verde")+" ("+(r+1)+"/"+R+")");setHud(`<span>Ronda ${r+1}/${R}</span><span>${pts} PTS</span>`);mover();}
  let raf;function mover(){clearInterval(raf);raf=setInterval(()=>{x+=dir*(vel+r*.55);if(x>=100){x=100;dir=-1}if(x<=0){x=0;dir=1}$("aguja").style.left=x+"%";},16);}
  $("para").onclick=()=>{if(!activo||lock)return;lock=true;clearInterval(raf);const c=ini+zona/2,dist=Math.abs(x-c);const dentro=dist<=zona/2;const p=dentro?Math.round(200-dist/(zona/2)*100):0;pts+=p;sonido(dentro?700:140,.12);say(dentro?azar(g.msg_ok||["¡Clavado!"]):azar(g.msg_ko||["Fuera..."]));r++;zona=Math.max(8,zona-5);setTimeout(ronda,900);};
  ronda();
},
/* ---- decide: short branching scenes with two meters ---- */
decide(g){
  let animo=50,cartera=40,i=0;const esc=baraja(g.escenas).slice(0,Math.min(7,g.escenas.length));
  function ver(){
    if(i>=esc.length||cartera<=0)return cierre();
    const e=esc[i];setHud(`<span>😄 ${animo}</span><span>💶 ${cartera}</span><span>Escena ${i+1}/${esc.length}</span>`);
    arena.innerHTML=`<div class="guest"><h2>${e.e||""} ${e.titulo||""}</h2><p>${e.t}</p></div>`+e.o.map((o,k)=>`<button data-k="${k}">${o.t}</button>`).join("");
    arena.querySelectorAll("button").forEach(b=>b.onclick=()=>{const o=e.o[+b.dataset.k];animo=acota(animo+(o.animo||0));cartera=Math.max(0,cartera+(o.cartera||0));sonido((o.animo||0)>=0?600:200,.1);say(o.r);i++;arena.innerHTML=`<button id="sg">Siguiente ➡</button>`;$("sg").onclick=ver;setHud(`<span>😄 ${animo}</span><span>💶 ${cartera}</span>`);});
  }
  function cierre(){const f=g.final||{};const t=cartera<=0?(f.ruina||"Te quedas sin un euro."):animo>=70?(f.bien||"Gran noche."):animo>=40?(f.normal||"Noche normal."):(f.mal||"Noche regular.");arena.innerHTML="";fin(animo*10+cartera*5,t);}
  ver();
},
/* ---- memoria: match pairs ---- */
memoria(g){
  const cards=baraja(g.pares.flatMap((p,k)=>[{k,t:p.a},{k,t:p.b}]));let sel=[],found=0,moves=0,t0=Date.now(),lock=false;
  arena.innerHTML=`<div class="cartas">${cards.map((c,i)=>`<button class="carta" data-i="${i}">❓</button>`).join("")}</div>`;
  setHud(`<span>Movimientos: 0</span><span>Parejas 0/${g.pares.length}</span>`);say(g.consigna||"Une cada personaje con lo que le define");
  arena.querySelectorAll(".carta").forEach(b=>b.onclick=async()=>{if(lock||!activo||b.classList.contains("up"))return;const c=cards[+b.dataset.i];b.textContent=c.t;b.classList.add("up");sel.push([b,c]);sonido(500,.05);
    if(sel.length===2){moves++;lock=true;const [[b1,c1],[b2,c2]]=sel;if(c1.k===c2.k&&b1!==b2){found++;b1.classList.add("ok2");b2.classList.add("ok2");sonido(800,.12);}else{await esperar(750);[b1,b2].forEach(z=>{z.textContent="❓";z.classList.remove("up");});}sel=[];lock=false;
      setHud(`<span>Movimientos: ${moves}</span><span>Parejas ${found}/${g.pares.length}</span>`);
      if(found===g.pares.length){const s=(Date.now()-t0)/1000;fin(Math.max(50,1200-moves*35-s*6),`Hecho en ${moves} movimientos y ${Math.round(s)} s.`);}}});
},
/* ---- aguanta: hold the button to stretch a word, release inside the zone ---- */
aguanta(g){
  const R=g.rondas||5;let r=0,v=0,sube=false,zl=0,zw=16,iv=0;
  arena.innerHTML=`<div class="big" id="pal" style="text-align:center;font-family:var(--f-titulo);font-size:3rem;word-break:break-all"></div><div class="medidor"><div class="zona" id="zona"></div><div class="aguja" id="aguja" style="width:6px"></div></div><p style="text-align:center"><button class="rosa" id="holdb">🗣 MANTÉN Y SUELTA EN LA ZONA</button></p>`;
  function ronda(){if(!activo)return;if(r>=R)return fin(pts,"Voz de estadio.");v=0;zl=25+Math.random()*(70-zw);zw=Math.max(8,16-r);$("zona").style.left=zl+"%";$("zona").style.width=zw+"%";$("aguja").style.left="0%";say((g.consigna||"Estira la palabra hasta la zona verde")+" ("+(r+1)+"/"+R+")");setHud(`<span>Ronda ${r+1}/${R}</span><span>${pts} PTS</span>`);pinta();}
  function pinta(){const n=Math.floor(v/5),P=(g.palabra||"Dios").toUpperCase(),V="AEIOUÁÉÍÓÚ";$("pal").textContent=[...P].map((c,k)=>c.repeat(1+Math.floor(n*(V.includes(c)?.55:k===P.length-1?.2:0)))).join("");}
  const b=$("holdb"),on=e=>{e&&e.preventDefault();if(!activo||sube)return;sube=true;iv=setInterval(()=>{v=Math.min(100,v+1.1+r*.15);$("aguja").style.left=v+"%";pinta();},30);},off=()=>{if(!sube)return;sube=false;clearInterval(iv);const ok=v>=zl&&v<=zl+zw;const p=ok?Math.round(250-Math.abs(v-(zl+zw/2))/(zw/2)*120):0;pts+=p;sonido(ok?720:140,.15);say(ok?azar(g.msg_ok||["¡Ese Dios sí que sí!"]):azar(g.msg_ko||["Se te cortó la voz"]));r++;setTimeout(ronda,1000);};
  ["mousedown","touchstart"].forEach(e=>b.addEventListener(e,on));["mouseup","mouseleave","touchend","touchcancel"].forEach(e=>b.addEventListener(e,off));
  ronda();
},
/* ---- busca: find the target among decoys ---- */
busca(g){
  let r=0,t0=0,tiempo;const R=g.rondas||5;
  function ronda(){
    if(!activo)return;if(r>=R)return fin(pts,"Has encontrado a todos... o eso creen.");
    const n=16+r*6,cols=Math.min(8,4+r);tiempo=Math.max(6,(g.tiempo||14)-r);t0=Date.now();
    const cel=baraja([{e:g.objetivo.e,x:1},...Array.from({length:n-1},()=>({e:azar(g.senuelos).e,x:0}))]);
    arena.innerHTML=`<div class="busca" style="grid-template-columns:repeat(${cols},1fr)">${cel.map((c,i)=>`<button class="celda" data-x="${c.x}">${c.e}</button>`).join("")}</div>`;
    say(`Encuentra a ${g.objetivo.t} (${r+1}/${R})`);
    arena.querySelectorAll(".celda").forEach(b=>b.onclick=()=>{if(!activo)return;if(b.dataset.x==="1"){const s=(Date.now()-t0)/1000;pts+=Math.max(30,Math.round(300-s*(300/tiempo)));sonido(760,.12);r++;clearInterval(iv);ronda();}else{pts=Math.max(0,pts-25);b.disabled=true;b.textContent="❌";sonido(130,.08);}});
    clearInterval(iv);iv=setInterval(()=>{const l=tiempo-(Date.now()-t0)/1000;setHud(`<span>⏱ ${Math.max(0,l).toFixed(1)}s</span><span>${pts} PTS</span>`);if(l<=0){clearInterval(iv);say(g.msg_ko?azar(g.msg_ko):"Se ha esfumado...");r++;setTimeout(ronda,900);}},100);
  }
  let iv=0;ronda();
},
/* ---- simon: repeat the growing sequence ---- */
simon(g){
  const B=g.botones,R=g.rondas||8;let seq=[],pos=0,aceptando=false;
  arena.innerHTML=`<div class="simon">${B.map((b,i)=>`<button class="sb" data-i="${i}" style="--c:${b.c}">${b.e}</button>`).join("")}</div>`;
  const btns=[...arena.querySelectorAll(".sb")];
  async function luz(i){btns[i].classList.add("on");sonido(300+i*140,.22);await esperar(380);btns[i].classList.remove("on");await esperar(160);}
  async function ronda(){if(!activo)return;if(seq.length>=R)return fin(pts+300,"¡Memoria de elefante vitoriano!");seq.push(Math.floor(Math.random()*B.length));aceptando=false;pos=0;setHud(`<span>Ronda ${seq.length}/${R}</span><span>${pts} PTS</span>`);say(g.consigna_ver||"Mira la secuencia...");await esperar(500);for(const i of seq)await luz(i);say(g.consigna||"¡Ahora tú!");aceptando=true;}
  btns.forEach(b=>b.onclick=async()=>{if(!aceptando||!activo)return;const i=+b.dataset.i;await luz(i);if(i!==seq[pos]){aceptando=false;return fin(pts,g.msg_ko?azar(g.msg_ko):"Te has equivocado");}pos++;if(pos===seq.length){pts+=100*seq.length;aceptando=false;say(g.msg_ok?azar(g.msg_ok):"¡Bien!");await esperar(700);ronda();}});
  say("Pulsa y mira");ronda();
},
/* ---- ritmo: notes fall in 4 lanes, hit them on the line (arrows / A S D F / tap the pads) ---- */
ritmo(g){
  const L=g.carriles||["⬅","⬇","⬆","➡"],T=g.duracion||30,N=g.notas||["🎸"];let t=T,combo=0,notas=[],cd=0;
  arena.innerHTML=`<div class="ritmo">${L.map((l,i)=>`<div class="carril" data-i="${i}"></div>`).join("")}<div class="linea"></div></div><div class="pads">${L.map((l,i)=>`<button class="pad" data-i="${i}">${l}</button>`).join("")}</div>`;
  const car=[...arena.querySelectorAll(".carril")];
  function golpe(i){if(!activo)return;const n=notas.filter(x=>x.i===i&&x.y>66&&x.y<96).sort((a,b)=>b.y-a.y)[0];
    if(n){n.el.remove();notas=notas.filter(x=>x!==n);combo++;pts+=100+Math.min(combo,10)*10;sonido(500+i*120,.07);if(combo%8===0&&g.msg_ok)say(azar(g.msg_ok));}
    else{combo=0;pts=Math.max(0,pts-20);sonido(120,.08);if(g.msg_ko)say(azar(g.msg_ko));}pintar();}
  function pintar(){setHud(`<span>⏱ ${Math.ceil(t)}s</span><span>Combo x${combo}</span><span>${pts} PTS</span>`);}
  arena.querySelectorAll(".pad").forEach(b=>{b.addEventListener("pointerdown",e=>{e.preventDefault();golpe(+b.dataset.i);});});
  const teclas={ArrowLeft:0,ArrowDown:1,ArrowUp:2,ArrowRight:3,a:0,s:1,d:2,f:3};
  const kd=e=>{if(!activo){document.removeEventListener("keydown",kd);return;}if(e.key in teclas){e.preventDefault();golpe(teclas[e.key]);}};document.addEventListener("keydown",kd);
  const iv=setInterval(()=>{if(!activo){clearInterval(iv);return;}t-=.03;cd-=.03;const v=.95+(T-t)*.03;
    if(cd<=0&&t>1.5){const i=Math.floor(Math.random()*L.length);const el=document.createElement("div");el.className="nota";el.textContent=azar(N);car[i].append(el);notas.push({i,y:-8,el});cd=Math.max(.32,.62-(T-t)*.006);}
    notas.forEach(n=>{n.y+=v;n.el.style.top=n.y+"%";});
    const fuera=notas.filter(n=>n.y>100);if(fuera.length){fuera.forEach(n=>n.el.remove());notas=notas.filter(n=>n.y<=100);combo=0;}
    pintar();if(t<=0){clearInterval(iv);document.removeEventListener("keydown",kd);fin(pts,"Se acabó el concierto.");}},30);
  say(g.consigna||"Pulsa cada nota cuando cruce la línea");pintar();
},
/* ---- runner: 3 lanes, dodge the bad stuff, grab the good stuff ---- */
runner(g){
  let carril=1,vidas=3,t=g.duracion||35,items=[],cd=0;const T=t;
  arena.innerHTML=`<div class="pista"><div class="yo" id="yo">${g.jugador?g.jugador.e:"🏃"}</div></div><div class="pads"><button class="pad" id="rl">⬅</button><button class="pad" id="rr">➡</button></div>`;
  const pista=arena.querySelector(".pista"),yo=$("yo");
  const col=i=>(16.5+i*33.3)+"%";const pon=()=>yo.style.left=col(carril);pon();
  const mover=d=>{if(!activo)return;carril=Math.max(0,Math.min(2,carril+d));pon();sonido(380,.04);};
  $("rl").onclick=()=>mover(-1);$("rr").onclick=()=>mover(1);
  const kd=e=>{if(!activo){document.removeEventListener("keydown",kd);return;}if(e.key==="ArrowLeft"||e.key==="a")mover(-1);if(e.key==="ArrowRight"||e.key==="d")mover(1);};document.addEventListener("keydown",kd);
  let sx=null;pista.addEventListener("pointerdown",e=>sx=e.clientX);pista.addEventListener("pointerup",e=>{if(sx==null)return;const dx=e.clientX-sx;if(Math.abs(dx)>25)mover(dx<0?-1:1);sx=null;});
  const pintar=()=>setHud(`<span>${"❤".repeat(vidas)}</span><span>⏱ ${Math.ceil(t)}s</span><span>${Math.round(pts)} PTS</span>`);
  const iv=setInterval(()=>{if(!activo){clearInterval(iv);return;}t-=.03;cd-=.03;pts+=.4;const v=1.1+(T-t)*.035;
    if(cd<=0){const bueno=Math.random()<.4;const it=azar(bueno?g.buenos:g.malos);const el=document.createElement("div");el.className="obj";el.textContent=it.e;const i=Math.floor(Math.random()*3);el.style.left=col(i);pista.append(el);items.push({el,i,y:-10,bueno});cd=Math.max(.35,.8-(T-t)*.008);}
    items.forEach(o=>{o.y+=v;o.el.style.top=o.y+"%";o.el.style.transform=`translateX(-50%) scale(${.5+o.y/100})`;
      if(!o.hit&&o.y>78&&o.y<96&&o.i===carril){o.hit=true;o.el.remove();if(o.bueno){pts+=60;sonido(740,.08);if(g.msg_ok)say(azar(g.msg_ok));}else{vidas--;pts=Math.max(0,pts-30);sonido(120,.2);pista.classList.add("shake");setTimeout(()=>pista.classList.remove("shake"),250);if(g.msg_ko)say(azar(g.msg_ko));}}});
    items=items.filter(o=>{if(o.y>104||o.hit){o.el.remove();return false;}return true;});
    pintar();if(vidas<=0||t<=0){clearInterval(iv);document.removeEventListener("keydown",kd);fin(pts,vidas<=0?"Te han machacado.":"Llegas a la meta, sudando.");}},30);
  say(g.consigna||"Cambia de carril: coge lo bueno, esquiva lo malo");pintar();
},
/* ---- apila: stack the blocks; every miss trims the tower ---- */
apila(g){
  const NIV=g.niveles||[];let nivel=0,ancho=44,izq=28,x=0,dir=1,perf=0;const piezas=[];
  arena.innerHTML=`<div class="torre" id="torre"></div><p style="text-align:center"><button class="rosa" id="suelta">⬇ SUELTA</button></p>`;
  const torre=$("torre");let pieza=null,iv=0;
  function nueva(){const el=document.createElement("div");el.className="bloque3d";el.textContent=g.bloque?g.bloque.e:"🧱";el.style.width=ancho+"%";el.style.bottom=(nivel*13)+"%";torre.append(el);pieza=el;x=0;dir=1;
    say(NIV[nivel]||`Piso ${nivel+1}`);setHud(`<span>Piso ${nivel+1}</span><span>${pts} PTS</span>`);}
  iv=setInterval(()=>{if(!activo||!pieza){return;}x+=dir*(1.1+nivel*.28);if(x>100-ancho){x=100-ancho;dir=-1}if(x<0){x=0;dir=1}pieza.style.left=x+"%";},16);
  $("suelta").onclick=()=>{if(!activo||!pieza)return;const ini=Math.max(x,izq),fin2=Math.min(x+ancho,izq+ancho),sol=fin2-ini;
    if(sol<=1){clearInterval(iv);pieza.style.opacity=.4;sonido(120,.3);return fin(pts,g.msg_ko?azar(g.msg_ko):"Se cae la torre.");}
    const perfecto=Math.abs(x-izq)<1.6;if(perfecto){perf++;pts+=50;sonido(900,.1);say(g.msg_ok?azar(g.msg_ok):"¡Perfecto!");}else sonido(520,.08);
    pts+=100;ancho=perfecto?ancho:sol;izq=perfecto?izq:ini;pieza.style.left=izq+"%";pieza.style.width=ancho+"%";nivel++;pieza=null;
    if(nivel>=12){clearInterval(iv);return fin(pts+300,"¡Torre completa! Hasta Celedón tiene vértigo.");}setTimeout(nueva,160);};
  document.addEventListener("keydown",e=>{if(e.key===" "&&activo){e.preventDefault();$("suelta")&&$("suelta").click();}});
  nueva();
},
/* ---- carril3d: console-style 3D lane game (see js/carril3d.js) ---- */
carril3d(g){
  arena.innerHTML=`<div id="c3d" class="lienzo3d"></div>`;
  import("./carril3d.js").then(m=>m.iniciar($("c3d"),g,{hud:setHud,say,fin})).catch(e=>{console.error(e);say("Tu navegador no puede abrir el 3D. Prueba con Chrome o Safari actualizados.");fin(0,"3D no disponible");});
}
};
})().catch(e=>{document.getElementById("mj").textContent="No he podido cargar el minijuego.";console.error(e)});
