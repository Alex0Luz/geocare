# Pressoes humanas sobre o ambiente: rios que mais despejam plastico no mar e, por pais, uso de agrotoxicos,
# agrotoxicos proibidos, qualidade da agua (ODS 6.3.2) e esgoto tratado (ODS 6.3.1). Gera docs/data/pressures.json.
# Fontes: Meijer et al. 2021 (figshare), FAO via Our World in Data, ONU (SDG API), PAN International.
# So biblioteca padrao. Uso: py -3.11 -I analysis/pressoes.py   (codigo escrito com apoio de IA)
import collections, csv, hashlib, json, math, os, re, struct, sys, urllib.request, zipfile
import xml.etree.ElementTree as ET

sys.stdout.reconfigure(encoding="utf-8", errors="replace")   # nomes de cidades com acento no console do Windows

AQUI = os.path.dirname(os.path.abspath(__file__))
PASTA = os.path.join(AQUI, "cache_pressoes"); os.makedirs(PASTA, exist_ok=True)
SAIDA = os.path.join(AQUI, "..", "docs", "data", "pressures.json")
EXCLUIR = {"CN", "HK", "MO", "TW", "RU", "VN", "CU", "KP", "LA"}   # regra da equipe: fora do arquivo e das notas
N_RIOS = 1500        # quantas fozes guardar (as maiores)
GUARDA_KM = 30       # foz a menos disso de uma cidade de pais excluido tambem sai (fronteira incerta)

U_RIOS = "https://ndownloader.figshare.com/files/27807774"
MD5_RIOS = "0cb076477d711569f7555a8fb4f6a5c4"
U_PEST = "https://ourworldindata.org/grapher/pesticide-use-per-hectare-of-cropland.csv?v=1&csvType=full&useColumnShortNames=true"
U_SDG = "https://unstats.un.org/sdgs/UNSDGAPIV5/v1/sdg/Series/Data?seriesCode=%s&pageSize=10000"
U_PAN = "https://pan-international.org/wp-content/uploads/PAN-Consolidated-List-of-Bans_2024_FINAL.xlsx"
U_PAISES = "https://download.geonames.org/export/dump/countryInfo.txt"
U_CIDADES = "https://download.geonames.org/export/dump/cities15000.zip"


def baixar(url, nome, minimo=1000):
    arq = os.path.join(PASTA, nome)
    if not os.path.exists(arq) or os.path.getsize(arq) < minimo:
        print("baixando", nome, "...", flush=True)
        os.makedirs(os.path.dirname(arq), exist_ok=True)
        for agente in ("curl/8.4.0", "Mozilla/5.0"):  # o figshare recusa um, outros sites recusam o outro
            try:
                req = urllib.request.Request(url, headers={"User-Agent": agente, "Accept": "*/*"})
                dados = urllib.request.urlopen(req, timeout=180).read()
                if len(dados) >= minimo:
                    break
            except OSError as e:
                dados = None; print("  falhou com", agente, e)
        if not dados or len(dados) < minimo:
            raise SystemExit(f"nao consegui baixar {url}")
        open(arq, "wb").write(dados)
    return arq


# ---------- codigos de pais (GeoNames countryInfo: ISO2, ISO3, numerico, nome) ----------
iso3, isonum, nome_pais = {}, {}, {}
for ln in open(baixar(U_PAISES, "countryInfo.txt"), encoding="utf-8"):
    if ln.startswith("#") or not ln.strip():
        continue
    c = ln.split("\t")
    iso3[c[1]] = c[0]; isonum[int(c[2])] = c[0]; nome_pais[c[4].upper()] = c[0]
iso3["OWID_KOS"] = "XK"

# ---------- 1. rios: Meijer et al. 2021, pontos de foz com emissao em toneladas/ano ----------
zrios = baixar(U_RIOS, "Meijer2021_midpoint_emissions.zip", 500_000)
if hashlib.md5(open(zrios, "rb").read()).hexdigest() != MD5_RIOS:
    raise SystemExit("zip dos rios com md5 diferente do figshare")
z = zipfile.ZipFile(zrios)
shp = z.read("Meijer2021_midpoint_emissions.shp"); dbf = z.read("Meijer2021_midpoint_emissions.dbf")
if struct.unpack("<i", shp[32:36])[0] != 1:
    raise SystemExit("shapefile nao e de pontos")
