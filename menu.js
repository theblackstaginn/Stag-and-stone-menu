(() => {
"use strict";

// ---- MENU DATA ----
const MENU = [
{
title: "House Coffees",
columns: [
[
{ name: "Stag’s Dark Roast", price: "" },
{ name: "Dawnwood Medium Roast", price: "" }
],
[
{ name: "Cold Brew", price: "$14" },
{ name: "Nitro Cold Brew", price: "$14" }
]
]
},

{
title: "Espresso Drinks",
columns: [
[
{ name: "Espresso", price: "$14" },
{ name: "Americano", price: "$14" },
{ name: "Cappuccino", price: "$14" }
],
[
{ name: "Latte", price: "$14" },
{ name: "Black Spell Mocha", price: "$14" },
{ name: "Caramel Draught Latte", price: "$14" }
]
]
},

{
title: "Herbal & Specialty Lattes",
columns: [
[
{ name: "Green Witch Latte", price: "$14" },
{ name: "Ember & Ash Latte", price: "$14" },
{ name: "Wildflower Honey Latte", price: "$14" }
],
[
{ name: "Stag King Brew", price: "$14" },
{ name: "Matcha Green Elixir", price: "$14" },
{ name: "Dragonfire Mocha", price: "$14" },
{ name: "Siren Salted Cold Foam", price: "$14" },
{ name: "Shadow & Bone Brew", price: "$14" },
{ name: "Hearthlight Latte", price: "$14" }
]
]
},

{
title: "Iced Drinks & Coolers",
columns: [
[
{ name: "Iced Latte", price: "$14" },
{ name: "Iced Mocha", price: "$14" },
{ name: "Iced Matcha", price: "$14" }
],
[
{ name: "Iced Americano", price: "$14" },
{ name: "Iced Chai Latte", price: "$14" },
{ name: "Witchlight Cooler", price: "$14" }
]
]
},

// --- Sandwiches (BOTTOM) ---
{
title: "Sandwiches",
columns: [
[
{
name: "The Stag Melt",
price: "$14",
desc: "Tavern ham, bacon, egg & melted cheese with thyme and parsley on house sourdough"
},
{
name: "Turkey, Brie & Cranberry",
price: "$13",
desc: "Roasted turkey, brie, and cranberry on house sourdough"
}
],
[
{
name: "Wildwood Melt (limited)",
price: "$15",
desc: "Chanterelle, beech, maitake, and cremini mushrooms with bacon jam, thyme and parsley on house sourdough"
},
{
name: "Tavern Ham & Grilled Cheese",
price: "$11",
desc: "Tavern ham and melted cheese on house sourdough"
}
]
]
}
];

// ---- RENDER ----
const menuEl = document.getElementById("menu");
if (!menuEl) return;

menuEl.innerHTML = MENU.map(renderSection).join("");

function renderSection(section) {
const left = renderList(section.columns?.[0] || []);
const right = renderList(section.columns?.[1] || []);

return `
<section class="section">
<h2 class="section-title">${escapeHtml(section.title)}</h2>
<div class="grid">
<ul class="list">${left}</ul>
<ul class="list">${right}</ul>
</div>
</section>
`;
}

function renderList(items) {
return items.map((it) => {
const hasPrice = (it.price || "").trim().length > 0;
const desc = (it.desc || "").trim();

return `
<li class="item">
<span class="item-name">${escapeHtml(it.name)}</span>
${hasPrice ? `<span class="item-price">${escapeHtml(it.price)}</span>` : ``}
</li>
${desc ? `<div class="item-desc">${escapeHtml(desc)}</div>` : ``}
`;
}).join("");
}

function escapeHtml(str) {
return String(str)
.replaceAll("&", "&amp;")
.replaceAll("<", "&lt;")
.replaceAll(">", "&gt;")
.replaceAll('"', "&quot;")
.replaceAll("'", "&#039;");
}
})();
