import React from 'react';
import { ChevronRight, Home, Terminal } from 'lucide-react';
import { soundEffects } from '../../utils/soundEffects';

interface BreadcrumbHeaderProps {
  pageId: string;
  pageTitle: string;
  sectorCode: string;
  onNavigate: (page: string) => void;
}

/**
 * BreadcrumbHeader Component
 * 
 * Non-technical explanation:
 * Displays a futuristic navigational trail at the top of inner pages.
 * Shows visitors exactly which sector of CIPHER they are browsing and provides
 * a 1-click route back to the primary mainframe.
 */
export const BreadcrumbHeader: React.FC<BreadcrumbHeaderProps> = ({
  pageTitle,
  sectorCode,
  onNavigate,
}) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mx-auto max-w-7xl px-6 lg:px-10 pt-24 pb-2 font-mono text-xs relative z-20"
    >
      <div className="flex flex-wrap items-center gap-2 rounded border border-[#123a17] bg-[#050705]/80 px-4 py-2.5 backdrop-blur-md">
        <button
          type="button"
          onClick={() => {
            soundEffects.playClick();
            onNavigate('home');
          }}
          className="flex items-center gap-1.5 text-[#6fae78] transition-colors hover:text-[#00ff41]"
          data-cursor="lens"
        >
          <Home size={13} className="text-[#00ff41]" />
          <span>MAINFRAME</span>
        </button>

        <ChevronRight size={13} className="text-[#2c7a3a]" />

        <div className="flex items-center gap-1.5 text-[#6fae78]">
          <Terminal size={12} className="text-[#2c7a3a]" />
          <span className="text-[#2c7a3a]">SECTOR_{sectorCode}</span>
        </div>

        <ChevronRight size={13} className="text-[#2c7a3a]" />

        <span className="font-bold text-[#00ff41] text-glow uppercase tracking-wider">
          {pageTitle}
        </span>
      </div>
    </nav>
  );
};
