# Baixa indicadores de saude por pais (World Bank Open Data, que reune OMS, UNICEF, ONU) e grava um JSON por pais
# em docs/data/health/<ISO2>.json. Uso: py -3.11 analysis/saude_paises.py   (codigo escrito com apoio de IA)
import json, os, urllib.request, concurrent.futures as cf, collections

AQUI = os.path.dirname(os.path.abspath(__file__))
SAIDA = os.path.join(AQUI, "..", "docs", "data", "health")
os.makedirs(SAIDA, exist_ok=True)

# codigo: (grupo, casas decimais)
IND = {
    "SP.DYN.LE00.IN": ("life", 1), "SH.DYN.NMRT": ("life", 1), "SP.DYN.IMRT.IN": ("life", 1), "SH.DYN.MORT": ("life", 1),
    "SH.DYN.0509": ("life", 1), "SH.DYN.1014": ("life", 1), "SH.DYN.1519": ("life", 1), "SH.DYN.2024": ("life", 1),
    "SP.DYN.AMRT.MA": ("life", 0), "SP.DYN.AMRT.FE": ("life", 0), "SH.STA.MMRT": ("life", 0),
    "SH.DTH.COMM.ZS": ("causes", 1), "SH.DTH.NCOM.ZS": ("causes", 1), "SH.DTH.INJR.ZS": ("causes", 1), "SH.DYN.NCOM.ZS": ("causes", 1),
    "SH.STA.AIRP.P5": ("causes", 1), "SH.STA.WASH.P5": ("causes", 1), "SH.TBS.INCD": ("causes", 0), "SH.MLR.INCD.P3": ("causes", 1),
    "SH.IMM.IDPT": ("vaccines", 0), "SH.IMM.MEAS": ("vaccines", 0), "SH.IMM.HEPB": ("vaccines", 0),
    "SH.MED.BEDS.ZS": ("system", 2), "SH.MED.PHYS.ZS": ("system", 2), "SH.MED.NUMW.P3": ("system", 2),
    "SH.UHC.SRVS.CV.XD": ("system", 0), "SH.XPD.CHEX.PC.CD": ("system", 0),
    "SH.H2O.SMDW.ZS": ("wash", 1), "SH.H2O.BASW.ZS": ("wash", 1), "SH.STA.SMSS.ZS": ("wash", 1), "SH.STA.BASS.ZS": ("wash", 1),
    "SN.ITK.DEFC.ZS": ("food", 1), "SN.ITK.MSFI.ZS": ("food", 1),
}


def baixar(code):
    url = f"https://api.worldbank.org/v2/country/all/indicator/{code}?format=json&per_page=20000&date=1981:2025"
    for _ in range(3):
        try:
            d = json.load(urllib.request.urlopen(url, timeout=240))
            if isinstance(d, list) and len(d) > 1 and d[1]:
                return code, d[1]
            return code, []
        except Exception as e:
            erro = e
    print("ERRO", code, erro, flush=True)
    return code, None


paises = collections.defaultdict(lambda: {"name": "", "ind": {}})
meta = {}
with cf.ThreadPoolExecutor(6) as ex:
    for code, rows in ex.map(baixar, IND):
        if not rows:
            print("vazio", code, flush=True)
            continue
        grupo, casas = IND[code]
        meta[code] = {"group": grupo, "name": rows[0]["indicator"]["value"], "digits": casas}
        n = 0
        for r in rows:
            iso2 = r["country"]["id"]
            if r["value"] is None or len(iso2) != 2 or not r.get("countryiso3code"):
                continue
            p = paises[iso2]
            p["name"] = r["country"]["value"]
            p["ind"].setdefault(code, {})[r["date"]] = round(r["value"], casas + 1)
            n += 1
        print("ok", code, n, flush=True)

for iso2, p in paises.items():
    json.dump(p, open(os.path.join(SAIDA, f"{iso2}.json"), "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
json.dump(meta, open(os.path.join(SAIDA, "_indicators.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=0)
print("paises:", len(paises), "indicadores:", len(meta))
