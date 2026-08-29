import { google } from 'googleapis';
import jwt from 'jsonwebtoken';
import { getOAuth2Client, OAUTH_SCOPES, isGoogleOAuthConfigured } from '../config/oauth.js';
import { User } from '../models/User.js';
import { isDbConnected } from '../config/db.js';
import { mockStore } from './mockDataService.js';
import { activeUserStore } from './userStore.js';
import { logger } from '../utils/logger.js';
import { encrypt } from '../utils/crypto.js';

export class OAuthService {
  /**
   * Generates Google Consent URL with restricted scopes
   */
  static getConsentUrl(state) {
    if (!isGoogleOAuthConfigured()) {
      // In dev mode without GCP keys, return special direct mock URL
      return `${process.env.CLIENT_URL || 'http://localhost:5173'}/auth/callback?mock=true`;
    }

    const oauth2Client = getOAuth2Client();
    const authUrlOptions = {
      access_type: 'offline',
      prompt: 'consent select_account',
      scope: OAUTH_SCOPES,
      include_granted_scopes: true,
    };

    if (state) {
      authUrlOptions.state = state;
    }

    return oauth2Client.generateAuthUrl(authUrlOptions);
  }

  /**
   * Exchanges authorization code for tokens, fetches profile, stores user in Mongo, creates JWT
   */
  static async handleCallback(code, isMock = false) {
    if (isMock || !isGoogleOAuthConfigured()) {
      logger.info('Performing quick demo authentication session');
      const user = mockStore.getUser();
      const token = this.generateSessionToken(user);
      return { user, token };
    }

    const oauth2Client = getOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Fetch Google User Profile
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data: profile } = await oauth2.userinfo.get();

    let user;
    if (isDbConnected()) {
      user = await User.findOneAndUpdate(
        { googleId: profile.id },
        {
          googleId: profile.id,
          email: profile.email,
          displayName: profile.name || profile.email.split('@')[0],
          avatarUrl: profile.picture || '',
          tokens: {
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token || undefined,
            expiryDate: tokens.expiry_date,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    } else {
      user = {
        _id: 'user_' + profile.id,
        googleId: profile.id,
        email: profile.email,
        displayName: profile.name || profile.email.split('@')[0],
        avatarUrl: profile.picture || '',
        tokens: {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          expiryDate: tokens.expiry_date,
        },
        settings: {
          defaultTone: 'Professional',
          autoSummarize: true,
        }
      };
    }

    // Persist in active user store for instant access across requests
    activeUserStore.setUser(user._id, user);

    const token = this.generateSessionToken(user);
    return { user, token };
  }

  static generateSessionToken(user) {
    const sessionSnapshot = encrypt(JSON.stringify({
      _id: user._id,
      googleId: user.googleId,
      email: user.email,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      tokens: user.tokens,
      settings: user.settings,
    }));

    const payload = {
      userId: user._id,
      email: user.email,
      googleId: user.googleId,
      sessionSnapshot,
    };

    return jwt.sign(payload, process.env.JWT_SECRET || 'mailpulse_jwt_secret_dev_key', {
      expiresIn: '7d',
    });
  }
}
