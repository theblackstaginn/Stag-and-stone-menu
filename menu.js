const PRICE_DEFAULT = "14";

// Keep descriptions short. If you don't want a desc, set desc: "".
const MENU = {
  houseCoffees: {
    title: "House Coffees",
    items: [
      { name: "Stag’s Dark Roast", price: PRICE_DEFAULT, desc: "Bold roast, smooth finish" },
      { name: "Dawnwood Medium Roast", price: PRICE_DEFAULT, desc: "Balanced, caramel warmth" }
    ]
  },

  featuredLattes: {
    title: "Featured Lattes",
    items: [
      { name: "Dragonfire", price: PRICE_DEFAULT, desc: "Cinnamon, smoked vanilla" },
      { name: "Witchlight", price: PRICE_DEFAULT, desc: "Honey, lavender, cream" }
    ]
  },

  espressoClassics: {
    title: "Espresso Classics",
    items: [
      { name: "Espresso", price: PRICE_DEFAULT, desc: "Rich, intense double shot" },
      { name: "Americano", price: PRICE_DEFAULT, desc: "Espresso + hot water" },
      { name: "Cappuccino", price: PRICE_DEFAULT, desc: "Foam-forward, classic balance" },
      { name: "Latte", price: PRICE_DEFAULT, desc: "Silky milk, espresso core" }
    ]
  },

  signatureCoffeehouse: {
    title: "Signature Coffeehouse",
    items: [
      { name: "Stag’s Mocha", price: PRICE_DEFAULT, desc: "Dark cocoa, espresso, cream" },
      { name: "Salted Maple", price: PRICE_DEFAULT, desc: "Maple, sea salt, espresso" },
      { name: "Add oat or almond milk", price: "2", desc: "Any hot classic or latte" }
    ]
  },

  teasHerbals: {
    title: "Teas & Herbals",
    items: [
      { name: "Orchard Chai", price: PRICE_DEFAULT, desc: "Spiced black chai" },
      { name: "Forest Mint", price: PRICE_DEFAULT, desc: "Bright mint herbal" },
      { name: "Lavender Fields", price: PRICE_DEFAULT, desc: "Lavender herbal" },
      { name: "Siren Blue", price: PRICE_DEFAULT, desc: "Butterfly pea herbal" },
      { name: "Matcha Green Elixir", price: PRICE_DEFAULT, desc: "Matcha latte" },
      { name: "Iced Chai", price: PRICE_DEFAULT, desc: "Chai over ice" },
      { name: "Iced Matcha", price: PRICE_DEFAULT, desc: "Matcha over ice" },
      { name: "Stormborn Lemonade", price: PRICE_DEFAULT, desc: "Citrus lemonade" },
      { name: "Witchlight Cooler", price: PRICE_DEFAULT, desc: "Seasonal refresher" }
    ]
  },

  sandwiches: {
    title: "Sandwiches",
    items: [
      { name: "The Stag Melt", price: PRICE_DEFAULT, desc: "Ham, bacon, egg, melted cheese" },
      { name: "Turkey, Brie & Cranberry", price: "13", desc: "Roast turkey, brie, cranberry" },
      { name: "Wildwood Melt (limited)", price: "15", desc: "Mixed mushrooms, bacon jam" },
      { name: "Tavern Ham & Grilled Cheese", price: "11", desc: "Ham, melted cheese" }
    ]
  },

  pastries: {
    title: "Pastries",
    items: [
      { name: "Fresh pastry (rotating)", price: "", desc: "" },
      { name: "Savory hand pie or scone", price: "", desc: "" },
      { name: "Biscotti or shortbread", price: "", desc: "" }
    ]
  }
};

function renderSection(mountId, section){
  const mount = document.getElementById(mountId);
  if(!mount) return;

  mount.innerHTML = `
    <h2 class="section-title">${section.title}</h2>
    <div class="section-rule" aria-hidden="true"></div>
    ${section.items.map(item => {
      const price = (item.price ?? "").toString();
      return `
        <div class="item">
          <div class="name">${item.name}</div>
          <div class="leader" aria-hidden="true"></div>
          <div class="price">${price}</div>
        </div>
        ${item.desc ? `<div class="desc">${item.desc}</div>` : ``}
      `;
    }).join("")}
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  renderSection("houseCoffees", MENU.houseCoffees);
  renderSection("featuredLattes", MENU.featuredLattes);
  renderSection("espressoClassics", MENU.espressoClassics);
  renderSection("signatureCoffeehouse", MENU.signatureCoffeehouse);
  renderSection("teasHerbals", MENU.teasHerbals);
  renderSection("sandwiches", MENU.sandwiches);
  renderSection("pastries", MENU.pastries);
});
