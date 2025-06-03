# 📊 Sistema de Tracking Profissional - PleasureGame

## 🎯 Visão Geral

Sistema de tracking multi-plataforma implementado para monitorar conversões e comportamento do usuário na landing page de vendas dos planos vitalícios.

## 🔧 Tecnologias Integradas

### 1. **Facebook Pixel** 
- **ID**: `1724726318150294`
- **Eventos**: `PageView`, `ViewContent`, `InitiateCheckout`
- **Eventos Customizados**: `InitiateCheckout_BASICO`, `InitiateCheckout_MEDIO`, `InitiateCheckout_PREMIUM`

### 2. **UTMify**
- **Pixel ID**: `6834d81d4324d1bcbedc393f`
- **Scripts**: UTM amplo + Pixel personalizado
- **API**: Envio de eventos customizados

### 3. **Google Analytics 4** (Opcional)
- **Eventos**: `view_item`, `begin_checkout`
- **Enhanced Ecommerce**: Dados estruturados de produtos

### 4. **Google Tag Manager** (Opcional)
- **DataLayer**: Eventos estruturados para GTM
- **Ecommerce**: Dados completos de conversão

## 📋 Estrutura de Eventos

### Evento Principal: `InitiateCheckout`

**Disparado quando**: Usuário clica no botão de um plano

**Dados enviados**:
```javascript
{
  content_name: "Nome do Plano",
  content_category: "Lifetime_Subscription",
  content_ids: ["basico|medio|premium"],
  content_type: "product",
  value: 47.90|57.90|77.90,
  currency: "BRL",
  num_items: 1
}
```

### Eventos Customizados por Plano

| Plano | Evento Facebook | Evento UTMify | Preço |
|-------|----------------|---------------|-------|
| 🩷 **Básico** | `InitiateCheckout_BASICO` | `checkout_plano_basico` | R$ 47,90 |
| 💜 **Médio** | `InitiateCheckout_MEDIO` | `checkout_plano_medio` | R$ 57,90 |
| 💖 **Premium** | `InitiateCheckout_PREMIUM` | `checkout_plano_premium` | R$ 77,90 |

### Evento Secundário: `ViewContent`

**Disparado quando**: Usuário passa o mouse sobre um plano

**Finalidade**: Rastrear interesse sem conversão

## 🏗️ Arquitetura do Sistema

### Arquivos Principais

```
src/
├── components/common/PixelManager.tsx    # Gerenciador central
├── config/pixels.ts                     # Configurações
├── components/vendas/PlansSection.tsx   # Implementação
└── app/layout.tsx                       # Carregamento global
```

### Fluxo de Dados

1. **Carregamento**: Scripts carregados no `layout.tsx`
2. **Visualização**: `trackPlanView()` no hover do plano
3. **Conversão**: `trackPlanCheckout()` no clique do botão
4. **Envio**: Múltiplas plataformas simultaneamente

## 🔒 Segurança e Boas Práticas

### ✅ Implementado

- **Configuração centralizada**: IDs em arquivo separado
- **Tratamento de erros**: Try/catch com fallbacks
- **Tipagem TypeScript**: Tipos seguros para planos
- **Logs condicionais**: Debug apenas em desenvolvimento
- **NoScript fallback**: Suporte para usuários sem JS
- **Validação de window**: Verificação de ambiente browser

### 🛡️ Segurança

- **Sem dados sensíveis**: Apenas IDs de planos e preços
- **HTTPS obrigatório**: Todas as requisições seguras
- **Validação de tipos**: TypeScript previne erros
- **Rate limiting**: Evita spam de eventos

## 📈 Métricas Disponíveis

### Facebook Ads Manager

- **Conversões por plano**: Eventos customizados específicos
- **Valor de conversão**: Preço real de cada plano
- **Funil completo**: ViewContent → InitiateCheckout
- **Audiências**: Segmentação por interesse em planos

### UTMify Dashboard

- **Origem do tráfego**: UTMs completos do Facebook
- **Jornada do usuário**: Tracking completo da sessão
- **Conversões**: Eventos de checkout por plano
- **ROI**: Cálculo automático de retorno

### Google Analytics

- **Enhanced Ecommerce**: Dados estruturados de produtos
- **Funil de conversão**: Visualização → Checkout
- **Segmentação**: Por tipo de plano escolhido
- **Atribuição**: Canais de conversão

## 🚀 Como Usar

### Para Desenvolvedores

```typescript
import { trackPlanCheckout, trackPlanView } from '@/components/common/PixelManager';

// Rastrear visualização
trackPlanView('basico');

// Rastrear checkout
trackPlanCheckout('premium', 'Plano Premium', 77.90);
```

### Para Marketing

1. **Campanhas Facebook**: Use eventos customizados como conversões
2. **Otimização**: Foque nos planos com maior InitiateCheckout
3. **Remarketing**: Crie audiências baseadas em ViewContent
4. **A/B Testing**: Compare performance entre planos

## 🔧 Configuração de Campanhas

### UTM Template Recomendado

```
utm_source=FB&utm_campaign={{campaign.name}}|{{campaign.id}}&utm_medium={{adset.name}}|{{adset.id}}&utm_content={{ad.name}}|{{ad.id}}&utm_term={{placement}}
```

### Eventos de Conversão Facebook

- **Primário**: `InitiateCheckout` (valor: preço do plano)
- **Secundário**: `InitiateCheckout_BASICO|MEDIO|PREMIUM`
- **Auxiliar**: `ViewContent` (para remarketing)

## 📊 Monitoramento

### Logs de Debug (Desenvolvimento)

```javascript
🎯 Professional Pixel Tracking - Plan Checkout
├── Plan Details: { plan_id, plan_name, plan_value, currency, timestamp }
├── Facebook Pixel ID: 1724726318150294
└── UTMify Pixel ID: 6834d81d4324d1bcbedc393f
```

### Verificação de Funcionamento

1. **Console do navegador**: Verificar logs em desenvolvimento
2. **Facebook Pixel Helper**: Extensão para validar eventos
3. **UTMify Dashboard**: Confirmar recebimento de eventos
4. **Network tab**: Verificar requisições para APIs

## 🎯 Próximos Passos

### Melhorias Futuras

- [ ] **Google Tag Manager**: Implementação completa
- [ ] **Hotjar/Clarity**: Heatmaps e session recordings
- [ ] **Eventos de engajamento**: Scroll depth, time on page
- [ ] **A/B Testing**: Implementação nativa
- [ ] **Conversões offline**: Integração com CRM

### Otimizações

- [ ] **Lazy loading**: Carregar pixels apenas quando necessário
- [ ] **Batch events**: Agrupar eventos para melhor performance
- [ ] **Cache**: Evitar eventos duplicados
- [ ] **Compression**: Reduzir payload dos eventos

---

**Última atualização**: Dezembro 2024  
**Versão**: 1.0.0  
**Responsável**: Equipe de Desenvolvimento PleasureGame 