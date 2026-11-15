/* geocare.life · guided demonstrations
   A set of short demonstrations of the real app, each with a caption ("this is how a family can know ...").
   Nothing here is recorded: the tour drives the same functions a person would use, with live data.
   Start: the "Demo" button, or ?demo=1 in the address (optionally &lang=es and ?demo=3 to start at the third one).
   Keys: Space pauses, right/left arrows (or PageDown/PageUp) change demonstration, Esc closes. (code written with AI support) */
const Tour = (() => {
  const CDE = [-25.5097, -54.6111, "Ciudad del Este, Paraguay"], SAO = [-23.5505, -46.6333, "São Paulo, Brazil"], DEL = [28.6139, 77.209, "New Delhi, India"], ASU = [-25.2637, -57.5759, "Asunción, Paraguay"], MEX = [19.4326, -99.1332, "Mexico City, Mexico"];
  const MIA = [25.7617, -80.1918, "Miami, Florida"], PHX = [33.4484, -112.074, "Phoenix, Arizona"], OKC = [35.4676, -97.5164, "Oklahoma City, Oklahoma"], LAX = [34.0522, -118.2437, "Los Angeles, California"];
  const PLACES = [MIA, PHX, ASU, CDE, OKC, LAX];
  const UI = {
    btn: ["Watch the demo", "Ver la demostración", "Ver a demonstração"], end: ["geocare.life: know the risks of your place before they make you sick.", "geocare.life: conocé los riesgos de tu lugar antes de que te enfermen.", "geocare.life: conheça os riscos do seu lugar antes que eles adoeçam você."],
    endc: ["Open data from NASA, NOAA, USGS, Copernicus and the UN. \"Confirmed\" only when two independent datasets agree. Health answers stay on your device.", "Datos abiertos de NASA, NOAA, USGS, Copernicus y la ONU. \"Confirmado\" solo cuando dos bases independientes coinciden. Sus respuestas de salud quedan en su dispositivo.", "Dados abertos da NASA, NOAA, USGS, Copernicus e ONU. \"Confirmado\" só quando duas bases independentes concordam. Suas respostas de saúde ficam no seu aparelho."],
    again: ["Play again", "Ver de nuevo", "Ver de novo"], close: ["Close", "Cerrar", "Fechar"], load: ["loading live data…", "cargando datos en vivo…", "carregando dados ao vivo…"],
  };
  const li = () => ({ en: 0, es: 1, pt: 2 }[I18N.lang] ?? 0), tx = (a) => a[li()];
  let run = 0, paused = false, di = 0, box = null, focused = null;

  // waits that stop when the person jumps to another demonstration, and hold while paused
  const sleep = (ms, my) => new Promise((res, rej) => { let left = ms; const iv = setInterval(() => { if (my !== run) { clearInterval(iv); rej(new Error("tour")); } else if (!paused) { left -= 100; if (left <= 0) { clearInterval(iv); res(); } } }, 100); });
  const until = (f, max, my) => new Promise((res, rej) => { const t0 = Date.now(), iv = setInterval(() => { if (my !== run) { clearInterval(iv); rej(new Error("tour")); } else if (f() || Date.now() - t0 > max) { clearInterval(iv); res(); } }, 200); });
  const $1 = (s) => document.querySelector(s);
  function focus(sel) {
    if (focused) focused.classList.remove("tour-focus");
    focused = typeof sel === "string" ? $1(sel) : sel; if (!focused) return;
    for (let d = focused.parentElement && focused.parentElement.closest("details"); d; d = d.parentElement && d.parentElement.closest("details")) d.open = true; // the specialist data sits in a collapsed block
    if (focused.tagName === "DETAILS") focused.open = true;
    focused.scrollIntoView({ behavior: "smooth", block: "center" }); focused.classList.add("tour-focus");
  }
  async function place(p, my) {
    if (state.main && state.main.label === p[2]) return;
    cap(UI.load); const q = $1("#q"); q.value = "";
    for (const ch of p[2]) { q.value += ch; await sleep(30, my); }
    analyzeAt(p[0], p[1], p[2]); const r = state.main;
    await until(() => r.nasad !== undefined && r.now !== undefined && r.nasa !== undefined, 14000, my); await sleep(700, my);
  }
  const tab = async (name, my) => { showTab(name); await sleep(250, my); };
  const go = async (name, anchor, my) => { goTo(name, anchor); await sleep(350, my); focus(`#p-${name} [data-anchor="${anchor}"]`); };
  const motion = async (id, my) => {
    if (focused) focused.classList.remove("tour-focus"); Timelapse.start(id);
    const m = $1("#map"); if (m && innerWidth <= 820) m.scrollIntoView({ behavior: "smooth", block: "start" }); // on a phone the map sits above the panel
    await sleep(600, my);
  };
  const still = () => Timelapse.close();
  // every demonstration keeps an animation running on the map beside the panel
  const PYV = [-23.4, -58.4, 6];
  const anim = async (id, view, my) => { Timelapse.start(id); if (view) { map.invalidateSize(); map.setView([view[0], view[1]], Math.min(view[2], Timelapse.zmax ? Timelapse.zmax(id) : view[2]), { animate: false }); } await sleep(400, my); };
  const lookMap = async (my) => { if (focused) focused.classList.remove("tour-focus"); const m = $1("#map"); if (m && innerWidth <= 820) m.scrollIntoView({ behavior: "smooth", block: "start" }); await sleep(200, my); };

  // each demonstration: a caption that says who it serves, and steps that use the real app
  const DEMOS = [
    { head: ["This is how a family can know what the coming months bring to their home.", "Así es como una familia puede saber qué traen los próximos meses a su casa.", "É assim que uma família pode saber o que os próximos meses trazem para a sua casa."],
      steps: [
        { cap: ["It starts with an address. geocare.life answers in plain words what this week means for you.", "Todo empieza con una dirección. geocare.life responde en palabras simples qué significa esta semana para usted.", "Tudo começa com um endereço. O geocare.life responde em palavras simples o que esta semana significa para você."], ms: 4000, run: async (my) => { await place(MIA, my); await anim("storms", [25, -76, 5], my); await tab("place", my); focus("#simple-place .s-week"); } },
        { cap: ["Your year in one table: what to watch in each month, the weather and the illnesses.", "Su año en una tabla: qué vigilar en cada mes, el clima y las enfermedades.", "O seu ano em uma tabela: o que observar em cada mês, o clima e as doenças."], ms: 4000, run: async () => focus("#s-year") },
        { cap: ["Has the climate changed here? 45 years of NASA data, tested. It says so only when two independent datasets agree.", "¿Cambió el clima aquí? 45 años de datos de la NASA, evaluados. Lo dice solo cuando dos bases independientes coinciden.", "O clima mudou aqui? 45 anos de dados da NASA, testados. Só diz que mudou quando duas bases independentes concordam."], ms: 4500, run: async () => focus("#simple-place .s-clim") },
        { cap: ["And lightning: how many flashes a year and in which months, counted from orbit by a NASA sensor.", "Y los rayos: cuántos al año y en qué meses, contados desde la órbita por un sensor de la NASA.", "E os raios: quantos por ano e em quais meses, contados da órbita por um sensor da NASA."], ms: 5000, run: async (my) => { await anim("lightning", [27.5, -81, 6], my); await go("prepare", "rp-lightning", my); } },
      ] },
    { head: ["This is how someone who takes medicines knows what a hot week means for their body.", "Así es como una persona que toma remedios sabe qué significa una semana de calor para su cuerpo.", "É assim que uma pessoa que toma remédios sabe o que uma semana de calor significa para o seu corpo."],
      steps: [
        { cap: ["This week at the address: heat index, rain, air quality and the river.", "Esta semana en la dirección: índice de calor, lluvia, calidad del aire y el río.", "Esta semana no endereço: índice de calor, chuva, qualidade do ar e o rio."], ms: 3800, run: async (my) => { await place(PHX, my); await anim("heat", [34, -112, 5], my); await tab("now", my); focus("#p-now .wk"); } },
        { cap: ["A private profile (here: age 60 to 74, high blood pressure, a diuretic) sets the heat traffic light and says why.", "Un perfil privado (aquí: 60 a 74 años, hipertensión, un diurético) define el semáforo de calor y dice por qué.", "Um perfil privado (aqui: 60 a 74 anos, pressão alta, um diurético) define o semáforo de calor e diz por quê."], ms: 4800, run: async (my) => { Extras.preview({ age: "60-74", on: ["hta", "diuretic"] }); render(); await tab("health", my); focus("#me-box .lighthero"); } },
        { cap: ["It never says to stop a medicine. It says to talk to the doctor, and keeps emergency numbers one tap away.", "Nunca dice que suspenda un remedio. Dice que hable con su médico, y deja los números de emergencia a un toque.", "Nunca manda parar um remédio. Manda conversar com o médico, e deixa os telefones de emergência a um toque."], ms: 4300, run: async () => focus("#me-box .notice") },
      ], done: () => { Extras.preview(null); render(); } },
    { head: ["This is how a health unit or a city hall can know which illnesses to prepare for in its region.", "Así es como una unidad de salud o una municipalidad puede saber para qué enfermedades prepararse en su región.", "É assim que uma unidade de saúde ou uma prefeitura pode saber para quais doenças se preparar na sua região."],
      steps: [
        { cap: ["Seasonal illnesses expected from the climate: dengue season, respiratory infections, diarrhoea after floods.", "Enfermedades de temporada esperadas por el clima: dengue, infecciones respiratorias, diarrea después de inundaciones.", "Doenças sazonais esperadas pelo clima: dengue, infecções respiratórias, diarreia depois de enchentes."], ms: 4000, run: async (my) => { await place(ASU, my); await anim("dengue", null, my); await go("prepare", "rp-mosquito", my); } },
        { cap: ["With the share of sewage that is safely treated in the country.", "Con la proporción de aguas servidas que se trata de forma segura en el país.", "Com a parcela do esgoto que é tratada com segurança no país."], ms: 3500, run: async (my) => go("prepare", "rp-diarr", my) },
        { cap: ["Reported dengue in each department of Paraguay, month by month, 2019 to 2023.", "Dengue notificado en cada departamento del Paraguay, mes a mes, de 2019 a 2023.", "Dengue notificada em cada departamento do Paraguai, mês a mês, de 2019 a 2023."], ms: 6500, run: async (my) => lookMap(my) },
        { cap: ["And 31 national health indicators tested for trend: vaccination, causes of death, water and sanitation.", "Y 31 indicadores nacionales de salud con prueba de tendencia: vacunación, causas de muerte, agua y saneamiento.", "E 31 indicadores nacionais de saúde com teste de tendência: vacinação, causas de morte, água e saneamento."], ms: 3500, run: async (my) => { await tab("region", my); focus("#p-region .stats3"); } },
      ] },
    { head: ["This is how a farmer can know when to spray, which dry months are coming and what pressure is on the water.", "Así es como un agricultor puede saber cuándo pulverizar, qué meses secos vienen y qué presión hay sobre el agua.", "É assim que um agricultor pode saber quando pulverizar, quais meses secos vêm e que pressão existe sobre a água."],
      steps: [
        { cap: ["Hours of this week inside the legal limits for spraying: temperature, humidity and wind.", "Horas de esta semana dentro de los límites legales para pulverizar: temperatura, humedad y viento.", "Horas desta semana dentro dos limites legais para pulverizar: temperatura, umidade e vento."], ms: 4000, run: async (my) => { await place(CDE, my); await anim("green", PYV, my); await tab("now", my); focus("#p-now details.spray"); } },
        { cap: ["The dry season of this address: the longest run without rain and its months.", "La estación seca de esta dirección: la racha más larga sin lluvia y sus meses.", "A estação seca deste endereço: a maior sequência sem chuva e os seus meses."], ms: 3500, run: async (my) => go("prepare", "rp-drought", my) },
        { cap: ["In the country: pesticide use and bans, water quality, sewage treatment, forest lost since 1990.", "En el país: uso y prohibición de plaguicidas, calidad del agua, tratamiento de aguas servidas, bosque perdido desde 1990.", "No país: uso e proibição de agrotóxicos, qualidade da água, tratamento de esgoto, floresta perdida desde 1990."], ms: 4500, run: async (my) => go("region", "pressures", my) },
        { cap: ["On the map: the river mouths that carry the most plastic to the sea (model estimates).", "En el mapa: las desembocaduras que más plástico llevan al mar (estimaciones de modelo).", "No mapa: as fozes que mais levam plástico ao mar (estimativas de modelo)."], ms: 4000, run: async (my) => { await tab("world", my); const b = $1('.wmode [data-m="rivers"]'); if (b) b.click(); await anim("smoke", [-12, -42, 4], my); focus("#p-world .tblwrap"); } },
      ], done: () => { const b = $1('.wmode [data-m="climate"]'); if (b) b.click(); } },
    { head: ["This is how a family choosing where to live can see what each place has to face.", "Así es como una familia que elige dónde vivir puede ver qué enfrenta cada lugar.", "É assim que uma família que escolhe onde morar pode ver o que cada lugar enfrenta."],
      steps: [
        { cap: ["Any address in the world. Here: Oklahoma City, in the tornado country of the United States.", "Cualquier dirección del mundo. Aquí: Oklahoma City, en la región de tornados de Estados Unidos.", "Qualquer endereço do mundo. Aqui: Oklahoma City, na região de tornados dos Estados Unidos."], ms: 3000, run: async (my) => { await place(OKC, my); await anim("twisters", [36, -96, 5], my); await tab("place", my); focus("#expect-box"); } },
        { cap: ["Tornadoes: how many per decade, the usual months and how many were violent.", "Tornados: cuántos por década, los meses habituales y cuántos fueron violentos.", "Tornados: quantos por década, os meses habituais e quantos foram violentos."], ms: 4500, run: async (my) => go("prepare", "rp-tornado", my) },
        { cap: ["On the map: the tornado season month by month, from the NOAA record since 1981.", "En el mapa: la temporada de tornados mes a mes, según el registro de la NOAA desde 1981.", "No mapa: a temporada de tornados mês a mês, pelo registro da NOAA desde 1981."], ms: 4500, run: async (my) => lookMap(my) },
        { cap: ["And where they usually happen, with the paths of the strongest ones.", "Y dónde suelen ocurrir, con las trayectorias de los más fuertes.", "E onde costumam acontecer, com as trajetórias dos mais fortes."], ms: 4000, run: async (my) => { await lookMap(my); await anim("w-tornado", [36, -94, 5], my); } },
      ] },
    { head: ["This is how a city hall or a company can find what to do, with evidence.", "Así es como una municipalidad o una empresa puede encontrar qué hacer, con evidencia.", "É assim que uma prefeitura ou uma empresa pode encontrar o que fazer, com evidência."],
      steps: [
        { cap: ["Actions ordered by what the data show for this place, each with its source.", "Acciones ordenadas según lo que muestran los datos del lugar, cada una con su fuente.", "Ações ordenadas pelo que os dados mostram para o lugar, cada uma com a sua fonte."], ms: 4300, run: async (my) => { await place(LAX, my); await anim("smoke", [37, -119, 5], my); await tab("act", my); focus("#p-act .acts"); } },
        { cap: ["Real cases from around the world: what went wrong and what is recovering.", "Casos reales del mundo: lo que salió mal y lo que se está recuperando.", "Casos reais do mundo: o que deu errado e o que está se recuperando."], ms: 4000, run: async () => focus(document.querySelector('#p-act details.case[data-lat="-25.5"]') || "#p-act details.case") }, // the case of eastern Paraguay, so the map stays at home
        { cap: ["And a channel for what neighbours see: flooding, mosquito sites, where help is needed (prototype).", "Y un canal para lo que ven los vecinos: inundaciones, criaderos, dónde hace falta ayuda (prototipo).", "E um canal para o que os vizinhos veem: alagamento, criadouros, onde falta ajuda (protótipo)."], ms: 3800, run: async (my) => { await tab("community", my); focus("#p-community .stats3"); } },
      ] },
    { head: ["This is how anyone can watch the Earth change.", "Así es como cualquier persona puede ver cambiar la Tierra.", "É assim que qualquer pessoa pode ver a Terra mudar."],
      steps: [
        { cap: ["Land use from 2001 to 2024, from NASA's MODIS: forest giving way to crops and pasture.", "Uso de la tierra de 2001 a 2024, de MODIS de la NASA: el bosque da paso a cultivos y pasturas.", "Uso da terra de 2001 a 2024, do MODIS da NASA: a floresta dando lugar a lavoura e pasto."], ms: 7500, run: async (my) => { await tab("place", my); await anim("land", [-14, -56, 4], my); await lookMap(my); } },
        { cap: ["Rain over the whole planet, month by month.", "La lluvia en todo el planeta, mes a mes.", "A chuva no planeta inteiro, mês a mês."], ms: 5000, run: async (my) => anim("rain", [10, 10, 2], my) },
        { cap: ["And the same trend test on 300 cities of the world.", "Y la misma prueba de tendencia en 300 ciudades del mundo.", "E o mesmo teste de tendência em 300 cidades do mundo."], ms: 4000, run: async (my) => { await tab("world", my); await anim("heat", null, my); focus("#p-world .stats3"); } },
      ] },
  ];

  function cap(a) { const c = box && box.querySelector(".tour-cap"); if (c) c.textContent = tx(a); }
  function paint(ended) {
    if (!box) return;
    const d = DEMOS[di];
    box.innerHTML = `<div class="tour-top"><span class="tour-n">${ended ? "geocare.life" : `${di + 1} / ${DEMOS.length}`}</span><span class="tour-ctl">${ended ? `<button type="button" data-t="again">${ICON("replay")} ${tx(UI.again)}</button>` : `<button type="button" data-t="prev" aria-label="previous">${ICON("prev")}</button><button type="button" data-t="pause" aria-label="pause">${ICON(paused ? "play" : "pause")}</button><button type="button" data-t="next" aria-label="next">${ICON("next")}</button>`}<button type="button" data-t="close" aria-label="${tx(UI.close)}">${ICON("x")}</button></span></div>
      <p class="tour-head">${ended ? tx(UI.end) : tx(d.head)}</p><p class="tour-cap">${ended ? tx(UI.endc) : ""}</p>${ended ? "" : `<div class="tour-bar">${DEMOS.map((_, i) => `<i class="${i < di ? "done" : i === di ? "on" : ""}"></i>`).join("")}</div>`}`;
    box.querySelectorAll("[data-t]").forEach((b) => (b.onclick = () => act(b.dataset.t)));
  }
  function tidy(i) { const d = DEMOS[i]; if (d && d.done) { try { d.done(); } catch (_) { /* nothing to undo */ } } if (focused) { focused.classList.remove("tour-focus"); focused = null; } }
  async function play(i) {
    const my = ++run; tidy(di); paused = false;
    try {
      for (di = i; di < DEMOS.length; di++) {
        paint();
        for (const s of DEMOS[di].steps) { await s.run(my); if (my !== run) return; cap(s.cap); await sleep(s.ms, my); }
        tidy(di);
      }
      di = DEMOS.length - 1; still(); showTab("place"); paint(true);
    } catch (e) { if (e.message !== "tour") console.warn("tour", e); }
  }
  function close() { run++; tidy(di); still(); if (box) { box.remove(); box = null; } document.body.classList.remove("tour-on"); }
  function act(a) {
    if (a === "close") close();
    else if (a === "pause") { paused = !paused; const b = box.querySelector('[data-t="pause"]'); if (b) b.innerHTML = ICON(paused ? "play" : "pause"); }
    else if (a === "next") { if (di + 1 < DEMOS.length) play(di + 1); else { run++; tidy(di); still(); paint(true); } }
    else if (a === "prev") play(Math.max(0, di - 1));
    else if (a === "again") play(0);
  }
  function start(i = 0) {
    if (!box) { box = document.createElement("div"); box.className = "tour"; box.setAttribute("role", "status"); document.body.append(box); document.body.classList.add("tour-on"); }
    PLACES.forEach((p, k) => setTimeout(() => { fetchNasaDaily(p[0], p[1]).catch(() => {}); fetchNasa(p[0], p[1]).catch(() => {}); }, 400 + k * 1500));
    play(Math.max(0, Math.min(DEMOS.length - 1, i)));
  }
  document.addEventListener("keydown", (e) => {
    if (!box || /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    const k = { " ": "pause", ArrowRight: "next", PageDown: "next", ArrowLeft: "prev", PageUp: "prev", Escape: "close" }[e.key];
    if (k) { e.preventDefault(); act(k); }
  });
  document.addEventListener("click", (e) => { if (e.target.closest("[data-demo]")) { e.preventDefault(); start(0); } });
  window.addEventListener("load", () => {
    const b = document.createElement("button"); b.type = "button"; b.className = "demo-btn"; b.dataset.demo = "1";
    const lab = () => { b.innerHTML = `${ICON("play")} <span>${tx(UI.btn)}</span>`; }; lab();
    const how = document.createElement("a"); how.className = "howto-link";
    const howLab = () => { how.textContent = tx(["How to use geocare.life", "Cómo usar geocare.life", "Como usar o geocare.life"]); how.href = "tutorial/?lang=" + I18N.lang; }; howLab();
    // the planet view: the whole Earth today, and the place of this address on it
    const pl = document.createElement("a"); pl.className = "planet-link";
    const plLab = () => { const m = state.main; pl.innerHTML = `${ICON("cyclone")} <span>${tx(["See the planet", "Ver el planeta", "Ver o planeta"])}</span>`; pl.href = "earth/?lang=" + I18N.lang + (m ? `&lat=${m.lat.toFixed(4)}&lon=${m.lon.toFixed(4)}&name=${encodeURIComponent(m.label)}` : ""); }; plLab();
    pl.addEventListener("pointerdown", plLab); pl.addEventListener("focus", plLab);
    const foot = $1(".rail-foot"); if (foot) { foot.prepend(how); foot.prepend(pl); foot.prepend(b); }
    document.querySelectorAll(".lang button").forEach((x) => x.addEventListener("click", () => setTimeout(() => { lab(); howLab(); plLab(); if (box) paint(); }, 50)));
    const q = new URLSearchParams(location.search), d = q.get("demo");
    // a place handed over by the planet view: ?lat=..&lon=..&name=..
    const la = parseFloat(q.get("lat")), lo = parseFloat(q.get("lon"));
    if (!d && Number.isFinite(la) && Number.isFinite(lo) && Math.abs(la) <= 90 && Math.abs(lo) <= 180) { const l = q.get("lang"); if (l) { I18N.set(l); render(); lab(); howLab(); } setTimeout(() => analyzeAt(la, lo, q.get("name") || null), 500); }
    if (d) { const l = q.get("lang"); if (l) { I18N.set(l); render(); lab(); } setTimeout(() => start((parseInt(d, 10) || 1) - 1), 900); }
  });
  return { start, close };
})();
