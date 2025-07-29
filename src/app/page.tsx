'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { useUtmTracking } from './hooks/useUtmTracking';
import { useClarityTracking } from './hooks/useClarityTracking';
import { useSSE } from './hooks/useSSE';

// Importações dos arquivos modulares
import { QuizStep, Country, ValidationState } from './types/quiz';
import type { FormData } from './types/quiz';
import { sendMetaEvent, sendPageView, sendQuestionEvent, getStepNumber } from './utils/tracking';
import { N8N_WEBHOOK_URL, POSTGRES_WEBHOOK_URL, COUNTRIES, CALENDLY_URL } from './utils/constants';
import { validateCurrentStep } from './utils/validation';
import { getResponseText, saveToLocalStorage, loadFromLocalStorage, savePartialDataToLocalStorage, loadPartialDataFromLocalStorage, formatCurrency } from './utils/dataHandlers';

// Componentes
import { NameContent } from './components/NameContent';
import { WhatsAppContent } from './components/WhatsAppContent';
import { EmailContent } from './components/EmailContent';
import { InstagramContent } from './components/InstagramContent';
import { MomentoContent } from './components/MomentoContent';
import { OptionQuestion } from './components/OptionQuestion';
import { TextInputQuestion } from './components/TextInputQuestion';
import { AnalysisContent } from './components/AnalysisContent';
import { FinishedContent } from './components/FinishedContent';

// Importações das constantes de opções
import { 
  MOMENT_OPTIONS,
  VENDEU_FORA_OPTIONS, 
  CAIXA_OPTIONS, 
  PROBLEMA_OPTIONS, 
  AREA_AJUDA_OPTIONS, 
  SOCIO_OPTIONS, 
  COMPROMISSO_OPTIONS 
} from './utils/constants';

