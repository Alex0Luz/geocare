# Dengue no Paraguai por departamento (2019-2023, semanal -> mensal/anual) + serie nacional (1980-2024).
# Fontes: (1) OpenDengue V1.3.1 (so tem Paraguai em nivel nacional); (2) Care99/dengue-cluster v1.0.0 no Zenodo
# (incidencia semanal por departamento transcrita dos boletins da DGVS/MSPBS); (3) INE Censo 2022; (4) geoBoundaries.
# Gera docs/data/paraguay.json.  Uso: py -3.11 -I analysis/paraguai_dengue.py   (codigo escrito com apoio de IA)
import csv, json, os, sys, io, zipfile, datetime, calendar, collections, unicodedata, urllib.request
import xml.etree.ElementTree as ET

sys.stdout.reconfigure(encoding="utf-8")          # com -I a variavel PYTHONIOENCODING e ignorada
AQUI = os.path.dirname(os.path.abspath(__file__))
PASTA = os.path.join(AQUI, "cache_paraguai")
SAIDA = os.path.join(AQUI, "..", "docs", "data", "paraguay.json")
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36"

OD_VER = "V1.3.1"
ARQS = {  # nome local -> (url, tamanho minimo, assinatura inicial)
    "od": ("Temporal_extract_V1_3_1.zip",
           "https://github.com/OpenDengue/master-repo/raw/main/data/releases/V1.3.1/Temporal_extract_V1_3_1.zip", 50_000_000, b"PK"),
    "dep": ("zenodo_care99/dengue-cluster-v1.0.0.zip",
            "https://zenodo.org/api/records/18423650/files/Care99/dengue-cluster-v1.0.0.zip/content", 100_000, b"PK"),
    "ine": ("ine/censo2022_poblacion_edad_sexo.xlsx",
            "https://www.ine.gov.py/censo2022/documentos/Resultados%20finales_Estructura%20de%20la%20poblacion%20por%20edad%20y%20sexo_2022.xlsx", 500_000, b"PK"),
    "geo": ("geoboundaries/geoBoundaries-PRY-ADM1_simplified.geojson",
            "https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/PRY/ADM1/geoBoundaries-PRY-ADM1_simplified.geojson", 100_000, b"{"),
}

# id = codigo ISO 3166-2 (igual ao shapeISO do geoBoundaries); nome oficial; chave sem acento usada nas fontes
DEPS = [("PY-ASU", "Asunción"), ("PY-1", "Concepción"), ("PY-2", "San Pedro"), ("PY-3", "Cordillera"), ("PY-4", "Guairá"),
        ("PY-5", "Caaguazú"), ("PY-6", "Caazapá"), ("PY-7", "Itapúa"), ("PY-8", "Misiones"), ("PY-9", "Paraguarí"),
        ("PY-10", "Alto Paraná"), ("PY-11", "Central"), ("PY-12", "Ñeembucú"), ("PY-13", "Amambay"), ("PY-14", "Canindeyú"),
        ("PY-15", "Presidente Hayes"), ("PY-16", "Alto Paraguay"), ("PY-19", "Boquerón")]


def chave(s):                                      # "Pte_Hayes" -> "PRESIDENTE HAYES", "Ñeembucú" -> "NEEMBUCU"
    s = unicodedata.normalize("NFD", s)
    s = "".join(c for c in s if unicodedata.category(c) != "Mn").upper().replace("_", " ").replace(".", " ")
    s = " ".join(s.split())
    return s.replace("PTE HAYES", "PRESIDENTE HAYES")


ID = {chave(n): i for i, n in DEPS}


def baixar(k):
    nome, url, minimo, magia = ARQS[k]
    arq = os.path.join(PASTA, nome); os.makedirs(os.path.dirname(arq), exist_ok=True)
    if not os.path.exists(arq) or os.path.getsize(arq) < minimo:
        print("baixando", url, flush=True)
        with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=600) as r, open(arq, "wb") as f:
            while True:
                b = r.read(1 << 20)
                if not b: break
                f.write(b)
    with open(arq, "rb") as f:
        ini = f.read(8).lstrip()
    if os.path.getsize(arq) < minimo or not ini.startswith(magia):   # ex.: Zenodo devolve HTML 403 quando limita o trafego
        raise SystemExit(f"download invalido: {arq} (apague o arquivo e tente de novo)")
    return arq


def domingos(ano, mes):                            # todos os domingos (inicio de semana epidemiologica) de um mes
    return [datetime.date(ano, mes, d) for d in range(1, calendar.monthrange(ano, mes)[1] + 1)
            if datetime.date(ano, mes, d).weekday() == 6]


