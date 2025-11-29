import { FastifyInstance } from 'fastify';

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async (request, reply) => {
    return {
      success: true,
      message: 'API está funcionando',
      timestamp: new Date().toISOString(),
    };
  });
}

