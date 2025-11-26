import assert from 'assert';
import fs from 'fs';
import vm from 'vm';

// Simula ambiente mínimo para search.js
const code = fs.readFileSync('scripts/search.js','utf8');
const documentStub = {
  body:{ appendChild:()=>{} },
  addEventListener:()=>{},
  querySelector:()=>null,
  getElementById:()=>null
};
const context = { window:{}, document: documentStub, navigator:{ serviceWorker:null }, console };
vm.createContext(context);
vm.runInContext(code, context);
console.log('searchIndex.test.js carregado sem erros');
assert.ok(true);
