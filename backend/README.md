# 🎮 PleasureGame Backend

Backend da plataforma PleasureGame - Sistema de gerenciamento de relacionamentos e pagamentos integrado com Lastlink.

## 🚀 Tecnologias

- **Node.js** + **JavaScript**
- **Express** (Framework web)
- **PostgreSQL** (Banco de dados)
- **Docker** (Containerização)
- **Prisma** (ORM)
- **JWT** (Autenticação)
- **bcryptjs** (Hash de senhas)

## 📋 Pré-requisitos

- Node.js 18+
- Docker & Docker Compose
- Git

## ⚡ Instalação Rápida

### 🖥️ Desenvolvimento Local
```bash
# Clonar repositório
git clone https://github.com/seu-usuario/pleasuregame.git
cd pleasuregame/backend

# Configurar ambiente
cp .env.example .env
# Editar .env com suas configurações

# Instalar dependências
npm install

# Subir banco de dados
docker-compose up -d

# Executar migrações
npx prisma migrate dev

# Iniciar desenvolvimento
npm start
```

## 🔧 Configuração

### Variáveis Essenciais (.env)
```env
# Servidor
NODE_ENV=production
PORT=3333

# Banco de dados
DATABASE_URL="postgresql://postgres:senha@pleasuregame_db:5432/pleasuregame_db"

# Segurança
JWT_SECRET=sua_chave_jwt_super_segura
WEBHOOK_SECRET=sua_chave_webhook_segura
WEBHOOK_TOKEN=ad7e97a7b9af490c8b596feddd055350

# Frontend
FRONTEND_URL=http://31.97.15.106:3000
```

## 📡 API Endpoints

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `POST /api/auth/logout` - Logout
- `GET /api/auth/validate` - Validar token

### URLs Encurtadas
- `POST /api/urls` - Criar URL encurtada
- `GET /api/urls` - Listar URLs do usuário
- `GET /r/:slug` - Redirecionar URL

### Páginas Personalizadas
- `GET /api/pages/list` - Listar páginas
- `POST /api/pages` - Criar página
- `PUT /api/pages/:id` - Atualizar página
- `DELETE /api/pages/:id` - Deletar página

### Pagamentos
- `GET /api/payments/plans` - Listar planos
- `POST /api/payments` - Criar pagamento

### Sistema
- `GET /health` - Health check
- `GET /api/webhook/logs` - Logs de webhooks (autenticado)

## 🔗 Webhooks Lastlink

Configure no painel da Lastlink:
- **URL**: `http://31.97.15.106:3333/api/verify/ad7e97a7b9af490c8b596feddd055350`
- **Eventos**: Todos os eventos de pagamento

## 🛠️ Comandos Úteis

```bash
# Desenvolvimento
npm start            # Iniciar servidor

# Banco de dados
npx prisma migrate dev    # Executar migrações
npx prisma studio        # Abrir Prisma Studio
npx prisma generate      # Gerar cliente Prisma

# Docker
docker-compose up -d              # Subir serviços
docker-compose logs -f backend    # Ver logs
docker-compose restart backend    # Reiniciar backend
```

## 🔍 Monitoramento

### Health Check
```bash
curl http://31.97.15.106:3333/health
```

### Logs
```bash
# Ver logs em tempo real
docker-compose logs -f backend

# Ver logs específicos
docker-compose logs backend | grep ERROR
```

## 🆘 Troubleshooting

### Backend não inicia
```bash
# Verificar logs
docker-compose logs backend

# Verificar configurações
cat .env

# Reiniciar serviços
docker-compose restart
```

### Banco não conecta
```bash
# Verificar status do PostgreSQL
docker ps | grep postgres

# Testar conexão
docker exec pleasuregame_db psql -U postgres -d pleasuregame_db -c "SELECT 1;"
```

### Webhook não funciona
```bash
# Testar webhook
curl -X POST http://31.97.15.106:3333/api/verify/ad7e97a7b9af490c8b596feddd055350 \
  -H "Content-Type: application/json" \
  -d '{"event": "test", "id": "123"}'

# Verificar logs de webhook
docker-compose logs backend | grep webhook
```

---

**Licença**: MIT 