/* GeoCare · maps in motion and "where it usually happens"
   The NASA GIBS images are not shown as they come: each tile is read, every colour is turned back into its value
   with the layer's own colour table, and the value is painted again with a scale made to be read (quiet base map,
   soft edges, units people use). The same reading gives the value at the address for every frame, drawn as a small
   chart that is also the timeline. Each map opens at a zoom that fits the resolution of its data.
   Through time: rain, ground heat, smoke, vegetation, lightning, storm season, land use, dengue in Paraguay.
   Where it happens: floods, drought, landslides, volcanoes (NASA SEDAC), lightning (NASA LIS), storm tracks (NOAA),
   tornadoes (NOAA), earthquakes (USGS). (code written with AI support) */
I18N.add("en", {
  "tl.open": "Maps in motion", "tl.what": "What am I seeing?", "tl.play": "Play", "tl.pause": "Pause", "tl.py": "Paraguay", "tl.here": "My address", "tl.close": "Close", "tl.src": "NASA GIBS · base map © OpenStreetMap contributors", "tl.more": "Other maps", "tl.go": "See it on the map in motion", "tl.where": "See on the map where it happens",
  "tl.g.time": "Through time", "tl.g.where": "Where it usually happens", "tl.center": "Centre of the map", "tl.nodata": "no data",
  "tl.rain": "Rain", "tl.rain.u": "mm of rain in the month", "tl.rain.d": "Total rain of each month of 2025. Watch the wet season arrive and leave. NASA MERRA-2, corrected with rain gauges and satellites; cells of about 50 km, softened for display.",
  "tl.heat": "Ground heat", "tl.heat.u": "°C at the surface, by day", "tl.heat.d": "Temperature of the land surface by day in each month of 2025, measured by the MODIS instrument on NASA's Terra satellite. It is the heat of the ground, which is higher than the air temperature.",
  "tl.smoke": "Smoke and dust", "tl.smoke.u": "smoke and dust in the air (optical thickness)", "tl.smoke.d": "How much smoke, dust and haze the air holds in each month of 2024 (aerosol optical thickness, NASA MERRA-2). In South America it peaks in the burning season, from August to October.",
  "tl.green": "Vegetation", "tl.green.u": "vegetation index (0 bare ground, 1 dense green)", "tl.green.d": "Vegetation index (NDVI) in each month of 2024, from MODIS on NASA's Terra satellite. Greener means more live plants: it follows rain, drought and harvest.",
  "tl.land": "Land use", "tl.land.u": "land cover of each year", "tl.land.d": "Land cover classified every year from 2001 to 2024 with MODIS (NASA), grouped here into six kinds. Watch forest and savanna give way to cropland. Habitat loss is the main cause of species loss.",
  "tl.lightning": "Lightning", "tl.lightning.u": "lightning flashes per km² in the month", "tl.lightning.d": "Average lightning of each month of the year, counted from orbit by NASA's Lightning Imaging Sensor on the TRMM satellite between 1998 and 2013. The sensor saw only the band between 38° north and 38° south.",
  "tl.storms": "Storm season", "tl.storms.u": "storms that passed within about 150 km, 1981–2024", "tl.storms.d": "The track of every tropical storm from 1981 to 2024, shown in the month it formed (NOAA IBTrACS). Watch the season open and close in each ocean.",
  "tl.dengue": "Dengue in Paraguay", "tl.dengue.u": "reported cases per 100,000 people in the month", "tl.dengue.d": "Reported dengue cases (suspected, probable and confirmed) in each department of Paraguay, month by month from 2019 to 2023; the chart is the national total. Transcribed from the weekly bulletins of Paraguay's health surveillance office (DGVS) in an open dataset (Care99, Zenodo): good for size and timing, not for fine comparisons.", "tl.dengue.v": "Paraguay: {n} cases · most affected: {d}",
  "tl.w-flood": "Floods", "tl.w-flood.d": "How often large floods hit each area between 1985 and 2003, in ten classes (NASA SEDAC, Natural Disaster Hotspots). An older global screening: it shows the broad pattern, not your street.",
  "tl.w-drought": "Drought", "tl.w-drought.d": "How often drought hit each area between 1980 and 2000, in ten classes (NASA SEDAC, Natural Disaster Hotspots). An older global screening.",
  "tl.w-landslide": "Landslides", "tl.w-landslide.d": "Landslide and avalanche hazard estimated from slope, soil, rain and earthquakes (NASA SEDAC, Natural Disaster Hotspots, 2000). A screening, not an official risk map.",
  "tl.w-volcano": "Volcanoes", "tl.w-volcano.d": "Where volcanoes were active between 1979 and 2000 (NASA SEDAC, Natural Disaster Hotspots).",
  "tl.w-lightning": "Lightning", "tl.w-lightning.u": "lightning flashes per km² per year", "tl.w-lightning.d": "Average lightning flashes per km² per year, counted from orbit by NASA's Lightning Imaging Sensor (TRMM satellite, 1998–2013), between 38° north and 38° south.",
  "tl.w-cyclone": "Tropical storms", "tl.w-cyclone.d": "The track of every tropical storm from 1981 to 2024 (NOAA IBTrACS): where the lines pile up is where storms usually pass.",
  "tl.w-tornado": "Tornadoes", "tl.w-tornado.d": "Tornadoes rated EF1 or stronger from 1981 to 2024: the darker the area, the more tornadoes started nearby. NOAA Storm Prediction Center; United States only.", "tl.w-tornado.leg": "few|many",
  "tl.w-quake": "Earthquakes", "tl.w-quake.d": "Earthquakes of magnitude 5 or more since 1981 within 800 km of the centre of the map (USGS catalogue). Bigger circle, stronger earthquake.", "tl.w-quake.leg": "magnitude",
  "tl.k.ts": "tropical storm", "tl.k.hu": "hurricane or typhoon", "tl.k.mh": "major (178 km/h or more)",
  "tl.lc.forest": "forest", "tl.lc.savanna": "savanna and shrubs", "tl.lc.grass": "grassland", "tl.lc.crop": "cropland", "tl.lc.urban": "city", "tl.lc.wet": "wetland", "tl.lc.water": "water", "tl.lc.bare": "bare ground",
});
I18N.add("es", {
  "tl.open": "Mapas en movimiento", "tl.what": "¿Qué estoy viendo?", "tl.play": "Reproducir", "tl.pause": "Pausar", "tl.py": "Paraguay", "tl.here": "Mi dirección", "tl.close": "Cerrar", "tl.src": "NASA GIBS · mapa base © colaboradores de OpenStreetMap", "tl.more": "Otros mapas", "tl.go": "Verlo en el mapa en movimiento", "tl.where": "Ver en el mapa dónde ocurre",
  "tl.g.time": "A lo largo del tiempo", "tl.g.where": "Dónde suele ocurrir", "tl.center": "Centro del mapa", "tl.nodata": "sin datos",
  "tl.rain": "Lluvia", "tl.rain.u": "mm de lluvia en el mes", "tl.rain.d": "Lluvia total de cada mes de 2025. Vea llegar y salir la temporada de lluvias. NASA MERRA-2, corregido con pluviómetros y satélites; celdas de unos 50 km, suavizadas para mostrar.",
  "tl.heat": "Calor del suelo", "tl.heat.u": "°C en la superficie, de día", "tl.heat.d": "Temperatura de la superficie del suelo de día en cada mes de 2025, medida por el instrumento MODIS del satélite Terra de la NASA. Es el calor del suelo, mayor que la temperatura del aire.",
  "tl.smoke": "Humo y polvo", "tl.smoke.u": "humo y polvo en el aire (espesor óptico)", "tl.smoke.d": "Cuánto humo, polvo y bruma tiene el aire en cada mes de 2024 (espesor óptico de aerosoles, NASA MERRA-2). En Sudamérica llega al máximo en la temporada de quemas, de agosto a octubre.",
  "tl.green": "Vegetación", "tl.green.u": "índice de vegetación (0 suelo desnudo, 1 verde denso)", "tl.green.d": "Índice de vegetación (NDVI) en cada mes de 2024, de MODIS en el satélite Terra de la NASA. Más verde significa más plantas vivas: sigue la lluvia, la sequía y la cosecha.",
  "tl.land": "Uso de la tierra", "tl.land.u": "cobertura de la tierra de cada año", "tl.land.d": "Cobertura de la tierra clasificada cada año de 2001 a 2024 con MODIS (NASA), agrupada aquí en seis tipos. Vea cómo el bosque y la sabana dan paso a los cultivos. La pérdida de hábitat es la principal causa de pérdida de especies.",
  "tl.lightning": "Rayos", "tl.lightning.u": "rayos por km² en el mes", "tl.lightning.d": "Promedio de rayos de cada mes del año, contados desde la órbita por el sensor LIS de la NASA en el satélite TRMM entre 1998 y 2013. El sensor veía solo la franja entre 38° norte y 38° sur.",
  "tl.storms": "Temporada de tormentas", "tl.storms.u": "tormentas que pasaron a unos 150 km, 1981–2024", "tl.storms.d": "La trayectoria de cada tormenta tropical de 1981 a 2024, mostrada en el mes en que se formó (NOAA IBTrACS). Vea abrir y cerrar la temporada en cada océano.",
  "tl.dengue": "Dengue en Paraguay", "tl.dengue.u": "casos notificados por 100.000 habitantes en el mes", "tl.dengue.d": "Casos notificados de dengue (sospechosos, probables y confirmados) en cada departamento del Paraguay, mes a mes de 2019 a 2023; el gráfico es el total nacional. Transcrito de los boletines semanales de la Dirección General de Vigilancia de la Salud (DGVS) en un conjunto de datos abierto (Care99, Zenodo): sirve para tamaño y momento, no para comparaciones finas.", "tl.dengue.v": "Paraguay: {n} casos · más afectado: {d}",
  "tl.w-flood": "Inundaciones", "tl.w-flood.d": "Con qué frecuencia las grandes inundaciones afectaron cada zona entre 1985 y 2003, en diez clases (NASA SEDAC, Natural Disaster Hotspots). Un análisis global más antiguo: muestra el patrón general, no su calle.",
  "tl.w-drought": "Sequía", "tl.w-drought.d": "Con qué frecuencia la sequía afectó cada zona entre 1980 y 2000, en diez clases (NASA SEDAC, Natural Disaster Hotspots). Un análisis global más antiguo.",
  "tl.w-landslide": "Deslizamientos", "tl.w-landslide.d": "Peligro de deslizamientos y avalanchas estimado con pendiente, suelo, lluvia y terremotos (NASA SEDAC, Natural Disaster Hotspots, 2000). Un análisis general, no un mapa oficial de riesgo.",
  "tl.w-volcano": "Volcanes", "tl.w-volcano.d": "Dónde hubo volcanes activos entre 1979 y 2000 (NASA SEDAC, Natural Disaster Hotspots).",
  "tl.w-lightning": "Rayos", "tl.w-lightning.u": "rayos por km² por año", "tl.w-lightning.d": "Promedio de rayos por km² por año, contados desde la órbita por el sensor LIS de la NASA (satélite TRMM, 1998–2013), entre 38° norte y 38° sur.",
  "tl.w-cyclone": "Tormentas tropicales", "tl.w-cyclone.d": "La trayectoria de cada tormenta tropical de 1981 a 2024 (NOAA IBTrACS): donde las líneas se amontonan es por donde suelen pasar las tormentas.",
  "tl.w-tornado": "Tornados", "tl.w-tornado.d": "Tornados de categoría EF1 o más de 1981 a 2024: cuanto más oscura la zona, más tornados comenzaron cerca. NOAA Storm Prediction Center; solo Estados Unidos.", "tl.w-tornado.leg": "pocos|muchos",
  "tl.w-quake": "Terremotos", "tl.w-quake.d": "Terremotos de magnitud 5 o más desde 1981 a menos de 800 km del centro del mapa (catálogo del USGS). Círculo más grande, terremoto más fuerte.", "tl.w-quake.leg": "magnitud",
  "tl.k.ts": "tormenta tropical", "tl.k.hu": "huracán o tifón", "tl.k.mh": "mayor (178 km/h o más)",
  "tl.lc.forest": "bosque", "tl.lc.savanna": "sabana y arbustos", "tl.lc.grass": "pastizal", "tl.lc.crop": "cultivos", "tl.lc.urban": "ciudad", "tl.lc.wet": "humedal", "tl.lc.water": "agua", "tl.lc.bare": "suelo desnudo",
});
I18N.add("pt", {
  "tl.open": "Mapa em movimento", "tl.what": "O que estou vendo?", "tl.play": "Tocar", "tl.pause": "Pausar", "tl.py": "Paraguai", "tl.here": "Meu endereço", "tl.close": "Fechar", "tl.src": "NASA GIBS · mapa base © colaboradores do OpenStreetMap", "tl.more": "Outros mapas", "tl.go": "Ver no mapa em movimento", "tl.where": "Ver no mapa onde acontece",
  "tl.g.time": "Ao longo do tempo", "tl.g.where": "Onde costuma acontecer", "tl.center": "Centro do mapa", "tl.nodata": "sem dado",
  "tl.rain": "Chuva", "tl.rain.u": "mm de chuva no mês", "tl.rain.d": "Chuva total de cada mês de 2025. Veja a estação chuvosa chegar e ir embora. NASA MERRA-2, corrigido com pluviômetros e satélites; células de uns 50 km, suavizadas para exibir.",
  "tl.heat": "Calor do solo", "tl.heat.u": "°C na superfície, de dia", "tl.heat.d": "Temperatura da superfície do solo de dia em cada mês de 2025, medida pelo instrumento MODIS do satélite Terra da NASA. É o calor do chão, maior do que a temperatura do ar.",
  "tl.smoke": "Fumaça e poeira", "tl.smoke.u": "fumaça e poeira no ar (espessura óptica)", "tl.smoke.d": "Quanta fumaça, poeira e névoa o ar carrega em cada mês de 2024 (espessura óptica de aerossóis, NASA MERRA-2). Na América do Sul o pico é na temporada de queimadas, de agosto a outubro.",
  "tl.green": "Vegetação", "tl.green.u": "índice de vegetação (0 solo nu, 1 verde denso)", "tl.green.d": "Índice de vegetação (NDVI) em cada mês de 2024, do MODIS no satélite Terra da NASA. Mais verde significa mais planta viva: acompanha a chuva, a seca e a colheita.",
  "tl.land": "Uso da terra", "tl.land.u": "cobertura da terra de cada ano", "tl.land.d": "Cobertura da terra classificada a cada ano de 2001 a 2024 com o MODIS (NASA), agrupada aqui em seis tipos. Veja floresta e cerrado darem lugar à lavoura. A perda de habitat é a principal causa de perda de espécies.",
  "tl.lightning": "Raios", "tl.lightning.u": "raios por km² no mês", "tl.lightning.d": "Média de raios de cada mês do ano, contados da órbita pelo sensor LIS da NASA no satélite TRMM entre 1998 e 2013. O sensor enxergava só a faixa entre 38° norte e 38° sul.",
  "tl.storms": "Temporada de tempestades", "tl.storms.u": "tempestades que passaram a cerca de 150 km, 1981–2024", "tl.storms.d": "A trajetória de cada tempestade tropical de 1981 a 2024, mostrada no mês em que se formou (NOAA IBTrACS). Veja a temporada abrir e fechar em cada oceano.",
  "tl.dengue": "Dengue no Paraguai", "tl.dengue.u": "casos notificados por 100 mil habitantes no mês", "tl.dengue.d": "Casos notificados de dengue (suspeitos, prováveis e confirmados) em cada departamento do Paraguai, mês a mês de 2019 a 2023; o gráfico é o total nacional. Transcrito dos boletins semanais da vigilância em saúde do Paraguai (DGVS) num conjunto de dados aberto (Care99, Zenodo): serve para tamanho e momento, não para comparações finas.", "tl.dengue.v": "Paraguai: {n} casos · mais afetado: {d}",
  "tl.w-flood": "Enchentes", "tl.w-flood.d": "Com que frequência grandes enchentes atingiram cada área entre 1985 e 2003, em dez classes (NASA SEDAC, Natural Disaster Hotspots). Uma triagem global mais antiga: mostra o padrão geral, não a sua rua.",
  "tl.w-drought": "Seca", "tl.w-drought.d": "Com que frequência a seca atingiu cada área entre 1980 e 2000, em dez classes (NASA SEDAC, Natural Disaster Hotspots). Uma triagem global mais antiga.",
  "tl.w-landslide": "Deslizamentos", "tl.w-landslide.d": "Perigo de deslizamentos e avalanches estimado com inclinação, solo, chuva e terremotos (NASA SEDAC, Natural Disaster Hotspots, 2000). Uma triagem, não um mapa oficial de risco.",
  "tl.w-volcano": "Vulcões", "tl.w-volcano.d": "Onde houve vulcões ativos entre 1979 e 2000 (NASA SEDAC, Natural Disaster Hotspots).",
  "tl.w-lightning": "Raios", "tl.w-lightning.u": "raios por km² por ano", "tl.w-lightning.d": "Média de raios por km² por ano, contados da órbita pelo sensor LIS da NASA (satélite TRMM, 1998–2013), entre 38° norte e 38° sul.",
  "tl.w-cyclone": "Tempestades tropicais", "tl.w-cyclone.d": "A trajetória de cada tempestade tropical de 1981 a 2024 (NOAA IBTrACS): onde as linhas se amontoam é por onde as tempestades costumam passar.",
  "tl.w-tornado": "Tornados", "tl.w-tornado.d": "Tornados de categoria EF1 ou mais de 1981 a 2024: quanto mais escura a área, mais tornados começaram por perto. NOAA Storm Prediction Center; só Estados Unidos.", "tl.w-tornado.leg": "poucos|muitos",
  "tl.w-quake": "Terremotos", "tl.w-quake.d": "Terremotos de magnitude 5 ou mais desde 1981 a até 800 km do centro do mapa (catálogo do USGS). Círculo maior, terremoto mais forte.", "tl.w-quake.leg": "magnitude",
  "tl.k.ts": "tempestade tropical", "tl.k.hu": "furacão ou tufão", "tl.k.mh": "grande (178 km/h ou mais)",
  "tl.lc.forest": "floresta", "tl.lc.savanna": "cerrado e arbustos", "tl.lc.grass": "campo", "tl.lc.crop": "lavoura", "tl.lc.urban": "cidade", "tl.lc.wet": "área úmida", "tl.lc.water": "água", "tl.lc.bare": "solo nu",
});

