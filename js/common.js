const NAV=[["index.html","Inicio"],["bar.html","El Bar"],["apuestas.html","Apuestas"],["quiz.html","¿Quién lo dijo?"],["chistes.html","Chistes"],["semana.html","Esta semana"]];
function pintaCabecera(){
  const actual=location.pathname.split("/").pop()||"index.html";
  const h=document.createElement("header");h.className="top";
  h.innerHTML='<a class="logo" href="index.html">🍻 Grupo Xatals</a><nav>'+NAV.map(([u,t])=>`<a href="${u}" class="${u===actual?"on":""}">${t}</a>`).join("")+"</nav>";
  document.body.prepend(h);
  const f=document.createElement("footer");f.textContent="Grupo Xatals · humor de cuadrilla, todo exagerado e inventado con cariño · lo actualiza Hermek cada viernes";document.body.append(f);
}
async function cargaJSON(nombre){const r=await fetch("data/"+nombre+".json?v="+Date.now());if(!r.ok)throw new Error(nombre);return r.json();}
const azar=a=>a[Math.floor(Math.random()*a.length)];
function baraja(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const acota=(n,a=0,b=100)=>Math.max(a,Math.min(b,n));
document.addEventListener("DOMContentLoaded",pintaCabecera);
