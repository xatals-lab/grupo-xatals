m = open('make_pages.py', encoding='utf-8').read()
old = '        fh.write(HEAD.format(t=title) + body + "\\n</main>" + script + "</body></html>\\n")'
assert m.count(old) == 1
new = ('        html = HEAD.format(t=title) + body + "\\n</main>" + script + "</body></html>\\n"\n'
       '        html = re.sub(r\'((?:src|href)="(?:js|css)/[^"?]+)"\', r\'\\1?v=\' + VER + \'"\', html)      # cache-busting for phones\n'
       '        fh.write(html)')
m = m.replace(old, new)
if 'VER = ' not in m:
    m = 'import re, time\nVER = time.strftime("%Y%m%d%H%M")\n' + m
open('make_pages.py', 'w', encoding='utf-8').write(m)
print('cache-busting added')
