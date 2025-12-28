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

function el(tag, cls, text){
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

function renderMenu(){
  const root = document.getElementById("menu");
  root.innerHTML = "";

  MENU.forEach(sec => {
    const section = el("section", "section");
    section.appendChild(el("h2", "", sec.title));

    const grid = el("div", "grid");

    sec.columns.forEach(col => {
      const ul = el("ul");

      col.forEach(item => {
        const li = el("li");

        li.appendChild(el("span", "item", item.name));
        li.appendChild(el("span", "price", item.price ? `$${item.price}` : ""));

        ul.appendChild(li);
      });

      grid.appendChild(ul);
    });

    section.appendChild(grid);
    root.appendChild(section);
  });
}

renderMenu();
