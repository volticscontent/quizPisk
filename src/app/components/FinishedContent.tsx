import { FinishedContentProps } from '../types/quiz';
import { CALENDLY_URL } from '../utils/constants';

export function FinishedContent({ elementsVisible, sendMetaEvent, sessionId, email, phone, trackCalendlyClick }: FinishedContentProps) {
  const handleCalendlyClick = () => {
    // Tracking Meta Pixel - Click no Calendly
    if (sendMetaEvent) {
      sendMetaEvent('QuClick-calendly', {
        form_completed: true,
        environment: 'production',
        session_id: sessionId || '',
        email: email || '',
        phone: phone || '',
        clicked_calendly: true
      });
    }
    
    // Tracking Clarity - Click no Calendly
    if (trackCalendlyClick) {
      trackCalendlyClick('finished');
    }
    
    // Redireciona para o Calendly
    window.open(CALENDLY_URL, '_blank');
  };

  return (
    <div>
      <div data-qa="question-header" className="header-wrapper-main">
        <div className="text-wrapper-main">
          <div className="title-container">
            <h1 className={`title-main-text ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.3s' }}>
              Obrigado! 🎉
            </h1>
            <div className={`title-secondary-text ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.5s' }}>
              Suas respostas foram enviadas com sucesso.
            </div>
            <div className={`title-secondary-text ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.7s' }}>
              Agora vamos agendar sua consultoria gratuita:
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 