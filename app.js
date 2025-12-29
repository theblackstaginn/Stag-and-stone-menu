(() => {
  "use strict";

  const MENU = [
    {
      title: "House Coffees",
      items: [
        { name: "Stag’s Dark Roast (drip)" },
        { name: "Dawnwood Medium Roast (drip)" },
      ],
    },
    {
      title: "Espresso Classics",
      items: [
        { name: "Espresso" },
        { name: "Americano" },
        { name: "Cappuccino" },
        { name: "Latte" },
      ],
    },
    {
      title: "Featured Lattes",
      items: [
        { name: "Black Spell Mocha (dark chocolate mocha)" },
        { name: "Caramel Draught Latte (caramel latte)" },
      ],
    },
    {
      title: "Signature Coffeehouse",
      items: [
        { name: "Stag King Brew (signature sweet-cream coffee)" },
        { name: "Dragonfire Mocha (spiced mocha)" },
        { name: "Siren Salted Cold Foam (cold foam topper — add-on)" },
      ],
    },
    {
      title: "Iced Coffeehouse",
      items: [{ name: "Any espresso classic available iced" }],
    },
    {
      title: "Teas & Herbals",
      items: [
        { name: "Orchard Chai (chai)" },
        { name: "Forest Mint (mint herbal)" },
        { name: "Lavender Fields (lavender herbal)" },
        { name: "Siren Blue (butterfly pea herbal)" },
      ],
    },
    {
      title: "Matcha",
      items: [{ name: "Matcha Green Elixir (matcha latte)" }],
    },
    {
      title: "Iced & Refreshers",
      items: [
        { name: "Iced Chai" },
        { name: "Iced Matcha" },
        { name: "Stormborn Lemonade" },
        { name: "Witchlight Cooler (seasonal refresher)" },
      ],
    },
    {
      title: "Sandwiches",
      subtitle: "Pressed to order • Limited selection",
      items: [
        {
          name: "The Stag Melt",
          price: "$14",
          description:
            "Tavern ham, bacon, egg & melted cheese with thyme and parsley on house sourdough",
        },
        {
          name: "Turkey, Brie & Cranberry",
          price: "$13",
          description: "Roasted turkey, brie, and cranberry on house sourdough",
        },
        {
          name: "Wildwood Melt (limited)",
          price: "$15",
          description:
            "Chanterelle, beech, maitake, and cremini mushrooms with bacon jam, thyme and parsley on house sourdough",
        },
        {
          name: "Tavern Ham & Grilled Cheese",
          price: "$11",
          description: "Tavern ham and melted cheese on house sourdough",
        },
      ],
    },
    {
      title: "Pastries",
      subtitle: "Baked fresh daily • Selection varies",
      items: [
        { name: "Fresh pastry (rotating)" },
        { name: "Savory hand pie or scone" },
        { name: "Biscotti or shortbread" },
      ],
    },
  ];

  const mount = () => document.getElementById("menuContent");
  const fitTarget = () => document.querySelector(".fit-target");
  const screen = () => document.querySelector(".screen");

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[c]));
  }

  function sectionHTML(section) {
    const subtitle = section.subtitle
      ? `<div class="subnote" style="text-align:center; margin: -0.4rem 0 0.9rem;">${escapeHTML(section.subtitle)}</div>`
      : "";

    const items = section.items
      .map((it) => `
        <div class="item">
          <div>
            <div class="name">${escapeHTML(it.name)}</div>
            ${it.description ? `<div class="desc">${escapeHTML(it.description)}</div>` : ""}
          </div>
          ${it.price ? `<div class="price copper">${escapeHTML(it.price)}</div>` : ""}
        </div>
      `)
      .join("");

    return `
      <section class="section">
        <h2 class="copper">${escapeHTML(section.title)}</h2>
        ${subtitle}
        <div class="items">${items}</div>
      </section>
      <div class="divider" aria-hidden="true"></div>
    `;
  }

  function renderMenu() {
    const el = mount();
    if (!el) throw new Error('Missing <div id="menuContent"></div> in index.html');

    el.innerHTML = MENU
      .map(sectionHTML)
      .join("")
      .replace(/<div class="divider"[^]*<\/div>\s*$/, "");
  }

  // Scale menu down until it fits the screen height/width (no scroll)
  function fitToScreen() {
    const tgt = fitTarget();
    const host = screen();
    if (!tgt || !host) return;

    // Reset first to measure natural size
    tgt.style.transform = "scale(1)";

    // Give layout a beat
    requestAnimationFrame(() => {
      const padding = 8; // breathing room to avoid clipping
      const hostW = host.clientWidth - padding * 2;
      const hostH = host.clientHeight - padding * 2;

      const rect = tgt.getBoundingClientRect();
      const scaleW = hostW / rect.width;
      const scaleH = hostH / rect.height;

      // We only scale DOWN, never up
      const scale = Math.min(1, scaleW, scaleH);

      tgt.style.transform = `scale(${scale})`;
    });
  }

  function boot() {
    renderMenu();
    fitToScreen();
  }

  window.addEventListener("DOMContentLoaded", boot);
  window.addEventListener("resize", fitToScreen);
})();