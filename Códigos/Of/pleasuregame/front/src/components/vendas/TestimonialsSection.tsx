"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

const testimonials = [
  {
    text: "O Modo Exploração Guiada foi perfeito para nós! Como somos meio tímidos, o roteiro que alterna perguntas íntimas com toques sugeridos nos ajudou muito. A personalização inteligente captou exatamente nosso perfil e agora estamos viciados!",
    author: "Mariana e João",
    time: "1 mês atrás"
  },
  {
    text: "O Roleplay 'desconhecidos no hotel' me deixou completamente molhada antes mesmo de começarmos! A narração guiada desperta cada sentido. Ele nunca me viu tão excitada e eu nunca o vi tão dominante. Simplesmente viciante!",
    author: "Ana e Pedro",
    time: "2 dias atrás"
  },
  {
    text: "O Modo Selvagem salvou nossa relação! Os desafios cronometrados e comandos de dominação me fazem gozar de formas que não imaginava. A intensidade dos orgasmos multiplicou. Agora transamos muito mais e melhor!",
    author: "Lucas e Carol",
    time: "3 meses atrás"
  },
  {
    text: "Amamos o Strip Quiz e a Roleta do Desejo! São nossos jogos favoritos das noites de sexta. É incrível como algo aparentemente simples pode ser tão excitante e divertido. Já desbloqueamos o troféu 'Dom da Mímica'!",
    author: "Camila e Felipe",
    time: "4 meses atrás"
  },
  {
    text: "As Fantasias Secretas mudaram tudo! Descobrimos que ambos queríamos experimentar BDSM leve. O app liberou desafios que nos fizeram explorar dominação e submissão de forma segura. Nosso prazer sexual triplicou!",
    author: "Bia e Henrique",
    time: "1 ano atrás"
  }
];

const moreTestimonials = [
  {
    text: "A Massagem Tântrica com narração feminina me levou ao orgasmo só com as mãos dele! O app ensina cada movimento, onde tocar, por quanto tempo. A conexão física nunca foi tão intensa. Evoluímos muito além do básico!",
    author: "Clara e Rafael",
    time: "2 meses atrás"
  },
  {
    text: "O jogo '10 Dates para se Conectar' salvou nosso relacionamento! As perguntas nos aproximaram emocionalmente, e quando partimos pros jogos hot, o sexo fica muito mais intenso. A intimidade emocional potencializa o prazer físico!",
    author: "Vanessa e Ricardo",
    time: "1 semana atrás"
  },
  {
    text: "O sistema de conquistas nos viciou! Cada troféu desbloqueado ('Explorador Selvagem', 'Toque Mágico') libera novos desafios sexuais. Ontem conseguimos 3 orgasmos em sequência seguindo o roteiro do app. Incrível!",
    author: "Carla e Bruno",
    time: "4 meses atrás"
  },
  {
    text: "As Cartas da Conexão combinadas com a Mímica Proibida são explosivas! Conversamos sobre desejos secretos e depois representamos as posições. Ela goza muito mais rápido agora e eu duro muito mais. Win-win total!",
    author: "Larissa e Tiago",
    time: "9 meses atrás"
  }
];

export default function TestimonialsSection() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => {
        setIsAnimating(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [inView]);

  return (
    <div className="w-full mx-auto max-w-7xl py-12 bg-black bg-dot-red-200/[0.05]" data-sentry-component="Testimonials">
      <div className="container flex flex-col items-center justify-center px-4">
        <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-200 to-white text-3xl lg:text-5xl font-sans py-2 relative z-20 font-bold tracking-tight">
          Depoimentos
        </h2>
        <p className="max-w-xl text-center text-base md:text-lg text-neutral-200 mb-4">
          Veja o que nossos clientes estão dizendo sobre a Lovely
        </p>
        
        <div ref={ref} className="h-[40rem] rounded-md flex flex-col antialiased items-center justify-center relative overflow-hidden">
          {/* Primeira linha de cards */}
          <div 
            className="scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]"
          >
            <ul className={`flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap ${isAnimating ? 'animate-scroll-reverse' : ''}`}>
              {testimonials.concat(testimonials).map((testimonial, index) => (
                <li 
                  key={`first-${index}`}
                  className="w-[350px] max-w-full relative rounded-2xl border border-b-0 flex-shrink-0 border-slate-700 px-8 py-6 md:w-[450px] transform transition-transform duration-300 hover:scale-[1.02]"
                  style={{ background: "linear-gradient(180deg, var(--slate-800), var(--slate-900))" }}
                >
                  <blockquote>
                    <div className="user-select-none -z-1 pointer-events-none absolute -left-0.5 -top-0.5 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"></div>
                    <span className="relative z-20 text-sm leading-[1.6] text-gray-300 font-normal">
                      {testimonial.text}
                    </span>
                    <div className="relative z-20 mt-6 flex flex-row items-center">
                      <span className="flex flex-col gap-1">
                        <span className="text-sm text-white font-bold">{testimonial.author}</span>
                        <span className="text-xs text-gray-500 font-normal">{testimonial.time}</span>
                      </span>
                    </div>
                  </blockquote>
                </li>
              ))}
            </ul>
          </div>

          {/* Segunda linha de cards */}
          <div 
            className="scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]"
          >
            <ul className={`flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap ${isAnimating ? 'animate-scroll-forward' : ''}`}>
              {moreTestimonials.concat(moreTestimonials).map((testimonial, index) => (
                <li 
                  key={`second-${index}`}
                  className="w-[350px] max-w-full relative rounded-2xl border border-b-0 flex-shrink-0 border-slate-700 px-8 py-6 md:w-[450px] transform transition-transform duration-300 hover:scale-[1.02]"
                  style={{ background: "linear-gradient(180deg, var(--slate-800), var(--slate-900))" }}
                >
                  <blockquote>
                    <div className="user-select-none -z-1 pointer-events-none absolute -left-0.5 -top-0.5 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"></div>
                    <span className="relative z-20 text-sm leading-[1.6] text-gray-300 font-normal">
                      {testimonial.text}
                    </span>
                    <div className="relative z-20 mt-6 flex flex-row items-center">
                      <span className="flex flex-col gap-1">
                        <span className="text-sm text-white font-bold">{testimonial.author}</span>
                        <span className="text-xs text-gray-500 font-normal">{testimonial.time}</span>
                      </span>
                    </div>
                  </blockquote>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-reverse {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-50% - 1rem)); }
        }

        @keyframes scroll-forward {
          from { transform: translateX(calc(-50% - 1rem)); }
          to { transform: translateX(0); }
        }

        .animate-scroll-reverse {
          animation: scroll-reverse 40s linear infinite;
          animation-play-state: running;
        }

        .animate-scroll-forward {
          animation: scroll-forward 30s linear infinite;
          animation-play-state: running;
        }

        .animate-scroll-reverse:hover,
        .animate-scroll-forward:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
} 