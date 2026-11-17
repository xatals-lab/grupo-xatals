p = 'js/mj.js'
t = open(p, encoding='utf-8').read()
old = 'function pinta(){const n=Math.floor(v/6);$("pal").textContent=pal[0].toUpperCase()+pal.slice(1,-2)+(g.vocal||pal[pal.length-2]).repeat(1+n)+pal.slice(-1);}'
new = 'function pinta(){const n=Math.floor(v/5);$("pal").textContent=((g.pre||"Di")+(g.vocal||"o").repeat(1+n)+(g.suf||"s")).toUpperCase();}'
assert t.count(old) == 1
t = t.replace(old, new).replace('const pal=g.palabra||"Dios";', '')
open(p, 'w', encoding='utf-8').write(t)
print('patched')
