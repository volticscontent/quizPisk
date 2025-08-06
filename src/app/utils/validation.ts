import { QuizStep, Country } from '../types/quiz';

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2 && 
         /^[a-zA-ZÀ-ÿ\s\-']+$/.test(name.trim()) &&
         name.trim().split(/\s+/).length >= 2 &&
         name.trim().split(/\s+/).every((part: string) => part.length >= 2);
};

export const validatePhone = (phone: string, selectedCountry: Country): boolean => {
  const phoneClean = phone.replace(/[\s\(\)\-]/g, '');
  
  if (!phoneClean.trim()) return false;
  
  if (selectedCountry.phoneCode === '+55') {
    // Validação brasileira
    if (!/^\d{8,11}$/.test(phoneClean)) return false;
    if (phoneClean.length === 11 && phoneClean[2] !== '9') return false;
    if (phoneClean.length >= 10) {
      const validDDDs = ['11', '12', '13', '14', '15', '16', '17', '18', '19', '21', '22', '24', '27', '28', '31', '32', '33', '34', '35', '37', '38', '41', '42', '43', '44', '45', '46', '47', '48', '49', '51', '53', '54', '55', '61', '62', '63', '64', '65', '66', '67', '68', '69', '71', '73', '74', '75', '77', '79', '81', '82', '83', '84', '85', '86', '87', '88', '89', '91', '92', '93', '94', '95', '96', '97', '98', '99'];
      const ddd = phoneClean.substring(0, 2);
      return validDDDs.includes(ddd) && !/^(\d)\1+$/.test(phoneClean);
    } else {
      return !/^(\d)\1+$/.test(phoneClean);
    }
  } else if (selectedCountry.phoneCode === '+1') {
    // Validação EUA/Canadá
    return /^\d{10}$/.test(phoneClean) && !/^(\d)\1+$/.test(phoneClean);
  } else if (selectedCountry.phoneCode === '+351') {
    // Validação Portugal
    return /^\d{9}$/.test(phoneClean) && !/^(\d)\1+$/.test(phoneClean);
  } else {
    // Validação genérica
    return /^\d{7,15}$/.test(phoneClean) && !/^(\d)\1+$/.test(phoneClean);
  }
};

export const validateEmail = (email: string): boolean => {
  return email.trim().length > 0 && 
         /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
         email.trim().split('@')[0].length >= 3 &&
         email.trim().split('@')[1].split('.')[0].length >= 2 &&
         (email.trim().split('@')[1].split('.').pop()?.length || 0) >= 2;
};

export const validateInstagram = (instagram: string): boolean => {
  return instagram.trim().length > 0;
};

export const validateTextMinLength = (text: string, minLength: number = 10): boolean => {
  return text.trim().length >= minLength;
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateCurrentStep = (
  currentStep: QuizStep,
  formData: {
    name: string;
    phone: string;
    email: string;
    instagram: string;
    selectedMoment: string;
    vendeuFora: string;
    faturamento: string;
    caixaDisponivel: string;
    problemaPrincipal: string;
    areaAjuda: string;
    possuiSocio: string;
    porQueEscolher: string;
    compromisso: string;
  },
  selectedCountry: Country
): { isValid: boolean; errorMessage: string } => {
  switch (currentStep) {
    case 'name':
      const nameValid = validateName(formData.name);
      return {
        isValid: nameValid,
        errorMessage: nameValid ? '' : 'Digite seu nome completo (nome e sobrenome)'
      };

    case 'whatsapp':
      const phoneValid = validatePhone(formData.phone, selectedCountry);
      return {
        isValid: phoneValid,
        errorMessage: phoneValid ? '' : `Digite um número de telefone válido para ${selectedCountry.name}`
      };

    case 'email':
      const emailValid = validateEmail(formData.email);
      return {
        isValid: emailValid,
        errorMessage: emailValid ? '' : 'Digite um email válido'
      };

    case 'instagram':
      const instagramValid = validateInstagram(formData.instagram);
      return {
        isValid: instagramValid,
        errorMessage: instagramValid ? '' : 'Digite seu Instagram'
      };

    case 'momento':
      const momentoValid = validateRequired(formData.selectedMoment);
      return {
        isValid: momentoValid,
        errorMessage: momentoValid ? '' : 'Selecione uma opção'
      };

    case 'vendeu_fora':
      const vendeuForaValid = validateRequired(formData.vendeuFora);
      return {
        isValid: vendeuForaValid,
        errorMessage: vendeuForaValid ? '' : 'Selecione uma opção'
      };

    case 'faturamento':
      const faturamentoValid = validateRequired(formData.faturamento);
      return {
        isValid: faturamentoValid,
        errorMessage: faturamentoValid ? '' : 'Digite seu faturamento'
      };

    case 'caixa_disponivel':
      const caixaValid = validateRequired(formData.caixaDisponivel);
      return {
        isValid: caixaValid,
        errorMessage: caixaValid ? '' : 'Selecione uma opção'
      };

    case 'problema_principal':
      const problemaValid = validateRequired(formData.problemaPrincipal);
      return {
        isValid: problemaValid,
        errorMessage: problemaValid ? '' : 'Selecione uma opção'
      };

    case 'area_ajuda':
      const areaValid = validateRequired(formData.areaAjuda);
      return {
        isValid: areaValid,
        errorMessage: areaValid ? '' : 'Selecione uma opção'
      };

    case 'socio':
      const socioValid = validateRequired(formData.possuiSocio);
      return {
        isValid: socioValid,
        errorMessage: socioValid ? '' : 'Selecione uma opção'
      };

    case 'por_que_escolher':
      const porQueValid = validateTextMinLength(formData.porQueEscolher, 10);
      return {
        isValid: porQueValid,
        errorMessage: porQueValid ? '' : 'Escreva pelo menos 10 caracteres'
      };

    case 'compromisso':
      const compromissoValid = validateRequired(formData.compromisso);
      return {
        isValid: compromissoValid,
        errorMessage: compromissoValid ? '' : 'Selecione uma opção'
      };

    default:
      return { isValid: true, errorMessage: '' };
  }
}; 