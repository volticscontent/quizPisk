"use client";

import React from 'react';
import { Check, X, ChevronRight, Star, Trophy } from 'lucide-react';
import StarsBackground from './plans/StarsBackground';
import HoverBorderGradient from './plans/HoverBorderGradient';
import Link from 'next/link';

interface Feature {
  text: string;
  highlight: boolean;
  negative?: boolean;
}

interface Plan {
  id: string;
  name: string;
  displayName: string;
  subtitle: string;
  price: number;
  period: string;
  recommended?: boolean;
  badge?: string;
  buttonText: string;
  paymentUrl: string;
  features: Feature[];
}

const plans: Plan[] = [
  {
    id: 'climinha',
    name: "No Climinha",
    displayName: "PLANO BÁSICO",
    subtitle: "Para quem quer experimentar e sentir o gostinho da brincadeira.",
    price: 47.90,
    period: "por mês",
    recommended: false,
    buttonText: "Começar com leveza",
    paymentUrl: "https://lastlink.com/p/C96F9CEEA/checkout-payment",
    features: [
      { text: "Personalização inteligente (básica)", highlight: true },
      { text: "Modo Exploração Guiada (limitado)", highlight: true },
      { text: "Modo Selvagem (limitado)", highlight: true },
      { text: "Jogos Clássicos: Verdade ou Desafio, Roleta do Desejo", highlight: true },
      { text: "Sem Roleplay", highlight: false, negative: true },
      { text: "Sem Massagem Tântrica", highlight: false, negative: true },
      { text: "Sem Cartas da Conexão", highlight: false, negative: true },
      { text: "Sem Fantasias Secretas", highlight: false, negative: true },
      { text: "Sem Conquistas", highlight: false, negative: true },
      { text: "Sem Presente Digital", highlight: false, negative: true }
    ]
  },
  {
    id: 'quente',
    name: "Modo Quente",
    displayName: "PLANO INTERMEDIÁRIO",
    subtitle: "Para casais que querem se provocar, se divertir e se reconectar.",
    price: 57.90,
    period: "por mês",
    recommended: true,
    badge: "🔥 Mais vendido",
    buttonText: "Escolher essa experiência",
    paymentUrl: "https://lastlink.com/p/C7EDA5C42/checkout-payment",
    features: [
      { text: "Personalização inteligente completa", highlight: true },
      { text: "Modos Exploração Guiada e Selvagem (versões completas)", highlight: true },
      { text: "Jogos Clássicos: Verdade ou Desafio, Roleta, Strip Quiz, Dados Digitais, Mímica Proibida, Cartas Eróticas (acesso completo)", highlight: true },
      { text: "Fantasias Secretas (limite de 2 por semana)", highlight: true },
      { text: "Cartas da Conexão + Jogo \"10 Dates para se Conectar\"", highlight: true },
      { text: "Sistema de conquistas (1 desbloqueio por semana)", highlight: true },
      { text: "Presente Digital (cartão simples com mensagem personalizada)", highlight: true },
      { text: "Sem Modo Roleplay com narração", highlight: false, negative: true },
      { text: "Sem Massagem Tântrica", highlight: false, negative: true },
      { text: "Sem fantasias ilimitadas", highlight: false, negative: true },
      { text: "Sem bônus futuros ou conteúdo premium exclusivo", highlight: false, negative: true }
    ]
  },
  {
    id: 'sem_freio',
    name: "Sem Freio",
    displayName: "PLANO PREMIUM",
    subtitle: "Para casais que querem explorar todos os sentidos sem censura.",
    price: 77.90,
    period: "por mês",
    recommended: false,
    badge: "💎 Tudo desbloqueado",
    buttonText: "Quero tudo desbloqueado",
    paymentUrl: "https://lastlink.com/p/C468F4080/checkout-payment",
    features: [
      { text: "Tudo incluso do plano Modo Quente", highlight: false },
      { text: "Modo Roleplay com narração (histórias guiadas + fantasias ativas)", highlight: true },
      { text: "Guia de Massagem Tântrica completo (iniciante, intermediário e avançado)", highlight: true },
      { text: "Fantasias Secretas ilimitadas", highlight: true },
      { text: "Conquistas e progressões sem limite", highlight: true },
      { text: "Presente Digital com cartão premium animado", highlight: true },
      { text: "Acesso antecipado a novos modos, cartas e atualizações futuras", highlight: true }
    ]
  }
];

