'use client';

import React, { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import type { ThemeMode } from '@codequest/shared-types';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);

  // Initialize theme from localStorage or system on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const saved = localStorage.getItem('codequest_theme') as ThemeMode | null;
    const initialTheme: ThemeMode = saved || 'dark';
    setTheme(initialTheme);

    const applyTheme = (mode: ThemeMode) => {
      const root = document.documentElement;
      root.classList.remove('light', 'dark');

      let resolvedTheme = mode;
      if (mode === 'system') {
        resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
      }
      root.classList.add(resolvedTheme);
    };

    applyTheme(initialTheme);

    // Listen for OS system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      const current = useStore.getState().theme;
      if (current === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [setTheme]);

  // Synchronize whenever store theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    root.classList.remove('light', 'dark');

    let resolved = theme;
    if (theme === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    root.classList.add(resolved);
    localStorage.setItem('codequest_theme', theme);
  }, [theme]);

  return <>{children}</>;
}
