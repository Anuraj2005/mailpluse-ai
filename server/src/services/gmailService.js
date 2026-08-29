import { google } from 'googleapis';
import { getOAuth2Client } from '../config/oauth.js';
import { User } from '../models/User.js';
import { EmailMetadata } from '../models/EmailMetadata.js';
import { isDbConnected } from '../config/db.js';
import { mockStore } from './mockDataService.js';
import { activeUserStore } from './userStore.js';
import { logger } from '../utils/logger.js';

export class GmailService {
  /**
   * Helper to construct authenticated Gmail API client from user tokens
   */
  static async getGmailClient(userId) {
    if (!userId || userId.toString().startsWith('mock_')) {
      return null;
    }

    let user = activeUserStore.getUser(userId);
    if (!user && isDbConnected()) {
      user = await User.findById(userId);
    }
    
    if (!user || !user.tokens?.accessToken) {
      return null;
    }

    const oauth2Client = getOAuth2Client();
    oauth2Client.setCredentials({
      access_token: user.tokens.accessToken,
      refresh_token: user.tokens.refreshToken,
      expiry_date: user.tokens.expiryDate,
    });

    // Handle token refresh automatically if expired
    oauth2Client.on('tokens', async (tokens) => {
      if (tokens.access_token && isDbConnected()) {
        await User.findByIdAndUpdate(userId, {
          'tokens.accessToken': tokens.access_token,
          'tokens.expiryDate': tokens.expiry_date,
          ...(tokens.refresh_token && { 'tokens.refreshToken': tokens.refresh_token }),
        });
      }
    });

    return google.gmail({ version: 'v1', auth: oauth2Client });
  }

