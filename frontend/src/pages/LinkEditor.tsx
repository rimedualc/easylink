import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Link, Category } from '../types';

const linkSchema = z.object({
  name: z.string().min(1, 'Nome do site é obrigatório'),
  url: z.string().url('URL inválida').min(1, 'URL é obrigatória'),
  categoryId: z.number().nullable().optional(),
  favorite: z.boolean().optional(),
});

type LinkFormData = z.infer<typeof linkSchema>;

interface LinkEditorProps {
  link?: Link;
  categories: Category[];
  onSave: (data: Partial<Link>) => Promise<void>;
  onCancel: () => void;
  onCreateCategory?: (name: string) => Promise<Category>;
  onCategoriesChange?: () => void;
}

export function LinkEditor({ link, categories, onSave, onCancel, onCreateCategory, onCategoriesChange }: LinkEditorProps) {
  const [newCategoryName, setNewCategoryName] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<LinkFormData>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      name: link?.name || '',
      url: link?.url || '',
      categoryId: link?.categoryId || null,
      favorite: link?.favorite || false,
    },
  });

  const categoryId = watch('categoryId');

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim() || !onCreateCategory) return;
    try {
      const newCategory = await onCreateCategory(newCategoryName.trim());
      setNewCategoryName('');
      // Atualizar lista de categorias
      if (onCategoriesChange) {
        onCategoriesChange();
      }
      // Selecionar a nova categoria automaticamente após um pequeno delay
      setTimeout(() => {
        if (newCategory && newCategory.id) {
          setValue('categoryId', newCategory.id);
        }
      }, 100);
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
    }
  };

  const onSubmit = async (data: LinkFormData) => {
    await onSave(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Nome do Site *
        </label>
        <input
          {...register('name')}
          placeholder="Ex: Google"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          URL *
        </label>
        <input
          {...register('url')}
          placeholder="https://www.exemplo.com"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.url && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.url.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Categoria
        </label>
        <select
          {...register('categoryId', { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary mb-2"
        >
          <option value="">Sem categoria</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {onCreateCategory && (
          <div className="flex gap-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={e => setNewCategoryName(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleCreateCategory())}
              placeholder="Ou criar nova categoria"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              onClick={handleCreateCategory}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Criar
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            {...register('favorite')}
            className="w-4 h-4 text-primary rounded focus:ring-primary"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Favorito</span>
        </label>
      </div>

      <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

