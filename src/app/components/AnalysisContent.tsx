import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface AnalysisContentProps {
  elementsVisible: boolean;
  onAnalysisComplete: () => void;
}

export function AnalysisContent({ elementsVisible, onAnalysisComplete }: AnalysisContentProps) {
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentAnalysisText, setCurrentAnalysisText] = useState('Iniciando análise...');
  const [isComplete, setIsComplete] = useState(false);

  const analysisSteps = [
    { progress: 20, text: 'Analisando suas respostas...' },
    { progress: 40, text: 'Identificando seu perfil...' },
    { progress: 60, text: 'Calculando potencial de crescimento...' },
    { progress: 80, text: 'Verificando compatibilidade...' },
    { progress: 100, text: 'Análise concluída!' }
  ];

  useEffect(() => {
    if (!elementsVisible) return;

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < analysisSteps.length) {
        const step = analysisSteps[currentStep];
        setAnalysisProgress(step.progress);
        setCurrentAnalysisText(step.text);
        currentStep++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
        // Aguarda 2 segundos após completar e chama callback
        setTimeout(() => {
          console.log('🤖 AnalysisContent: Chamando onAnalysisComplete...');
          onAnalysisComplete();
        }, 2000);
      }
    }, 1500); // Cada step demora 1.5s

    return () => clearInterval(interval);
  }, [elementsVisible, onAnalysisComplete]);

  return (
    <div className="analysis-container">
      <div data-qa="question-header" className="header-wrapper-main">
        <div className="text-wrapper-main">
          <div className="title-container">
            <h1 className={`title-main-text ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.3s' }}>
              <span className={`question-number ${elementsVisible ? 'number-bounce' : ''}`} style={{ animationDelay: '0.1s' }}>🤖</span>Nossa IA está analisando seu perfil
            </h1>
            <div className={`title-secondary-text quiz-subtitle ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.5s' }}>
              Aguarde alguns instantes enquanto processamos suas informações
            </div>
          </div>
        </div>
      </div>

      <div className="spacer-wrapper-description-main">
        {/* Logo da IA com animação */}
        <div className={`analysis-logo-container ${elementsVisible ? 'element-fade-in' : 'element-hidden'}`} style={{ animationDelay: '0.7s' }}>
          <div className="analysis-logo">
            <Image src="/lgSemFundo.png" alt="AI Analysis" width={80} height={80} />
          </div>
        </div>

        {/* Indicadores de IA */}
        <div className={`ai-indicators ${elementsVisible ? 'element-fade-in' : 'element-hidden'}`} style={{ animationDelay: '0.9s' }}>
          <div className="ai-dot ai-dot-1"></div>
          <div className="ai-dot ai-dot-2"></div>
          <div className="ai-dot ai-dot-3"></div>
        </div>

        {/* Barra de progresso */}
        <div className={`analysis-progress-container ${elementsVisible ? 'element-fade-in' : 'element-hidden'}`} style={{ animationDelay: '1.1s' }}>
          <div className="analysis-progress-bar">
            <div 
              className="analysis-progress-fill"
              style={{ width: `${analysisProgress}%` }}
            />
          </div>
          <div className="analysis-progress-text">
            {currentAnalysisText} ({analysisProgress}%)
          </div>
        </div>

        {/* Resultado da análise */}
        {isComplete && (
          <div className={`analysis-result ${elementsVisible ? 'element-fade-in' : 'element-hidden'}`} style={{ animationDelay: '0.2s' }}>
            <div className="analysis-title">
              <h2 style={{ 
                color: '#2dd33b', 
                fontSize: '24px', 
                fontWeight: '600', 
                marginBottom: '16px',
                textAlign: 'center' 
              }}>
                ✅ Perfil Aprovado!
              </h2>
            </div>
            <div className="analysis-subtitle">
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.9)', 
                fontSize: '18px', 
                lineHeight: '1.5',
                textAlign: 'center',
                maxWidth: '400px',
                margin: '0 auto' 
              }}>
                Você tem grande potencial! Nossa análise identificou que você é um candidato ideal para nosso programa.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 