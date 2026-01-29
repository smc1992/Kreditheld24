'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

type ColorTheme = 'emerald' | 'ocean' | 'purple';

interface AdminThemeContextType {
  colorTheme: ColorTheme;
  darkMode: boolean;
  compactMode: boolean;
  setColorTheme: (theme: ColorTheme) => void;
  setDarkMode: (enabled: boolean) => void;
  setCompactMode: (enabled: boolean) => void;
  refreshSettings: () => Promise<void>;
}

const AdminThemeContext = createContext<AdminThemeContextType | undefined>(undefined);

const themeColors = {
  emerald: {
    primary: '#10b981',
    primaryHover: '#059669',
    primaryLight: '#d1fae5',
    primaryDark: '#047857',
  },
  ocean: {
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    primaryLight: '#dbeafe',
    primaryDark: '#1d4ed8',
  },
  purple: {
    primary: '#a855f7',
    primaryHover: '#9333ea',
    primaryLight: '#f3e8ff',
    primaryDark: '#7e22ce',
  },
};

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [colorTheme, setColorTheme] = useState<ColorTheme>('emerald');
  const [darkMode, setDarkMode] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  const applyTheme = (theme: ColorTheme, dark: boolean, compact: boolean) => {
    const root = document.documentElement;
    const colors = themeColors[theme];

    // Apply color theme CSS variables
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-primary-hover', colors.primaryHover);
    root.style.setProperty('--color-primary-light', colors.primaryLight);
    root.style.setProperty('--color-primary-dark', colors.primaryDark);

    // Apply dark mode
    if (dark) {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }

    // Apply compact mode
    if (compact) {
      root.classList.add('compact');
    } else {
      root.classList.remove('compact');
    }

    // Store in localStorage
    localStorage.setItem('admin-color-theme', theme);
    localStorage.setItem('admin-dark-mode', String(dark));
    localStorage.setItem('admin-compact-mode', String(compact));
  };

  const refreshSettings = async () => {
    if (!session) return;

    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      
      if (data.success && data.data?.appearance) {
        const { theme, darkMode: dark, compactMode: compact } = data.data.appearance;
        const newTheme = (theme || 'emerald') as ColorTheme;
        const newDark = dark || false;
        const newCompact = compact || false;

        setColorTheme(newTheme);
        setDarkMode(newDark);
        setCompactMode(newCompact);
        applyTheme(newTheme, newDark, newCompact);
      }
    } catch (error) {
      console.error('Error loading theme settings:', error);
    }
  };

  useEffect(() => {
    setMounted(true);

    // Load from localStorage first for instant feedback
    const savedTheme = localStorage.getItem('admin-color-theme') as ColorTheme;
    const savedDark = localStorage.getItem('admin-dark-mode') === 'true';
    const savedCompact = localStorage.getItem('admin-compact-mode') === 'true';

    if (savedTheme) {
      setColorTheme(savedTheme);
      setDarkMode(savedDark);
      setCompactMode(savedCompact);
      applyTheme(savedTheme, savedDark, savedCompact);
    }
  }, []);

  useEffect(() => {
    if (mounted && session) {
      refreshSettings();
    }
  }, [mounted, session]);

  const handleSetColorTheme = (theme: ColorTheme) => {
    setColorTheme(theme);
    applyTheme(theme, darkMode, compactMode);
  };

  const handleSetDarkMode = (enabled: boolean) => {
    setDarkMode(enabled);
    applyTheme(colorTheme, enabled, compactMode);
  };

  const handleSetCompactMode = (enabled: boolean) => {
    setCompactMode(enabled);
    applyTheme(colorTheme, darkMode, enabled);
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <AdminThemeContext.Provider
      value={{
        colorTheme,
        darkMode,
        compactMode,
        setColorTheme: handleSetColorTheme,
        setDarkMode: handleSetDarkMode,
        setCompactMode: handleSetCompactMode,
        refreshSettings,
      }}
    >
      {children}
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  const context = useContext(AdminThemeContext);
  if (context === undefined) {
    throw new Error('useAdminTheme must be used within an AdminThemeProvider');
  }
  return context;
}
