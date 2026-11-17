p = 'js/carril3d.js'
L = open(p, encoding='utf-8').read().split('\n')
# lines are 1-based in grep: 84 = "(function bucle() {", 85 = first body line, 106 = line before cam.position.set (the shake decrement)
i = next(k for k, l in enumerate(L) if l.startswith('  (function bucle() {'))
j = next(k for k, l in enumerate(L) if l.strip().startswith('cam.position.set(E.x'))
body = L[i + 1:j]                      # logic that must run in small fixed steps
first = body[0]
assert 'requestAnimationFrame(bucle)' in first
body[0] = '    const tt = reloj.elapsedTime;'
head = ['  function paso(dt) {'] + body + ['  }']
loop = ['  (function bucle() {', '    if (!E.vivo) return; requestAnimationFrame(bucle); const real = Math.min(.35, reloj.getDelta());',
        '    for (let rest = real; rest > 1e-4 && E.vivo; rest -= .04) paso(Math.min(.04, rest));', '    const dt = real;']
L = L[:i] + head + loop + L[j:]
open(p, 'w', encoding='utf-8').write('\n'.join(L))
print('fixed time steps applied')
