"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import { trackComoFuncionaCTA, trackDesafiosCTA } from '@/services/tracking';

const GameModeCard = ({ mode, index }: { mode: any; index: number }) => (
  <motion.div
    key={mode.title}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="group relative bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 hover:border-red-500/30 transition-all duration-300 cursor-pointer"
    onClick={() => trackComoFuncionaCTA(mode.title)}
  >
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-xl flex items-center justify-center group-hover:from-red-500/30 group-hover:to-red-600/30 transition-all duration-300">
        {mode.icon}
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-red-400 transition-colors duration-300">
          {mode.title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          {mode.description}
        </p>
      </div>
    </div>
  </motion.div>
);

const challenges = [
  {
    question: "Você toparia um desafio de dominação com tempo cronometrado?",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mb-4 text-red-500">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z" fill="currentColor"/>
        <path d="M12.5 7V12.25L17 14.92L16.25 16.15L11 13V7H12.5Z" fill="currentColor"/>
      </svg>
    ),
    gradient: "from-red-500/20 via-red-500/10 to-transparent"
  },
  {
    question: "Já imaginou realizar uma fantasia sem que seu parceiro saiba qual você escolheu?",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mb-4 text-red-500">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
        <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.5"/>
      </svg>
    ),
    gradient: "from-pink-500/20 via-pink-500/10 to-transparent"
  },
  {
    question: "E se uma narração envolvente conduzisse vocês por um cenário quente e provocante?",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mb-4 text-red-500">
        <path d="M12 3V13.55C11.41 13.21 10.73 13 10 13C7.79 13 6 14.79 6 17C6 19.21 7.79 21 10 21C12.21 21 14 19.21 14 17V7H18V3H12ZM10 19C8.9 19 8 18.1 8 17C8 15.9 8.9 15 10 15C11.1 15 12 15.9 12 17C12 18.1 11.1 19 10 19Z" fill="currentColor"/>
      </svg>
    ),
    gradient: "from-purple-500/20 via-purple-500/10 to-transparent"
  }
];

