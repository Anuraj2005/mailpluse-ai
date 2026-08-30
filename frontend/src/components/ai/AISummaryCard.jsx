import React, { useState } from 'react';
import { Sparkles, RefreshCw, AlertCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { aiApi } from '../../lib/api';

export function AISummaryCard({ email, onUpdateAnalysis }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const summary = email.aiAnalysis?.summary;
  const priority = email.aiAnalysis?.priority || 'Medium';

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    try {
      const res = await aiApi.summarize({
        text: email.bodyText || email.snippet,
        subject: email.subject,
        sender: email.sender?.name,
        threadId: email.threadId,
        messageId: email.messageId || email._id,
      });

      if (res.data) {
        onUpdateAnalysis({
          summary: res.data.summary,
          priority: res.data.priority,
        });
      }
    } catch (err) {
      console.error('Failed to summarize email:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-950/30 via-slate-900/60 to-cyan-950/20 p-4.5 shadow-xl backdrop-blur-md">
      {/* Decorative gradient glow top border */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-violet-500 to-indigo-500" />

      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-300">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-violet-300">
              AI Summary & Insights
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {priority && (
            <Badge variant={priority}>
              Priority: {priority}
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGenerateSummary}
            isLoading={isGenerating}
            className="text-xs text-violet-300 hover:text-white hover:bg-violet-900/40"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            {summary ? 'Regenerate' : 'Generate TL;DR'}
          </Button>
        </div>
      </div>

      {summary ? (
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal bg-slate-900/50 p-3 rounded-xl border border-slate-800/80">
          {summary}
        </p>
      ) : (
        <div className="flex items-center justify-between bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
          <p className="text-xs text-slate-400">
            No summary cached yet for this thread.
          </p>
          <Button
            variant="ai"
            size="sm"
            onClick={handleGenerateSummary}
            isLoading={isGenerating}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Summarize with AI
          </Button>
        </div>
      )}
    </div>
  );
}
