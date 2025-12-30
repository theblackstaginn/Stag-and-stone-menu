(() => {
  "use strict";

  // ---------------------------
  // BUILD META
  // ---------------------------
  const buildEl = document.getElementById("buildMeta");
  if (buildEl) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    buildEl.textContent = `BUILD: ${yyyy}-${mm}-${dd}`;
  }

  // ---------------------------
  // MENU DATA (keep all items)
  // ---------------------------
  const MENU = [
    {
      title: "House Coffees",
      items: [
        { name: "Stag’s Dark Roast (drip)", price: "$4.00" },
        { name: "Dawnwood Medium Roast (drip)", price: "$4.00" },
        { name: "Cold Brew", price: "$6.00" },
        { name: "Nitro Cold Brew", price: "$7.00" }
      ]
    },
    {
      title: "Espresso Classics",
      items: [
        { name: "Espresso", price: "$3.00" },
        { name: "Americano", price: "$4.00" },
        { name: "Cappuccino", price: "$5.00" },
        { name: "Latte", price: "$5.50" }
      ]
    },
    {
      title: "Featured Lattes",
      items: [
        { name: "Black Spell Mocha", desc: "Dark chocolate mocha", price: "$6.50" },
        { name: "Caramel Draught Latte", desc: "Caramel latte", price: "$6.50" }
      ]
    },
    {
      title: "Signature Coffeehouse",
      items: [
        { name: "Stag King Brew", desc: "Signature sweet-cream coffee", price: "$6.75" },
        { name: "Dragonfire Mocha", desc: "Spiced mocha", price: "$6.75" },
        { name: "Siren Salted Cold Foam", desc: "Cold foam topper — add-on", price: "$1.50" }
      ]
    },
    {
      title: "Iced Coffeehouse",
      items: [
        { name: "Iced Espresso Classics", desc: "Any espresso classic available iced", price: "—" }
      ]
    },
    {
      title: "Teas & Herbals",
      items: [
        { name: "Orchard Chai", desc: "Chai", price: "$4.50" },
        { name: "Forest Mint", desc: "Mint herbal", price: "$4.50" },
        { name: "Lavender Fields", desc: "Lavender herbal", price: "$4.50" },
        { name: "Siren Blue", desc: "Butterfly pea herbal", price: "$4.50" }
      ]
    },
    {
      title: "Matcha",
      items: [
        { name: "Matcha Green Elixir", desc: "Matcha latte", price: "$6.00" }
      ]
    },
    {
      title: "Iced & Refreshers",
      items: [
        { name: "Iced Chai", price: "$5.50" },
        { name: "Iced Matcha", price: "$6.50" },
        { name: "Stormborn Lemonade", price: "$5.50" },
        { name: "Witchlight Cooler", desc: "Seasonal refresher", price: "$6.00" }
      ]
    },
    {
      title: "Sandwiches",
      items: [
        {
          name: "The Stag Melt",
          desc: "Tavern ham, bacon, egg & melted cheese with thyme and parsley on house sourdough",
          price: "$14"
        },
        {
          name: "Turkey, Brie & Cranberry",
          desc: "Roasted turkey, brie, and cranberry on house sourdough",
          price: "$13"
        },
        {
          name: "Wildwood Melt (limited)",
          desc: "Chanterelle, beech, maitake, and cremini mushrooms with bacon jam, thyme and parsley on house sourdough",
          price: "$15"
        },
        {
          name: "Tavern Ham & Grilled Cheese",
          desc: "Tavern ham and melted cheese on house sourdough",
          price: "$11"
        }
      ]
    },
    {
      title: "Pastries",
      items: [
        { name: "Fresh pastry (rotating)", price: "—" },
        { name: "Savory hand pie or scone", price: "—" },
        { name: "Biscotti or shortbread", price: "—" }
      ]
    }
  ];

  // ---------------------------
  // RENDER MENU
  // ---------------------------
  const menuEl = document.getElementById("menu");

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function renderMenu() {
    if (!menuEl) return;
    menuEl.innerHTML = "";

    for (const section of MENU) {
      const s = el("div", "section");

      const h = el("h2", "sectionTitle copper", section.title);
      s.appendChild(h);

      for (const it of section.items) {
        const row = el("div", "item");

        const left = el("div", "left");
        const name = el("div", "name copper", it.name);
        left.appendChild(name);

        if (it.desc) {
          const desc = el("div", "desc", it.desc);
          left.appendChild(desc);
        }

        const price = el("div", "price copper", it.price || "");
        row.appendChild(left);
        row.appendChild(price);

        s.appendChild(row);
      }

      menuEl.appendChild(s);
    }
  }

  renderMenu();

  // ---------------------------
  // CANVAS SETUP
  // ---------------------------
  function setupCanvas(id) {
    const canvas = document.getElementById(id);
    if (!canvas) return null;
    const ctx = canvas.getContext("2d", { alpha: true });
    const s = { canvas, ctx, w: 0, h: 0, dpr: 1 };

    function resize() {
      s.dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      s.w = Math.floor(window.innerWidth);
      s.h = Math.floor(window.innerHeight);
      canvas.width = Math.floor(s.w * s.dpr);
      canvas.height = Math.floor(s.h * s.dpr);
      canvas.style.width = s.w + "px";
      canvas.style.height = s.h + "px";
      ctx.setTransform(s.dpr, 0, 0, s.dpr, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize, { passive: true });
    return { ...s, resize };
  }

  const emb = setupCanvas("embers");
  const runes = setupCanvas("runes");

  function rand(a, b) { return a + Math.random() * (b - a); }

  // ---------------------------
  // EMBERS (brighter, slow rising)
  // ---------------------------
  const EMBER_COUNT = 150;
  const embers = Array.from({ length: EMBER_COUNT }, () => ({
    x: rand(0, emb ? emb.w : 1000),
    y: rand(0, emb ? emb.h : 1000),
    r: rand(0.9, 2.8),
    vy: rand(0.10, 0.45),
    vx: rand(-0.09, 0.09),
    life: rand(0.35, 1.0),
    tw: rand(0, Math.PI * 2)
  }));

  function resetEmber(p) {
    if (!emb) return;
    p.x = rand(0, emb.w);
    p.y = emb.h + rand(10, 120);
    p.r = rand(0.9, 2.8);
    p.vy = rand(0.10, 0.45);
    p.vx = rand(-0.09, 0.09);
    p.life = rand(0.35, 1.0);
    p.tw = rand(0, Math.PI * 2);
  }

  function drawEmbers(t) {
    if (!emb) return;
    const ctx = emb.ctx;
    ctx.clearRect(0, 0, emb.w, emb.h);
    ctx.globalCompositeOperation = "lighter";

    for (const p of embers) {
      p.y -= p.vy;
      p.x += p.vx + Math.sin(t * 0.001 + p.tw) * 0.06;
      p.life -= 0.0007 + p.vy * 0.00030;

      if (p.y < -50 || p.life <= 0) resetEmber(p);

      const twinkle = 0.70 + 0.40 * Math.sin(t * 0.0022 + p.tw);
      const a = Math.max(0, Math.min(1, p.life)) * twinkle;

      const coreA = a * 0.85;   // brighter
      const haloA = a * 0.34;

      // core
      ctx.beginPath();
      ctx.fillStyle = `rgba(198,121,83,${coreA})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();

      // halo
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,170,115,${haloA})`;
      ctx.arc(p.x, p.y, p.r * 3.8, 0, Math.PI * 2);
      ctx.fill();

      // tiny hot spark
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,235,210,${a * 0.12})`;
      ctx.arc(p.x + 0.4, p.y - 0.4, Math.max(0.6, p.r * 0.55), 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalCompositeOperation = "source-over";
  }

  // ---------------------------
  // PROTECTIVE RUNES (wrap PANEL)
  // ---------------------------
  const RUNES = ["ᛉ","ᛟ","ᛇ","ᛏ","ᚦ","ᛒ","ᛞ","ᚱ","ᛜ","ᚺ","ᛁ","ᛊ"];

  function getPanelRect() {
    const panel = document.querySelector(".panel");
    if (!panel) return null;
    const r = panel.getBoundingClientRect();

    const x = Math.max(0, r.left);
    const y = Math.max(0, r.top);
    const right = Math.min(window.innerWidth, r.right);
    const bottom = Math.min(window.innerHeight, r.bottom);
    const w = Math.max(0, right - x);
    const h = Math.max(0, bottom - y);
    if (w < 60 || h < 60) return null;
    return { x, y, w, h, right, bottom };
  }

  function strokeRoundRect(ctx, x, y, w, h, r) {
    const rr = Math.max(0, Math.min(r, Math.min(w, h) / 2));
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
    ctx.stroke();
  }

  function drawRunes(t) {
    if (!runes) return;
    const ctx = runes.ctx;
    ctx.clearRect(0, 0, runes.w, runes.h);

    const pr = getPanelRect();
    if (!pr) return;

    // Wrap the visible panel area
    const pad = 14;
    const inset = 8;

    const left = pr.x - pad;
    const top = pr.y - pad;
    const right = pr.right + pad;
    const bottom = pr.bottom + pad;

    const pulse = 0.35 + 0.35 * (0.5 + 0.5 * Math.sin(t * 0.00026));
    const glow  = 0.18 + 0.22 * (0.5 + 0.5 * Math.sin(t * 0.00018 + 1.7));

    ctx.globalCompositeOperation = "lighter";
    ctx.lineWidth = 1;

    // frame lines
    ctx.strokeStyle = `rgba(198,121,83,${0.22 + glow})`;
    strokeRoundRect(ctx, left, top, right - left, bottom - top, 22);

    ctx.strokeStyle = `rgba(198,121,83,${0.10 + glow * 0.7})`;
    strokeRoundRect(
      ctx,
      left + inset,
      top + inset,
      (right - left) - inset * 2,
      (bottom - top) - inset * 2,
      18
    );

    // runes
    ctx.font = "16px ui-serif, Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const spanW = right - left;
    const spanH = bottom - top;
    const step = Math.max(44, Math.min(78, Math.floor(spanW / 16)));

    function drawRune(x, y, rot, idx) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);

      ctx.fillStyle = `rgba(198,121,83,${0.12 + glow})`;
      ctx.shadowColor = `rgba(198,121,83,${0.55 * pulse})`;
      ctx.shadowBlur = 14 + 22 * pulse;

      const r = RUNES[idx % RUNES.length];
      ctx.fillText(r, 0, 0);

      ctx.shadowBlur = 0;
      ctx.fillStyle = `rgba(246,226,204,${0.08 + glow * 0.55})`;
      ctx.fillText(r, 0, 0);

      ctx.restore();
    }

    let idx = 0;

    // top
    for (let x = left + step; x <= right - step; x += step) {
      drawRune(x, top + 10, 0, idx++);
    }
    // bottom
    for (let x = left + step; x <= right - step; x += step) {
      drawRune(x, bottom - 10, Math.PI, idx++);
    }
    // left
    for (let y = top + step; y <= bottom - step; y += step) {
      drawRune(left + 10, y, -Math.PI / 2, idx++);
    }
    // right
    for (let y = top + step; y <= bottom - step; y += step) {
      drawRune(right - 10, y, Math.PI / 2, idx++);
    }

    // corner seals
    function cornerSeal(x, y) {
      ctx.save();
      ctx.translate(x, y);

      ctx.strokeStyle = `rgba(198,121,83,${0.14 + glow})`;
      ctx.lineWidth = 1;

      ctx.shadowColor = `rgba(198,121,83,${0.6 * pulse})`;
      ctx.shadowBlur = 18 + 26 * pulse;

      ctx.beginPath(); ctx.arc(0,0, 14, 0, Math.PI*2); ctx.stroke();
      ctx.beginPath(); ctx.arc(0,0, 22, 0, Math.PI*2); ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.strokeStyle = `rgba(198,121,83,${0.10 + glow * 0.5})`;
      ctx.beginPath(); ctx.arc(0,0, 30, 0, Math.PI*2); ctx.stroke();

      ctx.restore();
    }

    cornerSeal(left + 14, top + 14);
    cornerSeal(right - 14, top + 14);
    cornerSeal(left + 14, bottom - 14);
    cornerSeal(right - 14, bottom - 14);

    ctx.globalCompositeOperation = "source-over";
  }

  // ---------------------------
  // Animation loop
  // ---------------------------
  function tick(t) {
    drawEmbers(t);
    drawRunes(t);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

})();