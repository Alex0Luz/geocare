# Terceira opiniao: estacoes meteorologicas reais (NOAA GHCN-Daily) perto de Ciudad del Este. Codigo escrito com apoio de IA.
import csv, sys, collections
import numpy as np, pymannkendall as mk
for f in sys.argv[1:]:
    rows = list(csv.DictReader(open(f, encoding="utf-8")))
    print("\n==", f, rows[0].get("NAME"), "| dias:", len(rows), "|", rows[0]["DATE"], "->", rows[-1]["DATE"])
    Y = collections.defaultdict(lambda: {"tx": [], "tn": [], "pr": []})
    for r in rows:
        y = int(r["DATE"][:4])
        for k, c in (("tx", "TMAX"), ("tn", "TMIN"), ("pr", "PRCP")):
            v = (r.get(c) or "").strip()
            if v: Y[y][k].append(float(v) / 10)
    years = [y for y in range(1981, 2026)]
    def serie(fn, key, minimo=300):
        return np.array([fn(np.array(Y[y][key])) if len(Y[y][key]) >= minimo else np.nan for y in years])
    cob = {k: np.array([len(Y[y][k]) for y in years]) for k in ("tx", "tn", "pr")}
    print("  cobertura media (dias/ano): Tmax %.0f  Tmin %.0f  chuva %.0f ; anos com >=300 dias de Tmin: %d de 45" % (cob["tx"].mean(), cob["tn"].mean(), cob["pr"].mean(), (cob["tn"] >= 300).sum()))
    S = {"T media (C)": (serie(np.mean, "tx") + serie(np.mean, "tn")) / 2,
         "Tmin media (C)": serie(np.mean, "tn"), "Tmax media (C)": serie(np.mean, "tx"),
         "noites Tmin>=24C (% dos dias)": serie(lambda a: (a >= 24).mean() * 100, "tn"),
         "noites Tmin>=22C (% dos dias)": serie(lambda a: (a >= 22).mean() * 100, "tn"),
         "dias Tmax>=35C (% dos dias)": serie(lambda a: (a >= 35).mean() * 100, "tx"),
         "chuva anual (mm)": serie(np.sum, "pr", 330), "dias secos <1mm (%)": serie(lambda a: (a < 1).mean() * 100, "pr", 330)}
    for n, x in S.items():
        ok = ~np.isnan(x)
        if ok.sum() < 20: print(f"  {n:32s} dados insuficientes ({ok.sum()} anos)"); continue
        r = mk.hamed_rao_modification_test(x[ok])
        a, b = np.nanmean(x[:10]), np.nanmean(x[-10:])
        print(f"  {n:32s} 81-90={a:7.2f} 16-25={b:7.2f} {r.trend:11s} p={r.p:.4f} Sen={r.slope * 10:+.2f}/dec  (n={ok.sum()} anos)")
