const toggle = document.getElementById("menu-toggle");
const menu = document.getElementById("nav-links");

if (toggle && menu) {
  toggle.addEventListener("click", () => {
    const opened = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(opened));
    toggle.setAttribute("aria-label", opened ? "Close navigation" : "Open navigation");
    toggle.textContent = opened ? "×" : "☰";
  });

  menu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      toggle.textContent = "☰";
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation");
    });
  });
}

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

const revealItems = document.querySelectorAll(
  ".project-card, .expertise-item, .tool, .about-facts > div"
);

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach(item => {
    item.classList.add("reveal");
    observer.observe(item);
  });
}

const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-links a[href^='#']");

if ("IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === "#" + entry.target.id
          );
        });
      }
    });
  }, { rootMargin: "-35% 0px -55% 0px" });

  sections.forEach(section => navObserver.observe(section));
}


// WhatsApp contact form
const whatsappForm = document.getElementById("whatsapp-contact-form");

if (whatsappForm) {
  whatsappForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("contact-name").value.trim();
    const email = document.getElementById("contact-email").value.trim();
    const subject = document.getElementById("contact-subject").value.trim();
    const message = document.getElementById("contact-message").value.trim();

    const whatsappNumber = "2349125747577";

    const text = [
      "NEW PORTFOLIO ENQUIRY",
      "",
      "Name: " + name,
      "Email: " + email,
      "Subject: " + subject,
      "",
      "Message:",
      message
    ].join("\n");

    const whatsappURL =
      "https://wa.me/" + whatsappNumber + "?text=" +
      encodeURIComponent(text);

    window.location.href = whatsappURL;
  });
}
