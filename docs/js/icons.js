/* geocare.life · line icons drawn in SVG (no emoji, so they look the same on every device). (code written with AI support) */
const ICON = (() => {
  const P = {
    heat: '<path d="M10 4a2 2 0 0 1 4 0v9.5a4 4 0 1 1-4 0z"/><path d="M12 9v7"/>',
    flood: '<path d="M3 8c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/><path d="M3 13c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/><path d="M3 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/>',
    storm: '<path d="M7 15a4 4 0 0 1 0-8 5 5 0 0 1 9.6 1A3.5 3.5 0 0 1 17 15z"/><path d="M9 18l-1 3M13 18l-1 3M17 18l-1 3"/>',
    cloud: '<path d="M7 17a4 4 0 0 1 0-8 5 5 0 0 1 9.6 1A3.5 3.5 0 0 1 17 17z"/>',
    cyclone: '<circle cx="12" cy="12" r="2.2"/><path d="M14 10.5c3-2.5 3-5.5 1-7.5"/><path d="M10 13.5c-3 2.5-3 5.5-1 7.5"/><path d="M13.5 14c2.5 3 5.5 3 7.5 1"/><path d="M10.5 10c-2.5-3-5.5-3-7.5-1"/>',
    tornado: '<path d="M4 5h16M6 9h12M8 13h8M10 17h5M12 21h1"/>',
    quake: '<path d="M2 12h4l2-6 3 12 3-9 2 5 1-2h5"/>',
    drought: '<circle cx="12" cy="8" r="3"/><path d="M12 2v1.5M5.5 8H4M20 8h-1.5M7.4 3.4l1 1M16.6 3.4l-1 1"/><path d="M3 19h18M9 19l1-3M15 19l-1-3"/>',
    mosquito: '<ellipse cx="12" cy="13.5" rx="2.2" ry="4.5"/><path d="M12 9V5"/><path d="M10 11.5C6 9.5 4 10.5 4 12.5c2 1 4 1 6 0"/><path d="M14 11.5c4-2 6-1 6 1-2 1-4 1-6 0"/><path d="M10 16l-3.5 3M14 16l3.5 3"/>',
    cold: '<path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9"/><path d="M9.5 4.5L12 7l2.5-2.5M9.5 19.5L12 17l2.5 2.5"/>',
    mountain: '<path d="M3 19l6-11 4 6 2-3 6 8z"/>',
    fire: '<path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3.500 2-4.500 0 2 1 3 2 3 0-3-1-5 1-8.500z"/>',
    bolt: '<path d="M13 2L5 13h6l-1 9 8-12h-6z"/>',
    lungs: '<path d="M12 4v8"/><path d="M12 12c-1-3-6-3-7 2v4c0 1 1 2 2 2s3-1 4-3c1-1 1-3 1-5"/><path d="M12 12c1-3 6-3 7 2v4c0 1-1 2-2 2s-3-1-4-3c-1-1-1-3-1-5"/>',
    drop: '<path d="M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11z"/>',
    nowater: '<path d="M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11z"/><path d="M4 4l16 16"/>',
    wind: '<path d="M3 8h10a3 3 0 1 0-3-3"/><path d="M3 12h15a3 3 0 1 1-3 3"/><path d="M3 16h7"/>',
    heart: '<path d="M12 20s-7-4.500-7-10a4 4 0 0 1 7-2.500A4 4 0 0 1 19 10c0 5.500-7 10-7 10z"/>',
    box: '<path d="M4 8l8-4 8 4v8l-8 4-8-4z"/><path d="M4 8l8 4 8-4M12 12v8"/>',
    link: '<circle cx="9" cy="12" r="4.500"/><circle cx="15" cy="12" r="4.500"/>',
    paw: '<ellipse cx="12" cy="15.5" rx="4" ry="3"/><circle cx="6.500" cy="11" r="1.500"/><circle cx="10" cy="7.500" r="1.500"/><circle cx="14" cy="7.500" r="1.500"/><circle cx="17.500" cy="11" r="1.500"/>',
    spray: '<path d="M5 6h7v4H5z"/><path d="M12 8h3"/><path d="M17.500 5.500l3-1.500M17.500 8H21M17.500 10.500l3 1.500"/><path d="M6.500 10v9h4v-9"/>',
    shield: '<path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/><path d="M12 9v6M9 12h6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    pin: '<path d="M12 21s-6-5.500-6-10.500a6 6 0 0 1 12 0C18 15.500 12 21 12 21z"/><circle cx="12" cy="10.500" r="2"/>',
    alert: '<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17v.5"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    home: '<path d="M4 11l8-7 8 7"/><path d="M6 10v9h12v-9"/><path d="M10 19v-5h4v5"/>',
    calendar: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M8 3v4M16 3v4"/>',
    pulse: '<path d="M2 12h4l2-6 3 12 3-9 2 5 1-2h5"/>',
    replay: '<path d="M4 12a8 8 0 1 0 2.500-5.800"/><path d="M4 4v4.500h4.500"/>',
  };
  // solid shapes for the player buttons
  const F = { play: '<path d="M7 4.500v15l12-7.500z"/>', pause: '<path d="M6 4.500h4v15H6zM14 4.500h4v15h-4z"/>', next: '<path d="M4 5v14l8-7zM12 5v14l8-7z"/>', prev: '<path d="M20 5v14l-8-7zM12 5v14l-8-7z"/>' };
  return (name) => (F[name] ? `<svg class="ic fill" viewBox="0 0 24 24" aria-hidden="true">${F[name]}</svg>` : `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${P[name] || P.alert}</svg>`);
})();
