import { NextRequest } from 'next/server';

export const runtime = 'edge';

// Store global para conexões ativas (em produção usar Redis)
const connections = new Map<string, ReadableStreamDefaultController>();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');
  
  console.log('🔌 Nova conexão SSE solicitada para sessionId:', sessionId);
  
  if (!sessionId) {
    console.error('❌ Session ID não fornecido para SSE');
    return new Response('Session ID required', { status: 400 });
  }

  // Fecha conexão existente se houver
  const existingController = connections.get(sessionId);
  if (existingController) {
    try {
      existingController.close();
      console.log('🔄 Fechando conexão SSE existente para sessionId:', sessionId);
    } catch (error) {
      console.warn('⚠️ Erro ao fechar conexão existente:', error);
    }
  }

  const stream = new ReadableStream({
    start(controller) {
      console.log('✅ Iniciando stream SSE para sessionId:', sessionId);
      
      // Armazena conexão para broadcasts
      connections.set(sessionId, controller);
      
      // Envia heartbeat inicial
      const encoder = new TextEncoder();
      try {
        controller.enqueue(encoder.encode('data: {"type":"connected","sessionId":"' + sessionId + '"}\n\n'));
        console.log('📤 Mensagem de conexão enviada para sessionId:', sessionId);
      } catch (error) {
        console.error('❌ Erro ao enviar mensagem inicial:', error);
        connections.delete(sessionId);
        return;
      }
      
      // Heartbeat para manter conexão viva
      const heartbeat = setInterval(() => {
        try {
          const heartbeatData = JSON.stringify({
            type: "heartbeat",
            timestamp: new Date().toISOString(),
            sessionId
          });
          controller.enqueue(encoder.encode(`data: ${heartbeatData}\n\n`));
          console.log('💓 Heartbeat enviado para sessionId:', sessionId);
        } catch (error) {
          console.error('❌ Erro no heartbeat SSE:', error);
          clearInterval(heartbeat);
          connections.delete(sessionId);
        }
      }, 30000); // 30 segundos
      
      // Cleanup quando conexão é fechada
      const cleanup = () => {
        console.log('🧹 Limpando conexão SSE para sessionId:', sessionId);
        clearInterval(heartbeat);
        connections.delete(sessionId);
      };
      
      // Escuta evento de abort da requisição
      request.signal.addEventListener('abort', cleanup);
    },
    cancel() {
      console.log('❌ Stream SSE cancelado para sessionId:', sessionId);
      connections.delete(sessionId);
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Cache-Control',
    },
  });
} 