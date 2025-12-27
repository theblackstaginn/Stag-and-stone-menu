/* Stag & Stone — Portrait TV Menu (offline-capable)
   - Renders menu content
   - Runs steam + ember animations
   - Registers service worker for offline caching
*/

const MENU = {
  leftColumn: [
    {
      title: "House Coffees",
      items: [
        { name: "Stag’s Dark Roast", meta: "(drip)" },
        { name: "Dawnwood Medium Roast", meta: "(drip)" },
      ]
    },
    {
      title: "Espresso Classics",
      items: [
        { name: "Espresso" },
        { name: "Americano" },
        { name: "Cappuccino" },
        { name: "Latte" },
      ]
    },
    {
      title: "Featured Lattes",
      items: [
        { name: "Black Spell Mocha", meta: "(dark chocolate mocha)" },
        { name: "Caramel Draught Latte", meta: "(caramel latte)" },
      ]
    },
    {
      title: "Signature Coffeehouse",
      items: [
        { name: "Stag King Brew", meta: "(signature sweet-cream coffee)" },
        { name: "Dragonfire Mocha", meta: "(spiced mocha)" },
        { name: "Siren Salted Cold Foam", meta: "(cold foam topper — add-on)" },
      ]
    },
    {
      title: "Iced Coffeehouse",
      items: [
        { name: "Any espresso classic available iced" },
      ]
    },
    {
      title: "Teas & Herbals",
      items: [
        { name: "Orchard Chai", meta: "(chai)" },
        { name: "Forest Mint", meta: "(mint herbal)" },
        { name: "Lavender Fields", meta: "(lavender herbal)" },
        { name: "Siren Blue", meta: "(butterfly pea herbal)" },
      ]
    },
    {
      title: "Matcha",
      items: [
        { name: "Matcha Green Elixir", meta: "(matcha latte)" },
      ]
    },
    {
      title: "Iced & Refreshers",
      items: [
        { name: "Iced Chai" },
        { name: "Iced Matcha" },
        { name: "Stormborn Lemonade" },
        { name: "Witchlight Cooler", meta: "(seasonal refresher)" },
      ]
    }
  ],
  rightColumn: [
    {
      title: "Sandwiches",
      type: "pricedPills",
      items: [
        {
          name: "The Stag Melt",
          price: 14,
          desc: "Tavern ham, bacon, egg & melted cheese with thyme and parsley on house sourdough"
        },
        {
          name: "Turkey, Brie & Cranberry",
          price: 13,
          desc: "Roasted turkey, brie, and cranberry on house sourdough"
        },
        {
          name: "Wildwood Melt (limited)",
          price: 15,
          desc: "Chanterelle, beech, maitake, and cremini mushrooms with bacon jam, thyme and parsley on house sourdough"
        },
        {
          name: "Tavern Ham & Grilled Cheese",
          price: 11,
          desc: "Tavern ham and melted cheese on house sourdough"
        }
      ]
    },
    {
      title: "Pastries",
      type: "pills",
      items: [
        { name: "Fresh pastry", meta: "(rotating)" },
        { name: "Savory hand pie or scone" },
        { name: "Biscotti or shortbread" }
      ],
      footer: "Baked fresh daily • Selection varies"
    }
  ]
};

