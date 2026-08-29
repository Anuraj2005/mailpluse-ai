import { LLMService } from '../services/llmService.js';
import { GmailService } from '../services/gmailService.js';

export class AIController {
  /**
   * POST /api/v1/ai/summarize
   * Generate concise summary from body payload or thread ID
   */
  static async summarize(req, res, next) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required.',
        });
      }

      const { text, subject, sender, threadId, messageId } = req.body;
      const userId = req.user._id;

      let contentToSummarize = text;
      let emailSubject = subject;
      let emailSender = sender;

      if (threadId && !contentToSummarize) {
        const thread = await GmailService.getThread(userId, threadId);
        if (thread) {
          contentToSummarize = thread.bodyText || thread.snippet;
          emailSubject = thread.subject;
          emailSender = thread.sender?.name;
        }
      }

      const result = await LLMService.summarize({
        text: contentToSummarize || 'No content provided',
        subject: emailSubject || 'Email Thread',
        sender: emailSender || 'Sender',
        messageId,
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
   * POST /api/v1/ai/generate-reply
   * Synthesize contextual email response based on thread context and selected tone
   */
  static async generateReply(req, res, next) {
    try {
      const { threadContext, instructions, tone = 'Professional', senderName } = req.body;

      const result = await LLMService.generateReply({
        threadContext: threadContext || 'Regarding previous discussion.',
        instructions,
        tone,
        senderName: senderName || 'Colleague',
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
   * POST /api/v1/ai/explain
   * Produce layman breakdown for legal or technical email text
   */
  static async explain(req, res, next) {
    try {
      const { subject, text } = req.body;

      const result = await LLMService.explainEmail({
        subject: subject || 'Notice',
        text: text || '',
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
   * POST /api/v1/ai/extract-insights
   * Parse text to extract key dates, obligations, and action items
   */
  static async extractInsights(req, res, next) {
    try {
      const { subject, text, messageId } = req.body;

      const result = await LLMService.extractInsights({
        subject: subject || 'Task Review',
        text: text || '',
        messageId,
      });

      res.json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}
