# Deploy Backend PleasureGame na Hostinger via Docker

## Guia para Deploy Apenas do Backend

Este guia detalha como fazer o deploy apenas do backend do PleasureGame na Hostinger usando Docker.

## Pré-requisitos

### VPS Hostinger
- **Plano mínimo**: KVM 1 (1 vCPU, 4GB RAM, 50GB SSD)
- **Sistema Operacional**: Ubuntu 22.04 LTS
- **Acesso SSH** configurado
- **IP do VPS**: `31.97.15.106`

### Domínio (Opcional)
- Se tiver domínio: `api.seu-dominio.com` → `31.97.15.106`
- Sem domínio: usar diretamente o IP `31.97.15.106:3333`

## Configuração do VPS

### 1. Acesso SSH

```bash
# Conectar ao VPS
ssh root@31.97.15.106

# Atualizar sistema
apt update && apt upgrade -y
```

### 2. Instalação do Docker

```bash
# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Instalar Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Verificar instalação
docker --version
docker-compose --version
```

### 3. Configuração de Firewall

```bash
# Configurar UFW
ufw allow ssh
ufw allow 3333  # Backend API
ufw --force enable
```

## Estrutura do Projeto

```bash
# Criar estrutura no VPS
mkdir -p /opt/pleasuregame-backend
cd /opt/pleasuregame-backend

# Estrutura final:
# /opt/pleasuregame-backend/
# ├── backend/
# ├── docker-compose.yml
# └── .env
```

## Configuração Docker

### 1. Docker Compose Simplificado

Criar `/opt/pleasuregame-backend/docker-compose.yml`:

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: pleasuregame_postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - backend_network
    ports:
      - "5432:5432"  # Expor para debug se necessário
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: pleasuregame_redis
    restart: unless-stopped
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    networks:
      - backend_network
    ports:
      - "6379:6379"  # Expor para debug se necessário
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD}", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: pleasuregame_backend
    restart: unless-stopped
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379
      JWT_SECRET: ${JWT_SECRET}
      LASTLINK_API_KEY: ${LASTLINK_API_KEY}
      LASTLINK_WEBHOOK_SECRET: ${LASTLINK_WEBHOOK_SECRET}
      LASTLINK_WEBHOOK_URL: ${LASTLINK_WEBHOOK_URL}
      SERVER_IP: ${SERVER_IP}
      PORT: 3333
      CORS_ORIGIN: ${CORS_ORIGIN}
    ports:
      - "3333:3333"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - ./backend/uploads:/app/uploads
      - ./backend/logs:/app/logs
    networks:
      - backend_network
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3333/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  postgres_data:
  redis_data:

networks:
  backend_network:
    driver: bridge
```

### 2. Arquivo de Ambiente

Criar `/opt/pleasuregame-backend/.env`:

```bash
# Servidor
SERVER_IP=31.97.15.106
CORS_ORIGIN=http://localhost:3000,http://localhost:3001,http://192.168.1.100:3000,http://31.97.15.106:3000

# Database
POSTGRES_DB=pleasuregame_prod
POSTGRES_USER=pleasuregame_user
POSTGRES_PASSWORD=PleasureGame2024!@#

# Redis
REDIS_PASSWORD=RedisPleasure2024!@#

# JWT
JWT_SECRET=jwt_super_secret_pleasure_game_2024_hostinger_deploy

# Lastlink
LASTLINK_API_KEY=sua_api_key_lastlink
LASTLINK_WEBHOOK_SECRET=seu_webhook_secret
LASTLINK_WEBHOOK_URL=http://31.97.15.106:3333/api/webhooks/lastlink

# Email (opcional)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=noreply@seu-dominio.com
SMTP_PASS=sua_senha_email
```

## Deploy do Backend

### 1. Verificar Dockerfile

O `backend/Dockerfile` atual deve estar otimizado. Vamos verificar se precisa de ajustes:

```dockerfile
# Multi-stage build para produção
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package files
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm ci --only=production && npm cache clean --force

# Gerar Prisma Client
RUN npx prisma generate

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Estágio de produção
FROM node:18-alpine AS production

WORKDIR /app

# Instalar dependências do sistema
RUN apk add --no-cache dumb-init curl

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S backend -u 1001

# Copiar arquivos necessários
COPY --from=builder --chown=backend:nodejs /app/dist ./dist
COPY --from=builder --chown=backend:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=backend:nodejs /app/package*.json ./
COPY --from=builder --chown=backend:nodejs /app/prisma ./prisma

# Criar diretórios necessários
RUN mkdir -p uploads logs && chown -R backend:nodejs uploads logs

USER backend

EXPOSE 3333

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3333/api/health || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]
```

### 2. Executar Deploy

```bash
# No VPS, fazer upload dos arquivos
cd /opt/pleasuregame-backend

# Verificar configuração
docker-compose config

# Fazer build da imagem
docker-compose build --no-cache backend

# Subir os serviços
docker-compose up -d

# Verificar status
docker-compose ps
```

### 3. Configurar Banco de Dados

```bash
# Aguardar serviços ficarem prontos
sleep 30

