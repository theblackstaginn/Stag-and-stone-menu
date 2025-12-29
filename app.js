(() => {
  "use strict";

  const DATA_VERSION = "reset3";

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
        { name: "Black Spell Mocha", description: "(dark chocolate mocha)" },
        { name: "Caramel Draught Latte", description: "(caramel latte)" },
      ],
    },

    {
      title: "Signature Coffeehouse",
      items: [
        { name: "Stag King Brew", description: "(signature sweet-cream coffee)" },
        { name: "Dragonfire Mocha", description: "(spiced mocha)" },
        { name: "Siren Salted Cold Foam", description: "(cold foam topper — add-on)" },
      ],
    },

    {
      title: "Iced Coffeehouse",
      items: [{ name: "Any espresso classic available iced" }],
    },

    {
      title: "Teas & Herbals",
      items: [
        { name: "Orchard Chai", description: "(chai)" },
        { name: "Forest Mint", description: "(mint herbal)" },
        { name: "Lavender Fields", description: "(lavender herbal)" },
        { name: "Siren Blue", description: "(butterfly pea herbal)" },
      ],
    },

    {
      title: "Matcha",
      items: [{ name: "Matcha Green Elixir", description: "(matcha latte)" }],
    },

    {
      title: "Iced & Refreshers",
      items: [
        { name: "Iced Chai" },
        { name: "Iced Matcha" },
        { name: "Stormborn Lemonade" },
        { name: "Witchlight Cooler", description: "(seasonal refresher)" },
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
      ? `<div class="subnote section-sub" style="text-align:center;">${escapeHTML(section.subtitle)}</div>`
      : "";

    const items = section.items
      .map(
        (it) => `
        <div class="item">
          <div class="left">
            <div class="name">${escapeHTML(it.name)}</div>
            ${it.description ? `<div class="desc">${escapeHTML(it.description)}</div>` : ""}
          </div>
          ${it.price ? `<div class="price copper">${escapeHTML(it.price)}</div>` : ""}
        </div>
      `
      )
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

  function render() {
    const mount = document.getElementById("menuContent");
    if (!mount) throw new Error('Missing <div id="menuContent"></div> in index.html');

    // Update DATA line in header (if present)
    const dv = document.getElementById("dataVersion");
    if (dv) dv.textContent = `DATA: ${DATA_VERSION} • sections: ${MENU.length}`;

    mount.innerHTML = MENU
      .map(sectionHTML)
      .join("")
      .replace(/<div class="divider"[^]*<\/div>\s*$/, "");
  }

  window.addEventListener("DOMContentLoaded", () => {
    try {
      render();
    } catch (err) {
      const mount = document.getElementById("menuContent");
      if (mount) {
        mount.innerHTML = `
          <div style="max-width:900px;margin:2rem auto;padding:1rem;border:1px solid rgba(198,104,74,.35);border-radius:12px;background:rgba(0,0,0,.35);">
            <div style="font-weight:700;letter-spacing:.08em;margin-bottom:.5rem;">Menu Render Error</div>
            <div style="opacity:.85;white-space:pre-wrap;">${escapeHTML(err.message)}</div>
          </div>
        `;
      }
      console.error(err);
    }
  });
})();