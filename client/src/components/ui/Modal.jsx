import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className={`relative z-10 w-full ${maxWidth} glass-panel max-h-[92vh] overflow-hidden rounded-t-2xl border border-slate-700/60 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-2xl animate-scaleUp sm:max-h-none sm:rounded-2xl sm:p-6`}>
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="max-h-[78vh] overflow-y-auto pr-1 sm:max-h-[80vh]">
          {children}
        </div>
      </div>
    </div>
  );
}
