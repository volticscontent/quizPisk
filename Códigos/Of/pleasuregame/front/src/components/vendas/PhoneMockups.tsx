"use client";

import { useRef } from 'react';

export default function PhoneMockups() {
  // Referências para os vídeos
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const video3Ref = useRef<HTMLVideoElement>(null);

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
            preload="metadata"
            autoPlay 
            loop 
            muted
            playsInline
            className="absolute top-0.5 left-0.5 lg:left-1 lg:top-2 rounded-md lg:rounded-3xl w-full h-full object-cover"
            src="https://pub-9e19518e85994c27a69dd5b29e669dca.r2.dev/V%C3%8DDEO-SITE-01.webm"
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
            preload="metadata"
            autoPlay 
            loop 
            muted
            playsInline
            className="absolute top-0.5 left-0.5 lg:left-1 lg:top-2 rounded-md lg:rounded-3xl w-full h-full object-cover"
            src="https://pub-9e19518e85994c27a69dd5b29e669dca.r2.dev/V%C3%8DDEO-SITE-02.webm"
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
            preload="metadata"
            autoPlay 
            loop 
            muted
            playsInline
            className="absolute top-0.5 left-0.5 lg:left-1 lg:top-2 rounded-md lg:rounded-3xl w-full h-full object-cover"
            src="https://pub-9e19518e85994c27a69dd5b29e669dca.r2.dev/V%C3%8DDEOS-SITE-03.webm"
          />
        </div>
      </div>
    </div>
  );
}