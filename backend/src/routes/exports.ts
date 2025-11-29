import { FastifyInstance } from 'fastify';
import { getAllLinks, getAllCategories } from '../models/linkModel';
import { handleError } from '../utils/errors';

export async function exportsRoutes(fastify: FastifyInstance) {
  fastify.get('/api/export', async (request, reply) => {
    try {
      const links = await getAllLinks({});
      const categories = await getAllCategories();

      const exportData = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        categories: categories.map(c => ({
          id: c.id,
          name: c.name,
          createdAt: c.createdAt,
        })),
        links: links.map(l => ({
          id: l.id,
          name: l.name,
          url: l.url,
          categoryId: l.categoryId,
          favorite: l.favorite,
          createdAt: l.createdAt,
          updatedAt: l.updatedAt,
        })),
      };

      reply.send({
        success: true,
        data: exportData,
      });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      reply.status(statusCode).send({
        success: false,
        error: message,
      });
    }
  });

  fastify.post('/api/import', async (request, reply) => {
    try {
      const { importDataSchema } = await import('../schemas/linkSchemas');
      const data = importDataSchema.parse(request.body);
      const { createCategory, createLink, getAllCategories } = await import('../models/linkModel');

      const categoryMap = new Map<number, number>();
      let importedCount = 0;
      let skippedCount = 0;

      // Importar categorias
      if (data.categories) {
        for (const cat of data.categories) {
          try {
            const newCat = await createCategory(cat.name);
            if (cat.id) {
              categoryMap.set(cat.id, newCat.id);
            }
          } catch (error: any) {
            // Categoria já existe, buscar pelo nome
            if (error.statusCode === 409) {
              const { getAllCategories } = await import('../models/linkModel');
              const existing = await getAllCategories();
              const found = existing.find(c => c.name === cat.name);
              if (found && cat.id) {
                categoryMap.set(cat.id, found.id);
              }
            }
          }
        }
      }

      // Importar links
      if (data.links) {
        for (const link of data.links) {
          try {
            // Verificar duplicados por URL
            const { getAllLinks } = await import('../models/linkModel');
            const existing = await getAllLinks({ search: link.url });
            const isDuplicate = existing.some(l => l.url === link.url);

            if (!isDuplicate) {
              await createLink({
                name: link.name,
                url: link.url,
                categoryId: link.categoryId ? (categoryMap.get(link.categoryId) || link.categoryId) : null,
                favorite: link.favorite || false,
              });
              importedCount++;
            } else {
              skippedCount++;
            }
          } catch (error) {
            skippedCount++;
          }
        }
      }

      reply.send({
        success: true,
        message: `Importação concluída: ${importedCount} importados, ${skippedCount} ignorados`,
        data: {
          imported: importedCount,
          skipped: skippedCount,
        },
      });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      reply.status(statusCode).send({
        success: false,
        error: message,
      });
    }
  });

  fastify.delete('/api/clear', async (request, reply) => {
    try {
      const { clearAllData } = await import('../models/linkModel');
      await clearAllData();
      
      reply.send({
        success: true,
        message: 'Todos os dados foram excluídos com sucesso',
      });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      reply.status(statusCode).send({
        success: false,
        error: message,
      });
    }
  });
}

