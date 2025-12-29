(() => {
  "use strict";

  const menuEl = document.getElementById("menu");
  if (!menuEl) {
    console.error("Menu container #menu not found");
    return;
  }

  const MENU = [
    {
      title: "House Coffees",
      items: [
        { name: "Stag’s Dark Roast (drip)", price: "" },
        { name: "Dawnwood Medium Roast (drip)", price: "" }
      ]
    },
    {
      title: "Espresso Drinks",
      items: [
        { name: "Espresso", price: "$14" },
        { name: "Americano", price: "$14" },
        { name: "Latte", price: "$14" }
      ]
    }
  ];

  function render() {
    menuEl.innerHTML = MENU.map(section => `
      <div class="section">
        <h2>${section.title}</h2>
        ${section.items.map(item => `
          <div class="item">
            <div class="name">${item.name}</div>
            <div class="price">${item.price}</div>
          </div>
        `).join("")}
      </div>
    `).join("");
  }

  render();
})();