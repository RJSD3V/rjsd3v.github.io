// Raajas Sode — Portfolio SPA interactivity (no dependencies, no build step)

document.addEventListener("DOMContentLoaded", () => {
  initNavToggle();
  initScrollSpy();
  initPortfolioFilter();
  initMediaModal();
  initScrollReveal();
  initFooterYear();
});

/* Mobile hamburger menu */
function initNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".nav-menu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    toggle.classList.toggle("open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* Highlight the active nav link as sections scroll into view */
function initScrollSpy() {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-menu a");
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => link.classList.remove("active"));
        const activeLink = document.querySelector(`.nav-menu a[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add("active");
      });
    },
    { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* Filter portfolio cards by category */
function initPortfolioFilter() {
  const buttons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".portfolio-grid .card");
  if (!buttons.length || !cards.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;
      cards.forEach((card) => {
        const show = filter === "all" || card.dataset.category === filter;
        card.style.display = show ? "" : "none";
      });
    });
  });
}

/* Click-to-play lightbox for project videos / YouTube embeds */
function initMediaModal() {
  const modal = document.getElementById("media-modal");
  const modalBody = document.getElementById("media-modal-body");
  const closeBtn = document.getElementById("media-modal-close");
  if (!modal || !modalBody || !closeBtn) return;

  const openModal = (el) => {
    modalBody.innerHTML = "";

    if (el.dataset.videoSrc) {
      const video = document.createElement("video");
      video.src = el.dataset.videoSrc;
      video.controls = true;
      video.autoplay = true;
      video.loop = true;
      modalBody.appendChild(video);
    } else if (el.dataset.youtube) {
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube.com/embed/${el.dataset.youtube}?autoplay=1`;
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;
      modalBody.appendChild(iframe);
    } else {
      return;
    }

    modal.classList.add("open");
    document.body.classList.add("modal-open");
  };

  const closeModal = () => {
    modal.classList.remove("open");
    document.body.classList.remove("modal-open");
    modalBody.innerHTML = "";
  };

  document.querySelectorAll(".expand-btn").forEach((btn) => {
    btn.addEventListener("click", () => openModal(btn));
  });

  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

/* Fade/slide sections in as they enter the viewport */
function initScrollReveal() {
  const revealEls = document.querySelectorAll(".reveal");
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el) => observer.observe(el));
}

function initFooterYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}
