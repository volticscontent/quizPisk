# 🎯 Meta Pixel e Rastreamento UTM - Configuração Completa

## ✅ O que foi implementado:

### 1. Meta Pixel Instalado
- **Pixel ID**: `1665742907429984`
- **Localização**: `src/app/layout.tsx`
- **Funcionalidades**:
  - ✅ PageView automático com UTMs
  - ✅ Captura de todos os parâmetros UTM da URL
  - ✅ Armazenamento dos UTMs no sessionStorage
  - ✅ Fallback noscript para usuários sem JavaScript

### 2. Hook Personalizado para UTMs
- **Arquivo**: `src/app/hooks/useUtmTracking.ts`
- **Funcionalidades**:
  - ✅ Captura UTMs da URL atual
  - ✅ Recupera UTMs armazenados no sessionStorage
  - ✅ Função `trackLead()` para evento de conversão
  - ✅ Função `trackCustomEvent()` para eventos personalizados

### 3. Evento de Lead Implementado
- **Localização**: `src/app/page.tsx` (função `finishQuiz()`)
- **Trigger**: Quando o usuário completa o formulário
- **Dados enviados**:
  - ✅ Todos os parâmetros UTM
  - ✅ Dados do formulário (nome, email, phone, etc.)
  - ✅ Informações do negócio (faturamento, momento, etc.)
  - ✅ Timestamp de conclusão
  - ✅ Status do envio (sucesso/parcial/falha)

## 🧪 Como testar:

### 1. Teste com UTMs
Acesse sua aplicação com UTMs na URL:
```
http://localhost:3000?utm_source=facebook&utm_medium=cpc&utm_campaign=quiz_leads&utm_content=botao_azul&utm_term=consultoria
```

### 2. Verificar no Console
Abra o Developer Tools e verifique:
- ✅ `fbq` está disponível no console
- ✅ Logs de UTMs capturados
- ✅ Evento Lead sendo enviado

### 3. Facebook Events Manager
1. Acesse [Facebook Events Manager](https://www.facebook.com/events_manager)
2. Selecione seu Pixel ID: `1665742907429984`
3. Verifique os eventos:
   - **PageView**: Com parâmetros UTM
   - **Lead**: Quando formulário é completado
   - **FormCompleted**: Evento customizado adicional

## 📊 Eventos rastreados:

### PageView (Automático)
```javascript
fbq('track', 'PageView', {
  utm_source: 'facebook',
  utm_medium: 'cpc',
  utm_campaign: 'quiz_leads',
  utm_content: 'botao_azul',
  utm_term: 'consultoria'
});
```

### Lead (Formulário completo)
```javascript
fbq('track', 'Lead', {
  // UTMs
  utm_source: 'facebook',
  utm_medium: 'cpc',
  utm_campaign: 'quiz_leads',
  
  // Dados do formulário
  content_name: 'Quiz PiscaForm Completo',
  content_category: 'Lead Generation',
  currency: 'BRL',
  value: 1,
  user_name: 'João Silva',
  user_email: 'joao@email.com',
  business_revenue: 'até R$ 5.000',
  // ... outros dados
});
```

## 🎨 Como usar em outros componentes:

```typescript
import { useUtmTracking } from './hooks/useUtmTracking';

function MeuComponente() {
  const { trackLead, trackCustomEvent } = useUtmTracking();
  
  const handleButtonClick = () => {
    // Rastrear evento customizado
    trackCustomEvent('ButtonClick', {
      button_name: 'CTA Principal',
      page_section: 'Hero'
    });
  };
  
  const handleFormSubmit = () => {
    // Rastrear lead
    trackLead({
      form_type: 'newsletter',
      user_email: 'user@email.com'
    });
  };
}
```

## 🔧 Configurações avançadas:

### Modificar dados do Lead
Edite a função `finishQuiz()` em `src/app/page.tsx` para personalizar os dados enviados.

### Adicionar novos eventos
Use o hook `useUtmTracking` em qualquer componente para rastrear eventos personalizados.

### Configurar Conversions API
Para melhor rastreamento, configure também a Conversions API do Facebook com os mesmos dados.

## 🚨 Pontos importantes:

1. **UTMs são preservados**: Mesmo que o usuário navegue sem UTMs, os parâmetros iniciais são mantidos no sessionStorage
2. **Múltiplos eventos Lead**: O sistema envia eventos Lead mesmo se o envio falhar parcialmente
3. **Dados ricos**: Cada evento Lead inclui informações detalhadas do negócio do usuário
4. **Compatibilidade**: Funciona tanto com JavaScript habilitado quanto desabilitado (noscript)

## 📈 Métricas disponíveis no Facebook:

- **Alcance**: Quantas pessoas viram suas páginas
- **Conversões**: Quantos leads foram gerados
- **Custo por Lead**: ROI das campanhas
- **Atribuição por UTM**: Performance por fonte/mídia/campanha
- **Funil de conversão**: Da PageView ao Lead

## ✅ Checklist de verificação:

- [ ] Meta Pixel carregando corretamente
- [ ] UTMs sendo capturados na PageView
- [ ] Evento Lead disparando na conclusão do formulário
- [ ] Dados aparecendo no Facebook Events Manager
- [ ] UTMs sendo preservados durante a sessão
- [ ] Eventos customizados funcionando (se aplicável)

---

🎯 **Configuração concluída!** Seu Meta Pixel está rastreando leads com UTMs automaticamente. 