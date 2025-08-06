// Tipos para o sistema de tracking
type QuizStep = 'name' | 'whatsapp' | 'email' | 'instagram' | 'momento' | 'vendeu_fora' | 'faturamento' | 'caixa_disponivel' | 'problema_principal' | 'area_ajuda' | 'socio' | 'por_que_escolher' | 'compromisso' | 'analysis' | 'finished';

// Função para enviar eventos customizados para Meta Pixel usando trackCustom
export const sendMetaEvent = (eventName: string, parameters?: Record<string, string | number | boolean>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    console.log(`📊 Meta Custom Event: ${eventName}`, parameters);
    window.fbq('trackCustom', eventName, parameters);
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

// Função para enviar evento de pergunta - AGORA SÓ ENVIA UM EVENTO
export const sendQuestionEvent = (step: QuizStep) => {
  const questionNumber = getQuestionNumber(step);
  if (questionNumber > 0) {
    // Envia APENAS o evento Att-QuPergunta (padrão unificado)
    sendMetaEvent(`Att-QuPergunta${questionNumber}`, {
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