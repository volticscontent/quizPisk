const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const { PrismaClient } = require('@prisma/client');

const app = express();
const PORT = process.env.PORT || 3333;
const JWT_SECRET = process.env.JWT_SECRET || 'pleasuregame-secret-key';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const LOVELY_APP_URL = process.env.LOVELY_APP_URL || 'http://localhost:3001';

// Configurações de segurança para webhooks
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'your-webhook-secret-key';
const WEBHOOK_TOKEN = process.env.WEBHOOK_TOKEN || 'ad7e97a7b9af490c8b596feddd055350';
const WEBHOOK_TIMEOUT = parseInt(process.env.WEBHOOK_TIMEOUT) || 300; // 5 minutos

// Inicializar Prisma Client
const prisma = new PrismaClient();

// Função utilitária para gerar códigos aleatórios
function generateRandomCode(length = 9) {
  return Math.random().toString(36).substr(2, length);
}

// Função utilitária para validar email
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function isValidEmail(email) {
  return EMAIL_REGEX.test(email);
}

// Rate limiting para webhooks
const webhookLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP por janela
  message: {
    error: 'Muitas requisições de webhook. Tente novamente em 15 minutos.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Middleware básico
app.use(cors({
  origin: [FRONTEND_URL, LOVELY_APP_URL, 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());

// Função para validar assinatura HMAC
function validateWebhookSignature(payload, signature, secret) {
  if (!signature || !secret) {
    return false;
  }
  
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload, 'utf8')
      .digest('hex');
    
    const cleanSignature = signature.replace(/^sha256=/, '');
    
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(cleanSignature, 'hex')
    );
  } catch (error) {
    console.error('❌ Erro na validação de assinatura:', error.message);
    return false;
  }
}

// Função para validar timestamp (proteção contra replay attacks)
function validateTimestamp(timestamp, tolerance = WEBHOOK_TIMEOUT) {
  if (!timestamp) {
    return false;
  }
  
  const now = Math.floor(Date.now() / 1000);
  const webhookTime = parseInt(timestamp);
  
  return Math.abs(now - webhookTime) <= tolerance;
}

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acesso requerido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// ========================================
// ROTAS DE HEALTH CHECK
// ========================================

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'PleasureGame API funcionando!',
    timestamp: new Date().toISOString()
  });
});

