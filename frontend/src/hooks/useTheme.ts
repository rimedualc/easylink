import { useState, useEffect } from 'react';
import { applyPrimaryColor } from '../utils/colorUtils';

export type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('theme') as Theme;
    return stored || 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
    
    // Aplicar cor imediatamente após mudar o tema
    // Usar requestAnimationFrame para garantir que a classe foi aplicada
    requestAnimationFrame(() => {
      applyPrimaryColor();
    });
  }, [theme]);

  // Aplicar cor ao carregar
  useEffect(() => {
    applyPrimaryColor();
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return { theme, toggleTheme, setTheme };
}

