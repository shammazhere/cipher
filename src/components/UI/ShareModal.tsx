import React, { useState } from 'react';
import { Share2, Copy, Check, X, Linkedin, MessageSquare } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { soundEffects } from '../../utils/soundEffects';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * ShareModal Component
 * 
 * Non-technical explanation:
 * Allows evaluation judges and visitors to share the CIPHER portal across platforms,
 * or copy direct shareable deep links to the clipboard.
 */
export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://cipher-sjec.vercel.app/';
  const shareTitle = 'CIPHER — Student Association of CSE | SJEC';
  const shareText = 'Explore CIPHER, the official Computer Science & Engineering student association portal at St Joseph Engineering College, Mangaluru.';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    soundEffects.playSuccess();
    showToast({
      title: 'LINK COPIED TO CLIPBOARD',
      message: 'Direct portal URL successfully copied.',
      type: 'success',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: currentUrl,
        });
        showToast({
          title: 'SHARED SUCCESSFULLY',
          type: 'success',
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${currentUrl}`)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-mono">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={() => {
          soundEffects.playClick();
          onClose();
        }}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md rounded-lg border border-[#00ff41]/40 bg-[#080d08] p-6 shadow-[0_0_40px_rgba(0,255,65,0.2)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#123a17] pb-3 mb-5">
          <div className="flex items-center gap-2 text-[#00ff41]">
            <Share2 size={16} />
            <h3 className="text-sm font-bold uppercase tracking-widest">
              // BROADCAST_SECTOR_LINK
            </h3>
          </div>
          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            className="text-[#6fae78] hover:text-[#00ff41] p-1 transition-colors"
            aria-label="Close share dialog"
          >
            <X size={16} />
          </button>
        </div>

        {/* Copy Link Input Bar */}
        <div className="space-y-4 text-xs">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-[#6fae78] block mb-1.5">
              // TARGET_CANONICAL_URI
            </label>
            <div className="flex items-center rounded border border-[#123a17] bg-[#050705] p-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="w-full bg-transparent text-[#c8f7d0] text-xs focus:outline-none select-all"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="ml-2 flex items-center gap-1 px-2.5 py-1 rounded bg-[#00ff41] text-[#050705] font-bold text-[11px] hover:bg-[#00ff66] transition-colors shrink-0"
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                <span>{copied ? 'COPIED' : 'COPY'}</span>
              </button>
            </div>
          </div>

          {/* Direct Social Channels */}
          <div>
            <label className="text-[10px] uppercase tracking-widest text-[#6fae78] block mb-2">
              // EXTERNAL_COMMUNICATION_CHANNELS
            </label>
            <div className="grid grid-cols-3 gap-2">
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundEffects.playClick()}
                className="flex flex-col items-center justify-center p-3 rounded border border-[#123a17] bg-[#050705] hover:border-[#00ff41] text-[#6fae78] hover:text-[#00ff41] transition-all group"
              >
                <span className="font-bold text-xs group-hover:text-[#00ff41]">X / Post</span>
              </a>

              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundEffects.playClick()}
                className="flex flex-col items-center justify-center p-3 rounded border border-[#123a17] bg-[#050705] hover:border-[#00ff41] text-[#6fae78] hover:text-[#00ff41] transition-all group"
              >
                <Linkedin size={16} className="mb-1 text-[#2c7a3a] group-hover:text-[#00ff41]" />
                <span className="text-[11px]">LinkedIn</span>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundEffects.playClick()}
                className="flex flex-col items-center justify-center p-3 rounded border border-[#123a17] bg-[#050705] hover:border-[#00ff41] text-[#6fae78] hover:text-[#00ff41] transition-all group"
              >
                <MessageSquare size={16} className="mb-1 text-[#2c7a3a] group-hover:text-[#00ff41]" />
                <span className="text-[11px]">WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Native Web Share Button if Supported */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              type="button"
              onClick={handleNativeShare}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded border border-[#00ff41]/40 bg-[#00ff41]/10 text-[#00ff41] font-semibold text-xs hover:bg-[#00ff41] hover:text-[#050705] transition-all"
            >
              <Share2 size={14} />
              <span>Native System Share</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
