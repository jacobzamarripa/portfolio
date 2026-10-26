/* Figures for the Period Review. Plain-string SVG renderers, so the same
   code draws the live charts in the browser and writes the JS-off copies
   into index.html (node .private/redesign-2026-10/apple-figs-sync.js).
   Every value below is from .private/apple-rtl/CHART_DATA.md.
   Colour roles: --rv-team (violet) = my team / the actual,
   --rv-flag (orange) = the diagnosed group / the forecast,
   --rv-ctx (grey) = site benchmark / everyone else. */
(function () {
  "use strict";

  /* ---------- data ---------- */
  var MONTHS = ["Nov", "Dec", "Jan", "Feb"];

  /* Illustrative. Five below both thresholds (the one real fact about the
     group) and seven above, drawn to a plausible spread. Not real people. */
  var SCATTER = [
    [61, 71, 1], [65, 74, 1], [68, 77, 1], [70, 73, 1], [71, 78, 1],
    [74, 84, 0], [76, 82, 0], [77, 88, 0], [79, 86, 0], [83, 91, 0], [86, 89, 0], [89, 93, 0]
  ];

  /* Team summary vs site summary, Metric Data sheet, P02-P05. */
  var BENCH = [
    { id: "ir", name: "Issue resolution", unit: "%", lo: 60, hi: 85, step: 5, better: "up",
      team: [72.14, 79.31, 74.49, 73.49], site: [67.69, 67.54, 66.70, 67.79] },
    { id: "csat", name: "Customer satisfaction", unit: "%", lo: 76, hi: 92, step: 4, better: "up",
      team: [83.64, 88.95, 87.85, 85.41], site: [82.26, 82.72, 81.49, 82.58] },
    { id: "cft", name: "Customer-facing time", unit: "%", lo: 70, hi: 90, step: 5, better: "up",
      team: [87.06, 85.49, 86.31, 81.34], site: [73.27, 74.28, 74.76, 73.45] },
    { id: "aht", name: "Handle time", unit: " min", lo: 14, hi: 22, step: 2, better: "down",
      team: [15.09, 18.07, 19.54, 19.01], site: [20.29, 20.42, 20.24, 19.90] }
  ];

  /* Development Day note (Recorded) vs tracker rollups Dec/Jan (Measured). */
  var AGREE = [
    { name: "Customer satisfaction", noteTeam: 90, noteSite: 81, team: [88.95, 87.85], site: [82.72, 81.49] },
    { name: "Issue resolution", noteTeam: 78, noteSite: 67, team: [79.31, 74.49], site: [67.54, 66.70] },
    { name: "Customer-facing time", noteTeam: 86, noteSite: 75, team: [85.49, 86.31], site: [74.28, 74.76] }
  ];

  /* Advisor Roster table in each period's team tracker (my managed roster). */
  var ROSTER = [["Nov", 14], ["Dec", 9], ["Jan", 9], ["Feb", 29], ["Mar", 8]];
  var FORECAST = 5;

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function r1(v) { return Math.round(v * 10) / 10; }
  function n(v) { return +(+v).toFixed(1); }
  function attrs(o) {
    var s = "";
    for (var k in o) if (o[k] !== null && o[k] !== undefined) s += " " + k + '="' + esc(o[k]) + '"';
    return s;
  }
  function tag(name, o, inner) {
    return "<" + name + attrs(o) + (inner == null ? "/>" : ">" + inner + "</" + name + ">");
  }
  function text(x, y, s, o) {
    o = o || {};
    o.x = n(x); o.y = n(y);
    return tag("text", o, esc(s));
  }
  function open(w, h, label, cls) {
    return '<svg class="' + cls + '" viewBox="0 0 ' + n(w) + " " + n(h) + '" width="' + n(w) +
      '" height="' + n(h) + '" role="img" aria-label="' + esc(label) + '">';
  }
  function hit(tipTitle, tip, inner, cls) {
    return '<g class="rv-hit' + (cls ? " " + cls : "") + '" data-tip-title="' + esc(tipTitle) +
      '" data-tip="' + esc(tip) + '">' + inner + "</g>";
  }
  function fmt(v, unit) { return v.toFixed(2) + (unit === "%" ? "%" : " min"); }

  /* ---------- Figure 1: the diagnosis ---------- */
  function diagnosis(w) {
    w = Math.max(300, Math.round(w));
    var narrow = w < 520;
    var h = Math.round(Math.min(430, Math.max(300, w * 0.56)));
    var L = narrow ? 40 : 48, R = 18, T = 34, B = 46;
    var x0 = 55, x1 = 95, y0 = 62, y1 = 100, IR = 72, CS = 80;
    var X = function (v) { return L + (v - x0) / (x1 - x0) * (w - L - R); };
    var Y = function (v) { return T + (y1 - v) / (y1 - y0) * (h - T - B); };
    var s = open(w, h, "Scatter plot of customer satisfaction against issue resolution. Twelve illustrative points. Five sit below both the 80 percent satisfaction and the 72 percent issue resolution thresholds.", "rv-svg rv-svg--scatter");
    s += '<defs><pattern id="rv-ill" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="7" class="rv-hatch"/></pattern></defs>';
    s += tag("rect", { x: L, y: T, width: n(w - L - R), height: n(h - T - B), fill: "url(#rv-ill)" });
    s += tag("rect", { x: L, y: n(Y(CS)), width: n(X(IR) - L), height: n(Y(y0) - Y(CS)), "class": "rv-wash" });
    var step = narrow ? 10 : 5, i;
    for (i = 60; i <= 95; i += step) {
      if (i < x0) continue;
      s += tag("line", { x1: n(X(i)), y1: T, x2: n(X(i)), y2: n(h - B), "class": "rv-grid" });
      s += text(X(i), h - B + 18, i + "%", { "class": "rv-tick", "text-anchor": "middle" });
    }
    for (i = 65; i <= 100; i += step) {
      s += tag("line", { x1: L, y1: n(Y(i)), x2: n(w - R), y2: n(Y(i)), "class": "rv-grid" });
      s += text(L - 8, Y(i) + 4, i + "%", { "class": "rv-tick", "text-anchor": "end" });
    }
    s += tag("line", { x1: n(X(IR)), y1: T - 8, x2: n(X(IR)), y2: n(h - B), "class": "rv-thresh" });
    s += tag("line", { x1: L, y1: n(Y(CS)), x2: n(w - R), y2: n(Y(CS)), "class": "rv-thresh" });
    s += text(X(IR) + 7, T + 14, "72% issue resolution", { "class": "rv-lab" });
    s += text(w - R - 4, Y(CS) + 18, "80% satisfaction", { "class": "rv-lab", "text-anchor": "end" });
    s += text(L + 10, Y(y0) - 12, narrow ? "The five" : "The five below both", { "class": "rv-lab rv-lab--strong" });
    s += text(w - R - 8, Y(y0) - 12, narrow ? "Positions invented" : "Dot positions are invented", { "class": "rv-note", "text-anchor": "end" });
    SCATTER.forEach(function (p) {
      var cx = n(X(p[0])), cy = n(Y(p[1]));
      s += hit(p[2] ? "Below both thresholds" : "Above the thresholds",
        "Illustrative point, not a real advisor.",
        tag("circle", { cx: cx, cy: cy, r: 13, "class": "rv-target" }) +
        tag("circle", { cx: cx, cy: cy, r: 6, "class": p[2] ? "rv-dot rv-dot--flag" : "rv-dot rv-dot--ctx" }));
    });
    s += text(w - R, h - 6, "Issue resolution", { "class": "rv-axis", "text-anchor": "end" });
    s += text(0, 14, "Customer satisfaction", { "class": "rv-axis" });
    return s + "</svg>";
  }

  /* ---------- Figure 2: one benchmark panel ---------- */
  function benchPanel(spec, w) {
    w = Math.max(220, Math.round(w));
    var h = 214, L = 34, R = 8, T = 24, B = 28;
    var Y = function (v) { return T + (spec.hi - v) / (spec.hi - spec.lo) * (h - T - B); };
    var slot = (w - L - R) / 4, i, v;
    var s = open(w, h, spec.name + ": my team against the site benchmark, November 2020 to February 2021. " +
      spec.team.map(function (t, k) { return MONTHS[k] + " team " + t + ", site " + spec.site[k]; }).join("; ") + ".", "rv-svg rv-svg--panel");
    for (v = spec.lo; v <= spec.hi; v += spec.step) {
      s += tag("line", { x1: L, y1: n(Y(v)), x2: n(w - R), y2: n(Y(v)), "class": "rv-grid" });
      s += text(L - 7, Y(v) + 4, String(Math.round(v)), { "class": "rv-tick", "text-anchor": "end" });
    }
    for (i = 0; i < 4; i++) {
      var cx = n(L + slot * i + slot / 2), t = spec.team[i], st = spec.site[i];
      var d = t - st, ty = Y(t), sy = Y(st);
      var label = (d > 0 ? "+" : "−") + Math.abs(r1(d)).toFixed(1);
      var top = Math.min(ty, sy);
      s += '<g class="rv-pair" style="--rv-d:' + n(sy - ty) + 'px">';
      s += tag("line", { x1: cx, y1: n(ty), x2: cx, y2: n(sy), "class": "rv-link" });
      s += hit(MONTHS[i] + ", site benchmark", spec.name + " " + fmt(st, spec.unit),
        tag("circle", { cx: cx, cy: n(sy), r: 12, "class": "rv-target" }) +
        tag("circle", { cx: cx, cy: n(sy), r: 5, "class": "rv-dot rv-dot--ctx" }));
      s += hit(MONTHS[i] + ", my team", spec.name + " " + fmt(t, spec.unit) + " against the site's " + fmt(st, spec.unit),
        tag("circle", { cx: cx, cy: n(ty), r: 12, "class": "rv-target" }) +
        tag("circle", { cx: cx, cy: n(ty), r: 6, "class": "rv-dot rv-dot--team" }), "rv-team");
      s += text(cx, top - 11, label, { "class": "rv-delta", "text-anchor": "middle" });
      s += "</g>";
      s += text(cx, h - 8, MONTHS[i], { "class": "rv-tick rv-tick--x", "text-anchor": "middle" });
    }
    return s + "</svg>";
  }

  /* ---------- Figure 3: two records ---------- */
  function agreement(w) {
    w = Math.max(300, Math.round(w));
    var narrow = w < 560;
    var L = narrow ? 50 : 210, R = 14, rowH = narrow ? 92 : 76, T = 8, B = 34;
    var h = T + rowH * AGREE.length + B;
    var x0 = 64, x1 = 92;
    var X = function (v) { return L + (v - x0) / (x1 - x0) * (w - L - R); };
    var s = open(w, h, "For three measures, the team and site figures in my own notes compared with the employer tracker's December and January rollups. The site figures agree within two points.", "rv-svg rv-svg--agree");
    var i;
    for (i = 65; i <= 90; i += 5) {
      s += tag("line", { x1: n(X(i)), y1: T, x2: n(X(i)), y2: n(h - B), "class": "rv-grid" });
      s += text(X(i), h - B + 20, i + "%", { "class": "rv-tick", "text-anchor": "middle" });
    }
    AGREE.forEach(function (m, k) {
      var y = T + rowH * k;
      var lanes = [
        { who: "Team", note: m.noteTeam, vals: m.team, c: "team" },
        { who: "Site", note: m.noteSite, vals: m.site, c: "ctx" }
      ];
      if (narrow) s += text(0, y + 15, m.name, { "class": "rv-lab rv-lab--strong" });
      else s += text(0, y + rowH / 2 + 4, m.name, { "class": "rv-lab rv-lab--strong" });
      lanes.forEach(function (ln, j) {
        var ly = narrow ? y + 38 + j * 26 : y + 24 + j * 26;
        s += text(L - 12, ly + 4, ln.who, { "class": "rv-tick", "text-anchor": "end" });
        s += tag("line", { x1: L, y1: n(ly), x2: n(w - R), y2: n(ly), "class": "rv-track" });
        s += hit(m.name + ", " + ln.who.toLowerCase() + ", my note", "Written in my own notes: " + ln.note + "%",
          tag("rect", { x: n(X(ln.note) - 8), y: n(ly - 8), width: 16, height: 16, rx: 1.5, "class": "rv-sq rv-sq--" + ln.c }));
        ln.vals.forEach(function (v, q) {
          s += hit(m.name + ", " + ln.who.toLowerCase() + ", tracker", (q ? "January" : "December") + " rollup: " + v.toFixed(2) + "%",
            tag("circle", { cx: n(X(v)), cy: n(ly), r: 11, "class": "rv-target" }) +
            tag("circle", { cx: n(X(v)), cy: n(ly), r: 4.5, "class": "rv-dot rv-dot--" + ln.c }));
        });
      });
      if (k < AGREE.length - 1) s += tag("line", { x1: 0, y1: n(y + rowH), x2: n(w), y2: n(y + rowH), "class": "rv-sep" });
    });
    return s + "</svg>";
  }

  /* ---------- Figure 4: the roster and the forecast ---------- */
  function roster(w) {
    w = Math.max(300, Math.round(w));
    var h = 250, L = 34, R = 96, T = 22, B = 30, max = 30;
    var Y = function (v) { return T + (max - v) / max * (h - T - B); };
    var slot = (w - L - R) / ROSTER.length, bw = Math.min(24, slot * 0.45), i;
    var s = open(w, h, "Column chart of my managed roster: November 14, December 9, January 9, February 29, March 8. My written forecast for the final period was 5.", "rv-svg rv-svg--roster");
    for (i = 0; i <= 30; i += 10) {
      s += tag("line", { x1: L, y1: n(Y(i)), x2: n(w - 8), y2: n(Y(i)), "class": i ? "rv-grid" : "rv-base" });
      s += text(L - 7, Y(i) + 4, String(i), { "class": "rv-tick", "text-anchor": "end" });
    }
    ROSTER.forEach(function (r, k) {
      var cx = L + slot * k + slot / 2, x = cx - bw / 2, y = Y(r[1]), hh = Y(0) - y, rr = 4;
      var d = "M" + n(x) + " " + n(Y(0)) + "V" + n(y + rr) + "Q" + n(x) + " " + n(y) + " " + n(x + rr) + " " + n(y) +
        "H" + n(x + bw - rr) + "Q" + n(x + bw) + " " + n(y) + " " + n(x + bw) + " " + n(y + rr) + "V" + n(Y(0)) + "Z";
      s += hit(r[0] === "Mar" ? "March, final period" : r[0], r[1] + " advisors on my roster",
        tag("rect", { x: n(cx - slot / 2 + 2), y: T, width: n(slot - 4), height: n(h - T - B), "class": "rv-target" }) +
        tag("path", { d: d, "class": "rv-bar" }));
      s += text(cx, y - 8, String(r[1]), { "class": "rv-val", "text-anchor": "middle" });
      s += text(cx, h - 8, r[0], { "class": "rv-tick rv-tick--x", "text-anchor": "middle" });
      if (k === ROSTER.length - 1) {
        var fy = n(Y(FORECAST)), fx1 = n(cx - bw / 2 - 9), fx2 = n(cx + bw / 2 + 9);
        s += hit("My forecast", "Written before the period: 5 advisors, with more expected",
          tag("line", { x1: fx1, y1: fy, x2: fx2, y2: fy, "class": "rv-fc-ring" }) +
          tag("line", { x1: fx1, y1: fy, x2: fx2, y2: fy, "class": "rv-fc" }));
        s += tag("line", { x1: n(fx2 + 4), y1: fy, x2: n(fx2 + 12), y2: fy, "class": "rv-leader" });
        s += text(fx2 + 16, fy + 4, "Forecast: 5", { "class": "rv-lab" });
      }
    });
    return s + "</svg>";
  }

  var API = { BENCH: BENCH, diagnosis: diagnosis, benchPanel: benchPanel, agreement: agreement, roster: roster };

  /* Render every figure host. widthOf(host) gives the width to draw at. */
  function renderAll(doc, widthOf) {
    var q = function (s) { return doc.querySelectorAll(s); };
    q("[data-fig='diagnosis']").forEach(function (el) { el.innerHTML = diagnosis(widthOf(el)); });
    q("[data-fig='agreement']").forEach(function (el) { el.innerHTML = agreement(widthOf(el)); });
    q("[data-fig='roster']").forEach(function (el) { el.innerHTML = roster(widthOf(el)); });
    q("[data-fig^='bench-']").forEach(function (el) {
      var id = el.getAttribute("data-fig").slice(6);
      var spec = BENCH.filter(function (b) { return b.id === id; })[0];
      if (spec) el.innerHTML = benchPanel(spec, widthOf(el));
    });
  }
  API.renderAll = renderAll;

  if (typeof document === "undefined") {
    if (typeof module !== "undefined" && module.exports) module.exports = API;
    return;
  }
  window.ReviewFigures = API;
})();
