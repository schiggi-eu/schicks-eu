/* Schiggis – Startseite: Sprachwahl, Menü, Willkommens-Karussell */
(function () {
  "use strict";

  const T = {
    de: {
      docTitle: "Schiggis · Willkommen", menu: "Menü", langGroup: "Sprache",
      brandSub: "Familienbereich",
      lunaSub: "Englisch · Unit 1", lunaStart: "Übersicht", lunaCrash: "Crashkurs", lunaVocab: "Vokabeln",
      lunaGrammar: "Grammatik", lunaContent: "Inhalte", lunaTests: "Tests",
      lukeSub: "Spaniens Flüsse", lukeLearn: "Lernen", lukeMc: "Auswählen", lukeType: "Eintippen", lukeMap: "Auf der Karte",
      title: "Willkommen bei den Schiggis!",
      lead: "Schön, dass du da bist! Hier üben Luna und Luke für die Schule.",
      where: "Wohin möchtest du?",
      lunaDesc: "Englisch-Test Green Line 5, Unit 1 „The weekend workshop“: Vokabeln, Grammatik, Inhalte und Tests.",
      lukeDesc: "Test über die Flüsse Spaniens: die 11 Flüsse auf der Karte lernen, auswählen und eintippen.",
      go: "Los geht’s", note: "",
      many: "Willkommen in vielen Sprachen",
      foot: "Privater Familienbereich · wird von Suchmaschinen nicht erfasst"
    },
    en: {
      docTitle: "Schiggis · Welcome", menu: "Menu", langGroup: "Language",
      brandSub: "Family corner",
      lunaSub: "English · Unit 1", lunaStart: "Overview", lunaCrash: "Crash course", lunaVocab: "Vocabulary",
      lunaGrammar: "Grammar", lunaContent: "Content", lunaTests: "Tests",
      lukeSub: "Rivers of Spain", lukeLearn: "Learn", lukeMc: "Multiple choice", lukeType: "Type it", lukeMap: "On the map",
      title: "Welcome to the Schiggis!",
      lead: "Great to have you here! This is where Luna and Luke practise for school.",
      where: "Where would you like to go?",
      lunaDesc: "English test Green Line 5, Unit 1 “The weekend workshop”: vocabulary, grammar, content and tests.",
      lukeDesc: "Test on the rivers of Spain: learn the 11 rivers on the map, pick them and type them.",
      go: "Let’s go", note: "The learning pages themselves are in German.",
      many: "Welcome in many languages",
      foot: "Private family corner · not indexed by search engines"
    },
    pl: {
      docTitle: "Schiggis · Witajcie", menu: "Menu", langGroup: "Język",
      brandSub: "Strefa rodzinna",
      lunaSub: "Angielski · Unit 1", lunaStart: "Przegląd", lunaCrash: "Szybki kurs", lunaVocab: "Słówka",
      lunaGrammar: "Gramatyka", lunaContent: "Treści", lunaTests: "Testy",
      lukeSub: "Rzeki Hiszpanii", lukeLearn: "Nauka", lukeMc: "Wybierz", lukeType: "Wpisz", lukeMap: "Na mapie",
      title: "Witajcie u Schiggisów!",
      lead: "Fajnie, że jesteś! Tutaj Luna i Luke uczą się do szkoły.",
      where: "Dokąd chcesz przejść?",
      lunaDesc: "Sprawdzian z angielskiego Green Line 5, Unit 1 „The weekend workshop”: słówka, gramatyka, treści i testy.",
      lukeDesc: "Sprawdzian o rzekach Hiszpanii: naucz się 11 rzek na mapie, wybieraj je i wpisuj ich nazwy.",
      go: "Zaczynamy", note: "Same strony do nauki są po niemiecku.",
      many: "Witamy w wielu językach",
      foot: "Prywatna strefa rodzinna · niewidoczna dla wyszukiwarek"
    },
    es: {
      docTitle: "Schiggis · Bienvenidos", menu: "Menú", langGroup: "Idioma",
      brandSub: "Rincón familiar",
      lunaSub: "Inglés · Unit 1", lunaStart: "Resumen", lunaCrash: "Curso intensivo", lunaVocab: "Vocabulario",
      lunaGrammar: "Gramática", lunaContent: "Contenidos", lunaTests: "Pruebas",
      lukeSub: "Ríos de España", lukeLearn: "Aprender", lukeMc: "Elegir", lukeType: "Escribir", lukeMap: "En el mapa",
      title: "¡Bienvenidos al rincón de los Schiggis!",
      lead: "¡Qué bien que estés aquí! Aquí Luna y Luke practican para el colegio.",
      where: "¿Adónde quieres ir?",
      lunaDesc: "Examen de inglés Green Line 5, Unit 1 «The weekend workshop»: vocabulario, gramática, contenidos y pruebas.",
      lukeDesc: "Examen sobre los ríos de España: aprende los 11 ríos del mapa, elígelos y escribe sus nombres.",
      go: "¡Vamos!", note: "Las páginas de estudio están en alemán.",
      many: "Bienvenidos en muchos idiomas",
      foot: "Rincón familiar privado · no aparece en los buscadores"
    }
  };

  // Begrüßungen: [Wort, Sprache (Eigenname), lang-Code]
  const HELLO = [
    ["Willkommen!", "Deutsch", "de"], ["Witajcie!", "Polski", "pl"], ["¡Bienvenidos!", "Español", "es"],
    ["Welcome!", "English", "en"], ["Bienvenue !", "Français", "fr"], ["Benvenuti!", "Italiano", "it"],
    ["Bem-vindos!", "Português", "pt"], ["Welkom!", "Nederlands", "nl"], ["Välkommen!", "Svenska", "sv"],
    ["Velkommen!", "Dansk", "da"], ["Tervetuloa!", "Suomi", "fi"], ["Vítejte!", "Čeština", "cs"],
    ["Hoş geldiniz!", "Türkçe", "tr"], ["Καλώς ήρθατε!", "Ελληνικά", "el"], ["Fáilte!", "Gaeilge", "ga"],
    ["Croeso!", "Cymraeg", "cy"], ["ようこそ！", "日本語", "ja"], ["환영합니다!", "한국어", "ko"],
    ["欢迎！", "中文", "zh"], ["Karibu!", "Kiswahili", "sw"], ["Aloha!", "ʻŌlelo Hawaiʻi", "haw"]
  ];

  const KEY = "schiggis.lang"; // eigener Schlüssel – „lang“ gehört der Hauptseite schicks.eu
  const store = {
    get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  };

  function pickLang() {
    const saved = store.get();
    if (saved && T[saved]) return saved;
    const list = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || "de"]);
    for (const l of list) { const c = String(l).slice(0, 2).toLowerCase(); if (T[c]) return c; }
    return "de";
  }

  function apply(lang) {
    const t = T[lang];
    document.documentElement.lang = lang;
    document.title = t.docTitle;
    document.querySelectorAll("[data-i18n]").forEach(el => { const k = el.dataset.i18n; if (k in t) el.textContent = t[k]; });
    document.querySelectorAll("[data-i18n-aria]").forEach(el => el.setAttribute("aria-label", t[el.dataset.i18nAria]));
    const lg = document.querySelector(".lang"); if (lg) lg.setAttribute("aria-label", t.langGroup);
    document.querySelectorAll(".lang a").forEach(a => {
      if (a.dataset.lang === lang) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
  }

  let current = pickLang();
  apply(current);
  document.querySelectorAll(".lang a").forEach(a => a.addEventListener("click", e => {
    e.preventDefault(); current = a.dataset.lang; store.set(current); apply(current); closeNav();
  }));

  // ---------- Burger (mobil)
  const burger = document.querySelector(".burger");
  function closeNav() { document.body.classList.remove("nav-open"); if (burger) burger.setAttribute("aria-expanded", "false"); }
  if (burger) burger.addEventListener("click", () => {
    const o = document.body.classList.toggle("nav-open"); burger.setAttribute("aria-expanded", String(o));
  });

  // ---------- Aufklappmenüs
  const dds = [...document.querySelectorAll("[data-dd]")];
  function closeAll(except) {
    dds.forEach(d => { if (d !== except) { d.classList.remove("open"); d.querySelector(".dd-btn").setAttribute("aria-expanded", "false"); } });
  }
  dds.forEach(d => {
    const btn = d.querySelector(".dd-btn");
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const o = !d.classList.contains("open");
      closeAll(d); d.classList.toggle("open", o); btn.setAttribute("aria-expanded", String(o));
    });
    d.querySelectorAll(".dd-menu a").forEach(a => a.addEventListener("click", () => { closeAll(); closeNav(); }));
  });
  document.addEventListener("click", e => { if (!e.target.closest("[data-dd]")) closeAll(); });
  document.addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    const open = dds.find(d => d.classList.contains("open"));
    closeAll(); closeNav();
    if (open) open.querySelector(".dd-btn").focus();
  });

  // ---------- Willkommen in vielen Sprachen
  const chips = document.getElementById("chips");
  if (chips) chips.innerHTML = HELLO.map(h => `<li lang="${h[2]}">${h[0]} <small>${h[1]}</small></li>`).join("");

  const word = document.getElementById("hello"), name = document.getElementById("hello-lang");
  let i = 0;
  function show(k) { const h = HELLO[k]; word.textContent = h[0]; word.lang = h[2]; name.textContent = h[1]; name.lang = h[2]; }
  if (word && name) {
    show(0);
    const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    setInterval(() => {
      if (document.hidden) return;
      i = (i + 1) % HELLO.length;
      if (reduce) { show(i); return; }
      word.classList.add("out");
      setTimeout(() => { show(i); word.classList.remove("out"); }, 350);
    }, 2400);
  }
})();