xy = []; p = 100                                    # cada registro: cabecalho 8 bytes + tipo + x + y
while p < len(shp):
    tam = struct.unpack(">i", shp[p + 4:p + 8])[0]
    xy.append(struct.unpack("<2d", shp[p + 12:p + 28])); p += 8 + tam * 2
nreg, hdr, rec = struct.unpack("<IHH", dbf[4:12])   # dbf: um unico campo numerico (dots_exten = t/ano)
campo = dbf[32:43].split(b"\0")[0].decode()
emis = [float(dbf[hdr + i * rec + 1: hdr + (i + 1) * rec]) for i in range(nreg)]
if len(xy) != len(emis):
    raise SystemExit("shp e dbf com tamanhos diferentes")
print(f"rios: {len(xy)} fozes, campo '{campo}', total {sum(emis):,.0f} t/ano")

# cidades GeoNames (>15 mil hab.) em grade de 1 grau, para achar a cidade mais proxima de cada foz
zc = os.path.join(AQUI, "geonames", "cities15000.zip")
if not os.path.exists(zc):
    zc = baixar(U_CIDADES, "cities15000.zip", 1_000_000)
grade = collections.defaultdict(list)
for ln in zipfile.ZipFile(zc).read("cities15000.txt").decode("utf-8").split("\n"):
    c = ln.split("\t")
    if len(c) > 8:
        la, lo = float(c[4]), float(c[5])
        grade[(math.floor(la), math.floor(lo))].append((la, lo, c[8], c[1]))


def km(la1, lo1, la2, lo2):
    a = math.sin(math.radians(la2 - la1) / 2) ** 2 + math.cos(math.radians(la1)) * math.cos(math.radians(la2)) * math.sin(math.radians(lo2 - lo1) / 2) ** 2
    return 12742 * math.asin(math.sqrt(a))


def perto(la, lo):
    """cidade mais proxima (km, pais, nome) e distancia ate a cidade mais proxima de pais excluido"""
    ci, cj = math.floor(la), math.floor(lo); melhor = None; exc = 1e9; r = 0
    while True:
        for i in range(ci - r, ci + r + 1):
            for j in range(cj - r, cj + r + 1):
                if max(abs(i - ci), abs(j - cj)) != r:
                    continue
                for (a, b, cc, nm) in grade.get((i, (j + 180) % 360 - 180), ()):
                    d = km(la, lo, a, b)
                    if melhor is None or d < melhor[0]:
                        melhor = (d, cc, nm)
                    if cc in EXCLUIR and d < exc:
                        exc = d
        # cidades do anel seguinte ficam a pelo menos r graus; para quando isso ja passa do melhor achado
        if r >= 1 and melhor and r * 111.19 * math.cos(math.radians(min(89, abs(la) + r + 1))) > melhor[0]:
            return melhor, exc
        r += 1
        if r > 60:
            return melhor, exc


ordem = sorted(range(len(xy)), key=lambda i: -emis[i])
rios, fora_pais, fora_guarda, t_fora = [], 0, 0, 0.0
for i in ordem:
    lo, la = xy[i]
    (d, cc, nm), exc = perto(la, lo)
    if cc in EXCLUIR:
        fora_pais += 1; t_fora += emis[i]; continue
    if exc < GUARDA_KM:
        fora_guarda += 1; t_fora += emis[i]; continue
    if len(rios) < N_RIOS:                          # o arquivo nao traz nome de rio: campo de nome fica vazio
        rios.append([round(la, 4), round(lo, 4), round(emis[i], 1), "", cc, nm, round(d)])
t_guardado = sum(r[2] for r in rios)
print(f"  fora por pais excluido: {fora_pais}; fora pela guarda de {GUARDA_KM} km: {fora_guarda}; emissao retirada {t_fora:,.0f} t/ano")
print(f"  guardadas {len(rios)} fozes = {t_guardado:,.0f} t/ano; menor guardada {rios[-1][2]} t/ano")

# ---------- 2. agrotoxicos por hectare de lavoura (FAO via OWID), ano mais recente de cada pais ----------
paises = collections.defaultdict(lambda: {"pest": None, "pestBanned": None, "waterGood": None, "wastewater": None})
ult = {}
with open(baixar(U_PEST, "owid_pesticide.csv"), encoding="utf-8") as f:
    rd = csv.DictReader(f); col = [k for k in rd.fieldnames if k.startswith("pesticides")][0]
    for r in rd:
        if r[col] == "" or r["code"] not in iso3:   # sem codigo = regioes e paises extintos
            continue
        a = int(r["year"])
        if r["code"] not in ult or a > ult[r["code"]][1]:
            ult[r["code"]] = (float(r[col]), a)
