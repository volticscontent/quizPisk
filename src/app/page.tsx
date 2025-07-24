'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

// Configuração do Google Analytics
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: Record<string, unknown>) => void;
  }
}

// CONFIGURE SEU GOOGLE ANALYTICS ID AQUI
const GA_MEASUREMENT_ID = 'G-D6BPDXCNJQ'; // Substitua pelo seu ID do Google Analytics

// Função para enviar eventos para o Google Analytics
const sendGAEvent = (eventName: string, parameters?: Record<string, string | number | boolean>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    console.log(`📊 GA Event: ${eventName}`, parameters);
    window.gtag('event', eventName, {
      event_category: 'Quiz',
      event_label: 'PiscaForm',
      ...parameters
    });
  } else {
    console.log(`📊 GA não carregado ainda. Event: ${eventName}`, parameters);
  }
};

// Função para rastrear visualização de página
const sendGAPageView = (pageName: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    console.log(`📄 GA PageView: ${pageName}`);
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_title: `PiscaForm - ${pageName}`,
      page_location: window.location.href,
      custom_map: {
        dimension1: pageName
      }
    });
  }
};

type QuizStep = 'welcome' | 'name' | 'whatsapp' | 'email' | 'instagram' | 'momento' | 'vendeu_fora' | 'faturamento' | 'caixa_disponivel' | 'problema_principal' | 'area_ajuda' | 'socio' | 'por_que_escolher' | 'compromisso' | 'finished';

interface Country {
  code: string;
  flag: string;
  name: string;
}

interface MomentOption {
  id: string;
  text: string;
}

interface NameContentProps {
  elementsVisible: boolean;
  name: string;
  setName: (name: string) => void;
  inputFocused: boolean;
  setInputFocused: (focused: boolean) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
}

interface WhatsAppContentProps {
  elementsVisible: boolean;
  name: string;
  phone: string;
  setPhone: (phone: string) => void;
  countryCode: string;
  setCountryCode: (code: string) => void;
  inputFocused: boolean;
  setInputFocused: (focused: boolean) => void;
  showCountryDropdown: boolean;
  setShowCountryDropdown: (show: boolean) => void;
  countries: Country[];
  handleKeyPress: (e: React.KeyboardEvent) => void;
}

interface InstagramContentProps {
  elementsVisible: boolean;
  instagram: string;
  setInstagram: (instagram: string) => void;
  inputFocused: boolean;
  setInputFocused: (focused: boolean) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
}

interface MomentoContentProps {
  elementsVisible: boolean;
  optionsVisible: boolean;
  selectedMoment: string;
  setSelectedMoment: (moment: string) => void;
  momentOptions: MomentOption[];
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState<QuizStep>('welcome');
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [progress, setProgress] = useState(0);
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const [elementsVisible, setElementsVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  
  // Estados dos dados do quiz
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+55');
  const [email, setEmail] = useState('');
  const [instagram, setInstagram] = useState('');
  const [selectedMoment, setSelectedMoment] = useState('');
  const [vendeuFora, setVendeuFora] = useState('');
  const [faturamento, setFaturamento] = useState('');
  const [caixaDisponivel, setCaixaDisponivel] = useState('');
  const [problemaPrincipal, setProblemaPrincipal] = useState('');
  const [areaAjuda, setAreaAjuda] = useState('');
  const [possuiSocio, setPossuiSocio] = useState('');
  const [porQueEscolher, setPorQueEscolher] = useState('');
  const [compromisso, setCompromisso] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'partial'>('idle');

  // Estados de validação
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [instagramError, setInstagramError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  // Apps Script URL - ATUALIZE COM A NOVA URL DO SEU DEPLOYMENT
  // Depois de criar o novo Apps Script, substitua a URL abaixo:
  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwCFQ7ZIitepAbGGANoZTgUTOI_Ua5MkZsy8qSlaMw9Gb_cXsCGKpgriYmsIWW7iiaH/exec';
  const N8N_WEBHOOK_URL = 'https://n8n.landcriativa.com/webhook/84909c05-c376-4ebe-a630-7ef428ff1826';
  // Função para testar a URL do Apps Script (TEMPORÁRIA - para debug)
  const testAppsScriptURL = async () => {
    console.log('🧪 Testando conexão com Apps Script...');
    console.log('📡 URL:', APPS_SCRIPT_URL);
    console.log('⚡ Status: Verificando se o deployment está correto...');
    
    try {
      // Teste 1: GET request simples para verificar se o Apps Script responde
      console.log('🔍 Teste 1: Verificando se o Apps Script está ativo...');
      const response = await fetch(APPS_SCRIPT_URL + '?test=true', {
        method: 'GET',
        mode: 'no-cors'
      });
      console.log('✅ Apps Script respondeu (GET):', response.type);
      
      // Teste 2: POST request com dados de teste para verificar salvamento
      console.log('🔍 Teste 2: Testando envio de dados...');
      const testData = {
        name: 'Teste Conectividade PiscaForm',
        email: 'teste@piscaform.com',
        phone: '+5511999999999',
        instagram: 'teste_piscaform',
        moment: 'A',
        vendeuFora: 'A',
        faturamento: 'B',
        caixaDisponivel: 'C',
        problemaPrincipal: 'A',
        areaAjuda: 'E',
        possuiSocio: 'B',
        porQueEscolher: 'Este é um teste automático do sistema PiscaForm para verificar a conectividade com Google Sheets.',
        compromisso: 'A',
        timestamp: new Date().toISOString(),
        submittedAt: new Date().toLocaleString('pt-BR'),
        isTest: true
      };

      const postResponse = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
        mode: 'no-cors',
      });
      
      console.log('✅ Dados de teste enviados:', postResponse.type);
      console.log('📋 Dados de teste enviados:', testData);
      
      // Teste 3: Verificar resposta com CORS (se possível)
      try {
        console.log('🔍 Teste 3: Tentando capturar resposta do servidor...');
        const corsResponse = await fetch(APPS_SCRIPT_URL, {
          method: 'GET',
          mode: 'cors'
        });
        
        if (corsResponse.ok) {
          const data = await corsResponse.json();
          console.log('📋 Resposta do Apps Script:', data);
          
          if (data.message && data.message.includes('funcionando')) {
            console.log('🎉 SUCESSO! Apps Script está configurado corretamente!');
          }
        }
      } catch (corsError) {
        console.log('ℹ️ CORS bloqueado (normal), mas o Apps Script deve estar funcionando');
        console.log('📝 Verifique sua planilha Google para confirmar se os dados de teste apareceram');
      }
      
      console.log('');
      console.log('📊 PRÓXIMOS PASSOS:');
      console.log('1. ✅ Verifique sua planilha Google Sheets');
      console.log('2. ✅ Procure por uma linha com "Teste Conectividade PiscaForm"');
      console.log('3. ✅ Se os dados apareceram, a integração está funcionando!');
      console.log('4. ⚠️ Se não apareceram, siga o guia GOOGLE_APPS_SCRIPT_401_FIX.md');
      console.log('');
      
    } catch (error) {
      console.error('❌ Erro ao testar Apps Script:', error);
      console.log('');
      console.log('🔧 SOLUÇÕES POSSÍVEIS:');
      console.log('1. 🔄 Recriar o deployment no Google Apps Script');
      console.log('2. ⚙️ Verificar permissões: "Executar como: Eu" e "Acesso: Qualquer pessoa"');
      console.log('3. 📝 Confirmar que o código do apps-script.js foi colado corretamente');
      console.log('4. 🔗 Atualizar a URL neste arquivo com a nova URL do deployment');
      console.log('5. 📋 Verificar se a planilha tem as permissões corretas');
    }
  };

