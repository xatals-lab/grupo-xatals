/* Mus en el Bar Kupula (2º de Bachillerato). Dug + HRK contra El Rizos + Wilhelm. Koi es el camarero de servicios mínimos.
   Versión simplificada pero fiel: 4 cartas, un mus (descarte), lances Grande, Chica, Pares y Juego, envite / órdago, a 30 piedras. */
const PALOS=["🪙","🍷","⚔️","🪵"],NOMBRE={1:"As",2:"Dos",3:"Rey",4:"4",5:"5",6:"6",7:"7",10:"Sota",11:"Caballo",12:"Rey"};
const RANGO=c=>c.n===3?12:c.n===2?1:c.n;                    // el 3 vale como rey y el 2 como as
const VAL=c=>c.n===3||c.n===12?10:c.n===2?1:(c.n>=10?10:c.n);  // puntos para el juego
const mazo=()=>{const m=[];for(let p=0;p<4;p++)for(const n of [1,2,3,4,5,6,7,10,11,12])m.push({n,p});return baraja(m);};
const $=id=>document.getElementById(id);
const JUG=[{id:"yo",nom:"Dug",e:"🧔",eq:0},{id:"d",nom:"El Rizos",e:"🌀",eq:1},{id:"s",nom:"HRK",e:"🕶️",eq:0},{id:"i",nom:"Wilhelm",e:"🎲",eq:1}];   // sentados: yo, Rizos (izq.), HRK (frente), Wilhelm (der.)
const FRASES={d:["Envido y que la academia de física lo avale.","Esto se resuelve con la cuarta ley de Newton: yo gano.","Paso, que estoy calculando derivadas."],i:["Tiro un dado: sale un 1.","Mi personaje tiene +4 a mentir. Envido.","¿Vamos a rol o a cartas? Da igual, pierdo."],s:["Órdago, sin cariño. Como en Irabi.","Paso. No me hables que estoy en reunión.","Quiero. Y a ver quién me tose."],k:["Lo sirvo mañana: servicios mínimos.","El pintxo se acabó... hace diez minutos.","Esto no entra en mi horario, pero ponme otra pica."]};
let S;
function nuevaPartida(){S={pts:[0,0],mano:0,fase:"",log:[]};reparte();}
function reparte(){const m=mazo();S.manos=JUG.map(()=>m.splice(0,4));S.mazo=m;S.sel=new Set();S.lances=["Grande","Chica","Pares","Juego"];S.li=0;S.ap=[0,0];S.fase="mus";pinta();dice("k","Hoy el bar Kupula está lleno: "+azar(FRASES.k));}
const dice=(q,t)=>{const l=$("log");l.innerHTML=`<div><b>${q==="k"?"Koi (camarero)":JUG.find(j=>j.id===q).nom}:</b> ${t}</div>`+l.innerHTML;};
const carta=(c,oculta,i,sel)=>`<span class="naipe ${oculta?"dorso":""} ${sel?"sel":""}" data-i="${i}">${oculta?"🂠":`<b>${NOMBRE[c.n]}</b><i>${PALOS[c.p]}</i>`}</span>`;
function eq(i){return JUG[i].eq;}
function fuerzaGrande(m){return m.map(RANGO).sort((a,b)=>b-a);}
function cmp(a,b){for(let i=0;i<a.length;i++){if(a[i]!==b[i])return a[i]-b[i];}return 0;}
function pares(m){const r={};m.forEach(c=>{const k=RANGO(c);r[k]=(r[k]||0)+1;});const g=Object.entries(r).filter(([k,v])=>v>=2).sort((a,b)=>b[0]-a[0]);if(!g.length)return null;
  if(g.length===2||g[0][1]===4)return {t:3,v:+g[0][0]*100+ +(g[1]?g[1][0]:0)};if(g[0][1]===3)return {t:2,v:+g[0][0]};return {t:1,v:+g[0][0]};}
