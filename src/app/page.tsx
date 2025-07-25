'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { useUtmTracking } from './hooks/useUtmTracking';

// Configuração do Google Analytics
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: Record<string, unknown>) => void;
    nameInputTimeout?: NodeJS.Timeout;
    phoneInputTimeout?: NodeJS.Timeout;
    emailInputTimeout?: NodeJS.Timeout;
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

type QuizStep = 'name' | 'whatsapp' | 'email' | 'instagram' | 'momento' | 'vendeu_fora' | 'faturamento' | 'caixa_disponivel' | 'problema_principal' | 'area_ajuda' | 'socio' | 'por_que_escolher' | 'compromisso' | 'finished';

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
  inputFocused: boolean;
  setInputFocused: (focused: boolean) => void;
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
  const [currentStep, setCurrentStep] = useState<QuizStep>('name');
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
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'partial'>('idle');

  // Estados de validação com códigos HTTP-like
  const [validationState, setValidationState] = useState<{
    [key in QuizStep]?: {
      status: 200 | 400 | 422; // 200: OK, 400: Bad Request, 422: Unprocessable Entity
      message?: string;
      required: boolean;
    }
  }>({
    name: { status: 400, message: 'Nome completo é obrigatório', required: true },
    whatsapp: { status: 400, message: 'Telefone válido é obrigatório', required: true },
    email: { status: 400, message: 'Email válido é obrigatório', required: true },
    instagram: { status: 400, message: 'Instagram é obrigatório', required: true },
    momento: { status: 422, message: 'Selecione uma opção', required: true },
    vendeu_fora: { status: 422, message: 'Selecione uma opção', required: true },
    faturamento: { status: 400, message: 'Faturamento é obrigatório', required: true },
    caixa_disponivel: { status: 422, message: 'Selecione uma opção', required: true },
    problema_principal: { status: 422, message: 'Selecione uma opção', required: true },
    area_ajuda: { status: 422, message: 'Selecione uma opção', required: true },
    socio: { status: 422, message: 'Selecione uma opção', required: true },
    por_que_escolher: { status: 400, message: 'Mínimo 10 caracteres', required: true },
    compromisso: { status: 422, message: 'Selecione uma opção', required: true },
    finished: { status: 200, required: false }
  });

  // Configuração para análise da IA
  const [analysisStage, setAnalysisStage] = useState<'initial' | 'analyzing' | 'complete'>('initial');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisText, setAnalysisText] = useState('Iniciando análise...');

  // Apps Script URL - ATUALIZE COM A NOVA URL DO SEU DEPLOYMENT
  // Depois de criar o novo Apps Script, substitua a URL abaixo:
  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwCFQ7ZIitepAbGGANoZTgUTOI_Ua5MkZsy8qSlaMw9Gb_cXsCGKpgriYmsIWW7iiaH/exec';
  const N8N_WEBHOOK_URL = 'https://n8n.landcriativa.com/webhook/84909c05-c376-4ebe-a630-7ef428ff1826';

  // Hook para rastreamento UTM e Meta Pixel
  const { trackLead } = useUtmTracking();

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
      phone: '+55' + phone, // Adiciona código do país brasileiro
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
      step_number: getStepNumber(step),
      event_type: 'step_progress'
    });
    
    // Também envia pageview
    sendGAPageView(`Pergunta ${getStepNumber(step)} - ${step}`);
  };

  // Função para obter número da etapa
  const getStepNumber = (step: QuizStep): number => {
    const stepNumbers: Record<QuizStep, number> = {
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
          
          // 🎯 ENVIAR EVENTO DE LEAD MESMO COM FALHA NO ENVIO (dados salvos localmente)
          // trackLead({
          //   content_name: 'Quiz PiscaForm Completo (Falha no Envio)',
          //   content_category: 'Lead Generation',
          //   currency: 'BRL',
          //   value: 0.5, // Valor menor por falha no envio
          //   lead_type: 'quiz_completion_failed_submission',
          //   form_name: 'PiscaForm - Quiz Interativo',
          //   user_name: formData.name,
          //   user_email: formData.email,
          //   user_phone: formData.phone,
          //   user_instagram: formData.instagram,
          //   business_revenue: formData.faturamento,
          //   business_moment: formData.moment,
          //   main_problem: formData.problemaPrincipal,
          //   help_area: formData.areaAjuda,
          //   has_partner: formData.possuiSocio,
          //   completion_timestamp: formData.submittedAt,
          //   submission_status: 'failed'
          // });
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
    const steps = ['name', 'whatsapp', 'email', 'instagram', 'momento', 'vendeu_fora', 'faturamento', 'caixa_disponivel', 'problema_principal', 'area_ajuda', 'socio', 'por_que_escolher', 'compromisso', 'finished'];
    const currentIndex = steps.indexOf(step);
    return Math.round((currentIndex / (steps.length - 1)) * 100);
  };

  // Função para limpar todos os timers
  const clearAllTimers = () => {
    animationTimers.current.forEach((timer: NodeJS.Timeout) => clearTimeout(timer));
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
        
        // Para o telefone, remove o código do país se estiver presente
        if (formData.phone) {
          const phoneMatch = formData.phone.match(/^(\+55)?(.+)$/);
          if (phoneMatch) {
            setPhone(phoneMatch[2]); // Pega apenas os dígitos sem o código do país
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
      
      // Limpa timeouts de input para evitar vazamentos de memória
      if (typeof window !== 'undefined') {
        clearTimeout(window.nameInputTimeout);
        clearTimeout(window.phoneInputTimeout);
        clearTimeout(window.emailInputTimeout);
      }
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
    
    // Animação de saída apenas do conteúdo
    setContentVisible(false);
    setOptionsVisible(false);
    
    setTimeout(() => {
      let newStep: QuizStep;
      
      switch (currentStep) {
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
          newStep = 'name';
      }
      
      console.log('✅ Transicionando para:', newStep);
      setCurrentStep(newStep);
      
      // Permite novas transições e inicia animações de entrada
      setTimeout(() => {
        isTransitioning.current = false;
        console.log('🎯 Transição concluída, liberando controle');
        
        // Chama animação de entrada para o novo step
          initiateStepAnimation(newStep);
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
          newStep = 'name';
      }
      
      setCurrentStep(newStep);
      
      // Permite novas transições e inicia animações de entrada
      setTimeout(() => {
        isTransitioning.current = false;
        // Chama animação de entrada para o novo step
          initiateStepAnimation(newStep);
      }, 200);
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleContinue();
    }
  };

  // Função simples para validar step atual
  const isCurrentStepValid = useCallback((): boolean => {
    switch (currentStep) {
      case 'name':
        return name.trim().length >= 2 && 
               /^[a-zA-ZÀ-ÿ\s\-']+$/.test(name.trim()) &&
               name.trim().split(/\s+/).length >= 2 &&
               name.trim().split(/\s+/).every((part: string) => part.length >= 2);

      case 'whatsapp': {
        const phoneClean = phone.replace(/[\s\(\)\-]/g, '');
        // Validação para números brasileiros
        if (phoneClean.length < 8 || phoneClean.length > 11 || !/^\d+$/.test(phoneClean)) return false;
        
        if (phoneClean.length === 8) {
          return /^[2-5]/.test(phoneClean) && !/^(\d)\1+$/.test(phoneClean);
        } else if (phoneClean.length === 9) {
          return phoneClean.startsWith('9') && !/^(\d)\1+$/.test(phoneClean);
        } else if (phoneClean.length === 10) {
          const validDDDs = ['11', '12', '13', '14', '15', '16', '17', '18', '19', '21', '22', '24', '27', '28', '31', '32', '33', '34', '35', '37', '38', '41', '42', '43', '44', '45', '46', '47', '48', '49', '51', '53', '54', '55', '61', '62', '63', '64', '65', '66', '67', '68', '69', '71', '73', '74', '75', '77', '79', '81', '82', '83', '84', '85', '86', '87', '88', '89', '91', '92', '93', '94', '95', '96', '97', '98', '99'];
          const ddd = phoneClean.substring(0, 2);
          const numero = phoneClean.substring(2);
          return validDDDs.includes(ddd) && /^[2-5]/.test(numero) && !/^(\d)\1+$/.test(phoneClean);
        } else if (phoneClean.length === 11) {
          const validDDDs = ['11', '12', '13', '14', '15', '16', '17', '18', '19', '21', '22', '24', '27', '28', '31', '32', '33', '34', '35', '37', '38', '41', '42', '43', '44', '45', '46', '47', '48', '49', '51', '53', '54', '55', '61', '62', '63', '64', '65', '66', '67', '68', '69', '71', '73', '74', '75', '77', '79', '81', '82', '83', '84', '85', '86', '87', '88', '89', '91', '92', '93', '94', '95', '96', '97', '98', '99'];
          const ddd = phoneClean.substring(0, 2);
          const nono = phoneClean[2];
          return validDDDs.includes(ddd) && nono === '9' && !/^(\d)\1+$/.test(phoneClean);
        }
        return false;
      }

      case 'email':
        return email.trim().length > 0 && 
               /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
               email.trim().split('@')[0].length >= 3 &&
               email.trim().split('@')[1].split('.')[0].length >= 2 &&
               (email.trim().split('@')[1].split('.').pop()?.length || 0) >= 2;

      case 'instagram':
        return instagram.trim().length > 0;

      case 'momento':
        return selectedMoment.trim().length > 0;

      case 'vendeu_fora':
        return vendeuFora.trim().length > 0;

      case 'faturamento':
        return faturamento.trim().length > 0;

      case 'caixa_disponivel':
        return caixaDisponivel.trim().length > 0;

      case 'problema_principal':
        return problemaPrincipal.trim().length > 0;

      case 'area_ajuda':
        return areaAjuda.trim().length > 0;

      case 'socio':
        return possuiSocio.trim().length > 0;

      case 'por_que_escolher':
        return porQueEscolher.trim().length >= 10;

      case 'compromisso':
        return compromisso.trim().length > 0;

      default:
        return true;
    }
  }, [currentStep, name, phone, email, instagram, selectedMoment, vendeuFora, faturamento, caixaDisponivel, problemaPrincipal, areaAjuda, possuiSocio, porQueEscolher, compromisso]);

  // Função para atualizar estado de validação
  const updateValidationState = useCallback((step: QuizStep, status: 200 | 400 | 422, message?: string) => {
    setValidationState((prev: { [key in QuizStep]?: { status: 200 | 400 | 422; message?: string; required: boolean; } }) => ({
      ...prev,
      [step]: {
        ...prev[step],
        status,
        message
      }
    }));
  }, []);

  // Effect para monitorar mudanças e atualizar validação em tempo real
  useEffect(() => {
    const validation = isCurrentStepValid();
    const newStatus = validation ? 200 : (validation ? 400 : 422);
    
    updateValidationState(currentStep, newStatus, validation ? undefined : 'Dados inválidos');
    
    // Log para debug
    console.log(`🔍 Validação ${currentStep}:`, {
      status: newStatus,
      isValid: validation,
      message: validation ? undefined : 'Dados inválidos'
    });
  }, [currentStep, name, phone, email, instagram, selectedMoment, vendeuFora, faturamento, caixaDisponivel, problemaPrincipal, areaAjuda, possuiSocio, porQueEscolher, compromisso, isCurrentStepValid, updateValidationState]);

  const handleContinue = () => {
    // Previne múltiplas execuções - proteção melhorada
    if (isTransitioning.current || isSubmitting) {
      console.log('⚠️ Ação já em andamento, aguarde...');
      return;
    }

    // Validação simples para cada step
    let canProceed = false;
    let errorMessage = '';

    switch (currentStep) {
      case 'name':
        const nameValid = name.trim().length >= 2 && 
                         /^[a-zA-ZÀ-ÿ\s\-']+$/.test(name.trim()) &&
                         name.trim().split(/\s+/).length >= 2 &&
                         name.trim().split(/\s+/).every((part: string) => part.length >= 2);
        canProceed = nameValid;
        errorMessage = nameValid ? '' : 'Digite seu nome completo (nome e sobrenome)';
        break;

      case 'whatsapp':
        const phoneClean = phone.replace(/[\s\(\)\-]/g, '');
        let phoneValid = false;
        
        // Validação para números brasileiros
        if (phoneClean.length >= 8 && phoneClean.length <= 11 && /^\d+$/.test(phoneClean)) {
          if (phoneClean.length === 8) {
            phoneValid = /^[2-5]/.test(phoneClean) && !/^(\d)\1+$/.test(phoneClean);
          } else if (phoneClean.length === 9) {
            phoneValid = phoneClean.startsWith('9') && !/^(\d)\1+$/.test(phoneClean);
          } else if (phoneClean.length === 10) {
            const validDDDs = ['11', '12', '13', '14', '15', '16', '17', '18', '19', '21', '22', '24', '27', '28', '31', '32', '33', '34', '35', '37', '38', '41', '42', '43', '44', '45', '46', '47', '48', '49', '51', '53', '54', '55', '61', '62', '63', '64', '65', '66', '67', '68', '69', '71', '73', '74', '75', '77', '79', '81', '82', '83', '84', '85', '86', '87', '88', '89', '91', '92', '93', '94', '95', '96', '97', '98', '99'];
            const ddd = phoneClean.substring(0, 2);
            const numero = phoneClean.substring(2);
            phoneValid = validDDDs.includes(ddd) && /^[2-5]/.test(numero) && !/^(\d)\1+$/.test(phoneClean);
          } else if (phoneClean.length === 11) {
            const validDDDs = ['11', '12', '13', '14', '15', '16', '17', '18', '19', '21', '22', '24', '27', '28', '31', '32', '33', '34', '35', '37', '38', '41', '42', '43', '44', '45', '46', '47', '48', '49', '51', '53', '54', '55', '61', '62', '63', '64', '65', '66', '67', '68', '69', '71', '73', '74', '75', '77', '79', '81', '82', '83', '84', '85', '86', '87', '88', '89', '91', '92', '93', '94', '95', '96', '97', '98', '99'];
            const ddd = phoneClean.substring(0, 2);
            const nono = phoneClean[2];
            phoneValid = validDDDs.includes(ddd) && nono === '9' && !/^(\d)\1+$/.test(phoneClean);
          }
        }
        canProceed = phoneValid;
        errorMessage = phoneValid ? '' : 'Digite um número de telefone válido';
        break;

      case 'email':
        const emailValid = email.trim().length > 0 && 
                          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
                          email.trim().split('@')[0].length >= 3 &&
                          email.trim().split('@')[1].split('.')[0].length >= 2 &&
                          (email.trim().split('@')[1].split('.').pop()?.length || 0) >= 2;
        canProceed = emailValid;
        errorMessage = emailValid ? '' : 'Digite um email válido';
        break;

      case 'instagram':
        canProceed = instagram.trim().length > 0;
        errorMessage = canProceed ? '' : 'Digite seu Instagram';
        break;

      case 'momento':
        canProceed = selectedMoment.trim().length > 0;
        errorMessage = canProceed ? '' : 'Selecione uma opção';
        break;

      case 'vendeu_fora':
        canProceed = vendeuFora.trim().length > 0;
        errorMessage = canProceed ? '' : 'Selecione uma opção';
        break;

      case 'faturamento':
        canProceed = faturamento.trim().length > 0;
        errorMessage = canProceed ? '' : 'Digite seu faturamento';
        break;

      case 'caixa_disponivel':
        canProceed = caixaDisponivel.trim().length > 0;
        errorMessage = canProceed ? '' : 'Selecione uma opção';
        break;

      case 'problema_principal':
        canProceed = problemaPrincipal.trim().length > 0;
        errorMessage = canProceed ? '' : 'Selecione uma opção';
        break;

      case 'area_ajuda':
        canProceed = areaAjuda.trim().length > 0;
        errorMessage = canProceed ? '' : 'Selecione uma opção';
        break;

      case 'socio':
        canProceed = possuiSocio.trim().length > 0;
        errorMessage = canProceed ? '' : 'Selecione uma opção';
        break;

      case 'por_que_escolher':
        canProceed = porQueEscolher.trim().length >= 10;
        errorMessage = canProceed ? '' : 'Escreva pelo menos 10 caracteres';
        break;

      case 'compromisso':
        canProceed = compromisso.trim().length > 0;
        errorMessage = canProceed ? '' : 'Selecione uma opção';
        break;

      default:
        canProceed = true;
    }

    // Se validação falhar, mostra erro e bloqueia
    if (!canProceed) {
      console.log(`🚫 Validação falhou: ${errorMessage}`);
      alert(`❌ ${errorMessage}`);
      return;
    }

    // Rastreia clique no botão continuar APENAS quando válido
    sendGAEvent('button_continue_clicked', {
      current_step: currentStep,
      step_number: getStepNumber(currentStep),
      progress_percentage: getProgressForStep(currentStep)
    });

    // Caso especial para compromisso (vai para finishQuiz)
    if (currentStep === 'compromisso') {
      sendGAEvent('field_validation_passed', {
        field_name: 'compromisso',
        selected_option: compromisso
      });
      finishQuiz();
      return;
    }

    // Para outros steps, continua normalmente
    sendGAEvent('field_validation_passed', {
      field_name: currentStep,
      step_number: getStepNumber(currentStep)
    });
    
    nextStep();
  };

  const getButtonText = () => {
    switch (currentStep) {
      case 'finished':
        return 'Finalizar';
      default:
        return 'OK';
    }
  };

  const isButtonDisabled = useMemo(() => {
    // Se está enviando, desabilita o botão
    if (isSubmitting) return true;
    
    // Validação simples para desabilitar botão
    switch (currentStep) {
      case 'name':
        return !(name.trim().length >= 2 && 
                /^[a-zA-ZÀ-ÿ\s\-']+$/.test(name.trim()) &&
                name.trim().split(/\s+/).length >= 2 &&
                name.trim().split(/\s+/).every((part: string) => part.length >= 2));

      case 'whatsapp': {
        const phoneClean = phone.replace(/[\s\(\)\-]/g, '');
        // Validação para números brasileiros
        if (phoneClean.length < 8 || phoneClean.length > 11 || !/^\d+$/.test(phoneClean)) return true;
        
        if (phoneClean.length === 8) {
          return !(/^[2-5]/.test(phoneClean) && !/^(\d)\1+$/.test(phoneClean));
        } else if (phoneClean.length === 9) {
          return !(phoneClean.startsWith('9') && !/^(\d)\1+$/.test(phoneClean));
        } else if (phoneClean.length === 10) {
          const validDDDs = ['11', '12', '13', '14', '15', '16', '17', '18', '19', '21', '22', '24', '27', '28', '31', '32', '33', '34', '35', '37', '38', '41', '42', '43', '44', '45', '46', '47', '48', '49', '51', '53', '54', '55', '61', '62', '63', '64', '65', '66', '67', '68', '69', '71', '73', '74', '75', '77', '79', '81', '82', '83', '84', '85', '86', '87', '88', '89', '91', '92', '93', '94', '95', '96', '97', '98', '99'];
            const ddd = phoneClean.substring(0, 2);
            const numero = phoneClean.substring(2);
            return !(validDDDs.includes(ddd) && /^[2-5]/.test(numero) && !/^(\d)\1+$/.test(phoneClean));
          } else if (phoneClean.length === 11) {
            const validDDDs = ['11', '12', '13', '14', '15', '16', '17', '18', '19', '21', '22', '24', '27', '28', '31', '32', '33', '34', '35', '37', '38', '41', '42', '43', '44', '45', '46', '47', '48', '49', '51', '53', '54', '55', '61', '62', '63', '64', '65', '66', '67', '68', '69', '71', '73', '74', '75', '77', '79', '81', '82', '83', '84', '85', '86', '87', '88', '89', '91', '92', '93', '94', '95', '96', '97', '98', '99'];
            const ddd = phoneClean.substring(0, 2);
            const nono = phoneClean[2];
            return !(validDDDs.includes(ddd) && nono === '9' && !/^(\d)\1+$/.test(phoneClean));
          }
        return true;
      }

      case 'email':
        return !(email.trim().length > 0 && 
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
                email.trim().split('@')[0].length >= 3 &&
                email.trim().split('@')[1].split('.')[0].length >= 2 &&
                (email.trim().split('@')[1].split('.').pop()?.length || 0) >= 2);

      case 'instagram':
        return !instagram.trim();

      case 'momento':
        return !selectedMoment.trim();

      case 'vendeu_fora':
        return !vendeuFora.trim();

      case 'faturamento':
        return !faturamento.trim();

      case 'caixa_disponivel':
        return !caixaDisponivel.trim();

      case 'problema_principal':
        return !problemaPrincipal.trim();

      case 'area_ajuda':
        return !areaAjuda.trim();

      case 'socio':
        return !possuiSocio.trim();

      case 'por_que_escolher':
        return porQueEscolher.trim().length < 10;

      case 'compromisso':
        return !compromisso.trim();

      default:
        return false;
    }
  }, [currentStep, isSubmitting, name, phone, email, instagram, selectedMoment, vendeuFora, faturamento, caixaDisponivel, problemaPrincipal, areaAjuda, possuiSocio, porQueEscolher, compromisso]);

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
        <header className={`absolute mb-25 top-4 left-4 z-50 ${elementsVisible ? 'element-fade-in' : 'element-hidden'}`} style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center">
            <Image src="/lgSemFundo.png" alt="Logo" width={65} height={65} priority />
          </div>
        </header>

        {/* Content Wrapper */}
        <div className={`content-wrapper-main ${elementsVisible ? 'content-slide-up' : 'content-hidden'}`}>
          <div className="root-container-main">
            <div className="spacer-container-main">
              <div data-qa="question-wrapper" className="question-wrapper-main">
                
                {/* Conteúdo dinâmico baseado no step atual */}
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
                    inputFocused={inputFocused}
                    setInputFocused={setInputFocused}
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
        {/* Esconde o botão durante a análise da IA */}
        {!(currentStep === 'finished' && ((submitStatus === 'success' || submitStatus === 'partial') && !isSubmitting)) && (
        <div className="footer-wrapperstyles__FooterWrapper-sc-12dpj1x-0 jGEmmb">
          <div data-qa="persistent-footer" className="persistent-footercomponent__PersistentFooterWrapper-sc-171bwtp-0 jTdQsH">
            <div color="#000000" className="persistent-footercomponent__TransparentBackground-sc-171bwtp-1 cgqYMs"></div>
            <div className="AnimateStyled-sc-__sc-nw4u3g-0 jPHXjX" data-qa="animate">
              <div className="persistent-footercomponent__ButtonsWrapper-sc-171bwtp-3 bYGfZr">
                <button 
                  data-qa="ok-button-visible-deep-purple-ok-button-visible" 
                    className={`ButtonWrapper-sc-__sc-1qu8p4z-0 eTknZ ${isButtonPressed ? 'button-pressed' : ''} ${isButtonDisabled ? 'button-disabled' : ''}`}
                  onClick={handleContinue}
                  onKeyDown={handleKeyPress}
                    onMouseDown={() => !isButtonDisabled && setIsButtonPressed(true)}
                  onMouseUp={() => setIsButtonPressed(false)}
                  onMouseLeave={() => setIsButtonPressed(false)}
                    disabled={isButtonDisabled}
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
        )}
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

function NameContent({ elementsVisible, name, setName, inputFocused, setInputFocused, handleKeyPress }: NameContentProps) {
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
      clearTimeout(window.nameInputTimeout);
      window.nameInputTimeout = setTimeout(() => {
        sendGAEvent('field_filled_name', {
          field_name: 'name',
          character_count: value.length,
          is_valid: true
        });
      }, 1000); // Envia evento apenas 1 segundo após parar de digitar
    }
  }, [setName, validateName]);

  const handleNameFocus = useCallback(() => {
    setInputFocused(true);
    sendGAEvent('field_focused_name', {
      field_name: 'name'
    });
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
              <span className={`question-number ${elementsVisible ? 'number-bounce' : ''}`} style={{ animationDelay: '0.1s' }}>1.</span>Qual é o seu nome completo?*
            </h1>
            <div className={`title-secondary-text quiz-subtitle ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.5s' }}>
              Digite seu nome e sobrenome (obrigatório para continuar)
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
            onBlur={handleNameBlur}
            onKeyDown={handleKeyPress}
            placeholder="Digite seu nome completo (ex: João Silva)"
            className={`form-input-main ${nameError && showError ? 'input-error' : isNameValid ? 'input-success' : ''}`}
            autoFocus
            maxLength={100}
            required
          />
          {nameError && showError && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {nameError}
            </div>
          )}
          {isNameValid && (
            <div className="success-message">
              <span className="success-icon">✅</span>
              Nome válido!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function WhatsAppContent({ elementsVisible, name, phone, setPhone, inputFocused, setInputFocused, handleKeyPress }: WhatsAppContentProps) {
  const [phoneError, setPhoneError] = useState('');
  const [showError, setShowError] = useState(false);
  
  // Código do país fixo para Brasil
  const countryCode = '+55';

  const validatePhone = useCallback((value: string) => {
    if (!value.trim()) {
      setPhoneError('Telefone é obrigatório para continuar');
      return false;
    }
    
    const phoneClean = value.replace(/[\s\(\)\-]/g, '');
    
    // Validação específica para Brasil
    if (!/^\d{8,11}$/.test(phoneClean)) {
      setPhoneError('Telefone brasileiro deve ter 8 a 11 dígitos (ex: 31982354127 ou 1133334444)');
      return false;
    }
    
    // Se tem 11 dígitos, verifica se é celular (deve começar com 9 após o DDD)
    if (phoneClean.length === 11 && phoneClean[2] !== '9') {
      setPhoneError('Celular de 11 dígitos deve começar com 9 após o DDD (ex: 31982354127)');
      return false;
    }
    
    // Se tem 10 ou 11 dígitos, verifica DDDs válidos
    if (phoneClean.length >= 10) {
      const validDDDs = ['11', '12', '13', '14', '15', '16', '17', '18', '19', '21', '22', '24', '27', '28', '31', '32', '33', '34', '35', '37', '38', '41', '42', '43', '44', '45', '46', '47', '48', '49', '51', '53', '54', '55', '61', '62', '63', '64', '65', '66', '67', '68', '69', '71', '73', '74', '75', '77', '79', '81', '82', '83', '84', '85', '86', '87', '88', '89', '91', '92', '93', '94', '95', '96', '97', '98', '99'];
      const ddd = phoneClean.substring(0, 2);
      if (!validDDDs.includes(ddd)) {
        setPhoneError('DDD inválido para Brasil');
        return false;
      }
    }
    
    // Verifica se não são todos os mesmos dígitos
    if (/^(\d)\1+$/.test(phoneClean)) {
      setPhoneError('Digite um número de telefone válido');
      return false;
    }
    
    setPhoneError('');
    return true;
  }, []);

  const formatPhoneDisplay = useCallback((value: string) => {
    const phoneClean = value.replace(/[\s\(\)\-]/g, '');
    
    // Formatação brasileira
    if (phoneClean.length === 8) {
      // Telefone fixo sem DDD: 3333-4444
      return phoneClean.replace(/(\d{4})(\d{4})/, '$1-$2');
    } else if (phoneClean.length === 9) {
      // Celular sem DDD: 98235-4127
      return phoneClean.replace(/(\d{5})(\d{4})/, '$1-$2');
    } else if (phoneClean.length === 10) {
      // Telefone fixo com DDD: (31) 3333-4444
      return phoneClean.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (phoneClean.length === 11) {
      // Celular com DDD: (31) 98235-4127
      return phoneClean.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (phoneClean.length > 0) {
      // Formatação progressiva
      if (phoneClean.length <= 4) {
        return phoneClean;
      } else if (phoneClean.length <= 8) {
        return phoneClean.replace(/(\d{4})(\d{0,4})/, '$1-$2').replace(/-$/, '');
      } else if (phoneClean.length <= 10) {
        return phoneClean.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
      } else {
        return phoneClean.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
      }
    }
    
    return value;
  }, []);

  const isPhoneValid = useMemo(() => {
    if (!phone.trim()) return false;
    
    const phoneClean = phone.replace(/[\s\(\)\-]/g, '');
    
    // Validação brasileira rigorosa
    if (phoneClean.length < 8 || phoneClean.length > 11) return false;
    if (!/^\d+$/.test(phoneClean)) return false;
    
    if (phoneClean.length === 8) {
      // Telefone fixo sem DDD: deve começar com 2, 3, 4 ou 5
      if (!/^[2-5]/.test(phoneClean)) return false;
    } else if (phoneClean.length === 9) {
      // Celular sem DDD: deve começar com 9
      if (!phoneClean.startsWith('9')) return false;
    } else if (phoneClean.length === 10) {
      // Telefone fixo com DDD
      const validDDDs = ['11', '12', '13', '14', '15', '16', '17', '18', '19', '21', '22', '24', '27', '28', '31', '32', '33', '34', '35', '37', '38', '41', '42', '43', '44', '45', '46', '47', '48', '49', '51', '53', '54', '55', '61', '62', '63', '64', '65', '66', '67', '68', '69', '71', '73', '74', '75', '77', '79', '81', '82', '83', '84', '85', '86', '87', '88', '89', '91', '92', '93', '94', '95', '96', '97', '98', '99'];
      const ddd = phoneClean.substring(0, 2);
      const numero = phoneClean.substring(2);
      if (!validDDDs.includes(ddd)) return false;
      if (!/^[2-5]/.test(numero)) return false;
    } else if (phoneClean.length === 11) {
      // Celular com DDD
      const validDDDs = ['11', '12', '13', '14', '15', '16', '17', '18', '19', '21', '22', '24', '27', '28', '31', '32', '33', '34', '35', '37', '38', '41', '42', '43', '44', '45', '46', '47', '48', '49', '51', '53', '54', '55', '61', '62', '63', '64', '65', '66', '67', '68', '69', '71', '73', '74', '75', '77', '79', '81', '82', '83', '84', '85', '86', '87', '88', '89', '91', '92', '93', '94', '95', '96', '97', '98', '99'];
      const ddd = phoneClean.substring(0, 2);
      const nono = phoneClean[2];
      if (!validDDDs.includes(ddd)) return false;
      if (nono !== '9') return false;
    }
    
    // Verifica se não são todos os mesmos dígitos
    if (/^(\d)\1+$/.test(phoneClean)) return false;
    
    return true;
  }, [phone]);

  const displayPhone = useMemo(() => {
    return formatPhoneDisplay(phone);
  }, [phone, formatPhoneDisplay]);

  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d\s\-\(\)]/g, '');
    
    // Remove formatação para armazenar apenas números
    const cleanValue = value.replace(/[\s\(\)\-]/g, '');
    setPhone(cleanValue);
    setShowError(false); // Remove erro enquanto está digitando
    
    // Valida em tempo real após 8 dígitos
    if (cleanValue.length >= 8) {
      validatePhone(cleanValue);
    } else if (cleanValue.length === 0) {
      setPhoneError('Telefone é obrigatório para continuar');
    }
    
    // Rastreia evento de preenchimento do telefone apenas se válido
    if (cleanValue.length >= 8 && validatePhone(cleanValue)) {
      // Debounce para evitar spam de eventos
      clearTimeout(window.phoneInputTimeout);
      window.phoneInputTimeout = setTimeout(() => {
        sendGAEvent('field_filled_phone', {
          field_name: 'phone',
          character_count: cleanValue.length,
          country_code: countryCode,
          is_valid: true
        });
      }, 1000); // Envia evento apenas 1 segundo após parar de digitar
    }
  }, [setPhone, validatePhone, countryCode]);

  const handlePhoneFocus = useCallback(() => {
    setInputFocused(true);
    sendGAEvent('field_focused_phone', {
      field_name: 'phone'
    });
  }, [setInputFocused]);

  const handlePhoneBlur = useCallback(() => {
    setInputFocused(false);
    setShowError(true); // Mostra erro quando sai do campo
    validatePhone(phone);
  }, [setInputFocused, validatePhone, phone]);

  return (
    <div>
      <div data-qa="question-header" className="header-wrapper-main">
        <div className="text-wrapper-main">
          <div className="title-container">
            <h1 className={`title-main-text ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.3s' }}>
              <span className={`question-number ${elementsVisible ? 'number-bounce' : ''}`} style={{ animationDelay: '0.1s' }}>2.</span>Prazer, {name || 'Pedro'}! Qual é o seu número de WhatsApp?*
            </h1>
            <div className={`title-secondary-text quiz-subtitle ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.5s' }}>
              Digite um número válido para contato (obrigatório)
            </div>
          </div>
        </div>
      </div>
      
      <div className="spacer-wrapper-description-main">
        <div className={`phone-input-container ${inputFocused ? 'input-focused' : ''} ${elementsVisible ? 'input-fade-in' : 'input-hidden'} ${phoneError && showError ? 'input-error' : isPhoneValid ? 'input-success' : ''}`} style={{ animationDelay: '0.7s' }}>
          <input
            type="tel"
            value={displayPhone}
            onChange={handlePhoneChange}
            onKeyDown={handleKeyPress}
            onFocus={handlePhoneFocus}
            onBlur={handlePhoneBlur}
            placeholder="(11) 99999-9999"
            className="phone-input input-enhanced"
            autoFocus
            maxLength={15}
            required
          />
          <div className="input-underline input-underline-enhanced"></div>
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
  const [showError, setShowError] = useState(false);

  const validateEmail = useCallback((value: string) => {
    if (!value.trim()) {
      setEmailError('Email é obrigatório para continuar');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value.trim())) {
      setEmailError('Digite um email válido (ex: usuario@dominio.com)');
      return false;
    }
    
    // Validações adicionais
    const emailLower = value.trim().toLowerCase();
    
    // Verifica se tem pelo menos 3 caracteres antes do @
    const beforeAt = emailLower.split('@')[0];
    if (beforeAt.length < 3) {
      setEmailError('Email deve ter pelo menos 3 caracteres antes do @');
      return false;
    }
    
    // Verifica se o domínio tem pelo menos 2 caracteres
    const domain = emailLower.split('@')[1];
    if (domain && domain.split('.')[0].length < 2) {
      setEmailError('Domínio do email deve ter pelo menos 2 caracteres');
      return false;
    }
    
    // Verifica se a extensão tem pelo menos 2 caracteres
    const extension = domain ? domain.split('.').pop() : '';
    if (!extension || extension.length < 2) {
      setEmailError('Extensão do email deve ter pelo menos 2 caracteres (ex: .com, .br)');
      return false;
    }
    
    setEmailError('');
    return true;
  }, []);

  const isEmailValid = useMemo(() => {
    if (!email.trim()) return false;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) return false;
    
    const emailLower = email.trim().toLowerCase();
    const beforeAt = emailLower.split('@')[0];
    if (beforeAt.length < 3) return false;
    
    const domain = emailLower.split('@')[1];
    if (domain && domain.split('.')[0].length < 2) return false;
    
    const extension = domain ? domain.split('.').pop() : '';
    if (!extension || extension.length < 2) return false;
    
    return true;
  }, [email]);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setShowError(false); // Remove erro enquanto está digitando
    
    // Valida em tempo real após 5 caracteres
    if (value.length >= 5) {
    validateEmail(value);
    } else if (value.length === 0) {
      setEmailError('Email é obrigatório para continuar');
    }
    
    // Rastreia evento de preenchimento do email
    if (value.length >= 5 && validateEmail(value)) {
      // Debounce para evitar spam de eventos
      clearTimeout(window.emailInputTimeout);
      window.emailInputTimeout = setTimeout(() => {
        sendGAEvent('field_filled_email', {
          field_name: 'email',
          character_count: value.length,
          is_valid: true
        });
      }, 1000); // Envia evento apenas 1 segundo após parar de digitar
    }
  }, [setEmail, validateEmail]);

  const handleEmailFocus = useCallback(() => {
    setInputFocused(true);
    sendGAEvent('field_focused_email', {
      field_name: 'email'
    });
  }, [setInputFocused]);

  const handleEmailBlur = useCallback(() => {
    setInputFocused(false);
    setShowError(true); // Mostra erro quando sai do campo
    validateEmail(email);
  }, [setInputFocused, validateEmail, email]);

  return (
    <div>
      <div data-qa="question-header" className="header-wrapper-main">
        <div className="text-wrapper-main">
          <div className="title-container">
            <h1 className={`title-main-text ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.3s' }}>
              <span className={`question-number ${elementsVisible ? 'number-bounce' : ''}`} style={{ animationDelay: '0.1s' }}>3.</span>Agora insira seu e-mail*
            </h1>
            <div className={`title-secondary-text quiz-subtitle ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.5s' }}>
              Digite seu melhor e-mail para contato (obrigatório)
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
            onFocus={handleEmailFocus}
            onBlur={handleEmailBlur}
            onKeyDown={handleKeyPress}
            placeholder="Digite seu email (ex: seu@email.com)"
            className={`form-input-main ${emailError && showError ? 'input-error' : isEmailValid ? 'input-success' : ''}`}
            autoFocus
            maxLength={100}
            required
          />
          {emailError && showError && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {emailError}
            </div>
          )}
          {isEmailValid && (
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
              Selecione a opção que melhor descreve sua situação (obrigatório)
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
        
        {/* Mostra mensagem se nenhuma opção for selecionada */}
        {!selectedMoment && optionsVisible && (
          <div className="validation-message" style={{ marginTop: '16px', textAlign: 'center' }}>
            <span style={{ color: '#ff6b6b', fontSize: '14px' }}>
              ⚠️ Selecione uma opção para continuar
            </span>
          </div>
        )}
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
              Selecione sua experiência com vendas internacionais (obrigatório)
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
        
        {/* Mostra mensagem se nenhuma opção for selecionada */}
        {!vendeuFora && optionsVisible && (
          <div className="validation-message" style={{ marginTop: '16px', textAlign: 'center' }}>
            <span style={{ color: '#ff6b6b', fontSize: '14px' }}>
              ⚠️ Selecione uma opção para continuar
            </span>
          </div>
        )}
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
  // Função para formatar o valor como moeda brasileira
  const formatCurrency = (value: string) => {
    // Remove tudo que não for número
    const numericValue = value.replace(/\D/g, '');
    
    if (!numericValue) return '';
    
    // Converte para número e formata
    const number = parseInt(numericValue) / 100;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(number);
  };

  // Função para obter apenas o valor numérico sem formatação
  const getNumericValue = (formattedValue: string) => {
    return formattedValue.replace(/\D/g, '');
  };

  const handleFaturamentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Se o usuário está digitando "0" ou deletando tudo, permite
    if (inputValue === '' || inputValue === '0') {
      setFaturamento('');
      return;
    }
    
    // Se o usuário digita apenas números, formata como moeda
    if (/^\d+$/.test(inputValue.replace(/\D/g, ''))) {
      const formatted = formatCurrency(inputValue);
      setFaturamento(formatted);
    } else {
      // Se já está formatado ou contém texto, extrai números e reformata
      const numericOnly = inputValue.replace(/\D/g, '');
      if (numericOnly) {
        const formatted = formatCurrency(numericOnly);
        setFaturamento(formatted);
      } else {
        setFaturamento('');
      }
    }
  };

  return (
    <div>
      <div data-qa="question-header" className="header-wrapper-main">
        <div className="text-wrapper-main">
          <div className="title-container">
            <h1 className={`title-main-text ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.3s' }}>
              <span className={`question-number ${elementsVisible ? 'number-bounce' : ''}`} style={{ animationDelay: '0.1s' }}>7.</span>Quanto você já faturou acumulado no mercado digital até agora?*
            </h1>
            <div className={`title-secondary-text quiz-subtitle ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.5s' }}>
              Digite o valor total que você já faturou (ex: R$ 50.000,00, R$ 120.000,00, etc.)
            </div>
          </div>
        </div>
      </div>
      
      <div className="spacer-wrapper-description-main">
        <div className={`input-container ${inputFocused ? 'input-focused' : ''} ${elementsVisible ? 'input-fade-in' : 'input-hidden'}`} style={{ animationDelay: '0.7s' }}>
          <input
            type="text"
            value={faturamento}
            onChange={handleFaturamentoChange}
            onKeyDown={handleKeyPress}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            placeholder="R$ 0,00 (se ainda não faturou) ou R$ 50.000,00..."
            className="name-input input-enhanced"
            autoFocus
            maxLength={20}
          />
          <div className="input-underline input-underline-enhanced"></div>
        </div>
        <div className={`text-sm text-gray-500 mt-2 ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.9s' }}>
          💡 Dica: Digite apenas números (ex: 50000) e será formatado automaticamente
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
              Selecione a faixa de investimento que você tem disponível (obrigatório)
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
        
        {/* Mostra mensagem se nenhuma opção for selecionada */}
        {!caixaDisponivel && optionsVisible && (
          <div className="validation-message" style={{ marginTop: '16px', textAlign: 'center' }}>
            <span style={{ color: '#ff6b6b', fontSize: '14px' }}>
              ⚠️ Selecione uma opção para continuar
            </span>
          </div>
        )}
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
              E que te motiva a buscar faturamento em moedas como (Dólar, Euro ou Libra)? (obrigatório)
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
        
        {/* Mostra mensagem se nenhuma opção for selecionada */}
        {!problemaPrincipal && optionsVisible && (
          <div className="validation-message" style={{ marginTop: '16px', textAlign: 'center' }}>
            <span style={{ color: '#ff6b6b', fontSize: '14px' }}>
              ⚠️ Selecione uma opção para continuar
            </span>
          </div>
        )}
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
              Selecione a área onde você mais precisa de suporte (obrigatório)
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
        
        {/* Mostra mensagem se nenhuma opção for selecionada */}
        {!areaAjuda && optionsVisible && (
          <div className="validation-message" style={{ marginTop: '16px', textAlign: 'center' }}>
            <span style={{ color: '#ff6b6b', fontSize: '14px' }}>
              ⚠️ Selecione uma opção para continuar
            </span>
          </div>
        )}
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
              Queremos entender a estrutura do seu negócio (obrigatório)
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
        
        {/* Mostra mensagem se nenhuma opção for selecionada */}
        {!possuiSocio && optionsVisible && (
          <div className="validation-message" style={{ marginTop: '16px', textAlign: 'center' }}>
            <span style={{ color: '#ff6b6b', fontSize: '14px' }}>
              ⚠️ Selecione uma opção para continuar
            </span>
          </div>
        )}
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
              Conte-nos sobre seu comprometimento e motivação (mínimo 10 caracteres - obrigatório)
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
            className={`form-textarea-main ${porQueEscolher.trim().length > 0 && porQueEscolher.trim().length < 10 ? 'input-error' : porQueEscolher.trim().length >= 10 ? 'input-success' : ''}`}
            rows={6}
            maxLength={1000}
            autoFocus
          />
          <div className="character-count">
            {porQueEscolher.length}/1000 caracteres {porQueEscolher.length < 10 && `(mínimo 10)`}
          </div>
          
          {/* Mensagem de validação */}
          {porQueEscolher.trim().length > 0 && porQueEscolher.trim().length < 10 && (
            <div className="error-message" style={{ marginTop: '8px' }}>
              <span className="error-icon">⚠️</span>
              Escreva pelo menos 10 caracteres para continuar
            </div>
          )}
          {porQueEscolher.trim().length >= 10 && (
            <div className="success-message" style={{ marginTop: '8px' }}>
              <span className="success-icon">✅</span>
              Resposta válida!
            </div>
          )}
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
              Esta consultoria requer seu comprometimento total (obrigatório)
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
        
        {/* Mostra mensagem se nenhuma opção for selecionada */}
        {!compromisso && optionsVisible && (
          <div className="validation-message" style={{ marginTop: '16px', textAlign: 'center' }}>
            <span style={{ color: '#ff6b6b', fontSize: '14px' }}>
              ⚠️ Selecione uma opção para continuar
            </span>
          </div>
        )}
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
  const [analysisStage, setAnalysisStage] = useState<'initial' | 'analyzing' | 'complete'>('initial');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisText, setAnalysisText] = useState('Iniciando análise...');

  const startAnalysisSequence = useCallback(() => {
    const analysisSteps = [
      { text: 'Analisando suas respostas...', progress: 5, duration: 1200 },
      { text: 'Processando dados demográficos...', progress: 12, duration: 1400 },
      { text: 'Avaliando perfil empreendedor...', progress: 25, duration: 1600 },
      { text: 'Calculando potencial de crescimento...', progress: 38, duration: 1300 },
      { text: 'Verificando compatibilidade com consultoria...', progress: 52, duration: 1500 },
      { text: 'Analisando experiência no mercado digital...', progress: 65, duration: 1200 },
      { text: 'Processando dados financeiros...', progress: 75, duration: 1400 },
      { text: 'Identificando oportunidades de crescimento...', progress: 85, duration: 1100 },
      { text: 'Preparando recomendações personalizadas...', progress: 92, duration: 1300 },
      { text: 'Gerando relatório de compatibilidade...', progress: 97, duration: 1000 },
      { text: 'Análise concluída! Redirecionando...', progress: 100, duration: 1500 }
    ];

    let currentStep = 0;
    
    const runStep = () => {
      if (currentStep < analysisSteps.length) {
        const step = analysisSteps[currentStep];
        setAnalysisText(step.text);
        setAnalysisProgress(step.progress);
        
        currentStep++;
        
        // Se for o último step, redireciona após mostrar 100%
        if (currentStep === analysisSteps.length) {
          setTimeout(() => {
            // Rastrear evento de redirecionamento
            sendGAEvent('calendly_redirect', {
              analysis_completed: true,
              redirect_url: 'https://calendly.com/maximizedigitall/30min?redirect_url=' + encodeURIComponent(window.location.origin + '/thank-you')
            });
            
            console.log('🚀 Redirecionando para Calendly automaticamente...');
            
            // Redirecionar diretamente para Calendly (não é bloqueado pelo navegador)
            const calendlyUrl = 'https://calendly.com/maximizedigitall/30min?redirect_url=' + encodeURIComponent(window.location.origin + '/thank-you');
            console.log('✅ Redirecionando para:', calendlyUrl);
            
            // Redirecionamento direto na mesma aba
            window.location.href = calendlyUrl;
          }, step.duration);
        } else {
          setTimeout(runStep, step.duration);
        }
      }
    };

    runStep();
  }, []);

  useEffect(() => {
    if (!isSubmitting && (submitStatus === 'success' || submitStatus === 'partial')) {
      // Inicia a análise após o envio bem-sucedido
      console.log('📊 Iniciando sequência de análise da IA...');
      const timer = setTimeout(() => {
        setAnalysisStage('analyzing');
        startAnalysisSequence();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isSubmitting, submitStatus, startAnalysisSequence]);

  if (analysisStage === 'analyzing') {
  return (
    <div>
      <div data-qa="question-header" className="header-wrapper-main">
        <div className="text-wrapper-main">
          <div className="title-container">
              {/* Logo similar ao carregamento */}
              <div className={`analysis-logo-container ${elementsVisible ? 'element-fade-in' : 'element-hidden'}`} style={{ animationDelay: '0.1s' }}>
                <div className="analysis-logo">
                  <Image src="/lgSemFundo.png" alt="Logo" width={120} height={120} priority />
                </div>
              </div>

              <h1 className={`title-main-text analysis-title ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.3s' }}>
                 Nossa IA está analisando seu perfil
            </h1>
              
              <div className={`title-secondary-text analysis-subtitle ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.5s' }}>
                {analysisText}
            </div>
            
              {/* Barra de progresso da análise */}
              <div className={`analysis-progress-container ${elementsVisible ? 'element-fade-in' : 'element-hidden'}`} style={{ animationDelay: '0.7s' }}>
                <div className="analysis-progress-bar">
                  <div 
                    className="analysis-progress-fill"
                    style={{ width: `${analysisProgress}%` }}
                  ></div>
                </div>
                <div className="analysis-progress-text">
                  {analysisProgress}% concluído
                </div>
              </div>

              {/* Indicadores de IA trabalhando */}
              <div className={`ai-indicators ${elementsVisible ? 'element-fade-in' : 'element-hidden'}`} style={{ animationDelay: '0.9s' }}>
                <div className="ai-dot ai-dot-1"></div>
                <div className="ai-dot ai-dot-2"></div>
                <div className="ai-dot ai-dot-3"></div>
                </div>

              {/* Mensagem adicional de carregamento */}
              <div className={`analysis-loading-message ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '1.1s' }}>
                <p>🧠 Analisando as variáveis do seu perfil...</p>
                <p>⏱️ Isso pode levar alguns segundos para ser preciso</p>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
  }

  // Estado inicial - ainda não iniciou a análise
  return (
    <div>
      <div data-qa="question-header" className="header-wrapper-main">
        <div className="text-wrapper-main">
          <div className="title-container">
            <h1 className={`title-main-text ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.3s' }}>
              Obrigado! 🎉
            </h1>
            <div className={`title-secondary-text ${elementsVisible ? 'text-fade-in' : 'text-hidden'}`} style={{ animationDelay: '0.5s' }}>
              Suas respostas foram enviadas com sucesso. Preparando análise...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
