import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';

export const metadata: Metadata = {
  title: 'CODEQUEST 2.0 — Cinematic 3D Interactive Programming Education',
  description:
    'Enter fictional worlds, solve cinematic missions with real Python code, and steer animated stories.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