novo = max(a for v, a in ult.values())
ult = {c3: va for c3, va in ult.items() if va[1] >= novo - 5}   # serie parada ha mais de 5 anos = pais extinto
todos = sorted(v for v, a in ult.values())          # distribuicao da fonte inteira (so para o relatorio)
for c3, (v, a) in ult.items():
    if iso3[c3] not in EXCLUIR:
        paises[iso3[c3]]["pest"] = [round(v, 2), a]


def pct(vals, q):                                   # percentil com interpolacao linear
    k = (len(vals) - 1) * q; f = math.floor(k); c = min(f + 1, len(vals) - 1)
    return round(vals[f] + (vals[c] - vals[f]) * (k - f), 2)


noarq = sorted(v["pest"][0] for v in paises.values() if v["pest"])
est = {"n": len(noarq), "p50": pct(noarq, .5), "p75": pct(noarq, .75), "p90": pct(noarq, .9)}
print("agrotoxicos kg/ha:", est, "| fonte inteira:", len(todos), pct(todos, .5), pct(todos, .75), pct(todos, .9))

# ---------- 3. ODS 6.3.2 (agua boa) e 6.3.1 (esgoto domestico tratado com seguranca), API da ONU ----------
anos_sdg = {}
for chave, serie in (("waterGood", "EN_H2O_WBAMBQ"), ("wastewater", "EN_WWT_WWDS")):
    dados = json.load(open(baixar(U_SDG % serie, f"sdg_{serie}.json"), encoding="utf-8"))["data"]
    ult = {}
    for r in dados:
        cc = isonum.get(int(r["geoAreaCode"]))      # codigos M49 de regioes nao existem na tabela de paises
        if not cc or cc in EXCLUIR:
            continue
        a = int(r["timePeriodStart"])
        if cc not in ult or a > ult[cc][1]:
            ult[cc] = (float(r["value"]), a)
    for cc, (v, a) in ult.items():
        paises[cc][chave] = [round(v, 1), a]
    anos_sdg[chave] = sorted({a for v, a in ult.values()})
    print(chave, len(ult), "paises, anos", anos_sdg[chave])

# ---------- 4. PAN International: ingredientes ativos proibidos por pais (planilha xlsx = zip de XML) ----------
zx = zipfile.ZipFile(baixar(U_PAN, os.path.join("pan", "PAN-Consolidated-List-of-Bans_2024_FINAL.xlsx"), 100_000))
NS = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
textos = ["".join(t.text or "" for t in si.iter(NS + "t")) for si in ET.fromstring(zx.read("xl/sharedStrings.xml")).findall(NS + "si")]
lin = collections.defaultdict(dict)
for c in ET.fromstring(zx.read("xl/worksheets/sheet1.xml")).iter(NS + "c"):
    m = re.match(r"([A-Z]+)(\d+)", c.get("r")); v = c.find(NS + "v")
    if v is None:
        continue
    j = 0
    for ch in m.group(1):
        j = j * 26 + ord(ch) - 64
    lin[int(m.group(2))][j - 1] = (textos[int(v.text)] if c.get("t") == "s" else v.text).strip()
edicao = re.search(r"(\d+)(?:st|nd|rd|th) Edition, (\w+ \d{4})", lin[1][1])
if not edicao:
    raise SystemExit("planilha PAN: edicao nao encontrada")
# linhas de ingrediente: tem nome na coluna B, entre o cabecalho (linhas 1-2) e a linha de total
ingred = [i for i in sorted(lin) if i >= 3 and lin[i].get(1) and not lin[i][1].upper().startswith("TOTAL")]
marcas = collections.Counter(); estranhos = []
for i in ingred:
    for j, v in lin[i].items():
        if j >= 5 and lin[1].get(j):                 # so colunas com cabecalho (pais); o resto sao totais
            if re.sub(r"\D", "", v) in ("1", "27"):  # 1 = proibido; 27 = vale para os 27 paises da UE
                marcas[j] += 1
            else:
                estranhos.append((i, lin[1].get(j), v))
print(f"PAN {edicao.group(0)}: {len(ingred)} ingredientes; celulas ignoradas: {estranhos}")

