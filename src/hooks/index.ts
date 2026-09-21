/**
 * Custom Hooks Index
 * 
 * Central export of all modular React hooks:
 * - useTrailingCursor: Smooth physics-driven custom mouse cursor with trailing circle
 * - usePageSEO: Dynamic route-based metadata, title, and social card synchronization
 * - useSecureForm: Fortress-grade form state with XSS sanitization and anti-bot honeypot
 * - useInViewAnimation: Performance optimization hook using IntersectionObserver and tab visibility
 * - useAdminCMS: In-browser Content Management System logic with one-click JSON export/import
 */

export * from './usePageSEO';
export * from './useAdminCMS';
export * from './useAdminAuth';
export * from './useSmoothScroll';
