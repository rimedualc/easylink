import { motion, AnimatePresence } from 'framer-motion';
import { LinkCard } from '../LinkCard/LinkCard';
import type { Link } from '../../types';

interface LinkGridProps {
  links: Link[];
  onOpen?: (link: Link) => void;
  onEdit?: (link: Link) => void;
  onDelete?: (link: Link) => void;
  onToggleFavorite?: (link: Link) => void;
  loading?: boolean;
}

export function LinkGrid({
  links,
  onOpen,
  onEdit,
  onDelete,
  onToggleFavorite,
  loading,
}: LinkGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 animate-pulse"
          >
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4" />
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          Nenhum link encontrado
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <AnimatePresence>
        {links.map(link => (
          <LinkCard
            key={link.id}
            link={link}
            onOpen={onOpen}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

