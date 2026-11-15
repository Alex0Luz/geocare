/* geocare.life · the ground and the water at an address
   A screening, in plain words, of how safe the ground of a place is: landslides, flooding, soil getting drier.
   It joins what the app already knows (terrain from the Copernicus elevation model, heavy-rain days, the river, the trend
   of soil wetness from NASA POWER) with three NASA SEDAC maps read at the address: landslide hazard class, number of
   large floods recorded 1985-2003 and number of drought episodes 1980-2000 (Natural Disaster Hotspots, served by NASA GIBS).
   The value is read from the map tile: the colour of the pixel at the address is looked up in the layer's own colour table.
   It is a screening from global data, not a survey of a plot of land. (code written with AI support) */
I18N.add("en", {
  "gr.title": "Is the ground here safe?", "gr.intro": "A first look from global data, in three questions. It does not replace an inspection of your land or the advice of civil defence.",
  "gr.ok": "No warning sign", "gr.watch": "Worth attention", "gr.care": "Take care",
  "gr.q.slide": "Can the ground slide?", "gr.q.flood": "Can water reach the house?", "gr.q.soil": "Is the soil holding water?",
  "gr.slide.class": "On NASA's landslide map, the highest class within about 15 km of this address is \"{c}\" (scale from very low to very high).", "gr.slide.none": "NASA's landslide map shows no hazard class within about 15 km of this address.", "gr.slide.hills": "There are hills within 1.5 km: the highest ground is {g} m above this address.",
  "gr.slide.steep": "The ground around the address is steep (slope of about {s}%).", "gr.slide.flat": "The ground around the address is not steep (slope of about {s}%).",
  "gr.slide.rain": "Heavy rain of 50 mm or more in a day comes about {n} times a year, and slides usually follow it.",
  "gr.flood.n": "Large floods recorded within about 15 km between 1985 and 2003: {n}.", "gr.flood.none": "No large flood recorded within about 15 km between 1985 and 2003.",
  "gr.flood.low": "The address sits lower than the land around it, so water tends to collect here.", "gr.flood.notlow": "The address does not sit in a low spot.",
  "gr.flood.river": "A large river crosses this area: floods have reached {b} m³/s against a usual {a} m³/s.", "gr.flood.high": "Higher ground is about {d} km away to the {dir}, {g} m above this spot.",
  "gr.soil.dry": "The top layer of the soil has been getting drier since 1981 (NASA record, one source).", "gr.soil.wet": "The top layer of the soil has been getting wetter since 1981 (NASA record, one source).", "gr.soil.flat": "No clear change in how wet the top layer of the soil is since 1981.",
  "gr.soil.drought": "Drought episodes recorded in this area between 1980 and 2000: {n}.", "gr.soil.spell": "In a typical year the longest run without rain lasts {n} days.",
  "gr.do.slide": "Watch for new cracks in walls or ground, leaning trees or posts and muddy water after rain. If you see them, leave and call civil defence.",
  "gr.do.flood": "Keep documents and medicines high, know the way to higher ground and do not cross moving water.",
  "gr.do.soil": "Store drinking water in clean covered containers and protect gardens and wells in the dry months.",
  "gr.cls.2": "negligible to very low", "gr.cls.3": "low", "gr.cls.4": "low to moderate", "gr.cls.5": "moderate", "gr.cls.6": "medium", "gr.cls.7": "medium to high", "gr.cls.8": "high", "gr.cls.9": "very high",
  "gr.src": "Sources: NASA SEDAC Natural Disaster Hotspots (landslides, floods, drought) through NASA GIBS; Copernicus elevation model; NASA POWER. Grids of 5 to 50 km: your street can differ.",
  "gr.loading": "Reading the NASA maps for this address…",
});
I18N.add("es", {
  "gr.title": "¿Es seguro el suelo aquí?", "gr.intro": "Una primera mirada con datos globales, en tres preguntas. No reemplaza una inspección del terreno ni la orientación de protección civil.",
  "gr.ok": "Sin señal de alerta", "gr.watch": "Merece atención", "gr.care": "Tenga cuidado",
  "gr.q.slide": "¿Puede deslizarse el suelo?", "gr.q.flood": "¿Puede llegar el agua a la casa?", "gr.q.soil": "¿El suelo está reteniendo agua?",
  "gr.slide.class": "En el mapa de deslizamientos de la NASA, la clase más alta a unos 15 km de esta dirección es \"{c}\" (escala de muy baja a muy alta).", "gr.slide.none": "El mapa de deslizamientos de la NASA no muestra clase de peligro a unos 15 km de esta dirección.", "gr.slide.hills": "Hay cerros a menos de 1,5 km: el terreno más alto está {g} m por encima de esta dirección.",
  "gr.slide.steep": "El terreno alrededor de la dirección es empinado (pendiente de cerca de {s}%).", "gr.slide.flat": "El terreno alrededor de la dirección no es empinado (pendiente de cerca de {s}%).",
  "gr.slide.rain": "La lluvia fuerte de 50 mm o más en un día llega unas {n} veces al año, y los deslizamientos suelen venir después.",
  "gr.flood.n": "Grandes inundaciones registradas a unos 15 km entre 1985 y 2003: {n}.", "gr.flood.none": "Ninguna gran inundación registrada a unos 15 km entre 1985 y 2003.",
  "gr.flood.low": "La dirección está más baja que el terreno de alrededor, así que el agua tiende a juntarse aquí.", "gr.flood.notlow": "La dirección no está en un punto bajo.",
  "gr.flood.river": "Un río grande cruza esta zona: las crecidas llegaron a {b} m³/s frente a {a} m³/s habituales.", "gr.flood.high": "Hay terreno más alto a unos {d} km hacia el {dir}, {g} m por encima de este punto.",
  "gr.soil.dry": "La capa superior del suelo se está secando desde 1981 (registro de la NASA, una sola fuente).", "gr.soil.wet": "La capa superior del suelo está más húmeda desde 1981 (registro de la NASA, una sola fuente).", "gr.soil.flat": "Sin cambio claro en la humedad de la capa superior del suelo desde 1981.",
  "gr.soil.drought": "Episodios de sequía registrados en esta zona entre 1980 y 2000: {n}.", "gr.soil.spell": "En un año típico, la racha más larga sin lluvia dura {n} días.",
  "gr.do.slide": "Esté atento a grietas nuevas en paredes o suelo, árboles o postes inclinados y agua barrosa después de la lluvia. Si las ve, salga y llame a protección civil.",
  "gr.do.flood": "Guarde documentos y remedios en alto, conozca el camino al terreno más alto y no cruce agua en movimiento.",
  "gr.do.soil": "Guarde agua para beber en recipientes limpios y tapados y proteja huertas y pozos en los meses secos.",
  "gr.cls.2": "insignificante a muy baja", "gr.cls.3": "baja", "gr.cls.4": "baja a moderada", "gr.cls.5": "moderada", "gr.cls.6": "media", "gr.cls.7": "media a alta", "gr.cls.8": "alta", "gr.cls.9": "muy alta",
  "gr.src": "Fuentes: NASA SEDAC Natural Disaster Hotspots (deslizamientos, inundaciones, sequía) vía NASA GIBS; modelo de elevación de Copernicus; NASA POWER. Grillas de 5 a 50 km: su calle puede ser diferente.",
  "gr.loading": "Leyendo los mapas de la NASA para esta dirección…",
});
I18N.add("pt", {
  "gr.title": "O chão aqui é seguro?", "gr.intro": "Um primeiro olhar com dados globais, em três perguntas. Não substitui uma vistoria do terreno nem a orientação da defesa civil.",
  "gr.ok": "Sem sinal de alerta", "gr.watch": "Merece atenção", "gr.care": "Tenha cuidado",
  "gr.q.slide": "O chão pode deslizar?", "gr.q.flood": "A água pode chegar à casa?", "gr.q.soil": "O solo está segurando água?",
  "gr.slide.class": "No mapa de deslizamentos da NASA, a classe mais alta a cerca de 15 km deste endereço é \"{c}\" (escala de muito baixa a muito alta).", "gr.slide.none": "O mapa de deslizamentos da NASA não mostra classe de perigo a cerca de 15 km deste endereço.", "gr.slide.hills": "Há morros a menos de 1,5 km: o terreno mais alto fica {g} m acima deste endereço.",
  "gr.slide.steep": "O terreno em volta do endereço é íngreme (inclinação de cerca de {s}%).", "gr.slide.flat": "O terreno em volta do endereço não é íngreme (inclinação de cerca de {s}%).",
  "gr.slide.rain": "Chuva forte de 50 mm ou mais num dia vem cerca de {n} vezes por ano, e os deslizamentos costumam vir depois.",
  "gr.flood.n": "Grandes enchentes registradas a cerca de 15 km entre 1985 e 2003: {n}.", "gr.flood.none": "Nenhuma grande enchente registrada a cerca de 15 km entre 1985 e 2003.",
  "gr.flood.low": "O endereço fica mais baixo do que o terreno em volta, então a água tende a se juntar aqui.", "gr.flood.notlow": "O endereço não fica num ponto baixo.",
  "gr.flood.river": "Um rio grande cruza esta área: as cheias já chegaram a {b} m³/s contra {a} m³/s habituais.", "gr.flood.high": "Há terreno mais alto a cerca de {d} km para o {dir}, {g} m acima deste ponto.",
  "gr.soil.dry": "A camada de cima do solo está ficando mais seca desde 1981 (registro da NASA, uma fonte só).", "gr.soil.wet": "A camada de cima do solo está mais úmida desde 1981 (registro da NASA, uma fonte só).", "gr.soil.flat": "Sem mudança clara na umidade da camada de cima do solo desde 1981.",
  "gr.soil.drought": "Episódios de seca registrados nesta área entre 1980 e 2000: {n}.", "gr.soil.spell": "Num ano típico, a maior sequência sem chuva dura {n} dias.",
  "gr.do.slide": "Fique de olho em rachaduras novas em paredes ou no chão, árvores ou postes inclinados e água barrenta depois da chuva. Se aparecerem, saia e chame a defesa civil.",
  "gr.do.flood": "Guarde documentos e remédios no alto, conheça o caminho para o terreno mais alto e não atravesse água em movimento.",
  "gr.do.soil": "Guarde água de beber em recipientes limpos e tampados e proteja hortas e poços nos meses secos.",
  "gr.cls.2": "desprezível a muito baixa", "gr.cls.3": "baixa", "gr.cls.4": "baixa a moderada", "gr.cls.5": "moderada", "gr.cls.6": "média", "gr.cls.7": "média a alta", "gr.cls.8": "alta", "gr.cls.9": "muito alta",
  "gr.src": "Fontes: NASA SEDAC Natural Disaster Hotspots (deslizamentos, enchentes, seca) via NASA GIBS; modelo de elevação do Copernicus; NASA POWER. Grades de 5 a 50 km: a sua rua pode ser diferente.",
  "gr.loading": "Lendo os mapas da NASA para este endereço…",
});

