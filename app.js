(() => {
  "use strict";

  // ---------------------------
  // SAFE HELPERS
  // ---------------------------
  const $ = (id) => document.getElementById(id);

  function setText(id, value) {
    const el = $(id);
    if (el) el.textContent = value;
  }

  // ---------------------------
  // BUILD META (SAFE)
  // ---------------------------
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  setText("buildMeta", `BUILD: ${yyyy}-${mm}-${dd}`);

  // ---------------------------
  // MENU DATA
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
  // RENDER MENU (NO CRASH)
  // ---------------------------
  const menuEl = $("menu");
  if (!menuEl) throw new Error('Missing #menu container in HTML');

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function renderMenu() {
    menuEl.innerHTML = "";
    for (const section of MENU) {
      const s = el("div", "section");
      const h = el("h2", "sectionTitle", section.title);
      s.appendChild(h);

      for (const it of section.items) {
        const row = el("div", "item");

        const left = el("div", "left");
        left.appendChild(el("div", "name", it.name));
        if (it.desc) left.appendChild(el("div", "desc", it.desc));

        row.appendChild(left);
        row.appendChild(el("div", "price", it.price || ""));

        s.appendChild(row);
      }

      menuEl.appendChild(s);
    }
  }

  // Render immediately
  renderMenu();

  // ---------------------------
  // CANVAS SETUP (RESIZE SAFE)
  // ---------------------------
  function setupCanvas(id) {
    const canvas = $(id);
    if (!canvas) return null;

    const ctx = canvas.getContext("2d", { alpha: true });
    const s = { canvas, ctx, w: 0, h: 0, dpr: 1 };

    s.resize = () => {
      s.dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      s.w = Math.floor(window.innerWidth);
      s.h = Math.floor(window.innerHeight);
      canvas.width = Math.floor(s.w * s.dpr);
      canvas.height = Math.floor(s.h * s.dpr);
      canvas.style.width = s.w + "px";
      canvas.style.height = s.h + "px";
      ctx.setTransform(s.dpr, 0, 0, s.dpr, 0, 0);
    };

    s.resize();
    window.addEventListener("resize", s.resize, { passive: true });
    return s;
  }

  const emb = setupCanvas("embers");
  const runes = setupCanvas("runes");

  function rand(a, b) { return a + Math.random() * (b - a); }

  // roundRect fallback
  function strokeRoundRect(ctx, x, y, w, h, r) {
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
      ctx.stroke();
      return;
    }
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.lineTo(x + w - rr, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
    ctx.lineTo(x + w, y + h - rr);
    ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
    ctx.lineTo(x + rr, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
    ctx.lineTo(x, y + rr);
    ctx.quadraticCurveTo(x, y, x + rr, y);
    ctx.closePath();
    ctx.stroke();
  }

  // ---------------------------
  // EMBERS
  // ---------------------------
  const EMBER_COUNT = 140;
  const embers = emb ? Array.from({ length: EMBER_COUNT }, () => ({
    x: rand(0, emb.w),
    y: rand(0, emb.h),
    r: rand(0.8, 2.6),
    vy: rand(0.10, 0.42),
    vx: rand(-0.08, 0.08),
    life: rand(0.35, 1.0),
    tw: rand(0, Math.PI * 2)
  })) : [];

  function resetEmber(p) {
    p.x = rand(0, emb.w);
    p.y = emb.h + rand(10, 80);
    p.r = rand(0.8, 2.6);
    p.vy = rand(0.10, 0.42);
    p.vx = rand(-0.08, 0.08);
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
      p.x += p.vx + Math.sin(t * 0.001 + p.tw) * 0.05;
      p.life -= 0.0008 + p.vy * 0.00035;

      if (p.y < -30 || p.life <= 0) resetEmber(p);

      const twinkle = 0.65 + 0.35 * Math.sin(t * 0.002 + p.tw);
      const a = Math.max(0, Math.min(1, p.life)) * twinkle * 0.55;

      ctx.beginPath();
      ctx.fillStyle = `rgba(198,121,83,${a})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = `rgba(198,121,83,${a * 0.25})`;
      ctx.arc(p.x, p.y, p.r * 3.0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalCompositeOperation = "source-over";
  }

  // ---------------------------
  // PROTECTIVE RUNES
  // ---------------------------
  const RUNES = ["ᛉ","ᛟ","ᛇ","ᛏ","ᚦ","ᛒ","ᛞ","ᚱ","ᛜ","ᚺ","ᛁ","ᛊ"];

  function drawRunes(t) {
    if (!runes) return;
    const ctx = runes.ctx;
    ctx.clearRect(0, 0, runes.w, runes.h);

    const pad = Math.max(16, Math.min(28, Math.floor(runes.w * 0.02)));
    const left = pad, top = pad, right = runes.w - pad, bottom = runes.h - pad;

    const pulse = 0.35 + 0.35 * (0.5 + 0.5 * Math.sin(t * 0.00026));
    const glow = 0.18 + 0.22 * (0.5 + 0.5 * Math.sin(t * 0.00018 + 1.7));

    ctx.globalCompositeOperation = "lighter";
    ctx.lineWidth = 1;

    ctx.strokeStyle = `rgba(198,121,83,${0.22 + glow})`;
    strokeRoundRect(ctx, left, top, right - left, bottom - top, 22);

    ctx.strokeStyle = `rgba(198,121,83,${0.08 + glow * 0.6})`;
    strokeRoundRect(ctx, left + 6, top + 6, (right - left) - 12, (bottom - top) - 12, 18);

    ctx.font = "16px ui-serif, Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const step = Math.max(42, Math.min(76, Math.floor(runes.w / 18)));

    function drawRune(x, y, rot, idx) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);

      ctx.fillStyle = `rgba(198,121,83,${0.10 + glow})`;
      ctx.shadowColor = `rgba(198,121,83,${0.45 * pulse})`;
      ctx.shadowBlur = 10 + 18 * pulse;
      const r = RUNES[idx % RUNES.length];
      ctx.fillText(r, 0, 0);

      ctx.shadowBlur = 0;
      ctx.fillStyle = `rgba(246,226,204,${0.06 + glow * 0.45})`;
      ctx.fillText(r, 0, 0);

      ctx.restore();
    }

    let idx = 0;
    for (let x = left + step; x <= right - step; x += step) drawRune(x, top + 10, 0, idx++);
    for (let x = left + step; x <= right - step; x += step) drawRune(x, bottom - 10, Math.PI, idx++);
    for (let y = top + step; y <= bottom - step; y += step) drawRune(left + 10, y, -Math.PI / 2, idx++);
    for (let y = top + step; y <= bottom - step; y += step) drawRune(right - 10, y, Math.PI / 2, idx++);

    function cornerSeal(x, y) {
      ctx.save();
      ctx.translate(x, y);

      const ringA = 0.10 + glow * 0.9;
      ctx.strokeStyle = `rgba(198,121,83,${ringA})`;
      ctx.lineWidth = 1;

      ctx.shadowColor = `rgba(198,121,83,${0.55 * pulse})`;
      ctx.shadowBlur = 16 + 22 * pulse;

      ctx.beginPath(); ctx.arc(0,0, 14, 0, Math.PI*2); ctx.stroke();
      ctx.beginPath(); ctx.arc(0,0, 22, 0, Math.PI*2); ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.strokeStyle = `rgba(198,121,83,${0.08 + glow * 0.45})`;
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
  // LOOP
  // ---------------------------
  function tick(t) {
    drawEmbers(t);
    drawRunes(t);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();