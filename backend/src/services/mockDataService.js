/**
 * In-memory fallback mock dataset representing real synced Gmail threads,
 * rich HTML emails, AI summaries, actionable tasks, and priority flags.
 */

export const MOCK_USER = {
  _id: 'mock_user_101',
  googleId: 'google_oauth_demo_123',
  email: 'alex.morgan@techcorp.io',
  displayName: 'Alex Morgan',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  tokens: {
    accessToken: 'mock_access_token_gmail_live',
    refreshToken: 'mock_refresh_token_gmail_live',
    expiryDate: Date.now() + 3600 * 1000,
  },
  settings: {
    defaultTone: 'Professional',
    autoSummarize: true,
  },
  createdAt: new Date('2026-01-15T08:00:00Z'),
  updatedAt: new Date(),
};

export const INITIAL_MOCK_EMAILS = [
  {
    _id: 'msg_001',
    userId: 'mock_user_101',
    threadId: 'thread_101',
    messageId: 'msg_001',
    sender: { name: 'Sarah Chen', email: 'sarah.chen@venturepartners.com' },
    recipients: [{ name: 'Alex Morgan', email: 'alex.morgan@techcorp.io' }],
    subject: 'Series A Term Sheet & Closing Schedule Review',
    snippet: 'Hi Alex, following our partner meeting yesterday, we are thrilled to move forward with the lead investment for your Series A...',
    bodyHtml: `<div style="font-family: sans-serif; line-height: 1.6; color: #e2e8f0;">
      <p>Hi Alex,</p>
      <p>Following our partner meeting yesterday, our investment committee has formally approved our lead check for your <strong>Series A Round ($8.5M)</strong>.</p>
      <p>Attached is the preliminary term sheet for your review. We would like to finalize legal closing prior to the end of Q3.</p>
      <p><strong>Next critical steps:</strong></p>
      <ul>
        <li>Review section 4 (Liquidation Preferences & Board composition) with your counsel by <strong>Friday, Sept 5th</strong>.</li>
        <li>Schedule a 30-minute sync with our legal partner (David Ross) early next week.</li>
        <li>Return signed LOI by <strong>Wednesday, Sept 10th at 5:00 PM EST</strong>.</li>
      </ul>
      <p>Looking forward to building something incredible together!</p>
      <p>Best regards,<br><strong>Sarah Chen</strong><br>General Partner | Apex Venture Capital</p>
    </div>`,
    bodyText: 'Hi Alex, following our partner meeting yesterday, our investment committee has formally approved our lead check for your Series A Round ($8.5M)...',
    isRead: false,
    isStarred: true,
    labels: ['INBOX', 'IMPORTANT', 'INVESTMENT'],
    receivedAt: new Date(Date.now() - 1000 * 60 * 25), // 25 mins ago
    aiAnalysis: {
      summary: 'Apex Venture Capital formally approved the $8.5M Series A lead investment. Requires review of liquidation preferences with legal counsel by Sept 5 and signed LOI returned by Sept 10.',
      priority: 'High',
      actionItems: [
        'Review Section 4 (Liquidation & Board) with legal counsel',
        'Book 30-min alignment call with David Ross (Apex Legal)',
        'Sign and return LOI before Sept 10, 5:00 PM EST'
      ],
      deadlines: [new Date('2026-09-05T17:00:00Z'), new Date('2026-09-10T21:00:00Z')],
      explained: 'This email is a formal offer from a venture capital firm to invest $8.5 million in your startup. They gave you terms to agree on (like who gets seats on your board) and strict deadlines next week to sign the contract.'
    }
  },
  {
    _id: 'msg_002',
    userId: 'mock_user_101',
    threadId: 'thread_102',
    messageId: 'msg_002',
    sender: { name: 'Elena Rostova', email: 'elena@cloudscale.infra' },
    recipients: [{ name: 'Alex Morgan', email: 'alex.morgan@techcorp.io' }],
    subject: '[URGENT] Database Migration & Multi-Region Failover Drills',
    snippet: 'Hey team, as part of our SOC2 compliance and zero-downtime maintenance, we will be running the MongoDB sharding migration this Saturday...',
    bodyHtml: `<div style="font-family: sans-serif; line-height: 1.6; color: #e2e8f0;">
      <p>Hey team,</p>
      <p>As part of our SOC2 Type II compliance audit and multi-region disaster recovery readiness, we have scheduled the live sharding migration for the primary database cluster.</p>
      <p><strong>Maintenance Window:</strong> Saturday, 02:00 UTC - 04:30 UTC.</p>
      <p>Please ensure all backend service workers have circuit breakers active. Backend engineering leads must confirm on-call availability in the #infra-war-room channel by <strong>Thursday 6:00 PM</strong>.</p>
      <p>Cheers,<br><strong>Elena Rostova</strong><br>VP of Infrastructure & Security</p>
    </div>`,
    bodyText: 'Hey team, as part of our SOC2 Type II compliance audit and multi-region disaster recovery readiness, we have scheduled the live sharding migration...',
    isRead: false,
    isStarred: false,
    labels: ['INBOX', 'INFRASTRUCTURE'],
    receivedAt: new Date(Date.now() - 1000 * 60 * 95), // 1.5 hours ago
    aiAnalysis: {
      summary: 'Infra team scheduled a live MongoDB sharding migration on Saturday (02:00-04:30 UTC). Backend leads must confirm on-call readiness in Slack by Thursday 6:00 PM.',
      priority: 'High',
      actionItems: [
        'Confirm circuit breaker status on worker nodes',
        'RSVP in #infra-war-room Slack channel by Thursday 6 PM'
      ],
      deadlines: [new Date('2026-09-04T18:00:00Z')],
      explained: 'The IT infrastructure team is moving database servers this Saturday early morning to ensure the site stays up during disasters. They need backend leads to check in on Slack by Thursday.'
    }
  },
  {
    _id: 'msg_003',
    userId: 'mock_user_101',
    threadId: 'thread_103',
    messageId: 'msg_003',
    sender: { name: 'Marcus Brody', email: 'm.brody@designstudio.co' },
    recipients: [{ name: 'Alex Morgan', email: 'alex.morgan@techcorp.io' }],
    subject: 'Updated UI Design Tokens & Figma Design System v2.4',
    snippet: 'Hey Alex! Just finished publishing the new glassmorphic dark-theme components to Figma. Check out the new dashboard and AI drawer specs...',
    bodyHtml: `<div style="font-family: sans-serif; line-height: 1.6; color: #e2e8f0;">
      <p>Hey Alex,</p>
      <p>Hope your week is going great! We just finalized the v2.4 update for the MailPulse UI kit in Figma.</p>
      <p>Key additions:</p>
      <ul>
        <li>Polished dark-mode color palettes with cyan & violet accent glow.</li>
        <li>Accessible contrast ratios for email reading panes.</li>
        <li>Micro-interaction specifications for the tone-shift reply generator.</li>
      </ul>
      <p>Take a look at the link when you have a moment. No rush on this, let's review during our bi-weekly product sync.</p>
      <p>Best,<br><strong>Marcus Brody</strong><br>Lead Product Designer</p>
    </div>`,
    bodyText: 'Hey Alex, Hope your week is going great! We just finalized the v2.4 update for the MailPulse UI kit in Figma...',
    isRead: true,
    isStarred: true,
    labels: ['INBOX', 'DESIGN'],
    receivedAt: new Date(Date.now() - 1000 * 60 * 360), // 6 hours ago
    aiAnalysis: {
      summary: 'Design team published v2.4 of the design system with dark-mode accents and tone-shift selector micro-animations. Ready for review at the upcoming product sync.',
      priority: 'Low',
      actionItems: [
        'Review Figma v2.4 component library before product sync'
      ],
      deadlines: [],
      explained: 'Marcus shared the newly designed dark theme graphics for the app for you to check out before the next regular team meeting.'
    }
  },
  {
    _id: 'msg_004',
    userId: 'mock_user_101',
    threadId: 'thread_104',
    messageId: 'msg_004',
    sender: { name: 'Billing at Cloudflare', email: 'billing@cloudflare.com' },
    recipients: [{ name: 'Alex Morgan', email: 'alex.morgan@techcorp.io' }],
    subject: 'Invoice #INV-2026-8941 Ready for Payment',
    snippet: 'Your monthly invoice for Cloudflare Workers & Zero Trust Network services ($428.50) has been generated and charged to your card ending in 4119...',
    bodyHtml: `<div style="font-family: sans-serif; line-height: 1.6; color: #e2e8f0;">
      <p>Hello Alex Morgan,</p>
      <p>Your Cloudflare Enterprise & Workers usage invoice for the billing period is ready.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0; color: #cbd5e1;">
        <tr style="border-bottom: 1px solid #334155;"><td style="padding: 8px;">Cloudflare Workers Unbound</td><td style="padding: 8px; text-align: right;">$210.00</td></tr>
        <tr style="border-bottom: 1px solid #334155;"><td style="padding: 8px;">Zero Trust Access Seats (15)</td><td style="padding: 8px; text-align: right;">$105.00</td></tr>
        <tr style="border-bottom: 1px solid #334155;"><td style="padding: 8px;">DDoS Advanced Protection</td><td style="padding: 8px; text-align: right;">$113.50</td></tr>
        <tr style="font-weight: bold;"><td style="padding: 8px;">Total Charged</td><td style="padding: 8px; text-align: right; color: #38bdf8;">$428.50</td></tr>
      </table>
      <p>Payment was successfully processed via Visa ending in <strong>4119</strong>. Thank you for your business!</p>
    </div>`,
    bodyText: 'Hello Alex Morgan, Your Cloudflare invoice #INV-2026-8941 for $428.50 was charged successfully...',
    isRead: true,
    isStarred: false,
    labels: ['RECEIPTS'],
    receivedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    aiAnalysis: {
      summary: 'Cloudflare monthly subscription receipt for $428.50. Paid automatically with Visa 4119.',
      priority: 'Low',
      actionItems: [],
      deadlines: [],
      explained: 'A standard receipt confirming you were charged $428.50 for web hosting and security tools. No action needed.'
    }
  }
];

