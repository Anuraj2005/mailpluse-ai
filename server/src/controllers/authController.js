import { OAuthService } from '../services/oauthService.js';
import { isGoogleOAuthConfigured } from '../config/oauth.js';
import { mockStore } from '../services/mockDataService.js';

export class AuthController {
  /**
   * GET /api/v1/auth/google/url
   * Returns Google Consent screen OAuth URL
   */
  static async getGoogleUrl(req, res, next) {
    try {
      const url = OAuthService.getConsentUrl();
      res.json({
        success: true,
        url,
        isOAuthConfigured: isGoogleOAuthConfigured(),
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/auth/google/callback
   * Exchanges code for tokens and issues session cookie
   */
  static async handleGoogleCallback(req, res, next) {
    try {
      const { code, mock } = req.query;
      const { user, token } = await OAuthService.handleCallback(code, mock === 'true');

      // Set secure HTTP-Only session cookie
      res.cookie('mailpulse_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Return to the SPA root after login so Vercel does not serve a 404 on a deep link.
      const clientRedirectUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/?auth=success`;
      res.redirect(clientRedirectUrl);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/auth/me
   * Returns current authenticated user profile
   */
  static async getMe(req, res, next) {
    try {
      if (!req.user) {
        return res.json({
          success: true,
          user: null,
        });
      }

      const user = req.user;
      res.json({
        success: true,
        user: {
          id: user._id || user.googleId,
          email: user.email,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl,
          settings: user.settings || { defaultTone: 'Professional', autoSummarize: true },
          isOAuthConfigured: isGoogleOAuthConfigured(),
        }
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/auth/demo
   * Logs into instant workspace demo session
   */
  static async loginDemo(req, res, next) {
    try {
      const user = mockStore.getUser();
      const token = OAuthService.generateSessionToken(user);

      res.cookie('mailpulse_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({
        success: true,
        user: {
          id: user._id || user.googleId,
          email: user.email,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl,
          settings: user.settings || { defaultTone: 'Professional', autoSummarize: true },
          isOAuthConfigured: isGoogleOAuthConfigured(),
        }
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/auth/logout
   * Clears JWT session cookie
   */
  static async logout(req, res, next) {
    try {
      res.clearCookie('mailpulse_session', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      });

      res.json({
        success: true,
        message: 'Successfully logged out',
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/auth/settings
   * Updates user preferences
   */
  static async updateSettings(req, res, next) {
    try {
      const { defaultTone, autoSummarize } = req.body;
      const updatedUser = mockStore.updateUserSettings({ defaultTone, autoSummarize });

      res.json({
        success: true,
        settings: updatedUser.settings,
      });
    } catch (err) {
      next(err);
    }
  }
}
