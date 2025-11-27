// Dados acadêmicos simulados para contexto de biblioteca universitária (Unifor)
const writersData = [
  { name: "Machado de Assis", rating: 4.9, reviews: "120 k avaliações", img: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=500&auto=format&fit=crop" },
  { name: "Clarice Lispector", rating: 4.8, reviews: "98 k avaliações", img: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=500&auto=format&fit=crop" },
  { name: "Paulo Freire", rating: 4.7, reviews: "85 k avaliações", img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=500&auto=format&fit=crop" },
  { name: "José de Alencar", rating: 4.6, reviews: "70 k avaliações", img: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=500&auto=format&fit=crop" }
];

let booksData = [
  { title: "Dom Casmurro", author: "Machado de Assis", rating: 4.9, reviews: "55 k avaliações", category: "Literatura", century: "XIX", img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop" },
  { title: "Memórias Póstumas de Brás Cubas", author: "Machado de Assis", rating: 4.8, reviews: "48 k avaliações", category: "Literatura", century: "XIX", img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=800&auto=format&fit=crop" },
  { title: "A Hora da Estrela", author: "Clarice Lispector", rating: 4.7, reviews: "40 k avaliações", category: "Literatura", century: "XX", img: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=800&auto=format&fit=crop" },
  { title: "Pedagogia da Autonomia", author: "Paulo Freire", rating: 4.8, reviews: "65 k avaliações", category: "Psicologia", century: "XX", img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop" },
  { title: "Direito Constitucional Esquematizado", author: "Pedro Lenza", rating: 4.6, reviews: "30 k avaliações", category: "Direito", century: "XXI", img: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=800&auto=format&fit=crop" },
  { title: "Semiologia Médica", author: "Cecil", rating: 4.5, reviews: "22 k avaliações", category: "Medicina", century: "XXI", img: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=800&auto=format&fit=crop" },
  { title: "Estruturas de Dados em Java", author: "Nicolau", rating: 4.4, reviews: "12 k avaliações", category: "Tecnologia", century: "XXI", img: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=800&auto=format&fit=crop" },
  { title: "Administração Estratégica", author: "Chiavenato", rating: 4.6, reviews: "27 k avaliações", category: "Administração", century: "XXI", img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop" },
  { title: "História da Arquitetura", author: "Benevolo", rating: 4.5, reviews: "18 k avaliações", category: "Arquitetura", century: "XX", img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop" },
  { title: "Iracema", author: "José de Alencar", rating: 4.6, reviews: "33 k avaliações", category: "Literatura", century: "XIX", img: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=800&auto=format&fit=crop" }
  { title: "Fundamentos de Física", author: "Halliday & Resnick", rating: 4.7, reviews: "52 k avaliações", category: "Tecnologia", century: "XX", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop" },
  { title: "Bioquímica Básica", author: "Lehninger", rating: 4.6, reviews: "29 k avaliações", category: "Medicina", century: "XXI", img: "https://images.unsplash.com/photo-1581092795360-590d757da7d2?q=80&w=800&auto=format&fit=crop" },
  { title: "Introdução à Programação em Python", author: "Guttag", rating: 4.5, reviews: "21 k avaliações", category: "Tecnologia", century: "XXI", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop" },
  { title: "Engenharia de Software Moderna", author: "Sommerville", rating: 4.6, reviews: "34 k avaliações", category: "Tecnologia", century: "XXI", img: "https://images.unsplash.com/photo-1537432376769-00a2e7b441d1?q=80&w=800&auto=format&fit=crop" },
  { title: "Psicologia Cognitiva", author: "Sternberg", rating: 4.5, reviews: "19 k avaliações", category: "Psicologia", century: "XXI", img: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=800&auto=format&fit=crop" },
  { title: "Neuroanatomia Clínica", author: "Snell", rating: 4.4, reviews: "15 k avaliações", category: "Medicina", century: "XXI", img: "https://images.unsplash.com/photo-1581091870627-3b5e87d9c89b?q=80&w=800&auto=format&fit=crop" },
  { title: "Administração Financeira", author: "Gitman", rating: 4.5, reviews: "26 k avaliações", category: "Administração", century: "XXI", img: "https://images.unsplash.com/photo-1554224154-22dec7ec8818?q=80&w=800&auto=format&fit=crop" },
  { title: "Arquitetura Sustentável", author: "Ken Yeang", rating: 4.3, reviews: "11 k avaliações", category: "Arquitetura", century: "XXI", img: "https://images.unsplash.com/photo-1505842465776-3d90f616310d?q=80&w=800&auto=format&fit=crop" },
  { title: "Inteligência Artificial", author: "Russell & Norvig", rating: 4.8, reviews: "61 k avaliações", category: "Tecnologia", century: "XXI", img: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=800&auto=format&fit=crop" },
  { title: "Data Science Aplicada", author: "Provost & Fawcett", rating: 4.6, reviews: "32 k avaliações", category: "Tecnologia", century: "XXI", img: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?q=80&w=800&auto=format&fit=crop" }
  ,
  { title: "Cálculo Volume 1", author: "James Stewart", rating: 4.7, reviews: "58 k avaliações", category: "Matemática", century: "XX", img: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=800&auto=format&fit=crop" },
  { title: "Algoritmos: Teoria e Prática", author: "Cormen et al.", rating: 4.8, reviews: "76 k avaliações", category: "Tecnologia", century: "XXI", img: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=800&auto=format&fit=crop" },
  { title: "Sistemas de Banco de Dados", author: "Elmasri & Navathe", rating: 4.6, reviews: "44 k avaliações", category: "Tecnologia", century: "XXI", img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop" },
  { title: "Microbiologia", author: "Prescott", rating: 4.5, reviews: "23 k avaliações", category: "Medicina", century: "XXI", img: "https://images.unsplash.com/photo-1581091014534-8987c1d647d5?q=80&w=800&auto=format&fit=crop" },
  { title: "Farmacologia Básica e Clínica", author: "Katzung", rating: 4.6, reviews: "39 k avaliações", category: "Medicina", century: "XXI", img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop" },
  { title: "Marketing Management", author: "Philip Kotler", rating: 4.5, reviews: "47 k avaliações", category: "Administração", century: "XXI", img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop" },
  { title: "Arquitetura de Computadores", author: "Hennessy & Patterson", rating: 4.7, reviews: "28 k avaliações", category: "Tecnologia", century: "XXI", img: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=800&auto=format&fit=crop" },
  { title: "Teoria Geral do Processo", author: "Fredie Didier Jr.", rating: 4.4, reviews: "17 k avaliações", category: "Direito", century: "XXI", img: "https://images.unsplash.com/photo-1555375771-14b2db2fd1b1?q=80&w=800&auto=format&fit=crop" },
  { title: "Psicologia Social", author: "Elliot Aronson", rating: 4.6, reviews: "24 k avaliações", category: "Psicologia", century: "XXI", img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop" },
  { title: "História da Arte", author: "E. H. Gombrich", rating: 4.5, reviews: "31 k avaliações", category: "Arte", century: "XX", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop" },
  { title: "Morte e Vida de Grandes Cidades", author: "Jane Jacobs", rating: 4.6, reviews: "19 k avaliações", category: "Arquitetura", century: "XX", img: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?q=80&w=800&auto=format&fit=crop" },
  { title: "Sociologia", author: "Anthony Giddens", rating: 4.5, reviews: "36 k avaliações", category: "Sociologia", century: "XXI", img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop" },
  { title: "Química Orgânica", author: "Morrison & Boyd", rating: 4.4, reviews: "29 k avaliações", category: "Química", century: "XX", img: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09a4?q=80&w=800&auto=format&fit=crop" },
  { title: "Atlas de Anatomia Humana", author: "Netter", rating: 4.8, reviews: "62 k avaliações", category: "Medicina", century: "XXI", img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop" },
  { title: "Introdução à Economia", author: "N. Gregory Mankiw", rating: 4.6, reviews: "45 k avaliações", category: "Economia", century: "XXI", img: "https://images.unsplash.com/photo-1554224154-22dec7ec8818?q=80&w=800&auto=format&fit=crop" }
];

const lastRequestData = [
  { title: "Dom Casmurro", author: "Machado de Assis", rating: 4.9, reviews: "55 k avaliações", img: booksData[0].img },
  { title: "Pedagogia da Autonomia", author: "Paulo Freire", rating: 4.8, reviews: "65 k avaliações", img: booksData[3].img },
  { title: "Direito Constitucional Esquematizado", author: "Pedro Lenza", rating: 4.6, reviews: "30 k avaliações", img: booksData[4].img }
];

function stars(r){
  const full = Math.round(r);
  return "★★★★★☆☆☆☆☆".slice(5-full, 10-full);
}

function renderWriters(){
  const box = document.getElementById("writers");
  if(!box) return;
  box.innerHTML = writersData.map(w => `
    <div class="writer-card">
      <img src="${w.img}" alt="${w.name}">
      <div class="name">${w.name}</div>
      <div class="small">
        <span class="stars">★</span>${w.rating} • ${w.reviews}
      </div>
    </div>
  `).join("");
}

function renderBooks(list){
  const box = document.getElementById("books");
  if(!box) return;
  box.innerHTML = list.map(b => `
    <div class="book-card">
      <img src="${b.img}" alt="${b.title}">
      <div class="title">${b.title}</div>
      <div class="author">${b.author}</div>
      <div class="rate">
        <span class="stars">★</span>${b.rating} • ${b.reviews}
      </div>
    </div>
  `).join("");
}

function renderLast(){
  const box = document.getElementById("lastList");
  if(!box) return;
  box.innerHTML = lastRequestData.map((l,i)=>`
    <div class="last-item">
      <div>${i+1}</div>
      <img src="${l.img}" alt="${l.title}">
      <div>
        <div class="title">${l.title}</div>
        <div class="meta">${l.author}</div>
      </div>
      <div class="rating">
        <span class="stars">★</span>${l.rating} • ${l.reviews}
      </div>
    </div>
  `).join("");
}

function applyFilter(){
  const qEl = document.getElementById("q");
  const catEl = document.getElementById("category");
  const cenEl = document.getElementById("century");
  if(!qEl || !catEl || !cenEl) return;

  const q = qEl.value.trim().toLowerCase();
  const cat = catEl.value;
  const cen = cenEl.value;

  const filtered = booksData.filter(b=>{
    const matchQ = !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
    const matchC = !cat || b.category === cat;
    const matchCe = !cen || b.century === cen;
    return matchQ && matchC && matchCe;
  });

  renderBooks(filtered);
}

const goBtn = document.getElementById("go");
if(goBtn){
  goBtn.addEventListener("click", applyFilter);
}
const qInput = document.getElementById("q");
if(qInput){ qInput.addEventListener("input", applyFilter); }
const catSel = document.getElementById("category");
if(catSel){ catSel.addEventListener("change", applyFilter); }
const cenSel = document.getElementById("century");
if(cenSel){ cenSel.addEventListener("change", applyFilter); }

// Logout link & header user role
const logoutLink = document.getElementById('logoutLink');
if(logoutLink){ logoutLink.addEventListener('click', e => { e.preventDefault(); if(window.Auth) Auth.logout(); }); }
const topUser = document.querySelector('.user');
if(topUser && window.Auth){
  const sess = Auth.currentSession();
  if(sess){
    let roleSpan = topUser.querySelector('.role-label');
    if(!roleSpan){ roleSpan = document.createElement('span'); roleSpan.className='role-label'; topUser.appendChild(roleSpan); }
    roleSpan.textContent = sess.role;
    roleSpan.style.fontSize='11px';
    roleSpan.style.background='#f1f5f9';
    roleSpan.style.padding='4px 8px';
    roleSpan.style.borderRadius='10px';
    roleSpan.style.fontWeight='600';
  }
}

// init
renderWriters();
renderLast();
renderBooks(booksData);
