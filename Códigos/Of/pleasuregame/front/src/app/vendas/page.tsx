"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import HeroSection from '@/components/vendas/HeroSection';

// Dynamic imports para componentes que usam useEffect (evita problemas de hidratação)
const ComoFuncionaSection = dynamic(() => import('@/components/vendas/ComoFuncionaSection'), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-black" />
});

const FooterSection = dynamic(() => import('@/components/common/FooterSection'), {
  ssr: false,
  loading: () => <div className="min-h-[200px] bg-black" />
});

const RecursosSection = dynamic(() => import('@/components/vendas/RecursosSection'), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-black" />
});

const TemasSection = dynamic(() => import('@/components/vendas/TemasSection'), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-black" />
});

const TestimonialsSection = dynamic(() => import('@/components/vendas/TestimonialsSection'), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-black" />
});

const PlansSection = dynamic(() => import('@/components/vendas/PlansSection'), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-black" />
});

const FaqSection = dynamic(() => import('@/components/vendas/FaqSection'), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-black" />
});

const ValorSection = dynamic(() => import('@/components/vendas/ValorSection'), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-black" />
});

const PresenteSection = dynamic(() => import('@/components/vendas/PresenteSection'), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-black" />
});

export default function PaginaLanding() {
  const [isFullyMounted, setIsFullyMounted] = useState(false);

  useEffect(() => {
    // Aguarda um pouco mais para garantir que todos os componentes estejam prontos
    const timer = setTimeout(() => {
      setIsFullyMounted(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white w-full overflow-x-hidden">
      {/* Hero Section - sempre renderizado */}
      <HeroSection />
      
      {/* Outros componentes só após montagem completa */}
      {isFullyMounted && (
        <>
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
        </>
      )}
      
      {/* Loading state para os componentes que ainda não carregaram */}
      {!isFullyMounted && (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-sm text-neutral-400">Preparando experiência...</p>
          </div>
        </div>
      )}
    </main>
  );
} 