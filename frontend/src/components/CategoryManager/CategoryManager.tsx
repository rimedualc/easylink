import { useState } from 'react';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
import { Modal } from '../Modal/Modal';
import type { Category } from '../../types';

interface CategoryManagerProps {
  categories: Category[];
  onCreate: (name: string) => Promise<void>;
  onUpdate: (id: number, name: string) => Promise<void>;
  onDelete: (id: number, reassignTo?: number) => Promise<void>;
}

export function CategoryManager({
  categories,
  onCreate,
  onUpdate,
  onDelete,
}: CategoryManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const handleCreate = async () => {
    if (!newCategoryName.trim()) return;
    try {
      await onCreate(newCategoryName.trim());
      setNewCategoryName('');
    } catch (error: any) {
      console.error('Erro ao criar categoria:', error);
    }
  };

  const handleUpdate = async () => {
    if (!editingCategory || !newCategoryName.trim()) return;
    await onUpdate(editingCategory.id, newCategoryName.trim());
    setEditingCategory(null);
    setNewCategoryName('');
  };

  const handleDelete = async (id: number) => {
    await onDelete(id);
    setDeleteConfirm(null);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
      >
        <Tag className="w-4 h-4 text-primary-custom" />
        Gerenciar Categorias
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Gerenciar Categorias" size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {editingCategory ? 'Editar Categoria' : 'Criar Nova Categoria'}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={editingCategory ? 'Novo nome da categoria' : 'Digite o nome da categoria'}
                value={newCategoryName}
                onChange={e => setNewCategoryName(e.target.value)}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (editingCategory) {
                      handleUpdate();
                    } else {
                      handleCreate();
                    }
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
              <button
                onClick={editingCategory ? handleUpdate : handleCreate}
                disabled={!newCategoryName.trim()}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                title={editingCategory ? 'Salvar alterações' : 'Criar categoria'}
              >
                {editingCategory ? (
                  'Salvar'
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span className="hidden sm:inline">Criar</span>
                  </>
                )}
              </button>
              {editingCategory && (
                <button
                  onClick={() => {
                    setEditingCategory(null);
                    setNewCategoryName('');
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
              )}
            </div>
            {!editingCategory && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Digite o nome e pressione Enter ou clique no botão "+ Criar"
              </p>
            )}
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {categories.map(category => (
              <div
                key={category.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100">{category.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {category.linkCount || 0} link(s)
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingCategory(category);
                      setNewCategoryName(category.name);
                    }}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                    aria-label="Editar"
                  >
                    <Edit className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(category.id)}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    aria-label="Excluir"
                    disabled={(category.linkCount || 0) > 0}
                  >
                    <Trash2
                      className={`w-4 h-4 ${
                        (category.linkCount || 0) > 0
                          ? 'text-gray-300 dark:text-gray-600'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {deleteConfirm && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-200 mb-2">
                Tem certeza que deseja excluir esta categoria?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                >
                  Excluir
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}

