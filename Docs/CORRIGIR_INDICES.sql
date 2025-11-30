-- Execute este SQL no Supabase para corrigir os índices
-- Use este se você já criou as tabelas e só precisa corrigir os índices

-- Remover índices antigos (se existirem)
DROP INDEX IF EXISTS idx_links_category;
DROP INDEX IF EXISTS idx_links_favorite;
DROP INDEX IF EXISTS idx_links_created;

-- Criar índices com os nomes corretos (minúsculas)
CREATE INDEX IF NOT EXISTS idx_links_category ON links(categoryid);
CREATE INDEX IF NOT EXISTS idx_links_favorite ON links(favorite);
CREATE INDEX IF NOT EXISTS idx_links_created ON links(createdat);