class MockStore {
  constructor() {
    this.user = { ...MOCK_USER };
    this.emails = JSON.parse(JSON.stringify(INITIAL_MOCK_EMAILS));
  }

  getUser() {
    return this.user;
  }

  updateUserSettings(settings) {
    this.user.settings = { ...this.user.settings, ...settings };
    return this.user;
  }

  getEmails({ page = 1, limit = 20, label, search, isRead, isStarred } = {}) {
    let filtered = [...this.emails];

    if (label && label !== 'ALL') {
      if (label === 'STARRED') {
        filtered = filtered.filter(e => e.isStarred);
      } else if (label === 'UNREAD') {
        filtered = filtered.filter(e => !e.isRead);
      } else if (label === 'ACTION_REQUIRED') {
        filtered = filtered.filter(e => e.aiAnalysis?.actionItems?.length > 0);
      } else {
        filtered = filtered.filter(e => e.labels.includes(label));
      }
    }

    if (typeof isRead === 'boolean') {
      filtered = filtered.filter(e => e.isRead === isRead);
    }
    if (typeof isStarred === 'boolean') {
      filtered = filtered.filter(e => e.isStarred === isStarred);
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(e =>
        e.subject.toLowerCase().includes(q) ||
        e.snippet.toLowerCase().includes(q) ||
        e.sender.name.toLowerCase().includes(q) ||
        e.sender.email.toLowerCase().includes(q) ||
        (e.aiAnalysis && e.aiAnalysis.summary.toLowerCase().includes(q))
      );
    }

    // Sort newest first
    filtered.sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt));

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      emails: paginated,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit) || 1,
      }
    };
  }

  getThread(threadId) {
    const threadEmails = this.emails.filter(e => e.threadId === threadId);
    if (!threadEmails.length) return null;
    return threadEmails[0]; // For single-message representation or full thread
  }

  modifyEmail(messageId, { isRead, isStarred, addLabels = [], removeLabels = [] }) {
    const email = this.emails.find(e => e.messageId === messageId || e._id === messageId);
    if (!email) return null;

    if (typeof isRead === 'boolean') email.isRead = isRead;
    if (typeof isStarred === 'boolean') email.isStarred = isStarred;

    if (addLabels.length) {
      email.labels = Array.from(new Set([...email.labels, ...addLabels]));
    }
    if (removeLabels.length) {
      email.labels = email.labels.filter(l => !removeLabels.includes(l));
    }

    return email;
  }

  sendEmail({ to, subject, body, threadId }) {
    const newMsgId = `msg_${Date.now()}`;
    const newThreadId = threadId || `thread_${Date.now()}`;

    const newEmail = {
      _id: newMsgId,
      userId: this.user._id,
      threadId: newThreadId,
      messageId: newMsgId,
      sender: { name: this.user.displayName, email: this.user.email },
      recipients: [{ name: to, email: to }],
      subject: subject || '(No Subject)',
      snippet: body.substring(0, 120),
      bodyHtml: `<div style="font-family: sans-serif; line-height: 1.6; color: #e2e8f0;"><p>${body.replace(/\n/g, '<br>')}</p></div>`,
      bodyText: body,
      isRead: true,
      isStarred: false,
      labels: ['SENT'],
      receivedAt: new Date(),
      aiAnalysis: {
        summary: `Outbound email to ${to}: ${subject}`,
        priority: 'Medium',
        actionItems: [],
        deadlines: [],
      }
    };

    this.emails.unshift(newEmail);
    return newEmail;
  }

  saveAiAnalysis(messageId, aiData) {
    const email = this.emails.find(e => e.messageId === messageId || e._id === messageId);
    if (email) {
      email.aiAnalysis = { ...email.aiAnalysis, ...aiData };
      return email.aiAnalysis;
    }
    return null;
  }
}

export const mockStore = new MockStore();
