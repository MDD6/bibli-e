(function(){
  const form = document.getElementById('loginForm');
  if(!form) return;
  const userEl = document.getElementById('loginUser');
  const passEl = document.getElementById('loginPass');
  const msgEl = document.getElementById('loginMsg');

  function showMsg(text, ok){
    msgEl.textContent = text;
    msgEl.className = 'login-msg ' + (ok? 'success':'error');
  }
  form.addEventListener('submit', e => {
    e.preventDefault();
    const u = userEl.value.trim();
    const p = passEl.value.trim();
    if(!u || !p){ showMsg('Preencha usuário e senha.', false); return; }
    const res = Auth.login(u,p);
    if(!res.ok){ showMsg(res.message || 'Falha ao autenticar.', false); return; }
    showMsg('Login OK. Redirecionando...', true);
    setTimeout(()=> { location.hash = '#/'; }, 400);
  });
})();
