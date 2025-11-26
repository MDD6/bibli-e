# Bibli-E (Biblioteca Universitária Unifor)

Bibli-E é uma aplicação SPA (Single Page Application) em HTML/CSS/JavaScript puro que simula uma biblioteca universitária da Unifor. Inclui catálogo de livros e periódicos, jogos, sistema de empréstimos, renovações, reservas em fila com promoção automática, painel administrativo, busca global (overlay + página dedicada), histórico, PWA com cache e notificações locais.

## Visão Geral
- Arquitetura: SPA com roteamento via hash (`/#/rota`) e carregamento dinâmico de partials HTML em `views/` + scripts específicos.
- Persistência: `localStorage` para sessões, empréstimos, reservas, inventário persistente e preferências de busca/filtros.
- Autenticação: Login simples (localStorage) com papéis (`aluno`, `professor`, `admin`). Painel admin exige papel `admin`.
- PWA: `manifest.json` + `service-worker.js` (cache estático + network-first para partials). Suporte offline básico de assets.
- Notificações: Service Worker escuta mensagens e exibe `showNotification` quando reserva é promovida para empréstimo (permission necessária).
- Reservas & Fila: Cada item indisponível gera fila com posição e ETA estimado baseada em prazo padrão de empréstimo.
- Promoção Automática: Ao aumentar disponibilidade pelo admin ou devolver item, primeira reserva válida é promovida para empréstimo imediato e notificada.
- Busca Global: Overlay acionado por `Ctrl+K` ou botão; opção "Ver tudo" leva à rota `/buscar` com filtros avançados e exportação CSV.
- Testes: Node + VM sandbox validando lógica de `loanStore` (renovação, duplicidade de reservas) e carregamento do script de busca.

## Estrutura de Pastas
```
index.html               # Shell da SPA
styles/                  # CSS global
scripts/                 # Lógica modular (router, auth, loanStore, views, search, admin, notify)
views/                   # Partials HTML das rotas
service-worker.js        # Worker PWA
manifest.json            # Metadados PWA
tests/                   # Testes Node
README.md                # Este arquivo
package.json             # Scripts de teste
```

## Principais Scripts
- `router.js`: Mapeia rotas, carrega partial + script on-demand (lazy load). Simples, hash-based.
- `loanStore.js`: Núcleo de domínio (empréstimos, renovações, devoluções, reservas, promoção, inventário persistente e notificações).
- `auth.js`: Sessão e papel do usuário.
- `search.js` & `searchView.js`: Overlay global + página agregada com filtros e export.
- `admin.js`: Ajuste de disponibilidade, visualização de filas e promoção.
- `notify.js`: Solicita permissão de notificação.

## Fluxos Principais
1. Empréstimo: Item disponível -> criação de empréstimo com data de devolução (padrão 14 dias).
2. Renovação: Verifica limite de renovações e atraso antes de estender prazo.
3. Reserva: Item indisponível -> adiciona usuário à fila se não estiver já reservado.
4. Promoção: Disponibilidade + fila -> retira primeiro da fila e cria empréstimo automaticamente.
5. Notificação: Service Worker mostra push local (não real web push, somente API Notification).

## Como Usar
1. Abra `index.html` em um servidor local (necessário para Service Worker):
   - Opção rápida: `npx serve` ou `npx http-server` (instale com `npm i -g serve`).
   - PowerShell (Python 3): `python -m http.server 8080` (se Python instalado) e acesse `http://localhost:8080`.
2. Faça login (credenciais podem ser livres ou pré-validadas conforme implementação do formulário).
3. Navegue pelas rotas via menu ou hash.
4. Pressione `Ctrl+K` para abrir busca rápida.
5. Acesse `/admin` (se papel = admin) para ajustar inventário.
6. Conceda permissão de notificação ao navegador para avisos de promoção de reserva.

## Testes
- Instale dependências se houver (atualmente apenas Node padrão):
```
npm install
npm test
```
- `tests/loanStore.test.js`: Verifica renovação e bloqueio a reservas duplicadas.
- `tests/searchIndex.test.js`: Garante carregamento seguro de script de busca sem DOM real.

## Decisões de Design
- Sem framework para transparência educacional e facilidade de leitura.
- Roteador simples minimiza sobrecarga e evita dependências.
- `localStorage` suficiente para protótipo; futura evolução poderia migrar para API/DB.
- Estimativas de ETA em fila são heurísticas (duração média de empréstimo).
- Notificações locais apenas ilustrativas; Web Push real exigiria backend + assinatura VAPID.

## Limitações / Próximos Passos
- Segurança limitada (credenciais não hash, sessão client-side).
- Sem validação robusta de entrada (possível sanitização futura).
- Testes cobrindo apenas casos principais (expandir para promoção, devolução e admin).
- Falta API real para multi-dispositivo consistente.

## Roadmap Proposto
1. Backend Node/Express + ORM (Prisma) para persistência real.
2. Web Push (VAPID) com fila de notificações.
3. Relatórios estatísticos (uso por curso, atraso médio, taxa de renovação).
4. Mecanismo de penalidades por atraso (suspensões temporárias).
5. Internacionalização (i18n) multi-idioma.
6. Testes adicionais (fila de promoção, exportação CSV, busca combinada).

## Contribuição
1. Fork / Clone.
2. Criar branch feature (`git checkout -b feature/nova-funcionalidade`).
3. Executar testes antes do commit (`npm test`).
4. Pull Request descrevendo alteração e impacto.

## Licença
Protótipo acadêmico/demonstrativo. Sem licença formal definida; adicione conforme necessidade institucional.

---
Desenvolvido como exercício evolutivo de arquitetura front-end educacional.
