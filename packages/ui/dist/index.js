"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeToggle = exports.Badge = exports.Card = exports.Button = void 0;
exports.cn = cn;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const clsx_1 = require("clsx");
const tailwind_merge_1 = require("tailwind-merge");
function cn(...inputs) {
    return (0, tailwind_merge_1.twMerge)((0, clsx_1.clsx)(inputs));
}
exports.Button = react_1.default.forwardRef(({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';
    const sizeStyles = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base font-semibold',
    }[size];
    const variantStyles = {
        primary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md focus:ring-indigo-500 active:scale-95',
        secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 focus:ring-slate-500 active:scale-95',
        danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-md focus:ring-rose-500 active:scale-95',
        ghost: 'bg-transparent hover:bg-white/10 text-slate-300 hover:text-white focus:ring-slate-400',
        'glow-cyan': 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] focus:ring-cyan-400 active:scale-95 backdrop-blur-md',
        'glow-amber': 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_25px_rgba(245,158,11,0.6)] focus:ring-amber-400 active:scale-95 backdrop-blur-md',
    }[variant];
    return ((0, jsx_runtime_1.jsxs)("button", { ref: ref, disabled: disabled || isLoading, className: cn(baseStyles, sizeStyles, variantStyles, className), ...props, children: [isLoading && ((0, jsx_runtime_1.jsxs)("svg", { className: "animate-spin -ml-1 mr-2 h-4 w-4 text-current", fill: "none", viewBox: "0 0 24 24", children: [(0, jsx_runtime_1.jsx)("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), (0, jsx_runtime_1.jsx)("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] })), children] }));
});
exports.Button.displayName = 'Button';
const Card = ({ className, glow = false, children, ...props }) => {
    return ((0, jsx_runtime_1.jsx)("div", { className: cn('rounded-xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-5 text-slate-100 shadow-xl transition-all duration-300', glow && 'border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.15)]', className), ...props, children: children }));
};
exports.Card = Card;
const Badge = ({ className, variant = 'cyan', children, ...props }) => {
    const variantStyles = {
        cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
        amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        rose: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        slate: 'bg-slate-700/30 text-slate-300 border-slate-600/30',
    }[variant];
    return ((0, jsx_runtime_1.jsx)("span", { className: cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border select-none', variantStyles, className), ...props, children: children }));
};
exports.Badge = Badge;
const ThemeToggle = ({ currentTheme, onThemeChange }) => {
    return ((0, jsx_runtime_1.jsx)("div", { className: "inline-flex rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/80 p-0.5 backdrop-blur-md transition-colors", children: ['light', 'dark', 'system'].map((mode) => ((0, jsx_runtime_1.jsx)("button", { onClick: () => onThemeChange(mode), className: cn('px-2.5 py-1 text-xs font-semibold rounded-md capitalize transition-all duration-150 cursor-pointer', currentTheme === mode
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80 dark:bg-indigo-600 dark:text-white dark:border-transparent'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'), children: mode }, mode))) }));
};
exports.ThemeToggle = ThemeToggle;
//# sourceMappingURL=index.js.map