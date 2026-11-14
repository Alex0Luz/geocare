# Extremos de calor em Ciudad del Este a partir do NASA POWER diario (codigo escrito com apoio de IA)
import json, sys
import numpy as np, pymannkendall as mk
d = json.load(open(sys.argv[1]))['properties']['parameter']
ks = sorted(d['T2M_MAX'])
def arr(p):
    v = np.array([d[p][k] for k in ks], float); v[v < -900] = np.nan; return v
tx, tn, tm, rh, pr = arr('T2M_MAX'), arr('T2M_MIN'), arr('T2M'), arr('RH2M'), arr('PRECTOTCORR')
yr = np.array([int(k[:4]) for k in ks]); mo = np.array([int(k[4:6]) for k in ks])
print('ultimo dia com dado:', [k for k, v in zip(ks, tx) if not np.isnan(v)][-1])
# Heat index NOAA (Rothfusz). A umidade na hora da Tmax vem do ponto de orvalho (T2MDEW),
# porque usar a UR media do dia com a Tmax superestima o indice.
d2 = json.load(open(sys.argv[2]))['properties']['parameter']
td = np.array([d2['T2MDEW'][k] for k in ks], float); td[td < -900] = np.nan
es = lambda T: 6.112 * np.exp(17.62 * T / (243.12 + T))
rh_tx = np.clip(100 * es(td) / es(tx), 0, 100)
def hi(Tc, R):
    T = Tc * 9 / 5 + 32
    H = (-42.379 + 2.04901523*T + 10.14333127*R - .22475541*T*R - .00683783*T*T
         - .05481717*R*R + .00122874*T*T*R + .00085282*T*R*R - .00000199*T*T*R*R)
    simple = 0.5 * (T + 61 + (T - 68) * 1.2 + R * 0.094)
    H = np.where((simple + T) / 2 < 80, simple, H)
    return (H - 32) * 5 / 9
h = hi(tx, rh_tx)
base = (yr >= 1981) & (yr <= 2010)
p90x, p90n = np.nanpercentile(tx[base], 90), np.nanpercentile(tn[base], 90)
print(f'p90 Tmax 1981-2010 = {p90x:.1f} C ; p90 Tmin = {p90n:.1f} C')
# onda de calor: >=3 dias seguidos com Tmax>p90 e Tmin>p90 (definicao estilo SMN Argentina)
hot = (tx > p90x) & (tn > p90n)
wave = np.zeros(len(hot), bool); run = 0
for i, f in enumerate(hot):
    run = run + 1 if f else 0
    if run >= 3: wave[i-run+1:i+1] = True
years = np.arange(1981, 2026)
def per_year(mask): return np.array([np.nansum(mask[yr == y]) for y in years])
series = {
 'dias Tmax>=35C': per_year(tx >= 35),
 'dias Tmax>=38C': per_year(tx >= 38),
 'noites Tmin>=24C': per_year(tn >= 24),
 'dias em onda de calor': per_year(wave),
 'dias indice calor>=32C (cautela extrema)': per_year(h >= 32),
 'dias indice calor>=41C (perigo NOAA)': per_year(h >= 41),
 'dias chuva>=50mm': per_year(pr >= 50),
 'dias secos (<1mm)': per_year(pr < 1),
}
for n, x in series.items():
    r = mk.hamed_rao_modification_test(x)
    print(f"{n:38s} 81-90={x[:10].mean():6.1f} 16-25={x[-10:].mean():6.1f} {r.trend:11s} p={r.p:.4f} Sen={r.slope*10:+.2f}/dec  max={x.max()} em {years[x.argmax()]}")
# ultimos 30 dias com dado
last = [(k, a, b, c) for k, a, b, c in zip(ks, tx, tn, h) if not np.isnan(a)][-14:]
print('ultimos dias:', ' | '.join(f"{k[4:6]}/{k[6:]} Tx={a:.1f} Tn={b:.1f} HI={c:.0f}" for k, a, b, c in last))
print('2026 ate agora: dias>=35C =', int(np.nansum(tx[yr == 2026] >= 35)), ' dias em onda =', int(wave[yr == 2026].sum()))
