import React, { useState } from 'react';
import { 
  Zap, 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Clock, 
  FileText, 
  Mail,
  ChevronRight,
  Star
} from 'lucide-react';
import { Button } from '../ui/Button';
import { authApi } from '../../lib/api';
import { useMailStore } from '../../store/useMailStore';

export function LandingPage() {
  const { setUser } = useMailStore();
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  const [configNotice, setConfigNotice] = useState('');

  const handleLogin = async (isDemo = false) => {
    setIsLoadingAuth(true);
    setConfigNotice('');
    try {
      if (isDemo) {
        const res = await authApi.loginDemo();
        if (res.user) {
          setUser(res.user);
        }
        return;
      }

      const res = await authApi.getGoogleUrl();
      if (res.isOAuthConfigured && res.url) {
        window.location.href = res.url;
      } else {
        setConfigNotice('Google OAuth credentials are not set in server/.env yet. Please save your GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in server/.env, or click "Explore Live Demo" below to test.');
      }
    } catch (err) {
      console.error(err);
      const res = await authApi.loginDemo();
      if (res.user) setUser(res.user);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const features = [
    {
      title: 'AI Thread Summarization',
      desc: 'Instant 1-click TL;DR summaries and priority detection extracting core message intent and urgency.',
      icon: Sparkles,
      gradient: 'from-violet-500 to-indigo-500',
    },
    {
      title: 'Contextual Tone-Shift Replies',
      desc: 'Draft bespoke replies in seconds with dynamic tone switching (Professional, Friendly, Formal, Concise).',
      icon: Zap,
      gradient: 'from-cyan-500 to-blue-500',
    },
    {
      title: 'Action Item & Deadline Extraction',
      desc: 'Automatically parses email bodies into structured task badges and ISO-formatted deadline alerts.',
      icon: CheckCircle2,
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      title: 'Explain This Email',
      desc: 'Produces layman breakdowns of dense legal, technical, or confusing emails in simple 5th-grade English.',
      icon: FileText,
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      title: 'AES-256-GCM Token Encryption',
      desc: 'Google OAuth access & refresh tokens are encrypted at rest with zero password retention.',
      icon: Lock,
      gradient: 'from-rose-500 to-pink-500',
    },
    {
      title: 'Semantic Smart Search',
      desc: 'Find any email thread using natural language queries powered by vector similarity search.',
      icon: Layers,
      gradient: 'from-sky-500 to-cyan-500',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Background glowing gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-violet-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Navigation Header */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-950/60 ring-1 ring-cyan-400/40">
            <Zap className="w-6 h-6 text-white fill-white" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              MailPulse <span className="text-xs px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-400 font-semibold border border-cyan-500/30">AI</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleLogin(true)}
          >
            Explore Live Demo
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleLogin(false)}
            isLoading={isLoadingAuth}
          >
            <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Sign in with Google</span>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12 text-center space-y-8 flex-1 flex flex-col justify-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mx-auto backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Next-Gen Executive Email Management</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-100 max-w-4xl mx-auto leading-tight">
          Supercharge your inbox with <span className="text-gradient">Intelligent AI Automation</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Auto-summarize long threads, draft contextual replies with customizable tones, extract actionable deadlines, and achieve Inbox Zero with zero hassle.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => handleLogin(false)}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-7 py-3.5 rounded-2xl bg-white text-slate-900 font-bold text-sm shadow-xl hover:bg-slate-100 transition-all duration-200 active:scale-95"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Connect Gmail with Google OAuth</span>
          </button>

          <Button
            variant="secondary"
            size="lg"
            onClick={() => handleLogin(true)}
            className="w-full sm:w-auto"
          >
            <span>Launch Workspace Demo</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {configNotice && (
          <div className="p-4 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs max-w-xl mx-auto text-left leading-relaxed">
            <p className="font-semibold text-amber-300 mb-1">⚠️ Setup Notice:</p>
            <p>{configNotice}</p>
          </div>
        )}

        {/* Security Highlights Banner */}
        <div className="pt-8 flex items-center justify-center gap-6 text-xs text-slate-400 flex-wrap">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Zero Password Storage</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span>AES-256-GCM Encrypted Tokens</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-violet-400" />
            <span>HTTP-Only Secure Sessions</span>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-12 text-left">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div key={idx} className="p-6 rounded-2xl glass-panel border border-slate-800/90 space-y-3 glass-card-hover">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-white shadow-md`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-100">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>© 2026 MailPulse AI. Built with Next.js/React, Express.js, MongoDB Atlas, and OpenAI.</p>
      </footer>
    </div>
  );
}
