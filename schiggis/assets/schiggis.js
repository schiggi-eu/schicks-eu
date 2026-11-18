/* Schiggis – Startseite: Menü, Willkommens-Karussell (Seite nur auf Deutsch) */
(function () {
  "use strict";

  // Begrüßungen: [Wort, Sprache (Eigenname), lang-Code]
  const HELLO = [
    ["Willkommen!", "Deutsch", "de"], ["Witajcie!", "Polski", "pl"], ["Welcome!", "English", "en"],
    ["¡Bienvenidos!", "Español", "es"], ["Welkom!", "Nederlands", "nl"]
  ];

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
