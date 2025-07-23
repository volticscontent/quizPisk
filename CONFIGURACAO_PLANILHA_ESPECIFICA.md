# 📊 CONFIGURAÇÃO PISCAFORM - PLANILHA ESPECÍFICA

## 🎯 Integração com sua planilha
**URL da Planilha:** https://docs.google.com/spreadsheets/d/1D4X8vYJOltu13Xi9xrCUqqTBQVmg5EHDkYmj8B4_Bx4/edit?gid=0#gid=0

---

## 📋 PASSO A PASSO COMPLETO

### 1. 🔧 CONFIGURAR GOOGLE APPS SCRIPT

1. **Abra sua planilha no Google Sheets**
   - Acesse: https://docs.google.com/spreadsheets/d/1D4X8vYJOltu13Xi9xrCUqqTBQVmg5EHDkYmj8B4_Bx4/edit

2. **Acesse o Apps Script**
   - Clique em `Extensões` → `Apps Script`
   - Isso abrirá o editor do Google Apps Script

3. **Cole o código**
   - Apague todo código existente no editor
   - Cole todo o conteúdo do arquivo `apps-script-piscaform-final.js`
   - Renomeie o projeto para "PiscaForm Integration"

4. **Salve o projeto**
   - Pressione `Ctrl+S` ou clique no ícone de salvar
   - Nome sugerido: "PiscaForm - Planilha Específica"

### 2. 🔐 AUTORIZAR PERMISSÕES

1. **Execute a função de teste**
   - No dropdown de funções, selecione `testAuthorization`
   - Clique no botão ▶️ (Run)
   - Autorize todas as permissões solicitadas

2. **Confirme o acesso**
   - O script criará uma nova aba chamada "PiscaForm - Respostas"
   - Verifique se a aba foi criada na sua planilha

### 3. 🚀 FAZER DEPLOYMENT

1. **Criar novo deployment**
   - Clique em `Deploy` → `New deployment`
   - Clique no ícone ⚙️ ao lado de "Select type"
   - Selecione `Web app`

2. **Configurar o deployment**
   - **Description:** `PiscaForm Integration v1.0`
   - **Execute as:** `Me (seu-email@gmail.com)`
   - **Who has access:** `Anyone`

3. **Finalizar deployment**
   - Clique em `Deploy`
   - **IMPORTANTE:** Copie a URL do Web App que será gerada
   - Exemplo: `https://script.google.com/macros/s/AKfycbx.../exec`

### 4. 🔄 ATUALIZAR FRONTEND

Agora você precisa atualizar o código do React com a nova URL:

```javascript
// No arquivo: quizPisk/src/app/page.tsx
// Localize esta linha (aproximadamente linha 67):

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxN0vcCK71AATc6edkHFJRxMJiNU9-Go5DPC-WIGWKCRq0BzyezyCMajaAi5Q4_qrOM/exec';

// SUBSTITUA pela URL do seu deployment:
const APPS_SCRIPT_URL = 'SUA_URL_AQUI';
```

---

## ✅ VERIFICAR SE ESTÁ FUNCIONANDO

### Teste 1: Verificar Apps Script
1. Abra a URL do deployment no navegador
2. Você deve ver uma resposta JSON como:
```json
{
  "success": true,
  "message": "🎉 Apps Script PiscaForm está funcionando!",
  "spreadsheetId": "1D4X8vYJOltu13Xi9xrCUqqTBQVmg5EHDkYmj8B4_Bx4"
}
```

### Teste 2: Verificar Planilha
1. Acesse sua planilha
2. Verifique se existe a aba "PiscaForm - Respostas"
3. A aba deve ter os cabeçalhos formatados em azul

### Teste 3: Teste Completo
1. Execute o frontend: `npm run dev`
2. Acesse: http://localhost:3000
3. Preencha o formulário com dados de teste
4. Verifique se aparece uma nova linha na planilha

---

## 📊 ESTRUTURA DA PLANILHA

A aba "PiscaForm - Respostas" terá as seguintes colunas:

| Coluna | Campo | Exemplo |
|--------|--------|---------|
| A | Nome | João Silva |
| B | Email | joao@email.com |
| C | WhatsApp | +5511999999999 |
| D | Instagram | joaosilva |
| E | Momento Atual | A |
| F | Vendeu Fora | B |
| G | Faturamento | R$ 50.000 |
| H | Caixa Disponível | C |
| I | Problema Principal | A |
| J | Área de Ajuda | E |
| K | Possui Sócio | B |
| L | Por que escolher | Texto longo... |
| M | Compromisso | A |
| N | Data/Hora | 23/01/2025 14:30:15 |
| O | Status | VALIDADO |

---

## 🔧 SOLUÇÃO DE PROBLEMAS

### ❌ "Erro 401 - Unauthorized"
- Execute novamente `testAuthorization()` no Apps Script
- Autorize todas as permissões solicitadas
- Refaça o deployment

### ❌ "Planilha não encontrada"
- Verifique se o ID da planilha está correto no código
- Confirme que você tem acesso à planilha

### ❌ "Dados não aparecem na planilha"
- Verifique se a URL do deployment está correta no frontend
- Teste a URL diretamente no navegador
- Confira os logs no Apps Script: `Executions` → `View execution transcript`

### ❌ "CORS Error"
- Normal para requisições no-cors
- Os dados ainda devem ser salvos na planilha
- Verifique a planilha para confirmar

---

## 🎉 PRONTO!

Após seguir todos os passos:

1. ✅ O formulário estará integrado com sua planilha específica
2. ✅ Cada submissão criará uma nova linha automaticamente
3. ✅ Os dados serão validados e formatados corretamente
4. ✅ Você terá acesso completo aos dados coletados

---

## 📞 SUPORTE

Se precisar de ajuda:

1. **Verifique os logs:** Apps Script → `Executions`
2. **Teste passo a passo:** Use as funções de teste
3. **Dados salvos localmente:** O frontend sempre salva no localStorage como backup

---

**Versão:** Final - Planilha Específica  
**Data:** 23/01/2025  
**Status:** ✅ Pronto para produção 