(() => {
  "use strict";
  const data = window.STAG_STONE_MENU;
  const shell = document.getElementById("menuShell");
  const nav = document.getElementById("jumpNav");
  const viewer = document.getElementById("viewer");
  const viewerTitle = document.getElementById("viewerTitle");
  const viewerImg = document.getElementById("viewerImg");

  if (!data || !shell || !nav) return;

  data.categories.forEach(category => {
    const link = document.createElement("a");
    link.href = "#" + category.id;
    link.textContent = category.nav;
    nav.appendChild(link);

    const section = document.createElement("section");
    section.className = "menu-section";
    section.id = category.id;

    const heading = document.createElement("header");
    heading.className = "section-heading";
    heading.innerHTML = `${category.mark ? '<span class="section-mark">' + category.mark + '</span>' : ''}<p class="eyebrow">${category.eyebrow}</p><h2>${category.title}</h2><p class="section-note">${category.note}</p>`;
    section.appendChild(heading);

    const grid = document.createElement("div");
    grid.className = "card-grid";

    category.items.forEach(([name, src]) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "menu-card";
      card.setAttribute("aria-label", "View " + name);
      card.innerHTML = `<img src="${src}" alt="${name}" loading="lazy"><span class="card-label"><span>${name}</span><span aria-hidden="true">↗</span></span>`;
      card.addEventListener("click", () => {
        viewerTitle.textContent = name;
        viewerImg.src = src;
        viewerImg.alt = name;
        viewer.showModal();
      });
      grid.appendChild(card);
    });

    section.appendChild(grid);
    shell.appendChild(section);
  });

  document.querySelector(".viewer-close")?.addEventListener("click", () => viewer.close());
  viewer?.addEventListener("click", event => {
    if (event.target === viewer) viewer.close();
  });

  const links = [...nav.querySelectorAll("a")];
  const sections = [...document.querySelectorAll(".menu-section")];
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    links.forEach(link => link.classList.toggle("active", link.hash === "#" + visible.target.id));
  }, { rootMargin: "-20% 0px -65% 0px", threshold: [0, .1, .5] });
  sections.forEach(section => observer.observe(section));

  document.getElementById("year").textContent = new Date().getFullYear();
})();