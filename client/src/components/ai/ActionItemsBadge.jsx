import React, { useState } from 'react';
import { CheckCircle2, Calendar, Clock, ArrowRight } from 'lucide-react';
import { Badge } from '../ui/Badge';

export function ActionItemsBadge({ actionItems = [], deadlines = [] }) {
  const [completedTasks, setCompletedTasks] = useState({});

  if (!actionItems.length && !deadlines.length) return null;

  const toggleTask = (index) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const formatDeadline = (d) => {
    if (!d) return '';
    try {
      const date = new Date(d);
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return String(d);
    }
  };

  return (
    <div className="space-y-2.5 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          Action Items & Deliverables ({actionItems.length})
        </span>
        {deadlines.length > 0 && (
          <div className="flex items-center gap-1 text-[11px] text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-500/30">
            <Calendar className="w-3 h-3" />
            <span>Due: {formatDeadline(deadlines[0])}</span>
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        {actionItems.map((item, idx) => {
          const isDone = completedTasks[idx];
          return (
            <label
              key={idx}
              className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-colors ${
                isDone ? 'bg-slate-900/40 text-slate-500' : 'bg-slate-800/40 hover:bg-slate-800/80 text-slate-200'
              }`}
            >
              <input
                type="checkbox"
                checked={Boolean(isDone)}
                onChange={() => toggleTask(idx)}
                className="mt-0.5 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900"
              />
              <span className={`text-xs leading-relaxed ${isDone ? 'line-through' : ''}`}>
                {item}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
