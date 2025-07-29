// Gerenciador de sessões por cliente
export class SessionManager {
  private sessionId: string;

  constructor(sessionId?: string) {
    this.sessionId = sessionId || this.generateSessionId();
  }

  // Gera um ID único para a sessão
  private generateSessionId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `session_${timestamp}_${random}`;
  }

  // Obtém o ID da sessão atual
  getSessionId(): string {
    return this.sessionId;
  }

  // Cria uma nova sessão
  createNewSession(): string {
    this.sessionId = this.generateSessionId();
    this.clearSessionData(); // Limpa dados da sessão anterior
    return this.sessionId;
  }

  // Salva dados específicos da sessão
  setSessionData(key: string, data: unknown): void {
    if (typeof window === 'undefined') return;
    
    try {
      const sessionKey = `${this.sessionId}_${key}`;
      localStorage.setItem(sessionKey, JSON.stringify(data));
      console.log(`💾 Dados salvos para sessão ${this.sessionId}:`, key, data);
    } catch (error) {
      console.warn('⚠️ Erro ao salvar dados da sessão:', error);
    }
  }

  // Recupera dados específicos da sessão
  getSessionData<T>(key: string, defaultValue?: T): T | null {
    if (typeof window === 'undefined') return defaultValue || null;
    
    try {
      const sessionKey = `${this.sessionId}_${key}`;
      const stored = localStorage.getItem(sessionKey);
      
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log(`📂 Dados recuperados para sessão ${this.sessionId}:`, key, parsed);
        return parsed;
      }
      
      return defaultValue || null;
    } catch (error) {
      console.warn('⚠️ Erro ao recuperar dados da sessão:', error);
      return defaultValue || null;
    }
  }

  // Remove dados específicos da sessão
  removeSessionData(key: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      const sessionKey = `${this.sessionId}_${key}`;
      localStorage.removeItem(sessionKey);
      console.log(`🗑️ Dados removidos para sessão ${this.sessionId}:`, key);
    } catch (error) {
      console.warn('⚠️ Erro ao remover dados da sessão:', error);
    }
  }

  // Limpa todos os dados da sessão atual
  clearSessionData(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const keysToRemove: string[] = [];
      
      // Encontra todas as chaves relacionadas a esta sessão
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`${this.sessionId}_`)) {
          keysToRemove.push(key);
        }
      }
      
      // Remove todas as chaves da sessão
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      console.log(`🧹 Dados da sessão ${this.sessionId} limpos (${keysToRemove.length} itens)`);
    } catch (error) {
      console.warn('⚠️ Erro ao limpar dados da sessão:', error);
    }
  }

  // Lista todas as sessões ativas
  static getActiveSessions(): string[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const sessions = new Set<string>();
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('session_')) {
          const sessionId = key.split('_')[0] + '_' + key.split('_')[1] + '_' + key.split('_')[2];
          sessions.add(sessionId);
        }
      }
      
      return Array.from(sessions);
    } catch (error) {
      console.warn('⚠️ Erro ao listar sessões ativas:', error);
      return [];
    }
  }

  // Limpa todas as sessões (útil para limpeza geral)
  static clearAllSessions(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('session_')) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      console.log(`🧹 Todas as sessões limpas (${keysToRemove.length} itens)`);
    } catch (error) {
      console.warn('⚠️ Erro ao limpar todas as sessões:', error);
    }
  }

  // Obtém estatísticas das sessões
  static getSessionStats(): { totalSessions: number; totalKeys: number; sessions: string[] } {
    if (typeof window === 'undefined') return { totalSessions: 0, totalKeys: 0, sessions: [] };
    
    try {
      const sessions = SessionManager.getActiveSessions();
      const totalKeys = Object.keys(localStorage).filter(key => key.startsWith('session_')).length;
      
      return {
        totalSessions: sessions.length,
        totalKeys,
        sessions
      };
    } catch (error) {
      console.warn('⚠️ Erro ao obter estatísticas das sessões:', error);
      return { totalSessions: 0, totalKeys: 0, sessions: [] };
    }
  }

  // Verifica se a sessão tem dados salvos
  hasSessionData(): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`${this.sessionId}_`)) {
          return true;
        }
      }
      return false;
    } catch (error) {
      console.warn('⚠️ Erro ao verificar dados da sessão:', error);
      return false;
    }
  }

  // Exporta todos os dados da sessão
  exportSessionData(): Record<string, unknown> {
    if (typeof window === 'undefined') return {};
    
    try {
      const sessionData: Record<string, unknown> = {};
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`${this.sessionId}_`)) {
          const dataKey = key.replace(`${this.sessionId}_`, '');
          const value = localStorage.getItem(key);
          if (value) {
            sessionData[dataKey] = JSON.parse(value);
          }
        }
      }
      
      return sessionData;
    } catch (error) {
      console.warn('⚠️ Erro ao exportar dados da sessão:', error);
      return {};
    }
  }
} 