// ========================================
// ROTAS DE AUTENTICAÇÃO
// ========================================

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, senha e nome são obrigatórios' });
    }

    // Validações de senha
    if (password.length < 8) {
      return res.status(400).json({ error: 'A senha deve ter pelo menos 8 caracteres' });
    }
    
    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({ error: 'A senha deve conter pelo menos uma letra maiúscula' });
    }
    
    if (!/[a-z]/.test(password)) {
      return res.status(400).json({ error: 'A senha deve conter pelo menos uma letra minúscula' });
    }
    
    if (!/[0-9]/.test(password)) {
      return res.status(400).json({ error: 'A senha deve conter pelo menos um número' });
    }

    // Validação de email
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    // Verificar se usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'Usuário já existe' });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        isActive: true,
        emailVerified: false
      }
    });

    // Gerar token (sem expiração)
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);

    // Buscar assinatura ativa do usuário para determinar o plano
    const subscription = await prisma.subscription.findFirst({
      where: { 
        userId: user.id,
        status: 'active'
      },
      include: { plan: true },
      orderBy: { createdAt: 'desc' }
    });

    // Determinar plano do usuário
    let planType = 'no-climinha';
    if (subscription && subscription.plan) {
      switch (subscription.plan.name.toLowerCase()) {
        case 'no climinha':
          planType = 'no-climinha';
          break;
        case 'modo quente':
          planType = 'modo-quente';
          break;
        case 'sem freio':
        case 'sem-freio':
          planType = 'sem-freio';
          break;
        default:
          planType = 'no-climinha';
      }
    }

    // URL de redirecionamento para o app com estrutura correta
    const redirectUrl = `${LOVELY_APP_URL}/${user.id}/${planType}?token=${token}`;

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      redirectUrl
    });
  } catch (error) {
    console.error('💥 Erro no registro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Encontrar usuário
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Verificar senha
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Gerar token (sem expiração)
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);

    // Buscar assinatura ativa do usuário para determinar o plano
    const subscription = await prisma.subscription.findFirst({
      where: { 
        userId: user.id,
        status: 'active'
      },
      include: { plan: true },
      orderBy: { createdAt: 'desc' }
    });

    // Determinar plano do usuário
    let planType = 'no-climinha';
    if (subscription && subscription.plan) {
      switch (subscription.plan.name.toLowerCase()) {
        case 'no climinha':
          planType = 'no-climinha';
          break;
        case 'modo quente':
          planType = 'modo-quente';
          break;
        case 'sem freio':
        case 'sem-freio':
          planType = 'sem-freio';
          break;
        default:
          planType = 'no-climinha';
      }
    }

    // URL de redirecionamento para o app com estrutura correta
    const redirectUrl = `${LOVELY_APP_URL}/${user.id}/${planType}?token=${token}`;

    res.json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      redirectUrl
    });
  } catch (error) {
    console.error('💥 Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Validar token
app.get('/api/auth/validate', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: {
        subscriptions: {
          where: { status: 'active' },
          include: { plan: true },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Determinar plano do usuário
    let planType = 'no-climinha';
    if (user.subscriptions && user.subscriptions.length > 0) {
      const subscription = user.subscriptions[0];
      if (subscription.plan) {
        switch (subscription.plan.name.toLowerCase()) {
          case 'no climinha':
            planType = 'no-climinha';
            break;
          case 'modo quente':
            planType = 'modo-quente';
            break;
          case 'sem freio':
            planType = 'sem-freio';
            break;
          default:
            planType = 'no-climinha';
        }
      }
    }
    
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          planType: planType
        }
      }
    });
  } catch (error) {
    console.error('💥 Erro na validação do token:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Logout
app.post('/api/auth/logout', authenticateToken, (req, res) => {
  try {
    res.json({ message: 'Logout realizado com sucesso' });
  } catch (error) {
    console.error('💥 Erro no logout:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Renovar token (caso necessário no futuro)
app.post('/api/auth/refresh-token', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Gerar novo token (sem expiração)
    const newToken = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);
    
    res.json({
      success: true,
      token: newToken,
      message: 'Token renovado com sucesso'
    });
  } catch (error) {
    console.error('💥 Erro ao renovar token:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota específica para redirecionamento do frontend para o app
app.get('/api/auth/redirect-to-app', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: {
        subscriptions: {
          where: { status: 'active' },
          include: { plan: true },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Determinar plano do usuário
    let planType = 'no-climinha';
    if (user.subscriptions && user.subscriptions.length > 0) {
      const subscription = user.subscriptions[0];
      if (subscription.plan) {
        switch (subscription.plan.name.toLowerCase()) {
          case 'no climinha':
            planType = 'no-climinha';
            break;
          case 'modo quente':
            planType = 'modo-quente';
            break;
          case 'sem freio':
            planType = 'sem-freio';
            break;
          default:
            planType = 'no-climinha';
        }
      }
    }

    // Gerar novo token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);
    
    // URL de redirecionamento para o app
    const redirectUrl = `${LOVELY_APP_URL}/${user.id}/${planType}?token=${token}`;
    
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('💥 Erro no redirecionamento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ========================================
// WEBHOOK SEGURO DA LASTLINK
// ========================================

app.get(`/api/verify/${WEBHOOK_TOKEN}`, (req, res) => {
  res.json({ 
    status: 'verified', 
    message: 'Webhook endpoint ativo',
    timestamp: new Date().toISOString()
  });
});

app.post(`/api/verify/${WEBHOOK_TOKEN}`, webhookLimiter, async (req, res) => {
  try {
    const timestamp = new Date().toISOString();
    const sourceIp = req.ip || req.connection.remoteAddress || 'Unknown';
    const userAgent = req.get('User-Agent') || 'Unknown';
    
    // Validação básica do payload
    const webhookData = req.body;
    if (!webhookData || typeof webhookData !== 'object') {
      return res.status(400).json({ 
        success: false, 
        error: 'Payload inválido',
        code: 'INVALID_PAYLOAD'
      });
    }

    // Log de segurança (sem dados sensíveis)
    console.log('🔔 Webhook recebido:', {
      ip: sourceIp,
      userAgent: userAgent.substring(0, 50),
      eventType: webhookData.Event || webhookData.event || 'unknown',
      timestamp
    });

    // Processar diferentes tipos de eventos
    const eventType = webhookData.Event || webhookData.event;
    if (eventType) {
      switch (eventType) {
        case 'Purchase_Order_Confirmed':
        case 'payment.approved':
          await handlePaymentApproved(webhookData.Data || webhookData.data);
          break;
        
        case 'Purchase_Request_Confirmed':
        case 'payment.pending':
          await handlePaymentPending(webhookData.Data || webhookData.data);
          break;
        
        case 'Payment_Refund':
        case 'payment.failed':
          await handlePaymentFailed(webhookData.Data || webhookData.data);
          break;
        
        case 'Payment_Chargeback':
        case 'payment.cancelled':
          await handlePaymentCancelled(webhookData.Data || webhookData.data);
          break;
        
        case 'test':
          console.log('🧪 Teste da Lastlink recebido');
          break;
        
        default:
          console.log('❓ Evento desconhecido:', eventType);
      }
    }

    // Resposta de sucesso
    res.status(200).json({ 
      success: true, 
      message: 'Webhook processado com sucesso',
      eventType: eventType,
      timestamp 
    });

  } catch (error) {
    console.error('💥 Erro ao processar webhook:', error.message);
    
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR',
      timestamp: new Date().toISOString()
    });
  }
});

// ========================================
// FUNÇÕES AUXILIARES PARA PAGAMENTOS
// ========================================

async function handlePaymentApproved(paymentData) {
  try {
    if (paymentData && paymentData.external_id) {
      const payment = await prisma.payment.findUnique({
        where: { id: paymentData.external_id }
      });

      if (payment) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { 
            status: 'COMPLETED',
            lastlinkId: paymentData.id,
            lastlinkStatus: 'approved'
          }
        });
        console.log('✅ Pagamento aprovado:', payment.id);
      }
    }
  } catch (error) {
    console.error('❌ Erro ao processar pagamento aprovado:', error.message);
  }
}

async function handlePaymentPending(paymentData) {
  try {
    if (paymentData && paymentData.external_id) {
      const payment = await prisma.payment.findUnique({
        where: { id: paymentData.external_id }
      });

      if (payment) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { 
            status: 'PENDING',
            lastlinkId: paymentData.id,
            lastlinkStatus: 'pending'
          }
        });
        console.log('⏳ Pagamento pendente:', payment.id);
      }
    }
  } catch (error) {
    console.error('❌ Erro ao processar pagamento pendente:', error.message);
  }
}

async function handlePaymentFailed(paymentData) {
  try {
    if (paymentData && paymentData.external_id) {
      const payment = await prisma.payment.findUnique({
        where: { id: paymentData.external_id }
      });

      if (payment) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { 
            status: 'FAILED',
            lastlinkId: paymentData.id,
            lastlinkStatus: 'failed'
          }
        });
        console.log('❌ Pagamento falhou:', payment.id);
      }
    }
  } catch (error) {
    console.error('❌ Erro ao processar pagamento falhou:', error.message);
  }
}

