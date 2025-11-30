# Configuração do Supabase para EasyLink

## ✅ Schema Correto para Supabase

Execute este SQL no Supabase SQL Editor:

```sql
-- Tabela categories
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela links
CREATE TABLE IF NOT EXISTS links (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  "categoryId" INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  favorite BOOLEAN DEFAULT FALSE,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela settings
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_links_category ON links("categoryId");
CREATE INDEX IF NOT EXISTS idx_links_favorite ON links(favorite);
CREATE INDEX IF NOT EXISTS idx_links_created ON links("createdAt");
```

## 🔑 Variáveis de Ambiente no Render

Após criar as tabelas no Supabase, configure no Render:

1. Vá em **Settings** → **Environment**
2. Adicione/Edite a variável:
   - **Key**: `DATABASE_URL`
   - **Value**: A connection string do Supabase

### Como obter a DATABASE_URL do Supabase:

1. Acesse o dashboard do Supabase
2. Vá em **Project Settings** → **Database**
3. Procure por **Connection string** ou **Connection pooling**
4. Use a connection string do tipo **URI** (não Session mode)
5. Formato: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`

**⚠️ IMPORTANTE**: 
- Substitua `[PASSWORD]` pela senha do seu banco
- Substitua `[HOST]` pelo host do Supabase
- Se usar connection pooling, use a porta 6543 ao invés de 5432

## 📋 Checklist

- [ ] Tabelas criadas no Supabase
- [ ] Índices criados
- [ ] Variável `DATABASE_URL` configurada no Render
- [ ] Variável `NODE_ENV` = `production` no Render
- [ ] Variável `PORT` = `10000` no Render (ou deixe Render definir)
- [ ] Remover variável `DB_PATH` (não é mais necessária)
- [ ] Fazer novo deploy no Render

## 🔄 Após Configurar

1. Faça um **Manual Deploy** no Render
2. Verifique os logs - deve aparecer: `✅ Conectado ao banco de dados PostgreSQL (Supabase)`
3. Teste criando um link
4. Os dados agora devem persistir! 🎉

