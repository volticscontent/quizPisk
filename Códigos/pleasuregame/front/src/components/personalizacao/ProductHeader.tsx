"use client";

import Link from 'next/link';

interface ProductHeaderProps {
  saving: boolean;
  onSave: () => void;
  onReset: () => void;
  type: 'netflix' | 'default';
}

export default function ProductHeader({ saving, onSave, onReset, type }: ProductHeaderProps) {
  return (
    <header className="bg-neutral-900 border-b border-neutral-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/personalizacao" className="text-white hover:text-red-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-white">
            {type === 'netflix' ? 'Personalizar Página Netflix' : 'Personalizar Página'}
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={onReset}
            className="px-4 py-2 text-white hover:text-red-400 transition-colors"
          >
            Restaurar padrão
          </button>
          
          <button
            onClick={onSave}
            disabled={saving}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </header>
  );
} 