async function handlePaymentCancelled(paymentData) {
  try {
    if (paymentData && paymentData.external_id) {
      const payment = await prisma.payment.findUnique({
        where: { id: paymentData.external_id }
      });

      if (payment) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { 
            status: 'CANCELLED',
            lastlinkId: paymentData.id,
            lastlinkStatus: 'cancelled'
          }
        });
        console.log('🚫 Pagamento cancelado:', payment.id);
      }
    }
  } catch (error) {
    console.error('❌ Erro ao processar pagamento cancelado:', error.message);
  }
}

// ========================================
// GRACEFUL SHUTDOWN
// ========================================

process.on('SIGINT', async () => {
  console.log('🔄 Encerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🔄 Encerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

// ========================================
// INICIAR SERVIDOR
// ========================================

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
  console.log(`🔒 Webhook: http://localhost:${PORT}/api/verify/${WEBHOOK_TOKEN}`);
  console.log(`🎯 Frontend URL: ${FRONTEND_URL}`);
  console.log(`💖 Lovely App URL: ${LOVELY_APP_URL}`);
});

// ========================================
// ROTAS DE PERFIL
// ========================================

// Buscar perfil do usuário
app.get('/api/profiles/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const profile = await prisma.profile.findUnique({
      where: { userId }
    });
    
    if (!profile) {
      return res.status(404).json({ 
        success: false, 
        error: 'Perfil não encontrado' 
      });
    }
    
    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('💥 Erro ao buscar perfil:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    });
  }
});

