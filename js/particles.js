// =====================================================
// L.B.R.LOG — particles.js
// Partículas cyberpunk no fundo (pontos + linhas vermelhas sutis)
// =====================================================

(function () {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const RED = '204,0,26';
  const MAX_DIST = 140;
  const COUNT = 55;

  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function Particle() {
    this.x  = rand(0, W);
    this.y  = rand(0, H);
    this.vx = rand(-0.18, 0.18);
    this.vy = rand(-0.18, 0.18);
    this.r  = rand(0.8, 2.0);
    this.alpha = rand(0.25, 0.65);
  }

  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0) this.x = W;
    if (this.x > W) this.x = 0;
    if (this.y < 0) this.y = H;
    if (this.y > H) this.y = 0;
  };

  function init() {
    particles = Array.from({ length: COUNT }, () => new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Linhas entre partículas próximas
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const opacity = (1 - dist / MAX_DIST) * 0.12;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${RED},${opacity})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // Pontos
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${RED},${p.alpha})`;
      ctx.fill();
      p.update();
    });
  }

  function loop() {
    draw();
    requestAnimationFrame(loop);
  }

  resize();
  init();
  loop();

  window.addEventListener('resize', () => { resize(); init(); });
})();
