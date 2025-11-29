# EasyLink

Gerenciador de links com sistema de categorias, desenvolvido com React + Vite (frontend) e Fastify + SQLite (backend).

## 🚀 Deploy

### Frontend (Vercel)

1. Faça login no [Vercel](https://vercel.com)
2. Conecte seu repositório GitHub
3. Configure o projeto:
   - **Root Directory**: Deixe em branco ou use `/`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/dist`
   - **Install Command**: `cd frontend && npm install`
4. Adicione a variável de ambiente:
   - **VITE_API_URL**: URL do seu backend no Render (ex: `https://easylink-backend.onrender.com/api`)
5. Faça o deploy!

### Backend (Render)

1. Faça login no [Render](https://render.com)
2. Crie um novo **Web Service**
3. Conecte seu repositório GitHub
4. Configure o serviço:
   - **Name**: `easylink-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free (ou pago, se preferir)
5. Adicione as variáveis de ambiente:
   - **NODE_ENV**: `production`
   - **PORT**: `10000` (Render define automaticamente, mas pode usar esta)
   - **DB_PATH**: `/opt/render/project/src/backend/data/easylink.db`
6. Adicione um **Persistent Disk**:
   - **Name**: `easylink-db`
   - **Mount Path**: `/opt/render/project/src/backend/data`
   - **Size**: 1GB (ou mais, se necessário)
7. Faça o deploy!

**Importante**: Após o deploy do backend, copie a URL e adicione `/api` no final. Use essa URL como `VITE_API_URL` no Vercel.

## 📝 Variáveis de Ambiente

### Backend (.env)
```
PORT=3018
NODE_ENV=development
DB_PATH=./data/easylink.db
```

### Frontend (.env.production)
```
VITE_API_URL=https://seu-backend-no-render.onrender.com/api
```

## 🛠️ Desenvolvimento Local

1. Instale as dependências:
   ```bash
   .\install_dependencies.bat
   ```

2. Inicie o projeto:
   ```bash
   .\EasyLink.bat
   ```

Ou manualmente:

```bash
# Backend
cd backend
npm run dev

# Frontend (em outro terminal)
cd frontend
npm run dev
```

## 📦 Estrutura do Projeto

```
EASYLINK/
├── backend/          # API Fastify + SQLite
├── frontend/          # React + Vite
├── Docs/              # Documentação
└── vercel.json        # Configuração Vercel
└── render.yaml        # Configuração Render
```

## 🔧 Tecnologias

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Fastify, SQLite3, TypeScript
- **Deploy**: Vercel (frontend), Render (backend)

