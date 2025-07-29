# 🔗 Integração N8N - Guia Completo

## 📋 Índice
- [Visão Geral](#visão-geral)
- [Configuração Inicial](#configuração-inicial)
- [Webhooks Configurados](#webhooks-configurados)
- [Fluxo de Dados](#fluxo-de-dados)
- [Automações Implementadas](#automações-implementadas)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

O **N8N** é uma plataforma de automação workflow que conecta diferentes serviços e APIs. No projeto QuizPisk, ele atua como:

- **Hub central de dados** do quiz
- **Processador de leads** em tempo real
- **Integrador** com PostgreSQL e Calendly
- **Automatizador** de follow-ups e notificações

### 📊 Arquitetura de Integração

```
QuizPisk (Frontend) 
    ↓ [Webhook HTTP POST]
N8N (Automation Hub)
    ├── PostgreSQL (Database)
    ├── Email Automation
    └── Calendly Integration
```

---

## ⚙️ Configuração Inicial

### 1. 🌐 URLs dos Webhooks

No arquivo `src/app/utils/constants.ts`:

```typescript
export const N8N_WEBHOOK_URL = 'https://n8n.landcriativa.com/webhook/84909c05-c376-4ebe-a630-7ef428ff1826';
export const POSTGRES_WEBHOOK_URL = 'https://n8n.landcriativa.com/webhook/postgres';
```

### 2. 🔧 Função de Envio Principal

No arquivo `src/app/page.tsx`:

```typescript
const sendToN8nWebhook = async (formData: FormData) => {
  console.log('📤 Enviando dados para n8n webhook...', formData);
  
  try {
    // Verificação de ambiente
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      console.warn('⚠️ Desenvolvimento local detectado, simulando envio bem-sucedido para n8n');
      return true;
    }

    // Verificação de URL configurada
    if (!N8N_WEBHOOK_URL || N8N_WEBHOOK_URL.includes('localhost')) {
      console.warn('⚠️ N8N webhook não configurado ou em localhost, pulando envio');
      return false;
    }

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
      signal: AbortSignal.timeout(10000) // Timeout de 10 segundos
    });

    if (response.ok) {
      const responseData = await response.text();
      console.log('✅ Dados enviados com sucesso para n8n!', responseData);
      return true;
    } else {
      console.warn('⚠️ Erro ao enviar para n8n:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.warn('⚠️ Erro de conexão com n8n (não crítico):', error);
    return false;
  }
};
```

---

## 🔗 Webhooks Configurados

### 1. 📋 Webhook Principal - Quiz Completo
**URL:** `https://n8n.landcriativa.com/webhook/84909c05-c376-4ebe-a630-7ef428ff1826`

**Dados Enviados:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "phone": "+5511999999999",
  "instagram": "joaosilva",
  "moment": "Estou começando do zero no digital",
  "vendeuFora": "Nunca vendi",
  "faturamento": "100000",
  "caixaDisponivel": "De R$5.000 a R$7.000",
  "problemaPrincipal": "Margem baixa vendendo no Brasil",
  "areaAjuda": "Todos",
  "possuiSocio": "Não",
  "porQueEscolher": "Quero escalar meu negócio...",
  "compromisso": "Sim, me comprometo",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "submittedAt": "15/01/2024 07:30:00"
}
```

### 2. 📊 Webhook PostgreSQL - Leads Parciais
**URL:** `https://n8n.landcriativa.com/webhook/postgres`

**Dados Enviados por Step:**
```json
{
  "session_id": "1705315800123",
  "step_name": "email",
  "step_number": 3,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "submitted_at": "15/01/2024 07:30:00",
  "user_agent": "Mozilla/5.0...",
  "page_url": "https://quizpisk.com/",
  "referrer": "https://google.com/",
  "current_email": "joao@email.com",
  "progress_percentage": 30,
  "is_complete": false
}
```

---

## 🔄 Fluxo de Dados

### 1. 📝 Coleta de Dados por Step

```typescript
// Função chamada a cada step do quiz
const sendPartialLead = async (stepName: string, stepData: { [key: string]: string }) => {
  const partialLeadData = {
    session_id: sessionId,
    step_name: stepName,
    step_number: getStepNumber(stepName as QuizStep),
    timestamp: new Date().toISOString(),
    submitted_at: new Date().toLocaleString('pt-BR'),
    user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
    page_url: typeof window !== 'undefined' ? window.location.href : '',
    referrer: typeof window !== 'undefined' ? document.referrer : '',
    ...stepData,
    progress_percentage: getProgressForStep(stepName as QuizStep),
    is_complete: false
  };

  // Envia para PostgreSQL via N8N
  await fetch(POSTGRES_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(partialLeadData),
    signal: AbortSignal.timeout(5000)
  });
};
```

### 2. 🎯 Finalização do Quiz

```typescript
const finishQuiz = async () => {
  const formData = saveToLocalStorage({
    name, phone, email, instagram,
    selectedMoment, vendeuFora, faturamento,
    caixaDisponivel, problemaPrincipal,
    areaAjuda, possuiSocio, porQueEscolher, compromisso,
    selectedCountry
  });
  
  // Envio seguro via N8N Bridge
  const n8nResult = isN8NRegistered ? 
    await sendToN8NSecure(formData).then(result => result.success) :
    false;
  
  console.log('✅ Quiz finalizado e enviado para N8N!');
};
```

---

## 🤖 Automações Implementadas

### 1. 📊 Workflow de Lead Processing

**Trigger:** Webhook recebe dados do quiz
**Steps:**
1. **Validação de dados** recebidos
2. **Enrichment** com dados adicionais
3. **Salvamento** no PostgreSQL
4. **Notificação** por email/Slack
5. **Trigger** de follow-up

### 2. 📈 Workflow de Lead Parcial

**Trigger:** Webhook PostgreSQL recebe step data
**Steps:**
1. **Identificação** da sessão existente
2. **Update** dos dados parciais
3. **Cálculo** do progresso
4. **Detecção** de abandono
5. **Trigger** de recuperação (se necessário)

### 3. 🎯 Workflow de Conversão

**Trigger:** Quiz completado + Calendly clicado
**Steps:**
1. **Marcação** como lead qualificado
2. **Criação** de oportunidade no CRM
3. **Agendamento** de follow-up
4. **Notificação** da equipe comercial

---

## 🔧 Configuração do N8N

### 1. 🎛️ Webhook Nodes

**Main Webhook (Quiz Completo):**
```yaml
Webhook URL: /webhook/84909c05-c376-4ebe-a630-7ef428ff1826
HTTP Method: POST
Authentication: None
Response Mode: Respond Immediately
Response Data: "success"
```

**PostgreSQL Webhook (Leads Parciais):**
```yaml
Webhook URL: /webhook/postgres
HTTP Method: POST
Authentication: None
Response Mode: Respond Immediately
Response Data: "received"
```

### 2. 🗄️ Database Connections

**PostgreSQL Connection:**
```yaml
Host: seu-postgres-host.com
Port: 5432
Database: quizpisk_leads
Username: n8n_user
Password: [ENCRYPTED]
SSL: enabled
```

**Tables Structure:**
```sql
-- Tabela de leads completos
CREATE TABLE quiz_leads (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(255),
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  instagram VARCHAR(100),
  moment TEXT,
  vendeu_fora TEXT,
  faturamento VARCHAR(50),
  caixa_disponivel TEXT,
  problema_principal TEXT,
  area_ajuda TEXT,
  possui_socio TEXT,
  por_que_escolher TEXT,
  compromisso TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de leads parciais (tracking de progresso)
CREATE TABLE quiz_partial_leads (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(255),
  step_name VARCHAR(50),
  step_number INTEGER,
  step_data JSONB,
  progress_percentage INTEGER,
  is_complete BOOLEAN DEFAULT FALSE,
  user_agent TEXT,
  page_url TEXT,
  referrer TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. 📧 Email Automations

**Welcome Email Workflow:**
```yaml
Trigger: Quiz completed
Condition: email provided
Action: Send welcome email via SMTP
Template: quiz_completion_template.html
```

**Follow-up Sequence:**
```yaml
Trigger: Lead created
Delay: 1 hour
Action: Send follow-up email
Template: follow_up_template.html
```

---

## 📊 Monitoramento e Analytics

### 1. 📈 Métricas Coletadas

- **Taxa de conversão** por step
- **Tempo médio** de conclusão
- **Taxa de abandono** por pergunta
- **Origem do tráfego** (referrer)
- **Dispositivos** utilizados
- **Horários** de maior engajamento

### 2. 🎯 Dashboards

**Lead Funnel Dashboard:**
- Visualização do funil de conversão
- Identificação de gargalos
- Análise de abandono por step

**Performance Dashboard:**
- Volume de leads por dia/hora
- Qualidade dos leads (completos vs parciais)
- Tempo de resposta dos webhooks

---

## 🚨 Troubleshooting

### 1. ❌ Problemas Comuns

**Erro: "Failed to fetch"**
```javascript
// Solução: Verificar conectividade e timeout
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  console.warn('⚠️ Desenvolvimento local detectado, simulando envio bem-sucedido');
  return true;
}
```

**Erro: "Webhook timeout"**
```javascript
// Solução: Aumentar timeout e adicionar retry
signal: AbortSignal.timeout(10000) // 10 segundos
```

**Erro: "Invalid JSON"**
```javascript
// Solução: Validar dados antes do envio
if (!formData || typeof formData !== 'object') {
  console.error('Dados inválidos para envio');
  return false;
}
```

### 2. 🔍 Debug e Logs

**Console Logs:**
```javascript
console.log('📤 Enviando dados para n8n webhook...', formData);
console.log('🔗 URL n8n utilizada:', N8N_WEBHOOK_URL);
console.log('✅ Dados enviados com sucesso para n8n!', responseData);
```

**N8N Execution Logs:**
- Acessar N8N Admin Panel
- Verificar "Executions" tab
- Analisar logs de erro detalhados
- Verificar payload recebido

### 3. 🛠️ Testes

**Teste Local:**
```bash
# Simular webhook call
curl -X POST https://n8n.landcriativa.com/webhook/84909c05-c376-4ebe-a630-7ef428ff1826 \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","email":"teste@email.com"}'
```

**Teste de Integração:**
1. Completar quiz em ambiente de teste
2. Verificar logs no N8N
3. Confirmar dados no PostgreSQL

---

## 📋 Checklist de Configuração

### ✅ Setup Inicial
- [ ] N8N instalado e configurado
- [ ] Webhooks criados e testados
- [ ] PostgreSQL conectado
- [ ] URLs configuradas no frontend

### ✅ Workflows
- [ ] Lead processing workflow ativo
- [ ] Partial lead tracking ativo
- [ ] Email automation configurada
- [ ] Error handling implementado

### ✅ Monitoramento
- [ ] Logs configurados
- [ ] Alertas de erro ativos
- [ ] Dashboard de métricas
- [ ] Backup automático

### ✅ Testes
- [ ] Webhook funcionando
- [ ] Dados chegando no PostgreSQL
- [ ] Emails sendo enviados
- [ ] Error handling testado

---

## 🎯 Próximos Passos

1. **Implementar retry logic** para falhas de webhook
2. **Adicionar rate limiting** para evitar spam
3. **Criar workflow de recuperação** de leads abandonados
4. **Implementar A/B testing** via N8N
5. **Adicionar integração com CRM** (HubSpot/Pipedrive)

---

## 📞 Suporte

**Documentação N8N:** https://docs.n8n.io/
**Status da API:** https://n8n.landcriativa.com/health
**Logs em Tempo Real:** N8N Admin Panel > Executions

---

*Documento atualizado em: Dezembro 2024*
*Versão: 2.0* 