cargaJSON("semana").then(s=>{document.getElementById("semana").innerHTML="<h3>📰 "+s.titulo+" <span class='pill'>"+s.actualizado+"</span></h3>"+s.resumen+" <a href='semana.html'>Ver más</a>";}).catch(()=>{document.getElementById("semana").remove()});
cargaJSON("minijuegos").then(d=>{
  const v=d.juegos.filter(g=>g.vds).sort((a,b)=>(b.semana||"").localeCompare(a.semana||""))[0];if(!v)return;
  document.getElementById("vds").innerHTML=`<div class="bloque" style="margin-bottom:1.1rem"><a class="card destacado" href="mj.html?g=${v.id}" style="border-color:#ff2e93"><span class="nuevo">VIDEOJUEGO DE LA SEMANA</span><span class="vista">${v.emoji}</span><span class="em">${v.emoji}</span><p class="medal">🎮 Videojuego de la semana · ${v.semana||""} · estilo: ${v.plantilla}</p><h3>${v.titulo}</h3><p>${v.resumen||v.intro}</p></a></div>`;
}).catch(()=>{});
cargaJSON("chistes").then(c=>{const t=baraja(c).slice(0,8).map(x=>x.texto).join("  ★  ");document.getElementById("tk").textContent=t+"  ★  "+t;}).catch(()=>{});
