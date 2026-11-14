# Panorama mundial: tendencias climaticas 1981-2025 nas maiores cidades do mundo (NASA POWER / MERRA-2, mensal).
# E uma triagem com UMA fonte; o app faz a analise completa, com duas fontes, ao abrir cada cidade.
# Uso: py -3.11 analysis/panorama.py [N]   -> grava docs/data/panorama.json   (codigo escrito com apoio de IA)
import calendar, csv, io, json, math, os, sys, time, urllib.request, zipfile, concurrent.futures as cf
import numpy as np, pymannkendall as mk

AQUI = os.path.dirname(os.path.abspath(__file__))
N = int(sys.argv[1]) if len(sys.argv) > 1 else 300
FORA = {"CN", "HK", "MO", "RU", "VN", "CU", "KP", "LA"}   # paises que a equipe decidiu nao incluir
POR_PAIS = 14                                            # teto por pais, para o panorama cobrir o mundo
Y0, Y1 = 1981, 2025
YEARS = list(range(Y0, Y1 + 1))
CACHE = os.path.join(AQUI, "cache_panorama"); os.makedirs(CACHE, exist_ok=True)

# lista de cidades: GeoNames cities15000 (CC BY 4.0)
z = zipfile.ZipFile(os.path.join(AQUI, "geonames", "cities15000.zip"))
rows = list(csv.reader(io.TextIOWrapper(z.open("cities15000.txt"), encoding="utf-8"), delimiter="\t", quoting=csv.QUOTE_NONE))
cid = sorted(({"name": r[1], "ascii": r[2], "lat": float(r[4]), "lon": float(r[5]), "cc": r[8], "pop": int(r[14] or 0)} for r in rows if r[8] not in FORA), key=lambda c: -c["pop"])
dist = lambda a, b: 111 * math.hypot(a["lat"] - b["lat"], (a["lon"] - b["lon"]) * math.cos(math.radians(a["lat"])))
sel, por = [], {}
for c in cid:
    if len(sel) >= N: break
    if por.get(c["cc"], 0) >= POR_PAIS: continue
    if any(dist(c, s) < 60 for s in sel): continue   # mesma celula do dado: fica a maior
    sel.append(c); por[c["cc"]] = por.get(c["cc"], 0) + 1
print(len(sel), "cidades em", len(por), "paises; menor populacao:", sel[-1]["pop"], flush=True)

A_MIN, A_MAX = 17.8, 34.5
def briere(T):
    T = np.asarray(T, float)
    return np.where((T > A_MIN) & (T < A_MAX), T * (T - A_MIN) * np.sqrt(np.clip(A_MAX - T, 0, None)), 0.0)
BMAX = briere(np.arange(A_MIN, A_MAX, 0.01)).max()

def baixar(c):
    arq = os.path.join(CACHE, f"{c['lat']:.2f}_{c['lon']:.2f}.json")
    if os.path.exists(arq):
        return c, json.load(open(arq))
    url = (f"https://power.larc.nasa.gov/api/temporal/monthly/point?parameters=T2M,PRECTOTCORR,RH2M&community=AG"
           f"&longitude={c['lon']:.2f}&latitude={c['lat']:.2f}&start={Y0}&end={Y1}&format=JSON")
    for i in range(5):
        try:
            p = json.load(urllib.request.urlopen(url, timeout=120))["properties"]["parameter"]
            json.dump(p, open(arq, "w")); return c, p
        except Exception:
            time.sleep(4 + 6 * i)
    return c, None

def tend(x):
    x = np.asarray(x, float); ok = ~np.isnan(x)
    if ok.sum() < 30: return None
    r = mk.original_test(x[ok]); ys = np.array(YEARS)[ok]; v = x[ok]
    sl = np.median([(v[j] - v[i]) / (ys[j] - ys[i]) for i in range(len(v)) for j in range(i + 1, len(v))])
    return {"s": round(float(sl) * 10, 4), "p": round(float(r.p), 5), "sig": bool(r.p < 0.05), "a": round(float(v[:10].mean()), 2), "b": round(float(v[-10:].mean()), 2)}

out = []
with cf.ThreadPoolExecutor(5) as ex:
    for k, (c, p) in enumerate(ex.map(baixar, sel)):
        if not p: print("falhou", c["name"], flush=True); continue
        M = lambda n: np.where((m := np.array([[p[n].get(f"{y}{mo:02d}", -999) for mo in range(1, 13)] for y in YEARS], float)) < -900, np.nan, m)
        T, P, RH = M("T2M"), M("PRECTOTCORR"), M("RH2M")
        dias = np.array([[calendar.monthrange(y, mo)[1] for mo in range(1, 13)] for y in YEARS])
        sig = {"temp": tend(T.mean(1)), "hotmonth": tend(T.max(1)), "rain": tend((P * dias).sum(1)), "humidity": tend(RH.mean(1)), "aedes": tend((briere(T) / BMAX).sum(1))}
        if not sig["temp"]: continue
        n_sig = sum(1 for s in sig.values() if s and s["sig"])
        rain_pct = (sig["rain"]["s"] / sig["rain"]["a"] * 100) if sig["rain"] and sig["rain"]["a"] > 50 else 0.0
        # indice de mudanca (0-100): quanto o clima local se deslocou; so entram sinais significativos
        sc = 0.0
        if sig["temp"]["sig"]: sc += min(abs(sig["temp"]["s"]) / 0.5, 1) * 40
        if sig["hotmonth"] and sig["hotmonth"]["sig"]: sc += min(abs(sig["hotmonth"]["s"]) / 0.6, 1) * 20
        if sig["rain"] and sig["rain"]["sig"]: sc += min(abs(rain_pct) / 8, 1) * 20
        if sig["aedes"] and sig["aedes"]["sig"]: sc += min(abs(sig["aedes"]["s"]) / 0.3, 1) * 20
        out.append({"name": c["name"], "cc": c["cc"], "lat": round(c["lat"], 3), "lon": round(c["lon"], 3), "pop": c["pop"], "score": round(sc, 1), "nsig": n_sig, "rainPct": round(rain_pct, 1), "sig": sig})
        if (k + 1) % 50 == 0: print(k + 1, "prontas", flush=True)
out.sort(key=lambda c: -c["score"])
json.dump({"note": "Screening with one source (NASA POWER / MERRA-2), yearly values 1981-2025, Mann-Kendall + Theil-Sen. Change index 0-100 uses only significant trends.",
           "years": [Y0, Y1], "cities": out}, open(os.path.join(AQUI, "..", "docs", "data", "panorama.json"), "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
print("gravado", len(out), "cidades")
for c in out[:15]: print(f"{c['score']:5.1f} {c['name']:22s} {c['cc']} T {c['sig']['temp']['s']:+.2f} mes+quente {c['sig']['hotmonth']['s']:+.2f} chuva {c['rainPct']:+.1f}%/dec Aedes {c['sig']['aedes']['s']:+.2f}")
print("aquecimento significativo:", sum(1 for c in out if c['sig']['temp']['sig'] and c['sig']['temp']['s'] > 0), "de", len(out))
