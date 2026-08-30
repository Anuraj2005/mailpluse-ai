import React from 'react';
import { Briefcase, Smile, Award, Zap } from 'lucide-react';

export function ToneSelector({ selectedTone, onSelectTone, className = '' }) {
  const tones = [
    { id: 'Professional', label: 'Professional', icon: Briefcase, color: 'hover:text-cyan-400' },
    { id: 'Friendly', label: 'Friendly', icon: Smile, color: 'hover:text-emerald-400' },
    { id: 'Formal', label: 'Formal', icon: Award, color: 'hover:text-violet-400' },
    { id: 'Concise', label: 'Concise', icon: Zap, color: 'hover:text-amber-400' },
  ];

  return (
    <div className={`flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl ${className}`}>
      {tones.map((t) => {
        const Icon = t.icon;
        const isSelected = selectedTone === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelectTone(t.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isSelected
                ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
            <span>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
