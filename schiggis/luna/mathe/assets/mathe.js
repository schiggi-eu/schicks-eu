/* Luna – Mathe „Terme mit einer Variablen“ · Engine: Term-Parser, Prüfung, Darstellung, Tabs */
(function () {
  "use strict";

  // ================================================================ Term-Parser
  // Schreibweise im Aufgabentext („Anzeige“): {3/4} = Bruch, · = mal, − = minus, Komma = Dezimalzeichen
  function toMachine(s) {
    return String(s)
      .replace(/\{(-?[\d.,]+)\/([\d.,]+)\}/g, "($1/$2)")
      .replace(/[·⋅×∙•]/g, "*")
      .replace(/[−–—]/g, "-")
      .replace(/[÷:]/g, "/")
      .replace(/€|euro/gi, "")
      .replace(/,/g, ".")
      .replace(/\s+/g, "")
      .replace(/^=/, "")
      .toLowerCase();
  }

  function tokenize(s) {
    const t = [];
    let i = 0;
    while (i < s.length) {
      const c = s[i];
      if (/[0-9.]/.test(c)) {
        let j = i;
        while (j < s.length && /[0-9.]/.test(s[j])) j++;
        const raw = s.slice(i, j);
        if (!/^(\d+(\.\d+)?|\.\d+)$/.test(raw)) return null;
        t.push({ t: "n", v: parseFloat(raw) });
        i = j;
      } else if (/[a-z]/.test(c)) { t.push({ t: "v", v: c }); i++; }
      else if ("+-*/()".includes(c)) { t.push({ t: c }); i++; }
      else return null;
    }
    return t;
  }

  function parse(str) {
    const tk = tokenize(toMachine(str));
    if (!tk || !tk.length) return null;
    let p = 0;
    const vars = new Set();
    const peek = () => tk[p];
    function sum() {
      let a = term();
      while (peek() && (peek().t === "+" || peek().t === "-")) {
        const op = tk[p++].t, A = a, B = term();
        a = op === "+" ? e => A(e) + B(e) : e => A(e) - B(e);
      }
      return a;
    }
    function term() {
      let a = unary();
      for (;;) {
        const k = peek();
        if (!k) break;
        if (k.t === "*" || k.t === "/") {
          p++;
          const A = a, B = unary();
          a = k.t === "*" ? e => A(e) * B(e) : e => A(e) / B(e);
        } else if (k.t === "v" || k.t === "(" || k.t === "n") {
          const A = a, B = factor();
          a = e => A(e) * B(e);
        } else break;
      }
      return a;
    }
    function unary() {
      const k = peek();
      if (k && (k.t === "-" || k.t === "+")) { p++; const a = unary(); return k.t === "-" ? e => -a(e) : a; }
      return factor();
    }
    function factor() {
      const k = tk[p++];
      if (!k) throw 0;
      if (k.t === "n") return () => k.v;
      if (k.t === "v") { vars.add(k.v); return e => e[k.v]; }
      if (k.t === "(") {
        const a = sum();
        if (!peek() || peek().t !== ")") throw 0;
        p++;
        return a;
      }
      throw 0;
    }
    try {
      const f = sum();
      if (p !== tk.length) return null;
      return { f, vars };
    } catch (e) { return null; }
  }

  const TRY = [1.7, -2.3, 0.6, 3.1, -0.45, 2.9, -1.15];
  function close(a, b) { return isFinite(a) && isFinite(b) && Math.abs(a - b) <= 1e-7 * Math.max(1, Math.abs(a), Math.abs(b)); }

  function equiv(a, b) {
    const A = typeof a === "string" ? parse(a) : a, B = typeof b === "string" ? parse(b) : b;
    if (!A || !B) return false;
    const vs = [...new Set([...A.vars, ...B.vars])];
    for (let r = 0; r < 6; r++) {
      const env = {};
      vs.forEach((v, k) => { env[v] = TRY[(r + 2 * k) % TRY.length] + 0.13 * k; });
      if (!close(A.f(env), B.f(env))) return false;
    }
    return true;
  }

  function value(s, env) { const P = parse(s); return P ? P.f(env || {}) : NaN; }

  // ---------------------------------------------------------------- Normalform (fertig vereinfacht?)
  const NUM = "\\d+(?:\\.\\d+)?";
  const COEF = NUM + "(?:/" + NUM + ")?";
  const T = "(?:(?:" + COEF + ")\\*?)?[a-z](?:/" + NUM + ")?|" + COEF;
  const RE_NORMAL = new RegExp("^[+-]?(?:" + T + ")(?:[+-](?:" + T + "))*$");
  const RE_TERMS = new RegExp("[+-]?(?:" + T + ")", "g");
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; }

  function normalInfo(input) {
    let m = toMachine(input).replace(/\((\d+(?:\.\d+)?\/\d+(?:\.\d+)?)\)/g, "$1");
    if (!RE_NORMAL.test(m)) return { ok: false, why: "Da stehen noch Klammern oder Produkte – rechne sie aus." };
    const terms = m.match(RE_TERMS) || [];
    const seen = {};
    let consts = 0;
    for (const t of terms) {
      const v = (t.match(/[a-z]/) || [])[0];
      if (v) { if (seen[v]) return { ok: false, why: "Fasse gleichartige Glieder (" + v + "-Glieder) zusammen." }; seen[v] = 1; }
      else if (++consts > 1) return { ok: false, why: "Fasse die Zahlen noch zusammen." };
      const fr = t.match(/(\d+)\/(\d+)(?![.\d])/);
      if (fr && (gcd(+fr[1], +fr[2]) > 1 || +fr[2] === 1)) return { ok: false, why: "Kürze den Bruch noch." };
      if (/^[+-]?0(?:\.0+)?\*?[a-z]/.test(t)) return { ok: false, why: "Glieder mit 0 kannst du weglassen." };
    }
    return { ok: true };
  }

  // ---------------------------------------------------------------- Zahlen lesen
  const RE_NUMBER = new RegExp("^[+-]?" + COEF + "$");
  function readNumber(raw) {
    const mixed = String(raw).match(/^\s*([+\-−]?)\s*(\d+)\s+(\d+)\s*\/\s*(\d+)\s*$/);
    if (mixed) return { v: (mixed[1] && mixed[1] !== "+" ? -1 : 1) * (+mixed[2] + mixed[3] / mixed[4]), unreduced: gcd(+mixed[3], +mixed[4]) > 1 };
    const m = toMachine(raw).replace(/(m²|m2|cm|m|stück|schuppen|fliesen|streichhölzer|hölzer)$/, "")
      .replace(/^([+-]?)\((\d+(?:\.\d+)?\/\d+(?:\.\d+)?)\)$/, "$1$2");
    if (!RE_NUMBER.test(m)) return null;
    const fr = m.match(/(\d+)\/(\d+)$/);
    return { v: value(m), unreduced: !!(fr && !/\./.test(m) && (gcd(+fr[1], +fr[2]) > 1 || +fr[2] === 1)) };
  }

  // ================================================================ Prüfen
  // Ergebnis: {s: "ok"|"half"|"no"|"empty", msg}
  function checkField(f, input, extra) {
    const raw = Array.isArray(input) ? input : String(input || "").trim();
    if (f.k === "sel") {
      if (raw === "" || raw === null) return { s: "empty" };
      const ok = [].concat(f.a).includes(+raw);
      return { s: ok ? "ok" : "no" };
    }
    if (f.k === "pair") {
      if (raw.every(x => !String(x).trim())) return { s: "empty" };
      const vals = raw.map(x => readNumber(x));
      if (vals.some(v => !v)) return { s: "no", msg: "Trage in jedes Feld eine Zahl ein." };
      const ok = f.sols.some(sol => sol.every((s, k) => close(value(s), vals[k].v)));
      return { s: ok ? "ok" : "no" };
    }
    if (!raw) return { s: "empty" };
    if (f.k === "num") {
      const n = readNumber(raw);
      if (!n) {
        const P = parse(raw);
        return { s: "no", msg: P && !P.vars.size && close(P.f({}), value(f.a)) ? "Rechne das Ergebnis ganz aus – hier gehört nur eine Zahl hin." : "Hier gehört nur eine Zahl hin (z. B. 1,5 oder 3/4)." };
      }
      if (!close(n.v, value(f.a))) return { s: "no" };
      return n.unreduced ? { s: "half", msg: "Richtig – aber kürze den Bruch noch." } : { s: "ok" };
    }
    const P = parse(raw);
    if (!P) return { s: "no", msg: "Das kann ich nicht lesen. Tipp: 3/4 für Brüche, * oder · für mal." };
    const A = parse(f.a);
    const want = [...A.vars], got = [...P.vars];
    if (got.some(v => !want.includes(v))) return { s: "no", msg: "Verwende die Variable " + (want.join(", ") || "– keine –") + "." };
    const eq = equiv(P, A);
    if (f.k === "term") {
      if (!eq) return { s: "no" };
      if (extra && extra.others && extra.others.some(o => o && toMachine(o) === toMachine(raw))) return { s: "half", msg: "Gleichwertig – aber der zweite Term soll anders aussehen als der erste." };
      return { s: "ok" };
    }
    if (f.k === "simp") {
      if (!eq) return { s: "no" };
      const ni = normalInfo(raw);
      return ni.ok ? { s: "ok" } : { s: "half", msg: "Gleichwertig, aber noch nicht fertig vereinfacht. " + ni.why };
    }
    if (f.k === "fac") {
      if (!eq) return { s: "no" };
      const m = toMachine(raw);
      const g = m.match(/^([+-]?\d+(?:\.\d+)?)\*?\((.+)\)$/) || m.match(/^\((.+)\)\*?([+-]?\d+(?:\.\d+)?)$/);
      if (!g) return { s: "no", msg: "Gleichwertig, aber nicht ausgeklammert. So soll es aussehen: Zahl · ( … )." };
      const k = Math.abs(parseFloat(/^\(/.test(m) ? g[2] : g[1]));
      if (close(k, f.kk)) return { s: "ok" };
      return { s: "half", msg: k < f.kk ? "Richtig ausgeklammert – aber es geht eine größere Zahl." : "Dann entstehen in der Klammer Brüche/Kommazahlen – nimm eine kleinere Zahl." };
    }
    return { s: eq ? "ok" : "no" };
  }

  // ================================================================ Darstellung
  function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
  function fmt(s) {
    return esc(s)
      .replace(/\{(−?-?[\d,]+)\/([\d,]+)\}/g, '<span class="frac"><span>$1</span><span>$2</span></span>')
      .replace(/□/g, '<span class="sym">□</span>')
      .replace(/△/g, '<span class="sym tri">△</span>');
  }

  const STORE = "luna.mathe.inputs";
  function loadInputs() { try { return JSON.parse(localStorage.getItem(STORE) || "{}"); } catch (e) { return {}; } }
  function saveInputs(m) { try { localStorage.setItem(STORE, JSON.stringify(m)); } catch (e) {} }
  function saveScore(id, got, total) {
    try {
      const scores = JSON.parse(localStorage.getItem("luna.scores") || "{}");
      const pct = total ? Math.round(100 * got / total) : 0;
      const prev = scores[id] || { best: 0, runs: 0 };
      scores[id] = { best: Math.max(prev.best, pct), last: pct, runs: prev.runs + 1, date: new Date().toISOString().slice(0, 10) };
      localStorage.setItem("luna.scores", JSON.stringify(scores));
    } catch (e) {}
  }

  const ATTR = 'autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="next"';

  function fieldsOf(it) { return it.f || [Object.assign({}, it, { p: it.p })]; }

  function fieldHTML(f, id, saved) {
    const pre = f.p ? `<span class="pre">${fmt(f.p)}</span>` : "";
    if (f.k === "sel") {
      return `<span class="fld" data-id="${id}">${pre}<select class="inp" data-id="${id}"><option value="">– wählen –</option>${f.o.map((o, k) => `<option value="${k}"${String(saved) === String(k) ? " selected" : ""}>${fmt(o)}</option>`).join("")}</select></span>`;
    }
    if (f.k === "pair") {
      return `<span class="fld" data-id="${id}">${f.labels.map((l, k) => `<span class="pre">${fmt(l)} =</span><input type="text" class="inp short" data-id="${id}" data-sub="${k}" value="${esc((saved || [])[k] || "")}" ${ATTR}>`).join("")}</span>`;
    }
    const cls = f.k === "num" ? "inp short" : "inp";
    const ph = f.k === "num" ? "Zahl" : f.k === "fac" ? "Zahl·( … )" : "Term";
    return `<span class="fld" data-id="${id}">${pre}<input type="text" class="${cls}" data-id="${id}" value="${esc(saved || "")}" placeholder="${ph}" ${ATTR}${f.k === "num" ? ' inputmode="text"' : ""}>${f.u ? `<span class="post">${fmt(f.u)}</span>` : ""}</span>`;
  }

  function solText(f) {
    if (f.k === "sel") return [].concat(f.a).map(k => f.o[k]).join(" oder ");
    if (f.k === "pair") return f.sols.map(s => f.labels.map((l, k) => l + " = " + s[k].replace(/-/g, "−").replace(/\./g, ",")).join(", ")).join("  oder  ");
    return f.show || f.a;
  }

  // Eine Aufgabe (Task) rendern
  function renderTask(sec, t, ti, saved) {
    const items = t.items.map((it, ii) => {
      const fs = fieldsOf(it);
      const single = !it.f;
      const ids = fs.map((f, fi) => `${sec}/${ti}/${ii}/${fi}`);
      const fieldsHtml = fs.map((f, fi) => fieldHTML(f, ids[fi], saved[ids[fi]])).join("");
      const q = it.q ? `<span class="mq">${fmt(it.q)}</span>` : "";
      const eq = single && it.q && it.k !== "sel" && !it.p && !it.noeq ? '<span class="eqs">=</span>' : "";
      return `<div class="mi${it.wide ? " wide" : ""}" data-ii="${ii}">
        <div class="mline"><span class="ml">${esc(it.l || "")}</span>${q}${eq}${single ? fieldsHtml : ""}</div>
        ${single ? "" : `<div class="mfields">${fieldsHtml}</div>`}
        <div class="msol"></div>
      </div>`;
    }).join("");
    const cards = t.cards ? `<div class="mcards">${t.cards.map(c => `<span class="mcard"><span class="mterm">${fmt(c.t)}</span><span class="tagc">${esc(c.id)}</span></span>`).join("")}</div>` : "";
    return `<article class="mtask" id="${sec}-a${t.n}" data-ti="${ti}">
      <h3><span class="tn">${esc(t.n)}</span><span class="tt">${fmt(t.t)}</span><span class="tp"></span></h3>
      ${t.h ? `<p class="th">${fmt(t.h)}</p>` : ""}
      ${t.fig ? `<div class="mfig">${t.fig}</div>` : ""}
      ${cards}
      <div class="mitems${t.cols ? " cols" : ""}">${items}</div>
      <div class="btn-row"><button class="btn teal small chk">✓ Aufgabe ${esc(t.n)} prüfen</button></div>
    </article>`;
  }

  function readField(sec, f, id, root) {
    if (f.k === "pair") return [...root.querySelectorAll(`input[data-id="${id}"]`)].map(x => x.value);
    const el = root.querySelector(`.inp[data-id="${id}"]`);
    return el ? el.value : "";
  }

  function checkTask(sec, t, ti, root) {
    const art = root.querySelector(`.mtask[data-ti="${ti}"]`);
    let got = 0, total = 0;
    t.items.forEach((it, ii) => {
      const fs = fieldsOf(it);
      const box = art.querySelector(`.mi[data-ii="${ii}"]`);
      const vals = fs.map((f, fi) => readField(sec, f, `${sec}/${ti}/${ii}/${fi}`, art));
      const msgs = [];
      let allOk = true;
      fs.forEach((f, fi) => {
        const id = `${sec}/${ti}/${ii}/${fi}`;
        const others = it.distinct ? vals.filter((v, k) => k < fi && fs[k].k === "term") : null;
        const r = checkField(f, vals[fi], { others });
        total += 1;
        got += r.s === "ok" ? 1 : r.s === "half" ? 0.5 : 0;
        const wrap = art.querySelector(`.fld[data-id="${id}"]`);
        wrap.classList.remove("ok", "no", "half", "empty");
        wrap.classList.add(r.s);
        if (r.s !== "ok") {
          allOk = false;
          msgs.push((fs.length > 1 && f.p ? fmt(f.p) + " " : "") + (r.s === "empty" ? "<em>leer</em> – " : "") + "Lösung: <strong>" + fmt(solText(f)) + "</strong>" + (r.msg ? ` <span class="why">(${esc(r.msg)})</span>` : ""));
        }
      });
      const sol = box.querySelector(".msol");
      sol.className = "msol show " + (allOk ? "ok" : "no");
      sol.innerHTML = (allOk ? "✓ Richtig!" : msgs.join("<br>")) + (it.w ? `<div class="way">Weg: ${fmt(it.w)}</div>` : "");
    });
    art.querySelector(".tp").textContent = fmtPts(got) + " / " + total + " P.";
    art.classList.add("checked");
    return { got, total };
  }

  function fmtPts(x) { return String(x).replace(".", ","); }

  // Einen ganzen Abschnitt (Training / Runde) aufbauen
  function mountSection(el, sec, data, opts) {
    opts = opts || {};
    const saved = loadInputs();
    el.innerHTML = data.tasks.map((t, ti) => renderTask(sec, t, ti, saved)).join("") +
      `<div class="btn-row final"><button class="btn all">📝 Alles auswerten</button><button class="btn ghost clear">Eingaben löschen</button></div>
       <div class="msummary" hidden></div>`;
    el.addEventListener("input", e => {
      const x = e.target.closest(".inp"); if (!x) return;
      const m = loadInputs();
      if (x.dataset.sub !== undefined) { const a = m[x.dataset.id] || []; a[+x.dataset.sub] = x.value; m[x.dataset.id] = a; }
      else m[x.dataset.id] = x.value;
      saveInputs(m);
      const f = x.closest(".fld"); if (f) f.classList.remove("ok", "no", "half", "empty");
    });
    el.addEventListener("change", e => { if (e.target.tagName === "SELECT") e.target.dispatchEvent(new Event("input", { bubbles: true })); });
    el.addEventListener("keydown", e => {
      if (e.key !== "Enter" || !e.target.classList.contains("inp")) return;
      e.preventDefault();
      const all = [...el.querySelectorAll(".inp")];
      const n = all[all.indexOf(e.target) + 1];
      if (n) n.focus(); else e.target.blur();
    });
    el.querySelectorAll(".mtask").forEach(art => {
      const ti = +art.dataset.ti;
      art.querySelector(".chk").addEventListener("click", () => checkTask(sec, data.tasks[ti], ti, el));
    });
    el.querySelector(".all").addEventListener("click", () => {
      let got = 0, total = 0;
      const rows = data.tasks.map((t, ti) => { const r = checkTask(sec, t, ti, el); got += r.got; total += r.total; return { t, r }; });
      const pct = Math.round(100 * got / total);
      saveScore("mathe-" + sec, got, total);
      const msg = pct >= 90 ? "Super! Das sitzt. 🌟" : pct >= 75 ? "Gut gemacht! 💪 Schau dir die Fehler noch einmal an." : pct >= 50 ? "Ordentlich – die roten Aufgaben bitte nochmal üben. 🙂" : "Weiter üben – schau dir die Lösungswege an. 📚";
      const box = el.querySelector(".msummary");
      box.hidden = false;
      box.innerHTML = `<div class="result"><div class="score">${fmtPts(got)} / ${total}</div><div>Punkte · ${pct} % · ${msg}</div>
        <div class="table-wrap"><table class="compact"><thead><tr><th>Aufgabe</th><th>Punkte</th></tr></thead><tbody>${rows.map(({ t, r }) =>
          `<tr><td><a href="#${sec}-a${t.n}" data-jump="${sec}-a${t.n}">Aufgabe ${esc(t.n)}</a> – ${fmt(t.t)}</td><td class="${r.got === r.total ? "pok" : r.got === 0 ? "pno" : "phalf"}">${fmtPts(r.got)} / ${r.total}</td></tr>`).join("")}</tbody></table></div></div>`;
      box.querySelectorAll("[data-jump]").forEach(a => a.addEventListener("click", ev => { ev.preventDefault(); document.getElementById(a.dataset.jump).scrollIntoView({ behavior: "smooth", block: "start" }); }));
      box.scrollIntoView({ behavior: "smooth", block: "start" });
      if (opts.onScore) opts.onScore();
    });
    const clr = el.querySelector(".clear");
    clr.addEventListener("click", () => {
      if (!clr.dataset.armed) { clr.dataset.armed = "1"; clr.textContent = "Wirklich alles löschen? Nochmal tippen"; setTimeout(() => { delete clr.dataset.armed; clr.textContent = "Eingaben löschen"; }, 4000); return; }
      const m = loadInputs();
      Object.keys(m).filter(k => k.startsWith(sec + "/")).forEach(k => delete m[k]);
      saveInputs(m);
      mountSection(el, sec, data, opts);
    });
  }

  // ================================================================ Tastenleiste (iPad/Handy)
  function initKeybar() {
    const bar = document.getElementById("keybar");
    if (!bar) return;
    let last = null;
    document.addEventListener("focusin", e => {
      if (e.target.matches && e.target.matches("input.inp")) { last = e.target; bar.classList.add("show"); }
    });
    document.addEventListener("focusout", () => setTimeout(() => { if (!document.activeElement || !document.activeElement.matches("input.inp")) bar.classList.remove("show"); }, 150));
    bar.addEventListener("pointerdown", e => e.preventDefault());
    bar.addEventListener("mousedown", e => e.preventDefault());
    bar.addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b || !last) return;
      const k = b.dataset.k;
      if (k === "⌫") {
        const s = last.selectionStart, en = last.selectionEnd;
        if (s === en && s > 0) last.setRangeText("", s - 1, s, "end"); else last.setRangeText("", s, en, "end");
      } else last.setRangeText(k, last.selectionStart, last.selectionEnd, "end");
      last.dispatchEvent(new Event("input", { bubbles: true }));
      last.focus();
    });
  }

  // ================================================================ Tabs
  const TABS = ["runde-1", "runde-2"];
  function showTab() {
    let key = (location.hash || "").slice(1);
    let anchor = null;
    if (!TABS.includes(key)) {
      const m = key.match(/^(runde-1|runde-2)-a/);
      if (m) { anchor = key; key = m[1]; } else key = "runde-1";
    }
    document.querySelectorAll("[data-tab]").forEach(s => { s.hidden = s.dataset.tab !== key; });
    document.querySelectorAll(".tabs a").forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + key));
    document.body.dataset.mode = key;
    if (anchor) { const el = document.getElementById(anchor); if (el) el.scrollIntoView(); }
    else window.scrollTo(0, 0);
  }

  function initScores() {
    let scores = {};
    try { scores = JSON.parse(localStorage.getItem("luna.scores") || "{}"); } catch (e) {}
    document.querySelectorAll("[data-mscore]").forEach(el => {
      const s = scores[el.dataset.mscore];
      el.textContent = s ? "bestes Ergebnis: " + s.best + " %" : "noch nicht gemacht";
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const D = window.MATHE;
    if (D) {
      const map = { "runde-1": "runde1", "runde-2": "runde2" };
      Object.keys(map).forEach(sec => {
        const el = document.getElementById("sec-" + sec);
        if (el && D[map[sec]]) mountSection(el, sec, D[map[sec]], { onScore: initScores });
      });
    }
    initKeybar();
    initScores();
    window.addEventListener("hashchange", showTab);
    showTab();
  });

  window.MatheEngine = { toMachine, parse, equiv, value, normalInfo, readNumber, checkField };
})();
