import axios from 'axios';
import type { Link, Category, ApiResponse, LinkFilters } from '../types';

// Usa variável de ambiente em produção, ou /api em desenvolvimento (proxy do Vite)
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.error) {
      error.message = error.response.data.error;
    } else if (error.response?.data?.message) {
      error.message = error.response.data.message;
    }
    return Promise.reject(error);
  }
);

export const linksApi = {
  getAll: async (filters?: LinkFilters): Promise<Link[]> => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.categoryId) params.append('categoryId', String(filters.categoryId));
    if (filters?.favorite !== undefined) params.append('favorite', String(filters.favorite));
    if (filters?.sort) params.append('sort', filters.sort);
    if (filters?.order) params.append('order', filters.order);

    const response = await api.get<ApiResponse<Link[]>>(`/links?${params.toString()}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Erro ao buscar links');
    }
    return response.data.data;
  },

  getById: async (id: number): Promise<Link> => {
    const response = await api.get<ApiResponse<Link>>(`/links/${id}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Erro ao buscar link');
    }
    return response.data.data;
  },

  create: async (data: Omit<Link, 'id' | 'createdAt' | 'updatedAt'>): Promise<Link> => {
    const response = await api.post<ApiResponse<Link>>('/links', data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Erro ao criar link');
    }
    return response.data.data;
  },

  update: async (id: number, data: Partial<Link>): Promise<Link> => {
    const response = await api.put<ApiResponse<Link>>(`/links/${id}`, data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Erro ao atualizar link');
    }
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    const response = await api.delete<ApiResponse<void>>(`/links/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.error || 'Erro ao excluir link');
    }
  },

  toggleFavorite: async (id: number, favorite: boolean): Promise<Link> => {
    return linksApi.update(id, { favorite });
  },
};

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get<ApiResponse<Category[]>>('/categories');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Erro ao buscar categorias');
    }
    return response.data.data;
  },

  create: async (name: string): Promise<Category> => {
    const response = await api.post<ApiResponse<Category>>('/categories', { name });
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Erro ao criar categoria');
    }
    return response.data.data;
  },

  update: async (id: number, name: string): Promise<Category> => {
    const response = await api.put<ApiResponse<Category>>(`/categories/${id}`, { name });
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Erro ao atualizar categoria');
    }
    return response.data.data;
  },

  delete: async (id: number, reassignTo?: number): Promise<void> => {
    const response = await api.delete<ApiResponse<void>>(`/categories/${id}`, {
      data: { reassignTo },
    });
    if (!response.data.success) {
      throw new Error(response.data.error || 'Erro ao excluir categoria');
    }
  },
};

export const exportApi = {
  export: async (): Promise<any> => {
    const response = await api.get<ApiResponse<any>>('/export');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Erro ao exportar dados');
    }
    return response.data.data;
  },

  import: async (data: any): Promise<{ imported: number; skipped: number }> => {
    const response = await api.post<ApiResponse<{ imported: number; skipped: number }>>('/import', data);
    if (!response.data.success) {
      throw new Error(response.data.error || 'Erro ao importar dados');
    }
    return response.data.data || { imported: 0, skipped: 0 };
  },

  clear: async (): Promise<void> => {
    const response = await api.delete<ApiResponse<void>>('/clear');
    if (!response.data.success) {
      throw new Error(response.data.error || 'Erro ao limpar dados');
    }
  },
};

