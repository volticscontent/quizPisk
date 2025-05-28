"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService, profileService, subscriptionService, workspaceService } from '@/services/api';
import { User, Profile, Subscription, Workspace, AuthContextType } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);

  // Inicializar autenticação verificando token existente
  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      // Tentar diferentes chaves de token no localStorage
      let token = localStorage.getItem('lovely.token') || 
                  localStorage.getItem('token') || 
                  localStorage.getItem('authToken') ||
                  localStorage.getItem('pleasuregame.token');
      
      if (!token) {
        // Verificar se há token na URL (query parameter)
        const urlParams = new URLSearchParams(window.location.search);
        token = urlParams.get('token');
        
        if (token) {
          // Salvar token no localStorage
          localStorage.setItem('lovely.token', token);
          // Limpar token da URL
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
      
      if (!token) {
        setLoading(false);
        return;
      }

      // Garantir que o token está salvo na chave correta
      localStorage.setItem('lovely.token', token);

      // Validar token com o backend
      const response = await authService.validateToken();
      
      if (response.success && response.data) {
        const userData = response.data.user;
        setUser(userData);
        localStorage.setItem('lovely.user', JSON.stringify(userData));
        await loadUserData(userData.id);
      } else {
        // Token inválido, limpar localStorage
        clearAuthData();
      }
    } catch {
      // Token inválido, limpar localStorage
      clearAuthData();
    } finally {
      setLoading(false);
    }
  };

  // Limpar dados de autenticação
  const clearAuthData = () => {
    localStorage.removeItem('lovely.token');
    localStorage.removeItem('lovely.user');
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('pleasuregame.token');
  };

  // Carregar dados do usuário (perfil, assinatura, workspace)
  const loadUserData = async (userId: string) => {
    try {
      // Carregar perfil
      const profileResponse = await profileService.getProfile(userId);
      if (profileResponse.success && profileResponse.data) {
        setProfile(profileResponse.data);
      }

      // Carregar assinatura
      const subscriptionResponse = await subscriptionService.getUserSubscription(userId);
      if (subscriptionResponse.success && subscriptionResponse.data) {
        setSubscription(subscriptionResponse.data);
      }

      // Carregar workspace
      const workspaceResponse = await workspaceService.getWorkspace(userId);
      if (workspaceResponse.success && workspaceResponse.data) {
        setWorkspace(workspaceResponse.data);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    }
  };

  // Logout (apenas limpar dados locais)
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      clearAuthData();
      setUser(null);
      setProfile(null);
      setSubscription(null);
      setWorkspace(null);
      // Redirecionar para o sistema principal ou página de erro
      window.location.href = '/auth-required';
    }
  };

  // Atualizar perfil
  const updateProfile = async (profileData: Partial<Profile>) => {
    if (!user) throw new Error('Usuário não autenticado');

    try {
      const response = await profileService.updateProfile(user.id, profileData);
      
      if (response.success && response.data) {
        setProfile(response.data);
      } else {
        throw new Error(response.error || 'Erro ao atualizar perfil');
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  };

  // Recarregar dados do usuário
  const refreshUserData = async () => {
    if (!user) return;
    await loadUserData(user.id);
  };

  // Verificar se tem acesso a funcionalidade baseado no plano
  const hasFeatureAccess = (feature: string): boolean => {
    if (!subscription) return false;

    const planType = subscription.plan.type;
    
    const featureAccess = {
      'no-climinha': [
        'personalizacao-basica',
        'modo-guiado-limitado',
        'modo-selvagem-limitado',
        'jogos-simples'
      ],
      'modo-quente': [
        'personalizacao-completa',
        'modos-avancados',
        'jogos-classicos',
        'fantasias-limitadas',
        'conquistas-semanais',
        'presente-simples'
      ],
      'sem-freio': [
        'tudo-desbloqueado',
        'roleplay-narracao',
        'massagem-tantrica',
        'fantasias-ilimitadas',
        'conquistas-ilimitadas',
        'presente-premium',
        'acesso-antecipado'
      ]
    };

    return featureAccess[planType]?.includes(feature) || 
           (planType === 'sem-freio' && featureAccess[planType].includes('tudo-desbloqueado'));
  };

  // Verificar se é usuário premium
  const isPremium = (): boolean => {
    return subscription?.plan.type === 'sem-freio';
  };

  // Verificar se tem parceiro no workspace
  const hasPartner = (): boolean => {
    return workspace ? workspace.participants.length > 1 : false;
  };

  const value: AuthContextType = {
    user,
    profile,
    subscription,
    workspace,
    isAuthenticated: !!user,
    loading,
    login: async () => {
      throw new Error('Login deve ser feito no sistema principal');
    },
    logout,
    updateProfile,
    refreshUserData,
    initAuth,
    // Funções auxiliares
    hasFeatureAccess,
    isPremium,
    hasPartner
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
} 