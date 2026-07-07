const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelector(".nav-links");
const printButton = document.querySelector(".print-button");
const sectionLinks = [...document.querySelectorAll(".nav-links a")];
const mapMarkers = [...document.querySelectorAll(".map-marker")];
const mapLandmarks = [...document.querySelectorAll(".map-legend li[id]")];

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

if (mapMarkers.length && mapLandmarks.length) {
  const landmarkById = new Map(mapLandmarks.map((landmark) => [landmark.id, landmark]));

  const setActiveLandmark = (id) => {
    if (!landmarkById.has(id)) return;

    mapLandmarks.forEach((landmark) => {
      const isActive = landmark.id === id;
      landmark.classList.toggle("is-active", isActive);

      if (isActive) {
        landmark.setAttribute("aria-current", "true");
      } else {
        landmark.removeAttribute("aria-current");
      }
    });

    mapMarkers.forEach((marker) => {
      const isActive = marker.hash === `#${id}`;
      marker.classList.toggle("is-active", isActive);

      if (isActive) {
        marker.setAttribute("aria-current", "location");
      } else {
        marker.removeAttribute("aria-current");
      }
    });
  };

  const syncActiveLandmarkFromHash = () => {
    setActiveLandmark(window.location.hash.slice(1));
  };

  mapMarkers.forEach((marker) => {
    marker.addEventListener("click", () => {
      setActiveLandmark(marker.hash.slice(1));
    });
  });

  syncActiveLandmarkFromHash();
  window.addEventListener("hashchange", syncActiveLandmarkFromHash);
}

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