  /**
   * Lists email threads with query filters, labels, and pagination
   */
  static async listEmails(userId, { page = 1, limit = 20, label, search, isStarred, isRead }) {
    const gmail = await this.getGmailClient(userId);

    if (!gmail) {
      return mockStore.getEmails({ page, limit, label, search, isStarred, isRead });
    }

    try {
      let q = '';
      if (label && label !== 'ALL') {
        if (label === 'STARRED') q += ' is:starred';
        else if (label === 'UNREAD') q += ' is:unread';
        else q += ` label:${label}`;
      }
      if (search) q += ` ${search}`;

      const res = await gmail.users.threads.list({
        userId: 'me',
        maxResults: limit,
        q: q.trim() || undefined,
      });

      const threads = res.data.threads || [];
      const detailedEmails = [];

      for (const thread of threads.slice(0, 10)) {
        const fullThread = await gmail.users.threads.get({
          userId: 'me',
          id: thread.id,
          format: 'full',
        });

        const messages = fullThread.data.messages || [];
        if (messages.length > 0) {
          const latestMessage = messages[messages.length - 1];
          const parsed = this.parseGmailMessage(latestMessage, thread.id);
          detailedEmails.push(parsed);
        }
      }

      return {
        emails: detailedEmails,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: res.data.resultSizeEstimate || detailedEmails.length,
          totalPages: Math.ceil((res.data.resultSizeEstimate || 10) / limit),
        }
      };
    } catch (err) {
      logger.error('Gmail API list error, falling back to mock dataset:', err.message);
      return mockStore.getEmails({ page, limit, label, search, isStarred, isRead });
    }
  }

  /**
   * Fetches a specific thread with full message contents
   */
  static async getThread(userId, threadId) {
    const gmail = await this.getGmailClient(userId);

    if (!gmail) {
      return mockStore.getThread(threadId);
    }

    try {
      const res = await gmail.users.threads.get({
        userId: 'me',
        id: threadId,
        format: 'full',
      });

      const messages = (res.data.messages || []).map(m => this.parseGmailMessage(m, threadId));
      return messages[messages.length - 1] || null;
    } catch (err) {
      logger.warn('Gmail API getThread error, falling back:', err.message);
      return mockStore.getThread(threadId);
    }
  }

  /**
   * Modifies labels (Read/Unread, Star/Unstar, Trash, Archive)
   */
  static async modifyEmail(userId, messageId, { isRead, isStarred, addLabels = [], removeLabels = [] }) {
    const gmail = await this.getGmailClient(userId);

    if (!gmail) {
      return mockStore.modifyEmail(messageId, { isRead, isStarred, addLabels, removeLabels });
    }

    try {
      const addLabelIds = [...addLabels];
      const removeLabelIds = [...removeLabels];

      if (typeof isRead === 'boolean') {
        if (isRead) removeLabelIds.push('UNREAD');
        else addLabelIds.push('UNREAD');
      }

      if (typeof isStarred === 'boolean') {
        if (isStarred) addLabelIds.push('STARRED');
        else removeLabelIds.push('STARRED');
      }

      await gmail.users.messages.modify({
        userId: 'me',
        id: messageId,
        requestBody: {
          addLabelIds: Array.from(new Set(addLabelIds)),
          removeLabelIds: Array.from(new Set(removeLabelIds)),
        }
      });

      return { messageId, isRead, isStarred, success: true };
    } catch (err) {
      logger.error('Gmail API modify error:', err.message);
      return mockStore.modifyEmail(messageId, { isRead, isStarred, addLabels, removeLabels });
    }
  }

  /**
   * Composes and sends a new outbound email or thread reply
   */
  static async sendEmail(userId, { to, subject, body, threadId }) {
    const gmail = await this.getGmailClient(userId);

    if (!gmail) {
      return mockStore.sendEmail({ to, subject, body, threadId });
    }

    try {
      const rawMessage = this.makeEmailRaw({ to, subject, body, threadId });
      const res = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: rawMessage,
          threadId: threadId || undefined,
        }
      });

      return {
        messageId: res.data.id,
        threadId: res.data.threadId,
        to,
        subject,
        body,
        receivedAt: new Date(),
      };
    } catch (err) {
      logger.error('Gmail API send error:', err.message);
      return mockStore.sendEmail({ to, subject, body, threadId });
    }
  }

  /**
   * MIME encoder utility for RFC 2822 email payloads
   */
  static makeEmailRaw({ to, subject, body }) {
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject || '').toString('base64')}?=`;
    const messageParts = [
      `To: ${to}`,
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: ${utf8Subject}`,
      '',
      body,
    ];
    const message = messageParts.join('\n');
    return Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  /**
   * Parses raw Gmail message payload into uniform schema
   */
  static parseGmailMessage(message, threadId) {
    const headers = message.payload?.headers || [];
    const getHeader = (name) => headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || '';

    const fromHeader = getHeader('From');
    const senderName = fromHeader.replace(/<.*>/, '').trim().replace(/^"|"$/g, '');
    const senderEmailMatch = fromHeader.match(/<([^>]+)>/);
    const senderEmail = senderEmailMatch ? senderEmailMatch[1] : fromHeader;

    const toHeader = getHeader('To');
    const subject = getHeader('Subject') || '(No Subject)';
    const dateHeader = getHeader('Date');
    const receivedAt = dateHeader ? new Date(dateHeader) : new Date();

    const labelIds = message.labelIds || [];
    const isRead = !labelIds.includes('UNREAD');
    const isStarred = labelIds.includes('STARRED');

    let bodyHtml = '';
    let bodyText = message.snippet || '';

    if (message.payload) {
      const extractBody = (part) => {
        if (part.mimeType === 'text/html' && part.body?.data) {
          bodyHtml = Buffer.from(part.body.data, 'base64').toString('utf-8');
        } else if (part.mimeType === 'text/plain' && part.body?.data && !bodyText) {
          bodyText = Buffer.from(part.body.data, 'base64').toString('utf-8');
        }
        if (part.parts) {
          part.parts.forEach(extractBody);
        }
      };
      extractBody(message.payload);
    }

    return {
      _id: message.id,
      messageId: message.id,
      threadId: threadId || message.threadId,
      sender: { name: senderName || senderEmail, email: senderEmail },
      recipients: [{ name: toHeader, email: toHeader }],
      subject,
      snippet: message.snippet || '',
      bodyHtml: bodyHtml || `<p>${bodyText}</p>`,
      bodyText: bodyText,
      isRead,
      isStarred,
      labels: labelIds,
      receivedAt,
      aiAnalysis: {
        summary: '',
        priority: 'Medium',
        actionItems: [],
        deadlines: [],
      }
    };
  }
}
