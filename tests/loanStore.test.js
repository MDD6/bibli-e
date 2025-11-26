import assert from 'assert';
import fs from 'fs';
import vm from 'vm';

// Carrega loanStore.js em contexto isolado simulando browser
const code = fs.readFileSync('scripts/loanStore.js','utf8');
const context = { window:{}, navigator:{}, localStorage: new Map(), console };
context.localStorage.getItem = k => context.localStorage.has(k) ? context.localStorage.get(k) : null;
context.localStorage.setItem = (k,v) => context.localStorage.set(k,v);
vm.createContext(context);
vm.runInContext(code, context);
const LoanStore = context.window.LoanStore;

assert.ok(LoanStore, 'LoanStore disponível');
const loans = LoanStore.getLoans();
assert.ok(Array.isArray(loans) && loans.length>0, 'Seed de empréstimos carregado');

// Test renovar limites
const primeiro = loans[0];
const resultadoRenov = LoanStore.renovar(primeiro.codigo, 3);
assert.ok(resultadoRenov.ok, 'Renovação deve funcionar');

// Test reserva livro duplicada
const res1 = LoanStore.reservarLivro('Dom Casmurro','aluno');
assert.ok(res1.ok, 'Primeira reserva ok');
const res2 = LoanStore.reservarLivro('Dom Casmurro','aluno');
assert.ok(!res2.ok, 'Reserva duplicada bloqueada');

console.log('loanStore.test.js OK');