function el(tag, className, text){
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function renderMenu(){
  const grid = document.getElementById("menuGrid");
  if (!grid) return;

  const left = el("div");
  const right = el("div");

  const renderCard = (group) => {
    const card = el("article", "card");
    card.appendChild(el("h2", "", group.title));

    if (group.type === "pricedPills"){
      const wrap = el("div", "group");
      group.items.forEach(it => {
        const pill = el("div", "pill");
        const row = el("div", "row");
        row.appendChild(el("div", "title", it.name));
        row.appendChild(el("div", "price", String(it.price)));
        pill.appendChild(row);
        if (it.desc) pill.appendChild(el("div", "desc", it.desc));
        wrap.appendChild(pill);
      });
      card.appendChild(wrap);
      return card;
    }

    // default: list style
    const ul = el("ul", "list");
    group.items.forEach(it => {
      const li = el("li");
      li.appendChild(el("div", "name", it.name));
      if (it.meta) li.appendChild(el("div", "meta", it.meta));
      ul.appendChild(li);
    });
    card.appendChild(ul);

    if (group.footer){
      const f = el("div", "meta", group.footer);
      f.style.marginTop = "10px";
      f.style.textAlign = "center";
      card.appendChild(f);
    }
    return card;
  };

  MENU.leftColumn.forEach(g => left.appendChild(renderCard(g)));
  MENU.rightColumn.forEach(g => right.appendChild(renderCard(g)));

  grid.appendChild(left);
  grid.appendChild(right);

  // Keep content strictly within one screen: if overflow, tighten slightly
  requestAnimationFrame(autoFitIfNeeded);
}

function autoFitIfNeeded(){
  const menu = document.querySelector(".menu");
  if (!menu) return;

  // If the content overflows the viewport height, scale down a touch.
  const viewportH = window.innerHeight;
  const menuRect = menu.getBoundingClientRect();
  if (menuRect.height > viewportH - 24){
    const scale = Math.max(0.92, (viewportH - 24) / menuRect.height);
    menu.style.transformOrigin = "top center";
    menu.style.transform = `scale(${scale.toFixed(3)})`;
  }
}

/* --- Ritual FX: Steam + Embers --- */

function setupCanvas(id){
  const c = document.getElementById(id);
  const ctx = c.getContext("2d", { alpha: true });
  function resize(){
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.floor(window.innerWidth * dpr);
    c.height = Math.floor(window.innerHeight * dpr);
    c.style.width = window.innerWidth + "px";
    c.style.height = window.innerHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener("resize", resize, { passive: true });
  resize();
  return { c, ctx };
}

function steamFX(){
  const { ctx } = setupCanvas("steam");
  const puffs = [];
  const MAX = 70; // full ritual

  function spawn(){
    // spawn near lower third, centered
    const x = window.innerWidth * (0.35 + Math.random() * 0.30);
    const y = window.innerHeight * (0.82 + Math.random() * 0.12);
    puffs.push({
      x, y,
      r: 12 + Math.random() * 18,
      a: 0.0,
      life: 240 + Math.random() * 140,
      vx: (-0.25 + Math.random() * 0.5),
      vy: -(0.55 + Math.random() * 0.65),
      wob: Math.random() * Math.PI * 2
    });
    while (puffs.length > MAX) puffs.shift();
  }

  let t = 0;
  function draw(){
    t += 1;

    // clear with gentle fade to keep trails soft
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // light mist layer at bottom
    const grad = ctx.createRadialGradient(
      window.innerWidth/2, window.innerHeight*0.92, 10,
      window.innerWidth/2, window.innerHeight*0.92, window.innerWidth*0.6
    );
    grad.addColorStop(0, "rgba(233,238,247,0.08)");
    grad.addColorStop(1, "rgba(233,238,247,0.00)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, window.innerHeight*0.70, window.innerWidth, window.innerHeight*0.30);

    if (t % 6 === 0) spawn();

    for (let i = 0; i < puffs.length; i++){
      const p = puffs[i];
      p.a += 1;
      p.wob += 0.02;

      const age = p.a / p.life;
      const alpha = Math.max(0, (1 - age)) * 0.14; // keep readable

      p.x += p.vx + Math.sin(p.wob) * 0.25;
      p.y += p.vy;
      p.r += 0.06;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(233,238,247,${alpha.toFixed(4)})`;
      ctx.fill();

      // remove dead
      if (p.a > p.life){
        puffs.splice(i, 1);
        i--;
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
}

function emberFX(){
  const { ctx } = setupCanvas("embers");
  const motes = [];
  const MAX = 90;

  function spawn(){
    // spawn around edges and corners for “ritual perimeter”
    const side = Math.floor(Math.random()*4);
    let x, y;
    if (side === 0){ x = Math.random()*window.innerWidth; y = window.innerHeight + 20; }
    if (side === 1){ x = -20; y = Math.random()*window.innerHeight; }
    if (side === 2){ x = window.innerWidth + 20; y = Math.random()*window.innerHeight; }
    if (side === 3){ x = Math.random()*window.innerWidth; y = -20; }

    motes.push({
      x, y,
      vx: (-0.25 + Math.random()*0.5),
      vy: (-0.35 + Math.random()*0.5),
      r: 1 + Math.random()*2.2,
      a: 0,
      life: 420 + Math.random()*320,
      hue: Math.random() < 0.7 ? "185, 235, 220" : "235, 200, 160" // teal/copper-ish
    });

    while (motes.length > MAX) motes.shift();
  }

  let t = 0;
  function draw(){
    t++;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    if (t % 4 === 0) spawn();

    for (let i = 0; i < motes.length; i++){
      const m = motes[i];
      m.a++;
      const age = m.a / m.life;
      const alpha = Math.max(0, (1 - age)) * 0.22;

      m.x += m.vx + Math.sin(m.a*0.02) * 0.12;
      m.y += m.vy + Math.cos(m.a*0.02) * 0.10;

      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${m.hue},${alpha.toFixed(4)})`;
      ctx.fill();

      // subtle glow
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r*4.2, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${m.hue},${(alpha*0.08).toFixed(4)})`;
      ctx.fill();

      if (m.a > m.life){
        motes.splice(i, 1);
        i--;
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
}

/* --- Offline: Service Worker --- */
async function registerSW(){
  if (!("serviceWorker" in navigator)) return;
  try{
    await navigator.serviceWorker.register("./sw.js", { scope: "./" });
  }catch(e){
    // ignore (signage should still work online)
  }
}

/* Boot */
renderMenu();
steamFX();
emberFX();
registerSW();
window.addEventListener("resize", () => setTimeout(autoFitIfNeeded, 60), { passive: true });
