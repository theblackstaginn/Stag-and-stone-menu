const MENU = [
{
title: "House Coffees",
columns: [
[
{ name: "Stag’s Dark Roast", price: "" },
{ name: "Dawnwood Medium Roast", price: "" }
],
[
{ name: "Cold Brew", price: "14" },
{ name: "Nitro Cold Brew", price: "14" }
]
]
},

{
title: "Espresso Drinks",
columns: [
[
{ name: "Espresso", price: "14" },
{ name: "Americano", price: "14" },
{ name: "Cappuccino", price: "14" }
],
[
{ name: "Latte", price: "14" },
{ name: "Black Spell Mocha", price: "14" },
{ name: "Caramel Draught Latte", price: "14" }
]
]
},

{
title: "Herbal & Specialty Lattes",
columns: [
[
{ name: "Green Witch Latte", price: "14" },
{ name: "Ember & Ash Latte", price: "14" },
{ name: "Wildflower Honey Latte", price: "14" }
],
[
{ name: "Stag King Brew", price: "14" },
{ name: "Matcha Green Elixir", price: "14" },
{ name: "Siren Salted Cold Foam", price: "14" }
]
]
},

{
title: "Iced Drinks & Coolers",
columns: [
[
{ name: "Iced Latte", price: "14" },
{ name: "Iced Americano", price: "14" },
{ name: "Iced Mocha", price: "14" }
],
[
{ name: "Iced Matcha", price: "14" },
{ name: "Iced Chai Latte", price: "14" },
{ name: "Witchlight Cooler", price: "14" }
]
]
},

// ALWAYS LAST (per your instruction)
{
title: "Sandwiches",
columns: [
[
{ name: "The Stag Melt", price: "14" },
{ name: "Turkey, Brie & Cranberry", price: "13" }
],
[
{ name: "Wildwood Melt (Limited)", price: "15" },
{ name: "Tavern Ham & Grilled Cheese", price: "11" }
]
]
}
];

function el(tag, className, text) {
const node = document.createElement(tag);
if (className) node.className = className;
if (text != null) node.textContent = text;
return node;
}

function normalizePrice(p) {
if (p == null) return "";
const s = String(p).trim();
if (!s) return "";
return s.startsWith("$") ? s : `$${s}`;
}

function renderMenu() {
const root = document.getElementById("menu");
if (!root) return;

root.innerHTML = "";

MENU.forEach((sectionData) => {
const section = el("section", "section");

const title = el("h2", "section-title", (sectionData.title || "").trim());
section.appendChild(title);

const grid = el("div", "grid");

const cols = Array.isArray(sectionData.columns) ? sectionData.columns : [];
cols.forEach((col) => {
const list = el("ul", "list");

const items = Array.isArray(col) ? col : [];
items.forEach((item) => {
const name = (item?.name ?? "").toString().trim();
if (!name) return;

const li = el("li", "item");

li.appendChild(el("span", "item-name", name));
li.appendChild(el("span", "item-price", normalizePrice(item?.price)));

list.appendChild(li);
});

grid.appendChild(list);
});

section.appendChild(grid);
root.appendChild(section);
});
}

renderMenu();
