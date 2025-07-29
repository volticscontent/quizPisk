// Tipos principais do quiz
export type QuizStep = 'name' | 'whatsapp' | 'email' | 'instagram' | 'momento' | 'vendeu_fora' | 'faturamento' | 'caixa_disponivel' | 'problema_principal' | 'area_ajuda' | 'socio' | 'por_que_escolher' | 'compromisso' | 'analysis' | 'finished';

export interface Country {
  code: string;
  flag: string;
  name: string;
  phoneCode: string;
}

export interface MomentOption {
  id: string;
  text: string;
}

export interface FormData {
  // Dados pessoais (originais)
  name: string;
  phone: string;
  email: string;
  instagram: string;
  
  // Respostas do quiz (estrutura original) - APENAS TEXTOS
  moment: string;
  vendeuFora: string;
  faturamento: string;
  caixaDisponivel: string;
  problemaPrincipal: string;
  areaAjuda: string;
  possuiSocio: string;
  porQueEscolher: string;
  compromisso: string;
  
  // Metadados (originais)
  timestamp: string;
  submittedAt: string;
  
  // Campos adicionais para N8N (sem letras/IDs)
  country_code?: string;
  country_name?: string;
  phone_code?: string;
  form_version?: string;
  quiz_completed?: boolean;
  
  // UTM Parameters
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

export interface ValidationItem {
  status: 200 | 400 | 422; // 200: OK, 400: Bad Request, 422: Unprocessable Entity
  message?: string;
  required: boolean;
}

export type ValidationState = {
  [key in QuizStep]?: ValidationItem;
};

// Props dos componentes
export interface BaseContentProps {
  elementsVisible: boolean;
  inputFocused: boolean;
  setInputFocused: (focused: boolean) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
}

export interface NameContentProps extends BaseContentProps {
  name: string;
  setName: (name: string) => void;
  sendPartialLead: (stepName: string, stepData: { [key: string]: string }) => Promise<boolean>;
}

export interface WhatsAppContentProps extends BaseContentProps {
  name: string;
  phone: string;
  setPhone: (phone: string) => void;
  selectedCountry: Country;
  setSelectedCountry: (country: Country) => void;
  countries: Country[];
}

export interface EmailContentProps extends BaseContentProps {
  email: string;
  setEmail: (email: string) => void;
}

export interface InstagramContentProps extends BaseContentProps {
  instagram: string;
  setInstagram: (instagram: string) => void;
}

export interface MomentoContentProps {
  elementsVisible: boolean;
  optionsVisible: boolean;
  selectedMoment: string;
  setSelectedMoment: (moment: string) => void;
  momentOptions: MomentOption[];
}

export interface OptionQuestionProps {
  elementsVisible: boolean;
  questionNumber: string;
  questionText: string;
  options: MomentOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

export interface FinishedContentProps {
  elementsVisible: boolean;
  sendMetaEvent?: (eventName: string, data: Record<string, string | number | boolean>) => void;
  sessionId?: string;
  email?: string;
  phone?: string;
  trackCalendlyClick?: (fromStep: string) => void;
} 