document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("js-enhanced");

  const header = document.querySelector(".site-header");
  const nav = document.querySelector(".site-nav");
  const toggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelectorAll(".site-nav__links a");
  const page = document.body.dataset.page;

  const syncHeaderState = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 18);
  };

  syncHeaderState();
  window.addEventListener("scroll", syncHeaderState, { passive: true });

  if (page) {
    document
      .querySelectorAll(`[data-page-link="${page}"]`)
      .forEach((link) => link.classList.add("is-active"));
  }

  const closeMenu = () => {
    if (!nav || !toggle) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 920) {
        closeMenu();
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      closeLightbox();
    }
  });

  const revealItems = document.querySelectorAll("[data-reveal]");

  if ("IntersectionObserver" in window && revealItems.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const yearNodes = document.querySelectorAll(".js-year");
  yearNodes.forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  const galleryTriggers = document.querySelectorAll("[data-lightbox]");
  let lightbox = null;
  let lightboxImage = null;
  let lightboxCaption = null;

  const ensureLightbox = () => {
    if (lightbox) return;

    lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.innerHTML = `
      <div class="lightbox__inner">
        <button class="lightbox__close" type="button" aria-label="Uždaryti peržiūrą">✕</button>
        <img class="lightbox__image" alt="" />
        <div class="lightbox__caption"></div>
      </div>
    `;

    document.body.appendChild(lightbox);
    lightboxImage = lightbox.querySelector(".lightbox__image");
    lightboxCaption = lightbox.querySelector(".lightbox__caption");

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox || event.target.classList.contains("lightbox__close")) {
        closeLightbox();
      }
    });
  };

  const openLightbox = (src, alt, caption) => {
    ensureLightbox();
    lightboxImage.src = src;
    lightboxImage.alt = alt || "";
    lightboxCaption.textContent = caption || alt || "";
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
  };

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  galleryTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const src = trigger.dataset.lightbox;
      const alt = trigger.dataset.alt || "";
      const caption = trigger.dataset.caption || "";
      if (src) {
        openLightbox(src, alt, caption);
      }
    });
  });
});
