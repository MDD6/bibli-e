(function(){
  if(!document.getElementById('adminPage')) return;
  const msg = document.getElementById('adminMsg');
  if(!Auth.currentSession() || Auth.currentSession().role!=='admin'){
    msg.textContent = 'Acesso restrito. É necessário ser admin.';
    return;
  }
  msg.textContent = 'Gerencie disponibilidade e filas.';

  const livrosBox = document.getElementById('adminLivros');
  const gamesBox = document.getElementById('adminGames');
  const reservasLivrosBox = document.getElementById('adminReservasLivros');
  const reservasGamesBox = document.getElementById('adminReservasGames');

  function renderLivros(){
    const inv = LoanStore.getInventoryLivros([]);
    livrosBox.innerHTML = '<table class="tabela"><thead><tr><th>Título</th><th>Total</th><th>Disponíveis</th><th>Ações</th></tr></thead><tbody>' +
      inv.map(i=> `<tr><td>${i.titulo}</td><td>${i.total}</td><td>${i.disponiveis}</td><td><button class='t-btn' data-act='add' data-t='${i.titulo}'>+1</button> <button class='t-btn danger' data-act='rem' data-t='${i.titulo}'>-1</button></td></tr>`).join('') + '</tbody></table>';
  }
  function renderGames(){
    const inv = LoanStore.getInventoryGames([]);
    gamesBox.innerHTML = '<table class="tabela"><thead><tr><th>Game</th><th>Total</th><th>Disponíveis</th><th>Ações</th></tr></thead><tbody>' +
      inv.map(i=> `<tr><td>${i.titulo}</td><td>${i.total}</td><td>${i.disponiveis}</td><td><button class='t-btn' data-act='gadd' data-id='${i.gameId}'>+1</button> <button class='t-btn danger' data-act='grem' data-id='${i.gameId}'>-1</button></td></tr>`).join('') + '</tbody></table>';
  }
  function renderReservas(){
    const rl = LoanStore.getReservasLivros();
    reservasLivrosBox.innerHTML = rl.length ? rl.map(r=> `<div class='fav-item'><span>${r.titulo}</span><span class='mini'>${r.user}</span></div>`).join('') : '<div class="muted">Sem reservas.</div>';
    const rg = LoanStore.getReservasGames();
    reservasGamesBox.innerHTML = rg.length ? rg.map(r=> `<div class='fav-item'><span>${r.gameId}</span><span class='mini'>${r.user}</span></div>`).join('') : '<div class="muted">Sem reservas.</div>';
  }

  livrosBox.addEventListener('click', e => {
    const act = e.target.getAttribute('data-act');
    const titulo = e.target.getAttribute('data-t');
    if(!act || !titulo) return;
    LoanStore.updateDisponiveisLivro(titulo, act==='add'? 1 : -1);
    renderLivros();
  });
  gamesBox.addEventListener('click', e => {
    const act = e.target.getAttribute('data-act');
    const id = e.target.getAttribute('data-id');
    if(!act || !id) return;
    LoanStore.updateDisponiveisGame(id, act==='gadd'? 1 : -1);
    renderGames();
  });

  renderLivros();
  renderGames();
  renderReservas();
})();