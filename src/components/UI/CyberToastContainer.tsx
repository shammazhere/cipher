import React from 'react';
import { CheckCircle2, AlertCircle, Info, ShieldAlert, X } from 'lucide-react';
import { useToast, ToastType } from '../../context/ToastContext';

/**
 * CyberToastContainer Component
 * 
 * Non-technical explanation:
 * High-tech floating notification stack in the top right. Notifies users of actions
 * such as copied links, audio settings, form results, and system broadcasts.
 */
export const CyberToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  const getBorderColor = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'border-[#00ff41]/50 shadow-[0_0_25px_rgba(0,255,65,0.2)]';
      case 'error':
        return 'border-[#ff5f56]/50 shadow-[0_0_25px_rgba(255,95,86,0.2)]';
      case 'warning':
        return 'border-amber-400/50 shadow-[0_0_25px_rgba(251,191,36,0.2)]';
      default:
        return 'border-[#123a17] shadow-[0_0_20px_rgba(0,255,65,0.1)]';
    }
  };

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={16} className="text-[#00ff41] shrink-0" />;
      case 'error':
        return <ShieldAlert size={16} className="text-[#ff5f56] shrink-0" />;
      case 'warning':
        return <AlertCircle size={16} className="text-amber-400 shrink-0" />;
      default:
        return <Info size={16} className="text-[#00ff41] shrink-0" />;
    }
  };

  const getBadgeText = (type: ToastType) => {
    switch (type) {
      case 'success':
        return '// SYSTEM_OK // 0x200';
      case 'error':
        return '// ERR_ALERT // 0x500';
      case 'warning':
        return '// WARN_NOTICE // 0x300';
      default:
        return '// BROADCAST // 0x100';
    }
  };

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed top-24 right-4 sm:right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none font-mono"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto w-full rounded border bg-[#080d08]/95 p-3.5 backdrop-blur-md transition-all duration-300 transform translate-y-0 opacity-100 ${getBorderColor(
            toast.type
          )}`}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-[#123a17] pb-1.5 mb-2">
            <span className="text-[10px] uppercase tracking-widest text-[#6fae78]">
              {getBadgeText(toast.type)}
            </span>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-[#6fae78] hover:text-[#00ff41] p-0.5 transition-colors"
              aria-label="Dismiss notification"
            >
              <X size={12} />
            </button>
          </div>

          {/* Body */}
          <div className="flex items-start gap-2.5">
            {getIcon(toast.type)}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-[#c8f7d0] leading-tight">
                {toast.title}
              </h4>
              {toast.message && (
                <p className="text-[11px] text-[#6fae78] mt-1 leading-normal break-words">
                  {toast.message}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
