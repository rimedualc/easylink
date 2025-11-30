# Configuração Manual do Render (Se render.yaml não funcionar)

Se o arquivo `render.yaml` não estiver sendo detectado ou estiver causando problemas, configure manualmente no dashboard do Render:

## ⚙️ Configuração Manual no Render Dashboard

### 1. Configurações Básicas

- **Name**: `easylink-backend`
- **Environment**: `Node`
- **Region**: Escolha a mais próxima
- **Branch**: `main`
- **Root Directory**: `backend` ⚠️ **IMPORTANTE**

### 2. Build & Start Commands

**Build Command:**
```
npm install --include=dev
```

**Start Command:**
```
npm start
```

**Explicação**: 
- O `npm install --include=dev` instala todas as dependências incluindo devDependencies (TypeScript e @types/node)
- Após instalar, automaticamente executa o script `postinstall` que compila o TypeScript
- O `npm start` executa o servidor Node.js compilado

### 3. Variáveis de Ambiente

Adicione estas variáveis:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `DB_PATH` | `/opt/render/project/src/backend/data/easylink.db` |

### 4. Persistent Disk

- **Name**: `easylink-db`
- **Mount Path**: `/opt/render/project/src/backend/data`
- **Size**: 1GB

## 🔍 Por que essa configuração funciona?

1. **Root Directory = `backend`**: O Render trabalha diretamente na pasta backend
2. **Build Command = `npm install`**: Instala dependências e automaticamente executa `postinstall` que compila o TypeScript
3. **Start Command = `npm start`**: Executa o servidor Node.js compilado

## ✅ Verificação

Após configurar, o build deve:
1. ✅ Instalar dependências
2. ✅ Compilar TypeScript automaticamente (via postinstall)
3. ✅ Iniciar o servidor

Se ainda falhar, verifique os logs no Render Dashboard para ver o erro específico.

