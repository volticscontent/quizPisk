import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Configuração para resolver problemas de redirecionamento
  trailingSlash: false,
  output: 'standalone',
  
  // Otimizações de imagem
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Configuração para evitar problemas de hidratação
  experimental: {
    optimizePackageImports: ['react', 'react-dom'],
  },

  // Headers para melhor cache e segurança
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ];
  },

  // Configuração para evitar redirects desnecessários
  async redirects() {
    return [];
  },

  // Configuração para rewrite se necessário
  async rewrites() {
    return [];
  },
};

export default nextConfig;
