/* Portfolio interactions — defensive: every hook is optional, so one missing
   element on a sub-page can never take the whole script down. */
(function () {
  "use strict";

  /* Drop the no-JS guard only once THIS file is running. Doing it inline in
     <head> would strip the guard even when this script fails to load, leaving
     every .reveal element permanently at opacity:0. */
  document.documentElement.classList.remove("no-js");

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  var reduceMotion = window.matchMedia
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ===== Footer year ===== */
  var year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ===== Nav: scrolled state + scroll progress (rAF-throttled) ===== */
  var nav = $("#nav");
  var navProgress = $("#navProgress");

  if (nav || navProgress) {
    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        var y = window.scrollY || window.pageYOffset || 0;
        if (nav) nav.classList.toggle("scrolled", y > 10);
        if (navProgress) {
          var max = document.documentElement.scrollHeight - window.innerHeight;
          navProgress.style.width = max > 0 ? (y / max) * 100 + "%" : "0%";
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();
  }

  /* ===== Mobile menu ===== */
  var navToggle = $("#navToggle");
  var navLinks = $("#navLinks");

  if (navToggle && navLinks) {
    var setMenu = function (open) {
      navLinks.classList.toggle("open", open);
      navToggle.classList.toggle("open", open);
      navToggle.setAttribute("aria-expanded", String(open));
    };

    navToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      setMenu(!navLinks.classList.contains("open"));
    });

    navLinks.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navLinks.classList.contains("open")) {
        setMenu(false);
        navToggle.focus();
      }
    });

    document.addEventListener("click", function (e) {
      if (!navLinks.classList.contains("open")) return;
      if (!e.target.closest("#nav")) setMenu(false);
    });
  }

  /* ===== Scroll reveal — with a hard fallback so content can never stay hidden ===== */
  var revealEls = $$(".reveal");

  var showAll = function () {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  };

  if (!revealEls.length) {
    /* nothing to do */
  } else if (!("IntersectionObserver" in window) || reduceMotion) {
    showAll();
  } else {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -4% 0px" });

    revealEls.forEach(function (el) { revealObserver.observe(el); });

    /* Safety net: if anything above the fold never fires, reveal it anyway. */
    window.setTimeout(function () {
      revealEls.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("visible");
      });
    }, 1200);
  }

  /* ===== Active nav link ===== */
  var sections = $$("section[id]");
  if (sections.length && "IntersectionObserver" in window) {
    var activeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var link = $('.nav-links a[href="#' + entry.target.id + '"]');
        if (!link) return;
        $$(".nav-links a.active").forEach(function (a) { a.classList.remove("active"); });
        link.classList.add("active");
      });
    }, { rootMargin: "-35% 0px -60% 0px" });

    sections.forEach(function (s) { activeObserver.observe(s); });
  }

  /* ===== Mouse-follow spotlight (fine pointers only) ===== */
  var finePointer = window.matchMedia && window.matchMedia("(pointer: fine)").matches;
  if (finePointer && !reduceMotion) {
    $$(".glow").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", (e.clientX - r.left) + "px");
        card.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
  }
})();
