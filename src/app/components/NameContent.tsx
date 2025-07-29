import React, { useState, useCallback, useMemo } from 'react';

interface NameContentProps {
  elementsVisible: boolean;
  name: string;
  setName: (name: string) => void;
  inputFocused: boolean;
  setInputFocused: (focused: boolean) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  sendPartialLead: (stepName: string, stepData: { [key: string]: string }) => Promise<boolean>;
}

export function NameContent({ elementsVisible, name, setName, inputFocused, setInputFocused, handleKeyPress, sendPartialLead }: NameContentProps) {
  const [nameError, setNameError] = useState('');
  const [showError, setShowError] = useState(false);

  const validateName = useCallback((value: string) => {
    if (!value.trim()) {
      setNameError('Nome é obrigatório para continuar');
      return false;
    }
    if (value.trim().length < 2) {
      setNameError('Nome deve ter pelo menos 2 caracteres');
      return false;
    }
    if (value.trim().length > 100) {
      setNameError('Nome muito longo (máximo 100 caracteres)');
      return false;
    }
    if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(value.trim())) {
      setNameError('Nome deve conter apenas letras, espaços, hífens e apostrofes');
      return false;
    }
    
    // Verifica se tem pelo menos um nome e um sobrenome
    const nameParts = value.trim().split(/\s+/);
    if (nameParts.length < 2) {
      setNameError('Digite seu nome completo (nome e sobrenome)');
      return false;
    }
    
    // Verifica se cada parte tem pelo menos 2 caracteres
    if (nameParts.some(part => part.length < 2)) {
      setNameError('Nome e sobrenome devem ter pelo menos 2 caracteres cada');
      return false;
    }
    
    setNameError('');
    return true;
  }, []);

  const isNameValid = useMemo(() => {
    if (!name.trim()) return false;
    if (name.trim().length < 2) return false;
    if (name.trim().length > 100) return false;
    if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(name.trim())) return false;
    
    const nameParts = name.trim().split(/\s+/);
    if (nameParts.length < 2) return false;
    if (nameParts.some(part => part.length < 2)) return false;
    
    return true;
  }, [name]);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    setShowError(false); // Remove erro enquanto está digitando
    
    // Valida em tempo real após 3 caracteres
    if (value.length >= 3) {
    validateName(value);
    } else if (value.length === 0) {
      setNameError('Nome é obrigatório para continuar');
    }
    
    // Rastreia evento de preenchimento do nome apenas se válido
    if (value.length >= 2 && validateName(value)) {
      // Debounce para evitar spam de eventos
      if (typeof window !== 'undefined') {
        clearTimeout(window.nameInputTimeout);
        window.nameInputTimeout = setTimeout(() => {
          // Envia lead parcial para PostgreSQL quando nome é válido
          sendPartialLead('name', { name: value.trim() });
        }, 1000); // Envia evento apenas 1 segundo após parar de digitar
      }
    }
  }, [setName, validateName, sendPartialLead]);

  const handleNameFocus = useCallback(() => {
    setInputFocused(true);
  }, [setInputFocused]);

  const handleNameBlur = useCallback(() => {
    setInputFocused(false);
    setShowError(true); // Mostra erro quando sai do campo
    validateName(name);
  }, [setInputFocused, validateName, name]);

  return (
    <div>
      <div data-qa="question-header" className="header-wrapper-main">
        <div className="text-wrapper-main">
          <div className="title-container">
            <h1 className={`title-main-text ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.3s' }}>
              <span className={`question-number ${elementsVisible ? 'number-bounce' : ''}`} style={{ animationDelay: '0.1s' }}>1.</span>Qual o seu nome?*
            </h1>
          </div>
        </div>
      </div>
      <div className="spacer-wrapper-description-main">
        <div className="form-group-main">
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            onFocus={handleNameFocus}
            onBlur={handleNameBlur}
            onKeyPress={handleKeyPress}
            placeholder="Digite seu nome completo..."
            className={`form-input-main ${elementsVisible ? 'input-fade-in' : 'input-hidden'} ${nameError && showError ? 'input-error' : ''} ${isNameValid && name.length > 0 ? 'input-success' : ''}`}
            style={{ animationDelay: '0.5s' }}
            autoComplete="name"
            required
          />
          
          {showError && nameError && (
            <div className="error-message" style={{ color: '#ff4444', fontSize: '14px', marginTop: '8px', textAlign: 'center' }}>
              {nameError}
            </div>
          )}
          
          {isNameValid && name.length > 0 && (
            <div className="success-message" style={{ color: '#2dd33b', fontSize: '14px', marginTop: '8px', textAlign: 'center' }}>
              ✓ Nome válido
            </div>
          )}
          
          <div className="character-counter" style={{ 
            textAlign: 'right', 
            color: 'rgba(255, 255, 255, 0.6)', 
            fontSize: '12px', 
            marginTop: '8px' 
          }}>
            {name.length}/100
          </div>
        </div>
      </div>
    </div>
  );
} 