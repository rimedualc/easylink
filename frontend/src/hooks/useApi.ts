import { useState, useEffect, useCallback } from 'react';
import { linksApi, categoriesApi } from '../services/api';
import { linksCache, categoriesCache } from '../utils/cache';
import type { Link, Category, LinkFilters } from '../types';

export function useLinks(filters?: LinkFilters) {
  // Carregar do cache imediatamente (sem loading)
  const [links, setLinks] = useState<Link[]>(() => {
    const cached = linksCache.get();
    // Aplicar filtros básicos no cache se necessário
    if (cached.length > 0) {
      let filtered = cached;
      if (filters?.search) {
        const search = filters.search.toLowerCase();
        filtered = filtered.filter(l => 
          l.name.toLowerCase().includes(search) || 
          l.url.toLowerCase().includes(search)
        );
      }
      if (filters?.categoryId !== undefined) {
        filtered = filtered.filter(l => l.categoryId === filters.categoryId);
      }
      if (filters?.favorite !== undefined) {
        filtered = filtered.filter(l => l.favorite === filters.favorite);
      }
      return filtered;
    }
    return [];
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  const fetchLinks = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setSyncing(true);
      setError(null);
      
      const data = await linksApi.getAll(filters);
      setLinks(data);
      // Salvar no cache
      linksCache.set(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar links');
      // Se der erro, manter os dados do cache se existirem
      const cached = linksCache.get();
      if (cached.length > 0) {
        let filtered = cached;
        if (filters?.search) {
          const search = filters.search.toLowerCase();
          filtered = filtered.filter(l => 
            l.name.toLowerCase().includes(search) || 
            l.url.toLowerCase().includes(search)
          );
        }
        if (filters?.categoryId !== undefined) {
          filtered = filtered.filter(l => l.categoryId === filters.categoryId);
        }
        if (filters?.favorite !== undefined) {
          filtered = filtered.filter(l => l.favorite === filters.favorite);
        }
        setLinks(filtered);
      }
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }, [filters]);

  useEffect(() => {
    // Carregar do cache primeiro
    const cached = linksCache.get();
    if (cached.length > 0) {
      let filtered = cached;
      if (filters?.search) {
        const search = filters.search.toLowerCase();
        filtered = filtered.filter(l => 
          l.name.toLowerCase().includes(search) || 
          l.url.toLowerCase().includes(search)
        );
      }
      if (filters?.categoryId !== undefined) {
        filtered = filtered.filter(l => l.categoryId === filters.categoryId);
      }
      if (filters?.favorite !== undefined) {
        filtered = filtered.filter(l => l.favorite === filters.favorite);
      }
      setLinks(filtered);
    }
    
    // Sincronizar com o backend em background
    fetchLinks(false);
  }, [fetchLinks, filters]);

  return { links, loading, error, syncing, refetch: () => fetchLinks(true), setLinks };
}

export function useCategories() {
  // Carregar do cache imediatamente (sem loading)
  const [categories, setCategories] = useState<Category[]>(() => {
    return categoriesCache.get();
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  const fetchCategories = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setSyncing(true);
      setError(null);
      
      const data = await categoriesApi.getAll();
      setCategories(data);
      // Salvar no cache
      categoriesCache.set(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar categorias');
      // Se der erro, manter os dados do cache se existirem
      if (categories.length === 0) {
        const cached = categoriesCache.get();
        if (cached.length > 0) {
          setCategories(cached);
        }
      }
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }, [categories.length]);

  useEffect(() => {
    // Carregar do cache primeiro
    const cached = categoriesCache.get();
    if (cached.length > 0) {
      setCategories(cached);
    }
    
    // Sincronizar com o backend em background
    fetchCategories(false);
  }, [fetchCategories]);

  return { categories, loading, error, syncing, refetch: () => fetchCategories(true), setCategories };
}

