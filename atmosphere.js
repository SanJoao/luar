/* ===========================================================================
   Luar — shared atmosphere behaviour
   - Gentle scroll reveal for .reveal and .doodle elements
   - The journey: rain thins, warmth rises, and stars emerge as you descend
   Both are self-guarding, so this file is safe to include on any page even if
   some of the elements are absent.
   =========================================================================== */
(function () {
  "use strict";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // --- Gentle scroll reveal -------------------------------------------------
  function initReveal() {
    const els = document.querySelectorAll(".reveal, .doodle");
    if (!els.length) return;

    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
  }

  // --- The journey: a storm that clears as you descend ----------------------
  function initJourney() {
    const rain = document.querySelector(".rain");
    const stars = document.querySelector(".stars");
    const warm = document.querySelector(".warm-pool");
    if (!rain && !stars && !warm) return;

    if (reduce) {
      // Present the calm, mostly-cleared state from the start.
      if (rain) rain.style.opacity = "0.5";
      if (stars) stars.style.opacity = "0.5";
      if (warm) warm.style.opacity = "0.85";
      return;
    }

    const clamp = (t) => Math.max(0, Math.min(1, t));
    const lerp = (a, b, t) => a + (b - a) * clamp(t);
    let ticking = false;

    function update() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      if (rain) rain.style.opacity = lerp(1, 0, p / 0.65);
      if (stars) stars.style.opacity = lerp(0, 0.7, (p - 0.1) / 0.7);
      if (warm) warm.style.opacity = lerp(0.35, 1, p / 0.9);
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
    update();
  }

  function init() {
    initReveal();
    initJourney();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
