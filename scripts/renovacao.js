(function(){
  if(!document.getElementById('renovacaoPage')) return;
  // Usa loans centralizados
  function getProximos(){
    return LoanStore.getLoans().filter(l=> new Date(l.vence) <= addDays(new Date(), 5));
  }
  function addDays(dt, n){ const d = new Date(dt); d.setDate(d.getDate()+n); return d; }
  const listBox = document.getElementById('listaRenovacao');
  function render(){
    const proximos = getProximos();
    listBox.innerHTML = '<table class="tabela"><thead><tr><th>Código</th><th>Título</th><th>Vencimento</th><th>Renovações</th><th>Ações</th></tr></thead><tbody>' +
      proximos.map(p=>{
        const disabled = p.renovacoes >= LoanStore.getMaxRenov() || new Date() > new Date(p.vence) ? 'disabled' : '';
        return `<tr><td>${p.codigo}</td><td>${p.titulo}</td><td>${p.vence}</td><td>${p.renovacoes}/${LoanStore.getMaxRenov()}</td><td><button class="t-btn" data-id="${p.codigo}" ${disabled}>Renovar</button></td></tr>`;
      }).join('') + '</tbody></table>';
  }
  render();
  const form = document.getElementById('formRenovacao');
  const msg = document.getElementById('renovMsg');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const codigo = form.codigo.value.trim().toUpperCase();
    const dias = parseInt(form.dias.value,10);
    const res = LoanStore.renovar(codigo, dias);
    if(!res.ok){ msg.textContent = res.message; msg.classList.add('error'); }
    else { msg.textContent = 'Renovado'; msg.classList.remove('error'); }
    render();
  });

  listBox.addEventListener('click', e => {
    if(e.target.tagName==='BUTTON'){
      const id = e.target.getAttribute('data-id');
      const res = LoanStore.renovar(id, 7);
      if(!res.ok) alert(res.message); else render();
    }
  });
  const logoutLink = document.getElementById('logoutLink');
  if(logoutLink){ logoutLink.addEventListener('click', e => { e.preventDefault(); Auth.logout(); }); }
})();