# Converte respostas brutas do ERA5 (Open-Meteo), ja baixadas, no mesmo formato que o app calcula ao vivo.
# O app usa esses arquivos como reserva quando o servico gratuito atinge o limite de pedidos por hora.
# Uso: py -3.11 analysis/era5_estatico.py   -> docs/data/era5/*.json + index.json   (codigo escrito com apoio de IA)
import glob, json, os
import numpy as np

AQUI = os.path.dirname(os.path.abspath(__file__))
SAIDA = os.path.join(AQUI, "..", "docs", "data", "era5"); os.makedirs(SAIDA, exist_ok=True)
Y0, Y1 = 1981, 2025
A_MIN, A_MAX = 17.8, 34.5


def briere(T):
    T = np.asarray(T, float)
    return np.where((T > A_MIN) & (T < A_MAX), T * (T - A_MIN) * np.sqrt(np.clip(A_MAX - T, 0, None)), 0.0)


BMAX = briere(np.arange(A_MIN, A_MAX, 0.01)).max()
num = lambda v, d=3: None if v is None or (isinstance(v, float) and np.isnan(v)) else round(float(v), d)

index = []
brutos = glob.glob(os.path.join(AQUI, "cache_capitais", "*.json")) + glob.glob(os.path.join(AQUI, "cache_era5", "*.json"))
for arq in brutos:
    d = json.load(open(arq, encoding="utf-8"))
    if "daily" not in d or "temperature_2m_max" not in d["daily"]:
        continue
    dd = d["daily"]
    yr = np.array([int(t[:4]) for t in dd["time"]]); mo = np.array([int(t[5:7]) - 1 for t in dd["time"]])
    f = lambda k: np.array([np.nan if v is None else v for v in dd[k]], float)
    tm, tx, pr = f("temperature_2m_mean"), f("temperature_2m_max"), f("precipitation_sum")
    base = yr <= 2010
    hot = float(np.nanpercentile(tx[base], 95)); wet = max(20.0, float(np.nanpercentile(pr[base], 99)))
    o = {k: [] for k in ("temp", "rain", "hotdays", "heavyrain", "drydays", "aedes")}; monthlyT = []
    for y in range(Y0, Y1 + 1):
        s = yr == y; ok = int(np.sum(~np.isnan(tm[s]))) >= 360
        mm = [float(np.nanmean(tm[s & (mo == m)])) if np.any(~np.isnan(tm[s & (mo == m)])) else np.nan for m in range(12)]
        monthlyT.append([num(v, 2) for v in mm])
        o["temp"].append(num(np.nanmean(tm[s])) if ok else None); o["rain"].append(num(np.nansum(pr[s]), 1) if ok else None)
        o["hotdays"].append(float(np.nansum(tx[s] > hot)) if ok else None); o["heavyrain"].append(float(np.nansum(pr[s] >= wet)) if ok else None)
        o["drydays"].append(float(np.nansum(pr[s] < 1)) if ok else None)
        o["aedes"].append(num(float((briere(mm) / BMAX).sum())) if not any(np.isnan(mm)) else None)
    cal = []
    for m in range(12):
        s = (yr >= Y1 - 9) & (mo == m); n = int(s.sum())
        tmean = float(np.nanmean(tm[s]))
        cal.append({"hot": num(np.nansum(tx[s] > hot) / n, 4), "heavy": num(np.nansum(pr[s] >= wet) / n * 30, 3), "rain": num(np.nansum(pr[s]) / 10, 1), "aedes": num(float(briere([tmean])[0] / BMAX), 3)})
    nome = f"{d['latitude']:.2f}_{d['longitude']:.2f}.json"
    json.dump({"hotThr": num(hot, 2), "wetThr": num(wet, 1), "monthlyT": monthlyT, "calendar": cal, **o}, open(os.path.join(SAIDA, nome), "w"), separators=(",", ":"))
    index.append({"lat": round(d["latitude"], 3), "lon": round(d["longitude"], 3), "file": nome})
json.dump(index, open(os.path.join(SAIDA, "index.json"), "w"))
print("gravados", len(index), "arquivos de reserva do ERA5")
