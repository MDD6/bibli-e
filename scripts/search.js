(function(){
  // Simple global search overlay
  let overlay;
  function ensureOverlay(){
    if(overlay) return overlay;
    overlay = document.createElement('div');
    overlay.id = 'globalSearch';
    overlay.style.position='fixed'; overlay.style.inset='0'; overlay.style.background='rgba(0,0,0,.35)';
    overlay.style.display='none'; overlay.style.zIndex='9999';
    overlay.innerHTML = `
      <div style="max-width:760px;margin:60px auto;background:#fff;border-radius:14px;box-shadow:0 10px 30px rgba(0,0,0,.2);overflow:hidden;">
        <div style="padding:12px 14px;border-bottom:1px solid #eef0f3;display:flex;gap:8px;">
          <input id="gsInput" type="text" placeholder="Buscar em acervo, periódicos e games..." style="flex:1;border:1px solid #eef0f3;border-radius:8px;padding:8px 10px;"/>
          <button id="gsVerTudo" class="btn-go" style="height:34px;background:#0ea5e9">Ver tudo</button>
          <button id="gsClose" class="btn-go" style="height:34px">Fechar</button>
        </div>
        <div id="gsResults" style="padding:12px;max-height:420px;overflow:auto"></div>
      </div>`;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', (e)=>{ if(e.target===overlay) hide(); });
    document.getElementById('gsClose').addEventListener('click', hide);
    document.getElementById('gsInput').addEventListener('input', doSearch);
    document.getElementById('gsVerTudo').addEventListener('click', () => {
      const term = document.getElementById('gsInput').value.trim();
      localStorage.setItem('globalSearchLastTerm', term);
      hide();
      location.hash = '#/buscar';
    });
    return overlay;
  }
  function show(){ ensureOverlay(); overlay.style.display='block'; document.getElementById('gsInput').focus(); }
  function hide(){ if(overlay) overlay.style.display='none'; }

  // Collect data from current scripts (client-side only)
  function indexData(){
    const items = [];
    // Books (acervo/home)
    if(window.booksData){
      window.booksData.forEach(b=> items.push({ type:'Livro', title:b.title, author:b.author, meta:`${b.category} • ${b.century}` }));
    }
    // Periodicos
    const periodicosBox = document.getElementById('listaPeriodicos');
    if(periodicosBox){
      const rows = periodicosBox.querySelectorAll('tbody tr');
      rows.forEach(r=>{
        const tds = r.querySelectorAll('td');
        if(tds.length>=5){
          items.push({ type:'Periódico', title:tds[0].textContent, author:tds[1].textContent, meta:`ISSN ${tds[2].textContent} • Fator ${tds[3].textContent}` });
        }
      });
    }
    // Games
    const gamesGrid = document.getElementById('gamesGrid');
    if(gamesGrid){
      gamesGrid.querySelectorAll('.game-card .game-head').forEach(h=>{
        items.push({ type:'Game', title:h.textContent.trim(), author:'', meta:'' });
      });
    }
    return items;
  }
  function doSearch(){
    const q = document.getElementById('gsInput').value.trim().toLowerCase();
    const resultsBox = document.getElementById('gsResults');
    const items = indexData();
    const filtered = items.filter(i=> !q || i.title.toLowerCase().includes(q) || i.author.toLowerCase().includes(q));
    if(!filtered.length){ resultsBox.innerHTML = '<div class="muted">Nenhum resultado.</div>'; return; }
    resultsBox.innerHTML = filtered.map(i=> `
      <div class="last-item" style="grid-template-columns: 24px 1fr auto;">
        <div>${i.type}</div>
        <div>
          <div class="title">${i.title}</div>
          <div class="meta">${i.author}</div>
        </div>
        <div class="rating">${i.meta}</div>
      </div>
    `).join('');
  }

  // Keyboard shortcut Ctrl+K
  document.addEventListener('keydown', (e)=>{
    if((e.ctrlKey || e.metaKey) && e.key.toLowerCase()==='k'){ e.preventDefault(); show(); }
    if(e.key==='Escape'){ hide(); }
  });
})();
