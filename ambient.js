/* DCO GLOBAL LIVE ATMOSPHERE */
(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.createElement("canvas");
  canvas.id = "dco-live-background";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let particles = [];
  let frame = 0;
  let pointerX = 0;
  let pointerY = 0;
  let targetX = 0;
  let targetY = 0;
  let running = true;

  const mobile = window.matchMedia("(max-width: 700px)").matches;
  const count = mobile ? 30 : 68;
  const colors = ["72,217,238", "139,92,246", "115,185,255"];

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - .5) * .35,
      vy: (Math.random() - .5) * .35,
      radius: Math.random() * 1.7 + .5,
      color: colors[Math.floor(Math.random() * colors.length)],
      phase: Math.random() * Math.PI * 2
    }));
  }

  function draw() {
    if (!running) return;
    frame = requestAnimationFrame(draw);

    ctx.clearRect(0, 0, width, height);

    pointerX += (targetX - pointerX) * .025;
    pointerY += (targetY - pointerY) * .025;

    const time = performance.now() * .00025;

    particles.forEach((p, i) => {
      p.x += p.vx + Math.sin(time + p.phase) * .12;
      p.y += p.vy + Math.cos(time + p.phase) * .12;

      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;

      const x = p.x + pointerX * (i % 4 + 1) * .8;
      const y = p.y + pointerY * (i % 4 + 1) * .8;

      ctx.beginPath();
      ctx.arc(x, y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},.8)`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = x - q.x;
        const dy = y - q.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < (mobile ? 75 : 115)) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${p.color},${.12 * (1 - distance / 115)})`;
          ctx.lineWidth = .7;
          ctx.stroke();
        }
      }
    });
  }

  window.addEventListener("pointermove", event => {
    targetX = (event.clientX / width - .5) * 2;
    targetY = (event.clientY / height - .5) * 2;
  }, { passive: true });

  window.addEventListener("resize", resize);

  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    if (running) draw();
    else cancelAnimationFrame(frame);
  });

  resize();
  draw();

  // Reveal major content as visitors move through the page.
  const revealTargets = document.querySelectorAll(
    ".section-top, .featured-heading, .section-heading, " +
    ".about-grid, .education-card, .tools-grid > *, " +
    ".resume-panel, .contact-inner"
  );

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("dco-live-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12 });

    revealTargets.forEach(element => {
      element.classList.add("dco-live-reveal");
      observer.observe(element);
    });
  } else {
    revealTargets.forEach(element => {
      element.classList.add("dco-live-visible");
    });
  }
})();
