# "Gemeos do futuro": que cidades ja vivem hoje o clima para onde Ciudad del Este caminha?
# NASA POWER mensal 1981-2025. Codigo escrito com apoio de IA.
import json, os, urllib.request, concurrent.futures as cf
import numpy as np, pymannkendall as mk

C = {
 "Ciudad del Este PY": (-25.51, -54.61), "Asuncion PY": (-25.28, -57.63), "Encarnacion PY": (-27.33, -55.87),
 "Concepcion PY": (-23.41, -57.43), "Mariscal Estigarribia PY": (-22.03, -60.62), "Pedro Juan Caballero PY": (-22.55, -55.73),
 "Foz do Iguacu BR": (-25.55, -54.59), "Cascavel BR": (-24.96, -53.46), "Londrina BR": (-23.31, -51.16),
 "Maringa BR": (-23.42, -51.94), "Curitiba BR": (-25.43, -49.27), "Porto Alegre BR": (-30.03, -51.23),
 "Florianopolis BR": (-27.6, -48.55), "Sao Paulo BR": (-23.55, -46.63), "Ribeirao Preto BR": (-21.18, -47.81),
 "Campo Grande BR": (-20.45, -54.62), "Dourados BR": (-22.22, -54.81), "Corumba BR": (-19.01, -57.65),
 "Cuiaba BR": (-15.6, -56.1), "Goiania BR": (-16.68, -49.25), "Brasilia BR": (-15.79, -47.88),
 "Belo Horizonte BR": (-19.92, -43.94), "Rio de Janeiro BR": (-22.91, -43.17), "Vitoria BR": (-20.32, -40.34),
 "Salvador BR": (-12.97, -38.5), "Recife BR": (-8.05, -34.9), "Fortaleza BR": (-3.73, -38.52),
 "Teresina BR": (-5.09, -42.8), "Palmas BR": (-10.18, -48.33), "Belem BR": (-1.45, -48.5),
 "Manaus BR": (-3.12, -60.02), "Porto Velho BR": (-8.76, -63.9), "Rio Branco BR": (-9.97, -67.81),
 "Sao Jose do Rio Preto BR": (-20.82, -49.38), "Uberlandia BR": (-18.92, -48.28), "Presidente Prudente BR": (-22.12, -51.39),
 "Posadas AR": (-27.37, -55.9), "Puerto Iguazu AR": (-25.6, -54.57), "Corrientes AR": (-27.47, -58.83),
 "Resistencia AR": (-27.45, -58.99), "Formosa AR": (-26.18, -58.17), "Santiago del Estero AR": (-27.78, -64.26),
 "Tucuman AR": (-26.81, -65.22), "Salta AR": (-24.78, -65.41), "Cordoba AR": (-31.42, -64.18),
 "Rosario AR": (-32.95, -60.65), "Buenos Aires AR": (-34.6, -58.38), "Montevideo UY": (-34.9, -56.16),
 "Santa Cruz BO": (-17.78, -63.18), "Trinidad BO": (-14.83, -64.9), "Cochabamba BO": (-17.39, -66.16),
 "Lima PE": (-12.05, -77.04), "Iquitos PE": (-3.75, -73.25), "Piura PE": (-5.19, -80.63),
 "Guayaquil EC": (-2.17, -79.92), "Bogota CO": (4.71, -74.07), "Cali CO": (3.45, -76.53),
 "Barranquilla CO": (10.97, -74.8), "Caracas VE": (10.48, -66.9), "Maracaibo VE": (10.65, -71.64),
 "Panama PA": (8.98, -79.52), "San Salvador SV": (13.69, -89.22), "Managua NI": (12.11, -86.24),
 "Chinandega NI": (12.63, -87.13), "Tegucigalpa HN": (14.07, -87.19), "Guatemala GT": (14.63, -90.51),
 "Merida MX": (20.97, -89.62), "Monterrey MX": (25.69, -100.32), "Hermosillo MX": (29.07, -110.96),
 "Mexico City MX": (19.43, -99.13), "Havana CU": (23.11, -82.37), "Santo Domingo DO": (18.49, -69.93),
 "Miami US": (25.76, -80.19), "Houston US": (29.76, -95.37), "New Orleans US": (29.95, -90.07),
 "Phoenix US": (33.45, -112.07), "Atlanta US": (33.75, -84.39), "Dallas US": (32.78, -96.8), "New York US": (40.71, -74.0),
 "Madrid ES": (40.42, -3.7), "Seville ES": (37.39, -5.98), "Paris FR": (48.86, 2.35), "Rome IT": (41.9, 12.5),
 "Athens GR": (37.98, 23.73), "Cairo EG": (30.04, 31.24), "Khartoum SD": (15.5, 32.56), "Niamey NE": (13.51, 2.11),
 "Ouagadougou BF": (12.37, -1.52), "Bamako ML": (12.64, -8.0), "Ndjamena TD": (12.13, 15.06), "Kano NG": (12.0, 8.52),
 "Lagos NG": (6.52, 3.38), "Accra GH": (5.6, -0.19), "Kinshasa CD": (-4.44, 15.27), "Nairobi KE": (-1.29, 36.82),
 "Addis Ababa ET": (9.03, 38.74), "Dar es Salaam TZ": (-6.79, 39.21), "Lusaka ZM": (-15.39, 28.32),
 "Harare ZW": (-17.83, 31.05), "Maputo MZ": (-25.97, 32.57), "Johannesburg ZA": (-26.2, 28.05),
 "Durban ZA": (-29.86, 31.02), "Antananarivo MG": (-18.88, 47.51), "Baghdad IQ": (33.31, 44.36),
 "Kuwait City KW": (29.38, 47.98), "Riyadh SA": (24.71, 46.68), "Jacobabad PK": (28.28, 68.44),
 "Karachi PK": (24.86, 67.0), "Lahore PK": (31.55, 74.34), "Delhi IN": (28.61, 77.21), "Ahmedabad IN": (23.02, 72.57),
 "Nagpur IN": (21.15, 79.09), "Hyderabad IN": (17.39, 78.49), "Chennai IN": (13.08, 80.27), "Kolkata IN": (22.57, 88.36),
 "Mumbai IN": (19.08, 72.88), "Dhaka BD": (23.81, 90.41), "Kathmandu NP": (27.72, 85.32), "Yangon MM": (16.84, 96.17),
 "Bangkok TH": (13.76, 100.5), "Hanoi VN": (21.03, 105.85), "Ho Chi Minh VN": (10.82, 106.63),
 "Phnom Penh KH": (11.56, 104.92), "Singapore SG": (1.35, 103.82), "Jakarta ID": (-6.2, 106.85),
 "Yogyakarta ID": (-7.8, 110.36), "Manila PH": (14.6, 120.98), "Hong Kong HK": (22.32, 114.17),
 "Guangzhou CN": (23.13, 113.26), "Wuhan CN": (30.59, 114.31), "Shanghai CN": (31.23, 121.47),
 "Taipei TW": (25.03, 121.57), "Tokyo JP": (35.68, 139.69), "Brisbane AU": (-27.47, 153.03),
 "Darwin AU": (-12.46, 130.84), "Sydney AU": (-33.87, 151.21), "Townsville AU": (-19.26, 146.82),
}
CACHE = "cache_cidades.json"
cache = json.load(open(CACHE)) if os.path.exists(CACHE) else {}


