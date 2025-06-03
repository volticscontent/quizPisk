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
    // Configurar pixel do Facebook
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('init', PIXEL_CONFIG.FACEBOOK_PIXEL_ID);
      window.fbq('track', 'PageView');
    }

    // Configurar dataLayer para GTM (se disponível)
    if (typeof window !== 'undefined' && !window.dataLayer) {
      window.dataLayer = [];
    }
  }, []);

  return (
    <>
      {/* Facebook Pixel */}
      <Script
        id="facebook-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${PIXEL_CONFIG.FACEBOOK_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />

      {/* UTM Script (Amplo) */}
      <Script
        src="https://cdn.utmify.com.br/scripts/utms/latest.js"
        data-utmify-prevent-xcod-sck="true"
        data-utmify-prevent-subids="true"
        strategy="afterInteractive"
        async
        defer
      />

      {/* UTM Script (Pixel Personalizado) */}
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

      {/* NoScript fallback para Facebook Pixel */}
      <noscript>
        <img 
          height="1" 
          width="1" 
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${PIXEL_CONFIG.FACEBOOK_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
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
    // 1. Facebook Pixel - InitiateCheckout (evento padrão)
    if (window.fbq) {
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
    }

    // 2. UTMify - Evento personalizado
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

    // 3. Google Analytics 4 (se disponível)
    if (window.gtag) {
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
    }

    // 4. Google Tag Manager (se disponível)
    if (window.dataLayer) {
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
    console.error('Tracking error:', error);
    
    // Fallback tracking em caso de erro
    if (window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        content_name: planName,
        value: planValue,
        currency: 'BRL'
      });
    }
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