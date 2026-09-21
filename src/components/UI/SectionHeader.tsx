import React from 'react';
import { TextScramble } from './TextScramble';

/**
 * SectionHeader Component
 * 
 * Non-technical explanation:
 * Section header component matching `ab` in the reference site:
 * - Category indicator: `// {label}` in glowing Matrix green.
 * - Bold display heading with Matrix scramble letter decryption effect.
 */

interface SectionHeaderProps {
  label: string;
  title: string;
  className?: string;
  titleClassName?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  label,
  title,
  className = '',
  titleClassName = 'font-display text-3xl leading-tight text-foreground text-glow sm:text-4xl md:text-5xl',
}) => {
  return (
    <div className={className}>
      <div className="mb-3 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.35em] text-[var(--matrix)]">
        <span className="text-glow">//</span>
        <span>{label}</span>
      </div>
      <TextScramble as="h2" text={title} className={titleClassName} />
    </div>
  );
};
