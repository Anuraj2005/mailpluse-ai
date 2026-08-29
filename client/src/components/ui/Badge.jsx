import React from 'react';

export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-slate-800/80 text-slate-300 border-slate-700/60',
    cyan: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30',
    indigo: 'bg-indigo-950/60 text-indigo-300 border-indigo-500/30',
    emerald: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30',
    amber: 'bg-amber-950/60 text-amber-300 border-amber-500/30',
    rose: 'bg-rose-950/60 text-rose-300 border-rose-500/30',
    High: 'bg-rose-950/80 text-rose-300 border-rose-500/40 shadow-sm shadow-rose-950',
    Medium: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
    Low: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
  };

  const styleClass = variants[variant] || variants.default;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border backdrop-blur-sm transition-colors ${styleClass} ${className}`}>
      {children}
    </span>
  );
}
