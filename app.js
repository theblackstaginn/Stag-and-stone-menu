(() => {
  "use strict";

  const menuEl = document.getElementById("menu");
  if (!menuEl) return;

  // ---- MENU DATA ----
  const MENU = [
    {
      title: "House Coffees",
      items: [
        { name: "Stag’s Dark Roast (drip)", price: "" },
        { name: "Dawnwood Medium Roast (drip)", price: "" },
      ],
    },

    {
      title: "Espresso Classics",
      items: [
        { name: "Espresso", price: "" },
        { name: "Americano", price: "" },
        { name: "Cappuccino", price: "" },
        { name: "Latte", price: "" },
      ],
    },

    {
      title: "Featured Lattes",
      items: [
        { name: "Black Spell Mocha", price: "", desc: "dark chocolate mocha" },
        { name: "Caramel Draught Latte", price: "", desc: "caramel latte" },
      ],
    },

    {
      title: "Signature Coffeehouse",
      items: [
        { name: "Stag King Brew", price: "", desc: "signature sweet-cream coffee" },
        { name: "Dragonfire Mocha", price: "", desc: "spiced mocha" },
        { name: "Siren Salted Cold Foam", price: "", desc: "cold foam topper — add-on" },
      ],
    },

    {
      title: "Iced Coffeehouse",
      items: [
        { name: "Any espresso classic available iced", price: "" },
      ],
    },

    {
      title: "Teas & Herbals",
      items: [
        { name: "Orchard Chai", price: "", desc: "chai" },
        { name: "Forest Mint", price: "", desc: "mint herbal" },
        { name: "Lavender Fields", price: "", desc: "lavender herbal" },
        { name: "Siren Blue", price: "", desc: "butterfly pea herbal" },
      ],
    },

    {
      title: "Matcha",
      items: [
        { name: "Matcha Green Elixir", price: "", desc: "matcha latte" },
      ],
    },

    {
      title: "Iced & Refreshers",
      items: [
        { name: "Iced Chai", price: "" },
        { name: "Iced Matcha", price: "" },
        { name: "Stormborn Lemonade", price: "" },
        { name: "Witchlight Cooler", price: "", desc: "seasonal refresher" },
      ],
    },

    {
      title: "Sandwiches",
      items: [
        {
          name: "The Stag Melt",
          price: "$14",
          desc: "Tavern ham, bacon, egg & melted cheese with thyme and parsley on house sourdough",
        },
        {
          name: "Turkey, Brie & Cranberry",
          price: "$13",
          desc: "Roasted turkey, brie, and cranberry on house sourdough",
        },
        {
          name: "Wildwood Melt (limited)",
          price: "$15",
          desc: "Chanterelle, beech, maitake, and cremini mushrooms with bacon jam, thyme and parsley on house sourdough",
        },
        {
          name: "Tavern Ham & Grilled Cheese",
          price: "$11",
          desc: "Tavern ham and melted cheese on house sourdough",
        },
      ],
    },

    {
      title: "Pastries",
      items: [
        { name: "Fresh pastry (rotating)", price: "" },
        { name: "Savory hand pie or scone", price: "" },
        { name: "Biscotti or shortbread", price: "" },
      ],
    },
  ];

  // ---- RENDER ----
  const escapeHtml = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[c]));

  function render() {
    menuEl.innerHTML = MENU.map((section) => {
      const items = section.items.map((item) => {
        const name = escapeHtml(item.name ?? "");
        const price = escapeHtml(item.price ?? "");
        const desc = item.desc ? `<div class="desc">${escapeHtml(item.desc)}</div>` : "";

        return `
          <div class="item">
            <div class="left">
              <div class="name">${name}</div>
              ${desc}
            </div>
            <div class="price">${price}</div>
          </div>
        `;
      }).join("");

      return `
        <div class="section">
          <h2>${escapeHtml(section.title)}</h2>
          ${items}
        </div>
      `;
    }).join("");
  }

  render();

  // Optional: build stamp
  const buildMeta = document.getElementById("buildMeta");
  if (buildMeta) buildMeta.textContent = "BUILD: 2025-12-29";
})();