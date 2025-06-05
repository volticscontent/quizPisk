"use client";

import React from 'react';
import HeroSection from '@/components/vendas/HeroSection';
import ComoFuncionaSection from '@/components/vendas/ComoFuncionaSection';
import FooterSection from '@/components/common/FooterSection';
import TestimonialsSection from '@/components/vendas/TestimonialsSection';
import PlansSection from '@/components/vendas/PlansSection';
import FaqSection from '@/components/vendas/FaqSection';
import ValorSection from '@/components/vendas/ValorSection';
import PresenteSection from '@/components/vendas/PresenteSection';

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
      <div className="section-divider" />

      {/* Presente */}
      <PresenteSection />
      
      <PlansSection />
      <div className="section-divider" />

      <FaqSection />
      <div className="section-divider" />
      
      {/* Footer */}
      <FooterSection />
    </main>
  );
}