const Timelapse = (() => {
  const G = "https://gibs.earthdata.nasa.gov", PY = [[-27.7, -62.8], [-19.2, -54.1]], L6 = "GoogleMapsCompatible_Level6", L7 = "GoogleMapsCompatible_Level7";
  const months = (y) => Array.from({ length: 12 }, (_, m) => `${y}-${String(m + 1).padStart(2, "0")}-01`);
  const years = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => `${a + i}-01-01`);
  const tt = (k, v) => I18N.t(k, v), nf = (v, d = 0) => (Number.isFinite(v) ? v.toLocaleString(I18N.locale(), { minimumFractionDigits: d, maximumFractionDigits: d }) : "–");
  const safe = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const files = {}, load = (f) => (files[f] ||= fetch(f).then((x) => x.json()));

  /* ---------- colour tables of the NASA layers: colour -> value (or class name) ---------- */
  const luts = {};
  const lut = (name) => (luts[name] ||= fetch(`${G}/colormaps/v1.0/${name}.xml`).then((x) => x.text()).then((x) => {
    const m = new Map();
    for (const e of x.matchAll(/<ColorMapEntry rgb="(\d+),(\d+),(\d+)"([^>]*)>/g)) {
      if (/transparent="true"/.test(e[4])) continue;
      const key = (+e[1] << 16) | (+e[2] << 8) | +e[3]; if (m.has(key)) continue;
      const v = e[4].match(/value="[\[(]([^,\])]+),([^\])]+)[\])]"/), lab = e[4].match(/label="([^"]*)"/);
      if (v) { const a = /INF/.test(v[1]) ? null : +v[1], b = /INF/.test(v[2]) ? null : +v[2]; m.set(key, a == null ? b : b == null ? a : (a + b) / 2); } else m.set(key, lab ? lab[1] : "");
    }
    return m;
  }));
  // colour scale: [value, r, g, b, alpha 0-255] stops, linear in between
  const ramp = (st) => (v) => {
    if (!(v > st[0][0])) return st[0].slice(1);
    for (let i = 1; i < st.length; i++) if (v <= st[i][0]) { const a = st[i - 1], b = st[i], f = (v - a[0]) / (b[0] - a[0]); return [1, 2, 3, 4].map((k) => Math.round(a[k] + (b[k] - a[k]) * f)); }
    return st[st.length - 1].slice(1);
  };
  const LC = { forest: [26, 110, 56, 240], savanna: [158, 176, 92, 225], grass: [232, 218, 160, 215], crop: [214, 118, 40, 240], urban: [72, 60, 72, 245], wet: [70, 160, 160, 230], water: [128, 184, 222, 190], bare: [205, 200, 190, 190] };
  const lcGroup = (lab) => (/Forest/.test(lab) ? "forest" : /Savanna|Shrub/.test(lab) ? "savanna" : /Grass/.test(lab) ? "grass" : /Crop/.test(lab) ? "crop" : /Urban/.test(lab) ? "urban" : /Wetland/.test(lab) ? "wet" : /Water/.test(lab) ? "water" : /Barren|Snow/.test(lab) ? "bare" : "");

  /* ---------- a tile layer that repaints NASA tiles with our own scale ---------- */
  const DataLayer = L.GridLayer.extend({
    createTile(coords, done) {
      const c = L.DomUtil.create("canvas", "leaflet-tile"); c.width = c.height = 256;
      const th = this.options.theme, table = this.options.table, cache = (th._cols ||= new Map()), im = new Image(); im.crossOrigin = "anonymous";
      im.onload = () => {
        try {
          const g = c.getContext("2d", { willReadFrequently: true }); g.drawImage(im, 0, 0, 256, 256);
          const d = g.getImageData(0, 0, 256, 256), p = d.data;
          for (let i = 0; i < p.length; i += 4) {
            if (p[i + 3] < 128) { p[i + 3] = 0; continue; }
            const key = (p[i] << 16) | (p[i + 1] << 8) | p[i + 2]; let col = cache.get(key);
            if (!col) { const v = table.get(key); col = v === undefined ? [0, 0, 0, 0] : th.cat ? LC[lcGroup(v)] || [0, 0, 0, 0] : th.paint(th.conv ? th.conv(v) : v); cache.set(key, col); }
            p[i] = col[0]; p[i + 1] = col[1]; p[i + 2] = col[2]; p[i + 3] = col[3];
          }
          g.putImageData(d, 0, 0);
        } catch (_) { /* leave the tile empty */ }
        done(null, c);
      };
      im.onerror = () => done(null, c);
      im.src = `${G}/wmts/epsg3857/best/${th.layer}/default/${this.options.time ? this.options.time + "/" : ""}${th.set}/${coords.z}/${coords.y}/${coords.x}.png`;
      return c;
    },
  });
  // Leaflet throws if a tile finishes loading after its layer left the map: ignore those late tiles
  const guard = (lay) => { const f = lay._tileReady; lay._tileReady = function (...a) { if (this._map) f.apply(this, a); }; return lay; };

  /* ---------- value at one point for every frame, read from the same tiles ---------- */
  async function sample(th, lat, lon) {
    const table = await lut(th.cm), z = Math.min(6, th.z), n = 2 ** z, rad = (Math.max(-84, Math.min(84, lat)) * Math.PI) / 180;
    const xf = ((lon + 180) / 360) * n, yf = ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * n, tx = Math.floor(xf), ty = Math.floor(yf), px = Math.floor((xf - tx) * 256), py = Math.floor((yf - ty) * 256);
    const one = (time) => new Promise((res) => {
      const im = new Image(); im.crossOrigin = "anonymous";
      im.onload = () => { try { const c = document.createElement("canvas"); c.width = c.height = 256; const g = c.getContext("2d", { willReadFrequently: true }); g.drawImage(im, 0, 0); const d = g.getImageData(px, py, 1, 1).data; res(d[3] < 128 ? null : table.get((d[0] << 16) | (d[1] << 8) | d[2])); } catch (_) { res(undefined); } };
      im.onerror = () => res(undefined);
      im.src = `${G}/wmts/epsg3857/best/${th.layer}/default/${time ? time + "/" : ""}${th.set}/${z}/${ty}/${tx}.png`;
    });
    const raw = await Promise.all(th.frames.map(one));
    return raw.map((v) => (th.cat ? (typeof v === "string" ? lcGroup(v) : "") : v === null ? (th.zero ? 0 : NaN) : v === undefined ? NaN : th.conv ? th.conv(v) : v));
  }

  /* ---------- themes: zmax is the closest zoom at which the data still reads well ---------- */
  const data = (o) => ({ g: "time", kind: "month", z: 6, set: L6, op: 1, zmax: 7, paint: ramp(o.stops), ...o });
  const still = (id, layer) => ({ id, g: "where", layer, set: L7, z: 7, zmax: 6, frames: [""], kind: "still", legend: layer, op: 0.85 });
  const LIGHT = [[0.05, 255, 237, 160, 0], [0.4, 254, 217, 118, 190], [1.5, 253, 141, 60, 228], [4, 227, 26, 28, 242], [9, 122, 1, 119, 250]];
  const windCol = (w) => (w >= 96 ? "#b2592a" : w >= 64 ? "#1f5f8b" : "#74a9cf");
  let RD = null; const canvas = () => (RD ||= L.canvas({ padding: 0.3 }));
  // storm tracks: every storm as a line, split where it crosses the date line
  async function tracks(g, month, opacity) {
    const J = await load("data/tracks.json");
    for (const [m, w, f] of J.storms) {
      if (month && m !== month) continue;
      let seg = [];
      const flush = () => { if (seg.length > 1) L.polyline(seg, { renderer: canvas(), color: windCol(w), weight: w >= 96 ? 1.9 : w >= 64 ? 1.4 : 1, opacity, interactive: false }).addTo(g); seg = []; };
      for (let i = 0; i < f.length; i += 2) { const p = [f[i] / 10, f[i + 1] / 10]; if (seg.length && Math.abs(p[1] - seg[seg.length - 1][1]) > 180) flush(); seg.push(p); }
      flush();
    }
  }
  const trackLeg = () => `<div class="tl-leg wrap">${[[40, "tl.k.ts"], [70, "tl.k.hu"], [100, "tl.k.mh"]].map(([w, k]) => `<span><i class="ln" style="background:${windCol(w)}"></i>${tt(k)}</span>`).join("")}</div>`;
  const DENGUE = [[0, "#f4ede4"], [20, "#f6d3b8"], [100, "#eba97c"], [500, "#d9793f"], [2000, "#b2592a"], [Infinity, "#6e2f12"]];
  const dCol = (r) => (r <= 0 ? DENGUE[0][1] : DENGUE.find(([lim]) => r < lim)[1]);
  const THEMES = [
    data({ id: "rain", layer: "MERRA2_Precipitation_Bias_Corrected_Monthly", cm: "MERRA2_Precipitation_Bias_Corrected_Monthly", frames: months(2025), conv: (v) => v * 86400 * 30.4, cell: 0.56, zmax: 5, ticks: [0, 100, 200, 350, 550], unit: "mm",
      stops: [[5, 198, 219, 239, 0], [30, 158, 202, 225, 150], [100, 66, 146, 198, 215], [200, 8, 81, 156, 236], [350, 8, 48, 107, 246], [550, 63, 0, 125, 250]] }),
    data({ id: "heat", layer: "MODIS_Terra_L3_Land_Surface_Temp_Monthly_Day", cm: "MODIS_Land_Surface_Temp", frames: months(2025), conv: (v) => v - 273.15, zmax: 6, ticks: [10, 20, 30, 40], unit: "°C",
      stops: [[5, 49, 54, 149, 225], [15, 116, 173, 209, 225], [23, 224, 243, 248, 215], [29, 254, 224, 144, 228], [35, 244, 109, 67, 238], [43, 165, 0, 38, 246]] }),
    data({ id: "smoke", layer: "MERRA2_Total_Aerosol_Optical_Thickness_550nm_Extinction_Monthly", cm: "MERRA2_Total_Aerosol_Optical_Thickness_550nm_Extinction_Monthly", frames: months(2024), cell: 0.56, zmax: 5, ticks: [0.1, 0.3, 0.5, 0.8], unit: "", dec: 2,
      stops: [[0.07, 254, 227, 145, 0], [0.16, 254, 196, 79, 175], [0.3, 254, 153, 41, 220], [0.5, 204, 76, 2, 238], [0.8, 102, 37, 6, 248]] }),
    data({ id: "green", layer: "MODIS_Terra_L3_NDVI_Monthly", cm: "MODIS_L3_NDVI", set: L7, z: 7, frames: months(2024), ticks: [0.2, 0.5, 0.8], unit: "", dec: 2,
      stops: [[0.05, 166, 97, 26, 205], [0.25, 223, 194, 125, 205], [0.45, 217, 239, 139, 212], [0.65, 102, 189, 99, 228], [0.85, 26, 152, 80, 238], [0.95, 0, 68, 27, 242]] }),
    data({ id: "lightning", layer: "LIS_Very_High_Resolution_Lightning_Monthly_Climatology_LIS_Mean_Flash_Rate", cm: "LIS_Very_High_Resolution_Lightning_Monthly_Climatology_LIS_Mean_Flash_Rate", frames: months(2013), kind: "clim", conv: (v) => v * 30.4, cell: 0.1, zmax: 6, zero: true, ticks: [0.5, 2, 5, 9], unit: "", dec: 1, stops: LIGHT }),
    { id: "storms", g: "time", frames: months(2013), kind: "clim", wait: 900, zmax: 5, unit: "", legendHtml: trackLeg,
      draw: (i, g) => tracks(g, i + 1, 0.55),
      series: async (lat, lon) => { const J = await load("data/cyclones.json"), c = J.cells[`${Math.round(lat)},${Math.round(lon)}`]; return c && c[3] ? c[3] : Array(12).fill(0); } },
    { id: "land", g: "time", layer: "MODIS_Combined_L3_IGBP_Land_Cover_Type_Annual", cm: "MODIS_IGBP_Land_Cover_Type", set: "GoogleMapsCompatible_Level8", z: 8, zmax: 8, frames: years(2001, 2024), kind: "year", cat: true, op: 1, wait: 800,
      legendHtml: () => `<div class="tl-leg wrap">${["forest", "savanna", "grass", "crop", "urban", "water"].map((k) => `<span><i class="sq" style="background:rgb(${LC[k].slice(0, 3)})"></i>${tt("tl.lc." + k)}</span>`).join("")}</div>` },
    { id: "dengue", g: "time", frames: [], kind: "custom", wait: 480, keep: true, zmax: 7, bounds: PY, unit: "",
      legendHtml: () => `<div class="tl-leg wrap">${DENGUE.slice(1).map(([lim, c], i) => `<span><i class="sq" style="background:${c}"></i>${lim === Infinity ? "≥ " + nf(DENGUE[i][0]) : (i ? nf(DENGUE[i][0]) + "–" : "< ") + nf(lim)}</span>`).join("")}</div>` },
    still("w-flood", "NDH_Flood_Hazard_Frequency_Distribution_1985-2003"),
    still("w-drought", "NDH_Drought_Hazard_Frequency_Distribution_1980-2000"),
    still("w-landslide", "NDH_Landslide_Hazard_Distribution_2000"),
    data({ id: "w-lightning", g: "where", kind: "still", layer: "LIS_Very_High_Resolution_Lightning_Full_Climatology_LIS_Mean_Flash_Rate", cm: "LIS_Very_High_Resolution_Lightning_Full_Climatology_LIS_Mean_Flash_Rate", frames: ["1998-01-01"], cell: 0.1, zmax: 6, zero: true, ticks: [5, 20, 50, 100], unit: "", dec: 0,
      stops: [[0.5, 255, 237, 160, 0], [4, 254, 217, 118, 190], [15, 253, 141, 60, 228], [40, 227, 26, 28, 242], [100, 122, 1, 119, 250]] }),
    { id: "w-cyclone", g: "where", frames: [""], kind: "still", zmax: 5, draw: (i, g) => tracks(g, 0, 0.22), legendHtml: trackLeg },
    { id: "w-tornado", g: "where", frames: [""], kind: "still", zmax: 6, bounds: [[25, -105], [48, -75]],
      draw: async (_, g, soft) => {
        const J = await load("data/tornadoes.json"), rd = L.canvas({ pane: "tlSoft" });
        for (const k in J.cells) { const [la, lo] = k.split(",").map(Number), v = J.cells[k][0].reduce((a, b) => a + b, 0) / 4.4; if (v > 0) L.rectangle([[la - 0.5, lo - 0.5], [la + 0.5, lo + 0.5]], { renderer: rd, pane: "tlSoft", stroke: false, fillColor: "#5b2a86", fillOpacity: Math.min(0.9, 0.08 + v / 110), interactive: false }).addTo(soft); }
      },
      legendHtml: () => { const [a, b] = tt("tl.w-tornado.leg").split("|"); return `<div class="tl-scale"><span class="tl-grad" style="background:linear-gradient(90deg,rgba(91,42,134,.08),rgba(91,42,134,.9))"></span><div class="tl-ticks"><span>${a}</span><span>${b}</span></div></div>`; } },
    { id: "w-quake", g: "where", frames: [""], kind: "still", zmax: 6,
      draw: async (_, g) => {
        const c = map.getCenter();
        const j = await (await fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&latitude=${c.lat.toFixed(2)}&longitude=${c.lng.toFixed(2)}&maxradiuskm=800&starttime=1981-01-01&minmagnitude=5&orderby=magnitude&limit=3000`)).json();
        for (const f of j.features.reverse()) { const [lo, la] = f.geometry.coordinates, m = f.properties.mag; L.circleMarker([la, lo], { renderer: canvas(), radius: 2 + (m - 5) * 4, color: "#b2592a", weight: 1, fillColor: "#b2592a", fillOpacity: 0.35 }).bindTooltip(`M ${m.toFixed(1)} · ${new Date(f.properties.time).getFullYear()}`).addTo(g); }
      },
      legendHtml: () => `<div class="tl-leg">${[5, 6, 7, 8].map((m) => `<i style="width:${2 * (2 + (m - 5) * 4)}px;height:${2 * (2 + (m - 5) * 4)}px"></i>${m}`).join(" ")} · ${tt("tl.w-quake.leg")}</div>` },
    still("w-volcano", "NDH_Volcano_Hazard_Frequency_Distribution_1979-2000"),
  ];
  const byId = (id) => THEMES.find((x) => x.id === id);

  /* ---------- dengue by department: painted map, national curve as the timeline ---------- */
  Promise.all([fetch("data/paraguay.json").then((x) => x.json()), fetch("data/paraguay_geo.json").then((x) => x.json())]).then(([D, GEO]) => {
    const th = byId("dengue"), keys = Object.keys(D.monthly).sort(), polys = {};
    th.frames = keys; th.ready = true;
    th.label = (i) => new Date(keys[i] + "-15T12:00").toLocaleDateString(I18N.locale(), { month: "long", year: "numeric" });
    th.series = async () => keys.map((k) => Object.values(D.monthly[k]).reduce((a, b) => a + b, 0));
    th.value = (i) => { const m = D.monthly[keys[i]], top = D.departments.reduce((a, d) => ((m[d.id] || 0) > (m[a.id] || 0) ? d : a)); return tt("tl.dengue.v", { n: nf(Object.values(m).reduce((a, b) => a + b, 0)), d: `${safe(top.name)} (${nf(m[top.id] || 0)})` }); };
    th.draw = (i, g) => {
      const m = D.monthly[keys[i]];
      if (!g.getLayers().length) for (const d of D.departments) polys[d.id] = L.polygon(GEO.departments[d.id] || [], { color: "#fff", weight: 1, fillOpacity: 0.86 }).addTo(g);
      for (const d of D.departments) { const c = m[d.id] || 0, rate = d.pop ? (c / d.pop) * 1e5 : 0; polys[d.id].setStyle({ fillColor: dCol(rate) }); polys[d.id].bindTooltip(`<b>${safe(d.name)}</b><br>${nf(c)} · ${nf(rate)} / 100.000`); }
    };
    paint();
  }).catch(() => { const i = THEMES.findIndex((x) => x.id === "dengue"); if (i >= 0) THEMES.splice(i, 1); });

  /* ---------- state and drawing ---------- */
  // frame an area in the part of the map that the panel leaves free
  const frame = (b, zmax = 8) => {
    map.invalidateSize(); const w = map.getSize().x, left = open && w > 620 ? 350 : 10;
    map.fitBounds(b, { paddingTopLeft: [left, 20], paddingBottomRight: [10, w > 620 ? 30 : 10], maxZoom: zmax, animate: false });
    if (map.getZoom() < 3) map.setZoom(4);
  };
  let box, stamp, cur = null, shown = null, pre = null, timer = null, idx = 0, playing = false, token = 0, open = false, pick = false, base = null, labels = null, ser = null;
  const vec = L.layerGroup(), soft = L.layerGroup();
  const here = () => (typeof state !== "undefined" && state.main ? { lat: state.main.lat, lon: state.main.lon, name: String(state.main.label).split(",")[0] } : { lat: map.getCenter().lat, lon: map.getCenter().lng, name: tt("tl.center") });

  function label() {
    const f = cur.frames[idx];
    if (cur.kind === "year") return f.slice(0, 4);
    if (cur.kind === "month") return new Date(f + "T12:00").toLocaleDateString(I18N.locale(), { month: "long", year: "numeric" });
    if (cur.kind === "clim") return new Date(f + "T12:00").toLocaleDateString(I18N.locale(), { month: "long" });
    return cur.label ? cur.label(idx) : "";
  }
  const name = (th) => tt("tl." + th.id);
  // the chart is the timeline: one bar per frame with the value at the address, the current one in colour
  function chart() {
    if (!cur || cur.frames.length < 2) return "";
    const n = cur.frames.length, v = ser && ser.id === cur.id ? ser.vals : null;
    if (cur.cat) return `<div class="tl-chart cat">${cur.frames.map((_, i) => `<i data-f="${i}" class="${i === idx ? "on" : ""}" style="background:${v && LC[v[i]] ? `rgb(${LC[v[i]].slice(0, 3)})` : "#e3e7e5"}"></i>`).join("")}</div>`;
    const fin = v ? v.filter(Number.isFinite) : [], mx = Math.max(...fin, 1e-9), mn = cur.id === "heat" && fin.length ? Math.min(...fin) - 4 : 0;
    return `<div class="tl-chart ${n > 30 ? "dense" : ""}">${cur.frames.map((_, i) => `<i data-f="${i}" class="${i === idx ? "on" : ""}" style="height:${v && Number.isFinite(v[i]) ? Math.max(6, ((v[i] - mn) / (mx - mn || 1)) * 100).toFixed(0) : 6}%"></i>`).join("")}</div>`;
  }
  function valueLine() {
    if (!cur) return "";
    if (cur.value) return cur.value(idx);
    const v = ser && ser.id === cur.id && ser.vals ? ser.vals[cur.frames.length > 1 ? idx : 0] : undefined, p = here();
    if (v === undefined) return "";
    const txt = cur.cat ? (v ? tt("tl.lc." + v) : tt("tl.nodata")) : Number.isFinite(v) ? `${nf(v, cur.dec || 0)}${cur.unit ? " " + cur.unit : ""}` : tt("tl.nodata");
    return `${safe(p.name)}: <b>${txt}</b>`;
  }
  function legend() {
    if (!cur) return "";
    if (cur.legendHtml) return cur.legendHtml();
    if (cur.stops) {
      const t0 = cur.ticks[0], t1 = cur.ticks[cur.ticks.length - 1], pos = (v) => Math.max(0, Math.min(100, ((v - t0) / (t1 - t0)) * 100));
      const grad = Array.from({ length: 21 }, (_, k) => { const c = cur.paint(t0 + ((t1 - t0) * k) / 20); return `rgba(${c[0]},${c[1]},${c[2]},${Math.max(0.12, c[3] / 255).toFixed(2)}) ${k * 5}%`; }).join(",");
      return `<div class="tl-scale"><span class="tl-grad" style="background:linear-gradient(90deg,${grad})"></span><div class="tl-ticks rel">${cur.ticks.map((v, i) => `<span style="left:${pos(v)}%">${nf(v, v < 1 ? (cur.dec ? 1 : 0) : 0)}${i === cur.ticks.length - 1 ? "+" : ""}</span>`).join("")}</div></div>`;
    }
    return cur.legend ? `<img class="tl-legend" alt="" loading="lazy" src="${G}/legends/${cur.legend}_H.svg">` : "";
  }
  const stampHtml = () => `<b>${name(cur)}</b>${label() ? `<span>${label()}</span>` : ""}`;
  function paint() {
    if (!box) return;
    box.querySelector(".tl-toggle").innerHTML = ICON("play") + " " + tt("tl.open");
    const p = box.querySelector(".tl-panel"); p.hidden = !open;
    if (document.body.classList.contains("tl-open") !== open) { document.body.classList.toggle("tl-open", open); setTimeout(() => map.invalidateSize(), 60); }
    if (stamp) stamp.hidden = !(open && cur);
    if (!open) return;
    const chips = (g) => THEMES.filter((th) => (th.g || "time") === g && (th.id !== "dengue" || th.ready)).map((th) => `<button type="button" data-th="${th.id}" class="${cur === th ? "on" : ""}">${name(th)}</button>`).join("");
    const unit = cur ? tt("tl." + cur.id + ".u") : "";
    p.innerHTML = (cur && !pick ? `<button type="button" class="tl-more">${tt("tl.more")}</button>` : `<p class="tl-h">${tt("tl.g.time")}</p><div class="tl-themes">${chips("time")}</div><p class="tl-h">${tt("tl.g.where")}</p><div class="tl-themes">${chips("where")}</div>`) +
      (cur ? `<div class="tl-now"><div class="tl-title">${cur.frames.length > 1 ? `<button type="button" class="tl-play" aria-label="${tt(playing ? "tl.pause" : "tl.play")}">${ICON(playing ? "pause" : "play")}</button>` : ""}<div><b class="tl-name">${name(cur)}</b><span class="tl-label">${label()}</span></div></div>
        ${chart()}<p class="tl-val">${valueLine()}</p>${legend()}${cur && unit !== "tl." + cur.id + ".u" ? `<p class="tl-unit">${unit}</p>` : ""}
        <details class="tl-what" ${cur.kind === "still" ? "open" : ""}><summary>${tt("tl.what")}</summary><p>${tt("tl." + cur.id + ".d")}</p></details></div>` : "") +
      `<div class="tl-row tl-foot"><button type="button" class="tl-py">${tt("tl.py")}</button>${typeof state !== "undefined" && state.main ? `<button type="button" class="tl-here">${tt("tl.here")}</button>` : ""}<span class="tl-src">${tt("tl.src")}</span><button type="button" class="tl-close">${tt("tl.close")}</button></div>`;
    p.querySelectorAll("[data-th]").forEach((b) => (b.onclick = () => { pick = false; start(byId(b.dataset.th)); }));
    const mb = p.querySelector(".tl-more"); if (mb) mb.onclick = () => { pick = true; paint(); };
    p.querySelectorAll(".tl-chart i").forEach((b) => (b.onclick = () => { playing = false; clearTimeout(timer); show(+b.dataset.f); paint(); }));
    const pl = p.querySelector(".tl-play"); if (pl) pl.onclick = () => { playing = !playing; clearTimeout(timer); if (playing) show((idx + 1) % cur.frames.length); else paint(); };
    p.querySelector(".tl-py").onclick = () => { frame(PY, cur ? cur.zmax : 6); redraw(); };
    const hb = p.querySelector(".tl-here"); if (hb) hb.onclick = () => { map.setView([state.main.lat, state.main.lon], Math.min(6, cur ? cur.zmax : 6)); redraw(); };
    p.querySelector(".tl-close").onclick = () => { stop(); open = false; paint(); };
    if (stamp && cur) stamp.innerHTML = stampHtml();
    series();
  }
  // read the values at the address once per theme and place; then the chart fills in
  function series() {
    if (!cur || !(cur.cm || cur.series)) return;
    const p = here(), key = `${cur.id}:${p.lat.toFixed(2)}:${p.lon.toFixed(2)}`;
    if (ser && ser.key === key) return;
    const th = cur; ser = { key, id: th.id, vals: null };
    (th.series ? th.series(p.lat, p.lon) : sample(th, p.lat, p.lon)).then((vals) => { if (ser && ser.key === key) { ser.vals = vals; if (cur === th && open) paint(); } }).catch(() => {});
  }
  function redraw() { if (cur && cur.draw && cur.kind === "still") setTimeout(() => show(idx), 300); }
  function tick() {
    const lb = box.querySelector(".tl-label"); if (lb) lb.textContent = label();
    box.querySelectorAll(".tl-chart i").forEach((b, i) => b.classList.toggle("on", i === idx));
    const vl = box.querySelector(".tl-val"); if (vl) vl.innerHTML = valueLine();
    if (stamp && cur) stamp.innerHTML = stampHtml();
    if (playing && cur.frames.length > 1) timer = setTimeout(() => show((idx + 1) % cur.frames.length), cur.wait || 1050);
  }
  // coarse grids (about 50 km) are softened so the eye reads a field and not squares
  function soften(lay, th) { const c = lay.getContainer && lay.getContainer(); if (!c || !th.cell || th.cell < 0.3) return; const px = (th.cell * 256 * 2 ** map.getZoom()) / 360; c.style.filter = `blur(${Math.max(1.5, Math.min(18, px * 0.42)).toFixed(1)}px)`; }
  function make(th, i, table) {
    const lay = th.cm ? new DataLayer({ theme: th, table, time: th.frames[i], maxNativeZoom: th.z, maxZoom: 19, opacity: 0, zIndex: 210, className: "tl-data", attribution: "NASA GIBS" })
      : L.tileLayer(`${G}/wmts/epsg3857/best/${th.layer}/default/${th.frames[i] ? th.frames[i] + "/" : ""}${th.set}/{z}/{y}/{x}.png`, { maxNativeZoom: th.z, maxZoom: 19, opacity: 0, zIndex: 210, className: "tl-data tl-mult", attribution: "NASA GIBS" });
    lay._i = i; lay._th = th; lay._ok = false; lay.once("load", () => { lay._ok = true; });
    guard(lay).addTo(map); soften(lay, th);
    return lay;
  }
  // one frame: the new tiles load invisibly, then fade in over the old ones, so the map never blinks
  async function show(i) {
    idx = i; const my = ++token, th = cur;
    if (th.draw) { if (!th.keep) { vec.clearLayers(); soft.clearLayers(); } try { await th.draw(i, vec, soft); } catch (_) { /* nothing to draw */ } if (my === token && cur === th) tick(); return; }
    const table = th.cm ? await lut(th.cm).catch(() => new Map()) : null; if (my !== token || cur !== th) return;
    const lay = pre && pre._i === i && pre._th === th ? pre : make(th, i, table); if (pre && pre !== lay) map.removeLayer(pre); pre = null;
    let done = false;
    const swap = () => {
      if (done) return; done = true;
      if (my !== token || cur !== th) { map.removeLayer(lay); return; }
      lay.setOpacity(th.op); const old = shown; shown = lay; if (old && old !== lay) setTimeout(() => map.removeLayer(old), 420);
      if (th.frames.length > 1 && playing) pre = make(th, (i + 1) % th.frames.length, table); // the next frame gets ready in the background
      tick();
    };
    if (lay._ok) swap(); else { lay.once("load", swap); setTimeout(swap, 5000); }
  }
  function stop() {
    playing = false; clearTimeout(timer); token++;
    for (const l of [shown, pre, base, labels]) if (l) map.removeLayer(l);
    shown = pre = base = labels = null; vec.clearLayers(); soft.clearLayers(); map.removeLayer(vec); map.removeLayer(soft); cur = null; ser = null;
    if (typeof map !== "undefined") map.setMaxZoom(19);
  }
  function start(th) {
    if (!th || (th.id === "dengue" && !th.ready)) return; stop(); cur = th; playing = th.frames.length > 1; idx = 0;
    // a quiet base map under the data and the place names on top of it
    // (no key needed: the OpenStreetMap tiles the app already uses, greyed by CSS, and NASA GIBS borders and place names on top)
    base = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, zIndex: 200, opacity: 0.55, className: "tl-base", attribution: "© OpenStreetMap" }).addTo(map);
    labels = L.layerGroup(["Reference_Features", "Reference_Labels"].map((n) => L.tileLayer(`${G}/wmts/epsg3857/best/${n}/default/GoogleMapsCompatible_Level9/{z}/{y}/{x}.png`, { pane: "tlLabels", maxNativeZoom: 9, maxZoom: 19, opacity: 0.9, attribution: "NASA GIBS" }))).addTo(map);
    if (th.draw) { vec.addTo(map); soft.addTo(map); }
    const p = typeof state !== "undefined" && state.main ? [state.main.lat, state.main.lon] : null;
    if (th.bounds && (th.id === "dengue" || !(p && L.latLngBounds(th.bounds).contains(p)))) frame(th.bounds, th.zmax);
    // every map opens at a zoom that fits the resolution of its data, and does not go much closer
    if (map.getZoom() > th.zmax) map.setZoom(th.zmax, { animate: false });
    map.setMaxZoom(th.zmax + 1);
    paint(); setTimeout(() => { if (cur === th) show(0); }, 350);
  }
  function init() {
    if (typeof map === "undefined") return;
    map.createPane("tlLabels").style.zIndex = 450; map.getPane("tlLabels").style.pointerEvents = "none";
    map.createPane("tlSoft").style.zIndex = 390; map.getPane("tlSoft").style.pointerEvents = "none"; map.getPane("tlSoft").style.filter = "blur(9px)";
    map.on("zoomend", () => { for (const l of [shown, pre]) if (l && cur) soften(l, cur); });
    stamp = L.DomUtil.create("div", "tl-stamp", map.getContainer()); stamp.hidden = true;
    const C = L.control({ position: "bottomleft" });
    C.onAdd = () => {
      box = L.DomUtil.create("div", "tl");
      box.innerHTML = `<button type="button" class="tl-toggle"></button><div class="tl-panel" hidden></div>`;
      L.DomEvent.disableClickPropagation(box); L.DomEvent.disableScrollPropagation(box);
      box.querySelector(".tl-toggle").onclick = () => { open = !open; if (!open) stop(); else if (typeof state !== "undefined" && !state.main) frame(PY, 6); paint(); };
      return box;
    };
    C.addTo(map); paint();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
  return { refresh: paint, close: () => { stop(); if (open) { open = false; paint(); } }, start: (id) => { const th = byId(id); if (!th) return; open = true; start(th); }, zmax: (id) => (byId(id) || {}).zmax || 6, PY };
})();

// any element with data-tl="theme" opens that animation or map and brings the map into view
document.addEventListener("click", (ev) => {
  const b = ev.target.closest("[data-tl]"); if (!b) return;
  ev.preventDefault(); Timelapse.start(b.dataset.tl);
  const m = document.querySelector("#map"); if (m && m.getBoundingClientRect().top < 0) m.scrollIntoView({ behavior: "smooth", block: "start" });
});
