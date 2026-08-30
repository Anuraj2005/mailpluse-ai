import mongoose from 'mongoose';
import { encrypt, decrypt } from '../utils/crypto.js';

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  displayName: {
    type: String,
    default: '',
  },
  avatarUrl: {
    type: String,
    default: '',
  },
  tokens: {
    accessToken: {
      type: String,
      set: (val) => (val ? encrypt(val) : val),
      get: (val) => (val ? decrypt(val) : val),
    },
    refreshToken: {
      type: String,
      set: (val) => (val ? encrypt(val) : val),
      get: (val) => (val ? decrypt(val) : val),
    },
    expiryDate: {
      type: Number,
      default: 0,
    }
  },
  settings: {
    defaultTone: {
      type: String,
      enum: ['Professional', 'Friendly', 'Formal', 'Concise'],
      default: 'Professional',
    },
    autoSummarize: {
      type: Boolean,
      default: true,
    },
  }
}, {
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true },
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