def meses_completos(semanas):                      # meses em que todas as semanas que comecam nele estao presentes
    tem = set(semanas)
    return sorted(m for m in {(d.year, d.month) for d in tem} if all(x in tem for x in domingos(*m)))


# ---------- 1) OpenDengue: Paraguai so existe como Admin0 (linhas anuais 1980-2024 e semanais 2013-2024) ----------
z = zipfile.ZipFile(baixar("od"))
nac_ano, nac_sem, res = {}, {}, collections.Counter()
with z.open(z.namelist()[0]) as fb:
    f = io.TextIOWrapper(fb, encoding="utf-8", errors="replace")
    cab = next(csv.reader([f.readline()])); ix = {k: i for i, k in enumerate(cab)}
    for linha in f:
        if '"PRY"' not in linha:                   # filtro rapido antes do csv (arquivo de 500 MB)
            continue
        r = next(csv.reader([linha]))
        if r[ix["ISO_A0"]] != "PRY":
            continue
        res[(r[ix["S_res"]], r[ix["T_res"]], r[ix["case_definition_standardised"]])] += 1
        ini = datetime.date.fromisoformat(r[ix["calendar_start_date"]]); fim = datetime.date.fromisoformat(r[ix["calendar_end_date"]])
        v = int(round(float(r[ix["dengue_total"]])))
        if r[ix["S_res"]] != "Admin0":
            raise SystemExit("OpenDengue agora tem dado subnacional do Paraguai: rever o script")
        if r[ix["T_res"]] == "Year":               # anual e semanal cobrem o mesmo periodo: nunca somar os dois
            assert (ini.month, ini.day, fim.month, fim.day) == (1, 1, 12, 31) and ini.year not in nac_ano
            nac_ano[ini.year] = v
        elif r[ix["T_res"]] == "Week":
            assert (fim - ini).days == 6 and ini.weekday() == 6 and ini not in nac_sem
            nac_sem[ini] = v
print("OpenDengue", OD_VER, "linhas PRY por (S_res, T_res, definicao):", dict(res))

nac_mes = collections.OrderedDict()                # mensal nacional: semana vai para o mes em que comeca
mc = meses_completos(nac_sem)
corrida = [mc[-1]]                                 # so o trecho final sem buracos (2014-2015 tem semanas faltando)
for m in reversed(mc[:-1]):
    a, b = corrida[0]
    if m != ((a, b - 1) if b > 1 else (a - 1, 12)): break
    corrida.insert(0, m)
for a, b in corrida:
    nac_mes[f"{a}-{b:02d}"] = sum(v for d, v in nac_sem.items() if (d.year, d.month) == (a, b))
print("nacional mensal (OpenDengue semanal):", next(iter(nac_mes)), "a", next(reversed(nac_mes)), "| meses completos fora do trecho:",
      [f"{a}-{b:02d}" for a, b in mc if (a, b) not in corrida])

# ---------- 2) Departamentos: incidencia semanal por 100 mil (Care99, a partir da DGVS) -> contagem de casos ----------
z = zipfile.ZipFile(baixar("dep"))
nome = [n for n in z.namelist() if n.endswith("csv/casos.csv")][0]
serie, nivel = collections.defaultdict(dict), {}
for r in csv.DictReader(io.TextIOWrapper(z.open(nome), encoding="utf-8")):
    assert r["disease"] == "DENGUE" and r["classification"] == "TOTAL"
    m, d, a = map(int, r["date"].split("/")); fim = datetime.date(a, m, d)
    assert fim.weekday() == 5                      # a data e o sabado que fecha a semana epidemiologica
    serie[r["name"]][fim - datetime.timedelta(days=6)] = float(r["incidence"]); nivel[r["name"]] = r["level"]


def contar(vals):                                  # incidencia = casos / pop * 1e5 com pop fixa: acha a unidade (1 caso)
    pos = sorted(x for x in set(vals.values()) if x > 0)
    for div in range(1, 100):
        u = pos[0] / div
        if max(abs(x / u - round(x / u)) for x in pos) < 0.01:
            u = pos[-1] / round(pos[-1] / u)       # refina com o maior valor
            assert max(abs(x / u - round(x / u)) for x in pos) < 0.01
            return {d: int(round(x / u)) for d, x in vals.items()}, 1e5 / u
    raise SystemExit("incidencia nao e multiplo inteiro de uma unidade: nao da para recuperar contagens")


casos, popfonte = {}, {}
for n, v in serie.items():
    if nivel[n] in ("Department", "National"):     # ignora os "Eje" (agrupamentos regionais)
        k = "PRY" if nivel[n] == "National" else ID[chave(n)]
        casos[k], popfonte[k] = contar(v)
