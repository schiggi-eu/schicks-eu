// Crashkurs: Kernauswahl für die Prüfung morgen
window.CRASH_VOCAB = [
  "to attend", "community", "to bother", "lifestyle", "comfortable", "rough", "council estate", "crime",
  "scholarship", "open-minded", "opportunity", "to be jealous (of)", "wealth",
  "comfort zone", "to be able to (do sth)", "to be allowed to (do sth)", "rural", "peace", "to separate",
  "boundary", "needn't", "mustn't", "to switch off", "eco-friendly",
  "lonely", "carer", "to meet up", "with special needs", "recently", "darkness", "improvement", "unpopular",
  "to afford", "to achieve", "to be prejudiced against sb/sth", "upper class", "working class", "society",
  "far too", "to get outside"
];

(function () {
  var B = window.BANKS || {};
  function pick(bank, idx) { return (B[bank] || []).filter(function (_, i) { return idx.indexOf(i) >= 0; }); }
  B.crashGrammar = []
    .concat(pick("modal", [1, 3, 4, 6, 9, 13, 18]))
    .concat(pick("tenses", [0, 1, 3, 7, 15, 20, 23]))
    .concat(pick("relative", [0, 2, 4, 6, 7, 11, 13]));
  window.BANKS = B;
})();
