# 🚀 Deploy na Vercel com SSE - Guia Completo

## 📋 Índice
- [Visão Geral](#visão-geral)
- [Configuração SSE](#configuração-sse)
- [Deploy na Vercel](#deploy-na-vercel)
- [Funcionalidades Implementadas](#funcionalidades-implementadas)
- [Monitoramento](#monitoramento)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

O projeto QuizPisk agora possui **Server-Sent Events (SSE)** implementado com **Edge Runtime** da Vercel, oferecendo:

- ✅ **Atualizações em tempo real** do progresso do quiz
- ✅ **Reconexão automática** em caso de falha
- ✅ **Heartbeat** para manter conexões ativas
- ✅ **Backpressure** com ReadableStream
- ✅ **Escalabilidade** otimizada para Vercel

### 🏗️ Arquitetura SSE

```
Frontend (React Hook)
    ↓ EventSource
API Route (/api/quiz-updates)
    ↓ ReadableStream + Edge Runtime
Vercel Edge Network
    ↓ Real-time Updates
Multiple Clients
```

---

## ⚙️ Configuração SSE

### 1. 🌐 APIs Criadas

**SSE Stream API:**
```typescript
// /api/quiz-updates/route.ts
export const runtime = 'edge'; // Edge Runtime para performance
```

**Progress Update API:**
```typescript
// /api/quiz-progress/route.ts
export const runtime = 'edge'; // Edge Runtime para latência baixa
```

### 2. 🔧 Edge Runtime Features

**Vantagens do Edge Runtime:**
- ✅ **Latência ultra-baixa** (< 100ms)
- ✅ **Global distribution** automática
- ✅ **Cold start** praticamente zero
- ✅ **Streaming** nativo
- ✅ **WebAPI padrão** (Response, Request, etc.)

**Limitações:**
- ❌ **Sem Node.js APIs** (fs, path, etc.)
- ❌ **Sem npm packages** que dependem de Node.js
- ❌ **Runtime limitado** a 30 segundos por request

### 3. 📡 Implementação SSE

**ReadableStream com Backpressure:**
```typescript
const stream = new ReadableStream({
  start(controller) {
    // Armazena conexão
    connections.set(sessionId, controller);
    
    // Heartbeat para keep-alive
    const heartbeat = setInterval(() => {
      controller.enqueue(encoder.encode('data: {"type":"heartbeat"}\n\n'));
    }, 30000);
    
    // Cleanup automático
    request.signal.addEventListener('abort', cleanup);
  },
  
  cancel() {
    connections.delete(sessionId);
  }
});
```

---

## 🚀 Deploy na Vercel

### 1. 📦 Preparação

**Instalar Vercel CLI:**
```bash
npm install -g vercel
```

**Login na Vercel:**
```bash
vercel login
```

### 2. 🔧 Configuração do Projeto

**vercel.json configurado:**
```json
{
  "functions": {
    "src/app/api/quiz-updates/route.ts": {
      "maxDuration": 300
    }
  },
  "headers": [
    {
      "source": "/api/quiz-updates",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        },
        {
          "key": "Connection", 
          "value": "keep-alive"
        }
      ]
    }
  ]
}
```

**next.config.js otimizado:**
```javascript
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Connection',
            value: 'keep-alive',
          },
        ],
      },
    ]
  },
}
```

### 3. 🚀 Comandos de Deploy

**Deploy de Desenvolvimento:**
```bash
vercel --dev
```

**Deploy de Produção:**
```bash
vercel --prod
```

**Deploy Automático via Git:**
```bash
git push origin main
# Vercel faz deploy automático
```

### 4. 🌍 URLs de Produção

**Frontend:**
```
https://seu-projeto.vercel.app
```

**SSE Endpoint:**
```
https://seu-projeto.vercel.app/api/quiz-updates?sessionId=123
```

**Progress API:**
```
https://seu-projeto.vercel.app/api/quiz-progress
```

---

## 🎯 Funcionalidades Implementadas

### 1. 🔄 Atualizações em Tempo Real

**Frontend Hook:**
```typescript
const { isConnected, sendQuizProgress } = useSSE({
  sessionId,
  autoConnect: true,
  reconnectInterval: 3000,
  maxReconnectAttempts: 5
});

// Envia progresso automaticamente
useEffect(() => {
  if (isConnected && currentStep !== 'name') {
    sendQuizProgress(currentStep, progressPercentage, {
      step_number: stepNumber,
      total_steps: 13,
      time_spent: timeSpent
    });
  }
}, [currentStep, isConnected]);
```

### 2. 💓 Heartbeat e Keep-Alive

**Mantém Conexão Viva:**
```typescript
// Heartbeat a cada 30 segundos
const heartbeat = setInterval(() => {
  controller.enqueue(encoder.encode('data: {"type":"heartbeat","timestamp":"' + new Date().toISOString() + '"}\n\n'));
}, 30000);
```

### 3. 🔄 Reconexão Automática

**Retry Logic:**
```typescript
eventSource.onerror = (error) => {
  setIsConnected(false);
  
  if (reconnectAttempts < maxReconnectAttempts) {
    setTimeout(() => {
      setReconnectAttempts(prev => prev + 1);
      connect();
    }, reconnectInterval);
  }
};
```

### 4. 📊 Indicador Visual

**Status de Conexão:**
```typescript
// Indicador no footer
<div style={{ color: isSSEConnected ? '#4CAF50' : '#f44336' }}>
  <div style={{ backgroundColor: isSSEConnected ? '#4CAF50' : '#f44336' }}></div>
  {isSSEConnected ? 'Conectado' : 'Desconectado'}
</div>
```

---

## 📊 Monitoramento

### 1. 📈 Métricas da Vercel

**Dashboard Vercel:**
- **Function Invocations** (chamadas SSE)
- **Edge Network** requests
- **Bandwidth** usage
- **Error Rate** das APIs

**URLs de Monitoramento:**
```
https://vercel.com/dashboard
https://vercel.com/analytics
```

### 2. 🔍 Logs em Tempo Real

**Console Logs:**
```javascript
console.log('✅ SSE Connected');
console.log('📨 SSE Message:', data);
console.log('📤 Quiz progress sent:', result);
console.error('❌ SSE Error:', error);
```

**Vercel Functions Logs:**
```bash
vercel logs [deployment-url]
```

### 3. 📊 Analytics Customizados

**Eventos Trackados:**
- **SSE connections** iniciadas
- **Messages sent** via SSE
- **Reconnection attempts**
- **Quiz progress** updates
- **Connection duration**

---

## 🚨 Troubleshooting

### 1. ❌ Problemas Comuns

**SSE não conecta:**
```typescript
// Verificar se está em HTTPS
if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
  console.error('SSE requer HTTPS em produção');
}
```

**Timeout das conexões:**
```javascript
// Verificar maxDuration no vercel.json
{
  "functions": {
    "src/app/api/quiz-updates/route.ts": {
      "maxDuration": 300  // 5 minutos máximo
    }
  }
}
```

**Edge Runtime errors:**
```typescript
// Verificar se não está usando Node.js APIs
// ❌ Não usar: fs, path, crypto (Node.js)
// ✅ Usar: crypto (Web API), fetch, Response
```

### 2. 🔧 Debug de Conexões

**Test SSE no Browser:**
```javascript
// Console do navegador
const eventSource = new EventSource('/api/quiz-updates?sessionId=test');
eventSource.onmessage = (event) => console.log(event.data);
```

**Test via cURL:**
```bash
curl -N -H "Accept: text/event-stream" \
  "https://seu-projeto.vercel.app/api/quiz-updates?sessionId=test"
```

### 3. 📊 Performance

**Otimizações Vercel:**
- ✅ **Edge Runtime** habilitado
- ✅ **Gzip compression** automática
- ✅ **Global CDN** distribution
- ✅ **HTTP/2** push

**Limits da Vercel (Hobby):**
- **100GB** bandwidth/mês
- **100** function executions/dia
- **10 segundos** execution time (Edge: 30s)

---

## 🎯 Próximos Passos

### 1. 🔄 Escalabilidade

**Para múltiplos usuários:**
```typescript
// Implementar Redis para shared state
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});
```

### 2. 📊 Analytics Avançados

**Integração com Analytics:**
- **Amplitude** para user journey
- **DataDog** para performance
- **Sentry** para error tracking

### 3. 🔐 Autenticação

**Secure SSE:**
```typescript
// JWT token validation
const token = searchParams.get('token');
const isValid = await verifyJWT(token);
```

---

## 📋 Checklist de Deploy

### ✅ Pré-Deploy
- [ ] **Edge Runtime** configurado
- [ ] **vercel.json** configurado
- [ ] **Environment variables** definidas
- [ ] **SSE endpoints** testados localmente

### ✅ Deploy
- [ ] **Vercel CLI** instalado
- [ ] **Git repository** conectado
- [ ] **Build** bem-sucedido
- [ ] **Functions** deployadas

### ✅ Pós-Deploy
- [ ] **SSE connection** funcionando
- [ ] **Progress updates** enviando
- [ ] **Reconnection** funcionando
- [ ] **Performance** otimizada

### ✅ Monitoramento
- [ ] **Logs** configurados
- [ ] **Analytics** funcionando
- [ ] **Error tracking** ativo
- [ ] **Performance** monitorado

---

## 📞 Suporte

**Documentação Vercel:** https://vercel.com/docs
**SSE MDN:** https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events
**Edge Runtime:** https://vercel.com/docs/functions/edge-functions

---

*Documento atualizado em: Dezembro 2024*
*Versão SSE: 1.0* 