APELIDO = {"ANTIGUA & BARBUDA": "AG", "BOLIVIA, PLURINATIONAL STATE OF": "BO", "BOSNIA & HERZEGOVINA": "BA", "CAP-VERT": "CV",
           "CONGO": "CG", "CONGO, DEMOCRATIC REPUBLIC OF": "CD", "COTE D'IVOIRE": "CI", "IRAN, ISLAMIC REPUBLIC OF": "IR",
           "IRAQ, ISLAMIC STATE OF": "IQ", "KOREA (NORTH), DEMOCRATIC PEOPLE'S REPUBLIC OF": "KP", "KOREA (SOUTH), REPUBLIC OF": "KR",
           "LAO PDR": "LA", "MOLDOVA, REPUBLIC OF": "MD", "PALESTINE, STATE OF": "PS", "RUSSIAN FEDERATION": "RU",
           "ST KITTS AND NEVIS": "KN", "ST LUCIA": "LC", "SYRIAN ARAB REPUBLIC": "SY", "TANZANIA, UNITED REPUBLIC OF": "TZ",
           "TRINIDAD & TOBAGO": "TT", "TURKIYE": "TR", "UNITEDARAB EMIRATES": "AE", "UNITED KINGDOM (UK)": "GB", "USA": "US",
           "VENEZUELA, BOLIVARIAN REPUBLIC OF": "VE", "VIET NAM": "VN"}
UE27 = "AT BE BG HR CY CZ DK EE FI FR DE GR HU IE IT LV LT LU MT NL PL PT RO SK SI ES SE".split()
proib, extra_ue, ue_proib, ue_nao, gb_nao, us_ret = {}, {}, None, None, None, None
for j in sorted(k for k in lin[1] if k >= 5):
    h = " ".join(lin[1][j].upper().split()); n = marcas.get(j, 0)
    if h.startswith("EU"):
        if "NOT APPROVED" in h: ue_nao = n
        else: ue_proib = n
    elif h.startswith("UK") and "NOT APPROVED" in h: gb_nao = n
    elif h.startswith("USA") and "VOLUNTARY" in h: us_ret = n
    elif "(IN ADD" in h:                            # proibicoes nacionais alem das da UE
        extra_ue[nome_pais[h.split("(")[0].strip()]] = n
    else:
        cc = APELIDO.get(h) or nome_pais.get(h)
        if not cc:
            raise SystemExit(f"planilha PAN: pais nao reconhecido: {h!r}")
        proib[cc] = n
if None in (ue_proib, ue_nao, gb_nao, us_ret) or "GB" not in proib or "US" not in proib:
    raise SystemExit("planilha PAN: colunas da UE, Reino Unido ou EUA nao encontradas")
for cc in UE27:                                     # a PAN registra a UE em bloco: mesmo numero para os 27
    proib[cc] = ue_proib + extra_ue.get(cc, 0)
for cc, n in proib.items():
    if cc not in EXCLUIR:
        paises[cc]["pestBanned"] = n
for cc in UE27:
    paises[cc]["pestNotApproved"] = ue_nao
paises["GB"]["pestNotApproved"] = gb_nao
paises["US"]["pestWithdrawn"] = us_ret
print(f"  UE: {ue_proib} proibidos + {ue_nao} nao aprovados; adicionais {extra_ue}; Reino Unido nao aprovados {gb_nao}; EUA retirados {us_ret}")

# ---------- saida ----------
if EXCLUIR & set(paises) or any(r[4] in EXCLUIR for r in rios):
    raise SystemExit("pais excluido escapou para a saida")
