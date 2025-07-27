# 📊 Integração PiscaForm + Google Sheets

## 🎯 Visão Geral

Este guia te ensina como conectar o formulário PiscaForm ao Google Sheets usando Google Apps Script. Os dados serão:

- ✅ Salvos automaticamente no **localStorage** do navegador
- ✅ Enviados para uma **planilha do Google Sheets**
- ✅ Organizados com **cabeçalhos formatados**
- ✅ Com **timestamp** e dados completos

---

## 🚀 Passo a Passo

### **Etapa 1: Criar a Planilha do Google Sheets**

1. **Acesse:** [sheets.google.com](https://sheets.google.com)
2. **Clique:** "Planilha em branco"
3. **Renomeie:** Para "PiscaForm - Respostas" (ou outro nome de sua escolha)
4. **Anote o ID:** Na URL, copie o ID da planilha
   ```
   https://docs.google.com/spreadsheets/d/[SEU_ID_AQUI]/edit
   ```

### **Etapa 2: Configurar o Google Apps Script**

1. **Acesse:** [script.google.com](https://script.google.com)
2. **Clique:** "Novo projeto"
3. **Renomeie:** Para "PiscaForm Integration"
4. **Substitua todo o código padrão** pelo conteúdo do arquivo `apps-script.js`
5. **Edite as configurações no topo do código:**
   ```javascript
   const SHEET_NAME = 'PiscaForm Respostas'; // Nome da aba
   const SPREADSHEET_ID = 'SEU_ID_DA_PLANILHA_AQUI'; // Cole o ID da Etapa 1
   ```

### **Etapa 3: Fazer Deploy do Apps Script**

1. **Clique:** "Implantar" → "Nova implantação"
2. **Tipo:** Selecione "Aplicativo da web"
3. **Configurações:**
   - **Descrição:** "PiscaForm API"
   - **Executar como:** "Eu"
   - **Quem tem acesso:** "Qualquer pessoa"
4. **Clique:** "Implantar"
5. **Copie a URL:** Será algo como:
   ```
   https://script.google.com/macros/s/[SEU_ID]/exec
   ```

### **Etapa 4: Configurar o Frontend**

1. **Abra:** `picaform/src/app/page.tsx`
2. **Encontre a linha:**
   ```typescript
   const APPS_SCRIPT_URL = 'SUA_URL_DO_APPS_SCRIPT_AQUI';
   ```
3. **Substitua** pela URL copiada da Etapa 3:
   ```typescript
   const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/[SEU_ID]/exec';
   ```

### **Etapa 5: Autorizar Permissões**

1. **No Apps Script**, clique em "Executar" na função `testFunction`
2. **Autorize** todas as permissões solicitadas
3. **Verifique** se a planilha foi criada automaticamente com os cabeçalhos

---

## 🧪 Testando a Integração

### **Teste Manual no Apps Script:**

1. Execute a função `testFunction()`
2. Verifique se apareceu uma linha de teste na planilha

### **Teste no Formulário:**

1. Acesse: `http://localhost:3001`
2. Preencha o formulário completo
3. Finalize no último step
4. **Verifique:**
   - Console do navegador (F12) deve mostrar logs de sucesso
   - Planilha deve ter uma nova linha com os dados
   - localStorage deve conter os dados salvos

---

## 📋 Estrutura da Planilha

| Coluna | Descrição | Exemplo |
|--------|-----------|---------|
| **Data/Hora** | Timestamp automático | 23/07/2025 15:30:45 |
| **Nome** | Nome fornecido | João Silva |
| **WhatsApp** | Telefone com código | +5511999999999 |
| **Instagram** | Handle do Instagram | joaosilva |
| **Momento Atual** | Opção selecionada | A, B, C, D ou E |
| **Enviado em** | Data formatada PT-BR | 23/07/2025, 15:30:45 |
| **Timestamp** | ISO String | 2025-07-23T18:30:45.123Z |

---

## 🛠️ Funcionalidades

### **✅ LocalStorage Backup**
- Dados salvos automaticamente no navegador
- Carregamento automático se o usuário voltar
- Proteção contra perda de dados

### **✅ Envio Inteligente**
- Tentativa automática de envio para Google Sheets
- Fallback para localStorage se houver erro
- Logs detalhados no console

### **✅ Tratamento de Erros**
- Validação de URL do Apps Script
- Tratamento de falhas de rede
- Mensagens informativas no console

---

## 🐛 Solução de Problemas

### **❌ "URL do Apps Script não configurada"**
- Verifique se substituiu a URL no arquivo `page.tsx`
- Confirme se o deploy foi feito corretamente

### **❌ "Erro ao enviar para Google Sheets"**
- Verifique se as permissões foram autorizadas
- Teste a função `testFunction()` no Apps Script
- Confirme se a planilha existe e está acessível

### **❌ "Dados não aparecem na planilha"**
- Verifique se o ID da planilha está correto
- Confirme se o nome da aba está certo (`SHEET_NAME`)
- Verifique os logs no Apps Script (Execuções)

### **❌ "Erro de CORS"**
- Normal para Apps Script, use `mode: 'no-cors'`
- Dados ainda são enviados mesmo com erro de CORS
- Verifique na planilha se os dados chegaram

---

## 📱 Dados no LocalStorage

Os dados ficam salvos em:
```javascript
localStorage.getItem('piscaform_data')
```

Estrutura:
```json
{
  "name": "João Silva",
  "phone": "+5511999999999",
  "instagram": "joaosilva",
  "moment": "A",
  "timestamp": "2025-07-23T18:30:45.123Z",
  "submittedAt": "23/07/2025, 15:30:45"
}
```

---

## 🔧 Personalização

### **Modificar Campos da Planilha:**
Edite a função `setupHeaders()` no Apps Script:
```javascript
const headers = [
  'Data/Hora',
  'Nome',
  'WhatsApp',
  'Instagram',
  'Momento Atual',
  'Enviado em',
  'Timestamp',
  'Campo Extra' // Adicione aqui
];
```

### **Adicionar Validações:**
Modifique a função `addToSheet()` para validar dados antes de salvar.

### **Mudar Nome da Aba:**
Altere a constante `SHEET_NAME` no Apps Script.

---

## ✅ Checklist Final

- [ ] Planilha criada no Google Sheets
- [ ] ID da planilha copiado
- [ ] Apps Script configurado e implantado
- [ ] URL do Apps Script copiada
- [ ] Frontend configurado com a URL
- [ ] Permissões autorizadas no Apps Script
- [ ] Teste manual executado com sucesso
- [ ] Teste completo do formulário realizado
- [ ] Dados aparecendo corretamente na planilha

---

🎉 **Pronto! Sua integração está funcionando perfeitamente!**

Agora todos os dados do formulário serão salvos automaticamente no Google Sheets e também no localStorage como backup. 