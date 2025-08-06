import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, step, progress, data } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    // Log para debug
    console.log('📊 Quiz progress update:', {
      sessionId,
      step,
      progress: progress || 0,
      timestamp: new Date().toISOString(),
      additionalData: data || {}
    });

    // Retorna sucesso (SSE foi simplificado e não é crítico)
    return NextResponse.json({ 
      success: true,
      message: 'Progress logged successfully',
      sessionId,
      step,
      progress: progress || 0
    });

  } catch (error) {
    console.error('❌ Erro no quiz-progress endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
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