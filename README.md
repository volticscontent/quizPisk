# 💕 Lovely - Aplicativo para Casais

Aplicativo completo para casais explorarem sua intimidade de forma divertida e conectada.

## 🏗️ Arquitetura do Projeto

### Backend (`/backend`)
- **Framework**: Express.js + Node.js
- **Banco de Dados**: PostgreSQL + Prisma ORM
- **Autenticação**: JWT
- **Pagamentos**: Integração LastLink
- **Containerização**: Docker

### Frontend (`/lovelyapp`)
- **Framework**: Next.js 15 + React 19
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS v4
- **UI Components**: Radix UI
- **Animações**: Framer Motion

## 🚀 Funcionalidades

### 🎮 Sistema de Jogos
- **Exploração Guiada**: Perguntas íntimas para conexão
- **Verdade ou Desafio**: Versão romântica do clássico
- **Modo Selvagem**: Desafios mais intensos
- **Roleplay com Narração**: Cenários completos

### 💎 Planos de Assinatura
- **No Climinha** (R$ 47,90): Funcionalidades básicas
- **Modo Quente** (R$ 57,90): Recursos avançados
- **Sem Freio** (R$ 77,90): Acesso completo

### 🏆 Sistema de Conquistas
- Conquistas semanais e mensais
- Sistema de pontuação
- Gamificação da experiência

### 👥 Workspaces para Casais
- Espaços compartilhados
- Sincronização de progresso
- Fantasias em comum

## 🛠️ Instalação e Desenvolvimento

### Pré-requisitos
- Node.js 18+
- PostgreSQL
- Docker (opcional)

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Configurar variáveis de ambiente
npx prisma migrate dev
npm start
```

### Frontend
```bash
cd lovelyapp
npm install
cp .env.local.example .env.local
# Configurar variáveis de ambiente
npm run dev
```

## 🔐 Segurança

- Autenticação JWT
- Hash de senhas com bcryptjs
- Rate limiting
- Validação de dados
- CORS configurado

## 📊 Banco de Dados

### Modelos Principais
- **User**: Usuários do sistema
- **Profile**: Perfis detalhados
- **Workspace**: Espaços de casais
- **Plan/Subscription**: Sistema de planos
- **Game/GameSession**: Sistema de jogos
- **Fantasy**: Sistema de fantasias
- **Achievement**: Sistema de conquistas

## 🚀 Deploy

### Backend
```bash
docker-compose up -d
```

### Frontend
```bash
npm run build
npm start
```

## 📝 Documentação

- [Deploy Backend](backend/DEPLOY-BACKEND-ONLY.md)
- [API Routes](backend/API-ROTAS.md)
- [Deploy Geral](backend/DEPLOY.md)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

---

**Desenvolvido com 💕 para casais que querem se conectar mais** 