'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Home() {
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento por 3 segundos
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleButtonClick = () => {
    // Aqui você pode adicionar a navegação para a próxima página do quiz
    console.log('Iniciando quiz...');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleButtonClick();
    }
  };

  return (
    <>
      {/* Loading Screen */}
      <div className={`loading-screen ${!isLoading ? 'fade-out' : ''}`}>
        {/* WiFi Signal no canto superior direito */}
        <div className="loading-wifi-corner">
          <div className="wifi-bar"></div>
          <div className="wifi-bar"></div>
          <div className="wifi-bar"></div>
        </div>
        
        {/* Conteúdo centralizado */}
        <div className="loading-content">
          <div className="loading-logo">
            <Image src="/lgSemFundo.png" alt="Logo" width={120} height={120}/>
          </div>
          <div className="loading-text">Conectando...</div>
          <div className="loading-subtext">Preparando sua experiência</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="geometric-bg relative min-h-screen flex flex-col">
        {/* WiFi Signal Animation - Desktop only */}
        <div className="wifi-signal hidden md:block">
          <div className="wifi-bar"></div>
          <div className="wifi-bar"></div>
          <div className="wifi-bar"></div>
        </div>

        {/* Floating Currency Symbols - Desktop */}
        <div className="floating-currency currency-1">$</div>
        <div className="floating-currency currency-2">€</div>
        <div className="floating-currency currency-3">£</div>
        <div className="floating-currency currency-4">¥</div>
        <div className="floating-currency currency-5">₹</div>
        <div className="floating-currency currency-6">₿</div>
        
        {/* Header com logo */}
        <header className="absolute top-4 left-4 z-10">
          <div className="flex items-center">
            <Image src="/lgSemFundo.png" alt="Logo" width={65} height={65}/>
          </div>
        </header>

        {/* Conteúdo principal */}
        <main className="flex-1 flex items-center justify-center px-8 md:px-6 main-content-mobile">
          <div className="max-w-2xl text-center md:text-center text-content-mobile space-y-8">
            {/* Texto principal */}
            <div className="space-y-6">
              <h1 className="text-white text-4xl md:text-5xl title-mobile font-bold leading-tight">
                Olá, seja muito bem-vindo(a)!
              </h1>
              
              <div className="text-white text-lg md:text-xl leading-relaxed space-y-4">
                <p className="description-mobile">
                  Esta consultoria gratuita é para você que quer começar ou já 
                  trabalha no mercado digital e quer escalar seu negócio, 
                  faturando múltiplos 6 ou 7 dígitos por mês com Dropshipping no 
                  mercado Europeu.
                </p>
                
                <p className="text-gray-300 text-base subdescription-mobile">
                  O primeiro passo é responder algumas perguntas rápidas. Eu mesmo vou 
                  analisar suas respostas para verificar se você está pronto(a) para participar 
                  dessa consultoria estratégica comigo ou com a minha equipe! Vamos lá?
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Botão de ação */}
        <div className="flex justify-center px-6 pb-8">
          <button
            onClick={handleButtonClick}
            onKeyDown={handleKeyPress}
            onMouseDown={() => setIsButtonPressed(true)}
            onMouseUp={() => setIsButtonPressed(false)}
            onMouseLeave={() => setIsButtonPressed(false)}
            style={{ backgroundColor: 'var(--orange)' }}
            className={`
              hover:opacity-90 text-white font-semibold 
              px-30 py-3 md:px-14 md:py-3 rounded-lg text-base transition-all duration-200 
              focus:outline-none focus:ring-2 focus:ring-green-500/50
              ${isButtonPressed ? 'scale-95' : 'scale-100'}
              shadow-lg hover:shadow-xl max-w-xs
            `}
          >
            Vamos lá
          </button>
        </div>
        
        <div className="mb-15 text-center pb-4 text-gray-400 text-sm">
          carrega em <span className="font-mono">Enter ↵</span>
        </div>

        {/* Footer com créditos */}
        <footer className="absolute bottom-6 right-6">
          <div className="flex items-center space-x-2 text-sm">
            <div style={{ backgroundColor: 'var(--orange)' }} className="text-white px-2 py-1 rounded text-xs">
              ↗
            </div>
            <span className="text-gray-400">
              Powered by <span style={{ color: 'var(--orange)' }} className="font-medium">Typeform</span>
            </span>
          </div>
        </footer>
      </div>
    </>
  );
}
