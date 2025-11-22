(function(){
  if(!document.getElementById('historicoPage')) return;
  const registros = [
    { titulo:'Dom Casmurro', area:'Literatura', retirado:'2025-10-10', devolvido:'2025-10-24', status:'Devolvido' },
    { titulo:'Direito Constitucional Esquematizado', area:'Direito', retirado:'2025-09-02', devolvido:'2025-09-25', status:'Devolvido' },
    { titulo:'Pedagogia da Autonomia', area:'Medicina', retirado:'2025-10-01', devolvido:'2025-10-30', status:'Atraso' },
    { titulo:'Estruturas de Dados em Java', area:'Tecnologia', retirado:'2025-10-15', devolvido:'2025-10-28', status:'Devolvido' }
  ];
  const busca = document.getElementById('hBusca');
  const area = document.getElementById('hArea');
  const status = document.getElementById('hStatus');
  const box = document.getElementById('histLista');
  function render(list){
    box.innerHTML = '<table class="tabela"><thead><tr><th>Título</th><th>Área</th><th>Retirado</th><th>Devolvido</th><th>Status</th></tr></thead><tbody>' +
      list.map(r=>`<tr><td>${r.titulo}</td><td>${r.area}</td><td>${r.retirado}</td><td>${r.devolvido}</td><td><span class="status ${r.status.toLowerCase()}">${r.status}</span></td></tr>`).join('') + '</tbody></table>';
  }
  function filtrar(){
    const q = busca.value.trim().toLowerCase();
    const a = area.value;
    const s = status.value;
    render(registros.filter(r => (!q || r.titulo.toLowerCase().includes(q)) && (!a || r.area===a) && (!s || r.status===s)));
  }
  busca.addEventListener('input', filtrar);
  area.addEventListener('change', filtrar);
  status.addEventListener('change', filtrar);
  filtrar();
  const logoutLink = document.getElementById('logoutLink');
  if(logoutLink){ logoutLink.addEventListener('click', e => { e.preventDefault(); Auth.logout(); }); }
})();