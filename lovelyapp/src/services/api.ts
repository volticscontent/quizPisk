import axios from 'axios';
import { 
  User, 
  Profile, 
  Subscription, 
  GameContent, 
  Challenge, 
  Fantasy, 
  UserFantasy, 
  Achievement, 
  UserAchievement, 
  GameSession, 
  Workspace, 
  DigitalGift,
  ApiResponse,
  PaginatedResponse,
  GameMode,
  PlanType,
  GameConfig,
  GameAnalytics
} from '@/types';

// Configuração da API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('lovely.token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('lovely.token');
      localStorage.removeItem('lovely.user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Serviços de Autenticação
export const authService = {
  login: async (email: string, password: string): Promise<ApiResponse<{ user: User; token: string; redirectUrl: string }>> => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },

  register: async (userData: { email: string; password: string; name: string }): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  validateToken: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.get('/api/auth/validate');
    return response.data;
  },

  logout: async (): Promise<ApiResponse<{}>> => {
    const response = await api.post('/api/auth/logout');
    return response.data;
  }
};

// Serviços de Perfil
export const profileService = {
  getProfile: async (userId: string): Promise<ApiResponse<Profile>> => {
    const response = await api.get(`/api/profiles/${userId}`);
    return response.data;
  },

  createProfile: async (profileData: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Profile>> => {
    const response = await api.post('/api/profiles', profileData);
    return response.data;
  },

  updateProfile: async (userId: string, profileData: Partial<Profile>): Promise<ApiResponse<Profile>> => {
    const response = await api.put(`/api/profiles/${userId}`, profileData);
    return response.data;
  }
};

// Serviços de Assinatura
export const subscriptionService = {
  getUserSubscription: async (userId: string): Promise<ApiResponse<Subscription>> => {
    const response = await api.get(`/api/subscriptions/user/${userId}`);
    return response.data;
  },

  getPlans: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get('/api/plans');
    return response.data;
  }
};

// Serviços de Jogos
export const gameService = {
  getGameContent: async (mode: GameMode, planType: PlanType): Promise<ApiResponse<GameContent[]>> => {
    const response = await api.get(`/api/games/content`, {
      params: { mode, planType }
    });
    return response.data;
  },

  getChallenges: async (boldnessLevel: number, planType: PlanType): Promise<ApiResponse<Challenge[]>> => {
    const response = await api.get(`/api/games/challenges`, {
      params: { boldnessLevel, planType }
    });
    return response.data;
  },

  startGameSession: async (config: GameConfig): Promise<ApiResponse<GameSession>> => {
    const response = await api.post('/api/games/sessions', config);
    return response.data;
  },

  updateGameSession: async (sessionId: string, progress: Partial<GameSession>): Promise<ApiResponse<GameSession>> => {
    const response = await api.put(`/api/games/sessions/${sessionId}`, progress);
    return response.data;
  },

  completeGameSession: async (sessionId: string, analytics: GameAnalytics): Promise<ApiResponse<GameSession>> => {
    const response = await api.post(`/api/games/sessions/${sessionId}/complete`, analytics);
    return response.data;
  },

  getGameHistory: async (userId: string): Promise<ApiResponse<GameSession[]>> => {
    const response = await api.get(`/api/games/history/${userId}`);
    return response.data;
  }
};

// Serviços de Fantasias
export const fantasyService = {
  getFantasies: async (planType: PlanType): Promise<ApiResponse<Fantasy[]>> => {
    const response = await api.get('/api/fantasies', {
      params: { planType }
    });
    return response.data;
  },

  getUserFantasies: async (userId: string): Promise<ApiResponse<UserFantasy[]>> => {
    const response = await api.get(`/api/fantasies/user/${userId}`);
    return response.data;
  },

  selectFantasy: async (userId: string, fantasyId: string): Promise<ApiResponse<UserFantasy>> => {
    const response = await api.post('/api/fantasies/select', { userId, fantasyId });
    return response.data;
  },

  getSharedFantasies: async (workspaceId: string): Promise<ApiResponse<Fantasy[]>> => {
    const response = await api.get(`/api/fantasies/shared/${workspaceId}`);
    return response.data;
  },

  revealSharedFantasies: async (workspaceId: string): Promise<ApiResponse<Fantasy[]>> => {
    const response = await api.post(`/api/fantasies/reveal/${workspaceId}`);
    return response.data;
  }
};

