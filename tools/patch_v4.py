c = open('js/common.js', encoding='utf-8').read()
old = '  document.querySelectorAll(".rev").forEach'
assert c.count(old) == 1
new = '''  const bl=[...document.querySelectorAll(".bloque")];
  if(bl.length&&!matchMedia("(prefers-reduced-motion: reduce)").matches){
    bl.forEach((e,i)=>{e.dataset.dx=[-110,110,0,-70,70][i%5];e.dataset.dy=[90,120,160][i%3];e.dataset.r=[-7,7,0,-4,4][i%5];});
    const upd=()=>{const vh=innerHeight;bl.forEach(e=>{const r=e.getBoundingClientRect();const p=Math.max(0,Math.min(1,(vh*.96-r.top)/(vh*.5)));const q=1-(1-p)*(1-p);e.style.opacity=(.1+.9*q).toFixed(3);e.style.transform=`translate3d(${(e.dataset.dx*(1-q)).toFixed(1)}px,${(e.dataset.dy*(1-q)).toFixed(1)}px,0) rotate(${(e.dataset.r*(1-q)).toFixed(2)}deg) scale(${(.9+.1*q).toFixed(3)})`;});};
    addEventListener("scroll",()=>requestAnimationFrame(upd),{passive:true});addEventListener("resize",upd);upd();
  }
  document.querySelectorAll(".card").forEach(c=>c.addEventListener("pointermove",e=>{const r=c.getBoundingClientRect();c.style.setProperty("--mx",(e.clientX-r.left)+"px");c.style.setProperty("--my",(e.clientY-r.top)+"px");}));
''' + old
open('js/common.js', 'w', encoding='utf-8').write(c.replace(old, new, 1))

m = open('make_pages.py', encoding='utf-8').read()
m = m.replace("family=Bangers&family=Permanent+Marker&family=Press+Start+2P&display=swap", "family=Bangers&family=Permanent+Marker&family=Press+Start+2P&family=Sora:wght@400;600;800&display=swap")
m = m.replace('<link rel="stylesheet" href="css/style.css">', '<link rel="stylesheet" href="css/style.css"><link rel="stylesheet" href="css/premium.css">')
i = m.index('<div class="grid">{card("recreo.html"')
j = m.index('</div>""",', i)
bento = '''<div class="bento">
<div class="bloque s4"><a class="card destacado" href="futbol.html"><span class="nuevo">3D</span><span class="vista">⚽</span><span class="em">⚽</span><h3>Tejedor al fútbol en 3D</h3><p>Penaltis en el patio de cemento del cole, con el edificio de Santa María al fondo. Cinco tiras tú, cinco paras tú.</p></a></div>
<div class="bloque"><a class="card" href="quizsemana.html"><span class="em">🧠</span><h3>Quiz de la semana</h3><p>¿Quién se acuerda de todo lo que hemos dicho?</p></a></div>
<div class="bloque"><a class="card" href="paneles.html"><span class="em">📊</span><h3>Paneles</h3><p>Datos reales del chat: horas, días y silencios de Koi.</p></a></div>
<div class="bloque"><a class="card" href="records.html"><span class="em">🏆</span><h3>Hall of Fame</h3><p>Quién manda en la cuadrilla, con corona.</p></a></div>
<div class="bloque"><a class="card" href="recreo.html"><span class="em">🥊</span><h3>Buxai en el recreo</h3><p>Puñetazos, esquivas y bombones.</p></a></div>
<div class="bloque s3"><a class="card" href="juegos.html"><span class="em">🕹️</span><h3>Todos los juegos</h3><p>Más de 20 y creciendo: Hermek inventa más cada viernes con vuestras anécdotas.</p></a></div>
<div class="bloque s3"><a class="card" href="chistes.html"><span class="em">😂</span><h3>Chistes</h3><p>La máquina de la cuadrilla, por temas.</p></a></div>
'''
m = m[:i] + bento + m[j:]
open('make_pages.py', 'w', encoding='utf-8').write(m)

e = open('js/futbol3d.js', encoding='utf-8').read()
e = e.replace('gl.position.set(s * .42, -.38, -.9)', 'gl.position.set(s * .5, -.52, -1.0)').replace('new THREE.SphereGeometry(.13, 16, 12)', 'new THREE.SphereGeometry(.09, 16, 12)')
open('js/futbol3d.js', 'w', encoding='utf-8').write(e)
print('v4 patched')