function suma(m){return m.reduce((s,c)=>s+VAL(c),0);}
const ORDEN_J=[31,32,40,37,36,35,34,33];
const rankJ=s=>{const k=ORDEN_J.indexOf(s);return k>=0?100-k:s<31?s:0;};
function mejorEq(lance,e){const idx=[0,1,2,3].filter(i=>eq(i)===e);const f=idx.map(i=>({i,m:S.manos[i]}));
  if(lance==="Grande")return f.map(x=>({i:x.i,v:fuerzaGrande(x.m)})).sort((a,b)=>cmp(b.v,a.v))[0];
  if(lance==="Chica")return f.map(x=>({i:x.i,v:fuerzaGrande(x.m).map(z=>13-z)})).sort((a,b)=>cmp(b.v,a.v))[0];
  if(lance==="Pares"){const p=f.map(x=>({i:x.i,p:pares(x.m)})).filter(x=>x.p).sort((a,b)=>b.p.t-a.p.t||b.p.v-a.p.v)[0];return p?{i:p.i,v:[p.p.t,p.p.v]}:null;}
  const j=f.map(x=>({i:x.i,s:suma(x.m)})).filter(x=>x.s>=31).sort((a,b)=>rankJ(b.s)-rankJ(a.s))[0];if(j)return {i:j.i,v:[1,rankJ(j.s)]};
  const p=f.map(x=>({i:x.i,s:suma(x.m)})).sort((a,b)=>b.s-a.s)[0];return {i:p.i,v:[0,p.s],punto:true};}
function ganador(lance){const a=mejorEq(lance,0),b=mejorEq(lance,1);if(!a&&!b)return null;if(!a)return 1;if(!b)return 0;
  if(lance==="Juego"&&(a.v[0]!==b.v[0]))return a.v[0]>b.v[0]?0:1;return cmp(a.v,b.v)>=0?0:1;}   // mano (yo) gana empates
function pintaMesa(){
  const m=(i,oc)=>S.manos[i].map((c,k)=>carta(c,oc,k,i===0&&S.sel.has(k))).join("");
  $("mesa").innerHTML=`<div class="asiento arriba"><b>${JUG[2].e} ${JUG[2].nom} (tu compañero)</b><div>${m(2,true)}</div></div>
  <div class="asiento izq"><b>${JUG[1].e} ${JUG[1].nom}</b><div>${m(1,true)}</div></div><div class="asiento der"><b>${JUG[3].e} ${JUG[3].nom}</b><div>${m(3,true)}</div></div>
  <div class="centro"><div class="marcador">NOSOTROS <b>${S.pts[0]}</b> · ELLOS <b>${S.pts[1]}</b> (a 30)</div><div class="lance">${S.fase==="mus"?"¿Mus?":S.lances[S.li]||""}</div></div>
  <div class="asiento abajo"><b>${JUG[0].e} Tú (Dug)</b><div id="mias">${m(0,false)}</div></div>`;
  $("mesa").querySelectorAll("#mias .naipe").forEach(n=>n.onclick=()=>{if(S.fase!=="mus")return;const k=+n.dataset.i;S.sel.has(k)?S.sel.delete(k):S.sel.add(k);pintaMesa();});}
function pinta(){pintaMesa();const b=$("botones");b.innerHTML="";
  if(S.fase==="mus"){b.innerHTML=`<button class="rosa" id="bmus">🔄 Mus (descarta las marcadas)</button><button id="bnomus">✋ No hay mus</button><p class="nota">Toca tus cartas para marcar las que descartas.</p>`;
    $("bmus").onclick=()=>{const k=[...S.sel];k.forEach(i=>{S.manos[0][i]=S.mazo.pop();});[1,2,3].forEach(j=>{if(Math.random()<.6){const n=1+Math.floor(Math.random()*3);for(let x=0;x<n;x++)S.manos[j][Math.floor(Math.random()*4)]=S.mazo.pop();}});S.sel=new Set();dice(["d","i","s"][Math.floor(Math.random()*3)],azar(["Mus.","Mus, y que cambie la suerte.","Dos cartas, que no se diga."]));S.fase="lance";S.li=0;pinta();};
    $("bnomus").onclick=()=>{S.fase="lance";S.li=0;dice("s","No hay mus. Aquí se juega.");pinta();};return;}
  if(S.fase==="lance"){const l=S.lances[S.li];b.innerHTML=`<p class="nota">${l}: ¿qué haces?</p><button id="paso">Paso</button><button class="cian" id="env">Envido 2</button><button class="rosa" id="ord">💥 ¡Órdago!</button>`;
    $("paso").onclick=()=>resuelve(l,0,false);$("env").onclick=()=>resuelve(l,2,false);$("ord").onclick=()=>resuelve(l,0,true);return;}
  if(S.fase==="fin"){b.innerHTML=`<button class="cian" id="otra">${S.pts[0]>=30?"🏆 Ganáis. Otra partida":S.pts[1]>=30?"😭 Perdéis. Revancha":"Siguiente mano"}</button>`;$("otra").onclick=()=>{if(S.pts[0]>=30||S.pts[1]>=30)nuevaPartida();else reparte();};}}
