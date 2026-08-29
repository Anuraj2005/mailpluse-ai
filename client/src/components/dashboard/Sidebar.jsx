import React from 'react';
import { 
  Inbox, 
  Star, 
  Clock, 
  Send, 
  Search, 
  BarChart3, 
  Settings, 
  PenSquare, 
  Zap, 
  CheckCircle2, 
  ShieldCheck, 
  LogOut,
  Sparkles
} from 'lucide-react';
import { useMailStore } from '../../store/useMailStore';
import { authApi } from '../../lib/api';

export function Sidebar() {
  const { 
    user, 
    activeView, 
    setActiveView, 
    activeLabel, 
    setActiveLabel, 
    openCompose,
    resetSessionState 
  } = useMailStore();

  const handleLogout = async () => {
    try {
      await authApi.logout();
      resetSessionState();
      window.location.href = '/';
    } catch (e) {
      console.error(e);
      resetSessionState();
      window.location.href = '/';
    }
  };

  const navItems = [
    { id: 'inbox', label: 'Inbox', icon: Inbox, view: 'inbox', filter: 'ALL' },
    { id: 'unread', label: 'Unread', icon: Clock, view: 'inbox', filter: 'UNREAD' },
    { id: 'starred', label: 'Starred', icon: Star, view: 'inbox', filter: 'STARRED' },
    { id: 'action', label: 'Action Items', icon: CheckCircle2, view: 'inbox', filter: 'ACTION_REQUIRED', badge: 'AI' },
    { id: 'sent', label: 'Sent', icon: Send, view: 'inbox', filter: 'SENT' },
  ];

  const tools = [
    { id: 'search', label: 'Smart Search', icon: Search, view: 'search' },
    { id: 'analytics', label: 'AI Analytics', icon: BarChart3, view: 'analytics' },
    { id: 'settings', label: 'Settings', icon: Settings, view: 'settings' },
  ];

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col justify-between h-screen glass-panel border-r border-slate-800 p-4 select-none z-20">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-950/60 ring-1 ring-cyan-400/40">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              MailPulse <span className="text-xs px-1.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-400 font-semibold border border-cyan-500/30">AI</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">Executive Inbox</p>
          </div>
        </div>

        {/* Compose Button */}
        <button
          onClick={() => openCompose()}
          className="w-full group relative flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 text-white font-semibold text-sm shadow-xl shadow-cyan-950/50 hover:shadow-cyan-900/60 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border border-cyan-400/30"
        >
          <PenSquare className="w-4 h-4 transition-transform group-hover:rotate-6" />
          <span>Compose Email</span>
          <Sparkles className="w-3.5 h-3.5 text-cyan-200 animate-pulse ml-auto" />
        </button>

        {/* Primary Mail Folders */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Mailbox</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === 'inbox' && activeLabel === item.filter;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView('inbox');
                  setActiveLabel(item.filter);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-slate-800 text-cyan-400 shadow-sm border border-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Intelligence Tools */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">AI Intelligence</p>
          {tools.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.view;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.view)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-slate-800 text-cyan-400 shadow-sm border border-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* User Profile & Footer */}
      <div className="pt-4 border-t border-slate-800/80 space-y-3">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt={user?.displayName || 'Signed out'}
            className="w-8 h-8 rounded-lg object-cover ring-1 ring-cyan-500/40"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-200 truncate">{user?.displayName || 'Not signed in'}</p>
            <p className="text-[10px] text-slate-400 truncate">{user?.email || 'Connect Gmail to load messages'}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 px-2">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> AES-256 Auth
          </span>
          <span className="text-[10px] text-cyan-400/80">v1.0.0</span>
        </div>
      </div>
    </aside>
  );
}