// Criar perfil
app.post('/api/profiles', authenticateToken, async (req, res) => {
  try {
    const { userId, partnerName, preferences, avatar } = req.body;
    
    const profile = await prisma.profile.create({
      data: {
        userId,
        partnerName,
        preferences: preferences || [],
        avatar
      }
    });
    
    res.status(201).json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('💥 Erro ao criar perfil:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    });
  }
});

// Atualizar perfil
app.put('/api/profiles/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;
    
    const profile = await prisma.profile.update({
      where: { userId },
      data: updateData
    });
    
    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('💥 Erro ao atualizar perfil:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    });
  }
});

// ========================================
// ROTAS DE PLANOS E ASSINATURAS
// ========================================

// Buscar planos disponíveis
app.get('/api/plans', async (req, res) => {
  try {
    const plans = await prisma.plan.findMany({
      orderBy: { price: 'asc' }
    });
    
    res.json({
      success: true,
      data: plans
    });
  } catch (error) {
    console.error('💥 Erro ao buscar planos:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    });
  }
});

// Buscar assinatura do usuário
app.get('/api/subscriptions/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const subscription = await prisma.subscription.findFirst({
      where: { 
        userId,
        status: 'active'
      },
      include: { plan: true },
      orderBy: { createdAt: 'desc' }
    });
    
    if (!subscription) {
      return res.status(404).json({ 
        success: false, 
        error: 'Assinatura não encontrada' 
      });
    }
    
    res.json({
      success: true,
      data: subscription
    });
  } catch (error) {
    console.error('💥 Erro ao buscar assinatura:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    });
  }
});

// ========================================
// ROTAS DE JOGOS E CONTEÚDO
// ========================================

