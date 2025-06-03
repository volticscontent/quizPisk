"use client";

import React from 'react';
import { Check, X, ChevronRight, Star } from 'lucide-react';
import StarsBackground from './plans/StarsBackground';
import HoverBorderGradient from './plans/HoverBorderGradient';
import Link from 'next/link';

interface Feature {
  text: string;
  highlight: boolean;
  negative?: boolean;
}

interface Plan {
  name: string;
  price: number;
  originalPrice: number;
  period: string;
  recommended?: boolean;
  features: Feature[];
}

const plans: Plan[] = [
  {
    name: "Para sempre",
    price: 27,
    originalPrice: 54,
    period: "uma vez",
    recommended: true,
    features: [
      { text: "Texto dedicado", highlight: false },
      { text: "Contador em tempo real", highlight: true },
      { text: "Data de início", highlight: false },
      { text: "QR Code exclusivo", highlight: true },
      { text: "Máximo de 8 imagens", highlight: false },
      { text: "Com música", highlight: true },
      { text: "Fundo dinâmico", highlight: false },
      { text: "Com animações exclusivas", highlight: true },
      { text: "URL personalizada", highlight: false },
      { text: "Suporte 24 horas", highlight: true }
    ]
  },
  {
    name: "Anual",
    price: 17,
    originalPrice: 34,
    period: "por ano",
    features: [
      { text: "Texto dedicado", highlight: false },
      { text: "Contador em tempo real", highlight: true },
      { text: "Data de início", highlight: false },
      { text: "QR Code exclusivo", highlight: true },
      { text: "Máximo de 4 imagens", highlight: false },
      { text: "Sem música", highlight: true, negative: true },
      { text: "Sem fundo dinâmico", highlight: false, negative: true },
      { text: "Sem animações exclusivas", highlight: true, negative: true },
      { text: "URL personalizada", highlight: false },
      { text: "Suporte 24 horas", highlight: true }
    ]
  }
];

export default function PlansSection() {
  return (
    <div id="plans" className="relative w-full rounded-md overflow-hidden">
      <StarsBackground />
      <div className="flex items-center flex-col justify-center gap-16 px-2 md:px-10 py-8 w-full h-full relative">
        <div className="mx-auto max-w-xl">
          <h2 className="text-white text-3xl md:text-5xl font-bold text-center">
            Nossos Planos
          </h2>
          <p className="text-neutral-300 text-center mt-2">
            Escolha o plano ideal para sua página personalizada. Você pode escolher entre os planos abaixo.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 relative z-[1000]">
          {plans.map((plan, index) => (
            <div key={index} className="w-full bg-black">
              <button className="relative flex border content-center hover:bg-black/10 transition dark:bg-white/20 items-center flex-col flex-nowrap gap-10 h-min justify-center overflow-visible p-px decoration-clone rounded-xl w-full transform duration-200 bg-neutral-900">
                <div className="text-white z-10 rounded-[inherit] relative py-6 px-8 w-full text-left cursor-pointer bg-neutral-950 transform duration-200">
                  <div className="w-full">
                    <p className="text-3xl font-bold relative z-20 text-left text-white mt-4">
                      {plan.name}
                    </p>
                    <div className="text-neutral-200 relative z-20">
                      <ul className="list-none mt-4">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex gap-2 items-center mb-1">
                            <div className={`flex items-center justify-center ${feature.negative ? 'text-red-600 bg-red-100' : 'text-green-600 bg-green-100'} rounded-full h-4 w-4`}>
                              {feature.negative ? <X size={14} /> : <Check size={14} />}
                            </div>
                            <p className={`text-neutral-300 text-sm ${feature.highlight ? 'font-bold' : 'undefined'}`}>
                              {feature.text}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {plan.recommended && (
                    <div className="bg-black text-yellow-500 text-sm gap-1 font-semibold flex items-center rounded-full px-2 py-[2px] z-50 absolute -top-3">
                      <Star size={12} fill="currentColor" />
                      <p>Recomendado</p>
                    </div>
                  )}

                  <div className="mt-8">
                    <p className="text-xl font-black text-red-600 line-through">
                      R$&nbsp;{plan.originalPrice},00
                    </p>
                    <p className="text-3xl font-black text-white">
                      R$&nbsp;{plan.price},00 <span className="font-light text-xs text-neutral-300">/{plan.period}</span>
                    </p>
                  </div>

                  <Link
                    href="/personalizacao"
                    className="px-4 py-3 mt-8 bg-red-600 hover:bg-red-700 w-full transition duration-200 flex items-center justify-between cursor-pointer rounded-lg text-white font-semibold text-sm shadow-[0px_2px_0px_0px_#FFFFFF40_inset]"
                  >
                    Personalizar agora
                    <ChevronRight size={20} />
                  </Link>
                </div>

                <HoverBorderGradient />
                <div className="bg-black absolute z-1 flex-none inset-[2px] rounded-[100px]" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 