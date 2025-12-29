document.addEventListener("DOMContentLoaded", () => {

  const MENU = [
    {
      title: "House Coffees",
      items: [
        { name: "Stag’s Dark Roast", price: "$14" },
        { name: "Dawnwood Medium Roast", price: "$14" },
        { name: "Cold Brew", price: "$14" },
        { name: "Nitro Cold Brew", price: "$14" }
      ]
    },
    {
      title: "Espresso Drinks",
      items: [
        { name: "Espresso", price: "$14" },
        { name: "Americano", price: "$14" },
        { name: "Cappuccino", price: "$14" },
        { name: "Latte", price: "$14" }
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
  if (!mount) {
    mount.innerHTML = "<p style='color:red'>menuContent missing</p>";
    return;
  }

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
          ? `<div class="subnote" style="text-align:center;margin:-.3rem 0 1.1rem;">${escapeHTML(section.subtitle)}</div>`
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