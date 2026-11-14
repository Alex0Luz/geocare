/* GeoCare · maps in motion
   NASA GIBS layers played through time on the main map: rain, ground heat, smoke, vegetation and land use.
   Works anywhere in the world; a button frames Paraguay. Extra themes drawn from data files (dengue by department)
   register themselves with Timelapse.addTheme(). (code written with AI support) */
I18N.add("en", {
  "tl.open": "Maps in motion", "tl.what": "What am I seeing?", "tl.play": "Play", "tl.pause": "Pause", "tl.py": "Paraguay", "tl.here": "My address", "tl.close": "Close", "tl.src": "Images: NASA GIBS / Worldview.", "tl.loading": "loading…",
  "tl.rain": "Rain", "tl.rain.d": "Total rain of each month of 2025. Watch the wet season arrive and leave. NASA MERRA-2, bias corrected with rain gauges and satellites.",
  "tl.heat": "Ground heat", "tl.heat.d": "Temperature of the land surface by day in each month of 2025, measured by the MODIS instrument on NASA's Terra satellite. It is the heat of the ground, which is higher than the air temperature.",
  "tl.smoke": "Smoke and dust", "tl.smoke.d": "How much smoke, dust and haze the air holds in each month of 2024 (aerosol optical thickness, NASA MERRA-2). In South America it peaks in the burning season, from August to October.",
  "tl.green": "Vegetation", "tl.green.d": "Vegetation index (NDVI) in each month of 2024, from MODIS on NASA's Terra satellite. Greener means more live plants: it follows rain, drought and harvest.",
  "tl.land": "Land use", "tl.land.d": "Land cover classified every year from 2001 to 2024 with MODIS (NASA). Watch forest and savanna give way to cropland and pasture. Habitat loss is the main cause of species loss.",
});
I18N.add("es", {
  "tl.open": "Mapas en movimiento", "tl.what": "¿Qué estoy viendo?", "tl.play": "Reproducir", "tl.pause": "Pausar", "tl.py": "Paraguay", "tl.here": "Mi dirección", "tl.close": "Cerrar", "tl.src": "Imágenes: NASA GIBS / Worldview.", "tl.loading": "cargando…",
  "tl.rain": "Lluvia", "tl.rain.d": "Lluvia total de cada mes de 2025. Vea llegar y salir la temporada de lluvias. NASA MERRA-2, corregido con pluviómetros y satélites.",
  "tl.heat": "Calor del suelo", "tl.heat.d": "Temperatura de la superficie del suelo de día en cada mes de 2025, medida por el instrumento MODIS del satélite Terra de la NASA. Es el calor del suelo, mayor que la temperatura del aire.",
  "tl.smoke": "Humo y polvo", "tl.smoke.d": "Cuánto humo, polvo y bruma tiene el aire en cada mes de 2024 (espesor óptico de aerosoles, NASA MERRA-2). En Sudamérica llega al máximo en la temporada de quemas, de agosto a octubre.",
  "tl.green": "Vegetación", "tl.green.d": "Índice de vegetación (NDVI) en cada mes de 2024, de MODIS en el satélite Terra de la NASA. Más verde significa más plantas vivas: sigue la lluvia, la sequía y la cosecha.",
  "tl.land": "Uso de la tierra", "tl.land.d": "Cobertura de la tierra clasificada cada año de 2001 a 2024 con MODIS (NASA). Vea cómo el bosque y la sabana dan paso a cultivos y pasturas. La pérdida de hábitat es la principal causa de pérdida de especies.",
});
I18N.add("pt", {
  "tl.open": "Mapa em movimento", "tl.what": "O que estou vendo?", "tl.play": "Tocar", "tl.pause": "Pausar", "tl.py": "Paraguai", "tl.here": "Meu endereço", "tl.close": "Fechar", "tl.src": "Imagens: NASA GIBS / Worldview.", "tl.loading": "carregando…",
  "tl.rain": "Chuva", "tl.rain.d": "Chuva total de cada mês de 2025. Veja a estação chuvosa chegar e ir embora. NASA MERRA-2, corrigido com pluviômetros e satélites.",
  "tl.heat": "Calor do solo", "tl.heat.d": "Temperatura da superfície do solo de dia em cada mês de 2025, medida pelo instrumento MODIS do satélite Terra da NASA. É o calor do chão, maior do que a temperatura do ar.",
  "tl.smoke": "Fumaça e poeira", "tl.smoke.d": "Quanta fumaça, poeira e névoa o ar carrega em cada mês de 2024 (espessura óptica de aerossóis, NASA MERRA-2). Na América do Sul o pico é na temporada de queimadas, de agosto a outubro.",
  "tl.green": "Vegetação", "tl.green.d": "Índice de vegetação (NDVI) em cada mês de 2024, do MODIS no satélite Terra da NASA. Mais verde significa mais planta viva: acompanha a chuva, a seca e a colheita.",
  "tl.land": "Uso da terra", "tl.land.d": "Cobertura da terra classificada a cada ano de 2001 a 2024 com o MODIS (NASA). Veja floresta e cerrado darem lugar a lavoura e pasto. A perda de habitat é a principal causa de perda de espécies.",
});

