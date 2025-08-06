import { OptionQuestionProps } from '../types/quiz';

export function OptionQuestion({ 
  elementsVisible, 
  questionNumber, 
  questionText, 
  options, 
  selectedValue, 
  onSelect 
}: OptionQuestionProps) {
  return (
    <div>
      <div data-qa="question-header" className="header-wrapper-main">
        <div className="text-wrapper-main">
          <div className="title-container">
            <h1 className={`title-main-text ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.3s' }}>
              <span className={`question-number ${elementsVisible ? 'number-bounce' : ''}`} style={{ animationDelay: '0.1s' }}>{questionNumber}.</span>{questionText}*
            </h1>
          </div>
        </div>
      </div>
      <div className="spacer-wrapper-description-main">
        <div className="quiz-options-container">
          {options.map((option, index) => (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              className={`quiz-option-button ${selectedValue === option.id ? 'quiz-option-selected' : ''} ${elementsVisible ? 'quiz-option-visible' : 'quiz-option-hidden'}`}
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