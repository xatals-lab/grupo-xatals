m = open('make_pages.py', encoding='utf-8').read()
i = m.index("'<script>cargaJSON(\"semana\")")
j = m.index("</script>'),", i) + len("</script>'")
m = m[:i] + "'<script src=\"js/home.js\"></script>'" + m[j:]
open('make_pages.py', 'w', encoding='utf-8').write(m)
print('home script moved out')