assert len(casos) == 19
semanas = sorted(casos["PRY"])
assert all((b - a).days == 7 for a, b in zip(semanas, semanas[1:]))
for d in semanas:                                  # prova da conversao: soma dos departamentos = linha nacional, toda semana
    assert sum(casos[i].get(d, 0) for i, _ in DEPS) == casos["PRY"][d], d   # (linha ausente de um departamento = zero casos)
assert abs(sum(popfonte[i] for i, _ in DEPS) - popfonte["PRY"]) < 50 and 7.0e6 < popfonte["PRY"] < 8.0e6
print("departamentos:", semanas[0], "a", semanas[-1], f"({len(semanas)} semanas); denominador nacional implicito {popfonte['PRY']:.0f}")

mc = meses_completos(semanas)                      # descarta as pontas (2018-12 e 2024-01 so tem 1 semana cada)
print("semanas descartadas (mes incompleto):", [str(d) for d in semanas if (d.year, d.month) not in mc])
mensal = collections.OrderedDict()
for a, b in mc:
    mensal[f"{a}-{b:02d}"] = {i: sum(v for d, v in casos[i].items() if (d.year, d.month) == (a, b)) for i, _ in DEPS}
anual = collections.OrderedDict()
for a in sorted({a for a, _ in mc}):
    if sum(1 for x, _ in mc if x == a) == 12:
        anual[str(a)] = {i: sum(mensal[f"{a}-{b:02d}"][i] for b in range(1, 13)) for i, _ in DEPS}

# ---------- 3) Populacao: INE, Censo 2022 (resultados finais), Cuadro 1 ----------
z = zipfile.ZipFile(baixar("ine"))
NS = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main", "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships"}
textos = ["".join(t.text or "" for t in si.iter("{%s}t" % NS["m"])) for si in ET.fromstring(z.read("xl/sharedStrings.xml")).findall("m:si", NS)]
rid = [s.get("{%s}id" % NS["r"]) for s in ET.fromstring(z.read("xl/workbook.xml")).find("m:sheets", NS) if s.get("name").strip() == "C1 TOTAL PAIS"][0]
alvo = [x.get("Target") for x in ET.fromstring(z.read("xl/_rels/workbook.xml.rels")) if x.get("Id") == rid][0]
pop, total = {}, None
for linha in ET.fromstring(z.read("xl/" + alvo.lstrip("/").replace("xl/", ""))).iter("{%s}row" % NS["m"]):
    c = []
    for x in linha.findall("m:c", NS):
        v = x.find("m:v", NS)
        if v is not None: c.append(textos[int(v.text)] if x.get("t") == "s" else v.text)
    if len(c) >= 2 and c[1].replace(".", "").isdigit():
        if chave(c[0]) == "TOTAL": total = int(float(c[1]))
        elif chave(c[0]) in ID: pop[ID[chave(c[0])]] = int(float(c[1]))
assert len(pop) == 18 and sum(pop.values()) == total, (len(pop), sum(pop.values()), total)
print("INE Censo 2022: total", total)

# ---------- 4) Centroides: geoBoundaries ADM1 (centroide geometrico do poligono, ponderado pela area) ----------
cen = {}
for ft in json.load(open(baixar("geo"), encoding="utf-8"))["features"]:
    g = ft["geometry"]; A = cx = cy = 0.0
    for p in (g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]):
        for (x0, y0), (x1, y1) in zip(p[0], p[0][1:]):
            k = x0 * y1 - x1 * y0; A += k / 2; cx += (x0 + x1) * k / 6; cy += (y0 + y1) * k / 6
    cen[ft["properties"]["shapeISO"]] = (round(cy / A, 3), round(cx / A, 3))
assert set(cen) == {i for i, _ in DEPS}

