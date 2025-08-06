import { Country, MomentOption } from '../types/quiz';

// URLs dos serviços
export const N8N_WEBHOOK_URL = 'https://n8n.landcriativa.com/webhook/84909c05-c376-4ebe-a630-7ef428ff1826';
export const POSTGRES_WEBHOOK_URL = 'https://n8n.landcriativa.com/webhook/postgres';
export const CALENDLY_URL = 'https://calendly.com/maximizedigitall/30min';

// Lista de países disponíveis
export const COUNTRIES: Country[] = [
  { code: 'BR', flag: '🇧🇷', name: 'Brasil', phoneCode: '+55' },
  { code: 'US', flag: '🇺🇸', name: 'Estados Unidos', phoneCode: '+1' },
  { code: 'PT', flag: '🇵🇹', name: 'Portugal', phoneCode: '+351' },
  { code: 'ES', flag: '🇪🇸', name: 'Espanha', phoneCode: '+34' },
  { code: 'FR', flag: '🇫🇷', name: 'França', phoneCode: '+33' },
  { code: 'IT', flag: '🇮🇹', name: 'Itália', phoneCode: '+39' },
  { code: 'DE', flag: '🇩🇪', name: 'Alemanha', phoneCode: '+49' },
  { code: 'GB', flag: '🇬🇧', name: 'Reino Unido', phoneCode: '+44' },
  { code: 'CA', flag: '🇨🇦', name: 'Canadá', phoneCode: '+1' },
  { code: 'AU', flag: '🇦🇺', name: 'Austrália', phoneCode: '+61' },
  { code: 'AR', flag: '🇦🇷', name: 'Argentina', phoneCode: '+54' },
  { code: 'CL', flag: '🇨🇱', name: 'Chile', phoneCode: '+56' },
  { code: 'CO', flag: '🇨🇴', name: 'Colômbia', phoneCode: '+57' },
  { code: 'MX', flag: '🇲🇽', name: 'México', phoneCode: '+52' },
  { code: 'PE', flag: '🇵🇪', name: 'Peru', phoneCode: '+51' },
  { code: 'UY', flag: '🇺🇾', name: 'Uruguai', phoneCode: '+598' },
  { code: 'PY', flag: '🇵🇾', name: 'Paraguai', phoneCode: '+595' },
  { code: 'BO', flag: '🇧🇴', name: 'Bolívia', phoneCode: '+591' },
  { code: 'EC', flag: '🇪🇨', name: 'Equador', phoneCode: '+593' },
  { code: 'VE', flag: '🇻🇪', name: 'Venezuela', phoneCode: '+58' },
  { code: 'JP', flag: '🇯🇵', name: 'Japão', phoneCode: '+81' },
  { code: 'KR', flag: '🇰🇷', name: 'Coreia do Sul', phoneCode: '+82' },
  { code: 'CN', flag: '🇨🇳', name: 'China', phoneCode: '+86' },
  { code: 'IN', flag: '🇮🇳', name: 'Índia', phoneCode: '+91' },
  { code: 'RU', flag: '🇷🇺', name: 'Rússia', phoneCode: '+7' },
  { code: 'ZA', flag: '🇿🇦', name: 'África do Sul', phoneCode: '+27' },
  { code: 'EG', flag: '🇪🇬', name: 'Egito', phoneCode: '+20' },
  { code: 'NG', flag: '🇳🇬', name: 'Nigéria', phoneCode: '+234' },
  { code: 'AO', flag: '🇦🇴', name: 'Angola', phoneCode: '+244' },
  { code: 'MZ', flag: '🇲🇿', name: 'Moçambique', phoneCode: '+258' }
];

// Opções do quiz
export const MOMENT_OPTIONS: MomentOption[] = [
  { id: 'A', text: 'Estou começando do zero no digital' },
  { id: 'B', text: 'Estou estruturando uma operação' },
  { id: 'C', text: 'Já tenho uma operação de dropshipping no Brasil, mas não vendo diariamente' },
  { id: 'D', text: 'Já faturo com constância' },
  { id: 'E', text: 'Sou de outra área do digital' }
];

export const VENDEU_FORA_OPTIONS: MomentOption[] = [
  { id: 'A', text: 'Nunca vendi' },
  { id: 'B', text: 'Já vendi algumas vezes' },
  { id: 'C', text: 'Vendo regularmente' }
];

export const CAIXA_OPTIONS: MomentOption[] = [
  { id: 'A', text: 'Menos de R$5.000' },
  { id: 'B', text: 'De R$5.000 a R$7.000' },
  { id: 'C', text: 'De R$7.000 a R$10.000' },
  { id: 'D', text: 'De R$10.000 a R$20.000' }
];

export const PROBLEMA_OPTIONS: MomentOption[] = [
  { id: 'A', text: 'Margem baixa vendendo no Brasil (custos altos, impostos)' },
  { id: 'B', text: 'Instabilidade econômica e política no Brasil' },
  { id: 'C', text: 'Limitação de escala no mercado brasileiro' },
  { id: 'D', text: 'Desejo de internacionalizar minha operação (segurança e diversificação)' },
  { id: 'E', text: 'Outro motivo (explique brevemente)' }
];

export const AREA_AJUDA_OPTIONS: MomentOption[] = [
  { id: 'A', text: 'Encontrar fornecedores internacionais com preços competitivos' },
  { id: 'B', text: 'Minerar produtos com alto potencial de escala no exterior' },
  { id: 'C', text: 'Estruturar processos e delegar funções para escalar meu negócio atual' },
  { id: 'D', text: 'Resolver problemas de gateways e processamento de pagamentos internacionais' },
  { id: 'E', text: 'Todos' }
];

export const SOCIO_OPTIONS: MomentOption[] = [
  { id: 'A', text: 'Sim' },
  { id: 'B', text: 'Não' }
];

export const COMPROMISSO_OPTIONS: MomentOption[] = [
  { id: 'A', text: 'Sim, me comprometo' },
  { id: 'B', text: 'Não' }
]; 