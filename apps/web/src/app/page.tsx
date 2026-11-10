'use client';

import React, { useState, useEffect } from 'react';
import { AuthPortal } from '@/components/auth/AuthPortal';
import { AdventurerDashboard } from '@/components/dashboard/AdventurerDashboard';
import { useStore } from '@/store/useStore';

export default function HomePage() {
  const [bootState, setBootState] = useState<'auth' | 'ready'>('auth');
  const setUser = useStore((s) => s.setUser);
  const isAuthenticated = useStore((s) => s.isAuthenticated);

  useEffect(() => {
    // Check if user has an existing saved session
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('codequest_user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          setBootState('ready');
          return;
        } catch {
          // ignore
        }
      }
      setBootState('auth');
    }
  }, [setUser]);

  const handleAuthSuccess = () => {
    setBootState('ready');
  };

  // 1. If not authenticated or on auth screen, ONLY render the login page
  if (bootState === 'auth' || !isAuthenticated) {
    return <AuthPortal onSuccess={handleAuthSuccess} />;
  }

  // 2. Authenticated Adventurer Dashboard
  return <AdventurerDashboard />;
}
