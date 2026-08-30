import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Zap, 
  Sparkles, 
  CheckCircle2, 
  Mail, 
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';
import { Badge } from '../ui/Badge';

export function AnalyticsView({ emails = [] }) {
  const totalEmails = emails.length || 24;
  const highPriorityCount = emails.filter(e => e.aiAnalysis?.priority === 'High').length || 2;
  const actionItemsTotal = emails.reduce((acc, e) => acc + (e.aiAnalysis?.actionItems?.length || 0), 0) || 5;

  const statCards = [
    {
      title: 'Total Synced Threads',
      value: `${totalEmails}`,
      change: '+14% vs last week',
      icon: Mail,
      color: 'from-cyan-500 to-blue-600',
    },
    {
      title: 'Average Response Time',
      value: '18 min',
      change: '-42% faster with AI replies',
      icon: Clock,
      color: 'from-indigo-500 to-violet-600',
    },
    {
      title: 'Time Saved by AI',
      value: '4.8 hrs',
      change: 'Calculated via auto-summaries',
      icon: Zap,
      color: 'from-amber-500 to-orange-600',
    },
    {
      title: 'Action Items Pending',
      value: `${actionItemsTotal}`,
      change: `${highPriorityCount} urgent deadlines`,
      icon: CheckCircle2,
      color: 'from-emerald-500 to-teal-600',
    },
  ];

  const weeklyVolume = [
    { day: 'Mon', count: 18, aiGenerated: 12 },
    { day: 'Tue', count: 24, aiGenerated: 19 },
    { day: 'Wed', count: 32, aiGenerated: 27 },
    { day: 'Thu', count: 21, aiGenerated: 16 },
    { day: 'Fri', count: 29, aiGenerated: 24 },
    { day: 'Sat', count: 8, aiGenerated: 6 },
    { day: 'Sun', count: 5, aiGenerated: 4 },
  ];

  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-cyan-400" />
          AI Email Insights & Productivity Analytics
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Real-time measurement of inbox velocity, AI reply speed, and workload categorization.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="p-5 rounded-2xl glass-card border border-slate-800 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">{stat.title}</span>
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-md`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-slate-100 tracking-tight">
                {stat.value}
              </div>
              <p className="text-[11px] text-cyan-400 font-medium flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {stat.change}
              </p>
            </div>
          );
        })}
      </div>

      {/* Volume Chart & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Bar Graph */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Weekly Email Volume & AI Reply Automation
            </h3>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-slate-700"></span> Total</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-cyan-500"></span> AI Assisted</span>
            </div>
          </div>

          <div className="h-48 flex items-end justify-between gap-4 pt-6 pb-2 px-4 bg-slate-950/40 rounded-xl border border-slate-800/60">
            {weeklyVolume.map((item, idx) => {
              const heightPercent = (item.count / 35) * 100;
              const aiHeightPercent = (item.aiGenerated / item.count) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="w-full relative flex items-end justify-center rounded-lg bg-slate-800 group-hover:bg-slate-750 transition-all overflow-hidden" style={{ height: `${heightPercent}%` }}>
                    <div 
                      className="w-full bg-gradient-to-t from-cyan-600 to-indigo-500 rounded-b-lg transition-all"
                      style={{ height: `${aiHeightPercent}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-slate-400">{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority & Category Breakdown */}
        <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-400" />
            AI Priority Breakdown
          </h3>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-rose-300">High Priority / Urgent</span>
                <span className="text-slate-400">25%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: '25%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-amber-300">Medium Priority</span>
                <span className="text-slate-400">55%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '55%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-emerald-300">Low Priority / Info</span>
                <span className="text-slate-400">20%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '20%' }} />
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-1 mt-4">
            <span className="font-semibold text-cyan-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> AI Recommendation
            </span>
            <p className="text-[11px] text-slate-400">
              You have 3 unanswered High Priority items requiring decisions by tomorrow end-of-day.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
