c = open('js/common.js', encoding='utf-8').read()
c = c.replace('["chistes.html","Chistes"],["semana.html","Esta semana"]]', '["chistes.html","Chistes"],["semana.html","Esta semana"],["recursos.html","Recursos"]]')
# Basque words used now and then in game messages and in the footer
c = c.replace('const esperar=ms=>new Promise(r=>setTimeout(r,ms));', '''const esperar=ms=>new Promise(r=>setTimeout(r,ms));
const EU_OK=["Ederra!","Aupa!","Bikain!","Zorionak!","Gora zu!","Ene ba!"],EU_KO=["Ai ama!","Gaizki...","Ez da posible!","Ostras, bai ba!","Aizu!"];
const euOk=()=>Math.random()<.45?azar(EU_OK)+" ":"";const euKo=()=>Math.random()<.45?azar(EU_KO)+" ":"";''')
c = c.replace('f.textContent="Grupo Xatals · todo exagerado e inventado con cariño · lo actualiza Hermek cada viernes";document.body.append(f);', '''f.textContent="Grupo Xatals · todo exagerado e inventado con cariño · lo actualiza Hermek cada viernes";document.body.append(f);
  fetch("data/euskera.json?v="+Date.now()).then(r=>r.json()).then(d=>{const w=azar(d.palabras);const p=document.createElement("p");p.className="euskera";p.innerHTML=`🗣️ <b>Gaurko hitza</b> (palabra del día): <b>${w.eu}</b> = ${w.es}. <i>${w.chiste||""}</i>`;f.prepend(p);}).catch(()=>{});''')
c = c.replace('const footer=', 'const footer=')
open('js/common.js', 'w', encoding='utf-8').write(c)
print('common patched', 'euOk' in c, 'Gaurko' in c, 'recursos.html' in c)
