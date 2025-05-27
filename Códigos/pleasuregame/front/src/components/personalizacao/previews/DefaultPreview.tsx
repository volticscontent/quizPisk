"use client";

import { useState } from 'react';

interface DefaultPreviewProps {
  productName: string;
  selectedColor: string;
  selectedTemplate: number;
  selectedFeatures: string[];
}

export default function DefaultPreview({
  productName,
  selectedColor,
  selectedTemplate,
  selectedFeatures
}: DefaultPreviewProps) {
  const [isLoading] = useState(false);

  const renderFeatureBadges = () => {
    return (
      <div className="flex flex-wrap gap-2">
        {selectedFeatures.map((feature) => (
          <span
            key={feature}
            className="px-3 py-1 rounded-full text-sm"
            style={{ backgroundColor: `${selectedColor}20`, color: selectedColor }}
          >
            {feature}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden flex-1 flex flex-col">
        {/* Barra de navegação do produto */}
        <div 
          className="p-4 border-b border-neutral-800 flex items-center justify-between"
          style={{ backgroundColor: selectedColor + "10" }}
        >
          <div className="flex items-center">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center mr-3 text-white"
              style={{ backgroundColor: selectedColor }}
            >
              L
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-white">{productName}</span>
              <span className="text-xs text-neutral-400">Preview do Default</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <div className="w-2 h-2 rounded-full bg-neutral-700"></div>
            <div className="w-2 h-2 rounded-full bg-neutral-700"></div>
            <div className="w-2 h-2 rounded-full bg-neutral-700"></div>
          </div>
        </div>
        
        {/* Preview do template */}
        <div className="flex-1 flex items-center justify-center p-6 relative">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 text-neutral-500 mb-4">
                <div className="h-full w-full border-4 border-t-neutral-500 border-b-neutral-500 rounded-full"></div>
              </div>
              <p className="text-neutral-500">Atualizando preview...</p>
            </div>
          ) : (
            <>
              <div className="relative w-full max-w-lg aspect-[9/16] rounded-lg overflow-hidden border border-neutral-800">
                <div className="absolute inset-0 bg-neutral-800 opacity-10"></div>
                {/* Aqui seria a imagem real do template, mas usamos uma div colorida como placeholder */}
                <div 
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ backgroundColor: `${selectedColor}05` }}
                >
                  <div className="text-center p-4">
                    <div 
                      className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white"
                      style={{ backgroundColor: selectedColor }}
                    >
                      L
                    </div>
                    <h2 className="text-xl font-bold text-white">{productName}</h2>
                    <p className="text-neutral-400 mt-2">Template {selectedTemplate === 0 ? "Clássico" : selectedTemplate === 1 ? "Moderno" : "Minimalista"}</p>
                    
                    <div 
                      className="h-1 w-20 mx-auto my-4 rounded-full"
                      style={{ backgroundColor: selectedColor }}
                    ></div>
                    
                    <div className="mt-4">
                      {renderFeatureBadges()}
                      {selectedFeatures.length === 0 && (
                        <p className="text-neutral-500 text-sm">Nenhuma feature adicional selecionada</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Indicador de cor */}
              <div className="absolute bottom-4 right-4 bg-neutral-800 rounded-full px-3 py-1 text-sm flex items-center">
                <div 
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: selectedColor }}
                ></div>
                <span className="text-white">{selectedColor}</span>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Instruções */}
      <div className="mt-6 bg-neutral-900 rounded-lg border border-neutral-800 p-4">
        <h3 className="text-white font-medium mb-2">Como personalizar seu produto</h3>
        <ul className="text-sm text-neutral-400 space-y-2">
          <li className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Escolha a cor principal que será usada em todo o seu site
          </li>
          <li className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Selecione o template que melhor representa sua marca
          </li>
          <li className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Adicione features opcionais que podem melhorar a experiência dos visitantes
          </li>
          <li className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Clique em "Salvar" quando estiver satisfeito com as configurações
          </li>
        </ul>
      </div>
    </div>
  );
} 