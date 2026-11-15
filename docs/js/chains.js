/* geocare.life · chains of consequences, inside the app. (code written with AI support)
   The idea of the cascade: one thing leads to the next. Heat plus rain is the season of the mosquito, and of dengue. Heavy
   rain is flooded streets, dirty water, and then diarrhoea and leptospirosis. This card shows each chain that matters at
   the address, with the months in which its pieces come together here (the same values as the year table), and, on opening
   it, the whole chain, what a family can do, how a community breaks it, and a real case with its source.
   The texts of the chains come from data/cascades.json. */
const Chains = (() => {
  const S = { data: null, asked: false, open: {} };
  const li = () => ({ en: 0, es: 1, pt: 2 }[I18N.lang] ?? 0);
  const TX = {
    title: ["One thing leads to the next", "Una cosa lleva a la otra", "Uma coisa leva à outra"],
    sub: ["The chains of consequences that matter at this address, and the months in which their pieces come together here. Tap one to see the whole chain and where it can be broken.",
      "Las cadenas de consecuencias que pesan en esta dirección, y los meses en que sus piezas se juntan aquí. Toque una para ver la cadena completa y dónde se puede romper.",
      "As cadeias de consequências que pesam neste endereço, e os meses em que as suas peças se juntam aqui. Toque em uma para ver a cadeia inteira e onde ela pode ser quebrada."],
    now: ["Now", "Ahora", "Agora"], here: ["Here, mostly in", "Aquí, sobre todo en", "Aqui, sobretudo em"], all: ["all year", "todo el año", "o ano todo"],
    doit: ["What a family can do:", "Qué puede hacer una familia:", "O que uma família pode fazer:"], solve: ["How a community breaks the chain:", "Cómo una comunidad rompe la cadena:", "Como uma comunidade quebra a cadeia:"],
    real: ["It happened:", "Ya pasó:", "Já aconteceu:"], source: ["source", "fuente", "fonte"], map: ["Show on the map", "Ver en el mapa", "Ver no mapa"],
    note: ["The months come from the climate of this address (the same estimate as the year table), not from counts of cases.", "Los meses salen del clima de esta dirección (la misma estimación de la tabla del año), no de conteos de casos.", "Os meses vêm do clima deste endereço (a mesma estimativa da tabela do ano), não de contagem de casos."],
  };
  const tx = (k) => TX[k][li()];
  // each chain: the pieces of its "sum" (rows of the year table: e = weather event, i = illness), the words of the sum, and its map
  const W = {
    heat: ["heat", "calor", "calor"], rain: ["rain", "lluvia", "chuva"], dengue: ["dengue mosquito", "mosquito del dengue", "mosquito da dengue"], hill: ["heat illness", "enfermedades por calor", "doenças do calor"],
    hrain: ["heavy rain", "lluvia fuerte", "chuva forte"], water: ["diarrhoea and leptospirosis", "diarrea y leptospirosis", "diarreia e leptospirose"], dry: ["dry spell", "período seco", "período seco"], less: ["less water and food", "menos agua y comida", "menos água e comida"],
    cold: ["cold", "frío", "frio"], resp: ["flu and respiratory infections", "gripe e infecciones respiratorias", "gripe e infecções respiratórias"], storm: ["tropical storm", "tormenta tropical", "tempestade tropical"], wind: ["wind, floods, no power", "viento, inundación, sin luz", "vento, enchente, sem luz"],
    tornado: ["tornado", "tornado", "tornado"], shelter: ["minutes to take shelter", "minutos para refugiarse", "minutos para se abrigar"], fire: ["fire and smoke", "fuego y humo", "fogo e fumaça"], lungs: ["breathing problems", "problemas para respirar", "problemas para respirar"],
  };
  const DEF = [
    { id: "mosquito", need: ["i:mosquito"], rows: [["heat", "e:heat"], ["rain", "e:flood"], ["dengue", "i:mosquito"]], eq: ["heat", "+", "rain", "=", "dengue"], result: "i:mosquito", map: "mosq" },
    { id: "heat", need: ["e:heat"], rows: [["heat", "e:heat"], ["hill", "i:heatill"]], eq: ["heat", "→", "hill"], result: "e:heat", map: "heat" },
    { id: "rain", need: ["e:flood"], rows: [["hrain", "e:flood"], ["water", "i:lepto", "i:diarr"]], eq: ["hrain", "→", "water"], result: "e:flood", map: "rain" },
    { id: "drought", need: ["e:drought"], rows: [["dry", "e:drought"]], eq: ["dry", "→", "less"], result: "e:drought", map: "w-drought" },
    { id: "cold", need: ["e:cold", "i:resp", "i:coldill"], rows: [["cold", "e:cold"], ["resp", "i:resp", "i:coldill"]], eq: ["cold", "→", "resp"], result: "i:resp", map: "heat" },
    { id: "smoke", need: ["e:fire", "e:smoke"], rows: [["fire", "e:fire", "e:smoke"], ["lungs", "i:asthma", "i:resp"]], eq: ["dry", "+", "fire", "=", "lungs"], result: "e:fire", map: "smoke" },
    { id: "cyclone", need: ["e:cyclone"], rows: [["storm", "e:cyclone"]], eq: ["storm", "→", "wind"], result: "e:cyclone", map: "storms" },
    { id: "tornado", need: ["e:tornado"], rows: [["tornado", "e:tornado"]], eq: ["tornado", "→", "shelter"], result: "e:tornado", map: "twisters" },
  ];
  const lv = (v) => (v >= 0.7 ? 3 : v >= 0.45 ? 2 : v >= 0.2 ? 1 : 0);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  function load() {
    if (S.asked) return; S.asked = true;
    fetch("data/cascades.json").then((r) => (r.ok ? r.json() : null)).then((j) => { if (j && j.cascades) { S.data = j.cascades; if (typeof state !== "undefined" && state.main && typeof render === "function") render(); } }).catch(() => {});
  }
  // months as text, in runs that may wrap over December ("nov–abr")
  function months(mask) {
    const n = mask.filter(Boolean).length; if (!n) return ""; if (n === 12) return tx("all");
    const mon = Array.from({ length: 12 }, (_, m) => new Date(2024, m, 15).toLocaleDateString(I18N.locale ? I18N.locale() : I18N.lang, { month: "short" }).replace(".", ""));
    const runs = [], start = mask.findIndex((v, i) => v && !mask[(i + 11) % 12]);
    for (let k = 0, i = start; k < 12; k++, i = (i + 1) % 12) { if (mask[i] && !mask[(i + 11) % 12]) runs.push([i, i]); if (mask[i]) runs[runs.length - 1][1] = i; }
    return runs.map(([a, b]) => (a === b ? mon[a] : `${mon[a]}–${mon[b]}`)).join(", ");
  }
  function html(r) {
    load();
    if (!S.data || !r || typeof Extras2 === "undefined") return "";
    let P, ill; try { P = Extras2.risk(r); ill = Extras2.ill(r); } catch (_) { return ""; }
    const rows = {}; P.list.filter((z) => !z.ill && z.vals).forEach((z) => (rows["e:" + z.id] = z.vals)); ill.forEach((o) => (rows["i:" + o.id] = o.vals));
    const get = (keys) => { for (const k of keys) if (rows[k] && rows[k].some((v) => v >= 0.2)) return rows[k]; return null; };
    const m0 = new Date().getMonth(), L = (o) => esc(o[I18N.lang] || o.en);
    const items = DEF.map((d) => { const main = get(d.need); if (!main) return null; const res = get([d.result]) || main; return { d, res, c: S.data.find((x) => x.id === d.id), now: res[m0] }; })
      .filter((x) => x && x.c).sort((a, b) => (a.d.id === "mosquito" ? -1 : b.d.id === "mosquito" ? 1 : b.now - a.now));
    if (!items.length) return "";
    const letter = Array.from({ length: 12 }, (_, m) => new Date(2024, m, 15).toLocaleDateString(I18N.locale ? I18N.locale() : I18N.lang, { month: "narrow" }).toUpperCase());
    const strip = (name, vals) => `<div class="ch-row"><span>${name}</span><div class="ch-strip">${vals.map((v, m) => `<i class="l${lv(v)}${m === m0 ? " now" : ""}"></i>`).join("")}</div></div>`;
    const one = ({ d, res, c, now }) => {
      const strong = res.map((v) => v >= 0.45), mask = strong.some(Boolean) ? strong : res.map((v) => v >= 0.2);
      const eq = d.eq.map((p, i) => (W[p] ? `<b class="${i === d.eq.length - 1 ? "res" : ""}">${W[p][li()]}</b>` : `<i>${p}</i>`)).join(" ");
      const strips = d.rows.map(([w, ...keys]) => { const v = get(keys); return v ? strip(W[w][li()], v) : ""; }).join("");
      return `<details class="ch" data-ch="${d.id}"${S.open[d.id] ? " open" : ""}><summary><div class="ch-eq">${eq}${now >= 0.45 ? `<span class="badge l-now">${tx("now")}</span>` : ""}</div><p class="ch-when">${tx("here")} ${months(mask)}</p>`
        + `<div class="ch-strips"><div class="ch-row ch-head"><span></span><div class="ch-strip">${letter.map((x, m) => `<em class="${m === m0 ? "now" : ""}">${x}</em>`).join("")}</div></div>${strips}</div></summary>`
        + `<div class="ch-body"><div class="ch-chain">${c.steps.map((s) => `<span class="k-${esc(s.kind)}">${L(s.t)}</span>`).join("")}</div><p><b>${tx("doit")}</b> ${L(c.do)}</p><p><b>${tx("solve")}</b> ${L(c.solve)}</p>`
        + (c.case ? `<p class="muted small"><b class="ch-real">${tx("real")}</b> ${L(c.case.t)} ${c.source ? `<a href="${esc(c.source)}" target="_blank" rel="noopener">${tx("source")}</a>` : ""}</p>` : "")
        + `<button type="button" class="s-map" data-chmap="${d.map}">${tx("map")}</button></div></details>`;
    };
    return `<section class="s-card s-chains"><h3>${ICON("link")}<span>${tx("title")}</span></h3><p class="muted small">${tx("sub")}</p>${items.map(one).join("")}<p class="muted small">${tx("note")}</p></section>`;
  }
  // which chains are open survives the redraws of the page; the map button of a chain shows its moving map
  document.addEventListener("toggle", (e) => { const d = e.target; if (d && d.classList && d.classList.contains("ch")) S.open[d.dataset.ch] = d.open; }, true);
  document.addEventListener("click", (e) => { const b = e.target.closest && e.target.closest("[data-chmap]"); if (!b || typeof Follow === "undefined") return; e.preventDefault(); Follow.show(Follow.theme(b.dataset.chmap), true); });
  return { html };
})();
