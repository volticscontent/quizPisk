import { useEffect, useRef } from 'react';

// Declaração global para Clarity
declare global {
  interface Window {
    clarity?: {
      (action: 'init', projectId: string): void;
      (action: 'identify', userId: string): void;
      (action: 'set', key: string, value: string): void;
      (action: 'event', eventName: string): void;
      (action: 'upgrade', reason: string): void;
    };
  }
}

export const useClarityTracking = () => {
  const isInitialized = useRef(false);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    // Carrega o script do Clarity se não estiver carregado
    if (typeof window !== 'undefined' && !scriptLoaded.current) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.onload = () => {
        try {
          // Inicializa o Clarity após o script carregar
          if (window.clarity && !isInitialized.current) {
            window.clarity('init', 'sm8ldwv0b3');
            isInitialized.current = true;
            console.log('📊 Microsoft Clarity initialized successfully');
          }
        } catch (error) {
          console.warn('⚠️ Erro ao inicializar Clarity:', error);
        }
      };
      script.onerror = () => {
        console.warn('⚠️ Erro ao carregar script do Clarity');
      };
      script.src = 'https://www.clarity.ms/tag/sm8ldwv0b3';
      document.head.appendChild(script);
      scriptLoaded.current = true;
    }
  }, []);

  const trackEvent = (eventName: string, data?: Record<string, string | number | boolean>) => {
    if (!isInitialized.current || !window.clarity) {
      console.warn('⚠️ Clarity não inicializado, pulando evento:', eventName);
      return;
    }

    try {
      window.clarity('event', eventName);
      if (data) {
        Object.entries(data).forEach(([key, value]) => {
          window.clarity?.('set', key, String(value));
        });
      }
      console.log('📊 Clarity Event:', eventName, data);
    } catch (error) {
      console.warn('⚠️ Erro ao enviar evento para Clarity:', error);
    }
  };

  const trackQuizStep = (step: string, stepNumber: number) => {
    if (!isInitialized.current || !window.clarity) return;
    
    try {
      window.clarity('event', 'quiz_step_completed');
      window.clarity('set', 'step', step);
      window.clarity('set', 'step_number', String(stepNumber));
      window.clarity('set', 'timestamp', new Date().toISOString());
    } catch (error) {
      console.warn('⚠️ Erro no trackQuizStep:', error);
    }
  };

  const trackQuizAbandonment = (step: string, stepNumber: number, timeSpent: number) => {
    if (!isInitialized.current || !window.clarity) return;
    
    try {
      window.clarity('event', 'quiz_abandoned');
      window.clarity('set', 'last_step', step);
      window.clarity('set', 'step_number', String(stepNumber));
      window.clarity('set', 'time_spent_seconds', String(timeSpent));
      window.clarity('set', 'timestamp', new Date().toISOString());
    } catch (error) {
      console.warn('⚠️ Erro no trackQuizAbandonment:', error);
    }
  };

  const trackQuizCompletion = (totalTime: number, leadSent: boolean) => {
    if (!isInitialized.current || !window.clarity) return;
    
    try {
      window.clarity('event', 'quiz_completed');
      window.clarity('set', 'total_time_seconds', String(totalTime));
      window.clarity('set', 'lead_sent_successfully', String(leadSent));
      window.clarity('set', 'timestamp', new Date().toISOString());
    } catch (error) {
      console.warn('⚠️ Erro no trackQuizCompletion:', error);
    }
  };

  const trackCalendlyClick = (fromStep: string) => {
    if (!isInitialized.current || !window.clarity) return;
    
    try {
      window.clarity('event', 'calendly_button_clicked');
      window.clarity('set', 'from_step', fromStep);
      window.clarity('set', 'timestamp', new Date().toISOString());
    } catch (error) {
      console.warn('⚠️ Erro no trackCalendlyClick:', error);
    }
  };

  const setUserSession = (sessionId: string, userInfo?: Record<string, string>) => {
    if (!isInitialized.current || !window.clarity) return;
    
    try {
      window.clarity('identify', sessionId);
      if (userInfo) {
        Object.entries(userInfo).forEach(([key, value]) => {
          window.clarity?.('set', key, value);
        });
      }
      console.log('👤 Clarity User Session:', sessionId, userInfo);
    } catch (error) {
      console.warn('⚠️ Erro ao definir sessão no Clarity:', error);
    }
  };

  const setCustomTag = (key: string, value: string) => {
    if (!isInitialized.current || !window.clarity) return;
    
    try {
      window.clarity('set', key, value);
      console.log('🏷️ Clarity Custom Tag:', key, value);
    } catch (error) {
      console.warn('⚠️ Erro ao definir tag customizada:', error);
    }
  };

  const upgradeSession = () => {
    if (!isInitialized.current || !window.clarity) return;
    
    try {
      window.clarity('upgrade', 'QuizCompleted');
      console.log('⬆️ Clarity session upgraded');
    } catch (error) {
      console.warn('⚠️ Erro ao fazer upgrade da sessão:', error);
    }
  };

  return {
    trackEvent,
    trackQuizStep,
    trackQuizAbandonment,
    trackQuizCompletion,
    trackCalendlyClick,
    setUserSession,
    setCustomTag,
    upgradeSession,
    isInitialized: isInitialized.current
  };
}; 