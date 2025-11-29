import { FastifyInstance } from 'fastify';
import {
  getLinks,
  getLink,
  createLinkHandler,
  updateLinkHandler,
  deleteLinkHandler,
} from '../controllers/linksController';

export async function linksRoutes(fastify: FastifyInstance) {
  fastify.get('/api/links', getLinks);
  fastify.get('/api/links/:id', getLink);
  fastify.post('/api/links', createLinkHandler);
  fastify.put('/api/links/:id', updateLinkHandler);
  fastify.delete('/api/links/:id', deleteLinkHandler);
}

