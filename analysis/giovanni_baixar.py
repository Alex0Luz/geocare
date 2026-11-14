# Baixa series temporais da API oficial da NASA (Giovanni Time Series Service), que esta na aba Resources do desafio.
# Uso:  py -3.11 analysis/giovanni_baixar.py
# Antes: salve o seu token do Earthdata Login (uma linha) no arquivo analysis/.earthdata_token  -- nao compartilhe esse arquivo.
# Codigo escrito com apoio de IA.
import os, sys, urllib.request, urllib.parse
AQUI = os.path.dirname(os.path.abspath(__file__))
TOK = os.path.join(AQUI, ".earthdata_token")
if not os.path.exists(TOK):
    sys.exit("Falta o arquivo analysis/.earthdata_token com o token do Earthdata Login.")
token = open(TOK, encoding="utf-8").read().strip()
LOCAIS = {"ciudad_del_este": (-25.51, -54.61), "porto_alegre": (-30.03, -51.23), "karachi": (24.86, 67.0),
          "asuncion": (-25.28, -57.63), "sao_paulo": (-23.55, -46.63), "kathmandu": (27.72, 85.32), "phoenix": (33.45, -112.07), "nairobi": (-1.29, 36.82),
          "new_delhi": (28.61, 77.21), "washington": (38.90, -77.04), "jakarta": (-6.20, 106.85), "islamabad": (33.69, 73.05), "abuja": (9.06, 7.49),
          "brasilia": (-15.79, -47.88), "dhaka": (23.81, 90.41), "addis_ababa": (9.03, 38.74), "mexico_city": (19.43, -99.13), "tokyo": (35.68, 139.69)}
VARIAVEIS = {
    "merra2_tmedia": ("M2SDNXSLV_5_12_4_T2MMEAN", "1981-01-01T00:00:00", "2025-12-31T23:59:59"),
    "merra2_tmin": ("M2SDNXSLV_5_12_4_T2MMIN", "1981-01-01T00:00:00", "2025-12-31T23:59:59"),
    "merra2_tmax": ("M2SDNXSLV_5_12_4_T2MMAX", "1981-01-01T00:00:00", "2025-12-31T23:59:59"),
    "airs_tar_dia": ("AIRS3STM_7_0_SurfAirTemp_A", "2002-09-01T00:00:00", "2025-12-31T23:59:59"),
    "airs_tar_noite": ("AIRS3STM_7_0_SurfAirTemp_D", "2002-09-01T00:00:00", "2025-12-31T23:59:59"),
    "gpm_chuva_mensal": ("GPM_3IMERGM_07_precipitation", "1998-01-01T00:00:00", "2025-12-31T23:59:59"),
}
SAIDA = os.path.join(AQUI, "giovanni"); os.makedirs(SAIDA, exist_ok=True)
for local, (lat, lon) in LOCAIS.items():
    for nome, (var, ini, fim) in VARIAVEIS.items():
        q = urllib.parse.urlencode({"data": var, "location": f"[{lat},{lon}]", "time": f"{ini}/{fim}"})
        req = urllib.request.Request("https://api.giovanni.earthdata.nasa.gov/timeseries?" + q, headers={"authorization": "Bearer " + token})
        destino = os.path.join(SAIDA, f"{local}__{nome}.csv")
        if os.path.exists(destino) and os.path.getsize(destino) > 2000:
            continue
        try:
            dados = urllib.request.urlopen(req, timeout=300).read()
            open(destino, "wb").write(dados)
            print("ok  ", local, nome, len(dados), "bytes")
        except Exception as e:
            print("ERRO", local, nome, e)
