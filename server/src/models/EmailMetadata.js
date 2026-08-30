import mongoose from 'mongoose';

const emailMetadataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  threadId: {
    type: String,
    required: true,
    index: true,
  },
  messageId: {
    type: String,
    required: true,
    unique: true,
  },
  sender: {
    name: { type: String, default: '' },
    email: { type: String, required: true },
  },
  recipients: [{
    name: { type: String, default: '' },
    email: { type: String, required: true },
  }],
  subject: {
    type: String,
    default: '(No Subject)',
  },
  snippet: {
    type: String,
    default: '',
  },
  bodyHtml: {
    type: String,
    default: '',
  },
  bodyText: {
    type: String,
    default: '',
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true,
  },
  isStarred: {
    type: Boolean,
    default: false,
    index: true,
  },
  labels: {
    type: [String],
    default: ['INBOX'],
    index: true,
  },
  receivedAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  aiAnalysis: {
    summary: { type: String, default: '' },
    priority: { type: String, enum: ['High', 'Medium', 'Low', 'Unknown'], default: 'Medium' },
    actionItems: { type: [String], default: [] },
    deadlines: { type: [Date], default: [] },
    explained: { type: String, default: '' },
  }
}, {
  timestamps: true,
});

export const EmailMetadata = mongoose.models.EmailMetadata || mongoose.model('EmailMetadata', emailMetadataSchema);
