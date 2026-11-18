/* Luna – Mathe „Terme mit einer Variablen“ · Aufgaben
   Schreibweise: {3/4} = Bruch, · = mal, − = minus, Komma = Dezimalzeichen.
   Feldtypen k: num (Zahl), simp (vereinfachter Term), term (beliebiger gleichwertiger Term),
   fac (ausklammern, kk = größtmögliche Zahl), sel (Auswahl, a = Index/Indizes), pair (□/△-Felder).
   at: {x: 3} nur für die automatische Lösungsprüfung (verify). */
(function () {
  "use strict";

  // ---------------------------------------------------------------- Abbildungen (SVG)
  const S = 'xmlns="http://www.w3.org/2000/svg" font-family="-apple-system, Segoe UI, Roboto, Arial, sans-serif" font-size="15" font-weight="700"';
  const FILL = 'fill="#e3f9ff" stroke="#0069a8" stroke-width="2.5"';
  const dim = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#a34d00" stroke-width="1.5" marker-start="url(#ar)" marker-end="url(#ar)"/>`;
  const defs = '<defs><marker id="ar" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,1 L9,5 L0,9 z" fill="#a34d00"/></marker></defs>';
  const txt = (x, y, s, anchor) => `<text x="${x}" y="${y}" fill="#a34d00" text-anchor="${anchor || "middle"}">${s}</text>`;

  function mosaic() {
    const u = 22, x0 = 30, y0 = 12, top = 6, extra = 4;
    let s = "";
    const tile = (c, r) => `<rect x="${x0 + c * u}" y="${y0 + r * u}" width="${u}" height="${u}" fill="#7de8ff" stroke="#0069a8" stroke-width="1.2"/>`;
    for (let r = 0; r < 5; r++) for (let c = 0; c < top; c++) s += tile(c, r);
    for (let r = 5; r < 7; r++) for (let c = 0; c < top + extra; c++) s += tile(c, r);
    s += dim(x0, y0 + 7 * u + 12, x0 + top * u, y0 + 7 * u + 12) + txt(x0 + top * u / 2, y0 + 7 * u + 32, "x");
    return `<svg ${S} viewBox="0 0 ${x0 + (top + extra) * u + 20} ${y0 + 7 * u + 44}" width="${x0 + (top + extra) * u + 20}" role="img" aria-label="Mosaik aus quadratischen Fliesen">${defs}${s}</svg>`;
  }
  const FIG_MOSAIK = mosaic();

  const FIG_RAUM = `<svg ${S} viewBox="0 0 310 230" width="310" role="img" aria-label="Grundriss eines Zimmers">${defs}
    <polygon points="40,30 280,30 280,130 200,130 200,190 40,190" ${FILL}/>
    ${dim(40, 16, 280, 16)}${txt(160, 12, "3x")}
    ${dim(26, 30, 26, 190)}${txt(14, 115, "4")}
    ${dim(200, 142, 280, 142)}${txt(240, 160, "2")}
    ${dim(212, 130, 212, 190)}${txt(220, 182, "1,5", "start")}
  </svg>`;

  // ================================================================ TEST RUNDE 1
  const runde1 = { tasks: [
    { n: "1", t: "Berechne den Term.", items: [
      { l: "a)", q: "{2/5} + 1,2 − {3/10}", k: "num", a: "1,3", w: "0,4 + 1,2 − 0,3 = 1,3" },
      { l: "b)", q: "(0,4 · {5/8}) · 6", k: "num", a: "1,5", w: "0,4 · {5/8} = {2/5} · {5/8} = {1/4}; {1/4} · 6 = 1,5" },
      { l: "c)", q: "{2/3} · 0,9 + {2/3} · 2,1", k: "num", a: "2", w: "{2/3} · (0,9 + 2,1) = {2/3} · 3 = 2" },
      { l: "d)", q: "{7/4} − {3/4} · 5", k: "num", a: "−2", w: "Punkt vor Strich: {7/4} − {15/4} = −{8/4} = −2" }
    ] },
    { n: "2", t: "Vereinfache den Term. Belege die Variable mit 3 und berechne.", items: [
      { l: "a)", q: "9x − 15 − 14x", f: [{ p: "vereinfacht:", k: "simp", a: "−5x − 15" }, { p: "für x = 3:", k: "num", a: "−30", at: { x: 3 } }] },
      { l: "b)", q: "(3w + {2/3}) · 6", f: [{ p: "vereinfacht:", k: "simp", a: "18w + 4" }, { p: "für w = 3:", k: "num", a: "58", at: { w: 3 } }] },
      { l: "c)", q: "12y − 5 · (3 + 2y)", f: [{ p: "vereinfacht:", k: "simp", a: "2y − 15" }, { p: "für y = 3:", k: "num", a: "−9", at: { y: 3 } }], w: "12y − 15 − 10y = 2y − 15" },
      { l: "d)", q: "7 − 4 · (0,5 − {1/4}x)", f: [{ p: "vereinfacht:", k: "simp", a: "x + 5" }, { p: "für x = 3:", k: "num", a: "8", at: { x: 3 } }], w: "7 − 2 + x = x + 5" }
    ] },
    { n: "3", t: "Ein Mosaik besteht aus quadratischen Fliesen.",
      fig: `<div class="figs"><figure>${FIG_MOSAIK}<figcaption>Oben 5 Reihen mit je x Fliesen, unten 2 Reihen, die 4 Fliesen länger sind.</figcaption></figure></div>`,
      items: [
        { l: "a)", q: "Stelle einen Term für die Anzahl der Fliesen auf:", k: "term", a: "7x + 8", noeq: true, w: "oben 5 · x, unten 2 · (x + 4) → 5x + 2x + 8 = 7x + 8", wide: true },
        { l: "b)", q: "Wie viele Fliesen sind es für x = 12?", k: "num", a: "92", noeq: true, w: "7 · 12 + 8 = 92", wide: true }
      ] },
    { n: "4", t: "Klammere eine möglichst große Zahl aus, sodass keine Brüche entstehen.", items: [
      { l: "a)", q: "8x + 20", k: "fac", kk: 4, a: "4 · (2x + 5)" },
      { l: "b)", q: "15x − 25", k: "fac", kk: 5, a: "5 · (3x − 5)" },
      { l: "c)", q: "−18b + 30", k: "fac", kk: 6, a: "−6 · (3b − 5)", w: "auch richtig: 6 · (−3b + 5)" },
      { l: "d)", q: "21v − 49", k: "fac", kk: 7, a: "7 · (3v − 7)" }
    ] },
    { n: "5", t: "Denke dir eine Zahl x, multipliziere sie mit 4 und addiere 10. Halbiere das Ergebnis und subtrahiere das Doppelte der Anfangszahl. Was ist das Endergebnis?", items: [
      { l: "Term:", q: "", k: "term", a: "(4x + 10) : 2 − 2x", p: "Rechenweg als Term mit x:", w: "(4x + 10) : 2 − 2x = 2x + 5 − 2x = 5", wide: true },
      { l: "Ergebnis:", q: "", k: "num", a: "5", p: "Endergebnis:", w: "Es kommt immer 5 heraus – egal, welche Zahl du dir denkst!", wide: true }
    ] },
    { n: "6", t: "Vereinfache den Term.", items: [
      { l: "a)", q: "{1/3} · (6x − 9) + 4 · 0,5 − {2/3}x", k: "simp", a: "{4/3}x − 1", w: "2x − 3 + 2 − {2/3}x = {4/3}x − 1" },
      { l: "b)", q: "−{3/5} · (−z + 5) − (−2 + 3z) · {1/5}", k: "simp", a: "−2,6", w: "{3/5}z − 3 + {2/5} − {3/5}z = −2,6 (z fällt weg!)" }
    ] }
  ] };

  // ================================================================ TEST RUNDE 2
  const runde2 = { tasks: [
    { n: "1", t: "Berechne den Term möglichst geschickt.", items: [
      { l: "a)", q: "{5/6} + {13/15} − {11/6}", k: "num", a: "−{2/15}", show: "−{2/15}", w: "{5/6} − {11/6} = −1; −1 + {13/15} = −{2/15}" },
      { l: "b)", q: "{13/4} − ({5/6} + {5/4})", k: "num", a: "{7/6}", w: "{13/4} − {5/4} = 2; 2 − {5/6} = {7/6}" },
      { l: "c)", q: "{3/8} · 27 − 3 · {3/8}", k: "num", a: "9", w: "{3/8} · (27 − 3) = {3/8} · 24 = 9" },
      { l: "d)", q: "12 · ({5/12} + 2) − 6,5", k: "num", a: "22,5", w: "5 + 24 − 6,5 = 22,5" }
    ] },
    { n: "2", t: "Vereinfache den Term.", items: [
      { l: "a)", q: "4 · (2e − 3) + 15", k: "simp", a: "8e + 3" },
      { l: "b)", q: "(−6x) · 2,5", k: "simp", a: "−15x" },
      { l: "c)", q: "(9 − 3x) · {1/3}", k: "simp", a: "3 − x" },
      { l: "d)", q: "{4/5}u − 2 − 0,3u + u", k: "simp", a: "1,5u − 2", w: "0,8u − 0,3u + u = 1,5u" }
    ] },
    { n: "3", t: "Eine Klasse mit 26 Kindern leiht Kanus. Pro Kind kostet es 4 € Grundgebühr und 2,50 € pro Stunde. Stelle einen Term für die Gesamtkosten der Klasse auf, wenn die Tour x Stunden dauert. Berechne die Kosten für x = 3.", items: [
      { l: "Term:", q: "Gesamtkosten in €", k: "term", a: "26 · (4 + 2,5x)", w: "26 · (4 + 2,5x) = 104 + 65x", wide: true },
      { l: "x = 3:", q: "Gesamtkosten in €", k: "num", a: "299", w: "104 + 65 · 3 = 299", wide: true }
    ] },
    { n: "4", t: "Vereinfache die beiden Terme und prüfe, ob sie gleichwertig sind.", items: [
      { l: "a)", q: "7x − (10x + 4) − 8   und   (−3) · (x + 4)", wide: true, f: [{ p: "1. Term:", k: "simp", a: "−3x − 12", e: "7x − (10x + 4) − 8" }, { p: "2. Term:", k: "simp", a: "−3x − 12", e: "(−3) · (x + 4)" }, { p: "gleichwertig?", k: "sel", o: ["ja", "nein"], a: [0] }] },
      { l: "b)", q: "{2/5} · 10z − (−6 − 4z · {1/2})   und   6 · (z − 1)", wide: true, f: [{ p: "1. Term:", k: "simp", a: "6z + 6", e: "{2/5} · 10z − (−6 − 4z · {1/2})" }, { p: "2. Term:", k: "simp", a: "6z − 6", e: "6 · (z − 1)" }, { p: "gleichwertig?", k: "sel", o: ["ja", "nein"], a: [1] }], w: "4z + 6 + 2z = 6z + 6, aber 6 · (z − 1) = 6z − 6" }
    ] },
    { n: "5", t: "Mia bekommt neue Fußleisten für ihr Zimmer (alle Angaben in m).",
      fig: `<div class="figs"><figure>${FIG_RAUM}<figcaption>Grundriss (nicht maßstäblich)</figcaption></figure></div>`,
      items: [
        { l: "a)", q: "Term für die Länge der Leisten (Umfang):", k: "term", a: "6x + 8", noeq: true, w: "oben 3x, rechts 2,5, Stufe 2 und 1,5, unten 3x − 2, links 4 → 6x + 8", wide: true },
        { l: "", q: "Länge für x = 3 (in m):", k: "num", a: "26", noeq: true, w: "6 · 3 + 8 = 26", wide: true },
        { l: "b)", q: "Term für den Flächeninhalt des Teppichbodens:", k: "term", a: "12x − 3", noeq: true, w: "großes Rechteck 4 · 3x = 12x, Ecke 2 · 1,5 = 3 abziehen → 12x − 3", wide: true }
      ] },
    { n: "6", t: "Drei Freundinnen teilen sich einen Gewinn von x Euro. Sie erhalten {1/4}, {1/3} und {1/6} des Gewinns. Stelle einen Term für den Teil des Gewinns auf, der noch übrig ist, und vereinfache ihn.", items: [
      { l: "Rest:", q: "", k: "simp", a: "{1/4}x", p: "übrig (vereinfacht):", w: "x − {1/4}x − {1/3}x − {1/6}x = x − {3/12}x − {4/12}x − {2/12}x = {3/12}x = {1/4}x", wide: true }
    ] }
  ] };

  window.MATHE = { runde1, runde2 };
})();
