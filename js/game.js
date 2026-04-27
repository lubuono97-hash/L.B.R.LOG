// =====================================================
// L.B.R.LOG — game.js
// Página de análise individual + prev/next + OG tags
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const gameId = params.get('id');

  if (!gameId) { window.location.href = 'index.html'; return; }

  // Jogos em ordem A-Z (mesma ordem da home por padrão)
  const sorted = [...GAMES].sort((a, b) => a.titulo.localeCompare(b.titulo, 'pt-BR'));
  const idx    = sorted.findIndex(g => g.id === gameId);
  const game   = sorted[idx];

  if (!game) {
    document.querySelector('.game-main-content').innerHTML = `
      <div style="padding:4rem;text-align:center;font-family:var(--font-mono);color:var(--grey);letter-spacing:.2em;font-size:.85rem;">
        // ERRO: jogo não encontrado<br><br>
        <a href="index.html" style="color:var(--red);">← voltar ao início</a>
      </div>`;
    return;
  }

  // ---- Título e OG tags ----
  document.title = game.titulo + ' — L.B.R.LOG';
  setMeta('og-title',       game.titulo + ' — L.B.R.LOG');
  setMeta('og-description', game.resumo);
  setMeta('og-image',       game.capa);

  // ---- Hero de fundo ----
  const heroBg = document.getElementById('hero-bg');
  const heroPh = document.getElementById('hero-bg-ph');
  if (heroBg) {
    heroBg.src = game.capa;
    heroBg.alt = game.titulo;
    heroBg.onerror = () => {
      heroBg.style.display = 'none';
      if (heroPh) heroPh.style.display = 'block';
    };
  }

  // ---- Capa sidebar ----
  const coverImg = document.getElementById('cover-img');
  const coverPh  = document.getElementById('cover-ph');
  if (coverImg) {
    coverImg.src = game.capa;
    coverImg.alt = game.titulo;
    coverImg.onerror = () => {
      coverImg.style.display = 'none';
      if (coverPh) coverPh.style.display = 'flex';
    };
  }

  // ---- Score com cor ----
  const scoreEl = document.getElementById('score');
  if (scoreEl) {
    scoreEl.textContent = game.nota.toFixed(1);
    if (game.nota >= 9.0) scoreEl.classList.add('score-gold-big');
    else if (game.nota < 7.0) scoreEl.classList.add('score-grey-big');
    // nota >= 10 already handled by 'perfect' class kept for backwards compat
    if (game.nota === 10.0) scoreEl.classList.add('perfect');
  }

  // ---- Metadados ----
  setText('meta-dev',       game.desenvolvedora);
  setText('meta-year',      game.ano);
  setText('meta-platforms', game.plataforma.join(', '));
  setText('meta-genre',     game.genero.join(', '));

  // ---- Conteúdo ----
  setText('game-title',   game.titulo);
  setText('game-dev',     game.desenvolvedora + ' · ' + game.ano);
  setText('game-summary', game.resumo);
  setHTML('game-analise', game.analise);

  // ---- Tags de gênero ----
  const tagsEl = document.getElementById('genre-tags');
  if (tagsEl) {
    tagsEl.innerHTML = game.genero
      .map(g => '<span class="genre-tag">' + g + '</span>').join('');
  }

  // ---- Navegação prev/next ----
  const prevGame = idx > 0 ? sorted[idx - 1] : sorted[sorted.length - 1];
  const nextGame = idx < sorted.length - 1 ? sorted[idx + 1] : sorted[0];

  const navPrev = document.getElementById('nav-prev');
  const navNext = document.getElementById('nav-next');

  if (navPrev) {
    navPrev.href = 'game.html?id=' + prevGame.id;
    document.getElementById('nav-prev-title').textContent = prevGame.titulo;
  }
  if (navNext) {
    navNext.href = 'game.html?id=' + nextGame.id;
    document.getElementById('nav-next-title').textContent = nextGame.titulo;
  }

  // ---- Helpers ----
  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }
  function setHTML(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }
  function setMeta(id, val) {
    const el = document.getElementById(id);
    if (el) el.setAttribute('content', val);
  }
});
