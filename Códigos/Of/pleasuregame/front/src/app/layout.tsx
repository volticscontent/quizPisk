import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import BarraNavegacao from "@/components/common/Navigation";
import BannerPromocional from "@/components/vendas/BannerPromocional";
import CookieConsent from "@/components/common/CookieConsent";
import PixelManager from "@/components/common/PixelManager";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lovely - Surpreenda quem você ama",
  description: "Transforme momentos especiais em memórias inesquecíveis com o Lovely.",
};

// Componente para detectar hidratação e melhorar compatibilidade com iPhone
function HydrationProvider({ children }: { children: React.ReactNode }) {
  return (
    <div suppressHydrationWarning>
      {children}
    </div>
  );
}

// Componente para carregamento progressivo
function ProgressiveLoader({ children }: { children: React.ReactNode }) {
  return (
    <div 
      style={{
        minHeight: '100vh',
        backgroundColor: '#000000'
      }}
    >
      {children}
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Meta tags essenciais para iPhone */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Preload de recursos críticos */}
        <link rel="preload" href="/videos/hero/dh.webm" as="video" type="video/webm" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Script para detectar problemas de carregamento */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Detectar iPhone e configurar variáveis globais
                window.isIPhone = /iPhone|iPad|iPod/i.test(navigator.userAgent);
                window.isHydrated = false;
                
                // Timeout para detectar problemas de hidratação
                window.hydrationTimeout = setTimeout(function() {
                  if (!window.isHydrated) {
                    console.warn('Hydration timeout detected, forcing reload...');
                    // Não recarregar automaticamente, apenas logar
                    window.hydrationFailed = true;
                  }
                }, 10000);
                
                // Detectar quando a página está totalmente carregada
                window.addEventListener('load', function() {
                  setTimeout(function() {
                    window.isHydrated = true;
                    if (window.hydrationTimeout) {
                      clearTimeout(window.hydrationTimeout);
                    }
                  }, 1000);
                });
                
                // Detectar erros de JavaScript
                window.addEventListener('error', function(e) {
                  console.error('JavaScript error detected:', e.error);
                  if (window.isIPhone) {
                    // Log específico para iPhone
                    console.warn('iPhone error:', e.filename, e.lineno, e.message);
                  }
                });
                
                // Detectar erros de Promise rejeitadas
                window.addEventListener('unhandledrejection', function(e) {
                  console.error('Unhandled promise rejection:', e.reason);
                  if (window.isIPhone) {
                    console.warn('iPhone promise rejection:', e.reason);
                  }
                });
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ProgressiveLoader>
          <HydrationProvider>
            <AuthProvider>
              <BarraNavegacao />
              <BannerPromocional />
              {children}
              <CookieConsent />
              <PixelManager />
            </AuthProvider>
          </HydrationProvider>
        </ProgressiveLoader>
      </body>
    </html>
  );
}
