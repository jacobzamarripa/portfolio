/* Shared frame behaviour. Usage notes live at the top of frame.css. */
(function () {
  "use strict";

  var HAS_DOM = typeof document !== "undefined";
  var script = HAS_DOM ? document.currentScript : null;
  var ROOT = script ? new URL("../", script.src).href : "./";
  var LINKEDIN = "https://www.linkedin.com/in/jacobizamarripa";
  var PROVENANCE = "A personal portfolio. Not affiliated with or endorsed by any former employer.";

  /* Chronological. This list is the single source for case order. */
  var CASES = [
    { n: 1, title: "Apple: Period Review", path: "apple-rtl/" },
    { n: 2, title: "Nexus FiberOps Unified", path: "centric-fiberops/" },
    { n: 3, title: "Right-Sizing the Fleet", path: "ci-fleet/" },
    { n: 4, title: "OmniSight", path: "omni-pmo/" }
  ];

  var EVIDENCE = [
    { k: "measured", label: "Measured", text: "Produced by an employer’s system or the live platform, not by me." },
    { k: "recorded", label: "Recorded", text: "My own artifacts, written at the time: plans, trackers, curriculum." },
    { k: "recalled", label: "Recalled", text: "My account, told now." },
    { k: "illustrative", label: "Illustrative", text: "Invented demo data or a recreation, shown to explain how something works." }
  ];

  var MARK =
    '<svg viewBox="0 0 32 32" aria-hidden="true" focusable="false"><rect width="32" height="32" rx="6" fill="currentColor"/>' +
    '<path d="M12.5 6.5v12.2a4.6 4.6 0 0 1-9.2 0" fill="none" stroke="var(--fr-bg)" stroke-width="3.2" stroke-linecap="square"/>' +
    '<path d="M16.6 6.5h11L16.6 22.6h11" fill="none" stroke="var(--fr-bg)" stroke-width="3.2" stroke-linecap="square"/>' +
    '<rect x="3" y="26.4" width="26" height="2.6" fill="var(--fr-mark)"/></svg>';

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function caseNo(v) { return CASES[parseInt(v, 10) - 1] || null; }

  /* ---- Renderers. Plain strings, so the same markup can also be written
     into a page as its JS-off fallback (frame.css, step 2). ---- */
  function headerHTML(n, root) {
    var c = caseNo(n);
    root = root == null ? ROOT : root;
    var html = '<div class="fr-head-in"><a class="fr-name" href="' + root + '" aria-label="Jacob Zamarripa, home">' + MARK +
      "<span>Jacob Zamarripa</span></a>";
    if (c) {
      html += '<div class="fr-where"><span class="fr-pos">Case ' + c.n + " of " + CASES.length +
        '</span><span class="fr-title">' + esc(c.title) + "</span></div>";
    }
    return html + "</div>";
  }

  function footerHTML(n, root) {
    var c = caseNo(n);
    root = root == null ? ROOT : root;
    var pager = "";
    if (c) {
      var prev = CASES[c.n - 2], next = CASES[c.n];
      pager = '<nav class="fr-pager" aria-label="Case studies">';
      pager += prev
        ? '<a rel="prev" href="' + root + prev.path + '"><small>Previous: case ' + prev.n + " of " + CASES.length + "</small><b>" + esc(prev.title) + "</b></a>"
        : '<a rel="prev" href="' + root + '"><small>All four cases</small><b>Jacob Zamarripa</b></a>';
      pager += next
        ? '<a rel="next" href="' + root + next.path + '"><small>Next: case ' + next.n + " of " + CASES.length + "</small><b>" + esc(next.title) + "</b></a>"
        : '<a rel="next" href="' + root + '"><small>All four cases</small><b>Jacob Zamarripa</b></a>';
      pager += "</nav>";
    }
    return '<div class="fr-foot-in">' + pager +
      '<div class="fr-foot-meta"><a href="' + LINKEDIN + '" target="_blank" rel="noopener">Jacob Zamarripa on LinkedIn</a>' +
      '<p class="fr-prov">' + PROVENANCE + "</p></div></div>";
  }

  function keyHTML() {
    var html = '<p class="fr-key-title">How each claim is sourced</p><dl>';
    EVIDENCE.forEach(function (e) {
      html += '<div><dt><span class="fr-ev" data-ev="' + e.k + '">' + e.label + "</span></dt><dd>" + e.text + "</dd></div>";
    });
    return html + "</dl>";
  }

  var API = {
    CASES: CASES, EVIDENCE: EVIDENCE, LINKEDIN: LINKEDIN, root: ROOT,
    headerHTML: headerHTML, footerHTML: footerHTML, keyHTML: keyHTML
  };

  /* Node (the fallback sync script) only needs the renderers. */
  if (!HAS_DOM) {
    if (typeof module !== "undefined" && module.exports) module.exports = API;
    return;
  }

  /* Fill an element when it is empty, or when its markup is a JS-off
     fallback (data-frame-static). Other markup is left alone. */
  function wants(el) {
    return el.hasAttribute("data-frame-static") || (!el.children.length && !el.textContent.trim());
  }

  function marks() {
    document.querySelectorAll(".fr-ev--mark").forEach(function (el) {
      if (!el.title) el.title = el.textContent.trim();
    });
  }

  function reveals() {
    var els = document.querySelectorAll("[data-fr-reveal]");
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.15 });
    els.forEach(function (el) { io.observe(el); });
  }

  function init() {
    var root = document.documentElement;
    root.classList.add("fr-js");
    var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!still) root.classList.add("fr-motion");

    document.querySelectorAll(".fr-head[data-frame-case]").forEach(function (el) {
      if (wants(el)) el.innerHTML = headerHTML(el.getAttribute("data-frame-case"));
    });
    document.querySelectorAll(".fr-foot[data-frame-case]").forEach(function (el) {
      if (wants(el)) el.innerHTML = footerHTML(el.getAttribute("data-frame-case"));
    });
    document.querySelectorAll("[data-frame-key]").forEach(function (el) {
      if (wants(el)) el.innerHTML = keyHTML();
    });
    marks();
    reveals();
  }

  window.Frame = API;

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
