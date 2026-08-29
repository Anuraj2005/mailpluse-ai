import { create } from 'zustand';

export const useMailStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  activeView: 'inbox', // 'inbox', 'search', 'analytics', 'settings'
  activeLabel: 'ALL',  // 'ALL', 'UNREAD', 'STARRED', 'ACTION_REQUIRED', 'SENT', 'RECEIPTS'
  searchQuery: '',
  selectedThreadId: null,
  isComposeOpen: false,
  composeInitialData: null,
  isExplainModalOpen: false,
  explainTargetEmail: null,
  defaultTone: 'Professional',
  aiSummariesCache: {},

  setUser: (user) => set({ user, isAuthenticated: Boolean(user) }),
  setActiveView: (activeView) => set({ activeView }),
  setActiveLabel: (activeLabel) => set({ activeLabel }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedThreadId: (selectedThreadId) => set({ selectedThreadId }),
  openCompose: (initialData = null) => set({ isComposeOpen: true, composeInitialData: initialData }),
  closeCompose: () => set({ isComposeOpen: false, composeInitialData: null }),
  openExplainModal: (email) => set({ isExplainModalOpen: true, explainTargetEmail: email }),
  closeExplainModal: () => set({ isExplainModalOpen: false, explainTargetEmail: null }),
  setDefaultTone: (defaultTone) => set({ defaultTone }),
  cacheSummary: (messageId, summaryData) =>
    set((state) => ({
      aiSummariesCache: { ...state.aiSummariesCache, [messageId]: summaryData }
    })),
}));
