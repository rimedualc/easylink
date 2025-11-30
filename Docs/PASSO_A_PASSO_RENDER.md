# 🚀 Passo a Passo - Deploy no Render

## PASSO 1: Criar o Web Service

1. Acesse [Render Dashboard](https://dashboard.render.com)
2. Clique no botão **"New +"** (canto superior direito)
3. Selecione **"Web Service"**
4. Conecte seu repositório GitHub (se ainda não conectou):
   - Clique em **"Connect account"** ou **"Connect GitHub"**
   - Autorize o Render a acessar seus repositórios
   - Selecione o repositório **"easylink"** (ou **"rimedualc/easylink"**)

---

## PASSO 2: Configurações Básicas

Preencha os campos:

- **Name**: `easylink-backend`
- **Environment**: Selecione **"Node"**
- **Region**: Escolha a região mais próxima (ex: **Oregon (US West)**)
- **Branch**: `main`

**⚠️ IMPORTANTE - Root Directory:**
- Deixe este campo **VAZIO** por enquanto
- Ou preencha com: `backend`

**Clique em "Continue" ou "Next"**

---

## PASSO 3: Build & Start Commands

Agora configure os comandos:

**Build Command:**
```
npm install
```

**Start Command:**
```
npm start
```

**⚠️ NÃO clique em "Create Web Service" ainda!**

---

## ✅ CONFIRMAÇÃO DO PASSO 3

**Antes de continuar, confirme:**
- [ ] Build Command está: `npm install`
- [ ] Start Command está: `npm start`
- [ ] Root Directory está vazio OU preenchido com `backend`

**Quando confirmar, me avise e vamos para o PASSO 4!**

---

## PASSO 4: Variáveis de Ambiente

**Ainda NÃO crie o serviço!** Primeiro vamos configurar as variáveis:

1. Procure a seção **"Environment Variables"** ou **"Environment"**
2. Clique em **"Add Environment Variable"** ou **"+"**
3. Adicione uma por uma:

**Variável 1:**
- **Key**: `NODE_ENV`
- **Value**: `production`

**Variável 2:**
- **Key**: `PORT`
- **Value**: `10000`

**Variável 3:**
- **Key**: `DB_PATH`
- **Value**: `/opt/render/project/src/backend/data/easylink.db`

---

## PASSO 5: Persistent Disk

1. Procure a seção **"Disks"** ou **"Persistent Disk"**
2. Clique em **"Add Disk"** ou **"+"**
3. Configure:
   - **Name**: `easylink-db`
   - **Mount Path**: `/opt/render/project/src/backend/data`
   - **Size**: `1` (GB)

---

## PASSO 6: Criar o Serviço

Agora sim! Clique em **"Create Web Service"**

O Render vai começar a fazer o deploy automaticamente.

---

## PASSO 7: Aguardar e Verificar

1. Aguarde alguns minutos (pode levar 3-5 minutos)
2. Observe os logs na tela
3. Quando terminar, você verá:
   - ✅ Status: "Live" (verde)
   - URL do serviço (ex: `https://easylink-backend.onrender.com`)

---

## 🆘 Se der erro

Me envie:
1. O erro completo dos logs
2. Em qual passo você estava
3. Screenshot se possível

Vamos resolver juntos! 🔧


