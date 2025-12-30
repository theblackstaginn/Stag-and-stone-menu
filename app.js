(() => {
  "use strict";

  // ---------- MENU DATA (keeps your items, adds realistic beverage prices) ----------
  // Note: if you want EVERY beverage $14 again, tell me and I’ll flip one constant.
  const MENU = [
    {
      title: "House Coffees",
      items: [
        { name: "Stag’s Dark Roast (drip)", price: "$4" },
        { name: "Dawnwood Medium Roast (drip)", price: "$4" }
      ]
    },
    {
      title: "Espresso Classics",
      items: [
        { name: "Espresso", price: "$3" },
        { name: "Americano", price: "$4" },
        { name: "Cappuccino", price: "$5" },
        { name: "Latte", price: "$6" }
      ]
    },
    {
      title: "Featured Lattes",
      items: [
        { name: "Black Spell Mocha", desc: "Dark chocolate mocha", price: "$7" },
        { name: "Caramel Draught Latte", desc: "Caramel latte", price: "$7" }
      ]
    },
    {
      title: "Signature Coffeehouse",
      items: [
        { name: "Stag King Brew", desc: "Signature sweet-cream coffee", price: "$7" },
        { name: "Dragonfire Mocha", desc: "Spiced mocha", price: "$7" },
        { name: "Siren Salted Cold Foam", desc: "Cold foam topper — add-on", price: "+$1" }
      ]
    },
    {
      title: "Iced Coffeehouse",
      items: [
        { name: "Iced Espresso Classic", desc: "Any espresso classic available iced", price: "+$0" }
      ]
    },
    {
      title: "Teas & Herbals",
      items: [
        { name: "Orchard Chai", desc: "Chai", price: "$4" },
        { name: "Forest Mint", desc: "Mint herbal", price: "$4" },
        { name: "Lavender Fields", desc: "Lavender herbal", price: "$4" },
        { name: "Siren Blue", desc: "Butterfly pea herbal", price: "$4" }
      ]
    },
    {
      title: "Matcha",
      items: [
        { name: "Matcha Green Elixir", desc: "Matcha latte", price: "$6" }
      ]
    },
    {
      title: "Iced & Refreshers",
      items: [
        { name: "Iced Chai", price: "$5" },
        { name: "Iced Matcha", price: "$6" },
        { name: "Stormborn Lemonade", price: "$5" },
        { name: "Witchlight Cooler", desc: "Seasonal refresher", price: "$6" }
      ]
    },
    {
      title: "Sandwiches",
      items: [
        { name: "The Stag Melt", desc: "Tavern ham, bacon, egg & melted cheese with thyme and parsley on house sourdough", price: "$14" },
        { name: "Turkey, Brie & Cranberry", desc: "Roasted turkey, brie, and cranberry on house sourdough", price: "$13" },
        { name: "Wildwood Melt (limited)", desc: "Chanterelle, beech, maitake, and cremini mushrooms with bacon jam, thyme and parsley on house sourdough", price: "$15" },
        { name: "Tavern Ham & Grilled Cheese", desc: "Tavern ham and melted cheese on house sourdough", price: "$11" }
      ]
    },
    {
      title: "Pastries",
      items: [
        { name: "Fresh pastry (rotating)", price: "$5" },
        { name: "Savory hand pie or scone", price: "$6" },
        { name: "Biscotti or shortbread", price: "$4" }
      ]
    }
  ];

  // ---------- DOM INJECTION ----------
  function el(tag, className, text){
    const n = document.createElement(tag);
    if (className) n.className = className;
    if (text != null) n.textContent = text;
    return n;
  }

  function renderMenu(){
    const menu = document.getElementById("menu");
    menu.innerHTML = "";

    for (const sec of MENU){
      const section = el("section", "section");
      const h2 = el("h2", "", sec.title);
      section.appendChild(h2);

      for (const it of sec.items){
        const row = el("div", "item");

        const left = el("div", "left");
        const name = el("div", "name", it.name);
        left.appendChild(name);

        const price = el("div", "price", it.price || "");
        row.appendChild(left);
        row.appendChild(price);

        if (it.desc){
          const desc = el("div", "desc", it.desc);
          row.appendChild(desc);
        }

        section.appendChild(row);
      }

      menu.appendChild(section);
    }
  }

  function setBuildMeta(){
    const out = document.getElementById("buildMeta");
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth()+1).padStart(2,"0");
    const dd = String(d.getDate()).padStart(2,"0");
    out.textContent = `BUILD: ${yyyy}-${mm}-${dd} • SECTIONS: ${MENU.length}`;
  }

  // ---------- EMBERS + RUNES (CANVAS) ----------
  function fitCanvas(c){
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const w = Math.floor(window.innerWidth);
    const h = Math.floor(window.innerHeight);
    c.width = Math.floor(w * dpr);
    c.height = Math.floor(h * dpr);
    c.style.width = w + "px";
    c.style.height = h + "px";
    return { w, h, dpr };
  }

  function startEmbers(){
    const c = document.getElementById("embers");
    const ctx = c.getContext("2d", { alpha:true });
    let { w, h, dpr } = fitCanvas(c);

    const rand = (a,b)=> a + Math.random()*(b-a);

    // Particles
    const N = Math.round((w*h) / 45000); // density scales with screen
    const P = [];
    for (let i=0;i<N;i++){
      P.push({
        x: rand(0,w),
        y: rand(0,h),
        r: rand(0.6, 2.2),
        vy: rand(18, 55),
        vx: rand(-8, 8),
        life: rand(0.4, 1.0),
        hue: rand(18, 34), // ember orange
        a: rand(0.12, 0.35)
      });
    }

    function step(dt){
      ctx.setTransform(dpr,0,0,dpr,0,0);
      ctx.clearRect(0,0,w,h);

      // soft additive glow
      ctx.globalCompositeOperation = "lighter";

      for (const p of P){
        p.y -= (p.vy * dt);
        p.x += (p.vx * dt);

        // drift and fade as they rise
        p.life -= dt * 0.10;
        const alpha = Math.max(0, p.a * p.life);

        // wrap
        if (p.y < -20 || p.life <= 0){
          p.x = rand(0,w);
          p.y = h + rand(10, 140);
          p.r = rand(0.6, 2.2);
          p.vy = rand(18, 55);
          p.vx = rand(-8, 8);
          p.life = rand(0.45, 1.0);
          p.hue = rand(18, 34);
          p.a = rand(0.12, 0.35);
        }
        if (p.x < -30) p.x = w + 30;
        if (p.x > w + 30) p.x = -30;

        // draw
        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, 95%, 60%, ${alpha})`;
        ctx.shadowColor = `hsla(${p.hue}, 95%, 60%, ${alpha})`;
        ctx.shadowBlur = 10 + p.r*8;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
      ctx.shadowBlur = 0;
    }

    // RAF loop
    let last = performance.now();
    function loop(now){
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      step(dt);
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    // resize
    window.addEventListener("resize", () => {
      ({ w, h, dpr } = fitCanvas(c));
    }, { passive:true });
  }

  function startRunes(){
    const c = document.getElementById("runes");
    const ctx = c.getContext("2d", { alpha:true });
    let { w, h, dpr } = fitCanvas(c);

    // Simple rune glyph set (ASCII-safe)
    const glyphs = ["ᚠ","ᚢ","ᚦ","ᚨ","ᚱ","ᚲ","ᚷ","ᚹ","ᚺ","ᚾ","ᛁ","ᛃ","ᛇ","ᛈ","ᛉ","ᛋ","ᛏ","ᛒ","ᛖ","ᛗ","ᛚ","ᛜ","ᛞ","ᛟ"];

    const rand = (a,b)=> a + Math.random()*(b-a);
    const pick = (arr)=> arr[(Math.random()*arr.length)|0];

    // Place runes around edges (protection ring)
    const R = [];
    function seed(){
      R.length = 0;
      const pad = 28;
      const step = Math.max(42, Math.floor(Math.min(w,h)/16));
      // top + bottom
      for (let x=pad; x<=w-pad; x+=step){
        R.push({ x, y: pad, g: pick(glyphs), s: rand(14, 20), p: rand(0,Math.PI*2) });
        R.push({ x, y: h-pad, g: pick(glyphs), s: rand(14, 20), p: rand(0,Math.PI*2) });
      }
      // left + right
      for (let y=pad; y<=h-pad; y+=step){
        R.push({ x: pad, y, g: pick(glyphs), s: rand(14, 20), p: rand(0,Math.PI*2) });
        R.push({ x: w-pad, y, g: pick(glyphs), s: rand(14, 20), p: rand(0,Math.PI*2) });
      }
    }
    seed();

    let t = 0;
    function draw(dt){
      t += dt;
      ctx.setTransform(dpr,0,0,dpr,0,0);
      ctx.clearRect(0,0,w,h);

      // pulsing glow
      const pulse = 0.55 + 0.45*Math.sin(t*0.75);

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "18px Georgia";

      for (const r of R){
        const a = 0.10 + pulse*0.22;
        const glow = 8 + pulse*14;

        // faint copper-ish rune glow
        ctx.save();
        ctx.translate(r.x, r.y);
        ctx.rotate(Math.sin(t*0.22 + r.p) * 0.06);

        ctx.font = `${r.s}px Georgia`;
        ctx.fillStyle = `rgba(198,122,82,${a})`;
        ctx.shadowColor = `rgba(198,122,82,${a})`;
        ctx.shadowBlur = glow;
        ctx.fillText(r.g, 0, 0);
        ctx.restore();
      }

      // corner seals (slightly stronger)
      const corners = [
        [34,34],[w-34,34],[34,h-34],[w-34,h-34]
      ];
      for (const [x,y] of corners){
        ctx.beginPath();
        ctx.strokeStyle = `rgba(246,224,200,${0.10 + pulse*0.18})`;
        ctx.lineWidth = 1;
        ctx.shadowColor = `rgba(246,224,200,${0.10 + pulse*0.18})`;
        ctx.shadowBlur = 18 + pulse*18;
        ctx.arc(x,y, 18, 0, Math.PI*2);
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
    }

    let last = performance.now();
    function loop(now){
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      draw(dt);
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    window.addEventListener("resize", () => {
      ({ w, h, dpr } = fitCanvas(c));
      seed();
    }, { passive:true });
  }

  // ---------- INIT ----------
  document.addEventListener("DOMContentLoaded", () => {
    setBuildMeta();
    renderMenu();
    startEmbers();
    startRunes();
  });
})();