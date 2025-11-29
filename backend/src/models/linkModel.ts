import { getDatabase } from '../db/database';
import { AppError } from '../utils/errors';

export interface Link {
  id: number;
  name: string;
  url: string;
  categoryId?: number | null;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
  categoryName?: string;
}

export interface Category {
  id: number;
  name: string;
  createdAt: string;
  linkCount?: number;
}

export interface LinkFilters {
  search?: string;
  categoryId?: number;
  favorite?: boolean;
  sort?: 'createdAt' | 'name' | 'favorite';
  order?: 'asc' | 'desc';
  page?: number;
  perPage?: number;
}

export async function getAllLinks(filters: LinkFilters = {}): Promise<Link[]> {
  const db = getDatabase();
  let query = `
    SELECT 
      l.*,
      c.name as categoryName
    FROM links l
    LEFT JOIN categories c ON l.categoryId = c.id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (filters.search) {
    query += ` AND (l.name LIKE ? OR l.url LIKE ?)`;
    const searchTerm = `%${filters.search}%`;
    params.push(searchTerm, searchTerm);
  }

  if (filters.categoryId !== undefined) {
    query += ` AND l.categoryId = ?`;
    params.push(filters.categoryId);
  }

  if (filters.favorite !== undefined) {
    query += ` AND l.favorite = ?`;
    params.push(filters.favorite ? 1 : 0);
  }

  // Ordenação
  const sortField = filters.sort || 'createdAt';
  const sortOrder = filters.order || 'desc';
  
  if (sortField === 'favorite') {
    query += ` ORDER BY l.favorite DESC, l.createdAt DESC`;
  } else if (sortField === 'name') {
    query += ` ORDER BY l.name ${sortOrder.toUpperCase()}`;
  } else {
    query += ` ORDER BY l.createdAt ${sortOrder.toUpperCase()}`;
  }

  // Paginação
  if (filters.page && filters.perPage) {
    const offset = (filters.page - 1) * filters.perPage;
    query += ` LIMIT ? OFFSET ?`;
    params.push(filters.perPage, offset);
  }

  const rows = await db.all<Link>(query, params);
  
  return rows.map(row => ({
    ...row,
    favorite: Boolean(row.favorite),
  }));
}

export async function getLinkById(id: number): Promise<Link | null> {
  const db = getDatabase();
  const row = await db.get<Link>(
    `SELECT l.*, c.name as categoryName 
     FROM links l 
     LEFT JOIN categories c ON l.categoryId = c.id 
     WHERE l.id = ?`,
    [id]
  );

  if (!row) return null;

  return {
    ...row,
    favorite: Boolean(row.favorite),
  };
}

export async function createLink(data: Omit<Link, 'id' | 'createdAt' | 'updatedAt'>): Promise<Link> {
  const db = getDatabase();
  
  try {
    const result = await db.run(
      `INSERT INTO links (name, url, categoryId, favorite)
       VALUES (?, ?, ?, ?)`,
      [
        data.name,
        data.url,
        data.categoryId !== undefined && data.categoryId !== null ? data.categoryId : null,
        data.favorite ? 1 : 0,
      ]
    );

    if (!result || result.lastID === undefined || result.lastID === 0) {
      throw new AppError(500, 'Erro ao criar link: ID não retornado');
    }

    const link = await getLinkById(result.lastID);
    if (!link) {
      throw new AppError(500, 'Erro ao criar link: Link não encontrado após criação');
    }

    return link;
  } catch (error: any) {
    console.error('Erro ao criar link:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(500, error.message || 'Erro ao criar link');
  }
}

export async function updateLink(id: number, data: Partial<Omit<Link, 'id' | 'createdAt'>>): Promise<Link> {
  const db = getDatabase();
  
  const updates: string[] = [];
  const params: any[] = [];

  if (data.name !== undefined) {
    updates.push('name = ?');
    params.push(data.name);
  }
  if (data.url !== undefined) {
    updates.push('url = ?');
    params.push(data.url);
  }
  if (data.categoryId !== undefined) {
    updates.push('categoryId = ?');
    params.push(data.categoryId);
  }
  if (data.favorite !== undefined) {
    updates.push('favorite = ?');
    params.push(data.favorite ? 1 : 0);
  }

  updates.push('updatedAt = CURRENT_TIMESTAMP');
  params.push(id);

  await db.run(
    `UPDATE links SET ${updates.join(', ')} WHERE id = ?`,
    params
  );

  const link = await getLinkById(id);
  if (!link) {
    throw new AppError(404, 'Link não encontrado');
  }

  return link;
}

export async function deleteLink(id: number): Promise<void> {
  const db = getDatabase();
  try {
    const result = await db.run('DELETE FROM links WHERE id = ?', [id]);
    
    if (result.changes === 0) {
      throw new AppError(404, 'Link não encontrado');
    }
  } catch (error: any) {
    console.error('Erro ao excluir link:', error);
    throw new AppError(500, error.message || 'Erro ao excluir link');
  }
}

export async function getAllCategories(): Promise<Category[]> {
  const db = getDatabase();
  const rows = await db.all<Category & { linkCount: number }>(
    `SELECT c.*, COUNT(l.id) as linkCount
     FROM categories c
     LEFT JOIN links l ON c.id = l.categoryId
     GROUP BY c.id
     ORDER BY c.name`
  );

  return rows.map(row => ({
    id: row.id,
    name: row.name,
    createdAt: row.createdAt,
    linkCount: row.linkCount || 0,
  }));
}

export async function getCategoryById(id: number): Promise<Category | null> {
  const db = getDatabase();
  return await db.get<Category>('SELECT * FROM categories WHERE id = ?', [id]);
}

export async function createCategory(name: string): Promise<Category> {
  const db = getDatabase();
  
  // Verificar se a categoria já existe antes de tentar criar
  const existing = await db.get<Category>('SELECT * FROM categories WHERE name = ?', [name]);
  if (existing) {
    // Se já existe, retornar a categoria existente
    const linkCount = await db.get<{ count: number }>(
      'SELECT COUNT(*) as count FROM links WHERE categoryId = ?',
      [existing.id]
    );
    return { ...existing, linkCount: linkCount?.count || 0 };
  }
  
  try {
    const result = await db.run('INSERT INTO categories (name) VALUES (?)', [name]);
    
    if (!result || result.lastID === undefined || result.lastID === 0) {
      throw new AppError(500, 'Erro ao criar categoria: ID não retornado');
    }
    
    const category = await getCategoryById(result.lastID);
    
    if (!category) {
      throw new AppError(500, 'Erro ao criar categoria: Categoria não encontrada após criação');
    }
    
    return { ...category, linkCount: 0 };
  } catch (error: any) {
    if (error.message?.includes('UNIQUE constraint')) {
      // Se ainda assim der erro de UNIQUE (race condition), buscar novamente
      const existingAfter = await db.get<Category>('SELECT * FROM categories WHERE name = ?', [name]);
      if (existingAfter) {
        const linkCount = await db.get<{ count: number }>(
          'SELECT COUNT(*) as count FROM links WHERE categoryId = ?',
          [existingAfter.id]
        );
        return { ...existingAfter, linkCount: linkCount?.count || 0 };
      }
      throw new AppError(409, 'Categoria já existe');
    }
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(500, error.message || 'Erro ao criar categoria');
  }
}

export async function updateCategory(id: number, name: string): Promise<Category> {
  const db = getDatabase();
  
  try {
    await db.run('UPDATE categories SET name = ? WHERE id = ?', [name, id]);
    const category = await getCategoryById(id);
    
    if (!category) {
      throw new AppError(404, 'Categoria não encontrada');
    }
    
    const linkCount = await db.get<{ count: number }>(
      'SELECT COUNT(*) as count FROM links WHERE categoryId = ?',
      [id]
    );
    
    return { ...category, linkCount: linkCount?.count || 0 };
  } catch (error: any) {
    if (error.message?.includes('UNIQUE constraint')) {
      throw new AppError(409, 'Categoria já existe');
    }
    throw error;
  }
}

export async function deleteCategory(id: number, reassignTo?: number): Promise<void> {
  const db = getDatabase();
  
  if (reassignTo) {
    await db.run('UPDATE links SET categoryId = ? WHERE categoryId = ?', [reassignTo, id]);
  } else {
    await db.run('UPDATE links SET categoryId = NULL WHERE categoryId = ?', [id]);
  }
  
  const result = await db.run('DELETE FROM categories WHERE id = ?', [id]);
  
  if (result.changes === 0) {
    throw new AppError(404, 'Categoria não encontrada');
  }
}

export async function clearAllData(): Promise<void> {
  const db = getDatabase();
  
  // Deletar todos os links
  await db.run('DELETE FROM links');
  
  // Deletar todas as categorias
  await db.run('DELETE FROM categories');
}

