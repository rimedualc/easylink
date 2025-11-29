import { useState, useEffect, useCallback } from 'react';
import { linksApi, categoriesApi } from '../services/api';
import type { Link, Category, LinkFilters } from '../types';

export function useLinks(filters?: LinkFilters) {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLinks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await linksApi.getAll(filters);
      setLinks(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar links');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  return { links, loading, error, refetch: fetchLinks };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoriesApi.getAll();
      setCategories(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refetch: fetchCategories };
}

