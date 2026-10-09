const toggle = document.getElementById("menu-toggle");
const menu = document.getElementById("nav-links");

if (toggle && menu) {
  toggle.addEventListener("click", () => {
    const opened = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(opened));
    toggle.setAttribute(
      "aria-label",
      opened ? "Close navigation" : "Open navigation"
    );
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

// Reveal sections gently as they enter the viewport.
const revealItems = document.querySelectorAll(
  ".feature-card, .project, .journal-card"
);

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
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
// Share cybersecurity articles
document.querySelectorAll("[data-share]").forEach(button => {
  button.addEventListener("click", async () => {
    const article = document.getElementById(button.dataset.share);
    if (!article) return;

    const title = article.querySelector("h2")?.textContent.trim()
      || "DCO Cybersecurity Guide";

    const shareData = {
      title,
      text: title + " — Cybersecurity education from DCO.",
      url: window.location.href.split("#")[0] + "#" + article.id
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(
          shareData.title + "\n" + shareData.text + "\n" + shareData.url
        );
        button.textContent = "Link copied";
      } else {
        window.prompt("Copy this article link:", shareData.url);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        window.prompt("Copy this article link:", shareData.url);
      }
    }
  });
// Click-to-open homepage sections
const homeSections = Array.from(
  document.querySelectorAll("main > section")
);

function showPage(id, updateAddress = true) {
  const target = homeSections.find(section => section.id === id)
    || homeSections.find(section => section.id === "home");

  if (!target) return;

  homeSections.forEach(section => {
    const active = section === target;
    section.classList.toggle("page-active", active);
    section.classList.toggle("page-hidden", !active);
  });

  document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {
    const active = link.getAttribute("href") === "#" + target.id;

    if (active) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  if (updateAddress) {
    history.replaceState(null, "", "#" + target.id);
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", event => {
    const id = link.getAttribute("href").slice(1);

    if (homeSections.some(section => section.id === id)) {
      event.preventDefault();
      showPage(id);
    }
  });
});

if (homeSections.length) {
  showPage(location.hash.slice(1) || "home", false);
}

window.addEventListener("hashchange", () => {
  showPage(location.hash.slice(1), false);
});
});
