(function(){
  if(!document.getElementById('periodicosPage')) return;
  const data = [
    { titulo:'Revista Brasileira de Direito', area:'Direito', issn:'0102-1234', fator:'1.2', acesso:'Aberto' },
    { titulo:'Arquitetura & Urbanismo', area:'Arquitetura', issn:'1980-9988', fator:'0.9', acesso:'Assinatura' },
    { titulo:'Journal de Medicina Clínica', area:'Medicina', issn:'2234-5566', fator:'2.4', acesso:'Assinatura' },
    { titulo:'Psicologia Hoje Acadêmica', area:'Psicologia', issn:'1357-8899', fator:'1.1', acesso:'Aberto' },
    { titulo:'Engenharia & Tecnologia Avançada', area:'Tecnologia', issn:'2444-7788', fator:'3.0', acesso:'Assinatura' }
  ];
  const busca = document.getElementById('pBusca');
  const box = document.getElementById('listaPeriodicos');
  function render(list){
    box.innerHTML = `<table class="tabela"><thead><tr><th>Título</th><th>Área</th><th>ISSN</th><th>Fator</th><th>Acesso</th></tr></thead><tbody>`+
      list.map(p=>`<tr><td>${p.titulo}</td><td>${p.area}</td><td>${p.issn}</td><td>${p.fator}</td><td>${p.acesso}</td></tr>`).join('')+`</tbody></table>`;
  }
  function filtrar(){
    const q = busca.value.trim().toLowerCase();
    render(data.filter(d=> !q || d.titulo.toLowerCase().includes(q) || d.issn.toLowerCase().includes(q)));
  }
  busca.addEventListener('input', filtrar);
  render(data);
  const logoutLink = document.getElementById('logoutLink');
  if(logoutLink){ logoutLink.addEventListener('click', e => { e.preventDefault(); Auth.logout(); }); }
})();