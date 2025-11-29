import { FastifyRequest, FastifyReply } from 'fastify';
import { LinksService, CategoriesService } from '../services/linksService';
import { AppError, handleError } from '../utils/errors';
import {
  createLinkSchema,
  updateLinkSchema,
  createCategorySchema,
  updateCategorySchema,
} from '../schemas/linkSchemas';

const linksService = new LinksService();
const categoriesService = new CategoriesService();

export async function getLinks(req: FastifyRequest, reply: FastifyReply) {
  try {
    const query = req.query as any;
    const filters = {
      search: query.search,
      categoryId: query.categoryId ? Number(query.categoryId) : undefined,
      favorite: query.favorite !== undefined ? query.favorite === 'true' : undefined,
      sort: query.sort as any,
      order: query.order as any,
      page: query.page ? Number(query.page) : undefined,
      perPage: query.perPage ? Number(query.perPage) : undefined,
    };

    const links = await linksService.getLinks(filters);
    
    reply.send({
      success: true,
      data: links,
    });
  } catch (error) {
    const { statusCode, message } = handleError(error);
    reply.status(statusCode).send({
      success: false,
      error: message,
    });
  }
}

export async function getLink(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: string };
    const link = await linksService.getLink(Number(id));
    
    reply.send({
      success: true,
      data: link,
    });
  } catch (error) {
    const { statusCode, message } = handleError(error);
    reply.status(statusCode).send({
      success: false,
      error: message,
    });
  }
}

export async function createLinkHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const body = req.body as any;
    
    // Normalizar categoryId
    let categoryId: number | null = null;
    if (body.categoryId !== undefined && body.categoryId !== null && body.categoryId !== '') {
      const parsed = Number(body.categoryId);
      if (!isNaN(parsed) && parsed > 0) {
        categoryId = parsed;
      }
    }
    
    const data = createLinkSchema.parse({
      name: body.name,
      url: body.url,
      categoryId: categoryId,
      favorite: body.favorite || false,
    });
    
    const link = await linksService.createLink({
      name: data.name,
      url: data.url,
      categoryId: data.categoryId || null,
      favorite: data.favorite || false,
    });
    
    reply.status(201).send({
      success: true,
      data: link,
    });
  } catch (error: any) {
    console.error('Erro no createLinkHandler:', error);
    const { statusCode, message } = handleError(error);
    reply.status(statusCode).send({
      success: false,
      error: message,
    });
  }
}

export async function updateLinkHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: string };
    const body = req.body as any;
    const linkId = Number(id);
    
    if (isNaN(linkId)) {
      reply.status(400).send({
        success: false,
        error: 'ID inválido',
      });
      return;
    }
    
    // Normalizar categoryId
    let categoryId: number | null = null;
    if (body.categoryId !== undefined && body.categoryId !== null && body.categoryId !== '') {
      const parsed = Number(body.categoryId);
      if (!isNaN(parsed) && parsed > 0) {
        categoryId = parsed;
      }
    }
    
    const data = updateLinkSchema.parse({
      name: body.name,
      url: body.url,
      categoryId: categoryId,
      favorite: body.favorite,
    });
    
    const link = await linksService.updateLink(linkId, data);
    
    reply.send({
      success: true,
      data: link,
    });
  } catch (error: any) {
    console.error('Erro no updateLinkHandler:', error);
    const { statusCode, message } = handleError(error);
    reply.status(statusCode).send({
      success: false,
      error: message,
    });
  }
}

export async function deleteLinkHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: string };
    const linkId = Number(id);
    
    if (isNaN(linkId)) {
      reply.status(400).send({
        success: false,
        error: 'ID inválido',
      });
      return;
    }
    
    await linksService.deleteLink(linkId);
    
    reply.send({
      success: true,
      message: 'Link excluído com sucesso',
    });
  } catch (error: any) {
    console.error('Erro no deleteLinkHandler:', error);
    const { statusCode, message } = handleError(error);
    reply.status(statusCode).send({
      success: false,
      error: message,
    });
  }
}

export async function getCategories(req: FastifyRequest, reply: FastifyReply) {
  try {
    const categories = await categoriesService.getCategories();
    
    reply.send({
      success: true,
      data: categories,
    });
  } catch (error) {
    const { statusCode, message } = handleError(error);
    reply.status(statusCode).send({
      success: false,
      error: message,
    });
  }
}

export async function getCategory(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: string };
    const category = await categoriesService.getCategory(Number(id));
    
    reply.send({
      success: true,
      data: category,
    });
  } catch (error) {
    const { statusCode, message } = handleError(error);
    reply.status(statusCode).send({
      success: false,
      error: message,
    });
  }
}

export async function createCategoryHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const body = req.body as any;
    const name = body?.name;
    
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      reply.status(400).send({
        success: false,
        error: 'Nome da categoria é obrigatório',
      });
      return;
    }
    
    const category = await categoriesService.createCategory(name.trim());
    
    reply.status(201).send({
      success: true,
      data: category,
    });
  } catch (error: any) {
    console.error('Erro no createCategoryHandler:', error);
    const { statusCode, message } = handleError(error);
    reply.status(statusCode).send({
      success: false,
      error: message,
    });
  }
}

export async function updateCategoryHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: string };
    const body = req.body as any;
    const name = body?.name;
    
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      reply.status(400).send({
        success: false,
        error: 'Nome da categoria é obrigatório',
      });
      return;
    }
    
    const categoryId = Number(id);
    if (isNaN(categoryId)) {
      reply.status(400).send({
        success: false,
        error: 'ID inválido',
      });
      return;
    }
    
    const category = await categoriesService.updateCategory(categoryId, name.trim());
    
    reply.send({
      success: true,
      data: category,
    });
  } catch (error: any) {
    console.error('Erro no updateCategoryHandler:', error);
    const { statusCode, message } = handleError(error);
    reply.status(statusCode).send({
      success: false,
      error: message,
    });
  }
}

export async function deleteCategoryHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: string };
    const body = req.body as { reassignTo?: number };
    const categoryId = Number(id);
    
    if (isNaN(categoryId)) {
      reply.status(400).send({
        success: false,
        error: 'ID inválido',
      });
      return;
    }
    
    await categoriesService.deleteCategory(categoryId, body?.reassignTo);
    
    reply.send({
      success: true,
      message: 'Categoria excluída com sucesso',
    });
  } catch (error: any) {
    console.error('Erro no deleteCategoryHandler:', error);
    const { statusCode, message } = handleError(error);
    reply.status(statusCode).send({
      success: false,
      error: message,
    });
  }
}