// Serviços de Conquistas
export const achievementService = {
  getUserAchievements: async (userId: string): Promise<ApiResponse<UserAchievement[]>> => {
    const response = await api.get(`/api/achievements/user/${userId}`);
    return response.data;
  },

  getAvailableAchievements: async (planType: PlanType): Promise<ApiResponse<Achievement[]>> => {
    const response = await api.get('/api/achievements', {
      params: { planType }
    });
    return response.data;
  },

  checkAchievements: async (userId: string): Promise<ApiResponse<UserAchievement[]>> => {
    const response = await api.post(`/api/achievements/check/${userId}`);
    return response.data;
  },

  claimAchievement: async (userId: string, achievementId: string): Promise<ApiResponse<UserAchievement>> => {
    const response = await api.post('/api/achievements/claim', { userId, achievementId });
    return response.data;
  }
};

// Serviços de Workspace
export const workspaceService = {
  getWorkspace: async (userId: string): Promise<ApiResponse<Workspace>> => {
    const response = await api.get(`/api/workspace/${userId}`);
    return response.data;
  },

  createWorkspace: async (workspaceData: Omit<Workspace, 'id'>): Promise<ApiResponse<Workspace>> => {
    const response = await api.post('/api/workspace', workspaceData);
    return response.data;
  },

  updateWorkspace: async (workspaceId: string, workspaceData: Partial<Workspace>): Promise<ApiResponse<Workspace>> => {
    const response = await api.put(`/api/workspace/${workspaceId}`, workspaceData);
    return response.data;
  },

  invitePartner: async (workspaceId: string, email: string): Promise<ApiResponse<{}>> => {
    const response = await api.post(`/api/workspace/${workspaceId}/invite`, { email });
    return response.data;
  },

  joinWorkspace: async (inviteCode: string): Promise<ApiResponse<Workspace>> => {
    const response = await api.post('/api/workspace/join', { inviteCode });
    return response.data;
  }
};

// Serviços de Presente Digital
export const giftService = {
  createGift: async (giftData: Omit<DigitalGift, 'id' | 'isRedeemed' | 'redeemedAt'>): Promise<ApiResponse<DigitalGift>> => {
    const response = await api.post('/api/gifts', giftData);
    return response.data;
  },

  redeemGift: async (giftId: string): Promise<ApiResponse<DigitalGift>> => {
    const response = await api.post(`/api/gifts/${giftId}/redeem`);
    return response.data;
  },

  getUserGifts: async (userId: string): Promise<ApiResponse<DigitalGift[]>> => {
    const response = await api.get(`/api/gifts/user/${userId}`);
    return response.data;
  }
};

// Serviços de Analytics
export const analyticsService = {
  trackGameSession: async (analytics: GameAnalytics): Promise<ApiResponse<{}>> => {
    const response = await api.post('/api/analytics/game-session', analytics);
    return response.data;
  },

  getUserStats: async (userId: string): Promise<ApiResponse<{
    totalGamesPlayed: number;
    totalTimeSpent: number;
    favoriteMode: GameMode;
    currentStreak: number;
    achievementsUnlocked: number;
  }>> => {
    const response = await api.get(`/api/analytics/user/${userId}`);
    return response.data;
  },

  getWorkspaceStats: async (workspaceId: string): Promise<ApiResponse<{
    gamesPlayedTogether: number;
    sharedFantasies: number;
    connectionScore: number;
    weeklyActivity: number[];
  }>> => {
    const response = await api.get(`/api/analytics/workspace/${workspaceId}`);
    return response.data;
  }
};

// Serviços de Conteúdo Personalizado
export const contentService = {
  getPersonalizedContent: async (userId: string): Promise<ApiResponse<{
    recommendedGames: GameContent[];
    suggestedChallenges: Challenge[];
    dailyTip: string;
    moodBasedContent: GameContent[];
  }>> => {
    const response = await api.get(`/api/content/personalized/${userId}`);
    return response.data;
  },

  getContentByMood: async (mood: string, planType: PlanType): Promise<ApiResponse<GameContent[]>> => {
    const response = await api.get('/api/content/mood', {
      params: { mood, planType }
    });
    return response.data;
  },

  searchContent: async (query: string, filters?: {
    mode?: GameMode;
    difficulty?: string;
    duration?: number;
    planType?: PlanType;
  }): Promise<ApiResponse<GameContent[]>> => {
    const response = await api.get('/api/content/search', {
      params: { query, ...filters }
    });
    return response.data;
  }
};

export { api }; 