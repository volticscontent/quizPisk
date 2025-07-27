'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useUtmTracking } from '../hooks/useUtmTracking';

// Configuração do Google Analytics
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: Record<string, unknown>) => void;
  }
}

const GA_MEASUREMENT_ID = 'G-D6BPDXCNJQ';

// Função para enviar eventos para o Google Analytics
const sendGAEvent = (eventName: string, parameters?: Record<string, string | number | boolean>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    console.log(`📊 GA Event: ${eventName}`, parameters);
    window.gtag('event', eventName, {
      event_category: 'Conversion',
      event_label: 'Thank You Page',
      ...parameters
    });
  } else {
    console.log(`📊 GA não carregado ainda. Event: ${eventName}`, parameters);
  }
};

// Função para rastrear visualização de página
const sendGAPageView = (pageName: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    console.log(`📄 GA PageView: ${pageName}`);
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_title: `PiscaForm - ${pageName}`,
      page_location: window.location.href
    });
  }
};

export default function ThankYou() {
  const [isClient, setIsClient] = useState(false);
  const [elementsVisible, setElementsVisible] = useState(false);
  
  // Hook para rastreamento UTM e Meta Pixel
  const { trackLead } = useUtmTracking();

  useEffect(() => {
    setIsClient(true);
    
    // Envia pageview
    sendGAPageView('Thank You - Agendamento Confirmado');
    
    // Marca lead como convertido
    sendGAEvent('calendly_scheduling_confirmed', {
      conversion_type: 'calendly_appointment',
      conversion_stage: 'scheduled',
      timestamp: new Date().toISOString(),
      source: 'piscaform_quiz'
    });

    // Rastreia lead com Meta Pixel e UTM
    trackLead({
      content_name: 'Consultoria PiscaForm - Agendamento Confirmado',
      content_category: 'Lead Conversion',
      currency: 'BRL',
      value: 10.0, // Valor alto por ser conversão completa
      lead_type: 'scheduled_appointment',
      form_name: 'PiscaForm - Quiz + Calendly',
      conversion_timestamp: new Date().toISOString(),
      submission_status: 'completed_with_scheduling'
    });

    // Animação de entrada
    setTimeout(() => {
      setElementsVisible(true);
    }, 300);

    console.log('🎉 Thank You page loaded - Lead convertido com sucesso!');
  }, [trackLead]);

  if (!isClient) {
    return null;
  }

  return (
    <div className="geometric-bg relative min-h-screen flex flex-col">
      {/* Header com logo */}
      <header className={`absolute top-4 left-4 z-50 ${elementsVisible ? 'element-fade-in' : 'element-hidden'}`} style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center">
          <Image src="/lgSemFundo.png" alt="Logo" width={65} height={65} priority />
        </div>
      </header>

      {/* Content Wrapper */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto text-center">
          
          {/* Ícone de sucesso */}
          <div className={`mb-8 ${elementsVisible ? 'element-fade-in' : 'element-hidden'}`} style={{ animationDelay: '0.3s' }}>
            <div className="w-24 h-24 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>

          {/* Título principal */}
          <h1 className={`text-4xl md:text-5xl font-bold text-white mb-6 ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.5s' }}>
            🎉 Parabéns!
          </h1>

          {/* Mensagem de confirmação */}
          <div className={`text-xl md:text-2xl text-white/90 mb-8 leading-relaxed ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.7s' }}>
            <p className="mb-4">
              Seu agendamento foi <span className="text-green-400 font-semibold">confirmado com sucesso!</span>
            </p>
            <p>
              Em breve você receberá um e-mail com todos os detalhes da sua consultoria estratégica.
            </p>
          </div>

          {/* Próximos passos */}
          <div className={`bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/20 ${elementsVisible ? 'element-fade-in' : 'element-hidden'}`} style={{ animationDelay: '0.9s' }}>
            <h2 className="text-2xl font-bold text-white mb-6">📋 Próximos Passos</h2>
            
            <div className="text-left space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <div className="text-white/90">
                  <strong>Verifique seu e-mail:</strong> Confirme o agendamento e salve o evento no seu calendário
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <div className="text-white/90">
                  <strong>Prepare-se:</strong> Tenha suas dúvidas anotadas e esteja pronto para uma conversa estratégica
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <div className="text-white/90">
                  <strong>Compareça:</strong> Não perca essa oportunidade única de transformar seu negócio
                </div>
              </div>
            </div>
          </div>

          {/* Mensagem motivacional */}
          <div className={`text-lg text-white/80 ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '1.1s' }}>
            <p className="italic">
              &ldquo;Você deu o primeiro passo para escalar seu negócio para 50-100k/mês em moedas fortes. Estamos ansiosos para nossa conversa!&rdquo;
            </p>
          </div>

          {/* Badge de verificação */}
          <div className={`mt-8 inline-flex items-center px-6 py-3 bg-green-500/20 border border-green-400 rounded-full ${elementsVisible ? 'element-fade-in' : 'element-hidden'}`} style={{ animationDelay: '1.3s' }}>
            <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <span className="text-green-400 font-semibold">Agendamento Verificado</span>
          </div>
        </div>
      </div>

      {/* Footer simples */}
      <footer className={`p-6 text-center ${elementsVisible ? 'element-fade-in' : 'element-hidden'}`} style={{ animationDelay: '1.5s' }}>
        <p className="text-white/60 text-sm">
          © 2024 PiscaForm. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
