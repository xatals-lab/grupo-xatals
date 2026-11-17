/* Buxai en el recreo: timing game. Dodge the telegraphed punch, then hit while he is open. Ignore the chocolates. */
(()=>{
const $=id=>document.getElementById(id);
let hpTu,hpBx,pts,vivo=false,esquiva=null,pegaAbierto=false,pegaBloqueado=false,fase="";
function pinta(){$("hpTu").style.width=hpTu+"%";$("hpBx").style.width=hpBx+"%";$("pts").textContent=pts+" PTS";}
function msg(t){$("msg").textContent=t;}
function sacude(id){const e=$(id);e.classList.remove("shake");void e.offsetWidth;e.classList.add("shake");}
function entrada(dir){if(!vivo)return;if(fase==="aviso")esquiva=dir;else if(fase==="bombon"){esquiva="mal";}}
function pega(){
  if(!vivo)return;
  if(fase==="bombon"){esquiva="mal";return;}
  if(pegaAbierto&&!pegaBloqueado){pegaBloqueado=true;hpBx=Math.max(0,hpBx-14);pts+=100;msg("💥 ¡TOMA!");sacude("bx");$("bx").textContent="🤕";pinta();}
  else if(!pegaAbierto){hpTu=Math.max(0,hpTu-4);pts=Math.max(0,pts-20);msg("Has pegado al aire. Qué vergüenza.");pinta();}
}
async function ronda(n){
  const dif=Math.max(380,900-n*40);
  $("bx").textContent="😤";$("tu").textContent="🧔";
  if(Math.random()<0.15){
    fase="bombon";esquiva=null;msg("🍫 ¡Buxai saca bombones! NO TOQUES NADA");$("bx").textContent="🍫";
    await esperar(1300);
    if(esquiva==="mal"){hpTu=Math.max(0,hpTu-12);msg("Era un truco. ¡Pum!");sacude("tu");}else{pts+=80;msg("Te emocionas y os abrazáis. +80");}
    fase="";pinta();await esperar(700);return;
  }
  const dir=Math.random()<.5?"izq":"der";esquiva=null;fase="aviso";
  msg("¡VIENE! Esquiva "+(dir==="izq"?"⬅ IZQUIERDA":"DERECHA ➡"));$("bx").textContent=dir==="izq"?"😡👈":"👉😡";
  await esperar(dif+250);
  fase="golpe";
  if(esquiva===dir){pts+=50;msg("Esquivado. ¡Ahora PEGA!");$("tu").textContent="😎";$("bx").textContent="😵";pegaAbierto=true;pegaBloqueado=false;pinta();await esperar(Math.max(500,900-n*25));pegaAbierto=false;}
  else{hpTu=Math.max(0,hpTu-16);msg("¡Te ha dado!");sacude("tu");$("tu").textContent="🤕";pinta();await esperar(600);}
  fase="";
}
async function juego(){
  hpTu=100;hpBx=100;pts=0;vivo=true;pinta();$("rec").innerHTML="";$("start").disabled=true;
  let n=0;
  while(vivo&&hpTu>0&&hpBx>0&&n<30){await ronda(n++);}
  vivo=false;fase="";$("start").disabled=false;
  const gana=hpBx<=0;
  if(gana)pts+=hpTu*5;
  pinta();
  msg(gana?"🏆 ¡Has tumbado a Buxai! Te pide que no cuentes nada en Ryanair.":hpTu<=0?"💀 Buxai te deja en la arboleda. Con bombones.":"Se acaba el recreo. Empate sudoroso.");
  panelRecord($("rec"),"recreo",pts,"Puntos del recreo");
}
$("start").onclick=juego;$("izq").onclick=()=>entrada("izq");$("der").onclick=()=>entrada("der");$("pega").onclick=pega;
document.addEventListener("keydown",e=>{if(e.key==="ArrowLeft")entrada("izq");else if(e.key==="ArrowRight")entrada("der");else if(e.key===" "){e.preventDefault();pega();}});
})();
