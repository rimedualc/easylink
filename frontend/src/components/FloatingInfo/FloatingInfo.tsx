import { useState } from 'react';
import { Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function FloatingInfo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 bottom-4 z-50 p-3 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-colors"
        aria-label="Informações"
        title="Informações"
      >
        {isOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Info className="w-5 h-5" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="fixed left-4 bottom-20 z-40 w-80 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4"
          >
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-2">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">EasyLink</p>
                <p>© {new Date().getFullYear()} Todos os direitos reservados.</p>
              </div>
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <p>Desenvolvido por <span className="font-semibold text-primary-custom">Claudemir Rosa</span></p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

