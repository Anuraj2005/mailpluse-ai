import React, { useState } from 'react';
import { 
  Star, 
  Trash2, 
  Archive, 
  Mail, 
  MailOpen, 
  Reply, 
  Forward, 
  Sparkles, 
  HelpCircle, 
  Send, 
  Paperclip,
  CheckCircle2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { AISummaryCard } from '../ai/AISummaryCard';
import { ActionItemsBadge } from '../ai/ActionItemsBadge';
import { ToneSelector } from '../ai/ToneSelector';
import { useMailStore } from '../../store/useMailStore';
import { emailApi, aiApi } from '../../lib/api';

export function ThreadView({ email, onUpdateEmail, onRefresh }) {
  const { openCompose, openExplainModal, defaultTone } = useMailStore();
  const [selectedTone, setSelectedTone] = useState(defaultTone || 'Professional');
  const [replyText, setReplyText] = useState('');
  const [instructions, setInstructions] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showReplyDrawer, setShowReplyDrawer] = useState(false);

  if (!email) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 bg-slate-950/20 select-none">
        <div className="w-16 h-16 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-center mb-4 text-slate-600 shadow-inner">
          <Mail className="w-8 h-8" />
        </div>
        <h3 className="text-base font-semibold text-slate-300">Select an email to preview</h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1">
          Select any conversation from the list to view the full thread, AI summary, and smart replies.
        </p>
      </div>
    );
  }

  const handleToggleRead = async () => {
    try {
      const newReadState = !email.isRead;
      await emailApi.modify(email.messageId || email._id, { isRead: newReadState });
      onUpdateEmail(email.messageId || email._id, { isRead: newReadState });
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleStar = async () => {
    try {
      const newStarState = !email.isStarred;
      await emailApi.modify(email.messageId || email._id, { isStarred: newStarState });
      onUpdateEmail(email.messageId || email._id, { isStarred: newStarState });
    } catch (e) {
      console.error(e);
    }
  };

  const handleArchive = async () => {
    try {
      await emailApi.modify(email.messageId || email._id, { removeLabels: ['INBOX'] });
      onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleGenerateReply = async (toneToUse = selectedTone) => {
    setIsSynthesizing(true);
    setShowReplyDrawer(true);
    try {
      const res = await aiApi.generateReply({
        threadContext: `Subject: ${email.subject}\nFrom: ${email.sender?.name} <${email.sender?.email}>\nBody: ${email.bodyText || email.snippet}`,
        instructions,
        tone: toneToUse,
        senderName: email.sender?.name?.split(' ')[0] || 'there',
      });

      if (res.data?.reply) {
        setReplyText(res.data.reply);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    setIsSending(true);
    try {
      await emailApi.send({
        to: email.sender?.email,
        subject: email.subject.startsWith('Re:') ? email.subject : `Re: ${email.subject}`,
        body: replyText,
        threadId: email.threadId,
      });

      setReplyText('');
      setInstructions('');
      setShowReplyDrawer(false);
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-950/20">
      {/* Top Action Toolbar */}
      <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md">
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleToggleStar}
            title={email.isStarred ? 'Unstar' : 'Star'}
            className="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
          >
            <Star className={`w-4 h-4 ${email.isStarred ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>
          <button
            onClick={handleToggleRead}
            title={email.isRead ? 'Mark as unread' : 'Mark as read'}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            {email.isRead ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4 text-cyan-400" />}
          </button>
          <button
            onClick={handleArchive}
            title="Archive"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <Archive className="w-4 h-4" />
          </button>
          <button
            onClick={() => openExplainModal(email)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-500/30 transition-all ml-2"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Explain in Plain English</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ai"
            size="sm"
            onClick={() => handleGenerateReply()}
            isLoading={isSynthesizing}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Smart Reply</span>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => openCompose({ to: email.sender?.email, subject: `Re: ${email.subject}` })}
          >
            <Reply className="w-3.5 h-3.5" />
            <span>Full Reply</span>
          </Button>
        </div>
      </div>

      {/* Main Email Thread Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Email Header */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-100 tracking-tight">
                {email.subject || '(No Subject)'}
              </h2>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                {email.labels?.map((label) => (
                  <Badge key={label} variant="default">
                    {label}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
                {(email.sender?.name || email.sender?.email || 'U')[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200">
                  {email.sender?.name || email.sender?.email}
                </p>
                <p className="text-xs text-slate-400">
                  to {email.recipients?.map(r => r.name || r.email).join(', ') || 'me'}
                </p>
              </div>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {new Date(email.receivedAt).toLocaleString([], {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>

        {/* AI Summary Card */}
        <AISummaryCard
          email={email}
          onUpdateAnalysis={(analysis) => {
            onUpdateEmail(email.messageId || email._id, {
              aiAnalysis: { ...email.aiAnalysis, ...analysis }
            });
          }}
        />

        {/* Action Items & Deadlines */}
        <ActionItemsBadge
          actionItems={email.aiAnalysis?.actionItems}
          deadlines={email.aiAnalysis?.deadlines}
        />

        {/* Email Sanitized Body */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 shadow-sm text-slate-200 text-sm leading-relaxed overflow-hidden">
          {email.bodyHtml ? (
            <div 
              className="prose prose-invert max-w-none prose-p:my-2 prose-a:text-cyan-400"
              dangerouslySetInnerHTML={{ __html: email.bodyHtml }} 
            />
          ) : (
            <div className="whitespace-pre-wrap">
              {email.bodyText || email.snippet}
            </div>
          )}
        </div>

        {/* Inline AI Quick Reply Workspace Drawer */}
        {showReplyDrawer && (
          <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-violet-500/30 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-violet-300">
                  AI Contextual Reply Engine
                </span>
              </div>

              {/* Tone-Shift Selector */}
              <ToneSelector
                selectedTone={selectedTone}
                onSelectTone={(tone) => {
                  setSelectedTone(tone);
                  handleGenerateReply(tone);
                }}
              />
            </div>

            {/* Additional Custom Instructions prompt */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Optional prompt instruction: 'e.g., Ask for 15% discount on the invoice'..."
                className="flex-1 text-xs bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
              <Button
                variant="ai"
                size="sm"
                onClick={() => handleGenerateReply()}
                isLoading={isSynthesizing}
              >
                Regenerate
              </Button>
            </div>

            {/* Editable Draft Body */}
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={6}
              placeholder="Synthesizing reply..."
              className="w-full text-sm bg-slate-950 border border-slate-800/90 rounded-xl p-3.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 leading-relaxed resize-none"
            />

            {/* Send / Dismiss controls */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-400">
                Replying to <strong className="text-slate-200">{email.sender?.email}</strong>
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReplyDrawer(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSendReply}
                  isLoading={isSending}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Reply via Gmail</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
