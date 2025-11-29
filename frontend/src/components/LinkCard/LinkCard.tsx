import { ExternalLink, Edit, Trash2, Star, Tag, Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Link } from '../../types';
import { copyToClipboard } from '../../utils/clipboard';

interface LinkCardProps {
  link: Link;
  onOpen?: (link: Link) => void;
  onEdit?: (link: Link) => void;
  onDelete?: (link: Link) => void;
  onToggleFavorite?: (link: Link) => void;
}

export function LinkCard({
  link,
  onOpen,
  onEdit,
  onDelete,
  onToggleFavorite,
}: LinkCardProps) {
  const handleOpen = () => {
    window.open(link.url, '_blank', 'noopener,noreferrer');
    if (onOpen) {
      onOpen(link);
    }
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(link.url);
    if (success) {
      // Toast será mostrado pelo componente pai
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
            {link.name}
          </h3>
          {link.categoryName && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded">
              <Tag className="w-3 h-3" />
              {link.categoryName}
            </span>
          )}
        </div>
        <button
          onClick={() => onToggleFavorite?.(link)}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          aria-label={link.favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Star
            className={`w-5 h-5 ${
              link.favorite
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-400 hover:text-yellow-400'
            } transition-colors`}
          />
        </button>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-1 break-all">
        {link.url}
      </p>

      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpen}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
        >
          <ExternalLink className="w-4 h-4" />
          Abrir
        </motion.button>
        <button
          onClick={handleCopy}
          className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          aria-label="Copiar link"
          title="Copiar URL"
        >
          <Copy className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>
        <button
          onClick={() => onEdit?.(link)}
          className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          aria-label="Editar"
        >
          <Edit className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>
        <button
          onClick={() => onDelete?.(link)}
          className="p-2 border border-red-300 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          aria-label="Excluir"
        >
          <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
        </button>
      </div>
    </motion.div>
  );
}

