import {
  getAllLinks,
  getLinkById,
  createLink as createLinkModel,
  updateLink as updateLinkModel,
  deleteLink as deleteLinkModel,
  getAllCategories,
  getCategoryById,
  createCategory as createCategoryModel,
  updateCategory as updateCategoryModel,
  deleteCategory as deleteCategoryModel,
  Link,
  Category,
  LinkFilters,
} from '../models/linkModel';

export class LinksService {
  async getLinks(filters: LinkFilters): Promise<Link[]> {
    return getAllLinks(filters);
  }

  async getLink(id: number): Promise<Link> {
    const link = await getLinkById(id);
    if (!link) {
      throw new Error('Link não encontrado');
    }
    return link;
  }

  async createLink(data: Omit<Link, 'id' | 'createdAt' | 'updatedAt'>): Promise<Link> {
    return createLinkModel(data);
  }

  async updateLink(id: number, data: Partial<Omit<Link, 'id' | 'createdAt'>>): Promise<Link> {
    return updateLinkModel(id, data);
  }

  async deleteLink(id: number): Promise<void> {
    return deleteLinkModel(id);
  }
}

export class CategoriesService {
  async getCategories(): Promise<Category[]> {
    return getAllCategories();
  }

  async getCategory(id: number): Promise<Category> {
    const category = await getCategoryById(id);
    if (!category) {
      throw new Error('Categoria não encontrada');
    }
    return { ...category, linkCount: 0 };
  }

  async createCategory(name: string): Promise<Category> {
    return createCategoryModel(name);
  }

  async updateCategory(id: number, name: string): Promise<Category> {
    return updateCategoryModel(id, name);
  }

  async deleteCategory(id: number, reassignTo?: number): Promise<void> {
    return deleteCategoryModel(id, reassignTo);
  }
}