const gameModes = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="4" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
        <path d="M7 8h10M7 12h6M7 16h8" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="18" cy="6" r="2" fill="currentColor"/>
      </svg>
    ),
    title: "Desafios Picantes (cartas)",
    description: "Desafios picantes em formato de cartas para apimentar a relação."
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
        <path d="M12 2L14 8L20 8L15.5 12L17 18L12 15L7 18L8.5 12L4 8L10 8L12 2Z" fill="currentColor"/>
        <circle cx="12" cy="12" r="2" fill="white"/>
      </svg>
    ),
    title: "Sex Roleta",
    description: "Gire a roleta e deixe a sorte decidir a próxima aventura."
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 12L10.5 14.5L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12Z" stroke="currentColor" strokeWidth="2"/>
        <path d="M9 9L15 15M15 9L9 15" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
      </svg>
    ),
    title: "Verdade ou Desafio",
    description: "Descubra segredos ou cumpra desafios picantes."
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 7L12 3L4 7L12 11L20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 12L12 16L20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 17L12 21L20 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="16" cy="8" r="2" fill="currentColor"/>
      </svg>
    ),
    title: "RolePlay",
    description: "Incorpore personagens e explore fantasias."
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z" fill="currentColor"/>
        <path d="M21 9V7L15 4L12 5.5L9 4L3 7V9L9 6L12 7.5L15 6L21 9Z" fill="currentColor"/>
        <ellipse cx="12" cy="17" rx="8" ry="3" stroke="currentColor" strokeWidth="2" fill="none"/>
        <path d="M8 14C8 14 10 16 12 16C14 16 16 14 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    title: "Kama 365 (posições Kama Sutra)",
    description: "Descubra e experimente novas posições do Kama Sutra."
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
        <path d="M6 21V19C6 16.79 7.79 15 10 15H14C16.21 15 18 16.79 18 19V21" stroke="currentColor" strokeWidth="2"/>
        <path d="M12 12L14 14L12 16L10 14L12 12Z" fill="currentColor"/>
        <circle cx="12" cy="8" r="1" fill="currentColor"/>
      </svg>
    ),
    title: "Jogar Sozinho",
    description: "Explore seu corpo e seus desejos de forma individual."
  },
   {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
        <path d="M7 8H17M7 12H15M7 16H13" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="19" cy="6" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
        <path d="M17.5 5L18.5 6L20.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Nível de Safadeza (teste)",
    description: "Descubra o quão safado(a) você e seu parceiro(a) são."
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="6" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
        <path d="M8 10H16M8 14H12" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12 2L14 4L12 6L10 4L12 2Z" fill="currentColor"/>
        <circle cx="18" cy="4" r="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <path d="M17 3L19 5" stroke="currentColor" strokeWidth="1"/>
      </svg>
    ),
    title: "Strip Quiz",
    description: "Responda perguntas e veja quem tira a roupa primeiro."
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none"/>
        <path d="M12 3L13.5 8.5L19 8.5L14.5 12L16 17.5L12 15L8 17.5L9.5 12L5 8.5L10.5 8.5L12 3Z" fill="currentColor"/>
        <path d="M12 12L15 9" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="12" cy="12" r="1" fill="white"/>
      </svg>
    ),
    title: "Roleta do Desejo",
    description: "Deixe a roleta decidir os desejos que serão realizados."
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
        <path d="M6 21V19C6 16.79 7.79 15 10 15H14C16.21 15 18 16.79 18 19V21" stroke="currentColor" strokeWidth="2"/>
        <path d="M8 12L10 14L8 16M16 12L14 14L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 11V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    title: "Mímica Proibida",
    description: "Adivinhe as palavras e frases picantes através de mímicas."
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z" fill="currentColor"/>
        <path d="M8 7C8 7 10 9 12 9C14 9 16 7 16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M6 12C6 12 8 14 12 14C16 14 18 12 18 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M4 17C4 17 7 19 12 19C17 19 20 17 20 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="8" cy="10" r="1" fill="currentColor"/>
        <circle cx="16" cy="10" r="1" fill="currentColor"/>
      </svg>
    ),
    title: "Massagem Tântrica",
    description: "Aprenda e pratique massagens tântricas para uma conexão mais profunda."
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.84 4.61C19.32 3.04 17.16 3.04 15.64 4.61L12 8.25L8.36 4.61C6.84 3.04 4.68 3.04 3.16 4.61C1.64 6.18 1.64 8.82 3.16 10.39L12 19.23L20.84 10.39C22.36 8.82 22.36 6.18 20.84 4.61Z" fill="currentColor"/>
        <circle cx="9" cy="9" r="2" stroke="white" strokeWidth="1" fill="none"/>
        <circle cx="15" cy="9" r="2" stroke="white" strokeWidth="1" fill="none"/>
        <path d="M9 13C9 13 10.5 15 12 15C13.5 15 15 13 15 13" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: "Modo de Conexão Emocional",
    description: "Fortaleça a intimidade e conexão emocional com seu parceiro(a)."
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
        <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="1.5" fill="none"/>
        <path d="M10.5 11L11.5 12L13.5 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="8" y="16" width="8" height="2" rx="1" fill="white"/>
      </svg>
    ),
    title: "Sistema de Conquistas e Progressão",
    description: "Desbloqueie conquistas e acompanhe sua progressão nos jogos."
  }
];

