(() => {
  const canvas = document.getElementById("embers");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let W = 0, H = 0, dpr = 1;
  const embers = [];
  const MAX = 48; // subtle

  function resize(){
    dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    W = Math.floor(window.innerWidth);
    H = Math.floor(window.innerHeight);
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function rand(a,b){ return a + Math.random()*(b-a); }

  function seed(){
    embers.length = 0;
    for(let i=0;i<MAX;i++){
      embers.push({
        x: rand(0, W),
        y: rand(0, H),
        r: rand(0.7, 1.8),
        vy: rand(-0.35, -0.08),
        vx: rand(-0.08, 0.08),
        a: rand(0.06, 0.14),
        tw: rand(0.003, 0.012),
        t: rand(0, 1000)
      });
    }
  }

  function draw(){
    ctx.clearRect(0,0,W,H);

    // Very subtle overall glow haze, not behind text (still safe)
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = 0.05;
    const g = ctx.createRadialGradient(W*0.5, H*0.35, 0, W*0.5, H*0.35, Math.max(W,H)*0.55);
    g.addColorStop(0, "rgba(230,170,90,0.22)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0,0,W,H);
    ctx.restore();

    // Embers
    for(const e of embers){
      e.t += 1;
      e.x += e.vx;
      e.y += e.vy;

      // gentle drift wrap
      if(e.y < -20) { e.y = H + 20; e.x = rand(0,W); }
      if(e.x < -20) e.x = W + 20;
      if(e.x > W + 20) e.x = -20;

      const pulse = 0.7 + 0.3*Math.sin(e.t * e.tw);
      ctx.beginPath();
      ctx.globalAlpha = e.a * pulse;
      ctx.fillStyle = "rgba(235,170,95,1)";
      ctx.arc(e.x, e.y, e.r * pulse, 0, Math.PI*2);
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", () => { resize(); seed(); });
  resize();
  seed();
  draw();
})();
