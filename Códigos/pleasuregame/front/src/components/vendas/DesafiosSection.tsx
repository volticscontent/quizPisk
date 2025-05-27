"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const challenges = [
  {
    question: "Você toparia um desafio de dominação com tempo cronometrado?",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mb-4 text-red-500">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z" fill="currentColor"/>
        <path d="M12.5 7V12.25L17 14.92L16.25 16.15L11 13V7H12.5Z" fill="currentColor"/>
      </svg>
    ),
    gradient: "from-red-500/20 via-red-500/10 to-transparent"
  },
  {
    question: "Já imaginou realizar uma fantasia sem que seu parceiro saiba qual você escolheu?",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mb-4 text-red-500">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
        <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.5"/>
      </svg>
    ),
    gradient: "from-pink-500/20 via-pink-500/10 to-transparent"
  },
  {
    question: "E se uma narração envolvente conduzisse vocês por um cenário quente e provocante?",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mb-4 text-red-500">
        <path d="M12 3V13.55C11.41 13.21 10.73 13 10 13C7.79 13 6 14.79 6 17C6 19.21 7.79 21 10 21C12.21 21 14 19.21 14 17V7H18V3H12ZM10 19C8.9 19 8 18.1 8 17C8 15.9 8.9 15 10 15C11.1 15 12 15.9 12 17C12 18.1 11.1 19 10 19Z" fill="currentColor"/>
      </svg>
    ),
    gradient: "from-purple-500/20 via-purple-500/10 to-transparent"
  }
];

export default function DesafiosSection() {
  return (
    <section className="py-24 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-black"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {challenges.map((challenge, index) => (
            <motion.div
              key={challenge.question}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group"
            >
              <div className={`h-full bg-gradient-to-b ${challenge.gradient} p-8 rounded-2xl border border-white/5 backdrop-blur-sm hover:border-red-500/20 transition-all duration-300`}>
                <div className="flex flex-col items-start">
                  {challenge.icon}
                  <h3 className="text-2xl font-semibold text-white mb-4 group-hover:text-red-400 transition-colors">
                    {challenge.question}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link 
            href="#planos"
            className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-red-600 to-red-800 text-white font-semibold text-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-red-500/25"
          >
            Quero quebrar a rotina
          </Link>
        </div>
      </div>
    </section>
  );
} 