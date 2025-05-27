"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PhoneMockups from './PhoneMockups';
import HeartRain from './hero/HeartRain';

// Custom Hook para efeito de digitação
function useTypewriter(words: string[], typingSpeed = 100, deletingSpeed = 50, delayBetween = 2000) {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  
  useEffect(() => {
    // Se estiver em modo de espera, aguardar o tempo e depois mudar para deleção
    if (isWaiting) {
      const waitTimer = setTimeout(() => {
        setIsWaiting(false);
        setIsDeleting(true);
      }, delayBetween);
      return () => clearTimeout(waitTimer);
    }
    
    const target = words[currentIndex];
    let timer: NodeJS.Timeout;
    
    if (isDeleting) {
      // Deletando letra por letra
      if (currentText.length === 0) {
        // Quando terminar de deletar, passar para a próxima palavra
        setIsDeleting(false);
        setCurrentIndex((prev) => (prev + 1) % words.length);
      } else {
        timer = setTimeout(() => {
          setCurrentText((prev) => prev.slice(0, prev.length - 1));
        }, deletingSpeed);
      }
    } else {
      // Digitação letra por letra
      if (currentText === target) {
        // Palavra completa, iniciar espera
        setIsWaiting(true);
      } else {
        timer = setTimeout(() => {
          const nextChar = target.charAt(currentText.length);
          setCurrentText((prev) => prev + nextChar);
        }, typingSpeed);
      }
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [currentText, currentIndex, isDeleting, isWaiting, words, typingSpeed, deletingSpeed, delayBetween]);
  
  return currentText;
}

export default function HeroSection() {
  const words = ["alguém especial", "seu amigo", "quem você ama"];
  const displayText = useTypewriter(words, 100, 50, 2000);

  // Função para rolagem suave até a seção "plans"
  const scrollToPlans = () => {
    const plansSection = document.getElementById('plans');
    if (plansSection) {
      plansSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Adiciona uma classe específica para o background fixo no mobile
    const addMobileStyles = () => {
      // Adiciona estilos CSS diretamente para garantir que funcione em dispositivos móveis
      const styleEl = document.createElement('style');
      styleEl.textContent = `
        @media (max-width: 768px) {
          .mobile-bg-fixed {
            background:#000000;
            background-size: 400% 400%;
            background-attachment: fixed;
            animation: gradientAnimation 15s ease infinite;
          } 
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) rotate(25deg);
          }
          50% {
            opacity: 0.5;
          }
          100% {
            transform: translateX(100%) rotate(25deg);
            opacity: 0;
          }
        }
        
        @keyframes pulseGlow {
          0%, 100% {
            opacity: 0.2;
            transform: scale(0.95);
          }
          50% {
            opacity: 0.4;
            transform: scale(1);
          }
        }
      `;
      document.head.appendChild(styleEl);
    };
    
    addMobileStyles();
    
    // Cleanup function
    return () => {
      const styleElements = document.getElementsByTagName('style');
      for (let i = 0; i < styleElements.length; i++) {
        const element = styleElements[i];
        if (element && element.textContent && element.textContent.includes('mobile-bg-fixed')) {
          element.remove();
          break;
        }
      }
    };
  }, []);

  return (
    <>
      <section id="hero-section" className="relative py-12 md:py-28 px-5 sm:px-6 lg:px-8 overflow-hidden bg-black section-dark mobile-bg-fixed min-h-[80vh]">
        {/* Padrão de linhas de fundo */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
            opacity: 0.3
          }}></div>
        </div>

        {/* Máscara radial */}
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_70%)]"></div>
        
        {/* Efeito Spotlight */}
        <div className="pointer-events-none fixed inset-0 h-screen w-screen z-20">
          {/* Lado esquerdo */}
          <div className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none">
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
              style={{ 
                transform: 'translateY(-50%) translateX(-50%) rotate(-45deg)',
                background: 'radial-gradient(68.54% 68.72% at 55.02% 31.46%, rgba(255, 179, 179, 0.08) 0px, rgba(255, 26, 26, 0.02) 50%, rgba(230, 0, 0, 0) 80%)',
                width: '140vmax',
                height: '140vmax'
              }}
            ></div>
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
              style={{ 
                transform: 'translateY(-50%) translateX(-50%) rotate(45deg)',
                background: 'radial-gradient(50% 50% at 50% 50%, rgba(255, 179, 179, 0.04) 0px, rgba(230, 0, 0, 0.02) 80%, transparent 100%)',
                width: '140vmax',
                height: '140vmax'
              }}
            ></div>
          </div>

          {/* Efeito de brilho adicional */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
            style={{ 
              background: 'radial-gradient(50% 50% at 50% 50%, rgba(255, 179, 179, 0.05) 0%, transparent 100%)',
              width: '120vmax',
              height: '120vmax',
              opacity: 0.6
            }}
          ></div>
        </div>

        {/* Efeito de chuva de corações */}
        <HeartRain />

        {/* Conteúdo principal */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-36 relative z-50 min-h-[calc(100vh-15rem)]" data-sentry-component="Hero">
          <div className="w-full pt-[10px] lg:w-1/2 lg:pt-0 lg:ml-25">
            <button className="relative flex border content-center bg-black/20 hover:bg-black/10 transition duration-500 dark:bg-white/20 items-center flex-col flex-nowrap gap-10 h-min justify-center overflow-visible p-px decoration-clone w-fit rounded-full">
              <div className="w-auto z-10 px-4 py-2 rounded-[inherit] bg-black text-white text-xs flex items-center space-x-2">
                <span>Jogos para casais</span>
              </div>
              <div className="flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit]" style={{ filter: 'blur(2px)', position: 'absolute', width: '100%', height: '100%', background: 'radial-gradient(17.6138% 44.8061% at 12.3727% 38.4643%, rgb(255, 255, 255) 0%, rgba(255, 255, 255, 0) 100%)' }}></div>
              <div className="bg-black absolute z-1 flex-none inset-[2px] rounded-[100px]"></div>
            </button>
            
            <h1 className="text-white text-5xl lg:text-6xl font-sans pt-3 relative z-20 font-bold tracking-tight">
              Surpreenda
            </h1>
            
            <div className="relative font-bold tracking-tight text-5xl lg:text-6xl font-sans text-red-500 pb-8 z-20">
              <span>seu amor</span>
              <span className="animate-pulse">|</span>
            </div>
            
            <p className="max-w-xl text-left text-base relative md:text-lg text-neutral-300">
              Transforme o Dia dos Namorados em um novo começo para a relação.
            </p>
            
            <button 
              type="button" 
              onClick={scrollToPlans}
              className="relative mt-6 w-full lg:w-[50%] inline-flex h-[3.2rem] overflow-hidden rounded-lg p-[2px] focus:outline-none focus:ring-0"
              style={{
                WebkitTapHighlightColor: 'transparent',
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                touchAction: 'manipulation',
                WebkitTransform: 'translateZ(0)',
                transform: 'translateZ(0)',
                willChange: 'transform'
              }}
            >
              <span 
                className="absolute inset-[-1000%] bg-[conic-gradient(from_90deg_at_50%_50%,#ffcbcb_0%,#b23939_50%,#ffcbcb_100%)]"
                style={{
                  animation: 'spin 2s linear infinite',
                  WebkitAnimation: 'spin 2s linear infinite',
                  WebkitTransform: 'translateZ(0)',
                  transform: 'translateZ(0)',
                  WebkitBackfaceVisibility: 'hidden',
                  backfaceVisibility: 'hidden'
                }}
              ></span>
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-black px-3 py-1 text-sm font-semibold text-white backdrop-blur-3xl relative z-10">
                <span>Quero ver os jogos</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tabler-icon tabler-icon-chevron-right ml-4">
                  <path d="M9 6l6 6l-6 6"></path>
                </svg>
              </span>
            </button>
            
            <div className="flex flex-col gap-6">
              <div className="flex items-center mt-10 gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <div key={index} className="relative w-8 h-8 rounded-full border-2 border-white/20 shadow-sm overflow-hidden" style={{ zIndex: 6 - index }}>
                      <Image
                        alt={`Pessoa ${index}`}
                        src={`/images/approved/${index}.webp`}
                        width={32}
                        height={32}
                        className="object-cover"
                        priority={true}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="w-4 h-4 fill-amber-400 text-amber-400">
                        <path d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z"></path>
                      </svg>
                    ))}
                  </div>
                  <p className="text-xs text-white/80">Aprovado por 37.412 pessoas</p>
                </div>
              </div>

              {/* Selos de Verificação */}
              <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10">
                {/* Meta Verified */}
                <div className="flex items-center bg-white/5 px-3 py-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20" className="text-[#0866FF] mr-2">
                    <linearGradient id="meta_gradient" x1="9.993" x2="40.615" y1="9.993" y2="40.615" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#2aa4f4"/>
                      <stop offset="1" stopColor="#007ad9"/>
                    </linearGradient>
                    <path fill="currentColor" d="M24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20S35.046,4,24,4z"/>
                    <path fill="#fff" d="M26.707,29.301h5.176l0.813-5.258h-5.989v-2.874c0-2.184,0.714-4.121,2.757-4.121h3.283V12.46 c-0.577-0.078-1.797-0.248-4.102-0.248c-4.814,0-7.636,2.542-7.636,8.334v3.498H16.06v5.258h4.948v14.452 C21.988,43.9,22.981,44,24,44c0.921,0,1.82-0.084,2.707-0.204V29.301z"/>
                  </svg>
                  <div>
                    <p className="text-white text-xs font-medium">Meta</p>
                    <p className="text-white/60 text-[10px]">Verified Partner</p>
                  </div>
                </div>

                {/* Trustpilot */}
                <div className="flex items-center bg-white/5 px-3 py-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" className="text-[#00B67A] mr-2">
                    <path fill="currentColor" d="M12.8752 1.56838L15.3674 6.92771L21.1765 7.68559C21.4871 7.72671 21.7708 7.87613 21.9818 8.10997C22.1928 8.3438 22.3177 8.64684 22.3334 8.96551C22.3491 9.28418 22.2547 9.59798 22.0658 9.85215L17.8596 14.2314L18.9988 20.3382C19.0586 20.6547 19.0023 20.9816 18.8396 21.2567C18.677 21.5317 18.4186 21.7357 18.1163 21.8307C17.814 21.9257 17.4886 21.9056 17.1996 21.7742L12 19.2122L6.80038 21.7742C6.51141 21.9056 6.18599 21.9257 5.88367 21.8307C5.58134 21.7357 5.32299 21.5317 5.16034 21.2567C4.99769 20.9816 4.94142 20.6547 5.00118 20.3382L6.14038 14.2314L1.93415 9.85215C1.74527 9.59798 1.65087 9.28418 1.66658 8.96551C1.68229 8.64684 1.80716 8.3438 2.01818 8.10997C2.2292 7.87613 2.51293 7.72671 2.82346 7.68559L8.63262 6.92771L11.1248 1.56838C11.2643 1.27122 11.5036 1.02663 11.8008 0.87782C12.098 0.729011 12.4356 0.68457 12.7618 0.74991C13.088 0.815251 13.3816 0.987076 13.5973 1.23567C13.813 1.48427 13.9379 1.79521 13.9502 2.11938L12.8752 1.56838Z"/>
                  </svg>
                  <div>
                    <p className="text-white text-xs font-medium">Trustpilot</p>
                    <p className="text-white/60 text-[10px]">4.8/5 Rating</p>
                  </div>
                </div>

                {/* Google */}
                <div className="flex items-center bg-white/5 px-3 py-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20" className="mr-2">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                  <div>
                    <p className="text-white text-xs font-medium">Google</p>
                    <p className="text-white/60 text-[10px]">Top Trending</p>
                  </div>
                </div>

                {/* TikTok */}
                <div className="flex items-center bg-white/5 px-3 py-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20" className="mr-2">
                    <path fill="#00F2EA" d="M20.023 18.111v-1.703A15.941 15.941 0 0 1 18.756 16.3a16.084 16.084 0 0 1-4.836-7.235h-3.811v19.059a3.615 3.615 0 0 1-1.951 3.214 3.615 3.615 0 0 1-3.668-.16 3.615 3.615 0 0 1-1.853-3.154 3.615 3.615 0 0 1 1.745-3.214 3.615 3.615 0 0 1 3.668-.16l.098.049V20.9a7.215 7.215 0 0 0-3.863-.876 7.215 7.215 0 0 0-3.704 1.114 7.215 7.215 0 0 0-2.704 2.982 7.215 7.215 0 0 0 0 7.408 7.215 7.215 0 0 0 2.704 2.982 7.215 7.215 0 0 0 3.704 1.114 7.215 7.215 0 0 0 3.863-.876 7.215 7.215 0 0 0 2.982-2.704 7.215 7.215 0 0 0 1.114-3.704V13.275c1.972 2.151 4.511 3.657 7.336 4.836Z"/>
                    <path fill="#FF004F" d="M32.707 13.275v3.214a15.941 15.941 0 0 1-12.684-4.836v19.059a7.215 7.215 0 0 1-7.215 7.215 7.215 7.215 0 0 1-7.215-7.215 7.215 7.215 0 0 1 7.215-7.215v3.799a3.615 3.615 0 0 0-3.615 3.615 3.615 3.615 0 0 0 3.615 3.615 3.615 3.615 0 0 0 3.615-3.615V9.065h3.811a16.084 16.084 0 0 0 4.836 7.235 15.941 15.941 0 0 0 7.637 3.214Z"/>
                    <path fill="#FFF" d="M32.707 13.275a15.941 15.941 0 0 1-7.637-3.214 16.084 16.084 0 0 1-4.836-7.235h-3.811v19.059a3.615 3.615 0 0 1-7.215 0 3.615 3.615 0 0 1 7.215 0v3.799a7.215 7.215 0 0 0-7.215 7.215 7.215 7.215 0 0 0 7.215 7.215 7.215 7.215 0 0 0 7.215-7.215V13.275a15.941 15.941 0 0 0 12.684 4.836v-3.214a15.941 15.941 0 0 1-7.336-4.836Z"/>
                  </svg>
                  <div>
                    <p className="text-white text-xs font-medium">TikTok</p>
                    <p className="text-white/60 text-[10px]">Verified Creator</p>
                  </div>
                </div>

                {/* YouTube */}
                <div className="flex items-center bg-white/5 px-3 py-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20" className="mr-2">
                    <path fill="#FF0000" d="M43.2,33.9c-0.4,2.1-2.1,3.7-4.2,4c-3.3,0.5-8.8,1.1-15,1.1c-6.1,0-11.6-0.6-15-1.1c-2.1-0.3-3.8-1.9-4.2-4C4.4,31.6,4,28.2,4,24c0-4.2,0.4-7.6,0.8-9.9c0.4-2.1,2.1-3.7,4.2-4C12.3,9.6,17.8,9,24,9c6.2,0,11.6,0.6,15,1.1c2.1,0.3,3.8,1.9,4.2,4c0.4,2.3,0.9,5.7,0.9,9.9C44,28.2,43.6,31.6,43.2,33.9z"/>
                    <path fill="#FFF" d="M20 31L20 17 32 24z"/>
                  </svg>
                  <div>
                    <p className="text-white text-xs font-medium">YouTube</p>
                    <p className="text-white/60 text-[10px]">100K+ Views</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mockups de celulares */}
          <PhoneMockups />
        </div>
      </section>
      
      <div className="section-divider" />
    </>
  );
}