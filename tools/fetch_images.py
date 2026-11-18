"""Fetch royalty-free images (Wikimedia Commons: CC0, Public domain, CC BY, CC BY-SA) for the card thumbnails, with credits.
Run from the repo root: python tools/fetch_images.py. Writes img/<clave>.jpg and data/creditos.json. Skips NC/ND licences."""
import json, os, re, subprocess, sys, urllib.parse, html

UA = "GrupoXatalsFriendsSite/1.0 (non-commercial fun site; contact via github.com/xatals-lab)"
OK = re.compile(r"^(CC0|Public domain|PD|CC BY(-SA)? [0-9.]+|CC BY(-SA)?$|Attribution)", re.I)
TEMAS = {
 "futbol": ["soccer penalty kick", "football goalkeeper dive", "futsal court"],
 "estadio": ["Mendizorroza stadium Vitoria", "Deportivo Alavés"],
 "cerveza": ["glass of beer bar", "beer glasses table"],
 "pintxos": ["Pincho Vitoria", "pintxos bar counter"],
 "tren": ["Renfe train", "train driver cab", "locomotive railway"],
 "aula": ["classroom blackboard", "school classroom desks"],
 "cartas": ["baraja española cartas", "Spanish playing cards"],
 "guitarra": ["punk concert guitarist", "bass guitar heavy metal concert"],
 "boxeo": ["boxing gloves", "boxing ring"],
 "oficina": ["office desk", "paperwork"],
 "camino": ["Camino de Santiago pilgrim", "pilgrim albergue bunk beds"],
 "risa": ["friends laughing", "laughing people group"],
 "datos": ["bar chart statistics", "data dashboard screen"],
 "laboratorio": ["chemistry laboratory glassware", "science laboratory"],
 "periodico": ["newspaper stack", "newspaper reading"],
 "trofeo": ["trophy cup", "golden trophy"],
 "txapela": ["txapela Basque beret", "Basque man beret"],
 "vitoria": ["Vitoria-Gasteiz Plaza de la Virgen Blanca", "Vitoria-Gasteiz old town"],
 "lluvia": ["umbrella rain street", "rainy day umbrella"],
 "vaca": ["cow cattle", "cows field"],
 "ordenador": ["computer monitor", "personal computer"],
 "examen": ["student exam paper", "students taking exam"],
 "concierto": ["concert", "rock concert"],
 "filosofia": ["Plato", "philosopher statue"],
 "gimnasio": ["gym", "weightlifting"],
 "globo": ["balloon", "party balloons"],
 "celedon": ["Celedón", "fiestas de la Blanca"],
 "derecho": ["gavel", "courtroom"],
 "campana": ["election poster", "campaign poster"],
 "patio": ["playground", "schoolyard"],
 "profesor": ["teacher", "professor lecture"],
 "bajo": ["bassist", "bass guitar"],
 "puzzle": ["puzzle", "jigsaw"],
 "multitud": ["crowd of people", "busy crowd street"],
 "euskera": ["Euskara Basque language sign", "Basque flag ikurriña"],
}


def api(q):
    url = ("https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=" + urllib.parse.quote(q + " filetype:bitmap")
           + "&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url|extmetadata|size|mime&iiurlwidth=800&format=json&formatversion=2")
    out = subprocess.run(["curl", "-s", "-A", UA, url], capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=60).stdout
    try:
        return json.loads(out).get("query", {}).get("pages", [])
    except Exception:
        return []


def limpia(s):
    return html.unescape(re.sub(r"<[^>]+>", "", s or "")).strip()


def main():
    os.makedirs("img", exist_ok=True)
    cred = json.load(open("data/creditos.json", encoding="utf-8")) if os.path.exists("data/creditos.json") else {}
    for clave, consultas in TEMAS.items():
        if os.path.exists(f"img/{clave}.jpg") and clave in cred:
            continue
        hecho = False
        for q in consultas:
            for p in sorted(api(q), key=lambda x: x.get("index", 99)):
                ii = (p.get("imageinfo") or [{}])[0]; m = ii.get("extmetadata", {})
                lic = limpia(m.get("LicenseShortName", {}).get("value"))
                if not OK.match(lic) or ii.get("mime") not in ("image/jpeg", "image/png") or (ii.get("width") or 0) < 600: continue
                claves_t = [w for w in re.findall(r"[a-záéíóúñ]+", q.lower()) if len(w) > 3 and w not in ("with", "filetype")]
                if not any(w in p["title"].lower() for w in claves_t): continue          # the title must mention the theme
                url = ii.get("thumburl") or ii.get("url")
                dest = f"img/{clave}.jpg"
                r = subprocess.run(["curl", "-s", "-L", "-A", UA, "-o", dest, "-w", "%{http_code}", url], capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=120)
                if r.stdout.strip() != "200" or os.path.getsize(dest) < 8000:
                    if os.path.exists(dest): os.remove(dest)
                    continue
                cred[clave] = {"titulo": p["title"].replace("File:", ""), "autor": limpia(m.get("Artist", {}).get("value"))[:80], "licencia": lic, "url": ii.get("descriptionurl", ""), "kb": os.path.getsize(dest) // 1024}
                print("OK", clave, "<-", cred[clave]["titulo"][:50], "|", lic, "|", cred[clave]["kb"], "KB")
                hecho = True; break
            if hecho: break
        if not hecho: print("SIN IMAGEN", clave)
    json.dump(cred, open("data/creditos.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
