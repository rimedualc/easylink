import { Plus } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import { CategoryManager } from '../CategoryManager/CategoryManager';
import { DatabaseManager } from '../DatabaseManager/DatabaseManager';
import { Settings } from '../Settings/Settings';
import type { Category } from '../../types';

interface TopbarProps {
  onNewLink: () => void;
  onExport: () => void;
  onImport: () => void;
  onClear?: () => void;
  categories: Category[];
  onCreateCategory: (name: string) => Promise<void>;
  onUpdateCategory: (id: number, name: string) => Promise<void>;
  onDeleteCategory: (id: number, reassignTo?: number) => Promise<void>;
}

export function Topbar({
  onNewLink,
  onExport,
  onImport,
  onClear,
  categories,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
}: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-primary-custom">EasyLink</h1>
          </div>

          <div className="flex items-center gap-2 flex-1 justify-end">
            <CategoryManager
              categories={categories}
              onCreate={onCreateCategory}
              onUpdate={onUpdateCategory}
              onDelete={onDeleteCategory}
            />
            <DatabaseManager onExport={onExport} onImport={onImport} onClear={onClear} />
            <Settings />
            <ThemeToggle />
            <button
              onClick={onNewLink}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden md:inline">Novo Link</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