function fuerzaRival(l){const r=mejorEq(l,1);if(!r)return 0;if(l==="Grande")return r.v[0]*1+r.v[1]*.1;return (r.v[0]||0)*3+(r.v[1]||0)/30;}
function aplicaPuntos(ganaEq,n,mot){S.pts[ganaEq?0:1]+=n;}
function resuelve(l,envite,ordago){
  const g=ganador(l);
  if(g===null){dice("k",`${l}: nadie tiene. Pasamos.`);return sigue();}
  const mio=mejorEq(l,0),rival=mejorEq(l,1);const rivalFuerte=Math.random()<(g===1?.7:.35);
  if(ordago){dice("yo","¡ÓRDAGO!");if(rivalFuerte||g===1){dice("d",azar(["Quiero. Y a ver quién gana.","Lo veo."]));if(g===0){S.pts[0]=30;dice("k","¡Os lo lleváis! Ganáis la partida a lo grande.");}else{S.pts[1]=30;dice("i","Pierdes por bocazas. Tiro un dado: sale un 1... para ti.");}S.fase="fin";return pinta();}
    dice("i","No quiero.");S.pts[0]+=1;return sigue();}
  if(envite){dice("yo",`Envido ${envite} en ${l}.`);if(rivalFuerte||g===1){dice(azar(["d","i"]),"Quiero.");S.pts[g===0?0:1]+=envite+1;dice("k",`${l}: se lo lleva ${g===0?"vuestro equipo":"el equipo del Rizos"} (${envite+1}).`);}else{dice(azar(["d","i"]),"No quiero.");S.pts[0]+=1;}return sigue();}
  // paso: el rival puede envidar
  const rivalEnv=Math.random()<(g===1?.55:.15);
  if(rivalEnv){dice(azar(["d","i"]),`Envido 2 en ${l}.`);$("botones").innerHTML=`<button class="cian" id="q">Quiero</button><button id="nq">No quiero</button>`;
    $("q").onclick=()=>{S.pts[g===0?0:1]+=3;dice("k",`${l}: se lo lleva ${g===0?"vuestro equipo":"el equipo del Rizos"} (3).`);sigue();};$("nq").onclick=()=>{S.pts[1]+=1;dice("yo","No quiero. Me aburro.");sigue();};return;}
  S.pts[g===0?0:1]+=1;dice("k",`${l}: paso paso... se lo lleva ${g===0?"vuestro equipo":"el equipo del Rizos"} (1).`);sigue();}
function sigue(){if(S.pts[0]>=30||S.pts[1]>=30){S.fase="fin";const win=S.pts[0]>=30;dice(win?"s":"d",win?"¡Ganamos! Y sin cariño, como en Irabi.":"Os hemos ganado. Y a la academia le debéis el aprobado.");finPartida(win);return pinta();}
  S.li++;if(S.li>=S.lances.length){S.fase="fin";return pinta();}pinta();}
function finPartida(win){const pts=S.pts[0]*20+(win?400:0);if(win&&window.confeti)confeti();if(window.insignia&&win)insignia("mus-gana","Ganaste al mus en el Kupula");panelRecord($("rec"),"mus",pts,"Puntos del mus");}
$("empezar").onclick=()=>{$("empezar").style.display="none";nuevaPartida();dice("k","Bienvenidos al Bar Kupula. "+azar(FRASES.k));};
