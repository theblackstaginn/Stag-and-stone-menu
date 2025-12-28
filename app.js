"use strict";

/* =========================
   EDIT MENU DATA HERE ONLY
   ========================= */
const DATA = {
  left: [
    {
      title: "House Coffees",
      items: [
        { name: "Stag’s Dark Roast", desc: "Bold roast, smooth finish", price: "14" },
        { name: "Dawnwood Medium Roast", desc: "Balanced, caramel warmth", price: "14" }
      ]
    },
    {
      title: "Featured Lattes",
      items: [
        { name: "Dragonfire", desc: "Cinnamon, smoked vanilla", price: "14" },
        { name: "Witchlight", desc: "Honey, lavender, cream", price: "14" }
      ]
    }
  ],

  right: [
    {
      title: "Espresso Classics",
      items: [
        { name: "Espresso", desc: "Rich, intense double shot", price: "14" },
        { name: "Americano", desc: "Espresso + hot water", price: "14" },
        { name: "Cappuccino", desc: "Foam-forward, classic balance", price: "14" },
        { name: "Latte", desc: "Silky milk, espresso core", price: "14" }
      ]
    },
    {
      title: "Signature Coffeehouse",
      items: [
        { name: "Stag’s Mocha", desc: "Dark cocoa, espresso, cream", price: "14" },
        { name: "Salted Maple", desc: "Maple, sea salt, espresso", price: "14" },
        { name: "Add oat or almond milk", desc: "Any hot classic or latte", price: "2" }
      ]
    }
  ],

  center: [
    {
      title: "Teas & Herbals",
      items: [
        { name: "Orchard Chai", desc: "Spiced black chai", price: "14" },
        { name: "Forest Mint", desc: "Bright mint herbal", price: "14" },
        { name: "Lavender Fields", desc: "Lavender herbal", price: "14" },
        { name: "Siren Blue", desc: "Butterfly pea herbal", price: "14" },
        { name: "Matcha Green Elixir", desc: "Matcha latte", price: "14" },
        { name: "Iced Chai", desc: "Chai over ice", price: "14" },
        { name: "Iced Matcha", desc: "Matcha over ice", price: "14" },
        { name: "Stormborn Lemonade", desc: "Citrus lemonade", price: "14" },
        { name: "Witchlight Cooler", desc: "Seasonal refresher", price: "14" }
      ]
    }
  ],

  sandwiches: [
    {
      title: "Sandwiches",
      items: [
        { name: "Stag Melt", desc: "Ham, bacon, egg, melted cheese", price: "14" },
        { name: "Turkey, Brie & Cranberry", desc: "Roasted turkey, brie, cranberry", price: "14" },
        { name: "Wildwood Melt (limited)", desc: "Mixed mushrooms, bacon jam", price: "15" },
        { name: "Tavern Ham & Grilled Cheese", desc: "Tavern ham, melted cheese", price: "11" }
      ]
    }
  ],

  pastries: [
    {
      title: "Pastries",
      items: [
        { name: "Fresh pastry (rotating)", desc: "Baked fresh daily", price: "14" },
        { name: "Savory hand pie or scone", desc: "Selection varies", price: "14" },
        { name: "Biscotti or shortbread", desc: "Selection varies", price: "14" }
      ]
    }
  ]
};

/* =========================
   RENDER
   ========================= */
const $ = (sel) => document.querySelector(sel);

function sectionEl(section) {
  const wrap = document.createElement("div");
  wrap.className = "section-block";

  const h = document.createElement("h2");
  h.className = "sect-title copper";
  h.textContent = section.title;

  const rule = document.createElement("div");
  rule.className = "rule";

  wrap.appendChild(h);
  wrap.appendChild(rule);

  for (const it of section.items) {
    const item = document.createElement("div");
    item.className = "item";

    const line = document.createElement("div");
    line.className = "item-line";

    const name = document.createElement("div");
    name.className = "item-name copper";
    name.textContent = it.name;

    const price = document.createElement("div");
    price.className = "item-price copper";
    price.textContent = it.price;

    const desc = document.createElement("div");
    desc.className = "desc copper";
    desc.textContent = it.desc || "";

    line.appendChild(name);
    line.appendChild(price);

    item.appendChild(line);
    if (it.desc) item.appendChild(desc);

    wrap.appendChild(item);
  }

  return wrap;
}

function mount(id, sections) {
  const el = document.getElementById(id);
  el.innerHTML = "";
  sections.forEach(s => el.appendChild(sectionEl(s)));
}

mount("leftPanel", DATA.left);
mount("rightPanel", DATA.right);
mount("centerPanel", DATA.center);
mount("sandwichPanel", DATA.sandwiches);
mount("pastryPanel", DATA.pastries);