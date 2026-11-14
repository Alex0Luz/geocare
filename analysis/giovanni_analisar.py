# Le os CSV oficiais do Giovanni (NASA), calcula series anuais e tendencias, e grava JSON para o app.
# Codigo escrito com apoio de IA.
import csv, glob, json, os, collections
import numpy as np, pymannkendall as mk
AQUI = os.path.dirname(os.path.abspath(__file__))
NOMES = {"ciudad_del_este": ("Ciudad del Este", -25.51, -54.61), "porto_alegre": ("Porto Alegre", -30.03, -51.23), "karachi": ("Karachi", 24.86, 67.0),
         "asuncion": ("Asunción", -25.28, -57.63), "sao_paulo": ("São Paulo", -23.55, -46.63), "kathmandu": ("Kathmandu", 27.72, 85.32), "phoenix": ("Phoenix", 33.45, -112.07), "nairobi": ("Nairobi", -1.29, 36.82),
         "new_delhi": ("New Delhi", 28.61, 77.21), "washington": ("Washington, D.C.", 38.90, -77.04), "jakarta": ("Jakarta", -6.20, 106.85), "islamabad": ("Islamabad", 33.69, 73.05),
         "abuja": ("Abuja", 9.06, 7.49), "brasilia": ("Brasília", -15.79, -47.88), "dhaka": ("Dhaka", 23.81, 90.41), "addis_ababa": ("Addis Ababa", 9.03, 38.74),
         "mexico_city": ("Mexico City", 19.43, -99.13), "tokyo": ("Tokyo", 35.68, 139.69)}
def ler(path):
    meta, rows, dados = {}, [], False
    for r in csv.reader(open(path, encoding="utf-8")):
        if not r: continue
        if r[0].startswith("Timestamp"): dados = True; continue
        if dados:
            try: v = float(r[1])
            except ValueError: v = float("nan")
            rows.append((r[0], v))
        else: meta[r[0]] = r[1] if len(r) > 1 else ""
    try: undef = float(meta.get("undef", "nan"))
    except ValueError: undef = float("nan")
    nan = float("nan")
    rows = [(t, nan if (v != v or v == undef or abs(v) >= 1e29 or v <= -9990) else v) for t, v in rows]
    return meta, rows
def anual(rows, fn, minimo):
    g = collections.defaultdict(list)
    for t, v in rows:
        if v == v: g[int(t[:4])].append(v)
    return {y: fn(np.array(v)) for y, v in sorted(g.items()) if len(v) >= minimo}
def tend(serie, nome, unidade="", fator=1.0):
    ys = sorted(serie); x = np.array([serie[y] for y in ys]) * fator
    if len(x) < 15: print(f"  {nome:34s} poucos anos ({len(x)})"); return None
    r = mk.hamed_rao_modification_test(x)
    sl = mk.sens_slope(x).slope * 10 * (len(ys) - 1) / (ys[-1] - ys[0])
    print(f"  {nome:34s} {ys[0]}-{ys[-1]} n={len(ys)}  primeiros 10={x[:10].mean():8.2f} ultimos 10={x[-10:].mean():8.2f}  {r.trend:11s} p={r.p:.4f}  Sen={sl:+.3f} {unidade}/dec")
    return {"p": float(r.p), "slopeDecade": float(sl), "trend": r.trend}
