# Painel das capitais: tendencias 1981-2025 nas capitais dos 10 paises mais populosos escolhidos pela equipe.
# Mesmo metodo do app (valores anuais, Mann-Kendall + Theil-Sen, duas bases: NASA POWER e ERA5).
# Uso: py -3.11 analysis/capitais.py   -> grava docs/data/capitals.json   (codigo escrito com apoio de IA)
import json, os, time, urllib.request, calendar
import numpy as np, pymannkendall as mk

AQUI = os.path.dirname(os.path.abspath(__file__))
CAP = [
    ("New Delhi", "India", "IN", 28.61, 77.21), ("Washington, D.C.", "United States", "US", 38.90, -77.04),
    ("Jakarta", "Indonesia", "ID", -6.20, 106.85), ("Islamabad", "Pakistan", "PK", 33.69, 73.05),
    ("Abuja", "Nigeria", "NG", 9.06, 7.49), ("Brasília", "Brazil", "BR", -15.79, -47.88),
    ("Dhaka", "Bangladesh", "BD", 23.81, 90.41), ("Addis Ababa", "Ethiopia", "ET", 9.03, 38.74),
    ("Mexico City", "Mexico", "MX", 19.43, -99.13), ("Tokyo", "Japan", "JP", 35.68, 139.69),
]
Y0, Y1 = 1981, 2025
YEARS = list(range(Y0, Y1 + 1))
A_MIN, A_MAX = 17.8, 34.5


def briere(T):
    T = np.asarray(T, float)
    return np.where((T > A_MIN) & (T < A_MAX), T * (T - A_MIN) * np.sqrt(np.clip(A_MAX - T, 0, None)), 0.0)


BMAX = briere(np.arange(A_MIN, A_MAX, 0.01)).max()


CACHE = os.path.join(AQUI, "cache_capitais"); os.makedirs(CACHE, exist_ok=True)


def get(url):
    import hashlib, urllib.error
    arq = os.path.join(CACHE, hashlib.md5(url.encode()).hexdigest() + ".json")
    if os.path.exists(arq):
        return json.load(open(arq, encoding="utf-8"))
    for i in range(8):
        try:
            d = json.load(urllib.request.urlopen(url, timeout=180))
            json.dump(d, open(arq, "w", encoding="utf-8"))
            return d
        except urllib.error.HTTPError as e:
            erro = e
            print("  aguardando (HTTP", e.code, ")", url.split("/")[2], flush=True)
            time.sleep(75 if e.code == 429 else 10)
        except Exception as e:
            erro = e
            time.sleep(10)
    raise erro


def tend(vals):
    ys = [y for y, v in zip(YEARS, vals) if v is not None and not np.isnan(v)]
    x = [v for v in vals if v is not None and not np.isnan(v)]
    if len(x) < 15:
        return None
    r = mk.original_test(x)
    sl = np.median([(x[j] - x[i]) / (ys[j] - ys[i]) for i in range(len(x)) for j in range(i + 1, len(x))])
    return {"slope": round(float(sl) * 10, 4), "p": float(r.p), "sig": bool(r.p < 0.05), "dir": int(np.sign(sl)),
            "early": round(float(np.mean(x[:10])), 3), "recent": round(float(np.mean(x[-10:])), 3)}


def veredito(a, b):
    if a and b:
        same = a["dir"] == b["dir"] and a["dir"] != 0
        if a["sig"] and b["sig"] and same: return "confirmed"
        if (a["sig"] or b["sig"]) and same: return "likely"
        if (a["sig"] or b["sig"]) and not same: return "conflict"
        return "none"
    one = a or b
    return "nodata" if not one else ("single" if one["sig"] else "none")


out = []
for nome, pais, cc, lat, lon in CAP:
    p = get(f"https://power.larc.nasa.gov/api/temporal/monthly/point?parameters=T2M,PRECTOTCORR&community=AG&longitude={lon}&latitude={lat}&start={Y0}&end={Y1}&format=JSON")["properties"]["parameter"]
    mT = np.array([[p["T2M"].get(f"{y}{m:02d}", -999) for m in range(1, 13)] for y in YEARS], float); mT[mT < -900] = np.nan
    mP = np.array([[p["PRECTOTCORR"].get(f"{y}{m:02d}", -999) for m in range(1, 13)] for y in YEARS], float); mP[mP < -900] = np.nan
    dias = np.array([[calendar.monthrange(y, m)[1] for m in range(1, 13)] for y in YEARS])
    nasa = {"temp": mT.mean(1), "rain": (mP * dias).sum(1), "aedes": (briere(mT) / BMAX).sum(1)}
    d = get(f"https://archive-api.open-meteo.com/v1/archive?latitude={lat}&longitude={lon}&start_date={Y0}-01-01&end_date={Y1}-12-31&daily=temperature_2m_mean,temperature_2m_max,precipitation_sum&timezone=auto")["daily"]
    yr = np.array([int(t[:4]) for t in d["time"]]); mo = np.array([int(t[5:7]) for t in d["time"]])
    f = lambda k: np.array([np.nan if v is None else v for v in d[k]], float)
    tm, tx, pr = f("temperature_2m_mean"), f("temperature_2m_max"), f("precipitation_sum")
    base = yr <= 2010
    hot = np.nanpercentile(tx[base], 95); wet = max(20.0, np.nanpercentile(pr[base], 99))
    era = {k: [] for k in ("temp", "rain", "hotdays", "heavyrain", "drydays", "aedes")}
    for y in YEARS:
        s = yr == y
        era["temp"].append(np.nanmean(tm[s])); era["rain"].append(np.nansum(pr[s]))
        era["hotdays"].append(float(np.nansum(tx[s] > hot))); era["heavyrain"].append(float(np.nansum(pr[s] >= wet))); era["drydays"].append(float(np.nansum(pr[s] < 1)))
        mm = [np.nanmean(tm[s & (mo == m)]) for m in range(1, 13)]
        era["aedes"].append(float((briere(mm) / BMAX).sum()))
    sig = {}
    for k in ("temp", "hotdays", "rain", "heavyrain", "drydays", "aedes"):
        a = tend(list(nasa[k])) if k in nasa else None
        b = tend(era[k])
        sig[k] = {"nasa": a, "era5": b, "verdict": veredito(a, b)}
    out.append({"name": nome, "country": pais, "cc": cc, "lat": lat, "lon": lon, "hotThr": round(float(hot), 1), "signals": sig})
    t = sig["temp"]
    print(f"{nome:18s} temp NASA {t['nasa']['slope']:+.2f} ERA5 {t['era5']['slope']:+.2f} -> {t['verdict']:9s} | dias quentes {sig['hotdays']['era5']['slope']:+.1f} ({sig['hotdays']['verdict']}) | chuva {sig['rain']['verdict']} | Aedes {sig['aedes']['verdict']}", flush=True)
    time.sleep(45)
json.dump({"note": "Capitals of the ten most populous countries selected by the team; yearly values 1981-2025; Mann-Kendall + Theil-Sen; NASA POWER (MERRA-2) and ERA5.", "capitals": out},
          open(os.path.join(AQUI, "..", "docs", "data", "capitals.json"), "w", encoding="utf-8"), ensure_ascii=False)
print("gravado docs/data/capitals.json")