  // Chama o teste automaticamente em desenvolvimento
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      setTimeout(() => {
        testAppsScriptURL();
      }, 2000);
    }
  }, []);

  // Função para mapear letras para textos completos das respostas
  const getResponseText = (questionType: string, selectedValue: string): string => {
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

  // Função para salvar dados no localStorage
  const saveToLocalStorage = () => {
    const formData = {
      name,
      phone: countryCode + phone,
      email,
      instagram,
      moment: getResponseText('moment', selectedMoment),
      vendeuFora: getResponseText('vendeuFora', vendeuFora),
      faturamento,
      caixaDisponivel: getResponseText('caixaDisponivel', caixaDisponivel),
      problemaPrincipal: getResponseText('problemaPrincipal', problemaPrincipal),
      areaAjuda: getResponseText('areaAjuda', areaAjuda),
      possuiSocio: getResponseText('possuiSocio', possuiSocio),
      porQueEscolher,
      compromisso: getResponseText('compromisso', compromisso),
      timestamp: new Date().toISOString(),
      submittedAt: new Date().toLocaleString('pt-BR')
    };
    
    try {
      localStorage.setItem('piscaform_data', JSON.stringify(formData));
      console.log('✅ Dados salvos no localStorage:', formData);
      return formData;
    } catch (error) {
      console.error('❌ Erro ao salvar no localStorage:', error);
      return null;
    }
  };

  // Interface para os dados do formulário
  interface FormData {
    name: string;
    phone: string;
    email: string;
    instagram: string;
    moment: string;
    vendeuFora: string;
    faturamento: string;
    caixaDisponivel: string;
    problemaPrincipal: string;
    areaAjuda: string;
    possuiSocio: string;
    porQueEscolher: string;
    compromisso: string;
    timestamp: string;
    submittedAt: string;
  }

  // Função para enviar dados para o webhook n8n
  const sendToN8nWebhook = async (formData: FormData) => {
    console.log('📤 Enviando dados para n8n webhook...', formData);
    console.log('🔗 URL n8n utilizada:', N8N_WEBHOOK_URL);

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const responseData = await response.text();
        console.log('✅ Dados enviados com sucesso para n8n!', responseData);
        return true;
      } else {
        console.error('❌ Erro ao enviar para n8n:', response.status, response.statusText);
        return false;
      }
    } catch (error) {
      console.error('❌ Erro de conexão com n8n:', error);
      return false;
    }
  };

  // Função para enviar dados para Google Sheets
  const sendToGoogleSheets = async (formData: FormData) => {
    if (!APPS_SCRIPT_URL) {
      console.warn('⚠️ URL do Apps Script não configurada');
      return false;
    }

    console.log('📤 Enviando dados para Google Sheets...', formData);
    console.log('🔗 URL utilizada:', APPS_SCRIPT_URL);

    // Criar FormData para envio correto ao Apps Script
    const postData = new FormData();
    postData.append('name', formData.name);
    postData.append('email', formData.email);
    postData.append('phone', formData.phone);
    postData.append('instagram', formData.instagram);
    postData.append('moment', formData.moment); // Agora enviará o texto completo
    postData.append('vendeuFora', formData.vendeuFora); // Agora enviará o texto completo
    postData.append('faturamento', formData.faturamento);
    postData.append('caixaDisponivel', formData.caixaDisponivel); // Agora enviará o texto completo
    postData.append('problemaPrincipal', formData.problemaPrincipal); // Agora enviará o texto completo
    postData.append('areaAjuda', formData.areaAjuda); // Agora enviará o texto completo
    postData.append('possuiSocio', formData.possuiSocio); // Agora enviará o texto completo
    postData.append('porQueEscolher', formData.porQueEscolher);
    postData.append('compromisso', formData.compromisso); // Agora enviará o texto completo
    postData.append('timestamp', formData.timestamp);
    postData.append('submittedAt', formData.submittedAt);

    console.log('📋 Dados preparados para envio:', Object.fromEntries(postData));

    // Método 1: Tentar com fetch + no-cors (mais compatível para CORS)
    try {
      console.log('🔄 Tentativa 1: fetch com no-cors (método principal)...');
      
      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        body: postData, // Usar FormData em vez de JSON
        mode: 'no-cors',
        credentials: 'omit',
        cache: 'no-cache',
      });

      console.log('✅ Dados enviados com fetch no-cors! Tipo:', response.type);
      console.log('📊 Status da resposta:', response.status || 'opaque');
      return true;
      
    } catch (fetchError) {
      console.error('❌ Erro com fetch no-cors:', fetchError);
    }

    // Método 2: Tentar envio via formulário HTML (contorna CORS completamente)
    try {
      console.log('🔄 Tentativa 2: Formulário HTML (contorna CORS)...');
      
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = APPS_SCRIPT_URL;
      form.target = '_blank';
      form.style.display = 'none';

      // Adiciona os dados como campos ocultos
      Object.entries(formData).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
      
      // Remove o formulário após envio
      setTimeout(() => {
        document.body.removeChild(form);
      }, 1000);

      console.log('✅ Formulário enviado com sucesso!');
      return true;
      
    } catch (formError) {
      console.error('❌ Erro com formulário:', formError);
    }

    console.error('❌ Todas as tentativas falharam');
    console.error('🔧 Verifique:');
    console.error('   1. Se o Google Apps Script foi autorizado');
    console.error('   2. Se a URL está correta');
    console.error('   3. Se o deployment está ativo');
    return false;
  };

  // Função para mapear step para nome do evento GA
  const getGAEventName = (step: QuizStep): string => {
    const eventMap: Record<QuizStep, string> = {
      welcome: 'quiz_start',
      name: 'pergunta_1_nome',
      whatsapp: 'pergunta_2_whatsapp', 
      email: 'pergunta_3_email',
      instagram: 'pergunta_4_instagram',
      momento: 'pergunta_5_momento_atual',
      vendeu_fora: 'pergunta_6_vendeu_fora',
      faturamento: 'pergunta_7_faturamento',
      caixa_disponivel: 'pergunta_8_caixa_disponivel',
      problema_principal: 'pergunta_9_problema_principal',
      area_ajuda: 'pergunta_10_area_ajuda',
      socio: 'pergunta_11_possui_socio',
      por_que_escolher: 'pergunta_12_por_que_escolher',
      compromisso: 'pergunta_13_compromisso',
      finished: 'quiz_complete'
    };
    
    return eventMap[step] || step;
  };

  // Função para enviar evento de progresso
  const sendProgressEvent = (step: QuizStep, progress: number) => {
    const eventName = getGAEventName(step);
    sendGAEvent(eventName, {
      step_name: step,
      progress_percentage: progress,
      step_number: getStepNumber(step)
    });
    
    // Também envia pageview
    sendGAPageView(`Pergunta ${getStepNumber(step)} - ${step}`);
  };

  // Função para obter número da etapa
  const getStepNumber = (step: QuizStep): number => {
    const stepNumbers: Record<QuizStep, number> = {
      welcome: 0,
      name: 1,
      whatsapp: 2,
      email: 3,
      instagram: 4,
      momento: 5,
      vendeu_fora: 6,
      faturamento: 7,
      caixa_disponivel: 8,
      problema_principal: 9,
      area_ajuda: 10,
      socio: 11,
      por_que_escolher: 12,
      compromisso: 13,
      finished: 14
    };
    
    return stepNumbers[step] || 0;
  };

  // Função para finalizar e enviar dados
  const finishQuiz = async () => {
    // Previne envios múltiplos
    if (isSubmitting) {
      console.log('⚠️ Envio já em andamento, aguarde...');
      return;
    }

    console.log('🎯 Finalizando quiz...');
    setIsSubmitting(true);
    
    // Envia evento de início do envio
    sendGAEvent('quiz_submit_started', {
      step_name: 'compromisso',
      step_number: 13
    });
    
    try {
      // Salva no localStorage primeiro
      const formData = saveToLocalStorage();
      
      if (formData) {
        console.log('💾 Dados salvos localmente, tentando enviar para múltiplos destinos...');
        
        // Envia para ambos os destinos em paralelo
        const [sheetsResult, n8nResult] = await Promise.allSettled([
          sendToGoogleSheets(formData),
          sendToN8nWebhook(formData)
        ]);

        let successCount = 0;
        const errorDetails = [];

        // Verifica resultado do Google Sheets
        if (sheetsResult.status === 'fulfilled' && sheetsResult.value) {
          console.log('✅ Dados enviados com sucesso para Google Sheets!');
          successCount++;
          sendGAEvent('quiz_submit_sheets_success');
        } else {
          console.log('❌ Falha ao enviar para Google Sheets:', sheetsResult);
          errorDetails.push('Google Sheets');
          sendGAEvent('quiz_submit_sheets_error');
        }

        // Verifica resultado do n8n
        if (n8nResult.status === 'fulfilled' && n8nResult.value) {
          console.log('✅ Dados enviados com sucesso para n8n webhook!');
          successCount++;
          sendGAEvent('quiz_submit_n8n_success');
        } else {
          console.log('❌ Falha ao enviar para n8n:', n8nResult);
          errorDetails.push('n8n webhook');
          sendGAEvent('quiz_submit_n8n_error');
        }

        // Define status baseado nos resultados
        if (successCount === 2) {
          console.log('🎉 Quiz finalizado e enviado com sucesso para todos os destinos!');
          setSubmitStatus('success');
          sendGAEvent('quiz_submit_complete_success', {
            destinations_successful: 2,
            total_destinations: 2
          });
        } else if (successCount === 1) {
          console.log(`⚠️ Quiz enviado parcialmente (${2 - successCount} de 2 falharam: ${errorDetails.join(', ')})`);
          setSubmitStatus('partial');
          sendGAEvent('quiz_submit_complete_partial', {
            destinations_successful: successCount,
            total_destinations: 2,
            failed_destinations: errorDetails.join(', ')
          });
        } else {
          console.log('❌ Falha ao enviar para todos os destinos, mas dados salvos localmente');
          setSubmitStatus('partial');
          sendGAEvent('quiz_submit_complete_failed', {
            destinations_successful: 0,
            total_destinations: 2
          });
        }
        
        // Opcional: mostrar notificação de sucesso
        if (successCount > 0 && typeof window !== 'undefined' && 'Notification' in window) {
          try {
            new Notification('PiscaForm', {
              body: `Seus dados foram enviados com sucesso para ${successCount} de 2 destinos!`,
              icon: '/lgSemFundo.png'
            });
          } catch (e) {
            console.log('Notificação não disponível');
          }
        }
      } else {
        console.error('❌ Erro ao salvar dados localmente');
        setSubmitStatus('error');
        sendGAEvent('quiz_submit_localstorage_error');
      }
    } catch (error) {
      console.error('❌ Erro ao finalizar quiz:', error);
      setSubmitStatus('error');
      sendGAEvent('quiz_submit_general_error', {
        error_message: String(error)
      });
    } finally {
      // Sempre libera o estado de submitting e transição
      setIsSubmitting(false);
      isTransitioning.current = false;
    }
    
    // Vai diretamente para a tela final sem chamar nextStep()
    console.log('🎊 Redirecionando para tela final...');
    setCurrentStep('finished');
    
    // Inicia animação da tela final
    setTimeout(() => {
      initiateStepAnimation('finished');
    }, 100);
    
    // Envia evento final do GA
    sendGAEvent('quiz_complete', {
      step_name: 'finished',
      step_number: 14,
      total_steps: 14
    });
  };

  // Refs para controle de hydratação e animações
  const hasHydrated = useRef(false);
  const animationTimers = useRef<NodeJS.Timeout[]>([]);
  const isTransitioning = useRef(false);
  const isMounted = useRef(true);

  const countries = [
    { code: '+55', flag: '🇧🇷', name: 'Brasil' },
    { code: '+1', flag: '🇺🇸', name: 'Estados Unidos' },
    { code: '+44', flag: '🇬🇧', name: 'Reino Unido' },
    { code: '+33', flag: '🇫🇷', name: 'França' },
    { code: '+49', flag: '🇩🇪', name: 'Alemanha' },
    { code: '+34', flag: '🇪🇸', name: 'Espanha' },
    { code: '+39', flag: '🇮🇹', name: 'Itália' },
    { code: '+351', flag: '🇵🇹', name: 'Portugal' },
  ];

  const momentOptions = [
    { id: 'A', text: 'Estou começando do zero no digital' },
    { id: 'B', text: 'Estou estruturando uma operação' },
    { id: 'C', text: 'Já tenho uma operação de dropshipping no Brasil, mas não vendo diariamente' },
    { id: 'D', text: 'Já faturo com constância' },
    { id: 'E', text: 'Sou de outra área do digital' },
  ];

  const vendeuForaOptions = [
    { id: 'A', text: 'Nunca vendi' },
    { id: 'B', text: 'Já vendi algumas vezes' },
    { id: 'C', text: 'Vendo regularmente' },
  ];

  const caixaOptions = [
    { id: 'A', text: 'Menos de R$5.000' },
    { id: 'B', text: 'De R$5.000 a R$7.000' },
    { id: 'C', text: 'De R$7.000 a R$10.000' },
    { id: 'D', text: 'De R$10.000 a R$20.000' },
  ];

  const problemaOptions = [
    { id: 'A', text: 'Margem baixa vendendo no Brasil (custos altos, impostos)' },
    { id: 'B', text: 'Instabilidade econômica e política no Brasil' },
    { id: 'C', text: 'Limitação de escala no mercado brasileiro' },
    { id: 'D', text: 'Desejo de internacionalizar minha operação (segurança e diversificação)' },
    { id: 'E', text: 'Outro motivo (explique brevemente)' },
  ];

  const areaAjudaOptions = [
    { id: 'A', text: 'Encontrar fornecedores internacionais com preços competitivos' },
    { id: 'B', text: 'Minerar produtos com alto potencial de escala no exterior' },
    { id: 'C', text: 'Estruturar processos e delegar funções para escalar meu negócio atual' },
    { id: 'D', text: 'Resolver problemas de gateways e processamento de pagamentos internacionais' },
    { id: 'E', text: 'Todos' },
  ];

  const socioOptions = [
    { id: 'A', text: 'Sim' },
    { id: 'B', text: 'Não' },
  ];

  const compromissoOptions = [
    { id: 'A', text: 'Sim, me comprometo' },
    { id: 'B', text: 'Não' },
  ];

  // Função para calcular o progresso baseado no step atual
  const getProgressForStep = (step: QuizStep): number => {
    const steps = ['welcome', 'name', 'whatsapp', 'email', 'instagram', 'momento', 'vendeu_fora', 'faturamento', 'caixa_disponivel', 'problema_principal', 'area_ajuda', 'socio', 'por_que_escolher', 'compromisso', 'finished'];
    const currentIndex = steps.indexOf(step);
    return Math.round((currentIndex / (steps.length - 1)) * 100);
  };



  // Função para limpar todos os timers
  const clearAllTimers = () => {
    animationTimers.current.forEach(timer => clearTimeout(timer));
    animationTimers.current = [];
  };

  const initiateWelcomeAnimation = useCallback(() => {
    if (!isMounted.current) return;
    
    clearAllTimers();
    setIsLoading(true);
    setBackgroundLoaded(false);
    setElementsVisible(false);
    setContentVisible(false);
    setOptionsVisible(false);
    
    const timers = [
      setTimeout(() => {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }, 1500),
      setTimeout(() => {
        if (isMounted.current) {
          setBackgroundLoaded(true);
        }
      }, 1650),
      setTimeout(() => {
        if (isMounted.current) {
          setElementsVisible(true);
        }
      }, 1800),
      setTimeout(() => {
        if (isMounted.current) {
          setContentVisible(true);
        }
      }, 2000),
    ];
    
    animationTimers.current = timers;
  }, []);

  const initiateStepAnimation = useCallback((stepType: QuizStep) => {
    if (!isMounted.current) return;
    
    console.log('🎭 Iniciando animação do step:', stepType);
    clearAllTimers();
    setIsLoading(false);
    
    // Reset imediato
    setContentVisible(false);
    setOptionsVisible(false);
    
    const timers = [
      setTimeout(() => {
        if (isMounted.current) {
          console.log('✨ Mostrando conteúdo para step:', stepType);
          setContentVisible(true);
        }
      }, 100),
      setTimeout(() => {
        if (isMounted.current && (
          stepType === 'momento' || 
          stepType === 'vendeu_fora' || 
          stepType === 'faturamento' || 
          stepType === 'caixa_disponivel' || 
          stepType === 'problema_principal' || 
          stepType === 'area_ajuda' || 
          stepType === 'socio' || 
          stepType === 'compromisso'
        )) {
          console.log('🎯 Mostrando opções para step:', stepType);
          setOptionsVisible(true);
        }
      }, 200),
    ];
    
    animationTimers.current = timers;
  }, []);

  // Função para carregar dados do localStorage
  const loadFromLocalStorage = () => {
    try {
      const savedData = localStorage.getItem('piscaform_data');
      if (savedData) {
        const formData = JSON.parse(savedData);
        console.log('📱 Dados carregados do localStorage:', formData);
        
        // Preenche os campos com os dados salvos
        setName(formData.name || '');
        setEmail(formData.email || '');
        setInstagram(formData.instagram || '');
        setSelectedMoment(formData.moment || '');
        setVendeuFora(formData.vendeuFora || '');
        setFaturamento(formData.faturamento || '');
        setCaixaDisponivel(formData.caixaDisponivel || '');
        setProblemaPrincipal(formData.problemaPrincipal || '');
        setAreaAjuda(formData.areaAjuda || '');
        setPossuiSocio(formData.possuiSocio || '');
        setPorQueEscolher(formData.porQueEscolher || '');
        setCompromisso(formData.compromisso || '');
        
        // Para o telefone, separa o código do país
        if (formData.phone) {
          const phoneMatch = formData.phone.match(/^(\+\d+)(.+)$/);
          if (phoneMatch) {
            setCountryCode(phoneMatch[1]);
            setPhone(phoneMatch[2]);
          }
        }
        
        return true;
      }
    } catch (error) {
      console.error('❌ Erro ao carregar do localStorage:', error);
    }
    return false;
  };

  // Controle de hydratação
  useEffect(() => {
    if (!hasHydrated.current) {
      setIsClient(true);
      hasHydrated.current = true;
      
      // Reseta estados de transição na inicialização
      isTransitioning.current = false;
      setIsSubmitting(false);
      setIsButtonPressed(false);
      
      // Carrega dados salvos se existirem
      loadFromLocalStorage();
      
      // Envia evento de início do quiz
      sendGAEvent('quiz_started', {
        timestamp: new Date().toISOString(),
        user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
        referrer: typeof window !== 'undefined' ? document.referrer : ''
      });
      
      // Inicia animação de boas-vindas imediatamente se estiver em welcome
      setTimeout(() => {
        if (hasHydrated.current) {
          console.log('🎭 Iniciando animação de welcome na inicialização');
          initiateWelcomeAnimation();
        }
      }, 100);
    }
  }, []);

  // Effect separado para limpar logs de debug após inicialização
  useEffect(() => {
    // Limpa os logs de debug em produção após 5 segundos
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      setTimeout(() => {
        console.clear();
      }, 5000);
    }
  }, []);

  // Rastreamento de abandono da página
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (currentStep !== 'finished') {
        sendGAEvent('quiz_abandoned', {
          current_step: currentStep,
          step_number: getStepNumber(currentStep),
          progress_percentage: getProgressForStep(currentStep),
          time_spent: Date.now() - (typeof window !== 'undefined' ? window.performance.timing.navigationStart : 0)
        });
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [currentStep]);

  // Controle de progresso baseado no step atual
  useEffect(() => {
    if (!hasHydrated.current) return;
    
    // Atualiza o progresso
    const newProgress = getProgressForStep(currentStep);
    setProgress(newProgress);
    
    // Envia evento para Google Analytics
    sendProgressEvent(currentStep, newProgress);
  }, [currentStep]);





  // Cleanup effect - limpa todos os timers ao desmontar
  useEffect(() => {
    return () => {
      isMounted.current = false;
      clearAllTimers();
    };
  }, []);

  const nextStep = () => {
    // Proteção robusta contra múltiplas execuções
    if (isTransitioning.current || isSubmitting) {
      console.log('⚠️ Transição já em andamento, ignorando...');
      return;
    }
    
    console.log('🔄 Iniciando transição de:', currentStep);
    isTransitioning.current = true;
    clearAllTimers();
    
    // Envia evento de conclusão da etapa atual
    sendGAEvent(`${getGAEventName(currentStep)}_completed`, {
      step_name: currentStep,
      step_number: getStepNumber(currentStep)
    });
    
    // Animação de saída apenas do conteúdo
    setContentVisible(false);
    setOptionsVisible(false);
    
    setTimeout(() => {
      let newStep: QuizStep;
      
      switch (currentStep) {
        case 'welcome':
          newStep = 'name';
          break;
        case 'name':
          newStep = 'whatsapp';
          break;
        case 'whatsapp':
          newStep = 'email';
          break;
        case 'email':
          newStep = 'instagram';
          break;
        case 'instagram':
          newStep = 'momento';
          break;
        case 'momento':
          newStep = 'vendeu_fora';
          break;
        case 'vendeu_fora':
          newStep = 'faturamento';
          break;
        case 'faturamento':
          newStep = 'caixa_disponivel';
          break;
        case 'caixa_disponivel':
          newStep = 'problema_principal';
          break;
        case 'problema_principal':
          newStep = 'area_ajuda';
          break;
        case 'area_ajuda':
          newStep = 'socio';
          break;
        case 'socio':
          newStep = 'por_que_escolher';
          break;
        case 'por_que_escolher':
          newStep = 'compromisso';
          break;
        case 'compromisso':
          // Este caso nunca deveria ser atingido pois compromisso vai para finishQuiz
          console.warn('⚠️ nextStep chamado no step compromisso - isso não deveria acontecer');
          newStep = 'finished';
          break;
        default:
          console.warn('⚠️ Step não reconhecido:', currentStep);
          newStep = 'welcome';
      }
      
      console.log('✅ Transicionando para:', newStep);
      setCurrentStep(newStep);
      
      // Permite novas transições e inicia animações de entrada
      setTimeout(() => {
        isTransitioning.current = false;
        console.log('🎯 Transição concluída, liberando controle');
        
        // Chama animação de entrada para o novo step
        if (newStep === 'welcome') {
          initiateWelcomeAnimation();
        } else {
          initiateStepAnimation(newStep);
        }
      }, 200);
    }, 100);
  };

  const previousStep = () => {
    if (isTransitioning.current) return; // Evita múltiplas execuções
    
    isTransitioning.current = true;
    clearAllTimers();
    
    // Animação de saída apenas do conteúdo
    setContentVisible(false);
    setOptionsVisible(false);
    
    setTimeout(() => {
      let newStep: QuizStep;
      
      switch (currentStep) {
        case 'name':
          newStep = 'welcome';
          break;
        case 'whatsapp':
          newStep = 'name';
          break;
        case 'email':
          newStep = 'whatsapp';
          break;
        case 'instagram':
          newStep = 'email';
          break;
        case 'momento':
          newStep = 'instagram';
          break;
        case 'vendeu_fora':
          newStep = 'momento';
          break;
        case 'faturamento':
          newStep = 'vendeu_fora';
          break;
        case 'caixa_disponivel':
          newStep = 'faturamento';
          break;
        case 'problema_principal':
          newStep = 'caixa_disponivel';
          break;
        case 'area_ajuda':
          newStep = 'problema_principal';
          break;
        case 'socio':
          newStep = 'area_ajuda';
          break;
        case 'por_que_escolher':
          newStep = 'socio';
          break;
        case 'compromisso':
          newStep = 'por_que_escolher';
          break;
        default:
          newStep = 'welcome';
      }
      
      setCurrentStep(newStep);
      
      // Permite novas transições e inicia animações de entrada
      setTimeout(() => {
        isTransitioning.current = false;
        // Chama animação de entrada para o novo step
        if (newStep === 'welcome') {
          initiateWelcomeAnimation();
        } else {
          initiateStepAnimation(newStep);
        }
      }, 200);
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleContinue();
    }
  };

  const handleContinue = () => {
    // Previne múltiplas execuções - proteção melhorada
    // EXCEÇÃO: Para welcome, permite sempre (caso especial)
    if ((isTransitioning.current || isSubmitting) && currentStep !== 'welcome') {
      console.log('⚠️ Ação já em andamento, aguarde...');
      return;
    }

    // Rastreia clique no botão continuar
    sendGAEvent('button_continue_clicked', {
      current_step: currentStep,
      step_number: getStepNumber(currentStep),
      progress_percentage: getProgressForStep(currentStep)
    });
    
    switch (currentStep) {
      case 'welcome':
        console.log('🎬 Botão "Vamos lá" clicado - iniciando transição');
        nextStep();
        break;
      case 'name':
        if (name.trim()) {
          sendGAEvent('field_validation_passed', {
            field_name: 'name',
            field_value_length: name.trim().length
          });
          nextStep();
        } else {
          sendGAEvent('field_validation_failed', {
            field_name: 'name',
            error_type: 'empty'
          });
        }
        break;
      case 'whatsapp':
        if (phone.trim()) {
          sendGAEvent('field_validation_passed', {
            field_name: 'phone',
            field_value_length: phone.trim().length,
            country_code: countryCode
          });
          nextStep();
        } else {
          sendGAEvent('field_validation_failed', {
            field_name: 'phone',
            error_type: 'empty'
          });
        }
        break;
      case 'email':
        if (email.trim()) {
          sendGAEvent('field_validation_passed', {
            field_name: 'email',
            email_domain: email.split('@')[1] || ''
          });
          nextStep();
        } else {
          sendGAEvent('field_validation_failed', {
            field_name: 'email',
            error_type: 'empty'
          });
        }
        break;
      case 'instagram':
        if (instagram.trim()) {
          sendGAEvent('field_validation_passed', {
            field_name: 'instagram',
            field_value_length: instagram.trim().length
          });
          nextStep();
        } else {
          sendGAEvent('field_validation_failed', {
            field_name: 'instagram',
            error_type: 'empty'
          });
        }
        break;
      case 'momento':
        if (selectedMoment) {
          nextStep();
        } else {
          sendGAEvent('validation_failed_no_selection', {
            question_name: 'momento'
          });
        }
        break;
      case 'vendeu_fora':
        if (vendeuFora) {
          nextStep();
        } else {
          sendGAEvent('validation_failed_no_selection', {
            question_name: 'vendeu_fora'
          });
        }
        break;
      case 'faturamento':
        if (faturamento.trim()) {
          sendGAEvent('field_validation_passed', {
            field_name: 'faturamento',
            field_value_length: faturamento.trim().length
          });
          nextStep();
        } else {
          sendGAEvent('field_validation_failed', {
            field_name: 'faturamento',
            error_type: 'empty'
          });
        }
        break;
      case 'caixa_disponivel':
        if (caixaDisponivel) {
          nextStep();
        } else {
          sendGAEvent('validation_failed_no_selection', {
            question_name: 'caixa_disponivel'
          });
        }
        break;
      case 'problema_principal':
        if (problemaPrincipal) {
          nextStep();
        } else {
          sendGAEvent('validation_failed_no_selection', {
            question_name: 'problema_principal'
          });
        }
        break;
      case 'area_ajuda':
        if (areaAjuda) {
          nextStep();
        } else {
          sendGAEvent('validation_failed_no_selection', {
            question_name: 'area_ajuda'
          });
        }
        break;
      case 'socio':
        if (possuiSocio) {
          nextStep();
        } else {
          sendGAEvent('validation_failed_no_selection', {
            question_name: 'socio'
          });
        }
        break;
      case 'por_que_escolher':
        if (porQueEscolher.trim() && porQueEscolher.trim().length >= 50) {
          sendGAEvent('field_validation_passed', {
            field_name: 'por_que_escolher',
            field_value_length: porQueEscolher.trim().length
          });
          nextStep();
        } else {
          sendGAEvent('field_validation_failed', {
            field_name: 'por_que_escolher',
            error_type: porQueEscolher.trim().length === 0 ? 'empty' : 'too_short',
            current_length: porQueEscolher.trim().length,
            required_length: 50
          });
        }
        break;
      case 'compromisso':
        if (compromisso) {
          // Não libera isTransitioning aqui pois vai para finishQuiz
          finishQuiz();
        } else {
          sendGAEvent('validation_failed_no_selection', {
            question_name: 'compromisso'
          });
        }
        break;
    }
  };

  const getButtonText = () => {
    switch (currentStep) {
      case 'welcome':
        return 'Vamos lá';
      case 'finished':
        return 'Finalizar';
      default:
        return 'OK';
    }
  };



  const isButtonDisabled = () => {
    // Se está enviando, desabilita o botão
    if (isSubmitting) return true;
    
    switch (currentStep) {
      case 'welcome': return false; // Welcome nunca é bloqueado
      case 'name': return !name.trim();
      case 'whatsapp': return !phone.trim();
      case 'email': return !email.trim();
      case 'instagram': return !instagram.trim();
      case 'momento': return !selectedMoment;
      case 'vendeu_fora': return !vendeuFora;
      case 'faturamento': return !faturamento.trim();
      case 'caixa_disponivel': return !caixaDisponivel;
      case 'problema_principal': return !problemaPrincipal;
      case 'area_ajuda': return !areaAjuda;
      case 'socio': return !possuiSocio;
      case 'por_que_escolher': return !porQueEscolher.trim() || porQueEscolher.trim().length < 50;
      case 'compromisso': return !compromisso;
      default: return false;
    }
  };

  // Funções de validação em tempo real
  const validateName = (value: string) => {
    if (!value.trim()) {
      setNameError('Nome é obrigatório');
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
    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value.trim())) {
      setNameError('Nome deve conter apenas letras');
      return false;
    }
    setNameError('');
    return true;
  };

  const validateEmail = (value: string) => {
    if (!value.trim()) {
      setEmailError('Email é obrigatório');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value.trim())) {
      setEmailError('Email inválido (exemplo: usuario@dominio.com)');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePhone = (value: string) => {
    if (!value.trim()) {
      setPhoneError('Telefone é obrigatório');
      return false;
    }
    const phoneClean = value.replace(/[\s\(\)\-]/g, '');
    if (!/^\d{10,11}$/.test(phoneClean)) {
      setPhoneError('Telefone deve ter 10 ou 11 dígitos (ex: 11999887766)');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const validateInstagram = (value: string) => {
    if (!value.trim()) {
      setInstagramError('Instagram é obrigatório');
      return false;
    }
    const instaClean = value.replace('@', '').trim();
    if (instaClean.length < 3 || instaClean.length > 30) {
      setInstagramError('Instagram deve ter entre 3 e 30 caracteres');
      return false;
    }
    if (!/^[a-zA-Z0-9_.]+$/.test(instaClean)) {
      setInstagramError('Instagram deve conter apenas letras, números, _ e .');
      return false;
    }
    setInstagramError('');
    return true;
  };

  // Função para validar formulário completo
  const validateForm = () => {
    const nameValid = validateName(name);
    const emailValid = validateEmail(email);
    const phoneValid = validatePhone(phone);
    const instagramValid = validateInstagram(instagram);
    
    const formValid = nameValid && emailValid && phoneValid && instagramValid;
    setIsFormValid(formValid);
    return formValid;
  };

  if (!isClient) {
    return null;
  }

  return (
    <>
      {/* Progress Bar - No topo */}
      <div 
        color="#FA6B05" 
        data-qa="progress-track" 
        role="progressbar" 
        aria-valuenow={progress} 
        aria-label="Form progress" 
        className="progress-track"
        suppressHydrationWarning={true}
      >
        <div 
          color="#FA6B05" 
          data-qa="progress-fill" 
          className="progress-fill"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Loading Screen */}
      {currentStep === 'welcome' && (
        <div className={`loading-screen ${!isLoading ? 'fade-out' : ''}`} suppressHydrationWarning={true}>
          <div className="loading-wifi-corner">
            <div className="wifi-bar"></div>
            <div className="wifi-bar"></div>
            <div className="wifi-bar"></div>
          </div>
          <div className="loading-content">
            <div className="loading-logo">
              <Image src="/lgSemFundo.png" alt="Logo" width={120} height={120} priority />
            </div>
            <div className="loading-text">Conectando...</div>
            <div className="loading-subtext">Preparando sua experiência</div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`geometric-bg relative min-h-screen flex flex-col ${backgroundLoaded ? 'content-fade-in' : 'content-hidden'}`}>
        {/* WiFi Signal Animation - Desktop only */}
        <div className={`wifi-signal hidden md:block ${elementsVisible ? 'element-fade-in' : 'element-hidden'}`} style={{ animationDelay: '0.1s' }}>
          <div className="wifi-bar"></div>
          <div className="wifi-bar"></div>
          <div className="wifi-bar"></div>
        </div>

        {/* Floating Currency Symbols - Desktop */}
        <div className={`floating-currency currency-1 ${elementsVisible ? 'element-fade-in' : 'element-hidden'}`} style={{ animationDelay: '0.2s' }}>$</div>
        <div className={`floating-currency currency-2 ${elementsVisible ? 'element-fade-in' : 'element-hidden'}`} style={{ animationDelay: '0.3s' }}>€</div>
        <div className={`floating-currency currency-3 ${elementsVisible ? 'element-fade-in' : 'element-hidden'}`} style={{ animationDelay: '0.4s' }}>£</div>
        <div className={`floating-currency currency-4 ${elementsVisible ? 'element-fade-in' : 'element-hidden'}`} style={{ animationDelay: '0.5s' }}>¥</div>
        <div className={`floating-currency currency-5 ${elementsVisible ? 'element-fade-in' : 'element-hidden'}`} style={{ animationDelay: '0.6s' }}>₹</div>
        <div className={`floating-currency currency-6 ${elementsVisible ? 'element-fade-in' : 'element-hidden'}`} style={{ animationDelay: '0.7s' }}>₿</div>
        
        {/* Header com logo */}
        <header className={`absolute top-4 left-4 z-50 ${elementsVisible ? 'element-fade-in' : 'element-hidden'}`} style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center">
            <Image src="/lgSemFundo.png" alt="Logo" width={65} height={65} priority />
          </div>
        </header>

        {/* Back Button - Só mostra se não estiver na tela inicial */}
        {currentStep !== 'welcome' && currentStep !== 'finished' && (
          <button 
            onClick={previousStep}
            className={`absolute top-4 right-4 z-10 p-2 text-white hover:text-orange-400 transition-all duration-300 hover:scale-110 ${elementsVisible ? 'element-fade-in' : 'element-hidden'}`}
            style={{ animationDelay: '0.2s' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}

        {/* Content Wrapper */}
        <div className={`content-wrapper-main ${elementsVisible ? 'content-slide-up' : 'content-hidden'}`}>
          <div className="root-container-main">
            <div className="spacer-container-main">
              <div data-qa="question-wrapper" className="question-wrapper-main">
                
                {/* Conteúdo dinâmico baseado no step atual */}
                {currentStep === 'welcome' && (
                  <WelcomeContent elementsVisible={contentVisible} />
                )}
                
                {currentStep === 'name' && (
                  <NameContent 
                    elementsVisible={contentVisible}
                    name={name}
                    setName={setName}
                    inputFocused={inputFocused}
                    setInputFocused={setInputFocused}
                    handleKeyPress={handleKeyPress}
                  />
                )}

                {currentStep === 'whatsapp' && (
                  <WhatsAppContent 
                    elementsVisible={contentVisible}
                    name={name}
                    phone={phone}
                    setPhone={setPhone}
                    countryCode={countryCode}
                    setCountryCode={setCountryCode}
                    inputFocused={inputFocused}
                    setInputFocused={setInputFocused}
                    showCountryDropdown={showCountryDropdown}
                    setShowCountryDropdown={setShowCountryDropdown}
                    countries={countries}
                    handleKeyPress={handleKeyPress}
                  />
                )}

                {currentStep === 'email' && (
                  <EmailContent 
                    elementsVisible={contentVisible}
                    email={email}
                    setEmail={setEmail}
                    inputFocused={inputFocused}
                    setInputFocused={setInputFocused}
                    handleKeyPress={handleKeyPress}
                  />
                )}

                {currentStep === 'instagram' && (
                  <InstagramContent 
                    elementsVisible={contentVisible}
                    instagram={instagram}
                    setInstagram={setInstagram}
                    inputFocused={inputFocused}
                    setInputFocused={setInputFocused}
                    handleKeyPress={handleKeyPress}
                  />
                )}

                {currentStep === 'momento' && (
                  <MomentoContent 
                    elementsVisible={contentVisible}
                    optionsVisible={optionsVisible}
                    selectedMoment={selectedMoment}
                    setSelectedMoment={setSelectedMoment}
                    momentOptions={momentOptions}
                  />
                )}

                {currentStep === 'vendeu_fora' && (
                  <VendeuForaContent 
                    elementsVisible={contentVisible}
                    optionsVisible={optionsVisible}
                    vendeuFora={vendeuFora}
                    setVendeuFora={setVendeuFora}
                    vendeuForaOptions={vendeuForaOptions}
                  />
                )}

                {currentStep === 'faturamento' && (
                  <FaturamentoContent 
                    elementsVisible={contentVisible}
                    faturamento={faturamento}
                    setFaturamento={setFaturamento}
                    inputFocused={inputFocused}
                    setInputFocused={setInputFocused}
                    handleKeyPress={handleKeyPress}
                  />
                )}

                {currentStep === 'caixa_disponivel' && (
                  <CaixaDisponivelContent 
                    elementsVisible={contentVisible}
                    optionsVisible={optionsVisible}
                    caixaDisponivel={caixaDisponivel}
                    setCaixaDisponivel={setCaixaDisponivel}
                    caixaOptions={caixaOptions}
                  />
                )}

                {currentStep === 'problema_principal' && (
                  <ProblemaPrincipalContent 
                    elementsVisible={contentVisible}
                    optionsVisible={optionsVisible}
                    problemaPrincipal={problemaPrincipal}
                    setProblemaPrincipal={setProblemaPrincipal}
                    problemaOptions={problemaOptions}
                  />
                )}

                {currentStep === 'area_ajuda' && (
                  <AreaAjudaContent 
                    elementsVisible={contentVisible}
                    optionsVisible={optionsVisible}
                    areaAjuda={areaAjuda}
                    setAreaAjuda={setAreaAjuda}
                    areaAjudaOptions={areaAjudaOptions}
                  />
                )}

                {currentStep === 'socio' && (
                  <SocioContent 
                    elementsVisible={contentVisible}
                    optionsVisible={optionsVisible}
                    possuiSocio={possuiSocio}
                    setPossuiSocio={setPossuiSocio}
                    socioOptions={socioOptions}
                  />
                )}

                {currentStep === 'por_que_escolher' && (
                  <PorQueEscolherContent 
                    elementsVisible={contentVisible}
                    porQueEscolher={porQueEscolher}
                    setPorQueEscolher={setPorQueEscolher}
                    inputFocused={inputFocused}
                    setInputFocused={setInputFocused}
                    handleKeyPress={handleKeyPress}
                  />
                )}

                {currentStep === 'compromisso' && (
                  <CompromissoContent 
                    elementsVisible={contentVisible}
                    optionsVisible={optionsVisible}
                    compromisso={compromisso}
                    setCompromisso={setCompromisso}
                    compromissoOptions={compromissoOptions}
                  />
                )}

                {currentStep === 'finished' && (
                  <FinishedContent 
                    elementsVisible={contentVisible} 
                    submitStatus={submitStatus}
                    isSubmitting={isSubmitting}
                  />
                )}


              </div>
            </div>
          </div>
        </div>

        {/* Footer com Botão - Formato Typeform Original */}
        <div className="footer-wrapperstyles__FooterWrapper-sc-12dpj1x-0 jGEmmb">
          <div data-qa="persistent-footer" className="persistent-footercomponent__PersistentFooterWrapper-sc-171bwtp-0 jTdQsH">
            <div color="#000000" className="persistent-footercomponent__TransparentBackground-sc-171bwtp-1 cgqYMs"></div>
            <div className="AnimateStyled-sc-__sc-nw4u3g-0 jPHXjX" data-qa="animate">
              <div className="persistent-footercomponent__ButtonsWrapper-sc-171bwtp-3 bYGfZr">
                <button 
                  data-qa="ok-button-visible-deep-purple-ok-button-visible" 
                  className={`ButtonWrapper-sc-__sc-1qu8p4z-0 eTknZ ${isButtonPressed ? 'button-pressed' : ''} ${isButtonDisabled() ? 'button-disabled' : ''}`}
                  onClick={handleContinue}
                  onKeyDown={handleKeyPress}
                  onMouseDown={() => !isButtonDisabled() && setIsButtonPressed(true)}
                  onMouseUp={() => setIsButtonPressed(false)}
                  onMouseLeave={() => setIsButtonPressed(false)}
                  disabled={isButtonDisabled()}
                >
                  <div className="ButtonBackground-sc-__sc-1qu8p4z-1 hlUeyE"></div>
                  <span className="FlexWrapper-sc-__sc-1qu8p4z-2 bnIfYq">
                    <span className="ButtonTextWrapper-sc-__sc-1qu8p4z-5 iWNLzO">
                      <span className="TextWrapper-sc-__sc-1f8vz90-0 gbnXlt">
                        {isSubmitting ? 'Enviando...' : getButtonText()}
                      </span>
                    </span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Componentes para cada etapa
function WelcomeContent({ elementsVisible }: { elementsVisible: boolean }) {
  return (
    <div>
      <div data-qa="question-header" className="header-wrapper-main">
        <div className="counter-position-main">
          <div className="counter-wrapper-main">
            <div className="spacer-wrapper-main">
              <div id="header-counter" className="counter-content-main">
                <div data-qa="question-header-quote-mark" className={`quote-mark-main quote-bounce ${elementsVisible ? 'element-fade-in' : 'element-hidden'}`} style={{ animationDelay: '0.2s' }}>&quot;</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-wrapper-main">
          <div className="title-container">
            <div className={`title-secondary-text ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.5s' }}>
              Olá, seja muito bem-vindo(a)! Esta consultoria estratégica gratuita é ideal para você que deseja iniciar ou já atua no mercado digital e busca escalar seu negócio, faturando entre 50 e 100 mil por mês em moedas fortes como (Dólar, Euro ou Libra) através do Dropshipping internacional.
            </div>
          </div>
        </div>
      </div>
      
      <div className="spacer-wrapper-description-main">
        <p data-qa="block-description" className={`description-text-main ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.7s' }}>
          Primeiro passo: responda essas perguntas rápidas para avaliarmos se você está pronto(a) para participar dessa consultoria estratégica comigo ou minha equipe. Vamos lá?
        </p>
      </div>
    </div>
  );
}

function NameContent({ elementsVisible, name, setName, inputFocused, setInputFocused, handleKeyPress }: {
  elementsVisible: boolean;
  name: string;
  setName: (name: string) => void;
  inputFocused: boolean;
  setInputFocused: (focused: boolean) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
}) {
  const [nameError, setNameError] = useState('');

  const validateName = (value: string) => {
    if (!value.trim()) {
      setNameError('Nome é obrigatório');
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
    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value.trim())) {
      setNameError('Nome deve conter apenas letras');
      return false;
    }
    setNameError('');
    return true;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    validateName(value);
    
    // Rastreia evento de preenchimento do nome
    if (value.length >= 2) {
      sendGAEvent('field_filled_name', {
        field_name: 'name',
        character_count: value.length,
        is_valid: validateName(value)
      });
    }
  };

  const handleNameFocus = () => {
    setInputFocused(true);
    sendGAEvent('field_focused_name', {
      field_name: 'name'
    });
  };

  return (
    <div>
      <div data-qa="question-header" className="header-wrapper-main">
        <div className="text-wrapper-main">
          <div className="title-container">
            <h1 className={`title-main-text ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.3s' }}>
              <span className={`question-number ${elementsVisible ? 'number-bounce' : ''}`} style={{ animationDelay: '0.1s' }}>1.</span>Qual é o seu nome?*
            </h1>
            <div className={`title-secondary-text quiz-subtitle ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.5s' }}>
              Digite seu nome completo
            </div>
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
            onBlur={() => setInputFocused(false)}
            onKeyDown={handleKeyPress}
            placeholder="Seu nome completo"
            className={`form-input-main ${nameError ? 'input-error' : ''}`}
            autoFocus
            maxLength={100}
          />
          {nameError && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {nameError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function WhatsAppContent({ elementsVisible, name, phone, setPhone, countryCode, setCountryCode, inputFocused, setInputFocused, showCountryDropdown, setShowCountryDropdown, countries, handleKeyPress }: WhatsAppContentProps) {
  const [phoneError, setPhoneError] = useState('');

  const validatePhone = (value: string) => {
    if (!value.trim()) {
      setPhoneError('Telefone é obrigatório');
      return false;
    }
    const phoneClean = value.replace(/[\s\(\)\-]/g, '');
    if (!/^\d{10,11}$/.test(phoneClean)) {
      setPhoneError('Telefone deve ter 10 ou 11 dígitos (ex: 11999887766)');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d\s\-\(\)]/g, '');
    setPhone(value);
    validatePhone(value);
    
    // Rastreia evento de preenchimento do telefone
    if (value.length >= 8) {
      sendGAEvent('field_filled_phone', {
        field_name: 'phone',
        character_count: value.length,
        country_code: countryCode,
        is_valid: validatePhone(value)
      });
    }
  };

  const selectCountry = (country: Country) => {
    setCountryCode(country.code);
    setShowCountryDropdown(false);
    
    // Rastreia seleção de país
    sendGAEvent('country_selected', {
      country_code: country.code,
      country_name: country.name
    });
  };

  return (
    <div>
      <div data-qa="question-header" className="header-wrapper-main">
        <div className="text-wrapper-main">
          <div className="title-container">
            <h1 className={`title-main-text ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.3s' }}>
              <span className={`question-number ${elementsVisible ? 'number-bounce' : ''}`} style={{ animationDelay: '0.1s' }}>2.</span>Prazer, {name || 'Pedro'}! Qual é o seu número de WhatsApp?*
            </h1>
            <div className={`title-secondary-text quiz-subtitle ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.5s' }}>
              Vamos precisar entrar em contato com você
              <span className="validation-tooltip">
                ℹ️
                <div className="tooltip-content">
                  10-11 dígitos (ex: 11999887766)
                </div>
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="spacer-wrapper-description-main">
        <div className={`phone-input-container ${inputFocused ? 'input-focused' : ''} ${elementsVisible ? 'input-fade-in' : 'input-hidden'} ${phoneError ? 'input-error' : phone && !phoneError ? 'input-success' : ''}`} style={{ animationDelay: '0.7s' }}>
          <div className="phone-input-wrapper">
            <div className="country-selector-wrapper">
              <button
                type="button"
                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                className="country-selector"
              >
                <span className="country-flag">🇧🇷</span>
                <span className="country-code">{countryCode}</span>
                <svg className="dropdown-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              {showCountryDropdown && (
                <div className="country-dropdown">
                  {countries.map((country: Country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => selectCountry(country)}
                      className="country-option"
                    >
                      <span className="country-flag">{country.flag}</span>
                      <span className="country-name">{country.name}</span>
                      <span className="country-code-option">{country.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              onKeyDown={handleKeyPress}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              placeholder="11999887766"
              className="phone-input input-enhanced"
              autoFocus
              maxLength={15}
            />
          </div>
          <div className="input-underline input-underline-enhanced"></div>
        </div>
        
        {phoneError && (
          <div className="error-message" style={{ marginTop: '12px' }}>
            <span className="error-icon">⚠️</span>
            {phoneError}
          </div>
        )}
        {phone && !phoneError && (
          <div className="success-message" style={{ marginTop: '12px' }}>
            <span className="success-icon">✅</span>
            Telefone válido!
          </div>
        )}
      </div>
    </div>
  );
}

function EmailContent({ elementsVisible, email, setEmail, inputFocused, setInputFocused, handleKeyPress }: {
  elementsVisible: boolean;
  email: string;
  setEmail: (email: string) => void;
  inputFocused: boolean;
  setInputFocused: (focused: boolean) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
}) {
  const [emailError, setEmailError] = useState('');

  const validateEmail = (value: string) => {
    if (!value.trim()) {
      setEmailError('Email é obrigatório');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value.trim())) {
      setEmailError('Email inválido (exemplo: usuario@dominio.com)');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  return (
    <div>
      <div data-qa="question-header" className="header-wrapper-main">
        <div className="text-wrapper-main">
          <div className="title-container">
            <h1 className={`title-main-text ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.3s' }}>
              <span className={`question-number ${elementsVisible ? 'number-bounce' : ''}`} style={{ animationDelay: '0.1s' }}>3.</span>Agora insira seu e-mail*
            </h1>
            <div className={`title-secondary-text quiz-subtitle ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.5s' }}>
              Digite seu melhor e-mail para contato
              <span className="validation-tooltip">
                ℹ️
                <div className="tooltip-content">
                  Formato: usuario@dominio.com
                </div>
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="spacer-wrapper-description-main">
        <div className="form-group-main">
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            onKeyDown={handleKeyPress}
            placeholder="seu@email.com"
            className={`form-input-main ${emailError ? 'input-error' : email && !emailError ? 'input-success' : ''}`}
            autoFocus
          />
          {emailError && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {emailError}
            </div>
          )}
          {email && !emailError && (
            <div className="success-message">
              <span className="success-icon">✅</span>
              Email válido!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InstagramContent({ elementsVisible, instagram, setInstagram, inputFocused, setInputFocused, handleKeyPress }: InstagramContentProps) {
  const handleInstagramChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value.startsWith('@')) {
      value = value.substring(1);
    }
    value = value.replace(/[^a-zA-Z0-9_.]/g, '');
    setInstagram(value);
  };

  return (
    <div>
      <div data-qa="question-header" className="header-wrapper-main">
        <div className="text-wrapper-main">
          <div className="title-container">
            <h1 className={`title-main-text ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.3s' }}>
              <span className={`question-number ${elementsVisible ? 'number-bounce' : ''}`} style={{ animationDelay: '0.1s' }}>4.</span>Qual o seu @ do Instagram?*
            </h1>
            <div className={`title-secondary-text quiz-subtitle ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.5s' }}>
              Digite sem o @ no início
            </div>
          </div>
        </div>
      </div>
      
      <div className="spacer-wrapper-description-main">
        <div className={`instagram-input-container ${inputFocused ? 'input-focused' : ''} ${elementsVisible ? 'input-fade-in' : 'input-hidden'}`} style={{ animationDelay: '0.7s' }}>
          <div className="instagram-input-wrapper">
            <span className="instagram-at-symbol">@</span>
            <input
              type="text"
              value={instagram}
              onChange={handleInstagramChange}
              onKeyDown={handleKeyPress}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              placeholder="seu_usuario_aqui"
              className="instagram-input input-enhanced"
              autoFocus
              maxLength={30}
            />
          </div>
          <div className="input-underline input-underline-enhanced"></div>
        </div>
      </div>
    </div>
  );
}

function MomentoContent({ elementsVisible, optionsVisible, selectedMoment, setSelectedMoment, momentOptions }: MomentoContentProps) {
  
  const handleMomentSelection = (optionId: string) => {
    setSelectedMoment(optionId);
    
    // Rastreia seleção de opção
    const selectedOption = momentOptions.find(opt => opt.id === optionId);
    sendGAEvent('option_selected_momento', {
      option_id: optionId,
      option_text: selectedOption?.text || optionId,
      question_name: 'momento_atual'
    });
  };

  return (
    <div>
      <div data-qa="question-header" className="header-wrapper-main">
        <div className="text-wrapper-main">
          <div className="title-container">
            <h1 className={`title-main-text ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.3s' }}>
              <span className={`question-number ${elementsVisible ? 'number-bounce' : ''}`} style={{ animationDelay: '0.1s' }}>5.</span>Qual o seu momento atual?*
            </h1>
            <div className={`title-secondary-text quiz-subtitle ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.5s' }}>
              Selecione a opção que melhor descreve sua situação
            </div>
          </div>
        </div>
      </div>
      
      <div className="spacer-wrapper-description-main">
        <div className="moment-options-container">
          {momentOptions.map((option: MomentOption, index: number) => (
            <button
              key={option.id}
              onClick={() => handleMomentSelection(option.id)}
              className={`
                moment-option-button 
                ${selectedMoment === option.id ? 'moment-option-selected' : ''}
                ${optionsVisible ? 'moment-option-visible' : 'moment-option-hidden'}
              `}
              style={{ 
                animationDelay: optionsVisible ? `${0.15 * index}s` : '0s',
                transitionDelay: optionsVisible ? `${0.1 * index}s` : '0s'
              }}
            >
              <div className="moment-option-letter">{option.id}</div>
              <div className="moment-option-text">{option.text}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function VendeuForaContent({ elementsVisible, optionsVisible, vendeuFora, setVendeuFora, vendeuForaOptions }: {
  elementsVisible: boolean;
  optionsVisible: boolean;
  vendeuFora: string;
  setVendeuFora: (value: string) => void;
  vendeuForaOptions: MomentOption[];
}) {

  const handleVendeuForaSelection = (optionId: string) => {
    setVendeuFora(optionId);
    
    // Rastreia seleção de opção
    const selectedOption = vendeuForaOptions.find(opt => opt.id === optionId);
    sendGAEvent('option_selected_vendeu_fora', {
      option_id: optionId,
      option_text: selectedOption?.text || optionId,
      question_name: 'vendeu_fora'
    });
  };

  return (
    <div>
      <div data-qa="question-header" className="header-wrapper-main">
        <div className="text-wrapper-main">
          <div className="title-container">
            <h1 className={`title-main-text ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.3s' }}>
              <span className={`question-number ${elementsVisible ? 'number-bounce' : ''}`} style={{ animationDelay: '0.1s' }}>6.</span>Você já vendeu para fora do Brasil?*
            </h1>
            <div className={`title-secondary-text quiz-subtitle ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.5s' }}>
              Selecione sua experiência com vendas internacionais
            </div>
          </div>
        </div>
      </div>
      
      <div className="spacer-wrapper-description-main">
        <div className="moment-options-container">
          {vendeuForaOptions.map((option: MomentOption, index: number) => (
            <button
              key={option.id}
              onClick={() => handleVendeuForaSelection(option.id)}
              className={`
                moment-option-button 
                ${vendeuFora === option.id ? 'moment-option-selected' : ''}
                ${optionsVisible ? 'moment-option-visible' : 'moment-option-hidden'}
              `}
              style={{ 
                animationDelay: optionsVisible ? `${0.15 * index}s` : '0s',
                transitionDelay: optionsVisible ? `${0.1 * index}s` : '0s'
              }}
            >
              <div className="moment-option-letter">{option.id}</div>
              <div className="moment-option-text">{option.text}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function FaturamentoContent({ elementsVisible, faturamento, setFaturamento, inputFocused, setInputFocused, handleKeyPress }: {
  elementsVisible: boolean;
  faturamento: string;
  setFaturamento: (value: string) => void;
  inputFocused: boolean;
  setInputFocused: (focused: boolean) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
}) {
  return (
    <div>
      <div data-qa="question-header" className="header-wrapper-main">
        <div className="text-wrapper-main">
          <div className="title-container">
            <h1 className={`title-main-text ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.3s' }}>
              <span className={`question-number ${elementsVisible ? 'number-bounce' : ''}`} style={{ animationDelay: '0.1s' }}>7.</span>Quanto você já faturou acumulado no mercado digital até agora?*
            </h1>
            <div className={`title-secondary-text quiz-subtitle ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.5s' }}>
              Digite o valor total que você já faturou (ex: R$ 50.000, R$ 120.000, etc.)
            </div>
          </div>
        </div>
      </div>
      
      <div className="spacer-wrapper-description-main">
        <div className={`input-container ${inputFocused ? 'input-focused' : ''} ${elementsVisible ? 'input-fade-in' : 'input-hidden'}`} style={{ animationDelay: '0.7s' }}>
          <input
            type="text"
            value={faturamento}
            onChange={(e) => setFaturamento(e.target.value)}
            onKeyDown={handleKeyPress}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            placeholder="R$ 0 (se ainda não faturou) ou R$ 50.000..."
            className="name-input input-enhanced"
            autoFocus
            maxLength={100}
          />
          <div className="input-underline input-underline-enhanced"></div>
        </div>
      </div>
    </div>
  );
}

function CaixaDisponivelContent({ elementsVisible, optionsVisible, caixaDisponivel, setCaixaDisponivel, caixaOptions }: {
  elementsVisible: boolean;
  optionsVisible: boolean;
  caixaDisponivel: string;
  setCaixaDisponivel: (value: string) => void;
  caixaOptions: MomentOption[];
}) {
  return (
    <div>
      <div data-qa="question-header" className="header-wrapper-main">
        <div className="text-wrapper-main">
          <div className="title-container">
            <h1 className={`title-main-text ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.3s' }}>
              <span className={`question-number ${elementsVisible ? 'number-bounce' : ''}`} style={{ animationDelay: '0.1s' }}>8.</span>Hoje, quanto você tem de caixa disponível para investir na escala de um negócio já validado e lucrativo no mercado global?*
            </h1>
            <div className={`title-secondary-text quiz-subtitle ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.5s' }}>
              Selecione a faixa de investimento que você tem disponível
            </div>
          </div>
        </div>
      </div>
      
      <div className="spacer-wrapper-description-main">
        <div className="moment-options-container">
          {caixaOptions.map((option: MomentOption, index: number) => (
            <button
              key={option.id}
              onClick={() => setCaixaDisponivel(option.id)}
              className={`
                moment-option-button 
                ${caixaDisponivel === option.id ? 'moment-option-selected' : ''}
                ${optionsVisible ? 'moment-option-visible' : 'moment-option-hidden'}
              `}
              style={{ 
                animationDelay: optionsVisible ? `${0.15 * index}s` : '0s',
                transitionDelay: optionsVisible ? `${0.1 * index}s` : '0s'
              }}
            >
              <div className="moment-option-letter">{option.id}</div>
              <div className="moment-option-text">{option.text}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProblemaPrincipalContent({ elementsVisible, optionsVisible, problemaPrincipal, setProblemaPrincipal, problemaOptions }: {
  elementsVisible: boolean;
  optionsVisible: boolean;
  problemaPrincipal: string;
  setProblemaPrincipal: (value: string) => void;
  problemaOptions: MomentOption[];
}) {
  return (
    <div>
      <div data-qa="question-header" className="header-wrapper-main">
        <div className="text-wrapper-main">
          <div className="title-container">
            <h1 className={`title-main-text ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.3s' }}>
              <span className={`question-number ${elementsVisible ? 'number-bounce' : ''}`} style={{ animationDelay: '0.1s' }}>9.</span>Hoje, qual é o principal problema ou dificuldade que você enfrenta em seu negócio digital atual?*
            </h1>
            <div className={`title-secondary-text quiz-subtitle ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.5s' }}>
              E que te motiva a buscar faturamento em moedas como (Dólar, Euro ou Libra)?
            </div>
          </div>
        </div>
      </div>
      
      <div className="spacer-wrapper-description-main">
        <div className="moment-options-container">
          {problemaOptions.map((option: MomentOption, index: number) => (
            <button
              key={option.id}
              onClick={() => setProblemaPrincipal(option.id)}
              className={`
                moment-option-button 
                ${problemaPrincipal === option.id ? 'moment-option-selected' : ''}
                ${optionsVisible ? 'moment-option-visible' : 'moment-option-hidden'}
              `}
              style={{ 
                animationDelay: optionsVisible ? `${0.15 * index}s` : '0s',
                transitionDelay: optionsVisible ? `${0.1 * index}s` : '0s'
              }}
            >
              <div className="moment-option-letter">{option.id}</div>
              <div className="moment-option-text">{option.text}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function AreaAjudaContent({ elementsVisible, optionsVisible, areaAjuda, setAreaAjuda, areaAjudaOptions }: {
  elementsVisible: boolean;
  optionsVisible: boolean;
  areaAjuda: string;
  setAreaAjuda: (value: string) => void;
  areaAjudaOptions: MomentOption[];
}) {
  return (
    <div>
      <div data-qa="question-header" className="header-wrapper-main">
        <div className="text-wrapper-main">
          <div className="title-container">
            <h1 className={`title-main-text ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.3s' }}>
              <span className={`question-number ${elementsVisible ? 'number-bounce' : ''}`} style={{ animationDelay: '0.1s' }}>10.</span>Em qual dessas áreas você sente que precisa de ajuda especializada hoje?*
            </h1>
            <div className={`title-secondary-text quiz-subtitle ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.5s' }}>
              Selecione a área onde você mais precisa de suporte
            </div>
          </div>
        </div>
      </div>
      
      <div className="spacer-wrapper-description-main">
        <div className="moment-options-container">
          {areaAjudaOptions.map((option: MomentOption, index: number) => (
            <button
              key={option.id}
              onClick={() => setAreaAjuda(option.id)}
              className={`
                moment-option-button 
                ${areaAjuda === option.id ? 'moment-option-selected' : ''}
                ${optionsVisible ? 'moment-option-visible' : 'moment-option-hidden'}
              `}
              style={{ 
                animationDelay: optionsVisible ? `${0.15 * index}s` : '0s',
                transitionDelay: optionsVisible ? `${0.1 * index}s` : '0s'
              }}
            >
              <div className="moment-option-letter">{option.id}</div>
              <div className="moment-option-text">{option.text}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SocioContent({ elementsVisible, optionsVisible, possuiSocio, setPossuiSocio, socioOptions }: {
  elementsVisible: boolean;
  optionsVisible: boolean;
  possuiSocio: string;
  setPossuiSocio: (value: string) => void;
  socioOptions: MomentOption[];
}) {
  return (
    <div>
      <div data-qa="question-header" className="header-wrapper-main">
        <div className="text-wrapper-main">
          <div className="title-container">
            <h1 className={`title-main-text ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.3s' }}>
              <span className={`question-number ${elementsVisible ? 'number-bounce' : ''}`} style={{ animationDelay: '0.1s' }}>11.</span>Você possui algum sócio ou parceiro que participa diretamente das decisões estratégicas?*
            </h1>
            <div className={`title-secondary-text quiz-subtitle ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.5s' }}>
              Queremos entender a estrutura do seu negócio
            </div>
          </div>
        </div>
      </div>
      
      <div className="spacer-wrapper-description-main">
        <div className="moment-options-container">
          {socioOptions.map((option: MomentOption, index: number) => (
            <button
              key={option.id}
              onClick={() => setPossuiSocio(option.id)}
              className={`
                moment-option-button 
                ${possuiSocio === option.id ? 'moment-option-selected' : ''}
                ${optionsVisible ? 'moment-option-visible' : 'moment-option-hidden'}
              `}
              style={{ 
                animationDelay: optionsVisible ? `${0.15 * index}s` : '0s',
                transitionDelay: optionsVisible ? `${0.1 * index}s` : '0s'
              }}
            >
              <div className="moment-option-letter">{option.id}</div>
              <div className="moment-option-text">{option.text}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PorQueEscolherContent({ elementsVisible, porQueEscolher, setPorQueEscolher, inputFocused, setInputFocused, handleKeyPress }: {
  elementsVisible: boolean;
  porQueEscolher: string;
  setPorQueEscolher: (value: string) => void;
  inputFocused: boolean;
  setInputFocused: (focused: boolean) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
}) {
  return (
    <div>
      <div data-qa="question-header" className="header-wrapper-main">
        <div className="text-wrapper-main">
          <div className="title-container">
            <h1 className={`title-main-text ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.3s' }}>
              <span className={`question-number ${elementsVisible ? 'number-bounce' : ''}`} style={{ animationDelay: '0.1s' }}>12.</span>Apenas 10 pessoas serão selecionadas para participar desta consultoria estratégica. Por que deveríamos escolher você?*
            </h1>
            <div className={`title-secondary-text quiz-subtitle ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.5s' }}>
              Conte-nos sobre seu comprometimento e motivação (mínimo 50 caracteres)
            </div>
          </div>
        </div>
      </div>
      
      <div className="spacer-wrapper-description-main">
        <div className="form-group-main">
          <textarea
            value={porQueEscolher}
            onChange={(e) => setPorQueEscolher(e.target.value)}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            onKeyDown={handleKeyPress}
            placeholder="Escreva sobre seu comprometimento, experiência e por que você deveria ser selecionado(a) para esta consultoria estratégica..."
            className="form-textarea-main"
            rows={6}
            maxLength={1000}
            autoFocus
          />
          <div className="character-count">
            {porQueEscolher.length}/1000 caracteres {porQueEscolher.length < 50 && `(mínimo 50)`}
          </div>
        </div>
      </div>
    </div>
  );
}

function CompromissoContent({ elementsVisible, optionsVisible, compromisso, setCompromisso, compromissoOptions }: {
  elementsVisible: boolean;
  optionsVisible: boolean;
  compromisso: string;
  setCompromisso: (value: string) => void;
  compromissoOptions: MomentOption[];
}) {
  return (
    <div>
      <div data-qa="question-header" className="header-wrapper-main">
        <div className="text-wrapper-main">
          <div className="title-container">
            <h1 className={`title-main-text ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.3s' }}>
              <span className={`question-number ${elementsVisible ? 'number-bounce' : ''}`} style={{ animationDelay: '0.1s' }}>13.</span>Caso você seja selecionado(a), você se compromete a comparecer no dia e horário agendado?*
            </h1>
            <div className={`title-secondary-text quiz-subtitle ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.5s' }}>
              Esta consultoria requer seu comprometimento total
            </div>
          </div>
        </div>
      </div>
      
      <div className="spacer-wrapper-description-main">
        <div className="moment-options-container">
          {compromissoOptions.map((option: MomentOption, index: number) => (
            <button
              key={option.id}
              onClick={() => setCompromisso(option.id)}
              className={`
                moment-option-button 
                ${compromisso === option.id ? 'moment-option-selected' : ''}
                ${optionsVisible ? 'moment-option-visible' : 'moment-option-hidden'}
              `}
              style={{ 
                animationDelay: optionsVisible ? `${0.15 * index}s` : '0s',
                transitionDelay: optionsVisible ? `${0.1 * index}s` : '0s'
              }}
            >
              <div className="moment-option-letter">{option.id}</div>
              <div className="moment-option-text">{option.text}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function FinishedContent({ 
  elementsVisible, 
  submitStatus = 'idle', 
  isSubmitting = false 
}: { 
  elementsVisible: boolean;
  submitStatus?: 'idle' | 'success' | 'error' | 'partial';
  isSubmitting?: boolean;
}) {
  const getStatusMessage = () => {
    if (isSubmitting) {
      return {
        title: "Enviando... ⏳",
        subtitle: "Aguarde, estamos salvando suas respostas..."
      };
    }

    switch (submitStatus) {
      case 'success':
        return {
          title: "Obrigado! 🎉",
          subtitle: "Suas respostas foram enviadas com sucesso para nossa planilha. Entraremos em contato em breve!"
        };
      case 'partial':
        return {
          title: "Quase lá! 📱",
          subtitle: "Suas respostas foram salvas localmente. Tentaremos enviar novamente em breve!"
        };
      case 'error':
        return {
          title: "Ops! 😅",
          subtitle: "Houve um problema, mas suas respostas estão salvas. Nossa equipe foi notificada!"
        };
      default:
        return {
          title: "Obrigado! 🎉",
          subtitle: "Suas respostas foram enviadas com sucesso. Entraremos em contato em breve!"
        };
    }
  };

  const { title, subtitle } = getStatusMessage();

  return (
    <div>
      <div data-qa="question-header" className="header-wrapper-main">
        <div className="text-wrapper-main">
          <div className="title-container">
            <h1 className={`title-main-text ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.3s' }}>
              {title}
            </h1>
            <div className={`title-secondary-text ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.5s' }}>
              {subtitle}
            </div>
            
            
            {submitStatus === 'partial' && (
              <div className={`text-center mt-6 ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.7s' }}>
                <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
                  📱 Dados salvos localmente
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
