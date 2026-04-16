(() => {
  "use strict";

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
  // EMBERS
  // ---------------------------
  const EMBER_COUNT = 160;
  const embers = Array.from({ length: EMBER_COUNT }, () => ({
    x: rand(0, emb ? emb.w : 1000),
    y: rand(0, emb ? emb.h : 1000),
    r: rand(0.9, 3.0),
    vy: rand(0.10, 0.48),
    vx: rand(-0.10, 0.10),
    life: rand(0.35, 1.0),
    tw: rand(0, Math.PI * 2)
  }));

  function resetEmber(p) {
    if (!emb) return;
    p.x = rand(0, emb.w);
    p.y = emb.h + rand(10, 140);
    p.r = rand(0.9, 3.0);
    p.vy = rand(0.10, 0.48);
    p.vx = rand(-0.10, 0.10);
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
      p.x += p.vx + Math.sin(t * 0.001 + p.tw) * 0.07;
      p.life -= 0.0007 + p.vy * 0.00028;

      if (p.y < -60 || p.life <= 0) resetEmber(p);

      const twinkle = 0.70 + 0.42 * Math.sin(t * 0.0024 + p.tw);
      const a = Math.max(0, Math.min(1, p.life)) * twinkle;

      const coreA = a * 0.95;
      const haloA = a * 0.40;

      ctx.beginPath();
      ctx.fillStyle = `rgba(198,121,83,${coreA})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = `rgba(255,170,115,${haloA})`;
      ctx.arc(p.x, p.y, p.r * 4.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = `rgba(255,235,210,${a * 0.14})`;
      ctx.arc(p.x + 0.5, p.y - 0.5, Math.max(0.6, p.r * 0.55), 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalCompositeOperation = "source-over";
  }

  // ---------------------------
  // PROTECTIVE RUNES
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
    if (w < 80 || h < 80) return null;
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

    const VIEW_MARGIN = 18;
    const pad = 26;
    const inset = 10;

    let left = pr.x - pad;
    let top = pr.y - pad;
    let right = pr.right + pad;
    let bottom = pr.bottom + pad;

    left = Math.max(VIEW_MARGIN, left);
    top = Math.max(VIEW_MARGIN, top);
    right = Math.min(window.innerWidth - VIEW_MARGIN, right);
    bottom = Math.min(window.innerHeight - VIEW_MARGIN, bottom);

    const spanW = right - left;
    const spanH = bottom - top;
    if (spanW < 120 || spanH < 120) return;

    const pulse = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(t * 0.00030));
    const glow  = 0.35 + 0.40 * (0.5 + 0.5 * Math.sin(t * 0.00022 + 1.4));

    ctx.globalCompositeOperation = "lighter";
    ctx.lineWidth = 1;

    ctx.strokeStyle = `rgba(198,121,83,${0.40 + glow})`;
    strokeRoundRect(ctx, left, top, spanW, spanH, 22);

    ctx.strokeStyle = `rgba(198,121,83,${0.18 + glow * 0.9})`;
    strokeRoundRect(ctx, left + inset, top + inset, spanW - inset * 2, spanH - inset * 2, 18);

    ctx.font = "16px ui-serif, Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const step = Math.max(44, Math.min(78, Math.floor(spanW / 16)));

    function drawRune(x, y, rot, idx) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);

      const r = RUNES[idx % RUNES.length];

      ctx.shadowColor = `rgba(198,121,83,${0.90 * pulse})`;
      ctx.shadowBlur = 18 + 28 * pulse;

      ctx.fillStyle = `rgba(198,121,83,${0.26 + glow})`;
      ctx.fillText(r, 0, 0);

      ctx.shadowBlur = 0;
      ctx.fillStyle = `rgba(246,226,204,${0.14 + glow * 0.65})`;
      ctx.fillText(r, 0, 0);

      ctx.restore();
    }

    let idx = 0;

    for (let x = left + step; x <= right - step; x += step) drawRune(x, top + 12, 0, idx++);
    for (let x = left + step; x <= right - step; x += step) drawRune(x, bottom - 12, Math.PI, idx++);
    for (let y = top + step; y <= bottom - step; y += step) drawRune(left + 12, y, -Math.PI / 2, idx++);
    for (let y = top + step; y <= bottom - step; y += step) drawRune(right - 12, y, Math.PI / 2, idx++);

    function cornerSeal(x, y) {
      ctx.save();
      ctx.translate(x, y);

      ctx.lineWidth = 1;
      ctx.shadowColor = `rgba(198,121,83,${0.95 * pulse})`;
      ctx.shadowBlur = 22 + 34 * pulse;

      ctx.strokeStyle = `rgba(198,121,83,${0.32 + glow})`;
      ctx.beginPath(); ctx.arc(0,0, 14, 0, Math.PI*2); ctx.stroke();
      ctx.beginPath(); ctx.arc(0,0, 22, 0, Math.PI*2); ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.strokeStyle = `rgba(246,226,204,${0.12 + glow * 0.55})`;
      ctx.beginPath(); ctx.arc(0,0, 30, 0, Math.PI*2); ctx.stroke();

      ctx.restore();
    }

    cornerSeal(left + 16, top + 16);
    cornerSeal(right - 16, top + 16);
    cornerSeal(left + 16, bottom - 16);
    cornerSeal(right - 16, bottom - 16);

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