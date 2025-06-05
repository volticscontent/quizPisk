"use client";

import { useRef, useEffect, useState } from 'react';

// Hook para detectar se é dispositivo móvel
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(userAgent);
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
  }, []);
  
  return isMobile;
}

// Hook para carregamento otimizado de vídeos
function useOptimizedVideo(videoRef: React.RefObject<HTMLVideoElement | null>, isMobile: boolean) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    if (!videoRef.current) return;
    
    const video = videoRef.current;
    
    // Para dispositivos móveis, usar estratégia mais conservadora
    if (isMobile) {
      video.preload = 'none';
      video.muted = true;
      video.playsInline = true;
      
      // Carregar vídeo apenas quando estiver visível
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !isLoaded) {
              video.preload = 'metadata';
              video.load();
              setIsLoaded(true);
              
              // Tentar reproduzir após um pequeno delay
              setTimeout(() => {
                video.play().catch(() => {
                  // Se falhar, não fazer nada - deixar o usuário decidir
                });
              }, 500);
            }
          });
        },
        { threshold: 0.1 }
      );
      
      observer.observe(video);
      
      return () => {
        observer.disconnect();
      };
    } else {
      // Para desktop, comportamento normal
      video.preload = 'metadata';
      video.autoplay = true;
      video.play().catch(() => {
        // Fallback silencioso
      });
      setIsLoaded(true);
    }
  }, [videoRef, isMobile, isLoaded]);
  
  return isLoaded;
}

export default function PhoneMockups() {
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const video3Ref = useRef<HTMLVideoElement>(null);
  
  const isMobile = useIsMobile();
  
  // Usar hooks otimizados para cada vídeo
  useOptimizedVideo(video1Ref, isMobile);
  useOptimizedVideo(video2Ref, isMobile);
  useOptimizedVideo(video3Ref, isMobile);

  return (
    <div 
      className="relative lg:flex items-center w-full lg:w-1/2 justify-center h-[180px] md:h-[220px] lg:h-auto lg:mt-0 overflow-visible"
    >
      {/* Smartphone 1 - Esquerdo */}
      <div 
        className="absolute w-[80%] max-w-[100px] lg:max-w-[220px] lg:rotate-[-8deg] lg:translate-x-[-180px] top-[15px] md:top-[25px] lg:top-1/2 lg:-translate-y-1/2 left-[10px] md:left-[20px] lg:left-1/2 aspect-[9/16] transition-all duration-300 hover:z-50 hover:scale-110"
        style={{
          zIndex: 3,
          boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px, rgba(0, 0, 0, 0.08) 0px 1px 3px'
        }}
      >
        <img 
          alt="mockup" 
          className="absolute z-50 w-full h-full" 
          src="/images/mockup.webp"
        />
        <div className="relative w-[97%] h-[99%] rounded-2xl overflow-hidden cursor-not-allowed z-40">
          <video 
            ref={video1Ref}
            loop 
            muted
            playsInline
            className="absolute top-0.5 left-0.5 lg:left-1 lg:top-2 rounded-md lg:rounded-3xl w-full h-full object-cover"
            src="https://pub-9e19518e85994c27a69dd5b29e669dca.r2.dev/V%C3%8DDEO-SITE-01.webm"
            style={{ willChange: 'auto' }}
          />
        </div>
      </div>

      {/* Smartphone 2 - Central */}
      <div 
        className="absolute w-[80%] max-w-[100px] lg:max-w-[220px] lg:rotate-[5deg] aspect-[9/16] lg:mt-3 transition-all translate-x-[120px] lg:translate-x-[-20px] top-[15px] md:top-[25px] lg:top-1/2 lg:-translate-y-1/2 lg:left-1/2 duration-300 hover:z-50 hover:scale-110"
        style={{
          zIndex: 2,
          boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px, rgba(0, 0, 0, 0.08) 0px 1px 3px'
        }}
      >
        <img 
          alt="mockup" 
          className="absolute z-50 w-full h-full" 
          src="/images/mockup.webp"
        />
        <div className="relative w-[97%] h-[99%] rounded-2xl overflow-hidden cursor-not-allowed z-40">
          <video 
            ref={video2Ref}
            loop 
            muted
            playsInline
            className="absolute top-0.5 left-0.5 lg:left-1 lg:top-2 rounded-md lg:rounded-3xl w-full h-full object-cover"
            src="https://pub-9e19518e85994c27a69dd5b29e669dca.r2.dev/V%C3%8DDEO-SITE-02.webm"
            style={{ willChange: 'auto' }}
          />
        </div>
      </div>

      {/* Smartphone 3 - Direito */}
      <div 
        className="absolute w-[80%] max-w-[100px] lg:max-w-[220px] lg:rotate-[18deg] aspect-[9/16] lg:mt-12 translate-x-[240px] lg:translate-x-[140px] top-[15px] md:top-[25px] lg:top-1/2 lg:-translate-y-1/2 lg:left-1/2 transition-all duration-300 hover:z-50 hover:scale-110"
        style={{
          zIndex: 1,
          boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px, rgba(0, 0, 0, 0.08) 0px 1px 3px'
        }}
      >
        <img 
          alt="mockup" 
          className="absolute z-50 w-full h-full" 
          src="/images/mockup.webp"
        />
        <div className="relative w-[97%] h-[99%] rounded-2xl overflow-hidden cursor-not-allowed z-40">
          <video 
            ref={video3Ref}
            loop 
            muted
            playsInline
            className="absolute top-0.5 left-0.5 lg:left-1 lg:top-2 rounded-md lg:rounded-3xl w-full h-full object-cover"
            src="https://pub-9e19518e85994c27a69dd5b29e669dca.r2.dev/V%C3%8DDEOS-SITE-03.webm"
            style={{ willChange: 'auto' }}
          />
        </div>
      </div>
    </div>
  );
}