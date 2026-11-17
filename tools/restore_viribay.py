import json, subprocess
old = json.loads(subprocess.check_output(['git', 'show', '277d73c:data/minijuegos.json']).decode('utf-8'))
don = next(g for g in old['juegos'] if g['id'] == 'don-hector')
mj = json.load(open('data/minijuegos.json', encoding='utf-8'))
if not any(g['id'] == 'don-hector' for g in mj['juegos']):
    for g in mj['juegos']:
        if g.get('vds'):
            g['vds'] = False                       # Hermek's test run of 17 Nov becomes a regular game; Don Héctor stays the game of the week
            g['nuevo'] = True
            g.pop('semana', None)
    don['nuevo'] = True
    mj['juegos'].append(don)
json.dump(mj, open('data/minijuegos.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('restored; vds:', [g['id'] for g in mj['juegos'] if g.get('vds')])
