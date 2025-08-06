import { useEffect, useRef, useState, useCallback } from 'react';

interface SSEMessage {
  type: string;
  sessionId?: string;
  timestamp?: string;
  [key: string]: unknown;
}

interface UseSSEOptions {
  sessionId: string;
  autoConnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export const useSSE = (options: UseSSEOptions) => {
  const { sessionId, autoConnect = true, reconnectInterval = 5000, maxReconnectAttempts = 10 } = options;
  
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<SSEMessage | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messageHandlersRef = useRef<Map<string, (data: SSEMessage) => void>>(new Map());

  // Conecta ao SSE
  const connect = useCallback(() => {
    if (eventSourceRef.current?.readyState === EventSource.OPEN) {
      return; // Já conectado
    }

    try {
      const url = `/api/quiz-updates?sessionId=${encodeURIComponent(sessionId)}`;
      console.log('🔌 Tentando conectar SSE:', url);
      
      const eventSource = new EventSource(url);
      
      eventSource.onopen = () => {
        console.log('✅ SSE Connected');
        setIsConnected(true);
        setReconnectAttempts(0);
      };

      eventSource.onmessage = (event) => {
        try {
          const data: SSEMessage = JSON.parse(event.data);
          setLastMessage(data);
          
          // Chama handlers específicos por tipo
          const handler = messageHandlersRef.current.get(data.type);
          if (handler) {
            handler(data);
          }
          
          console.log('📨 SSE Message:', data);
        } catch (error) {
          console.warn('⚠️ Erro ao parsear mensagem SSE:', error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('❌ SSE Error occurred:', {
          readyState: eventSource.readyState,
          url: eventSource.url,
          type: (error as Event).type,
          target: (error as Event).target?.constructor?.name,
          reconnectAttempts,
          maxReconnectAttempts
        });
        
        setIsConnected(false);
        
        // Fecha a conexão atual antes de tentar reconectar
        if (eventSource.readyState !== EventSource.CLOSED) {
          eventSource.close();
        }
        
        // Reconecta automaticamente
        if (reconnectAttempts < maxReconnectAttempts) {
          console.log(`🔄 Tentando reconectar SSE em ${reconnectInterval}ms (tentativa ${reconnectAttempts + 1}/${maxReconnectAttempts})`);
          reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectAttempts(prev => prev + 1);
            connect();
          }, reconnectInterval);
        } else {
          console.error('❌ Max reconnect attempts reached for SSE');
        }
      };

      eventSourceRef.current = eventSource;
      
    } catch (error) {
      console.error('❌ Erro ao conectar SSE:', error instanceof Error ? error.message : String(error));
      setIsConnected(false);
    }
  }, [sessionId, reconnectAttempts, maxReconnectAttempts, reconnectInterval]);

  // Desconecta do SSE
  const disconnect = useCallback(() => {
    console.log('🔌 Desconectando SSE...');
    
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    setIsConnected(false);
    setReconnectAttempts(0);
    console.log('🔌 SSE Disconnected');
  }, []);

  // Adiciona handler para tipo específico de mensagem
  const addMessageHandler = useCallback((type: string, handler: (data: SSEMessage) => void) => {
    messageHandlersRef.current.set(type, handler);
  }, []);

  // Remove handler
  const removeMessageHandler = useCallback((type: string) => {
    messageHandlersRef.current.delete(type);
  }, []);

  // Envia progresso do quiz via API
  const sendQuizProgress = useCallback(async (step: string, progress: number, data?: Record<string, unknown>) => {
    try {
      const response = await fetch('/api/quiz-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          step,
          progress,
          data
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('📤 Quiz progress sent:', result);
      return result;
    } catch (error) {
      console.error('❌ Erro ao enviar progresso:', error instanceof Error ? error.message : String(error));
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  }, [sessionId]);

  // Auto-conecta na inicialização
  useEffect(() => {
    if (autoConnect && sessionId) {
      connect();
    }

    // Cleanup na desmontagem
    return () => {
      disconnect();
    };
  }, [autoConnect, sessionId, connect, disconnect]);

  // Cleanup de timeouts
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return {
    isConnected,
    lastMessage,
    reconnectAttempts,
    connect,
    disconnect,
    addMessageHandler,
    removeMessageHandler,
    sendQuizProgress
  };
}; 