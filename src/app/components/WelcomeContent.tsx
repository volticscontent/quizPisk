import React from 'react';

interface WelcomeContentProps {
  elementsVisible: boolean;
}

export function WelcomeContent({ elementsVisible }: WelcomeContentProps) {
  return (
    <div>
      <div data-qa="question-header" className="header-wrapper-main">
        <div className="counter-position-main">
          <div className="counter-wrapper-main">
            <div className="spacer-wrapper-main">
              <div id="header-counter" className="counter-content-main">
                <div data-qa="question-header-quote-mark" className={`quote-mark-main quote-bounce ${elementsVisible ? 'element-fade-in' : 'element-hidden'}`} style={{ animationDelay: '0.2s' }}>&quot;</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-wrapper-main">
          <div className="title-container">
            <div className={`title-secondary-text ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.5s' }}>
              Olá, seja muito bem-vindo(a)! Esta consultoria estratégica gratuita é ideal para você que deseja iniciar ou já atua no mercado digital e busca escalar seu negócio, faturando entre 50 e 100 mil por mês em moedas fortes como (Dólar, Euro ou Libra) através do Dropshipping internacional.
            </div>
          </div>
        </div>
      </div>
      
      <div className="spacer-wrapper-description-main">
        <p data-qa="block-description" className={`description-text-main ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.7s' }}>
          Primeiro passo: responda essas perguntas rápidas para avaliarmos se você está pronto(a) para participar dessa consultoria estratégica comigo ou minha equipe. Vamos lá?
        </p>
      </div>
    </div>
  );
} 