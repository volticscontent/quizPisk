import type { Metadata } from "next";
import { Geist, Geist_Mono, Maven_Pro } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const mavenPro = Maven_Pro({
  variable: "--font-maven-pro",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wifi-M$ney - Quiz Interativo",
  description: "Formulário em formato de quiz para consultoria estratégica",
  icons: {
    icon: '/logo.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning={true}>
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
          id="google-analytics-script"
        />
        <Script
          id="google-analytics-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              
              // O ID será configurado dinamicamente pelo page.tsx
              // Substitua G-XXXXXXXXXX pelo seu ID real do Google Analytics
              gtag('config', 'G-XXXXXXXXXX', {
                page_title: 'PiscaForm - Quiz Interativo',
                page_location: window.location.href,
                custom_map: {
                  'dimension1': 'quiz_step'
                }
              });
            `,
          }}
        />      
        
        {/* Meta Pixel Code */}
        <Script
          id="meta-pixel"
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
              
              // Função para capturar todos os parâmetros de tracking
              function getAllTrackingParams() {
                const urlParams = new URLSearchParams(window.location.search);
                return {
                  utm_source: urlParams.get('utm_source') || '',
                  utm_medium: urlParams.get('utm_medium') || '',
                  utm_campaign: urlParams.get('utm_campaign') || '',
                  utm_term: urlParams.get('utm_term') || '',
                  utm_content: urlParams.get('utm_content') || '',
                  fbclid: urlParams.get('fbclid') || '',
                  gclid: urlParams.get('gclid') || '',
                  page: urlParams.get('page') || '',
                  referrer: document.referrer || '',
                  page_location: window.location.href,
                  user_agent: navigator.userAgent,
                  timestamp: new Date().toISOString()
                };
              }
              
              // Capturar parâmetros de tracking
              const trackingParams = getAllTrackingParams();
              
              // Determinar qual pixel usar baseado no parâmetro 'page'
              let pixelId = '1665742907429984'; // Pixel padrão (fallback)
              
              if (trackingParams.page === 'CopyKevin') {
                pixelId = '728523633510605'; // Pixel para CopyKevin
                console.log('📱 Usando Pixel CopyKevin:', pixelId);
              } else if (trackingParams.page === 'oldEst' || trackingParams.page !== '') {
                pixelId = '24125973820395929'; // Pixel para oldEst ou outros valores
                console.log('📱 Usando Pixel oldEst/outros:', pixelId);
              } else {
                pixelId = '24125973820395929'; // Pixel padrão quando não há parâmetro page
                console.log('📱 Usando Pixel padrão (sem page param):', pixelId);
              }
              
              // Inicializar o pixel selecionado
              fbq('init', pixelId);
              console.log('📱 Meta Pixel inicializado com ID:', pixelId);
              
              // Armazenar parâmetros importantes no sessionStorage (incluindo pixelId usado)
              const paramsToStore = {
                ...trackingParams,
                active_pixel_id: pixelId
              };
              
              if (trackingParams.utm_source || trackingParams.utm_medium || trackingParams.utm_campaign || 
                  trackingParams.fbclid || trackingParams.gclid || trackingParams.page) {
                try {
                  sessionStorage.setItem('utmParams', JSON.stringify(paramsToStore));
                  console.log('📱 Parâmetros de tracking capturados e armazenados:', paramsToStore);
                } catch (error) {
                  console.error('Erro ao armazenar parâmetros de tracking:', error);
                }
              }
              
              // Filtrar parâmetros não vazios para eventos
              const cleanParams = {};
              Object.entries(trackingParams).forEach(([key, value]) => {
                if (value && value !== '') {
                  cleanParams[key] = value;
                }
              });
              
              // Adicionar informação do pixel ativo nos parâmetros
              cleanParams.active_pixel_id = pixelId;
              cleanParams.pixel_source = trackingParams.page === 'CopyKevin' ? 'copykevin' : 
                                         (trackingParams.page === 'oldEst' ? 'oldest' : 'default');
              
              // Enviar o PageView inicial padrão
              fbq('track', 'PageView', cleanParams);
              console.log('📊 Meta Pixel PageView inicial enviado com UTMs:', cleanParams);
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${mavenPro.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
