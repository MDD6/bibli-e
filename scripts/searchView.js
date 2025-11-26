(function(){
  if(!document.getElementById('searchPage')) return;
  const inp = document.getElementById('searchInput');
  const tipoSel = document.getElementById('searchTipo');
  const box = document.getElementById('searchResults');
  const stats = document.getElementById('searchStats');
  const exportBtn = document.getElementById('searchExport');

  // Recupera último termo salvo pelo overlay
  const lastTerm = localStorage.getItem('globalSearchLastTerm') || '';
  inp.value = lastTerm;

  function collect(){
    const items = [];
    if(window.booksData){ booksData.forEach(b=> items.push({ type:'Livro', title:b.title, author:b.author, meta:`${b.category} • ${b.century}` })); }
    const periodicosView = document.getElementById('periodicosPage');
    if(periodicosView){
      // If already on periodicos page loaded outside of SPA order, but generally not.
    }
    // Attempt fetch of periodicos view if not loaded – light lazy fetch for indexing
    // (Non-blocking; only indexes already loaded data unless user visited page before.)
    const periodicosTable = document.getElementById('listaPeriodicos');
    if(periodicosTable){
      periodicosTable.querySelectorAll('tbody tr').forEach(r=>{
        const tds = r.querySelectorAll('td');
        if(tds.length>=5){ items.push({ type:'Periódico', title:tds[0].textContent, author:tds[1].textContent, meta:`ISSN ${tds[2].textContent} • Fator ${tds[3].textContent}` }); }
      });
    }
    const gamesGrid = document.getElementById('gamesGrid');
    if(gamesGrid){
      gamesGrid.querySelectorAll('.game-card .game-head').forEach(h=> items.push({ type:'Game', title:h.textContent.trim(), author:'', meta:'' }));
    }
    return items;
  }

  let cache = collect();

  function render(){
    const q = inp.value.trim().toLowerCase();
    const tipo = tipoSel.value;
    const filtered = cache.filter(i => (!tipo || i.type===tipo) && (!q || i.title.toLowerCase().includes(q) || i.author.toLowerCase().includes(q)));
    stats.textContent = filtered.length + ' resultado(s)';
    if(!filtered.length){ box.innerHTML = '<div class="muted">Nada encontrado.</div>'; return; }
    box.innerHTML = filtered.map(i => `
      <div class="last-item" style="grid-template-columns: 70px 1fr auto;">
        <div class="mini">${i.type}</div>
        <div>
          <div class="title">${i.title}</div>
          <div class="meta">${i.author}</div>
        </div>
        <div class="rating">${i.meta}</div>
      </div>`).join('');
  }

  function exportCSV(){
    const rows = ['type,title,author,meta'];
    const q = inp.value.trim().toLowerCase();
    const tipo = tipoSel.value;
    cache.filter(i => (!tipo || i.type===tipo) && (!q || i.title.toLowerCase().includes(q) || i.author.toLowerCase().includes(q)))
      .forEach(i => rows.push([i.type, i.title, i.author, i.meta].map(v => '"'+v.replace(/"/g,'""')+'"').join(',')));
    const blob = new Blob([rows.join('\n')], { type:'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'busca.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  inp.addEventListener('input', render);
  tipoSel.addEventListener('change', render);
  exportBtn.addEventListener('click', exportCSV);
  render();
})();