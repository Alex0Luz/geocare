// Trend statistics used by the app. Deterministic, no AI at runtime.
// (Code written with AI assistance; method: Mann-Kendall test + Theil-Sen slope.)
const Stats = (() => {
  function normCdf(z) {
    const t = 1 / (1 + 0.2316419 * Math.abs(z));
    const d = 0.3989422804 * Math.exp((-z * z) / 2);
    const p = d * t * (0.31938153 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
    return z > 0 ? 1 - p : p;
  }

  // Keep only finite pairs.
  function clean(years, values) {
    const t = [], x = [];
    for (let i = 0; i < values.length; i++) {
      if (Number.isFinite(values[i])) { t.push(years[i]); x.push(values[i]); }
    }
    return { t, x };
  }

  // Mann-Kendall test with tie correction. Returns two-sided p-value.
  function mannKendall(x) {
    const n = x.length;
    let s = 0;
    for (let i = 0; i < n - 1; i++) for (let j = i + 1; j < n; j++) s += Math.sign(x[j] - x[i]);
    const counts = new Map();
    for (const v of x) counts.set(v, (counts.get(v) || 0) + 1);
    let tieTerm = 0;
    for (const c of counts.values()) if (c > 1) tieTerm += c * (c - 1) * (2 * c + 5);
    const varS = (n * (n - 1) * (2 * n + 5) - tieTerm) / 18;
    let z = 0;
    if (varS > 0) z = s > 0 ? (s - 1) / Math.sqrt(varS) : s < 0 ? (s + 1) / Math.sqrt(varS) : 0;
    const p = 2 * (1 - normCdf(Math.abs(z)));
    return { n, s, varS, z, p };
  }

  // Theil-Sen slope (per unit of t) with a 95% confidence interval (Gilbert 1987).
  function senSlope(t, x, varS) {
    const slopes = [];
    for (let i = 0; i < x.length - 1; i++)
      for (let j = i + 1; j < x.length; j++)
        if (t[j] !== t[i]) slopes.push((x[j] - x[i]) / (t[j] - t[i]));
    slopes.sort((a, b) => a - b);
    const N = slopes.length;
    if (!N) return { slope: NaN, lo: NaN, hi: NaN, intercept: NaN };
    const med = (arr) => (arr.length % 2 ? arr[(arr.length - 1) / 2] : (arr[arr.length / 2 - 1] + arr[arr.length / 2]) / 2);
    const slope = med(slopes);
    const c = 1.96 * Math.sqrt(Math.max(varS, 0));
    const lo = slopes[Math.max(0, Math.round((N - c) / 2) - 1)];
    const hi = slopes[Math.min(N - 1, Math.round((N + c) / 2))];
    const resid = x.map((v, i) => v - slope * t[i]).sort((a, b) => a - b);
    return { slope, lo, hi, intercept: med(resid) };
  }

  // Full trend summary for an annual series.
  function trend(years, values) {
    const { t, x } = clean(years, values);
    if (x.length < 15) return null;
    const mk = mannKendall(x);
    const sen = senSlope(t, x, mk.varS);
    const mean = (a) => a.reduce((p, c) => p + c, 0) / a.length;
    const first = x.filter((_, i) => t[i] <= t[0] + 9);
    const last = x.filter((_, i) => t[i] >= t[t.length - 1] - 9);
    return {
      n: x.length, p: mk.p, z: mk.z,
      slopeDecade: sen.slope * 10, loDecade: sen.lo * 10, hiDecade: sen.hi * 10,
      intercept: sen.intercept, slope: sen.slope,
      significant: mk.p < 0.05, direction: Math.sign(sen.slope),
      early: mean(first), recent: mean(last), t0: t[0], t1: t[t.length - 1],
    };
  }

  // Combine two independent sources ("witnesses") into one verdict.
  //  confirmed: both significant, same direction
  //  likely:    one significant, the other points the same way
  //  conflict:  they point in opposite directions and at least one is significant
  //  none:      neither is significant
  function verdict(a, b) {
    if (a && b) {
      const same = a.direction === b.direction && a.direction !== 0;
      if (a.significant && b.significant && same) return "confirmed";
      if ((a.significant || b.significant) && same) return "likely";
      if ((a.significant || b.significant) && !same) return "conflict";
      return "none";
    }
    const one = a || b;
    if (!one) return "nodata";
    return one.significant ? "single" : "none";
  }

  function percentile(arr, q) {
    const s = arr.filter(Number.isFinite).sort((a, b) => a - b);
    if (!s.length) return NaN;
    const pos = (s.length - 1) * q, base = Math.floor(pos);
    return s[base] + (s[Math.min(base + 1, s.length - 1)] - s[base]) * (pos - base);
  }

  // Thermal suitability for dengue transmission by Aedes aegypti (0..1).
  // Briere curve between 17.8 and 34.5 C (Mordecai et al. 2017, PLoS NTD). Temperature only: suitability, not cases.
  const AEDES_MIN = 17.8, AEDES_MAX = 34.5;
  const briereRaw = (T) => (T > AEDES_MIN && T < AEDES_MAX ? T * (T - AEDES_MIN) * Math.sqrt(AEDES_MAX - T) : 0);
  let briereMax = 0;
  for (let T = AEDES_MIN; T <= AEDES_MAX; T += 0.01) briereMax = Math.max(briereMax, briereRaw(T));
  const aedes = (T) => briereRaw(T) / briereMax;

  return { trend, verdict, percentile, aedes, mannKendall, senSlope };
})();
