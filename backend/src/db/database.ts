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

  // Criar diretório se não existir
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const db = new sqlite3Verbose.Database(dbPath, (err) => {
    if (err) {
      console.error('Erro ao conectar ao banco de dados:', err);
      throw err;
    }
    console.log('Conectado ao banco de dados SQLite');
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
  const migrationsDir = path.join(__dirname, 'migrations');
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

