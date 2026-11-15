# Baixa o ERA5 diario (Open-Meteo) de cidades dos Estados Unidos e de mais alguns lugares do mundo,
# respeitando o limite por hora do servico gratuito. Depois rode analysis/era5_estatico.py para gerar docs/data/era5.
# Uso: py -3.11 analysis/era5_baixar_eua.py   (codigo escrito com apoio de IA)
import json, os, time, urllib.request, urllib.error

AQUI = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(AQUI, "cache_era5"); os.makedirs(CACHE, exist_ok=True)
Y0, Y1 = 1981, 2025
LUGARES = [("miami", 25.76, -80.19), ("phoenix", 33.45, -112.07), ("oklahoma_city", 35.47, -97.52), ("houston", 29.76, -95.37),
           ("los_angeles", 34.05, -118.24), ("new_orleans", 29.95, -90.07), ("chicago", 41.88, -87.63), ("new_york", 40.71, -74.01),
           ("manila", 14.6, 120.98), ("lagos", 6.52, 3.38), ("madrid", 40.42, -3.7)]
for nome, lat, lon in LUGARES:
    arq = os.path.join(CACHE, nome + ".json")
    if os.path.exists(arq) and os.path.getsize(arq) > 100_000:
        print("ja tinha", nome, flush=True); continue
    url = f"https://archive-api.open-meteo.com/v1/archive?latitude={lat}&longitude={lon}&start_date={Y0}-01-01&end_date={Y1}-12-31&daily=temperature_2m_mean,temperature_2m_max,precipitation_sum&timezone=auto"
    for tentativa in range(8):
        try:
            d = json.load(urllib.request.urlopen(url, timeout=180))
            json.dump(d, open(arq, "w", encoding="utf-8")); print("ok", nome, flush=True); time.sleep(80); break
        except urllib.error.HTTPError as e:
            corpo = e.read().decode("utf-8", "ignore")[:120]
            print("  limite (", nome, e.code, corpo, ")", flush=True)
            if "Daily" in corpo: raise SystemExit("limite diario: tentar amanha")
            time.sleep(300)
        except Exception as e:
            print("  erro", e, flush=True); time.sleep(30)
print("fim", flush=True)
