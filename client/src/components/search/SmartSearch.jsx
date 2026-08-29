import React, { useState } from 'react';
import { Search, Sparkles, Filter, Calendar, Star, Clock, User, ArrowRight } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useMailStore } from '../../store/useMailStore';

export function SmartSearch({ emails }) {
  const { setSelectedThreadId, setActiveView } = useMailStore();
  const [query, setQuery] = useState('');
  const [semanticMode, setSemanticMode] = useState(true);

  const sampleSearches = [
    'Emails about Series A term sheet and venture funding',
    'Database migrations and scheduled downtime',
    'Invoices and Cloudflare receipts',
    'Figma UI design tokens and component updates',
  ];

  const filteredEmails = emails.filter((email) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      email.subject.toLowerCase().includes(q) ||
      email.snippet.toLowerCase().includes(q) ||
      email.sender?.name?.toLowerCase().includes(q) ||
      email.sender?.email?.toLowerCase().includes(q) ||
      (email.aiAnalysis && email.aiAnalysis.summary.toLowerCase().includes(q))
    );
  });

  const handleSelectThread = (threadId) => {
    setSelectedThreadId(threadId);
    setActiveView('inbox');
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-cyan-400" />
          Smart & Semantic Search
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Query your inbox using natural conversational language, key entities, or vector similarity.
        </p>
      </div>

      {/* Big Search Input */}
      <div className="p-2 rounded-2xl glass-panel border border-slate-700/60 shadow-2xl space-y-3">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-cyan-400 absolute left-4" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question or search: e.g. 'What are the deadlines for the Series A round?'"
            className="w-full pl-12 pr-32 py-3.5 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20"
          />
          <div className="absolute right-3 flex items-center gap-2">
            <button
              onClick={() => setSemanticMode(!semanticMode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                semanticMode
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Semantic</span>
            </button>
          </div>
        </div>

        {/* Suggestion tags */}
        <div className="flex items-center gap-2 flex-wrap px-2 text-xs">
          <span className="text-slate-500 font-medium">Try asking:</span>
          {sampleSearches.map((s, i) => (
            <button
              key={i}
              onClick={() => setQuery(s)}
              className="px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/40 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Found {filteredEmails.length} relevant conversations</span>
          {query && (
            <button onClick={() => setQuery('')} className="text-cyan-400 hover:underline">
              Clear search
            </button>
          )}
        </div>

        <div className="space-y-2.5">
          {filteredEmails.map((email) => (
            <div
              key={email._id || email.messageId}
              onClick={() => handleSelectThread(email.threadId)}
              className="p-4 rounded-xl glass-card glass-card-hover cursor-pointer border border-slate-800 space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                    {email.subject}
                  </span>
                  {email.aiAnalysis?.priority && (
                    <Badge variant={email.aiAnalysis.priority}>
                      {email.aiAnalysis.priority}
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-slate-400">
                  {new Date(email.receivedAt).toLocaleDateString()}
                </span>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2">
                {email.aiAnalysis?.summary || email.snippet}
              </p>

              <div className="flex items-center justify-between pt-1 text-xs text-slate-500 border-t border-slate-800/60">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-400" />
                  {email.sender?.name} ({email.sender?.email})
                </span>
                <span className="text-cyan-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  View thread <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
