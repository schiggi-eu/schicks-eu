/* Luna – English Unit 1 · gemeinsames Script (Layout, Speicher, Quiz, Vokabeln, Verben) */
(function () {
  "use strict";

  const ROOT = document.body.dataset.root || "./";
  const PAGE = document.body.dataset.page || "";

  // ---------------------------------------------------------------- Navigation
  const NAV = [
    { k: "home", t: "Start", h: "index.html" },
    { k: "crash", t: "⚡ Crashkurs", h: "crashkurs.html" },
    { k: "vokabeln", t: "Vokabeln", h: "vokabeln/index.html" },
    { k: "grammatik", t: "Grammatik", h: "grammatik/index.html", sub: [
      { k: "g-modal", t: "Modalverben & Ersatzformen", h: "grammatik/modalverben.html" },
      { k: "g-zeiten", t: "Present perfect vs. simple past", h: "grammatik/zeiten.html" },
      { k: "g-verben", t: "Unregelmäßige Verben", h: "grammatik/unregelmaessige-verben.html" },
      { k: "g-relativ", t: "Relativsätze", h: "grammatik/relativsaetze.html" },
      { k: "g-man", t: "„man“ auf Englisch", h: "grammatik/man.html" }
    ] },
    { k: "inhalte", t: "Inhalte", h: "inhalte/index.html", sub: [
      { k: "i-texte", t: "Texte & Figuren", h: "inhalte/index.html" },
      { k: "i-mediation", t: "Mediation (Deutsch → Englisch)", h: "inhalte/mediation.html" }
    ] },
    { k: "tests", t: "Tests", h: "tests/index.html", sub: [
      { k: "t-vokabeln", t: "Vokabeltest", h: "tests/vokabeln.html" },
      { k: "t-grammatik", t: "Grammatiktest", h: "tests/grammatik/index.html" },
      { k: "t-inhalt", t: "Inhaltstest", h: "tests/inhalt.html" }
    ] },
    { k: "mathe", t: "🧮 Mathe", h: "mathe/index.html" }
  ];

  function isActive(item) {
    if (item.k === PAGE) return true;
    return !!(item.sub && item.sub.some(s => s.k === PAGE));
  }

  function buildLayout() {
    const header = document.createElement("header");
    header.className = "site-header";
    let links = "";
    NAV.forEach(n => {
      links += `<li><a href="${ROOT}${n.h}" class="${isActive(n) ? "active" : ""}">${n.t}</a></li>`;
      if (n.sub) n.sub.forEach(s => {
        links += `<li class="sub"><a href="${ROOT}${s.h}" class="${s.k === PAGE ? "active" : ""}">${s.t}</a></li>`;
      });
    });
    header.innerHTML = `
      <div class="bar">
        <a class="brand" href="${ROOT}index.html"><span class="moon">☾</span><span>Luna lernt Englisch<small>Green Line 5 · Unit 1</small></span></a>
        <button class="menu-btn" aria-expanded="false" aria-controls="nav">☰ Menü</button>
        <nav class="main-nav" id="nav"><ul>${links}</ul></nav>
      </div>`;
    document.body.prepend(header);
    const btn = header.querySelector(".menu-btn");
    const nav = header.querySelector(".main-nav");
    btn.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open);
      btn.textContent = open ? "✕ Schließen" : "☰ Menü";
    });

    const footer = document.createElement("footer");
    footer.className = "site-footer";
    footer.innerHTML = `Privater Lernbereich · Fortschritt wird nur auf diesem Gerät gespeichert · <a href="#" id="reset-progress">Fortschritt zurücksetzen</a>`;
    document.body.append(footer);
    const rp = footer.querySelector("#reset-progress");
    rp.addEventListener("click", e => {
      e.preventDefault();
      if (!rp.dataset.armed) { rp.dataset.armed = "1"; rp.textContent = "Wirklich alles löschen? Nochmal tippen"; setTimeout(() => { delete rp.dataset.armed; rp.textContent = "Fortschritt zurücksetzen"; }, 5000); return; }
      try { Object.keys(localStorage).filter(k => k.startsWith("luna.")).forEach(k => localStorage.removeItem(k)); } catch (err) {}
      location.reload();
    });
  }

  // ---------------------------------------------------------------- Speicher
  const Store = {
    get(key, def) {
      try { const v = localStorage.getItem("luna." + key); return v === null ? def : JSON.parse(v); }
      catch (e) { return def; }
    },
    set(key, val) {
      try { localStorage.setItem("luna." + key, JSON.stringify(val)); } catch (e) { /* privat-modus o. ä. */ }
    }
  };

  function saveScore(id, correct, total) {
    const scores = Store.get("scores", {});
    const pct = total ? Math.round(100 * correct / total) : 0;
    const prev = scores[id] || { best: 0, runs: 0 };
    scores[id] = { best: Math.max(prev.best, pct), last: pct, runs: prev.runs + 1, date: new Date().toISOString().slice(0, 10) };
    Store.set("scores", scores);
  }

  function wrongMap() { return Store.get("vocabWrong", {}); }
  function markWrong(en) { const m = wrongMap(); m[en] = (m[en] || 0) + 1; Store.set("vocabWrong", m); }
  function markRight(en) { const m = wrongMap(); if (m[en]) { m[en]--; if (m[en] <= 0) delete m[en]; Store.set("vocabWrong", m); } }

  // ---------------------------------------------------------------- Helfer
  function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  function norm(s) {
    s = String(s).toLowerCase()
      .replace(/[’‘´`]/g, "'").replace(/[“”„]/g, '"')
      .replace(/\bwon't\b/g, "will not").replace(/\bcan't\b/g, "cannot").replace(/\bshan't\b/g, "shall not")
      .replace(/n't\b/g, " not").replace(/'m\b/g, " am").replace(/'re\b/g, " are")
      .replace(/'ve\b/g, " have").replace(/'ll\b/g, " will").replace(/'d\b/g, " would")
      .replace(/\bcan not\b/g, "cannot")
      .replace(/[.,!?;:"()…]/g, " ")
      .replace(/\s+/g, " ").trim();
    return s;
  }
  function matches(input, answers) {
    const n = norm(input);
    return n.length > 0 && answers.some(a => norm(a) === n);
  }

  let voice = null;
  function pickVoice() {
    if (!("speechSynthesis" in window)) return;
    const vs = speechSynthesis.getVoices();
    voice = vs.find(v => v.lang === "en-GB") || vs.find(v => v.lang && v.lang.startsWith("en")) || null;
  }
  if ("speechSynthesis" in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
  function speak(text) {
    if (!("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/\(.*?\)|sb\/sth|…/g, "").replace(/,.*$/, ""));
    u.lang = "en-GB"; if (voice) u.voice = voice; u.rate = 0.9;
    speechSynthesis.speak(u);
  }

  const INPUT_ATTRS = 'autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"';

  // ---------------------------------------------------------------- Quiz-Engine
  // q: {t:"mc"|"gap"|"multi", q, h, o, a, ex, fields:[{label, a:[...]}], key}
  function Quiz(el, questions, opts) {
    opts = opts || {};
    let list = opts.noShuffle ? questions.slice() : shuffle(questions);
    if (opts.count && opts.count < list.length) list = list.slice(0, opts.count);
    let i = 0, correct = 0, wrong = [], answered = false;

    function render() {
      if (i >= list.length) return finish();
      answered = false;
      const q = list[i];
      const pct = Math.round(100 * i / list.length);
      let body = "";
      const qText = esc(q.q).replace(/___/g, '<span class="gap">&nbsp;</span>');
      if (q.t === "mc") {
        body = `<div class="options">${q.o.map((o, k) => `<button class="opt" data-k="${k}">${esc(o)}</button>`).join("")}</div>`;
      } else if (q.t === "gap") {
        body = `<div class="answer-row"><input type="text" class="ans" ${INPUT_ATTRS} placeholder="Antwort eintippen …"><button class="btn teal check">Prüfen</button></div>`;
      } else if (q.t === "multi") {
        body = q.fields.map((f, k) => `<label style="display:block;font-weight:600;margin:8px 0 4px">${esc(f.label)}</label><input type="text" class="ans" data-k="${k}" ${INPUT_ATTRS}>`).join("") +
          `<div class="btn-row"><button class="btn teal check">Prüfen</button></div>`;
      }
      el.innerHTML = `
        <div class="progress"><span style="width:${pct}%"></span></div>
        <div class="q-card">
          <div class="q-num">Frage ${i + 1} von ${list.length} · ✓ ${correct}</div>
          <div class="q-text">${qText}</div>
          ${q.h ? `<div class="q-hint">Hinweis: ${esc(q.h)}</div>` : ""}
          ${body}
          <div class="feedback"></div>
          <div class="btn-row next-row" style="display:none"><button class="btn next">Weiter →</button></div>
        </div>`;
      const first = el.querySelector("input.ans");
      if (first && !opts.noFocus) setTimeout(() => first.focus({ preventScroll: true }), 30);
      if (q.t === "mc") el.querySelectorAll(".opt").forEach(b => b.addEventListener("click", () => checkMC(+b.dataset.k)));
      const c = el.querySelector(".check"); if (c) c.addEventListener("click", checkInput);
      el.querySelectorAll("input.ans").forEach(inp => inp.addEventListener("keydown", e => {
        if (e.key === "Enter") { e.preventDefault(); answered ? next() : checkInput(); }
      }));
      el.querySelector(".next").addEventListener("click", next);
    }

    function feedback(ok, solution) {
      const q = list[i];
      const fb = el.querySelector(".feedback");
      fb.className = "feedback show " + (ok ? "ok" : "no");
      fb.innerHTML = (ok ? "<strong>Richtig! 🎉</strong>" : `<strong>Leider falsch.</strong> Richtig: <strong>${esc(solution)}</strong>`) +
        (q.ex ? `<div class="expl">${esc(q.ex)}</div>` : "");
      if (ok) correct++; else wrong.push(q);
      if (q.key) { ok ? markRight(q.key) : markWrong(q.key); }
      answered = true;
      el.querySelector(".next-row").style.display = "flex";
      const nb = el.querySelector(".next");
      setTimeout(() => nb.focus({ preventScroll: true }), 30);
      document.addEventListener("keydown", enterNext);
    }
    function enterNext(e) {
      if (e.key === "Enter" && answered && document.activeElement && !document.activeElement.classList.contains("ans")) { e.preventDefault(); next(); }
    }

    function checkMC(k) {
      if (answered) return;
      const q = list[i];
      el.querySelectorAll(".opt").forEach((b, n) => {
        b.disabled = true;
        if (n === q.a) b.classList.add("correct");
        else if (n === k) b.classList.add("wrong");
      });
      feedback(k === q.a, q.o[q.a]);
    }

    function checkInput() {
      if (answered) return;
      const q = list[i];
      const inputs = [...el.querySelectorAll("input.ans")];
      if (inputs.every(x => !x.value.trim())) { inputs[0].focus(); return; }
      inputs.forEach(x => x.readOnly = true);
      el.querySelector(".check").disabled = true;
      if (q.t === "gap") {
        feedback(matches(inputs[0].value, q.a), q.a[0]);
      } else {
        let all = true;
        inputs.forEach((x, k) => {
          const ok = matches(x.value, q.fields[k].a);
          x.style.borderColor = ok ? "var(--ok)" : "var(--bad)";
          all = all && ok;
        });
        feedback(all, q.fields.map(f => f.a.join(" / ")).join(" – "));
      }
    }

    function next() {
      document.removeEventListener("keydown", enterNext);
      i++; render();
      el.scrollIntoView({ block: "nearest" });
    }

    function finish() {
      const total = list.length;
      const pct = Math.round(100 * correct / total);
      if (opts.id) saveScore(opts.id, correct, total);
      const msg = pct >= 90 ? "Super! Das sitzt. 🌟" : pct >= 70 ? "Gut gemacht! Noch ein bisschen üben. 💪" : pct >= 50 ? "Ordentlich – die Fehler nochmal wiederholen. 🙂" : "Weiter üben – du schaffst das! 📚";
      el.innerHTML = `
        <div class="result">
          <div class="score">${correct} / ${total}</div>
          <div>${pct} % richtig · ${msg}</div>
          ${wrong.length ? `<div class="review-list"><strong>Diese solltest du wiederholen:</strong><ul>${wrong.map(q => `<li>${esc(q.q.replace(/___/g, "…"))} → <strong>${esc(solutionOf(q))}</strong></li>`).join("")}</ul></div>` : ""}
          <div class="btn-row" style="justify-content:center">
            ${wrong.length ? `<button class="btn retry-wrong">Nur Fehler wiederholen</button>` : ""}
            <button class="btn teal restart">Neu starten</button>
          </div>
        </div>`;
      const rw = el.querySelector(".retry-wrong");
      if (rw) rw.addEventListener("click", () => Quiz(el, wrong, Object.assign({}, opts, { count: 0 })));
      el.querySelector(".restart").addEventListener("click", () => opts.onRestart ? opts.onRestart() : Quiz(el, questions, opts));
    }

    function solutionOf(q) {
      if (q.t === "mc") return q.o[q.a];
      if (q.t === "gap") return q.a[0];
      return q.fields.map(f => f.a[0]).join(" – ");
    }

    render();
  }

  // ---------------------------------------------------------------- Vokabel-Helfer
  function cleanEn(s) {
    return s.replace(/\(.*?\)/g, "").replace(/,\s*hung out.*$/, "").replace(/sb\/sth/g, "").replace(/…/g, "").replace(/\s+/g, " ").trim();
  }
  function vocabAnswers(v) {
    const set = new Set([v.en]);
    [v.en].concat(v.alt || []).forEach(x => {
      const c = cleanEn(x); set.add(c);
      if (/^to /i.test(c)) set.add(c.replace(/^to /i, ""));
    });
    return [...set];
  }
  function sections() { return [...new Set(window.VOCAB.map(v => v.s))]; }

  function filterVocab(sel, onlyWrong) {
    const w = wrongMap();
    return window.VOCAB.filter(v => (sel.length === 0 || sel.includes(v.s)) && (!onlyWrong || w[v.en]));
  }

  function chipFilter(container, onChange, withWrong) {
    const secs = sections();
    let sel = [], onlyWrong = false;
    container.innerHTML = `<button class="chip on" data-s="*">Alle</button>` +
      secs.map(s => `<button class="chip" data-s="${esc(s)}">${esc(s)}</button>`).join("") +
      (withWrong ? `<button class="chip" data-s="!">⚠ Meine Fehlerwörter</button>` : "");
    container.addEventListener("click", e => {
      const b = e.target.closest(".chip"); if (!b) return;
      const s = b.dataset.s;
      if (s === "*") { sel = []; onlyWrong = false; }
      else if (s === "!") { onlyWrong = !onlyWrong; }
      else { sel = sel.includes(s) ? sel.filter(x => x !== s) : sel.concat(s); }
      container.querySelectorAll(".chip").forEach(c => {
        const d = c.dataset.s;
        c.classList.toggle("on", d === "*" ? (sel.length === 0 && !onlyWrong) : d === "!" ? onlyWrong : sel.includes(d));
      });
      onChange(sel, onlyWrong);
    });
    return () => ({ sel, onlyWrong });
  }

  // ---- Vokabelliste
  function initVocabList() {
    const listEl = document.getElementById("vocab-list");
    if (!listEl) return;
    const search = document.getElementById("vocab-search");
    const count = document.getElementById("vocab-count");
    const get = chipFilter(document.getElementById("vocab-chips"), draw, true);
    function draw() {
      const { sel, onlyWrong } = get();
      const term = norm(search.value || "");
      const w = wrongMap();
      // Bei einer Suche wird immer in allen Abschnitten gesucht
      const items = (term ? window.VOCAB : filterVocab(sel, onlyWrong)).filter(v => !term || norm(v.en + " " + v.de).includes(term));
      count.textContent = items.length + (items.length === 1 ? " Wort" : " Wörter") + (term ? " (Suche in allen Abschnitten)" : "");
      let cur = "";
      listEl.innerHTML = items.map(v => {
        let h = "";
        if (v.s !== cur) { cur = v.s; h = `<li><h2 style="margin:18px 0 8px">${esc(v.s)}</h2></li>`; }
        return h + `<li class="vocab-item">
          <div><span class="w">${esc(v.en)}</span>${v.ipa ? `<span class="ipa">[${esc(v.ipa)}]</span>` : ""}${w[v.en] ? `<span class="tag">⚠ üben</span>` : ""}
          <div class="g">${esc(v.de)}</div></div>
          <button class="say" aria-label="Vorlesen" data-say="${esc(v.en)}">🔊</button>
          ${v.ex ? `<div class="s">${esc(v.ex)}</div>` : ""}
          ${v.note ? `<div class="n">💡 ${esc(v.note)}</div>` : ""}
        </li>`;
      }).join("") || "<li>Keine Wörter gefunden.</li>";
    }
    listEl.addEventListener("click", e => { const b = e.target.closest(".say"); if (b) speak(b.dataset.say); });
    search.addEventListener("input", draw);
    draw();
  }

  // ---- Karteikarten (Vokabeln oder Verben)
  function Flashcards(el, cards, opts) {
    opts = opts || {};
    let deck = shuffle(cards), i = 0, known = 0;
    function render() {
      if (!deck.length) { el.innerHTML = "<p>Keine Karten in dieser Auswahl.</p>"; return; }
      if (i >= deck.length) {
        el.innerHTML = `<div class="result"><div class="score">${known} / ${deck.length}</div><div>gewusst</div>
          <div class="btn-row" style="justify-content:center"><button class="btn teal again">Nochmal mischen</button></div></div>`;
        el.querySelector(".again").addEventListener("click", () => { deck = shuffle(cards); i = 0; known = 0; render(); });
        return;
      }
      const c = deck[i];
      el.innerHTML = `
        <div class="flash-meta"><span>Karte ${i + 1} / ${deck.length}</span><span>✓ ${known}</span></div>
        <div class="flashcard" tabindex="0" role="button" aria-label="Karte umdrehen">
          <div class="inner">
            <div class="face front"><div class="big">${esc(c.front)}</div>${c.frontSmall ? `<div class="small">${esc(c.frontSmall)}</div>` : ""}<div class="small">antippen zum Umdrehen</div></div>
            <div class="face back"><div class="big">${esc(c.back)}</div>${c.backSmall ? `<div class="small" style="color:var(--muted)">${esc(c.backSmall)}</div>` : ""}</div>
          </div>
        </div>
        <div class="btn-row" style="justify-content:center">
          <button class="btn ghost no">✗ Nochmal</button>
          <button class="btn teal yes">✓ Wusste ich</button>
          ${c.say ? `<button class="say" aria-label="Vorlesen">🔊</button>` : ""}
        </div>`;
      const card = el.querySelector(".flashcard");
      const flip = () => card.classList.toggle("flipped");
      card.addEventListener("click", flip);
      card.addEventListener("keydown", e => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); flip(); } });
      el.querySelector(".yes").addEventListener("click", () => { known++; if (c.key) markRight(c.key); i++; render(); });
      el.querySelector(".no").addEventListener("click", () => { if (c.key) markWrong(c.key); deck.push(c); i++; render(); });
      const s = el.querySelector(".say"); if (s) s.addEventListener("click", e => { e.stopPropagation(); speak(c.say); });
    }
    render();
  }

  function initVocabFlash() {
    const el = document.getElementById("vocab-flash");
    if (!el) return;
    const dirSel = document.getElementById("flash-dir");
    const get = chipFilter(document.getElementById("flash-chips"), start, true);
    function start() {
      const { sel, onlyWrong } = get();
      const de2en = dirSel.value === "de-en";
      const cards = filterVocab(sel, onlyWrong).map(v => de2en
        ? { front: v.de, back: v.en, backSmall: v.ex, key: v.en, say: v.en }
        : { front: v.en, frontSmall: v.ipa ? "[" + v.ipa + "]" : "", back: v.de, backSmall: v.ex, key: v.en, say: v.en });
      Flashcards(el, cards);
    }
    dirSel.addEventListener("change", start);
    start();
  }

  // ---- Crashkurs-Karteikarten (Kernwörter)
  function initCrashFlash() {
    const el = document.getElementById("crash-flash");
    if (!el || !window.CRASH_VOCAB) return;
    const dirSel = document.getElementById("crash-dir");
    const core = window.VOCAB.filter(v => window.CRASH_VOCAB.includes(v.en));
    function start() {
      const de2en = dirSel && dirSel.value === "de-en";
      Flashcards(el, core.map(v => de2en
        ? { front: v.de, back: v.en, backSmall: v.ex, key: v.en, say: v.en }
        : { front: v.en, frontSmall: v.ipa ? "[" + v.ipa + "]" : "", back: v.de, backSmall: v.ex, key: v.en, say: v.en }));
    }
    if (dirSel) dirSel.addEventListener("change", start);
    start();
  }

  // ---- Vokabeltest
  function blankSentence(v) {
    if (!v.ex) return null;
    const core = cleanEn(v.en).replace(/^to /i, ""); // Kernausdruck
    const candidates = [core];
    // einfache Flexionen
    if (!core.includes(" ")) candidates.push(core + "s", core + "es", core + "d", core + "ed", core.replace(/y$/, "ies"));
    for (const c of candidates) {
      const re = new RegExp("\\b" + c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i");
      const m = v.ex.match(re);
      if (m) return { q: v.ex.replace(re, "___"), a: [m[0]] };
    }
    return null;
  }

  function initVocabTest() {
    const el = document.getElementById("vocab-test");
    if (!el) return;
    const modeSel = document.getElementById("vt-mode");
    const countSel = document.getElementById("vt-count");
    const startBtn = document.getElementById("vt-start");
    const get = chipFilter(document.getElementById("vt-chips"), () => {}, true);
    function build() {
      const { sel, onlyWrong } = get();
      const pool = filterVocab(sel, onlyWrong);
      const mode = modeSel.value;
      let qs = [];
      if (mode === "de-en") {
        qs = pool.map(v => ({ t: "gap", q: v.de, h: "Wie heißt das auf Englisch?" + (v.en.startsWith("to ") ? " („to“ kannst du weglassen)" : ""), a: vocabAnswers(v), ex: v.ex, key: v.en }));
      } else if (mode === "en-de") {
        const allDe = window.VOCAB.map(v => v.de);
        qs = pool.map(v => {
          const wrongs = shuffle(allDe.filter(d => d !== v.de)).slice(0, 3);
          const o = shuffle([v.de].concat(wrongs));
          return { t: "mc", q: v.en, o, a: o.indexOf(v.de), ex: v.ex, key: v.en };
        });
      } else {
        qs = pool.map(v => { const b = blankSentence(v); return b ? { t: "gap", q: b.q, h: v.de, a: b.a, ex: v.ex, key: v.en } : null; }).filter(Boolean);
      }
      if (!qs.length) { el.innerHTML = "<p>Keine Wörter in dieser Auswahl. Wähle andere Abschnitte.</p>"; return; }
      Quiz(el, qs, { id: "vocab-" + mode, count: +countSel.value, onRestart: build });
    }
    startBtn.addEventListener("click", () => { build(); el.scrollIntoView({ behavior: "smooth", block: "start" }); });
  }

  // ---------------------------------------------------------------- Verben
  function verbForms(s) { return s.split("/"); }

  function initVerbTable() {
    const el = document.getElementById("verb-table");
    if (!el) return;
    const search = document.getElementById("verb-search");
    function draw() {
      const t = norm(search.value || "");
      const rows = window.VERBS.filter(v => !t || norm(v.join(" ")).includes(t));
      el.innerHTML = `<div class="table-wrap"><table class="compact">
        <thead><tr><th>Infinitive</th><th>Simple past</th><th>Past participle</th><th>Deutsch</th><th></th></tr></thead>
        <tbody>${rows.map(v => `<tr><td><strong>${esc(v[0])}</strong></td><td>${esc(v[1])}</td><td>${esc(v[2])}</td><td>${esc(v[3])}</td>
          <td><button class="say" data-say="${esc(v[0] + ", " + v[1].replace("/", ", ") + ", " + v[2].replace("/", ", "))}" aria-label="Vorlesen">🔊</button></td></tr>
          <tr><td colspan="5" class="de" style="font-style:italic;padding-top:0">${esc(v[4])}</td></tr>`).join("")}</tbody></table></div>`;
    }
    el.addEventListener("click", e => {
      const b = e.target.closest(".say"); if (!b) return;
      if (!("speechSynthesis" in window)) return;
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(b.dataset.say); u.lang = "en-GB"; if (voice) u.voice = voice; u.rate = 0.85; speechSynthesis.speak(u);
    });
    search.addEventListener("input", draw);
    draw();
  }

  function initVerbFlash() {
    const el = document.getElementById("verb-flash");
    if (!el) return;
    Flashcards(el, window.VERBS.map(v => ({ front: v[0], frontSmall: v[3], back: v[1] + " – " + v[2], backSmall: v[4], say: v[0] })));
  }

  function verbQuestions(mode) {
    return window.VERBS.map(v => {
      if (mode === "past") return { t: "gap", q: v[0] + " (" + v[3] + ")", h: "Simple past?", a: verbForms(v[1]).concat([v[1]]), ex: v[0] + " – " + v[1] + " – " + v[2] };
      if (mode === "pp") return { t: "gap", q: v[0] + " (" + v[3] + ")", h: "Past participle (3. Form)?", a: verbForms(v[2]).concat([v[2]]), ex: v[0] + " – " + v[1] + " – " + v[2] };
      if (mode === "both") return { t: "multi", q: v[0] + " (" + v[3] + ")", fields: [{ label: "Simple past", a: verbForms(v[1]).concat([v[1]]) }, { label: "Past participle", a: verbForms(v[2]).concat([v[2]]) }], ex: v[0] + " – " + v[1] + " – " + v[2] };
      return { t: "multi", q: v[3], h: "Alle drei Formen", fields: [{ label: "Infinitive", a: [v[0]] }, { label: "Simple past", a: verbForms(v[1]).concat([v[1]]) }, { label: "Past participle", a: verbForms(v[2]).concat([v[2]]) }], ex: v[0] + " – " + v[1] + " – " + v[2] };
    });
  }

  function initVerbTest() {
    const el = document.getElementById("verb-test");
    if (!el) return;
    const modeSel = document.getElementById("verb-mode");
    const countSel = document.getElementById("verb-count");
    const go = () => Quiz(el, verbQuestions(modeSel.value), { id: "verbs-" + modeSel.value, count: +countSel.value, onRestart: go });
    document.getElementById("verb-start").addEventListener("click", () => { go(); el.scrollIntoView({ behavior: "smooth", block: "start" }); });
  }

  // ---------------------------------------------------------------- Feste Quizze per data-Attribut
  function initBankQuizzes() {
    document.querySelectorAll("[data-quiz]").forEach(el => {
      const names = el.dataset.quiz.split(",");
      let qs = [];
      names.forEach(n => { qs = qs.concat(window.BANKS[n] || []); });
      if (names.includes("verbs")) qs = qs.concat(shuffle(verbQuestions("both")).slice(0, 8));
      const count = +(el.dataset.count || 0);
      const id = el.dataset.id || el.dataset.quiz;
      const startBtn = el.dataset.start ? document.getElementById(el.dataset.start) : null;
      const run = () => Quiz(el, qs, { id, count, onRestart: run, noFocus: !startBtn });
      if (startBtn) startBtn.addEventListener("click", () => { run(); el.scrollIntoView({ behavior: "smooth", block: "start" }); });
      else run();
    });
  }

  // ---------------------------------------------------------------- Checklisten & Ergebnisse
  function initChecklists() {
    document.querySelectorAll(".checklist[data-id]").forEach(ul => {
      const id = "check." + ul.dataset.id;
      const state = Store.get(id, {});
      ul.querySelectorAll("input[type=checkbox]").forEach((cb, k) => {
        cb.checked = !!state[k];
        cb.addEventListener("change", () => { state[k] = cb.checked; Store.set(id, state); });
      });
    });
  }

  function initScores() {
    const scores = Store.get("scores", {});
    document.querySelectorAll("[data-score]").forEach(el => {
      const ids = el.dataset.score.split(",");
      const best = ids.map(id => scores[id]).filter(Boolean);
      if (!best.length) { el.textContent = "noch nicht gemacht"; return; }
      const b = Math.max(...best.map(s => s.best));
      el.textContent = "bestes Ergebnis: " + b + " %";
    });
    const wc = document.getElementById("wrong-count");
    if (wc) { const n = Object.keys(wrongMap()).length; wc.textContent = n + (n === 1 ? " Wort" : " Wörter"); }
  }

  function initReveal() {
    document.querySelectorAll("[data-reveal]").forEach(btn => {
      btn.addEventListener("click", () => {
        const t = document.getElementById(btn.dataset.reveal);
        const show = t.hidden;
        t.hidden = !show;
        btn.textContent = show ? "Musterlösung ausblenden" : "Musterlösung anzeigen";
      });
    });
  }

  // ---------------------------------------------------------------- Start
  document.addEventListener("DOMContentLoaded", () => {
    buildLayout();
    initVocabList(); initVocabFlash(); initVocabTest(); initCrashFlash();
    initVerbTable(); initVerbFlash(); initVerbTest();
    initBankQuizzes(); initChecklists(); initScores(); initReveal();
    document.querySelectorAll("[data-say]").forEach(b => { if (!b.closest("#vocab-list") && !b.closest("#verb-table")) b.addEventListener("click", () => speak(b.dataset.say)); });
  });

  window.Luna = { Quiz, speak, Store, norm, matches };
})();
