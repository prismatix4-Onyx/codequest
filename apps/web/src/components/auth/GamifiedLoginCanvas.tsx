'use client';

import React, { useEffect, useRef } from 'react';
import { soundFx } from '@/utils/soundEffects';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  label?: string;
  alpha: number;
  pulseSpeed: number;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

const CODE_SYMBOLS = [
  'def',
  'lambda',
  'class',
  '{ }',
  'async',
  '[ ]',
  'import',
  'return',
  '01',
  '< />',
  'True',
  'None',
  '#>>',
  'yield',
];

const PALETTE = [
  '#818CF8', // Indigo
  '#A78BFA', // Violet
  '#38BDF8', // Sky
  '#34D399', // Emerald
  '#F472B6', // Rose
];

export function GamifiedLoginCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse coordinates
    const mouse = { x: -1000, y: -1000, isHovering: false };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.isHovering = true;
    };

    const handleMouseLeave = () => {
      mouse.isHovering = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Click Shockwave
    const shockwaves: Shockwave[] = [];
    const handleCanvasClick = (e: MouseEvent) => {
      // Only trigger if clicked outside form inputs
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'BUTTON') return;

      shockwaves.push({
        x: e.clientX,
        y: e.clientY,
        radius: 5,
        maxRadius: 180,
        alpha: 0.8,
      });
      soundFx.playShockwave();
    };
    window.addEventListener('click', handleCanvasClick);

    // Initialize Particles
    const particleCount = Math.min(Math.floor((width * height) / 22000), 55);
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const isSymbol = i % 3 === 0;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        size: isSymbol ? 11 : Math.random() * 2.2 + 1.2,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        label: isSymbol ? CODE_SYMBOLS[Math.floor(Math.random() * CODE_SYMBOLS.length)] : undefined,
        alpha: Math.random() * 0.5 + 0.3,
        pulseSpeed: Math.random() * 0.02 + 0.01,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Shockwaves
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += 5.5;
        sw.alpha *= 0.95;

        ctx.save();
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(129, 140, 248, ${sw.alpha * 0.5})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.restore();

        if (sw.radius >= sw.maxRadius || sw.alpha <= 0.02) {
          shockwaves.splice(i, 1);
        }
      }

      // 2. Update & Draw Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around screen boundaries
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Mouse proximity gentle interaction
        if (mouse.isHovering) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120 && dist > 0) {
            const force = (120 - dist) / 120;
            p.x += (dx / dist) * force * 1.8;
            p.y += (dy / dist) * force * 1.8;
          }
        }

        // Draw particle or code symbol
        ctx.save();
        const pulseAlpha = p.alpha + Math.sin(time * 3 + i) * 0.15;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, pulseAlpha));

        if (p.label) {
          // Floating Code Token
          ctx.font = '11px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
          ctx.fillStyle = p.color;
          ctx.fillText(p.label, p.x, p.y);
        } else {
          // Ambient Glowing Node
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.fill();
        }
        ctx.restore();

        // 3. Constellation Connections between nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 90) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const lineAlpha = (1 - dist / 90) * 0.18;
            ctx.strokeStyle = `rgba(129, 140, 248, ${lineAlpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleCanvasClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-auto z-0 opacity-80"
    />
  );
}
