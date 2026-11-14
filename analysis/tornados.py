# Tornados nos Estados Unidos desde 1981: quantos comecaram perto de cada ponto (grade de 1 grau).
# Fonte: NOAA Storm Prediction Center, base "actual tornadoes" 1950-2024. So cobre os EUA.
# Uso: py -3.11 analysis/tornados.py   (codigo escrito com apoio de IA)
import csv, json, os, urllib.request, collections

AQUI = os.path.dirname(os.path.abspath(__file__))
PASTA = os.path.join(AQUI, "cache_tornados"); os.makedirs(PASTA, exist_ok=True)
ARQ = os.path.join(PASTA, "tor2024.csv")
URL = "https://www.spc.noaa.gov/wcm/data/1950-2024_actual_tornadoes.csv"
if not os.path.exists(ARQ) or os.path.getsize(ARQ) < 5_000_000:
    print("baixando SPC (8 MB)...", flush=True)
    urllib.request.urlretrieve(URL, ARQ)

PER = [(1981, 1991), (1992, 2002), (2003, 2013), (2014, 2024)]
cel = collections.defaultdict(lambda: {"n": [0, 0, 0, 0], "s": 0, "m": [0] * 12})
tot = 0
with open(ARQ, encoding="utf-8", errors="ignore") as f:
    for r in csv.DictReader(f):
        try:
            ano = int(r["yr"]); mes = int(r["mo"]) - 1; mag = int(r["mag"]); lat = float(r["slat"]); lon = float(r["slon"])
        except ValueError:
            continue
        if ano < 1981 or ano > 2024 or mag < 1 or lat == 0 or lon == 0:   # so EF1 ou mais (os EF0 dependem muito de quem relata)
            continue
        tot += 1
        p = next(i for i, (a, b) in enumerate(PER) if a <= ano <= b)
        la0, lo0 = int(round(lat)), int(round(lon))
        for dla in (-1, 0, 1):                   # vizinhanca de ~150 km
            for dlo in (-1, 0, 1):
                d = cel[(la0 + dla, lo0 + dlo)]
                d["n"][p] += 1; d["m"][mes] += 1
                if mag >= 3: d["s"] += 1
out = {f"{la},{lo}": [v["n"], v["s"], v["m"]] for (la, lo), v in cel.items()}
json.dump({"note": "Tornadoes rated EF1 or stronger that started within roughly 150 km of each 1-degree cell, 1981-2024. United States only. Source: NOAA Storm Prediction Center, actual tornadoes database. Value: [tornadoes per period, rated EF3 or stronger, tornadoes by month (Jan-Dec)].",
           "periods": PER, "cells": out}, open(os.path.join(AQUI, "..", "docs", "data", "tornadoes.json"), "w"), separators=(",", ":"))
print("tornados EF1+:", tot, "celulas:", len(out))
for nome, (la, lo) in {"Oklahoma City": (35, -98), "Miami": (26, -80), "Nashville": (36, -87), "Los Angeles": (34, -118), "Chicago": (42, -88)}.items():
    print(" ", nome, out.get(f"{la},{lo}"))
