/* geocare.life · one screen: the planet and the street map share the same place on the page. (code written with AI support)
   The planet view (earth/) is shown where the map is. It is the way in: the whole Earth, today. Choosing a place on it hands
   the place to the app, and the street map takes over, with everything the app draws on it. A switch at the top of the map
   goes back and forth. On a phone the map area is small, so the planet stays a page of its own there. */
const Globe = (() => {
  const small = () => innerWidth <= 820;
  const TX = { globe: ["Planet", "Planeta", "Planeta"], map: ["Map", "Mapa", "Mapa"] };
  const tx = (k) => TX[k][{ en: 0, es: 1, pt: 2 }[I18N.lang] ?? 0];
  let frame = null, mode = "map", bar = null, last = null;
  const host = () => document.getElementById("map");
  const src = (extra = "") => { const m = state.main; return `earth/?embed=1&lang=${I18N.lang}${m ? `&lat=${m.lat.toFixed(4)}&lon=${m.lon.toFixed(4)}` : ""}${extra}`; };
  const post = (msg) => { try { if (frame && frame.contentWindow) frame.contentWindow.postMessage(msg, location.origin); } catch (_) { /* the planet is still loading */ } };
  function label() { if (!bar) return; bar.querySelectorAll("button").forEach((b) => { b.textContent = tx(b.dataset.v); b.classList.toggle("on", b.dataset.v === mode); }); }
  function set(m, extra) {
    if (m === "globe" && small()) return;
    mode = m;
    if (m === "globe") {
      if (!frame) { frame = document.createElement("iframe"); frame.className = "globe-frame"; frame.title = "geocare.life, the planet"; frame.src = src(extra); host().appendChild(frame); }
      else if (extra) frame.src = src(extra);
      else if (state.main) post({ type: "geocare-goto", lat: state.main.lat, lon: state.main.lon });
    }
    if (frame) frame.hidden = m !== "globe";
    document.body.classList.toggle("globe-on", m === "globe"); label();
    if (m === "map" && typeof map !== "undefined") setTimeout(() => map.invalidateSize(), 60);
  }
  function init() {
    if (typeof map === "undefined" || typeof L === "undefined" || !host()) return;
    bar = document.createElement("div"); bar.className = "view-toggle"; bar.innerHTML = `<button type="button" data-v="globe"></button><button type="button" data-v="map"></button>`;
    host().appendChild(bar); L.DomEvent.disableClickPropagation(bar); L.DomEvent.disableScrollPropagation(bar);
    bar.querySelectorAll("button").forEach((b) => (b.onclick = () => set(b.dataset.v)));
    label();
    // a place chosen on the planet becomes the place of the app
    addEventListener("message", (e) => {
      if (e.origin !== location.origin || !e.data || e.data.type !== "geocare-pick") return;
      const lat = +e.data.lat, lon = +e.data.lon; if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) return;
      set("map"); analyzeAt(lat, lon, typeof e.data.name === "string" && e.data.name ? e.data.name.slice(0, 120) : null);
    });
    // the links to the planet open it here instead of on another page
    document.addEventListener("click", (e) => {
      const a = e.target.closest && e.target.closest('a.planet-link, .s-actions a[href^="earth/"], a.to-planet'); if (!a || small()) return;
      e.preventDefault(); set("globe", a.classList.contains("to-planet") ? "&show=plastic" : "");
      if (a.classList.contains("to-planet")) host().scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, true);
    document.querySelectorAll(".lang button").forEach((x) => x.addEventListener("click", () => setTimeout(() => { label(); post({ type: "geocare-lang", lang: I18N.lang }); }, 80)));
    // a new place, however it was chosen, and the guided demonstration both belong to the street map
    setInterval(() => {
      if (state.main !== last) { last = state.main; if (state.main && mode === "globe") set("map"); }
      if (mode === "globe" && document.body.classList.contains("tour-on")) set("map");
    }, 400);
    // the way in: the Earth, unless a place or a demonstration was asked for in the address
    const q = new URLSearchParams(location.search);
    if (!small() && !q.has("demo") && !q.has("lat")) setTimeout(() => { if (!state.main && !document.body.classList.contains("tour-on")) set("globe"); }, 700);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
  return { set, mode: () => mode };
})();
