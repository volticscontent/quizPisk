"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirecionar para /vendas em vez de renderizar o componente diretamente
    router.replace('/vendas');
  }, [router]);

  // Mostrar loading simples durante o redirect
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white">Carregando...</div>
    </div>
  );
}