# Executar migrations
docker-compose exec backend npx prisma migrate deploy

# Verificar se o banco está funcionando
docker-compose exec backend npx prisma db seed
```

## Verificação e Testes

### 1. Health Check

```bash
# Verificar saúde do backend
curl http://31.97.15.106:3333/api/health

# Resposta esperada:
# {"status":"ok","timestamp":"2024-01-01T00:00:00.000Z","uptime":123}
```

### 2. Teste de CORS

```bash
# Testar CORS
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     http://31.97.15.106:3333/api/auth/login
```

### 3. Verificar Logs

```bash
# Ver logs do backend
docker-compose logs -f backend

# Ver logs do banco
docker-compose logs postgres

# Ver logs do Redis
docker-compose logs redis
```

## Monitoramento

### 1. Script de Monitoramento

Criar `/opt/pleasuregame-backend/monitor.sh`:

```bash
#!/bin/bash

echo "=== PleasureGame Backend Status ==="
echo "Data: $(date)"
echo ""

echo "=== Status dos Containers ==="
docker-compose ps

echo -e "\n=== Uso de Recursos ==="
docker stats --no-stream pleasuregame_backend pleasuregame_postgres pleasuregame_redis

echo -e "\n=== Health Check ==="
curl -s http://localhost:3333/api/health | jq . 2>/dev/null || curl -s http://localhost:3333/api/health

echo -e "\n=== Espaço em Disco ==="
df -h /

echo -e "\n=== Logs Recentes Backend ==="
docker-compose logs --tail=5 backend
```

### 2. Backup do Banco

Criar `/opt/pleasuregame-backend/backup.sh`:

```bash
#!/bin/bash

BACKUP_DIR="/opt/backups/pleasuregame"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

echo "Iniciando backup: $DATE"

# Backup do banco de dados
docker-compose exec -T postgres pg_dump -U pleasuregame_user pleasuregame_prod > $BACKUP_DIR/db_$DATE.sql

# Backup dos uploads (se existir)
if [ -d "./backend/uploads" ]; then
    tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz -C ./backend uploads/
fi

# Manter apenas os últimos 7 backups
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete 2>/dev/null
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete 2>/dev/null

echo "Backup concluído: $DATE"
```

## Comandos Úteis

### Gerenciamento dos Containers

```bash
# Parar todos os serviços
docker-compose down

# Reiniciar apenas o backend
docker-compose restart backend

# Ver logs em tempo real
docker-compose logs -f backend

# Executar comando no container
docker-compose exec backend bash

# Rebuild do backend
docker-compose build --no-cache backend
docker-compose up -d backend
```

### Banco de Dados

```bash
# Conectar ao PostgreSQL
docker-compose exec postgres psql -U pleasuregame_user -d pleasuregame_prod

# Executar migrations
docker-compose exec backend npx prisma migrate deploy

# Reset do banco (CUIDADO!)
docker-compose exec backend npx prisma migrate reset
```

### Redis

```bash
# Conectar ao Redis
docker-compose exec redis redis-cli -a RedisPleasure2024!@#

# Ver estatísticas
docker-compose exec redis redis-cli -a RedisPleasure2024!@# info

# Limpar cache
docker-compose exec redis redis-cli -a RedisPleasure2024!@# flushall
```

## Troubleshooting

### Problemas Comuns

**Backend não inicia:**
```bash
# Verificar logs
docker-compose logs backend

# Verificar variáveis de ambiente
docker-compose exec backend env
```

**Erro de conexão com banco:**
```bash
# Verificar se PostgreSQL está rodando
docker-compose exec postgres pg_isready -U pleasuregame_user

# Testar conexão
docker-compose exec backend npx prisma db push
```

**Erro de CORS:**
```bash
# Verificar variável CORS_ORIGIN no .env
# Adicionar origem necessária e reiniciar
docker-compose restart backend
```

## URLs de Acesso

Após o deploy bem-sucedido:

- **API Base**: `http://31.97.15.106:3333/api`
- **Health Check**: `http://31.97.15.106:3333/api/health`
- **Documentação**: `http://31.97.15.106:3333/api/docs` (se implementada)
- **Webhook Lastlink**: `http://31.97.15.106:3333/api/webhooks/lastlink`

## Próximos Passos

1. **Configurar Lastlink**: Editar as variáveis `LASTLINK_API_KEY` e `LASTLINK_WEBHOOK_SECRET` no `.env`
2. **Testar Endpoints**: Usar Postman ou curl para testar as rotas da API
3. **Configurar Frontend**: Quando pronto, apontar o frontend para `http://31.97.15.106:3333`
4. **SSL (Opcional)**: Configurar certificado SSL se tiver domínio
5. **Monitoramento**: Configurar alertas e logs centralizados

## Comandos de Deploy Rápido

```bash
# Deploy completo em uma linha
cd /opt/pleasuregame-backend && docker-compose down && docker-compose build --no-cache && docker-compose up -d && docker-compose logs -f
``` 