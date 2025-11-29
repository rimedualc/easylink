import { useState } from 'react';
import { Database, Download, Upload, Trash2 } from 'lucide-react';
import { Modal } from '../Modal/Modal';

interface DatabaseManagerProps {
  onExport: () => void;
  onImport: () => void;
  onClear?: () => void;
}

export function DatabaseManager({ onExport, onImport, onClear }: DatabaseManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleExport = () => {
    onExport();
    setIsOpen(false);
  };

  const handleImport = () => {
    onImport();
    setIsOpen(false);
  };

  const handleClear = () => {
    if (onClear && confirmText.toLowerCase().trim() === 'excluir tudo') {
      onClear();
      setIsOpen(false);
      setShowClearConfirm(false);
      setConfirmText('');
    }
  };

  const handleClearClick = () => {
    setShowClearConfirm(true);
    setConfirmText('');
  };

  const handleCancelClear = () => {
    setShowClearConfirm(false);
    setConfirmText('');
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        title="Gerenciar Banco de Dados"
      >
        <Database className="w-5 h-5 text-primary-custom" />
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Gerenciar Banco de Dados" size="md">
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Escolha uma ação para gerenciar seus dados:
          </p>

          <button
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
          >
            <Download className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Exportar Dados</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Baixar todos os links e categorias em formato JSON
              </p>
            </div>
          </button>

          <button
            onClick={handleImport}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
          >
            <Upload className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Importar Dados</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Restaurar links e categorias a partir de um arquivo JSON
              </p>
            </div>
          </button>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            {!showClearConfirm ? (
              <button
                onClick={handleClearClick}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors border border-red-200 dark:border-red-800"
              >
                <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-red-900 dark:text-red-100">Limpar Banco de Dados</h3>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    Excluir todos os links e categorias permanentemente
                  </p>
                </div>
              </button>
            ) : (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-200 mb-3 font-medium">
                  ⚠️ Atenção: Esta ação não pode ser desfeita!
                </p>
                <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                  Todos os links e categorias serão excluídos permanentemente.
                </p>
                <p className="text-sm text-red-700 dark:text-red-300 mb-3 font-medium">
                  Para confirmar, digite <span className="font-bold">"excluir tudo"</span> no campo abaixo:
                </p>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Digite: excluir tudo"
                  className="w-full px-3 py-2 mb-4 border border-red-300 dark:border-red-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && confirmText.toLowerCase().trim() === 'excluir tudo') {
                      handleClear();
                    }
                  }}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleClear}
                    disabled={confirmText.toLowerCase().trim() !== 'excluir tudo'}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirmar Exclusão
                  </button>
                  <button
                    onClick={handleCancelClear}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}

