import React, { useState } from 'react';
import { Settings, ShieldCheck, Sparkles, Check, Key, Sliders, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { ToneSelector } from '../ai/ToneSelector';
import { useMailStore } from '../../store/useMailStore';
import { authApi } from '../../lib/api';

export function SettingsView() {
  const { user, defaultTone, setDefaultTone, setUser } = useMailStore();
  const [autoSummarize, setAutoSummarize] = useState(user?.settings?.autoSummarize ?? true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const res = await authApi.updateSettings({
        defaultTone,
        autoSummarize,
      });
      if (res.settings) {
        setUser({ ...user, settings: res.settings });
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Settings className="w-6 h-6 text-cyan-400" />
          Settings & AI Preferences
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Configure default AI generation behaviors, tone preferences, and security connections.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Preferences successfully saved and synchronized.</span>
        </div>
      )}

      {/* AI Tone & Summarization Section */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-5">
        <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-violet-400" />
          Default AI Generation Settings
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Default Reply Tone
            </label>
            <ToneSelector
              selectedTone={defaultTone}
              onSelectTone={setDefaultTone}
              className="max-w-md"
            />
            <p className="text-[11px] text-slate-500 mt-1.5">
              MailPulse AI will pre-select this tone when you initiate a smart reply or draft.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-200">Auto-Summarize Incoming Threads</p>
              <p className="text-[11px] text-slate-500">
                Automatically generate TL;DR summaries and extract deadlines when opening an unread thread.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoSummarize}
                onChange={(e) => setAutoSummarize(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Connected Account & Security Info */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Google Account & Token Security
        </h3>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt="Profile"
                className="w-10 h-10 rounded-xl ring-1 ring-cyan-500/40"
              />
              <div>
                <p className="text-sm font-bold text-slate-200">{user?.displayName || 'Alex Morgan'}</p>
                <p className="text-xs text-slate-400">{user?.email || 'alex.morgan@techcorp.io'}</p>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 font-medium flex items-center gap-1">
              <Check className="w-3 h-3" /> OAuth Connected
            </span>
          </div>

          <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-slate-800/60">
            <p><strong>Tokens at rest:</strong> Encrypted using AES-256-GCM.</p>
            <p><strong>Scopes authorized:</strong> `gmail.modify`, `gmail.send`, `openid`, `profile`, `email`.</p>
            <p><strong>Credentials:</strong> Zero password collection. Scoped via Google OAuth 2.0.</p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <Button variant="primary" size="md" onClick={handleSave} isLoading={isSaving}>
          <Check className="w-4 h-4" />
          <span>Save Changes</span>
        </Button>
      </div>
    </div>
  );
}
