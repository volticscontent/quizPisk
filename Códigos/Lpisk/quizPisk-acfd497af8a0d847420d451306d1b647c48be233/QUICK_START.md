# 🚀 Quick Start - Integração Google Sheets

## ⚡ Configuração Rápida (5 minutos)

### **1. Crie a Planilha** 
- Acesse: [sheets.google.com](https://sheets.google.com)
- Crie planilha em branco
- Copie o ID da URL

### **2. Configure o Apps Script**
- Acesse: [script.google.com](https://script.google.com)
- Novo projeto → Cole o código de `apps-script.js`
- Edite as configurações:
  ```javascript
  const SPREADSHEET_ID = 'SEU_ID_AQUI';
  ```

### **3. Faça o Deploy**
- "Implantar" → "Nova implantação" → "Aplicativo da web"
- "Qualquer pessoa" pode acessar
- Copie a URL gerada

### **4. Configure o Frontend**
- Abra `src/app/page.tsx`
- Substitua:
  ```typescript
  const APPS_SCRIPT_URL = 'SUA_URL_COPIADA_AQUI';
  ```

### **5. Teste!**
- Acesse: `http://localhost:3001`
- Preencha o formulário
- Verifique os dados na planilha

---

## 📋 Checklist Rápido

- [ ] Planilha criada
- [ ] Apps Script configurado e deployed  
- [ ] URL configurada no frontend
- [ ] Teste realizado com sucesso

---

## 📚 Documentação Completa

- **Setup Detalhado:** `GOOGLE_SHEETS_SETUP.md`
- **Resumo Técnico:** `INTEGRATION_SUMMARY.md`
- **Código Apps Script:** `apps-script.js`

---

🎯 **Pronto em 5 minutos!** Seu formulário já está conectado ao Google Sheets! 