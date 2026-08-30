import React, { useState, useEffect } from 'react';
import { Send, Sparkles, X, Paperclip, AlertCircle, Wand2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ToneSelector } from '../ai/ToneSelector';
import { useMailStore } from '../../store/useMailStore';
import { emailApi, aiApi } from '../../lib/api';

export function ComposeModal() {
  const { isComposeOpen, closeCompose, composeInitialData, defaultTone } = useMailStore();
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [prompt, setPrompt] = useState('');
  const [selectedTone, setSelectedTone] = useState(defaultTone || 'Professional');
  const [isAiDrafting, setIsAiDrafting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (composeInitialData) {
      setTo(composeInitialData.to || '');
      setSubject(composeInitialData.subject || '');
      setBody(composeInitialData.body || '');
    } else {
      setTo('');
      setSubject('');
      setBody('');
    }
    setPrompt('');
    setErrorMessage('');
  }, [composeInitialData, isComposeOpen]);

  const handleAiDraft = async () => {
    if (!prompt.trim()) return;
    setIsAiDrafting(true);
    setErrorMessage('');
    try {
      const res = await aiApi.generateReply({
        threadContext: `Goal: ${prompt}\nSubject: ${subject || 'New Communication'}`,
        instructions: prompt,
        tone: selectedTone,
        senderName: to.split('@')[0] || 'Recipient',
      });

      if (res.data?.reply) {
        setBody(res.data.reply);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Could not synthesize AI draft.');
    } finally {
      setIsAiDrafting(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!to || !body) {
      setErrorMessage('Please provide both recipient and email body.');
      return;
    }

    setIsSending(true);
    setErrorMessage('');
    try {
      await emailApi.send({
        to,
        subject: subject || '(No Subject)',
        body,
      });

      closeCompose();
      window.location.reload(); // Quick refresh of sent threads
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to dispatch email. Please check configuration.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Modal
      isOpen={isComposeOpen}
      onClose={closeCompose}
      maxWidth="max-w-3xl"
      title={
        <div className="flex items-center gap-2 text-slate-100">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <span>Compose New Message</span>
        </div>
      }
    >
      <form onSubmit={handleSend} className="space-y-4">
        {errorMessage && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Recipients & Subject */}
        <div className="space-y-2">
          <div className="flex items-center rounded-xl bg-slate-900/90 border border-slate-800 px-3.5 py-2">
            <span className="text-xs text-slate-400 font-medium w-16">To:</span>
            <input
              type="email"
              required
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@example.com"
              className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center rounded-xl bg-slate-900/90 border border-slate-800 px-3.5 py-2">
            <span className="text-xs text-slate-400 font-medium w-16">Subject:</span>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Discussion regarding project roadmap"
              className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-600 focus:outline-none"
            />
          </div>
        </div>

        {/* AI Drafting Assistant Toolbar */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-indigo-500/30 space-y-2.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
              AI Prompt to Draft
            </span>
            <ToneSelector
              selectedTone={selectedTone}
              onSelectTone={setSelectedTone}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Ask Sarah to reschedule tomorrow's product sync to 3 PM EST..."
              className="flex-1 text-xs bg-slate-950/90 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <Button
              variant="ai"
              size="sm"
              type="button"
              onClick={handleAiDraft}
              isLoading={isAiDrafting}
            >
              Draft with AI
            </Button>
          </div>
        </div>

        {/* Email Body Area */}
        <div>
          <textarea
            required
            rows={10}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your email here or generate a draft using the AI bar above..."
            className="w-full text-sm bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 leading-relaxed resize-none"
          />
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            type="button"
            className="text-slate-400 hover:text-slate-200 p-2 rounded-lg hover:bg-slate-800 transition-colors"
            title="Attach file (mock)"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" type="button" onClick={closeCompose}>
              Discard
            </Button>
            <Button variant="primary" size="md" type="submit" isLoading={isSending}>
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
