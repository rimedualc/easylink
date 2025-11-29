import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label="Alternar tema"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-primary-custom" />
      ) : (
        <Sun className="w-5 h-5 text-primary-custom" />
      )}
    </button>
  );
}

