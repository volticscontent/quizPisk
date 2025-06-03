"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirecionar automaticamente para a página de vendas
    router.push("/vendas");
  }, [router]);

  // Retornar uma página de carregamento enquanto o redirecionamento acontece
  return (
    <div className="h-screen w-full flex items-center justify-center bg-black">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-primary border-solid rounded-full border-t-transparent animate-spin mb-4"></div>
        <p className="text-white text-xl">Redirecionando...</p>
      </div>
    </div>
  );
}
