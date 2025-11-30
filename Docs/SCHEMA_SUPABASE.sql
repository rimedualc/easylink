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

