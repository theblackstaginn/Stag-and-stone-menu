// Stag & Stone Drink Menu Data
const MENU = [
  {
    title: "House Coffees",
    columns: [
      [{ name: "Stag’s Dark Roast", price: "" }],
      [{ name: "Dawnwood Medium Roast", price: "" }],
    ],
  },
  {
    title: "Espresso Drinks",
    columns: [
      [
        { name: "Espresso", price: "14" },
        { name: "Latte", price: "14" },
        { name: "Black Spell Mocha", price: "14" },
      ],
      [
        { name: "Americano", price: "14" },
        { name: "Cappuccino", price: "14" },
        { name: "Caramel Draught Latte", price: "14" },
      ],
    ],
  },
  {
    title: "Herbal & Specialty Lattes",
    columns: [
      [
        { name: "Green Witch Latte", price: "14" },
        { name: "Ember & Ash Latte", price: "14" },
        { name: "Wildflower Honey Latte", price: "14" },
      ],
      [
        { name: "Stag King Brew", price: "14" },
        { name: "Matcha Green Elixir", price: "14" },
        { name: "Dragonfire Mocha", price: "14" },
        { name: "Siren Salted Cold Foam", price: "14" },
        { name: "Shadow & Bone Brew", price: "14" },
        { name: "Hearthlight Latte", price: "14" },
      ],
    ],
  },
  {
    title: "Iced Drinks & Coolers",
    columns: [
      [
        { name: "Iced Latte", price: "14" },
        { name: "Iced Mocha", price: "14" },
        { name: "Iced Matcha", price: "14" },
      ],
      [
        { name: "Iced Americano", price: "14" },
        { name: "Iced Chai Latte", price: "14" },
        { name: "Witchlight Cooler", price: "14" },
      ],
    ],
  },
];

function el(tag, className, text){
  const n = document.createElement(tag);
  if (className) n.className = className;
  if (text != null) n.textContent = text;
  return n;
}

function renderMenu(){
  const root = document.getElementById("menu");
  if (!root) return;

  root.innerHTML = "";

  MENU.forEach(sec => {
    const section = el("section", "menu-section");

    const title = el("h2", "menu-section-title", sec.title);
    section.appendChild(title);

    const grid = el("div", "menu-grid");

    sec.columns.forEach(col => {
      const ul = el("ul", "menu-list");

      col.forEach(item => {
        const li = el("li", "menu-item");

        const name = el("span", "menu-item-name", item.name);
        const price = el("span", "menu-item-price", item.price ? `$${item.price}` : "");

        li.appendChild(name);
        li.appendChild(price);
        ul.appendChild(li);
      });

      grid.appendChild(ul);
    });

    section.appendChild(grid);
    root.appendChild(section);
  });
}

renderMenu();