// Configuração simplificada apenas para Meta Pixel
declare global {
  interface Window {
    nameInputTimeout?: NodeJS.Timeout;
    phoneInputTimeout?: NodeJS.Timeout;
    emailInputTimeout?: NodeJS.Timeout;
  }
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState<QuizStep>('name');
  const [isButtonPressed, setIsButtonPressed] = useState(false);
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
  // Removido analysisCompleted que não era usado
  
  // ID da sessão para tracking de leads parciais
  const [sessionId] = useState(() => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `session_${timestamp}_${random}`;
  });

  // Removido validationState que não era usado

  // Hook para rastreamento UTM e Meta Pixel
  // Removido trackLead que não era usado
  const { } = useUtmTracking();
  
  // Hook para Microsoft Clarity Analytics
  const { trackQuizStep, trackQuizAbandonment, trackQuizCompletion, trackCalendlyClick, setUserSession, setCustomTag, upgradeSession } = useClarityTracking();
  
  // Hook para Server-Sent Events (atualizações em tempo real)
  const { isConnected: isSSEConnected, sendQuizProgress } = useSSE({
    sessionId,
    autoConnect: true,
    reconnectInterval: 3000,
    maxReconnectAttempts: 3
  });
  
  // Estado para país selecionado (padrão Brasil)
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);

  // Estado para controlar tempo de início do quiz
  const [quizStartTime] = useState<number>(Date.now());

  // Função para enviar leads parciais para PostgreSQL
  const sendPartialLead = async (stepName: string, stepData: { [key: string]: string }) => {
    console.log('📤 Tentando enviar lead parcial para PostgreSQL...', { sessionId, stepName, stepData });
    
    try {
      // Verifica se a URL está configurada
      if (!POSTGRES_WEBHOOK_URL || POSTGRES_WEBHOOK_URL.includes('localhost')) {
        console.log('⚠️ PostgreSQL webhook não configurado ou em localhost, pulando envio');
        return false;
      }

      const partialLeadData = {
        session_id: sessionId,
        step_name: stepName,
        step_number: getStepNumber(stepName as QuizStep),
        timestamp: new Date().toISOString(),
        submitted_at: new Date().toLocaleString('pt-BR'),
        user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
        page_url: typeof window !== 'undefined' ? window.location.href : '',
        referrer: typeof window !== 'undefined' ? document.referrer : '',
        // Dados específicos do step
        ...stepData,
        // Status do progresso
        progress_percentage: getProgressForStep(stepName as QuizStep),
        is_complete: false
      };

      // Adiciona dados completos apenas se existirem (evita chamadas a getResponseText desnecessárias)
      const currentData: Record<string, string> = {};
      
      if (name) currentData.current_name = name;
      if (phone && selectedCountry) currentData.current_phone = selectedCountry.phoneCode + phone;
      if (email) currentData.current_email = email;
      if (instagram) currentData.current_instagram = instagram;
      if (selectedMoment) {
        try {
          currentData.current_moment = getResponseText('moment', selectedMoment);
        } catch (e) {
          currentData.current_moment = selectedMoment;
        }
      }
      
      // Mescla dados adicionais
      Object.assign(partialLeadData, currentData);

      const response = await fetch(POSTGRES_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(partialLeadData),
        // Timeout de 5 segundos
        signal: AbortSignal.timeout(5000)
      });

      if (response.ok) {
        console.log('✅ Lead parcial enviado com sucesso para PostgreSQL!');
        return true;
      } else {
        console.warn('⚠️ Erro ao enviar lead parcial para PostgreSQL:', response.status, response.statusText);
        return false;
      }
    } catch (error) {
      console.warn('⚠️ Erro de conexão ao enviar lead parcial (não crítico):', error);
      return false;
    }
  };

  // Função para enviar dados para o webhook n8n
  const sendToN8nWebhook = async (formData: FormData) => {
    console.log('📤 Enviando dados para n8n webhook...');
    console.log('🔗 URL n8n utilizada:', N8N_WEBHOOK_URL);
    
    // Verificar campos undefined
    const undefinedFields = Object.entries(formData).filter(([, value]) => value === undefined || value === null);
    if (undefinedFields.length > 0) {
      console.warn('⚠️ Campos undefined encontrados:', undefinedFields);
    }
    
    console.log('📋 Dados que serão enviados:', JSON.stringify(formData, null, 2));

    try {
      // Verifica se estamos em desenvolvimento local
      if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        console.warn('⚠️ Desenvolvimento local detectado, simulando envio bem-sucedido para n8n');
        return true;
      }

      // Verifica se a URL está configurada
      if (!N8N_WEBHOOK_URL || N8N_WEBHOOK_URL.includes('localhost')) {
        console.warn('⚠️ N8N webhook não configurado ou em localhost, pulando envio');
        return false;
      }

      console.log('🚀 Iniciando requisição para N8N...');
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        // Timeout de 10 segundos para webhooks externos
        signal: AbortSignal.timeout(10000)
      });

      console.log('📡 Resposta recebida do N8N:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (response.ok) {
        const responseData = await response.text();
        console.log('✅ Dados enviados com sucesso para n8n!', responseData);
        return true;
      } else {
        const errorText = await response.text().catch(() => 'Erro ao ler resposta');
        console.warn('⚠️ Erro ao enviar para n8n:', {
          status: response.status,
          statusText: response.statusText,
          errorText
        });
        return false;
      }
    } catch (error) {
      console.error('❌ Erro de conexão com n8n:', {
        message: error instanceof Error ? error.message : String(error),
        name: error instanceof Error ? error.name : 'Unknown',
        stack: error instanceof Error ? error.stack : undefined
      });
      return false;
    }
  };

  // Função para finalizar e enviar dados
  const finishQuiz = async () => {
    if (isSubmitting) {
      console.log('⚠️ Envio já em andamento, aguarde...');
      return;
    }

    console.log('🎯 Finalizando quiz...');
    
    // DEBUG: Verificar todos os estados antes do envio
    console.log('🔍 Estados atuais antes do envio:', {
      name,
      phone,
      email,
      instagram,
      selectedMoment,
      vendeuFora,
      faturamento,
      caixaDisponivel,
      problemaPrincipal,
      areaAjuda,
      possuiSocio,
      porQueEscolher,
      compromisso,
      selectedCountry: selectedCountry?.name
    });
    
    setIsSubmitting(true);
    
    try {
      const formData = saveToLocalStorage({
        name,
        phone,
        email,
        instagram,
        selectedMoment,
        vendeuFora,
        faturamento,
        caixaDisponivel,
        problemaPrincipal,
        areaAjuda,
        possuiSocio,
        porQueEscolher,
        compromisso,
        selectedCountry
      });
      
      if (formData) {
        console.log('💾 Dados formatados para N8N:', formData);
        console.log('💾 Dados salvos localmente, tentando enviar para N8N...');
        
        try {
          // Usa o bridge seguro do N8N
          const n8nResult = await sendToN8nWebhook(formData);

          // Em desenvolvimento local, sempre considera sucesso
          if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
            console.log('🚀 Desenvolvimento local: simulando sucesso total');
            setSubmitStatus('success');
            
          } else if (n8nResult) {
            console.log('🎉 Quiz finalizado e enviado com sucesso para N8N!');
            setSubmitStatus('success');
            
            // Tracking Clarity - Quiz completado com sucesso
            const totalTime = Math.round((Date.now() - quizStartTime) / 1000);
            trackQuizCompletion(totalTime, true);
            upgradeSession(); // Marca sessão como importante
            setCustomTag('completion_status', 'success');
            setCustomTag('leads_sent_count', '1');
            
            // Envia evento QuClick-calendly apenas quando há sucesso total
            sendMetaEvent('QuClick-calendly', {
              form_completed: true,
              leads_sent: 1,
              environment: 'production',
              session_id: sessionId,
              email: email,
              phone: phone,
            });
          } else {
            console.log('❌ Falha ao enviar para N8N, mas dados salvos localmente');
            setSubmitStatus('partial');
          }
        } catch (error) {
          console.error('❌ Erro ao enviar para N8N:', error);
          setSubmitStatus('partial');
        }
      } else {
        console.error('❌ Erro ao salvar dados localmente');
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('❌ Erro ao finalizar quiz:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Refs para controle de hydratação e animações
  const hasHydrated = useRef(false);
  const animationTimers = useRef<NodeJS.Timeout[]>([]);
  const isTransitioning = useRef(false);
  const isMounted = useRef(true);

  // Função para calcular o progresso baseado no step atual
  const getProgressForStep = (step: QuizStep): number => {
    const steps = ['name', 'whatsapp', 'email', 'instagram', 'momento', 'vendeu_fora', 'faturamento', 'caixa_disponivel', 'problema_principal', 'area_ajuda', 'socio', 'por_que_escolher', 'compromisso', 'analysis', 'finished'];
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
    setBackgroundLoaded(false);
    setElementsVisible(false);
    setContentVisible(false);
    setOptionsVisible(false);
    
    const timers = [
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

  // Controle de hydratação
  useEffect(() => {
    if (!hasHydrated.current) {
      setIsClient(true);
      hasHydrated.current = true;
      
      isTransitioning.current = false;
      setIsSubmitting(false);
      setIsButtonPressed(false);
      
      // Carrega dados salvos se existirem (primeiro tenta dados parciais, depois finais)
      const savedData = loadPartialDataFromLocalStorage() || loadFromLocalStorage();
      if (savedData) {
        console.log('🔄 Carregando dados salvos nos estados...');
        setName(savedData.name || '');
        setEmail(savedData.email || '');
        setInstagram(savedData.instagram || '');
        setSelectedMoment(savedData.selectedMoment || savedData.moment || '');
        setVendeuFora(savedData.vendeuFora || '');
        setFaturamento(savedData.faturamento || '');
        setCaixaDisponivel(savedData.caixaDisponivel || '');
        setProblemaPrincipal(savedData.problemaPrincipal || '');
        setAreaAjuda(savedData.areaAjuda || '');
        setPossuiSocio(savedData.possuiSocio || '');
        setPorQueEscolher(savedData.porQueEscolher || '');
        setCompromisso(savedData.compromisso || '');
        setPhone(savedData.phone || '');
        
        if (savedData.selectedCountry) {
          setSelectedCountry(savedData.selectedCountry);
        }
      }
      
      sendPageView();
      
      setTimeout(() => {
        if (hasHydrated.current) {
          console.log('🎭 Iniciando animação de welcome na inicialização');
          initiateWelcomeAnimation();
        }
      }, 100);
    }
  }, [initiateWelcomeAnimation]);

  // Rastreamento de abandono da página
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentStep !== 'finished') {
        console.log('Quiz abandoned at step:', currentStep);
        
        // Tracking Clarity - Abandono do quiz
        const timeSpent = Math.round((Date.now() - quizStartTime) / 1000);
        const stepNumber = getStepNumber(currentStep);
        trackQuizAbandonment(currentStep, stepNumber, timeSpent);
        setCustomTag('abandonment_reason', 'page_exit');
        
        const message = 'Tem certeza que deseja sair? Suas respostas serão perdidas.';
        return message;
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [currentStep, quizStartTime, trackQuizAbandonment, setCustomTag]);

  // Controle de progresso baseado no step atual
  useEffect(() => {
    if (!hasHydrated.current) return;
    
    const newProgress = getProgressForStep(currentStep);
    setProgress(newProgress);
  }, [currentStep]);

  // Efeito para inicializar sessão do Clarity
  useEffect(() => {
    if (hasHydrated.current && sessionId) {
      // Define sessão customizada no Clarity
      setUserSession(sessionId, {
        quiz_version: '1.0',
        environment: typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'development' : 'production',
        start_time: new Date().toISOString(),
        user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
        referrer: typeof window !== 'undefined' ? document.referrer : ''
      });
      
      // Define tags iniciais
      setCustomTag('session_type', 'quiz_session');
      setCustomTag('quiz_start_step', currentStep);
    }
  }, [sessionId, currentStep, setUserSession, setCustomTag]);

  // Tracking de progresso por step
  useEffect(() => {
    if (hasHydrated.current && currentStep !== 'name') {
      const stepNumber = getStepNumber(currentStep);
      const progressPercentage = getProgressForStep(currentStep);
      
      // Tracking Clarity
      trackQuizStep(currentStep, stepNumber);
      setCustomTag('current_step', currentStep);
      setCustomTag('progress_percentage', String(progressPercentage));
      
      // SSE - Envia progresso em tempo real
      if (isSSEConnected) {
        sendQuizProgress(currentStep, progressPercentage, {
          step_number: stepNumber,
          total_steps: 13,
          time_spent: Math.round((Date.now() - quizStartTime) / 1000)
        });
      }

      // N8N Bridge - Atualização removida daqui para evitar duplicação
      // A atualização é feita no handleContinue quando o usuário progride
    }
  }, [currentStep, isSSEConnected, trackQuizStep, setCustomTag, sendQuizProgress, quizStartTime]);

  // Efeito para Page View inicial do Meta Pixel
  useEffect(() => {
    if (hasHydrated.current && currentStep === 'name') {
      // trackQuizPageView(); // REMOVIDO
    }
  }, [currentStep]);

  // Cleanup effect - limpa todos os timers ao desmontar
  useEffect(() => {
    return () => {
      isMounted.current = false;
      clearAllTimers();
      
      if (typeof window !== 'undefined') {
        clearTimeout(window.nameInputTimeout);
        clearTimeout(window.phoneInputTimeout);
        clearTimeout(window.emailInputTimeout);
      }
    };
  }, []);

  const nextStep = () => {
    if (isTransitioning.current || isSubmitting) {
      console.log('⚠️ Transição já em andamento, ignorando...');
      return;
    }
    
    console.log('🔄 Iniciando transição de:', currentStep);
    isTransitioning.current = true;
    clearAllTimers();
    
    setContentVisible(false);
    setOptionsVisible(false);
    
    setTimeout(() => {
      let newStep: QuizStep;
      
      switch (currentStep) {
        case 'name': newStep = 'whatsapp'; break;
        case 'whatsapp': newStep = 'email'; break;
        case 'email': newStep = 'instagram'; break;
        case 'instagram': newStep = 'momento'; break;
        case 'momento': newStep = 'vendeu_fora'; break;
        case 'vendeu_fora': newStep = 'faturamento'; break;
        case 'faturamento': newStep = 'caixa_disponivel'; break;
        case 'caixa_disponivel': newStep = 'problema_principal'; break;
        case 'problema_principal': newStep = 'area_ajuda'; break;
        case 'area_ajuda': newStep = 'socio'; break;
        case 'socio': newStep = 'por_que_escolher'; break;
        case 'por_que_escolher': newStep = 'compromisso'; break;
        case 'compromisso': newStep = 'analysis'; break;
        case 'analysis': 
          console.log('🎯 Transição analysis → finished');
          newStep = 'finished'; 
          break;
        default: newStep = 'name';
      }
      
      console.log('✅ Transicionando para:', newStep);
      setCurrentStep(newStep);
      
      setTimeout(() => {
        isTransitioning.current = false;
        console.log('🎯 Transição concluída, liberando controle');
          initiateStepAnimation(newStep);
      }, 200);
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleContinue();
    }
  };

  // Função para quando a análise termina
  const handleAnalysisComplete = useCallback(() => {
    console.log('🤖 Análise da IA concluída, indo para step finished...');
    // Removido analysisCompleted que não era usado
    
    // Transição direta para finished
    setCurrentStep('finished');
    
    // Inicia animação do step finished
    setTimeout(() => {
      initiateStepAnimation('finished');
    }, 100);
    
    // Executa o finishQuiz para enviar os dados
    setTimeout(async () => {
      if (isSubmitting) {
        console.log('⚠️ Envio já em andamento, aguarde...');
        return;
      }

      console.log('🎯 Finalizando quiz...');
      
      // DEBUG: Verificar todos os estados antes do envio
      console.log('🔍 Estados atuais antes do envio:', {
        name,
        phone,
        email,
        instagram,
        selectedMoment,
        vendeuFora,
        faturamento,
        caixaDisponivel,
        problemaPrincipal,
        areaAjuda,
        possuiSocio,
        porQueEscolher,
        compromisso,
        selectedCountry: selectedCountry?.name
      });
      
      setIsSubmitting(true);
      
      try {
        const formData = saveToLocalStorage({
          name,
          phone,
          email,
          instagram,
          selectedMoment,
          vendeuFora,
          faturamento,
          caixaDisponivel,
          problemaPrincipal,
          areaAjuda,
          possuiSocio,
          porQueEscolher,
          compromisso,
          selectedCountry
        });
        
        if (formData) {
          console.log('💾 Dados formatados para N8N:', formData);
          console.log('💾 Dados salvos localmente, tentando enviar para N8N...');
          
          try {
            // Usa o bridge seguro do N8N
            const n8nResult = await sendToN8nWebhook(formData);

            // Em desenvolvimento local, sempre considera sucesso
            if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
              console.log('🚀 Desenvolvimento local: simulando sucesso total');
              setSubmitStatus('success');
              
            } else if (n8nResult) {
              console.log('🎉 Quiz finalizado e enviado com sucesso para N8N!');
              setSubmitStatus('success');
              
              // Tracking Clarity - Quiz completado com sucesso
              const totalTime = Math.round((Date.now() - quizStartTime) / 1000);
              trackQuizCompletion(totalTime, true);
              upgradeSession(); // Marca sessão como importante
              setCustomTag('completion_status', 'success');
              setCustomTag('leads_sent_count', '1');
              
              // Envia evento QuClick-calendly apenas quando há sucesso total
              sendMetaEvent('QuClick-calendly', {
                form_completed: true,
                leads_sent: 1,
                environment: 'production',
                session_id: sessionId,
                email: email,
                phone: phone,
              });
            } else {
              console.log('❌ Falha ao enviar para N8N, mas dados salvos localmente');
              setSubmitStatus('partial');
            }
          } catch (error) {
            console.error('❌ Erro ao enviar para N8N:', error);
            setSubmitStatus('partial');
          }
        } else {
          console.error('❌ Erro ao salvar dados localmente');
          setSubmitStatus('error');
        }
      } catch (error) {
        console.error('❌ Erro ao finalizar quiz:', error);
        setSubmitStatus('error');
      } finally {
        setIsSubmitting(false);
      }
    }, 500);
  }, [initiateStepAnimation, name, phone, email, instagram, selectedMoment, vendeuFora, faturamento, caixaDisponivel, problemaPrincipal, areaAjuda, possuiSocio, porQueEscolher, compromisso, selectedCountry, isSubmitting, saveToLocalStorage, sendToN8nWebhook, setSubmitStatus, quizStartTime, trackQuizCompletion, upgradeSession, setCustomTag, sendMetaEvent, sessionId]);

  const handleContinue = async () => {
    if (isTransitioning.current || isSubmitting) {
      console.log('⚠️ Ação já em andamento, aguarde...');
      return;
    }

    // Validação usando função utilitária
    const validation = validateCurrentStep(currentStep, {
      name,
      phone,
      email,
      instagram,
      selectedMoment,
      vendeuFora,
      faturamento,
      caixaDisponivel,
      problemaPrincipal,
      areaAjuda,
      possuiSocio,
      porQueEscolher,
      compromisso
    }, selectedCountry);

    if (!validation.isValid) {
      console.log(`🚫 Validação falhou: ${validation.errorMessage}`);
      alert(`❌ ${validation.errorMessage}`);
      return;
    }

    // Salva dados atuais no localStorage a cada step válido
    savePartialDataToLocalStorage({
      name,
      phone,
      email,
      instagram,
      selectedMoment,
      vendeuFora,
      faturamento,
      caixaDisponivel,
      problemaPrincipal,
      areaAjuda,
      possuiSocio,
      porQueEscolher,
      compromisso,
      selectedCountry
    });

    // Envia lead parcial para PostgreSQL quando step é validado
    const sendStepData = async () => {
      try {
        let stepData: { [key: string]: string } = {};
        
        // Define dados específicos por step
        switch (currentStep) {
        case 'name':
            stepData = { name: name.trim() };
        break;
      case 'whatsapp':
            stepData = { phone: selectedCountry.phoneCode + phone };
        break;
      case 'email':
            stepData = { email: email.trim() };
        break;
      case 'instagram':
            stepData = { instagram: instagram.trim() };
        break;
      case 'momento':
            stepData = { 
              moment: selectedMoment,
              moment_text: getResponseText('moment', selectedMoment)
            };
        break;
      case 'vendeu_fora':
            stepData = { 
              vendeu_fora: vendeuFora,
              vendeu_fora_text: getResponseText('vendeuFora', vendeuFora)
            };
        break;
      case 'faturamento':
            stepData = { faturamento: formatCurrency(faturamento) };
        break;
      case 'caixa_disponivel':
            stepData = { 
              caixa_disponivel: caixaDisponivel,
              caixa_disponivel_text: getResponseText('caixaDisponivel', caixaDisponivel)
            };
        break;
      case 'problema_principal':
            stepData = { 
              problema_principal: problemaPrincipal,
              problema_principal_text: getResponseText('problemaPrincipal', problemaPrincipal)
            };
        break;
      case 'area_ajuda':
            stepData = { 
              area_ajuda: areaAjuda,
              area_ajuda_text: getResponseText('areaAjuda', areaAjuda)
            };
        break;
      case 'socio':
            stepData = { 
              possui_socio: possuiSocio,
              possui_socio_text: getResponseText('possuiSocio', possuiSocio)
            };
        break;
      case 'por_que_escolher':
            stepData = { por_que_escolher: porQueEscolher.trim() };
        break;
        }
        
        await sendPartialLead(currentStep, stepData);
        
        // N8N Bridge - Atualiza progresso para manter sessão legítima
        // if (isN8NRegistered) { // REMOVIDO
        //   const stepNumber = getStepNumber(currentStep);
        //   updateN8NProgress(stepNumber, currentStep);
        // }
      } catch (error) {
        console.error('❌ Erro ao enviar lead parcial:', error);
      }
    };

    // Envia evento QuPergunta para steps de 1-7
    sendQuestionEvent(currentStep);

    // Caso especial para compromisso (vai para analysis)
    if (currentStep === 'compromisso') {
      sendPartialLead('compromisso', { 
        compromisso: compromisso,
        compromisso_text: getResponseText('compromisso', compromisso)
      }).catch(error => {
        console.warn('⚠️ Erro ao enviar lead parcial do compromisso (não crítico):', error);
      });
      
      nextStep(); // Vai para analysis
      return;
    }

    // Para outros steps, envia lead parcial e continua normalmente
    sendStepData().catch(error => {
      console.warn('⚠️ Erro ao enviar dados do step (não crítico):', error);
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
    if (isSubmitting) return true;
    
    const validation = validateCurrentStep(currentStep, {
      name,
      phone,
      email,
      instagram,
      selectedMoment,
      vendeuFora,
      faturamento,
      caixaDisponivel,
      problemaPrincipal,
      areaAjuda,
      possuiSocio,
      porQueEscolher,
      compromisso
    }, selectedCountry);

    return !validation.isValid;
  }, [currentStep, isSubmitting, name, phone, email, instagram, selectedMoment, vendeuFora, faturamento, caixaDisponivel, problemaPrincipal, areaAjuda, possuiSocio, porQueEscolher, compromisso, selectedCountry]);

  if (!isClient) {
    return null;
  }

  return (
    <>
      {/* Custom CSS for iPhone XS and smaller screens */}
      <style jsx>{`
        @media (max-width: 375px) and (max-height: 812px) {
          /* iPhone XS specific adjustments */
          .geometric-bg {
            padding-top: 10px !important;
          }
          
          /* Header logo adjustments */
          header {
            top: 8px !important;
            left: 12px !important;
            transform: scale(0.9);
          }
          
          /* Content wrapper adjustments */
          .content-wrapper-main {
            padding-top: 80px !important;
            margin-top: 10px !important;
            min-height: calc(100vh - 140px) !important;
          }
          
          
          /* Title adjustments */
          .title-main-text {
            font-size: 24px !important;
            line-height: 1.3 !important;
            margin-bottom: 8px !important;
          }
          
          .title-secondary-text,
          .quiz-subtitle {
            font-size: 14px !important;
            line-height: 1.4 !important;
            margin-bottom: 16px !important;
          }
          
          /* Header spacing */
          .header-wrapper-main {
            margin-bottom: 16px !important;
          }
          
          /* Description spacing */
          .spacer-wrapper-description-main {
            margin: 12px 0 16px 0 !important;
          }
          
          /* Progress bar adjustments */
          .progress-track {
            height: 2px !important;
          }
          
          /* Footer button adjustments */
          .persistent-footercomponent__PersistentFooterWrapper-sc-171bwtp-0 {
            padding: 12px 16px 16px 16px !important;
            margin-bottom: 8px !important;
          }
          
          .ButtonWrapper-sc-__sc-1qu8p4z-0 {
            min-height: 48px !important;
            max-width: 100% !important;
          }
          
          .FlexWrapper-sc-__sc-1qu8p4z-2 {
            padding: 14px 20px !important;
          }
          
          .TextWrapper-sc-__sc-1f8vz90-0 {
            font-size: 16px !important;
          }
        }
        
        @media (max-width: 320px) {
          /* iPhone 5/SE and very small screens */
          .content-wrapper-main {
            padding-top: 70px !important;
            padding-left: 12px !important;
            padding-right: 12px !important;
          }
          
          .title-main-text {
            font-size: 22px !important;
          }
          
          .title-secondary-text,
          .quiz-subtitle {
            font-size: 13px !important;
          }
          
          header {
            transform: scale(0.8);
            top: 6px !important;
            left: 8px !important;
          }
          
          .ButtonWrapper-sc-__sc-1qu8p4z-0 {
            min-height: 44px !important;
          }
          
          .FlexWrapper-sc-__sc-1qu8p4z-2 {
            padding: 12px 18px !important;
          }
          
          .TextWrapper-sc-__sc-1f8vz90-0 {
            font-size: 15px !important;
          }
        }
        
        @media (max-width: 812px) and (max-height: 375px) and (orientation: landscape) {
          /* iPhone XS landscape mode */
          .content-wrapper-main {
            padding-top: 40px !important;
            margin-top: 5px !important;
            min-height: calc(100vh - 80px) !important;
          }
          
          header {
            top: 5px !important;
            left: 10px !important;
            transform: scale(0.7);
          }
          
          .title-main-text {
            font-size: 20px !important;
            margin-bottom: 6px !important;
          }
          
          .title-secondary-text,
          .quiz-subtitle {
            font-size: 12px !important;
            margin-bottom: 10px !important;
          }
          
          .header-wrapper-main {
            margin-bottom: 10px !important;
          }
          
          .spacer-wrapper-description-main {
            margin: 8px 0 12px 0 !important;
          }
          
          .persistent-footercomponent__PersistentFooterWrapper-sc-171bwtp-0 {
            padding: 8px 16px 12px 16px !important;
            margin-bottom: 4px !important;
          }
          
          .ButtonWrapper-sc-__sc-1qu8p4z-0 {
            min-height: 40px !important;
          }
          
          .FlexWrapper-sc-__sc-1qu8p4z-2 {
            padding: 10px 18px !important;
          }
          
          .TextWrapper-sc-__sc-1f8vz90-0 {
            font-size: 14px !important;
          }
        }
      `}</style>

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
                
                {/* Conteúdo dinâmico usando componentes extraídos */}
                {currentStep === 'name' && (
                  <NameContent 
                    elementsVisible={contentVisible}
                    name={name}
                    setName={setName}
                    inputFocused={inputFocused}
                    setInputFocused={setInputFocused}
                    handleKeyPress={handleKeyPress}
                    sendPartialLead={sendPartialLead}
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
                    selectedCountry={selectedCountry}
                    setSelectedCountry={setSelectedCountry}
                    countries={COUNTRIES}
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
                    selectedMoment={selectedMoment}
                    setSelectedMoment={setSelectedMoment}
                    optionsVisible={optionsVisible}
                    momentOptions={MOMENT_OPTIONS}
                  />
                )}

                {currentStep === 'vendeu_fora' && (
                  <OptionQuestion 
                    elementsVisible={contentVisible}
                    questionNumber="6"
                    questionText="Você já vendeu para fora do Brasil?"
                    options={VENDEU_FORA_OPTIONS}
                    selectedValue={vendeuFora}
                    onSelect={setVendeuFora}
                  />
                )}

                {currentStep === 'faturamento' && (
                  <TextInputQuestion 
                    elementsVisible={contentVisible}
                    questionNumber="7"
                    questionText="Quanto você já faturou no mercado digital?"
                    value={faturamento}
                    onChange={setFaturamento}
                    inputFocused={inputFocused}
                    setInputFocused={setInputFocused}
                    handleKeyPress={handleKeyPress}
                    placeholder="R$ 0,00"
                    isCurrency={true}
                  />
                )}

                {currentStep === 'caixa_disponivel' && (
                  <OptionQuestion 
                    elementsVisible={contentVisible}
                    questionNumber="8"
                    questionText="Quanto você tem disponível para investir?"
                    options={CAIXA_OPTIONS}
                    selectedValue={caixaDisponivel}
                    onSelect={setCaixaDisponivel}
                  />
                )}

                {currentStep === 'problema_principal' && (
                  <OptionQuestion 
                    elementsVisible={contentVisible}
                    questionNumber="9"
                    questionText="Qual seu principal problema?"
                    options={PROBLEMA_OPTIONS}
                    selectedValue={problemaPrincipal}
                    onSelect={setProblemaPrincipal}
                  />
                )}

                {currentStep === 'area_ajuda' && (
                  <OptionQuestion 
                    elementsVisible={contentVisible}
                    questionNumber="10"
                    questionText="Em que área precisa de ajuda?"
                    options={AREA_AJUDA_OPTIONS}
                    selectedValue={areaAjuda}
                    onSelect={setAreaAjuda}
                  />
                )}

                {currentStep === 'socio' && (
                  <OptionQuestion 
                    elementsVisible={contentVisible}
                    questionNumber="11"
                    questionText="Você possui sócio?"
                    options={SOCIO_OPTIONS}
                    selectedValue={possuiSocio}
                    onSelect={setPossuiSocio}
                  />
                )}

                {currentStep === 'por_que_escolher' && (
                  <TextInputQuestion 
                    elementsVisible={contentVisible}
                    questionNumber="12"
                    questionText="Por que deveríamos escolher você?"
                    value={porQueEscolher}
                    onChange={setPorQueEscolher}
                    inputFocused={inputFocused}
                    setInputFocused={setInputFocused}
                    handleKeyPress={handleKeyPress}
                    placeholder="Conte sobre seu comprometimento..."
                    isTextarea={true}
                    rows={6}
                  />
                )}

                {currentStep === 'compromisso' && (
                  <OptionQuestion 
                    elementsVisible={contentVisible}
                    questionNumber="13"
                    questionText="Você se compromete a comparecer?"
                    options={COMPROMISSO_OPTIONS}
                    selectedValue={compromisso}
                    onSelect={setCompromisso}
                  />
                )}

                {currentStep === 'analysis' && (
                  <AnalysisContent 
                    elementsVisible={contentVisible} 
                    onAnalysisComplete={handleAnalysisComplete} 
                  />
                )}

                {currentStep === 'finished' && (
                  <FinishedContent 
                    elementsVisible={contentVisible}
                    sendMetaEvent={sendMetaEvent}
                    sessionId={sessionId}
                    email={email}
                    phone={selectedCountry?.phoneCode + phone}
                    trackCalendlyClick={trackCalendlyClick}
                  />
                )}

              </div>
            </div>
          </div>
        </div>

        {/* Footer com Botão - Formato Typeform Original */}
        {currentStep !== 'analysis' && (
        <div className="footer-wrapperstyles__FooterWrapper-sc-12dpj1x-0 jGEmmb">
          <div data-qa="persistent-footer" className="persistent-footercomponent__PersistentFooterWrapper-sc-171bwtp-0 jTdQsH">
            
            <div color="#000000" className="persistent-footercomponent__TransparentBackground-sc-171bwtp-1 cgqYMs"></div>
            <div className="AnimateStyled-sc-__sc-nw4u3g-0 jPHXjX" data-qa="animate">
              <div className="persistent-footercomponent__ButtonsWrapper-sc-171bwtp-3 bYGfZr">
                <button 
                  data-qa="ok-button-visible-deep-purple-ok-button-visible" 
                    className={`ButtonWrapper-sc-__sc-1qu8p4z-0 eTknZ ${isButtonPressed ? 'button-pressed' : ''} ${(isButtonDisabled && currentStep !== 'finished') ? 'button-disabled' : ''}`}
                  onClick={currentStep === 'finished' ? 
                    () => {
                      // Tracking Meta Pixel - Click no Calendly
                      if (sendMetaEvent) {
                        sendMetaEvent('QuClick-calendly', {
                          form_completed: true,
                          environment: 'production',
                          session_id: sessionId,
                          email: email,
                          phone: selectedCountry?.phoneCode + phone,
                          clicked_calendly: true
                        });
                      }
                      
                      // Tracking Clarity - Click no Calendly
                      if (trackCalendlyClick) {
                        trackCalendlyClick('finished');
                      }
                      
                      // Redireciona para o Calendly
                      window.open(CALENDLY_URL, '_blank');
                    } : 
                    handleContinue
                  }
                  onKeyDown={handleKeyPress}
                    onMouseDown={() => !(isButtonDisabled && currentStep !== 'finished') && setIsButtonPressed(true)}
                  onMouseUp={() => setIsButtonPressed(false)}
                  onMouseLeave={() => setIsButtonPressed(false)}
                    disabled={isButtonDisabled && currentStep !== 'finished'}
                >
                  <div className="ButtonBackground-sc-__sc-1qu8p4z-1 hlUeyE"></div>
                  <span className="FlexWrapper-sc-__sc-1qu8p4z-2 bnIfYq">
                    <span className="ButtonTextWrapper-sc-__sc-1qu8p4z-5 iWNLzO">
                      <span className="TextWrapper-sc-__sc-1f8vz90-0 gbnXlt">
                        {currentStep === 'finished' ? 
                          '🗓️ Agendar Consultoria Gratuita' : 
                          (isSubmitting ? 'Enviando...' : getButtonText())
                        }
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