const Timelapse = (() => {
  const G = "https://gibs.earthdata.nasa.gov", PY = [[-27.7, -62.8], [-19.2, -54.1]];
  const months = (y) => Array.from({ length: 12 }, (_, m) => `${y}-${String(m + 1).padStart(2, "0")}-01`);
  const years = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => `${a + i}-01-01`);
  const THEMES = [
    { id: "rain", layer: "MERRA2_Precipitation_Bias_Corrected_Monthly", set: "GoogleMapsCompatible_Level6", z: 6, frames: months(2025), kind: "month", legend: "MERRA2_Precipitation_Bias_Corrected_Monthly", op: 0.75 },
    { id: "heat", layer: "MODIS_Terra_L3_Land_Surface_Temp_Monthly_Day", set: "GoogleMapsCompatible_Level6", z: 6, frames: months(2025), kind: "month", legend: "MODIS_Land_Surface_Temp", op: 0.75 },
    { id: "smoke", layer: "MERRA2_Total_Aerosol_Optical_Thickness_550nm_Extinction_Monthly", set: "GoogleMapsCompatible_Level6", z: 6, frames: months(2024), kind: "month", legend: "MERRA2_Total_Aerosol_Optical_Thickness_550nm_Extinction_Monthly", op: 0.75 },
    { id: "green", layer: "MODIS_Terra_L3_NDVI_Monthly", set: "GoogleMapsCompatible_Level7", z: 7, frames: months(2024), kind: "month", legend: "MODIS_L3_NDVI", op: 0.8 },
    { id: "land", layer: "MODIS_Combined_L3_IGBP_Land_Cover_Type_Annual", set: "GoogleMapsCompatible_Level8", z: 8, frames: years(2001, 2024), kind: "year", legend: "MODIS_IGBP_Land_Cover_Type", op: 0.8 },
  ];
  const tt = (k, v) => I18N.t(k, v);
  // frame an area even when the map has not measured itself yet
  const frame = (b) => { map.invalidateSize(); map.setView(L.latLngBounds(b).getCenter(), Math.max(5, Math.min(8, map.getBoundsZoom(b)))); };
  let box, cur = null, shown = null, timer = null, idx = 0, playing = false, token = 0, open = false;
  const vec = L.layerGroup();

  function label() {
    const f = cur.frames[idx];
    return cur.kind === "year" ? f.slice(0, 4) : cur.kind === "month" ? new Date(f + "T12:00").toLocaleDateString(I18N.locale(), { month: "long", year: "numeric" }) : cur.label(idx);
  }
  function paint() {
    if (!box) return;
    box.querySelector(".tl-toggle").textContent = "▶ " + tt("tl.open");
    const p = box.querySelector(".tl-panel"); p.hidden = !open;
    // on a phone the map grows while the animation is open, so the panel does not hide it
    if (document.body.classList.contains("tl-open") !== open) { document.body.classList.toggle("tl-open", open); setTimeout(() => map.invalidateSize(), 60); }
    if (!open) return;
    p.innerHTML = `<div class="tl-themes">${THEMES.map((th) => `<button type="button" data-th="${th.id}" class="${cur === th ? "on" : ""}">${th.name ? th.name() : tt("tl." + th.id)}</button>`).join("")}</div>` +
      (cur ? `<div class="tl-row"><button type="button" class="tl-play" aria-label="${tt(playing ? "tl.pause" : "tl.play")}">${playing ? "❚❚" : "▶"}</button><input type="range" class="tl-range" min="0" max="${cur.frames.length - 1}" value="${idx}" aria-label="time"><b class="tl-label">${label()}</b></div>
        <details class="tl-what"><summary>${tt("tl.what")}</summary><p>${cur.desc ? cur.desc() : tt("tl." + cur.id + ".d")}</p></details>${cur.legend ? `<img class="tl-legend" alt="" loading="lazy" src="${G}/legends/${cur.legend}_H.svg">` : cur.legendHtml ? cur.legendHtml() : ""}` : "") +
      `<div class="tl-row tl-foot"><button type="button" class="tl-py">${tt("tl.py")}</button>${typeof state !== "undefined" && state.main ? `<button type="button" class="tl-here">${tt("tl.here")}</button>` : ""}<span class="tl-src">${cur && !cur.layer ? "" : tt("tl.src")}</span><button type="button" class="tl-close">${tt("tl.close")}</button></div>`;
    p.querySelectorAll("[data-th]").forEach((b) => (b.onclick = () => start(THEMES.find((th) => th.id === b.dataset.th))));
    const pl = p.querySelector(".tl-play"); if (pl) pl.onclick = () => { playing = !playing; clearTimeout(timer); if (playing) show((idx + 1) % cur.frames.length); else paint(); };
    const rg = p.querySelector(".tl-range"); if (rg) rg.oninput = () => { playing = false; clearTimeout(timer); show(+rg.value); paint(); };
    p.querySelector(".tl-py").onclick = () => frame(PY);
    const here = p.querySelector(".tl-here"); if (here) here.onclick = () => map.setView([state.main.lat, state.main.lon], 7);
    p.querySelector(".tl-close").onclick = () => { stop(); open = false; paint(); };
  }
  function tick() {
    const lb = box.querySelector(".tl-label"), rg = box.querySelector(".tl-range");
    if (lb) lb.textContent = label(); if (rg) rg.value = idx;
    if (playing) timer = setTimeout(() => show((idx + 1) % cur.frames.length), cur.wait || (cur.kind === "year" ? 750 : 950));
  }
  // one frame: load the new tiles invisibly, then swap, so the map never blinks
  function show(i) {
    idx = i; const my = ++token, th = cur;
    if (!th.layer) { vec.clearLayers(); th.draw(i, vec); tick(); return; }
    const lay = L.tileLayer(`${G}/wmts/epsg3857/best/${th.layer}/default/${th.frames[i]}/${th.set}/{z}/{y}/{x}.png`, { maxNativeZoom: th.z, maxZoom: 19, opacity: 0, attribution: "NASA GIBS" }).addTo(map);
    let done = false;
    const swap = () => {
      if (done) return; done = true;
      if (my !== token || cur !== th) { map.removeLayer(lay); return; }
      lay.setOpacity(th.op); const old = shown; shown = lay; if (old) setTimeout(() => map.removeLayer(old), 200);
      tick();
    };
    lay.once("load", swap); setTimeout(swap, 4000);
  }
  function stop() { playing = false; clearTimeout(timer); token++; if (shown) { map.removeLayer(shown); shown = null; } vec.clearLayers(); map.removeLayer(vec); cur = null; }
  function start(th) {
    if (!th) return; stop(); cur = th; playing = true; idx = 0;
    if (!th.layer) vec.addTo(map);
    if (th.bounds) frame(th.bounds); else if (map.getZoom() > 7) map.setZoom(6);
    paint(); show(th.first ? th.first() : 0);
  }
  function init() {
    if (typeof map === "undefined") return;
    const C = L.control({ position: "bottomleft" });
    C.onAdd = () => {
      box = L.DomUtil.create("div", "tl");
      box.innerHTML = `<button type="button" class="tl-toggle"></button><div class="tl-panel" hidden></div>`;
      L.DomEvent.disableClickPropagation(box); L.DomEvent.disableScrollPropagation(box);
      box.querySelector(".tl-toggle").onclick = () => { open = !open; if (!open) stop(); else if (typeof state !== "undefined" && !state.main) frame(PY); paint(); };
      return box;
    };
    C.addTo(map); paint();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
  return { refresh: paint, addTheme: (th) => { if (!THEMES.some((x) => x.id === th.id)) THEMES.push(th); paint(); }, start: (id) => { open = true; start(THEMES.find((th) => th.id === id)); }, PY };
})();

