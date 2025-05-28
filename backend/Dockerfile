# ===========================================
# DOCKERFILE OTIMIZADO PARA PRODUÇÃO
# ===========================================

FROM node:18-alpine

# Instalar dependências básicas incluindo OpenSSL para Prisma
RUN apk add --no-cache curl openssl

# Criar diretório de trabalho
WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Copiar schema do Prisma
COPY prisma ./prisma/

# Instalar dependências
RUN npm install && npm cache clean --force

# Copiar código
COPY server.js ./

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expor porta
EXPOSE 3333

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3333/health || exit 1

# Iniciar aplicação
CMD ["node", "server.js"] 