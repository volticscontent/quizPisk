"use client";

import { useState } from 'react';
import Image from 'next/image';

interface PaymentStepProps {
  onComplete: () => void;
  selectedFeatures: string[];
}

export default function PaymentStep({ onComplete, selectedFeatures }: PaymentStepProps) {
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'pix' | null>(null);
  const [loading, setLoading] = useState(false);

  const basePrice = 29.90;
  const featurePrice = 5.00;
  const totalPrice = basePrice + (selectedFeatures.length * featurePrice);

  const handlePayment = async () => {
    if (!paymentMethod) return;

    setLoading(true);
    try {
      // Aqui você implementaria a integração com o gateway de pagamento
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulando processamento
      onComplete();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Resumo do pedido */}
        <div className="space-y-6">
          <div className="bg-neutral-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Resumo do Pedido</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-neutral-300">
                <span>Plano Base</span>
                <span>R$ {basePrice.toFixed(2)}</span>
              </div>
              {selectedFeatures.length > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-neutral-300">
                    <span>Features Adicionais</span>
                    <span>R$ {(selectedFeatures.length * featurePrice).toFixed(2)}</span>
                  </div>
                  <div className="pl-4 space-y-1">
                    {selectedFeatures.map(feature => (
                      <div key={feature} className="flex justify-between text-sm text-neutral-400">
                        <span>{feature}</span>
                        <span>R$ {featurePrice.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="pt-3 border-t border-neutral-700">
                <div className="flex justify-between text-white font-semibold">
                  <span>Total</span>
                  <span>R$ {totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Garantias */}
          <div className="bg-neutral-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Garantias</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="text-primary text-xl">✓</div>
                <div>
                  <p className="text-white font-medium">7 dias de garantia</p>
                  <p className="text-sm text-neutral-400">Devolução do dinheiro se não ficar satisfeito</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-primary text-xl">🔒</div>
                <div>
                  <p className="text-white font-medium">Pagamento Seguro</p>
                  <p className="text-sm text-neutral-400">Suas informações estão protegidas</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Métodos de pagamento */}
        <div className="space-y-6">
          <div className="bg-neutral-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Método de Pagamento</h3>
            <div className="space-y-4">
              <button
                onClick={() => setPaymentMethod('credit')}
                className={`w-full flex items-center justify-between p-4 rounded-lg border transition-colors ${
                  paymentMethod === 'credit'
                    ? 'border-primary bg-primary/10'
                    : 'border-neutral-700 bg-neutral-900 hover:bg-neutral-900/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">💳</div>
                  <div className="text-left">
                    <p className="text-white font-medium">Cartão de Crédito</p>
                    <p className="text-sm text-neutral-400">Visa, Mastercard, Elo</p>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${
                  paymentMethod === 'credit'
                    ? 'border-primary bg-primary'
                    : 'border-neutral-600'
                }`} />
              </button>

              <button
                onClick={() => setPaymentMethod('pix')}
                className={`w-full flex items-center justify-between p-4 rounded-lg border transition-colors ${
                  paymentMethod === 'pix'
                    ? 'border-primary bg-primary/10'
                    : 'border-neutral-700 bg-neutral-900 hover:bg-neutral-900/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🔄</div>
                  <div className="text-left">
                    <p className="text-white font-medium">PIX</p>
                    <p className="text-sm text-neutral-400">Pagamento instantâneo</p>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${
                  paymentMethod === 'pix'
                    ? 'border-primary bg-primary'
                    : 'border-neutral-600'
                }`} />
              </button>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={!paymentMethod || loading}
            className="w-full py-4 px-6 bg-primary text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
          >
            {loading ? 'Processando...' : 'Finalizar Compra'}
          </button>

          <p className="text-center text-sm text-neutral-400">
            Ao finalizar a compra você concorda com nossos{' '}
            <a href="#" className="text-primary hover:underline">termos de uso</a>
          </p>
        </div>
      </div>
    </div>
  );
} 