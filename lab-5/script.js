
const header = document.getElementById("header");
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = navMenu.querySelectorAll("a");
const toast = document.getElementById("toast");

let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  themeToggle.setAttribute(
    "aria-label",
    theme === "dark" ? "Цайвар горим асаах" : "Бараан горим асаах"
  );
}

applyTheme(root.getAttribute("data-theme") || "light");

themeToggle.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  try { localStorage.setItem("theme", next); } catch (e) {}
  showToast(next === "dark" ? "🌙 Бараан горим асав" : "☀️ Цайвар горим асав");
});

function closeMenu() {
  navMenu.classList.remove("open");
  menuToggle.classList.remove("active");
  menuToggle.setAttribute("aria-expanded", "false");
}

menuToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  menuToggle.classList.toggle("active", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));

window.addEventListener("resize", () => {
  if (window.innerWidth >= 1024) closeMenu();
});

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 10);
});

const sections = document.querySelectorAll("main section[id]");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);

sections.forEach((section) => observer.observe(section));

const filterBtns = document.querySelectorAll(".filter-btn");
const products = document.querySelectorAll(".product-card");
const productCount = document.getElementById("productCount");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const category = btn.dataset.filter;

    filterBtns.forEach((b) => {
      const isActive = b === btn;
      b.classList.toggle("active", isActive);
      b.setAttribute("aria-pressed", String(isActive));
    });

    let visible = 0;
    products.forEach((card) => {
      const show = category === "all" || card.dataset.category === category;
      card.hidden = !show;
      if (show) visible++;
    });

    productCount.textContent = visible;
  });
});

const cartCount = document.getElementById("cartCount");
let cartTotal = 0;

document.querySelectorAll(".add-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    cartTotal++;
    cartCount.textContent = cartTotal;

    cartCount.classList.remove("bump");
    void cartCount.offsetWidth;
    cartCount.classList.add("bump");

    showToast(`☕ ${btn.dataset.name} сагсанд нэмэгдлээ`);
  });
});

document.getElementById("newsletterForm").addEventListener("submit", (e) => {
  e.preventDefault();
  e.target.reset();
  showToast("Бүртгүүлсэнд баярлалаа!");
});

document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  e.target.reset();
  showToast("Таны мессеж илгээгдлээ. Баярлалаа!");
});