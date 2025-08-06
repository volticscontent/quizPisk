import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Country } from '../types/quiz';

interface WhatsAppContentProps {
  elementsVisible: boolean;
  name: string;
  phone: string;
  setPhone: (phone: string) => void;
  inputFocused: boolean;
  setInputFocused: (focused: boolean) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  selectedCountry: Country;
  setSelectedCountry: (country: Country) => void;
  countries: Country[];
}

export function WhatsAppContent({ 
  elementsVisible, 
  name, 
  phone, 
  setPhone, 
  inputFocused, 
  setInputFocused, 
  handleKeyPress, 
  selectedCountry, 
  setSelectedCountry, 
  countries 
}: WhatsAppContentProps) {
  const [phoneError, setPhoneError] = useState('');
  const [showError, setShowError] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowCountryDropdown(false);
      }
    };

    if (showCountryDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showCountryDropdown]);

  const validatePhone = useCallback((value: string, countryCode: string) => {
    if (!value.trim()) {
      setPhoneError('Telefone é obrigatório para continuar');
      return false;
    }
    
    const phoneClean = value.replace(/[\s\(\)\-]/g, '');
    
    if (countryCode === '+55') {
      if (!/^\d{8,11}$/.test(phoneClean)) {
        setPhoneError('Telefone brasileiro deve ter 8 a 11 dígitos');
        return false;
      }
      
      if (phoneClean.length === 11 && phoneClean[2] !== '9') {
        setPhoneError('Celular de 11 dígitos deve começar com 9 após o DDD');
        return false;
      }
    } else if (countryCode === '+1') {
      if (!/^\d{10}$/.test(phoneClean)) {
        setPhoneError('Telefone americano/canadense deve ter 10 dígitos');
        return false;
      }
    } else {
      if (!/^\d{7,15}$/.test(phoneClean)) {
        setPhoneError('Telefone deve ter entre 7 e 15 dígitos');
        return false;
      }
    }
    
    if (/^(\d)\1+$/.test(phoneClean)) {
      setPhoneError('Digite um número de telefone válido');
      return false;
    }
    
    setPhoneError('');
    return true;
  }, []);

  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d\s\-\(\)]/g, '');
    const cleanValue = value.replace(/[\s\(\)\-]/g, '');
    setPhone(cleanValue);
    setShowError(false);
    
    if (cleanValue.length >= 7) {
      validatePhone(cleanValue, selectedCountry.phoneCode);
    } else if (cleanValue.length === 0) {
      setPhoneError('Telefone é obrigatório para continuar');
    }
  }, [setPhone, validatePhone, selectedCountry]);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setShowCountryDropdown(false);
    setPhone('');
    setPhoneError('');
    setShowError(false);
  };

  const isPhoneValid = useMemo(() => {
    return validatePhone(phone, selectedCountry.phoneCode);
  }, [phone, selectedCountry.phoneCode, validatePhone]);

  return (
    <div>
      <div data-qa="question-header" className="header-wrapper-main">
        <div className="text-wrapper-main">
          <div className="title-container">
            <h1 className={`title-main-text ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.3s' }}>
              <span className={`question-number ${elementsVisible ? 'number-bounce' : ''}`} style={{ animationDelay: '0.1s' }}>2.</span>Prazer, {name || 'Pedro'}! Qual é o seu número de WhatsApp?*
            </h1>
            <div className={`title-secondary-text quiz-subtitle ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.5s' }}>
              Selecione seu país e digite um número válido para contato
            </div>
          </div>
        </div>
      </div>
      
      <div className="spacer-wrapper-description-main">
        <div className={`phone-input-container-with-country ${inputFocused ? 'input-focused' : ''} ${elementsVisible ? 'input-fade-in' : 'input-hidden'} ${phoneError && showError ? 'input-error' : isPhoneValid ? 'input-success' : ''}`} style={{ animationDelay: '0.7s' }}>
          
          <div className="country-selector-container" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setShowCountryDropdown(!showCountryDropdown)}
              className="country-selector-button"
            >
              <span className="country-flag">{selectedCountry.flag}</span>
              <span className="country-code">{selectedCountry.phoneCode}</span>
              <span className="dropdown-arrow">▼</span>
            </button>
            
            {showCountryDropdown && (
              <div className="country-dropdown">
                <div className="country-dropdown-header">
                  <span>Selecione seu país</span>
                </div>
                <div className="country-list">
                  {countries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      className={`country-option ${selectedCountry.code === country.code ? 'selected' : ''}`}
                    >
                      <span className="country-flag">{country.flag}</span>
                      <span className="country-name">{country.name}</span>
                      <span className="country-phone-code">{country.phoneCode}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <input
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
            onKeyDown={handleKeyPress}
            onFocus={() => setInputFocused(true)}
            onBlur={() => {
              setInputFocused(false);
              setShowError(true);
              validatePhone(phone, selectedCountry.phoneCode);
            }}
            placeholder={selectedCountry.phoneCode === '+55' ? '(11) 99999-9999' : 'Digite seu telefone'}
            className="phone-input-with-country input-enhanced"
            autoFocus
            maxLength={20}
            required
          />
        </div>
        
        {phoneError && showError && (
          <div className="error-message" style={{ marginTop: '12px' }}>
            <span className="error-icon">⚠️</span>
            {phoneError}
          </div>
        )}
        {isPhoneValid && (
          <div className="success-message" style={{ marginTop: '12px' }}>
            <span className="success-icon">✅</span>
            Telefone válido para {selectedCountry.name}!
          </div>
        )}
      </div>
    </div>
  );
} 