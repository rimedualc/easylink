// Função compartilhada para converter hex para HSL
export const hexToHsl = (hex: string): string => {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

// Função para aplicar a cor primária baseada no tema atual
export const applyPrimaryColor = () => {
  const root = document.documentElement;
  const isDark = root.classList.contains('dark');
  // Sempre ler do localStorage para ter os valores mais recentes
  const lightColor = localStorage.getItem('primaryColorLight') || '#9b38af';
  const darkColor = localStorage.getItem('primaryColorDark') || '#9b38af';
  
  if (isDark) {
    root.style.setProperty('--primary', hexToHsl(darkColor));
  } else {
    root.style.setProperty('--primary', hexToHsl(lightColor));
  }
};

