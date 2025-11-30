import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const sqlite3Verbose = sqlite3.verbose();

export interface Database {
  run: (sql: string, params?: any[]) => Promise<{ lastID: number; changes: number }>;
  get: <T = any>(sql: string, params?: any[]) => Promise<T | undefined>;
  all: <T = any>(sql: string, params?: any[]) => Promise<T[]>;
  close: () => Promise<void>;
}

let dbInstance: Database | null = null;

export function getDatabase(): Database {
  if (dbInstance) {
    return dbInstance;
  }

  const dbPath = process.env.DB_PATH || './data/easylink.db';
  const dbDir = path.dirname(dbPath);

  // Log para debug
  console.log('DB_PATH configurado:', dbPath);
  console.log('Diretório do banco:', dbDir);
  console.log('Diretório existe?', fs.existsSync(dbDir));

  // Criar diretório se não existir
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
    console.log('Diretório criado:', dbDir);
  }

  const db = new sqlite3Verbose.Database(dbPath, (err) => {
    if (err) {
      console.error('Erro ao conectar ao banco de dados:', err);
      throw err;
    }
    console.log('Conectado ao banco de dados SQLite em:', dbPath);
    console.log('Arquivo existe?', fs.existsSync(dbPath));
  });

  // Habilitar foreign keys
  db.run('PRAGMA foreign_keys = ON');

  // Promisificar métodos
  dbInstance = {
    run: (sql: string, params?: any[]): Promise<{ lastID: number; changes: number }> => {
      return new Promise((resolve, reject) => {
        db.run(sql, params || [], function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({
              lastID: this.lastID || 0,
              changes: this.changes || 0,
            });
          }
        });
      });
    },
    get: promisify(db.get.bind(db)) as any,
    all: promisify(db.all.bind(db)) as any,
    close: promisify(db.close.bind(db)) as any,
  };

  return dbInstance;
}

export async function initializeDatabase(): Promise<void> {
  const db = getDatabase();
  const fs = require('fs');
  const path = require('path');

  // Executar migrations
  // Em produção (compilado), __dirname aponta para dist/db/, então voltamos para src/db/migrations
  // Em desenvolvimento, __dirname já aponta para src/db/
  const migrationsDir = process.env.NODE_ENV === 'production' 
    ? path.resolve(__dirname, '../../src/db/migrations')
    : path.join(__dirname, 'migrations');
  
  const migrationFiles = fs.readdirSync(migrationsDir).sort();

  for (const file of migrationFiles) {
    if (file.endsWith('.sql')) {
      const migrationPath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(migrationPath, 'utf-8');
      
      // Executar cada statement separadamente
      const statements = sql.split(';').filter((s: string) => s.trim().length > 0);
      
      for (const statement of statements) {
        try {
          await db.run(statement);
          console.log(`Migration executada: ${file}`);
        } catch (error) {
          console.error(`Erro ao executar migration ${file}:`, error);
        }
      }
    }
  }
}

