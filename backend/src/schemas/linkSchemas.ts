import { z } from 'zod';

export const createLinkSchema = z.object({
  name: z.string().min(1, 'Nome do site é obrigatório').max(200, 'Nome muito longo'),
  url: z.string().url('URL inválida').min(1, 'URL é obrigatória'),
  categoryId: z.union([z.number().int().positive(), z.null()]).optional(),
  favorite: z.boolean().optional(),
});

export const updateLinkSchema = createLinkSchema.partial();

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Nome da categoria é obrigatório').max(100, 'Nome muito longo'),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, 'Nome da categoria é obrigatório').max(100, 'Nome muito longo'),
});

export const importDataSchema = z.object({
  categories: z.array(z.object({
    id: z.number().optional(),
    name: z.string(),
    createdAt: z.string().optional(),
  })).optional(),
  links: z.array(z.object({
    id: z.number().optional(),
    name: z.string(),
    url: z.string(),
    categoryId: z.number().nullable().optional(),
    favorite: z.boolean().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  })).optional(),
});

