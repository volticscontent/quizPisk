// Tipos de usuário e perfil
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  partnerName?: string;
  mood: 'romantic' | 'playful' | 'passionate' | 'adventurous' | 'intimate';
  boldnessLevel: number; // 1-10
  preferences: string[];
  taboos: string[];
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// Tipos de planos
export type PlanType = 'no-climinha' | 'modo-quente' | 'sem-freio';

export interface Plan {
  id: string;
  name: string;
  displayName: string;
  price: number;
  features: string[];
  maxUsers: number;
  type: PlanType;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  plan: Plan;
  status: 'active' | 'cancelled' | 'expired';
  startDate: string;
  endDate?: string;
}

// Tipos de jogos e modos
export type GameMode = 
  | 'exploracao-guiada'
  | 'modo-selvagem'
  | 'roleplay-narracao'
  | 'verdade-desafio'
  | 'strip-quiz'
  | 'roleta-desejo'
  | 'dados-kamasutra'
  | 'mimica-proibida'
  | 'cartas-eroticas'
  | 'esquenta-alvo'
  | 'fantasias-secretas'
  | 'massagem-tantrica'
  | 'conexao-emocional'
  | 'dez-dates';

export interface GameContent {
  id: string;
  mode: GameMode;
  title: string;
  description: string;
  content: string;
  audioUrl?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // em minutos
  requiredPlan: PlanType;
  tags: string[];
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'physical' | 'emotional' | 'sensual' | 'communication';
  boldnessRequired: number;
  duration: number;
  instructions: string[];
  rewards?: string[];
}

// Tipos de fantasias
export interface Fantasy {
  id: string;
  title: string;
  description: string;
  category: 'romantic' | 'adventurous' | 'roleplay' | 'sensual' | 'kinky';
  isPrivate: boolean;
  requiredPlan: PlanType;
}

export interface UserFantasy {
  id: string;
  userId: string;
  fantasyId: string;
  isSelected: boolean;
  isRevealed: boolean;
  createdAt: string;
}

// Tipos de conquistas
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'daily' | 'weekly' | 'milestone' | 'special';
  requirements: {
    gamesPlayed?: number;
    challengesCompleted?: number;
    daysActive?: number;
    specificMode?: GameMode;
  };
  rewards: {
    title?: string;
    unlockedContent?: string[];
    badge?: string;
  };
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: string;
  progress: number; // 0-100
}

// Tipos de sessão de jogo
export interface GameSession {
  id: string;
  userId: string;
  mode: GameMode;
  participants: string[]; // nomes dos participantes
  startedAt: string;
  completedAt?: string;
  currentStep: number;
  totalSteps: number;
  settings: {
    duration?: number;
    difficulty?: string;
    customRules?: string[];
  };
  progress: {
    challengesCompleted: number;
    pointsEarned: number;
    timeSpent: number;
  };
}

// Tipos de presente digital
export interface DigitalGift {
  id: string;
  fromUserId: string;
  toEmail: string;
  message: string;
  scheduledFor?: string;
  giftType: 'app-access' | 'premium-content' | 'custom-experience';
  isRedeemed: boolean;
  redeemedAt?: string;
  expiresAt?: string;
}

// Tipos de workspace/configurações
export interface Workspace {
  id: string;
  ownerId: string;
  name: string;
  participants: {
    userId: string;
    name: string;
    role: 'owner' | 'partner';
    joinedAt: string;
  }[];
  settings: {
    theme: 'romantic' | 'playful' | 'elegant' | 'dark';
    notifications: boolean;
    privacy: 'private' | 'shared';
    language: 'pt' | 'en' | 'es';
  };
  sharedFantasies: string[];
  completedChallenges: string[];
  currentStreak: number;
}

// Tipos de API Response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Tipos de contexto de autenticação
export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  subscription: Subscription | null;
  workspace: Workspace | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  refreshUserData: () => Promise<void>;
  initAuth: () => Promise<void>;
  // Funções auxiliares
  hasFeatureAccess: (feature: string) => boolean;
  isPremium: () => boolean;
  hasPartner: () => boolean;
}

// Tipos de configuração de jogo
export interface GameConfig {
  mode: GameMode;
  participants: number;
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  includeAudio: boolean;
  customSettings?: Record<string, any>;
}

// Tipos de analytics
export interface GameAnalytics {
  userId: string;
  sessionId: string;
  mode: GameMode;
  duration: number;
  completionRate: number;
  satisfaction: number; // 1-5
  feedback?: string;
  timestamp: string;
} 