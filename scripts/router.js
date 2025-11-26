(function(){
  const routes = {
    '/': 'views/home.html',
    '/acervo': 'views/acervo.html',
    '/periodicos': 'views/periodicos.html',
    '/renovacao': 'views/renovacao.html',
    '/emprestimos': 'views/emprestimos.html',
    '/historico': 'views/historico.html',
    '/games': 'views/games.html',
    '/admin': 'views/admin.html',
    '/buscar': 'views/search.html'
  };

  async function load(url){
    const app = document.getElementById('app');
    try{
      const res = await fetch(url, { cache: 'no-store' });
      const html = await res.text();
      app.innerHTML = html;
      // carregar scripts por rota
      if(url.includes('acervo')){ ensureScript('scripts/script.js'); ensureScript('scripts/acervo.js'); }
      else if(url.includes('periodicos')){ ensureScript('scripts/periodicos.js'); }
      else if(url.includes('renovacao')){ ensureScript('scripts/loanStore.js'); ensureScript('scripts/renovacao.js'); }
      else if(url.includes('emprestimos')){ ensureScript('scripts/loanStore.js'); ensureScript('scripts/emprestimos.js'); }
      else if(url.includes('historico')){ ensureScript('scripts/historico.js'); }
      else if(url.includes('games')){ ensureScript('scripts/loanStore.js'); ensureScript('scripts/games.js'); }
      else if(url.includes('search')){ ensureScript('scripts/searchView.js'); }
      else if(url.includes('admin')){ ensureScript('scripts/admin.js'); }
      else { ensureScript('scripts/script.js'); }
    }catch(e){ app.innerHTML = '<div class="muted">Falha ao carregar a view.</div>'; }
  }

  function ensureScript(src){
    if([...document.scripts].some(s=> s.src.endsWith(src))) return;
    const tag = document.createElement('script');
    tag.src = src; document.body.appendChild(tag);
  }

  function updateActive(path){
    document.querySelectorAll('.nav a').forEach(a=>{
      const p = a.getAttribute('data-path');
      if(p){ a.classList.toggle('active', p===path); }
    });
  }

  function navigate(path){
    const url = routes[path] || routes['/'];
    history.pushState({ path }, '', '#'+path);
    updateActive(path);
    load(url);
  }

  function onLinkClick(e){
    const path = e.target.getAttribute('data-path');
    if(path){ e.preventDefault(); navigate(path); }
  }

  function init(){
    // Guard de auth
    if(window.Auth){ Auth.requireAuth(); }
    // Bind nav
    document.querySelectorAll('.nav a').forEach(a=> a.addEventListener('click', onLinkClick));
    // Initial route
    const hash = location.hash.replace('#','') || '/';
    updateActive(hash);
    load(routes[hash] || routes['/']);
    window.addEventListener('popstate', () => {
      const h = location.hash.replace('#','') || '/';
      updateActive(h);
      load(routes[h] || routes['/']);
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
