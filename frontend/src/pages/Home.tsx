import { useState } from 'react';
import { Topbar } from '../components/Topbar/Topbar';
import { SearchFilter } from '../components/SearchFilter/SearchFilter';
import { LinkGrid } from '../components/LinkGrid/LinkGrid';
import { Modal } from '../components/Modal/Modal';
import { ConfirmModal } from '../components/ConfirmModal/ConfirmModal';
import { ToastContainer } from '../components/Toast/Toast';
import { FloatingInfo } from '../components/FloatingInfo/FloatingInfo';
import { FloatingScrollToTop } from '../components/FloatingScrollToTop/FloatingScrollToTop';
import { LinkEditor } from './LinkEditor';
import { useLinks, useCategories } from '../hooks/useApi';
import { useToasts } from '../hooks/useToasts';
import { linksApi, categoriesApi, exportApi } from '../services/api';
import { linksCache, categoriesCache } from '../utils/cache';
import type { Link, LinkFilters, Category } from '../types';

export function Home() {
  const [filters, setFilters] = useState<LinkFilters>({});
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Link | null>(null);
  const { toasts, addToast, removeToast } = useToasts();
  const { links, loading, refetch, setLinks } = useLinks(filters);
  const { categories, refetch: refetchCategories, setCategories } = useCategories();

  const handleOpen = (link: Link) => {
    // Link já é aberto no LinkCard
    addToast(`Abrindo ${link.name}...`, 'info');
  };

  const handleEdit = (link: Link) => {
    setEditingLink(link);
  };

  const handleDelete = (link: Link) => {
    setDeleteConfirm(link);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      // Atualizar cache local imediatamente
      const cached = linksCache.get();
      const updated = cached.filter(l => l.id !== deleteConfirm.id);
      linksCache.set(updated);
      setLinks(updated);
      
      // Sincronizar com backend em background
      await linksApi.delete(deleteConfirm.id);
      addToast('Link excluído com sucesso!');
      setDeleteConfirm(null);
      
      // Atualizar do servidor em background
      setTimeout(() => {
        refetch();
      }, 100);
    } catch (error: any) {
      console.error('Erro ao excluir link:', error);
      addToast(error.message || 'Erro ao excluir link', 'error');
      setDeleteConfirm(null);
      setTimeout(() => {
        refetch();
      }, 100);
    }
  };

  const handleToggleFavorite = async (link: Link) => {
    try {
      // Atualizar cache local imediatamente
      const cached = linksCache.get();
      const updated = cached.map(l => 
        l.id === link.id ? { ...l, favorite: !l.favorite } : l
      );
      linksCache.set(updated);
      setLinks(updated);
      
      // Sincronizar com backend em background
      await linksApi.toggleFavorite(link.id, !link.favorite);
      addToast(
        link.favorite ? 'Removido dos favoritos' : 'Adicionado aos favoritos'
      );
      
      // Atualizar do servidor em background
      setTimeout(() => {
        refetch();
      }, 100);
    } catch (error: any) {
      addToast(error.message || 'Erro ao atualizar favorito', 'error');
      // Reverter mudança no cache em caso de erro
      refetch();
    }
  };

  const handleCreateCategory = async (name: string): Promise<Category> => {
    try {
      // Atualizar cache local imediatamente
      const cached = categoriesCache.get();
      const tempCategory: Category = {
        id: Date.now(),
        name,
        createdAt: new Date().toISOString(),
      };
      const updated = [...cached, tempCategory];
      categoriesCache.set(updated);
      setCategories(updated);
      
      // Sincronizar com backend em background
      const newCategory = await categoriesApi.create(name);
      
      // Atualizar com categoria real do servidor
      const finalUpdated = cached.map(c => c.id === tempCategory.id ? newCategory : c);
      categoriesCache.set(finalUpdated);
      setCategories(finalUpdated);
      
      addToast('Categoria criada com sucesso!');
      return newCategory;
    } catch (error: any) {
      console.error('Erro ao criar categoria:', error);
      setTimeout(async () => {
        await refetchCategories();
      }, 100);
      
      if (error.message?.includes('409') || error.message?.includes('já existe')) {
        addToast('Esta categoria já existe! Ela foi adicionada à lista.', 'info');
        try {
          const allCategories = await categoriesApi.getAll();
          const existing = allCategories.find(c => c.name.toLowerCase() === name.toLowerCase());
          if (existing) {
            return existing;
          }
        } catch (e) {
          // Ignorar erro ao buscar
        }
        // Se não encontrou a categoria, lança erro
        throw new Error('Categoria não encontrada após criação');
      } else {
        addToast(error.message || 'Erro ao criar categoria', 'error');
        throw error;
      }
    }
  };

  const handleUpdateCategory = async (id: number, name: string) => {
    try {
      // Atualizar cache local imediatamente
      const cached = categoriesCache.get();
      const updated = cached.map(c => 
        c.id === id ? { ...c, name } : c
      );
      categoriesCache.set(updated);
      setCategories(updated);
      
      // Sincronizar com backend em background
      await categoriesApi.update(id, name);
      addToast('Categoria atualizada com sucesso!');
      
      // Atualizar do servidor em background
      setTimeout(() => {
        refetchCategories();
      }, 100);
    } catch (error: any) {
      addToast(error.message || 'Erro ao atualizar categoria', 'error');
    }
  };

  const handleDeleteCategory = async (id: number, reassignTo?: number) => {
    try {
      // Atualizar cache local imediatamente
      const cached = categoriesCache.get();
      const updated = cached.filter(c => c.id !== id);
      categoriesCache.set(updated);
      setCategories(updated);
      
      // Atualizar links se necessário
      if (reassignTo) {
        const linksCached = linksCache.get();
        const linksUpdated = linksCached.map(l => 
          l.categoryId === id ? { ...l, categoryId: reassignTo } : l
        );
        linksCache.set(linksUpdated);
        setLinks(linksUpdated);
      } else {
        const linksCached = linksCache.get();
        const linksUpdated = linksCached.map(l => 
          l.categoryId === id ? { ...l, categoryId: null } : l
        );
        linksCache.set(linksUpdated);
        setLinks(linksUpdated);
      }
      
      // Sincronizar com backend em background
      await categoriesApi.delete(id, reassignTo);
      addToast('Categoria excluída com sucesso!');
      
      // Atualizar do servidor em background
      setTimeout(() => {
        refetchCategories();
        refetch();
      }, 100);
    } catch (error: any) {
      console.error('Erro ao excluir categoria:', error);
      addToast(error.message || 'Erro ao excluir categoria', 'error');
      setTimeout(() => {
        refetchCategories();
        refetch();
      }, 100);
    }
  };

  const handleExport = async () => {
    try {
      const data = await exportApi.export();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `easylink-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addToast('Dados exportados com sucesso!');
    } catch (error: any) {
      addToast(error.message || 'Erro ao exportar dados', 'error');
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const text = await file.text();
        const data = JSON.parse(text);
        const result = await exportApi.import(data);
        addToast(
          `Importação concluída: ${result.imported} importados, ${result.skipped} ignorados`
        );
        refetch();
        refetchCategories();
      } catch (error: any) {
        addToast(error.message || 'Erro ao importar dados', 'error');
      }
    };
    input.click();
  };

  const handleClear = async () => {
    try {
      await exportApi.clear();
      addToast('Banco de dados limpo com sucesso!');
      refetch();
      refetchCategories();
    } catch (error: any) {
      addToast(error.message || 'Erro ao limpar banco de dados', 'error');
    }
  };

  const handleSaveLink = async (data: Partial<Link>) => {
    try {
      if (editingLink) {
        // Atualizar cache local imediatamente
        const cached = linksCache.get();
        const updated = cached.map(l => 
          l.id === editingLink.id 
            ? { ...l, ...data, updatedAt: new Date().toISOString() }
            : l
        );
        linksCache.set(updated);
        setLinks(updated);
        
        // Sincronizar com backend em background
        await linksApi.update(editingLink.id, data);
        addToast('Link atualizado com sucesso!');
      } else {
        // Criar link temporário no cache
        const tempLink: Link = {
          id: Date.now(), // ID temporário
          name: data.name || '',
          url: data.url || '',
          categoryId: data.categoryId || null,
          favorite: data.favorite || false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        const cached = linksCache.get();
        const updated = [...cached, tempLink];
        linksCache.set(updated);
        setLinks(updated);
        
        // Sincronizar com backend em background
        const newLink = await linksApi.create(data as Omit<Link, 'id' | 'createdAt' | 'updatedAt'>);
        
        // Atualizar com o link real do servidor
        const finalUpdated = cached.map(l => l.id === tempLink.id ? newLink : l);
        linksCache.set(finalUpdated);
        setLinks(finalUpdated);
        
        addToast('Link criado com sucesso!');
      }
      setEditingLink(null);
      setIsCreating(false);
      
      // Atualizar do servidor em background
      setTimeout(() => {
        refetch();
      }, 100);
    } catch (error: any) {
      console.error('Erro ao salvar link:', error);
      addToast(error.message || 'Erro ao salvar link', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Topbar
        onNewLink={() => setIsCreating(true)}
        onExport={handleExport}
        onImport={handleImport}
        onClear={handleClear}
        categories={categories}
        onCreateCategory={async (name: string) => {
          await handleCreateCategory(name);
        }}
        onUpdateCategory={handleUpdateCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      <main className="container mx-auto px-4 py-8 flex-1">
        <SearchFilter
          filters={filters}
          onFiltersChange={setFilters}
          categories={categories}
        />

        <div className="mt-6">
          <LinkGrid
            links={links}
            loading={loading}
            onOpen={handleOpen}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleFavorite={handleToggleFavorite}
          />
        </div>
      </main>

      <FloatingInfo />
      <FloatingScrollToTop />

      <Modal
        isOpen={isCreating || !!editingLink}
        onClose={() => {
          setIsCreating(false);
          setEditingLink(null);
        }}
        title={editingLink ? 'Editar Link' : 'Novo Link'}
        size="md"
      >
        <LinkEditor
          link={editingLink || undefined}
          categories={categories}
          onSave={handleSaveLink}
          onCancel={() => {
            setIsCreating(false);
            setEditingLink(null);
          }}
          onCreateCategory={handleCreateCategory}
          onCategoriesChange={refetchCategories}
        />
      </Modal>

      <ConfirmModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleConfirmDelete}
        title="Excluir Link"
        message={`Tem certeza que deseja excluir o link "${deleteConfirm?.name}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

