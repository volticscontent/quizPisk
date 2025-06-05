"use client";

import React from 'react';
import HeroSection from '@/components/vendas/HeroSection';
import ComoFuncionaSection from '@/components/vendas/ComoFuncionaSection';
import ValorSection from '@/components/vendas/ValorSection';
import TestimonialsSection from '@/components/vendas/TestimonialsSection';
import PresenteSection from '@/components/vendas/PresenteSection';
import PlansSection from '@/components/vendas/PlansSection';
// import FooterSection from '@/components/common/FooterSection';
// import FaqSection from '@/components/vendas/FaqSection';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white w-full overflow-x-hidden">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Como funciona */}
      <ComoFuncionaSection />

      {/* Valor */}
      <ValorSection />

      {/* Depoimentos */}
      <TestimonialsSection />

      {/* Presente */}
      <PresenteSection />

      {/* Planos */}
      <PlansSection />

      {/* <FaqSection /> */}
      {/* <div className="section-divider" /> */}
      
      {/* Footer */}
      {/* <FooterSection /> */}
    </main>
  );
}
