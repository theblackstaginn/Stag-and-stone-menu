document.addEventListener("DOMContentLoaded", () => {

  const MENU = [
    {
      title: "House Coffees",
      items: [
        { name: "Stag’s Dark Roast (drip)" },
        { name: "Dawnwood Medium Roast (drip)" }
      ]
    },
    {
      title: "Espresso Classics",
      items: [
        { name: "Espresso" },
        { name: "Americano" },
        { name: "Cappuccino" },
        { name: "Latte" }
      ]
    },
    {
      title: "Featured Lattes",
      items: [
        { name: "Black Spell Mocha (dark chocolate mocha)" },
        { name: "Caramel Draught Latte (caramel latte)" }
      ]
    },
    {
      title: "Signature Coffeehouse",
      items: [
        { name: "Stag King Brew (signature sweet-cream coffee)" },
        { name: "Dragonfire Mocha (spiced mocha)" },
        { name: "Siren Salted Cold Foam (cold foam topper — add-on)" }
      ]
    },
    {
      title: "Iced Coffeehouse",
      items: [
        { name: "Any espresso classic available iced" }
      ]
    },
    {
      title: "Teas & Herbals",
      items: [
        { name: "Orchard Chai (chai)" },
        { name: "Forest Mint (mint herbal)" },
        { name: "Lavender Fields (lavender herbal)" },
        { name: "Siren Blue (butterfly pea herbal)" }
      ]
    },
    {
      title: "Matcha",
      items: [
        { name: "Matcha Green Elixir (matcha latte)" }
      ]
    },
    {
      title: "Iced & Refreshers",
      items: [
        { name: "Iced Chai" },
        { name: "Iced Matcha" },
        { name: "Stormborn Lemonade" },
        { name: "Witchlight Cooler (seasonal refresher)" }
      ]
    },
    {
      title: "Sandwiches",
      items: [
        {
          name: "The Stag Melt",
          price: "$14",
          description:
            "Tavern ham, bacon, egg & melted cheese with thyme and parsley on house sourdough"
        },
        {
          name: "Turkey, Brie & Cranberry",
          price: "$13",
          description:
            "Roasted turkey, brie, and cranberry on house sourdough"
        },
        {
          name: "Wildwood Melt (limited)",
          price: "$15",
          description:
            "Chanterelle, beech, maitake, and cremini mushrooms with bacon jam, thyme and parsley on house sourdough"
        },
        {
          name: "Tavern Ham & Grilled Cheese",
          price: "$11",
          description:
            "Tavern ham and melted cheese on house sourdough"
        }
      ]
    },
    {
      title: "Pastries",
      subtitle: "Baked fresh daily • Selection varies",
      items: [
        { name: "Fresh pastry (rotating)" },
        { name: "Savory hand pie or scone" },
        { name: "Biscotti or shortbread" }
      ]
    }
  ];

  const mount = document.getElementById("menuContent");
  if (!mount) return;

  const escapeHTML = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({
      "&":"&amp;",
      "<":"&lt;",
      ">":"&gt;",
      '"':"&quot;",
      "'":"&#39;"
    }[c]));

  MENU.forEach((section, idx) => {
    const sec = document.createElement("section");
    sec.className = "section";

    sec.innerHTML = `
      <h2 class="copper">${escapeHTML(section.title)}</h2>
      ${
        section.subtitle
          ? `<div class="subnote section-sub">${escapeHTML(section.subtitle)}</div>`
          : ""
      }
      <div class="items">
        ${section.items.map(it => `
          <div class="item">
            <div>
              <div class="name">${escapeHTML(it.name)}</div>
              ${it.description ? `<div class="desc">${escapeHTML(it.description)}</div>` : ""}
            </div>
            ${it.price ? `<div class="price copper">${escapeHTML(it.price)}</div>` : ""}
          </div>
        `).join("")}
      </div>
    `;

    mount.appendChild(sec);

    if (idx !== MENU.length - 1) {
      const div = document.createElement("div");
      div.className = "divider";
      mount.appendChild(div);
    }
  });

});