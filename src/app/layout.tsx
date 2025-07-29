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
              
              // Inicializar o pixel
              fbq('init', '1665742907429984');
              
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
                  referrer: document.referrer || '',
                  page_location: window.location.href,
                  user_agent: navigator.userAgent,
                  timestamp: new Date().toISOString()
                };
              }
              
              // Capturar parâmetros de tracking
              const trackingParams = getAllTrackingParams();
              
              // Armazenar parâmetros importantes no sessionStorage
              if (trackingParams.utm_source || trackingParams.utm_medium || trackingParams.utm_campaign || 
                  trackingParams.fbclid || trackingParams.gclid) {
                try {
                  sessionStorage.setItem('utmParams', JSON.stringify(trackingParams));
                  console.log('📱 Parâmetros de tracking capturados e armazenados:', trackingParams);
                } catch (error) {
                  console.error('Erro ao armazenar parâmetros de tracking:', error);
                }
              }
              
              // Filtrar parâmetros não vazios para o PageView
              const cleanParams = {};
              Object.entries(trackingParams).forEach(([key, value]) => {
                if (value && value !== '') {
                  cleanParams[key] = value;
                }
              });
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
