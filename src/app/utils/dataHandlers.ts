import { FormData, Country } from '../types/quiz';

// Função para formatar valores monetários
export const formatCurrency = (value: string): string => {
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

// Função para mapear letras para textos completos das respostas
export const getResponseText = (questionType: string, selectedValue: string): string => {
  const optionsMap: { [key: string]: { [key: string]: string } } = {
    moment: {
      'A': 'Estou começando do zero no digital',
      'B': 'Estou estruturando uma operação',
      'C': 'Já tenho uma operação de dropshipping no Brasil, mas não vendo diariamente',
      'D': 'Já faturo com constância',
      'E': 'Sou de outra área do digital'
    },
    vendeuFora: {
      'A': 'Nunca vendi',
      'B': 'Já vendi algumas vezes',
      'C': 'Vendo regularmente'
    },
    caixaDisponivel: {
      'A': 'Menos de R$5.000',
      'B': 'De R$5.000 a R$7.000',
      'C': 'De R$7.000 a R$10.000',
      'D': 'De R$10.000 a R$20.000'
    },
    problemaPrincipal: {
      'A': 'Margem baixa vendendo no Brasil (custos altos, impostos)',
      'B': 'Instabilidade econômica e política no Brasil',
      'C': 'Limitação de escala no mercado brasileiro',
      'D': 'Desejo de internacionalizar minha operação (segurança e diversificação)',
      'E': 'Outro motivo (explique brevemente)'
    },
    areaAjuda: {
      'A': 'Encontrar fornecedores internacionais com preços competitivos',
      'B': 'Minerar produtos com alto potencial de escala no exterior',
      'C': 'Estruturar processos e delegar funções para escalar meu negócio atual',
      'D': 'Resolver problemas de gateways e processamento de pagamentos internacionais',
      'E': 'Todos'
    },
    possuiSocio: {
      'A': 'Sim',
      'B': 'Não'
    },
    compromisso: {
      'A': 'Sim, me comprometo',
      'B': 'Não'
    }
  };

  return optionsMap[questionType]?.[selectedValue] || selectedValue;
};

// Função REVERSA: converter texto de volta para ID (letra)
export const getResponseId = (questionType: string, responseText: string): string => {
  const optionsMap: { [key: string]: { [key: string]: string } } = {
    moment: {
      'Estou começando do zero no digital': 'A',
      'Estou estruturando uma operação': 'B',
      'Já tenho uma operação de dropshipping no Brasil, mas não vendo diariamente': 'C',
      'Já faturo com constância': 'D',
      'Sou de outra área do digital': 'E'
    },
    vendeuFora: {
      'Nunca vendi': 'A',
      'Já vendi algumas vezes': 'B',
      'Vendo regularmente': 'C'
    },
    caixaDisponivel: {
      'Menos de R$5.000': 'A',
      'De R$5.000 a R$7.000': 'B',
      'De R$7.000 a R$10.000': 'C',
      'De R$10.000 a R$20.000': 'D'
    },
    problemaPrincipal: {
      'Margem baixa vendendo no Brasil (custos altos, impostos)': 'A',
      'Instabilidade econômica e política no Brasil': 'B',
      'Limitação de escala no mercado brasileiro': 'C',
      'Desejo de internacionalizar minha operação (segurança e diversificação)': 'D',
      'Outro motivo (explique brevemente)': 'E'
    },
    areaAjuda: {
      'Encontrar fornecedores internacionais com preços competitivos': 'A',
      'Minerar produtos com alto potencial de escala no exterior': 'B',
      'Estruturar processos e delegar funções para escalar meu negócio atual': 'C',
      'Resolver problemas de gateways e processamento de pagamentos internacionais': 'D',
      'Todos': 'E'
    },
    possuiSocio: {
      'Sim': 'A',
      'Não': 'B'
    },
    compromisso: {
      'Sim, me comprometo': 'A',
      'Não': 'B'
    }
  };

  return optionsMap[questionType]?.[responseText] || responseText;
};

// Interface para UTM parameters
interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  fbclid?: string;
  gclid?: string;
  xcod?: string;
  referrer?: string;
  page_location?: string;
}

