import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { logger } from '../utils/logger.js';
import { mockStore } from './mockDataService.js';
dotenv.config();

let geminiClient = null;

function getGemini() {
  if (!geminiClient && process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('your_gemini')) {
    geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return geminiClient;
}

async function callGemini(systemPrompt, userPrompt, jsonMode = false) {
  const genAI = getGemini();
  if (!genAI) return null;

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: systemPrompt,
    generationConfig: jsonMode
      ? { responseMimeType: 'application/json', temperature: 0.1 }
      : { temperature: 0.7 },
  });

  const result = await model.generateContent(userPrompt);
  return result.response.text();
}

export class LLMService {
  /**
   * Summarizes email thread body or payload
   */
  static async summarize({ text, subject, sender, messageId }) {
    const systemPrompt =
      'You are MailPulse AI, an executive email assistant. Generate an ultra-concise TL;DR summary (1-3 sentences) and assign a priority level. Return valid JSON only: {"summary": "...", "priority": "High"|"Medium"|"Low"}';

    const userPrompt = `Subject: ${subject}\nSender: ${sender}\nBody:\n${text?.slice(0, 4000)}`;

    // Rule-based fallback
    const fallback = () => {
      const lc = (text || '').toLowerCase();
      const priority =
        lc.includes('urgent') || lc.includes('asap') || lc.includes('series a') || lc.includes('deadline')
          ? 'High'
          : lc.includes('follow up') || lc.includes('reminder')
          ? 'Medium'
          : 'Low';
      const summary = `Key Takeaway: ${subject}. From ${sender || 'Sender'}. Covers key deliverables and coordination requirements.`;
      if (messageId) mockStore.saveAiAnalysis(messageId, { summary, priority });
      return { summary, priority };
    };

    try {
      const raw = await callGemini(systemPrompt, userPrompt, true);
      if (!raw) return fallback();

      const parsed = JSON.parse(raw);
      if (messageId) mockStore.saveAiAnalysis(messageId, parsed);
      return parsed;
    } catch (err) {
      logger.warn('Gemini summarize fallback:', err.message);
      return fallback();
    }
  }

  /**
   * Generates contextual reply based on tone: Professional, Friendly, Formal, Concise
   */
  static async generateReply({ threadContext, instructions, tone = 'Professional', senderName = 'Sender' }) {
    const tonePrompts = {
      Professional: 'Polite, clear, actionable, and executive-ready.',
      Friendly: 'Warm, personable, enthusiastic, and conversational with supportive phrasing.',
      Formal: 'Strictly professional, elegant, structured, respectful, and traditional.',
      Concise: 'Direct, extremely brief, bulleted if needed, minimal fluff, straight to the action.',
    };

    const toneGuide = tonePrompts[tone] || tonePrompts.Professional;

    const mockReplies = {
      Professional: `Hi ${senderName},\n\nThank you for your message. I have reviewed the details and agree with the proposed approach. Let us proceed with the next steps accordingly.\n\nBest regards,\nAlex`,
      Friendly: `Hey ${senderName}!\n\nThanks so much for reaching out! Everything looks great on my end — really excited to make progress together.\n\nTalk soon,\nAlex`,
      Formal: `Dear ${senderName},\n\nI acknowledge receipt of your correspondence regarding this matter. We have noted the specifications and shall proceed in alignment with the established timeline.\n\nSincerely,\nAlex Morgan`,
      Concise: `Hi ${senderName},\n\nReceived and approved. Proceeding as planned.\n\nThanks,\nAlex`,
    };

    const systemPrompt = `You are MailPulse AI Reply Engine. Draft a direct, ready-to-send reply to the email thread.
Tone: ${tone} — ${toneGuide}
Rules:
- Do NOT include subject line or angle-bracket placeholders like [Your Name].
- Sign off as Alex.
- Write only the reply body, nothing else.`;

    const userPrompt = `Thread Context:\n${threadContext?.slice(0, 3000)}\n\nAdditional Instructions:\n${instructions || 'Acknowledge and agree with next steps.'}`;

    try {
      const raw = await callGemini(systemPrompt, userPrompt, false);
      if (!raw) {
        const reply = mockReplies[tone] || mockReplies.Professional;
        return { reply: instructions ? `${reply}\n\n[Note: ${instructions}]` : reply, tone };
      }
      return { reply: raw.trim(), tone };
    } catch (err) {
      logger.warn('Gemini generateReply fallback:', err.message);
      const reply = mockReplies[tone] || mockReplies.Professional;
      const finalReply = instructions ? `${reply}\n\n[Action taken: ${instructions}]` : reply;
      return { reply: finalReply, tone };
    }
  }

  /**
   * Produces layman breakdown of confusing, technical, or legal emails
   */
  static async explainEmail({ subject, text }) {
    const systemPrompt =
      'You are an expert at translating complex jargon. Explain this email in plain English (5th-grade level) for a non-technical reader. Highlight what is actually being asked and why it matters.';

    const userPrompt = `Subject: ${subject}\n\nEmail Content:\n${text?.slice(0, 4000)}`;

    try {
      const raw = await callGemini(systemPrompt, userPrompt, false);
      if (!raw) {
        return {
          explanation: `In simple terms: This email about "${subject}" is asking for your input or agreement on the key points described. No hidden obligations.`,
        };
      }
      return { explanation: raw.trim() };
    } catch (err) {
      logger.warn('Gemini explainEmail fallback:', err.message);
      return {
        explanation: `Layman breakdown: The sender is confirming schedule details regarding "${subject}".`,
      };
    }
  }

  /**
   * Extracts action items, deadlines (ISO dates), and obligations into structured JSON
   */
  static async extractInsights({ subject, text, messageId }) {
    const systemPrompt =
      'Extract all explicit action items, deliverables, and specific deadlines from this email. Return valid JSON only: {"actionItems": ["task 1", ...], "deadlines": ["YYYY-MM-DDTHH:mm:ssZ", ...], "obligations": ["obligation 1", ...]}';

    const userPrompt = `Subject: ${subject}\n\nEmail Content:\n${text?.slice(0, 4000)}`;

    const fallback = () => {
      const defaultInsights = {
        actionItems: ['Review attached materials and terms', 'Confirm scheduling availability for follow-up sync'],
        deadlines: [new Date(Date.now() + 86400000 * 3).toISOString()],
        obligations: ['Feedback required before end of week'],
      };
      if (messageId) {
        mockStore.saveAiAnalysis(messageId, {
          actionItems: defaultInsights.actionItems,
          deadlines: defaultInsights.deadlines.map((d) => new Date(d)),
        });
      }
      return defaultInsights;
    };

    try {
      const raw = await callGemini(systemPrompt, userPrompt, true);
      if (!raw) return fallback();

      const parsed = JSON.parse(raw);
      if (messageId) {
        mockStore.saveAiAnalysis(messageId, {
          actionItems: parsed.actionItems || [],
          deadlines: (parsed.deadlines || []).map((d) => new Date(d)),
        });
      }
      return parsed;
    } catch (err) {
      logger.warn('Gemini extractInsights fallback:', err.message);
      return fallback();
    }
  }
}
