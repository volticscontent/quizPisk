import { NextRequest, NextResponse } from 'next/server';
import { broadcastToSession } from '../quiz-updates/route';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, step, progress, data } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    // Dados para broadcast via SSE
    const updateData = {
      type: 'quiz_progress',
      sessionId,
      step,
      progress: progress || 0,
      timestamp: new Date().toISOString(),
      data: data || {}
    };

    // Envia atualização via SSE
    const sent = broadcastToSession(sessionId, updateData);

    if (sent) {
      return NextResponse.json({ 
        success: true, 
        message: 'Progress update sent via SSE',
        data: updateData 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'No active SSE connection for this session' 
      });
    }

  } catch (error) {
    console.error('Erro ao processar progresso:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// GET para verificar status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');
  
  return NextResponse.json({
    message: 'Quiz Progress API',
    sessionId,
    timestamp: new Date().toISOString()
  });
} 