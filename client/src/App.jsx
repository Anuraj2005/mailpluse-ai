import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Sidebar } from './components/dashboard/Sidebar';
import { EmailList } from './components/dashboard/EmailList';
import { ThreadView } from './components/dashboard/ThreadView';
import { ComposeModal } from './components/compose/ComposeModal';
import { ExplainModal } from './components/ai/ExplainModal';
import { SmartSearch } from './components/search/SmartSearch';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { SettingsView } from './components/settings/SettingsView';
import { LandingPage } from './components/landing/LandingPage';
import { useMailStore } from './store/useMailStore';
import { authApi, emailApi } from './lib/api';

export function App() {
  const queryClient = useQueryClient();
  const {
    user,
    setUser,
    activeView,
    activeLabel,
    searchQuery,
    selectedThreadId,
    setSelectedThreadId,
  } = useMailStore();

  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize Auth Status
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

  // Fetch Synced Emails
  const {
    data: emailData,
    isLoading: isEmailsLoading,
    refetch: refetchEmails,
  } = useQuery({
    queryKey: ['emails', activeLabel, searchQuery],
    queryFn: () => emailApi.list({ label: activeLabel, search: searchQuery }),
    enabled: Boolean(user),
    staleTime: 1000 * 30, // 30s cache
  });

  const emails = emailData?.data || [];

  // Auto-select first thread if none selected
  useEffect(() => {
    if (emails.length > 0 && !selectedThreadId) {
      setSelectedThreadId(emails[0].threadId);
    }
  }, [emails, selectedThreadId, setSelectedThreadId]);

  const selectedEmail = emails.find((e) => e.threadId === selectedThreadId) || (emails.length > 0 ? emails[0] : null);

  // Optimistic/direct email updates
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
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-background text-slate-100 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-950/60 ring-1 ring-cyan-400/40 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <p className="text-xs text-slate-400 font-medium">Initializing MailPulse AI...</p>
      </div>
    );
  }

  // If not logged in, render Landing Page
  if (!user) {
    return <LandingPage />;
  }

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-background">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden">
        {activeView === 'inbox' && (
          <div className="flex-1 flex overflow-hidden">
            <EmailList
              emails={emails}
              isLoading={isEmailsLoading}
              onRefresh={refetchEmails}
              onToggleStar={handleToggleStar}
            />
            <ThreadView
              email={selectedEmail}
              onUpdateEmail={handleUpdateEmail}
              onRefresh={refetchEmails}
            />
          </div>
        )}

        {activeView === 'search' && (
          <SmartSearch emails={emails} />
        )}

        {activeView === 'analytics' && (
          <AnalyticsView emails={emails} />
        )}

        {activeView === 'settings' && (
          <SettingsView />
        )}
      </main>

      {/* Global Modals */}
      <ComposeModal />
      <ExplainModal />
    </div>
  );
}
export default App;
