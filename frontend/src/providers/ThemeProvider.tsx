import { create } from 'zustand';

import { THEME_KEY } from '../constants';
import { Theme } from '../types';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useTheme = create<ThemeContextType>(set => ({
  theme: 'light',
  setTheme: (newTheme: Theme) =>
    set(() => {
      localStorage.setItem(THEME_KEY, newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
      return { theme: newTheme };
    }),
}));
