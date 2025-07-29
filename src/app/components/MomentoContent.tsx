import { MomentoContentProps } from '../types/quiz';
import { MOMENT_OPTIONS } from '../utils/constants';

export function MomentoContent({ 
  elementsVisible, 
  selectedMoment, 
  setSelectedMoment,
  optionsVisible,
  momentOptions = MOMENT_OPTIONS
}: MomentoContentProps) {
  return (
    <div>
      <div data-qa="question-header" className="header-wrapper-main">
        <div className="text-wrapper-main">
          <div className="title-container">
            <h1 className={`title-main-text ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.3s' }}>
              <span className={`question-number ${elementsVisible ? 'number-bounce' : ''}`} style={{ animationDelay: '0.1s' }}>5.</span>Qual o seu momento atual?*
            </h1>
          </div>
        </div>
      </div>
      <div className="spacer-wrapper-description-main">
        <div className="quiz-options-container">
          {momentOptions.map((option, index) => (
            <button
              key={option.id}
              onClick={() => setSelectedMoment(option.id)}
              className={`quiz-option-button ${selectedMoment === option.id ? 'quiz-option-selected' : ''} ${optionsVisible ? 'quiz-option-visible' : 'quiz-option-hidden'}`}
              style={{ animationDelay: `${0.1 + index * 0.1}s` }}
            >
              <div className="quiz-option-letter">{option.id}</div>
              <div className="quiz-option-text">{option.text}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 