// Three NASA SEDAC values at the address: landslide hazard class (2 to 9), large floods 1985-2003, drought episodes 1980-2000.
// Each is the highest value within about 15 km. 0 = the map shows nothing there; NaN = the map could not be read.
async function fetchGround(lat, lon) {
  const key = `geocare.ground2:${lat.toFixed(2)}:${lon.toFixed(2)}`;
  try { const c = localStorage.getItem(key); if (c) return JSON.parse(c); } catch (_) { /* storage unavailable */ }
  const G = "https://gibs.earthdata.nasa.gov", z = 7, n = 2 ** z, rad = (lat * Math.PI) / 180;
  const xf = ((lon + 180) / 360) * n, yf = ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * n;
  const tx = Math.floor(xf), ty = Math.floor(yf), px = Math.floor((xf - tx) * 256), py = Math.floor((yf - ty) * 256);
  const read = async (layer) => {
    const xml = await (await fetch(`${G}/colormaps/v1.3/${layer}.xml`)).text(), tab = [];
    for (const e of xml.matchAll(/<ColorMapEntry rgb="(\d+),(\d+),(\d+)" transparent="false"[^>]*? value="\[(\d+)/g)) tab.push([+e[1], +e[2], +e[3], +e[4]]);
    const rgb = await new Promise((res) => {
      const im = new Image(); im.crossOrigin = "anonymous";
      im.onload = () => { try { const c = document.createElement("canvas"); c.width = c.height = 256; const g = c.getContext("2d", { willReadFrequently: true }); g.drawImage(im, 0, 0); const out = []; for (let dy = -12; dy <= 12; dy += 4) for (let dx = -12; dx <= 12; dx += 4) { const d = g.getImageData(Math.min(255, Math.max(0, px + dx)), Math.min(255, Math.max(0, py + dy)), 1, 1).data; out.push(d[3] < 128 ? null : [d[0], d[1], d[2]]); } res(out); } catch (_) { res(undefined); } };
      im.onerror = () => res(undefined);
      im.src = `${G}/wmts/epsg3857/best/${layer}/default/GoogleMapsCompatible_Level7/${z}/${ty}/${tx}.png`;
    });
    if (rgb === undefined || !tab.length) return NaN;
    // the highest value in a window of about 15 km around the address (49 points)
    let top = 0;
    for (const c of rgb) { if (!c) continue; let best = NaN, bd = 30; for (const [r, g, b, v] of tab) { const d = Math.abs(r - c[0]) + Math.abs(g - c[1]) + Math.abs(b - c[2]); if (d < bd) { bd = d; best = v; } } if (best > top) top = best; }
    return top;
  };
  const [slide, flood, drought] = await Promise.all(["NDH_Landslide_Hazard_Distribution_2000", "NDH_Flood_Hazard_Frequency_Distribution_1985-2003", "NDH_Drought_Hazard_Frequency_Distribution_1980-2000"].map((l) => read(l).catch(() => NaN)));
  const out = { slide, flood, drought };
  if ([slide, flood, drought].every(Number.isFinite)) { try { localStorage.setItem(key, JSON.stringify(out)); } catch (_) { /* storage full: skip */ } }
  return out;
}

const Ground = (() => {
  const tt = (k, v) => I18N.t(k, v), ord = { ok: 0, watch: 1, care: 2 };
  // the three questions, each with a level and the facts behind it; the cut-offs are fixed and the same for every address
  function check(r) {
    if (!r) return null;
    const g = r.ground, T = r.terrain, A = r.nasad && r.nasad.abs, d50 = A ? Math.max(A.d50, (r.era5 && r.era5.abs && r.era5.abs.d50) || 0) : NaN;
    const soil = typeof sig === "function" ? sig(r, "soil") : null, st = soil && soil.nasa, big = r.river && r.river.p50 >= 50, fx = (v, d = 0) => (typeof fmt === "function" ? fmt(v, d) : String(v));
    const hills = !!(T && T.high && T.high.dist >= 1 && T.high.gain >= 60);
    const slideLv = (g && g.slide >= 7) || (T && T.steep && d50 >= 0.3) ? "care" : (g && g.slide >= 5) || (T && T.steep) || hills ? "watch" : "ok";
    const floodLv = (T && T.low && d50 >= 0.3) || (typeof riverLevel === "function" && riverLevel(r.river)) ? "care" : (T && T.low) || big || (g && g.flood >= 5) || d50 >= 2 ? "watch" : "ok";
    const soilLv = st && st.significant && st.direction < 0 ? "watch" : "ok";
    const Q = [
      { id: "slide", icon: "mountain", level: slideLv, facts: [g && Number.isFinite(g.slide) ? (g.slide >= 2 ? tt("gr.slide.class", { c: tt("gr.cls." + Math.min(9, g.slide)) }) : tt("gr.slide.none")) : "", T ? tt(T.steep ? "gr.slide.steep" : "gr.slide.flat", { s: fx(T.slopePct) }) : "", hills ? tt("gr.slide.hills", { g: fx(T.high.gain) }) : "", slideLv !== "ok" && Number.isFinite(d50) ? tt("gr.slide.rain", { n: fx(d50, 1) }) : ""], todo: slideLv !== "ok" ? tt("gr.do.slide") : "" },
      { id: "flood", icon: "flood", level: floodLv, facts: [g && Number.isFinite(g.flood) ? (g.flood > 0 ? tt("gr.flood.n", { n: g.flood >= 26 ? "26+" : g.flood }) : tt("gr.flood.none")) : "", T ? tt(T.low ? "gr.flood.low" : "gr.flood.notlow") : "", big ? tt("gr.flood.river", { a: fx(r.river.p50), b: fx(r.river.p99) }) : "", floodLv !== "ok" && T && T.high && T.high.gain >= 3 ? tt("gr.flood.high", { g: fx(T.high.gain), d: fx(T.high.dist, 1), dir: tt("dir").split("|")[T.high.dir] }) : ""], todo: floodLv !== "ok" ? tt("gr.do.flood") : "" },
      { id: "soil", icon: "drop", level: soilLv, facts: [st ? tt(st.significant ? (st.direction < 0 ? "gr.soil.dry" : "gr.soil.wet") : "gr.soil.flat") : "", g && Number.isFinite(g.drought) && g.drought > 0 ? tt("gr.soil.drought", { n: g.drought >= 20 ? "20+" : g.drought }) : "", A && Number.isFinite(A.spell) ? tt("gr.soil.spell", { n: fx(A.spell) }) : ""], todo: soilLv !== "ok" ? tt("gr.do.soil") : "" },
    ].map((q) => ({ ...q, facts: q.facts.filter(Boolean) }));
    return { level: Q.reduce((a, q) => (ord[q.level] > ord[a] ? q.level : a), "ok"), questions: Q, loading: r.ground === undefined };
  }
  // a ready block for any section: three rows, each a question, a plain verdict, the facts and what to do
  function html(r) {
    const c = check(r); if (!c) return "";
    return `<section class="ground"><h3>${tt("gr.title")}</h3><p class="muted small">${tt("gr.intro")}</p>${c.loading ? `<p class="loading small">${tt("gr.loading")}</p>` : ""}` +
      c.questions.map((q) => `<div class="grow g-${q.level}"><span class="hz">${ICON(q.icon)}</span><div><p class="gq">${tt("gr.q." + q.id)} <span class="badge g-${q.level}">${tt("gr." + q.level)}</span></p>${q.facts.map((f) => `<p class="gf">${f}</p>`).join("")}${q.todo ? `<p class="gt">${q.todo}</p>` : ""}</div></div>`).join("") +
      `<p class="muted small">${tt("gr.src")}</p></section>`;
  }
  return { check, html };
})();