// Função para salvar dados no localStorage
export const saveToLocalStorage = (formData: {
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
  selectedCountry: Country;
}, utmParams?: UtmParams): FormData | null => {
  const dataToSave: FormData = {
    // Dados pessoais (estrutura original)
    name: formData.name || '',
    phone: formData.selectedCountry.phoneCode + (formData.phone || ''),
    email: formData.email || '',
    instagram: formData.instagram || '',
    
    // Respostas do quiz (SEMPRE com textos legíveis, nunca letras)
    moment: formData.selectedMoment ? getResponseText('moment', formData.selectedMoment) : '',
    vendeuFora: formData.vendeuFora ? getResponseText('vendeuFora', formData.vendeuFora) : '',
    faturamento: formData.faturamento ? formatCurrency(formData.faturamento) : '',
    caixaDisponivel: formData.caixaDisponivel ? getResponseText('caixaDisponivel', formData.caixaDisponivel) : '',
    problemaPrincipal: formData.problemaPrincipal ? getResponseText('problemaPrincipal', formData.problemaPrincipal) : '',
    areaAjuda: formData.areaAjuda ? getResponseText('areaAjuda', formData.areaAjuda) : '',
    possuiSocio: formData.possuiSocio ? getResponseText('possuiSocio', formData.possuiSocio) : '',
    porQueEscolher: formData.porQueEscolher || '',
    compromisso: formData.compromisso ? getResponseText('compromisso', formData.compromisso) : '',
    
    // Metadados (estrutura original)
    timestamp: new Date().toISOString(),
    submittedAt: new Date().toLocaleString('pt-BR'),
    
    // Campos adicionais para N8N
    country_code: formData.selectedCountry.code || 'BR',
    country_name: formData.selectedCountry.name || 'Brasil',
    phone_code: formData.selectedCountry.phoneCode || '+55',
    form_version: '1.0',
    quiz_completed: true,
    
    // UTM Parameters (incluídos apenas se fornecidos)
    ...(utmParams && {
      utm_source: utmParams.utm_source,
      utm_medium: utmParams.utm_medium,
      utm_campaign: utmParams.utm_campaign,
      utm_term: utmParams.utm_term,
      utm_content: utmParams.utm_content,
      fbclid: utmParams.fbclid,
      gclid: utmParams.gclid,
      xcod: utmParams.xcod,
      referrer: utmParams.referrer,
      page_location: utmParams.page_location
    })
  };
  
  try {
    localStorage.setItem('piscaform_data', JSON.stringify(dataToSave));
    console.log('✅ Dados salvos no localStorage (só textos, sem letras):', dataToSave);
    return dataToSave;
  } catch (error) {
    console.error('❌ Erro ao salvar no localStorage:', error);
    return null;
  }
};

// Função para carregar dados do localStorage
export const loadFromLocalStorage = () => {
  try {
    const savedData = localStorage.getItem('piscaform_data');
    if (savedData) {
      const formData = JSON.parse(savedData);
      console.log('📱 Dados carregados do localStorage:', formData);
      
      // Converter textos de volta para IDs para compatibilidade com os estados
      const processedData = {
        name: formData.name || '',
        email: formData.email || '',
        instagram: formData.instagram || '',
        faturamento: formData.faturamento || '',
        porQueEscolher: formData.porQueEscolher || '',
        
        // Converter textos de volta para IDs (letras) para os selects
        moment: formData.moment ? getResponseId('moment', formData.moment) : '',
        vendeuFora: formData.vendeuFora ? getResponseId('vendeuFora', formData.vendeuFora) : '',
        caixaDisponivel: formData.caixaDisponivel ? getResponseId('caixaDisponivel', formData.caixaDisponivel) : '',
        problemaPrincipal: formData.problemaPrincipal ? getResponseId('problemaPrincipal', formData.problemaPrincipal) : '',
        areaAjuda: formData.areaAjuda ? getResponseId('areaAjuda', formData.areaAjuda) : '',
        possuiSocio: formData.possuiSocio ? getResponseId('possuiSocio', formData.possuiSocio) : '',
        compromisso: formData.compromisso ? getResponseId('compromisso', formData.compromisso) : '',
        
        // Extrair telefone (remover código do país)
        phone: formData.phone ? formData.phone.replace(/^\+\d{1,4}/, '') : ''
      };
      
      console.log('📱 Dados processados para os estados:', processedData);
      return processedData;
    }
  } catch (error) {
    console.error('❌ Erro ao carregar do localStorage:', error);
  }
  return null;
}; 

// Função para salvar dados parciais a cada step (sem enviar para N8N)
export const savePartialDataToLocalStorage = (stepData: {
  name?: string;
  phone?: string;
  email?: string;
  instagram?: string;
  selectedMoment?: string;
  vendeuFora?: string;
  faturamento?: string;
  caixaDisponivel?: string;
  problemaPrincipal?: string;
  areaAjuda?: string;
  possuiSocio?: string;
  porQueEscolher?: string;
  compromisso?: string;
  selectedCountry?: Country;
}) => {
  try {
    // Carrega dados existentes
    const existingData = loadFromLocalStorage() || {};
    
    // Mescla com novos dados
    const updatedData = {
      ...existingData,
      ...stepData,
      // Atualiza timestamp
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('piscaform_partial_data', JSON.stringify(updatedData));
    console.log('💾 Dados parciais salvos:', stepData);
    return true;
  } catch (error) {
    console.error('❌ Erro ao salvar dados parciais:', error);
    return false;
  }
};

// Função para carregar dados parciais
export const loadPartialDataFromLocalStorage = () => {
  try {
    const savedData = localStorage.getItem('piscaform_partial_data');
    if (savedData) {
      const formData = JSON.parse(savedData);
      console.log('📱 Dados parciais carregados:', formData);
      return formData;
    }
  } catch (error) {
    console.error('❌ Erro ao carregar dados parciais:', error);
  }
  return null;
}; 