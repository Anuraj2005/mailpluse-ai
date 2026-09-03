import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Sidebar } from './components/dashboard/Sidebar';
import { EmailList } from './components/dashboard/EmailList';
import { ThreadView } from './components/dashboard/ThreadView';
import { ComposeModal } from './components/compose/ComposeModal';
import { ExplainModal } from './components/ai/ExplainModal';
import { SmartSearch } from './components/search/SmartSearch';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { SettingsView } from './components/settings/SettingsView';
import { AISummaryCard } from './components/ai/AISummaryCard';
import { LandingPage } from './components/landing/LandingPage';
import { useMailStore } from './store/useMailStore';
import { authApi, emailApi } from './lib/api';
import { useTheme } from './hooks/useTheme';
import PrivacyPolicy from './app/privacy/page';
import TermsPage from './app/terms/page';
import { Menu, Search, Sparkles, Zap, Plus } from 'lucide-react';
import { ActionItemsBadge } from './components/ai/ActionItemsBadge';
import { ToneSelector } from './components/ai/ToneSelector';

function AppShell() {
  const queryClient = useQueryClient();
  useTheme();
  const {
    user,
    setUser,
    activeView,
    activeLabel,
    searchQuery,
    selectedThreadId,
    setSelectedThreadId,
    openCompose,
  } = useMailStore();

  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (!user) {
      queryClient.removeQueries({ queryKey: ['emails'] });
      setSelectedThreadId(null);
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['emails'] });
    setSelectedThreadId(null);
  }, [user, queryClient, setSelectedThreadId]);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await authApi.getMe();
        if (res.user) {
          setUser(res.user);
        }
      } catch (err) {
        console.warn('Initial session check notice:', err.message);
      } finally {
        setIsInitializing(false);
      }
    }
    checkAuth();
  }, [setUser]);

  const {
    data: emailData,
    isLoading: isEmailsLoading,
    refetch: refetchEmails,
  } = useQuery({
    queryKey: ['emails', activeLabel, searchQuery],
    queryFn: () => emailApi.list({ label: activeLabel, search: searchQuery }),
    enabled: Boolean(user),
    staleTime: 1000 * 30,
  });

  const emails = emailData?.data || [];

  useEffect(() => {
    if (emails.length > 0 && !selectedThreadId) {
      setSelectedThreadId(emails[0].threadId);
    }
  }, [emails, selectedThreadId, setSelectedThreadId]);

  const selectedEmail = emails.find((e) => e.threadId === selectedThreadId) || (emails.length > 0 ? emails[0] : null);

  const handleUpdateEmail = (messageId, updates) => {
    queryClient.setQueryData(['emails', activeLabel, searchQuery], (old) => {
      if (!old?.data) return old;
      return {
        ...old,
        data: old.data.map((email) => {
          if (email.messageId === messageId || email._id === messageId) {
            return { ...email, ...updates };
          }
          return email;
        }),
      };
    });
  };

  const handleToggleStar = async (email) => {
    const newStarred = !email.isStarred;
    handleUpdateEmail(email.messageId || email._id, { isStarred: newStarred });
    try {
      await emailApi.modify(email.messageId || email._id, { isStarred: newStarred });
    } catch (e) {
      console.error(e);
      refetchEmails();
    }
  };

  if (isInitializing) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-background text-foreground space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-950/60 ring-1 ring-cyan-400/40 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <p className="text-xs text-slate-400 font-medium">Initializing MailPulse AI...</p>
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background text-foreground lg:flex-row">
      <header className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-800/80 bg-slate-950/90 px-3 backdrop-blur-xl lg:hidden">
        <details className="relative">
          <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-xl text-slate-300 hover:bg-slate-800 [&::-webkit-details-marker]:hidden">
            <Menu className="h-5 w-5" />
          </summary>
          <div className="fixed inset-y-0 left-0 z-40 w-[min(84vw,18rem)] border-r border-slate-800 bg-slate-950 px-3 pb-6 pt-4 shadow-2xl">
            <div className="mb-5 flex items-center gap-2 px-2 text-sm font-bold text-slate-100">
              <Zap className="h-5 w-5 fill-cyan-400 text-cyan-400" />
              MailPulse <span className="text-cyan-400">AI</span>
            </div>
            <Sidebar />
          </div>
        </details>
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2">
          <Search className="h-4 w-4 shrink-0 text-slate-500" />
          <input className="min-w-0 flex-1 bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500" placeholder="Search mail" />
        </div>
        <img src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} alt={user?.displayName || 'Profile'} className="h-10 w-10 rounded-full object-cover ring-2 ring-cyan-500/30" />
      </header>

      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {activeView === 'inbox' && (
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
            <div className={`${selectedThreadId ? 'hidden lg:flex' : 'flex'} min-h-0 min-w-0 flex-1 lg:w-[42%] lg:flex-none`}>
              <EmailList emails={emails} isLoading={isEmailsLoading} onRefresh={refetchEmails} onToggleStar={handleToggleStar} />
            </div>
            <div className={`${selectedThreadId ? 'flex' : 'hidden lg:flex'} min-h-0 min-w-0 flex-1`}>
              <ThreadView email={selectedEmail} onUpdateEmail={handleUpdateEmail} onRefresh={refetchEmails} />
            </div>
            <aside className="hidden w-[22rem] shrink-0 border-l border-slate-800/80 bg-slate-950/40 p-4 xl:block">
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-300">
                <Sparkles className="h-4 w-4" /> AI Pulse Copilot
              </div>
              {selectedEmail && <AISummaryCard email={selectedEmail} onUpdateAnalysis={(analysis) => handleUpdateEmail(selectedEmail.messageId || selectedEmail._id, { aiAnalysis: { ...selectedEmail.aiAnalysis, ...analysis } })} />}
            </aside>
          </div>
        )}

        {activeView === 'search' && <SmartSearch emails={emails} />}
        {activeView === 'analytics' && <AnalyticsView emails={emails} />}
        {activeView === 'settings' && <SettingsView />}
      </main>

      {activeView === 'inbox' && (
        <details className="group fixed bottom-5 right-4 z-30 lg:hidden">
          <summary className="flex h-14 w-14 cursor-pointer list-none items-center justify-center rounded-full bg-cyan-500 text-slate-950 shadow-xl shadow-cyan-950/40 transition-transform group-open:rotate-45 [&::-webkit-details-marker]:hidden">
            <Sparkles className="h-6 w-6" />
          </summary>
          <div className="fixed inset-x-0 bottom-0 z-20 max-h-[75vh] overflow-y-auto rounded-t-3xl border border-cyan-500/25 bg-slate-950/95 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-2xl backdrop-blur-xl">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-700" />
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-cyan-300">
              <Sparkles className="h-4 w-4" /> AI Pulse Copilot
            </div>
            {selectedEmail ? (
              <div className="space-y-3">
                <AISummaryCard email={selectedEmail} onUpdateAnalysis={(analysis) => handleUpdateEmail(selectedEmail.messageId || selectedEmail._id, { aiAnalysis: { ...selectedEmail.aiAnalysis, ...analysis } })} />
                <ActionItemsBadge actionItems={selectedEmail.aiAnalysis?.actionItems} deadlines={selectedEmail.aiAnalysis?.deadlines} />
                <ToneSelector selectedTone="Professional" onSelectTone={() => {}} className="w-full overflow-x-auto" />
              </div>
            ) : <p className="text-sm text-slate-400">Open an email to see its AI pulse.</p>}
          </div>
        </details>
      )}
      {activeView === 'inbox' && (
        <button type="button" onClick={() => openCompose()} className="fixed bottom-5 right-20 z-30 flex h-14 items-center gap-2 rounded-full bg-cyan-500 px-4 text-sm font-bold text-slate-950 shadow-xl shadow-cyan-950/40 lg:hidden">
          <Plus className="h-5 w-5" /> Compose
        </button>
      )}

      <ComposeModal />
      <ExplainModal />
    </div>
  );
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<AppShell />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
