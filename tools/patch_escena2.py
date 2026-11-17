p = 'js/escena.js'
t = open(p, encoding='utf-8').read()
t = t.replace('const mat = (o) => new THREE.MeshStandardMaterial(o);', 'export const mat = (o) => new THREE.MeshStandardMaterial(o);')
i = t.index('  // bare winter trees')
j = t.index('  function redar()')
t = t[:i] + '  // no trees: the real yard was only concrete\n' + t[j:]
open(p, 'w', encoding='utf-8').write(t)
d = open('data/profesores.json', encoding='utf-8').read().replace('que colecciona hasta vuestras bronca', 'que colecciona hasta vuestras broncas')
open('data/profesores.json', 'w', encoding='utf-8').write(d)
print('escena patched; trees removed:', 'bare winter' not in t)
