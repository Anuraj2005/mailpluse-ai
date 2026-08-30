export default function PrivacyPolicy() {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', lineHeight: 1.7, color: '#e2e8f0' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#f8fafc' }}>Privacy Policy for MailPulse AI</h1>
      <p style={{ marginBottom: '1rem', color: '#cbd5e1' }}>Last updated: August 2026</p>

      <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', color: '#f8fafc' }}>1. Information We Collect</h2>
      <p>
        MailPulse AI accesses your Google account information and Gmail messages only after receiving your explicit
        permission via Google OAuth 2.0. We request the minimum necessary access to provide core app features such as
        inbox summaries, reply generation, deadline extraction, and secure Gmail operations.
      </p>

      <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', color: '#f8fafc' }}>2. How We Use Google User Data</h2>
      <p>
        Your email data is processed to generate AI summaries, identify key action items, extract deadlines, explain
        complex email content in plain language, and draft contextual replies. We use Google OAuth to authenticate the
        user and access Gmail data only for the feature set explicitly requested in the app.
      </p>

      <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', color: '#f8fafc' }}>3. Token Security</h2>
      <p>
        Google access tokens and refresh tokens are stored securely using AES-256-GCM encryption. We do not store raw
        passwords, and we do not expose OAuth credentials to the frontend client.
      </p>

      <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', color: '#f8fafc' }}>4. Data Sharing & Retention</h2>
      <p>
        We do not sell, rent, or share your personal email data with third parties for marketing purposes. Email content
        may be processed temporarily for AI-powered features and is not used to train public models without explicit notice.
      </p>

      <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', color: '#f8fafc' }}>5. Your Rights</h2>
      <p>
        You may revoke the app’s access to your Google account at any time from your Google Account settings. You may also
        log out of MailPulse AI at any time to end your active session.
      </p>

      <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', color: '#f8fafc' }}>6. Contact Us</h2>
      <p>
        For questions regarding your data, privacy practices, or account access, contact support@mailpulse.ai.
      </p>
    </div>
  );
}
