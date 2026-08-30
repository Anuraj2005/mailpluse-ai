import React from 'react';
import { 
  Star, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Skeleton } from '../ui/Skeleton';
import { useMailStore } from '../../store/useMailStore';

export function EmailList({ emails, isLoading, onRefresh, onToggleStar }) {
  const { 
    selectedThreadId, 
    setSelectedThreadId, 
    searchQuery, 
    setSearchQuery, 
    activeLabel 
  } = useMailStore();

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const getLabelTitle = () => {
    switch (activeLabel) {
      case 'UNREAD': return 'Unread Messages';
      case 'STARRED': return 'Starred Messages';
      case 'ACTION_REQUIRED': return 'Action Items & Deadlines';
      case 'SENT': return 'Sent Mail';
      default: return 'Primary Inbox';
    }
  };

  return (
    <div className="w-80 md:w-96 flex-shrink-0 flex flex-col h-screen border-r border-slate-800/80 bg-slate-950/40">
      {/* List Header */}
      <div className="p-4 border-b border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-100">{getLabelTitle()}</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium">
              {emails?.length || 0}
            </span>
          </div>
          <button
            onClick={onRefresh}
            title="Refresh Inbox"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>

        {/* Quick Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter subject, sender, or summary..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900/80 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
          />
        </div>
      </div>

      {/* Email Thread Cards Container */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40 p-2 space-y-1">
        {isLoading ? (
          <div className="p-3 space-y-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="p-3.5 rounded-xl border border-slate-800/40 space-y-2">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-12" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-4/5" />
              </div>
            ))}
          </div>
        ) : emails?.length === 0 ? (
          <div className="p-8 text-center space-y-2 text-slate-400">
            <InboxEmptyIcon className="w-10 h-10 mx-auto text-slate-600 mb-2" />
            <p className="text-sm font-medium text-slate-300">No emails found</p>
            <p className="text-xs text-slate-500">Your inbox is clear in this category.</p>
          </div>
        ) : (
          emails.map((email) => {
            const isSelected = selectedThreadId === email.threadId;
            const priority = email.aiAnalysis?.priority;
            const hasActionItems = email.aiAnalysis?.actionItems?.length > 0;

            return (
              <div
                key={email._id || email.messageId}
                onClick={() => setSelectedThreadId(email.threadId)}
                className={`group relative p-3.5 rounded-xl cursor-pointer transition-all duration-150 border ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-500/40 shadow-lg shadow-cyan-950/20'
                    : email.isRead
                    ? 'bg-slate-900/30 hover:bg-slate-850 border-transparent hover:border-slate-800'
                    : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800/80'
                }`}
              >
                {/* Unread indicator bar */}
                {!email.isRead && (
                  <div className="absolute left-1 top-4 bottom-4 w-1 bg-gradient-to-b from-cyan-400 to-indigo-500 rounded-full" />
                )}

                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className={`text-xs truncate font-medium ${!email.isRead ? 'text-slate-100 font-semibold' : 'text-slate-300'}`}>
                    {email.sender?.name || email.sender?.email}
                  </span>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-[10px] text-slate-400">
                      {formatTime(email.receivedAt)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleStar(email);
                      }}
                      className="text-slate-500 hover:text-amber-400 transition-colors p-0.5"
                    >
                      <Star className={`w-3.5 h-3.5 ${email.isStarred ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                  </div>
                </div>

                <h4 className={`text-xs line-clamp-1 mb-1 ${!email.isRead ? 'text-slate-100 font-semibold' : 'text-slate-300 font-normal'}`}>
                  {email.subject || '(No Subject)'}
                </h4>

                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-2 font-normal">
                  {email.snippet}
                </p>

                {/* Badges row */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {priority && priority !== 'Low' && (
                    <Badge variant={priority}>
                      {priority}
                    </Badge>
                  )}
                  {hasActionItems && (
                    <Badge variant="cyan">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      {email.aiAnalysis.actionItems.length} tasks
                    </Badge>
                  )}
                  {email.labels?.slice(0, 1).map((lbl) => (
                    <span key={lbl} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400">
                      {lbl}
                    </span>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function InboxEmptyIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
  );
}