I18N.add("en", { "tl.dengue": "Dengue in Paraguay", "tl.dengue.d": "Reported dengue cases (suspected, probable and confirmed) in each department of Paraguay, month by month from 2019 to 2023. The circle grows with the number of cases; the number beside the date is the national total of that month. Transcribed from the weekly bulletins of Paraguay's health surveillance office (DGVS) in an open dataset (Care99, Zenodo): good for size and timing, not for fine comparisons.", "tl.dengue.leg": "cases in the month", "tl.go": "See it on the map in motion" });
I18N.add("es", { "tl.dengue": "Dengue en Paraguay", "tl.dengue.d": "Casos notificados de dengue (sospechosos, probables y confirmados) en cada departamento del Paraguay, mes a mes de 2019 a 2023. El círculo crece con el número de casos; el número junto a la fecha es el total nacional de ese mes. Transcrito de los boletines semanales de la Dirección General de Vigilancia de la Salud (DGVS) en un conjunto de datos abierto (Care99, Zenodo): sirve para tamaño y momento, no para comparaciones finas.", "tl.dengue.leg": "casos en el mes", "tl.go": "Verlo en el mapa en movimiento" });
I18N.add("pt", { "tl.dengue": "Dengue no Paraguai", "tl.dengue.d": "Casos notificados de dengue (suspeitos, prováveis e confirmados) em cada departamento do Paraguai, mês a mês de 2019 a 2023. O círculo cresce com o número de casos; o número ao lado da data é o total nacional daquele mês. Transcrito dos boletins semanais da vigilância em saúde do Paraguai (DGVS) num conjunto de dados aberto (Care99, Zenodo): serve para tamanho e momento, não para comparações finas.", "tl.dengue.leg": "casos no mês", "tl.go": "Ver no mapa em movimento" });

