'use client';

import { useEffect, useState } from 'react';
import { SessionManager } from '../utils/sessionManager';

interface SessionData {
  sessionId: string;
  data: Record<string, unknown>;
  lastUpdated?: number;
  currentStep?: string;
  name?: string;
  email?: string;
  phone?: string;
}

export default function AdminDashboard() {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [stats, setStats] = useState({ totalSessions: 0, totalKeys: 0, sessions: [] as string[] });
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  const loadSessions = () => {
    const sessionStats = SessionManager.getSessionStats();
    setStats(sessionStats);

    const sessionDataList: SessionData[] = [];

    sessionStats.sessions.forEach(sessionId => {
      const manager = new SessionManager(sessionId);
      const quizData = manager.getSessionData('quiz_data');
      
      if (quizData && typeof quizData === 'object' && quizData !== null) {
        const data = quizData as Record<string, unknown>;
        sessionDataList.push({
          sessionId,
          data,
          lastUpdated: data.lastUpdated as number,
          currentStep: data.currentStep as string,
          name: data.name as string,
          email: data.email as string,
          phone: data.phone as string,
        });
      }
    });

    // Ordena por última atualização (mais recente primeiro)
    sessionDataList.sort((a, b) => (b.lastUpdated || 0) - (a.lastUpdated || 0));
    setSessions(sessionDataList);
  };

  useEffect(() => {
    loadSessions();
    
    // Auto-refresh a cada 5 segundos
    const interval = setInterval(loadSessions, 5000);
    setRefreshInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString('pt-BR');
  };

  const clearAllSessions = () => {
    if (confirm('Tem certeza que deseja limpar todas as sessões? Esta ação não pode ser desfeita.')) {
      SessionManager.clearAllSessions();
      loadSessions();
    }
  };

  const clearSession = (sessionId: string) => {
    if (confirm(`Tem certeza que deseja limpar a sessão ${sessionId}?`)) {
      const manager = new SessionManager(sessionId);
      manager.clearSessionData();
      loadSessions();
    }
  };

  const exportSession = (sessionId: string) => {
    const manager = new SessionManager(sessionId);
    const data = manager.exportSessionData();
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `session_${sessionId}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const openSessionInNewTab = (sessionId: string) => {
    const url = new URL(window.location.origin);
    url.searchParams.set('session_id', sessionId);
    window.open(url.toString(), '_blank');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🎛️ Dashboard de Sessões - QuizPisk</h1>
      
      {/* Estatísticas */}
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '15px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div>
          <strong>📊 Sessões Ativas:</strong> {stats.totalSessions}
        </div>
        <div>
          <strong>🔑 Total de Chaves:</strong> {stats.totalKeys}
        </div>
        <div>
          <strong>🕒 Última Atualização:</strong> {new Date().toLocaleString('pt-BR')}
        </div>
      </div>

      {/* Controles */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button 
          onClick={loadSessions}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🔄 Atualizar
        </button>
        <button 
          onClick={clearAllSessions}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#dc3545', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🧹 Limpar Todas
        </button>
      </div>

      {/* Lista de Sessões */}
      <div style={{ display: 'grid', gap: '15px' }}>
        {sessions.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
            📭 Nenhuma sessão ativa encontrada
          </div>
        ) : (
          sessions.map(session => (
            <div 
              key={session.sessionId}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                backgroundColor: selectedSession === session.sessionId ? '#e3f2fd' : 'white'
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '10px',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div>
                  <div style={{ 
                    fontFamily: 'monospace', 
                    fontSize: '14px', 
                    color: '#666',
                    marginBottom: '5px'
                  }}>
                    🆔 {session.sessionId}
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
                    👤 {session.name || 'Nome não informado'}
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => openSessionInNewTab(session.sessionId)}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    🔗 Abrir
                  </button>
                  <button
                    onClick={() => exportSession(session.sessionId)}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#ffc107',
                      color: 'black',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    💾 Exportar
                  </button>
                  <button
                    onClick={() => clearSession(session.sessionId)}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    🗑️ Limpar
                  </button>
                </div>
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '10px',
                fontSize: '14px'
              }}>
                <div>
                  <strong>📍 Step Atual:</strong> {session.currentStep || 'N/A'}
                </div>
                <div>
                  <strong>📧 Email:</strong> {session.email || 'N/A'}
                </div>
                <div>
                  <strong>📱 Telefone:</strong> {session.phone || 'N/A'}
                </div>
                <div>
                  <strong>🕒 Última Atividade:</strong> {formatDate(session.lastUpdated)}
                </div>
              </div>

              {selectedSession === session.sessionId && (
                <div style={{ 
                  marginTop: '15px', 
                  padding: '10px', 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '4px',
                  fontSize: '12px'
                }}>
                  <strong>📊 Dados Completos:</strong>
                  <pre style={{ 
                    marginTop: '8px', 
                    overflow: 'auto', 
                    maxHeight: '200px',
                    backgroundColor: 'white',
                    padding: '8px',
                    borderRadius: '4px'
                  }}>
                    {JSON.stringify(session.data, null, 2)}
                  </pre>
                </div>
              )}

              <button
                onClick={() => setSelectedSession(
                  selectedSession === session.sessionId ? null : session.sessionId
                )}
                style={{
                  marginTop: '10px',
                  padding: '4px 8px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                {selectedSession === session.sessionId ? '🔼 Ocultar Detalhes' : '🔽 Ver Detalhes'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 