export default function PlansSection() {
  return (
    <div id="plans" className="relative w-full rounded-md overflow-hidden">
      <StarsBackground />
      <div className="flex items-center flex-col justify-center gap-16 px-2 md:px-10 py-8 w-full h-full relative">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-white text-3xl md:text-5xl font-bold text-center">
            Escolha Seu Plano
          </h2>
          <p className="text-neutral-300 text-center mt-2 text-lg">
            Desperte a paixão e transforme sua intimidade com jogos únicos e experiências inesquecíveis
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 relative z-[1000] max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={plan.id} 
              className={`w-full bg-transparent ${plan.recommended ? 'lg:scale-105 lg:z-10' : ''}`}
            >
              <button className={`relative flex border content-center hover:bg-black/10 transition dark:bg-white/20 items-center flex-col flex-nowrap gap-10 h-min justify-center overflow-visible p-px decoration-clone rounded-xl w-full transform duration-200 ${plan.recommended ? 'bg-gradient-to-br from-red-500/20 to-pink-500/20 border-red-500/50' : 'bg-neutral-900'}`}>
                <div className="text-white z-10 rounded-[inherit] relative py-6 px-6 w-full text-left cursor-pointer bg-neutral-950 transform duration-200">
                  
                  {/* Badge */}
                  {plan.badge && (
                    <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white text-xs gap-1 font-semibold flex items-center rounded-full px-3 py-1 z-50 absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Trophy size={12} fill="currentColor" />
                      <p>{plan.badge}</p>
                    </div>
                  )}

                  {/* Header */}
                  <div className="w-full">
                    <p className="text-xs font-semibold text-red-400 uppercase tracking-wider">
                      {plan.displayName}
                    </p>
                    <p className="text-2xl font-bold relative z-20 text-left text-white mt-1">
                      {plan.name}
                    </p>
                    <p className="text-sm text-neutral-400 mt-1">
                      {plan.subtitle}
                    </p>
                  </div>

                  {/* Preço */}
                  <div className="mt-6 mb-6">
                    <p className="text-3xl font-black text-white">
                      R$ {plan.price.toFixed(2).replace('.', ',')}
                      <span className="font-light text-sm text-neutral-300 ml-1">/{plan.period}</span>
                    </p>
                  </div>

                  {/* Features */}
                  <div className="text-neutral-200 relative z-20">
                    <ul className="list-none space-y-2">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex gap-3 items-start">
                          <div className={`flex items-center justify-center ${feature.negative ? 'text-red-600 bg-red-100' : 'text-green-600 bg-green-100'} rounded-full h-4 w-4 mt-0.5 flex-shrink-0`}>
                            {feature.negative ? <X size={12} /> : <Check size={12} />}
                          </div>
                          <p className={`text-neutral-300 text-sm leading-relaxed ${feature.highlight ? 'font-semibold text-white' : ''}`}>
                            {feature.text}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Botão */}
                  <Link
                    href={plan.paymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-4 py-3 mt-8 w-full transition duration-200 flex items-center justify-center cursor-pointer rounded-lg font-semibold text-sm shadow-[0px_2px_0px_0px_#FFFFFF40_inset] ${
                      plan.recommended 
                        ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white' 
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                  >
                    {plan.buttonText}
                    <ChevronRight size={18} className="ml-2" />
                  </Link>
                </div>

                <HoverBorderGradient />
                <div className="bg-black absolute z-1 flex-none inset-[2px] rounded-[100px]" />
              </button>
            </div>
          ))}
        </div>

        {/* Garantia */}
        <div className="text-center mt-8">
          <p className="text-neutral-400 text-sm">
            ✨ Garantia de 7 dias • 🔒 Pagamento 100% seguro • 🎯 Suporte especializado
          </p>
        </div>
      </div>
    </div>
  );
} 