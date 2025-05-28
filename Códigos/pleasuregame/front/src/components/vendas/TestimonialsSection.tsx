"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

const testimonials = [
  {
    text: "Adorei a experiência! Pude criar uma página especial para o João com nossas fotos favoritas, uma playlist personalizada e um texto que representa nossa história. Ele ficou super emocionado quando viu!",
    author: "Mariana e João",
    time: "1 mês atrás"
  },
  {
    text: "Com a Lovely, pude expressar meu amor de um jeito totalmente diferente. Adorei criar uma página só para nós dois.",
    author: "Ana e Pedro",
    time: "2 dias atrás"
  },
  {
    text: "Montei uma página surpresa para a Carol, com nossas fotos de viagem e uma mensagem sincera. Ela adorou! Com certeza vou usar de novo.",
    author: "Lucas e Carol",
    time: "3 meses atrás"
  },
  {
    text: "A interface é simples e criar uma página com nossas fotos e músicas favoritas foi super especial!",
    author: "Camila e Felipe",
    time: "4 meses atrás"
  },
  {
    text: "A página ficou incrível e personalizada! Ele não esperava por algo tão emocionante.",
    author: "Bia e Henrique",
    time: "1 ano atrás"
  }
];

const moreTestimonials = [
  {
    text: "Usar o Lovely foi incrível! A plataforma é muito intuitiva e fácil de usar. Conseguimos montar um presente digital perfeito com músicas que marcaram nossa relação.",
    author: "Clara e Rafael",
    time: "2 meses atrás"
  },
  {
    text: "Lovely tornou nosso relacionamento ainda mais especial. Ele amou a surpresa cheia de memórias.",
    author: "Vanessa e Ricardo",
    time: "1 semana atrás"
  },
  {
    text: "Comemoramos nosso primeiro ano juntos de uma forma muito especial. A página personalizada foi o presente perfeito!",
    author: "Carla e Bruno",
    time: "4 meses atrás"
  },
  {
    text: "Ele não esperava por uma surpresa tão personalizada. Foi emocionante montar essa página com tudo o que amamos.",
    author: "Larissa e Tiago",
    time: "9 meses atrás"
  }
];

export default function TestimonialsSection() {
  const [isAnimating, setIsAnimating] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView) {
      setIsAnimating(true);
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