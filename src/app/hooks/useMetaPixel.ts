import { useEffect, useRef, useCallback } from 'react';
import ReactPixel from 'react-facebook-pixel';

// Configuração do Meta Pixel
const PIXEL_ID = '1665742907429984'; // Substitua pelo seu Pixel ID

export const useMetaPixel = () => {
  const isInitialized = useRef(false);

  // Função para obter o prefixo baseado na UTM page
  const getEventPrefix = useCallback(() => {
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
  }, []);

  useEffect(() => {
    // Inicializa o Meta Pixel apenas uma vez
    if (typeof window !== 'undefined' && !isInitialized.current) {
      try {
        ReactPixel.init(PIXEL_ID, undefined, {
          autoConfig: true,
          debug: process.env.NODE_ENV === 'development',
        });
        
        // Envia o PageView inicial
        ReactPixel.pageView();
        
        isInitialized.current = true;
        console.log('📱 Meta Pixel initialized successfully');
      } catch (error) {
        console.warn('⚠️ Erro ao inicializar Meta Pixel:', error);
      }
    }
  }, []);

  const trackEvent = (eventName: string, parameters?: Record<string, string | number | boolean>) => {
    if (!isInitialized.current) {
      console.warn('⚠️ Meta Pixel não inicializado, pulando evento:', eventName);
      return;
    }

    try {
      ReactPixel.track(eventName, parameters);
      console.log('📱 Meta Pixel Event:', eventName, parameters);
    } catch (error) {
      console.warn('⚠️ Erro ao enviar evento para Meta Pixel:', error);
    }
  };

  const trackCustomEvent = (eventName: string, parameters?: Record<string, string | number | boolean>) => {
    if (!isInitialized.current) {
      console.warn('⚠️ Meta Pixel não inicializado, pulando evento customizado:', eventName);
      return;
    }

    try {
      // Adiciona o prefixo baseado na UTM page automaticamente
      const prefix = getEventPrefix();
      const prefixedEventName = eventName.startsWith('Qu') ? 
        eventName.replace('Qu', `${prefix}-Qu`) : 
        `${prefix}-${eventName}`;
      
      ReactPixel.trackCustom(prefixedEventName, parameters);
      console.log('📱 Meta Pixel Custom Event:', prefixedEventName, parameters);
    } catch (error) {
      console.warn('⚠️ Erro ao enviar evento customizado para Meta Pixel:', error);
    }
  };

  const trackPageView = () => {
    if (!isInitialized.current) return;
    
    try {
      // Envia o PageView padrão do Meta Pixel (evento nativo)
      ReactPixel.pageView();
      console.log('📱 Meta Pixel PageView tracked');
      
      // Envia também um PageView customizado com prefixo para diferenciação
      const prefix = getEventPrefix();
      ReactPixel.trackCustom(`${prefix}-PageView`, {
        page_type: 'quiz',
        page_url: typeof window !== 'undefined' ? window.location.href : '',
        timestamp: new Date().toISOString()
      });
      console.log('📱 Meta Pixel PageView customizado tracked:', `${prefix}-PageView`);
    } catch (error) {
      console.warn('⚠️ Erro ao rastrear PageView:', error);
    }
  };

  const trackLead = (parameters?: Record<string, string | number | boolean>) => {
    trackEvent('Lead', parameters);
  };

  const trackCompleteRegistration = (parameters?: Record<string, string | number | boolean>) => {
    trackEvent('CompleteRegistration', parameters);
  };

  const trackQuizStep = (stepName: string, stepNumber: number) => {
    trackCustomEvent(`QuPergunta${stepNumber.toString().padStart(2, '0')}`, {
      step_name: stepName,
      step_number: stepNumber,
      timestamp: new Date().toISOString()
    });
  };

  const trackQuizPageView = () => {
    trackCustomEvent('QuPage-view', {
      page_type: 'quiz',
      timestamp: new Date().toISOString()
    });
  };

  const trackCalendlyClick = (sessionId?: string, email?: string, phone?: string) => {
    trackCustomEvent('QuClick-calendly', {
      conversion: true,
      form_completed: true,
      session_id: sessionId || '',
      email: email || '',
      phone: phone || '',
      timestamp: new Date().toISOString()
    });
  };

  return {
    trackEvent,
    trackCustomEvent,
    trackPageView,
    trackLead,
    trackCompleteRegistration,
    trackQuizStep,
    trackQuizPageView,
    trackCalendlyClick,
    isInitialized: isInitialized.current,
    getEventPrefix
  };
}; 