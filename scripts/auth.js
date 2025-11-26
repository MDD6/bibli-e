// Autenticação simples em memória/localStorage
// Adiciona múltiplos tipos de usuário: aluno, professor, admin
const VALID_USERS = [
  { user: 'aluno', pass: 'unifor123', role: 'aluno' },
  { user: 'professor', pass: 'docente123', role: 'professor' },
  { user: 'admin', pass: 'admin2025', role: 'admin' }
];
const LS_SESSION_KEY = 'sessionUser';

function currentSession(){
  try { const raw = localStorage.getItem(LS_SESSION_KEY); if(raw) return JSON.parse(raw); } catch(e) {}
  return null;
}
function isAuthenticated(){ return !!currentSession(); }
function requireAuth(){
  if(!isAuthenticated()) {
    // Força rota SPA de login
    if(location.hash !== '#/login') {
      location.hash = '#/login';
    }
    return false;
  }
  return true;
}
function login(user, pass){
  const found = VALID_USERS.find(u => u.user === user && u.pass === pass);
  if(!found) return { ok:false, message:'Credenciais inválidas' };
  localStorage.setItem(LS_SESSION_KEY, JSON.stringify({ user: found.user, role: found.role, time: Date.now() }));
  return { ok:true };
}
function logout(){
  localStorage.removeItem(LS_SESSION_KEY);
  location.hash = '#/login';
}

// Expor de forma segura
window.Auth = { login, logout, requireAuth, isAuthenticated, currentSession };
