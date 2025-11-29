import { useState, useEffect } from 'react';
import { Paintbrush } from 'lucide-react';
import { Modal } from '../Modal/Modal';
import { hexToHsl, applyPrimaryColor } from '../../utils/colorUtils';

export function Settings() {
  const [isOpen, setIsOpen] = useState(false);
  const [lightColor, setLightColor] = useState('#9b38af');
  const [darkColor, setDarkColor] = useState('#9b38af');

  useEffect(() => {
    // Carregar cores salvas do localStorage
    const savedLightColor = localStorage.getItem('primaryColorLight') || '#9b38af';
    const savedDarkColor = localStorage.getItem('primaryColorDark') || '#9b38af';
    setLightColor(savedLightColor);
    setDarkColor(savedDarkColor);
    applyColors(savedLightColor, savedDarkColor);

    // Listener para mudanças de tema - sempre lê do localStorage
    const observer = new MutationObserver(() => {
      // Usar a função compartilhada que sempre lê do localStorage
      applyPrimaryColor();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const applyColors = (light: string, dark: string) => {
    // Salvar no localStorage
    localStorage.setItem('primaryColorLight', light);
    localStorage.setItem('primaryColorDark', dark);
    
    // Aplicar cor usando a função compartilhada que sempre lê do localStorage
    applyPrimaryColor();
  };

  const handleLightColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setLightColor(newColor);
    applyColors(newColor, darkColor);
  };

  const handleDarkColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setDarkColor(newColor);
    applyColors(lightColor, newColor);
  };

  const handleReset = () => {
    const defaultColor = '#9b38af';
    setLightColor(defaultColor);
    setDarkColor(defaultColor);
    applyColors(defaultColor, defaultColor);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label="Personalização"
        title="Personalização"
      >
        <Paintbrush className="w-5 h-5 text-primary-custom" />
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Personalização" size="md">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Cores Personalizadas
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Configure as cores dos botões e ícones para os modos claro e escuro.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cor do Modo Claro
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={lightColor}
                    onChange={handleLightColorChange}
                    className="w-16 h-16 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={lightColor}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
                          setLightColor(value);
                          applyColors(value, darkColor);
                        } else {
                          setLightColor(value);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                      placeholder="#9b38af"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cor do Modo Escuro
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={darkColor}
                    onChange={handleDarkColorChange}
                    className="w-16 h-16 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={darkColor}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
                          setDarkColor(value);
                          applyColors(lightColor, value);
                        } else {
                          setDarkColor(value);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                      placeholder="#9b38af"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
            >
              Restaurar Padrão (#9b38af)
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

