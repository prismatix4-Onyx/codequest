import React from 'react';
import Link from 'next/link';
import { Compass } from 'lucide-react';
import { Button } from '@codequest/ui';

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-2">
        <Compass className="w-8 h-8" />
      </div>
      <h2 className="text-3xl font-bold text-white">404 — Sector Coordinates Unknown</h2>
      <p className="text-sm text-slate-400 max-w-md">
        The orbital frequency or station sector you requested is not broadcasting telemetry.
      </p>
      <div className="pt-2">
        <Link href="/">
          <Button variant="glow-cyan" size="md">
            Return to Command Center
          </Button>
        </Link>
      </div>
    </div>
  );
}
