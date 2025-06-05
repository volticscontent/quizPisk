import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import BarraNavegacao from "@/components/common/Navigation";
import BannerPromocional from "@/components/vendas/BannerPromocional";
import CookieConsent from "@/components/common/CookieConsent";
import PixelManager from "@/components/common/PixelManager";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Lovely - Surpreenda alguém especial",
  description: "Crie momentos especiais e surpreenda a pessoa amada com páginas personalizadas.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {/* Meta tags essenciais para mobile */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="antialiased bg-black text-white min-h-screen">
        <AuthProvider>
          <PixelManager />
          <BannerPromocional />
          <BarraNavegacao />
          {children}
          <CookieConsent />
        </AuthProvider>
      </body>
    </html>
  );
}
