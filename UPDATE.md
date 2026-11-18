# Guía de actualización semanal para Hermek (Grupo Xatals)

Cada viernes por la mañana Hermek actualiza SOLO los ficheros de `data/` (y copia las fábulas a `fabulas/`). Nunca toca `*.html`, `js/` ni `css/`: son código y los mantiene Claude.

## Qué actualizar (todo JSON válido UTF-8, sin comentarios)

1. `data/semana.json` (SIEMPRE): `actualizado` (AAAA-MM-DD de hoy), `titulo`, `resumen` (2 frases), `novedades` (3 a 6 frases cortas de lo que se ha añadido o pasó esta semana), `fabulas` (lista de `{"titulo": "...", "url": "fabulas/nombre.pdf"}`, conserva las anteriores y añade la nueva arriba).
2. `data/chistes.json`: añade de 5 a 10 chistes nuevos (`{"tema":"koi|hrk|alaves|bar|cole|vitoria|politica|<otro>", "texto":"..."}`) sacados de lo que Dug, Héctor y Koi han contado esta semana. No borres los antiguos salvo duplicados.
3. `data/apuestas.json`: cambia `jornada`, `partido`, `fecha` por el siguiente partido del Alavés (usa la herramienta de liga) y renueva los mercados. Reglas: los mercados con el mismo `grupo` son excluyentes (solo uno gana, por ejemplo 1x2) y sus `prob` deben sumar 1; los demás son independientes con su `prob` entre 0 y 1; `cuota` ≈ 0,9 / `prob`.
4. `data/personajes.json`: cuando Dug te cuente un compañero o profesor nuevo, añade un objeto a `invitados` con `id` (minúsculas, sin espacios), `nombre`, `emoji`, `rol`, `entrada` (1 o 2 frases) y exactamente 3 `opciones` `{texto, resultado, animo (-20 a 20), cartera (-20 a 5)}`. Para ampliar a alguien existente, añade una opción más o reescribe su `entrada`.
5. `data/frases.json`: añade 2 o 3 frases nuevas `{"frase","autor","opciones"}`; `autor` y cada elemento de `opciones` deben ser `id` existentes en `personajes.json` (cuadrilla o invitados) y `autor` debe estar dentro de `opciones` (4 opciones).

## Reglas
- Humor de cuadrilla, exagerado, cariñoso, sin acusaciones graves (delitos, sexo, salud, dinero). Mismas reglas de Dug de siempre (feedback_recall).
- Antes de publicar, valida: `python3 tools/validate.py`. Si falla, corrige el JSON o restaura con `git checkout -- data/`. Nunca publiques con error.
- Publica: `git add data fabulas && git commit -m "Viernes AAAA-MM-DD" && git push`. GitHub Pages se actualiza solo en 1 o 2 minutos.
- Después manda al grupo el enlace: https://xatals-lab.github.io/grupo-xatals/ con una línea graciosa sobre las novedades (y el enlace a la fábula de la semana si hay).
- Si algo falla (push, validación), reintenta una vez y avisa a Dug por Telegram con el error exacto. No cambies la estructura de los JSON.
