import json, os, re
cred = json.load(open('data/creditos.json', encoding='utf-8'))
for k in ('filosofia',):                       # the Commons pick was not a philosophy picture
    cred.pop(k, None)
    if os.path.exists(f'img/{k}.jpg'): os.remove(f'img/{k}.jpg')
json.dump(cred, open('data/creditos.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
if os.path.exists('img/_preview.html'): os.remove('img/_preview.html')

c = open('js/common.js', encoding='utf-8').read()
i = c.index('/* ---- every card gets a thumbnail')
c = c[:i] + '''/* ---- every card gets a thumbnail: real royalty-free photo when we have one (credits page), else generated gradient + emoji ---- */
const FOTOS = [[/cele[dn]|virgen blanca/, "celedon"], [/dónde está|encuentra|camiseta|multitud/, "multitud"], [/\\bmus\\b|carta|kupula/, "cartas"], [/tren|renfe|viribay|maquinista|v[ií]a\\b/, "tren"],
  [/examen|quiz|pregunta|bacterio/, "examen"], [/claustro|orla|profes|aula|cole\\b|santa mar|marianistas/, "aula"], [/futbol|fútbol|penalti|tejedor/, "futbol"], [/alav[eé]s|apuestas|querejeta|bordal|mendizorroza|liga/, "estadio"],
  [/pintxo|torre|gilda/, "pintxos"], [/caña|calimocho|pica\\b|txakoli|ronda|\\bbar\\b/, "cerveza"], [/punk|guitarra|edortha|ritmo|heavy|bogus|concierto/, "guitarra"], [/buxai|recreo|puñet|pelea|bomb/, "boxeo"],
  [/koi|servicios|reuni|papeleo|catálogo|irabi/, "oficina"], [/camino|albergue|peregrin|pr[ií]ncipe/, "camino"], [/chiste|risa|humor/, "risa"], [/panel|datos|dashboard|estad[ií]st/, "datos"], [/laboratorio/, "laboratorio"],
  [/recurso|prensa|noticia|semana|novedad/, "periodico"], [/hall|fame|ranking|r[eé]cord|trofeo/, "trofeo"], [/euskera|vasco|txapela|gaurko/, "txapela"], [/lluvia|euria|paraguas/, "lluvia"], [/vaca/, "vaca"],
  [/\\bpc\\b|ordenador|phediox|aiksmann|inform[aá]tico|tele\\b/, "ordenador"], [/bihl|gimnasio|pesas/, "gimnasio"], [/diiios|globo|grito/, "globo"], [/vitoria|gasteiz|plaza/, "vitoria"]];
let _cred = null; fetch("data/creditos.json").then(r => r.json()).then(d => { _cred = d; miniaturas(); }).catch(() => { _cred = {}; });
function fotoPara(txt) { if (!_cred) return null; for (const [re, k] of FOTOS) if (re.test(txt) && _cred[k]) return k; return null; }
function _hue(s){let h=7;for(const ch of s)h=(h*31+ch.charCodeAt(0))%360;return h;}
function miniaturas(root=document){root.querySelectorAll(".card").forEach(c=>{if(c.querySelector(".thumb"))return;const em=c.querySelector(".em"),h3=c.querySelector("h3");const e=c.dataset.thumb||(em?em.textContent.trim():"");if(!e)return;
  const titulo=h3?h3.textContent:"";const t=document.createElement("div");t.className="thumb";t.style.setProperty("--h",_hue(titulo+e));
  const k=c.dataset.img?null:fotoPara((titulo+" "+(c.getAttribute("href")||"")+" "+(c.dataset.tag||"")).toLowerCase());
  if(k){t.classList.add("conFoto");t.innerHTML=`<img class="foto" src="img/${k}.jpg" alt="" loading="lazy" onerror="this.remove()"><span class="te">${e}</span>`;}else t.innerHTML=`<span class="te">${e}</span>`;
  if(c.dataset.tag)t.insertAdjacentHTML("beforeend",`<span class="tt">${c.dataset.tag}</span>`);
  if(c.dataset.img){const im=document.createElement("img");im.alt="";im.loading="lazy";im.src=c.dataset.img;im.onerror=()=>im.remove();t.append(im);}
  if(em)em.remove();c.prepend(t);});}
document.addEventListener("DOMContentLoaded",()=>{miniaturas();let tm=null;new MutationObserver(()=>{clearTimeout(tm);tm=setTimeout(()=>miniaturas(),60);}).observe(document.body,{childList:true,subtree:true});});
'''
open('js/common.js', 'w', encoding='utf-8').write(c)

css = open('css/premium.css', encoding='utf-8').read()
css += '''
.thumb .foto{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;transition:transform .5s}
.card:hover .thumb .foto{transform:scale(1.08)}
.thumb.conFoto::before{z-index:1;background:linear-gradient(180deg,#0000 35%,#000b);mix-blend-mode:normal}
.thumb.conFoto .te{position:absolute;left:.6rem;bottom:.3rem;font-size:2rem;z-index:3}
.creditos li{margin:.5rem 0;font-size:.9rem}
'''
open('css/premium.css', 'w', encoding='utf-8').write(css)

open('js/creditos.js', 'w', encoding='utf-8').write('''(async()=>{const d=await cargaJSON("creditos"),a=document.getElementById("app");
a.innerHTML="<p>Las fotos de las tarjetas vienen de Wikimedia Commons con licencias libres. Gracias a sus autores.</p><ul class='creditos'>"+Object.entries(d).map(([k,v])=>`<li><b>${v.titulo}</b> · ${v.autor||"autor desconocido"} · <i>${v.licencia}</i> · <a href="${v.url}" target="_blank" rel="noopener noreferrer">fuente</a></li>`).join("")+"</ul>";})().catch(e=>{document.getElementById("app").textContent="No he podido cargar los créditos.";console.error(e)});
''')
m = open('make_pages.py', encoding='utf-8').read()
if '"creditos"' not in m:
    m = m.replace('"records": ("Hall of Fame"', '"creditos": ("Créditos", \'<h1>📸 Créditos de las fotos</h1><div id="app">Cargando…</div>\', \'<script src="js/creditos.js"></script>\'),\n"records": ("Hall of Fame"', 1)
open('make_pages.py', 'w', encoding='utf-8').write(m)
j = open('js/common.js', encoding='utf-8').read()
j = j.replace('f.textContent="Grupo Xatals · todo exagerado e inventado con cariño · lo actualiza Hermek cada viernes";document.body.append(f);', 'f.innerHTML="Grupo Xatals · todo exagerado e inventado con cariño · lo actualiza Hermek cada viernes · <a href=\'creditos.html\' style=\'color:#c9b27a\'>📸 créditos</a>";document.body.append(f);', 1)
open('js/common.js', 'w', encoding='utf-8').write(j)
print('photos wired; credits:', len(cred))
