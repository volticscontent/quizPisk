'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Play, 
  Search, 
  Trophy, 
  Gift, 
  User, 
  Crown, 
  Zap, 
  Flame,
  Star,
  Calendar,
  Heart,
  Target
} from 'lucide-react';

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const { user, profile, subscription, loading, isAuthenticated } = useAuth();
  const [pageLoading, setPageLoading] = useState(true);

  const userId = params.userId as string;
  const plan = params.plan as string;

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth-required');
      return;
    }

    // Verificar se o userId da URL corresponde ao usuário logado
    if (user && user.id !== userId) {
      router.push('/auth-required');
      return;
    }

    // Verificar se o plano da URL corresponde ao plano do usuário
    if (user && subscription) {
      const userPlan = subscription.plan?.type || 'no-climinha';
      if (plan !== userPlan) {
        router.push(`/${user.id}/${userPlan}`);
        return;
      }
    }

    if (user && subscription) {
      setPageLoading(false);
    }
  }, [user, subscription, loading, isAuthenticated, router, userId, plan]);

  const getPlanIcon = (planType: string) => {
    switch (planType) {
      case 'no-climinha': return <Crown className="h-5 w-5 text-green-400" />;
      case 'modo-quente': return <Zap className="h-5 w-5 text-orange-400" />;
      case 'sem-freio': return <Flame className="h-5 w-5 text-red-400" />;
      default: return <Star className="h-5 w-5 text-red-400" />;
    }
  };

  const getPlanColor = (planType: string) => {
    switch (planType) {
      case 'no-climinha': return 'from-green-500 to-emerald-600';
      case 'modo-quente': return 'from-orange-500 to-red-500';
      case 'sem-freio': return 'from-red-500 to-pink-600';
      default: return 'from-red-500 to-pink-600';
    }
  };

  const getPlanDisplayName = () => {
    if (!subscription?.plan?.name) return 'Sem Freio';
    return subscription.plan.name;
  };

  const navigateToGames = () => {
    router.push(`/${userId}/${plan}/jogos`);
  };

  const navigateToFantasies = () => {
    router.push(`/${userId}/${plan}/fantasias`);
  };

  const navigateToAchievements = () => {
    router.push(`/${userId}/${plan}/conquistas`);
  };

  const navigateToGifts = () => {
    router.push(`/${userId}/${plan}/presentes`);
  };

  if (loading || pageLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 gradient-warm opacity-10"></div>
        <div className="text-center relative z-10">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-gray-800 border-t-red-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-600/20 to-orange-500/20 animate-pulse"></div>
          </div>
          <p className="text-white text-lg font-medium">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 gradient-warm opacity-5"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(220, 38, 38, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(220, 38, 38, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          opacity: 0.3
        }}></div>
      </div>

      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-sm border-b border-red-600/30 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">
                <span className="gradient-warm-text">Dashboard</span>
              </h1>
              <span className="px-3 py-1 bg-red-600/20 text-red-400 rounded-lg text-sm font-medium border border-red-600/30">
                {plan === 'no-climinha' ? 'No Climinha' : 
                 plan === 'modo-quente' ? 'Modo Quente' : 
                 plan === 'sem-freio' ? 'Sem Freio' : plan}
              </span>
            </div>
            <div className="text-white text-sm">
              Bem-vindo, {user?.name}!
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Olá, {user?.name}! 👋
          </h2>
          <p className="text-gray-300 text-lg">
            Pronto para uma nova aventura? Escolha uma das opções abaixo para começar.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <button
            onClick={navigateToGames}
            className="card-dark border-red-600/30 hover:border-red-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20 group"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-red-600/20 rounded-lg group-hover:bg-red-600/30 transition-colors">
                <Play className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Iniciar Jogo</h3>
                <p className="text-gray-400 text-sm">Comece uma nova sessão</p>
              </div>
            </div>
          </button>

          <button
            onClick={navigateToFantasies}
            className="card-dark border-red-600/30 hover:border-red-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20 group"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-purple-600/20 rounded-lg group-hover:bg-purple-600/30 transition-colors">
                <Search className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Explorar Fantasias</h3>
                <p className="text-gray-400 text-sm">Descubra novas experiências</p>
              </div>
            </div>
          </button>

          <button
            onClick={navigateToAchievements}
            className="card-dark border-red-600/30 hover:border-red-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20 group"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-yellow-600/20 rounded-lg group-hover:bg-yellow-600/30 transition-colors">
                <Trophy className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Conquistas</h3>
                <p className="text-gray-400 text-sm">Veja seus progressos</p>
              </div>
            </div>
          </button>

          <button
            onClick={navigateToGifts}
            className="card-dark border-red-600/30 hover:border-red-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20 group"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-green-600/20 rounded-lg group-hover:bg-green-600/30 transition-colors">
                <Gift className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Presentes</h3>
                <p className="text-gray-400 text-sm">Surpresas especiais</p>
              </div>
            </div>
          </button>
        </div>

        {/* Profile Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card-dark border-red-600/30">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                <User className="h-5 w-5 text-red-400" />
                <span>Seu Perfil</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-400 text-sm">Nome</label>
                    <p className="text-white font-medium">{user?.name}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Email</label>
                    <p className="text-white font-medium">{user?.email}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Plano Atual</label>
                    <div className="flex items-center space-x-2">
                      {getPlanIcon(plan)}
                      <span className="text-white font-medium">{getPlanDisplayName()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {profile && (
                    <>
                      <div>
                        <label className="text-gray-400 text-sm">Humor Atual</label>
                        <div className="flex items-center space-x-2">
                          <Heart className="h-4 w-4 text-pink-400" />
                          <span className="text-white font-medium capitalize">
                            {profile.mood || 'Não definido'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm">Nível de Ousadia</label>
                        <div className="flex items-center space-x-2">
                          <Target className="h-4 w-4 text-orange-400" />
                          <span className="text-white font-medium">
                            {profile.boldnessLevel || 'Não definido'}
                          </span>
                        </div>
                      </div>
                      {profile.partnerName && (
                        <div>
                          <label className="text-gray-400 text-sm">Parceiro(a)</label>
                          <p className="text-white font-medium">{profile.partnerName}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Info */}
          <div className="space-y-6">
            <div className="card-dark border-red-600/30">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                {getPlanIcon(plan)}
                <span>Sua Assinatura</span>
              </h3>
              
              <div className="space-y-4">
                <div className={`p-4 rounded-lg bg-gradient-to-r ${getPlanColor(plan)} bg-opacity-20 border border-red-600/30`}>
                  <h4 className="text-white font-semibold text-lg">{getPlanDisplayName()}</h4>
                  <p className="text-gray-300 text-sm mt-1">
                    {subscription?.status === 'active' ? 'Ativo' : 'Inativo'}
                  </p>
                </div>
                
                {subscription?.endDate && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">
                      Expira em: {new Date(subscription.endDate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card-dark border-red-600/30">
              <h3 className="text-xl font-semibold text-white mb-4">Estatísticas</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Jogos Jogados</span>
                  <span className="text-white font-semibold">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Conquistas</span>
                  <span className="text-white font-semibold">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Tempo Total</span>
                  <span className="text-white font-semibold">0h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 