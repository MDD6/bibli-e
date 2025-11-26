// Centraliza empréstimos e regras
 (function(){
  const LS_KEY_LOANS = 'loansAtivos';
  const LS_KEY_RESERVAS_LIVROS = 'reservasLivros';
  const LS_KEY_RESERVAS_GAMES = 'reservasGames';
  const LS_KEY_INV_LIVROS = 'inventoryLivros';
  const LS_KEY_INV_GAMES = 'inventoryGames';
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
    const devolvido = loans.find(l=> l.codigo===codigo);
    loans = loans.filter(l=>l.codigo!==codigo);
    saveLoans(loans);
    // Promover reserva se houver fila para este título
    if(devolvido){ promoverReservaLivro(devolvido.titulo); }
    return { ok:true };
  }

  function getOverdueCount(){ return getLoans().filter(isOverdue).length; }
  function getMaxRenov(){ return MAX_RENOVACOES; }

  // Reservas Livros
  function getReservasLivros(){ try{ const r = localStorage.getItem(LS_KEY_RESERVAS_LIVROS); if(r) return JSON.parse(r); }catch(e){} return []; }
  function saveReservasLivros(arr){ localStorage.setItem(LS_KEY_RESERVAS_LIVROS, JSON.stringify(arr)); }
  function reservarLivro(titulo, user){
    const lista = getReservasLivros();
    if(lista.some(r=> r.titulo===titulo && r.user===user)) return { ok:false, message:'Já na fila' };
    lista.push({ titulo, user, time: Date.now() });
    saveReservasLivros(lista);
    return { ok:true };
  }

  // Reservas Games
  function getReservasGames(){ try{ const r = localStorage.getItem(LS_KEY_RESERVAS_GAMES); if(r) return JSON.parse(r); }catch(e){} return []; }
  function saveReservasGames(arr){ localStorage.setItem(LS_KEY_RESERVAS_GAMES, JSON.stringify(arr)); }
  function reservarGame(gameId, user){
    const lista = getReservasGames();
    if(lista.some(r=> r.gameId===gameId && r.user===user)) return { ok:false, message:'Já na fila' };
    lista.push({ gameId, user, time: Date.now() });
    saveReservasGames(lista);
    return { ok:true };
  }

  // INVENTÁRIO LIVROS
  function seedInventoryLivros(books){
    const inv = books.map(b=> ({ titulo:b.title, total: Math.max(3, Math.floor(b.rating))+2, disponiveis: Math.max(1, Math.floor((b.rating%1)* (Math.max(3, Math.floor(b.rating))+2))) }));
    localStorage.setItem(LS_KEY_INV_LIVROS, JSON.stringify(inv));
    return inv;
  }
  function getInventoryLivros(books){
    try{ const raw = localStorage.getItem(LS_KEY_INV_LIVROS); if(raw) return JSON.parse(raw); }catch(e){}
    if(!books) books=[];
    return seedInventoryLivros(books);
  }
  function updateDisponiveisLivro(titulo, delta){
    const inv = getInventoryLivros();
    const item = inv.find(i=> i.titulo===titulo);
    if(item){ item.disponiveis = Math.max(0, Math.min(item.total, item.disponiveis + delta)); }
    localStorage.setItem(LS_KEY_INV_LIVROS, JSON.stringify(inv));
    if(item && item.disponiveis>0){ promoverReservaLivro(titulo); }
    return item;
  }
  function promoverReservaLivro(titulo){
    // Se há reserva e exemplar disponível, atribuir ao primeiro da fila
    const reservas = getReservasLivros();
    const inv = getInventoryLivros();
    const itemInv = inv.find(i=> i.titulo===titulo);
    if(!itemInv || itemInv.disponiveis<=0) return;
    const fila = reservas.filter(r=> r.titulo===titulo).sort((a,b)=> a.time-b.time);
    if(!fila.length) return;
    // Consumir um disponível e remover primeira reserva
    itemInv.disponiveis -= 1;
    const escolhido = fila[0];
    // Criar empréstimo automático
    const loans = getLoans();
    const codigo = 'EMP' + (Math.floor(Math.random()*900)+100);
    const hojeDt = hoje();
    const venceDt = new Date(); venceDt.setDate(venceDt.getDate()+DIAS_BASE);
    loans.push({ codigo, titulo, retirado: formatISO(hojeDt), vence: formatISO(venceDt), renovacoes:0, user: escolhido.user });
    saveLoans(loans);
    // Remover reserva consumida
    const restantes = reservas.filter(r=> !(r.titulo===titulo && r.user===escolhido.user));
    saveReservasLivros(restantes);
    localStorage.setItem(LS_KEY_INV_LIVROS, JSON.stringify(inv));
    // Disparar notificação
    notificar(`${titulo} disponível para ${escolhido.user}`);
  }

  // INVENTÁRIO GAMES
  function seedInventoryGames(games){
    const inv = games.map(g=> ({ gameId:g.id, titulo:g.titulo, total:g.total, disponiveis: Math.floor(g.total/2) }));
    localStorage.setItem(LS_KEY_INV_GAMES, JSON.stringify(inv));
    return inv;
  }
  function getInventoryGames(games){
    try{ const raw = localStorage.getItem(LS_KEY_INV_GAMES); if(raw) return JSON.parse(raw); }catch(e){}
    if(!games) games=[];
    return seedInventoryGames(games);
  }
  function updateDisponiveisGame(gameId, delta){
    const inv = getInventoryGames();
    const item = inv.find(i=> i.gameId===gameId);
    if(item){ item.disponiveis = Math.max(0, Math.min(item.total, item.disponiveis + delta)); }
    localStorage.setItem(LS_KEY_INV_GAMES, JSON.stringify(inv));
    if(item && item.disponiveis>0){ promoverReservaGame(gameId); }
    return item;
  }
  function promoverReservaGame(gameId){
    const reservas = getReservasGames();
    const inv = getInventoryGames();
    const itemInv = inv.find(i=> i.gameId===gameId);
    if(!itemInv || itemInv.disponiveis<=0) return;
    const fila = reservas.filter(r=> r.gameId===gameId).sort((a,b)=> a.time-b.time);
    if(!fila.length) return;
    itemInv.disponiveis -= 1;
    const escolhido = fila[0];
    // Aqui poderíamos criar um registro separado de 'loansGames'; simplificado omitido.
    const restantes = reservas.filter(r=> !(r.gameId===gameId && r.user===escolhido.user));
    saveReservasGames(restantes);
    localStorage.setItem(LS_KEY_INV_GAMES, JSON.stringify(inv));
    notificar(`Game ${itemInv.titulo} disponível para ${escolhido.user}`);
  }

  function notificar(msg){
    // Usa service worker via postMessage se disponível
    if(navigator.serviceWorker && navigator.serviceWorker.controller){
      navigator.serviceWorker.controller.postMessage({ type:'notify', message: msg });
    }
  }

  window.LoanStore = {
    getLoans, saveLoans, renovar, devolver, getOverdueCount, getMaxRenov,
    reservarLivro, getReservasLivros,
    reservarGame, getReservasGames,
    getInventoryLivros, updateDisponiveisLivro,
    getInventoryGames, updateDisponiveisGame
  };
})();
