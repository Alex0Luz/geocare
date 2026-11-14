// GeoCare: climate trends, health consequences and community help for any address.
// Runs fully in the browser. Code written with AI assistance; concept and health content by the team.
const START = 1981, END = 2025;
const YEARS = Array.from({ length: END - START + 1 }, (_, i) => START + i);
const $ = (s) => document.querySelector(s);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const fmt = (v, d = 1) => (Number.isFinite(v) ? v.toLocaleString(I18N.locale(), { minimumFractionDigits: d, maximumFractionDigits: d }) : "–");
const signed = (v, d = 2) => (Number.isFinite(v) ? (v > 0 ? "+" : "") + fmt(v, d) : "–");
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const km = (a, b, c, d) => { const R = 6371, r = Math.PI / 180, x = (d - b) * r * Math.cos(((a + c) / 2) * r), y = (c - a) * r; return R * Math.hypot(x, y); };
const t = (k, v) => I18N.t(k, v);

const state = { main: null, other: null, tab: "place", charts: [], pin: null, dengue: null, giov: null };

/* ---------------- Map ---------------- */
const map = L.map("map", { zoomControl: true }).setView([-25.51, -54.61], 11);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "© OpenStreetMap" }).addTo(map);
const gibsDay = new Date(Date.now() - 2 * 864e5).toISOString().slice(0, 10);
const gibs = (layer, set, ext, maxNative, opacity) =>
  L.tileLayer(`https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/${layer}/default/${gibsDay}/${set}/{z}/{y}/{x}.${ext}`,
    { maxNativeZoom: maxNative, maxZoom: 19, opacity, attribution: "NASA GIBS / Worldview" });
L.control.layers(null, {
  "NASA GPM IMERG · rain rate": gibs("IMERG_Precipitation_Rate", "GoogleMapsCompatible_Level6", "png", 6, 0.7),
  "NASA MODIS · land surface temperature (day)": gibs("MODIS_Terra_Land_Surface_Temp_Day", "GoogleMapsCompatible_Level7", "png", 7, 0.65),
  "NASA MODIS · true colour": gibs("MODIS_Terra_CorrectedReflectance_TrueColor", "GoogleMapsCompatible_Level9", "jpg", 9, 1),
  "NASA MODIS · flood water (3 days)": gibs("MODIS_Combined_Flood_3-Day", "GoogleMapsCompatible_Level9", "png", 9, 0.8),
  "NASA MODIS · smoke and dust (aerosols)": gibs("MODIS_Combined_Value_Added_AOD", "GoogleMapsCompatible_Level6", "png", 6, 0.7),
  "NASA MODIS · vegetation (NDVI)": gibs("MODIS_Terra_NDVI_8Day", "GoogleMapsCompatible_Level9", "png", 9, 0.75),
}, { collapsed: true }).addTo(map);
const communityLayer = L.layerGroup().addTo(map);
const eventLayer = L.layerGroup().addTo(map);
const careLayer = L.layerGroup().addTo(map);

function setPin(lat, lon, open) {
  if (!state.pin) {
    state.pin = L.marker([lat, lon], { draggable: true }).addTo(map);
    state.pin.on("dragend", () => { const p = state.pin.getLatLng(); setPin(p.lat, p.lng, true); });
  } else state.pin.setLatLng([lat, lon]);
  const box = el("div", "pin-pop");
  const a = el("button", "btn small", t("pin.analyze")), b = el("button", "btn small ghost", t("pin.report"));
  a.onclick = () => { map.closePopup(); analyzeAt(lat, lon); };
  b.onclick = () => { map.closePopup(); showTab("community"); openReportForm(lat, lon); };
  box.append(a, b);
  state.pin.bindPopup(box);
  if (open) state.pin.openPopup();
}
map.on("click", (e) => setPin(e.latlng.lat, e.latlng.lng, true));

/* ---------------- Data sources ---------------- */
async function getJSON(url, cacheKey) {
  if (cacheKey) {
    try { const c = sessionStorage.getItem(cacheKey); if (c) return JSON.parse(c); } catch (_) { /* storage unavailable */ }
  }
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} ${url.split("?")[0]}`);
  const j = await r.json();
  if (cacheKey) { try { sessionStorage.setItem(cacheKey, JSON.stringify(j)); } catch (_) { /* too large: skip */ } }
  return j;
}
const round2 = (v) => Math.round(v * 100) / 100;

// Witness 1: NASA POWER (MERRA-2 reanalysis), monthly, 1981-2025.
async function fetchNasa(lat, lon) {
  const url = `https://power.larc.nasa.gov/api/temporal/monthly/point?parameters=T2M,PRECTOTCORR,RH2M,GWETTOP&community=AG&longitude=${round2(lon)}&latitude=${round2(lat)}&start=${START}&end=${END}&format=JSON`;
  const p = (await getJSON(url, `nasa:${round2(lat)}:${round2(lon)}`)).properties.parameter;
  const monthly = (name) => YEARS.map((y) => Array.from({ length: 12 }, (_, m) => {
    const v = p[name]?.[`${y}${String(m + 1).padStart(2, "0")}`]; return v === undefined || v < -900 ? NaN : v;
  }));
  const dim = (y, m) => new Date(y, m + 1, 0).getDate();
  const ann = (mm, fn) => mm.map((row, i) => (row.every(Number.isFinite) ? fn(row, YEARS[i]) : NaN));
  const mean = (row) => row.reduce((a, b) => a + b, 0) / row.length;
  const T = monthly("T2M"), P = monthly("PRECTOTCORR"), RH = monthly("RH2M"), SW = monthly("GWETTOP");
  return {
    monthlyT: T,
    temp: ann(T, mean),
    rain: ann(P, (row, y) => row.reduce((a, v, m) => a + v * dim(y, m), 0)),
    humidity: ann(RH, mean),
    soil: ann(SW, mean),
    aedes: ann(T, (row) => row.reduce((a, v) => a + Stats.aedes(v), 0)),
  };
}

