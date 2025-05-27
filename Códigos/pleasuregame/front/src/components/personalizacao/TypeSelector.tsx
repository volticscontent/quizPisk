"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface TypeOption {
  id: string;
  title: string;
  description: string;
  features: string[];
  benefits: {
    title: string;
    description: string;
    icon: string;
  }[];
}

interface TypeSelectorProps {
  onSelect: (type: string) => void;
}

const types: TypeOption[] = [
  {
    id: 'default',
    title: 'Padrão',
    description: 'Tema padrão com contador de tempo e animações de fundo.',
    features: [
      'Contador de tempo personalizado',
      'Animações de fundo',
      'Design minimalista',
      'Alta performance'
    ],
    benefits: [
      {
        title: 'Design Elegante',
        description: 'Interface limpa e moderna que destaca seu conteúdo',
        icon: '✨'
      },
      {
        title: 'Personalização Total',
        description: 'Controle completo sobre cores, fontes e elementos',
        icon: '🎨'
      },
      {
        title: 'Alta Performance',
        description: 'Carregamento rápido e animações suaves',
        icon: '⚡'
      }
    ]
  },
  {
    id: 'netflix',
    title: 'Netflix',
    description: 'Tema inspirado na Netflix com data e episódios(fotos) favoritos.',
    features: [
      'Layout inspirado na Netflix',
      'Galeria de fotos favoritas',
      'Data personalizada',
      'Efeitos visuais premium'
    ],
    benefits: [
      {
        title: 'Experiência Premium',
        description: 'Design inspirado na maior plataforma de streaming',
        icon: '🎬'
      },
      {
        title: 'Galeria Dinâmica',
        description: 'Apresente suas fotos com efeitos profissionais',
        icon: '📸'
      },
      {
        title: 'Visual Impactante',
        description: 'Cause uma primeira impressão memorável',
        icon: '✨'
      }
    ]
  }
];

export default function TypeSelector({ onSelect }: TypeSelectorProps) {
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [rotations, setRotations] = useState({ card1: { x: 0, y: 0 }, card2: { x: 0, y: 0 } });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, cardId: 'card1' | 'card2') => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * 10;
    const rotateY = ((centerX - x) / centerX) * 10;

    setRotations(prev => ({
      ...prev,
      [cardId]: { x: rotateX, y: rotateY }
    }));
  };

  const handleMouseLeave = (cardId: 'card1' | 'card2') => {
    setRotations(prev => ({
      ...prev,
      [cardId]: { x: 0, y: 0 }
    }));
  };

  const handleContinue = async () => {
    if (!selectedType) {
      setError('Por favor, selecione um tema para continuar');
      return;
    }

    onSelect(selectedType);
  };

  return (
    <section className="w-full flex flex-col items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-7xl mx-auto px-4 py-6 md:py-12">
        <h1 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-200 to-white text-2xl sm:text-3xl lg:text-5xl font-sans py-2 relative z-20 font-bold tracking-tight">
          Escolha o Tipo de Personalização
        </h1>
        <p className="max-w-xl mx-auto text-center text-sm sm:text-base md:text-lg text-neutral-200 mb-6 md:mb-12 px-4">
          Selecione o tema que melhor combina com seu estilo
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 w-full">
          {types.map((type, index) => (
            <div key={type.id} className="py-8 sm:py-12 md:py-20 flex items-center justify-center" style={{ perspective: '1000px' }}>
              <div 
                className="flex items-center justify-center relative transition-all duration-200 ease-linear inter-var w-full px-2 sm:px-4"
                style={{ 
                  transformStyle: 'preserve-3d', 
                  transform: `rotateX(${rotations[`card${index + 1}` as 'card1' | 'card2'].x}deg) rotateY(${rotations[`card${index + 1}` as 'card1' | 'card2'].y}deg)`,
                  transition: 'transform 0.2s ease-out'
                }}
                onMouseMove={(e) => handleMouseMove(e, `card${index + 1}` as 'card1' | 'card2')}
                onMouseLeave={() => handleMouseLeave(`card${index + 1}` as 'card1' | 'card2')}
                onClick={() => {
                  setSelectedType(type.id);
                  setError(null);
                }}
              >
                <div className={`
                  [transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d] relative group/card 
                  hover:shadow-2xl hover:shadow-emerald-500/[0.1] bg-black border-white/[0.2] 
                  w-full sm:w-[30rem] h-auto rounded-xl p-4 sm:p-6 border cursor-pointer
                  ${selectedType === type.id ? 'ring-2 ring-primary' : ''}
                `}>
                  <div 
                    className="w-fit transition duration-200 ease-linear text-lg sm:text-xl font-bold text-white"
                    style={{ transform: 'translateZ(50px)' }}
                  >
                    {type.title}
                  </div>
                  <p 
                    className="w-fit transition duration-200 ease-linear text-xs sm:text-sm max-w-sm mt-2 text-neutral-300"
                    style={{ transform: 'translateZ(50px)' }}
                  >
                    {type.description}
                  </p>
                  <div 
                    className="transition duration-200 ease-linear w-full mt-4"
                    style={{ transform: 'translateZ(30px)' }}
                  >
                    <Image
                      alt={`${type.title} thumbnail`}
                      src={`/images/themes/${type.id}.webp`}
                      width={1000}
                      height={1000}
                      className="w-full rounded-xl group-hover/card:shadow-xl"
                    />
                  </div>

                  <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4" style={{ transform: 'translateZ(40px)' }}>
                    <div>
                      <h4 className="text-base sm:text-lg font-semibold text-white mb-2">Recursos</h4>
                      <ul className="space-y-1.5 sm:space-y-2">
                        {type.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start text-sm sm:text-base text-neutral-300">
                            <span className="text-primary mr-2">•</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-base sm:text-lg font-semibold text-white mb-2">Benefícios</h4>
                      <ul className="space-y-1.5 sm:space-y-2">
                        {type.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-start text-neutral-300">
                            <span className="text-xl sm:text-2xl mr-2 sm:mr-3">{benefit.icon}</span>
                            <div>
                              <span className="font-medium block text-sm sm:text-base">{benefit.title}</span>
                              <span className="text-xs sm:text-sm text-neutral-400">{benefit.description}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover/card:opacity-100 transition rounded-xl">
                    <span className="px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white rounded-lg text-base sm:text-lg font-medium">
                      Selecionar Tema
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-center mt-4">{error}</p>
        )}

        <div className="flex justify-center mt-6 sm:mt-8 px-4">
          <button
            onClick={handleContinue}
            disabled={!selectedType}
            className={`
              w-full sm:w-auto px-6 sm:px-8 py-3 rounded-lg font-semibold text-white text-sm sm:text-base
              ${selectedType
                ? 'bg-primary hover:bg-primary/80'
                : 'bg-neutral-700 cursor-not-allowed'
              }
            `}
          >
            Continuar com {selectedType ? types.find(t => t.id === selectedType)?.title : '(selecione um tema)'}
          </button>
        </div>
      </div>
    </section>
  );
} 