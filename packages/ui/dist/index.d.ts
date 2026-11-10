import React from 'react';
import { type ClassValue } from 'clsx';
import type { ThemeMode } from '@codequest/shared-types';
export declare function cn(...inputs: ClassValue[]): string;
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'glow-cyan' | 'glow-amber';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}
export declare const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    glow?: boolean;
}
export declare const Card: React.FC<CardProps>;
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'cyan' | 'amber' | 'emerald' | 'rose' | 'slate';
}
export declare const Badge: React.FC<BadgeProps>;
export interface ThemeToggleProps {
    currentTheme: ThemeMode;
    onThemeChange: (theme: ThemeMode) => void;
}
export declare const ThemeToggle: React.FC<ThemeToggleProps>;
//# sourceMappingURL=index.d.ts.map