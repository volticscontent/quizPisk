"use client";

import React from 'react';
import HeroSection from '@/components/vendas/HeroSection';
import ComoFuncionaSection from '@/components/vendas/ComoFuncionaSection';
import ValorSection from '@/components/vendas/ValorSection';
// import FooterSection from '@/components/common/FooterSection';
// import TestimonialsSection from '@/components/vendas/TestimonialsSection';
// import PlansSection from '@/components/vendas/PlansSection';
// import FaqSection from '@/components/vendas/FaqSection';
// import PresenteSection from '@/components/vendas/PresenteSection';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white w-full overflow-x-hidden">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Como funciona */}
      <ComoFuncionaSection />

      {/* Valor */}
      <ValorSection />

      {/* DIAGNÓSTICO: Testando Hero + ComoFunciona + Valor */}
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl mb-4">🔍 MODO DIAGNÓSTICO</h2>
          <p>Testando Hero + ComoFunciona + Valor</p>
          <p className="text-sm text-gray-400 mt-2">Se carregar OK, vamos adicionar o próximo componente</p>
        </div>
      </div>

      {/* Depoimentos */}
      {/* <TestimonialsSection /> */}
      {/* <div className="section-divider" /> */}

      {/* Presente */}
      {/* <PresenteSection /> */}
      
      {/* <PlansSection /> */}
      {/* <div className="section-divider" /> */}

      {/* <FaqSection /> */}
      {/* <div className="section-divider" /> */}
      
      {/* Footer */}
      {/* <FooterSection /> */}
    </main>
  );
}
