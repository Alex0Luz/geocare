# Ciclones tropicais (furacoes, tufoes) desde 1981: quantas tempestades passaram perto de cada ponto do planeta.
# Fonte: NOAA IBTrACS v04r01 (arquivo "since1980"). Gera uma grade de 1 grau em docs/data/cyclones.json.
# Uso: py -3.11 analysis/ciclones.py   (codigo escrito com apoio de IA)
import csv, json, os, urllib.request, collections

AQUI = os.path.dirname(os.path.abspath(__file__))
PASTA = os.path.join(AQUI, "cache_ibtracs"); os.makedirs(PASTA, exist_ok=True)
ARQ = os.path.join(PASTA, "ibtracs.since1980.csv")
URL = "https://www.ncei.noaa.gov/data/international-best-track-archive-for-climate-stewardship-ibtracs/v04r01/access/csv/ibtracs.since1980.list.v04r01.csv"
if not os.path.exists(ARQ) or os.path.getsize(ARQ) < 100_000_000:
    print("baixando IBTrACS (145 MB)...", flush=True)
    urllib.request.urlretrieve(URL, ARQ)
print("lendo", os.path.getsize(ARQ) // 1_000_000, "MB", flush=True)

PER = [(1981, 1991), (1992, 2002), (2003, 2013), (2014, 2024)]
visto = set()                                   # (celula, tempestade)
cel = collections.defaultdict(lambda: {"n": [0, 0, 0, 0], "h": 0, "w": 0, "m": [0] * 12, "b": collections.Counter()})
forte = set()
with open(ARQ, encoding="utf-8", errors="ignore") as f:
    rd = csv.reader(f); cab = next(rd); next(rd)  # segunda linha: unidades
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
        except ValueError: continue
        if w < 34:                               # so a partir de tempestade tropical (34 nos)
            continue
        sid = r[ix["SID"]]; p = next(i for i, (a, b) in enumerate(PER) if a <= ano <= b)
        try: mes = int(r[ix["ISO_TIME"]][5:7]) - 1
        except ValueError: continue
        bacia = r[ix["BASIN"]].strip() or "NA"
        if lon > 180: lon -= 360
        la0, lo0 = int(round(lat)), int(round(lon))
        for dla in (-1, 0, 1):                   # vizinhanca de ~150 km
            for dlo in (-1, 0, 1):
                c = (la0 + dla, ((lo0 + dlo + 180) % 360) - 180)
                d = cel[c]
                if (c, sid) not in visto:
                    visto.add((c, sid)); d["n"][p] += 1; d["m"][mes] += 1; d["b"][bacia] += 1
                if w >= 64 and (c, sid, "h") not in forte:
                    forte.add((c, sid, "h")); d["h"] += 1
                if w > d["w"]: d["w"] = int(w)
out = {f"{la},{lo}": [v["n"], v["h"], v["w"], v["m"], v["b"].most_common(1)[0][0] if v["b"] else ""] for (la, lo), v in cel.items()}
json.dump({"note": "Tropical storms (wind of 34 kt or more) passing within roughly 150 km of each 1-degree cell, 1981-2024. Source: NOAA IBTrACS v04r01. Value: [storms per period, hurricane-strength storms, strongest wind in knots, storms by month of first passage (Jan-Dec), ocean basin].",
           "periods": PER, "cells": out}, open(os.path.join(AQUI, "..", "docs", "data", "cyclones.json"), "w"), separators=(",", ":"))
print("celulas:", len(out))
for nome, (la, lo) in {"Manila": (15, 121), "Miami": (26, -80), "Tokyo": (36, 140), "Dhaka": (24, 90), "Ciudad del Este": (-26, -55)}.items():
    print(" ", nome, out.get(f"{la},{lo}"))
