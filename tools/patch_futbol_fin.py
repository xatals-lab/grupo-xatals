p = 'js/futbol3d.js'
t = open(p, encoding='utf-8').read()
i = t.index('async function turnoParada()')
j = t.index('function fin()', i)
seg = t[i:j]
seg = seg.replace('const fin = new THREE.Vector3(', 'const meta = new THREE.Vector3(').replace('lerpVectors(p0, fin, p)', 'lerpVectors(p0, meta, p)').replace('(fin.y - p0.y)', '(meta.y - p0.y)')
assert 'fin.y' not in seg and 'p0, fin' not in seg
t = t[:i] + seg + t[j:]
# new savage lines
t = t.replace('"⚽ ¡Gol! Tejedor acaba pateando la valla."', '"⚽ ¡Gol! Tejedor acaba pateando la valla. Cuarenta y uno y sin paciencia."')
t = t.replace('"💥 Tejedor te la mete y celebra a patadas."', '"💥 Tejedor te la mete y celebra a patadas. Aupa, viejoven."')
t = t.replace('"🚀 Fuera. Al segundo patio, junto al Bacterio."', '"🚀 Fuera. Ai ama! Al segundo patio, junto al Bacterio, que ya se ríe."')
open(p, 'w', encoding='utf-8').write(t)
print('fin shadowing fixed')
