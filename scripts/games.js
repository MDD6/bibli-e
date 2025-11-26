(function(){
  if(!document.getElementById('gamesPage')) return;
  const user = (window.Auth && Auth.currentSession()) ? Auth.currentSession().user : 'anon';
  const jogos = [
    { id:'catan', titulo:'Catan', categoria:'Estratégia', total:3 },
    { id:'ticket', titulo:'Ticket to Ride', categoria:'Estratégia', total:2 },
    { id:'dobble', titulo:'Dobble', categoria:'Party', total:5 },
    { id:'uno', titulo:'UNO', categoria:'Party', total:4 },
    { id:'xadrez', titulo:'Xadrez', categoria:'Clássico', total:6 },
    { id:'monopoly', titulo:'Monopoly', categoria:'Clássico', total:2 },
    { id:'mathlogic', titulo:'Math Logic', categoria:'Educativo', total:3 }
  ];
  // Inventário persistente
  const inventarioGames = LoanStore.getInventoryGames(jogos);
  const jogosInv = inventarioGames.map(inv => {
    const base = jogos.find(j=> j.id===inv.gameId) || { id:inv.gameId, titulo:inv.titulo, categoria:'', total:inv.total };
    return { ...base, disponiveis: inv.disponiveis };
  });

  const busca = document.getElementById('gBusca');
  const categoria = document.getElementById('gCategoria');
  const grid = document.getElementById('gamesGrid');
  const reservasBox = document.getElementById('gamesReservas');

  function renderReservas(){
    const reservas = LoanStore.getReservasGames();
    if(!reservas.length){ reservasBox.innerHTML='<div class="muted">Nenhuma reserva.</div>'; return; }
    reservasBox.innerHTML = reservas.map(r => {
      const jogo = jogos.find(j=>j.id===r.gameId);
      if(!jogo) return '';
      const data = new Date(r.time).toLocaleString('pt-BR');
      return `<div class="fav-item"><span>${jogo.titulo}</span><span class="mini">${r.user}</span><span class="mini">${data}</span></div>`;
    }).join('');
  }

  function render(){
    const q = busca.value.trim().toLowerCase();
    const cat = categoria.value;
    const filtrado = jogosInv.filter(j => (!q || j.titulo.toLowerCase().includes(q)) && (!cat || j.categoria===cat));
    grid.innerHTML = filtrado.map(j => {
      const dispBadge = j.disponiveis>0 ? `<span class='badge disp'>${j.disponiveis}/${j.total} disp.</span>` : `<span class='badge indisp'>0/${j.total} indisponível</span>`;
      let filaInfo = '';
      let reservarBtn = `<button class='reserve-btn' disabled>Disponível</button>`;
      if(j.disponiveis===0){
        const reservas = LoanStore.getReservasGames().filter(r=> r.gameId===j.id);
        const posUsuario = reservas.findIndex(r=> r.user===user) + 1;
        // ETA aproximada: 3 dias + posição * 2 dias
        const etaDate = new Date(); etaDate.setDate(etaDate.getDate() + 3 + (posUsuario>0 ? (posUsuario-1)*2 : reservas.length*2));
        const eta = etaDate.toISOString().slice(0,10);
        filaInfo = `<div class='mini'>Fila: ${reservas.length}${posUsuario? ' (sua pos. '+posUsuario+')':''} • ETA ${eta}</div>`;
        reservarBtn = posUsuario ? `<button class='reserve-btn' disabled>Na fila</button>` : `<button class='reserve-btn' data-game='${j.id}'>Reservar</button>`;
      }
      return `<div class='game-card'>
        <div class='game-head'><strong>${j.titulo}</strong></div>
        <div class='meta-line'><span class='mini'>${j.categoria}</span>${dispBadge}</div>
        ${filaInfo}
        ${reservarBtn}
      </div>`;
    }).join('');
  }

  grid.addEventListener('click', e => {
    if(e.target.classList.contains('reserve-btn') && !e.target.disabled){
      const gameId = e.target.getAttribute('data-game');
      LoanStore.reservarGame(gameId, user);
      e.target.textContent='Reservado';
      e.target.disabled=true;
      renderReservas();
    }
  });

  busca.addEventListener('input', render);
  categoria.addEventListener('change', render);

  render();
  renderReservas();
  const logoutLink = document.getElementById('logoutLink');
  if(logoutLink){ logoutLink.addEventListener('click', e => { e.preventDefault(); Auth.logout(); }); }
})();