// Buscar conteúdo de jogos por modo e plano
app.get('/api/games/content', authenticateToken, async (req, res) => {
  try {
    const { mode, planType } = req.query;
    
    // Simulação de conteúdo baseado no plano
    const gameContent = {
      'no-climinha': {
        'exploracao-guiada': [
          {
            id: '1',
            title: 'Primeiros Passos',
            description: 'Perguntas íntimas básicas para se conhecerem melhor',
            content: 'Qual foi o momento em que você se sentiu mais conectado comigo?',
            difficulty: 'beginner',
            duration: 15
          }
        ],
        'verdade-desafio': [
          {
            id: '2',
            title: 'Verdade ou Desafio Romântico',
            description: 'Versão suave do clássico jogo',
            content: 'Verdade: Qual é sua fantasia romântica favorita?',
            difficulty: 'beginner',
            duration: 20
          }
        ]
      },
      'modo-quente': {
        'modo-selvagem': [
          {
            id: '3',
            title: 'Desafios Ousados',
            description: 'Desafios mais intensos com temporizador',
            content: 'Desafio: Massageie as costas do seu parceiro por 2 minutos',
            difficulty: 'intermediate',
            duration: 25
          }
        ]
      },
      'sem-freio': {
        'roleplay-narracao': [
          {
            id: '4',
            title: 'Cenário Completo',
            description: 'Roleplay com narração completa',
            content: 'Vocês estão em um spa privativo...',
            audioUrl: '/audio/spa-scenario.mp3',
            difficulty: 'advanced',
            duration: 45
          }
        ]
      }
    };
    
    const content = gameContent[planType]?.[mode] || [];
    
    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('💥 Erro ao buscar conteúdo de jogos:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    });
  }
});

// Buscar desafios por nível de ousadia
app.get('/api/games/challenges', authenticateToken, async (req, res) => {
  try {
    const { boldnessLevel, planType } = req.query;
    
    // Simulação de desafios baseados no nível de ousadia
    const challenges = [
      {
        id: '1',
        title: 'Massagem Relaxante',
        description: 'Uma massagem suave para relaxar',
        type: 'physical',
        boldnessRequired: parseInt(boldnessLevel) || 1,
        duration: 10,
        instructions: ['Prepare um ambiente calmo', 'Use óleo de massagem', 'Massageie suavemente']
      }
    ];
    
    res.json({
      success: true,
      data: challenges
    });
  } catch (error) {
    console.error('💥 Erro ao buscar desafios:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    });
  }
});

// Iniciar sessão de jogo
app.post('/api/games/sessions', authenticateToken, async (req, res) => {
  try {
    const { mode, participants, duration, difficulty } = req.body;
    
    const session = {
      id: `session_${Date.now()}`,
      userId: req.user.userId,
      mode,
      participants: participants || ['Você', 'Parceiro(a)'],
      startedAt: new Date().toISOString(),
      currentStep: 1,
      totalSteps: 10,
      settings: {
        duration,
        difficulty
      },
      progress: {
        challengesCompleted: 0,
        pointsEarned: 0,
        timeSpent: 0
      }
    };
    
    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('💥 Erro ao iniciar sessão:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    });
  }
});

// ========================================
// ROTAS DE FANTASIAS
// ========================================

// Buscar fantasias por plano
app.get('/api/fantasies', authenticateToken, async (req, res) => {
  try {
    const { planType } = req.query;
    
    const fantasies = [
      {
        id: '1',
        title: 'Jantar Romântico',
        description: 'Uma noite especial com jantar à luz de velas',
        category: 'romantic',
        isPrivate: false,
        requiredPlan: 'no-climinha'
      },
      {
        id: '2',
        title: 'Aventura Selvagem',
        description: 'Uma experiência mais intensa e aventureira',
        category: 'adventurous',
        isPrivate: true,
        requiredPlan: 'modo-quente'
      }
    ];
    
    const filteredFantasies = fantasies.filter(f => {
      const planLevels = { 'no-climinha': 1, 'modo-quente': 2, 'sem-freio': 3 };
      const userLevel = planLevels[planType] || 1;
      const requiredLevel = planLevels[f.requiredPlan] || 1;
      return userLevel >= requiredLevel;
    });
    
    res.json({
      success: true,
      data: filteredFantasies
    });
  } catch (error) {
    console.error('💥 Erro ao buscar fantasias:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    });
  }
});

// ========================================
// ROTAS DE CONQUISTAS
// ========================================

// Buscar conquistas disponíveis
app.get('/api/achievements', authenticateToken, async (req, res) => {
  try {
    const { planType } = req.query;
    
    const achievements = [
      {
        id: '1',
        title: 'Primeiro Passo',
        description: 'Complete seu primeiro jogo',
        icon: '🎯',
        type: 'milestone',
        requirements: { gamesPlayed: 1 },
        rewards: { title: 'Iniciante', badge: '🏆' }
      },
      {
        id: '2',
        title: 'Explorador',
        description: 'Jogue 10 jogos diferentes',
        icon: '🗺️',
        type: 'milestone',
        requirements: { gamesPlayed: 10 },
        rewards: { title: 'Explorador', unlockedContent: ['modo-especial'] }
      }
    ];
    
    res.json({
      success: true,
      data: achievements
    });
  } catch (error) {
    console.error('💥 Erro ao buscar conquistas:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    });
  }
});

// Buscar conquistas do usuário
app.get('/api/achievements/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verificar se o usuário pode acessar essas conquistas
    if (req.user.userId !== userId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
      orderBy: { unlockedAt: 'desc' }
    });
    
    res.json({ success: true, data: userAchievements });
  } catch (error) {
    console.error('💥 Erro ao buscar conquistas do usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ========================================
// ROTAS DE WORKSPACE
// ========================================

// Buscar workspace do usuário
app.get('/api/workspace/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Simulação de workspace
    const workspace = {
      id: `workspace_${userId}`,
      ownerId: userId,
      name: 'Nosso Espaço',
      participants: [
        {
          userId,
          name: 'Você',
          role: 'owner',
          joinedAt: new Date().toISOString()
        }
      ],
      settings: {
        theme: 'romantic',
        notifications: true,
        privacy: 'private',
        language: 'pt'
      },
      sharedFantasies: [],
      completedChallenges: [],
      currentStreak: 0
    };
    
    res.json({
      success: true,
      data: workspace
    });
  } catch (error) {
    console.error('💥 Erro ao buscar workspace:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    });
  }
});

// ===== ROTAS DOS MODOS DE JOGO =====

// Buscar modos de jogo disponíveis
app.get('/api/game-modes', async (req, res) => {
  try {
    const gameModes = await prisma.gameMode.findMany({
      orderBy: { requiredPlanLevel: 'asc' }
    });
    
    res.json(gameModes);
  } catch (error) {
    console.error('💥 Erro ao buscar modos de jogo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar jogos clássicos
app.get('/api/games/classic', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: {
        subscriptions: {
          where: { status: 'active' },
          include: { plan: true },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Determinar nível do plano
    let planLevel = 1;
    if (user.subscriptions && user.subscriptions.length > 0) {
      const subscription = user.subscriptions[0];
      if (subscription.plan) {
        switch (subscription.plan.name.toLowerCase()) {
          case 'no climinha':
            planLevel = 1;
            break;
          case 'modo quente':
            planLevel = 2;
            break;
          case 'sem freio':
            planLevel = 3;
            break;
        }
      }
    }

    const games = await prisma.game.findMany({
      where: {
        requiredPlanLevel: {
          lte: planLevel
        }
      },
      orderBy: { name: 'asc' }
    });
    
    res.json({ success: true, data: games });
  } catch (error) {
    console.error('💥 Erro ao buscar jogos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar fantasias
app.get('/api/fantasies', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: {
        subscriptions: {
          where: { status: 'active' },
          include: { plan: true },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Determinar nível do plano
    let planLevel = 1;
    if (user.subscriptions && user.subscriptions.length > 0) {
      const subscription = user.subscriptions[0];
      if (subscription.plan) {
        switch (subscription.plan.name.toLowerCase()) {
          case 'no climinha':
            planLevel = 1;
            break;
          case 'modo quente':
            planLevel = 2;
            break;
          case 'sem freio':
            planLevel = 3;
            break;
        }
      }
    }

    const fantasies = await prisma.fantasy.findMany({
      where: {
        requiredPlanLevel: {
          lte: planLevel
        }
      },
      orderBy: { name: 'asc' }
    });
    
    res.json({ success: true, data: fantasies });
  } catch (error) {
    console.error('💥 Erro ao buscar fantasias:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar conquistas disponíveis
app.get('/api/achievements', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: {
        subscriptions: {
          where: { status: 'active' },
          include: { plan: true },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Determinar nível do plano
    let planLevel = 1;
    if (user.subscriptions && user.subscriptions.length > 0) {
      const subscription = user.subscriptions[0];
      if (subscription.plan) {
        switch (subscription.plan.name.toLowerCase()) {
          case 'no climinha':
            planLevel = 1;
            break;
          case 'modo quente':
            planLevel = 2;
            break;
          case 'sem freio':
            planLevel = 3;
            break;
        }
      }
    }

    const achievements = await prisma.achievement.findMany({
      where: {
        requiredPlanLevel: {
          lte: planLevel
        }
      },
      orderBy: { name: 'asc' }
    });
    
    res.json({ success: true, data: achievements });
  } catch (error) {
    console.error('💥 Erro ao buscar conquistas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}); 