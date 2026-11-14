# Natureza por pais: area de floresta ao longo do tempo, especies ameacadas e areas protegidas.
# Fonte: World Bank Open Data (FAO para floresta; IUCN / UNEP-WCMC para especies e areas protegidas). Gera docs/data/nature.json.
# Uso: py -3.11 analysis/natureza.py   (codigo escrito com apoio de IA)
import json, os, time, urllib.request

AQUI = os.path.dirname(os.path.abspath(__file__))
EXCLUIR = {"CN", "HK", "MO", "TW", "RU", "VN", "CU", "KP", "LA"}   # regra da equipe
IND = {
    "forest": "AG.LND.FRST.ZS",    # floresta, % da area de terra (serie)
    "mam": "EN.MAM.THRD.NO",       # mamiferos ameacados
    "bir": "EN.BIR.THRD.NO",       # aves ameacadas
    "fsh": "EN.FSH.THRD.NO",       # peixes ameacados
    "plt": "EN.HPT.THRD.NO",       # plantas superiores ameacadas
    "prot": "ER.LND.PTLD.ZS",      # areas terrestres protegidas, % da terra
}


def baixar(code):
    url = f"https://api.worldbank.org/v2/country/all/indicator/{code}?format=json&per_page=20000&date=1990:2025"
    for tentativa in range(4):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36"})   # sem isso a API nao responde
            d = json.load(urllib.request.urlopen(req, timeout=240))
            return d[1] or []
        except Exception as e:
            print("  falhou", code, e, flush=True); time.sleep(5 + 10 * tentativa)
    return []


out, nomes = {}, {}
for chave, code in IND.items():
    linhas = baixar(code)
    nomes[chave] = linhas[0]["indicator"]["value"] if linhas else None
    print(chave, code, len(linhas), nomes[chave], flush=True)
    for r in linhas:
        cc, v = r["country"]["id"], r["value"]
        if v is None or len(cc) != 2 or cc in EXCLUIR or not r["countryiso3code"]:
            continue
        c = out.setdefault(cc, {})
        if chave == "forest":
            c.setdefault("forest", {})[int(r["date"])] = round(v, 2)
        else:                                   # so o valor mais recente
            ano = int(r["date"])
            if chave not in c or ano > c[chave][1]:
                c[chave] = [round(v, 1) if chave == "prot" else int(v), ano]
# agregados regionais do Banco Mundial tem codigo de 2 letras tambem: ficam so os que tem floresta e sao paises (iso3 preenchido ja filtrou)
json.dump({"note": "Forest area (% of land area, yearly series, FAO) and the latest count of threatened mammal, bird, fish and higher plant species (IUCN Red List) and terrestrial protected areas (% of land, UNEP-WCMC), all as published by World Bank Open Data. Threatened-species counts depend on how many species were assessed in each country, so they are not comparable between countries.",
           "source": {"name": "World Bank Open Data", "url": "https://data.worldbank.org", "licence": "CC BY 4.0"}, "indicators": {k: [IND[k], nomes[k]] for k in IND},
           "countries": out}, open(os.path.join(AQUI, "..", "docs", "data", "nature.json"), "w", encoding="utf-8"), separators=(",", ":"))
print("paises:", len(out))
for cc in ("PY", "BR", "US", "ID", "NG"):
    c = out.get(cc, {}); f = c.get("forest", {}); ys = sorted(f)
    print(" ", cc, (ys[0], f[ys[0]], ys[-1], f[ys[-1]]) if ys else None, {k: c.get(k) for k in ("mam", "bir", "fsh", "plt", "prot")})
