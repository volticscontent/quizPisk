"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function ValorSection() {
  return (
    <section className="py-24 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-black"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 mb-8"
          >
            <span className="text-red-400 text-sm">🗝️ Mais que um app</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-white mb-8"
          >
            Uma experiência que combina conexão, prazer e surpresa.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl mx-auto"
          >
            <p className="text-xl text-neutral-400 mb-2">
              Não é só mais um joguinho.
            </p>
            <p className="text-xl text-neutral-300">
              É um convite para quebrar a rotina, explorar o desejo e criar memórias marcantes juntos.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-12"
          >
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-red-500/20 to-transparent mx-auto"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 