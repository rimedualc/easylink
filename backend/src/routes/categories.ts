import { FastifyInstance } from 'fastify';
import {
  getCategories,
  getCategory,
  createCategoryHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
} from '../controllers/linksController';

export async function categoriesRoutes(fastify: FastifyInstance) {
  fastify.get('/api/categories', getCategories);
  fastify.get('/api/categories/:id', getCategory);
  fastify.post('/api/categories', createCategoryHandler);
  fastify.put('/api/categories/:id', updateCategoryHandler);
  fastify.delete('/api/categories/:id', deleteCategoryHandler);
}

