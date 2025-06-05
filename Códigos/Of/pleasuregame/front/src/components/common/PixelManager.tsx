"use client";

import { useEffect } from 'react';
import Script from 'next/script';
import { PIXEL_CONFIG, type PlanId } from '@/config/pixels';

declare global {
  interface Window {
    fbq: any;
    pixelId: string;
    gtag?: any;
    dataLayer?: any[];
  }
}

export default function PixelManager() {
  useEffect(() => {
    // Configurar dataLayer para GTM (se disponível)
    if (typeof window !== 'undefined' && !window.dataLayer) {
      window.dataLayer = [];
    }
  }, []);

  return (
    <>
      {/* Facebook Pixel - Otimizado para evitar CORB */}
      <Script
        id="facebook-pixel"
        strategy="afterInteractive"
        onLoad={() => {
          // Inicializar pixel apenas após carregamento completo
          if (typeof window !== 'undefined' && window.fbq) {
            try {
              window.fbq('init', PIXEL_CONFIG.FACEBOOK_PIXEL_ID);
              window.fbq('track', 'PageView');
            } catch (error) {
              console.warn('Facebook Pixel initialization failed:', error);
            }
          }
        }}
        onError={(error) => {
          console.warn('Facebook Pixel script failed to load:', error);
        }}
        dangerouslySetInnerHTML={{
          __html: `
            (function(f,b,e,v,n,t,s) {
              if(f.fbq) return;
              n=f.fbq=function(){
                n.callMethod ? n.callMethod.apply(n,arguments) : n.queue.push(arguments)
              };
              if(!f._fbq) f._fbq=n;
              n.push=n; n.loaded=!0; n.version='2.0';
              n.queue=[];
              t=b.createElement(e); t.async=!0;
              t.src=v; t.crossOrigin='anonymous';
              s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)
            })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
          `,
        }}
      />

      {/* UTMify - TEMPORARIAMENTE DESABILITADO PARA CORRIGIR ERROS */}
      {/* 
      <Script
        src="https://cdn.utmify.com.br/scripts/utms/latest.js"
        data-utmify-prevent-xcod-sck="true"
        data-utmify-prevent-subids="true"
        strategy="afterInteractive"
        async
        defer
      />

      <Script
        id="utmify-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.pixelId = "${PIXEL_CONFIG.UTMIFY_PIXEL_ID}";
            var a = document.createElement("script");
            a.setAttribute("async", "");
            a.setAttribute("defer", "");
            a.setAttribute("src", "https://cdn.utmify.com.br/scripts/pixel/pixel.js");
            document.head.appendChild(a);
          `,
        }}
      />
      */}

      {/* NoScript fallback para Facebook Pixel - Otimizado */}
      <noscript>
        <img 
          height="1" 
          width="1" 
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${PIXEL_CONFIG.FACEBOOK_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
          crossOrigin="anonymous"
          loading="lazy"
        />
      </noscript>
    </>
  );
}

/**
 * Função profissional para rastrear checkout de planos vitalícios
 * @param planId - ID do plano (basico, medio, premium)
 * @param planName - Nome do plano
 * @param planValue - Valor do plano
 */
export const trackPlanCheckout = (planId: PlanId, planName: string, planValue: number) => {
  if (typeof window === 'undefined') return;

  const eventData = {
    plan_id: planId,
    plan_name: planName,
    plan_value: planValue,
    currency: 'BRL',
    timestamp: new Date().toISOString(),
    page_url: window.location.href,
    referrer: document.referrer || 'direct'
  };

  try {
    // 1. Facebook Pixel - InitiateCheckout (evento padrão) - Com tratamento de erro
    if (window.fbq) {
      try {
        window.fbq('track', 'InitiateCheckout', {
          content_name: planName,
          content_category: 'Lifetime_Subscription',
          content_ids: [planId],
          content_type: 'product',
          value: planValue,
          currency: 'BRL',
          num_items: 1
        });

        // Evento customizado específico do plano
        const customEvent = PIXEL_CONFIG.PLAN_EVENTS[planId.toUpperCase() as keyof typeof PIXEL_CONFIG.PLAN_EVENTS];
        if (customEvent) {
          window.fbq('trackCustom', customEvent.facebook_event, {
            plan_id: planId,
            plan_name: planName,
            plan_value: planValue,
            currency: 'BRL',
            subscription_type: 'lifetime'
          });
        }
      } catch (fbError) {
        console.warn('Facebook Pixel tracking failed:', fbError);
      }
    }

    // 2. UTMify - Evento personalizado - TEMPORARIAMENTE DESABILITADO
    /*
    if (window.pixelId) {
      const utmifyData = {
        event: 'initiate_checkout',
        subscription_type: 'lifetime',
        ...eventData
      };

      fetch(PIXEL_CONFIG.UTMIFY_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          pixel_id: PIXEL_CONFIG.UTMIFY_PIXEL_ID,
          ...utmifyData
        })
      }).catch(error => {
        console.warn('UTMify tracking failed:', error);
      });
    }
    */

    // 3. Google Analytics 4 (se disponível) - Com tratamento de erro
    if (window.gtag) {
      try {
        window.gtag('event', 'begin_checkout', {
          currency: 'BRL',
          value: planValue,
          items: [{
            item_id: planId,
            item_name: planName,
            item_category: 'Lifetime_Subscription',
            price: planValue,
            quantity: 1
          }]
        });
      } catch (gtagError) {
        console.warn('Google Analytics tracking failed:', gtagError);
      }
    }

    // 4. Google Tag Manager (se disponível) - Com tratamento de erro
    if (window.dataLayer) {
      try {
        window.dataLayer.push({
          event: 'begin_checkout',
          ecommerce: {
            currency: 'BRL',
            value: planValue,
            items: [{
              item_id: planId,
              item_name: planName,
              item_category: 'Lifetime_Subscription',
              price: planValue,
              quantity: 1
            }]
          },
          plan_details: eventData
        });
      } catch (gtmError) {
        console.warn('Google Tag Manager tracking failed:', gtmError);
      }
    }

    // 5. Log estruturado para debug (apenas em desenvolvimento)
    if (process.env.NODE_ENV === 'development') {
      console.group('🎯 Professional Pixel Tracking - Plan Checkout');
      console.log('Plan Details:', eventData);
      console.log('Facebook Pixel ID:', PIXEL_CONFIG.FACEBOOK_PIXEL_ID);
      console.log('UTMify Pixel ID:', PIXEL_CONFIG.UTMIFY_PIXEL_ID);
      console.groupEnd();
    }

  } catch (error) {
    console.error('Pixel tracking error:', error);
  }
};

/**
 * Função para rastrear visualização de planos
 * @param planId - ID do plano visualizado
 */
export const trackPlanView = (planId: PlanId) => {
  if (typeof window === 'undefined') return;

  try {
    // Facebook Pixel - ViewContent
    if (window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_name: `Plano ${planId}`,
        content_category: 'Lifetime_Subscription',
        content_ids: [planId],
        content_type: 'product'
      });
    }

    // Google Analytics 4
    if (window.gtag) {
      window.gtag('event', 'view_item', {
        currency: 'BRL',
        value: PIXEL_CONFIG.PLAN_EVENTS[planId.toUpperCase() as keyof typeof PIXEL_CONFIG.PLAN_EVENTS]?.plan_price || 0,
        items: [{
          item_id: planId,
          item_name: `Plano ${planId}`,
          item_category: 'Lifetime_Subscription'
        }]
      });
    }

  } catch (error) {
    console.error('Plan view tracking error:', error);
  }
}; 