def get(item):
    n, (la, lo) = item
    if n in cache:
        return n, cache[n]
    u = ("https://power.larc.nasa.gov/api/temporal/monthly/point?parameters=T2M,T2M_MAX,T2M_MIN,PRECTOTCORR,RH2M"
         f"&community=AG&longitude={lo}&latitude={la}&start=1981&end=2025&format=JSON")
    for _ in range(3):
        try:
            return n, json.load(urllib.request.urlopen(u, timeout=120))["properties"]["parameter"]
        except Exception:
            pass
    return n, None


with cf.ThreadPoolExecutor(5) as ex:
    for n, d in ex.map(get, C.items()):
        if d:
            cache[n] = d
        else:
            print("FALHOU", n)
json.dump(cache, open(CACHE, "w"))

V = ["T2M", "T2M_MAX", "T2M_MIN", "PRECTOTCORR", "RH2M"]


def mat(n, p):
    s = cache[n][p]
    ks = sorted(k for k in s if not k.endswith("13"))
    m = np.array([s[k] for k in ks], float).reshape(-1, 12)
    if C[n][0] > 0:  # hemisferio norte: desloca 6 meses para alinhar as estacoes
        m = np.roll(m, 6, axis=1)
    return m


names = list(cache)
now = {n: {p: mat(n, p)[-10:].mean(0) for p in V} for n in names}
past = {n: {p: mat(n, p)[:10].mean(0) for p in V} for n in names}
sd = {p: np.std([now[n][p] for n in names]) for p in V}  # padroniza pela dispersao entre cidades


def vec(d):
    return np.concatenate([d[p] / sd[p] for p in V])


def dist(a, b):
    return float(np.sqrt(np.mean((vec(a) - vec(b)) ** 2)))


me = "Ciudad del Este PY"
# CDE projetada: inclinacao de Sen de cada mes do ano x 25 anos (2021 -> 2046).
# E uma extrapolacao da tendencia observada, nao uma projecao de modelo climatico.
fut = {}
for p in V:
    m = mat(me, p)
    sl = np.array([mk.sens_slope(m[:, j]).slope for j in range(12)])
    fut[p] = now[me][p] + sl * 25
    if p in ("PRECTOTCORR", "RH2M"):
        fut[p] = np.clip(fut[p], 0, None)


def desc(d):
    return (f"T={d['T2M'].mean():.1f} Tmax_mes_quente={d['T2M_MAX'].max():.1f} Tmin_mes_frio={d['T2M_MIN'].min():.1f} "
            f"chuva={d['PRECTOTCORR'].mean() * 365:.0f}mm UR={d['RH2M'].mean():.0f}%")


print("CDE 1981-90 :", desc(past[me]))
print("CDE 2016-25 :", desc(now[me]))
print("CDE ~2046   :", desc(fut))
print("deslocamento de CDE em 35 anos (dist):", round(dist(past[me], now[me]), 3))


def rank(target, pool, label, k=8):
    r = sorted((dist(target, pool[n]), n) for n in names if n != me)[:k]
    print("\n" + label)
    for dd, n in r:
        print(f"  {dd:.3f}  {n:28s} {desc(now[n])}")
    return r


r1 = rank(now[me], now, "A) Quem tem HOJE o clima que CDE tem hoje:")
r2 = rank(fut, now, "B) GEMEOS DO FUTURO: quem ja vive HOJE o clima de CDE ~2046 (se a tendencia continuar):")
r3 = rank(past[me], now, "C) Quem tem HOJE o clima que CDE tinha nos anos 1980:")
r4 = rank(now[me], past, "D) Quem tinha nos anos 1980 o clima que CDE tem hoje (linha mostra o clima ATUAL dessa cidade):")
json.dump({"cde": {"passado": {p: past[me][p].tolist() for p in V}, "hoje": {p: now[me][p].tolist() for p in V},
                   "futuro": {p: fut[p].tolist() for p in V}},
           "gemeos_futuro": r2, "gemeos_hoje": r1, "como_cde_1980": r3, "eram_como_cde_hoje": r4},
          open("gemeos.json", "w"), indent=1)
