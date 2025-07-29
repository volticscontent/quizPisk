'use client';
import { useCallback } from 'react';

interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  fbclid?: string;
  gclid?: string;
  xcod?: string;
  referrer?: string;
  page_location?: string;
}

interface AdditionalEventData {
  [key: string]: string | number | boolean | undefined;
}

declare global {
  interface Window {
    fbq: (action: string, event: string, data?: Record<string, unknown>) => void;
  }
}

export const useUtmTracking = () => {
  const getStoredUtmParams = useCallback((): UtmParams => {
    if (typeof window === 'undefined') return {};
    
    try {
      const stored = sessionStorage.getItem('utmParams');
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Erro ao recuperar UTMs do sessionStorage:', error);
      return {};
    }
  }, []);

  const getCurrentUtmParams = useCallback((): UtmParams => {
    if (typeof window === 'undefined') return {};
    
    const urlParams = new URLSearchParams(window.location.search);
    return {
      utm_source: urlParams.get('utm_source') || undefined,
      utm_medium: urlParams.get('utm_medium') || undefined,
      utm_campaign: urlParams.get('utm_campaign') || undefined,
      utm_term: urlParams.get('utm_term') || undefined,
      utm_content: urlParams.get('utm_content') || undefined,
      fbclid: urlParams.get('fbclid') || undefined,
      gclid: urlParams.get('gclid') || undefined,
      xcod: urlParams.get('xcod') || undefined,
      referrer: document.referrer || undefined,
      page_location: window.location.href
    };
  }, []);

  const getAllTrackingParams = useCallback((): UtmParams => {
    const stored = getStoredUtmParams();
    const current = getCurrentUtmParams();
    
    // Prioriza parâmetros atuais sobre os armazenados
    return {
      ...stored,
      ...current,
      // fbclid, gclid e xcod são sempre da sessão atual se disponíveis
      fbclid: current.fbclid || stored.fbclid,
      gclid: current.gclid || stored.gclid,
      xcod: current.xcod || stored.xcod,
      referrer: current.referrer || stored.referrer,
      page_location: current.page_location
    };
  }, [getStoredUtmParams, getCurrentUtmParams]);

  // Função principal - ENVIA APENAS UM EVENTO DE LEAD
  const trackLead = useCallback((additionalData?: AdditionalEventData) => {
    if (typeof window === 'undefined' || !window.fbq) {
      console.warn('Meta Pixel não está disponível');
      return;
    }

    try {
      // Obtém todos os parâmetros de tracking
      const trackingParams = getAllTrackingParams();
      
      // Remove parâmetros vazios ou undefined
      const cleanTrackingParams = Object.fromEntries(
        Object.entries(trackingParams).filter(([_, value]) => 
          value !== '' && value !== null && value !== undefined
        )
      );

      // Combina dados de tracking com dados adicionais
      const eventData = {
        ...cleanTrackingParams,
        ...additionalData,
        event_source_url: window.location.href,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        screen_resolution: `${screen.width}x${screen.height}`,
        viewport_size: `${window.innerWidth}x${window.innerHeight}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        // Identificar fonte do tráfego no próprio evento
        ...(trackingParams.fbclid && { traffic_source: 'facebook', fb_click_id: trackingParams.fbclid }),
        ...(trackingParams.gclid && { traffic_source: 'google_ads', google_click_id: trackingParams.gclid }),
        ...(!trackingParams.fbclid && !trackingParams.gclid && trackingParams.utm_source && { 
          traffic_source: trackingParams.utm_source,
          traffic_type: 'utm_campaign'
        })
      };

      console.log('🎯 Enviando ÚNICO evento Lead para Meta Pixel:', eventData);
      
      // ENVIA APENAS UM EVENTO DE LEAD - SEM DUPLICATAS
      window.fbq('track', 'Lead', eventData);
      
      // Log para confirmação
      console.log('✅ Evento Lead enviado com sucesso - sem duplicatas');

    } catch (error) {
      console.error('Erro ao enviar evento Lead:', error);
    }
  }, [getAllTrackingParams]);

  // Função para eventos customizados (uso opcional)
  const trackCustomEvent = useCallback((eventName: string, additionalData?: AdditionalEventData) => {
    if (typeof window === 'undefined' || !window.fbq) {
      console.warn('Meta Pixel não está disponível');
      return;
    }

    try {
      const trackingParams = getAllTrackingParams();
      const cleanTrackingParams = Object.fromEntries(
        Object.entries(trackingParams).filter(([_, value]) => 
          value !== '' && value !== null && value !== undefined
        )
      );

      const eventData = {
        ...cleanTrackingParams,
        ...additionalData,
        event_source_url: window.location.href,
        timestamp: new Date().toISOString()
      };

      console.log(`📊 Enviando evento customizado '${eventName}' para Meta Pixel:`, eventData);
      window.fbq('trackCustom', eventName, eventData);

    } catch (error) {
      console.error(`Erro ao enviar evento customizado '${eventName}':`, error);
    }
  }, [getAllTrackingParams]);

  // Função para armazenar UTMs na sessão
  const storeUtmParams = useCallback(() => {
    if (typeof window === 'undefined') return;

    const currentParams = getCurrentUtmParams();
    const hasUtmParams = Object.entries(currentParams).some(([key, value]) => 
      key.startsWith('utm_') && value
    );

    if (hasUtmParams || currentParams.fbclid || currentParams.gclid) {
      try {
        sessionStorage.setItem('utmParams', JSON.stringify(currentParams));
        console.log('📱 Parâmetros de tracking armazenados:', currentParams);
      } catch (error) {
        console.error('Erro ao armazenar parâmetros de tracking:', error);
      }
    }
  }, [getCurrentUtmParams]);

  return {
    trackLead,
    getUtmParams: getAllTrackingParams, // Exporta função para obter UTMs
    getCurrentUtmParams,
    getStoredUtmParams
  };
}; 