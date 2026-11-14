# Dengue (InfoDengue) nas cidades-gemeas de CDE, da mais fria para a mais quente. Codigo escrito com apoio de IA.
import csv, io, json, urllib.request, collections, concurrent.futures as cf
G = {"Porto Alegre": 4314902, "Florianopolis": 4205407, "Curitiba": 4106902, "Cascavel": 4104808, "Londrina": 4113700,
     "Foz do Iguacu": 4108304, "Maringa": 4115200, "Dourados": 5003702, "Presidente Prudente": 3541406, "Campo Grande": 5002704}
def get(item):
    n, g = item
    u = f"https://info.dengue.mat.br/api/alertcity?geocode={g}&disease=dengue&format=csv&ew_start=1&ew_end=53&ey_start=2010&ey_end=2026"
    for _ in range(3):
        try:
            t = urllib.request.urlopen(u, timeout=90).read().decode("utf-8")
            return n, list(csv.DictReader(io.StringIO(t)))
        except Exception as e:
            err = e
    return n, None
out = {}
with cf.ThreadPoolExecutor(4) as ex:
    for n, rows in ex.map(get, G.items()):
        if not rows:
            print("FALHOU", n); continue
        c = collections.Counter(); pop = 0
        for r in rows:
            c[int(r["SE"]) // 100] += float(r["casos"] or 0)
            pop = max(pop, float(r.get("pop") or 0))
        out[n] = {"pop": pop, "casos": dict(sorted(c.items()))}
json.dump(out, open("dengue_gemeos.json", "w"), indent=1)
P = [(2010, 2014), (2015, 2019), (2020, 2025)]
print(f"{'cidade':20s} {'pop':>9s} | incidencia media anual por 100 mil: " + " | ".join(f"{a}-{b}" for a, b in P) + " | pior ano")
for n, d in out.items():
    inc = lambda a, b: sum(d["casos"].get(y, 0) for y in range(a, b + 1)) / (b - a + 1) / d["pop"] * 1e5
    y, v = max(d["casos"].items(), key=lambda kv: kv[1])
    print(f"{n:20s} {d['pop']:9.0f} | " + " | ".join(f"{inc(a, b):9.0f}" for a, b in P) + f" | {y}: {v:.0f} casos ({v / d['pop'] * 1e5:.0f}/100 mil)")
