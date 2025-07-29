// Tipos para o sistema de tracking
type QuizStep = 'name' | 'whatsapp' | 'email' | 'instagram' | 'momento' | 'vendeu_fora' | 'faturamento' | 'caixa_disponivel' | 'problema_principal' | 'area_ajuda' | 'socio' | 'por_que_escolher' | 'compromisso' | 'analysis' | 'finished';

// Função para enviar eventos para Meta Pixel apenas
export const sendMetaEvent = (eventName: string, parameters?: Record<string, string | number | boolean>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    console.log(`📊 Meta Event: ${eventName}`, parameters);
    window.fbq('track', eventName, parameters);
  } else {
    console.log(`📊 Meta Pixel não carregado ainda. Event: ${eventName}`, parameters);
  }
};

// Função para enviar page view
export const sendPageView = () => {
  sendMetaEvent('QuPage-view', {
    page_url: typeof window !== 'undefined' ? window.location.href : ''
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
    'caixa_disponivel': 0, // Não envia evento (perguntas 8+ não rastreadas)
    'problema_principal': 0,
    'area_ajuda': 0,
    'socio': 0,
    'por_que_escolher': 0,
    'compromisso': 0,
    'analysis': 0,
    'finished': 0
  };
  return stepNumbers[step] || 0;
};

// Função para enviar evento de pergunta
export const sendQuestionEvent = (step: QuizStep) => {
  const questionNumber = getQuestionNumber(step);
  if (questionNumber > 0) {
    sendMetaEvent(`QuPergunta ${questionNumber.toString().padStart(2, '0')}`, {
      step_name: step,
      question_number: questionNumber
    });
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