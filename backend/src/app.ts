import Fastify from 'fastify';
import cors from '@fastify/cors';
import { healthRoutes } from './routes/health';
import { linksRoutes } from './routes/links';
import { categoriesRoutes } from './routes/categories';
import { exportsRoutes } from './routes/exports';

export async function buildApp() {
  const fastify = Fastify({
    logger: process.env.NODE_ENV === 'development',
  });

  // CORS
  await fastify.register(cors, {
    origin: true,
    credentials: true,
  });

  // Error handler global
  fastify.setErrorHandler((error, request, reply) => {
    console.error('Erro global:', error);
    reply.status(error.statusCode || 500).send({
      success: false,
      error: error.message || 'Erro interno do servidor',
    });
  });

  // Rotas
  await fastify.register(healthRoutes);
  await fastify.register(linksRoutes);
  await fastify.register(categoriesRoutes);
  await fastify.register(exportsRoutes);

  return fastify;
}

