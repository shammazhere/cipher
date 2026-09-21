import React, { useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * Magnetic Button Component
 * 
 * Non-technical explanation:
 * Interactive cyber button that magnetically pulls slightly towards the user's cursor
 * when hovered, giving an tactile, high-tech tactile feel. Supports solid green
 * and green-bordered outline variants with spring tap physics.
 */

interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  variant?: 'solid' | 'outline';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  href,
  onClick,
  variant = 'solid',
  className = '',
  type = 'button',
}) => {
  const buttonRef = useRef<HTMLAnchorElement & HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = buttonRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate(${0.25 * dx}px, ${0.35 * dy}px)`;
  };

  const handleMouseLeave = () => {
    const el = buttonRef.current;
    if (el) {
      el.style.transform = 'translate(0px, 0px)';
    }
  };

  const baseClass =
    'relative inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 font-mono text-sm font-medium uppercase tracking-wider transition-[background-color,color,box-shadow] duration-200 will-change-transform';

  const variantClass =
    variant === 'solid'
      ? 'bg-[var(--matrix)] text-[#030503] box-glow hover:box-glow-hover'
      : 'border border-[var(--matrix)] text-[var(--matrix)] hover:bg-[rgba(0,255,65,0.08)] box-glow';

  const content = (
    <motion.span className="inline-flex items-center gap-2" whileTap={{ scale: 0.96 }}>
      {children}
    </motion.span>
  );

  if (href) {
    return (
      <a
        ref={buttonRef}
        href={href}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`${baseClass} ${variantClass} ${className}`}
        data-cursor="lens"
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={buttonRef}
      type={type}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`${baseClass} ${variantClass} ${className}`}
      data-cursor="lens"
    >
      {content}
    </button>
  );
};
