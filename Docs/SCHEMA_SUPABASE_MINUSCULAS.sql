-- Schema para Supabase (sem aspas - PostgreSQL converte para minúsculas)
-- Use este schema se você criou as tabelas sem aspas

-- Tabela categories
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela links
CREATE TABLE IF NOT EXISTS links (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  categoryid INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  favorite BOOLEAN DEFAULT FALSE,
  createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela settings
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_links_category ON links(categoryid);
CREATE INDEX IF NOT EXISTS idx_links_favorite ON links(favorite);
CREATE INDEX IF NOT EXISTS idx_links_created ON links(createdat);


