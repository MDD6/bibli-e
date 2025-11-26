// Lógica específica da página de Acervo
(function(){
  if(!document.getElementById('acervoPage')) return; // só executa nesta página

  // Reuso de booksData do script.js. Gerar disponibilidade simulada.
  // Inventário persistente via LoanStore
  const inventarioBase = LoanStore.getInventoryLivros(booksData);
  const EXTENDED = booksData.map(b => {
    const inv = inventarioBase.find(i=> i.titulo===b.title) || { total:3, disponiveis:1 };
    return {
      ...b,
      total: inv.total,
      disponiveis: inv.disponiveis,
      id: b.title.toLowerCase().replace(/[^a-z0-9]+/g,'-')
    };
  });

  // Persistência simples
  const LS_KEY_FILTROS = 'acervoFiltros';
  const LS_KEY_FAV = 'acervoFavoritos';

  function loadState(){
    let filtros = { busca:'', areas:[], seculos:[], ordenar:'titulo' };
    try{ const raw = localStorage.getItem(LS_KEY_FILTROS); if(raw) filtros = JSON.parse(raw); }catch(e){}
    let fav = [];
    try{ const rawF = localStorage.getItem(LS_KEY_FAV); if(rawF) fav = JSON.parse(rawF); }catch(e){}
    return { filtros, fav };
  }
  function saveState(filtros){
    localStorage.setItem(LS_KEY_FILTROS, JSON.stringify(filtros));
  }
  function saveFav(fav){
    localStorage.setItem(LS_KEY_FAV, JSON.stringify(fav));
  }

  const state = loadState();

  const areasSet = [...new Set(EXTENDED.map(b=>b.category))].sort();
  const seculosSet = [...new Set(EXTENDED.map(b=>b.century))].sort();

  // Monta checkboxes
  function renderCheckboxes(list, targetId, selecionados){
    const box = document.getElementById(targetId);
    box.innerHTML = list.map(v => {
      const id = targetId+ '_' + v;
      const checked = selecionados.includes(v) ? 'checked' : '';
      return `<label class="chk"><input type="checkbox" value="${v}" id="${id}" ${checked}/> <span>${v}</span></label>`;
    }).join('');
  }
  renderCheckboxes(areasSet,'fAreas', state.filtros.areas);
  renderCheckboxes(seculosSet,'fSeculos', state.filtros.seculos);

  // Inputs
  const inpBusca = document.getElementById('fBusca');
  const selOrdenar = document.getElementById('fOrdenar');
  const btnLimpar = document.getElementById('btnLimpar');
  const grid = document.getElementById('livrosGrid');
  const totalCount = document.getElementById('totalCount');
  const dispCount = document.getElementById('dispCount');
  const favList = document.getElementById('listaFavoritos');

  inpBusca.value = state.filtros.busca || '';
  selOrdenar.value = state.filtros.ordenar || 'titulo';

  function getSelected(containerId){
    return [...document.querySelectorAll('#'+containerId+' input[type=checkbox]:checked')].map(i=>i.value);
  }

  // Favoritos
  let favoritos = state.fav || [];
  function toggleFavorito(id){
    if(favoritos.includes(id)) favoritos = favoritos.filter(f=>f!==id); else favoritos.push(id);
    saveFav(favoritos);
    renderFav();
    renderGrid();
  }
  function renderFav(){
    if(!favoritos.length){ favList.innerHTML = '<div class="muted">Nenhum favorito ainda.</div>'; return; }
    favList.innerHTML = favoritos.map(fid => {
      const item = EXTENDED.find(b=>b.id===fid);
      if(!item) return '';
      return `<div class="fav-item" data-id="${item.id}">
        <span class="fav-title">${item.title}</span>
        <button class="fav-remove" data-id="${item.id}" title="Remover">✕</button>
      </div>`;
    }).join('');
  }

  favList.addEventListener('click', e => {
    const id = e.target.getAttribute('data-id');
    if(e.target.classList.contains('fav-remove')){
      favoritos = favoritos.filter(f=>f!==id);
      saveFav(favoritos);
      renderFav();
      renderGrid();
    }
  });

  function highlight(text, term){
    if(!term) return text;
    const esc = term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    return text.replace(new RegExp(esc,'gi'), m=>`<mark class="hl">${m}</mark>`);
  }

  function ordenar(list, criterio){
    const c = {
      titulo: (a,b)=> a.title.localeCompare(b.title),
      autor: (a,b)=> a.author.localeCompare(b.author),
      rating: (a,b)=> b.rating - a.rating,
      categoria: (a,b)=> a.category.localeCompare(b.category),
      seculo: (a,b)=> a.century.localeCompare(b.century)
    }[criterio] || ((a,b)=>0);
    return [...list].sort(c);
  }

  function filtrar(){
    const busca = inpBusca.value.trim().toLowerCase();
    const areas = getSelected('fAreas');
    const seculos = getSelected('fSeculos');
    const ordenarPor = selOrdenar.value;

    const filtrado = EXTENDED.filter(b => {
      const matchBusca = !busca || b.title.toLowerCase().includes(busca) || b.author.toLowerCase().includes(busca);
      const matchArea = !areas.length || areas.includes(b.category);
      const matchSec = !seculos.length || seculos.includes(b.century);
      return matchBusca && matchArea && matchSec;
    });
    const ordenado = ordenar(filtrado, ordenarPor);

    // Persistir filtros
    saveState({ busca: inpBusca.value, areas, seculos, ordenar: ordenarPor });
    return { lista: ordenado, busca };
  }

  function renderGrid(){
    const { lista, busca } = filtrar();
    totalCount.textContent = lista.length + ' títulos';
    dispCount.textContent = lista.filter(b=>b.disponiveis>0).length + ' disponíveis';
    const user = (window.Auth && Auth.currentSession()) ? Auth.currentSession().user : 'anon';
    grid.innerHTML = lista.map(b => {
      const fav = favoritos.includes(b.id) ? 'fav-on' : 'fav-off';
      const badgeDisp = b.disponiveis>0 ? `<span class="badge disp">${b.disponiveis}/${b.total} disp.</span>` : `<span class="badge indisp">0/${b.total} indisponível</span>`;
      let filaInfo = '';
      let reservarBtn = '';
      if(b.disponiveis===0){
        const reservas = (window.LoanStore && LoanStore.getReservasLivros()) ? LoanStore.getReservasLivros().filter(r=>r.titulo===b.title) : [];
        const posUsuario = reservas.findIndex(r=> r.user===user) + 1; // 0 -> não na fila
        // ETA: menor data de vencimento entre loans ativos com mesmo título
        let eta = '';
        if(window.LoanStore){
          const loansMesmoTitulo = LoanStore.getLoans().filter(l=> l.titulo===b.title);
          if(loansMesmoTitulo.length){
            const menor = loansMesmoTitulo.map(l=> new Date(l.vence)).sort((a,b)=> a-b)[0];
            if(menor){ eta = menor.toISOString().slice(0,10); }
          }
        }
        if(!eta){
          const d = new Date(); d.setDate(d.getDate()+5); eta = d.toISOString().slice(0,10);
        }
        filaInfo = `<div class=\"mini\">Fila: ${reservas.length} ${posUsuario? '(sua pos. '+posUsuario+')':''} • ETA ${eta}</div>`;
        reservarBtn = posUsuario ? `<button class=\"reserve-btn\" disabled>Na fila</button>` : `<button class=\"reserve-btn\" data-title=\"${b.title}\" data-user=\"${user}\">Reservar</button>`;
      }
      return `<div class="book-card acervo-card" data-id="${b.id}">
        <div class="fav-btn ${fav}" data-id="${b.id}" title="Favorito">★</div>
        <img src="${b.img}" alt="Capa de ${b.title}">
        <div class="title">${highlight(b.title, busca)}</div>
        <div class="author">${highlight(b.author, busca)}</div>
        <div class="meta-line">
          <span class="mini">${b.category}</span>
          <span class="mini">${b.century}</span>
          ${badgeDisp}
        </div>
        <div class="rate"><span class="stars">★</span>${b.rating}</div>
        ${filaInfo}
        ${reservarBtn}
      </div>`;
    }).join('');
  }

  grid.addEventListener('click', e => {
    if(e.target.classList.contains('fav-btn')){
      toggleFavorito(e.target.getAttribute('data-id'));
    }
    if(e.target.classList.contains('reserve-btn')){
      const titulo = e.target.getAttribute('data-title');
      const user = e.target.getAttribute('data-user');
      if(window.LoanStore){
        const res = LoanStore.reservarLivro(titulo, user);
        if(res.ok){ e.target.textContent='Reservado'; e.target.disabled=true; }
        else { e.target.textContent = res.message; }
      }
    }
  });
  // Logout
  const logoutLink = document.getElementById('logoutLink');
  if(logoutLink){ logoutLink.addEventListener('click', e => { e.preventDefault(); if(window.Auth) Auth.logout(); }); }

  // Eventos filtros
  inpBusca.addEventListener('input', renderGrid);
  selOrdenar.addEventListener('change', renderGrid);
  document.getElementById('fAreas').addEventListener('change', renderGrid);
  document.getElementById('fSeculos').addEventListener('change', renderGrid);
  btnLimpar.addEventListener('click', () => {
    inpBusca.value = '';
    [...document.querySelectorAll('#fAreas input'), ...document.querySelectorAll('#fSeculos input')].forEach(i=> i.checked=false);
    selOrdenar.value = 'titulo';
    saveState({ busca:'', areas:[], seculos:[], ordenar:'titulo' });
    renderGrid();
  });

  renderFav();
  renderGrid();
})();