# 🚀 Deploy do Frontend Next.js na VPS

## Opções de Deploy

### Opção 1: Deploy com Node.js (Recomendado)

#### 1. Conectar na VPS
```bash
ssh root@31.97.15.106
```

#### 2. Criar diretório do projeto
```bash
mkdir -p /var/www/lovely-front
cd /var/www/lovely-front
```

#### 3. Fazer upload dos arquivos necessários
Do seu computador local, na pasta `front`:

```bash
# Enviar arquivos essenciais
scp package.json root@31.97.15.106:/var/www/lovely-front/
scp package-lock.json root@31.97.15.106:/var/www/lovely-front/
scp next.config.js root@31.97.15.106:/var/www/lovely-front/
scp .env.local root@31.97.15.106:/var/www/lovely-front/

# Enviar pasta .next (build)
scp -r .next root@31.97.15.106:/var/www/lovely-front/

# Enviar pasta public
scp -r public root@31.97.15.106:/var/www/lovely-front/
```

#### 4. Instalar dependências na VPS
```bash
cd /var/www/lovely-front
npm install --production
```

#### 5. Criar arquivo de serviço systemd
```bash
sudo nano /etc/systemd/system/lovely-front.service
```

Conteúdo do arquivo:
```ini
[Unit]
Description=Lovely Frontend Next.js App
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/lovely-front
Environment=NODE_ENV=production
Environment=PORT=3001
ExecStart=/usr/bin/npm start
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

#### 6. Iniciar o serviço
```bash
sudo systemctl daemon-reload
sudo systemctl enable lovely-front
sudo systemctl start lovely-front
```

#### 7. Verificar status
```bash
sudo systemctl status lovely-front
```

### Opção 2: Deploy com PM2

#### 1. Instalar PM2 globalmente
```bash
npm install -g pm2
```

#### 2. Criar arquivo ecosystem.config.js
```bash
nano /var/www/lovely-front/ecosystem.config.js
```

Conteúdo:
```javascript
module.exports = {
  apps: [{
    name: 'lovely-front',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/lovely-front',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
}
```

#### 3. Iniciar com PM2
```bash
cd /var/www/lovely-front
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

### Opção 3: Deploy Estático com Nginx

#### 1. Gerar build estático (no seu computador)
Primeiro, modifique o `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
```

#### 2. Fazer build estático
```bash
npm run build
```

#### 3. Enviar pasta out para VPS
```bash
scp -r out root@31.97.15.106:/var/www/lovely-front-static/
```

#### 4. Configurar Nginx
```bash
sudo nano /etc/nginx/sites-available/lovely-front
```

Conteúdo:
```nginx
server {
    listen 3001;
    server_name 31.97.15.106;
    
    root /var/www/lovely-front-static;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /_next/static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### 5. Ativar site
```bash
sudo ln -s /etc/nginx/sites-available/lovely-front /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## URLs de Acesso

Após o deploy:
- **Frontend**: http://31.97.15.106:3001

## Comandos Úteis

### Verificar logs (systemd)
```bash
sudo journalctl -u lovely-front -f
```

### Verificar logs (PM2)
```bash
pm2 logs lovely-front
```

### Reiniciar serviço
```bash
# systemd
sudo systemctl restart lovely-front

# PM2
pm2 restart lovely-front
```

### Atualizar aplicação
```bash
# Parar serviço
sudo systemctl stop lovely-front

# Fazer upload dos novos arquivos
# ... comandos scp ...

# Reiniciar serviço
sudo systemctl start lovely-front
```

## Troubleshooting

### Erro de porta em uso
```bash
sudo lsof -i :3001
sudo pkill -f "node.*next"
```

### Verificar se Next.js está funcionando
```bash
curl http://localhost:3001
```

### Verificar variáveis de ambiente
```bash
cd /var/www/lovely-front
cat .env.local
``` 