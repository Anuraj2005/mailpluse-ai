import { GmailService } from '../services/gmailService.js';

export class EmailController {
  /**
   * GET /api/v1/emails
   * List synced email threads with pagination (page, limit, label, search)
   */
  static async listEmails(req, res, next) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required.',
        });
      }

      const { page = 1, limit = 20, label, search, isStarred, isRead } = req.query;
      const userId = req.user._id;

      const starredBool = isStarred !== undefined ? isStarred === 'true' : undefined;
      const readBool = isRead !== undefined ? isRead === 'true' : undefined;

      const result = await GmailService.listEmails(userId, {
        page: Number(page),
        limit: Number(limit),
        label,
        search,
        isStarred: starredBool,
        isRead: readBool,
      });

      res.json({
        success: true,
        data: result.emails,
        pagination: result.pagination,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/emails/:threadId
   * Retrieve full message contents and metadata for a specific thread
   */
  static async getThread(req, res, next) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required.',
        });
      }

      const { threadId } = req.params;
      const userId = req.user._id;

      const thread = await GmailService.getThread(userId, threadId);

      if (!thread) {
        return res.status(404).json({
          success: false,
          message: 'Email thread not found',
        });
      }

      res.json({
        success: true,
        data: thread,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /api/v1/emails/:messageId/modify
   * Update label states (Read, Star, Archive, Trash)
   */
  static async modifyEmail(req, res, next) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required.',
        });
      }

      const { messageId } = req.params;
      const { isRead, isStarred, addLabels, removeLabels } = req.body;
      const userId = req.user._id;

      const result = await GmailService.modifyEmail(userId, messageId, {
        isRead,
        isStarred,
        addLabels,
        removeLabels,
      });

      res.json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/emails/send
   * Send new outbound email or reply via Gmail API
   */
  static async sendEmail(req, res, next) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required.',
        });
      }

      const { to, subject, body, threadId } = req.body;

      if (!to || !body) {
        return res.status(400).json({
          success: false,
          message: 'Recipient (to) and email body are required.',
        });
      }

      const userId = req.user._id;
      const sentEmail = await GmailService.sendEmail(userId, {
        to,
        subject,
        body,
        threadId,
      });

      res.status(201).json({
        success: true,
        message: 'Email successfully dispatched.',
        data: sentEmail,
      });
    } catch (err) {
      next(err);
    }
  }
}
