# Dados para os mapas animados do app:
#  1) contorno simplificado dos departamentos do Paraguai (geoBoundaries, CC BY 4.0) -> docs/data/paraguay_geo.json
#  2) trajetorias das tempestades tropicais 1981-2024 (NOAA IBTrACS v04r01), um ponto a cada 12 h -> docs/data/tracks.json
# Uso: py -3.11 analysis/mapas_animados.py   (codigo escrito com apoio de IA)
import csv, json, os, collections

AQUI = os.path.dirname(os.path.abspath(__file__))
DOCS = os.path.join(AQUI, "..", "docs", "data")


def simplificar(pts, tol):
    # Douglas-Peucker sem recursao
    if len(pts) < 3:
        return pts
    manter = [False] * len(pts); manter[0] = manter[-1] = True
    pilha = [(0, len(pts) - 1)]
    while pilha:
        a, b = pilha.pop()
        (x1, y1), (x2, y2) = pts[a], pts[b]
        dx, dy = x2 - x1, y2 - y1; n = (dx * dx + dy * dy) ** 0.5 or 1e-12
        pior, ip = 0.0, -1
        for i in range(a + 1, b):
            d = abs(dy * (pts[i][0] - x1) - dx * (pts[i][1] - y1)) / n
            if d > pior: pior, ip = d, i
        if pior > tol and ip > 0:
            manter[ip] = True; pilha.append((a, ip)); pilha.append((ip, b))
    return [p for p, k in zip(pts, manter) if k]


# ---- 1) departamentos do Paraguai
geo = json.load(open(os.path.join(AQUI, "cache_paraguai", "geoboundaries", "geoBoundaries-PRY-ADM1_simplified.geojson"), encoding="utf-8"))
deps = {}
for f in geo["features"]:
    g = f["geometry"]; polis = g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
    aneis = []
    for poli in polis:
        anel = [(x, y) for x, y in poli[0]]                             # so o anel externo
        # anel fechado: divide no ponto mais distante do primeiro, senao o primeiro e o ultimo coincidem
        longe = max(range(len(anel)), key=lambda i: (anel[i][0] - anel[0][0]) ** 2 + (anel[i][1] - anel[0][1]) ** 2)
        ext = simplificar(anel[:longe + 1], 0.012) + simplificar(anel[longe:], 0.012)[1:]
        if len(ext) >= 4:
            aneis.append([[round(y, 3), round(x, 3)] for x, y in ext])     # [lat, lon] para o Leaflet
    deps[f["properties"]["shapeISO"]] = aneis
json.dump({"note": "Simplified outlines of the departments of Paraguay. Source: geoBoundaries gbOpen PRY ADM1 (CC BY 4.0). Rings are [lat, lon].", "departments": deps},
          open(os.path.join(DOCS, "paraguay_geo.json"), "w", encoding="utf-8"), separators=(",", ":"))
print("departamentos:", len(deps), "pontos:", sum(len(a) for v in deps.values() for a in v), "bytes:", os.path.getsize(os.path.join(DOCS, "paraguay_geo.json")))

# ---- 2) trajetorias das tempestades tropicais
ARQ = os.path.join(AQUI, "cache_ibtracs", "ibtracs.since1980.csv")
tr = collections.OrderedDict()
with open(ARQ, encoding="utf-8", errors="ignore") as f:
    rd = csv.reader(f); cab = next(rd); next(rd)
    ix = {k: i for i, k in enumerate(cab)}
    for r in rd:
        try:
            ano = int(r[ix["SEASON"]]); lat = float(r[ix["LAT"]]); lon = float(r[ix["LON"]])
        except ValueError:
            continue
        if ano < 1981 or ano > 2024:
            continue
        w = r[ix["USA_WIND"]].strip() or r[ix["WMO_WIND"]].strip()
        try: w = float(w)
        except ValueError: w = 0.0
        t = r[ix["ISO_TIME"]]
        if lon > 180: lon -= 360
        d = tr.setdefault(r[ix["SID"]], {"w": 0.0, "m": None, "p": []})
        if w >= 34 and d["m"] is None:
            d["m"] = int(t[5:7])                                           # mes em que virou tempestade tropical
        d["w"] = max(d["w"], w)
        if d["m"] is not None and t[11:13] in ("00", "12") and t[14:16] == "00":
            d["p"].append((round(lat * 10), round(lon * 10), w))
