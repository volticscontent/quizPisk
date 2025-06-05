"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import HeroSection from '@/components/vendas/HeroSection';

// Dynamic imports para componentes que usam useEffect (evita problemas de hidratação)
const ComoFuncionaSection = dynamic(() => import('@/components/vendas/ComoFuncionaSection'), {
  ssr: false,
  loading: () => <div className="min-h-[50px] bg-black" />
});

const FooterSection = dynamic(() => import('@/components/common/FooterSection'), {
  ssr: false,
  loading: () => <div className="min-h-[100px] bg-black" />
});

const RecursosSection = dynamic(() => import('@/components/vendas/RecursosSection'), {
  ssr: false,
  loading: () => <div className="min-h-[50px] bg-black" />
});

const TemasSection = dynamic(() => import('@/components/vendas/TemasSection'), {
  ssr: false,
  loading: () => <div className="min-h-[50px] bg-black" />
});

const TestimonialsSection = dynamic(() => import('@/components/vendas/TestimonialsSection'), {
  ssr: false,
  loading: () => <div className="min-h-[50px] bg-black" />
});

const PlansSection = dynamic(() => import('@/components/vendas/PlansSection'), {
  ssr: false,
  loading: () => <div className="min-h-[50px] bg-black" />
});

const FaqSection = dynamic(() => import('@/components/vendas/FaqSection'), {
  ssr: false,
  loading: () => <div className="min-h-[50px] bg-black" />
});

const ValorSection = dynamic(() => import('@/components/vendas/ValorSection'), {
  ssr: false,
  loading: () => <div className="min-h-[50px] bg-black" />
});

const PresenteSection = dynamic(() => import('@/components/vendas/PresenteSection'), {
  ssr: false,
  loading: () => <div className="min-h-[50px] bg-black" />
});

export default function PaginaLanding() {
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