saida = {}
for slug, (nome, lat, lon) in NOMES.items():
    print("\n==", nome)
    S = {}
    m, tm = ler(f"{AQUI}/giovanni/{slug}__merra2_tmedia.csv"); _, tn = ler(f"{AQUI}/giovanni/{slug}__merra2_tmin.csv"); _, tx = ler(f"{AQUI}/giovanni/{slug}__merra2_tmax.csv")
    print("  celula MERRA-2:", m.get("lat"), m.get("lon"), "unidade", m.get("unit"))
    K = 273.15
    S["merra2_temp"] = anual(tm, lambda a: a.mean() - K, 360)
    S["merra2_tmin"] = anual(tn, lambda a: a.mean() - K, 360)
    S["merra2_tmax"] = anual(tx, lambda a: a.mean() - K, 360)
    S["merra2_noites24"] = anual(tn, lambda a: float((a - K >= 24).sum()), 360)
    base = np.array([v for t, v in tx if v == v and int(t[:4]) <= 2010]); thr = np.percentile(base, 95)
    S["merra2_diasquentes"] = anual(tx, lambda a: float((a > thr).sum()), 360)
    for chave, arq in (("airs_dia", "airs_tar_dia"), ("airs_noite", "airs_tar_noite")):
        ma, ra = ler(f"{AQUI}/giovanni/{slug}__{arq}.csv")
        S[chave] = anual(ra, lambda a: a.mean() - K, 11)
    mg, rg = ler(f"{AQUI}/giovanni/{slug}__gpm_chuva_mensal.csv")
    print("  AIRS:", ma.get("param_name"), "| celula", ma.get("lat"), ma.get("lon"), "| GPM:", mg.get("param_name"), "unidade", mg.get("unit"), "celula", mg.get("lat"), mg.get("lon"))
    g = collections.defaultdict(list)
    for t, v in rg:
        if v == v:
            y, mo = int(t[:4]), int(t[5:7]); dias = [31, 29 if y % 4 == 0 else 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][mo - 1]
            g[y].append(v * 24 * dias if "hr" in (mg.get("unit") or "") else v * dias if "day" in (mg.get("unit") or "") else v)
    S["gpm_chuva"] = {y: float(sum(v)) for y, v in sorted(g.items()) if len(v) == 12}
    # sinais extras de satelite: NO2 (OMI/Aura), agua subterranea (GRACE), umidade do solo (GLDAS)
    for chave, minimo, fator in (("omi_no2", 120, 1e-15), ("grace_gws", 30, 1.0), ("gldas_soil", 12, 1.0)):
        arq = f"{AQUI}/giovanni/{slug}__{chave}.csv"
        if os.path.exists(arq) and os.path.getsize(arq) > 2000:
            mx, rx = ler(arq)
            S[chave] = {y: v for y, v in anual(rx, lambda a, f=fator: a.mean() * f, minimo).items() if y <= 2025}
            print("  extra", chave, "|", mx.get("param_name"), "| unidade", mx.get("unit"), "| anos", len(S[chave]))
    T = {}
    T["merra2_temp"] = tend(S["merra2_temp"], "MERRA-2 T media (Giovanni)", "C")
    T["merra2_tmin"] = tend(S["merra2_tmin"], "MERRA-2 T minima media", "C")
    T["merra2_tmax"] = tend(S["merra2_tmax"], "MERRA-2 T maxima media", "C")
    T["merra2_noites24"] = tend(S["merra2_noites24"], "MERRA-2 noites Tmin>=24C", "dias")
    T["merra2_diasquentes"] = tend(S["merra2_diasquentes"], f"MERRA-2 dias Tmax>p95 ({thr - K:.1f}C)", "dias")
    T["airs_dia"] = tend(S["airs_dia"], "AIRS satelite T ar (passagem dia)", "C")
    T["airs_noite"] = tend(S["airs_noite"], "AIRS satelite T ar (passagem noite)", "C")
    T["gpm_chuva"] = tend(S["gpm_chuva"], "GPM IMERG chuva anual", "mm")
    # MERRA-2 no mesmo periodo do AIRS, para comparar igual com igual
    sub = {y: v for y, v in S["merra2_temp"].items() if y >= min(S["airs_dia"])}
    T["merra2_temp_2003"] = tend(sub, "MERRA-2 T media, periodo do AIRS", "C")
    saida[slug] = {"nome": nome, "lat": lat, "lon": lon, "series": {k: {str(y): round(v, 3) for y, v in s.items()} for k, s in S.items()}, "tendencias": T}
os.makedirs(f"{AQUI}/../docs/data", exist_ok=True)
json.dump(saida, open(f"{AQUI}/../docs/data/giovanni.json", "w", encoding="utf-8"), ensure_ascii=False)
print("\ngravado docs/data/giovanni.json")
