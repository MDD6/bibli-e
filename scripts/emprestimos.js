(function(){
  if(!document.getElementById('emprestimosPage')) return;
  const maxRenov = LoanStore.getMaxRenov();
  let ativos = LoanStore.getLoans();
  const box = document.getElementById('listaEmprestimos');
  function render(){
    ativos = LoanStore.getLoans();
    const overdueSet = new Set(ativos.filter(l=> new Date() > new Date(l.vence)).map(l=>l.codigo));
    box.innerHTML = '<table class="tabela"><thead><tr><th>Código</th><th>Título</th><th>Retirado</th><th>Vencimento</th><th>Renovações</th><th>Status</th><th>Ações</th></tr></thead><tbody>' +
      ativos.map(a=>{
        const overdue = overdueSet.has(a.codigo);
        const limit = a.renovacoes >= maxRenov;
        const status = overdue ? '<span class="status atraso">Atraso</span>' : (limit ? '<span class="status devolvido">Limite</span>' : '<span class="status devolvido">OK</span>');
        const disableRenov = overdue || limit ? 'disabled' : '';
        return `<tr><td>${a.codigo}</td><td>${a.titulo}</td><td>${a.retirado}</td><td>${a.vence}</td><td>${a.renovacoes}/${maxRenov}</td><td>${status}</td><td><button class="t-btn" data-act="renovar" data-id="${a.codigo}" ${disableRenov}>Renovar</button> <button class="t-btn danger" data-act="devolver" data-id="${a.codigo}">Devolver</button></td></tr>`;
      }).join('') + '</tbody></table>';
    renderAlert();
  }

  function renderAlert(){
    const count = LoanStore.getOverdueCount();
    let alert = document.getElementById('overdueBanner');
    if(!alert){
      alert = document.createElement('div');
      alert.id='overdueBanner';
      alert.className='overdue-banner';
      document.querySelector('.page').insertBefore(alert, document.querySelector('main'));
    }
    alert.textContent = count > 0 ? `Você possui ${count} empréstimo(s) em atraso.` : 'Nenhum empréstimo em atraso.';
  }
  box.addEventListener('click', e => {
    if(e.target.classList.contains('t-btn')){
      const act = e.target.getAttribute('data-act');
      const id = e.target.getAttribute('data-id');
      if(act==='renovar'){
        const res = LoanStore.renovar(id, 7); // padrão 7 dias extra
        if(!res.ok) alert(res.message);
      }
      if(act==='devolver'){
        LoanStore.devolver(id);
      }
      render();
    }
  });
  render();
  const logoutLink = document.getElementById('logoutLink');
  if(logoutLink){ logoutLink.addEventListener('click', e => { e.preventDefault(); Auth.logout(); }); }
})();