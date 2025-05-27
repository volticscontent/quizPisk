"use client";

import React from 'react';
import { motion } from 'framer-motion';

const GameModeCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="relative group bg-black rounded-xl p-6 border border-white/5 hover:border-red-500/20 transition-all duration-300"
  >
    <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
    <div className="relative z-10">
      <div className="text-red-500 w-12 h-12 mb-4">{icon}</div>
      <h3 className="text-white text-lg font-semibold mb-2">{title}</h3>
      <p className="text-neutral-400 text-sm">{description}</p>
    </div>
  </motion.div>
);

const gameModes = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z" fill="currentColor"/>
        <path d="M12 7L9 13H15L12 7Z" fill="currentColor"/>
        <path d="M12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z" fill="currentColor"/>
      </svg>
    ),
    title: "Exploração Guiada",
    description: "Perguntas íntimas e toques sugeridos em um roteiro que esquenta aos poucos."
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 18.5C15.5899 18.5 18.5 15.5899 18.5 12C18.5 8.41015 15.5899 5.5 12 5.5C8.41015 5.5 5.5 8.41015 5.5 12C5.5 15.5899 8.41015 18.5 12 18.5Z" stroke="currentColor" strokeWidth="2"/>
        <path d="M8.5 14L12 7L15.5 14H8.5Z" fill="currentColor"/>
        <path d="M19.14 12.94C19.18 12.64 19.2 12.33 19.2 12C19.2 11.67 19.18 11.36 19.14 11.06L21.16 9.48C21.34 9.34 21.39 9.07 21.28 8.85L19.36 5.55C19.24 5.33 18.99 5.26 18.77 5.33L16.38 6.29C15.88 5.91 15.35 5.59 14.76 5.35L14.4 2.81C14.36 2.57 14.16 2.4 13.92 2.4H10.08C9.84 2.4 9.65 2.57 9.61 2.81L9.25 5.35C8.66 5.59 8.12 5.91 7.62 6.29L5.23 5.33C5.01 5.26 4.76 5.33 4.64 5.55L2.72 8.85C2.6 9.07 2.66 9.34 2.84 9.48L4.86 11.06C4.82 11.36 4.8 11.67 4.8 12C4.8 12.33 4.82 12.64 4.86 12.94L2.84 14.52C2.66 14.66 2.6 14.93 2.72 15.15L4.64 18.45C4.76 18.67 5.01 18.74 5.23 18.67L7.62 17.71C8.12 18.09 8.66 18.41 9.25 18.65L9.61 21.19C9.65 21.43 9.84 21.6 10.08 21.6H13.92C14.16 21.6 14.36 21.43 14.4 21.19L14.76 18.65C15.35 18.41 15.88 18.09 16.38 17.71L18.77 18.67C18.99 18.74 19.24 18.67 19.36 18.45L21.28 15.15C21.39 14.93 21.34 14.66 21.16 14.52L19.14 12.94Z" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    title: "Modo Selvagem",
    description: "Desafios ousados com tempo cronometrado e comandos de poder."
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 3H3C1.9 3 1 3.9 1 5V19C1 20.1 1.9 21 3 21H21C22.1 21 23 20.1 23 19V5C23 3.9 22.1 3 21 3ZM21 19H3V5H21V19Z" fill="currentColor"/>
        <path d="M15 10C16.1046 10 17 9.10457 17 8C17 6.89543 16.1046 6 15 6C13.8954 6 13 6.89543 13 8C13 9.10457 13.8954 10 15 10Z" fill="currentColor"/>
        <path d="M9 8C10.1046 8 11 7.10457 11 6C11 4.89543 10.1046 4 9 4C7.89543 4 7 4.89543 7 6C7 7.10457 7.89543 8 9 8Z" fill="currentColor"/>
        <path d="M9 16C10.1046 16 11 15.1046 11 14C11 12.8954 10.1046 12 9 12C7.89543 12 7 12.8954 7 14C7 15.1046 7.89543 16 9 16Z" fill="currentColor"/>
        <path d="M15 18C16.1046 18 17 17.1046 17 16C17 14.8954 16.1046 14 15 14C13.8954 14 13 14.8954 13 16C13 17.1046 13.8954 18 15 18Z" fill="currentColor"/>
      </svg>
    ),
    title: "Roleplay com Narração",
    description: "Escolha um cenário. Viva uma história erótica guiada por áudio ou texto."
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.5 3H4.5C3.67 3 3 3.67 3 4.5V19.5C3 20.33 3.67 21 4.5 21H19.5C20.33 21 21 20.33 21 19.5V4.5C21 3.67 20.33 3 19.5 3ZM19.5 19.5H4.5V4.5H19.5V19.5Z" fill="currentColor"/>
        <path d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" fill="currentColor"/>
        <path d="M12 9L13.5 12H10.5L12 9Z" fill="currentColor"/>
      </svg>
    ),
    title: "Jogos Clássicos Hot",
    description: "Versões adultas de Roleta, Strip Quiz, Dados do Amor, Mímica e mais."
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
        <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.5"/>
        <path d="M12 22V17.77M12 2V8.26" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    title: "Fantasias Secretas",
    description: "O app revela apenas o que vocês dois estão prontos para explorar juntos."
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z" fill="currentColor"/>
        <path d="M12 12C13.1046 12 14 11.1046 14 10C14 8.89543 13.1046 8 12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12Z" fill="white"/>
      </svg>
    ),
    title: "Massagem Tântrica Guiada",
    description: "Ritual de conexão com toque, ritmo e prazer consciente."
  }
];

export default function ComoFuncionaSection() {
  return (
    <section className="relative py-24 bg-black overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black"></div>
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Conheça os jogos que vão transformar sua relação
          </h2>
          
          {/* Advertorial Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/10 to-red-500/10 border border-red-500/20"
          >
            <span className="text-red-400 text-sm">
              Interface adaptada para casais hetero, LGBTQIA+ e não monogâmicos
            </span>
          </motion.div>
        </div>

        {/* Game Modes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gameModes.map((mode, index) => (
            <motion.div
              key={mode.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GameModeCard {...mode} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 