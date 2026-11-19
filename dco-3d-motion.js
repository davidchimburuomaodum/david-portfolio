/* DCO PORTFOLIO: INTERACTIVE 3D MOVEMENT */
(() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  const selectors = [
    ".project-card",
    ".expertise-item",
    ".education-card",
    ".certification-card",
    ".about-facts > div",
    ".resume-panel",
    ".tools-grid > *",
    ".tool",
    ".contact-form",
    ".contact-links a"
  ];

  const elements = [...new Set(
    selectors.flatMap(selector => [...document.querySelectorAll(selector)])
  )];

  elements.forEach((element, index) => {
    element.classList.add("dco-3d-card");
    element.style.setProperty("--dco-depth", `${8 + (index % 4) * 3}px`);
  });

  const desktop = window.matchMedia("(min-width: 701px)").matches;
  const cards = desktop ? elements : [];

  cards.forEach(card => {
    card.addEventListener("pointermove", event => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      const rotateY = (x - .5) * 10;
      const rotateX = (.5 - y) * 8;

      card.style.setProperty("--dco-tilt-x", `${rotateX}deg`);
      card.style.setProperty("--dco-tilt-y", `${rotateY}deg`);
      card.style.setProperty("--dco-depth", "22px");
    }, { passive: true });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--dco-tilt-x", "0deg");
      card.style.setProperty("--dco-tilt-y", "0deg");
      card.style.setProperty("--dco-depth", "8px");
    });
  });

  const profile = document.querySelector(".hero-profile-photo");

  if (profile && desktop) {
    profile.addEventListener("pointermove", event => {
      const rect = profile.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      profile.style.transform =
        `perspective(1000px) rotateY(${(x - .5) * 18}deg) ` +
        `rotateX(${(.5 - y) * 14}deg) translateZ(35px)`;
    }, { passive: true });

    profile.addEventListener("pointerleave", () => {
      profile.style.transform =
        "perspective(1000px) rotateY(-7deg) rotateX(3deg) translateZ(25px)";
    });
  }

  // Gentle scroll depth, updated once per animation frame.
  let ticking = false;

  function updateDepth() {
    const viewport = window.innerHeight;

    elements.forEach((element, index) => {
      const rect = element.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > viewport) return;

      const center = rect.top + rect.height / 2;
      const offset = (center - viewport / 2) / viewport;
      const movement = Math.max(-7, Math.min(7, offset * -9));

      if (!desktop) return;

      element.style.setProperty("--dco-scroll-y", `${movement}px`);
    });

    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateDepth);
    }
  }, { passive: true });

  updateDepth();

  // Staggered entrances for the 3D elements.
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("dco-3d-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: .08 });

    elements.forEach(element => observer.observe(element));
  }
})();
