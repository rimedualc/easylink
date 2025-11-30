import { Pool, QueryResult } from 'pg';

export interface Database {
  run: (sql: string, params?: any[]) => Promise<{ lastID: number; changes: number }>;
  get: <T = any>(sql: string, params?: any[]) => Promise<T | undefined>;
  all: <T = any>(sql: string, params?: any[]) => Promise<T[]>;
  close: () => Promise<void>;
}

let pool: Pool | null = null;

function getPool(): Pool {
  if (pool) {
    return pool;
  }

  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error('DATABASE_URL não configurada. Configure a variável de ambiente DATABASE_URL com a connection string do Supabase.');
  }

  console.log('Conectando ao banco de dados PostgreSQL (Supabase)...');

  pool = new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  pool.on('error', (err) => {
    console.error('Erro inesperado no pool do PostgreSQL:', err);
  });

  return pool;
}

// Converter queries SQLite (?) para PostgreSQL ($1, $2, ...)
function convertQuery(sql: string, params?: any[]): { sql: string; params: any[] } {
  if (!params || params.length === 0) {
    return { sql, params: [] };
  }

  let paramIndex = 1;
  const convertedParams: any[] = [];
  const convertedSql = sql.replace(/\?/g, () => {
    convertedParams.push(params[paramIndex - 1]);
    return `$${paramIndex++}`;
  });

  return { sql: convertedSql, params: convertedParams };
}

export function getDatabase(): Database {
  const pool = getPool();

  return {
    async run(sql: string, params?: any[]): Promise<{ lastID: number; changes: number }> {
      const { sql: convertedSql, params: convertedParams } = convertQuery(sql, params);
      
      // Para INSERT, retornar o id inserido
      if (sql.trim().toUpperCase().startsWith('INSERT')) {
        const result = await pool.query(`${convertedSql} RETURNING id`, convertedParams);
        return {
          lastID: result.rows[0]?.id || 0,
          changes: result.rowCount || 0,
        };
      }
      
      // Para UPDATE/DELETE, retornar número de linhas afetadas
      const result = await pool.query(convertedSql, convertedParams);
      return {
        lastID: 0,
        changes: result.rowCount || 0,
      };
    },

    async get<T = any>(sql: string, params?: any[]): Promise<T | undefined> {
      const { sql: convertedSql, params: convertedParams } = convertQuery(sql, params);
      const result = await pool.query(convertedSql, convertedParams);
      return result.rows[0] as T | undefined;
    },

    async all<T = any>(sql: string, params?: any[]): Promise<T[]> {
      const { sql: convertedSql, params: convertedParams } = convertQuery(sql, params);
      const result = await pool.query(convertedSql, convertedParams);
      return result.rows as T[];
    },

    async close(): Promise<void> {
      if (pool) {
        await pool.end();
        pool = null;
      }
    },
  };
}

export async function initializeDatabase(): Promise<void> {
  const db = getDatabase();
  
  // Verificar conexão
  try {
    await db.get('SELECT 1');
    console.log('✅ Conectado ao banco de dados PostgreSQL (Supabase)');
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error);
    throw error;
  }
  
  // As tabelas já foram criadas no Supabase, então não precisamos executar migrations
  console.log('✅ Banco de dados inicializado (tabelas já existem no Supabase)');
}
