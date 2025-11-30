# Variáveis de Ambiente - EasyLink

## 🎯 Variáveis Necessárias para Deploy

### 📦 VERCEL (Frontend)

Adicione estas variáveis no painel do Vercel:

| Nome da Variável | Valor | Descrição |
|-----------------|-------|-----------|
| `VITE_API_URL` | `https://seu-backend-no-render.onrender.com/api` | URL completa da API do backend (substitua pela URL real do seu backend no Render) |

**⚠️ IMPORTANTE**: 
- Substitua `seu-backend-no-render.onrender.com` pela URL real do seu backend no Render
- A URL deve terminar com `/api`
- Exemplo: Se seu backend no Render é `https://easylink-backend.onrender.com`, então use `https://easylink-backend.onrender.com/api`

**Onde configurar no Vercel:**
1. Vá em Settings → Environment Variables
2. Clique em "Add New"
3. Preencha:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://seu-backend-no-render.onrender.com/api`
   - **Environment**: Marque todas (Production, Preview, Development)

---

### 🖥️ RENDER (Backend)

Adicione estas variáveis no painel do Render:

| Nome da Variável | Valor | Descrição |
|-----------------|-------|-----------|
| `NODE_ENV` | `production` | Ambiente de execução |
| `PORT` | `10000` | Porta do servidor (Render pode definir automaticamente, mas pode usar esta) |
| `DB_PATH` | `/opt/render/project/src/backend/data/easylink.db` | Caminho completo do banco de dados no Persistent Disk |

**⚠️ IMPORTANTE**: 
- O `DB_PATH` deve apontar para o caminho onde o Persistent Disk está montado
- Se você mudou o `mountPath` do Persistent Disk, ajuste o `DB_PATH` correspondente

**Onde configurar no Render:**
1. Vá em Settings → Environment
2. Clique em "Add Environment Variable"
3. Adicione cada variável:
   - **Key**: `NODE_ENV` → **Value**: `production`
   - **Key**: `PORT` → **Value**: `10000` (ou deixe Render definir)
   - **Key**: `DB_PATH` → **Value**: `/opt/render/project/src/backend/data/easylink.db`

---

## 📋 Checklist de Configuração

### Antes de fazer o deploy:

- [ ] Backend deployado no Render
- [ ] URL do backend copiada (ex: `https://easylink-backend.onrender.com`)
- [ ] Variáveis do backend configuradas no Render
- [ ] Persistent Disk configurado no Render
- [ ] Variável `VITE_API_URL` configurada no Vercel com a URL do backend + `/api`
- [ ] Frontend deployado no Vercel

---

## 🔍 Como descobrir a URL do Backend no Render

1. Após fazer o deploy do backend no Render
2. Vá no dashboard do serviço
3. A URL estará no topo da página (ex: `https://easylink-backend.onrender.com`)
4. Copie essa URL e adicione `/api` no final
5. Use essa URL completa como valor de `VITE_API_URL` no Vercel

---

## 🧪 Testando as Variáveis

### Verificar se o backend está funcionando:
- Acesse: `https://seu-backend-no-render.onrender.com/health`
- Deve retornar: `{"status":"ok"}`

### Verificar se o frontend está conectando:
- Após configurar `VITE_API_URL` no Vercel
- Faça um novo deploy do frontend
- Tente criar um link na interface
- Se funcionar, está tudo certo! ✅

---

## ⚠️ Problemas Comuns

### Frontend não conecta ao backend
- Verifique se `VITE_API_URL` termina com `/api`
- Confirme que a URL do backend está correta
- Verifique se o backend está online (não "dormindo" no plano free)

### Backend não inicia
- Verifique os logs no Render
- Confirme que `DB_PATH` está correto
- Verifique se o Persistent Disk está montado

### Banco de dados não persiste
- Confirme que o Persistent Disk está configurado
- Verifique o `mountPath` do Persistent Disk
- Confirme que `DB_PATH` aponta para o caminho montado


