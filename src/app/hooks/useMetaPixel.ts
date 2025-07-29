import { useEffect, useRef } from 'react';
import ReactPixel from 'react-facebook-pixel';

// Configuração do Meta Pixel
const PIXEL_ID = '1665742907429984'; // Substitua pelo seu Pixel ID

export const useMetaPixel = () => {
  const isInitialized = useRef(false);

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
      ReactPixel.trackCustom(eventName, parameters);
      console.log('📱 Meta Pixel Custom Event:', eventName, parameters);
    } catch (error) {
      console.warn('⚠️ Erro ao enviar evento customizado para Meta Pixel:', error);
    }
  };

  const trackPageView = () => {
    if (!isInitialized.current) return;
    
    try {
      ReactPixel.pageView();
      console.log('📱 Meta Pixel PageView tracked');
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
    isInitialized: isInitialized.current
  };
}; 