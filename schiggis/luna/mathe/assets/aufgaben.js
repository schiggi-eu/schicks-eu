/* Luna – Mathe „Terme mit einer Variablen“ · Aufgaben
   Schreibweise: {3/4} = Bruch, · = mal, − = minus, Komma = Dezimalzeichen.
   Feldtypen k: num (Zahl), simp (vereinfachter Term), term (beliebiger gleichwertiger Term),
   fac (ausklammern, kk = größtmögliche Zahl), sel (Auswahl, a = Index/Indizes), pair (□/△-Felder).
   at: {x: 3} nur für die automatische Lösungsprüfung (verify). */
(function () {
  "use strict";

  const RULES = ["Kommutativgesetz (vertauschen)", "Assoziativgesetz (Klammern versetzen)", "Distributivgesetz (verteilen / ausklammern)"];
  const CARDS6 = ["A", "B", "C", "D", "E", "F"];

  // ---------------------------------------------------------------- Abbildungen (SVG)
  const S = 'xmlns="http://www.w3.org/2000/svg" font-family="-apple-system, Segoe UI, Roboto, Arial, sans-serif" font-size="15" font-weight="700"';
  const FILL = 'fill="#e3f9ff" stroke="#0069a8" stroke-width="2.5"';
  const dim = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#a34d00" stroke-width="1.5" marker-start="url(#ar)" marker-end="url(#ar)"/>`;
  const defs = '<defs><marker id="ar" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,1 L9,5 L0,9 z" fill="#a34d00"/></marker></defs>';
  const txt = (x, y, s, anchor) => `<text x="${x}" y="${y}" fill="#a34d00" text-anchor="${anchor || "middle"}">${s}</text>`;

  const FIG_L = `<svg ${S} viewBox="0 0 300 215" width="300" role="img" aria-label="L-förmige Figur">${defs}
    <polygon points="40,20 110,20 110,120 260,120 260,170 40,170" ${FILL}/>
    ${dim(40, 12, 110, 12)}${txt(75, 8, "a")}
    ${dim(28, 20, 28, 120)}${txt(16, 75, "4")}
    ${dim(272, 120, 272, 170)}${txt(286, 150, "2")}
    ${dim(40, 184, 260, 184)}${txt(150, 204, "2a + 3")}
  </svg>`;

  const FIG_TRI = `<svg ${S} viewBox="0 0 260 200" width="260" role="img" aria-label="Dreieck">${defs}
    <polygon points="20,150 240,150 170,30" ${FILL}/>
    <line x1="170" y1="30" x2="170" y2="150" stroke="#0069a8" stroke-width="1.5" stroke-dasharray="5 4"/>
    <rect x="170" y="140" width="10" height="10" fill="none" stroke="#0069a8" stroke-width="1.2"/>
    ${txt(186, 95, "3", "start")}
    ${dim(20, 166, 240, 166)}${txt(130, 188, "2c + 6")}
  </svg>`;

  function sticks(rows, cols) {
    const u = 42, x0 = 14, y0 = 14;
    let s = "";
    const stick = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#f2c27b" stroke-width="5" stroke-linecap="round"/><circle cx="${x2}" cy="${y2}" r="4.2" fill="#d6332a"/>`;
    for (let r = 0; r <= rows; r++) for (let c = 0; c < cols; c++) s += stick(x0 + c * u + 5, y0 + r * u, x0 + (c + 1) * u - 5, y0 + r * u);
    for (let r = 0; r < rows; r++) for (let c = 0; c <= cols; c++) s += stick(x0 + c * u, y0 + r * u + 5, x0 + c * u, y0 + (r + 1) * u - 5);
    const w = x0 + cols * u;
    s += `<text x="${w + 12}" y="${y0 + rows * u / 2 + 6}" font-size="22" fill="#4f6473">…</text>`;
    s += dim(x0, y0 + rows * u + 16, w, y0 + rows * u + 16) + txt(x0 + cols * u / 2, y0 + rows * u + 38, "Länge q (hier q = " + cols + ")");
    return `<svg ${S} viewBox="0 0 ${w + 46} ${y0 + rows * u + 46}" width="${w + 46}" role="img" aria-label="Streichholzmuster">${defs}${s}</svg>`;
  }

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

  // ================================================================ TRAINING
  const training = { tasks: [
    { n: "1", t: "Berechne.", h: "Brüche als Bruch (z. B. 3/4) oder als Kommazahl eintragen.", cols: 1, items: [
      { l: "a)", q: "{2/5} + 0,6", k: "num", a: "1", w: "0,4 + 0,6 = 1" },
      { l: "b)", q: "2,4 − {3/4}", k: "num", a: "1,65", w: "2,4 − 0,75 = 1,65" },
      { l: "c)", q: "{3/8} · 0,4", k: "num", a: "0,15", w: "{3/8} · {2/5} = {6/40} = {3/20} = 0,15" },
      { l: "d)", q: "−{2/3} · 1,5", k: "num", a: "−1", w: "−{2/3} · {3/2} = −1" }
    ] },
    { n: "2", t: "Berechne den Term möglichst geschickt. Welche Rechenregel verwendest du?", items: [
      { l: "a)", q: "23 + 58 − 23", f: [{ p: "Ergebnis:", k: "num", a: "58" }, { p: "Regel:", k: "sel", o: RULES, a: [0] }], w: "23 − 23 + 58 = 58 (vertauschen)" },
      { l: "b)", q: "(−2,5) · 7,3 · 4", f: [{ p: "Ergebnis:", k: "num", a: "−73" }, { p: "Regel:", k: "sel", o: RULES, a: [0, 1] }], w: "(−2,5) · 4 · 7,3 = −10 · 7,3 = −73" },
      { l: "c)", q: "{3/5} · 17 − {3/5} · 7", f: [{ p: "Ergebnis:", k: "num", a: "6" }, { p: "Regel:", k: "sel", o: RULES, a: [2] }], w: "{3/5} · (17 − 7) = {3/5} · 10 = 6" },
      { l: "d)", q: "8 · (25 + {1/4})", f: [{ p: "Ergebnis:", k: "num", a: "202" }, { p: "Regel:", k: "sel", o: RULES, a: [2] }], w: "8 · 25 + 8 · {1/4} = 200 + 2 = 202" },
      { l: "e)", q: "3,7 + (6,3 + 8,9)", f: [{ p: "Ergebnis:", k: "num", a: "18,9" }, { p: "Regel:", k: "sel", o: RULES, a: [1] }], w: "(3,7 + 6,3) + 8,9 = 10 + 8,9 = 18,9" },
      { l: "f)", q: "{5/6} · (12 − {6/5})", f: [{ p: "Ergebnis:", k: "num", a: "9" }, { p: "Regel:", k: "sel", o: RULES, a: [2] }], w: "{5/6} · 12 − {5/6} · {6/5} = 10 − 1 = 9" },
      { l: "g)", q: "{2/7} · 13 + {2/7} · 8", f: [{ p: "Ergebnis:", k: "num", a: "6" }, { p: "Regel:", k: "sel", o: RULES, a: [2] }], w: "{2/7} · (13 + 8) = {2/7} · 21 = 6" },
      { l: "h)", q: "1,25 · 0,7 · 8", f: [{ p: "Ergebnis:", k: "num", a: "7" }, { p: "Regel:", k: "sel", o: RULES, a: [0, 1] }], w: "1,25 · 8 · 0,7 = 10 · 0,7 = 7" }
    ] },
    { n: "3", t: "Setze in den Term nacheinander 3, −2 und {1/2} ein und berechne.", items: [
      { l: "a)", q: "4 − 3 · x", f: [{ p: "x = 3:", k: "num", a: "−5", at: { x: 3 } }, { p: "x = −2:", k: "num", a: "10", at: { x: -2 } }, { p: "x = {1/2}:", k: "num", a: "2,5", at: { x: 0.5 } }] },
      { l: "b)", q: "2 · (a + 1) − 3 · a", f: [{ p: "a = 3:", k: "num", a: "−1", at: { a: 3 } }, { p: "a = −2:", k: "num", a: "4", at: { a: -2 } }, { p: "a = {1/2}:", k: "num", a: "1,5", at: { a: 0.5 } }], w: "Erst vereinfachen: 2a + 2 − 3a = −a + 2" },
      { l: "c)", q: "5x − 7 + 2x", f: [{ p: "x = 3:", k: "num", a: "14", at: { x: 3 } }, { p: "x = −2:", k: "num", a: "−21", at: { x: -2 } }, { p: "x = {1/2}:", k: "num", a: "−3,5", at: { x: 0.5 } }], w: "Erst vereinfachen: 7x − 7" },
      { l: "d)", q: "4 · (2 − 0,5y)", f: [{ p: "y = 3:", k: "num", a: "2", at: { y: 3 } }, { p: "y = −2:", k: "num", a: "12", at: { y: -2 } }, { p: "y = {1/2}:", k: "num", a: "7", at: { y: 0.5 } }], w: "Erst vereinfachen: 8 − 2y" }
    ] },
    { n: "4", t: "Ordne dem Term einen gleichwertigen Term auf einem der Kärtchen zu.",
      cards: [{ id: "A", t: "−6x" }, { id: "B", t: "6x − 3" }, { id: "C", t: "3 · (2x + 5)" }, { id: "D", t: "{1/2} · 20x" }, { id: "E", t: "−3 · (2x − 1)" }, { id: "F", t: "2 · (3x − 1)" }],
      items: [
        { l: "a)", q: "4,5x − (3 − {3/2}x)", k: "sel", o: CARDS6, a: [1], w: "4,5x − 3 + 1,5x = 6x − 3" },
        { l: "b)", q: "6x + 15", k: "sel", o: CARDS6, a: [2], w: "3 · (2x + 5) = 6x + 15" },
        { l: "c)", q: "{2/3} · (−9x + {3/4}) − {1/2}", k: "sel", o: CARDS6, a: [0], w: "−6x + {1/2} − {1/2} = −6x" },
        { l: "d)", q: "{4/5} · 15x − 5x · {2/5}", k: "sel", o: CARDS6, a: [3], w: "12x − 2x = 10x und {1/2} · 20x = 10x" }
      ] },
    { n: "5", t: "Vereinfache den Term.", h: "Schreibe das Ergebnis so kurz wie möglich, z. B. 7x − 5.", items: [
      { l: "a)", q: "3 · x − 5 + 4 · x", k: "simp", a: "7x − 5" },
      { l: "b)", q: "6 · (3x − 2)", k: "simp", a: "18x − 12" },
      { l: "c)", q: "5 · (−4x) + 9x", k: "simp", a: "−11x", w: "−20x + 9x = −11x" },
      { l: "d)", q: "(3 − 2x) · (−4)", k: "simp", a: "8x − 12", w: "3 · (−4) + (−2x) · (−4) = −12 + 8x" },
      { l: "e)", q: "(12w − 9 − 3w) · {1/3}", k: "simp", a: "3w − 3", w: "(9w − 9) · {1/3} = 3w − 3" },
      { l: "f)", q: "(7a − 4 − 5a) · 6", k: "simp", a: "12a − 24", w: "(2a − 4) · 6 = 12a − 24" },
      { l: "g)", q: "9 · (−2c) + 25c", k: "simp", a: "7c", w: "−18c + 25c = 7c" },
      { l: "h)", q: "−5y − 8y + 12y", k: "simp", a: "−y", w: "(−5 − 8 + 12)y = −1y = −y" }
    ] },
    { n: "6", t: "Stelle einen Term für den Flächeninhalt der abgebildeten Figuren auf und vereinfache.",
      fig: `<div class="figs"><figure>${FIG_L}<figcaption>Figur 1</figcaption></figure><figure>${FIG_TRI}<figcaption>Figur 2</figcaption></figure></div>`,
      items: [
        { l: "Figur 1:", q: "A", k: "simp", a: "8a + 6", w: "unten: 2 · (2a + 3) = 4a + 6; oben: 4 · a = 4a; zusammen 8a + 6" },
        { l: "Figur 2:", q: "A", k: "simp", a: "3c + 9", w: "Dreieck: {1/2} · Grundseite · Höhe = {1/2} · (2c + 6) · 3 = 3c + 9" }
      ] },
    { n: "7", t: "Vereinfache den Term.", items: [
      { l: "a)", q: "(x · 4) · (−3) + 15x", k: "simp", a: "3x", w: "−12x + 15x = 3x" },
      { l: "b)", q: "8y · (−3) + (5y) · 6", k: "simp", a: "6y", w: "−24y + 30y = 6y" }
    ] },
    { n: "8", t: "Vereinfache die Terme und prüfe, welche Terme gleichwertig sind.",
      cards: [{ id: "A", t: "3 · (x + 2) − 5" }, { id: "B", t: "{1/2} · (8x − 6) − x + 4" }, { id: "C", t: "5x − (2x + 3)" }, { id: "D", t: "4 − 1,5 · (2 − 2x)" }],
      items: [
        { l: "A:", q: "3 · (x + 2) − 5", k: "simp", a: "3x + 1" },
        { l: "B:", q: "{1/2} · (8x − 6) − x + 4", k: "simp", a: "3x + 1", w: "4x − 3 − x + 4 = 3x + 1" },
        { l: "C:", q: "5x − (2x + 3)", k: "simp", a: "3x − 3", w: "Minusklammer: 5x − 2x − 3" },
        { l: "D:", q: "4 − 1,5 · (2 − 2x)", k: "simp", a: "3x + 1", w: "4 − 3 + 3x = 3x + 1" },
        { l: "", q: "Welcher Term ist zu den anderen NICHT gleichwertig?", k: "sel", o: ["A", "B", "C", "D"], a: [2], wide: true }
      ] },
    { n: "9", t: "Klammere eine Zahl mit möglichst großem Betrag aus, sodass alle im Term vorkommenden Zahlen ganze Zahlen bleiben.", h: "Schreibweise: 6·(3x+4) oder 6(3x+4).", items: [
      { l: "a)", q: "18x + 24", k: "fac", kk: 6, a: "6 · (3x + 4)" },
      { l: "b)", q: "−14x − 21", k: "fac", kk: 7, a: "−7 · (2x + 3)", w: "auch richtig: 7 · (−2x − 3)" },
      { l: "c)", q: "20a − 35", k: "fac", kk: 5, a: "5 · (4a − 7)" },
      { l: "d)", q: "−27 − 36w", k: "fac", kk: 9, a: "−9 · (3 + 4w)", w: "auch richtig: 9 · (−3 − 4w)" }
    ] },
    { n: "10", t: "Stelle einen Term für die Anzahl der Streichhölzer im Muster auf, wenn es q Streichhölzer lang ist.",
      fig: `<div class="figs"><figure>${sticks(3, 4)}</figure></div>`,
      items: [
        { l: "Term:", q: "Anzahl", k: "term", a: "7q + 3", w: "waagerecht: 4 Reihen mit je q Hölzern = 4q; senkrecht: 3 Reihen mit je (q + 1) Hölzern = 3q + 3; zusammen 7q + 3" },
        { l: "q = 10:", q: "Anzahl", k: "num", a: "73", w: "7 · 10 + 3 = 73" }
      ] },
    { n: "11", t: "Ein Tretboot kostet 6 € Grundgebühr pro Fahrt. Jede Stunde kostet 4,50 €. Stelle zwei verschiedene Terme für die Kosten von 8 gleich langen Fahrten mit je x Stunden auf.",
      items: [
        { l: "Kosten:", q: "", distinct: true, f: [{ p: "Term 1:", k: "term", a: "8 · (6 + 4,5x)" }, { p: "Term 2:", k: "term", a: "48 + 36x" }], w: "8 · (6 + 4,5x) = 48 + 36x (z. B. auch 8 · 6 + 8 · 4,5 · x)", wide: true },
        { l: "x = 2:", q: "Kosten in €", k: "num", a: "120", w: "48 + 36 · 2 = 120" }
      ] },
    { n: "12", t: "Welche Zahlen kann man für □ und △ einsetzen?", items: [
      { l: "a)", q: "15x − 20 = □ · (3x − 4)", f: [{ k: "pair", labels: ["□"], sols: [["5"]] }] },
      { l: "b)", q: "□ · (2x + △) = −8x + 12", f: [{ k: "pair", labels: ["□", "△"], sols: [["-4", "-3"]] }], w: "□ · 2 = −8 → □ = −4; −4 · △ = 12 → △ = −3" },
      { l: "c)", q: "△x − 24 = □ · (2x + 8)", f: [{ k: "pair", labels: ["□", "△"], sols: [["-3", "-6"]] }], w: "□ · 8 = −24 → □ = −3; △ = −3 · 2 = −6" },
      { l: "d)", q: "□ · (3x + △) = △x + 27", f: [{ k: "pair", labels: ["□", "△"], sols: [["3", "9"], ["-3", "-9"]] }], w: "3 · □ = △ und □ · △ = 27 → 3 · □ · □ = 27 → □ = 3, △ = 9 (oder □ = −3, △ = −9)" }
    ] },
    { n: "13", t: "Stelle für die Zahlenreihe einen passenden Term mit Variable n auf. Für eine natürliche Zahl n soll der Term die n-te Zahl der Zahlenreihe angeben.", items: [
      { l: "a)", q: "3, 6, 9, 12, 15 …", k: "term", a: "3n" },
      { l: "b)", q: "5, 9, 13, 17, 21 …", k: "term", a: "4n + 1", w: "immer +4 → 4n; für n = 1: 4 · 1 + 1 = 5" },
      { l: "c)", q: "8, 5, 2, −1, −4 …", k: "term", a: "−3n + 11", w: "immer −3 → −3n; für n = 1: −3 + 11 = 8" },
      { l: "d)", q: "2;  2,2;  2,4;  2,6;  2,8 …", k: "term", a: "0,2n + 1,8", w: "immer +0,2 → 0,2n; für n = 1: 0,2 + 1,8 = 2" }
    ] }
  ] };

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

  window.MATHE = { training, runde1, runde2 };
})();