// NASA POWER daily record (MERRA-2 temperature, satellite-corrected precipitation), 1981-2025: extremes and the year calendar.
// It has no hourly request limit, so every place always gets the eight signals, even when ERA5 is unavailable.
async function fetchNasaDaily(lat, lon) {
  const key = `geocare.nasad:${round2(lat)}:${round2(lon)}`;
  try { const c = localStorage.getItem(key); if (c) return JSON.parse(c); } catch (_) { /* storage unavailable */ }
  const url = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M,T2M_MAX,PRECTOTCORR&community=AG&longitude=${round2(lon)}&latitude=${round2(lat)}&start=${START}0101&end=${END}1231&format=JSON`;
  const p = (await getJSON(url)).properties.parameter;
  const days = Object.keys(p.T2M_MAX).sort(), n = days.length;
  const val = (name, d) => { const v = p[name][d]; return v === undefined || v < -900 ? NaN : v; };
  const yr = days.map((d) => +d.slice(0, 4)), mo = days.map((d) => +d.slice(4, 6) - 1);
  const tm = days.map((d) => val("T2M", d)), tx = days.map((d) => val("T2M_MAX", d)), pr = days.map((d) => val("PRECTOTCORR", d));
  const base = (arr) => arr.filter((_, i) => yr[i] <= 2010);
  const hotThr = Stats.percentile(base(tx), 0.95), wetThr = Math.max(20, Stats.percentile(base(pr), 0.99));
  const acc = YEARS.map(() => ({ n: 0, hot: 0, heavy: 0, dry: 0 }));
  const cal = Array.from({ length: 12 }, () => ({ d: 0, hot: 0, heavy: 0, rain: 0, t: 0, nt: 0 }));
  for (let i = 0; i < n; i++) {
    const a = acc[yr[i] - START]; if (!a) continue;
    if (Number.isFinite(tx[i])) { a.n++; if (tx[i] > hotThr) a.hot++; }
    if (Number.isFinite(pr[i])) { if (pr[i] >= wetThr) a.heavy++; if (pr[i] < 1) a.dry++; }
    if (yr[i] >= END - 9) { const c = cal[mo[i]]; c.d++; if (tx[i] > hotThr) c.hot++; if (Number.isFinite(pr[i])) { c.rain += pr[i]; if (pr[i] >= wetThr) c.heavy++; } if (Number.isFinite(tm[i])) { c.t += tm[i]; c.nt++; } }
  }
  const ok = (a) => a.n >= 360;
  const out = {
    hotThr, wetThr,
    hotdays: acc.map((a) => (ok(a) ? a.hot : NaN)), heavyrain: acc.map((a) => (ok(a) ? a.heavy : NaN)), drydays: acc.map((a) => (ok(a) ? a.dry : NaN)),
    calendar: cal.map((c) => ({ hot: c.hot / c.d, heavy: (c.heavy / c.d) * 30, rain: c.rain / 10, aedes: Stats.aedes(c.t / c.nt) })),
  };
  try { localStorage.setItem(key, JSON.stringify(out)); } catch (_) { /* storage full: skip */ }
  return out;
}

// Witness 2: ERA5 reanalysis (ECMWF / Copernicus) through Open-Meteo, daily, 1981-2025.
// The free ERA5 service limits requests per hour. Order of attempts: result cached on this device,
// live request, then an archived file shipped with the app for demonstration places.
async function fetchEra5(lat, lon) {
  const key = `geocare.era5:${round2(lat)}:${round2(lon)}`;
  try { const c = localStorage.getItem(key); if (c) return JSON.parse(c); } catch (_) { /* storage unavailable */ }
  try {
    const live = await fetchEra5Live(lat, lon);
    try { localStorage.setItem(key, JSON.stringify(live)); } catch (_) { /* storage full: skip */ }
    return live;
  } catch (e) {
    const idx = await getJSON("data/era5/index.json", "era5idx");
    const near = idx.map((p) => ({ ...p, dist: km(lat, lon, p.lat, p.lon) })).sort((a, b) => a.dist - b.dist)[0];
    if (!near || near.dist > 25) throw e;
    return { ...(await getJSON("data/era5/" + near.file)), archived: true };
  }
}
async function fetchEra5Live(lat, lon) {
  const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${round2(lat)}&longitude=${round2(lon)}&start_date=${START}-01-01&end_date=${END}-12-31&daily=temperature_2m_mean,temperature_2m_max,precipitation_sum&timezone=auto`;
  const d = (await getJSON(url)).daily;
  const n = d.time.length, yr = new Int16Array(n), mo = new Int8Array(n);
  for (let i = 0; i < n; i++) { yr[i] = +d.time[i].slice(0, 4); mo[i] = +d.time[i].slice(5, 7) - 1; }
  const num = (a) => a.map((v) => (v == null ? NaN : v));
  const tm = num(d.temperature_2m_mean), tx = num(d.temperature_2m_max), pr = num(d.precipitation_sum);
  const base = (arr) => arr.filter((_, i) => yr[i] <= 2010);
  const hotThr = Stats.percentile(base(tx), 0.95);
  const wetThr = Math.max(20, Stats.percentile(base(pr), 0.99));
  const acc = YEARS.map(() => ({ n: 0, t: 0, p: 0, hot: 0, heavy: 0, dry: 0, mT: Array(12).fill(0), mN: Array(12).fill(0) }));
  for (let i = 0; i < n; i++) {
    const a = acc[yr[i] - START]; if (!a) continue;
    if (Number.isFinite(tm[i])) { a.n++; a.t += tm[i]; a.mT[mo[i]] += tm[i]; a.mN[mo[i]]++; }
    if (Number.isFinite(tx[i]) && tx[i] > hotThr) a.hot++;
    if (Number.isFinite(pr[i])) { a.p += pr[i]; if (pr[i] >= wetThr) a.heavy++; if (pr[i] < 1) a.dry++; }
  }
  const cal = Array.from({ length: 12 }, () => ({ d: 0, hot: 0, heavy: 0, rain: 0, t: 0, nt: 0 }));
  for (let i = 0; i < n; i++) {
    if (yr[i] < END - 9) continue;
    const c = cal[mo[i]]; c.d++;
    if (tx[i] > hotThr) c.hot++;
    if (Number.isFinite(pr[i])) { c.rain += pr[i]; if (pr[i] >= wetThr) c.heavy++; }
    if (Number.isFinite(tm[i])) { c.t += tm[i]; c.nt++; }
  }
  // per month: share of very hot days, heavy-rain days per month, mean monthly rain (mm), mosquito thermal suitability
  const calendar = cal.map((c) => ({ hot: c.hot / c.d, heavy: (c.heavy / c.d) * 30, rain: c.rain / 10, aedes: Stats.aedes(c.t / c.nt) }));
  const ok = (a) => a.n >= 360;
  const monthlyT = acc.map((a) => a.mT.map((s, m) => (a.mN[m] ? s / a.mN[m] : NaN)));
  return {
    hotThr, wetThr, monthlyT, calendar,
    temp: acc.map((a) => (ok(a) ? a.t / a.n : NaN)),
    rain: acc.map((a) => (ok(a) ? a.p : NaN)),
    hotdays: acc.map((a) => (ok(a) ? a.hot : NaN)),
    heavyrain: acc.map((a) => (ok(a) ? a.heavy : NaN)),
    drydays: acc.map((a) => (ok(a) ? a.dry : NaN)),
    aedes: monthlyT.map((row) => (row.every(Number.isFinite) ? row.reduce((s, v) => s + Stats.aedes(v), 0) : NaN)),
  };
}

