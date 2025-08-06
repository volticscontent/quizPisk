// Tipos para o sistema de tracking
type QuizStep = 'name' | 'whatsapp' | 'email' | 'instagram' | 'momento' | 'vendeu_fora' | 'faturamento' | 'caixa_disponivel' | 'problema_principal' | 'area_ajuda' | 'socio' | 'por_que_escolher' | 'compromisso' | 'analysis' | 'finished';

// Função para obter o prefixo baseado na UTM page
const getEventPrefix = (): string => {
  if (typeof window === 'undefined') return 'Att';
  
  try {
    // Primeiro tenta pegar do sessionStorage (mais confiável)
    const storedParams = sessionStorage.getItem('utmParams');
    if (storedParams) {
      const parsedParams = JSON.parse(storedParams);
      if (parsedParams.page === 'oldEst') {
        return 'oldEst';
      }
    }
    
    // Fallback: pegar da URL atual
    const urlParams = new URLSearchParams(window.location.search);
    const pageParam = urlParams.get('page');
    
    return pageParam === 'oldEst' ? 'oldEst' : 'Att';
  } catch (error) {
    console.warn('⚠️ Erro ao determinar prefixo do evento:', error);
    return 'Att'; // Fallback padrão
  }
};

// Função para enviar eventos customizados para Meta Pixel usando trackCustom
export const sendMetaEvent = (eventName: string, parameters?: Record<string, string | number | boolean>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    // Adiciona o prefixo baseado na UTM page automaticamente
    const prefix = getEventPrefix();
    const prefixedEventName = eventName.startsWith('Qu') ? 
      eventName.replace('Qu', `${prefix}-Qu`) : 
      `${prefix}-${eventName}`;
    
    console.log(`📊 Meta Custom Event: ${prefixedEventName}`, parameters);
    window.fbq('trackCustom', prefixedEventName, parameters);
  } else {
    console.log(`📊 Meta Pixel não carregado ainda. Custom Event: ${eventName}`, parameters);
  }
};

// Função para enviar page view - REMOVIDA duplicação, agora usa trackCustom
export const sendPageView = () => {
  sendMetaEvent('QuPageView', {
    page_url: typeof window !== 'undefined' ? window.location.href : '',
    timestamp: new Date().toISOString()
  });
};

// Função para mapear steps para eventos QuPergunta
export const getQuestionNumber = (step: QuizStep): number => {
  const stepNumbers: { [key in QuizStep]: number } = {
    'name': 1,
    'whatsapp': 2,
    'email': 3,
    'instagram': 4,
    'momento': 5,
    'vendeu_fora': 6,
    'faturamento': 7,
    'caixa_disponivel': 8,
    'problema_principal': 9,
    'area_ajuda': 10,
    'socio': 11,
    'por_que_escolher': 12,
    'compromisso': 13,
    'analysis': 0, // Não envia evento
    'finished': 0  // Não envia evento
  };
  return stepNumbers[step] || 0;
};

// Função para enviar evento de pergunta - AGORA COM PREFIXO DINÂMICO
export const sendQuestionEvent = (step: QuizStep) => {
  const questionNumber = getQuestionNumber(step);
  if (questionNumber > 0) {
    // Envia evento QuPergunta com prefixo baseado na UTM page
    sendMetaEvent(`QuPergunta${questionNumber}`, {
      step_name: step,
      question_number: questionNumber,
      timestamp: new Date().toISOString()
    });
  }
};

// Função para enviar evento de Lead padrão (não customizado)
export const sendLeadEvent = (parameters?: Record<string, string | number | boolean>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    console.log('📊 Meta Standard Lead Event:', parameters);
    window.fbq('track', 'Lead', parameters);
  }
};

// Função para obter número da etapa (para outros propósitos)
export const getStepNumber = (step: QuizStep): number => {
  const stepNumbers: { [key in QuizStep]: number } = {
    'name': 1,
    'whatsapp': 2,
    'email': 3,
    'instagram': 4,
    'momento': 5,
    'vendeu_fora': 6,
    'faturamento': 7,
    'caixa_disponivel': 8,
    'problema_principal': 9,
    'area_ajuda': 10,
    'socio': 11,
    'por_que_escolher': 12,
    'compromisso': 13,
    'analysis': 14,
    'finished': 15
  };
  return stepNumbers[step] || 0;
}; 