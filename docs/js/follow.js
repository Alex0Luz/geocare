/* geocare.life · the map follows the reading. (code written with AI support)
   On the "My home" page the text is on one side and the map on the other. While a person reads a card, the map plays the
   moving map of that subject; a tap on "Show on the map" (or on a line of the year table) does the same at once; and when
   nobody touches anything for a while, the map goes through the subjects of the place by itself, like a screen at rest. */
const Follow = (() => {
  const $ = (s, r = document) => r.querySelector(s);
  const small = () => innerWidth <= 820;
  const STILL = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TX = {
    show: ["Show on the map", "Ver en el mapa", "Ver no mapa"],
    on: ["The map follows your reading", "El mapa sigue su lectura", "O mapa segue a sua leitura"],
    off: ["Map following: off", "Mapa siguiendo: apagado", "Mapa seguindo: desligado"],
  };
  const tx = (k) => TX[k][{ en: 0, es: 1, pt: 2 }[I18N.lang] ?? 0];
  // what each card and each line of the year table is about
  const CARD = { "s-week": "heat", "s-next": "rain", "s-clim": "heat", "s-ground": "w-landslide", year: "heat" };
  const ROW = { heat: "heat", heatill: "heat", food: "heat", cold: "heat", coldill: "heat", flood: "rain", rain: "rain", diarr: "rain", lepto: "w-flood", drought: "w-drought", storm: "lightning", lightning: "lightning", cyclone: "storms", tornado: "twisters", mosquito: "rain", fire: "smoke", smoke: "smoke", resp: "smoke", asthma: "smoke", slide: "w-landslide" };
  const ZOOM = { heat: 5, rain: 4, smoke: 4, lightning: 6, storms: 4, twisters: 5, green: 6, "w-flood": 6, "w-landslide": 7, "w-drought": 5 };
  const inPY = (r) => r.lat > -27.7 && r.lat < -19.2 && r.lon > -62.7 && r.lon < -54.2;
  const S = { on: !small() && !STILL, cur: null, idx: 0, idle: 0, hold: 0, t: 0, btn: null, wait: 0 };

  const ready = () => typeof Timelapse !== "undefined" && typeof state !== "undefined" && state.main && !document.body.classList.contains("tour-on") && $(".tab.on") && $(".tab.on").dataset.tab === "place" && $("#simple-place");
  function theme(id) { const r = state.main; return id === "rain" && r && inPY(r) && S.dengue ? "dengue" : id; }
  function show(id, tapped) {
    if (!ready() || !id) return;
    if (tapped && small()) { const m = $("#map"); if (m) m.scrollIntoView({ behavior: "smooth", block: "start" }); }
    if (S.cur === id) return;
    const r = state.main; S.cur = id; S.self = Date.now();
    Timelapse.start(id);
    if (id !== "dengue" && id !== "twisters") map.setView([r.lat, r.lon], Math.min(ZOOM[id] || 5, Timelapse.zmax(id)), { animate: false });
  }
  function list() { const r = state.main, a = ["heat", "rain", "lightning", "smoke", "w-flood", "green"]; if (r && inPY(r)) a.splice(2, 0, "dengue"); return a; }
  function rest() { // nobody touched anything for a while: the next subject of the place
    if (!S.on || !ready() || Date.now() < S.hold || document.hidden) return;
    const a = list(); S.idx = (S.idx + 1) % a.length; show(a[S.idx]);
  }
  function touch() { S.idle = Date.now(); }
  function label() { if (S.btn) { S.btn.textContent = tx(S.on ? "on" : "off"); S.btn.classList.toggle("on", S.on); S.btn.hidden = small() || !(typeof state !== "undefined" && state.main); } }
  function set(on) {
    S.on = on; label();
    if (!on && S.cur) { S.cur = null; Timelapse.close(); const r = state.main; if (r) map.setView([r.lat, r.lon], 12, { animate: false }); }
  }

  // the cards are redrawn every time a piece of data arrives, so the buttons and the watchers are put back each time
  let io = null;
  function dress() {
    const box = $("#simple-place"); if (!box || typeof state === "undefined" || !state.main) { label(); return; }
    label();
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
      if (!e || !S.on || !S.scrolled || Date.now() < S.hold) return;
      const cls = Object.keys(CARD).find((c) => (c === "year" ? e.target.id === "s-year" : e.target.classList.contains(c)));
      clearTimeout(S.wait); S.wait = setTimeout(() => show(theme(CARD[cls])), 700);
    }, { threshold: [0.55, 0.85] });
    for (const cls of Object.keys(CARD)) { const c = cls === "year" ? $("#s-year", box) : $("." + cls, box); if (c) io.observe(c); }
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
    // closing the moving map by its own button also switches the following off
    document.addEventListener("click", (e) => { if (e.target.closest(".tl-toggle, .tl-close") && S.on && S.cur) { S.cur = null; S.on = false; label(); } }, true);
    document.querySelectorAll(".lang button").forEach((x) => x.addEventListener("click", () => setTimeout(() => { label(); document.querySelectorAll(".s-map").forEach((b) => (b.textContent = tx("show"))); }, 80)));
    document.querySelectorAll(".tab").forEach((x) => x.addEventListener("click", () => { if (S.cur && x.dataset.tab !== "place") { S.cur = null; Timelapse.close(); const r = state.main; if (r) map.setView([r.lat, r.lon], 12, { animate: false }); } }));
    touch();
    setInterval(() => { if (S.on && ready() && Date.now() - S.idle > 14000) { touch(); rest(); } }, 2000);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
  return { show, set };
})();
