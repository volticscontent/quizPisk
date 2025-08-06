import React, { useState, useCallback, useMemo } from 'react';

interface InstagramContentProps {
  elementsVisible: boolean;
  instagram: string;
  setInstagram: (instagram: string) => void;
  inputFocused: boolean;
  setInputFocused: (focused: boolean) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
}

export function InstagramContent({ elementsVisible, instagram, setInstagram, inputFocused, setInputFocused, handleKeyPress }: InstagramContentProps) {
  const [instagramError, setInstagramError] = useState('');
  const [showError, setShowError] = useState(false);

  const validateInstagram = useCallback((value: string) => {
    if (!value.trim()) {
      setInstagramError('Instagram é obrigatório para continuar');
      return false;
    }
    
    const cleanValue = value.trim().replace(/^@/, '');
    
    if (cleanValue.length < 3) {
      setInstagramError('Username deve ter pelo menos 3 caracteres');
      return false;
    }
    
    if (cleanValue.length > 30) {
      setInstagramError('Username muito longo (máximo 30 caracteres)');
      return false;
    }
    
    if (!/^[a-zA-Z0-9_.]+$/.test(cleanValue)) {
      setInstagramError('Use apenas letras, números, pontos e underscores');
      return false;
    }
    
    if (cleanValue.startsWith('.') || cleanValue.endsWith('.')) {
      setInstagramError('Username não pode começar ou terminar com ponto');
      return false;
    }
    
    if (cleanValue.includes('..')) {
      setInstagramError('Username não pode ter pontos consecutivos');
      return false;
    }
    
    setInstagramError('');
    return true;
  }, []);

  const isInstagramValid = useMemo(() => validateInstagram(instagram), [instagram, validateInstagram]);

  const handleInstagramChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    
    // Remove @ se digitado pelo usuário
    if (newValue.startsWith('@')) {
      newValue = newValue.substring(1);
    }
    
    // Limita a 30 caracteres
    if (newValue.length <= 30) {
      setInstagram(newValue);
      if (showError) {
        validateInstagram(newValue);
      }
    }
  }, [setInstagram, showError, validateInstagram]);

  const handleInstagramFocus = useCallback(() => {
    setInputFocused(true);
    setShowError(false);
  }, [setInputFocused]);

  const handleInstagramBlur = useCallback(() => {
    setInputFocused(false);
    setShowError(true);
    validateInstagram(instagram);
  }, [setInputFocused, validateInstagram, instagram]);

  return (
    <div>
      <div data-qa="question-header" className="header-wrapper-main">
        <div className="text-wrapper-main">
          <div className="title-container">
            <h1 className={`title-main-text ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.3s' }}>
              <span className={`question-number ${elementsVisible ? 'number-bounce' : ''}`} style={{ animationDelay: '0.1s' }}>4.</span>Qual o seu Instagram?*
            </h1>
          </div>
        </div>
      </div>
      <div className="spacer-wrapper-description-main">
        <div className="form-group-main">
          <div className="instagram-input-container">
              <input
                type="text"
                value={instagram}
                onChange={handleInstagramChange}
                onFocus={handleInstagramFocus}
                onBlur={handleInstagramBlur}
                onKeyPress={handleKeyPress}
                placeholder="@seu_usuario"
                className={`instagram-input ${elementsVisible ? 'input-fade-in' : 'input-hidden'} ${instagramError && showError ? 'input-error' : ''} ${isInstagramValid && instagram.length > 0 ? 'input-success' : ''}`}
                style={{ animationDelay: '0.5s' }}
                autoComplete="username"
                required
              />
          </div>
          
          {showError && instagramError && (
            <div className="error-message" style={{ color: '#ff4444', fontSize: '14px', marginTop: '8px', textAlign: 'center' }}>
              {instagramError}
            </div>
          )}
          
          {isInstagramValid && instagram.length > 0 && (
            <div className="success-message" style={{ color: '#2dd33b', fontSize: '14px', marginTop: '8px', textAlign: 'center' }}>
              ✓ Instagram válido
            </div>
          )}
          
          <div className="character-counter" style={{ 
            textAlign: 'right', 
            color: 'rgba(255, 255, 255, 0.6)', 
            fontSize: '12px', 
            marginTop: '8px' 
          }}>
            {instagram.length}/30
          </div>
        </div>
      </div>
    </div>
  );
} 