out = []
for sid, d in tr.items():
    if d["w"] < 34 or d["m"] is None:
        continue
    pts = d["p"]
    while pts and pts[-1][2] < 34: pts = pts[:-1]                           # corta o fim, ja dissipada
    if len(pts) < 2:
        continue
    flat = []
    for la, lo, _ in pts: flat += [la, lo]
    out.append([d["m"], int(d["w"]), flat])
json.dump({"note": "Tracks of tropical storms (maximum wind of 34 kt or more), 1981-2024, one point every 12 hours from the time each system reached tropical-storm strength. Source: NOAA IBTrACS v04r01. Each row: [month it became a tropical storm, maximum wind in knots, [lat*10, lon*10, lat*10, lon*10, ...]].",
           "storms": out}, open(os.path.join(DOCS, "tracks.json"), "w", encoding="utf-8"), separators=(",", ":"))
print("tempestades:", len(out), "pontos:", sum(len(s[2]) // 2 for s in out), "bytes:", os.path.getsize(os.path.join(DOCS, "tracks.json")))
print("por mes:", [sum(1 for s in out if s[0] == m) for m in range(1, 13)])

# ---- 3) tornados (EUA): grade de meio grau com total e meses, e trajetoria dos mais fortes (EF3 ou mais)
ARQT = os.path.join(AQUI, "cache_tornados", "tor2024.csv")
celt = collections.defaultdict(lambda: [0] * 13); fortes = []; mes_total = [0] * 12
with open(ARQT, encoding="utf-8", errors="ignore") as f:
    for r in csv.DictReader(f):
        try:
            ano = int(r["yr"]); mes = int(r["mo"]) - 1; mag = int(r["mag"]); la = float(r["slat"]); lo = float(r["slon"]); ela = float(r["elat"]); elo = float(r["elon"])
        except ValueError:
            continue
        if ano < 1981 or ano > 2024 or mag < 1 or la == 0 or lo == 0:
            continue
        c = celt[(round(la * 2) / 2, round(lo * 2) / 2)]; c[0] += 1; c[1 + mes] += 1; mes_total[mes] += 1
        if mag >= 3:
            fortes.append([round(la, 2), round(lo, 2), round(ela, 2) if ela else 0, round(elo, 2) if elo else 0, mag, mes + 1])
cells = {f"{la:g},{lo:g}": v for (la, lo), v in celt.items()}
json.dump({"note": "Tornadoes rated EF1 or stronger, United States, 1981-2024 (NOAA Storm Prediction Center). cells: half-degree cell (centre lat,lon) -> [total, Jan..Dec] counted where each tornado started. strong: tornadoes rated EF3 or stronger as [start lat, start lon, end lat, end lon (0 when not recorded), EF rating, month]. months: all tornadoes by month.",
           "cells": cells, "strong": fortes, "months": mes_total}, open(os.path.join(DOCS, "tornado_map.json"), "w", encoding="utf-8"), separators=(",", ":"))
tot = sorted(v[0] for v in cells.values())
q = lambda p: tot[int(p * (len(tot) - 1))]
print("celulas de tornado:", len(cells), "fortes:", len(fortes), "bytes:", os.path.getsize(os.path.join(DOCS, "tornado_map.json")))
print("total por celula - mediana, p75, p90, p97, max:", q(.5), q(.75), q(.9), q(.97), tot[-1], "| por mes:", mes_total)
mm = sorted(x for v in cells.values() for x in v[1:] if x)
print("por celula e mes (so > 0) - mediana, p75, p90, p97, max:", mm[len(mm) // 2], mm[int(.75 * len(mm))], mm[int(.9 * len(mm))], mm[int(.97 * len(mm))], mm[-1])
