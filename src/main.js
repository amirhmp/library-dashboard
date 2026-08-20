import "./style.css";

/**
 * This file intentionally does exactly two things — nothing else is allowed
 * to be JS in this project:
 *   1. Toggle dark / light theme (adds/removes .dark on <html>, remembers choice)
 *   2. Open / close the sidebar (<aside>) on mobile
 *
 * Every selector below is optional-chained / null-checked so this single
 * file can be imported on every page (component test pages included)
 * without throwing, even when a given page doesn't have that element.
 */

const root = document.documentElement;

// ---------------------------------------------------------------------------
// 1. Theme toggle
// ---------------------------------------------------------------------------
function applyStoredTheme() {
  const stored = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = stored ? stored === "dark" : prefersDark;
  root.classList.toggle("dark", isDark);
}
applyStoredTheme();

const themeToggle = document.querySelector("[data-theme-toggle]");
themeToggle?.addEventListener("click", () => {
  const isDark = root.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// ---------------------------------------------------------------------------
// 2. Mobile aside (sidebar) open/close
// ---------------------------------------------------------------------------
const aside = document.querySelector("[data-aside]");
const asideBackdrop = document.querySelector("[data-aside-backdrop]");
const asideOpenBtn = document.querySelector("[data-aside-toggle]");
const asideCloseBtn = document.querySelector("[data-aside-close]");

function setAsideOpen(open) {
  if (!aside) return;
  aside.classList.toggle("translate-x-0", open);
  aside.classList.toggle("-translate-x-full", !open);
  asideBackdrop?.classList.toggle("hidden", !open);
  asideOpenBtn?.setAttribute("aria-expanded", String(open));
}

asideOpenBtn?.addEventListener("click", () => setAsideOpen(true));
asideCloseBtn?.addEventListener("click", () => setAsideOpen(false));
asideBackdrop?.addEventListener("click", () => setAsideOpen(false));
