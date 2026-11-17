p = 'js/mj.js'
t = open(p, encoding='utf-8').read()
old = 'function pinta(){const n=Math.floor(v/5);$("pal").textContent=((g.pre||"Di")+(g.vocal||"o").repeat(1+n)+(g.suf||"s")).toUpperCase();}'
new = ('function pinta(){const n=Math.floor(v/5),P=(g.palabra||"Dios").toUpperCase(),V="AEIOUÁÉÍÓÚ";'
       '$("pal").textContent=[...P].map((c,k)=>c.repeat(1+Math.floor(n*(V.includes(c)?.55:k===P.length-1?.2:0)))).join("");}')
assert t.count(old) == 1
open(p, 'w', encoding='utf-8').write(t.replace(old, new))
m = open('tools/mkjuegos.py', encoding='utf-8').read()
old = '"pre": "Di", "vocal": "o", "suf": "s", "rondas": 5'
assert m.count(old) == 1
open('tools/mkjuegos.py', 'w', encoding='utf-8').write(m.replace(old, '"palabra": "Dios", "rondas": 5'))
print('ok')
