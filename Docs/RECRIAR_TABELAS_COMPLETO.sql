-- RECRIAR TABELAS COMPLETAS (com nomes em minúsculas)
-- Execute este SQL no Supabase SQL Editor

-- Remover tabelas antigas (se existirem)
DROP TABLE IF EXISTS links CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS settings CASCADE;

-- Remover índices antigos (se existirem)
DROP INDEX IF EXISTS idx_links_category;
DROP INDEX IF EXISTS idx_links_favorite;
DROP INDEX IF EXISTS idx_links_created;

-- Criar tabela categories
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela links
CREATE TABLE links (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  categoryid INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  favorite BOOLEAN DEFAULT FALSE,
  createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela settings
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

-- Criar índices
CREATE INDEX idx_links_category ON links(categoryid);
CREATE INDEX idx_links_favorite ON links(favorite);
CREATE INDEX idx_links_created ON links(createdat);


