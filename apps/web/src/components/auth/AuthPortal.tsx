'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
  UserCheck,
} from 'lucide-react';
import { Button, Card, Badge } from '@codequest/ui';
import { useStore } from '@/store/useStore';

interface AuthPortalProps {
  onSuccess: () => void;
}

export function AuthPortal({ onSuccess }: AuthPortalProps) {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Google Modal State
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [googleName, setGoogleName] = useState('Cadet Explorer');
  const [googleEmail, setGoogleEmail] = useState('cadet.explorer@gmail.com');

  const setUser = useStore((s) => s.setUser);

  const handleGoogleSignIn = async (gEmail: string, gName: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
      const res = await fetch(`${apiUrl}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: gEmail,
          name: gName,
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        }),
      });

      if (!res.ok) {
        throw new Error('Google authentication failed on server');
      }

      const data = await res.json();
      localStorage.setItem('codequest_token', data.token);
      localStorage.setItem('codequest_user', JSON.stringify(data.user));
      setUser(data.user);
      setIsGoogleModalOpen(false);
      onSuccess();
    } catch (err) {
      // Local fallback for offline/isolated mode
      const fallbackUser = {
        id: `usr-g-${Math.random().toString(36).substring(2, 8)}`,
        email: gEmail,
        username: gName,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        role: 'PLAYER' as const,
        xp: 150,
        level: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem('codequest_user', JSON.stringify(fallbackUser));
      setUser(fallbackUser);
      setIsGoogleModalOpen(false);
      onSuccess();
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
    const endpoint = tab === 'login' ? `${apiUrl}/auth/login` : `${apiUrl}/auth/register`;
    const payload = tab === 'login' ? { email, password } : { email, username, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      localStorage.setItem('codequest_token', data.token);
      localStorage.setItem('codequest_user', JSON.stringify(data.user));
      setUser(data.user);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestEntry = async () => {
    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
      const res = await fetch(`${apiUrl}/auth/guest`, { method: 'POST' });
      const data = await res.json();
      if (data?.user) {
        localStorage.setItem('codequest_token', data.token);
        localStorage.setItem('codequest_user', JSON.stringify(data.user));
        setUser(data.user);
      }
    } catch {
      // Offline fallback
    } finally {
      setIsLoading(false);
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl select-none">
      <Card className="w-full max-w-md border-cyan-500/30 p-6 md:p-8 bg-slate-900/90 shadow-[0_0_50px_rgba(6,182,212,0.2)]">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.6)] mb-3">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white font-mono tracking-wider">
            SECURITY CLEARANCE
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Access Orbital Station Aethelgard & Python Missions
          </p>
        </div>

        {/* Google Sign In Button */}
        <button
          onClick={() => setIsGoogleModalOpen(true)}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-750 hover:border-slate-500 text-slate-100 font-medium text-sm transition-all shadow-md group active:scale-95 mb-5"
        >
          {/* Official Google SVG G-Logo */}
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.86c2.26-2.09 3.58-5.17 3.58-9.09z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.37 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
            />
          </svg>
          <span className="group-hover:text-cyan-300 transition-colors">
            Sign in with Google
          </span>
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-slate-900 px-3 text-[11px] font-mono uppercase text-slate-500 tracking-wider">
            Or credentials
          </span>
          <div className="border-t border-slate-800 w-full" />
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 mb-4">
          <button
            onClick={() => {
              setTab('login');
              setError(null);
            }}
            className={`py-1.5 text-xs font-semibold rounded-md transition-colors ${
              tab === 'login'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setTab('signup');
              setError(null);
            }}
            className={`py-1.5 text-xs font-semibold rounded-md transition-colors ${
              tab === 'signup'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Profile
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleEmailAuth} className="space-y-3.5">
          {tab === 'signup' && (
            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                Cadet Call-Sign / Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Orion_Walker"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs md:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
              Engineer Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                placeholder="engineer@station.dev"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs md:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
              Terminal Access Key (Password)
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-10 py-2 text-xs md:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="glow-cyan"
            size="md"
            isLoading={isLoading}
            className="w-full mt-2"
          >
            {tab === 'login' ? 'Authenticate & Enter' : 'Register Cadet Record'}
          </Button>
        </form>

        {/* Guest Option */}
        <div className="mt-5 pt-4 border-t border-slate-800 text-center">
          <button
            onClick={handleGuestEntry}
            disabled={isLoading}
            className="text-xs text-slate-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1.5 font-mono"
          >
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Continue as Cadet Guest (Instant Trial)</span>
          </button>
        </div>
      </Card>

      {/* Interactive Google Sign-In Confirmation Modal */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <Card className="w-full max-w-sm border-cyan-500/40 p-6 bg-slate-900 shadow-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-lg bg-white">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.86c2.26-2.09 3.58-5.17 3.58-9.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.37 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Google Accounts</h3>
                <p className="text-xs text-slate-400">Sign in to CODEQUEST 2.0</p>
              </div>
            </div>

            <div className="space-y-3 my-4">
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">
                  Google Account Name
                </label>
                <input
                  type="text"
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">
                  Gmail Address
                </label>
                <input
                  type="email"
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsGoogleModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="glow-cyan"
                size="sm"
                isLoading={isLoading}
                onClick={() => handleGoogleSignIn(googleEmail, googleName)}
              >
                Continue
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
