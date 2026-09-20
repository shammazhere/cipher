import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Terminal, ArrowRight, CornerDownLeft, X, Copy, Check, Shield } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
  onOpenJoin: () => void;
}

interface CommandItem {
  id: string;
  title: string;
  category: string;
  description: string;
  action: () => void;
  shortcut?: string;
}

/**
 * Command Palette (Ctrl+K / Cmd+K Quick Navigator)
 * 
 * Non-technical explanation:
 * A keyboard-driven global quick command interface. Users can press Ctrl+K / Cmd+K
 * anywhere on the site to quickly search and jump to any sector, copy contact info,
 * or open registration modal.
 */
export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenJoin,
}) => {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Command registry
  const commands: CommandItem[] = useMemo(
    () => [
      {
        id: 'nav-home',
        title: 'Sector // 01: Home Mainframe',
        category: 'Navigation',
        description: 'Landing hero, mission statement, and flagship highlights',
        action: () => {
          onNavigate('home');
          onClose();
        },
        shortcut: 'G H',
      },
      {
        id: 'nav-about',
        title: 'Sector // 02: About & Pillars',
        category: 'Navigation',
        description: 'Origins, CSE department mentorship, and core mission pillars',
        action: () => {
          onNavigate('about');
          onClose();
        },
        shortcut: 'G A',
      },
      {
        id: 'nav-events',
        title: 'Sector // 03: Events & Galas',
        category: 'Navigation',
        description: 'Lumiere gala, PromptOps AI competition, and symposium archive',
        action: () => {
          onNavigate('events');
          onClose();
        },
        shortcut: 'G E',
      },
      {
        id: 'nav-team',
        title: 'Sector // 04: Executive Council',
        category: 'Navigation',
        description: 'Student leaders, election charter, and faculty mentors',
        action: () => {
          onNavigate('team');
          onClose();
        },
        shortcut: 'G T',
      },
      {
        id: 'nav-join',
        title: 'Sector // 05: Apply / Contact',
        category: 'Navigation',
        description: 'Student association membership application and contact desk',
        action: () => {
          onNavigate('join');
          onClose();
        },
        shortcut: 'G J',
      },
      {
        id: 'nav-components',
        title: 'Sector // 06: Design System Library',
        category: 'Developer',
        description: 'Interactive component tokens, buttons, cards, and modal previews',
        action: () => {
          onNavigate('components');
          onClose();
        },
        shortcut: 'G C',
      },
      {
        id: 'action-apply',
        title: 'Action: Open Membership Application',
        category: 'Actions',
        description: 'Launch the secured student membership form modal',
        action: () => {
          onClose();
          onOpenJoin();
        },
        shortcut: 'A',
      },
      {
        id: 'action-email',
        title: 'Action: Copy Department Email',
        category: 'Actions',
        description: 'Copies cipher@sjec.ac.in to your clipboard',
        action: () => {
          navigator.clipboard.writeText('cipher@sjec.ac.in');
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        },
        shortcut: 'C',
      },
      {
        id: 'nav-admin',
        title: 'Subsystem: Admin CMS Portal',
        category: 'Administration',
        description: 'Access authorized club position management and content manager',
        action: () => {
          onNavigate('admin');
          onClose();
        },
        shortcut: 'G M',
      },
    ],
    [onNavigate, onClose, onOpenJoin]
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return commands;
    const query = search.toLowerCase();
    return commands.filter(
      (c) =>
        c.title.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        c.category.toLowerCase().includes(query)
    );
  }, [commands, search]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keyboard navigation within list
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].action();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 font-mono">
      {/* Dark backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl rounded-lg border border-[#00ff41]/40 bg-[#080d08] shadow-[0_0_50px_rgba(0,255,65,0.25)] overflow-hidden">
        {/* Search Header */}
        <div className="flex items-center gap-3 border-b border-[#123a17] px-4 py-3 bg-[#050705]">
          <Search size={18} className="text-[#00ff41] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type command, sector name, or action..."
            className="w-full bg-transparent text-sm text-[#c8f7d0] placeholder-[#6fae78]/60 focus:outline-none"
          />
          {copied ? (
            <span className="flex items-center gap-1 text-[11px] text-[#00ff41]">
              <Check size={13} />
              COPIED
            </span>
          ) : (
            <span className="text-[10px] text-[#2c7a3a] border border-[#123a17] px-1.5 py-0.5 rounded">
              ESC TO EXIT
            </span>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close command palette"
            className="text-[#6fae78] hover:text-[#ff5f56] transition-colors p-1"
          >
            <X size={16} />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-[#123a17]/40">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#6fae78]">
              No matching commands or sectors found.
            </div>
          ) : (
            filtered.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full text-left p-3 rounded flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-[#00ff41]/10 border border-[#00ff41]/30'
                      : 'hover:bg-[#0c140c] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Terminal
                      size={14}
                      className={isSelected ? 'text-[#00ff41]' : 'text-[#2c7a3a]'}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-semibold ${
                            isSelected ? 'text-[#00ff41]' : 'text-[#c8f7d0]'
                          }`}
                        >
                          {item.title}
                        </span>
                        <span className="text-[9px] uppercase tracking-wider text-[#6fae78]/70 border border-[#123a17] px-1 rounded">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6fae78] mt-0.5 line-clamp-1">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.shortcut && (
                      <span className="text-[10px] text-[#2c7a3a] font-mono border border-[#123a17] px-1.5 py-0.5 rounded">
                        {item.shortcut}
                      </span>
                    )}
                    {isSelected && (
                      <CornerDownLeft size={14} className="text-[#00ff41]" />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="border-t border-[#123a17] px-4 py-2 bg-[#050705] flex items-center justify-between text-[10px] text-[#2c7a3a]">
          <span>CIPHER QUICK COMMAND GATEWAY</span>
          <div className="flex items-center gap-3">
            <span>&uarr;&darr; NAVIGATE</span>
            <span>&crarr; SELECT</span>
            <span>ESC CLOSE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
