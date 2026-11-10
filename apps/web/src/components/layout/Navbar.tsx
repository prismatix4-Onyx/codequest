'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, BookOpen, PlayCircle, Zap, Shield, LogOut, User as UserIcon } from 'lucide-react';
import { ThemeToggle } from '@codequest/ui';
import { useStore } from '@/store/useStore';

export function Navbar() {
  const pathname = usePathname();
  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);
  const user = useStore((s) => s.user);
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const logout = useStore((s) => s.logout);
  const preferences = useStore((s) => s.preferences);
  const updatePreferences = useStore((s) => s.updatePreferences);

  // If not authenticated, hide the navbar entirely so the login page only contains login content
  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { label: 'Cinematic Story', href: '/play', icon: PlayCircle },
    { label: 'World Explorer', href: '/explorer', icon: Compass },
    { label: 'Python Curriculum', href: '/curriculum', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 px-4 md:px-8 py-3 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
              <span className="text-white font-bold text-xs tracking-tight">CQ</span>
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                CodeQuest
              </span>
              <span className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400 ml-1.5 px-1.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20">
                2.0
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 border border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Controls: Quality, Theme, XP Pill */}
        <div className="flex items-center space-x-3">
          {/* Quality Selector */}
          <select
            value={preferences.qualityPreset}
            onChange={(e) =>
              updatePreferences({ qualityPreset: e.target.value as 'low' | 'medium' | 'high' | 'auto' })
            }
            className="text-xs bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 rounded-md px-2 py-1 outline-none hover:border-slate-400 dark:hover:border-slate-500 transition-colors"
          >
            <option value="auto">Quality: Auto</option>
            <option value="high">High (Full FX)</option>
            <option value="medium">Medium</option>
            <option value="low">Low (Mobile)</option>
          </select>

          {/* Theme Toggle (Light / Dark / System) */}
          <ThemeToggle currentTheme={theme} onThemeChange={setTheme} />

          {/* User Profile, XP & Level Pill */}
          <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-full pl-2 pr-3 py-1 text-xs transition-colors">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.username}
                className="w-5 h-5 rounded-full object-cover border border-indigo-400/50"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-bold text-[10px]">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="font-semibold text-slate-800 dark:text-slate-200 hidden sm:inline max-w-[90px] truncate">
              {user.username}
            </span>
            <span className="text-slate-400 dark:text-slate-700">|</span>
            <span className="flex items-center gap-1 font-bold text-amber-500 dark:text-amber-400">
              <Zap className="w-3 h-3 fill-current" />
              <span>{user.xp} XP</span>
            </span>
            <span className="text-slate-400 dark:text-slate-700">|</span>
            <span className="text-slate-600 dark:text-slate-300 font-medium">Lv.{user.level}</span>

            {isAuthenticated && (
              <button
                onClick={logout}
                title="Sign Out"
                className="ml-1 p-0.5 text-slate-400 hover:text-rose-500 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
