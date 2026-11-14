# Baixa o ERA5 diario (Open-Meteo) dos lugares de demonstracao, respeitando o limite por hora do servico gratuito.
# Guarda no mesmo cache usado por capitais.py. Uso: py -3.11 analysis/era5_baixar_demo.py   (codigo escrito com apoio de IA)
import hashlib, json, os, time, urllib.request, urllib.error

AQUI = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(AQUI, "cache_capitais"); os.makedirs(CACHE, exist_ok=True)
Y0, Y1 = 1981, 2025
LUGARES = [("Tokyo", 35.68, 139.69), ("Ciudad del Este", -25.51, -54.61), ("Asuncion", -25.28, -57.63), ("Sao Paulo", -23.55, -46.63),
           ("Porto Alegre", -30.03, -51.23), ("Karachi", 24.86, 67.0), ("Kathmandu", 27.72, 85.32), ("Phoenix", 33.45, -112.07), ("Nairobi", -1.29, 36.82)]
for nome, lat, lon in LUGARES:
    url = f"https://archive-api.open-meteo.com/v1/archive?latitude={lat}&longitude={lon}&start_date={Y0}-01-01&end_date={Y1}-12-31&daily=temperature_2m_mean,temperature_2m_max,precipitation_sum&timezone=auto"
    arq = os.path.join(CACHE, hashlib.md5(url.encode()).hexdigest() + ".json")
    if os.path.exists(arq):
        print("ja tinha", nome, flush=True); continue
    for tentativa in range(40):
        try:
            d = json.load(urllib.request.urlopen(url, timeout=180))
            json.dump(d, open(arq, "w", encoding="utf-8")); print("ok", nome, flush=True); time.sleep(100); break
        except urllib.error.HTTPError as e:
            print("  limite do servico, aguardando 5 min (", nome, e.code, ")", flush=True); time.sleep(300)
        except Exception as e:
            print("  erro", e, flush=True); time.sleep(30)
