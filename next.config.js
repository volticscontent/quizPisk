/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração otimizada para Vercel
  experimental: {
    // Server Actions são habilitados por padrão no Next.js 15
    // Removido serverActions: true para compatibilidade
  },
  // Otimizações para Edge Runtime
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  // Headers para SSE
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Connection',
            value: 'keep-alive',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig 