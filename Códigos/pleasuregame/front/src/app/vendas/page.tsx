"use client";

import React from 'react';
import HeroSection from '@/components/vendas/HeroSection';
import ComoFuncionaSection from '@/components/vendas/ComoFuncionaSection';
import FooterSection from '@/components/common/FooterSection';
import RecursosSection from '@/components/vendas/RecursosSection';
import TemasSection from '@/components/vendas/TemasSection';
import TestimonialsSection from '@/components/vendas/TestimonialsSection';
import PlansSection from "@/components/vendas/PlansSection";
import FaqSection from "@/components/vendas/FaqSection";
import DesafiosSection from "@/components/vendas/DesafiosSection";
import ValorSection from "@/components/vendas/ValorSection";
import PresenteSection from "@/components/vendas/PresenteSection";

export default function PaginaLanding() {
  return (
    <main className="min-h-screen bg-black text-white w-full overflow-x-hidden">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Como funciona */}
      <ComoFuncionaSection />
      
      {/* Recursos */}
      <RecursosSection />

      {/* Temas */}
      <TemasSection />

      {/* Desafios */}
      <DesafiosSection />

      {/* Valor */}
      <ValorSection />

      {/* Depoimentos */}
      <TestimonialsSection />
      <div className="section-divider" />
      
      <PlansSection />
      <div className="section-divider" />

      {/* Presente */}
      <PresenteSection />

      <FaqSection />
      <div className="section-divider" />
      {/* Footer */}
      <FooterSection />
    </main>
  );
} 