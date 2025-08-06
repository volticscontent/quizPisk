import React, { useState, useCallback, useMemo } from 'react';

interface EmailContentProps {
  elementsVisible: boolean;
  email: string;
  setEmail: (email: string) => void;
  inputFocused: boolean;
  setInputFocused: (focused: boolean) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
}

export function EmailContent({ elementsVisible, email, setEmail, setInputFocused, handleKeyPress }: EmailContentProps) {
  const [emailError, setEmailError] = useState('');
  const [showError, setShowError] = useState(false);

  const validateEmail = useCallback((value: string) => {
    if (!value.trim()) {
      setEmailError('E-mail é obrigatório para continuar');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value.trim())) {
      setEmailError('Digite um e-mail válido (exemplo@dominio.com)');
      return false;
    }
    
    if (value.trim().length > 254) {
      setEmailError('E-mail muito longo (máximo 254 caracteres)');
      return false;
    }
    
    setEmailError('');
    return true;
  }, []);

  const isEmailValid = useMemo(() => validateEmail(email), [email, validateEmail]);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setEmail(newValue);
    if (showError) {
      validateEmail(newValue);
    }
  }, [setEmail, showError, validateEmail]);

  const handleEmailFocus = useCallback(() => {
    setInputFocused(true);
    setShowError(false);
  }, [setInputFocused]);

  const handleEmailBlur = useCallback(() => {
    setInputFocused(false);
    setShowError(true);
    validateEmail(email);
  }, [setInputFocused, validateEmail, email]);

  return (
    <div>
      <div data-qa="question-header" className="header-wrapper-main">
        <div className="text-wrapper-main">
          <div className="title-container">
            <h1 className={`title-main-text ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.3s' }}>
              <span className={`question-number ${elementsVisible ? 'number-bounce' : ''}`} style={{ animationDelay: '0.1s' }}>3.</span>Qual o seu e-mail?*
            </h1>
          </div>
        </div>
      </div>
      <div className="spacer-wrapper-description-main">
        <div className="form-group-main">
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            onFocus={handleEmailFocus}
            onBlur={handleEmailBlur}
            onKeyPress={handleKeyPress}
            placeholder="Digite seu e-mail..."
            className={`form-input-main ${elementsVisible ? 'input-fade-in' : 'input-hidden'} ${emailError && showError ? 'input-error' : ''} ${isEmailValid && email.length > 0 ? 'input-success' : ''}`}
            style={{ animationDelay: '0.5s' }}
            autoComplete="email"
            required
          />
          
          {showError && emailError && (
            <div className="error-message" style={{ color: '#ff4444', fontSize: '14px', marginTop: '8px', textAlign: 'center' }}>
              {emailError}
            </div>
          )}
          
          {isEmailValid && email.length > 0 && (
            <div className="success-message" style={{ color: '#2dd33b', fontSize: '14px', marginTop: '8px', textAlign: 'center' }}>
              ✓ E-mail válido
            </div>
          )}
          
          <div className="character-counter" style={{ 
            textAlign: 'right', 
            color: 'rgba(255, 255, 255, 0.6)', 
            fontSize: '12px', 
            marginTop: '8px' 
          }}>
            {email.length}/254
          </div>
        </div>
      </div>
    </div>
  );
} 