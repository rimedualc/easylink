# Guia de Deploy - EasyLink

## 📋 Pré-requisitos

- Conta no [Vercel](https://vercel.com) (gratuita)
- Conta no [Render](https://render.com) (gratuita)
- Repositório no GitHub

## 🎯 Passo a Passo

### 1. Preparar o Repositório

Certifique-se de que todos os arquivos estão commitados:

```bash
git add .
git commit -m "Preparar para deploy"
git push origin main
```

### 2. Deploy do Backend (Render)

1. Acesse [Render Dashboard](https://dashboard.render.com)
2. Clique em **New +** → **Web Service**
3. Conecte seu repositório GitHub
4. Selecione o repositório **EASYLINK**
5. Configure:
   - **Name**: `easylink-backend`
   - **Environment**: `Node`
   - **Region**: Escolha a mais próxima
   - **Branch**: `main`
   - **Root Directory**: Deixe em branco
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free (ou pago)

6. **Variáveis de Ambiente**:
   - `NODE_ENV` = `production`
   - `PORT` = `10000` (ou deixe Render definir automaticamente)
   - `DB_PATH` = `/opt/render/project/src/backend/data/easylink.db`

7. **Persistent Disk** (importante para o banco de dados):
   - Clique em **Add Disk**
   - **Name**: `easylink-db`
   - **Mount Path**: `/opt/render/project/src/backend/data`
   - **Size**: 1GB (mínimo)

8. Clique em **Create Web Service**

9. Aguarde o deploy (pode levar alguns minutos)

10. **Copie a URL** do serviço (ex: `https://easylink-backend.onrender.com`)

### 3. Deploy do Frontend (Vercel)

1. Acesse [Vercel Dashboard](https://vercel.com/dashboard)
2. Clique em **Add New** → **Project**
3. Conecte seu repositório GitHub (se ainda não conectou)
4. Selecione o repositório **EASYLINK**
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: Deixe em branco
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/dist`
   - **Install Command**: `cd frontend && npm install`

6. **Variáveis de Ambiente**:
   - Clique em **Environment Variables**
   - Adicione:
     - **Key**: `VITE_API_URL`
     - **Value**: `https://seu-backend-no-render.onrender.com/api` (substitua pela URL do seu backend)
     - **Environment**: Production, Preview, Development (marque todos)

7. Clique em **Deploy**

8. Aguarde o deploy (geralmente mais rápido que o Render)

### 4. Testar o Deploy

1. Acesse a URL do frontend no Vercel
2. Teste criar um link
3. Verifique se está conectando com o backend

## 🔄 Atualizações Futuras

Após fazer alterações no código:

1. Commit e push:
   ```bash
   git add .
   git commit -m "Descrição das mudanças"
   git push origin main
   ```

2. O Vercel e Render detectam automaticamente e fazem novo deploy

## ⚠️ Observações Importantes

### Render (Backend)

- **Free Plan**: O serviço "dorme" após 15 minutos de inatividade
- Primeira requisição após dormir pode levar 30-60 segundos
- Para evitar isso, considere o plano pago ou use um serviço de "ping" para manter ativo

### Vercel (Frontend)

- Deploy automático a cada push
- URLs de preview para cada PR
- SSL automático

### Banco de Dados

- O banco SQLite fica no Persistent Disk do Render
- **IMPORTANTE**: Faça backup regularmente usando a funcionalidade de Export
- O banco persiste mesmo após reinicializações do serviço

## 🐛 Troubleshooting

### Backend não inicia

- Verifique os logs no Render Dashboard
- Confirme que o `DB_PATH` está correto
- Verifique se o Persistent Disk está montado

### Frontend não conecta ao backend

- Verifique se `VITE_API_URL` está configurada corretamente
- Confirme que a URL termina com `/api`
- Verifique CORS no backend (já configurado para aceitar todas as origens)

### Banco de dados não persiste

- Confirme que o Persistent Disk está configurado
- Verifique o `mountPath` no Render
- Confirme que `DB_PATH` aponta para o caminho montado

## 📞 Suporte

Em caso de problemas:
1. Verifique os logs no dashboard do Render/Vercel
2. Teste localmente primeiro
3. Verifique as variáveis de ambiente

