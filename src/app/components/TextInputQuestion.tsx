import React, { useState, useCallback, useMemo } from 'react';

// Função para formatar valores monetários (duplicada aqui para autonomia do componente)
const formatCurrencyInput = (value: string): string => {
  if (!value) return '';
  
  // Remove todos os caracteres que não são números
  const numbersOnly = value.replace(/[^\d]/g, '');
  
  // Se não há números, retorna vazio
  if (!numbersOnly) return '';
  
  // Converte para número e formata
  const numberValue = parseInt(numbersOnly);
  
  // Formata como moeda brasileira
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numberValue);
};

interface TextInputQuestionProps {
  elementsVisible: boolean;
  questionNumber: string;
  questionText: string;
  value: string;
  onChange: (value: string) => void;
  inputFocused: boolean;
  setInputFocused: (focused: boolean) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  isTextarea?: boolean;
  rows?: number;
  maxLength?: number;
  isCurrency?: boolean; // Nova prop para campos de moeda
}

export function TextInputQuestion({ 
  elementsVisible, 
  questionNumber, 
  questionText, 
  value, 
  onChange, 
  inputFocused, 
  setInputFocused, 
  handleKeyPress, 
  placeholder = "Digite sua resposta...", 
  isTextarea = false, 
  rows = 4,
  maxLength = 500,
  isCurrency = false
}: TextInputQuestionProps) {
  const [inputError, setInputError] = useState('');
  const [showError, setShowError] = useState(false);

  const validateInput = useCallback((inputValue: string) => {
    if (!inputValue.trim()) {
      setInputError('Este campo é obrigatório');
      return false;
    }
    
    if (isCurrency) {
      // Para campos de moeda, valida se há pelo menos um número
      const numbersOnly = inputValue.replace(/[^\d]/g, '');
      if (!numbersOnly || parseInt(numbersOnly) === 0) {
        setInputError('Informe um valor válido');
        return false;
      }
    } else {
      // Para campos de texto, valida tamanho mínimo
      if (inputValue.trim().length < 10) {
        setInputError('Mínimo 10 caracteres');
        return false;
      }
      if (inputValue.trim().length > maxLength) {
        setInputError(`Máximo ${maxLength} caracteres`);
        return false;
      }
    }
    
    setInputError('');
    return true;
  }, [maxLength, isCurrency]);

  const isInputValid = useMemo(() => validateInput(value), [value, validateInput]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    
    if (isCurrency) {
      // Para campos de moeda, aplica formatação
      const formattedValue = formatCurrencyInput(newValue);
      onChange(formattedValue);
    } else {
      // Para campos normais, aplica validação de tamanho
      if (newValue.length <= maxLength) {
        onChange(newValue);
        if (showError) {
          validateInput(newValue);
        }
      }
    }
  }, [onChange, showError, validateInput, maxLength, isCurrency]);

  const handleInputFocus = useCallback(() => {
    setInputFocused(true);
    setShowError(false);
  }, [setInputFocused]);

  const handleInputBlur = useCallback(() => {
    setInputFocused(false);
    setShowError(true);
    validateInput(value);
  }, [setInputFocused, validateInput, value]);

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
        <div className="form-group-main">
          {isTextarea ? (
            <textarea
              value={value}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onKeyDown={handleKeyPress}
              placeholder={placeholder}
              className={`form-textarea-main ${elementsVisible ? 'input-fade-in' : 'input-hidden'} ${inputError && showError ? 'input-error' : ''} ${isInputValid && value.length > 0 ? 'input-success' : ''}`}
              style={{ animationDelay: '0.5s' }}
              rows={rows}
              maxLength={maxLength}
              required
            />
          ) : (
            <input
              type="text"
              value={value}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              className={`form-input-main ${elementsVisible ? 'input-fade-in' : 'input-hidden'} ${inputError && showError ? 'input-error' : ''} ${isInputValid && value.length > 0 ? 'input-success' : ''}`}
              style={{ animationDelay: '0.5s' }}
              maxLength={maxLength}
              required
            />
          )}
          
          {showError && inputError && (
            <div className="error-message" style={{ color: '#ff4444', fontSize: '14px', marginTop: '8px', textAlign: 'center' }}>
              {inputError}
            </div>
          )}
          
          {isInputValid && value.length > 0 && (
            <div className="success-message" style={{ color: '#2dd33b', fontSize: '14px', marginTop: '8px', textAlign: 'center' }}>
              ✓ Campo válido
            </div>
          )}
          
          <div className={isTextarea ? "textarea-counter" : "character-counter"} style={{ 
            textAlign: 'right', 
            color: 'rgba(255, 255, 255, 0.6)', 
            fontSize: '12px', 
            marginTop: '8px' 
          }}>
            {value.length}/{maxLength}
          </div>
        </div>
      </div>
    </div>
  );
} 