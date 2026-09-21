import React, { useEffect } from 'react';
import { Keyboard, X, Command, Volume2, Compass, CornerDownLeft } from 'lucide-react';
import { soundEffects } from '../../utils/soundEffects';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleSound: () => void;
  soundMuted: boolean;
}

/**
 * KeyboardShortcutsModal Component
 * 
 * Non-technical explanation:
 * Pops up when the visitor presses '?' on their keyboard. Displays a tactical cheat sheet
 * of all available keyboard shortcuts for power-user navigation.
 */
export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
  onToggleSound,
  soundMuted,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcutGroups = [
    {
      category: 'GLOBAL_COMMANDS',
      shortcuts: [
        { key: '⌘K / Ctrl+K', desc: 'Open Command Palette' },
        { key: '?', desc: 'Toggle this Shortcuts Guide' },
        { key: 'M', desc: `Toggle Audio FX (${soundMuted ? 'Muted' : 'Active'})` },
        { key: 'ESC', desc: 'Dismiss active modal or palette' },
      ],
    },
    {
      category: 'DIRECT_SECTOR_NAVIGATION',
      shortcuts: [
        { key: '1  or  G H', desc: 'Jump to Sector 01: Home Mainframe' },
        { key: '2  or  G A', desc: 'Jump to Sector 02: About CIPHER' },
        { key: '3  or  G E', desc: 'Jump to Sector 03: Events & Gala' },
        { key: '4  or  G T', desc: 'Jump to Sector 04: Executive Team' },
        { key: '5  or  G J', desc: 'Jump to Sector 05: Apply / Join' },
        { key: '6  or  G C', desc: 'Jump to Sector 06: Component Library' },
      ],
    },
  ];

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
      <div className="relative w-full max-w-xl rounded-lg border border-[#00ff41]/50 bg-[#080d08] p-6 shadow-[0_0_50px_rgba(0,255,65,0.2)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#123a17] pb-3 mb-5">
          <div className="flex items-center gap-2 text-[#00ff41]">
            <Keyboard size={18} />
            <h3 className="text-sm font-bold uppercase tracking-widest">
              // TACTICAL_KEYBOARD_SHORTCUTS
            </h3>
          </div>
          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            className="text-[#6fae78] hover:text-[#00ff41] p-1 transition-colors"
            aria-label="Close shortcuts dialog"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-5 text-xs">
          {shortcutGroups.map((group) => (
            <div key={group.category} className="space-y-2">
              <span className="text-[10px] uppercase tracking-widest text-[#6fae78] font-semibold">
                // {group.category}
              </span>
              <div className="grid grid-cols-1 gap-2">
                {group.shortcuts.map((s) => (
                  <div
                    key={s.key}
                    className="flex items-center justify-between rounded border border-[#123a17] bg-[#050705] p-2.5"
                  >
                    <span className="text-[#c8f7d0]">{s.desc}</span>
                    <kbd className="rounded border border-[#00ff41]/30 bg-[#00ff41]/10 px-2 py-0.5 text-[11px] font-bold text-[#00ff41] shadow-[0_0_8px_rgba(0,255,65,0.2)]">
                      {s.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Audio Toggle Bar */}
        <div className="mt-6 flex items-center justify-between border-t border-[#123a17] pt-4 text-xs">
          <button
            type="button"
            onClick={() => {
              onToggleSound();
            }}
            className="flex items-center gap-2 rounded border border-[#123a17] bg-[#050705] px-3 py-1.5 text-[#6fae78] hover:border-[#00ff41] hover:text-[#00ff41] transition-colors"
          >
            <Volume2 size={14} className={!soundMuted ? 'text-[#00ff41]' : ''} />
            <span>Sound FX: {soundMuted ? 'MUTED' : 'ENABLED'}</span>
          </button>
          <span className="text-[10px] text-[#2c7a3a]">
            PRESS &apos;?&apos; TO DISMISS
          </span>
        </div>
      </div>
    </div>
  );
};
