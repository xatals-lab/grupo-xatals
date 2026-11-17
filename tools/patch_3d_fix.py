p = 'js/mj.js'
t = open(p, encoding='utf-8').read()
i = t.index('/* every template now runs in 3D')
j = t.index('const AYUDA={')
bloque = t[i:j]
t = t[:i] + t[j:]
end = '\n})().catch(e=>{document.getElementById("mj")'
assert t.count(end) == 1
t = t.replace(end, '\n' + bloque + end)
open(p, 'w', encoding='utf-8').write(t)
print('3D block moved after TPL definition')
