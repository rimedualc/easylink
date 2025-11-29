import { Search, Filter, X } from 'lucide-react';
import { useState } from 'react';
import type { LinkFilters } from '../../types';

interface SearchFilterProps {
  filters: LinkFilters;
  onFiltersChange: (filters: LinkFilters) => void;
  categories: Array<{ id: number; name: string }>;
}

export function SearchFilter({ filters, onFiltersChange, categories }: SearchFilterProps) {
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value || undefined });
  };

  const handleCategoryChange = (categoryId: string) => {
    onFiltersChange({
      ...filters,
      categoryId: categoryId ? Number(categoryId) : undefined,
    });
  };

  const handleFavoriteToggle = () => {
    onFiltersChange({
      ...filters,
      favorite: filters.favorite === undefined ? true : filters.favorite ? undefined : true,
    });
  };

  const handleSortChange = (sort: LinkFilters['sort']) => {
    onFiltersChange({
      ...filters,
      sort,
      order: filters.order === 'asc' ? 'desc' : 'asc',
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar links..."
            value={filters.search || ''}
            onChange={e => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <Filter className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        {(filters.categoryId || filters.favorite || filters.sort) && (
          <button
            onClick={clearFilters}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            title="Limpar filtros"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        )}
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categoria
            </label>
            <select
              value={filters.categoryId || ''}
              onChange={e => handleCategoryChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Todas</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ordenar por
            </label>
            <select
              value={filters.sort || 'createdAt'}
              onChange={e => handleSortChange(e.target.value as LinkFilters['sort'])}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="createdAt">Data de criação</option>
              <option value="name">Nome (A-Z)</option>
              <option value="favorite">Favoritos primeiro</option>
            </select>
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.favorite === true}
                onChange={handleFavoriteToggle}
                className="w-4 h-4 text-primary rounded focus:ring-primary"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Apenas favoritos
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

