p = 'js/mj.js'
t = open(p, encoding='utf-8').read()
marker = '\n};\n})().catch(e=>{document.getElementById("mj")'
assert t.count(marker) == 1
nuevas = r''',
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
  const pintar=()=>setHud(`<span>❤ ${"❤".repeat(vidas)}</span><span>⏱ ${Math.ceil(t)}s</span><span>${pts} PTS</span>`);
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
}'''
t = t.replace(marker, nuevas + marker)
# Basque touch on the result line
old = 'function fin(p,texto){activo=false;pts=Math.max(0,Math.round(p));say(texto||"Fin");'
assert t.count(old) == 1
t = t.replace(old, 'function fin(p,texto){activo=false;pts=Math.max(0,Math.round(p));say((pts>0?euOk():euKo())+(texto||"Fin"));')
open(p, 'w', encoding='utf-8').write(t)
c = open('css/premium.css', encoding='utf-8').read()
c += '''
.ritmo{position:relative;display:grid;grid-template-columns:repeat(4,1fr);height:min(52vh,340px);margin:.4rem auto;max-width:520px;background:linear-gradient(#0b0620,#1a0b3a);border-radius:18px;overflow:hidden;perspective:700px;border:1px solid #ffffff2a}
.carril{position:relative;border-right:1px dashed #ffffff22}.linea{position:absolute;left:0;right:0;top:81%;height:5px;background:var(--amarillo);box-shadow:0 0 18px var(--amarillo)}
.nota{position:absolute;left:50%;transform:translateX(-50%);font-size:2rem;filter:drop-shadow(0 0 10px #ff2e93)}
.pads{display:grid;grid-template-columns:repeat(auto-fit,minmax(70px,1fr));gap:.5rem;max-width:520px;margin:.5rem auto}.pad{font-size:1.6rem;margin:0;min-height:64px}
.pista{position:relative;height:min(52vh,340px);max-width:420px;margin:.4rem auto;background:linear-gradient(#0a0a18,#23103f);border-radius:18px;overflow:hidden;border:1px solid #ffffff2a;touch-action:pan-y;background-image:repeating-linear-gradient(90deg,transparent 0 33%,#ffffff22 33% 33.4%),linear-gradient(#0a0a18,#23103f)}
.yo{position:absolute;bottom:4%;font-size:2.6rem;transform:translateX(-50%);transition:left .09s;filter:drop-shadow(0 6px 6px #000)}
.obj{position:absolute;font-size:2.2rem;transform:translateX(-50%)}
.torre{position:relative;height:min(52vh,360px);max-width:420px;margin:.4rem auto;background:linear-gradient(#0a0a18,#1d1140);border-radius:18px;overflow:hidden;border:1px solid #ffffff2a}
.bloque3d{position:absolute;height:12%;background:linear-gradient(180deg,#ffe500,#ffb800);border-radius:8px;box-shadow:inset 0 -6px 0 #0004,0 8px 16px #000a;display:grid;place-items:center;font-size:1.5rem}
'''
open('css/premium.css', 'w', encoding='utf-8').write(c)
print('templates added')
