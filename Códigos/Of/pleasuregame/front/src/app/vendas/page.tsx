"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import HeroSection from '@/components/vendas/HeroSection';

// Dynamic imports SIMPLES sem loading complexo para evitar problemas de hidratação
const ComoFuncionaSection = dynamic(() => import('@/components/vendas/ComoFuncionaSection'), {
  ssr: false,
  loading: () => <div />
});

const TestimonialsSection = dynamic(() => import('@/components/vendas/TestimonialsSection'), {
  ssr: false,
  loading: () => <div />
});

const PlansSection = dynamic(() => import('@/components/vendas/PlansSection'), {
  ssr: false,
  loading: () => <div />
});

const FaqSection = dynamic(() => import('@/components/vendas/FaqSection'), {
  ssr: false,
  loading: () => <div />
});

const ValorSection = dynamic(() => import('@/components/vendas/ValorSection'), {
  ssr: false,
  loading: () => <div />
});

const PresenteSection = dynamic(() => import('@/components/vendas/PresenteSection'), {
  ssr: false,
  loading: () => <div />
});

const FooterSection = dynamic(() => import('@/components/common/FooterSection'), {
  ssr: false,
  loading: () => <div />
});

export default function PaginaLanding() {
  return (
    <main className="min-h-screen bg-black text-white w-full overflow-x-hidden">
      {/* Hero Section - renderizado imediatamente sem problemas */}
      <HeroSection />
      
      {/* Componentes com dynamic imports para evitar problemas de hydratação */}
      <ComoFuncionaSection />
      <ValorSection />
      <TestimonialsSection />
      <div className="section-divider" />
      <PresenteSection />
      <PlansSection />
      <div className="section-divider" />
      <FaqSection />
      <div className="section-divider" />
      <FooterSection />
    </main>
  );
} 