fetch("data/paraguay.json").then((x) => (x.ok ? x.json() : null)).then((D) => {
  if (!D || !D.monthly) return;
  const keys = Object.keys(D.monthly).sort(), n = (v) => v.toLocaleString(I18N.locale());
  const tot = (k) => Object.values(D.monthly[k]).reduce((a, b) => a + b, 0), rad = (c) => 3 + Math.sqrt(c) / 5;
  Timelapse.addTheme({
    id: "dengue", frames: keys, bounds: Timelapse.PY, wait: 430, name: () => I18N.t("tl.dengue"), desc: () => I18N.t("tl.dengue.d"),
    label: (i) => `${new Date(keys[i] + "-15T12:00").toLocaleDateString(I18N.locale(), { month: "short", year: "numeric" })} · ${n(tot(keys[i]))}`,
    legendHtml: () => `<div class="tl-leg">${[100, 1000, 10000].map((c) => `<i style="width:${2 * rad(c)}px;height:${2 * rad(c)}px"></i>${n(c)}`).join(" ")} · ${I18N.t("tl.dengue.leg")}</div>`,
    draw: (i, g) => {
      const m = D.monthly[keys[i]];
      for (const d of D.departments) {
        const c = m[d.id] || 0; if (!c) continue;
        const rate = d.pop ? (c / d.pop) * 1e5 : 0;
        L.circleMarker([d.lat, d.lon], { radius: rad(c), color: "#b2592a", weight: 1, fillColor: "#b2592a", fillOpacity: Math.min(0.8, 0.25 + rate / 1500) }).bindTooltip(`${d.name}: ${n(c)}`).addTo(g);
      }
    },
  });
}).catch(() => { /* no file: the theme simply does not appear */ });

// any element with data-tl="theme" opens that animation and brings the map into view
document.addEventListener("click", (ev) => {
  const b = ev.target.closest("[data-tl]"); if (!b) return;
  ev.preventDefault(); Timelapse.start(b.dataset.tl);
  const m = document.querySelector("#map"); if (m && m.getBoundingClientRect().top < 0) m.scrollIntoView({ behavior: "smooth", block: "start" });
});
