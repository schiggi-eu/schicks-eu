/* Schiggis – Startseite: Sprachwahl, Menü, Willkommens-Karussell */
(function () {
  "use strict";

  const T = {
    de: {
      docTitle: "Schiggis · Willkommen", menu: "Menü", langGroup: "Sprache",
      brandSub: "Familienbereich",
      lunaSub: "Englisch & Mathe", lunaStart: "Übersicht", lunaEn: "Englisch", lunaMa: "Mathe",
      lunaVocab: "Vokabeln", lunaVerbs: "Unregelmäßige Verben", lunaMath1: "Mathe-Test 1", lunaMath2: "Mathe-Test 2",
      lukeSub: "Spaniens Flüsse", lukeLearn: "Lernen", lukeMc: "Auswählen", lukeType: "Eintippen", lukeMap: "Auf der Karte", lukeDe: "Deutsch", lukeDeWords: "Deutsch-Lernwörter",
      title: "Willkommen bei den Schiggis!",
      lead: "Schön, dass du da bist! Hier üben Luna und Luke für die Schule.",
      where: "Wohin möchtest du?",
      lunaDesc: "Englisch: Vokabeln (Karteikarten und Schreibtest) und unregelmäßige Verben. Mathe: zwei Probetests zu Termen.",
      lukeDesc: "Test über die Flüsse Spaniens: die 11 Flüsse auf der Karte lernen, auswählen und eintippen.",
      go: "Los geht’s", note: "",
      foot: "Privater Familienbereich · wird von Suchmaschinen nicht erfasst"
    },
    pl: {
      docTitle: "Schiggis · Witajcie", menu: "Menu", langGroup: "Język",
      brandSub: "Strefa rodzinna",
      lunaSub: "Angielski i matematyka", lunaStart: "Przegląd", lunaEn: "Angielski", lunaMa: "Matematyka",
      lunaVocab: "Słówka", lunaVerbs: "Czasowniki nieregularne", lunaMath1: "Test z matematyki 1", lunaMath2: "Test z matematyki 2",
      lukeSub: "Rzeki Hiszpanii", lukeLearn: "Nauka", lukeMc: "Wybierz", lukeType: "Wpisz", lukeMap: "Na mapie", lukeDe: "Niemiecki", lukeDeWords: "Słówka niemieckie",
      title: "Witajcie u Schiggisów!",
      lead: "Fajnie, że jesteś! Tutaj Luna i Luke uczą się do szkoły.",
      where: "Dokąd chcesz przejść?",
      lunaDesc: "Angielski: słówka (fiszki i test pisemny) oraz czasowniki nieregularne. Matematyka: dwa testy próbne z wyrażeń algebraicznych.",
      lukeDesc: "Sprawdzian o rzekach Hiszpanii: naucz się 11 rzek na mapie, wybieraj je i wpisuj ich nazwy.",
      go: "Zaczynamy", note: "Same strony do nauki są po niemiecku.",
      foot: "Prywatna strefa rodzinna · niewidoczna dla wyszukiwarek"
    },
    en: {
      docTitle: "Schiggis · Welcome", menu: "Menu", langGroup: "Language",
      brandSub: "Family corner",
      lunaSub: "English & maths", lunaStart: "Overview", lunaEn: "English", lunaMa: "Maths",
      lunaVocab: "Vocabulary", lunaVerbs: "Irregular verbs", lunaMath1: "Maths test 1", lunaMath2: "Maths test 2",
      lukeSub: "Rivers of Spain", lukeLearn: "Learn", lukeMc: "Multiple choice", lukeType: "Type it", lukeMap: "On the map", lukeDe: "German", lukeDeWords: "German words",
      title: "Welcome to the Schiggis!",
      lead: "Great to have you here! This is where Luna and Luke practise for school.",
      where: "Where would you like to go?",
      lunaDesc: "English: vocabulary (flashcards and writing test) and irregular verbs. Maths: two practice tests on algebraic terms.",
      lukeDesc: "Test on the rivers of Spain: learn the 11 rivers on the map, pick them and type them.",
      go: "Let’s go", note: "The learning pages themselves are in German.",
      foot: "Private family corner · not indexed by search engines"
    },
    es: {
      docTitle: "Schiggis · Bienvenidos", menu: "Menú", langGroup: "Idioma",
      brandSub: "Rincón familiar",
      lunaSub: "Inglés y matemáticas", lunaStart: "Resumen", lunaEn: "Inglés", lunaMa: "Matemáticas",
      lunaVocab: "Vocabulario", lunaVerbs: "Verbos irregulares", lunaMath1: "Examen de mates 1", lunaMath2: "Examen de mates 2",
      lukeSub: "Ríos de España", lukeLearn: "Aprender", lukeMc: "Elegir", lukeType: "Escribir", lukeMap: "En el mapa", lukeDe: "Alemán", lukeDeWords: "Palabras en alemán",
      title: "¡Bienvenidos al rincón de los Schiggis!",
      lead: "¡Qué bien que estés aquí! Aquí Luna y Luke practican para el colegio.",
      where: "¿Adónde quieres ir?",
      lunaDesc: "Inglés: vocabulario (tarjetas y prueba escrita) y verbos irregulares. Matemáticas: dos exámenes de práctica sobre expresiones algebraicas.",
      lukeDesc: "Examen sobre los ríos de España: aprende los 11 ríos del mapa, elígelos y escribe sus nombres.",
      go: "¡Vamos!", note: "Las páginas de estudio están en alemán.",
      foot: "Rincón familiar privado · no aparece en los buscadores"
    },
    nl: {
      docTitle: "Schiggis · Welkom", menu: "Menu", langGroup: "Taal",
      brandSub: "Familiehoek",
      lunaSub: "Engels & wiskunde", lunaStart: "Overzicht", lunaEn: "Engels", lunaMa: "Wiskunde",
      lunaVocab: "Woordjes", lunaVerbs: "Onregelmatige werkwoorden", lunaMath1: "Wiskundetoets 1", lunaMath2: "Wiskundetoets 2",
      lukeSub: "Rivieren van Spanje", lukeLearn: "Leren", lukeMc: "Kiezen", lukeType: "Intypen", lukeMap: "Op de kaart", lukeDe: "Duits", lukeDeWords: "Duitse woorden",
      title: "Welkom bij de Schiggis!",
      lead: "Fijn dat je er bent! Hier oefenen Luna en Luke voor school.",
      where: "Waar wil je naartoe?",
      lunaDesc: "Engels: woordjes (flitskaarten en schrijftoets) en onregelmatige werkwoorden. Wiskunde: twee oefentoetsen over algebraïsche termen.",
      lukeDesc: "Toets over de rivieren van Spanje: leer de 11 rivieren op de kaart, kies ze en typ ze in.",
      go: "Aan de slag", note: "De leerpagina’s zelf zijn in het Duits.",
      foot: "Privé familiehoek · niet vindbaar via zoekmachines"
    }
  };

  // Begrüßungen: [Wort, Sprache (Eigenname), lang-Code]
  const HELLO = [
    ["Willkommen!", "Deutsch", "de"], ["Witajcie!", "Polski", "pl"], ["Welcome!", "English", "en"],
    ["¡Bienvenidos!", "Español", "es"], ["Welkom!", "Nederlands", "nl"]
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

  // ---------- Wechselnde Begrüßung
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
