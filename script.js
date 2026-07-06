const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelector(".nav-links");
const printButton = document.querySelector(".print-button");
const sectionLinks = [...document.querySelectorAll(".nav-links a")];

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  navLinks?.classList.toggle("open", !isOpen);
});

sectionLinks.forEach((link) => {
  link.addEventListener("click", () => {
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "Open navigation");
    navLinks?.classList.remove("open");
  });
});

printButton?.addEventListener("click", () => window.print());

if ("IntersectionObserver" in window) {
  const linkBySection = new Map(
    sectionLinks.map((link) => [link.getAttribute("href")?.slice(1), link]),
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        sectionLinks.forEach((link) => link.classList.remove("active"));
        linkBySection.get(entry.target.id)?.classList.add("active");
      });
    },
    { rootMargin: "-35% 0px -55% 0px" },
  );

  document
    .querySelectorAll(
      "#map, #things-to-bring, #saturday, #sunday, #monday, #local-favorites",
    )
    .forEach((section) => observer.observe(section));
}
