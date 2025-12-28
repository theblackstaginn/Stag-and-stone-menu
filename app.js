"use strict";

/* ========= EDIT ONLY THIS DATA =========
   - price: NO $ symbol
   - desc: keep to one line (will truncate with ellipsis if too long)
*/
const MENU = {
  left: [
    { title: "House Coffees", items: [
      { name: "Stag’s Dark Roast", desc: "Bold roast, smooth finish", price: "14" },
      { name: "Dawnwood Medium Roast", desc: "Balanced, caramel warmth", price: "14" },
    ]},
    { title: "Espresso Classics", items: [
      { name: "Espresso", desc: "Rich, intense double shot", price: "14" },
      { name: "Americano", desc: "Espresso + hot water", price: "14" },
      { name: "Cappuccino", desc: "Foam-forward, classic balance", price: "14" },
      { name: "Latte", desc: "Silky milk, espresso core", price: "14" },
    ]},
    { title: "Featured Lattes", items: [
      { name: "Dragonfire", desc: "Cinnamon, smoked vanilla", price: "14" },
      { name: "Witchlight", desc: "Honey, lavender, cream", price: "14" },
    ]},
    { title: "Signature Coffeehouse", items: [
      { name: "Stag’s Mocha", desc: "Dark cocoa, espresso, cream", price: "14" },
      { name: "Salted Maple", desc: "Maple, sea salt, espresso", price: "14" },
      { name: "Add oat or almond milk", desc: "Any hot classic or latte", price: "2" },
    ]},
  ],

  right: [
    { title: "Teas & Herbals", items: [
      { name: "Earl Grey", desc: "Bergamot black tea", price: "14" },
      { name: "English Breakfast", desc: "Robust black blend", price: "14" },
      { name: "Peppermint", desc: "Bright, clean herbal", price: "14" },
      { name: "Chamomile", desc: "Soft floral calm", price: "14" },
    ]},
    { title: "Matcha", items: [
      { name: "Matcha Latte", desc: "Ceremonial matcha, milk", price: "14" },
    ]},
    { title: "Iced Coffeehouse", items: [
      { name: "Any classic iced", desc: "Ask your barista", price: "14" },
    ]},
    { title: "Iced & Refreshers", items: [
      { name: "Cold Brew", desc: "Slow-steeped, chocolate notes", price: "14" },
      { name: "Nitro Cold Brew", desc: "Creamy cascade, no dairy", price: "14" },
      { name: "Citrus Tonic", desc: "Citrus, tonic, ice", price: "14" },
      { name: "Berry Spritz", desc: "Berry, soda, fresh lime", price: "14" },
    ]},
  ],

  food: [
    { title: "Sandwiches", items: [
      { name: "Stag Melt", desc: "Ham, egg, bacon, melted cheese", price: "14" },
      { name: "Forest Turkey", desc: "Turkey, herb aioli, greens", price: "14" },
      { name: "Garden Caprese", desc: "Mozzarella, tomato, basil oil", price: "14" },
      { name: "Limited: Hearth Roast", desc: "Rotating roast, seasonal spread", price: "14" },
    ]},
    { title: "Pastries", items: [
      { name: "Seasonal scone", desc: "Baked fresh daily", price: "14" },
      { name: "Rotating muffin", desc: "Selection varies", price: "14" },
      { name: "Cookie of the day", desc: "Ask what’s available", price: "14" },
    ]},
  ]
};

/* ========= RENDER ========= */
const $ = (sel) => document.querySelector(sel);

function renderSection({ title, items }) {
  const section = document.createElement("div");
  section.className = "section-block";

  const h = document.createElement("h2");
  h.className = "sect-title copper";
  h.textContent = title;
  section.appendChild(h);

  for (const it of items) {
    const item = document.createElement("div");
    item.className = "item";

    const line1 = document.createElement("div");
    line1.className = "item-line";

    const name = document.createElement("div");
    name.className = "item-name copper";
    name.textContent = it.name;

    const price = document.createElement("div");
    price.className = "item-price copper";
    price.textContent = it.price;

    const desc = document.createElement("div");
    desc.className = "desc copper";
    desc.textContent = it.desc;

    line1.appendChild(name);
    line1.appendChild(price);
    item.appendChild(line1);
    item.appendChild(desc);
    section.appendChild(item);
  }

  return section;
}