// Terrain screening from a digital elevation model (Copernicus DEM, 90 m) via Open-Meteo.
async function fetchTerrain(lat, lon) {
  const pts = [[0, 0]];
  for (const r of [300, 1500]) for (let k = 0; k < 8; k++) pts.push([r * Math.cos((k * Math.PI) / 4), r * Math.sin((k * Math.PI) / 4)]);
  const lats = pts.map(([, dy]) => (lat + dy / 111320).toFixed(5));
  const lons = pts.map(([dx]) => (lon + dx / (111320 * Math.cos((lat * Math.PI) / 180))).toFixed(5));
  const e = (await getJSON(`https://api.open-meteo.com/v1/elevation?latitude=${lats.join(",")}&longitude=${lons.join(",")}`)).elevation;
  const c = e[0], near = e.slice(1, 9), far = e.slice(9);
  const avg = (a) => a.reduce((p, v) => p + v, 0) / a.length;
  const slope = Math.max(...near.map((v) => Math.abs(v - c))) / 300;
  let hi = 1; for (let i = 2; i < e.length; i++) if (e[i] > e[hi]) hi = i;
  const high = { lat: +lats[hi], lon: +lons[hi], gain: e[hi] - c, dist: hi <= 8 ? 0.3 : 1.5, dir: (hi - 1) % 8 };
  return {
    high, elevation: c, relNear: c - avg(near), relFar: c - avg(far), slopePct: slope * 100,
    low: c <= Math.min(...near) + 1 && avg(far) - c >= 8,
    steep: slope >= 0.18,
  };
}

