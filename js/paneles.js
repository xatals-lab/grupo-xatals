/* Paneles: interactive dashboards drawn in plain SVG/CSS from data/dashboards.json (real chat aggregates). */
(async()=>{
const d=await cargaJSON("dashboards"),app=document.getElementById("app");
const N={dug:"Dug",hrk:"HRK",koi:"Koi"},COL={dug:"#ffe500",hrk:"#ff2e93",koi:"#00e5ff"};
const DIAS=["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];
const P=Object.fromEntries(d.personas.map(p=>[p.id,p]));
const mas=(k)=>d.personas.slice().sort((a,b)=>b[k]-a[k])[0];
const koi=P.koi;
let metrica="mensajes",quien="todos";
const pintaHeat=()=>{
  const ids=quien==="todos"?["dug","hrk","koi"]:[quien];
  const m=Array.from({length:7},()=>Array(24).fill(0));ids.forEach(i=>{});
  // we only have per-hour and per-day marginals: show the hour profile and the day profile as two linked strips
  const h=Array(24).fill(0),dd=Array(7).fill(0);ids.forEach(i=>{d.horas[i].forEach((v,k)=>h[k]+=v);d.dias[i].forEach((v,k)=>dd[k]+=v);});
  const mh=Math.max(1,...h),md=Math.max(1,...dd);
  const col=quien==="todos"?"#ffe500":COL[quien];
  const horaTop=h.indexOf(Math.max(...h)),diaTop=dd.indexOf(Math.max(...dd));
  document.getElementById("heat").innerHTML=`<p><b>${quien==="todos"?"La cuadrilla":N[quien]}</b>: más actividad los <b>${DIAS[diaTop]}</b> sobre las <b>${horaTop}:00</b>.</p>
  <svg viewBox="0 0 480 150" class="svg"><g>${h.map((v,k)=>`<g><rect x="${k*20}" y="${90-v/mh*80}" width="17" height="${Math.max(2,v/mh*80)}" fill="${col}" rx="2"><title>${k}:00 · ${v} mensajes</title></rect><text x="${k*20+8}" y="104" font-size="8" fill="#aaa" text-anchor="middle">${k%3===0?k:""}</text></g>`).join("")}</g>
  <g transform="translate(0,112)">${dd.map((v,k)=>`<g><rect x="${k*68+4}" y="0" width="60" height="26" rx="4" fill="${col}" opacity="${.2+.8*v/md}"><title>${DIAS[k]} · ${v}</title></rect><text x="${k*68+34}" y="17" font-size="11" text-anchor="middle" fill="#000" font-weight="700">${DIAS[k]}</text></g>`).join("")}</g></svg>`;
};
const pintaBarras=()=>{
  const lista=d.personas.slice().sort((a,b)=>b[metrica]-a[metrica]),mx=Math.max(1,...lista.map(p=>p[metrica]));
  document.getElementById("barras").innerHTML=lista.map((p,i)=>`<div class="fila"><span class="medal">${["🥇","🥈","🥉"][i]}</span><b style="width:4.5rem;display:inline-block">${N[p.id]}</b><span class="barra"><i style="width:${p[metrica]/mx*100}%;background:${COL[p.id]}"></i></span> <b>${p[metrica]}</b></div>`).join("");
};
const sem=d.semanas,ms=Math.max(1,...sem.map(s=>s.dug+s.hrk+s.koi));
const evol=`<svg viewBox="0 0 ${Math.max(300,sem.length*40)} 150" class="svg">${sem.map((s,k)=>{let y=120;return ["dug","hrk","koi"].map(i=>{const h=s[i]/ms*100;y-=h;return `<rect x="${k*40+6}" y="${y}" width="28" height="${Math.max(0,h)}" fill="${COL[i]}"><title>${s.semana} · ${N[i]}: ${s[i]}</title></rect>`}).join("")+`<text x="${k*40+20}" y="138" font-size="8" fill="#aaa" text-anchor="middle">${s.semana.slice(-3)}</text>`}).join("")}</svg>`;
const nube=["dug","hrk","koi"].map(i=>{const w=d.palabras[i]||[],mx=Math.max(1,...w.map(x=>x[1]));return `<div class="panel"><h3 style="color:${COL[i]}">${N[i]}</h3>${w.map(([t,n])=>`<span class="pill" style="font-size:${.9+n/mx*1.2}rem;background:${COL[i]}">${t}</span>`).join(" ")}</div>`}).join("");
const sil=koi.dias_sin_hablar;
app.innerHTML=`
<div class="grid">
<div class="card rev in"><span class="em">💬</span><h3>${d.total}</h3><p>mensajes medidos desde ${d.desde}</p></div>
<div class="card rev in"><span class="em">👑</span><h3>${N[mas("mensajes").id]}</h3><p>el que más escribe (${mas("mensajes").mensajes} mensajes)</p></div>
<div class="card rev in"><span class="em">🤐</span><h3>${sil} días</h3><p>sin hablar Koi (su mayor silencio: ${koi.mayor_silencio_dias} días)</p></div>
</div>
<div class="panel rev in"><h2>🏁 Ranking de la cuadrilla</h2><p>${["mensajes","palabras","insultos","preguntas","exclamaciones"].map(k=>`<button class="${k===metrica?"":"sec"}" data-m="${k}">${k}</button>`).join("")}</p><div id="barras"></div></div>
<div class="panel rev in"><h2>⏰ ¿Cuándo se habla?</h2><p>${["todos","dug","hrk","koi"].map(k=>`<button class="${k===quien?"":"sec"}" data-q="${k}">${N[k]||"Todos"}</button>`).join("")}</p><div id="heat"></div></div>
<div class="panel rev in"><h2>📈 Evolución por semanas</h2><p>${["dug","hrk","koi"].map(i=>`<span class="pill" style="background:${COL[i]}">${N[i]}</span>`).join(" ")}</p>${evol}</div>
<div class="panel rev in"><h2>🔤 Palabras estrella</h2></div>${nube}
<div class="panel rev in"><h2>🤐 Termómetro del silencio de Koi</h2><div class="bar mal"><i style="width:${Math.min(100,sil*10)}%"></i></div><p>${sil<1?"Koi ha hablado hoy: alerta máxima de milagro.":sil<4?"Koi anda de servicios mínimos.":"Koi lleva "+sil+" días sin escribir. Se acepta apuesta a cuándo vuelve."} <br><span style="color:#888">Datos al ${d.generado}. El chat de Hermek no recoge los audios.</span></p></div>`;
app.querySelectorAll("[data-m]").forEach(b=>b.onclick=()=>{metrica=b.dataset.m;app.querySelectorAll("[data-m]").forEach(x=>x.className=x===b?"":"sec");pintaBarras();});
app.querySelectorAll("[data-q]").forEach(b=>b.onclick=()=>{quien=b.dataset.q;app.querySelectorAll("[data-q]").forEach(x=>x.className=x===b?"":"sec");pintaHeat();});
pintaBarras();pintaHeat();
})().catch(e=>{document.getElementById("app").textContent="Los paneles se generan en el primer viernes de Hermek. Vuelve pronto.";console.error(e)});
