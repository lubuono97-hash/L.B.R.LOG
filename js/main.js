// =====================================================
// L.B.R.LOG — main.js
// Home: destaques, ordenação, busca, filtros, view toggle
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
  const grid         = document.getElementById('games-grid');
  const countEl      = document.getElementById('games-count');
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const sortBtns     = document.querySelectorAll('.sort-btn');
  const viewBtns     = document.querySelectorAll('.view-btn');
  const searchInput  = document.getElementById('search-input');
  const searchClear  = document.getElementById('search-clear');
  const destaquesGrid= document.getElementById('destaques-grid');

  let activeFilter = 'todos';
  let activeSort   = 'az';
  let activeView   = 'grid';
  let searchQuery  = '';

  // ---- Cor da badge por nota ----
  function scoreClass(nota) {
    if (nota >= 9.0) return 'score-gold';
    if (nota >= 7.0) return 'score-red';
    return 'score-grey';
  }

  // ---- Renderiza destaques ----
  function renderDestaques() {
    if (!destaquesGrid) return;
    const featured = GAMES.filter(g => g.destaque);
    if (featured.length === 0) {
      document.getElementById('destaques-section').style.display = 'none';
      return;
    }
    destaquesGrid.innerHTML = featured.map(game => `
      <a href="game.html?id=${game.id}" class="destaque-card">
        <div class="destaque-cover-wrap">
          <img class="destaque-cover-img" src="${game.capa}" alt="${game.titulo}"
            onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />
          <div class="destaque-cover-ph">
            <span style="font-size:2rem;opacity:.2;">🎮</span>
          </div>
          <div class="destaque-overlay"></div>
          <span class="destaque-score ${scoreClass(game.nota)}">${game.nota.toFixed(1)}</span>
        </div>
        <div class="destaque-body">
          <div class="destaque-title">${game.titulo}</div>
          <div class="destaque-resumo">${game.resumo}</div>
          <div class="destaque-footer">
            <span class="destaque-meta">${game.desenvolvedora} · ${game.ano}</span>
            <span class="card-arrow">→</span>
          </div>
        </div>
      </a>
    `).join('');
  }

  // ---- Pipeline: filtro + busca + ordenação ----
  function getVisibleGames() {
    let list = [...GAMES];

    if (activeFilter !== 'todos') {
      list = list.filter(g =>
        g.genero.some(gen => gen.toLowerCase().includes(activeFilter)) ||
        g.plataforma.some(p => p.toLowerCase().includes(activeFilter))
      );
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(g =>
        g.titulo.toLowerCase().includes(q)         ||
        g.desenvolvedora.toLowerCase().includes(q) ||
        g.genero.some(gen => gen.toLowerCase().includes(q)) ||
        g.plataforma.some(p => p.toLowerCase().includes(q)) ||
        String(g.ano).includes(q)
      );
    }

    if (activeSort === 'az')      list.sort((a, b) => a.titulo.localeCompare(b.titulo, 'pt-BR'));
    if (activeSort === 'nota')    list.sort((a, b) => b.nota - a.nota);
    if (activeSort === 'recente') list.sort((a, b) => b.ano  - a.ano);

    return list;
  }

  // ---- Highlight ----
  function highlight(text) {
    if (!searchQuery) return text;
    const q  = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp('(' + q + ')', 'gi');
    return text.replace(re, '<mark class="search-highlight">$1</mark>');
  }

  // ---- Renderiza cards (grid ou lista) ----
  function renderGames() {
    const list = getVisibleGames();
    if (countEl) countEl.textContent = list.length;

    if (list.length === 0) {
      grid.innerHTML = '<div class="no-results">// nenhum resultado encontrado</div>';
      return;
    }

    grid.className = 'games-grid' + (activeView === 'list' ? ' games-list' : '');

    grid.innerHTML = list.map((game, i) => {
      const sc = scoreClass(game.nota);
      const platforms = game.plataforma.slice(0, 3)
        .map(p => '<span class="platform-chip">' + p + '</span>').join('');

      if (activeView === 'list') {
        return '<a href="game.html?id=' + game.id + '" class="game-list-row" style="animation-delay:' + (i * 0.04) + 's">'
          + '<div class="list-row-cover">'
          + '<img src="' + game.capa + '" alt="" loading="lazy" onerror="this.style.display=\'none\'">'
          + '</div>'
          + '<div class="list-row-info">'
          + '<div class="list-row-title">' + highlight(game.titulo) + '</div>'
          + '<div class="list-row-meta">' + game.desenvolvedora + ' · ' + game.ano + ' · ' + game.genero[0] + '</div>'
          + '<div class="list-row-resumo">' + game.resumo + '</div>'
          + '</div>'
          + '<div class="list-row-score ' + sc + '">' + game.nota.toFixed(1) + '</div>'
          + '<span class="card-arrow">→</span>'
          + '</a>';
      }

      return '<a href="game.html?id=' + game.id + '" class="game-card" style="animation-delay:' + (i * 0.06) + 's">'
        + '<div class="card-cover-wrap">'
        + '<img class="card-cover-img" src="' + game.capa + '" alt="Capa de ' + game.titulo + '" loading="lazy"'
        + ' onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\';" />'
        + '<div class="card-cover-placeholder">'
        + '<div class="deco-corner tl"></div><div class="deco-corner tr"></div>'
        + '<div class="deco-corner bl"></div><div class="deco-corner br"></div>'
        + '<span class="placeholder-icon">🎮</span>'
        + '<span class="placeholder-title">' + game.titulo + '</span>'
        + '</div>'
        + '<span class="card-score-badge ' + sc + '">' + game.nota.toFixed(1) + '</span>'
        + '</div>'
        + '<div class="card-body">'
        + '<div class="card-platforms">' + platforms + '</div>'
        + '<div class="card-title">' + highlight(game.titulo) + '</div>'
        + '<div class="card-meta">' + game.desenvolvedora + ' · ' + game.ano + '</div>'
        + '</div>'
        + '<div class="card-footer">'
        + '<span class="card-genre">' + game.genero[0] + '</span>'
        + '<span class="card-arrow">→</span>'
        + '</div>'
        + '</a>';
    }).join('');
  }

  // ---- Eventos ----
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      renderGames();
    });
  });

  sortBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sortBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeSort = btn.dataset.sort;
      renderGames();
    });
  });

  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      viewBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeView = btn.dataset.view;
      renderGames();
    });
  });

  searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value.trim();
    searchClear.style.display = searchQuery ? 'flex' : 'none';
    renderGames();
  });

  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    searchClear.style.display = 'none';
    searchInput.focus();
    renderGames();
  });

  renderDestaques();
  renderGames();
});
