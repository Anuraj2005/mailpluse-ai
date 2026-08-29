import axios from 'axios';

export const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authApi = {
  getGoogleUrl: async () => (await api.get('/auth/google/url')).data,
  getMe: async () => (await api.get('/auth/me')).data,
  loginDemo: async () => (await api.post('/auth/demo')).data,
  logout: async () => (await api.post('/auth/logout')).data,
  updateSettings: async (settings) => (await api.post('/auth/settings', settings)).data,
};

export const emailApi = {
  list: async ({ page = 1, limit = 20, label, search, isStarred, isRead } = {}) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (label && label !== 'ALL') params.append('label', label);
    if (search) params.append('search', search);
    if (typeof isStarred === 'boolean') params.append('isStarred', isStarred);
    if (typeof isRead === 'boolean') params.append('isRead', isRead);
    return (await api.get(`/emails?${params.toString()}`)).data;
  },
  getThread: async (threadId) => (await api.get(`/emails/${threadId}`)).data,
  modify: async (messageId, payload) => (await api.patch(`/emails/${messageId}/modify`, payload)).data,
  send: async ({ to, subject, body, threadId }) => (await api.post('/emails/send', { to, subject, body, threadId })).data,
};

export const aiApi = {
  summarize: async ({ text, subject, sender, threadId, messageId }) =>
    (await api.post('/ai/summarize', { text, subject, sender, threadId, messageId })).data,
  generateReply: async ({ threadContext, instructions, tone, senderName }) =>
    (await api.post('/ai/generate-reply', { threadContext, instructions, tone, senderName })).data,
  explain: async ({ subject, text }) =>
    (await api.post('/ai/explain', { subject, text })).data,
  extractInsights: async ({ subject, text, messageId }) =>
    (await api.post('/ai/extract-insights', { subject, text, messageId })).data,
};