export default function ComoFuncionaSection() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (inView && isMounted) {
      setIsAnimating(true);
    }
  }, [inView, isMounted]);

  // Dividir os jogos em duas linhas
  const firstRowGames = gameModes.slice(0, Math.ceil(gameModes.length / 2));
  const secondRowGames = gameModes.slice(Math.ceil(gameModes.length / 2));

  // Não renderizar animações até estar montado
  if (!isMounted) {
    return (
      <section className="relative py-24 bg-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {challenges.map((challenge, index) => (
                <div key={challenge.question} className="group">
                  <div className={`h-full bg-gradient-to-b ${challenge.gradient} p-8 rounded-2xl border border-white/5 backdrop-blur-sm`}>
                    <div className="flex flex-col items-start">
                      {challenge.icon}
                      <h3 className="text-2xl font-semibold text-white mb-4">
                        {challenge.question}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link 
                href="#planos"
                className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-red-600 to-red-800 text-white font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-red-500/25"
              >
                Ver Planos
              </Link>
            </div>
          </div>
          <div className="text-center mb-2">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Conheça os jogos que vão transformar sua relação
            </h2>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/10 to-red-500/10 border border-red-500/20">
              <span className="text-red-400 text-sm">
                Interface adaptada para casais hetero, LGBTQIA+ e não monogâmicos
              </span>
            </div>
          </div>
          <div className="h-[28rem] rounded-md flex flex-col antialiased items-center justify-center relative overflow-hidden">
            <div className="scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]">
              <ul className="flex min-w-full shrink-0 gap-6 py-4 w-max flex-nowrap">
                {firstRowGames.map((mode, index) => (
                  <li key={`first-${mode.title}-${index}`} className="w-[300px] md:w-[350px] flex-shrink-0">
                    <GameModeCard mode={mode} index={index} />
                  </li>
                ))}
              </ul>
            </div>
            <div className="scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]">
              <ul className="flex min-w-full shrink-0 gap-6 py-4 w-max flex-nowrap">
                {secondRowGames.map((mode, index) => (
                  <li key={`second-${mode.title}-${index}`} className="w-[300px] md:w-[350px] flex-shrink-0">
                    <GameModeCard mode={mode} index={index} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-24 bg-black overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black"></div>
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Seção de Desafios */}
        <div className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {challenges.map((challenge, index) => (
              <motion.div
                key={challenge.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="group"
              >
                <div className={`h-full bg-gradient-to-b ${challenge.gradient} p-8 rounded-2xl border border-white/5 backdrop-blur-sm hover:border-red-500/20 transition-all duration-300`}>
                  <div className="flex flex-col items-start">
                    {challenge.icon}
                    <h3 className="text-2xl font-semibold text-white mb-4 group-hover:text-red-400 transition-colors">
                      {challenge.question}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link 
              href="#planos"
              onClick={() => trackDesafiosCTA()}
              className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-red-600 to-red-800 text-white font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-red-500/25"
            >
              Ver Planos
            </Link>
          </div>
        </div>

        {/* Seção de Jogos */}
        <div className="text-center mb-2">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Conheça os jogos que vão transformar sua relação
          </h2>
          
          {/* Advertorial Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/10 to-red-500/10 border border-red-500/20"
          >
            <span className="text-red-400 text-sm">
              Interface adaptada para casais hetero, LGBTQIA+ e não monogâmicos
            </span>
          </motion.div>
        </div>

        {/* Game Modes Carousel */}
        <div ref={ref} className="h-[28rem] rounded-md flex flex-col antialiased items-center justify-center relative overflow-hidden">
          {/* Primeira linha de cards */}
          <div 
            className="scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]"
          >
            <ul className={`flex min-w-full shrink-0 gap-6 py-4 w-max flex-nowrap ${isAnimating ? 'animate-scroll-reverse' : ''}`}>
              {firstRowGames.concat(firstRowGames).map((mode, index) => (
                <li 
                  key={`first-${mode.title}-${index}`}
                  className="w-[300px] md:w-[350px] flex-shrink-0"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (index % firstRowGames.length) * 0.05 }}
                  >
                    <GameModeCard mode={mode} index={index} />
                  </motion.div>
                </li>
              ))}
            </ul>
          </div>

          {/* Segunda linha de cards */}
          <div 
            className="scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]"
          >
            <ul className={`flex min-w-full shrink-0 gap-6 py-4 w-max flex-nowrap ${isAnimating ? 'animate-scroll-forward' : ''}`}>
              {secondRowGames.concat(secondRowGames).map((mode, index) => (
                <li 
                  key={`second-${mode.title}-${index}`}
                  className="w-[300px] md:w-[350px] flex-shrink-0"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (index % secondRowGames.length) * 0.05 }}
                  >
                    <GameModeCard mode={mode} index={index} />
                  </motion.div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-reverse {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-50% - 1.5rem)); }
        }

        @keyframes scroll-forward {
          from { transform: translateX(calc(-50% - 1.5rem)); }
          to { transform: translateX(0); }
        }

        .animate-scroll-reverse {
          animation: scroll-reverse 45s linear infinite;
          animation-play-state: running;
        }

        .animate-scroll-forward {
          animation: scroll-forward 40s linear infinite;
          animation-play-state: running;
        }

        .animate-scroll-reverse:hover,
        .animate-scroll-forward:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}