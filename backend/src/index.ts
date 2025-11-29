import 'dotenv/config';
import { buildApp } from './app';
import { initializeDatabase } from './db/database';
import { logger } from './utils/logger';

async function start() {
  try {
    // Inicializar banco de dados
    await initializeDatabase();
    logger.info('Banco de dados inicializado');

    // Construir aplicação
    const app = await buildApp();
    
    const port = Number(process.env.PORT) || 3018;
    const host = '0.0.0.0';

    await app.listen({ port, host });
    logger.info(`Servidor rodando em http://${host}:${port}`);
  } catch (error) {
    logger.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

start();

