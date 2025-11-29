-- Tabela de categorias
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de links
CREATE TABLE IF NOT EXISTS links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  categoryId INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  favorite INTEGER DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de configurações
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_links_category ON links(categoryId);
CREATE INDEX IF NOT EXISTS idx_links_favorite ON links(favorite);
CREATE INDEX IF NOT EXISTS idx_links_created ON links(createdAt);

