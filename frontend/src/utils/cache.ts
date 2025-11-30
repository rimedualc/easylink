import type { Link, Category } from '../types';

const CACHE_KEYS = {
  links: 'easylink_links_cache',
  categories: 'easylink_categories_cache',
  lastSync: 'easylink_last_sync',
} as const;

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export interface CacheData<T> {
  data: T;
  timestamp: number;
}

// Links Cache
export const linksCache = {
  get(): Link[] {
    try {
      const cached = localStorage.getItem(CACHE_KEYS.links);
      if (!cached) return [];
      
      const parsed: CacheData<Link[]> = JSON.parse(cached);
      const now = Date.now();
      
      // Se o cache expirou, retornar vazio
      if (now - parsed.timestamp > CACHE_DURATION) {
        return [];
      }
      
      return parsed.data;
    } catch {
      return [];
    }
  },

  set(links: Link[]): void {
    try {
      const cacheData: CacheData<Link[]> = {
        data: links,
        timestamp: Date.now(),
      };
      localStorage.setItem(CACHE_KEYS.links, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Erro ao salvar cache de links:', error);
    }
  },

  clear(): void {
    localStorage.removeItem(CACHE_KEYS.links);
  },

  isValid(): boolean {
    try {
      const cached = localStorage.getItem(CACHE_KEYS.links);
      if (!cached) return false;
      
      const parsed: CacheData<Link[]> = JSON.parse(cached);
      const now = Date.now();
      
      return now - parsed.timestamp <= CACHE_DURATION;
    } catch {
      return false;
    }
  },
};

// Categories Cache
export const categoriesCache = {
  get(): Category[] {
    try {
      const cached = localStorage.getItem(CACHE_KEYS.categories);
      if (!cached) return [];
      
      const parsed: CacheData<Category[]> = JSON.parse(cached);
      const now = Date.now();
      
      if (now - parsed.timestamp > CACHE_DURATION) {
        return [];
      }
      
      return parsed.data;
    } catch {
      return [];
    }
  },

  set(categories: Category[]): void {
    try {
      const cacheData: CacheData<Category[]> = {
        data: categories,
        timestamp: Date.now(),
      };
      localStorage.setItem(CACHE_KEYS.categories, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Erro ao salvar cache de categorias:', error);
    }
  },

  clear(): void {
    localStorage.removeItem(CACHE_KEYS.categories);
  },

  isValid(): boolean {
    try {
      const cached = localStorage.getItem(CACHE_KEYS.categories);
      if (!cached) return false;
      
      const parsed: CacheData<Category[]> = JSON.parse(cached);
      const now = Date.now();
      
      return now - parsed.timestamp <= CACHE_DURATION;
    } catch {
      return false;
    }
  },
};

// Limpar todo o cache
export function clearAllCache(): void {
  linksCache.clear();
  categoriesCache.clear();
  localStorage.removeItem(CACHE_KEYS.lastSync);
}

