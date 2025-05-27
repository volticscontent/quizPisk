"use client";

import React from 'react';
import Link from 'next/link';

interface Card3DProps {
  title: string;
  description: string;
  imageSrc: string;
  altText: string;
  isMobile?: boolean;
}

function Card3D({ title, description, imageSrc, altText, isMobile = false }: Card3DProps) {
  return (
    <div className="py-20 flex items-center justify-center" style={{ perspective: '1000px' }}>
      <div 
        className="flex items-center justify-center relative transition-all duration-200 ease-linear inter-var" 
        style={{ transformStyle: 'preserve-3d', transform: 'rotateY(0deg) rotateX(0deg)' }}
      >
        <div 
          className={`[transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d] relative group/card hover:shadow-2xl hover:shadow-emerald-500/[0.1] bg-black border-white/[0.2] w-auto sm:w-[30rem] h-auto ${isMobile ? '-mt-32 lg:mt-0' : ''} rounded-xl p-6 border`}
        >
          <div 
            className="w-fit transition duration-200 ease-linear text-xl font-bold text-white"
            style={{ transform: 'translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)' }}
          >
            {title}
          </div>
          
          <p 
            className="w-fit transition duration-200 ease-linear text-sm max-w-sm mt-2 text-neutral-300"
            style={{ transform: 'translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)' }}
          >
            {description}
          </p>
          
          <div 
            className="transition duration-200 ease-linear w-full mt-4"
            style={{ transform: 'translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)' }}
          >
            <img 
              alt={altText} 
              loading="lazy" 
              width="1000" 
              height="1000" 
              decoding="async" 
              className="w-full rounded-xl group-hover/card:shadow-xl" 
              src={imageSrc} 
              style={{ color: 'transparent' }}
            />
          </div>
          
          <div className="flex justify-between items-center mt-14">
            <div 
              className="w-fit transition duration-200 ease-linear px-4 py-2 rounded-xl text-xs font-normal text-white"
              style={{ transform: 'translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)' }}
            >
              Experimentar agora
            </div>
            
            <div 
              className="w-fit transition duration-200 ease-linear px-4 py-2 rounded-xl bg-white text-black text-xs font-bold cursor-pointer"
              style={{ transform: 'translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)' }}
            >
              Começar agora
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PlansSimple() {
  return (
    <section className="py-24 bg-black text-white">
      <div className="container flex flex-col items-center justify-center pb-12">
        <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-200 to-white text-3xl lg:text-5xl font-sans py-2 relative z-20 font-bold tracking-tight">
          Escolha o tema ideal
        </h2>
        
        <p className="max-w-xl text-center text-base md:text-lg text-neutral-200 mb-4">
          Escolha o tema ideal para a página personalizada. Você pode escolher entre os temas abaixo.
        </p>
        
        <div className="lg:grid lg:grid-cols-2 lg:gap-6">
          <Card3D 
            title="Padrão" 
            description="Tema padrão com contador de tempo e animações de fundo." 
            imageSrc="/images/themes/default.webp"
            altText="thumbnail"
          />
          
          <Card3D 
            title="Netflix" 
            description="Tema inspirado na Netflix com data e episódios(fotos) favoritos." 
            imageSrc="/images/themes/netflix.webp"
            altText="thumbnail"
            isMobile={true}
          />
        </div>
      </div>
    </section>
  );
} 