async function fetchNow(lat, lon) {
  const [fc, air] = await Promise.all([
    getJSON(`https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(3)}&longitude=${lon.toFixed(3)}&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,precipitation_sum&hourly=temperature_2m,relative_humidity_2m&forecast_days=7&timezone=auto`),
    getJSON(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat.toFixed(3)}&longitude=${lon.toFixed(3)}&current=pm2_5,us_aqi`).catch(() => null),
  ]);
  const d = fc.daily, hi = {};
  // NOAA heat index (Rothfusz) from hourly temperature and humidity; daily maximum.
  (fc.hourly?.time || []).forEach((tt, i) => { const v = Stats.heatIndex(fc.hourly.temperature_2m[i], fc.hourly.relative_humidity_2m[i]); if (Number.isFinite(v)) hi[tt.slice(0, 10)] = Math.max(hi[tt.slice(0, 10)] ?? -99, v); });
  return {
    days: d.time.map((day, i) => ({ day, tmax: d.temperature_2m_max[i], tmin: d.temperature_2m_min[i], feels: hi[day] ?? d.apparent_temperature_max[i], rain: d.precipitation_sum[i] })),
    pm25: air?.current?.pm2_5 ?? NaN, aqi: air?.current?.us_aqi ?? NaN,
  };
}

// NASA EONET: natural events currently open, within 500 km.
async function fetchEvents(lat, lon) {
  const j = await getJSON("https://eonet.gsfc.nasa.gov/api/v3/events?status=open&days=30", "eonet");
  return j.events.map((ev) => {
    const g = ev.geometry[ev.geometry.length - 1];
    const [x, y] = g.type === "Point" ? g.coordinates : g.coordinates[0][0];
    return { title: ev.title, cat: ev.categories[0]?.title || "", date: g.date?.slice(0, 10), lat: y, lon: x, dist: km(lat, lon, y, x), link: ev.sources?.[0]?.url || ev.link };
  }).filter((e) => e.dist <= 500).sort((a, b) => a.dist - b.dist).slice(0, 8);
}

// River discharge for the largest river in the ~5 km grid cell (Copernicus GloFAS via Open-Meteo), 1997 to 3 weeks ahead.
async function fetchRiver(lat, lon) {
  const today = new Date().toISOString().slice(0, 10), end = new Date(Date.now() + 21 * 864e5).toISOString().slice(0, 10);
  const d = (await getJSON(`https://flood-api.open-meteo.com/v1/flood?latitude=${lat.toFixed(3)}&longitude=${lon.toFixed(3)}&daily=river_discharge&start_date=1997-01-01&end_date=${end}`)).daily;
  const hist = [], fut = [], peak = {};
  d.time.forEach((day, i) => {
    const v = d.river_discharge[i]; if (v == null) return;
    if (day <= today) { hist.push(v); const y = +day.slice(0, 4); if (y <= END) peak[y] = Math.max(peak[y] ?? 0, v); } else fut.push({ day, v });
  });
  if (hist.length < 3650) return null;
  const now = hist[hist.length - 1], futMax = fut.reduce((a, b) => (b.v > a.v ? b : a), { v: -1, day: "" });
  const years = Object.keys(peak).map(Number).sort((a, b) => a - b);
  return {
    now, futMax, rank: hist.filter((v) => v <= now).length / hist.length,
    p50: Stats.percentile(hist, 0.5), p90: Stats.percentile(hist, 0.9), p99: Stats.percentile(hist, 0.99),
    trend: Stats.trend(years, years.map((y) => peak[y])),
  };
}
const riverLevel = (rv) => { if (!rv) return ""; const top = Math.max(rv.now, rv.futMax.v); return top >= rv.p99 ? "danger" : top >= rv.p90 ? "warn" : ""; };

// Health services within 5 km, from OpenStreetMap (Overpass API, with mirrors as fallback).
async function fetchCare(lat, lon) {
  const q = `[out:json][timeout:20];(nwr["amenity"~"^(hospital|clinic|doctors)$"](around:5000,${lat.toFixed(4)},${lon.toFixed(4)}););out center 60;`;
  const hosts = ["https://overpass-api.de/api/interpreter", "https://overpass.kumi.systems/api/interpreter", "https://overpass.private.coffee/api/interpreter"];
  for (const h of hosts) {
    try {
      const r = await fetch(h, { method: "POST", body: "data=" + encodeURIComponent(q), headers: { "Content-Type": "application/x-www-form-urlencoded" } });
      if (!r.ok) continue;
      const j = await r.json();
      return j.elements.map((e) => ({ name: e.tags?.name || "", kind: e.tags?.amenity, lat: e.lat ?? e.center?.lat, lon: e.lon ?? e.center?.lon }))
        .filter((e) => e.lat && e.name).map((e) => ({ ...e, dist: km(lat, lon, e.lat, e.lon) })).sort((a, b) => a.dist - b.dist).slice(0, 8);
    } catch (_) { /* try next mirror */ }
  }
  return null;
}

async function reverseName(lat, lon) {
  try {
    const j = await getJSON(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=jsonv2&zoom=14&accept-language=${I18N.lang}`);
    const a = j.address || {};
    return [a.suburb || a.neighbourhood || a.village, a.city || a.town || a.municipality || a.county, a.country].filter(Boolean).join(", ") || j.display_name;
  } catch (_) { return `${lat.toFixed(3)}, ${lon.toFixed(3)}`; }
}

/* Official NASA Giovanni series (Time Series Service), downloaded for selected places and stored as archived data. */
function nearestGiov(r) {
  if (!state.giov || !r) return null;
  const c = Object.values(state.giov).map((v) => ({ ...v, dist: km(r.lat, r.lon, v.lat, v.lon) })).sort((a, b) => a.dist - b.dist)[0];
  return c && c.dist <= 40 ? c : null;
}
function giovWitnesses(r, key) {
  const g = nearestGiov(r); if (!g) return [];
  const S = g.series, arr = (obj) => YEARS.map((y) => (obj && obj[y] !== undefined ? obj[y] : NaN));
  const out = [];
  if (key === "temp") {
    out.push({ name: t("giov.merra"), color: "#c08a2e", values: arr(S.merra2_temp) });
    const airs = YEARS.map((y) => (S.airs_dia?.[y] !== undefined && S.airs_noite?.[y] !== undefined ? (S.airs_dia[y] + S.airs_noite[y]) / 2 : NaN));
    out.push({ name: t("giov.airs"), color: "#3d6f8e", values: airs });
  }
  if (key === "rain") out.push({ name: t("giov.gpm"), color: "#3d6f8e", values: arr(S.gpm_chuva) });
  return out.map((w) => ({ ...w, trend: Stats.trend(YEARS, w.values) }));
}

/* ---------------- Signals ---------------- */
const SIGNALS = [
  { key: "temp", unit: "°C", d: 2, src: ["nasa", "era5"] },
  { key: "hotdays", unit: "days", d: 1, src: ["nasa", "era5"] },
  { key: "rain", unit: "mm", d: 0, src: ["nasa", "era5"] },
  { key: "heavyrain", unit: "days", d: 1, src: ["nasa", "era5"] },
  { key: "drydays", unit: "days", d: 0, src: ["nasa", "era5"] },
  { key: "humidity", unit: "%", d: 1, src: ["nasa"] },
  { key: "soil", unit: "", d: 2, src: ["nasa"] },
  { key: "aedes", unit: "months", d: 2, src: ["nasa", "era5"] },
];

// Daily-based signals come from the NASA POWER daily record (r.nasad); the others from the monthly record (r.nasa).
const DAILY = new Set(["hotdays", "heavyrain", "drydays"]);
const nasaOf = (r, key) => (DAILY.has(key) ? r.nasad : r.nasa);

function buildSignals(r) {
  return SIGNALS.map((s) => {
    const N = nasaOf(r, s.key);
    const a = s.src.includes("nasa") && N ? Stats.trend(YEARS, N[s.key]) : null;
    const b = s.src.includes("era5") && r.era5 ? Stats.trend(YEARS, r.era5[s.key]) : null;
    const waiting = (s.src.includes("nasa") && N === undefined) || (s.src.includes("era5") && r.era5 === undefined);
    return { ...s, nasa: a, era5: b, waiting, verdict: Stats.verdict(a, b), single: s.src.length === 1 };
  });
}
const sig = (r, key) => r.signals?.find((s) => s.key === key);
const rising = (s, dir = 1) => s && ["confirmed", "likely", "single"].includes(s.verdict) && (s.nasa || s.era5).direction === dir;

/* ---------------- Analysis flow ---------------- */
async function analyzeAt(lat, lon, label, slot = "main") {
  const r = { lat, lon, label: label || `${lat.toFixed(3)}, ${lon.toFixed(3)}`, pending: 0 };
  state[slot] = r;
  if (slot === "main") { setPin(lat, lon, false); map.setView([lat, lon], Math.max(map.getZoom(), 12)); showTab("place"); }
  const step = (name, promise) => {
    r.pending++;
    promise.then((v) => { r[name] = v; }).catch((e) => { r[name] = null; console.warn(name, e); })
      .finally(() => { r.pending--; r.signals = buildSignals(r); if (state[slot] === r) render(); });
  };
  r.pending++;
  geoInfo(lat, lon).then((g) => { r.cc = g.cc; r.country = g.country; if (!label) r.label = g.label; }).catch(() => {})
    .finally(() => { r.pending--; if (state[slot] === r) render(); });
  step("nasa", fetchNasa(lat, lon));
  step("nasad", fetchNasaDaily(lat, lon));
  step("era5", fetchEra5(lat, lon));
  step("terrain", fetchTerrain(lat, lon));
  if (slot === "main") { step("now", fetchNow(lat, lon)); step("events", fetchEvents(lat, lon)); step("river", fetchRiver(lat, lon)); step("care", fetchCare(lat, lon)); step("quakes", fetchQuakes(lat, lon)); }
  r.signals = buildSignals(r);
  render();
}

async function search(q, slot = "main") {
  setStatus(t("status.searching"));
  try {
    const j = await getJSON(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=jsonv2&limit=1&accept-language=${I18N.lang}`);
    if (!j.length) return setStatus(t("status.notfound"), true);
    setStatus("");
    analyzeAt(+j[0].lat, +j[0].lon, j[0].display_name.split(",").slice(0, 3).join(","), slot);
  } catch (e) { setStatus(t("status.error"), true); }
}
function setStatus(msg, bad) { const s = $("#status"); s.textContent = msg || ""; s.className = "status" + (bad ? " bad" : ""); }

/* ---------------- Rendering ---------------- */
function showTab(name) {
  state.tab = name;
  document.querySelectorAll(".tab").forEach((b) => b.classList.toggle("on", b.dataset.tab === name));
  document.querySelectorAll(".panel").forEach((p) => p.classList.toggle("on", p.id === "p-" + name));
  setTimeout(() => map.invalidateSize(), 50);
  Extras2.onTab(name);
}

function render() {
  state.charts.forEach((c) => c.destroy()); state.charts = [];
  I18N.apply();
  renderPlace(); renderHealth(); renderNow(); renderCommunity(); renderCompare();
  Extras.render(); Extras2.render();
}

function verdictBadge(s) {
  if (s.waiting) return `<span class="badge wait">${t("verdict.wait")}</span>`;
  return `<span class="badge v-${s.verdict}">${t("verdict." + s.verdict)}</span>`;
}
function headline(s) {
  const vals = [s.nasa, s.era5].filter(Boolean).map((x) => x.slopeDecade);
  if (!vals.length) return "–";
  const lo = Math.min(...vals), hi = Math.max(...vals);
  const u = t("unit." + s.unit) || s.unit;
  const body = vals.length === 2 && Math.abs(hi - lo) > 10 ** -s.d ? `${signed(lo, s.d)} … ${signed(hi, s.d)}` : signed(vals[0], s.d);
  return `${body} ${u} <small>${t("per.decade")}</small>`;
}
function witnessRow(name, tr, s) {
  if (!tr) return "";
  return `<tr><td>${name}</td><td>${fmt(tr.early, s.d)} → ${fmt(tr.recent, s.d)}${tr.t0 > START ? ` <small>(${tr.t0}–${tr.t1})</small>` : ""}</td><td>${signed(tr.slopeDecade, s.d)} <small>[${signed(tr.loDecade, s.d)}; ${signed(tr.hiDecade, s.d)}]</small></td><td class="${tr.significant ? "sig" : ""}">p = ${tr.p < 0.001 ? "&lt;0.001" : tr.p.toFixed(3)}</td></tr>`;
}

function renderPlace() {
  const r = state.main, box = $("#p-place");
  state.detailChart = null;
  if (!r) { box.innerHTML = `<div class="empty">${Extras2.hero()}<div class="chips">${["Ciudad del Este", "Asunción", "São Paulo", "Porto Alegre", "Karachi", "Kathmandu", "Nairobi", "Phoenix"].map((c) => `<button class="chip" data-q="${c}">${c}</button>`).join("")}</div><div class="capitals-box"></div></div>`;
    box.querySelectorAll(".chip").forEach((b) => (b.onclick = () => { $("#q").value = b.dataset.q; search(b.dataset.q); })); return; }
  const sigs = r.signals, done = sigs.filter((s) => !s.waiting);
  const strong = done.filter((s) => ["confirmed", "likely"].includes(s.verdict)).length;
  // which signal is open in the evidence panel: the user's choice, or the strongest verdict
  const auto = (done.find((s) => s.verdict === "confirmed") || done.find((s) => s.verdict === "likely") || sigs[0]).key;
  if (r.sel && !sigs.some((s) => s.key === r.sel)) r.sel = null;
  const sel = r.sel || auto;
  const arrow = (s) => { const tr = s.era5 || s.nasa; return s.waiting || !tr || ["none", "nodata", "conflict"].includes(s.verdict) ? "→" : tr.direction > 0 ? "↑" : "↓"; };

  let html = `<header class="ph"><h2>${esc(r.label)}</h2><p class="meta">${r.lat.toFixed(3)}, ${r.lon.toFixed(3)}${r.terrain ? ` · ${fmt(r.terrain.elevation, 0)} m` : ""} · ${START}–${END}</p></header>`;
  if (r.era5 === null) html += `<p class="warn-note">${t("era5.down")}</p>`;
  else if (r.era5?.archived) html += `<p class="muted small">${t("era5.archived")}</p>`;
  html += `<section class="vhero"><div class="vh-num">${done.length ? strong : "…"}<span>/${sigs.length}</span></div><div class="vh-body"><p>${t("place.hero")}</p>
    <div class="strip">${sigs.map((s) => `<i class="v-${s.waiting ? "wait" : s.verdict}" title="${t("sig." + s.key)}"></i>`).join("")}</div>
    ${r.pending ? `<p class="loading small">${t("status.loading", { n: r.pending })}</p>` : ""}</div></section>`;

  html += `<h3>${t("place.signals")}</h3><p class="muted small">${t("place.tap")}</p><div class="siggrid">`;
  for (const s of sigs) {
    html += `<button class="sigtile v-${s.waiting ? "wait" : s.verdict} ${s.key === sel ? "on" : ""}" data-key="${s.key}">
      <span class="st-name"><b class="arrow">${arrow(s)}</b>${t("sig." + s.key)}</span>
      <span class="st-val">${s.waiting ? "…" : headline(s)}</span>${verdictBadge(s)}</button>`;
  }
  html += `</div><section id="sig-detail" class="sigdetail"></section>`;
  html += `<div id="place-tools" class="tools"></div>`;
  if (nearestGiov(r)) html += `<p class="giov-badge">${t("giov.badge")}</p>`;
  html += `<div id="sat-box"></div><div id="calendar-box"></div>`;
  if (r.terrain) {
    const tr = r.terrain, flags = [tr.low && t("terrain.low"), tr.steep && t("terrain.steep")].filter(Boolean);
    html += `<h3>${t("terrain.title")}</h3><div class="factrow ${flags.length ? "flag" : ""}"><div class="fact-num">${fmt(tr.elevation, 0)}<small>m</small></div><div><p>${flags.length ? flags.join(" ") : t("terrain.none")}</p><p class="muted small">${t("terrain.rel", { a: signed(tr.relNear, 0), b: signed(tr.relFar, 0), s: fmt(tr.slopePct, 0) })}</p><p class="muted small">${t("terrain.disclaimer")}</p></div></div>`;
  }
  html += dengueBlock(r);
  html += `<details class="method"><summary>${t("place.how")}</summary><p class="muted small">${t("place.method")}</p><p class="muted small">${t("place.sources")}</p></details>`;
  box.innerHTML = html;
  box.querySelectorAll(".sigtile").forEach((b) => (b.onclick = () => {
    r.sel = b.dataset.key;
    box.querySelectorAll(".sigtile").forEach((x) => x.classList.toggle("on", x === b));
    drawDetail(r, r.sel); $("#sig-detail").scrollIntoView({ behavior: "smooth", block: "nearest" });
  }));
  drawDetail(r, sel);
  drawDengue(r);
}

// Evidence panel for one signal: chart, how much, the witnesses side by side, and what the verdict means.
function drawDetail(r, key) {
  const box = $("#sig-detail"), s = sig(r, key); if (!box || !s) return;
  if (state.detailChart) { state.charts = state.charts.filter((c) => c !== state.detailChart); state.detailChart.destroy(); state.detailChart = null; }
  const gw = giovWitnesses(r, s.key);
  const thrSrc = r.era5 || r.nasad;
  const what = t("sig." + s.key + ".what", { thr: s.key === "hotdays" && thrSrc ? fmt(thrSrc.hotThr, 1) : s.key === "heavyrain" && thrSrc ? fmt(thrSrc.wetThr, 0) : "" });
  let h = `<p class="eyebrow">${t("place.evidence")}</p><div class="sd-head"><h4>${t("sig." + s.key)}</h4>${verdictBadge(s)}</div><p class="muted small">${what}</p>`;
  if (s.waiting) h += `<p class="loading">…</p>`;
  else h += `<div class="chart-wrap"><canvas></canvas></div>${quantLine(s)}
    <div class="tblwrap"><table class="wit"><thead><tr><th>${t("wit.source")}</th><th>${START}–${START + 9} → ${END - 9}–${END}</th><th>${t("wit.slope")}</th><th>${t("wit.test")}</th></tr></thead><tbody>
    ${witnessRow("NASA POWER (MERRA-2)", s.nasa, s)}${witnessRow("ERA5 (Copernicus)", s.era5, s)}${gw.map((w) => witnessRow(w.name, w.trend, s)).join("")}</tbody></table></div>
    ${gw.length ? `<p class="muted small">${t("giov.note." + s.key)}</p>` : ""}<p class="explain">${t("explain." + s.verdict)}</p>`;
  box.innerHTML = h;
  if (!s.waiting) { drawSignal(box, s, r); state.detailChart = state.charts[state.charts.length - 1]; }
}

function drawSignal(d, s, r) {
  const ds = [];
  const add = (label, color, values, tr) => {
    if (!values) return;
    ds.push({ label, data: values.map((v) => (Number.isFinite(v) ? v : null)), borderColor: color, backgroundColor: color, pointRadius: 1.5, borderWidth: 1.5, tension: 0.15, spanGaps: true });
    if (tr) ds.push({ label: label + " · Sen", data: YEARS.map((y) => tr.intercept + tr.slope * y), borderColor: color, borderDash: tr.significant ? [] : [5, 4], borderWidth: 2.5, pointRadius: 0 });
  };
  if (s.src.includes("nasa") && nasaOf(r, s.key)) add("NASA", "#b2592a", nasaOf(r, s.key)[s.key], s.nasa);
  if (s.src.includes("era5") && r.era5) add("ERA5", "#1f7f5f", r.era5[s.key], s.era5);
  giovWitnesses(r, s.key).forEach((w) => add(w.name.split(" · ")[0], w.color, w.values, w.trend));
  state.charts.push(new Chart(d.querySelector("canvas"), {
    type: "line", data: { labels: YEARS, datasets: ds },
    options: { responsive: true, maintainAspectRatio: false, animation: false, plugins: { legend: { labels: { boxWidth: 10, font: { size: 11, family: "Manrope" }, filter: (it) => !it.text.includes("· Sen") } } }, scales: { x: { ticks: { maxTicksLimit: 8 }, grid: { display: false } }, y: { grid: { color: "#e6ebe8" } } } },
  }));
}

/* Dengue: real notified cases for Brazilian cities (InfoDengue), precomputed. */
function nearestDengue(r) {
  if (!state.dengue) return null;
  const c = Object.entries(state.dengue).map(([name, v]) => ({ name, ...v, dist: km(r.lat, r.lon, v.lat, v.lon) })).sort((a, b) => a.dist - b.dist)[0];
  return c && c.dist <= 80 ? c : null;
}
function dengueBlock(r) {
  const c = nearestDengue(r); if (!c) return "";
  return `<h3>${t("dengue.title")}</h3><div class="card plain"><p>${t("dengue.text", { city: c.name, km: fmt(c.dist, 0) })}</p><div class="chart-wrap"><canvas id="dengue-chart"></canvas></div><p class="muted small">${t("dengue.note")}</p></div>`;
}
function drawDengue(r) {
  const c = nearestDengue(r), cv = $("#dengue-chart"); if (!c || !cv) return;
  const ys = Object.keys(c.casos).filter((y) => +y <= 2025);
  state.charts.push(new Chart(cv, { type: "bar", data: { labels: ys, datasets: [{ label: t("dengue.axis"), data: ys.map((y) => (c.casos[y] / c.pop) * 1e5), backgroundColor: "#b2592a" }] }, options: { responsive: true, maintainAspectRatio: false, animation: false, plugins: { legend: { labels: { boxWidth: 10, font: { size: 11 } } } } } }));
}

/* ---------------- Health ---------------- */
function healthTopics(r) {
  const now = r.now, month = new Date().getMonth();
  const recentT = (r.era5 || r.nasa)?.monthlyT.slice(-10).map((row) => row[month]).filter(Number.isFinite);
  const tMonth = recentT?.length ? recentT.reduce((a, b) => a + b, 0) / recentT.length : NaN;
  const suit = Number.isFinite(tMonth) ? Stats.aedes(tMonth) : NaN;
  const maxFeels = now ? Math.max(...now.days.map((d) => d.feels)) : NaN;
  const maxRain = now ? Math.max(...now.days.map((d) => d.rain)) : NaN;
  const out = [];
  const lvl = (nowFlag, trendFlag) => (nowFlag ? "now" : trendFlag ? "rising" : "watch");
  out.push({ key: "vector", level: lvl(suit >= 0.5, rising(sig(r, "aedes"))), why: [Number.isFinite(suit) && t("why.vector.now", { s: fmt(suit * 100, 0), t: fmt(tMonth, 1) }), rising(sig(r, "aedes")) && t("why.vector.trend")] });
  out.push({ key: "heat", level: lvl(maxFeels >= 32, rising(sig(r, "hotdays")) || rising(sig(r, "temp"))), why: [maxFeels >= 32 && t("why.heat.now", { f: fmt(maxFeels, 0) }), rising(sig(r, "hotdays")) && t("why.heat.trend")] });
  out.push({ key: "water", level: lvl(maxRain >= 50 || !!riverLevel(r.river), rising(sig(r, "heavyrain")) || r.terrain?.low), why: [riverLevel(r.river) && t("why.water.river"), maxRain >= 50 && t("why.water.now", { r: fmt(maxRain, 0) }), r.terrain?.low && t("why.water.low"), rising(sig(r, "heavyrain")) && t("why.water.trend")] });
  out.push({ key: "air", level: lvl(now?.pm25 > 15, false), why: [now?.pm25 > 15 && t("why.air.now", { p: fmt(now.pm25, 0) })] });
  out.push({ key: "wash", level: lvl(false, rising(sig(r, "rain"), -1) || rising(sig(r, "drydays"))), why: [rising(sig(r, "rain"), -1) && t("why.wash.rain"), rising(sig(r, "drydays")) && t("why.wash.dry")] });
  // farm chemicals, dust and smoke: general guidance for everyone, first in line for people who live or work near crops
  out.push({ key: "agro", level: Extras.has("farm") ? "you" : "watch", why: [Extras.has("farm") && t("why.agro.me")] });
  const order = { now: 0, you: 1, rising: 2, watch: 3 };
  return out.sort((a, b) => order[a.level] - order[b.level]);
}
function renderHealth() {
  const r = state.main, box = $("#p-health");
  if (!r) { box.innerHTML = `<div id="me-box"></div><p class="muted">${t("need.place")}</p><div id="sos-box"></div>`; return; }
  let html = `<div id="me-box"></div><h3>${t("health.title")}</h3><p class="muted small">${t("health.intro")}</p><div class="topics">`;
  healthTopics(r).forEach((h, i) => {
    const why = h.why.filter(Boolean);
    html += `<details class="topic lv-${h.level}" ${["now", "you"].includes(h.level) || i === 0 ? "open" : ""}><summary><span class="tn">${String(i + 1).padStart(2, "0")}</span><span class="tt">${t("h." + h.key)}</span><span class="badge l-${h.level}">${t("level." + h.level)}</span></summary>
      <div class="tbody">${why.length ? `<p class="why"><b>${t("health.why")}</b> ${why.join(" ")}</p>` : `<p class="why muted">${t("health.nowhy")}</p>`}
      <ol class="steps">${t("h." + h.key + ".steps").split("|").map((x) => `<li>${x}</li>`).join("")}</ol>
      <p class="muted small">${t("h." + h.key + ".src")}</p></div></details>`;
  });
  html += `</div><div id="sos-box"></div>`;
  careLayer.clearLayers();
  html += `<h3>${t("care.title")}</h3>`;
  if (r.care?.length) {
    html += `<ul class="rows care">` + r.care.map((c) => `<li data-lat="${c.lat}" data-lon="${c.lon}"><span class="k">✚</span><div><b>${esc(c.name)}</b><span class="muted small">${t("care." + c.kind)}</span></div><span class="dist">${fmt(c.dist, 1)} km</span></li>`).join("") + `</ul>`;
    r.care.forEach((c) => L.marker([c.lat, c.lon], { icon: L.divIcon({ className: "emoji-pin k-care", html: "✚", iconSize: [26, 26] }) }).bindPopup(`<b>${esc(c.name)}</b><br>${t("care." + c.kind)}`).addTo(careLayer));
  } else html += `<p class="muted">${r.care === undefined ? "…" : t("care.none")}</p>`;
  html += `<p class="muted small">${t("care.note")}</p><p class="disclaimer">${t("health.disclaimer")}</p>`;
  box.innerHTML = html;
  box.querySelectorAll(".care li").forEach((li) => (li.onclick = () => map.setView([+li.dataset.lat, +li.dataset.lon], 16)));
}

/* ---------------- Now ---------------- */
function renderNow() {
  const r = state.main, box = $("#p-now");
  if (!r) { box.innerHTML = `<p class="muted">${t("need.place")}</p>`; return; }
  let html = `<h2>${t("now.title")}</h2>`;
  if (r.now) {
    const D = r.now.days, hot = D.filter((d) => d.feels >= 32).length, wet = D.filter((d) => d.rain >= 50).length;
    const peak = D.reduce((a, b) => (b.feels > a.feels ? b : a));
    html += `<div class="stats3"><div><b class="${peak.feels >= 41 ? "hot" : ""}">${fmt(peak.feels, 0)}°</b><span>${t("now.s.peak")}</span></div><div><b class="${hot ? "hot" : ""}">${hot}</b><span>${t("now.s.hot")}</span></div><div><b class="${wet ? "hot" : ""}">${wet}</b><span>${t("now.s.wet")}</span></div></div>`;
    html += `<div class="wk">` + D.map((d, i) => {
      const lv = d.feels >= 41 ? "danger" : d.feels >= 32 ? "warn" : "", w = Math.max(6, Math.min(100, ((d.feels - 10) / 38) * 100));
      const day = new Date(d.day + "T12:00").toLocaleDateString(I18N.locale(), { weekday: "short", day: "numeric" });
      return `<div class="wkrow ${lv} ${i === 0 ? "today" : ""}"><span class="wd">${day}</span><span class="wt">${fmt(d.tmax, 0)}° <small>${fmt(d.tmin, 0)}°</small></span><span class="wbar"><i style="width:${w.toFixed(0)}%"></i></span><span class="whi">${fmt(d.feels, 0)}°</span><span class="wr ${d.rain >= 50 ? "wet" : ""}">${d.rain >= 1 ? fmt(d.rain, 0) + " mm" : "–"}</span></div>`;
    }).join("") + `</div><p class="muted small">${t("now.legend2")}</p>`;
    if (Number.isFinite(r.now.pm25)) html += `<h3>${t("now.air")}</h3><div class="factrow ${r.now.pm25 > 15 ? "flag" : ""}"><div class="fact-num">${fmt(r.now.pm25, 0)}<small>µg/m³</small></div><div><p>PM2.5 · AQI ${fmt(r.now.aqi, 0)}</p><p class="muted small">${t("now.air.note")}</p></div></div>`;
  } else html += `<p class="loading">${r.now === undefined ? t("status.loading", { n: 1 }) : t("status.error")}</p>`;
  if (r.river) {
    const rv = r.river, lv = riverLevel(rv), n0 = (v) => fmt(v, 0);
    html += `<h3>${t("now.river")}</h3><div class="factrow ${lv ? "flag" : ""}"><div class="fact-num">${fmt(rv.rank * 100, 0)}<small>%</small></div><div><p>${t("now.river.text", { now: n0(rv.now), rank: fmt(rv.rank * 100, 0), peak: n0(rv.futMax.v), day: rv.futMax.day ? new Date(rv.futMax.day + "T12:00").toLocaleDateString(I18N.locale(), { day: "numeric", month: "short" }) : "–" })}</p>
      ${lv ? `<p><b>${t("now.river." + lv, { p: n0(lv === "danger" ? rv.p99 : rv.p90) })}</b></p>` : ""}
      ${rv.trend ? `<p class="muted small">${t("now.river.trend", { s: signed(rv.trend.slopeDecade, 0), v: t("verdict." + (rv.trend.significant ? "single" : "none")), p: rv.trend.p < 0.01 ? "<0.01" : rv.trend.p.toFixed(2) })}</p>` : ""}
      <p class="muted small">${t("now.river.note")}</p></div></div>`;
  }
  html += `<div id="quake-box"></div><h3>${t("now.events")}</h3>`;
  eventLayer.clearLayers();
  if (r.events?.length) {
    html += `<ul class="rows">` + r.events.map((e) => `<li data-lat="${e.lat}" data-lon="${e.lon}"><span class="k">●</span><div><b>${esc(e.title)}</b><span class="muted small">${esc(e.cat)}${e.date ? " · " + e.date : ""}</span></div><span class="dist">${fmt(e.dist, 0)} km</span></li>`).join("") + `</ul>`;
    r.events.forEach((e) => L.circleMarker([e.lat, e.lon], { radius: 7, color: "#b2592a" }).bindPopup(`<b>${esc(e.cat)}</b><br>${esc(e.title)}`).addTo(eventLayer));
  } else html += `<p class="muted">${r.events === undefined ? "…" : t("now.noevents")}</p>`;
  html += `<p class="muted small foot">${t("now.sources")}</p>`;
  box.innerHTML = html;
  box.querySelectorAll(".rows li").forEach((li) => (li.onclick = () => map.setView([+li.dataset.lat, +li.dataset.lon], 7)));
}

/* ---------------- Community (prototype: stored on this device only) ---------------- */
const KINDS = { flood: "🌊", heat: "🥵", mosquito: "🦟", nowater: "🚱", landslide: "⛰️", smoke: "🌫️", need: "🆘", donate: "📦", partner: "🤝", animal: "🐾", spray: "🚜" };
const SEED = [
  { id: "s1", kind: "flood", lat: -25.5215, lon: -54.6205, text: "Street flooded after last night's storm; water entered ground-floor homes.", when: "2026-11-13", seed: true },
  { id: "s2", kind: "need", lat: -25.5231, lon: -54.6188, text: "Families need cleaning supplies, mattresses and drinking water.", when: "2026-11-13", seed: true },
  { id: "s3", kind: "donate", lat: -25.5096, lon: -54.6112, text: "Collection point: parish hall, open 8:00–18:00. Accepting food, clothes, cleaning kits.", when: "2026-11-13", seed: true },
  { id: "s4", kind: "mosquito", lat: -25.4978, lon: -54.6441, text: "Abandoned lot with tyres holding water.", when: "2026-11-10", seed: true },
  { id: "s5", kind: "partner", lat: -25.5128, lon: -54.6089, text: "Example partner business: pledged drinking water and transport in case of disaster.", when: "2026-11-01", seed: true },
];
function loadReports() { try { return JSON.parse(localStorage.getItem("geocare.reports") || "[]"); } catch (_) { return []; } }
function saveReports(a) { try { localStorage.setItem("geocare.reports", JSON.stringify(a)); } catch (_) { /* storage unavailable */ } }
function allReports() { return [...loadReports(), ...SEED]; }
let draft = null;
function openReportForm(lat, lon) { draft = { lat, lon }; renderCommunity(); $("#p-community").scrollTop = 0; }
function renderCommunity() {
  const box = $("#p-community"), items = allReports();
  communityLayer.clearLayers();
  items.forEach((it) => L.marker([it.lat, it.lon], { icon: L.divIcon({ className: "emoji-pin k-" + it.kind, html: KINDS[it.kind], iconSize: [30, 30] }) })
    .bindPopup(`<b>${t("kind." + it.kind)}</b><br>${esc(it.text)}<br><small>${it.when}${it.seed ? " · " + t("community.example") : ""}</small>`).addTo(communityLayer));
  const here = state.main || { lat: -25.51, lon: -54.61 };
  const near = items.map((it) => ({ ...it, dist: km(here.lat, here.lon, it.lat, it.lon) })).sort((a, b) => a.dist - b.dist);
  const HELP = ["need", "donate", "partner"], cnt = (k) => near.filter((it) => k.includes(it.kind)).length;
  let html = `<h2>${t("community.title")}</h2><p class="muted small">${t("community.intro")}</p>
    <div class="stats3"><div><b class="${cnt(["need"]) ? "hot" : ""}">${cnt(["need"])}</b><span>${t("community.s.need")}</span></div><div><b>${cnt(["donate", "partner"])}</b><span>${t("community.s.give")}</span></div><div><b>${near.length - cnt(HELP)}</b><span>${t("community.s.seen")}</span></div></div>`;
  if (draft) {
    html += `<form id="report-form" class="formcard"><p class="eyebrow">${t("community.new")} <span class="muted">${draft.lat.toFixed(4)}, ${draft.lon.toFixed(4)}</span></p>
      <div class="pchips">${Object.keys(KINDS).map((k, i) => `<label class="pchip ${i === 0 ? "on" : ""}"><input type="radio" name="r-kind" value="${k}" ${i === 0 ? "checked" : ""}>${KINDS[k]} ${t("kind." + k)}</label>`).join("")}</div>
      <textarea id="r-text" maxlength="280" rows="3" placeholder="${t("community.placeholder")}" required></textarea>
      <p class="muted small">🔒 ${t("community.privacy")}</p>
      <div class="row"><button class="btn">${t("community.send")}</button><button type="button" class="btn ghost" id="r-cancel">${t("community.cancel")}</button></div></form>`;
  } else html += `<button class="btn wide" id="r-open">＋ ${t("community.add")}</button>`;
  const group = (title, kinds) => {
    const g = near.filter((it) => kinds.includes(it.kind)); if (!g.length) return "";
    return `<h3>${title}</h3><ul class="rows feed">` + g.map((it) => `<li data-lat="${it.lat}" data-lon="${it.lon}"><span class="k">${KINDS[it.kind]}</span><div><b>${t("kind." + it.kind)}</b><span class="txt">${esc(it.text)}</span><span class="muted small">${it.when}${it.seed ? " · " + t("community.example") : ""}</span></div><span class="dist">${fmt(it.dist, 1)} km</span></li>`).join("") + `</ul>`;
  };
  html += group(t("community.needs"), HELP) + group(t("community.seen"), ["flood", "heat", "mosquito", "nowater", "landslide", "smoke", "spray", "animal"]);
  html += `<p class="muted small">🐾 ${t("community.animal")}</p><p class="disclaimer">${t("community.disclaimer")}</p>`;
  box.innerHTML = html;
  box.querySelectorAll(".feed li").forEach((li) => (li.onclick = () => map.setView([+li.dataset.lat, +li.dataset.lon], 15)));
  const open = $("#r-open"); if (open) open.onclick = () => { const p = state.pin ? state.pin.getLatLng() : map.getCenter(); openReportForm(p.lat, p.lng); };
  const form = $("#report-form");
  if (form) {
    form.querySelectorAll("input[name=r-kind]").forEach((inp) => (inp.onchange = () => form.querySelectorAll(".pchip").forEach((l) => l.classList.toggle("on", l.contains(inp) && inp.checked || l.querySelector("input").checked))));
    $("#r-cancel").onclick = () => { draft = null; renderCommunity(); };
    form.onsubmit = (e) => {
      e.preventDefault();
      const list = loadReports();
      list.unshift({ id: "u" + Date.now(), kind: form.querySelector("input[name=r-kind]:checked").value, lat: draft.lat, lon: draft.lon, text: $("#r-text").value.trim(), when: new Date().toISOString().slice(0, 10) });
      saveReports(list); draft = null; renderCommunity();
    };
  }
}

/* ---------------- Compare two places ---------------- */
function renderCompare() {
  const a = state.main, b = state.other, box = $("#p-compare");
  let html = `<h2>${t("compare.title")}</h2><p class="muted small">${t("compare.intro")}</p>
    <form id="cmp-form" class="row"><input id="q2" placeholder="${t("compare.placeholder")}" autocomplete="off"><button class="btn">${t("search.go")}</button></form>`;
  if (!a) html += `<p class="muted">${t("need.place")}</p>`;
  else if (b) {
    const cell = (s) => (s && !s.waiting ? `<span class="dv">${headline(s)}</span>${verdictBadge(s)}` : "…");
    const avg = (r, k) => { const s = sig(r, k), x = s && (s.era5 || s.nasa); return x ? fmt(x.recent, s.d) : "…"; };
    const tf = (r) => (r.terrain ? [r.terrain.low && t("terrain.low.short"), r.terrain.steep && t("terrain.steep.short")].filter(Boolean).join(", ") || t("terrain.ok.short") : "…");
    html += `<div class="duel"><div class="duel-head"><span class="eyebrow">A</span><b>${esc(a.label)}</b></div><div class="duel-head"><span class="eyebrow">B</span><b>${esc(b.label)}</b></div>`;
    for (const s of SIGNALS) html += `<p class="duel-t">${t("sig." + s.key)} <small class="muted">${t("compare.recent")}: ${avg(a, s.key)} · ${avg(b, s.key)}</small></p><div class="duel-c">${cell(sig(a, s.key))}</div><div class="duel-c">${cell(sig(b, s.key))}</div>`;
    html += `<p class="duel-t">${t("terrain.title")}</p><div class="duel-c"><span class="dv">${a.terrain ? fmt(a.terrain.elevation, 0) + " m" : "…"}</span><small class="muted">${tf(a)}</small></div><div class="duel-c"><span class="dv">${b.terrain ? fmt(b.terrain.elevation, 0) + " m" : "…"}</span><small class="muted">${tf(b)}</small></div></div><p class="muted small">${t("compare.note")}</p>`;
  }
  box.innerHTML = html + `<div class="capitals-box"></div>`;
  $("#cmp-form").onsubmit = (e) => { e.preventDefault(); const q = $("#q2").value.trim(); if (q) search(q, "other"); };
}

/* ---------------- Boot ---------------- */
$("#search-form").onsubmit = (e) => { e.preventDefault(); const q = $("#q").value.trim(); if (q) search(q); };
$("#gps").onclick = () => {
  if (!navigator.geolocation) return setStatus(t("status.nogps"), true);
  setStatus(t("status.locating"));
  navigator.geolocation.getCurrentPosition((p) => { setStatus(""); analyzeAt(p.coords.latitude, p.coords.longitude); }, () => setStatus(t("status.nogps"), true), { timeout: 10000 });
};
document.querySelectorAll(".tab").forEach((b) => (b.onclick = () => showTab(b.dataset.tab)));
document.querySelectorAll(".lang button").forEach((b) => (b.onclick = () => { I18N.set(b.dataset.lang); render(); }));
fetch("data/giovanni.json").then((r) => r.json()).then((j) => { state.giov = j; if (state.main) render(); }).catch(() => {});
fetch("data/dengue.json").then((r) => r.json()).then((j) => { state.dengue = j; if (state.main) render(); }).catch(() => {});
render();