cont = {k: sum(1 for v in paises.values() if v.get(k) is not None) for k in ("pest", "pestBanned", "waterGood", "wastewater")}
nota = (
    f"RIVERS: modelled floating macroplastic emitted to the sea each year at river mouths (tonnes per year, mid-point scenario), from Meijer et al. 2021, "
    f"Science Advances (doi:10.1126/sciadv.aaz5803), data by The Ocean Cleanup on figshare, CC BY 4.0. This file keeps the {len(rios)} largest of the "
    f"{len(xy)} outfalls in the source ({t_guardado:,.0f} of {sum(emis):,.0f} t/yr); they are model estimates, not measurements, and the source has no river names. "
    f"Row: [lat, lon, tonnes per year, river name (empty), ISO2 country of the nearest city, nearest city of 15,000+ people (GeoNames, CC BY 4.0), distance to that city in km]; "
    f"the country is that of the nearest city and can be wrong close to a border. "
    f"PEST: total pesticide use per hectare of cropland in kg/ha, [value, year], latest year per country (mostly {max(a for v, a in [p['pest'] for p in paises.values() if p['pest']])}), "
    f"FAO 'Pesticides Use' processed by Our World in Data, CC BY 4.0; national totals of active ingredients, partly estimated by FAO, saying nothing about which substances or where inside the country; "
    f"a value of 0 is what the source reports and most likely reflects incomplete reporting, and very small countries with little cropland show extreme values; "
    f"pestStats gives the median and 75th/90th percentiles across the {est['n']} countries in this file. "
    f"PESTBANNED: number of pesticide active ingredients or groups (out of {len(ingred)} listed) recorded as banned in the country by the PAN International Consolidated List of Banned Pesticides, "
    f"{edicao.group(0)} (copyright PAN International; only counts derived from it are stored here). PAN states the list is incomplete because many countries do not publish their bans, "
    f"so a low or missing number means no information, not weak rules; it counts full bans only, not restrictions. The 27 European Union members share the EU-level count "
    f"(plus national bans where listed); pestNotApproved (EU members and GB) counts listed substances not approved for use though not formally banned, and pestWithdrawn (US) those voluntarily withdrawn by industry. "
    f"WATERGOOD: SDG indicator 6.3.2, percent of monitored water bodies with good ambient water quality, [value, year], years {anos_sdg['waterGood'][0]}-{anos_sdg['waterGood'][-1]}, "
    f"UNEP via the UN SDG Global Database; reported by countries from very different numbers of monitored water bodies, so it is weakly comparable between countries. "
    f"WASTEWATER: SDG indicator 6.3.1, percent of domestic wastewater flows safely treated, [value, year], years {anos_sdg['wastewater'][0]}-{anos_sdg['wastewater'][-1]}, "
    f"WHO/UN-Habitat via the UN SDG Global Database; mostly estimates, domestic flows only (no industry or farm runoff). null means the source has no value for that country."
)
fontes = {
    "rivers": {"name": "Meijer, van Emmerik, van der Ent, Schmidt, Lebreton (2021). More than 1000 rivers account for 80% of global riverine plastic emissions into the ocean. Science Advances 7(18). Supplementary data, figshare (The Ocean Cleanup).",
               "url": "https://doi.org/10.6084/m9.figshare.14515590.v1", "year": 2021, "licence": "CC BY 4.0"},
    "pest": {"name": "FAO, Land, Inputs and Sustainability: Pesticides Use (2025), with major processing by Our World in Data: total pesticide use per area of cropland.",
             "url": "https://ourworldindata.org/grapher/pesticide-use-per-hectare-of-cropland", "year": max(a for v, a in [p["pest"] for p in paises.values() if p["pest"]]), "licence": "CC BY 4.0"},
    "pestBanned": {"name": f"PAN International Consolidated List of Banned Pesticides, {edicao.group(0)}.",
                   "url": "https://pan-international.org/pan-international-consolidated-list-of-banned-pesticides/", "year": int(edicao.group(2)[-4:]), "licence": "Copyright PAN International; derived counts only"},
    "waterGood": {"name": "UN SDG Global Database, series EN_H2O_WBAMBQ, indicator 6.3.2: proportion of bodies of water with good ambient water quality (custodian: UNEP).",
                  "url": "https://unstats.un.org/sdgs/dataportal", "year": anos_sdg["waterGood"][-1], "licence": "UN data, free reuse with attribution"},
    "wastewater": {"name": "UN SDG Global Database, series EN_WWT_WWDS, indicator 6.3.1: proportion of safely treated domestic wastewater flows (custodians: WHO, UN-Habitat).",
                   "url": "https://unstats.un.org/sdgs/dataportal", "year": anos_sdg["wastewater"][-1], "licence": "UN data, free reuse with attribution"},
    "places": {"name": "GeoNames cities15000 (nearest city and country of each river mouth).", "url": "https://download.geonames.org/export/dump/", "year": 2026, "licence": "CC BY 4.0"},
}
saida = {"note": nota, "sources": fontes, "pestStats": est, "rivers": rios, "countries": {k: paises[k] for k in sorted(paises)}}
json.dump(saida, open(SAIDA, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
print("gravado", os.path.getsize(SAIDA) // 1000, "KB;", len(rios), "rios;", len(paises), "paises;", cont)
print("10 maiores fozes:")
for r in rios[:10]:
    print("  ", r)
for cc in ("BR", "PY", "US", "IN", "PH", "JP", "NG", "AR", "DE", "GB"):
    print("  ", cc, paises.get(cc))
