// Centraliza empréstimos e regras
(function(){
  const LS_KEY_LOANS = 'loansAtivos';
  const LS_KEY_RESERVAS_LIVROS = 'reservasLivros';
  const LS_KEY_RESERVAS_GAMES = 'reservasGames';
  const MAX_RENOVACOES = 5; // limite
  const DIAS_BASE = 14; // prazo inicial

  function hoje(){ return new Date(); }
  function parse(d){ return new Date(d); }
  function formatISO(dt){ return dt.toISOString().slice(0,10); }

  function seed(){
    const base = [
      { codigo:'EMP201', titulo:'Dom Casmurro', retirado:'2025-11-10', vence:'2025-11-24', renovacoes:1 },
      { codigo:'EMP202', titulo:'Pedagogia da Autonomia', retirado:'2025-11-12', vence:'2025-11-26', renovacoes:0 },
      { codigo:'EMP203', titulo:'Direito Constitucional Esquematizado', retirado:'2025-11-08', vence:'2025-11-22', renovacoes:2 }
    ];
    localStorage.setItem(LS_KEY_LOANS, JSON.stringify(base));
    return base;
  }

  function getLoans(){
    try { const raw = localStorage.getItem(LS_KEY_LOANS); if(raw) return JSON.parse(raw); } catch(e) {}
    return seed();
  }

  function saveLoans(list){ localStorage.setItem(LS_KEY_LOANS, JSON.stringify(list)); }

  function diasEntre(a,b){ return Math.floor((b.getTime()-a.getTime())/86400000); }

  function isOverdue(loan){ return hoje() > parse(loan.vence); }
  function renovar(codigo, dias){
    const loans = getLoans();
    const item = loans.find(l=>l.codigo===codigo);
    if(!item) return { ok:false, message:'Não encontrado'};
    if(isOverdue(item)) return { ok:false, message:'Empréstimo em atraso'};
    if(item.renovacoes >= MAX_RENOVACOES) return { ok:false, message:'Limite de renovações atingido'};
    const novaData = parse(item.vence);
    novaData.setDate(novaData.getDate()+dias);
    item.vence = formatISO(novaData);
    item.renovacoes += 1;
    saveLoans(loans);
    return { ok:true, item };
  }
  function devolver(codigo){
    let loans = getLoans();
    loans = loans.filter(l=>l.codigo!==codigo);
    saveLoans(loans);
    return { ok:true };
  }

  function getOverdueCount(){ return getLoans().filter(isOverdue).length; }
  function getMaxRenov(){ return MAX_RENOVACOES; }

  // Reservas Livros
  function getReservasLivros(){ try{ const r = localStorage.getItem(LS_KEY_RESERVAS_LIVROS); if(r) return JSON.parse(r); }catch(e){} return []; }
  function saveReservasLivros(arr){ localStorage.setItem(LS_KEY_RESERVAS_LIVROS, JSON.stringify(arr)); }
  function reservarLivro(titulo, user){
    const lista = getReservasLivros();
    lista.push({ titulo, user, time: Date.now() });
    saveReservasLivros(lista);
    return { ok:true };
  }

  // Reservas Games
  function getReservasGames(){ try{ const r = localStorage.getItem(LS_KEY_RESERVAS_GAMES); if(r) return JSON.parse(r); }catch(e){} return []; }
  function saveReservasGames(arr){ localStorage.setItem(LS_KEY_RESERVAS_GAMES, JSON.stringify(arr)); }
  function reservarGame(gameId, user){ const lista = getReservasGames(); lista.push({ gameId, user, time: Date.now() }); saveReservasGames(lista); return { ok:true }; }

  window.LoanStore = {
    getLoans, saveLoans, renovar, devolver, getOverdueCount, getMaxRenov,
    reservarLivro, getReservasLivros,
    reservarGame, getReservasGames
  };
})();