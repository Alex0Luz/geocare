/* geocare.life · the map follows the reading. (code written with AI support)
   The text is on one side and the map on the other. While a person reads a card of "My home", the map plays the moving map
   of that subject; a tap on "Show on the map" (or on a line of the year table) does the same at once; and when nobody touches
   anything for a while, the map goes through the subjects of the place by itself, like a screen at rest.
   In the other sections, opening a subject (a health topic, a hazard, a guide, a day of the week) shows its map too. */
const Follow = (() => {
  const $ = (s, r = document) => r.querySelector(s);
  const small = () => innerWidth <= 820;
  const STILL = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TX = {
    show: ["Show on the map", "Ver en el mapa", "Ver no mapa"],
    on: ["The map follows your reading", "El mapa sigue su lectura", "O mapa segue a sua leitura"],
    off: ["Map following: off", "Mapa siguiendo: apagado", "Mapa seguindo: desligado"],
    planet: ["See the world's rivers on the planet", "Ver los ríos del mundo en el planeta", "Ver os rios do mundo no planeta"],
  };
  const tx = (k) => TX[k][{ en: 0, es: 1, pt: 2 }[I18N.lang] ?? 0];
  // what each card, each line of the year table, each health topic, each hazard and each guide is about
  const CARD = { "s-week": "heat", "s-next": "rain", "s-clim": "heat", "s-ground": "w-landslide", year: "heat" };
  const ROW = { heat: "heat", heatill: "heat", food: "heat", cold: "heat", coldill: "heat", flood: "rain", rain: "rain", diarr: "rain", lepto: "w-flood", drought: "w-drought", storm: "lightning", lightning: "lightning", cyclone: "storms", tornado: "twisters", mosquito: "rain", fire: "smoke", smoke: "smoke", resp: "smoke", asthma: "smoke", slide: "w-landslide", landslide: "w-landslide", quake: "w-quake", volcano: "w-volcano" };
  const TOPIC = { vector: "rain", heat: "heat", water: "w-flood", resp: "smoke", air: "smoke", wash: "w-drought", cold: "heat" };
  const GUIDE = { heat: "heat", flood: "w-flood", storm: "lightning", drought: "w-drought", tornado: "twisters", cyclone: "storms", wildfire: "smoke", fire: "smoke", landslide: "w-landslide", cold: "heat", quake: "w-quake", earthquake: "w-quake", volcano: "w-volcano" };
  const ZOOM = { heat: 5, rain: 4, smoke: 4, lightning: 6, storms: 4, twisters: 5, green: 6, "w-flood": 6, "w-landslide": 7, "w-drought": 5, "w-quake": 5, "w-volcano": 5 };
  const inPY = (r) => r.lat > -27.7 && r.lat < -19.2 && r.lon > -62.7 && r.lon < -54.2;
  const S = { on: !small() && !STILL, cur: null, idx: 0, idle: 0, hold: 0, btn: null, wait: 0 };

  const tab = () => ($(".tab.on") ? $(".tab.on").dataset.tab : "");
  const ready = () => typeof Timelapse !== "undefined" && typeof state !== "undefined" && state.main && !document.body.classList.contains("tour-on");
  function theme(id) { const r = state.main; return id === "rain" && r && inPY(r) && S.dengue ? "dengue" : id; }
  function home() { const r = state.main; if (r) map.setView([r.lat, r.lon], 12, { animate: false }); }
  function show(id, tapped) {
    if (!ready() || !id) return;
    if (tapped && small()) { const m = $("#map"); if (m) m.scrollIntoView({ behavior: "smooth", block: "start" }); }
    if (S.cur === id) return;
    const r = state.main; S.cur = id;
    Timelapse.start(id);
    if (id !== "dengue" && id !== "twisters") map.setView([r.lat, r.lon], Math.min(ZOOM[id] || 5, Timelapse.zmax(id)), { animate: false });
  }
  function list() { const r = state.main, a = ["heat", "rain", "lightning", "smoke", "w-flood", "green"]; if (r && inPY(r)) a.splice(2, 0, "dengue"); return a; }
  function rest() { // nobody touched anything for a while: the next subject of the place (only on "My home")
    if (!S.on || !ready() || tab() !== "place" || !$("#simple-place") || Date.now() < S.hold || document.hidden) return;
    const a = list(); S.idx = (S.idx + 1) % a.length; show(a[S.idx]);
  }
  function touch() { S.idle = Date.now(); }
  function label() { if (S.btn) { S.btn.textContent = tx(S.on ? "on" : "off"); S.btn.classList.toggle("on", S.on); S.btn.hidden = small() || !(typeof state !== "undefined" && state.main); } }
  function set(on) { S.on = on; label(); if (!on && S.cur) { S.cur = null; Timelapse.close(); home(); } }

  // the cards are redrawn every time a piece of data arrives, so the buttons and the watchers are put back each time
  let io = null;
  function dress() {
    label();
    if (typeof state === "undefined" || !state.main) return;
    const press = $("#pressure-box");
    if (press && press.children.length && !$(".to-planet", press)) { // rivers and plastic: the whole world is on the planet view
      const r = state.main, a = document.createElement("a"); a.className = "to-planet"; a.textContent = tx("planet") + " →";
      a.href = `earth/?lang=${I18N.lang}&show=plastic&lat=${r.lat.toFixed(4)}&lon=${r.lon.toFixed(4)}&name=${encodeURIComponent(r.label)}`; press.appendChild(a);
    }
    const box = $("#simple-place"); if (!box) return;
    if (S.place !== state.main) { S.place = state.main; S.cur = null; S.idx = -1; S.scrolled = false; S.idle = Date.now() + 12000; }
    for (const [cls, id] of Object.entries(CARD)) {
      const card = cls === "year" ? $("#s-year", box) : $("." + cls, box); if (!card) continue;
      const h = $("h3", card); if (!h || $(".s-map", h)) continue;
      const b = document.createElement("button"); b.type = "button"; b.className = "s-map"; b.textContent = tx("show"); b.dataset.th = id;
      b.onclick = (e) => { e.stopPropagation(); touch(); S.hold = 0; if (!S.on && !small()) set(true); show(theme(id), true); };
      h.appendChild(b);
    }
    box.querySelectorAll(".yeartab tr[data-go]").forEach((tr) => {
      if (tr.dataset.follow) return; tr.dataset.follow = "1";
      const id = ROW[(tr.dataset.go.split("rp-")[1] || "")] || "heat";
      const go = () => { if (S.on && !small()) { touch(); show(theme(id)); } };
      tr.addEventListener("mouseenter", go); tr.addEventListener("focusin", go);
    });
    if (!("IntersectionObserver" in window) || small()) return;
    if (io) io.disconnect();
    io = new IntersectionObserver((es) => {
      const e = es.filter((x) => x.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!e || !S.on || !S.scrolled || tab() !== "place" || Date.now() < S.hold) return;
      const cls = Object.keys(CARD).find((c) => (c === "year" ? e.target.id === "s-year" : e.target.classList.contains(c)));
      clearTimeout(S.wait); S.wait = setTimeout(() => show(theme(CARD[cls])), 700);
    }, { threshold: [0.55, 0.85] });
    for (const cls of Object.keys(CARD)) { const c = cls === "year" ? $("#s-year", box) : $("." + cls, box); if (c) io.observe(c); }
  }
  // a subject opened in any other section: health topic (topic-…), what usually happens (rp-…), guide (hz-…)
  function opened(d) {
    if (!S.on || small() || !d.open || !d.dataset || !d.dataset.anchor || tab() === "place") return;
    const [kind, ...rest] = d.dataset.anchor.split("-"), key = rest.join("-");
    const id = kind === "topic" ? TOPIC[key] : kind === "rp" ? ROW[key] : kind === "hz" ? GUIDE[key] : null;
    if (id) { touch(); S.hold = 0; show(theme(id)); }
  }

  function init() {
    if (typeof map === "undefined" || typeof L === "undefined") return;
    const C = L.control({ position: "topleft" });
    C.onAdd = () => { const b = (S.btn = L.DomUtil.create("button", "follow-toggle")); b.type = "button"; b.hidden = true; L.DomEvent.disableClickPropagation(b); b.onclick = () => { set(!S.on); touch(); }; return b; };
    C.addTo(map); label();
    // Paraguay has its own moving map of dengue: it is offered only once its data has loaded
    fetch("data/paraguay.json").then((r) => { S.dengue = r.ok; }).catch(() => {});
    let wait = 0; const panels = $(".panels") || document.body;
    new MutationObserver(() => { clearTimeout(wait); wait = setTimeout(dress, 250); }).observe(panels, { childList: true, subtree: true });
    // reading (scrolling the text) wakes the map; moving the map by hand gives it back to the person for a minute
    document.addEventListener("scroll", (e) => { if (e.target && e.target.closest && e.target.closest("#map")) return; S.scrolled = true; touch(); }, true);
    const mine = $("#map");
    ["mousedown", "wheel", "touchstart"].forEach((ev) => mine.addEventListener(ev, (e) => { if (e.target.closest(".follow-toggle, .tl")) return; S.hold = Date.now() + 60000; touch(); }, { passive: true }));
    // "toggle" does not bubble, so it is caught on its way down
    document.addEventListener("toggle", (e) => { if (e.target && e.target.tagName === "DETAILS") opened(e.target); }, true);
    document.addEventListener("click", (e) => {
      // closing the moving map by its own button also switches the following off
      if (e.target.closest(".tl-toggle, .tl-close") && S.on && S.cur) { S.cur = null; S.on = false; label(); return; }
      // a day of "This week": rain if that day brings rain, heat otherwise
      const day = e.target.closest("#p-now .wkrow"); if (day && S.on && !small()) { touch(); S.hold = 0; show(/[1-9]\d*\s*mm/.test(day.textContent) ? theme("rain") : "heat"); return; }
      // rivers near this address (Health of the region): the plain map, close enough to see them
      if (e.target.closest("#pressure-box") && !e.target.closest("a, button, .rivs li") && ready()) { if (S.cur) { S.cur = null; Timelapse.close(); } const r = state.main; map.setView([r.lat, r.lon], 8, { animate: false }); }
    }, true);
    document.querySelectorAll(".lang button").forEach((x) => x.addEventListener("click", () => setTimeout(() => { label(); document.querySelectorAll(".s-map").forEach((b) => (b.textContent = tx("show"))); const p = $(".to-planet"); if (p) p.remove(); dress(); }, 80)));
    // another section: its own map comes back (the World and Compare sections set their own view)
    document.querySelectorAll(".tab").forEach((x) => x.addEventListener("click", () => { if (!S.cur) return; S.cur = null; Timelapse.close(); if (!["world", "compare"].includes(x.dataset.tab)) home(); }));
    touch();
    setInterval(() => { if (S.on && ready() && Date.now() - S.idle > 14000) { touch(); rest(); } }, 2000);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
  return { show, set };
})();
