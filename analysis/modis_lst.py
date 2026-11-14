# Temperatura da superficie medida por satelite (MODIS Terra MOD11A2, 1 km, 8 dias) via ORNL DAAC, sem login.
# Compara o centro de Ciudad del Este com a mata do Parque Nacional do Iguacu. Codigo escrito com apoio de IA.
import json, urllib.request, concurrent.futures as cf, datetime as dt, collections
import numpy as np, pymannkendall as mk
SITES = {"CDE centro": (-25.513, -54.615), "Mata do Iguacu": (-25.62, -54.30), "Lavoura (Hernandarias)": (-25.30, -54.75)}
BASE = "https://modis.ornl.gov/rst/api/v1/MOD11A2"
def req(u):
    for _ in range(4):
        try:
            return json.load(urllib.request.urlopen(urllib.request.Request(u, headers={"Accept": "application/json"}), timeout=90))
        except Exception as e:
            err = e
    return None
out = {}
for name, (la, lo) in SITES.items():
    dates = [d["modis_date"] for d in req(f"{BASE}/dates?latitude={la}&longitude={lo}")["dates"]]
    # so o verao austral (dez-fev) para caber no tempo: dia do ano >= 335 ou <= 59
    dates = [d for d in dates if int(d[5:]) >= 335 or int(d[5:]) <= 59]
    chunks = [dates[i:i + 10] for i in range(0, len(dates), 10)]
    res = {"LST_Day_1km": {}, "LST_Night_1km": {}}
    def job(args):
        band, ch = args
        return band, req(f"{BASE}/subset?latitude={la}&longitude={lo}&band={band}&startDate={ch[0]}&endDate={ch[-1]}&kmAboveBelow=1&kmLeftRight=1")
    with cf.ThreadPoolExecutor(6) as ex:
        for band, r in ex.map(job, [(b, c) for b in res for c in chunks]):
            if not r: continue
            for s in r["subset"]:
                v = np.array(s["data"], float); v = v[v > 7500] * 0.02 - 273.15   # fator de escala 0.02 K; 0 = sem dado
                if len(v) >= 3: res[band][s["modis_date"]] = float(v.mean())
    out[name] = res
    print(name, {b: len(v) for b, v in res.items()}, flush=True)
json.dump(out, open("modis_lst.json", "w"))
def season(d):  # verao que termina no ano Y (dez do ano anterior + jan-fev)
    y, doy = int(d[1:5]), int(d[5:]); return y + 1 if doy >= 335 else y
print(f"\n{'local':24s} {'banda':14s} 2001-08  2018-25  tendencia")
S = {}
for name, res in out.items():
    for band, dd in res.items():
        g = collections.defaultdict(list)
        for d, v in dd.items(): g[season(d)].append(v)
        ys = [y for y in range(2001, 2026) if len(g[y]) >= 6]
        x = np.array([np.mean(g[y]) for y in ys]); S[(name, band)] = dict(zip(ys, x))
        r = mk.original_test(x)
        print(f"{name:24s} {band:14s} {np.mean([v for y, v in zip(ys, x) if y <= 2008]):7.2f} {np.mean([v for y, v in zip(ys, x) if y >= 2018]):7.2f}  {r.trend} p={r.p:.3f} Sen={r.slope * 10:+.2f} C/dec (n={len(ys)})")
for band in ("LST_Day_1km", "LST_Night_1km"):
    a, b = S[("CDE centro", band)], S[("Mata do Iguacu", band)]
    ys = sorted(set(a) & set(b)); dif = np.array([a[y] - b[y] for y in ys]); r = mk.original_test(dif)
    print(f"Ilha de calor (CDE - mata) {band}: media {dif.mean():+.2f} C; 2001-08 {np.mean([d for y, d in zip(ys, dif) if y <= 2008]):+.2f} -> 2018-25 {np.mean([d for y, d in zip(ys, dif) if y >= 2018]):+.2f}; {r.trend} p={r.p:.3f}")
