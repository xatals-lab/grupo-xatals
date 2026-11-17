p = 'js/carril3d.js'
t = open(p, encoding='utf-8').read()
old = 'const cerca = E.puertas.some(p => !p.hecho && p.z > -75);'
assert t.count(old) == 1
t = t.replace(old, 'const cerca = E.puertas.some(p => !p.hecho && p.z > -75), slow = E.puertas.some(p => !p.hecho && p.z > -22);')
old = '* (cerca ? .6 : 1);'
assert t.count(old) == 1
t = t.replace(old, '* (cerca ? .75 : 1); if (slow) E.v = 5.2;   // SLOW MOTION: about 3 seconds to choose the lane\n      ui.classList.toggle("slowmo", slow);')
open(p, 'w', encoding='utf-8').write(t)
c = open('css/premium.css', encoding='utf-8').read()
c += '''
.c3d-ui.slowmo::before{content:"";position:absolute;inset:0;box-shadow:inset 0 0 90px 30px #00e5ffaa;pointer-events:none;animation:latido 1s ease-in-out infinite}
.c3d-ui.slowmo::after{content:"🐌 CÁMARA LENTA: ¡ELIGE VÍA!";position:absolute;left:0;right:0;top:4.6rem;text-align:center;font-family:Bangers,Impact,sans-serif;font-size:1.6rem;color:#00e5ff;text-shadow:0 0 14px #000,2px 2px 0 #000;pointer-events:none}
@keyframes latido{50%{opacity:.5}}
'''
open('css/premium.css', 'w', encoding='utf-8').write(c)
print('slow motion added')
