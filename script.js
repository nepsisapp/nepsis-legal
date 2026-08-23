(function () {
  "use strict";

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById("navToggle");
  var navList = document.getElementById("navList");

  if (navToggle && navList) {
    navToggle.addEventListener("click", function () {
      var isOpen = navList.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      navToggle.textContent = isOpen ? "Close" : "Menu";
    });

    navList.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navList.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.textContent = "Menu";
      });
    });
  }

  /* ---------- Breathing experience ---------- */
  var visual = document.getElementById("bv");
  var phaseLabel = document.getElementById("bp");
  var btn = document.getElementById("breathBtn");

  if (!visual || !phaseLabel || !btn) return;

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var PHASES = [
    { cls: "inhale", label: "Inhale", duration: 4000 },
    { cls: "hold", label: "Hold", duration: 4000 },
    { cls: "exhale", label: "Exhale", duration: 4000 }
  ];

  var running = false;
  var timeoutId = null;
  var cycleCount = 0;
  var MAX_CYCLES = 4;

  function clearPhaseClasses() {
    PHASES.forEach(function (p) {
      visual.classList.remove(p.cls);
    });
  }

  function runPhase(index) {
    if (!running) return;

    var phase = PHASES[index];
    clearPhaseClasses();
    visual.classList.add(phase.cls);
    phaseLabel.style.opacity = 0;

    window.setTimeout(function () {
      phaseLabel.textContent = phase.label;
      phaseLabel.style.opacity = 1;
    }, 120);

    timeoutId = window.setTimeout(function () {
      var next = index + 1;
      if (next >= PHASES.length) {
        next = 0;
        cycleCount++;
        if (cycleCount >= MAX_CYCLES) {
          stopBreathing();
          return;
        }
      }
      runPhase(next);
    }, phase.duration);
  }

  function startBreathing() {
    running = true;
    cycleCount = 0;
    btn.textContent = "Pause";
    btn.classList.add("active");
    runPhase(0);
  }

  function stopBreathing() {
    running = false;
    if (timeoutId) window.clearTimeout(timeoutId);
    clearPhaseClasses();
    btn.textContent = "Begin";
    btn.classList.remove("active");
    phaseLabel.style.opacity = 0;
    window.setTimeout(function () {
      phaseLabel.textContent = "Begin when you're ready";
      phaseLabel.style.opacity = 1;
    }, 200);
  }

  btn.addEventListener("click", function () {
    if (reducedMotion) {
      phaseLabel.textContent = running ? "Begin when you're ready" : "Inhale — Hold — Exhale";
      running = !running;
      btn.textContent = running ? "Pause" : "Begin";
      btn.classList.toggle("active", running);
      return;
    }

    if (running) {
      stopBreathing();
    } else {
      startBreathing();
    }
  });
})();