function renderMenu() {
  const left = $("#colLeft");
  const right = $("#colRight");
  const food = $("#food");

  left.innerHTML = "";
  right.innerHTML = "";
  food.innerHTML = "";

  MENU.left.forEach(s => left.appendChild(renderSection(s)));
  MENU.right.forEach(s => right.appendChild(renderSection(s)));
  MENU.food.forEach(s => food.appendChild(renderSection(s)));
}

renderMenu();

/* ========= EMBERS (SUBTLE) ========= */
const canvas = $("#embers");
const ctx = canvas.getContext("2d", { alpha: true });
let W = 0, H = 0;
const embers = [];
const MAX = 70;

function resize() {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const frame = $(".frame").getBoundingClientRect();
  canvas.width = Math.floor(frame.width * dpr);
  canvas.height = Math.floor(frame.height * dpr);
  canvas.style.width = `${frame.width}px`;
  canvas.style.height = `${frame.height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  W = frame.width; H = frame.height;
}
window.addEventListener("resize", resize, { passive: true });
resize();

function rand(a,b){ return a + Math.random()*(b-a); }

function getNoFlyRects() {
  const frame = $(".frame").getBoundingClientRect();
  const mast = $(".masthead").getBoundingClientRect();
  const left = $(".col-left").getBoundingClientRect();
  const right = $(".col-right").getBoundingClientRect();
  const food = $(".food").getBoundingClientRect();

  const toLocal = (r) => ({ x:r.left-frame.left, y:r.top-frame.top, w:r.width, h:r.height });
  return [toLocal(mast), toLocal(left), toLocal(right), toLocal(food)];
}

function inRect(x,y,r){ return x>=r.x && x<=r.x+r.w && y>=r.y && y<=r.y+r.h; }
function hitsNoFly(x,y,rects){ return rects.some(r => inRect(x,y,r)); }

function spawn(rects, initial=false){
  for(let tries=0; tries<30; tries++){
    // bias toward margins + gutter
    const t = Math.random();
    let x;
    if (t < 0.36) x = rand(0, W*0.12);
    else if (t < 0.72) x = rand(W*0.88, W);
    else x = rand(W*0.46, W*0.54);

    const y = initial ? rand(0, H) : rand(H, H+60);
    if(!hitsNoFly(x,y,rects)){
      embers.push({
        x, y,
        r: rand(0.8, 2.0),
        vx: rand(-0.06, 0.06),
        vy: rand(-0.45, -0.18),
        a: rand(0.03, 0.08),
        life: rand(2200, 4800),
        age: rand(0, initial ? 4800 : 400),
        flick: rand(0.6, 1.4)
      });
      return;
    }
  }
}

let last = performance.now();
function tick(now){
  const dt = Math.min(40, now - last);
  last = now;

  ctx.clearRect(0,0,W,H);
  const rects = getNoFlyRects();

  while (embers.length < MAX) spawn(rects);

  for (let i=embers.length-1; i>=0; i--){
    const e = embers[i];
    e.age += dt;
    e.x += e.vx * dt;
    e.y += e.vy * dt;

    if (e.x < -20) e.x = W + 20;
    if (e.x > W + 20) e.x = -20;

    const t = e.age / e.life;
    const fade = t < 0.12 ? (t/0.12) : (t > 0.9 ? (1 - (t-0.9)/0.1) : 1);

    const blocked = hitsNoFly(e.x, e.y, rects);
    const alpha = (blocked ? e.a*0.15 : e.a) * fade * (0.78 + 0.22*Math.sin((e.age/1000)*e.flick));

    ctx.beginPath();
    ctx.fillStyle = `rgba(255,176,96,${alpha})`;
    ctx.arc(e.x, e.y, e.r, 0, Math.PI*2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = `rgba(255,176,96,${alpha*0.35})`;
    ctx.arc(e.x, e.y, e.r*2.1, 0, Math.PI*2);
    ctx.fill();

    if (e.age >= e.life || e.y < -80){
      embers.splice(i,1);
    }
  }

  requestAnimationFrame(tick);
}
for(let i=0;i<MAX;i++) spawn(getNoFlyRects(), true);
requestAnimationFrame(tick);