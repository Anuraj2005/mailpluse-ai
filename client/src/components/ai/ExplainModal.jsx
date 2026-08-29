import React, { useState, useEffect } from 'react';
import { HelpCircle, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { aiApi } from '../../lib/api';
import { useMailStore } from '../../store/useMailStore';

export function ExplainModal() {
  const { isExplainModalOpen, closeExplainModal, explainTargetEmail } = useMailStore();
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isExplainModalOpen && explainTargetEmail) {
      if (explainTargetEmail.aiAnalysis?.explained) {
        setExplanation(explainTargetEmail.aiAnalysis.explained);
      } else {
        handleExplain();
      }
    }
  }, [isExplainModalOpen, explainTargetEmail]);

  const handleExplain = async () => {
    if (!explainTargetEmail) return;
    setIsLoading(true);
    try {
      const res = await aiApi.explain({
        subject: explainTargetEmail.subject,
        text: explainTargetEmail.bodyText || explainTargetEmail.snippet,
      });
      setExplanation(res.data?.explanation || 'No explanation generated.');
    } catch (err) {
      console.error(err);
      setExplanation('Could not generate breakdown at this time.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isExplainModalOpen}
      onClose={closeExplainModal}
      title={
        <div className="flex items-center gap-2 text-cyan-400">
          <HelpCircle className="w-5 h-5" />
          <span>Explain This Email in Plain English</span>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
          <p className="text-xs text-slate-400 font-medium mb-1">Target Subject:</p>
          <p className="text-sm font-semibold text-slate-100">{explainTargetEmail?.subject}</p>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/30 to-indigo-950/30 border border-cyan-500/30 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Layman & Practical Breakdown</span>
          </div>

          {isLoading ? (
            <div className="py-6 flex flex-col items-center justify-center gap-2 text-slate-400 text-xs">
              <svg className="animate-spin h-6 w-6 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Translating technical & legal jargon into plain English...</span>
            </div>
          ) : (
            <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
              {explanation}
            </p>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="secondary" size="sm" onClick={closeExplainModal}>
            Got it, close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
