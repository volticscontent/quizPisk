'use client';

export default function AuthRequiredPage() {
  const handleGoToMainSystem = () => {
    // Redirecionar para o sistema principal onde o login é feito
    window.location.href = 'http://localhost:3000'; // ou a URL do seu sistema principal
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Gradiente de fundo quente */}
      <div className="absolute inset-0 gradient-warm opacity-5"></div>
      
      <div className="max-w-md w-full text-center relative z-10">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            <span className="gradient-warm-text">LovelyApp</span>
          </h1>
          <p className="text-gray-300">Sua jornada íntima começa aqui 💕</p>
        </div>

        {/* Auth Required Message */}
        <div className="card-dark border-red-600/30">
          <div className="text-6xl mb-6">🔐</div>
          
          <h2 className="text-2xl font-bold text-white mb-4">
            Autenticação Necessária
          </h2>
          
          <p className="text-gray-300 mb-6 leading-relaxed">
            Para acessar o LovelyApp, você precisa estar logado no sistema principal. 
            Faça login primeiro e depois retorne através do link fornecido.
          </p>

          <div className="space-y-4">
            <button
              onClick={handleGoToMainSystem}
              className="btn-gradient w-full py-3 font-medium rounded-lg"
            >
              Ir para o Sistema Principal
            </button>
            
            <button
              onClick={() => window.history.back()}
              className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-lg transition-colors border border-gray-600"
            >
              Voltar
            </button>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-6 card-dark border-gray-700">
          <h3 className="text-red-400 font-medium mb-2">Como acessar:</h3>
          <div className="text-sm text-gray-300 space-y-1 text-left">
            <p>1. Faça login no sistema principal</p>
            <p>2. Acesse o LovelyApp através do link fornecido</p>
            <p>3. Aproveite sua experiência íntima!</p>
          </div>
        </div>
      </div>
    </div>
  );
} 