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
    year: ["See my year", "Ver mi año", "Ver meu ano"], what: ["What to do", "Qué hacer", "O que fazer"],
  };
  const tx = (k) => TX[k][{ en: 0, es: 1, pt: 2 }[I18N.lang] ?? 0];
  // what each card, each line of the year table, each health topic, each hazard and each guide is about
  const CARD = { "s-week": "heat", "s-next": "mosq", "s-clim": "heat", "s-ground": "w-landslide", year: "heat" };
  const ROW = { heat: "heat", heatill: "heat", food: "heat", cold: "heat", coldill: "heat", flood: "rain", rain: "rain", diarr: "rain", lepto: "w-flood", drought: "w-drought", storm: "lightning", lightning: "lightning", cyclone: "storms", tornado: "twisters", mosquito: "mosq", fire: "smoke", smoke: "smoke", resp: "smoke", asthma: "smoke", slide: "w-landslide", landslide: "w-landslide", quake: "w-quake", volcano: "w-volcano" };
  const TOPIC = { vector: "mosq", heat: "heat", water: "w-flood", resp: "smoke", air: "smoke", wash: "w-drought", cold: "heat" };
  const GUIDE = { heat: "heat", flood: "w-flood", storm: "lightning", drought: "w-drought", tornado: "twisters", cyclone: "storms", wildfire: "smoke", fire: "smoke", landslide: "w-landslide", cold: "heat", quake: "w-quake", earthquake: "w-quake", volcano: "w-volcano" };
  const ZOOM = { heat: 5, rain: 4, smoke: 4, lightning: 6, storms: 4, twisters: 5, green: 6, "w-flood": 6, "w-landslide": 7, "w-drought": 5, "w-quake": 5, "w-volcano": 5 };
  const inPY = (r) => r.lat > -27.7 && r.lat < -19.2 && r.lon > -62.7 && r.lon < -54.2;
  const S = { on: !small() && !STILL, cur: null, idx: 0, idle: 0, hold: 0, btn: null, wait: 0 };

  const tab = () => ($(".tab.on") ? $(".tab.on").dataset.tab : "");
  const ready = () => typeof Timelapse !== "undefined" && typeof state !== "undefined" && state.main && !document.body.classList.contains("tour-on");
  function theme(id) { const r = state.main; return id === "mosq" ? (r && inPY(r) && S.dengue ? "dengue" : "rain") : id; }
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
    if (!S.on || Y.on || !ready() || tab() !== "place" || !$("#simple-place") || Date.now() < S.hold || document.hidden) return;
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
    if (S.place !== state.main) { S.place = state.main; S.cur = null; S.idx = -1; S.scrolled = false; S.idle = Date.now() + 12000; if (Y.on) yearStop(); }
    const yc = $("#s-year", box), yh = yc && $("h3", yc);
    if (yh && $(".yeartab", yc) && !$(".s-yearbtn", yh)) { const b = document.createElement("button"); b.type = "button"; b.className = "s-yearbtn"; b.innerHTML = `${ICON("play")} ${tx("year")}`; b.hidden = Y.on; b.onclick = (e) => { e.stopPropagation(); yearStart(); }; yh.appendChild(b); }
    if (Y.on && yc && !$(".yplay", yc)) yearDraw();
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
      const go = () => { if (S.on && !Y.on && !small()) { touch(); show(theme(id)); } };
      tr.addEventListener("mouseenter", go); tr.addEventListener("focusin", go);
    });
    if (!("IntersectionObserver" in window) || small()) return;
    if (io) io.disconnect();
    io = new IntersectionObserver((es) => {
      const e = es.filter((x) => x.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!e || !S.on || Y.on || !S.scrolled || tab() !== "place" || Date.now() < S.hold) return;
      const cls = Object.keys(CARD).find((c) => (c === "year" ? e.target.id === "s-year" : e.target.classList.contains(c)));
      clearTimeout(S.wait); S.wait = setTimeout(() => show(theme(CARD[cls])), 700);
    }, { threshold: [0.55, 0.85] });
    for (const cls of Object.keys(CARD)) { const c = cls === "year" ? $("#s-year", box) : $("." + cls, box); if (c) io.observe(c); }
  }
  /* ---------- "See my year": the twelve months ahead, one at a time ---------- */
  const Y = { on: false, m: 0, k: 0, timer: 0, playing: false };
  const WORD = { 3: ["very likely", "muy probable", "muito provável"], 2: ["likely", "probable", "provável"], 1: ["can happen", "puede pasar", "pode acontecer"] };
  const lvOf = (v) => (v >= 0.7 ? 3 : v >= 0.45 ? 2 : v >= 0.2 ? 1 : 0);
  function monthOf(m) {
    const r = state.main, P = Extras2.risk(r), ill = Extras2.ill(r), by = (a, b) => b.v - a.v;
    const ev = P.list.filter((z) => !z.ill && z.vals && z.level != null).map((z) => ({ id: z.id, name: I18N.t("rp.n." + z.id), v: z.vals[m] })).filter((x) => x.v >= 0.2).sort(by);
    const il = ill.map((o) => ({ id: o.id, name: o.name.split(" (")[0], v: o.vals[m] })).filter((x) => x.v >= 0.2).sort(by);
    return { ev, il };
  }
  function yearDraw() {
    const card = $("#s-year"); if (!card || !Y.on || !ready()) return;
    let box = $(".yplay", card); const h = $("h3", card);
    if (!box) { box = document.createElement("div"); box.className = "yplay"; (h || card.firstChild).after(box); }
    const m = Y.m, name = new Date(2024, m, 15).toLocaleDateString(I18N.locale ? I18N.locale() : I18N.lang, { month: "long" }), D = monthOf(m), li = { en: 0, es: 1, pt: 2 }[I18N.lang] ?? 0;
    const top = [...D.ev.slice(0, 2), ...D.il.slice(0, 1)].map((x) => x.name.toLowerCase());
    const join = (a) => (a.length > 1 ? a.slice(0, -1).join(", ") + [" and ", " y ", " e "][li] + a[a.length - 1] : a[0]);
    const sum = top.length ? [`In ${name}, what weighs most here: ${join(top)}.`, `En ${name}, lo que más pesa aquí: ${join(top)}.`, `Em ${name}, o que mais pesa aqui: ${join(top)}.`][li] : [`${name} is usually a calm month here.`, `${name} suele ser un mes tranquilo aquí.`, `${name} costuma ser um mês tranquilo aqui.`][li];
    const chips = (a) => a.map((x) => `<span class="yp-chip l${lvOf(x.v)}"><b>${x.name}</b><i>${WORD[lvOf(x.v)][li]}</i></span>`).join("");
    const first = D.ev[0] || D.il[0];
    box.innerHTML = `<div class="yp-top"><b class="yp-month">${name}</b><span class="yp-k">${Y.k + 1} / 12</span><span class="yp-ctl"><button type="button" data-y="prev" aria-label="previous">${ICON("prev")}</button><button type="button" data-y="toggle" aria-label="play or pause">${ICON(Y.playing ? "pause" : "play")}</button><button type="button" data-y="next" aria-label="next">${ICON("next")}</button><button type="button" data-y="close" aria-label="close">${ICON("x")}</button></span></div>`
      + `<div class="yp-bar">${Array.from({ length: 12 }, (_, i) => `<i class="${i <= Y.k ? "on" : ""}"></i>`).join("")}</div><p class="yp-sum">${sum}</p>`
      + (D.ev.length ? `<p class="yp-h">${I18N.t("c.year.ev")}</p><div class="yp-chips">${chips(D.ev)}</div>` : "") + (D.il.length ? `<p class="yp-h">${I18N.t("c.year.ill")}</p><div class="yp-chips">${chips(D.il)}</div>` : "")
      + (first ? `<button type="button" class="s-go" data-go="prepare:rp-${first.id}">${tx("what")} →</button>` : "");
    box.querySelectorAll("[data-y]").forEach((b) => (b.onclick = (e) => { e.stopPropagation(); const a = b.dataset.y; if (a === "close") return yearStop(); if (a === "toggle") { Y.playing = !Y.playing; if (Y.playing && Y.k >= 11) { Y.k = 0; Y.m = new Date().getMonth(); } yearGo(0); return; } Y.playing = false; yearGo(a === "next" ? 1 : -1); }));
    // the column of this month stands out in the table below
    let st = $("#yplay-style"); if (!st) { st = document.createElement("style"); st.id = "yplay-style"; document.head.appendChild(st); }
    st.textContent = `#s-year .yeartab tr > :nth-child(${m + 2}) { box-shadow: inset 0 0 0 2px var(--earth); } #s-year .yeartab tr.grp > :nth-child(${m + 2}) { color: var(--earth); box-shadow: none; }`;
    const b = $(".s-yearbtn", card); if (b) b.hidden = true;
  }
  function yearGo(step) {
    clearTimeout(Y.timer); if (!Y.on) return;
    if (step) { Y.k = Math.max(0, Math.min(11, Y.k + step)); Y.m = (new Date().getMonth() + Y.k) % 12; }
    yearDraw(); touch();
    if (!small() && ready()) { // the map shows the same month of the thing that weighs most
      const D = monthOf(Y.m), id = theme(ROW[(D.ev[0] || D.il[0] || {}).id] || "heat"), m = Y.m, fresh = S.cur !== id;
      show(id); setTimeout(() => { if (Y.on && S.cur === id && Timelapse.at) Timelapse.at(m); }, fresh ? 650 : 0);
    }
    if (Y.playing) { if (Y.k >= 11) { Y.playing = false; yearDraw(); return; } Y.timer = setTimeout(() => yearGo(1), 4200); }
  }
  function yearStart() { Y.on = true; Y.k = 0; Y.m = new Date().getMonth(); Y.playing = !STILL; S.hold = 0; yearGo(0); const c = $("#s-year"); if (c && small()) c.scrollIntoView({ behavior: "smooth", block: "start" }); }
  function yearStop() { Y.on = false; Y.playing = false; clearTimeout(Y.timer); const b = $("#s-year .yplay"); if (b) b.remove(); const st = $("#yplay-style"); if (st) st.remove(); const btn = $("#s-year .s-yearbtn"); if (btn) btn.hidden = false; }

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
      const day = e.target.closest("#p-now .wkrow"); if (day && S.on && !small()) { touch(); S.hold = 0; show(/[1-9]\d*\s*mm/.test(day.textContent) ? "rain" : "heat"); return; }
      // rivers near this address (Health of the region): the plain map, close enough to see them
      if (e.target.closest("#pressure-box") && !e.target.closest("a, button, .rivs li") && ready()) { if (S.cur) { S.cur = null; Timelapse.close(); } const r = state.main; map.setView([r.lat, r.lon], 8, { animate: false }); }
    }, true);
    document.querySelectorAll(".lang button").forEach((x) => x.addEventListener("click", () => setTimeout(() => { label(); document.querySelectorAll(".s-map").forEach((b) => (b.textContent = tx("show"))); document.querySelectorAll(".s-yearbtn").forEach((b) => (b.innerHTML = `${ICON("play")} ${tx("year")}`)); const p = $(".to-planet"); if (p) p.remove(); dress(); if (Y.on) yearDraw(); }, 80)));
    // another section: its own map comes back (the World and Compare sections set their own view)
    document.querySelectorAll(".tab").forEach((x) => x.addEventListener("click", () => { if (Y.on && x.dataset.tab !== "place") { Y.playing = false; clearTimeout(Y.timer); } if (!S.cur) return; S.cur = null; Timelapse.close(); if (!["world", "compare"].includes(x.dataset.tab)) home(); }));
    touch();
    setInterval(() => { if (S.on && ready() && Date.now() - S.idle > 14000) { touch(); rest(); } }, 2000);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
  return { show, set };
})();
