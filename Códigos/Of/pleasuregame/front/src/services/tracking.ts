// Declaração de tipos para window
declare global {
  interface Window {
    fbq: any;
    utmify: any;
  }
}

// Eventos específicos por seção
export const trackHeroCTA = () => {
  // Facebook Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', 'HeroSection_QueroJogar', {
      section: 'hero',
      action: 'cta_click',
      button_text: 'Quero jogar!'
    });
  }

  // UTMify
  if (typeof window !== 'undefined' && window.utmify) {
    window.utmify.track('HeroSection_QueroJogar', {
      section: 'hero',
      action: 'cta_click',
      button_text: 'Quero jogar!',
      value: 0
    });
  }

  console.log('🎯 Tracking: Hero Section - Quero Jogar clicked');
};

export const trackComoFuncionaCTA = (gameMode: string) => {
  // Facebook Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', 'ComoFunciona_GameModeClick', {
      section: 'como_funciona',
      action: 'game_mode_click',
      game_mode: gameMode
    });
  }

  // UTMify
  if (typeof window !== 'undefined' && window.utmify) {
    window.utmify.track('ComoFunciona_GameModeClick', {
      section: 'como_funciona',
      action: 'game_mode_click',
      game_mode: gameMode,
      value: 0
    });
  }

  console.log(`🎯 Tracking: Como Funciona - ${gameMode} clicked`);
};

export const trackPresenteCTA = (buttonType: 'dar_presente' | 'ver_planos') => {
  const eventName = buttonType === 'dar_presente' 
    ? 'PresenteSection_DarPresente' 
    : 'PresenteSection_VerPlanos';

  const buttonText = buttonType === 'dar_presente' 
    ? 'Quero Dar de Presente' 
    : 'Ver Planos e Começar o Jogo';

  // Facebook Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', eventName, {
      section: 'presente',
      action: 'cta_click',
      button_type: buttonType,
      button_text: buttonText
    });
  }

  // UTMify
  if (typeof window !== 'undefined' && window.utmify) {
    window.utmify.track(eventName, {
      section: 'presente',
      action: 'cta_click',
      button_type: buttonType,
      button_text: buttonText,
      value: 0
    });
  }

  console.log(`🎯 Tracking: Presente Section - ${buttonText} clicked`);
};

export const trackDesafiosCTA = () => {
  // Facebook Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', 'DesafiosSection_VerPlanos', {
      section: 'desafios',
      action: 'cta_click',
      button_text: 'Ver Planos'
    });
  }

  // UTMify
  if (typeof window !== 'undefined' && window.utmify) {
    window.utmify.track('DesafiosSection_VerPlanos', {
      section: 'desafios',
      action: 'cta_click',
      button_text: 'Ver Planos',
      value: 0
    });
  }

  console.log('🎯 Tracking: Desafios Section - Ver Planos clicked');
}; 