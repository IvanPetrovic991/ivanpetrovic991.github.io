// ===== Footer year =====
document.getElementById("year").textContent = new Date().getFullYear();

// ===== Nav: scrolled state, progress bar, mobile menu =====
const nav = document.getElementById("nav");
const navProgress = document.getElementById("navProgress");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

window.addEventListener("scroll", () => {
  const y = window.scrollY;
  nav.classList.toggle("scrolled", y > 10);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  navProgress.style.width = max > 0 ? (y / max) * 100 + "%" : "0%";
}, { passive: true });

navToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  navToggle.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", String(open));
});

navLinks.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    navLinks.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

// ===== Scroll reveal =====
const revealObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  }
}, { threshold: 0.1, rootMargin: "0px 0px -5% 0px" });

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// ===== Active nav link =====
const sections = [...document.querySelectorAll("section[id]")];
const linkFor = (id) => document.querySelector(`.nav-links a[href="#${id}"]`);

const activeObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    const link = linkFor(entry.target.id);
    if (!link) continue;
    if (entry.isIntersecting) {
      document.querySelectorAll(".nav-links a.active").forEach((a) => a.classList.remove("active"));
      link.classList.add("active");
    }
  }
}, { rootMargin: "-35% 0px -60% 0px" });

sections.forEach((s) => activeObserver.observe(s));

// ===== Mouse-follow spotlight on cards =====
const finePointer = window.matchMedia("(pointer: fine)").matches;
if (finePointer) {
  document.querySelectorAll(".glow").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", e.clientX - r.left + "px");
      card.style.setProperty("--my", e.clientY - r.top + "px");
    });
  });
}