# ---------- saida ----------
m0, m1 = next(iter(mensal)), next(reversed(mensal))
out = {
    "note": ("Dengue in Paraguay. Values are reported cases (suspected + probable + confirmed, i.e. notifications; not only laboratory-confirmed). "
             f"DEPARTMENT LEVEL ('yearly', 'monthly'): {m0} to {m1} only, for the 17 departments plus the capital district Asuncion. "
             "OpenDengue has no sub-national data for Paraguay, so these come from a third-party open transcription of the weekly arbovirus "
             "bulletins of DGVS (Ministry of Health): Care99/dengue-cluster v1.0.0 on Zenodo, which publishes weekly incidence per 100,000 "
             "(classification 'TOTAL'). Case counts were recovered exactly as incidence x denominator / 100,000: every value is an integer "
             "multiple of one case, and the department counts add up to the dataset's national row in all weeks. Epidemiological weeks "
             "(Sunday to Saturday) are assigned to the month and year in which the week starts; the two edge weeks falling in incomplete "
             "months were dropped. The series ends in mid-January 2024, so its last weeks were probably still being updated: the week starting "
             "2023-12-31 (counted in 2023-12) is about 40% below the figure PAHO later published. The 2013 and 2024 epidemics are NOT covered "
             "at department level (no open machine-readable source found: DGVS publishes PDF bulletins only). "
             f"NATIONAL LEVEL: 'national' = annual totals {min(nac_ano)}-{max(nac_ano)} as reported to PAHO, from OpenDengue {OD_VER} (zeros before 1999 are as "
             f"published and may mean 'not reported'); 'national_monthly' = OpenDengue weekly national counts {next(iter(nac_mes))} to {next(reversed(nac_mes))} aggregated by week "
             "start, complete months only (so 12 months do not add up exactly to the PAHO epidemiological-year total). The two sources do not "
             "match exactly: for 2020-2023 the department totals are 4% to 23% below PAHO's weekly totals, but for 2019 they are 2.3 times higher "
             "(38,345 vs 16,333), which points to a different case definition in what was reported to PAHO that year. Reporting rules and case "
             "definitions changed over the years, so compare magnitudes and timing, not small differences. "
             "'lat'/'lon' = geometric centroid of the department polygon (geoBoundaries gbOpen PRY ADM1, not the capital city). "
             "'pop' = resident population, INE Paraguay, 2022 National Census, final results. 'pop_src' = denominator used by the source "
             "dataset for its incidence rates (consistent with INE's 2015-revision projection for 2023, which is about 24% above the 2022 census count)."),
    "source": {"name": "Care99/dengue-cluster (C. Rodas), csv/casos.csv: weekly dengue incidence by department, transcribed from DGVS/MSPBS Paraguay arbovirus bulletins",
               "url": "https://doi.org/10.5281/zenodo.18423650", "version": "v1.0.0 (2026-01-29)", "licence": "CC BY 4.0",
               "original": "Dirección General de Vigilancia de la Salud (DGVS), MSPBS Paraguay, https://dgvs.mspbs.gov.py/arbovirosis/"},
    "source_national": {"name": "OpenDengue (national extract of PAHO/WHO reports), Clarke J. et al., Scientific Data 2024", "url": "https://opendengue.org/data.html",
                        "version": OD_VER + " (Temporal extract)", "licence": "CC BY 4.0"},
    "source_population": {"name": "INE Paraguay, Censo Nacional de Población y Viviendas 2022, resultados finales, Cuadro 1", "url": "https://www.ine.gov.py/censo2022/", "year": 2022},
    "source_centroids": {"name": "geoBoundaries gbOpen PRY ADM1 (boundaries: DGEEC 2012)", "url": "https://www.geoboundaries.org/", "licence": "CC BY 4.0"},
    "coverage": {"departments": [m0, m1], "national": [min(nac_ano), max(nac_ano)], "national_monthly": [next(iter(nac_mes)), next(reversed(nac_mes))]},
    "departments": [{"id": i, "name": n, "lat": cen[i][0], "lon": cen[i][1], "pop": pop[i], "pop_src": int(round(popfonte[i]))} for i, n in DEPS],
    "yearly": anual,
    "monthly": mensal,
    "national": {str(a): nac_ano[a] for a in sorted(nac_ano)},
    "national_monthly": nac_mes,
}
with open(SAIDA, "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, separators=(",", ":"))
print("gravado", os.path.normpath(SAIDA), os.path.getsize(SAIDA), "bytes")

# ---------- conferencia ----------
print("\nnacional por ano (OpenDengue/OPAS):")
print("  " + "  ".join(f"{a}:{v}" for a, v in sorted(nac_ano.items()) if a >= 1999))
print("  antes de 1999:", {a: v for a, v in nac_ano.items() if a < 1999 and v})
print("ano | soma dos departamentos | OpenDengue semanal (mesmo criterio) | OpenDengue anual")
for a in anual:
    sem = sum(v for d, v in nac_sem.items() if d.year == int(a))
    print(f"  {a} | {sum(anual[a].values())} | {sem} | {nac_ano[int(a)]}")
pico = max(anual, key=lambda a: sum(anual[a].values())); nomes = dict(DEPS)
print("ano de pico com dado por departamento:", pico)
for i, v in sorted(anual[pico].items(), key=lambda t: -t[1])[:5]:
    print(f"  {nomes[i]:18s} {v:7d} casos  {v / pop[i] * 1e5:8.0f} por 100 mil (censo 2022)")
mp = max(mensal, key=lambda m: sum(mensal[m].values()))
print("mes de pico:", mp, sum(mensal[mp].values()), "| mes de pico nacional (OpenDengue):", max(nac_mes, key=nac_mes.get), max(nac_mes.values()))
