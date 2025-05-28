# 🚀 Deploy do Lovely Backend na VPS

## Pré-requisitos na VPS

1. **PostgreSQL instalado e configurado**
2. **Node.js 18+ instalado**
3. **Nginx instalado (opcional, mas recomendado)**

## Passos para Deploy

### 1. Conectar na VPS
```bash
ssh root@31.97.15.106
```

### 2. Criar diretório do projeto
```bash
mkdir -p /var/www/lovely-backend
cd /var/www/lovely-backend
```

### 3. Fazer upload dos arquivos
Você pode usar `scp` ou `rsync` para enviar os arquivos:

```bash
# Do seu computador local, na pasta backend:
scp -r * root@31.97.15.106:/var/www/lovely-backend/
```

### 4. Executar o script de deploy
```bash
cd /var/www/lovely-backend
chmod +x deploy.sh
./deploy.sh
```

## Verificações Pós-Deploy

### 1. Verificar se o serviço está rodando
```bash
sudo systemctl status lovely-backend
```

### 2. Testar a API
```bash
curl http://31.97.15.106:3333/health
```

### 3. Verificar logs
```bash
sudo journalctl -u lovely-backend -f
```

## Comandos Úteis

### Reiniciar o serviço
```bash
sudo systemctl restart lovely-backend
```

### Parar o serviço
```bash
sudo systemctl stop lovely-backend
```

### Ver logs em tempo real
```bash
sudo journalctl -u lovely-backend -f
```

### Verificar status do banco
```bash
cd /var/www/lovely-backend
npx prisma studio
```

## Configuração do Banco de Dados

Certifique-se de que o PostgreSQL está configurado corretamente:

```sql
-- Conectar no PostgreSQL como superuser
sudo -u postgres psql

-- Criar banco e usuário
CREATE DATABASE pleasuregame_db;
CREATE USER postgres WITH PASSWORD 'Lv2024$SecureDB#9876';
GRANT ALL PRIVILEGES ON DATABASE pleasuregame_db TO postgres;
```

## URLs da Aplicação

Após o deploy bem-sucedido:

- **API Backend**: http://31.97.15.106:3333
- **Health Check**: http://31.97.15.106:3333/health
- **Documentação**: http://31.97.15.106:3333/api-docs (se habilitada)

## Troubleshooting

### Erro de conexão com banco
1. Verificar se PostgreSQL está rodando: `sudo systemctl status postgresql`
2. Verificar credenciais no arquivo `.env`
3. Testar conexão: `psql -h localhost -U postgres -d pleasuregame_db`

### Erro de porta em uso
1. Verificar processos na porta 3333: `sudo lsof -i :3333`
2. Matar processos se necessário: `sudo pkill -f "node.*server.js"`

### Erro de permissões
1. Verificar proprietário dos arquivos: `ls -la`
2. Ajustar permissões se necessário: `sudo chown -R root:root /var/www/lovely-backend`

## Monitoramento

### PM2 (Alternativa ao systemd)
Se preferir usar PM2:

```bash
npm install -g pm2
pm2 start server.js --name "lovely-backend"
pm2 startup
pm2 save
```

### Logs com PM2
```bash
pm2 logs lovely-backend
pm2 monit
``` 