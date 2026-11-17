/* Luke · Ríos de España – Lernen, Multiple Choice, Eingeben, Auf der Karte finden */
(function () {
  "use strict";

  // Nummern wie auf dem Arbeitsblatt; x/y = Position der Nummer auf der Karte in %
  const RIVERS = [
    { n: 1,  name: "Miño",         sea: "atl", x: 84.0, y: 22.5 },
    { n: 2,  name: "Duero",        sea: "atl", x: 70.4, y: 37.9 },
    { n: 3,  name: "Tajo",         sea: "atl", x: 49.6, y: 37.8 },
    { n: 4,  name: "Guadiana",     sea: "atl", x: 40.2, y: 37.6 },
    { n: 5,  name: "Guadalquivir", sea: "atl", x: 24.9, y: 39.2 },
    { n: 6,  name: "Segura",       sea: "med", x: 31.2, y: 69.1 },
    { n: 7,  name: "Júcar",        sea: "med", x: 44.6, y: 69.7 },
    { n: 8,  name: "Turia",        sea: "med", x: 54.7, y: 72.1 },
    { n: 9,  name: "Ebro",         sea: "med", x: 69.3, y: 78.0 },
    { n: 10, name: "Nervión",      sea: "can", x: 88.0, y: 55.2 },
    { n: 11, name: "Nalón",        sea: "can", x: 88.8, y: 41.1 }
  ];
  const SEA = { atl: "Atlántico", med: "Mediterráneo", can: "Cantábrico" };

  // ---------- Hilfsfunktionen
  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  // Akzente, Groß-/Kleinschreibung, „río/rio/el“ und Sonderzeichen werden ignoriert
  function norm(s) {
    return String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
      .replace(/[^a-z\s]/g, " ").replace(/\b(rio|el|fluss)\b/g, " ").replace(/\s+/g, "").trim();
  }
  const Store = {
    get(k, d) { try { const v = localStorage.getItem("luke." + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("luke." + k, JSON.stringify(v)); } catch (e) {} }
  };
  function saveScore(mode, correct, total) {
    const s = Store.get("scores", {}); const pct = Math.round(100 * correct / total);
    s[mode] = { best: Math.max((s[mode] || {}).best || 0, pct), last: pct }; Store.set("scores", s);
  }

  // ---------- Karte
  const mapEl = $("#map");
  function drawMarkers(opts) {
    opts = opts || {};
    mapEl.querySelectorAll(".mk").forEach(m => m.remove());
    RIVERS.forEach(r => {
      const b = document.createElement("button");
      b.className = "mk sea-" + r.sea + (opts.active === r.n ? " active" : "") + (opts.dim && opts.active !== r.n ? " dim" : "") + (opts.blank ? " blank" : "");
      b.style.left = r.x + "%"; b.style.top = r.y + "%";
      b.dataset.n = r.n;
      b.textContent = opts.blank ? "" : r.n;
      b.setAttribute("aria-label", opts.blank ? "Fluss auf der Karte" : "Fluss Nummer " + r.n);
      if (opts.onClick) b.addEventListener("click", () => opts.onClick(r, b)); else b.tabIndex = -1;
      mapEl.appendChild(b);
    });
  }
  function markMarker(n, cls) { const m = mapEl.querySelector('.mk[data-n="' + n + '"]'); if (m) m.classList.add(cls); }

  // ---------- Modus: Lernen
  function learn() {
    const hide = Store.get("hide", false);
    const panel = $("#panel");
    panel.innerHTML = `
      <h2>Die 11 Flüsse</h2>
      <p class="de">Tippe auf eine Nummer auf der Karte oder in der Liste. Zum Selbst-Abfragen kannst du die Namen verdecken.</p>
      <label class="toggle"><input type="checkbox" id="hide" ${hide ? "checked" : ""}> Namen verdecken (antippen zum Aufdecken)</label>
      <ol class="river-list">${RIVERS.map(r => `
        <li data-n="${r.n}" tabindex="0"><span class="num sea-${r.sea}">${r.n}</span>
          <span class="rname ${hide ? "hidden" : ""}">${esc(r.name)}</span>
          <span class="sea">${SEA[r.sea]}</span></li>`).join("")}</ol>
      <div class="box tip">
        <strong class="label">Merkhilfe</strong>
        <p><strong>In den Atlantik (Atlántico):</strong> 1–5 Miño, Duero, Tajo, Guadiana, Guadalquivir – von Norden nach Süden.<br>
        <strong>Ins Mittelmeer (Mediterráneo):</strong> 6–9 Segura, Júcar, Turia, Ebro – von Süden nach Norden.<br>
        <strong>Ins Kantabrische Meer (Cantábrico):</strong> 10 Nervión (bei Bilbao) und 11 Nalón (Asturien).</p>
        <p class="de">Tipp: Auf dieser Karte ist Norden <strong>rechts</strong> (Frankreich und die Pyrenäen liegen unten rechts, Portugal oben).</p>
      </div>
      <div class="scores">${["mc", "type", "find"].map(m => { const s = (Store.get("scores", {})[m]); return `<span>${{ mc: "Auswählen", type: "Eintippen", find: "Auf der Karte" }[m]}: <strong>${s ? s.best + " %" : "–"}</strong></span>`; }).join("")}</div>`;
    function select(n) {
      drawMarkers({ active: n, onClick: r => select(r.n) });
      panel.querySelectorAll(".river-list li").forEach(li => li.classList.toggle("sel", +li.dataset.n === n));
      const r = RIVERS[n - 1];
      $("#map-caption").innerHTML = `<strong>${r.n} · ${esc(r.name)}</strong> – fließt ${{ atl: "in den Atlantik", med: "ins Mittelmeer", can: "ins Kantabrische Meer" }[r.sea]} (${SEA[r.sea]})`;
    }
    panel.querySelectorAll(".river-list li").forEach(li => {
      const act = () => { const nm = li.querySelector(".rname"); if (nm.classList.contains("hidden")) nm.classList.add("peek"); select(+li.dataset.n); };
      li.addEventListener("click", act);
      li.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); act(); } });
    });
    $("#hide").addEventListener("change", e => { Store.set("hide", e.target.checked); learn(); });
    drawMarkers({ onClick: r => select(r.n) });
    $("#map-caption").textContent = "Tippe auf eine Nummer.";
  }

  // ---------- Quiz (Multiple Choice / Eingeben / Karte)
  function quiz(mode, list) {
    const panel = $("#panel");
    let qs = shuffle(list || RIVERS), i = 0, correct = 0, wrong = [], answered = false;
    const title = { mc: "Auswählen", type: "Eintippen", find: "Auf der Karte finden" }[mode];

    function render() {
      if (i >= qs.length) return finish();
      answered = false;
      const r = qs[i];
      const head = `<div class="q-num">${title} · Frage ${i + 1} von ${qs.length} · ✓ ${correct}</div>
        <div class="progress"><span style="width:${Math.round(100 * i / qs.length)}%"></span></div>`;
      if (mode === "find") {
        panel.innerHTML = `<div class="q-card">${head}
          <div class="q-text">Wo ist der <strong>${esc(r.name)}</strong>?</div>
          <div class="q-hint">Tippe auf den richtigen Punkt auf der Karte.</div>
          <div class="feedback"></div>
          <div class="btn-row next-row" style="display:none"><button class="btn next">Weiter →</button></div></div>`;
        drawMarkers({ blank: true, onClick: (x, el) => checkFind(x, el) });
        $("#map-caption").textContent = "Wo ist der " + r.name + "?";
      } else {
        drawMarkers({ active: r.n, dim: true });
        $("#map-caption").innerHTML = `Wie heißt Fluss <strong>Nr. ${r.n}</strong>?`;
        let body;
        if (mode === "mc") {
          const opts = shuffle([r].concat(shuffle(RIVERS.filter(x => x.n !== r.n)).slice(0, 3)));
          body = `<div class="options">${opts.map(o => `<button class="opt" data-n="${o.n}">${esc(o.name)}</button>`).join("")}</div>`;
        } else {
          body = `<div class="answer-row"><input type="text" class="ans" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Name eintippen …"><button class="btn teal check">Prüfen</button></div>
            <p class="de" style="margin:8px 0 0">Akzente (á, é, í, ó, ñ) musst du nicht eintippen.</p>`;
        }
        panel.innerHTML = `<div class="q-card">${head}
          <div class="q-text">Wie heißt Fluss <span class="num-big">${r.n}</span>?</div>
          ${body}
          <div class="feedback"></div>
          <div class="btn-row next-row" style="display:none"><button class="btn next">Weiter →</button></div></div>`;
        if (mode === "mc") panel.querySelectorAll(".opt").forEach(b => b.addEventListener("click", () => checkMC(+b.dataset.n)));
        else {
          const inp = panel.querySelector(".ans");
          setTimeout(() => inp.focus({ preventScroll: true }), 30);
          inp.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); answered ? next() : checkType(); } });
          panel.querySelector(".check").addEventListener("click", checkType);
        }
      }
      panel.querySelector(".next").addEventListener("click", next);
    }

    function feedback(ok, text) {
      const fb = panel.querySelector(".feedback");
      fb.className = "feedback show " + (ok ? "ok" : "no");
      fb.innerHTML = text;
      if (ok) correct++; else wrong.push(qs[i]);
      answered = true;
      panel.querySelector(".next-row").style.display = "flex";
      const nb = panel.querySelector(".next"); setTimeout(() => nb.focus({ preventScroll: true }), 30);
    }
    function checkMC(n) {
      if (answered) return;
      const r = qs[i];
      panel.querySelectorAll(".opt").forEach(b => { b.disabled = true; if (+b.dataset.n === r.n) b.classList.add("correct"); else if (+b.dataset.n === n) b.classList.add("wrong"); });
      feedback(n === r.n, n === r.n ? `<strong>Richtig! 🎉</strong> ${r.n} = ${esc(r.name)}` : `<strong>Leider falsch.</strong> Nr. ${r.n} ist der <strong>${esc(r.name)}</strong>.`);
    }
    function checkType() {
      if (answered) return;
      const r = qs[i]; const inp = panel.querySelector(".ans");
      if (!inp.value.trim()) { inp.focus(); return; }
      inp.readOnly = true; panel.querySelector(".check").disabled = true;
      const ok = norm(inp.value) === norm(r.name);
      inp.classList.add(ok ? "ok" : "no");
      feedback(ok, ok ? `<strong>Richtig! 🎉</strong> Schreibweise: <strong>${esc(r.name)}</strong>` : `<strong>Leider falsch.</strong> Richtig: <strong>${esc(r.name)}</strong>`);
    }
    function checkFind(x) {
      if (answered) return;
      const r = qs[i];
      markMarker(r.n, "right");
      if (x.n !== r.n) markMarker(x.n, "wrongpick");
      mapEl.querySelectorAll(".mk").forEach(m => m.disabled = true);
      feedback(x.n === r.n, x.n === r.n ? `<strong>Richtig! 🎉</strong> Das ist der ${esc(r.name)} (Nr. ${r.n}).` : `<strong>Leider falsch.</strong> Du hast Nr. ${x.n} (${esc(x.name)}) gewählt. Der ${esc(r.name)} ist Nr. ${r.n}.`);
    }
    function next() { i++; render(); }
    document.onkeydown = e => { if (e.key === "Enter" && answered && document.activeElement && !document.activeElement.classList.contains("ans")) { e.preventDefault(); next(); } };

    function finish() {
      saveScore(mode, correct, qs.length);
      const pct = Math.round(100 * correct / qs.length);
      drawMarkers({ onClick: null });
      $("#map-caption").textContent = "";
      const msg = pct === 100 ? "Perfekt! ☀️" : pct >= 80 ? "Sehr gut – fast alles!" : pct >= 50 ? "Gut – wiederhole die Fehler." : "Weiter üben – du schaffst das!";
      panel.innerHTML = `<div class="result">
        <div class="score">${correct} / ${qs.length}</div><div>${pct} % · ${msg}</div>
        ${wrong.length ? `<div class="review-list"><strong>Wiederholen:</strong><ul>${wrong.map(r => `<li>${r.n} = <strong>${esc(r.name)}</strong></li>`).join("")}</ul></div>` : ""}
        <div class="btn-row" style="justify-content:center">
          ${wrong.length ? `<button class="btn retry">Nur Fehler wiederholen</button>` : ""}
          <button class="btn teal again">Nochmal (alle)</button>
        </div></div>`;
      const rt = panel.querySelector(".retry"); if (rt) rt.addEventListener("click", () => quiz(mode, wrong));
      panel.querySelector(".again").addEventListener("click", () => quiz(mode));
    }
    render();
  }

  // ---------- Tabs / Routing
  const MODES = { lernen: learn, "multiple-choice": () => quiz("mc"), eingeben: () => quiz("type"), karte: () => quiz("find") };
  function route() {
    const key = (location.hash || "#lernen").slice(1);
    const fn = MODES[key] || learn;
    document.querySelectorAll(".tabs a").forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + (MODES[key] ? key : "lernen")));
    document.onkeydown = null;
    document.body.dataset.mode = MODES[key] ? key : "lernen";
    fn();
  }
  window.addEventListener("hashchange", route);
  document.addEventListener("DOMContentLoaded", route);
  window.Luke = { norm, RIVERS };
})();
